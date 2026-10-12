import assert from 'node:assert/strict';
import {
  measureScanFrame,
  scanTranslationTemplate,
  scanTranslation,
} from '../games/magic/tools/accuracy/scan-translation.mjs';
import { WIDTH, HEIGHT } from '../games/magic/tools/accuracy/pixels.mjs';

function frame({
  dx = 0,
  dy = 0,
  tone = 1,
  grain = 0,
  local = 0,
  missing = false,
  text = false,
} = {}) {
  const data = new Uint8Array(WIDTH * HEIGHT * 4);
  for (let y = 0; y < HEIGHT; y++)
    for (let x = 0; x < WIDTH; x++) {
      const xx = x - dx,
        yy = y - dy;
      let v = 10;
      if (!missing && xx >= 20 && xx < 467 && yy >= 20 && yy < 602) v = 100;
      if (!missing && xx >= 32 && xx < 455) {
        if (yy >= 32 && yy < 67 + local) v = 230;
        if (yy >= 67 + local && yy < 72 + local) v = 10;
        if (yy >= 72 + local && yy < 378) v = 150;
        if (yy >= 378 && yy < 382) v = 10;
        if (yy >= 382 && yy < 628) v = 220;
      }
      // Independent component changes must not influence the estimated offset.
      if (
        text &&
        xx > 45 &&
        xx < 443 &&
        ((yy > 39 && yy < 60) || (yy > 390 && yy < 620)) &&
        xx % 11 < 5 &&
        yy % 21 < 8
      )
        v = 5;
      v = Math.max(0, Math.min(255, v * tone + grain * Math.sin(x * 23 + y * 17)));
      data.set([v, v, v, 255], (y * WIDTH + x) * 4);
    }
  return { width: WIDTH, height: HEIGHT, data };
}
const baseline = measureScanFrame(frame());
const template = scanTranslationTemplate(Array.from({ length: 12 }, () => baseline));
for (const dx of [-3, 0, 3])
  for (const dy of [-3, 0, 3]) {
    const result = scanTranslation(
      measureScanFrame(frame({ dx, dy, tone: 0.75, grain: 3, text: true })),
      template,
    );
    assert.equal(result.axes.x.status, 'accepted');
    assert.equal(result.axes.y.status, 'accepted');
    assert.ok(Math.abs(result.transform.tx + dx) < 0.15);
    assert.ok(Math.abs(result.transform.ty + dy) < 0.15);
    assert.equal(result.transform.scale, 1);
    assert.equal(result.transform.rotation, 0);
  }
const local = scanTranslation(measureScanFrame(frame({ local: 3 })), template);
assert.equal(local.axes.y.status, 'inconsistent-geometry');
assert.equal(local.transform.ty, 0);
const missing = scanTranslation(measureScanFrame(frame({ missing: true })), template);
assert.equal(missing.transform.tx, 0);
assert.equal(missing.transform.ty, 0);
assert.throws(() => scanTranslationTemplate([baseline]), /twelve/);
assert.throws(
  () => measureScanFrame({ width: 1, height: 1, data: new Uint8Array(4) }),
  /canonical/,
);
console.log(
  'Frame-only scan translation: known offsets, tone/grain, changed text, inconsistent geometry and missing anchors passed.',
);
