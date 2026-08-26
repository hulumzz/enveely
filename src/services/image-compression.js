// Enveely — Image compression/optimization before upload.
// Goal: keep hosted images small (fast invitations on mobile data)
// while staying visually crisp ("jernih") for wedding photography.

export const COMPRESSION_PRESETS = {
  /** Hero/couple portraits — highest fidelity. */
  hero: { maxDimension: 1600, quality: 0.86, mimeType: 'image/jpeg' },
  /** Gallery photos — balanced. */
  gallery: { maxDimension: 1400, quality: 0.82, mimeType: 'image/jpeg' },
  /** Thumbnails / small slots. */
  thumb: { maxDimension: 640, quality: 0.78, mimeType: 'image/jpeg' },
};

/**
 * Compress an image File/Blob via canvas re-encode.
 * Preserves aspect ratio; downscales only when larger than maxDimension.
 *
 * @param {File|Blob} file
 * @param {{maxDimension?: number, quality?: number, mimeType?: string}} [options]
 * @returns {Promise<{blob: Blob, width: number, height: number, originalSize: number, compressedSize: number}>}
 */
export async function compressImage(file, options = {}) {
  const opts = {
    maxDimension: 1600,
    quality: 0.85,
    mimeType: 'image/jpeg',
    ...options,
  };

  const bitmap = await loadBitmap(file);
  const scale = Math.min(1, opts.maxDimension / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  // High-quality downscaling hint; white matte avoids black background for PNG with alpha.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  if ('close' in bitmap) bitmap.close();

  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Canvas toBlob failed'))),
      opts.mimeType,
      opts.quality,
    );
  });

  return {
    blob,
    width,
    height,
    originalSize: file.size,
    compressedSize: blob.size,
  };
}

async function loadBitmap(file) {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file);
    } catch {
      /* fall through to <img> path */
    }
  }
  // Fallback for older browsers / exotic formats.
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const el = new Image();
      el.onload = () => resolve(el);
      el.onerror = () => reject(new Error('Invalid image file'));
      el.src = url;
    });
    return img;
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  }
}

/** Human-readable byte size, e.g. "1.8 MB". */
export function formatBytes(bytes) {
  if (!bytes && bytes !== 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let i = 0;
  let n = bytes;
  while (n >= 1024 && i < units.length - 1) {
    n /= 1024;
    i++;
  }
  return `${n.toFixed(n >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
