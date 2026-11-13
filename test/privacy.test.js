import assert from 'node:assert/strict';
import test from 'node:test';
import {mkdtemp,rm,writeFile,readFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
import sharp from 'sharp';
import {git,prohibitedPath,textIssues,checkIdentity,destinationAllowed,inspectSnapshot,inspectAncestry,inspectCommit,inspectTag,runGitleaks} from '../scripts/check-privacy.js';
const policy=JSON.parse(await readFile(new URL('../privacy-policy.json',import.meta.url),'utf8'));
const privateEmail=['private-person','example.net'].join('@');
async function fixture(t,extra={}){
 const root=await mkdtemp(path.join(tmpdir(),'starbase-privacy-fixture-'));t.after(()=>rm(root,{recursive:true,force:true}));
 git(root,['init','-b','main']);git(root,['config','user.name',policy.owner.name]);git(root,['config','user.email',policy.owner.email]);
 const data={'note.md':'Approved fixture.\n',...extra};
 await writeFile(path.join(root,'release-manifest.json'),JSON.stringify({files:['release-manifest.json',...Object.keys(data)]}));
 for(const [file,text]of Object.entries(data))await writeFile(path.join(root,file),text);
 git(root,['add','-A']);return root;
}
test('sensitive paths are denied independently of manifest approval',()=>{
 for(const f of ['.env','.env.production','_private/notes.md','src/_draft-assets/master.png','research/notes.md','review/report.html','backup.zip','snapshot.tar.gz','private.key','network.har','link\nname'])assert.ok(prohibitedPath(f),f);
 for(const f of ['.env.example','.githooks/pre-commit','.github/workflows/checks.yml','test/privacy.test.js'])assert.ok(!prohibitedPath(f),f);
});
test('privacy text checks distinguish approved examples from real contact/path values',()=>{
 assert.deepEqual(textIssues(policy.owner.email+' test@example.org example@example.invalid',policy),[]);
 assert.deepEqual(textIssues('git@github.com:'+policy.repository+'.git',policy),[]);
 assert.ok(textIssues(privateEmail,policy).length);
 assert.ok(textIssues(['','Users','private-person','source'].join('/'),policy).length);
 assert.ok(textIssues(['192','168','3','9'].join('.'),policy).length);
});
test('only exact owner identities and separately approved service committers are accepted',()=>{
 assert.doesNotThrow(()=>checkIdentity(policy.owner.name,policy.owner.email,policy));
 assert.throws(()=>checkIdentity('Unapproved',policy.owner.email,policy));
 assert.throws(()=>checkIdentity(policy.owner.name,privateEmail,policy,'committer'));
 assert.doesNotThrow(()=>checkIdentity('GitHub',policy.serviceCommitters[0].email,policy,'committer'));
 assert.throws(()=>checkIdentity('GitHub',policy.serviceCommitters[0].email,policy,'author'));
});
test('push destination permits only explicit approved GitHub transports',()=>{
 assert.ok(destinationAllowed('https://github.com/'+policy.repository+'.git',policy.repository));
 assert.ok(destinationAllowed('git@github.com:'+policy.repository+'.git',policy.repository));
 for(const url of ['https://example.org/'+policy.repository,'https://github.com/other/repo.git','https://'+['user:token','github.com'].join('@')+'/'+policy.repository+'.git','https://github.com/'+policy.repository+'.git/extra'])assert.ok(!destinationAllowed(url,policy.repository));
});
test('exact staged blobs are scanned even when the working copy is cleaned afterward',async t=>{
 const root=await fixture(t,{'note.md':privateEmail});await writeFile(path.join(root,'note.md'),'Clean working copy.');
 await assert.rejects(()=>inspectSnapshot(root,'index',policy),/unapproved email/);
 git(root,['add','note.md']);await inspectSnapshot(root,'index',policy);
});
test('a deleted working file cannot hide unsafe staged content',async t=>{
 const root=await fixture(t,{'note.md':privateEmail});await rm(path.join(root,'note.md'));
 await assert.rejects(()=>inspectSnapshot(root,'index',policy),/unapproved email/);
});
test('force-added ignored private content and symlinks cannot be approved by the inventory',async t=>{
 const root=await fixture(t,{'note.md':'Approved'});await writeFile(path.join(root,'.gitignore'),'.env.*\n');await writeFile(path.join(root,'.env.local'),'Fixture');
 await writeFile(path.join(root,'release-manifest.json'),JSON.stringify({files:['release-manifest.json','note.md','.env.local','.gitignore']}));git(root,['add','-A']);git(root,['add','-f','.env.local']);
 await assert.rejects(()=>inspectSnapshot(root,'index',policy),/Prohibited source/);
 const target=git(root,['hash-object','-w','--stdin'],Buffer.from('outside')).toString().trim();git(root,['update-index','--cacheinfo',`120000,${target},note.md`]);git(root,['rm','--cached','.env.local']);
 await writeFile(path.join(root,'release-manifest.json'),JSON.stringify({files:['release-manifest.json','note.md','.gitignore']}));git(root,['add','release-manifest.json']);
 await assert.rejects(()=>inspectSnapshot(root,'index',policy),/Symlink/);
});
test('informative image metadata and oversized masters are rejected',async t=>{
 const bytes=await sharp({create:{width:20,height:20,channels:3,background:'#888888'}}).png().withMetadata({exif:{IFD0:{Artist:'Private fixture author'}}}).toBuffer();
 const root=await fixture(t,{'photo.png':bytes});await assert.rejects(()=>inspectSnapshot(root,'index',policy),/identifying metadata/);
 const large=await sharp({create:{width:2000,height:2,channels:3,background:'#888888'}}).png().toBuffer();await writeFile(path.join(root,'photo.png'),large);git(root,['add','photo.png']);await assert.rejects(()=>inspectSnapshot(root,'index',policy),/Oversized image/);
});
test('foreign archive roots are rejected even when merged into the allowed root',async t=>{
 const root=await fixture(t);git(root,['commit','-m','Reviewed root']);const first=git(root,['rev-parse','HEAD']).toString().trim();const tree=git(root,['rev-parse','HEAD^{tree}']).toString().trim();
 const own={...policy,releaseRoot:first};assert.doesNotThrow(()=>inspectAncestry(root,first,own));
 const foreign=git(root,['commit-tree',tree],Buffer.from('Unrelated root\n')).toString().trim();const merge=git(root,['commit-tree',tree,'-p',first,'-p',foreign],Buffer.from('Fixture merge\n')).toString().trim();
 assert.throws(()=>inspectAncestry(root,merge,own),/Foreign\/archive/);
});
test('bad intermediate commit identity and private commit messages are detected',async t=>{
 const root=await fixture(t);git(root,['commit','-m','Reviewed fixture']);const tree=git(root,['rev-parse','HEAD^{tree}']).toString().trim();
 const badMessage=git(root,['commit-tree',tree],Buffer.from(privateEmail+'\n')).toString().trim();assert.throws(()=>inspectCommit(root,badMessage,policy),/message/);
 git(root,['config','user.email',privateEmail]);const badIdentity=git(root,['commit-tree',tree],Buffer.from('No private message\n')).toString().trim();assert.throws(()=>inspectCommit(root,badIdentity,policy),/identity/);
});
test('real Gitleaks detects a synthetic credential without returning its value',async t=>{
 const token=['ghp','Ab3dE5gH7jK9mN2pQ4sT6vW8yZ1cF0rUoLxS'.slice(0,36)].join('_');const root=await fixture(t,{'note.md':token});
 const config=new URL('../.gitleaks.toml',import.meta.url).pathname;
 assert.throws(()=>runGitleaks(root,policy,['git','--pre-commit','--staged'],config),error=>error.message.includes('potential credential')&&!error.message.includes(token));
});

test('annotated tags cannot hide a personal tagger identity or message',async t=>{
 const root=await fixture(t);git(root,['commit','-m','Reviewed fixture']);
 git(root,['tag','-a','good','-m','Reviewed tag']);assert.doesNotThrow(()=>inspectTag(root,'good',policy));
 git(root,['config','user.email',privateEmail]);git(root,['tag','-a','bad','-m','Fixture']);assert.throws(()=>inspectTag(root,'bad',policy),/identity/);
});
