import assert from 'node:assert/strict';
import { transferOldFrameDefault } from '../games/magic/tools/accuracy/old-frame-default-transfer.mjs';
for (const set of ['4ed', 'mir', 'ons']) {
  const donor = {
    set,
    border: 'black',
    revision: 1,
    frames: { W: { family: 'mse-old', assetKey: 'w', art: [0.1, 0.1, 0.8, 0.4] } },
    colors: {
      W: {
        source: 'pinned-source',
        stock: '#181510',
        adjustment: { frame: { brightnessScale: 1 }, outerStock: [0.08, 0.07, 0.06] },
      },
    },
    mana: { geometry: { dx: 1 } },
    title: { W: { size: 25 } },
    footer: {
      artist: { align: 'center' },
      legal: { x: 244, defaultText: 'DONOR COPYRIGHT', collectorTotal: 350 },
    },
    setSymbols: { default: { width: 40 } },
    setSymbolSource: 'keyrune',
    landMaterials: { 'Donor named land': 'L-WU' },
    dualLand: { stock: '#111111' },
    basicSymbol: { originalLetters: true },
  };
  const before = structuredClone(donor);
  for (const [borderColor, stock] of [
    ['black', '#181818'],
    ['white', '#ffffff'],
  ]) {
    const target = { setCode: 'vis', borderColor };
    const p = transferOldFrameDefault(donor, target, stock);
    assert.equal(p.set, target.setCode);
    assert.equal(p.border, borderColor);
    assert.deepEqual(p.frames, donor.frames);
    assert.deepEqual(p.title, donor.title);
    assert.deepEqual(p.mana, donor.mana);
    for (const key of ['setSymbols', 'setSymbolSource', 'landMaterials', 'dualLand'])
      assert(!Object.hasOwn(p, key));
    assert.equal(p.footer.legal.x, 244);
    assert(!Object.hasOwn(p.footer.legal, 'defaultText'));
    assert(!Object.hasOwn(p.footer.legal, 'collectorTotal'));
    assert.equal(p.colors.W.stock, stock);
    assert.deepEqual(
      p.colors.W.adjustment.outerStock,
      borderColor === 'black'
        ? [24 / 255, 24 / 255, 24 / 255]
        : donor.colors.W.adjustment.outerStock,
      'White surround must not become an invalid baked-black correction',
    );
    p.frames.W.assetKey = 'edited-copy';
    assert.deepEqual(donor, before, 'Development trial mutated its shared donor');
  }
}
assert.throws(() =>
  transferOldFrameDefault({ set: 'unknown' }, { borderColor: 'black' }, '#111111'),
);
assert.throws(() => transferOldFrameDefault({ set: 'mir' }, { borderColor: 'silver' }, '#111111'));
console.log(
  'Default transfers retain geometry/typography, protect source immutability, remove printing facts and separate white surrounds from baked black ink.',
);
