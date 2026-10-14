import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PNG } from 'pngjs';
import { readJson, cacheRoot, outputRoot, hash } from './common.mjs';
import { normalize } from './pixels-pure.mjs';
import { oldFrameTarget, normalizeOldFrame } from './old-frame-normalization.mjs';
/** Exact source stock targets, shared with color analysis. No text/symbol anchors. */
export async function loadOldStockTargets() {
  const sources = await readJson(cacheRoot + '/rollout/old-frame-templates.json');
  const templates = await readJson(cacheRoot + '/rollout/old-dual-hsb-templates.json');
  const targets = new Map();
  for (const t of templates.rows) {
    const bytes = await readFile(outputRoot + '/old-dual-hsb/templates/' + t.file);
    const mask = await readFile(outputRoot + '/old-dual-hsb/templates/' + t.geometryFile);
    assert.equal(hash(bytes), t.sha256);
    assert.equal(hash(mask), t.geometryHash);
    const source = sources.rows.find((s) => s.key === t.key);
    targets.set(source.url + '/' + t.border, {
      target: oldFrameTarget(
        normalize(PNG.sync.read(bytes)),
        normalize(PNG.sync.read(mask)),
        t.border,
      ),
      identity: hash(JSON.stringify(t)),
      sourceHash: source.asset.sha256,
    });
  }
  return (reference, row, border) => {
    const source = row.components.find((c) => targets.has(c.url + '/' + border));
    if (!source) return null;
    const t = targets.get(source.url + '/' + border);
    assert.equal(source.sha256, t.sourceHash);
    return { ...normalizeOldFrame(reference, t.target, border), stockTargetHash: t.identity };
  };
}
