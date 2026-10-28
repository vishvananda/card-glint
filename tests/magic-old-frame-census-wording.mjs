import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
import { originalFields } from '../games/magic/tools/accuracy/old-frame-set-inputs.mjs';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  const { withCardWording } = await server.ssrLoadModule('/games/magic/src/index.ts');
  const entryFor = (set, id, r) => ({
    id,
    card: {
      id,
      set,
      name: r.name,
      collector_number: r.collectorNumber,
      type_line: 'Creature — Human Soldier',
      oracle_text: 'Unprinted Oracle rule',
      colors: [],
      layout: 'normal',
      border_color: 'black',
      frame: '1997',
      rarity: 'common',
      flavor_text: 'Preserve caller flavor',
    },
    reference: { sha256: r.referenceHash },
  });
  for (const set of ['mir', 'ons']) {
    const gaps = JSON.parse(
      await fs.readFile('games/magic/fixtures/accuracy/' + set + '/source-gap-review.json'),
    );
    for (const [id, r] of Object.entries(gaps.cards)) {
      const e = entryFor(set, id, r),
        before = JSON.stringify(e);
      const fields = originalFields(e.card, undefined, undefined, r);
      const candidate = { ...r, typeLine: fields.typeLine, rulesText: fields.rulesText };
      // The actual census adapter reparses provider flavor after rules-only reviews.
      delete candidate.paragraphs;
      const face = presentation(e, { [id]: candidate }).face;
      assert.equal(face.typeLine, r.typeLine);
      assert.equal(
        face.rulesParagraphs
          .filter((p) => p.role === 'rules')
          .map((p) => p.runs.map((r) => r.text).join(''))
          .join('\n'),
        r.rulesText,
      );
      assert.equal(
        face.rulesParagraphs
          .filter((p) => p.role === 'flavor')
          .map((p) => p.runs.map((r) => r.text).join(''))
          .join('\n'),
        e.card.flavor_text,
      );
      const oracle = { typeLine: e.card.type_line, rulesText: e.card.oracle_text };
      const words = { original: face, oracle },
        saved = JSON.stringify(words);
      const original = withCardWording(face, words, 'original', {
        rulesAlignment: 'original',
        symbolStyle: 'original',
      });
      assert.equal(original.typeLine, r.typeLine);
      assert.deepEqual(original.rulesParagraphs, face.rulesParagraphs);
      const modern = withCardWording(face, words, 'oracle', { rulesAlignment: 'original' });
      assert.equal(modern.typeLine, oracle.typeLine);
      assert.equal(modern.rulesText, oracle.rulesText);
      assert.equal(JSON.stringify(words), saved);
      assert.equal(JSON.stringify(e), before);
      assert.throws(
        () => presentation({ ...e, reference: { sha256: '0'.repeat(64) } }, { [id]: candidate }),
        /stale/,
      );
    }
    const types = JSON.parse(
      await fs.readFile('games/magic/fixtures/accuracy/' + set + '/type-printing-review.json'),
    );
    assert.equal(Object.keys(types.cards).length, set === 'mir' ? 351 : 350);
    for (const [id, r] of Object.entries(types.cards)) {
      const e = entryFor(set, id, r);
      const fields = originalFields(e.card, undefined, { originalText: 'Caller original body' }, r);
      const face = presentation(e, {
        [id]: { ...r, typeLine: fields.typeLine, rulesText: fields.rulesText },
      }).face;
      assert.equal(face.typeLine, r.typeLine, r.name);
      assert.equal(
        face.rulesParagraphs
          .filter((p) => p.role === 'rules')
          .map((p) => p.runs.map((r) => r.text).join(''))
          .join('\n'),
        'Caller original body',
      );
      assert.equal(e.card.type_line, 'Creature — Human Soldier');
    }
  }
} finally {
  await server.close();
}
console.log(
  'Calibration-only Mirage/Onslaught reviews retain exact types and empty rules, preserve provider flavor and Oracle, reject stale scans, and remain separate from published defaults.',
);
