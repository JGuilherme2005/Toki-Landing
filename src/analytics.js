const domain = import.meta.env.VITE_PLAUSIBLE_DOMAIN?.trim();

if (domain) {
  const script = document.createElement('script');
  script.defer = true;
  script.dataset.domain = domain;
  script.src = 'https://plausible.io/js/script.js';
  document.head.appendChild(script);

  document.querySelectorAll('.cta-primary, .nav-cta, .footer-links a[href*="/releases/download/"]').forEach((link) => {
    link.addEventListener('click', () => {
      window.plausible = window.plausible || function plausible() {
        (window.plausible.q = window.plausible.q || []).push(arguments);
      };
      window.plausible('Download', { props: { placement: link.textContent.trim() } });
    });
  });
}
