import policy from './historic-mana-order.json';
import type { RenderedCardInput } from './face-layout.js';

/** Original cost order is printing content, independent of glyph artwork.
 * Only reorder known costs with identical symbols; never change their meaning.
 * Caller-supplied original wording takes precedence over these defaults. */
export function originalManaOrder(
  face: Pick<RenderedCardInput, 'name' | 'setCode'>,
  symbols: readonly string[],
): string[] {
  const set = face.setCode?.toLowerCase() ?? '';
  const overrides: Record<string, Record<string, string>> = policy.overrides;
  const cost = overrides[set]?.[face.name ?? ''];
  if (cost) {
    const original = [...cost.matchAll(/\{([^}]+)\}/g)].map((m) => m[1]!);
    return [...original].sort().join('|') === [...symbols].sort().join('|')
      ? original
      : [...symbols];
  }
  if (!policy.wubrgSets.includes(set) || symbols.some((s) => !/^(?:\d+|X|[WUBRG])$/.test(s)))
    return [...symbols];
  return [
    ...symbols.filter((s) => !'WUBRG'.includes(s)),
    ...symbols
      .filter((s) => 'WUBRG'.includes(s))
      .sort((a, b) => 'WUBRG'.indexOf(a) - 'WUBRG'.indexOf(b)),
  ];
}
