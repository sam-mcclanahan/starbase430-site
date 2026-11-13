import {readFile,mkdtemp,writeFile,mkdir,rm} from 'node:fs/promises';
import {execFileSync,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import sharp from 'sharp';
const defaultRoot=fileURLToPath(new URL('../',import.meta.url));
const zero=/^0+$/;
const safe=s=>String(s).replace(/[A-Z0-9._%+\-]{1,64}@[A-Z0-9.\-]{1,253}\.[A-Z]{2,24}/gi,'[redacted email]').replace(/\/(?:Users|home)\/[\w.-]+\//g,'[redacted path]/');
export const git=(root,args,input)=>execFileSync('git',args,{cwd:root,input,maxBuffer:32*1024*1024,stdio:['pipe','pipe','pipe']});
export function destinationAllowed(url,repository){return [`https://github.com/${repository}.git`,`https://github.com/${repository}`,`git@github.com:${repository}.git`,`git@github.com:${repository}`,`ssh://git@github.com/${repository}.git`].includes(url);}
export function prohibitedPath(file){
 const parts=file.split('/');
 return /[\x00-\x1f\x7f]/.test(file)||parts.some(p=>['.git','.ssh','_private','_draft-assets','research','review','node_modules','.cache','.a11y','_site'].includes(p)||(/^\.env(?:\.|$)/.test(p)&&p!=='.env.example'))||/\.(?:zip|7z|rar|tar|tgz|gz|pem|key|p12|pfx|har|log)$/i.test(file);
}
export function checkIdentity(name,email,policy,role='author'){
 const allowed=[policy.owner,...(role==='committer'?policy.serviceCommitters:[])];
 if(!allowed.some(i=>i.name===name&&i.email===email))throw new Error(`Unapproved ${role} identity (value redacted).`);
}
export function textIssues(text,policy){
 const issues=[];
 // GitHub SSH transport usernames are not contact addresses.
 const emailText=text.replace(/(?:ssh:\/\/)?git@github\.com[:/]/g,'GitHub SSH transport ');
 const emails=[...emailText.matchAll(/[A-Z0-9._%+\-]{1,64}@[A-Z0-9.\-]{1,253}\.[A-Z]{2,24}/gi)].map(m=>m[0]);
 if(emails.some(e=>e!==policy.owner.email&&!policy.serviceCommitters.some(i=>i.email===e)&&!policy.syntheticEmails.includes(e)))issues.push('unapproved email (redacted)');
 if(/\/(?:Users|home)\/[\w.-]+\//.test(text))issues.push('machine-specific home path (redacted)');
 if(/\b(?:192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})\b/.test(text))issues.push('private-network address (redacted)');
 return issues;
}
function parseIdentity(raw){const m=raw.match(/^(.*) <([^>]*)> /);if(!m)throw new Error('Malformed Git identity.');return {name:m[1],email:m[2]};}
export function snapshot(root,ref){
 const indexed=ref==='index';const out=git(root,indexed?['ls-files','--stage','-z']:['ls-tree','-r','-z',ref]).toString();
 const entries=out.split('\0').filter(Boolean).map(row=>{const split=row.indexOf('\t');const [mode,second,third]=row.slice(0,split).split(' ');if(indexed&&third!=='0')throw new Error('Resolve staged conflicts before privacy review.');return {mode,sha:indexed?second:third,file:row.slice(split+1)};});
 return entries;
}
export async function inspectSnapshot(root,ref,policy){
 const entries=snapshot(root,ref);const get=file=>{const e=entries.find(x=>x.file===file);if(!e)throw new Error(`Missing required source file: ${file}`);return git(root,['cat-file','blob',e.sha]);};
 const manifest=JSON.parse(get('release-manifest.json'));
 const names=entries.map(e=>e.file).sort();if(JSON.stringify(names)!==JSON.stringify([...manifest.files].sort()))throw new Error('Snapshot file inventory does not match its staged/committed release manifest.');
 for(const e of entries){
  if(!['100644','100755'].includes(e.mode))throw new Error(`Symlink/submodule/special source rejected: ${safe(e.file)}`);
  if(prohibitedPath(e.file))throw new Error(`Prohibited source path: ${safe(e.file)}`);
  const b=git(root,['cat-file','blob',e.sha]);if(b.length>policy.maxFileBytes)throw new Error(`Oversized source/master: ${safe(e.file)}`);
  const raster=/\.(?:png|jpe?g|webp|avif|tiff?|heic)$/i.test(e.file);
  if(raster){
   let m;try{m=await sharp(b,{limitInputPixels:4_000_000}).metadata();}catch{throw new Error(`Unreadable/oversized image: ${safe(e.file)}`);}
   if(m.width>policy.maxImageDimension||m.height>policy.maxImageDimension||b.length>policy.maxImageBytes)throw new Error(`Oversized image master: ${safe(e.file)}`);
   const identifies=m.exif||m.xmp||m.iptc||m.comments?.length;
   const approved=policy.metadataExceptions[e.file]===createHash('sha256').update(b).digest('hex');
   if(identifies&&!approved)throw new Error(`Image identifying metadata requires removal/review: ${safe(e.file)}`);
  }else if(/\.ico$/i.test(e.file)){
   if(policy.reviewedIcons[e.file]!==createHash('sha256').update(b).digest('hex'))throw new Error(`Changed icon needs metadata review: ${safe(e.file)}`);
  }else{
   const issues=textIssues(b.toString('utf8'),policy);if(issues.length)throw new Error(`${safe(e.file)}: ${issues.join('; ')}`);
   if(e.file.startsWith('src/')&&(/^[ \t]*draft:\s*true\s*[,}]?\s*$/m.test(b.toString())||/\bdraft\s*:\s*true\b/.test(b.toString())))throw new Error(`Unpublished source rejected: ${safe(e.file)}`);
  }
 }
 return entries.length;
}
export function inspectAncestry(root,tip,policy){
 const roots=git(root,['rev-list','--max-parents=0',tip]).toString().trim().split('\n');
 if(roots.length!==1||roots[0]!==policy.releaseRoot)throw new Error('Foreign/archive history rejected: only the reviewed release root is permitted.');
}
export function inspectCommit(root,sha,policy){
 const fields=git(root,['show','-s','--format=%an%x00%ae%x00%cn%x00%ce%x00%B',sha]).toString().split('\0');
 checkIdentity(fields[0],fields[1],policy);checkIdentity(fields[2],fields[3],policy,'committer');
 const issues=textIssues(fields.slice(4).join('\0'),policy);if(issues.length)throw new Error('Commit message contains private data (redacted).');
}
export function inspectTag(root,sha,policy){
 if(git(root,['cat-file','-t',sha]).toString().trim()!=='tag')return;
 const raw=git(root,['cat-file','tag',sha]).toString();
 const header=raw.split('\n\n')[0];const line=header.split('\n').find(l=>l.startsWith('tagger '));
 if(!line)throw new Error('Annotated tag lacks a reviewed tagger identity.');
 const identity=parseIdentity(line.slice(7));checkIdentity(identity.name,identity.email,policy,'tagger');
 if(textIssues(raw.split('\n\n').slice(1).join('\n\n'),policy).length)throw new Error('Annotated tag message contains private data (redacted).');
}
export function runGitleaks(root,policy,args,configPath){
 const binary=path.join(defaultRoot,'.cache/privacy-tools/gitleaks');
 let v;try{v=execFileSync(binary,['version'],{encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();}catch{throw new Error('Pinned Gitleaks missing; run npm run setup:privacy (do not skip privacy checks).');}
 if(v!==policy.gitleaks.version)throw new Error('Gitleaks version does not match the reviewed pin.');
 const temporary=mkdtempSync(path.join(tmpdir(),'starbase-secret-scan-'));
 try {
  const ignore=path.join(temporary,'empty-ignore');writeFileSync(ignore,'');
  const result=spawnSync(binary,[...args,'--config',configPath,'--gitleaks-ignore-path',ignore,'--redact=100','--no-banner','--ignore-gitleaks-allow','--max-decode-depth=2'],{cwd:root,stdio:'pipe',encoding:'utf8',timeout:120000});
  if(result.status!==0)throw new Error(result.status===1?'Gitleaks detected a potential credential (details redacted; agent investigation required).':'Gitleaks could not complete; privacy check failed closed.');
 } finally {rmSync(temporary,{recursive:true,force:true});}
}
export async function checkPrivacy(mode,{root=defaultRoot,stdin='',remoteUrl=''}={}){
 const policy=JSON.parse(await readFile(path.join(defaultRoot,'privacy-policy.json'),'utf8'));
 const temp=await mkdtemp(path.join(tmpdir(),'starbase-privacy-check-'));
 try{
  if(mode==='staged'){
   // Check the effective commit identity and exact staged blobs, not working copies.
   for(const [key,role] of [['GIT_AUTHOR_IDENT','author'],['GIT_COMMITTER_IDENT','committer']]){const id=parseIdentity(git(root,['var',key]).toString());checkIdentity(id.name,id.email,policy,role);}
   await inspectSnapshot(root,'index',policy);
   const config=path.join(temp,'gitleaks.toml');await writeFile(config,git(root,['show',':.gitleaks.toml']));
   runGitleaks(root,policy,['git','--pre-commit','--staged'],config);
  }else if(mode==='history'||mode==='push'){
   let tips=[];let commits=[];
   if(mode==='push'){
    if(!destinationAllowed(remoteUrl,policy.repository))throw new Error('Push destination is not the approved release repository.');
    for(const line of stdin.trim().split('\n').filter(Boolean)){
     const [localRef,local,remoteRef,remote]=line.split(/\s+/);if(!localRef||!remoteRef||!/^([a-f0-9]{40})$/.test(local??'')||!/^([a-f0-9]{40})$/.test(remote??''))throw new Error('Malformed push input.');
     if(zero.test(local)) {if(remoteRef==='refs/heads/main')throw new Error('Deleting main is prohibited.');continue;}
     if(!remoteRef.startsWith('refs/heads/'))throw new Error('Tag/non-branch pushes need a separately reviewed flow.');
     tips.push(local);
     if(remoteRef==='refs/heads/main'&&!zero.test(remote)){
      try{git(root,['merge-base','--is-ancestor',remote,local]);}catch{throw new Error('Non-fast-forward main push rejected; fetch/review instead of forcing history.');}
     }
     let range=local;if(!zero.test(remote)){try{git(root,['cat-file','-e',remote+'^{commit}']);range=remote+'..'+local;}catch{}}
     commits.push(...git(root,['rev-list',range]).toString().trim().split('\n').filter(Boolean));
    }
   }else{
    tips=git(root,['for-each-ref','--format=%(objectname)','refs/heads','refs/remotes','refs/tags']).toString().trim().split('\n').filter(Boolean);
    tips.push(git(root,['rev-parse','HEAD']).toString().trim());
    for(const tag of git(root,['for-each-ref','--format=%(objectname)','refs/tags']).toString().trim().split('\n').filter(Boolean))inspectTag(root,tag,policy);
    commits=git(root,['rev-list','--all','HEAD']).toString().trim().split('\n').filter(Boolean);
   }
   for(const tip of new Set(tips))inspectAncestry(root,tip,policy);
   for(const sha of new Set(commits)){inspectCommit(root,sha,policy);await inspectSnapshot(root,sha,policy);}
   // Scan complete reachable history too, so a bad intermediate commit cannot hide behind a clean tip.
   if(tips.length){const config=path.join(temp,'gitleaks.toml');await writeFile(config,await readFile(path.join(defaultRoot,'.gitleaks.toml')));runGitleaks(root,policy,['git','--log-opts='+[...new Set(tips)].join(' ')],config);}
  }else throw new Error('Usage: check-privacy.js staged | history | push <remote-name> <remote-url>');
  return `Privacy ${mode} checks passed (values redacted).`;
 }finally{await rm(temp,{recursive:true,force:true});}
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 try{let stdin='';if(process.argv[2]==='push')for await(const chunk of process.stdin)stdin+=chunk;console.log(await checkPrivacy(process.argv[2]??'history',{stdin,remoteUrl:process.argv[4]}));}
 catch(error){console.error(`Privacy check failed: ${safe(error.message)}`);process.exitCode=1;}
}
