import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { root, hash, sourceHash } from './common.mjs';
import { readObject } from './cache.mjs';
const { openBrowser } = await import(root + '/games/magic/tools/accuracy/browser.mjs');
const { normalize } = await import(root + '/games/magic/tools/accuracy/pixels-pure.mjs');
import { PNG } from 'pngjs';
const [inputFile, poseFile, nativeDirectory, definitionFile, output] = process.argv.slice(2);
assert(
  output,
  'Usage: early-expansion-lettering-study.mjs INPUTS POSES RELEASED_NATIVE DEFINITION OUTPUT',
);
const raw = await Promise.all(
  [inputFile, poseFile, path.join(nativeDirectory, 'capture.json'), definitionFile].map((f) =>
    readFile(f),
  ),
);
const [inputs, poses, capture, definition] = raw.map((b) => JSON.parse(b));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src')),
  toolHash = hash(await readFile(new URL(import.meta.url)));
assert.equal(rendererHash, inputs.rendererHash);
assert.equal(capture.source.rendererHash, rendererHash);
assert.equal(capture.source.inputHash, hash(raw[0]));
assert.equal(capture.source.posesHash, hash(raw[1]));
assert.equal(poses.inputHash, hash(raw[0]));
assert(capture.complete);
assert(['arn', 'atq', 'drk'].includes(inputs.set));
assert(
  inputs.entries.every((entry) => entry.face.wordingMode === 'original'),
  'Lettering calibration requires Original wording',
);
for (const role of ['title', 'type', 'artist', 'stats']) {
  assert(Array.isArray(definition[role]), 'Missing role ' + role);
  assert.equal(new Set(definition[role].map((c) => c.id)).size, definition[role].length);
  for (const { id, profile } of definition[role]) {
    assert(typeof id === 'string' && id !== 'current');
    assert(profile && typeof profile === 'object');
    assert(
      ['x', 'y', 'size', 'width', 'gray', 'trim', 'shadow'].every((k) =>
        Number.isFinite(profile[k]),
      ),
    );
    assert(
      profile.size > 0 &&
        profile.width > 0 &&
        profile.gray >= 0 &&
        profile.gray <= 255 &&
        profile.trim >= 0 &&
        profile.trim <= 0.5 &&
        profile.shadow >= 0,
    );
  }
}
const proof = {},
  session = await openBrowser(inputs, {
    plugins: [
      {
        name: 'early-lettering-production-probe',
        enforce: 'pre',
        transform(source, id) {
          const file = id.split('/').at(-1);
          let code = source;
          const once = (needle, replacement) => {
            assert.equal(code.split(needle).length, 2, file);
            code = code.replace(needle, replacement);
          };
          if (file === 'early-expansion-title.ts')
            once(
              '  if (!p) return false;',
              "  if (!p) return false;\n  if ((globalThis as any).__letterProbe?.('title', c, face, {right})) return true;",
            );
          else if (file === 'early-expansion-stats.ts')
            once(
              '  if (!p) return false;',
              "  if (!p) return false;\n  if ((globalThis as any).__letterProbe?.('stats', c, face, {})) return true;",
            );
          else if (file === 'early-expansion-artist.ts')
            once(
              '  const solid = earlyExpansionArtist(face),',
              "  if ((globalThis as any).__letterProbe?.('artist', c, face, {})) return true;\n  const solid = earlyExpansionArtist(face),",
            );
          else if (file === 'retro-paint.ts')
            once(
              '    : (text: string, x: number, y: number, width: number) => {\n        if (',
              "    : (text: string, x: number, y: number, width: number) => {\n        if ((globalThis as any).__letterProbe?.('type', c, face, {text,x,y,width})) return;\n        if (",
            );
          else return;
          const item = { before: hash(source), after: hash(code) };
          if (proof[file]) assert.deepEqual(proof[file], item);
          proof[file] = item;
          return code;
        },
      },
    ],
  });
