import { setLoaders, wordingLoaders } from './loaders.js';
import { hasSetData, registerSet, loadedSets, type SetData } from './registry.js';
import type { RenderedCardInput } from '../presentation/face-layout.js';
const pending = new Map<string, Promise<void>>();
const normalize = (code: string) => {
  const value = code.trim().toLowerCase();
  if (!/^[a-z0-9]{2,8}$/.test(value)) throw RangeError('Invalid Magic set code');
  return value;
};
/** Load only this set's calibration. Concurrent calls
 * share one import; failures reject and are not retained as successful loads. */
export async function loadMagicSet(setCode: string): Promise<void> {
  await loadSet(setCode, 'calibration', setLoaders);
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
/** Call before synchronous asset/layout/cache-key queries. Donor calibration is
 * loaded only for cards explicitly asking for automatic or named defaults. */
export async function prepareMagicCards(faces: readonly RenderedCardInput[]): Promise<void> {
  const codes = new Set<string>();
  const visit = (face: RenderedCardInput, inheritedSet?: string | null) => {
    const set = face.setCode ?? inheritedSet;
    if (set) codes.add(normalize(set));
    if (face.calibration === 'auto' || typeof face.calibration === 'object') codes.add('m21');
    for (const child of face.faces ?? []) visit(child, set);
  };
  for (const face of faces) visit(face);
  await Promise.all([...codes].map(loadMagicSet));
}
