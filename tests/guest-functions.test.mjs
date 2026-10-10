import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import {generateKeyPairSync} from 'node:crypto';
import fs from 'node:fs';
import {onRequestPost as guest} from '../functions/api/guests/[id].js';
import {onRequest as middleware} from '../functions/_middleware.js';
const db=new DatabaseSync(':memory:');for(const file of fs.readdirSync('migrations').sort())db.exec(fs.readFileSync(`migrations/${file}`,'utf8'));
const D1={prepare(sql){let args=[];return{bind(...values){args=values;return this;},async run(){return{meta:{changes:Number(db.prepare(sql).run(...args).changes)}};},async first(){return db.prepare(sql).get(...args)||null;}};}};
const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const env={PAYMENTS_DB:D1,TURNSTILE_SECRET_KEY:'test',FIREBASE_PROJECT_ID:'demo-enveely',FIREBASE_SERVICE_ACCOUNT_EMAIL:'test@demo-enveely.iam.gserviceaccount.com',FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY:privateKey.export({type:'pkcs8',format:'pem'})};
let successful=true,expired=false,commits=[],existing=false;
const original=globalThis.fetch;
globalThis.fetch=async(url,options={})=>{
 if(String(url).includes('siteverify'))return Response.json({success:successful,hostname:'enveely.pages.dev',action:'rsvp'});
 if(String(url).includes('oauth2.googleapis.com'))return Response.json({access_token:'test'});
 if(String(url).endsWith('documents:commit')){commits.push(JSON.parse(options.body));existing=true;return Response.json({});}
 if(String(url).includes('/rsvps/'))return existing?Response.json({fields:{}}):Response.json({},{status:404});
 if(String(url).includes('/entitlements/'))return Response.json({},{status:404});
 if(String(url).includes('/invitations/'))return Response.json({updateTime:new Date().toISOString(),fields:{status:{stringValue:'published'},ownerUid:{stringValue:'owner'},design:{mapValue:{fields:{templateId:{stringValue:'serena'},variantId:{stringValue:'serena-paper'}}}},freeActivatedAt:{timestampValue:new Date(Date.now()-(expired?8:1)*86400000).toISOString()},content:{mapValue:{fields:{rsvpSettings:{mapValue:{fields:{enabled:{booleanValue:true},maxGuestCount:{integerValue:'5'}}}}}}}}});
 throw new Error(`Unexpected request ${url}`);
};
const request=(data={})=>new Request('https://enveely.pages.dev/api/guests/inv_test_12345678',{method:'POST',headers:{'content-type':'application/json','CF-Connecting-IP':'203.0.113.1'},body:JSON.stringify({kind:'rsvp',requestId:'12345678-1234-1234-1234-123456789012',token:'test',data:{name:'Tamu',attendance:'attending',guestCount:2,...data}})});
try {
 successful=false;assert.equal((await guest({request:request(),env,params:{id:'inv_test_12345678'}})).status,403);assert.equal(commits.length,0);
 successful=true;assert.equal((await guest({request:request({guestCount:6}),env,params:{id:'inv_test_12345678'}})).status,400);
 assert.equal((await guest({request:request(),env,params:{id:'inv_test_12345678'}})).status,200);assert.equal(commits.length,1);assert.equal(commits[0].writes[1].currentDocument.exists,false);
 assert.equal((await guest({request:request(),env,params:{id:'inv_test_12345678'}})).status,200);assert.equal(commits.length,1);
 expired=true;assert.equal((await guest({request:request(),env,params:{id:'inv_test_12345678'}})).status,410);
 const response=await middleware({request:new Request('https://test.invalid/api/test'),next:async()=>Response.json({ok:true})});assert.match(response.headers.get('content-security-policy'),/object-src 'none'/);assert.equal(response.headers.get('cache-control'),'no-store');
 console.log('PASS: Turnstile failure closed, RSVP maximum, idempotent commit, expiry, Function CSP and cache policy.');
}finally{globalThis.fetch=original;db.close();}
