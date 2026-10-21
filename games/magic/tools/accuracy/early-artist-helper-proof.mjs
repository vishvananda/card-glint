// Exact data-helper differential; no renderer or score certification is implied.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync as runFile } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { hash, writeJson, root } from './common.mjs';
const execFileSync = (file, args) => runFile(file, args, { maxBuffer: 16 * 1024 * 1024 });
const [base, scratch, out] = process.argv.slice(2);
assert(out, 'Usage: early-artist-helper-proof.mjs BEFORE_COMMIT SCRATCH OUTPUT');
const file = 'games/magic/tools/accuracy/printed-artist.mjs';
const before = execFileSync('git', ['show', base + ':' + file]);
const after = await readFile(file);
const addition =
  "import unlimitedFinal from '../../fixtures/accuracy/2ed/annotations-artist-final.json' with { type: 'json' };\n";
const bodyMarker = '/** Exact physical credits';
assert.equal(
  after.toString().split(bodyMarker)[1],
  before.toString().split(bodyMarker)[1],
  'Credit lookup/guards changed',
);
const canonical = (s) => s.replace(/\s+/g, '').replace(/,\]/g, ']');
const restored = after
  .toString()
  .replace(addition, '')
  .replace(/\bunlimitedFinal\b,?/g, '');
assert.equal(
  canonical(restored),
  canonical(before.toString()),
  'More than the added artist map changed',
);
await mkdir(scratch, { recursive: true });
const rewritten = before
  .toString()
  .replace(
    /from '([^']+\.json)'/g,
    (_, relative) =>
      'from ' + JSON.stringify(pathToFileURL(path.resolve(path.dirname(file), relative)).href),
  );
const oldFile = path.resolve(scratch, 'artist-before.mjs');
await writeFile(oldFile, rewritten);
const a = (await import(pathToFileURL(oldFile))).printedArtistAnnotation;
const b = (await import(pathToFileURL(path.resolve(file)))).printedArtistAnnotation;
const prior = JSON.parse(
  execFileSync('git', [
    'show',
    base + ':games/magic/fixtures/accuracy/printing-review-catalog.json',
  ]),
);
const current = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/printing-review-catalog.json'),
);
const added = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/2ed/annotations-artist-final.json'),
);
assert.equal(Object.keys(prior.artists).length, 182);
assert.equal(Object.keys(added.cards).length, 13);
assert.deepEqual(prior.wording, current.wording);
const rows = [];
for (const [id, credit] of Object.entries(current.artists)) {
  const data = JSON.parse(await readFile(credit.source));
  const r = data.cards?.[id] ?? data.rows?.find((r) => r.id === id);
  assert(r, 'Missing source metadata: ' + id);
  const card = {
    id,
    set: current.sets[id],
    name: r.name,
    collector_number: r.number ?? r.collectorNumber,
  };
  const entry = { card, reference: { sha256: credit.referenceSha256 } };
  const old = a(entry),
    next = b(entry);
  if (Object.hasOwn(added.cards, id)) {
    assert.deepEqual(old, {});
    assert.equal(next.artist, credit.artist);
    assert.deepEqual(next.reviewedFields, ['artist']);
    assert.throws(() => b({ ...entry, reference: { sha256: '0'.repeat(64) } }), /stale/);
    assert.throws(() => b({ ...entry, card: { ...card, set: 'unrelated' } }), /stale/);
  } else {
    assert.deepEqual(credit, prior.artists[id]);
    assert.deepEqual(next, old);
  }
  rows.push({
    id,
    set: card.set,
    name: card.name,
    referenceHash: credit.referenceSha256,
    before: old,
    after: next,
    changed: JSON.stringify(old) !== JSON.stringify(next),
  });
}
assert.equal(rows.length, 195);
assert.equal(rows.filter((r) => r.changed).length, 13);
assert.deepEqual(a({ card: { id: 'unknown' } }), {});
assert.deepEqual(b({ card: { id: 'unknown' } }), {});
const fixture = 'games/magic/fixtures/accuracy/2ed/annotations-artist-final.json';
await writeJson(out, {
  schema: 1,
  scope:
    'Exact artist-only metadata helper differential, all 182 existing public reviews unchanged and thirteen exact Unlimited additions. Unknown ids preserve empty result; new rows reject stale scans and wrong sets. No pixel/score approval for changed Unlimited credits.',
  base,
  file,
  before: hash(before),
  after: hash(after),
  newData: { file: fixture, sha256: hash(await readFile(fixture)) },
  beforeSource: before.toString(),
  rows,
  summary: {
    existingUnchanged: 182,
    newExactCredits: 13,
    total: 195,
    staleScanGuards: 13,
    wrongSetGuards: 13,
  },
});
console.log(
  JSON.stringify({
    existingUnchanged: 182,
    newCredits: 13,
    sourceBefore: hash(before),
    sourceAfter: hash(after),
  }),
);
