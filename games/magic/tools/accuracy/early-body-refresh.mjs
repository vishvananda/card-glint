// Refresh changed original body inputs and reuse only identical native recipes.
import assert from 'node:assert/strict';
import path from 'node:path';
import { readFile, writeFile, mkdir, symlink } from 'node:fs/promises';
import { isDeepStrictEqual } from 'node:util';
import { PNG } from 'pngjs';
import { openBrowser } from './browser.mjs';
import { hash, sourceHash, root, writeJson } from './common.mjs';

const [mode, ...args] = process.argv.slice(2);
assert(
  ['prepare', 'merge'].includes(mode),
  'Usage: early-body-refresh.mjs prepare OLD_NATIVE CURRENT_INPUTS OUT | merge OLD_MATRIX PARTIAL_MATRIX REFRESHED_NATIVE OUTPUT [OLD_IMAGES PARTIAL_IMAGES OUT_IMAGES]',
);
const read = async (file) => {
  const bytes = await readFile(file);
  return { bytes, data: JSON.parse(bytes) };
};
const toolHash = hash(await readFile(new URL(import.meta.url)));
const link = async (source, target) => {
  await mkdir(path.dirname(target), { recursive: true });
  await symlink(path.relative(path.dirname(target), source), target);
};
const canonical = (value) =>
  Array.isArray(value)
    ? value.map(canonical)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((k) => [k, canonical(value[k])]),
        )
      : value;

