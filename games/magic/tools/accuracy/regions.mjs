/** Reference regions in the 488 x 680 comparison grid; independent of the painter's rectangles. */
export function regions(result) {
  if (result.frame?.startsWith('retro-')) return retroRegions(result);
  const large = result.frame === 'planeswalker-large';
  const walker = result.frame?.startsWith('planeswalker');
  const titleY = walker ? 30 : 38;
  const typeY = large ? 340 : 389;
  const manaCount = result.face.manaSymbols.length;
  const manaX = 454 - manaCount * 23.5 - Math.max(0, manaCount - 1) * 2;
  const list = [
    { id: 'title', kind: 'text', rect: [40, titleY, (manaCount ? manaX - 8 : 452) - 40, 27] },
    { id: 'type', kind: 'text', rect: [40, typeY + 2, 348, 24] },
    { id: 'set-symbol', kind: 'asset', assetRole: 'setSymbol', rect: [391, typeY - 4, 67, 36] },
    { id: 'body', kind: 'text', rect: [39, large ? 382 : 433, 411, large ? 213 : 170] },
    // Includes frame texture/stamp on some cards; retain as a diagnostic, not typography.
    {
      id: 'body-bottom',
      kind: 'diagnostic',
      rect: [39, 603, result.face.power != null ? 330 : 411, 22],
    },
    { id: 'footer', kind: 'missing-content', rect: [28, 636, 434, 28], lightInk: true },
    { id: 'frame-left', kind: 'asset', assetRole: 'frame', rect: [17, 111, 18, 250] },
    { id: 'frame-right', kind: 'asset', assetRole: 'frame', rect: [454, 111, 18, 250] },
    { id: 'type-border', kind: 'asset', assetRole: 'boxes', rect: [43, typeY - 8, 400, 7] },
  ];
  if (manaCount)
    list.push({
      id: 'mana',
      kind: 'asset',
      assetRole: 'mana',
      rect: [Math.floor(manaX - 3), titleY - 6, Math.ceil(459 - manaX), 34],
    });
  if (result.face.power != null || walker) {
    list.push({
      id: 'stats',
      kind: 'text',
      rect: [walker ? 406 : 386, 609, walker ? 51 : 65, 28],
      lightInk: walker,
    });
    list.push({ id: 'stats-border', kind: 'asset', assetRole: 'pt', rect: [378, 604, 81, 6] });
  }
  return list;
}

/** Seventh-family old borders: reviewed separately from the modern frame plates. */
function retroRegions(result) {
  if (result.frame === 'retro-fourth') return fourthRegions(result);
  const manaCount = result.face.manaSymbols.length;
  const manaX = 446 - manaCount * 25;
  const list = [
    {
      id: 'title',
      kind: 'text',
      rect: [51, 34, (manaCount ? manaX - 6 : 445) - 51, 31],
      lightInk: true,
    },
    { id: 'type', kind: 'text', rect: [51, 374, 336, 31], lightInk: true },
    { id: 'body', kind: 'text', rect: [62, 417, 366, 180] },
    { id: 'footer', kind: 'missing-content', rect: [44, 606, 343, 40], lightInk: true },
    { id: 'frame-left', kind: 'asset', assetRole: 'frame', rect: [42, 111, 18, 240] },
    { id: 'frame-right', kind: 'asset', assetRole: 'frame', rect: [431, 111, 18, 240] },
    { id: 'type-border', kind: 'asset', assetRole: 'boxes', rect: [62, 404, 366, 8] },
  ];
  if (result.assets?.setSymbol)
    list.push({
      id: 'set-symbol',
      kind: 'asset',
      assetRole: 'setSymbol',
      rect: [391, 372, 51, 33],
    });
  if (manaCount)
    list.push({
      id: 'mana',
      kind: 'asset',
      assetRole: 'mana',
      rect: [Math.floor(manaX - 3), 31, Math.ceil(450 - manaX), 35],
    });
  if (result.face.power != null)
    list.push({ id: 'stats', kind: 'text', rect: [393, 607, 67, 33], lightInk: true });
  return list;
}

/** Fourth Edition development scans; independently observed from the existing plate geometry. */
function fourthRegions(result) {
  const manaCount = result.face.manaSymbols.length;
  const manaX = 447 - 24 - Math.max(0, manaCount - 1) * 27;
  const list = [
    {
      id: 'title',
      kind: 'text',
      rect: [38, 24, (manaCount ? manaX - 6 : 449) - 38, 35],
      lightInk: true,
    },
    { id: 'type', kind: 'text', rect: [40, 374, 350, 31], lightInk: true },
    { id: 'body', kind: 'text', rect: [62, 417, 366, 184] },
    { id: 'footer', kind: 'missing-content', rect: [36, 608, 354, 38], lightInk: true },
    { id: 'frame-left', kind: 'asset', assetRole: 'frame', rect: [39, 111, 18, 240] },
    { id: 'frame-right', kind: 'asset', assetRole: 'frame', rect: [433, 111, 18, 240] },
    { id: 'type-border', kind: 'asset', assetRole: 'boxes', rect: [62, 404, 366, 8] },
  ];
  if (manaCount)
    list.push({
      id: 'mana',
      kind: 'asset',
      assetRole: 'mana',
      rect: [Math.floor(manaX - 3), 24, Math.ceil(452 - manaX), 35],
    });
  if (result.face.power != null)
    list.push({
      id: 'stats',
      kind: 'text',
      // Reviewed long expressions reach well left of the ordinary three-character box.
      // This window depends on expected content, never a fitted scan displacement.
      rect:
        `${result.face.power}/${result.face.toughness}`.length > 3
          ? [326, 607, 134, 33]
          : [393, 607, 67, 33],
      lightInk: true,
    });
  return list;
}
