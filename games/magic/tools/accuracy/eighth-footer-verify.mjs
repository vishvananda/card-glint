import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import {
  cacheRoot,
  fixtureRoot,
  outputRoot,
  readJson,
  writeJson,
  atomicWrite,
  hash,
  sourceHash,
  root,
} from './common.mjs';
import { readObject } from './cache.mjs';
import { fetchComponents } from './components.mjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareLettering } from './lettering-metrics.mjs';

const directory = cacheRoot + '/rollout/major-calibration-frame-footer-v0214';
const groups = [
  '8ed-eighth-white',
  '9ed-eighth-white',
  '10e-eighth-black',
  'm10-eighth-black',
  'm14-eighth-black',
  'mrd-eighth-black',
];
const entries = [],
  omitted = [];
for (const group of groups) {
  const capture = await readJson(`${directory}/${group}.json`);
  const measure = await readJson(`${directory}/${group}-measure.json`);
  for (const sample of capture.samples) {
    const pose = measure.rows.find((r) => r.id === sample.id);
    if (pose?.fit.accepted) entries.push({ ...sample, set: capture.set, pose });
    else
      omitted.push({
        id: sample.id,
        name: sample.name,
        set: capture.set,
        reason: pose?.fit.reason ?? 'Frame normalization rejected',
      });
  }
}
const development = new Set(entries.filter((r) => r.cohort === 'calibration').map((r) => r.name));
const rendererHash = await sourceHash(root + '/games/magic/src');
const cssHash = hash(await readFile(root + '/games/magic/fonts.css'));
const components = await fetchComponents(entries, {}, (e) => e.face);
const session = await openBrowser({ entries, components });
const rows = [],
  artifacts = outputRoot + '/eighth-footer';
