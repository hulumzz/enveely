import assert from 'node:assert/strict';
import {DatabaseSync} from 'node:sqlite';
import fs from 'node:fs';
import {generateKeyPairSync} from 'node:crypto';
import {onRequestPost as checkout,onRequestGet as list} from '../functions/api/payments/index.js';
import {onRequestPost as verify} from '../functions/api/payments/verify.js';
import {onRequestPost as review} from '../functions/api/admin/payments/[id]/review.js';
import {reconcileActivations} from '../functions/_lib/activation.js';
import {calculatePackage} from '../src/data/plans.js';
const db=new DatabaseSync(':memory:');for(const file of fs.readdirSync('migrations').sort())db.exec(fs.readFileSync(`migrations/${file}`,'utf8'));
let failFinalize=false;
const D1={prepare(sql){let values=[];return {bind(...params){values=params;return this;},async first(){return db.prepare(sql).get(...values)||null;},async all(){return {results:db.prepare(sql).all(...values)};},async run(){if(failFinalize && sql.includes("SET status='active'")){failFinalize=false;throw new Error('D1 interrupted');}const result=db.prepare(sql).run(...values);return {meta:{changes:Number(result.changes)}};}};}};
let user={localId:'owner',email:'owner@example.invalid',emailVerified:true},variant='mayura-pearl',entitlement=null,patches=0,failFirestore=false;
const originalFetch=globalThis.fetch,objects=new Map(),background=[];
globalThis.fetch=async(url,options={})=>{
 if(String(url).includes('accounts:lookup'))return Response.json({users:[user]});
 if(String(url).includes('/documents/invitations/'))return Response.json({updateTime:new Date().toISOString(),fields:{ownerUid:{stringValue:'owner'},design:{mapValue:{fields:{templateId:{stringValue:variant.split('-')[0]},variantId:{stringValue:variant}}}}}});
 if(String(url).includes('oauth2.googleapis.com'))return Response.json({access_token:'test-access'});
 if(String(url).endsWith('documents:commit')){if(failFirestore)return Response.json({},{status:503});entitlement={fields:JSON.parse(options.body).writes[1].update.fields,updateTime:new Date().toISOString()};patches++;return Response.json({});}
 if(String(url).includes('/documents/entitlements/')){
  if(options.method==='PATCH'){if(failFirestore)return Response.json({},{status:503});entitlement={...JSON.parse(options.body),updateTime:new Date().toISOString()};patches++;return Response.json(entitlement);}
  return entitlement?Response.json(entitlement):Response.json({},{status:404});
 }
 throw new Error(`Unexpected request ${url}`);
};
const {privateKey}=generateKeyPairSync('rsa',{modulusLength:2048});
const env={PAYMENTS_DB:D1,PAYMENT_PROOFS:{async put(k,v){objects.set(k,v)},async delete(k){objects.delete(k)}},FIREBASE_WEB_API_KEY:'test',FIREBASE_PROJECT_ID:'demo-enveely',ADMIN_EMAILS:'admin@example.invalid',FIREBASE_SERVICE_ACCOUNT_EMAIL:'test@demo-enveely.iam.gserviceaccount.com',FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY:privateKey.export({type:'pkcs8',format:'pem'}),AI:{async run(){return {response:JSON.stringify({amount:calculatePackage(variant,3).subtotal+111,paymentSuccessful:true,confidence:.95})};}}};
const auth={authorization:'Bearer test','content-type':'application/json'},id='inv_test_12345678';
const jsonRequest=payload=>new Request('https://test.invalid/api/payments',{method:'POST',headers:auth,body:JSON.stringify(payload)});
const create=async months=>{const response=await checkout({request:jsonRequest({invitationId:id,durationMonths:months}),env});assert.equal(response.status,200);return (await response.json()).order;};
const proofRequest=order=>{const body=new FormData();for(const key of ['invitationId','variantId','durationMonths','uniqueCode'])body.set(key,String(order[key]));body.set('orderId',order.id);body.set('proof',new File([new Uint8Array([255,216,255,order.durationMonths])],'test.jpg',{type:'image/jpeg'}));return new Request('https://test.invalid/api/payments/verify',{method:'POST',headers:{authorization:'Bearer test'},body});};
const submit=async order=>{const response=await verify({request:proofRequest(order),env,waitUntil(promise){background.push(promise);}});await Promise.all(background.splice(0));return response;};
const admin=()=>{user={localId:'admin',email:'admin@example.invalid',emailVerified:true};};const owner=()=>{user={localId:'owner',email:'owner@example.invalid',emailVerified:true};};
const approve=(order,reference)=>review({request:jsonRequest({decision:'approve',transactionReference:reference}),params:{id:order.id},env});
try {
 assert.equal((await checkout({request:new Request('https://test.invalid',{method:'POST'}),env})).status,401);
 user.emailVerified=false;assert.equal((await checkout({request:jsonRequest({invitationId:id}),env})).status,403);owner();
 const first=await create(6);assert.equal(first.durationMonths,6);
 assert.equal((await create(3)).id,first.id);const order=await create(6);assert.equal(order.durationMonths,6);
 assert.equal(db.prepare('SELECT COUNT(*) AS n FROM payment_orders').get().n,1);
 assert.equal((await submit(order)).status,200);assert.equal(objects.size,1);
 assert.equal((await submit(order)).status,409);
 admin();assert.equal((await approve(order,'')).status,400);assert.equal(db.prepare('SELECT review_token FROM payment_orders').get().review_token,null);
 failFinalize=true;assert.equal((await approve(order,'MERCHANT-0001')).status,502);
 const pending=db.prepare('SELECT * FROM payment_orders').get();assert.equal(pending.status,'activation_pending');assert.equal(entitlement.fields.active.booleanValue,true);
 const originalExpiry=pending.expires_at;assert.equal(patches,1);
 const result=await reconcileActivations(env);assert.equal(result.completed,1);assert.equal(patches,1);assert.equal(db.prepare('SELECT expires_at FROM payment_orders').get().expires_at,originalExpiry);
 assert.equal(db.prepare('SELECT COUNT(*) AS n FROM activation_locks').get().n,0);
 assert.equal((await approve(order,'MERCHANT-0001')).status,200);assert.equal(patches,1);
 owner();assert.equal((await create(3)).id,order.id); // active entitlement reused before another QR
 db.prepare("UPDATE payment_orders SET expires_at=? WHERE id=?").run(new Date(Date.now()-86400000).toISOString(),order.id);entitlement=null;
 const renewal=await create(3);assert.notEqual(renewal.id,order.id);assert.equal((await submit(renewal)).status,200);
 admin();assert.equal((await approve(renewal,'MERCHANT-0001')).status,409);assert.equal((await approve(renewal,'MERCHANT-0002')).status,200);
 const renewed=db.prepare('SELECT expires_at FROM payment_orders WHERE id=?').get(renewal.id);assert.ok(Date.parse(renewed.expires_at)>Date.now()+90*86400000);
 // A legacy second pending order must extend the current expiry, never shorten it.
 const third={...renewal,id:'pay_legacy_12345'};db.prepare("INSERT INTO payment_orders(id,uid,invitation_id,variant_id,duration_months,base_price,extension_fee,unique_code,expected_total,status,proof_key,created_at,updated_at) VALUES(?,?,?,?,?,?,?,?,?,'pending_review','',?,?)").run(third.id,'owner',id,variant,3,185000,0,111,185111,new Date().toISOString(),new Date().toISOString());
 failFirestore=true;assert.equal((await approve(third,'MERCHANT-0003')).status,502);const extension=db.prepare('SELECT * FROM payment_orders WHERE id=?').get(third.id);assert.ok(Date.parse(extension.expires_at)>=Date.parse(renewed.expires_at)+92*86400000);
 failFirestore=false;assert.equal((await approve(third,'MERCHANT-0003')).status,200);assert.equal(db.prepare('SELECT expires_at FROM payment_orders WHERE id=?').get(third.id).expires_at,extension.expires_at);
 owner();const history=await list({request:new Request('https://test.invalid',{headers:auth}),env});assert.equal((await history.json()).orders.length,3);
 user.localId='other';const other=await list({request:new Request('https://test.invalid',{headers:auth}),env});assert.equal((await other.json()).orders.length,0);
 console.log('PASS: durable checkout, verified email, ownership, proof persistence, duplicate submission/reference, D1 interruption recovery, idempotent activation, renewal, cumulative expiry, Firestore outage recovery, private history.');
}finally{globalThis.fetch=originalFetch;db.close();}
