import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  const { resolvePrintingWording, withCardWording } = await server.ssrLoadModule(
    '/games/magic/src/index.ts',
  );
  const { retroFrameAsset } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const { resolveCardProfile } = await server.ssrLoadModule(
    '/games/magic/src/presentation/profile.ts',
  );
  for (const set of ['lea', 'leb']) {
    const rows = JSON.parse(
      await readFile(`games/magic/fixtures/accuracy/${set}/annotations-empty-rules.json`),
    ).cards;
    for (const [id, row] of Object.entries(rows).filter(([, r]) =>
      ['Wall of Wood', 'Wall of Stone'].includes(r.name),
    )) {
      const oracle = {
        typeLine: 'Creature — Wall',
        rulesText: "Defender (This creature can't attack.)",
      };
      const original = { typeLine: 'Summon Wall', rulesText: oracle.rulesText };
      const resolved = resolvePrintingWording(
        id,
        { original, oracle },
        { referenceSha256: row.referenceHash },
      );
      assert.equal(resolved.wordings.original.rulesText, row.flavorText);
      assert.equal(resolved.wordings.oracle.rulesText, oracle.rulesText);
      const face = withCardWording(
        { name: row.name, setCode: set, colors: [row.name === 'Wall of Wood' ? 'G' : 'R'] },
        resolved.wordings,
        'original',
      );
      assert(
        !face.rulesParagraphs.some((p) => p.role === 'rules' && p.runs.some((r) => r.text.trim())),
      );
    }
    const aura = withCardWording(
      { name: 'Wild Growth', setCode: set, colors: ['G'] },
      {
        original: { typeLine: 'Enchant Land', rulesText: 'Printed rules' },
        oracle: { typeLine: 'Enchantment — Aura', rulesText: 'Oracle rules' },
      },
      'original',
    );
    assert.equal(resolveCardProfile(aura).land, false);
    assert(retroFrameAsset(aura).endsWith('/abu/g.png'));
    assert(
      retroFrameAsset({ ...aura, canonicalTypeLine: undefined, land: undefined }).endsWith(
        '/abu/g.png',
      ),
      'Bare original aura wording must not select a land plate',
    );
    const corrections = JSON.parse(
      await readFile(`games/magic/fixtures/accuracy/${set}/annotations-text-outliers.json`),
    ).cards;
    const [id, row] = Object.entries(corrections).find(([, r]) => r.name === 'Drain Life');
    const original = {
        typeLine: 'Sorcery',
        rulesText: 'Original rules',
        manaSymbols: ['X', '1', 'B'],
      },
      oracle = { ...original, rulesText: 'Oracle rules' };
    const resolved = resolvePrintingWording(
      id,
      { original, oracle },
      { referenceSha256: row.referenceHash },
    );
    assert.deepEqual(resolved.wordings.original.manaSymbols, ['1', 'B']);
    assert.deepEqual(resolved.wordings.oracle.manaSymbols, ['X', '1', 'B']);
  }
  console.log('ABU original-only reminders, costs and Enchant Land semantics passed.');
} finally {
  await server.close();
}
