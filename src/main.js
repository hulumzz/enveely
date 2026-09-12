// Enveely — Application entry point.
// Boots the router, applies saved locale, and mounts the app shell.

import { initRouter } from './router.js';
import { initI18n } from './i18n.js';
import { ensureDeviceId } from './core/device.js';
import { mountAppShell } from './ui/app-shell.js';
import { setupRoutes } from './routes.js';
import { initAnalytics } from './services/firebase.js';
import '../styles/main.css';
import '../styles/invitation.css'; // Tempwed arch frame & glassmorphism styles
import './js/countdown.js'; // Countdown timer interaktivitas
import './js/music.js'; // Floating music controller
import './js/bottom-nav.js'; // Bottom nav & scroll spy
import './js/butterflies.js'; // Flying butterflies animation
import './js/petals.js'; // Falling petals canvas interaktivitas
import './js/ornaments-anim.js'; // Swaying flora animations

function boot() {
  ensureDeviceId();
  initI18n();
  mountAppShell(document.getElementById('app'));
  setupRoutes();
  initRouter();
  // Fire-and-forget; analytics must never block UX (Blueprint-1.md §32).
  initAnalytics();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
