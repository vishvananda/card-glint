import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import assert from 'node:assert/strict';
import {
  referenceRulesDivider,
  RulesRoleObjective,
  roleFitDecision,
} from '../games/magic/tools/accuracy/modern-rules-role-objective.mjs';

const w = 160,
  h = 120;
const raster = (bodyOffset = 0, flavorOffset = 0, dividers = [55]) => {
  const out = new Float32Array(w * h).fill(220);
  for (const y of dividers) for (let x = 0; x < w; x++) out[y * w + x] = 120;
  for (const [y0, offset, rows] of [
    [20, bodyOffset, 1],
    [75, flavorOffset, 2],
  ])
    for (let row = 0; row < rows; row++)
      for (let n = 0; n < 13; n++)
        for (let y = y0 + row * 17; y < y0 + row * 17 + 9; y++)
          for (let x = 8 + n * 11 + offset; x < 12 + n * 11 + offset; x++)
            if (x >= 0 && x < w) out[y * w + x] = 10;
  return out;
};
const mask = new Uint8Array(w * h).fill(1),
  reference = raster();
const divider = referenceRulesDivider(reference, w, h, mask);
assert.equal(divider.status, 'measured');
assert(Math.abs(divider.y - 55) <= 1);
const transformed = Float32Array.from(reference, (v) => v * 0.7 + 30);
assert.equal(referenceRulesDivider(transformed, w, h, mask).y, divider.y);
assert.equal(referenceRulesDivider(raster(0, 0, []), w, h, mask).status, 'missing-divider');
assert.equal(referenceRulesDivider(raster(0, 0, [50, 62]), w, h, mask).status, 'ambiguous-divider');
const object = new RulesRoleObjective(reference, w, h, mask, { rules: true, flavor: true });
const exact = object.score(reference),
  old = object.score(raster(0, 5)),
  bad = object.score(raster(5, 0));
assert(exact.roles.rules.score > 0.9999);
assert(exact.roles.flavor.score > 0.9999);
assert.equal(exact.roles.rules.referenceBands.length, 1);
assert.equal(exact.roles.flavor.referenceBands.length, 2);
const wrongWrap = {
  ...exact,
  roles: {
    ...exact.roles,
    flavor: { ...exact.roles.flavor, bands: exact.roles.flavor.bands.slice(0, 1) },
  },
};
assert.equal(
  roleFitDecision(old, wrongWrap).reason,
  'line-count-regression',
  'Even perfect overlap scores cannot approve a worse line count',
);

assert.equal(roleFitDecision(old, exact).accepted, true);
const lost = roleFitDecision(old, bad);
assert.equal(lost.accepted, false);
assert.equal(lost.reason, 'role-regression');
assert(
  lost.deltas.rules < 0 && lost.deltas.flavor > 0,
  'A flavor improvement must not conceal damaged rules text',
);
assert.equal(roleFitDecision(exact, exact).reason, 'insufficient-role-gain');
const unknown = new RulesRoleObjective(raster(0, 0, []), w, h, mask, { rules: true, flavor: true });
assert.equal(roleFitDecision(unknown.score(reference), unknown.score(reference)).accepted, false);
// Two lines may have overlapping vertical projections while their glyphs
// remain separate components. Row projection alone merges this real case.
const touchingRows = new Float32Array(w * h).fill(220);
for (const [top, xs] of [
  [20, [10, 25, 40]],
  [35, [75, 90, 105]],
])
  for (const x0 of xs)
    for (let y = top; y < top + 16; y++)
      for (let x = x0; x < x0 + 4; x++) touchingRows[y * w + x] = 10;
