// Text-only shared body trials using the production layout and painter.
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { cachedFetch } from './cache.mjs';
import { hash, sourceHash, root, objectFile, writeJson } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
const [inputFile, poseFile, exportedFile, nativeDirectory, profileFile, definitionFile, out] =
  process.argv.slice(2);
assert(out, 'Use INPUTS POSES EXPORTED_INPUTS NATIVE_DIRECTORY PROFILE DEFINITION NEW_OUTPUT');
const toolHash = hash(await fs.readFile(new URL(import.meta.url)));
const dependencyFiles = [
  'text-filled-objective.mjs',
  'edges.mjs',
  'abu-type-objective.mjs',
  'pixels-pure.mjs',
  'scan-transform.mjs',
  'abu-assets.mjs',
  'browser.mjs',
];
const dependencyHashes = async () =>
  Object.fromEntries(
    await Promise.all(
      dependencyFiles.map(async (file) => [
        file,
        hash(await fs.readFile(new URL(file, import.meta.url))),
      ]),
    ),
  );
const dependencies = await dependencyHashes();
const raw = await Promise.all(
  [
    inputFile,
    poseFile,
    exportedFile,
    path.join(nativeDirectory, 'capture.json'),
    profileFile,
    definitionFile,
  ].map((f) => fs.readFile(f)),
);
const [input, poses, exported, capture, profile, definition] = raw.map((b) => JSON.parse(b));
assert(['mir', 'ons'].includes(input.set));
assert.equal(poses.inputHash, hash(raw[0]));
assert.equal(capture.source.inputHash, hash(raw[0]));
assert(capture.complete && !capture.faults.length);
const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
assert.equal(capture.source.rendererHash, rendererHash);
assert.deepEqual(definition.candidates[0], { id: 'current' });
assert(
  definition.candidates.length <= 100 &&
    new Set(definition.candidates.map((c) => c.id)).size === definition.candidates.length,
);
const profileHash = hash(JSON.stringify(profile));
const extra = [];
for (const url of new Set(Object.values(profile.colors).map((c) => JSON.parse(c.source)[0])))
  extra.push(await cachedFetch(url, { offline: true }));
const manifest = JSON.parse(await fs.readFile(path.join(root, 'games/magic/assets.json')));
for (const suffix of ['old/abu/border.svg', 'old/fourth/borderBlack.png'])
  extra.push(await cachedFetch(manifest.RETRO_ROOT + '/img/frames/' + suffix, { offline: true }));
const module = 'games/magic/src/calibration/profiles.ts',
  sources = {};
