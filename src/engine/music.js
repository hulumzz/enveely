// Enveely — Background music engine for public invitations.
// Autoplay policies require user interaction; the gate cover click provides
// it. A visible floating control is always present (Design-1.md §24).

let currentAudio = null;

/**
 * Attach music behavior to a rendered invitation root.
 * Expects markup from renderMusic(): [data-music] with audio[data-music-src].
 */
export function initInvitationMusic(root) {
  const wrap = root.querySelector('[data-music]');
  if (!wrap) return;
  const src = wrap.dataset.musicSrc;
  if (!src) return;

  const btn = wrap.querySelector('[data-music-toggle]');
  const icon = wrap.querySelector('[data-music-icon]');
  const audio = new Audio(src);
  audio.loop = wrap.dataset.musicLoop !== 'false';
  audio.volume = Math.min(Math.max(Number(wrap.dataset.musicVolume) || 0.55, 0), 1);
  currentAudio = audio;

  const setIcon = (playing) => {
    if (icon) icon.textContent = playing ? '♪' : '♪̸';
    btn?.setAttribute('aria-pressed', String(playing));
  };

  btn?.addEventListener('click', () => {
    if (audio.paused) {
      audio.play().then(() => setIcon(true)).catch(() => setIcon(false));
    } else {
      audio.pause();
      setIcon(false);
    }
  });

  // Auto-start attempt after first user interaction anywhere (gate open).
  const tryAutoplay = () => {
    if (!audio.paused) return cleanup();
    audio.play().then(() => setIcon(true)).catch(() => {}).finally(cleanup);
  };
  function cleanup() {
    document.removeEventListener('click', tryAutoplay, { capture: true });
  }
  if (wrap.dataset.musicAutoplay !== 'false') {
    document.addEventListener('click', tryAutoplay, { capture: true, once: true });
  }

  // Stop when leaving the page (SPA navigation).
  window.addEventListener('env:navigate', () => {
    audio.pause();
    audio.src = '';
  }, { once: true });
}

/** Stop any playing invitation audio. */
export function stopInvitationMusic() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}
