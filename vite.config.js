import { defineConfig } from 'vite';
import { siteShell } from './src/site-shell.js';

// GitHub Pages serves the site under /Toki-Landing/, so we need a base prefix there.
// Vercel serves at root (/), so the prefix would 404 all hashed assets — pick per env.
const isVercel = !!process.env.VERCEL;
const base = isVercel ? '/' : '/Toki-Landing/';

export default defineConfig({
  base,
  plugins: [{
    name: 'shared-site-shell',
    transformIndexHtml(html) {
      const page = html.match(/<html[^>]*data-page="([^"]+)"/)?.[1] || 'home';
      const shell = siteShell(base, page);
      return html.replace('<!-- site-header -->', shell.header).replace('<!-- site-footer -->', shell.footer);
    }
  }],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        main: 'index.html',
        authCallback: 'auth/callback/index.html',
        features: 'features/index.html',
        android: 'android/index.html',
        faq: 'faq/index.html',
        privacy: 'privacy/index.html'
      }
    }
  }
});
