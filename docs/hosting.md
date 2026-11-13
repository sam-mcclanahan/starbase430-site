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

## Preparation verification, November 13

Local verification passed 122 tests, 144 browser checks, and 46 axe scans with
zero confirmed failures and the 42 retained contrast-inconclusive findings.
Workflow syntax/expression checks passed actionlint 1.7.12. A standard loopback
static server served nine representative release routes/resources without a
GitHub connection or hosting credential. The fresh release contains 33 files
and 11 HTML pages; the largest page is 511,433 bytes.

GitHub Pages is configured for Actions. The github-pages environment requires
Sam's approval, permits only main, and disables administrator bypass. No
publication workflow has been dispatched and no DNS record has been changed.
Domain verification, the canonical custom domain, and first-publication approval
remain outstanding.
