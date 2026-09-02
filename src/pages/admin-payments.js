import { renderPage } from '../ui/app-shell.js';
import { requireAuthenticated } from '../services/access.js';
import { getAuthToken } from '../services/auth.js';
import { formatRupiah } from '../data/plans.js';
import { toast } from '../ui/overlays.js';

export function renderAdminPayments() {
  return requireAuthenticated(() => renderAdminPaymentsWorkspace(), '/admin/payments');
}

async function renderAdminPaymentsWorkspace() {
  renderPage(`
    <section class="admin-payments">
      <div class="container admin-payments__inner">
        <header class="admin-payments__head">
          <div><a href="/dashboard" data-link class="back-link">← Kembali ke dashboard</a><p class="eyebrow">Ruang Internal</p><h1>Review Pembayaran</h1><p>Aktivasi dilakukan hanya setelah bukti, nominal, dan pesanan diperiksa.</p></div>
          <button type="button" class="btn btn--ghost" data-reload>Segarkan</button>
        </header>
        <div class="admin-payments__notice"><span>i</span><p><strong>Kontrol dua tahap.</strong> Hasil AI adalah petunjuk, bukan keputusan pembayaran. Menyetujui transaksi membuat entitlement undangan aktif sesuai durasi paket.</p></div>
        <div data-admin-orders class="admin-payments__list"><div class="admin-loading"><span></span>Memuat antrean pembayaran…</div></div>
      </div>
    </section>
  `, (root) => wireAdminPayments(root));
}

async function wireAdminPayments(root) {
  const host = root.querySelector('[data-admin-orders]');
  const load = async () => {
    host.innerHTML = '<div class="admin-loading"><span></span>Memuat antrean pembayaran…</div>';
    try {
      const token = await getAuthToken();
      const response = await fetch('/api/admin/payments', { headers: { Authorization: `Bearer ${token}` } });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || 'Antrean belum dapat dimuat.');
      host.innerHTML = payload.orders?.length ? payload.orders.map(orderCard).join('') : emptyQueue();
      wireOrderActions(host, load);
    } catch (error) {
      host.innerHTML = `<div class="admin-denied"><span>⌁</span><h2>Akses review belum tersedia</h2><p>${escapeHtml(error.message || 'Masuk menggunakan akun admin yang telah diizinkan.')}</p></div>`;
    }
  };
  root.querySelector('[data-reload]').addEventListener('click', load);
  await load();
}

function orderCard(order) {
  const aiResult = order.status === 'ai_match' ? 'Nominal terbaca cocok oleh AI' : 'Perlu pengecekan manual';
  const date = new Date(order.updated_at || order.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' });
  return `
    <article class="admin-order" data-order="${escapeHtml(order.id)}">
      <div class="admin-order__top"><div><p class="eyebrow">${escapeHtml(order.variant_id.replaceAll('-', ' '))}</p><h2>${formatRupiah(order.expected_total)}</h2><p>${escapeHtml(order.id)} · ${escapeHtml(date)}</p></div><span class="admin-order__state admin-order__state--${escapeHtml(order.status)}">${escapeHtml(aiResult)}</span></div>
      <dl class="admin-order__facts"><div><dt>Durasi</dt><dd>${order.duration_months} bulan</dd></div><div><dt>Nominal terbaca</dt><dd>${order.ai_amount ? formatRupiah(order.ai_amount) : 'Tidak terbaca'}</dd></div><div><dt>Keyakinan AI</dt><dd>${Math.round(Number(order.ai_confidence || 0) * 100)}%</dd></div></dl>
      <p class="admin-order__summary">${escapeHtml(order.ai_summary || 'AI belum memberikan rangkuman.')}</p>
      <div class="admin-order__proof" data-proof-host><button type="button" class="btn btn--ghost btn--sm" data-view-proof="${escapeHtml(order.id)}">Lihat bukti privat</button></div>
      <div class="admin-order__actions"><button type="button" class="btn btn--ghost" data-review="reject" data-order-id="${escapeHtml(order.id)}">Tolak & Minta Ulang</button><button type="button" class="btn btn--primary" data-review="approve" data-order-id="${escapeHtml(order.id)}">Setujui & Aktifkan</button></div>
    </article>`;
}

function wireOrderActions(host, refresh) {
  host.querySelectorAll('[data-view-proof]').forEach((button) => button.addEventListener('click', async () => {
    const card = button.closest('[data-order]');
    const proofHost = card.querySelector('[data-proof-host]');
    button.disabled = true;
    button.textContent = 'Memuat bukti…';
    try {
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/payments/${encodeURIComponent(button.dataset.viewProof)}/proof`, { headers: { Authorization: `Bearer ${token}` } });
      if (!response.ok) throw new Error('Bukti tidak dapat dimuat.');
      const url = URL.createObjectURL(await response.blob());
      proofHost.innerHTML = `<img src="${url}" alt="Bukti pembayaran privat"/><button type="button" class="admin-order__hide-proof">Sembunyikan bukti</button>`;
      proofHost.querySelector('button').addEventListener('click', () => { URL.revokeObjectURL(url); proofHost.innerHTML = `<button type="button" class="btn btn--ghost btn--sm" data-view-proof="${escapeHtml(button.dataset.viewProof)}">Lihat bukti privat</button>`; proofHost.querySelector('button').addEventListener('click', () => button.click()); });
    } catch (error) {
      toast(error.message, { type: 'error' });
      button.disabled = false;
      button.textContent = 'Lihat bukti privat';
    }
  }));

  host.querySelectorAll('[data-review]').forEach((button) => button.addEventListener('click', async () => {
    const decision = button.dataset.review;
    const confirmation = decision === 'approve'
      ? 'Setujui transaksi ini dan aktifkan masa tayang undangan?'
      : 'Tolak transaksi ini dan tandai pengguna untuk mengunggah bukti baru?';
    if (!window.confirm(confirmation)) return;
    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Memproses…';
    try {
      const token = await getAuthToken();
      const response = await fetch(`/api/admin/payments/${encodeURIComponent(button.dataset.orderId)}/review`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'content-type': 'application/json' },
        body: JSON.stringify({ decision }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(payload.message || 'Review tidak dapat disimpan.');
      toast(decision === 'approve' ? 'Pembayaran disetujui dan entitlement aktif.' : 'Pembayaran ditolak. Pengguna dapat memperbarui bukti.', { type: 'success' });
      refresh();
    } catch (error) {
      button.disabled = false;
      button.textContent = original;
      toast(error.message, { type: 'error' });
    }
  }));
}

function emptyQueue() {
  return '<div class="admin-denied"><span>✓</span><h2>Antrean sudah bersih.</h2><p>Tidak ada pembayaran yang menunggu review saat ini.</p></div>';
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
