import path from 'node:path';
import { readFile } from 'node:fs/promises';
import { hash } from './common.mjs';

/** Reuse only verified rasters from the same run and complete rendering environment. */
export function compatibleCapture(previous, identity) {
  return (
    previous &&
    Array.isArray(previous.components) &&
    Array.isArray(identity.components) &&
    ['rendererHash', 'fontStylesheetHash', 'browser', 'os', 'snapshotIdentity', 'study'].every(
      (key) =>
        Object.hasOwn(previous, key) &&
        Object.hasOwn(identity, key) &&
        previous[key] === identity[key],
    ) &&
    hash(JSON.stringify(previous.components)) === hash(JSON.stringify(identity.components))
  );
}

export async function reusableFace(previous, input, referenceHash, directory) {
  if (
    !previous ||
    previous.issue ||
    previous.inputHash !== input.inputHash ||
    previous.images?.reference?.sha256 !== referenceHash
  )
    return null;
  for (const tier of ['inspect', 'table', 'reference']) {
    const image = previous.images[tier];
    if (!image?.file || !/^[a-f0-9]{64}$/.test(image.sha256)) return null;
    // Capture paths must stay within this run; stale files trigger a fresh render.
    const file = path.resolve(directory, image.file),
      relative = path.relative(directory, file);
    if (relative.startsWith('..') || path.isAbsolute(relative)) return null;
    try {
      if (hash(await readFile(file)) !== image.sha256) return null;
    } catch (error) {
      if (error.code === 'ENOENT') return null;
      throw error;
    }
  }
  return {
    frame: previous.frame,
    layout: previous.layout,
    specialLayout: previous.specialLayout,
    assets: previous.assets,
    images: previous.images,
  };
}
