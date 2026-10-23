// Scope tests: failed poses are retained without scores; partial type reviews
// must preserve Oracle wording and existing original body corrections.
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
const hash = (b) => createHash('sha256').update(b).digest('hex');
const root = await mkdtemp(path.join(tmpdir(), 'printing-audit-'));
try {
  const cache = path.join(root, 'cache'),
    native = path.join(root, 'native'),
    norm = path.join(root, 'normalization');
  for (const p of [path.join(cache, 'objects'), native, norm]) await mkdir(p, { recursive: true });
  const png = new PNG({ width: 32, height: 44 });
  png.data.fill(255);
  const raster = PNG.sync.write(png),
    imageHash = hash(raster);
  await writeFile(path.join(cache, 'objects', imageHash), raster);
  const entries = ['accepted', 'rejected'].map((id) => ({
    id,
    card: { name: id, finishes: ['nonfoil'] },
    face: { wordingMode: 'original' },
    reference: { sha256: imageHash },
  }));
  const bytes = Buffer.from(JSON.stringify({ set: '8ed', entries }));
  const input = path.join(root, 'inputs.json');
  await writeFile(input, bytes);
  await writeFile(path.join(native, 'inputs.json'), bytes);
  await writeFile(path.join(native, 'face.png'), raster);
  await writeFile(
    path.join(native, 'capture.json'),
    JSON.stringify({
      completed: 2,
      faults: [],
      source: { inputsHash: hash(bytes) },
      rows: entries.map((e) => ({
        id: e.id,
        inputHash: hash(JSON.stringify(e.face)),
        referenceHash: imageHash,
        layers: { face: { file: 'face.png', sha256: imageHash } },
      })),
    }),
  );
  await writeFile(
    path.join(norm, 'normalization.json'),
    JSON.stringify({
      summary: { completed: 2 },
      rows: entries.map((e, i) => ({
        id: e.id,
        referenceHash: imageHash,
        accepted: i === 0,
        transform: i === 0 ? { matrix: [1, 0, 0, 1, 0, 0] } : null,
        geometry: 'W',
        family: 'eighth',
      })),
    }),
  );
  const metric = path.join(root, 'metric.mjs');
  await writeFile(
    metric,
    'export const scoreRegions=()=>({structuralScore:.5,coverage:1,components:{title:{applicable:true}}});',
  );
  const out = path.join(root, 'scores');
  execFileSync(
    process.execPath,
    [
      'games/magic/tools/accuracy/printing-calibration-score.mjs',
      input,
      native,
      norm,
      metric,
      out,
      '--diagnostic',
    ],
    { env: { ...process.env, MAGIC_ACCURACY_CACHE: cache }, stdio: 'pipe' },
  );
  const scores = JSON.parse(await readFile(path.join(out, 'scores.json')));
  assert.equal(scores.rows.length, 2);
  assert.equal(scores.summary.total, 2);
  assert.equal(scores.summary.measured, 1);
  assert.equal(scores.summary.meanStructure100, 50);
  assert.equal(scores.rows.find((r) => r.id === 'rejected').metric.structuralScore, null);
  assert.deepEqual(scores.summary.rejectedPoses, ['rejected']);
  assert.deepEqual(scores.summary.missingRegionMaps, []);
} finally {
  await rm(root, { recursive: true, force: true });
}
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false, ws: false },
});
try {
  await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
  const { resolvePrintingWording } = await server.ssrLoadModule('/games/magic/src/index.ts');
  const { resolveWithCorrections } = await server.ssrLoadModule(
    '/games/magic/src/printing/resolve.ts',
  );
  const { printingCorrections } = await server.ssrLoadModule(
    '/games/magic/src/printing/corrections.ts',
  );
  const { reviewSources } = await server.ssrLoadModule('/games/magic/src/data/review-metadata.ts');
  const source = reviewSources.indexOf('games/magic/fixtures/accuracy/8ed/annotations-types.json');
  assert(source >= 0);
  const prior = Object.fromEntries(
    Object.entries(printingCorrections).map(([id, rows]) => [
      id,
      rows.filter((r) => r.evidence !== source),
    ]),
  );
  const types = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/8ed/annotations-types.json'),
  );
  assert.equal(Object.keys(types.cards).length, 170);
  for (const [id, row] of Object.entries(types.cards)) {
    const input = {
      original: { typeLine: 'Provider type', rulesText: 'Original body.' },
      oracle: { typeLine: 'Oracle type', rulesText: 'Oracle body.' },
    };
    const options = { referenceSha256: row.referenceHash };
    const before = resolveWithCorrections(prior, id, input, options),
      after = resolvePrintingWording(id, input, options);
    assert.equal(after.wordings.original.typeLine, row.typeLine, row.name);
    assert.equal(after.wordings.original.rulesText, before.wordings.original.rulesText, row.name);
    assert.deepEqual(after.wordings.oracle, before.wordings.oracle);
    assert.equal(
      resolvePrintingWording(id, input, { referenceSha256: '0'.repeat(64) }).wordings.original
        .typeLine,
      'Provider type',
    );
    assert.deepEqual(row.reviewedFields, ['typeLine']);
    assert.notEqual(row.reviewed, true);
  }
} finally {
  await server.close();
}
console.log(
  'Printing audit preserves failed poses, exact printing scope, original bodies and Oracle wording.',
);
