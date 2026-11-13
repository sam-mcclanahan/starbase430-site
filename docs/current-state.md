# Current release-source state

Prepared November 13, 2026. This is a new Git repository containing reviewed
release sources, not a fork or mirror of historical development. Sam explicitly
approved public source visibility on November 13, 2026. Website deployment
remains separately gated; the historical repository stays private.

Approved launch entries are website development, Pablo, and First Step Epoch.
Their completion dates, routes, bylines, and content are retained. Unpublished
library/media drafts, comparison assets, internal notes, and old PR/Git history
are outside this repository. The first release requires three approved Logs.

The canonical full-entry feed is `/feed.xml`, newest 20, with identical copies
at `/log/feed.xml` and `/projects/feed.xml`. Authors use first names and no email.
Shared FSE labels link to the approved explanatory article. FSE uses elapsed
TAI SI seconds, with reviewed historical UTC offsets and a fixed lunar epoch.

The static CSS nebula/starfield is shared by all pages. Ordinary reading and
navigation need no JavaScript. The optional Pablo illustration retains keyboard,
slider, dragging, animation, reduced-motion, text, PNG, and SVG alternatives.

The prior representative accessibility review covered Chromium automation,
contrast triage, native Firefox focus/navigation/disclosures and 200%/400% zoom,
plus dated Pablo assistive-technology evidence. This is bounded evidence, not
WCAG certification. Snapshot-specific automated results are recorded in the
roadmap after verification; do not reuse old counts as a new pass.

Remaining launch work: configure hosting and domain/HTTPS, verify the deployed site,
and obtain final launch sign-off. The historical private repository stays private.

## Verified release checkpoint, November 13

The candidate uses an independent npm installation and contains 111 reviewed
source files. All 118 tests pass, including 12 privacy regressions, synthetic
draft/asset isolation, and source-inventory rejection checks. The browser suite passes 144 checks and 46
axe scans with zero confirmed failures; 42 repeated contrast-inconclusive scan
results retain the established shared-pattern triage. Structure checks pass 11
production and 11 preview HTML pages. No real private drafts are included.

Compatible transitive patches update brace-expansion to 1.1.22 and markdown-it
to 14.3.3; npm reports zero known advisories at snapshot verification. The initial
snapshot preserved all 33 generated production files byte-for-byte; the subsequent
Linux timeline correction changes one card anchor without changing article copy.
The heaviest page remains
the optional illustration at 511,433 bytes, leaving 567 below the hard ceiling.

The GitHub candidate is `sam-mcclanahan/starbase430-site`; its initial history
contains only the reviewed snapshot, with the approved public Git identity.
It was kept private until Sam’s explicit November 13 approval. No historic branch,
tag, PR, stash, or old commit parent is
imported. The separate archive’s old hosted references remain private and are
no longer a dependency of this source-publication route. Support correspondence
about the historical repository remains optional and has not been sent.

Launch countdown: 12/15 complete, 3 remaining. Next is separately authorized
hosting/domain/HTTPS setup, followed by hosted verification and launch sign-off.

## Automated privacy milestone, November 13

Added pinned Gitleaks 8.30.1, repository-local staged/push hooks, identity and
release-root ancestry checks, image/metadata and private-path guards, redacted
credential scanning, and negative regression fixtures. A read-only Source checks
workflow independently runs the full suite; it has no deployment or write token.
Hooks must be explicitly installed in each clone with npm run setup:privacy.

Before public-source approval, GitHub’s private branch-protection API returned
403 on the current plan. Following approval, public visibility enabled the server
protections recorded below without a plan upgrade. CI and local hooks cannot
guarantee recognition of every sensitive statement or replace editorial judgment.
See release-workflow.md for exact coverage, bypass limits, and future configuration.

Local verification of the privacy milestone: 118 tests pass, including 12
privacy regressions. Approved production/preview structure and hard budgets
remain unchanged. The source inventory now contains 111 reviewed files.
The complete local check:all pipeline also passes 144 browser checks and 46 axe
scans, with zero failures and 42 retained contrast-inconclusive findings.

The first Linux CI run passed privacy, tests, structure, and budgets but caught
font-dependent overlap between two FSE timeline cards. The Stardust connector now
anchors at its card top, preserving timeline height, scale, and text size. Commit
and tag messages also receive a separate redacted Gitleaks scan.

## Final public-source exposure review, November 13

Reviewed source checkpoint: `a5ff68f`, followed by this documentation refresh.
[GitHub Source checks](https://github.com/sam-mcclanahan/starbase430-site/actions/runs/43414678223)
passed on that checkpoint: 118 tests, 144 browser checks, 46 axe scans, zero
confirmed failures, and 42 retained contrast-inconclusive findings. The earlier
Linux overlap failure is resolved; its check remains enabled.

The approved exposure boundary includes all 111 source files: three approved
articles, their optimized assets and illustration alternatives, software, tests,
licenses, and maintenance/provenance documentation. MIT software and reserved
editorial/third-party rights remain distinct. Private drafts, source masters,
internal research, recovery checkouts, and the archive's history remain excluded.

Hosted review found only main, with no tags, PRs, issues, releases, or uploaded
Actions artifacts; the wiki is disabled and Pages is unconfigured. The three
reviewed commits use Sam McC and the approved GitHub noreply address. Both hosted
Actions logs passed pinned credential scanning and contact/personal-path checks;
standard hosted-runner infrastructure paths are not personal local paths.

The repository was still private at that review; Sam subsequently explicitly
approved visibility on November 13. Public source makes these articles/assets/documentation
and Git/Actions history readable and copyable before website hosting. It does
not approve website deployment, DNS changes, or making the archive public.
The final documentation checkpoint cc32e7f and its hosted logs passed review
and CI before visibility changed.

## Public-source approval and server protections, November 13

Sam explicitly approved making only sam-mcclanahan/starbase430-site public. The
historical sam-mcclanahan/starbase430 repository remains private. GitHub Pages
is unconfigured; the only workflow checks source and does not deploy anything.

GitHub native secret scanning and push protection are enabled. Main requires
the Privacy and release checks status specifically from GitHub Actions (app
15368), with the branch up to date; administrators are included. Force pushes
and deletion of main are blocked. No paid plan upgrade, additional approval
requirement, deployment credential, or automated publication step was added.
Use a reviewed branch and green CI before an authorized main update.

## GitHub Pages preparation and homelab goal, November 13

Sam approved recording eventual public hosting from home as an explicit learning
milestone, in addition to a home-network mirror. GitHub Pages is selected for
the first host; Cloudflare retains registration and DNS. Pages is configured for Actions with a required Sam approval and main-only
protected deployment environment; source approval does not authorize launch.

The manually triggered Website release workflow prepares only by default. A
publication request additionally needs a successful checked build, the protected
github-pages environment, and the canonical custom domain. The independent
build:release command generates .cache/release-site without a hosting API and
checks the exact upload directory. Development previews remain separate.

Launch countdown stays 12/15 complete, 3 remaining until domain/HTTPS and the
actual hosting setup are verified. See hosting.md and the post-launch roadmap.

Preparation checks: 122 tests pass; 144 browser checks and 46 axe scans pass
with zero confirmed failures and 42 retained inconclusive findings. The source
inventory is now 115 files. The exact production release contains 33 files and
11 HTML pages, maximum 511,433 bytes. Nine local static-server routes/resources
passed independently of GitHub. Hosted CI and a preparation-only workflow run
will verify the selected main checkpoint before first deployment is considered.
No deployment or DNS change has been made.
