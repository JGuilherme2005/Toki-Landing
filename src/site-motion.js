import webmUrl from '../assets/mobile/deep-focus-loop.webm?url';
import mp4Url from '../assets/mobile/deep-focus-loop.mp4?url';
import heroUrl from '../assets/hero/frog-reading.mp4?url';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');

if (!reduced.matches && 'IntersectionObserver' in window) {
  const pond = document.querySelector('.pond-video');
  if (pond) {
    const pondObserver = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        if (!pond.querySelector('source')) {
          const source = document.createElement('source');
          source.src = heroUrl;
          source.type = 'video/mp4';
          pond.append(source);
          pond.load();
        }
        pond.play().catch(() => {});
      } else pond.pause();
    }, { rootMargin: '200px' });
    pondObserver.observe(pond);
  }
  document.documentElement.classList.add('js-motion');
  const sections = document.querySelectorAll('.story, .inner-section, .inner-hero');
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('is-visible');
      reveal.unobserve(target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
  sections.forEach((section) => {
    section.classList.add('motion-ready');
    reveal.observe(section);
  });

  const phones = document.querySelectorAll('[data-animated-phone]');
  function setPlaying(target, shouldPlay) {
    const video = target.querySelector('video');
    const frame = target.querySelector('.phone-frame');
    const timer = target.querySelector('.phone-timer');
    if (!shouldPlay || !video.querySelector('source')) {
      video.pause();
      clearInterval(target.tick);
      frame.classList.remove('is-playing');
      return;
    }
    video.play().then(() => frame.classList.add('is-playing')).catch(() => {});
    if (!target.remaining) target.remaining = 24 * 60 + 53;
    clearInterval(target.tick);
    target.tick = setInterval(() => {
      target.remaining = Math.max(0, target.remaining - 1);
      const minutes = String(Math.floor(target.remaining / 60)).padStart(2, '0');
      const seconds = String(target.remaining % 60).padStart(2, '0');
      timer.textContent = `${minutes}:${seconds}`;
      if (!target.remaining) clearInterval(target.tick);
    }, 1000);
  }
  const near = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const video = target.querySelector('video');
      const source = document.createElement('source');
      source.src = webmUrl;
      source.type = 'video/webm';
      const fallback = document.createElement('source');
      fallback.src = mp4Url;
      fallback.type = 'video/mp4';
      video.append(source, fallback);
      video.load();
      if (target.isVisible) setPlaying(target, true);
      near.unobserve(target);
    });
  }, { rootMargin: '350px' });
  const visible = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      target.isVisible = isIntersecting;
      target.classList.toggle('is-visible', isIntersecting);
      setPlaying(target, isIntersecting);
    });
  }, { threshold: 0.2 });
  phones.forEach((phone) => { near.observe(phone); visible.observe(phone); });
}
