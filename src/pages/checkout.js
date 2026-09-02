import { renderPage } from '../ui/app-shell.js';
import { requireAuthenticated } from '../services/access.js';
import { loadDraft } from '../services/draft-store.js';
import {
  ensurePaymentOrder,
  updatePaymentDuration,
  savePaymentOrder,
  savePaymentProofDraft,
  getPaymentProofDraft,
  paymentStatusLabel,
} from '../services/payment-store.js';
import { configuredStaticQris, createDynamicQris } from '../services/qris.js';
import { getTemplate } from '../data/templates.js';
import { getVariant } from '../data/variants.js';
import { formatRupiah } from '../data/plans.js';
import { getAuthToken } from '../services/auth.js';
import { navigate } from '../router.js';
import { toast } from '../ui/overlays.js';

export function renderCheckout(invitationId) {
  return requireAuthenticated(() => renderCheckoutWorkspace(invitationId), `/checkout/${invitationId}`);
}

async function renderCheckoutWorkspace(invitationId) {
  const invitation = loadDraft(invitationId);
  if (!invitation) {
    navigate('/dashboard/invitations', { replace: true });
    return;
  }

  let order = ensurePaymentOrder(invitation);
  const template = getTemplate(invitation.design?.templateId);
  const variant = getVariant(invitation.design?.variantId);
  const names = [invitation.content?.groom?.nickname || invitation.content?.groom?.name, invitation.content?.bride?.nickname || invitation.content?.bride?.name]
    .filter(Boolean).join(' & ') || 'Undangan baru';

  const paint = () => {
    renderPage(checkoutMarkup({ invitation, order, template, variant, names }), wire);
    if (order.total > 0) paintQr(order);
  };

  const wire = async (root) => {
    root.querySelectorAll('[data-duration]').forEach((button) => {
      button.addEventListener('click', () => {
        order = updatePaymentDuration(order, Number(button.dataset.duration));
        paint();
      });
    });

    const input = root.querySelector('[data-proof-input]');
    const preview = root.querySelector('[data-proof-preview]');
    const submit = root.querySelector('[data-proof-submit]');
    let proofFile = null;

    const restored = await getPaymentProofDraft(order.id).catch(() => null);
    if (restored?.file) {
      proofFile = restored.file;
      showProofPreview(preview, proofFile, 'Bukti tersimpan, siap dilanjutkan.');
    }

    input?.addEventListener('change', async () => {
      const file = input.files?.[0];
      if (!file) return;
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024) {
        toast('Gunakan JPG, PNG, atau WebP maksimal 8 MB.', { type: 'error' });
        input.value = '';
        return;
      }
      proofFile = file;
      await savePaymentProofDraft(order.id, file).catch(() => null);
      showProofPreview(preview, file, 'Aman tersimpan sebagai draft di perangkat ini.');
    });

    submit?.addEventListener('click', async () => {
      if (!proofFile) {
        toast('Pilih bukti pembayaran terlebih dahulu.', { type: 'error' });
        return;
      }
      submit.disabled = true;
      submit.textContent = 'Memeriksa bukti…';
      order = { ...order, status: 'uploading' };
      savePaymentOrder(order);

      try {
        const token = await getAuthToken();
        const body = new FormData();
        body.set('proof', proofFile, proofFile.name || 'proof.jpg');
        body.set('orderId', order.id);
        body.set('invitationId', order.invitationId);
        body.set('variantId', order.variantId);
        body.set('durationMonths', String(order.durationMonths));
        body.set('uniqueCode', String(order.uniqueCode));
        const response = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body,
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(result.message || 'Bukti belum dapat diperiksa.');
        order = {
          ...order,
          status: result.status || 'pending_review',
          verification: result.verification || null,
          proofUploadedAt: Date.now(),
        };
        savePaymentOrder(order);
        toast('Bukti berhasil dikirim dan masuk antrean review.', { type: 'success' });
        paint();
      } catch (error) {
        order = { ...order, status: 'draft', lastError: error.message };
        savePaymentOrder(order);
        submit.disabled = false;
        submit.textContent = 'Kirim & Periksa Bukti';
        toast(error.message || 'Bukti belum dapat dikirim. Draft tetap tersimpan.', { type: 'error' });
      }
    });
  };

  paint();
}

