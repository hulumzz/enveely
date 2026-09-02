import { renderPage } from '../ui/app-shell.js';
import { listDrafts, deleteDraft, saveDraft } from '../services/draft-store.js';
import { requireAuthenticated } from '../services/access.js';
import { listPaymentOrders, getOrderForInvitation, paymentStatusLabel } from '../services/payment-store.js';
import { templateFamilies } from '../data/templates.js';
import { getVariantsFor } from '../data/variants.js';
import { getFamilyPriceRange, formatRupiah } from '../data/plans.js';
import { logout } from '../services/auth.js';
import { openModal, toast } from '../ui/overlays.js';
import { navigate } from '../router.js';
import { listCloudDrafts } from '../services/firestore-data.js';
import { refreshPaymentOrder } from '../services/payment-api.js';

let cloudHydrated = false;
let paymentsHydrated = false;

const navItems = [
  ['overview', 'Dashboard', '⌂'],
  ['invitations', 'Undangan Saya', '◇'],
  ['templates', 'Template Undangan', '✦'],
  ['payments', 'Pembayaran', '▣'],
  ['profile', 'Profil', '○'],
];

export function renderDashboard(section = 'overview') {
  const active = navItems.some(([id]) => id === section) ? section : 'overview';
  return requireAuthenticated((user) => renderDashboardWorkspace(user, active), `/dashboard${active === 'overview' ? '' : `/${active}`}`);
}

function renderDashboardWorkspace(user, section) {
  const drafts = listDrafts();
  const orders = listPaymentOrders();
  renderPage(`
    <section class="account-page">
      <div class="container account-shell">
        <aside class="account-sidebar">
          <a href="/dashboard" data-link class="account-brand">EN<span>VEELY</span><small>Studio</small></a>
          <nav class="account-nav" aria-label="Navigasi dashboard">
            ${navItems.map(([id, label, mark]) => `<a href="${id === 'overview' ? '/dashboard' : `/dashboard/${id}`}" data-link class="${section === id ? 'is-active' : ''}"><span>${mark}</span>${label}</a>`).join('')}
          </nav>
          <div class="account-sidebar__help"><span>✦</span><strong>Butuh bantuan?</strong><p>Draft kalian aman tersimpan. Tim kami siap membantu sampai undangan tayang.</p><a href="mailto:hello@enveely.id">Hubungi kami</a></div>
        </aside>

        <main class="account-content">
          <header class="account-topbar">
            <div><p>${greeting()},</p><h1>${escapeHtml(firstName(user.displayName || user.email))}</h1></div>
            <div class="account-topbar__actions"><a href="/create" data-link class="btn btn--primary">+ Buat Undangan</a><span class="account-avatar">${escapeHtml(firstName(user.displayName || user.email).charAt(0).toUpperCase())}</span></div>
          </header>
          ${renderSection(section, { user, drafts, orders })}
        </main>
      </div>
    </section>
  `, (root) => {
    wireDashboard(root);
    if (!cloudHydrated) {
      cloudHydrated = true;
      listCloudDrafts().then((cloudDrafts) => {
        let changed = false;
        cloudDrafts.forEach((cloud) => {
          const local = drafts.find((item) => item.id === cloud.id);
          const cloudTime = cloud.updatedAt?.toMillis?.() || Number(cloud.updatedAt) || 0;
          if (!local || cloudTime > Number(local.updatedAt || 0)) {
            saveDraft({ ...cloud, updatedAt: cloudTime || Date.now() });
            changed = true;
          }
        });
        if (changed) renderDashboard(section);
      }).catch(() => null);
    }
    if (!paymentsHydrated && orders.some((order) => order.total > 0 && order.status !== 'active')) {
      paymentsHydrated = true;
      Promise.all(orders.map((order) => refreshPaymentOrder(order))).then((fresh) => {
        if (fresh.some((order, index) => order.status !== orders[index]?.status)) renderDashboard(section);
      }).catch(() => null);
    }
  });
}

function renderSection(section, ctx) {
  if (section === 'invitations') return invitationsView(ctx);
  if (section === 'templates') return templatesView();
  if (section === 'payments') return paymentsView(ctx);
  if (section === 'profile') return profileView(ctx.user);
  return overviewView(ctx);
}

