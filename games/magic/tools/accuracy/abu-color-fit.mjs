import assert from 'node:assert/strict';
import { createServer } from 'vite';
import { readJson, writeJson, root } from './common.mjs';
import { fitHsb, evaluateHsb, center, median } from './hsb-color.mjs';
const [auditFile, output] = process.argv.slice(2);
if (!output) throw Error('Usage: abu-color-fit.mjs COLOR_AUDIT OUT');
const audit = await readJson(auditFile),
  server = await createServer({
    configFile: false,
    root,
    server: { middlewareMode: true, hmr: false },
  });
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const groups = [];
  for (const [group, g] of Object.entries(audit.groups)) {
    const rows = audit.rows.filter((r) => r.group === group && r.accepted),
      train = rows.filter((r) => r.cohort === 'calibration'),
      validation = rows.filter((r) => r.cohort === 'validation');
    for (const component of ['frame', 'paper']) {
      if (train.length < 3 || validation.length < 3) {
        groups.push({ group, component, status: 'retain-sparse-family-default', total: g.total });
        continue;
      }
      const source = {
        rgb: center(train.map((r) => r.components[component].renderRgb)),
        tiles: train.map((r) => r.components[component].renderRgb),
      };
      const model = {
        neutralSaturation: 0.06,
        hueDegrees: [-20, 20],
        saturationScale: [0.7, 1.3],
        brightnessScale: [0.85, 1.15],
      };
      const fit = fitHsb(
        source,
        train.map((r) => ({ rgb: r.components[component].referenceRgb })),
        model,
        math,
      );
      const scores = validation.map((r) => {
        const a = r.components[component];
        const m = evaluateHsb(
          { rgb: a.renderRgb, tiles: [a.renderRgb] },
          { rgb: a.referenceRgb },
          fit.adjustment,
          math,
        );
        return { id: r.id, name: r.name, before: m.before, after: m.after };
      });
      const before = median(scores.map((r) => r.before)),
        after = median(scores.map((r) => r.after)),
        worstRegression = Math.max(...scores.map((r) => r.after - r.before));
      groups.push({
        group,
        component,
        training: train.length,
        validation: validation.length,
        adjustment: fit.adjustment,
        before,
        after,
        worstRegression,
        status: after < before - 0.25 && worstRegression <= 2 ? 'candidate' : 'retain-current',
        scores,
      });
    }
  }
  await writeJson(output, {
    schema: 1,
    set: audit.set,
    scope:
      'Shared material deltas fitted on calibration names, checked on reused-development validation names. Native post-integration replay required before promotion; sparse land groups inherit source defaults and retain individual diagnostics.',
    groups,
  });
  console.log(groups.map(({ scores, ...g }) => g));
} finally {
  await server.close();
}
