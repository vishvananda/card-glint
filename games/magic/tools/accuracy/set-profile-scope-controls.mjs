import assert from 'node:assert/strict';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { readJson, writeJson, root, hash, sourceHash } from './common.mjs';

const [revision, inputFile, output] = process.argv.slice(2);
if (!output || !/^[a-f0-9]{7,40}$/.test(revision))
  throw Error('Usage: set-profile-scope-controls.mjs BASELINE_COMMIT CONTROL_INPUTS OUT');
const input = await readJson(inputFile);
assert.ok(input.entries.length >= 690);
assert.ok(input.entries.every((e) => e.face.setCode !== '2ed'));
const files = [
  'retro-paint',
  'early-reprint-frame',
  'early-reprint-colors',
  'early-reprint-footer',
];
const before = new Map(
  files.map((name) => [
    name,
    execFileSync('git', ['show', `${revision}:games/magic/src/presentation/${name}.ts`], {
      cwd: root,
      encoding: 'utf8',
    }),
  ]),
);
const prefix = path.join(root, 'games/magic/src/presentation/');
const components = [];
const css = await readFile(path.join(root, 'games/magic/fonts.css'), 'utf8'),
  manifest = await readJson(path.join(root, 'games/magic/assets.json'));
for (const url of new Set(
  [
    ...[...css.matchAll(/url\('([^']+)'\)/g)].map((m) => m[1]),
    manifest.RETRO_ROOT + '/fonts/goudy-medieval.ttf',
    manifest.RETRO_SYMBOL_FONT,
  ].filter((u) => u?.startsWith('https:')),
))
  components.push(await cachedFetch(url, { offline: true }));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const session = await openBrowser(
  { entries: [], components },
  {
    plugins: [
      {
        name: 'scoped-profile-controls',
        resolveId(id) {
          if (id.includes('__pre_scope_')) return path.join(prefix, path.basename(id));
        },
        load(id) {
          const name = path.basename(id).match(/^__pre_scope_(.+)\.ts$/)?.[1];
          if (!before.has(name)) return;
          let code = before.get(name);
          for (const dep of files)
            code = code.replaceAll(`'./${dep}.js'`, `'./__pre_scope_${dep}.ts'`);
          return code;
        },
      },
    ],
  },
);
try {
  const result = await session.page.evaluate(async (entries) => {
    await import('/games/magic/src/data/eager.ts');
    const current = {
        frame: await import('/games/magic/src/presentation/early-reprint-frame.ts'),
        colors: await import('/games/magic/src/presentation/early-reprint-colors.ts'),
        footer: await import('/games/magic/src/presentation/early-reprint-footer.ts'),
        painter: await import('/games/magic/src/presentation/retro-paint.ts'),
      },
      old = {
        frame: await import('/games/magic/src/presentation/__pre_scope_early-reprint-frame.ts'),
        colors: await import('/games/magic/src/presentation/__pre_scope_early-reprint-colors.ts'),
        footer: await import('/games/magic/src/presentation/__pre_scope_early-reprint-footer.ts'),
        painter: await import('/games/magic/src/presentation/__pre_scope_retro-paint.ts'),
      };
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    const { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts');
    await Promise.all([loadCanvasFonts(), loadRetroFont()]);
    const canonical = (v) =>
      Array.isArray(v)
        ? v.map(canonical)
        : v && typeof v === 'object'
          ? Object.fromEntries(
              Object.keys(v)
                .sort()
                .map((k) => [k, canonical(v[k])]),
            )
          : v;
    const digest = async (v) =>
      [
        ...new Uint8Array(
          await crypto.subtle.digest(
            'SHA-256',
            typeof v === 'string' ? new TextEncoder().encode(v) : v,
          ),
        ),
      ]
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('');
    const getters = (api, face) => {
      const footer = api.footer.earlyReprintFooter(face);
      return canonical({
        frame: api.frame.earlyReprintFrame(face),
        colors: api.colors.earlyReprintColors(face),
        footer: footer && { ...footer, artistPrefix: footer.artistPrefix ?? 'Illus. ' },
      });
    };
    const logical = [];
    for (const e of entries) {
      const a = JSON.stringify(getters(old, e.face)),
        b = JSON.stringify(getters(current, e.face));
      if (a !== b) throw Error('Neighbor getter changed: ' + e.id);
      logical.push({
        id: e.id,
        set: e.face.setCode,
        before: await digest(a),
        after: await digest(b),
      });
    }
    const native = [];
    for (const setCode of [
      'lea',
      'leb',
      '3ed',
      '4ed',
      'fem',
      'chr',
      'ced',
      'cei',
      'arn',
      'atq',
      'leg',
      'sum',
      'drk',
      'mir',
      '7ed',
    ])
      for (const material of ['W', 'U', 'B', 'R', 'G', 'A', 'L'])
        for (const wordingMode of ['original', 'oracle']) {
          const face = {
            name: 'Scoped profile control',
            setCode,
            wordingMode,
            frameStyle: 'retro',
            colorCalibration: 'set-hsb-v1',
            borderColor: ['3ed', '4ed', 'chr', '7ed'].includes(setCode) ? 'white' : 'black',
            colors: ['A', 'L'].includes(material) ? [] : [material],
            typeLine:
              material === 'L'
                ? 'Land'
                : material === 'A'
                  ? 'Mono Artifact'
                  : wordingMode === 'original'
                    ? 'Summon Example'
                    : 'Creature — Example',
            land: material === 'L',
            artifact: material === 'A',
            rulesText: 'Flying\nWhenever this creature attacks, draw a card.',
            artist: 'Original test artist',
            power: material === 'L' ? undefined : 'X',
            toughness: material === 'L' ? undefined : 'X',
            legalText: 'Original test credit',
          };
          const draw = (painter) => {
            const c = document.createElement('canvas');
            c.width = 732;
            c.height = 1020;
            const ctx = c.getContext('2d', { willReadFrequently: true });
            ctx.scale(1.5, 1.5);
            painter(ctx, face, new Map());
            const pixels = ctx.getImageData(0, 0, c.width, c.height).data;
            c.width = c.height = 0;
            return pixels;
          };
          const a = draw(old.painter.paintRetroFace),
            b = draw(current.painter.paintRetroFace);
          let changed = 0;
          for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) changed++;
          if (changed)
            throw Error(
              'Neighbor native lettering changed: ' + setCode + '/' + material + '/' + wordingMode,
            );
          native.push({
            id: setCode + '/' + material + '/' + wordingMode,
            before: await digest(a),
            after: await digest(b),
            changed,
          });
        }
    return { logical, native };
  }, input.entries);
  assert.deepEqual(session.faults, []);
  assert.equal(
    await sourceHash(path.join(root, 'games/magic/src')),
    rendererHash,
    'Renderer changed during controls',
  );
  const dependencies = Object.fromEntries(
    await Promise.all(
      files.map(async (name) => {
        const file = `games/magic/src/presentation/${name}.ts`;
        return [file, hash(await readFile(path.join(root, file)))];
      }),
    ),
  );
  await writeJson(output, {
    schema: 1,
    baselineCommit: revision,
    rendererHash,
    inputHash: hash(await readFile(inputFile)),
    scope:
      'Shared profile adapter only. Full supplied neighboring printing recipes have unchanged selector/material/footer metadata. Synthetic native lettering controls use cached real fonts with no frame/art images; these are byte-equivalence controls, not scan scores or a claim of full native image coverage.',
    dependencies,
    logicalCards: result.logical.length,
    nativeCards: result.native.length,
    ...result,
  });
  console.log({
    logicalCards: result.logical.length,
    nativeCards: result.native.length,
    changed: 0,
  });
} finally {
  await session.close();
}
