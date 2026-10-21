// Experimental M21 ordinary planeswalker scoring windows, in 488 × 680 pixels.
// These are fixed physical fields, not detected ink bounds or scan adjustments.
export function m21PlaneswalkerRegions(kind, card, face) {
  if (
    card.set?.toLowerCase() !== 'm21' ||
    card.frame !== '2015' ||
    card.border_color !== 'black' ||
    !/\bPlaneswalker\b/.test(card.type_line ?? '') ||
    face.frameTemplate ||
    face.frameAssetFamily ||
    (card.frame_effects ?? []).some((effect) =>
      ['showcase', 'extendedart', 'borderless'].includes(effect),
    ) ||
    !['planeswalker', 'planeswalker-large'].includes(kind)
  )
    return [];
  const lines = (face.rulesText ?? '').split('\n').filter((s) => s.trim()),
    badge = (s) => /^\s*\[?[+−-]?(?:\d+|X)\]?\s*:/i.test(s),
    large = kind === 'planeswalker-large';
  // M21's four-ability frame has one static first row and three loyalty rows.
  // Other populations need their own physical-window review, not silent reuse.
  if (
    large
      ? lines.length !== 4 || badge(lines[0]) || !lines.slice(1).every(badge)
      : lines.length !== 3 || !lines.every(badge)
  )
    return [];
  const typeY = large ? 334 : 380,
    bodyY = large ? 371 : 422,
    mana = face.manaSymbols?.length ?? 0,
    manaLeft = Math.max(185, 460 - mana * 25.5);
  const rows = [
    { id: 'title', rect: [34, 27, (mana ? manaLeft - 7 : 453) - 34, 42], kind: 'ink' },
    {
      id: 'mana',
      rect: [Math.floor(manaLeft - 4), 25, Math.ceil(466 - manaLeft), 43],
      kind: 'gradient',
      applicable: mana > 0,
    },
    {
      id: 'type',
      rect: [37, typeY + 5, 347, 34],
      kind: 'ink',
      verified: !/fallback/i.test(face.typeSource ?? ''),
    },
    { id: 'symbol', rect: [385, typeY - 2, 77, 43], kind: 'gradient' },
    { id: 'art', rect: [59, 82, 370, large ? 231 : 277], kind: 'gradient' },
    {
      id: 'stats',
      part: 'starting-loyalty',
      rect: [382, 596, 81, 50],
      kind: 'ink',
      lightInk: true,
    },
    {
      id: 'stats',
      part: 'ability-badges',
      rect: [18, large ? 441 : 424, 67, large ? 178 : 195],
      kind: 'gradient',
    },
    {
      id: 'credits',
      rect: [27, 638, 434, 31],
      kind: 'ink',
      lightInk: true,
      verified: false,
      reason:
        'Exact printed legal text is not verified for every printing; inspect this diagnostic visually.',
    },
  ];
  const contentVerified = !/fallback|unverified/i.test(face.rulesSource ?? '');
  if (large)
    rows.push({
      id: 'rules',
      part: 'static',
      rect: [63, 378, 386, 63],
      kind: 'ink',
      verified: contentVerified,
    });
  rows.push({
    id: 'rules',
    part: 'loyalty-text',
    rect: [86, large ? 442 : 425, 363, large ? 177 : 194],
    kind: 'ink',
    verified: contentVerified,
  });
  const frame = [
    [30, 21, 425, 7],
    [28, 61, 430, 8],
    [38, 81, 21, 28],
    [429, 81, 21, 28],
    [23, 125, 21, 90],
    [445, 125, 21, 90],
    [20, 225, 20, large ? 65 : 105],
    [448, 225, 20, large ? 65 : 105],
    [40, typeY - 12, 407, 14],
    [29, typeY + 34, 428, 9],
    [15, bodyY + 10, 20, large ? 50 : 8],
    [15, large ? 490 : 480, 20, 8],
    [15, large ? 548 : 544, 20, 8],
    [27, 610, 65, 22],
    [449, bodyY + 10, 22, 580 - bodyY],
    [96, 620, 105, 15],
    [290, 620, 95, 15],
  ];
  frame.forEach((rect, part) => rows.push({ id: 'frame', part, rect, kind: 'gradient' }));
  for (const [i, rect] of [
    [0, 0, 32, 32],
    [456, 0, 32, 32],
    [0, 648, 32, 32],
    [456, 648, 32, 32],
  ].entries())
    rows.push({ id: 'frame', part: 'corner-' + i, rect, kind: 'gradient', matte: 255 });
  return rows.map((r) => ({ applicable: true, verified: true, ...r }));
}
