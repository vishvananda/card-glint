import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createServer } from 'vite';
import { readFile } from 'node:fs/promises';
import { root, hash, sourceHash, writeJson } from './common.mjs';
import { cachedFetch } from './cache.mjs';
import { openBrowser } from './browser.mjs';

const [revision, output] = process.argv.slice(2);
if (!output || !/^[a-f0-9]{7,40}$/.test(revision))
  throw Error('Usage: abu-typography-controls.mjs BASELINE_COMMIT OUTPUT');
const existing = new Set(
  execFileSync('git', ['ls-tree', '-r', '--name-only', revision], { encoding: 'utf8' })
    .trim()
    .split('\n'),
);
const files = [
  'retro-paint',
  'retro-rules',
  'alpha-rules',
  'retro-type',
  'early-credits',
  'alpha-typography',
  'early-text-tiers',
  'calibration-profiles',
  'early-hsb-material',
  'mana-printing-profiles',
  'printing-color-profiles',
  'printing-mana-profiles',
  'profile',
  'retro-frame',
].filter((name) => existing.has(`games/magic/src/presentation/${name}.ts`));
const baseline = new Map(
  files.map((name) => [
    name,
    execFileSync('git', ['show', `${revision}:games/magic/src/presentation/${name}.ts`], {
      cwd: root,
      encoding: 'utf8',
    }),
  ]),
);
const prefix = path.join(root, 'games/magic/src/presentation/');
const plugins = [
  {
    name: 'pre-abu-typography',
    resolveId(id) {
      if (id.includes('__pre_abu_')) return path.join(prefix, id.split('/').at(-1));
    },
    load(id) {
      const name = path.basename(id).match(/^__pre_abu_(.+)\.ts$/)?.[1];
      if (!name || !baseline.has(name)) return;
      let source = baseline.get(name);
      for (const dep of files)
        source = source.replaceAll(`'./${dep}.js'`, `'./__pre_abu_${dep}.ts'`);
      return source;
    },
  },
];
const css = await readFile(path.join(root, 'games/magic/fonts.css'), 'utf8');
const ssr = await createServer({
  configFile: false,
  root,
  server: { middlewareMode: true, hmr: false },
});
let extra;
try {
  const font = await ssr.ssrLoadModule('/games/magic/src/presentation/retro-frame.ts');
  extra = [font.RETRO_FONT, font.RETRO_SYMBOL_FONT];
} finally {
  await ssr.close();
}
const components = [];
for (const url of new Set([...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]).concat(extra)))
  if (url.startsWith('https:')) components.push(await cachedFetch(url, { offline: true }));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const session = await openBrowser({ entries: [], components }, { plugins });
try {
  const rows = await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts');
    await Promise.all([loadCanvasFonts(), loadRetroFont()]);
    const before = (await import('/games/magic/src/presentation/__pre_abu_retro-paint.ts'))
      .paintRetroFace;
    const after = (await import('/games/magic/src/presentation/retro-paint.ts')).paintRetroFace;
    const digest = async (data) =>
      [...new Uint8Array(await crypto.subtle.digest('SHA-256', data))]
        .map((v) => v.toString(16).padStart(2, '0'))
        .join('');
    const draw = (painter, face) => {
      const canvas = document.createElement('canvas');
      canvas.width = 732;
      canvas.height = 1020;
      const c = canvas.getContext('2d', { willReadFrequently: true });
      c.scale(1.5, 1.5);
      painter(c, face, new Map());
      const data = c.getImageData(0, 0, canvas.width, canvas.height).data;
      canvas.width = canvas.height = 0;
      return data;
    };
    const currentColors = await import('/games/magic/src/presentation/calibration-profiles.ts');
    const previousColors = await import(
      '/games/magic/src/presentation/__pre_abu_calibration-profiles.ts'
    );
    const rows = [];
    for (const setCode of [
      '2ed',
      '3ed',
      '4ed',
      '7ed',
      '8ed',
      'm21',
      'arn',
      'atq',
      'drk',
      'leg',
      'plc',
    ])
      for (const material of ['W', 'U', 'B', 'R', 'G', 'A', 'L'])
        for (const wordingMode of ['original', 'oracle']) {
          const face = {
            name: 'Printing control',
            setCode,
            wordingMode,
            frameStyle: ['8ed', 'm21', 'plc'].includes(setCode) ? 'modern' : 'retro',
            ...(setCode === '8ed' ? { frameAssetFamily: 'eighth' } : {}),
            colorCalibration: 'set-hsb-v1',
            colors: ['A', 'L'].includes(material) ? [] : [material],
            typeLine:
              material === 'A'
                ? 'Mono Artifact'
                : material === 'L'
                  ? 'Land'
                  : wordingMode === 'original'
                    ? 'Summon Example'
                    : 'Creature — Example',
            artifact: material === 'A',
            land: material === 'L',
            creature: !['A', 'L'].includes(material),
            manaSymbols: ['A', 'L'].includes(material) ? [] : ['1', material],
            artist: 'Douglas Schuler',
            securityStamp: 'none',
            rulesText: 'Flying\nA printed passage for the neighboring-set control.',
            rulesParagraphs: [
              { role: 'rules', runs: [{ text: 'Flying' }] },
              {
                role: 'flavor',
                runs: [
                  { text: 'A printed passage for the neighboring-set control.', italic: true },
                ],
              },
            ],
            ...(!['A', 'L'].includes(material) ? { power: '2', toughness: '3' } : {}),
          };
          const colors = (module) =>
            Object.fromEntries(
              [
                'hasColorCalibration',
                'calibratedDualFrameProfile',
                'hasCalibratedFramePigment',
                'calibratedFrameMaterials',
                'calibratedPrintingStock',
              ].map((key) => [key, module[key](face)]),
            );
          const oldColors = colors(previousColors),
            newColors = colors(currentColors);
          if (JSON.stringify(oldColors) !== JSON.stringify(newColors))
            throw Error('Neighboring color material changed: ' + setCode + '/' + material);
          const a = draw(before, face),
            b = draw(after, face);
          let changed = 0;
          for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) changed++;
          if (changed)
            throw Error(`Neighboring printing changed: ${setCode}/${material}/${wordingMode}`);
          rows.push({
            set: setCode,
            material,
            wordingMode,
            before: await digest(a),
            after: await digest(b),
            changed,
            materials: newColors,
          });
        }
    return rows;
  });
  if (session.faults.length) throw Error(session.faults.join('\n'));
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  await writeJson(output, {
    schema: 1,
    baselineCommit: revision,
    rendererHash,
    browser: session.browser.version(),
    fontsHash: hash(css),
    scope:
      'Native cached-font old-border painter controls with placeholder illustration/frame backgrounds. Source-bound material/stock adjustments are also identical. Full external-image Alpha/Beta replay is separate; these controls certify scope, not the quality of neighboring sets.',
    cards: rows.length,
    changed: 0,
    rows,
  });
  console.log('unchanged neighboring controls', rows.length);
} finally {
  await session.close();
}
