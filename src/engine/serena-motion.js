// Frame entries repeat on return; text reveals once. Idle runs only in view.
export function initSerenaMotion(root, inv) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const scroller = root.closest('.device-frame__inner');
  const scrollTarget = scroller || window;
  const sections = [...inv.querySelectorAll('.sec')];
  const nodes = [...inv.querySelectorAll('.sec-head,.welcome__text,.person,.quote__text,.event-card,.countdown__grid,.story__item,.gallery__item,.map__frame,.info__card,.rsvp__form,.gift__card,.wishes__form,.closing__names')];
  const active = new Set();
  let sceneObserver, revealObserver, frame = 0;
  function update() {
    frame = 0;
    const top = scroller?.getBoundingClientRect().top || 0;
    const height = scroller?.clientHeight || innerHeight;
    const distance = Math.max(1, inv.scrollHeight - height);
    const progress = Math.max(0, Math.min(1, (top - inv.getBoundingClientRect().top) / distance));
    inv.style.setProperty('--sr-progress', progress.toFixed(4));
    if (preference.matches || document.hidden) return;
    for (const section of active) {
      const offset = (top + height / 2 - section.getBoundingClientRect().top - section.offsetHeight / 2) * .035;
      section.style.setProperty('--sr-drift', `${Math.max(-16, Math.min(16, offset)).toFixed(1)}px`);
    }
  }
  const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update); };
  function stop() {
    sceneObserver?.disconnect(); revealObserver?.disconnect();
    cancelAnimationFrame(frame); frame = 0; active.clear();
    inv.classList.remove('sr-motion');
    sections.forEach(section => { section.classList.remove('sr-in-view'); section.style.removeProperty('--sr-drift'); });
    nodes.forEach(node => node.classList.remove('sr-pending'));
  }
  function start(reveal = false) {
    if (preference.matches || !('IntersectionObserver' in window)) return;
    inv.classList.add('sr-motion');
    sceneObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.classList.toggle('sr-in-view', entry.isIntersecting);
        if (entry.isIntersecting) active.add(entry.target); else active.delete(entry.target);
      }
      schedule();
    }, { root: scroller, threshold: 0 });
    sections.forEach(section => sceneObserver.observe(section));
    if (reveal) {
      revealObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove('sr-pending'); revealObserver.unobserve(entry.target);
        }
      }, { root: scroller, threshold: .06 });
      nodes.forEach((node,i) => { node.classList.add('sr-reveal','sr-pending'); node.style.setProperty('--sr-delay', `${i % 3 * 90}ms`); revealObserver.observe(node); });
    }
    schedule();
  }
  start(true);
  const visibility = () => { inv.classList.toggle('is-motion-paused', document.hidden); if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule(); };
  visibility();
  const changed = () => { stop(); start(); schedule(); };
  const open = event => {
    if (!event.target.closest('[data-open-cover]')) return;
    event.preventDefault(); inv.classList.add('is-opened');
    const next = inv.querySelector('.sec--cover')?.nextElementSibling;
    const behavior = preference.matches ? 'instant' : 'smooth';
    if (next && scroller) scroller.scrollTo({ top: scroller.scrollTop + next.getBoundingClientRect().top - scroller.getBoundingClientRect().top, behavior });
    else next?.scrollIntoView({ behavior, block: 'start' });
  };
  root.addEventListener('click', open);
  scrollTarget.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('visibilitychange', visibility);
  preference.addEventListener('change', changed);
  const cleanup = () => {
    stop(); root.removeEventListener('click', open);
    scrollTarget.removeEventListener('scroll', schedule); window.removeEventListener('resize', schedule);
    document.removeEventListener('visibilitychange', visibility); preference.removeEventListener('change', changed);
    document.removeEventListener('env:navigate', cleanup);
  };
  document.addEventListener('env:navigate', cleanup, { once: true });
  return cleanup;
}
