import { fourthFlavorApproval } from './fourth-flavor-ancestry.mjs';
import { preIceDefaultsSource } from './ice-defaults-ancestry.mjs';
// Exact semantic-detail source/native evidence; historical receipts remain immutable.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { gunzipSync } from 'node:zlib';
import { hash, root } from './common.mjs';
import { validateFourthDetailsData } from './fourth-details-data-check.mjs';
const FILE = 'games/magic/fixtures/accuracy/4ed/semantic-details-source-delta.json.gz';
const RECEIPT = 'ebf29b8ca93f7bc8e32f1ca4cbc636d3533bf6fd4b2f3059c19ac333b05c3949';
let checked;
const artifact = async (ref) => {
  const z = await fs.readFile(path.join(root, ref.file));
  assert.equal(hash(z), ref.sha256);
  const raw = gunzipSync(z);
  assert.equal(hash(raw), ref.contentSha256);
  return JSON.parse(raw);
};
export function fourthDetailsDelta() {
  return (checked ??= (async () => {
    const bytes = await fs.readFile(path.join(root, FILE));
    assert.equal(hash(bytes), RECEIPT);
    const p = JSON.parse(gunzipSync(bytes));
    assert.deepEqual(validateFourthDetailsData(p), p.summary);
    const native = await artifact(p.native),
      prior = await artifact(p.parentScores),
      prototype = await artifact(p.prototypeScores);
    assert.equal(native.status, 'complete-native-semantic-details-isolation');
    assert.equal(native.beforeRenderer, p.beforeRenderer);
    assert.equal(native.afterRenderer, p.afterRenderer);
    assert.deepEqual(native.ids, p.ids);
    assert.equal(native.rows.length, 378);
    assert.equal(native.nativeVariants, 1512);
    assert.equal(prior.rendererHash, p.beforeRenderer);
    assert.equal(prior.inputHash, native.source.inputs);
    assert.equal(prototype.rendererHash, p.beforeRenderer);
    assert.equal(prototype.sources.prior, p.parentScores.contentSha256);
    assert.equal(prototype.rows.length, 378);
    for (const row of native.rows) {
      const old = prior.rows.find((r) => r.id === row.id),
        trial = prototype.rows.find((r) => r.id === row.id);
      assert(old && trial);
      assert.equal(row.scoped, p.ids.includes(row.id));
      assert.equal(row.referenceHash, old.referenceHash);
      assert.equal(row.inputHash, old.inputHash);
      assert.equal(row.modes.original.before, old.nativeHash);
      assert.equal(row.modes.original.after, trial.nativeHash);
      for (const [mode, m] of Object.entries(row.modes)) {
        assert.equal(m.outside, 0);
        assert.equal(m.alpha, 0);
        assert.equal(m.before !== m.after, row.scoped && mode === 'original');
        assert.equal(m.beforeKey !== m.afterKey, row.scoped && mode === 'original');
      }
      if (row.scoped) assert.equal(row.prototypeHash, row.modes.original.after);
    }
    for (const mode of ['original', 'oracle', 'oracle-modern', 'etching']) {
      const changed = mode === 'original' ? 7 : 0;
      assert.deepEqual(native.counts[mode], {
        changed,
        unchanged: 378 - changed,
        keysChanged: changed,
      });
    }
    const metadata = await artifact(p.metadata);
    assert.equal(hash(JSON.stringify(metadata)), native.metadataRefresh.proofHash);
    assert.equal(native.capturedRenderer, metadata.beforeRendererHash);
    assert.equal(p.afterRenderer, metadata.afterRendererHash);
    assert.equal(hash(metadata.beforeMetadata), metadata.beforeMetadataHash);
    const manifest = p.files['games/magic/src/data/generated-manifest.json'];
    assert.equal(manifest.beforeSource, metadata.beforeMetadata);
    assert.equal(manifest.after, metadata.afterMetadataHash);
    return p;
  })());
}
export async function preFourthDetailsSource(file, bytes) {
  bytes = await preIceDefaultsSource(file, bytes);
  const e = (await fourthDetailsDelta()).files[file];
  return e && hash(bytes) === e.after ? Buffer.from(e.beforeSource) : bytes;
}
export async function fourthDetailsHistoricalHash(directory = path.join(root, 'games/magic/src')) {
  const files = (await fs.readdir(directory, { recursive: true, withFileTypes: true }))
    .filter((e) => e.isFile() && /\.(ts|mjs|css|json)$/.test(e.name))
    .map((e) => path.join(e.parentPath, e.name))
    .sort();
  return hash(
    JSON.stringify(
      await Promise.all(
        files.map(async (f) => [
          path.relative(directory, f),
          hash(await preFourthDetailsSource(path.relative(root, f), await fs.readFile(f))),
        ]),
      ),
    ),
  );
}
export async function fourthDetailsAffected(set, task, original = false, group) {
  if (
    set?.toLowerCase() !== '4ed' ||
    original ||
    !['manaGeometry', 'manaColor', 'fullCard', 'release'].includes(task)
  )
    return false;
  const p = await fourthDetailsDelta();
  return !Array.isArray(group?.printingIds) || p.ids.some((id) => group.printingIds.includes(id));
}
export async function fourthDetailsApproval(item, group) {
  const p = await fourthDetailsDelta(),
    proof = item.proof;
  if (proof?.semanticDetailsSource === p.afterRenderer && (await fourthFlavorApproval(item, group)))
    return true;
  if (
    proof?.semanticDetailsSource !== p.afterRenderer ||
    proof.nativeReplayHash !== p.native.contentSha256 ||
    item.runtimeGuards?.['games/magic/src'] !== p.afterRenderer ||
    proof.coveredPrintings !== group.printings ||
    proof.validationKind !== 'source-census'
  )
    return false;
  const native = await artifact(p.native),
    prior = await artifact(p.parentScores),
    members = proof.sourceCensus?.members;
  if (
    !Array.isArray(members) ||
    members.length !== group.printings ||
    new Set(members.map((m) => m.id)).size !== group.printings
  )
    return false;
  return group.printingIds.every((id) => {
    const n = native.rows.find((n) => n.id === id),
      old = prior.rows.find((r) => r.id === id),
      m = members.find((m) => m.id === id);
    return (
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
