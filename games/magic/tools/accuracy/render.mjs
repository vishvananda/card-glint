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
  writeJson,
} from './common.mjs';
import { openBrowser } from './browser.mjs';
import { presentation } from './adapter.mjs';

const opts = options();
const snapshot = await readJson(path.join(cacheRoot, 'sets', opts.set + '.json'));
let annotations = {};
try {
  annotations = (await readJson(path.join(fixtureRoot, opts.set, 'annotations.json'))).cards;
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
const cohorts = await readJson(path.join(fixtureRoot, opts.set, 'cohorts.json'));
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
  const fontStatus = await session.page.evaluate(async () => {
    const { loadCanvasFonts } = await import('/games/magic/src/presentation/canvas-assets.ts');
    await loadCanvasFonts();
    const faces = [...document.fonts].map((f) => ({
      family: f.family,
      style: f.style,
      weight: f.weight,
      status: f.status,
    }));
    if (faces.length < 5 || faces.some((f) => f.status !== 'loaded'))
      throw Error('Required fonts not loaded: ' + JSON.stringify(faces));
    return faces;
  });
  for (const entry of entries) {
    const input = presentation(entry, annotations);
    const result = {
      id: entry.id,
      name: entry.card.name,
      collectorNumber: entry.card.collector_number,
      category: entry.category,
      source: entry.card.scryfall_uri,
      contentStatus: input.contentStatus,
      cohort: input.cohort,
      inputHash: hash(JSON.stringify(input.face)),
      face: input.face,
      issue: entry.issue,
    };
    if (!entry.issue) {
      try {
        const captured = await session.page.evaluate(async (face) => {
          const api = await import('/games/magic/src/presentation/canvas-face.ts');
          const { loadCanvasImages } = await import(
            '/games/magic/src/presentation/canvas-assets.ts'
          );
          const { faceFrame } = await import('/games/magic/src/presentation/special-frames.ts');
          const { profileAssets, faceSetSymbol, manaSymbolAsset } = await import(
            '/games/magic/src/presentation/assets.ts'
          );
          const { resolveCardProfile } = await import('/games/magic/src/presentation/profile.ts');
          const output = {
            tiers: {},
            frame: faceFrame(face),
            layout: null,
            assets: {
              ...profileAssets(resolveCardProfile(face), faceFrame(face)),
              setSymbol: faceSetSymbol(face),
              mana: face.manaSymbols.map(manaSymbolAsset),
            },
          };
          for (const tier of ['inspect', 'table']) {
            const canvas = await api.composeCardTexture(
              { face, printingId: null, printedImage: null },
              tier,
              new AbortController().signal,
              {
                loadImages: async (urls, signal) => {
                  const loaded = await loadCanvasImages(urls, signal);
                  const missing = urls.filter((url) => url && !loaded.images.has(url));
                  if (missing.length) {
                    loaded.dispose();
                    throw Error('Missing bitmaps: ' + missing.join(', '));
                  }
                  return loaded;
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
            canvas.width = canvas.height = 0;
          }
          return output;
        }, input.face);
        result.frame = captured.frame;
        result.layout = captured.layout;
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
              await atomicWrite(path.join(out, file), await readFile(objectFile(entry.reference)));
          } else if (error.code === 'EXDEV')
            await atomicWrite(path.join(out, file), await readFile(objectFile(entry.reference)));
          else throw error;
        }
        result.images.reference = { file, sha256: entry.reference.sha256 };
      } catch (error) {
        result.issue = String(error);
      }
    }
    results.push(result);
    if (results.length % 20 === 0 || results.length === entries.length)
      console.log(
        `Rendered ${results.length}/${entries.length}; failures ${results.filter((r) => r.issue).length}`,
      );
  }
  if (session.faults.length) throw Error(session.faults.join('\n'));
  const source = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
  const diff = execFileSync('git', ['diff', '--', 'games/magic/src', 'games/magic/fonts.css'], {
    cwd: root,
  });
  await writeJson(path.join(out, 'capture.json'), {
    schemaVersion: 1,
    set: opts.set,
    run: opts.run,
    createdAt: new Date().toISOString(),
    source,
    sourceDiffHash: hash(diff),
    rendererHash: await sourceHash(path.join(root, 'games/magic/src')),
    fontStylesheetHash: hash(await readFile(path.join(root, 'games/magic/fonts.css'))),
    browser: await session.browser.version(),
    os: `${os.platform()} ${os.release()} ${os.arch()}`,
    fonts: fontStatus,
    components: snapshot.components,
    snapshotIdentity: snapshot.identity,
    referenceIdentity: referenceIdentity(snapshot.entries),
    annotationHash: hash(JSON.stringify(annotations)),
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
