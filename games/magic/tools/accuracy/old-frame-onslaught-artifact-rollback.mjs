// Certify the rejected artifact low-tone curve was removed without collateral pixels.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { hash, writeJson } from './common.mjs';
const [study, output] = process.argv.slice(2);
assert(output, 'Use STUDY_DIRECTORY NEW_REPORT');
await fs.access(output).then(
  () => {
    throw Error('Output exists');
  },
  (e) => {
    if (e.code !== 'ENOENT') throw e;
  },
);
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const read = async (file) => {
  const raw = await fs.readFile(path.join(study, file));
  return { raw, data: JSON.parse(raw), hash: hash(raw) };
};
const versions = [11, 13, 14];
const profiles = await Promise.all(
  versions.map((v) => read('ons-selected-components-v' + v + '.json')),
);
const captures = await Promise.all(
  versions.map((v) => read('ons-native-components-v' + v + '/capture.json')),
);
const [base, proposed, retained] = profiles.map((p) => p.data);
for (const p of [base, proposed, retained]) assert.equal(p.set, 'ons');
const expected = structuredClone(proposed);
expected.colors.A = structuredClone(base.colors.A);
assert.deepEqual(expected, retained, 'Only the artifact material may return to its original curve');
for (const c of captures) {
  assert(c.data.complete && !c.data.faults.length);
  assert.equal(c.data.rows.length, 350);
  assert.deepEqual(
    c.data.rows.map((r) => r.id).sort(),
    captures[0].data.rows.map((r) => r.id).sort(),
  );
  for (const field of ['inputHash', 'posesHash', 'exportedHash'])
    assert.equal(c.data.source[field], captures[0].data.source[field]);
}
assert.equal(captures[1].data.source.rendererHash, captures[2].data.source.rendererHash);
for (let i = 0; i < 3; i++) assert.equal(captures[i].data.source.profileHash, profiles[i].hash);
const rows = [];
for (const r of captures[2].data.rows) {
  const isArtifact = r.key === 'A';
  const index = isArtifact ? 0 : 1;
  const previous = captures[index].data.rows.find((a) => a.id === r.id);
  for (const k of ['inputHash', 'referenceHash', 'normalizedReferenceHash', 'accepted'])
    assert.deepEqual(r[k], previous[k]);
  for (const [v, entry] of [
    [14, r],
    [versions[index], previous],
  ]) {
    assert.equal(path.basename(entry.file), entry.file);
    assert.equal(
      hash(await fs.readFile(path.join(study, 'ons-native-components-v' + v, entry.file))),
      entry.sha256,
    );
  }
  assert.equal(r.sha256, previous.sha256, r.name + ': unexpected rollback pixels');
  rows.push({
    id: r.id,
    name: r.name,
    key: r.key,
    sha256: r.sha256,
    source: isArtifact ? 'original-artifact-v11' : 'accepted-other-materials-v13',
  });
}
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
await writeJson(output, {
  schema: 1,
  status: 'ons-artifact-low-tone-rollback-native-identity',
  scope:
    'All 350 actual native faces. Artifact material returns to the original candidate; every other material remains byte-identical to the full-inventory proposal. This proves pixel/wording isolation and does not confer set-completion approval.',
  source: {
    toolHash,
    profiles: versions.map((v, i) => ({ version: v, sha256: profiles[i].hash })),
    captures: versions.map((v, i) => ({ version: v, sha256: captures[i].hash })),
    renderer: captures[2].data.source.rendererHash,
  },
  restoredArtifacts: rows.filter((r) => r.key === 'A').length,
  unchangedOtherFaces: rows.filter((r) => r.key !== 'A').length,
  rows,
});
console.log(
  'Onslaught rollback: all350 native faces are exact original-artifact/accepted-other-material matches.',
);
