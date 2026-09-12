/**
 * Enveely — Floating Bottom Navigation & ScrollSpy
 * Navigasi bawah melayang yang mengikuti posisi scroll section.
 */
document.addEventListener('DOMContentLoaded', () => {
  const bottomNav = document.getElementById('bottomNav');
  const navItems = document.querySelectorAll('.bottom-nav .nav-item');
  const sections = document.querySelectorAll('section[id]');

  if (!bottomNav || !navItems.length) return;

  // Show bottom nav after cover opens
  const coverScreen = document.getElementById('coverScreen');
  if (coverScreen) {
    const btnOpen = document.getElementById('btnOpen');
    if (btnOpen) {
      btnOpen.addEventListener('click', () => {
        setTimeout(() => {
          bottomNav.classList.add('visible');
        }, 800);
      });
    }
  }

  // ScrollSpy: highlight active nav item based on scroll position
  function updateNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('data-target') === section.getAttribute('id')) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  // Initial update
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });
});