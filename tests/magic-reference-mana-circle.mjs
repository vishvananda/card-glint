import assert from 'node:assert/strict';
import { referenceManaCircle } from '../games/magic/tools/accuracy/reference-mana-circle.mjs';
function image({
  x = 48.25,
  y = 47.75,
  radius = 17.55,
  paper = 210,
  frame = 80,
  glyph = true,
  bar = false,
} = {}) {
  const width = 96,
    height = 96,
    data = new Uint8Array(width * height * 4);
  for (let py = 0; py < height; py++)
    for (let px = 0; px < width; px++) {
      let sum = 0;
      for (let sy = 0; sy < 4; sy++)
        for (let sx = 0; sx < 4; sx++) {
          const dx = px + (sx + 0.5) / 4 - 0.5 - x,
            dy = py + (sy + 0.5) / 4 - 0.5 - y,
            r = Math.hypot(dx, dy);
          let v = r < radius ? paper : frame;
          if (glyph && (r < 11 || (Math.abs(dx) < 3 && Math.abs(dy) < 14))) v = 15;
          if (bar && py >= 28 && py < 30) v = 20;
          sum += v;
        }
      data.set([sum / 16, sum / 16, sum / 16, 255], (py * width + px) * 4);
    }
  return { width, height, data };
}
const prior = { x: 48.25, y: 47.75, radius: 17.55, range: 3, radiusTolerance: 0.75 };
for (const spec of [
  { x: 49, y: 47.5, radius: 17.4, paper: 220, frame: 85 },
  { x: 48.75, y: 48, radius: 17.65, paper: 120, frame: 230 },
  { x: 47.75, y: 47.25, radius: 17.5, paper: 207, frame: 188 },
]) {
  const fit = referenceManaCircle(image(spec), prior);
  assert.equal(fit.status, 'measured', JSON.stringify(fit));
  assert(Math.hypot(fit.x - spec.x, fit.y - spec.y) < 0.4, JSON.stringify(fit));
  assert(Math.abs(fit.radius - spec.radius) < 0.4);
  assert.equal(fit.polarity, spec.paper > spec.frame ? 'light-on-dark' : 'dark-on-light');
}
for (const spec of [
  { paper: 200, frame: 200 },
  { paper: 200, frame: 200, bar: true },
  { x: 54, y: 47.75, paper: 220, frame: 80 },
  { x: 51.125, y: 47.75, paper: 220, frame: 80 },
]) {
  const fit = referenceManaCircle(image(spec), prior);
  assert.equal(fit.status, 'unresolved', JSON.stringify(fit));
}
for (const phase of [0, 0.7, 1.4]) {
  const missing = image({ paper: 200, frame: 200, bar: true });
  for (let y = 0; y < missing.height; y++)
    for (let x = 0; x < missing.width; x++) {
      const n =
          12 * Math.sin(1.7 * x + 0.6 * y + phase) +
          10 * Math.cos(0.5 * x - 1.8 * y + phase) +
          8 * Math.sin(5 * x - 1.1 * y - phase),
        i = (y * missing.width + x) * 4;
      for (let k = 0; k < 3; k++)
        missing.data[i + k] = Math.round(Math.max(0, Math.min(255, missing.data[i + k] + n)));
    }
  const fit = referenceManaCircle(missing, prior);
  assert.equal(
    fit.status,
    'unresolved',
    'Textured missing rim must not become geometry: ' + JSON.stringify(fit),
  );
}
for (const phase of [0, 0.7, 1.4]) {
  const spec = { x: 49, y: 47.5, radius: 17.4, paper: 120, frame: 230 },
    textured = image(spec);
  for (let y = 0; y < textured.height; y++)
    for (let x = 0; x < textured.width; x++) {
      const noise =
          12 * Math.sin(1.7 * x + 0.6 * y + phase) +
          10 * Math.cos(0.5 * x - 1.8 * y + phase) +
          8 * Math.sin(5 * x - 1.1 * y - phase),
        i = (y * textured.width + x) * 4;
      for (let k = 0; k < 3; k++)
        textured.data[i + k] = Math.round(Math.max(0, Math.min(255, textured.data[i + k] + noise)));
    }
  const fit = referenceManaCircle(textured, prior);
  assert.equal(fit.status, 'measured', JSON.stringify(fit));
  assert(Math.hypot(fit.x - spec.x, fit.y - spec.y) < 0.6, JSON.stringify(fit));
  assert(Math.abs(fit.radius - spec.radius) < 0.5);
  assert.equal(fit.polarity, 'dark-on-light');
}
assert.throws(() => referenceManaCircle(image(), { ...prior, radius: NaN }), /Invalid/);
for (const bad of [null, {}, { width: 96, height: 96, data: new Uint8Array(1) }])
  assert.throws(() => referenceManaCircle(bad, prior), /Invalid reference circle raster/);
const reused = image();
assert.equal(referenceManaCircle(reused, prior).status, 'measured');
for (let i = 0; i < reused.data.length; i += 4) reused.data.set([200, 200, 200, 255], i);
assert.equal(
  referenceManaCircle(reused, prior).status,
  'unresolved',
  'A reused buffer must not retain a prior paper perimeter',
);
console.log(
  'Reference circle prior recovers both contrast polarities and subpixel centers; missing paper rims, inner glyph circles,frame bars and out-of-range circles remain unresolved.',
);
