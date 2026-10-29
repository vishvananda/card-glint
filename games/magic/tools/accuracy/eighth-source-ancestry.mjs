import { arnHistoricalSourceFiles } from './arn-profile-ancestry.mjs';
import { preAbuFractionalSource } from './abu-fractional-ancestry.mjs';
// Reconstruct only reviewed Eighth integration edits. This never approves a fit.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, readdir } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';
import {
  eighthProfileDataModules,
  eighthPayloadData,
  eighthAggregateData,
  runtimeCalibrationDataModules,
  runtimePayloadBase,
  runtimeProfileHashes,
} from './eighth-profile-data.mjs';
const RECEIPT = '3fd374dbe439f6701bff8b18494f128e65bc6407d58c51c3b7e651519d218f8c';
let checked;
let runtimeChecked;
const payloadPattern = /^games\/magic\/src\/data\/(?:sets|wording)\/[a-z0-9]+[.]ts$/;
const relativeFiles = async () =>
  arnHistoricalSourceFiles(
    (await readdir(path.join(root, 'games/magic/src'), { recursive: true, withFileTypes: true }))
      .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
      .map((e) => path.relative(root, path.join(e.parentPath, e.name)))
      .sort(),
  );
const dataBase = runtimePayloadBase;
export async function eighthSourceAncestry() {
  return (checked ??= (async () => {
    const bytes = await readFile(
      path.join(root, 'games/magic/fixtures/accuracy/8ed/source-compatibility.json'),
    );
    assert.equal(hash(bytes), RECEIPT, 'Changed Eighth source compatibility receipt');
    const p = JSON.parse(bytes);
    for (const parent of p.parents)
      assert.equal(hash(await readFile(path.join(root, parent.file))), parent.sha256);
    const dataModules = await eighthProfileDataModules(),
      dataSet = new Set(dataModules);
    for (const [file, entry] of Object.entries(p.files))
      assert.equal(
        hash(await preAbuFractionalSource(file, await readFile(path.join(root, file)))),
        entry.after,
        'Unreviewed Eighth integration: ' + file,
      );
    for (const [file, digest] of Object.entries(p.newModules))
      assert.equal(
        hash(await preAbuFractionalSource(file, await readFile(path.join(root, file)))),
        digest,
        'Unreviewed Eighth module: ' + file,
      );
    const nativeBytes = await readFile(path.join(root, p.native.file));
    assert.equal(hash(nativeBytes), p.native.sha256);
    const raw = gunzipSync(nativeBytes);
    assert.equal(hash(raw), p.native.contentSha256);
    const native = JSON.parse(raw);
    assert.deepEqual(native.faults, []);
    assert.equal(native.source.beforeRenderer, p.runtimeBeforeRenderer);
    assert.equal(native.source.afterRenderer, p.rendererHash);
    assert.equal(native.source.base, p.runtimeBase);
    assert.equal(native.cases.length, p.native.cases);
    assert.equal(native.rows.length, p.native.pairs);
    assert.equal(hash(await readFile(path.join(root, p.native.tool))), native.source.tool);
    assert.equal(new Set(native.cases.map((c) => c.id)).size, native.cases.length);
    assert.equal(hash(JSON.stringify(native.cases)), native.source.cases);
    for (const row of native.rows) {
      assert.deepEqual(row.before, row.after, 'Unchanged painter drift in Eighth collateral proof');
      for (const value of Object.values(row.before)) assert.match(value, /^[a-f0-9]{64}$/);
    }
    return { ...p, dataModules };
  })());
}
export async function preEighthSource(file, bytes) {
  bytes = await preAbuFractionalSource(file, bytes);
  const p = await eighthSourceAncestry(),
    entry = p.files[file];
  if (p.newModules[file]) {
    assert.equal(hash(bytes), p.newModules[file], 'Unreviewed Eighth module: ' + file);
    return bytes;
  }
  if (!entry) return bytes;
  const digest = hash(bytes);
  if (digest === entry.before || entry.historicalHashes.includes(digest)) return bytes;
  assert.equal(digest, entry.after, 'Unreviewed Eighth source: ' + file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const e of entry.reverseEdits) lines.splice(e.start, e.count, ...e.lines);
  const prior = Buffer.from(lines.join(''));
  assert.equal(hash(prior), entry.before, 'Eighth reconstruction failed: ' + file);
  return prior;
}
/** Group scope is physical frame/layout, not the release year of a mixed set. */
export async function eighthDefaultSetAffected(set, group) {
  const p = await eighthSourceAncestry(),
    code = set?.toLowerCase() ?? '';
  if (code === 'plc') return false;
  if (group) {
    if (group.frame !== '2003' || group.kind === 'planeswalker') return false;
    if (group.layout && group.layout !== 'normal') return false;
    if (group.frameTreatment === 'colorshifted') return false;
    return true;
  }
  return p.eraSets.includes(code);
}
export async function eighthProfileSource(file, bytes, set, group) {
  const p = await eighthSourceAncestry();
  const affected = await eighthDefaultSetAffected(set, group);
  if (affected && (p.files[file] || p.newModules[file] || p.dataModules.includes(file)))
    return { bytes, changedProfile: true };
  return { bytes: await preEighthSource(file, bytes), changedProfile: false };
}
/** Only the exact reviewed runtime can be reused, and only outside Eighth scope.
 * Inert per-set data keeps its own current fingerprints for affected consumers. */
