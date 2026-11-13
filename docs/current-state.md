# Current release-source state

Prepared November 13, 2026. This is a new Git repository containing reviewed
release sources, not a fork or mirror of historical development. It remains
private until explicit approval to make it public; deployment is separately gated.

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

Remaining launch work: verify/save this source checkpoint, obtain explicit public
visibility approval, configure hosting and domain/HTTPS, verify the deployed site,
and obtain final launch sign-off. The historical private repository stays private.

## Snapshot verification, November 13

The candidate uses an independent npm installation and contains 103 reviewed
source files. All 106 tests pass, including synthetic draft/asset isolation and
source-inventory rejection checks. The browser suite passes 144 checks and 46
axe scans with zero confirmed failures; 42 repeated contrast-inconclusive scan
results retain the established shared-pattern triage. Structure checks pass 11
production and 11 preview HTML pages. No real private drafts are included.

Compatible transitive patches update brace-expansion to 1.1.22 and markdown-it
to 14.3.3; npm reports zero known advisories. All 33 generated production files
are byte-identical to the approved pre-snapshot build. The heaviest page remains
the optional illustration at 511,433 bytes, leaving 567 below the hard ceiling.

The GitHub candidate is `sam-mcclanahan/starbase430-site`; its initial history
contains only the reviewed snapshot, with the approved public Git identity.
It stays private. No historic branch, tag, PR, stash, or old commit parent is
imported. The separate archive’s old hosted references remain private and are
no longer a dependency of this source-publication route. Support correspondence
about the historical repository remains optional and has not been sent.

Launch countdown: 11/15 complete, 4 remaining. Next is explicit approval to make
this repository public; hosting, hosted verification, and launch sign-off follow.
Do not infer any visibility or deployment authorization from the private push.

## Automated privacy milestone, November 13

Added pinned Gitleaks 8.30.1, repository-local staged/push hooks, identity and
release-root ancestry checks, image/metadata and private-path guards, redacted
credential scanning, and negative regression fixtures. A read-only Source checks
workflow independently runs the full suite; it has no deployment or write token.
Hooks must be explicitly installed in each clone with npm run setup:privacy.

GitHub’s private branch-protection API returned 403 on the current plan. No
upgrade or visibility change was made; required server-side status enforcement
is not claimed. CI and local hooks are independent layers, and neither can
guarantee recognition of every sensitive statement or replace editorial judgment.
See release-workflow.md for exact coverage, bypass limits, and future configuration.

Local verification of the privacy milestone: 118 tests pass, including 12
privacy regressions. Approved production/preview structure and hard budgets
remain unchanged. The source inventory now contains 111 reviewed files.
The complete local check:all pipeline also passes 144 browser checks and 46 axe
scans, with zero failures and 42 retained contrast-inconclusive findings.
