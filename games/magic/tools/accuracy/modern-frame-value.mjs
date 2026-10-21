import { nativeFramePatches, nativeRgbPcaFramePatches } from './native-frame-patches.mjs';
import { HSV_FRAME_POLICY, PCA_FRAME_POLICY } from './modern-frame-policy.mjs';

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
export function modernValueFramePatches(image, windows, bounds, policy = HSV_FRAME_POLICY) {
  if (policy !== HSV_FRAME_POLICY && policy !== PCA_FRAME_POLICY)
    throw Error('Unknown native frame policy');
  if (image.data.length !== image.width * image.height * 4)
    throw Error('Frame projection needs complete RGBA pixels');
  const fields =
    policy === PCA_FRAME_POLICY
      ? nativeRgbPcaFramePatches(image, windows, bounds)
      : nativeFramePatches(image, windows, bounds, frameValue(image));
  return fields.map((p) => ({ ...p, channel: policy.channel }));
}

/** Project before canonical resampling too: otherwise the coarse search still
 * reacts to luminance changes and can seed a different parallel frame edge. */
export function frameValueImage(image) {
  const values = frameValue(image);
  const data = new Uint8Array(image.data.length);
  for (let p = 0; p < values.length; p++) {
    const i = p * 4;
    data[i] = data[i + 1] = data[i + 2] = values[p];
    data[i + 3] = image.data[i + 3];
  }
  return { width: image.width, height: image.height, data };
}
