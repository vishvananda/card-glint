import { root, outputRoot, hash, sourceHash } from './common.mjs';
import { readFile, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { sagaTextMetric } from './saga-text-metrics.mjs';
const dir = `${outputRoot}/${process.argv[2] ?? 'aftermath-native-reviewed'}`;
const a = JSON.parse(await readFile(dir + '/audit.json'));
const entries = a.results.filter((r) => r.registration.accepted);
const refs = new Map(
  await Promise.all(
    entries.map(async (r) => [r.id, PNG.sync.read(await readFile(dir + '/' + r.files.reference))]),
  ),
);
const session = await openBrowser({ entries, components: a.components });
const results = [];
try {
  await session.page.evaluate(async () => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    await loadCanvasFonts();
  });
  for (let offset = 0; offset <= 4; offset++) {
    for (let size = 21; size <= 24.5; size += 0.5) {
      const rows = await session.page.evaluate(
        async ({ entries, size, offset }) => {
          const { AFTERMATH_TOP, AFTERMATH_BOTTOM } = await import(
            '/games/magic/src/presentation/aftermath-frame.ts'
          );
          const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
          const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
          const { wordingParagraphs } = await import('/games/magic/src/presentation/wording.ts');
          const { shortCenteredRules } = await import(
            '/games/magic/src/presentation/short-centered-rules.ts'
          );
          const c = document.createElement('canvas');
          c.width = 732;
          c.height = 1020;
          const ctx = c.getContext('2d');
          const n = document.createElement('canvas');
          n.width = 488;
          n.height = 680;
          const nc = n.getContext('2d');
          const out = [];
          for (const e of entries) {
            ctx.setTransform(1.5, 0, 0, 1.5, 0, 0);
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, 488, 680);
            const layouts = e.face.faces.map((face, i) => {
              const [x, y, width, height] = (i ? AFTERMATH_BOTTOM : AFTERMATH_TOP).rules;
              const p = wordingParagraphs(face),
                bounds = { x, y, width, height },
                typo = { leading: 0.98, paragraphGap: 0.32, flavorGap: 0.65, centerOffset: offset };
              let l = !i && shortCenteredRules(ctx, p, p, bounds, size, 14, 1, typo);
              l ||= layoutRules(ctx, p, bounds, size, 14, typo);
              ctx.save();
              if (i) {
                ctx.translate(488, 373);
                ctx.rotate(Math.PI / 2);
              }
              paintRulesLayout(ctx, l, new Map());
              ctx.restore();
              return {
                size: l.size,
                lines: l.lines.map((l) => l.runs.map((r) => r.text).join('')),
              };
            });
            nc.drawImage(c, 0, 0, 488, 680);
            out.push({ id: e.id, data: n.toDataURL(), layouts });
          }
          return out;
        },
        { entries, size, offset },
      );
      const scores = rows.map((r) => {
        const image = PNG.sync.read(Buffer.from(r.data.split(',')[1], 'base64')),
          ref = refs.get(r.id),
          e = entries.find((e) => e.id === r.id);
        return {
          id: r.id,
          name: e.name,
          set: e.set,
          layouts: r.layouts,
          top: sagaTextMetric(ref, image, [40, 280, 405, 80]).edgeF1[1],
          bottom: sagaTextMetric(ref, image, [37, 386, 179, 240]).edgeF1[1],
        };
      });
      results.push({ size, offset, scores });
      console.log(
        size,
        offset,
        scores.filter((r) => r.set === 'akh').reduce((n, r) => n + r.top, 0) /
          scores.filter((r) => r.set === 'akh').length,
        scores.filter((r) => r.set === 'akh').reduce((n, r) => n + r.bottom, 0) /
          scores.filter((r) => r.set === 'akh').length,
      );
    }
  }
  await writeFile(
    `${outputRoot}/aftermath-text-search.json`,
    JSON.stringify(
      {
        schemaVersion: 1,
        inputAuditHash: hash(await readFile(dir + '/audit.json')),
        rendererHash: await sourceHash(`${root}/games/magic/src`),
        normalizationRendererHash: a.rendererHash,
        exploratory: true,
        results,
      },
      null,
      2,
    ),
  );
} finally {
  await session.close();
}
