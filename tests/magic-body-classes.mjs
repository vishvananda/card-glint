import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { createServer } from './magic-vite.mjs';
const server = await createServer({
  configFile: false,
  server: { host: '127.0.0.1', port: 0, hmr: false },
});
await server.listen();
const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await page.goto(server.resolvedUrls.local[0]);
  await page.evaluate(async () => {
    await import('/games/magic/src/data/eager.ts');
    const { calibratedBodyClasses } = await import('/games/magic/src/calibration/body.ts');
    const {
      describeSetCalibration,
      createSetCalibrationCandidate,
      resolveSetCalibrationCandidate,
    } = await import('/games/magic/src/calibration/editor.ts');
    const description = describeSetCalibration('4ed');
    const id = 'bodyClasses.centered.maxCharacters';
    const control = description.controls.find((c) => c.id === id);
    if (!control || control.value !== 130) throw Error('Missing body-class editor controls');
    const candidate = createSetCalibrationCandidate('4ed', description.revision, {
      [id]: 140,
      'bodyClasses.compact.leading': 1.15,
      'bodyClasses.bounds.x': 73,
    });
    const resolved = resolveSetCalibrationCandidate(candidate);
    if (
      resolved.bodyClasses.centered.maxCharacters !== 140 ||
      resolved.bodyClasses.compact.leading !== 1.15 ||
      resolved.bodyClasses.bounds.x !== 73
    )
      throw Error('Body-class editor values were not resolved');
    if (describeSetCalibration('4ed').controls.find((c) => c.id === id).value !== 130)
      throw Error('Body-class editor mutated the shipped profile');
    for (const values of [
      { [id]: 130.5 },
      { 'bodyClasses.compact.nominalMinimum': 22, 'bodyClasses.compact.nominalMaximum': 21 },
      { 'bodyClasses.bounds.width': 10 },
      { 'bodyClasses.materials': ['W'] },
    ]) {
      let rejected = false;
      try {
        createSetCalibrationCandidate('4ed', description.revision, values);
      } catch {
        rejected = true;
      }
      if (!rejected) throw Error('Invalid body-class candidate was accepted');
    }

    const { layoutRules } = await import('/games/magic/src/presentation/rules-layout.ts');
    const context = document.createElement('canvas').getContext('2d');
    const p = {
      materials: ['W'],
      bounds: { x: 72, y: 414, width: 344, height: 184 },
      typography: {
        fractionalMetrics: true,
        textWidth: 1,
        leading: 1,
        paragraphGap: 0,
        flavorGap: 0,
        flavorOrphans: false,
        flavorSeparator: false,
        centerOffset: -4,
      },
      centered: { maxCharacters: 130, maxLines: 6, size: 25 },
      compact: { nominalMinimum: 17.5, nominalMaximum: 21.75, size: 15.5, leading: 1.2 },
    };
    const blocks = (text) => [{ role: 'rules', runs: [{ text }] }],
      short = blocks('Target creature gains flying until end of turn.'),
      long = blocks('Target creature cannot attack this turn. '.repeat(7));
    const base = layoutRules(context, long, p.bounds, 20, 20, p.typography),
      face = { name: 'Probe', setCode: '4ed', wordingMode: 'original' };
    const check = (yes, message) => {
      if (!yes) throw Error(message);
    };
    const before = JSON.stringify({ short, long, p });
    const compact = calibratedBodyClasses(
      context,
      face,
      p,
      base,
      { ...base, size: 20 },
      long,
      long,
    );
    check(
      compact.size === 15.5 && !compact.overflow,
      'Dense reference did not choose measured compact class',
    );
    for (const size of [17.49, 21.75, 22.5, 25]) {
      check(
        calibratedBodyClasses(context, face, p, base, { ...base, size }, long, long) === base,
        'Existing size class was changed',
      );
    }
    const shortBase = { ...base, size: 22.5 };
    const centered = calibratedBodyClasses(context, face, p, base, shortBase, short, short);
    check(
      centered.size === 25 && centered.lines.every((l) => l.x > 72),
      'Short reference did not center',
    );
    const oracle = { ...face, wordingMode: 'oracle' };
    const visibleLong = blocks('Target creature gains flying until end of turn. '.repeat(20));
    const fit = calibratedBodyClasses(context, oracle, p, base, shortBase, visibleLong, short);
    check(
      !fit.overflow && fit.size < 25,
      'Long Oracle text did not fit within its selected source class',
    );
    const originalSmall = calibratedBodyClasses(
      context,
      oracle,
      p,
      base,
      { ...base, size: 20 },
      short,
      long,
    );
    check(originalSmall.size === 15.5, 'Visible short text overrode the selected long reference');
    const forced = calibratedBodyClasses(
      context,
      { ...face, rulesAlignment: { mode: 'left' } },
      p,
      base,
      shortBase,
      short,
      short,
    );
    check(forced === base, 'Forced-left text was centered');
    for (const explicit of [
      { role: 'flavor', runs: [{ text: 'Flavor.' }] },
      { role: 'rules', align: 'right', runs: [{ text: 'Explicit.' }] },
    ]) {
      check(
        calibratedBodyClasses(context, face, p, base, shortBase, [explicit], [explicit]) === base,
        'Explicit styling was overridden',
      );
    }
    const impossible = blocks('Impossible words '.repeat(300));
    check(
      calibratedBodyClasses(context, face, p, base, { ...base, size: 20 }, impossible, long) ===
        base,
      'Overflowing fixed Original class replaced the safe base',
    );
    check(JSON.stringify({ short, long, p }) === before, 'Caller-owned data changed');
  });
  console.log(
    'Body classes:chosen wording reference,compact bounds,retained existing sizes,Original overflow safety,Oracle fitting,forced alignment and immutable inputs pass.',
  );
} finally {
  await browser.close();
  await server.close();
}
