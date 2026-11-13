# First Step Epoch: time standard and maintenance

Accepted November 8, 2026, following Sam's explicit request to count elapsed SI
seconds on TAI. This supersedes the earlier POSIX-based calculation. The site remains private and
the explanatory article was approved for release builds on November 12, 2026.
Public deployment remains deferred.

Display unit updated November 12, 2026 at Sam’s request: divide elapsed SI
seconds by 1,000,000 and display six decimal places. This changes the scale of
the label, not the epoch, TAI conversion, or publication records.

## Definition and unchanged records

FSE is TAI(event) minus TAI(epoch), expressed in megaseconds (Ms). The epoch remains
the chosen instant `1969-07-21T02:56:15Z`. Its historical IERS offset is
7.575311250 seconds, so its TAI coordinate is `1969-07-21 02:56:22.575311250`.
Do not reinterpret the original clock reading as TAI or round off this offset.

Publication front matter, UTC/civil dates, slugs, and feed GUIDs are unchanged.
Pablo's TAI interval is 1,808,227,499.424688750 SI seconds; its label displays
`+1808.227499 Ms FSE`. The website article displays `+1808.058619 Ms FSE`.
Their interval is still 168,880 SI seconds: no offset change occurs between them.
At the Unix epoch, FSE is 14,159,025.424770750 SI seconds.

For an ordinary UTC instant represented by a Unix timestamp, the equivalent
shortcut is `FSE seconds = Unix seconds + 14,159,025 + (TAI − UTC at the event)
− 7.575311250`. The event offset is date-dependent and includes historical
rate adjustments; this expression is not a replacement parser for explicit
UTC leap-second inputs. The article uses a worked Pablo example instead of
leading with this shortcut: publication at `2026-11-07 16:20:45 UTC` converts
to `2026-11-07 16:21:22 TAI`, producing `1808.227499424688750 Ms` before display
truncation to `+1808.227499 Ms`.


Internal arithmetic uses integer nanoseconds, rounded to the nearest nanosecond
when evaluating the historical linear rate model. Labels truncate the magnitude
to completed whole seconds, retain six fractional megasecond digits, and
canonicalize zero's sign. Computational resolution is not a claim of nanosecond
accuracy for either the clocks or historical event records. TAI is a defined
Earth-based atomic reference, not universal observer-independent elapsed time.

## Data and supported inputs

