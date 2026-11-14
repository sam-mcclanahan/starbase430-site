# Contributing to Starbase 430

Starbase 430 is Sam and Brea's personal website. Bug reports, accessibility
feedback, and focused code suggestions are welcome. Please discuss substantial
changes in an issue before preparing a pull request.

## Report a problem or suggest a change

[Open an issue](https://github.com/sam-mcclanahan/starbase430-site/issues/new/choose)
with the affected page or file, what happened, what you expected, and enough
steps to reproduce it. Include the browser/version when relevant. Screenshots
are optional; remove personal information before sharing them.

Keep credentials, personal contact details, and private writing out of public
issues and pull requests. Report suspected vulnerabilities privately using
[SECURITY.md](SECURITY.md).

## Previewing and checking the source

The [README](README.md#preview-the-site-locally) explains how to preview the site
with Node.js and npm. Previewing does not require Git hooks or an identity change.
For checks on an unchanged clone, the documented `setup:privacy -- --no-hooks`
option installs only the pinned scanner; it does not configure Git identity.

The default `npm run setup:privacy` command is for this repository's maintainers:
it installs mandatory hooks and configures the approved maintainer name and email.
Do not use that command to replace your own identity when preparing a contribution.

## Code suggestions and reuse

The current privacy gates deliberately allow only approved maintainer identities,
this repository's push destination, and the reviewed source inventory. A fork
with new author commits or new files will not pass every maintainer check
unchanged. Discuss a contribution path with the maintainers before submitting
code. Keep your own Git identity and preserve the privacy checks. Reporting
the problem in an issue is also a useful contribution.

Keep changes focused and explain the resulting behavior and relevant validation.
Preserve no-JavaScript reading/navigation, accessibility, local assets, resource
budgets, and the separation between public source and private authoring.

Reusable software is MIT licensed. Writing, photographs, artwork, timeline data,
and identity assets have separate rights; review [LICENSE-SCOPE.md](LICENSE-SCOPE.md)
before copying or adapting material. Sharing source does not grant permission
to represent Starbase 430 or imply endorsement.

## Maintainer workflow

Follow [AGENTS.md](AGENTS.md), install the mandatory local privacy hooks, and run
`npm run check:all`. New source files need an entry in `release-manifest.json`.
Use a reviewed branch and the required GitHub checks before merging into `main`.
Website deployment remains a separately approved manual action.
