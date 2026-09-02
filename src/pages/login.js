import { renderPage } from '../ui/app-shell.js';
import { loginWithEmail, registerWithEmail, loginWithGoogle, sendPasswordReset } from '../services/auth.js';
import { isFirebaseConfigured } from '../services/firebase.js';
import { icon } from '../core/icons.js';
import { navigate } from '../router.js';
import { resolveSafeNext } from '../services/access.js';

export function renderLogin(_params, query = new URLSearchParams()) {
  const mode = query.get('mode') === 'register' ? 'register' : 'login';
  const next = resolveSafeNext(query);

  renderPage(
    `
    <section class="auth">
      <div class="auth__panel">
        <div class="auth__visual" aria-hidden="true">
          <img src="/demo/melati-pengantin.webp" alt="" loading="lazy"/>
          <div class="auth__visual-overlay">
            <p class="auth__quote">"Undangan yang indah adalah cara pertama menghormati orang-orang yang kita cinta."</p>
          </div>
        </div>

        <div class="auth__form-wrap">
          <header class="auth__head">
            <h1 data-auth-title>Masuk ke Enveely</h1>
            <p class="muted" data-auth-sub>Lanjutkan merancang undangan kalian.</p>
          </header>

          ${isFirebaseConfigured() ? '' : `
          <div class="auth-notice">
            <strong>Konfigurasi akun dibutuhkan.</strong>
            <p>Firebase Auth belum dikonfigurasi. Isi konfigurasi Firebase untuk mengaktifkan pendaftaran, editor, dashboard, dan pembayaran.</p>
          </div>`}

          <button type="button" class="btn btn--google" data-google>
            ${icon('google', { size: 18 })}
            <span>Lanjut dengan Google</span>
          </button>

          <div class="auth__divider"><span>atau lewat email</span></div>

          <form class="auth-form" data-auth-form novalidate>
            ${mode === 'register' ? `
            <label class="fld-ui">
              <span>Nama</span>
              <input name="name" autocomplete="name" placeholder="Nama tampilan"/>
            </label>` : ''}
            <label class="fld-ui">
              <span>Email</span>
              <input type="email" name="email" required autocomplete="email" placeholder="nama@email.com"/>
            </label>
            <label class="fld-ui">
              <span>Password</span>
              <input type="password" name="password" required minlength="6" autocomplete="${mode === 'register' ? 'new-password' : 'current-password'}" placeholder="Minimal 6 karakter"/>
            </label>
            ${mode === 'login' ? '<button type="button" class="auth-forgot" data-forgot>Lupa password?</button>' : ''}

            <p class="form-error" data-error role="alert"></p>

            <button type="submit" class="btn btn--primary btn--lg auth-submit" data-submit>
              ${mode === 'register' ? 'Buat Akun' : 'Masuk'}
            </button>
          </form>

          <p class="auth-switch">
            <span data-switch-label>${mode === 'register' ? 'Sudah punya akun?' : 'Belum punya akun?'}</span>
            <a href="/login${mode === 'register' ? `?next=${encodeURIComponent(next)}` : `?mode=register&next=${encodeURIComponent(next)}`}" data-link data-switch-link>
              ${mode === 'register' ? 'Masuk' : 'Daftar gratis'}
            </a>
          </p>

          <p class="auth-fineprint">Dengan melanjutkan, kamu setuju bahwa undangan yang dipublikasikan dapat diakses publik melalui tautannya.</p>
        </div>
      </div>
    </section>
    `,
    (root) => {
      const form = root.querySelector('[data-auth-form]');
      const errorEl = root.querySelector('[data-error]');
      const submitBtn = root.querySelector('[data-submit]');
      const googleBtn = root.querySelector('[data-google]');

      const setLoading = (busy, label) => {
        submitBtn.disabled = busy;
        googleBtn.disabled = busy;
        if (label) submitBtn.textContent = label;
      };

      const handleResult = (res) => {
        if (res.ok) {
          navigate(next);
          return;
        }
        if (res.reason === 'unconfigured') {
          errorEl.textContent = 'Autentikasi belum dikonfigurasi. Isi VITE_FIREBASE_* di .env.local lalu muat ulang.';
          return;
        }
        errorEl.textContent = res.message || 'Terjadi kesalahan.';
        setLoading(false, mode === 'register' ? 'Buat Akun' : 'Masuk');
      };

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorEl.textContent = '';
        const data = Object.fromEntries(new FormData(form).entries());
        if (!data.email || !data.password || data.password.length < 6) {
          errorEl.textContent = 'Lengkapi email dan password (minimal 6 karakter).';
          return;
        }
        setLoading(true, 'Memproses...');
        const res = mode === 'register'
          ? await registerWithEmail(data.email, data.password, data.name)
          : await loginWithEmail(data.email, data.password);
        handleResult(res);
      });

      googleBtn.addEventListener('click', async () => {
        errorEl.textContent = '';
        setLoading(true, 'Membuka Google...');
        const res = await loginWithGoogle();
        handleResult(res);
        setLoading(false, mode === 'register' ? 'Buat Akun' : 'Masuk');
      });

      root.querySelector('[data-forgot]')?.addEventListener('click', async () => {
        const email = form.elements.email.value.trim();
        if (!email) {
          errorEl.textContent = 'Isi email terlebih dahulu agar kami bisa mengirim tautan reset.';
          form.elements.email.focus();
          return;
        }
        const result = await sendPasswordReset(email);
        errorEl.classList.toggle('is-success', result.ok);
        errorEl.textContent = result.ok
          ? 'Tautan reset password sudah dikirim. Silakan cek inbox atau folder spam.'
          : (result.message || 'Reset password belum dapat dikirim.');
      });
    },
  );
}
