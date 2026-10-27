// Exact reviewed changes; unknown edits cannot inherit historical evidence.
export const fourthFlavorSourcePatches = {
  'games/magic/src/calibration/body.ts': [
    [
      "import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';\nimport type { RenderedCardInput, RulesParagraph } from '../presentation/face-layout.js';\nimport { layoutRules, type RulesLayout } from '../presentation/rules-layout.js';\nimport type { CalibratedBody, CalibratedBodyClasses } from './types.js';\n\n/** Fit the displayed wording; select a short-text policy using the supplied\n",
      "import type { CanvasContext } from '../../../../packages/browser/src/canvas-raster.js';\nimport type { RenderedCardInput, RulesParagraph } from '../presentation/face-layout.js';\nimport { layoutRules, rulesLayoutRequest, type RulesLayout } from '../presentation/rules-layout.js';\nimport type { CalibratedBody, CalibratedBodyClasses } from './types.js';\n\n/** Fit the displayed wording; select a short-text policy using the supplied\n",
    ],
    [
      '  );\n}\n\n/** Refine measured size classes without reclassifying already-correct text.\n * The reference layout chooses a class; visible Oracle text still fits safely. */\nexport function calibratedBodyClasses(\n',
      "  );\n}\n\n/** The same semantic pair selects both the fit and its scoped face revision. */\nexport function isPureFlavorPair(\n  paragraphs: readonly RulesParagraph[],\n  reference: readonly RulesParagraph[],\n): boolean {\n  return (\n    paragraphs.length > 0 &&\n    reference.length > 0 &&\n    [...paragraphs, ...reference].every((p) => p.role === 'flavor')\n  );\n}\n\n/** Refine measured size classes without reclassifying already-correct text.\n * The reference layout chooses a class; visible Oracle text still fits safely. */\nexport function calibratedBodyClasses(\n",
    ],
    [
      '  paragraphs: readonly RulesParagraph[],\n  reference: readonly RulesParagraph[],\n): RulesLayout {\n  if (\n    !reference.length ||\n    !paragraphs.length ||\n',
      "  paragraphs: readonly RulesParagraph[],\n  reference: readonly RulesParagraph[],\n): RulesLayout {\n  // Pure flavor uses its existing physical request, not the rules-only\n  // centering/compact classifier. Fractional advances remove word-by-word\n  // rounding without changing margins, leading or the allowed type range.\n  if (isPureFlavorPair(paragraphs, reference)) {\n    if (!profile.typography.fractionalMetrics || referenceBase.size === profile.centered.size)\n      return base;\n    const request = rulesLayoutRequest(base);\n    if (!request) throw Error('Missing native flavor layout request');\n    // An explicit material-level choice, including false, remains authoritative.\n    if (request.typography.fractionalMetrics !== undefined) return base;\n    const precise = layoutRules(\n      context,\n      request.paragraphs,\n      request.bounds,\n      request.maximumSize,\n      request.minimumSize,\n      { ...request.typography, fractionalMetrics: true },\n    );\n    return precise.overflow ? base : precise;\n  }\n  if (\n    !reference.length ||\n    !paragraphs.length ||\n",
    ],
  ],
  'games/magic/src/presentation/retro-rules.ts': [
    [
      "import { alphaTextLayout, earlyTextTierLayout, fractionalEarlyRules } from './early-text-tiers.js';\nimport { adjustCalibrationRules } from '../calibration/rules-adjustment.js';\nimport { calibrationForFace } from '../calibration/selection.js';\nimport { calibratedBodyLayout, calibratedBodyClasses } from '../calibration/body.js';\nimport { earlyReprintFrame } from './early-reprint-frame.js';\nimport { retroBasicPrinting } from './retro-basic.js';\nimport type { RenderedCardInput, RulesParagraph } from './face-layout.js';\n",
      "import { alphaTextLayout, earlyTextTierLayout, fractionalEarlyRules } from './early-text-tiers.js';\nimport { adjustCalibrationRules } from '../calibration/rules-adjustment.js';\nimport { calibrationForFace } from '../calibration/selection.js';\nimport {\n  calibratedBodyLayout,\n  calibratedBodyClasses,\n  isPureFlavorPair,\n} from '../calibration/body.js';\nimport { earlyReprintFrame } from './early-reprint-frame.js';\nimport { retroBasicPrinting } from './retro-basic.js';\nimport type { RenderedCardInput, RulesParagraph } from './face-layout.js';\n",
    ],
    [
      "    if (\n      classes &&\n      base &&\n      paragraphs.every((p) => p.role === 'rules') &&\n      reference.every((p) => p.role === 'rules')\n    ) {\n      const referenceBase =\n        reference === paragraphs\n",
      "    if (\n      classes &&\n      base &&\n      ((paragraphs.every((p) => p.role === 'rules') &&\n        reference.every((p) => p.role === 'rules')) ||\n        isPureFlavorPair(paragraphs, reference))\n    ) {\n      const referenceBase =\n        reference === paragraphs\n",
    ],
    [
      '    },\n  );\n}\n',
      "    },\n  );\n}\n\n/** No font measurement or IO in cache queries. Centered flavor may keep identical\n * pixels, but shares this semantic policy revision; unrelated faces keep keys. */\nexport function fractionalFlavorRevision(face: RenderedCardInput) {\n  const frame = earlyReprintFrame(face);\n  const classes = frame && calibrationForFace(face)?.bodyClasses;\n  if (!classes?.typography.fractionalMetrics || !classes.materials.includes(frame?.material ?? ''))\n    return undefined;\n  const paragraphs = wordingParagraphs({\n    rulesText: face.rulesText ?? '',\n    rulesParagraphs: face.rulesParagraphs,\n  });\n  const reference =\n    face.rulesAlignment?.mode === 'auto'\n      ? (face.rulesAlignment.reference ?? paragraphs)\n      : paragraphs;\n  return isPureFlavorPair(paragraphs, reference) ? 'fractional-pure-flavor-v1' : undefined;\n}\n",
    ],
  ],
  'games/magic/src/presentation/canvas-face.ts': [
    [
      "import { ordinaryTextLayout, paintRulesLayout } from './rules-paint.js';\nexport { ordinaryTextLayout } from './rules-paint.js';\nexport { retroTextLayout } from './retro-rules.js';\nimport { paintEtchingMask, type EtchingResolver } from './canvas-etching.js';\nimport { fullResolutionScan } from '../scan-url.js';\nimport type { AbilityEmblem } from '../emblems.js';\n",
      "import { ordinaryTextLayout, paintRulesLayout } from './rules-paint.js';\nexport { ordinaryTextLayout } from './rules-paint.js';\nexport { retroTextLayout } from './retro-rules.js';\nimport { fractionalFlavorRevision } from './retro-rules.js';\nimport { paintEtchingMask, type EtchingResolver } from './canvas-etching.js';\nimport { fullResolutionScan } from '../scan-url.js';\nimport type { AbilityEmblem } from '../emblems.js';\n",
    ],
    [
      "    input.paintLayer !== 'artwork' &&\n    fourthDetailRevision(face)\n      ? [fourthDetailRevision(face)]\n      : []),\n    ...(matrixHeadings ? ['matrix-heading-alphabetic-v1'] : []),\n    ...(!input.printedImage &&\n",
      "    input.paintLayer !== 'artwork' &&\n    fourthDetailRevision(face)\n      ? [fourthDetailRevision(face)]\n      : []),\n    ...(!input.printedImage &&\n    input.layer !== 'etching' &&\n    input.paintLayer !== 'artwork' &&\n    fractionalFlavorRevision(face)\n      ? [fractionalFlavorRevision(face)]\n      : []),\n    ...(matrixHeadings ? ['matrix-heading-alphabetic-v1'] : []),\n    ...(!input.printedImage &&\n",
    ],
  ],
  'games/magic/tools/accuracy/ice-defaults-ancestry.mjs': [
    [
      "// Exact source projection for an inherited Ice Age default, not set validation.\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs/promises';\n",
      "import { preFourthFlavorSource } from './fourth-flavor-ancestry.mjs';\n// Exact source projection for an inherited Ice Age default, not set validation.\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs/promises';\n",
    ],
    [
      '  })());\n}\nexport async function preIceDefaultsSource(file, bytes) {\n  const r = (await iceDefaultsDelta()).files[file];\n  return r && hash(bytes) === r.after ? Buffer.from(r.beforeSource) : bytes;\n}\n',
      '  })());\n}\nexport async function preIceDefaultsSource(file, bytes) {\n  bytes = await preFourthFlavorSource(file, bytes);\n  const r = (await iceDefaultsDelta()).files[file];\n  return r && hash(bytes) === r.after ? Buffer.from(r.beforeSource) : bytes;\n}\n',
    ],
  ],
  'games/magic/tools/accuracy/fourth-details-ancestry.mjs': [
    [
      "import { preIceDefaultsSource } from './ice-defaults-ancestry.mjs';\n// Exact semantic-detail source/native evidence; historical receipts remain immutable.\nimport assert from 'node:assert/strict';\n",
      "import { fourthFlavorApproval } from './fourth-flavor-ancestry.mjs';\nimport { preIceDefaultsSource } from './ice-defaults-ancestry.mjs';\n// Exact semantic-detail source/native evidence; historical receipts remain immutable.\nimport assert from 'node:assert/strict';\n",
    ],
    [
      'export async function fourthDetailsApproval(item, group) {\n  const p = await fourthDetailsDelta(),\n    proof = item.proof;\n  if (\n    proof?.semanticDetailsSource !== p.afterRenderer ||\n    proof.nativeReplayHash !== p.native.contentSha256 ||\n',
      'export async function fourthDetailsApproval(item, group) {\n  const p = await fourthDetailsDelta(),\n    proof = item.proof;\n  if (proof?.semanticDetailsSource === p.afterRenderer && (await fourthFlavorApproval(item, group)))\n    return true;\n  if (\n    proof?.semanticDetailsSource !== p.afterRenderer ||\n    proof.nativeReplayHash !== p.native.contentSha256 ||\n',
    ],
  ],
  'games/magic/tools/accuracy/fourth-centered-ancestry.mjs': [
    [
      "import { preFourthDetailsSource, fourthDetailsApproval } from './fourth-details-ancestry.mjs';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs/promises';\n",
      "import { fourthFlavorApproval } from './fourth-flavor-ancestry.mjs';\nimport { preFourthDetailsSource, fourthDetailsApproval } from './fourth-details-ancestry.mjs';\nimport assert from 'node:assert/strict';\nimport fs from 'node:fs/promises';\n",
    ],
    [
      '    proof = item.proof;\n  if (\n    proof?.reviewedCenteringSource === p.afterRenderer &&\n    (await fourthDetailsApproval(item, group))\n  )\n    return true;\n',
      '    proof = item.proof;\n  if (\n    proof?.reviewedCenteringSource === p.afterRenderer &&\n    (await fourthFlavorApproval(item, group))\n  )\n    return true;\n  if (\n    proof?.reviewedCenteringSource === p.afterRenderer &&\n    (await fourthDetailsApproval(item, group))\n  )\n    return true;\n',
    ],
  ],
  'games/magic/tools/accuracy/calibration-report.mjs': [
    [
      "import { fourthDetailsAffected, fourthDetailsApproval } from './fourth-details-ancestry.mjs';\nimport { fourthCenteredAffected, fourthCenteredApproval } from './fourth-centered-ancestry.mjs';\nimport { wallWordingAffected } from './wall-wording-data.mjs';\n",
      "import { fourthFlavorAffected, fourthFlavorApproval } from './fourth-flavor-ancestry.mjs';\nimport { fourthDetailsAffected, fourthDetailsApproval } from './fourth-details-ancestry.mjs';\nimport { fourthCenteredAffected, fourthCenteredApproval } from './fourth-centered-ancestry.mjs';\nimport { wallWordingAffected } from './wall-wording-data.mjs';\n",
    ],
    [
      '        ...(item.originalInput ? [{ task, item: item.originalInput, original: true }] : []),\n      ]);\n      for (const { task, item, original } of dependencies) {\n        if (\n          (await fourthDetailsAffected(set.set, task, original, group)) &&\n          !(await fourthDetailsApproval(item, group))\n',
      "        ...(item.originalInput ? [{ task, item: item.originalInput, original: true }] : []),\n      ]);\n      for (const { task, item, original } of dependencies) {\n        if (\n          (await fourthFlavorAffected(set.set, task, original, group)) &&\n          !(await fourthFlavorApproval(item, group))\n        ) {\n          item.status = 'needs-audit';\n          item.reason =\n            'Pure-flavor bodies now use fractional native metrics. Current body/whole-card evidence is required for affected groups. Words, margins, other regions and unrelated groups retain their evidence.';\n        }\n        if (\n          (await fourthDetailsAffected(set.set, task, original, group)) &&\n          !(await fourthDetailsApproval(item, group))\n",
    ],
  ],
};
