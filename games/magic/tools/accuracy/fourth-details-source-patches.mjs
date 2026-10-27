export const fourthDetailsSourcePatches = {
  'games/magic/src/presentation/retro-details.ts': [
    [
      "import type { RenderedCardInput, FaceRect } from './face-layout.js';\nimport { paintMana } from './canvas-text.js';\nimport { paintEarlyMana } from './historic-cost.js';\nimport { resolveFrameColors } from './profile.js';\nimport type { RetroSymbolPalette } from './retro-symbol-material.js';\n\n/** Shared right edge leaves room for wide expressions without squeezing their glyphs. */\n",
      "import type { RenderedCardInput, FaceRect } from './face-layout.js';\nimport { paintMana } from './canvas-text.js';\nimport { paintEarlyMana } from './historic-cost.js';\nimport { resolveFrameColors, resolveCardProfile } from './profile.js';\nimport type { RetroSymbolPalette } from './retro-symbol-material.js';\n\n/** Shared right edge leaves room for wide expressions without squeezing their glyphs. */\n",
    ],
    [
      "/** Set policies measured from cached development scans; no per-card geometry. */\nexport function retroPrintDetails(face: RenderedCardInput) {\n  const set = face.setCode?.toLowerCase();\n  const fourth = set === '4ed' && !/\\bLand\\b/.test(face.typeLine ?? '');\n  if (set !== 'mir' && set !== 'tmp' && !fourth) return null;\n  const colors = resolveFrameColors(face);\n  return {\n",
      "/** Set policies measured from cached development scans; no per-card geometry. */\nexport function retroPrintDetails(face: RenderedCardInput) {\n  const set = face.setCode?.toLowerCase();\n  const fourth = set === '4ed' && !resolveCardProfile(face).land;\n  if (set !== 'mir' && set !== 'tmp' && !fourth) return null;\n  const colors = resolveFrameColors(face);\n  return {\n",
    ],
    [
      "            : '\u00a91997 Wizards of the Coast, Inc.'\n        : face.legalText,\n  };\n}\n\n/** The tilted-card tap mark, distinct from both the diagonal T and modern arrow. */\n",
      "            : '\u00a91997 Wizards of the Coast, Inc.'\n        : face.legalText,\n  };\n}\n\n/** Old printed labels such as Enchant Land must use the ordinary detail policy.\n * Invalidate only the rebuilt faces whose previous label-based branch differed. */\nexport function fourthDetailRevision(face: RenderedCardInput) {\n  return face.setCode?.toLowerCase() === '4ed' &&\n    /\\bLand\\b/.test(face.typeLine ?? '') &&\n    !resolveCardProfile(face).land\n    ? 'fourth-semantic-details-v1'\n    : undefined;\n}\n\n/** The tilted-card tap mark, distinct from both the diagonal T and modern arrow. */\n",
    ],
  ],
  'games/magic/src/presentation/canvas-face.ts': [
    [
      "  modernWalkerProfile,\n} from './modern-printing-profile.js';\nimport { ALPHA_RULES_REVISION } from './early-text-tiers.js';\nimport { REVISED_RULES_REVISION, usesRevisedFractionalRules } from './retro-rules.js';\nimport { usesRevisedLettering } from './revised-lettering.js';\nimport { retroDualFrameRevision, abuDualArtBottom } from './retro-dual-frame.js';\n",
      "  modernWalkerProfile,\n} from './modern-printing-profile.js';\nimport { ALPHA_RULES_REVISION } from './early-text-tiers.js';\nimport { fourthDetailRevision } from './retro-details.js';\nimport { REVISED_RULES_REVISION, usesRevisedFractionalRules } from './retro-rules.js';\nimport { usesRevisedLettering } from './revised-lettering.js';\nimport { retroDualFrameRevision, abuDualArtBottom } from './retro-dual-frame.js';\n",
    ],
    [
      "    RENDERER_COMPONENT_ROOT,\n    CONJURER_ROOT,\n    'canvas-face-v148',\n    ...(matrixHeadings ? ['matrix-heading-alphabetic-v1'] : []),\n    ...(!input.printedImage &&\n    input.layer !== 'etching' &&\n",
      "    RENDERER_COMPONENT_ROOT,\n    CONJURER_ROOT,\n    'canvas-face-v148',\n    ...(!input.printedImage &&\n    input.layer !== 'etching' &&\n    input.paintLayer !== 'artwork' &&\n    fourthDetailRevision(face)\n      ? [fourthDetailRevision(face)]\n      : []),\n    ...(matrixHeadings ? ['matrix-heading-alphabetic-v1'] : []),\n    ...(!input.printedImage &&\n    input.layer !== 'etching' &&\n",
    ],
  ],
  'games/magic/tools/accuracy/calibration-report.mjs': [
    [
      "import { fourthCenteredAffected, fourthCenteredApproval } from './fourth-centered-ancestry.mjs';\nimport { wallWordingAffected } from './wall-wording-data.mjs';\nimport { fourthParagraphDelta, fourthParagraphAffected } from './fourth-paragraph-ancestry.mjs';\n",
      "import { fourthDetailsAffected, fourthDetailsApproval } from './fourth-details-ancestry.mjs';\nimport { fourthCenteredAffected, fourthCenteredApproval } from './fourth-centered-ancestry.mjs';\nimport { wallWordingAffected } from './wall-wording-data.mjs';\nimport { fourthParagraphDelta, fourthParagraphAffected } from './fourth-paragraph-ancestry.mjs';\n",
    ],
    [
      '        ...(item.originalInput ? [{ task, item: item.originalInput, original: true }] : []),\n      ]);\n      for (const { task, item, original } of dependencies) {\n        if (\n          (await fourthCenteredAffected(set.set, task, original, group)) &&\n          !(await fourthCenteredApproval(item, group))\n',
      "        ...(item.originalInput ? [{ task, item: item.originalInput, original: true }] : []),\n      ]);\n      for (const { task, item, original } of dependencies) {\n        if (\n          (await fourthDetailsAffected(set.set, task, original, group)) &&\n          !(await fourthDetailsApproval(item, group))\n        ) {\n          item.status = 'needs-audit';\n          item.reason =\n            'Fourth Enchant Land costs now use semantic nonland geometry. The seven changed cost bands and current whole-card/publication evidence require review. Original words, other pixels and printing groups retain their evidence.';\n          continue;\n        }\n        if (\n          (await fourthCenteredAffected(set.set, task, original, group)) &&\n          !(await fourthCenteredApproval(item, group))\n",
    ],
  ],
  'games/magic/tools/accuracy/fourth-centered-ancestry.mjs': [
    [
      "import assert from 'node:assert/strict';\nimport fs from 'node:fs/promises';\nimport path from 'node:path';\n",
      "import { preFourthDetailsSource, fourthDetailsApproval } from './fourth-details-ancestry.mjs';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs/promises';\nimport path from 'node:path';\n",
    ],
    [
      '  })());\n}\nexport async function preFourthCenteredSource(file, bytes) {\n  const e = (await fourthCenteredDelta()).files[file];\n  return e && e.beforeSource !== null && hash(bytes) === e.after\n    ? Buffer.from(e.beforeSource)\n',
      '  })());\n}\nexport async function preFourthCenteredSource(file, bytes) {\n  bytes = await preFourthDetailsSource(file, bytes);\n  const e = (await fourthCenteredDelta()).files[file];\n  return e && e.beforeSource !== null && hash(bytes) === e.after\n    ? Buffer.from(e.beforeSource)\n',
    ],
    [
      'export async function fourthCenteredApproval(item, group) {\n  const p = await fourthCenteredDelta(),\n    proof = item.proof;\n  if (\n    proof?.reviewedCenteringSource !== p.afterRenderer ||\n    proof.nativeReplayHash !== p.native.contentSha256 ||\n',
      'export async function fourthCenteredApproval(item, group) {\n  const p = await fourthCenteredDelta(),\n    proof = item.proof;\n  if (\n    proof?.reviewedCenteringSource === p.afterRenderer &&\n    (await fourthDetailsApproval(item, group))\n  )\n    return true;\n  if (\n    proof?.reviewedCenteringSource !== p.afterRenderer ||\n    proof.nativeReplayHash !== p.native.contentSha256 ||\n',
    ],
  ],
};
