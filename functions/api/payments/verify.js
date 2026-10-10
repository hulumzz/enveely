import { calculatePackage } from '../../../src/data/plans.js';
import { requireFirebaseUser, getOwnedInvitation } from '../../_lib/firebase-admin.js';
import {validImageBytes,sha256} from '../../_lib/image-validation.js';
import {consumeQuota} from '../../_lib/request-limit.js';

const MAX_PROOF_BYTES = 8 * 1024 * 1024;
const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

export async function onRequestPost(context) {
  const requestId = crypto.randomUUID();
  try {
    const length = Number(context.request.headers.get('content-length') || 0);
    if (length > MAX_PROOF_BYTES + 100_000) return json({ message: 'Ukuran bukti maksimal 8 MB.' }, 413);

    const user = await requireFirebaseUser(context.request, context.env);
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
    const invitation = await getOwnedInvitation(context.request, context.env, invitationId, user);
    if (!invitation) return json({ message: 'Undangan ini bukan milik akun Anda.' }, 403);
    if (invitation.design?.mapValue?.fields?.variantId?.stringValue !== variantId) return json({message:'Desain pesanan berbeda dari undangan.'},409);
    const existing = await context.env.PAYMENTS_DB.prepare('SELECT uid, status, invitation_id, variant_id, duration_months, unique_code, review_token,proof_key FROM payment_orders WHERE id = ? LIMIT 1').bind(orderId).first();
    if (existing?.uid && existing.uid !== user.localId) return json({ message: 'Pesanan ini bukan milik akun Anda.' }, 403);
    if (existing?.status === 'active') return json({ message: 'Pesanan aktif tidak dapat diubah.' }, 409);
    if (!existing) return json({message:'Buat pesanan di checkout sebelum mengirim bukti.'},409);
    if (existing && (!['draft','rejected'].includes(existing.status) || existing.review_token)) return json({message:'Bukti pesanan ini sedang ditinjau. Tunggu hasil review.'},409);
    if (existing && (existing.invitation_id !== invitationId || existing.variant_id !== variantId || existing.duration_months !== durationMonths || existing.unique_code !== uniqueCode)) return json({message:'Rincian pesanan yang sudah dikirim tidak dapat diubah.'},409);
    if(!await consumeQuota(context.env,user.localId,'payment-proof',10,86400))return json({message:'Batas pengiriman bukti harian tercapai. Hubungi bantuan untuk melanjutkan.'},429);
    const ext = proof.type === 'image/png' ? 'png' : proof.type === 'image/webp' ? 'webp' : 'jpg';
    const proofKey = `payments/${user.localId}/${orderId}/${crypto.randomUUID()}.${ext}`;
    const bytes = await proof.arrayBuffer();
    if(!validImageBytes(bytes,proof.type))return json({message:'Isi berkas bukan gambar yang valid.'},400);
    const proofHash=await sha256(bytes);
    if(await context.env.PAYMENTS_DB.prepare("SELECT id FROM payment_orders WHERE proof_hash=? AND id<>? AND status<>'rejected' LIMIT 1").bind(proofHash,orderId).first())return json({message:'Bukti ini telah digunakan pada pesanan lain.'},409);
    await context.env.PAYMENT_PROOFS.put(proofKey, bytes, {
      httpMetadata: { contentType: proof.type },
      customMetadata: { orderId, invitationId, uid: user.localId },
    });

    const now = new Date().toISOString();
    let stored;
    try {
      stored = await context.env.PAYMENTS_DB.prepare("UPDATE payment_orders SET status='pending_review',proof_key=?,proof_hash=?,ai_amount=NULL,ai_confidence=0,ai_summary='Menunggu pemeriksaan bukti.',updated_at=? WHERE id=? AND uid=? AND status IN ('draft','rejected') AND review_token IS NULL")
        .bind(proofKey,proofHash,now,orderId,user.localId).run();
      if(!stored.meta.changes) {await context.env.PAYMENT_PROOFS.delete(proofKey);return json({message:'Pesanan telah diproses. Muat ulang status.'},409);}
    } catch(error) {await context.env.PAYMENT_PROOFS.delete(proofKey);throw error;}
    if(existing.proof_key && existing.proof_key!==proofKey)await context.env.PAYMENT_PROOFS.delete(existing.proof_key).catch(()=>{});
    const enrich=async()=>{
      let timer;
      try {
        const verification=await Promise.race([inspectProof(context.env,bytes,proof.type,expectedTotal,orderId),new Promise((_,reject)=>{timer=setTimeout(()=>reject(new Error('AI timeout')),12_000);})]);
        const match=Number(verification.amount)===expectedTotal && verification.paymentSuccessful===true;
        await context.env.PAYMENTS_DB.prepare("UPDATE payment_orders SET status=?,ai_amount=?,ai_confidence=?,ai_summary=?,ai_transaction_ref=?,updated_at=? WHERE id=? AND proof_key=? AND status='pending_review' AND review_token IS NULL")
          .bind(match?'ai_match':'pending_review',Number(verification.amount)||null,Number(verification.confidence)||0,String(verification.summary||'Perlu review manual.').slice(0,500),String(verification.transactionReference||'').slice(0,100),new Date().toISOString(),orderId,proofKey).run();
      }catch(error){console.warn(JSON.stringify({event:'payment_ai_fallback',orderId,message:error.message}));}finally{clearTimeout(timer);}
    };
    context.waitUntil(enrich());
    console.log(JSON.stringify({event:'payment_proof_received',orderId,requestId}));
    return json({status:'pending_review',verification:{summary:'Bukti berhasil diterima. Menunggu pemeriksaan dan persetujuan.'}});
  } catch (error) {
    console.error(JSON.stringify({ event: 'payment_verification_error', requestId, message: error?.message || 'unknown' }));
    return json({ message: 'Bukti belum berhasil dikirim. Periksa status pesanan sebelum mencoba kembali.' }, 500);
  }
}

export function onRequest(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { status: 204, headers: securityHeaders() });
  return json({ message: 'Metode tidak diizinkan.' }, 405);
}

async function inspectProof(env, bytes, mimeType, expectedTotal, orderId) {
  if (bytes.byteLength > 2*1024*1024) return {amount:null,confidence:0,paymentSuccessful:null,summary:'Bukti resolusi tinggi diperiksa manual.'};
  if (!env.AI) return { amount: null, confidence: 0, paymentSuccessful: null, summary: 'AI binding belum aktif.' };
  const image = Array.from(new Uint8Array(bytes));
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
