#!/usr/bin/env node
/**
 * Auto-generate registry.json by scanning public/question-packs/
 * Run: node scripts/gen-registry.js
 * Hooked into: npm run build (runs automatically)
 */
import { readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const PACKS_DIR = join(import.meta.dirname, '..', 'public', 'question-packs');
const REGISTRY_PATH = join(PACKS_DIR, 'registry.json');

function scanPacks(dir) {
  const entries = [];

  for (const item of readdirSync(dir)) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      entries.push(...scanPacks(fullPath));
    } else if (item.endsWith('.json') && item !== 'registry.json') {
      try {
        const raw = readFileSync(fullPath, 'utf-8');
        const pack = JSON.parse(raw);

        if (pack.id && pack.name && pack.domain) {
          const filePath = relative(PACKS_DIR, fullPath).replace(/\\/g, '/');
          entries.push({
            id: pack.id,
            name: pack.name,
            domain: pack.domain,
            file: filePath,
            questionCount: Array.isArray(pack.questions) ? pack.questions.length : 0,
            description: pack.description || '',
          });
        }
      } catch (e) {
        console.warn(`⚠ Skipped ${fullPath}: ${e.message}`);
      }
    }
  }

  return entries;
}

const packs = scanPacks(PACKS_DIR);
packs.sort((a, b) => a.domain.localeCompare(b.domain) || a.id.localeCompare(b.id));

const registry = { version: '1.0.0', packs };
writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n', 'utf-8');

console.log(`✓ registry.json: ${packs.length} packs across ${new Set(packs.map(p => p.domain)).size} domains`);
