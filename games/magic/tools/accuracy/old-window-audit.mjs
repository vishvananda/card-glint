import { openBrowser } from './browser.mjs';
import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import {
  root,
  cacheRoot,
  outputRoot,
  fixtureRoot,
  readJson,
  writeJson,
  hash,
  sourceHash,
  atomicWrite,
} from './common.mjs';
import { readPng, normalize, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import { measureWindows, windowDifference } from './window-geometry.mjs';
const [set, action = 'compare'] = process.argv.slice(2);
assert.ok(['3ed', 'mir', 'tmp'].includes(set));
assert.ok(['capture', 'compare'].includes(action));
const dir = `${outputRoot}/${set}/window-audit`;
if (action === 'capture') {
  const sourceStudy = set === '3ed' ? 'registration-verified' : 'stats-wide-parity',
    source = await readJson(`${outputRoot}/${set}/${sourceStudy}/capture.json`),
    seen = new Map(),
    cards = source.results.filter((r) => {
      if (r.issue) return false;
      if (set !== '3ed') return true;
      const bucket =
          r.face.colors?.join('') ||
          (/Artifact/.test(r.face.typeLine)
            ? 'artifact'
            : /Land/.test(r.face.typeLine)
              ? 'land'
              : 'colorless'),
        count = seen.get(bucket) ?? 0;
      seen.set(bucket, count + 1);
      return count < 3;
    }),
    rendererHash = await sourceHash(`${root}/games/magic/src`),
    session = await openBrowser(await readJson(`${cacheRoot}/sets/${set}.json`)),
    rows = [];
  await mkdir(dir, { recursive: true });
  try {
    for (const card of cards) {
      const data = await session.page.evaluate(async (face) => {
          const api = await import('/games/magic/src/presentation/canvas-face.ts'),
            canvas = await api.composeCardTexture(
              { face, printingId: null, printedImage: null },
              'inspect',
              new AbortController().signal,
            ),
            data = canvas.toDataURL();
          canvas.width = canvas.height = 0;
          return data;
        }, card.face),
        bytes = Buffer.from(data.split(',')[1], 'base64'),
        file = `${card.id}.inspect.png`;
      await atomicWrite(`${dir}/${file}`, bytes);
      rows.push({ ...card, render: { file, sha256: hash(bytes) } });
    }
    assert.deepEqual(session.faults, []);
    assert.equal(await sourceHash(`${root}/games/magic/src`), rendererHash);
    await writeJson(`${dir}/capture.json`, { set, sourceStudy, rendererHash, rows });
  } finally {
    await session.close();
  }
}
const bytes = await readFile(`${dir}/capture.json`),
  capture = JSON.parse(bytes),
  profile = await readJson(`${fixtureRoot}/${set}/alignment.json`),
  base = `${outputRoot}/${set}/${capture.sourceStudy}`;
const regions = {
  artLeft: [46, 90, 25, 270],
  artRight: [415, 90, 30, 270],
  rulesLeft: [47, 425, 30, 150],
  rulesRight: [411, 425, 32, 150],
  title: [43, 30, 357, 36],
  type: [49, 370, 365, 32],
  body: [58, 413, 370, 184],
};
const rows = [];
for (const row of capture.rows) {
  const original = await readPng(`${base}/${row.images.reference.file}`),
    rendered = normalize(await readPng(`${dir}/${row.render.file}`)),
    renderWindows = measureWindows(rendered, row.frame),
    scores = {};
  for (const [mode, transform] of [
    ['raw', {}],
    ['normalized', profile.frameFamilies[row.frame]?.transform ?? {}],
  ]) {
    const reference = normalize(original, transform),
      metrics = {};
    for (const [name, rect] of Object.entries(regions)) {
      const a = cropGray(reference, rect),
        b = cropGray(rendered, rect),
        m = compareRegion(a.gray, b.gray, a.width, a.height);
      metrics[name] = { f1: m.edgeF1?.[1] ?? 0, distance: m.meanDistance };
    }
    const windows = measureWindows(reference, row.frame);
    scores[mode] = {
      metrics,
      referenceWindows: windows,
      windowDifference: windowDifference(windows, renderWindows),
    };
  }
  rows.push({
    id: row.id,
    number: row.collectorNumber,
    name: row.name,
    frame: row.frame,
    colors: row.face.colors,
    contentStatus: row.contentStatus,
    typeLine: row.face.typeLine,
    typeTextStatus: row.reviewedFields?.includes('typeLine')
      ? 'scan-reviewed'
      : 'unverified: do not interpret type overlap as typography accuracy',
    referenceHash: row.images.reference.sha256,
    renderHash: row.render.sha256,
    renderWindows,
    scores,
  });
}
const summary = {};
for (const mode of ['raw', 'normalized'])
  summary[mode] = Object.fromEntries(
    Object.keys(regions).map((name) => [
      name,
      median(rows.map((r) => r.scores[mode].metrics[name].f1)),
    ]),
  );
await writeJson(`${fixtureRoot}/old-window-${set}-measurement.json`, {
  schemaVersion: 1,
  scope:
    'Inspect-tier overlap audit, no renderer correction or per-scan fit. Existing frozen set/frame profile and raw scores retained. Unreviewed type lines can contain Oracle vocabulary and are diagnostic only. Low body scores can include printing-text/source differences; inspect before treating them as geometry errors.',
  captureHash: hash(bytes),
  rendererHash: capture.rendererHash,
  profileHash: hash(JSON.stringify(profile)),
  methodHash: hash(await readFile(new URL('./window-geometry.mjs', import.meta.url))),
  regions,
  summary,
  rows,
});
console.log(set, rows.length, JSON.stringify(summary));
console.log(
  'Review',
  rows
    .sort((a, b) => a.scores.normalized.metrics.body.f1 - b.scores.normalized.metrics.body.f1)
    .slice(0, 5)
    .map((r) => ({
      n: r.number,
      name: r.name,
      body: r.scores.normalized.metrics.body.f1,
      windows: r.scores.normalized.windowDifference,
    })),
);
