// Enveely — Live template preview page.
// Renders a sample invitation through the real renderer so users see the
// actual Design DNA (not a mockup). Supports variant switching and
// mobile/desktop viewport toggling (Design-1.md §13).

import { renderPage } from '../ui/app-shell.js';
import { getTemplate } from '../data/templates.js';
import { getVariantsFor } from '../data/variants.js';
import { sampleInvitation } from '../data/sample-invitation.js';
import { renderInvitation } from '../engine/renderer.js';
import { attachInvitationInteractions } from '../engine/interactions.js';
import { initInvitationMusic } from '../engine/music.js';
import { navigate } from '../router.js';

export function renderLivePreview(templateId, variantId) {
  const tpl = getTemplate(templateId);
  if (!tpl) {
    navigate('/templates', { replace: true });
    return;
  }
  const variants = getVariantsFor(templateId);
  const activeVariant = variants.some((v) => v.id === variantId) ? variantId : variants[0]?.id;

  const variantChips = variants
    .map((v) => `<button type="button" class="chip ${v.id === activeVariant ? 'is-active' : ''}" data-variant="${v.id}">${v.name}</button>`)
    .join('');

  renderPage(
    `
    <section class="livepreview">
      <div class="livepreview__bar">
        <a href="/templates/${tpl.id}" data-link class="back-link">← ${tpl.name}</a>
        <div class="livepreview__variants" role="group" aria-label="Varian">${variantChips}</div>
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
    `,
    (root) => {
      const canvas = root.querySelector('[data-canvas]');
      const frame = root.querySelector('[data-frame]');

      const paint = () => {
        const invitation = sampleInvitation(templateId, activeVariant);
        canvas.innerHTML = renderInvitation(invitation);
        attachInvitationInteractions(canvas, { demo: true });
        initInvitationMusic(canvas);
      };

      root.querySelector('.livepreview__variants')?.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-variant]');
        if (!chip) return;
        root.querySelectorAll('[data-variant]').forEach((c) => c.classList.toggle('is-active', c === chip));
        navigate(`/templates/${templateId}/preview/${chip.dataset.variant}`, { replace: true });
        paint();
      });

      root.querySelector('.device-toggle')?.addEventListener('click', (e) => {
        const chip = e.target.closest('[data-device]');
        if (!chip) return;
        root.querySelectorAll('[data-device]').forEach((c) => c.classList.toggle('is-active', c === chip));
        frame.classList.toggle('device-frame--mobile', chip.dataset.device === 'mobile');
        frame.classList.toggle('device-frame--desktop', chip.dataset.device === 'desktop');
      });

      paint();
    },
  );
}