try {
  for (const e of entries) {
    const captured = await session.page.evaluate(async (face) => {
      const { paintEighthFooter } = await import('/games/magic/src/presentation/eighth-footer.ts');
      const { loadCanvasImages, canvasAssetUrls } = await import(
        '/games/magic/src/presentation/canvas-assets.ts'
      );
      const { resolveCardProfile } = await import('/games/magic/src/presentation/profile.ts');
      const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal);
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const c = await composeCardTexture(
        { face, printingId: null, printedImage: null },
        'inspect',
        new AbortController().signal,
        { loadImages: async () => ({ images: loaded.images, dispose() {} }) },
      );
      try {
        const stencils = [true, false].map((legacy) => {
          const tile = document.createElement('canvas');
          tile.width = 732;
          tile.height = 1020;
          const t = tile.getContext('2d');
          t.scale(1.5, 1.5);
          t.fillStyle = '#808080';
          t.fillRect(0, 0, 488, 680);
          if (!legacy) paintEighthFooter(t, face, loaded.images);
          else {
            t.fillStyle = '#17140f';
            t.font = '700 29px "CardRenderer MTG Matrix", Georgia';
            t.textAlign = 'center';
            t.textBaseline = 'middle';
            if (face.power != null && face.toughness != null)
              t.fillText(
                `${face.power}/${face.toughness}`,
                ((1461 + 414 * 0.52) / 2010) * 488,
                ((2481 + 218 * 0.52) / 2814) * 680,
                (414 / 2010) * 488 * 0.85,
              );
            t.textAlign = 'left';
            t.textBaseline = 'top';
            t.fillStyle = ['B', 'Colourless', 'Land'].includes(resolveCardProfile(face).boxes)
              ? '#fff'
              : '#17140f';
            t.font = '14px "CardRenderer MTG Matrix", Georgia';
            t.fillText(face.artist ?? '', (150 / 2010) * 488, (1938 / 2100) * 680, 0.81 * 488);
          }
          const data = tile.toDataURL();
          tile.width = tile.height = 0;
          return data;
        });
        return { encoded: c.toDataURL(), stencils };
      } finally {
        c.width = c.height = 0;
        loaded.dispose();
      }
    }, e.face);
    const after = normalize(PNG.sync.read(Buffer.from(captured.encoded.split(',')[1], 'base64')));
    const beforeBytes = await readFile(directory + '/' + e.images.blank.file);
    if (hash(beforeBytes) !== e.images.blank.sha256) throw Error('Baseline capture changed');
    const before = normalize(PNG.sync.read(beforeBytes));
    const reference = normalize(PNG.sync.read(await readObject(e.reference)), e.pose.fit.transform);
    const regions = {
      ...(!/Hildebrandt/.test(e.face.artist ?? '') ? { artist: [31, 616, 317, 24] } : {}),
      ...(e.face.power != null && e.face.toughness != null ? { stats: [379, 605, 65, 34] } : {}),
    };
    const metrics = {},
      glyphMetrics = {};
    const stencils = captured.stencils.map((data) =>
      normalize(PNG.sync.read(Buffer.from(data.split(',')[1], 'base64'))),
    );
    for (const [part, rect] of Object.entries(regions)) {
      const ref = cropGray(reference, rect);
      glyphMetrics[part] = stencils.map((p) =>
        compareLettering(ref.gray, cropGray(p, rect).gray, ref.width, ref.height),
      );
      metrics[part] = [before, after].map((p) =>
        compareLettering(ref.gray, cropGray(p, rect).gray, ref.width, ref.height),
      );
    }
    // Only retain tight review crops and one final face per sample; no candidate
    // image grids or duplicate full reference rasters accumulate in the cache.
    const images = {};
    for (const [label, p] of Object.entries({ reference, before, after })) {
      const crop = new PNG({ width: 450, height: 60 });
      PNG.bitblt({ ...p, data: Buffer.from(p.data) }, crop, 24, 600, 450, 60, 0, 0);
      const bytes = PNG.sync.write(crop),
        file = `${e.id}-${label}.png`;
      await atomicWrite(artifacts + '/' + file, bytes);
      images[label] = { file, sha256: hash(bytes) };
    }
    const row = {
      id: e.id,
      name: e.name,
      set: e.set,
      material: e.material,
      cohort: development.has(e.name) ? 'calibration' : 'validation',
      referenceHash: e.reference.sha256,
      fitHash: e.pose.fitHash,
      normalization: e.pose.fit.transform,
      beforeHash: e.images.blank.sha256,
      metrics,
      glyphMetrics,
      images,
      ...(/Hildebrandt/.test(e.face.artist ?? '')
        ? { artistIssue: 'Printed artist wording differs from metadata' }
        : {}),
    };
    rows.push(row);
    console.log(
      e.set,
      e.name,
      Object.fromEntries(
        Object.entries(metrics).map(([p, m]) => [p, m.map((x) => +x.edgeF1.toFixed(3))]),
      ),
    );
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  if (
    rendererHash !== (await sourceHash(root + '/games/magic/src')) ||
    cssHash !== hash(await readFile(root + '/games/magic/fonts.css'))
  )
    throw Error('Renderer changed during verification');
} finally {
  await session.close();
}
const mean = (a) => (a.length ? a.reduce((n, x) => n + x, 0) / a.length : null);
const summary = ['all', '8ed', '9ed', '10e', 'm10', 'm14', 'mrd'].flatMap((set) =>
  ['artist', 'stats'].map((part) => {
    const reserved = rows.filter(
      (r) => (set === 'all' || r.set === set) && r.cohort === 'validation' && r.metrics[part],
    );
    return {
      set,
      part,
      reserved: reserved.length,
      before: mean(reserved.map((r) => r.metrics[part][0].edgeF1)),
      after: mean(reserved.map((r) => r.metrics[part][1].edgeF1)),
      glyphBefore: mean(reserved.map((r) => r.glyphMetrics[part][0].edgeF1)),
      glyphAfter: mean(reserved.map((r) => r.glyphMetrics[part][1].edgeF1)),
      glyphRegressions: reserved
        .filter((r) => r.glyphMetrics[part][1].edgeF1 < r.glyphMetrics[part][0].edgeF1 - 0.02)
        .map((r) => r.id),
      regressions: reserved
        .filter((r) => r.metrics[part][1].edgeF1 < r.metrics[part][0].edgeF1 - 0.02)
        .map((r) => r.id),
    };
  }),
);
await writeJson(fixtureRoot + '/eighth-footer-verified.json', {
  schemaVersion: 1,
  scope:
    'Ordinary nonfoil 8ED/9ED white stock and 10E/M10/M14/MRD black stock. Frozen frame-only affine/scale normalization; no footer anchors. Baseline is the v0.2.14 production raster with only the set symbol omitted, outside every footer ROI.',
  rendererHash,
  cssHash,
  components: components.map((a) => ({ url: a.url, sha256: a.sha256 })),
  methodHash: hash(await readFile(new URL('./eighth-footer-verify.mjs', import.meta.url))),
  summary,
  omitted,
  rows,
});
console.log(JSON.stringify(summary, null, 2));
