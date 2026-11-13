# Code license and content rights

Selected November 4, 2026. This document defines which material is covered by
the repository's unmodified [MIT License](LICENSE). Specific third-party or
file-level notices take precedence for the material they identify.

## MIT-licensed software

Original reusable software in this repository is licensed under MIT, including:

- Eleventy configuration, build and checking scripts, tests, and package configuration.
- JavaScript modules in `src/_lib/` and reusable feed and layout templates.
- CSS, including the gradient-based nebula and starfield background.
- Reusable HTML/Nunjucks structure in page sources, apart from the editorial
  text, artwork, and identity material described below.
- The original interaction/controller JavaScript and CSS for the polargraph
  demonstration, including code embedded in `src/assets/illustrations/pablo/polargraph.html`.
- Developer documentation describing how to build, maintain, and reuse the software,
  apart from embedded editorial passages and other excluded material.

MIT permits commercial reuse and private modifications, subject to its terms.
Keep the MIT copyright and permission notices with copies or substantial portions
of the software. No visible website-footer credit is required by this license.

## Writing, artwork, photographs, and identity assets

The MIT grant does not cover articles, biographies, public page copy, research
content/datasets, photographs, caricatures, other illustrations, or identity
assets such as the Starbase 430 site button. These remain reserved unless
separate permission or a specific license is stated. This exclusion includes:

- Editorial content in `src/log/`, `src/about/`, `src/links/`, `src/colophon/`,
  and `src/index.njk`, as well as editorial copy in other templates and data files.
- The historical timeline dataset in `data/fse-timeline.json`.
- Images in `src/assets/images/` and `src/_draft-assets/`, including derivatives.
- The polargraph illustration's SVG artwork and path data, including the SVG
  embedded in `polargraph.html`, the downloadable `polargraph.svg`, and `pablo.png`.
- Names, identity copy, and the Starbase 430 button as permission to represent
  this site or imply endorsement. Software reuse does not grant that permission.

Our original content is copyright Sam and Brea, except where another creator
is credited. Emily Moffat created the 2017 Sam and Brea caricatures. We do not
grant reuse rights to another creator's work through the software license.
The site button may be downloaded and displayed to link to Starbase 430, as
invited on the Colophon; that limited invitation remains in effect.

Rendering editorial material into HTML, feeds, or a standalone review does not
change its licensing. Reusable code and reserved content can coexist in a file;
the MIT grant applies to the software portions, not the accompanying content.

## Dependencies and other creators' material

Third-party packages and incorporated material retain their own licenses and
notices. This document does not replace those terms or grant rights we do not
hold. An artist credit is not a blanket license for downstream reuse.

The Tesla portrait contours were traced from
[N.Tesla.JPG on Wikimedia Commons](https://commons.wikimedia.org/wiki/File:N.Tesla.JPG),
credited there to an unknown photographer and marked public domain. Our
reservation of original illustration work does not claim rights over that
underlying photograph or other public-domain material. The tracing source is
also credited on the illustration page. See the provenance note in
[Pablo illustration documentation](docs/pablo-illustration.md#tesla-source-provenance).

License selection does not authorize publishing drafts, making this repository
public, or deploying the website. Those remain separate approval checkpoints.

The FSE article includes optimized versions of NASA’s Apollo 11 mission insignia,
sourced through Wikimedia Commons and marked public domain in the United
States there. The caption credits NASA and links to the source record.
Our software license and reserved-content statements do not claim ownership of
this material or grant additional rights. See [image provenance](docs/image-provenance.md).
