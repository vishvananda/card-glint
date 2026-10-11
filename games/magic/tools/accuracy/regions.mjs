/** Reference regions in the 488 x 680 comparison grid; independent of the painter's rectangles. */
export function regions(result) {
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
