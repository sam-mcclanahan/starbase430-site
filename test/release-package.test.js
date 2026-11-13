import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdir,mkdtemp,rm,symlink,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {checkReleaseFiles} from '../scripts/build-release.js';
async function fixture(t){const dir=await mkdtemp(path.join(tmpdir(),'starbase-release-package-'));t.after(()=>rm(dir,{recursive:true,force:true}));return dir;}
test('release packaging rejects draft assets even when they are unreferenced',async t=>{
 const dir=await fixture(t);await mkdir(path.join(dir,'assets/drafts'),{recursive:true});await writeFile(path.join(dir,'assets/drafts/fixture.txt'),'Synthetic private draft');
 await assert.rejects(()=>checkReleaseFiles(dir),/Private\/source directory/);
});
test('release packaging rejects preview reload scripts',async t=>{
 const dir=await fixture(t);await writeFile(path.join(dir,'index.html'),'<script src="/reload-client.js"></script>');
 await assert.rejects(()=>checkReleaseFiles(dir),/Development\/draft/);
});
test('release packaging rejects symlinks and source files',async t=>{
 const dir=await fixture(t);await symlink('outside',path.join(dir,'link.html'));await assert.rejects(()=>checkReleaseFiles(dir),/symlinks/);
 await rm(path.join(dir,'link.html'));await writeFile(path.join(dir,'private.md'),'Synthetic authoring source');await assert.rejects(()=>checkReleaseFiles(dir),/file type/);
});
test('release packaging rejects an empty or incomplete website',async t=>{
 const dir=await fixture(t);await writeFile(path.join(dir,'index.html'),'Incomplete site');await assert.rejects(()=>checkReleaseFiles(dir),/Missing required/);
});
