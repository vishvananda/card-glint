import { fromScryfallCard } from './scryfall-card.js';
import {
  providerRecord,
  providerText,
  providerFace,
  type CardImportOptions,
} from './provider-card.js';
import type { RenderedCardInput } from './face-layout.js';
import { mtgjsonOriginalPanels } from './mtgjson-panels.js';
import { mtgjsonProducedMana } from './provider-appearance.js';

/** Accept a CardSet/CardAtomic record, or the associated face records of one card.
 * MTGJSON has no artwork field: supply options.illustrations when available. */
export function fromMtgjsonCard(
  value: unknown,
  options: CardImportOptions = {},
): RenderedCardInput {
  const records = (Array.isArray(value) ? value : [value]).map(providerRecord);
  const supplied = [...records];
  if (!records.length || records.length > 2)
    throw Error('Supply the associated records of one MTGJSON card.');
  if (
    options.illustrations !== undefined &&
    (!Array.isArray(options.illustrations) || options.illustrations.length !== records.length)
  )
    throw Error('Supply one illustration override per input record.');
  if (records.length > 1) {
    const [a, b] = records as [Record<string, unknown>, Record<string, unknown>];
    if (
      (a.uuid !== undefined && a.uuid === b.uuid) ||
      (a.side !== undefined && a.side === b.side) ||
      a.layout !== b.layout
    )
      throw Error('Supply two distinct associated MTGJSON faces with the same layout.');
    const related = (x: Record<string, unknown>, y: Record<string, unknown>) =>
      typeof y.uuid === 'string' &&
      Array.isArray(x.otherFaceIds) &&
      x.otherFaceIds.includes(y.uuid);
    const linked = related(a, b) || related(b, a);
    const identifiers = [a.uuid, b.uuid, a.otherFaceIds, b.otherFaceIds].some(
      (v) => v !== undefined,
    );
    const atomicPair =
      a.name === b.name &&
      typeof a.faceName === 'string' &&
      typeof b.faceName === 'string' &&
      a.faceName !== b.faceName;
    if (
      (identifiers ? !linked : !atomicPair) ||
      (a.setCode !== undefined && b.setCode !== undefined && a.setCode !== b.setCode) ||
      (a.number !== undefined &&
        b.number !== undefined &&
        providerText(a.number).replace(/[ab]$/, '') !==
          providerText(b.number).replace(/[ab]$/, '')) ||
      [
        [a, b],
        [b, a],
      ].some(([x, y]) => Array.isArray(x!.otherFaceIds) && !x!.otherFaceIds.includes(y!.uuid))
    )
      throw Error('The MTGJSON records are not associated faces of one card.');
    if (records.every((row) => typeof row.side === 'string'))
      records.sort((a, b) => providerText(a.side).localeCompare(providerText(b.side)));
  }
  const card = records[0]!,
    layout = providerText(card.layout, 'normal', 64);
  if (
    records.length === 1 &&
    ['split', 'aftermath', 'flip', 'adventure', 'prepare', 'room'].includes(layout)
  )
    throw Error('Supply both MTGJSON face records for this layout.');
  const originals =
    options.wording === 'original' ? mtgjsonOriginalPanels(records, layout) : undefined;
  const faces = records.map((row, index) => ({
    name: row.faceName ?? row.name,
    type_line: row.type,
    oracle_text: row.text ?? '',
    mana_cost: row.manaCost ?? '',
    colors: row.colors,
    produced_mana: mtgjsonProducedMana(providerText(row.text)),
    watermark: row.watermark,
    power: row.power,
    toughness: row.toughness,
    loyalty: row.loyalty,
    defense: row.defense,
    artist: row.artist,
    flavor_text: row.flavorText,
    printed_type_line: originals?.[index]?.type ?? row.originalType,
    printed_text: originals?.[index]?.text ?? row.originalText,
  }));
  const painted = records.map((row, index) =>
    fromScryfallCard(
      {
        ...faces[index],
        set: row.setCode,
        rarity: row.rarity,
        collector_number: row.number,
        frame: row.frameVersion,
        frame_effects: row.frameEffects,
        border_color: row.borderColor,
        security_stamp: row.securityStamp,
        textless: row.isTextless,
      },
      {
        wording: options.wording,
        symbolStyle: options.symbolStyle,
        includeFlavorText: options.includeFlavorText,
      },
    ),
  );
  return providerFace(painted, layout, {
    ...options,
    ...(options.illustrations
      ? { illustrations: records.map((row) => options.illustrations![supplied.indexOf(row)]!) }
      : {}),
  });
}
