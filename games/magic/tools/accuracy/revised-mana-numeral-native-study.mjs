// Score real production numeral controls through the retained native cost callback.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
import { openBrowser } from './browser.mjs';
import { earlyManaRetainedPlugin } from './early-mana-retained-plugin.mjs';
const [inputFile, poseFile, nativeDirectory, ringFile, auditFile, definitionFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: revised-mana-numeral-native-study.mjs INPUTS POSES NATIVE RINGS AUDIT DEFINITION NEW_OUTPUT',
);
const files = [
    inputFile,
    poseFile,
    path.join(nativeDirectory, 'capture.json'),
    ringFile,
    auditFile,
    definitionFile,
  ],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, poses, capture, ring, audit, definition] = bytes.map((b) => JSON.parse(b)),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  moduleNames = [
    'native-rgba-crop.mjs',
    'mana-glyph-metrics.mjs',
    'edges.mjs',
    'metrics.mjs',
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'hsb-color.mjs',
    'abu-mana-study-browser.mjs',
    'abu-type-objective.mjs',
    'early-mana-retained-plugin.mjs',
    'early-mana-trial-plugin.mjs',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        moduleNames.map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
      ),
    ),
  modules = await identities(),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  rows = [],
  transformed = {},
  candidates = definition.candidates;
