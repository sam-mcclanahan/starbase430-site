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
Sam explicitly approved public visibility on November 13, 2026. Keep the
historical repository private. Source pushes, site deployment, and domain
changes are separate actions. Preserve all third-party
notices and the distinction between MIT software and reserved editorial assets.

## Automated privacy protection

Run `npm run setup:privacy` after npm ci in every local clone. It verifies the
pinned official Gitleaks archive checksum, installs the CLI under ignored cache,
and configures repository-local pre-commit/pre-push hooks, Node path, and the
approved Git identity. It will not overwrite an unrelated hooksPath. CI uses
`npm run setup:privacy -- --no-hooks` and an ephemeral runner. Never skip hooks
to get past an error. Missing tools, unsupported platforms, and scan errors fail
closed. A new clone does not inherit local Git hooks automatically.

The pre-commit check reads the index’s exact blobs and manifest, including ignored
files force-added to Git. Working-file edits or deletion do not hide staged data.
It checks effective author/committer identity, private filenames/archives,
nonapproved email/home/private-network strings, draft flags, image dimensions
and identifying metadata, symlinks/submodules, and Gitleaks credential patterns.
A hash-bound exception preserves the reviewed site button’s dimension/color-only
EXIF block; changed images do not inherit it. Synthetic email exceptions are
explicit values, not an exemption for the test directory.

Before pushing, the hook requires the exact release repository destination,
rejects non-branch/tag pushes and deletion/non-fast-forward replacement of main,
and verifies outgoing commit identities, messages, inventories, and files. Its
ancestry must have only the approved release root; importing the private archive
is rejected even if merged into a clean tip. Gitleaks scans reachable tip history,
including intermediate commits, plus commit/tag messages through a separate stdin
scan, with redaction and without inline-allow or local
ignore-file bypasses. Scanner defaults remain enabled. The agent investigates
failures; no sensitive values are written to reports or public CI logs.

`npm run check:privacy` verifies reachable local branch/remote history and
`npm run check:staged` checks the index. `npm run check:all` includes privacy checks.
These tools cannot recognize every private fact written in prose or inspect text
inside an image. Contextual editorial/rights review remains part of approving a
new article, not an additional repetitive accessibility checklist. Treat PR
bodies, comments, screenshots, and attachments as publishable too.

The read-only Source checks workflow runs privacy, tests, structure, budgets, and
accessibility. Actions are pinned to official full commit SHAs, checkout does not
persist credentials, dependency lifecycle scripts are disabled, and no deployment
secret, write permission, automatic merge, or publishing step is present. Reports
are not uploaded. CI detects problems after a push; local hooks protect before
upload and can still be bypassed by someone controlling their own clone.

Before visibility approval GitHub returned 403 for private branch protection on
this plan. After Sam approved public source on November 13, main protection was
enabled without a plan upgrade. Main requires Privacy and release checks from
GitHub Actions (app 15368), with the branch up to date, including administrators.
Force pushes and deletion are blocked. Push reviewed changes to a branch, wait
for green CI, then use an authorized merge or checked fast-forward to update main.
There is no additional required reviewer count; do not bypass the status gate.
Native GitHub secret scanning and secret push protection are enabled alongside
local Gitleaks and source/privacy checks. Sam separately approved the first website
deployment and DNS cutover November 13, 2026. Future source pushes never grant
publication approval. See [hosting](hosting.md).

## Prepared website release workflow

Website release is separate from the read-only Source checks workflow. It runs
only when manually dispatched on main. Its default publish=false mode prepares
and uploads a checked production-only artifact, without deploying. The artifact
is built in a fresh directory and expires after one day; private authoring and
browser reports never belong in it. Publication needs publish=true, successful
checks, the protected github-pages approval, and the configured canonical domain.
No Cloudflare API credential is needed for Pages deployment. Neither a source
push nor an ordinary preparation run grants first-launch approval.
