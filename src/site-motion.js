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

const TILT_SELECTOR = '.pond-stage, .visual-crop, .phone-frame, .phone-gallery figure, .feedback-card';

if (!reduced.matches && finePointer.matches) {
  document.querySelectorAll(TILT_SELECTOR).forEach(attachTiltController);
}

let stopSpotlightForReducedMotion = () => {};

reduced.addEventListener?.('change', () => {
  if (!reduced.matches) return;
  document.querySelectorAll(TILT_SELECTOR).forEach((el) => {
    el.style.removeProperty('--tilt-x');
    el.style.removeProperty('--tilt-y');
    el.style.removeProperty('--glare-x');
    el.style.removeProperty('--glare-y');
  });
  stopSpotlightForReducedMotion();
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
  const sections = document.querySelectorAll('.story, .feedback-section, .inner-section, .inner-hero');
  const reveal = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      target.classList.add('is-visible');
      if (target.classList.contains('feedback-section')) {
        window.setTimeout(() => target.classList.add('is-settled'), 900);
      }
      reveal.unobserve(target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0 });
  sections.forEach((section) => {
    section.classList.add('motion-ready');
    reveal.observe(section);
  });

  const feedbackSection = document.querySelector('#feedback');
  const feedbackCards = feedbackSection
    ? [...feedbackSection.querySelectorAll('.feedback-group:not([aria-hidden="true"]) .feedback-card')]
    : [];
  let feedbackVisible = false;
  let spotlightIndex = 0;
  let spotlightTimer = 0;
  let hoveredCard = null;
  let focusedCard = null;
  let clickedPaused = false;

  const applySpotlight = (index) => {
    if (!feedbackCards.length) return;
    spotlightIndex = ((index % feedbackCards.length) + feedbackCards.length) % feedbackCards.length;
    feedbackCards.forEach((card, i) => {
      card.classList.toggle('is-spotlight', i === spotlightIndex);
    });
  };

  const stopSpotlight = () => {
    if (!spotlightTimer) return;
    clearInterval(spotlightTimer);
    spotlightTimer = 0;
  };

  const syncSpotlight = () => {
    if (!feedbackCards.length) return;
    const shouldCycle = feedbackVisible && !reduced.matches && !document.hidden && !hoveredCard && !focusedCard && !clickedPaused;
    if (!shouldCycle) {
      stopSpotlight();
      return;
    }
    applySpotlight(spotlightIndex);
    if (!spotlightTimer) {
      spotlightTimer = window.setInterval(() => applySpotlight(spotlightIndex + 1), 3800);
    }
  };

  stopSpotlightForReducedMotion = () => {
    stopSpotlight();
    feedbackCards.forEach((card) => card.classList.remove('is-spotlight'));
    feedbackSection?.classList.add('is-visible', 'is-settled');
  };

  if (feedbackSection && feedbackCards.length) {
    const spotlightObserver = new IntersectionObserver(([entry]) => {
      feedbackVisible = entry.isIntersecting;
      if (feedbackVisible && !reduced.matches) {
        applySpotlight(spotlightIndex);
      }
      syncSpotlight();
    }, { threshold: 0.08 });
    spotlightObserver.observe(feedbackSection);

    feedbackCards.forEach((card, index) => {
      card.addEventListener('pointerenter', (event) => {
        if (reduced.matches || event.pointerType === 'touch') return;
        hoveredCard = card;
        clickedPaused = false;
        applySpotlight(index);
        syncSpotlight();
      });

      card.addEventListener('pointerleave', () => {
        if (hoveredCard === card) hoveredCard = null;
        clickedPaused = false;
        syncSpotlight();
      });

      card.addEventListener('focusin', () => {
        if (reduced.matches) return;
        focusedCard = card;
        applySpotlight(index);
        syncSpotlight();
      });

      card.addEventListener('focusout', (event) => {
        if (focusedCard === card && !card.contains(event.relatedTarget)) {
          focusedCard = null;
        }
        syncSpotlight();
      });

      card.addEventListener('click', () => {
        if (reduced.matches) return;
        clickedPaused = true;
        applySpotlight(index);
        syncSpotlight();
      });
    });

    document.addEventListener('pointerdown', (event) => {
      if (clickedPaused && !feedbackSection.contains(event.target)) {
        clickedPaused = false;
        syncSpotlight();
      }
    });
  }

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
      stopSpotlight();
      phones.forEach((phone) => setPlaying(phone, false));
      return;
    }
    if (pond && pondVisible && !reduced.matches) {
      pond.play().catch(() => {});
    }
    syncSpotlight();
    phones.forEach((phone) => {
      if (phone.isVisible && !reduced.matches) setPlaying(phone, true);
    });
  });
}

