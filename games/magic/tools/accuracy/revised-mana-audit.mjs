import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import { letteringContrast } from './lettering-contrast.mjs';
import { readJson, writeJson, cacheRoot, outputRoot, fixtureRoot, hash } from './common.mjs';
const base = path.join(outputRoot, '3ed');
const plan = await readJson(path.join(fixtureRoot, '3ed/mana-plan.json'));
const frozen = await readJson(path.join(fixtureRoot, '3ed/mana-candidate.json'));
const beforeBytes = await readFile(path.join(base, plan.sourceRun, 'capture.json'));
assert.equal(hash(beforeBytes), plan.captureHash);
const before = JSON.parse(beforeBytes),
  after = await readJson(path.join(base, 'revised-mana/capture.json'));
assert.ok(before.complete && after.complete);
assert.equal(after.results.length, 306);
const pairs = [];
let prototypeMatches = 0,
  identical = 0,
  outsideChanges = 0;
for (const card of after.results) {
  const old = before.results.find((c) => c.id === card.id);
  assert.equal(card.issue, null);
  assert.equal(card.inputHash, old.inputHash);
  assert.deepEqual(card.layout, old.layout);
  assert.deepEqual(card.assets, old.assets);
  const eligible = card.frame === 'retro-fourth' && card.face.manaSymbols.length > 0;
  if (!eligible) identical++;
  const refBytes = await readFile(path.join(base, plan.sourceRun, old.images.reference.file));
  assert.equal(hash(refBytes), card.images.reference.sha256);
  const reference = normalize(PNG.sync.read(refBytes));
  const left = Math.floor(436 - (card.face.manaSymbols.length - 1) * 27 - 18);
  const rect = [left, 31, 454 - left, 31];
  const scores = {};
  for (const tier of ['inspect', 'table']) {
    const aBytes = await readFile(path.join(base, plan.sourceRun, old.images[tier].file));
    const bBytes = await readFile(path.join(base, 'revised-mana', card.images[tier].file));
    assert.equal(hash(aBytes), old.images[tier].sha256);
    assert.equal(hash(bBytes), card.images[tier].sha256);
    assert.equal(hash(aBytes) !== hash(bBytes), eligible, `${card.name} ${tier}`);
    const a = PNG.sync.read(aBytes),
      b = PNG.sync.read(bBytes),
      scale = tier === 'inspect' ? 1.5 : 0.5;
    for (let y = 0; y < b.height; y++)
      for (let x = 0; x < b.width; x++) {
        const i = (y * b.width + x) * 4;
        assert.equal(a.data[i + 3], b.data[i + 3], 'Silhouette alpha changed');
        if (a.data.subarray(i, i + 4).equals(b.data.subarray(i, i + 4))) continue;
        if (x < 285 * scale || x > 451 * scale || y < 28 * scale || y > 63 * scale)
          outsideChanges++;
      }
    if (eligible) {
      const r = cropGray(reference, rect);
      const measure = (image) => {
        const p = cropGray(normalize(image), rect);
        const m = compareRegion(r.gray, p.gray, r.width, r.height);
        return {
          edgeF1: m.edgeF1[1],
          census: m.censusSimilarity,
          contrast: letteringContrast(r.gray, p.gray, r.width, r.height),
        };
      };
      const x = measure(a),
        y = measure(b);
      scores[tier] = { before: x, after: y, delta: y.edgeF1 - x.edgeF1 };
    }
  }
  pairs.push({
    id: card.id,
    name: card.name,
    number: card.collectorNumber,
    cost: card.face.manaSymbols,
    group: card.face.frameColors ?? card.face.colors,
    changed: eligible,
    inputHash: card.inputHash,
    referenceHash: card.images.reference.sha256,
    scores,
  });
}
assert.equal(outsideChanges, 0, 'Pixels outside mana region changed');
for (const phase of ['development', 'validation']) {
  const trial = await readJson(path.join(base, `mana-${phase}/trial.json`));
  assert.equal(trial.experimentHash, frozen.experimentHash);
  for (const card of trial.results)
    for (const tier of ['inspect', 'table']) {
      const score = card.scores.find((s) => s.tier === tier && s.candidate === frozen.candidate.id);
      assert.equal(
        after.results.find((r) => r.id === card.id).images[tier].sha256,
        score.sha256,
        `${card.name} ${tier} differs from frozen prototype`,
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
const summary = Object.fromEntries(
  ['inspect', 'table'].map((tier) => {
    const rows = pairs.filter((p) => p.changed);
    return [
      tier,
      {
        count: rows.length,
        medianBefore: median(rows.map((p) => p.scores[tier].before.edgeF1)),
        medianAfter: median(rows.map((p) => p.scores[tier].after.edgeF1)),
        gains: rows.filter((p) => p.scores[tier].delta > 0.02).length,
        regressions: rows.filter((p) => p.scores[tier].delta < -0.02).map((p) => p.name),
      },
    ];
  }),
);
await writeJson(path.join(fixtureRoot, '3ed/mana-measurement.json'), {
  schemaVersion: 1,
  rendererHash: after.rendererHash,
  baselineRendererHash: before.rendererHash,
  auditHash: hash(await readFile(new URL(import.meta.url))),
  candidateHash: hash(await readFile(path.join(fixtureRoot, '3ed/mana-candidate.json'))),
  identical,
  prototypeMatches,
  outsideChanges,
  otherPolicies,
  summary,
  pairs,
  note: 'Revised header-only change; identical source inputs, frame assets and body layout. Shared row geometry, no per-scan registration. Existing symbol contours remain imperfect. Other-set checks verify preservation, not accuracy transfer.',
});
console.log(
  JSON.stringify(
    { identical, prototypeMatches, outsideChanges, otherPolicies: otherPolicies.length, summary },
    null,
    2,
  ),
);
