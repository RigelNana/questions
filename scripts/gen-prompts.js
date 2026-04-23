#!/usr/bin/env node
/**
 * Parse plan markdown files and generate copy-paste prompts for batch question generation.
 *
 * Usage:
 *   node scripts/gen-prompts.js                          # show all pending questions
 *   node scripts/gen-prompts.js distributed-system       # show pending for one domain
 *   node scripts/gen-prompts.js distributed-system 1-5   # generate prompts for questions 1-5
 *   node scripts/gen-prompts.js --stats                  # show progress stats
 */
import { readFileSync, readdirSync, existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

const ROOT = join(import.meta.dirname, '..');
const PLANS_DIR = join(ROOT, 'plans');
const PACKS_DIR = join(ROOT, 'public', 'question-packs');
const PROMPTS_DIR = join(ROOT, 'prompts');

// ── Parse a plan markdown file ──

function parsePlan(filePath) {
  const text = readFileSync(filePath, 'utf-8');
  const domain = basename(filePath, '.md');
  const questions = [];

  // Match table rows: | # | 题目 | type | difficulty | file | 状态 |
  const lines = text.split(/\r?\n/);
  let currentSection = '';
  let sectionDescription = '';
  let sectionFileId = null;

  for (const line of lines) {
    // Detect section headers like "## 1. CAP与BASE"
    const sectionMatch = line.match(/^##\s+\d+\.\s+(.+)/);
    if (sectionMatch) {
      currentSection = sectionMatch[1].trim();
      sectionFileId = null;
      sectionDescription = '';
      continue;
    }

    // Detect section description like "> CAP theorem, BASE, consistency models"
    // or "> file: `sql-basics.json` — SELECT, JOIN types, ..."
    const descMatch = line.match(/^>\s+(?!领域|目标|类型|难度|已有)(.+)/);
    if (descMatch && currentSection) {
      const desc = descMatch[1].trim();
      // Extract file ID from "> file: `xxx.json` — ..." format
      const fileMatch = desc.match(/^file:\s*`([^`]+)`/);
      if (fileMatch) {
        sectionFileId = fileMatch[1].replace(/\.json$/, '').trim();
        sectionDescription = desc.replace(/^file:\s*`[^`]+`\s*[—\-]\s*/, '').trim();
      } else {
        sectionDescription = desc;
      }
      continue;
    }

    // Match table data rows — two formats:
    // 6-col: | # | title | type | difficulty | file | status |
    // 5-col: | # | title | type | difficulty | status |
    const row6 = line.match(
      /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*([\w-]+)\s*\|\s*(\d)\s*\|\s*(.*?)\s*\|\s*(.*?)\s*\|/
    );
    const row5 = !row6 && line.match(
      /^\|\s*(\d+)\s*\|\s*(.+?)\s*\|\s*([\w-]+)\s*\|\s*(\d)\s*\|\s*(.*?)\s*\|/
    );

    if (row6 || row5) {
      let num, title, type, difficulty, rawFile, rawStatus;
      if (row6) {
        [, num, title, type, difficulty, rawFile, rawStatus] = row6;
      } else {
        [, num, title, type, difficulty, rawStatus] = row5;
        rawFile = '';
      }

      // Clean file field: strip backticks, .json extension, path prefix, dashes
      let file = (rawFile || '').trim().replace(/`/g, '').replace(/\.json$/, '').trim();
      if (file === '-' || file === '—' || file === '') file = null;
      // If file has path prefix like "go/file-id", strip the prefix
      if (file && file.includes('/')) file = file.split('/').pop();

      // For 5-col format, check section description for file info
      // e.g. "> file: `sql-basics.json` — ..."
      if (!file && sectionFileId) file = sectionFileId;

      const status = (rawStatus || '').trim();
      questions.push({
        num: parseInt(num),
        title: title.trim(),
        type: type.trim(),
        difficulty: parseInt(difficulty),
        file: file || null,
        done: status === '✅',
        domain,
        section: currentSection,
        sectionTags: sectionDescription,
      });
    }
  }

  return questions;
}

// ── Check which questions already have JSON files ──

function getExistingFiles(domain) {
  const dir = join(PACKS_DIR, domain);
  if (!existsSync(dir)) return new Set();
  return new Set(
    readdirSync(dir).filter(f => f.endsWith('.json')).map(f => f.replace('.json', ''))
  );
}

// ── Generate a file ID from domain and title ──

function generateFileId(domain, num, title) {
  // Use domain prefix + simplified title
  const prefix = {
    'distributed-system': 'ds',
    'computer-network': 'cn',
    'operating-system': 'os',
    'go': 'go',
    'redis': 'redis',
    'kafka': 'kafka',
    'database': 'db',
    'linux': 'linux',
    'docker': 'docker',
    'kubernetes': 'k8s',
    'cicd': 'cicd',
    'monitoring': 'mon',
    'troubleshooting': 'ts',
  }[domain] || domain.slice(0, 3);

  // Simple slug from title (keep Chinese chars, just add number)
  return `${prefix}-q${num}`;
}

// ── Generate prompt for a question ──

function generatePrompt(q) {
  return [
    `使用 bagu-writer skill 生成以下题目的完整 JSON 文件：`,
    ``,
    `- **domain**: \`${q.domain}\``,
    `- **file-id**: \`${q.fileId}\``,
    `- **section**: ${q.section} (${q.sectionTags})`,
    `- **title**: ${q.title}`,
    `- **type**: \`${q.type}\``,
    `- **difficulty**: ${q.difficulty}`,
    ``,
    `输出到 \`public/question-packs/${q.domain}/${q.fileId}.json\``,
  ].join('\n');
}

// ── Main ──

const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`Usage:
  node scripts/gen-prompts.js                          # show all pending
  node scripts/gen-prompts.js <domain>                 # show pending for domain
  node scripts/gen-prompts.js <domain> <range>         # generate prompts (e.g. 1-5)
  node scripts/gen-prompts.js --stats                  # progress stats
  node scripts/gen-prompts.js --export <domain> <range> # export prompts to files`);
  process.exit(0);
}

