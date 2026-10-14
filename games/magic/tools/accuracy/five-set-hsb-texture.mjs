import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { fixtureRoot, outputRoot, readJson, writeJson } from './common.mjs';
import { readObject } from './cache.mjs';
import { normalize } from './pixels-pure.mjs';
import { sampleTexture, textureMetrics } from './hsb-texture.mjs';
import { median } from './hsb-color.mjs';

const directory = outputRoot + '/five-set-hsb',
  report = await readJson(fixtureRoot + '/five-set-hsb-results.json'),
  selection = await readJson(directory + '/selection.json');
for (const g of report.groups) {
  if (!g.patches) continue;
  const source = normalize(
      PNG.sync.read(await readFile(directory + '/' + g.key.replaceAll('/', '-') + '-source.png')),
    ),
    texture = sampleTexture(source, g.patches.frame),
    saved = selection.groups.find((r) => r.key === g.key);
  const rows = [];
  for (const row of g.rows.filter((r) => r.cohort === 'validation')) {
    const reference = saved.rows.find((r) => r.id === row.id).reference;
    const image = normalize(normalize(PNG.sync.read(await readObject(reference))), row.transform);
    rows.push({
      before: textureMetrics(texture, sampleTexture(image, g.patches.frame)),
      after: row.texture,
    });
  }
  g.texture = Object.fromEntries(
    ['shadowChroma', 'shadowLightness', 'contrastError'].map((k) => [
      k,
      { before: median(rows.map((r) => r.before[k])), after: median(rows.map((r) => r.after[k])) },
    ]),
  );
  for (const [k, v] of Object.entries(g.texture)) {
    if (v.after > v.before + (k === 'contrastError' ? 0.5 : 0.25))
      g.flags.push('frame-texture-regression-' + k);
  }
  for (const c of ['frame', 'paper'])
    if (g.validation[c].after > 5) g.flags.push(c + '-absolute-color-error');
  g.flags = [...new Set(g.flags)];
}
if (!report.policy.includes('Additional independent component gates:'))
  report.policy +=
    ' Additional independent component gates: median color error <=5; dark-bin chroma/lightness must not regress >0.25 Oklab and texture contrast-error must not regress >0.5. Absolute texture residuals remain asset diagnostics.';
await writeJson(fixtureRoot + '/five-set-hsb-results.json', report);
console.log('Validated texture/shadow distributions against frozen held-out scans.');
