// Independent mana measurements on frozen Original inputs and frame-normalized scans.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, sourceHash, root, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { outerManaCircle } from './abu-mana-ring.mjs';
import { oldFrameManaDisc } from './old-frame-mana-disc.mjs';
import { center, delta, median, quantile } from './hsb-color.mjs';
const [inputFile, poseFile, exportedFile, nativeDirectory, out] = process.argv.slice(2);
assert(out, 'Use INPUTS POSES EXPORTED_INPUTS NATIVE_DIRECTORY NEW_OUTPUT');
const raw = await Promise.all(
  [inputFile, poseFile, exportedFile, path.join(nativeDirectory, 'capture.json')].map((f) =>
    fs.readFile(f),
  ),
);
const [input, poses, exported, native] = raw.map((b) => JSON.parse(b));
assert(['mir', 'ons'].includes(input.set));
assert.equal(poses.inputHash, hash(raw[0]));
assert.equal(exported.inputHash, hash(raw[0]));
assert.equal(native.source.inputHash, hash(raw[0]));
assert(native.complete && !native.faults.length);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(rendererHash, native.source.rendererHash);
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const dependencies = async () =>
  Object.fromEntries(
    await Promise.all(
      [
        'abu-mana-ring.mjs',
        'old-frame-mana-disc.mjs',
        'hsb-color.mjs',
        'pixels-pure.mjs',
        'scan-transform.mjs',
      ].map(async (f) => [f, hash(await fs.readFile(new URL(f, import.meta.url)))]),
    ),
  );
const graph = await dependencies();
const family = (e) =>
  /^\d+$/.test(e.face.manaSymbols.at(-1)) || e.face.manaSymbols.at(-1) === 'X'
    ? 'N'
    : e.face.manaSymbols.at(-1);
const candidates = input.entries.filter(
  (e) => e.face.manaSymbols?.length && poses.rows.find((r) => r.id === e.id)?.accepted,
);
assert(candidates.every((e) => e.face.wordingMode === 'original' && /^[WUBRGN]$/.test(family(e))));
const entries = [];
for (const symbol of ['W', 'U', 'B', 'R', 'G', 'N'])
  for (const cohort of ['calibration', 'validation']) {
    const rr = candidates
      .filter(
        (e) => family(e) === symbol && exported.rows.find((r) => r.id === e.id).cohort === cohort,
      )
      .sort((a, b) => hash(a.name.toLowerCase()).localeCompare(hash(b.name.toLowerCase())));
    entries.push(
      ...rr.filter((e) => e.face.manaSymbols.length === 1).slice(0, symbol === 'N' ? 5 : 2),
      ...rr.filter((e) => e.face.manaSymbols.length > 1).slice(0, 3),
    );
  }