const session = await openBrowser(
  { ...input, components: [...input.components, ...extra] },
  {
    plugins: [
      {
        name: 'old-frame-body-native-trials',
        enforce: 'pre',
        transform(code, id) {
          let after = code;
          if (id.endsWith('/' + module)) {
            const needle =
              'return profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;';
            assert.equal(code.split(needle).length, 2);
            after = code.replace(
              needle,
              'return (globalThis as any).__bodyProfile?.set === set ? (globalThis as any).__bodyProfile : profileSets.includes(set) ? setCalibrationProfiles[set] : undefined;',
            );
          } else if (id.endsWith('/games/magic/src/presentation/retro-rules.ts')) {
            const needle =
              'export function retroTextLayout(context: CanvasContext, face: RenderedCardInput) {';
            assert.equal(code.split(needle).length, 2);
            after = code.replace(
              needle,
              'export function retroTextLayout(context: CanvasContext, face: RenderedCardInput) { return withRulesLayoutRequests(context, () => bodyStudyRetroTextLayout(context, face)); }\nfunction bodyStudyRetroTextLayout(context: CanvasContext, face: RenderedCardInput) {',
            );
          } else if (id.endsWith('/games/magic/src/presentation/rules-paint.ts')) {
            const needle = '  if (!rulesInkVisible(context)) return;';
            assert.equal(code.split(needle).length, 2);
            after = code.replace(
              needle,
              '  if ((globalThis as any).__bodyCapture?.(context, layout, images, paintSymbol, inkInsetEm, color)) return;\n' +
                needle,
            );
          } else return;
          sources[id.slice(id.indexOf('/games/') + 1)] = { before: hash(code), after: hash(after) };
          return after;
        },
      },
    ],
  },
);
const rows = [];
try {
  await session.page.evaluate(async (profile) => {
    await import('/games/magic/src/data/eager.ts');
    await import('/games/magic/src/data/eager-wording.ts');
    globalThis.__bodyProfile = profile;
  }, profile);
  let entries = input.entries.filter(
    (e) => e.material !== 'L' && poses.rows.find((r) => r.id === e.id)?.accepted,
  );
  if (definition.maximumPerCohort) {
    const selected = [];
    for (const key of new Set(entries.map((e) => e.material)))
      for (const cohort of ['calibration', 'validation']) {
        const group = entries.filter(
          (e) => e.material === key && exported.rows.find((r) => r.id === e.id).cohort === cohort,
        );
        // Frozen, evenly spaced name-hash ranks cover short and long names without score-based selection.
        group.sort((a, b) => hash(a.name.toLowerCase()).localeCompare(hash(b.name.toLowerCase())));
        for (let i = 0; i < Math.min(group.length, definition.maximumPerCohort); i++)
          selected.push(
            group[
              Math.floor(
                ((i + 0.5) * group.length) / Math.min(group.length, definition.maximumPerCohort),
              )
            ],
          );
      }
    entries = selected;
  }
  for (const e of entries) {
    const pose = poses.rows.find((r) => r.id === e.id),
      n = capture.rows.find((r) => r.id === e.id),
      cohort = exported.rows.find((r) => r.id === e.id).cohort;
    assert.equal(n.inputHash, hash(JSON.stringify(e.face)));
    assert.equal(n.profileHash, profileHash);
    const b = await fs.readFile(objectFile(e.reference));
    assert.equal(hash(b), e.reference.sha256);
    const scan = normalize(PNG.sync.read(b), pose.transform);
    const scanPng = PNG.sync.write({ width: 488, height: 680, data: Buffer.from(scan.data) });
    const result = await session.page.evaluate(
      async ({ e, url, candidates }) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { canvasAssetUrls } = await import('/games/magic/src/presentation/canvas-assets.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const { paintRulesLayout } = await import('/games/magic/src/presentation/rules-paint.ts');
        const { calibratedBodyLayout } = await import('/games/magic/src/calibration/body.ts');
        const { adjustCalibrationRules } = await import(
          '/games/magic/src/calibration/rules-adjustment.ts'
        );
        const { layoutRules, rulesLayoutRequest, withRulesLayoutRequests } = await import(
          '/games/magic/src/presentation/rules-layout.ts'
        );
        const { wordingParagraphs } = await import('/games/magic/src/presentation/wording.ts');
        const { TextFilledObjective } = await import(
          '/games/magic/tools/accuracy/text-filled-objective.mjs'
        );
        const { nativeGrayCrop } = await import(
          '/games/magic/tools/accuracy/abu-type-objective.mjs'
        );
        const { cropGray } = await import('/games/magic/tools/accuracy/pixels-pure.mjs');
        const signal = new AbortController().signal,
          lease = await loadAccuracyImages(canvasAssetUrls(e.face), signal, e.face.illustration);
        let full, body;
        try {
          globalThis.__bodyCapture = (context, layout, images, ...args) => {
            body = {
              layout,
              images,
              args,
              transform: context.getTransform(),
              properties: Object.fromEntries(
                [
                  'imageSmoothingEnabled',
                  'imageSmoothingQuality',
                  'fontKerning',
                  'textRendering',
                  'font',
                  'letterSpacing',
                  'fillStyle',
                  'textAlign',
                  'textBaseline',
                  'shadowColor',
                  'shadowBlur',
                  'shadowOffsetX',
                  'shadowOffsetY',
                  'globalAlpha',
                  'globalCompositeOperation',
                  'filter',
                ].map((k) => [k, context[k]]),
              ),
            };
            return false;
          };
          full = await composeCardTexture(
            { face: e.face, printingId: e.id, printedImage: null },
            'inspect',
            signal,
            { loadImages: async () => ({ ...lease, dispose() {} }) },
          );
          delete globalThis.__bodyCapture;
          const baseline = full.toDataURL().split(',')[1];
          if (!body) return { baseline, empty: true, trials: [] };
          const rect = [58, 410, 374, 196],
            origin = [85, 613],
            size = [564, 297];
          const sc = document.createElement('canvas');
          sc.width = 488;
          sc.height = 680;
          const image = new Image();
          image.src = url;
          await image.decode();
          sc.getContext('2d').drawImage(image, 0, 0);
          const gray = cropGray(sc.getContext('2d').getImageData(0, 0, 488, 680), rect).gray;
          const mask = new Uint8Array(rect[2] * rect[3]);
          for (let y = 1; y < rect[3] - 2; y++)
            for (let x = 3; x < rect[2] - 3; x++) mask[y * rect[2] + x] = 1;
          const objective = new TextFilledObjective(gray, rect[2], rect[3], mask);
          const out = document.createElement('canvas');
          out.width = 732;
          out.height = 1020;
          const c = out.getContext('2d', { willReadFrequently: true }),
            trials = [],
            memo = new Map();
          const paragraphs = wordingParagraphs({
            rulesText: e.face.rulesText ?? '',
            rulesParagraphs: e.face.rulesParagraphs,
          });
          const reference =
            e.face.rulesAlignment?.mode === 'auto'
              ? (e.face.rulesAlignment.reference ?? paragraphs)
              : paragraphs;
          const text = (l) =>
            l.lines
              .flatMap((r) => r.runs.map((r) => r.text))
              .join('')
              .replace(/[\s\u00ad]/g, '');
          const expected = text(body.layout);
          for (const candidate of candidates) {
            c.resetTransform();
            c.clearRect(0, 0, 732, 1020);
            c.fillStyle = '#eee';
            c.fillRect(0, 0, 732, 1020);
            Object.assign(c, body.properties);
            c.setTransform(body.transform);
            let layout;
            if (candidate.id === 'current') layout = body.layout;
            else if (candidate.body)
              layout = calibratedBodyLayout(c, e.face, candidate.body, paragraphs, reference);
            else if (candidate.baselineScale !== undefined || candidate.translate) {
              const factor = candidate.baselineScale ?? 1;
              const [dx, dy] = candidate.translate ?? [0, 0];
              if (
                !Number.isFinite(factor) ||
                factor < 0.9 ||
                factor > 1.1 ||
                ![dx, dy].every((v) => Number.isFinite(v) && Math.abs(v) <= 8)
              )
                throw Error('Invalid retained-wrap placement trial');
              const first = body.layout.lines[0]?.baseline ?? 0;
              const last = body.layout.lines.at(-1)?.baseline ?? first;
              const added = (last - first) * (factor - 1);
              const offset = (b) => (b - first) * (factor - 1) - added / 2 + dy;
              layout = {
                ...body.layout,
                x: body.layout.x + dx,
                top: body.layout.top - added / 2 + dy,
                height: body.layout.height + added,
                lines: body.layout.lines.map((line) => {
                  const shift = offset(line.baseline);
                  return {
                    ...line,
                    ...(line.x === undefined ? {} : { x: line.x + dx }),
                    baseline: line.baseline + shift,
                    inkBounds: [
                      line.inkBounds[0] + dx,
                      line.inkBounds[1] + shift,
                      ...line.inkBounds.slice(2),
                    ],
                  };
                }),
                separators: body.layout.separators.map((y) => y + offset(y)),
              };
              if (layout.top < 412 || layout.top + layout.height > 603) layout.overflow = true;
            } else {
              const priorProfile = globalThis.__bodyProfile;
              globalThis.__bodyProfile = {
                ...priorProfile,
                rulesAdjustments: { default: candidate.adjustment },
              };
              try {
                layout = withRulesLayoutRequests(c, () => {
                  let original = body.layout;
                  if (candidate.fractionalMetrics !== undefined) {
                    const request = rulesLayoutRequest(original);
                    if (!request) throw Error('Missing captured native layout request');
                    original = layoutRules(
                      c,
                      request.paragraphs,
                      request.bounds,
                      request.maximumSize,
                      request.minimumSize,
                      { ...request.typography, fractionalMetrics: candidate.fractionalMetrics },
                    );
                  }
                  return adjustCalibrationRules(c, e.face, original);
                });
              } finally {
                globalThis.__bodyProfile = priorProfile;
              }
            }
            if (!layout || layout.overflow || text(layout) !== expected) {
              trials.push({ id: candidate.id, invalid: true });
              continue;
            }
            const signature = JSON.stringify(layout);
            if (memo.has(signature)) {
              trials.push({ ...memo.get(signature), id: candidate.id });
              continue;
            }
            paintRulesLayout(c, layout, body.images, ...body.args);
            c.resetTransform();
            const raster = c.getImageData(origin[0], origin[1], size[0], size[1]);
            const score = objective.score(nativeGrayCrop(raster, rect, origin));
            const observation = {
              id: candidate.id,
              ...score,
              size: layout.size,
              lines: layout.lines.length,
              x: layout.x,
              width: layout.width,
              top: layout.top,
              height: layout.height,
              rows: layout.lines.map((l) => l.runs.map((r) => r.text).join('')),
            };
            memo.set(signature, observation);
            trials.push(observation);
          }
          out.width = out.height = sc.width = sc.height = 0;
          return { baseline, trials, rasterMeasurements: memo.size };
        } finally {
          delete globalThis.__bodyCapture;
          if (full) full.width = full.height = 0;
          lease.dispose();
        }
      },
      {
        e,
        url: 'data:image/png;base64,' + scanPng.toString('base64'),
        candidates: definition.candidates,
      },
    );
    assert.equal(
      hash(Buffer.from(result.baseline, 'base64')),
      n.sha256,
      'Native body control changed: ' + e.name,
    );
    rows.push({
      id: e.id,
      name: e.name,
      material: e.material,
      cohort,
      referenceHash: e.reference.sha256,
      nativeHash: n.sha256,
      inputHash: n.inputHash,
      ...Object.fromEntries(Object.entries(result).filter(([k]) => k !== 'baseline')),
    });
    if (rows.length % 10 === 0) console.log(input.set, rows.length, '/', entries.length);
  }
  assert.deepEqual(session.faults, []);
  assert.equal(rendererHash, await sourceHash(path.join(root, 'games/magic/src')));
  assert.equal(toolHash, hash(await fs.readFile(new URL(import.meta.url))));
  assert.deepEqual(await dependencyHashes(), dependencies);
  await writeJson(out, {
    schema: 1,
    status: 'text-only-shared-body-candidates-not-adopted',
    set: input.set,
    source: {
      rendererHash,
      inputHash: hash(raw[0]),
      poseHash: hash(raw[1]),
      exportedHash: hash(raw[2]),
      nativeHash: hash(raw[3]),
      profileHash: hash(raw[4]),
      definitionHash: hash(raw[5]),
      toolHash,
      dependencies,
      sources,
    },
    scope:
      'Frozen frame-normalized Original text, identical native controls, and production layout/filled-font painting. Candidate text is painted on a flat neutral field to keep frame/paper differences out of the search objective. A fixed interior mask and symmetric edge plus filled-ink overlap score all candidates. Calibration selects shared values; validation names remain separate. Actual full-native replay remains required; this is not the published whole-card metric.',
    rows,
    faults: session.faults,
  });
} finally {
  await session.close();
}
