import assert from "node:assert/strict";
import { mkdtemp, mkdir, writeFile, readFile, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { budgetStatus, pageBudget, siteBudgets } from "../scripts/page-budgets.js";

async function fixture(t, files) {
  const root = await mkdtemp(path.join(tmpdir(), "starbase430-accounting-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  for (const [file, contents] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(root, file)), { recursive: true });
    await writeFile(path.join(root, file), contents);
  }
  return root;
}

test("decimal thresholds are inclusive and warnings do not fail", () => {
  for (const [bytes, expected] of [[99_999, "PASS"], [100_000, "PASS"], [100_001, "WARN"], [512_000, "WARN"], [512_001, "FAIL"]]) assert.equal(budgetStatus(bytes), expected);
});

test("whole-page bytes include responsive variants, recursive CSS, inline styles and deduplicate per page", async (t) => {
  const files = {
    "nested/index.html": `<link rel="stylesheet" href="/css/main.css"><style>.a{background:url('/a.png')}</style>
      <picture><source srcset="/a.png 1x, /b.png 2x"><img src="/b.png?cache=1#x" srcset="/a.png 320w, /b.png 640w"></picture>
      <img src="../a.png"><div style="background:url('/a.png')"></div><img src="/a&amp;b.png">
      <a href="/large.zip" download>Optional</a><a href="/absent.pdf">Optional PDF</a>é`,
    "css/main.css": '@import "theme"; @import url("cycle.css"); @media print { .x { background: url(../b.png) } }',
    "css/theme": '@font-face{src:url(../font.woff2)}',
    "css/cycle.css": '@import "main.css";',
    "a.png": Buffer.alloc(11), "b.png": Buffer.alloc(21), "a&b.png": Buffer.alloc(7),
    "font.woff2": Buffer.alloc(31), "large.zip": Buffer.alloc(600_000)
  };
  const root = await fixture(t, files);
  const result = await pageBudget(root, "nested/index.html");
  assert.deepEqual(result.issues, []);
  assert.equal(result.bytes, Object.entries(files).filter(([name]) => name !== "large.zip").reduce((sum, [, data]) => sum + Buffer.byteLength(data), 0));
  assert.deepEqual(result.downloads, ["/absent.pdf", "/large.zip"]);
  assert.equal(result.status, "PASS");
  await writeFile(path.join(root, "second.html"), '<img src="/a.png">');
  assert.equal((await siteBudgets(root))[1].bytes, Buffer.byteLength('<img src="/a.png">') + 11);
});

test("actual page totals enforce both thresholds", async (t) => {
  const root = await fixture(t, { "index.html": "x".repeat(100_001) });
  assert.equal((await pageBudget(root, "index.html")).status, "WARN");
  await writeFile(path.join(root, "index.html"), "x".repeat(512_001));
  assert.equal((await pageBudget(root, "index.html")).status, "FAIL");
});

test("favicon alternatives and Apple touch icons are counted, and changed SVGs fail closed", async (t) => {
  const svg = await readFile(new URL("../src/assets/icons/favicon.svg", import.meta.url));
  const html = '<link rel="icon" href="/favicon.ico"><link rel="icon" href="/assets/icons/favicon.svg"><link rel="apple-touch-icon" href="/touch.png">';
  const root = await fixture(t, { "index.html": html, "favicon.ico": Buffer.alloc(10), "assets/icons/favicon.svg": svg, "touch.png": Buffer.alloc(20) });
  const result = await pageBudget(root, "index.html");
  assert.deepEqual(result.issues, []);
  assert.equal(result.bytes, Buffer.byteLength(html) + svg.length + 30);
  await writeFile(path.join(root, "assets/icons/favicon.svg"), `${svg}<script/>`);
  assert.equal((await pageBudget(root, "index.html")).status, "FAIL");
});

test("missing, external, unsafe and unsupported dependencies fail closed", async (t) => {
  for (const html of [
    '<img src="/missing.png">', '<img src="https://example.com/a.png">', '<img src="//example.com/a.png">',
    '<img src="">', '<img src="/%ZZ.png">', '<img src="/../../etc/passwd">',
    '<iframe src="/index.html"></iframe>', '<base href="/elsewhere/">',
    '<script>fetch("/dynamic")</script>', '<svg><use href="/icons.svg#x"></use></svg>',
    '<img srcset="/a.png invalid">', '<img src="data:image/svg+xml,svg">',
    '<style>.x{background:image-set("a.png" 1x)}</style>',
    '<style>.x{background:url(var(--image))}</style>', '<style>@import var(--sheet);</style>',
    '<link rel="manifest" href="/manifest.json">', '<img src="/icon.svg">'
  ]) {
    const root = await fixture(t, { "index.html": html, "icon.svg": "<svg/>" });
    const result = await pageBudget(root, "index.html");
    assert.equal(result.status, "FAIL", html);
    assert.ok(result.issues.length, html);
  }
});

test("escaped symlinks and empty output cannot pass", async (t) => {
  const root = await fixture(t, { "index.html": '<img src="/outside">' });
  await symlink('/etc/passwd', path.join(root, "outside"));
  assert.equal((await pageBudget(root, "index.html")).status, "FAIL");
  const empty = await fixture(t, {});
  await assert.rejects(siteBudgets(empty), /No HTML/);
});

test("quoted CSS comment markers cannot hide required resources", async (t) => {
  for (const quote of ['"', "'"]) {
    for (const [name, url, expected] of [
      ["oversized", "/large.png", null],
      ["missing", "/missing.png", /Missing or unsafe resource/],
      ["external", "https://example.com/large.png", /External or unsupported resource/]
    ]) {
      await t.test(`${quote} strings: ${name}`, async () => {
        const css = `.before::before { content: ${quote}/*${quote}; } .hero { background: url("${url}"); } .after::after { content: ${quote}*/${quote}; }`;
        const root = await fixture(t, {
          "index.html": '<link rel="stylesheet" href="/site.css">',
          "site.css": css,
          "large.png": Buffer.alloc(512_001)
        });
        const result = await pageBudget(root, "index.html");
        assert.equal(result.status, "FAIL");
        if (expected) assert.ok(result.issues.some((issue) => expected.test(issue)));
        else {
          assert.equal(result.resources["large.png"], 512_001);
          assert.ok(result.bytes > 512_001);
          assert.deepEqual(result.issues, []);
        }
      });
    }
  }
});

test("real CSS comments do not introduce dependencies", async (t) => {
  const root = await fixture(t, {
    "index.html": '<style>/* url("/missing.png") */ .a{background:url("/small.png")}</style>',
    "small.png": Buffer.alloc(13)
  });
  const result = await pageBudget(root, "index.html");
  assert.equal(result.status, "PASS");
  assert.equal(result.resources["small.png"], 13);
  assert.deepEqual(result.issues, []);
});

test("commas within srcset URLs cannot be mistaken for candidate separators", async (t) => {
  for (const present of [true, false]) {
    await t.test(present ? "oversized actual candidate" : "missing actual candidate", async () => {
      const files = {
        "index.html": '<img srcset="/large,photo.png 1x">',
        "large": Buffer.alloc(1),
        "photo.png": Buffer.alloc(1)
      };
      if (present) files["large,photo.png"] = Buffer.alloc(512_001);
      const root = await fixture(t, files);
      const result = await pageBudget(root, "index.html");
      assert.equal(result.status, "FAIL");
      assert.ok(result.issues.some((issue) => /Unsupported srcset/.test(issue)));
      assert.ok(!Object.hasOwn(result.resources, "large"));
      assert.ok(!Object.hasOwn(result.resources, "photo.png"));
    });
  }
});

test("browser-accepted alternate HTML comment endings cannot hide images", async (t) => {
  const root = await fixture(t, {
    "index.html": '<!-- note --!><img src="/large.png">',
    "large.png": Buffer.alloc(512_001)
  });
  const result = await pageBudget(root, "index.html");
  assert.equal(result.status, "FAIL");
  assert.ok(result.issues.some((issue) => /Unsupported HTML comment ending/.test(issue)));
});

test("CSS token boundaries preserve later resource rules", async (t) => {
  const cases = {
    "comment markers in unquoted URL tokens": (url) => `.before{background:url(/small.png?/*)} .hero{background:url(${url})} .after{background:url(/small.png?*/)}`,
    "literal import in quoted content": (url) => `.before::before { content: "@import 'small.css'" } .hero { background:url("${url}"); }`
  };
  for (const [name, stylesheet] of Object.entries(cases)) {
    for (const [kind, url, expectedIssue] of [
      ["oversized", "/large.png", null],
      ["missing", "/missing.png", /Missing or unsafe resource/],
      ["external", "https://example.com/large.png", /External or unsupported resource/]
    ]) {
      await t.test(`${name}: ${kind}`, async () => {
        const root = await fixture(t, {
          "index.html": '<link rel="stylesheet" href="/site.css"><div class="hero"></div>',
          "site.css": stylesheet(url),
          "small.png": Buffer.alloc(1),
          "small.css": "",
          "large.png": Buffer.alloc(512_001)
        });
        const result = await pageBudget(root, "index.html");
        assert.equal(result.status, "FAIL");
        if (expectedIssue) assert.ok(result.issues.some((issue) => expectedIssue.test(issue)));
        else {
          assert.equal(result.resources["large.png"], 512_001);
          assert.ok(result.bytes > 512_001);
          assert.deepEqual(result.issues, []);
        }
        assert.ok(!Object.hasOwn(result.resources, "small.css"), "literal import is not fetched");
      });
    }
  }
});

test("CSS scanner distinguishes literal text, comments and actual imports", async (t) => {
  const root = await fixture(t, {
    "index.html": '<link rel="stylesheet" href="/site.css">',
    "site.css": `/* @import '/absent.css'; url(/absent.png) */
      @import /* a real import */ "theme" screen;
      @import url('other') layer(base);
      .before { content: "@import 'missing.css'; url(/missing.png)"; }
      .after { background: URL(/small.png?/*); }`,
    "theme": '.a { background: url("/small.png") }',
    "other": '.b { background: url(/small.png?*/) }',
    "small.png": Buffer.alloc(7)
  });
  const result = await pageBudget(root, "index.html");
  assert.equal(result.status, "PASS");
  assert.deepEqual(result.issues, []);
  assert.deepEqual(Object.keys(result.resources).sort(), ["index.html", "other", "site.css", "small.png", "theme"]);
});

test("malformed or unsupported CSS tokens fail closed", async (t) => {
  for (const css of [
    '/* unterminated', '.a { content: "unterminated }',
    '.a { background: url(/small.png }', '.a { background: url("/small.png" }',
    '.a { background: url(/small.png extra) }', '@import var(--sheet);',
    '.a { background: u\\72l(/small.png) }'
  ]) {
    const root = await fixture(t, { "index.html": `<style>${css}</style>`, "small.png": Buffer.alloc(1) });
    const result = await pageBudget(root, "index.html");
    assert.equal(result.status, "FAIL", css);
    assert.ok(result.issues.length, css);
  }
});

test("CSS url identifiers in selectors are not resource functions", async (t) => {
  const files = {
    "index.html": '<link rel="stylesheet" href="/site.css"><div class="url" id="url" url></div>',
    "site.css": '.url { color: red; } #url { color: green; } [url] { background: url("/small.png"); }',
    "small.png": Buffer.alloc(17)
  };
  const root = await fixture(t, files);
  const result = await pageBudget(root, "index.html");
  assert.equal(result.status, "PASS");
  assert.deepEqual(result.issues, []);
  assert.equal(result.resources["small.png"], 17);
  assert.equal(result.bytes, Object.values(files).reduce((sum, data) => sum + Buffer.byteLength(data), 0));
});


test("reviewed Pablo embed counts nested assets and rejects altered HTML or scripts", async (t) => {
  const files = {
    "index.html": '<iframe src="/assets/illustrations/pablo/polargraph.html"></iframe><script type="module" src="/assets/illustrations/pablo/polargraph-frame.js"></script>',
    "assets/illustrations/pablo/pablo.png": Buffer.alloc(27)
  };
  for (const name of ["polargraph.html", "polargraph-frame.js"]) {
    files[`assets/illustrations/pablo/${name}`] = await readFile(new URL(`../src/assets/illustrations/pablo/${name}`, import.meta.url));
  }
  const root = await fixture(t, files);
  const initial = await pageBudget(root, "index.html");
  assert.deepEqual(initial.issues, []);
  assert.equal(initial.bytes, Object.values(files).reduce((sum, data) => sum + Buffer.byteLength(data), 0));
  assert.ok(Object.hasOwn(initial.resources, "assets/illustrations/pablo/pablo.png"));
  for (const name of ["polargraph.html", "polargraph-frame.js"]) {
    const relative = `assets/illustrations/pablo/${name}`;
    await writeFile(path.join(root, relative), Buffer.concat([files[relative], Buffer.from("\n/* changed */")]));
    const changed = await pageBudget(root, "index.html");
    assert.equal(changed.status, "FAIL");
    assert.ok(changed.issues.some((issue) => issue.includes("Reviewed embed changed")));
    await writeFile(path.join(root, relative), files[relative]);
  }
  await writeFile(path.join(root, "index.html"), '<iframe src="/assets/illustrations/pablo/polargraph.html" srcdoc="unreviewed"></iframe>');
  assert.equal((await pageBudget(root, "index.html")).status, "FAIL");
});
