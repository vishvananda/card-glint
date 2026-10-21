// Prepare a source-family experiment without changing production defaults or scan poses.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import { root, hash, sourceHash, writeJson, mapLimit } from './common.mjs';
import { cachedFetch } from './cache.mjs';
const [inputFile, nativeDirectory, output, fetchOption] = process.argv.slice(2);
assert(
  output && [undefined, '--fetch-assets'].includes(fetchOption),
  'Usage: modern-frame-source-inputs.mjs INPUTS NATIVE OUTPUT.json [--fetch-assets]',
);
const inputBytes = await readFile(inputFile);
const input = JSON.parse(inputBytes);
const captureBytes = await readFile(path.join(nativeDirectory, 'capture.json'));
const capture = JSON.parse(captureBytes);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(input.set, 'm21');
assert.equal(input.entries.length, 297);
assert.equal(capture.completed, 297);
assert.deepEqual(capture.faults, []);
assert.equal(capture.source.inputsHash, hash(inputBytes));
assert.equal(capture.source.rendererHash, rendererHash);
const ids = new Set(input.entries.map((e) => e.id));
assert.equal(ids.size, 297);
assert.equal(capture.rows.length, 297);
assert.equal(new Set(capture.rows.map((e) => e.id)).size, 297);
const rows = [];
const entries = input.entries.map((e) => {
  const b = capture.rows.find((r) => r.id === e.id);
  assert(b && !b.issue && b.inputHash === hash(JSON.stringify(e.face)));
  assert.equal(e.face.wordingMode, 'original');
  assert.equal(e.face.frameStyle, 'modern');
  assert.equal(e.face.frameAssetFamily, undefined);
  const physicalType = e.face.canonicalTypeLine ?? e.face.typeLine ?? '';
  const reason = /\bPlaneswalker\b/.test(physicalType)
    ? 'separate-planeswalker-assets'
    : e.face.legendary || /\bLegendary\b/.test(physicalType)
      ? 'full-plate-painter-has-no-crown'
      : (e.face.layout ?? 'normal') !== 'normal'
        ? 'separate-layout'
        : null;
  const face = reason ? e.face : { ...e.face, frameAssetFamily: 'm15-accurate' };
  rows.push({
    id: e.id,
    number: e.card.collector_number,
    name: e.card.name,
    originalFaceHash: b.inputHash,
    candidateFaceHash: hash(JSON.stringify(face)),
    candidate: !reason,
    reason,
  });
  return { ...e, face };
});
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
let urls;
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  urls = [
    ...new Set(
      entries.flatMap((e) => canvasAssetUrls(e.face)).filter((url) => typeof url === 'string'),
    ),
  ];
} finally {
  await server.close();
}
const known = new Map(
  [...input.components, ...input.entries.flatMap((e) => [e.art, e.reference])].map((a) => [
    a.url,
    a,
  ]),
);
for (const url of urls) {
  if (url.startsWith('https://')) continue;
  const match = /^\/__accuracy\/object\/([a-f0-9]{64})$/.exec(url);
  assert(
    match && [...known.values()].some((a) => a.sha256 === match[1]),
    'Unbound local asset: ' + url,
  );
}
const extra = await mapLimit(
  urls.filter((url) => url.startsWith('https://') && !known.has(url)),
  2,
  (url) => cachedFetch(url, { offline: fetchOption !== '--fetch-assets' }),
);
const candidate = {
  ...input,
  entries,
  components: [...input.components, ...extra],
  frameSourceStudy: {
    schema: 1,
    originalInputsHash: hash(inputBytes),
    baselineCaptureHash: hash(captureBytes),
    rendererHash,
    toolHash: hash(await readFile(new URL(import.meta.url))),
    fontStylesHash: hash(await readFile(path.join(root, 'games/magic/fonts.css'))),
    scope:
      'Compare the existing component painter with the public M15 accurate full plate on all eligible plain M21 faces. Preserve every Original field except frameAssetFamily. Legendary crowns and planeswalkers remain unchanged controls because the full plate painter does not supply those shapes. Keep the frozen baseline scan matrices; do not normalize against the candidate.',
    candidateCount: rows.filter((r) => r.candidate).length,
    unchangedControls: rows.filter((r) => !r.candidate).length,
    rows,
    extraAssets: extra,
  },
};
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
await writeJson(output, candidate);
console.log(
  JSON.stringify({
    total: 297,
    candidates: candidate.frameSourceStudy.candidateCount,
    unchangedControls: candidate.frameSourceStudy.unchangedControls,
    extraAssets: extra.length,
  }),
);
