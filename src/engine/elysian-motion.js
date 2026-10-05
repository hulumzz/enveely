// Folio motion preserves native scrolling; decorative foil idles only in view.
export function initElysianMotion(root, inv) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const scroller = root.closest('.device-frame__inner');
  const scrollTarget = scroller || window;
  const sections = [...inv.querySelectorAll('.sec')];
  const nodes = [...inv.querySelectorAll('.sec-head,.welcome__text,.person,.quote__text,.event-card,.countdown__grid,.story__item,.gallery__item,.map__frame,.info__card,.rsvp__form,.gift__card,.wishes__form,.closing__names')];
  const active = new Set();
  let sceneObserver, revealObserver, frame = 0;

  function update() {
    frame = 0;
    const bounds = scroller?.getBoundingClientRect();
    const viewportTop = bounds?.top || 0;
    const viewportHeight = scroller?.clientHeight || innerHeight;
    const canvasTop = inv.getBoundingClientRect().top;
    const distance = Math.max(1, inv.scrollHeight - viewportHeight);
    const progress = Math.min(1, Math.max(0, (viewportTop - canvasTop) / distance));
    inv.style.setProperty('--ey-progress', progress.toFixed(4));
    if (preference.matches || document.hidden) return;
    for (const section of active) {
      const offset = (viewportTop + viewportHeight / 2 - section.getBoundingClientRect().top - section.offsetHeight / 2) * .035;
      section.style.setProperty('--ey-drift', `${Math.max(-18, Math.min(18, offset)).toFixed(1)}px`);
    }
  }
  const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update); };
  function stopScenes() {
    sceneObserver?.disconnect(); sceneObserver = null;
    revealObserver?.disconnect(); revealObserver = null;
    cancelAnimationFrame(frame); frame = 0;
    active.clear(); inv.classList.remove('ey-motion');
    sections.forEach(section => { section.classList.remove('ey-in-view'); section.style.removeProperty('--ey-drift'); });
    nodes.forEach(node => node.classList.remove('ey-pending'));
  }
  function startScenes(reveal = false) {
    if (preference.matches || !('IntersectionObserver' in window)) return;
    inv.classList.add('ey-motion');
    sceneObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        entry.target.classList.toggle('ey-in-view', entry.isIntersecting);
        if (entry.isIntersecting) active.add(entry.target); else active.delete(entry.target);
      }
      schedule();
    }, { root: scroller, threshold: 0 });
    sections.forEach(section => sceneObserver.observe(section));
    if (reveal) {
      revealObserver = new IntersectionObserver(entries => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.remove('ey-pending');
          revealObserver.unobserve(entry.target);
        }
      }, { root: scroller, threshold: .06 });
      nodes.forEach((node, i) => {
        node.classList.add('ey-reveal', 'ey-pending');
        node.style.setProperty('--ey-delay', `${i % 3 * 80}ms`);
        revealObserver.observe(node);
      });
    }
    schedule();
  }
  startScenes(true);
  const visibility = () => {
    inv.classList.toggle('is-motion-paused', document.hidden);
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule();
  };
  visibility();
  const changed = () => { stopScenes(); startScenes(); schedule(); };
  const open = event => {
    if (!event.target.closest('[data-open-cover]')) return;
    event.preventDefault();
    inv.classList.add('is-opened');
    const next = inv.querySelector('.sec--cover')?.nextElementSibling;
    const behavior = preference.matches ? 'instant' : 'smooth';
    if (next && scroller) scroller.scrollTo({ top: scroller.scrollTop + next.getBoundingClientRect().top - scroller.getBoundingClientRect().top, behavior });
    else next?.scrollIntoView({ behavior, block: 'start' });
  };
  root.addEventListener('click', open);
  scrollTarget.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('visibilitychange', visibility);
  preference.addEventListener('change', changed);
  const cleanup = () => {
    stopScenes(); root.removeEventListener('click', open);
    scrollTarget.removeEventListener('scroll', schedule);
    document.removeEventListener('visibilitychange', visibility);
    preference.removeEventListener('change', changed);
    document.removeEventListener('env:navigate', cleanup);
  };
  document.addEventListener('env:navigate', cleanup, { once: true });
  return cleanup;
}
