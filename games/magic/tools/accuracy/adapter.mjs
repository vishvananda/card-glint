import { reviewedPrintingFields } from './printing-fields.mjs';
import { reviewedArtCrop } from './art-crop.mjs';
import { historicArtifactAnnotation } from './historic-artifact-types.mjs';
import { historicLegendAnnotation } from './historic-legend-types.mjs';
import { historicLegendsTextAnnotation } from './historic-legends-text.mjs';
import { historicManaOrderAnnotation } from './historic-mana-order.mjs';
import { earlyLandTypeAnnotation } from './early-land-types.mjs';
import { emptyPrintingTextAnnotation } from './empty-printing-text.mjs';
import { printedArtistAnnotation } from './printed-artist.mjs';
import { printedTextOutlierAnnotation } from './printed-text-outliers.mjs';

export function presentation(entry, annotations = {}, printingText = {}) {
  const card = entry.card;
  const historicalReviews = [
    printedArtistAnnotation(entry),
    historicArtifactAnnotation(entry),
    historicLegendAnnotation(entry),
    historicLegendsTextAnnotation(entry),
    earlyLandTypeAnnotation(entry),
    historicManaOrderAnnotation(entry),
    emptyPrintingTextAnnotation(entry),
    printedTextOutlierAnnotation(entry),
  ];
  // One printing can have independently reviewed types and mana order. Retain
  // both partial reviews instead of letting the last field list erase the first.
  const historical = Object.assign({}, ...historicalReviews);
  if (historicalReviews.some((r) => r.reviewedFields))
    historical.reviewedFields = [
      ...new Set(historicalReviews.flatMap((r) => r.reviewedFields ?? [])),
    ];
  const supplied = annotations[card.id] ?? {},
    annotation = {
      ...historical,
      ...supplied,
      // A caller may replace a reviewed empty body, but that new text must not
      // inherit the review of the scan-bound historical wording.
      ...(historical.reviewed &&
      ['rulesText', 'flavorText', 'paragraphs'].some((field) => Object.hasOwn(supplied, field))
        ? { reviewed: supplied.reviewed === true }
        : {}),
      ...(historical.reviewedFields && {
        reviewedFields: [
          ...historical.reviewedFields.filter((field) => !Object.hasOwn(supplied, field)),
          ...(supplied.reviewedFields ?? []),
        ],
      }),
    };
  // A replacement body must be reparsed, not painted using historical runs.
  if (
    !Object.hasOwn(supplied, 'paragraphs') &&
    ['rulesText', 'flavorText'].some((field) => Object.hasOwn(supplied, field))
  )
    delete annotation.paragraphs;
  if (annotation.reviewed && annotation.referenceHash !== entry.reference?.sha256)
    throw Error(`Reviewed text is stale for ${card.name}; review it against the new reference.`);
  const fields = reviewedPrintingFields(entry, annotation);
  const frameColors = fields.frameColors ?? inferredLandPalette(card);
  const artCorrection = reviewedArtCrop(entry);
  const original = printingText[card.id];
  const rules =
    annotation.rulesText ?? original?.originalText ?? card.printed_text ?? card.oracle_text ?? '';
  const flavor = annotation.flavorText ?? card.flavor_text ?? '';
  const rulesText = [rules, flavor].filter(Boolean).join('\n');
  const rulesParagraphs = annotation.paragraphs ?? [
    ...rules
      .split('\n')
      .filter(Boolean)
      .map((text) => ({ role: 'rules', runs: reminderRuns(text) })),
    ...flavor
      .split('\n')
      .filter(Boolean)
      .map((text) => ({
        role: 'flavor',
        runs: text
          .split('*')
          .map((text, i) => ({ text, italic: i % 2 === 0 }))
          .filter((run) => run.text),
      })),
  ];
  const face = {
    name: annotation.name ?? card.name,
    typeLine: annotation.typeLine ?? card.printed_type_line ?? card.type_line,
    colors: card.colors,
    manaSymbols:
      fields.manaSymbols ?? [...(card.mana_cost ?? '').matchAll(/\{([^}]+)\}/g)].map((m) => m[1]),
    rulesText,
    rulesParagraphs,
    illustration: entry.art
      ? `/__accuracy/object/${artCorrection.sourceHash ?? entry.art.sha256}`
      : null,
    ...(artCorrection.crop ? { illustrationCrop: artCorrection.crop } : {}),
    artist: fields.artist ?? card.artist,
    power: Object.hasOwn(fields, 'power') ? fields.power : card.power,
    toughness: Object.hasOwn(fields, 'toughness') ? fields.toughness : card.toughness,
    loyalty: card.loyalty,
    setCode: card.set,
    rarity: card.rarity,
    securityStamp: card.security_stamp ?? 'none',
    collectorNumber: card.collector_number,
    frameStyle: ['1993', '1997'].includes(card.frame) ? 'retro' : 'modern',
    borderColor: card.border_color,
    // 2003 printing geometry is distinct from the later M15 component frame.
    ...(card.frame === '2003' &&
    card.layout === 'normal' &&
    !/\b(Saga|Class|Planeswalker|Battle)\b/.test(card.type_line ?? '') &&
    !/^Level up\b/m.test(card.oracle_text ?? '')
      ? {
          frameAssetFamily: 'eighth',
          ...(card.frame_effects?.includes('colorshifted')
            ? { frameTreatment: 'colorshifted' }
            : {}),
        }
      : {}),
    ...(frameColors === undefined ? {} : { frameColors }),
    // Printed labels such as "Summon" and "Enchant Land" describe visible
    // wording, not the physical frame. Keep the source's semantic traits.
    ...(fields.typeLine === undefined && card.printed_type_line == null
      ? {}
      : {
          creature: /\bCreature\b/.test(card.type_line ?? ''),
          land: /\bLand\b/.test(card.type_line ?? ''),
          artifact: /\bArtifact\b/.test(card.type_line ?? ''),
          legendary: /\bLegendary\b/.test(card.type_line ?? ''),
        }),
    ...(entry.category === 'planeswalker' ? { rulesText: rules } : {}),
  };
  return {
    face,
    reviewedFields: Object.keys(fields),
    contentStatus: annotation.reviewed
      ? 'scan-reviewed'
      : original || card.printed_text != null
        ? 'printing-reference'
        : 'oracle-unverified',
    cohort: annotation.cohort ?? 'corpus',
    annotation,
    artCorrection,
  };
}

