// Editable contours from the approved standalone N.Tesla.JPG drawing.
// Background excluded; jacket grain suppressed; pupils and mustache hatched.
// No photograph or external runtime dependency is included in the site output.
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import sharp from 'sharp';
const asset=new URL('../src/assets/illustrations/pablo/',import.meta.url);
const strokes=JSON.parse(await readFile(new URL('tesla-strokes.json',import.meta.url),'utf8'));
const project=([x,y])=>[250.85324203123724+.7165989379933819*x,179.02625361968643+.0680749825551743*x+.720553364368584*y];
const ink=strokes.map(stroke=>stroke.map((p,i)=>(i?'L':'M')+project(p).map(v=>v.toFixed(1).replace(/\.0$/, '')).join(' ')).join('')).join('');
for(const name of ['polargraph.html','polargraph.svg']){
 const file=new URL(name,asset);let s=await readFile(file,'utf8');
 s=s.replace(/(<path\b[^>]*\bid="ink"[^>]*\bd=")[^"]*/,(_,prefix)=>prefix+ink);
 if(name.endsWith('.html'))s=s.replace(/const TESLA_STROKES=.*?;\nconst TESLA_STEPS=/s,'const TESLA_STROKES='+JSON.stringify(strokes)+';\nconst TESLA_STEPS=');
 await writeFile(file,s);
}
await sharp(await readFile(new URL('polargraph.svg',asset))).png({palette:true,colours:128,dither:0,compressionLevel:9}).toFile(new URL('pablo.png',asset).pathname);
const hash=createHash('sha256').update(await readFile(new URL('polargraph.html',asset))).digest('hex');
const reviewed=new URL('reviewed-embeds.js',import.meta.url);
await writeFile(reviewed,(await readFile(reviewed,'utf8')).replace(/("assets\/illustrations\/pablo\/polargraph.html": ")[a-f0-9]+/,(_,prefix)=>prefix+hash));
console.log(`Updated Tesla artwork: ${strokes.length} separate pen strokes.`);
