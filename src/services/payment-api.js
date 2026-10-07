import { getAuthToken } from './auth.js';
import { savePaymentOrder } from './payment-store.js';

export async function listCloudPaymentOrders() {
  const token=await getAuthToken();
  if(!token)return [];
  const response=await fetch('/api/payments',{headers:{authorization:`Bearer ${token}`}});
  if(!response.ok)throw new Error('Riwayat pembayaran belum dapat dimuat.');
  const {orders=[]}=await response.json();
  orders.forEach(savePaymentOrder);
  return orders;
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
