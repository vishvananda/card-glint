// Frame registration needs reference scans, never proposed or Oracle wording.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { cacheRoot, hash, writeJson } from './common.mjs';
const [set, out] = process.argv.slice(2);
assert(['ced', 'cei'].includes(set) && out, 'Usage: early-scan-only-inputs.mjs ced|cei OUT');
const bytes = await readFile(path.join(cacheRoot, 'sets', set + '.json')),
  snapshot = JSON.parse(bytes);
assert(snapshot.complete);
assert.equal(snapshot.entries.length, 302);
const entries = snapshot.entries.map((e) => {
  assert(!e.issue && e.reference?.sha256);
  const card = e.card,
    material = /\bLand\b/.test(card.type_line)
      ? 'L'
      : /\bArtifact\b/.test(card.type_line)
        ? 'A'
        : card.colors?.length === 1
          ? card.colors[0]
          : 'C';
  return { id: e.id, card, reference: e.reference, material };
});
await mkdir(out, { recursive: true });
await writeJson(path.join(out, 'scan-only-inputs.json'), {
  schema: 1,
  set,
  status: 'scan-only-no-wording-or-renderer-fit',
  snapshotHash: hash(bytes),
  inventory: 302,
  scope:
    'Only immutable physical references and broad material labels. No face, rules, type-line, artist or Oracle data enters the scan-boundary objective. Wording proposals remain unreviewed and cannot supply rendered/text calibration evidence.',
  entries,
});
console.log(set + ':302 scan-only references prepared.');
