// A development comparison, with one frozen scan-only pose for every candidate.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, objectFile, sourceHash, root, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { scanFrameAnchors } from './scan-frame-anchors.mjs';
import { oldDefaultTarget, oldDefaultPose } from './old-frame-default-registration.mjs';
import { metricSourceGraph } from './module-graph.mjs';
import { oldFrameDefaultPlugins, oldFrameDefaultModes } from './old-frame-default-hooks.mjs';
const [inputFile, captureFile, donorFile, metricsFile, policyFile, out] = process.argv.slice(2);
assert(
  out,
  'Usage: old-frame-default-study.mjs INPUTS NATIVE_CAPTURE DONOR_INPUTS METRICS POLICY NEW_OUTPUT',
);
const files = [inputFile, captureFile, donorFile],
  raw = await Promise.all(files.map((f) => fs.readFile(f)));
const [inputs, capture, donor] = raw.map((b) => JSON.parse(b));
assert.equal(inputs.status, 'development-pilot-not-full-set');
assert.equal(capture.status, 'complete');
assert.equal(capture.inputHash, hash(raw[0]));
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(capture.rendererHash, rendererHash);
await fs.mkdir(out);
const graph = await metricSourceGraph(path.resolve(metricsFile)),
  policy = await metricSourceGraph(path.resolve(policyFile));
const { scoreRegions } = await import(pathToFileURL(path.resolve(metricsFile)));
const references = [];
for (const e of inputs.entries) {
  const bytes = await fs.readFile(objectFile(e.reference));
  assert.equal(hash(bytes), e.reference.sha256);
  const image = normalize(PNG.sync.read(bytes)),
    anchors = scanFrameAnchors(image, e.face.borderColor);
  references.push({ id: e.id, image, anchors });
}
const target = oldDefaultTarget(references);
assert(target.reliable);
const session = await openBrowser(
    { ...inputs, components: [...inputs.components, ...donor.components] },
    { plugins: oldFrameDefaultPlugins() },
  ),
  rows = [];
