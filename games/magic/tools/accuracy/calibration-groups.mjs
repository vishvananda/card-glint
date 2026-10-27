import assert from 'node:assert/strict';

/** Inventory dimensions, not a claim that a layout has a working adapter.
 * Keep unusual ordinary printings and foil-only references in the denominator. */
export function calibrationVariant(card, { frameColors } = {}) {
  if (frameColors !== undefined)
    assert(
      Array.isArray(frameColors) &&
        frameColors.every((color) => typeof color === 'string' && /^[WUBRG]$/.test(color)),
      'Reviewed frame palette must contain only WUBRG colors.',
    );
  const type = card.type_line ?? '';
  const basic = /\bBasic\b/.test(type) && /\bLand\b/.test(type);
  const land = /\bLand\b/.test(type);
  const palette = [...new Set(frameColors ?? (land ? card.produced_mana : card.colors) ?? [])]
    .filter((c) => 'WUBRG'.includes(c))
    .sort((a, b) => 'WUBRG'.indexOf(a) - 'WUBRG'.indexOf(b));
  const kind = /\bPlaneswalker\b/.test(type)
    ? 'planeswalker'
    : /\bSaga\b/.test(type)
      ? land
        ? 'land-saga'
        : 'saga'
      : /\bBattle\b/.test(type)
        ? 'battle'
        : /\bClass\b/.test(type)
          ? 'class'
          : land
            ? basic
              ? 'basic-land'
              : 'land'
            : /\bArtifact\b/.test(type)
              ? /\bCreature\b/.test(type)
                ? 'artifact-creature'
                : 'artifact'
              : /\bCreature\b/.test(type)
                ? 'creature'
                : 'spell';
  const legendary = /\bLegendary\b/.test(type) && kind !== 'planeswalker';
  const effects = [...(card.frame_effects ?? [])].sort();
  const traits = {
    frame: card.frame ?? 'unknown',
    border: card.border_color ?? 'unknown',
    layout: card.layout ?? 'unknown',
    palette: palette.join('') || 'C',
    ...(frameColors !== undefined ? { paletteSource: 'reviewed-printing' } : {}),
    kind,
    legendary,
    effects,
    stamp: card.security_stamp ?? 'none',
    referenceFinish: card.nonfoil === false ? 'foil-only' : 'nonfoil',
  };
  return {
    ...traits,
    key: [
      traits.frame,
      traits.border,
      traits.layout,
      traits.palette,
      kind,
      legendary ? 'legendary' : 'ordinary',
      effects.join('+') || 'plain',
      traits.stamp,
      traits.referenceFinish,
    ].join('/'),
  };
}

export function calibrationApplicability(cards) {
  const any = (f) => cards.some(f);
  const faces = cards.flatMap((c) => c.card_faces ?? [c]);
  const applicable = {
    manaGeometry: faces.some((c) => c.mana_cost),
    manaColor: faces.some((c) => c.mana_cost),
    flavor: faces.some((c) => c.flavor_text),
    stats: faces.some((c) => c.power != null || c.loyalty != null || c.defense != null),
    // Early core printings intentionally have no expansion symbol.
    setSymbol: any((c) => !['lea', 'leb', '2ed', '3ed', '4ed'].includes(c.set)),
    specialComponents: any(
      (c) =>
        c.layout !== 'normal' ||
        (c.security_stamp && c.security_stamp !== 'none') ||
        /\b(Basic|Planeswalker|Saga|Class|Battle)\b/.test(c.type_line ?? ''),
    ),
  };
  const reasons = {
    manaGeometry:
      'No mana cost on any face; inline and basic-land symbols remain in rules/special components.',
    manaColor:
      'No mana cost on any face; inline and basic-land symbols remain in rules/special components.',
    flavor:
      'No printing in this variant has supplied flavor text; wording verification must confirm this.',
    stats: 'No power/toughness, loyalty or defense on any face in this variant.',
    setSymbol: 'These original early core printings have no expansion symbol.',
    specialComponents:
      'Ordinary frame without a stamp, basic-land glyph or dedicated layout component.',
  };
  return { applicable, reasons };
}
