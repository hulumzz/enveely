import {loadDesignAssets} from '../services/design-assets.js';
// Authenticated preview for an in-progress invitation. This always renders the
// local draft, rather than the sample invitation used by the public template demo.

import { renderPage } from '../ui/app-shell.js';
import { loadDraft } from '../services/draft-store.js';
import { requireAuthenticated } from '../services/access.js';
import { renderInvitation } from '../engine/renderer.js';
import { attachInvitationInteractions } from '../engine/interactions.js';
import { initInvitationMusic } from '../engine/music.js';
import { navigate } from '../router.js';
import { resolveOwnedDraft } from '../services/firestore-data.js';

export function renderDraftPreview(invitationId) {
  return requireAuthenticated(async () => {
    const draft = await resolveOwnedDraft(invitationId);
    if (!draft) {
      navigate('/dashboard/invitations', { replace: true });
      return;
    }

    await loadDesignAssets(draft.design.templateId);
    if(location.pathname!==`/builder/${invitationId}/preview`)return;
    renderPage(`
      <section class="livepreview livepreview--draft">
        <div class="livepreview__bar">
          <a href="/builder/${draft.id}" data-link class="back-link">← Kembali ke editor</a>
          <p class="livepreview__draft-note"><span></span> Pratinjau perubahan tersimpan</p>
          <div class="device-toggle" role="group" aria-label="Perangkat">
            <button type="button" class="chip is-active" data-device="mobile">Mobile</button>
            <button type="button" class="chip" data-device="desktop">Desktop</button>
          </div>
        </div>
        <div class="livepreview__stage" data-stage>
          <div class="device-frame device-frame--mobile" data-frame>
            <div class="device-frame__inner" data-canvas></div>
          </div>
        </div>
      </section>
    `, (root) => {
      const canvas = root.querySelector('[data-canvas]');
      const frame = root.querySelector('[data-frame]');
      canvas.innerHTML = renderInvitation({ ...draft, status: 'draft', _draft: true });
      attachInvitationInteractions(canvas, { demo: true });
      initInvitationMusic(canvas);

      root.querySelector('.device-toggle')?.addEventListener('click', (event) => {
        const chip = event.target.closest('[data-device]');
        if (!chip) return;
        root.querySelectorAll('[data-device]').forEach((item) => item.classList.toggle('is-active', item === chip));
        frame.classList.toggle('device-frame--mobile', chip.dataset.device === 'mobile');
        frame.classList.toggle('device-frame--desktop', chip.dataset.device === 'desktop');
      });
    });
  }, `/builder/${invitationId}/preview`);
}
