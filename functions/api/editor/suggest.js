import { requireFirebaseUser, json } from '../../_lib/firebase-admin.js';
import {consumeQuota} from '../../_lib/request-limit.js';

const MAX_BODY_BYTES = 14_000;
const FIELD_LIMITS = Object.freeze({
  coverEyebrow: 60, welcomeMessage: 420, closingMessage: 420,
  'quoteSettings.text': 320, 'quoteSettings.source': 80,
  'infoSettings.dressCode': 220, 'infoSettings.access': 420, 'infoSettings.notes': 420,
});

// Workers AI copy assistant, with an optional Groq override. The client sends editorial facts only; payment,
// gift, authentication, and image data are deliberately excluded.
export async function onRequestPost(context) {
  const requestId = crypto.randomUUID();
  try {
    const user = await requireFirebaseUser(context.request, context.env);
    if (!user) return json({ message: 'Sesi login tidak valid.' }, 401);
    if (!context.env.GROQ_API_KEY && !context.env.AI) return json({ message: 'Asisten AI belum dikonfigurasi.', code: 'unconfigured' }, 503);
    const length = Number(context.request.headers.get('content-length') || 0);
    if (length > MAX_BODY_BYTES) return json({ message: 'Konteks editor terlalu besar.' }, 413);

    const input = await context.request.json();
    const task = input?.task === 'complete' ? 'complete' : 'field';
    const field = String(input?.field || '');
    if (task === 'field' && !isSupportedField(field)) return json({ message: 'Field copy tidak didukung.' }, 400);
    if(!await consumeQuota(context.env,user.localId,'editor-ai',30,86400))return json({message:'Batas saran AI harian tercapai. Kamu tetap bisa mengedit teks secara langsung.'},429);

    const contextData = sanitiseContext(input?.context);
    const source = context.env.GROQ_API_KEY ? 'groq' : 'cloudflare';
    const model = source === 'groq' ? 'openai/gpt-oss-120b' : '@cf/openai/gpt-oss-120b';
    const messages = task === 'complete' ? completePrompt(contextData) : fieldPrompt(field, contextData);
    let answer;
    if (source === 'groq') answer = await askGroq(context.env.GROQ_API_KEY,model,messages);
    else {const result=await context.env.AI.run(model,{messages,max_tokens:1400,temperature:0.55,response_format:{type:'json_object'}});answer=result.response || result.choices?.[0]?.message?.content || '';}
    const parsed = parseJson(answer);

    if (task === 'field') {
      const value = cleanText(parsed?.value, limitFor(field));
      if (!value) return json({ message: 'AI belum dapat memberi saran. Lengkapi nama atau detail acara dulu.' }, 422);
      return json({ source, model, value });
    }
    if (!parsed) return json({message:'Saran belum dapat dibaca. Coba kembali.'},502);
    return json({ source, model, content: cleanContent(parsed) });
  } catch (error) {
    console.error(JSON.stringify({ event: 'editor_ai_error', requestId, message: error?.message || 'unknown' }));
    return json({ message: 'Asisten AI sedang tidak tersedia. Coba lagi sebentar.' }, 502);
  }
}

export function onRequest(context) {
  if (context.request.method === 'OPTIONS') return new Response(null, { status: 204, headers: corsHeaders() });
  return json({ message: 'Metode tidak diizinkan.' }, 405);
}

async function askGroq(apiKey, model, messages) {
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model, messages, temperature: 0.55, max_completion_tokens: 1_000, response_format: { type: 'json_object' } }),
    signal: AbortSignal.timeout(45_000),
  });
  if (!response.ok) throw new Error(`groq_${response.status}`);
  const data = await response.json();
  return data?.choices?.[0]?.message?.content || '';
}

function fieldPrompt(field, contextData) {
  return [
    { role: 'system', content: 'Kamu adalah copywriter undangan pernikahan Indonesia untuk Enveely. Tulis hangat, elegan, natural, dan ringkas. Gunakan hanya fakta pada konteks; jangan menciptakan nama, tanggal, alamat, atau ayat. Balas JSON valid persis: {"value":"..."} tanpa markdown.' },
    { role: 'user', content: `Buat satu saran untuk field ${fieldLabel(field)}. Maksimum ${limitFor(field)} karakter. Konteks:\n${JSON.stringify(contextData)}` },
  ];
}

