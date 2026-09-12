/**
 * Enveely — Flying Butterflies Animation
 * Kupu-kupu terbang melayang dengan gerakan sinusoidal alami.
 */
document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('appContainer');
  const b1 = document.getElementById('butterfly1');
  const b2 = document.getElementById('butterfly2');

  if (!container || !b1 || !b2) return;

  function createButterflyMotion(element, startXOffset, speedFactor) {
    let width = container.offsetWidth || 380;
    let height = window.innerHeight;

    let x = width * startXOffset;
    let y = height * 0.4;
    let angle = Math.random() * Math.PI * 2;
    let speed = 1.2 * speedFactor;
    let frame = Math.random() * 1000;

    function move() {
      width = container.offsetWidth || 380;
      height = window.innerHeight;
      frame++;

      // Natural curvy flight path using sinusoidal variation
      const curve = Math.sin(frame * 0.02) * 0.08;
      angle += curve;

      const dx = Math.cos(angle) * speed;
      const dy = Math.sin(angle) * speed;

      x += dx;
      y += dy;

      // Gentle bounds bouncing
      const margin = 20;
      if (x < margin) {
        angle = Math.PI - angle + (Math.random() - 0.5) * 0.4;
        x = margin;
      } else if (x > width - margin - 30) {
        angle = Math.PI - angle + (Math.random() - 0.5) * 0.4;
        x = width - margin - 30;
      }

      if (y < margin) {
        angle = -angle + (Math.random() - 0.5) * 0.4;
        y = margin;
      } else if (y > height - margin - 60) {
        angle = -angle + (Math.random() - 0.5) * 0.4;
        y = height - margin - 60;
      }

      const deg = angle * (180 / Math.PI);
      element.style.transform = `translate3d(${x}px, ${y}px, 0) rotate(${deg + 90}deg)`;

      requestAnimationFrame(move);
    }

    requestAnimationFrame(move);
  }

  createButterflyMotion(b1, 0.2, 1.1);
  createButterflyMotion(b2, 0.7, 0.9);
});