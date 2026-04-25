#!/usr/bin/env node
/**
 * Auto-generate registry.json by scanning public/question-packs/
 * Run: node scripts/gen-registry.js
 * Hooked into: npm run build (runs automatically)
 */
import { mkdirSync, readdirSync, readFileSync, writeFileSync, statSync } from 'fs';
import { join, relative } from 'path';

const PACKS_DIR = join(import.meta.dirname, '..', 'public', 'question-packs');
const REGISTRY_PATH = join(PACKS_DIR, 'registry.json');
const INDEX_DIR = join(import.meta.dirname, '..', 'public', 'question-index');
const ALL_DOMAINS = [
  'go', 'operating-system', 'computer-network', 'database',
  'redis', 'kafka', 'distributed-system', 'linux',
  'docker', 'kubernetes', 'cicd', 'monitoring', 'troubleshooting',
];

function scanPacks(dir, summariesByDomain) {
  const entries = [];

  for (const item of readdirSync(dir)) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      entries.push(...scanPacks(fullPath, summariesByDomain));
    } else if (item.endsWith('.json') && item !== 'registry.json') {
      try {
        const raw = readFileSync(fullPath, 'utf-8');
        const pack = JSON.parse(raw);

        if (pack.id && pack.name && pack.domain) {
          const filePath = relative(PACKS_DIR, fullPath).replace(/\\/g, '/');
          const questions = Array.isArray(pack.questions) ? pack.questions : [];
          entries.push({
            id: pack.id,
            name: pack.name,
            domain: pack.domain,
            file: filePath,
            questionCount: questions.length,
            description: pack.description || '',
          });

          if (!summariesByDomain.has(pack.domain)) {
            summariesByDomain.set(pack.domain, []);
          }
          summariesByDomain.get(pack.domain).push(
            ...questions.map((q) => ({
              id: q.id,
              domain: q.domain ?? pack.domain,
              type: q.type,
              difficulty: q.difficulty,
              tags: q.tags ?? [],
              title: q.title ?? q.question ?? q.name ?? '',
              keyPoints: q.keyPoints ?? [],
              packId: pack.id,
              packFile: filePath,
            })).filter((q) => q.id),
          );
        }
      } catch (e) {
        console.warn(`⚠ Skipped ${fullPath}: ${e.message}`);
      }
    }
  }

  return entries;
}

const summariesByDomain = new Map();
const packs = scanPacks(PACKS_DIR, summariesByDomain);
packs.sort((a, b) => a.domain.localeCompare(b.domain) || a.id.localeCompare(b.id));
const packOrder = new Map(packs.map((p, i) => [p.id, i]));

const registry = { version: '1.0.0', packs };
writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2) + '\n', 'utf-8');

mkdirSync(INDEX_DIR, { recursive: true });
for (const domain of ALL_DOMAINS) {
  const questions = summariesByDomain.get(domain) ?? [];
  questions.sort((a, b) => (packOrder.get(a.packId) ?? 0) - (packOrder.get(b.packId) ?? 0) || a.id.localeCompare(b.id));
  writeFileSync(
    join(INDEX_DIR, `${domain}.json`),
    JSON.stringify({ version: registry.version, domain, questions }, null, 2) + '\n',
    'utf-8',
  );
}

console.log(`✓ registry.json: ${packs.length} packs across ${new Set(packs.map(p => p.domain)).size} domains`);
console.log(`✓ question-index: ${ALL_DOMAINS.length} domain indexes`);
