import { inkEdges } from './edges.mjs';
import { TextFilledObjective } from './text-filled-objective.mjs';

/** Reference-only divider detection. A long, locally dark horizontal strip must
 * be supported across the field; text, texture and badges cannot define a split.
 * Ambiguous or absent dividers stay explicit rather than borrowing candidate ink. */
export function referenceRulesDivider(gray, width, height, mask) {
  if (gray.length !== width * height || mask.length !== gray.length)
    throw Error('Role objective dimensions disagree');
  const candidates = [];
  for (let y = 8; y < height - 8; y++) {
    let valid = 0,
      hits = 0,
      run = 0,
      longest = 0,
      contrastSum = 0;
    for (let x = 6; x < width - 6; x++) {
      const i = y * width + x;
      if (!mask[i] || !mask[i - 4 * width] || !mask[i + 4 * width]) {
        run = 0;
        continue;
      }
      valid++;
      const paper =
        (gray[i - 4 * width] + gray[i - 3 * width] + gray[i + 3 * width] + gray[i + 4 * width]) / 4;
      const center = Math.min(gray[i - width], gray[i], gray[i + width]);
      const contrast = paper - center;
      if (contrast >= 5) {
        hits++;
        longest = Math.max(longest, ++run);
        contrastSum += contrast;
      } else run = 0;
    }
    if (valid >= width * 0.8 && hits / valid >= 0.78 && longest >= width * 0.55)
      candidates.push({ y, support: hits / valid, contrast: contrastSum / hits });
  }
  const clusters = [];
  for (const candidate of candidates) {
    const previous = clusters.at(-1);
    if (previous && candidate.y - previous.at(-1).y <= 3) previous.push(candidate);
    else clusters.push([candidate]);
  }
  if (clusters.length !== 1)
    return {
      status: clusters.length ? 'ambiguous-divider' : 'missing-divider',
      candidates: clusters.map((c) => c.map((r) => r.y)),
    };
  const best = clusters[0].reduce((a, b) =>
    b.support * b.contrast > a.support * a.contrast ? b : a,
  );
  return { status: 'measured', ...best, candidates: [clusters[0].map((r) => r.y)] };
}

function lineBands(gray, width, height, mask) {
  const { ink } = inkEdges(gray, width, height);
  const seen = new Uint8Array(ink.length),
    queue = new Int32Array(ink.length),
    components = [];
  for (let start = 0; start < ink.length; start++) {
    if (seen[start] || !ink[start] || !mask[start]) continue;
    let head = 0,
      tail = 1,
      left = width,
      right = 0,
      top = height,
      bottom = 0;
    queue[0] = start;
    seen[start] = 1;
    while (head < tail) {
      const i = queue[head++],
        x = i % width,
        y = Math.floor(i / width);
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
      for (let yy = Math.max(0, y - 1); yy <= Math.min(height - 1, y + 1); yy++)
        for (let xx = Math.max(0, x - 1); xx <= Math.min(width - 1, x + 1); xx++) {
          const j = yy * width + xx;
          if (!seen[j] && ink[j] && mask[j]) {
            seen[j] = 1;
            queue[tail++] = j;
          }
        }
    }
    // Ignore paper grain, divider/border strokes, and connected panel edges.
    // The accepted range spans 15–26px body fonts in canonical pixels.
    if (
      bottom - top + 1 >= 6 &&
      bottom - top + 1 <= 32 &&
      right - left + 1 >= 2 &&
      right - left + 1 <= 100 &&
      tail >= 9 &&
      tail <= 1200
    )
      components.push({ left, right, top, bottom, area: tail });
  }
  // Lower ink edges cluster at the baseline, with small descender differences.
  // Unlike whole-row projection this does not merge neighboring lines when
  // descenders and ascenders occupy the same horizontal row.
  const density = new Float64Array(height);
  for (const c of components)
    for (let y = Math.max(0, c.bottom - 2); y <= Math.min(height - 1, c.bottom + 2); y++)
      density[y] += Math.sqrt(c.area);
  const peaks = Array.from(density, (weight, y) => ({ weight, y }))
      .filter((p) => p.weight > 0)
      .sort((a, b) => b.weight - a.weight || a.y - b.y),
    selected = [];
  for (const p of peaks) {
    if (selected.some((q) => Math.abs(p.y - q.y) < 11)) continue;
    const members = components.filter((c) => Math.abs(c.bottom - p.y) <= 5);
    if (members.length < 2 && members.reduce((s, c) => s + c.area, 0) < 50) continue;
    selected.push({ ...p, members });
  }
  return selected
    .sort((a, b) => a.y - b.y)
    .map((p) => [
      Math.min(...p.members.map((c) => c.top)),
      Math.max(...p.members.map((c) => c.bottom)),
    ]);
}

