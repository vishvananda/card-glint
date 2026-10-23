import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import { gunzipSync } from 'node:zlib';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { modernRulesStudyPlugin } from '../games/magic/tools/accuracy/modern-rules-study-plugin.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
});
try {
  const { orphanParagraphCap } = await server.ssrLoadModule(
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
