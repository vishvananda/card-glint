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
], b = ["2ed", "4ed", "chr", "fem"], i = {
  PLANAR_COLORS: "plc",
  PLANAR_TEXTURE: "plc"
}, o = /* @__PURE__ */ new Set(), m = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), c = /* @__PURE__ */ new Map(), g = new Set(l);
function a(t, p) {
  const e = i[t] ?? p?.split(/[/-]/)[0]?.toLowerCase();
  if (e && g.has(e) && !o.has(e + "/calibration"))
    throw Error(
      `Magic set ${e} is not prepared. Await loadMagicSet('${e}') or prepareMagicCards(cards) before synchronous layout queries.`
    );
}
function n(t) {
  if (!(!t || typeof t != "object" || Object.isFrozen(t))) {
    for (const p of Object.values(t)) n(p);
    Object.freeze(t);
  }
}
function u(t) {
  const p = t.set + "/" + t.kind;
  if (!o.has(p)) {
    for (const [e, r] of Object.entries(t.tables))
      for (const d of Object.keys(r))
        if (Object.hasOwn(s.get(e) ?? {}, d))
          throw Error(`Duplicate calibration value: ${e}/${d}`);
    n(t);
    for (const [e, r] of Object.entries(t.tables)) {
      const d = s.get(e) ?? /* @__PURE__ */ Object.create(null);
      Object.assign(d, r), s.set(e, d);
    }
    m.set(p, t), o.add(p);
  }
}
const w = (t, p = "calibration") => o.has(t + "/" + p), j = () => [...o].filter((t) => t.endsWith("/calibration")).map((t) => t.split("/")[0]).sort();
function k(t) {
  return c.has(t) || c.set(
    t,
    new Proxy(/* @__PURE__ */ Object.create(null), {
      get: (p, e) => {
        if (typeof e == "string")
          return a(t, e), s.get(t)?.[e];
      },
      has: (p, e) => typeof e == "string" && Object.hasOwn(s.get(t) ?? {}, e),
      ownKeys: () => (a(t), Object.keys(s.get(t) ?? {})),
      getOwnPropertyDescriptor: (p, e) => typeof e == "string" && Object.hasOwn(s.get(t) ?? {}, e) ? {
        value: s.get(t)[e],
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
  ), c.get(t);
}
function v(t, p) {
  const e = ["printingCorrections", "artistCredits"].includes(p) ? "wording" : "calibration", r = m.get(t + "/" + e);
  if (!r) throw Error(`Magic set ${t} is not prepared`);
  return r.tables[p] ?? {};
}
const h = new Set(
  "10e 2ed 3ed 4bb 4ed 5dn 5ed 6ed 7ed 8ed 9ed ala all apc arb arc arn ath atq avr bchr bng bok brb btd c13 ced cei chk chr cm1 cmd cns con csp cst dci dd1 dd2 ddc ddd dde ddf ddg ddh ddi ddj ddk ddl ddm dgm dis dka dkm dpa drb drk dst eve exo f01 f02 f03 f04 f05 f06 f07 f08 f09 f10 f11 f12 f13 f14 fbb fem fnm fut g00 g01 g02 g03 g04 g05 g06 g07 g08 g09 g10 g11 g99 gpt gtc h09 hho hml hop ice inv isd itp j12 j13 j14 jgp jou jp1 jud l12 l13 l14 lea leb leg lgn lrw m10 m11 m12 m13 m14 mbs md1 me1 me2 me3 me4 mgb mir mma mmq mor mpr mrd nem nph o90p oarc oc13 ocm1 ocmd ody ohop olep olgc ons opc2 ovnt p02 p03 p04 p05 p06 p07 p08 p09 p10 p10e p11 p15a p2hg p5dn p8ed p9ed pal00 pal01 pal02 pal03 pal04 pal05 pal06 pal99 pala palp papc parb parl past pavr pbng pbok pc2 pcel pchk pcmd pcmp pcns pcon pcsp pcy pd2 pd3 pdgm pdis pdka pdp10 pdp12 pdp13 pdp14 pdp15 pdrc pdst pdtp pelp peve pexo pfut pgpt pgpx pgru pgtc phel phop phpr phuk pidw pinv pisd pjas pjjt pjou pjse pjud plc plgm plgn plrw pls pm10 pm11 pm12 pm13 pm14 pm15 pmbs pmei pmic pmmq pmoa pmor pmps pmps06 pmps07 pmps08 pmps09 pmps10 pmps11 pmrd pnem pnph pody pons por ppc1 ppcy pplc ppls ppro pptk pr2 prav pred prm proe prtr ps11 ps14 psal pscg psdc psdg pshm psok psom psth psus ptc pths ptk ptmp ptor ptsp puds pulg punh purl pusg pvan pw11 pw12 pwor pwos pwwk pzen rav ren rin roe rqs rtr s00 s99 scg shm sok som sth sum t10e tala tarb tavr tbng tbth tcns tcon td0 td2 tdag tdd1 tdd2 tddc tddd tdde tddf tddg tddh tddi tddj tddk tddl tddm tdgm tdka teve tfth tgtc thp1 thp2 thp3 ths tisd tjou tlrw tm10 tm11 tm12 tm13 tm14 tmbs tmd1 tmma tmor tmp tnph tor troe trtr tsb tshm tsom tsp tths tugl twwk tzen uds ugl ulg unh usg v09 v10 v11 v12 v13 vis vma wc00 wc01 wc02 wc03 wc04 wc97 wc98 wc99 wmc wth wwk zen ".trim().split(/\s+/)
);
function y(t) {
  return t.frameStyle === "retro" || t.frameAssetFamily === "eighth" || t.frameTreatment === "colorshifted" || t.frameTemplate === "future" || t.frameTemplate === "flip" || /^(?:split-old|split-eighth|flip|leveler)/.test(t.layout ?? "") ? !1 : t.frameAssetFamily === "m15-accurate" || f(t.setCode ?? "");
}
function f(t) {
  return !h.has(t.toLowerCase());
}
export {
  y as a,
  w as h,
  j as l,
  f as m,
  b as p,
  u as r,
  v as s,
  k as t
};
