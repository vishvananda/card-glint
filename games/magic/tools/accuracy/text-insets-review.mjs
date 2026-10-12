import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { readJson, writeJson, hash, outputRoot, fixtureRoot, atomicWrite } from './common.mjs';
import { normalize, readPng, savePng, cropGray } from './pixels.mjs';
import { compareRegion, median } from './metrics.mjs';
import { mainPage } from './main-page.mjs';
import { regions } from './regions.mjs';

const out = path.join(outputRoot, 'text-insets-review');
const examples = [],
  sets = [];
const notes = {
  'Mtenda Herder':
    'Same fonts, with 10 more canonical pixels allowed on the right. “the”, “herded.” and “turn.)” now stay on their printed lines. The gray bevel is baked into the existing frame asset and remains flagged.',
  'Uncle Istvan':
    'The long Fourth Edition text block moves inside the panel: left edge 72px, width 344px. Paragraph spacing now follows the print.',
  'Angry Mob':
    'Both rendered columns use the original printed wording from MTGJSON, verified against this scan, and the printed Summon Mob type. This comparison isolates geometry from wording changes.',
  'Fellwar Stone':
    'Artifact transfer example using the same Fourth Edition block policy. Original wording is identical on both sides. Further glyph and text-size differences remain visible.',
};
for (const set of ['mir', '4ed', 'tmp']) {
  const beforeRun = set === '4ed' ? 'text-insets-before' : 'retro-basics';
  const beforeRoot = path.join(outputRoot, set, beforeRun);
  const afterRoot = path.join(outputRoot, set, 'text-insets');
  const before = await readJson(path.join(beforeRoot, 'capture.json'));
  const after = await readJson(path.join(afterRoot, 'capture.json'));
  const alignment = await readJson(path.join(fixtureRoot, set, 'alignment.json'));
  assert.equal(before.browser, after.browser);
  assert.equal(before.fontStylesheetHash, after.fontStylesheetHash);
  const rows = [];
  for (const card of after.results) {
    const prior = before.results.find((c) => c.id === card.id);
    if (
      !prior ||
      card.issue ||
      prior.issue ||
      prior.inputHash !== card.inputHash ||
      card.contentStatus !== 'scan-reviewed'
    )
      continue;
    assert.equal(prior.images.reference.sha256, card.images.reference.sha256);
    const transform = alignment.frameFamilies[card.frame]?.transform ?? {};
    const referenceFile = path.join(afterRoot, card.images.reference.file);
    assert.equal(hash(await readFile(referenceFile)), card.images.reference.sha256);
    const reference = normalize(await readPng(referenceFile), transform);
    const tiers = {};
    for (const tier of ['inspect', 'table']) {
      const scores = [];
      for (const [root, entry] of [
        [beforeRoot, prior],
        [afterRoot, card],
      ]) {
        const file = path.join(root, entry.images[tier].file);
        assert.equal(hash(await readFile(file)), entry.images[tier].sha256);
        const rendered = normalize(await readPng(file));
        scores.push(
          [regions(card).find((r) => r.id === 'body').rect, [59, 403, 379, 198]].map((rect) => {
            const a = cropGray(reference, rect),
              b = cropGray(rendered, rect);
            return compareRegion(a.gray, b.gray, a.width, a.height).edgeF1?.[1] ?? null;
          }),
        );
      }
      tiers[tier] = { previous: scores[0], current: scores[1] };
    }
    rows.push({
      id: card.id,
      name: card.name,
      number: card.collectorNumber,
      inputHash: card.inputHash,
      referenceHash: card.images.reference.sha256,
      tiers,
    });
    if (notes[card.name]) {
      const prefix = `${set}-${card.collectorNumber}`;
      const images = {
        scan: `${prefix}.scan.png`,
        main: `${prefix}.before.png`,
        branch: `${prefix}.after.png`,
      };
      await savePng(path.join(out, images.scan), reference);
      await atomicWrite(
        path.join(out, images.main),
        await readFile(path.join(beforeRoot, prior.images.inspect.file)),
      );
      await atomicWrite(
        path.join(out, images.branch),
        await readFile(path.join(afterRoot, card.images.inspect.file)),
      );
      examples.push({
        set,
        id: card.id,
        name: card.name,
        number: card.collectorNumber,
        source: card.source,
        inputHash: card.inputHash,
        referenceHash: card.images.reference.sha256,
        contentStatus: card.contentStatus,
        note: notes[card.name],
        images,
        captures: { main: { fonts: before.fonts }, branch: { fonts: after.fonts } },
        scores: [
          { region: 'body', values: [tiers.inspect.previous[0], tiers.inspect.current[0]] },
          {
            region: 'expanded body',
            values: [tiers.inspect.previous[1], tiers.inspect.current[1]],
          },
        ],
      });
    }
  }
  const summary = {};
  for (const tier of ['inspect', 'table'])
    summary[tier] = {
      medianBefore: median(rows.map((r) => r.tiers[tier].previous[1])),
      medianAfter: median(rows.map((r) => r.tiers[tier].current[1])),
      gains: rows
        .filter((r) => r.tiers[tier].current[1] > r.tiers[tier].previous[1] + 0.02)
        .map((r) => r.name),
      regressions: rows
        .filter((r) => r.tiers[tier].current[1] < r.tiers[tier].previous[1] - 0.02)
        .map((r) => r.name),
    };
  sets.push({
    set,
    beforeRun,
    beforeRenderer: before.rendererHash,
    afterRenderer: after.rendererHash,
    browser: after.browser,
    fontStylesheetHash: after.fontStylesheetHash,
    alignmentHash: hash(JSON.stringify(alignment)),
    afterCaptured: after.results.length,
    afterFailures: after.results
      .filter((c) => c.issue)
      .map((c) => ({ name: c.name, issue: c.issue })),
    pairedReviewed: rows.length,
    changedInputs: after.results.filter((c) => {
      const p = before.results.find((p) => p.id === c.id);
      return p && p.inputHash !== c.inputHash;
    }).length,
    summary,
    rows,
  });
}
const report = {
  schemaVersion: 1,
  headline: 'Printed text: scan / before / corrected',
  description:
    'Width, inset and paragraph-spacing fixes using identical printed wording and fonts on both sides. Alignment remains fixed by frame/set. The existing frame assets are unchanged. These are reviewed development examples, not fresh holdouts.',
  beforeLabel: 'Before these text fixes',
  scoreLabel: 'before → corrected',
  note: 'Body F1 uses the historical window; expanded-body F1 includes the added right margin and the top of Fourth Edition long text. Aggregates below include alignment-uncertain pairs and are development diagnostics, not a held-out accuracy claim. Changed inputs are excluded. Production capture is at both tiers.',
  examples,
  sets,
};
await writeJson(path.join(out, 'comparison.json'), report);
await writeJson(path.join(fixtureRoot, 'text-insets-measurement.json'), {
  ...report,
  examples: examples.map(({ images, captures, ...c }) => c),
});
await mainPage(report, out);
console.log(
  JSON.stringify(
    sets.map(({ rows, ...s }) => s),
    null,
    2,
  ),
);
