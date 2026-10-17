import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
import {
  applyM21BoundaryRefinement,
  applyM21StockTransfer,
  applyM21WhiteDefault,
  applyM21OriginalWording,
} from '../games/magic/tools/accuracy/calibration-m21-scope.mjs';
const read = async (f) => JSON.parse(await readFile('games/magic/fixtures/accuracy/' + f));
const boundaries = await read('m21-component-boundaries-v2.json'),
  stock = await read('modern-land-stock-transfer.json');
const ledger = await read('calibration-progress.json'),
  m21 = ledger.sets.find((s) => s.set === 'm21');
const white = await read('m21-white-default.json');
const wording = await read('m21-original-wording.json');
const textScope = structuredClone(m21.groups.find((g) => g.tasks.rules.originalInput));
const priorTextStatus = textScope.tasks.rules.status;
applyM21OriginalWording(textScope, wording, false);
assert.equal(textScope.tasks.rules.originalInput.status, 'stale');
assert.equal(
  textScope.tasks.rules.status,
  priorTextStatus,
  'Wording cannot approve text alignment',
);
const changedWording = structuredClone(m21);
const changedScope = changedWording.groups.find((g) => g.tasks.rules.originalInput);
changedScope.tasks.rules.originalInput.guards = { 'missing-wording-source': '0'.repeat(64) };
changedWording.groups = [changedScope];
const [changedReport] = await calibrationReport({ sets: [changedWording] });
assert.equal(
  changedReport.originalRulesInputs.stale,
  changedScope.tasks.rules.originalInput.coveredPrintings,
);
assert.equal(changedReport.originalRulesInputs.ready, 0);
for (const original of m21.groups) {
  const g = structuredClone(original);
  if (white.rows.some((r) => g.printingIds.includes(r.id))) {
    applyM21WhiteDefault(g, white.source, white, true);
    assert.equal(
      g.tasks.frameColor.status,
      white.rows.filter((r) => g.printingIds.includes(r.id)).length === g.printings
        ? 'validated-default'
        : 'partial',
    );
    if (g.tasks.frameColor.status === 'validated-default')
      assert.equal(g.tasks.frameColor.proof.choice, 'source-default');
    assert.equal(
      g.tasks.frameColor.coveredPrintings,
      white.rows.filter((r) => g.printingIds.includes(r.id)).length,
    );
    const stale = structuredClone(g);
    applyM21WhiteDefault(stale, white.source, white, false);
    assert.equal(stale.tasks.frameColor.status, 'stale');
    applyM21WhiteDefault(stale, { source: 'different-asset' }, white, true);
    assert.equal(stale.tasks.frameColor.status, 'stale');
  }
  const r = boundaries.rows.filter((r) => g.printingIds.includes(r.id));
  if (r.length) {
    const accepted = r.filter((r) => r.accepted).length;
    applyM21BoundaryRefinement(g, boundaries, true);
    assert.equal(g.tasks.normalization.coveredPrintings, accepted);
    assert.equal(g.tasks.normalization.status, accepted === g.printings ? 'validated' : 'partial');
    const stale = structuredClone(g);
    applyM21BoundaryRefinement(stale, boundaries, false);
    assert.equal(stale.tasks.normalization.status, 'stale');
  }
  if (stock.native.rows.some((r) => r.stockChanged && g.printingIds.includes(r.id))) {
    applyM21StockTransfer(g, stock, true);
    assert.equal(g.tasks.blackLevels.status, 'partial', 'Outer stock cannot certify interior ink');
    const stale = structuredClone(g);
    applyM21StockTransfer(stale, stock, false);
    assert.equal(stale.tasks.blackLevels.status, 'stale');
  }
}
console.log(
  'M21 scope: boundary coverage, white-default selection, stock/ink separation and stale wording handling passed.',
);