/** Fixture adapter convenience; explicit reviewed runs override this heuristic. */
function reminderRuns(text) {
  return text
    .split(/(\([^)]*\))/g)
    .filter(Boolean)
    .map((text) => ({ text, italic: text.startsWith('(') }));
}

/** Scryfall rules colors are empty for ordinary lands. Their one/two-color
 * modern frames follow produced mana, excluding colorless. Keep ambiguous
 * palettes (fetches, rainbow lands, artifact/basic/retro frames) for review;
 * color identity is not a reliable description of the printed frame. */
function inferredLandPalette(card) {
  // Basics and duals can lose their subtypes in original wording (plain
  // "Land"). Preserve the printed palette independently of that label.
  if (!card.colors?.length && /\bLand\b/.test(card.type_line ?? '')) {
    const basicColors = [
      ['Plains', 'W'],
      ['Island', 'U'],
      ['Swamp', 'B'],
      ['Mountain', 'R'],
      ['Forest', 'G'],
    ].filter(([type]) => new RegExp(`\\b${type}\\b`).test(card.type_line));
    if (basicColors.length === 1 || basicColors.length === 2)
      return basicColors.map(([, color]) => color);
  }
  if (
    !['2003', '2015', 'future'].includes(card.frame) ||
    !/\bLand\b/.test(card.type_line ?? '') ||
    /\b(?:Artifact|Basic)\b/.test(card.type_line ?? '') ||
    card.colors?.length
  )
    return undefined;
  const colors = [...'WUBRG'].filter((color) => card.produced_mana?.includes(color));
  return colors.length >= 1 && colors.length <= 2 ? colors : undefined;
}
