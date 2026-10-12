import assert from 'node:assert/strict';
import { readFile, mkdir } from 'node:fs/promises';
import {
  root,
  outputRoot,
  fixtureRoot,
  cacheRoot,
  readJson,
  writeJson,
  sourceHash,
  hash,
  atomicWrite,
} from './common.mjs';
import { readObject } from './cache.mjs';
import { fetchComponents } from './components.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';
import { PNG } from 'pngjs';
import { normalize, cropGray } from './pixels.mjs';
import { measureWindows } from './window-geometry.mjs';
import { measureScanFrame, scanTranslation } from './scan-translation.mjs';
import { compareRegion, median } from './metrics.mjs';
const [action = 'compare', sourceRoot = root, ...codes] = process.argv.slice(2),
  sets = codes.length ? codes : ['iko', 'znr', 'mid', 'dmu', 'woe', 'fdn'];
assert.ok(['capture', 'baseline', 'compare'].includes(action));
const target = await readJson(`${fixtureRoot}/scan-normalization-war-profile.json`),
  plan = await readJson(`${fixtureRoot}/normal-window-plan.json`);
const regions = {
  art: [
    [28, 90, 16, 280],
    [441, 90, 20, 280],
  ],
  rules: [
    [27, 440, 14, 150],
    [445, 440, 17, 150],
  ],
};
for (const set of sets) {
  assert.match(set, /^[a-z0-9]{2,8}$/);
  const snapshot = await readJson(`${cacheRoot}/sets/${set}-window-era.json`),
    study = await readJson(`${fixtureRoot}/window-era-${set}-measurement.json`),
    entries = snapshot.entries.filter((e) => ['U', 'B', 'R', 'G'].includes(e.bucket)),
    base = `${outputRoot}/${set}/window-era`,
    rows = [];
  if (action !== 'compare') {
    const rendererHash = await sourceHash(`${sourceRoot}/games/magic/src`),
      directory = `${base}/${action === 'baseline' ? 'before' : 'after'}`;
    if (action === 'baseline') assert.equal(rendererHash, plan.baselineRendererHash);
    const components = await fetchComponents(entries, {});
    await mkdir(directory, { recursive: true });
    const session = await openBrowser({ ...snapshot, entries, components }, { sourceRoot });
    try {
      for (const entry of entries) {
        const input = presentation(entry),
          images = {};
        const variants = await session.page.evaluate(async (face) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const out = [];
          for (const tier of ['inspect', 'table']) {
            const canvas = await composeCardTexture(
              { face, printingId: null, printedImage: null },
              tier,
              new AbortController().signal,
            );
            out.push({ tier, data: canvas.toDataURL() });
            canvas.width = canvas.height = 0;
          }
          return out;
        }, input.face);
        for (const v of variants) {
          const bytes = Buffer.from(v.data.split(',')[1], 'base64'),
            file = `${entry.id}.${v.tier}.png`;
          await atomicWrite(`${directory}/${file}`, bytes);
          images[v.tier] = { file, sha256: hash(bytes) };
        }
        rows.push({
          id: entry.id,
          face: input.face,
          inputHash: hash(JSON.stringify(input.face)),
          referenceHash: entry.reference.sha256,
          images,
        });
      }
      assert.deepEqual(session.faults, []);
      assert.equal(await sourceHash(`${sourceRoot}/games/magic/src`), rendererHash);
      await writeJson(`${directory}/capture.json`, {
        rendererHash,
        snapshotHash: hash(JSON.stringify(snapshot)),
        components,
        rows,
      });
    } finally {
      await session.close();
    }
    console.log(set, action, rows.length);
    continue;
  }
  const before = await readJson(`${base}/before/capture.json`),
    after = await readJson(`${base}/after/capture.json`);
  assert.equal(before.rendererHash, plan.baselineRendererHash);
  for (const entry of entries) {
    const source = PNG.sync.read(await readObject(entry.reference)),
      raw = normalize(source),
      scaled = normalize(source, { scale: study.scaleProfile.scale }),
      translation = scanTranslation(measureScanFrame(scaled), target.template),
      transform = { ...translation.transform, scale: study.scaleProfile.scale },
      aligned = normalize(source, transform),
      scores = {};
    for (const [revision, capture] of [
      ['before', before],
      ['after', after],
    ]) {
      assert.equal(capture.snapshotHash, hash(JSON.stringify(snapshot)));
      const r = capture.rows.find((r) => r.id === entry.id);
      assert.equal(r.referenceHash, entry.reference.sha256);
      assert.equal(r.inputHash, before.rows.find((r) => r.id === entry.id).inputHash);
      scores[revision] = {};
      for (const tier of ['inspect', 'table']) {
        const bytes = await readFile(`${base}/${revision}/${r.images[tier].file}`);
        assert.equal(hash(bytes), r.images[tier].sha256);
        const rendered = normalize(PNG.sync.read(bytes)),
          modes = {};
        for (const [mode, image] of [
          ['raw', raw],
          ['normalized', aligned],
        ]) {
          const metrics = {};
          for (const [name, rects] of Object.entries(regions)) {
            const values = rects.map((rect) => {
              const a = cropGray(image, rect),
                b = cropGray(rendered, rect);
              return compareRegion(a.gray, b.gray, a.width, a.height);
            });
            metrics[name] = {
              f1: median(values.map((v) => v.edgeF1?.[1] ?? 0)),
              distance: median(values.map((v) => v.meanDistance)),
            };
          }
          modes[mode] = metrics;
        }
        scores[revision][tier] = {
          sha256: r.images[tier].sha256,
          windows: measureWindows(rendered),
          ...modes,
        };
      }
    }
    rows.push({
      id: entry.id,
      number: entry.card.collector_number,
      name: entry.card.name,
      bucket: entry.bucket,
      referenceHash: entry.reference.sha256,
      translation,
      transform,
      rawWindows: measureWindows(raw),
      normalizedWindows: measureWindows(aligned),
      scores,
    });
  }
  const summary = {};
  for (const tier of ['inspect', 'table'])
    for (const mode of ['raw', 'normalized'])
      for (const region of Object.keys(regions)) {
        const b = rows.map((r) => r.scores.before[tier][mode][region].f1),
          a = rows.map((r) => r.scores.after[tier][mode][region].f1);
        summary[`${tier}-${mode}-${region}`] = {
          before: median(b),
          after: median(a),
          gains: a.filter((v, i) => v - b[i] > 0.02).length,
          regressions: rows.flatMap((r, i) =>
            a[i] - b[i] < -0.02 ? [{ id: r.id, name: r.name, delta: a[i] - b[i] }] : [],
          ),
        };
      }
  await writeJson(`${fixtureRoot}/window-era-${set}-render-measurement.json`, {
    schemaVersion: 1,
    set,
    scope:
      'Balanced U/B/R/G sample at two raster tiers. Borders only; original text has not been certified, so no typography scores. Frozen baseline template plus accepted shared set scale, then independent translation; uncertain axes retain zero. Raw scores retained. One browser capture per revision, CPU-only comparisons.',
    rendererHash: after.rendererHash,
    baselineRendererHash: before.rendererHash,
    scaleProfile: study.scaleProfile,
    scaleReportHash: hash(JSON.stringify(study)),
    methods: Object.fromEntries(
      await Promise.all(
        [
          'window-era-render',
          'pixels',
          'metrics',
          'edges',
          'scan-translation',
          'scan-scale',
          'window-geometry',
        ].map(async (name) => [
          name,
          hash(await readFile(new URL(`./${name}.mjs`, import.meta.url))),
        ]),
      ),
    ),
    regions,
    summary,
    rows,
  });
  console.log(set, JSON.stringify(summary));
}
