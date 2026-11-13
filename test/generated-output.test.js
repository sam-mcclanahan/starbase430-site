import assert from "node:assert/strict";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { checkOutput } from "../scripts/check-output.js";
import { checkSite } from "../scripts/check-site.js";

const document = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"><title>Control</title>
<meta name="description" content="Control description">
<meta name="viewport" content="width=device-width, initial-scale=1">
</head><body><a class="skip-link" href="#main">Skip</a>
<main id="main"><h1 id="café">Control</h1><a name="legacy"></a>BODY</main></body></html>`;
async function fixture(t, html = document) {
  const directory = await mkdtemp(path.join(tmpdir(), "starbase430-qa-fixture-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, "nested"));
  await writeFile(path.join(directory, "index.html"), html);
  await writeFile(path.join(directory, "nested/index.html"), document);
  await writeFile(path.join(directory, "image one.png"), "fixture");
  await writeFile(path.join(directory, "feed.xml"), '<rss><channel><title>Feed without HTML metadata</title></channel></rss>');
  return directory;
}
const check = (directory) => checkOutput(directory, "https://starbase430.com");

test("fresh production and preview pass structural checks", async () => {
  const reports = await checkSite();
  assert.equal(reports.length, 2);
});

test("valid links, query strings, encoded IDs, named anchors, resources and external URLs", async (t) => {
  const directory = await fixture(t, document.replace("BODY", `
    <a href="/nested/?q=1&amp;x=2#caf%C3%A9">Nested</a>
    <a href="nested/index.html#legacy">Named anchor</a>
    <a href="?query=1#main">Query</a><a href="#">Top</a><a href="#top">Top</a>
    <a href="https://starbase430.com/nested/#main">Same origin</a>
    <a href="//starbase430.com/#main">Same origin protocol relative</a>
    <a href="https://example.invalid/missing#missing">External</a>
    <a href="//example.invalid/missing">External</a><a href="mailto:example@example.invalid">Mail</a>
    <link rel="alternate" href="feed.xml"><img src="image%20one.png?v=2">
    <source srcset="image%20one.png 1x, /image%20one.png 2x">
    <img src="data:image/png;base64,AAAA">
    <!-- <a href="missing">comment</a> -->
    <script>const example = '<a href="missing">';</script>
  `));
  await writeFile(path.join(directory, "nested/index.html"), document.replace("BODY", '<a href="../?x=1#main">Parent</a>'));
  assert.deepEqual((await check(directory)).errors, []);
});

const defects = [
  ["language", 'lang="en"', 'lang=" "', /document language/],
  ["title", "<title>Control</title>", "<title> </title>", /non-empty title/],
  ["description", 'content="Control description"', 'content=" "', /description/],
  ["charset", 'charset="utf-8"', 'charset="ascii"', /UTF-8/],
  ["viewport", "width=device-width", "width=1000", /viewport/],
  ["main", '<main id="main">', '<div id="main">', /main landmark/],
  ["skip link", 'href="#main"', 'href="#café"', /skip-link/],
  ["duplicate IDs", "BODY", '<div id="main"></div>', /duplicate id/],
  ["missing navigation", "BODY", '<a href="/absent/">Broken</a>', /missing local target/],
  ["same-origin missing navigation", "BODY", '<a href="https://starbase430.com/absent/">Broken</a>', /missing local target/],
  ["missing local fragment", "BODY", '<a href="#absent">Broken</a>', /missing fragment/],
  ["missing cross-page fragment", "BODY", '<a href="/nested/?q=1#absent">Broken</a>', /missing fragment/],
  ["missing resource", "BODY", '<img src="/absent.png">', /missing local target/],
  ["missing srcset resource", "BODY", '<source srcset="image%20one.png 1x, absent.png 2x">', /missing local target/],
  ["missing stylesheet", "BODY", '<link rel="stylesheet" href="absent.css">', /missing local target/],
  ["missing feed", "BODY", '<a href="absent.xml">Feed</a>', /missing local target/],
  ["bad encoding", "BODY", '<a href="/%ZZ">Broken</a>', /invalid URL encoding/],
  ["base URL", "BODY", '<base href="/nested/">', /base elements/]
];
for (const [name, before, after, expected] of defects) {
  test(`rejects ${name}`, async (t) => {
    const directory = await fixture(t, document.replace(before, after));
    assert.match((await check(directory)).errors.join("\n"), expected);
  });
}
test("empty output cannot pass", async (t) => {
  const directory = await fixture(t);
  await rm(path.join(directory, "index.html"));
  await rm(path.join(directory, "nested"), { recursive: true });
  assert.match((await check(directory)).errors.join("\n"), /no HTML pages/);
});

test("decodes named and numeric entities in resource paths exactly once", async (t) => {
  const directory = await fixture(t, document.replace("BODY", `
    <a href="a&amp;b.png">Named</a><img src="a&#38;b.png">
    <source srcset="a&#x26;b.png 1x, a&amp;amp;b.png 2x">
  `));
  await writeFile(path.join(directory, "a&b.png"), "fixture");
  await writeFile(path.join(directory, "a&amp;b.png"), "fixture");
  assert.deepEqual((await check(directory)).errors, []);
});

test("matches decoded entities in IDs, named anchors and local/cross-page fragments", async (t) => {
  const directory = await fixture(t, document.replace("BODY", `
    <h2 id="a&amp;b">Target</h2><a name="c&#38;d"></a>
    <a href="#a&#38;b">Numeric</a><a href="#a%26b">Percent</a>
    <a href="#c&amp;d">Named anchor</a>
    <a href="nested/#a&amp;b">Cross-page</a>
    <h2 id="a&amp;amp;b">Literal entity text</h2>
    <a href="#a%26amp;b">Decode once</a>
  `));
  await writeFile(path.join(directory, "nested/index.html"), document.replace("BODY", '<h2 id="a&#x26;b">Target</h2>'));
  assert.deepEqual((await check(directory)).errors, []);
});

test("rejects browser-equivalent IDs written with different entities", async (t) => {
  const directory = await fixture(t, document.replace("BODY", '<h2 id="a&amp;b">One</h2><h2 id="a&#38;b">Two</h2>'));
  assert.deepEqual((await check(directory)).errors, ['index.html: duplicate id "a&b"']);
});
