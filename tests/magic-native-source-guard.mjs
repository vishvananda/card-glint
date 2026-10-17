import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import { calibrationLegacySource } from './magic-calibration-source-guard.mjs';
import { assertCacheOnlySourceBytes } from './magic-source-guard.mjs';
import { preTitleCalibrationSource } from './magic-title-source-guard.mjs';
import {
  assertNativeDefaultCompatibility,
  nativeHostSources,
} from './magic-native-host-compatibility.mjs';
import { readNativeReference } from './magic-native-reference.mjs';

export async function readNativeHostSource(file) {
  const bytes = await readFile(file);
  const change = nativeHostSources.files[file];
  if (!change || hash(bytes) === change.before) return bytes;
  assert.equal(hash(bytes), change.after, 'Unreviewed native host change: ' + file);
  assert.ok(change.before, 'New modules have no historical calibration ancestry: ' + file);
  await assertNativeDefaultCompatibility();
  const reference = await readNativeReference(file);
  assert.equal(hash(reference), change.before, 'Pinned source ancestry mismatch: ' + file);
  return reference;
}

async function readPreTitleHostSource(file) {
  return preTitleCalibrationSource(file, readNativeHostSource);
}

/** Prove current host hooks against upstream before reversing the separately
 * verified title and calibration changes for unchanged historical receipts. */
export async function readNativeCompatibleSource(file) {
  return calibrationLegacySource(file, readPreTitleHostSource);
}

export async function assertNativeMagicSourceHash(file, expected) {
  const bytes = await readNativeCompatibleSource(file);
  await assertCacheOnlySourceBytes(file, bytes, expected);
}
