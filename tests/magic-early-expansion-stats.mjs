import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
import { chromium } from 'playwright';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { preDarkTypographySource } from './magic-dark-type-source-guard.mjs';
import { statsCalibrationProof } from './magic-stats-source-guard.mjs';

const evidence = JSON.parse(
  await readFile('games/magic/fixtures/accuracy/early-expansion-stats.json'),
);
await statsCalibrationProof();
assert.equal(evidence.validationKind, 'repeated');
assert.equal(evidence.trainingIds.length, 47);
assert.equal(new Set(evidence.trainingIds).size, 47);
assert.equal(evidence.rows.length, 141);
for (const id of evidence.trainingIds)
  assert.equal(evidence.rows.find((row) => row.id === id)?.cohort, 'calibration');
for (const [file, expected] of Object.entries(evidence.sourceGuards))
  assert.equal(
    hash(await preDarkTypographySource(file)),
    expected,
    'Stale stats evidence: ' + file,
  );
for (const set of ['arn', 'atq', 'drk']) {
  const group = evidence.summary[set + '/validation'];
  for (const metric of ['edge', 'contrast', 'filledArea', 'objective'])
    assert.ok(group.after[metric] > group.before[metric], `${set}: ${metric}`);
  assert.ok(group.after.strokeWidthError < group.before.strokeWidthError);
}
const regression = evidence.rows.find((row) => row.id === 'a131605a-f646-4745-a1e4-48d155a3d94f');
assert.ok(regression.after.contrast < regression.before.contrast, 'Retain Grave Robbers review');
const server = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { host: '127.0.0.1', port: 0, hmr: false },
  plugins: [
    {
      name: 'stats-test',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url === '/__stats_test') {
            res.setHeader('Content-Type', 'text/html');
            res.end('<!doctype html><title>Stats ink controls</title>');
          } else next();
        });
      },
    },
  ],
});
let browser;
try {
  const { earlyExpansionStats } = await server.ssrLoadModule(
    '/games/magic/src/presentation/early-expansion-stats.ts',
  );
  const face = {
    name: 'Specimen',
    typeLine: 'Summon Wizard',
    colors: ['U'],
    frameStyle: 'retro',
    power: '2',
    toughness: '3',
  };
  for (const setCode of ['arn', 'atq', 'drk']) {
    const profile = earlyExpansionStats({ ...face, setCode });
    for (const [key, value] of Object.entries(profile))
      assert.equal(value, evidence.profiles[setCode][key]);
    for (const change of [
      { frameStyle: 'modern' },
      { layout: 'split' },
      { frameTemplate: 'future' },
      { borderColor: 'white' },
      { legendary: true },
      { colors: setCode === 'drk' ? ['U', 'R', 'G'] : ['U', 'R'] },
      { typeLine: 'Planeswalker' },
      { power: null },
      { toughness: null },
    ])
      assert.equal(earlyExpansionStats({ ...face, setCode, ...change }), undefined);
    assert.ok(earlyExpansionStats({ ...face, setCode, typeLine: 'Artifact Creature', colors: [] }));
  }
  for (const setCode of ['lea', 'leb', '2ed', '3ed', 'leg', '4ed', '8ed', 'm21'])
    assert.equal(earlyExpansionStats({ ...face, setCode }), undefined);
  await server.listen();
  browser = await chromium.launch();
  const page = await browser.newPage();
  const faults = [];
  page.on('pageerror', (e) => faults.push(String(e)));
  await page.route('https://**/*', (route) => {
    faults.push('Unexpected external asset');
    return route.abort();
  });
  await page.goto(`http://127.0.0.1:${server.httpServer.address().port}/__stats_test`);
  await page.evaluate(async (face) => {
    const { paintEarlyExpansionStats } = await import(
      '/games/magic/src/presentation/early-expansion-stats.ts'
    );
    const canvas = document.createElement('canvas');
    canvas.width = 488;
    canvas.height = 680;
    const c = canvas.getContext('2d');
    const draw = (textInk) => {
      c.clearRect(0, 0, 488, 680);
      paintEarlyExpansionStats(c, { ...face, setCode: 'arn', textInk });
      return c.getImageData(0, 0, 488, 680).data;
    };
    const plain = draw(undefined),
      empty = draw({ stats: [] });
    if (!plain.every((v, i) => v === empty[i])) throw Error('Empty spans changed calibrated stats');
    const omitted = draw({ omitInk: true, stats: [{ start: 0, color: '#f00' }] });
    if (omitted.some((v) => v)) throw Error('Omitted stats left ink or shadow');
    const red = draw({ stats: [{ start: 0, end: 1, color: '#f00' }] });
    if (
      !red.some(
        (v, i) =>
          i % 4 === 0 && v > 150 && red[i + 1] === 0 && red[i + 2] === 0 && red[i + 3] > 100,
      )
    )
      throw Error('Stats ink override missing');
    // The selected power is on the left. The right-hand toughness remains exact.
    for (let y = 600; y < 656; y++)
      for (let x = 440; x < 475; x++) {
        const i = (y * 488 + x) * 4;
        if (![0, 1, 2, 3].every((ch) => plain[i + ch] === red[i + ch]))
          throw Error('Stats override changed toughness');
      }
    c.font = '27px Georgia';
    if (c.measureText('–').actualBoundingBoxRight <= 0) throw Error('Printed minus has no ink');
    canvas.width = canvas.height = 0;
  }, face);
  assert.deepEqual(faults, []);
  console.log(
    'Early stats: shared scope, 141 native candidates, 316 isolated cards, 84 controls and host ink spans pass.',
  );
} finally {
  await browser?.close();
  await server.close();
}
