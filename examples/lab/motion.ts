/** Consumer-owned motion: smooth handoff between an idle orbit and direct tilt. */
export class ShowcaseMotion {
  private positions = new Map<number, { x: number; y: number }>();
  sample(time: number, dt: number, hover?: { instance: number; uv: readonly [number, number] }) {
    for (let id = 1; id <= 4; id++) {
      const phase = (id - 1) * 1.4;
      const target =
        hover?.instance === id
          ? { x: hover.uv[0], y: hover.uv[1] }
          : {
              x: 0.5 + Math.sin(time * 0.63 + phase) * 0.29,
              y: 0.5 + Math.sin(time * 0.83 + 0.7 + phase) * 0.23,
            };
      const current = this.positions.get(id) ?? { x: 0.5, y: 0.5 };
      const blend = 1 - Math.exp(-Math.min(dt, 0.05) * 8);
      current.x += (target.x - current.x) * blend;
      current.y += (target.y - current.y) * blend;
      this.positions.set(id, current);
    }
    return this.positions;
  }
}

/** Rotate a native-aspect pixel rectangle around its center, then apply perspective. */
export function tiltedQuad(
  x: number,
  y: number,
  w: number,
  h: number,
  z: number,
  width: number,
  height: number,
  pointer: { x: number; y: number },
) {
  const rx = (0.5 - pointer.y) * 0.3,
    ry = (pointer.x - 0.5) * 0.38;
  const sx = Math.sin(rx),
    cx = Math.cos(rx),
    sy = Math.sin(ry),
    cy = Math.cos(ry);
  const pw = (w * width) / 2,
    ph = (h * height) / 2,
    distance = pw * 3.5;
  const centerX = x + w / 2,
    centerY = y - h / 2;
  const column = (px: number, py: number, pz: number) => {
    const perspective = -pz / distance;
    return [
      (px * 2) / width + centerX * perspective,
      (-py * 2) / height + centerY * perspective,
      (pz / distance) * 0.15 - z * perspective,
      perspective,
    ];
  };
  const right = column(pw * cy, 0, -pw * sy);
  const down = column(ph * sx * sy, ph * cx, ph * sx * cy);
  const origin = [centerX, centerY, -z, 1].map((n, i) => n - (right[i]! + down[i]!) / 2);
  return {
    transform: [...right, ...down, 0, 0, 1, 0, ...origin],
    normal: [sy * cx, -sx, cy * cx] as const,
  };
}
