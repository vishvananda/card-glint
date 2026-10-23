// Complete native named-policy parity and pure material resolution across four modes.
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createServer } from 'vite';
import path from 'node:path';
import { hash, sourceHash, root } from './common.mjs';
const [inputFile, productionDir, namedDir, output] = process.argv.slice(2);
assert(output, 'Usage: modern-stock-policy-audit.mjs INPUTS PRODUCTION NAMED_REFERENCE OUTPUT');
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes) };
};
const [inputs, production, named, namedInputs] = await Promise.all([
  read(inputFile),
  read(path.join(productionDir, 'capture.json')),
  read(path.join(namedDir, 'capture.json')),
  read(path.join(namedDir, 'inputs.json')),
]);
assert.equal(
  production.data.source.rendererHash,
  await sourceHash(path.join(root, 'games/magic/src')),
);
for (const c of [production.data, named.data]) {
  assert.equal(c.completed, inputs.data.entries.length);
  assert.equal(c.rows.length, inputs.data.entries.length);
  assert.deepEqual(c.faults, []);
  assert.equal(new Set(c.rows.map((r) => r.id)).size, c.rows.length);
}
for (const key of ['rasterHelpers', 'packMetadata', 'components', 'toolHash', 'browser'])
  assert.deepEqual(production.data.source[key], named.data.source[key], key);
assert.equal(production.data.source.inputsHash, hash(inputs.bytes));
assert.equal(named.data.source.inputsHash, hash(namedInputs.bytes));
for (const e of inputs.data.entries) {
  const n = namedInputs.data.entries.find((r) => r.id === e.id);
  assert(n);
  assert.deepEqual(n.face, { ...e.face, calibration: { profile: 'm21-modern' } });
  assert.equal(n.reference.sha256, e.reference.sha256);
  assert.equal(n.art.sha256, e.art.sha256);
}
const s = await createServer({
  root,
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false, ws: false },
});
try {
  await s.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { printingCalibrationMaterials: resolve } = await s.ssrLoadModule(
    '/games/magic/src/presentation/printing-calibration-materials.ts',
  );
  const sig = (p) => JSON.stringify([p.border, p.materials, p.fallbackAssets, p.fallbackStock]);
  const layers = (r) => Object.fromEntries(Object.entries(r.layers).map(([k, v]) => [k, v.sha256]));
  const rows = [];
  for (const e of inputs.data.entries) {
    const base = resolve(e.face);
    for (const calibration of ['auto', 'printing', { profile: 'm21-modern' }])
      assert.equal(sig(base), sig(resolve({ ...e.face, calibration })), e.card.name);
    const b = production.data.rows.find((r) => r.id === e.id),
      a = named.data.rows.find((r) => r.id === e.id);
    for (const [dir, r] of [
      [productionDir, b],
      [namedDir, a],
    ])
      for (const l of Object.values(r.layers))
        assert.equal(hash(await readFile(path.join(dir, l.file))), l.sha256);
    assert.deepEqual(layers(b), layers(a), e.card.name);
    rows.push({
      id: e.id,
      production: layers(b),
      named: layers(a),
      resolutionEqual: true,
      materialSignature: hash(sig(base)),
    });
  }
  const result = {
    schema: 1,
    definition: {
      inputs: hash(inputs.bytes),
      production: hash(production.bytes),
      named: hash(named.bytes),
      renderer: production.data.source.rendererHash,
      namedReferenceRenderer: named.data.source.rendererHash,
      tool: hash(await readFile(new URL(import.meta.url))),
    },
    summary: { faces: 297, exactNamedFaces: 297, exactNamedEtchings: 297, resolvedPolicies: 4 },
    rows,
  };
  await writeFile(output, JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify(result.summary));
} finally {
  await s.close();
}
