import { hash } from './common.mjs';
/** Match an immutable decoder lock while ignoring only the package's own release
 * number. Every dependency, integrity hash and other lock field stays exact. */
export function decoderLockMatches(bytes, expected, rootVersion) {
  if (hash(bytes) === expected) return true;
  const value = JSON.parse(bytes);
  if (
    !value.packages?.[''] ||
    typeof value.version !== 'string' ||
    typeof value.packages[''].version !== 'string'
  )
    return false;
  value.version = rootVersion;
  value.packages[''].version = rootVersion;
  return hash(JSON.stringify(value, null, 2) + '\n') === expected;
}
