# Hosting and local operation

Decision recorded November 13, 2026: use GitHub Pages for the first public host,
with Cloudflare retaining starbase430.com registration and DNS. Public hosting
from Sam's homelab is a distinct post-launch learning milestone, not just an
emergency fallback. Keep the historical repository and private authoring private.

## Independent builds and a home-network mirror

The same Eleventy sources must build without GitHub Actions, Cloudflare, or a
hosting credential. After the documented dependency/privacy-tool installation:

```sh
npm run build:release
```

This creates a fresh, checked production site at `.cache/release-site/`, separate
from the development server's `_site/`. It removes only its own previous output,
uses production draft filtering, and checks the exact files for structure,
required pages and feeds, page budgets, private/source files, symlinks,
development scripts, private metadata, and credentials. No upload is performed.
Node dependencies and the pinned scanner must already be installed for an offline
build. Reading a previously built copy needs only an ordinary static web server.

For example, where Python 3 is installed, serve the release on this computer:

```sh
python3 -m http.server 8082 --bind 127.0.0.1 --directory .cache/release-site
```

Open http://127.0.0.1:8082/. Stop with Ctrl+C. For a home-network mirror on the
chosen homelab machine, serve only this generated directory with its static
server, rather than exposing the repository or the Eleventy development server.
The HTML, local assets, and optional illustration work without a hosting API.
External references and community endpoints still require internet access. Feed
and canonical URLs deliberately retain the public starbase430.com identity.

## Manually controlled Pages releases

The Website release workflow has only a manual trigger and runs only on main.
Its default publish=false mode runs all checks, builds an isolated production
copy, scans the exact upload directory, and retains only the website artifact
for one day. It does not deploy. Ordinary pushes and pull requests only run the
read-only Source checks workflow; they never invoke deployment.

Publication requires publish=true, a successful build, and the github-pages
protected environment approval. Only the deploy job receives pages:write and
id-token:write; no long-lived hosting token is stored. It also requires the
Pages custom domain to equal starbase430.com. This protects our root-relative
URLs from accidental publication under a repository-path hostname. GitHub's
configure-pages metadata action is unnecessary for this prebuilt root-domain site.

Before the first deployment:

1. Configure GitHub Pages to use Actions and protect the github-pages environment
   with Sam's required approval, no administrator bypass, and main-only releases.
2. Verify domain ownership using GitHub's account-level domain-verification TXT
   record at Cloudflare. Do not infer DNS authorization from source publication.
3. Configure Pages' custom domain and its documented apex/www DNS records,
   preserving existing mail and unrelated records. Use starbase430.com as the
   canonical address and redirect www to it.
4. Obtain explicit first-deployment approval; dispatch the checked main workflow
   with publish=true and approve the protected environment.
5. Verify certificate issuance and enforce HTTPS. Complete hosted navigation,
   feeds, external-link behavior, privacy/draft exclusion, and resource-weight
   checks before final launch sign-off.

Treat public-repository artifacts as public content, never private authoring storage. Only approved production files may be
uploaded. The workflow does not upload browser screenshots, reports, source,
private drafts, or research. Do not dispatch a publication run until the domain
and approval checkpoints are ready. A manual preparation run is not a launch.

## Public homelab hosting milestone

Complete this separately after the first release:

1. Serve the checked production build on the home network and verify that local
   reading works while the internet connection is unavailable.
2. Test public serving from an isolated homelab web service on a separate
   hostname. Assess connectivity, HTTPS, availability, updates, backup/restore,
   and the boundary between public files and private home services.
3. Rehearse moving starbase430.com to the homelab without changing article URLs
   or RSS identity, and rehearse restoring the previous public host.
4. Make a separately approved cutover after the evidence supports it. GitHub
   Pages can remain an optional fallback; it need not remain the primary host.

Retain source and generated-site backups outside the public hosting provider.
The learning milestone is complete when the public site actually serves from
home, not merely when a local preview runs. Avoid introducing a database or
provider-specific runtime as a prerequisite for reading the site.

## Preparation verification, November 13 (before deployment)

Local verification passed 122 tests, 144 browser checks, and 46 axe scans with
zero confirmed failures and the 42 retained contrast-inconclusive findings.
Workflow syntax/expression checks passed actionlint 1.7.12. A standard loopback
static server served nine representative release routes/resources without a
GitHub connection or hosting credential. The fresh release contains 33 files
and 11 HTML pages; the largest page is 511,433 bytes.

