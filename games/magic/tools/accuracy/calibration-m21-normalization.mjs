import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from './common.mjs';
import { EARLY_SOURCE_RECEIPT } from './abu-source-ancestry.mjs';
const file = 'games/magic/fixtures/accuracy/m21/normalization-native-review.json';
/** Scan pose certification is independent of glyph/color fits and rendering defaults. */
export async function m21NormalizationEvidence() {
  const bytes = await readFile(file),
    summary = JSON.parse(bytes);
  const compressedFile = 'games/magic/fixtures/accuracy/m21/' + summary.evidence.file;
  const compressed = await readFile(compressedFile);
  assert.equal(hash(compressed), summary.evidence.sha256);
  const raw = gunzipSync(compressed);
  assert.equal(hash(raw), summary.evidence.contentSha256);
  const receipt = JSON.parse(raw);
  assert.equal(receipt.status, 'validated-scan-only-normalization');
  assert.equal(receipt.rows.length, 297);
  assert.equal(new Set(receipt.rows.map((r) => r.id)).size, 297);
  assert.equal(
    receipt.controls.reduce((n, c) => n + c.rows.length, 0),
    1716,
  );
  const nativeFile = 'games/magic/fixtures/accuracy/m21/modern-default-m21-native-review-r2.json';
  const nativeBytes = await readFile(nativeFile),
    native = JSON.parse(nativeBytes);
  const nativeCompressedFile = native.evidence.file;
  const nativeCompressed = await readFile(nativeCompressedFile);
  assert.equal(hash(nativeCompressed), native.evidence.sha256);
  const nativeRaw = gunzipSync(nativeCompressed);
  assert.equal(hash(nativeRaw), native.evidence.contentSha256);
  const nativeRows = JSON.parse(nativeRaw).rows;
  assert.equal(nativeRows.length, 297);
  for (const row of receipt.rows) {
    assert(row.fit.accepted && row.certification.accepted);
    const n = nativeRows.find((n) => n.id === row.id);
    assert.equal(n?.referenceHash, row.referenceHash);
  }
  const guards = Object.fromEntries([
    [file, hash(bytes)],
    [compressedFile, hash(compressed)],
    [nativeFile, hash(nativeBytes)],
    [nativeCompressedFile, hash(nativeCompressed)],
    ['games/magic/tools/accuracy/modern-normalization-certify.mjs', receipt.definition.toolHash],
    ...Object.entries(receipt.templates.sources).map(([name, digest]) => [
      'games/magic/tools/accuracy/' + name,
      digest,
    ]),
  ]);
  const current = (
    await Promise.all(
      Object.entries(guards).map(async ([name, digest]) => hash(await readFile(name)) === digest),
    )
  ).every(Boolean);
  return { receipt, summary, native, nativeRows, guards, current, evidence: [file, nativeFile] };
}
export function applyM21Normalization(group, data) {
  const rows = data.receipt.rows.filter((row) => group.printingIds.includes(row.id));
  assert.equal(rows.length, group.printings, 'Missing M21 pose census members');
  const names = [...new Set(rows.map((r) => r.name))].sort();
  const sourceCensus = {
    scope: 'all-ordinary-printings-in-variant',
    heldOut: false,
    names,
    referenceUse: 'physical-boundary-only',
    foilPigmentExcluded: true,
    parametersHash: data.receipt.definition.normalizationHash,
    parameterScope:
      'Shared scan-only population frame templates and fixed affine comparison poses. No printing-specific rendering adjustment.',
    members: rows.map((row) => {
      const n = data.nativeRows.find((n) => n.id === row.id);
      return {
        id: row.id,
        name: row.name,
        referenceHash: row.referenceHash,
        poseHash: hash(JSON.stringify(row.transform)),
        inputHash: n.inputHash,
        nativeFaceHash: n.faceHash,
      };
    }),
  };
  group.tasks.normalization = {
    status: data.current ? 'validated' : 'stale',
    reason:
      'Complete variant scan-only affine census, including scale, rotation and shear. Two disjoint fit partitions and one held boundary partition; 1,716 known-raster recovery controls pass. Development-reference census, not independent names. Foil-only scans validate physical boundaries only; no pigment approval.',
    reviewedAt: data.receipt.visual.reviewedAt,
    evidence: data.evidence,
    guards: data.guards,
    coveredPrintings: rows.length,
    proof: {
      sourceHash: group.sourceHashes?.normalization ?? group.sourceHash,
      scopeHash: group.scopeHash,
      gatesPassed: true,
      rendererHash: data.native.definition.afterRenderer,
      methodHash: data.receipt.definition.toolHash,
      nativeReplayHash: data.native.definition.afterCapture,
      metricsHash: data.summary.evidence.contentSha256,
      scanTemplateHash: data.receipt.definition.templatesHash,
      coveredPrintings: rows.length,
      calibrationNames: names.length,
      validationNames: names.length,
      validationKind: 'source-census',
      sourceCensus,
      choice: 'shared-scan-template',
      earlyBatchReceipt: EARLY_SOURCE_RECEIPT,
    },
  };
}
