import { availableSets, fixedTableSets } from './scopes.js';
/** Internal compiled-data boundary. No host-provided objects or URLs enter it. */
export interface SetData {
  readonly set: string;
  readonly kind: 'calibration' | 'wording';
  readonly tables: Readonly<Record<string, Readonly<Record<string, unknown>>>>;
}
const sets = new Set<string>();
const payloads = new Map<string, SetData>();
const values = new Map<string, Record<string, unknown>>();
const views = new Map<string, object>();
const knownSets = new Set(availableSets);
function requireTableSet(name: string, key?: string): void {
  const code = fixedTableSets[name] ?? key?.split(/[/-]/)[0]?.toLowerCase();
  if (code && knownSets.has(code) && !sets.has(code + '/calibration'))
    throw Error(
      `Magic set ${code} is not prepared. Await loadMagicSet('${code}') or prepareMagicCards(cards) before synchronous layout queries.`,
    );
}
function freeze(value: unknown): void {
  if (!value || typeof value !== 'object' || Object.isFrozen(value)) return;
  for (const child of Object.values(value)) freeze(child);
  Object.freeze(value);
}
/** Installation is atomic and idempotent. ES modules retain immutable set payloads. */
export function registerSet(data: SetData): void {
  const identity = data.set + '/' + data.kind;
  if (sets.has(identity)) return;
  for (const [name, entries] of Object.entries(data.tables))
    for (const key of Object.keys(entries))
      if (Object.hasOwn(values.get(name) ?? {}, key))
        throw Error(`Duplicate calibration value: ${name}/${key}`);
  freeze(data);
  for (const [name, entries] of Object.entries(data.tables)) {
    const target = values.get(name) ?? (Object.create(null) as Record<string, unknown>);
    Object.assign(target, entries);
    values.set(name, target);
  }
  payloads.set(identity, data);
  sets.add(identity);
}
export const hasSetData = (code: string, kind: SetData['kind'] = 'calibration') =>
  sets.has(code + '/' + kind);
export const loadedSets = () =>
  [...sets]
    .filter((key) => key.endsWith('/calibration'))
    .map((key) => key.split('/')[0]!)
    .sort();
/** Stable live views avoid snapshots taken before asynchronous preparation.
 * The generator verifies every entry against its authoritative typed source.
 * Values cross this private typed boundary once, never during frame animation. */
export function table<T extends Readonly<Record<string, unknown>>>(name: string): T {
  if (!views.has(name))
    views.set(
      name,
      new Proxy(Object.create(null) as object, {
        get: (_target, key) => {
          if (typeof key !== 'string') return undefined;
          requireTableSet(name, key);
          return values.get(name)?.[key];
        },
        has: (_target, key) =>
          typeof key === 'string' && Object.hasOwn(values.get(name) ?? {}, key),
        ownKeys: () => {
          requireTableSet(name);
          return Object.keys(values.get(name) ?? {});
        },
        getOwnPropertyDescriptor: (_target, key) =>
          typeof key === 'string' && Object.hasOwn(values.get(name) ?? {}, key)
            ? {
                value: values.get(name)![key],
                enumerable: true,
                configurable: true,
                writable: false,
              }
            : undefined,
        set: () => {
          throw TypeError('Set data is immutable');
        },
        defineProperty: () => {
          throw TypeError('Set data is immutable');
        },
        deleteProperty: () => {
          throw TypeError('Set data is immutable');
        },
        preventExtensions: () => false,
      }),
    );
  return views.get(name) as T;
}

/** Exact set scope for the text-only resolver; another loaded set cannot leak in. */
export function setTable<T extends Readonly<Record<string, unknown>>>(
  code: string,
  name: string,
): T {
  const kind = ['printingCorrections', 'artistCredits'].includes(name) ? 'wording' : 'calibration';
  const payload = payloads.get(code + '/' + kind);
  if (!payload) throw Error(`Magic set ${code} is not prepared`);
  return (payload.tables[name] ?? {}) as T;
}
