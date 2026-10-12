import { measureRetroBevel } from './retro-bevel-ink.mjs';
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
import { readObject } from './cache.mjs';
import { normalize } from './pixels.mjs';
import { fetchComponents } from './components.mjs';
import { presentation } from './adapter.mjs';
import { openBrowser } from './browser.mjs';
const [action = 'before'] = process.argv.slice(2),
  base = `${outputRoot}/retro-bevel`,
  planFile = `${fixtureRoot}/retro-bevel-plan.json`;
assert.ok(['before', 'after', 'compare'].includes(action));
const entries = [],
  annotations = {},
  cachedComponents = [];
for (const set of ['mir', 'tmp']) {
  const s = await readJson(`${cacheRoot}/sets/${set}.json`),
    detail = await readJson(`${fixtureRoot}/${set}/annotations-retro-details.json`),
    current = await readJson(`${fixtureRoot}/${set}/annotations.json`);
  cachedComponents.push(...s.components);
  const controls = [...'WUBRG'].map((color) =>
    s.entries.find((e) => !e.issue && e.card.colors.join('') === color),
  );
  entries.push(...s.entries.filter((e) => !e.issue && e.card.colors.length > 1), ...controls);
  for (const e of s.entries) {
    const d = detail.cards?.[e.id] ?? {},
      c = current.cards?.[e.id];
    annotations[e.id] = {
      ...d,
      ...(c?.reviewedFields?.includes('artist')
        ? {
            artist: c.artist,
            reviewedFields: [...new Set([...(d.reviewedFields ?? []), 'artist'])],
          }
        : {}),
    };
  }
}
const geometry = {
  outer: [(160 / 1500) * 488, (1255 / 2100) * 680, (1186 / 1500) * 488, (606 / 2100) * 680],
  inset: [(17 / 1500) * 488, (17 / 2100) * 680],
};
if (action === 'compare') {
  const before = await readJson(`${base}/before/capture.json`),
    after = await readJson(`${base}/after/capture.json`);
  assert.equal(before.planHash, after.planHash);
  const rows = [];
  for (const e of entries) {
    const b = before.rows.find((r) => r.id === e.id),
      a = after.rows.find((r) => r.id === e.id),
      scores = {};
    const { artist: oldArtist, ...oldFace } = b.face,
      { artist: newArtist, ...newFace } = a.face;
    assert.deepEqual(oldFace, newFace);
    for (const tier of ['inspect', 'table']) {
      const images = [];
      for (const [revision, row] of [
        ['before', b],
        ['after', a],
      ]) {
        const bytes = await readFile(`${base}/${revision}/${row.images[tier].file}`);
        assert.equal(hash(bytes), row.images[tier].sha256);
        images.push(PNG.sync.read(bytes));
      }
      const [oldImage, newImage] = images;
      let changed = 0,
        outsideAllowed = 0;
      const [x, y, w, h] = geometry.outer,
        [ix, iy] = geometry.inset;
      for (let py = 0; py < oldImage.height; py++)
        for (let px = 0; px < oldImage.width; px++) {
          const i = (py * oldImage.width + px) * 4;
          if (oldImage.data.subarray(i, i + 4).equals(newImage.data.subarray(i, i + 4))) continue;
          changed++;
          const rx = ((px + 0.5) * 488) / oldImage.width,
            ry = ((py + 0.5) * 680) / oldImage.height;
          const rim =
            rx >= x - 2 &&
            rx <= x + w + 2 &&
            ry >= y - 2 &&
            ry <= y + h + 2 &&
            (rx < x + ix + 2 || rx > x + w - ix - 2 || ry < y + iy + 2 || ry > y + h - iy - 2);
          const credit = oldArtist !== newArtist && rx > 40 && rx < 390 && ry > 605 && ry < 635;
          if (!(e.card.colors.length > 1 && rim) && !credit) outsideAllowed++;
        }
      assert.equal(outsideAllowed, 0, `Changed outside bevel/credit: ${e.card.name}`);
      if (e.card.colors.length === 1) assert.equal(changed, 0);
      else if (!/^Enchant Land$/.test(a.face.typeLine))
        assert.ok(changed > 100, 'Gold bevel correction did not paint');
      scores[tier] = {
        changed,
        outsideAllowed,
        before: measureRetroBevel(normalize(oldImage)),
        after: measureRetroBevel(normalize(newImage)),
      };
    }
    rows.push({
      id: e.id,
      name: e.card.name,
      set: e.card.set,
      number: e.card.collector_number,
      referenceHash: e.reference.sha256,
      control: e.card.colors.length === 1,
      inputReview: /^Enchant Land$/.test(a.face.typeLine)
        ? 'Historical Enchant Land label currently selects a land asset; original type semantics need an adapter fix.'
        : null,
      referencePolarity: measureRetroBevel(normalize(PNG.sync.read(await readObject(e.reference)))),
      artistBefore: oldArtist,
      artistAfter: newArtist,
      scores,
      images: { before: b.images, after: a.images },
    });
  }
  await writeJson(`${fixtureRoot}/retro-bevel-measurement.json`, {
    schemaVersion: 1,
    scope:
      'Mirage/Tempest gold paper bevel orientation only. Lighten/darken the four bevel facets in place; preserve shadow texture coordinates, center texture, black keyline, geometry and text. Artist spelling is a separately reviewed input. Five monocolor controls per set. Wellspring retains an original-type adapter error and is not certified as a gold-frame result. Polarity is judged at inspect resolution; tiny table bevels remain diagnostic only. Pixel-difference containment does not certify scan alignment or all typography.',
    baselineRendererHash: before.rendererHash,
    rendererHash: after.rendererHash,
    planHash: after.planHash,
    methodHash: hash(await readFile(new URL('./retro-bevel-ink.mjs', import.meta.url))),
    geometry,
    summary: {
      gold: rows.filter((r) => !r.control).length,
      affectedGold: rows.filter((r) => !r.control && !r.inputReview).length,
      inputReview: rows.filter((r) => r.inputReview).map((r) => r.id),
      controls: rows.filter((r) => r.control).length,
      outsideAllowed: 0,
    },
    rows,
  });
  console.log('Compared', rows.length);
  process.exit(0);
}
const rendererHash = await sourceHash(`${root}/games/magic/src`),
  plan = {
    schemaVersion: 1,
    baselineRendererHash: rendererHash,
    geometry,
    cards: entries.map((e) => ({
      id: e.id,
      set: e.card.set,
      number: e.card.collector_number,
      name: e.card.name,
      referenceHash: e.reference.sha256,
    })),
  };
