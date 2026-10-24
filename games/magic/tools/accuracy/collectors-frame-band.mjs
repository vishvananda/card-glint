// The colored top frame in the inspected Collectors scans reaches y=31–33.
// The old y<=30 clamp saw only the darker stock strip above it.
export const collectorsFrameBounds = {
  left: [0, 34],
  right: [454, 487],
  top: [0, 34],
  bottom: [644, 679],
};
const windows = (v, h, span) => ({
  left: ['x', 10, 34, v, span],
  right: ['x', 454, 478, v, span],
  top: ['y', 10, 34, h, span],
  bottom: ['y', 644, 671, h, span],
});
export const collectorsFrameGroups = [
  windows([150, 300, 530], [90, 205, 320], 10),
  windows([205, 370, 580], [140, 255, 375], 10),
  windows([250, 440, 490], [165, 285, 405], 8),
];
export const collectorsInterior = { left: 35, top: 35, right: 454, bottom: 644 };
