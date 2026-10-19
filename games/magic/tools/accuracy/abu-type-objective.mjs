import { inkEdges, distances } from './edges.mjs';

/** Portable reference implementation of the optional TextObjective WASM ABI.
 * Local contrast removes paper color; symmetric distances penalize missing ink. */
export class JsTextObjective {
  constructor(gray, width, height) {
    this.width = width;
    this.height = height;
    this.edges = inkEdges(gray, width, height).edges;
    this.distance = distances(this.edges, width, height);
    this.count = this.edges.reduce((a, b) => a + b, 0);
  }
  score(gray) {
    const { width, height } = this;
    if (gray.length !== width * height) throw Error('Objective raster dimensions changed');
    const edges = inkEdges(gray, width, height).edges,
      distance = distances(edges, width, height);
    const forward = [0, 0, 0],
      reverse = [0, 0, 0];
    let count = 0,
      sumA = 0,
      sumB = 0;
    for (let i = 0; i < edges.length; i++) {
      if (this.edges[i]) {
        sumA += Math.min(12, distance[i]);
        for (let t = 0; t < 3; t++) if (distance[i] <= t) forward[t]++;
      }
      if (edges[i]) {
        count++;
        sumB += Math.min(12, this.distance[i]);
        for (let t = 0; t < 3; t++) if (this.distance[i] <= t) reverse[t]++;
      }
    }
    if (count < 5 || this.count < 5) return new Float64Array([-1, 0, 0, 0, 12]);
    const f1 = forward.map((v, t) => {
      const r = v / this.count,
        p = reverse[t] / count;
      return p + r ? (2 * p * r) / (p + r) : 0;
    });
    const chamfer = 0.5 * (sumA / this.count + sumB / count);
    return new Float64Array([
      0.1 * f1[0] + 0.55 * f1[1] + 0.2 * f1[2] + 0.15 * Math.exp(-chamfer / 3),
      ...f1,
      chamfer,
    ]);
  }
  score_raster(rgba, width, origin, rect) {
    return this.score(
      nativeGrayCrop({ data: rgba, width }, [...rect, this.width, this.height], origin),
    );
  }
  free() {}
}

/** Exact subset of the 1.5x bilinear reference normalizer. */
export function nativeGrayCrop(rgba, rect, origin = [0, 0]) {
  const [rx, ry, w, h] = rect,
    out = new Float32Array(w * h);
  for (let y = 0; y < h; y++)
    for (let x = 0; x < w; x++) {
      const xx = (x + rx + 0.5) * 1.5 - 0.5 - origin[0],
        yy = (y + ry + 0.5) * 1.5 - 0.5 - origin[1];
      const l = Math.floor(xx),
        t = Math.floor(yy),
        fx = xx - l,
        fy = yy - t,
        i = (t * rgba.width + l) * 4;
      let v = 0;
      for (let k = 0; k < 3; k++)
        v +=
          [0.2126, 0.7152, 0.0722][k] *
          Math.round(
            (rgba.data[i + k] * (1 - fx) + rgba.data[i + 4 + k] * fx) * (1 - fy) +
              (rgba.data[i + rgba.width * 4 + k] * (1 - fx) +
                rgba.data[i + rgba.width * 4 + 4 + k] * fx) *
                fy,
          );
      out[y * w + x] = v;
    }
  return out;
}
