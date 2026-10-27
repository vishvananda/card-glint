import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from 'vite';
import { hash, sourceHash, root } from '../games/magic/tools/accuracy/common.mjs';
import {
  fourthBasicWordDelta,
  preFourthBasicWordSource,
  fourthBasicWordHistoricalHash,
} from '../games/magic/tools/accuracy/fourth-basic-word-ancestry.mjs';
import {
  validateFourthBasicWordData,
  fourthBasicWordPaths,
} from '../games/magic/tools/accuracy/fourth-basic-word-data-check.mjs';
const p = await fourthBasicWordDelta();
assert.equal(await sourceHash(root + '/games/magic/src'), p.afterRenderer);
assert.equal(await fourthBasicWordHistoricalHash(), p.beforeRenderer);
for (const [file, r] of Object.entries(p.files)) {
  const bytes = await fs.readFile(root + '/' + file);
  assert.equal(hash(bytes), r.after);
  assert.equal(hash(await preFourthBasicWordSource(file, bytes)), r.before);
  const unknown = Buffer.concat([bytes, Buffer.from('\n// unreviewed change\n')]);
  assert.deepEqual(await preFourthBasicWordSource(file, unknown), unknown);
  assert.deepEqual(await preFourthBasicWordSource(file + '.foreign', bytes), bytes);
}
for (const [name, a] of Object.entries(p.artifacts)) {
  const z = await fs.readFile(root + '/' + a.file);
  assert.equal(hash(z), a.sha256, name);
  assert.equal(hash(gunzipSync(z)), a.contentSha256, name);
}
const decode = async (ref) => JSON.parse(gunzipSync(await fs.readFile(root + '/' + ref.file)));
const n = await decode(p.native),
  scores = await decode(p.scores);
assert.equal(scores.summary.fresh, 0);
assert.equal(scores.summary.reused, 378);
assert.equal(scores.summary.prototypeFresh, 15);
assert.equal(scores.summary.gains, 14);
assert.equal(scores.summary.losses, 1);
assert(scores.summary.current100 > scores.summary.before100);
assert.equal(scores.rows.filter((r) => r.delta100 < 0).length, 1);
const input = JSON.parse(
  gunzipSync(
    await fs.readFile(root + '/games/magic/fixtures/accuracy/4ed/flavor-fractional-inputs.json.gz'),
  ),
);
const ssr = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
  appType: 'custom',
});
try {
  const api = await ssr.ssrLoadModule('/games/magic/src/index.ts');
  const { usesFourthDefaults } = await ssr.ssrLoadModule(
    '/games/magic/src/calibration/selection.ts',
  );
  assert.equal(api.describeSetCalibration('4ed').revision, 6);
  assert.throws(() => api.createSetCalibrationCandidate('4ed', 5, {}), /revision changed/);
  assert.deepEqual(api.createSetCalibrationCandidate('4ed', 6, {}).values, {});
  const expectedKeys = new Set(
    input.entries
      .filter((e) => e.card.set === '4ed' || usesFourthDefaults(e.face))
      .map((e) => e.id),
  );
  assert.equal(expectedKeys.size, 408);
  for (const row of n.rows)
    for (const v of Object.values(row.modes))
      assert.equal(v.beforeKey !== v.afterKey, expectedKeys.has(row.id));
} finally {
  await ssr.close();
}
const bad = structuredClone(p),
  record = bad.files[fourthBasicWordPaths.profile];
record.afterSource = record.afterSource.replace('title: { size: 27.25', 'title: { size: 27.5');
record.after = hash(record.afterSource);
assert.throws(() => validateFourthBasicWordData(bad), /Unrelated profile/);
const foreign = structuredClone(p);
const idx = foreign.afterInventory.findIndex(([file]) => file === 'presentation/retro-paint.ts');
foreign.afterInventory[idx][1] = '0'.repeat(64);
foreign.afterRenderer = hash(JSON.stringify(foreign.afterInventory));
assert.throws(() => validateFourthBasicWordData(foreign), /Unlisted source/);
const duplicate = structuredClone(p);
duplicate.ids[0] = duplicate.ids[1];
assert.throws(() => validateFourthBasicWordData(duplicate));
console.log(
  'Fourth word position:1968 native variants,20 exact prototypes,1948 unchanged PNGs,408 scoped profile revisions,378 actual native score joins; unrelated source/data and stale editor controls reject. Set audit remains open.',
);
