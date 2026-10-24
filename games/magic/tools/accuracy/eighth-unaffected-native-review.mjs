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
assert(output, 'Usage: eighth-unaffected-native-review.mjs REFERENCE_ROOT OUT');
const base = execFileSync('git', ['rev-parse', 'HEAD'], {
  cwd: referenceRoot,
  encoding: 'utf8',
}).trim();
assert.equal(
  base,
  'e60e172fb0d571d90752ae789d155d28640a7588',
  'Use the exact pre-Eighth-profile source',
);
assert.deepEqual(
  await readFile(path.join(root, 'games/magic/assets.json')),
  await readFile(path.join(referenceRoot, 'games/magic/assets.json')),
);
const beforeFonts = await readFile(path.join(referenceRoot, 'games/magic/fonts.css'));
const afterFonts = await readFile(path.join(root, 'games/magic/fonts.css'));
assert.deepEqual(afterFonts.subarray(0, beforeFonts.length), beforeFonts);
const fontAddition = hash(afterFonts.subarray(beforeFonts.length));
assert.equal(fontAddition, hash(Buffer.alloc(0)), 'Eighth calibration must not change fonts');

assert.equal(
  await sourceHash(path.join(root, 'packages/browser/src')),
  await sourceHash(path.join(referenceRoot, 'packages/browser/src')),
);
const eligibility = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
let specimens;
try {
  const { supportsEighthStyleDefaults } = await eligibility.ssrLoadModule(
    '/games/magic/src/presentation/eighth-style-scope.ts',
  );
  specimens = nativeHostCases.filter((s) => !supportsEighthStyleDefaults(s.face));
} finally {
  await eligibility.close();
}
for (const s of nativeHostCases.filter((s) => s.face.setCode?.toLowerCase() === 'm21'))
  for (const setCode of ['war', 'jmp'])
    for (const calibration of [undefined, 'auto', { profile: 'm21-modern' }])
      specimens.push({
        id: 'donor/' + setCode + '/' + s.id + '/' + JSON.stringify(calibration ?? 'legacy'),
        face: { ...s.face, setCode, calibration },
      });
const source = {
  fontAddition,
  base,
  current: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  beforeRenderer: await sourceHash(path.join(referenceRoot, 'games/magic/src')),
  afterRenderer: await sourceHash(path.join(root, 'games/magic/src')),
  cases: hash(JSON.stringify(specimens)),
  tool: hash(await readFile(new URL(import.meta.url))),
};
const faults = [];
const server = await createServer({
  configFile: false,
  root,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [root, referenceRoot] } },
  plugins: [
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
          assets: await import(/* @vite-ignore */ base + 'presentation/canvas-assets.ts'),
          lands: await import(/* @vite-ignore */ base + 'presentation/modern-land-layers.ts'),
          artifacts: await import(
            /* @vite-ignore */ base + 'presentation/modern-artifact-layer.ts'
          ),
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
              const value = await job.build();
              owned.push(value);
              images.set(job.url, value);
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
        } finally {
          trace = null;
          for (const value of owned) value.close();
          target.width = target.height = 0;
        }
      };
      const rows = [];
      try {
        for (const s of specimens)
          for (const tier of ['table', 'inspect'])
            for (const layer of ['face', 'printing', 'artwork']) {
              const a = await draw(before, s.face, tier, layer),
                b = await draw(after, s.face, tier, layer);
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
    'Renderer changed during native control replay',
  );
  await mkdir(output, { recursive: true });
  const proof = {
    schema: 1,
    status: 'unaffected-native-source-audit',
    eligibleForPublication: false,
    scope:
      'Same generated local raster and browser fallback fonts. Native table/inspect face, printing and artwork layers; text measurement/draw calls and frame descriptors. Excludes intentional ordinary Eighth changes; independently calibrated PLC stays in the unchanged controls. No cached scans or actual artwork/color-fit certification, actual-asset pigment certification or GPU benchmark. Required synthetic land/artifact layer preparation is included; no general HSB-material certification.',
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
