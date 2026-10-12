/** Sets using the ordinary template before the 2018 divider update.
 * DDU deliberately stays out: Elves vs. Inventors previewed the DOM template.
 * Source: https://magic.wizards.com/en/news/announcements/dominaria-frame-template-and-rules-changes-2018-03-21
 * Retro paper has a separate policy. Unknown/custom sets keep the current style. */
const preDividerSets = new Set(
  (
    '8ed wc03 mrd dst 5dn wc04 chk unh bok sok 9ed psal rav phuk gpt dis csp cst tsb tsp hho ' +
    'plc fut 10e me1 lrw dd1 mor shm eve me2 ala dd2 con ddc arb m10 hop ohop me3 zen ddd h09 ' +
    'wwk dde roe dpa arc oarc m11 ddf som td0 pd2 olgc ps11 me4 mbs ddg nph td2 cmd ocmd pcmd ' +
    'm12 ddh isd pd3 dka ddi phel avr opc2 pc2 m13 ddj rtr ocm1 gtc ddk dgm mma m14 ddl thp1 ' +
    'ths tfth c13 oc13 bng thp2 tbth ddm jou thp3 tdag md1 cns vma ppc1 cp1 m15 ddn ktk c14 ' +
    'oc14 dvd evg gvl jvc cp2 frf ddo dtk tpr mm2 cp3 ori ddp bfz c15 oc15 ogw ddq soi w16 ' +
    'ema emn cn2 ddr kld c16 oc16 opca pca aer mm3 dds w17 akh cma e01 oe01 hou c17 oc17 ' +
    'h17 phtr xln g17 ddt ima e02 ust rix a25'
  ).split(' '),
);

export function hasFlavorSeparator(setCode?: string | null): boolean {
  return !preDividerSets.has(setCode?.trim().toLowerCase() ?? '');
}
