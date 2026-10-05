// Optical motion is decorative. Reading order and native scrolling stay intact.
export function initLumiereMotion(root, inv) {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const scroller = root.closest('.device-frame__inner');
  const scrollTarget = scroller || window;
  const scenes = [...inv.querySelectorAll('.sec')];
  const nodes = [...inv.querySelectorAll('.sec-head,.welcome__text,.person,.quote__text,.event-card,.countdown__grid,.story__item,.gallery__item,.map__frame,.info__card,.rsvp__form,.gift__card,.wishes__form,.closing__names')];
  const active = new Set();
  let sceneObserver, revealObserver, frame = 0;
  const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update); };
  function update() {
    frame = 0;
    const top = scroller?.getBoundingClientRect().top || 0;
    const height = scroller?.clientHeight || innerHeight;
    const progress = Math.max(0, Math.min(1, (top - inv.getBoundingClientRect().top) / Math.max(1, inv.scrollHeight - height)));
    inv.style.setProperty('--lm-progress', progress.toFixed(4));
    if (preference.matches || document.hidden) return;
    for (const section of active) {
      const center = section.getBoundingClientRect().top + section.offsetHeight / 2;
      const distance = top + height / 2 - center;
      section.style.setProperty('--lm-drift', `${Math.max(-24, Math.min(24, distance * .04)).toFixed(1)}px`);
      if (section.classList.contains('sec--cover')) section.style.setProperty('--lm-photo-drift', `${Math.max(-10, Math.min(10, distance * .025)).toFixed(1)}px`);
    }
  }
  function stop() {
    sceneObserver?.disconnect(); sceneObserver = null;
    revealObserver?.disconnect(); revealObserver = null;
    cancelAnimationFrame(frame); frame = 0;
    inv.classList.remove('lm-motion'); active.clear();
    scenes.forEach(section => { section.classList.remove('lm-in-view'); section.style.removeProperty('--lm-drift'); section.style.removeProperty('--lm-photo-drift'); });
    nodes.forEach(node => node.classList.remove('lm-pending'));
  }
  function start(reveal = false) {
    if (preference.matches || !('IntersectionObserver' in window)) return;
    inv.classList.add('lm-motion');
    sceneObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        entry.target.classList.toggle('lm-in-view', entry.isIntersecting);
        if (entry.isIntersecting) active.add(entry.target); else active.delete(entry.target);
      });
      schedule();
    }, { root: scroller, threshold: 0 });
    scenes.forEach(section => sceneObserver.observe(section));
    if (reveal) {
      revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.remove('lm-pending'); revealObserver.unobserve(entry.target);
      }), { root: scroller, threshold: .06 });
      nodes.forEach((node, i) => {
        node.classList.add('lm-reveal', 'lm-pending');
        node.style.setProperty('--lm-delay', `${i % 3 * 85}ms`);
        revealObserver.observe(node);
      });
    }
    schedule();
  }
  const visibility = () => {
    inv.classList.toggle('is-motion-paused', document.hidden);
    if (document.hidden) { cancelAnimationFrame(frame); frame = 0; } else schedule();
  };
  const changed = () => { stop(); start(); schedule(); };
  const open = event => {
    if (!event.target.closest('[data-open-cover]')) return;
    event.preventDefault(); inv.classList.add('is-opened');
    const next = inv.querySelector('.sec--cover')?.nextElementSibling;
    const behavior = preference.matches ? 'instant' : 'smooth';
    if (next && scroller) scroller.scrollTo({ top: scroller.scrollTop + next.getBoundingClientRect().top - scroller.getBoundingClientRect().top, behavior });
    else next?.scrollIntoView({ behavior, block: 'start' });
  };
  start(true); visibility();
  root.addEventListener('click', open);
  scrollTarget.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('visibilitychange', visibility);
  preference.addEventListener('change', changed);
  const cleanup = () => {
    stop(); root.removeEventListener('click', open); scrollTarget.removeEventListener('scroll', schedule);
    document.removeEventListener('visibilitychange', visibility); preference.removeEventListener('change', changed);
    document.removeEventListener('env:navigate', cleanup);
  };
  document.addEventListener('env:navigate', cleanup, { once: true });
  return cleanup;
}
