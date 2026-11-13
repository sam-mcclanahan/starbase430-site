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

On November 13 GitHub returned 403 for private branch protection, requiring a
plan upgrade or public visibility. Neither is authorized. CI currently reports
checks without server-enforced protected-main rules. Enable required status
checks, force-push/deletion protection, and available native secret/push protection
when supported and separately configured; do not claim they are active now.
