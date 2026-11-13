import sharp from "sharp";
import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import { constants } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const repository = fileURLToPath(new URL("../", import.meta.url));
const digest = (bytes) => createHash("sha256").update(bytes).digest("hex");
export const settings = {
  jpeg: { quality: 75, mozjpeg: true, chromaSubsampling: "4:2:0" },
  webp: { quality: 75, effort: 6 },
  avif: { quality: 50, effort: 6, chromaSubsampling: "4:4:4" }
};
const escape = (text) => String(text).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const kb = (bytes) => `${(bytes / 1000).toFixed(2)} KB`;

function comparisonPage(manifest) {
  const photoAlt = "Pablo the Polargraph mounted on a wooden artist's easel, drawing a portrait of Nikola Tesla.";
  const figure = (image) => `<figure>
<figcaption><strong>${escape(image.label)}</strong><br>${image.width} × ${image.height} pixels · ${image.bytes.toLocaleString("en-US")} bytes (${kb(image.bytes)})</figcaption>
<a href="${image.file}"><img src="${image.file}" alt="${escape(photoAlt)}" width="${image.width}" height="${image.height}" loading="lazy" decoding="async"></a>
<p><a href="${image.file}">Open full-size ${escape(image.label)}</a></p></figure>`;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><meta name="description" content="Private comparison of Pablo photograph sizes and formats; not part of the website.">
<title>Pablo photograph compression comparison</title>
<style>html{color-scheme:dark;background:#070b09;color:#edf3ef;font:16px/1.6 system-ui,sans-serif}body{max-width:1440px;margin:auto;padding:24px}a{color:#b7f0a8}a:focus-visible{outline:3px solid #d6ff6f;outline-offset:4px}h1,h2{line-height:1.2}p{max-width:75ch}table{border-collapse:collapse}th,td{text-align:left;border-bottom:1px solid #477e5e;padding:8px 16px 8px 0}figure{margin:0;min-width:0}figcaption{margin-bottom:12px}img{display:block;max-width:100%;height:auto}.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:32px}section{margin-top:40px}.skip{position:absolute;transform:translateY(-200%)}.skip:focus{transform:none;background:#070b09}@media(max-width:700px){.grid{grid-template-columns:1fr}body{padding:16px}}@media print{html{background:white;color:black}a{color:black}}</style>
</head><body><a class="skip" href="#main">Skip to comparison</a><main id="main">
<h1>Pablo photograph comparison</h1>
<p><strong>Private review only.</strong> The article and its existing images are unchanged. All candidates come directly from the flattened master, without cropping or upscaling. Orientation is applied, output is sRGB, and metadata is stripped. Images are shown no larger than their native width.</p>
<p>Check the portrait lines, chain links, and lettering. Click an image to open it separately. Quality values are encoder-specific: WebP/JPEG 75 and AVIF 50 are not equivalent scales. These are initial candidates, not approved publication settings.</p>
<table><caption>Candidate file sizes, decimal KB</caption><thead><tr><th>Format / quality</th><th>480 px wide</th><th>640 px wide</th></tr></thead><tbody>
${Object.entries(settings).map(([format, options]) => `<tr><th>${format.toUpperCase()} / ${options.quality}</th>${[480, 640].map((width) => `<td>${kb(manifest.candidates.find((image) => image.width === width && image.format === format).bytes)}</td>`).join("")}</tr>`).join("\n")}
</tbody></table>
${Object.keys(settings).map((format) => `<section><h2>${format.toUpperCase()} candidates</h2><div class="grid">${manifest.candidates.filter((image) => image.format === format).map(figure).join("\n")}</div></section>`).join("\n")}
${manifest.references.length ? `<section><h2>Existing 640-pixel site versions</h2><div class="grid">${manifest.references.map(figure).join("\n")}</div></section>` : ""}
<p><a href="manifest.json">Encoding settings and exact sizes</a></p>
</main></body></html>\n`;
}

export async function createPabloImageReview({ input, output = path.join(repository, "review/pablo-images"), includeReferences = false }) {
  if (!input) throw new Error("Supply the flattened master with --input. The master is never overwritten.");
  const destination = path.resolve(output);
  const relative = path.relative(path.join(repository, "src"), destination);
  if (!relative || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))) {
    throw new Error("Comparison output must remain outside src; it is not approved site content.");
  }
  const original = await readFile(input);
  const metadata = await sharp(original).metadata();
  const rotated = [5, 6, 7, 8].includes(metadata.orientation);
  const width = rotated ? metadata.height : metadata.width;
  const height = rotated ? metadata.width : metadata.height;
  if (!width || !height || width < 640) throw new Error("The oriented master must be at least 640 pixels wide; no upscaling is performed.");
  await mkdir(path.dirname(destination), { recursive: true });
  // A fresh directory prevents accidentally replacing an original or prior review.
  await mkdir(destination);
  const manifest = {
    source: { bytes: original.length, sha256: digest(original), width, height },
    versions: sharp.versions,
    settings,
    candidates: [], references: []
  };
  for (const width of [480, 640]) {
    for (const [format, options] of Object.entries(settings)) {
      const extension = format === "jpeg" ? "jpg" : format;
      const file = `pablo-01-${width}-q${options.quality}.${extension}`;
      const pipeline = sharp(original).autoOrient().resize({ width, withoutEnlargement: true })
        .toColourspace("srgb").flatten({ background: "#ffffff" });
      const info = await pipeline[format](options).toFile(path.join(destination, file));
      const bytes = await readFile(path.join(destination, file));
      manifest.candidates.push({ file, format, quality: options.quality, width: info.width,
        height: info.height, bytes: bytes.length, sha256: digest(bytes), label: `${width}px ${format.toUpperCase()} Q${options.quality}` });
    }
  }
  // No absolute source paths or embedded originals are written to the review.
  await writeFile(path.join(destination, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, { flag: "wx" });
  await writeFile(path.join(destination, "index.html"), comparisonPage(manifest), { flag: "wx" });
  return { directory: destination, ...manifest };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { values } = parseArgs({ options: { input: { type: "string" }, output: { type: "string" }, help: { type: "boolean" } } });
  if (values.help) console.log('npm run review:pablo-images -- --input "/path/to/flattened.png" [--output review/pablo-images-new]');
  else {
    try {
      const result = await createPabloImageReview(values);
      console.log(result.directory);
      for (const image of result.candidates) console.log(`${image.label}: ${image.width}x${image.height}, ${image.bytes} bytes (${kb(image.bytes)})`);
    } catch (error) {
      console.error(error.code === "EEXIST" ? "Output already exists. Choose a new --output directory; no existing review is overwritten." : error.message);
      process.exitCode = 1;
    }
  }
}
