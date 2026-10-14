import { readFile, access } from 'node:fs/promises';
import { createServer } from 'vite';
import { PNG } from 'pngjs';
import { root, outputRoot, writeJson, hash } from './common.mjs';
import { sampleColor, center, delta, fitHsb, evaluateHsb } from './hsb-color.mjs';
const label = process.argv[2] ?? 'adventure-native-v2';
const output = `${outputRoot}/${process.argv[3] ?? `${label}-paper`}.json`;
try {
  await access(output);
  throw Error('Paper study exists; choose a new output label.');
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const dir = `${outputRoot}/${label}`;
const bytes = await readFile(`${dir}/audit.json`),
  audit = JSON.parse(bytes);
const server = await createServer({ configFile: false, root, server: { middlewareMode: true } });
const math = await server.ssrLoadModule('/games/magic/src/presentation/hsb.ts');
await server.close();
const patches = [[48, 508, 178, 103]];
const rows = [];
for (const r of audit.results.filter((r) => r.registration.accepted)) {
  const colors = r.face.faces[1].colors ?? [];
  const material = colors.length === 1 ? colors[0] : colors.length > 1 ? 'M' : 'A';
  const image = async (f) => PNG.sync.read(await readFile(`${dir}/${f}`));
  const reference = sampleColor(await image(r.files.reference), patches, {
    paper: true,
    tileSize: 20,
  });
  const source = sampleColor(await image(r.files.template), patches, { paper: true, tileSize: 20 });
  rows.push({ id: r.id, name: r.name, set: r.set, material, source, reference });
}
const fits = {};
for (const material of ['W', 'U', 'B', 'R', 'G']) {
  const all = rows
    .filter((r) => r.set === 'eld' && r.material === material)
    .sort((a, b) => a.name.localeCompare(b.name));
  const train = all.filter((_, i) => i % 2 === 0),
    holdout = all.filter((_, i) => i % 2 !== 0);
  if (!train.length) continue;
  const source = {
    rgb: center(train.map((r) => r.source.rgb)),
    tiles: train.flatMap((r) => r.source.tiles),
  };
  const fit = fitHsb(
    source,
    train.map((r) => r.reference),
    {
      neutralSaturation: 0.08,
      hueDegrees: [-25, 25],
      saturationScale: [0.05, 2],
      brightnessScale: [0.7, 1.8],
    },
    math,
  );
  fits[material] = {
    ...fit,
    calibration: train.map((r) => r.id),
    eldHoldout: holdout.map((r) => r.id),
  };
  console.log(material, fit.adjustment, fit.flags);
}
const evaluated = rows.map((r) => ({
  name: r.name,
  set: r.set,
  material: r.material,
  ...(fits[r.material]
    ? evaluateHsb(r.source, r.reference, fits[r.material].adjustment, math)
    : { before: delta(r.source.rgb, r.reference.rgb) }),
}));
for (const set of ['eld', 'woe', 'clb']) {
  const r = evaluated.filter((r) => r.set === set && r.after !== undefined);
  console.log(
    set,
    r.length,
    r.reduce((s, r) => s + r.before, 0) / r.length,
    r.reduce((s, r) => s + r.after, 0) / r.length,
  );
}
await writeJson(output, {
  schemaVersion: 1,
  inputAuditHash: hash(bytes),
  patches,
  scope:
    'Source-paper HSB fit on alternating ELD mono-color printings; WOE/CLB transfer is held out. Gold, hybrid and artifact are excluded from fitted profiles.',
  fits,
  results: evaluated,
});
