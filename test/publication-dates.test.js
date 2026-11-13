import assert from "node:assert/strict";
import test from "node:test";

import {
  formatHtmlDate,
  formatOriginalProjectDate,
  formatReadableDate,
  formatRfc822Utc,
  validateOriginalProjectDate,
  validatePublicationTimestamp
} from "../eleventy.config.js";

test("accepts the correct winter and summer offsets", () => {
  assert.doesNotThrow(() =>
    validatePublicationTimestamp("2026-01-15T09:00:00-05:00")
  );
  assert.doesNotThrow(() =>
    validatePublicationTimestamp("2026-07-15T09:00:00-04:00")
  );
});

test("rejects date-only values and incorrect seasonal offsets", () => {
  assert.throws(
    () => validatePublicationTimestamp("2026-07-15"),
    /YYYY-MM-DDTHH:mm:ss±HH:MM/
  );
  assert.throws(
    () => validatePublicationTimestamp("2026-07-15T09:00:00-05:00"),
    /Check daylight-saving time/
  );
});

test("rejects nonexistent spring-forward local times", () => {
  assert.throws(
    () => validatePublicationTimestamp("2026-03-08T02:30:00-05:00"),
    /Check daylight-saving time/
  );
  assert.throws(
    () => validatePublicationTimestamp("2026-03-08T02:30:00-04:00"),
    /Check daylight-saving time/
  );
});

test("rejects invalid calendar dates", () => {
  assert.throws(
    () => validatePublicationTimestamp("2026-02-29T09:00:00-05:00"),
    /nonexistent or invalid local time/
  );
  assert.doesNotThrow(() =>
    validatePublicationTimestamp("2024-02-29T09:00:00-05:00")
  );
});

test("accepts both explicit instances of a repeated fall-back time", () => {
  assert.doesNotThrow(() =>
    validatePublicationTimestamp("2026-11-01T01:30:00-04:00")
  );
  assert.doesNotThrow(() =>
    validatePublicationTimestamp("2026-11-01T01:30:00-05:00")
  );
});

test("formats page dates in New York and RSS dates in GMT", () => {
  const summerDate = "2026-07-15T09:00:00-04:00";

  assert.equal(formatHtmlDate(summerDate), "2026-07-15");
  assert.equal(formatReadableDate(summerDate), "July 15, 2026");
  assert.equal(formatRfc822Utc(summerDate), "Wed, 15 Jul 2026 13:00:00 GMT");
});

test("accepts and formats optional original Project dates", () => {
  assert.equal(validateOriginalProjectDate(), undefined);
  assert.doesNotThrow(() => validateOriginalProjectDate("2014-04-11"));
  assert.doesNotThrow(() => validateOriginalProjectDate("2024-02-29"));
  assert.equal(formatOriginalProjectDate("2014-04-11"), "April 11, 2014");
});

test("rejects malformed or nonexistent original Project dates", () => {
  assert.throws(
    () => validateOriginalProjectDate(new Date("2014-04-11")),
    /quoted YYYY-MM-DD/
  );
  assert.throws(
    () => validateOriginalProjectDate("2014-04-11T09:00:00-04:00"),
    /in YYYY-MM-DD format/
  );
  assert.throws(
    () => validateOriginalProjectDate("2014-02-30"),
    /nonexistent or invalid/
  );
});
