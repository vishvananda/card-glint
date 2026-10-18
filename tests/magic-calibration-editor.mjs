import assert from 'node:assert/strict';
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
  assert.equal(api.describeSetCalibration('LEA').supported, false);
  console.log(
    'Calibration editor: native selectors, zero parity, bounds, immutable profiles and cache identities pass',
  );
} finally {
  await vite.close();
}
