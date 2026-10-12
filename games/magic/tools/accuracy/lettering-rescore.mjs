import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, writeJson, outputRoot, hash } from './common.mjs';
import { normalize, cropGray } from './pixels.mjs';
import { compareLettering } from './lettering-metrics.mjs';
import { median } from './metrics.mjs';

const base = path.join(outputRoot, '3ed');
const capture = await readJson(path.join(base, 'revised-dense/capture.json'));
for (const stage of ['style', 'effect', 'titleSize']) {
  const directory = path.join(base, `lettering-development-${stage}`);
  const bytes = await readFile(path.join(directory, 'trial.json')),
    trial = JSON.parse(bytes);
  for (const card of trial.results) {
    const original = capture.results.find((c) => c.id === card.id);
    const scan = await readFile(path.join(base, 'revised-dense', original.images.reference.file));
    assert.equal(hash(scan), card.referenceHash);
    const reference = normalize(PNG.sync.read(scan));
    for (const score of card.scores) {
      const png = await readFile(path.join(directory, score.file));
      assert.equal(hash(png), score.sha256);
      const rendered = normalize(PNG.sync.read(png));
      score.regions = score.regions.map(({ id, rect }) => {
        const a = cropGray(reference, rect),
          b = cropGray(rendered, rect);
        return { id, rect, ...compareLettering(a.gray, b.gray, a.width, a.height) };
      });
    }
  }
  trial.summary = trial.summary.map((s) => {
    const rows = trial.results
      .map((r) => ({
        name: r.name,
        before: r.scores
          .find((v) => v.candidate === 'control' && v.tier === s.tier)
          .regions.find((v) => v.id === s.region),
        after: r.scores
          .find((v) => v.candidate === s.candidate && v.tier === s.tier)
          .regions.find((v) => v.id === s.region),
      }))
      .filter((r) => r.before && r.after);
    return {
      ...s,
      medianF1: median(rows.map((r) => r.after.edgeF1)),
      medianCensus: median(rows.map((r) => r.after.censusSimilarity).filter((v) => v !== null)),
      medianDelta: median(rows.map((r) => r.after.edgeF1 - r.before.edgeF1)),
      gains: rows.filter((r) => r.after.edgeF1 > r.before.edgeF1 + 0.02).map((r) => r.name),
      regressions: rows.filter((r) => r.after.edgeF1 < r.before.edgeF1 - 0.02).map((r) => r.name),
    };
  });
  trial.sourceTrialHash = hash(bytes);
  trial.metricHash = hash(await readFile(new URL('./lettering-metrics.mjs', import.meta.url)));
  trial.metric = 'mean of separate dark/light boundary F1; paired census retains polarity';
  await writeJson(path.join(directory, 'paired-trial.json'), trial);
  console.log(`Rescored ${stage}`);
}