function checkoutMarkup({ invitation, order, template, variant, names }) {
  const isFree = order.total === 0;
  const isSubmitted = ['pending_review', 'ai_match', 'active'].includes(order.status);
  return `
    <section class="checkout-page">
      <div class="container checkout-shell">
        <header class="checkout-head">
          <a href="/builder/${invitation.id}" data-link class="back-link">← Kembali ke editor</a>
          <p class="eyebrow">Aktivasi Undangan</p>
          <h1>${isFree ? 'Mulai dengan Paket Gratis' : 'Satu langkah lagi untuk tayang'}</h1>
          <p>Checkout dibuat tenang dan transparan. Draft pembayaran otomatis disimpan di perangkat ini.</p>
        </header>

        <div class="checkout-grid">
          <main class="checkout-main">
            ${isFree ? freeActivation(order, invitation) : paymentPanel(order, isSubmitted)}
          </main>
          <aside class="order-card">
            <div class="order-card__art order-card__art--${template?.id || 'amora'}">
              <span>${escapeHtml(names)}</span>
            </div>
            <div class="order-card__body">
              <p class="eyebrow">Ringkasan Pesanan</p>
              <h2>${template?.name || 'Template'} <small>${variant?.name || ''}</small></h2>
              ${!isFree ? durationPicker(order) : '<p class="order-card__free">Gratis · aktif 7 hari</p>'}
              <dl class="order-summary">
                <div><dt>Harga desain</dt><dd>${formatRupiah(order.basePrice)}</dd></div>
                ${order.extensionFee ? `<div><dt>Tambahan 6 bulan</dt><dd>${formatRupiah(order.extensionFee)}</dd></div>` : ''}
                ${order.uniqueCode ? `<div><dt>Kode unik</dt><dd>${formatRupiah(order.uniqueCode)}</dd></div>` : ''}
                <div class="order-summary__total"><dt>Total</dt><dd>${formatRupiah(order.total)}</dd></div>
              </dl>
              ${order.uniqueCode ? '<p class="order-card__note">Bayar hingga 3 digit terakhir agar transaksi mudah dicocokkan.</p>' : ''}
              <div class="order-secure"><span>✓</span><p><strong>Draft terlindungi</strong><br/>Editor dan checkout bisa dilanjutkan setelah tab tertutup.</p></div>
            </div>
          </aside>
        </div>
      </div>
    </section>`;
}

function durationPicker(order) {
  return `
    <div class="duration-picker" aria-label="Pilih durasi tayang">
      <button type="button" class="duration-option ${order.durationMonths === 3 ? 'is-active' : ''}" data-duration="3">
        <span>3 bulan</span><small>Sudah termasuk</small>
      </button>
      <button type="button" class="duration-option ${order.durationMonths === 6 ? 'is-active' : ''}" data-duration="6">
        <span>6 bulan</span><small>+ Rp15.000</small>
      </button>
    </div>`;
}

function freeActivation(order, invitation) {
  return `
    <article class="checkout-success">
      <span class="checkout-success__icon">✓</span>
      <p class="eyebrow">Paket Aktif</p>
      <h2>Gratis untuk 7 hari pertama.</h2>
      <p>Undangan ini dapat dipublikasikan tanpa pembayaran. Masa tayang dimulai hari ini dan berakhir pada ${formatDate(order.expiresAt)}.</p>
      <div class="checkout-success__actions">
        <a href="/builder/${invitation.id}" data-link class="btn btn--primary btn--lg">Kembali & Publikasikan</a>
        <a href="/dashboard" data-link class="btn btn--ghost btn--lg">Lihat Dashboard</a>
      </div>
    </article>`;
}

