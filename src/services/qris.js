// QRIS EMV helpers. The merchant payload is supplied through
// VITE_QRIS_STATIC_PAYLOAD; no merchant identity is committed to source.

function parseEmv(payload) {
  const fields = [];
  let cursor = 0;
  while (cursor + 4 <= payload.length) {
    const tag = payload.slice(cursor, cursor + 2);
    const length = Number(payload.slice(cursor + 2, cursor + 4));
    if (!/^\d{2}$/.test(tag) || !Number.isInteger(length)) throw new Error('Payload QRIS tidak valid.');
    const value = payload.slice(cursor + 4, cursor + 4 + length);
    if (value.length !== length) throw new Error('Panjang field QRIS tidak valid.');
    fields.push({ tag, value });
    cursor += 4 + length;
  }
  if (cursor !== payload.length) throw new Error('Payload QRIS tidak lengkap.');
  return fields;
}

function field(tag, value) {
  const text = String(value);
  if (text.length > 99) throw new Error(`Field QRIS ${tag} terlalu panjang.`);
  return `${tag}${String(text.length).padStart(2, '0')}${text}`;
}

function crc16(text) {
  let crc = 0xffff;
  for (let i = 0; i < text.length; i += 1) {
    crc ^= text.charCodeAt(i) << 8;
    for (let bit = 0; bit < 8; bit += 1) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}

function updateAdditionalData(value, orderId) {
  let nested = [];
  try { nested = parseEmv(value); } catch { nested = []; }
  nested = nested.filter((item) => item.tag !== '05');
  nested.push({ tag: '05', value: String(orderId).replace(/[^A-Za-z0-9]/g, '').slice(-18) || 'ENVEELY' });
  return nested.map((item) => field(item.tag, item.value)).join('');
}

export function createDynamicQris(staticPayload, amount, orderId) {
  // Spaces inside merchant name/city are part of the EMV field length.
  const source = String(staticPayload || '').trim().replace(/[\r\n\t]/g, '');
  if (!source) return null;
  const total = Number(amount);
  if (!Number.isInteger(total) || total <= 0) throw new Error('Nominal QRIS harus berupa Rupiah bulat.');

  let fields = parseEmv(source).filter((item) => !['01', '54', '63'].includes(item.tag));
  const additionalIndex = fields.findIndex((item) => item.tag === '62');
  const additional = updateAdditionalData(additionalIndex >= 0 ? fields[additionalIndex].value : '', orderId);
  if (additionalIndex >= 0) fields[additionalIndex] = { tag: '62', value: additional };
  else fields.push({ tag: '62', value: additional });

  const currencyIndex = fields.findIndex((item) => item.tag === '53');
  const insertAt = currencyIndex >= 0 ? currencyIndex + 1 : fields.length;
  fields.splice(insertAt, 0, { tag: '54', value: String(total) });
  fields.splice(1, 0, { tag: '01', value: '12' });

  const withoutCrc = fields.map((item) => field(item.tag, item.value)).join('') + '6304';
  return `${withoutCrc}${crc16(withoutCrc)}`;
}

export function configuredStaticQris() {
  return String(import.meta.env.VITE_QRIS_STATIC_PAYLOAD || '').trim();
}
