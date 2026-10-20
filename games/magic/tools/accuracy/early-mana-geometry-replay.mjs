// Native joint palette/geometry candidates with explicit heading-impact accounting.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { root, sourceHash, hash, writeJson } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { JsTextObjective, nativeGrayCrop } from './abu-type-objective.mjs';
import { earlyManaTrialPlugin } from './early-mana-trial-plugin.mjs';
import { center, delta } from './hsb-color.mjs';
const [nativeDirectory, auditFile, definitionFile, out] = process.argv.slice(2);
assert(out, 'Usage: early-mana-geometry-replay.mjs NATIVE AUDIT DEFINITION OUT');
const raw = await Promise.all(
  [
    path.join(nativeDirectory, 'capture.json'),
    path.join(nativeDirectory, 'inputs.json'),
    auditFile,
    definitionFile,
  ].map((f) => readFile(f)),
);
const [capture, inputs, audit, definition] = raw.map((b) => JSON.parse(b));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, capture.source.rendererHash);
assert.equal(definition.rendererHash, rendererHash);
for (const [key, i] of [
  ['nativeCaptureHash', 0],
  ['nativeInputsHash', 1],
  ['auditHash', 2],
])
  assert.equal(definition[key], hash(raw[i]));
const entries = inputs.entries.filter((e) => definition.ids.includes(e.id));
assert.equal(entries.length, definition.ids.length);
await mkdir(out);
const transformed = {},
  session = await openBrowser(
    { ...inputs, entries },
    { plugins: [earlyManaTrialPlugin(transformed)] },
  ),
  rows = [];