GitHub Pages is configured for Actions. The github-pages environment requires
Sam's approval, permits only main, and disables administrator bypass. No
publish=true run has been dispatched. Domain ownership is verified; the canonical
custom domain, routing changes, and first-publication approval remain outstanding.

The preparation-only Website release run at checkpoint 7db5dde passed on GitHub:
https://github.com/sam-mcclanahan/starbase430-site/actions/runs/43424807083
Its publishing job was skipped. All 33 uploaded files matched the independently
built local release byte-for-byte; GitHub reported zero deployments. Source checks
also passed on main. No credentials or DNS verification values are stored
in this repository.

## Domain verification and planned cutover, November 13 (before deployment)

After Sam signed in, GitHub confirmed starbase430.com as a verified domain on
his account. Only the account-level GitHub Pages ownership TXT record was added
at Cloudflare. Retain that record to preserve verification. Existing mail records
and the proxied registrar holding-page record were unchanged; no www record was
present. GitHub still reports zero deployments and no repository custom domain.

The launch cutover awaiting explicit approval is:

1. Associate starbase430.com with this repository's Pages settings first.
2. Replace the registrar holding-page CNAME at @ with DNS-only A records:
   185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153.
3. Add DNS-only CNAME www pointing to sam-mcclanahan.github.io, without a
   repository path. Preserve all mail, unrelated, and ownership TXT records.
4. Dispatch the approved main release with publish=true and approve its protected
   environment. Verify canonical/www redirects and certificate issuance, and
   confirm HTTPS enforcement for the custom domain once available.
5. Complete the hosted release checks before recording final launch sign-off.

These record values follow [GitHub's custom-domain documentation](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site).
This plan initially uses IPv4; IPv6 can be added using GitHub's documented AAAA
records. No wildcard record or home-network exposure is required. If cutover must
be rolled back, restore the prior registrar holding-page CNAME and remove the
new www record; leave mail and ownership verification intact. DNS caches can
delay either cutover or rollback. HTTPS issuance may require additional time.

## First public deployment, November 13

Sam explicitly approved the DNS cutover and first public deployment in Codex.
The checked main checkpoint e816120 was deployed by [Website release run 43426626231](https://github.com/sam-mcclanahan/starbase430-site/actions/runs/43426626231),
after the protected github-pages approval. The website is available at
https://starbase430.com/. Future pushes still run source checks only; subsequent
publication requires the same manual workflow and approval boundary.

Cloudflare's registrar-managed holding-page record could not be edited directly;
the parking page was disabled through Registrar settings, then the four planned
DNS-only A records and DNS-only www CNAME were added. All existing mail records
and the ownership TXT were preserved. Rollback of the website routing would
remove the new web records and re-enable the registrar parking page, while
retaining mail and verification. Do not disable WHOIS privacy or DNS security.

GitHub's certificate covers the apex and www names. HTTPS enforcement is enabled;
TLS validation passed against all four published IPv4 addresses. Initial edge
certificate propagation briefly failed validation and resolved without any
security bypass. The initial cached HTTP homepage response expired normally;
HTTP and www now both redirect to https://starbase430.com/.

All 33 files fetched over validated HTTPS match the independently built release.
Five source/private URL probes return 404; no authoring source was deployed.
RSS aliases match and contain exactly the three approved full entries, with
first-name creators and retained publication timestamps. The same byte-identical
resources give these conservative uncompressed page totals:

| Page | Bytes |
| --- | ---: |
| Home | 21,713 |
| About | 85,621 |
| Links | 22,345 |
| Colophon | 26,856 |
| Website article | 26,837 |
| First Step Epoch | 92,652 |
| Pablo retrospective | 98,724 |
| Optional Pablo interactive page | 511,433 |

Every ordinary reading page stays below the 100,000-byte preference. The optional
interactive page passes the 512,000-byte ceiling with only 567 bytes remaining.
Live browser smoke checks verified focus, article navigation, external-link
conventions, the timeline, AVIF loading, and Tesla drawing/pause controls. These
supplement existing local/CI accessibility evidence rather than repeat its full
manual review. Public deployment/source-check logs also passed the pinned
credential scanner and personal contact/path checks. See current-state.md and
the roadmap for final sign-off status.
