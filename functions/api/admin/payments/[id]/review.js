import { isPaymentAdmin, json, requireFirebaseUser, writeEntitlement } from '../../../../_lib/firebase-admin.js';

export async function onRequestPost(context) {
  const requestId = crypto.randomUUID();
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
      SELECT id, uid, invitation_id, duration_months, status
      FROM payment_orders WHERE id = ? LIMIT 1
    `).bind(id).first();
    if (!order) return json({ message: 'Pesanan tidak ditemukan.' }, 404);
    if (!['pending_review', 'ai_match'].includes(order.status)) return json({ message: 'Pesanan ini tidak lagi menunggu review.' }, 409);

    const now = new Date();
    if (decision === 'reject') {
      await context.env.PAYMENTS_DB.prepare(`
        UPDATE payment_orders
        SET status = 'rejected', reviewed_by = ?, reviewed_at = ?, updated_at = ?
        WHERE id = ?
      `).bind(admin.email || admin.localId, now.toISOString(), now.toISOString(), id).run();
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
    });
    await context.env.PAYMENTS_DB.prepare(`
      UPDATE payment_orders
      SET status = 'active', reviewed_by = ?, reviewed_at = ?, expires_at = ?, updated_at = ?
      WHERE id = ?
    `).bind(admin.email || admin.localId, now.toISOString(), expiresAt, now.toISOString(), id).run();
    console.log(JSON.stringify({ event: 'payment_approved', requestId, orderId: id, reviewer: admin.localId, expiresAt }));
    return json({ status: 'active', expiresAt });
  } catch (error) {
    console.error(JSON.stringify({ event: 'admin_payment_review_error', requestId, message: error?.message || 'unknown' }));
    return json({ message: 'Review belum dapat disimpan. Entitlement tidak diaktifkan.' }, 500);
  }
}
