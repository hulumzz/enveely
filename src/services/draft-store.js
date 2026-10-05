// Enveely — Draft store: local persistence layer for invitations (MVP).
// localStorage is the fast safety layer; Firestore sync arrives in Phase 3
// (Blueprint-1.md §23 autosave strategy). All access is defensive — private
// mode / quota errors must never crash the editor.

import { getDeviceId } from '../core/device.js';

const INDEX_KEY = 'env_draft_index';
const LEGACY_INDEX_KEY = 'ulwed_draft_index';
const draftKey = (id) => `env_draft_${id}`;
const legacyDraftKey = (id) => `ulwed_draft_${id}`;

/** Move a draft from the pre-rebrand storage keys to the new ones (one-time). */
function migrateLegacyDraft(id) {
  try {
    const raw = localStorage.getItem(legacyDraftKey(id));
    if (!raw) return;
    localStorage.setItem(draftKey(id), raw);
    localStorage.removeItem(legacyDraftKey(id));
  } catch {
    /* ignore */
  }
}

/** Resolve the draft id list across old/new index keys, migrating as needed. */
function resolveIndex() {
  let ids = [];
  try {
    ids = JSON.parse(localStorage.getItem(INDEX_KEY) || 'null') || [];
  } catch {
    ids = [];
  }
  if (!Array.isArray(ids) || !ids.length) {
    try {
      const legacy = JSON.parse(localStorage.getItem(LEGACY_INDEX_KEY) || 'null');
      if (Array.isArray(legacy) && legacy.length) {
        ids = legacy;
        localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
        legacy.forEach(migrateLegacyDraft);
      }
    } catch {
      /* ignore */
    }
  }
  return Array.isArray(ids) ? ids : [];
}

function safeGet(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

export function newInvitationId() {
  const rand = () => Math.random().toString(36).slice(2, 8);
  return `inv_${Date.now().toString(36)}${rand()}`;
}

/** Create a fresh invitation skeleton for a template+variant. */
export function createDraft(templateId, variantId) {
  const enabledSections = sectionPresetFor(templateId);
  return {
    id: newInvitationId(),
    status: 'draft',
    locale: 'id',
    deviceId: getDeviceId(),
    design: { templateId, variantId },
    content: {
      groom: { name: '', nickname: '', photoUrl: '' },
      bride: { name: '', nickname: '', photoUrl: '' },
      weddingDate: '',
      coverEyebrow: 'THE WEDDING OF',
      coverImage: '',
      welcomeMessage: '',
      hostName: '',
      parents: { groom: '', bride: '' },
      events: [],
      story: [],
      gallery: [],
      rsvpSettings: { enabled: true, askAttendance: true, askGuestCount: true, allowMessage: true, maxGuestCount: 5 },
      giftSettings: { enabled: false, accounts: [], address: '' },
      wishesEnabled: true,
      closingMessage: '',
      closingImage: '',
      quoteSettings: { text: '', source: '' },
      infoSettings: { dressCode: '', access: '', notes: '' },
    },
    sections: [
      'cover', 'welcome', 'couple', 'parents', 'quote', 'event', 'countdown', 'story',
      'gallery', 'map', 'info', 'rsvp', 'gift', 'wishes', 'closing',
    ].map((id) => ({ id, enabled: enabledSections.has(id) })),
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

// A family starts with the sections that support its storytelling style. Users
// can still reveal or hide any section in the editor, so the form stays flexible.
function sectionPresetFor(templateId) {
  const core = ['cover', 'welcome', 'couple', 'event', 'countdown', 'gallery', 'map', 'rsvp', 'wishes', 'closing'];
  const optional = {
    amora: ['parents', 'quote', 'story', 'info'],
    elysian: ['quote', 'story'],
    serena: ['quote', 'story', 'info'],
    lumiere: ['story', 'info'],
    nusantara: ['parents', 'quote', 'info'],
    pusaka: ['parents', 'quote', 'info'],
    mayura: ['quote', 'story', 'info'],
    blocka: ['quote', 'story', 'info'],
    meadow: ['quote', 'story', 'info'],
  };
  return new Set([...core, ...(optional[templateId] || [])]);
}

/** Persist a draft locally. Updates index + updatedAt. */
export function saveDraft(invitation) {
  if (!invitation?.id) return false;
  invitation.updatedAt = Date.now();
  const ok = safeSet(draftKey(invitation.id), JSON.stringify(invitation));
  if (ok) {
    const index = listDraftIds().filter((id) => id !== invitation.id);
    index.unshift(invitation.id);
    safeSet(INDEX_KEY, JSON.stringify(index.slice(0, 30)));
  }
  return ok;
}

export function loadDraft(id) {
  try {
    let raw = safeGet(draftKey(id));
    if (!raw) {
      // Fall back to the pre-rebrand key and migrate it forward.
      raw = safeGet(legacyDraftKey(id));
      if (raw) {
        try { localStorage.setItem(draftKey(id), raw); } catch { /* ignore */ }
        try { localStorage.removeItem(legacyDraftKey(id)); } catch { /* ignore */ }
      }
    }
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function deleteDraft(id) {
  try {
    localStorage.removeItem(draftKey(id));
    localStorage.removeItem(legacyDraftKey(id));
    safeSet(INDEX_KEY, JSON.stringify(listDraftIds().filter((x) => x !== id)));
  } catch {
    /* ignore */
  }
}

export function listDraftIds() {
  return resolveIndex();
}

export function listDrafts() {
  return listDraftIds()
    .map((id) => loadDraft(id))
    .filter(Boolean);
}
