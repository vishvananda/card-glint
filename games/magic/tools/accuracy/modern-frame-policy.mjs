// Fixed per-geometry comparison policy. Never tune projection per printing.
import { NATIVE_FRAME_FILTER } from './native-frame-patches.mjs';
import { RGB_PCA_CHANNEL, RGB_PCA_FILTER } from './native-frame-rgb-projection.mjs';
export const MODERN_FRAME_CHANNEL = 'HSV-V-coarse-family-fine-v2';
export const HSV_FRAME_POLICY = Object.freeze({
  key: 'hsv-value-native0.8-v1',
  channel: 'HSV-V-before-native-frame-filter-v1',
  filter: NATIVE_FRAME_FILTER,
  fineSearch: 'coarse-seeds-v1',
});
export const PCA_FRAME_POLICY = Object.freeze({
  key: 'strip-rgb-pca-native0.4-v1',
  channel: RGB_PCA_CHANNEL,
  filter: RGB_PCA_FILTER,
  fineSearch: 'vertical-reserve-multistart-v1',
});
export function modernFramePolicy(kind) {
  if (typeof kind !== 'string' || !kind) throw Error('Missing frame geometry');
  if (kind === 'planeswalker' || kind === 'planeswalker-large') return PCA_FRAME_POLICY;
  if (kind.startsWith('planeswalker')) throw Error('Unreviewed planeswalker geometry');
  return HSV_FRAME_POLICY;
}
export function observationFramePolicy(observations, row) {
  if (observations.channel === 'HSV-V-coarse-and-native-v1') {
    if (row.finePolicy !== undefined && row.finePolicy !== HSV_FRAME_POLICY.key)
      throw Error('Legacy observations cannot carry a new projection policy');
    return HSV_FRAME_POLICY;
  }
  if (observations.channel !== MODERN_FRAME_CHANNEL) throw Error('Unknown frame channel');
  const policy = modernFramePolicy(row.kind);
  if (row.finePolicy !== policy.key) throw Error('Frame geometry/projection policy mismatch');
  return policy;
}
export function requireFramePatchPolicy(partitions, policy) {
  if (!partitions.flat().every((p) => p.filter === policy.filter && p.channel === policy.channel))
    throw Error('Frame fields do not match the declared projection/filter policy');
}
