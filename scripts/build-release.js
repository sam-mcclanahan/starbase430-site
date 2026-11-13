import assert from 'node:assert/strict';
import {readFile,readdir,rm} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {checkRelease} from './check-release-snapshot.js';
import {checkOutput} from './check-output.js';
import {siteBudgets} from './page-budgets.js';
import {prohibitedPath,runGitleaks,textIssues} from './check-privacy.js';

const root=fileURLToPath(new URL('../',import.meta.url));
const required=[
 'index.html','about/index.html','links/index.html','colophon/index.html',
 'log/index.html','projects/index.html','feed.xml','log/feed.xml','projects/feed.xml',
 'log/building-starbase-430-for-the-small-web/index.html',
 'log/pablo-the-polargraph/index.html','log/pablo-the-polargraph/interactive/index.html',
 'log/first-step-epoch/index.html'
];
export async function checkReleaseFiles(directory){
 const policy=JSON.parse(await readFile(path.join(root,'privacy-policy.json'),'utf8'));
 const files=[];
 async function walk(relative=''){
  for(const entry of await readdir(path.join(directory,relative),{withFileTypes:true})){
   const file=path.posix.join(relative,entry.name);
   assert.ok(!entry.isSymbolicLink(),'Release output cannot contain symlinks');
   assert.ok(!prohibitedPath(file)&&!/(^|\/)(?:src|docs|scripts|test|drafts)(\/|$)/.test(file),'Private/source directory in release output');
   if(entry.isDirectory()){await walk(file);continue;}
   assert.ok(entry.isFile(),'Special file in release output');
   assert.ok(/\.(?:html|css|js|svg|png|avif|webp|ico|xml|txt)$/.test(file),'Unexpected release file type');
   if(/\.(?:html|css|js|svg|xml|txt)$/.test(file)){
    const text=await readFile(path.join(directory,file),'utf8');
    assert.deepEqual(textIssues(text,policy),[],'Private metadata in generated output');
    assert.ok(!/reload-client\.js|eleventy-server-browser-sync|Unpublished draft:|DRAFT LOG/.test(text),'Development/draft content in release output');
   }
   files.push(file);
  }
 }
 await walk();
 for(const file of required)assert.ok(files.includes(file)&&((await readFile(path.join(directory,file))).length>0),'Missing required release document');
 const feed=await readFile(path.join(directory,'feed.xml'),'utf8');
 for(const alias of ['log/feed.xml','projects/feed.xml'])assert.equal(await readFile(path.join(directory,alias),'utf8'),feed,'Feed compatibility copies must match');
 return files;
}
export async function checkBuiltRelease(directory){
 const files=await checkReleaseFiles(directory);
 const site=JSON.parse(await readFile(path.join(root,'src/_data/site.json'),'utf8'));
 const structure=await checkOutput(directory,site.url);
 assert.deepEqual(structure.errors,[],'Generated release structure failed');
 const budgets=await siteBudgets(directory);
 assert.ok(budgets.every(page=>page.status!=='FAIL'),'Generated release exceeds a hard page budget');
 const policy=JSON.parse(await readFile(path.join(root,'privacy-policy.json'),'utf8'));
 runGitleaks(root,policy,['dir',directory],path.join(root,'.gitleaks.toml'));
 return {files:files.length,pages:structure.pages,maxPageBytes:Math.max(...budgets.map(page=>page.bytes))};
}
export async function buildRelease(){
 await checkRelease();
 // Isolate the release from any running development server and stale preview files.
 const output=path.join(root,'.cache/release-site');
 await rm(output,{recursive:true,force:true});
 const {default:Eleventy}=await import('@11ty/eleventy');
 await new Eleventy('src',output,{source:'cli',runMode:'build',quietMode:true}).write();
 return {...await checkBuiltRelease(output),output:'.cache/release-site'};
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))console.log(JSON.stringify(await buildRelease(),null,2));
