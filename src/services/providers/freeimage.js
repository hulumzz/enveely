// Enveely — Freeimage.host provider adapter (FAILOVER image host).
// API v1 docs: https://freeimage.host/api
// - POST https://freeimage.host/api/1/upload  (multipart FILES["source"] or base64)
// - params: key, action=upload, source, format=json
// Response shape differs from ImgBB: { status_code, success:{message,code},
//   image: { id_encoded, url, thumb:{url}, medium:{url}, display_url,
//            width, height, size, filename, original_filename, delete_url, ... } }

const FREEIMAGE_ENDPOINT = 'https://freeimage.host/api/1/upload';

/**
 * @param {Blob} blob - compressed image binary
 * @param {{apiKey: string, name?: string}} options
 * @returns {Promise<import('./image-service.js').HostedImage>}
 */
export async function uploadToFreeImage(blob, { apiKey, name }) {
  if (!apiKey) throw new Error('Freeimage.host API key missing');

  const form = new FormData();
  form.append('key', apiKey);
  form.append('action', 'upload');
  form.append('format', 'json');
  // Binary multipart upload (preferred over base64 by the docs).
  form.append('source', blob, sanitizeFilename(name, blob.type));

  const res = await fetch(FREEIMAGE_ENDPOINT, { method: 'POST', body: form });

  if (!res.ok) {
    const detail = await safeErrorDetail(res);
    throw new Error(`Freeimage upload failed (${res.status}): ${detail}`);
  }

  const json = await res.json();
  const img = json?.image;
  if (json?.status_code !== 200 || !img?.url) {
    throw new Error(`Freeimage upload rejected: ${json?.error?.message || json?.status_code || 'unknown error'}`);
  }

  return {
    provider: 'freeimage',
    id: String(img.id_encoded ?? img.filename ?? ''),
    url: img.url,
    viewerUrl: img.url_viewer ?? null,
    thumbUrl: img.thumb?.url ?? img.medium?.url ?? img.url,
    mediumUrl: img.medium?.url ?? img.thumb?.url ?? img.url,
    deleteUrl: img.delete_url ?? null,
    width: Number(img.width) || null,
    height: Number(img.height) || null,
    size: Number(img.size) || blob.size,
    mimeType: guessMime(img.extension) || blob.type,
    originalName: name ?? img.original_filename ?? null,
  };
}

function sanitizeFilename(name, mime) {
  const ext = (mime && mime.split('/')[1]) || 'jpg';
  const base = String(name || 'enveely').replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 60);
  return base.includes('.') ? base : `${base}.${ext}`;
}

function guessMime(ext) {
  const map = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp', gif: 'image/gif', avif: 'image/avif' };
  return map[String(ext || '').toLowerCase()] || null;
}

async function safeErrorDetail(res) {
  try {
    const text = await res.text();
    return text.slice(0, 200);
  } catch {
    return 'no detail';
  }
}
