// Native Canvas2D numeral atoms at the production painter's exact sampling phase.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { manaGlyphMask, compareManaGlyph } from './mana-glyph-metrics.mjs';
import { median } from './hsb-color.mjs';
import { openBrowser } from './browser.mjs';
import { readObject } from './cache.mjs';

const [inputFile, poseFile, nativeDirectory, ringFile, auditFile, definitionFile, output] =
  process.argv.slice(2);
assert(
  output,
  'Usage: revised-mana-numeral-study.mjs INPUTS POSES NATIVE RINGS AUDIT DEFINITION NEW_OUTPUT',
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
    '../../fonts.css',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        moduleNames.map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
      ),
    ),
  modules = await identities(),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  candidates = definition.candidates,
  rows = [];
for (const p of [capture, ring, audit]) assert.equal(p.rendererHash, rendererHash);
assert.equal(capture.inputHash, hash(bytes[0]));
assert.equal(ring.sources.poses, hash(bytes[1]));
assert.equal(audit.sources.rings, hash(bytes[3]));
assert.equal(audit.sources.capture, hash(bytes[2]));
assert.deepEqual(candidates[0], { id: 'current' });
assert.equal(new Set(candidates.map((c) => c.id)).size, candidates.length);
assert(candidates.length > 1 && candidates.length <= 1000);
const families = new Set([
  'MPlantin',
  'Goudy',
  'Matrix',
  'Matrix Small Caps',
  'ModMatrix',
  'Chapter',
  'Beleren',
]);
const extraFonts = definition.fonts ?? [];
for (const f of extraFonts) {
  assert(/^[A-Za-z0-9 -]{1,48}$/.test(f.family));
  assert([400, 550, 700].includes(f.weight));
  await readObject(f.asset);
  families.add(f.family);
}
for (const c of candidates.slice(1)) {
  if (c.kind === 'source-mask') {
    assert(['scale', 'dx', 'dy'].every((k) => Number.isFinite(c[k])));
    assert(c.scale >= 0.9 && c.scale <= 1.2 && Math.abs(c.dx) <= 1.5 && Math.abs(c.dy) <= 1.5);
    continue;
  }
  assert(
    families.has(c.family) &&
      [400, 550, 700].includes(c.weight) &&
      ['height', 'width', 'dx', 'dy'].every((k) => Number.isFinite(c[k])) &&
      c.height >= 0.6 &&
      c.height <= 0.9 &&
      c.width >= 0.85 &&
      c.width <= 1.15 &&
      Math.abs(c.dx) <= 1.5 &&
      Math.abs(c.dy) <= 1.5,
  );
}
await fs.writeFile(output, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const session = await openBrowser({
    ...inputs,
    components: [...inputs.components, ...extraFonts.map((f) => f.asset)],
  }),
  start = performance.now();
let browserVersion;
try {
  browserVersion = session.browser.version();
  const loaded = await session.page.evaluate(
    async ({ candidates, extraFonts }) => {
      const { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts');
      await loadRetroFont();
      for (const f of extraFonts) {
        const face = new FontFace(
          'CardRenderer MTG ' + f.family,
          'url("/__accuracy/object/' + f.asset.sha256 + '")',
          { weight: String(f.weight), style: 'normal' },
        );
        document.fonts.add(await face.load());
      }
      const faces = [];
      for (const [family, weight] of [
        ...new Map(
          candidates
            .slice(1)
            .filter((c) => c.kind !== 'source-mask')
            .map((c) => [c.family + '/' + c.weight, [c.family, c.weight]]),
        ).values(),
      ]) {
        const font = weight + ' 100px "CardRenderer MTG ' + family + '"',
          list = await document.fonts.load(font, '0123456789');
        if (!list.length || list.some((f) => f.status !== 'loaded'))
          throw Error('Required numeral font not loaded: ' + font);
        faces.push({
          family,
          weight,
          faces: list.map((f) => ({ family: f.family, weight: f.weight, status: f.status })),
        });
      }
      return faces;
    },
    { candidates, extraFonts },
  );
  assert(loaded.length);
  for (const r of ring.rows) {
    const eligible = r.discs.filter((d) => d.accepted && /^\d+$/.test(d.symbol));
    if (!eligible.length) continue;
    const e = inputs.entries.find((e) => e.id === r.id),
      p = Object.values(poses.groups)
        .flatMap((g) => g.rows)
        .find((p) => p.id === r.id),
      native = capture.rows.find((n) => n.id === r.id),
      sb = await fs.readFile(objectFile(e.reference)),
      nb = await fs.readFile(path.join(nativeDirectory, native.modes.original.file));
    assert.equal(hash(sb), r.referenceHash);
    assert.equal(hash(nb), r.nativeHash);
    assert.equal(hash(JSON.stringify(p.transform)), r.poseHash);
    const images = {
      scan: normalize(PNG.sync.read(sb), p.transform),
      render: normalize(PNG.sync.read(nb)),
    };
    for (const d of eligible) {
      const parent = audit.rows.find((a) => a.id === r.id && a.index === d.index);
      assert(parent.accepted);
      const masks = audit.thresholds.map((thresholdFraction, index) => {
        const ms = Object.fromEntries(
          Object.entries(images).map(([key, image]) => [
            key,
            manaGlyphMask(image, d.circles[key], false, {
              normalizeBounds: false,
              thresholdFraction,
            }),
          ]),
        );
        for (const key of ['scan', 'render'])
          assert.equal(hash(ms[key].ink), parent.measurements[index][key].maskHash);
        assert.deepEqual(
          compareManaGlyph(ms.scan.ink, ms.render.ink),
          parent.measurements[index].comparison,
        );
        return {
          thresholdFraction,
          reference: Array.from(ms.scan.ink),
          current: Array.from(ms.render.ink),
        };
      });
      const result = await session.page.evaluate(
        async ({ d, masks, candidates }) => {
          const { manaGlyphMask, compareManaGlyph } = await import(
              '/games/magic/tools/accuracy/mana-glyph-metrics.mjs'
            ),
            { nativeRgbaCrop } = await import('/games/magic/tools/accuracy/native-rgba-crop.mjs'),
            cx = d.anchor.x,
            cy = d.anchor.y,
            rect = [Math.floor(cx - 16), Math.floor(cy - 16), 34, 34],
            origin = [Math.floor(rect[0] * 1.5) - 1, Math.floor(rect[1] * 1.5) - 1],
            w = Math.ceil((rect[0] + rect[2]) * 1.5) + 1 - origin[0],
            h = Math.ceil((rect[1] + rect[3]) * 1.5) + 1 - origin[1],
            canvas = new OffscreenCanvas(w, h),
            c = canvas.getContext('2d', { willReadFrequently: true }),
            circle = {
              ...d.circles.render,
              x: d.circles.render.x - rect[0],
              y: d.circles.render.y - rect[1],
            },
            refs = masks.map((m) => Uint8Array.from(m.reference)),
            current = masks.map((m) => Uint8Array.from(m.current)),
            scores = [],
            failures = [];
          let currentScore;
          for (const candidate of candidates) {
            if (candidate.id === 'current') {
              currentScore = masks.map((_, i) => compareManaGlyph(refs[i], current[i]).score * 100);
              const a = [...currentScore].sort((a, b) => a - b);
              scores.push(a[1]);
              failures.push([]);
              continue;
            }
            if (candidate.kind === 'source-mask') {
              const n = 40,
                units = (n - 4) / (2 * d.circles.render.radius);
              const transformed = current.map((ink) => {
                const out = new Uint8Array(n * n);
                for (let y = 0; y < n; y++)
                  for (let x = 0; x < n; x++) {
                    const sx = Math.round(
                        (x - n / 2 - candidate.dx * units) / candidate.scale + n / 2,
                      ),
                      sy = Math.round((y - n / 2 - candidate.dy * units) / candidate.scale + n / 2);
                    if (sx >= 0 && sy >= 0 && sx < n && sy < n) out[y * n + x] = ink[sy * n + sx];
                  }
                return out;
              });
              const values = transformed
                .map((ink, i) => compareManaGlyph(refs[i], ink).score * 100)
                .sort((a, b) => a - b);
              scores.push(values[1]);
              failures.push([]);
              continue;
            }
            c.resetTransform();
            c.clearRect(0, 0, w, h);
            c.save();
            c.setTransform(1.5, 0, 0, 1.5, -origin[0], -origin[1]);
            c.fillStyle = '#c2bebb';
            c.beginPath();
            c.arc(cx, cy, 11.7, 0, Math.PI * 2);
            c.fill();
            c.clip();
            c.font = candidate.weight + ' 100px "CardRenderer MTG ' + candidate.family + '"';
            c.textAlign = 'left';
            c.textBaseline = 'alphabetic';
            c.fillStyle = '#111';
            const m = c.measureText(d.symbol),
              scale = Math.min(
                (23.4 * candidate.height) /
                  (m.actualBoundingBoxAscent + m.actualBoundingBoxDescent),
                (23.4 * 0.9) /
                  ((m.actualBoundingBoxLeft + m.actualBoundingBoxRight) * candidate.width),
              );
            if (!Number.isFinite(scale)) throw Error('Invalid numeral font geometry');
            c.translate(cx + candidate.dx, cy + candidate.dy);
            c.scale(scale * candidate.width, scale);
            c.fillText(
              d.symbol,
              (m.actualBoundingBoxLeft - m.actualBoundingBoxRight) / 2,
              (m.actualBoundingBoxAscent - m.actualBoundingBoxDescent) / 2,
            );
            c.restore();
            const image = nativeRgbaCrop(c.getImageData(0, 0, w, h), rect, origin),
              ms = masks.map((m) =>
                manaGlyphMask(image, circle, false, {
                  normalizeBounds: false,
                  thresholdFraction: m.thresholdFraction,
                }),
              ),
              failed = ms.flatMap((m, i) =>
                m.status === 'measured'
                  ? []
                  : [{ threshold: masks[i].thresholdFraction, status: m.status }],
              );
            failures.push(failed);
            if (failed.length) scores.push(null);
            else {
              const a = ms
                .map((m, i) => compareManaGlyph(refs[i], m.ink).score * 100)
                .sort((a, b) => a - b);
              scores.push(a[1]);
            }
          }
          return { scores, failures, currentThresholdScores: currentScore };
        },
        { d, masks, candidates },
      );
      assert.equal(
        result.scores[0],
        median(parent.measurements.map((m) => m.comparison.score)) * 100,
      );
      for (let i = 0; i < 3; i++)
        assert.equal(
          result.currentThresholdScores[i],
          parent.measurements[i].comparison.score * 100,
        );
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
        ...result,
      });
    }
    if (rows.length % 20 === 0) console.log('Native numeral atoms', rows.length);
  }
  assert.deepEqual(session.faults, []);
  const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length,
    cal = rows.filter((r) => r.cohort === 'calibration'),
    common = ['1', '2', '3', '4'].filter((s) => cal.filter((r) => r.symbol === s).length >= 5),
    ranking = candidates
      .map((c, index) => {
        const accepted = cal.every((r) => r.scores[index] !== null);
        return {
          id: c.id,
          index,
          accepted,
          objective: accepted
            ? mean(
                common.map((s) =>
                  mean(cal.filter((r) => r.symbol === s).map((r) => r.scores[index])),
                ),
              ) -
              0.25 * Math.max(0, ...cal.map((r) => r.scores[0] - r.scores[index]))
            : null,
        };
      })
      .sort(
        (a, b) =>
          Number(b.accepted) - Number(a.accepted) ||
          (b.objective ?? -Infinity) - (a.objective ?? -Infinity) ||
          a.index - b.index,
      ),
    selected = ranking[0];
  function summary(rs) {
    const a = rs.filter((r) => r.scores[selected.index] !== null);
    return a.length
      ? {
          count: rs.length,
          accepted: a.length,
          before: mean(a.map((r) => r.scores[0])),
          after: mean(a.map((r) => r.scores[selected.index])),
          gains: a.filter((r) => r.scores[selected.index] > r.scores[0] + 1e-10).length,
          losses: a.filter((r) => r.scores[selected.index] < r.scores[0] - 1e-10).length,
          worstRegression: Math.max(0, ...a.map((r) => r.scores[0] - r.scores[selected.index])),
        }
      : { count: rs.length, accepted: 0 };
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
    status: 'numeral-font-and-source-proposals-not-adopted',
    scope:
      'Cached Latin numeral font candidates rasterized at the production 732px painter phase,then exactly cropped to canonical RGBA. Fixed original reference poses and measured circles; three relative-threshold glyph masks without ink-bound normalization. Current controls exactly reproduce the existing full-native baseline masks/scores. Common numerals1/2/3/4 balance calibration selection with a worst-regression penalty. Reused development validation and rare numbers remain separate. Font atoms fit multi-digit costs within0.9discwidth. Source-mask candidates resize the existing binary masks and are approximate controls,not new native rasterizations. Uniform atom paper/ink is diagnostic only. This is a real native font search,not full production-card or pigment certification; full-pipeline replay and isolation are still required.',
    rendererHash,
    sources: Object.fromEntries(
      ['inputs', 'poses', 'capture', 'rings', 'audit', 'definition'].map((k, i) => [
        k,
        hash(bytes[i]),
      ]),
    ),
    toolHash,
    modules,
    definition,
    fonts: loaded,
    browser: browserVersion,
    commonNumbers: common,
    selected,
    ranking,
    groups: Object.fromEntries(
      [
        ['all', rows],
        ...['calibration', 'validation'].map((k) => [k, rows.filter((r) => r.cohort === k)]),
        ...[...new Set(rows.map((r) => r.symbol))]
          .sort()
          .map((k) => ['numeral/' + k, rows.filter((r) => r.symbol === k)]),
        ...['W', 'U', 'B', 'R', 'G', 'A'].map((k) => [
          'material/' + k,
          rows.filter((r) => r.material === k),
        ]),
      ].map(([k, a]) => [k, summary(a)]),
    ),
    rows,
    elapsedSeconds: (performance.now() - start) / 1000,
  });
  console.log(
    'Native numeral proposal',
    JSON.stringify(selected),
    JSON.stringify(candidates[selected.index]),
  );
} finally {
  await session.close();
}
