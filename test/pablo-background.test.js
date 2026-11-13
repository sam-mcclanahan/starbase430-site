import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const read = (file) => readFileSync(new URL(`../${file}`, import.meta.url), "utf8");

test("Shared space background is static CSS without motion controls or extra top spacing", () => {
  const css = read("src/assets/css/site.css").split("/* Shared static nebula")[1];
  const markup = read("src/_includes/partials/space-background.njk");
  assert.ok(!/url\s*\(|@import/i.test(css), "no external background resources");
  assert.ok(!/<script|<img|<svg|<iframe/i.test(markup), "background adds no scripts or images");
  assert.doesNotMatch(css, /animation|@keyframes|transition|transform|position:fixed/);
  assert.doesNotMatch(css, /background-pause|background-motion|background-status|\.shell/);
  assert.match(css, /\.site-body\{position:relative;min-height:100vh\}/);
  assert.match(css, /\.sb-scenery\{position:absolute/);
  for (const layer of ["sb-clouds", "sb-far", "sb-mid", "sb-near"]) {
    assert.ok(markup.includes(layer));
    assert.ok(css.includes(layer));
  }
  assert.ok(!/sb-planet|sb-surface/.test(css + markup), "planet and its unused styles are removed");
  assert.doesNotMatch(read("src/_includes/layouts/base.njk"), /background-pause|background-motion|background-status/);
  assert.doesNotMatch(read("src/_includes/layouts/base.njk"), /pabloSpaceBackground|carina|NASA/);
});
