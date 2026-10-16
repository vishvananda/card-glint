import { resolveScryfallPrinting } from './scryfall-printing.js';
import { providerFrameAppearance, providerLandPalette } from './provider-appearance.js';
import type { RenderedCardInput } from './face-layout.js';
import {
  providerRecord,
  providerText,
  providerColors,
  providerCost,
  providerArt,
  providerParagraphs,
  providerWording,
  providerFace,
  type CardImportOptions,
} from './provider-card.js';

/** Convert one Scryfall Card object to a ready-to-render Magic card. No fetches.
 * Only art_crop is an illustration; full-card scan URLs are never substituted. */
export function fromScryfallCard(
  value: unknown,
  options: CardImportOptions = {},
): RenderedCardInput {
  const card = providerRecord(value),
    name = providerText(card.name, '', 256);
  if (!name.trim()) throw Error('The Scryfall card needs a name.');
  const input = card.card_faces === undefined ? [card] : card.card_faces;
  if (!Array.isArray(input) || !input.length || input.length > 2)
    throw Error('Supply one Scryfall card with at most two faces.');
  const appearance = resolveScryfallPrinting({
    set: providerText(card.set),
    frame: providerText(card.frame),
    frame_effects: card.frame_effects === undefined ? undefined : textList(card.frame_effects),
    border_color: providerText(card.border_color),
    security_stamp: providerText(card.security_stamp),
    textless: card.textless === true,
  });
  const image = (record: Record<string, unknown>) =>
    record.image_uris ? providerArt(providerRecord(record.image_uris).art_crop) : null;
  const rarities = ['common', 'uncommon', 'rare', 'mythic', 'special', 'bonus'] as const;
  const rarity = rarities.find((r) => r === (card.rarity ?? 'common'));
  if (!rarity) throw Error('Invalid card rarity.');
  const faces = input.map((value, index) => {
    const face = providerRecord(value),
      typeLine = providerText(face.type_line, providerText(card.type_line), 512);
    if (!typeLine.trim()) throw Error('The Scryfall face needs a type line.');
    const rulesText = providerText(face.oracle_text);
    const cost = providerCost(face.mana_cost);
    const colors = providerColors(
      face.colors ??
        face.color_indicator ??
        (input.length === 1
          ? card.colors
          : [...'WUBRG'].filter(
              (c) =>
                cost.some((symbol) => symbol.split('/').includes(c)) &&
                (card.colors == null ||
                  providerColors(card.colors).includes(c as 'W' | 'U' | 'B' | 'R' | 'G')),
            )),
    );
    const frameColors = providerLandPalette(
      typeLine,
      colors,
      appearance.setCode,
      providerText(card.frame),
      face.produced_mana ?? card.produced_mana,
    );
    const oracle = {
      name: providerText(face.name, name, 256),
      typeLine,
      rulesText,
      manaSymbols: cost,
      rulesParagraphs: providerParagraphs(rulesText, providerText(face.flavor_text)),
    };
    const hasOriginal =
      typeof face.printed_text === 'string' ||
      typeof face.printed_type_line === 'string' ||
      typeof face.printed_name === 'string';
    const original = hasOriginal
      ? {
          ...oracle,
          name: providerText(face.printed_name, oracle.name, 256),
          typeLine: providerText(face.printed_type_line, typeLine, 512),
          rulesText: providerText(face.printed_text, rulesText),
          rulesParagraphs: providerParagraphs(
            providerText(face.printed_text, rulesText),
            providerText(face.flavor_text),
          ),
        }
      : undefined;
    return providerWording(
      {
        ...providerFrameAppearance(appearance, typeLine, rulesText),
        ...(index > 0 &&
        ['transform', 'modal_dfc', 'battle', 'double_faced_token'].includes(String(card.layout))
          ? { securityStamp: 'none' as const }
          : {}),
        name: oracle.name,
        colors,
        ...(frameColors ? { frameColors } : {}),
        rarity,
        artist: providerText(face.artist, providerText(card.artist), 256),
        collectorNumber: providerText(card.collector_number, '', 64),
        ...(typeof card.lang === 'string' && /^[a-z]{2,5}$/i.test(card.lang)
          ? { collectorLanguage: card.lang }
          : {}),
        ...(face.watermark == null && card.watermark == null
          ? {}
          : { watermark: providerText(face.watermark ?? card.watermark, '', 64) }),
        power: face.power == null ? undefined : providerText(face.power),
        toughness: face.toughness == null ? undefined : providerText(face.toughness),
        loyalty: face.loyalty == null ? undefined : providerText(face.loyalty),
        defense: face.defense == null ? undefined : providerText(face.defense),
        illustration: image(face),
        colorCalibration: 'set-hsb-v1',
      },
      oracle,
      original,
      options,
    );
  });
  let layout = providerText(card.layout, 'normal', 64);
  if (
    input.length === 1 &&
    ['split', 'aftermath', 'flip', 'adventure', 'prepare', 'room'].includes(layout)
  )
    throw Error('Supply both Scryfall faces for this layout.');
  if (layout === 'split' && /\bAftermath\b/.test(faces[1]?.rulesText ?? '')) layout = 'aftermath';
  return providerFace(faces, layout, options, input.length > 1 ? image(card) : null);
}
function textList(value: unknown): string[] {
  if (!Array.isArray(value) || value.length > 32) throw Error('Invalid frame effects.');
  return value.map((item) => providerText(item, '', 64));
}
