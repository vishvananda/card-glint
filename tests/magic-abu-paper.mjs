import { printingFlavorHistoricalHash } from '../games/magic/tools/accuracy/printing-flavor-data-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash, sourceHash } from '../games/magic/tools/accuracy/common.mjs';
import {
  abuPaperDelta,
  abuPaperApprovalCurrent,
  preAbuPaperSource,
  abuPaperHistoricalHash,
  abuPaperAffected,
  abuPaperRuntimeCompatible,
} from '../games/magic/tools/accuracy/abu-paper-ancestry.mjs';
const p = await abuPaperDelta();
assert.equal(await printingFlavorHistoricalHash('games/magic/src'), p.afterRenderer);
assert.equal(await abuPaperHistoricalHash(), p.beforeRenderer);
for (const [file, e] of Object.entries(p.files)) {
  const raw = await readFile(file),
    before = await preAbuPaperSource(file, raw);
  assert.equal(hash(before), e.before);
  assert.deepEqual(await preAbuPaperSource(file, before), before);
  await assert.rejects(
    preAbuPaperSource(file, Buffer.concat([raw, Buffer.from('// hidden')])),
    /Unreviewed AB paper source/,
  );
}
const native = JSON.parse(gunzipSync(await readFile(p.native.file)));
assert.equal(native.rows.length, 899);
assert.equal(native.faces.length, p.members.length * 6);
for (const row of native.faces) {
  assert.equal(row.alpha, 0);
  assert.equal(row.outsidePaper, 0);
  if (row.layer === 'etching') assert.equal(row.changed, 0);
}
for (const m of p.members) {
  const group = { printingIds: [m.id] };
  for (const task of ['frameGeometry', 'paperColor', 'fullCard', 'release']) {
    assert(await abuPaperAffected(m.set, task, false, group));
    assert(!(await abuPaperAffected(m.set, task, true, group)));
    assert(
      !(await abuPaperRuntimeCompatible(
        'games/magic/src',
        p.beforeRenderer,
        m.set,
        task,
        false,
        group,
      )),
    );
  }
  for (const task of ['rules', 'headings', 'artist', 'manaColor', 'stats', 'frameColor'])
    assert(!(await abuPaperAffected(m.set, task, false, group)));
}
assert(await abuPaperRuntimeCompatible('games/magic/src', p.beforeRenderer, '8ed', 'fullCard'));
assert(!(await abuPaperRuntimeCompatible('games/magic/src', '0'.repeat(64), '8ed', 'fullCard')));
assert(
  await abuPaperAffected('lea', 'frameGeometry', false, {}),
  'Unknown membership fails closed',
);
const file = 'games/magic/fixtures/accuracy/early-through-fourth/abu-paper-current-scores.json.gz';
const summary = JSON.parse(gunzipSync(await readFile(file)));
assert.equal(summary.rows.length, 899);
assert.equal(new Set(summary.rows.map((r) => r.id)).size, 899);
assert.equal(summary.source.rendererHash, p.afterRenderer);
assert.equal(summary.source.nativeHash, p.native.contentSha256);
assert.equal(summary.recomputedPrintings + summary.reusedPrintings, 899);
for (const row of summary.rows) {
  const n = native.rows.find((n) => n.id === row.id);
  assert.equal(row.nativeFaceHash, n.original.hashes['after-face']);
  assert.equal(row.referenceHash, n.referenceHash);
  assert.equal(row.poseHash, n.poseHash);
  assert.equal(row.inputHash, n.inputHash);
  assert(Number.isFinite(row.score100));
}
for (const r of summary.footprints) assert.equal(r.outsidePaper, 0);
console.log(
  JSON.stringify({
    native: 899,
    affected: p.members.length,
    layerPairs: native.faces.length,
    recomputed: summary.recomputedPrintings,
    reused: summary.reusedPrintings,
    summary: summary.summary,
  }),
);

const m = p.members[0],
  group = { printingIds: [m.id], printings: 1 };
const item = {
  runtimeGuards: { 'games/magic/src': p.afterRenderer },
  guards: { [p.native.file]: p.native.sha256 },
  proof: {
    abuPaperSource: p.afterRenderer,
    rendererHash: p.afterRenderer,
    nativeReplayHash: p.native.contentSha256,
    coveredPrintings: 1,
    validationKind: 'source-census',
    sourceCensus: {
      heldOut: false,
      members: [
        {
          id: m.id,
          referenceHash: m.referenceHash,
          poseHash: m.poseHash,
          inputHash: m.inputHash,
          nativeFaceHash: m.original.hashes['after-face'],
        },
      ],
    },
  },
};
assert(await abuPaperApprovalCurrent(item, group));
for (const change of [
  (x) => {
    x.proof.nativeReplayHash = '0'.repeat(64);
  },
  (x) => {
    x.proof.sourceCensus.members[0].poseHash = '0'.repeat(64);
  },
  (x) => {
    x.proof.sourceCensus.members[0].nativeFaceHash = '0'.repeat(64);
  },
  (x) => {
    x.proof.sourceCensus.heldOut = true;
  },
  (x) => {
    x.guards = {};
  },
  (x) => {
    x.proof.coveredPrintings = 2;
  },
]) {
  const x = structuredClone(item);
  change(x);
  assert(!(await abuPaperApprovalCurrent(x, group)));
}
assert(!(await abuPaperApprovalCurrent({ proof: { abuPaperSource: p.afterRenderer } }, group)));
