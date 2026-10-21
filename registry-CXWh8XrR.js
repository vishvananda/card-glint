const m = [
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
], f = ["2ed", "4ed", "chr", "fem"], b = {
  PLANAR_COLORS: "plc",
  PLANAR_TEXTURE: "plc"
}, n = /* @__PURE__ */ new Set(), d = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map(), p = new Set(m);
function i(e, r) {
  const t = b[e] ?? r?.split(/[/-]/)[0]?.toLowerCase();
  if (t && p.has(t) && !n.has(t + "/calibration"))
    throw Error(
      `Magic set ${t} is not prepared. Await loadMagicSet('${t}') or prepareMagicCards(cards) before synchronous layout queries.`
    );
}
function l(e) {
  if (!(!e || typeof e != "object" || Object.isFrozen(e))) {
    for (const r of Object.values(e)) l(r);
    Object.freeze(e);
  }
}
function u(e) {
  const r = e.set + "/" + e.kind;
  if (!n.has(r)) {
    for (const [t, o] of Object.entries(e.tables))
      for (const c of Object.keys(o))
        if (Object.hasOwn(s.get(t) ?? {}, c))
          throw Error(`Duplicate calibration value: ${t}/${c}`);
    l(e);
    for (const [t, o] of Object.entries(e.tables)) {
      const c = s.get(t) ?? /* @__PURE__ */ Object.create(null);
      Object.assign(c, o), s.set(t, c);
    }
    d.set(r, e), n.add(r);
  }
}
const h = (e, r = "calibration") => n.has(e + "/" + r), g = () => [...n].filter((e) => e.endsWith("/calibration")).map((e) => e.split("/")[0]).sort();
function w(e) {
  return a.has(e) || a.set(
    e,
    new Proxy(/* @__PURE__ */ Object.create(null), {
      get: (r, t) => {
        if (typeof t == "string")
          return i(e, t), s.get(e)?.[t];
      },
      has: (r, t) => typeof t == "string" && Object.hasOwn(s.get(e) ?? {}, t),
      ownKeys: () => (i(e), Object.keys(s.get(e) ?? {})),
      getOwnPropertyDescriptor: (r, t) => typeof t == "string" && Object.hasOwn(s.get(e) ?? {}, t) ? {
        value: s.get(e)[t],
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
  ), a.get(e);
}
function j(e, r) {
  const t = ["printingCorrections", "artistCredits"].includes(r) ? "wording" : "calibration", o = d.get(e + "/" + t);
  if (!o) throw Error(`Magic set ${e} is not prepared`);
  return o.tables[r] ?? {};
}
export {
  h,
  g as l,
  f as p,
  u as r,
  j as s,
  w as t
};
