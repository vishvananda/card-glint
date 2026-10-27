import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { earlyReprintTypeProof } from './magic-early-reprint-type-source-guard.mjs';

const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
let browser;
try {
  const { setCalibrationProfile } = await server.ssrLoadModule(
    '/games/magic/src/calibration/profiles.ts',
  );
  await earlyReprintTypeProof();
  const evidence = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/early-reprint-type.json'),
  );
  const { earlyReprintType, paintEarlyReprintType } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-type.ts',
  );
  const untouched = new Proxy({}, { get: () => assert.fail('Unrelated type touched canvas') });
  for (const setCode of ['fem', '4ed', 'chr']) {
    for (const material of [
      'W',
      'U',
      'B',
      'R',
      'G',
      'A',
      'L',
      ...(setCode === 'chr' ? ['M'] : []),
    ]) {
      const face = {
        name: 'Type probe',
        setCode,
        colors: material === 'M' ? ['U', 'B', 'R'] : /^[WUBRG]$/.test(material) ? [material] : [],
        typeLine: material === 'A' ? 'Artifact' : material === 'L' ? 'Land' : 'Summon Legend',
      };
      const p = earlyReprintType(face);
      assert.ok(p);
      assert.deepEqual(p, setCalibrationProfile(setCode).type);
      if (setCalibrationProfile(setCode).revision === 1)
        assert.deepEqual(p, evidence.profiles[setCode]);
      assert.deepEqual(earlyReprintType({ ...face, setCode: setCode.toUpperCase() }), p);
      assert.deepEqual(
        earlyReprintType({
          ...face,
          wordingMode: 'oracle',
          typeLine:
            material === 'A' ? 'Artifact' : material === 'L' ? 'Land' : 'Legendary Creature',
        }),
        p,
      );
      assert.deepEqual(earlyReprintType({ ...face, calibration: 'source' }), p);
      for (const override of [
        { setCode: 'lea' },
        { setCode: '3ed' },
        { setCode: 'drk' },
        // Ice Age inherits Fourth by default; exact-printing mode still opts out.
        { setCode: 'ice', calibration: 'printing' },
        { setCode: 'm21' },
        { frameStyle: 'modern' },
        { frameTemplate: 'future' },
        { frameAssetFamily: 'eighth' },
        { layout: 'split' },
        { borderColor: setCode === 'fem' ? 'white' : 'black' },
        { typeLine: 'Enchantment — Saga' },
      ])
        assert.equal(
          paintEarlyReprintType(untouched, { ...face, ...override }, face.typeLine, 450),
          false,
        );
    }
  }
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage();
  await page.route('**/__title_test', (route) =>
    route.fulfill({
      body: '<!doctype html><title>Filled type checks</title>',
      contentType: 'text/html',
    }),
  );
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__title_test`);
  const results = await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { earlyReprintType, paintEarlyReprintType } = await import(
      '/games/magic/src/presentation/early-reprint-type.ts'
    );
    document.fonts.add(
      await new FontFace(
        'CardRenderer MTG MPlantin',
        'local("Times New Roman"), local("Liberation Serif"), local("DejaVu Serif")',
      ).load(),
    );
    const results = [];
    for (const setCode of ['fem', '4ed', 'chr']) {
      const face = { name: 'Type probe', setCode, colors: ['R'], typeLine: 'MAMMOTH MIRROR' };
      const p = earlyReprintType(face);
      const make = () => {
        const c = document.createElement('canvas');
        c.width = 732;
        c.height = 1020;
        return c;
      };
      const output = make(),
        mask = make();
      try {
        const c = output.getContext('2d'),
          m = mask.getContext('2d');
        c.fillStyle = '#000';
        c.fillRect(0, 0, 732, 1020);
        c.scale(1.5, 1.5);
        c.textBaseline = 'middle';
        c.textAlign = 'left';
        c.letterSpacing = '0px';
        c.font = '10px sans-serif';
        c.fillStyle = '#123456';
        const before = [c.font, c.fillStyle, c.getTransform().a, c.getTransform().e];
        paintEarlyReprintType(c, face, face.typeLine, 450);
        if (
          JSON.stringify(before) !==
          JSON.stringify([c.font, c.fillStyle, c.getTransform().a, c.getTransform().e])
        )
          throw Error('Type leaked Canvas state');
        m.scale(1.5, 1.5);
        m.translate(p.x, p.y);
        m.scale(p.width, 1);
        m.font = `${p.size}px "CardRenderer MTG MPlantin", Georgia`;
        m.textBaseline = 'middle';
        m.textAlign = 'left';
        m.letterSpacing = '0px';
        m.fillStyle = '#fff';
        m.fillText(face.typeLine, 0, 0, (450 - p.x) / p.width);
        const actual = c.getImageData(0, 0, 732, 1020).data;
        const filled = m.getImageData(0, 0, 732, 1020).data;
        const cores = [];
        // Sample only the interior of an independent filled glyph. An outline
        // can score well on edges but must fail this surviving-stroke check.
        for (let y = 1; y < 1019; y++)
          for (let x = 1; x < 731; x++) {
            let core = true;
            for (let dy = -1; dy <= 1; dy++)
              for (let dx = -1; dx <= 1; dx++)
                if (filled[((y + dy) * 732 + x + dx) * 4 + 3] < 250) core = false;
            if (core) cores.push(actual[(y * 732 + x) * 4]);
          }
        results.push({
          set: setCode,
          cores: cores.length,
          target: p.gray,
          filledFraction: cores.filter((v) => v >= p.gray - 15).length / cores.length,
        });
        c.resetTransform();
        c.clearRect(0, 0, 732, 1020);
        c.scale(1.5, 1.5);
        paintEarlyReprintType(c, face, face.typeLine, 120);
        const narrow = c.getImageData(0, 0, 732, 1020).data;
        for (let y = 0; y < 1020; y++)
          for (let x = (120 + 4) * 1.5; x < 732; x++)
            if (narrow[(y * 732 + x) * 4 + 3]) throw Error('Type crossed its symbol clearance');
        for (const omitInk of [false, true]) {
          c.resetTransform();
          c.clearRect(0, 0, 732, 1020);
          c.scale(1.5, 1.5);
          paintEarlyReprintType(
            c,
            {
              ...face,
              textInk: { typeLine: [{ start: 0, color: '#11ccaa' }], omitInk },
            },
            face.typeLine,
            450,
          );
          const ink = c.getImageData(0, 0, 732, 1020).data;
          let visible = 0,
            tinted = 0;
          for (let i = 0; i < ink.length; i += 4) {
            visible += ink[i + 3] > 0;
            tinted += ink[i + 3] > 0 && ink[i + 1] > ink[i] * 2 && ink[i + 2] > ink[i] * 2;
          }
          if (omitInk ? visible !== 0 : !visible || !tinted)
            throw Error('Host type ink/omission was lost');
        }
      } finally {
        output.width = output.height = mask.width = mask.height = 0;
      }
    }
    return results;
  });
  for (const row of results) {
    assert.ok(row.cores >= 20, JSON.stringify(row));
    assert.ok(row.filledFraction >= 0.9, JSON.stringify(row));
  }
  console.log(
    'Early-reprint types preserve filled cores, symbol clearance, Canvas state and printing scope.',
    results,
  );
} finally {
  await browser?.close();
  await server.close();
}
