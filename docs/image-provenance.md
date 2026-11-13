# Image provenance

## FSE article: Apollo 11 mission insignia

Replaced the Armstrong broadcast still at Sam’s request on November 10, 2026.

- Source: [Apollo 11 insignia, Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Apollo_11_insignia.png).
- Original: [Commons PNG](https://upload.wikimedia.org/wikipedia/commons/2/27/Apollo_11_insignia.png),
  5380 × 5432 pixels, 18,861,864 bytes. The master remains outside site sources
  and is not included in builds. Commons credits NASA and cites NASA’s historical
  mission-patch collection as its source.
- Rights: Commons marks this NASA work public domain in the United States and
  also flags insignia-use restrictions. [NASA’s media guidance](https://www.nasa.gov/nasa-brand-center/images-and-media/)
  permits factual informational use without implying endorsement. This is a
  historical illustration within the FSE article, not Starbase 430 branding or
  a claim of NASA affiliation. No broad trademark or merchandising grant is made.
- Processing: pinned Sharp, auto-orientation, width-based resize without
  enlargement, sRGB, metadata stripped. Preserve the full composition, colors,
  proportions, and source alpha. No recoloring, cropping, retouching, generated
  reconstruction, or animation.
- Main: `src/assets/images/fse/apollo11-insignia-320.avif`, 320 × 323 pixels,
  AVIF Q50, effort 6, 4:4:4 chroma, 13,325 bytes.
- Fallback: `src/assets/images/fse/apollo11-insignia-320.webp`, 320 × 323 pixels,
  WebP Q75, effort 6, 23,340 bytes.
- [Processing manifest](fse-photo-provenance.json) records source and derivative
  hashes, dimensions, codec versions, and settings. To reproduce, verify the
  original PNG hash and encode with the pinned Sharp version using the settings
  above. Recheck file sizes and hashes after codec changes.
- Display: responsive figure capped at 240 CSS pixels, explicit image dimensions,
  lazy loading, asynchronous decoding. Both formats count toward page weight.
  The image links to the Apollo 11 Wikipedia article. Alternative text describes
  the eagle, olive branch, lunar surface, Earth, lettering, and link destination.
  The complementary caption credits NASA via the Commons source record and
  includes a descriptive mission-information link.

The figure closes the epoch section, after the epoch-zero sentence. The captioned first-step
video link now appears in “Following the trail,” the article’s Further reading
section. No external image, iframe, video player, script, or preconnect loads
with the article; external destinations are ordinary links usable without JS.

Sam approved the article and its insignia derivatives for release builds on
November 12, 2026. Both files now live under `/assets/images/fse/` in production
and preview output. This approval does not deploy the site. The superseded
Aldrin photograph and Armstrong still derivatives are removed from site sources.
NASA material is not Sam/Brea artwork, is not granted under the software MIT
license, and is not claimed under reserved-content terms.

## Other image records

- [Pablo illustration and Tesla source](pablo-illustration.md).
- [Image processing](image-optimization.md).
- [Software and content license scope](../LICENSE-SCOPE.md).

## Sam/Brea and Pablo photographs: permission checkpoint

November 12, 2026: Sam explicitly confirmed permission to publish Emily Moffat’s
two caricatures and ownership of the April 11 working-session photograph. Retain
the artist’s visible credits and separate third-party rights; this confirmation
is permission for site use, not a downstream open license for the artwork. Sam
previously confirmed taking the completed-Pablo photograph. Contributors’ first
names/order and the working-session caption were explicitly supplied and approved
by Sam. No additional identity details are inferred or published.

Published AVIF/WebP derivatives have no EXIF, XMP, or IPTC metadata according to
Sharp inspection. The source masters remain outside site assets. The original
site-button PNG contains an EXIF block limited to sRGB color-space and pixel
dimensions; it has no recorded person, contact, location, or timestamp fields.
