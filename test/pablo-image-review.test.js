import assert from "node:assert/strict";
import { mkdtemp, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";
import test from "node:test";
import { createPabloImageReview } from "../scripts/review-pablo-images.js";

test("Sharp review creates correctly sized, metadata-free candidates without changing the source", async (t) => {
  const temporary = await mkdtemp(path.join(tmpdir(), "starbase430-image-review-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const input = path.join(temporary, "private-master.png"), output = path.join(temporary, "review");
  const original = await sharp({ create: { width: 800, height: 1200, channels: 3, background: "#879e80" } })
    .png().withMetadata({ orientation: 6, exif: { IFD0: { Artist: "Private test author" } } }).toBuffer();
  await writeFile(input, original);
  const manifest = await createPabloImageReview({ input, output, includeReferences: false });
  assert.deepEqual(await readFile(input), original, "never overwrite or recompress the master");
  assert.equal(manifest.source.width, 1200, "apply orientation before resizing");
  assert.equal(manifest.source.height, 800);
  assert.equal(manifest.candidates.length, 6);
  for (const candidate of manifest.candidates) {
    const metadata = await sharp(path.join(output, candidate.file)).metadata();
    assert.ok([480, 640].includes(metadata.width));
    assert.equal(metadata.height, Math.round(metadata.width * 800 / 1200));
    assert.equal(metadata.orientation, undefined);
    for (const field of ["exif", "xmp", "iptc", "icc"]) assert.equal(metadata[field], undefined, field);
    assert.equal(candidate.bytes, (await readFile(path.join(output, candidate.file))).length);
    assert.match(candidate.sha256, /^[a-f0-9]{64}$/);
  }
  const html = await readFile(path.join(output, "index.html"), "utf8");
  assert.ok(!/<script|https?:\/\//i.test(html), "comparison needs no scripts or remote requests");
  assert.match(html, /Quality values are encoder-specific/);
  const serialized = await readFile(path.join(output, "manifest.json"), "utf8");
  assert.ok(!serialized.includes(temporary), "do not record private local paths");
  const before = (await readdir(output)).sort();
  await assert.rejects(createPabloImageReview({ input, output }), { code: "EEXIST" });
  assert.deepEqual((await readdir(output)).sort(), before);
  assert.equal(await readFile(path.join(output, "index.html"), "utf8"), html);
});

test("image reviews reject published source output and masters too small for 640px", async (t) => {
  await assert.rejects(createPabloImageReview({
    input: "not-read.png", output: fileURLToPath(new URL("../src/unsafe-review", import.meta.url))
  }), /outside src/);
  const temporary = await mkdtemp(path.join(tmpdir(), "starbase430-small-image-"));
  t.after(() => rm(temporary, { recursive: true, force: true }));
  const input = path.join(temporary, "small.png");
  await sharp({ create: { width: 100, height: 100, channels: 3, background: "#879e80" } }).png().toFile(input);
  await assert.rejects(createPabloImageReview({ input, output: path.join(temporary, "review") }), /at least 640 pixels/);
});
