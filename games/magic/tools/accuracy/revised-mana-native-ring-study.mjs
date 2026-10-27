// Direct painter-resolution circle measurement; no intermediate 488px raster.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, hash, sourceHash, objectFile, writeJson } from './common.mjs';
import { nativeReferenceWindow } from './native-reference-window.mjs';
import { outerManaCircle } from './abu-mana-ring.mjs';
import { median, quantile } from './hsb-color.mjs';

const [inputFile, poseFile, nativeDirectory, priorRingFile, outputFile, mode = 'pilot'] =
  process.argv.slice(2);
assert(
  outputFile && ['pilot', 'full'].includes(mode),
  'Usage: revised-mana-native-ring-study.mjs INPUTS POSES NATIVE PRIOR_RINGS NEW_OUTPUT [pilot|full]',
);
const files = [inputFile, poseFile, path.join(nativeDirectory, 'capture.json'), priorRingFile],
  bytes = await Promise.all(files.map((f) => fs.readFile(f))),
  [inputs, poses, capture, prior] = bytes.map((b) => JSON.parse(b)),
  modules = [
    'abu-mana-ring.mjs',
    'native-reference-window.mjs',
    'pixels-pure.mjs',
    'scan-transform.mjs',
    'hsb-color.mjs',
  ],
  identities = async () =>
    Object.fromEntries(
      await Promise.all(
        modules.map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
      ),
    ),
  toolHash = hash(await fs.readFile(new URL(import.meta.url))),
  beforeModules = await identities(),
  rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  poseRows = Object.entries(poses.groups).flatMap(([material, g]) =>
    g.rows.map((r) => ({
      ...r,
      material,
    })),
  ),
  byPose = new Map(poseRows.map((r) => [r.id, r])),
  byNative = new Map(capture.rows.map((r) => [r.id, r])),
  entries = inputs.entries.filter((e) => !e.face.land),
  rows = [],
  excluded = [];
assert.equal(inputs.set, '3ed');
assert.equal(poses.set, '3ed');
assert.equal(poses.source.inputHash, hash(bytes[0]));
assert.equal(capture.inputHash, hash(bytes[0]));
assert.equal(capture.rendererHash, rendererHash, 'Capture must match current painter source');
assert.equal(byPose.size, poseRows.length);
assert.equal(byNative.size, capture.rows.length);
assert.equal(entries.length, 281);
assert.equal(poseRows.length, entries.length);
assert.equal(prior.rendererHash, rendererHash);
assert.equal(prior.sources.capture, hash(bytes[2]));
const rasterScale = 1.5,
  selected = new Set(
    Object.values(poses.groups).flatMap((g) =>
      mode === 'full'
        ? g.rows.filter((r) => r.accepted).map((r) => r.id)
        : ['calibration', 'validation'].flatMap((cohort) =>
            g.rows
              .filter((r) => r.accepted && r.cohort === cohort)
              .sort((a, b) => hash('placement/' + a.id).localeCompare(hash('placement/' + b.id)))
              .slice(0, cohort === 'calibration' ? 3 : 2)
              .map((r) => r.id),
          ),
    ),
  );
