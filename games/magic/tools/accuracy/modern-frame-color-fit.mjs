// Proposal only: source-bound frame/paper colors from nonfoil frozen M21 scans.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, hash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleColor, fitHsb, evaluateHsb, center, quantile } from './hsb-color.mjs';
const [inputFile, nativeDirectory, scoreDirectory, output] = process.argv.slice(2);
assert(output, 'Usage: modern-frame-color-fit.mjs INPUTS NATIVE SCORES OUTPUT');
const read = async (file) => {
  const raw = await readFile(file);
  return { data: JSON.parse(raw), sha256: hash(raw) };
};
const inputs = await read(inputFile),
  native = await read(path.join(nativeDirectory, 'capture.json')),
  scores = await read(path.join(scoreDirectory, 'scores.json'));
assert.equal(inputs.sha256, native.data.source.inputsHash);
assert.equal(inputs.sha256, scores.data.definition.inputsHash);
assert.equal(native.sha256, scores.data.definition.nativeCaptureHash);
assert.equal(native.data.completed, 297);
assert.deepEqual(native.data.faults, []);
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
const windows = {
  frame: [
    [26, 100, 7, 250],
    [455, 100, 7, 250],
  ],
  paper: [[50, 442, 388, 142]],
};
const groups = new Map(),
  excluded = [];
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { framePlate } = await server.ssrLoadModule(
    '/games/magic/src/presentation/frame-plates.ts',
  );
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const { model } = JSON.parse(await readFile('games/magic/fixtures/accuracy/early-hsb-plan.json'));
  for (const e of inputs.data.entries) {
    const type = e.face.canonicalTypeLine ?? e.face.typeLine ?? '';
    const reason =
      e.face.frameAssetFamily !== 'm15-accurate'
        ? 'control-family'
        : !e.card.finishes.includes('nonfoil')
          ? 'foil-only'
          : /\bLand\b/.test(type)
            ? 'separate-land-cohort'
            : (e.face.colors ?? []).length > 1
              ? 'retain-paired-color-components'
              : /\bArtifact\b/.test(type) && (e.face.colors ?? []).length
                ? 'retain-colored-artifact-components'
                : null;
    if (reason) {
      excluded.push({ id: e.id, name: e.card.name, reason });
      continue;
    }
    const plate = framePlate(e.face);
    assert(plate && !plate.rightFrame);
    const n = native.data.rows.find((r) => r.id === e.id),
      s = scores.data.rows.find((r) => r.id === e.id);
    assert.equal(n.referenceHash, e.reference.sha256);
    assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(s.referenceHash, e.reference.sha256);
    assert(s.poseAccepted);
    const bytes = await readFile(path.join(nativeDirectory, n.layers.face.file));
    assert.equal(hash(bytes), n.layers.face.sha256);
    const ref = await readFile(path.join(scoreDirectory, s.normalizedReference.file));
    assert.equal(hash(ref), s.normalizedReference.sha256);
    const render = normalize(PNG.sync.read(bytes, { checkCRC: true }));
    const scan = PNG.sync.read(ref, { checkCRC: true });
    assert.deepEqual([scan.width, scan.height], [488, 680]);
    let g = groups.get(plate.frame);
    if (!g) groups.set(plate.frame, (g = { source: plate.frame, rows: [] }));
    const parts = {};
    for (const [part, patches] of Object.entries(windows)) {
      const options = { tileSize: part === 'frame' ? 7 : 20, paper: part === 'paper' };
      parts[part] = {
        source: sampleColor(render, patches, options),
        reference: sampleColor(scan, patches, options),
      };
    }
    g.rows.push({
      id: e.id,
      name: e.card.name,
      number: e.card.collector_number,
      referenceHash: e.reference.sha256,
      nativeHash: n.layers.face.sha256,
      normalizedHash: s.normalizedReference.sha256,
      parts,
    });
  }
  const results = [];
  for (const group of groups.values()) {
    const parts = {};
    for (const part of ['frame', 'paper']) {
      const samples = group.rows.map((r) => r.parts[part].source);
      const allTiles = samples.flatMap((s) => s.tiles),
        stride = Math.max(1, Math.ceil(allTiles.length / 1024));
      const tiles = allTiles.filter((_, i) => i % stride === 0),
        rgb = center(samples.map((s) => s.rgb));
      const source = {
        rgb,
        tiles,
        spread: quantile(
          tiles.map((t) => Math.hypot(...t.map((v, i) => v - rgb[i]))),
          0.9,
        ),
      };
      const references = group.rows.map((r) => r.parts[part].reference);
      const fit = fitHsb(source, references, model, math);
      const evaluations = group.rows.map((r) => ({
        id: r.id,
        ...evaluateHsb(r.parts[part].source, r.parts[part].reference, fit.adjustment, math),
      }));
      parts[part] = {
        ...fit,
        sourceRgb: rgb,
        beforeMean: evaluations.reduce((s, r) => s + r.before, 0) / evaluations.length,
        afterMean: evaluations.reduce((s, r) => s + r.after, 0) / evaluations.length,
        worse: evaluations.filter((r) => r.after > r.before).length,
        meanClipping: evaluations.reduce((s, r) => s + r.clipping, 0) / evaluations.length,
        evaluations,
      };
    }
    results.push({
      source: group.source,
      nonfoilPrintings: group.rows.length,
      parts,
      printings: group.rows.map(({ parts, ...row }) => row),
    });
    console.log(
      JSON.stringify({
        source: group.source.split('/').at(-1),
        count: group.rows.length,
        frame: [parts.frame.beforeMean, parts.frame.afterMean],
        paper: [parts.paper.beforeMean, parts.paper.afterMean],
      }),
    );
  }
  await mkdir(output, { recursive: true });
  await writeJson(path.join(output, 'proposal.json'), {
    schema: 1,
    set: 'm21',
    status: 'predicted-colors-require-native-replay',
    scope:
      'Six ordinary single-color/colorless source families, fixed frozen scan geometry. Nonfoil references only; separate shared frame/paper fits, no card-specific color transforms. Patches were visually checked on white/green examples. Pooled tile prediction does not certify contrast, source bevels, source choice or set completion. Lands, crowns, walkers, gold and colored artifacts stay visible in excluded cohorts.',
    source: {
      inputsHash: inputs.sha256,
      nativeHash: native.sha256,
      scoresHash: scores.sha256,
      toolHash: hash(await readFile(new URL(import.meta.url))),
    },
    windows,
    model,
    groups: results,
    excluded,
  });
} finally {
  await server.close();
}
