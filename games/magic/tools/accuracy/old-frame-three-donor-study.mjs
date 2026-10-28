// Native donor comparisons on one frozen scan-only pose per target printing.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { hash, root, sourceHash, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { oldDefaultTarget, oldDefaultPose } from './old-frame-default-registration.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { transferOldFrameDefault } from './old-frame-default-transfer.mjs';
const [inputsFile, donorsFile, metricFile, out] = process.argv.slice(2);
assert(out, 'Use INPUTS DONOR_PROFILES METRICS NEW_DIRECTORY');
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
await fs.mkdir(out);
const bytes = await fs.readFile(inputsFile),
  inputs = JSON.parse(bytes);
assert.equal(inputs.status, 'development-pilot-not-full-set');
const donorBytes = await fs.readFile(donorsFile),
  donors = JSON.parse(donorBytes);
assert.deepEqual(Object.keys(donors).sort(), ['4ed', 'mir', 'ons']);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
const graph = await metricSourceGraph(path.resolve(metricFile));
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricFile)));
const references = [];
for (const e of inputs.entries) {
  const raw = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(raw), e.reference.sha256);
  const image = normalize(PNG.sync.read(raw));
  references.push({ id: e.id, raw, image, anchors: scanFrameAnchors(image, e.face.borderColor) });
}
const target = oldDefaultTarget(references);
assert(target.reliable);
const manifest = JSON.parse(await fs.readFile(path.join(root, 'games/magic/assets.json')));
const urls = new Set(
  Object.values(donors).flatMap((p) => Object.values(p.colors).map((c) => JSON.parse(c.source)[0])),
);
for (const suffix of ['old/abu/border.svg', 'old/fourth/borderBlack.png'])
  urls.add(manifest.RETRO_ROOT + '/img/frames/' + suffix);
for (const color of 'wubrg')
  urls.add(manifest.RETRO_ROOT + '/img/frames/m15/basics/' + color + '.png');
