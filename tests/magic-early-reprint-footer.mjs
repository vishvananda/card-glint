import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
import { createServer } from 'vite';
import { chromium } from 'playwright';
import {
  earlyReprintFooterProof,
  preEarlyReprintFooterSource,
} from './magic-early-reprint-footer-source-guard.mjs';

await earlyReprintFooterProof();
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
let browser;
try {
  const { earlyReprintFooter, paintEarlyReprintFooter } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-footer.ts',
  );
  const untouched = new Proxy({}, { get: () => assert.fail('Unrelated footer touched canvas') });
  for (const setCode of ['fem', '4ed', 'chr']) {
    const face = { name: 'Footer probe', setCode, colors: ['G'], typeLine: 'Summon Creature' };
    const p = earlyReprintFooter(face);
    assert.ok(p);
    assert.deepEqual(
      earlyReprintFooter({ ...face, setCode: setCode.toUpperCase(), wordingMode: 'oracle' }),
      p,
    );
    assert.equal(earlyReprintFooter({ ...face, legalText: null }).legalText, null);
    assert.equal(earlyReprintFooter({ ...face, legalText: '' }).legalText, '');
    assert.equal(
      earlyReprintFooter({ ...face, legalText: 'Custom legal' }).legalText,
      'Custom legal',
    );
    for (const colors of [['W'], ['U'], ['R'], ['W', 'U']]) {
      const q = earlyReprintFooter({ ...face, colors });
      if (q) assert.equal(q.legalGray, q.legal.darkGray);
    }
    for (const override of [
      { setCode: 'lea' },
      { setCode: 'arn' },
      { setCode: '3ed' },
      { setCode: 'drk' },
      { setCode: 'ice' },
      { setCode: 'm21' },
      { frameStyle: 'modern' },
      { frameTemplate: 'future' },
      { frameAssetFamily: 'eighth' },
      { layout: 'split' },
      { borderColor: setCode === 'fem' ? 'white' : 'black' },
      { typeLine: 'Enchantment — Saga' },
    ])
      assert.equal(paintEarlyReprintFooter(untouched, { ...face, ...override }), false);
  }
  for (const name of ['Ebon Stronghold', 'Havenwood Battleground']) {
    const p = earlyReprintFooter({ name, setCode: 'fem', typeLine: 'Land' });
    assert.equal(p.legalGray, name === 'Ebon Stronghold' ? p.legal.lightGray : p.legal.darkGray);
  }
  const { resolvePrintingWording, resolvePrintingArtist } = await server.ssrLoadModule(
    '/games/magic/src/index.ts',
  );
  const { artistCredits } = await server.ssrLoadModule(
    '/games/magic/src/printing/artist-credits.ts',
  );
  const { printingCorrections } = await server.ssrLoadModule(
    '/games/magic/src/printing/corrections.ts',
  );
  async function prior(file, key) {
    const bytes = await preEarlyReprintFooterSource('games/magic/src/printing/' + file);
    const { code } = await transform(bytes.toString(), { loader: 'ts', format: 'esm' });
    return (await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64')))[
      key
    ];
  }
  const oldArtists = await prior('artist-credits.ts', 'artistCredits');
  const oldWords = await prior('corrections.ts', 'printingCorrections');
  for (const [id, r] of Object.entries(oldArtists)) assert.deepEqual(artistCredits[id], r);
  assert.equal(Object.keys(artistCredits).length, Object.keys(oldArtists).length + 61);
  const annotations = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/early-reprints/annotations-footer.json'),
  );
  for (const [id, r] of Object.entries(annotations.cards))
    if (r.reviewedFields.includes('artist')) {
      assert.equal(
        resolvePrintingArtist(id, 'Provider', { referenceSha256: r.referenceHash }).artist,
        r.artist,
      );
      assert.equal(
        resolvePrintingArtist(id, 'Provider', { referenceSha256: '0'.repeat(64) }).artist,
        'Provider',
      );
    }
  const sentinel = 'ffd4921f-cda5-4318-837d-a3fe4f0d9362';
  for (const [id, r] of Object.entries(oldWords))
    if (id !== sentinel) assert.deepEqual(printingCorrections[id], r);
  assert.deepEqual(Object.keys(printingCorrections), Object.keys(oldWords));
  const supplied = {
    oracle: {
      name: 'Sentinel',
      typeLine: 'Artifact Creature — Shapeshifter',
      rulesText: 'Oracle rules.',
      power: '1',
      toughness: '1',
    },
    original: {
      name: 'Sentinel',
      typeLine: 'Artifact Creature',
      rulesText: 'Original rules.',
      power: '1',
      toughness: '1',
    },
  };
  const copy = structuredClone(supplied),
    resolved = resolvePrintingWording(sentinel, supplied);
  assert.equal(resolved.wordings.original.power, '1');
  assert.equal(resolved.wordings.original.toughness, '*');
  assert.equal(resolved.wordings.oracle.toughness, '1');
  assert.equal(
    resolvePrintingWording(sentinel, supplied, { referenceSha256: '0'.repeat(64) }).wordings
      .original.toughness,
    '1',
  );
  assert.deepEqual(supplied, copy);
  const byField = (groups) =>
    Object.fromEntries(
      groups.flatMap(({ fields, ...provenance }) =>
        Object.entries(fields).map(([k, value]) => [k, { value, ...provenance }]),
      ),
    );
  for (const [field, value] of Object.entries(byField(oldWords[sentinel])))
    if (field !== 'toughness')
      assert.deepEqual(byField(printingCorrections[sentinel])[field], value);

  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route('**/__footer_test', (r) =>
    r.fulfill({ body: '<!doctype html><title>Footer controls</title>', contentType: 'text/html' }),
  );
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__footer_test`);
  const result = await page.evaluate(async () => {
    const { earlyReprintFooter, paintEarlyReprintFooter } = await import(
      '/games/magic/src/presentation/early-reprint-footer.ts'
    );
    document.fonts.add(
      await new FontFace(
        'CardRenderer MTG MPlantin',
        'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")',
      ).load(),
    );
    const make = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 732;
      canvas.height = 1020;
      return canvas;
    };
    const results = [];
    for (const setCode of ['fem', '4ed', 'chr']) {
      const face = {
        name: 'Footer probe',
        setCode,
        colors: ['G'],
        typeLine: 'Summon Creature',
        artist: 'Brian Snōddy',
        power: '88',
        toughness: '88',
      };
      const profile = earlyReprintFooter(face),
        canvas = make(),
        mask = make();
      try {
        const c = canvas.getContext('2d'),
          m = mask.getContext('2d');
        const render = (f) => {
          c.resetTransform();
          c.clearRect(0, 0, 732, 1020);
          c.scale(1.5, 1.5);
          c.font = '13px sans-serif';
          c.textAlign = 'center';
          c.textBaseline = 'middle';
          c.fillStyle = '#123456';
          c.shadowColor = '#aabbcc';
          const keys = ['font', 'textAlign', 'textBaseline', 'fillStyle', 'shadowColor'];
          const before = keys.map((k) => c[k]);
          paintEarlyReprintFooter(c, f);
          if (
            JSON.stringify(before) !== JSON.stringify(keys.map((k) => c[k])) ||
            c.getTransform().a !== 1.5 ||
            c.getTransform().e !== 0
          )
            throw Error('Footer leaked canvas state');
          return c.getImageData(0, 0, 732, 1020).data;
        };
        const onlyStats = { ...face, artist: null, legalText: null };
        const data = render(onlyStats),
          p = profile.stats;
        m.scale(1.5, 1.5);
        m.translate(p.x, p.y);
        m.scale(p.width, 1);
        m.font = `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
        m.textAlign = 'right';
        m.textBaseline = 'alphabetic';
        m.fillStyle = 'white';
        m.fillText('88/88', 0, 0, 132 / p.width);
        const filled = m.getImageData(0, 0, 732, 1020).data,
          cores = [];
        for (let y = 1; y < 1019; y++)
          for (let x = 1; x < 731; x++) {
            let core = true;
            for (let dy = -1; dy <= 1; dy++)
              for (let dx = -1; dx <= 1; dx++)
                if (filled[((y + dy) * 732 + x + dx) * 4 + 3] < 250) core = false;
            if (core) cores.push(data[(y * 732 + x) * 4]);
          }
        if (cores.length < 20 || cores.filter((v) => v >= p.gray - 15).length / cores.length < 0.9)
          throw Error('Stats strokes are not filled');
        for (const omitInk of [false, true]) {
          const tinted = render({
            ...onlyStats,
            textInk: { stats: [{ start: 0, color: '#11ccaa' }], omitInk },
          });
          let visible = 0,
            color = 0;
          for (let i = 0; i < tinted.length; i += 4) {
            visible += tinted[i + 3] > 0;
            color +=
              tinted[i + 3] > 0 && tinted[i + 1] > tinted[i] * 2 && tinted[i + 2] > tinted[i] * 2;
          }
          if (omitInk ? visible !== 0 : !visible || !color) throw Error('Stats host ink lost');
        }
        const blank = render({
          ...face,
          power: null,
          printingElements: { artist: { hidden: true }, legal: { hidden: true } },
        });
        if (blank.some((v, i) => i % 4 === 3 && v)) throw Error('Hidden footer still visible');
        for (const role of ['artist', 'legal']) {
          const f = {
            ...face,
            power: null,
            ...(role === 'artist' ? { legalText: null } : { artist: null }),
          };
          const a = render(f),
            b = render({ ...f, printingElements: { [role]: { offset: [4, -2] } } });
          let visible = 0;
          for (let y = 3; y < 1020; y++)
            for (let x = 0; x < 726; x++)
              for (let k = 0; k < 4; k++) {
                if (a[(y * 732 + x) * 4 + k] !== b[((y - 3) * 732 + x + 6) * 4 + k])
                  throw Error(role + ' translation lost');
                if (k === 3 && a[(y * 732 + x) * 4 + k]) visible++;
              }
          if (!visible) throw Error(role + ' missing');
        }
        results.push({ set: setCode, corePixels: cores.length });
      } finally {
        canvas.width = canvas.height = mask.width = mask.height = 0;
      }
    }
    return results;
  });
  console.log(
    'Early reprint footers: scoped solid ink, host controls, 61 credits and original Sentinel stats; prior catalogs preserved.',
    result,
  );
} finally {
  await browser?.close();
  await server.close();
}
