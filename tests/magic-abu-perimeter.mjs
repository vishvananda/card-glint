import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from './magic-vite.mjs';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  abuPerimeterDelta,
  preAbuPerimeterSource,
  abuPerimeterAffected,
  abuPerimeterApprovalCurrent,
  abuPerimeterRuntimeCompatible,
} from '../games/magic/tools/accuracy/abu-perimeter-ancestry.mjs';
const p = await abuPerimeterDelta();
for (const [file, e] of Object.entries(p.files)) {
  const raw = await readFile(file),
    prior = await preAbuPerimeterSource(file, raw);
  assert.equal(hash(prior), e.before);
  assert.deepEqual(await preAbuPerimeterSource(file, prior), prior);
  await assert.rejects(
    preAbuPerimeterSource(file, Buffer.concat([raw, Buffer.from('// unknown')])),
    /Unreviewed AB (?:perimeter|raster|paper) source/,
  );
}
const m = p.members[0],
  group = { printings: 1, printingIds: [m.id] };
for (const task of ['frameGeometry', 'fullCard', 'release']) {
  assert(await abuPerimeterAffected(m.set, task, false, group));
  assert(
    await abuPerimeterAffected(m.set, task, false, {}),
    'Unknown group membership must fail closed',
  );
  assert(!(await abuPerimeterAffected(m.set, task, true, group)));
  assert(!(await abuPerimeterAffected('2ed', task, false, group)));
  assert(
    !(await abuPerimeterRuntimeCompatible(
      'games/magic/src',
      p.beforeRenderer,
      m.set,
      task,
      false,
      group,
    )),
  );
}
assert(await abuPerimeterRuntimeCompatible('games/magic/src', p.beforeRenderer, '8ed', 'fullCard'));
assert(
  !(await abuPerimeterRuntimeCompatible('games/magic/src', '0'.repeat(64), '8ed', 'fullCard')),
);
assert(!(await abuPerimeterAffected(m.set, 'rules', false, group)));
const item = {
  runtimeGuards: { 'games/magic/src': p.afterRenderer },
  guards: { [p.native.file]: p.native.sha256 },
  proof: {
    abuPerimeterSource: p.afterRenderer,
    rendererHash: p.afterRenderer,
    nativeReplayHash: p.native.contentSha256,
    coveredPrintings: 1,
    validationKind: 'source-census',
    sourceCensus: {
      heldOut: false,
      members: [
        {
          id: m.id,
          referenceHash: m.referenceHash,
          poseHash: m.poseHash,
          inputHash: m.inputHash,
          nativeFaceHash: m.original.hashes['after-face'],
        },
      ],
    },
  },
};
assert(
  !(await abuPerimeterApprovalCurrent(item, group)),
  'Old perimeter evidence cannot approve the newer raster-selection edit',
);
for (const mutate of [
  (x) => {
    x.proof.nativeReplayHash = '0'.repeat(64);
  },
  (x) => {
    x.proof.sourceCensus.members[0].nativeFaceHash = '0'.repeat(64);
  },
  (x) => {
    x.proof.sourceCensus.members[0].poseHash = '0'.repeat(64);
  },
  (x) => {
    x.proof.sourceCensus.members = [];
  },
  (x) => {
    x.proof.sourceCensus.heldOut = true;
  },
  (x) => {
    x.guards = {};
  },
]) {
  const candidate = structuredClone(item);
  mutate(candidate);
  assert(!(await abuPerimeterApprovalCurrent(candidate, group)));
}
assert(
  !(await abuPerimeterApprovalCurrent({ proof: { abuPerimeterSource: p.afterRenderer } }, group)),
  'A marker is not native evidence',
);
const server = await createServer({
  configFile: false,
  server: { middlewareMode: true, hmr: false },
});
try {
  const { paintAbuDualPerimeter, retroDualFrameRevision } = await server.ssrLoadModule(
    '/games/magic/src/presentation/retro-dual-frame.ts',
  );
  const image = {};
  const context = (matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }) => {
    const calls = [],
      stack = [];
    const c = {
      calls,
      getTransform() {
        return matrix;
      },
      filter: 'contrast(1.1)',
      fillStyle: 'original',
      save() {
        stack.push({ filter: this.filter, fillStyle: this.fillStyle });
        calls.push('save');
      },
      restore() {
        Object.assign(this, stack.pop());
        calls.push('restore');
      },
      beginPath() {
        calls.push('path');
      },
      rect(...v) {
        calls.push(['rect', ...v]);
      },
      clip(v) {
        calls.push(['clip', v]);
      },
      fillRect(...v) {
        calls.push(['fill', this.filter, this.fillStyle, ...v]);
      },
      drawImage(...v) {
        calls.push(['draw', ...v]);
        if (this.fail) throw Error('paint failure');
      },
    };
    return c;
  };
  for (const m of p.members) {
    const c = context();
    paintAbuDualPerimeter(c, m.face, image, '#080808');
    assert(c.calls.some((v) => Array.isArray(v) && v[0] === 'draw'));
    assert.equal(c.filter, 'contrast(1.1)');
    assert.equal(c.fillStyle, 'original');
    assert.equal(retroDualFrameRevision(m.face), 'abu-dual-perimeter-up2-paper-up6-v3');
  }
  const face = p.members.find((m) => m.set === 'lea').face;
  for (const extra of [
    { setCode: '2ed' },
    { setCode: '3ed' },
    { frameStyle: 'modern' },
    { frameTemplate: 'custom' },
    { layout: 'split' },
    { typeLine: 'Enchantment — Saga' },
    { land: false },
    { frameColors: ['G'] },
    { frameColors: [], canonicalTypeLine: 'Land' },
  ]) {
    const c = context(),
      probe = { ...face, ...extra };
    paintAbuDualPerimeter(c, probe, image, 'black');
    assert.deepEqual(c.calls, [], 'Unrelated frame must never enter perimeter drawing');
    assert.equal(retroDualFrameRevision(probe), undefined);
  }
  // Standard tiers and an odd native width must select complete device
  // pixels even when the context has a fractional translation.
  for (const width of [244, 323, 488, 732]) {
    const matrix = { a: width / 488, b: 0, c: 0, d: width / 488, e: 0.25, f: -0.125 };
    const c = context(matrix);
    paintAbuDualPerimeter(c, face, image, 'black');
    const [, left, top, w, h] = c.calls.filter((v) => Array.isArray(v) && v[0] === 'rect')[1];
    for (const value of [
      left * matrix.a + matrix.e,
      (left + w) * matrix.a + matrix.e,
      top * matrix.d + matrix.f,
      (top + h) * matrix.d + matrix.f,
    ])
      assert(Math.abs(value - Math.round(value)) < 1e-10);
    // Source placement remains physical; only the selection ring is snapped.
    assert.deepEqual(
      c.calls.find((v) => Array.isArray(v) && v[0] === 'draw'),
      ['draw', image, 0, -2, 488, 680],
    );
  }
  const skewed = context({ a: 1, b: 0.1, c: 0, d: 1, e: 0, f: 0 });
  assert.throws(() => paintAbuDualPerimeter(skewed, face, image, 'black'), /axis-aligned/);
  assert.equal(skewed.calls.at(-1), 'restore');
  const c = context();
  c.fail = true;
  assert.throws(() => paintAbuDualPerimeter(c, face, image, 'black'), /paint failure/);
  assert.equal(c.calls.at(-1), 'restore');
  assert.equal(c.filter, 'contrast(1.1)');
  assert.equal(c.fillStyle, 'original');
} finally {
  await server.close();
}
console.log(
  'AB perimeter:899 native faces,19 scoped revisions,114 layer pairs, strict history, marker/pose/pixel rejection and Canvas failure restoration pass.',
);
