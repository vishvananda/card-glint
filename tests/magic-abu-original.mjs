import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { createServer } from './magic-vite.mjs';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';
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
    const headers = JSON.parse(
      gunzipSync(await readFile('games/magic/fixtures/accuracy/abu-mana-recheck/headers.json.gz')),
    ).rows.filter((r) => r.set === set);
    const costs = Object.fromEntries(headers.map((r) => [r.id, { ...r, manaSymbols: r.observed }]));
    assert.equal(Object.keys(costs).length, set === 'lea' ? 295 : 302);
    for (const [id, row] of Object.entries(costs)) {
      const input = {
        original: { typeLine: 'Artifact', rulesText: 'Original rules', manaSymbols: row.before },
        oracle: { typeLine: 'Artifact', rulesText: 'Oracle rules', manaSymbols: ['9'] },
      };
      const resolved = resolvePrintingWording(id, input, { referenceSha256: row.referenceHash });
      assert.deepEqual(resolved.wordings.original.manaSymbols, row.manaSymbols, row.name);
      assert.deepEqual(resolved.wordings.oracle.manaSymbols, ['9']);
      assert.deepEqual(input.original.manaSymbols, row.before, 'Do not mutate provider wording');
      const adapted = presentation({
        card: { id, name: row.name, set, mana_cost: row.before.map((s) => `{${s}}`).join('') },
        reference: { sha256: row.referenceHash },
      });
      assert.deepEqual(
        adapted.face.manaSymbols,
        row.manaSymbols,
        'Review application uses the same original cost',
      );
    }
    const tomb = Object.entries(costs).find(([, r]) => r.name === 'Cyclopean Tomb');
    assert.deepEqual(tomb[1].manaSymbols, set === 'lea' ? [] : ['4']);
    for (const name of ['Orcish Artillery', 'Orcish Oriflamme']) {
      const row = Object.values(costs).find((r) => r.name === name);
      assert.deepEqual(
        row.manaSymbols,
        set === 'lea' ? ['1', 'R'] : name === 'Orcish Artillery' ? ['1', 'R', 'R'] : ['3', 'R'],
      );
    }
    const tombFace = withCardWording(
      { name: 'Cyclopean Tomb', setCode: set, manaSymbols: ['4'] },
      resolvePrintingWording(tomb[0], {
        original: { typeLine: 'Artifact', rulesText: 'Original rules', manaSymbols: ['4'] },
        oracle: { typeLine: 'Artifact', rulesText: 'Oracle rules', manaSymbols: ['4'] },
      }).wordings,
      'original',
    );
    assert.deepEqual(
      tombFace.manaSymbols,
      tomb[1].manaSymbols,
      'An absent printed cost must not fall back to Oracle',
    );
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
