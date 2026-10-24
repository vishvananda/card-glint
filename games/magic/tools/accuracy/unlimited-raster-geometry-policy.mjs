// Audit gates for the five Unlimited raster-selection variants.
import assert from 'node:assert/strict';
export const unlimitedRasterGeometryPolicy = Object.freeze({
  minimumPosition100: 99.5,
  maximumShiftPixels: 0.1,
  maximumReferenceLoss100: 0.25,
  minimumDisplacedLoss100: 1,
});
export const unlimitedRasterGeometryStrips = Object.freeze([
  'left',
  'right',
  'top',
  'bottom',
  'artLeft',
  'artRight',
  'artTop',
  'artBottom',
  'paperLeft',
  'paperRight',
  'paperTop',
  'paperBottom',
]);
export function validateUnlimitedRasterGeometry(review, paper, raster) {
  assert.equal(review.schema, 1);
  assert.equal(review.status, 'unlimited-raster-geometry-measurement');
  assert.equal(review.source.rendererHash, paper.afterRenderer);
  assert.equal(review.source.nativeHash, paper.native.contentSha256);
  assert.equal(review.source.priorNativeHash, raster.native.contentSha256);
  const members = raster.members.filter((m) => m.set === '2ed');
  assert.equal(members.length, 5);
  assert.deepEqual(review.rows.map((r) => r.id).sort(), members.map((m) => m.id).sort());
  const policy = unlimitedRasterGeometryPolicy;
  for (const r of review.rows) {
    const member = members.find((m) => m.id === r.id);
    assert.equal(r.name, member.name);
    assert.equal(r.set, member.set);
    for (const field of ['referenceHash', 'poseHash', 'inputHash'])
      assert.equal(r[field], member[field], 'Changed geometry identity: ' + field);
    assert.equal(r.beforeFaceHash, member.original.hashes['before-face']);
    assert.equal(r.currentFaceHash, member.original.hashes['after-face']);
    assert.equal(r.nativeInteriorExact, true);
    assert.equal(r.pairedLayers, 6);
    assert.deepEqual(Object.keys(r.strips).sort(), [...unlimitedRasterGeometryStrips].sort());
    for (const s of Object.values(r.strips)) {
      for (const value of [
        s.samePosition100,
        s.best.shift,
        s.best.score,
        s.referenceBefore100,
        s.referenceAfter100,
      ])
        assert(Number.isFinite(value), 'Missing/nonfinite geometry measurement');
      for (const value of [
        s.samePosition100,
        s.best.score,
        s.referenceBefore100,
        s.referenceAfter100,
      ])
        assert(value >= 0 && value <= 100 + 1e-9, 'Invalid geometry index');
      assert(s.samePosition100 >= policy.minimumPosition100, 'Changed edge shape');
      assert(Math.abs(s.best.shift) <= policy.maximumShiftPixels, 'Changed physical edge position');
      assert(
        s.referenceBefore100 - s.referenceAfter100 <= policy.maximumReferenceLoss100,
        'New reference-edge regression',
      );
      assert.deepEqual(
        s.negative.map((n) => n.shift),
        [-2, 2],
      );
      assert(
        s.negative.every(
          (n) =>
            Number.isFinite(n.score) &&
            n.score >= 0 &&
            n.score <= 100 + 1e-9 &&
            s.samePosition100 - n.score >= policy.minimumDisplacedLoss100,
        ),
        'Insensitive geometry strip',
      );
    }
  }
  return policy;
}
