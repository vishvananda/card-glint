import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { printingQuotes } from '../games/magic/tools/accuracy/modern-rules-typography-study.mjs';
import { validateRulesNativePlan } from '../games/magic/tools/accuracy/modern-rules-native-plan.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { modernRulesStudyPlugin } from '../games/magic/tools/accuracy/modern-rules-study-plugin.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { orphanParagraphCap, orphanParagraphs } = await server.ssrLoadModule(
    '/games/magic/tools/accuracy/modern-rules-orphan-study.mjs',
  );
  const context = {
    font: 'initial',
    textRendering: 'auto',
    fontKerning: 'auto',
    letterSpacing: '2px',
    states: [],
    save() {
      this.states.push([this.font, this.textRendering, this.fontKerning, this.letterSpacing]);
    },
    restore() {
      [this.font, this.textRendering, this.fontKerning, this.letterSpacing] = this.states.pop();
    },
    measureText(text) {
      const size = Number(/([0-9.]+)px/.exec(this.font)[1]),
        width = text.length * size * 0.5;
      return {
        width,
        actualBoundingBoxAscent: size * 0.8,
        actualBoundingBoxDescent: size * 0.2,
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: width,
      };
    },
  };
  const paragraph = (text, extra = {}) => ({ role: 'rules', runs: [{ text }], ...extra });
  const typography = { fractionalMetrics: true, textWidth: 1 };
  const opening = paragraph('Draw three cards, then discard a card.');
  const activated = paragraph('{2}: Put a card on the bottom of your library.');
  const keyword = paragraph('Flying');
  const caption = paragraph('A deliberately short caption.', { role: 'flavor' });
  assert.deepEqual(orphanParagraphs([opening, caption], 'first-prose'), [opening]);
  assert.deepEqual(orphanParagraphs([keyword, opening], 'first-prose'), []);
  assert.deepEqual(orphanParagraphs([activated, opening], 'first-prose'), []);
  assert.deepEqual(
    orphanParagraphs(
      [paragraph(['First line.', 'Second line.'].join(String.fromCharCode(10)))],
      'first-prose',
    ),
    [],
  );
  assert.deepEqual(orphanParagraphs([opening, activated, caption], 'rules'), [opening, activated]);
  assert.deepEqual(orphanParagraphs([opening, activated], 'single-rules'), []);
  assert.deepEqual(orphanParagraphs([opening, caption], 'single-rules'), [opening]);
  assert.throws(() => orphanParagraphs([], 'unknown'), /Invalid orphan paragraph scope/);

  const cap = (paragraphs, width = 125) =>
    orphanParagraphCap(context, paragraphs, { width }, 20, typography, 0.25);
  assert.equal(cap([paragraph('aaaaa aaaaa')]), 20);
  assert.equal(cap([paragraph('aaaaa aaaaa a')]), 19);
  assert.equal(
    cap([paragraph('aaaaa aaaaa a')], 115),
    20,
    'Unresolved orphan must retain the prior size',
  );
  assert.equal(cap([paragraph('aaaaa aaaaa a', { align: 'right' })]), 20);
  assert.equal(
    cap([
      paragraph('aaaaa aaaaa a', {
        role: 'flavor',
        runs: [{ text: 'aaaaa aaaaa a', italic: true }],
      }),
    ]),
    19,
  );
  assert.equal(
    cap([paragraph('aaaaa aaaaa'), paragraph('aaaaa aaaaa a')]),
    19,
    'Use one shared cap for the whole block',
  );
  assert.deepEqual(
    [
      context.font,
      context.textRendering,
      context.fontKerning,
      context.letterSpacing,
      context.states.length,
    ],
    ['initial', 'auto', 'auto', '2px', 0],
  );
  const measure = context.measureText;
  context.measureText = () => {
    throw Error('Font failure');
  };
  assert.throws(() => cap([paragraph('aaaaa')]), /Font failure/);
  context.measureText = measure;
  assert.equal(context.states.length, 0);
  assert.equal(context.font, 'initial');
  for (const fill of [0, -0.1, 0.46, Infinity, NaN])
    assert.throws(
      () => orphanParagraphCap(context, [], { width: 125 }, 20, typography, fill),
      /Invalid orphan/,
    );
  // Injection must produce actual newlines and remain explicitly proposal-only.
  const source = await readFile('games/magic/src/presentation/rules-paint.ts', 'utf8');
  const result = modernRulesStudyPlugin().transform(source, '/presentation/rules-paint.ts').code;
  assert(
    result.startsWith(
      "import { orphanParagraphCap } from '/games/magic/tools/accuracy/modern-rules-orphan-study.mjs';\n",
    ),
  );
  assert(result.includes('if (study.orphanFill && calibration)'));
  assert(!result.includes(';\\n'));
  assert(!source.includes('orphanParagraphCap'));
  const layoutSource = await readFile('games/magic/src/presentation/rules-layout.ts', 'utf8');
  const layoutProposal = modernRulesStudyPlugin().transform(
    layoutSource,
    '/presentation/rules-layout.ts',
  ).code;
  assert(layoutProposal.includes('typography.fractionalMetrics ?'));
  assert.equal([...layoutProposal.matchAll(/paragraphWidth,/g)].length, 2);
  assert(!layoutSource.includes('roleStudy'));
} finally {
  await server.close();
}
console.log(
  'Orphan proposal: bounded shared cap, actual wrap advances, flavor participation, unresolved/right-aligned preservation, Canvas error restoration and proposal-only injection pass.',
);

