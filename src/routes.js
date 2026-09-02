// Enveely — Route registration + page wiring.
// Maps URL patterns to page renderers (History API; SPA fallback via _redirects).

import { registerRoute } from './router.js';
import { renderLanding } from './pages/landing.js';
import { renderTemplateGallery } from './pages/template-gallery.js';
import { renderTemplatePreview } from './pages/template-preview.js';
import { renderLivePreview } from './pages/live-preview.js';
import { renderCreate } from './pages/create.js';
import { renderBuilder } from './pages/builder.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderLogin } from './pages/login.js';
import { renderPublicInvitation } from './pages/public-invite.js';
import { renderNotFound } from './pages/not-found.js';
import { renderCheckout } from './pages/checkout.js';
import { renderInfoPage } from './pages/info.js';
import { renderAdminPayments } from './pages/admin-payments.js';

export function setupRoutes() {
  registerRoute('/', () => renderLanding());
  registerRoute('/templates', () => renderTemplateGallery());
  registerRoute('/templates/:id', ({ id }) => renderTemplatePreview(id));
  registerRoute('/templates/:id/preview', ({ id }) => renderLivePreview(id));
  registerRoute('/templates/:id/preview/:variant', ({ id, variant }) => renderLivePreview(id, variant));
  registerRoute('/create', (_params, query) => renderCreate(query));
  registerRoute('/builder/:id', ({ id }) => renderBuilder(id));
  registerRoute('/checkout/:id', ({ id }) => renderCheckout(id));
  registerRoute('/dashboard', () => renderDashboard());
  registerRoute('/dashboard/invitations', () => renderDashboard('invitations'));
  registerRoute('/dashboard/templates', () => renderDashboard('templates'));
  registerRoute('/dashboard/payments', () => renderDashboard('payments'));
  registerRoute('/dashboard/profile', () => renderDashboard('profile'));
  registerRoute('/login', (_params, query) => renderLogin(_params, query));
  registerRoute('/help', () => renderInfoPage('help'));
  registerRoute('/privacy', () => renderInfoPage('privacy'));
  registerRoute('/terms', () => renderInfoPage('terms'));
  registerRoute('/admin/payments', () => renderAdminPayments());
  registerRoute('/invite/:id', (params, query) => renderPublicInvitation(params, query));

  // Keep a direct reference so bundlers do not tree-shake the fallback import.
  void renderNotFound;
}