function paymentPanel(order, submitted) {
  if (submitted) {
    return `
      <article class="checkout-success checkout-success--pending">
        <span class="checkout-success__icon">⌁</span>
        <p class="eyebrow">${paymentStatusLabel(order.status)}</p>
        <h2>Bukti pembayaran sudah kami terima.</h2>
        <p>AI membantu membaca nominal dan detail transaksi. Aktivasi akhir tetap melalui review agar pembayaran kalian tidak salah cocok.</p>
        ${order.verification?.summary ? `<div class="ai-review"><strong>Hasil pemeriksaan awal</strong><p>${escapeHtml(order.verification.summary)}</p></div>` : ''}
        <div class="checkout-success__actions"><a href="/dashboard/payments" data-link class="btn btn--primary btn--lg">Pantau di Dashboard</a></div>
      </article>`;
  }
  const configured = Boolean(configuredStaticQris());
  return `
    <section class="pay-panel">
      <div class="pay-panel__intro">
        <p class="pay-panel__step">01</p><div><h2>Scan QRIS Dinamis</h2><p>Nominal dan kode unik sudah tertanam. Bisa dibayar dari aplikasi bank atau dompet digital yang mendukung QRIS.</p></div>
      </div>
      ${configured ? `
        <div class="qris-card">
          <div class="qris-card__brand"><strong>QRIS</strong><span>NMID & merchant mengikuti QRIS terdaftar</span></div>
          <div class="qris-card__canvas" data-qris aria-label="QRIS pembayaran"></div>
          <p>Bayar tepat <strong>${formatRupiah(order.total)}</strong></p>
          <small>Order ${order.id}</small>
        </div>` : `
        <div class="checkout-config-notice"><strong>QRIS merchant belum aktif.</strong><p>Tambahkan payload statis ke VITE_QRIS_STATIC_PAYLOAD. Draft checkout ini tetap tersimpan.</p></div>`}

      <div class="pay-panel__intro pay-panel__intro--proof">
        <p class="pay-panel__step">02</p><div><h2>Unggah Bukti Bayar</h2><p>Gunakan screenshot yang menampilkan nominal, status berhasil, dan waktu transaksi dengan jelas.</p></div>
      </div>
      <label class="proof-drop ${configured ? '' : 'is-disabled'}">
        <input type="file" accept="image/jpeg,image/png,image/webp" data-proof-input ${configured ? '' : 'disabled'}/>
        <span class="proof-drop__icon">↥</span><strong>Pilih screenshot pembayaran</strong><small>JPG, PNG, atau WebP · maks. 8 MB</small>
      </label>
      <div class="proof-preview" data-proof-preview hidden></div>
      <div class="ai-assurance"><span>✦</span><p><strong>Pemeriksaan awal dibantu AI</strong><br/>AI membaca bukti untuk mencocokkan nominal, tetapi tidak pernah meminta PIN, OTP, atau password.</p></div>
      <button type="button" class="btn btn--primary btn--lg proof-submit" data-proof-submit ${configured ? '' : 'disabled'}>Kirim & Periksa Bukti</button>
    </section>`;
}

async function paintQr(order) {
  const holder = document.querySelector('[data-qris]');
  if (!holder) return;
  try {
    const { default: QRCode } = await import('qrcode');
    const payload = createDynamicQris(configuredStaticQris(), order.total, order.id);
    const dataUrl = await QRCode.toDataURL(payload, { width: 320, margin: 2, errorCorrectionLevel: 'M', color: { dark: '#171411', light: '#ffffff' } });
    holder.innerHTML = `<img src="${dataUrl}" alt="QRIS senilai ${formatRupiah(order.total)}"/>`;
  } catch {
    holder.innerHTML = '<p class="qris-error">QRIS belum dapat dibuat. Periksa payload merchant.</p>';
  }
}

function showProofPreview(holder, file, note) {
  if (!holder) return;
  const url = URL.createObjectURL(file);
  holder.hidden = false;
  holder.innerHTML = `<img src="${url}" alt="Pratinjau bukti pembayaran"/><div><strong>${escapeHtml(file.name || 'Bukti pembayaran')}</strong><p>${note}</p></div>`;
}

function formatDate(value) {
  return new Date(value).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
}
