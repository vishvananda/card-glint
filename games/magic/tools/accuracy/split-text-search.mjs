import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, outputRoot, writeJson, hash, sourceHash, root } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { sagaTextMetric } from './saga-text-metrics.mjs';
const label = process.argv[2] ?? 'split-native-v2';
const bytes = await readFile(`${outputRoot}/${label}/audit.json`),
  audit = JSON.parse(bytes);
const session = await openBrowser({ entries: audit.results, components: audit.components });
const output = [];
try {
  await session.page.evaluate(async () => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    await loadCanvasFonts();
  });
  for (const entry of audit.results.filter((r) => r.registration.accepted)) {
    const reference = PNG.sync.read(
      await readFile(`${outputRoot}/${label}/${entry.files.reference}`),
    );
    const trials = await session.page.evaluate(async (face) => {
      const { splitPanels, panelRect } = await import(
        '/games/magic/src/presentation/split-layout.ts'
      );
      const { nativeSplitEra, hasFuse, splitGeometry } = await import(
        '/games/magic/src/presentation/split-frame.ts'
      );
      const { faceRects } = await import('/games/magic/src/presentation/special-frames.ts');
      const { wordingParagraphs } = await import('/games/magic/src/presentation/wording.ts');
      const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
      const { shortCenteredRules } = await import(
        '/games/magic/src/presentation/short-centered-rules.ts'
      );
      const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
      const { canvasAssetUrls, loadCanvasImages } = await import(
        '/games/magic/src/presentation/canvas-assets.ts'
      );
      const loaded = await loadCanvasImages(canvasAssetUrls(face), new AbortController().signal);
      const era = nativeSplitEra(face),
        panels = splitPanels(face),
        out = [];
      for (const [index, p] of panels.entries()) {
        const rect = panelRect(p, faceRects(p.face).rules).map((n, i) =>
          Math.round(n * (i % 2 ? 680 : 488)),
        );
        const paragraphs = wordingParagraphs(p.face),
          [x, y, width, height] = splitGeometry(era, hasFuse(face)).rules;
        for (let size = era === 'old' ? 23 : 19; size <= (era === 'old' ? 26 : 24); size += 0.25)
          for (const centerOffset of [0, 2, 4, 6]) {
            const bounds = { x, y, width, height },
              typography = { leading: 1.02, paragraphGap: 0.4, flavorGap: 0.65, centerOffset };
            const layout =
              (paragraphs.length === 1 && p.face.rulesAlignment?.mode !== 'left'
                ? shortCenteredRules(
                    document.createElement('canvas').getContext('2d'),
                    paragraphs,
                    paragraphs,
                    bounds,
                    size,
                    13,
                    2,
                    typography,
                  )
                : null) ??
              layoutRules(
                document.createElement('canvas').getContext('2d'),
                paragraphs,
                bounds,
                size,
                13,
                typography,
              );
            const canvas = document.createElement('canvas');
            canvas.width = 732;
            canvas.height = 1020;
            const c = canvas.getContext('2d');
            c.scale(1.5, 1.5);
            c.fillStyle = '#fff';
            c.fillRect(0, 0, 488, 680);
            c.translate(p.x, p.y);
            c.rotate(-Math.PI / 2);
            paintRulesLayout(c, layout, loaded.images);
            const crop = document.createElement('canvas');
            crop.width = rect[2];
            crop.height = rect[3];
            crop
              .getContext('2d')
              .drawImage(
                canvas,
                rect[0] * 1.5,
                rect[1] * 1.5,
                rect[2] * 1.5,
                rect[3] * 1.5,
                0,
                0,
                rect[2],
                rect[3],
              );
            out.push({
              index,
              rect,
              size,
              centerOffset,
              data: crop.toDataURL(),
              font: layout.size,
            });
            canvas.width = canvas.height = crop.width = crop.height = 0;
          }
      }
      loaded.dispose();
      return out;
    }, entry.face);
    for (const trial of trials) {
      const render = PNG.sync.read(Buffer.from(trial.data.split(',')[1], 'base64'));
      const [x, y, w, h] = trial.rect;
      const crop = new PNG({ width: w, height: h });
      for (let j = 0; j < h; j++)
        crop.data.set(
          reference.data.subarray(((y + j) * 488 + x) * 4, ((y + j) * 488 + x + w) * 4),
          j * w * 4,
        );
      output.push({
        id: entry.id,
        set: entry.set,
        ...Object.fromEntries(Object.entries(trial).filter(([k]) => k !== 'data')),
        score: sagaTextMetric(crop, render, [0, 0, w, h]).edgeF1[1],
      });
    }
    console.log(entry.set, entry.name);
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  await writeJson(`${outputRoot}/split-text-search.json`, {
    auditHash: hash(bytes),
    rendererHash: await sourceHash(`${root}/games/magic/src`),
    results: output,
  });
  for (const set of ['inv', 'apc', 'dis', 'dgm']) {
    const groups = new Map();
    for (const r of output.filter((r) => r.set === set)) {
      const key = r.size + '/' + r.centerOffset;
      const a = groups.get(key) ?? [];
      a.push(r.score);
      groups.set(key, a);
    }
    console.log(
      set,
      [...groups]
        .map(([key, a]) => ({ key, score: a.reduce((n, x) => n + x, 0) / a.length }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 5),
    );
  }
} finally {
  await session.close();
}
