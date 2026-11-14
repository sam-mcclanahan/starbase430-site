// Editable contours from the approved standalone N.Tesla.JPG drawing.
// Background excluded; jacket grain suppressed; pupils and mustache hatched.
// No photograph or external runtime dependency is included in the site output.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const asset=new URL('../src/assets/illustrations/pablo/',import.meta.url);
const strokes=JSON.parse(await readFile(new URL('tesla-strokes.json',import.meta.url),'utf8'));
// Preserve exact tenths as integer deltas; accumulation happens before division.
// Keep the readable master unchanged and fail rather than silently quantizing it.
const deltas=strokes.map(stroke=>{
 let previous=[0,0];
 return stroke.flatMap(point=>{
  const scaled=point.map(value=>{
   const integer=Math.round(value*10);
   if(!Number.isSafeInteger(integer)||integer/10!==value)throw new Error('Tesla coordinates must be exact safe integer tenths.');
   return integer;
  });
  const delta=scaled.map((value,i)=>value-previous[i]);previous=scaled;return delta;
 });
});
const project=([x,y])=>[250.85324203123724+.7165989379933819*x,179.02625361968643+.0680749825551743*x+.720553364368584*y];
const ink=strokes.map(stroke=>stroke.map((p,i)=>(i?'L':'M')+project(p).map(v=>v.toFixed(1).replace(/\.0$/, '')).join(' ')).join('')).join('');
for(const name of ['polargraph.html','polargraph.svg']){
 const file=new URL(name,asset);let s=await readFile(file,'utf8');
 s=s.replace(/(<path\b[^>]*\bid="ink"[^>]*\bd=")[^"]*/,(_,prefix)=>prefix+(name.endsWith('.html')?'':ink));
 if(name.endsWith('.html')){
  const marker=/const TESLA_STROKES=.*?;\nconst TESLA_STEPS=/s;
  if(!marker.test(s))throw new Error('Tesla controller marker missing.');
  s=s.replace(marker,'const TESLA_STROKES='+JSON.stringify(deltas)+`.map(stroke=>{
 let x=0,y=0;
 return Array.from({length:stroke.length/2},(_,i)=>[(x+=stroke[i*2])/10,(y+=stroke[i*2+1])/10]);
});\nconst TESLA_STEPS=`);
 }
 await writeFile(file,s);
}
await sharp(await readFile(new URL('polargraph.svg',asset))).png({palette:true,colours:128,dither:0,compressionLevel:9}).toFile(new URL('pablo.png',asset).pathname);
const hash=createHash('sha256').update(await readFile(new URL('polargraph.html',asset))).digest('hex');
const reviewed=new URL('reviewed-embeds.js',import.meta.url);
await writeFile(reviewed,(await readFile(reviewed,'utf8')).replace(/("assets\/illustrations\/pablo\/polargraph.html": ")[a-f0-9]+/,(_,prefix)=>prefix+hash));
console.log(`Updated Tesla artwork: ${strokes.length} separate pen strokes.`);
