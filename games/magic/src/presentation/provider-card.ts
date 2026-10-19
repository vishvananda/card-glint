import type { RenderedCardInput, RulesParagraph } from './face-layout.js';
import { withCardWording, type CardWording } from './wording.js';
import type { FrameColor } from './profile.js';
import { originalManaOrder } from './historic-mana-order.js';

/** Imports are pure: callers own downloads, storage and finish selection. */
export interface CardImportOptions {
  /** Omit for a complete composite face or the front of a two-sided card.
   * Set explicitly to inspect/edit one source face or panel. */
  faceIndex?: number;
  wording?: 'oracle' | 'original';
  /** Explicit illustrations replace provider art crops, including null to omit art. */
  illustrations?: readonly (string | null)[];
  symbolStyle?: 'original' | 'modern';
}
export type ProviderRecord = Record<string, unknown>;
export function providerRecord(value: unknown): ProviderRecord {
  if (!value || typeof value !== 'object' || Array.isArray(value))
    throw Error('Expected a card object.');
  return value as ProviderRecord;
}
export function providerText(value: unknown, fallback = '', limit = 32768): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value !== 'string' || value.length > limit) throw Error('Invalid card text.');
  return value;
}
export function providerColors(value: unknown): FrameColor[] {
  if (value === undefined || value === null) return [];
  if (
    !Array.isArray(value) ||
    value.length > 5 ||
    !value.every((c) => typeof c === 'string' && /^[WUBRG]$/.test(c))
  )
    throw Error('Invalid card colors.');
  return [...new Set(value)] as FrameColor[];
}
export function providerCost(value: unknown): string[] {
  const cost = providerText(value, '', 200);
  if (!/^(?:\{[0-9A-Z/∞]+\}\s*)*$/.test(cost)) throw Error('Invalid mana cost.');
  return [...cost.matchAll(/\{([^}]+)\}/g)].map((match) => match[1]!);
}
export function providerArt(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  const text = providerText(value, '', 4096);
  const url = new URL(text);
  if (url.protocol !== 'https:' || url.username || url.password)
    throw Error('Provider artwork requires an HTTPS URL.');
  return url.href;
}
export function providerParagraphs(text: string, flavor = ''): RulesParagraph[] {
  return [
    ...text
      .split('\n')
      .filter(Boolean)
      .map((line) => ({
        role: 'rules' as const,
        runs: line
          .split(/(\([^)]*\))/g)
          .filter(Boolean)
          .map((text) => ({ text, ...(text.startsWith('(') ? { italic: true } : {}) })),
      })),
    ...flavor
      .split('\n')
      .filter(Boolean)
      .map((text) => ({
        role: 'flavor' as const,
        runs: text
          .split('*')
          .map((text, i) => ({ text, italic: i % 2 === 0 }))
          .filter((run) => run.text),
      })),
  ];
}
export function providerWording(
  face: RenderedCardInput,
  oracle: CardWording,
  original: CardWording | undefined,
  options: CardImportOptions,
): RenderedCardInput {
  const mode = options.wording ?? 'oracle';
  if (!['oracle', 'original'].includes(mode)) throw Error('Invalid wording choice.');
  if (options.symbolStyle !== undefined && !['original', 'modern'].includes(options.symbolStyle))
    throw Error('Invalid symbol style.');
  const printed = {
    ...(original ?? oracle),
    manaSymbols: originalManaOrder(face, oracle.manaSymbols ?? []),
  };
  return withCardWording(face, { oracle, original: printed }, mode, {
    symbolStyle: options.symbolStyle ?? 'original',
  });
}
export function providerFace(
  faces: RenderedCardInput[],
  layout: string,
  options: CardImportOptions,
  sharedArt: string | null = null,
): RenderedCardInput {
  if (!faces.length || faces.length > 2) throw Error('Supply one card with at most two faces.');
  if (
    options.illustrations !== undefined &&
    (!Array.isArray(options.illustrations) ||
      options.illustrations.length !== faces.length ||
      !options.illustrations.every(
        (v) => v === null || (typeof v === 'string' && v.length <= 4096),
      ))
  )
    throw Error('Invalid illustration overrides.');
  if (options.illustrations) sharedArt = null;
  faces = faces.map((face, index) => ({
    ...face,
    ...(options.illustrations?.[index] !== undefined
      ? { illustration: options.illustrations[index] }
      : {}),
  }));
  const index = options.faceIndex ?? 0;
  if (!Number.isInteger(index) || index < 0 || index >= faces.length)
    throw Error('This card does not have that face.');
  const battleFront =
    layout === 'battle' ||
    (layout === 'transform' &&
      /\bBattle\b/.test(faces[0]!.canonicalTypeLine ?? faces[0]!.typeLine ?? ''));
  if (
    options.faceIndex !== undefined ||
    faces.length === 1 ||
    ['transform', 'modal_dfc', 'reversible_card', 'meld', 'double_faced_token', 'battle'].includes(
      layout,
    )
  ) {
    const face = faces[index]!;
    const reverse = faces[1];
    return {
      ...face,
      ...(index > 0 && ['transform', 'modal_dfc', 'battle', 'double_faced_token'].includes(layout)
        ? { securityStamp: 'none' as const }
        : {}),
      illustration: face.illustration ?? sharedArt,
      ...(battleFront && index === 0
        ? {
            frameTemplate: 'battle' as const,
            frameAssetFamily: undefined,
            ...(reverse &&
            /\bCreature\b/.test(reverse.canonicalTypeLine ?? reverse.typeLine ?? '') &&
            reverse.power != null &&
            reverse.power !== '' &&
            reverse.toughness != null &&
            reverse.toughness !== ''
              ? { reverseStats: { power: reverse.power, toughness: reverse.toughness } }
              : {}),
          }
        : {}),
    };
  }
  if (!['split', 'aftermath', 'flip', 'adventure', 'prepare', 'room'].includes(layout))
    throw Error('Unsupported multiple-face layout: ' + layout);
  return {
    ...faces[0]!,
    layout: layout === 'room' ? 'split' : layout,
    faces,
    illustration: sharedArt,
    ...(['adventure', 'prepare', 'room'].includes(layout) ? { frameAssetFamily: undefined } : {}),
    ...(layout === 'flip' ? { frameTemplate: 'flip' as const, frameAssetFamily: undefined } : {}),
  };
}
