import { fontGeometryProbes } from './magic-font-geometry-probes.mjs';
self.onmessage = async ({ data }) => {
  try {
    self.postMessage({ result: await fontGeometryProbes(data) });
  } catch (error) {
    self.postMessage({ error: String(error?.stack || error) });
  }
};
