// Close the exact printed-credit correction, keeping other open fits explicit.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { gunzipSync, gzipSync } from 'node:zlib';
import prettier from 'prettier';
import { hash, sourceHash } from './common.mjs';
import { printingArtistDelta } from './printing-artist-data-ancestry.mjs';
const [scoreFile] = process.argv.slice(2);
assert(scoreFile, 'Usage: apply-printing-artist-review.mjs SCORE');
const p = await printingArtistDelta(),
  native = JSON.parse(gunzipSync(await readFile(p.native.file))),
  scoreBytes = await readFile(scoreFile),
  score = JSON.parse(scoreBytes);
assert.equal(score.source.nativeHash, p.native.contentSha256);
assert.equal(score.recomputedPrintings, 1);
assert.equal(score.reusedPrintings, 898);
assert.equal(
  await sourceHash('games/magic/src'),
  p.afterRenderer,
  'Current artist approval needs the captured renderer',
);
const base = 'games/magic/fixtures/accuracy/early-through-fourth/',
  metricFile = base + 'abu-tropical-artist-score.json.gz';
const zip = gzipSync(scoreBytes, { mtime: 0 });
await writeFile(metricFile, zip);
const file = 'games/magic/fixtures/accuracy/calibration-progress.json',
  ledger = JSON.parse(await readFile(file)),
  set = ledger.sets.find((s) => s.set === 'lea'),
  group = set.groups.find((g) => g.printingIds.includes(p.id));
assert.equal(group.printings, 1);
const d = native.definitions.find((d) => d.version === 'after' && d.mode === 'original'),
  r = native.rows.find((r) => r.version === 'after' && r.mode === 'original' && r.layer === 'face');
const receipt = base + 'printing-artist-data-delta.json.gz';
const guards = Object.fromEntries(Object.entries(p.files).map(([f, e]) => [f, e.after]));
guards[receipt] = hash(await readFile(receipt));
guards[p.native.file] = p.native.sha256;
guards[metricFile] = hash(zip);
const old = group.tasks.artist;
group.tasks.artist = {
  ...old,
  status: 'validated',
  reason:
    'The exact Alpha scan credits Mark Poole. Original and both Oracle symbol modes use the corrected physical credit; native changes stay in the artist strip and etching is identical. Existing font/layout calibration is retained. Canonical provider attribution remains separate.',
  evidence: [...new Set([...(old.evidence ?? []), receipt, p.native.file, metricFile])],
  guards: { ...old.guards, ...guards },
  runtimeGuards: { 'games/magic/src': p.afterRenderer },
  proof: {
    ...old.proof,
    sourceHash: group.sourceHashes?.artist ?? group.sourceHash,
    scopeHash: group.scopeHash,
    rendererHash: p.afterRenderer,
    methodHash: native.tool,
    nativeReplayHash: p.native.contentSha256,
    metricsHash: hash(scoreBytes),
    coveredPrintings: 1,
    calibrationNames: 1,
    validationNames: 1,
    validationKind: 'source-census',
    scanTemplateHash: native.poseHash,
    gatesPassed: true,
    printingArtistSource: p.afterRenderer,
    sourceCensus: {
      heldOut: false,
      scope: 'all-ordinary-printings-in-variant',
      names: ['Tropical Island'],
      parametersHash: hash(JSON.stringify({ renderer: p.afterRenderer, assets: p.sharedAssets })),
      parameterScope:
        'Existing Alpha artist font/layout and material parameters; only the reviewed printed credit changes.',
      members: [
        {
          id: p.id,
          name: 'Tropical Island',
          referenceHash: p.referenceHash,
          poseHash: native.poseHash,
          inputHash: d.faceHash,
          nativeFaceHash: r.sha256,
        },
      ],
    },
  },
};
const full = group.tasks.fullCard;
group.tasks.fullCard = {
  ...full,
  status: 'partial',
  reason:
    'Corrected artist input and one-card score update are current. Existing text-wrapping and dual-frame geometry review items remain open; the combined credit/legal diagnostic remains outside the aggregate metric.',
  evidence: [...new Set([...(full.evidence ?? []), receipt, p.native.file, metricFile])],
  guards: { ...full.guards, ...guards },
  runtimeGuards: { 'games/magic/src': p.afterRenderer },
  proof: {
    ...full.proof,
    rendererHash: p.afterRenderer,
    nativeReplayHash: p.native.contentSha256,
    metricsHash: hash(scoreBytes),
    printingArtistSource: p.afterRenderer,
    gatesPassed: false,
  },
};
set.textAudit.physicalArtistUpdate = {
  id: p.id,
  rendererHash: p.afterRenderer,
  evidence: metricFile,
  reusedPrintingScores: 898,
  recomputedPrintingScores: 1,
  reason:
    'Old text/full-card census identities are retained. Only the corrected physical artist input has a new native replay; the combined unverified credits region is diagnostic, so aggregate means do not change.',
};
const config = await prettier.resolveConfig(file);
await writeFile(file, await prettier.format(JSON.stringify(ledger), { ...config, parser: 'json' }));
console.log(
  'Alpha Tropical Island artist correction certified;899 historical scores retained with explicit one-card update.',
);
