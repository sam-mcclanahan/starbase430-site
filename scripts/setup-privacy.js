import {readFile,mkdir,mkdtemp,rm,chmod,copyFile,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=fileURLToPath(new URL('../',import.meta.url));
const policy=JSON.parse(await readFile(path.join(root,'privacy-policy.json'),'utf8'));
const platform=process.platform==='darwin'?'darwin':process.platform==='linux'?'linux':null;
const arch=process.arch==='x64'?'x64':process.arch==='arm64'?'arm64':null;
const asset=policy.gitleaks.assets[`${platform}_${arch}`];
if(!asset)throw new Error('Unsupported privacy-tool platform. A pinned supported Gitleaks binary is required.');
const bin=path.join(root,'.cache/privacy-tools/gitleaks');await mkdir(path.dirname(bin),{recursive:true});
const temp=await mkdtemp(path.join(tmpdir(),'starbase-privacy-install-'));
try{
 const archive=path.join(temp,'gitleaks.tar.gz');
 execFileSync('curl',['--fail','--location','--silent','--show-error',`https://github.com/gitleaks/gitleaks/releases/download/v${policy.gitleaks.version}/gitleaks_${policy.gitleaks.version}_${platform}_${arch}.tar.gz`,'--output',archive],{stdio:'pipe'});
 const digest=createHash('sha256').update(await readFile(archive)).digest('hex');
 if(digest!==asset)throw new Error('Gitleaks release checksum mismatch; installation stopped.');
 // Extract only the reviewed binary, not arbitrary archive paths.
 execFileSync('tar',['-xzf',archive,'-C',temp,'gitleaks'],{stdio:'pipe'});
 await copyFile(path.join(temp,'gitleaks'),bin);await chmod(bin,0o755);
 const version=execFileSync(bin,['version'],{encoding:'utf8'}).trim();
 if(version!==policy.gitleaks.version)throw new Error('Unexpected Gitleaks version.');
 if(!process.argv.includes('--no-hooks')){
  let prior='';try{prior=execFileSync('git',['config','--local','--get','core.hooksPath'],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','ignore']}).trim();}catch{}
  if(prior&&prior!=='.githooks')throw new Error('An existing hooksPath is configured; integrate hooks explicitly instead of replacing it.');
  for(const name of ['pre-commit','pre-push'])await chmod(path.join(root,'.githooks',name),0o755);
  for(const args of [['core.hooksPath','.githooks'],['starbase.nodePath',process.execPath],['user.name',policy.owner.name],['user.email',policy.owner.email],['user.useConfigOnly','true']])execFileSync('git',['config','--local',...args],{cwd:root});
 }
 console.log(`Installed checksum-verified Gitleaks ${version}${process.argv.includes('--no-hooks')?'':'; local privacy hooks and approved identity configured'}.`);
}finally{await rm(temp,{recursive:true,force:true});}
