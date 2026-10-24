// Refresh only the three variants whose Original flavor source changed.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import prettier from 'prettier';
import { hash } from './common.mjs';
import { printingFlavorDelta } from './printing-flavor-data-ancestry.mjs';
const p = await printingFlavorDelta();
const native = JSON.parse(gunzipSync(await readFile(p.native.file)));
const file = 'games/magic/fixtures/accuracy/calibration-progress.json',
  ledger = JSON.parse(await readFile(file));
let groups = 0;
for (const set of ledger.sets.filter((s) => ['lea', 'leb', '2ed'].includes(s.set)))
  for (const group of set.groups) {
    if (!group.printingIds.some((id) => p.members.some((m) => m.id === id))) continue;
    const rows = group.printingIds.map((id) => native.rows.find((r) => r.id === id));
    assert(rows.every(Boolean));
    const old = group.tasks.references;
    assert(['validated', 'validated-default'].includes(old.status));
    const names = [...new Set(rows.map((r) => r.name))];
    group.tasks.references = {
      ...old,
      status: 'validated',
      reviewedAt: '2026-10-24',
      reason:
        'Original flavor attribution corrected for the exact Pearled Unicorn scan. All other wording, references, poses and artist data preserve their prior review. The full native/source census joins every member of this variant; typography and full-card completion remain separate.',
      evidence: [
        ...new Set([
          ...old.evidence,
          p.review.file,
          p.native.file,
          'games/magic/fixtures/accuracy/early-through-fourth/printing-flavor-data-delta.json.gz',
        ]),
      ],
      guards: {
        ...old.guards,
        [p.review.file]: p.review.sha256,
        [p.native.file]: p.native.sha256,
        'games/magic/fixtures/accuracy/early-through-fourth/printing-flavor-data-delta.json.gz':
          hash(
            await readFile(
              'games/magic/fixtures/accuracy/early-through-fourth/printing-flavor-data-delta.json.gz',
            ),
          ),
        [p.validationSource.file]: p.validationSource.sha256,
        ...Object.fromEntries(Object.entries(p.files).map(([f, e]) => [f, e.after])),
      },
      runtimeGuards: { 'games/magic/src': p.afterRenderer },
      proof: {
        ...old.proof,
        printingFlavorSource: p.afterRenderer,
        rendererHash: p.afterRenderer,
        sourceHash: group.sourceHashes?.references ?? group.sourceHash,
        scopeHash: group.scopeHash,
        methodHash: p.validationSource.sha256,
        nativeReplayHash: p.native.contentSha256,
        metricsHash: hash(JSON.stringify({ review: p.review, native: p.native })),
        coveredPrintings: rows.length,
        calibrationNames: names.length,
        validationNames: names.length,
        validationKind: 'source-census',
        gatesPassed: true,
        sourceCensus: {
          heldOut: false,
          scope: 'all-ordinary-printings-in-variant',
          names,
          parametersHash: hash(
            JSON.stringify({ field: 'flavorText', members: p.members.map((m) => m.id) }),
          ),
          parameterScope:
            'A reviewed attribution paragraph only; no layout/pose fitting. Unchanged source fields retain their independent reviews.',
          members: rows.map((r) => ({
            id: r.id,
            name: r.name,
            referenceHash: r.referenceHash,
            poseHash: r.poseHash,
            inputHash: r.inputHash,
            nativeFaceHash: r.original.hashes['after-face'],
          })),
        },
      },
    };
    groups++;
  }
assert.equal(groups, 3);
await writeFile(
  file,
  await prettier.format(JSON.stringify(ledger), {
    ...(await prettier.resolveConfig(file)),
    parser: 'json',
  }),
);
console.log(
  'Three Original reference/wording variants refreshed; rules/flavor/full-card/release remain separate.',
);
