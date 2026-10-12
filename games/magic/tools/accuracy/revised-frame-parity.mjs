import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readJson, writeJson, cacheRoot, outputRoot, fixtureRoot, hash } from './common.mjs';
const root = path.join(outputRoot, '3ed');
const plan = await readJson(path.join(fixtureRoot, '3ed/frame-selection-plan.json'));
const beforeBytes = await readFile(path.join(root, 'revised-fields/capture.json'));
assert.equal(hash(beforeBytes), plan.baselineCaptureHash);
const before = JSON.parse(beforeBytes);
const after = await readJson(path.join(root, 'revised-frame/capture.json'));
assert.equal(after.complete, true);
assert.equal(after.results.length, 306);
let unchanged = 0;
for (const card of after.results) {
  const old = before.results.find((c) => c.id === card.id);
  assert.equal(card.issue, null);
  assert.equal(card.contentStatus, old.contentStatus);
  assert.deepEqual(card.layout, old.layout);
  assert.equal(card.inputHash !== old.inputHash, card.id === plan.id);
  if (card.id !== plan.id) unchanged++;
  else {
    assert.equal(old.inputHash, plan.previousInputHash);
    assert.equal(card.images.reference.sha256, plan.referenceHash);
    assert.deepEqual(card.face, {
      ...old.face,
      typeLine: plan.printedType,
      frameColors: plan.frameColors,
      creature: true,
    });
    assert.deepEqual(card.face.colors, plan.semanticColors);
    assert.deepEqual(card.face.manaSymbols, plan.manaSymbols);
    assert.equal(card.assets.frame, plan.printedFrameAsset.url);
    assert.equal(old.assets.frame, plan.previousFrameAsset);
  }
  for (const tier of ['reference', 'inspect', 'table']) {
    const aBytes = await readFile(path.join(root, 'revised-fields', old.images[tier].file));
    const bBytes = await readFile(path.join(root, 'revised-frame', card.images[tier].file));
    assert.equal(hash(aBytes), old.images[tier].sha256);
    assert.equal(hash(bBytes), card.images[tier].sha256);
    if (tier === 'reference' || card.id !== plan.id) assert.equal(hash(aBytes), hash(bBytes));
    else {
      assert.notEqual(hash(aBytes), hash(bBytes));
      const a = PNG.sync.read(aBytes),
        b = PNG.sync.read(bBytes),
        scale = tier === 'inspect' ? 1.5 : 0.5;
      for (let y = 0; y < b.height; y++)
        for (let x = 0; x < b.width; x++) {
          const i = (y * b.width + x) * 4;
          assert.equal(a.data[i + 3], b.data[i + 3], 'Silhouette alpha changed');
          if (x >= 75 * scale && x < 405 * scale && y >= 90 * scale && y < 340 * scale)
            assert.ok(
              a.data.subarray(i, i + 4).equals(b.data.subarray(i, i + 4)),
              'Illustration pixels changed',
            );
        }
    }
  }
}
assert.equal(unchanged, 305);
const otherPolicies = [];
for (const [set, run] of [
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
const result = {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  previousRendererHash: before.rendererHash,
  changed: 1,
  unchanged,
  checkedImages: 1836,
  allRulesLayoutsUnchanged: true,
  otherPolicies,
  note: 'Only Serendib Efreet input and PNGs change. Its explicit green frame palette selects the existing cached asset; semantic blue colors, blue mana cost, illustration interior and silhouette alpha are preserved. Printed Summon Efreet type is corrected. All other 305 Revised and 56 other-policy representatives preserve both PNGs. This validates explicit frame selection, not general typography accuracy.',
};
await writeJson(path.join(fixtureRoot, '3ed/frame-selection-check.json'), result);
console.log(JSON.stringify({ ...result, otherPolicies: otherPolicies.length }, null, 2));