const touching = new RulesRoleObjective(touchingRows, w, h, mask, { rules: true, flavor: false });
assert.equal(touching.score(touchingRows).roles.rules.referenceBands.length, 2);
const oneRole = new RulesRoleObjective(reference, w, h, mask, { rules: true, flavor: false });
assert.equal(oneRole.divider, null);
assert.deepEqual(Object.keys(oneRole.score(reference).roles), ['rules']);
assert.throws(
  () => new RulesRoleObjective(reference, w, h, mask, { rules: false, flavor: false }),
  /requires text/,
);
assert.throws(() => referenceRulesDivider(reference, w + 1, h, mask), /dimensions/);
assert.throws(() => roleFitDecision(exact, exact, { minimumGain: NaN }), /limits/);
assert.throws(
  () => roleFitDecision(exact, { ...exact, roles: { flavor: exact.roles.flavor } }),
  /coverage/,
);
console.log(
  'Reference-only role masks: affine brightness, missing/ambiguous divider rejection, unchanged control, and adversarial rules/flavor trade-off pass.',
);

const directory = 'games/magic/fixtures/accuracy/m21/';
const review = JSON.parse(await readFile(directory + 'typography-followup-review.json'));
const compressed = await readFile(directory + review.evidence.file);
assert.equal(hash(compressed), review.evidence.sha256);
const raw = gunzipSync(compressed);
assert.equal(hash(raw), review.evidence.contentSha256);
const evidence = JSON.parse(raw);
assert.equal(review.status, 'diagnostic-shared-typography-rejections-and-role-audit');
const prior = JSON.parse(
  gunzipSync(await readFile(directory + 'printing-size-diagnostic-review.json.gz')),
);
const controls = new Map(prior.studies.coarse.rows.map((row) => [row.id, row]));
for (const study of Object.values(evidence.studies)) {
  assert.equal(study.rows.length, 297);
  assert.equal(new Set(study.rows.map((r) => r.id)).size, 297);
  assert.deepEqual(study.faults, []);
  assert.equal(study.rows.filter((row) => row.trials).length, 268);
  for (const row of study.rows) {
    const old = controls.get(row.id);
    for (const key of ['inputHash', 'referenceHash', 'nativeFaceHash', 'normalizedHash', 'status'])
      assert.equal(row[key], old[key]);
    if (row.trials) assert.deepEqual(row.trials[0], old.trials[0]);
  }
}
const byNative = new Map(prior.individual.rows.map((row) => [row.id, row]));
const roles = evidence.roles;
assert.equal(roles.rows.length, 297);
assert.equal(new Set(roles.rows.map((r) => r.id)).size, 297);
assert.equal(roles.rows.filter((r) => r.status === 'measured').length, 268);
assert.equal(roles.rows.filter((r) => r.status === 'separate-basic-or-special-frame').length, 29);
for (const row of roles.rows) {
  const old = byNative.get(row.id);
  for (const key of ['inputHash', 'referenceHash', 'beforeFaceHash', 'afterFaceHash'])
    assert.equal(row[key], old[key]);
  if (row.decision) assert.deepEqual(roleFitDecision(row.before, row.after), row.decision);
}
const changed = roles.rows.filter((r) => r.beforeFaceHash !== r.afterFaceHash);
assert.equal(changed.length, 105);
assert.equal(changed.filter((r) => r.decision.accepted).length, 83);
assert.equal(changed.filter((r) => r.decision.reason === 'line-count-regression').length, 15);
assert.equal(changed.filter((r) => r.decision.reason === 'role-regression').length, 7);
for (const name of ['Terror of the Peaks', 'Turn to Slag', 'Finishing Blow', 'Skeleton Archer'])
  assert.equal(roles.rows.find((r) => r.name === name).decision.accepted, false);
for (const [file, source] of Object.entries(evidence.methods))
  assert.equal(hash(source), new Map(roles.definition.methods).get(file));
assert(
  evidence.fontAssets.every((f) => /^[a-f0-9]{64}$/.test(f.sha256) && f.url.startsWith('https://')),
);
console.log(
  'Complete M21 controls:268 fields, alternative-font/orphan rejections and105 native proposals;22 role/estimated-line-band regressions remain explicit. No production adoption.',
);
