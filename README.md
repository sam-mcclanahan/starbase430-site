# Starbase 430

<a href="https://starbase430.com/"><img src="src/assets/icons/favicon.svg" width="64" height="64" alt="Visit Starbase 430"></a>

Source for Sam and Brea’s independent-web workshop: maker projects shaped by
curiosity, joyful fandom, and optimistic futures. Built with Eleventy, Markdown,
Nunjucks, npm, and a static green-and-silver space theme.

**Live at [starbase430.com](https://starbase430.com/)** since November 13, 2026.
[Read the Mission Log](https://starbase430.com/log/) ·
[RSS feed](https://starbase430.com/feed.xml) ·
[About Sam and Brea](https://starbase430.com/about/) ·
[Colophon](https://starbase430.com/colophon/)

The site uses local assets and system fonts, with no analytics or advertising.
Reading and navigation work without JavaScript. The separately linked Pablo
simulation uses optional JavaScript and includes static and written alternatives.

Start with [Pablo the Polargraph](https://starbase430.com/log/pablo-the-polargraph/),
[building for the small web](https://starbase430.com/log/building-starbase-430-for-the-small-web/),
or [First Step Epoch](https://starbase430.com/log/first-step-epoch/).

This public repository contains reviewed source with independent Git history.
Historical development and unpublished writing remain in private storage.

## Local setup

Use Node.js 22 or newer and npm:

```sh
npm ci --ignore-scripts
npm run setup:privacy
npm run dev
```

Eleventy prints the local preview URL. `npm run build` generates `_site/`.
`npm run build:release` creates a fresh, checked production copy in
`.cache/release-site/`, independently of GitHub or a hosting credential.
The npm package is marked `private` to prevent accidental npm publication;
the GitHub source repository is public.

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

Individual commands: `npm test`, `npm run check:release`, `npm run check:privacy`, `npm run check:site`,
`npm run check:budgets`, and `npm run check:a11y`. Conservative uncompressed page
accounting warns above 100,000 bytes and fails above 512,000 bytes; it counts both
image alternatives and differs from browser-selected resource measurements.

## Finding your way around

| Directory | Contents |
| --- | --- |
| `src/` | Markdown articles, page templates, shared styles, and local assets. |
| `data/` | Reviewed exploration-timeline data. |
| `scripts/` | Builds, image processing, privacy checks, and accessibility checks. |
| `test/` | Automated tests and synthetic fixtures. |
| `docs/` | Maintenance instructions, project goals, and provenance. |

## Maintenance

- [Current state](docs/current-state.md) and [roadmap](roadmap.md).
- [Project goals](docs/project-goals.md) and [editorial guide](docs/editorial-guide.md).
- [Accessibility testing](docs/accessibility-testing.md).
- [Source publication boundary](docs/release-workflow.md).
- [Hosting, local mirrors, and eventual public homelab hosting](docs/hosting.md).
- [FSE time-standard maintenance](docs/fse-time-standard.md).
- [Image provenance](docs/image-provenance.md) and [image processing](docs/image-optimization.md).

`npm run update:fse-timeline` regenerates only the timeline from its reviewed
`data/fse-timeline.json` dataset. `npm run build:favicons` regenerates icons.
`node scripts/build-pablo-tesla.js` rebuilds the approved illustration exports.
Review generated changes and page sizes before committing them.

## Bugs and contributions

This is a personal website, maintained by Sam and Brea. If you find a broken
link or a reproducible bug, [open an issue](https://github.com/sam-mcclanahan/starbase430-site/issues)
with the affected URL, steps to reproduce, and relevant browser details. Keep
credentials, personal information, and private writing out of public reports.
Discuss substantial changes before opening a pull request.

For code contributions, follow [the repository instructions](AGENTS.md), install
the privacy hooks, and run the documented checks. Source changes run CI;
publishing the website is a separately approved, manual action.

## License and content

Reusable software is MIT licensed. Writing, photographs, artwork, and identity
assets have separate rights; see [LICENSE-SCOPE.md](LICENSE-SCOPE.md). Credits and
third-party notices must remain with their associated material.
