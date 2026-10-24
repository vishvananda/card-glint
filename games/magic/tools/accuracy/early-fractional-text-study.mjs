// Native ABU metrics experiment. Pixels stay outside the checkout; no downloads.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash, sourceHash, root, objectFile, writeJson } from './common.mjs';
import { earlyFractionalInputs } from './early-fractional-inputs.mjs';
import { openBrowser } from './browser.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { nativeGrayCrop } from './abu-type-objective.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';

const [out, setArgument = 'lea,leb,2ed', limitArgument] = process.argv.slice(2);
assert(out, 'Usage: early-fractional-text-study.mjs OUT [lea,leb,2ed] [LIMIT]');
const limit = limitArgument === undefined ? undefined : Number(limitArgument);
assert(limit === undefined || (Number.isInteger(limit) && limit > 0));
const snapshot = await earlyFractionalInputs(setArgument.split(','));
if (limit !== undefined) snapshot.entries = snapshot.entries.slice(0, limit);
const source = {
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  tools: await Promise.all(
    [
      'early-fractional-text-study.mjs',
      'early-fractional-inputs.mjs',
      'browser.mjs',
      'abu-assets.mjs',
      'text-filled-objective.mjs',
      'abu-type-objective.mjs',
      'pixels-pure.mjs',
      'edges.mjs',
    ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
  ),
  fontsHash: hash(await readFile(path.join(root, 'games/magic/fonts.css'))),
  inputsHash: hash(JSON.stringify(snapshot)),
  census: limit === undefined,
  metric:
    'Fixed rules region [54,405,390,197], 55% symmetric local-contrast edges + 45% filled ink. Diagnostic /100; no scan-pose fitting or asset/color change.',
};
await mkdir(out, { recursive: true });
await writeJson(path.join(out, 'inputs.json'), snapshot);
const replace = (source, needle, value) => {
  assert.equal(source.split(needle).length, 2, 'Native typography hook changed: ' + needle);
  return source.replace(needle, value);
};
const transformed = {};
const session = await openBrowser(snapshot, {
  plugins: [
    {
      name: 'early-fractional-native-study',
      enforce: 'pre',
      transform(source, id) {
        const file = id.split('/').at(-1);
        let code = source;
        if (file === 'rules-layout.ts')
          code = replace(
            code,
            '): RulesLayout {',
            '): RulesLayout {\n  if ((globalThis as any).__earlyFractional) typography = {...typography, fractionalMetrics:true};',
          );
        else if (file === 'rules-paint.ts')
          code = replace(
            code,
            '    ink.fillStyle = color;',
            "    ink.fillStyle = color;\n    if ((globalThis as any).__earlyFractionalPaint && layout.fractionalMetrics) {ink.textRendering='geometricPrecision';ink.fontKerning='normal';}",
          );
        else if (file === 'retro-rules.ts')
          code = replace(
            code,
            '    return adjustCalibrationRules(context, face, layout);',
            '    const result=adjustCalibrationRules(context, face, layout);\n    (globalThis as any).__earlyLayout=result;\n    return result;',
          );
        else return;
        const proof = { before: hash(source), after: hash(code) };
        if (transformed[file]) assert.deepEqual(transformed[file], proof);
        transformed[file] = proof;
        return code;
      },
    },
  ],
});
const rows = [];
try {
  source.browser = session.browser.version();
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    globalThis.__earlyCompose = (
      await import('/games/magic/src/presentation/canvas-face.ts')
    ).composeCardTexture;
    globalThis.__earlyAssets = await import('/games/magic/tools/accuracy/abu-assets.mjs');
    globalThis.__earlyUrls = (
      await import('/games/magic/src/presentation/canvas-assets.ts')
    ).canvasAssetUrls;
  });
  for (const entry of snapshot.entries) {
    const dir = path.join(out, entry.set, entry.id);
    await mkdir(dir, { recursive: true });
    const rawBytes = await readFile(objectFile(entry.reference));
    assert.equal(hash(rawBytes), entry.reference.sha256);
    const scan = normalize(PNG.sync.read(rawBytes), entry.pose.transform);
    const rect = [54, 405, 390, 197],
      gray = cropGray(scan, rect).gray;
    const objective = new TextFilledObjective(gray, 390, 197, new Uint8Array(gray.length).fill(1));
    const result = await session.page.evaluate(async (entry) => {
      const signal = new AbortController().signal;
      const lease = await globalThis.__earlyAssets.loadAccuracyImages(
        globalThis.__earlyUrls(entry.face),
        signal,
        entry.face.illustration,
      );
      const variants = [];
      try {
        for (const [id, fractional, paint] of [
          ['current', false, false],
          ['fractional-layout', true, false],
          ['fractional-consistent', true, true],
        ]) {
          globalThis.__earlyFractional = fractional;
          globalThis.__earlyFractionalPaint = paint;
          delete globalThis.__earlyLayout;
          const image = await globalThis.__earlyCompose(
            { face: entry.face, printingId: entry.id, printedImage: null },
            'inspect',
            signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          try {
            variants.push({
              id,
              png: image.toDataURL().split(',')[1],
              layout: globalThis.__earlyLayout ?? null,
            });
          } finally {
            image.width = image.height = 0;
          }
        }
      } finally {
        delete globalThis.__earlyFractional;
        delete globalThis.__earlyFractionalPaint;
        lease.dispose();
      }
      return variants;
    }, entry);
    const variants = [],
      baseline = PNG.sync.read(Buffer.from(result[0].png, 'base64'));
    for (const variant of result) {
      const bytes = Buffer.from(variant.png, 'base64'),
        image = PNG.sync.read(bytes);
      assert.deepEqual([image.width, image.height], [732, 1020]);
      let changed = 0,
        outside = 0,
        alpha = 0;
      for (let p = 0; p < 732 * 1020; p++) {
        const i = p * 4,
          x = (p % 732) / 1.5,
          y = Math.floor(p / 732) / 1.5;
        if (image.data[i + 3] !== baseline.data[i + 3]) alpha++;
        if ([0, 1, 2, 3].some((k) => image.data[i + k] !== baseline.data[i + k])) {
          changed++;
          if (x < 50 || x > 452 || y < 400 || y > 605) outside++;
        }
      }
      assert.equal(outside, 0, 'Typography escaped the rules box: ' + entry.name);
      assert.equal(alpha, 0);
      await writeFile(path.join(dir, variant.id + '.png'), bytes);
      variants.push({
        id: variant.id,
        renderHash: hash(bytes),
        changed,
        outside,
        alpha,
        layout: variant.layout,
        score: variant.layout?.lines.length ? objective.score(nativeGrayCrop(image, rect)) : null,
      });
    }
    const row = {
      id: entry.id,
      name: entry.name,
      set: entry.set,
      material: entry.material,
      referenceHash: entry.reference.sha256,
      poseHash: hash(JSON.stringify(entry.pose)),
      accepted: entry.pose.accepted,
      variants,
    };
    rows.push(row);
    if (rows.length % 10 === 0 || rows.length === snapshot.entries.length)
      await writeJson(path.join(out, 'study.json'), {
        schema: 1,
        source,
        transformed,
        faults: session.faults,
        completed: rows.length,
        inventory: snapshot.entries.length,
        rows,
      });
    console.log(
      entry.set,
      rows.length + '/' + snapshot.entries.length,
      entry.name,
      variants.map((v) => v.score?.score.toFixed(4) ?? 'empty').join(' '),
    );
  }
  assert.deepEqual(session.faults, []);
  assert.equal(
    source.rendererHash,
    await sourceHash(path.join(root, 'games/magic/src')),
    'Renderer changed during capture',
  );
} finally {
  await session.close();
}
