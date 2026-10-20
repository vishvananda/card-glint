import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import ts from 'typescript';
import assert from 'node:assert/strict';
import { cachedFetch, readObject } from '../cache.mjs';
import { presentation } from '../adapter.mjs';
import { normalizePrintingText } from '../printing-text.mjs';
import { fetchComponents } from '../components.mjs';
import { openBrowser } from '../browser.mjs';
const [root, run = 'baseline'] = process.argv.slice(2);
if (!root || !/^[a-z0-9-]+$/.test(run)) throw Error('Pass external study and run name');
const inputs = JSON.parse(await readFile(root + '/inputs.json')),
  sets = new Map(),
  entries = [],
  excluded = [];
for (const r of inputs.records) {
  if (!sets.has(r.set)) {
    const source = await cachedFetch('https://mtgjson.com/api/v5/' + r.set.toUpperCase() + '.json');
    sets.set(r.set, { source, data: JSON.parse(await readObject(source)).data });
  }
  const provider = sets.get(r.set),
    matches = provider.data.cards.filter(
      (c) => c.language === 'English' && c.identifiers?.scryfallId === r.id,
    );
  assert.equal(matches.length, 1, r.name);
  const original = matches[0];
  if (typeof original.originalText !== 'string' || typeof original.originalType !== 'string') {
    excluded.push({
      id: r.id,
      name: r.name,
      reason: 'Missing original printing wording in MTGJSON; no Oracle substitution',
    });
    continue;
  }
  const entry = {
    id: r.id,
    card: r.card,
    reference: r.reference,
    art: r.art,
    category: 'planeswalker',
  };
  const face = presentation(
    entry,
    {},
    { [r.id]: { originalText: normalizePrintingText(original.originalText) } },
  ).face;
  face.typeLine =
    r.card.released_at < '2017-09-29'
      ? original.originalType.replace(/^Legendary (?=Planeswalker\b)/, '')
      : original.originalType;
  face.frameStyle = 'modern';
  face.legendary = false;
  entry.face = face;
  entry.originalSource = {
    asset: provider.source,
    uuid: original.uuid,
    text: original.originalText,
    type: original.originalType,
    review:
      face.typeLine === original.originalType
        ? null
        : 'Pre-Ixalan printed supertype, verified historical rule; https://magic.wizards.com/en/news/feature/ixalan-release-notes',
  };
  entries.push(entry);
}
const components = [
  ...(await fetchComponents(entries, {}, (e) => e.face)),
  ...Object.values(inputs.sources),
];
await mkdir(root + '/' + run, { recursive: true });
await writeFile(
  root + '/' + run + '/inputs.json',
  JSON.stringify({ entries, components }, null, 2) + '\n',
);
const session = await openBrowser(
  { entries, components },
  {
    plugins: [
      {
        name: 'walker-control-type',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('/presentation/planeswalker-material.ts')) {
            const ast = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true);
            const fn = ast.statements.find(
              (n) => ts.isFunctionDeclaration(n) && n.name?.text === 'background',
            );
            const ret = fn.body.statements
              .find(ts.isTryStatement)
              .tryBlock.statements.find(ts.isReturnStatement);
            assert(ret);
            const at = ret.getStart(ast);
            return (
              code.slice(0, at) +
              `
          const mode = (globalThis as any).__walkerBgMode;
          if (mode === 'bgBlack' || mode === 'bgWhite' || mode === 'bgUV') {
            const p=ctx.getImageData(0,0,c.width,c.height);
            for(let y=0;y<c.height;y++) for(let x=0;x<c.width;x++) {
              const i=(y*c.width+x)*4;
              p.data[i]=mode==='bgWhite'?255:mode==='bgUV'?Math.round(255*(x+.5)/c.width):0;
              p.data[i+1]=mode==='bgWhite'?255:mode==='bgUV'?Math.round(255*(y+.5)/c.height):0;
              p.data[i+2]=mode==='bgWhite'?255:0;
            }
            ctx.putImageData(p,0,0);
          }
          ` +
              code.slice(at)
            );
          }
          if (!id.endsWith('/presentation/planeswalker-type.ts')) return;
          const ast = ts.createSourceFile(id, code, ts.ScriptTarget.Latest, true);
          const fn = ast.statements.find(
            (n) => ts.isFunctionDeclaration(n) && n.name?.text === 'paintPlaneswalkerType',
          );
          assert(fn?.body);
          const at = fn.body.getStart(ast) + 1;
          return (
            code.slice(0, at) +
            '\n if ((globalThis as any).__walkerOmitType) return;\n' +
            code.slice(at)
          );
        },
      },
    ],
  },
);
const receipt = {
  schema: 1,
  run,
  sourceCommit: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  rendererVersion: JSON.parse(await readFile('package.json')).version,
  rasters: {},
  records: [],
  excluded,
};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const [index, e] of entries.entries()) {
    const variants = await session.page.evaluate(
      async ({ face, baseline }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { loadCanvasImages } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { profileAssets } = await import('/games/magic/src/presentation/assets.ts');
        const { resolveCardProfile } = await import('/games/magic/src/presentation/profile.ts');
        const { faceFrame } = await import('/games/magic/src/presentation/special-frames.ts');
        const bgUrl = profileAssets(resolveCardProfile(face), faceFrame(face)).background;
        const paint = async (mode) => {
          window.__walkerOmitType = mode !== 'full';
          const previousBgMode = window.__walkerBgMode;
          window.__walkerBgMode = mode;
          const { planeswalkerBitmapCache } = await import(
            '/games/magic/src/presentation/material-bitmap-cache.ts'
          );
          if (mode.startsWith('bg') || previousBgMode?.startsWith('bg'))
            planeswalkerBitmapCache.clear();
          const im = await composeCardTexture(
            { face, printingId: null, printedImage: null },
            'inspect',
            new AbortController().signal,
            mode.startsWith('bg')
              ? {
                  loadImages: async (urls, s) => {
                    const loaded = await loadCanvasImages(urls, s);
                    const src = loaded.images.get(bgUrl);
                    if (!src) throw Error('Missing background');
                    const c = document.createElement('canvas');
                    c.width = src.width;
                    c.height = src.height;
                    const ctx = c.getContext('2d');
                    ctx.drawImage(src, 0, 0);
                    const p = ctx.getImageData(0, 0, c.width, c.height);
                    for (let y = 0; y < c.height; y++)
                      for (let x = 0; x < c.width; x++) {
                        const i = (y * c.width + x) * 4;
                        p.data[i] =
                          mode === 'bgUV'
                            ? Math.round((255 * (x + 0.5)) / c.width)
                            : mode === 'bgWhite'
                              ? 255
                              : 0;
                        p.data[i + 1] =
                          mode === 'bgUV'
                            ? Math.round((255 * (y + 0.5)) / c.height)
                            : mode === 'bgWhite'
                              ? 255
                              : 0;
                        p.data[i + 2] = mode === 'bgWhite' ? 255 : 0;
                      }
                    ctx.putImageData(p, 0, 0);
                    const bitmap = await createImageBitmap(c);
                    const images = Object.assign(new Map(loaded.images), loaded.images);
                    images.set(bgUrl, bitmap);
                    return {
                      images,
                      dispose() {
                        bitmap.close();
                        loaded.dispose();
                      },
                    };
                  },
                }
              : undefined,
          );
          const c = document.createElement('canvas');
          c.width = im.width;
          c.height = im.height;
          c.getContext('2d').drawImage(im, 0, 0);
          im.close?.();
          return c.toDataURL();
        };
        const result = { full: await paint('full') };
        if (baseline)
          for (const mode of ['underType', 'bgBlack', 'bgWhite', 'bgUV'])
            result[mode] = await paint(mode);
        return result;
      },
      { face: e.face, baseline: run === 'baseline' || (run === 'source' && !e.card.colors.length) },
    );
    for (const [mode, url] of Object.entries(variants)) {
      const bytes = Buffer.from(url.split(',')[1], 'base64'),
        file = e.id + '-' + mode + '.png';
      await writeFile(root + '/' + run + '/' + file, bytes);
      receipt.rasters[file] = createHash('sha256').update(bytes).digest('hex');
    }
    receipt.records.push({ id: e.id, name: e.card.name, type: e.face.typeLine });
    console.log(index + 1 + '/' + entries.length + ' ' + e.card.set + ' ' + e.card.name);
  }
  assert.deepEqual(session.faults, []);
  await writeFile(root + '/' + run + '/receipt.json', JSON.stringify(receipt, null, 2) + '\n');
} finally {
  await session.close();
}
