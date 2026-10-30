/** Isolate older cache studies from the separately tested modern-cost revision.
 * Preserve every other value, including ordinary strings and unknown tags.
 * Production keys remain unchanged; tests/magic-symbol-placement.mjs checks them.
 */
export function withoutModernCostRevision(key) {
  const strip = (value) =>
    Array.isArray(value)
      ? value
          .filter(
            (entry) =>
              entry !== 'explicit-font-geometry-v1' &&
              !(
                Array.isArray(entry) &&
                entry.length === 1 &&
                entry[0] === 'modern-retro-cost-geometry-v1'
              ),
          )
          .map(strip)
      : value;
  return JSON.stringify(strip(JSON.parse(key)));
}