const pigment = (image, circle) => {
  const pixels = [];
  for (let y = Math.ceil(circle.y - circle.radius * 0.9); y <= circle.y + circle.radius * 0.9; y++)
    for (
      let x = Math.ceil(circle.x - circle.radius * 0.9);
      x <= circle.x + circle.radius * 0.9;
      x++
    ) {
      if (Math.hypot(x - circle.x, y - circle.y) > circle.radius * 0.9) continue;
      const at = (y * image.width + x) * 4;
      pixels.push([0, 1, 2].map((k) => image.data[at + k] / 255));
    }
  pixels.sort((a, b) => Math.max(...a) - Math.max(...b));
  const paper = pixels.slice(Math.floor(pixels.length * 0.8)),
    ink = pixels.slice(0, Math.ceil(pixels.length * 0.05));
  const disc = center(paper),
    glyph = center(ink);
  return {
    disc,
    glyph,
    separation: Math.max(...disc) - Math.max(...glyph),
    paperSpread: quantile(
      paper.map((p) => delta(p, disc)),
      0.9,
    ),
  };
};
const rows = [];
for (const e of entries) {
  const n = native.rows.find((r) => r.id === e.id),
    pose = poses.rows.find((r) => r.id === e.id);
  assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(n.referenceHash, e.reference.sha256);
  assert.match(n.file, /^[a-z0-9-]+\.png$/i);
  const b = await fs.readFile(path.join(nativeDirectory, n.file)),
    ref = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(b), n.sha256);
  assert.equal(hash(ref), e.reference.sha256);
  const render = normalize(PNG.sync.read(b)),
    scan = normalize(PNG.sync.read(ref), pose.transform);
  const rc = outerManaCircle(render, { x: 438, y: 44, range: 6, radiusRange: [9, 14.5] });
  const sc =
    rc.status === 'measured'
      ? oldFrameManaDisc(scan, {
          x: rc.x,
          y: rc.y,
          radius: rc.radius,
          range: 6,
          radiusTolerance: 1.25,
        })
      : { status: 'unresolved', reason: 'native-perimeter-unresolved' };
  const failures = [];
  if (rc.status !== 'measured') failures.push('native/' + rc.status);
  if (sc.status !== 'measured') failures.push('scan/' + sc.status + ':' + sc.reason);
  let rp, sp, pitch;
  if (!failures.length) {
    rp = pigment(render, rc);
    sp = pigment(scan, sc);
    if (rp.separation <= 0.15 || sp.separation <= 0.15) failures.push('weak-pigment-separation');
    if (e.face.manaSymbols.length > 1) {
      const previous = outerManaCircle(render, {
        x: rc.x - 27,
        y: rc.y,
        range: 4,
        radiusRange: [rc.radius - 0.75, rc.radius + 0.75],
      });
      const target =
        previous.status === 'measured'
          ? oldFrameManaDisc(scan, {
              x: sc.x - 26,
              y: sc.y,
              radius: sc.radius,
              range: 2,
              radiusTolerance: 0.75,
            })
          : { status: 'unresolved' };
      pitch = {
        native: previous,
        scan: target,
        accepted: previous.status === 'measured' && target.status === 'measured',
      };
      if (pitch.accepted) {
        pitch.nativePitch = rc.x - previous.x;
        pitch.scanPitch = sc.x - target.x;
        pitch.accepted =
          pitch.nativePitch >= 23 &&
          pitch.nativePitch <= 28 &&
          pitch.scanPitch >= 24 &&
          pitch.scanPitch <= 28 &&
          Math.abs(target.y - sc.y) <= 1 &&
          Math.abs(previous.y - rc.y) <= 1 &&
          Math.abs(target.radius - sc.radius) <= 0.75;
      }
    }
  }
  rows.push({
    id: e.id,
    name: e.name,
    symbol: family(e),
    cost: e.face.manaSymbols,
    cohort: exported.rows.find((r) => r.id === e.id).cohort,
    referenceHash: e.reference.sha256,
    nativeHash: n.sha256,
    poseHash: hash(JSON.stringify(pose.transform)),
    accepted: !failures.length,
    failures,
    render: { circle: rc, ...rp },
    scan: { circle: sc, ...sp },
    pitch,
  });
  if (rows.length % 10 === 0) console.log(input.set, rows.length, '/', entries.length);
}
const med = (values) => (values.length ? median(values) : null);
const groups = {};
for (const symbol of ['W', 'U', 'B', 'R', 'G', 'N']) {
  const rr = rows.filter((r) => r.symbol === symbol),
    cal = rr.filter((r) => r.accepted && r.cohort === 'calibration');
  const target =
    cal.length >= 2
      ? center(cal.map((r) => r.scan.disc)).map((v) => Math.round(v * 255) / 255)
      : undefined;
  groups[symbol] = {
    total: rr.length,
    accepted: rr.filter((r) => r.accepted).length,
    target,
    ink: cal.length >= 2 ? center(cal.map((r) => r.scan.glyph)) : undefined,
    cohorts: {},
  };
  for (const cohort of ['calibration', 'validation']) {
    const good = rr.filter((r) => r.accepted && r.cohort === cohort);
    groups[symbol].cohorts[cohort] = {
      count: good.length,
      dx: med(good.map((r) => r.scan.circle.x - r.render.circle.x)),
      dy: med(good.map((r) => r.scan.circle.y - r.render.circle.y)),
      radiusRatio: med(good.map((r) => r.scan.circle.radius / r.render.circle.radius)),
      beforePaper: med(good.map((r) => delta(r.render.disc, r.scan.disc))),
      targetPaper: target ? med(good.map((r) => delta(target, r.scan.disc))) : null,
    };
  }
}
assert.equal(toolHash, hash(await fs.readFile(new URL(import.meta.url))));
assert.deepEqual(await dependencies(), graph);
assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
await writeJson(out, {
  schema: 1,
  status: 'sampled-mana-perimeter-and-pigment-not-adopted',
  set: input.set,
  source: {
    inputHash: hash(raw[0]),
    poseHash: hash(raw[1]),
    exportedHash: hash(raw[2]),
    nativeHash: hash(raw[3]),
    rendererHash,
    toolHash,
    dependencies: graph,
  },
  scope:
    'Frozen Original inputs and scan poses; name-hash sample selected before measurements, up to two single and three multiple costs per symbol/cohort. Native circles use a fixed physical search; references use a bounded size prior and the set-wide light-paper polarity with explicit rejection. A stronger dark glyph edge cannot override the measured outer rim. Synthetic flat/noise/inverted/out-of-bounds controls are tested separately. These circles never transform scoring rasters. Calibration-only paper targets, independent validation, separately gated pitch probes. Not a glyph/numeral fit, whole-card score or set approval.',
  total: rows.length,
  accepted: rows.filter((r) => r.accepted).length,
  groups,
  rows,
});
console.log(JSON.stringify(groups));
