// Scope proof for static face invalidation; no painting or GPU timing claims.
import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';
import { readJson, writeJson, hash, sourceHash } from './common.mjs';
import { readFile } from 'node:fs/promises';
const [beforeRoot, afterRoot, inputsFile, output, mode = 'outlines'] = process.argv.slice(2);
assert(
  output,
  'Usage: abu-outline-keys.mjs BEFORE_ROOT AFTER_ROOT INPUTS OUT [outlines|plain-wrap]',
);
assert(['outlines', 'plain-wrap'].includes(mode));
const input = await readJson(inputsFile),
  captures = [];
for (const root of [beforeRoot, afterRoot]) {
  const server = await createServer({
    configFile: false,
    root,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
  });
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
    const { cardTextureKey } = await server.ssrLoadModule(
      '/games/magic/src/presentation/canvas-face.ts',
    );
    captures.push({
      commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
      rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
      rows: input.entries.map((e) => {
        const i = { face: e.face, printingId: e.id, printedImage: null };
        return {
          id: e.id,
          set: e.set,
          name: e.name,
          face: cardTextureKey(i, 'inspect'),
          mask: cardTextureKey({ ...i, layer: 'etching' }, 'inspect'),
        };
      }),
    });
  } finally {
    await server.close();
  }
}
const rows = captures[0].rows.map((b, i) => {
  const a = captures[1].rows[i];
  assert.equal(a.id, b.id);
  const expected =
    (b.set === 'leb' && ['Tundra', 'Volcanic Island'].includes(b.name)) ||
    (mode === 'plain-wrap' && b.set === 'lea' && input.entries[i].face.wordingMode !== 'oracle');
  assert.equal(a.face !== b.face, expected, 'Incorrect face-key scope: ' + b.set + ' ' + b.name);
  assert.equal(a.mask, b.mask, 'Unchanged etching mask should retain its key');
  if (expected)
    assert.deepEqual(
      JSON.parse(a.face).filter(
        (v) =>
          ![
            'beta-outline-ink-v2',
            ...(mode === 'plain-wrap' ? ['alpha-plain-rules-wrap-v1'] : []),
          ].includes(v),
      ),
      JSON.parse(b.face),
    );
  return {
    id: b.id,
    set: b.set,
    name: b.name,
    faceChanged: a.face !== b.face,
    maskChanged: false,
    before: hash(b.face),
    after: hash(a.face),
    mask: hash(a.mask),
  };
});
await writeJson(output, {
  schema: 1,
  mode,
  scope:
    mode === 'plain-wrap'
      ? 'All original-printing face and etching keys. Alpha original faces and the two Beta outline revisions invalidate; all etching keys remain unchanged. Key scope is not a claim that every invalidated face changes pixels.'
      : 'All 597 original-printing face and etching keys. Only Beta WU/UR face revisions change; this is identity verification, not a claim of GPU performance or full native replay of every candidate.',
  sources: captures.map(({ rows, ...s }) => s),
  inputsHash: hash(await readFile(inputsFile)),
  toolHash: hash(await readFile(new URL(import.meta.url))),
  rows,
});
console.log(
  JSON.stringify({
    total: rows.length,
    changed: rows.filter((r) => r.faceChanged).map((r) => r.set + ' ' + r.name),
    maskChanges: 0,
  }),
);
