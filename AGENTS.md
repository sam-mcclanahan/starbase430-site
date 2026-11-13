# Starbase 430 release-source instructions

Read `docs/current-state.md`, `docs/project-goals.md`, and `roadmap.md` first.
Use npm and Node.js 22 or newer. Preserve unrelated local work.

This repository is a reviewed release snapshot with fresh Git history. Keep it
private until Sam explicitly approves visibility. Source approval does not approve
hosting, deployment, merging PRs, or publishing additional content.

Only approved articles and assets belong here. Keep unpublished writing, archival
masters, internal research, private review reports, and recovery history outside
this repository. Do not import the private archive’s Git history or mirror refs.
Use synthetic draft fixtures in tests; do not copy private drafts into tests.

Run `npm run check:all` for release changes. Use change-based accessibility review:
automated checks and agent-owned triage for normal articles; focused human review
for changed interactions/shared patterns. Do not require a repeated per-article
manual checklist. Retain the 100,000-byte preference and 512,000-byte hard limit.
New source files require review and an update to `release-manifest.json`.
