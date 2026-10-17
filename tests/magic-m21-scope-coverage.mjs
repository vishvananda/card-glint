import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  applyM21BoundaryRefinement,
  applyM21StockTransfer,
  applyM21WhiteDefault,
} from '../games/magic/tools/accuracy/calibration-m21-scope.mjs';
const read = async (f) => JSON.parse(await readFile('games/magic/fixtures/accuracy/' + f));
const boundaries = await read('m21-component-boundaries-v2.json'),
  stock = await read('modern-land-stock-transfer.json');
for (const receipt of [boundaries, stock])
  for (const [f, expected] of Object.entries(receipt.sourceGuards))
    assert.equal(
      hash(await readFile('games/magic/src/presentation/' + f)),
      expected,
      'Stale scope proof: ' + f,
    );
assert.equal(boundaries.summary.cards, 239);
assert.equal(boundaries.summary.accepted, 231);
assert.equal(boundaries.summary.rejected.length, 8);
assert.equal(boundaries.knownPoses.total, 80);
assert.equal(boundaries.knownPoses.passed, 80);
assert.ok(boundaries.knownPoses.maxResidual < 0.3);
for (const r of boundaries.knownPoses.rows) {
  assert.equal(r.passed, true);
  assert.equal(r.fitAccepted, true);
  assert.equal(r.certificationAccepted, true);
  assert.ok(r.maxResidual < 0.3);
}
const old = await read('m21-mono-boundaries.json');
assert.deepEqual(
  boundaries.templates.mono,
  old.templates,
  'Keep original templates and cohorts frozen',
);
for (const r of boundaries.rows.filter((r) => r.accepted)) {
  for (const k of ['fit', 'selection', 'certification', 'rasterReplay'])
    assert.equal(r[k].accepted, true, r.name + ': ' + k);
  assert.equal(r.transform.matrix.length, 6);
  assert.ok(r.transform.matrix.every(Number.isFinite));
}
assert.equal(stock.native.summary.cards, 305);
assert.equal(stock.native.summary.changed, 45);
assert.equal(stock.native.summary.unchanged, 260);
assert.equal(stock.native.summary.controls, 13);
assert.equal(stock.native.rows.filter((r) => r.stockChanged && r.set === 'm21').length, 45);
for (const r of [...stock.native.rows, ...stock.native.controls]) {
  assert.ok(r.maxInteriorDelta <= 1, 'Only sub-byte stock blending at translucent component edges');
  for (const k of ['alphaChanged', 'artworkChanged', 'paperChanged', 'invalidStockDelta'])
    assert.equal(r[k], 0, r.name + ': ' + k);
  if (r.stockChanged === false) assert.equal(r.beforeHash, r.afterHash);
}
assert.equal(stock.compatibility.summary.probes, 645);
assert.equal(stock.compatibility.summary.materialsUnchanged, 645);
assert.equal(stock.compatibility.summary.manaUnchanged, 645);
assert.equal(stock.metrics.status, 'gates-pass');
assert.equal(stock.metrics.rows.length, 26);
for (const s of Object.values(stock.metrics.summary)) {
  assert.equal(s.passed, true);
  assert.ok(s.names >= 3 && s.before - s.after > 0.5 && s.after < s.before * 0.9);
  assert.ok(s.worstRegression <= 1 && s.maxTargetShift <= 1);
}
const ledger = await read('calibration-progress.json'),
  m21 = ledger.sets.find((s) => s.set === 'm21');
const white = await read('m21-white-default.json');
assert.equal(white.rows.length, 42);
assert.equal(white.choice, 'source-default');
assert.equal(white.normalization.knownPosePassed, 10);
for (const r of white.rows) {
  assert.ok(r.regionalColorError < 5);
  assert.equal(r.textureBinErrors.length, 10);
  assert.ok(r.textureBinErrors.every((v) => v < 5));
  assert.ok(boundaries.rows.some((b) => b.id === r.id && b.accepted));
}
for (const [file, expected] of Object.entries({
  ...Object.fromEntries(
    Object.entries(white.sourceGuards).map(([f, h]) => ['games/magic/src/presentation/' + f, h]),
  ),
  ...white.methodGuards,
}))
  assert.equal(hash(await readFile(file)), expected, 'Stale default evidence: ' + file);
let whiteCount = 0;
for (const g of m21.groups) {
  if (g.tasks.frameColor.status === 'validated-default') {
    assert.equal(g.palette, 'W');
    assert.equal(g.legendary, false);
    assert.equal(g.tasks.frameColor.proof.choice, 'source-default');
    assert.equal(white.rows.filter((r) => g.printingIds.includes(r.id)).length, g.printings);
    whiteCount += g.printings;
    const stale = structuredClone(g);
    applyM21WhiteDefault(stale, white.source, white, false);
    assert.equal(stale.tasks.frameColor.status, 'stale');
    applyM21WhiteDefault(stale, { source: 'different-asset' }, white, true);
    assert.equal(stale.tasks.frameColor.status, 'stale');
  }
  const r = boundaries.rows.filter((r) => g.printingIds.includes(r.id));
  if (r.length) {
    const accepted = r.filter((r) => r.accepted).length;
    assert.equal(g.tasks.normalization.coveredPrintings, accepted);
    assert.equal(g.tasks.normalization.status, accepted === g.printings ? 'validated' : 'partial');
    const stale = structuredClone(g);
    applyM21BoundaryRefinement(stale, boundaries, false);
    assert.equal(stale.tasks.normalization.status, 'stale');
  }
  if (stock.native.rows.some((r) => r.stockChanged && g.printingIds.includes(r.id))) {
    assert.equal(g.tasks.blackLevels.status, 'partial', 'Outer stock cannot certify interior ink');
    const stale = structuredClone(g);
    applyM21StockTransfer(stale, stock, false);
    assert.equal(stale.tasks.blackLevels.status, 'stale');
  }
}
assert.equal(whiteCount, 42);
console.log(
  'M21 scope: 239 scan poses, 80 known transforms, 305 native cards, 645 selector controls; failed scans and interior-ink obligations retained.',
);
