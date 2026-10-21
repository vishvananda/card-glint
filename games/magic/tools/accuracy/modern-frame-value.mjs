import { nativeFramePatches } from './native-frame-patches.mjs';

/** Registration only. HSV value is independent of hue/saturation; affine value
 * gain/offset remains affine before the linear native frame filter. Keep this
 * channel separate from luminance used for text/appearance scoring. */
export function frameValue(image) {
  if (image.data.length !== image.width * image.height * 4)
    throw Error('Frame value needs complete RGBA pixels');
  const values = new Float32Array(image.width * image.height);
  for (let p = 0; p < values.length; p++) {
    const i = p * 4;
    values[p] = Math.max(image.data[i], image.data[i + 1], image.data[i + 2]);
  }
  return values;
}
export function modernValueFramePatches(image, windows, bounds) {
  return nativeFramePatches(image, windows, bounds, frameValue(image)).map((p) => ({
    ...p,
    channel: 'HSV-V-before-native-frame-filter-v1',
  }));
}
