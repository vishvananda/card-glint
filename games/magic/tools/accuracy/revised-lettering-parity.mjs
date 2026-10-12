import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readJson, writeJson, cacheRoot, outputRoot, fixtureRoot, hash } from './common.mjs';

const root = path.join(outputRoot, '3ed');
const before = await readJson(path.join(root, 'revised-dense/capture.json'));
const after = await readJson(path.join(root, 'revised-lettering/capture.json'));
assert.equal(before.complete, true);
assert.equal(after.complete, true);
assert.equal(after.results.length, 306);
const previous = new Map(before.results.map((c) => [c.id, c]));
let changed = 0,
  identical = 0,
  outsideChanges = 0;
for (const card of after.results) {
  const old = previous.get(card.id);
  assert.equal(card.issue, null);
  assert.equal(card.inputHash, old.inputHash);
  assert.deepEqual(card.layout, old.layout);
  const eligible = card.frame === 'retro-fourth';
  if (eligible) changed++;
  else identical++;
  for (const tier of ['inspect', 'table']) {
    const aBytes = await readFile(path.join(root, 'revised-dense', old.images[tier].file));
    const bBytes = await readFile(path.join(root, 'revised-lettering', card.images[tier].file));
    assert.equal(hash(aBytes), old.images[tier].sha256);
    assert.equal(hash(bBytes), card.images[tier].sha256);
    assert.equal(hash(aBytes) !== hash(bBytes), eligible, `${card.name} ${tier}`);
    const a = PNG.sync.read(aBytes),
      b = PNG.sync.read(bBytes);
    const scale = tier === 'inspect' ? 1.5 : 0.5;
    for (let y = 0; y < b.height; y++)
      for (let x = 0; x < b.width; x++) {
        const i = (y * b.width + x) * 4;
        assert.equal(a.data[i + 3], b.data[i + 3], 'Silhouette alpha changed');
        if (
          a.data[i] === b.data[i] &&
          a.data[i + 1] === b.data[i + 1] &&
          a.data[i + 2] === b.data[i + 2]
        )
          continue;
        const title = x >= 25 * scale && x <= 465 * scale && y >= 15 * scale && y <= 80 * scale;
        const footer = x >= 35 * scale && x <= 465 * scale && y >= 600 * scale && y <= 655 * scale;
        if (!title && !footer) outsideChanges++;
      }
  }
}
assert.equal(changed, 281);
assert.equal(identical, 25);
assert.equal(outsideChanges, 0);
const frozen = await readJson(path.join(fixtureRoot, '3ed/lettering-candidate.json'));
let prototypeMatches = 0;
for (const phase of ['development-final', 'validation']) {
  const trial = await readJson(path.join(root, `lettering-${phase}/trial.json`));
  assert.equal(trial.experimentHash, frozen.experimentHash);
  assert.equal(trial.metricHash, frozen.metricHash);
  for (const card of trial.results)
    for (const tier of ['inspect', 'table']) {
      const score = card.scores.find((s) => s.tier === tier && s.candidate === frozen.candidate.id);
      assert.equal(
        after.results.find((r) => r.id === card.id).images[tier].sha256,
        score.sha256,
        `Prototype mismatch: ${card.name} ${tier}`,
      );
      prototypeMatches++;
    }
}
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
  changed,
  identical,
  comparedImages: 612,
  outsideTitleFooterPixelChanges: outsideChanges,
  prototypeMatches,
  otherPolicies,
  note: 'Same frozen source inputs and body layout for all 306 cards. Changes stay in title/footer regions; silhouette alpha is unchanged. All 38 development/reserved prototype PNGs match production. All 25 land PNG pairs are identical. Other-set representatives check preservation, not exhaustive accuracy.',
};
await writeJson(path.join(fixtureRoot, '3ed/lettering-capture-check.json'), result);
console.log(JSON.stringify({ ...result, otherPolicies: otherPolicies.length }, null, 2));
