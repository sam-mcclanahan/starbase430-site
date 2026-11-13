import assert from 'node:assert/strict';
import test from 'node:test';
import {cp,mkdtemp,readFile,readdir,mkdir,rm,symlink,writeFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkInventory} from '../scripts/check-release-snapshot.js';
const root=fileURLToPath(new URL('../',import.meta.url));
const entries=[['building-starbase-430-for-the-small-web','2026-11-05T12:26:05-05:00'],['pablo-the-polargraph','2026-11-07T11:20:45-05:00'],['first-step-epoch','2026-11-12T14:44:34-05:00']];
async function fixture(t){
 const dir=await mkdtemp(path.join(tmpdir(),'starbase430-release-test-'));t.after(()=>rm(dir,{recursive:true,force:true}));
 for(const name of ['src','package.json','eleventy.config.js'])await cp(path.join(root,name),path.join(dir,name),{recursive:true});
 await symlink(path.join(root,'node_modules'),path.join(dir,'node_modules'),'dir');return dir;
}
function build(dir,mode){const out=path.join(dir,mode);execFileSync(process.execPath,['--input-type=module','-e',`import Eleventy from '@11ty/eleventy';await new Eleventy('src',${JSON.stringify(out)},{source:'cli',runMode:${JSON.stringify(mode)},quietMode:true}).write();`],{cwd:dir,stdio:'pipe'});return out;}
test('published metadata and approved image alternatives remain available in release and preview',async t=>{
 const dir=await fixture(t);
 for(const mode of ['build','watch']){
  const out=build(dir,mode),feed=await readFile(path.join(out,'feed.xml'),'utf8');
  for(const [slug,date] of entries){
   const source=await readFile(path.join(dir,'src/log/'+slug+'.md'),'utf8');assert.ok(source.includes(`date: "${date}"`));assert.match(source,/^draft: false$/m);
   const html=await readFile(path.join(out,'log/'+slug+'/index.html'),'utf8');assert.doesNotMatch(html,/DRAFT LOG|Unpublished draft:/);assert.ok(html.includes('aria-label="FSE: First Step Epoch, how our Log timestamps work"'));
   assert.ok(feed.includes(`https://starbase430.com/log/${slug}/`));
  }
  for(const alias of ['log/feed.xml','projects/feed.xml'])assert.equal(await readFile(path.join(out,alias),'utf8'),feed);
  assert.deepEqual([...feed.matchAll(/<dc:creator>(.*?)<\/dc:creator>/g)].map(m=>m[1]),['Sam','Sam','Sam']);assert.doesNotMatch(feed,/<author>|mailto:/);
  for(const f of ['assets/images/fse/apollo11-insignia-320.avif','assets/images/fse/apollo11-insignia-320.webp','assets/images/pablo/pablo-working-session-480.avif','assets/images/pablo/pablo-working-session-320.webp'])assert.ok((await readFile(path.join(out,f))).length);
  const embed=await readFile(path.join(out,'assets/illustrations/pablo/polargraph.html'),'utf8');assert.ok(embed.includes((await readFile(path.join(root,'licenses/anatomy-MIT.txt'),'utf8')).trim()));
 }
});
test('synthetic unpublished page, assets, and feed entry are isolated from production',async t=>{
 const dir=await fixture(t);await mkdir(path.join(dir,'src/_draft-assets/synthetic'),{recursive:true});await cp(path.join(root,'src/assets/images/starbase430-88x31.png'),path.join(dir,'src/_draft-assets/synthetic/test.png'));
 await writeFile(path.join(dir,'src/log/synthetic-unpublished.md'),'---\ntitle: Synthetic unpublished fixture\nslug: synthetic-unpublished\ndescription: A synthetic draft used only for isolation testing.\ndate: "2026-11-13T12:00:00-05:00"\nauthor: brea\nstatus: active\ndraft: true\n---\n\nPrivate fixture sentinel.\n\n![Synthetic fixture](/assets/drafts/synthetic/test.png)\n');
 for(const mode of ['build','watch']){
  const out=build(dir,mode),files=await readdir(out,{recursive:true});assert.equal(files.includes('log/synthetic-unpublished/index.html'),mode==='watch');assert.equal(files.includes('assets/drafts/synthetic/test.png'),mode==='watch');
  for(const f of ['index.html','log/index.html','feed.xml','log/feed.xml','projects/feed.xml'])assert.equal((await readFile(path.join(out,f),'utf8')).includes('/log/synthetic-unpublished/'),mode==='watch');
 }
});
test('publication inventory rejects unexpected private files and missing reviewed files',()=>{
 assert.doesNotThrow(()=>checkInventory(['src/index.njk'],['src/index.njk']));
 assert.throws(()=>checkInventory(['src/index.njk','.env'],['src/index.njk']));
 assert.throws(()=>checkInventory([],['src/index.njk']));
 assert.throws(()=>checkInventory(['src/_draft-assets/master.png'],['src/_draft-assets/master.png']));
});
