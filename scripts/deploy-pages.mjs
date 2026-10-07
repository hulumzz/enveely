import {spawnSync} from 'node:child_process';
const env={...process.env,CLOUDFLARE_ACCOUNT_ID:'fa9e4b5cc90250f132b17fb7c067490b'};
const cli='node_modules/wrangler/bin/wrangler.js';
for(const args of [['node_modules/vite/bin/vite.js','build'],[cli,'pages','deploy','dist','--project-name','enveely','--branch','main']]) {
  const result=spawnSync(process.execPath,args,{env,stdio:'inherit'});
  if(result.status!==0)process.exit(result.status || 1);
}
