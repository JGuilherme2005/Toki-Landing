import { readFile, access } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('dist');
const pages = ['', 'features/', 'android/', 'faq/', 'privacy/'];
const base = process.env.VERCEL ? '/' : '/Toki-Landing/';
const failures = [];
let checked = 0;
for (const page of pages) {
  const html = await readFile(path.join(root, page, 'index.html'), 'utf8');
  const values = [...html.matchAll(/\b(?:src|poster|srcset)=["']([^"']+)["']/g)].flatMap((match) => match[1].split(',').map((part) => part.trim().split(' ')[0]));
  for (const value of values) {
    if (!value || /^(https?:|data:)/.test(value)) continue;
    if (!value.startsWith(base)) { failures.push(`${page || 'home'}: asset outside ${base}: ${value}`); continue; }
    await access(path.join(root, value.slice(base.length))).catch(() => failures.push(`${page || 'home'}: missing asset ${value}`));
    checked++;
  }
}
if (failures.length) {
  console.error(failures.join('\n'));
  process.exit(1);
}
console.log(`Verified ${checked} built asset references across ${pages.length} pages.`);
