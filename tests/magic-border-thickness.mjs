import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { cp, mkdir, mkdtemp, rm, symlink } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { chromium, webkit } from 'playwright';
import { createServer } from 'vite';

// Compare actual default pixels to the PR base, not to a reconstruction of the
// current painter. Shallow CI fetches only this immutable source revision.
const root = process.cwd();
const base = '8599fa45a62878cfa453e61352c4fe694e10715e';
const reference = await mkdtemp(path.join(os.tmpdir(), 'card-glint-border-base-'));
const screenshotDirectory = process.env.BORDER_THICKNESS_SCREENSHOT_DIR;
if (screenshotDirectory) await mkdir(screenshotDirectory, { recursive: true });
let server;
try {
  let repository = root;
  try {
    execFileSync('git', ['cat-file', '-e', `${base}^{commit}`], { cwd: repository, stdio: 'pipe' });
  } catch {
    repository = path.join(reference, 'baseline.git');
    execFileSync('git', ['init', '--bare', repository], { stdio: 'pipe' });
    execFileSync(
      'git',
      ['fetch', '--depth=1', 'https://github.com/witchesofthehill/card-glint.git', base],
      {
        cwd: repository,
        stdio: 'pipe',
      },
    );
  }
  const metadata = execFileSync('git', ['ls-tree', '--name-only', `${base}:games/magic`], {
    cwd: repository,
    encoding: 'utf8',
  })
    .trim()
    .split('\n')
    .filter((file) => /\.(?:json|css)$/.test(file))
    .map((file) => `games/magic/${file}`);
  const archive = execFileSync(
    'git',
    ['archive', base, 'games/magic/src', 'packages/browser/src', ...metadata],
    { cwd: repository, maxBuffer: 32 * 1024 * 1024 },
  );
  execFileSync('tar', ['-x', '-C', reference], { input: archive, stdio: 'pipe' });
  await cp(
    path.join(root, 'packages/browser/generated'),
    path.join(reference, 'packages/browser/generated'),
    {
      recursive: true,
    },
  );
  await symlink(path.join(root, 'node_modules'), path.join(reference, 'node_modules'), 'dir');
  server = await createServer({
    configFile: false,
    optimizeDeps: { noDiscovery: true },
    server: { host: '127.0.0.1', port: 0, hmr: false, fs: { allow: [root, reference] } },
  });
  await server.listen();
  for (const engine of [chromium, webkit]) {
    const browser = await engine.launch({ headless: true });
    try {
      const page = await browser.newPage();
      const externalRequests = [];
      await page.route(/https?:\/\//, async (route) => {
        if (new URL(route.request().url()).origin === new URL(server.resolvedUrls.local[0]).origin)
          return route.continue();
        externalRequests.push(route.request().url());
        return route.abort();
      });
      await page.goto(server.resolvedUrls.local[0]);
      const rows = await page.evaluate(
        async ({ reference, capture }) => {
          const { magic, opticalDocument } = await import('/games/magic/src/index.ts');
          const { composeCardTexture, cardTextureKey } = await import(
            '/games/magic/src/presentation/canvas-face.ts'
          );
          const before = await import(
            `/@fs/${reference}/games/magic/src/presentation/canvas-face.ts`
          );
          // Use installed system outlines under the pack's font names, as in magic.mjs.
          const local =
            'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
          for (const [family, style, weight] of [
            ['Goudy', 'normal', '400'],
            ['Historic Symbols', 'normal', '400'],
            ['Beleren', 'normal', '400 700'],
            ['Beleren Small Caps', 'normal', '700'],
            ['MPlantin', 'normal', '400'],
            ['MPlantin', 'italic', '400'],
            ['Relay', 'normal', '400'],
            ['Artist Credit', 'normal', '400'],
            ['Chapter', 'normal', '550'],
            ['Matrix', 'normal', '400 700'],
          ])
            document.fonts.add(
              await new FontFace('CardRenderer MTG ' + family, local, { style, weight }).load(),
            );
          if (capture) {
            document.body.replaceChildren();
            document.body.style.cssText =
              'margin:20px;background:#ddd;color:#111;font:16px sans-serif';
          }
          const check = (condition, message) => {
            if (!condition) throw Error(message);
          };
          const source = document.createElement('canvas');
          source.width = 488;
          source.height = 680;
          const context = source.getContext('2d');
          // Nonuniform, asymmetric marks expose movement, scaling and translucent ink.
          const image = context.createImageData(source.width, source.height);
          for (let y = 0; y < source.height; y++)
            for (let x = 0; x < source.width; x++) {
              const i = 4 * (y * source.width + x);
              image.data.set(
                [
                  40 + ((x * 13 + y * 3) % 150),
                  50 + ((x * 7 + y * 11) % 140),
                  60 + ((x * 5 + y * 17) % 130),
                  255,
                ],
                i,
              );
            }
          context.putImageData(image, 0, 0);
          const signal = new AbortController().signal;
          const images = (urls) => new Map(urls.filter(Boolean).map((url) => [url, source]));
          const hooks = {
            loadFonts: async () => {},
            loadRetroFont: async () => {},
            loadImages: async (urls) => ({ images: images(urls), dispose() {} }),
          };
          const host = {
            async images(requests) {
              return { value: images(requests.map((request) => request.url)), release() {} };
            },
          };
          const pixels = (canvas) =>
            canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height).data;
          const equal = (a, b, message) => {
            check(a.length === b.length, message + ': dimensions');
            for (let i = 0; i < a.length; i++)
              if (a[i] !== b[i]) throw Error(`${message}: byte ${i}, ${a[i]} != ${b[i]}`);
          };
          const release = (...canvases) => {
            for (const canvas of canvases) canvas.width = canvas.height = 0;
          };
          const input = (face, extra = {}) => ({
            face,
            printingId: null,
            printedImage: null,
            ...extra,
          });
          const face = {
            name: '',
            typeLine: '',
            rulesText: '',
            colors: ['U'],
            setCode: 'GLINT',
            illustration: 'synthetic:art',
            setSymbol: 'synthetic:symbol',
          };
          const split = {
            ...face,
            layout: 'split',
            faces: [
              { ...face, colors: ['U'], illustration: 'synthetic:top' },
              { ...face, colors: ['R'], illustration: 'synthetic:bottom' },
            ],
          };
          const rows = [];
          for (const tier of ['table', 'inspect']) {
            for (const [id, specimen] of [
              ['ordinary', face],
              ['split', split],
            ]) {
              for (const paintLayer of [undefined, 'printing', 'artwork']) {
                const original = await before.composeCardTexture(
                  input(specimen, { paintLayer }),
                  tier,
                  signal,
                  hooks,
                );
                const native = await composeCardTexture(
                  input(specimen, { paintLayer }),
                  tier,
                  signal,
                  hooks,
                );
                const zero = await composeCardTexture(
                  input({ ...specimen, borderThickness: 0 }, { paintLayer }),
                  tier,
                  signal,
                  hooks,
                );
                const bordered = await composeCardTexture(
                  input({ ...specimen, borderThickness: 0.125 }, { paintLayer }),
                  tier,
                  signal,
                  hooks,
                );
                const label = `${id}/${tier}/${paintLayer ?? 'color'}`;
                const a = pixels(native),
                  b = pixels(bordered);
                equal(a, pixels(original), label + ': omitted changed PR-base native pixels');
                equal(a, pixels(zero), label + ': explicit zero changed native pixels');
                const inset = native.width * 0.125;
                let interiorPixels = 0,
                  changedPixels = 0,
                  seamPixels = 0,
                  edgePixels = 0;
                for (let y = 0; y < native.height; y++)
                  for (let x = 0; x < native.width; x++) {
                    const i = 4 * (y * native.width + x);
                    const same = a.subarray(i, i + 4).every((v, k) => v === b[i + k]);
                    changedPixels += Number(!same);
                    if (
                      x > inset + 1 &&
                      x < native.width - inset - 2 &&
                      y > inset + 1 &&
                      y < native.height - inset - 2
                    ) {
                      check(same, label + `: interior moved at ${x},${y}`);
                      interiorPixels++;
                      if (Math.abs(y - native.height / 2) < 4) seamPixels++;
                    }
                    if (
                      paintLayer !== 'artwork' &&
                      ((x > 2 && x < inset - 1 && Math.abs(y - native.height / 2) < 2) ||
                        (x > native.width - inset + 1 &&
                          x < native.width - 2 &&
                          Math.abs(y - native.height / 2) < 2) ||
                        (y > 2 && y < inset - 1 && Math.abs(x - native.width / 2) < 2) ||
                        (y > native.height - inset + 1 &&
                          y < native.height - 2 &&
                          Math.abs(x - native.width / 2) < 2))
                    ) {
                      check(
                        b[i] === 9 && b[i + 1] === 8 && b[i + 2] === 6 && b[i + 3] === 255,
                        label + `: nonopaque/wrong outer stock at ${x},${y}`,
                      );
                      edgePixels++;
                    }
                  }
                check(
                  interiorPixels > (native.width * native.height) / 3,
                  label + ': interior probe is empty',
                );
                if (id === 'split') check(seamPixels > 100, label + ': split join not inspected');
                if (paintLayer === 'artwork') equal(a, b, label + ': artwork affected');
                else {
                  check(changedPixels > 100, label + ': overlay did not affect native printing');
                  check(edgePixels > 100, label + ': edges not inspected');
                }
                rows.push({
                  label,
                  baselineBytes: a.length,
                  interiorPixels,
                  seamPixels,
                  changedPixels,
                });
                if (capture && id === 'ordinary' && paintLayer === undefined) {
                  const publicBorder = await magic
                    .describe({ ...specimen, borderThickness: 0.08 }, tier)
                    .color.paint(host, signal);
                  const heading = document.createElement('h2');
                  heading.textContent = `${tier}: PR base / native default / public magic.describe borderThickness 0.08`;
                  document.body.append(heading);
                  const comparison = document.createElement('div');
                  comparison.style.cssText = 'display:flex;gap:16px;align-items:flex-start';
                  for (const canvas of [original, native, publicBorder]) {
                    const preview = document.createElement('img');
                    preview.src = canvas.toDataURL();
                    preview.style.width = `${tier === 'table' ? 244 : 366}px`;
                    comparison.append(preview);
                  }
                  document.body.append(comparison);
                  release(publicBorder);
                }
                release(original, native, zero, bordered);
              }
              const recipe = magic.describe(specimen, tier);
              const zeroRecipe = magic.describe({ ...specimen, borderThickness: 0 }, tier);
              const borderedRecipe = magic.describe({ ...specimen, borderThickness: 0.125 }, tier);
              check(
                recipe.color.key === zeroRecipe.color.key,
                `${id}/${tier}: zero color key changed`,
              );
              check(
                recipe.color.key !== borderedRecipe.color.key,
                `${id}/${tier}: color key unchanged`,
              );
              check(
                recipe.stamp.key === borderedRecipe.stamp.key,
                `${id}/${tier}: stamp key changed`,
              );
              check(
                JSON.stringify(recipe.edges) === JSON.stringify(borderedRecipe.edges),
                `${id}/${tier}: art edges changed`,
              );
              check(
                JSON.stringify(recipe.artWindows) === JSON.stringify(borderedRecipe.artWindows),
                `${id}/${tier}: art placement changed`,
              );
              check(
                recipe.cornerRadius === borderedRecipe.cornerRadius,
                `${id}/${tier}: silhouette geometry changed`,
              );
              const publicCanvas = await borderedRecipe.color.paint(host, signal);
              const direct = await composeCardTexture(
                input({ ...specimen, borderThickness: 0.125 }),
                tier,
                signal,
                hooks,
              );
              equal(
                pixels(publicCanvas),
                pixels(direct),
                `${id}/${tier}: magic.describe/direct parity`,
              );
              release(publicCanvas, direct);
              const optical = opticalDocument(1, 1, specimen, 'silver', tier);
              const opticalBorder = opticalDocument(
                1,
                1,
                { ...specimen, borderThickness: 0.125 },
                'silver',
                tier,
              );
              check(
                optical.recipe.color.key === opticalBorder.recipe.color.key,
                `${id}/${tier}: optical artwork key changed`,
              );
              check(
                optical.layers[0].raster.key !== opticalBorder.layers[0].raster.key,
                `${id}/${tier}: optical printing key unchanged`,
              );
              for (const paintLayer of [undefined, 'printing', 'artwork']) {
                const key = (value) => cardTextureKey(input(value, { paintLayer }), tier);
                check(
                  key(specimen) === key({ ...specimen, borderThickness: 0 }),
                  `${id}/${tier}: zero raster key changed`,
                );
                check(
                  (key(specimen) === key({ ...specimen, borderThickness: 0.125 })) ===
                    (paintLayer === 'artwork'),
                  `${id}/${tier}/${paintLayer}: wrong key invalidation`,
                );
              }
              check(
                cardTextureKey(input(specimen, { layer: 'etching' }), tier) ===
                  cardTextureKey(
                    input({ ...specimen, borderThickness: 0.125 }, { layer: 'etching' }),
                    tier,
                  ),
                `${id}/${tier}: etch key changed`,
              );
              const maskSpecimen = {
                ...specimen,
                setCode: null,
                faces: specimen.faces?.map((half) => ({ ...half, setCode: null })),
              };
              const maskHooks = { ...hooks, resolveEtching: async () => 'synthetic:etch-mask' };
              const etch = await composeCardTexture(
                input(maskSpecimen, { layer: 'etching' }),
                tier,
                signal,
                maskHooks,
              );
              const borderedEtch = await composeCardTexture(
                input({ ...maskSpecimen, borderThickness: 0.125 }, { layer: 'etching' }),
                tier,
                signal,
                maskHooks,
              );
              equal(pixels(etch), pixels(borderedEtch), `${id}/${tier}: etch mask pixels changed`);
              check(
                pixels(etch).some((v, i) => i % 4 === 3 && v > 0),
                `${id}/${tier}: empty etch probe`,
              );
              release(etch, borderedEtch);
            }
            // A scan has no native stock already at its edges. Its asymmetric
            // pixels let us measure each edge's full physical overlay thickness.
            for (const [stock, extra, rgb] of [
              ['black', {}, [9, 8, 6]],
              ['lifted black', { blackBorderLift: 0.2 }, [51, 51, 51]],
              ['white', { borderColor: 'white' }, [238, 237, 235]],
              ['silver', { borderColor: 'silver' }, [184, 187, 194]],
              ['calibrated', { setCode: 'NEO', colors: ['R'], calibration: 'auto' }, [22, 19, 14]],
            ]) {
              for (const paintLayer of [undefined, 'printing']) {
                const specimen = { ...face, ...extra };
                const extraInput = { printedImage: 'synthetic:scan', paintLayer };
                const native = await composeCardTexture(
                  input(specimen, extraInput),
                  tier,
                  signal,
                  hooks,
                );
                const original = await before.composeCardTexture(
                  input(specimen, extraInput),
                  tier,
                  signal,
                  hooks,
                );
                const zero = await composeCardTexture(
                  input({ ...specimen, borderThickness: 0 }, extraInput),
                  tier,
                  signal,
                  hooks,
                );
                const bordered = await composeCardTexture(
                  input({ ...specimen, borderThickness: 0.125 }, extraInput),
                  tier,
                  signal,
                  hooks,
                );
                const a = pixels(native),
                  b = pixels(bordered);
                const width = native.width,
                  height = native.height,
                  inset = width * 0.125;
                const label = `scan/${stock}/${tier}/${paintLayer ?? 'color'}`;
                equal(a, pixels(original), label + ': omitted changed PR-base scan');
                equal(a, pixels(zero), label + ': zero changed scan');
                for (let i = 3; i < a.length; i += 4)
                  check(a[i] === b[i], label + ': silhouette alpha changed');
                check(
                  b[3] === 0 &&
                    b[4 * (width - 1) + 3] === 0 &&
                    b[4 * ((height - 1) * width) + 3] === 0 &&
                    b[b.length - 1] === 0,
                  label + ': rounded corners filled',
                );
                check(
                  b.some((v, i) => i % 4 === 3 && v > 0 && v < 255),
                  label + ': missing silhouette antialiasing',
                );
                const pixel = (x, y) => b.subarray(4 * (y * width + x), 4 * (y * width + x) + 4);
                const stockPixel = (x, y) => pixel(x, y).every((v, i) => v === [...rgb, 255][i]);
                const counts = [];
                for (const point of [
                  (d) => [d, Math.floor(height / 2)],
                  (d) => [width - 1 - d, Math.floor(height / 2)],
                  (d) => [Math.floor(width / 2), d],
                  (d) => [Math.floor(width / 2), height - 1 - d],
                ]) {
                  let count = 0;
                  while (stockPixel(...point(count)) && count < inset + 3) count++;
                  check(
                    count === Math.floor(inset),
                    `${label}: physical inset ${count} != ${Math.floor(inset)}`,
                  );
                  counts.push(count);
                }
                let interiorPixels = 0;
                for (let y = Math.ceil(inset) + 1; y < height - Math.ceil(inset) - 1; y++)
                  for (let x = Math.ceil(inset) + 1; x < width - Math.ceil(inset) - 1; x++) {
                    const i = 4 * (y * width + x);
                    check(
                      a.subarray(i, i + 4).every((v, k) => v === b[i + k]),
                      label + ': scan rescaled/moved',
                    );
                    interiorPixels++;
                  }
                rows.push({ label, edgeThicknesses: counts, interiorPixels });
                release(native, original, zero, bordered);
              }
            }
            // The inclusive upper limit must paint stock, not fall back to native pixels.
            const maximum = await composeCardTexture(
              input({ ...face, borderThickness: 0.2 }, { printedImage: 'synthetic:scan' }),
              tier,
              signal,
              hooks,
            );
            const maximumPixels = pixels(maximum);
            const probe =
              4 *
              (Math.floor(maximum.height / 2) * maximum.width + Math.floor(maximum.width * 0.19));
            equal(
              maximumPixels.slice(probe, probe + 4),
              new Uint8ClampedArray([9, 8, 6, 255]),
              `${tier}: maximum border did not cover its interior edge`,
            );
            release(maximum);
          }
          for (const invalid of [NaN, Infinity, -Infinity, -0.001, 0.200001, '0.1', null]) {
            const specimen = { ...face, borderThickness: invalid };
            let assetWork = 0;
            let rejected = false;
            try {
              await composeCardTexture(input(specimen), 'table', signal, {
                beforePaint: async () => {
                  assetWork++;
                },
                loadFonts: async () => {
                  assetWork++;
                },
                loadImages: async () => {
                  assetWork++;
                  throw Error('asset work reached');
                },
              });
            } catch (error) {
              rejected = /border.*thickness|thickness.*border/i.test(String(error));
            }
            check(
              rejected && assetWork === 0,
              `Invalid ${String(invalid)} did not fail before assets`,
            );
            let described = false;
            try {
              magic.describe(specimen, 'table');
            } catch (error) {
              described = /border.*thickness|thickness.*border/i.test(String(error));
            }
            check(described, `magic.describe accepted invalid ${String(invalid)}`);
          }
          let customWork = 0;
          const custom = {
            key: 'synthetic:custom',
            artBounds: [0, 0, 1, 1],
            cornerRadius: 0.058,
            async compose() {
              customWork++;
              return document.createElement('canvas');
            },
          };
          for (const borderThickness of [undefined, 0]) {
            const customCanvas = await composeCardTexture(
              input({ ...face, borderThickness }, { custom }),
              'table',
              signal,
              {
                beforePaint: async () => {
                  customWork++;
                },
              },
            );
            release(customCanvas);
          }
          check(customWork === 4, 'Omitted/zero border changed custom painter behavior');
          customWork = 0;
          let customRejected = false;
          try {
            await composeCardTexture(
              input({ ...face, borderThickness: 0.08 }, { custom }),
              'table',
              signal,
              {
                beforePaint: async () => {
                  customWork++;
                },
                loadImages: async () => {
                  customWork++;
                  throw Error('custom asset work reached');
                },
              },
            );
          } catch (error) {
            customRejected = /borderThickness.*custom|custom.*borderThickness/i.test(String(error));
          }
          check(
            customRejected && customWork === 0,
            'Positive custom border did not reject before hooks',
          );
          magic.dispose();
          release(source);
          return rows;
        },
        { reference, capture: Boolean(screenshotDirectory) },
      );
      assert.deepEqual(externalRequests, [], 'Browser attempted external asset access');
      if (screenshotDirectory) {
        await page.setViewportSize({ width: 1180, height: 1400 });
        await page.screenshot({
          path: path.join(screenshotDirectory, `magic-border-thickness-${engine.name()}.png`),
          fullPage: true,
        });
      }
      console.log(`${engine.name()}: ${rows.length} border pixel cases passed against ${base}`);
    } finally {
      await browser.close();
    }
  }
} finally {
  await server?.close();
  await rm(reference, { recursive: true, force: true });
}
