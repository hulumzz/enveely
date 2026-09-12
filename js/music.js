/**
 * Enveely — Floating Music Controller
 * Tombol pemutar musik melayang dengan efek disc berputar.
 */
document.addEventListener('DOMContentLoaded', () => {
  const bgMusic = document.getElementById('bgMusic');
  const musicToggle = document.getElementById('musicToggle');
  const musicWave = document.querySelector('.music-wave');

  if (!bgMusic || !musicToggle) return;

  let isPlaying = false;

  // Toggle button click
  musicToggle.addEventListener('click', () => {
    if (isPlaying) {
      bgMusic.pause();
      isPlaying = false;
      musicToggle.classList.remove('playing');
      if (musicWave) musicWave.style.display = 'none';
    } else {
      bgMusic.volume = 0.6;
      bgMusic.play().then(() => {
        isPlaying = true;
        musicToggle.classList.add('playing');
        if (musicWave) musicWave.style.display = 'block';
      }).catch(err => {
        console.log("Autoplay was prevented or audio failed:", err);
      });
    }
  });
});