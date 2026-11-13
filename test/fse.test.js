import assert from "node:assert/strict";
import test from "node:test";
import reference from "./fixtures/fse-tai-reference.json" with { type: "json" };
import { fseTimestamp, taiNanoseconds, fseElapsedNanoseconds, formatFseNanoseconds } from "../src/_lib/fse.js";

const epoch = "1969-07-21T02:56:15Z";
test("TAI conversion agrees with independently generated ERFA vectors", () => {
  for (const { utc, taiCoordinateNs } of reference.vectors) {
    const difference = taiNanoseconds(utc) - BigInt(taiCoordinateNs);
    assert.ok(difference >= -1000n && difference <= 1000n, `${utc}: ${difference} ns`);
  }
});
test("FSE preserves the chosen instant with its historical fractional TAI offset", () => {
  assert.equal(taiNanoseconds(epoch), -14_159_017_424_688_750n);
  assert.equal(fseElapsedNanoseconds(epoch), 0n);
  assert.equal(fseElapsedNanoseconds("1970-01-01T00:00:00Z"), 14_159_025_424_770_750n);
  assert.equal(fseTimestamp(new Date(epoch)), "+0.000000 Ms");
  assert.equal(fseTimestamp(new Date("2026-11-07T16:20:45Z")), "+1808.227499 Ms");
  assert.equal(fseTimestamp(new Date("2026-11-05T17:26:05Z")), "+1808.058619 Ms");
});
test("positive leap seconds are separate consecutive SI seconds", () => {
  for (const [day, next] of [["1972-06-30", "1972-07-01"], ["2016-12-31", "2017-01-01"]]) {
    const before = fseElapsedNanoseconds(`${day}T23:59:59Z`);
    const leap = fseElapsedNanoseconds(`${day}T23:59:60Z`);
    const after = fseElapsedNanoseconds(`${next}T00:00:00Z`);
    assert.equal(leap - before, 1_000_000_000n);
    assert.equal(after - leap, 1_000_000_000n);
    assert.equal(after - before, 2_000_000_000n);
    assert.equal(taiNanoseconds(`${day}T23:59:60.5Z`) - taiNanoseconds(`${day}T23:59:60Z`), 500_000_000n);
  }
});
test("pre-1972 rate adjustment and January 1972 fractional step are retained", () => {
  assert.equal(fseElapsedNanoseconds("1969-07-21T02:56:16Z"), 1_000_000_030n);
  assert.equal(taiNanoseconds("1972-01-01T00:00:00Z") - taiNanoseconds("1971-12-31T23:59:59Z"), 1_107_758_030n);
});
test("formatting truncates magnitude to whole SI seconds without rounding the epoch", () => {
  for (const [ns, expected] of [[999_999_999_999_999n,"+0.999999 Ms"],[1_000_000_000_000_000n,"+1.000000 Ms"],[0n,"+0.000000 Ms"],[-1n,"+0.000000 Ms"],[-1_000_000_000n,"-0.000001 Ms"],[999_999_999_999_999_999n,"+999.999999 Ms"],[1_000_000_000_000_000_000n,"+1000.000000 Ms"]]) {
    assert.equal(formatFseNanoseconds(ns), expected);
  }
});
test("FSE uses absolute instants across New York daylight-saving transitions", () => {
  assert.equal(fseTimestamp(new Date("2026-11-01T01:30:00-04:00")), fseTimestamp(new Date("2026-11-01T05:30:00Z")));
  assert.equal(fseElapsedNanoseconds(new Date("2026-11-01T01:30:00-05:00")) - fseElapsedNanoseconds(new Date("2026-11-01T01:30:00-04:00")), 3_600_000_000_000n);
});
test("invalid UTC, false leap seconds, unsupported history and unreviewed future dates fail", () => {
  for (const value of [undefined,null,"2026-11-05",new Date(NaN)]) assert.throws(() => fseTimestamp(value), /valid publication Date/);
  for (const value of ["2026-02-30T00:00:00Z","2016-12-30T23:59:60Z","2016-12-31T12:00:60Z","1957-10-04T00:00:00Z","2027-01-01T00:00:00Z","2026-11-08T00:00:00"]) assert.throws(() => taiNanoseconds(value));
});

