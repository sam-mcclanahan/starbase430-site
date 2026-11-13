# Starbase 430

Source for Sam and Brea’s independent-web workshop: maker projects shaped by
curiosity, joyful fandom, and optimistic futures. Built with Eleventy, Markdown,
Nunjucks, npm, and a static green-and-silver space theme.

This repository starts with a reviewed release snapshot. It remains private
pending explicit visibility approval, and nothing here implies the site has
been deployed. Historical development and unpublished writing are kept separately.

## Local setup

Use Node.js 22 or newer and npm:

```sh
npm ci --ignore-scripts
npm run setup:privacy
npm run dev
```

Eleventy prints the local preview URL. `npm run build` generates `_site/`.
Reading and navigation need no JavaScript; Pablo’s separately linked interactive
illustration uses optional JavaScript and has static and written alternatives.

## Checks

```sh
npm run setup:a11y
npm run check:all
```

The pinned privacy scanner and test browser are development tools, downloaded
separately. New clones must run `npm run setup:privacy` to enable local hooks. Browser
checks build fresh production/preview outputs on loopback, block external requests,
and write ignored reports under `.a11y/`. They do not deploy or change repository
visibility. Chromium may require permission to launch in a sandboxed agent session.

Individual commands: `npm test`, `npm run check:release`, `npm run check:site`,
`npm run check:budgets`, and `npm run check:a11y`. Conservative uncompressed page
accounting warns above 100,000 bytes and fails above 512,000 bytes; it counts both
image alternatives and differs from browser-selected resource measurements.

## Maintenance

- [Current state](docs/current-state.md) and [roadmap](roadmap.md).
- [Project goals](docs/project-goals.md) and [editorial guide](docs/editorial-guide.md).
- [Accessibility testing](docs/accessibility-testing.md).
- [Source publication boundary](docs/release-workflow.md).
- [FSE time-standard maintenance](docs/fse-time-standard.md).
- [Image provenance](docs/image-provenance.md) and [image processing](docs/image-optimization.md).

`npm run update:fse-timeline` regenerates only the timeline from its reviewed
`data/fse-timeline.json` dataset. `npm run build:favicons` regenerates icons.
`node scripts/build-pablo-tesla.js` rebuilds the approved illustration exports.
Review generated changes and page sizes before committing them.

## License and content

Reusable software is MIT licensed. Writing, photographs, artwork, and identity
assets have separate rights; see [LICENSE-SCOPE.md](LICENSE-SCOPE.md). Credits and
third-party notices must remain with their associated material.