`src/_lib/tai-offsets.json` records the
[IERS historical relationships](https://hpiers.obspm.fr/iers/bul/bulc/UTC-TAI.history),
including fractional offsets and rates before 1972 and integer offsets afterward.
The review also checked IERS Bulletin C 72, dated July 6, 2026, which states
there will be no leap second at the end of December 2026. The source endpoints
are mutable; the checked-in snapshot and dated review are the build's authority.

The intentionally conservative supported interval is January 1, 1961 inclusive
to January 1, 2027 exclusive. Dates outside it fail with an instruction to review
the data. A future build of an old valid publication date remains reproducible;
new publication instants outside the range cannot silently use stale offsets.
Do not extend the boundary based solely on the system date or an assumption
that no future leap seconds will occur.

`fseTimestamp` continues to require a valid JavaScript Date for publication
metadata. `taiNanoseconds` and `fseElapsedNanoseconds` additionally accept strict
UTC strings with up to nine fractional second digits. Known positive leap
seconds, such as `2016-12-31T23:59:60Z`, are admitted as distinct instants;
JavaScript Date cannot represent them. Invalid dates, false leap seconds,
unsupported history, and unreviewed future dates fail. Pre-1972 civil-clock
mini-adjustments are evaluated at ordinary valid timestamps; this bounded API
does not provide a parser for every historical mini-leap notation. Negative
leap-second input rules would need explicit review if one were announced.

No time-data fetch runs during builds or visitor page loads. No Python or new
runtime dependency was added to the project. The separate Ghostty configuration
has not been modified; the article distinguishes its earlier POSIX counter.

## Independent verification

`test/fixtures/fse-tai-reference.json` contains 94 independently generated
PyERFA 2.0.1.5 reference vectors: UTC `dtf2d` followed by `utctai`.
It covers every table transition, pre-1972 rates, the chosen epoch, publication
examples, and positive leap seconds. Production code is a direct evaluator of
the IERS data; ERFA code is not copied into it. Tests compare TAI coordinates
within 1,000 ns to allow serialization of the double-precision oracle output.
Additional exact-integer assertions verify the fractional epoch correction,
consecutive SI seconds across leap seconds, the January 1972 fractional step,
formatting, New York DST equivalence, and invalid/out-of-range inputs.

PyERFA was used only in a disposable external verification environment. It is
not needed to run the checked-in JavaScript tests. For an independent recheck,
install PyERFA separately and regenerate UTC-to-TAI coordinates from the listed
UTC inputs using its `dtf2d` and `utctai` functions. Preserve oracle provenance
and review differences before changing expected values.

References: [BIPM time standards](https://www.bipm.org/en/time-department),
[ERFA UTC–TAI conversion](https://github.com/liberfa/erfa/blob/master/src/utctai.c),
and [SOFA](https://www.iausofa.org/current-software).

## Timeline regeneration and early dates

Run `npm run update:fse-timeline` after reviewing conversion/data changes. The
script regenerates only the marked timeline block from the 25 sourced records
in `docs/aea-timeline-research.json`; prose outside that block is preserved.
Each event must have a documented calendar day. Titles and source notes identify
publication, announcement, authorization, and event dates. No month/year-only
milestones remain. Timeline cards put FSE first and the calendar date plus any
source UTC time last. Second-level records use the unchanged six-place Log
formatter without italics or an approximation sign.

Day/minute-only timeline values now display an italic approximation sign and the
finest decimal rounding that is identical across the entire modeled source
window. Bounds are retained internally, not displayed as ranges. Evaluate
rounding from six places downward; normalize rounded zero to a positive sign.
If even whole-Ms rounding differs, increase the rounding unit to tens of Ms and
beyond until stable. This is conservative displayed precision, not a claim of
knowing a missing event instant. The CMB publication is `≈ -128 Ms FSE`;
Gagarin’s minute-only launch would be `≈ -261.089 Ms FSE`. A stable extra decimal
cannot be displayed for either source window. Pre-1961 reconstructions are
additionally capped at whole Ms. The source-window day is a UTC calendar-day
comparison convention, not proof of the original event’s time zone. The
approximately symbol is hidden from assistive technology and accompanied by
visually hidden “Approximately”; native emphasis supplies italic styling even
without site CSS.

The reviewed timeline starts January 1, 1960, with twenty selected milestones and
no unassigned slots, ending at the November 12, 2026 review endpoint. Wide
columns retain one uniform TAI elapsed-time scale, fourteen five-year labels,
and alternating cards. Each event’s outer position remains its date marker. The
card is shifted upward by its configured `desktopAnchorPercent` of its own
height (default 50%), allowing a straight connector anywhere along its inner
edge. Anchors must stay between 0% and 100%. Four measured exceptions avoid
collisions at the beginning and around Stardust; validate all cards after copy
or font changes, especially near the 38rem breakpoint. Desktop cards use 46% of the column, .625rem padding,
and a 188rem proportional frame after the November 12 flexible-anchor review. Font sizes
and line heights are unchanged. Day-only positions use the center of the documented
calendar-day comparison window, not an inferred event instant. Marker positions
and the six-place labels for documented seconds are unchanged.

At reading-column widths of 38rem or less, the timeline becomes a chronological
CSS grid with automatic card heights and a consistent 1.5rem gap. The vertical
line and card circles remain, but proportional year labels are hidden because
card spacing no longer represents elapsed time. The article explains this
responsive distinction. Fixed narrow-screen heights, per-card offsets, and elbow
connectors are removed. This also accommodates longer text without hard-coded
collision adjustments. CSS-off chronology remains intact; no JavaScript is used.

The reviewed generator uses `data/fse-timeline.json` with `timelineMode: release`.
It contains only the twenty selected milestones and their date/source precision.
Belka/Strelka’s return predates the supported UTC history; its rounded placement
uses the [Espenak/Meeus 1941–1961 Delta-T polynomial](https://eclipse.gsfc.nasa.gov/SEcat5/deltatpoly.html)
to approximate TT from UT1, then TT−TAI = 32.184 seconds to extend the atomic-rate
coordinate backward. See [ERFA’s TT conversion](https://github.com/liberfa/erfa/blob/master/src/tttai.c).
This approximate reconstruction is never accepted by the publication formatter.

## When updating the data

1. Review the latest IERS Bulletin C and UTC–TAI history. Record the bulletin,
   review date, verified offsets, and next conservative review boundary.
2. Update the checked-in table only where supported by those sources. Review
   parsing rules too if a new kind of adjustment, such as a negative leap, appears.
3. Independently validate boundary instants and regenerate oracle fixtures when
   needed; do not derive expected conversions from the function under test.
4. Regenerate the timeline, review changed labels/examples, and run tests plus
   fresh structure, feed/draft-isolation, and page-weight checks. Existing
   publication dates and epoch stay fixed unless Sam explicitly changes them.
