import assert from 'node:assert/strict';
import { oldFramePilotText } from '../games/magic/tools/accuracy/old-frame-pilot-text.mjs';
import { printingTextIndex } from '../games/magic/tools/accuracy/printing-text.mjs';
const raw = '{3}, {cT}: Add {2}. {CT} {T} {CHAOS}';
const snapshot = {
  set: 'scg',
  entries: [
    {
      id: 'scg-printing',
      card: {
        name: 'Source control',
        collector_number: '1',
        set: 'scg',
      },
    },
  ],
};
const source = {
  code: 'SCG',
  cards: [
    {
      name: 'Source control',
      number: '1',
      setCode: 'SCG',
      language: 'English',
      identifiers: { scryfallId: 'scg-printing' },
      originalText: raw,
    },
  ],
};
const original = structuredClone(source);
const baseline = printingTextIndex(snapshot, source);
const pilot = oldFramePilotText(snapshot, source);
assert.equal(baseline.cards['scg-printing'].originalText, raw);
assert.equal(pilot.cards['scg-printing'].originalText, '{3}, {T}: Add {2}. {CT} {T} {CHAOS}');
assert.equal(pilot.cards['scg-printing'].rawOriginalText, raw);
assert.deepEqual(source, original);
assert.deepEqual(baseline, printingTextIndex(snapshot, source));
console.log(
  'Pilot tilted-tap import preserves raw source, input isolation and the shared historical audit parser.',
);
