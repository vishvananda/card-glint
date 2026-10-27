// Diagnostic full-card replay of the Revised type-font pilot. Outputs stay local.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { root, objectFile, hash } from './common.mjs';
import { openBrowser } from './browser.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';
import { cropGray, normalize } from './pixels-pure.mjs';
const [inputFile, poseFile, nativeDirectory, studyFile, d] = process.argv.slice(2);
assert(d, 'Usage: revised-heading-type-preview.mjs INPUTS POSES NATIVE PILOT NEW_OUTPUT_DIRECTORY');
const inputs = JSON.parse(await fs.readFile(inputFile)),
  poses = JSON.parse(await fs.readFile(poseFile)),
  capture = JSON.parse(await fs.readFile(path.join(nativeDirectory, 'capture.json'))),
  style = JSON.parse(await fs.readFile(studyFile)),
  rows = [];
assert.equal(inputs.set, '3ed');
assert.equal(style.mode, 'pilot');
assert.equal(style.rendererHash, capture.rendererHash);
await fs.mkdir(d);
const hook = {
  name: 'type-font-style-private-preview',
  enforce: 'pre',
  transform(source, id) {
    if (!id.endsWith('/retro-paint.ts')) return;
    const needle = '    : (text: string, x: number, y: number, width: number) => {';
    if (source.split(needle).length !== 2) throw Error('hook changed');
    const extra = [
      '',
      '      const p=(globalThis as any).__typeVariant;',
      '      if(p){',
      "        c.save();const nativeLine=c.measureText('Hg');c.translate(x+p.dx,y+p.dy);c.scale(p.width??1,1);",
      "        c.font=(21.7+(p.sizeDelta??0))+'px \"CardRenderer MTG '+(p.font??'MPlantin')+'\", Georgia';",
      "        if(p.font){const line=c.measureText('Hg');c.translate(0,(-nativeLine.actualBoundingBoxAscent+nativeLine.actualBoundingBoxDescent+line.actualBoundingBoxAscent-line.actualBoundingBoxDescent)/2);}",
      "        paintTrialType(c,text,0,0,width/(p.width??1),1,'rgb('+[p.gray,p.gray,p.gray].join(',')+')',face.textInk,'type');",
      '        c.restore();return;',
      '      }',
    ].join('\n');
    return (
      "import {paintRetroGrayText as paintTrialType} from './retro-lettering.js';\n" +
      source.replace(needle, needle + extra)
    );
  },
};
const session = await openBrowser(
  {
    ...inputs,
    components: [
      ...(inputs.components ?? []),
      ...capture.extraAssets,
      ...style.definition.fonts.map((f) => f.asset),
    ],
  },
  { plugins: [hook] },
);
try {
  await session.page.evaluate(async (fonts) => {
    for (const font of fonts) {
      const r = await fetch(font.asset.url);
      if (!r.ok) throw Error('font failed');
      document.fonts.add(
        await new FontFace('CardRenderer MTG ' + font.id, await r.arrayBuffer(), {
          weight: '400',
        }).load(),
      );
    }
  }, style.definition.fonts);
  for (const r of style.rows.filter((r) => r.cohort === 'calibration')) {
    const e = inputs.entries.find((e) => e.id === r.id),
      p = Object.values(poses.groups)
        .flatMap((g) => g.rows)
        .find((p) => p.id === r.id),
      n = capture.rows.find((n) => n.id === r.id),
      ref = await fs.readFile(objectFile(e.reference)),
      reference = normalize(PNG.sync.read(ref), p.transform),
      variants = [
        { name: 'current' },
        ...[171, 190, 210].map((gray) => ({
          name: 'pro' + gray,
          dx: -2,
          dy: 4,
          width: 1,
          gray,
          font: 'Plantin Pro',
        })),
        { name: 'mse171', dx: -2, dy: 4, width: 1, gray: 171, font: 'MSE Plantin' },
      ],
      out = await session.page.evaluate(
        async ({ e, variants }) => {
          await import('/games/magic/src/data/eager.ts');
          await import('/games/magic/src/data/eager-wording.ts');
          const { composeCardTexture } = await import(
              '/games/magic/src/presentation/canvas-face.ts'
            ),
            { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
            { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
            signal = new AbortController().signal,
            lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration),
            out = [];
          try {
            for (const p of variants) {
              globalThis.__typeVariant = p.name === 'current' ? undefined : p;
              const c = await composeCardTexture(
                { face: e.face, printingId: e.id, printedImage: null },
                'inspect',
                signal,
                { loadImages: async () => ({ ...lease, dispose() {} }) },
              );
              try {
                out.push({ name: p.name, png: c.toDataURL().split(',')[1] });
              } finally {
                c.width = c.height = 0;
              }
            }
          } finally {
            delete globalThis.__typeVariant;
            lease.dispose();
          }
          return out;
        },
        { e, variants },
      );
    if (hash(Buffer.from(out[0].png, 'base64')) !== n.modes.original.sha256)
      throw Error('baseline changed');
    assert.equal(hash(ref), r.referenceHash);
    assert.equal(hash(JSON.stringify(p.transform)), r.poseHash);
    const all = [
        { name: 'scan', image: reference },
        ...out.map((o) => ({
          name: o.name,
          image: normalize(PNG.sync.read(Buffer.from(o.png, 'base64'))),
        })),
      ],
      rect = [42, 378, 407, 34];
    const invert = (a) => (r.material === 'W' ? a : Float32Array.from(a, (v) => 255 - v)),
      objective = new TextFilledObjective(
        invert(cropGray(reference, rect).gray),
        rect[2],
        rect[3],
        new Uint8Array(rect[2] * rect[3]).fill(1),
      ),
      proof = [];
    for (const o of all) {
      const png = new PNG({ width: rect[2], height: rect[3] });
      for (let y = 0; y < rect[3]; y++)
        for (let x = 0; x < rect[2]; x++)
          for (let c = 0; c < 4; c++)
            png.data[(y * rect[2] + x) * 4 + c] =
              o.image.data[((y + rect[1]) * 488 + x + rect[0]) * 4 + c];
      await fs.writeFile(
        d + '/type-font-style-' + r.material + '-' + o.name + '.png',
        PNG.sync.write(png),
      );
    }
    for (const o of all.filter((o) => o.name !== 'scan' && o.name !== 'pro190')) {
      const id =
          o.name === 'current'
            ? 'current'
            : o.name === 'mse171'
              ? 'font/MSE Plantin/4/171'
              : 'font/Plantin Pro/4/' + o.name.slice(3),
        index = style.definition.type.findIndex((c) => c.id === id),
        score = objective.score(invert(cropGray(o.image, rect).gray)),
        expected = r.roles.type.scores[index];
      if (index < 0 || Math.abs(score.score - expected.score) > 1e-12)
        throw Error(
          'ROI/full native candidate mismatch ' +
            r.name +
            ' ' +
            o.name +
            ' ' +
            score.score +
            ' vs ' +
            expected?.score,
        );
      proof.push({
        variant: o.name,
        id,
        score: score.score,
        roiScore: expected.score,
        fullNativeHash: hash(Buffer.from(out.find((v) => v.name === o.name).png, 'base64')),
      });
    }
    rows.push({
      material: r.material,
      name: r.name,
      id: r.id,
      referenceHash: r.referenceHash,
      poseHash: r.poseHash,
      variants,
      proof,
    });
  }
  await fs.writeFile(
    d + '/3ed-type-font-style-visual.json',
    JSON.stringify(
      {
        schema: 1,
        status: 'native-type-font-pilot-parity-not-adopted',
        rendererHash: style.rendererHash,
        studyHash: hash(await fs.readFile(studyFile)),
        toolHash: hash(await fs.readFile(new URL(import.meta.url))),
        scope:
          'Six calibration examples, four scored variants each. Gray190 is an unscored visual trial; no defaults adopted.',
        rows,
      },
      null,
      2,
    ) + '\n',
  );
  if (session.faults.length) throw Error(session.faults.join('\n'));
} finally {
  await session.close();
}
