# Release roadmap

Prepared November 13, 2026. **12/15 active launch gates complete, 3 remaining.**
Original item 8 (library article) is deferred until after launch; original numbers
remain stable. The private historical repository will remain private. A fresh,
reviewed repository replaces archive visibility conversion as the source route.

Completed: foundation/content model; visual identity; RSS; licenses; website
article; Pablo; First Step Epoch; utility-page approval; representative local
accessibility/browser review; privacy/rights review through the clean-source route.

12. [x] Save and verify the reviewed source checkpoint and private GitHub backup.
    November 13: fresh-history candidate prepared as `sam-mcclanahan/starbase430-site`,
    initially private; source visibility approved November 13. Current checks: 118 tests, 144
    browser checks and 46 axe scans; no confirmed failures, 42 retained
    scanner-inconclusive contrast findings. Fresh production/preview structure
    checks cover 11 pages each; all hard budgets pass. npm reports zero known
    advisories after compatible build-dependency patches.
13. [x] Obtain explicit approval before making this repository public.
    November 13: Sam approved public visibility for starbase430-site only; the
    historical repository stays private and deployment remains deferred.
    Final source/history/hosted-log review covered 111 approved source files;
    Source checks passed at cc32e7f. Native secret scanning and push protection
    are enabled. Main requires the GitHub Actions Privacy and release checks
    status, including administrators; force pushes and deletion are blocked.
14. [ ] Configure hosting, repeatable deployment, domain/DNS, and HTTPS.
    November 13: GitHub Pages selected as the first host, Cloudflare for DNS.
    Prepared a manually triggered, checked release with Sam approval and
    main-only deployment protection; Pages uses Actions. Independent local
    release build and static-server smoke checks pass. Domain verification,
    DNS activation, first deployment, HTTPS,
    hosted verification, and launch sign-off remain separate checkpoints.
15. [ ] Verify the deployed site, RSS, draft exclusion, privacy, and hosted resource sizes.
16. [ ] Record final launch sign-off after live verification.

The initial launch includes three approved Logs. Library/media projects and
optional IndieWeb expansions remain post-launch. Public-source preparation and
private backups do not authorize deployment or visibility changes.

## Post-launch local hosting milestones

- [ ] Serve the checked production build on the home network and verify offline
  local reading; retain an independently restorable copy.
- [ ] **Serve the public Starbase 430 website from home.** Sam explicitly
  confirmed this as a learning goal November 13, 2026. Test an isolated public
  homelab service, HTTPS, availability, backup/recovery, and rollback before a
  separately approved domain cutover. Preserve article URLs and RSS identity;
  GitHub Pages may remain an optional fallback. See [hosting](docs/hosting.md).

These milestones do not expand the initial launch countdown.
