// Enveely — Share service: URL + WhatsApp + Web Share API (Blueprint-1.md §19).

import { analyticsEvents } from './analytics.js';

/**
 * Build a shareable invitation URL.
 * @param {string} invitationId
 * @param {{guestName?: string}} [opts]
 */
export function invitationUrl(invitationId, opts = {}) {
  const base = `${window.location.origin}/invite/${encodeURIComponent(invitationId)}`;
  return opts.guestName ? `${base}?to=${encodeURIComponent(opts.guestName)}` : base;
}

/** Prefilled WhatsApp message (ID default). */
export function whatsappMessage({ groomName, brideName, url }) {
  const couple = [groomName, brideName].filter(Boolean).join(' & ');
  return `Assalamu'alaikum.\n\nDengan penuh kebahagiaan, kami mengundang Anda untuk hadir di acara pernikahan ${couple || 'kami'}.\n\nLihat undangan:\n${url}`;
}

export function whatsappUrl(message) {
  return `https://wa.me/?text=${encodeURIComponent(message)}`;
}

/** Native share sheet when available; returns 'shared'|'unsupported'. */
export async function nativeShare(payload) {
  if (!navigator.share) return 'unsupported';
  try {
    await navigator.share(payload);
    analyticsEvents.shareUrl();
    return 'shared';
  } catch {
    return 'cancelled';
  }
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for non-secure contexts.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try { ok = document.execCommand('copy'); } catch { ok = false; }
    ta.remove();
    return ok;
  }
}
