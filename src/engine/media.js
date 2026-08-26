// Enveely — Media lifecycle helpers (SPA navigation cleanup).

/** Pause any playing <video>/<audio> elements inside rendered invitations. */
export function stopAllVideos() {
  document.querySelectorAll('video, audio').forEach((el) => {
    try {
      el.pause();
    } catch {
      /* ignore */
    }
  });
}

document.addEventListener('env:navigate', stopAllVideos);
