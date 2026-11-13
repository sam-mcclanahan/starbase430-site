# Starbase 430 release-source instructions

Read `docs/current-state.md`, `docs/project-goals.md`, and `roadmap.md` first.
Use npm and Node.js 22 or newer. Preserve unrelated local work.

This repository is public following Sam’s explicit approval on November 13, 2026.
It contains a reviewed release snapshot with fresh Git history. Keep the historical
repository private. Source publication does not approve hosting, deployment,
merging PRs, or publishing additional content.

Only approved articles and assets belong here. Keep unpublished writing, archival
masters, internal research, private review reports, and recovery history outside
this repository. Do not import the private archive’s Git history or mirror refs.
Use synthetic draft fixtures in tests; do not copy private drafts into tests.

Run `npm run check:all` for release changes. Use change-based accessibility review:
automated checks and agent-owned triage for normal articles; focused human review
for changed interactions/shared patterns. Do not require a repeated per-article
manual checklist. Retain the 100,000-byte preference and 512,000-byte hard limit.
New source files require review and an update to `release-manifest.json`.

## Mandatory privacy gate

After npm ci, run npm run setup:privacy in each local clone to install the pinned
scanner and repository-local hooks. Never bypass a failed privacy hook with
--no-verify or skip a missing scanner. The agent owns investigation; do not ask
Sam to repeat manual checks. Hooks inspect exact staged blobs and outgoing Git
commits, identities, destination, ancestry, images, and credentials. CI is an
independent second check; it runs after upload and cannot undo public exposure.
Changes to privacy-policy.json, hook/checker code, scanner configuration, or the
workflow require explicit review. Narrow synthetic exceptions must not become
blanket test exclusions or allowlists. Keep scanner output redacted.

Main requires the GitHub Actions Privacy and release checks status, including for
administrators; force pushes and deletion are blocked. Push reviewed changes to
a branch, wait for CI, then update main through an authorized merge or a checked
fast-forward. Do not bypass protection. Native secret scanning and push protection
are enabled in addition to local gates. GitHub Pages preparation is authorized;
website publication and DNS activation still require the launch checkpoint.

Read docs/hosting.md before hosting work. Website release defaults to preparation
only; never dispatch publish=true or approve its protected environment without
explicit publication authorization. Keep public homelab hosting as a distinct
post-launch learning milestone alongside the local mirror. Production artifacts
must be built with npm run build:release, never from a development-server directory.
