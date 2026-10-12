import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import {
  cacheRoot,
  fixtureRoot,
  outputRoot,
  root,
  readJson,
  writeJson,
  sourceHash,
  hash,
  atomicWrite,
} from './common.mjs';
import { fetchComponents } from './components.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';
const [action = 'before'] = process.argv.slice(2);
assert.ok(['before', 'after', 'compare'].includes(action));
const base = `${outputRoot}/flavor-land`,
  planFile = `${fixtureRoot}/flavor-land-plan.json`;
// Existing cached cross-era sample, selected before this correction. No wording certification.
const selections = {
  m15: ['86', '241'],
  m19: ['1', '248', '249', '250'],
  m20: ['42', '242'],
  m21: ['46', '243'],
  war: ['81'],
  iko: ['40'],
  znr: ['88'],
  mid: ['89'],
  dmu: ['81'],
  woe: ['81'],
  fdn: ['54', '259'],
};
const entries = [];
for (const set of Object.keys(selections)) {
  const snapshot = await readJson(`${cacheRoot}/sets/${set}-window-era.json`);
  entries.push(...snapshot.entries.filter((e) => !e.issue && e.card.layout === 'normal'));
}
if (action === 'compare') {
  const before = await readJson(`${base}/before/capture.json`),
    after = await readJson(`${base}/after/capture.json`);
  assert.equal(before.planHash, after.planHash);
  const rows = await Promise.all(
    after.rows.map(async (a) => {
      const b = before.rows.find((b) => b.id === a.id);
      assert.ok(b);
      assert.equal(b.referenceHash, a.referenceHash);
      assert.deepEqual(b.layout.lines, a.layout.lines, 'Separator fix must not reflow lettering');
      const { frameColors: _, ...aFace } = a.face,
        { frameColors: __, ...bFace } = b.face;
      assert.deepEqual(aFace, bFace, 'Only the inferred land palette may change input');
      const pixelAudit = {};
      if (a.images && a.inputHash === b.inputHash) {
        for (const tier of ['inspect', 'table']) {
          const images = [];
          for (const [revision, capture] of [
            ['before', b],
            ['after', a],
          ]) {
            const bytes = await readFile(`${base}/${revision}/${capture.images[tier].file}`);
            assert.equal(hash(bytes), capture.images[tier].sha256);
            images.push(PNG.sync.read(bytes));
          }
          const [oldImage, newImage] = images;
          assert.equal(oldImage.width, newImage.width);
          assert.equal(oldImage.height, newImage.height);
          let changed = 0,
            outsideSeparator = 0;
          for (let y = 0; y < oldImage.height; y++) {
            for (let x = 0; x < oldImage.width; x++) {
              const index = (y * oldImage.width + x) * 4;
              if (
                oldImage.data
                  .subarray(index, index + 4)
                  .equals(newImage.data.subarray(index, index + 4))
              )
                continue;
              changed++;
              const referenceX = ((x + 0.5) * 488) / oldImage.width;
              const referenceY = ((y + 0.5) * 680) / oldImage.height;
              const allowed = [a.layout, b.layout].some(
                (layout) =>
                  referenceX >= layout.x - 2 &&
                  referenceX <= layout.x + layout.width + 2 &&
                  layout.separators.some((y) => Math.abs(referenceY - y) <= 2),
              );
              if (!allowed) outsideSeparator++;
            }
          }
          assert.equal(outsideSeparator, 0, `Unrelated pixel change: ${a.name} ${tier}`);
          pixelAudit[tier] = { changed, outsideSeparator };
        }
      }
      return {
        id: a.id,
        set: a.set,
        number: a.number,
        name: a.name,
        referenceHash: a.referenceHash,
        inputChanged: a.inputHash !== b.inputHash,
        pixelAudit,
        beforePalette: b.face.frameColors ?? null,
        afterPalette: a.face.frameColors ?? null,
        before: b.clearances,
        after: a.clearances,
        rendered: !!a.images,
        images: a.images ? { before: b.images, after: a.images } : undefined,
      };
    }),
  );
  const all = (side) => rows.flatMap((r) => r[side]);
  const summary = {
    cards: rows.length,
    rendered: rows.filter((r) => r.rendered).length,
    separators: all('after').length,
    beforeCollisions: all('before').filter((c) => Math.min(c.above, c.below) < 0).length,
    afterCollisions: all('after').filter((c) => Math.min(c.above, c.below) < 0).length,
    minimumClearance: Math.min(...all('after').flatMap((c) => [c.above, c.below])),
    changedLandInputs: rows.filter((r) => r.inputChanged).length,
  };
  assert.equal(summary.afterCollisions, 0);
  await writeJson(`${fixtureRoot}/flavor-land-measurement.json`, {
    schemaVersion: 1,
    scope:
      'Measured ink clearance, not scan similarity. Cached cross-era ordinary-card cohort. Lettering is identical before/after; source wording has not been certified. Land corrections change input palettes, not frame geometry. Raw and normalized scan review is separate. Browser used once per capture; comparison reads saved layouts and PNGs.',
    planHash: after.planHash,
    baselineRendererHash: before.rendererHash,
    rendererHash: after.rendererHash,
    adapterHash: after.adapterHash,
    summary,
    rows,
  });
  console.log(summary);
  process.exit(0);
}
const plan = {
  schemaVersion: 1,
  scope:
    'Separator collision audit on cached ordinary cross-era cards; selected full-card renders plus any changed land palette. Baseline frozen before fixing layout or adapter.',
  baselineRendererHash: await sourceHash(`${root}/games/magic/src`),
  baselineAdapterHash: hash(await readFile(new URL('./adapter.mjs', import.meta.url))),
  cards: entries.map((e) => ({
    id: e.id,
    set: e.card.set,
    number: e.card.collector_number,
    name: e.card.name,
    referenceHash: e.reference.sha256,
  })),
  selections,
};
if (action === 'before') {
  try {
    const existing = await readJson(planFile);
    assert.equal(
      plan.baselineRendererHash,
      existing.baselineRendererHash,
      'Refusing to replace frozen baseline',
    );
    assert.equal(
      plan.baselineAdapterHash,
      existing.baselineAdapterHash,
      'Refusing to replace frozen input adapter',
    );
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    await writeJson(planFile, plan);
  }
}
const frozen = await readJson(planFile);
assert.deepEqual(plan.cards, frozen.cards);
const rendererHash = plan.baselineRendererHash,
  adapterHash = plan.baselineAdapterHash;
