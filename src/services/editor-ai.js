import { getAuthToken } from './auth.js';

export async function suggestEditorCopy({ task = 'field', field = '', draft }) {
  try {
    const token = await getAuthToken();
    if (!token) throw new Error('auth');
    const response = await fetch('/api/editor/suggest', { method: 'POST', headers: { authorization: `Bearer ${token}`, 'content-type': 'application/json' }, body: JSON.stringify({ task, field, context: editorContext(draft) }) });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.message || 'Asisten belum tersedia.');
    return result;
  } catch (error) {
    return task === 'complete' ? { source: 'local', content: localDraftSuggestion(draft), note: error.message } : { source: 'local', value: localFieldSuggestion(field, draft), note: error.message };
  }
}

function editorContext(draft) {
  const c = draft?.content || {};
  return { template: draft?.design?.templateId || '', names: { groom: c.groom?.name || c.groom?.nickname || '', bride: c.bride?.name || c.bride?.nickname || '' }, weddingDate: c.weddingDate || '', events: (c.events || []).slice(0, 4).map((event) => ({ title: event.title, date: event.date, time: event.startTime, venue: event.venue, city: cityFromAddress(event.address) })), current: { coverEyebrow: c.coverEyebrow, welcomeMessage: c.welcomeMessage, closingMessage: c.closingMessage, quote: c.quoteSettings?.text, dressCode: c.infoSettings?.dressCode, access: c.infoSettings?.access, notes: c.infoSettings?.notes } };
}

function localFieldSuggestion(field, draft) {
  const names = coupleNames(draft); const event = draft?.content?.events?.[0] || {};
  const copy = { coverEyebrow: 'THE WEDDING OF', welcomeMessage: `Dengan penuh sukacita, kami mengundang Bapak/Ibu/Saudara/i untuk hadir dan merayakan hari bahagia ${names} bersama kami.`, closingMessage: `Terima kasih atas doa, cinta, dan kehadiran Anda untuk ${names}. Sampai jumpa di hari bahagia kami.`, 'quoteSettings.text': 'Cinta adalah perjalanan pulang, ketika dua hati memilih untuk bertumbuh dan berjalan bersama.', 'quoteSettings.source': names, 'infoSettings.dressCode': 'Kenakan busana rapi dan nyaman. Nuansa warna lembut sangat diapresiasi.', 'infoSettings.access': event.venue ? `Mohon tiba beberapa menit lebih awal. Akses menuju ${event.venue} dapat dibuka melalui tombol peta di bawah.` : 'Mohon tiba beberapa menit lebih awal untuk kenyamanan bersama.', 'infoSettings.notes': 'Kehadiran dan doa terbaik Anda akan menjadi kebahagiaan besar bagi kami.' };
  return /^story\.\d+\.text$/.test(field) ? `Sebuah momen kecil yang menjadi bagian penting dari perjalanan ${names}.` : (copy[field] || '');
}

function localDraftSuggestion(draft) {
  const c = draft?.content || {};
  return { coverEyebrow: c.coverEyebrow || localFieldSuggestion('coverEyebrow', draft), welcomeMessage: c.welcomeMessage || localFieldSuggestion('welcomeMessage', draft), closingMessage: c.closingMessage || localFieldSuggestion('closingMessage', draft), quoteSettings: { text: c.quoteSettings?.text || localFieldSuggestion('quoteSettings.text', draft), source: c.quoteSettings?.source || localFieldSuggestion('quoteSettings.source', draft) }, infoSettings: { dressCode: c.infoSettings?.dressCode || localFieldSuggestion('infoSettings.dressCode', draft), access: c.infoSettings?.access || localFieldSuggestion('infoSettings.access', draft), notes: c.infoSettings?.notes || localFieldSuggestion('infoSettings.notes', draft) }, story: (c.story || []).map((item) => ({ ...item, text: item.text || localFieldSuggestion('story.0.text', draft) })) };
}

function coupleNames(draft) { const c = draft?.content || {}; return [c.groom?.nickname || c.groom?.name, c.bride?.nickname || c.bride?.name].filter(Boolean).join(' & ') || 'kami'; }
function cityFromAddress(address) { return String(address || '').split(',').at(-1)?.trim().slice(0, 80) || ''; }
