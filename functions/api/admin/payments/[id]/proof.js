import { isPaymentAdmin, json, requireFirebaseUser } from '../../../../_lib/firebase-admin.js';

export async function onRequestGet(context) {
  try {
    const user = await requireFirebaseUser(context.request, context.env);
    if (!user || !isPaymentAdmin(user, context.env)) return json({ message: 'Akses admin diperlukan.' }, 403);
    if (!context.env.PAYMENTS_DB || !context.env.PAYMENT_PROOFS) return json({ message: 'Penyimpanan pembayaran belum dikonfigurasi.' }, 503);
    const id = String(context.params.id || '');
    if (!/^[A-Za-z0-9_-]{8,80}$/.test(id)) return json({ message: 'ID pesanan tidak valid.' }, 400);
    const row = await context.env.PAYMENTS_DB.prepare('SELECT proof_key FROM payment_orders WHERE id = ? LIMIT 1').bind(id).first();
    if (!row?.proof_key) return json({ message: 'Bukti tidak ditemukan.' }, 404);
    const object = await context.env.PAYMENT_PROOFS.get(row.proof_key);
    if (!object) return json({ message: 'Bukti tidak ditemukan.' }, 404);
    return new Response(object.body, {
      headers: {
        'content-type': object.httpMetadata?.contentType || 'application/octet-stream',
        'cache-control': 'private, no-store',
        'x-content-type-options': 'nosniff',
        'content-disposition': 'inline; filename="payment-proof"',
      },
    });
  } catch (error) {
    console.error(JSON.stringify({ event: 'admin_payment_proof_error', message: error?.message || 'unknown' }));
    return json({ message: 'Bukti tidak dapat ditampilkan.' }, 500);
  }
}
