import {isPaymentAdmin,json,requireFirebaseUser,adminDocument} from '../../../../_lib/firebase-admin.js';
import {completeActivation} from '../../../../_lib/activation.js';
export async function onRequestPost(context) {
  const db=context.env.PAYMENTS_DB, requestId=crypto.randomUUID(); let claimed;
  try {
    const admin=await requireFirebaseUser(context.request,context.env);
    if(!isPaymentAdmin(admin,context.env)) return json({message:'Akses admin diperlukan.'},403);
    if(!db) return json({message:'Database pembayaran belum tersedia.'},503);
    const id=String(context.params.id||'');
    if(!/^[A-Za-z0-9_-]{8,80}$/.test(id))return json({message:'ID pesanan tidak valid.'},400);
    const payload=await context.request.json();
    if(!['approve','reject'].includes(payload.decision))return json({message:'Keputusan tidak valid.'},400);
    let order=await db.prepare('SELECT * FROM payment_orders WHERE id=?').bind(id).first();
    if(!order)return json({message:'Pesanan tidak ditemukan.'},404);
    if(order.status==='active')return json({status:'active',expiresAt:order.expires_at});
    if(order.status==='activation_pending') {
      if(payload.decision!=='approve')return json({message:'Aktivasi telah dimulai dan harus diselesaikan.'},409);
      await completeActivation(context.env,order);return json({status:'active',expiresAt:order.expires_at});
    }
    if(!['pending_review','ai_match'].includes(order.status))return json({message:'Pesanan tidak menunggu review.'},409);
    const now=new Date().toISOString();
    const lock=await db.prepare("UPDATE payment_orders SET review_token=?,review_started_at=? WHERE id=? AND status IN ('pending_review','ai_match') AND (review_token IS NULL OR review_started_at<?)").bind(requestId,now,id,new Date(Date.now()-300_000).toISOString()).run();
    if(!lock.meta.changes)return json({message:'Pesanan sedang ditinjau reviewer lain.'},409);
    claimed=id;
    if(payload.decision==='reject') {
      const changed=await db.prepare("UPDATE payment_orders SET status='rejected',reviewed_by=?,reviewed_at=?,updated_at=?,review_token=NULL,review_started_at=NULL WHERE id=? AND review_token=?").bind(admin.email,now,now,id,requestId).run();
      if(!changed.meta.changes)throw new Error('Review lock berubah.');
      return json({status:'rejected'});
    }
    const reference=String(payload.transactionReference || '').trim().toUpperCase();
    if(!/^[A-Z0-9 ._:/-]{6,100}$/.test(reference))return json({message:'Isi referensi transaksi yang sudah dicocokkan di catatan merchant.'},400);
    const duplicate=await db.prepare('SELECT id FROM payment_orders WHERE transaction_ref=? AND id<>?').bind(reference,id).first();
    if(duplicate)return json({message:'Referensi transaksi sudah digunakan oleh pesanan lain.'},409);
    const invitationLock=await db.prepare('INSERT INTO activation_locks(invitation_id,order_id,created_at) VALUES(?,?,?) ON CONFLICT(invitation_id) DO NOTHING').bind(order.invitation_id,id,now).run();
    if(!invitationLock.meta.changes) return json({message:'Undangan ini sedang diaktifkan oleh pesanan lain.'},409);
    try {
      const entitlement=await adminDocument(context.env,`entitlements/${order.invitation_id}`);
      const prior=await db.prepare("SELECT MAX(expires_at) AS expiry FROM payment_orders WHERE invitation_id=? AND uid=? AND status='active'").bind(order.invitation_id,order.uid).first();
      const start=Math.max(Date.now(),Date.parse(prior?.expiry||'')||0,Date.parse(entitlement?.fields?.expiresAt?.timestampValue||'')||0);
      const expiresAt=new Date(start+(Number(order.duration_months)===6?183:92)*86400000).toISOString();
      const stored=await db.prepare("UPDATE payment_orders SET status='activation_pending',transaction_ref=?,reviewed_by=?,reviewed_at=?,expires_at=?,activation_started_at=?,updated_at=? WHERE id=? AND review_token=? AND status IN ('pending_review','ai_match')").bind(reference,admin.email,now,expiresAt,now,now,id,requestId).run();
      if(!stored.meta.changes)throw new Error('Aktivasi tidak dapat dicatat.');
    } catch(error) {
      await db.prepare('DELETE FROM activation_locks WHERE invitation_id=? AND order_id=?').bind(order.invitation_id,id).run();throw error;
    }
    order=await db.prepare('SELECT * FROM payment_orders WHERE id=?').bind(id).first();
    await completeActivation(context.env,order);
    console.log(JSON.stringify({event:'payment_activated',orderId:id,requestId}));
    return json({status:'active',expiresAt:order.expires_at});
  } catch(error) {
    console.error(JSON.stringify({event:'activation_failed',requestId,message:String(error.message).slice(0,200)}));
    return json({message:'Aktivasi belum selesai. Status akan dicoba kembali secara otomatis.'},502);
  } finally {
    if(claimed)await db.prepare("UPDATE payment_orders SET review_token=NULL,review_started_at=NULL WHERE id=? AND review_token=? AND status<>'activation_pending'").bind(claimed,requestId).run().catch(()=>{});
  }
}