const rows = [];
try {
  for (const e of inputs.entries) {
    const pose = poses.rows.find((r) => r.id === e.id),
      before = capture.rows.find((r) => r.id === e.id);
    assert(pose.accepted);
    assert.equal(before.inputHash, hash(JSON.stringify(e.face)));
    const scan = await readObject(e.reference);
    assert.equal(hash(scan), e.reference.sha256);
    const canonical = normalize(PNG.sync.read(scan), pose.transform),
      url =
        'data:image/png;base64,' +
        PNG.sync
          .write({ width: 488, height: 680, data: Buffer.from(canonical.data) })
          .toString('base64');
    const result = await session.page.evaluate(
      async ({ e, url, definition }) => {
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts'),
          { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts'),
          { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { paintEarlyExpansionTitle } = await import(
            '/games/magic/src/presentation/early-expansion-title.ts'
          ),
          { paintEarlyExpansionArtist } = await import(
            '/games/magic/src/presentation/early-expansion-artist.ts'
          ),
          { paintEarlyExpansionStats } = await import(
            '/games/magic/src/presentation/early-expansion-stats.ts'
          );
        const { paintTextInk } = await import('/games/magic/src/presentation/text-ink.ts'),
          { paintSolidTitle } = await import('/games/magic/src/presentation/solid-title.ts'),
          { paintEarlyReprintFooterInk } = await import(
            '/games/magic/src/presentation/early-reprint-footer-ink.ts'
          );
        const { nativeGrayCrop } = await import(
            '/games/magic/tools/accuracy/abu-type-objective.mjs'
          ),
          { TextFilledObjective } = await import(
            '/games/magic/tools/accuracy/text-filled-objective.mjs'
          ),
          { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
        const signal = new AbortController().signal,
          face = e.face,
          input = { face, printingId: e.id, printedImage: null },
          lease = await loadAccuracyImages(canvasAssetUrls(face), signal, face.illustration),
          hooks = { loadImages: async () => ({ ...lease, dispose() {} }) };
        const properties = [
          'font',
          'textAlign',
          'textBaseline',
          'letterSpacing',
          'fillStyle',
          'shadowColor',
          'shadowBlur',
          'shadowOffsetX',
          'shadowOffsetY',
          'globalAlpha',
          'globalCompositeOperation',
          'filter',
          'imageSmoothingEnabled',
          'imageSmoothingQuality',
          'fontKerning',
          'textRendering',
        ];
        let full, background, out, sc;
        try {
          full = await composeCardTexture(input, 'inspect', signal, hooks);
          const calls = {};
          globalThis.__letterProbe = (role, c, _face, args) => {
            if (calls[role]) throw Error('Repeated role ' + role);
            calls[role] = {
              args,
              matrix: c.getTransform(),
              properties: Object.fromEntries(properties.map((k) => [k, c[k]])),
            };
            return true;
          };
          try {
            background = await composeCardTexture(input, 'inspect', signal, hooks);
          } finally {
            delete globalThis.__letterProbe;
          }
          const img = new Image();
          img.src = url;
          await img.decode();
          sc = Object.assign(document.createElement('canvas'), { width: 488, height: 680 });
          sc.getContext('2d').drawImage(img, 0, 0);
          const scanPixels = sc.getContext('2d').getImageData(0, 0, 488, 680);
          out = Object.assign(document.createElement('canvas'), { width: 732, height: 1020 });
          const c = out.getContext('2d', { willReadFrequently: true }),
            actual = full.getContext('2d').getImageData(0, 0, 732, 1020),
            roles = {};
          const rects = {
            title: [29, 27, 426, 43],
            type: [45, 373, 360, 34],
            artist: [42, 613, 346, 35],
            stats: [390, 613, 76, 35],
          };
          for (const [role, state] of Object.entries(calls)) {
            const rect = rects[role];
            if (role === 'title')
              rect[2] = Math.min(rect[2], Math.floor(state.args.right) - rect[0]);
            if (role === 'type')
              rect[2] = Math.min(rect[2], Math.floor(state.args.x + state.args.width) - rect[0]);
            const target = cropGray(scanPixels, rect).gray,
              objective = new TextFilledObjective(
                target,
                rect[2],
                rect[3],
                new Uint8Array(rect[2] * rect[3]).fill(1),
              );
            const prepare = () => {
              c.resetTransform();
              c.clearRect(0, 0, 732, 1020);
              c.drawImage(background, 0, 0);
              Object.assign(c, state.properties);
              c.setTransform(state.matrix);
            };
            const pixels = () =>
              c.getImageData(
                Math.floor(rect[0] * 1.5) - 1,
                Math.floor(rect[1] * 1.5) - 1,
                Math.ceil(rect[2] * 1.5) + 4,
                Math.ceil(rect[3] * 1.5) + 4,
              );
            const gray = () =>
              nativeGrayCrop(pixels(), rect, [
                Math.floor(rect[0] * 1.5) - 1,
                Math.floor(rect[1] * 1.5) - 1,
              ]);
            prepare();
            if (role === 'title') paintEarlyExpansionTitle(c, face, state.args.right);
            if (role === 'artist') paintEarlyExpansionArtist(c, face);
            if (role === 'stats') paintEarlyExpansionStats(c, face);
            if (role === 'type')
              paintTextInk(
                c,
                state.args.text,
                state.args.x,
                state.args.y,
                state.args.width,
                face.textInk,
                'type',
              );
            const old = nativeGrayCrop(actual, rect),
              replay = gray(),
              parity = Math.max(...replay.map((v, i) => Math.abs(v - old[i])));
            if (parity > 1.001) throw Error('Native default replay ' + role + ' ' + parity);
            const trials = [{ id: 'current', score: objective.score(old) }];
            const paintProfile = (p) => {
              prepare();
              c.translate(p.x, p.y);
              c.scale(p.width, 1);
              c.font =
                p.size +
                'px "CardRenderer MTG ' +
                (role === 'title' ? 'Goudy' : 'MPlantin') +
                '", Georgia';
              c.letterSpacing = '0px';
              c.textAlign = role === 'stats' ? 'right' : 'left';
              c.textBaseline =
                role === 'artist' || role === 'stats'
                  ? 'alphabetic'
                  : state.properties.textBaseline;
              c.fillStyle = 'rgb(' + p.gray + ',' + p.gray + ',' + p.gray + ')';
              c.shadowColor = '#17140f';
              c.shadowBlur = 0;
              const text =
                role === 'title'
                  ? face.name
                  : role === 'type'
                    ? state.args.text
                    : role === 'artist'
                      ? 'Illus. © ' +
                        (face.setCode?.toLowerCase() === 'drk' ? '1994 ' : '') +
                        face.artist
                      : (face.power + '/' + face.toughness).replaceAll('-', '–');
              const max =
                role === 'title'
                  ? (state.args.right - p.x) / p.width
                  : role === 'type'
                    ? (state.args.x + state.args.width - p.x) / p.width
                    : role === 'artist'
                      ? 338 / p.width
                      : 132 / p.width;
              if (role === 'title' || role === 'type') paintSolidTitle(c, text, 0, 0, max, p);
              else paintEarlyReprintFooterInk(c, text, max, p);
            };
            for (const candidate of definition[role]) {
              paintProfile(candidate.profile);
              trials.push({ id: candidate.id, score: objective.score(gray()) });
            }
            let tone = null;
            const sample = definition[role][0];
            if (sample) {
              paintProfile({ ...sample.profile, gray: 0 });
              const black = gray();
              paintProfile({ ...sample.profile, gray: 255 });
              const white = gray(),
                targets = [];
              let support = 0;
              for (let i = 0; i < target.length; i++) {
                const alpha = (white[i] - black[i]) / 255;
                if (alpha <= 0.85) continue;
                support++;
                const value = (target[i] - black[i]) / alpha;
                if (value >= 0 && value <= 255) targets.push(value);
              }
              targets.sort((a, b) => a - b);
              const quantile = (q) =>
                targets.length ? targets[Math.floor((targets.length - 1) * q)] : null;
              tone = {
                candidate: sample.id,
                support,
                samples: targets.length,
                median: quantile(0.5),
                p10: quantile(0.1),
                p90: quantile(0.9),
                status: targets.length >= 12 ? 'measured' : 'insufficient-opaque-ink',
              };
            }
            roles[role] = { rect, parity, trials, tone };
          }
          return { png: full.toDataURL().split(',')[1], roles };
        } finally {
          delete globalThis.__letterProbe;
          for (const c of [full, background, out, sc]) if (c) c.width = c.height = 0;
          lease.dispose();
        }
      },
      { e, url, definition },
    );
    assert.equal(hash(Buffer.from(result.png, 'base64')), before.sha256);
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      cohort: pose.cohort,
      referenceHash: e.reference.sha256,
      poseHash: before.poseHash,
      baselineHash: before.sha256,
      roles: result.roles,
    });
    if (rows.length % 10 === 0 || rows.length === inputs.entries.length) {
      console.log('Lettering', rows.length, '/', inputs.entries.length);
      await writeFile(
        output,
        JSON.stringify(
          {
            schema: 1,
            status: rows.length === inputs.entries.length ? 'complete' : 'in-progress',
            scope:
              'Shared filled-ink production-kernel proposals, frozen scan-only poses, exact native released controls and default replays. No per-card default; calibration-name selection and reused validation, no adoption. Tone probes invert actual black/white foreground replays at alpha>0.85 for the first shared candidate per role; aggregate calibration names only. Tone ranges diagnose misregistration and texture; they are not a license for per-card ink fitting.',
            set: inputs.set,
            rendererHash,
            inputHash: hash(raw[0]),
            normalizationHash: hash(raw[1]),
            nativeCaptureHash: hash(raw[2]),
            definitionHash: hash(raw[3]),
            toolHash,
            browser: session.browser.version(),
            dependencies: await Promise.all(
              [
                'text-filled-objective.mjs',
                'abu-type-objective.mjs',
                'pixels-pure.mjs',
                'edges.mjs',
                'metrics.mjs',
              ].map(async (f) => [f, hash(await readFile(new URL(f, import.meta.url)))]),
            ),
            proof,
            definition,
            total: inputs.entries.length,
            completed: rows.length,
            rows,
          },
          null,
          2,
        ) + '\n',
      );
    }
  }
  assert.deepEqual(session.faults, []);
  assert.equal(await sourceHash(root + '/games/magic/src'), inputs.rendererHash);
  assert.equal(
    hash(await readFile(new URL(import.meta.url))),
    toolHash,
    'Study changed during capture',
  );
} finally {
  await session.close();
}
