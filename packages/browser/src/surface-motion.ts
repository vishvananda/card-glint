import type { Frame, Instance } from './types.js';
import { surfaceSeed } from './deformation.js';

interface State {
  time: number;
  seen: number;
  pose: number[];
  velocity: [number, number];
  data: Float32Array;
  nextRipple: number;
  lastRipple: number;
  hovering: boolean;
}
const limit = (n: number, max: number) => Math.max(-max, Math.min(max, n));

/** Small damped springs and a four-impulse ring, never an image or a fluid grid. */
export class SurfaceMotion {
  private states = new Map<number, State>();
  private serial = 0;
  begin() {
    this.serial++;
  }
  sample(item: Instance, frame: Frame): Float32Array | undefined {
    if (!['rain', 'heat', 'pool'].includes(item.finish ?? 'regular')) return;
    const time = frame.time ?? 0,
      m = item.transform,
      n = item.normal ?? [0, 0, 1];
    const pose = [
      m[12]! + (m[0]! + m[4]!) / 2,
      m[13]! + (m[1]! + m[5]!) / 2,
      n[0]! / Math.hypot(...n),
      n[1]! / Math.hypot(...n),
    ];
    let state = this.states.get(item.id);
    if (!state || time < state.time || time - state.time > 0.5) {
      const data = new Float32Array(20);
      data[2] = surfaceSeed(item.id);
      for (let i = 0; i < 4; i++) data[6 + i * 4] = -100;
      state = {
        time,
        seen: this.serial,
        pose,
        velocity: [0, 0],
        data,
        nextRipple: 0,
        lastRipple: -100,
        hovering: false,
      };
      this.states.set(item.id, state);
    }
    state.seen = this.serial;
    const dt = Math.min(0.05, time - state.time);
    if (dt > 0) {
      const widths = [Math.hypot(m[0]!, m[1]!, m[2]!), Math.hypot(m[4]!, m[5]!, m[6]!)];
      for (let axis = 0; axis < 2; axis++) {
        const kick =
          (-(pose[axis]! - state.pose[axis]!) / Math.max(widths[axis]!, 0.001)) * 2 +
          (pose[axis + 2]! - state.pose[axis + 2]!) * 3;
        state.velocity[axis as 0 | 1] += limit(kick, 0.6);
        // Two substeps keep a low-frame-rate host stable, including after a pause.
        for (let step = 0; step < 2; step++) {
          state.velocity[axis as 0 | 1] +=
            ((-state.data[axis]! * 22 - state.velocity[axis as 0 | 1] * 3.8) * dt) / 2;
          state.data[axis] = limit(
            state.data[axis]! + (state.velocity[axis as 0 | 1] * dt) / 2,
            0.35,
          );
        }
      }
    }
    const hover = frame.hover?.instance === item.id ? frame.hover : undefined;
    if (hover && (!state.hovering || time - state.lastRipple > 0.22)) {
      const offset = 4 + state.nextRipple * 4;
      state.data.set([hover.uv[0], 1 - hover.uv[1], time, 0.8], offset);
      state.nextRipple = (state.nextRipple + 1) % 4;
      state.lastRipple = time;
    }
    state.hovering = !!hover;
    state.time = time;
    state.pose = pose;
    return state.data;
  }
  end() {
    // Evicted/offscreen instances do not leave simulation state behind.
    for (const [id, state] of this.states) if (state.seen !== this.serial) this.states.delete(id);
  }
  clear() {
    this.states.clear();
  }
}
