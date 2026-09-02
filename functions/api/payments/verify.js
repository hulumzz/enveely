import { calculatePackage } from '../../../src/data/plans.js';

const MAX_PROOF_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function onRequestPost(context) {
  const requestId = crypto.randomUUID();
  try {
    const length = Number(context.request.headers.get('content-length') || 0);
    if (length > MAX_PROOF_BYTES + 100_000) return json({ message: 'Ukuran bukti maksimal 8 MB.' }, 413);

    const user = await authenticate(context.request, context.env);
    if (!user) return json({ message: 'Sesi login tidak valid. Silakan masuk kembali.' }, 401);
    if (!context.env.PAYMENT_PROOFS || !context.env.PAYMENTS_DB) {
      return json({ message: 'Penyimpanan pembayaran belum dikonfigurasi.' }, 503);
    }

    const form = await context.request.formData();
    const proof = form.get('proof');
    if (!(proof instanceof File) || !ALLOWED_TYPES.has(proof.type) || proof.size <= 0 || proof.size > MAX_PROOF_BYTES) {
      return json({ message: 'Bukti harus berupa JPG, PNG, atau WebP maksimal 8 MB.' }, 400);
    }

    const orderId = cleanId(form.get('orderId'), 80);
    const invitationId = cleanId(form.get('invitationId'), 80);
    const variantId = cleanId(form.get('variantId'), 80);
    const durationMonths = Number(form.get('durationMonths')) === 6 ? 6 : 3;
    const uniqueCode = Number(form.get('uniqueCode'));
    const pkg = calculatePackage(variantId, durationMonths);
    if (!orderId || !invitationId || !pkg?.paid || ![111, 222, 333, 123, 321].includes(uniqueCode)) {
      return json({ message: 'Data pesanan tidak valid.' }, 400);
    }
    const expectedTotal = pkg.subtotal + uniqueCode;
    const existing = await context.env.PAYMENTS_DB.prepare('SELECT uid, status FROM payment_orders WHERE id = ? LIMIT 1').bind(orderId).first();
    if (existing?.uid && existing.uid !== user.localId) return json({ message: 'Pesanan ini bukan milik akun Anda.' }, 403);
    if (existing?.status === 'active') return json({ message: 'Pesanan aktif tidak dapat diubah.' }, 409);
    const ext = proof.type === 'image/png' ? 'png' : proof.type === 'image/webp' ? 'webp' : 'jpg';
    const proofKey = `payments/${user.localId}/${orderId}/${crypto.randomUUID()}.${ext}`;
    const bytes = await proof.arrayBuffer();
    await context.env.PAYMENT_PROOFS.put(proofKey, bytes, {
      httpMetadata: { contentType: proof.type },
      customMetadata: { orderId, invitationId, uid: user.localId },
    });

    let verification;
    try {
      verification = await inspectProof(context.env, bytes, proof.type, expectedTotal, orderId);
    } catch (error) {
      console.warn(JSON.stringify({ event: 'payment_ai_fallback', requestId, orderId, message: error?.message || 'unknown' }));
      verification = { amount: null, confidence: 0, paymentSuccessful: null, summary: 'Pemeriksaan AI belum tersedia; perlu review manual.' };
    }
    const amountMatch = Number(verification.amount) === expectedTotal;
    const status = amountMatch && verification.paymentSuccessful === true ? 'ai_match' : 'pending_review';
    const now = new Date().toISOString();

    await context.env.PAYMENTS_DB.prepare(`
      INSERT INTO payment_orders (
        id, uid, invitation_id, variant_id, duration_months, base_price,
        extension_fee, unique_code, expected_total, status, proof_key,
        ai_amount, ai_confidence, ai_summary, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        status = excluded.status,
        proof_key = excluded.proof_key,
        ai_amount = excluded.ai_amount,
        ai_confidence = excluded.ai_confidence,
        ai_summary = excluded.ai_summary,
        updated_at = excluded.updated_at
    `).bind(
      orderId,
      user.localId,
      invitationId,
      variantId,
      durationMonths,
      pkg.basePrice,
      pkg.extensionFee,
      uniqueCode,
      expectedTotal,
      status,
      proofKey,
      Number(verification.amount) || null,
      Number(verification.confidence) || 0,
      String(verification.summary || '').slice(0, 500),
      now,
      now,
    ).run();

    console.log(JSON.stringify({ event: 'payment_proof_received', requestId, orderId, status, amountMatch }));
    return json({
      status,
      verification: {
        result: amountMatch ? 'amount_match' : 'manual_review',
        confidence: Number(verification.confidence) || 0,
        summary: amountMatch
          ? `Nominal ${rupiah(expectedTotal)} terbaca cocok. Menunggu aktivasi akhir.`
          : 'Nominal belum terbaca dengan yakin. Tim akan memeriksa bukti secara manual.',
      },
    });
  } catch (error) {
    console.error(JSON.stringify({ event: 'payment_verification_error', requestId, message: error?.message || 'unknown' }));
    return json({ message: 'Bukti tersimpan sebagai draft, tetapi belum dapat diperiksa. Coba lagi beberapa saat.' }, 500);
  }
}

