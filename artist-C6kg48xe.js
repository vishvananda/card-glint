import { t as p } from "./registry-Cg8tIhk4.js";
const v = "9381076e26057ff04b3d053c5561d9e8b98540ef2dfe2bb0cf31ee2d2f17ddb0", b = "aafc5599d700f388242ffafd8dbd2e01e0a34228324f6e3ea55033f0877dba5b", w = [
  "games/magic/fixtures/accuracy/2ed/annotations-artist-credit.json",
  "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
  "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
  "games/magic/fixtures/accuracy/2ed/annotations.json",
  "games/magic/fixtures/accuracy/30a/annotations.json",
  "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
  "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
  "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
  "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
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
  "games/magic/fixtures/accuracy/ced/annotations.json",
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
  "games/magic/fixtures/accuracy/lea/annotations.json",
  "games/magic/fixtures/accuracy/leb/annotations-artist-credit.json",
  "games/magic/fixtures/accuracy/leb/annotations-colored-types.json",
  "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
  "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
  "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
  "games/magic/fixtures/accuracy/leb/annotations-text-outliers.json",
  "games/magic/fixtures/accuracy/leb/annotations.json",
  "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
  "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
  "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
  "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
  "games/magic/fixtures/accuracy/m15/annotations-walker-text.json",
  "games/magic/fixtures/accuracy/m20/annotations.json",
  "games/magic/fixtures/accuracy/m21/annotations-empty-rules.json",
  "games/magic/fixtures/accuracy/m21/annotations.json",
  "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
  "games/magic/fixtures/accuracy/planar-artist-review.json",
  "games/magic/fixtures/accuracy/planar-printing-corrections.json",
  "games/magic/fixtures/accuracy/prepare-printing-text.json",
  "games/magic/fixtures/accuracy/sum/annotations.json",
  "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
  "games/magic/fixtures/accuracy/tmp/annotations.json"
];
function j(n) {
  const a = w[n.evidence];
  if (!a) throw Error("Invalid reviewed printing evidence");
  return {
    source: a,
    referenceSha256: n.referenceSha256,
    reason: "Reviewed original printing; detailed notes are retained in the linked source fixture."
  };
}
const P = p("printingCorrections");
function g(n, a) {
  return n.split(`
`).filter(Boolean).map((e) => ({
    role: a,
    runs: a === "rules" ? e.split(/(\([^)]*\))/g).filter(Boolean).map((r) => ({ text: r, italic: r.startsWith("(") })) : e.split("*").map((r, t) => ({ text: r, italic: t % 2 === 0 })).filter((r) => r.text)
  }));
}
function d(n) {
  const { flavorText: a, ...e } = structuredClone(n), r = e.rulesParagraphs ?? [
    ...g(n.rulesText, "rules"),
    ...g(a ?? "", "flavor")
  ];
  return {
    ...e,
    rulesText: r.map((t) => t.runs.map((i) => i.text).join("")).join(`
`),
    rulesParagraphs: r
  };
}
function k(n, a, e = {}) {
  return S(P, n, a, e);
}
function S(n, a, e, r = {}) {
  if (!a.trim()) throw Error("Printing ID must not be empty");
  for (const s of [e.oracle, e.original])
    if (s && (typeof s.typeLine != "string" || typeof s.rulesText != "string"))
      throw Error("Printing wording requires a type line and rules text");
  const t = {
    printingId: a,
    catalogRevision: v,
    status: "unreviewed",
    identity: r.referenceSha256 ? "printing-id-and-scan" : "printing-id",
    corrections: []
  }, i = {
    wordings: {
      oracle: d(e.oracle),
      ...e.original ? { original: d(e.original) } : {}
    },
    provenance: t
  }, m = Object.hasOwn(n, a) ? n[a] : void 0;
  if (!m) return i;
  if (m.some((s) => s.faceName) && !r.faceName)
    return t.status = "face-required", i;
  const f = m.filter((s) => !s.faceName || s.faceName === r.faceName);
  if (!f.length)
    return t.status = "face-not-found", i;
  if (r.referenceSha256 && f.some((s) => s.referenceSha256 !== r.referenceSha256))
    return t.status = "reference-mismatch", i;
  if (!e.original)
    return t.status = "missing-original", i;
  let o = structuredClone(e.original);
  for (const s of f) {
    const x = Object.keys(s.fields), h = Object.fromEntries(x.map((u) => [u, structuredClone(o[u])])), c = structuredClone(s.fields);
    if (s.paragraphScope === "rules-only" && c.rulesParagraphs) {
      const u = o.rulesParagraphs?.filter((l) => l.role === "flavor") ?? g(o.flavorText ?? "", "flavor");
      c.rulesParagraphs = [...c.rulesParagraphs, ...u];
    }
    if (!c.rulesParagraphs && o.rulesParagraphs && (c.rulesText !== void 0 || c.flavorText !== void 0)) {
      const u = c.rulesText === void 0 ? o.rulesParagraphs.filter((y) => y.role !== "flavor") : g(c.rulesText, "rules"), l = c.flavorText === void 0 ? o.rulesParagraphs.filter((y) => y.role === "flavor") : g(c.flavorText, "flavor");
      o.rulesParagraphs = [...u, ...l];
    }
    o = { ...o, ...c }, t.corrections.push({
      ...s.faceName ? { faceName: s.faceName } : {},
      ...s.paragraphScope ? { paragraphScope: s.paragraphScope } : {},
      ...j(s),
      fields: x,
      before: h,
      after: c
    });
  }
  return i.wordings.original = d(o), t.status = "applied", i;
}
const C = p("artistCredits");
function q(n, a, e = {}) {
  return T(C, n, a, e);
}
function T(n, a, e, r = {}) {
  if (!a.trim()) throw Error("Printing ID must not be empty");
  const t = {
    printingId: a,
    catalogRevision: b,
    status: "unreviewed",
    identity: r.referenceSha256 ? "printing-id-and-scan" : "printing-id",
    corrections: []
  }, i = Object.hasOwn(n, a) ? n[a] : void 0;
  return i ? r.referenceSha256 && r.referenceSha256 !== i.referenceSha256 ? (t.status = "reference-mismatch", { artist: e, provenance: t }) : (t.status = "applied", t.corrections.push({ artist: i.artist, ...j(i), before: e }), { artist: i.artist, provenance: t }) : { artist: e, provenance: t };
}
export {
  S as a,
  q as b,
  k as c,
  T as r
};
