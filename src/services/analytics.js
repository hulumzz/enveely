// Enveely — Analytics event tracking (Firebase Analytics).
// Anonymous product events only; never send guest wedding content as payloads
// (Blueprint-1.md §32).

import { initAnalytics } from './firebase.js';

async function track(eventName, params = {}) {
  try {
    const analytics = await initAnalytics();
    if (!analytics) return;
    const { logEvent } = await import('firebase/analytics');
    logEvent(analytics, eventName, params);
  } catch {
    /* analytics must never break UX */
  }
}

export const analyticsEvents = {
  landingView: () => track('landing_view'),
  viewTemplate: (templateId) => track('view_template', { template_id: templateId }),
  templatePreview: (templateId) => track('template_preview', { template_id: templateId }),
  createInvitation: (templateId) => track('create_invitation', { template_id: templateId }),
  editorOpen: () => track('editor_open'),
  imageUploaded: () => track('image_uploaded'),
  previewOpen: () => track('preview_open'),
  publishInvitation: () => track('publish_invitation'),
  shareWhatsapp: () => track('share_whatsapp'),
  shareUrl: () => track('share_url'),
  rsvpSubmitted: () => track('rsvp_submitted'),
  languageChanged: (locale) => track('language_changed', { locale }),
};
