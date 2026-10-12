import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { outputRoot, fixtureRoot, writeJson, hash } from './common.mjs';
import { cachedGrayRegion } from './region-cache.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';

const set = process.argv[2];
assert.ok(['m21', 'm20'].includes(set));
const beforeBytes = await readFile(`${outputRoot}/${set}/symbol-sized/capture.json`),
  afterBytes = await readFile(`${outputRoot}/${set}/normal-borders/capture.json`),
  before = JSON.parse(beforeBytes),
  after = JSON.parse(afterBytes),
  rows = [],
  // Upper type cap, and the frame band containing the upper rules-box border.
  allowed = [
    [26, 380, 436, 24],
    [0, 424, 488, 12],
  ];
assert.equal(
  before.rendererHash,
  '22eaed11ae1a3334ea060717cb2464b3489f1bf80efd4c6ff4c5e6b340b7ce96',
);
assert.equal(before.results.length, after.results.length);
assert.equal(new Set(before.results.map((r) => r.id)).size, before.results.length);
assert.equal(new Set(after.results.map((r) => r.id)).size, after.results.length);
assert.equal(before.snapshotIdentity, after.snapshotIdentity);
assert.equal(before.browser, after.browser);
assert.equal(before.fontStylesheetHash, after.fontStylesheetHash);
async function pixels(run, asset) {
  const bytes = await readFile(`${outputRoot}/${set}/${run}/${asset.file}`);
  assert.equal(hash(bytes), asset.sha256);
  return PNG.sync.read(bytes, { checkCRC: true });
}
async function band(run, asset, rect) {
  return cachedGrayRegion(`${outputRoot}/${set}/${run}/${asset.file}`, asset.sha256, rect);
}
for (const current of after.results) {
  const previous = before.results.find((r) => r.id === current.id);
  assert.ok(previous && !previous.issue && !current.issue);
  assert.equal(previous.inputHash, current.inputHash);
  assert.equal(current.frame, 'normal');
  assert.deepEqual(previous.layout, current.layout, 'Rules text layout moved');
  assert.equal(previous.images.reference.sha256, current.images.reference.sha256);
  const row = {
    id: current.id,
    number: current.collectorNumber,
    name: current.name,
    inputHash: current.inputHash,
    referenceHash: current.images.reference.sha256,
    tiers: {},
  };
  for (const tier of ['inspect', 'table']) {
    const a = await pixels('symbol-sized', previous.images[tier]),
      b = await pixels('normal-borders', current.images[tier]);
    assert.equal(a.width, b.width);
    assert.equal(a.height, b.height);
    let changed = 0;
    for (let p = 0; p < a.data.length; p += 4) {
      if ([0, 1, 2, 3].every((c) => a.data[p + c] === b.data[p + c])) continue;
      const x = (((p / 4) % a.width) * 488) / a.width,
        y = (Math.floor(p / 4 / a.width) * 680) / a.height;
      assert.ok(
        allowed.some(([rx, ry, w, h]) => x >= rx && x < rx + w && y >= ry && y < ry + h),
        `Unexpected pixel change ${set} ${current.collectorNumber} ${tier} at ${x},${y}`,
      );
      changed++;
    }
    const scores = {};
    for (const [name, rect] of [
      ['type-top', [45, 380, 330, 11]],
      ['rules-top', [45, 422, 330, 12]],
    ]) {
      const reference = await band('normal-borders', current.images.reference, rect),
        older = await band('symbol-sized', previous.images[tier], rect),
        newer = await band('normal-borders', current.images[tier], rect);
      scores[name] = Object.fromEntries(
        [
          ['before', older],
          ['after', newer],
        ].map(([stage, image]) => [
          stage,
          compareLettering(reference.gray, image.gray, rect[2], rect[3]),
        ]),
      );
    }
    row.tiers[tier] = { changedPixels: changed, unchangedOutsideBands: true, scores };
  }
  rows.push(row);
}
const summary = {};
for (const tier of ['inspect', 'table']) {
  summary[tier] = {};
  for (const name of ['type-top', 'rules-top']) {
    const values = rows.map((r) => r.tiers[tier].scores[name]);
    summary[tier][name] = {
      before: median(values.map((s) => s.before.edgeF1)),
      after: median(values.map((s) => s.after.edgeF1)),
      gains: values.filter((s) => s.after.edgeF1 - s.before.edgeF1 > 0.02).length,
      regressions: rows
        .filter((r) => {
          const s = r.tiers[tier].scores[name];
          return s.after.edgeF1 - s.before.edgeF1 < -0.02;
        })
        .map((r) => r.number),
    };
  }
}
await writeJson(`${fixtureRoot}/normal-border-${set}-measurement.json`, {
  schemaVersion: 1,
  scope:
    'User-directed +1px inward type outline and 1px upward rules-box expansion. Previously examined cards; fixed normalization, no per-scan fitting. Thin-border structural windows are diagnostics, not whole-card accuracy percentages. All pixels outside the two bands, including the complete lower rules box, must be byte-identical; rules layout is identical.',
  rendererHashes: { before: before.rendererHash, after: after.rendererHash },
  captures: { before: hash(beforeBytes), after: hash(afterBytes) },
  studyHash: hash(await readFile(new URL(import.meta.url))),
  methods: Object.fromEntries(
    await Promise.all(
      [
        'normalized-gray-region',
        'region-cache',
        'pixels',
        'lettering-metrics',
        'edges',
        'metrics',
      ].map(async (name) => [
        name,
        hash(await readFile(new URL(`./${name}.mjs`, import.meta.url))),
      ]),
    ),
  ),
  allowed,
  summary,
  rows,
});
console.log(JSON.stringify({ set, count: rows.length, summary }, null, 2));
