import { createServer } from 'vite';
import {
  readJson,
  writeJson,
  fixtureRoot,
  cacheRoot,
  outputRoot,
  root,
  objectFile,
  hash,
} from './common.mjs';
import { readPng, normalize } from './pixels.mjs';
import { sampleColor, evaluateHsb, median } from './hsb-color.mjs';
const plan = await readJson(`${fixtureRoot}/early-hsb-plan.json`),
  results = await readJson(`${fixtureRoot}/early-hsb-results.json`),
  capture = await readJson(`${outputRoot}/early-hsb/before/capture.json`);
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
try {
  const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
  const sources = new Map();
  for (const template of capture.templates) {
    const image = normalize(await readPng(`${outputRoot}/early-hsb/templates/${template.file}`));
    for (const component of ['frame', 'paper'])
      sources.set(
        `${template.key}/${component}`,
        sampleColor(image, plan.sampling[component + 'Patches'], {
          paper: component === 'paper',
          tileSize: plan.sampling.tileSize,
        }),
      );
  }
  const rows = [];
  for (const set of ['lea', 'leb', '2ed', '3ed']) {
    const inventory = await readJson(`${cacheRoot}/sets/${set}.json`);
    for (const e of inventory.entries) {
      const known = plan.cards.find((c) => c.id === e.id),
        type = e.card.type_line,
        basic = ['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].filter((t) => type.includes(t));
      const material = /\bLand\b/.test(type)
        ? basic.length === 1
          ? 'WUBRG'[['Plains', 'Island', 'Swamp', 'Mountain', 'Forest'].indexOf(basic[0])] + 'L'
          : 'L'
        : /\bArtifact\b/.test(type)
          ? 'A'
          : e.card.colors.join('');
      if (e.issue || !e.reference) {
        rows.push({ id: e.id, set, name: e.card.name, status: e.issue ?? 'missing-reference' });
        continue;
      }
      const image = normalize(await readPng(objectFile(e.reference))),
        components = {};
      for (const component of ['frame', 'paper']) {
        const group = results.groups.find(
          (g) => g.key === `${set}-${material}` && g.component === component,
        );
        if (!group) {
          components[component] = { status: 'unsupported-material' };
          continue;
        }
        const reference = sampleColor(image, plan.sampling[component + 'Patches'], {
          paper: component === 'paper',
          tileSize: plan.sampling.tileSize,
        });
        const measured = evaluateHsb(
          sources.get(`${set}-${material}/${component}`),
          reference,
          group.status === 'trial' ? group.adjustment : math.IDENTITY_HSB,
          math,
        );
        components[component] = {
          status: group.status,
          before: measured.before,
          after: measured.after,
          referenceRgb: measured.referenceRgb,
          flags: [
            ...(measured.after - measured.before > 1 ? ['regression'] : []),
            ...(measured.after > 3 ? ['residual-color'] : []),
          ],
        };
      }
      rows.push({
        id: e.id,
        set,
        name: e.card.name,
        number: e.card.collector_number,
        referenceHash: e.reference.sha256,
        material,
        cohort: known?.cohort ?? 'unseen-audit',
        components,
      });
    }
    console.log('audited', set, inventory.entries.length);
  }
  const summary = ['lea', 'leb', '2ed', '3ed'].map((set) => {
    const cards = rows.filter((r) => r.set === set),
      independent = cards
        .filter((r) => r.cohort === 'unseen-audit')
        .flatMap((r) => Object.values(r.components).filter((c) => c.status === 'trial'));
    return {
      set,
      cards: cards.length,
      unseenCards: cards.filter((r) => r.cohort === 'unseen-audit').length,
      unseenEnabledComponents: independent.length,
      before: median(independent.map((c) => c.before)),
      after: median(independent.map((c) => c.after)),
      regressionsOver1: independent.filter((c) => c.after - c.before > 1).length,
      worstRegression: Math.max(0, ...independent.map((c) => c.after - c.before)),
    };
  });
  await writeJson(`${fixtureRoot}/early-hsb-audit.json`, {
    schemaVersion: 1,
    resultsHash: hash(JSON.stringify(results)),
    scope:
      'Every cached ordinary printing in the four inventories. CPU color predictions from the frozen frame templates, not full-card rerenders. Unseen cards were excluded from both fitting and admission. No parameter changes after this audit.',
    summary,
    rows,
  });
  console.log(summary);
} finally {
  await server.close();
}
