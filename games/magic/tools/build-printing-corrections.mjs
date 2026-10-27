/** Build a small public wording catalog from reviewed evidence. No study layout,
 * scan transforms, paths, unreviewed wording or illustration assets enter it. */
import assert from 'node:assert/strict';
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { format } from 'prettier';
const root = new URL('../fixtures/accuracy/', import.meta.url);
const files = (await readdir(root, { recursive: true }))
  .filter((f) => /(?:^|\/)annotations(?:-[\w-]+)?\.json$/.test(f))
  .sort(
    (a, b) =>
      Number(!a.endsWith('/annotations.json')) - Number(!b.endsWith('/annotations.json')) ||
      a.localeCompare(b),
  );
const fieldNames = [
  'name',
  'typeLine',
  'rulesText',
  'flavorText',
  'rulesParagraphs',
  'manaSymbols',
  'power',
  'toughness',
];
const printingSets = new Map();
function rememberSet(id, set) {
  assert.match(set, /^[a-z0-9]{2,8}$/);
  if (printingSets.has(id)) assert.equal(printingSets.get(id), set);
  printingSets.set(id, set);
}
const rows = new Map();
const artistRows = new Map();
function addArtist(id, file, hash, reason, artist) {
  assert.match(id, /^[\da-f-]{36}$/);
  assert.match(hash, /^[\da-f]{64}$/);
  assert.ok(typeof artist === 'string' && artist.trim());
  const review = {
    source: 'games/magic/fixtures/accuracy/' + file,
    referenceSha256: hash,
    reason,
    artist,
  };
  if (artistRows.has(id)) assert.deepEqual(artistRows.get(id), review);
  artistRows.set(id, review);
}
function add(id, faceName, file, hash, reason, fields, paragraphScope) {
  if (!Object.keys(fields).length) return;
  assert.match(id, /^[\da-f-]{36}$/);
  assert.match(hash, /^[\da-f]{64}$/);
  const key = id + ':' + (faceName ?? '');
  if (!rows.has(key)) rows.set(key, { id, faceName, fields: new Map() });
  if (
    !fields.rulesParagraphs &&
    ['rulesText', 'flavorText'].some(
      (field) =>
        Object.hasOwn(fields, field) &&
        rows.get(key).fields.has(field) &&
        rows.get(key).fields.get(field).value !== fields[field],
    )
  )
    rows.get(key).fields.delete('rulesParagraphs');
  for (const [field, value] of Object.entries(fields)) {
    assert.ok(fieldNames.includes(field), field);
    // Each field retains its own evidence, including superseded body reviews.
    rows.get(key).fields.set(field, {
      value,
      source: 'games/magic/fixtures/accuracy/' + file,
      referenceSha256: hash,
      reason,
      ...(field === 'rulesParagraphs' && paragraphScope ? { paragraphScope } : {}),
    });
  }
}
for (const file of files) {
  const data = JSON.parse(await readFile(new URL(file, root)));
  for (const [id, r] of Object.entries(data.cards ?? {})) {
    rememberSet(id, r.set ?? data.set ?? file.split('/')[0]);
    if (r.reviewedFields?.includes('artist'))
      addArtist(
        id,
        file,
        r.referenceHash,
        r.artistReviewNote ??
          r.artistReview ??
          r.reviewNote ??
          'Scan-reviewed printed artist credit; unrelated wording is not certified.',
        r.artist,
      );
    const fields = {};
    for (const field of r.reviewedFields ?? [])
      if (fieldNames.includes(field) && Object.hasOwn(r, field))
        fields[field] = field === 'name' ? (r.printedName ?? r.name) : r[field];
    if (r.reviewed === true) {
      for (const field of ['rulesText', 'flavorText'])
        if (Object.hasOwn(r, field)) fields[field] = r[field];
      if (r.paragraphs) fields.rulesParagraphs = r.paragraphs;
    }
    if (r.flavorReviewNote && Object.hasOwn(r, 'flavorText')) fields.flavorText = r.flavorText;
    if (r.paragraphScope !== undefined) {
      assert.equal(r.paragraphScope, 'rules-only');
      assert(fields.rulesParagraphs?.every((p) => p.role === 'rules'));
    }
    add(
      id,
      undefined,
      file,
      r.referenceHash,
      r.reviewNote ??
        r.typeReviewNote ??
        r.flavorReviewNote ??
        r.note ??
        data.note ??
        'Scan-reviewed original wording.',
      fields,
      r.paragraphScope,
    );
  }
}
const manaFile = 'historic-mana-order.json';
for (const [id, r] of Object.entries(JSON.parse(await readFile(new URL(manaFile, root))).cards)) {
  rememberSet(id, r.set);
  add(id, undefined, manaFile, r.referenceHash, r.note ?? 'Scan-reviewed original mana order.', {
    manaSymbols: r.manaSymbols,
  });
}
for (const file of [
  'adventure-printing-corrections.json',
  'prepare-printing-text.json',
  'future-printing-corrections.json',
  'planar-printing-corrections.json',
]) {
  const data = JSON.parse(await readFile(new URL(file, root)));
  for (const [id, r] of Object.entries(data.cards)) {
    rememberSet(id, r.set);
    for (const face of r.faces) {
      const fields = {};
      for (const [from, to] of [
        ['originalText', 'rulesText'],
        ['originalType', 'typeLine'],
        ['flavorText', 'flavorText'],
        ['originalParagraphs', 'rulesParagraphs'],
      ])
        if (Object.hasOwn(face, from)) fields[to] = face[from];
      if (face.originalParagraphs) {
        assert.ok(face.originalParagraphs.every((p) => p.role === 'rules'));
        assert.equal(
          face.originalParagraphs.map((p) => p.runs.map((r) => r.text).join('')).join('\n'),
          face.originalText,
          'Reviewed styling must retain the exact original rules',
        );
      }
      add(
        id,
        r.faces.length > 1 ? face.name : undefined,
        file,
        r.referenceSha256,
        r.reason,
        fields,
        face.originalParagraphs ? 'rules-only' : undefined,
      );
    }
  }
}
const catalog = {};
for (const { id, faceName, fields } of [...rows.values()].sort(
  (a, b) => a.id.localeCompare(b.id) || (a.faceName ?? '').localeCompare(b.faceName ?? ''),
)) {
  const groups = new Map();
  for (const [field, { value, ...evidence }] of fields) {
    const key = JSON.stringify(evidence);
    if (!groups.has(key))
      groups.set(key, { ...(faceName ? { faceName } : {}), ...evidence, fields: {} });
    groups.get(key).fields[field] = value;
  }
  (catalog[id] ??= []).push(...groups.values());
}
const revision = createHash('sha256').update(JSON.stringify(catalog)).digest('hex');
const content = await format(
  `// Generated by build-printing-corrections.mjs. Data loads through the selected entry.\nimport { table } from '../data/registry.js';\nimport type { ReviewedCorrection } from './types.js';\nimport type { ReviewIdentity } from './review.js';\nexport { printingCorrectionRevision } from '../data/review-metadata.js';\nexport type CompactCorrection = Omit<ReviewedCorrection, 'source' | 'reason'> & ReviewIdentity;\nexport const printingCorrections = table<Readonly<Record<string, readonly CompactCorrection[]>>>('printingCorrections');\n`,
  { parser: 'typescript', singleQuote: true, printWidth: 100 },
);
const target = new URL('../src/printing/corrections.ts', import.meta.url);
if (process.argv.includes('--check'))
  assert.equal(await readFile(target, 'utf8'), content, 'Regenerate public printing corrections');