if (action === 'before') assert.equal(rendererHash, frozen.baselineRendererHash);
const selected = entries.filter(
  (e) =>
    selections[e.card.set].includes(e.card.collector_number) || /\bLand\b/.test(e.card.type_line),
);
const components = await fetchComponents(selected, {}),
  session = await openBrowser({ entries, components }),
  rows = [];
try {
  for (const e of entries) {
    const face = presentation(e).face,
      render = selected.includes(e);
    const result = await session.page.evaluate(
      async ({ face, render }) => {
        const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { ordinaryTextLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        await loadCanvasFonts();
        const context = document.createElement('canvas').getContext('2d'),
          layout = ordinaryTextLayout(context, face);
        const boundaries = layout.lines.flatMap((line, i) =>
          i > 0 && line.role === 'flavor' && layout.lines[i - 1].role === 'rules'
            ? [
                {
                  top: layout.lines[i - 1].inkBounds[1] + layout.lines[i - 1].inkBounds[3],
                  bottom: line.inkBounds[1],
                },
              ]
            : [],
        );
        const clearances = layout.separators.map((y, i) => ({
          y,
          above: y - boundaries[i].top,
          below: boundaries[i].bottom - y - 0.6,
        }));
        const variants = [];
        if (render) {
          const { composeCardTexture } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          for (const tier of ['inspect', 'table']) {
            const canvas = await composeCardTexture(
              { face, printingId: null, printedImage: null },
              tier,
              new AbortController().signal,
            );
            variants.push({ tier, data: canvas.toDataURL() });
            canvas.width = canvas.height = 0;
          }
        }
        return { layout, clearances, variants };
      },
      { face, render },
    );
    const images = render ? {} : undefined;
    for (const v of result.variants) {
      const bytes = Buffer.from(v.data.split(',')[1], 'base64'),
        file = `${e.id}.${v.tier}.png`;
      await atomicWrite(`${base}/${action}/${file}`, bytes);
      images[v.tier] = { file, sha256: hash(bytes) };
    }
    rows.push({
      id: e.id,
      set: e.card.set,
      number: e.card.collector_number,
      name: e.card.name,
      referenceHash: e.reference.sha256,
      face,
      inputHash: hash(JSON.stringify(face)),
      layout: result.layout,
      clearances: result.clearances,
      images,
    });
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(`${root}/games/magic/src`), rendererHash);
  await writeJson(`${base}/${action}/capture.json`, {
    rendererHash,
    adapterHash,
    planHash: hash(JSON.stringify(frozen)),
    rows,
  });
} finally {
  await session.close();
}
console.log(action, rows.length, selected.length);
