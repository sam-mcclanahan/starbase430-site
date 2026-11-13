import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const siteButtonPath = new URL(
  "../src/assets/images/starbase430-88x31.png",
  import.meta.url
);

test("keeps the site button at 88 by 31 pixels and under 4 KB", async () => {
  const image = await readFile(siteButtonPath);
  const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  assert.equal(image.subarray(0, 8).compare(pngSignature), 0);
  assert.equal(image.readUInt32BE(16), 88);
  assert.equal(image.readUInt32BE(20), 31);
  assert.ok(image.byteLength <= 4 * 1024);
});
