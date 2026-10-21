import assert from 'node:assert/strict';
import { createServer as createHttpServer } from 'node:http';
import { chromium } from 'playwright';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
  plugins: [
    {
      name: 'profile-rules-request-fixture',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('/calibration/profiles.ts')) return;
        const needle =
          'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
        assert.equal(code.split(needle).length, 2);
        return code.replace(
          needle,
          "return set === '2ed' ? (globalThis as any).__requestProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;",
        );
      },
    },
  ],
});
let browser, http;
try {
  const { profile: base } = await server.ssrLoadModule('/games/magic/src/calibration/sets/4ed.ts');
  const profile = {
    ...structuredClone(base),
    set: '2ed',
    textTiers: {
      mediumSize: 22.5,
      denseWidth: 1,
      transferAlphaModel: true,
      centeredDx: -6.5,
      regularWidthDelta: 8,
      regularDx: -2,
      retainRegularAboveLines: 7,
    },
  };
  http = createHttpServer((req, res) => {
    if (req.url === '/__profile-requests') {
      res.setHeader('Content-Type', 'text/html');
      res.end('<!doctype html><title>Profile layout requests</title>');
    } else server.middlewares(req, res, () => res.writeHead(404).end());
  });
  await new Promise((resolve) => http.listen(0, '127.0.0.1', resolve));
  browser = await chromium.launch({ headless: true, args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.route('https://**/*', (route) => route.abort());
  await page.goto(`http://127.0.0.1:${http.address().port}/__profile-requests`);
  const result = await page.evaluate(async (profile) => {
    globalThis.__requestProfile = profile;
    await import('/games/magic/src/data/eager.ts');
    const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
    const { createSetCalibrationCandidate } = await import(
      '/games/magic/src/calibration/editor.ts'
    );
    const { layoutRules, rulesLayoutRequest, withRulesLayoutRequests } = await import(
      '/games/magic/src/presentation/rules-layout.ts'
    );
    const ctx = document.createElement('canvas').getContext('2d');
    const check = (value, message) => {
      if (!value) throw Error(message);
    };
    const text = (layout) =>
      layout.lines
        .flatMap((l) => l.runs.map((r) => r.text))
        .join('')
        .replace(/\s/g, '');
    const cases = [
      { wordingMode: 'original', rulesText: 'Destroy all creatures.' },
      {
        wordingMode: 'original',
        rulesAlignment: { mode: 'left' },
        rulesParagraphs: [
          {
            role: 'rules',
            runs: [
              {
                text: 'Flying. This creature watches the distant mountains and protects the creatures below.',
              },
            ],
          },
          {
            role: 'flavor',
            runs: [{ text: 'The wind carries every remembered promise.', italic: true }],
          },
        ],
      },
      {
        wordingMode: 'original',
        rulesAlignment: { mode: 'left' },
        rulesText: 'A creature protects the mountains and remembers every fallen friend. '.repeat(
          5,
        ),
      },
      {
        wordingMode: 'oracle',
        rulesAlignment: { mode: 'left' },
        rulesText:
          'When this creature enters, draw a card and return a creature you control to its owner’s hand. '.repeat(
            4,
          ),
      },
    ];
    let casesChecked = 0,
      scaled = 0;
    for (const values of cases) {
      const face = {
        name: 'Request fixture',
        setCode: '2ed',
        typeLine: 'Sorcery',
        colors: ['W'],
        borderColor: 'white',
        ...values,
      };
      const base = retroTextLayout(ctx, face);
      check(base && base.lines.length, 'Empty fixture');
      check(rulesLayoutRequest(base), 'Selected tier lost its request');
      if (base.horizontalScale !== undefined) scaled++;
      const zero = createSetCalibrationCandidate('2ed', 1, {});
      const unchanged = retroTextLayout(ctx, { ...face, setCalibrationCandidate: zero });
      check(
        JSON.stringify(unchanged) === JSON.stringify(base),
        'Empty proposal changes selected layout',
      );
      const proposal = createSetCalibrationCandidate('2ed', 1, {
        'rulesAdjustments.default.vertical': 0.5,
      });
      const moved = retroTextLayout(ctx, { ...face, setCalibrationCandidate: proposal });
      check(moved.size === base.size, 'Vertical adjustment changes font size');
      check(moved.lines.length === base.lines.length, 'Vertical adjustment adds a line');
      check(text(moved) === text(base), 'Vertical adjustment changes words');
      check(
        moved.horizontalScale === base.horizontalScale,
        'Vertical adjustment loses the global horizontal scale',
      );
      for (let i = 0; i < base.lines.length; i++) {
        check(
          Math.abs(moved.lines[i].baseline - base.lines[i].baseline - 0.5) < 1e-8,
          'Vertical adjustment jumps instead of moving half a pixel',
        );
        check(
          Math.abs(moved.lines[i].inkBounds[0] - base.lines[i].inkBounds[0]) < 1e-8,
          'Vertical adjustment moves text horizontally',
        );
      }
      if (values.rulesAlignment?.mode === 'left') {
        const candidate = createSetCalibrationCandidate('2ed', 1, {
          'rulesAdjustments.default.leftMargin': 1,
        });
        const inset = retroTextLayout(ctx, { ...face, setCalibrationCandidate: candidate });
        check(text(inset) === text(base), 'Inset loses words');
        check(
          Math.abs(
            inset.lines[0].inkBounds[0] * (inset.horizontalScale ?? 1) -
              base.lines[0].inkBounds[0] * (base.horizontalScale ?? 1) -
              1,
          ) < 1e-8,
          'Margin is not in physical card pixels',
        );
      }
      casesChecked++;
    }
    const paragraphs = [{ role: 'rules', runs: [{ text: 'Draw a card.' }] }];
    const make = () =>
      layoutRules(ctx, paragraphs, { x: 70, y: 420, width: 340, height: 180 }, 22, 15);
    try {
      withRulesLayoutRequests(ctx, () => {
        throw Error('deliberate fixture failure');
      });
    } catch (error) {
      check(error.message === 'deliberate fixture failure', 'Unexpected failure');
    }
    const untracked = make();
    check(!rulesLayoutRequest({ ...untracked }), 'Exception leaked copy tracking');
    const tracked = withRulesLayoutRequests(ctx, () => ({ ...withRulesLayoutRequests(ctx, make) }));
    check(rulesLayoutRequest(tracked), 'Nested tracking lost request');
    check(!rulesLayoutRequest({ ...make() }), 'Nested tracking leaked');
    delete globalThis.__requestProfile;
    return {
      casesChecked,
      scaled,
      vertical: '.5 physical px',
      exceptionCleanup: true,
      nesting: true,
    };
  }, profile);
  assert.equal(result.casesChecked, 4);
  assert(result.scaled > 0);
  console.log(
    'Selected early typography retains exact reflow inputs; edits preserve words, scale and flavor spacing:',
    result,
  );
} finally {
  await browser?.close();
  if (http) await new Promise((resolve) => http.close(resolve));
  await server.close();
}
