import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import { manaInterior, checkManaReuse } from '../games/magic/tools/accuracy/modern-mana-reuse.mjs';
import {
  m21ManaEvidence,
  applyM21Mana,
} from '../games/magic/tools/accuracy/calibration-m21-mana.mjs';
import {
  calibrationTaskStatus,
  calibrationSetStatus,
} from '../games/magic/tools/accuracy/calibration-ledger.mjs';
import { calibrationReport } from '../games/magic/tools/accuracy/calibration-report.mjs';
// The native RGBA fingerprint must preserve glyph/color differences while excluding
// changed title material outside the explicitly disclosed opaque interior.
const image = { width: 488, height: 680, data: new Uint8Array(488 * 680 * 4).fill(255) };
const token = { x: 440, y: 40, radiusX: 10, radiusY: 10 };
const baseline = manaInterior(image, token);
const put = (x, y, value) => {
  image.data[(y * 488 + x) * 4] = value;
};
put(440, 40, 0);
assert.notDeepEqual(manaInterior(image, token), baseline);
assert.notDeepEqual(manaInterior(image, { ...token, x: 443 }), manaInterior(image, token));
put(440, 40, 255);
put(100, 100, 0);
assert.deepEqual(manaInterior(image, token), baseline);
assert.throws(() => manaInterior(image, { ...token, radiusX: 1 }));
assert.throws(() => manaInterior({ ...image, width: 732 }, token));

const data = await m21ManaEvidence();
// A released receipt is immutable. Later, unrelated set work must make an
// unmatched runtime stale rather than requiring the fixture to remain current.
const guardsMatch = (
  await Promise.all(
    Object.entries(data.guards).map(async ([file, digest]) => {
      try {
        return hash(await readFile(file)) === digest;
      } catch {
        return false;
      }
    }),
  )
).every(Boolean);
assert.equal(
  data.current,
  guardsMatch && (await sourceHash('games/magic/src')) === data.receipt.definition.rendererHash,
);
// Exercise the recorded valid proof's structure separately from live freshness.
const historicalData = { ...data, current: true };
for (const file of [
  'games/magic/assets.json',
  'games/magic/fonts.css',
  'packages/browser/src/canvas-images.ts',
  'packages/browser/src/canvas-raster.ts',
])
  assert.match(data.guards[file], /^[a-f0-9]{64}$/);

const { receipt, census } = data;
checkManaReuse(receipt, census);
assert.equal(receipt.summary.pixels, 361504);
for (const mutate of [
  (r) => r.rows.pop(),
  (r) => r.rows.push(r.rows[0]),
  (r) => (r.rows[0].tokens[0].afterHash = '0'.repeat(64)),
  (r) => (r.rows[0].tokens[0].pixels = 0),
  (r) => r.rows[0].tokens.pop(),
  (r) => (r.rows[0].referenceHash = '0'.repeat(64)),
  (r) => (r.rows[0].nativeFaceHash = '0'.repeat(64)),
  (r) => (r.rows[0].poseHash = '0'.repeat(64)),
  (r) => (r.rows[0].score100 = null),
  (r) => (r.parameters.normal.dx += 0.25),
  (r) => (r.policy.foilPigmentFit = true),
  (r) => (r.policy.independentHoldout = true),
  (r) => (r.policy.rendererChanges = true),
  (r) => (r.definition.manaSources[0].afterHash = '0'.repeat(64)),
  (r) => (r.definition.shadowPainters[0].afterHash = '0'.repeat(64)),
  (r) => (r.definition.nativeCaptureHash = '0'.repeat(64)),
  (r) => (r.rows.find((x) => x.family === 'walker' && x.nonfoil).nonfoil = false),
]) {
  const changed = structuredClone(receipt);
  mutate(changed);
  assert.throws(() => checkManaReuse(changed, census));
}
const ledger = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/calibration-progress.json'),
);
const set = ledger.sets.find((s) => s.set === 'm21');
let groups = 0,
  foilGroups = 0;
for (const group of set.groups) {
  const g = structuredClone(group),
    before = structuredClone(g.tasks);
  applyM21Mana(g, historicalData);
  if (!group.applicable.manaGeometry) {
    assert.deepEqual(g.tasks, before);
    continue;
  }
  groups++;
  assert.equal(calibrationTaskStatus(g, 'manaGeometry').status, 'validated');
  assert.equal(calibrationTaskStatus(g, 'manaColor').status, 'validated');
  assert.deepEqual(
    { ...g.tasks, manaGeometry: undefined, manaColor: undefined },
    { ...before, manaGeometry: undefined, manaColor: undefined },
  );
  const p = g.tasks.manaColor.proof;
  if (group.references.nonfoil !== group.printings) {
    foilGroups++;
    assert.equal(p.validationKind, 'family-transfer');
    assert.equal(p.familyTransfer.donors.length, 9);
    assert(p.familyTransfer.donors.every((d) => receipt.rows.find((r) => r.id === d.id).nonfoil));
    assert.equal(p.familyTransfer.foilPigmentExcluded, true);
  } else {
    assert.equal(p.validationKind, 'source-census');
    assert.equal(p.sourceCensus.heldOut, false);
    assert.equal(p.sourceCensus.members.length, group.printings);
  }
  const live = structuredClone(group);
  applyM21Mana(live, data);
  assert.equal(
    calibrationTaskStatus(live, 'manaGeometry').status,
    data.current ? 'validated' : 'stale',
  );
  const bad = structuredClone(group);
  bad.printingIds = bad.printingIds.slice(1);
  assert.throws(() => applyM21Mana(bad, data));
  applyM21Mana(g, { ...data, current: false });
  assert.equal(calibrationTaskStatus(g, 'manaColor').status, 'stale');
}
assert.equal(groups, 62);
assert.equal(foilGroups, 5);
const [report] = await calibrationReport({ sets: [set] });
assert.equal(report.byTask.manaGeometry.validated ?? 0, data.current ? 62 : 0);
assert.equal(report.byTask.manaGeometry.stale ?? 0, data.current ? 0 : 62);
assert.equal(report.byTask.manaColor.validated ?? 0, data.current ? 62 : 0);
assert.equal(
  calibrationSetStatus(set).complete,
  false,
  'Mana evidence cannot approve other components',
);
const changed = structuredClone(set);
for (const g of changed.groups)
  if (g.applicable.manaGeometry)
    g.tasks.manaGeometry.runtimeGuards['games/magic/src'] = '0'.repeat(64);
const [stale] = await calibrationReport({ sets: [changed] });
assert.equal(stale.byTask.manaGeometry.stale, 62);
assert.equal(stale.byTask.manaColor.validated ?? 0, data.current ? 62 : 0);
const fontChanged = structuredClone(set);
for (const g of fontChanged.groups)
  if (g.applicable.manaColor) g.tasks.manaColor.guards['games/magic/fonts.css'] = '0'.repeat(64);
const [fontStale] = await calibrationReport({ sets: [fontChanged] });
assert.equal(fontStale.byTask.manaColor.stale, 62);

console.log(
  'M21 released mana:567 exact native interiors/264 printings, shared fitted controls, pinned assets and unchanged shadow painter;62 geometry/color proof variants; live runtime freshness checked separately. Five foil families transfer from nine nonfoil donors. Unknown changes, altered pixels/scope and unsupported holdout claims reject.',
);
