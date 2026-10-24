import type { RenderedCardInput } from './face-layout.js';
export type EighthStyleInput = Pick<
  RenderedCardInput,
  | 'setCode'
  | 'borderColor'
  | 'frameAssetFamily'
  | 'frameStyle'
  | 'frameTreatment'
  | 'frameTemplate'
  | 'layout'
  | 'typeLine'
  | 'canonicalTypeLine'
  | 'faces'
  | 'rulesText'
>;
/** Ordinary source family only. Dedicated and colorshifted painters retain their measurements. */
export function supportsEighthStyleDefaults(face: EighthStyleInput): boolean {
  return (
    face.frameAssetFamily === 'eighth' &&
    face.setCode?.toLowerCase() !== 'plc' &&
    (face.borderColor === undefined ||
      face.borderColor === 'white' ||
      face.borderColor === 'black') &&
    face.frameStyle !== 'retro' &&
    !face.frameTreatment &&
    !face.frameTemplate &&
    !face.faces?.length &&
    (!face.layout || face.layout === 'normal') &&
    !/\b(Saga|Class|Planeswalker|Battle)\b/.test(face.canonicalTypeLine ?? face.typeLine ?? '') &&
    !/^Level up\b/m.test(face.rulesText ?? '')
  );
}

/** Conservative preload from catalog SHA256 568fbbe087dc4cef55cfa1c9ef53e0718e3cb018e14b395e0f365dd0b28996c0.
 * Mixed and promotional sets still require face-aware source-family checks. */
const eraSets = new Set(
  '10e 5dn 8ed 9ed ala arb arc avr bng bok c13 chk cm1 cmd cns con csp cst dci dd1 dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl ddm dgm dis dka dpa drb dst eve f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 fut g04 g05 g06 g07 g08 g09 g10 g11 gpt gtc h09 hho hop isd j12 j13 j14 jou l12 l13 l14 lrw m10 m11 m12 m13 m14 mbs md1 me1 me2 me3 me4 mma mor mrd nph oarc oc13 ocm1 ocmd ohop olgc opc2 p04 p05 p06 p07 p08 p09 p10 p10e p11 p15a p2hg p5dn p8ed p9ed pal04 pal05 pal06 pala parb pavr pbng pbok pc2 pchk pcmd pcmp pcns pcon pcsp pd2 pd3 pdgm pdis pdka pdp10 pdp12 pdp13 pdp14 pdp15 pdst pdtp peve pfut pgpt pgpx pgtc phel phop phuk pidw pisd pjas pjou pjse plc plrw pm10 pm11 pm12 pm13 pm14 pm15 pmbs pmor pmps pmps06 pmps07 pmps08 pmps09 pmps10 pmps11 pmrd pnph ppc1 pplc ppro prav proe prtr ps11 ps14 psal psdc pshm psok psom pths ptsp punh purl pw11 pw12 pwwk pzen rav roe rtr shm sok som t10e tala tarb tavr tbng tbth tcns tcon td0 td2 tdag tdd1 tdd2 tddc tddd tdde tddf tddg tddh tddi tddj tddk tddl tddm tdgm tdka teve tfth tgtc thp1 thp2 thp3 ths tisd tjou tlrw tm10 tm11 tm12 tm13 tm14 tmbs tmd1 tmma tmor tnph troe trtr tsb tshm tsom tsp tths twwk tzen unh v09 v10 v11 v12 v13 vma wc03 wc04 wmc wwk zen'.split(
    ' ',
  ),
);
export function eighthSetUsesDefaults(code: string): boolean {
  return eraSets.has(code.toLowerCase());
}
