import {json,firebaseServiceAccessToken} from '../../_lib/firebase-admin.js';
import {maintenance} from '../../_lib/maintenance.js';
import {policy} from '../../_lib/deployment-policy.js';

async function authorized(request,env) {
 const expected=String(env.MAINTENANCE_SECRET || ''),received=(request.headers.get('authorization')||'').replace(/^Bearer /,'');
 if(expected.length<32 || !received)return false;
 const digest=async text=>new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text)));
 const [a,b]=await Promise.all([digest(expected),digest(received)]);let difference=0;for(let i=0;i<a.length;i++)difference|=a[i]^b[i];return difference===0;
}
export async function onRequestPost({request,env}) {
 if(!await authorized(request,env))return json({message:'Unauthorized'},401);
 try {
  const action=new URL(request.url).searchParams.get('action');
  if(!action)return json(await maintenance(env));
  if(!['install-policy','verify-policy','install-backup','verify-backup'].includes(action))return json({message:'Unknown action'},400);
  const token=await firebaseServiceAccessToken(env,'https://www.googleapis.com/auth/cloud-platform');
  if(!token)throw new Error('Service account unavailable');
  const project=`projects/${env.FIREBASE_PROJECT_ID}`;
  const call=async(url,method='GET',body)=>{const response=await fetch(url,{method,headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:body?JSON.stringify(body):undefined,signal:AbortSignal.timeout(15_000)});const data=await response.json();if(!response.ok)throw new Error(`Policy API ${response.status}: ${String(data.error?.message||'Failed').slice(0,250)}`);return data;};
  if(action==='install-backup' || action==='verify-backup') {
    const url=`https://firestore.googleapis.com/v1/${project}/databases/(default)/backupSchedules`;
    const existing=await call(url);
    if(action==='install-backup' && !existing.backupSchedules?.some(schedule=>schedule.dailyRecurrence))await call(url,'POST',{retention:'604800s',dailyRecurrence:{}});
    const verified=await call(url);return json({backupSchedules:(verified.backupSchedules||[]).map(({name,retention,dailyRecurrence,weeklyRecurrence})=>({name,retention,dailyRecurrence,weeklyRecurrence}))});
  }
  const releaseUrl=`https://firebaserules.googleapis.com/v1/${project}/releases/cloud.firestore`;
  let release=await call(releaseUrl);
  const current=await call(`https://firebaserules.googleapis.com/v1/${release.rulesetName}`);
  const matches=current.source?.files?.some(file=>file.name==='firestore.rules' && file.content===policy.rules);
  if(action==='install-policy' && !matches) {
   const ruleset=await call(`https://firebaserules.googleapis.com/v1/${project}/rulesets`,'POST',{source:{files:[{name:'firestore.rules',content:policy.rules}]}});
   release=await call(releaseUrl,'PATCH',{release:{name:`${project}/releases/cloud.firestore`,rulesetName:ruleset.name},updateMask:'rulesetName'});
  }
  const indexes=[];
  for(const index of policy.indexes.indexes) {
   const url=`https://firestore.googleapis.com/v1/${project}/databases/(default)/collectionGroups/${index.collectionGroup}/indexes`;
   const existing=await call(url);
   const equivalent=row=>row.queryScope===index.queryScope && JSON.stringify(row.fields.filter(field=>field.fieldPath!=='__name__'))===JSON.stringify(index.fields);
   const found=existing.indexes?.find(equivalent);
   if(!found && action==='install-policy')await call(url,'POST',{queryScope:index.queryScope,fields:index.fields});
   indexes.push({collection:index.collectionGroup,state:found?.state || (action==='install-policy'?'CREATING':'MISSING')});
  }
  return json({hash:policy.hash,rulesetName:release.rulesetName,matches:matches || action==='install-policy',indexes});
 }catch(error){console.error(JSON.stringify({event:'maintenance_error',message:error.message}));return json({message:error.message},502);}
}
