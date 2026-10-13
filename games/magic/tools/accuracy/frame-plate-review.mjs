import path from 'node:path';
import { readFile, writeFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { hash } from './common.mjs';
import { normalize, cropGray } from './pixels-pure.mjs';
import { compareRegion } from './metrics.mjs';
import { framePlateRegistration } from './frame-plate-registration.mjs';

const directory = process.argv[2];
if (!directory) throw Error('Usage: frame-plate-review.mjs CAPTURE_DIRECTORY');
const examples = JSON.parse(await readFile(path.join(directory, 'examples.json')));
const snapshot = JSON.parse(await readFile(path.join(directory, 'snapshot.json')));
const rows = [];
const methodHash = hash(
  Buffer.concat(
    await Promise.all(
      [
        'frame-plate-registration.mjs',
        'scan-frame-anchors.mjs',
        'scan-frame-fit.mjs',
        'pixels-pure.mjs',
      ].map((name) => readFile(new URL(name, import.meta.url))),
    ),
  ),
);
let saved;
try {
  saved = JSON.parse(await readFile(path.join(directory, 'placement-normalization.json')));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
for (const e of examples) {
  if (!/^[a-z0-9]+-[a-z0-9]+$/.test(e.slug)) throw Error('Unsafe capture slug');
  const bytes = Object.fromEntries(
    await Promise.all(
      ['reference', 'before', 'plate'].map(async (key) => [
        key,
        await readFile(path.join(directory, `${e.slug}-${key}.png`)),
      ]),
    ),
  );
  const hashes = Object.fromEntries(Object.entries(bytes).map(([key, b]) => [key, hash(b)]));
  const entry = snapshot.entries.find((r) => r.card.set === e.set && r.card.name === e.name);
  if (entry?.reference.sha256 !== hashes.reference) throw Error('Reference identity changed');
  const source = PNG.sync.read(bytes.reference),
    baseline = normalize(PNG.sync.read(bytes.before));
  const identity = {
    reference: hashes.reference,
    template: hashes.before,
    family: e.family,
    border: entry.card.border_color,
    methodHash,
  };
  const prior = saved?.find((r) => r.slug === e.slug);
  if (prior && JSON.stringify(prior.identity) !== JSON.stringify(identity))
    throw Error('Frozen normalization identity changed');
  if (prior && prior.resultHash !== hash(JSON.stringify(prior.fit)))
    throw Error('Frozen normalization result changed');
  const fit =
    prior?.fit ?? framePlateRegistration(normalize(source), baseline, e.family, identity.border);
  const ref = fit.accepted ? normalize(source, fit.transform) : null;
  const rendered = normalize(PNG.sync.read(bytes.plate));
  const row = {
    slug: e.slug,
    name: e.name,
    family: e.family,
    source: e.source,
    identity,
    hashes,
    fit,
    regions: {},
  };
  if (ref) {
    const rectangles = { symbol: [380, 380, 80, 42] },
      n = e.face.manaSymbols?.length;
    if (n) rectangles.mana = [Math.floor(449 - n * 27 - 7), 35, n * 27 + 14, 39];
    for (const [name, rect] of Object.entries(rectangles)) {
      const reference = cropGray(ref, rect),
        before = cropGray(baseline, rect),
        after = cropGray(rendered, rect);
      row.regions[name] = {
        rect,
        before: compareRegion(reference.gray, before.gray, reference.width, reference.height),
        after: compareRegion(reference.gray, after.gray, reference.width, reference.height),
      };
    }
    const png = (im) => PNG.sync.write({ ...im, data: Buffer.from(im.data) });
    await writeFile(path.join(directory, `${e.slug}-normalized.png`), png(ref));
    const overlay = { width: 488, height: 680, data: new Uint8Array(488 * 680 * 4) };
    for (let p = 0; p < overlay.data.length; p += 4) {
      const gray = (im) => 0.2126 * im.data[p] + 0.7152 * im.data[p + 1] + 0.0722 * im.data[p + 2];
      const a = gray(ref),
        b = gray(rendered);
      overlay.data.set([a, b, (a + b) * 0.22, 255], p);
    }
    await writeFile(path.join(directory, `${e.slug}-overlay.png`), png(overlay));
  }
  rows.push(row);
}
await writeFile(
  path.join(directory, 'placement-normalization.json'),
  JSON.stringify(
    rows.map(({ slug, identity, fit }) => ({
      slug,
      identity,
      fit,
      resultHash: hash(JSON.stringify(fit)),
    })),
    null,
    2,
  ),
);
const summary = Object.fromEntries(
  ['eighth', 'm15-accurate'].map((family) => [
    family,
    Object.fromEntries(
      ['mana', 'symbol'].map((region) => {
        const accepted = rows.filter((r) => r.family === family && r.regions[region]);
        const mean = (key) =>
          accepted.reduce((s, r) => s + r.regions[region][key].edgeF1[1], 0) / accepted.length;
        return [
          region,
          {
            count: accepted.length,
            before: mean('before'),
            after: mean('after'),
            regressions: accepted
              .filter(
                (r) =>
                  r.regions[region].after.edgeF1[1] < r.regions[region].before.edgeF1[1] - 0.02,
              )
              .map((r) => r.slug),
          },
        ];
      }),
    ),
  ]),
);
const report = {
  schemaVersion: 1,
  scope:
    'Replacement frame candidates; frozen per-scan frame-only alignment before color-insensitive edge scoring at 1 px. No rejected fit is scored. Baseline imported symbols vs reviewed-source policy plus shared family geometry. These development examples are not a corpus accuracy claim.',
  methodHash,
  summary,
  rows,
};
await writeFile(path.join(directory, 'placement-review.json'), JSON.stringify(report, null, 2));
console.log(
  JSON.stringify(
    { summary, rejected: rows.filter((r) => !r.fit.accepted).map((r) => r.slug) },
    null,
    2,
  ),
);
