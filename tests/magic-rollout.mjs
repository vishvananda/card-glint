import assert from 'node:assert/strict';
import {
  printingScope,
  summarizeSet,
  frameWave,
  referenceIssue,
  evaluatorIssue,
} from '../games/magic/tools/accuracy/rollout-policy.mjs';
const card = {
  id: 'a',
  name: 'Example',
  oracle_id: 'a',
  lang: 'en',
  games: ['paper'],
  border_color: 'black',
  frame: '1997',
  layout: 'normal',
  image_status: 'highres_scan',
  highres_image: true,
  image_uris: { png: 'ref', art_crop: 'art' },
  rarity: 'rare',
};
assert.equal(
  printingScope({ ...card, frame_effects: ['enchantment', 'legendary'] }).status,
  'ordinary',
);
assert.equal(printingScope({ ...card, frame_effects: ['showcase'] }).status, 'excluded');
assert.equal(printingScope({ ...card, frame_effects: ['new-unknown-effect'] }).status, 'review');
assert.equal(printingScope({ ...card, lang: 'de' }).status, 'excluded');
const many = Array.from({ length: 50 }, (_, i) => ({
  ...card,
  id: String(i),
  oracle_id: String(i),
}));
assert.equal(summarizeSet(many).admission, 'major');
assert.equal(summarizeSet(many.slice(1)).admission, 'smaller');
const variants = Array.from({ length: 100 }, (_, i) => ({ ...card, id: String(i) }));
assert.equal(summarizeSet(variants).distinctOrdinary, 1);
assert.equal(summarizeSet(variants).ordinaryPrintings, 100);
assert.equal(summarizeSet(variants).admission, 'smaller');
const uncertain = [
  ...many.slice(1),
  { ...many[49], oracle_id: 'unknown', frame_effects: ['unknown'] },
];
assert.equal(summarizeSet(uncertain).admission, 'classification-review');
const noReferences = many.map((c) => ({
  ...c,
  image_status: 'lowres',
  frame: '2003',
  layout: 'transform',
}));
const result = summarizeSet(noReferences);
assert.equal(result.admission, 'major');
assert.equal(result.ordinaryPrintings, 50);
assert.equal(result.groups[0].referenceMetadataReady, 0);
assert.equal(result.groups[0].evaluatorEligible, 0);
assert.equal(frameWave({ ...card, frame: '2003' }), 'new');
assert.equal(frameWave({ ...card, frame: 'future' }), 'new');
assert.equal(frameWave({ ...card, frame: '1993' }), 'old');
assert.equal(
  referenceIssue({ ...card, image_uris: null, card_faces: [{}] }),
  'per-face-reference-adapter-needed',
);
assert.equal(evaluatorIssue({ ...card, layout: 'split' }), 'layout-adapter-unvalidated:split');
console.log(
  'Rollout scope: 50 distinct cards, printing variants, standard features, unknown treatments, poor references and unsupported frames remain separately accounted.',
);

assert.equal(
  printingScope({
    lang: 'en',
    games: ['paper'],
    layout: 'normal',
    border_color: 'black',
    set_type: 'masterpiece',
  }).status,
  'review',
);