function completePrompt(contextData) {
  return [
    { role: 'system', content: 'Kamu membantu mengisi copy undangan pernikahan Indonesia. Gunakan hanya fakta yang tersedia; jangan mengarang alamat, tanggal, nama orang tua, rekening, atau foto. Balas JSON valid saja dengan format {"coverEyebrow":"","welcomeMessage":"","closingMessage":"","quoteSettings":{"text":"","source":""},"infoSettings":{"dressCode":"","access":"","notes":""},"story":[{"date":"","title":"","text":""}]}. Isi hanya copy aman disarankan; field tanpa fakta cukup string kosong. Teks harus hangat, elegan, ringkas, dan siap diedit.' },
    { role: 'user', content: `Lengkapi draf ini dengan copy yang sesuai. Jangan mengubah fakta inti:\n${JSON.stringify(contextData)}` },
  ];
}

function sanitiseContext(value) {
  const c = value && typeof value === 'object' ? value : {};
  const clip = (item, max = 180) => String(item || '').replace(/[<>]/g, '').trim().slice(0, max);
  return {
    template: clip(c.template, 40), names: { groom: clip(c.names?.groom, 80), bride: clip(c.names?.bride, 80) }, weddingDate: clip(c.weddingDate, 24),
    events: Array.isArray(c.events) ? c.events.slice(0, 4).map((event) => ({ title: clip(event?.title, 80), date: clip(event?.date, 24), time: clip(event?.time, 40), venue: clip(event?.venue, 120), city: clip(event?.city, 80) })) : [],
    current: { coverEyebrow: clip(c.current?.coverEyebrow, 80), welcomeMessage: clip(c.current?.welcomeMessage, 460), closingMessage: clip(c.current?.closingMessage, 460), quote: clip(c.current?.quote, 360), dressCode: clip(c.current?.dressCode, 240), access: clip(c.current?.access, 460), notes: clip(c.current?.notes, 460) },
  };
}

function cleanContent(value) {
  const story = Array.isArray(value?.story) ? value.story.slice(0, 3).map((item) => ({ date: cleanText(item?.date, 24), title: cleanText(item?.title, 90), text: cleanText(item?.text, 360) })).filter((item) => item.title || item.text) : [];
  return { coverEyebrow: cleanText(value?.coverEyebrow, 60), welcomeMessage: cleanText(value?.welcomeMessage, 420), closingMessage: cleanText(value?.closingMessage, 420), quoteSettings: { text: cleanText(value?.quoteSettings?.text, 320), source: cleanText(value?.quoteSettings?.source, 80) }, infoSettings: { dressCode: cleanText(value?.infoSettings?.dressCode, 220), access: cleanText(value?.infoSettings?.access, 420), notes: cleanText(value?.infoSettings?.notes, 420) }, story };
}

function cleanText(value, max = 420) { return String(value || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim().slice(0, max); }
function parseJson(value) { const text = String(value || '').replace(/```(?:json)?/gi, '').replace(/```/g, '').trim(); try { return JSON.parse(text); } catch { const start = text.indexOf('{'); const end = text.lastIndexOf('}'); try { return start >= 0 && end > start ? JSON.parse(text.slice(start, end + 1)) : null; } catch { return null; } } }
function isSupportedField(field) { return field in FIELD_LIMITS || /^story\.\d+\.text$/.test(field); }
function limitFor(field) { return /^story\.\d+\.text$/.test(field) ? 360 : FIELD_LIMITS[field] || 360; }
function fieldLabel(field) { if (/^story\.\d+\.text$/.test(field)) return 'cerita momen pasangan'; return ({ coverEyebrow: 'teks kecil pada sampul', welcomeMessage: 'kalimat pembuka', closingMessage: 'kalimat penutup', 'quoteSettings.text': 'kutipan', 'quoteSettings.source': 'sumber kutipan', 'infoSettings.dressCode': 'dress code', 'infoSettings.access': 'info akses dan parkir', 'infoSettings.notes': 'catatan tamu' })[field] || field; }
function corsHeaders() { return { 'cache-control': 'no-store', 'access-control-allow-methods': 'POST, OPTIONS', 'access-control-allow-headers': 'authorization, content-type' }; }