if (action === 'before') {
  try {
    const old = await readJson(planFile);
    assert.equal(old.baselineRendererHash, rendererHash);
  } catch (e) {
    if (e.code !== 'ENOENT') throw e;
    await writeJson(planFile, plan);
  }
}
const frozen = await readJson(planFile);
assert.deepEqual(frozen.cards, plan.cards);
const components = [...cachedComponents, ...(await fetchComponents(entries, {}))],
  session = await openBrowser({ entries, components }),
  rows = [];
try {
  for (const e of entries) {
    const face = {
        ...presentation(e, annotations).face,
        land: /\bLand\b/.test(e.card.type_line),
        artifact: /\bArtifact\b/.test(e.card.type_line),
        creature: /\bCreature\b/.test(e.card.type_line),
      },
      images = {},
      variants = await session.page.evaluate(async (face) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const out = [];
        for (const tier of ['inspect', 'table']) {
          const c = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            tier,
            new AbortController().signal,
          );
          out.push({ tier, data: c.toDataURL() });
          c.width = c.height = 0;
        }
        return out;
      }, face);
    for (const v of variants) {
      const bytes = Buffer.from(v.data.split(',')[1], 'base64'),
        file = `${e.id}.${v.tier}.png`;
      await atomicWrite(`${base}/${action}/${file}`, bytes);
      images[v.tier] = { file, sha256: hash(bytes) };
    }
    rows.push({
      id: e.id,
      face,
      inputHash: hash(JSON.stringify(face)),
      referenceHash: e.reference.sha256,
      images,
    });
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(`${root}/games/magic/src`), rendererHash);
  await writeJson(`${base}/${action}/capture.json`, {
    rendererHash,
    planHash: hash(JSON.stringify(frozen)),
    rows,
  });
} finally {
  await session.close();
}
console.log(action, rows.length);
