import { calculatePackage, UNIQUE_CODES } from '../data/plans.js';
import { getDraftOwner } from './draft-store.js';

const INDEX_KEY = 'env_payment_index';
const keyFor = (id) => `env_payment_${id}`;

function read(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback; } catch { return fallback; }
}

function write(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { return false; }
}

function secureIndex(max) {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] % max;
}

function newOrderId() {
  return `pay_${Date.now().toString(36)}_${crypto.randomUUID().replace(/-/g, '').slice(0, 10)}`;
}

export function listPaymentOrders() {
  const ids = read(INDEX_KEY, []);
  if (!Array.isArray(ids)) return [];
  return ids.map((id) => read(keyFor(id))).filter(o=>o && (!o.ownerUid || o.ownerUid === getDraftOwner())).sort((a, b) => b.updatedAt - a.updatedAt);
}

export function getPaymentOrder(id) {
  return read(keyFor(id));
}

export function getOrderForInvitation(invitationId) {
  return listPaymentOrders().find((order) => order.invitationId === invitationId) || null;
}

export function savePaymentOrder(order) {
  if (!order?.id) return false;
  const next = { ...order, ownerUid: order.ownerUid || getDraftOwner(), updatedAt: Date.now() };
  const saved = write(keyFor(next.id), next);
  if (saved) {
    const ids = read(INDEX_KEY, []).filter((id) => id !== next.id);
    write(INDEX_KEY, [next.id, ...ids]);
  }
  return saved;
}

export function ensurePaymentOrder(invitation, durationMonths = 3) {
  const existing = getOrderForInvitation(invitation.id);
  if (existing?.variantId === invitation.design?.variantId) {
    if (existing.total === 0) {
      const activated = invitation.freeActivatedAt?.toMillis?.() || invitation.freeActivatedAt?.seconds*1000;
      existing.expiresAt=activated ? activated+7*86400000 : null;
      existing.status=existing.expiresAt && existing.expiresAt<=Date.now() ? 'expired' : 'active';
      savePaymentOrder(existing);
    }
    return existing;
  }
  const pkg = calculatePackage(invitation.design?.variantId, durationMonths);
  if (!pkg) return null;
  const uniqueCode = pkg.paid ? UNIQUE_CODES[secureIndex(UNIQUE_CODES.length)] : 0;
  const now = Date.now();
  const order = {
    id: newOrderId(),
    invitationId: invitation.id,
    templateId: invitation.design?.templateId,
    variantId: invitation.design?.variantId,
    durationMonths: pkg.durationMonths,
    basePrice: pkg.basePrice,
    extensionFee: pkg.extensionFee,
    subtotal: pkg.subtotal,
    uniqueCode,
    total: pkg.subtotal + uniqueCode,
    status: pkg.paid ? 'draft' : 'active',
    verification: pkg.paid ? null : { method: 'free-plan', result: 'activated' },
    createdAt: now,
    updatedAt: now,
    expiresAt: null,
  };
  savePaymentOrder(order);
  return order;
}

export function updatePaymentDuration(order, months) {
  if (!order || order.status !== 'draft') return order;
  const pkg = calculatePackage(order.variantId, months);
  if (!pkg?.paid) return order;
  const next = {
    ...order,
    durationMonths: pkg.durationMonths,
    basePrice: pkg.basePrice,
    extensionFee: pkg.extensionFee,
    subtotal: pkg.subtotal,
    total: pkg.subtotal + order.uniqueCode,
  };
  savePaymentOrder(next);
  return next;
}

export function paymentStatusLabel(status) {
  return ({
    draft: 'Belum dibayar',
    uploading: 'Mengunggah bukti',
    pending_review: 'Menunggu review',
    ai_match: 'Bukti terbaca cocok',
    active: 'Aktif',
    rejected: 'Perlu diperbaiki',
    expired: 'Kedaluwarsa',
    activation_pending:'Menyelesaikan aktivasi',
  })[status] || status;
}

const PROOF_DB = 'env_payment_proofs';
const PROOF_STORE = 'proofs';

function openProofDb() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(PROOF_DB, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(PROOF_STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePaymentProofDraft(orderId, file) {
  const db = await openProofDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(PROOF_STORE, 'readwrite');
    tx.objectStore(PROOF_STORE).put({ file, name: file.name, type: file.type, savedAt: Date.now() }, orderId);
    tx.oncomplete = () => resolve(true);
    tx.onerror = () => reject(tx.error);
  });
}

export async function getPaymentProofDraft(orderId) {
  const db = await openProofDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(PROOF_STORE, 'readonly').objectStore(PROOF_STORE).get(orderId);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function deletePaymentProofDraft(orderId) {
 const db=await openProofDb();return new Promise((resolve,reject)=>{const tx=db.transaction(PROOF_STORE,'readwrite');tx.objectStore(PROOF_STORE).delete(orderId);tx.oncomplete=()=>{db.close();resolve(true);};tx.onerror=()=>{db.close();reject(tx.error);};});

}
