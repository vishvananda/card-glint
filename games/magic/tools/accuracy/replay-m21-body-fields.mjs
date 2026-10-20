import fs from 'node:fs/promises';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
import { root as projectRoot, cacheRoot, hash as digest } from './common.mjs';
const root = projectRoot.replace(/\/$/, '');
const [outputFile] = process.argv.slice(2);
if (!outputFile) throw Error('Usage: replay-m21-body-fields.mjs OUTPUT');
const base = root + '/games/magic/tools/accuracy/';
const { hash } = await import(base + 'common.mjs');
const { printingTextIndex } = await import(base + 'printing-text.mjs');
const current = await import(base + 'adapter.mjs');
const receipt = JSON.parse(
  await fs.readFile(root + '/games/magic/fixtures/accuracy/m21-body-field-compatibility.json'),
);
const currentFields = await fs.readFile(base + 'printing-fields.mjs');
assert.equal(digest(currentFields), receipt.change.after);
const lines = currentFields.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
for (const edit of receipt.change.reverseEdits) lines.splice(edit.start, edit.count, ...edit.lines);
const before = lines.join('');
assert.equal(digest(before), receipt.change.before);
const normalized =
  before.replace(
    'export function reviewedPrintingFields(',
    'function priorReviewedPrintingFields(',
  ) +
  `\nexport function reviewedPrintingFields(e,a){if(Array.isArray(a.reviewedFields)){for(const field of a.reviewedFields.filter(f=>['rulesText','flavorText'].includes(f)))if(a.reviewed!==true||typeof a[field]!=='string')throw Error('Invalid legacy body');a={...a,reviewedFields:a.reviewedFields.filter(f=>!['rulesText','flavorText'].includes(f))};}return priorReviewedPrintingFields(e,a);}`;
const src = await fs.readFile(base + 'adapter.mjs', 'utf8');
const oldSrc = src.replace(
  /from '([^']+)'/g,
  (_, p) =>
    'from ' +
    JSON.stringify(
      p === './printing-fields.mjs'
        ? 'data:text/javascript;base64,' + Buffer.from(normalized).toString('base64')
        : new URL(p, pathToFileURL(base + 'adapter.mjs')).href,
    ),
);
const old = await import('data:text/javascript;base64,' + Buffer.from(oldSrc).toString('base64'));
const snapFile = cacheRoot + '/sets/m21.json';
const snap = JSON.parse(await fs.readFile(snapFile));
const sourceFile =
  cacheRoot + '/objects/8ddd3d1156f7a53e966e711111464952e946244d9ef1e9a3a9a0e31be4b89624';
const sourceBytes = await fs.readFile(sourceFile);
assert.equal(hash(sourceBytes), '8ddd3d1156f7a53e966e711111464952e946244d9ef1e9a3a9a0e31be4b89624');
const printing = printingTextIndex(snap, JSON.parse(sourceBytes).data);
const annotations = {},
  inputs = [];
for (const f of ['annotations-empty-rules.json', 'annotations.json']) {
  const p = root + '/games/magic/fixtures/accuracy/m21/' + f,
    b = await fs.readFile(p);
  inputs.push({ file: 'games/magic/fixtures/accuracy/m21/' + f, sha256: hash(b) });
  Object.assign(annotations, JSON.parse(b).cards);
}
const corpusBytes = await fs.readFile(root + '/games/magic/fixtures/accuracy/m21/corpus.json');
const corpus = JSON.parse(corpusBytes),
  ids = new Set(corpus.entries.map((e) => e.id));
const { calibrationPresentation } = await import(base + 'calibration-wording.mjs');
const rows = [];
for (const entry of snap.entries.filter((e) => ids.has(e.id))) {
  assert.equal(entry.reference.sha256, corpus.entries.find((e) => e.id === entry.id).referenceHash);
  const proven = calibrationPresentation(entry, annotations, printing.cards);
  assert.ok(
    ['scan-reviewed', 'mtgjson-original', 'scryfall-printed'].includes(
      proven.wordingEvidence.rules,
    ),
  );
  const b = old.presentation(entry, annotations, printing.cards),
    a = current.presentation(entry, annotations, printing.cards);
  assert.deepEqual(a.face, b.face, entry.card.name);
  assert.deepEqual(a.reviewedFields, b.reviewedFields);
  rows.push({
    id: entry.id,
    name: entry.card.name,
    referenceHash: entry.reference.sha256,
    beforeHash: hash(JSON.stringify(b.face)),
    afterHash: hash(JSON.stringify(a.face)),
    reviewedFields: a.reviewedFields,
    wordingEvidence: proven.wordingEvidence,
  });
}
const legacyBytes = await fs.readFile(
  root + '/games/magic/fixtures/accuracy/m21-original-wording.json',
);
const legacy = JSON.parse(legacyBytes);
assert.equal(legacy.rows.length, 292);
assert.ok(
  legacy.rows.every((r) => rows.some((p) => p.id === r.id && p.referenceHash === r.referenceHash)),
);
assert.equal(rows.length, 297);
inputs.push(
  { file: 'games/magic/tools/accuracy/adapter.mjs', sha256: hash(src) },
  {
    file: 'games/magic/tools/accuracy/calibration-wording.mjs',
    sha256: hash(await fs.readFile(base + 'calibration-wording.mjs')),
  },
  {
    file: 'games/magic/tools/accuracy/printing-text.mjs',
    sha256: hash(await fs.readFile(base + 'printing-text.mjs')),
  },
);
const output = {
  schema: 1,
  tool: {
    file: 'games/magic/tools/accuracy/replay-m21-body-fields.mjs',
    sha256: hash(await fs.readFile(new URL(import.meta.url))),
  },
  legacy: {
    file: 'games/magic/fixtures/accuracy/m21-original-wording.json',
    sha256: hash(legacyBytes),
    ids: legacy.rows.map((r) => r.id),
  },
  scope:
    'M21 only. The prior adapter receives the established caller normalization that validates and removes legacy body field names from partial printing-field lists; the new adapter accepts those validated names directly. All 297 cached prepared original face recipes agree exactly, including the full 292-printing historical calibration inventory, including separate partial fields and body paragraphs. This is source-guard compatibility, not renderer-score or changed-wording reuse.',
  printingFields: {
    file: 'games/magic/tools/accuracy/printing-fields.mjs',
    before: hash(before),
    after: hash(await fs.readFile(base + 'printing-fields.mjs')),
  },
  snapshotHash: hash(await fs.readFile(snapFile)),
  corpusHash: hash(corpusBytes),
  printingSourceHash: hash(sourceBytes),
  dependencies: inputs,
  rows,
};
await fs.writeFile(outputFile, JSON.stringify(output, null, 2) + '\n');
console.log(rows.length, 'identical M21 original face recipes; all 292 historical inputs covered');
