import { execFileSync } from 'node:child_process';
import { link, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {
  atomicWrite,
  cacheRoot,
  fixtureRoot,
  hash,
  objectFile,
  options,
  outputRoot,
  readJson,
  referenceIdentity,
  root,
  sourceHash,
  studyFile,
  writeJson,
} from './common.mjs';
import { openBrowser } from './browser.mjs';
import { presentation } from './adapter.mjs';
import { compatibleCapture, reusableFace } from './capture-cache.mjs';
import { readPrintingText } from './printing-text.mjs';

const opts = options();
const snapshot = await readJson(path.join(cacheRoot, 'sets', opts.set + '.json'));
const printingText = await readPrintingText(snapshot);
let annotations = {};
try {
  annotations = (await readJson(studyFile(opts, 'annotations'))).cards;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const cohorts = await readJson(studyFile(opts, 'cohorts'));
const selected =
  opts.cohort === 'all'
    ? snapshot.entries
    : snapshot.entries.filter((entry) =>
        cohorts[opts.cohort === 'held-out' ? 'heldOut' : 'calibration'].includes(
          entry.card.collector_number,
        ),
      );
const entries = opts.limit ? selected.slice(0, opts.limit) : selected;
const out = path.join(outputRoot, opts.set, opts.run);
await mkdir(path.join(out, 'cards'), { recursive: true });
const session = await openBrowser(snapshot);
const results = [];
try {
  const identity = {
    rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
    fontStylesheetHash: hash(await readFile(path.join(root, 'games/magic/fonts.css'))),
    browser: await session.browser.version(),
    os: `${os.platform()} ${os.release()} ${os.arch()}`,
    snapshotIdentity: snapshot.identity,
    study: opts.study ?? null,
    components: snapshot.components,
  };
  let previous = null,
    reusedFaces = 0;
  try {
    const candidate = await readJson(path.join(out, 'capture.json'));
    if (compatibleCapture(candidate, identity)) previous = candidate;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
  }
  const previousById = new Map(previous?.results.map((r) => [r.id, r]) ?? []);
  const fontStatus = await session.page.evaluate(
    async (retro) => {
      const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
      await loadCanvasFonts();
      if (retro) {
        const { loadRetroFont } = await import('/games/magic/src/presentation/retro-font.ts');
        await loadRetroFont();
        if (
          ![...document.fonts].some(
            (f) => f.family === 'CardRenderer MTG Goudy' && f.status === 'loaded',
          )
        )
          throw Error('Required retro font did not load');
      }
      const faces = [...document.fonts].map((f) => ({
        family: f.family,
        style: f.style,
        weight: f.weight,
        status: f.status,
      }));
      if (faces.length < 5 || faces.some((f) => f.status !== 'loaded'))
        throw Error('Required fonts not loaded: ' + JSON.stringify(faces));
      return faces;
    },
    entries.some((e) => presentation(e).face.frameStyle === 'retro'),
  );
  for (const entry of entries) {
    const input = presentation(entry, annotations, printingText?.cards);
    const result = {
      id: entry.id,
      name: entry.card.name,
      collectorNumber: entry.card.collector_number,
      category: entry.category,
      source: entry.card.scryfall_uri,
      contentStatus: input.contentStatus,
      reviewedFields: input.reviewedFields,
      printingTextSource: printingText?.cards[entry.id] ? printingText.source.sha256 : null,
      cohort: input.cohort,
      inputHash: hash(JSON.stringify(input.face)),
      face: input.face,
      issue: entry.issue,
    };
    if (!entry.issue) {
      const cached = await reusableFace(
        previousById.get(entry.id),
        result,
        entry.reference.sha256,
        out,
      );
      if (cached) {
        Object.assign(result, cached);
        result.rasterProvenance = previousById.get(entry.id).rasterProvenance ?? {
          source: previous.source,
          sourceDiffHash: previous.sourceDiffHash,
          createdAt: previous.createdAt,
        };
        reusedFaces++;
      } else {
        try {
          const captured = await session.page.evaluate(async (face) => {
            const api = await import('/games/magic/src/presentation/canvas-face.ts');
            const { loadCanvasImages, canvasAssetUrls } = await import(
              '/games/magic/src/presentation/canvas-assets.ts'
            );
            const { faceFrame } = await import('/games/magic/src/presentation/special-frames.ts');
            const { profileAssets, faceSetSymbol, manaSymbolAsset } = await import(
              '/games/magic/src/presentation/assets.ts'
            );
            const { resolveCardProfile } = await import('/games/magic/src/presentation/profile.ts');
            const retro = await import('/games/magic/src/presentation/retro-frame.ts');
            const oldBorder = retro.isRetro(face);
            const output = {
              tiers: {},
              frame: oldBorder ? `retro-${retro.retroFamily(face)}` : faceFrame(face),
              layout: null,
              specialLayout: null,
              assets: {
                ...(oldBorder
                  ? {
                      frame: retro.retroFrameAsset(face),
                      boxes: retro.retroFrameAsset(face),
                      border:
                        retro.retroBorder(face) !== 'black' || retro.retroFamily(face) === 'fourth'
                          ? retro.retroBorderMask(face)
                          : null,
                      basicSymbol: retro.retroBasicSymbol(face),
                    }
                  : profileAssets(resolveCardProfile(face), faceFrame(face))),
                setSymbol: oldBorder ? retro.retroSetSymbol(face) : faceSetSymbol(face),
                mana: face.manaSymbols.map(manaSymbolAsset),
              },
            };
            // Both tiers consume the same decoded source images. Keep their lease
            // until both captures finish; composition still uses the real painter.
            const prepared = await loadCanvasImages(
              canvasAssetUrls(face),
              new AbortController().signal,
            );
            try {
              for (const tier of ['inspect', 'table']) {
                const canvas = await api.composeCardTexture(
                  { face, printingId: null, printedImage: null },
                  tier,
                  new AbortController().signal,
                  {
                    loadImages: async (urls, signal) => {
                      signal.throwIfAborted();
                      const missing = urls.filter((url) => url && !prepared.images.has(url));
                      if (missing.length) throw Error('Missing bitmaps: ' + missing.join(', '));
                      return { images: prepared.images, dispose() {} };
                    },
                  },
                );
                output.tiers[tier] = {
                  data: canvas.toDataURL('image/png'),
                  width: canvas.width,
                  height: canvas.height,
                };
                if (tier === 'inspect' && api.ordinaryTextLayout && output.frame === 'normal')
                  output.layout = api.ordinaryTextLayout(canvas.getContext('2d'), face);
                if (tier === 'inspect' && output.frame.startsWith('planeswalker')) {
                  const { planeswalkerRuleRows } = await import(
                    '/games/magic/src/presentation/planeswalker-rules.ts'
                  );
                  output.specialLayout = planeswalkerRuleRows(canvas.getContext('2d'), face);
                }
                if (tier === 'inspect' && oldBorder) {
                  const layout =
                    api.retroTextLayout ??
                    (await import('/games/magic/tools/accuracy/legacy-retro-layout.mjs'))
                      .legacyRetroLayout;
                  output.layout = layout(canvas.getContext('2d'), face);
                }
                canvas.width = canvas.height = 0;
              }
            } finally {
              prepared.dispose();
            }
            return output;
          }, input.face);
          result.frame = captured.frame;
          result.layout = captured.layout;
          result.specialLayout = captured.specialLayout;
          result.assets = captured.assets;
          result.images = {};
          for (const [tier, capture] of Object.entries(captured.tiers)) {
            const file = `cards/${entry.id}.${tier}.png`;
            const bytes = Buffer.from(capture.data.split(',')[1], 'base64');
            await atomicWrite(path.join(out, file), bytes);
            result.images[tier] = {
              file,
              width: capture.width,
              height: capture.height,
              sha256: hash(bytes),
            };
          }
          const file = `cards/${entry.id}.reference.png`;
          try {
            await link(objectFile(entry.reference), path.join(out, file));
          } catch (error) {
            if (error.code === 'EEXIST') {
              if (hash(await readFile(path.join(out, file))) !== entry.reference.sha256)
                await atomicWrite(
                  path.join(out, file),
                  await readFile(objectFile(entry.reference)),
                );
            } else if (error.code === 'EXDEV')
              await atomicWrite(path.join(out, file), await readFile(objectFile(entry.reference)));
            else throw error;
          }
          result.images.reference = { file, sha256: entry.reference.sha256 };
        } catch (error) {
          result.issue = String(error);
        }
      }
    }
    results.push(result);
    if (results.length % 20 === 0 || results.length === entries.length)
      console.log(
        `Captured ${results.length}/${entries.length}; reused ${reusedFaces}; failures ${results.filter((r) => r.issue).length}`,
      );
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  if (
    identity.rendererHash !== (await sourceHash(path.join(root, 'games/magic/src'))) ||
    identity.fontStylesheetHash !== hash(await readFile(path.join(root, 'games/magic/fonts.css')))
  )
    throw Error('Renderer or fonts changed during capture; no capture manifest published');
  const source = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const diff = execFileSync('git', ['diff', '--', 'games/magic/src', 'games/magic/fonts.css'], {
    cwd: root,
  });
  await writeJson(path.join(out, 'capture.json'), {
    schemaVersion: 1,
    set: opts.set,
    run: opts.run,
    study: opts.study ?? null,
    cohortHash: hash(JSON.stringify(cohorts)),
    createdAt: new Date().toISOString(),
    source,
    sourceDiffHash: hash(diff),
    rendererHash: identity.rendererHash,
    fontStylesheetHash: identity.fontStylesheetHash,
    browser: identity.browser,
    reusedFaces,
    os: identity.os,
    fonts: fontStatus,
    components: snapshot.components,
    snapshotIdentity: snapshot.identity,
    referenceIdentity: referenceIdentity(snapshot.entries),
    annotationHash: hash(JSON.stringify(annotations)),
    printingTextSource: printingText?.source ?? null,
    eligibleCount: snapshot.eligibleCount,
    totalPrintings: snapshot.totalPrintings,
    excluded: snapshot.excluded,
    complete: opts.cohort === 'all' && !opts.limit && snapshot.complete,
    results,
  });
} finally {
  await session.close();
}
console.log(`Offline capture saved to ${path.relative(root, out)}`);
if (results.some((r) => r.issue)) process.exitCode = 1;