// Lightweight zero-drift 60s Calm Focus preview (works with or without motion).
const focusTry = document.querySelector('[data-focus-try]');
if (focusTry) {
  const clockEl = focusTry.querySelector('[data-focus-clock]');
  const toggleBtn = focusTry.querySelector('[data-focus-toggle]');
  const chimeBtn = focusTry.querySelector('[data-focus-chime]');
  const resetBtn = focusTry.querySelector('[data-focus-reset]');
  const TOTAL_MS = 60_000;
  let remainingMs = TOTAL_MS;
  let deadline = 0;
  let timerId = 0;
  let chimeOn = false;

  const playPondChime = () => {
    if (!chimeOn) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    try {
      const ctx = new AudioCtx();
      const now = ctx.currentTime;
      for (const [freq, gainPeak, dur] of [[528, 0.08, 1.4], [792, 0.04, 1.1]]) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(gainPeak, now + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + dur + 0.05);
      }
      window.setTimeout(() => ctx.close().catch(() => {}), 1600);
    } catch {
      // Ignore blocked Web Audio contexts silently.
    }
  };

  chimeBtn?.addEventListener('click', () => {
    chimeOn = !chimeOn;
    chimeBtn.setAttribute('aria-pressed', String(chimeOn));
    chimeBtn.textContent = chimeOn ? 'Chime: on' : 'Chime: off';
    if (chimeOn) playPondChime();
  });

  const formatMs = (ms) => {
    const secs = Math.max(0, Math.ceil(ms / 1000));
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const renderTimer = (state) => {
    focusTry.dataset.state = state;
    const progress = state === 'idle' ? 0 : state === 'done' ? 1 : Math.min(1, Math.max(0, 1 - remainingMs / TOTAL_MS));
    focusTry.style.setProperty('--focus-progress', progress.toFixed(4));
    if (clockEl) clockEl.textContent = state === 'done' ? 'Done' : formatMs(remainingMs);
    if (toggleBtn) {
      toggleBtn.textContent = state === 'running'
        ? 'Pause'
        : state === 'paused'
          ? 'Resume'
          : state === 'done'
            ? 'Run again'
            : 'Try 60s focus';
    }
    if (resetBtn) resetBtn.hidden = state === 'idle';
  };

  const stopTick = () => {
    if (timerId) {
      window.clearInterval(timerId);
      timerId = 0;
    }
  };

  const tick = () => {
    remainingMs = Math.max(0, deadline - Date.now());
    if (remainingMs <= 0) {
      stopTick();
      renderTimer('done');
      playPondChime();
      return;
    }
    renderTimer('running');
  };

  toggleBtn?.addEventListener('click', () => {
    if (focusTry.dataset.state === 'running') {
      remainingMs = Math.max(0, deadline - Date.now());
      stopTick();
      renderTimer('paused');
      return;
    }
    if (remainingMs <= 0 || focusTry.dataset.state === 'done') {
      remainingMs = TOTAL_MS;
    }
    deadline = Date.now() + remainingMs;
    renderTimer('running');
    stopTick();
    timerId = window.setInterval(tick, 250);
  });

  resetBtn?.addEventListener('click', () => {
    stopTick();
    remainingMs = TOTAL_MS;
    renderTimer('idle');
  });

  renderTimer('idle');
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