export async function eighthRuntimeCompatible(directory, expected, set, group) {
  if (directory !== 'games/magic/src' || (await eighthDefaultSetAffected(set, group))) return false;
  const p = await eighthSourceAncestry();
  if (expected !== p.runtimeBeforeRenderer) return false;
  const runtime = await (runtimeChecked ??= (async () => {
    try {
      const dataModules = await runtimeCalibrationDataModules(),
        dataSet = new Set(dataModules);
      const files = await relativeFiles();
      const manifestPath = 'games/magic/src/data/generated-manifest.json';
      const universe = files.filter(
        (f) =>
          !dataSet.has(f) &&
          !payloadPattern.test(f) &&
          f !== manifestPath &&
          f !== 'games/magic/src/data/eager.ts',
      );
      assert.deepEqual(
        universe,
        Object.keys(p.sourceInventory).sort(),
        'Unreviewed Eighth source inventory',
      );
      for (const file of universe)
        assert.equal(
          hash(await preAbuFractionalSource(file, await readFile(path.join(root, file)))),
          p.sourceInventory[file],
          'Unreviewed Eighth executable/source: ' + file,
        );
      for (const file of files.filter((f) => payloadPattern.test(f))) {
        const data = eighthPayloadData(
          (await preAbuFractionalSource(file, await readFile(path.join(root, file)))).toString(),
          file,
        );
        assert.equal(
          hash(JSON.stringify(dataBase(data))),
          p.payloadBaseHashes[file],
          'Changed non-Eighth payload data: ' + file,
        );
      }
      const aggregate = eighthAggregateData(
        (
          await preAbuFractionalSource(
            'games/magic/src/data/eager.ts',
            await readFile(path.join(root, 'games/magic/src/data/eager.ts')),
          )
        ).toString(),
      );
      assert.equal(
        hash(JSON.stringify(aggregate.map(dataBase))),
        p.aggregateBaseHash,
        'Changed non-Eighth eager payload',
      );
      const manifestBytes = await readFile(path.join(root, manifestPath));
      const generated = JSON.parse(manifestBytes);
      const historicalGenerated = JSON.parse(
        await preAbuFractionalSource(manifestPath, manifestBytes),
      );
      assert.equal(generated.schema, 1);
      assert.equal(historicalGenerated.schema, 1);
      assert.deepEqual(
        Object.keys(historicalGenerated.files).sort(),
        Object.keys(p.generatedFiles).sort(),
        'Unreviewed generated payload inventory',
      );
      for (const [file, digest] of Object.entries({ ...generated.sources, ...generated.files })) {
        assert.equal(
          hash(await readFile(path.join(root, file))),
          digest,
          'Stale generated Eighth data: ' + file,
        );
      }

      for (const [file, digest] of Object.entries(p.runtimeMetadata))
        assert.equal(
          hash(await preAbuFractionalSource(file, await readFile(path.join(root, file)))),
          digest,
        );
      const profiles = runtimeProfileHashes(aggregate);
      return {
        compatible: true,
        changedSets: [
          ...new Set([...Object.keys(profiles), ...Object.keys(p.profileDataHashes)]),
        ].filter((code) => profiles[code] !== p.profileDataHashes[code]),
      };
    } catch (error) {
      if (error.code === 'ENOENT' || error.code === 'ERR_ASSERTION')
        return { compatible: false, changedSets: [] };
      throw error;
    }
  })());
  return runtime.compatible && !runtime.changedSets.includes(set?.toLowerCase() ?? '');
}
