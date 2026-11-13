import { readFile, writeFile } from 'node:fs/promises';
import { timelineNanoseconds, timelineValue, timelinePosition } from '../src/_lib/science-timeline.js';
const researchFile = new URL('../data/fse-timeline.json',import.meta.url);
const articleFile = new URL('../src/log/first-step-epoch.md',import.meta.url);
const research = JSON.parse(await readFile(researchFile,'utf8'));
if (research.timelineMode !== 'release') throw new Error('Expected the reviewed release timeline dataset.');
const count = research.slotCount;
const selected = (research.selectedMilestoneDates || []).map(date => {
  const event = research.events.find(e=>e.date===date);
  if(!event) throw new Error('Selected milestone missing research');
  return {...event,...research.cardCopy?.[date]};
});
const escape=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('"','&quot;');
if (!Number.isInteger(count) || count < 15 || count > 20) throw new Error('Planning timeline requires 15–20 separate slots');
const start = `${research.timelineStart}T00:00:00Z`, end = `${research.reviewedThrough}T00:00:00Z`;
const duration = Number(timelineNanoseconds(end)-timelineNanoseconds(start));
let html = '<div class="science-timeline science-planning">\n<div class="science-axis" aria-hidden="true">\n';
for(let year=Number(start.slice(0,4));year<=Number(end.slice(0,4));year+=5) {
  const instant=`${year}-01-01T00:00:00Z`;
  if(instant>=end) continue;
  const p=100*Number(timelineNanoseconds(instant)-timelineNanoseconds(start))/duration;
  html+=`<span class="science-year science-tick" style="--year:${p.toFixed(3)}%">${year}</span>\n`;
}
html+='</div>\n<ol class="science-slots" role="list">\n';
for(let i=0;i<count;i++) {
  const side=i%2?'event-right':'event-left';
  const event=selected[i];
  if(event) {
    const position=timelinePosition(event.date,start,end);
    const anchor = event.desktopAnchorPercent ?? 50;
    if (!Number.isFinite(anchor) || anchor < 0 || anchor > 100) throw new Error('Card anchor must be within its full height');
    const dateLabel=new Date(event.date.includes('T')?event.date:`${event.date}T00:00:00Z`).toLocaleDateString('en-US',{timeZone:'UTC',year:'numeric',month:'long',day:'numeric'});
    const fse=timelineValue(event.date);
    const fseMarkup=fse.startsWith('≈') ? `<em><span aria-hidden="true">≈</span><span class="sr-only"> Approximately</span>${fse.slice(1)}</em>` : fse;
    const clock=event.date.includes('T')?` · ${event.date.slice(11).replace('Z','')} UTC`:'';
    html+=`<li class="science-slot ${side} science-event" id="science-event-${i+1}" style="top:${position.toFixed(6)}%;--anchor:${anchor}%"><div class="science-card"><p class="science-event-fse">${fseMarkup}</p><p class="science-event-title"><strong><a href="${escape(event.source)}">${escape(event.title)}</a></strong></p><p class="science-event-summary">${escape(event.summary)}</p><p class="science-event-date">${escape(event.datePrefix||'')}<time datetime="${event.date}">${dateLabel}${clock}</time></p></div></li>\n`;
  } else {
    html+=`<li class="science-slot ${side}" style="top:${((i+.5)/count*100).toFixed(3)}%"><div class="science-card"><p class="science-field">Planning slot ${String(i+1).padStart(2,'0')}</p><p>Milestone to select</p></div></li>\n`;
  }
}
html+=`</ol>\n</div>\n<p class="science-endpoint"><time datetime="${research.reviewedThrough}">November 12, 2026</time> · Timeline reference date · ${timelineValue(end)}</p>`;
const source=await readFile(articleFile,'utf8');
const marker=/<!-- science-timeline:start -->[\s\S]*?<!-- science-timeline:end -->/;
if(!marker.test(source)) throw new Error('Missing generated timeline boundaries');
await writeFile(articleFile,source.replace(marker,`<!-- science-timeline:start -->\n${html}\n<!-- science-timeline:end -->`));
console.log(`Generated ${selected.length} dated milestones and ${count-selected.length} unassigned slots on the uniform ${research.timelineStart.slice(0,4)}–${research.reviewedThrough.slice(0,4)} axis.`);
