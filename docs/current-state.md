# Current project state

Updated November 13, 2026. This is the current summary, not a new test run or
live recheck of pending submissions. Accepted requirements live in
[project goals](project-goals.md); remaining work lives in the
[roadmap](../roadmap.md#post-launch-backlog).

## Published website and source

- Website: https://starbase430.com/; **15/15 launch gates complete**.
- Public release source: `sam-mcclanahan/starbase430-site`, created from a
  reviewed snapshot with independent Git history. The historical repository,
  unpublished writing, masters, research, and recovery worktrees remain private.
- Latest deployed source: `e10826c`, the reviewed Outpost navigation release.
  Documentation-only commits after it do not change the deployed website.
- GitHub Pages hosts the static site; Cloudflare retains registration and DNS.
  HTTPS is enforced; HTTP and www redirect to the canonical HTTPS apex.
- Source pushes run checks only. Future website publication requires separate
  authorization, the manually dispatched release workflow, and its protected
  deployment approval. See [hosting](hosting.md) and [release workflow](release-workflow.md).

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

Status below reflects recorded November 13 submissions and checks. Submission,
archive appearance, crawl scheduling, indexing, and membership are distinct.

| Destination | Recorded status | Next confirmation |
| --- | --- | --- |
| [IndieWeb Webring](https://xn--sr8hvo.ws/directory) | Active, public profile listed, homepage links published, ring link check passed. | Maintain links and public identity when changing the homepage. |
| [512KB Club](https://512kb.club/) | Submitted; acceptance unconfirmed. The original archive entry had no visible patch body. The corrected v2 was self-tested with explicit plain-text MIME headers and resent successfully. | Confirm v2 archive body separately if needed; membership requires an actual official site listing. |
| [Geekring](https://geekring.net/list.txt) | Application receipt confirmed; acceptance unconfirmed. | Find our domain and assigned site number in the public membership list before adding member links. |
| [Marginalia Search](https://marginalia-search.com/) | Both hostnames were unknown at the pre-submission check. [Crawl request #842](https://github.com/MarginaliaSearch/submit-site-to-marginalia-search/issues/842) was submitted. | Confirm actual indexed pages; an issue closure or crawl-list entry alone is insufficient. |

The submitted 512KB Club measurement was Sam's Firefox 160.0 measurement on
November 13 at 10:48 AM EST: **21.11 kB, 4 requests**, cache disabled and page
fully scrolled. It predates the homepage identity and ring additions; retain it
as historical evidence rather than presenting it as a current measurement.

Membership secrets, email credentials, raw mail headers, and private review
artifacts remain outside the public repository. Do not copy them into status
notes, issues, or source. No new submission or follow-up is authorized by this table.

## Prepared Dot monitoring plans

Prompts were prepared for Sam to give Dot. Their installation/execution in Dot
has not been independently confirmed; this repository creates no scheduled jobs.
All requested checks run at **05:00 America/New_York**, notify only on confirmed
success, cancel remaining checks after success, and end silently if exhausted.
Fetch failures or absence do not establish rejection.

- **Geekring and 512KB Club:** November 14, 15, 16, 18, 21, 26, and December 4,
  2026 (1, 2, 3, 5, 8, 13, and 21 days after submission). Check the official
  membership lists; mailing-list archive appearance does not establish club membership.
- **Marginalia:** November 20 and 27; December 4, 11, 18, and 25, 2026;
  January 1 and 8, 2027. Success requires actual indexed Starbase 430 pages.
  Domain-information pages, screenshots, and pending/closed requests do not count.

## Next work and safeguards

Prioritize more headroom for the optional illustration and review FSE's
conservative January 1, 2027 input boundary before extending publication-date
coverage. Preserve the chosen epoch, existing dates, and resource thresholds.

The roadmap retains deferred content, Training concepts, a home-network mirror,
and eventual public homelab hosting as distinct milestones. Future IndieWeb
features remain optional and need their own bounded plans. Continue using the
automated privacy and change-based accessibility process; do not restart guided
per-article manual checklists for unchanged components.
