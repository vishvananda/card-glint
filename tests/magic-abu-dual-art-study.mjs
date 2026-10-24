import assert from 'node:assert/strict';
import test from 'node:test';
import { reflowAbuDualArt } from '../games/magic/tools/accuracy/abu-dual-art-pixels.mjs';
import {
  medianFrameGradient,
  gradientOverlap,
  bestGradientShift,
} from '../games/magic/tools/accuracy/frame-edge-measure.mjs';

const raster = (width = 488, height = 680) => ({
  width,
  height,
  data: new Uint8ClampedArray(width * height * 4),
});
const at = (im, x, y) => (y * im.width + x) * 4;

test('art height rejects invalid parameters, including NaN rather than treating it as zero', () => {
  for (const v of [NaN, undefined, -1, 4.001, Infinity])
    assert.throws(() => reflowAbuDualArt(raster(), v), /Invalid art-height trial/);
  for (const im of [
    raster(0, 1),
    { width: 1.5, height: 1, data: [] },
    { width: 1, height: 1, data: [] },
  ])
    assert.throws(() => reflowAbuDualArt(im, 0), /Invalid art-height raster/);
});
test('zero art height preserves every byte; fixed top and all outside regions stay exact', () => {
  const im = raster();
  for (let y = 0; y < im.height; y++)
    for (let x = 0; x < im.width; x++)
      im.data.set([x % 256, y % 256, (x + y) % 256, 255], at(im, x, y));
  const original = im.data.slice();
  reflowAbuDualArt(im, 0);
  assert.deepEqual(im.data, original);
  reflowAbuDualArt(im, 2);
  let changed = 0;
  for (let y = 0; y < im.height; y++)
    for (let x = 0; x < im.width; x++) {
      const i = at(im, x, y);
      if (x < 47 || x >= 441 || y < 79 || y >= 384)
        assert.deepEqual(im.data.subarray(i, i + 4), original.subarray(i, i + 4));
      if (im.data[i + 1] !== original[i + 1]) changed++;
    }
  assert(changed > 10000);
  const i = at(im, 100, 375),
    from = at(im, 100, 377);
  assert.deepEqual(im.data.subarray(i, i + 4), original.subarray(from, from + 4));
});
test('fractional art-height interpolation preserves pigment at transparent aperture edges at every native tier', () => {
  for (const width of [244, 488, 732]) {
    const im = raster(width, (width * 680) / 488);
    for (let y = 0; y < im.height; y++)
      for (let x = 0; x < im.width; x++)
        if (((y + 0.5) / im.height) * 680 >= 370) im.data.set([180, 80, 40, 255], at(im, x, y));
    reflowAbuDualArt(im, 2.25);
    let partial = 0;
    for (let y = 0; y < im.height; y++)
      for (let x = 0; x < im.width; x++) {
        const cx = ((x + 0.5) / im.width) * 488,
          cy = ((y + 0.5) / im.height) * 680,
          i = at(im, x, y);
        if (cx < 50 || cx > 438 || cy < 360 || cy > 380 || im.data[i + 3] === 0) continue;
        assert.deepEqual([...im.data.subarray(i, i + 3)], [180, 80, 40]);
        if (im.data[i + 3] < 255) partial++;
      }
    assert(partial > 0, 'fractional aperture must exercise partial coverage');
  }
});
test('frame gradient finds direction and fractional displacement without chasing amplitude', () => {
  const a = Array.from(
    { length: 35 },
    (_, i) => Math.exp(-(((i - 14) / 1.4) ** 2)) + 0.4 * Math.exp(-(((i - 23) / 1.8) ** 2)),
  );
  const shifted = Array.from(a, (_, i) => ((a[i - 2] ?? 0) + (a[i - 1] ?? 0)) / 2);
  const best = bestGradientShift(a, shifted);
  assert.equal(best.shift, 1.5);
  assert(Math.abs(best.score - 100) < 1e-10);
  assert(gradientOverlap(a, shifted) < 95);
  assert.equal(
    bestGradientShift(
      a,
      shifted.map((v) => v * 3),
    ).shift,
    1.5,
  );
  assert.deepEqual(bestGradientShift(Array(35).fill(0), Array(35).fill(0)), { shift: 0, score: 0 });
  assert.throws(() =>
    gradientOverlap(
      a,
      a.map(() => NaN),
    ),
  );
});
test('median frame profiles ignore isolated ink and support both axes', () => {
  const image = raster(40, 40);
  for (let y = 0; y < 40; y++)
    for (let x = 0; x < 40; x++) image.data.set([x < 20 ? 20 : 180, 20, 20, 255], at(image, x, y));
  const a = medianFrameGradient(image, [0, 0, 40, 40, 'x']);
  for (let x = 0; x < 40; x++) image.data.set([255, 255, 255, 255], at(image, x, 8));
  assert.deepEqual(medianFrameGradient(image, [0, 0, 40, 40, 'x']), a);
  const transposed = raster(40, 40);
  for (let y = 0; y < 40; y++)
    for (let x = 0; x < 40; x++)
      transposed.data.set(
        image.data.subarray(at(image, y, x), at(image, y, x) + 4),
        at(transposed, x, y),
      );
  assert.deepEqual(medianFrameGradient(transposed, [0, 0, 40, 40, 'y']), a);
  assert.throws(() => medianFrameGradient(image, [0.5, 0, 20, 20, 'x']));
});

