import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import ts from 'typescript';
import path from 'node:path';
const root = path.resolve('dist/lib');
async function staticGraph(entry) {
  const seen = new Map();
  async function visit(file) {
    if (seen.has(file)) return;
    const source = await readFile(path.join(root, file), 'utf8');
    seen.set(file, source);
    const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
    for (const n of ast.statements)
      if (
        (ts.isImportDeclaration(n) || ts.isExportDeclaration(n)) &&
        n.moduleSpecifier &&
        ts.isStringLiteral(n.moduleSpecifier)
      ) {
        assert.ok(n.moduleSpecifier.text.startsWith('.'), 'Browser entry must be standalone');
        await visit(
          path.posix.normalize(path.posix.join(path.posix.dirname(file), n.moduleSpecifier.text)),
        );
      }
  }
  await visit(entry);
  return seen;
}
const graphs = Object.fromEntries(
  await Promise.all(
    ['canvas.js', 'magic-lazy.js', 'magic-printing.js', 'magic-presentation.js', 'magic.js'].map(
      async (f) => [f, await staticGraph(f)],
    ),
  ),
);
const all = (map) => [...map.values()].join('\n');
assert.ok(
  !/CardRenderer MTG|printingCorrections|setCalibrationProfiles|hueDegrees/.test(
    all(graphs['canvas.js']),
  ),
  'Generic canvas helpers must not pull in Magic',
);
for (const name of ['magic-lazy.js', 'magic-printing.js']) {
  assert.ok(!/Continuous Artifact/.test(all(graphs[name])), 'No wording payload in initial entry');
  assert.ok(!/stockMask:/.test(all(graphs[name])), 'No blackpoint payload in initial entry');
  assert.ok(
    ![...graphs[name].keys()].some((f) => /^eager-/.test(f)),
    'No compatibility initializer',
  );
}
assert.ok(
  !/CardRenderer MTG|CanvasRenderingContext2D/.test(all(graphs['magic-printing.js'])),
  'Text-only entry does not include painters/fonts',
);
const lazy = await import('../dist/lib/magic-lazy.js');
assert.deepEqual(lazy.loadedMagicSets(), []);
assert.throws(() => lazy.describeSetCalibration('4ed'), /not prepared/);
await Promise.all([lazy.loadMagicSet('4ed'), lazy.loadMagicSet('4ED')]);
assert.deepEqual(lazy.loadedMagicSets(), ['4ed']);
const fourthProfileSource = await readFile('games/magic/src/calibration/sets/4ed.ts', 'utf8');
const fourthRevision = /export const profile = \{[\s\S]*?revision:\s*(\d+)/.exec(
  fourthProfileSource,
)?.[1];
assert.ok(fourthRevision, 'Missing literal Fourth calibration revision');
assert.equal(lazy.describeSetCalibration('4ed').revision, Number(fourthRevision));
const face = {
  name: 'Probe',
  setCode: '4ed',
  typeLine: 'Summon Soldier',
  colors: ['W'],
  frameStyle: 'retro',
  colorCalibration: 'set-hsb-v1',
};
const before = {
  rects: lazy.faceRects(face),
  assets: lazy.canvasAssetUrls(face),
  calibration: lazy.resolvePrintingCalibration(face),
};
await lazy.prepareMagicCards([{ name: 'Modern default', setCode: 'neo', calibration: 'auto' }]);
assert.deepEqual(lazy.loadedMagicSets(), ['4ed', 'm21', 'neo']);
assert.equal(
  lazy.resolvePrintingCalibration({ name: 'Modern default', setCode: 'neo', calibration: 'auto' })
    .components.border.color,
  '#16130e',
);
await assert.rejects(lazy.loadMagicSet('../secrets'), /Invalid Magic/);
const oracle = { typeLine: 'Artifact', rulesText: 'Oracle rules.' };
const evidence = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/printing-review-catalog.json'),
);
const id = 'f594b7aa-d44e-47c4-989b-565f881e25f1';
const resolved = await lazy.resolveSetPrintingWording(evidence.sets[id], id, {
  oracle,
  original: oracle,
});
assert.equal(resolved.wordings.original.typeLine, 'Continuous Artifact');
assert.equal(resolved.provenance.status, 'applied');
assert.equal(
  (await lazy.resolveSetPrintingWording('xyz', id, { oracle, original: oracle })).provenance.status,
  'unreviewed',
);
assert.ok(resolved.provenance.corrections.every((r) => !r.reason.includes('MTGJSON')));
const legacy = await import('../dist/lib/magic-presentation.js');
assert.deepEqual(before, {
  rects: legacy.faceRects(face),
  assets: legacy.canvasAssetUrls(face),
  calibration: legacy.resolvePrintingCalibration(face),
});
const magic = await import('../dist/lib/magic.js');
assert.deepEqual(resolved, magic.resolvePrintingWording(id, { oracle, original: oracle }));
let checked = 0;
for (const [id, rows] of Object.entries(evidence.wording)) {
  const result = await lazy.resolveSetPrintingWording(
    evidence.sets[id],
    id,
    { oracle, original: oracle },
    {
      ...(rows[0].faceName ? { faceName: rows[0].faceName } : {}),
      referenceSha256: rows[0].referenceSha256,
    },
  );
  const expected = magic.resolvePrintingWording(
    id,
    { oracle, original: oracle },
    {
      ...(rows[0].faceName ? { faceName: rows[0].faceName } : {}),
      referenceSha256: rows[0].referenceSha256,
    },
  );
  assert.deepEqual(result, expected, id);
  checked++;
}
const entries = Object.fromEntries(
  Object.entries(graphs).map(([name, graph]) => [
    name,
    {
      files: graph.size,
      bytes: [...graph.values()].reduce((n, s) => n + Buffer.byteLength(s), 0),
      gzipBytes: [...graph.values()].reduce((n, s) => n + gzipSync(s).length, 0),
    },
  ]),
);
const report = {
  schema: 1,
  scope:
    'Initial static ES module graph. Per-set chunks, image assets, WASM and fonts are excluded. Gzip is measured separately per file.',
  entries,
  reviewedWordingPrintings: checked,
  evidenceSha256: createHash('sha256').update(JSON.stringify(evidence)).digest('hex'),
};
await writeFile('evidence/magic-delivery.json', JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
