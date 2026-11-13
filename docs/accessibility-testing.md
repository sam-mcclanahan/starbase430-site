# Accessibility testing

WCAG 2.2 AA is the target. After `npm ci`, run `npm run setup:a11y` once and
`npm run check:a11y` after relevant changes. `npm run check:all` combines unit,
source-boundary, structure, page-weight, and browser checks.

The suite builds fresh production/preview outputs, uses an ephemeral loopback
server, blocks external requests, and stores ignored reports in `.a11y/`.
It scans every generated page with axe-core at desktop and 320 pixels, expands
native disclosures, checks keyboard skip links, layout/timeline geometry, opaque
palette contrast, increased text spacing, representative CSS-off views, JS-off
alternatives, and the Pablo keyboard/drawing/reduced-motion paths. Broken fixtures
prove the checks can detect defects. No scanner code is shipped to visitors.

Confirmed violations fail the command. Inconclusive findings remain separately
reported and must be triaged, not silently called passes or assigned as an article
checklist. Existing overlapping/pseudo-element background findings have bounded
computed-paint and visual review evidence; reopen affected patterns after changes.
Do not globally suppress a rule or exclude whole pages to obtain a pass.

## Change-based review

| Change | Review |
| --- | --- |
| Prose using established patterns | Automated checks plus editorial review of headings, links, and image descriptions. |
| Informative image | Automated markup checks plus contextual alt/caption/rights review. |
| Shared palette/layout/navigation | Suite across all pages plus representative browser/focus/zoom inspection. |
| New interaction | Add state/keyboard tests and focused human assistive-technology review. |
| Release or redesign | Review representative patterns, unresolved findings, and changes since prior evidence. |

The development agent runs checks, fixes regressions, and investigates evidence.
Do not require Sam to repeat a guided manual checklist for every article. Reuse
dated evidence for unchanged components; a viewport test is not real browser zoom,
and ARIA assertions are not proof of VoiceOver/NVDA/JAWS announcements. Automation
and the bounded review do not certify complete WCAG conformance.

See [W3C evaluation guidance](https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/)
and [Playwright testing guidance](https://playwright.dev/docs/accessibility-testing).

## Initial snapshot evidence

November 13, 2026: Chromium 158.0.8127.18 passes 144 browser checks and 46 axe
scans on fresh outputs. There are 42 retained scanner-inconclusive contrast
results, not confirmed violations. Previously reviewed shared-pattern computed
ratios ranged from 6.936:1 to 17.597:1; sampled opaque surfaces had no interfering
image/opacity/blend effects, and representative Chromium/Firefox views were
readable. Retain exact local selectors in ignored reports and re-review affected
patterns after changes. No rule is disabled. This is bounded evidence and does
not certify all browser or assistive-technology combinations.
