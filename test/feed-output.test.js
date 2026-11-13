import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { cp, mkdtemp, readFile, readdir, rename, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parser } from "posthtml-parser";
import test from "node:test";
import { escapeXml, safeCdata, validateXml } from "../src/_lib/feed-xml.js";

const repository = fileURLToPath(new URL("../", import.meta.url));
const feedPaths = ["feed.xml", "log/feed.xml", "projects/feed.xml"];
const children = (node, tag) => (node.content ?? []).filter((child) => child.tag === tag);
const child = (node, tag) => children(node, tag)[0];
const text = (node) => (node.content ?? []).join("");
const value = (node, tag) => text(child(node, tag));
function channel(xml) {
  // XML-mode parsing checks decoded values; this is not schema validation.
  return child(parser(xml, { xmlMode: true, decodeEntities: true }).find((node) => node.tag === "rss"), "channel");
}

async function fixtureRepository(t) {
  const temporary = await mkdtemp(path.join(tmpdir(), "starbase430-feeds-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  for (const name of ["src", "package.json", "eleventy.config.js"]) {
    await cp(path.join(repository, name), path.join(temporary, name), { recursive: true });
  }
  await symlink(path.join(repository, "node_modules"), path.join(temporary, "node_modules"), "dir");
  // Keep synthetic feed-ordering fixtures independent of real release dates.
  // Real ready/draft membership is covered by draft-output.test.js. Only this
  // disposable source copy is changed; authored repository entries are intact.
  const logs = path.join(temporary, "src/log");
  for (const file of (await readdir(logs)).filter(name => name.endsWith(".md"))) {
    const entryPath = path.join(logs, file);
    await writeFile(entryPath, (await readFile(entryPath, "utf8")).replace(/^draft: false$/m, "draft: true"));
  }
  return temporary;
}
function build(temporary, output, mode = "build", timeZone = "UTC") {
  return spawnSync(process.execPath, ["--input-type=module", "-e", `
    import Eleventy from '@11ty/eleventy';
    await new Eleventy('src', ${JSON.stringify(path.join(temporary, output))}, {
      source: 'cli', runMode: ${JSON.stringify(mode)}, quietMode: true
    }).write();
  `], { cwd: temporary, encoding: "utf8", env: { ...process.env, TZ: timeZone } });
}
async function entry(temporary, section, slug, date, extra = {}, body = `Start ${slug}.\n\n## Full entry\n\nEnd ${slug}.`) {
  const data = { title: `${section} ${slug}`, slug, description: "A complete summary.", date,
    author: section === "log" ? "brea" : "sam", status: "complete", draft: false, ...extra };
  const file = path.join(temporary, "src", section, `${slug}.md`);
  await writeFile(file, `---\n${Object.entries(data).map(([key, val]) => `${key}: ${JSON.stringify(val)}`).join("\n")}\n---\n${body}\n`);
  return file;
}

test("XML serialization validates characters without echoing private text", () => {
  const allowed = "\t\n\r café 🚀 \uD7FF\uE000\uFFFD\u{10000}\u{10FFFF}";
  assert.equal(validateXml(allowed), allowed);
  assert.equal(escapeXml('&<>"\''), "&amp;&lt;&gt;&quot;&apos;");
  assert.equal(safeCdata("one ]]> two ]]>"), "one ]]]]><![CDATA[> two ]]]]><![CDATA[>");
  for (const invalid of ["\0", "\u0001", "\u000B", "\u001F", "\uD800", "\uDC00", "\uFFFE", "\uFFFF"]) {
    for (const serialize of [validateXml, escapeXml, safeCdata]) {
      assert.throws(() => serialize(`private-sentinel${invalid}`), (error) => {
        assert.match(error.message, /XML 1.0 forbids U\+[0-9A-F]+ at UTF-16 offset 16/);
        assert.ok(!error.message.includes("private-sentinel"));
        return true;
      });
    }
  }
});

test("feeds preserve escaped metadata, full HTML and URL queries in fresh outputs", async (t) => {
  const temporary = await fixtureRepository(t);
  const title = `A & B <test> "quoted" 'apostrophe' café 🚀 </title><injected/>`;
  const description = `I tried & learned <more>; "quoted" and 'apostrophe'.`;
  const body = `<h2 id="local">Full entry</h2>
<p>Start sentinel.</p>
<a href="../../about/?a=1&amp;b=2#sam">relative</a>
<a href="/about/?a=1&amp;b=2#sam">root</a>
<a href="https://starbase430.com/about/?a=1&amp;b=2#sam">absolute</a>
<a href="?a=1&amp;b=2">query only</a>
<a href="#local">fragment only</a>
<a href="//example.invalid/path?q=1#part">protocol relative</a>
<img alt="Button" src="/assets/images/starbase430-88x31.png?size=1&amp;v=2" srcset="../../assets/images/starbase430-88x31.png?size=1&amp;v=2 1x, /assets/images/starbase430-88x31.png?size=2&amp;v=2 2x">
<pre>First ]]> middle ]]> end &amp; &lt;literal&gt;</pre>
<p>End sentinel.</p>`;
  for (const section of ["log"]) {
    await entry(temporary, section, "serialization", "2026-07-15T09:00:00-04:00", { title, description }, body);
  }
  // Also exercise channel metadata; no real data files are edited.
  const feedDataPath = path.join(temporary, "src/_data/feeds.json");
  const feedData = JSON.parse(await readFile(feedDataPath, "utf8"));
  feedData.all.title = title;
  feedData.all.description = description;
  await writeFile(feedDataPath, JSON.stringify(feedData));
  for (const mode of ["build", "watch"]) {
    const result = build(temporary, mode, mode);
    assert.equal(result.status, 0, result.stderr);
    for (const file of feedPaths) {
      const xml = await readFile(path.join(temporary, mode, file), "utf8");
      assert.equal(xml, await readFile(path.join(temporary, mode, "feed.xml"), "utf8"), "static aliases must be byte-identical with canonical self identity");
      const feed = channel(xml);
      if (file === "feed.xml") {
        assert.equal(value(feed, "title"), title);
        assert.equal(value(feed, "description"), description);
      }
      const items = children(feed, "item").filter((item) => value(item, "link").endsWith("/serialization/"));
      assert.equal(items.length, 1);
      assert.ok(!xml.includes("<injected"));
      for (const item of items) {
        assert.equal(value(item, "title"), title);
        assert.equal(value(item, "description"), description);
        assert.equal(value(item, "pubDate"), "Wed, 15 Jul 2026 13:00:00 GMT");
        assert.equal(value(item, "guid"), value(item, "link"));
        assert.equal(child(item, "guid").attrs.isPermaLink, "true");
        assert.ok(["Sam", "Brea"].includes(value(item, "dc:creator")));
        assert.equal(children(item, "author").length, 0);
        const html = value(item, "content:encoded");
        assert.ok(html.includes("Start sentinel.") && html.includes("End sentinel."));
        assert.ok(html.includes("First ]]> middle ]]> end &amp; &lt;literal&gt;"));
        const nodes = parser(html, { decodeEntities: true });
        const links = nodes.filter((node) => node.tag === "a").map((node) => node.attrs.href);
        assert.deepEqual(links, [
          ...Array(3).fill("https://starbase430.com/about/?a=1&b=2#sam"),
          `${value(item, "link")}?a=1&b=2`, `${value(item, "link")}#local`,
          "https://example.invalid/path?q=1#part"
        ]);
        const image = nodes.find((node) => node.tag === "img");
        assert.equal(image.attrs.src, "https://starbase430.com/assets/images/starbase430-88x31.png?size=1&v=2");
        assert.equal(image.attrs.srcset, "https://starbase430.com/assets/images/starbase430-88x31.png?size=1&v=2 1x, https://starbase430.com/assets/images/starbase430-88x31.png?size=2&v=2 2x");
      }
    }
    const page = await readFile(path.join(temporary, mode, "log/serialization/index.html"), "utf8");
    assert.ok(page.includes('href="../../about/?a=1&amp;b=2#sam"'), "ordinary pages keep authored links");
  }
});

test("feeds keep newest twenty, alias identity, dates, stable IDs and draft policy", async (t) => {
  const temporary = await fixtureRepository(t);
  const expected = [];
  for (const section of ["log"]) {
    for (let day = 1; day <= 22; day++) {
      const slug = `published-${String(day).padStart(2, "0")}`;
      const date = `2026-01-${String(day).padStart(2, "0")}T${section === "log" ? "09" : "10"}:00:00-05:00`;
      await entry(temporary, section, slug, date, { author: day % 2 ? "sam" : "brea" });
      expected.push({ section, date, author: day % 2 ? "Sam" : "Brea", url: `https://starbase430.com/${section}/${slug}/` });
    }
    // Future non-drafts still appear immediately within reviewed TAI coverage.
    // Unreviewed centuries cannot supply scientifically defined TAI labels.
    await entry(temporary, section, "future", "2026-12-15T09:00:00-05:00");
    expected.push({ section, author: "Brea", date: "2026-12-15T09:00:00-05:00", url: `https://starbase430.com/${section}/future/` });
    await entry(temporary, section, "future-draft", "2099-01-16T09:00:00-05:00", { draft: true });
  }
  const result = build(temporary, "production");
  assert.equal(result.status, 0, result.stderr);
  const original = [];
  for (const file of feedPaths) {
    const section = null;
    const feed = channel(await readFile(path.join(temporary, "production", file), "utf8"));
    const items = children(feed, "item");
    const records = expected.filter((item) => !section || item.section === section).toSorted((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 20);
    assert.deepEqual(items.map((item) => value(item, "link")), records.map((item) => item.url));
    assert.equal(new Set(items.map((item) => value(item, "guid"))).size, 20);
    assert.equal(value(feed, "lastBuildDate"), new Date(records[0].date).toUTCString());
    assert.equal(value(feed, "link"), `https://starbase430.com/${section ? section + "/" : ""}`);
    assert.equal(child(feed, "atom:link").attrs.href, "https://starbase430.com/feed.xml");
    items.forEach((item, index) => {
      assert.equal(value(item, "pubDate"), new Date(records[index].date).toUTCString());
      assert.equal(value(item, "dc:creator"), records[index].author);
      assert.equal(value(item, "category"), records[index].section === "log" ? "Log" : "Project");
    });
    original.push(items.map((item) => [value(item, "guid"), value(item, "pubDate")]));
  }
  const old = path.join(temporary, "src/log/future.md");
  const renamed = path.join(temporary, "src/log/renamed.md");
  await rename(old, renamed);
  await writeFile(renamed, (await readFile(renamed, "utf8")) + "\nLater body edit.\n");
  const updated = build(temporary, "updated", "build", "Pacific/Honolulu");
  assert.equal(updated.status, 0, updated.stderr);
  for (const [index, file] of feedPaths.entries()) {
    const items = children(channel(await readFile(path.join(temporary, "updated", file), "utf8")), "item");
    assert.deepEqual(items.map((item) => [value(item, "guid"), value(item, "pubDate")]), original[index]);
  }
  const preview = build(temporary, "preview", "watch");
  assert.equal(preview.status, 0, preview.stderr);
  for (const file of feedPaths) {
    const items = children(channel(await readFile(path.join(temporary, "preview", file), "utf8")), "item");
    assert.ok(value(items[0], "link").endsWith("/future-draft/"));
  }
});

test("published timestamps outside reviewed TAI coverage fail the build", async (t) => {
  const temporary = await fixtureRepository(t);
  await entry(temporary, "log", "unreviewed-time", "2027-01-15T09:00:00-05:00");
  const result = build(temporary, "production");
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /outside reviewed range/);
});

test("feed builds reject XML-forbidden metadata and content with private diagnostics", async (t) => {
  const temporary = await fixtureRepository(t);
  for (const field of ["title", "description", "body"]) {
    const sentinel = "PRIVATE_PAYLOAD_SENTINEL";
    const bad = `${sentinel}\u0001`;
    await entry(temporary, "log", "invalid-xml", "2026-01-15T09:00:00-05:00",
      field === "body" ? {} : { [field]: bad }, field === "body" ? bad : undefined);
    const result = build(temporary, `invalid-${field}`);
    assert.notEqual(result.status, 0);
    assert.match(result.stderr, /XML 1.0 forbids U\+0001 at UTF-16 offset/);
    assert.ok(!(result.stdout + result.stderr).includes(sentinel));
  }
});
