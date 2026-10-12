import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareRegion, median, METRIC_VERSION } from './metrics.mjs';

const planName = 'planeswalker-materials-plan.json';
const planBytes = await readFile(`${fixtureRoot}/${planName}`);
const plan = JSON.parse(planBytes);
const runs = ['walker-type-symbol', 'walker-bottom-curve', 'walker-materials'];
const patches = {
  title: [365, 34, 35, 15],
  type: [365, 391, 20, 18],
  paper: [110, 433, 220, 5],
  sideFrame: [26, 445, 8, 35],
};
const captures = {},
  rows = [];
const started = performance.now();
async function capture(set, run) {
  const key = `${set}/${run}`;
  if (!captures[key]) {
    const bytes = await readFile(`${outputRoot}/${key}/capture.json`);
    captures[key] = { hash: hash(bytes), data: JSON.parse(bytes) };
  }
  return captures[key].data;
}
async function raster(set, run, asset, transform) {
  const bytes = await readFile(`${outputRoot}/${set}/${run}/${asset.file}`);
  assert.equal(hash(bytes), asset.sha256);
  return normalize(PNG.sync.read(bytes, { checkCRC: true }), transform);
}
function tone(image) {
  return Object.fromEntries(
    Object.entries(patches).map(([name, rect]) => {
      const values = [...cropGray(image, rect).gray];
      return [name, { median: median(values), pixels: values.length }];
    }),
  );
}
function score(reference, render) {
  const a = cropGray(reference, plan.regions.outerBottomCurve);
  const b = cropGray(render, plan.regions.outerBottomCurve);
  const m = compareRegion(a.gray, b.gray, a.width, a.height);
  return { status: m.status, edgeF1: m.edgeF1?.[1] ?? null, p95: m.p95Distance ?? null };
}
for (const card of plan.cards) {
  const versions = await Promise.all(
    runs.map(async (run) => (await capture(card.set, run)).results.find((r) => r.id === card.id)),
  );
  for (const version of versions) {
    assert.ok(version && !version.issue);
    assert.equal(version.inputHash, card.inputHash);
    assert.equal(version.images.reference.sha256, card.referenceHash);
    assert.deepEqual(version.specialLayout, versions[0].specialLayout);
    assert.ok(!version.specialLayout.some((r) => r.layout.overflow));
  }
  const colorless = plan.policy.colorlessMaterials.developmentPrintings.includes(
    `${card.set}/${card.number}`,
  );
  const profileBytes = await readFile(`${fixtureRoot}/${card.set}/alignment.json`);
  assert.equal(hash(profileBytes), plan.alignment.profileHashes[card.set]);
  const transform = JSON.parse(profileBytes).frameFamilies.planeswalker.transform;
  const references = {
    raw: await raster(card.set, runs[2], versions[2].images.reference),
    registered: await raster(card.set, runs[2], versions[2].images.reference, transform),
  };
  const bottomCurve = {},
    color = colorless ? { reference: tone(references.raw) } : null;
  const materialPassUnchanged = {};
  for (const tier of ['inspect', 'table']) {
    materialPassUnchanged[tier] =
      versions[1].images[tier].sha256 === versions[2].images[tier].sha256;
    assert.equal(materialPassUnchanged[tier], !colorless);
    const before = await raster(card.set, runs[0], versions[0].images[tier]);
    // Use the geometry-only intermediate to isolate the bottom-curve change.
    const curve = await raster(card.set, runs[1], versions[1].images[tier]);
    const after = await raster(card.set, runs[2], versions[2].images[tier]);
    bottomCurve[tier] = Object.fromEntries(
      Object.entries(references).map(([key, reference]) => {
        const a = score(reference, before),
          b = score(reference, curve);
        return [
          key,
          {
            before: a,
            after: b,
            delta: a.edgeF1 == null || b.edgeF1 == null ? null : b.edgeF1 - a.edgeF1,
          },
        ];
      }),
    );
    if (color) color[tier] = { before: tone(before), after: tone(after) };
  }
  rows.push({
    set: card.set,
    number: card.number,
    id: card.id,
    name: card.name,
    colorless,
    inputHash: card.inputHash,
    referenceHash: card.referenceHash,
    materialPassUnchanged,
    bottomCurve,
    color,
  });
}
const summary = {};
for (const tier of ['inspect', 'table']) {
  summary[tier] = { bottomCurve: {}, color: {} };
  for (const registration of ['raw', 'registered']) {
    const pairs = rows.map((r) => r.bottomCurve[tier][registration]);
    const measured = pairs.filter((p) => p.delta !== null);
    summary[tier].bottomCurve[registration] = {
      measured: measured.length,
      uncertain: pairs.length - measured.length,
      before: median(measured.map((p) => p.before.edgeF1)),
      after: median(measured.map((p) => p.after.edgeF1)),
      improved: measured.filter((p) => p.delta > 0.02).length,
      regressed: measured.filter((p) => p.delta < -0.02).length,
    };
  }
  for (const name of Object.keys(patches)) {
    const group = rows.filter((r) => r.colorless);
    summary[tier].color[name] = Object.fromEntries(
      ['before', 'after'].map((version) => [
        version,
        median(
          group.map((r) =>
            Math.abs(r.color.reference[name].median - r.color[tier][version][name].median),
          ),
        ),
      ]),
    );
  }
}
const report = {
  schemaVersion: 1,
  planName,
  planHash: hash(planBytes),
  runs,
  patches,
  studyHash: hash(await readFile(new URL(import.meta.url))),
  metricVersion: METRIC_VERSION,
  methodHash: hash(await readFile(new URL('./metrics.mjs', import.meta.url))),
  scope:
    '70 examined planeswalkers: geometry-only bottom curve comparison; three colorless development printings receive a separate fixed-patch brightness diagnostic. All inputs and ability layouts are unchanged, with no measured overflow.',
  limitations: [
    'These are confirmation measurements on already examined cards, not fresh validation.',
    'Fixed raw blank patches measure encoded sRGB luminance, not perceptual color accuracy or full HSB calibration. Grain, illustration and scan processing remain confounds.',
    'Karn title brightness differs from both Ugin printings; one shared correction is intentionally retained.',
    'Outer-frame tones are unchanged; the side-frame patch is a negative control, not an accepted calibration.',
    'Bottom crops contain other print details. Edge overlap is diagnostic, not a curve segmentation or percent accuracy.',
    'Registration is frozen per frame/set; M15/WAR use an unvalidated transferred profile. No per-scan fitting.',
  ],
  captures: Object.fromEntries(
    Object.entries(captures).map(([key, v]) => [
      key,
      { hash: v.hash, rendererHash: v.data.rendererHash },
    ]),
  ),
  materialPassUnchanged: rows.filter((r) => !r.colorless).length,
  summary,
  rows,
  timing: {
    milliseconds: performance.now() - started,
    scope: 'CPU cached PNG decoding, normalization and measurements; no Chromium or GPU execution.',
  },
};
await writeJson(`${fixtureRoot}/walker-materials-isolation-measurement.json`, report);
console.log(JSON.stringify(summary, null, 2));
