import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

// Keep the approved SVG as the editable master. PNG-in-ICO avoids adding
// a separate encoder dependency; each directory entry identifies its size.
const icons = new URL("../src/assets/icons/", import.meta.url);
const source = await readFile(new URL("favicon.svg", icons));
const sizes = [16, 32];
const images = await Promise.all(sizes.map((size) =>
  sharp(source).resize(size, size).png({ palette: true, colours: 16, dither: 0 }).toBuffer()
));
const header = Buffer.alloc(6 + 16 * images.length);
header.writeUInt16LE(1, 2);
header.writeUInt16LE(images.length, 4);
let offset = header.length;
images.forEach((image, index) => {
  const entry = 6 + 16 * index;
  header[entry] = header[entry + 1] = sizes[index];
  header.writeUInt16LE(1, entry + 4);
  header.writeUInt16LE(32, entry + 6);
  header.writeUInt32LE(image.length, entry + 8);
  header.writeUInt32LE(offset, entry + 12);
  offset += image.length;
});
await writeFile(new URL("favicon.ico", icons), Buffer.concat([header, ...images]));
await sharp(source).resize(180, 180).flatten({ background: "#070b09" })
  .png({ palette: true, colours: 16, dither: 0 })
  .toFile(new URL("apple-touch-icon.png", icons).pathname);
console.log("Generated 16/32px ICO and 180px Apple touch icon from favicon.svg.");
