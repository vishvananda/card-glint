import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, root, writeJson, atomicWrite } from './common.mjs';
import { reviewGroupMembership } from './calibration-group-membership.mjs';
const [inputFile, outputFile, apply, ...extra] = process.argv.slice(2);
assert(
  inputFile && outputFile && (!apply || apply === '--apply') && !extra.length,
  'Use ORIGINAL_INPUTS[.gz] REVIEW.json [--apply]',
);
const raw = await fs.readFile(inputFile);
const bytes = inputFile.endsWith('.gz') ? gunzipSync(raw) : raw;
const input = JSON.parse(bytes);
const entries = input.entries.filter((e) => e.card.set === '4ed');
const corpusFile = root + '/games/magic/fixtures/accuracy/4ed/corpus.json';
const corpusBytes = await fs.readFile(corpusFile),
  corpus = JSON.parse(corpusBytes);
assert.equal(corpus.eligibleCount, 378);
assert.equal(entries.length, 378);
assert(
  entries.every((e) => e.face.wordingMode === 'original'),
  'Original wording required',
);
for (const c of corpus.entries) {
  const e = entries.find((e) => e.id === c.id);
  assert(e, 'Missing printing ' + c.id);
  assert.equal(e.name, c.name);
  assert.equal(e.reference.sha256, c.referenceHash, 'Reference changed');
  assert.equal(e.art.sha256, c.artHash, 'Art changed');
}
const ledgerFile = root + '/games/magic/fixtures/accuracy/calibration-progress.json';
const ledgerText = await fs.readFile(ledgerFile, 'utf8');
const ledger = JSON.parse(ledgerText);
const before = ledger.sets.find((s) => s.set === '4ed');
const reviewed = reviewGroupMembership(before, entries);
reviewed.set.priority = 'active';
const sources = {};
for (const file of [
  'fourth-membership-review.mjs',
  'calibration-group-membership.mjs',
  'calibration-groups.mjs',
])
  sources[file] = hash(await fs.readFile(new URL(file, import.meta.url)));
await writeJson(outputFile, {
  schema: 1,
  set: '4ed',
  status: 'exact-membership-and-component-applicability-review',
  inputHash: hash(bytes),
  inputArchiveHash: hash(raw),
  corpusHash: hash(corpusBytes),
  sources,
  beforeSetHash: hash(JSON.stringify(before)),
  afterSetHash: hash(JSON.stringify(reviewed.set)),
  printings: entries.length,
  groups: reviewed.rows.length,
  changes: reviewed.rows.reduce((n, r) => n + r.changes.length, 0),
  rows: reviewed.rows,
  scope:
    'Exact existing group memberships retained. Absent components become not-applicable; present-component tasks and their evidence remain unchanged. No calibration, source wording, scores or set-completion approval is added.',
});
if (apply) {
  ledger.sets[ledger.sets.indexOf(before)] = reviewed.set;
  // Preserve every other set's bytes instead of reformatting the shared ledger.
  const marker = /\n    \{\n      "set": "4ed"/.exec(ledgerText);
  assert(marker, 'Expected top-level Fourth set object');
  const start = ledgerText.indexOf('{', marker.index);
  let depth = 0,
    quoted = false,
    escaped = false,
    end = -1;
  for (let i = start; i < ledgerText.length; i++) {
    const c = ledgerText[i];
    if (quoted) {
      if (escaped) escaped = false;
      else if (c === '\\') escaped = true;
      else if (c === '"') quoted = false;
    } else if (c === '"') quoted = true;
    else if (c === '{') depth++;
    else if (c === '}' && --depth === 0) {
      end = i + 1;
      break;
    }
  }
  assert(end > start, 'Unterminated Fourth set object');
  assert.deepEqual(JSON.parse(ledgerText.slice(start, end)), before);
  const replacement = JSON.stringify(reviewed.set, null, 2).replaceAll('\n', '\n    ');
  const next = ledgerText.slice(0, start) + replacement + ledgerText.slice(end);
  assert.deepEqual(JSON.parse(next), ledger);
  await atomicWrite(ledgerFile, next);
}
console.log({
  groups: reviewed.rows.length,
  printings: entries.length,
  changes: reviewed.rows.reduce((n, r) => n + r.changes.length, 0),
  applied: Boolean(apply),
});
