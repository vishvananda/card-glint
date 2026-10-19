// Reuse the released pack's exact integrated pinline painter and source palette.
// This changes local experimental rasters only, never shipped asset defaults.
import assert from 'node:assert/strict';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { PNG } from 'pngjs';
import { createServer } from 'vite';
const [studyArg, assetsArg, outputArg, rendererArg] = process.argv.slice(2);
assert(rendererArg, 'Usage: frame-reconstruction-land-lines.mjs STUDY_L MASKS OUTPUT RENDERER');
const [study, assets, out, renderer] = [studyArg, assetsArg, outputArg, rendererArg].map((p) =>
  path.resolve(p),
);
const hash = (b) => createHash('sha256').update(b).digest('hex');
const json = async (p) => JSON.parse(await readFile(p, 'utf8'));
const decode = async (p) => PNG.sync.read(await readFile(p));
assert.equal((await json(path.join(renderer, 'package.json'))).version, '0.6.0');
const ssr = await createServer({
  configFile: false,
  root: renderer,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true, hmr: false },
  plugins: [
    {
      name: 'read-existing-pinline-palette',
      transform(source, id) {
        if (id.endsWith('/abu-dual-pinline.ts'))
          return { code: source + '\nexport { PALETTE };', map: null };
      },
    },
  ],
});
try {
  const { dualLandPinline } = await ssr.ssrLoadModule(
    '/games/magic/src/presentation/dual-land-pinline.ts',
  );
  const { PALETTE } = await ssr.ssrLoadModule('/games/magic/src/presentation/abu-dual-pinline.ts');
  const observations = await json(path.join(study, 'observations.json'));
  const presets = (await json(path.join(assets, 'dual-land-palettes.json'))).palettes;
  const neutral = await decode(path.join(study, 'joint/backprop-plate.png'));
  const mask = await decode(path.join(assets, 'land-border-mask.png'));
  assert.equal(mask.width, neutral.width);
  assert.equal(mask.height, neutral.height);
  const typeColor = { plains: 'W', island: 'U', swamp: 'B', mountain: 'R', forest: 'G' };
  const rectangles = {
    outer: [28.0301318267, 30.2834008097, 459.9698681733, 646.5047233468],
    art: [47.7890772128, 60.5668016194, 440.670433145, 379.4601889339],
    rules: [61.5743879473, 404.2375168691, 427.3446327684, 600.1619433198],
  };
  const ink = [0.18, 0.18, 0.17];
  await mkdir(out, { recursive: true });
  const rows = [];
  const cards = [
    ...observations.records,
    { id: 'synthetic-volcanic-island', name: 'Volcanic Island', synthetic: true },
  ];
  for (const row of cards) {
    const preset =
      presets[row.name.toLowerCase().replaceAll(' ', '-')] ??
      (row.synthetic ? { color_a: 'mountain', color_b: 'island' } : undefined);
    if (!preset) continue; // Basic-land frame treatments are not changed here.
    const colors = [typeColor[preset.color_a], typeColor[preset.color_b]].sort(
      (a, b) => 'RGUBW'.indexOf(a) - 'RGUBW'.indexOf(b),
    );
    assert(colors.every((c) => PALETTE[c]));
    const input = path.join(study, 'land-plates', row.id + '.png');
    const bytes = await readFile(input),
      image = PNG.sync.read(bytes);
    assert.equal(image.width, neutral.width);
    assert.equal(image.height, neutral.height);
    const pw = 488 / image.width,
      ph = 680 / image.height;
    // Restore the original neutral pixels before drawing new rings. Blending the
    // old tint out twice would leave a colored fringe around antialiased pixels.
    for (let i = 0; i < image.data.length; i += 4)
      if (mask.data[i] > 0) for (let k = 0; k < 3; k++) image.data[i + k] = neutral.data[i + k];
    for (const [role, rect] of Object.entries(rectangles)) {
      const [left, top, right, bottom] = rect,
        width = role === 'rules' ? 6.375 : role === 'art' ? 3.75 : 3.75;
      const inks = role === 'outer' ? [ink, ink] : colors.map((c) => PALETTE[c]);
      const geometry = {
        box: { left, top, right, bottom },
        width: { left: width, right: width, top: width, bottom: width },
      };
      for (let y = Math.floor(top / ph); y < Math.ceil(bottom / ph); y++)
        for (let x = Math.floor(left / pw); x < Math.ceil(right / pw); x++) {
          if (
            x * pw > left + width + pw &&
            (x + 1) * pw < right - width - pw &&
            y * ph > top + width + ph &&
            (y + 1) * ph < bottom - width - ph
          )
            continue;
          const i = (y * image.width + x) * 4;
          if (!image.data[i + 3]) continue;
          const p = dualLandPinline((x + 0.5) * pw, (y + 0.5) * ph, pw, ph, inks, geometry);
          if (!p) continue;
          for (let k = 0; k < 3; k++)
            image.data[i + k] = Math.round(
              image.data[i + k] * (1 - p.alpha) + p.color[k] * 255 * p.alpha,
            );
        }
    }
    const originalAlpha = PNG.sync.read(bytes).data;
    const output = PNG.sync.write(image);
    const file = row.id + '.png';
    await writeFile(path.join(out, file), output);
    for (let i = 3; i < image.data.length; i += 4) assert.equal(image.data[i], originalAlpha[i]);
    rows.push({
      id: row.id,
      name: row.name,
      synthetic: !!row.synthetic,
      colors,
      sourceSha256: hash(bytes),
      file,
      sha256: hash(output),
    });
  }
  const sources = await Promise.all(
    ['dual-land-pinline', 'abu-dual-pinline'].map(async (name) => ({
      file: name + '.ts',
      sha256: hash(
        await readFile(path.join(renderer, 'games/magic/src/presentation', name + '.ts')),
      ),
    })),
  );
  await writeFile(
    path.join(out, 'lines.json'),
    JSON.stringify(
      {
        schema: 1,
        renderer: '0.6.0',
        sources,
        rectangles,
        physicalWidths: { art: 3.75, rules: 6.375, outer: 3.75 },
        policy:
          'Existing 0.6.0 integrated edge/color/color/color/edge painter and RGUBW source color order. One charcoal outer outline; three equal color bands on art and rules boxes. Geometry measured from shared supplied masks; alpha unchanged.',
        rows,
      },
      null,
      2,
    ) + '\n',
  );
  console.log('Wrote', rows.length, 'experimental dual-land frames');
} finally {
  await ssr.close();
}
