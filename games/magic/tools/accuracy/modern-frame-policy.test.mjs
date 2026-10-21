import test from 'node:test';
import assert from 'node:assert/strict';
import {
  modernFramePolicy,
  observationFramePolicy,
  requireFramePatchPolicy,
  MODERN_FRAME_CHANNEL,
  HSV_FRAME_POLICY,
  PCA_FRAME_POLICY,
} from './modern-frame-policy.mjs';
import { modernValueFramePatches } from './modern-frame-value.mjs';
import { nativeFrameRegions } from './native-frame-patches.mjs';
import { packFramePatches, unpackFramePatches, patchGradient } from './frame-patch-profiles.mjs';

const windows = { left: ['x', 12, 27, [130, 210, 290], 8] };
const bounds = { left: [0, 33] };
function raster(pixel) {
  const width = 244,
    height = 340,
    data = new Uint8Array(width * height * 4);
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) data.set([...pixel(x, y), 255], (y * width + x) * 4);
  return { width, height, data };
}

test('geometry policy is explicit and old observations retain their original method', () => {
  assert.equal(modernFramePolicy('normal'), HSV_FRAME_POLICY);
  for (const kind of ['planeswalker', 'planeswalker-large']) {
    assert.equal(modernFramePolicy(kind), PCA_FRAME_POLICY);
    assert.equal(
      observationFramePolicy({ channel: 'HSV-V-coarse-and-native-v1' }, { kind }),
      HSV_FRAME_POLICY,
    );
    assert.equal(
      observationFramePolicy(
        { channel: MODERN_FRAME_CHANNEL },
        { kind, finePolicy: PCA_FRAME_POLICY.key },
      ),
      PCA_FRAME_POLICY,
    );
    assert.throws(
      () => observationFramePolicy({ channel: MODERN_FRAME_CHANNEL }, { kind }),
      /mismatch/,
    );
    assert.throws(
      () =>
        observationFramePolicy(
          { channel: MODERN_FRAME_CHANNEL },
          { kind, finePolicy: HSV_FRAME_POLICY.key },
        ),
      /mismatch/,
    );
  }
  assert.throws(() => modernFramePolicy('planeswalker-unreviewed'), /Unreviewed/);
  assert.throws(
    () => observationFramePolicy({ channel: 'unknown' }, { kind: 'normal' }),
    /Unknown/,
  );
  assert.throws(
    () =>
      observationFramePolicy(
        { channel: 'HSV-V-coarse-and-native-v1' },
        { finePolicy: PCA_FRAME_POLICY.key },
      ),
    /Legacy/,
  );
});

test('RGB strip projection detects an isoluminant-value edge invisible to max RGB', () => {
  const image = raster((x) => (x < 10 ? [180, 50, 40] : [50, 180, 40]));
  const hsv = modernValueFramePatches(image, windows, bounds);
  const pca = modernValueFramePatches(image, windows, bounds, PCA_FRAME_POLICY);
  assert(hsv.every((p) => Math.hypot(...patchGradient(p)) < 1e-8));
  assert(pca.every((p) => Math.hypot(...patchGradient(p)) > 100));
  requireFramePatchPolicy([pca], PCA_FRAME_POLICY);
  assert.throws(() => requireFramePatchPolicy([pca], HSV_FRAME_POLICY), /declared/);
  assert.deepEqual(modernValueFramePatches(image, windows, bounds, HSV_FRAME_POLICY), hsv);
});

test('per-strip fields are isolated from all excluded pixels and survive float encoding', () => {
  const image = raster((x, y) => [20 + (x % 80), 40 + ((3 * x + y) % 160), 50 + (y % 100)]);
  const before = [modernValueFramePatches(image, windows, bounds, PCA_FRAME_POLICY)];
  const changed = { ...image, data: image.data.slice() };
  const allowed = new Uint8Array(image.width * image.height);
  for (const {
    rect: [left, top, right, bottom],
  } of nativeFrameRegions(image, windows, bounds))
    for (let y = top; y <= bottom; y++)
      allowed.fill(1, y * image.width + left, y * image.width + right + 1);
  for (let p = 0; p < allowed.length; p++)
    if (!allowed[p]) changed.data.set([p % 251, 0, 255, 255], p * 4);
  const packed = packFramePatches(before);
  assert.deepEqual(
    packFramePatches([modernValueFramePatches(changed, windows, bounds, PCA_FRAME_POLICY)]),
    packed,
  );
  assert.deepEqual(unpackFramePatches(packed.bytes, packed.description), before);
  for (const change of [
    (p) => {
      p.encoding = 'u8';
    },
    (p) => {
      p.projection.axis = [1, 1, 1];
    },
    (p) => {
      p.projection.axis[0] = Infinity;
    },
    (p) => {
      p.channel = HSV_FRAME_POLICY.channel;
    },
    (p) => {
      p.filter = HSV_FRAME_POLICY.filter;
    },
  ]) {
    const description = structuredClone(packed.description);
    change(description[0][0]);
    assert.throws(
      () => unpackFramePatches(packed.bytes, description),
      /encoding|offsets|projection|Projection/,
    );
  }
  const ordinary = packFramePatches([modernValueFramePatches(image, windows, bounds)]);
  assert.deepEqual(unpackFramePatches(ordinary.bytes, ordinary.description), [
    modernValueFramePatches(image, windows, bounds),
  ]);
});

test('channel permutations preserve positive frame contrast without global color fitting', () => {
  const image = raster((x, y) => {
    const v = x < 10 ? 30 : 140 + (y % 20);
    return [v, v + 20, v / 2];
  });
  const swapped = { ...image, data: image.data.slice() };
  for (let p = 0; p < image.width * image.height; p++) {
    swapped.data[p * 4] = image.data[p * 4 + 2];
    swapped.data[p * 4 + 2] = image.data[p * 4];
  }
  const a = modernValueFramePatches(image, windows, bounds, PCA_FRAME_POLICY);
  const b = modernValueFramePatches(swapped, windows, bounds, PCA_FRAME_POLICY);
  for (let k = 0; k < a.length; k++)
    for (let i = 0; i < a[k].values.length; i++)
      assert(Math.abs(a[k].values[i] - b[k].values[i]) < 1e-4);
});
