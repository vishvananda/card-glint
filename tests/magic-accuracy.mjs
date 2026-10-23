import assert from 'node:assert/strict';
import { compareRegion } from '../games/magic/tools/accuracy/metrics.mjs';
import {
  fitSharedTransform,
  IDENTITY,
  landmarks,
  frameFamily,
} from '../games/magic/tools/accuracy/alignment.mjs';
import { corpusPolicy, exclusion, qualityIssue } from '../games/magic/tools/accuracy/corpus.mjs';
import { normalize } from '../games/magic/tools/accuracy/pixels.mjs';
import { presentation } from '../games/magic/tools/accuracy/adapter.mjs';
import { reviewedArtCrop } from '../games/magic/tools/accuracy/art-crop.mjs';
import { regions } from '../games/magic/tools/accuracy/regions.mjs';

const width = 220,
  height = 100;
const glyphs = ['111101101101111', '110101110101110', '111100100100111', '110101101101110'];
function textImage({
  shift = 0,
  leading = 0,
  wide = 0,
  erase = false,
  variant = false,
  noise = 0,
} = {}) {
  const pixels = new Float32Array(width * height).fill(225);
  for (let row = 0; row < 2; row++)
    for (let word = 0; word < 3; word++)
      for (let letter = 0; letter < 3; letter++) {
        if (erase && row === 1 && word === 2) continue;
        const glyph = glyphs[(letter + word + (variant ? 1 : 0)) % glyphs.length];
        for (let y = 0; y < 5; y++)
          for (let x = 0; x < 3; x++)
            if (glyph[y * 3 + x] === '1')
              for (let dy = 0; dy < 3; dy++)
                for (let dx = 0; dx < 3 + wide; dx++) {
                  const px = 15 + word * 64 + letter * (12 + wide) + x * (3 + wide) + dx + shift;
                  const py = 20 + row * (35 + leading) + y * 3 + dy;
                  if (px < width && py < height) pixels[py * width + px] = 30;
                }
      }
  return Float32Array.from(pixels, (v, i) => v + noise * Math.sin(i * 13.7));
}
const original = textImage();
const compare = (image) => compareRegion(original, image, width, height);
assert.equal(compare(original).edgeF1[0], 1);
assert.equal(compare(original).censusSimilarity, 1);
const variants = {
  brightness: Float32Array.from(original, (v) => v * 0.8 + 20),
  gamma: Float32Array.from(original, (v) => 255 * (v / 255) ** 1.5),
  noise: textImage({ noise: 3 }),
  shifted: textImage({ shift: 4 }),
  leading: textImage({ leading: 5 }),
  font: textImage({ variant: true, wide: 1 }),
  deleted: textImage({ erase: true }),
};
const scores = Object.fromEntries(
  Object.entries(variants).map(([key, image]) => [key, compare(image).edgeF1[1]]),
);
for (const benign of ['brightness', 'gamma', 'noise'])
  for (const error of ['shifted', 'leading', 'font', 'deleted'])
    assert.ok(scores[benign] > scores[error], `${benign} should rank above ${error}`);
