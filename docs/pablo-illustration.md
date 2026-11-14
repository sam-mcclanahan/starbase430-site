# Pablo illustration provenance and maintenance

The optional illustration is independently linked from the retrospective.
Its HTML, controller, PNG, SVG, and editable contour data are local assets. It
requires JavaScript for interaction; the page retains ordinary explanations,
a static alternative, and return navigation without JavaScript.

The approved Tesla tracing has 705 separate pen strokes and a Draw Tesla button.
It is based on [N.Tesla.JPG](https://commons.wikimedia.org/wiki/File:N.Tesla.JPG),
which Commons lists as public domain. The record describes Tesla at age 40;
its historical summary and embedded agency metadata differ, so preserve the
source attribution without asserting a new worldwide rights determination.
The original photograph is not bundled. Public-domain source material is not
claimed under the software or reserved-artwork terms.

The original Anatomy software notice is retained in `licenses/anatomy-MIT.txt`
and as a complete nonvisual comment in `polargraph.html`. Reusable software and
illustration artwork have separate rights under `LICENSE-SCOPE.md`.

`node scripts/build-pablo-tesla.js` projects `scripts/tesla-strokes.json` into the
HTML/SVG and rebuilds the PNG and reviewed HTML digest. Re-review controls,
resource loading, accessibility, and hard budgets after any change. Keep pen-up
travel unmarked, keyboard/slider alternatives, live readouts/counterweights,
clear/reset, and live reduced-motion completion behavior.

## Lossless size optimization, November 14, 2026

The interactive HTML stores the approved contour coordinates as integer tenths
and per-stroke deltas. It reconstructs all 705 strokes and 6,761 points exactly
before building the existing animation route. The readable master in
`scripts/tesla-strokes.json` stays unchanged. The generator rejects coordinates
that cannot be represented exactly in integer tenths instead of rounding them.

The initial finished portrait is generated from those same points, using the
original one-decimal projection rounding. The interactive HTML no longer embeds
a second full portrait path. Reset and animation retain their existing precision
and behavior. The standalone SVG keeps its full static path; its bytes and the
PNG fallback remain unchanged. With JavaScript disabled the existing PNG and
written alternatives are still available. No new request or runtime dependency
is introduced.

The conservative interactive-page total fell from 511,433 to 376,545 bytes:
134,888 bytes saved and 135,455 bytes below the unchanged 512,000-byte ceiling.
The interactive document itself fell from 434,305 to 299,417 bytes. The budget
still counts the PNG fallback alongside interactive resources.

The controller regression test compares every decoded point with the approved
master and compares the initial portrait path with the standalone SVG. Ten
before/after browser comparisons at widths of 960 and 320 pixels found identical
pixels for initial, Reset, reduced-motion completion, CSS-off, and JavaScript-off
views, with no script errors. Private comparison artifacts remain outside this
release repository. Full-suite validation is recorded in current status. These
changes were approved by Sam for source integration on November 14. Website
deployment remains a separate approval and is unchanged.
