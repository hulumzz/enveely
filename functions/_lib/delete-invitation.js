import {adminDocument,adminCommit,firebaseServiceAccessToken,firestoreRoot} from './firebase-admin.js';
export async function deleteInvitation(env,id,uid) {
 const token=await firebaseServiceAccessToken(env),root=firestoreRoot(env).split('/v1/')[1];
 const document=await adminDocument(env,`invitations/${id}`,token);
 if(!document){await env.PAYMENTS_DB.prepare('DELETE FROM deletion_jobs WHERE id=? AND uid=?').bind(id,uid).run();return {deleted:true};}
 if(document.fields?.ownerUid?.stringValue!==uid)throw new Error('ownership');
 await env.PAYMENTS_DB.prepare('INSERT INTO deletion_jobs(id,uid,created_at) VALUES(?,?,?) ON CONFLICT(id) DO NOTHING').bind(id,uid,new Date().toISOString()).run();
 // Stop public reads and guest writes BEFORE deleting child collections.
 await adminCommit(env,[{update:{name:`${root}/invitations/${id}`,fields:{status:{stringValue:'deleting'}}},updateMask:{fieldPaths:['status']}}],token);
 let removed=0;
 for(const collection of ['rsvps','wishes']) {
  for(let page=0;page<3;page++) {
   const response=await fetch(`${firestoreRoot(env)}/invitations/${id}/${collection}?pageSize=100`,{headers:{authorization:`Bearer ${token}`},signal:AbortSignal.timeout(12_000)});
   if(!response.ok)throw new Error(`delete ${response.status}`);
   const docs=(await response.json()).documents||[];if(!docs.length)break;
   await adminCommit(env,docs.map(doc=>({delete:doc.name})),token);removed+=docs.length;
   if(page===2)return {deleted:false,guestResponsesRemoved:removed};
  }
 }
 const assets=await env.PAYMENTS_DB.prepare('SELECT key FROM media_assets WHERE invitation_id=? AND uid=?').bind(id,uid).all();
 if(assets.results.length){await env.INVITATION_MEDIA.delete(assets.results.map(asset=>asset.key));await env.PAYMENTS_DB.prepare('DELETE FROM media_assets WHERE invitation_id=? AND uid=?').bind(id,uid).run();}
 const job=await env.PAYMENTS_DB.prepare('SELECT r2_cursor FROM deletion_jobs WHERE id=?').bind(id).first();
 const page=await env.INVITATION_MEDIA.list({limit:1000,include:['customMetadata'],cursor:job?.r2_cursor || undefined});
 const legacy=page.objects.filter(object=>object.customMetadata?.uid===uid && object.customMetadata.invitationId===id).map(object=>object.key);
 if(legacy.length)await env.INVITATION_MEDIA.delete(legacy);
 if(page.truncated){await env.PAYMENTS_DB.prepare('UPDATE deletion_jobs SET r2_cursor=? WHERE id=?').bind(page.cursor,id).run();return {deleted:false,guestResponsesRemoved:removed};}

 await adminCommit(env,['invitations','invitationControl','entitlements'].map(collection=>({delete:`${root}/${collection}/${id}`})),token);
 await env.PAYMENTS_DB.prepare("UPDATE payment_orders SET status='rejected',ai_summary='Undangan dihapus. Hubungi bantuan untuk transaksi ini.',updated_at=? WHERE invitation_id=? AND status IN ('draft','pending_review','ai_match','activation_pending')").bind(new Date().toISOString(),id).run();
 await env.PAYMENTS_DB.prepare('DELETE FROM activation_locks WHERE invitation_id=?').bind(id).run();
 await env.PAYMENTS_DB.prepare('DELETE FROM deletion_jobs WHERE id=?').bind(id).run();
 // activationLedger deliberately survives deletion to prevent resetting trial time.
 return {deleted:true,guestResponsesRemoved:removed};
}