assert.ok(
  compareRegion(original, new Float32Array(original.length).fill(225), width, height).status ===
    'missing-ink',
);
assert.equal(
  compareRegion(
    new Float32Array(original.length).fill(225),
    new Float32Array(original.length).fill(225),
    width,
    height,
  ).status,
  'empty',
);
assert.throws(() => compareRegion(original, original, 1, 1), /dimensions/);
const points = landmarks('modern-normal');
const samples = Array.from({ length: 5 }, () => ({
  reference: points.map((p) => ({ ...p, detected: p[p.axis], strength: 50 })),
  rendered: points.map((p) => ({
    ...p,
    detected: p[p.axis] + (p.axis === 'x' ? 2 : -1),
    strength: 50,
  })),
}));
const fit = fitSharedTransform(samples);
assert.equal(fit.status, 'calibrated');
assert.ok(Math.abs(fit.transform.tx - 2) < 1e-6 && Math.abs(fit.transform.ty + 1) < 1e-6);
assert.deepEqual(fitSharedTransform(samples.slice(0, 1)).transform, IDENTITY);
const image = { width: 4, height: 8, data: new Uint8Array(128).fill(255) };
const normalized = normalize(image);
assert.equal(normalized.normalization.factor, 85);
assert.equal(normalized.normalization.padX, 74);
const card = {
  lang: 'en',
  games: ['paper'],
  border_color: 'black',
  layout: 'normal',
  frame: '2015',
  image_status: 'highres_scan',
  highres_image: true,
  image_uris: { png: 'x', art_crop: 'y' },
};
assert.equal(exclusion(card), null);
assert.equal(corpusPolicy([card]), 'ordinary-paper-v1');
assert.equal(corpusPolicy([{ ...card, frame: '1997' }]), 'ordinary-paper-v2');
assert.equal(exclusion({ ...card, type_line: 'Basic Land — Plains' }), null);
assert.equal(exclusion({ ...card, type_line: 'Legendary Planeswalker — Example' }), null);
assert.match(exclusion({ ...card, frame_effects: ['extendedart'] }), /treatment/);
assert.equal(qualityIssue({ ...card, highres_image: false }), 'reference-not-high-resolution');
for (const frame of ['1993', '1997']) {
  const old = { ...card, frame, border_color: 'white', name: 'Old printing', set: '7ed' };
  assert.equal(exclusion(old), null, 'Ordinary white borders must stay in the denominator');
  assert.equal(qualityIssue(old), null);
  const { face } = presentation({ card: old });
  assert.equal(face.frameStyle, 'retro');
  assert.equal(face.borderColor, 'white');
  const captured = { frame: 'retro-seventh', face, assets: {} };
  assert.equal(frameFamily(captured), 'retro-seventh');
  const body = regions(captured).find((r) => r.id === 'body');
  assert.ok(body.rect[1] < 430 && body.rect[0] > 50, 'Old body uses its own text window');
}
assert.equal(exclusion({ ...card, border_color: 'silver' }), 'special-treatment');
assert.equal(qualityIssue({ ...card, frame: '1997', layout: 'split' }), 'unsupported-layout');
assert.equal(qualityIssue({ ...card, frame: '2003' }), null);
assert.equal(qualityIssue({ ...card, frame: '2003', layout: 'split' }), 'unsupported-layout');
assert.equal(landmarks('retro-seventh').length, 15);
const artEntry = {
  card: { ...card, id: 'cb9b9a9d-ae4c-4e04-bf9d-cae48f01292c' },
  art: { sha256: 'f3da51fe96956a7eb6121032a3d2d2a2cccbef789e2014c01b6e5b102090fc65' },
  reference: { sha256: '535e8bde88dcb9e53564e4baecd2ace5f93b843f0144b4a925751b61c6f3b557' },
};
assert.deepEqual(presentation(artEntry).face.illustrationCrop, [
  87 / 745,
  106 / 1040,
  579 / 745,
  466 / 1040,
]);
assert.equal(
  presentation(artEntry).face.illustration,
  `/__accuracy/object/${artEntry.reference.sha256}`,
);
assert.equal(
  reviewedArtCrop({ ...artEntry, reference: { sha256: 'replacement' } }).status,
  'stale-source',
);
const replacedArt = { ...artEntry, art: { sha256: 'replacement' } };
assert.equal(reviewedArtCrop(replacedArt).status, 'stale-source');
assert.equal(presentation(replacedArt).face.illustrationCrop, undefined);
assert.deepEqual(
  landmarks('retro-abu'),
  [],
  'Unreviewed frame families cannot use modern landmarks',
);
console.log(
  'Structural metric mutations, empty/missing ink, frozen shared alignment and corpus denominator passed:',
  scores,
);