if (mode === 'prepare') {
  const [beforeDirectory, currentFile, outArg] = args;
  assert(outArg);
  const out = path.resolve(outArg),
    beforeRoot = path.resolve(beforeDirectory);
  const old = await read(path.join(beforeRoot, 'capture.json')),
    snapshot = await read(path.join(beforeRoot, 'inputs.json')),
    current = await read(currentFile);
  const rendererHash = await sourceHash(path.join(root, 'games/magic/src'));
  assert.equal(rendererHash, old.data.source.rendererHash);
  assert.equal(snapshot.data.source.rendererHash, rendererHash);
  assert.equal(current.data.entries.length, snapshot.data.entries.length);
  assert.deepEqual(
    current.data.entries.map((e) => e.id).sort(),
    snapshot.data.entries.map((e) => e.id).sort(),
  );
  const assets = new Map(snapshot.data.components.map((c) => [c.url, c.sha256]));
  for (const asset of current.data.components)
    assert.equal(assets.get(asset.url), asset.sha256, 'Changed source/font: ' + asset.url);
  const changed = [],
    entries = [],
    decisions = [];
  for (const prior of snapshot.data.entries) {
    const next = current.data.entries.find((e) => e.id === prior.id),
      row = old.data.rows.find((r) => r.id === prior.id);
    assert(
      prior.pose.accepted &&
        row.accepted &&
        prior.set === '2ed' &&
        next.face.wordingMode === 'original',
    );
    assert(/^[a-f0-9-]{36}$/.test(prior.id));
    assert.equal(prior.reference.sha256, next.reference.sha256);
    assert.equal(prior.art.sha256, next.art.sha256);
    assert.equal(hash(JSON.stringify(prior.pose.transform)), row.poseHash);
    const fields = Object.keys({ ...prior.face, ...next.face })
      .filter((k) => !isDeepStrictEqual(prior.face[k], next.face[k]))
      .sort();
    assert(
      fields.every((k) => ['rulesText', 'rulesParagraphs', 'rulesAlignment'].includes(k)),
      'Broader face refresh required: ' + prior.name,
    );
    const entry = fields.length
      ? { ...next, set: prior.set, name: prior.name, pose: prior.pose }
      : prior;
    entries.push(entry);
    if (fields.length) changed.push(entry);
    decisions.push({
      id: prior.id,
      name: prior.name,
      fields,
      beforeInputHash: hash(JSON.stringify(canonical(prior.face))),
      afterInputHash: hash(JSON.stringify(canonical(next.face))),
    });
  }
  assert(changed.length, 'No changed inputs to refresh');
  await mkdir(out);
  await mkdir(path.join(out, '2ed'));
  await mkdir(path.join(out, 'partial'));
  await mkdir(path.join(out, 'partial/2ed'));
  const session = await openBrowser({ entries: changed, components: snapshot.data.components });
  const replacements = new Map();
  try {
    await session.page.evaluate(async () => {
      await import('/games/magic/src/data/eager.ts');
      await import('/games/magic/src/data/eager-wording.ts');
    });
    for (const e of changed) {
      const result = await session.page.evaluate(async (e) => {
        const { composeCardTexture } = await import('/games/magic/src/presentation/canvas-face.ts');
        const { loadAccuracyImages } = await import('/games/magic/tools/accuracy/abu-assets.mjs');
        const image = await composeCardTexture(
          { face: e.face, printingId: e.id, printedImage: null },
          'inspect',
          new AbortController().signal,
          { loadImages: (urls, signal) => loadAccuracyImages(urls, signal, e.face.illustration) },
        );
        try {
          return image.toDataURL().split(',')[1];
        } finally {
          image.width = image.height = 0;
        }
      }, e);
      const bytes = Buffer.from(result, 'base64'),
        beforeBytes = await readFile(path.join(beforeRoot, '2ed', e.id + '.png'));
      const images = [beforeBytes, bytes].map((v) => PNG.sync.read(v));
      for (const image of images) assert.deepEqual([image.width, image.height], [732, 1020]);
      let outside = 0,
        alphaChanged = 0,
        changedPixels = 0;
      for (let p = 0; p < 732 * 1020; p++) {
        const i = p * 4,
          x = p % 732,
          y = Math.floor(p / 732);
        if (images[0].data[i + 3] !== images[1].data[i + 3]) alphaChanged++;
        if ([0, 1, 2, 3].some((k) => images[0].data[i + k] !== images[1].data[i + k])) {
          changedPixels++;
          if (!(x >= 79.5 && x < 667.5 && y >= 606 && y < 904.5)) outside++;
        }
      }
      assert.equal(outside, 0, e.name + ' wording changed a non-body region');
      assert.equal(alphaChanged, 0);
      assert(changedPixels > 0, 'Reviewed text had no visible effect');
      const row = old.data.rows.find((r) => r.id === e.id);
      assert.equal(hash(beforeBytes), row.renderHash);
      await writeFile(path.join(out, '2ed', e.id + '.png'), bytes);
      replacements.set(e.id, { ...row, renderHash: hash(bytes) });
      Object.assign(
        decisions.find((d) => d.id === e.id),
        {
          beforeFaceHash: hash(beforeBytes),
          afterFaceHash: hash(bytes),
          changedPixels,
          outside,
          alphaChanged,
        },
      );
      console.log('Refreshed', e.name, changedPixels, 'body pixels');
    }
    const source = {
      schema: 1,
      rendererHash,
      toolHash,
      parentCaptureHash: hash(old.bytes),
      parentInputsHash: hash(snapshot.bytes),
      currentPrintingInputsHash: hash(current.bytes),
      currentInputProducerHash: current.data.rendererHash,
      components: old.data.source.components,
      browser: session.browser.version(),
      refreshedIds: changed.map((e) => e.id),
      scope:
        'Composite native baseline: unchanged provided face values, source/font identities, reference/art bytes and poses reuse parent rasters. Changed original rich body inputs are rendered by the same frozen painter; no non-body pixel or alpha changes are permitted. Current input producer identity is separate from the painter. No normalization is repeated.',
    };
    const input = { source, entries, components: snapshot.data.components },
      capture = { source, rows: old.data.rows.map((r) => replacements.get(r.id) ?? r) };
    for (const row of capture.rows) {
      if (!replacements.has(row.id))
        await link(
          path.join(beforeRoot, '2ed', row.id + '.png'),
          path.join(out, '2ed', row.id + '.png'),
        );
      await link(
        path.join(beforeRoot, '2ed', row.id + '-scan.png'),
        path.join(out, '2ed', row.id + '-scan.png'),
      );
      for (const role of Object.keys(row.controls ?? {})) {
        assert(['title', 'type'].includes(role));
        await link(
          path.join(beforeRoot, '2ed', row.id + '-' + role + '.png'),
          path.join(out, '2ed', row.id + '-' + role + '.png'),
        );
      }
    }
    await writeJson(path.join(out, 'capture.json'), capture);
    await writeJson(path.join(out, 'inputs.json'), input);
    const captureHash = hash(await readFile(path.join(out, 'capture.json'))),
      inputHash = hash(await readFile(path.join(out, 'inputs.json')));
    const partialSource = {
      ...source,
      parentCaptureHash: captureHash,
      parentInputsHash: inputHash,
      scope:
        'Changed-original-body subset of the composite baseline; all omitted face values reuse their parent exactly.',
    };
    await writeJson(path.join(out, 'partial/capture.json'), {
      source: partialSource,
      rows: changed.map((e) => replacements.get(e.id)),
    });
    await writeJson(path.join(out, 'partial/inputs.json'), {
      source: partialSource,
      entries: changed,
      components: snapshot.data.components,
    });
    for (const e of changed)
      for (const suffix of ['.png', '-scan.png'])
        await link(
          path.join(out, '2ed', e.id + suffix),
          path.join(out, 'partial/2ed', e.id + suffix),
        );
    await writeJson(path.join(out, 'refresh.json'), {
      schema: 1,
      status: 'body-input-baseline-refreshed',
      rendererHash,
      toolHash,
      parentCaptureHash: hash(old.bytes),
      currentPrintingInputsHash: hash(current.bytes),
      captureHash,
      inputHash,
      total: entries.length,
      reused: entries.length - changed.length,
      refreshed: changed.length,
      decisions,
    });
  } finally {
    await session.close();
  }
} else {
  const [
    parentFile,
    partialFile,
    baselineDirectory,
    output,
    parentImages,
    partialImages,
    outImages,
  ] = args;
  assert(output);
  const parent = await read(parentFile),
    partial = await read(partialFile),
    base = await read(path.join(baselineDirectory, 'capture.json')),
    input = await read(path.join(baselineDirectory, 'inputs.json'));
  const pointBase = await read(path.join(baselineDirectory, 'partial/capture.json')),
    pointInput = await read(path.join(baselineDirectory, 'partial/inputs.json'));
  assert.equal(parent.data.nativeCaptureHash, base.data.source.parentCaptureHash);
  assert.equal(parent.data.nativeInputsHash, base.data.source.parentInputsHash);
  assert.equal(partial.data.nativeCaptureHash, hash(pointBase.bytes));
  assert.equal(partial.data.nativeInputsHash, hash(pointInput.bytes));
  for (const data of [parent.data, partial.data])
    assert.equal(data.rendererHash, base.data.source.rendererHash);
  assert.deepEqual(parent.data.dependencies, partial.data.dependencies);
  assert.deepEqual(parent.data.transformed, partial.data.transformed);
  assert.equal(parent.data.completed, parent.data.total);
  assert.equal(partial.data.completed, partial.data.total);
  assert.deepEqual(
    parent.data.definition.candidates,
    partial.data.definition.candidates,
    'Candidate parameters changed; rows cannot be reused',
  );
  const native = Boolean(parent.data.nativeVerification);
  assert.equal(Boolean(partial.data.nativeVerification), native);
  if (native) {
    assert(parentImages && partialImages && outImages);
    assert.equal(parent.data.toolHash, partial.data.toolHash);
    await mkdir(outImages);
  } else assert.deepEqual(parent.data.definition, partial.data.definition);
  const changed = new Set(base.data.source.refreshedIds);
  assert.deepEqual([...changed].sort(), partial.data.rows.map((r) => r.id).sort());
  const rows = [];
  for (const e of input.data.entries) {
    const source = changed.has(e.id) ? partial.data : parent.data,
      row = source.rows.find((r) => r.id === e.id),
      expected = base.data.rows.find((r) => r.id === e.id);
    assert(row && expected);
    assert.equal(row.baselineHash, expected.renderHash);
    assert.equal(row.referenceHash, expected.referenceHash);
    assert.equal(row.poseHash, expected.poseHash);
    rows.push(row);
    if (native) {
      const directory = changed.has(e.id) ? partialImages : parentImages;
      for (const suffix of ['.png', '-etching.png']) {
        const source = path.resolve(directory, e.id + suffix),
          bytes = await readFile(source);
        assert.equal(hash(bytes), suffix === '.png' ? row.native.faceHash : row.native.etchingHash);
        await link(source, path.resolve(outImages, e.id + suffix));
      }
    }
  }
  const merged = {
    ...partial.data,
    nativeCaptureHash: hash(base.bytes),
    nativeInputsHash: hash(input.bytes),
    total: rows.length,
    completed: rows.length,
    rows,
    derivation: {
      assemblerHash: toolHash,
      parentMatrixHash: hash(parent.bytes),
      partialMatrixHash: hash(partial.bytes),
      refreshCaptureHash: hash(base.bytes),
      unchangedCandidateParameters: true,
      reused: rows.length - changed.size,
      refreshed: changed.size,
    },
  };
  if (!native) {
    merged.measurementToolHashes = [parent.data.toolHash, partial.data.toolHash];
    merged.toolHash = toolHash;
  }
  await writeJson(output, merged);
  console.log(
    JSON.stringify({
      status: 'same-recipe-measurements-merged',
      total: rows.length,
      reused: rows.length - changed.size,
      refreshed: changed.size,
      native,
    }),
  );
}
