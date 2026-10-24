// Refresh exact reviewed Original bodies through the public resolver; keep other inputs byte-stable.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { createServer } from 'vite';
import { root, hash, sourceHash } from './common.mjs';
const [beforeFile, afterFile, proofFile] = process.argv.slice(2);
assert(proofFile, 'Usage: abu-flow-inputs.mjs BEFORE AFTER PROOF');
const beforeBytes = await readFile(beforeFile),
  snapshot = JSON.parse(beforeBytes);
const reviewFile =
  'games/magic/fixtures/accuracy/early-through-fourth/abu-stasis-source-review.json';
const reviewBytes = await readFile(reviewFile),
  review = JSON.parse(reviewBytes);
const source = {
  rendererHash: await sourceHash('games/magic/src'),
  beforeInputHash: hash(beforeBytes),
  reviewHash: hash(reviewBytes),
  toolHash: hash(await readFile(new URL(import.meta.url))),
};
assert.equal(snapshot.entries.length, 899);
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const rows = [];
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { resolvePrintingWording, resolvePrintingArtist, withCardWording } =
    await server.ssrLoadModule('/games/magic/src/index.ts');
  for (const e of snapshot.entries) {
    const face = e.face,
      paragraphs = face.rulesParagraphs ?? [];
    const text = (role) =>
      paragraphs
        .filter((p) => p.role === role)
        .map((p) => p.runs.map((r) => r.text).join(''))
        .join('\n');
    const original = { ...face, rulesText: text('rules'), flavorText: text('flavor') };
    const oracle = { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' };
    const options = { referenceSha256: e.reference.sha256 };
    const wording = resolvePrintingWording(e.id, { original, oracle }, options),
      artist = resolvePrintingArtist(e.id, face.artist, options);
    assert.notEqual(wording.provenance.status, 'reference-mismatch');
    assert.equal(artist.artist, face.artist);
    const selected = { ...face, ...wording.wordings.original, artist: artist.artist };
    const proposed = JSON.parse(
      JSON.stringify(
        withCardWording(selected, { original: selected, oracle }, 'original', {
          rulesAlignment: face.rulesAlignment?.mode === 'left' ? 'left' : 'original',
          symbolStyle: 'original',
        }),
      ),
    );
    if (face.rulesAlignment?.mode === 'auto')
      proposed.rulesAlignment = { mode: 'auto', reference: proposed.rulesParagraphs };
    const r = review.cards.find((r) => r.id === e.id),
      changed = !isDeepStrictEqual(face, proposed);
    if (changed && !r)
      await writeFile(
        proofFile + '.unexpected.json',
        JSON.stringify(
          {
            id: e.id,
            set: e.set,
            name: e.name,
            fields: [...new Set([...Object.keys(face), ...Object.keys(proposed)])]
              .filter((k) => !isDeepStrictEqual(face[k], proposed[k]))
              .map((k) => ({ field: k, before: face[k], after: proposed[k] })),
          },
          null,
          2,
        ) + '\n',
      );
    assert.equal(changed, Boolean(r), 'Unexpected public Original change: ' + e.set + '/' + e.name);
    const beforeInputHash = hash(JSON.stringify(face));
    if (r) {
      assert.equal(r.beforeInputHash, beforeInputHash);
      assert.equal(face.rulesText, r.before);
      assert.equal(proposed.rulesText, r.proposed);
      const rest = (f) =>
        Object.fromEntries(
          Object.entries(f).filter(
            ([k]) => !['rulesText', 'rulesParagraphs', 'rulesAlignment'].includes(k),
          ),
        );
      assert.deepEqual(rest(proposed), rest(face));
      e.face = proposed;
      e.correctionEvidence = {
        ...e.correctionEvidence,
        wording: wording.provenance,
        artist: artist.provenance,
      };
      e.wordingEvidence = {
        ...e.wordingEvidence,
        rules: 'scan-reviewed',
        referenceHash: e.reference.sha256,
      };
    }
    rows.push({
      id: e.id,
      set: e.set,
      name: e.name,
      referenceHash: e.reference.sha256,
      poseHash: hash(JSON.stringify(e.pose)),
      beforeInputHash,
      inputHash: hash(JSON.stringify(e.face)),
      changed,
    });
  }
} finally {
  await server.close();
}
assert.equal(rows.filter((r) => r.changed).length, 3);
assert.equal(await sourceHash('games/magic/src'), source.rendererHash);
const afterBytes = Buffer.from(JSON.stringify(snapshot, null, 2) + '\n');
source.afterInputHash = hash(afterBytes);
source.closed = true;
await writeFile(afterFile, afterBytes);
await writeFile(
  proofFile,
  JSON.stringify(
    { schema: 1, status: 'complete-public-original-flow-input-refresh', source, rows },
    null,
    2,
  ) + '\n',
);
console.log(JSON.stringify({ changed: 3, unchanged: 896, source }));
