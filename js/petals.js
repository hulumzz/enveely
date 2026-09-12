/**
 * Enveely — Falling Petals Canvas Animation
 * Partikel kelopak bunga berguguran interaktif di bawah canvas.
 */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('petalCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.parentElement.offsetWidth || window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  resize();
  window.addEventListener('resize', resize);

  // Petal particles pool
  const petalCount = 24;
  const petals = [];

  for (let i = 0; i < petalCount; i++) {
    petals.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 8 + 6,
      speedX: (Math.random() - 0.5) * 1.2,
      speedY: Math.random() * 1.2 + 0.8,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.03,
      opacity: Math.random() * 0.5 + 0.35,
      color: Math.random() > 0.4 ? 'rgba(232, 180, 162,' : 'rgba(255, 230, 220,'
    });
  }

  function drawPetal(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.beginPath();
    ctx.fillStyle = `${p.color}${p.opacity})`;
    
    // Smooth petal shape
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-p.size / 2, -p.size, -p.size, p.size / 2, 0, p.size);
    ctx.bezierCurveTo(p.size, p.size / 2, p.size / 2, -p.size, 0, 0);
    ctx.fill();
    ctx.restore();
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    petals.forEach(p => {
      p.x += p.speedX + Math.sin(p.y * 0.01) * 0.5;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;

      // Wrap around screen
      if (p.y > height + 20) {
        p.y = -20;
        p.x = Math.random() * width;
      }
      if (p.x < -20) p.x = width + 20;
      if (p.x > width + 20) p.x = -20;

      drawPetal(p);
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
});