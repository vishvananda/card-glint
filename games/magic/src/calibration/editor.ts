import { setCalibrationProfile } from './profiles.js';
import { calibrationControls } from './editor-controls.js';
import type { SetCalibrationProfile } from './types.js';
import type {
  CalibrationValue,
  SetCalibrationCandidate,
  SetCalibrationDescription,
} from './editor-types.js';
import { validateFrameBlackPoint } from '../presentation/frame-blackpoint.js';
export * from './editor-types.js';

function freeze<T>(value: T): T {
  if (value && typeof value === 'object') {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
export function describeSetCalibration(set: string): SetCalibrationDescription {
  const code = set.toLowerCase();
  const profile = setCalibrationProfile(code);
  return freeze({
    schema: 1,
    set: code,
    supported: !!profile,
    revision: profile?.revision ?? null,
    controls: profile ? calibrationControls(profile) : [],
    notice: profile
      ? 'Ordinary ABU/Fourth plates only. Geometry, lettering, symbols and pigment use the native painter. Source assets and masks remain fixed.'
      : 'This set does not yet have a consolidated profile adapter. Existing symbol and text diagnostic tools remain available.',
  });
}

/** Only descriptor IDs can be edited; no arbitrary URLs, object paths or code. */
export function createSetCalibrationCandidate(
  set: string,
  baseRevision: number,
  values: Readonly<Record<string, CalibrationValue>>,
): SetCalibrationCandidate {
  const description = describeSetCalibration(set);
  if (!description.supported || description.revision !== baseRevision)
    throw Error('Set calibration profile is unavailable or its revision changed');
  if (!values || typeof values !== 'object' || Array.isArray(values))
    throw Error('Calibration values must be a record');
  const controls = new Map(description.controls.map((c) => [c.id, c]));
  const clean: Record<string, CalibrationValue> = {};
  for (const id of Object.keys(values).sort()) {
    const control = controls.get(id),
      value = values[id];
    if (!control) throw Error('Unsupported calibration control: ' + id);
    if (
      control.kind === 'number'
        ? typeof value !== 'number' ||
          !Number.isFinite(value) ||
          value < control.min! ||
          value > control.max!
        : control.kind === 'boolean'
          ? typeof value !== 'boolean'
          : control.kind === 'color'
            ? typeof value !== 'string' || !/^#[0-9a-f]{6}$/i.test(value)
            : typeof value !== 'string' || !control.options?.includes(value)
    )
      throw Error('Invalid calibration value: ' + id);
    if (value !== control.value) clean[id] = value!;
  }
  const candidate: SetCalibrationCandidate = freeze({
    schema: 1,
    set: description.set,
    baseRevision,
    values: clean,
  });
  validateProfile(buildCandidate(candidate));
  return candidate;
}

function write(profile: SetCalibrationProfile, id: string, value: CalibrationValue) {
  const parts = id.split('.');
  let target = profile as unknown as Record<string, unknown>;
  for (let i = 0; i < parts.length - 1; i++) {
    const part = parts[i]!;
    target[part] ??= /^\d+$/.test(parts[i + 1]!) ? [] : {};
    target = target[part] as Record<string, unknown>;
  }
  target[parts.at(-1)!] = value;
}
function buildCandidate(candidate: SetCalibrationCandidate): SetCalibrationProfile {
  const base = setCalibrationProfile(candidate.set)!;
  const profile = structuredClone(base);
  // Optional RGB gains must be initialized as a complete tuple, even when
  // only one channel is edited. Sparse arrays would create NaN materials.
  for (const id of Object.keys(candidate.values)) {
    if (!/\.rgbScale\.[012]$/.test(id)) continue;
    const parts = id.split('.').slice(0, -1);
    let existing: unknown = profile;
    for (const part of parts) existing = (existing as Record<string, unknown> | undefined)?.[part];
    if (!existing) for (let i = 0; i < 3; i++) write(profile, `${parts.join('.')}.${i}`, 1);
  }
  for (const [id, value] of Object.entries(candidate.values)) write(profile, id, value);
  // A geometric proposal retains the same source pigment while moving that
  // source. Persist the new binding so the exported profile is reproducible.
  for (const [key, color] of Object.entries(profile.colors)) {
    if (!color) continue;
    const material = key.startsWith('L-') && !profile.frames[key] ? 'L' : key;
    const frame = profile.frames[material],
      old = base.frames[material];
    if (
      !frame ||
      !old ||
      !Object.keys(candidate.values).some((k) => k.startsWith(`frames.${material}.`))
    )
      continue;
    const source: unknown = JSON.parse(color.source);
    if (Array.isArray(source) && source.length === 2 && typeof source[0] === 'string')
      write(profile, `colors.${key}.source`, JSON.stringify([source[0], frame.frame]));
  }
  return profile;
}
function validateProfile(profile: SetCalibrationProfile) {
  for (const body of Object.values(profile.body ?? {})) {
    if (!body) continue;
    if (
      body.minimumSize <= 0 ||
      body.maximumSize < body.minimumSize ||
      body.bounds.width < 20 ||
      body.bounds.height < 20 ||
      body.typography.leading <= 0 ||
      (body.typography.textWidth ?? 1) <= 0
    )
      throw Error('Invalid body bounds or typography range');
  }
  for (const color of Object.values(profile.colors))
    if (color?.adjustment.blackPoint) validateFrameBlackPoint(color.adjustment.blackPoint);
}

const cache = new WeakMap<object, { key: string; profile: SetCalibrationProfile }>();
/** Pure resolution; cache is object-local and detects caller mutations. */
export function resolveSetCalibrationCandidate(
  candidate: SetCalibrationCandidate,
): SetCalibrationProfile {
  if (!candidate || candidate.schema !== 1) throw Error('Unsupported calibration candidate schema');
  const key = JSON.stringify(candidate);
  const cached = cache.get(candidate);
  if (cached?.key === key) return cached.profile;
  const checked = createSetCalibrationCandidate(
    candidate.set,
    candidate.baseRevision,
    candidate.values,
  );
  const profile = freeze(buildCandidate(checked));
  cache.set(candidate, { key, profile });
  return profile;
}
/** A detached profile for a single-file contribution; review evidence is host-owned. */
export function exportSetCalibrationProfile(
  candidate: SetCalibrationCandidate,
): SetCalibrationProfile {
  const profile = resolveSetCalibrationCandidate(candidate);
  return freeze({ ...structuredClone(profile), revision: profile.revision + 1 });
}
