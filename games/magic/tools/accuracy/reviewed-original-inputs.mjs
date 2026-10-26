/** Rebuild reviewed Original inputs through the production wording selector. */
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { gunzipSync } from 'node:zlib';
import { createServer } from 'vite';
import { hash, root, sourceHash, writeJson } from './common.mjs';

/** No fonts, images or browser are required. Original semantics and its automatic
 * alignment reference are rebuilt together; unrelated face fields are preserved. */
export async function rebuildReviewedOriginals(source, review) {
  assert.equal(source.set, review.set);
  assert.equal(new Set(source.entries.map((e) => e.id)).size, source.entries.length);
  const inputs = structuredClone(source),
    changes = [];
  const server = await createServer({
    root,
    configFile: false,
    server: { middlewareMode: true, hmr: false },
  });
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    const { withCardWording } = await server.ssrLoadModule(
      '/games/magic/src/presentation/wording.ts',
    );
    for (const e of inputs.entries) {
      assert.equal(e.face.wordingMode, 'original');
      assert.deepEqual(
        e.face.rulesAlignment,
        { mode: 'auto', reference: e.face.rulesParagraphs },
        e.name + ': baseline Original alignment reference is stale',
      );
      const row = review.cards[e.id];
      assert(row && row.reviewed);
      assert.equal(row.referenceHash, e.reference.sha256);
      assert.equal(row.typeLine, e.face.typeLine, 'Supply the scan-reviewed type inputs first');
      assert(row.reviewedFields.includes('typeLine'));
      if (row.paragraphs) {
        for (const field of ['rulesText', 'flavorText', 'rulesParagraphs'])
          assert(row.reviewedFields.includes(field), 'Unreviewed body field: ' + field);
        for (const role of ['rules', 'flavor'])
          assert.equal(
            row.paragraphs
              .filter((p) => p.role === role)
              .map((p) => p.runs.map((r) => r.text).join(''))
              .join('\n'),
            row[role === 'rules' ? 'rulesText' : 'flavorText'],
            'Body role assembly differs',
          );
      }
      const paragraphs = row.paragraphs ?? e.face.rulesParagraphs;
      const rulesText = paragraphs.map((p) => p.runs.map((r) => r.text).join('')).join('\n');
      if (!row.paragraphs) assert.equal(rulesText, e.face.rulesText);
      const original = {
        typeLine: row.typeLine,
        rulesText,
        rulesParagraphs: paragraphs,
        manaSymbols: e.face.manaSymbols,
      };
      const oracle = { typeLine: e.card.type_line, rulesText: e.card.oracle_text ?? '' };
      const face = JSON.parse(
        JSON.stringify(
          withCardWording(e.face, { oracle, original }, 'original', {
            rulesAlignment: 'original',
            symbolStyle: 'original',
          }),
        ),
      );
      const expected = {
        ...e.face,
        rulesText,
        rulesParagraphs: paragraphs,
        rulesAlignment: { mode: 'auto', reference: paragraphs },
      };
      assert.deepEqual(face, expected, 'Unrelated face fields changed: ' + e.name);
      if (hash(JSON.stringify(face)) !== hash(JSON.stringify(e.face)))
        changes.push({
          id: e.id,
          name: e.name,
          previousHash: hash(JSON.stringify(e.face)),
          inputHash: hash(JSON.stringify(face)),
        });
      e.face = face;
    }
  } finally {
    await server.close();
  }
  return { inputs, changes };
}

async function main(inputFile, reviewFile, output) {
  assert(output, 'Usage: reviewed-original-inputs.mjs INPUTS REVIEW.json[.gz] OUTPUT');
  const ib = await readFile(inputFile),
    rb = await readFile(reviewFile);
  const source = JSON.parse(ib),
    review = JSON.parse(reviewFile.endsWith('.gz') ? gunzipSync(rb) : rb);
  const { inputs, changes } = await rebuildReviewedOriginals(source, review);
  inputs.bodyReviewRevision = {
    changes,
    parentInputHash: hash(ib),
    reviewHash: hash(rb),
    parentRendererHash: source.rendererHash,
    publicWordingRebuilt: true,
  };
  inputs.rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
  await writeJson(output, inputs);
  console.log(
    source.set,
    changes.length,
    'reviewed changes;',
    inputs.entries.length,
    'Original self-references rebuilt',
  );
}
if (process.argv[1] === fileURLToPath(import.meta.url)) await main(...process.argv.slice(2));