const extra = await Promise.all([...urls].map((url) => cachedFetch(url, { offline: true })));
const transformed = {};
const session = await openBrowser(
  { ...inputs, components: [...inputs.components, ...extra] },
  {
    plugins: [
      {
        name: 'three-donor-native-profile-trial',
        enforce: 'pre',
        transform(code, id) {
          if (id.endsWith('/games/magic/src/calibration/selection.ts')) {
            const needle = 'export function calibrationForFace(face: RenderedCardInput) {';
            assert.equal(code.split(needle).length, 2);
            const after = code.replace(
              needle,
              needle +
                '\n  if ((globalThis as any).__threeDonor?.profile?.set === face.setCode) return (globalThis as any).__threeDonor.profile;',
            );
            transformed.selection = { before: hash(code), after: hash(after) };
            return after;
          }
          if (id.endsWith('/games/magic/src/presentation/retro-details.ts')) {
            const needle = 'export function retroPrintDetails(face: RenderedCardInput) {';
            assert.equal(code.split(needle).length, 2);
            const after =
              code.replace(
                needle,
                'function originalDonorStudyDetails(face: RenderedCardInput) {',
              ) +
              '\nexport function retroPrintDetails(face: RenderedCardInput) {\n' +
              ' const actual=originalDonorStudyDetails(face);\n' +
              ' const trial=(globalThis as any).__threeDonor;\n' +
              ' if (!trial) return actual;\n' +
              ' const donor=originalDonorStudyDetails({...face,setCode:trial.donor,typeLine:"Enchantment"});\n' +
              ' return {...donor,setRight:actual?.setRight,setCenterY:actual?.setCenterY,setHeight:actual?.setHeight,setOutline:actual?.setOutline,legalText:face.legalText??actual?.legalText??null};\n}\n';
            transformed.details = { before: hash(code), after: hash(after) };
            return after;
          }
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
  });
  for (const e of inputs.entries) {
    const reference = references.find((r) => r.id === e.id),
      pose = oldDefaultPose(reference.anchors, target);
    if (!pose.accepted) {
      rows.push({
        id: e.id,
        name: e.name,
        material: e.material,
        status: 'rejected-normalization',
        pose,
      });
      continue;
    }
    const scan = normalize(PNG.sync.read(reference.raw), pose.transform);
    const scanFile = e.id + '-scan.png',
      scanBytes = PNG.sync.write({ width: 488, height: 680, data: Buffer.from(scan.data) });
    await fs.writeFile(path.join(out, scanFile), scanBytes);
    const baseline = await session.page.evaluate(async (e) => {
      delete globalThis.__threeDonor;
      const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
      const { calibratedPrintingStock } = await import(
        '/games/magic/src/presentation/printing-calibration-materials.ts'
      );
      const { retroStock } = await import('/games/magic/src/presentation/retro-frame.ts');
      const stock = calibratedPrintingStock(e.face) ?? retroStock(e.face);
      const strings = [],
        original = CanvasRenderingContext2D.prototype.fillText;
      CanvasRenderingContext2D.prototype.fillText = function (s, ...args) {
        strings.push(String(s));
        return original.call(this, s, ...args);
      };
      let canvas;
      try {
        canvas = await composeCardTexture(
          { face: e.face, printingId: e.id, printedImage: null },
          'inspect',
          new AbortController().signal,
        );
        return {
          stock,
          legalText: strings.find((s) => s.includes('Wizards')) ?? '',
          png: canvas.toDataURL().split(',')[1],
        };
      } finally {
        CanvasRenderingContext2D.prototype.fillText = original;
        if (canvas) canvas.width = canvas.height = 0;
      }
    }, e);
    const variants = {};
    for (const donor of ['current', '4ed', 'mir', 'ons']) {
      const profile =
        donor === 'current' ? null : transferOldFrameDefault(donors[donor], e.face, baseline.stock);
      const result =
        donor === 'current'
          ? { png: baseline.png, matched: true }
          : await session.page.evaluate(
              async ({ e, profile, donor, legalText }) => {
                let face = { ...e.face, legalText };
                globalThis.__threeDonor = { profile, donor };
                const { composeCardTexture } = await import(
                  '/games/magic/src/presentation/canvas-face.ts'
                );
                const { earlyReprintFrame } = await import(
                  '/games/magic/src/presentation/early-reprint-frame.ts'
                );
                const frame = earlyReprintFrame(face);
                if (!frame) {
                  delete globalThis.__threeDonor;
                  face = e.face;
                }
                let image;
                try {
                  image = await composeCardTexture(
                    { face, printingId: e.id, printedImage: null },
                    'inspect',
                    new AbortController().signal,
                  );
                  return {
                    png: image.toDataURL().split(',')[1],
                    matched: !!frame,
                    frame: frame
                      ? { asset: frame.asset, material: frame.material, family: frame.family }
                      : null,
                  };
                } finally {
                  delete globalThis.__threeDonor;
                  if (image) image.width = image.height = 0;
                }
              },
              { e, profile, donor, legalText: baseline.legalText },
            );
      const png = Buffer.from(result.png, 'base64'),
        file = donor + '-' + e.id + '.png';
      await fs.writeFile(path.join(out, file), png);
      if (!result.matched)
        assert.equal(
          hash(png),
          hash(Buffer.from(baseline.png, 'base64')),
          'Unsupported class must retain the exact current face',
        );
      const value = scoreRegions(scan, normalize(PNG.sync.read(png)), e.card, {
        ...e.face,
        typeSource: 'MTGJSON original type candidate',
        rulesSource: 'MTGJSON original text',
      });
      // A declared common weighting compares defaults, not printing compliance.
      const weights = { frame: 30, art: 10, title: 15, type: 15, rules: 20, mana: 10 };
      let total = 0,
        weight = 0;
      for (const [key, w] of Object.entries(weights)) {
        const c = value.components[key];
        if (c?.eligible && Number.isFinite(c.score)) {
          total += c.score * w;
          weight += w;
        }
      }
      variants[donor] = {
        file,
        sha256: hash(png),
        matched: result.matched,
        frame: result.frame ?? null,
        score100: weight ? (100 * total) / weight : null,
        structural100: value.structuralScore === null ? null : 100 * value.structuralScore,
        color: value.color,
        components: Object.fromEntries(
          Object.entries(value.components).map(([k, c]) => [
            k,
            {
              eligible: c.eligible,
              score100: c.score === null ? null : 100 * c.score,
              status: c.status,
            },
          ]),
        ),
      };
    }
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      inputHash: hash(JSON.stringify(e.face)),
      referenceHash: e.reference.sha256,
      pose,
      scanHash: hash(scanBytes),
      variants,
    });
    if (rows.length % 5 === 0) console.log(inputs.set, rows.length, '/', inputs.entries.length);
  }
  assert.deepEqual(session.faults, []);
} finally {
  await session.close();
}
assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
assert.equal(hash(await fs.readFile(new URL(import.meta.url))), toolHash);
assert.deepEqual(await metricSourceGraph(path.resolve(metricFile)), graph);
const groups = {};
for (const key of ['all', ...new Set(rows.map((r) => r.material))]) {
  const peers = rows.filter((r) => r.variants && (key === 'all' || r.material === key));
  groups[key] = { count: peers.length, donors: {} };
  for (const donor of ['current', '4ed', 'mir', 'ons']) {
    const values = peers.filter((r) => Number.isFinite(r.variants[donor].score100));
    groups[key].donors[donor] = {
      matched: values.filter((r) => r.variants[donor].matched).length,
      mean100: values.length
        ? values.reduce((n, r) => n + r.variants[donor].score100, 0) / values.length
        : null,
    };
  }
}
await writeJson(path.join(out, 'study.json'), {
  schema: 1,
  status: 'three-donor-development-comparison-not-target-set-approval',
  set: inputs.set,
  source: {
    inputs: hash(bytes),
    donors: hash(donorBytes),
    rendererHash,
    metric: graph,
    toolHash,
    transferToolHash: hash(
      await fs.readFile(new URL('./old-frame-default-transfer.mjs', import.meta.url)),
    ),
  },
  scope:
    'Deterministic ordinary nonfoil development names. All donor trials share the same independently observed scan frame target/affine pose. Donor set symbols, named land assignments, copyright wording and collector totals are removed; target symbol vocabulary and current legal words remain. Explicit black/white target stock is preserved. Unmatched frame classes must retain byte-identical current native faces and are reported as fallback, never as adopted donor evidence. Effective policy means include those same fallback cards, so all donors have the same denominator. This is a starting-default comparison, not calibration or completion of target sets.',
  selectionWeights: { frame: 30, art: 10, title: 15, type: 15, rules: 20, mana: 10 },
  target,
  transformed,
  groups,
  rows,
  faults: [],
});
console.log(inputs.set, JSON.stringify(groups.all));