function overviewView({ drafts, orders }) {
  const active = orders.filter((order) => order.status === 'active' && (!order.expiresAt || order.expiresAt > Date.now())).length;
  const pending = orders.filter((order) => ['pending_review', 'ai_match', 'uploading'].includes(order.status)).length;
  const latest = drafts.slice(0, 3);
  return `
    <section class="dash-view">
      <div class="dash-welcome">
        <div><p class="eyebrow">Ruang Karya Kalian</p><h2>Semua cerita, tersusun rapi.</h2><p>Lengkapi undangan, pantau pembayaran, dan lihat masa tayang dari satu tempat.</p></div>
        <div class="dash-welcome__ornament" aria-hidden="true"><span>e</span></div>
      </div>
      <div class="dash-stats">
        ${statCard('Total undangan', drafts.length, 'Draft dan undangan aktif', '01')}
        ${statCard('Sedang tayang', active, 'Tautan aktif dibuka tamu', '02')}
        ${statCard('Menunggu review', pending, 'Pemeriksaan pembayaran', '03')}
      </div>
      <div class="dash-section-head"><div><p class="eyebrow">Terakhir Dikerjakan</p><h2>Lanjutkan undanganmu</h2></div><a href="/dashboard/invitations" data-link>Lihat semuanya →</a></div>
      ${latest.length ? `<div class="dash-invites">${latest.map(invitationCard).join('')}</div>` : emptyInvitations()}
      <div class="dash-two-col">
        <article class="dash-guide"><p class="eyebrow">Checklist Tayang</p><h3>Pastikan momen pentingnya lengkap.</h3><ul><li><span>1</span>Nama dan foto mempelai</li><li><span>2</span>Detail acara dan lokasi</li><li><span>3</span>Aktivasi paket & publikasi</li></ul></article>
        <article class="dash-featured"><div><p class="eyebrow">Pilihan Minggu Ini</p><h3>Amora Garden</h3><p>Nuansa floral hangat dengan komposisi potret lengkung.</p><a href="/templates/amora" data-link class="btn btn--ghost btn--sm">Lihat desain</a></div><span class="dash-featured__flower">❀</span></article>
      </div>
    </section>`;
}

function invitationsView({ drafts }) {
  return `
    <section class="dash-view">
      <header class="dash-page-head"><div><p class="eyebrow">Koleksi Pribadi</p><h2>Undangan Saya</h2><p>Setiap perubahan tersimpan otomatis. Lanjutkan dari tahap terakhir kapan saja.</p></div><a href="/create" data-link class="btn btn--primary">+ Undangan Baru</a></header>
      <div class="dash-filterbar"><span>${drafts.length} undangan</span><div><button class="is-active">Semua</button><button>Draft</button><button>Tayang</button></div></div>
      ${drafts.length ? `<div class="dash-invites dash-invites--all">${drafts.map(invitationCard).join('')}</div>` : emptyInvitations()}
    </section>`;
}

function templatesView() {
  return `
    <section class="dash-view">
      <header class="dash-page-head"><div><p class="eyebrow">Template Undangan</p><h2>Temukan karakter kalian.</h2><p>Mulai dari desain gratis 7 hari hingga koleksi editorial premium.</p></div><a href="/templates" data-link class="btn btn--ghost">Buka galeri lengkap</a></header>
      <div class="account-template-grid">
        ${templateFamilies.map((template, index) => {
          const variants = getVariantsFor(template.id);
          const range = getFamilyPriceRange(template.id);
          return `<article class="account-template account-template--${template.id}"><div class="account-template__visual"><span>${String(index + 1).padStart(2, '0')}</span><strong>${template.name}</strong><i></i></div><div class="account-template__body"><p>${template.moodLabel}</p><h3>${template.name}</h3><div><span>${variants.length} variasi</span><strong>${range?.min === 0 ? 'Mulai gratis' : `Mulai ${formatRupiah(range?.min)}`}</strong></div><a href="/templates/${template.id}" data-link>Jelajahi desain →</a></div></article>`;
        }).join('')}
      </div>
    </section>`;
}

function paymentsView({ orders, drafts }) {
  return `
    <section class="dash-view">
      <header class="dash-page-head"><div><p class="eyebrow">Riwayat Transaksi</p><h2>Pembayaran</h2><p>Pantau checkout, hasil pemeriksaan bukti, dan masa aktif undangan.</p></div></header>
      ${orders.length ? `<div class="payment-list">${orders.map((order) => paymentRow(order, drafts)).join('')}</div>` : `
        <div class="dash-empty dash-empty--payment"><span>▣</span><h3>Belum ada transaksi</h3><p>Pesanan akan muncul otomatis setelah kalian mengaktifkan desain dari editor.</p><a href="/dashboard/invitations" data-link class="btn btn--primary">Lihat Undangan</a></div>`}
      <article class="payment-help"><div><span>i</span><p><strong>Kenapa pembayaran direview?</strong><br/>AI membantu membaca bukti, lalu hasilnya diperiksa agar nominal dan pesanan tidak tertukar.</p></div><p>Kami tidak pernah meminta OTP, PIN, atau password.</p></article>
    </section>`;
}

