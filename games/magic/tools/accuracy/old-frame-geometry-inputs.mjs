// Export frozen, accepted scan references for source-family geometry measurement.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { hash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
const [inputFile, posesFile, screenFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS POSES FAMILY_SCREEN NEW_DIRECTORY');
await fs.mkdir(out);
const [ib, pb, sb] = await Promise.all(
  [inputFile, posesFile, screenFile].map((f) => fs.readFile(f)),
);
const input = JSON.parse(ib),
  poses = JSON.parse(pb),
  screen = JSON.parse(sb);
assert.equal(poses.inputHash, hash(ib));
assert.equal(screen.inputHash, hash(ib));
assert.equal(screen.poseHash, hash(pb));
const basics = { Plains: 'W', Island: 'U', Swamp: 'B', Mountain: 'R', Forest: 'G' };
const frameKey = (e) =>
  e.material === 'L' ? (basics[e.name] ? basics[e.name] + 'L' : 'L') : e.material;
const cohorts = new Map();
for (const key of new Set(input.entries.map(frameKey))) {
  const names = [
    ...new Set(input.entries.filter((e) => frameKey(e) === key).map((e) => e.name)),
  ].sort((a, b) => hash(a.toLowerCase()).localeCompare(hash(b.toLowerCase())));
  names.forEach((name, i) =>
    cohorts.set(
      name,
      names.length < 6
        ? 'development'
        : i < Math.floor(names.length / 2)
          ? 'calibration'
          : 'validation',
    ),
  );
}
const rows = [];
for (const e of input.entries) {
  const p = poses.rows.find((p) => p.id === e.id);
  assert.equal(p.referenceHash, e.reference.sha256);
  const cohort = cohorts.get(e.name);
  const key = frameKey(e);
  if (!p.accepted) {
    rows.push({ id: e.id, name: e.name, key, cohort, accepted: false, reason: p.reason });
    continue;
  }
  const raw = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(raw), e.reference.sha256);
  const im = normalize(PNG.sync.read(raw), p.transform),
    png = PNG.sync.write({ width: 488, height: 680, data: Buffer.from(im.data) });
  await fs.writeFile(path.join(out, e.id + '.png'), png);
  rows.push({
    id: e.id,
    name: e.name,
    key,
    cohort,
    accepted: true,
    referenceHash: e.reference.sha256,
    pose: p.transform,
    normalizedHash: hash(png),
  });
}
await writeJson(path.join(out, 'inputs.json'), {
  schema: 1,
  set: input.set,
  inputHash: hash(ib),
  posesHash: hash(pb),
  screenHash: hash(sb),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  node: process.version,
  lockHash: hash(await fs.readFile(new URL('../../../../package-lock.json', import.meta.url))),
  cohortPolicy:
    'Stratified name-hash rank per frame key; half calibration/validation; alternate printings stay together. Fewer than six names are development-only.',
  scope:
    'Fixed scan-only poses; name-hash cohorts frozen before geometry fitting. Whole scans exported for visual verification; fitting samples explicit frame-only strips.',
  assets: screen.assets,
  rows,
});
console.log(input.set, 'normalized', rows.filter((r) => r.accepted).length, '/', rows.length);
