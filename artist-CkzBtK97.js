import { t as j } from "./modern-style-scope-Bcwfz7jU.js";
const h = "de95b0018cfc22917fc443a21fed7562729a9af62e3a239509346d767a530ad6", b = "df2763491ff39a1a321b1655b9d75d1c71e50937f82ce7079ca863167261cc3a", w = [
  "games/magic/fixtures/accuracy/2ed/annotations-artist-credit.json",
  "games/magic/fixtures/accuracy/2ed/annotations-artist-final.json",
  "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
  "games/magic/fixtures/accuracy/2ed/annotations-empty-rules.json",
  "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
  "games/magic/fixtures/accuracy/2ed/annotations-type-audit.json",
  "games/magic/fixtures/accuracy/2ed/annotations-zz-inline-flavor.json",
  "games/magic/fixtures/accuracy/2ed/annotations.json",
  "games/magic/fixtures/accuracy/30a/annotations.json",
  "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
  "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
  "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
  "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
  "games/magic/fixtures/accuracy/3ed/annotations-zz-inline-flavor.json",
  "games/magic/fixtures/accuracy/3ed/annotations.json",
  "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
  "games/magic/fixtures/accuracy/4ed/annotations-original-body.json",
  "games/magic/fixtures/accuracy/4ed/annotations-original-cost.json",
  "games/magic/fixtures/accuracy/4ed/annotations-printed-artists.json",
  "games/magic/fixtures/accuracy/4ed/annotations-printed-types.json",
  "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
  "games/magic/fixtures/accuracy/4ed/annotations.json",
  "games/magic/fixtures/accuracy/5ed/annotations.json",
  "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
  "games/magic/fixtures/accuracy/adventure-printing-corrections.json",
  "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
  "games/magic/fixtures/accuracy/arn/annotations-text-outliers.json",
  "games/magic/fixtures/accuracy/atq/annotations-missing-rules.json",
  "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
  "games/magic/fixtures/accuracy/atq/annotations-stats.json",
  "games/magic/fixtures/accuracy/atq/annotations-text-outliers.json",
  "games/magic/fixtures/accuracy/ced/annotations-zz-inline-flavor.json",
  "games/magic/fixtures/accuracy/ced/annotations.json",
  "games/magic/fixtures/accuracy/cei/annotations-zz-inline-flavor.json",
  "games/magic/fixtures/accuracy/cei/annotations.json",
  "games/magic/fixtures/accuracy/chr/annotations-original-body.json",
  "games/magic/fixtures/accuracy/chr/annotations-printed-types.json",
  "games/magic/fixtures/accuracy/drk/annotations-missing-rules.json",
  "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
  "games/magic/fixtures/accuracy/drk/annotations-text-outliers.json",
  "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
  "games/magic/fixtures/accuracy/early-reprints/annotations-footer.json",
  "games/magic/fixtures/accuracy/fem/annotations-original-body.json",
  "games/magic/fixtures/accuracy/fem/annotations-printed-artists.json",
  "games/magic/fixtures/accuracy/fem/annotations-printed-types.json",
  "games/magic/fixtures/accuracy/future-printing-corrections.json",
  "games/magic/fixtures/accuracy/historic-mana-order.json",
  "games/magic/fixtures/accuracy/lea/annotations-artist-credit.json",
  "games/magic/fixtures/accuracy/lea/annotations-colored-types.json",
  "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
  "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
  "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
  "games/magic/fixtures/accuracy/lea/annotations-original-cost.json",
  "games/magic/fixtures/accuracy/lea/annotations-text-outliers.json",
  "games/magic/fixtures/accuracy/lea/annotations-zz-inline-flavor.json",
  "games/magic/fixtures/accuracy/lea/annotations-zz-literal-mana.json",
  "games/magic/fixtures/accuracy/lea/annotations.json",
  "games/magic/fixtures/accuracy/leb/annotations-artist-credit.json",
  "games/magic/fixtures/accuracy/leb/annotations-colored-types.json",
  "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
  "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
  "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
  "games/magic/fixtures/accuracy/leb/annotations-text-outliers.json",
  "games/magic/fixtures/accuracy/leb/annotations-zz-inline-flavor.json",
  "games/magic/fixtures/accuracy/leb/annotations.json",
  "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
  "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
  "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
  "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
  "games/magic/fixtures/accuracy/m15/annotations-walker-text.json",
  "games/magic/fixtures/accuracy/m20/annotations.json",
  "games/magic/fixtures/accuracy/m21/annotations-artist-credit.json",
  "games/magic/fixtures/accuracy/m21/annotations-empty-rules.json",
  "games/magic/fixtures/accuracy/m21/annotations-type-line.json",
  "games/magic/fixtures/accuracy/m21/annotations.json",
  "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
  "games/magic/fixtures/accuracy/planar-artist-review.json",
  "games/magic/fixtures/accuracy/planar-printing-corrections.json",
  "games/magic/fixtures/accuracy/prepare-printing-text.json",
  "games/magic/fixtures/accuracy/sum/annotations-zz-inline-flavor.json",
  "games/magic/fixtures/accuracy/sum/annotations.json",
  "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
  "games/magic/fixtures/accuracy/tmp/annotations.json"
];
function p(n) {
  const a = w[n.evidence];
  if (!a) throw Error("Invalid reviewed printing evidence");
  return {
    source: a,
    referenceSha256: n.referenceSha256,
    reason: "Reviewed original printing; detailed notes are retained in the linked source fixture."
  };
}
const z = j("printingCorrections");
function g(n, a) {
  return n.split(`
`).filter(Boolean).map((e) => ({
    role: a,
    runs: a === "rules" ? e.split(/(\([^)]*\))/g).filter(Boolean).map((s) => ({ text: s, italic: s.startsWith("(") })) : e.split("*").map((s, r) => ({ text: s, italic: r % 2 === 0 })).filter((s) => s.text)
  }));
}
function x(n) {
  const { flavorText: a, ...e } = structuredClone(n), s = e.rulesParagraphs ?? [
    ...g(n.rulesText, "rules"),
    ...g(a ?? "", "flavor")
  ];
  return {
    ...e,
    rulesText: s.map((r) => r.runs.map((i) => i.text).join("")).join(`
`),
    rulesParagraphs: s
  };
}
function N(n, a, e = {}) {
  return P(z, n, a, e);
}
function P(n, a, e, s = {}) {
  if (!a.trim()) throw Error("Printing ID must not be empty");
  for (const t of [e.oracle, e.original])
    if (t && (typeof t.typeLine != "string" || typeof t.rulesText != "string"))
      throw Error("Printing wording requires a type line and rules text");
  const r = {
    printingId: a,
    catalogRevision: h,
    status: "unreviewed",
    identity: s.referenceSha256 ? "printing-id-and-scan" : "printing-id",
    corrections: []
  }, i = {
    wordings: {
      oracle: x(e.oracle),
      ...e.original ? { original: x(e.original) } : {}
    },
    provenance: r
  }, m = Object.hasOwn(n, a) ? n[a] : void 0;
  if (!m) return i;
  if (m.some((t) => t.faceName) && !s.faceName)
    return r.status = "face-required", i;
  const f = m.filter((t) => !t.faceName || t.faceName === s.faceName);
  if (!f.length)
    return r.status = "face-not-found", i;
  if (s.referenceSha256 && f.some((t) => t.referenceSha256 !== s.referenceSha256))
    return r.status = "reference-mismatch", i;
  if (!e.original)
    return r.status = "missing-original", i;
  let o = structuredClone(e.original);
  for (const t of f) {
    const d = Object.keys(t.fields), v = Object.fromEntries(d.map((u) => [u, structuredClone(o[u])])), c = structuredClone(t.fields);
    if (t.paragraphScope === "rules-only" && c.rulesParagraphs) {
      const u = o.rulesParagraphs?.filter((l) => l.role === "flavor") ?? g(o.flavorText ?? "", "flavor");
      c.rulesParagraphs = [...c.rulesParagraphs, ...u];
    }
    if (!c.rulesParagraphs && o.rulesParagraphs && (c.rulesText !== void 0 || c.flavorText !== void 0)) {
      const u = c.rulesText === void 0 ? o.rulesParagraphs.filter((y) => y.role !== "flavor") : g(c.rulesText, "rules"), l = c.flavorText === void 0 ? o.rulesParagraphs.filter((y) => y.role === "flavor") : g(c.flavorText, "flavor");
      o.rulesParagraphs = [...u, ...l];
    }
    o = { ...o, ...c }, r.corrections.push({
      ...t.faceName ? { faceName: t.faceName } : {},
      ...t.paragraphScope ? { paragraphScope: t.paragraphScope } : {},
      ...p(t),
      fields: d,
      before: v,
      after: c
    });
  }
  return i.wordings.original = x(o), r.status = "applied", i;
}
const S = j("artistCredits");
function k(n, a, e = {}) {
  return C(S, n, a, e);
}
function C(n, a, e, s = {}) {
  if (!a.trim()) throw Error("Printing ID must not be empty");
  const r = {
    printingId: a,
    catalogRevision: b,
    status: "unreviewed",
    identity: s.referenceSha256 ? "printing-id-and-scan" : "printing-id",
    corrections: []
  }, i = Object.hasOwn(n, a) ? n[a] : void 0;
  return i ? s.referenceSha256 && s.referenceSha256 !== i.referenceSha256 ? (r.status = "reference-mismatch", { artist: e, provenance: r }) : (r.status = "applied", r.corrections.push({ artist: i.artist, ...p(i), before: e }), { artist: i.artist, provenance: r }) : { artist: e, provenance: r };
}
export {
  P as a,
  k as b,
  N as c,
  C as r
};
