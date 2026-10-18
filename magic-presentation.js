import { a6 as s, a7 as n } from "./mtgjson-card-r2T__XfS.js";
import { a8 as c, a9 as b, aa as p, ab as m, ac as u, ad as y, ae as h, F as g, z as S, af as R, ag as T, ah as E, ai as A, P as C, aj as P, ak as _, al as M, j as v, am as w, an as L, ao as O, ap as x, aq as F, ar as G, as as j, at as N, au as D, av as U, aw as B, ax as k, ay as I, A as H, B as z, az as Y, x as W, aA as K, q as V, t as q, r as J, aB as Q, aC as X, aD as Z, l as $, C as aa, aE as ea, aF as ta, aG as sa, aH as na, aI as ra, aJ as oa, aK as ia, aL as la, aM as fa, k as da, o as ca, f as ba, aN as pa, aO as ma, g as ua, aP as ya, aQ as ha, aR as ga, aS as Sa, aT as Ra, D as Ta, E as Ea, aU as Aa, h as Ca, aV as Pa, e as _a, aW as Ma, c as va, aX as wa, aY as La, aZ as Oa, a_ as xa, G as Fa, m as Ga, a$ as ja, b0 as Na, b1 as Da, b2 as Ua, b3 as Ba, b4 as ka, b5 as Ia, b6 as Ha, b7 as za, b8 as Ya, b9 as Wa, ba as Ka, bb as Va, bc as qa, bd as Ja, be as Qa, bf as Xa, p as Za, bg as $a, bh as ae, bi as ee, bj as te, bk as se, bl as ne, H as re, I as oe, J as ie, K as le, L as fe, M as de, N as ce, O as be, Q as pe, R as me, T as ue, U as ye, V as he, W as ge, X as Se, Y as Re, Z as Te, _ as Ee, bm as Ae, bn as Ce, bo as Pe, bp as _e, bq as Me, $ as ve, br as we, bs as Le, bt as Oe, bu as xe, bv as Fe, a0 as Ge, bw as je, bx as Ne, by as De, bz as Ue, bA as Be, bB as ke, bC as Ie, bD as He, bE as ze, bF as Ye, bG as We, a1 as Ke, bH as Ve, bI as qe, bJ as Je, bK as Qe, bL as Xe, bM as Ze, bN as $e, bO as at, s as et, bP as tt, bQ as st, bR as nt, bS as rt, bT as ot, bU as it, a2 as lt, a3 as ft, a4 as dt, bV as ct, v as bt, a5 as pt, bW as mt } from "./mtgjson-card-r2T__XfS.js";
import { s as yt } from "./asset-fetch-BSXnVtJ9.js";
const r = `@font-face {
  font-family: 'CardRenderer MTG Beleren';
  /* This file already contains bold outlines. Match both requested weights
     without a second, synthetic emboldening in Canvas2D (notably WebKit). */
  font-weight: 400 700;
  src: url('https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/beleren-bold_P1.01.ttf')
    format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'CardRenderer MTG MPlantin';
  src: url('https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/mplantin.woff')
    format('woff');
  font-display: swap;
}
@font-face {
  font-family: 'CardRenderer MTG MPlantin';
  /* The former MPlantin-Italic.ttf has overlapping SFNT tables and fails OTS. */
  src: url('https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/fonts/mplantin-i.ttf')
    format('truetype');
  font-style: italic;
  font-display: swap;
}
@font-face {
  font-family: 'CardRenderer MTG Relay';
  src: url('https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/relay-medium.ttf')
    format('truetype');
  font-display: swap;
}
@font-face {
  font-family: 'CardRenderer MTG Artist Credit';
  src: url('https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/fonts/NDPMTG.ttf')
    format('truetype');
  font-display: swap;
}

/* Eighth Edition plate headers; fetched only when this family is prepared. */
@font-face {
  font-family: 'CardRenderer MTG Matrix';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/matrix-b.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 700;
  font-display: block;
}

/* Matrix small-caps has the lining numerals printed in the 2003 PT badge. */
@font-face {
  font-family: 'CardRenderer MTG Matrix Small Caps';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/data/fonts/matrix-bsc.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 700;
  font-display: block;
}

/* PLC's native P/T face: proportional 1 and a real variable-stat star. */
@font-face {
  font-family: 'CardRenderer MTG ModMatrix';
  src: url('https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/Magic%20-%20Fonts/ModMatrix.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 700;
  font-display: block;
}

/* Chapter numerals from the pinned Saga layout's Plantin Semibold face. */
@font-face {
  font-family: 'CardRenderer MTG Chapter';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/plantin-semibold.otf')
    format('opentype');
  font-weight: 550;
  font-display: block;
}

/* Regular Matrix is the type-line face on the 2003 split plates. */
@font-face {
  font-family: 'CardRenderer MTG Matrix';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/fonts/matrix.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 400;
  font-display: block;
}

/* Printed small caps and numerals for native Adventure artist and P/T lines. */
@font-face {
  font-family: 'CardRenderer MTG Beleren Small Caps';
  src: url('https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/data/fonts/beleren-bsc.ttf')
    format('truetype');
  font-style: normal;
  font-weight: 700;
  font-display: block;
}
`, i = [
  ...[...r.matchAll(/@font-face\s*\{([^}]+)\}/g)].map(([, a]) => ({
    family: /font-family:\s*'([^']+)'/.exec(a)[1],
    url: /src:\s*url\('([^']+)'\)/.exec(a)[1],
    weight: /font-weight:\s*([^;]+)/.exec(a)?.[1]?.trim() ?? "400",
    style: /font-style:\s*([^;]+)/.exec(a)?.[1]?.trim() ?? "normal"
  })),
  ...s
];
function l(a, e, t) {
  return !a || ["forge", "glint"].includes(a.toLowerCase()) || n(a, e, t) ? "none" : {
    uncommon: "brightness(0) invert(.65)",
    rare: "brightness(0) invert(.62) sepia(.8) saturate(2) hue-rotate(5deg)",
    mythic: "brightness(0) invert(.48) sepia(1) saturate(4) hue-rotate(340deg)",
    special: "brightness(0) invert(.45) sepia(.5) saturate(2) hue-rotate(220deg)",
    bonus: "brightness(0) invert(.6) sepia(.8) saturate(2)"
  }[e ?? "common"] ?? "none";
}
export {
  c as ADVENTURE_RULE_BOUNDS,
  b as CLASS_LEVEL_ASSET,
  p as DEFAULT_ART_BOUNDS,
  m as ETCHED_SET_MARK_PATH,
  u as FACE_CORNER_RADIUS,
  y as FACE_HEIGHT,
  h as FACE_LAYOUT_STYLE,
  g as FACE_RECTS,
  S as FACE_TEXT,
  R as FACE_WIDTH,
  T as FLIP_PANEL_RECTS,
  E as LOCAL_CARD_SET_CODE,
  A as MSE_TEMPLATE_ROOT,
  C as PLAIN_SECURITY_STAMP,
  P as PLANESWALKER_COST_GEOMETRY,
  _ as PLANESWALKER_RULE_GEOMETRY,
  M as POWER_TOUGHNESS_LAYOUT,
  v as PREPARE_SPELL_RECTS,
  w as RENDERER_COMPONENT_ROOT,
  L as RETRO_FONT,
  O as RETRO_ROOT,
  x as RETRO_SYMBOL_FONT,
  F as RETRO_WHITE,
  G as RULES_TYPOGRAPHY,
  j as SAGA_CHAPTER,
  N as SAGA_MARKER_GEOMETRY,
  D as SAGA_RECTS,
  U as SAGA_RULE_BOUNDS,
  B as STANDARD_TEMPLATE_DEFAULTS,
  k as SYMBOL_ADJUSTMENT_VERSION,
  I as adjustedSymbolBounds,
  H as artPlacementSupport,
  z as artworkGeometry,
  Y as canvasAssetUrls,
  W as canvasAssetWidth,
  i as canvasFontAssets,
  K as cardStock,
  V as cardTextureKey,
  q as clearEarlyHsbBitmaps,
  J as clearHistoricalSymbolSources,
  Q as colorCalibrationCoverage,
  X as colorGlyphTransform,
  Z as componentAsset,
  $ as composeCardTexture,
  aa as composePrintingSelection,
  ea as croppedIllustration,
  ta as decodeCanvasImage,
  sa as ellipsizedText,
  na as etchedSetLabel,
  ra as extraRuleAssets,
  oa as extraRuleBlocks,
  ia as extraRuleKey,
  la as faceArtBounds,
  fa as faceCanvas,
  da as faceCornerRadius,
  ca as faceEtchingSymbol,
  ba as faceFrame,
  pa as faceLayoutStyle,
  ma as faceManaAssets,
  ua as faceRects,
  ya as faceSetSymbol,
  ha as faceStats,
  ga as fetchCanvasAsset,
  Sa as framePlate,
  Ra as framePlateUrls,
  Ta as fromMtgjsonCard,
  Ea as fromScryfallCard,
  Aa as hasExtraRules,
  Ca as hasOvalSecurityStamp,
  Pa as illustrationCover,
  _a as illustrationTarget,
  Ma as inspectionCardFace,
  va as isRetro,
  wa as layoutRules,
  La as loadCanvasFonts,
  Oa as loadCanvasImages,
  xa as loadRetroFont,
  Fa as manaSymbolAsset,
  Ga as mountedSecurityStamp,
  ja as normalizeColors,
  Na as ordinaryTextLayout,
  Da as paintAbilityEmblem,
  Ua as paintAdjustedSymbols,
  Ba as paintAssembledFace,
  ka as paintCardStatus,
  Ia as paintEtchingMask,
  Ha as paintExtraRules,
  za as paintFittedText,
  Ya as paintIllustration,
  Wa as paintMana,
  Ka as paintPlaneswalkerPaper,
  Va as paintRetroFace,
  qa as paintRules,
  Ja as paintRulesLayout,
  Qa as paintSetSymbol,
  Xa as paintSpecialRules,
  Za as panelRect,
  $a as panelStyle,
  ae as panelTransform,
  ee as pixels,
  te as planeswalkerInkLimits,
  se as planeswalkerRuleRows,
  ne as printingBorder,
  re as printingCalibrationApiVersion,
  oe as printingCalibrationOptions,
  ie as printingCalibrationProfiles,
  le as printingElementSupport,
  fe as printingPresetApiVersion,
  de as printingPresetCompatibility,
  ce as printingPresets,
  be as printingStyleApiVersion,
  pe as printingStyleOptions,
  me as printingStyles,
  ue as profileAssets,
  ye as resolveArtPlacement,
  he as resolveCardProfile,
  ge as resolveFrameColors,
  Se as resolvePrintingCalibration,
  Re as resolvePrintingPreset,
  Te as resolvePrintingStyle,
  Ee as resolveScryfallPrinting,
  Ae as retroAssets,
  Ce as retroBasicSymbol,
  Pe as retroBorder,
  _e as retroBorderMask,
  Me as retroEarly,
  ve as retroFamily,
  s as retroFontAssets,
  we as retroFrameAsset,
  Le as retroFrameFilter,
  Oe as retroFrameRect,
  xe as retroInk,
  Fe as retroPx,
  Ge as retroRects,
  je as retroRulesSize,
  Ne as retroSetSymbol,
  De as retroStock,
  Ue as retroTextLayout,
  Be as ruleBadgeAsset,
  ke as rulesDensity,
  Ie as rulesFont,
  He as rulesFontSize,
  ze as rulesLines,
  Ye as sagaRuleLayout,
  We as sagaTextbox,
  yt as setAssetFetcher,
  Ke as setSymbolAsset,
  Ve as setSymbolCrop,
  l as setSymbolFilter,
  qe as setSymbolVector,
  Je as sizedCanvasSvg,
  Qe as spacedManaBounds,
  Xe as specialPaperColor,
  Ze as specialRuleRows,
  $e as specialRules,
  at as splitHasFuse,
  et as splitPanels,
  tt as splitTextScale,
  st as standardTemplateAssets,
  nt as standardTemplateParts,
  rt as standardTemplateRects,
  ot as symbolTextParts,
  it as templateMaterial,
  lt as validateArtPlacement,
  ft as validatePrintingCalibration,
  dt as validatePrintingStyle,
  ct as validateSymbolAdjustment,
  bt as visibleArt,
  pt as withCardWording,
  mt as wordingParagraphs
};
