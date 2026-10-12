import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readJson, writeJson, cacheRoot, outputRoot, hash, sourceHash, root } from './common.mjs';

// Recompose identical inputs from other policies. Selection is by frame/color,
// never by similarity score; this checks preservation, not fidelity to a scan.
const results = [];
for (const [set, run] of [
  ['m21', 'stats-wide-parity'],
  ['mir', 'text-insets'],
  ['tmp', 'text-insets'],
  ['3ed', 'stats-wide-retained'],
  ['5ed', 'stats-wide-retained'],
]) {
  const snapshot = await readJson(path.join(cacheRoot, 'sets', `${set}.json`));
  const directory = path.join(outputRoot, set, run);
  const capture = await readJson(path.join(directory, 'capture.json'));
  const groups = new Set();
  const selected = capture.results.filter((card) => {
    if (card.issue) return false;
    const key = `${card.frame}:${card.face.colors.join('')}:${card.category}`;
    if (groups.has(key)) return false;
    groups.add(key);
    return true;
  });
  const session = await openBrowser(snapshot);
  try {
    for (const card of selected) {
      const hashes = {};
      for (const tier of ['inspect', 'table']) {
        const previous = await readFile(path.join(directory, card.images[tier].file));
        assert.equal(hash(previous), card.images[tier].sha256);
        const data = await session.page.evaluate(
          async ({ face, tier }) => {
            const { composeCardTexture } = await import(
              '/games/magic/src/presentation/canvas-face.ts'
            );
            const canvas = await composeCardTexture(
              { face, printingId: null, printedImage: null },
              tier,
              new AbortController().signal,
            );
            const data = canvas.toDataURL('image/png');
            canvas.width = canvas.height = 0;
            return data;
          },
          { face: card.face, tier },
        );
        hashes[tier] = hash(Buffer.from(data.split(',')[1], 'base64'));
        assert.equal(hashes[tier], card.images[tier].sha256, `Changed ${set} ${card.name} ${tier}`);
      }
      results.push({
        set,
        run,
        id: card.id,
        name: card.name,
        frame: card.frame,
        inputHash: card.inputHash,
        hashes,
      });
    }
    assert.deepEqual(session.faults, []);
  } finally {
    await session.close();
  }
  console.log(`Unchanged ${set}: ${selected.length} cards, both tiers`);
}
const prototypeMatches = [];
const session = await openBrowser(await readJson(path.join(cacheRoot, 'sets/4ed.json')));
try {
  for (const run of ['centered-width-development-refined', 'centered-width-transfer-refined']) {
    const directory = path.join(outputRoot, '4ed', run);
    for (const card of (await readJson(path.join(directory, 'sweep.json'))).results) {
      const data = await session.page.evaluate(async (face) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const canvas = await composeCardTexture(
          { face, printingId: null, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        const data = canvas.toDataURL('image/png');
        canvas.width = canvas.height = 0;
        return data;
      }, card.face);
      const full = PNG.sync.read(Buffer.from(data.split(',')[1], 'base64'));
      const crop = PNG.sync.read(await readFile(path.join(directory, card.scores[1].file)));
      for (let y = 0; y < 300; y++)
        assert.ok(
          full.data
            .subarray(((600 + y) * 732 + 75) * 4, ((600 + y) * 732 + 660) * 4)
            .equals(crop.data.subarray(y * 585 * 4, (y + 1) * 585 * 4)),
          `Prototype mismatch: ${card.name}`,
        );
      prototypeMatches.push({
        id: card.id,
        name: card.name,
        inputHash: card.inputHash,
        cropHash: card.scores[1].sha256,
      });
    }
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
await writeJson(path.join(outputRoot, 'centered-parity.json'), {
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  note: 'One representative per existing frame/color/category group; byte-identical PNGs at both tiers, with the same saved inputs. This is a preservation check, not a full-set accuracy claim.',
  results,
  prototypeMatches,
});
