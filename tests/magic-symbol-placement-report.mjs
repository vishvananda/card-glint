// Exercise the report resolver, including the newest published ONS guards.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { root } from '../games/magic/tools/accuracy/common.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
import { modernSymbolPlacementDelta } from '../games/magic/tools/accuracy/modern-symbol-placement-ancestry.mjs';
const ledger = JSON.parse(
  await fs.readFile(path.join(root, 'games/magic/fixtures/accuracy/calibration-progress.json')),
);
const ons = ledger.sets.find((s) => s.set === 'ons');
const report = await calibrationReport({ ...ledger, sets: [ons] });
assert.deepEqual(report[0].byTask.release, { validated: 29, 'needs-reference': 1 });
const unknown = structuredClone(ons);
const source = (await modernSymbolPlacementDelta()).beforeRenderer;
const target = unknown.groups.find(
  (g) => g.tasks.release?.runtimeGuards?.['games/magic/src'] === source,
);
assert(target, 'Fixture must exercise the latest Original published guard');
target.tasks.release.runtimeGuards['games/magic/src'] = 'f'.repeat(64);
const rejected = await calibrationReport({ ...ledger, sets: [unknown] });
assert.deepEqual(rejected[0].byTask.release, { validated: 28, stale: 1, 'needs-reference': 1 });
console.log(
  'Modern-only placement retains all 29 ONS Original release guards; an unknown runtime remains stale.',
);
