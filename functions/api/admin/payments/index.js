import { isPaymentAdmin, json, requireFirebaseUser } from '../../../_lib/firebase-admin.js';

export async function onRequestGet(context) {
  try {
    const user = await requireFirebaseUser(context.request, context.env);
    if (!user || !isPaymentAdmin(user, context.env)) return json({ message: 'Akses admin diperlukan.' }, 403);
    if (!context.env.PAYMENTS_DB) return json({ message: 'Database pembayaran belum dikonfigurasi.' }, 503);
    const result = await context.env.PAYMENTS_DB.prepare(`
      SELECT id, uid, invitation_id, variant_id, duration_months, expected_total,
        status, transaction_ref,activation_error,ai_transaction_ref, ai_amount, ai_confidence, ai_summary, created_at, updated_at
      FROM payment_orders
      WHERE status IN ('pending_review', 'ai_match','activation_pending')
      ORDER BY updated_at ASC
      LIMIT 100
    `).all();
    return json({ orders: result.results || [] });
  } catch (error) {
    console.error(JSON.stringify({ event: 'admin_payment_list_error', message: error?.message || 'unknown' }));
    return json({ message: 'Antrean pembayaran belum dapat dimuat.' }, 500);
  }
}
