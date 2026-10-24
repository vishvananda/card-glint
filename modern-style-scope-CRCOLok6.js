const l = [
  "2ed",
  "2x2",
  "2xm",
  "3ed",
  "4ed",
  "5ed",
  "6ed",
  "7ed",
  "8ed",
  "a25",
  "aer",
  "afc",
  "afr",
  "ala",
  "all",
  "apc",
  "arb",
  "arn",
  "ath",
  "atq",
  "avr",
  "bbd",
  "blb",
  "blc",
  "bng",
  "bok",
  "brb",
  "brc",
  "bro",
  "btd",
  "c13",
  "c14",
  "c15",
  "c19",
  "c21",
  "chr",
  "clb",
  "cm2",
  "cmd",
  "cmm",
  "cn2",
  "cns",
  "con",
  "csp",
  "dd2",
  "ddc",
  "dde",
  "ddf",
  "ddg",
  "ddh",
  "ddi",
  "ddj",
  "ddl",
  "ddn",
  "ddo",
  "ddq",
  "dds",
  "ddt",
  "ddu",
  "dft",
  "dgm",
  "dka",
  "dmc",
  "dmr",
  "dmu",
  "dpa",
  "drc",
  "drk",
  "dsc",
  "dsk",
  "dst",
  "e01",
  "ecc",
  "ecl",
  "eld",
  "ema",
  "emn",
  "eoc",
  "eoe",
  "eve",
  "exo",
  "fdc",
  "fdn",
  "fem",
  "frc",
  "frf",
  "fut",
  "gn3",
  "gnt",
  "hml",
  "hob",
  "hoc",
  "hop",
  "hou",
  "ice",
  "iko",
  "ima",
  "inr",
  "inv",
  "itp",
  "j22",
  "j25",
  "jmp",
  "jou",
  "jud",
  "kld",
  "ktk",
  "lcc",
  "lci",
  "lea",
  "leb",
  "leg",
  "m10",
  "m11",
  "m12",
  "m13",
  "m15",
  "m19",
  "m20",
  "m21",
  "mbs",
  "mh1",
  "mh2",
  "mh3",
  "mid",
  "mir",
  "mkc",
  "mkm",
  "mm3",
  "mma",
  "mmq",
  "moc",
  "mom",
  "msc",
  "msh",
  "ncc",
  "nec",
  "nem",
  "neo",
  "nph",
  "ody",
  "ogw",
  "one",
  "ons",
  "ori",
  "otc",
  "otj",
  "p02",
  "pc2",
  "pcy",
  "plc",
  "pls",
  "por",
  "ptk",
  "rqs",
  "rtr",
  "rvr",
  "s99",
  "scd",
  "scg",
  "shm",
  "sld",
  "snc",
  "soc",
  "soi",
  "sok",
  "som",
  "sos",
  "spm",
  "sth",
  "stx",
  "sum",
  "ths",
  "tla",
  "tle",
  "tmc",
  "tmp",
  "tmt",
  "tor",
  "tsb",
  "tsr",
  "uds",
  "ulg",
  "uma",
  "unf",
  "usg",
  "vis",
  "voc",
  "vow",
  "war",
  "woc",
  "woe",
  "wth",
  "wwk",
  "xln",
  "zen",
  "znr"
], f = ["2ed", "4ed", "chr", "fem"], i = {
  PLANAR_COLORS: "plc",
  PLANAR_TEXTURE: "plc"
}, o = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), d = /* @__PURE__ */ new Map(), m = /* @__PURE__ */ new Map(), h = new Set(l);
function c(t, e) {
  const p = i[t] ?? e?.split(/[/-]/)[0]?.toLowerCase();
  if (p && h.has(p) && !o.has(p + "/calibration"))
    throw Error(
      `Magic set ${p} is not prepared. Await loadMagicSet('${p}') or prepareMagicCards(cards) before synchronous layout queries.`
    );
}
function n(t) {
  if (!(!t || typeof t != "object" || Object.isFrozen(t))) {
    for (const e of Object.values(t)) n(e);
    Object.freeze(t);
  }
}
function w(t) {
  const e = t.set + "/" + t.kind;
  if (!o.has(e)) {
    for (const [p, s] of Object.entries(t.tables))
      for (const r of Object.keys(s))
        if (Object.hasOwn(d.get(p) ?? {}, r))
          throw Error(`Duplicate calibration value: ${p}/${r}`);
    n(t);
    for (const [p, s] of Object.entries(t.tables)) {
      const r = d.get(p) ?? /* @__PURE__ */ Object.create(null);
      Object.assign(r, s), d.set(p, r);
    }
    a.set(e, t), o.add(e);
  }
}
const k = (t, e = "calibration") => o.has(t + "/" + e), v = () => [...o].filter((t) => t.endsWith("/calibration")).map((t) => t.split("/")[0]).sort();
function j(t) {
  return m.has(t) || m.set(
    t,
    new Proxy(/* @__PURE__ */ Object.create(null), {
      get: (e, p) => {
        if (typeof p == "string")
          return c(t, p), d.get(t)?.[p];
      },
      has: (e, p) => typeof p == "string" && Object.hasOwn(d.get(t) ?? {}, p),
      ownKeys: () => (c(t), Object.keys(d.get(t) ?? {})),
      getOwnPropertyDescriptor: (e, p) => typeof p == "string" && Object.hasOwn(d.get(t) ?? {}, p) ? {
        value: d.get(t)[p],
        enumerable: !0,
        configurable: !0,
        writable: !1
      } : void 0,
      set: () => {
        throw TypeError("Set data is immutable");
      },
      defineProperty: () => {
        throw TypeError("Set data is immutable");
      },
      deleteProperty: () => {
        throw TypeError("Set data is immutable");
      },
      preventExtensions: () => !1
    })
  ), m.get(t);
}
function y(t, e) {
  const p = ["printingCorrections", "artistCredits"].includes(e) ? "wording" : "calibration", s = a.get(t + "/" + p);
  if (!s) throw Error(`Magic set ${t} is not prepared`);
  return s.tables[e] ?? {};
}
function S(t) {
  return t.frameAssetFamily === "eighth" && t.setCode?.toLowerCase() !== "plc" && (t.borderColor === void 0 || t.borderColor === "white" || t.borderColor === "black") && t.frameStyle !== "retro" && !t.frameTreatment && !t.frameTemplate && !t.faces?.length && (!t.layout || t.layout === "normal") && !/\b(Saga|Class|Planeswalker|Battle)\b/.test(t.canonicalTypeLine ?? t.typeLine ?? "") && !/^Level up\b/m.test(t.rulesText ?? "");
}
const g = new Set(
  "10e 5dn 8ed 9ed ala arb arc avr bng bok c13 chk cm1 cmd cns con csp cst dci dd1 dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl ddm dgm dis dka dpa drb dst eve f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 fut g04 g05 g06 g07 g08 g09 g10 g11 gpt gtc h09 hho hop isd j12 j13 j14 jou l12 l13 l14 lrw m10 m11 m12 m13 m14 mbs md1 me1 me2 me3 me4 mma mor mrd nph oarc oc13 ocm1 ocmd ohop olgc opc2 p04 p05 p06 p07 p08 p09 p10 p10e p11 p15a p2hg p5dn p8ed p9ed pal04 pal05 pal06 pala parb pavr pbng pbok pc2 pchk pcmd pcmp pcns pcon pcsp pd2 pd3 pdgm pdis pdka pdp10 pdp12 pdp13 pdp14 pdp15 pdst pdtp peve pfut pgpt pgpx pgtc phel phop phuk pidw pisd pjas pjou pjse plc plrw pm10 pm11 pm12 pm13 pm14 pm15 pmbs pmor pmps pmps06 pmps07 pmps08 pmps09 pmps10 pmps11 pmrd pnph ppc1 pplc ppro prav proe prtr ps11 ps14 psal psdc pshm psok psom pths ptsp punh purl pw11 pw12 pwwk pzen rav roe rtr shm sok som t10e tala tarb tavr tbng tbth tcns tcon td0 td2 tdag tdd1 tdd2 tddc tddd tdde tddf tddg tddh tddi tddj tddk tddl tddm tdgm tdka teve tfth tgtc thp1 thp2 thp3 ths tisd tjou tlrw tm10 tm11 tm12 tm13 tm14 tmbs tmd1 tmma tmor tnph troe trtr tsb tshm tsom tsp tths twwk tzen unh v09 v10 v11 v12 v13 vma wc03 wc04 wmc wwk zen".split(
    " "
  )
);
function O(t) {
  return g.has(t.toLowerCase());
}
const b = new Set(
  "10e 2ed 3ed 4bb 4ed 5dn 5ed 6ed 7ed 8ed 9ed ala all apc arb arc arn ath atq avr bchr bng bok brb btd c13 ced cei chk chr cm1 cmd cns con csp cst dci dd1 dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl ddm dgm dis dka dkm dpa drb drk dst eve exo f01 f02 f03 f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 fbb fem fnm fut g00 g01 g02 g03 g04 g05 g06 g07 g08 g09 g10 g11 g99 gpt gtc h09 hho hml hop ice inv isd itp j12 j13 j14 jgp jou jp1 jud l12 l13 l14 lea leb leg lgn lrw m10 m11 m12 m13 m14 mbs md1 me1 me2 me3 me4 mgb mir mma mmq mor mpr mrd nem nph o90p oarc oc13 ocm1 ocmd ody ohop olep olgc ons opc2 ovnt p02 p03 p04 p05 p06 p07 p08 p09 p10 p10e p11 p15a p2hg p5dn p8ed p9ed pal00 pal01 pal02 pal03 pal04 pal05 pal06 pal99 pala palp papc parb parl past pavr pbng pbok pc2 pcel pchk pcmd pcmp pcns pcon pcsp pcy pd2 pd3 pdgm pdis pdka pdp10 pdp12 pdp13 pdp14 pdp15 pdrc pdst pdtp pelp peve pexo pfut pgpt pgpx pgru pgtc phel phop phpr phuk pidw pinv pisd pjas pjjt pjou pjse pjud plc plgm plgn plrw pls pm10 pm11 pm12 pm13 pm14 pm15 pmbs pmei pmic pmmq pmoa pmor pmps pmps06 pmps07 pmps08 pmps09 pmps10 pmps11 pmrd pnem pnph pody pons por ppc1 ppcy pplc ppls ppro pptk pr2 prav pred prm proe prtr ps11 ps14 psal pscg psdc psdg pshm psok psom psth psus ptc pths ptk ptmp ptor ptsp puds pulg punh purl pusg pvan pw11 pw12 pwor pwos pwwk pzen rav ren rin roe rqs rtr s00 s99 scg shm sok som sth sum t10e tala tarb tavr tbng tbth tcns tcon td0 td2 tdag tdd1 tdd2 tddc tddd tdde tddf tddg tddh tddi tddj tddk tddl tddm tdgm tdka teve tfth tgtc thp1 thp2 thp3 ths tisd tjou tlrw tm10 tm11 tm12 tm13 tm14 tmbs tmd1 tmma tmor tmp tnph tor troe trtr tsb tshm tsom tsp tths tugl twwk tzen uds ugl ulg unh usg v09 v10 v11 v12 v13 vis vma wc00 wc01 wc02 wc03 wc04 wc97 wc98 wc99 wmc wth wwk zen ".trim().split(/\s+/)
);
function T(t) {
  return t.frameStyle === "retro" || t.frameAssetFamily === "eighth" || t.frameTreatment === "colorshifted" || t.frameTemplate === "future" || t.frameTemplate === "flip" || /^(?:split-old|split-eighth|flip|leveler)/.test(t.layout ?? "") ? !1 : t.frameAssetFamily === "m15-accurate" || u(t.setCode ?? "");
}
function u(t) {
  return !b.has(t.toLowerCase());
}
export {
  S as a,
  T as b,
  O as e,
  k as h,
  v as l,
  u as m,
  f as p,
  w as r,
  y as s,
  j as t
};
