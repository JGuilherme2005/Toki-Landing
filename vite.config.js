import { defineConfig } from 'vite';

// GitHub Pages serves the site under /Toki-Landing/, so we need a base prefix there.
// Vercel serves at root (/), so the prefix would 404 all hashed assets — pick per env.
const isVercel = !!process.env.VERCEL;

export default defineConfig({
  base: isVercel ? '/' : '/Toki-Landing/',
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
});
