import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import { preFourthBasicWordSource } from './fourth-basic-word-ancestry.mjs';
// Exact native/source ancestry. A regional fit never marks a whole set complete.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';
import { validateFourthFlavorData } from './fourth-flavor-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/4ed/flavor-fractional-source-delta.json.gz';
const RECEIPT = '077b0e5839c754bf400e0a3a2333e4d988581da0201c0b3e2c60aa3c8bee1d6c';
const artifact = async (ref) => {
  const bytes = await fs.readFile(path.join(root, ref.file));
  assert.equal(hash(bytes), ref.sha256);
  const raw = ref.file.endsWith('.gz') ? gunzipSync(bytes) : bytes;
  assert.equal(hash(raw), ref.contentSha256);
  return JSON.parse(raw);
};
let checked;
export function fourthFlavorDelta() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), RECEIPT);
    const p = JSON.parse(gunzipSync(bytes));
    assert.deepEqual(validateFourthFlavorData(p), p.summary);
    const native = await artifact(p.native),
      prototype = await artifact(p.prototype),
      prior = await artifact(p.priorScores),
      parentIce = await artifact(p.parentIce);
    assert.equal(parentIce.renderer, p.beforeRenderer);
    assert.equal(native.beforeRenderer, p.beforeRenderer);
    assert.equal(native.afterRenderer, p.afterRenderer);
    assert.equal(native.nativeVariants, 1968);
    assert.equal(native.sources.before, parentIce.artifacts.capture.contentSha256);
    assert.equal(prototype.rendererHash, p.beforeRenderer);
    assert.equal(prototype.captureHash, native.sources.before);
    assert.equal(prototype.inputsHash, parentIce.artifacts.inputs.contentSha256);
    assert.equal(native.sources.prototype, p.prototype.contentSha256);
    assert.deepEqual(native.fourthIds, p.ids);
    assert.deepEqual(native.iceIds, p.iceIds);
    assert.equal(native.rows.length, 492);
    assert.equal(prior.rows.length, 378);
    assert.deepEqual(native.counts.original, { changed: 20, unchanged: 472, keysChanged: 23 });
    for (const mode of ['oracle', 'oracle-modern', 'etching'])
      assert.deepEqual(native.counts[mode], { changed: 0, unchanged: 492, keysChanged: 0 });
    assert.equal(native.verification.exactPngPairs, 1948);
    assert.equal(native.verification.nativeImagesDecoded, 43);
    for (const row of native.rows) {
      for (const [mode, m] of Object.entries(row.modes)) {
        assert.equal(m.alpha, 0);
        assert.equal(m.outside, 0);
        assert.equal(m.beforeKey !== m.afterKey, row.scoped && mode === 'original');
        if (mode !== 'original' || !row.scoped) assert.equal(m.before, m.after);
      }
      if (row.set !== '4ed') continue;
      const old = prior.rows.find((r) => r.id === row.id);
      assert(old);
      assert.equal(row.inputHash, old.inputHash);
      assert.equal(row.referenceHash, old.referenceHash);
      assert.equal(row.modes.original.before, old.nativeHash);
      const trial = prototype.rows.find((r) => r.id === row.id);
      if (trial) {
        assert.equal(trial.beforeHash, old.nativeHash);
        assert.equal(trial.inputHash, row.inputHash);
        assert.equal(trial.referenceHash, row.referenceHash);
        assert.equal(trial.poseHash, old.poseHash);
        assert.equal(trial.trials[1].pixelHash, row.modes.original.afterPixels);
      }
    }
    return p;
  })());
}
export async function preFourthFlavorSource(file, bytes) {
  bytes = await preFourthBasicWordSource(file, bytes);
  const r = (await fourthFlavorDelta()).files[file];
  return r && hash(bytes) === r.after ? Buffer.from(r.beforeSource) : bytes;
}
export async function fourthFlavorHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await oldFrameHistoricalSourceFiles(files)).map(async (f) => [
          path.relative(directory, f),
          hash(
            await preFourthFlavorSource(
              'games/magic/src/' + path.relative(directory, f),
              await fs.readFile(f),
            ),
          ),
        ]),
      ),
    ),
  );
}
export async function fourthFlavorAffected(set, task, original = false, group) {
  if (
    original ||
    !['4ed', 'ice'].includes(set?.toLowerCase()) ||
    !['rules', 'flavor', 'fullCard', 'release'].includes(task)
  )
    return false;
  const p = await fourthFlavorDelta(),
    ids = set.toLowerCase() === '4ed' ? p.ids : p.iceIds;
  return !Array.isArray(group?.printingIds) || ids.some((id) => group.printingIds.includes(id));
}
/** Only a current complete native census can carry regional evidence forward.
 * Ice's extra cases lack certified scan poses and cannot approve a component. */
export async function fourthFlavorApproval(item, group) {
  if (
    !Array.isArray(group?.printingIds) ||
    group.printingIds.length !== group.printings ||
    new Set(group.printingIds).size !== group.printings
  )
    return false;
  const p = await fourthFlavorDelta(),
    proof = item.proof;
  if (
    proof?.fractionalFlavorSource !== p.afterRenderer ||
    proof.nativeReplayHash !== p.native.contentSha256 ||
    item.runtimeGuards?.['games/magic/src'] !== p.afterRenderer ||
    proof.coveredPrintings !== group.printings ||
    proof.validationKind !== 'source-census'
  )
    return false;
  const members = proof.sourceCensus?.members;
  if (
    !Array.isArray(members) ||
    members.length !== group.printings ||
    new Set(members.map((m) => m.id)).size !== group.printings
  )
    return false;
  const native = await artifact(p.native),
    prior = await artifact(p.priorScores);
  return group.printingIds.every((id) => {
    const n = native.rows.find((r) => r.id === id && r.set === '4ed'),
      old = prior.rows.find((r) => r.id === id),
      m = members.find((m) => m.id === id);
    return !!(
      n &&
      old &&
      m &&
      m.name === n.name &&
      m.referenceHash === n.referenceHash &&
      m.poseHash === old.poseHash &&
      m.inputHash === n.inputHash &&
      m.nativeFaceHash === n.modes.original.after
    );
  });
}
