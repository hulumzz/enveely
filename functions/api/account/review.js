import {json,requireFirebaseUser,getOwnedInvitation} from '../../_lib/firebase-admin.js';
import {boundedJson} from '../../_lib/body.js';
import {consumeQuota} from '../../_lib/request-limit.js';
import {validReview,privateReview} from '../../_lib/reviews.js';
export async function onRequestGet({request,env}) {
 try{const user=await requireFirebaseUser(request,env);if(!user)return json({message:'Silakan masuk.'},401);const row=await env.PAYMENTS_DB.prepare('SELECT * FROM customer_reviews WHERE uid=?').bind(user.localId).first();return json({review:row?privateReview(row):null});}
 catch{return json({message:'Ulasan belum dapat dimuat.'},503);}
}
export async function onRequestPost({request,env}) {
 try{const user=await requireFirebaseUser(request,env);if(!user)return json({message:'Silakan masuk.'},401);if(!user.emailVerified)return json({message:'Verifikasi email sebelum mengirim ulasan.'},403);
 let body;try{body=await boundedJson(request,8192);}catch{return json({message:'Request tidak valid.'},400);}if(!validReview(body) || !/^[A-Za-z0-9_-]{8,80}$/.test(body.invitationId || ''))return json({message:'Lengkapi ulasan dan persetujuan tampil publik.'},400);
 const fields=await getOwnedInvitation(request,env,body.invitationId,user);if(fields?.status?.stringValue!=='published')return json({message:'Ulasan tersedia setelah undanganmu dipublikasikan.'},403);
 if(!await consumeQuota(env,user.localId,'customer-review',5,86400))return json({message:'Coba lagi besok untuk memperbarui ulasan.'},429);
 const now=new Date().toISOString();await env.PAYMENTS_DB.prepare(`INSERT INTO customer_reviews(id,uid,invitation_id,display_name,rating,message,public_consent,status,created_at,updated_at) VALUES(?,?,?,?,?,?,1,'pending',?,?) ON CONFLICT(uid) DO UPDATE SET invitation_id=excluded.invitation_id,display_name=excluded.display_name,rating=excluded.rating,message=excluded.message,public_consent=1,status='pending',updated_at=excluded.updated_at,reviewed_by=NULL,reviewed_at=NULL`).bind(crypto.randomUUID(),user.localId,body.invitationId,body.displayName.trim(),body.rating,body.message.trim(),now,now).run();return json({status:'pending'});
 }catch{return json({message:'Ulasan belum dapat disimpan. Coba kembali.'},503);}
}
export async function onRequestDelete({request,env}){try{const user=await requireFirebaseUser(request,env);if(!user)return json({message:'Silakan masuk.'},401);await env.PAYMENTS_DB.prepare('DELETE FROM customer_reviews WHERE uid=?').bind(user.localId).run();return json({deleted:true});}catch{return json({message:'Ulasan belum dapat dihapus.'},503);}}
