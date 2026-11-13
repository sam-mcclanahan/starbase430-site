# Source publication and private authoring

The public-source candidate starts with a fresh initial commit. Do not copy Git
history, old branches/tags/PRs, private stashes, backups, archival masters, internal
research, or unpublished prose from the historical private repository.

This repository is the authoritative codebase once the candidate is accepted.
Keep unpublished writing in private authoring storage. When an article is ready,
review prose, descriptions, metadata, asset rights, and image metadata; then copy
only approved source/assets here and update `release-manifest.json`. Commit only
reviewed files, run the full checks, and verify the intended private/public boundary.
Actual private drafts must not be used as public test fixtures.

`release-manifest.json` is an explicit file inventory for the source boundary.
`npm run check:release` rejects unexpected files and draft-marked content in site
sources. Its tests use synthetic fixtures to verify draft-page and asset isolation.
Ignore rules alone do not remove already committed material or erase history.
Future additions need review; a new root commit does not sanitize careless updates.

Use the approved public Git identity and GitHub noreply email. No private email,
credentials, local master paths, or identifying image metadata belongs in commits.
The repository remains private until explicit visibility approval. Source pushes,
site deployment, and domain changes are separate actions. Preserve all third-party
notices and the distinction between MIT software and reserved editorial assets.
