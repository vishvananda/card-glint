import { presentation } from './adapter.mjs';
import { normalizePrintingText } from './printing-text.mjs';
import { reviewedSpecialRecords } from './special-printing-corrections.mjs';

/** Audit adapter only. Physical sides have independent references and artwork;
 * a split card has two panels on one side. Never reuse a front scan for a back. */
export function specialFrameSides(card) {
  if (card.image_uris?.png && card.image_uris.art_crop)
    return [{ key: 'whole', data: card, images: card.image_uris }];
  if (!card.card_faces?.length) throw Error('Missing physical reference');
  return card.card_faces.map((face, index) => {
    if (!face.image_uris?.png || !face.image_uris.art_crop)
      throw Error(`Missing reference for physical side ${index}`);
    return { key: index === 0 ? 'a' : 'b', data: face, images: face.image_uris };
  });
}

/** MTGJSON deliberately has multiple records for a multiface Scryfall ID. */
export function originalFaceRecord(card, data, records) {
  const matches = records.filter(
    (r) =>
      r.identifiers?.scryfallId === card.id &&
      (r.faceName ?? r.name) === data.name &&
      String(r.number).replace(/[ab]$/, '') === card.collector_number &&
      (r.language ?? 'English') === 'English',
  );
  if (matches.length !== 1 || typeof matches[0].originalText !== 'string')
    throw Error(`No unique original wording for ${card.set} ${data.name}`);
  return matches[0];
}

/** Some MTGJSON split printings repeat one joined originalText on both face
 * records. Separate it only with an exact duplicated pair and a single divider;
 * otherwise do not guess. Certain older Gatherer strings include the second
 * type label after the divider, which can be removed by exact type equality. */
export function originalPanelText(card, original, records) {
  const text = normalizePrintingText(original.originalText);
  if (!['split', 'adventure'].includes(card.layout)) return text;
  const pair = card.card_faces.map((data) => originalFaceRecord(card, data, records));
  if (!text.includes(' // ')) {
    if (pair[0].originalText === pair[1].originalText)
      throw Error('Ambiguous duplicated original panel text without a divider; review the scan');
    return text;
  }
  if (pair[0].originalText !== pair[1].originalText || text.split(' // ').length !== 2)
    throw Error('Ambiguous joined original panel text');
  const index = pair.findIndex((r) => r === original);
  if (index < 0) throw Error('Original panel is absent');
  // Gatherer's combined Adventure wording follows the printed book: inset
  // spell first, permanent second. Face identity remains permanent then spell.
  const printedIndex = card.layout === 'adventure' ? 1 - index : index;
  let selected = text.split(' // ')[printedIndex].trim();
  if (
    printedIndex === 1 &&
    original.originalType &&
    selected.startsWith(original.originalType + '\n')
  )
    selected = selected.slice(original.originalType.length + 1);
  return selected;
}

/** Gatherer-derived split records can repeat the other half's originalType.
 * Retain the conflict explicitly. Only the two bare spell types can use the
 * agreeing per-face provider fields; never infer historical creature subtypes. */
export function originalPanelType(card, data, original, records) {
  const typeLine = original.originalType ?? data.type_line;
  if (
    card.layout === 'adventure' &&
    /^(Instant|Sorcery)\s*[—–-]\s*Adventure$/.test(data.type_line ?? '') &&
    original.type === data.type_line &&
    typeLine !== data.type_line
  ) {
    const pair = card.card_faces.map((f) => originalFaceRecord(card, f, records));
    if (
      pair[0].originalType === pair[1].originalType &&
      pair[0].originalText === pair[1].originalText &&
      normalizePrintingText(original.originalText).split(' // ').length === 2
    )
      return {
        typeLine: data.type_line,
        issue: {
          kind: 'duplicated-adventure-original-type',
          originalType: typeLine,
          selectedType: data.type_line,
          source: 'agreeing-mtgjson-type-and-scryfall-face-type',
        },
      };
  }
  if (
    card.layout !== 'split' ||
    !['Instant', 'Sorcery'].includes(typeLine) ||
    !['Instant', 'Sorcery'].includes(data.type_line) ||
    typeLine === data.type_line ||
    original.type !== data.type_line
  )
    return { typeLine };
  const pair = card.card_faces.map((face) => originalFaceRecord(card, face, records));
  if (
    pair.length !== 2 ||
    pair[0].originalType !== pair[1].originalType ||
    pair[0].originalText !== pair[1].originalText ||
    normalizePrintingText(original.originalText).split(' // ').length !== 2
  )
    return { typeLine };
  return {
    typeLine: data.type_line,
    issue: {
      kind: 'duplicated-split-original-type',
      originalType: typeLine,
      selectedType: data.type_line,
      source: 'agreeing-mtgjson-type-and-scryfall-face-type',
    },
  };
}

export function specialFrameInput(card, side, reference, art, records) {
  records = reviewedSpecialRecords(card, reference, records);
  const originals = [];
  const face = (data, physicalSide) => {
    const original = originalFaceRecord(card, data, records);
    const type = originalPanelType(card, data, original, records);
    originals.push({
      uuid: original.uuid,
      side: original.side ?? null,
      ...(original.reviewedCorrection ? { reviewedCorrection: original.reviewedCorrection } : {}),
      ...(type.issue ? { typeIssue: type.issue } : {}),
    });
    const rules = originalPanelText(card, original, records);
    const merged = {
      ...card,
      ...data,
      card_faces: undefined,
      // Identity remains the physical printing, not a face's Oracle ID.
      id: card.id,
      layout: physicalSide ? card.layout : 'normal',
      colors: data.colors ?? original.colors ?? (data === card ? card.colors : []) ?? [],
      // A parent's flavor belongs to neither inset nor reverse by inheritance.
      flavor_text: data.flavor_text,
      printed_type_line: type.typeLine,
    };
    return {
      ...presentation({ card: merged, reference, art }, {}, { [card.id]: { originalText: rules } })
        .face,
      layout: card.layout,
      ...(physicalSide &&
      /\bSaga\b/.test(merged.printed_type_line ?? '') &&
      card.card_faces?.[1]?.power != null &&
      card.card_faces[1].toughness != null
        ? {
            reverseStats: {
              power: card.card_faces[1].power,
              toughness: card.card_faces[1].toughness,
            },
          }
        : {}),
      wordingMode: 'original',
      symbolStyle: 'original',
      colorCalibration: 'set-hsb-v1',
    };
  };
  if (side.key !== 'whole' || !card.card_faces?.length)
    return { face: face(side.data, true), originals };
  const halves = card.card_faces.map((data) => face(data, false));
  // A shared art sheet goes through the library's own split cropping policy.
  // Remove the per-half URL so this audit exercises that policy, not a substitute.
  for (const half of halves) {
    delete half.illustration;
    delete half.frameAssetFamily;
  }
  if (card.layout === 'adventure')
    return {
      face: {
        ...halves[0],
        layout: 'adventure',
        illustration: `/__accuracy/object/${art.sha256}`,
        faces: halves,
      },
      originals,
    };
  return {
    face: {
      name: card.name,
      layout: card.layout,
      typeLine: card.type_line,
      colors: card.colors ?? [],
      setCode: card.set,
      rarity: card.rarity,
      borderColor: card.border_color,
      collectorNumber: card.collector_number,
      artist: card.artist,
      illustration: `/__accuracy/object/${art.sha256}`,
      faces: halves,
    },
    originals,
  };
}
