import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {Readable,Transform} from 'node:stream';
import {pipeline} from 'node:stream/promises';
export async function javaEnvironment(){
const env={...process.env};
function javaVersion(){const result=spawnSync('java',['-version'],{encoding:'utf8',env});return Number((result.stderr||'').match(/version "(\d+)/)?.[1]||0);}
if(javaVersion()<21){
 if(process.platform!=='linux' || process.arch!=='x64')throw new Error('Java 21 required; install it for this platform.');
 const root=path.join(os.tmpdir(),'enveely-release-java'),javaRoot=path.join(root,'jdk-21.0.12.1+1-jre');
 if(!fs.existsSync(path.join(javaRoot,'bin/java'))){
  fs.mkdirSync(root,{recursive:true});const archive=path.join(root,'jre.tar.gz');
  const response=await fetch('https://github.com/adoptium/temurin21-binaries/releases/download/jdk-21.0.12.1%2B1/OpenJDK21U-jre_x64_linux_hotspot_21.0.12.1_1.tar.gz',{signal:AbortSignal.timeout(180_000)});
  if(!response.ok)throw new Error(`JRE download failed: ${response.status}`);
  const hash=createHash('sha256');
  await pipeline(Readable.fromWeb(response.body),new Transform({transform(chunk,encoding,callback){hash.update(chunk);callback(null,chunk);}}),fs.createWriteStream(archive));
  if(hash.digest('hex')!=='2413149700df0f7d440500a84a8f764c535f21e5a5e87d38328b64eec2c5b500'){fs.unlinkSync(archive);throw new Error('JRE checksum mismatch.');}
  const extracted=spawnSync('tar',['-xzf',archive,'-C',root],{stdio:'inherit'});if(extracted.status!==0)throw new Error('JRE extraction failed.');fs.unlinkSync(archive);
 }
 env.JAVA_HOME=javaRoot;env.PATH=path.join(javaRoot,'bin')+path.delimiter+env.PATH;
 if(javaVersion()<21)throw new Error('Java 21 initialization failed.');
}
return env;
}
