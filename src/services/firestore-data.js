// Enveely — Firestore data service (invitation persistence, Phase 3).
// Every function degrades gracefully when Firebase is not configured:
// the app keeps working in local-only mode via draft-store.

import { getDb, isFirebaseConfigured } from './firebase.js';
import { getDeviceId } from '../core/device.js';

async function dbOrNull() {
  if (!isFirebaseConfigured()) return null;
  try {
    return await getDb();
  } catch {
    return null;
  }
}

function stripPrivate(invitation) {
  // Draft-mode flags never belong on the stored document.
  const { ...publicDoc } = invitation;
  delete publicDoc._draft;
  return publicDoc;
}

/**
 * Create or update an invitation document (draft or published).
 * @param {object} invitation full invitation object
 * @returns {Promise<{id: string, cloud: boolean}>}
 */
export async function saveInvitation(invitation) {
  const id = invitation.id || `inv_${crypto.randomUUID().slice(0, 12)}`;
  const db = await dbOrNull();
  if (!db) return { id, cloud: false };

  const { doc, setDoc, serverTimestamp } = await import('firebase/firestore');
  const payload = {
    ...stripPrivate(invitation),
    id,
    deviceId: getDeviceId(),
    updatedAt: serverTimestamp(),
  };
  if (invitation.status === 'published' && !invitation.publishedAt) {
    payload.publishedAt = serverTimestamp();
  }
  await setDoc(doc(db, 'invitations', id), payload, { merge: true });

  // Mirror control doc (ownership metadata; Blueprint-1.md §41).
  await setDoc(
    doc(db, 'invitationControl', id),
    { deviceId: getDeviceId(), updatedAt: serverTimestamp() },
    { merge: true },
  );
  return { id, cloud: true };
}

/** Fetch an invitation for editing — requires deviceId match when configured. */
export async function getInvitationForEdit(id) {
  const db = await dbOrNull();
  if (!db) return null;
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'invitations', id));
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.deviceId && data.deviceId !== getDeviceId()) return null;
  return { id: snap.id, ...data };
}

/** Fetch a PUBLISHED invitation for public viewing. */
export async function getPublishedInvitation(id) {
  const db = await dbOrNull();
  if (!db) return null;
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'invitations', id));
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.status !== 'published') return null;
  return { id: snap.id, ...data };
}

/** List drafts owned by this device (cloud). */
export async function listCloudDrafts() {
  const db = await dbOrNull();
  if (!db) return [];
  const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');
  const q = query(
    collection(db, 'invitations'),
    where('deviceId', '==', getDeviceId()),
    orderBy('updatedAt', 'desc'),
    limit(30),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Submit an RSVP into invitations/{id}/rsvps with field validation. */
export async function submitRsvp(invitationId, data) {
  const db = await dbOrNull();
  if (!db) return { cloud: false };
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  await addDoc(collection(db, 'invitations', invitationId, 'rsvps'), {
    name: String(data.name || '').slice(0, 80),
    attendance: data.attendance === 'not-attending' ? 'not-attending' : 'attending',
    guestCount: Math.min(Math.max(Number(data.guestCount) || 1, 1), 20),
    message: String(data.message || '').slice(0, 500),
    createdAt: serverTimestamp(),
  });
  return { cloud: true };
}

/** Submit a wish into invitations/{id}/wishes. */
export async function submitWish(invitationId, data) {
  const db = await dbOrNull();
  if (!db) return { cloud: false };
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  await addDoc(collection(db, 'invitations', invitationId, 'wishes'), {
    name: String(data.name || '').slice(0, 80),
    message: String(data.message || '').slice(0, 500),
    approved: false,
    createdAt: serverTimestamp(),
  });
  return { cloud: true };
}

/** List approved wishes for a public invitation. */
export async function listApprovedWishes(invitationId, max = 50) {
  const db = await dbOrNull();
  if (!db) return [];
  const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');
  const q = query(
    collection(db, 'invitations', invitationId, 'wishes'),
    where('approved', '==', true),
    orderBy('createdAt', 'desc'),
    limit(max),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}
