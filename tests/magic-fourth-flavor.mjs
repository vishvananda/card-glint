import assert from 'node:assert/strict';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  const { calibratedBodyClasses, isPureFlavorPair } = await server.ssrLoadModule(
    '/games/magic/src/calibration/body.ts',
  );
  const { layoutRules, rulesLayoutRequest, withRulesLayoutRequests } = await server.ssrLoadModule(
    '/games/magic/src/presentation/rules-layout.ts',
  );
  const { profile } = await server.ssrLoadModule('/games/magic/src/calibration/sets/4ed.ts');
  const { fractionalFlavorRevision } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-rules.ts',
  );
  const { cardTextureKey } = await server.ssrLoadModule(
    '/games/magic/src/presentation/canvas-face.ts',
  );
  const paragraphs = [
    {
      role: 'flavor',
      runs: [
        {
          text: 'A measured passage keeps its words, inset, line rhythm and physical type range.',
          italic: true,
        },
      ],
    },
  ];
  const face = {
    name: 'Flavor probe',
    setCode: '4ed',
    typeLine: 'Summon Wizard',
    colors: ['U'],
    frameStyle: 'retro',
    wordingMode: 'original',
    rulesParagraphs: paragraphs,
  };
  assert(isPureFlavorPair(paragraphs, paragraphs));
  assert(!isPureFlavorPair([], paragraphs));
  assert(!isPureFlavorPair(paragraphs, [{ role: 'rules', runs: paragraphs[0].runs }]));
  const stack = [],
    ctx = {
      font: '22.5px serif',
      fontKerning: 'auto',
      textRendering: 'auto',
      letterSpacing: '0px',
      save() {
        stack.push({
          font: this.font,
          fontKerning: this.fontKerning,
          textRendering: this.textRendering,
          letterSpacing: this.letterSpacing,
          textAlign: this.textAlign,
          textBaseline: this.textBaseline,
        });
      },
      restore() {
        Object.assign(this, stack.pop());
      },
      measureText(text) {
        const size = Number(this.font.match(/([\d.]+)px/)[1]),
          width = text.length * size * 0.47 + 0.13;
        return {
          width,
          actualBoundingBoxLeft: 0,
          actualBoundingBoxRight: width,
          actualBoundingBoxAscent: size * 0.71,
          actualBoundingBoxDescent: size * 0.16,
        };
      },
    };
  const bounds = { x: 72, y: 412.556, width: 344, height: 177.232 };
  const typography = {
    leading: 1,
    paragraphGap: 0.25,
    flavorGap: 0.8,
    flavorOrphans: false,
    flavorSeparator: false,
  };
  const originalInput = JSON.stringify(face);
  const pair = withRulesLayoutRequests(ctx, () => {
    const base = layoutRules(ctx, paragraphs, bounds, 22.5, 15, typography);
    const fit = calibratedBodyClasses(
      ctx,
      face,
      profile.bodyClasses,
      base,
      base,
      paragraphs,
      paragraphs,
    );
    const request = rulesLayoutRequest(fit);
    assert.equal(request.typography.fractionalMetrics, true);
    assert.deepEqual(request.bounds, bounds);
    assert.equal(request.maximumSize, 22.5);
    assert.equal(request.minimumSize, 15);
    for (const key of ['leading', 'paragraphGap', 'flavorGap', 'flavorOrphans', 'flavorSeparator'])
      assert.equal(request.typography[key], typography[key]);
    const words = (l) =>
      l.lines
        .flatMap((line) => line.runs.map((run) => run.text))
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
    assert.equal(words(fit), words(base));
    assert.equal(fit.overflow, false);
    assert.equal(
      calibratedBodyClasses(
        ctx,
        face,
        {
          ...profile.bodyClasses,
          typography: { ...profile.bodyClasses.typography, fractionalMetrics: false },
        },
        base,
        base,
        paragraphs,
        paragraphs,
      ),
      base,
    );
    assert.equal(
      calibratedBodyClasses(
        ctx,
        face,
        profile.bodyClasses,
        base,
        { ...base, size: profile.bodyClasses.centered.size },
        paragraphs,
        paragraphs,
      ),
      base,
    );
    for (const choice of [false, true]) {
      const explicit = layoutRules(ctx, paragraphs, bounds, 22.5, 15, {
        ...typography,
        fractionalMetrics: choice,
      });
      assert.equal(
        calibratedBodyClasses(
          ctx,
          face,
          profile.bodyClasses,
          explicit,
          explicit,
          paragraphs,
          paragraphs,
        ),
        explicit,
        'Explicit material choice remains authoritative',
      );
    }
    return [base, fit];
  });
  assert.equal(JSON.stringify(face), originalInput);
  assert.equal(fractionalFlavorRevision(face), 'fractional-pure-flavor-v1');
  assert.equal(fractionalFlavorRevision({ ...face, setCode: 'ice' }), 'fractional-pure-flavor-v1');
  for (const extra of [
    { setCode: 'lea' },
    { setCode: 'leb' },
    { setCode: '2ed' },
    { setCode: '3ed' },
    { setCode: 'mir' },
    { setCode: 'm21' },
    { frameStyle: 'modern' },
    { frameTemplate: 'future' },
    { frameAssetFamily: 'fourth' },
    { rulesParagraphs: [] },
    { rulesParagraphs: [{ role: 'rules', runs: paragraphs[0].runs }] },
    { rulesAlignment: { mode: 'auto', reference: [{ role: 'rules', runs: paragraphs[0].runs }] } },
    { setCode: 'ice', calibration: 'printing' },
  ])
    assert.equal(fractionalFlavorRevision({ ...face, ...extra }), undefined);
  const input = { face, printingId: 'probe', printedImage: null };
  for (const tier of ['table', 'native', 'inspect', 323]) {
    assert(JSON.parse(cardTextureKey(input, tier)).includes('fractional-pure-flavor-v1'));
    for (const extra of [
      { printedImage: 'https://example.test/scan.png' },
      { layer: 'etching' },
      { paintLayer: 'artwork' },
    ])
      assert(
        !JSON.parse(cardTextureKey({ ...input, ...extra }, tier)).includes(
          'fractional-pure-flavor-v1',
        ),
      );
  }
  console.log(
    'Pure-flavor classes preserve words,bounds,alignment,type range and spacing; centered/explicit policies and mixed references remain authoritative; cache revision is scoped to rebuilt supported flavor faces.',
  );
} finally {
  await server.close();
}
