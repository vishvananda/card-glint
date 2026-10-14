import { mkdir, readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import manifest from '../../assets.json' with { type: 'json' };
import { readJson, atomicWrite, writeJson, outputRoot } from './common.mjs';
import { cachedFetch, readObject } from './cache.mjs';
import { openBrowser } from './browser.mjs';
import { normalize, luminance } from './pixels-pure.mjs';
import { manaLandmark } from './mana-landmark.mjs';
import { manaGlyphMask, compareManaGlyph } from './mana-glyph-metrics.mjs';
import { median } from './metrics.mjs';
const directory = outputRoot + '/mana-glyph-sizing';
await mkdir(directory, { recursive: true });
const study = await readJson(outputRoot + '/mana-glyph-study/results.json');
const decisions = await readJson(
  new URL('../../fixtures/accuracy/mana-glyph-decisions.json', import.meta.url),
);
const groups = study.groups.filter((g) =>
  g.symbol === 'W'
    ? ['lea', 'leb', '2ed', '3ed', 'arn', 'leg'].includes(g.set)
    : ['leb', '3ed'].includes(g.set),
);
const components = [await cachedFetch(manifest.RETRO_SYMBOL_FONT)];
const browser = await openBrowser({ entries: [], components }, { fonts: false });
const fonts = {};
try {
  for (const ratio of [20.5 / 23.9, 21 / 23.4, 0.87]) {
    const data = await browser.page.evaluate(
      async ({ url, ratio }) => {
        document.fonts.add(
          await new FontFace('CardRenderer MTG Historic Symbols', `url("${url}")`).load(),
        );
        const { paintOriginalWhite } = await import(
          '/games/magic/src/presentation/historical-white.ts'
        );
        const c = document.createElement('canvas');
        c.width = c.height = 96;
        paintOriginalWhite(c.getContext('2d'), 0, 0, 96, 96 * ratio);
        return c.toDataURL();
      },
      { url: manifest.RETRO_SYMBOL_FONT, ratio },
    );
    const bytes = Buffer.from(data.split(',')[1], 'base64');
    fonts[ratio] = PNG.sync.read(bytes);
    await atomicWrite(directory + '/white-font-' + ratio.toFixed(4) + '.png', bytes);
  }
} finally {
  await browser.close();
}
const results = [];
for (const g of groups) {
  const ratio = ['lea', 'leb', '2ed'].includes(g.set)
    ? 20.5 / 23.9
    : g.set === '3ed'
      ? 21 / 23.4
      : 0.87;
  const families =
    g.symbol === 'W'
      ? ['historic-font', 'conjurer-old', 'mse-old']
      : [decisions.decisions.find((d) => d.set === g.set && d.symbol === g.symbol).family];
  const candidates = {};
  for (const family of families) {
    const im =
      family === 'historic-font'
        ? fonts[ratio]
        : PNG.sync.read(
            await readFile(outputRoot + '/mana-glyph-study/' + g.symbol + '-' + family + '.png'),
          );
    const circle = {
      x: (im.width - 1) / 2,
      y: (im.height - 1) / 2,
      radius: Math.min(im.width, im.height) / 2,
    };
    candidates[family] = [0.38, 0.48, 0.58].map((thresholdFraction) =>
      manaGlyphMask(im, circle, false, { normalizeBounds: false, thresholdFraction }),
    );
  }
  const rows = [];
  for (const row of g.rows) {
    const raw = PNG.sync.read(await readObject(row.reference)),
      im = normalize(row.doubleNormalize ? normalize(raw) : raw, row.transform);
    const circle = manaLandmark(luminance(im), 488, 680, {
      x: 435,
      y: row.frameAccepted === false ? 42 : 46,
      range: 9,
      radiusRange: [10.5, 14.5],
      polarity: 'bright',
    });
    const masks = [0.38, 0.48, 0.58].map((thresholdFraction) =>
      manaGlyphMask(im, circle, false, { normalizeBounds: false, thresholdFraction }),
    );
    const valid = masks.every((m) => m.status === 'measured') && circle.status === 'measured';
    const measured = {
      id: row.id,
      name: row.name,
      referenceHash: row.reference.sha256,
      cohort: row.cohort,
      circle,
      valid,
    };
    if (valid) {
      measured.ratio = masks[1].discRatio;
      measured.scores = Object.fromEntries(
        families.map((f) => [
          f,
          {
            score: median(masks.map((m, i) => compareManaGlyph(m.ink, candidates[f][i].ink).score)),
            sourceRatio: candidates[f][1].discRatio,
          },
        ]),
      );
      const p = new PNG({ width: 40, height: 40 });
      for (let i = 0; i < 1600; i++) {
        p.data[i * 4] = p.data[i * 4 + 1] = p.data[i * 4 + 2] = masks[1].ink[i] ? 0 : 255;
        p.data[i * 4 + 3] = 255;
      }
      await atomicWrite(directory + '/' + row.id + '-ink.png', PNG.sync.write(p));
    }
    rows.push(measured);
  }
  const accepted = rows.filter((r) => r.valid);
  const ranking = families.map((f) => ({
    family: f,
    calibration: median(
      accepted.filter((r) => r.cohort === 'calibration').map((r) => r.scores[f].score),
    ),
    validation: median(
      accepted.filter((r) => r.cohort === 'validation').map((r) => r.scores[f].score),
    ),
    sourceRatio: candidates[f][1].discRatio,
  }));
  const result = {
    set: g.set,
    symbol: g.symbol,
    ratio: ratio,
    accepted: accepted.length,
    scanRatio: [0, 1].map((k) => median(accepted.map((r) => r.ratio[k]))),
    ranking,
    rows,
  };
  results.push(result);
  console.log(JSON.stringify({ ...result, rows: undefined }));
  await writeJson(directory + '/results.json', {
    version: 1,
    policy:
      'Independent bright-disc fit with physical radius bounds; rejected/ambiguous fits excluded. No normalization of glyph bounds. Ink overlap + edge F1 at three threshold levels, fixed disjoint cohorts. This measures glyph-to-disc sizing, not whole-card accuracy.',
    groups: results,
  });
}
