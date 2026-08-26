// Enveely — Device identity for the no-login MVP.
// Generates a one-time opaque installation identifier stored in localStorage.
// NOTE: this is NOT a secure identity; it only scopes drafts per browser
// (see Blueprint-1.md §8 "No-Login MVP Identity Strategy").

const DEVICE_ID_KEY = 'env_device_id';
const LEGACY_DEVICE_ID_KEY = 'ulwed_device_id';

/** @returns {string} e.g. "ENV-k7f3a9c2m1x4" */
export function ensureDeviceId() {
  let id = null;
  try {
    id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      // One-time migration from the pre-rebrand key so existing drafts stay owned.
      id = localStorage.getItem(LEGACY_DEVICE_ID_KEY);
      if (id) localStorage.setItem(DEVICE_ID_KEY, id);
    }
  } catch {
    // localStorage unavailable (private mode edge cases) — session-only fallback.
  }
  if (!id) {
    id = generateDeviceId();
    try {
      localStorage.setItem(DEVICE_ID_KEY, id);
    } catch {
      /* ignore */
    }
  }
  return id;
}

export function getDeviceId() {
  try {
    return localStorage.getItem(DEVICE_ID_KEY) || ensureDeviceId();
  } catch {
    return ensureDeviceId();
  }
}

function generateDeviceId() {
  const rand = () => Math.random().toString(36).slice(2, 10);
  return `ENV-${rand()}${rand()}`.slice(0, 24);
}
