import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { objectFile } from './common.mjs';
const [inputFile, captureFile, posesFile, out, definitionFile] = process.argv.slice(2);
assert(
  out,
  'Usage: fourth-nonland-text-study.mjs INPUTS NATIVE_CAPTURE STOCK_POSES NEW_OUTPUT [REQUEST_DEFINITION]',
);
const inputBytes = await fs.readFile(inputFile),
  inputs = JSON.parse(inputBytes),
  captureBytes = await fs.readFile(captureFile),
  capture = JSON.parse(captureBytes),
  posesBytes = await fs.readFile(posesFile),
  poses = JSON.parse(posesBytes);
const definitionBytes = definitionFile ? await fs.readFile(definitionFile) : undefined;
const requestStudy = definitionBytes ? JSON.parse(definitionBytes) : undefined;
if (requestStudy) {
  assert.equal(requestStudy.schema, 1);
  assert.equal(requestStudy.mode, 'native-request');
  assert.equal(requestStudy.candidates[0].id, 'current');
  assert.deepEqual(requestStudy.candidates[0], { id: 'current' });
  assert.equal(
    new Set(requestStudy.candidates.map((c) => c.id)).size,
    requestStudy.candidates.length,
  );
  for (const c of requestStudy.candidates.slice(1)) {
    assert.deepEqual(
      Object.keys(c).sort(),
      [
        'dy',
        'fractionalMetrics',
        'id',
        'preserveBaseline',
        ...(c.retainRowBudget === undefined ? [] : ['retainRowBudget']),
      ].sort(),
    );
    assert.equal(typeof c.id, 'string');
    assert.equal(typeof c.fractionalMetrics, 'boolean');
    assert.equal(typeof c.preserveBaseline, 'boolean');
    if (c.retainRowBudget !== undefined) assert.equal(typeof c.retainRowBudget, 'boolean');
    assert(Number.isFinite(c.dy) && Math.abs(c.dy) <= 20);
  }
}
assert.equal(inputs.set, '4ed');
assert.equal(inputs.entries.length, 378);
assert.equal(capture.status, 'complete');
assert.equal(capture.inputHash, hash(inputBytes));
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), capture.rendererHash);
const references = { rows: [] };
for (const e of inputs.entries.filter((e) => !e.face.land)) {
  const p = poses.rows.find((p) => p.id === e.id),
    r = capture.rows.find((r) => r.id === e.id),
    referenceBytes = await fs.readFile(objectFile(e.reference));
  assert(p.accepted);
  assert.equal(p.referenceHash, e.reference.sha256);
  assert.equal(r.referenceHash, e.reference.sha256);
  assert.equal(r.artHash, e.art.sha256);
  assert.equal(r.modes.original.inputHash, hash(JSON.stringify(e.face)));
  assert.equal(hash(referenceBytes), e.reference.sha256);
  const im = normalize(PNG.sync.read(referenceBytes), p.transform),
    png = PNG.sync.write({ width: im.width, height: im.height, data: Buffer.from(im.data) });
  references.rows.push({ id: e.id, pose: p.transform, png });
}
assert.equal(references.rows.length, 360);
await fs.mkdir(out);
const plugin = {
  name: 'isolated-fourth-land-body',
  enforce: 'pre',
  transform(code, id) {
    if (!id.split('?')[0].endsWith('/rules-paint.ts')) return;
    const before = '  if (!rulesInkVisible(context)) return;';
    assert.equal(code.split(before).length, 2);
    return code.replace(
      before,
      '  if ((globalThis as any).__fourthBodyHook?.(context,layout,images,paintSymbol,inkInsetEm,color)) return;\n' +
        before,
    );
  },
};
const session = await openBrowser(inputs, { plugins: [plugin] }),
  rows = [];
