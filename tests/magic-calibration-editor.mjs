import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createServer } from './magic-vite.mjs';
const vite = await createServer({
  configFile: false,
  optimizeDeps: { noDiscovery: true },
  server: { middlewareMode: true },
});
try {
  const api = await vite.ssrLoadModule('/games/magic/src/calibration/editor.ts');
  const { calibrationForFace } = await vite.ssrLoadModule(
    '/games/magic/src/calibration/selection.ts',
  );
  const { earlyReprintFrame } = await vite.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-frame.ts',
  );
  const { earlyReprintTitle } = await vite.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-title.ts',
  );
  const { earlyReprintColors } = await vite.ssrLoadModule(
    '/games/magic/src/presentation/early-reprint-colors.ts',
  );
  const { retroTextLayout } = await vite.ssrLoadModule(
    '/games/magic/src/presentation/retro-rules.ts',
  );
  const { cardTextureKey } = await vite.ssrLoadModule(
    '/games/magic/src/presentation/canvas-face.ts',
  );
  const ctx = {
    font: '20px serif',
    save() {},
    restore() {},
    measureText(text) {
      const n = Number(this.font.match(/([0-9.]+)px/)[1]);
      return {
        width: text.length * n * 0.5,
        actualBoundingBoxAscent: n * 0.8,
        actualBoundingBoxDescent: n * 0.2,
        actualBoundingBoxLeft: 0,
        actualBoundingBoxRight: text.length * n * 0.5,
      };
    },
  };
  const alpha = api.describeSetCalibration('LEA');
  assert.equal(alpha.supported, true);
  assert.equal(alpha.adapter, 'title');
  assert.deepEqual([...new Set(alpha.controls.map((c) => c.group))], ['lettering']);
  assert.equal(alpha.controls.length, 14);
  assert.deepEqual(
    api.createSetCalibrationCandidate(
      'lea',
      alpha.revision,
      Object.fromEntries(alpha.controls.map((c) => [c.id, c.value])),
    ).values,
    {},
    'The data-file defaults must themselves satisfy every control bound',
  );
  assert.equal(alpha.controls.find((c) => c.id === 'title.width').step, 0.001);
  const spaced = api.createSetCalibrationCandidate('lea', alpha.revision, {
    'title.width': 0.953,
    'title.wordSpacing': -1.25,
    'type.width': 0.977,
    'type.wordSpacing': -0.65,
  });
  assert.equal(api.resolveSetTitleCalibration(spaced).title.wordSpacing, -1.25);
  assert.equal(api.resolveSetTitleCalibration(spaced).type.width, 0.977);
  assert.throws(
    () =>
      api.createSetCalibrationCandidate('lea', alpha.revision, {
        'type.wordSpacing': -7,
      }),
    /Invalid/,
  );
  const receipt = JSON.parse(
    await readFile('games/magic/fixtures/accuracy/heading-spacing/promotion.json'),
  );
  const bytes = await readFile(receipt.measurement);
  const hash = (b) => createHash('sha256').update(b).digest('hex');
  assert.equal(hash(bytes), receipt.measurementSha256);
  assert.equal(hash(await readFile(receipt.profile)), receipt.profileSha256);
  const measurement = JSON.parse(bytes);
  const defaults = api.resolveSetTitleCalibration(
    api.createSetCalibrationCandidate('lea', alpha.revision, {}),
  );
  for (const role of ['title', 'type'])
    for (const [key, value] of Object.entries(measurement.fits[role].values))
      assert.equal(
        defaults[role][key],
        value,
        'Measured shared headings must remain enabled by default',
      );
  assert.equal(receipt.nativeReplays.length, 292);
  assert.equal(new Set(receipt.nativeReplays.map((r) => r.id)).size, 292);
  for (const row of receipt.nativeReplays) {
    assert.equal(row.baselineChangedPixels, 0);
    assert.equal(row.defaultCandidateFields, 0);
    assert.equal(row.outsideHeadings, 0);
    assert.equal(row.scoresMatchMeasurement, true);
    assert(Object.values(row.replayParity).every((v) => v <= 1.001));
  }
  const emptyAlpha = api.createSetCalibrationCandidate('lea', alpha.revision, {});
  assert.deepEqual(emptyAlpha.values, {});
  const alphaFace = {
    name: 'Air Elemental',
    setCode: 'lea',
    typeLine: 'Summon Elemental',
    colors: ['U'],
  };
  assert.equal(
    calibrationForFace({ ...alphaFace, setCalibrationCandidate: emptyAlpha }),
    undefined,
  );
  assert.equal(earlyReprintFrame({ ...alphaFace, setCalibrationCandidate: emptyAlpha }), undefined);
  const editedAlpha = api.createSetCalibrationCandidate('lea', alpha.revision, {
    'title.dx': 2,
    'title.width': 1.02,
  });
  const title = api.resolveSetTitleCalibration(editedAlpha);
  assert.equal(title.title.dx, 2);
  assert.equal(title.title.width, 1.02);
  assert.equal(api.exportSetTitleCalibration(editedAlpha).revision, alpha.revision + 1);
  assert.throws(
    () => api.createSetCalibrationCandidate('lea', alpha.revision, { 'title.dx': 31 }),
    /Invalid/,
  );
  assert.throws(
    () => api.createSetCalibrationCandidate('lea', alpha.revision, { 'frames.W.frame.0': 0.01 }),
    /Unsupported/,
  );
  assert.throws(() => api.createSetCalibrationCandidate('lea', alpha.revision - 1, {}), /revision/);
  assert.throws(() => api.exportSetCalibrationProfile(editedAlpha), /exportSetTitleCalibration/);
  const { setCalibrationTextureKey } = await vite.ssrLoadModule(
    '/games/magic/src/calibration/cache-key.ts',
  );
  assert.equal(setCalibrationTextureKey(alphaFace)[0], 'legacy-regional-v1');
  const ordinary = { name: 'Probe', setCode: 'm21', typeLine: 'Creature', colors: ['U'] };
  assert.deepEqual(setCalibrationTextureKey(ordinary), ['set-profile-v1', null, null]);
  assert.deepEqual(
    setCalibrationTextureKey({
      name: 'Tundra',
      setCode: 'leb',
      land: true,
      typeLine: 'Land',
      frameColors: ['W', 'U'],
    }),
    ['legacy-regional-v1', null, null, 'abu-outline-v3', null],
  );
  const { withSetCalibration } = await vite.ssrLoadModule(
    '/games/magic/src/calibration/face-editor.ts',
  );
  assert.equal(withSetCalibration(alphaFace, editedAlpha).setCalibrationCandidate, editedAlpha);
  assert.throws(
    () => withSetCalibration({ ...alphaFace, setCode: 'leb' }, editedAlpha),
    /another set/,
  );
  assert.throws(
    () => withSetCalibration({ ...alphaFace, frameStyle: 'modern' }, editedAlpha),
    /no set calibration adapter/,
  );
  const { paintLegacyCalibratedTitle } = await vite.ssrLoadModule(
    '/games/magic/src/presentation/legacy-calibrated-title.ts',
  );
  const titleCalls = [];
  const titleStates = [];
  const titleContext = {
    font: '10px sans-serif',
    measureText: ctx.measureText,
    save() {
      titleStates.push(this.font);
    },
    restore() {
      this.font = titleStates.pop();
    },
    getTransform() {
      return { a: 1 };
    },
    translate(...args) {
      titleCalls.push(['translate', ...args]);
    },
    scale(...args) {
      titleCalls.push(['scale', ...args]);
    },
    fillText(...args) {
      titleCalls.push(['fillText', ...args]);
    },
  };
  const originalTitle = paintLegacyCalibratedTitle(titleContext, alphaFace, 34, 48, 350);
  const originalCalls = structuredClone(titleCalls);
  titleCalls.length = 0;
  assert.equal(
    paintLegacyCalibratedTitle(
      titleContext,
      { ...alphaFace, setCalibrationCandidate: emptyAlpha },
      34,
      48,
      350,
    ),
    originalTitle,
  );
  assert.deepEqual(
    titleCalls,
    originalCalls,
    'Empty proposals follow the current per-set title defaults',
  );
  for (const set of ['fem', '4ed', 'chr']) {
    const face = {
      name: 'Probe',
      setCode: set,
      colors: ['W'],
      typeLine: 'Summon Creature',
      rulesText: 'First strike',
      colorCalibration: 'set-hsb-v1',
      symbolStyle: 'original',
    };
    const description = api.describeSetCalibration(set);
    assert.equal(description.supported, true);
    assert.equal(new Set(description.controls.map((c) => c.group)).size, 6);
    assert.equal(new Set(description.controls.map((c) => c.id)).size, description.controls.length);
    const empty = api.createSetCalibrationCandidate(set, description.revision, {});
    const zero = { ...face, setCalibrationCandidate: empty };
    assert.deepEqual(earlyReprintFrame(zero), earlyReprintFrame(face));
    assert.deepEqual(earlyReprintColors(zero), earlyReprintColors(face));
    assert.deepEqual(retroTextLayout(ctx, zero), retroTextLayout(ctx, face));
    const base = calibrationForFace(face);
    const values = {
      'title.x': base.title.x + 2,
      'frames.W.frame.0': base.frames.W.frame[0] + 0.001,
      'rulesAdjustments.default.vertical': 1.5,
    };
    const candidate = api.createSetCalibrationCandidate(set, description.revision, values);
    const edited = { ...face, setCalibrationCandidate: candidate };
    assert.equal(earlyReprintTitle(edited).x, base.title.x + 2);
    assert.equal(earlyReprintTitle(face).x, base.title.x);
    assert.equal(earlyReprintFrame(edited).frame[0], values['frames.W.frame.0']);
    assert.ok(earlyReprintColors(edited), 'moving source geometry keeps candidate pigment binding');
    const before = retroTextLayout(ctx, face),
      after = retroTextLayout(ctx, edited);
    assert.equal(after.lines.length, before.lines.length);
    assert.ok(Math.abs(after.lines[0].baseline - before.lines[0].baseline - 1.5) < 1e-8);
    assert.notEqual(
      cardTextureKey({ face, printingId: null, printedImage: null }, 'inspect'),
      cardTextureKey({ face: edited, printingId: null, printedImage: null }, 'inspect'),
    );
    assert.equal(api.exportSetCalibrationProfile(candidate).revision, description.revision + 1);
    const rgb = api.createSetCalibrationCandidate(set, description.revision, {
      'colors.W.adjustment.frame.rgbScale.0': 1.1,
    });
    assert.equal(
      api.resolveSetCalibrationCandidate(rgb).colors.W.adjustment.frame.rgbScale.length,
      3,
    );
    assert.throws(
      () => calibrationForFace({ ...face, setCode: 'lea', setCalibrationCandidate: candidate }),
      /another set/,
    );
    assert.throws(() => api.createSetCalibrationCandidate(set, 999, {}), /revision/);
    for (const invalid of [
      { '__proto__.bad': 1 },
      { 'title.x': NaN },
      { 'title.x': '10' },
      { 'frames.W.art.2': 0 },
      { 'colors.W.source': 'https://evil.invalid' },
    ])
      assert.throws(() => api.createSetCalibrationCandidate(set, description.revision, invalid));
  }
  assert.equal(api.describeSetCalibration('LEB').supported, false);
  console.log(
    'Calibration editor: native selectors, zero parity, bounds, immutable profiles and cache identities pass',
  );
} finally {
  await vite.close();
}
