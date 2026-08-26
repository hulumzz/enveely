// Enveely — ImgBB provider adapter (PRIMARY image host).
// API v1 docs: https://api.imgbb.com/
// - POST https://api.imgbb.com/1/upload?key=...  (multipart/form-data)
// - No `expiration` param -> image is permanent (required for invitations).
// Response shape: { data: { id, url, display_url, url_viewer, thumb:{url},
//   medium:{url}, width, height, size, mime, image:{filename,mime,...}, delete_url } }

const IMGBB_ENDPOINT = 'https://api.imgbb.com/1/upload';

/**
 * @param {Blob} blob - compressed image binary
 * @param {{apiKey: string, name?: string}} options
 * @returns {Promise<import('./image-service.js').HostedImage>}
 */
export async function uploadToImgBB(blob, { apiKey, name }) {
  if (!apiKey) throw new Error('ImgBB API key missing');

  const base64 = await blobToBase64(blob);
  const form = new FormData();
  // ImgBB accepts base64 payload in the `image` field; `name` controls the title/filename.
  form.append('image', base64);
  if (name) form.append('name', sanitizeName(name));

  const res = await fetch(`${IMGBB_ENDPOINT}?key=${encodeURIComponent(apiKey)}`, {
    method: 'POST',
    body: form,
  });

  if (!res.ok) {
    const detail = await safeErrorDetail(res);
    throw new Error(`ImgBB upload failed (${res.status}): ${detail}`);
  }

  const json = await res.json();
  if (!json?.success || !json?.data?.url) {
    throw new Error(`ImgBB upload rejected: ${json?.error?.message || 'unknown error'}`);
  }

  const d = json.data;
  return {
    provider: 'imgbb',
    id: String(d.id ?? ''),
    url: d.url ?? d.display_url,
    viewerUrl: d.url_viewer ?? null,
    thumbUrl: d.thumb?.url ?? d.medium?.url ?? d.url,
    mediumUrl: d.medium?.url ?? d.thumb?.url ?? d.url,
    deleteUrl: d.delete_url ?? null,
    width: Number(d.width) || null,
    height: Number(d.height) || null,
    size: Number(d.size) || blob.size,
    mimeType: d.image?.mime ?? blob.type,
    originalName: name ?? d.image?.filename ?? null,
  };
}

function sanitizeName(name) {
  return String(name).replace(/[^a-zA-Z0-9._-]+/g, '-').slice(0, 80) || 'enveely';
}

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      const commaIdx = result.indexOf(',');
      resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
    };
    reader.onerror = () => reject(new Error('Failed to read image data'));
    reader.readAsDataURL(blob);
  });
}

async function safeErrorDetail(res) {
  try {
    const text = await res.text();
    return text.slice(0, 200);
  } catch {
    return 'no detail';
  }
}
