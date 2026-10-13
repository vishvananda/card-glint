import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { root, outputRoot, fixtureRoot, cacheRoot, readJson, writeJson, hash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { center, median, sampleColor, evaluateHsb, fitHsb } from './hsb-color.mjs';
import { fitSharedHsb } from './hsb-shared-color.mjs';
const plan = await readJson(fixtureRoot + '/early-hsb-plan.json');
const audit = await readJson(fixtureRoot + '/revised-color-calibration-audit.json');
const templates = await readJson(cacheRoot + '/rollout/old-frame-templates.json');
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const rows = [];
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  for (const material of ['W', 'U', 'B', 'R', 'G', 'A']) {
    const refs = audit.rows.filter((r) => r.material === material && !r.issue);
    for (const family of ['abu', 'fourth', 'seventh']) {
      const t = templates.rows.find((t) => t.key === family + '/' + material);
      const bytes = await readFile(outputRoot + '/old-frame-families/templates/' + t.file);
      if (hash(bytes) !== t.sha256) throw Error('Changed frame template: ' + t.key);
      const image = normalize(PNG.sync.read(bytes));
      const model = Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          sampleColor(image, plan.sampling[c + 'Patches'], { paper: c === 'paper', tileSize: 20 }),
        ]),
      );
      const pairs = ['frame', 'paper'].map((c) => ({
        source: model[c],
        references: refs.filter((r) => r.cohort === 'calibration').map((r) => r.samples[c]),
      }));
      const fit = fitSharedHsb(pairs, plan.model, math);
      const independent = Object.fromEntries(
        pairs.map((p, i) => [
          ['frame', 'paper'][i],
          fitHsb(p.source, p.references, plan.model, math).adjustment,
        ]),
      );
      const required = Object.fromEntries(
        pairs.map((p, i) => {
          const src = math.rgbToHsb(p.source.rgb),
            dst = math.rgbToHsb(center(p.references.map((r) => r.rgb)));
          return [
            ['frame', 'paper'][i],
            {
              brightness: dst[2] / src[2],
              saturation: dst[1] / src[1],
              hue: ((dst[0] - src[0] + 540) % 360) - 180,
            },
          ];
        }),
      );
      const errors = Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          median(
            refs
              .filter((r) => r.cohort === 'validation')
              .map((r) => evaluateHsb(model[c], r.samples[c], fit.adjustment, math).after),
          ),
        ]),
      );
      rows.push({
        material,
        family,
        url: t.url,
        sourceHash: t.asset.sha256,
        required,
        fit: fit.adjustment,
        sourceRgb: Object.fromEntries(['frame', 'paper'].map((c) => [c, model[c].rgb])),
        independent,
        errors,
      });
    }
  }
} finally {
  await server.close();
}
await writeJson(fixtureRoot + '/revised-frame-color-candidates.json', {
  scope:
    'Color-only diagnostic using existing normalized Revised cohorts. Does not certify frame shape or select a new runtime asset.',
  auditHash: hash(JSON.stringify(audit)),
  samplingHash: hash(JSON.stringify(plan.sampling)),
  templateManifestHash: hash(JSON.stringify(templates)),
  rows,
});
console.log(
  rows.map((r) => ({
    material: r.material,
    family: r.family,
    brightness:
      r.required.frame.brightness.toFixed(2) + ' / ' + r.required.paper.brightness.toFixed(2),
    error: r.errors.frame.toFixed(2) + ' / ' + r.errors.paper.toFixed(2),
  })),
);
