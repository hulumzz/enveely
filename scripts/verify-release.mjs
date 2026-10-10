import {spawnSync} from 'node:child_process';
import {javaEnvironment} from './java-runtime.mjs';
const env=await javaEnvironment();
for(const script of ['test','test:rules','build','test:functions']) {
 const result=spawnSync('npm',['run',script],{stdio:'inherit',env,timeout:600_000});if(result.status!==0)process.exit(result.status || 1);
}
const audit=spawnSync('npm',['audit','--omit=dev','--audit-level=high'],{stdio:'inherit',env,timeout:120_000});if(audit.status!==0)process.exit(audit.status || 1);
console.log('PASS: all production release checks.');
