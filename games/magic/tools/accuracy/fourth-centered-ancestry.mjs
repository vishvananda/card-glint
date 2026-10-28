import { oldFrameHistoricalSourceFiles } from './old-frame-source-ancestry.mjs';
import { fourthFlavorApproval } from './fourth-flavor-ancestry.mjs';
import { preFourthDetailsSource, fourthDetailsApproval } from './fourth-details-ancestry.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';
import { validateFourthCenteredData } from './fourth-centered-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/4ed/reviewed-centering-source-delta.json.gz';
const RECEIPT = 'ec9a404405cf53a12e7f1fa95328d868534e724f6cadbf900be4a1a98c7a5378';
let checked;
export function fourthCenteredDelta() {
  return (checked ??= (async () => {
    const z = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(z), RECEIPT);
    const p = JSON.parse(gunzipSync(z));
    assert.deepEqual(validateFourthCenteredData(p), p.summary);
    const nz = await fs.readFile(path.join(root, p.native.file));
    assert.equal(hash(nz), p.native.sha256);
    const raw = gunzipSync(nz);
    assert.equal(hash(raw), p.native.contentSha256);
    const n = JSON.parse(raw);
    assert.equal(n.status, 'complete-native-reviewed-centering-isolation');
    assert.equal(n.beforeRenderer, p.beforeRenderer);
    assert.equal(n.afterRenderer, p.afterRenderer);
    assert.equal(n.nativeVariants, 1512);
    assert.deepEqual(n.ids, p.ids);
    assert.equal(n.rows.length, 378);
    assert.equal(new Set(n.rows.map((r) => r.id)).size, 378);
    const priorBytes = await fs.readFile(path.join(root, p.parentScores.file));
    assert.equal(hash(priorBytes), p.parentScores.sha256);
    const priorRaw = gunzipSync(priorBytes);
    assert.equal(hash(priorRaw), p.parentScores.contentSha256);
    const prior = JSON.parse(priorRaw);
    assert.equal(prior.rendererHash, p.beforeRenderer);
    assert.equal(prior.inputHash, n.source.beforeInputs);
    assert.equal(prior.rows.length, 378);
    for (const r of n.rows) {
      const old = prior.rows.find((v) => v.id === r.id);
      assert(old);
      assert.equal(old.referenceHash, r.referenceHash);
      assert.equal(old.nativeHash, r.modes.original.before);
      assert.equal(old.inputHash, r.beforeInputHash);
    }

    for (const mode of ['original', 'oracle', 'oracle-modern', 'etching']) {
      const changed = mode === 'original' ? 12 : 0;
      assert.deepEqual(n.counts[mode], { changed, unchanged: 378 - changed, keysChanged: 378 });
    }
    for (const r of n.rows) {
      assert.equal(r.scoped, p.ids.includes(r.id));
      if (r.scoped) {
        const m = p.members.find((m) => m.id === r.id);
        assert.equal(r.beforeParagraphsHash, hash(JSON.stringify(m.paragraphsBefore)));
        assert.equal(r.unstyledParagraphsHash, r.beforeParagraphsHash);
        assert.equal(r.prototypeHash, r.modes.original.after);
      }
      for (const [mode, v] of Object.entries(r.modes)) {
        assert.equal(v.outside, 0);
        assert.equal(v.alpha, 0);
        assert.equal(v.before !== v.after, r.scoped && mode === 'original');
      }
    }
    return p;
  })());
}
export async function preFourthCenteredSource(file, bytes) {
  bytes = await preFourthDetailsSource(file, bytes);
  const e = (await fourthCenteredDelta()).files[file];
  return e && e.beforeSource !== null && hash(bytes) === e.after
    ? Buffer.from(e.beforeSource)
    : bytes;
}
export async function fourthCenteredAffected(set, task, original = false, group) {
  if (
    set?.toLowerCase() !== '4ed' ||
    original ||
    !['rules', 'flavor', 'fullCard', 'release'].includes(task)
  )
    return false;
  const p = await fourthCenteredDelta();
  return !Array.isArray(group?.printingIds) || p.ids.some((id) => group.printingIds.includes(id));
}
/** A marker alone cannot approve old native members after the style change.
 * Complete component audits and publication still supply their normal gates. */
export async function fourthCenteredApproval(item, group) {
  const p = await fourthCenteredDelta(),
    proof = item.proof;
  if (
    proof?.reviewedCenteringSource === p.afterRenderer &&
    (await fourthFlavorApproval(item, group))
  )
    return true;
  if (
    proof?.reviewedCenteringSource === p.afterRenderer &&
    (await fourthDetailsApproval(item, group))
  )
    return true;
  if (
    proof?.reviewedCenteringSource !== p.afterRenderer ||
    proof.nativeReplayHash !== p.native.contentSha256 ||
    item.runtimeGuards?.['games/magic/src'] !== p.afterRenderer ||
    proof.coveredPrintings !== group.printings ||
    proof.validationKind !== 'source-census'
  )
    return false;
  const z = await fs.readFile(path.join(root, p.native.file)),
    native = JSON.parse(gunzipSync(z));
  const priorBytes = await fs.readFile(path.join(root, p.parentScores.file));
  const prior = JSON.parse(gunzipSync(priorBytes));
  const members = proof.sourceCensus?.members;
  if (
    !Array.isArray(members) ||
    members.length !== group.printings ||
    new Set(members.map((m) => m.id)).size !== group.printings
  )
    return false;
  return group.printingIds.every((id) => {
    const old = prior.rows.find((r) => r.id === id);
    const n = native.rows.find((r) => r.id === id),
      m = members.find((m) => m.id === id);
    return (
      n &&
      m &&
      n.name === m.name &&
      n.referenceHash === m.referenceHash &&
      old?.poseHash === m.poseHash &&
      n.inputHash === m.inputHash &&
      n.modes.original.after === m.nativeFaceHash
    );
  });
}
export async function fourthCenteredHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(?:ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        (await oldFrameHistoricalSourceFiles(files)).map(async (f) => [
          path.relative(directory, f),
          hash(await preFourthCenteredSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
