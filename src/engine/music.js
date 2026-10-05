// One owned player, gesture-based start and cancellable volume envelopes.
let disposeCurrent = null;
export function initInvitationMusic(root) {
  stopInvitationMusic();
  const wrap = root.querySelector('[data-music]');
  if (!wrap?.dataset.musicSrc) return;
  const button = wrap.querySelector('[data-music-toggle]');
  const icon = wrap.querySelector('[data-music-icon]');
  const audio = new Audio(wrap.dataset.musicSrc);
  audio.preload = 'none';
  audio.loop = wrap.dataset.musicLoop !== 'false';
  const parsed = Number(wrap.dataset.musicVolume);
  const volume = Number.isFinite(parsed) ? Math.min(1, Math.max(0, parsed)) : .55;
  const duration = (value, fallback) => Number.isFinite(+value) && +value > 0 ? Math.min(5000, +value) : fallback;
  const fadeIn = duration(wrap.dataset.musicFadeIn, 1800);
  const fadeOut = duration(wrap.dataset.musicFadeOut, 650);
  let frame = 0, sequence = 0, playing = false, disposed = false;
  const state = value => {
    playing = value;
    button?.setAttribute('aria-pressed', String(value));
    button?.setAttribute('aria-label', value ? 'Jeda musik' : 'Putar musik');
    if (icon) icon.textContent = value ? '♫' : '♪';
  };
  const fade = (target, duration, done = () => {}) => {
    cancelAnimationFrame(frame);
    const initial = audio.volume, start = performance.now();
    const step = now => {
      const progress = Math.min(1, (now - start) / duration);
      audio.volume = initial + (target - initial) * (progress * progress * (3 - 2 * progress));
      if (progress < 1) frame = requestAnimationFrame(step); else done();
    };
    frame = requestAnimationFrame(step);
  };
  const play = () => {
    if (disposed) return;
    const token = ++sequence;
    cancelAnimationFrame(frame);
    if (audio.paused) audio.volume = 0;
    state(true);
    audio.play().then(() => {
      if (disposed || token !== sequence) return;
      fade(volume, fadeIn);
    }).catch(() => { if (token === sequence) state(false); });
  };
  const pause = () => { ++sequence; state(false); fade(0, fadeOut, () => audio.pause()); };
  const toggle = () => playing ? pause() : play();
  const open = e => {
    if (wrap.dataset.musicAutoplay === 'false') return;
    if (e.type === 'env:gate-opened' || e.target.closest?.('[data-open-cover]')) {
      if (!playing) play();
    }
  };
  const hidden = () => { if (document.hidden) { ++sequence; cancelAnimationFrame(frame); audio.pause(); state(false); } };
  const ended = () => state(false);
  button?.addEventListener('click', toggle);
  root.addEventListener('click', open);
  document.addEventListener('env:gate-opened', open);
  document.addEventListener('visibilitychange', hidden);
  audio.addEventListener('ended', ended);
  audio.addEventListener('error', ended);
  const dispose = () => {
    disposed = true; ++sequence; cancelAnimationFrame(frame); audio.pause(); audio.removeAttribute('src'); audio.load();
    button?.removeEventListener('click', toggle);
    root.removeEventListener('click', open);
    document.removeEventListener('env:gate-opened', open);
    document.removeEventListener('visibilitychange', hidden);
    audio.removeEventListener('ended', ended); audio.removeEventListener('error', ended);
    document.removeEventListener('env:navigate', dispose);
    if (disposeCurrent === dispose) disposeCurrent = null;
  };
  disposeCurrent = dispose;
  document.addEventListener('env:navigate', dispose, { once: true });
  state(false);
}
export function stopInvitationMusic() { disposeCurrent?.(); }
