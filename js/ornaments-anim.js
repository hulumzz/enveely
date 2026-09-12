/**
 * Enveely — Swaying Flora Animations
 * Hiasan sudut bunga dan divider yang bergoyang (*sway) secara halus.
 */
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sway animations for corner ornaments
  const ornaments = document.querySelectorAll('.ornament.sway-animation, .ornament.sway-animation-alt');

  ornaments.forEach((orn, index) => {
    const baseDuration = orn.classList.contains('sway-animation') ? 6 : 7;
    const delay = (index % 2 === 0) ? 0 : 1;
    
    // Re-apply animation with randomized delay
    orn.style.animation = `swayFlora ${baseDuration}s ease-in-out infinite alternate ${delay}s`;
  });
});