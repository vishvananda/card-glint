import assert from 'node:assert/strict';
import { test } from 'node:test';
import { modernManaCircle, modernManaRayTemplate } from './modern-mana-ring.mjs';
function disc(
  paper,
  background,
  { noise = 0, shadow = false, glyph = true, cx = 31.75, cy = 30.5, radius = 11.5 } = {},
) {
  const width = 64,
    height = 64,
    data = new Uint8Array(width * height * 4);
  const clamp = (v) => Math.max(0, Math.min(1, v));
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const d = Math.hypot(x - cx, y - cy),
        a = clamp(radius + 0.5 - d);
      const sh = shadow ? clamp(radius + 0.75 - Math.hypot(x - cx + 1, y - cy - 2)) * 0.55 : 0;
      const ink =
        glyph &&
        ((d < radius * 0.8 && (Math.abs(x - cx) < 2.5 || Math.abs(y - cy) < 2.5)) ||
          (glyph === 'edge' &&
            d < radius * 0.98 &&
            x - cx > radius * 0.5 &&
            Math.abs(y - cy) < (x - cx) * 0.65));
      const grain = (((((x * 73856093) ^ (y * 19349663)) >>> 0) % 101) / 100 - 0.5) * noise;
      for (let c = 0; c < 3; c++) {
        const bg = background[c] * (1 - sh);
        data[(y * width + x) * 4 + c] = Math.round(
          Math.max(0, Math.min(255, bg * (1 - a) + (ink ? 15 : paper[c]) * a + grain)),
        );
      }
      data[(y * width + x) * 4 + 3] = 255;
    }
  return { width, height, data, cx, cy, radius };
}
test('recovers dark, light and chromatic disc boundaries independently of glyph contrast', () => {
  for (const [paper, bg] of [
    [
      [202, 197, 192],
      [240, 240, 238],
    ],
    [
      [249, 244, 219],
      [229, 225, 211],
    ],
    [
      [228, 153, 119],
      [230, 167, 135],
    ],
    [
      [193, 215, 233],
      [166, 190, 208],
    ],
    [
      [163, 192, 149],
      [194, 216, 190],
    ],
    [
      [150, 190, 230],
      [200, 180, 160],
    ],
  ])
    for (const shadow of [false, true]) {
      const image = disc(paper, bg, { shadow, noise: 5 });
      const found = modernManaCircle(image, {
        x: 32,
        y: 31,
        range: 2,
        radiusRange: [10, 13],
        paper,
      });
      assert.equal(found.status, 'measured', JSON.stringify({ paper, bg, shadow, found }));
      assert(Math.abs(found.x - image.cx) <= 0.4, JSON.stringify(found));
      assert(Math.abs(found.y - image.cy) <= 0.4, JSON.stringify(found));
      assert(Math.abs(found.radius - image.radius) <= 0.4, JSON.stringify(found));
    }
});
test('rejects absent, bounded and invalid perimeters', () => {
  const empty = disc([200, 200, 200], [200, 200, 200], { glyph: false });
  assert.equal(
    modernManaCircle(empty, { x: 32, y: 31, radiusRange: [10, 13] }).status,
    'weak-edge',
  );
  const circle = disc([100, 150, 190], [240, 240, 240]);
  assert.equal(
    modernManaCircle(circle, { x: 28, y: 31, range: 2, radiusRange: [10, 13] }).status,
    'search-boundary',
  );
  assert.throws(() => modernManaCircle(circle, { x: 2, y: 2 }), /leaves its crop/);
  assert.throws(() => modernManaCircle(circle, { x: 32, y: 31, radiusRange: [13, 10] }), /Invalid/);
});

test('source paper arcs recover shifted scans without fitting to glyph or shadow edges', () => {
  const paper = [202, 197, 192],
    bg = [239, 237, 232];
  const source = disc(paper, bg, { shadow: true, glyph: 'edge' });
  const template = modernManaRayTemplate(source, {
    x: source.cx,
    y: source.cy,
    radius: source.radius,
    paper,
  });
  assert(
    template.mask.some((v) => !v),
    'Expected the source glyph to hide some perimeter arcs',
  );
  const scan = disc(
    paper.map((v) => v + 8),
    bg,
    {
      cx: source.cx + 1,
      cy: source.cy - 0.75,
      radius: 11,
      noise: 8,
      shadow: true,
      glyph: 'edge',
    },
  );
  for (const image of [source, scan]) {
    const found = modernManaCircle(image, {
      x: source.cx,
      y: source.cy,
      range: 2,
      radiusRange: [10, 13],
      paper,
      rayMask: template.mask,
      rayThresholds: template.thresholds,
    });
    assert.equal(found.status, 'measured', JSON.stringify(found));
    assert(Math.abs(found.x - image.cx) <= 0.4, JSON.stringify(found));
    assert(Math.abs(found.y - image.cy) <= 0.4, JSON.stringify(found));
    assert(Math.abs(found.radius - image.radius) <= 0.4, JSON.stringify(found));
  }
  assert.equal(
    modernManaCircle(source, {
      x: source.cx,
      y: source.cy,
      paper,
      rayMask: Array(96).fill(false),
    }).status,
    'insufficient-source-arcs',
  );
});