// Parse all plans
const allQuestions = [];
for (const file of readdirSync(PLANS_DIR).filter(f => f.endsWith('.md'))) {
  allQuestions.push(...parsePlan(join(PLANS_DIR, file)));
}

// Assign file IDs (use plan-specified file if present, else generate one)
for (const q of allQuestions) {
  q.fileId = q.file || generateFileId(q.domain, q.num, q.title);
}

// Check existing files
for (const q of allQuestions) {
  const existing = getExistingFiles(q.domain);
  q.hasFile = existing.has(q.fileId);
}

// ── --stats mode ──
if (args.includes('--stats')) {
  const byDomain = {};
  for (const q of allQuestions) {
    if (!byDomain[q.domain]) byDomain[q.domain] = { total: 0, done: 0 };
    byDomain[q.domain].total++;
    if (q.hasFile) byDomain[q.domain].done++;
  }

  console.log('\n📊 Generation Progress:\n');
  console.log('Domain'.padEnd(25) + 'Done'.padStart(6) + 'Total'.padStart(8) + '  Progress');
  console.log('─'.repeat(55));

  let totalDone = 0, totalAll = 0;
  for (const [domain, stat] of Object.entries(byDomain).sort((a, b) => a[0].localeCompare(b[0]))) {
    const pct = Math.round(stat.done / stat.total * 100);
    const bar = '█'.repeat(Math.round(pct / 5)) + '░'.repeat(20 - Math.round(pct / 5));
    console.log(`${domain.padEnd(25)}${String(stat.done).padStart(6)}${String(stat.total).padStart(8)}  ${bar} ${pct}%`);
    totalDone += stat.done;
    totalAll += stat.total;
  }

  console.log('─'.repeat(55));
  const totalPct = Math.round(totalDone / totalAll * 100);
  console.log(`${'TOTAL'.padEnd(25)}${String(totalDone).padStart(6)}${String(totalAll).padStart(8)}  ${totalPct}%`);
  console.log();
  process.exit(0);
}

// ── Filter by domain ──
const targetDomain = args[0];
const range = args[1]; // e.g. "1-5" or "3"
const exportMode = args.includes('--export');

let filtered = allQuestions;
if (targetDomain && targetDomain !== '--export') {
  filtered = allQuestions.filter(q => q.domain === targetDomain);
  if (filtered.length === 0) {
    console.error(`No questions found for domain: ${targetDomain}`);
    console.error(`Available: ${[...new Set(allQuestions.map(q => q.domain))].join(', ')}`);
    process.exit(1);
  }
}

// ── Filter by range ──
if (range) {
  const rangeMatch = range.match(/^(\d+)(?:-(\d+))?$/);
  if (rangeMatch) {
    const start = parseInt(rangeMatch[1]);
    const end = rangeMatch[2] ? parseInt(rangeMatch[2]) : start;
    filtered = filtered.filter(q => q.num >= start && q.num <= end);
  }
}

// ── No range: show pending list ──
if (!range) {
  const pending = filtered.filter(q => !q.hasFile);
  console.log(`\n📋 ${targetDomain || 'All'}: ${pending.length} pending / ${filtered.length} total\n`);

  let lastSection = '';
  for (const q of pending) {
    if (q.section !== lastSection) {
      console.log(`\n  [${q.section}]`);
      lastSection = q.section;
    }
    console.log(`  #${String(q.num).padStart(3)}  ${q.type.padEnd(12)} D${q.difficulty}  ${q.title}`);
  }

  if (pending.length > 0) {
    console.log(`\n💡 To generate prompts: node scripts/gen-prompts.js ${targetDomain || '<domain>'} <start>-<end>`);
  }
  process.exit(0);
}

// ── Generate prompts ──
const pending = filtered.filter(q => !q.hasFile);
if (pending.length === 0) {
  console.log('✅ All questions in this range already have files!');
  process.exit(0);
}

if (exportMode) {
  // Export to prompt files
  if (!existsSync(PROMPTS_DIR)) mkdirSync(PROMPTS_DIR, { recursive: true });
  for (const q of pending) {
    const prompt = generatePrompt(q);
    const outPath = join(PROMPTS_DIR, `${q.fileId}.txt`);
    writeFileSync(outPath, prompt, 'utf-8');
  }
  console.log(`📝 Exported ${pending.length} prompts to ${PROMPTS_DIR}/`);
} else {
  // Print prompts to console for copy-paste
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📝 Prompts for ${pending.length} questions (copy-paste to chat):`);
  console.log(`${'='.repeat(60)}\n`);

  for (const q of pending) {
    console.log(generatePrompt(q));
    console.log(`\n${'─'.repeat(60)}\n`);
  }
}