function profileView(user) {
  return `
    <section class="dash-view">
      <header class="dash-page-head"><div><p class="eyebrow">Akun & Keamanan</p><h2>Profil</h2><p>Identitas akun digunakan untuk menjaga ownership undangan dan riwayat pembayaran.</p></div></header>
      <div class="profile-grid">
        <article class="profile-card profile-card--identity"><div class="profile-avatar">${escapeHtml(firstName(user.displayName || user.email).charAt(0).toUpperCase())}</div><h3>${escapeHtml(user.displayName || 'Pengguna Enveely')}</h3><p>${escapeHtml(user.email)}</p><span>Akun terverifikasi Firebase</span></article>
        <article class="profile-card"><p class="eyebrow">Informasi Akun</p><label><span>Nama tampilan</span><input value="${escapeHtml(user.displayName || '')}" disabled/></label><label><span>Email</span><input value="${escapeHtml(user.email || '')}" disabled/></label><p class="profile-hint">Perubahan nama dan email akan tersedia setelah profil cloud diaktifkan.</p></article>
        <article class="profile-card"><p class="eyebrow">Keamanan</p><h3>Sesi dan akses</h3><p class="profile-copy">Keluar jika menggunakan perangkat bersama. Draft yang sudah tersinkron tetap terhubung ke akun kalian.</p><button type="button" class="btn btn--ghost" data-logout>Keluar dari akun</button></article>
      </div>
    </section>`;
}

function invitationCard(draft) {
  const names = [draft.content?.groom?.nickname || draft.content?.groom?.name, draft.content?.bride?.nickname || draft.content?.bride?.name].filter(Boolean).join(' & ') || 'Undangan tanpa nama';
  const order = getOrderForInvitation(draft.id);
  const status = order?.status === 'active' ? 'Tayang aktif' : order ? paymentStatusLabel(order.status) : 'Draft';
  return `<article class="invite-card"><div class="invite-card__cover invite-card__cover--${draft.design?.templateId || 'amora'}"><span>${escapeHtml(names)}</span><i>${escapeHtml((draft.design?.templateId || 'Amora').toUpperCase())}</i></div><div class="invite-card__body"><div class="invite-card__status"><span class="status-dot status-dot--${order?.status || 'draft'}"></span>${escapeHtml(status)}</div><h3>${escapeHtml(names)}</h3><p>${formatUpdated(draft.updatedAt)}</p><div class="invite-card__actions"><a href="/builder/${draft.id}" data-link class="btn btn--primary btn--sm">Lanjut Edit</a>${order?.status !== 'active' ? `<a href="/checkout/${draft.id}" data-link class="btn btn--ghost btn--sm">Aktifkan</a>` : `<a href="/invite/${draft.id}" data-link class="btn btn--ghost btn--sm">Lihat</a>`}<button type="button" data-delete="${draft.id}" aria-label="Hapus undangan">⋯</button></div></div></article>`;
}

function paymentRow(order, drafts) {
  const draft = drafts.find((item) => item.id === order.invitationId);
  const names = [draft?.content?.groom?.nickname || draft?.content?.groom?.name, draft?.content?.bride?.nickname || draft?.content?.bride?.name].filter(Boolean).join(' & ') || 'Undangan';
  return `<article class="payment-row"><div class="payment-row__icon">QR</div><div class="payment-row__main"><span>${escapeHtml(names)}</span><h3>${escapeHtml(order.variantId.replaceAll('-', ' '))}</h3><p>${new Date(order.updatedAt).toLocaleDateString('id-ID', { day:'numeric', month:'long', year:'numeric' })} · ${order.durationMonths ? `${order.durationMonths} bulan` : '7 hari'}</p></div><div class="payment-row__amount"><strong>${formatRupiah(order.total)}</strong><span class="payment-pill payment-pill--${order.status}">${escapeHtml(paymentStatusLabel(order.status))}</span></div>${order.status === 'draft' ? `<a href="/checkout/${order.invitationId}" data-link class="btn btn--ghost btn--sm">Lanjutkan</a>` : ''}</article>`;
}

function statCard(label, value, hint, num) {
  return `<article class="dash-stat"><span>${num}</span><p>${label}</p><strong>${value}</strong><small>${hint}</small></article>`;
}

function emptyInvitations() {
  return `<div class="dash-empty"><span>◇</span><h3>Belum ada undangan</h3><p>Pilih desain yang terasa paling kalian, lalu mulai dengan nama dan tanggal.</p><a href="/create" data-link class="btn btn--primary">Buat Undangan Pertama</a></div>`;
}

function wireDashboard(root) {
  root.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => {
    openModal({ title: 'Hapus draft ini?', body: '<p>Draft akan dihapus permanen dari perangkat ini. Riwayat pembayaran tidak ikut dihapus.</p>', actions: [
      { label: 'Batal' },
      { label: 'Hapus Draft', kind: 'primary', onClick: () => { deleteDraft(button.dataset.delete); toast('Draft berhasil dihapus.', { type: 'success' }); renderDashboard('invitations'); } },
    ] });
  }));
  root.querySelector('[data-logout]')?.addEventListener('click', async () => { await logout(); navigate('/'); });
}

function greeting() {
  const hour = new Date().getHours();
  return hour < 11 ? 'Selamat pagi' : hour < 15 ? 'Selamat siang' : hour < 18 ? 'Selamat sore' : 'Selamat malam';
}
function firstName(value) { return String(value || 'Sahabat').split(/[\s@]/)[0] || 'Sahabat'; }
function formatUpdated(value) { return `Diperbarui ${new Date(value || Date.now()).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}`; }
function escapeHtml(value) { return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]); }
