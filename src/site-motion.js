import mp4Url from '../assets/mobile/deep-focus-loop.mp4?url';
import heroUrl from '../assets/hero/frog-reading.mp4?url';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(pointer: fine)');

function attachTiltController(el) {
  let rafId = 0;
  let lastX = 0;
  let lastY = 0;

  const update = () => {
    rafId = 0;
    if (reduced.matches) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const px = Math.max(-0.5, Math.min(0.5, (lastX - rect.left) / rect.width - 0.5));
    const py = Math.max(-0.5, Math.min(0.5, (lastY - rect.top) / rect.height - 0.5));
    el.style.setProperty('--tilt-x', `${(-py * 10).toFixed(2)}deg`);
    el.style.setProperty('--tilt-y', `${(px * 12).toFixed(2)}deg`);
    el.style.setProperty('--glare-x', `${((px + 0.5) * 100).toFixed(1)}%`);
    el.style.setProperty('--glare-y', `${((py + 0.5) * 100).toFixed(1)}%`);
  };

  const reset = () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = 0;
    }
    el.style.removeProperty('--tilt-x');
    el.style.removeProperty('--tilt-y');
    el.style.removeProperty('--glare-x');
    el.style.removeProperty('--glare-y');
  };

  el.addEventListener('pointermove', (event) => {
    if (reduced.matches) return;
    if (event.pointerType && event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
    lastX = event.clientX;
    lastY = event.clientY;
    if (!rafId) rafId = requestAnimationFrame(update);
  });

  el.addEventListener('pointerleave', reset);
  el.addEventListener('pointercancel', reset);
}

const TILT_SELECTOR = '.pond-stage, .visual-crop, .phone-frame, .phone-gallery figure';

if (!reduced.matches && finePointer.matches) {
  document.querySelectorAll(TILT_SELECTOR).forEach(attachTiltController);
}


reduced.addEventListener?.('change', () => {
  if (!reduced.matches) return;
  document.querySelectorAll(TILT_SELECTOR).forEach((el) => {
    el.style.removeProperty('--tilt-x');
    el.style.removeProperty('--tilt-y');
    el.style.removeProperty('--glare-x');
    el.style.removeProperty('--glare-y');
  });
});

if (!reduced.matches && 'IntersectionObserver' in window) {
  const pond = document.querySelector('.pond-video');
  let pondVisible = false;
  if (pond) {
    const pondObserver = new IntersectionObserver(([entry]) => {
      pondVisible = entry.isIntersecting;
      if (entry.isIntersecting) {
        if (!pond.querySelector('source')) {
          const source = document.createElement('source');
          source.src = heroUrl;
          source.type = 'video/mp4';
          pond.append(source);
          pond.load();
        }
        if (!document.hidden) pond.play().catch(() => {});
      } else {
        pond.pause();
      }
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
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  sections.forEach((section) => {
    section.classList.add('motion-ready');
    reveal.observe(section);
  });

  const phones = document.querySelectorAll('[data-animated-phone]');
  function setPlaying(target, shouldPlay) {
    const video = target.querySelector('video');
    const frame = target.querySelector('.phone-frame');
    const timer = target.querySelector('.phone-timer');
    if (!shouldPlay || document.hidden || !video.querySelector('source')) {
      video.pause();
      clearInterval(target.tick);
      frame.classList.remove('is-playing');
      return;
    }
    video.play().then(() => {
      if (!target.isVisible || document.hidden) {
        video.pause();
        return;
      }
      frame.classList.add('is-playing');
      if (!target.remaining) target.remaining = 24 * 60 + 53;
      clearInterval(target.tick);
      target.tick = setInterval(() => {
        target.remaining = Math.max(0, target.remaining - 1);
        const minutes = String(Math.floor(target.remaining / 60)).padStart(2, '0');
        const seconds = String(target.remaining % 60).padStart(2, '0');
        timer.textContent = `${minutes}:${seconds}`;
        if (!target.remaining) clearInterval(target.tick);
      }, 1000);
    }).catch(() => {});
  }
  const near = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      const video = target.querySelector('video');
      const source = document.createElement('source');
      source.src = mp4Url;
      source.type = 'video/mp4';
      video.append(source);
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

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      pond?.pause();
      phones.forEach((phone) => setPlaying(phone, false));
      return;
    }
    if (pond && pondVisible && !reduced.matches) {
      pond.play().catch(() => {});
    }
    phones.forEach((phone) => {
      if (phone.isVisible && !reduced.matches) setPlaying(phone, true);
    });
  });
}

// Tactile pointer-tracked lantern sheen on primary CTA and interactive store pills.
if (!reduced.matches) {
  document.querySelectorAll('.cta-primary, a.store-pill').forEach((el) => {
    el.addEventListener('pointermove', (event) => {
      if (event.pointerType === 'touch') return;
      const rect = el.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / Math.max(rect.width, 1)) * 100;
      const y = ((event.clientY - rect.top) / Math.max(rect.height, 1)) * 100;
      el.style.setProperty('--mx', `${x.toFixed(1)}%`);
      el.style.setProperty('--my', `${y.toFixed(1)}%`);
    }, { passive: true });
  });
}
