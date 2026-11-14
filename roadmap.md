# Release roadmap

Prepared November 13, updated November 14, 2026. **15/15 active launch gates complete, 0 remaining.**
Original item 8 (library article) is deferred until after launch; original numbers
remain stable. The private historical repository will remain private. A fresh,
reviewed repository replaces archive visibility conversion as the source route.

Completed: foundation/content model; visual identity; RSS; licenses; website
article; Pablo; First Step Epoch; utility-page approval; representative local
accessibility/browser review; privacy/rights review through the clean-source route.

12. [x] Save and verify the reviewed source checkpoint and private GitHub backup.
    November 13: fresh-history candidate prepared as `sam-mcclanahan/starbase430-site`,
    initially private; source visibility approved November 13. Snapshot checks: 118 tests, 144
    browser checks and 46 axe scans; no confirmed failures, 42 retained
    scanner-inconclusive contrast findings. Fresh production/preview structure
    checks cover 11 pages each; all hard budgets pass. npm reports zero known
    advisories after compatible build-dependency patches.
13. [x] Obtain explicit approval before making this repository public.
    November 13: Sam approved public visibility for starbase430-site only; the
    historical repository stayed private; deployment was separately approved in item 14.
    Final source/history/hosted-log review covered 111 approved source files;
    Source checks passed at cc32e7f. Native secret scanning and push protection
    are enabled. Main requires the GitHub Actions Privacy and release checks
    status, including administrators; force pushes and deletion are blocked.
14. [x] Configure hosting, repeatable deployment, domain/DNS, and HTTPS.
    November 13: Sam approved the first public deployment and DNS cutover.
    Website release 43426626231 succeeded at e816120 after protected approval.
    Domain ownership is verified, canonical/www DNS is configured, certificate
    issuance succeeded, and HTTPS enforcement is enabled. Mail is unchanged.
    The independent checked build and manual release process are documented.
15. [x] Verify the deployed site, RSS, draft exclusion, privacy, and hosted resource sizes.
    All 33 HTTPS files match the approved build; feed aliases and three full entries
    pass; five source/private paths return 404. Hosted browser smoke checks pass.
    Validated TLS passes all four IPv4 endpoints; HTTP and www redirect to
    https://starbase430.com/. Initial cached HTTP content expired as expected.
    Public launch workflow logs passed credential/contact/path scanning.
16. [x] Record final launch sign-off after live verification.
    November 13: Sam explicitly approved final launch sign-off after the hosted
    review. Starbase 430 is publicly released at https://starbase430.com/.
    Subsequent releases retain the manual publication and approval process.

The initial launch includes three approved Logs. Library/media projects and
optional IndieWeb expansions remain post-launch. Public-source preparation and
private backups do not authorize deployment or visibility changes.

## Post-launch backlog

The launch countdown is closed at 15/15. This backlog does not reopen it or
create a deadline for every idea. Planned work records agreed directions;
exploratory options require selection before implementation. New articles,
community submissions, deployment, and DNS cutovers retain their approval steps.
Private drafts, research, masters, and historical issues remain outside this
public repository; this list carries forward task summaries only.

### Backlog consolidation

- [x] Carry forward the earlier post-launch plans into this active roadmap.
  November 13: retained content, Training, discovery, and local/public hosting
  goals without importing private writing or archive history. Clarified dated
  pre-launch documentation. Implementation of the remaining items is separate.

### Planned maintenance

- [x] Review the public GitHub presentation after launch. November 14: corrected
  the stale About description, added the live URL and discovery topics, and
  verified existing repository and deployment protections. Prepared a visitor-
  oriented README and clarified historical launch documentation for source review.
- [ ] Review enabling GitHub Dependabot alerts and a private vulnerability-reporting
  route. The November 14 audit found Dependabot alerts disabled; it could not
  verify private vulnerability reporting with the current CLI permissions.
  Keep changes to security settings separate from presentation cleanup.