const directory = 'games/magic/fixtures/accuracy/m21/';
const review = JSON.parse(await readFile(directory + 'ordinary-size-and-orphan-trials.json'));
const compressed = await readFile(directory + review.evidence.file);
assert.equal(hash(compressed), review.evidence.sha256);
const raw = gunzipSync(compressed);
assert.equal(hash(raw), review.evidence.contentSha256);
const { datasets } = JSON.parse(raw);
assert.equal(review.decision, 'not-adopted');
for (const data of Object.values(datasets)) {
  assert.equal(data.rows.length, 297);
  assert.equal(new Set(data.rows.map((row) => row.id)).size, 297);
  assert.deepEqual(data.faults, []);
  assert.equal(data.rows.filter((row) => row.trials).length, 268);
  assert.equal(data.definition.rendererHash, review.renderer);
  for (const row of data.rows.filter((row) => row.trials)) {
    assert.equal(row.trials.length, data.parameters.candidates.length);
    for (const trial of row.trials) {
      assert.equal(trial.invalid, false);
      assert(Number.isFinite(trial.score) && trial.score >= 0 && trial.score <= 1);
    }
  }
}
const baseline = new Map(datasets.globalCaps.rows.map((row) => [row.id, row]));
for (const row of datasets.orphanCaps.rows) {
  const old = baseline.get(row.id);
  for (const field of ['inputHash', 'referenceHash', 'nativeFaceHash', 'normalizedHash', 'status'])
    assert.equal(row[field], old[field]);
  if (row.trials) assert.deepEqual(row.trials[0], old.trials[0]);
}
const current = review.summary.globalCaps[0].mean100;
assert(review.summary.globalCaps.slice(1).every((candidate) => candidate.mean100 < current));
const smallest = review.summary.orphanCaps.find(
  (candidate) => candidate.candidate.id === 'orphan0.15',
);
assert.equal(smallest.improved, 5);
assert.equal(smallest.regressed, 4);
assert.equal(smallest.worst[0].name, 'Vryn Wingmare');
assert(smallest.worst[0].delta100 < -68);
console.log(
  'Complete trials: 268/268 current controls exact; all297 sources retained; seven worse global caps and severe orphan-rule regressions remain explicit and unadopted.',
);

assert.equal(printingQuotes('"A card," she said.'), '“A card,” she said.');
assert.equal(printingQuotes("It's the card's text."), 'It’s the card’s text.');
assert.equal(printingQuotes('Already “curved” text.'), 'Already “curved” text.');
assert.equal(printingQuotes('("Quoted.")'), '(“Quoted.”)');
assert.equal(printingQuotes('First line.\n"Second line."'), 'First line.\n“Second line.”');
const digest = 'a'.repeat(64);
const proposalInputs = {
  set: 'm21',
  entries: Array.from({ length: 297 }, (_, i) => ({
    id: String(i),
    face: { wordingMode: 'original', typeLine: 'Creature' },
  })),
};
const plan = {
  schema: 1,
  set: 'm21',
  inputsHash: digest,
  rendererHash: digest,
  selectionPolicy: 'Diagnostic native validation only',
  adjustments: {
    0: {
      inputHash: hash(JSON.stringify(proposalInputs.entries[0].face)),
      adjustment: { maximumSize: 23.75, smartQuotes: true, ignoreLegacyLineBudget: true },
    },
  },
};
assert.equal(validateRulesNativePlan(plan, proposalInputs, digest, digest), plan);
for (const change of [
  (p) => {
    p.inputsHash = 'b'.repeat(64);
  },
  (p) => {
    p.rendererHash = 'b'.repeat(64);
  },
  (p) => {
    p.adjustments['0'].inputHash = 'b'.repeat(64);
  },
  (p) => {
    p.adjustments['missing'] = p.adjustments['0'];
  },
  (p) => {
    p.adjustments['0'].adjustment.maximumSize = NaN;
  },
  (p) => {
    p.adjustments['0'].adjustment.maximumSize = 26.25;
  },
  (p) => {
    p.adjustments['0'].adjustment.dx = 0.25;
  },
  (p) => {
    p.adjustments['0'].adjustment.smartQuotes = 'true';
  },
]) {
  const bad = structuredClone(plan);
  change(bad);
  assert.throws(() => validateRulesNativePlan(bad, proposalInputs, digest, digest));
}
for (const typeLine of ['Basic Land — Plains', 'Planeswalker — Teferi', 'Enchantment — Saga']) {
  const badInputs = structuredClone(proposalInputs),
    next = structuredClone(plan);
  badInputs.entries[0].face.typeLine = typeLine;
  next.adjustments['0'].inputHash = hash(JSON.stringify(badInputs.entries[0].face));
  assert.throws(
    () => validateRulesNativePlan(next, badInputs, digest, digest),
    /ordinary nonbasic/,
  );
}
const oracleInputs = structuredClone(proposalInputs);
oracleInputs.entries[0].face.wordingMode = 'oracle';
assert.throws(() => validateRulesNativePlan(plan, oracleInputs, digest, digest));
console.log(
  'Native text proposals: exact Original recipe/source binding, ordinary-only scope, no per-card offsets, printing punctuation and invalid-knob rejection pass.',
);
