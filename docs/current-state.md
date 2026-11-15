# Current project state

Updated November 15, 2026. Verification dates and scope are stated below;
512KB Club membership was verified November 15; other pending community
submissions have not been rechecked. Accepted requirements live in
[project goals](project-goals.md); remaining work lives in the
[roadmap](../roadmap.md#post-launch-backlog).

## Published website and source

- Website: https://starbase430.com/; **15/15 launch gates complete**.
- Public release source: `sam-mcclanahan/starbase430-site`, created from a
  reviewed snapshot with independent Git history. The historical repository,
  unpublished writing, masters, research, and recovery worktrees remain private.
- Latest deployed source: `e10826c`, the reviewed Outpost navigation release.
  Later source changes have not been deployed.
- GitHub Pages hosts the static site; Cloudflare retains registration and DNS.
  HTTPS is enforced; HTTP and www redirect to the canonical HTTPS apex.
- Source pushes run checks only. Future website publication requires separate
  authorization, the manually dispatched release workflow, and its protected
  deployment approval. See [hosting](hosting.md) and [release workflow](release-workflow.md).

November 14 public repository review: corrected the stale About description,
added the canonical website URL, and set relevant Eleventy, IndieWeb, Small Web,
maker-project, static-site, personal-website, and accessibility topics. Verified
the historical repository remains private and main still requires the GitHub
Actions check, including administrators, with force pushes/deletion blocked.
Secret scanning and push protection remain enabled. Pages retains the canonical
domain, enforced HTTPS, and the main-only protected manual deployment route.
The initial settings-page review found the dependency graph, Dependabot alerts,
and private vulnerability reporting disabled; the subsequently approved
configuration is recorded below. These metadata changes do not deploy the website.
README and maintenance-document updates, alongside community-status updates,
were merged in [PR #4](https://github.com/sam-mcclanahan/starbase430-site/pull/4).

November 14 security configuration: Sam approved enabling the dependency graph,
Dependabot alerts, and private vulnerability reporting for this public repository
only. All three were enabled and verified after reloading GitHub's settings.
Automatic dependency submission and Dependabot security-update PRs remain off;
no version-update configuration was added. The existing GitHub preset that
dismisses low-impact development-dependency alerts remains unchanged and does
not create update PRs. The initial open-alert query returned zero; this is not
a guarantee against future findings or a substitute for reviewing dismissed alerts.

The repository's custom watch subscription now includes Security alerts.
Existing account settings deliver watching/custom notifications and Dependabot
alerts on GitHub and by email; no address is published here. This verifies
configuration, not delivery of a fabricated test report. [SECURITY.md](../SECURITY.md)
directs sensitive security concerns to the private form and ordinary bugs to
Issues. Local hooks, branch protection, secret scanning, push protection, and
manual website deployment remain in place; no website release was dispatched.

Fresh November 14 checks for that documentation review passed 123 tests, the
115-file source inventory, privacy-history checks, 11 production/11 preview
structure checks, all hard budgets, 144 Chromium checks, and 46 axe scans.
There were zero confirmed failures and the 42 established contrast-inconclusive
findings; this is not a new conformance or screen-reader certification. The
independent release build contains 33 files, and website/tooling sources are
unchanged from the deployed checkpoint. All 34 local documentation link targets
exist and all eight website links in the revised README returned HTTP 200.
The locked dependency audit reported zero known npm advisories. The local
test browser was restored in ignored cache; no deployment was performed.

## GitHub presentation and first tagged release

November 14: Sam selected the original nebula social-preview card. The approved
1280 × 640 PNG was uploaded to the repository’s social-preview setting and
verified after reloading. Its editable sources and comparison artifacts remain
outside this release repository; the card adds no website resources.

Sam approved publishing [v0.1.0 — Starbase 430: first public release](https://github.com/sam-mcclanahan/starbase430-site/releases/tag/v0.1.0)
on November 14. The regular, non-prerelease GitHub release and tag point to
`1fa8ddf2540ee522c37451fcaf78a56df44b0ad6`, with the approved launch-summary
notes. Required CI and a fresh local privacy-history check passed. This is a
source milestone; article dates were retained, no website deployment was
requested, and the latest deployed source remains `e10826c`.

## Visitor setup and repository housekeeping

November 14: separated visitor preview/check instructions from maintainer setup.
The README now links the first source release and the main-branch source-check
badge. CONTRIBUTING.md explains the personal-site contribution process and the
owner-specific privacy gates. The bug-report template asks for affected pages,
reproduction steps, expectations, and browser details, with a private security
reporting route. The default maintainer setup still installs mandatory hooks and
configures the approved Git identity; visitors retain their own identity.
No privacy policy, hook/checker code, or Actions workflow was changed.

Removed nine obsolete remote branches after verifying eight were ancestors of
main and the remaining FSE branch exactly matched its merged squash-commit tree.
Exact-SHA leases protected against deleting a changed branch; the private archive,
local recovery worktrees, main, and release tags were untouched. Enabled GitHub's
automatic deletion of head branches after future merged PRs. Website deployment
remains a separate manual action, with the latest deployment still `e10826c`.

Validation passed 126 tests, the 118-file reviewed source inventory, privacy,
production/preview structure, and hard page budgets, plus 144 Chromium checks
and 46 axe scans (zero failures; the same 42 retained inconclusive findings).
The issue template's YAML front matter and 33 relative documentation links were
checked. All 33 generated production files remain byte-identical to the reviewed
baseline. No website, privacy checker, or workflow source changed.

## Current content and identity

Three approved Logs are published: website development, Pablo the Polargraph,
and First Step Epoch. Their original completion dates and first-name bylines
are retained. Library/media drafts remain in private authoring storage.

The canonical full-entry feed is `/feed.xml`, newest 20, with byte-identical
`/log/feed.xml` and `/projects/feed.xml` compatibility copies. Creators use first
names without email addresses. FSE labels link to the explanatory article and
use elapsed TAI SI seconds in megaseconds with six decimal places.

The homepage has a representative h-card for Starbase 430, its canonical URL,
and approved description. Its visible Sam on GitHub link retains `rel="me"`;
Sam's public GitHub profile links back to the site. Reciprocal domain sign-in
through IndieLogin succeeded with public-data-only GitHub authorization.

The active IndieWeb Webring uses homepage Previous outpost / IndieWeb Webring /
Next outpost links. The reviewed Outpost styling has green directional edges,
a silver center control, responsive wrapping/stacking, visible keyboard focus,
and decorative aria-hidden arrows. Styles load on Home only. Ordinary reading
and navigation require no JavaScript. Geekring is excluded until acceptance.

The static CSS nebula/starfield, system fonts, original identity assets, privacy
goals, and separate MIT software/content rights remain in effect. Pablo's
optional interactive page retains keyboard, slider, dragging, drawing,
reduced-motion, written, PNG, and SVG alternatives.

## Completed release checkpoints

| Change | Main commit | Successful Website release |
| --- | --- | --- |
| First public launch | `e816120` | [43426626231](https://github.com/sam-mcclanahan/starbase430-site/actions/runs/43426626231) |
| Homepage h-card and GitHub identity link | `6f971fe` | [43486294332](https://github.com/sam-mcclanahan/starbase430-site/actions/runs/43486294332) |
| Active IndieWeb membership navigation | `89593ba` | [43490978466](https://github.com/sam-mcclanahan/starbase430-site/actions/runs/43490978466) |
| Reviewed Outpost navigation styling | `e10826c` | [43498505433](https://github.com/sam-mcclanahan/starbase430-site/actions/runs/43498505433) |

All checkpoints above were approved separately. Final launch sign-off was
recorded at `9b70326`. Earlier preparation, privacy, and domain-cutover history
remains in Git and the focused hosting/release documents.

At the November 13 Outpost checkpoint, all 33 live HTTPS files matched the
independent checked production build. Both ring directions redirected to
neighboring member sites with the public homepage referrer. The membership
release also passed the ring's own live link check and public-directory review.

Recorded local verification for the reviewed design: 123 tests, 144 Chromium
browser checks, and 46 axe scans, with zero failures and the 42 established
contrast-inconclusive findings. Privacy, the 115-file release inventory, fresh
production/preview structure checks (11 HTML pages each), and hard budgets
passed. Required hosted CI and release checks also passed. App-browser review
confirmed narrow layout and keyboard traversal through all three ring controls
and out to the footer. These are dated observations, not WCAG certification or
a fresh assistive-technology review.

Current conservative resource totals at that checkpoint: Home **24,365 bytes**;
optional Pablo illustration **511,433 bytes**, leaving **567 bytes** below the
512,000-byte hard ceiling. These generated-file totals differ from Firefox's
browser-selected uncompressed resource measurements.

## Community submissions and membership

Status below reflects dated submissions and checks, including the November 15
512KB Club confirmation. Submission,
archive appearance, crawl scheduling, indexing, and membership are distinct.

| Destination | Recorded status | Next confirmation |
| --- | --- | --- |
| [IndieWeb Webring](https://xn--sr8hvo.ws/directory) | Active, public profile listed, homepage links published, ring link check passed. | Maintain links and public identity when changing the homepage. |
| [Tech Makers](https://webring.stavros.io/) | [Application PR #5](https://github.com/skorokithakis/webring/pull/5) submitted November 13 with site URL, RSS, and AI-assistance disclosure; acceptance pending. GitHub subscription and existing participating email/in-app delivery verified. | Monitor PR comments and state. A merge requires live-directory verification before membership links; closure without merge requires reading the explanation. Review December 13 if unanswered; no reminder or polling job was created. |
| [Galactic Webring](https://darkosparko.nekoweb.org/webrings/galactic-webring/) | Declined due to the maintainer's AI-assistance expectations after reviewing the site. Response reviewed November 14, following Sam's November 13 eligibility inquiry. | Closed; no application or artwork work is planned. Static HTML participation was not answered. The private email and headers remain outside this repository. |
| [512KB Club](https://512kb.club/) | Membership confirmed November 15 in the official Green Team list, showing starbase430.com at 21.11 KB. Sam approved the homepage membership-button preview November 15; it is not deployed. | Maintain the listing and remeasure Home after future publication. The listed size is historical, not a live counter or a claim about every page. |
| [Geekring](https://geekring.net/list.txt) | Application receipt confirmed; acceptance unconfirmed. | Find our domain and assigned site number in the public membership list before adding member links. |
| [Marginalia Search](https://marginalia-search.com/) | Both hostnames were unknown at the pre-submission check. [Crawl request #842](https://github.com/MarginaliaSearch/submit-site-to-marginalia-search/issues/842) was submitted. | Confirm actual indexed pages; an issue closure or crawl-list entry alone is insufficient. |

The submitted 512KB Club measurement was Sam's Firefox 160.0 measurement on
November 13 at 10:48 AM EST: **21.11 kB, 4 requests**, cache disabled and page
fully scrolled. It predates the homepage identity and ring additions; retain it
as historical evidence rather than presenting it as a current measurement. The official
listing verified November 15 reports that submitted 21.11 KB value. A blank
original mailing-list archive body no longer leaves membership in doubt: the
public directory listing establishes acceptance.

Membership secrets, email credentials, raw mail headers, and private review
artifacts remain outside the public repository. Do not copy them into status
notes, issues, or source. No new submission or follow-up is authorized by this table.

November 13: Sam added becoming more active in the Fediverse as a post-launch
goal, using the existing Mastodon account for project sharing and conversation
at a sustainable pace. Fediring membership is deferred; the prepared eligibility
inquiry was not sent. No posts, profile changes, or automation were performed.
See the [community backlog](../roadmap.md#community-and-discovery).

Future inquiries follow the [submission guidance](../roadmap.md#future-submission-guidance):
check workflow eligibility early, disclose assistance accurately, and distinguish
documentation assistance from how a project was built. An unpublished AI policy
remains unknown, and a refusal is a compatibility decision rather than a reason
to conceal the workflow or change the site to qualify.

## Prepared Dot monitoring plans

Prompts were prepared for Sam to give Dot. Their installation/execution in Dot
has not been independently confirmed; this repository creates no scheduled jobs.
All requested checks run at **05:00 America/New_York**, notify only on confirmed
success, cancel remaining checks after success, and end silently if exhausted.
Fetch failures or absence do not establish rejection.

- **Geekring and 512KB Club:** November 14, 15, 16, 18, 21, 26, and December 4,
  2026 (1, 2, 3, 5, 8, 13, and 21 days after submission). Check the official
  membership lists; mailing-list archive appearance does not establish club membership. 512KB
  Club's success condition was met November 15; no further membership checks
  are needed for that destination. External Dot job cancellation is not verified
  here. Geekring remains unconfirmed.
- **Marginalia:** November 20 and 27; December 4, 11, 18, and 25, 2026;
  January 1 and 8, 2027. Success requires actual indexed Starbase 430 pages.
  Domain-information pages, screenshots, and pending/closed requests do not count.

## Pablo optimization approved for source integration

November 14: the reviewed `codex/pablo-lossless-size` branch implements integer-delta
coordinate encoding and generates the initial portrait from the same decoded
points. The conservative interactive-page total is now 376,545 bytes, down from
511,433, saving 134,888 and leaving 135,455 below the unchanged 512,000-byte
ceiling. Every approved point and stroke is unchanged; the PNG and standalone
SVG exports remain byte-for-byte identical. The readable contour master,
controller features, accessibility markup, and resource-loading boundaries are
preserved; the existing generator updates the reviewed HTML digest.

Validation passed 127 tests, the 118-file inventory, privacy checks, 11 production
and 11 preview structure checks, hard budgets, 144 Chromium checks, and 46 axe
scans (zero failures; the same 42 retained inconclusive findings). Ten targeted
before/after browser comparisons at widths of 960 and 320 pixels matched exactly
for initial, Reset, reduced-motion completion, CSS-off, and JavaScript-off views.
Of the 33 production files, only the optimized embedded HTML changed; all other
files match the baseline. This is automated change-based verification, not a
new WCAG conformance or assistive-technology certification.

Sam approved the local preview on November 14 and authorized pushing the source,
opening a PR, and merging after required checks pass. The preview remains on
port 8081. Source integration does not authorize deployment; the live site
remains at `e10826c`.
See [illustration maintenance](pablo-illustration.md#lossless-size-optimization-november-14-2026).

## Local Outpost connections preview

November 15: Sam requested a reusable homepage home for confirmed community
buttons. The existing Webrings panel is now Outpost connections, with separate
Webrings and Affiliations groups. IndieWeb navigation and its existing
webrings-heading fragment are preserved. The 512KB Club Green Team button is
locally hosted at its native 88 × 31 pixels, with a visible text link, padded
click target, responsive wrapping, and existing focus/new-tab behavior. The
Links page now acknowledges our homepage's confirmed listing.

Confirmed badges live in `src/_data/community.json`; the shared partial is
`src/_includes/partials/community-badges.njk`. Add only reviewed memberships,
local assets, descriptive visible labels, and their intrinsic dimensions.
Document third-party provenance and inventory any new files in the release
manifest. Home-only styles keep unrelated articles free of badge weight.
The official GIF was losslessly converted to a 385-byte PNG with identical
pixels; the original downloads remain outside the source repository.

Validation passed 127 tests, the 121-file source inventory, privacy checks,
11 production and 11 preview structure checks, all hard page budgets, 144
Chromium checks, and 46 axe scans (zero failures; the same 42 retained
inconclusive findings). Focused browser checks at 1440 and 320 pixels verified
the native button dimensions, padded click target, keyboard order and focus,
text-spacing reflow, CSS-off/new-tab text, JavaScript-disabled reading, and no
remote resource requests. Home totals 26,150 conservative uncompressed bytes;
Links totals 22,395. Pablo's optional page remains 376,545 bytes.

Sam approved the homepage panel, Affiliations heading, and Links-page copy on
November 15. At his request, the Colophon now connects Green Team membership to
our lightweight design, and README maintenance links identify the affiliations
data and reusable template. These follow-up edits are available in local preview.
The follow-up checks passed the same 127 tests, 144 Chromium checks, and 46 axe
scans (zero failures; 42 retained inconclusive findings), plus privacy, inventory,
structure, and hard budgets. Colophon totals 27,150 conservative uncompressed
bytes; the new README link targets resolve locally.
Nothing in this status note authorizes a source push, merge, website publication,
or new community application. The live deployment remains `e10826c`.

## Next work and safeguards

November 14 FSE data review: IERS Bulletin C 72 and UTC–TAI history confirm
no December 2026 leap second and the unchanged 37-second offset. Merged via
[PR #6](https://github.com/sam-mcclanahan/starbase430-site/pull/6) at `2d6d26d`,
source now supports instants before July 1, 2027, extending the previous January 1
boundary. No historical offsets, epoch, article timestamps, or labels changed.
Independent exact boundary vectors and a synthetic 2027 publication/feed test
cover the extension. This source change has not been deployed.

Validation for this extension passed `npm run check:all`: 126 tests, the
116-file inventory, privacy-history checks, 11 production and 11 preview
structure checks, all hard page budgets, 144 Chromium checks, and 46 axe scans.
There were zero failures and the same 42 retained inconclusive scan findings.
A fresh independent release build contains the same 33 files, byte-for-byte
identical to the pre-change production baseline. Timeline regeneration changed
no article content; the original 94 ERFA vectors and historical offset segments
remain unchanged. These checks do not claim WCAG certification.

The illustration optimization is approved for checked source integration;
website deployment still requires separate approval. Recheck FSE data after
the January 2027 Bulletin C and before
the July 1, 2027 cutoff; the June decision is not assumed. Preserve the chosen epoch, existing dates, and resource thresholds.

The roadmap retains deferred content, Training concepts, a home-network mirror,
and eventual public homelab hosting as distinct milestones. Future IndieWeb
features remain optional and need their own bounded plans. Continue using the
automated privacy and change-based accessibility process; do not restart guided
per-article manual checklists for unchanged components.
