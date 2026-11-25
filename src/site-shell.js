const download = 'https://github.com/JGuilherme2005/Toki-Landing/releases/download/v1.0.0/toki-setup-1.0.0.exe';

export function siteShell(base, page) {
  const items = [
    ['features', 'Features'], ['android', 'Android preview'], ['faq', 'FAQ'], ['privacy', 'Privacy']
  ];
  const links = items.map(([slug, label]) => `<a href="${base}${slug}/"${page === slug ? ' aria-current="page"' : ''}>${label}</a>`).join('');
  return {
    header: `<a class="skip-link" href="#main">Skip to main content</a><nav class="nav shell" aria-label="Main navigation"><div class="nav-inner"><a class="brand" href="${base}" aria-label="Sylviae home"><img src="${base}assets/icon-64.png" alt="" width="28" height="28"><span>SYLVIAE</span></a><div class="nav-links">${links}</div><a class="nav-cta" href="${download}">Download for Windows <span aria-hidden="true">&darr;</span></a></div></nav>`,
    footer: `<footer class="shell"><p>Local by default. Your timer, tasks, and history stay on your device.</p><nav class="footer-links" aria-label="Footer navigation"><a href="${base}">Home</a>${links}</nav><div class="footer-bottom"><a class="brand" href="${base}" aria-label="Sylviae home"><img src="${base}assets/icon-64.png" alt="" width="24" height="24"><span>SYLVIAE</span></a><span>&copy; 2026 Sylviae &middot; Windows &middot; iOS &amp; Android</span></div></footer>`
  };
}
