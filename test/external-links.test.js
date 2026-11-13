import assert from "node:assert/strict";
import test from "node:test";
import { externalLinks } from "../src/_lib/external-links.js";
const origin = "https://starbase430.com";

test("identity links retain rel me through accessible external-link formatting", () => {
  const html = '<a href="https://github.com/sam-mcclanahan" rel="me">Sam on GitHub</a>';
  const result = externalLinks(html, origin);
  assert.match(result, /rel="me noopener"/);
  assert.match(result, /href="https:\/\/github.com\/sam-mcclanahan"/);
  assert.match(result, /\(opens in a new tab\)/);
  assert.equal(externalLinks(result, origin), result);
});

test("external links retain a screen-reader warning without visual icons, preserve markup, and are idempotent", () => {
  const html = '<a href="https://example.org/?a=1&amp;b=2" rel="author" aria-label="Source"><picture><img src="local.webp" alt="Mission patch"></picture>Source</a>';
  const result = externalLinks(html, origin);
  assert.match(result, /href="https:\/\/example.org\/\?a=1&amp;b=2"/);
  assert.match(result, /target="_blank" rel="author noopener"/);
  assert.match(result, /aria-label="Source \(opens in a new tab\)"/);
  assert.match(result, /<span class="sr-only" data-new-tab=""> \(opens in a new tab\)<\/span><\/a>/);
  assert.ok(!result.includes("↗"));
  assert.ok(result.includes('<picture><img src="local.webp" alt="Mission patch"></picture>'));
  assert.equal(externalLinks(result, origin), result);
  assert.match(externalLinks('<a href="//example.org">Source</a>', origin), /target="_blank"/);
});

test("internal URLs, fragments, downloads, non-web schemes and literal text remain unchanged", () => {
  const html = '<a href="/log/">Log</a><a href="#chapter">Chapter</a><a href="../about/">About</a><a href="https://starbase430.com:443/log/">Same site</a><a href="/assets/image.svg" download>Download</a><a href="mailto:test@example.org">Email</a><a href="tel:123">Call</a><!-- <a href="https://example.org">comment</a> --><script>const text = \'<a href="https://example.org">script</a>\';</script><textarea><a href="https://example.org">text</a></textarea>';
  assert.equal(externalLinks(html, origin), html);
});

test("image-only links omit the visual arrow but retain accessible new-tab notice", () => {
  for (const content of ['<picture><img src="patch.webp" alt="Apollo 11"></picture>', '<svg role="img"><title>Apollo 11</title></svg>']) {
    const result = externalLinks(`<a href="https://example.org">${content}</a>`, origin);
    assert.ok(!result.includes("↗"));
    assert.ok(result.includes(content));
    assert.match(result, /target="_blank" rel="noopener"/);
    assert.match(result, /<span class="sr-only" data-new-tab=""> \(opens in a new tab\)<\/span>/);
    assert.equal(externalLinks(result, origin), result);
  }
});
