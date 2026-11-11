import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createServer, transformWithEsbuild } from 'vite';
import { chromium } from 'playwright';

// Compare the full unchanged painter, not a second implementation of the new feature.
const parent = 'a39f137a';
const prefix = '\0indicator-parent:';
const source = new Map();
function parentSource(file) {
  if (!source.has(file)) {
    let bytes;
    try {
      bytes = execFileSync('git', ['show', `${parent}:${file}`], {
        stdio: ['ignore', 'pipe', 'pipe'],
      });
    } catch {
      assert(/^(games\/magic\/src\/data\/|packages\/browser\/generated\/)/.test(file), file);
      return readFile(file);
    }
    source.set(file, bytes);
  }
  return source.get(file);
}
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'color-indicator-parent',
      enforce: 'pre',
      resolveId(id, importer) {
        if (id.startsWith('/__indicator_parent/'))
          return prefix + id.slice('/__indicator_parent/'.length);
        if (importer?.startsWith(prefix) && id.startsWith('.')) {
          let file = path.posix.normalize(
            path.posix.join(path.posix.dirname(importer.slice(prefix.length)), id),
          );
          if (file.endsWith('.js')) file = file.slice(0, -3) + '.ts';
          return prefix + file;
        }
      },
      async load(id) {
        if (!id.startsWith(prefix)) return;
        const file = id.slice(prefix.length),
          raw = file.endsWith('?raw');
        const bytes = await parentSource(raw ? file.slice(0, -4) : file);
        if (raw) return 'export default ' + JSON.stringify(bytes.toString());
        if (file.endsWith('.json')) return bytes.toString();
        return file.endsWith('.ts')
          ? (await transformWithEsbuild(bytes.toString(), file, { loader: 'ts', target: 'es2022' }))
              .code
          : bytes.toString();
      },
    },
  ],
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/__indicator_parent/games/magic/src/data/eager.ts');
    const current = await import('/games/magic/src/presentation.ts');
    const before = await import('/__indicator_parent/games/magic/src/presentation.ts');
    const base = {
      name: 'Indicator Probe',
      colors: ['U'],
      typeLine: 'Creature — Wizard',
      rulesText: 'Draw a card.',
      illustration: 'fixture-art',
      manaSymbols: ['2', 'U'],
      power: '2',
      toughness: '3',
      artist: 'Original Artist',
      setCode: 'GLINT',
      securityStamp: 'none',
    };
    const pair = (a = 'Instant', b = 'Sorcery') => [
      {
        ...base,
        name: 'First',
        typeLine: a,
        colors: ['U'],
        power: undefined,
        toughness: undefined,
      },
      {
        ...base,
        name: 'Second',
        typeLine: b,
        colors: ['R'],
        power: undefined,
        toughness: undefined,
      },
    ];
    const cases = [
      ['components', base],
      ['long-type', { ...base, typeLine: 'Legendary Creature — Human Elf Wizard Advisor' }],
      ['m21', { ...base, setCode: 'm21' }],
      ['artifact', { ...base, typeLine: 'Artifact', colors: [], manaSymbols: ['1'] }],
      [
        'eighth-white',
        { ...base, setCode: '8ed', frameAssetFamily: 'eighth', borderColor: 'white' },
      ],
      ['eighth-black', { ...base, frameAssetFamily: 'eighth', borderColor: 'black' }],
      ['modern-plate', { ...base, frameAssetFamily: 'm15-accurate' }],
      [
        'colorshifted',
        { ...base, setCode: 'plc', frameAssetFamily: 'eighth', frameTreatment: 'colorshifted' },
      ],
      ['alpha', { ...base, setCode: 'lea', frameStyle: 'retro' }],
      ['beta', { ...base, setCode: 'leb', frameStyle: 'retro' }],
      ['revised', { ...base, setCode: '3ed', frameStyle: 'retro' }],
      ['legends', { ...base, setCode: 'leg', colors: ['U', 'R'], frameStyle: 'retro' }],
      ['future', { ...base, frameTemplate: 'future' }],
      [
        'future-full',
        { ...base, frameTemplate: 'future', futureTreatment: 'full-art', rulesText: '' },
      ],
      [
        'planeswalker',
        {
          ...base,
          typeLine: 'Legendary Planeswalker — Test',
          power: undefined,
          toughness: undefined,
          loyalty: '3',
          rulesText: '+1: Draw a card.\n-2: Scry 2.',
        },
      ],
      [
        'large-walker',
        {
          ...base,
          typeLine: 'Legendary Planeswalker — Test',
          loyalty: '4',
          rulesText: '+1: Draw a card.\n0: Scry 1.\n-1: Gain 1 life.\n-4: Draw two cards.',
        },
      ],
      [
        'saga',
        {
          ...base,
          typeLine: 'Enchantment — Saga',
          rulesText: 'I — Draw a card.\nII — Scry 1.\nIII — Draw a card.',
        },
      ],
      ['class', { ...base, typeLine: 'Enchantment — Class', rulesText: 'Draw a card.' }],
      ['leveler', { ...base, layout: 'leveler', rulesText: 'Level up {U}\nLEVEL 1-2\nFlying' }],
      [
        'adventure',
        { ...base, layout: 'adventure', faces: pair('Creature — Wizard', 'Sorcery — Adventure') },
      ],
      ['prepared', { ...base, layout: 'prepare', faces: pair('Creature — Wizard', 'Sorcery') }],
      ['split-old', { ...base, layout: 'split', frameStyle: 'retro', faces: pair() }],
      ['split-eighth', { ...base, layout: 'split', frameAssetFamily: 'eighth', faces: pair() }],
      ['split-modern', { ...base, layout: 'split', faces: pair() }],
      [
        'rooms',
        { ...base, layout: 'split', faces: pair('Enchantment — Room', 'Enchantment — Room') },
      ],
      ['aftermath', { ...base, layout: 'aftermath', faces: pair() }],
      ['flip', { ...base, frameTemplate: 'flip', faces: pair('Creature', 'Creature') }],
      ['battle', { ...base, typeLine: 'Battle — Siege', frameTemplate: 'battle', defense: '4' }],
    ];
    const local = 'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
    await Promise.all(
      current.canvasFontAssets.map(async ({ family, style, weight }) =>
        document.fonts.add(await new FontFace(family, local, { style, weight }).load()),
      ),
    );
    const commonCanvas = new OffscreenCanvas(64, 64),
      cc = commonCanvas.getContext('2d');
    cc.fillStyle = '#85947f';
    cc.fillRect(0, 0, 64, 64);
    const common = commonCanvas.transferToImageBitmap();
    const indicators = new Map();
    const palettes = {
      w: '#f6f1dc',
      u: '#1476bd',
      b: '#302b28',
      r: '#de352c',
      g: '#237c46',
      a: '#aaa9a5',
    };
    function indicator(url) {
      if (!indicators.has(url)) {
        const color = /\/([wubrga])identity\.png$/.exec(url)[1];
        const canvas = new OffscreenCanvas(64, 64),
          c = canvas.getContext('2d');
        c.fillStyle = '#151719';
        c.beginPath();
        c.arc(32, 32, 32, 0, 2 * Math.PI);
        c.fill();
        c.fillStyle = palettes[color];
        c.beginPath();
        c.arc(32, 32, 27, 0, 2 * Math.PI);
        c.fill();
        indicators.set(url, canvas.transferToImageBitmap());
      }
      return indicators.get(url);
    }
    function images(api, face) {
      return new Map([
        ['card-glint:eighth-stock-rule', common],
        ...api
          .canvasAssetUrls(face)
          .filter(Boolean)
          .map((url) => [url, url.includes('/indicators/') ? indicator(url) : common]),
      ]);
    }
    async function paint(api, face, width, layer) {
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = Math.round((width * 680) / 488);
      const c = canvas.getContext('2d'),
        draws = [];
      const originalImages = images(api, face);
      const prepared =
        api.prepareColorIndicators && layer !== 'artwork'
          ? await api.prepareColorIndicators(face, originalImages, new AbortController().signal)
          : { images: originalImages, dispose() {} };
      const map = prepared.images;
      const indicatorBitmaps = new Set(
        [...map]
          .filter(
            ([url]) =>
              url.includes('/indicators/') || url.startsWith('card-glint:color-indicator:'),
          )
          .map(([, bitmap]) => bitmap),
      );
      c.scale(width / 488, canvas.height / 680);
      const draw = c.drawImage.bind(c);
      c.drawImage = (image, ...args) => {
        if (indicatorBitmaps.has(image)) {
          const [x, y, w, h] = args,
            m = c.getTransform();
          const pts = [
            [x, y],
            [x + w, y],
            [x, y + h],
            [x + w, y + h],
          ].map(([a, b]) => [m.a * a + m.c * b + m.e, m.b * a + m.d * b + m.f]);
          const xs = pts.map((p) => p[0]),
            ys = pts.map((p) => p[1]);
          draws.push([
            Math.min(...xs) / canvas.width,
            Math.min(...ys) / canvas.height,
            (Math.max(...xs) - Math.min(...xs)) / canvas.width,
            (Math.max(...ys) - Math.min(...ys)) / canvas.height,
          ]);
        }
        draw(image, ...args);
      };
      try {
        api.paintAssembledFace(c, face, map, 680, false, undefined, layer);
      } finally {
        prepared.dispose();
      }
      return { canvas, pixels: c.getImageData(0, 0, canvas.width, canvas.height).data, draws };
    }
    const rows = [];
    for (const [name, face] of cases) {
      const visible = {
        ...face,
        colorIndicator: ['U'],
        ...(face.faces
          ? { faces: face.faces.map((f, i) => ({ ...f, colorIndicator: i ? ['R', 'G'] : ['U'] })) }
          : {}),
      };
      for (const width of [244, 488, 732]) {
        const a = await paint(before, face, width),
          b = await paint(current, face, width);
        let changed = 0;
        for (let i = 0; i < a.pixels.length; i++) if (a.pixels[i] !== b.pixels[i]) changed++;
        if (changed) throw Error(name + ' changed ' + changed + ' default bytes at ' + width);
        const shown = await paint(current, visible, width);
        const regions = current.colorIndicatorRegions(visible);
        if (!regions.length || !shown.draws.length) throw Error(name + ' lost indicator');
        for (const region of regions) {
          const distance = Math.min(
            ...shown.draws.map((r) => Math.max(...r.map((v, i) => Math.abs(v - region.rect[i])))),
          );
          if (distance > 1e-6)
            throw Error(
              name +
                ' semantic geometry mismatch ' +
                distance +
                ' ' +
                JSON.stringify({ regions, draws: shown.draws }),
            );
        }
        let ink = 0;
        for (let i = 0; i < shown.pixels.length; i++) if (shown.pixels[i] !== b.pixels[i]) ink++;
        if (!ink) throw Error(name + ' indicator changed no pixels');
        if (width === 488) {
          shown.canvas.id = 'preview-' + name;
          shown.canvas.style.width = '244px';
          document.body.append(shown.canvas);
        }
        rows.push({
          name,
          width,
          changedDefaultBytes: changed,
          regions: regions.length,
          changedIndicatorBytes: ink,
        });
      }
      const plainArt = await paint(current, face, 244, 'artwork'),
        withArt = await paint(current, visible, 244, 'artwork');
      if (withArt.draws.length) throw Error(name + ' indicator entered artwork-only layer');
      if (!plainArt.pixels.every((v, i) => v === withArt.pixels[i]))
        throw Error(name + ' changed artwork');
    }
    const blue = {
      name: 'Sol Ring',
      typeLine: 'Artifact',
      colors: [],
      manaSymbols: ['1'],
      setCode: 'GLINT',
      currentColors: ['U'],
      colorIndicatorDisplay: 'current-if-changed',
    };
    const multicolor = { ...blue, currentColors: ['U', 'B', 'R'] };
    const sources = images(current, multicolor),
      controller = new AbortController();
    const first = await current.prepareColorIndicators(multicolor, sources, controller.signal);
    const second = await current.prepareColorIndicators(multicolor, sources, controller.signal);
    const compositeKey = 'card-glint:color-indicator:UBR';
    if (first.images.get(compositeKey) !== second.images.get(compositeKey))
      throw Error('Warm indicator preparation did not reuse its bitmap');
    first.dispose();
    if (second.images.get(compositeKey).width !== 128)
      throw Error('Leased indicator was closed early');
    second.dispose();
    controller.abort();
    try {
      await current.prepareColorIndicators(multicolor, sources, controller.signal);
      throw Error('Abort ignored');
    } catch (e) {
      if (e.name !== 'AbortError') throw e;
    }
    const solid = (await paint(current, blue, 488)).canvas;
    const png = await new Promise((resolve) => solid.toBlob(resolve, 'image/png'));
    const bitmap = await createImageBitmap(png);
    const exported = document.createElement('canvas');
    exported.width = 488;
    exported.height = 680;
    const ctx = exported.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const original = solid.getContext('2d').getImageData(0, 0, 488, 680).data;
    if (!ctx.getImageData(0, 0, 488, 680).data.every((v, i) => v === original[i]))
      throw Error('PNG indicator export differs');
    current.clearColorIndicatorBitmaps();
    for (const bitmap of indicators.values()) bitmap.close();
    common.close();
    return {
      rows,
      pngExport: true,
      scope:
        'Canvas2D synthetic asset controls; exact default pixels vs origin/main parent, not scan accuracy or GPU throughput.',
    };
  });
  assert.equal(result.rows.length, 84);
  assert.deepEqual(errors, []);
  await mkdir('evidence/color-indicators', { recursive: true });
  await page.screenshot({ path: 'evidence/color-indicators/layouts.png', fullPage: true });
  const files = (
    execFileSync('git', ['diff', '--name-only', parent], { encoding: 'utf8' }) +
    execFileSync('git', ['ls-files', '--others', '--exclude-standard', 'games/magic/src'], {
      encoding: 'utf8',
    })
  )
    .trim()
    .split('\n')
    .filter(
      (f) =>
        (f.startsWith('games/magic/src/') || f === 'games/magic/tools/accuracy/adapter.mjs') &&
        /\.(ts|mjs)$/.test(f),
    );
  result.parent = execFileSync('git', ['rev-parse', parent], { encoding: 'utf8' }).trim();
  result.checkedAt = new Date().toISOString();
  result.tool = {
    file: 'tests/magic-color-indicators-browser.mjs',
    sha256: createHash('sha256')
      .update(await readFile('tests/magic-color-indicators-browser.mjs'))
      .digest('hex'),
  };
  result.sources = Object.fromEntries(
    await Promise.all(
      files.map(async (f) => [
        f,
        createHash('sha256')
          .update(await readFile(f))
          .digest('hex'),
      ]),
    ),
  );
  await writeFile(
    'evidence/color-indicators/painter-parity.json',
    JSON.stringify(result, null, 2) + '\n',
  );
  console.log(
    JSON.stringify({
      controls: result.rows.length,
      defaultChangedBytes: result.rows.reduce((n, r) => n + r.changedDefaultBytes, 0),
      pngExport: result.pngExport,
      errors,
    }),
  );
} finally {
  await browser?.close();
  await server.close();
}
