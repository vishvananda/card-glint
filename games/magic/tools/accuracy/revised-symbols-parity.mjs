import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { readJson, writeJson, cacheRoot, outputRoot, fixtureRoot, hash } from './common.mjs';

const root = path.join(outputRoot, '3ed');
const before = await readJson(path.join(root, 'revised-centered-final/capture.json'));
const after = await readJson(path.join(root, 'revised-symbols/capture.json'));
assert.equal(before.complete, true);
assert.equal(after.complete, true);
assert.equal(after.results.length, 306);
const previous = new Map(before.results.map((c) => [c.id, c]));
let changed = 0,
  identical = 0,
  outsideChanges = 0,
  minimumVisible = 1;
for (const card of after.results) {
  const old = previous.get(card.id);
  assert.equal(card.issue, null);
  assert.equal(card.inputHash, old.inputHash);
  assert.deepEqual(card.layout, old.layout, `Changed layout: ${card.name}`);
  const taps = [];
  for (const line of card.layout?.lines ?? []) {
    let x = line.x ?? card.layout.x;
    for (const run of line.runs) {
      if (run.symbol && run.text === 'T')
        taps.push([x + run.size * 0.025, line.baseline - run.size * 0.72, run.size * 0.8]);
      x += run.width;
    }
  }
  if (taps.length) changed++;
  else identical++;
  for (const tier of ['inspect', 'table']) {
    const aBytes = await readFile(path.join(root, 'revised-centered-final', old.images[tier].file));
    const bBytes = await readFile(path.join(root, 'revised-symbols', card.images[tier].file));
    assert.equal(hash(aBytes), old.images[tier].sha256);
    assert.equal(hash(bBytes), card.images[tier].sha256);
    assert.equal(hash(aBytes) === hash(bBytes), taps.length === 0, `${card.name} ${tier}`);
    const a = PNG.sync.read(aBytes),
      b = PNG.sync.read(bBytes),
      scale = tier === 'inspect' ? 1.5 : 0.5;
    let visible = 0;
    for (let y = 0; y < b.height; y++)
      for (let x = 0; x < b.width; x++) {
        const i = (y * b.width + x) * 4;
        if (b.data[i + 3]) visible++;
        if (
          a.data[i] === b.data[i] &&
          a.data[i + 1] === b.data[i + 1] &&
          a.data[i + 2] === b.data[i + 2] &&
          a.data[i + 3] === b.data[i + 3]
        )
          continue;
        if (
          !taps.some(
            ([tx, ty, size]) =>
              x >= Math.floor(tx * scale) - 2 &&
              x <= Math.ceil((tx + size) * scale) + 2 &&
              y >= Math.floor(ty * scale) - 2 &&
              y <= Math.ceil((ty + size) * scale) + 2,
          )
        )
          outsideChanges++;
      }
    const fraction = visible / (b.width * b.height);
    assert.ok(fraction > 0.9);
    minimumVisible = Math.min(minimumVisible, fraction);
  }
}
assert.equal(outsideChanges, 0, 'Pixels changed outside inline tap discs');
let prototypeMatches = 0;
for (const phase of ['development', 'validation']) {
  const trial = await readJson(path.join(root, `inline-symbols-${phase}/trial.json`));
  for (const card of trial.results)
    for (const tier of ['inspect', 'table']) {
      const frozen = card.scores.find((s) => s.tier === tier && s.candidate === 'scale0.8-dy0');
      assert.equal(
        after.results.find((r) => r.id === card.id).images[tier].sha256,
        frozen.sha256,
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
  outsideTapPixelChanges: outsideChanges,
  minimumVisibleFraction: minimumVisible,
  prototypeMatches,
  otherPolicies,
  note: 'All Revised inputs and layout metadata are identical. Every changed pixel lies within a padded inline tap disc. Other-policy checks are representatives plus named historic-tap examples, not exhaustive accuracy evidence.',
};
await writeJson(path.join(fixtureRoot, '3ed/inline-symbols-capture-check.json'), result);
console.log(JSON.stringify({ ...result, otherPolicies: otherPolicies.length }, null, 2));
