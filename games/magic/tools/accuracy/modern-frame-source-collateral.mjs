import { modernFrameSourceProposal } from './modern-frame-source-proposal.mjs';
// Explicit collateral audit; this never certifies changed M21 cards or scan poses.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, mkdir } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { nativeHostCases } from '../../../../tests/magic-native-host-cases.mjs';
const [referenceRoot, output] = process.argv.slice(2);
assert(output, 'Usage: modern-frame-source-collateral.mjs REFERENCE_ROOT OUT');
const base = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: referenceRoot,
  encoding: 'utf8',
}).trim();
assert.equal(
  base,
  '20fdf343119b4722024e09a18a002a2f5e5b494b',
  'Use the exact pre-source-adoption M21 profile15 source',
);
assert.deepEqual(
  await readFile(path.join(root, 'games/magic/assets.json')),
  await readFile(path.join(referenceRoot, 'games/magic/assets.json')),
);
const beforeFonts = await readFile(path.join(referenceRoot, 'games/magic/fonts.css'));
const afterFonts = await readFile(path.join(root, 'games/magic/fonts.css'));
assert.deepEqual(afterFonts.subarray(0, beforeFonts.length), beforeFonts);
const fontAddition = hash(afterFonts.subarray(beforeFonts.length));
assert.equal(
  fontAddition,
  hash(Buffer.alloc(0)),
  'Only the reviewed optional M21 Gotham and Beleren2016 declarations may be appended',
);

assert.equal(
  await sourceHash(path.join(root, 'packages/browser/src')),
  await sourceHash(path.join(referenceRoot, 'packages/browser/src')),
);
const specimens = [...nativeHostCases];
for (const s of nativeHostCases.filter((s) => s.face.setCode?.toLowerCase() === 'm21'))
  for (const setCode of ['war', 'jmp'])
    for (const calibration of [undefined, 'auto', { profile: 'm21-modern' }])
      specimens.push({
        id: 'donor/' + setCode + '/' + s.id + '/' + JSON.stringify(calibration ?? 'legacy'),
        face: { ...s.face, setCode, calibration },
      });
const source = {
  fontAddition,
  proposalTool: hash(
    await readFile(new URL('./modern-frame-source-proposal.mjs', import.meta.url)),
  ),
  base,
  current: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  beforeRenderer: await sourceHash(path.join(referenceRoot, 'games/magic/src')),
  afterRenderer: await sourceHash(path.join(root, 'games/magic/src')),
  cases: hash(JSON.stringify(specimens)),
  tool: hash(await readFile(new URL(import.meta.url))),
};
const palette = {
  name: 'Fabled Passage',
  setCode: 'm21',
  collectorNumber: '246',
  typeLine: 'Land',
  land: true,
  colors: [],
  rulesText: '{T}: Add {C}.',
  illustration: 'native-compatibility-art',
  artist: 'Original test artist',
  legalText: 'Original test notice',
  securityStamp: 'oval',
  rarity: 'rare',
  colorCalibration: 'set-hsb-v1',
};
for (const [id, change] of Object.entries({
  exact: {},
  oracle: { wordingMode: 'oracle', rulesText: 'Different wording.' },
  neutral: { frameColors: [] },
  blue: { frameColors: ['U'] },
  wrongName: { name: 'Custom land' },
  wrongNumber: { collectorNumber: '245' },
  otherSet: { setCode: 'war' },
  source: { calibration: 'source' },
  exactPolicy: { calibration: 'printing' },
  eight: { setCode: '8ed', frameAssetFamily: 'eighth' },
}))
  specimens.push({ id: 'palette/' + id, face: { ...palette, ...change } });
for (const setCode of ['m21', 'war', '8ed'])
  for (const colors of [
    ['W', 'U'],
    ['R', 'G'],
  ])
    specimens.push({
      id: 'paired/' + setCode + '/' + colors.join(''),
      face: {
        ...palette,
        name: 'Paired legend control',
        collectorNumber: '42',
        setCode,
        colors,
        land: false,
        typeLine: 'Legendary Creature — Elf',
        legendary: true,
        power: '2',
        toughness: '3',
        ...(setCode === '8ed' ? { frameAssetFamily: 'eighth' } : {}),
      },
    });
