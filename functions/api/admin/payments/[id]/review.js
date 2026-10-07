import { isPaymentAdmin, json, requireFirebaseUser, writeEntitlement } from '../../../../_lib/firebase-admin.js';

export async function onRequestPost(context) {
  const requestId = crypto.randomUUID();
  let claimedId = '';
  try {
    const admin = await requireFirebaseUser(context.request, context.env);
    if (!admin || !isPaymentAdmin(admin, context.env)) return json({ message: 'Akses admin diperlukan.' }, 403);
    if (!context.env.PAYMENTS_DB) return json({ message: 'Database pembayaran belum dikonfigurasi.' }, 503);
    const id = String(context.params.id || '');
    if (!/^[A-Za-z0-9_-]{8,80}$/.test(id)) return json({ message: 'ID pesanan tidak valid.' }, 400);
    const payload = await context.request.json().catch(() => ({}));
    const decision = payload.decision === 'approve' ? 'approve' : payload.decision === 'reject' ? 'reject' : '';
    if (!decision) return json({ message: 'Keputusan review tidak valid.' }, 400);
    const order = await context.env.PAYMENTS_DB.prepare(`
      SELECT id, uid, invitation_id, variant_id, duration_months, status
      FROM payment_orders WHERE id = ? LIMIT 1
    `).bind(id).first();
    if (!order) return json({ message: 'Pesanan tidak ditemukan.' }, 404);
    if (!['pending_review', 'ai_match'].includes(order.status)) return json({ message: 'Pesanan ini tidak lagi menunggu review.' }, 409);

    const now = new Date();
    const lock = await context.env.PAYMENTS_DB.prepare(`UPDATE payment_orders SET review_token = ?, review_started_at = ?
      WHERE id = ? AND status IN ('pending_review','ai_match') AND (review_token IS NULL OR review_started_at < ?)`)
      .bind(requestId,now.toISOString(),id,new Date(now.getTime()-5*60*1000).toISOString()).run();
    if(!lock.meta.changes)return json({message:'Pesanan sedang diproses reviewer lain.'},409);
    claimedId = id;
    if (decision === 'reject') {
      await context.env.PAYMENTS_DB.prepare(`
        UPDATE payment_orders
        SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, updated_at = ?, review_token = NULL, review_started_at = NULL
        WHERE id = ? AND review_token = ?
      `).bind(admin.email || admin.localId, now.toISOString(), now.toISOString(), id,requestId).run();
      console.log(JSON.stringify({ event: 'payment_rejected', requestId, orderId: id, reviewer: admin.localId }));
      return json({ status: 'rejected' });
    }

    const days = Number(order.duration_months) === 6 ? 183 : 92;
    const expiresAt = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
    await writeEntitlement(context.env, {
      invitationId: order.invitation_id,
      ownerUid: order.uid,
      expiresAt,
      orderId: order.id,
      variantId: order.variant_id,
    });
    await context.env.PAYMENTS_DB.prepare(`
      UPDATE payment_orders
      SET status = 'active', reviewed_by = ?, reviewed_at = ?, expires_at = ?, updated_at = ?, review_token = NULL, review_started_at = NULL
      WHERE id = ? AND review_token = ?
    `).bind(admin.email || admin.localId, now.toISOString(), expiresAt, now.toISOString(), id,requestId).run();
    console.log(JSON.stringify({ event: 'payment_approved', requestId, orderId: id, reviewer: admin.localId, expiresAt }));
    return json({ status: 'active', expiresAt });
  } catch (error) {
    if(claimedId)await context.env.PAYMENTS_DB.prepare('UPDATE payment_orders SET review_token = NULL, review_started_at = NULL WHERE id = ? AND review_token = ?').bind(claimedId,requestId).run().catch(()=>null);
    console.error(JSON.stringify({ event: 'admin_payment_review_error', requestId, message: error?.message || 'unknown' }));
    return json({ message: 'Review belum dapat diselesaikan. Muat ulang status lalu coba kembali.' }, 500);
  }
}