const definition = {
  schema: 1,
  status: 'running',
  scope:
    requestStudy?.scope ??
    'All360 Fourth nonland printings. Exploratory shared class policy selected from24 diagnostic examples;full reused census,not a blind holdout. Original wording,frozen provisional stock poses,default native pixels and isolated body replay preserved. No production changes or per-card geometry.',
  ...(requestStudy ? { requestStudy, definitionHash: hash(definitionBytes) } : {}),
  inputHash: hash(inputBytes),
  baselineHash: hash(captureBytes),
  posesHash: hash(posesBytes),
  browser: session.browser.version(),
  objective: requestStudy ? { kind: 'filled-ink-and-edges', rect: [76, 419, 336, 177] } : undefined,
  rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
  toolHash: hash(await fs.readFile(new URL(import.meta.url))),
  rows,
};
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const ref of references.rows) {
    const e = inputs.entries.find((e) => e.id === ref.id),
      baseline = capture.rows.find((r) => r.id === e.id).modes.original;
    const result = await session.page.evaluate(
      async ({ e, scan, baseline, requestStudy }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts'),
          { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
          { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs'),
          { layoutRules, rulesLayoutRequest } = await import(
            '/games/magic/src/presentation/rules-layout.ts'
          ),
          { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts'),
          { TextFilledObjective } = await import(
            '/games/magic/tools/accuracy/text-filled-objective.mjs'
          ),
          { nativeGrayCrop } = await import('/games/magic/tools/accuracy/abu-type-objective.mjs'),
          { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
        const signal = new AbortController().signal,
          face = e.face,
          input = { face, printingId: e.id, printedImage: null },
          lease = await loadAccuracyImages(canvasAssetUrls(face), signal, face.illustration),
          hooks = { loadImages: async () => ({ ...lease, dispose() {} }) },
          rect = requestStudy ? [76, 419, 336, 177] : [60, 415, 370, 186];
        let full, background, body;
        try {
          delete globalThis.__fourthBodyHook;
          full = await composeCardTexture(input, 'inspect', signal, hooks);
          const bytes = Uint8Array.from(atob(full.toDataURL().split(',')[1]), (c) =>
              c.charCodeAt(0),
            ),
            digest = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)), (v) =>
              v.toString(16).padStart(2, '0'),
            ).join('');
          if (digest !== baseline.sha256) throw Error('Baseline pixel drift ' + face.name);
          globalThis.__fourthBodyHook = (c, layout, images, ...args) => {
            body = {
              layout,
              images,
              args,
              matrix: c.getTransform(),
              properties: Object.fromEntries(
                [
                  'imageSmoothingEnabled',
                  'imageSmoothingQuality',
                  'fontKerning',
                  'textRendering',
                  'shadowColor',
                  'shadowBlur',
                  'shadowOffsetX',
                  'shadowOffsetY',
                  'globalAlpha',
                  'globalCompositeOperation',
                  'filter',
                ].map((k) => [k, c[k]]),
              ),
            };
            return true;
          };
          try {
            background = await composeCardTexture(input, 'inspect', signal, hooks);
          } finally {
            delete globalThis.__fourthBodyHook;
          }
          if (!body) throw Error('No body hook');
          const originalPixels = full.getContext('2d').getImageData(0, 0, 732, 1020);
          const sc = document.createElement('canvas');
          sc.width = 488;
          sc.height = 680;
          const im = new Image();
          im.src = scan;
          await im.decode();
          sc.getContext('2d').drawImage(im, 0, 0);
          const mask = new Uint8Array(rect[2] * rect[3]).fill(1),
            objective = new TextFilledObjective(
              cropGray(sc.getContext('2d').getImageData(0, 0, 488, 680), rect).gray,
              rect[2],
              rect[3],
              mask,
            );
          const canvas = document.createElement('canvas');
          canvas.width = 732;
          canvas.height = 1020;
          const c = canvas.getContext('2d', { willReadFrequently: true }),
            trials = [],
            basic = false,
            candidates = requestStudy?.candidates ?? [{ id: 'current' }];
          if (!requestStudy)
            candidates.push({ id: 'shared-class-policy', large: 25, regularLines: 6, offset: -4 });
          let replayDifference = null,
            bestPng,
            fixedPng,
            best = -Infinity;
          for (const candidate of candidates) {
            c.resetTransform();
            c.clearRect(0, 0, 732, 1020);
            c.drawImage(background, 0, 0);
            Object.assign(c, body.properties);
            c.setTransform(body.matrix);
            let layout = body.layout,
              selectedClass = 'current';
            if (requestStudy && candidate.id !== 'current') {
              if (candidate.fractionalMetrics) {
                const request = rulesLayoutRequest(body.layout);
                if (!request) throw Error('Missing exact native layout request: ' + face.name);
                layout = layoutRules(
                  c,
                  request.paragraphs,
                  request.bounds,
                  candidate.retainRowBudget ? body.layout.size : request.maximumSize,
                  candidate.retainRowBudget
                    ? Math.max(request.minimumSize, body.layout.size - 0.5)
                    : request.minimumSize,
                  {
                    ...request.typography,
                    fractionalMetrics: true,
                    ...(candidate.retainRowBudget
                      ? { maximumLines: body.layout.lines.length }
                      : {}),
                  },
                );
              }
              // Preserve the old layout if a fractional request cannot fit
              // its existing row budget within half a canonical pixel.
              if (candidate.retainRowBudget && layout.overflow) layout = body.layout;
              const dy =
                candidate.dy +
                (candidate.preserveBaseline && layout.lines.length
                  ? body.layout.lines[0].baseline - layout.lines[0].baseline
                  : 0);
              layout = {
                ...layout,
                top: layout.top + dy,
                lines: layout.lines.map((l) => ({
                  ...l,
                  baseline: l.baseline + dy,
                  inkBounds: [l.inkBounds[0], l.inkBounds[1] + dy, l.inkBounds[2], l.inkBounds[3]],
                })),
                separators: layout.separators.map((v) => v + dy),
              };
              selectedClass = 'native-request';
            } else if (candidate.id !== 'current') {
              const bounds = { x: 72, y: 414, width: 344, height: 184 },
                style = {
                  fractionalMetrics: true,
                  textWidth: 1,
                  leading: 1,
                  paragraphGap: 0,
                  flavorGap: 0,
                  flavorOrphans: false,
                  flavorSeparator: false,
                  centerOffset: candidate.offset,
                },
                paragraphs = face.rulesParagraphs,
                roles = new Set(paragraphs.map((p) => p.role)),
                mixed = roles.has('rules') && roles.has('flavor'),
                flavorOnly = roles.has('flavor') && !roles.has('rules');
              const explicit = paragraphs.some((p) => p.align !== undefined),
                hardBreak = paragraphs.some((p) => p.runs.some((r) => r.text.includes('\n')));
              const regular = (offset = candidate.offset) =>
                layoutRules(c, paragraphs, bounds, 20, 20, { ...style, centerOffset: offset });
              if (explicit || body.layout.size === 25) {
                layout = body.layout;
                selectedClass = 'retain-explicit-or-centered';
              } else if (mixed) {
                if (body.layout.size === 22.5 && body.layout.lines.length >= 8) {
                  layout = regular(-12);
                  selectedClass = 'mixed-regular';
                } else {
                  layout = body.layout;
                  selectedClass = 'retain-mixed';
                }
              } else if (flavorOnly) {
                if (body.layout.size === 22.5 && body.layout.lines.length > 6) {
                  layout = regular();
                  selectedClass = 'flavor-regular';
                } else {
                  layout = body.layout;
                  selectedClass = 'retain-flavor';
                }
              } else {
                const large = layoutRules(
                  c,
                  paragraphs.map((p) => ({ ...p, align: 'center' })),
                  bounds,
                  25,
                  25,
                  { ...style, balanceLines: true, balanceCenteredOnly: true },
                );
                if (!hardBreak && !large.overflow && large.lines.length <= 6) {
                  layout = large;
                  selectedClass = 'large';
                } else {
                  const r = regular();
                  if (!r.overflow && r.lines.length <= 6) {
                    layout = r;
                    selectedClass = 'regular';
                  } else {
                    layout = layoutRules(c, paragraphs, bounds, 15.5, 15.5, {
                      ...style,
                      leading: 1.2,
                    });
                    selectedClass = 'compact';
                  }
                }
              }
            }
            if (layout.overflow) {
              trials.push({
                candidate,
                selectedClass,
                invalid: true,
                reason: 'fixed class overflows the rules panel',
              });
              continue;
            }
            paintRulesLayout(c, layout, body.images, ...body.args);
            c.resetTransform();
            const pix = c.getImageData(0, 0, 732, 1020),
              gray = nativeGrayCrop(pix, rect),
              metric = objective.score(gray);
            let outside = 0,
              alpha = 0;
            for (let i = 0; i < pix.data.length; i += 4) {
              const x = (i / 4) % 732,
                y = Math.floor(i / 4 / 732);
              if (pix.data[i + 3] !== originalPixels.data[i + 3]) alpha++;
              if (
                (x < 90 || x >= 645 || y < 607 || y >= 910) &&
                (pix.data[i] !== originalPixels.data[i] ||
                  pix.data[i + 1] !== originalPixels.data[i + 1] ||
                  pix.data[i + 2] !== originalPixels.data[i + 2])
              )
                outside++;
            }
            if (alpha || (outside && candidate.id === 'current'))
              throw Error('Body candidate changed unrelated native pixels ' + face.name);
            if (outside) {
              trials.push({
                candidate,
                selectedClass,
                invalid: true,
                outside,
                alpha,
                reason: 'Candidate ink escapes the allowed native body region',
              });
              continue;
            }

            if (candidate.id === 'current') {
              const original = full.getContext('2d').getImageData(0, 0, 732, 1020);
              let max = 0;
              for (let i = 0; i < pix.data.length; i++)
                max = Math.max(max, Math.abs(pix.data[i] - original.data[i]));
              replayDifference = max;
              if (max !== 0) throw Error('Isolated body replay differs ' + max);
            }
            trials.push({
              candidate,
              selectedClass,
              outside,
              alpha,
              metric,
              layout: {
                size: layout.size,
                x: layout.x,
                width: layout.width,
                top: layout.top,
                height: layout.height,
                lines: layout.lines.map((l) => ({
                  text: l.runs.map((r) => (r.symbol ? '{' + r.text + '}' : r.text)).join(''),
                  x: l.x,
                  baseline: l.baseline,
                  width: l.width,
                })),
              },
            });
            if (candidate.id === 'shared-class-policy') fixedPng = canvas.toDataURL().split(',')[1];
            if (metric.score > best) {
              best = metric.score;
              bestPng = canvas.toDataURL().split(',')[1];
            }
          }
          return { trials, replayDifference, baselineHash: digest, basic, bestPng, fixedPng };
        } finally {
          delete globalThis.__fourthBodyHook;
          full && (full.width = full.height = 0);
          background && (background.width = background.height = 0);
          lease.dispose();
        }
      },
      { e, baseline, requestStudy, scan: 'data:image/png;base64,' + ref.png.toString('base64') },
    );
    const { bestPng, fixedPng, ...observations } = result;
    await fs.writeFile(out + '/' + e.id + '-best.png', Buffer.from(bestPng, 'base64'));
    if (fixedPng)
      await fs.writeFile(out + '/' + e.id + '-candidate.png', Buffer.from(fixedPng, 'base64'));
    rows.push({
      id: e.id,
      name: e.name,
      collectorNumber: e.face.collectorNumber,
      referenceHash: e.reference.sha256,
      pose: ref.pose,
      ...(fixedPng ? { candidateHash: hash(Buffer.from(fixedPng, 'base64')) } : {}),
      status: 'exploratory-measurement',
      ...observations,
    });
    await fs.writeFile(out + '/study.json', JSON.stringify(definition, null, 2) + '\n');
    console.log(e.name, e.face.collectorNumber, result.trials.length);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), definition.rendererHash);
  assert.equal(hash(await fs.readFile(inputFile)), definition.inputHash);
  assert.equal(hash(await fs.readFile(captureFile)), definition.baselineHash);
  assert.equal(hash(await fs.readFile(posesFile)), definition.posesHash);
  definition.status = 'complete-exploratory';
  await fs.writeFile(out + '/study.json', JSON.stringify(definition, null, 2) + '\n');
} finally {
  await session.close();
}
