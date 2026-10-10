import {json,requireFirebaseUser,isPaymentAdmin} from '../../_lib/firebase-admin.js';
import {boundedJson} from '../../_lib/body.js';
import {validReview,privateReview} from '../../_lib/reviews.js';
export async function onRequestGet({request,env}){try{const user=await requireFirebaseUser(request,env);if(!isPaymentAdmin(user,env))return json({message:'Akses admin diperlukan.'},403);const url=new URL(request.url),cursor=url.searchParams.get('cursor')||'',status=url.searchParams.get('status')||'all';if(!['all','pending','approved','hidden'].includes(status) || cursor.length>120)return json({message:'Filter tidak valid.'},400);const result=await env.PAYMENTS_DB.prepare("SELECT * FROM customer_reviews WHERE (?='all' OR status=?) AND (?='' OR updated_at || id < ?) ORDER BY updated_at DESC,id DESC LIMIT 31").bind(status,status,cursor,cursor).all();const rows=result.results;return json({reviews:rows.slice(0,30).map(privateReview),cursor:rows.length>30?rows[29].updated_at+rows[29].id:null});}catch{return json({message:'Ulasan belum dapat dimuat.'},503);}}
export async function onRequestPost({request,env}) {
 try{const user=await requireFirebaseUser(request,env);if(!isPaymentAdmin(user,env))return json({message:'Akses admin diperlukan.'},403);let body;try{body=await boundedJson(request,8192);}catch{return json({message:'Request tidak valid.'},400);}if(!body || typeof body!=='object' || Array.isArray(body))return json({message:'Request tidak valid.'},400);const now=new Date().toISOString();
 if(body.action==='add') {
  if(!validReview(body) || body.authentic!==true)return json({message:'Gunakan ulasan asli dengan izin pemiliknya.'},400);
  await env.PAYMENTS_DB.prepare("INSERT INTO customer_reviews(id,display_name,rating,message,public_consent,status,source,created_at,updated_at,reviewed_by,reviewed_at) VALUES(?,?,?,?,1,'approved','external',?,?,?,?)").bind(crypto.randomUUID(),body.displayName.trim(),body.rating,body.message.trim(),now,now,user.localId,now).run();return json({saved:true});
 }
 if(!['approve','hide'].includes(body.action) || typeof body.id!=='string' || body.id.length>80 || typeof body.updatedAt!=='string')return json({message:'Keputusan tidak valid.'},400);
 const result=await env.PAYMENTS_DB.prepare("UPDATE customer_reviews SET status=?,reviewed_by=?,reviewed_at=?,updated_at=? WHERE id=? AND updated_at=? AND public_consent=1").bind(body.action==='approve'?'approved':'hidden',user.localId,now,now,body.id,body.updatedAt).run();if(!result.meta.changes)return json({message:'Ulasan berubah. Segarkan sebelum memutuskan.'},409);return json({saved:true});
 }catch{return json({message:'Ulasan belum dapat diperbarui.'},503);}
}
