(() => {
  'use strict';

  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  if (reducedMotion.matches || !('IntersectionObserver' in window)) return;

  const formatNumber = new Intl.NumberFormat('pt-BR');
  const duration = 2400;

  function countUp(counter) {
    const target = Number(counter.dataset.aboutCount);
    const startedAt = performance.now();
    let previousValue = 0;

    function renderFrame(timestamp) {
      const elapsed = Math.max(0, timestamp - startedAt);
      const progress = reducedMotion.matches ? 1 : Math.min(elapsed / duration, 1);
      const easedProgress = 1 - (1 - progress) ** 2;
      const value = Math.floor(target * easedProgress);

      if (value !== previousValue) {
        counter.textContent = formatNumber.format(value);
        previousValue = value;
      }

      if (progress < 1) requestAnimationFrame(renderFrame);
    }

    counter.textContent = '0';
    requestAnimationFrame(renderFrame);
  }

  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.intersectionRatio < 0.6) continue;
      observer.unobserve(entry.target);
      countUp(entry.target);
    }
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-about-count]').forEach(counter => observer.observe(counter));
})();
