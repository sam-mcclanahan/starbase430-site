import offsets from "./tai-offsets.json" with { type: "json" };

// Evaluate IERS UTC–TAI history directly; integer nanoseconds avoid losing
// the epoch's fractional offset. This is a bounded converter, not a full
// astronomical time library. See docs/fse-time-standard.md for its limits.
const SECOND = 1_000_000_000n;
const MEGASECOND = 1_000_000n;
const DAY_MS = 86_400_000n;
const validUntil = Date.parse(offsets.validUntil);
const segments = offsets.segments.map((row) => ({ ...row, startMs: Date.parse(`${row.start}T00:00:00Z`) }));
export const FSE_EPOCH_UTC = "1969-07-21T02:56:15Z";

function roundedDivide(value, divisor) {
  return value < 0n ? -((-value + divisor / 2n) / divisor) : (value + divisor / 2n) / divisor;
}

function offsetNanoseconds(ms) {
  if (ms < segments[0].startMs || ms >= validUntil) {
    throw new Error(`UTC–TAI date outside reviewed range (${segments[0].start} to before ${offsets.validUntil}); review IERS data in tai-offsets.json.`);
  }
  const row = segments.findLast((candidate) => candidate.startMs <= ms);
  let offset = BigInt(row.baseNs);
  if (row.driftNsPerDay) {
    const elapsedMs = BigInt(ms) + (40_587n - BigInt(row.referenceMjd)) * DAY_MS;
    offset += roundedDivide(elapsedMs * BigInt(row.driftNsPerDay), DAY_MS);
  }
  return offset;
}

// Date covers ordinary publication instants. Explicit UTC strings additionally
// admit known positive leap seconds, which JavaScript Date cannot represent.
export function taiNanoseconds(instant) {
  if (instant instanceof Date && Number.isFinite(instant.getTime())) {
    const ms = instant.getTime();
    return BigInt(ms) * 1_000_000n + offsetNanoseconds(ms);
  }
  if (typeof instant !== "string") throw new Error("TAI requires a valid Date or explicit UTC timestamp.");
  const match = /^(\d{4}-\d{2}-\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,9}))?Z$/.exec(instant);
  if (!match) throw new Error("TAI requires an explicit UTC timestamp ending in Z.");
  const [, day, hour, minute, second, fraction = ""] = match;
  const leap = second === "60";
  const normal = `${day}T${hour}:${minute}:${leap ? "59" : second}`;
  const ms = Date.parse(`${normal}Z`);
  if (!Number.isFinite(ms) || new Date(ms).toISOString().slice(0, 19) !== normal) {
    throw new Error("Invalid UTC calendar timestamp.");
  }
  const offset = offsetNanoseconds(ms);
  if (leap && (hour !== "23" || minute !== "59" || ms < Date.parse("1972-01-01T00:00:00Z") || offsetNanoseconds(ms + 1000) - offset !== SECOND)) {
    throw new Error("UTC :60 is valid only at a recorded positive leap second.");
  }
  let correction = 0n;
  if (!leap && fraction) {
    // Pre-1972 UTC ran at an adjusted rate. Include fractional-day drift too.
    const row = segments.findLast((candidate) => candidate.startMs <= ms);
    if (row.driftNsPerDay) correction = roundedDivide(BigInt(fraction.padEnd(9, "0")) * BigInt(row.driftNsPerDay), 86_400n * SECOND);
  }
  return BigInt(ms + (leap ? 1000 : 0)) * 1_000_000n + BigInt(fraction.padEnd(9, "0")) + offset + correction;
}

const epochTai = taiNanoseconds(FSE_EPOCH_UTC);
export function fseElapsedNanoseconds(instant) {
  return taiNanoseconds(instant) - epochTai;
}

export function formatFseNanoseconds(elapsed) {
  // Truncate the magnitude to completed SI seconds; canonicalize zero's sign.
  const seconds = (elapsed < 0n ? -elapsed : elapsed) / SECOND;
  const sign = elapsed < 0n && seconds !== 0n ? "-" : "+";
  return `${sign}${seconds / MEGASECOND}.${String(seconds % MEGASECOND).padStart(6, "0")} Ms`;
}

export function fseTimestamp(date) {
  if (!(date instanceof Date) || !Number.isFinite(date.getTime())) throw new Error("FSE requires a valid publication Date.");
  return formatFseNanoseconds(fseElapsedNanoseconds(date));
}
