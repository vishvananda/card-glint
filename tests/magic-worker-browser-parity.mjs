import { preWalkerSource } from '../games/magic/tools/accuracy/planeswalker-reconstruction/ancestry.mjs';
import { hostWorkerProofSource } from './magic-host-worker-source-guard.mjs';
import assert from 'node:assert/strict';
import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { chromium } from 'playwright';
import { createServer, transformWithEsbuild } from 'vite';
import { format, resolveConfig } from 'prettier';
const root = fileURLToPath(new URL('..', import.meta.url));
const proofFile = 'games/magic/fixtures/accuracy/host-worker/source-proof.json';
const proof = JSON.parse(await readFile(proofFile));
const sha = (b) => createHash('sha256').update(b).digest('hex');
function baseline(file, bytes) {
  const c = proof.files[file];
  if (!c) return bytes;
  assert.equal(sha(bytes), c.after, file);
  const lines = bytes.toString().match(/[^\n]*\n|[^\n]+$/g) ?? [];
  for (const e of c.reverseEdits) lines.splice(e.start, e.count, ...e.lines);
  const before = Buffer.from(lines.join(''));
  assert.equal(sha(before), c.before);
  return before;
}
const prefix = '\0worker-baseline:';
const walkerPrefix = '\0walker-baseline:';
const profilePrefix = '\0profile-baseline:';
const server = await createServer({
  configFile: false,
  root,
  plugins: [
    {
      name: 'reviewed-worker-baseline',
      enforce: 'pre',
      resolveId(id, importer) {
        if (id === '/__walker_baseline/presentation.ts')
          return walkerPrefix + 'games/magic/src/presentation.ts';
        if (id === '/__profile_baseline/presentation.ts')
          return profilePrefix + 'games/magic/src/presentation.ts';
        const activePrefix = importer?.startsWith(walkerPrefix)
          ? walkerPrefix
          : importer?.startsWith(profilePrefix)
            ? profilePrefix
            : prefix;
        if (id === '/__worker_baseline/presentation.ts')
          return prefix + 'games/magic/src/presentation.ts';
        if (importer?.startsWith(activePrefix) && id.startsWith('.')) {
          let file = path.posix.normalize(
            path.posix.join(
              path.posix.dirname(importer.slice(activePrefix.length).split('?')[0]),
              id,
            ),
          );
          if (file.endsWith('.js') && existsSync(path.join(root, file.slice(0, -3) + '.ts')))
            file = file.slice(0, -3) + '.ts';
          return activePrefix + file;
        }
      },
      async load(id) {
        const historicalWalker = id.startsWith(walkerPrefix),
          historicalProfile = id.startsWith(profilePrefix);
        if (!id.startsWith(prefix) && !historicalWalker && !historicalProfile) return;
        const file = id.slice(
          historicalWalker
            ? walkerPrefix.length
            : historicalProfile
              ? profilePrefix.length
              : prefix.length,
        );
        if (file.endsWith('?raw'))
          return (
            'export default ' +
            JSON.stringify(await readFile(path.join(root, file.slice(0, -4)), 'utf8')) +
            ';'
          );
        const bytes = await readFile(path.join(root, file));
        const code = (
          historicalWalker
            ? await preWalkerSource(file, bytes)
            : historicalProfile
              ? await hostWorkerProofSource(file)
              : baseline(file, await hostWorkerProofSource(file))
        ).toString();
        return file.endsWith('.ts')
          ? (await transformWithEsbuild(code, file, { loader: 'ts', target: 'esnext' })).code
          : code;
      },
    },
  ],
  server: { host: '127.0.0.1', port: 0, hmr: false },
  optimizeDeps: { noDiscovery: true },
});
let browser;
try {
  await server.listen();
  browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  const url = new URL('worker-browser-parity.html', server.resolvedUrls.local[0]).href;
  await page.route(url, (r) =>
    r.fulfill({
      contentType: 'text/html',
      body: '<!doctype html><title>Default browser parity</title>',
    }),
  );
  await page.goto(url);
  const rows = await page.evaluate(async () => {
    const current = await import('/games/magic/src/presentation.ts'),
      before = await import('/__worker_baseline/presentation.ts'),
      historicalWalker = await import('/__walker_baseline/presentation.ts'),
      historicalProfile = await import('/__profile_baseline/presentation.ts');
    const local = 'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")';
    for (const { family, weight, style } of current.canvasFontAssets)
      document.fonts.add(await new FontFace(family, local, { weight, style }).load());
    const images = new Map();
    let requested;
    const loadImages = async (urls, signal) => {
      const map = new Map();
      for (const url of urls.filter(Boolean)) {
        signal.throwIfAborted();
        requested.add(url);
        let image = images.get(url);
        if (!image) {
          const c = document.createElement('canvas');
          c.width = c.height = 64;
          const ctx = c.getContext('2d');
          let n = 0;
          for (const c of url) n = (n * 31 + c.charCodeAt(0)) >>> 0;
          ctx.fillStyle = `rgb(${90 + (n % 120)},${90 + ((n >>> 8) % 120)},${90 + ((n >>> 16) % 120)})`;
          ctx.fillRect(0, 0, 64, 64);
          ctx.fillStyle = '#dec29a';
          ctx.fillRect(5, 12, 54, 48);
          ctx.fillStyle = '#444';
          ctx.fillRect(0, 5, 64, 3);
          ctx.fillRect(61, 0, 3, 64);
          ctx.fillRect(28, 20, 8, 24);
          image = await createImageBitmap(c);
          images.set(url, image);
          c.width = c.height = 0;
        }
        map.set(url, image);
      }
      return { images: map, dispose() {} };
    };
    const base = {
      name: 'Original Test Adept',
      typeLine: 'Creature — Wizard',
      colors: ['U'],
      manaSymbols: ['2', 'U'],
      rulesText: 'Draw a card.\nA second paragraph.',
      flavorText: 'A printed memory.',
      power: '2',
      toughness: '3',
      illustration: 'original-fixture-art',
      artist: 'Original Artist',
    };
    const cases = [];
    for (const set of ['lea', 'leb', '2ed', '3ed', '4ed', 'leg', 'usg', '8ed', 'm21', 'plc'])
      for (const color of ['W', 'B'])
        cases.push({
          label: set + '-' + color,
          face: {
            ...base,
            setCode: set,
            colors: [color],
            manaSymbols: ['2', color],
            colorCalibration: 'set-hsb-v1',
            wordingMode: 'original',
          },
        });
    for (const set of ['lea', 'leb', '3ed', 'm21'])
      cases.push({
        label: set + '-dual',
        face: {
          ...base,
          setCode: set,
          typeLine: 'Land',
          colors: [],
          frameColors: ['B', 'G'],
          producedMana: ['B', 'G'],
          land: true,
          creature: false,
          manaSymbols: [],
          power: undefined,
          toughness: undefined,
        },
      });
    cases.push({
      label: 'walker',
      face: {
        ...base,
        setCode: 'm21',
        typeLine: 'Legendary Planeswalker — Test',
        loyalty: '4',
        power: undefined,
        toughness: undefined,
        rulesText: '+1: Draw a card.\n−2: Gain life.',
      },
    });
    cases.push({
      label: 'saga',
      face: {
        ...base,
        setCode: 'khm',
        typeLine: 'Enchantment — Saga',
        rulesText: 'I — Draw a card.\nII — Gain life.\nIII — Sacrifice this Saga.',
        power: undefined,
        toughness: undefined,
      },
    });
    cases.push({
      label: 'battle-pr8',
      face: {
        ...base,
        setCode: 'mom',
        frameTemplate: 'battle',
        typeLine: 'Battle — Siege',
        defense: '0',
        reverseStats: { power: '3', toughness: '4' },
      },
    });
    cases.push({ label: 'future', face: { ...base, setCode: 'fut', frameTemplate: 'future' } });
    const rows = [];
    try {
      for (const { label, face } of cases)
        for (const tier of ['table', 'inspect']) {
          const results = [];
          // Intentional 0.6.3 planeswalker changes have their own native/material tests.
          // Preserve the earlier host-portability proof against its exact source.
          // Unlimited 0.6.7 is intentionally changed. Compare the original worker
          // transition on its verified historical profile. Current Unlimited
          // browser/worker pixels have their own positive parity test.
          // M21 calibration intentionally changes its frames and typography too.
          // Its current browser/worker parity is tested separately at all three tiers.
          // Alpha/Beta text and dual-perimeter calibration are intentional too.
          // The current ABU parity replay covers their text and dual frames.
          // Revised Original fractional metrics have a current worker parity replay too.
          // Matrix's alphabetic baseline is an intentional 0.7.3 correction.
          // Preserve this original host transition with its historical font
          // behavior; magic-matrix-worker-parity tests the current painter.
          for (const api of [
            before,
            label === 'walker'
              ? historicalWalker
              : ['lea', 'leb', '2ed', '3ed', 'm21'].includes(face.setCode) || label === 'future'
                ? historicalProfile
                : current,
          ]) {
            requested = new Set();
            const c = await api.composeCardTexture(
              {
                face,
                printingId: null,
                printedImage: null,
              },
              tier,
              new AbortController().signal,
              { loadImages, loadFonts: async () => {}, loadRetroFont: async () => {} },
            );
            const pixels = c.getContext('2d').getImageData(0, 0, c.width, c.height).data;
            results.push({ width: c.width, height: c.height, pixels, urls: [...requested].sort() });
            c.width = c.height = 0;
          }
          const [a, b] = results;
          if (a.pixels.length !== b.pixels.length) throw Error(label + ' size mismatch');
          let changed = 0;
          for (let i = 0; i < a.pixels.length; i++) if (a.pixels[i] !== b.pixels[i]) changed++;
          const hash = async (bytes) =>
            Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', bytes)))
              .map((v) => v.toString(16).padStart(2, '0'))
              .join('');
          rows.push({
            label,
            tier,
            size: [a.width, a.height],
            changedBytes: changed,
            assetsIdentical: JSON.stringify(a.urls) === JSON.stringify(b.urls),
            before: await hash(a.pixels),
            after: await hash(b.pixels),
          });
        }
    } finally {
      for (const b of images.values()) b.close();
    }
    return rows;
  });
  assert.equal(rows.length, 56);
  for (const r of rows) {
    assert.equal(r.changedBytes, 0, JSON.stringify(r));
    assert.equal(r.assetsIdentical, true);
    assert.equal(r.before, r.after);
  }
  const report = {
    schema: 1,
    baselineCommit: proof.baselineCommit,
    battleCommit: proof.battleCommit,
    scope:
      'Original synthetic art/frame bitmaps with local system outlines; default browser table/inspect painting. The Battle baseline includes PR 8; no renewed scan calibration is claimed.',
    rows,
  };
  if (process.argv.includes('--capture')) {
    const out = proof.evidence;
    const options = { ...(await resolveConfig(proofFile)), parser: 'json' };
    await writeFile(out, await format(JSON.stringify(report), options));
    proof.evidenceHash = sha(await readFile(out));
    await writeFile(proofFile, await format(JSON.stringify(proof), options));
  }
  console.log(
    JSON.stringify({
      cases: rows.length,
      changedBytes: 0,
      assetsIdentical: true,
      evidenceHash: proof.evidenceHash,
    }),
  );
} finally {
  await browser?.close();
  await server.close();
}
