import { blur, distances, inkEdges } from './edges.mjs';

const masked = (values, mask) => {
  for (let i = 0; i < values.length; i++) if (!mask[i]) values[i] = 0;
  return values;
};
const sum = (v) => v.reduce((a, b) => a + b, 0);

/** Fixed reference mask excludes frame badges/stamps, never candidate ink.
 * Filled-ink overlap prevents extra outline edges from winning on their own.
 * This offline search objective is distinct from the published set metric. */
export class TextFilledObjective {
  constructor(gray, width, height, mask) {
    if (gray.length !== width * height || mask.length !== gray.length)
      throw Error('Text objective dimensions disagree');
    this.width = width;
    this.height = height;
    this.mask = mask;
    const reference = inkEdges(gray, width, height);
    this.edges = masked(reference.edges, mask);
    this.distance = distances(this.edges, width, height);
    this.count = sum(this.edges);
    this.ink = masked(blur(masked(reference.ink, mask), width, height), mask);
    this.energy = this.ink.reduce((a, b) => a + b * b, 0);
  }
  score(gray) {
    const { width, height, mask } = this;
    if (gray.length !== mask.length) throw Error('Text objective raster changed');
    const rendered = inkEdges(gray, width, height);
    const edges = masked(rendered.edges, mask);
    const count = sum(edges);
    if (count < 5 || this.count < 5) return { score: -1, edge: 0, filled: 0, chamfer: 12 };
    const distance = distances(edges, width, height);
    const hitsA = [0, 0, 0],
      hitsB = [0, 0, 0];
    let sumA = 0,
      sumB = 0;
    for (let i = 0; i < edges.length; i++) {
      if (this.edges[i]) {
        sumA += Math.min(12, distance[i]);
        for (let t = 0; t < 3; t++) if (distance[i] <= t) hitsA[t]++;
      }
      if (edges[i]) {
        sumB += Math.min(12, this.distance[i]);
        for (let t = 0; t < 3; t++) if (this.distance[i] <= t) hitsB[t]++;
      }
    }
    const f1 = hitsA.map((v, t) => {
      const r = v / this.count,
        p = hitsB[t] / count;
      return p + r ? (2 * p * r) / (p + r) : 0;
    });
    const chamfer = (sumA / this.count + sumB / count) / 2;
    const edge = 0.1 * f1[0] + 0.55 * f1[1] + 0.2 * f1[2] + 0.15 * Math.exp(-chamfer / 3);
    const ink = masked(blur(masked(rendered.ink, mask), width, height), mask);
    let product = 0,
      energy = 0;
    for (let i = 0; i < ink.length; i++) {
      product += this.ink[i] * ink[i];
      energy += ink[i] * ink[i];
    }
    const filled = (2 * product) / (this.energy + energy);
    return { score: 0.55 * edge + 0.45 * filled, edge, filled, chamfer };
  }
}
