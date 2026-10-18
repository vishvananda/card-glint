/** Two-color source preparation only. A thick glyph may cross any fixed probe
 * near the disc rim. Its opaque upper-decile color still identifies the paper;
 * ignoring fractional-alpha pixels avoids unpremultiplication noise. */
export function opaqueManaPaper(pixels: Uint8ClampedArray): readonly [number, number, number] {
  if (!pixels.length || pixels.length % 4) throw Error('Invalid mana source pixels.');
  const histogram = new Uint32Array(766);
  let count = 0;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] !== 255) continue;
    const level = pixels[i]! + pixels[i + 1]! + pixels[i + 2]!;
    histogram[level] = histogram[level]! + 1;
    count++;
  }
  if (!count) throw Error('Mana source has no opaque paper sample.');
  let cumulative = 0,
    selected = 0;
  for (; selected < histogram.length; selected++) {
    cumulative += histogram[selected]!;
    if (cumulative >= count * 0.9) break;
  }
  for (let i = 0; i < pixels.length; i += 4)
    if (pixels[i + 3] === 255 && pixels[i]! + pixels[i + 1]! + pixels[i + 2]! === selected)
      return [pixels[i]!, pixels[i + 1]!, pixels[i + 2]!];
  throw Error('Mana source paper sample is inconsistent.');
}
