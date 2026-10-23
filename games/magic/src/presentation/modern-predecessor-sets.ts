// Implicit-era guard from the pinned Scryfall set catalog (2026-10-12).
// Catalog SHA256:568fbbe087dc4cef55cfa1c9ef53e0718e3cb018e14b395e0f365dd0b28996c0.
// Explicit M15 asset-family selection can override a historical set's era.
export const PRE_M15_SETS = new Set(
  (
    '10e 2ed 3ed 4bb 4ed 5dn 5ed 6ed 7ed 8ed 9ed ala all apc arb arc arn ath atq avr bchr bng bok ' +
    'brb btd c13 ced cei chk chr cm1 cmd cns con csp cst dci dd1 dd2 ddc ddd dde ddf ddg ddh ddi ' +
    'ddj ddk ddl ddm dgm dis dka dkm dpa drb drk dst eve exo f01 f02 f03 f04 f05 f06 f07 f08 f09 ' +
    'f10 f11 f12 f13 f14 fbb fem fnm fut g00 g01 g02 g03 g04 g05 g06 g07 g08 g09 g10 g11 g99 gpt ' +
    'gtc h09 hho hml hop ice inv isd itp j12 j13 j14 jgp jou jp1 jud l12 l13 l14 lea leb leg lgn ' +
    'lrw m10 m11 m12 m13 m14 mbs md1 me1 me2 me3 me4 mgb mir mma mmq mor mpr mrd nem nph o90p ' +
    'oarc oc13 ocm1 ocmd ody ohop olep olgc ons opc2 ovnt p02 p03 p04 p05 p06 p07 p08 p09 p10 ' +
    'p10e p11 p15a p2hg p5dn p8ed p9ed pal00 pal01 pal02 pal03 pal04 pal05 pal06 pal99 pala palp ' +
    'papc parb parl past pavr pbng pbok pc2 pcel pchk pcmd pcmp pcns pcon pcsp pcy pd2 pd3 pdgm ' +
    'pdis pdka pdp10 pdp12 pdp13 pdp14 pdp15 pdrc pdst pdtp pelp peve pexo pfut pgpt pgpx pgru ' +
    'pgtc phel phop phpr phuk pidw pinv pisd pjas pjjt pjou pjse pjud plc plgm plgn plrw pls pm10 ' +
    'pm11 pm12 pm13 pm14 pm15 pmbs pmei pmic pmmq pmoa pmor pmps pmps06 pmps07 pmps08 pmps09 ' +
    'pmps10 pmps11 pmrd pnem pnph pody pons por ppc1 ppcy pplc ppls ppro pptk pr2 prav pred prm ' +
    'proe prtr ps11 ps14 psal pscg psdc psdg pshm psok psom psth psus ptc pths ptk ptmp ptor ptsp ' +
    'puds pulg punh purl pusg pvan pw11 pw12 pwor pwos pwwk pzen rav ren rin roe rqs rtr s00 s99 ' +
    'scg shm sok som sth sum t10e tala tarb tavr tbng tbth tcns tcon td0 td2 tdag tdd1 tdd2 tddc ' +
    'tddd tdde tddf tddg tddh tddi tddj tddk tddl tddm tdgm tdka teve tfth tgtc thp1 thp2 thp3 ' +
    'ths tisd tjou tlrw tm10 tm11 tm12 tm13 tm14 tmbs tmd1 tmma tmor tmp tnph tor troe trtr tsb ' +
    'tshm tsom tsp tths tugl twwk tzen uds ugl ulg unh usg v09 v10 v11 v12 v13 vis vma wc00 wc01 ' +
    'wc02 wc03 wc04 wc97 wc98 wc99 wmc wth wwk zen '
  )
    .trim()
    .split(/\s+/),
);
