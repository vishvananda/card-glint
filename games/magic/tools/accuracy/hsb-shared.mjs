import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'vite';
import {
  root,
  fixtureRoot,
  cacheRoot,
  outputRoot,
  readJson,
  writeJson,
  objectFile,
  hash,
} from './common.mjs';
import { readPng, normalize } from './pixels.mjs';
import { sampleColor, center, median, evaluateHsb } from './hsb-color.mjs';
import { fitSharedHsb, perCardMana } from './hsb-shared-color.mjs';
const action = process.argv[2];
assert.ok(['fit', 'validate'].includes(action));
const plan = await readJson(`${fixtureRoot}/early-hsb-plan.json`),
  snapshot = await readJson(`${cacheRoot}/rollout/early-hsb.json`),
  capture = await readJson(`${outputRoot}/early-hsb/before/capture.json`);
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      [
        'hsb-shared.mjs',
        'hsb-shared-color.mjs',
        'hsb-color.mjs',
        '../../src/presentation/hsb.ts',
      ].map((p) => readFile(new URL(p, import.meta.url))),
    ),
  ),
);
const candidateFile = `${fixtureRoot}/early-hsb-shared-candidate.json`;
let frozen;
if (action === 'fit') {
  try {
    await readFile(candidateFile);
    throw Error('Shared candidate already frozen');
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
  }
} else {
  frozen = await readJson(candidateFile);
  assert.equal(frozen.methodHash, methodHash);
}
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts'),
    sources = new Map(),
    references = new Map(),
    manaSources = new Map(),
    manaReferences = new Map();
  for (const t of capture.templates) {
    const image = normalize(await readPng(`${outputRoot}/early-hsb/templates/${t.file}`));
    for (const c of ['frame', 'paper'])
      sources.set(
        `${t.key}/${c}`,
        sampleColor(image, plan.sampling[c + 'Patches'], {
          paper: c === 'paper',
          tileSize: plan.sampling.tileSize,
        }),
      );
  }
  for (const row of capture.rows) {
    const image = normalize(
      await readPng(`${outputRoot}/early-hsb/before/${row.images.inspect.file}`),
    );
    for (const m of perCardMana(image, row.set, row.face.manaSymbols ?? [])) {
      const key = `${row.set}-${m.symbol}`,
        samples = manaSources.get(key) ?? [];
      samples.push(m);
      manaSources.set(key, samples);
    }
  }
  for (const e of snapshot.entries.filter(
    (e) => e.cohort === (action === 'fit' ? 'calibration' : 'validation'),
  )) {
    const image = normalize(await readPng(objectFile(e.reference))),
      key = `${e.card.set}-${e.material}`,
      samples = references.get(key) ?? [];
    const components = Object.fromEntries(
      ['frame', 'paper'].map((c) => [
        c,
        sampleColor(image, plan.sampling[c + 'Patches'], {
          paper: c === 'paper',
          tileSize: plan.sampling.tileSize,
        }),
      ]),
    );
    samples.push({ id: e.id, name: e.card.name, components });
    references.set(key, samples);
    const symbols = [...(e.card.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]);
    for (const m of perCardMana(image, e.card.set, symbols)) {
      const mk = `${e.card.set}-${m.symbol}`,
        a = manaReferences.get(mk) ?? [];
      a.push({ id: e.id, name: e.card.name, ...m });
      manaReferences.set(mk, a);
    }
  }
  const materialPairs = (key) =>
    ['frame', 'paper'].map((c) => ({
      key: key + '/' + c,
      source: sources.get(key + '/' + c),
      references: references.get(key).map((r) => r.components[c]),
    }));
  const groups = [],
    global = [];
  for (const t of capture.templates) {
    const key = t.key,
      pairs = materialPairs(key),
      calibration = frozen?.groups.find((g) => g.key === key),
      fit = calibration ?? fitSharedHsb(pairs, plan.model, math);
    const rows = references.get(key).map((r) => ({
      id: r.id,
      name: r.name,
      components: Object.fromEntries(
        ['frame', 'paper'].map((c) => [
          c,
          evaluateHsb(sources.get(key + '/' + c), r.components[c], fit.adjustment, math),
        ]),
      ),
    }));
    const combined = rows.map((r) => {
      const cs = Object.values(r.components);
      return { before: median(cs.map((c) => c.before)), after: median(cs.map((c) => c.after)) };
    });
    const summary = {
      before: median(combined.map((r) => r.before)),
      after: median(combined.map((r) => r.after)),
      worstRegression: Math.max(0, ...combined.map((r) => r.after - r.before)),
      clipping: Math.max(
        ...rows.flatMap((r) => Object.values(r.components).map((c) => c.clipping)),
      ),
    };
    const flags = [];
    if ((calibration?.count ?? rows.length) < 3 || rows.length < 2) flags.push('sparse-group');
    if (summary.after > summary.before - 0.25) flags.push('no-material-gain');
    if (summary.worstRegression > 1) flags.push('reserved-regression');
    if (summary.clipping > 0.02) flags.push('clipping');
    if (summary.after > 3) flags.push('residual-color');
    // Window sensitivity is a review diagnostic from v1, not an automatic veto:
    // texture phase changes can move these small-patch medians without edge contact.
    groups.push({
      key,
      adjustment: fit.adjustment,
      count: rows.length,
      flags,
      summary,
      status: flags.some((f) =>
        ['sparse-group', 'no-material-gain', 'reserved-regression', 'clipping'].includes(f),
      )
        ? 'review-only'
        : 'trial',
      rows,
    });
    console.log(key, summary.before.toFixed(2), '->', summary.after.toFixed(2), flags.join(','));
  }
  for (const set of ['lea', 'leb', '2ed', '3ed']) {
    // Test the six ordinary nonland materials with comparable typography. Lands
    // remain a separate structural task, not a weight that biases the global fit.
    const keys = capture.templates
        .filter((t) => t.key.startsWith(set + '-') && /-(W|U|B|R|G|A)$/.test(t.key))
        .map((t) => t.key),
      fit =
        frozen?.global.find((g) => g.set === set) ??
        fitSharedHsb(keys.flatMap(materialPairs), plan.model, math);
    const byMaterial = keys.map((key) => {
      const measurements = references
        .get(key)
        .flatMap((r) =>
          ['frame', 'paper'].map((c) =>
            evaluateHsb(sources.get(key + '/' + c), r.components[c], fit.adjustment, math),
          ),
        );
      return {
        material: key.split('-')[1],
        before: median(measurements.map((r) => r.before)),
        after: median(measurements.map((r) => r.after)),
        perColor: groups.find((g) => g.key === key).summary.after,
      };
    });
    global.push({
      set,
      adjustment: fit.adjustment,
      byMaterial,
      status: 'comparison-only; not selected for runtime',
    });
  }
  const mana = [];
  for (const [key, refs] of manaReferences) {
    const raw = manaSources.get(key);
    assert.ok(raw?.length, key);
    const source = {
        rgb: center(raw.map((r) => r.rgb)),
        tiles: raw.map((r) => r.rgb),
        spread: median(raw.map((r) => r.spread)),
      },
      cal = frozen?.mana.find((m) => m.key === key),
      fit = cal ?? fitSharedHsb([{ source, references: refs }], plan.model, math);
    const rows = refs.map((r) => ({
      id: r.id,
      name: r.name,
      ...evaluateHsb(source, r, fit.adjustment, math),
      sensitivity: r.sensitivity,
    }));
    const summary = {
      before: median(rows.map((r) => r.before)),
      after: median(rows.map((r) => r.after)),
      worstRegression: Math.max(0, ...rows.map((r) => r.after - r.before)),
      sensitivity: median(rows.map((r) => r.sensitivity)),
      clipping: rows[0].clipping,
    };
    const flags = [];
    if ((cal?.count ?? refs.length) < 3 || refs.length < 2) flags.push('sparse-group');
    if (summary.after > summary.before - 0.25) flags.push('no-material-gain');
    if (summary.worstRegression > 1) flags.push('reserved-regression');
    if (summary.sensitivity > 1.5) flags.push('position-sensitive');
    if (summary.clipping > 0.02) flags.push('clipping');
    mana.push({
      key,
      adjustment: fit.adjustment,
      count: refs.length,
      summary,
      flags,
      status: flags.length ? 'review-only' : 'trial',
      rows,
    });
    console.log(
      'mana',
      key,
      summary.before.toFixed(2),
      '->',
      summary.after.toFixed(2),
      flags.join(','),
    );
  }
  const result = {
    schemaVersion: 2,
    planHash: hash(JSON.stringify(plan)),
    methodHash,
    policy:
      'User-reviewed revision: a single HSB transform across the whole frame bitmap, including paper, for every material. Equal frame/paper weight; bounded Huber fit on calibration medians. Same reserved cohorts reused, so this is an iterative study, not a fresh blind validation. Mana fitted separately by set/symbol using fixed eroded discs; no per-scan alignment. Global set fit is compared across six nonland materials. White texture was visually confirmed; contrast spread alone is not an asset mismatch.',
    groups,
    global,
    mana,
  };
  if (action === 'fit') await writeJson(candidateFile, result);
  else {
    result.candidateHash = hash(JSON.stringify(frozen));
    await writeJson(`${fixtureRoot}/early-hsb-shared-results.json`, result);
  }
} finally {
  await server.close();
}
