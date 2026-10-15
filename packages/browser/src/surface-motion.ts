import type { Frame, Instance } from './types.js';

interface State {
  seen: number;
  time: number;
  pose: number[];
  velocity: [number, number];
  data: Float32Array;
  activeRipple: number;
  segStart: [number, number];
  segTime: number;
  hoverUv: [number, number];
  hovering: boolean;
}
const limit = (n: number, max: number) => Math.max(-max, Math.min(max, n));

function packSegment(sx: number, sy: number): number {
  const qx = Math.min(2047, Math.max(0, Math.round((sx / 0.24 + 0.5) * 2047)));
  const qy = Math.min(0.9995, Math.max(0.0005, sy / 0.24 + 0.5));
  return 1 + qx + qy;
}

/** Small damped springs and four connected stroke-capsule wave emitters, never a fluid grid. */
export class SurfaceMotion {
  private states = new Map<number, State>();
  private serial = 0;
  begin() {
    this.serial++;
  }
  end() {
    for (const [id, state] of this.states) if (state.seen !== this.serial) this.states.delete(id);
  }
  clear() {
    this.states.clear();
  }
  sample(item: Instance, frame: Frame): Float32Array | null {
    const finish = item.finish ?? 'regular';
    if (finish !== 'rain' && finish !== 'heat' && finish !== 'pool' && !item.deformation)
      return null;
    const time = frame.time ?? 0,
      m = item.transform,
      n = item.normal ?? [0, 0, 1];
    const pose = [m[12]!, m[13]!, n[0], n[1]];
    let state = this.states.get(item.id);
    if (!state || time < state.time) {
      const data = new Float32Array(20);
      data.set([0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0, 0, 0, -100, 0], 4);
      state = {
        seen: this.serial,
        time,
        pose,
        velocity: [0, 0],
        data,
        activeRipple: 0,
        segStart: [0.5, 0.5],
        segTime: -100,
        hoverUv: [0.5, 0.5],
        hovering: false,
      };
      this.states.set(item.id, state);
    }
    state.seen = this.serial;
    const dt = Math.min(0.05, time - state.time);
    const hover = frame.hover?.instance === item.id ? frame.hover : undefined;
    if (hover) {
      const hx = hover.uv[0],
        hy = 1 - hover.uv[1];
      if (!state.hovering) {
        state.activeRipple = (state.activeRipple + 1) % 4;
        state.segStart = [hx, hy];
        state.segTime = time;
        state.hoverUv = [hx, hy];
        state.data.set([hx, hy, time, packSegment(0, 0)], 4 + state.activeRipple * 4);
      } else {
        const dx = hx - state.hoverUv[0],
          dy = hy - state.hoverUv[1],
          stepDist = Math.hypot(dx, dy);
        state.hoverUv = [hx, hy];
        if (dt > 0 && stepDist > 0) {
          state.velocity[0] = limit(state.velocity[0] + limit(dx * 1.8, 0.28), 1.0);
          state.velocity[1] = limit(state.velocity[1] + limit(dy * 1.8, 0.28), 1.0);
        }
        const sx = (hx - state.segStart[0]) * 0.5,
          sy = (hy - state.segStart[1]) * 0.5,
          segLen = Math.hypot(sx, sy) * 2,
          segAge = time - state.segTime;
        if (stepDist > 0.0005) {
          if (segLen > 0.11 || (segAge > 0.13 && segLen > 0.02)) {
            // Commit the current capsule so its wave train radiates outward uninterrupted,
            // and start the next capsule connected end-to-end at the previous endpoint.
            const prevEnd: [number, number] = [
              state.segStart[0] + sx * 2,
              state.segStart[1] + sy * 2,
            ];
            state.activeRipple = (state.activeRipple + 1) % 4;
            state.segStart = prevEnd;
            state.segTime = time;
            const nsx = (hx - prevEnd[0]) * 0.5,
              nsy = (hy - prevEnd[1]) * 0.5;
            state.data.set(
              [prevEnd[0] + nsx, prevEnd[1] + nsy, time, packSegment(nsx, nsy)],
              4 + state.activeRipple * 4,
            );
          } else {
            const cx = state.segStart[0] + sx,
              cy = state.segStart[1] + sy,
              birth = state.segTime + segAge * 0.45;
            state.data.set([cx, cy, birth, packSegment(sx, sy)], 4 + state.activeRipple * 4);
          }
        }
      }
    }
    if (dt > 0) {
      const widths = [Math.hypot(m[0]!, m[1]!, m[2]!), Math.hypot(m[4]!, m[5]!, m[6]!)];
      for (let axis = 0; axis < 2; axis++) {
        const move =
          (pose[axis]! - state.pose[axis]!) / Math.max(0.05, widths[axis]!) +
          (pose[axis + 2]! - state.pose[axis + 2]!) * 0.7;
        const kick = limit(move, 0.22);
        const steps = Math.max(1, Math.ceil(dt / (1 / 120)));
        const h = dt / steps;
        for (let step = 0; step < steps; step++) {
          let x = state.data[axis]!,
            v = state.velocity[axis]! + (step === 0 ? kick * 4.5 : 0);
          v += (-26 * x - 4.8 * v) * h;
          x = limit(x + v * h, 0.35);
          state.data[axis] = x;
          state.velocity[axis] = limit(v, 1.4);
        }
      }
    }
    state.hovering = !!hover;
    state.time = time;
    state.pose = pose;
    return state.data;
  }
}