const pigment = (im, circle) => {
  const a = [];
  for (
    let y = Math.ceil(circle.y - circle.radius * 0.92);
    y <= circle.y + circle.radius * 0.92;
    y++
  )
    for (
      let x = Math.ceil(circle.x - circle.radius * 0.92);
      x <= circle.x + circle.radius * 0.92;
      x++
    ) {
      if (Math.hypot(x - circle.x, y - circle.y) > circle.radius * 0.92) continue;
      const p = (y * im.width + x) * 4;
      a.push([0, 1, 2].map((k) => im.data[p + k] / 255));
    }
  a.sort((a, b) => Math.max(...a) - Math.max(...b));
  return {
    disc: center(a.slice(Math.floor(a.length * 0.8))),
    glyph: center(a.slice(0, Math.ceil(a.length * 0.05))),
  };
};
const source = {
  schema: 1,
  rendererHash,
  nativeCaptureHash: hash(raw[0]),
  nativeInputsHash: hash(raw[1]),
  auditHash: hash(raw[2]),
  definitionHash: hash(raw[3]),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  pluginHash: hash(await readFile(new URL('./early-mana-trial-plugin.mjs', import.meta.url))),
  dependencies: await Promise.all(
    ['abu-type-objective.mjs', 'pixels-pure.mjs', 'hsb-color.mjs'].map(async (f) => [
      f,
      hash(await readFile(new URL(f, import.meta.url))),
    ]),
  ),
  components: inputs.components.map((c) => [c.url, c.sha256]),
  browser: session.browser.version(),
  scope:
    'Shared disc/ink candidates through actual cached production mana preparation and native full-card composition. All current native hashes and frozen scan poses are checked. Changed pixels must lie in cost/rules regions or the explicitly allowed name region; alpha cannot change. Name changes caused by available cost width are counted separately. Colors apply to both header and inline symbols as in production. Quantile pigment errors and structural cost indices are diagnostics, not complete-set or runtime-adoption claims.',
};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of entries) {
    assert.equal(e.face.wordingMode, 'original');
    const baseline = capture.rows.find((r) => r.id === e.id),
      ar = audit.rows.find((r) => r.id === e.id);
    assert(ar.accepted);
    const beforeBytes = await readFile(path.join(nativeDirectory, e.set, e.id + '.png')),
      scanBytes = await readFile(path.join(nativeDirectory, e.set, e.id + '-scan.png'));
    assert.equal(hash(beforeBytes), baseline.renderHash);
    assert.equal(hash(scanBytes), baseline.scanHash);
    assert.equal(ar.poseHash, baseline.poseHash);
    assert.equal(baseline.poseHash, hash(JSON.stringify(e.pose.transform)));
    const rasters = await session.page.evaluate(
      async ({ e, candidates }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const lease = await loadAccuracyImages(
            canvasAssetUrls(e.face),
            new AbortController().signal,
            e.face.illustration,
          ),
          result = [];
        try {
          for (const candidate of candidates) {
            const face = candidate.profile
              ? { ...e.face, __earlyManaTrial: candidate.profile }
              : e.face;
            const image = await composeCardTexture(
              { face, printingId: e.id, printedImage: null },
              'inspect',
              new AbortController().signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            try {
              result.push(image.toDataURL().split(',')[1]);
            } finally {
              image.width = image.height = 0;
            }
          }
        } finally {
          lease.dispose();
        }
        return result;
      },
      { e, candidates: definition.candidates },
    );
    const before = PNG.sync.read(beforeBytes),
      scan = normalize(PNG.sync.read(scanBytes)),
      count = e.face.manaSymbols.length,
      left = Math.floor(432 - (count - 1) * 28 - 19),
      rect = [left, 25, 458 - left, 43];
    const objective = new JsTextObjective(cropGray(scan, rect).gray, rect[2], rect[3]);
    const trials = [];
    for (let index = 0; index < rasters.length; index++) {
      const candidate = definition.candidates[index],
        bytes = Buffer.from(rasters[index], 'base64'),
        image = PNG.sync.read(bytes);
      assert.deepEqual([image.width, image.height], [732, 1020]);
      if (index === 0)
        assert.equal(hash(bytes), baseline.renderHash, 'Native control changed: ' + e.name);
      let changed = 0,
        outside = 0,
        alphaChanged = 0,
        headingChanged = 0;
      for (let p = 0; p < 732 * 1020; p++) {
        const i = p * 4,
          x = p % 732,
          y = Math.floor(p / 732);
        if (before.data[i + 3] !== image.data[i + 3]) alphaChanged++;
        if (![0, 1, 2, 3].some((k) => before.data[i + k] !== image.data[i + k])) continue;
        changed++;
        if (
          !(
            (x >= left * 1.5 && x < 458 * 1.5 && y >= 25 * 1.5 && y < 68 * 1.5) ||
            (x >= 53 * 1.5 && x < 445 * 1.5 && y >= 404 * 1.5 && y < 603 * 1.5)
          )
        ) {
          if (
            definition.allowTitleChanges &&
            x >= 29 * 1.5 &&
            x < 437 * 1.5 &&
            y >= 29 * 1.5 &&
            y < 70 * 1.5
          )
            headingChanged++;
          else outside++;
        }
      }
      assert.equal(outside, 0, e.name + ' changed a non-mana/body region');
      assert.equal(alphaChanged, 0);
      if (index) assert(changed > 0, e.name + ' inactive palette control');
      const g = candidate.profile?.geometry ?? {},
        sc = g.scaleX ?? 1;
      assert.equal(sc, g.scaleY ?? 1);
      const circle = {
        x: 443.95 + (ar.render.circle.x - 443.95) * sc + (g.dx ?? 0),
        y: 46 + (ar.render.circle.y - 46) * sc + (g.dy ?? 0),
        radius: ar.render.circle.radius * sc,
      };
      const measured = pigment(normalize(image), circle),
        reference = ar.scan;
      const file = e.id + '-' + candidate.id + '.png';
      if (index) await writeFile(path.join(out, file), bytes);
      trials.push({
        id: candidate.id,
        faceHash: hash(bytes),
        file: index ? file : null,
        changed,
        outside,
        alphaChanged,
        headingChanged,
        circle,
        score: objective.score(nativeGrayCrop(image, rect))[0],
        discDeltaE: delta(measured.disc, reference.disc),
        glyphDeltaE: delta(measured.glyph, reference.glyph),
        pigment: measured,
      });
    }
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      symbol: ar.symbol,
      cohort: e.pose.cohort,
      poseHash: baseline.poseHash,
      referenceHash: baseline.referenceHash,
      scanHash: baseline.scanHash,
      baselineHash: baseline.renderHash,
      rect,
      trials,
    });
    await writeJson(path.join(out, 'capture.json'), {
      source,
      transformed,
      definition,
      total: entries.length,
      completed: rows.length,
      rows,
    });
    console.log(rows.length + '/' + entries.length, e.name);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
console.log('Native mana pigment candidates complete');
