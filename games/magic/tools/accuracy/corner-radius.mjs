import { PNG } from 'pngjs';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { hash, objectFile, readJson, writeJson } from './common.mjs';
import { median } from './metrics.mjs';

/** Reference-alpha diagnostic. Repeated digital cutouts are one observation,
 * regardless of how many scans use them. No pigment or internal frame fit. */
export function measureCornerRadius(image) {
  const { width: w, height: h, data } = image;
  const alpha = Buffer.from(Array.from({ length: w * h }, (_, i) => data[i * 4 + 3]));
  const edge = (length, sample) => {
    for (let i = 0; i < length; i++) if (sample(i) >= 128) return i;
    throw Error('No opaque stock edge');
  };
  const left = [],
    right = [],
    top = [],
    bottom = [];
  for (let y = Math.ceil(h * 0.12); y < h * 0.88; y++) {
    left.push(edge(w, (x) => alpha[y * w + x]) - 0.5);
    right.push(w - edge(w, (x) => alpha[y * w + w - 1 - x]) - 0.5);
  }
  for (let x = Math.ceil(w * 0.12); x < w * 0.88; x++) {
    top.push(edge(h, (y) => alpha[y * w + x]) - 0.5);
    bottom.push(h - edge(h, (y) => alpha[(h - 1 - y) * w + x]) - 0.5);
  }
  const box = [median(left), median(top), median(right), median(bottom)];
  const width = box[2] - box[0],
    samples = [];
  for (const [x, y, sx, sy] of [
    [box[0], box[1], 1, 1],
    [box[2], box[1], -1, 1],
    [box[0], box[3], 1, -1],
    [box[2], box[3], -1, -1],
  ]) {
    for (let py = Math.max(0, Math.floor(y - width * 0.1)); py < Math.min(h, y + width * 0.1); py++)
      for (
        let px = Math.max(0, Math.floor(x - width * 0.1));
        px < Math.min(w, x + width * 0.1);
        px++
      ) {
        const dx = ((px - x) * sx) / width,
          dy = ((py - y) * sy) / width;
        if (dx >= 0 && dy >= 0 && dx < 0.085 && dy < 0.085)
          samples.push([dx, dy, alpha[py * w + px] / 255]);
      }
  }
  if (!samples.some(([, , a]) => a < 0.5)) throw Error('No transparent corner cutout');
  const loss = (radius) =>
    samples.reduce((sum, [x, y, a]) => {
      const distance = Math.hypot(Math.max(radius - x, 0), Math.max(radius - y, 0)) - radius;
      return sum + Math.abs(Math.max(0, Math.min(1, 0.5 - distance * width)) - a);
    }, 0) / samples.length;
  const curve = Array.from({ length: 281 }, (_, i) => {
    const radius = (80 + i) / 4000;
    return { radius, alphaMAE: loss(radius) };
  });
  const best = curve.reduce((a, b) => (a.alphaMAE < b.alphaMAE ? a : b));
  return {
    alphaHash: hash(alpha),
    box,
    best,
    proposed: { radius: 0.045, alphaMAE: loss(0.045) },
    previous: { radius: 0.058, alphaMAE: loss(0.058) },
  };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const [input, output] = process.argv.slice(2);
  if (!input || !output) throw Error('Usage: node corner-radius.mjs INPUT.json OUTPUT.json');
  const source = await readJson(input),
    entries = Array.isArray(source) ? source : (source.entries ?? source.rows);
  if (!Array.isArray(entries)) throw Error('Expected a snapshot or array of reference identities');
  const rows = [];
  for (const entry of entries) {
    const asset = entry.reference ?? { ...entry, sha256: entry.sha256 ?? entry.referenceHash };
    if (!asset.sha256) continue;
    const bytes = await readFile(objectFile(asset));
    if (hash(bytes) !== asset.sha256) throw Error('Reference hash mismatch');
    rows.push({
      id: entry.id,
      set: entry.card?.set ?? entry.set,
      name: entry.card?.name ?? entry.name,
      referenceHash: asset.sha256,
      ...measureCornerRadius(PNG.sync.read(bytes, { checkCRC: true })),
    });
  }
  await writeJson(output, {
    schema: 1,
    methodHash: hash(await readFile(new URL(import.meta.url))),
    inputHash: hash(await readFile(input)),
    note: 'Reference alpha only; digital masks are not independent physical die measurements. Do not use this fit to certify interior frame geometry.',
    rows,
  });
  console.log(
    `${rows.length} scans, ${new Set(rows.map((r) => r.alphaHash)).size} distinct alpha masks`,
  );
}
