import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
import { darkTypeLineProof } from './magic-dark-type-line-source-guard.mjs';

const evidence = await darkTypeLineProof();
assert.equal(evidence.fullScores.repeatedValidation.improved, 88);
assert.equal(evidence.fullScores.all.improved, 120);
assert.equal(evidence.fullScores.printingShiftDiagnostic.regressions.length, 1);
assert.equal(evidence.fineShapeRegressions.length, 1);
assert.equal(evidence.fineShapeRegressions[0].name, 'Wormwood Treefolk');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => route.abort());
  await page.goto(server.resolvedUrls.local[0]);
  const result = await page.evaluate(async (expected) => {
    const { earlyExpansionType, paintEarlyExpansionType } = await import(
      '/games/magic/src/presentation/retro-type.ts'
    );
    let scope = 0;
    for (const colors of [['W'], ['U'], ['B'], ['R'], ['G'], [], ['B', 'R']]) {
      const face = {
        name: 'Type scope',
        setCode: 'drk',
        colors,
        typeLine: colors.length ? 'Summon Example' : 'Artifact',
      };
      for (const wordingMode of ['original', 'oracle']) {
        const actual = earlyExpansionType({ ...face, setCode: 'DRK', wordingMode });
        if (JSON.stringify(actual) !== JSON.stringify(expected)) throw Error('Wrong type profile');
        scope++;
      }
      for (const change of [
        { setCode: 'lea' },
        { setCode: 'arn' },
        { setCode: 'atq' },
        { setCode: 'm21' },
        { frameTemplate: 'future' },
        { frameAssetFamily: 'seventh' },
        { frameStyle: 'modern' },
        { borderColor: 'white' },
        { layout: 'split' },
        { legendary: true },
        { typeLine: 'Enchantment — Saga' },
      ]) {
        if (earlyExpansionType({ ...face, ...change })) throw Error('Profile escaped scope');
        scope++;
      }
    }
    const face = { name: 'Ink probe', setCode: 'drk', colors: ['U'], typeLine: 'Summon Example' };
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 120;
    const c = canvas.getContext('2d');
    c.scale(1.5, 1.5);
    c.textBaseline = 'middle';
    c.textAlign = 'left';
    c.fillStyle = '#aa5544';
    c.shadowColor = '#774422';
    c.shadowBlur = 2;
    c.shadowOffsetX = 4;
    c.shadowOffsetY = 3;
    c.font = '19px Georgia';
    const state = () =>
      JSON.stringify([
        c.fillStyle,
        c.shadowColor,
        c.shadowBlur,
        c.shadowOffsetX,
        c.shadowOffsetY,
        c.font,
        c.textBaseline,
        c.textAlign,
        ...c.getTransform().toFloat64Array(),
      ]);
    const snapshot = state();
    function draw(textInk) {
      c.clearRect(0, 0, 400, 80);
      if (!paintEarlyExpansionType(c, { ...face, textInk }, face.typeLine, 20, 32, 340))
        throw Error('Missing supported type');
      if (state() !== snapshot) throw Error('Type painter leaked Canvas state');
      return c.getImageData(0, 0, 600, 120).data;
    }
    const plain = draw(),
      colored = draw({ typeLine: [{ start: 0, color: '#11ccaa' }] });
    const omitted = draw({ typeLine: [{ start: 0, color: '#11ccaa' }], omitInk: true });
    let visible = 0,
      tinted = 0,
      hidden = 0;
    for (let i = 0; i < plain.length; i += 4) {
      visible += plain[i + 3] > 0;
      tinted +=
        colored[i + 3] > 0 && colored[i + 1] > colored[i] * 2 && colored[i + 2] > colored[i] * 2;
      hidden += omitted[i + 3] > 0;
    }
    if (!visible || !tinted || hidden) throw Error('Host type ink/omission was lost');
    canvas.width = canvas.height = 0;
    return { scope, visible, tinted, hidden };
  }, evidence.profile);
  assert.equal(result.scope, 91);
  assert.equal(result.hidden, 0);
  console.log(
    'Dark type lines: 122 native prototypes, 194 early-set and 84 cross-set controls; host ink and Canvas state pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