export function onRequest(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { status: 204, headers: securityHeaders() });
  return json({ message: 'Metode tidak diizinkan.' }, 405);
}

async function authenticate(request, env) {
  const bearer = request.headers.get('authorization') || '';
  const token = bearer.startsWith('Bearer ') ? bearer.slice(7) : '';
  if (!token || !env.FIREBASE_WEB_API_KEY) return null;
  const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${encodeURIComponent(env.FIREBASE_WEB_API_KEY)}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ idToken: token }),
  });
  if (!response.ok) return null;
  const result = await response.json();
  return result.users?.[0] || null;
}

async function inspectProof(env, bytes, mimeType, expectedTotal, orderId) {
  if (!env.AI) return { amount: null, confidence: 0, paymentSuccessful: null, summary: 'AI binding belum aktif.' };
  const image = `data:${mimeType};base64,${arrayBufferToBase64(bytes)}`;
  const prompt = [
    'Periksa screenshot bukti pembayaran QRIS Indonesia ini.',
    `Nominal yang diharapkan: ${expectedTotal} IDR. Referensi order: ${orderId}.`,
    'Jangan pernah menyatakan pembayaran final atau mengaktifkan produk.',
    'Balas hanya JSON valid dengan bentuk:',
    '{"amount":number|null,"paymentSuccessful":boolean|null,"transactionReference":string|null,"transactionTime":string|null,"confidence":number,"summary":string}',
  ].join('\n');
  const result = await env.AI.run('@cf/meta/llama-3.2-11b-vision-instruct', {
    prompt,
    image,
    max_tokens: 320,
    temperature: 0,
  });
  return parseModelJson(result?.response || result?.result || result);
}

function parseModelJson(value) {
  if (typeof value === 'object' && value !== null) return value;
  const text = String(value || '').replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end <= start) return { amount: null, confidence: 0, summary: 'Detail belum terbaca.' };
  try { return JSON.parse(text.slice(start, end + 1)); } catch { return { amount: null, confidence: 0, summary: 'Detail belum terbaca.' }; }
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunk = 0x8000;
  for (let offset = 0; offset < bytes.length; offset += chunk) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunk));
  }
  return btoa(binary);
}

function cleanId(value, max) {
  const text = String(value || '');
  return /^[A-Za-z0-9_-]+$/.test(text) ? text.slice(0, max) : '';
}

function rupiah(value) {
  return `Rp${new Intl.NumberFormat('id-ID').format(value)}`;
}

function securityHeaders() {
  return {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
    'x-content-type-options': 'nosniff',
    'referrer-policy': 'no-referrer',
  };
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: securityHeaders() });
}