- [ ] **Review FSE time data before January 1, 2027.** The current publication
  formatter deliberately rejects dates on or after that boundary. Review IERS
  sources, record the next supported interval, and independently verify offsets
  before extending it. Preserve the epoch and existing publication dates.
  Follow [FSE maintenance](docs/fse-time-standard.md#when-updating-the-data).
- [ ] **Create more room below the Pablo illustration's hard size limit.** The
  launch total is 511,433 bytes, leaving 567 below the 512,000-byte ceiling.
  Investigate compression or simplification while preserving the approved
  portrait, controls, reduced motion, static alternatives, and accessibility.
  Measure savings and run relevant checks; retain both existing thresholds.

Use the existing automated privacy, accessibility, structure, and budget checks
for ongoing changes. Focus human review on changed interactions and shared
patterns rather than restarting a manual checklist for each article.

### Planned content, deferred until ready

- [ ] Finish the library article's editorial review, metadata, completion date,
  and approval. Keep its source and assets in private authoring storage until
  reviewed and deliberately promoted to the public repository.
- [ ] Complete more of the underlying media project before finishing
  **Owning our media**. Preserve its private draft/research; it has no release
  deadline and is not a dependency for another article.

### Planned Training experiences

Use **Training** as the public-facing umbrella for future game experiences.
These agreed concepts still need bounded mechanics, routes, and implementation
plans before development:

- [ ] **We Built the Same Arcade Game Two Ways: With and Without JavaScript**:
  compare a pure HTML/CSS experience with a separately chosen lightweight
  JavaScript version of the same concept. Write a development Log covering
  functionality, accessibility, resource size, maintainability, and limitations.
  Keep the no-JavaScript version and explanation directly accessible.
- [ ] **Command Decisions**: an HTML-only branching decision experience using
  semantic static pages and ordinary links. Avoid required timers, reflex
  actions, scripting, or CSS-dependent decisions.

Retain static portability, privacy, meaningful alternatives, draft isolation,
and the existing Small Web budgets. The current dependency checker permits
reviewed Pablo scripts specifically; other scripts are rejected. Supporting a
Training script requires explicit resource accounting and regression coverage
before implementation, without bypassing the checker.

### Community and discovery

The [current-state submission table](docs/current-state.md#community-submissions-and-membership)
is the canonical status record. Participation below reflects specific approvals;
future applications, contact, account changes, and publication remain separate.

- [x] Research a focused community/discovery shortlist and review compatibility
  with the site's content, presentation, and disclosed workflow.
- [x] Measure Home for the 512KB Club and submit the listing.
  November 13: historical Firefox measurement 21.11 kB / 4 requests; corrected
  plain-text v2 self-tested and resent after the first archive body appeared blank.
- [ ] Confirm official 512KB Club membership. V2 archive-body confirmation is
  also unverified; neither SMTP acceptance nor an archive entry proves membership.
- [x] Submit the Geekring application and preserve its administration secret
  privately outside the source repository.
- [ ] Confirm Geekring acceptance and its public site number, then prepare
  homepage navigation. Keep it off the homepage until acceptance.
- [x] Check Marginalia indexing and submit
  [crawl request #842](https://github.com/MarginaliaSearch/submit-site-to-marginalia-search/issues/842).
- [ ] Confirm actual indexed pages in Marginalia. Crawl scheduling or issue
  closure alone does not complete this item.
- [x] Submit the reviewed Tech Makers application with disclosed AI assistance.
  November 13: [PR #5](https://github.com/skorokithakis/webring/pull/5) is open;
  account subscription and existing email/in-app notification delivery verified.
- [ ] Confirm Tech Makers decision and live membership before preparing homepage
  links. Review December 13 if unanswered; silence is not rejection. No polling
  or reminder is scheduled, and no homepage change or deployment is authorized.
- [x] Prepare Galactic Webring eligibility inquiry about static HTML navigation
  and disclosed AI assistance. Sam reported sending it November 13.
- [x] Review Galactic's reply. November 14: participation declined due to the
  maintainer's AI-assistance expectations after reviewing the site. Close this
  candidate without an appeal, membership application, or map artwork work.
  Static HTML participation was not answered; private correspondence stays out
  of this repository.
- [ ] **Become more active in the Fediverse.** Use Sam's existing Mastodon
  account to share occasional project notes, discoveries, and published Logs,
  and participate in conversations with makers and independent-web communities.
  Build meaningful connections at a sustainable pace, without posting quotas
  or treating activity as a prerequisite solely for webring membership.
  November 13: Fediring is deferred; the prepared eligibility inquiry remains
  unsent. Revisit membership when useful. No posts, profile changes, inquiry,
  application, or automation were made or scheduled as part of this backlog item.
- [x] Publish the homepage h-card and GitHub `rel="me"` link, verify the reciprocal
  public profile link, and complete domain-based sign-in.
- [x] Join the IndieWeb Webring, publish its homepage links, verify its live link
  check and public-directory entry, and publish the reviewed Outpost styling.
  November 13: main `e10826c`, release 43498505433; all 33 live files match and
  both ring redirects pass. Home remains 24,365 conservative bytes, with no new
  images or scripts.
- [x] Prepare success-only monitoring prompts for Dot for the three pending
  destinations. The [plans and dates](docs/current-state.md#prepared-dot-monitoring-plans)
  are recorded; actual scheduling/execution in Dot is not independently confirmed.
- [ ] Evaluate further IndieAuth and Webmention features only where they add clear
  value. RelMeAuth already supports our membership; a dedicated auth server is
  not required. Identify any companion service before implementation.

Wiby was deprioritized as a weaker design fit. XXIIVV and Merveilles remain
unpursued research candidates, not commitments. Neocities is not a hosting or
membership requirement. The No-JS Club was excluded from the Links-page plan.
No additional submissions or announcements are authorized by this backlog.

### Future submission guidance

- Prioritize communities that explicitly accept the disclosed workflow or show
  evidence of a compatible approach. A maintainer's own AI use is encouraging
  evidence, not a guarantee of membership; silence in published rules means unknown.
- Where AI eligibility is unclear, ask that question before investing in artwork,
  custom widgets, or integration. Review navigation requirements early too,
  including whether a destination redirect requires visitor JavaScript.
- Describe the actual scope of coding, drafting, and editing assistance plainly,
  with a link to the Colophon. Explain human direction, review, editorial decisions,
  and approval without implying that assistance is minor. Use words such as
  "extensive" only when they accurately describe the work; avoid a blanket claim
  about every article or asset. Never obscure assistance to improve acceptance odds.
- When relevant, distinguish assistance with writing about a project from the
  tools used to create that project. A retrospective's present-day documentation
  workflow does not establish that AI was used in the historical build.
- Treat a polite refusal as a completed compatibility check. Record the stated
  reason and any unanswered questions separately, then move on without an appeal
  or changing the site solely to qualify. No response is not a rejection.
- Keep private email, raw headers, contact details, and internal review artifacts
  outside the public source. Record only the approved status summary. Inquiries,
  applications, profile changes, and publication still require their own approval.

### Planned local and public homelab hosting

- [ ] Serve the checked production build on the home network and verify offline
  local reading; retain an independently restorable copy and test restoration.
- [ ] **Serve the public Starbase 430 website from home.** Sam explicitly
  confirmed this as a learning goal November 13, 2026. Test an isolated public
  homelab service, HTTPS, availability, backup/recovery, and rollback before a
  separately approved domain cutover. Preserve article URLs and RSS identity;
  GitHub Pages may remain an optional fallback. See [hosting](docs/hosting.md).

The local mirror is a prerequisite for the public-hosting experiment, not a
substitute for completing that learning milestone.
