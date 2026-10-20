// Shared Alpha heading fit. Sources, membership and scan poses stay fixed.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
import { root, hash, readJson, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize } from './pixels-pure.mjs';
const [directory, output] = process.argv.slice(2);
assert(output, 'Usage: heading-spacing.mjs OBSERVATIONS_DIRECTORY OUTPUT_DIRECTORY');
await mkdir(output, { recursive: true });
let entries = [];
for (const material of 'WUBRGAL') {
  const data = await readJson(path.join(directory, material, 'observations.json'));
  entries.push(...data.records.map((r) => ({ ...r, material })));
}
entries = entries.filter((e) => e.normalization.accepted);
const unique = new Set();
entries = entries.filter((e) => !unique.has(e.id) && unique.add(e.id));
const sourceInputs = await readJson(path.join(directory, 'inputs.json'));
for (const e of entries) e.art = sourceInputs.entries.find((row) => row.id === e.id)?.art;
const training = [],
  validation = [];
for (const material of 'WUBRGAL') {
  const eligible = entries
    .filter((e) => e.material === material && e.name.includes(' ') && e.face.typeLine.includes(' '))
    .sort((a, b) => a.id.localeCompare(b.id));
  training.push(...eligible.filter((e) => e.cohort === 'calibration').slice(0, 3));
  validation.push(...eligible.filter((e) => e.cohort !== 'calibration').slice(0, 3));
}
const selected = [...training, ...validation];
const reviewNames = process.env.HEADING_REVIEW_NAMES?.split('|');
const reviewEntries = reviewNames ? entries.filter((e) => reviewNames.includes(e.name)) : null;
if (reviewNames)
  assert.equal(reviewEntries.length, reviewNames.length, 'Unknown/duplicate review name');
await writeJson(path.join(output, 'membership.json'), {
  training: training.map((e) => e.id),
  validation: validation.map((e) => e.id),
  all: entries.map((e) => e.id),
  note: 'Existing development scans; not a blind holdout. Shared settings only. Frozen frame normalization.',
});
const server = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
const components = [];
try {
  await server.ssrLoadModule('/games/magic/src/data/eager.ts');
  const { canvasAssetUrls } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-assets.ts',
  );
  const { RETRO_FONT, RETRO_SYMBOL_FONT } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-frame.ts',
  );
  const css = await readFile(path.join(root, 'games/magic/fonts.css'), 'utf8');
  const urls = new Set(
    [...css.matchAll(/url\('([^']+)'\)/g)]
      .map((m) => m[1])
      .concat(RETRO_FONT, RETRO_SYMBOL_FONT, ...entries.flatMap((e) => canvasAssetUrls(e.face)))
      .filter((u) => u?.startsWith('https:')),
  );
  for (const url of urls) components.push(await cachedFetch(url, { offline: true }));
} finally {
  await server.close();
}
const session = await openBrowser(
  { entries, components },
  {
    plugins: [
      {
        configureServer(server) {
          server.middlewares.use(async (req, res, next) => {
            if (!req.url.startsWith('/__released/')) return next();
            const file = req.url.slice('/__released/'.length);
            if (!/^[\w.-]+\.(js|css|wasm)$/.test(file)) return res.writeHead(404).end();
            try {
              res.setHeader(
                'Content-Type',
                file.endsWith('.js')
                  ? 'text/javascript'
                  : file.endsWith('.wasm')
                    ? 'application/wasm'
                    : 'text/css',
              );
              res.end(await readFile(path.join(process.env.HEADING_BASELINE_LIB, file)));
            } catch (e) {
              res.writeHead(404).end(String(e));
            }
          });
        },
        name: 'capture-heading-context',
        enforce: 'pre',
        transform(source, id) {
          if (id.endsWith('/legacy-calibrated-title.ts'))
            return source.replace(
              '  const base = setTitleCalibration(face.setCode);',
              '  if ((globalThis as any).__headingSpacingCapture?.(c,face,x,y,width,role,text)) return true;\n  const base = setTitleCalibration(face.setCode);',
            );
        },
      },
    ],
  },
);
const expectedRows = process.env.HEADING_EXPECTED_FIT
  ? new Map(
      (await readJson(process.env.HEADING_EXPECTED_FIT)).nativeVerification.map((r) => [r.id, r]),
    )
  : null;