try {
  for (const e of inputs.entries) {
    const reference = references.find((r) => r.id === e.id),
      pose = oldDefaultPose(reference.anchors, target);
    const scan = normalize(
      PNG.sync.read(await fs.readFile(objectFile(e.reference))),
      pose.accepted ? pose.transform : undefined,
    );
    const scanFile = e.id + '-scan.png';
    await fs.writeFile(
      path.join(out, scanFile),
      PNG.sync.write({ width: scan.width, height: scan.height, data: Buffer.from(scan.data) }),
    );
    const baseline = capture.rows.find((r) => r.id === e.id).modes.original;
    const result = await session.page.evaluate(
      async ({ e, modes }) => {
        await import('/games/magic/src/data/eager.ts');
        await import('/games/magic/src/data/eager-wording.ts');
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { profile } = await import('/games/magic/src/calibration/sets/4ed.ts');
        const { retroFrameAsset, retroFrameRect, retroRects, retroFamily, retroStock } =
          await import('/games/magic/src/presentation/retro-frame.ts');
        const { calibratedPrintingStock } = await import(
          '/games/magic/src/presentation/printing-calibration-materials.ts'
        );
        const { retroTextLayout } = await import('/games/magic/src/presentation/retro-rules.ts');
        const signal = new AbortController().signal,
          out = {};
        delete globalThis.__oldFrameDonor;
        const currentFrame = {
          asset: retroFrameAsset(e.face),
          frame: retroFrameRect(e.face),
          art: retroRects(e.face).art,
          family: retroFamily(e.face),
          material: e.material,
          profile: e.face.setCode + '/' + e.material,
        };
        const stock = calibratedPrintingStock(e.face) ?? retroStock(e.face);
        const donor = structuredClone(profile);
        donor.border = e.face.borderColor;
        for (const c of Object.values(donor.colors)) {
          c.stock = stock;
          if (c.adjustment?.outerStock) {
            const v = parseInt(stock.slice(1), 16);
            c.adjustment.outerStock = [(v >> 16) / 255, ((v >> 8) & 255) / 255, (v & 255) / 255];
          }
        }
        let legal = '';
        for (const mode of modes) {
          delete globalThis.__oldFrameDonor;
          const face = mode === 'current' ? e.face : { ...e.face, legalText: legal };
          if (mode !== 'current') {
            const frameKey = face.land
              ? face.name === 'Plains'
                ? 'L-W'
                : face.name === 'Island'
                  ? 'L-U'
                  : face.name === 'Swamp'
                    ? 'L-B'
                    : face.name === 'Mountain'
                      ? 'L-R'
                      : face.name === 'Forest'
                        ? 'L-G'
                        : 'L'
              : e.material;
            const matched = !!donor.frames[frameKey];
            globalThis.__oldFrameDonor = {
              mode,
              profile: donor,
              frame: mode === 'fourth-layout' || !matched ? currentFrame : undefined,
            };
          }
          const urls = canvasAssetUrls(face),
            lease = await loadAccuracyImages(urls, signal, face.illustration);
          const originalFill = CanvasRenderingContext2D.prototype.fillText,
            strings = [];
          if (mode === 'current')
            CanvasRenderingContext2D.prototype.fillText = function (text, ...args) {
              strings.push(String(text));
              return originalFill.call(this, text, ...args);
            };
          let canvas;
          try {
            canvas = await composeCardTexture(
              { face, printingId: e.id, printedImage: null },
              'inspect',
              signal,
              { loadImages: async () => ({ ...lease, dispose() {} }) },
            );
            const ctx = canvas.getContext('2d'),
              l = retroTextLayout(ctx, face),
              state = globalThis.__oldFrameDonor;
            out[mode] = {
              png: canvas.toDataURL().split(',')[1],
              frame: {
                asset: retroFrameAsset(face),
                frame: retroFrameRect(face),
                art: retroRects(face).art,
                family: retroFamily(face),
              },
              layout: l
                ? {
                    size: l.size,
                    x: l.x,
                    width: l.width,
                    top: l.top,
                    height: l.height,
                    overflow: l.overflow ?? false,
                    lines: l.lines.map((line) => line.runs.map((r) => r.text).join('')),
                  }
                : null,
              frameDonorAvailable: mode === 'fourth-frame-layout' ? !state?.frame : undefined,
            };
            if (mode === 'current') legal = strings.find((s) => s.includes('Wizards')) ?? '';
          } finally {
            CanvasRenderingContext2D.prototype.fillText = originalFill;
            if (canvas) canvas.width = canvas.height = 0;
            lease.dispose();
          }
        }
        delete globalThis.__oldFrameDonor;
        return out;
      },
      { e, modes: oldFrameDefaultModes },
    );
    const modes = {};
    for (const [mode, v] of Object.entries(result)) {
      const bytes = Buffer.from(v.png, 'base64'),
        sha256 = hash(bytes),
        file = e.id + '-' + mode + '.png';
      if (mode === 'current')
        assert.equal(sha256, baseline.sha256, 'Hooked baseline differs from native ' + e.name);
      await fs.writeFile(path.join(out, file), bytes);
      const face = {
        ...e.face,
        typeSource: 'Scan-reviewed type',
        rulesSource: 'Original printing source',
      };
      const score = scoreRegions(scan, normalize(PNG.sync.read(bytes)), e.card, face);
      const { png, ...rest } = v;
      modes[mode] = { ...rest, file, sha256, score };
    }
    assert.deepEqual(
      modes.current.frame,
      modes['fourth-layout'].frame,
      'Layout trial changed frame source/geometry',
    );
    rows.push({
      id: e.id,
      set: inputs.set,
      name: e.name,
      number: e.card.collector_number,
      material: e.material,
      referenceHash: e.reference.sha256,
      artHash: e.art.sha256,
      inputHash: hash(JSON.stringify(e.face)),
      typeLine: e.face.typeLine,
      typeReview: e.wordingEvidence.typeReview,
      scanFile,
      pose,
      ranked: pose.accepted,
      modes,
    });
    await writeJson(path.join(out, 'study.json'), {
      schema: 1,
      set: inputs.set,
      status: 'running',
      rendererHash,
      rows,
    });
    console.log(
      inputs.set,
      rows.length,
      '/',
      inputs.entries.length,
      e.name,
      pose.accepted ? 'aligned' : pose.reason,
    );
  }
  assert.equal(await sourceHash(path.join(root, 'games/magic/src')), rendererHash);
  assert.deepEqual(
    await Promise.all(files.map(async (f) => hash(await fs.readFile(f)))),
    raw.map(hash),
  );
  const ranked = rows.filter((r) => r.ranked),
    mean = (a) => (a.length ? a.reduce((s, v) => s + v, 0) / a.length : null);
  const summary = Object.fromEntries(
    oldFrameDefaultModes.map((mode) => [
      mode,
      {
        cards: ranked.length,
        whole100: 100 * mean(ranked.map((r) => r.modes[mode].score.structuralScore)),
        components: Object.fromEntries(
          ['title', 'mana', 'type', 'rules', 'frame', 'art', 'credits', 'stats'].map((k) => [
            k,
            {
              cards: ranked.filter((r) => r.modes[mode].score.components[k]?.score != null).length,
              score100:
                100 *
                mean(
                  ranked
                    .map((r) => r.modes[mode].score.components[k]?.score)
                    .filter((x) => x != null),
                ),
            },
          ]),
        ),
        improved: ranked.filter(
          (r) => r.modes[mode].score.structuralScore > r.modes.current.score.structuralScore,
        ).length,
        regressed: ranked.filter(
          (r) => r.modes[mode].score.structuralScore < r.modes.current.score.structuralScore,
        ).length,
      },
    ]),
  );
  await writeJson(path.join(out, 'study.json'), {
    schema: 1,
    set: inputs.set,
    status: 'complete-exploratory',
    scope:
      'Deterministic development pilot. Native current controls replay exactly. Fourth-layout retains exact frame sources and art rectangles;fourth-frame-layout additionally tries available Fourth source-bound frames/pigment. Printing identity,Original words,scan-reviewed types,art,copyright strings and symbol eras stay local. No target-set calibration is approved or shipped. One frozen scan-only pose per card applies to all candidates;unaccepted poses are visible but excluded from means.',
    rendererHash,
    inputHash: hash(raw[0]),
    baselineHash: hash(raw[1]),
    donorInputHash: hash(raw[2]),
    toolHash: hash(await fs.readFile(new URL(import.meta.url))),
    hooksHash: hash(await fs.readFile(new URL('./old-frame-default-hooks.mjs', import.meta.url))),
    registrationGraph: await metricSourceGraph(
      new URL('./old-frame-default-registration.mjs', import.meta.url).pathname,
    ),
    metricGraph: graph,
    policyGraph: policy,
    target,
    alignment: {
      cards: rows.length,
      accepted: ranked.length,
      rejected: rows.length - ranked.length,
    },
    summary,
    rows,
  });
  console.log(summary);
} finally {
  await session.close();
}
