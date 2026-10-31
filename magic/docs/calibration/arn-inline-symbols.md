# Arabian Nights symbol roles

The original generic symbol in the rules box does not use the header treatment.
The ARN profile now has separate inline generic pigments for artifact and red
frames. The artifact symbol has a blue-gray disc. The red symbol has a dark,
translucent disc. Casting-cost pigments and numeric adjustments stay separate.

These settings apply with original symbols in either wording mode. Selecting
modern symbols keeps their glyphs and numeral proportions, while retaining the
printing's measured cost position, disc size and spacing. Caller adjustments
remain relative to those defaults. Custom frames retain their own placement.

The correction uses the existing assets and loaded font. It adds no image
decoding, font loading or pixel readback during painting.

## Evidence and scope

The receipt at fixtures/accuracy/arn-recheck/symbol-roles-076.json.gz records
native comparisons against 0.7.5 for all 92 printings in Original, Oracle with
original symbols, and Oracle with modern symbols. The 12 Original inline-symbol
changes and 83 modern cost changes stay inside the relevant regions.
Silhouettes are unchanged. Another 182 native controls from other frame
families are byte-identical.

The receipt also records exact source reconstruction, a review-metadata update,
and conversion of six arithmetic ratios into equivalent literal numbers. Historical results remain attached to their original source revision.
This regional fix does not certify the full ARN calibration or its client scan
registration.

Run npm run test:magic-arn for the profile and evidence checks. To reproduce
the native comparison, generate the set tables in a clean 0.7.5 source tree,
then run the following from the candidate checkout with a populated local cache:

    MAGIC_ACCURACY_CACHE=/path/to/cache node \
      games/magic/tools/accuracy/printing-symbol-mode-audit.mjs \
      frozen-original-inputs.json new-output /path/to/clean-0.7.5

The script refuses an existing output directory and downloads nothing. The
frozen inputs must include original wording and source-asset identities. Cached
modern-symbol assets and fonts must also be available.
