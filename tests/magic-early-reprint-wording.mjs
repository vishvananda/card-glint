import assert from 'node:assert/strict';
import { preEarlyReprintFooterSource } from './magic-early-reprint-footer-source-guard.mjs';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { transform } from 'esbuild';
import { createServer } from 'vite';
import {
  earlyReprintWordingProof,
  preEarlyReprintWordingSource,
} from './magic-early-reprint-wording-source-guard.mjs';

execFileSync(process.execPath, ['games/magic/tools/build-printing-corrections.mjs', '--check']);
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
  appType: 'custom',
});
try {
  await earlyReprintWordingProof();
  const evidence = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/early-reprint-wording.json'),
  );
  const { resolvePrintingWording, resolvePrintingArtist } = await server.ssrLoadModule(
    '/games/magic/src/index.ts',
  );
  // Preserve this historical three-credit assertion. The footer test checks
  // the newer catalogs against this exact reconstructed revision.
  const printingCorrections = await previous('corrections.ts', 'printingCorrections', true);
  const artistCredits = await previous('artist-credits.ts', 'artistCredits', true);
  async function previous(file, field, beforeFooter = false) {
    const source = await (
      beforeFooter ? preEarlyReprintFooterSource : preEarlyReprintWordingSource
    )('games/magic/src/printing/' + file);
    const { code } = await transform(source.toString(), { loader: 'ts', format: 'esm' });
    return (await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64')))[
      field
    ];
  }
  const prior = await previous('corrections.ts', 'printingCorrections');
  const priorArtists = await previous('artist-credits.ts', 'artistCredits');
  const reviews = new Map(),
    artists = new Map();
  for (const file of Object.keys(evidence.annotations)) {
    const data = JSON.parse(await readFile(file));
    for (const [id, row] of Object.entries(data.cards)) {
      if (row.reviewedFields?.includes('artist')) {
        artists.set(id, row);
        continue;
      }
      const fields = row.reviewed
        ? { rulesText: row.rulesText, flavorText: row.flavorText, rulesParagraphs: row.paragraphs }
        : Object.fromEntries(row.reviewedFields.map((field) => [field, row[field]]));
      const existing = reviews.get(id) ?? { referenceHash: row.referenceHash, fields: {} };
      assert.equal(existing.referenceHash, row.referenceHash);
      Object.assign(existing.fields, fields);
      reviews.set(id, existing);
    }
  }
  assert.equal(reviews.size, 690);
  assert.equal(artists.size, 3);
  function byField(groups = []) {
    const result = {};
    for (const { fields, ...provenance } of groups)
      for (const [field, value] of Object.entries(fields)) result[field] = { value, ...provenance };
    return result;
  }
  let unchangedPrintings = 0,
    preservedBodies = 0;
  // New exact-printing reviews cannot discard earlier bodies, stats or other
  // editions. Check values and provenance, including every untouched catalog ID.
  for (const [id, groups] of Object.entries(prior)) {
    if (!reviews.has(id)) {
      assert.deepEqual(printingCorrections[id], groups, id + ' unrelated printing');
      unchangedPrintings++;
      continue;
    }
    const old = byField(groups),
      current = byField(printingCorrections[id]);
    for (const [field, value] of Object.entries(old))
      if (!Object.hasOwn(reviews.get(id).fields, field))
        assert.deepEqual(current[field], value, id + ':' + field);
    if (old.rulesText && !Object.hasOwn(reviews.get(id).fields, 'rulesText')) preservedBodies++;
  }
  for (const id of Object.keys(printingCorrections))
    assert.ok(Object.hasOwn(prior, id) || reviews.has(id));
  for (const [id, credit] of Object.entries(priorArtists))
    assert.deepEqual(artistCredits[id], credit);
  assert.equal(Object.keys(artistCredits).length, Object.keys(priorArtists).length + 3);
  assert.equal(preservedBodies, 37);

  const input = {
      oracle: {
        name: 'Oracle name',
        typeLine: 'Creature — Elemental',
        rulesText: 'Oracle rules.',
        flavorText: 'Oracle flavor.',
        manaSymbols: ['X', '1', 'B'],
      },
      original: {
        name: 'Provider name',
        typeLine: 'Provider type',
        rulesText: 'Provider rules.',
        flavorText: 'Provider flavor.',
        manaSymbols: ['X', '1', 'B'],
      },
    },
    snapshot = structuredClone(input);
  const unreviewed = resolvePrintingWording('unreviewed-control', input);
  const rows = new Map(evidence.rows.map((r) => [r.id, r]));
  let bodies = 0,
    costs = 0;
  for (const [id, review] of reviews) {
    assert.equal(rows.get(id).referenceHash, review.referenceHash);
    assert.ok(['fem', '4ed', 'chr'].includes(rows.get(id).set));
    const resolved = resolvePrintingWording(id, input, { referenceSha256: review.referenceHash });
    assert.equal(resolved.provenance.status, 'applied');
    assert.deepEqual(resolved.wordings.oracle, unreviewed.wordings.oracle, id + ' Oracle');
    assert.equal(resolved.wordings.original.typeLine, review.fields.typeLine);
    const actual = byField(printingCorrections[id]);
    for (const [field, expected] of Object.entries(review.fields))
      assert.deepEqual(actual[field].value, expected);
    if (review.fields.rulesParagraphs) {
      assert.deepEqual(resolved.wordings.original.rulesParagraphs, review.fields.rulesParagraphs);
      assert.equal(
        resolved.wordings.original.rulesText,
        review.fields.rulesParagraphs.map((p) => p.runs.map((r) => r.text).join('')).join('\n'),
      );
      bodies++;
    }
    if (review.fields.manaSymbols) {
      assert.deepEqual(resolved.wordings.original.manaSymbols, ['1', 'B']);
      costs++;
    }
    assert.equal(
      resolvePrintingWording(id, { oracle: input.oracle }).provenance.status,
      'missing-original',
    );
    const stale = resolvePrintingWording(id, input, { referenceSha256: '0'.repeat(64) });
    assert.equal(stale.provenance.status, 'reference-mismatch');
    assert.deepEqual(stale.wordings, unreviewed.wordings);
  }
  assert.equal(bodies, 27);
  assert.equal(costs, 1);
  for (const [id, review] of artists) {
    const result = resolvePrintingArtist(id, 'Provider credit', {
      referenceSha256: review.referenceHash,
    });
    assert.equal(result.artist, review.artist);
    assert.equal(result.provenance.status, 'applied');
    assert.equal(
      resolvePrintingArtist(id, 'Provider credit', { referenceSha256: '0'.repeat(64) }).artist,
      'Provider credit',
    );
  }
  assert.deepEqual(input, snapshot);
  console.log(
    `Early reprint wording: 690 types, 27 bodies, three credits and one cost; 37 previous bodies and ${unchangedPrintings} unrelated printings preserved. Oracle and stale-reference isolation pass.`,
  );
} finally {
  await server.close();
}
