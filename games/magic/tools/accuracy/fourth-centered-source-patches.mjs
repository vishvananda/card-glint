export const fourthCenteredSourcePatches = {
  'games/magic/src/presentation/retro-rules.ts': [
    [
      '  if (expansion) return expansion;\n  const frame = earlyReprintFrame(face);\n  const body = frame && calibrationForFace(face)?.body;\n  const fitted = body && (body[frame.material!] ?? body.default);\n  if (fitted) return calibratedBodyLayout(context, face, fitted, paragraphs, reference);\n  const set = face.setCode?.toLowerCase();\n  // Original Mirage\u2013Scourge printings use right-aligned attribution lines;\n  // early sets and Eighth Edition onward use a different policy.\n',
      "  if (expansion) return expansion;\n  const frame = earlyReprintFrame(face);\n  const body = frame && calibrationForFace(face)?.body;\n  const reviewedCenter =\n    !forcedLeft &&\n    reference.length > 0 &&\n    reference.every((p) => p.align === 'center') &&\n    paragraphs.every((p) => p.align === undefined || p.align === 'center');\n  const fitted =\n    body && (body[frame.material!] ?? (reviewedCenter ? body.centered : undefined) ?? body.default);\n  if (fitted)\n    return calibratedBodyLayout(\n      context,\n      face,\n      fitted,\n      fitted === body?.centered ? paragraphs.map((p) => ({ ...p, align: 'center' })) : paragraphs,\n      reference,\n    );\n  const set = face.setCode?.toLowerCase();\n  // Original Mirage\u2013Scourge printings use right-aligned attribution lines;\n  // early sets and Eighth Edition onward use a different policy.\n",
    ],
  ],
  'games/magic/src/calibration/types.ts': [
    [
      '  };\n  /** default or printed source-set key (Chronicles); custom host symbols bypass these. */\n  readonly setSymbols?: Readonly<Partial<Record<string, CalibratedSetSymbol>>>;\n  /** Omitted retains the established layout. Material override wins over default. */\n  readonly body?: Readonly<Partial<Record<string, CalibratedBody>>>;\n  readonly expansionBody?: CalibratedExpansionBody;\n  readonly bodyClasses?: CalibratedBodyClasses;\n',
      '  };\n  /** default or printed source-set key (Chronicles); custom host symbols bypass these. */\n  readonly setSymbols?: Readonly<Partial<Record<string, CalibratedSetSymbol>>>;\n  /** Omitted retains the established layout. Material overrides win. The centered\n   * entry applies only to an explicitly centered wording reference; default is\n   * the remaining fallback. All entries use the same measured body contract. */\n  readonly body?: Readonly<Partial<Record<string, CalibratedBody>>>;\n  readonly expansionBody?: CalibratedExpansionBody;\n  readonly bodyClasses?: CalibratedBodyClasses;\n',
    ],
  ],
  'games/magic/tools/build-printing-corrections.mjs': [
    [
      "      if (r.paragraphs) fields.rulesParagraphs = r.paragraphs;\n    }\n    if (r.flavorReviewNote && Object.hasOwn(r, 'flavorText')) fields.flavorText = r.flavorText;\n    add(\n      id,\n      undefined,\n",
      "      if (r.paragraphs) fields.rulesParagraphs = r.paragraphs;\n    }\n    if (r.flavorReviewNote && Object.hasOwn(r, 'flavorText')) fields.flavorText = r.flavorText;\n    if (r.paragraphScope !== undefined) {\n      assert.equal(r.paragraphScope, 'rules-only');\n      assert(fields.rulesParagraphs?.every((p) => p.role === 'rules'));\n    }\n    add(\n      id,\n      undefined,\n",
    ],
    [
      "        data.note ??\n        'Scan-reviewed original wording.',\n      fields,\n    );\n  }\n}\n",
      "        data.note ??\n        'Scan-reviewed original wording.',\n      fields,\n      r.paragraphScope,\n    );\n  }\n}\n",
    ],
  ],
};
