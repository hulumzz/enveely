import { getAuthToken } from './auth.js';
import { savePaymentOrder } from './payment-store.js';

export async function listCloudPaymentOrders() {
  const token=await getAuthToken();
  if(!token)return [];
  const all=[];let cursor='';
  do {const response=await fetch(`/api/payments?cursor=${encodeURIComponent(cursor)}`,{headers:{authorization:`Bearer ${token}`}});if(!response.ok)throw new Error('Riwayat pembayaran belum dapat dimuat.');const result=await response.json();all.push(...(result.orders||[]));cursor=result.cursor||'';}while(cursor);
  all.forEach(savePaymentOrder);return all;
}

export async function refreshPaymentOrder(order) {
  if (!order?.id || order.total === 0) return order;
  const token = await getAuthToken();
  if (!token) return order;
  const response = await fetch(`/api/payments/status/${encodeURIComponent(order.id)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) return order;
  const remote = await response.json();
  const next = {
    ...order,
    status: remote.status || order.status,
    expiresAt: remote.expiresAt || order.expiresAt,
    reviewedAt: remote.reviewedAt || order.reviewedAt,
    verification: remote.verification || order.verification,
  };
  savePaymentOrder(next);
  return next;
}

export async function resolvePaymentOrder(invitation,durationMonths=3) {
 const {calculatePackage}=await import('../data/plans.js');
 if(!calculatePackage(invitation.design?.variantId)?.paid) {
   const {ensurePaymentOrder}=await import('./payment-store.js');return ensurePaymentOrder(invitation);
 }
 const token=await getAuthToken();
 const response=await fetch('/api/payments',{method:'POST',headers:{authorization:`Bearer ${token}`,'content-type':'application/json'},body:JSON.stringify({invitationId:invitation.id,durationMonths})});
 const result=await response.json();if(!response.ok)throw new Error(result.message||'Pesanan belum dapat dibuat.');
 savePaymentOrder(result.order);return result.order;
}