source.cases = hash(JSON.stringify(specimens));
const faults = [];
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [root, referenceRoot] } },
  plugins: [
    await modernFrameSourceProposal(referenceRoot),
    {
      name: 'm21-scope-review',
      configureServer(s) {
        s.middlewares.use((req, res, next) => {
          if (req.url === '/__scope') {
            res.setHeader('Content-Type', 'text/html');
            res.end('<!doctype html><title>Calibration compatibility</title>');
          } else next();
        });
      },
    },
  ],
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage({ deviceScaleFactor: 1, locale: 'en-US' });
  page.on('pageerror', (e) => faults.push(String(e)));
  await page.route('https://**/*', async (r) => {
    faults.push('Unexpected external asset: ' + r.request().url());
    await r.abort();
  });
  await page.goto('http://127.0.0.1:' + server.httpServer.address().port + '/__scope');
  const result = await page.evaluate(
    async ({ referenceRoot, specimens }) => {
      const check = (v, m) => {
        if (!v) throw Error(m);
      };
      const prefix = '/games/magic/src/';
      const load = async (base) => {
        await import(/* @vite-ignore */ base + 'data/eager.ts');
        return {
          api: await import(/* @vite-ignore */ base + 'presentation/canvas-face.ts'),
          lands: await import(/* @vite-ignore */ base + 'presentation/modern-land-layers.ts'),
          artifacts: await import(
            /* @vite-ignore */ base + 'presentation/modern-artifact-layer.ts'
          ),
          assets: await import(/* @vite-ignore */ base + 'presentation/canvas-assets.ts'),
          frames: await import(/* @vite-ignore */ base + 'presentation/special-frames.ts'),
          profile: await import(/* @vite-ignore */ base + 'presentation/profile.ts'),
        };
      };
      const before = await load('/@fs' + referenceRoot + prefix),
        after = await load(prefix);
      const digest = async (data) =>
        [
          ...new Uint8Array(
            await crypto.subtle.digest(
              'SHA-256',
              typeof data === 'string' ? new TextEncoder().encode(data) : data,
            ),
          ),
        ]
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      const canvas = document.createElement('canvas');
      canvas.width = 488;
      canvas.height = 680;
      const c = canvas.getContext('2d');
      const gradient = c.createLinearGradient(0, 0, 488, 680);
      gradient.addColorStop(0, 'rgba(90,80,120,.75)');
      gradient.addColorStop(1, 'rgba(180,160,60,.95)');
      c.fillStyle = gradient;
      c.fillRect(0, 0, 488, 680);
      c.clearRect(100, 160, 150, 100);
      const bitmap = await createImageBitmap(canvas);
      const originalMeasure = CanvasRenderingContext2D.prototype.measureText,
        originalFill = CanvasRenderingContext2D.prototype.fillText,
        originalStroke = CanvasRenderingContext2D.prototype.strokeText;
      let trace;
      const state = (c) => [
        c.font,
        c.fillStyle,
        c.strokeStyle,
        c.textAlign,
        c.textBaseline,
        c.direction,
        c.globalAlpha,
        c.globalCompositeOperation,
        ...c.getTransform().toFloat64Array(),
      ];
      CanvasRenderingContext2D.prototype.measureText = function (text) {
        const r = originalMeasure.call(this, text);
        if (trace)
          trace.push([
            'measure',
            text,
            ...state(this),
            r.width,
            r.actualBoundingBoxLeft,
            r.actualBoundingBoxRight,
            r.actualBoundingBoxAscent,
            r.actualBoundingBoxDescent,
          ]);
        return r;
      };
      CanvasRenderingContext2D.prototype.fillText = function (...args) {
        if (trace) trace.push(['fill', ...args, ...state(this)]);
        return originalFill.apply(this, args);
      };
      CanvasRenderingContext2D.prototype.strokeText = function (...args) {
        if (trace) trace.push(['stroke', ...args, ...state(this)]);
        return originalStroke.apply(this, args);
      };
      const draw = async (r, face, tier, layer) => {
        const target = r.api.faceCanvas(tier),
          ctx = target.getContext('2d', { willReadFrequently: true });
        const owned = [];
        try {
          ctx.scale(target.width / 488, target.height / 680);
          const images = new Map(
            r.assets
              .canvasAssetUrls(face)
              .filter(Boolean)
              .map((url) => [url, bitmap]),
          );
          if (layer !== 'artwork')
            for (const job of [
              ...r.lands.modernLandMaterialJobs(face, images),
              ...r.artifacts.modernArtifactMaterialJobs(face, images),
            ]) {
              const layer = await job.build();
              owned.push(layer);
              images.set(job.url, layer);
            }
          trace = [];
          r.api.paintAssembledFace(
            ctx,
            face,
            images,
            680,
            false,
            undefined,
            layer === 'face' ? undefined : layer,
          );
          const measurements = await digest(JSON.stringify(trace));
          trace = null;
          const layout = {
            frame: r.frames.faceFrame(face),
            rects: r.frames.faceRects(face),
            profile: r.profile.resolveCardProfile(face),
          };
          return {
            pixels: await digest(ctx.getImageData(0, 0, target.width, target.height).data),
            measurements,
            layout: await digest(JSON.stringify(layout)),
          };
        } catch (error) {
          throw Error(globalThis.__modernDefaultCaseLabel + ': ' + String(error));
        } finally {
          trace = null;
          for (const bitmap of owned) bitmap.close();
          target.width = target.height = 0;
        }
      };
      const rows = [];
      try {
        for (const s of specimens)
          for (const tier of ['table', 'inspect'])
            for (const layer of ['face', 'printing', 'artwork']) {
              globalThis.__modernDefaultCaseLabel = s.id + '/' + tier + '/' + layer;
              globalThis.__modernDefaultsProposal = false;
              const old = await draw(before, s.face, tier, layer);
              const a = old;
              globalThis.__modernDefaultsProposal = false;
              const b = await draw(after, s.face, tier, layer);
              check(
                a.pixels === b.pixels,
                s.id + '/' + tier + '/' + layer + ': changed native pixels',
              );
              check(
                a.measurements === b.measurements,
                s.id + '/' + tier + '/' + layer + ': changed text calls',
              );
              check(
                a.layout === b.layout,
                s.id + '/' + tier + '/' + layer + ': changed frame geometry',
              );
              rows.push({
                id: s.id,
                tier,
                layer,
                inputHash: await digest(JSON.stringify(s.face)),
                scope: 'independent-frame-source-proposal',
                old,
                before: a,
                after: b,
              });
            }
      } finally {
        CanvasRenderingContext2D.prototype.measureText = originalMeasure;
        CanvasRenderingContext2D.prototype.fillText = originalFill;
        CanvasRenderingContext2D.prototype.strokeText = originalStroke;
        bitmap.close();
        canvas.width = canvas.height = 0;
      }
      return rows;
    },
    { referenceRoot, specimens },
  );
  assert.deepEqual(faults, []);
  assert.equal(
    await sourceHash(path.join(root, 'games/magic/src')),
    source.afterRenderer,
    'Source changed during default review',
  );
  await mkdir(output, { recursive: true });
  const proof = {
    schema: 1,
    status: 'modern-frame-source-collateral-audit',
    eligibleForPublication: false,
    scope:
      'Native table/inspect face, printing and artwork layers using generated local raster and browser fallback fonts. Production compares with an independently injected crown/gold-land proposal on immutable profile15 source. Old-era controls, exact-only policies, appearance overrides and metadata-leak controls are included. Actual source pigment is separately verified by the complete297-card native scan-bound adoption. This is collateral scope evidence, not scan calibration, real-font fidelity or a GPU benchmark.',
    source,
    faults,
    cases: specimens,
    rows: result,
  };
  await writeJson(path.join(output, 'proof.json'), proof);
  console.log(JSON.stringify({ cases: specimens.length, nativePairs: result.length, faults: 0 }));
} finally {
  await browser?.close();
  await server.close();
}