/** A candidate must preserve both roles; a flavor improvement cannot conceal
 * worse rules text. Fixed masks come only from the scan and semantic badges.
 * These are offline selection diagnostics, not a replacement published metric. */
export class RulesRoleObjective {
  constructor(gray, width, height, mask, { rules, flavor }) {
    if (!rules && !flavor) throw Error('Role objective requires text');
    if (gray.length !== width * height || mask.length !== gray.length)
      throw Error('Role objective dimensions disagree');
    this.divider = rules && flavor ? referenceRulesDivider(gray, width, height, mask) : null;
    this.objectives = {};
    this.status =
      !this.divider || this.divider.status === 'measured' ? 'measured' : this.divider.status;
    if (this.status !== 'measured') return;
    for (const [role, present] of Object.entries({ rules, flavor })) {
      if (!present) continue;
      const region = Uint8Array.from(mask, (value, i) => {
        if (!value || !this.divider) return value;
        const y = Math.floor(i / width);
        return Number(role === 'rules' ? y < this.divider.y - 3 : y > this.divider.y + 3);
      });
      const objective = new TextFilledObjective(gray, width, height, region);
      if (objective.count < 5) {
        this.status = 'insufficient-role-ink';
        this.objectives = {};
        return;
      }
      objective.referenceBands = lineBands(gray, width, height, region);
      this.objectives[role] = objective;
    }
  }
  score(gray) {
    return {
      status: this.status,
      divider: this.divider,
      roles: Object.fromEntries(
        Object.entries(this.objectives).map(([role, objective]) => [
          role,
          {
            ...objective.score(gray),
            referenceBands: objective.referenceBands,
            bands: lineBands(gray, objective.width, objective.height, objective.mask),
          },
        ]),
      ),
    };
  }
}

export function roleFitDecision(before, after, { tolerance = 0.005, minimumGain = 0.05 } = {}) {
  if (![tolerance, minimumGain].every((v) => Number.isFinite(v) && v >= 0))
    throw Error('Invalid role-fit limits');
  if (before.status !== 'measured' || after.status !== 'measured')
    return { accepted: false, reason: 'reference-role-review-required' };
  const roles = Object.keys(before.roles).sort();
  if (!roles.length || roles.join() !== Object.keys(after.roles).sort().join())
    throw Error('Role-fit coverage changed');
  const deltas = Object.fromEntries(
    roles.map((role) => {
      const a = before.roles[role].score,
        b = after.roles[role].score;
      if (![a, b].every((v) => Number.isFinite(v) && v >= 0 && v <= 1))
        throw Error('Invalid role-fit score');
      return [role, b - a];
    }),
  );
  const lineCountErrorDeltas = Object.fromEntries(
    roles.map((role) => {
      const a = before.roles[role],
        b = after.roles[role];
      if (!a.bands || !b.bands || !a.referenceBands || !b.referenceBands)
        throw Error('Missing line-band evidence');
      const reference = a.referenceBands.length;
      if (JSON.stringify(a.referenceBands) !== JSON.stringify(b.referenceBands))
        throw Error('Reference line bands changed');
      return [role, Math.abs(b.bands.length - reference) - Math.abs(a.bands.length - reference)];
    }),
  );
  const lineRegression = Object.values(lineCountErrorDeltas).some((d) => d > 0);
  const values = Object.values(deltas);
  return {
    accepted:
      !lineRegression && Math.min(...values) >= -tolerance && Math.max(...values) >= minimumGain,
    reason: lineRegression
      ? 'line-count-regression'
      : Math.min(...values) < -tolerance
        ? 'role-regression'
        : Math.max(...values) < minimumGain
          ? 'insufficient-role-gain'
          : 'roles-preserved',
    deltas,
    lineCountErrorDeltas,
  };
}
