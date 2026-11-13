import { fseElapsedNanoseconds, formatFseNanoseconds, taiNanoseconds, FSE_EPOCH_UTC } from './fse.js';
const MS = 1_000_000_000_000_000n;
export function timelineNanoseconds(date) {
  const ms = Date.parse(date);
  if (!Number.isFinite(ms)) throw new Error('Invalid timeline date');
  if (ms >= Date.parse('1961-01-01T00:00:00Z')) return fseElapsedNanoseconds(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(date) ? date.replace("Z",":00Z") : date);
  // Historical reconstruction only: never used for publication timestamps.
  const d = new Date(ms), year = d.getUTCFullYear();
  if (year < 1941) throw new Error('Unsupported historical estimate');
  const t = year + (d.getUTCMonth() + .5) / 12 - 1950;
  const deltaT = 29.07 + .407*t - t*t/233 + t*t*t/2547;
  return BigInt(ms)*1_000_000n + BigInt(Math.round((deltaT-32.184)*1e9)) - taiNanoseconds(FSE_EPOCH_UTC);
}
function decimal(n, places) {
  const a = n < 0n ? -n : n, power = 10n ** BigInt(places);
  const sign = n < 0n ? '-' : '+';
  return places ? `${sign}${a/power}.${String(a%power).padStart(places,'0')}` : `${sign}${a}`;
}
export function timelineBounds(date) {
  const minute = /T\d{2}:\d{2}Z$/.test(date);
  if (!minute && date.includes('T')) return null;
  if (!minute && (!/^\d{4}-\d{2}-\d{2}$/.test(date) || new Date(`${date}T00:00:00Z`).toISOString().slice(0,10) !== date)) throw new Error('Timeline requires a documented day');
  const start = minute ? date : `${date}T00:00:00Z`;
  const end = new Date(Date.parse(start)+(minute ? 60000 : 86400000)).toISOString();
  return [timelineNanoseconds(start),timelineNanoseconds(end)];
}
const rounded = (n,step) => n < 0n ? -((-n+step/2n)/step) : (n+step/2n)/step;
export function timelineValue(date) {
  const bounds = timelineBounds(date);
  if (!bounds) return `${formatFseNanoseconds(timelineNanoseconds(date))} FSE`;
  // Retain only precision whose rounding is invariant across the source window.
  // Early historical reconstructions are additionally capped at whole Ms.
  for(let places = date < '1961-01-01' ? 0 : 6; places >= -6; places--) {
    const step = places >= 0 ? MS/(10n**BigInt(places)) : MS*(10n**BigInt(-places));
    const first=rounded(bounds[0],step),last=rounded(bounds[1],step);
    if(first===last) return `≈ ${decimal(places>=0 ? first : first*(10n**BigInt(-places)),Math.max(0,places))} Ms FSE`;
  }
  throw new Error('Timeline uncertainty exceeds supported approximation scale');
}
export function timelinePosition(date, start, end) {
  const value = date.includes('T') ? timelineNanoseconds(date) : (timelineNanoseconds(`${date}T00:00:00Z`) + timelineNanoseconds(new Date(Date.parse(`${date}T00:00:00Z`)+86400000).toISOString()))/2n;
  return 100 * Number(value-timelineNanoseconds(start))/Number(timelineNanoseconds(end)-timelineNanoseconds(start));
}
