import { preAlphaEditorSource } from '../games/magic/tools/accuracy/alpha-editor-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  compatibleHostWorkerSource,
  hostWorkerCompatibilityProof,
} from '../games/magic/tools/accuracy/host-worker-compatibility.mjs';

export async function preHostWorkerSource(file) {
  const bytes = await preAlphaEditorSource(file, await readFile(file)),
    proof = await hostWorkerCompatibilityProof();
  if (proof.files[file])
    assert.equal(hash(bytes), proof.files[file].after, 'Unreviewed worker source: ' + file);
  return compatibleHostWorkerSource(file, bytes);
}
