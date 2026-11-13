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
