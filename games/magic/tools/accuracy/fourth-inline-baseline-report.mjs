import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { hash, writeJson } from './common.mjs';

const [studyFile, out] = process.argv.slice(2);
assert(out, 'Use BASELINE_STUDY NEW_REPORT');
const raw = await fs.readFile(studyFile);
const study = JSON.parse(raw);
assert.equal(study.status, 'shared-inline-whole-symbol-baseline-study-not-adopted');
assert.equal(study.rows.length, 112);
assert.equal(new Set(study.rows.map((r) => r.id)).size, 112);
assert.equal(study.rows.filter((r) => r.basic).length, 15);
assert(study.rows.every((r) => r.nativeHash && r.poseHash && r.referenceHash));
assert(study.search.dy.includes(0));

const observations = study.rows.flatMap((r) =>
  r.symbols.map((s, index) => ({ ...s, id: r.id, name: r.name, basic: r.basic, index })),
);
for (const s of observations) {
  assert(s.size > 0 && Number.isFinite(s.size));
  assert.equal(s.candidates.length, study.search.dy.length);
  assert.deepEqual(
    s.candidates.map((c) => c.parameters.dy),
    study.search.dy,
  );
  assert(s.candidates.every((c) => c.score >= 0 && c.score <= 1));
}
const mean = (v) => v.reduce((a, b) => a + b, 0) / v.length;
function summarize(samples) {
  const baseline = samples.map((s) => s.candidates.find((c) => c.parameters.dy === 0).score);
  const candidates = study.search.dy.map((dy, index) => {
    const scores = samples.map((s) => s.candidates[index].score);
    const byCard = new Map();
    samples.forEach((s, i) => {
      if (!byCard.has(s.id))
        byCard.set(s.id, { id: s.id, name: s.name, basic: s.basic, before: [], after: [] });
      byCard.get(s.id).before.push(baseline[i]);
      byCard.get(s.id).after.push(scores[i]);
    });
    const cards = [...byCard.values()].map((c) => ({
      id: c.id,
      name: c.name,
      basic: c.basic,
      before100: mean(c.before) * 100,
      after100: mean(c.after) * 100,
      delta100: (mean(c.after) - mean(c.before)) * 100,
    }));
    return {
      dy,
      before100: mean(baseline) * 100,
      after100: mean(scores) * 100,
      cardMeanBefore100: mean(cards.map((c) => c.before100)),
      cardMeanAfter100: mean(cards.map((c) => c.after100)),
      gains: scores.filter((s, i) => s > baseline[i] + 1e-12).length,
      losses: scores.filter((s, i) => s < baseline[i] - 1e-12).length,
      worstLosses: cards
        .filter((c) => c.delta100 < 0)
        .sort((a, b) => a.delta100 - b.delta100)
        .slice(0, 8),
      cards,
    };
  });
  return {
    cards: new Set(samples.map((s) => s.id)).size,
    occurrences: samples.length,
    occurrenceWinnerDy: [...candidates].sort((a, b) => b.after100 - a.after100)[0].dy,
    cardWinnerDy: [...candidates].sort((a, b) => b.cardMeanAfter100 - a.cardMeanAfter100)[0].dy,
    candidates,
  };
}
const groups = {};
for (const scope of ['all', 'basics', 'nonbasics']) {
  const scoped = observations.filter(
    (s) => scope === 'all' || (scope === 'basics' ? s.basic : !s.basic),
  );
  groups[scope] = { combined: summarize(scoped) };
  for (const symbol of ['T', 'W', 'U', 'B', 'R', 'G']) {
    const selected = scoped.filter((s) => s.symbol === symbol);
    if (selected.length) groups[scope][symbol] = summarize(selected);
  }
}
const sizes = {};
for (const size of [...new Set(observations.map((s) => s.size))].sort((a, b) => a - b))
  sizes[size] = summarize(observations.filter((s) => s.size === size));

await writeJson(out, {
  schema: 1,
  status: 'inline-baseline-diagnostic-not-adopted',
  scope:
    'Regional filled-ink and symmetric-edge index. Whole circles and glyphs move together; words, circle size, palette and scan pose remain fixed. Occurrence-weighted and card-weighted means are both reported. No whole-card score or production default claim.',
  rendererHash: study.rendererHash,
  inputHash: study.inputHash,
  studyHash: hash(raw),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  groups,
  sizes,
});
for (const [scope, items] of Object.entries(groups))
  for (const [symbol, g] of Object.entries(items)) {
    const best = g.candidates.find((c) => c.dy === g.cardWinnerDy);
    console.log(
      scope,
      symbol,
      g.cards,
      g.occurrences,
      'dy',
      best.dy,
      best.cardMeanBefore100.toFixed(2),
      '->',
      best.cardMeanAfter100.toFixed(2),
      'occ gains/losses',
      best.gains,
      best.losses,
    );
  }
