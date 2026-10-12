import manifest from '../../assets.json' with { type: 'json' };
import type { FaceRect, RenderedCardInput } from './face-layout.js';
/** Keyrune set-symbol SVGs by Andrew Gioia, pinned to commit 256add455.
 * Glyph SVGs are GPL-3.0: https://github.com/andrewgioia/keyrune/blob/256add455a043462f7b2bfa224ca71bfc66b62ab/LICENSE.md
 * The CDN serves immutable vectors with CORS so Canvas2D and CSS use the same art.
 */
const KEYRUNE_ROOT = manifest.KEYRUNE_ROOT;
/** Visible bounds in the pinned 32-square vectors. Transparent viewport padding
 * must not shrink wide core-set icons. Custom assets keep their own viewport. */
const CORE_SYMBOL_CROPS: Readonly<Record<string, FaceRect>> = {
  m15: [0.25 / 32, 7.6 / 32, 31.5 / 32, 16.8 / 32],
  m19: [0, 9.314 / 32, 1, 13.38 / 32],
  m20: [0, 9.31 / 32, 1, 13.38 / 32],
  m21: [0, 9.33 / 32, 1, 13.34 / 32],
};

export function setSymbolCrop(face: Pick<RenderedCardInput, 'setCode' | 'setSymbol'>): FaceRect {
  return !face.setSymbol
    ? (CORE_SYMBOL_CROPS[face.setCode?.toLowerCase() ?? ''] ?? [0, 0, 1, 1])
    : [0, 0, 1, 1];
}
const KEYRUNE_CODES = new Set(
  `
10e 2ed 2x2 2xm 3ed 40k 4ed 5dn 5ed 6ed 7ed 8ed 9ed a25 acr aer afc afr akh akr
ala all apc arb arc arn ath atq avr bbd bcore bfz big blb blc bng bok boros bot br
brb brc bro brr btd c13 c14 c15 c16 c17 c18 c19 c20 c21 cc1 cc2 chk chr clb clu
cm1 cm2 cma cmd cmm cmr cn2 cns csp dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl
ddm ddn ddo ddp ddq ddr dds ddt ddu dft dgm dimir dis dka dkm dmc dmr dmu dom dpa
drb drc drk dsc dsk dst dtk dvk e01 e02 ecc ecl eld ema emn eoc eoe eos eve evg
exo exp fdc fdn fem fic fin fra frf fut gn2 gn3 gnt gpt grn gruul gs1 gtc h09 h17
ha1 hbg hml hob hoc hop hou ice ice2 iko ima inr inv isd izzet j20 j21 j22 j25 jmp
jou jud khc khm kld klr ktk lcc lci lea leb leg lgn lrw ltc ltr m10 m11 m12 m13
m14 m15 m19 m20 m21 m3c mar mat mb1 mb2 mbs md1 me1 me2 me3 me4 med mh1 mh2 mh3
mic mid mir mkc mkm mm2 mm3 mma mmq moc mom mor mp1 mp2 mrd msc msh ncc nec nem
neo nms nph ody ogw om1 omb onc one ons ori otc otj otp papac parl parl2 parl3 past pbook
pc2 pca pcy pd2 pd3 pdep pdgc peuro pfnm pgru pidw pio pip plc pleaf pls pm2 pma pmei pmodo
pmps pmpu pmtg1 pmtg2 po2 por psega psum ptg ptk ptsa pxbox pz2 rav rex rix rna roe rtr rvr
s00 s99 scg shm simic sld2 snc soa soc soi sok som sos spe spg spm ss1 ss2 ss3 sta
sth stx td2 tdc tdm thb ths tla tle tmc tmp tmt tor tpr tsp tsr uds ugl ulg uma
una und unf unh usg ust v09 v0x v10 v11 v12 v13 v14 v15 v16 v17 van vis vma voc
vow w16 w17 war who woc woe wot wth wwk x1e x2e x2ps x2u x3e x4ea xcle xice xlcu xln
xmods xren xrin y22 y24 y25 y26 ydmu zen znc zne znr
`
    .trim()
    .split(/\s+/),
);
KEYRUNE_CODES.add('con_');

/** Original four-facet gem for locally authored cards; no official set identity. */
export const LOCAL_CARD_SET_CODE = 'GLINT';
const LOCAL_RARITY_INK: Record<string, string> = {
  common: '#171717',
  uncommon: '#8c9ba5',
  rare: '#bc923f',
  mythic: '#d66b32',
  special: '#926ab5',
  bonus: '#926ab5',
};
function localCardSymbol(rarity: string): string {
  const ink = LOCAL_RARITY_INK[rarity] ?? LOCAL_RARITY_INK.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path fill="${ink}" stroke="#171717" stroke-width="2" d="M50 3 8 44h32L50 3Zm0 0 10 41h32L50 3ZM8 52l38 45-6-45H8Zm52 0-6 45 38-45H60Z"/></svg>`)}`;
}

/** Original forge mark: a four-point spark rising over an anvil. Shared by
 * the type-line icon and the larger etched/opal stamp; no external asset fetch. */
function forgeSymbol(rarity: string): string {
  const ink = LOCAL_RARITY_INK[rarity] ?? LOCAL_RARITY_INK.common;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g fill="${ink}" stroke="#171717" stroke-width="2" stroke-linejoin="round"><path d="m50 3 7 17 17 7-17 7-7 17-7-17-17-7 17-7Z"/><path d="M8 48h84L78 64H62v16l12 10H26l12-10V64H22ZM15 94h70v4H15Z"/></g></svg>`)}`;
}

export function setSymbolVector(code: string, rarity = 'common'): string | null {
  const normalized = code.trim().toLowerCase();
  if (normalized === 'forge') return forgeSymbol(rarity);
  if (normalized === LOCAL_CARD_SET_CODE.toLowerCase()) return localCardSymbol(rarity);
  const key = normalized === 'con' ? 'con_' : normalized;
  return KEYRUNE_CODES.has(key) ? `${KEYRUNE_ROOT}/${key}.svg` : null;
}
