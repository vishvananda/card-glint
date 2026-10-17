import assert from 'node:assert/strict';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { calibrationLegacySource } from './magic-calibration-source-guard.mjs';
import { assertCacheOnlySourceBytes } from './magic-source-guard.mjs';
import { preTitleCalibrationSource } from './magic-title-source-guard.mjs';
import { preArtistCalibrationSource } from './magic-artist-source-guard.mjs';
import { preManaCalibrationSource } from './magic-mana-source-guard.mjs';
import {
  assertNativeDefaultCompatibility,
  nativeHostSources,
} from './magic-native-host-compatibility.mjs';
import { readNativeReference } from './magic-native-reference.mjs';
import { preStatsCalibrationSource } from './magic-stats-source-guard.mjs';

export async function readNativeHostSource(file) {
  const bytes = await preStatsCalibrationSource(file);
  const change = nativeHostSources.files[file];
  if (!change || hash(bytes) === change.before) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed native host change: ' + file);
  assert.ok(change.before, 'New modules have no historical calibration ancestry: ' + file);
  await assertNativeDefaultCompatibility();
  const reference = await readNativeReference(file);
  assert.equal(hash(reference), change.before, 'Pinned source ancestry mismatch: ' + file);
  return reference;
}

export async function readPreArtistHostSource(file) {
  return preArtistCalibrationSource(file, readNativeHostSource);
}

export async function readPreManaHostSource(file) {
  return preManaCalibrationSource(file, readPreArtistHostSource);
}

async function readPreTitleHostSource(file) {
  return preTitleCalibrationSource(file, readPreManaHostSource);
}

/** Verify stats isolation and reconstruct the host revision before its default
 * comparison; then reverse artist, mana, title and calibration changes for
 * unchanged historical receipts. */
export async function readNativeCompatibleSource(file) {
  return calibrationLegacySource(file, readPreTitleHostSource);
}

export async function assertNativeMagicSourceHash(file, expected) {
  const bytes = await readNativeCompatibleSource(file);
  await assertCacheOnlySourceBytes(file, bytes, expected);
}
