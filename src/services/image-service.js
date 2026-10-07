// Enveely — ImageService: unified image hosting facade.
// Strategy (user decision): ImgBB = PRIMARY, Freeimage.host = FAILOVER.
// - Client-side compression happens BEFORE upload (see image-compression.js).
// - Automatic failover when the primary fails (error / rate limit / network).
// - Provider health is remembered so subsequent uploads skip a failing provider
//   for a cooldown window (mitigates ImgBB "broken image over time" pain at
//   upload time; long-term re-mirroring can be added later using stored metadata).
//
// Firestore stores only URLs + metadata — never binaries (Blueprint-1.md §42).

import { compressImage, COMPRESSION_PRESETS } from './image-compression.js';
import { uploadToImgBB } from './providers/imgbb.js';
import { uploadToFreeImage } from './providers/freeimage.js';
import { getAuthToken } from './auth.js';

/** @typedef {{
 *  provider: 'imgbb'|'freeimage',
 *  id: string,
 *  url: string,
 *  viewerUrl?: string|null,
 *  thumbUrl: string,
 *  mediumUrl: string,
 *  deleteUrl: string|null,
 *  width: number|null,
 *  height: number|null,
 *  size: number,
 *  mimeType: string,
 *  originalName: string|null
 * }} HostedImage */

const HEALTH_KEY = 'env_provider_health';
const COOLDOWN_MS = 5 * 60 * 1000; // skip a failing provider for 5 minutes

export const UPLOAD_LIMITS = {
  maxOriginalBytes: 15 * 1024 * 1024, // 15 MB pre-compression guard
  allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
};

/**
 * Validate -> compress -> upload with primary/failover strategy.
 *
 * @param {File|Blob} file user-selected image
 * @param {{preset?: keyof typeof COMPRESSION_PRESETS, name?: string}} [options]
 * @returns {Promise<HostedImage>}
 * @throws {Error} when validation fails or ALL providers fail
 */
export async function uploadImage(file, options = {}) {
  validateFile(file);

  const preset = COMPRESSION_PRESETS[options.preset || 'gallery'];
  const compressed = await compressImage(file, preset);

  if (options.invitationId) {
    const token = await getAuthToken();
    if (!token) throw new Error('Silakan masuk untuk mengunggah foto.');
    const body = new FormData();
    body.set('photo', compressed.blob, 'photo.jpg');
    body.set('invitationId', options.invitationId);
    const response = await fetch('/api/media/upload', {method:'POST',headers:{authorization:`Bearer ${token}`},body,signal:AbortSignal.timeout(60_000)});
    const result = await response.json().catch(()=>({}));
    if (!response.ok) throw new Error(result.message || 'Foto belum dapat diunggah.');
    return result;
  }

  const providers = orderedProviders();
  const errors = [];

  for (const provider of providers) {
    try {
      const result = await provider.upload(compressed.blob, {
        apiKey: provider.apiKey(),
        name: options.name,
      });
      markProviderHealthy(provider.id);
      return { ...result, size: result.size || compressed.compressedSize };
    } catch (err) {
      errors.push(`${provider.id}: ${err.message}`);
      markProviderFailed(provider.id);
      // continue to next provider (failover)
    }
  }

  throw new Error(`All image providers failed. ${errors.join(' | ')}`);
}

/** Ordered provider list: healthy primary first; failed primary skipped during cooldown. */
function orderedProviders() {
  const health = readHealth();
  const makeProvider = (id, upload, apiKey) => ({
    id,
    upload,
    apiKey,
    failedAt: health[id]?.failedAt || 0,
  });

  const imgbb = makeProvider('imgbb', uploadToImgBB, () => import.meta.env.VITE_IMGBB_API_KEY);
  const freeimage = makeProvider('freeimage', uploadToFreeImage, () => import.meta.env.VITE_FREEIMAGE_API_KEY);

  // Configured providers only, primary first, unless primary is in cooldown.
  const configured = [imgbb, freeimage].filter((p) => Boolean(p.apiKey()));
  const fresh = configured.filter((p) => Date.now() - p.failedAt > COOLDOWN_MS);
  const cooling = configured.filter((p) => Date.now() - p.failedAt <= COOLDOWN_MS);
  return [...fresh, ...cooling];
}

function validateFile(file) {
  if (!file) throw new Error('No file selected.');
  if (!UPLOAD_LIMITS.allowedMimeTypes.includes(file.type)) {
    throw new Error('Unsupported file type. Please use JPG, PNG, or WebP.');
  }
  if (file.size > UPLOAD_LIMITS.maxOriginalBytes) {
    throw new Error('Image is too large. Maximum 15 MB before compression.');
  }
}

// ---- Provider health persistence (localStorage best-effort) ----

function readHealth() {
  try {
    return JSON.parse(localStorage.getItem(HEALTH_KEY) || '{}');
  } catch {
    return {};
  }
}

function writeHealth(health) {
  try {
    localStorage.setItem(HEALTH_KEY, JSON.stringify(health));
  } catch {
    /* ignore */
  }
}

function markProviderFailed(id) {
  const health = readHealth();
  health[id] = { failedAt: Date.now() };
  writeHealth(health);
}

function markProviderHealthy(id) {
  const health = readHealth();
  if (health[id]) {
    delete health[id];
    writeHealth(health);
  }
}
