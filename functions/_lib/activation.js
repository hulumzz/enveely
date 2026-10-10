import {adminDocument,writeEntitlement} from './firebase-admin.js';

// D1 is the durable outbox. The Firestore write is idempotent for this order.
// Keep the invitation lock until BOTH stores agree, including during a retry.
export async function completeActivation(env,order) {
  if(order.status !== 'activation_pending' || !order.expires_at) throw new Error('Aktivasi belum disiapkan.');
  const invitation=await adminDocument(env,`invitations/${order.invitation_id}`);
  if(!invitation || invitation.fields?.status?.stringValue==='deleting' || invitation.fields?.ownerUid?.stringValue!==order.uid || invitation.fields?.design?.mapValue?.fields?.variantId?.stringValue!==order.variant_id) throw new Error('Pemilik atau desain undangan sudah berubah.');
  await writeEntitlement(env,{invitationId:order.invitation_id,ownerUid:order.uid,expiresAt:order.expires_at,orderId:order.id,variantId:order.variant_id,invitationDocument:invitation});
  const result=await env.PAYMENTS_DB.prepare("UPDATE payment_orders SET status='active',activation_error=NULL,updated_at=?,review_token=NULL,review_started_at=NULL WHERE id=? AND status='activation_pending' AND expires_at=?").bind(new Date().toISOString(),order.id,order.expires_at).run();
  if(!result.meta.changes) {
    const current=await env.PAYMENTS_DB.prepare('SELECT status FROM payment_orders WHERE id=?').bind(order.id).first();
    if(current?.status!=='active') throw new Error('Pencatatan aktivasi belum selesai.');
  }
  await env.PAYMENTS_DB.prepare('DELETE FROM activation_locks WHERE invitation_id=? AND order_id=?').bind(order.invitation_id,order.id).run();
}
export async function reconcileActivations(env) {
  const rows=await env.PAYMENTS_DB.prepare("SELECT * FROM payment_orders WHERE status='activation_pending' ORDER BY updated_at LIMIT 2").all();
  let completed=0,failed=0;
  for(const order of rows.results) {
    try { await completeActivation(env,order); completed++; }
    catch(error) {failed++; await env.PAYMENTS_DB.prepare('UPDATE payment_orders SET activation_error=?,updated_at=? WHERE id=? AND status=\'activation_pending\'').bind(String(error.message).slice(0,200),new Date().toISOString(),order.id).run();}
  }
  await env.PAYMENTS_DB.prepare("DELETE FROM activation_locks WHERE order_id IN (SELECT id FROM payment_orders WHERE status='active')").run();
  return {completed,failed};
}
