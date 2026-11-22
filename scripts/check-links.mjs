import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const pages = ['', 'features/', 'android/', 'faq/', 'privacy/'];
const base = process.env.VERCEL ? '/' : '/Toki-Landing/';
const htmlByPage = new Map();
for (const page of pages) htmlByPage.set(page, await readFile(path.join(root, page, 'index.html'), 'utf8'));

const failures = [];
let checked = 0;
for (const [page, html] of htmlByPage) {
  for (const [, rawHref] of html.matchAll(/\bhref=["']([^"']+)["']/g)) {
    const href = rawHref.replaceAll('&amp;', '&');
    if (/^(https?:|mailto:|tel:|data:)/.test(href)) continue;
    const [urlPart, fragment] = href.split('#');
    let target = page;
    if (urlPart) {
      if (!urlPart.startsWith(base)) {
        failures.push(`${page || 'home'}: link outside ${base}: ${href}`);
        continue;
      }
      target = urlPart.slice(base.length);
    }
    if (!target.endsWith('/') && !target.endsWith('.html') && !target.includes('.')) target += '/';
    const targetHtml = htmlByPage.get(target);
    if (targetHtml) {
      if (fragment && !new Set([...targetHtml.matchAll(/\bid=["']([^"']+)["']/g)].map((m) => m[1])).has(fragment)) failures.push(`${page || 'home'}: missing fragment ${href}`);
    } else {
      await access(path.join(root, target)).catch(() => failures.push(`${page || 'home'}: missing target ${href}`));
    }
    checked++;
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Verified ${checked} local links across ${pages.length} pages with base ${base}.`);
