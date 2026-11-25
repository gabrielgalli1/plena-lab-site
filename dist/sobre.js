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

  const counterObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.intersectionRatio < 0.6) continue;
      counterObserver.unobserve(entry.target);
      countUp(entry.target);
    }
  }, { threshold: 0.6 });

  document.querySelectorAll('[data-about-count]').forEach(counter => counterObserver.observe(counter));

  const segmentList = document.querySelector('.about-market-list');
  if (!segmentList) return;

  const segments = Array.from(segmentList.children);
  const visibleSegments = new Set();
  const minimumVisibility = 0.12;
  const revealInterval = 210;
  let revealTimer;

  function revealNextSegment() {
    const next = segments.find(segment => visibleSegments.has(segment));
    if (!next) {
      revealTimer = undefined;
      return;
    }

    visibleSegments.delete(next);
    segmentObserver.unobserve(next);
    next.firstElementChild.classList.add('is-visible');
    revealTimer = window.setTimeout(revealNextSegment, revealInterval);
  }

  const segmentObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.intersectionRatio >= minimumVisibility) visibleSegments.add(entry.target);
      else visibleSegments.delete(entry.target);
    }

    if (revealTimer === undefined && visibleSegments.size) revealNextSegment();
  }, { threshold: minimumVisibility });

  segmentList.classList.add('is-animated');
  segments.forEach(segment => segmentObserver.observe(segment));
})();
