import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { cacheRoot, fixtureRoot, outputRoot, root, readJson, writeJson, hash } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize } from './pixels-pure.mjs';
import { center, delta, sampleColor, median, evaluateHsb } from './hsb-color.mjs';
import { registerMajorFrame } from './major-calibration-metrics.mjs';
import { fitSharedHsb } from './hsb-shared-color.mjs';

const plan = await readJson(`${fixtureRoot}/early-hsb-plan.json`),
  source = await readJson(`${cacheRoot}/rollout/early-hsb.json`),
  capture = await readJson(`${outputRoot}/early-hsb/before/capture.json`);
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const rows = [],
  groups = [];
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const { calibratedFrameProfile } = await server.ssrLoadModule(
    '/games/magic/src/presentation/calibration-profiles.ts',
  );
  const templateCache = new Map();
  for (const material of ['W', 'U', 'B', 'R', 'G', 'A']) {
    const key = `3ed-${material}`,
      t = capture.templates.find((t) => t.key === key);
    const raw = await readFile(`${outputRoot}/early-hsb/templates/${t.file}`);
    if (hash(raw) !== t.sha256) throw Error('Stale color template');
    const image = normalize(PNG.sync.read(raw));
    templateCache.set(material, image);
    const model = Object.fromEntries(
      ['frame', 'paper'].map((c) => [
        c,
        sampleColor(image, plan.sampling[c + 'Patches'], { paper: c === 'paper', tileSize: 20 }),
      ]),
    );
    const materialRows = [];
    const baseline = capture.rows.find((r) => r.set === '3ed' && r.material === material);
    const blank = normalize(
      PNG.sync.read(
        await readFile(`${outputRoot}/early-hsb/before/${baseline.images.inspect.file}`),
      ),
    );
    const current = calibratedFrameProfile({ ...baseline.face, colorCalibration: 'set-hsb-v1' });
    for (const e of source.entries.filter((e) => e.card.set === '3ed' && e.material === material)) {
      const bytes = await readObject(e.reference),
        raw = normalize(PNG.sync.read(bytes));
      const fit = registerMajorFrame(raw, blank, 'retro', 'white');
      if (!fit.accepted) {
        rows.push({ id: e.id, name: e.card.name, material, cohort: e.cohort, issue: fit.reason });
        continue;
      }
      const image = normalize(PNG.sync.read(bytes), fit.transform);
      const samples = Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          sampleColor(image, plan.sampling[c + 'Patches'], { paper: c === 'paper', tileSize: 20 }),
        ]),
      );
      const row = {
        id: e.id,
        name: e.card.name,
        material,
        cohort: e.cohort,
        referenceHash: e.reference.sha256,
        normalization: fit.transform,
        samples,
        normalizationSensitivity: Object.fromEntries(
          ['frame', 'paper'].map((c) => [
            c,
            delta(
              samples[c].rgb,
              sampleColor(raw, plan.sampling[c + 'Patches'], { paper: c === 'paper', tileSize: 20 })
                .rgb,
            ),
          ]),
        ),
      };
      rows.push(row);
      materialRows.push(row);
    }
    const cal = materialRows.filter((r) => r.cohort === 'calibration'),
      val = materialRows.filter((r) => r.cohort === 'validation');
    const pairs = ['frame', 'paper'].map((c) => ({
      source: model[c],
      references: cal.map((r) => r.samples[c]),
    }));
    const refit = fitSharedHsb(pairs, plan.model, math);
    const targets = Object.fromEntries(
      pairs.map((p, i) => {
        const src = math.rgbToHsb(p.source.rgb),
          target = math.rgbToHsb(center(p.references.map((r) => r.rgb)));
        return [
          ['frame', 'paper'][i],
          {
            sourceRgb: p.source.rgb,
            targetRgb: center(p.references.map((r) => r.rgb)),
            desiredBrightnessScale: target[2] / src[2],
            desiredSaturationScale: target[1] / src[1],
            desiredHueDegrees: ((target[0] - src[0] + 540) % 360) - 180,
          },
        ];
      }),
    );
    const measurements = val.map((r) => ({
      id: r.id,
      name: r.name,
      components: Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          {
            current: evaluateHsb(model[c], r.samples[c], current ?? math.IDENTITY_HSB, math),
            refit: evaluateHsb(model[c], r.samples[c], refit.adjustment, math),
          },
        ]),
      ),
    }));
    groups.push({
      key,
      enabled: !!current,
      current: current ?? null,
      refit: refit.adjustment,
      targets,
      counts: { calibration: cal.length, validation: val.length },
      normalizationSensitivity: Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          median(materialRows.map((r) => r.normalizationSensitivity[c])),
        ]),
      ),
      validation: measurements,
    });
  }
} finally {
  await server.close();
}
const report = {
  schemaVersion: 1,
  scope:
    'Revised current runtime policy, normalized frame-only samples and an HSB refit. Reuses prior development/validation names: diagnostic, not a fresh blind acceptance test. A common transformation still applies to all pixels of the frame asset.',
  groups,
  rows,
};
await writeJson(`${fixtureRoot}/revised-color-calibration-audit.json`, report);
for (const g of groups)
  console.log(
    g.key,
    g.enabled,
    'brightness required',
    g.targets.frame.desiredBrightnessScale,
    g.targets.paper.desiredBrightnessScale,
    'normalization',
    g.normalizationSensitivity,
    'reserved',
    g.validation.map((r) =>
      Object.fromEntries(
        Object.entries(r.components).map(([c, m]) => [c, [m.current.after, m.refit.after]]),
      ),
    ),
  );
