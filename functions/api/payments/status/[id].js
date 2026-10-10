import {requireFirebaseUser} from '../../../_lib/firebase-admin.js';
export async function onRequestGet(context) {
  try {
    const user = await requireFirebaseUser(context.request, context.env);
    if (!user) return json({ message: 'Sesi login tidak valid.' }, 401);
    if (!context.env.PAYMENTS_DB) return json({ message: 'Penyimpanan pembayaran belum dikonfigurasi.' }, 503);
    const orderId = String(context.params.id || '');
    if (!/^[A-Za-z0-9_-]{8,80}$/.test(orderId)) return json({ message: 'ID pesanan tidak valid.' }, 400);
    const row = await context.env.PAYMENTS_DB.prepare(`
      SELECT id, status, ai_confidence, ai_summary, reviewed_at, expires_at, updated_at
      FROM payment_orders WHERE id = ? AND uid = ? LIMIT 1
    `).bind(orderId, user.localId).first();
    if (!row) return json({ message: 'Pesanan tidak ditemukan.' }, 404);
    return json({
      id: row.id,
      status: row.status==='active' && Date.parse(row.expires_at)<=Date.now() ? 'expired' : row.status,
      expiresAt: row.expires_at ? Date.parse(row.expires_at) : null,
      reviewedAt: row.reviewed_at ? Date.parse(row.reviewed_at) : null,
      verification: { confidence: row.ai_confidence || 0, summary: row.ai_summary || '' },
    });
  } catch {
    return json({ message: 'Status pembayaran belum dapat dimuat.' }, 500);
  }
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', 'x-content-type-options': 'nosniff' } });
}