else await writeFile(target, content);
console.log(`${Object.keys(catalog).length} reviewed printings; catalog ${revision.slice(0, 12)}`);

const artistFile = 'planar-artist-review.json';
for (const row of JSON.parse(await readFile(new URL(artistFile, root))).rows) {
  rememberSet(row.id, 'plc');
  addArtist(row.id, artistFile, row.referenceHash, row.review, row.printedArtist);
}
const earlyArtistFile = 'early-expansion-footer-wording.json';
for (const row of JSON.parse(await readFile(new URL(earlyArtistFile, root))).rows) {
  rememberSet(row.id, row.set);
  if (!row.artistMatchesProvider)
    addArtist(row.id, earlyArtistFile, row.referenceHash, row.review, row.printedArtist);
}
const diacriticFile = 'arn-artist-diacritics.json';
const diacritics = JSON.parse(await readFile(new URL(diacriticFile, root)));
assert.equal(diacritics.status, 'artist-wording-reviewed');
for (const row of diacritics.rows) {
  rememberSet(row.id, row.set);
  addArtist(row.id, diacriticFile, row.referenceHash, row.review, row.printedArtist);
}
const artistCatalog = Object.fromEntries(
  [...artistRows.entries()].sort(([a], [b]) => a.localeCompare(b)),
);
const artistRevision = createHash('sha256').update(JSON.stringify(artistCatalog)).digest('hex');
const artistContent = await format(
  `// Generated by build-printing-corrections.mjs. Data loads through the selected entry.\nimport { table } from '../data/registry.js';\nimport type { ReviewedArtistCredit } from './artist.js';\nimport type { ReviewIdentity } from './review.js';\nexport { artistCreditRevision } from '../data/review-metadata.js';\nexport type CompactArtistCredit = Omit<ReviewedArtistCredit, 'source' | 'reason'> & ReviewIdentity;\nexport const artistCredits = table<Readonly<Record<string, CompactArtistCredit>>>('artistCredits');\n`,
  { parser: 'typescript', singleQuote: true, printWidth: 100 },
);
const artistTarget = new URL('../src/printing/artist-credits.ts', import.meta.url);
if (process.argv.includes('--check'))
  assert.equal(
    await readFile(artistTarget, 'utf8'),
    artistContent,
    'Regenerate printed artist credits',
  );
else await writeFile(artistTarget, artistContent);
console.log(`${artistRows.size} reviewed artist credits; catalog ${artistRevision.slice(0, 12)}`);

// Authoritative audit catalog is not part of the package's browser files.
const evidence = await format(
  JSON.stringify(
    {
      schema: 1,
      revision,
      artistRevision,
      sets: Object.fromEntries(
        [...printingSets].filter(([id]) => catalog[id] || artistCatalog[id]).sort(),
      ),
      wording: catalog,
      artists: artistCatalog,
    },
    null,
    2,
  ),
  { parser: 'json', printWidth: 100 },
);
const evidenceTarget = new URL('printing-review-catalog.json', root);
if (process.argv.includes('--check'))
  assert.equal(await readFile(evidenceTarget, 'utf8'), evidence, 'Regenerate review evidence');
else await writeFile(evidenceTarget, evidence);
