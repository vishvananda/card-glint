// Reuse frozen scan poses after exact printing-credit review; never refit scans.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hash, root, writeJson, objectFile } from './common.mjs';
import { PNG } from 'pngjs';
import { normalize } from './pixels-pure.mjs';
function explicitDefaults(value) {
  if (Array.isArray(value)) return value.map(explicitDefaults);
  if (value && typeof value === 'object')
    return Object.fromEntries(
      Object.entries(value)
        .filter(([k, v]) => k !== 'italic' || v !== false)
        .map(([k, v]) => [k, explicitDefaults(v)]),
    );
  return value;
}
export function artistInputLineage(parent, next, poses, exported, review) {
  assert.equal(parent.set, next.set);
  assert.equal(review.set, next.set);
  assert.equal(parent.entries.length, next.entries.length);
  assert.equal(poses.rows.length, parent.entries.length);
  assert.equal(exported.rows.length, parent.entries.length);
  assert.equal(new Set(next.entries.map((e) => e.id)).size, next.entries.length);
  const changed = [];
  for (const e of next.entries) {
    const old = parent.entries.find((r) => r.id === e.id),
      pose = poses.rows.find((r) => r.id === e.id),
      row = exported.rows.find((r) => r.id === e.id),
      credit = review.cards[e.id];
    assert(old && pose && row && credit);
    assert.equal(e.name, old.name);
    assert.equal(e.material, old.material);
    assert.equal(e.reference.sha256, old.reference.sha256);
    assert.equal(e.art.sha256, old.art.sha256);
    assert.equal(pose.referenceHash, e.reference.sha256);
    if (row.accepted || row.referenceHash !== undefined)
      assert.equal(row.referenceHash, e.reference.sha256);
    if (row.accepted) {
      assert(pose.accepted, 'An accepted reference was rejected later');
      assert.deepEqual(row.pose, pose.transform, 'An accepted reference transform changed');
    }
    assert.equal(credit.referenceHash, e.reference.sha256);
    assert.equal(credit.name, e.name);
    assert.equal(credit.collectorNumber, e.card.collector_number);
    assert(credit.reviewedFields.includes('artist'));
    assert.equal(e.face.artist, credit.artist);
    const before = structuredClone(old.face),
      after = structuredClone(e.face);
    delete before.artist;
    delete after.artist;
    assert.deepEqual(
      explicitDefaults(before),
      explicitDefaults(after),
      'Non-credit face change: ' + e.name,
    );
    const fields = [...new Set([...Object.keys(old.face), ...Object.keys(e.face)])].filter(
      (k) => JSON.stringify(old.face[k]) !== JSON.stringify(e.face[k]),
    );
    if (fields.length) changed.push({ id: e.id, name: e.name, fields });
  }
  return changed;
}
async function main(parentFile, nextFile, poseFile, exportedDirectory, out) {
  assert(out, 'Use PARENT_INPUTS NEW_INPUTS PARENT_POSES EXPORTED_DIRECTORY NEW_DIRECTORY');
  const raw = await Promise.all(
    [parentFile, nextFile, poseFile, path.join(exportedDirectory, 'inputs.json')].map((f) =>
      fs.readFile(f),
    ),
  );
  const [parent, next, poses, exported] = raw.map((b) => JSON.parse(b));
  assert(['mir', 'ons'].includes(next.set));
  assert.equal(poses.inputHash, hash(raw[0]));
  assert.equal(exported.inputHash, hash(raw[0]));
  assert(
    exported.posesHash === hash(raw[2]) || exported.posesHash === poses.parentPoseHash,
    'Exported normalization does not belong to this pose lineage',
  );
  const reviewFile = path.join(
      root,
      'games/magic/fixtures/accuracy',
      next.set,
      'artist-printing-review.json',
    ),
    rb = await fs.readFile(reviewFile),
    review = JSON.parse(rb);
  assert.equal(
    next.sourceData.annotations.find((a) => a.file === 'artist-printing-review.json')?.sha256,
    hash(rb),
  );
  const changed = artistInputLineage(parent, next, poses, exported, review);
  const lineage = {
    kind: 'exact-reviewed-artist-inputs',
    parentInputHash: hash(raw[0]),
    inputHash: hash(raw[1]),
    parentPoseHash: hash(raw[2]),
    parentExportedHash: hash(raw[3]),
    artistReviewHash: hash(rb),
    scope:
      'Only literal artist credits and semantically equivalent explicit italic:false metadata differ. Scan references, frame classifications, artwork and every pose row remain exact. Scores and rendered faces are not reused by this operation.',
    changed,
  };
  const newPoses = { ...poses, inputHash: hash(raw[1]), sourceLineage: lineage };
  await fs.mkdir(out);
  await fs.mkdir(path.join(out, 'exported'));
  const poseBytes = JSON.stringify(newPoses, null, 2) + '\n';
  await fs.writeFile(path.join(out, 'inputs.json'), raw[1]);
  await fs.writeFile(path.join(out, 'poses.json'), poseBytes);
  const normalized = { reused: 0, fresh: [] },
    exportRows = [];
  for (const row of exported.rows) {
    const pose = poses.rows.find((p) => p.id === row.id);
    assert.match(row.id, /^[a-f0-9-]{36}$/);
    if (row.accepted) {
      const f = path.resolve(exportedDirectory, row.id + '.png'),
        bytes = await fs.readFile(f);
      assert.equal(hash(bytes), row.normalizedHash);
      await fs.symlink(f, path.join(out, 'exported', row.id + '.png'));
      normalized.reused++;
      exportRows.push(row);
    } else if (pose.accepted) {
      const entry = next.entries.find((e) => e.id === row.id),
        bytes = await fs.readFile(objectFile(entry.reference));
      assert.equal(hash(bytes), entry.reference.sha256);
      const pixels = normalize(PNG.sync.read(bytes), pose.transform);
      const png = PNG.sync.write({
        width: pixels.width,
        height: pixels.height,
        data: Buffer.from(pixels.data),
      });
      await fs.writeFile(path.join(out, 'exported', row.id + '.png'), png);
      normalized.fresh.push({
        id: row.id,
        poseHash: hash(JSON.stringify(pose.transform)),
        normalizedHash: hash(png),
      });
      exportRows.push({
        ...row,
        referenceHash: entry.reference.sha256,
        accepted: true,
        reason: null,
        pose: pose.transform,
        normalizedHash: hash(png),
        normalizationSource: 'frozen-recovered-scan-pose',
      });
    } else exportRows.push(row);
  }
  await writeJson(path.join(out, 'exported/inputs.json'), {
    ...exported,
    inputHash: hash(raw[1]),
    posesHash: hash(poseBytes),
    sourceLineage: lineage,
    normalizationCache: normalized,
    rows: exportRows,
  });
  await writeJson(path.join(out, 'lineage.json'), {
    ...lineage,
    reusedPoseRows: poses.rows.length,
    normalizationCache: normalized,
    accepted: poses.rows.filter((r) => r.accepted).length,
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  });
  console.log(
    next.set,
    'preserved',
    poses.rows.length,
    'pose rows;',
    changed.length,
    'reviewed face changes',
  );
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
  await main(...process.argv.slice(2));
