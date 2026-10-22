import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  createModernManaObjective,
  manaCandidateCircle,
  manaCandidateControls,
} from './modern-mana-objective.mjs';
import { modernManaCircle, modernManaRayTemplate } from './modern-mana-ring.mjs';
test('cached objective preserves audited observer quality and fixed crop bounds', () => {
  const width = 64,
    height = 64,
    data = new Uint8Array(width * height * 4),
    paper = [202, 197, 192];
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const coverage = Math.max(0, Math.min(1, 12 - Math.hypot(x - 31.5, y - 31)));
      for (let c = 0; c < 3; c++)
        data[(y * width + x) * 4 + c] = Math.round(240 * (1 - coverage) + paper[c] * coverage);
      data[(y * width + x) * 4 + 3] = 255;
    }
  const image = { width, height, data };
  const template = modernManaRayTemplate(image, { x: 31.5, y: 31, radius: 11.5, paper });
  const found = modernManaCircle(image, {
    x: 31,
    y: 31,
    range: 2,
    radiusRange: [10, 13],
    paper,
    rayMask: template.mask,
    rayThresholds: template.thresholds,
  });
  const objective = createModernManaObjective(image, { paper, ...template });
  assert.equal(objective.score(found.x, found.y, found.radius), found.score);
  assert(objective.score(31.5, 31, 11.5) > objective.score(33, 32, 10));
  assert.throws(() => objective.score(2, 2, 12), /leaves its fixed crop/);
  assert.throws(
    () => createModernManaObjective(image, { paper, mask: [], thresholds: [] }),
    /Invalid/,
  );
});
test('physical knobs and renderer right anchoring describe identical circles', () => {
  const base = { size: 23.426928, gap: 1.84464, scale: 1.01 },
    right = 452.5,
    cy = 48;
  for (const candidate of [
    { diameter: 0, pitch: 0, dx: 0, dy: 0 },
    { diameter: -1, pitch: 0.125, dx: 0.25, dy: -0.125 },
    { diameter: 0.5, pitch: -0.25, dx: -0.5, dy: 0.5 },
  ]) {
    const controls = manaCandidateControls(candidate, base);
    for (let fromRight = 0; fromRight < 5; fromRight++) {
      const disc = {
        x: right - (base.size / 2 + fromRight * (base.size + base.gap)) * base.scale,
        y: cy,
        radius: (base.size * base.scale) / 2,
        fromRight,
      };
      const measured = manaCandidateCircle(disc, candidate);
      const x =
        right +
        controls.dx -
        (base.size / 2 + fromRight * (base.size + base.gap + controls.spacing)) * controls.scaleX;
      assert(Math.abs(measured.x - x) < 1e-10);
      assert(Math.abs(measured.radius - (base.size * controls.scaleY) / 2) < 1e-10);
      assert.equal(measured.y, cy + controls.dy);
    }
  }
});
