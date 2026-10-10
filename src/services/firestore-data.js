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
const saveQueues = new Map();
export function saveInvitation(invitation) {
  const previous = saveQueues.get(invitation.id) || Promise.resolve();
  const task = previous.catch(()=>{}).then(()=>saveInvitationNow(invitation));
  saveQueues.set(invitation.id, task);
  task.finally(()=>{ if(saveQueues.get(invitation.id) === task) saveQueues.delete(invitation.id); }).catch(()=>{});
  return task;
}
async function saveInvitationNow(invitation) {
  const id = invitation.id || `inv_${crypto.randomUUID().slice(0, 12)}`;
  const db = await dbOrNull();
  if (!db) return { id, cloud: false };
  const user = await getCurrentUser();
  if (!user) throw new Error('authentication-required');

  const { doc, runTransaction, serverTimestamp } = await import('firebase/firestore');
  const { validDesign } = await import('../data/plans.js');
  if (!validDesign(invitation.design)) throw new Error('Desain undangan tidak valid.');
  const snapshot = structuredClone(invitation);
  const editVersion = invitation._editVersion || 0;
  const ref = doc(db, 'invitations', id);
  const revision = await runTransaction(db, async tx => {
    const existing = await tx.get(ref);
    const remote = existing.data();
    if (remote && remote.ownerUid !== user.uid) throw new Error('Undangan ini bukan milik akun Anda.');
    const expected = snapshot._cloudRevision ?? snapshot.revision ?? 0;
    if ((remote?.revision || 0) !== expected) {
      const error = new Error('Ada perubahan dari perangkat lain. Muat versi akun sebelum melanjutkan.');
      error.code = 'draft-conflict'; throw error;
    }
    const revision = (remote?.revision || 0) + 1;
    const payload = { ...stripPrivate(snapshot), id, ownerUid: user.uid, revision, updatedAt: serverTimestamp() };
    if (!remote) payload.cloudCreatedAt = serverTimestamp();
    if (snapshot.status === 'published' && !remote?.publishedAt) payload.publishedAt = serverTimestamp();
    if (snapshot.status === 'published' && snapshot.design.variantId === 'serena-paper' && !remote?.freeActivatedAt) {
      const ledgerRef = doc(db, 'activationLedger', id);
      const ledger = await tx.get(ledgerRef);
      payload.freeActivatedAt = ledger.data()?.startedAt || serverTimestamp();
      if (!ledger.exists()) tx.set(ledgerRef, { ownerUid: user.uid, startedAt: serverTimestamp() });
    }
    tx.set(ref, payload, { merge: true });
    tx.set(doc(db, 'invitationControl', id), { ownerUid: user.uid, updatedAt: serverTimestamp() }, { merge: true });
    return revision;
  });
  invitation._cloudRevision = revision; invitation.revision = revision;
  const { saveDraft } = await import('./draft-store.js');
  if ((invitation._editVersion || 0) === editVersion) saveDraft(invitation, { synced: true });
  else { invitation._dirty = true; saveDraft(invitation); }
  const { getDoc } = await import('firebase/firestore');
  const saved = snapshot.status === 'published' ? (await getDoc(ref)).data() : null;
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
    limit(100),
  );
  const snap = await getDocs(q);
  const result = snap.docs.map(d=>({id:d.id,...d.data()}));
  const {startAfter} = await import('firebase/firestore');
  let page = snap;
  while(page.size === 100) { page = await getDocs(query(collection(db,'invitations'),where('ownerUid','==',user.uid),orderBy('updatedAt','desc'),startAfter(page.docs.at(-1)),limit(100))); result.push(...page.docs.map(d=>({id:d.id,...d.data()}))); }
  return result;
}

/** Submit an RSVP into invitations/{id}/rsvps with field validation. */
async function submitGuest(invitationId,kind,data) {
 const response=await fetch(`/api/guests/${encodeURIComponent(invitationId)}`,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({kind,data,token:data._token,requestId:data._requestId})});
 const result=await response.json();if(!response.ok)throw new Error(result.message);return result;
}
export function submitRsvp(invitationId,data) {return submitGuest(invitationId,'rsvp',data);}
export function submitWish(invitationId,data) {return submitGuest(invitationId,'wish',data);}

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
  if(!response.ok || result.deleted!==true)throw new Error(result.message || 'Penghapusan sedang dilanjutkan. Coba kembali untuk menyelesaikannya.');
}

export async function resolveOwnedDraft(id) {
  const {loadDraft,saveDraft} = await import('./draft-store.js');
  const local = loadDraft(id);
  let cloud;
  try { cloud = await getInvitationForEdit(id); } catch(error) { if(local) return local; throw error; }
  if (!cloud) return local;
  const cloudTime=cloud.updatedAt?.toMillis?.() || 0;
  if(local && local._dirty===undefined && Number(local.updatedAt)>cloudTime){local._dirty=true;local._conflict=true;return local;}
  if (local?._dirty) {
    if ((local._cloudRevision ?? local.revision ?? 0) !== (cloud.revision || 0)) { local._conflict = true; }
    return local;
  }
  const hydrated = {...cloud, updatedAt:cloud.updatedAt?.toMillis?.() || 0};
  saveDraft(hydrated, {synced:true});
  return hydrated;
}

export async function listGuestResponses(id) {
  const db = await dbOrNull();
  if (!db) throw new Error('Penyimpanan tamu belum tersedia.');
  const {collection,getDocs,query,orderBy,limit,startAfter} = await import('firebase/firestore');
  const all = async name => {
    const rows=[]; let cursor;
    do {
      const constraints=[orderBy('createdAt','desc'),limit(200)]; if(cursor) constraints.push(startAfter(cursor));
      const snap=await getDocs(query(collection(db,'invitations',id,name),...constraints));
      rows.push(...snap.docs.map(d=>({id:d.id,...d.data()}))); cursor=snap.size===200 ? snap.docs.at(-1) : null;
    } while(cursor);
    return rows;
  };
  const [rsvps,wishes]=await Promise.all([all('rsvps'),all('wishes')]);
  return {rsvps,wishes};
}

export async function moderateWish(invitationId,wishId,approved) {
  const db = await dbOrNull();
  const {doc,updateDoc} = await import('firebase/firestore');
  await updateDoc(doc(db,'invitations',invitationId,'wishes',wishId),{approved});
}