const rows = [],
  report =
    process.env.HEADING_VERIFY_ALL || process.env.HEADING_REFINE || reviewEntries
      ? await readJson(path.join(output, 'fit.json'))
      : {
          schema: 1,
          baseline: '0.6.1',
          scope:
            'Shared name/type parameters; existing development scans, fixed poses, separate fitting and reserved names. Objective is a structural index, not percentage correctness.',
          training: training.map((e) => e.id),
          validation: validation.map((e) => e.id),
          fits: {},
        };
async function prepare(e) {
  const scan = normalize(
    PNG.sync.read(await readFile(e.reference.file)),
    e.normalization.transform,
  );
  if (reviewEntries)
    await writeFile(
      path.join(output, e.id + '-reference.png'),
      PNG.sync.write({ ...scan, data: Buffer.from(scan.data) }),
    );
  const data =
    'data:image/png;base64,' +
    PNG.sync.write({ ...scan, data: Buffer.from(scan.data) }).toString('base64');
  const result = await session.page.evaluate(({ e, data }) => globalThis.fit.prepare(e, data), {
    e,
    data,
  });
  return result;
}
const trainingIds = training.map((e) => e.id);
try {
  await session.page.evaluate(async () => {
    globalThis.fit = await import('/games/magic/tools/accuracy/heading-spacing-browser.mjs');
  });
  if (process.env.HEADING_BASELINE_LIB)
    await session.page.evaluate(async () => {
      globalThis.__headingBaseline = await import('/__released/magic-presentation.js');
    });
  for (const e of reviewEntries ?? selected) {
    const initial = await prepare(e);
    e.defaultParity = initial.releasedParity;
    console.log('prepared', e.name);
  }
  for (const role of process.env.HEADING_VERIFY_ALL || reviewEntries ? [] : ['title', 'type']) {
    const controls = await session.page.evaluate(() => globalThis.fit.controls());
    const bounded = (values) =>
      Object.fromEntries(
        Object.entries(values).map(([key, value]) => {
          const control = controls.find((c) => c.id === role + '.' + key);
          assert(control, 'Unknown heading control: ' + key);
          return [key, +Math.max(control.min, Math.min(control.max, value)).toFixed(3)];
        }),
      );
    const cache = new Map();
    let evaluations = 0;
    async function test(values) {
      values = bounded(values);
      const key = JSON.stringify(values);
      if (cache.has(key)) return cache.get(key);
      const scores = await session.page.evaluate(
        ({ ids, role, values }) => globalThis.fit.batch(ids, role, values),
        { ids: trainingIds, role, values },
      );
      const value = scores.reduce((a, b) => a + b[0], 0) / scores.length;
      cache.set(key, value);
      evaluations++;
      if (evaluations % 25 === 0)
        console.log(role, evaluations, value.toFixed(5), JSON.stringify(values));
      return value;
    }
    const initial = {
      dx: 0,
      dy: 0,
      size: role === 'title' ? 27.8 : 22.2,
      width: 1,
      wordSpacing: 0,
    };
    let best = { ...(process.env.HEADING_REFINE ? report.fits[role].values : initial) },
      score = await test(best),
      baseline = await test(initial);
    const optimize = async (spans) => {
      for (let round = 0; round < 2; round++)
        for (const [key, lo, hi, step] of spans) {
          let winner = best;
          const center = best[key];
          for (let v = center + lo; v <= center + hi + step / 10; v += step) {
            const p = bounded({ ...best, [key]: +v.toFixed(3) }),
              s = await test(p);
            if (s > score + 1e-8) {
              winner = p;
              score = s;
            }
          }
          best = winner;
        }
    };
    if (process.env.HEADING_REFINE) {
      const seed = { ...best };
      for (let delta = -1.5; delta <= 2.001; delta += 0.1) {
        const size = +(seed.size + delta).toFixed(3);
        for (const gap of [seed.wordSpacing, -0.5, -1, -1.5]) {
          const p = bounded({
            ...seed,
            size,
            width: +((seed.width * seed.size) / size).toFixed(3),
            wordSpacing: gap,
          });
          const m = await test(p);
          if (m > score) {
            best = p;
            score = m;
          }
        }
      }
    }
    await optimize([
      ['dx', -3, 3, 0.5],
      ['dy', -2, 2, 0.5],
      ['size', -1.5, 2, 0.25],
      ['width', -0.1, 0.04, 0.005],
      ['wordSpacing', -3, 1, 0.25],
    ]);
    await optimize([
      ['dx', -0.5, 0.5, 0.1],
      ['dy', -0.5, 0.5, 0.1],
      ['size', -0.3, 0.3, 0.05],
      ['width', -0.006, 0.006, 0.001],
      ['wordSpacing', -0.3, 0.3, 0.05],
    ]);
    const samples = await session.page.evaluate(
      ({ ids, role, best }) =>
        ids.map((id) => ({
          id,
          before: globalThis.fit.measure(id, role, {}),
          after: globalThis.fit.measure(id, role, best),
        })),
      { ids: selected.map((e) => e.id), role, best },
    );
    report.fits[role] = { values: best, baseline, objective: score, evaluations, samples };
    console.log('FIT', role, JSON.stringify(report.fits[role]));
    await writeJson(path.join(output, 'fit.json'), report);
  }
  const values = Object.fromEntries(
    Object.entries(report.fits).flatMap(([role, fit]) =>
      Object.entries(fit.values).map(([k, v]) => [role + '.' + k, v]),
    ),
  );
  const checks = reviewEntries ?? (process.env.HEADING_VERIFY_ALL ? entries : selected);
  const selectedIds = new Set(selected.map((e) => e.id));
  for (const e of checks) {
    if (!reviewEntries && !selectedIds.has(e.id))
      e.defaultParity = (await prepare(e)).releasedParity;
    const scores = await session.page.evaluate(
      ({ id, values }) =>
        Object.fromEntries(
          ['title', 'type'].map((role) => [
            role,
            {
              before: globalThis.fit.measure(id, role, {}),
              after: globalThis.fit.measure(
                id,
                role,
                Object.fromEntries(
                  Object.entries(values)
                    .filter(([k]) => k.startsWith(role + '.'))
                    .map(([k, v]) => [k.split('.')[1], v]),
                ),
              ),
            },
          ]),
        ),
      { id: e.id, values },
    );
    const ablation =
      reviewEntries || process.env.HEADING_ABLATE_ALL
        ? await session.page.evaluate(
            ({ id, values, roles }) =>
              Object.fromEntries(
                roles.map((role) => [
                  role,
                  globalThis.fit.ablate(
                    id,
                    role,
                    Object.fromEntries(
                      Object.entries(values)
                        .filter(([k]) => k.startsWith(role + '.'))
                        .map(([k, v]) => [k.split('.')[1], v]),
                    ),
                  ),
                ]),
              ),
            {
              id: e.id,
              values,
              roles: process.env.HEADING_ABLATE_ALL ? ['title'] : ['title', 'type'],
            },
          )
        : undefined;
    if (expectedRows)
      assert.deepEqual(
        scores,
        expectedRows.get(e.id)?.scores,
        'Promoted heading scores changed: ' + e.name,
      );
    const proof = await session.page.evaluate(
      ({ id, values }) => globalThis.fit.verify(id, values),
      { id: e.id, values },
    );
    if (expectedRows)
      assert.equal(
        proof.defaultCandidateFields,
        0,
        'Expected native defaults without proposal overrides',
      );
    for (const key of ['before', 'after']) {
      if (reviewEntries || selectedIds.has(e.id))
        await writeFile(
          path.join(output, e.id + '-' + key + '.png'),
          Buffer.from(proof[key].split(',')[1], 'base64'),
        );
      delete proof[key];
    }
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      cohort: e.cohort,
      referenceHash: e.reference.sha256,
      defaultParity: e.defaultParity,
      pose: e.normalization.transform,
      scores,
      ...(ablation ? { ablation } : {}),
      ...proof,
    });
    console.log('verified', rows.length, '/', checks.length, e.name);
    await session.page.evaluate((id) => globalThis.fit.finish(id), e.id);
  }
  if (!reviewEntries) report.nativeVerification = rows;
  assert.deepEqual(session.faults, []);
  await writeJson(
    path.join(output, reviewEntries ? 'review.json' : 'fit.json'),
    reviewEntries ? { values, rows } : report,
  );
  console.log('DONE', JSON.stringify({ values, cards: rows.length }));
} finally {
  await session.close();
}
