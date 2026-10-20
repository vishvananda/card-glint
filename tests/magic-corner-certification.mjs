import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import {
  measurePrintedCorners,
  validatePrintedCorners,
  certifyUniformBottomRecovery,
} from '../games/magic/tools/accuracy/scan-corner-certification.mjs';
const template = JSON.parse(
  await readFile(
    new URL(
      '../games/magic/fixtures/accuracy/early-through-fourth/alpha-bottom-corners.json',
      import.meta.url,
    ),
  ),
);
const evidence = {
  version: 1,
  corners: template.corners.map((c) => ({
    id: c.id,
    detected: true,
    x: c.point[0],
    y: c.point[1],
    area: 20,
    contrast: 200,
    shape: 0.99,
  })),
};
assert.equal(validatePrintedCorners(evidence, template).accepted, true);
for (const change of [
  (e) => {
    e.corners[0].x += 2;
  },
  (e) => {
    e.corners[1].y -= 2;
  },
  (e) => {
    e.corners[0].shape = 0.7;
  },
  (e) => {
    e.corners[0] = { id: 'left', detected: false };
  },
]) {
  const altered = structuredClone(evidence);
  change(altered);
  assert.equal(validatePrintedCorners(altered, template).accepted, false);
}
for (const change of [
  (e) => {
    e.corners[0].x = NaN;
  },
  (e) => {
    e.corners[0].area = 1e6;
  },
  (e) => {
    e.corners.reverse();
  },
  (e) => {
    e.corners[0].contrast = Infinity;
  },
]) {
  const altered = structuredClone(evidence);
  change(altered);
  assert.throws(() => validatePrintedCorners(altered, template));
}
const support = { count: 12, sides: { left: 0.95, right: 0.95, top: 0.95, bottom: 0.3 } },
  pose = {
    accepted: false,
    model: 'uniform',
    parameters: { sx: 1, sy: 1, tx: 0, ty: 0, rotation: 0, shear: 0 },
    transform: { matrix: [1, 0, 0, 1, 0, 0] },
    fit: support,
    validation: support,
    certification: support,
  };
assert.equal(certifyUniformBottomRecovery(pose, evidence, template).accepted, true);
for (const mutate of [
  (p) => {
    p.accepted = true;
  },
  (p) => {
    p.model = 'affine';
  },
  (p) => {
    p.parameters.sy = 1.01;
  },
  (p) => {
    p.transform.matrix[4] = 1;
  },
  (p) => {
    p.fit.sides.left = 0.7;
  },
  (p) => {
    p.validation.sides.top = 0.7;
  },
  (p) => {
    p.certification.sides.right = 0.7;
  },
  (p) => {
    p.certification.count = 8;
  },
]) {
  const changed = structuredClone(pose);
  mutate(changed);
  assert.equal(certifyUniformBottomRecovery(changed, evidence, template).accepted, false);
}
const blank = { width: 732, height: 1020, data: new Uint8Array(732 * 1020 * 4) };
for (let i = 0; i < blank.data.length; i += 4) blank.data.set([27, 27, 27, 255], i);
const missing = measurePrintedCorners(blank, {}, template);
assert(missing.corners.every((c) => !c.detected));
assert.equal(validatePrintedCorners(missing, template).accepted, false);
assert.throws(() =>
  measurePrintedCorners({ ...blank, data: blank.data.subarray(4) }, {}, template),
);
assert.throws(() => measurePrintedCorners(blank, { matrix: [1, 0, 0, 0, 0, 0] }, template));
console.log(
  'Printed-corner certificates: missing/forged evidence, weak independent sides, wrong transforms and unsupported models rejected.',
);
