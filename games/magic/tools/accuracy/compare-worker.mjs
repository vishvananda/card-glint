import { parentPort } from 'node:worker_threads';
import { access, readFile } from 'node:fs/promises';
import path from 'node:path';
import { PNG } from 'pngjs';
import { cropGray, normalize, savePng } from './pixels.mjs';
import { alignmentDiagnostic, frameFamily, IDENTITY } from './alignment.mjs';
import { compareRegion } from './metrics.mjs';
import { inkEdges } from './edges.mjs';
import { regions } from './regions.mjs';
import { hash, readJson, writeJson } from './common.mjs';

const mean = (values) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : null);

parentPort.on('message', async ({ index, result, runRoot, profile, metricSource }) => {
  try {
    if (result.issue) {
      parentPort.postMessage({ index, result });
      return;
    }
    const buffers = {};
    for (const [tier, asset] of Object.entries(result.images)) {
      const bytes = await readFile(path.join(runRoot, asset.file));
      if (hash(bytes) !== asset.sha256) throw Error(`Capture checksum mismatch: ${tier}`);
      buffers[tier] = bytes;
    }
    const cacheKey = hash(JSON.stringify({ result, profile, metricSource }));
    const cacheFile = path.join(runRoot, 'comparisons', result.id + '.json');
    try {
      const cached = await readJson(cacheFile);
      if (cached.key === cacheKey) {
        await Promise.all(
          Object.values(cached.result.previews).map((file) => access(path.join(runRoot, file))),
        );
        parentPort.postMessage({ index, result: cached.result, cached: true });
        return;
      }
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
    const source = PNG.sync.read(buffers.reference, { checkCRC: true });
    const rawReference = normalize(source);
    const family = frameFamily(result),
      calibration = profile.frameFamilies[family];
    const transform = calibration?.transform ?? IDENTITY;
    const identity = Object.keys(IDENTITY).every((key) => transform[key] === IDENTITY[key]);
    const reference = identity ? rawReference : normalize(source, transform);
    const selected = regions(result);
    const comparisons = {};
    const overlay = { width: 488, height: 680, data: new Uint8Array(488 * 680 * 4) };
    for (let i = 0; i < overlay.data.length; i += 4) {
      overlay.data[i] = overlay.data[i + 1] = overlay.data[i + 2] = 25;
      overlay.data[i + 3] = 255;
    }
    let diagnostic;
    for (const tier of ['inspect', 'table']) {
      const rendered = normalize(PNG.sync.read(buffers[tier], { checkCRC: true }));
      const measured = selected.map((region) => {
        const a = cropGray(reference, region.rect),
          b = cropGray(rendered, region.rect);
        const metrics = compareRegion(a.gray, b.gray, a.width, a.height, region.lightInk);
        if (tier === 'inspect') {
          const original = cropGray(rawReference, region.rect);
          metrics.rawEdgeF1 = identity
            ? (metrics.edgeF1 ?? null)
            : (compareRegion(original.gray, b.gray, a.width, a.height, region.lightInk).edgeF1 ??
              null);
          const ae = inkEdges(a.gray, a.width, a.height, region.lightInk).edges;
          const be = inkEdges(b.gray, b.width, b.height, region.lightInk).edges;
          for (let y = 0; y < a.height; y++)
            for (let x = 0; x < a.width; x++) {
              const i = y * a.width + x,
                p = ((y + region.rect[1]) * 488 + x + region.rect[0]) * 4;
              if (ae[i] || be[i]) {
                overlay.data[p] = be[i] ? 255 : 0;
                overlay.data[p + 1] = ae[i] ? 235 : 0;
                overlay.data[p + 2] = 255;
              }
            }
        }
        return { ...region, ...metrics };
      });
      const text = measured.filter((r) => r.kind === 'text' && r.edgeF1);
      comparisons[tier] = {
        regions: measured,
        textEdgeF1: mean(text.map((r) => r.edgeF1[1])),
        rawTextEdgeF1:
          tier === 'inspect'
            ? mean(text.filter((r) => r.rawEdgeF1).map((r) => r.rawEdgeF1[1]))
            : null,
        assetEdgeF1: mean(
          measured.filter((r) => r.kind === 'asset' && r.edgeF1).map((r) => r.edgeF1[1]),
        ),
        missingInk: measured.filter((r) => r.status === 'missing-ink').map((r) => r.id),
      };
      if (tier === 'inspect') {
        diagnostic = alignmentDiagnostic(reference, rendered, family, result.face);
        await savePng(path.join(runRoot, `cards/${result.id}.normalized.png`), rendered);
      }
    }
    await savePng(path.join(runRoot, `cards/${result.id}.aligned.png`), reference);
    await savePng(path.join(runRoot, `cards/${result.id}.edges.png`), overlay);
    const measured = {
      ...result,
      comparisons,
      normalization: rawReference.normalization,
      alignment: {
        family,
        status: calibration?.status ?? 'identity-unconfigured',
        transform,
        ...diagnostic,
        uncertain:
          diagnostic.uncertain ||
          !calibration ||
          !['calibrated', 'identity-frame-validation'].includes(calibration.status),
      },
      clipping: result.layout ? Boolean(result.layout.overflow) : null,
      previews: {
        reference: `cards/${result.id}.aligned.png`,
        rendered: `cards/${result.id}.normalized.png`,
        edges: `cards/${result.id}.edges.png`,
      },
    };
    await writeJson(cacheFile, { key: cacheKey, result: measured });
    parentPort.postMessage({ index, result: measured, cached: false });
  } catch (error) {
    parentPort.postMessage({
      index,
      result: { ...result, issue: `Comparison failed: ${error.stack}` },
    });
  }
});
