// Audit-only native pixel reuse. Coordinates follow the 488x680 pixel-center convention.
import assert from 'node:assert/strict';
import { hash } from './common.mjs';

export function manaInterior(image, token, inset = 2) {
  const sx = image.width / 488,
    sy = image.height / 680;
  assert.equal(sx, sy, 'Native face must preserve reference aspect');
  const rx = token.radiusX - inset,
    ry = token.radiusY - inset;
  assert(rx > 0 && ry > 0, 'Empty mana interior');
  const bytes = [];
  for (let y = Math.floor((token.y - ry) * sy); y <= Math.ceil((token.y + ry + 1) * sy); y++)
    for (let x = Math.floor((token.x - rx) * sx); x <= Math.ceil((token.x + rx + 1) * sx); x++) {
      const dx = ((x + 0.5) / sx - 0.5 - token.x) / rx;
      const dy = ((y + 0.5) / sy - 0.5 - token.y) / ry;
      if (dx * dx + dy * dy > 1) continue;
      assert(x >= 0 && y >= 0 && x < image.width && y < image.height);
      const i = (y * image.width + x) * 4;
      for (let k = 0; k < 4; k++) bytes.push(image.data[i + k]);
    }
  assert(bytes.length > 0);
  return { pixels: bytes.length / 4, sha256: hash(Buffer.from(bytes)) };
}

export function checkManaReuse(receipt, census) {
  assert.equal(receipt.status, 'released-mana-calibration-reused-with-native-parity');
  assert.equal(receipt.rows.length, 264);
  assert.equal(new Set(receipt.rows.map((r) => r.id)).size, 264);
  const expected = census.rows.filter((r) => r.components.mana.applicable);
  assert.deepEqual(receipt.rows.map((r) => r.id).sort(), expected.map((r) => r.id).sort());
  assert.equal(receipt.definition.rendererHash, census.definition.rendererHash);
  assert.equal(receipt.definition.nativeCaptureHash, census.definition.nativeCaptureHash);
  assert.equal(receipt.definition.inputsHash, census.definition.inputsHash);
  assert.equal(receipt.definition.normalizationHash, census.definition.normalizationHash);
  assert.equal(receipt.summary.tokens, 567);
  assert.equal(receipt.summary.changedInteriors, 0);
  assert.equal(receipt.summary.nonfoilCards, 259);
  assert.equal(receipt.summary.foilOnlyCards, 5);
  assert.equal(receipt.policy.foilPigmentFit, false);
  assert.equal(receipt.policy.independentHoldout, false);
  assert.equal(receipt.policy.rendererChanges, false);
  assert.deepEqual(receipt.parameters, receipt.selectedParameters);
  const donors = receipt.rows.filter((r) => r.nonfoil && r.family === 'walker');
  assert.equal(donors.length, 9);
  assert(new Set(donors.map((r) => r.name)).size >= 3);
  const colors = new Set(
    donors.flatMap((r) => r.tokens.map((t) => (/^\d+$/.test(t.symbol) ? 'N' : t.symbol))),
  );
  for (const color of ['N', 'W', 'U', 'B', 'R', 'G']) assert(colors.has(color));
  assert.equal(
    receipt.rows.reduce((n, r) => n + r.tokens.length, 0),
    567,
  );
  for (const row of receipt.rows) {
    const current = census.rows.find((r) => r.id === row.id);
    for (const k of ['name', 'nonfoil', 'referenceHash', 'poseHash', 'inputHash', 'nativeFaceHash'])
      assert.deepEqual(row[k], current[k], 'Changed current mana member ' + k);
    assert(current.poseAccepted);
    assert.equal(row.score100, current.components.mana.score100);
    assert(Number.isFinite(row.score100));
    assert(row.family === 'normal' || row.family === 'walker');
    assert(row.tokens.length > 0);
    for (const [index, token] of row.tokens.entries()) {
      assert.equal(token.index, index);
      assert(token.pixels > 100);
      assert.match(token.beforeHash, /^[a-f0-9]{64}$/);
      assert.equal(token.beforeHash, token.afterHash, 'Changed native mana pixels');
      assert(token.radiusX > 2 && token.radiusY > 2);
    }
  }
  assert(receipt.definition.manaSources.length > 0);
  for (const source of receipt.definition.manaSources)
    assert.equal(source.beforeHash, source.afterHash, 'Changed mana source asset');
  assert(receipt.definition.shadowPainters.length > 0);
  for (const painter of receipt.definition.shadowPainters)
    assert.equal(painter.beforeHash, painter.afterHash, 'Changed shadow painter');
}
