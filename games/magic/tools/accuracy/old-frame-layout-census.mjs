// Fast production-layout census: fonts once, no art decoding or face composition.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { openBrowser } from './browser.mjs';
import { hash, root, sourceHash, writeJson } from './common.mjs';
const [inputFile, beforeFile, afterFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS BEFORE_PROFILE AFTER_PROFILE NEW_OUTPUT');
const raw = await Promise.all([inputFile, beforeFile, afterFile].map((f) => fs.readFile(f)));
const [input, before, after] = raw.map((b) => JSON.parse(b));
assert.equal(before.set, input.set);
assert.equal(after.set, input.set);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const session = await openBrowser(input, {
  plugins: [
    {
      name: 'layout-census-profile',
      enforce: 'pre',
      transform(code, id) {
        if (!id.endsWith('/games/magic/src/calibration/profiles.ts')) return;
        const needle =
          'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
        assert.equal(code.split(needle).length, 2);
        return code.replace(
          needle,
          'return (globalThis as any).__layoutProfile?.set === set ? (globalThis as any).__layoutProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;',
        );
      },
    },
  ],
});
try {
  const result = await session.page.evaluate(
    async ({ entries, before, after }) => {
      await import('/games/magic/src/data/eager.ts');
      const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
      const { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts');
      const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
      await Promise.all([loadCanvasFonts(), loadRetroFont()]);
      const canvas = document.createElement('canvas'),
        c = canvas.getContext('2d');
      const start = performance.now(),
        rows = [];
      for (const e of entries) {
        const layouts = {};
        for (const [key, profile] of [
          ['before', before],
          ['after', after],
        ]) {
          globalThis.__layoutProfile = profile;
          const layout = retroTextLayout(c, e.face);
          layouts[key] = layout
            ? {
                size: layout.size,
                lines: layout.lines.length,
                x: layout.x,
                top: layout.top,
                height: layout.height,
                rows: layout.lines.map((l) =>
                  l.runs.map((r) => (r.symbol ? '{' + r.text + '}' : r.text)).join(''),
                ),
                widths: layout.lines.map((l) => l.width),
              }
            : null;
        }
        rows.push({ id: e.id, name: e.name, material: e.material, ...layouts });
      }
      delete globalThis.__layoutProfile;
      return { rows, layoutMilliseconds: performance.now() - start };
    },
    { entries: input.entries, before, after },
  );
  const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const nonland = result.rows.filter((r) => r.material !== 'L');
  const changedFonts = nonland.filter((r) => r.before?.size !== r.after?.size);
  const changedRows = nonland.filter((r) => !same(r.before?.rows, r.after?.rows));
  assert.deepEqual(session.faults, []);
  assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
  assert.equal(toolHash, hash(await fs.readFile(new URL(import.meta.url))));
  await writeJson(out, {
    schema: 1,
    status: 'production-layout-census-not-pixel-score',
    set: input.set,
    source: {
      inputHash: hash(raw[0]),
      beforeProfileHash: hash(raw[1]),
      afterProfileHash: hash(raw[2]),
      rendererHash,
      toolHash,
    },
    scope:
      'Production retroTextLayout with the exact loaded fonts. No art decoding, complete face painting, scan alignment, raster comparison or GPU work. Canvas font measurement time excludes browser/font startup. Large-basic icon paths are reported as null text layouts.',
    summary: {
      total: result.rows.length,
      nonland: nonland.length,
      changedNonlandFontSizes: changedFonts.length,
      changedNonlandRows: changedRows.length,
      largeBasicIconPaths: result.rows.filter((r) => r.before && r.after === null).length,
    },
    ...result,
  });
  console.log(
    input.set,
    'layout census',
    result.rows.length,
    'nonland font/row changes',
    changedFonts.length,
    changedRows.length,
    'CPU Canvas measurement ms',
    result.layoutMilliseconds,
  );
} finally {
  await session.close();
}