test("completed timeline preserves dates, documented precision, and all twenty marker positions", async () => {
  const { readFile } = await import("node:fs/promises");
  const { timelineValue, timelineBounds, timelineNanoseconds, timelinePosition } = await import("../src/_lib/science-timeline.js");
  const article = await readFile(new URL("../src/log/first-step-epoch.md", import.meta.url), "utf8");
  const research = JSON.parse(await readFile(new URL("../data/fse-timeline.json", import.meta.url), "utf8"));
  assert.equal(research.events.length,20);
  for(const event of research.events) {
    assert.match(event.date,/^\d{4}-\d{2}-\d{2}(?:T.*Z)?$/);
    assert.ok(timelineValue(event.date));
  }
  assert.equal(research.timelineMode,'release');
  assert.equal(research.slotCount,20);
  assert.equal(timelineValue(epoch),'+0.000000 Ms FSE');
  assert.equal(timelineValue('1970-01-01T00:00:00Z'),'+14.159025 Ms FSE');
  // A day with a leap second must retain that extra SI second in its bounds.
  assert.equal(timelineNanoseconds('2017-01-01T00:00:00Z')-timelineNanoseconds('2016-12-31T00:00:00Z'),86401_000000000n);
  assert.equal(timelineValue('2016-12-31'),'≈ +1497 Ms FSE');
  assert.equal(timelineValue('1965-07-01'),'≈ -128 Ms FSE');
  assert.equal(timelineValue('2004-10-22'),'≈ +1112.6 Ms FSE');
  assert.equal(timelineValue('1961-04-12T06:07Z'),'≈ -261.089 Ms FSE');
  assert.equal(timelineValue('1969-07-21'),'≈ +0 Ms FSE');
  assert.equal(timelineBounds('2016-12-31')[1]-timelineBounds('2016-12-31')[0],86401_000000000n);
  assert.equal(timelineValue('1957-10-04'),'≈ -372 Ms FSE');
  assert.equal(timelineBounds(epoch),null);
  assert.throws(()=>timelineValue('1957'),/documented day/);
  assert.throws(()=>timelineValue('2020-02-30'),/documented day/);
  assert.equal(timelinePosition('2010-01-01T00:00:00Z','2010-01-01T00:00:00Z','2020-01-01T00:00:00Z'),0);
  assert.equal(timelinePosition('2020-01-01T00:00:00Z','2010-01-01T00:00:00Z','2020-01-01T00:00:00Z'),100);
  assert.equal((article.match(/class="science-card"/g)||[]).length,20);
  assert.equal((article.match(/class="science-slot event-left(?: science-event(?: science-offset)?)?"/g)||[]).length,10);
  assert.equal((article.match(/class="science-slot event-right(?: science-event(?: science-offset)?)?"/g)||[]).length,10);
  assert.equal(research.timelineStart,'1960-01-01');
  for (const copy of Object.values(research.cardCopy)) {
    const anchor=copy.desktopAnchorPercent ?? 50;
    assert.ok(anchor>=0 && anchor<=100);
  }
  const yearLabels=[...article.matchAll(/(?:<i style="top:[^"]+">|<span class="science-year science-tick" style="[^"]+">)(\d{4})</g)].map(m=>Number(m[1]));
  assert.deepEqual(yearLabels,Array.from({length:14},(_,i)=>1960+i*5));
  assert.doesNotMatch(article,/<i style="top:/);
  assert.match(article,/On wider screens, the timeline shows elapsed time proportionally/);
  assert.doesNotMatch(article,/Milestone to select|remaining spaces are still under review/);
  assert.deepEqual(research.selectedMilestoneDates,['1960-08-20','1961-04-12T06:07Z','1965-07-01',epoch,'1972-12-14','1974-11-24','1978-07-25','1980-05-08','1985-05-16','1989-08-25T03:56Z','1992-01-09','1996-07-05','2002-09-17','2003-04-14','2006-01-15','2010-05-06','2013-10-23','2015-09-14T09:50:45Z','2019-04-10','2022-09-26T23:14:24Z']);
  const displayed=[...article.matchAll(/<p class="science-event-fse">([\s\S]*?)<\/p>/g)].map(m=>m[1].replace(/<[^>]+>/g,'').replace(' Approximately',''));
  assert.deepEqual(displayed,research.selectedMilestoneDates.map(timelineValue));
  const positions=[...article.matchAll(/class="science-slot event-(?:left|right) science-event(?: science-offset)?" id="science-event-\d+" style="top:([\d.]+)%(?:;--offset:[\d.]+rem)?(?:;--anchor:[\d.]+%)?"/g)].map(m=>Number(m[1]));
  assert.equal(positions.length,20);
  const cards=[...article.matchAll(/<li class="science-slot event-(?:left|right) science-event(?: science-offset)?"[\s\S]*?<\/li>/g)].map(m=>m[0]);
  for(const card of cards) assert.ok(card.indexOf('science-event-fse')<card.indexOf('science-event-title') && card.indexOf('science-event-title')<card.indexOf('science-event-date'));
  assert.match(cards[0],/<p class="science-event-fse"><em>/);
  assert.match(cards[0],/aria-hidden="true">≈/);
  assert.match(cards[0],/class="sr-only"> Approximately/);
  assert.match(cards[1],/<em>/);
  assert.match(cards[2],/<em>/);
  assert.doesNotMatch(cards[3],/<em>/);
  assert.match(cards[1],/06:07 UTC/);
  assert.doesNotMatch(cards[1],/06:07:00/);
  assert.equal(timelineValue("1960-08-20"),"≈ -281 Ms FSE");
  assert.match(cards[4],/Most recent person to walk on the Moon/);
  assert.match(cards[4],/December 14, 1972/);
  assert.doesNotMatch(cards[4],/05:40:56/);
  assert.match(cards[5],/Lucy sheds light on human origins/);
  assert.match(cards[5],/Discovered /);
  assert.equal(timelineValue('1972-12-14'),'≈ +107 Ms FSE');
  assert.equal(timelineValue('1974-11-24'),'≈ +169 Ms FSE');
  assert.match(cards[9],/Closest approach /);
  assert.match(cards[9],/August 25, 1989 · 03:56 UTC/);
  assert.doesNotMatch(cards[9],/03:56:00/);
  assert.match(cards[9],/<em>/);
  assert.match(cards[10],/First planets confirmed beyond our Solar System/);
  assert.match(cards[10],/Published <time datetime="1992-01-09">January 9, 1992/);
  assert.match(cards[10],/<em>/);
  assert.match(cards[11],/First mammal cloned from an adult cell/);
  assert.match(cards[11],/Born <time datetime="1996-07-05">July 5, 1996/);
  assert.match(cards[11],/<em>/);
  assert.match(cards[12],/Announced <time datetime="2002-09-17">September 17, 2002/);
  assert.match(cards[13],/Announced <time datetime="2003-04-14">April 14, 2003/);
  assert.match(cards[14],/First comet samples returned to Earth/);
  assert.match(cards[14],/Returned <time datetime="2006-01-15">January 15, 2006/);
  assert.match(cards[14],/<em>/);
  assert.match(cards[15],/Ancient DNA reveals our Neanderthal connections/);
  assert.match(cards[15],/Announced <time datetime="2010-05-06">May 6, 2010/);
  assert.match(cards[15],/<em>/);
  assert.match(cards[16],/Reported <time datetime="2013-10-23">October 23, 2013/);
  assert.match(cards[16],/<em>/);
  assert.match(cards[17],/September 14, 2015 · 09:50:45 UTC/);
  assert.match(cards[18],/First image of a black hole released/);
  assert.match(cards[18],/Released <time datetime="2019-04-10">April 10, 2019/);
  assert.match(cards[18],/<em>/);
  assert.match(cards[19],/September 26, 2022 · 23:14:24 UTC/);
  assert.doesNotMatch(cards[17]+cards[19],/<em>|aria-hidden="true">≈/);
  assert.doesNotMatch(cards.join(''),/Life thrives around deep-sea vents/);
  assert.doesNotMatch(cards.join(''),/range .* to /);
  for(let i=0;i<20;i++) assert.ok(Math.abs(positions[i]-timelinePosition(research.selectedMilestoneDates[i],'1960-01-01T00:00:00Z','2026-11-12T00:00:00Z'))<.000001);
  assert.equal((article.match(/Milestone to select/g)||[]).length,0);
});
