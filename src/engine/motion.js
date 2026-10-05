// Progressive enhancement: content remains visible without JS or with reduced motion.
import { initNusantaraMotion } from './nusantara-motion.js';
import { initLumiereMotion } from './lumiere-motion.js';
import { initElysianMotion } from './elysian-motion.js';
import { initPusakaMotion } from './pusaka-motion.js';
import { initMayuraMotion } from './mayura-motion.js';
import { initBlockaMotion } from './blocka-motion.js';
import { initMeadowMotion } from './meadow-motion.js';
import { initSerenaMotion } from './serena-motion.js';

export function initInvitationMotion(root) {
  const inv = root.matches?.('.inv') ? root : root.querySelector('.inv');
  if (!inv) return;
  if (inv.classList.contains('inv--serena')) return initSerenaMotion(root, inv);
  if (inv.classList.contains('inv--meadow')) return initMeadowMotion(root, inv);
  if (inv.classList.contains('inv--blocka')) return initBlockaMotion(root, inv);
  if (inv.classList.contains('inv--mayura')) return initMayuraMotion(root, inv);
  if (inv.classList.contains('inv--pusaka')) return initPusakaMotion(root, inv);
  if (inv.classList.contains('inv--nusantara')) return initNusantaraMotion(root, inv);
  if (inv.classList.contains('inv--lumiere')) return initLumiereMotion(root, inv);
  if (inv.classList.contains('inv--elysian')) return initElysianMotion(root, inv);
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const amora = inv.classList.contains('inv--amora');
  const nodes = [...inv.querySelectorAll('.sec-head, .person, .event-card, .story__item, .gallery__item, .quote__text, .rsvp__form, .closing__names' + (amora ? ', .welcome__text, .countdown__grid, .info__card, .gift__card, .wishes__form' : ''))];
  const scroller = root.closest('.device-frame__inner');
  let observer, sceneObserver, driftFrame = 0;
  const activeScenes = new Set();
  const scenes = amora ? [...inv.querySelectorAll('.sec')] : [];
  const revealAll = () => {
    observer?.disconnect(); sceneObserver?.disconnect(); cancelAnimationFrame(driftFrame);
    nodes.forEach(el => el.classList.remove('motion-pending'));
    scenes.forEach(el => { el.classList.remove('is-in-view'); el.style.removeProperty('--amora-drift'); });
    activeScenes.clear();
  };
  const drift = () => {
    driftFrame = 0;
    if (preference.matches || document.hidden) return;
    const top = scroller ? scroller.getBoundingClientRect().top : 0;
    const height = scroller ? scroller.clientHeight : window.innerHeight;
    for (const section of activeScenes) {
      if (!section.querySelector('.amora-scene__garden')) continue;
      const offset = (top + height / 2 - section.getBoundingClientRect().top - section.offsetHeight / 2) * .025;
      section.style.setProperty('--amora-drift', `${Math.max(-12, Math.min(12, offset)).toFixed(1)}px`);
    }
  };
  const scheduleDrift = () => { if (!driftFrame) driftFrame = requestAnimationFrame(drift); };
  const startScenes = () => {
    if (!amora || preference.matches || !('IntersectionObserver' in window)) return;
    sceneObserver ||= new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('is-in-view', entry.isIntersecting);
        if (entry.isIntersecting) activeScenes.add(entry.target); else activeScenes.delete(entry.target);
      });
      scheduleDrift();
    }, { root: scroller, threshold: 0 });
    scenes.forEach(section => sceneObserver.observe(section));
  };
  if (!preference.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('motion-pending');
      observer.unobserve(entry.target);
    }), { root: scroller, threshold: .08 });
    nodes.forEach((el, i) => { el.classList.add('motion-item', 'motion-pending'); el.style.setProperty('--motion-delay', `${i % 3 * 90}ms`); observer.observe(el); });
    startScenes();
  }
  const scrollTarget = scroller || window;
  if (amora) scrollTarget.addEventListener('scroll', scheduleDrift, { passive: true });
  const visibility = () => { inv.classList.toggle('is-motion-paused', document.hidden); if (!document.hidden) scheduleDrift(); };
  if (amora) document.addEventListener('visibilitychange', visibility);
  const open = e => {
    const button = e.target.closest('[data-open-cover]');
    if (!button) return;
    e.preventDefault();
    const next = inv.querySelector('.sec--cover')?.nextElementSibling;
    inv.classList.add('is-opened');
    const behavior = preference.matches ? 'instant' : 'smooth';
    if (next && scroller) scroller.scrollTo({ top: scroller.scrollTop + next.getBoundingClientRect().top - scroller.getBoundingClientRect().top, behavior });
    else next?.scrollIntoView({ behavior, block: 'start' });
  };
  root.addEventListener('click', open);
  const preferenceChanged = () => { if (preference.matches) revealAll(); else startScenes(); };
  preference.addEventListener('change', preferenceChanged);
  const cleanup = () => { revealAll(); root.removeEventListener('click', open); scrollTarget.removeEventListener('scroll', scheduleDrift); document.removeEventListener('visibilitychange', visibility); preference.removeEventListener('change', preferenceChanged); document.removeEventListener('env:navigate', cleanup); };
  document.addEventListener('env:navigate', cleanup, { once: true });
  return cleanup;
}
