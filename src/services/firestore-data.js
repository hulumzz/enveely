// Enveely — Firestore persistence for account-owned invitations and guest data.
// Local drafts survive outages; publishing and submissions require cloud success.

import { getDb, isFirebaseConfigured } from './firebase.js';
import { getCurrentUser } from './auth.js';

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
  for (const field of ['freeActivatedAt','publishedAt','cloudCreatedAt','updatedAt']) delete publicDoc[field];
  const clean = value => {
    if (Array.isArray(value)) return value.filter(v=>!v?._local).map(clean);
    if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([k,v])=>!k.startsWith('_') && k !== 'deleteUrl' && v !== undefined).map(([k,v])=>[k,clean(v)]));
    return typeof value === 'string' && value.startsWith('blob:') ? '' : value;
  };
  return clean(publicDoc);
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
  const user = await getCurrentUser();
  if (!user) throw new Error('authentication-required');

  const { doc, getDoc, setDoc, serverTimestamp } = await import('firebase/firestore');
  const invitationRef = doc(db, 'invitations', id);
  let existing;
  try { existing = await getDoc(invitationRef); }
  catch(error) {
    // Rules cannot reveal a nonexistent document's owner. A create is still
    // checked by Firestore; updates to another owner's document remain denied.
    if(error.code !== 'permission-denied')throw error;
    existing = {exists:()=>false,data:()=>undefined};
  }
  if (existing.exists() && existing.data().ownerUid !== user.uid) throw new Error('Undangan ini bukan milik akun Anda.');
  const payload = {
    ...stripPrivate(invitation),
    id,
    ownerUid: user.uid,
    updatedAt: serverTimestamp(),
  };
  if (!existing.exists()) payload.cloudCreatedAt = serverTimestamp();
  if (
    invitation.status === 'published'
    && invitation.design?.variantId === 'serena-paper'
    && !existing.data()?.freeActivatedAt
  ) {
    payload.freeActivatedAt = serverTimestamp();
  }
  if (invitation.status === 'published' && !existing.data()?.publishedAt) {
    payload.publishedAt = serverTimestamp();
  }
  await setDoc(invitationRef, payload, { merge: true });

  // Mirror control doc (ownership metadata; Blueprint-1.md §41).
  await setDoc(
    doc(db, 'invitationControl', id),
    { ownerUid: user.uid, updatedAt: serverTimestamp() },
    { merge: true },
  );
  const saved = invitation.status === 'published' ? (await getDoc(invitationRef)).data() : null;
  return { id, cloud: true, saved };
}

/** Fetch an invitation for editing — requires account ownership when configured. */
export async function getInvitationForEdit(id) {
  const db = await dbOrNull();
  if (!db) return null;
  const { doc, getDoc } = await import('firebase/firestore');
  const snap = await getDoc(doc(db, 'invitations', id));
  if (!snap.exists()) return null;
  const data = snap.data();
  const user = await getCurrentUser();
  if (!user || data.ownerUid !== user.uid) return null;
  return { id: snap.id, ...data };
}

/** Fetch a PUBLISHED invitation for public viewing. */
export async function getPublishedInvitation(id) {
  const db = await dbOrNull();
  if (!db) return null;
  const { doc, getDoc } = await import('firebase/firestore');
  let snap;
  try { snap = await getDoc(doc(db, 'invitations', id)); }
  catch(error) { if (error.code === 'permission-denied' || error.code === 'not-found') return null; throw error; }
  if (!snap.exists()) return null;
  const data = snap.data();
  if (data.status !== 'published') return null;
  return { id: snap.id, ...data };
}

/** List drafts owned by this device (cloud). */
export async function listCloudDrafts() {
  const db = await dbOrNull();
  if (!db) return [];
  const user = await getCurrentUser();
  if (!user) return [];
  const { collection, query, where, orderBy, limit, getDocs } = await import('firebase/firestore');
  const q = query(
    collection(db, 'invitations'),
    where('ownerUid', '==', user.uid),
    orderBy('updatedAt', 'desc'),
    limit(30),
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/** Submit an RSVP into invitations/{id}/rsvps with field validation. */
export async function submitRsvp(invitationId, data) {
  const db = await dbOrNull();
  if (!db) throw new Error('Penyimpanan RSVP belum tersedia.');
  const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
  await addDoc(collection(db, 'invitations', invitationId, 'rsvps'), {
    name: String(data.name || '').slice(0, 80),
    attendance: data.attendance === 'not-attending' ? 'not-attending' : 'attending',
    guestCount: Math.min(Math.max(Math.floor(Number(data.guestCount)) || 1, 1), 20),
    message: String(data.message || '').slice(0, 500),
    createdAt: serverTimestamp(),
  });
  return { cloud: true };
}

/** Submit a wish into invitations/{id}/wishes. */
export async function submitWish(invitationId, data) {
  const db = await dbOrNull();
  if (!db) throw new Error('Penyimpanan ucapan belum tersedia.');
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

export async function deleteCloudInvitation(id) {
  const {getAuthToken} = await import('./auth.js');
  const token = await getAuthToken();
  const response = await fetch(`/api/invitations/${encodeURIComponent(id)}`, {method:'DELETE',headers:{authorization:`Bearer ${token}`}});
  const result = await response.json().catch(()=>({}));
  if(!response.ok)throw new Error(result.message || 'Undangan belum dapat dihapus.');
}

export async function resolveOwnedDraft(id) {
  const {loadDraft,saveDraft} = await import('./draft-store.js');
  const local = loadDraft(id);
  if (local) return local;
  const cloud = await getInvitationForEdit(id);
  if (cloud) saveDraft({...cloud,updatedAt:cloud.updatedAt?.toMillis?.() || Date.now()});
  return cloud;
}

export async function listGuestResponses(id) {
  const db = await dbOrNull();
  if (!db) throw new Error('Penyimpanan tamu belum tersedia.');
  const {collection,getDocs,query,orderBy,limit} = await import('firebase/firestore');
  const [rsvps,wishes] = await Promise.all(['rsvps','wishes'].map(name=>getDocs(query(collection(db,'invitations',id,name),orderBy('createdAt','desc'),limit(200)))));
  const map = snap=>snap.docs.map(d=>({id:d.id,...d.data()}));
  return {rsvps:map(rsvps),wishes:map(wishes)};
}

export async function moderateWish(invitationId,wishId,approved) {
  const db = await dbOrNull();
  const {doc,updateDoc} = await import('firebase/firestore');
  await updateDoc(doc(db,'invitations',invitationId,'wishes',wishId),{approved});
}
