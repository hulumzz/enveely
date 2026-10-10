import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {Readable} from 'node:stream';
import {pipeline} from 'node:stream/promises';
import net from 'node:net';
import {javaEnvironment} from './java-runtime.mjs';
const checksum='9b6498b7f62714d67f48f59b3818883cd682dbcd46b9f59511de81c97bb5166c';
const root=path.join(os.tmpdir(),'enveely-firestore-emulator');fs.mkdirSync(root,{recursive:true});
const cached=path.join(os.homedir(),'.cache/firebase/emulators/cloud-firestore-emulator-v1.22.0.jar');
const jar=fs.existsSync(cached)?cached:path.join(root,'cloud-firestore-emulator-v1.22.0.jar');
if(!fs.existsSync(jar)) {
 const response=await fetch('https://storage.googleapis.com/firebase-preview-drop/emulator/cloud-firestore-emulator-v1.22.0.jar',{signal:AbortSignal.timeout(180_000)});if(!response.ok)throw new Error(`Emulator download failed: ${response.status}`);
 await pipeline(Readable.fromWeb(response.body),fs.createWriteStream(jar));
}
const hash=createHash('sha256');for await(const chunk of fs.createReadStream(jar))hash.update(chunk);
if(hash.digest('hex')!==checksum) {if(jar!==cached)fs.unlinkSync(jar);throw new Error('Firestore emulator checksum mismatch.');}
const env=await javaEnvironment();
const available=()=>new Promise(resolve=>{const socket=net.createConnection({port:8089,host:'127.0.0.1'});socket.once('connect',()=>{socket.destroy();resolve(true);});socket.once('error',()=>{socket.destroy();resolve(false);});});
if(await available())throw new Error('Port 8089 is already in use. Stop the existing emulator before testing.');
const log=fs.openSync(path.join(root,'emulator.log'),'w');
const server=spawn('java',['-jar',jar,'--host','127.0.0.1','--port','8089','--project_id','demo-enveely','--database-edition','standard'],{env,stdio:['ignore',log,log]});
let code=1;
try {
 const deadline=Date.now()+60_000;let ready=false;
 while(Date.now()<deadline && server.exitCode===null){if(await available()){ready=true;break;}await new Promise(resolve=>setTimeout(resolve,300));}
 if(!ready)throw new Error(`Emulator failed to start. See ${path.join(root,'emulator.log')}`);
 const result=spawnSync(process.execPath,['tests/firestore-rules.test.mjs'],{stdio:'inherit',env,timeout:120_000});code=result.status || (result.status===0?0:1);
}finally {
 server.kill('SIGTERM');await new Promise(resolve=>{const timer=setTimeout(()=>{server.kill('SIGKILL');resolve();},3000);server.once('exit',()=>{clearTimeout(timer);resolve();});});fs.closeSync(log);
}
process.exitCode=code;
