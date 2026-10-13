# Existing old-frame source candidates

Choose frame sources before fitting color. The current renderer uses three
ordinary families (ABU, Fourth and Seventh), plus a specialized Legends gold
frame. Family choice is not yet a validated per-set result. The new
[coverage plan](fixtures/accuracy/old-frame-family-plan.json) records every
old-frame set/material group in the major-set inventory and separate
calibration/reserved printing names. Its selection fields deliberately remain
unmeasured until comparisons exist.

## Most useful existing asset

The pinned Card Conjurer collection already contains
[`old/abu/dualLand.png`](https://github.com/Investigamer/cardconjurer/blob/2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/dualLand.png),
a 1500 × 2100 alpha mask for alternating nested land bands. The
[ABU pack definition](https://github.com/Investigamer/cardconjurer/blob/2fcddba8966156d484cedf54d8214996748dd5e1/js/frames/packABU.js)
associates it with the neutral and five colored land frames. Composite two
colored land assets through its alpha; its blue RGB is mask visualization,
not printed blue ink. Validate both color ordering and geometry against scans.

This explains the missing stripes in our duals: the current painter chooses a
single generic land frame for a card with two basic-land types. Oracle and
original-wording views must retain the same semantic land palette, even when
the printed type line is only "Land". Avoid substituting color identity for
printed frame colors on arbitrary utility lands.

The Fourth directory has a neutral land asset but no five colored-land assets.
The Seventh directory has those colored lands. ABU and Revised dual scans do
not have identical art-window geometry, so adding the ABU overlay alone does
not certify Revised alignment. Test this as part of source selection before
recalibrating land colors.

## Other source collections inspected

- [Magic Set Editor Full Magic Pack, ABU style](https://github.com/MagicSetEditorPacks/Full-Magic-Pack/tree/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-old-abu.mse-style)
  has 750 × 1054 card JPEGs, separate alpha/land blending masks and historical
  symbol resources. The inspected textures appear closely related to the
  current source family; no demonstrated quality improvement yet. Its art
  overlay is a halftone layer, not a replacement bevel/shadow component.
- [Proxyshop's template manifest](https://github.com/Investigamer/Proxyshop/blob/9be3f1a4058f09fd5eedc890ee27f0e665c6b25c/src/data/manifest.yml)
  lists layered Classic and Classic Remastered templates. Their previews target
  later old-frame styling; they are candidates for later geometry/asset work,
  not established Alpha–Revised replacements. Full PSDs have not been evaluated.

White-card texture was visually confirmed to match the existing asset. Remove
it from replacement candidates. A difference in measured contrast spread is
insufficient evidence of a different texture.

Downloads stay in the local cache/review workspace. Do not add these external
images to the public showcase or README. Inspect provenance and redistribution
terms before adopting assets from a new collection; repository code licensing
does not establish rights to every contained card-frame image.
