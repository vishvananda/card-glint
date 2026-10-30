// Configuration coverage, not a substitute for native pixel or scan comparisons.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { createServer } from 'vite';
import { root, hash, sourceHash } from './common.mjs';
import { fileURLToPath } from 'node:url';
const [baseline, output] = process.argv.slice(2);
assert(baseline && output, 'Use BASELINE_SOURCE_ROOT NEW_REPORT');
const ledger = JSON.parse(
  await fs.readFile(path.join(root, 'games/magic/fixtures/accuracy/calibration-progress.json')),
);
const inventory = JSON.parse(
  await fs.readFile(path.join(root, 'games/magic/fixtures/accuracy/rollout-inventory.json')),
);
const sets = new Map(ledger.sets.map((s) => [s.set, s.groups]));
for (const set of inventory.sets.filter((s) => s.ordinaryPrintings > 0 && !sets.has(s.set))) {
  sets.set(
    set.set,
    set.groups.flatMap((g) =>
      ['W', 'U', 'B', 'R', 'G', 'C', 'WU'].flatMap((palette) =>
        ['creature', 'artifact', 'land'].map((kind) => ({
          ...g,
          palette,
          kind,
          legendary: false,
          key: [
            g.frame,
            g.border,
            g.layout,
            palette,
            kind,
            'ordinary',
            'plain',
            'none',
            'nonfoil',
          ].join('/'),
          synthetic: true,
        })),
      ),
    ),
  );
}
const faces = [];
for (const [set, groups] of sets)
  for (const group of groups) {
    const p = group.key.split('/'),
      frame = group.frame ?? p[0],
      border = group.border ?? p[1],
      layout = group.layout ?? p[2],
      palette = group.palette ?? p[3],
      kind = group.kind ?? p[4];
    const typeLine = kind.includes('land')
      ? 'Land'
      : kind.includes('artifact')
        ? 'Artifact' + (kind.includes('creature') ? ' Creature' : '')
        : kind.includes('planeswalker')
          ? 'Planeswalker'
          : kind.includes('battle')
            ? 'Battle'
            : kind.includes('spell')
              ? 'Instant'
              : 'Creature';
    faces.push({
      set,
      group: group.key,
      synthetic: group.synthetic ?? false,
      face: {
        name: 'Symbol placement control',
        setCode: set,
        frameStyle: ['1993', '1997'].includes(frame) ? 'retro' : 'modern',
        ...(frame === '2003' ? { frameAssetFamily: 'eighth' } : {}),
        borderColor: border,
        layout,
        typeLine,
        colors: [...palette].filter((c) => 'WUBRG'.includes(c)),
        legendary: group.legendary ?? p[5] === 'legendary',
        manaSymbols: ['2', 'U'],
        rulesText: 'Pay {2}.',
        calibration: 'auto',
        colorCalibration: 'set-hsb-v1',
        collectorNumber: '1',
      },
    });
  }
const geometry = (x) =>
  Object.fromEntries(
    ['dx', 'dy', 'scaleX', 'scaleY', 'spacing'].map((k) => [
      k,
      x?.[k] ?? (k.startsWith('scale') ? 1 : 0),
    ]),
  );
async function sample(sourceRoot) {
  const server = await createServer({
    root: sourceRoot,
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { middlewareMode: true, hmr: false },
  });
  try {
    await server.ssrLoadModule('/games/magic/src/data/eager.ts');
    await server.ssrLoadModule('/games/magic/src/data/eager-wording.ts');
    const { printingManaDefaults } = await server.ssrLoadModule(
      '/games/magic/src/presentation/printing-mana-adjustment.ts',
    );
    return faces.map(({ face, ...identity }) => {
      const original = printingManaDefaults({
        ...face,
        symbolStyle: 'original',
        wordingMode: 'oracle',
      });
      const modern = printingManaDefaults({
        ...face,
        symbolStyle: 'modern',
        wordingMode: 'oracle',
      });
      const implicit = printingManaDefaults({ ...face, wordingMode: 'oracle' });
      assert.deepEqual(modern, implicit, identity.set + ' implicit modern policy');
      return {
        ...identity,
        original,
        modern,
        originalGeometry: geometry(original),
        modernGeometry: geometry(modern),
      };
    });
  } finally {
    await server.close();
  }
}
const before = await sample(path.resolve(baseline)),
  after = await sample(root);
let originalChanges = 0;
for (let i = 0; i < faces.length; i++)
  if (JSON.stringify(before[i].original) !== JSON.stringify(after[i].original)) originalChanges++;
const differences = (rs) =>
  rs.filter((r) => JSON.stringify(r.originalGeometry) !== JSON.stringify(r.modernGeometry));
assert.equal(originalChanges, 0, 'Original printing defaults changed');
assert.equal(differences(after).length, 0, 'A symbol-era switch still drops frame geometry');
const report = {
  schema: 1,
  source: {
    beforeRenderer: await sourceHash(path.join(path.resolve(baseline), 'games/magic/src')),
    afterRenderer: await sourceHash(path.join(root, 'games/magic/src')),
    toolHash: hash(await fs.readFile(fileURLToPath(import.meta.url))),
    ledgerHash: hash(
      await fs.readFile(path.join(root, 'games/magic/fixtures/accuracy/calibration-progress.json')),
    ),
    inventoryHash: hash(
      await fs.readFile(path.join(root, 'games/magic/fixtures/accuracy/rollout-inventory.json')),
    ),
  },
  scope:
    'All ordinary sets in the frozen inventory. Full calibration variants plus synthetic palette/type controls for small sets. This proves configuration coverage, not calibrated scan accuracy.',
  sets: sets.size,
  variants: faces.length,
  originalChanges,
  beforeDifferences: differences(before).length,
  afterDifferences: 0,
  affectedSets: [...new Set(differences(before).map((r) => r.set))],
  inputsHash: hash(JSON.stringify(faces)),
  rows: before.map((b, i) => ({
    ...b,
    afterModern: after[i].modern,
    afterModernGeometry: after[i].modernGeometry,
  })),
};
await fs.writeFile(output, JSON.stringify(report, null, 2) + '\n', { flag: 'wx' });
console.log({
  sets: report.sets,
  variants: report.variants,
  beforeDifferences: report.beforeDifferences,
  afterDifferences: 0,
  originalChanges,
  affectedSets: report.affectedSets,
});
