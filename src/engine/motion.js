// Progressive enhancement: content remains visible without JS or with reduced motion.
export function initInvitationMotion(root) {
  const inv = root.matches?.('.inv') ? root : root.querySelector('.inv');
  if (!inv) return;
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  const nodes = [...inv.querySelectorAll('.sec-head, .person, .event-card, .story__item, .gallery__item, .quote__text, .rsvp__form, .closing__names')];
  let observer;
  const revealAll = () => { observer?.disconnect(); nodes.forEach(el => el.classList.remove('motion-pending')); };
  if (!preference.matches && 'IntersectionObserver' in window) {
    observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.remove('motion-pending');
      observer.unobserve(entry.target);
    }), { threshold: .08 });
    nodes.forEach((el, i) => { el.classList.add('motion-item', 'motion-pending'); el.style.setProperty('--motion-delay', `${i % 3 * 90}ms`); observer.observe(el); });
  }
  const open = e => {
    const button = e.target.closest('[data-open-cover]');
    if (!button) return;
    e.preventDefault();
    const next = inv.querySelector('.sec--cover')?.nextElementSibling;
    const scroller = root.closest('.device-frame__inner');
    const behavior = preference.matches ? 'instant' : 'smooth';
    if (next && scroller) scroller.scrollTo({ top: scroller.scrollTop + next.getBoundingClientRect().top - scroller.getBoundingClientRect().top, behavior });
    else next?.scrollIntoView({ behavior, block: 'start' });
  };
  root.addEventListener('click', open);
  preference.addEventListener('change', revealAll);
  const cleanup = () => { revealAll(); root.removeEventListener('click', open); preference.removeEventListener('change', revealAll); document.removeEventListener('env:navigate', cleanup); };
  document.addEventListener('env:navigate', cleanup, { once: true });
  return cleanup;
}
