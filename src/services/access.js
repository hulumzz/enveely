import { getCurrentUser } from './auth.js';
import { navigate } from '../router.js';
import { renderPage, setShellUser } from '../ui/app-shell.js';

function safeReturnPath(path) {
  const value = String(path || '');
  return value.startsWith('/') && !value.startsWith('//') ? value : '/dashboard';
}

export async function requireAuthenticated(render, returnTo = `${location.pathname}${location.search}`) {
  const expectedPath = safeReturnPath(returnTo);
  renderPage(`
    <section class="auth-gate" aria-live="polite">
      <span class="auth-gate__mark">E</span>
      <p>Memuat akunmu&hellip;</p>
    </section>
  `);
  const user = await getCurrentUser();
  if (`${location.pathname}${location.search}` !== expectedPath) return null;
  if (!user) {
    const next = encodeURIComponent(expectedPath);
    navigate(`/login?mode=register&next=${next}`, { replace: true });
    return null;
  }
  setShellUser(user);
  await render(user);
  return user;
}

export function resolveSafeNext(query, fallback = '/dashboard') {
  const next = query?.get('next') || '';
  return next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}
