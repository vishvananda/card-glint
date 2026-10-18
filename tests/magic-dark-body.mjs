import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
import { darkBodyProof, preDarkBodySource } from './magic-dark-body-source-guard.mjs';

const evidence = await darkBodyProof();
const validation = evidence.textScores['repeated-validation'];
assert.ok(validation.after > validation.before);
assert.ok(validation.filledAfter > validation.filledBefore);
assert.equal(validation.classChanges.length, 0);
assert.equal(validation.overflow, 0);
assert.equal(validation.regressions.length, 3, 'Retain substantial text regressions for review');
const wordingSource = 'games/magic/fixtures/accuracy/drk/annotations-text-outliers.json';
const current = JSON.parse(await readFile(wordingSource));
const before = JSON.parse(await preDarkBodySource(wordingSource));
for (const review of evidence.wording) {
  assert.equal(before.cards[review.id], undefined);
  delete current.cards[review.id];
}
assert.deepEqual(current, before, 'Unrelated original wording changed');

const file = 'games/magic/src/presentation/early-expansion-text.ts';
const virtual = 'games/magic/src/presentation/__dark-body-before.ts';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'dark-body-baseline',
      resolveId(id) {
        if (id.endsWith('/__dark-body-before.ts')) return path.resolve(virtual);
      },
      async load(id) {
        if (id === path.resolve(virtual)) return (await preDarkBodySource(file)).toString();
      },
    },
  ],
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => route.abort());
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async (wording) => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { earlyExpansionTextLayout: before } = await import(
      '/games/magic/src/presentation/__dark-body-before.ts'
    );
    const { earlyExpansionTextLayout: after } = await import(
      '/games/magic/src/presentation/early-expansion-text.ts'
    );
    const { resolvePrintingWording } = await import('/games/magic/src/printing/resolve.ts');
    const c = document.createElement('canvas').getContext('2d');
    const check = (ok, message) => {
      if (!ok) throw Error(message);
    };
    const paragraph = (text, extra = {}) => ({ role: 'rules', runs: [{ text }], ...extra });
    const short = [paragraph('Target creature gains flying.')];
    const long = [paragraph('Target creature gains flying until the end of the turn. '.repeat(6))];
    const compact = [
      paragraph('Target creature gains flying until the end of the turn. '.repeat(13)),
    ];
    const explicit = [paragraph('Keep this explicit alignment.', { align: 'right' })];
    const cases = [short, long, compact, explicit];
    const sizeClass = (size) => (size > 25 ? 'centered' : size < 20 ? 'compact' : 'regular');
    let compared = 0,
      unchanged = 0;
    for (const setCode of ['DRK', 'arn', 'atq'])
      for (const wordingMode of ['original', 'oracle'])
        for (const paragraphs of cases)
          for (const reference of cases.slice(0, 3)) {
            const face = { name: 'Body scope', typeLine: 'Summon Probe', setCode, wordingMode };
            const input = JSON.stringify({ face, paragraphs, reference });
            const a = before(c, face, paragraphs, reference),
              b = after(c, face, paragraphs, reference);
            check(
              sizeClass(a.size) === sizeClass(b.size),
              'Spacing changed the selected size class',
            );
            if (setCode !== 'DRK' || sizeClass(a.size) === 'centered') {
              check(
                JSON.stringify(a) === JSON.stringify(b),
                'Unrelated or centered layout changed',
              );
              unchanged++;
            }
            check(input === JSON.stringify({ face, paragraphs, reference }), 'Caller data mutated');
            compared++;
          }
    for (const change of [
      { setCode: 'lea' },
      { setCode: 'm21' },
      { frameTemplate: 'future' },
      { frameAssetFamily: 'seventh' },
      { frameStyle: 'modern' },
      { borderColor: 'white' },
      { layout: 'split' },
      { typeLine: 'Enchantment — Saga' },
    ]) {
      check(
        after(c, { name: 'Scope', setCode: 'drk', ...change }, short, short) === null,
        'Body escaped scope',
      );
    }
    for (const review of wording) {
      const input = {
        oracle: { typeLine: 'Creature', rulesText: 'Oracle rules.' },
        original: { typeLine: 'Summon Example', rulesText: review.before },
      };
      const saved = JSON.stringify(input);
      const resolved = resolvePrintingWording(review.id, input, {
        referenceSha256: review.referenceHash,
      });
      check(resolved.provenance.status === 'applied', 'Correction not applied');
      check(resolved.wordings.original.rulesText === review.rulesText, 'Wrong original colon');
      check(resolved.wordings.oracle.rulesText === input.oracle.rulesText, 'Oracle was changed');
      check(JSON.stringify(input) === saved, 'Resolver mutated input');
      check(
        resolvePrintingWording(review.id, input, { referenceSha256: '0'.repeat(64) }).provenance
          .status === 'reference-mismatch',
        'Scan mismatch accepted',
      );
    }
    return { compared, unchanged };
  }, evidence.wording);
  assert.equal(result.compared, 72);
  assert.ok(result.unchanged >= 48);
  console.log(
    'Dark body: 121 native prototypes, stable size classes, 278 unchanged controls and original-only wording corrections pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
