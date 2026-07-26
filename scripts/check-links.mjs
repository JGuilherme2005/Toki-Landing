import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const ids = new Set([...html.matchAll(/\bid=["']([^"']+)["']/g)].map((match) => match[1]));
const fragments = [...html.matchAll(/\bhref=["']#([^"']+)["']/g)].map((match) => match[1]);
const missingFragments = [...new Set(fragments)].filter((fragment) => !ids.has(fragment));
const forbiddenPaths = [...html.matchAll(/\b(?:src|href|poster)=["']([^"']+)["']/g)]
  .map((match) => match[1])
  .filter((value) => value.startsWith('../') || value.includes('file://') || /^[A-Za-z]:[\\/]/.test(value));

if (missingFragments.length || forbiddenPaths.length) {
  if (missingFragments.length) console.error(`Missing fragment targets: ${missingFragments.join(', ')}`);
  if (forbiddenPaths.length) console.error(`Non-independent paths: ${forbiddenPaths.join(', ')}`);
  process.exit(1);
}

console.log(`Verified ${new Set(fragments).size} fragment links and found no parent/local absolute paths.`);
