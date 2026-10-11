const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const revealItems = document.querySelectorAll('[data-reveal]');

if (!reducedMotion.matches) {
  document.documentElement.classList.add('motion-ready');
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.18 });
  revealItems.forEach(item => observer.observe(item));
  reducedMotion.addEventListener('change', event => {
    if (event.matches) {
      document.documentElement.classList.remove('motion-ready');
      observer.disconnect();
    }
  });
}

let scrollAnimation;
function stopScroll() { cancelAnimationFrame(scrollAnimation); }
window.addEventListener('wheel', stopScroll, { passive: true });
window.addEventListener('touchstart', stopScroll, { passive: true });
window.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) stopScroll();
});

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', event => {
    if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    const target = document.querySelector(link.hash);
    if (!target) return;
    event.preventDefault();
    stopScroll();
    const startY = window.scrollY;
    const endY = Math.min(startY + target.getBoundingClientRect().top, document.documentElement.scrollHeight - innerHeight);
    const distance = endY - startY;
    const duration = reducedMotion.matches ? 0 : Math.abs(distance) <= innerHeight * 1.1 ? 600 : Math.abs(distance) <= innerHeight * 2.1 ? 850 : 1050;
    const started = performance.now();
    history.pushState(null, '', link.hash);
    function frame(now) {
      const progress = duration ? Math.min((now - started) / duration, 1) : 1;
      const eased = progress < 0.5 ? 4 * progress ** 3 : 1 - (-2 * progress + 2) ** 3 / 2;
      window.scrollTo(0, startY + distance * eased);
      if (progress < 1) scrollAnimation = requestAnimationFrame(frame);
      else { target.tabIndex = -1; target.focus({ preventScroll: true }); }
    }
    scrollAnimation = requestAnimationFrame(frame);
  });
});

// Decorative motion stays separate from the document's natural scrolling.
const art = [...document.querySelectorAll('.art')];
let driftFrame;
function updateDrift() {
  driftFrame = null;
  if (reducedMotion.matches) return;
  art.forEach(layer => {
    const bounds = layer.parentElement.getBoundingClientRect();
    if (bounds.bottom > 0 && bounds.top < innerHeight) {
      const progress = Math.max(-1, Math.min(1, bounds.top / innerHeight));
      layer.style.setProperty('--drift', `${progress * 12}px`);
    }
  });
}
window.addEventListener('scroll', () => {
  if (!driftFrame) driftFrame = requestAnimationFrame(updateDrift);
}, { passive: true });
