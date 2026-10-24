import {
  eighthSetUsesDefaults,
  supportsEighthStyleDefaults,
} from '../presentation/eighth-style-scope.js';
import {
  modernSetUsesDefaults,
  supportsModernStyleDefaults,
} from '../presentation/modern-style-scope.js';
import { setLoaders, wordingLoaders } from './loaders.js';
import { hasSetData, registerSet, loadedSets, type SetData } from './registry.js';
import type { RenderedCardInput } from '../presentation/face-layout.js';
const pending = new Map<string, Promise<void>>();
const normalize = (code: string) => {
  const value = code.trim().toLowerCase();
  if (!/^[a-z0-9]{2,8}$/.test(value)) throw RangeError('Invalid Magic set code');
  return value;
};
/** Load the set and its shared modern style dependency. Existing set-only
 * callers can keep making synchronous queries after this resolves. Concurrent
 * calls share imports; failed dependencies remain retryable. */
export async function loadMagicSet(setCode: string): Promise<void> {
  const code = normalize(setCode);
  await Promise.all([
    loadSet(code, 'calibration', setLoaders),
    ...(code !== '8ed' && eighthSetUsesDefaults(code)
      ? [loadSet('8ed', 'calibration', setLoaders)]
      : []),
    ...(code !== 'm21' && modernSetUsesDefaults(code)
      ? [loadSet('m21', 'calibration', setLoaders)]
      : []),
  ]);
}
export async function loadPrintingSet(setCode: string): Promise<void> {
  await loadSet(setCode, 'wording', wordingLoaders);
}
async function loadSet(
  setCode: string,
  kind: SetData['kind'],
  loaders: Readonly<Record<string, () => Promise<{ default: SetData }>>>,
) {
  const code = normalize(setCode),
    identity = code + '/' + kind;
  if (hasSetData(code, kind)) return;
  let promise = pending.get(identity);
  if (!promise) {
    const loader = Object.hasOwn(loaders, code) ? loaders[code] : undefined;
    promise = (async () => {
      registerSet(loader ? (await loader()).default : { set: code, kind, tables: {} });
    })();
    pending.set(identity, promise);
    void promise.finally(() => pending.delete(identity)).catch(() => {});
  }
  await promise;
}
export const loadedMagicSets = loadedSets;
/** Call before synchronous asset/layout/cache-key queries. The M21 style donor loads only for compatible
 * modern faces or explicit automatic/named material defaults; wording stays separate. */
export async function prepareMagicCards(faces: readonly RenderedCardInput[]): Promise<void> {
  const codes = new Set<string>();
  const visit = (face: RenderedCardInput, inheritedSet?: string | null) => {
    const set = face.setCode ?? inheritedSet;
    if (set) codes.add(normalize(set));
    if (face.calibration !== 'printing' && supportsEighthStyleDefaults(face)) codes.add('8ed');
    if (
      (face.calibration !== 'printing' && supportsModernStyleDefaults({ ...face, setCode: set })) ||
      face.calibration === 'auto' ||
      typeof face.calibration === 'object'
    )
      codes.add('m21');
    for (const child of face.faces ?? []) visit(child, set);
  };
  for (const face of faces) visit(face);
  await Promise.all([...codes].map((code) => loadSet(code, 'calibration', setLoaders)));
}