test('frozen native evidence retains all cards, methods and regression identities', async () => {
  const { readFile } = await import('node:fs/promises');
  const { gunzipSync } = await import('node:zlib');
  const { createHash } = await import('node:crypto');
  const digest = (x) => createHash('sha256').update(x).digest('hex');
  const report = JSON.parse(
    gunzipSync(
      await readFile(
        new URL(
          '../games/magic/fixtures/accuracy/early-through-fourth/abu-dual-art-height-trials.json.gz',
          import.meta.url,
        ),
      ),
    ),
  );
  assert.equal(report.status, 'native-art-height-trials-not-adopted');
  assert.equal(report.capture.source.closed, true);
  assert.equal(
    report.capture.source.rendererHash,
    '32785d6222e5effe73715a29b596d106141977478550eb10887d54438d85af2f',
  );
  assert.deepEqual(report.capture.faults, []);
  assert.equal(report.rows.length, 133);
  assert.equal(new Set(report.rows.map((r) => r.id)).size, 19);
  assert.equal(report.methods.length, 5);
  for (const method of report.methods) assert.equal(digest(method.text), method.sha256);
  const method = (name) => report.methods.find((m) => m.file.endsWith('/' + name)).sha256;
  assert.equal(method('abu-dual-art-pixels.mjs'), report.capture.source.kernelHash);
  assert.equal(method('abu-dual-art-trials.mjs'), report.capture.source.toolHash);
  assert.equal(method('abu-dual-art-trial-plugin.mjs'), report.capture.source.pluginHash);
  assert.equal(method('frame-edge-measure.mjs'), report.source.edgeMethodHash);
  assert.equal(method('abu-dual-art-report.mjs'), report.source.toolHash);
  assert.deepEqual(report.summary.current, report.summary.control);
  assert(report.summary.current.meanAbsoluteHeightResidual > 1.5);
  assert(report.summary['up-2'].meanAbsoluteHeightResidual < 0.5);
  assert(report.summary['up-2'].edgeMean100.artBottom > 90);
  assert(report.summary['up-2'].edgeMean100.artTop > 92);
  assert.equal(report.summary['up-2'].gains, 18);
  assert.equal(report.summary['up-2'].regressions, 1);
  const losses = report.rows.filter((r) => r.trial === 'up-2' && r.delta100 < -0.5);
  assert.equal(losses.length, 1);
  assert.equal(losses[0].set, 'lea');
  assert.equal(losses[0].name, 'Savannah');
  const baseline = report.rows.filter((r) => r.trial === 'current');
  assert.equal(baseline.filter((r) => r.set === 'lea').length, 9);
  assert.equal(baseline.filter((r) => r.set === 'leb').length, 10);
  for (const original of baseline) {
    const trials = report.rows.filter((r) => r.id === original.id);
    assert.equal(trials.length, 7);
    for (const row of trials) {
      assert.equal(row.referenceHash, original.referenceHash);
      assert.equal(row.poseHash, original.poseHash);
      assert.equal(row.inputHash, original.inputHash);
      assert.equal(row.outside, 0);
      assert.equal(row.alpha, 0);
      if (row.trial === 'control') assert.equal(row.renderHash, original.renderHash);
      for (const [k, c] of Object.entries(row.components)) {
        const b = original.components[k];
        assert.deepEqual(
          [c.eligible, c.applicable, c.status, c.weight],
          [b.eligible, b.applicable, b.status, b.weight],
        );
      }
      for (const edge of ['paperTop', 'paperBottom'])
        assert.deepEqual(row.edges[edge], original.edges[edge]);
    }
  }
});