await fs.writeFile(outputFile, JSON.stringify({ status: 'running' }), { flag: 'wx' });
const start = performance.now();
for (const e of entries) {
  const p = byPose.get(e.id),
    n = byNative.get(e.id);
  assert(p && n);
  assert.equal(p.referenceHash, e.reference.sha256);
  assert.equal(n.referenceHash, e.reference.sha256);
  assert(['calibration', 'validation'].includes(p.cohort));
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(e.face.symbolStyle, 'original');
  assert(!e.face.symbolAdjustment?.mana, 'A manual mana adjustment cannot enter this study');
  if (!p.accepted) {
    excluded.push({
      id: e.id,
      name: e.name,
      material: p.material,
      cohort: p.cohort,
      referenceHash: p.referenceHash,
      reason: 'frozen-frame-registration-rejected',
    });
    continue;
  }
  if (!selected.has(e.id)) continue;
  const source = await fs.readFile(objectFile(e.reference)),
    face = await fs.readFile(path.join(nativeDirectory, n.modes.original.file));
  assert.equal(hash(source), e.reference.sha256);
  assert.equal(hash(face), n.modes.original.sha256);
  const symbols = e.face.manaSymbols ?? [],
    rect = [2 * Math.floor((435 - (symbols.length - 1) * 27 - 20) / 2), 24, 0, 44];
  rect[2] = 460 - rect[0];
  const fullNative = PNG.sync.read(face),
    fullScan = PNG.sync.read(source),
    images = {
      scan: nativeReferenceWindow(fullScan, rect, p.transform, rasterScale),
      render: nativeReferenceWindow(fullNative, rect, {}, rasterScale),
    },
    discs = [];
  let nativeWindowError = 0;
  for (let y = 0; y < images.render.height; y++)
    for (let x = 0; x < images.render.width; x++)
      for (let k = 0; k < 4; k++)
        nativeWindowError = Math.max(
          nativeWindowError,
          Math.abs(
            images.render.data[(y * images.render.width + x) * 4 + k] -
              fullNative.data[
                ((y + rect[1] * rasterScale) * fullNative.width + x + rect[0] * rasterScale) * 4 + k
              ],
          ),
        );
  assert.equal(nativeWindowError, 0, 'Direct native control must not resample painter pixels');
  const physical = (c) => ({
    ...c,
    x: rect[0] + (c.x + 0.5) / rasterScale - 0.5,
    y: rect[1] + (c.y + 0.5) / rasterScale - 0.5,
    radius: c.radius / rasterScale,
    raw: { x: c.x, y: c.y, radius: c.radius },
  });

  for (let index = 0; index < symbols.length; index++) {
    const rightIndex = symbols.length - 1 - index,
      anchor = { x: 435 - 27 * rightIndex, y: 44.5, range: 4, radiusRange: [9, 14] },
      candidates = Object.fromEntries(
        Object.entries(images).map(([key, image]) => [
          key,
          ['light-on-dark', 'dark-on-light'].map((polarity) => ({
            ...physical(
              outerManaCircle(image, {
                x: (anchor.x - rect[0]) * rasterScale - 0.5,
                y: (anchor.y - rect[1]) * rasterScale - 0.5,
                range: anchor.range * rasterScale,
                radiusRange: anchor.radiusRange.map((v) => v * rasterScale),
                polarity,
              }),
            ),
            polarity,
          })),
        ]),
      ),
      // Native circles have a known construction: 23.4px diameter centered at
      // this anchor. The canonical sampler introduces a shared half-pixel
      // center phase. A strong edge at some other radius/center is not proof
      // of a mana disc; it may be frame texture or part of the adjacent glyph.
      renderControl = (c) =>
        c.status === 'measured' &&
        Math.hypot(c.x - (anchor.x - 0.5), c.y - (anchor.y - 0.5)) <= 0.5 &&
        Math.abs(c.radius - 11.7) <= 0.5,
      render = [...candidates.render].sort(
        (a, b) => Number(renderControl(b)) - Number(renderControl(a)) || b.score - a.score,
      )[0],
      // Choose the same physical edge on both sides. An unconstrained
      // opposite-polarity search can prefer the dark glyph's inner perimeter.
      scan = candidates.scan.find((c) => c.polarity === render.polarity),
      circles = { scan, render };
    discs.push({
      index,
      rightIndex,
      symbol: symbols[index],
      anchor,
      circles,
      canonical: prior.rows.find((r) => r.id === e.id).discs[index].circles,
      candidates,
      nativeControlPassed: renderControl(render),
      accepted: renderControl(render) && scan.status === 'measured',
    });
  }
  rows.push({
    id: e.id,
    name: e.name,
    material: p.material,
    cohort: p.cohort,
    referenceHash: e.reference.sha256,
    poseHash: hash(JSON.stringify(p.transform)),
    nativeHash: n.modes.original.sha256,
    scanSize: [fullScan.width, fullScan.height],
    nativeWindow: rect,
    nativeWindowError,
    discs,
  });
  if (rows.length % 10 === 0)
    console.log(
      'Measured',
      rows.length,
      'cards',
      Math.round((performance.now() - start) / 1000),
      'seconds',
    );
}
const discs = rows.flatMap((r) =>
  r.discs.map((disc) => ({
    ...disc,
    id: r.id,
    name: r.name,
    material: r.material,
    cohort: r.cohort,
  })),
);
function summary(a) {
  const accepted = a.filter((d) => d.accepted);
  const values = (fn) => accepted.map(fn);
  if (!accepted.length) return { count: a.length, accepted: 0 };
  const dx = values((d) => d.circles.scan.x - d.circles.render.x),
    dy = values((d) => d.circles.scan.y - d.circles.render.y),
    dr = values((d) => d.circles.scan.radius - d.circles.render.radius);
  return {
    count: a.length,
    accepted: accepted.length,
    dx: { median: median(dx), p10: quantile(dx, 0.1), p90: quantile(dx, 0.9) },
    dy: { median: median(dy), p10: quantile(dy, 0.1), p90: quantile(dy, 0.9) },
    radiusDifference: { median: median(dr), p10: quantile(dr, 0.1), p90: quantile(dr, 0.9) },
    medianRadiusRatio: median(values((d) => d.circles.scan.radius / d.circles.render.radius)),
  };
}
const pairs = rows.flatMap((r) =>
  r.discs.slice(1).map((right, i) => {
    const left = r.discs[i];
    return {
      id: r.id,
      name: r.name,
      cohort: r.cohort,
      material: r.material,
      leftSymbol: left.symbol,
      rightSymbol: right.symbol,
      accepted: left.accepted && right.accepted,
      scan: right.circles.scan.x - left.circles.scan.x,
      render: right.circles.render.x - left.circles.render.x,
    };
  }),
);
function pitchSummary(a) {
  const accepted = a.filter((r) => r.accepted);
  return accepted.length
    ? {
        count: a.length,
        accepted: accepted.length,
        medianDifference: median(accepted.map((r) => r.scan - r.render)),
        medianScan: median(accepted.map((r) => r.scan)),
        medianRender: median(accepted.map((r) => r.render)),
        meanAbsoluteDifference:
          accepted.reduce((s, r) => s + Math.abs(r.scan - r.render), 0) / accepted.length,
      }
    : { count: a.length, accepted: 0 };
}
const groups = Object.fromEntries(
  [
    ['all', discs],
    ['rightmost', discs.filter((d) => d.rightIndex === 0)],
    ...['calibration', 'validation'].map((c) => [c, discs.filter((d) => d.cohort === c)]),
    ...['W', 'U', 'B', 'R', 'G', 'N'].map((s) => [
      'symbol/' + s,
      discs.filter((d) => (s === 'N' ? !/^[WUBRG]$/.test(d.symbol) : d.symbol === s)),
    ]),
    ...['W', 'U', 'B', 'R', 'G', 'A'].map((m) => [
      'material/' + m,
      discs.filter((d) => d.material === m),
    ]),
  ].map(([key, a]) => [key, summary(a)]),
);
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
assert.deepEqual(await identities(), beforeModules);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(
  await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
  bytes.map(hash),
);
await writeJson(outputFile, {
  schema: 1,
  set: '3ed',
  status: 'direct-native-circle-' + mode + '-not-adopted',
  mode,
  rasterScale,
  scope:
    'Scans are sampled directly at732px painter resolution with frozen affine poses. Native windows must be byte-exact subsets,without resampling. Geometry converts back to canonical pixel coordinates; old488px circle measurements remain for paired checks. No Chromium or runtime geometry changes. All cost circles on the frozen accepted Revised nonland frame sample. Original wording and symbols; source scans normalized by independently checked frame poses, actual final native faces. Both perimeter polarities are measured; the known native center/radius rejects false edges before they can enter a fit. Outer perimeter chooses geometry without glyph overlap, saturation or interior contrast. Rejected poses and weak/boundary circles remain explicit. Cohorts are reused development data. This measures discs and adjacent pitch only; it does not certify glyphs, pigment, full cards, or a new renderer profile.',
  rendererHash,
  sources: {
    inputs: hash(bytes[0]),
    poses: hash(bytes[1]),
    capture: hash(bytes[2]),
    canonicalRings: hash(bytes[3]),
    toolHash,
    modules: beforeModules,
  },
  summary: {
    nonlands: entries.length,
    acceptedFrames: rows.length,
    excludedFrames: excluded.length,
    circles: discs.length,
    acceptedCircles: discs.filter((d) => d.accepted).length,
  },
  groups,
  pitch: Object.fromEntries(
    ['all', 'calibration', 'validation'].map((c) => [
      c,
      pitchSummary(pairs.filter((r) => c === 'all' || r.cohort === c)),
    ]),
  ),
  elapsedSeconds: (performance.now() - start) / 1000,
  rows,
  excluded,
  pairs,
});
console.log('Saved', outputFile, JSON.stringify(groups.all));
