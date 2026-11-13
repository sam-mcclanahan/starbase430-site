import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const excluded=new Set(['.git','node_modules','_site','.cache','.a11y','coverage','_private']);
export function checkInventory(actual,approved){
 assert.deepEqual([...actual].sort(),[...approved].sort(),'Unexpected or missing source file: review source publication boundary before updating release-manifest.json');
 for(const file of actual)assert.ok(!/(?:^|\/)(?:\.env(?:\.|$)|_draft-assets|research|review|\.git)(?:\/|$)/.test(file),`Private/archive input: ${file}`);
}
export async function checkRelease(){
 const manifest=JSON.parse(await readFile(path.join(root,'release-manifest.json'),'utf8'));
 const files=[];
 async function walk(dir=''){
  for(const e of await readdir(path.join(root,dir),{withFileTypes:true})){
   if(!dir&&excluded.has(e.name))continue;
   if(e.name==='.DS_Store')continue;
   const f=path.posix.join(dir,e.name);
   if(e.isDirectory())await walk(f);else {assert.ok(e.isFile(),`Unexpected symlink/special file: ${f}`);files.push(f);}
  }
 }
 await walk();
 try {
  const tracked=execFileSync('git',['ls-files','--cached','-z'],{cwd:root,stdio:['ignore','pipe','ignore']}).toString().split('\0').filter(Boolean);
  for(const file of tracked)if(!files.includes(file))files.push(file);
 } catch { /* A prepared snapshot may not have Git initialized yet. */ }
 checkInventory(files,manifest.files);
 for(const file of files.filter(f=>/^src\/.*\.(md|njk|11ty\.js)$/.test(f))){
  const text=await readFile(path.join(root,file),'utf8');
  assert.ok(!/^draft:\s*true\s*$/m.test(text)&&!/^\s*draft:\s*true\s*[,}]?$/m.test(text),`Unpublished source in release repository: ${file}`);
  assert.ok(!/\/(?:Users|home)\/[\w.-]+\//.test(text),`Machine path in source: ${file}`);
 }
 return `${files.length} reviewed source files; no unpublished source or private archive directories`;
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(await checkRelease());
