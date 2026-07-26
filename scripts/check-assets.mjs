import { access, readFile } from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const html = await readFile(path.join(root, 'index.html'), 'utf8');
const references = [...html.matchAll(/\b(?:src|href|poster)=["']([^"'#]+)["']/g)]
  .map((match) => match[1])
  .filter((value) => !/^(?:https?:|mailto:|tel:|data:)/.test(value));

const missing = [];
for (const reference of new Set(references)) {
  const clean = reference.split('?')[0];
  await access(path.resolve(root, clean)).catch(() => missing.push(reference));
}

if (missing.length) {
  console.error(`Missing local assets:\n${missing.map((item) => `- ${item}`).join('\n')}`);
  process.exit(1);
}

console.log(`Verified ${new Set(references).size} local asset references.`);