for (const x of [capture, ring, audit]) assert.equal(x.rendererHash, rendererHash);
assert.equal(capture.inputHash, hash(bytes[0]));
assert.equal(ring.sources.poses, hash(bytes[1]));
assert.equal(audit.sources.rings, hash(bytes[3]));
assert.equal(audit.sources.capture, hash(bytes[2]));
assert.deepEqual(candidates[0], { name: 'current', delta: {} });
assert.equal(new Set(candidates.map((c) => c.name)).size, candidates.length);
assert(candidates.length > 1 && candidates.length <= 200);
for (const c of candidates.slice(1)) {
  assert(c.name.startsWith('number/'));
  assert(Object.keys(c.delta).every((k) => ['numberScale', 'numberDx', 'numberDy'].includes(k)));
  assert(['numberScale', 'numberDx', 'numberDy'].every((k) => Number.isFinite(c.delta[k])));
  assert(
    c.delta.numberScale >= 0.9 &&
      c.delta.numberScale <= 1.2 &&
      Math.abs(c.delta.numberDx) <= 1.5 &&
      Math.abs(c.delta.numberDy) <= 1.5,
  );
}
const basePlugin = earlyManaRetainedPlugin(transformed),
  session = await openBrowser(inputs, {
    plugins: [
      basePlugin,
      {
        name: 'numeral-native-observation',
        enforce: 'pre',
        transform(source, id) {
          if (!id.split('?')[0].endsWith('/abu-mana-study-browser.mjs')) return;
          const needle =
            'const raster = retained.c.getImageData(origin[0], origin[1], readWidth, readHeight);';
          assert.equal(source.split(needle).length, 2);
          const code = source.replace(
              needle,
              needle + '\n      globalThis.__numeralNativeRaster?.(candidate.name,raster,origin);',
            ),
            p = { before: hash(source), after: hash(code) };
          if (transformed.browser) assert.deepEqual(transformed.browser, p);
          transformed.browser = p;
          return code;
        },
      },
    ],
  }),
  start = performance.now();
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
try {
  for (const r of ring.rows) {
    const discs = r.discs.filter((d) => d.accepted && /^\d+$/.test(d.symbol));
    if (!discs.length) continue;
    const e = inputs.entries.find((e) => e.id === r.id),
      p = Object.values(poses.groups)
        .flatMap((g) => g.rows)
        .find((p) => p.id === r.id),
      n = capture.rows.find((n) => n.id === r.id),
      sb = await fs.readFile(objectFile(e.reference)),
      nb = await fs.readFile(path.join(nativeDirectory, n.modes.original.file));
    assert.equal(hash(sb), r.referenceHash);
    assert.equal(hash(nb), r.nativeHash);
    assert.equal(hash(JSON.stringify(p.transform)), r.poseHash);
    const scan = normalize(PNG.sync.read(sb), p.transform),
      render = normalize(PNG.sync.read(nb)),
      current = discs.map((d) => ({
        index: d.index,
        symbol: d.symbol,
        circle: d.circles.render,
        masks: audit.thresholds.map((thresholdFraction) => {
          const target = manaGlyphMask(scan, d.circles.scan, false, {
              normalizeBounds: false,
              thresholdFraction,
            }),
            control = manaGlyphMask(render, d.circles.render, false, {
              normalizeBounds: false,
              thresholdFraction,
            });
          const a = audit.rows
            .find((a) => a.id === r.id && a.index === d.index)
            .measurements.find((a) => a.thresholdFraction === thresholdFraction);
          assert.equal(hash(target.ink), a.scan.maskHash);
          assert.equal(hash(control.ink), a.render.maskHash);
          return {
            thresholdFraction,
            target: Array.from(target.ink),
            control: Array.from(control.ink),
          };
        }),
      })),
      url =
        'data:image/png;base64,' +
        PNG.sync
          .write({ width: 488, height: 680, data: Buffer.from(scan.data) })
          .toString('base64');
    const result = await session.page.evaluate(
      async ({ e, url, current, candidates }) => {
        const { measure } = await import('/games/magic/tools/accuracy/abu-mana-study-browser.mjs'),
          { manaGlyphMask, compareManaGlyph } = await import(
            '/games/magic/tools/accuracy/mana-glyph-metrics.mjs'
          ),
          { nativeRgbaCrop } = await import('/games/magic/tools/accuracy/native-rgba-crop.mjs'),
          measured = [];
        globalThis.__numeralNativeRaster = (name, raster, origin) => {
          const glyphs = current.map((d) => {
            const rect = [Math.floor(d.circle.x - 16), Math.floor(d.circle.y - 16), 34, 34],
              image = nativeRgbaCrop(raster, rect, origin),
              circle = { ...d.circle, x: d.circle.x - rect[0], y: d.circle.y - rect[1] },
              scores = d.masks.map((m) => {
                const mask = manaGlyphMask(image, circle, false, {
                  normalizeBounds: false,
                  thresholdFraction: m.thresholdFraction,
                });
                if (mask.status !== 'measured')
                  throw Error('Native numeral mask failed:' + mask.status);
                if (name === 'current' && mask.ink.some((v, i) => v !== m.control[i]))
                  throw Error('Regional numeral sampling changed native baseline');
                return compareManaGlyph(Uint8Array.from(m.target), mask.ink).score * 100;
              });
            return { index: d.index, symbol: d.symbol, scores };
          });
          measured.push({ name, glyphs });
        };
        try {
          const result = await measure(e, url, candidates);
          return { ...result, glyphMeasurements: measured };
        } finally {
          delete globalThis.__numeralNativeRaster;
        }
      },
      { e, url, current, candidates },
    );
    assert.equal(hash(Buffer.from(result.nativePng, 'base64')), r.nativeHash);
    delete result.nativePng;
    assert.equal(result.parity, 0);
    assert.equal(result.regionParity, 0);
    assert.equal(result.candidateParities.number, 0);
    assert.equal(result.glyphMeasurements.length, candidates.length);
    for (const d of current) {
      const parent = audit.rows.find((a) => a.id === r.id && a.index === d.index),
        scores = result.glyphMeasurements.map((m) =>
          median(m.glyphs.find((g) => g.index === d.index).scores),
        );
      assert.equal(scores[0], median(parent.measurements.map((m) => m.comparison.score)) * 100);
      rows.push({
        id: r.id,
        name: r.name,
        cohort: r.cohort,
        material: r.material,
        index: d.index,
        symbol: d.symbol,
        referenceHash: r.referenceHash,
        nativeHash: r.nativeHash,
        poseHash: r.poseHash,
        scores,
        parity: result.parity,
        regionParity: result.regionParity,
        candidateParity: result.candidateParities.number,
        effects: result.effects,
        grayCostScores: result.scores,
      });
    }
    if (rows.length % 20 === 0) console.log('Production numeral controls', rows.length);
  }
  assert.deepEqual(session.faults, []);
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
    cal = rows.filter((r) => r.cohort === 'calibration'),
    common = ['1', '2', '3', '4'].filter((s) => cal.filter((r) => r.symbol === s).length >= 5),
    ranking = candidates
      .map((c, index) => ({
        name: c.name,
        index,
        objective:
          mean(
            common.map((s) => mean(cal.filter((r) => r.symbol === s).map((r) => r.scores[index]))),
          ) -
          0.25 * Math.max(0, ...cal.map((r) => r.scores[0] - r.scores[index])),
      }))
      .sort((a, b) => b.objective - a.objective || a.index - b.index),
    selected = ranking[0];
  function summary(a) {
    return a.length
      ? {
          count: a.length,
          before: mean(a.map((r) => r.scores[0])),
          after: mean(a.map((r) => r.scores[selected.index])),
          gains: a.filter((r) => r.scores[selected.index] > r.scores[0] + 1e-10).length,
          losses: a.filter((r) => r.scores[selected.index] < r.scores[0] - 1e-10).length,
          worstRegression: Math.max(0, ...a.map((r) => r.scores[0] - r.scores[selected.index])),
        }
      : { count: 0 };
  }
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  assert.deepEqual(await identities(), modules);
  assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
  assert.deepEqual(
    await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
    bytes.map(hash),
  );
  await writeJson(output, {
    schema: 1,
    set: '3ed',
    status: 'production-native-numeral-control-proposal',
    scope:
      'Original scans,frozen frame poses,and actual native numeral split/paint controls. One cached browser and retained cost callback; every card has exact native baseline,regional sampling and first active full-composition candidate parity. Common1/2/3/4 numerals balance calibration selection; reused development validation and rare values remain explicit. Filled-plus-edge glyph objectives use three relative thresholds in measured disc coordinates. Every candidate changes actual native pixels; no binary-mask resizing enters the selected scores. Selected controls still need final full-production capture/isolation,and cost positioning/pigment/outlier review before adoption.',
    rendererHash,
    sources: Object.fromEntries(
      ['inputs', 'poses', 'capture', 'rings', 'audit', 'definition'].map((k, i) => [
        k,
        hash(bytes[i]),
      ]),
    ),
    toolHash,
    modules,
    transformed,
    definition,
    browser: session.browser.version(),
    selected,
    ranking,
    commonNumbers: common,
    groups: Object.fromEntries(
      [
        ['all', rows],
        ...['calibration', 'validation'].map((c) => [c, rows.filter((r) => r.cohort === c)]),
        ...[...new Set(rows.map((r) => r.symbol))]
          .sort()
          .map((s) => ['numeral/' + s, rows.filter((r) => r.symbol === s)]),
        ...['W', 'U', 'B', 'R', 'G', 'A'].map((m) => [
          'material/' + m,
          rows.filter((r) => r.material === m),
        ]),
      ].map(([k, a]) => [k, summary(a)]),
    ),
    rows,
    elapsedSeconds: (performance.now() - start) / 1000,
  });
  console.log(
    'Production native numeric proposal',
    JSON.stringify(selected),
    JSON.stringify(candidates[selected.index]),
  );
} finally {
  await session.close();
}
