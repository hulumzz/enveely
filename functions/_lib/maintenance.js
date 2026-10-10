import {adminDocument,decodeFields} from './firebase-admin.js';
import {reconcileActivations} from './activation.js';
import {deleteInvitation} from './delete-invitation.js';
export async function maintenance(env) {
 const db=env.PAYMENTS_DB,token=crypto.randomUUID(),now=Date.now();
 const lock=await db.prepare("INSERT INTO maintenance_locks(name,token,expires_at) VALUES('maintenance',?,?) ON CONFLICT(name) DO UPDATE SET token=excluded.token,expires_at=excluded.expires_at WHERE expires_at<?").bind(token,now+300000,now).run();
 if(!lock.meta.changes)return {busy:true};
 try {
  const activation=await reconcileActivations(env);let mediaRemoved=0,proofsRemoved=0;
  const deletion=await db.prepare('SELECT id,uid FROM deletion_jobs ORDER BY created_at LIMIT 1').first();
  if(deletion){const result=await deleteInvitation(env,deletion.id,deletion.uid);return {...activation,deletionCompleted:result.deleted};}
  const inventory=await db.prepare("SELECT value FROM maintenance_state WHERE name='media-cursor'").first();
  const legacy=await env.INVITATION_MEDIA.list({limit:5,include:['customMetadata'],cursor:inventory?.value || undefined});
  for(const object of legacy.objects){const metadata=object.customMetadata||{};if(metadata.uid && metadata.invitationId)await db.prepare('INSERT OR IGNORE INTO media_assets(key,uid,invitation_id,bytes,created_at) VALUES(?,?,?,?,?)').bind(object.key,metadata.uid,metadata.invitationId,object.size,object.uploaded.toISOString()).run();}
  await db.prepare("INSERT INTO maintenance_state(name,value) VALUES('media-cursor',?) ON CONFLICT(name) DO UPDATE SET value=excluded.value").bind(legacy.truncated?legacy.cursor:'').run();
  const assets=await db.prepare('SELECT * FROM media_assets WHERE created_at<? ORDER BY created_at LIMIT 3').bind(new Date(now-7*86400000).toISOString()).all();
  for(const asset of assets.results) {
   const document=await adminDocument(env,`invitations/${asset.invitation_id}`);
   if(document?.fields?.status?.stringValue==='deleting') {await deleteInvitation(env,asset.invitation_id,asset.uid);continue;}
   if(JSON.stringify(document?.fields || {}).includes(`/media/${asset.key}`))continue;
   await env.INVITATION_MEDIA.delete(asset.key);await db.prepare('DELETE FROM media_assets WHERE key=?').bind(asset.key).run();mediaRemoved++;
  }
  const proofs=await db.prepare("SELECT id,proof_key FROM payment_orders WHERE proof_key<>'' AND status IN ('active','rejected','refunded') AND updated_at<? LIMIT 3").bind(new Date(now-180*86400000).toISOString()).all();
  for(const proof of proofs.results) {await env.PAYMENT_PROOFS.delete(proof.proof_key);await db.prepare("UPDATE payment_orders SET proof_key='' WHERE id=? AND proof_key=?").bind(proof.id,proof.proof_key).run();proofsRemoved++;}
  await db.prepare('DELETE FROM request_limits WHERE window_start<?').bind(Math.floor(now/1000)-7*86400).run();
  console.log(JSON.stringify({event:'maintenance_complete',...activation,mediaRemoved,proofsRemoved}));
  return {...activation,mediaRemoved,proofsRemoved};
 }finally{await db.prepare("DELETE FROM maintenance_locks WHERE name='maintenance' AND token=?").bind(token).run();}
}
