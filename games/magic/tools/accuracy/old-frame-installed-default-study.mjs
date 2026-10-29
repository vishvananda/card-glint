// Native default integration on the exact frozen scans, including target footer controls.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { fetchComponents } from './components.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { metricSourceGraph } from './module-graph.mjs';
const [study, beforeRoot, metricFile, out] = process.argv.slice(2);
assert(out, 'Use STUDY_DIRECTORY BEFORE_SOURCE_ROOT METRICS NEW_OUTPUT');
await fs.mkdir(out);
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const beforeHash = await sourceHash(path.join(beforeRoot, 'games/magic/src'));
const graph = await metricSourceGraph(path.resolve(metricFile));
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const batches = await Promise.all(
  ['default-three-donor-results-v5.json', 'default-three-donor-additions-v6.json'].map(async (f) =>
    JSON.parse(await fs.readFile(path.join(study, f))),
  ),
);
const sets = [];
for (const batch of batches) {
  assert.equal(batch.status, 'complete');
  for (const r of batch.rows) {
    assert.equal(r.returncode, 0);
    const directory = path.join(study, r.output);
    const raw = await fs.readFile(path.join(directory, 'study.json')),
      prior = JSON.parse(raw);
    assert.equal(prior.source.rendererHash, beforeHash);
    assert.deepEqual(prior.source.metric, graph);
    const file =
      r.set === 'scg'
        ? 'scg-inputs-v2.json'
        : ['itp', 'ath', 'rqs'].includes(r.set)
          ? r.set + '-frame-only-inputs-v2.json'
          : r.set + '-inputs.json';
    const ib = await fs.readFile(path.join(study, 'default-target-pilots-v1', file));
    assert.equal(hash(ib), prior.source.inputs);
    sets.push({ set: r.set, source: hash(raw), directory, prior, input: JSON.parse(ib) });
  }
}
assert.equal(sets.length, 34);
const entries = sets.flatMap((s) => s.input.entries);
const components = [
  ...sets.flatMap((s) => s.input.components),
  ...(await fetchComponents(entries, { offline: true }, (e) => e.face)),
];
const states = {};
for (const mode of ['before', 'after']) {
  const session = await openBrowser(
    { entries, components },
    { sourceRoot: mode === 'before' ? beforeRoot : root },
  );
  try {
    await session.page.evaluate(
      async (sets) => {
        const { loadMagicSet } = await import('/games/magic/src/data/load.ts');
        await Promise.all(sets.map((set) => loadMagicSet(set)));
      },
      sets.map((s) => s.set),
    );
    for (const group of sets) {
      const rows = [];
      for (const e of group.input.entries) {
        const old = group.prior.rows.find((r) => r.id === e.id);
        assert(old);
        const result = await session.page.evaluate(async (e) => {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const { earlyReprintFrame } = await import(
            '/games/magic/src/presentation/early-reprint-frame.ts'
          );
          const trace = [],
            draw = CanvasRenderingContext2D.prototype.fillText;
          CanvasRenderingContext2D.prototype.fillText = function (text, x, y, ...rest) {
            const s = String(text),
              m = this.getTransform(),
              px = (m.a * x + m.c * y + m.e) / 1.5,
              py = (m.b * x + m.d * y + m.f) / 1.5;
            if (
              py > 605 &&
              (/Wizards|Illus\.|©|™/.test(s) ||
                (e.face.artist && s.includes(e.face.artist)) ||
                (e.face.power != null &&
                  s === String(e.face.power) + '/' + String(e.face.toughness)))
            )
              trace.push({
                text: s,
                x: px,
                y: py,
                font: this.font,
                align: this.textAlign,
                baseline: this.textBaseline,
                fill: this.fillStyle,
                shadow: this.shadowColor,
                dx: this.shadowOffsetX,
                dy: this.shadowOffsetY,
              });
            return draw.call(this, text, x, y, ...rest);
          };
          let image;
          try {
            image = await composeCardTexture(
              { face: e.face, printingId: e.id, printedImage: null },
              'inspect',
              new AbortController().signal,
            );
            return {
              png: image.toDataURL().split(',')[1],
              trace,
              matched: !!earlyReprintFrame(e.face),
            };
          } finally {
            CanvasRenderingContext2D.prototype.fillText = draw;
            if (image) image.width = image.height = 0;
          }
        }, e);
        const png = Buffer.from(result.png, 'base64'),
          digest = hash(png);
        const file = mode + '-' + e.id + '.png';
        await fs.writeFile(path.join(out, file), png);
        if (mode === 'before') {
          if (old.variants) {
            const b = old.variants.current;
            assert.equal(hash(await fs.readFile(path.join(group.directory, b.file))), b.sha256);
            assert.equal(
              digest,
              b.sha256,
              e.name + ': current source differs from the frozen baseline',
            );
          }
          rows.push({
            id: e.id,
            name: e.name,
            material: e.material,
            sha256: digest,
            file,
            footer: result.trace,
          });
          continue;
        }
        const baseline = states[group.set].find((r) => r.id === e.id);
        assert.deepEqual(
          result.trace,
          baseline.footer,
          e.name + ': target footer wording/layout changed',
        );
        if (!result.matched)
          assert.equal(digest, baseline.sha256, e.name + ': unsupported class changed');
        const row = {
          id: e.id,
          name: e.name,
          material: e.material,
          file,
          sha256: digest,
          beforeHash: baseline.sha256,
          footerUnchanged: true,
          matched: result.matched,
          pose: old.pose,
        };
        if (old.variants) {
          const scanBytes = await fs.readFile(path.join(group.directory, old.id + '-scan.png'));
          assert.equal(hash(scanBytes), old.scanHash);
          const score = scoreRegions(
            normalize(PNG.sync.read(scanBytes)),
            normalize(PNG.sync.read(png)),
            e.card,
            {
              ...e.face,
              typeSource: 'MTGJSON original type candidate',
              rulesSource: 'MTGJSON original text',
            },
          );
          let total = 0,
            weight = 0;
          for (const [role, w] of Object.entries(group.prior.selectionWeights)) {
            const c = score.components[role];
            if (c?.eligible && Number.isFinite(c.score)) {
              total += w * c.score;
              weight += w;
            }
          }
          row.score100 = weight ? (100 * total) / weight : null;
          row.beforeScore100 = old.variants.current.score100;
          row.components = Object.fromEntries(
            Object.entries(score.components).map(([k, c]) => [
              k,
              { eligible: c.eligible, score100: c.score === null ? null : 100 * c.score },
            ]),
          );
        } else row.status = 'rejected-normalization';
        rows.push(row);
      }
      if (mode === 'before') states[group.set] = rows;
      else {
        const measured = rows.filter((r) => Number.isFinite(r.score100));
        const mean = (k) => measured.reduce((s, r) => s + r[k], 0) / measured.length;
        await writeJson(path.join(out, group.set + '.json'), {
          schema: 1,
          status: 'installed-default-development-review-not-set-calibration',
          set: group.set,
          source: {
            rendererHash,
            beforeHash,
            metric: graph,
            toolHash,
            priorStudyHash: group.source,
            inputs: group.prior.source.inputs,
          },
          total: rows.length,
          measured: measured.length,
          rejected: rows.length - measured.length,
          beforeMean100: mean('beforeScore100'),
          afterMean100: mean('score100'),
          footerUnchanged: rows.length,
          unsupportedUnchanged: rows.filter((r) => !r.matched).length,
          rows,
        });
      }
      console.log(
        mode,
        group.set,
        rows.length,
        'native faces',
        mode === 'after' ? 'footer unchanged' : 'baseline exact',
      );
    }
    assert.deepEqual(session.faults, []);
  } finally {
    await session.close();
  }
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
assert.equal(await sourceHash(path.join(beforeRoot, 'games/magic/src')), beforeHash);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(await metricSourceGraph(path.resolve(metricFile)), graph);
await writeJson(path.join(out, 'complete.json'), {
  complete: true,
  rendererHash,
  beforeHash,
  toolHash,
  metric: graph,
  sets: sets.map((s) => s.set),
});
