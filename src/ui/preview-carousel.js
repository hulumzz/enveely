// Native scrolling keeps each slide inside a fixed viewport, including touch swipes.
export function wirePreviewCarousel({ viewport, track, buttons, prev, next, caption, labels = [] }) {
  if (!viewport || !track) return;
  const slides = [...track.children];
  const controls = [...buttons];
  let index = 0, tick = 0;
  const reflect = () => {
    tick = 0;
    index = Math.max(0, Math.min(slides.length - 1, Math.round(viewport.scrollLeft / (viewport.clientWidth || 1))));
    controls.forEach((button, i) => { button.classList.toggle('is-active', i === index); button.setAttribute('aria-pressed', String(i === index)); });
    if (caption) caption.textContent = labels[index] || '';
  };
  const go = i => {
    index = (i + slides.length) % slides.length;
    viewport.scrollTo({ left: index * viewport.clientWidth, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  };
  controls.forEach((button, i) => button.addEventListener('click', () => go(i)));
  prev?.addEventListener('click', () => go(index - 1));
  next?.addEventListener('click', () => go(index + 1));
  const scroll = () => { if (!tick) tick = requestAnimationFrame(reflect); };
  const keyboard = event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    go(event.key === 'Home' ? 0 : event.key === 'End' ? slides.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1));
  };
  viewport.addEventListener('scroll', scroll, { passive: true });
  viewport.addEventListener('keydown', keyboard);
  let width = viewport.clientWidth;
  const resize = typeof ResizeObserver === 'function' ? new ResizeObserver(() => {
    if (width === viewport.clientWidth) return;
    width = viewport.clientWidth;
    viewport.scrollTo({ left: index * width, behavior: 'instant' });
  }) : null;
  resize?.observe(viewport);
  const cleanup = () => { resize?.disconnect(); cancelAnimationFrame(tick); viewport.removeEventListener('scroll', scroll); viewport.removeEventListener('keydown', keyboard); document.removeEventListener('env:navigate', cleanup); };
  document.addEventListener('env:navigate', cleanup, { once: true });
  reflect();
  return cleanup;
}
