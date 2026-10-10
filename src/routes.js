// Enveely — Route registration + page wiring.
// Maps URL patterns to page renderers (History API; SPA fallback via _redirects).

import { registerRoute } from './router.js';
const renderLanding = (...args) => {const path=location.pathname;return import('./pages/landing.js').then(module=>{if(location.pathname===path)return module.renderLanding(...args);});};
const renderTemplateGallery = (...args) => {const path=location.pathname;return import('./pages/template-gallery.js').then(module=>{if(location.pathname===path)return module.renderTemplateGallery(...args);});};
const renderTemplatePreview = (...args) => {const path=location.pathname;return import('./pages/template-preview.js').then(module=>{if(location.pathname===path)return module.renderTemplatePreview(...args);});};
const renderLivePreview = (...args) => {const path=location.pathname;return import('./pages/live-preview.js').then(module=>{if(location.pathname===path)return module.renderLivePreview(...args);});};
const renderDraftPreview = (...args) => {const path=location.pathname;return import('./pages/draft-preview.js').then(module=>{if(location.pathname===path)return module.renderDraftPreview(...args);});};
const renderCreate = (...args) => {const path=location.pathname;return import('./pages/create.js').then(module=>{if(location.pathname===path)return module.renderCreate(...args);});};
const renderBuilder = (...args) => {const path=location.pathname;return import('./pages/builder.js').then(module=>{if(location.pathname===path)return module.renderBuilder(...args);});};
const renderDashboard = (...args) => {const path=location.pathname;return import('./pages/dashboard.js').then(module=>{if(location.pathname===path)return module.renderDashboard(...args);});};
const renderLogin = (...args) => {const path=location.pathname;return import('./pages/login.js').then(module=>{if(location.pathname===path)return module.renderLogin(...args);});};
const renderPublicInvitation = (...args) => {const path=location.pathname;return import('./pages/public-invite.js').then(module=>{if(location.pathname===path)return module.renderPublicInvitation(...args);});};
const renderNotFound = (...args) => {const path=location.pathname;return import('./pages/not-found.js').then(module=>{if(location.pathname===path)return module.renderNotFound(...args);});};
const renderCheckout = (...args) => {const path=location.pathname;return import('./pages/checkout.js').then(module=>{if(location.pathname===path)return module.renderCheckout(...args);});};
const renderInfoPage = (...args) => {const path=location.pathname;return import('./pages/info.js').then(module=>{if(location.pathname===path)return module.renderInfoPage(...args);});};
const renderAdminPayments = (...args) => {const path=location.pathname;return import('./pages/admin-payments.js').then(module=>{if(location.pathname===path)return module.renderAdminPayments(...args);});};

export function setupRoutes() {
  registerRoute('/', () => renderLanding());
  registerRoute('/templates', () => renderTemplateGallery());
  registerRoute('/templates/:id', ({ id }) => renderTemplatePreview(id));
  registerRoute('/templates/:id/preview', ({ id }) => renderLivePreview(id));
  registerRoute('/templates/:id/preview/:variant', ({ id, variant }) => renderLivePreview(id, variant));
  registerRoute('/create', (_params, query) => renderCreate(query));
  registerRoute('/builder/:id', ({ id }) => renderBuilder(id));
  registerRoute('/builder/:id/preview', ({ id }) => renderDraftPreview(id));
  registerRoute('/checkout/:id', ({ id }) => renderCheckout(id));
  registerRoute('/dashboard', () => renderDashboard());
  registerRoute('/dashboard/invitations', () => renderDashboard('invitations'));
  registerRoute('/dashboard/templates', () => renderDashboard('templates'));
  registerRoute('/dashboard/payments', () => renderDashboard('payments'));
  registerRoute('/dashboard/profile', () => renderDashboard('profile'));
  registerRoute('/dashboard/guests', () => renderDashboard('guests'));
  registerRoute('/login', (_params, query) => renderLogin(_params, query));
  registerRoute('/help', () => renderInfoPage('help'));
  registerRoute('/privacy', () => renderInfoPage('privacy'));
  registerRoute('/terms', () => renderInfoPage('terms'));
  registerRoute('/admin/payments', () => renderAdminPayments());
  registerRoute('/invite/:id', (params, query) => renderPublicInvitation(params, query));

  // Keep a direct reference so bundlers do not tree-shake the fallback import.
  void renderNotFound;
}
