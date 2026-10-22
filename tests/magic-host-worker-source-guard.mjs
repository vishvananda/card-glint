import { preM21StyleSource } from '../games/magic/tools/accuracy/m21-style-ancestry.mjs';
import { preOracleFlavorSource } from '../games/magic/tools/accuracy/oracle-flavor-ancestry.mjs';
import { preFinishSource } from '../games/magic/tools/accuracy/finish-ancestry.mjs';
import { artistReviewProofDependency } from '../games/magic/tools/accuracy/artist-review-ancestry.mjs';
import { profileDataGeneratorSource } from '../games/magic/tools/accuracy/profile-data-modules.mjs';
import { profilePreparationProofDependency } from '../games/magic/tools/accuracy/profile-preparation-ancestry.mjs';
import { preAlphaEditorSource } from '../games/magic/tools/accuracy/alpha-editor-ancestry.mjs';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { hash } from '../games/magic/tools/accuracy/common.mjs';
import {
  compatibleHostWorkerSource,
  hostWorkerCompatibilityProof,
} from '../games/magic/tools/accuracy/host-worker-compatibility.mjs';

/** Historical dependency reconstruction only; no current profile score approval. */
export async function hostWorkerProofSource(file) {
  const bytes = await preAlphaEditorSource(
      file,
      await profilePreparationProofDependency(
        file,
        profileDataGeneratorSource(
          file,
          await artistReviewProofDependency(
            file,
            await preFinishSource(
              file,
              await preOracleFlavorSource(
                file,
                await preM21StyleSource(file, await readFile(file)),
              ),
            ),
          ),
        ),
      ),
    ),
    proof = await hostWorkerCompatibilityProof();
  if (proof.files[file])
    assert.equal(hash(bytes), proof.files[file].after, 'Unreviewed worker source: ' + file);
  return bytes;
}

export async function preHostWorkerSource(file) {
  return compatibleHostWorkerSource(file, await hostWorkerProofSource(file));
}
