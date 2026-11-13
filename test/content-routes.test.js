import assert from "node:assert/strict";
import test from "node:test";

import {
  assertUniquePublicRoutes,
  buildContentRoute,
  validateContentRoutes,
  validateContentSlug
} from "../src/_lib/content-routes.js";

test("builds stable section routes from explicit slugs", () => {
  assert.equal(
    buildContentRoute("log", "first-transmission"),
    "/log/first-transmission/"
  );
  assert.throws(() => buildContentRoute("projects", "first-transmission"), /unsupported content section/);
});

test("rejects missing and malformed slugs", () => {
  assert.throws(() => validateContentSlug(), /requires an explicit slug/);

  for (const slug of ["Uppercase", "two words", "two_words", "-leading"]) {
    assert.throws(
      () => validateContentSlug(slug),
      /lowercase ASCII letters/
    );
  }
});

test("rejects reserved slugs", () => {
  assert.throws(() => validateContentSlug("feed"), /reserved slug/);
  assert.throws(() => validateContentSlug("index"), /reserved slug/);
});

test("detects case-insensitive duplicate public routes", () => {
  assert.throws(
    () =>
      assertUniquePublicRoutes([
        { inputPath: "src/log/first.md", route: "/log/first/" },
        { inputPath: "src/log/second.md", route: "/LOG/FIRST/" }
      ]),
    (error) => {
      assert.match(error.message, /Duplicate public URL/);
      assert.match(error.message, /src\/log\/first\.md/);
      assert.match(error.message, /src\/log\/second\.md/);
      return true;
    }
  );
});

test("validates a collection against its computed stable routes", () => {
  const items = [
    {
      data: { slug: "first-transmission" },
      inputPath: "src/log/first.md",
      url: "/log/first-transmission/"
    }
  ];

  assert.equal(validateContentRoutes(items, "log", "Log entry"), items);
  assert.throws(
    () =>
      validateContentRoutes(
        [{ ...items[0], url: "/log/file-name/" }],
        "log",
        "Log entry"
      ),
    /instead of its stable public URL/
  );
});
