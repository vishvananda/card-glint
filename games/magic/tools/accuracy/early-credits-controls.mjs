import assert from 'node:assert/strict';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import {
  readJson,
  writeJson,
  cacheRoot,
  outputRoot,
  fixtureRoot,
  hash,
  sourceHash,
  root,
} from './common.mjs';
const otherPolicies = [];
for (const [set, run] of [
  ['3ed', 'revised-mana'],
  ['m21', 'stats-wide-parity'],
  ['mir', 'text-insets'],
  ['tmp', 'text-insets'],
  ['4ed', 'centered'],
  ['5ed', 'stats-wide-retained'],
]) {
  const snapshot = await readJson(path.join(cacheRoot, 'sets', `${set}.json`));
  const capture = await readJson(path.join(outputRoot, set, run, 'capture.json'));
  const groups = new Set();
  const selected = capture.results.filter((c) => {
    if (c.issue) return false;
    const group = `${c.frame}:${c.face.colors.join('')}:${c.category}`;
    if (!groups.has(group)) {
      groups.add(group);
      return true;
    }
    return ['Fellwar Stone', 'Shaper Guildmage', 'Grindstone'].includes(c.name);
  });
  const session = await openBrowser(snapshot);
  try {
    for (const card of selected) {
      for (const tier of ['inspect', 'table']) {
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
        assert.equal(
          hash(Buffer.from(data.split(',')[1], 'base64')),
          card.images[tier].sha256,
          `Changed ${set} ${card.name} ${tier}`,
        );
      }
      otherPolicies.push({ set, id: card.id, name: card.name, inputHash: card.inputHash });
    }
    assert.deepEqual(session.faults, []);
  } finally {
    await session.close();
  }
  console.log(`Preserved ${set}: ${selected.length} cards at both tiers`);
}
await writeJson(path.join(fixtureRoot, 'early-credits-controls.json'), {
  schemaVersion: 1,
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  note: 'Complete PNGs at both tiers match their prior committed captures. Includes Revised after extracting the unchanged shared lettering helper.',
  count: otherPolicies.length,
  otherPolicies,
});
