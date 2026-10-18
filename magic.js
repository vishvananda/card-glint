import { P as m, h as R, m as N, i as P, a as C, b as A, n as M, c as W, f as L, S as b, d as h, s as B, e as E, g as S, v, p as x, j as I, k as D, l as T, o as J, q as G, r as q, t as F, u as U, w as z, x as H, y as Y } from "./mtgjson-card-r2T__XfS.js";
import { F as ie, z as se, A as ce, B as oe, C as de, D as le, E as fe, G as ue, H as ye, I as be, J as ge, K as pe, L as he, M as me, N as Se, O as ve, Q as xe, R as we, T as Te, U as ke, V as Le, W as je, X as Oe, Y as Pe, Z as Ge, _ as Re, $ as Ne, a0 as Ce, a1 as Ae, a2 as Me, a3 as We, a4 as Be, a5 as Ee } from "./mtgjson-card-r2T__XfS.js";
const K = {
  key: JSON.stringify(["magic-oval-interior-v1", m, 2, 1]),
  size: [134, 67],
  async paint(n, i) {
    const r = await n.images([{ url: m }], i);
    try {
      i.throwIfAborted();
      const a = r.value.get(m);
      if (!a) throw Error("Authenticity stamp mask is unavailable.");
      const t = document.createElement("canvas");
      t.width = 134, t.height = 67;
      const l = t.getContext("2d");
      if (!l) throw Error("Authenticity stamp mask needs Canvas2D.");
      return l.drawImage(a, 2, 1, 130, 65), t;
    } finally {
      r.release();
    }
  }
};
function V(n) {
  if (n.securityStampEffect === "static" || n.frameTemplate || !R(n))
    return;
  const i = N(n);
  let r, a;
  if (P(n) || C(n))
    r = h.saga, a = b.saga;
  else if (A(n))
    r = h.aftermath, a = b.saga;
  else if (M(n) === "m15")
    r = h.split, a = b.plain;
  else if (!W(n) && !n.frameAssetFamily && L(n) === "saga")
    r = h.saga, a = b.saga;
  else if (i)
    r = i.rect, a = L(n).startsWith("planeswalker") ? b.planeswalker : b.ordinary;
  else return;
  const [t, l, f, c] = r, [s, e, d, o] = a.interior, [u, y] = a.size;
  return {
    mask: K,
    rect: [
      (t + s / u * f) / 488,
      (l + e / y * c) / 680,
      d / u * f / 488,
      o / y * c / 680
    ],
    strength: 0.8,
    // The same foil stock has the same pattern across printings. Placement and
    // material do not create unnecessary per-card uniforms/batch breaks.
    seed: 1914
  };
}
const X = "9425ad62908d06ecec845eb53afcee569c297f1a0a62bc3ee347aa40f1e9e478", j = {
  "0014def3-4063-4929-ac51-76aef1bb2a68": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "27af9eb93c2e3cd3c6112aa3934772f8b7386614c06b1a4a2bc6a1939cb25dd8",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "005a993c-5111-4364-9fba-75b3d94a8296": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "d7300afc83d0f48efda9ff7e5b563bd2c2e304000bee6c0624004877e3ac4953",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "00775f44-fbe6-41ee-9977-d13d1fb5b6fb": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "ec38e1b91b22deac98d25763802518d21413b66deb06496f057b76b05b9fb8e6",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "008df307-f010-47bc-8548-65a1c7b1c4b8": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "c067946e3333229411c2ec20897807bb8d4b1735cab3721b01b18b97eb469a85",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Counter target spell. X is the casting cost of the target spell.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Counter target spell. X is the casting cost of the target spell." }]
          }
        ]
      }
    }
  ],
  "00c92601-11b9-4e7c-bc81-882085f3fae6": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "26e1584d56d0ee9904163721f759e70c15f96c04021b6b029967b7ed5707fb01",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "01006833-6007-4c16-9ebb-20d31c60a57a": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "fca543fff2d774bf10ede1c085a9e9e349053d682416d284e629acbb3a7ae49c",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "0254bff2-a3a7-434e-980a-2d30355793fc": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "378b2a7b1839e684a89c2e33898351dbd7cce92f99e527eac84c10e81a5ab468",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "025b3156-975d-4f64-b19c-172cb21266c5": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "9a3f4ac29f1e8be975612788930c9c22ffc9675e1c540baa76b12578291280a3",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Ape",
        rulesText: "",
        flavorText: "It does not wear a crown or sit on a throne of gold, but those who have witnessed its power hail it nonetheless."
      }
    }
  ],
  "02eee156-54bd-46fc-8804-a73aab87f0ba": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "9ee1585463942bdf3b04de665d332914fccdc2eac571d90ebe6f07a27af2bea0",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "0324641d-af55-4c53-b4dc-c8262e967da5": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "de57bffc67ad9d1387fc824f87d3bceca5a99e7fe34f82af7e5fb908d3195921",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "0341da27-3d77-4959-b7fa-5929b2cc7141": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "5c58fa4622e1c6dc3546c42adae8d43ee53d5dad30f4d5a7b79aedb0febebfb9",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "034b047d-6363-45ca-9948-8184f822a2cb": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "fa6a7d220be8255a5eba2c1e75d36f1802eadf79d205718a827d7d60beb847e5",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "0370330d-83d9-44d2-a1ed-c4827edc60fd": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "d055da9711099fb52000cc30c3738c188bf6cf3708a1f54b789c038772f9831a",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Gypsies" }
    }
  ],
  "03bd3d4b-d01a-475d-bf3b-cf96f43bc9ef": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "90755edb62c83ad8b55399da071b19feffbfa5f8455996e5118ca0f19b4a6b51",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "90755edb62c83ad8b55399da071b19feffbfa5f8455996e5118ca0f19b4a6b51",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["U", "U", "W", "W"] }
    }
  ],
  "03e664cd-c3a6-4263-b2d8-dd99058fb8ec": [
    {
      faceName: "Scathing Shadelock",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "b6dd3b83f5c15932c9d49a92f2daf373265cfe2cfb0ba171874a6daf3c315dc2",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "At the beginning of your first main phase, this creature becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Snake Warlock"
      }
    },
    {
      faceName: "Venomous Words",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "b6dd3b83f5c15932c9d49a92f2daf373265cfe2cfb0ba171874a6daf3c315dc2",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Target creature you control gets +2/+0 and gains deathtouch until end of turn.",
        typeLine: "Sorcery"
      }
    }
  ],
  "03fd1dae-ccad-4f05-b720-b4b8600a298b": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "639fd7ddb51d092592827d8551fc60ca4616a726db637584ad042e085918f79c",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Zombie",
        rulesText: "",
        flavorText: `"They groaned, they stirred, they all uprose,
Nor spake, nor moved their eyes;
It had been strange, even in a dream,
To have seen those dead men rise."
—Samuel Taylor Coleridge,
"The Rime of the Ancient Mariner"`
      }
    }
  ],
  "0418672d-056e-416d-91b4-8ee6e47201dc": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "b1cc09a2e9f971960df739b922ea67f88e3752b872e4275d15323120e28fc983",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "0458b733-d689-4cb5-8970-3b675c67fc4d": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "0a2ff67d2c5a10af4f9da1b7b7fd23900f089a25841c0afd6c5107ea0231aedb",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Djinn" }
    }
  ],
  "048f2368-0e2f-4197-b977-353d38b38ccc": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "5c2b9a0a4143c80af348a8ec029d5914456fc2cee82812b5284588205a2b7ec5",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Flying, phasing
When Teferi’s Imp phases out, choose and discard a card.
When Teferi’s Imp phases in, draw a card.`,
        flavorText: "Made you look.",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying, phasing", italic: !1 }] },
          {
            role: "rules",
            runs: [
              { text: "When Teferi’s Imp phases out, choose and discard a card.", italic: !1 }
            ]
          },
          {
            role: "rules",
            runs: [{ text: "When Teferi’s Imp phases in, draw a card.", italic: !1 }]
          },
          { role: "flavor", runs: [{ text: "Made you look.", italic: !0 }] }
        ]
      }
    }
  ],
  "04bbd231-0d5f-4cbf-92a7-10d2c5c4b82c": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "9dd15bf42a93454353879a2f8ab43ec32fe2ab26fd28a9868f678480116d8a49",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Demon" }
    }
  ],
  "04bc57aa-d4d9-4bd9-ba09-984370c7e23b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "08bb2c31bddfd41b55bc2803c900c26f21a9e25373fc8c70a4c7cd433dc1e3f6",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "05362cde-3b0b-4a8d-9875-675cfac52e4a": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "abb75825c7aef03a9b4be9b059b28290c0796108bb40614e7b0a38f384c0bcfd",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "U", "U", "B", "B", "R", "R"] }
    }
  ],
  "053b59b4-a22c-4228-aadc-ae9da6bb465e": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations-empty-rules.json",
      referenceSha256: "9a2d984d4dfb117c745b41d7c494a48a11e9323a7932a5e299846df0ad31df91",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Zombie",
        rulesText: "",
        flavorText: `"Feeding a normal army is a problem of logistics. With zombies, it is an asset. Feeding is why they fight. Feeding is why they are feared."
—Jadar, ghoulcaller of Nephalia`
      }
    }
  ],
  "06673800-22a7-4ee3-92fa-7c7cd4865d30": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "d36a3e13613f3a454472eff7a8702524a7bba41859d78bb17fa0fe4b2a2caf66",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Berserker", name: "rathi Berserker" }
    }
  ],
  "067c44e9-1b23-42fd-9acb-daafb62c32a2": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "0ca0ec2b264750e283384fcee299aa64af27521092c44f8df78216f640c24e32",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "06900a71-34ca-48c6-94ac-fca744356829": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "91300d30947522ada4f5adc512da7429d6463cf01e7546da6e32e3f40777f296",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "069b4d6c-7542-4a42-8822-031f02131033": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "252f9a58b5f45296aef5391942637764d699020f712888b100c518ec8ebd348f",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "075e48f1-3c95-42c4-b90d-55dc6738435d": [
    {
      source: "games/magic/fixtures/accuracy/ced/annotations.json",
      referenceSha256: "97c549b87d587308b213c5d5211e66d3e647f14a54cd427a81d202f9521cdc8f",
      reason: "Scan confirms a separate attribution line. Both source feeds omit it. Partial review; original rules wording is not certified. Upstream correction: https://github.com/mtgjson/mtgjson/pull/1748",
      fields: {
        typeLine: "Summon Paladin",
        flavorText: `"Look to the north; there you will find aid and comfort."
—The Book of Tal`
      }
    }
  ],
  "07793a71-1106-4303-b620-e403bd378020": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "e4f011357a87af8dfc3330e4837a90d5337c785ce9eb62691af4bc84cf608f68",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "07892b6c-08d2-47b5-8d64-0e4d1bdc3080": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "e9e7d9efabbbf21390ffd03e2b90b3f043b7da9cd15420c57c897f8e6ab5641b",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "07a17b74-a9c9-419a-8369-9ab4fec213f2": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "334dc52724e6c4d3d0fde2f77da11121d6665e326aac564492c706185a735d4f",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    }
  ],
  "07d8e501-6857-4a52-a3b9-2bf0bee5b08c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "978cae84adeb21febb950f15131fe7577a4dcd030d94f3f904560ce2fb5752e8",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "978cae84adeb21febb950f15131fe7577a4dcd030d94f3f904560ce2fb5752e8",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "U", "U", "W"] }
    }
  ],
  "07eb2476-488b-4610-8567-f0456601f7fd": [
    {
      source: "games/magic/fixtures/accuracy/m15/annotations-walker-text.json",
      referenceSha256: "6f2ce6cd0123909bd850093703e061eba8600c6cfe46b563411a47e3cc44911a",
      reason: "Type line visually checked against the cached M15 scan. MTGJSON originalType contains the later Legendary erratum; only this field is certified.",
      fields: { typeLine: "Planeswalker — Nissa" }
    }
  ],
  "07edbbf4-c3d6-4ec1-ae9b-4ae202fb6998": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "9e8f5736e7fac626deb26e33b8f89ff52acdbe595b0cc82cde9c783feb25b648",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "0848d94a-2704-460f-986b-b192dd6d26b7": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "45c74722efc34851d6b2201d20c9cbec12308eb88cbf57476fe924bd6298a930",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Dwarves" }
    }
  ],
  "0855a5a8-8c40-4396-9ad1-8fa0fc6a0c59": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "d1adb9d6ae5064f0b3a3b060f8c552fd5c678b11b9d88d947ece572e62437688",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Devouring Deep" }
    }
  ],
  "0892ec35-8bab-4fe5-8cc9-a25032d4bc8d": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "b47616c25d8841034dd33a7c3edcf48b8d48a269b25776ae4fd7c2e365624597",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "Counters a red spell being cast or destroys a red card in play.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Counters a red spell being cast or destroys a red card in play.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "08ba41ec-4fff-4192-80ff-2afcd706ea59": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "9e9bc12d75ccd2fe2bdaf64fc0b8fa2ca22cc9d8ad824b1c425397a98fec166c",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "09242f08-3bfc-4082-b32f-703c7fed62a0": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "6bc75df1d6a8f85a0014cdd8136710d02d5d14c9a3c0e0d6b2011d1309dac4c6",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Yeti" }
    }
  ],
  "095078b0-0f26-442f-9d3b-45e30cdb33c4": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "7a505f2e01add40cf6da6910c2573410c416d9fc23734c70658ece1fc930b281",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "096f7ac8-c639-4347-9767-7305eaf490ba": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "1315c539aba9b56dfbfc3a742de538e2bfb5fb6e2d1f9170be92de97f4436da5",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Tortoise" }
    }
  ],
  "0987461a-45c0-4956-8627-cd27a7e038d0": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "8513aabea9a766a542985505212adde1a6e5c2f62bd40a299d350ee9136c7dfd",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "09e97dce-6bef-480d-939e-d35cfbf6b989": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations.json",
      referenceSha256: "d5edd17e5314bfa89b062357663285a1c987d12a47db63327cc9eb147f588612",
      reason: "Eight development scans visually inspected before geometry changes. Printed wording transcribed; soft wraps not encoded. Basic metadata stays semantic and has an expected printing target. This review does not certify current body rendering or shared geometry. Holdouts remain untouched.",
      fields: { typeLine: "Summon Paladin" }
    }
  ],
  "0a135e09-b534-4836-9a10-3a9a4a9f8c53": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "adf8375ff76585b5a5b00da7c39fc3f93c0b91490cd56b63415dd1e246b5017e",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Creature cards in graveyards and libraries can’t enter the battlefield.
Players can’t cast spells from graveyards or libraries.`,
        flavorText: `“Best bury them right. We don’t want any gruesome encores.”
—Constable Trosk`,
        typeLine: "Artifact",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Creature cards in graveyards and libraries can’t enter the battlefield.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "Players can’t cast spells from graveyards or libraries.", italic: !1 }
            ]
          },
          {
            role: "flavor",
            runs: [
              { text: "“Best bury them right. We don’t want any gruesome encores.”", italic: !0 }
            ]
          },
          { role: "flavor", runs: [{ text: "—Constable Trosk", italic: !0 }] }
        ]
      }
    }
  ],
  "0a1b4e2e-5459-4fae-81d9-1e882647daac": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "2aec806def7f9cdf24f83d096fe138a7f5aeb6897ca585051cd541fb4aa72933",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "Counters target spell as it is being cast.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Counters target spell as it is being cast.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "0b06bd73-c45a-4560-bd8d-413608c5f89e": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "2bdbe296d6440754762caa6bf52a0d826aeddec83606d3dd13f8d924b06d09fc",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      fields: {
        rulesText: `Flying, haste
Grandeur — Discard another card named Tarox Bladewing: Tarox Bladewing gets +X/+X until end of turn, where X is its power.`
      }
    },
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "2bdbe296d6440754762caa6bf52a0d826aeddec83606d3dd13f8d924b06d09fc",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      paragraphScope: "rules-only",
      fields: {
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying, haste", italic: !1 }] },
          {
            role: "rules",
            runs: [
              { text: "Grandeur", italic: !0 },
              {
                text: " — Discard another card named Tarox Bladewing: Tarox Bladewing gets +X/+X until end of turn, where X is its power.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "0b64dd0f-2e99-41bd-87aa-f623582d64d0": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "fae96895fb715b2dbe4ee090a2c986666e941badba1f5db956797382b966635a",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "0b8aff2c-1f7b-4507-b914-53f8c4706b3d": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "e01880a96745380a52617a512cb8a73cdb4283d221f40ff17f0c58c9de249b52",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: "You may play two additional lands on each of your turns.",
        flavorText: "“I do not miss Jukai Forest. It is not my home. My home is Kamigawa, its people my family. Wherever I set my pack and rest my head, I am home.”",
        typeLine: "Legendary Creature — Human Monk",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "You may play two additional lands on each of your turns.", italic: !1 }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“I do not miss Jukai Forest. It is not my home. My home is Kamigawa, its people my family. Wherever I set my pack and rest my head, I am home.”",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "0ba1daee-a5ac-4d9e-b681-3e3c7a3eb095": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "8cad2b59208e41bc61b02e728ef6a58ba881b04f564a8cbf7e0076e504cc8efd",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "Brass Man does not untap as normal; you must pay {1} during your upkeep phase to untap it.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Brass Man does not untap as normal; you must pay {1} during your upkeep phase to untap it.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "0c58f236-0b2c-4b71-8819-1beaea7ded17": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "3d3944e469e6b2c9b675ac0080304e9829a9f18a8e4206df33cb45ac2e5001bf",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "0c8b1f49-550e-405f-b17c-1d94589494ad": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "18febebdacd859f9bd86a3a32ee5e6c2ea7b5b008e7149769297894ae37e3b85",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Satyr" }
    }
  ],
  "0cd2a4f9-8f80-4ee3-8068-73e686d6eeb9": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "93a2ac42b7dd51efd6f4e015e33250b7b8e712d222901a1ae4d6be06b127daad",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "0d08f5e4-d2d3-4659-86d4-a983d80e3b2c": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "0eca6b818e735397dac6a75e491b839639474433241cca10148581cf64d327de",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "0d48fb47-1bed-4791-a014-504515f3d36f": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "61f6507fb97672c55b75e6bbcb4fcd782e33afb442b61ea9993ca14937a4744e",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "0d77c149-cca2-45c7-bc83-5ba1872ad5e0": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "e068c1ed56a1a075d9778ab2af089ecbf4ec176e78b10e8f0f10248c1c3b36d7",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "0d78f0fc-3ab2-46ee-b5a9-55ae97d08c1a": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "547742494c6cd5339a662a34183c84c0ef1978451c86699411c70ad2e54ff842",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "0d7b3b65-e1f9-4a0d-95a6-42c2c4a358e5": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "11e5795d4902b18fa7dbf50b3f8dbe100da4fef0b5ab2ff77b5de9def44098d4",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Target land becomes any basic land type of your choice.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Target land becomes any basic land type of your choice." }]
          }
        ]
      }
    }
  ],
  "0ddb98e8-13fe-4786-83f7-b72c56db135a": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "aff38143d92048acce775967a202aa8eee344793415b01b5a6880ce44900b4cc",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Giant",
        rulesText: "",
        flavorText: "Fortunately, Hill Giants have large blind spots in which a human can easily hide. Unfortunately, these blind spots are beneath the bottoms of their feet."
      }
    }
  ],
  "0e013033-3995-4ba8-b0c3-0614c79aaaab": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "193994f320fe7973ec6c91ece59770a0de6d2c61582ebf8c7a62ce81d05d6505",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Hexproof
Lotus Field enters the battlefield tapped.
When Lotus Field enters the battlefield, sacrifice two lands.
{T}: Add three mana of any one color.`,
        flavorText: "",
        typeLine: "Land",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Hexproof", italic: !1 }] },
          {
            role: "rules",
            runs: [{ text: "Lotus Field enters the battlefield tapped.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [
              {
                text: "When Lotus Field enters the battlefield, sacrifice two lands.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [{ text: "{T}: Add three mana of any one color.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "0e1ae3d6-6d96-4db6-bbc4-cee91bae6cf7": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "f1292c54f2bcb01bb34a8a25b193c4b82ce4692ba359267f7336ae5f8856cdd3",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "0e7eede2-e682-43b5-b5b7-a61fb8e98082": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "498cfadb5a0c4240c4c21dd01514430dc474e1ec3998a0b39f8451e043afac08",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "0e9ad288-d164-44a6-96ec-4185a1587f1a": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "6852a3a4b3ac3955e332709d26ba26eb9b9a0ce77fc48e20564079e08043356f",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Leper" }
    }
  ],
  "0e9aeaa8-9a75-4719-992f-cbb316f72175": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "a988fe001a3dc6ef136e7a8085567a9fbfd6ae1be37ba98ac6251061153e4f78",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "0ea52228-f8ad-4623-9e05-f162473bfc03": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "5aeebbbbba9e619a89c7799aec33bc32253d458beaed5c059ffb67096f5076f7",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "5aeebbbbba9e619a89c7799aec33bc32253d458beaed5c059ffb67096f5076f7",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "B", "R", "R"] }
    }
  ],
  "0ea81883-7cd6-4443-9733-39d25cc64328": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "fcdb87b2d8d5379cebaea6f5f76ec08d65e2cd63b50156828e2207857de3725e",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "W", "R", "R", "G", "G"] }
    }
  ],
  "0eaf0ac8-f5a7-4689-8d3e-dd865763df44": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "f192e9b10cb2d97c9bc48ae4bbf7dcbfba94f1edcf39af27c5a04903fb8e1d78",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "Buries target creature. Cannot target black creatures or artifact creatures.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Buries target creature. Cannot target black creatures or artifact creatures.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "0ee810a5-f0f9-4b73-8194-3d1344784050": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "072b864404583400a348b3cb4b1a0fdf656334ca3d367a07116600738a702c51",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "0f047f5b-af97-4662-ab06-698a5f6f5a57": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "42c58f34a16b51a13755d3d713865d12e30fe26f39696539b8f530c1df614bb8",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "0f4174e4-0be8-49b5-8c52-22001790f6eb": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "6dc0802a1f7eda9b33bde6ae76262f77cc7ac23216d1afecc924b22d00d1d465",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Angel" }
    }
  ],
  "0f586dd9-bb47-411d-9652-05de4651b146": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "279d78da9d5122c6b01670d7b186c09207abdb71fe81dbafe7ebe6233551711f",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "0f9668ba-d26d-4484-b4b8-6fb91fbfb617": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "c65a72dbcf62df6bfe73b00a8f376780e6c80b4500d1750965cabb2e3df38139",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "0fd7c711-3ff4-4691-914f-242e6737066c": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "23e751a6a2ff50a17aacf7bf148c32f9ce55f05ef59966b203295915d513baf0",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "107646bc-2181-49f4-8821-1eaa46291855": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "389c5a32d06027a7a25f44f6ec4a38c2cb909909751cd7e45be16e9616368e3c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "109cce7a-96f7-4e67-878a-bd5c93ea8643": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "be3a9579b180848188a99dfaeee02594bca7f9902a8519f73549e692412ff09d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Viper" }
    }
  ],
  "111a16a2-e875-4756-80db-290f9e8606db": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "da42350f45652d47ed2ca1f8536caac22741970319b7908500de65aba228deec",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "da42350f45652d47ed2ca1f8536caac22741970319b7908500de65aba228deec",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "{B}: Draw an extra card and lose 2 life. Effects that prevent or redirect damage may not be used to counter this loss of life.",
        flavorText: '"There is no calamity greater than lavish desires./ There is no greater guilt than discontentment./ And there is no greater disaster than greed." —Tao Tê Ching 46',
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{B}: Draw an extra card and lose 2 life. Effects that prevent or redirect damage may not be used to counter this loss of life.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: '"There is no calamity greater than lavish desires./ There is no greater guilt than discontentment./ And there is no greater disaster than greed." —',
                italic: !0
              },
              { text: "Tao Tê Ching 46", italic: !1 }
            ]
          }
        ]
      }
    }
  ],
  "113a6b31-3748-48c1-a915-ab0b613eabb3": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "009b485c1666d492d12022bf7c1b6a85377e8ffa271a42e1c7a57ccfef77effa",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Cavalry" }
    }
  ],
  "113d518a-2ce9-4747-9e6f-c6a464a78a49": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "62abd4e4077acaf4dff0b24913caedba86cad3843bef689b8481eb070c4c7df8",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Summon Dwarves" }
    }
  ],
  "1164f22f-2706-4f35-9f58-d0eb8c344396": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "ad4b01daef09e97014bac9f66e19cd9d34dfe264b561ac0d40d10ab1615d449e",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "11cbdf06-f6b5-4bd8-80bf-6d7e57649684": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "a8b2cc1c358260b851387f460eeceba99773672cdf6796b641ce2581f03bcfa0",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: "Phantom Warrior can’t be blocked.",
        flavorText: `“Only when I saw my enemy walk through all my defenses, untouchable as the moon in the sky, did I truly know what it is to be afraid.”
—King Ixes`,
        typeLine: "Creature — Illusion Warrior",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Phantom Warrior can’t be blocked.", italic: !1 }] },
          {
            role: "flavor",
            runs: [
              {
                text: "“Only when I saw my enemy walk through all my defenses, untouchable as the moon in the sky, did I truly know what it is to be afraid.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—King Ixes", italic: !0 }] }
        ]
      }
    }
  ],
  "11d1f02d-533e-4b77-a72a-ff5f91ae0626": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "9cd0dd93fc7aa6f57542480ed72f55ffba9e96b135fb02c929ff8346b36af09a",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "9cd0dd93fc7aa6f57542480ed72f55ffba9e96b135fb02c929ff8346b36af09a",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "Changes the color of one or more target creatures to blue until end of turn. You choose which and how many creatures are affected. Cost to tap, maintain, or use a special ability of target creature(s) remains entirely unchanged.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Changes the color of one or more target creatures to blue until end of turn. You choose which and how many creatures are affected. Cost to tap, maintain, or use a special ability of target creature(s) remains entirely unchanged.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "11fb92c0-bb1e-463a-a6b6-887a5d0cb873": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "2017fdb5742af637b0fc576f0a7ca148910179c886c25db84fc908cd970cf168",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "123d6097-8021-46cd-a8c3-01013245e347": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "c49a105ae6be5da40c635b5d251417ea0c61d5f342de9473ab28cffdb267959c",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "12671381-beb7-41b8-9484-97f8aca5c981": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "3fed4c9de5836a69a9539619a9d4a0ac7a9a159b49daf40f07eab2aca8077d38",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "126c1b02-01bd-4b70-9293-a89173b4cd32": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "c1a0ef2311fa7d6ddd5367ea84337077d715c50253d673a9defc4b24522514b8",
      reason: "Body and Enchant Creature type reviewed against the cached full scan. No forced soft breaks supplied to painter; inline glyph/disc shape is a separate review.",
      fields: {
        rulesText: "Target creature cannot be blocked except by black creatures and artifact creatures.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Target creature cannot be blocked except by black creatures and artifact creatures."
              }
            ]
          }
        ]
      }
    }
  ],
  "12926dc8-8e6f-4a47-a12b-4d674189615a": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "075b0218363ede3aaa9d9846704a2e1ee293afbb5ac72c0a00455672da676850",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "12ab9836-bc90-4d92-a86d-b8e1b7671aa7": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "30139077a9121b86891790e53273273b1c4d55647e97cbbd6ae53a6e8d3fdddd",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "133204e4-fef8-4851-aa50-c96ffa35b802": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "6fb9a1e7ddb4365d56679e0333745aca0f263475b65cee52ef5d3627ffc2b9f6",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "133aaa10-610b-41be-9327-591f517a4baa": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "4205c6031e91911b2061e1068e24cc9f1081692570ac506a07c8eb9896e3ea18",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "Target creature is now a flying creature.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Target creature is now a flying creature.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "13453abe-3f05-4956-8493-382d7d2af699": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "37dd203ba11cd249e3a1ed1a4d0c61df2bf3335c7a3354dbbcb5757ba1f39420",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "135de5c7-6ac9-4b68-8f1a-97f120a4b125": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "3227046449d96b4849dda073be699b01fa2f77cf85aa864b3c686a29e5cfac0b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "13696657-aeef-4add-9a3b-8137fce01fe3": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "50fa83ab665267ca144aaefada20bd10374715881a0debfbf489e635d71d4ec1",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Kobolds" }
    }
  ],
  "13a68a17-22ee-47c9-870a-83e911862b94": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "2a154547eb2ec87ff99c0516fc4b2a8073615ba3831bf7dcc3fe6f626a862b59",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "1482c390-69cf-484e-a06c-8d63f770c7de": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "728a98772bd206ee1d11f5eb5336412aba414aab6a43b0a3b8f3bd5e70ff05ca",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Put target land on top of owner’s library.",
        flavorText: `“. . . and when the farmer awoke the next morning, all the seeds from his field were once again in their sacks.”
—Afari, Tales`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Put target land on top of owner’s library.", italic: !1 }]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“. . . and when the farmer awoke the next morning, all the seeds from his field were once again in their sacks.”",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              { text: "—Afari, ", italic: !0 },
              { text: "Tales", italic: !1 }
            ],
            align: "right"
          }
        ]
      }
    }
  ],
  "14c45416-a826-42e9-9967-8838158cf16d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "02c30fe281ffc0abf2ca9fec3e4c748be073f424eb35a661b3bb176877d74194",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wretched" }
    }
  ],
  "1506d99d-7b2e-4101-84a5-c950dadb263a": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "893b090a63bfc08a8c11b7571d2ee5d1a159e04ab494e143b0a18ffb8af66b8b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Interrupt" }
    }
  ],
  "151b332e-164b-4646-8f52-741984cd71ad": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "7ae30800823da7799a21e718b04cb786cfeff4655dd6ffcb7be155fc480953e4",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Wizard" }
    }
  ],
  "15511fda-92ae-4d27-8a83-37e821ec3adf": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "564de272e9ab93424041215f91e23e065a1515deb0203dd08afced6d62001429",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Monster",
        rulesText: "",
        flavorText: "After the battle, an eerie silence gripped the forest. The losers' remains were lightly dusted with green."
      }
    }
  ],
  "15ccebe1-ef08-4805-a65f-a1c57abed9f2": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "a5b7e55d3e3ce3798554f947d92ca592e7fec9c4cd5eda807cc9aa25c9738dde",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Wolf" }
    }
  ],
  "1685676c-19be-4220-993f-494c53f60499": [
    {
      source: "games/magic/fixtures/accuracy/planar-printing-corrections.json",
      referenceSha256: "d24ab29dceeec92d81ccb882caf93d5ce685aa9f5f222a349312d7935f0d2c09",
      reason: "Exact scan type line reviewed. MTGJSON originalType contains later creature-type errata; preserve printed subtypes and leave Oracle types unchanged.",
      fields: { typeLine: "Legendary Creature – Cat Warrior Lord" }
    }
  ],
  "168821ce-d77c-4294-a9fd-2a30852801ab": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "d66bbc61173acccf6fb948b3d016c934b934dd0f8bde8486058cd19b544fa43a",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Beast",
        rulesText: "",
        flavorText: "A bored wizard once created a vizzerdrix out of a bunny and a piranha. He never made that mistake again."
      }
    }
  ],
  "170fa026-c17b-4731-b520-455c39ccbe6d": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "e4cc2bb07603473e7f5a2ddbff012f3186920c956b177684bef1e45573a1735e",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Tortoise" }
    }
  ],
  "173157aa-712d-44f2-89ba-dd2511a07f26": [
    {
      faceName: "Sanar, Unfinished Genius",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "8f41ceb71f2e3ef7ecf9ac0170bcff0ecc44dbc8e0e409be2044fe9fd98dc2d5",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Sanar enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)
{T}: Create a Treasure token. Activate only if you've cast an instant or sorcery spell this turn.`,
        typeLine: "Legendary Creature — Goblin Sorcerer"
      }
    },
    {
      faceName: "Wild Idea",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "8f41ceb71f2e3ef7ecf9ac0170bcff0ecc44dbc8e0e409be2044fe9fd98dc2d5",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Search your library for an instant or sorcery card, reveal it, put it into your hand, then shuffle.",
        typeLine: "Sorcery"
      }
    }
  ],
  "17d5c1c7-a882-479a-9077-0784e83b462d": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "94a69888d7a16f337f297aa70713baeb11a0b3b0668a42d4b8a28b46ce47bc4e",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Wurm",
        rulesText: "",
        flavorText: "The most terrifying thing about the Craw Wurm is probably the horrible crashing sound it makes as it speeds through the forest. This noise is so loud it echoes through the trees and seems to come from all directions at once."
      }
    }
  ],
  "17db2b6a-eaa8-4a08-9e86-370bbd058574": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "ef967acbb8dc496f17d94f161972598c0ed5384b5cfd635ca96ae80e57531a9d",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "17eff8d9-86de-4f19-bf00-5f20dc1373d4": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "bbd17757203ad6c560a46beca59282d00ffcd336da5693079fb4ba72aee5cbde",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "17fc3a85-c6b9-4fd2-a6a2-d3210708e5ea": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "f2a4abde4553f552db43f9a3e2e2cc27bc82014c4862cb8661a1123297959946",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "f2a4abde4553f552db43f9a3e2e2cc27bc82014c4862cb8661a1123297959946",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "On your next upkeep after Hazezon is put into play, put * token Sand Warriors into play, where * is the number of lands under your control. Treat the Warriors as 1/1 white, green, and red creatures. If Hazezon leaves play, all Sand Warriors are also removed from game.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "On your next upkeep after Haze­zon is put into play, put * token Sand Warriors into play, where * is the number of lands under your control. Treat the Warriors as 1/1 white, green, and red creatures. If Hazezon leaves play, all Sand War­riors are also removed from game.",
                italic: !1
              }
            ]
          }
        ]
      }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "f2a4abde4553f552db43f9a3e2e2cc27bc82014c4862cb8661a1123297959946",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "W", "G", "R"] }
    }
  ],
  "18348df2-9037-4db4-bddb-76dc933229bf": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "0a9831564d3b05ec6c34e70eb980014f367d04bd9923f639bc42583a9a5269ca",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "184b7d52-e991-4668-9f6a-bcded97f51ac": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "f5ee64587a242635d8edd7964621e7be39930f7b0a20f356bb5006a46b7e2285",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Exorcist" }
    }
  ],
  "18607bf6-ce11-41cb-b001-0c9538406ba0": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "fb9ba1b23f25d8cb8da22d680fb4a7654119b8fae94876d408637f6d43c3b960",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ghoul" }
    }
  ],
  "186fd917-8d65-4de5-8546-a32a5f6d3bab": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "02cca1c6f5058b30e35fe47b7ea6994ef77b491ed12568a964d19d626bb9f908",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "18787a2d-6688-47e9-94bc-ccf229df823f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "5c3172ba0f44d698aa70b68eb8393f16cdd6be09c5df039d34e89f906ee865a4",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "18bc6ac2-19e0-4765-852b-e303a5bb4040": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "df3fe56e8625fd6f36322254dab4f87c1f5f8c1a44bd379f695959e25415fd6b",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Horror" }
    }
  ],
  "18f86e13-f942-423e-b175-930d768cb811": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "9d1f6742b487aba6e6de2ac0d9a8c0521df6a0298428f7a20d7d5471accb7187",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "19499cb7-eccb-4e69-af32-6002d447a160": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "66eb644bfc9a4987437f097cb990083b873b7af6f9707482ae34d9de6d407773",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "19ec03ce-a8a3-42c3-a895-21cce1657411": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "6b00ee4b23bf34c39c9260250b4629a15159c5c739bc1af83a8511966c40be8e",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Earthquake deals X damage to each player and each creature without flying.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Earthquake deals X damage to each player and each creature without flying."
              }
            ]
          }
        ]
      }
    }
  ],
  "1a3068eb-2250-4c7b-8ed5-2366ff6cd0e1": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "aac2598d2c42e16113eb5067abd55c8e915545b6758325f65c4304de3d9f9567",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "{1}, {T}: You may give one creature banding ability until end of turn.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{1}, {T}: You may give one creature banding ability until end of turn.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "1a364362-e42b-415c-9d95-b6ec7139f5e7": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "ccefadf6d5f25df5437e37de50c6c539a41228f69d1fb7deccd0407117676edf",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "1a74fcde-7685-402c-9b2a-245aa75d75c1": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "228d8b5768e632e4c9a5b61c95c661561eb37eadf885783b5889841092655b67",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      fields: {
        rulesText: `Whenever a Forest comes into play, green creatures you control get +1/+1 and gain trample until end of turn.
Grandeur — Discard another card named Baru, Fist of Krosa: Put an X/X green Wurm creature token into play, where X is the number of lands you control.`
      }
    },
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "228d8b5768e632e4c9a5b61c95c661561eb37eadf885783b5889841092655b67",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      paragraphScope: "rules-only",
      fields: {
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Whenever a Forest comes into play, green creatures you control get +1/+1 and gain trample until end of turn.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "Grandeur", italic: !0 },
              {
                text: " — Discard another card named Baru, Fist of Krosa: Put an X/X green Wurm creature token into play, where X is the number of lands you control.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "1a96315d-edc6-4d68-a260-d14f61281dc1": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "fe190f5fc305e992c5b0f3f32047dfa5f4e170fba20373bccba2304e8e74f4c6",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "1aa2d27b-cc25-4baa-86f4-4db45b30e2a4": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "facb22db33d5a49fd5db8b20802643da079e6d87f3baa3ec9effd82dcb182960",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "1ad7692d-5a51-493f-a322-7b615446ea8e": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "63ded7b347903fed5f7d10c535d146a89207894ac00e8490e4881f3f4c48bbc4",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "1b0f41e8-cf27-489b-812a-d566a75cf7f7": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "9eefdfb15eba77808fc816e2c01387db9a1b715d5e424939624b2ac3e9e198b1",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "1b93ce48-219c-49ea-9ad0-b7357bea4606": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "75d6cff8d9e6200af21186efd87fac2c5f7498a939301547c67f6d2c2915cc8f",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "1b9c63eb-8d4e-4d8b-8637-308459ef036b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "c485cdae4eae0b98cc4eb129926a761b7e6761d0d047391338ac057576fcba4b",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Taskmaster" }
    }
  ],
  "1ba61ccd-4429-4f7c-b9f3-30867878d88e": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "363cdf22c7a38e527de0c3f3689373a3de8ff5db8f0351c15715c0ca2aff1744",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "1c3b33bf-3074-406e-86f3-2a9843cf4862": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "75b94bc9db442ad8eed9e7cec8edc8d77521b84a298a3776514292d2554c2d8f",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Gnomes" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "75b94bc9db442ad8eed9e7cec8edc8d77521b84a298a3776514292d2554c2d8f",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "{T}: Target plains produces {1} instead of {W} until end of game. Use counters.",
        flavorText: '"O Great Captain, all is lost. They tunneled, they burrowed, they trenched. They sapped the strength of our defenses." —Sorgus, Chronicles of the Quarum Plains',
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{T}: Target plains produces {1} instead of {W} until end of game. Use counters.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: '"O Great Captain, all is lost. They tunneled, they burrowed, they trenched. They sapped the strength of our defenses."',
                italic: !0
              },
              { text: " ", italic: !0 },
              { text: "—Sorgus, ", italic: !0 },
              { text: "Chronicles of the Quarum Plains", italic: !1 }
            ]
          }
        ]
      }
    }
  ],
  "1c687a4e-a3f9-4d2d-9931-bf60e97f4095": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "8e679ff3b1a98376ca3ef8f70841f444f54b9ee4852e395851b210cafc7d3910",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "All creatures in play are buried.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "All creatures in play are buried.", italic: !1 }] }
        ]
      }
    }
  ],
  "1c829d83-d5b8-4be7-80f7-55b42f52b309": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "276877386cc3f68b39948c792bb5e388010d784259d182d6b7a59d18842013ba",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Interrupt" }
    }
  ],
  "1cb86b2f-116d-4952-b35a-1398341baaf5": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "2ca8222e5ebf67121cea91fe7f78aef3f8decc68c8cd314b9d1b3b55dc76643b",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "1cc1188c-4331-41dc-a577-bd4bedd7ca76": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "4244e768409655c8f0d7afaa11e8aab8493eac5bef24070a3e51dbff9451f23c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Wolf" }
    }
  ],
  "1d9479ae-2b42-4137-9e62-ef4d7fd17d0c": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "39b2289223cc2161372c0728ef94034b98705ab88d3540cb0a244555a302ab05",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Treefolk",
        rulesText: "",
        flavorText: "The mating habits of Treefolk, particularly the stalwart Ironroot Treefolk, are truly absurd. Molasses comes to mind. It's amazing the species can survive at all given such protracted periods of mate selection, conjugation, and gestation."
      }
    }
  ],
  "1dea8c2f-4aea-478d-aee7-cba1f74edd6c": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "3b1ae80a147078d2e5ec673cfb0e819142182fa0b7278b206d44b8cdc0f129f1",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "1e03d335-d259-4ab4-814f-9333cfd3afc9": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "064eae915c1bb1f304a0a476008732e7497ab3e215a59e506efccc3412c205a0",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Preacher" }
    }
  ],
  "1e21c347-7aaf-42ae-abf3-f1283c5b54e6": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "fedb8110adeb6ac8e6394cca914cccbcc99165161e37ac2d5dec9581e5f09bbf",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Rocky Tar Pit comes into play tapped.
{T}, Sacrifice Rocky Tar Pit: Search your library for a swamp or mountain card. Put that land into play. Shuffle your library afterwards.`,
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Rocky Tar Pit comes into play tapped.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [
              {
                text: "{T}, Sacrifice Rocky Tar Pit: Search your library for a swamp or mountain card. Put that land into play. Shuffle your library afterwards.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "1ea01324-1cfb-498c-8299-f690373864bd": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "335dfc4d501620742842a8010c86bf04969f3908d05c88f6f70b0c4cc3985fcf",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["U", "B"] }
    }
  ],
  "1eb2e494-1414-4d1f-91d2-7cb20acdb128": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "18ad0823d6ff71f4af5a00bfef1d3416575221cae19affa8008e3258586dee64",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "1eb3178b-dac5-4b34-9d3e-4f5a170d1c87": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "4befa526d9d88760e9008d3654bfaefe697a01bbe51bed4037020d5683f4e195",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "1ebaafe0-3a9a-424c-8698-d26e7be45343": [
    {
      faceName: "Joined Researchers",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "ebf901eebd40804c0e14900330019b94be78ce0064b8cd6206611cf0235a21aa",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `First strike
At the beginning of each end step, if an opponent has more cards in hand than you, this creature becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Human Cleric Wizard"
      }
    },
    {
      faceName: "Secret Rendezvous",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "ebf901eebd40804c0e14900330019b94be78ce0064b8cd6206611cf0235a21aa",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "You and target opponent each draw three cards.", typeLine: "Sorcery" }
    }
  ],
  "1f35877c-e66c-4ef0-842a-f68cd233ae4b": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "6369d2aab61df277147eded6becabe941042731e9bfdf124a7cb5bbe79baa3fd",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "1f372950-6693-4838-80ef-8fd9aa3e0349": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "f83229e4ecfdf4279524e4e3606a4715241662eeca8d64af104d9775a9c879ef",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "1f400655-f495-4b21-ab9e-57fe4d845d45": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "63389dcd334c46b9284ea222bc94732f27ab8a3d907e68731a6b1558a07ea559",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Flying, vigilance
When Kaalia, Zenith Seeker enters the battlefield, look at the top six cards of your library. You may reveal an Angel card, a Demon card, and/or a Dragon card from among them and put them into your hand. Put the rest on the bottom of your library in a random order.`,
        flavorText: "",
        typeLine: "Legendary Creature — Human Cleric",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying, vigilance", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "When Kaalia, Zenith Seeker enters the battlefield, look at the top six cards of your library. You may reveal an Angel card, a Demon card, and/or a Dragon card from among them and put them into your hand. Put the rest on the bottom of your library in a random order.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "201155ea-f474-4e13-acda-cb071a6ca977": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "9c5b2fbba9c5702da3b2fad3762c4391ba0f8b6aea874c53cc6241f7fe2182fb",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "20275678-3488-43d8-a93b-993e2267ab07": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "75da24afe3a0f8bdc0fc74e35deffd7150aec794f20af4684209d49492ef6b36",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Ghosts" }
    }
  ],
  "2096e54e-1a55-4fd7-8415-a6f2fdb2a536": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "e065da3201fe3001afa6f1a2bc984b6f4289aacaa089b2de3b396a840c6c4523",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Take target creature from your graveyard and put it into your hand.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Take target creature from your graveyard and put it into your hand." }]
          }
        ]
      }
    }
  ],
  "209f7479-b3a0-4c27-9602-78babb8d2e99": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "db0ecf44b3a2417522ac52686015238a749f311847c2477e67a9d1404fc1d917",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "20c3f515-de7d-41eb-8ba0-532f4c13ac39": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "e9ce1c25c063c92e6490253a8aa435fc29b25c526b0ee00f9db372ac611efee1",
      reason: "The full-art creature has no rules or flavor box. The exact scan was visually reviewed; missing originalText is not treated as empty for unrelated printings.",
      fields: { rulesText: "" }
    }
  ],
  "20f1411b-a5ad-4d49-915b-ad8a21d51342": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
      referenceSha256: "54e37a4953877c9a88248e9c812c9ef6246206411699ee6c7344ea7e1c546c3e",
      reason: "Carries the eight original-field corrections and adds the scan-reviewed Serendib Efreet type and frame palette. Semantic colors remain unchanged; no name-based painter routing.",
      fields: { typeLine: "Summon Wizard" }
    }
  ],
  "20fc852a-77b0-48a6-8343-6cf890da9adb": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "5df8cd0625c6c5f577c859b84819eee24dac1efbab26933450b00e12de6f1d73",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "Target spell is countered; X is casting cost of target spell.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Target spell is countered; X is casting cost of target spell.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "215244ee-0b78-4fd1-858f-d093a5d42939": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "2e4241036437aba226154f180e8001c85ef5a1532f40208b460553613ea7f59d",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Eel",
        rulesText: "",
        flavorText: "Some fishers like to eat eels, and some eels like to eat fishers."
      }
    }
  ],
  "21a985a9-5612-4844-982e-fd1aa6249770": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "c36e4329c0902c86c0be739009dc70f783e20d7ff9303c8ab7cf00459ee6dff4",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Gremlins" }
    }
  ],
  "21b7cbae-6647-4f36-b02d-5535ac88b1a6": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "f48c6c1368b441ffcfeb822d2cd4cc9408c209eceac6f272a200aa5ceb2c48f7",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "21d00299-e183-4b3d-b015-18808e7135b9": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "50762b5cb153942059bb0e4c7649d2195ada50f6715dd0486924eab548b30a30",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "50762b5cb153942059bb0e4c7649d2195ada50f6715dd0486924eab548b30a30",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "You may look at the top five cards of any library. You may then choose to shuffle that library.",
        flavorText: '"Visions of glory, spare my aching sight,/ Ye unborn ages, crowd not on my soul!" —Thomas Gray, The Bard',
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "You may look at the top five cards of any library. You may then choose to shuffle that library.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: '"Visions of glory, spare my aching sight,/ Ye unborn ages, crowd not on my soul!"',
                italic: !0
              },
              { text: " ", italic: !0 },
              { text: "—Thomas Gray, ", italic: !0 },
              { text: "The Bard", italic: !1 }
            ]
          }
        ]
      }
    }
  ],
  "21fa636b-8ce8-40b6-a4d0-3191a664bd92": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "78abda0e13ea99a31a4eab170c6602fa6348303f5fb17e976d32e5f8c9708d40",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["B", "R", "G"] }
    }
  ],
  "2249fc40-4412-48fd-800a-7ea3678aee3f": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "e123bf996d9986a1dec904a1167eb2bcb74451ce961dc5f9a4f17cfabf8ba833",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Atog" }
    }
  ],
  "224cb63f-9af0-4b00-ba0b-0b604abf20c8": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "145bf260438c4c97e8b2538adf7188cf86c1236aecab4d9dcc015816ad8fd7c3",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Salt Flats comes into play tapped.
{T}: Add one colorless mana to your mana pool.
{T}: Add {W} or {B} to your mana pool. Salt Flats deals 1 damage to you.`,
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Salt Flats comes into play tapped.", italic: !1 }] },
          {
            role: "rules",
            runs: [{ text: "{T}: Add one colorless mana to your mana pool.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [
              {
                text: "{T}: Add {W} or {B} to your mana pool. Salt Flats deals 1 damage to you.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "22d4761d-acf2-4cb3-86a8-a3f30420a92e": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "5241023defe6f87b5589ae3667da53ad9693ec0fc21f224d5bb36ca7f9ea9aaa",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "22ea73ec-1325-4437-a23f-dcda1767c713": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "7a483757c03fa5f5fc0c5434ce2e05efb6400dc4df578d7aa784ecc2b62dbc12",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Elder Dragon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "7a483757c03fa5f5fc0c5434ce2e05efb6400dc4df578d7aa784ecc2b62dbc12",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: `Flying
{B}: Gain +1/+0 until end of turn.
{R}: Gain +1/+0 until end of turn.
{G}: Gain +1/+0 until end of turn.
Pay {B}{R}{G} during your upkeep or Vaevictis Asmadi is buried.`,
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying", italic: !1 }] },
          { role: "rules", runs: [{ text: "{B}: Gain +1/+0 until end of turn.", italic: !1 }] },
          { role: "rules", runs: [{ text: "{R}: Gain +1/+0 until end of turn.", italic: !1 }] },
          { role: "rules", runs: [{ text: "{G}: Gain +1/+0 until end of turn.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "Pay {B}{R}{G} during your upkeep or Vaevictis Asmadi is buried.",
                italic: !1
              }
            ]
          }
        ]
      }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "7a483757c03fa5f5fc0c5434ce2e05efb6400dc4df578d7aa784ecc2b62dbc12",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "B", "B", "R", "R", "G", "G"] }
    }
  ],
  "22ebd5a3-fef8-4097-b038-89a6cb38227d": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "e7e8111dd2e9d55a1c540c955618ed74a35d6938c4232fc4c376bc65b2223ca3",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "22f6e971-349d-498b-ae01-ab81ce21772c": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "2c84cb0a0f28074e1a235ea89521429889150905ada465c5464a67c8e9a80523",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "2338aeec-63f6-4cc1-833e-77d44994a7ca": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "834b51ac37a356600bb98681c64241798bac264808f25598eccd6ad7b847c353",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "{1}{G}, {T}: Target creature gets -2/-0 until end of turn.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "{1}{G}, {T}: Target creature gets -2/-0 until end of turn." }]
          }
        ]
      }
    }
  ],
  "2340edcb-8cd5-4ccd-99e2-b9a29f72c495": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "29439d8b48cf83bdaf316f4770c0949349c5cb9d1c3325f5bb1cc0759ba161f2",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "239a5d29-95cf-468a-8b07-aea1f7dc8d52": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "0a47f9e668c67aa896e86a2cc5a0ab7f14086de28fdb9f03c902354920930fb5",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "23eb19f9-2e8f-4bf0-9bf8-868e6da70e2d": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "0ec3d97f26b211de4068fbeff848ba8a444ae0a334899110bb58a3d6ef0f4390",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "241a4854-e62c-4be4-a9cc-1e14db4eede9": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "e9addf202ebca183c148f5dc6e81efb0a83d93d2ba466b1ec8af13a7fed0a0b6",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "e9addf202ebca183c148f5dc6e81efb0a83d93d2ba466b1ec8af13a7fed0a0b6",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "B", "B", "R"] }
    }
  ],
  "243c5460-8d4c-47a7-8a9c-ab626daa520a": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "7c226b5c6577c56c7a29cc82042d7499102238b02a82e85713daafc907ded85c",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "24f888dd-785c-4089-a89c-03f9080130ed": [
    {
      faceName: "Rampant Growth",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "ee76356a2f3856aa4e83bad14ac0d1fc67bc817e45caf6cce5d44812ed06eac8",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Search your library for a basic land card, put that card onto the battlefield tapped, then shuffle.",
        typeLine: "Sorcery"
      }
    },
    {
      faceName: "Studious First-Year",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "ee76356a2f3856aa4e83bad14ac0d1fc67bc817e45caf6cce5d44812ed06eac8",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Bear Wizard"
      }
    }
  ],
  "254e0403-67d8-4e73-8d89-c901ebeba49f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "32d4b3b73762d360ef62ae4c48bc0fce6c0c3c5d26202fdfce054fe5922a6bb3",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "25a173fd-e10c-45f8-a6e5-ad7a747a8050": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "ab1fb605af8f7e062d1570292ac3660bae4e30166d3d70b7399916888d9a2ee7",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Falcon" }
    }
  ],
  "25ab9a2b-e248-4ae2-aac3-b49fdb3e260a": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "3358e18088f2872f9298c15432e3d70659fd0876e94a5f61e9e5843181404bbc",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Flying Men" }
    }
  ],
  "25ad2444-9985-423c-ad36-387218866409": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "a9ca7aca0db91b2bf7a82d7a1483bd709456daf7294b3d4a6fbd860f964d871d",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "25e891f1-79fa-43dc-817b-c7838cd03d5f": [
    {
      source: "games/magic/fixtures/accuracy/planar-printing-corrections.json",
      referenceSha256: "288d7facec64b9ea2f1565ebbee78d02ff77d30170ca92f49c59ddf5c2748478",
      reason: "The exact scan includes an em dash after Choose one; cached MTGJSON originalText omits it. Restore the scan-reviewed rules sentence, retaining the original semicolon-separated choices. Oracle wording and unrelated printing fields remain unchanged.",
      fields: {
        rulesText: "Choose one — Destroy target artifact; or target creature gets +1/+1 and gains trample until end of turn; or remove two time counters from target permanent or suspended card."
      }
    }
  ],
  "2646284b-a94d-4c99-98d4-7becbb473e2b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "c347c8c194b4b7210531feffa869b623ecdb313dad040850eb1983952795bcb0",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "2657e85b-8f77-41fa-9df2-233443efef43": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "9ff180b01da32dd9d98bd59d10b9099c19a5cff9181780675decface2625f25d",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "W", "U"] }
    }
  ],
  "26724a51-87dd-4159-b012-71598e4cf5eb": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "be74b3bf152d6fb059dbc79ab70a9370abd66c59afff9d8bbb851e056ed019b2",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `When you play Roots of Life, choose islands or swamps.
Whenever a land of the chosen type that target opponent controls becomes tapped, gain 1 life.`,
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "When you play Roots of Life, choose islands or swamps.", italic: !1 }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever a land of the chosen type that target opponent controls becomes tapped, gain 1 life.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "26a5333f-2761-42b8-ae8b-1d360b109daf": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "071344f6ef3984432cdd98861fd9918a81b9fc1dd3fe1fa5c3ea3d4b4cd2d3ae",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Medusa" }
    }
  ],
  "26e090d4-e7fe-403c-9aca-05c1b45ed238": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "6a34ab5c763613e159987239df38b9cb48cb530c4ef776501e47c6a1bbe4eee4",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "2717b2e2-bea8-4ba8-9ad1-abb60abf6e4c": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "54e5418b0ce08fd87387387be5570c0748fd2e647f3a80f29a7bacd771862961",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Raiders" }
    }
  ],
  "27180bad-9bbc-462b-8832-626dc403a3fd": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "ce4101571c70d9246b6bcbaf03128455799dca7d2ee29a55d81f91aec0777910",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Cobra" }
    }
  ],
  "275c03f9-f9d2-45c5-a332-b3bee54e7065": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "9397cb87485f89a5de3b07b0477d7dd3f3fb63fddf395ed8df3a013e50cae545",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "27886da1-9161-4bed-81b5-06da21a25f91": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "96fde8dc7b4cdfb93bf52bc98240a35d974b00d9337d61cc933d68cd3a563a45",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "27cf53e3-76f6-4831-800e-1259394d779d": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "282006e926b7cf54c9de29b0b750df15f28270c1fbfa30636f56623dd548d3c8",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "2806c7f6-8fdd-4e65-9c71-f2e8b0cdede2": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "ad568f9e25a1c764633181a64e4d2575528355b52f959094af85af777ffe0a56",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "2816d30e-1e52-4323-b30e-1688fba23368": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "2decb03c479b74942a1669f97fcf851684198deadc852abfd778ecd470ec4d76",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Legendary Land" }
    }
  ],
  "289b649b-c93a-44ad-bdd6-866f8b2f1bc2": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "7ecd18db7492dfd9937457ecc10bfd97ede10e59c26ef907c0461b2eecd7512f",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Haste
Whenever Thunderkin Awakener attacks, choose target Elemental creature card in your graveyard with toughness less than Thunderkin Awakener’s toughness. Return that card to the battlefield tapped and attacking. Sacrifice it at the beginning of the next end step.`,
        flavorText: "",
        typeLine: "Creature — Elemental Shaman",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Haste", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever Thunderkin Awakener attacks, choose target Elemental creature card in your graveyard with toughness less than Thunderkin Awakener’s toughness. Return that card to the battlefield tapped and attacking. Sacrifice it at the beginning of the next end step.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "2933ca2a-097b-44f4-ae56-ad524d26fd06": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "feb640e6f4c543a3d8faa68ee40b5a66fa71b3b38e3593327445cbeb9d4c8524",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "2970683e-e69c-42cb-a067-34abd56fb42b": [
    {
      faceName: "Elite Interceptor",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "914285b0297dc72a4a1af86839873d7fb69a0d8e0423bcbe3efb667ee8d04dc4",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Human Wizard"
      }
    },
    {
      faceName: "Rejoinder",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "914285b0297dc72a4a1af86839873d7fb69a0d8e0423bcbe3efb667ee8d04dc4",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `You may tap or untap target creature.
Draw a card.`,
        typeLine: "Sorcery"
      }
    }
  ],
  "29a50f72-9524-4440-9380-9d3e0b693351": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "6d21130e5faf7ac195544c33a2cc792a48216074cf91d9515034f27e5405e611",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "29b70152-1d7b-45c4-8c85-011d2338e0a8": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "40de1d8e4e5a3afd86df91def32d4b1c3134563cd65b300bcc5e684d14c01757",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `If Leyline of Anticipation is in your opening hand, you may begin the game with it on the battlefield.
You may cast spells as though they had flash.`,
        flavorText: "",
        typeLine: "Enchantment",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "If Leyline of Anticipation is in your opening hand, you may begin the game with it on the battlefield.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [{ text: "You may cast spells as though they had flash.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "29cd7064-3703-43e0-8702-d1ba13703fd8": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "c27f94e2083db6359f19dda9b57991f0e3cf0b508d1a5ae8ed5a5cebd66caf6b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ali Baba" }
    }
  ],
  "29dc1596-a2e7-4d60-9f99-89babaef8a06": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "d03eadbd22dcaaff11a40ade1f8c96b749e7702b9068428889824d24d462fd50",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "2a02aabb-c464-4672-b37b-d5d713ef8939": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "c459c43b4dcbc403cfb70da00a8b8f2211f3e031f8427abba9299da227f1cdd7",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "c459c43b4dcbc403cfb70da00a8b8f2211f3e031f8427abba9299da227f1cdd7",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "W", "G"] }
    }
  ],
  "2a1e7796-fbfb-4976-879f-bb748429d5c7": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "48b51af27fecdf879db52c5fe7ffc8950f05a8b8b5dcfebb37c9ce3c9998a082",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Hag" }
    }
  ],
  "2a7cf252-1af0-4b03-89bc-8287b4052a23": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "9e408ba403e92f2a718d4f076e402ad7ec52d56cf5610ad896d16e75dfb67238",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "2aa5b289-36ba-49b1-a5ac-f23bf71f8241": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "b1afda7775ea1ff6a1279f3012d3edddf8580d9068ff44710a29bb9f7e988b91",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "2b3d1430-9978-4983-a4fd-d1fa8dea2169": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "72c222f4d8afb6d336b43e744030ce1d54feeb7a525cd182cdd6f9c0b46a03a7",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    }
  ],
  "2b56c9ed-c912-4829-9be0-e80303759c9c": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "b81c391d7e7ee84c5f4dfe69b078d2c5a8d5f9727acba53f649767b0e7751ee4",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "{2}, {T}: Discard a card you just drew from your library, and draw another card to replace it.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{2}, {T}: Discard a card you just drew from your library, and draw another card to replace it.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "2b60eb23-cb9a-4203-86fb-60e47dbd870b": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "890cd7806cff08e14fb2c2421172f60b5846b8257202e787f89735922bac6ca0",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "2b814198-814b-4619-a158-327af675f8f2": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations.json",
      referenceSha256: "51665b7f0b3272ed448ceca35bc7f7da50b5008d8e92a2fab5091fb19032c141",
      reason: "Eight development scans visually reviewed. Printed wording transcribed; soft wraps are not forced. Poetry line breaks are intentional. Land targets retain semantic subtypes and require an actual historical printing policy. Expected alignment/artist are review targets, not geometry overrides. Heldouts remain unviewed.",
      fields: {
        rulesText: "{1}: You gain 1 life every time a creature is destroyed, unless it is then regenerated.",
        flavorText: ""
      }
    },
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "51665b7f0b3272ed448ceca35bc7f7da50b5008d8e92a2fab5091fb19032c141",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "2b827094-fb2c-46db-b898-02e0c308601f": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "e4c1d853d120e8ee21df0697f46010f3c5e9556f04362bff067fc46308d203a1",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ship" }
    }
  ],
  "2b871039-6a66-4ac3-95e7-24759c1f2f92": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "67c9b48367bf427c52348d6d6ed8a4bc7dc26f6c64726b9e285eab87097c603f",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Merfolk",
        rulesText: "",
        flavorText: "Most human scholars believe that Merfolk are the survivors of sunken Atlantis, humans adapted to the water. Merfolk, however, believe that humans sprang forth from Merfolk who adapted themselves in order to explore their last frontier."
      }
    }
  ],
  "2bb0e884-5bb4-41f3-b04b-6f638357c166": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "3c5b96e77ab1b17b5ce54e09bd65ea11aa827a5af2ba00dc06558c07bef3d88e",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "2bc5e073-2903-4a28-9c23-07a0482ae09a": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "c922eb698917a301c6f21e536e72580608cba79495105c9671e5979881f12645",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "{2}, {T}: Provides 1 mana of any color. This use is played as an interrupt.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{2}, {T}: Provides 1 mana of any color. This use is played as an interrupt.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "2c1dbc62-ceb5-4540-ae38-901e5deafc75": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "98ccb991ea3f4cfa50bd3227408fd0828da515d5410060a1d63bb3f06e702139",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Elder Dragon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "98ccb991ea3f4cfa50bd3227408fd0828da515d5410060a1d63bb3f06e702139",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: `Flying
{W}: +0/+1 until end of turn.
Your untapped creatures gain +0/+2. Attacking creatures do not get this bonus. Pay {W}{G}{U} during your upkeep or Arcades Sabboth is buried.`,
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying", italic: !1 }] },
          { role: "rules", runs: [{ text: "{W}: +0/+1 until end of turn.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "Your untapped creatures gain +0/+2. Attacking creatures do not get this bonus. Pay {W}{G}{U} during your upkeep or Arcades Sabboth is buried.",
                italic: !1
              }
            ]
          }
        ]
      }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "98ccb991ea3f4cfa50bd3227408fd0828da515d5410060a1d63bb3f06e702139",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "W", "G", "G", "U", "U"] }
    }
  ],
  "2c3c0f74-485e-4b21-8f41-56666a7d0005": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "3ca99a3f8b57e9b0a695330bf79d12e4e56a7bc84f94b76fd4a3dc847fd7c9d2",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "2c8e174c-7abb-4a93-aa1d-8c2a2e815ba6": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "ed4c858b2a2db409d5b0673d787c1d5fa457de22e47a55d2af46639bea379d4a",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "{2}{W}: Target creature deals no combat damage this turn.",
        flavorText: `“I’m amused by wasted effort when it’s not my own.”
—Hanna, Weatherlight navigator`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "{2}{W}: Target creature deals no combat damage this turn.", italic: !1 }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "“I’m amused by wasted effort when it’s not my own.”", italic: !0 }]
          },
          {
            role: "flavor",
            runs: [
              { text: "—Hanna, ", italic: !0 },
              { text: "Weatherlight", italic: !1 },
              { text: " navigator", italic: !0 }
            ],
            align: "right"
          }
        ]
      }
    }
  ],
  "2c9b1f70-9861-4c66-a52f-c40002679e75": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "eddbc062799b94ec4bac946ca222a405b82d466a8d95650647128170e755cd42",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Flash
Other Wolves and Werewolves you control get +1/+1.
At the beginning of your end step, if you didn’t cast a spell this turn, create a 2/2 green Wolf creature token.`,
        flavorText: "A strong leader means a growing pack.",
        typeLine: "Creature — Wolf",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flash", italic: !1 }] },
          {
            role: "rules",
            runs: [{ text: "Other Wolves and Werewolves you control get +1/+1.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [
              {
                text: "At the beginning of your end step, if you didn’t cast a spell this turn, create a 2/2 green Wolf creature token.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "A strong leader means a growing pack.", italic: !0 }]
          }
        ]
      }
    }
  ],
  "2cf6a3a3-4a06-4eb7-981a-b70cf05b2473": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "4eec9005aa776715e21b61302ece27d08d676eb3a95939bd8af156ab8c1202a1",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "4eec9005aa776715e21b61302ece27d08d676eb3a95939bd8af156ab8c1202a1",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "{U}{W}{G}{T}: Regenerate target creature.",
        flavorText: '"On the field of honor, a soldier need have no fear."',
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "{U}{W}{G}{T}: Regenerate target creature.", italic: !1 }]
          },
          {
            role: "flavor",
            runs: [{ text: '"On the field of honor, a soldier need have no fear."', italic: !0 }]
          }
        ]
      }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "4eec9005aa776715e21b61302ece27d08d676eb3a95939bd8af156ab8c1202a1",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["U", "W", "G"] }
    }
  ],
  "2d1ced0f-a232-4a05-aa59-6e611b52d617": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "81d957116fc98b70b0096ba68a39a8e7e5f8514c0574caf540e6407063017ccb",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "2d4d87a3-5f8b-4152-9a8b-538ab49d62e8": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "cfd1d506cef89dde848bd2087fad4d33f827dc18b7ab8bad211fdbe711512e3c",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Summon Dwarves" }
    }
  ],
  "2d604bac-58b7-4479-8ab8-2e0680746e0e": [
    {
      source: "games/magic/fixtures/accuracy/planar-printing-corrections.json",
      referenceSha256: "a3057f9a38fe96e3ee8f3cebc601fa8cf343538c8faf5f911fe2ea02a8b9dbf2",
      reason: "Exact scan type line reviewed. MTGJSON originalType contains later creature-type errata; preserve printed subtypes and leave Oracle types unchanged.",
      fields: { typeLine: "Creature – Elemental" }
    }
  ],
  "2e30b5ff-1239-4c4d-ac7c-554ecf8e1e27": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "f19b2b96a3eee9fb64b92a45ee3a51b22a3c666dc2d2ac1b579ec02d44552618",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Bees" }
    }
  ],
  "2e72f8cb-5bc3-4711-9b7c-a6eea9a0beaf": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "675a4efe1a38fb150aa6e4ec682defb8e3b1ade864e14401acdec90d91b4c85f",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "2e939761-3542-4044-9038-d1d30c6a38fc": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "c1919ccbe1c1aaa79c34202ff71e64647fe2e9c554e7d501ec26fc8a93449e93",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "c1919ccbe1c1aaa79c34202ff71e64647fe2e9c554e7d501ec26fc8a93449e93",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "B", "U", "W"] }
    }
  ],
  "2f2f3b3e-63f3-4cab-aa95-030990157ed5": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "cce1969a9375ebd4f5386d60e4df82ef2c02229ca1750033bf207863bcbca02b",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "R", "G"] }
    }
  ],
  "2fa20173-e88a-4b14-9c54-14567ca5571c": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "83c9429de2d4c0f8b99f69c0a1e35d83b12cb993563908f457c5b6e10315deb2",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Treefolk" }
    }
  ],
  "2fad0078-f3cb-48a4-9ed4-b658e983314f": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "2111894975a8bb9f6607e03370cb07b109bff75b67e4d7ef6c4fda1223685860",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Merfolk",
        rulesText: "",
        flavorText: "Most human scholars believe that Merfolk are the survivors of sunken Atlantis, humans adapted to the water. Merfolk, however, believe that humans sprang forth from Merfolk who adapted themselves in order to explore their last frontier."
      }
    }
  ],
  "2fb5926f-9988-4bc0-b2b7-e286db208310": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "7fd625c22d0ca8d7233c08a5e20487348dc324077287fe47bf59263f59e5be1a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon People of the Woods" }
    }
  ],
  "2fbd611b-ac97-4516-bad7-cc9ee4ef74f7": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "a545fff9fd7c378346ece8e368864eece47551f027aa68d58cdafc6502a7f2f3",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "2fbf039d-0ab9-4c42-a0a3-cbfa3ea1dd6e": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "48892e8a5eb53e668d427750812559f31258b37969bfc84f0b0376cca09c512c",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Goblins",
        rulesText: "",
        flavorText: "The intricate dynamics of Rundvelt Goblin affairs are often confused with anarchy. The chaos, however, is the chaos of a thundercloud, and direction will sporadically and violently appear. Pashalik Mons and his raiders are the thunderhead that leads in the storm."
      }
    }
  ],
  "3003bf1e-8085-45d8-882b-c449109e7631": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "e46ca6ae859ef1c3901ef0076c3115146b5c776121e5ce0eb049dab2c3cd3cca",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Singing Tree" }
    }
  ],
  "30345500-d430-4280-bfe3-de297309f136": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "e5a79bb404166952b8ba34c62ee900aacae4666e1e0455fb4c4759799b202ec3",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "3035cead-a501-4204-9154-5fd648577d32": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "f29919f48552cea63c0bbc9f1c722ac08b16dd3be0b4e29554d10e34976b8305",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "304f9d39-3ea2-4274-b23e-e4eaabbc1c4b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "c55390e68862bad5600ae5082656a3fab557a6d7e257f5a9b31b3b4d44677f36",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "c55390e68862bad5600ae5082656a3fab557a6d7e257f5a9b31b3b4d44677f36",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "B", "R"] }
    }
  ],
  "30935e4a-013e-4c46-ad05-304df8e5dfa4": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "88a8f234108ef4a8b53fbd32bc3eb9be354a6c3b8375db4506db48cd2e75cc02",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "309cd081-13bb-428b-b561-60b7a81c0f1d": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations.json",
      referenceSha256: "cf1249887351c4bde85593b03d8af49ddf94452230820f16b9ec7830166c4318",
      reason: "Scan confirms a separate attribution line. Both source feeds omit it. Partial review; original rules wording is not certified. Upstream correction: https://github.com/mtgjson/mtgjson/pull/1748",
      fields: {
        typeLine: "Summon Paladin",
        flavorText: `"Look to the north; there you will find aid and comfort."
—The Book of Tal`
      }
    }
  ],
  "30ce1bf0-7561-418f-a217-3ce10f28be82": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "9161b246c50d4f7d21d1979b29de52c6670d6414e3d0b76fd75912a6b5799957",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "30d1450f-2909-410e-9920-731278fa74de": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "8c5fe5db6134daee0ec7fb558dbe524f139d37ed16c709d514c347a34e65cb8b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "314fd1d7-4bd8-4d95-b7c2-1aa6660ab88a": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "29df3cbd554decb6049d51863b04d026f311f137b884f19b82e82923a48ed761",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Land" }
    }
  ],
  "31570ded-f5e3-44c4-b95f-294ac10b2cd2": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "12bc591b5563a24c58ab425f8ba71d17b80708643584723b02b6f02b7f3b3ccc",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "12bc591b5563a24c58ab425f8ba71d17b80708643584723b02b6f02b7f3b3ccc",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "W", "G"] }
    }
  ],
  "31bf3f14-b5df-498b-a1bb-965885c82401": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "603ded2694bb38728ca6af8f34d8113c0585470904c6f828efed83a7b6b3f7a6",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Djinn" }
    }
  ],
  "31d2422a-bb7d-4cdd-9aac-e5a936a4be3b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "5c1ae5bd88f323362504a766f0b7be67954294d5e86ef04aa72e610dd3b508e4",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Legendary Land" }
    }
  ],
  "31e22edb-a815-413d-b62d-f32f8932b6e6": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "3454a9f2ad4052ff8be453218d0b4ef482d8dfca04ddf5a34d61cc460fd92abb",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Enchant creature
When enchanted creature dies, return that card to the battlefield under your control with a +1/+1 counter on it.`,
        flavorText: `“Don’t think of it as selling your soul. It’s more like you’re bequeathing it to me.”
—Vilis, Broker of Blood`,
        typeLine: "Enchantment — Aura",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Enchant creature", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "When enchanted creature dies, return that card to the battlefield under your control with a +1/+1 counter on it.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“Don’t think of it as selling your soul. It’s more like you’re bequeathing it to me.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Vilis, Broker of Blood", italic: !0 }] }
        ]
      }
    }
  ],
  "323db259-d35e-467d-9a46-4adcb2fc107c": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "ad0b166280d738911708e033bb4ee097e9b70c1d72dd55c2537d7266482ef703",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `Scry 1. (Look at the top card of your library. You may put that card on the bottom of your library.)
Draw a card.`,
        flavorText: "The crystal pulsed with the power of Teferi’s Planeswalker spark. Had Jhoira given him a blessing or a curse?",
        typeLine: "Instant",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Scry 1. ", italic: !1 },
              {
                text: "(Look at the top card of your library. You may put that card on the bottom of your library.)",
                italic: !0
              }
            ]
          },
          { role: "rules", runs: [{ text: "Draw a card.", italic: !1 }] },
          {
            role: "flavor",
            runs: [
              {
                text: "The crystal pulsed with the power of Teferi’s Planeswalker spark. Had Jhoira given him a blessing or a curse?",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "3247a7dd-f48c-4cb4-8475-4864acccef7a": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "347d2c3a98205a03f6d14e211fb01110f1a3dde0848001c699529a26a566b4dd",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Phoenix" }
    }
  ],
  "32516ab8-43be-4207-a7d5-4916933ce155": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "b85fe90f34a7285bf6c0b8afb8bfcd17109a2bc416241e07cfb9302169cb4af5",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "32865e68-5842-4f17-b2ea-4ffa743b511f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "756c972fa9e29b9c084a5f689d31108ee74fc421576db106d56f09076e7bc90a",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Land" }
    }
  ],
  "329f7eb2-eadf-46ec-aed4-63152051f3c1": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "39a5e93edee399430e4b654c5996428344f0eea87de63fb759625de75c9be31f",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "32f1f022-da7f-49a4-881d-b3a2c54c38eb": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "8b34eebcf62a67b216eafad76db2273c1ff9f506a8b99d348fc40ac1b10bf973",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      fields: {
        rulesText: `Korlash, Heir to Blackblade's power and toughness are each equal to the number of Swamps you control.
{1}{B}: Regenerate Korlash.
Grandeur — Discard another card named Korlash, Heir to Blackblade: Search your library for up to two Swamp cards, put them into play tapped, then shuffle your library.`
      }
    },
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "8b34eebcf62a67b216eafad76db2273c1ff9f506a8b99d348fc40ac1b10bf973",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      paragraphScope: "rules-only",
      fields: {
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Korlash, Heir to Blackblade's power and toughness are each equal to the number of Swamps you control.",
                italic: !1
              }
            ]
          },
          { role: "rules", runs: [{ text: "{1}{B}: Regenerate Korlash.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              { text: "Grandeur", italic: !0 },
              {
                text: " — Discard another card named Korlash, Heir to Blackblade: Search your library for up to two Swamp cards, put them into play tapped, then shuffle your library.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "33296718-0625-4422-a65c-b21cf99c52ec": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "02bd6fb7ccc9056cd6768f7c76239e5af988a4f5455102a791e99269477e7a78",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "332bfce9-052d-42e9-a407-4a1dd59e0f2a": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "f94c93778029b80c82e6f40138cf64cdb94529cf3e0a5e8a072ba99742a9ce8d",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "336b3b8f-d104-4f06-ad4f-c92b8a9038ca": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "a8e2b76bfece082f57f22c16d3f8d6d7a8e2dcf212a0afeb1126c4967119d49a",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Hell's Caretaker" }
    }
  ],
  "33f51f18-41af-4a2c-a353-48bebd697599": [
    {
      source: "games/magic/fixtures/accuracy/planar-printing-corrections.json",
      referenceSha256: "20c5c6cf3d4ff1b5547102c79ec55f3fff9fa6f530359e93d2ee7b47878943c3",
      reason: "The exact scan includes an em dash after Choose one; cached MTGJSON originalText omits it. Restore the scan-reviewed rules sentence, retaining the original semicolon-separated choices. Oracle wording and unrelated printing fields remain unchanged.",
      fields: {
        rulesText: "Choose one — Midnight Charm deals 1 damage to target creature and you gain 1 life; or target creature gains first strike until end of turn; or tap target creature."
      }
    }
  ],
  "3415e3a7-99b2-44b5-93a3-fd07c4ecca4d": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "e6941768fb55e99b3e4728b3abd666f4f936bdab9cdba955a9503e4fb0accd93",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Elf",
        rulesText: "",
        flavorText: "The song of the forest is in perfect harmony. If a single note is out of place, the elves will find its source."
      }
    }
  ],
  "34855fa8-959d-45a2-ad91-8b17019755be": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "faafc425c0945af13878b0771bd6d61fe41d44ae47138e16d32803d37592a330",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "348955a0-e988-48d7-a6a0-a8045fcffd25": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations-empty-rules.json",
      referenceSha256: "535ea799e051ab39299f09a4b97e8478e1e2fd3d71fe95dc267a79641bbc9c8d",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Crab",
        rulesText: "",
        flavorText: `"What wishes do they grant? Mostly pinching-related ones."
—Omik, superintendent of waterworks`
      }
    }
  ],
  "348a467a-4661-4fdb-af1d-9171a1a930d9": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "dde2ff4f105d14b98273df99b58782c6532e113447fa1250869171684e8fd335",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Nameless Race" }
    }
  ],
  "35393661-2c53-46f0-bb33-2390d552b060": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "edaf2c9a8bc26159026c5a005097c033065a015957216f4a54d4b94cfb89767f",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "35415199-0f1d-4398-a48f-f78697a51105": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
      referenceSha256: "d4df515ddc0674a46f340f8e7f13110a6cdc04fd275bc68ee4229a6050524f55",
      reason: "Carries the eight original-field corrections and adds the scan-reviewed Serendib Efreet type and frame palette. Semantic colors remain unchanged; no name-based painter routing.",
      fields: { typeLine: "Summon Efreet" }
    }
  ],
  "35a335bf-7358-460f-b7c9-1e8bc4300f64": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "25efb09314c3cd784d5e33cbb57836a3ba86aa661c41685ec43f8f2324df5024",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    },
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-text-outliers.json",
      referenceSha256: "25efb09314c3cd784d5e33cbb57836a3ba86aa661c41685ec43f8f2324df5024",
      reason: "Exact scan shows a colon after the activation cost. Rules and flavor checked visually. Retain semantic mana tokens and ordinary soft wrapping; no geometry adjustment.",
      fields: {
        rulesText: "{X}: Untap X separate lands.",
        flavorText: "Tawnos learned quickly from Urza that utter simplicity often led to wondrous, yet subtle utility."
      }
    }
  ],
  "35c73a97-531d-4dd5-8236-39b89c183c38": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "cbe968d96bba6f70d7661887e8f65ce9c3a89303aeb1ef75fc67f47072b44477",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Raiders" }
    }
  ],
  "35d29bda-096c-44d4-b45e-c2c507f8efbe": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "2cafcd6bbf39ead7a1eff096cb6ec7bfc6ed78ccbc8df0093b3d38a714f71ee4",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Miracle Worker" }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-text-outliers.json",
      referenceSha256: "2cafcd6bbf39ead7a1eff096cb6ec7bfc6ed78ccbc8df0093b3d38a714f71ee4",
      reason: "Exact high-resolution printing scan reviewed for rules and flavor. The flavor attribution continues inline after the closing quotation. The book title is roman within italic flavor. No layout offset, forced soft wrap, or Oracle correction is included.",
      fields: {
        rulesText: "{T}: Destroy target enchantment card on a creature you control.",
        flavorText: "“Those blessed hands could bring surcease to even the most tainted soul.” —Sister Betje, *Miracles of the Saints*"
      }
    }
  ],
  "35fbbe41-d21b-4028-905f-054c44d30eb2": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "2258a4cb2c414ffdf151f09a1c42e368bcae793d49dc737de47cb6425cbb2110",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "35ffc69e-26f2-434f-8c89-2df108dd984a": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "a19adad630220987b4576573e0e2a26ef13c06779735389b7266b65ff23182fb",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Tracker" }
    }
  ],
  "362f1fe9-20af-434c-9957-7a1a564d89e6": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "28868d2c1e09c3f5964eaa6c83c2de470fbf562bcf60a00aaca21a57752fea0b",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "36313dc7-6bf2-4d73-b696-969d984a7466": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "e95ec90c9e34e8428930d4493b8287fa70b01365c59b2bc4475dd261d58a918b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Merfolk" }
    }
  ],
  "363cc5d6-70f8-4a3c-92bd-8f49774bdce2": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "54fad4eaf8b01ba76c859bcdf945ae42649926aa8b301b3ea5ae77515dcf8080",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "37414560-8187-4c5b-8245-05d77b25c454": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "50b213730b793f0f88110955f810a507e9b62d7cbe73b9f027bcc41cffc10b73",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "Target creature gains +1/+2.",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Target creature gains +1/+2.", italic: !1 }] }
        ]
      }
    }
  ],
  "374df061-ebd2-4f1f-9a6e-7940a49197a9": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-missing-rules.json",
      referenceSha256: "fe22feed2c29becca20e839dc6f6a611a253094760d314a9732d60cb655cc3ae",
      reason: "Rules and flavor visually transcribed from this exact scan because the printing has no matched MTGJSON originalText. Symbols use semantic tokens; soft line wrapping is not forced. Squire retains verse and attribution breaks. Type line, typography and other fields remain separate reviews.",
      fields: {
        rulesText: "",
        flavorText: `“Of twenty yeer of age he was, I gesse.
Of his stature he was of even lengthe,
And wonderly deliver, and greete of strengthe.”
—Geoffrey Chaucer, *The Canterbury Tales*`
      }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "fe22feed2c29becca20e839dc6f6a611a253094760d314a9732d60cb655cc3ae",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Squire" }
    }
  ],
  "37634ffe-788f-4262-88e8-5ab7c7ca74d6": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "d2806d80d7194c47cd382f959b9eb13843c8120c342581e9b7641891b9719dd5",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "376cb9e5-89fb-4091-8a20-140bb6de0ef6": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "c65d1afd08a9e33381f099b1bf305ad8612edc111c9f80426590ad98813d1434",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Elemental",
        rulesText: "",
        flavorText: "Fire Elementals are ruthless infernos, annihilating and consuming their foes in a frenzied holocaust. Crackling and blazing, they sear swift, terrible paths, leaving the land charred and scorched in their wake."
      }
    }
  ],
  "3792c6ef-c4e6-4923-9a51-7d28fbc5c393": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "3d70f8c3001edefb1acb1134e7a8f97e79c934790635447dcee0dfcd2dfa6346",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "37e69940-bdc8-48ff-a296-540343910adf": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "7d66c09ec1d9796e6334c27312dcee7ff962aaf027effc7a840714d8316c1a98",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "386ea9eb-abc1-4862-aa2d-8fb808d79490": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations.json",
      referenceSha256: "495af24931d1f3a0dc3d4f217a6d56467e33878a62ba5289e2af5792cd5848e3",
      reason: "Eight development scans visually reviewed. Printed wording transcribed; soft wraps are not forced. Poetry line breaks are intentional. Land targets retain semantic subtypes and require an actual historical printing policy. Expected alignment/artist are review targets, not geometry overrides. Heldouts remain unviewed.",
      fields: {
        rulesText: "Target creature is removed from game entirely; return to owner’s deck only when game is over. Creature’s controller gains life points equal to creature’s power.",
        flavorText: ""
      }
    }
  ],
  "38937c61-280e-457f-aef9-43139446163a": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "999f60e3429d917df106769c9ae8fae7ca1f9eaeae2f93bc44e42d2347d51460",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "38e2b0ff-8fdf-4db0-85c0-c1010bacd36b": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "a3c30c877762dd2d4a8fca83dfb9e4df504f6ef17c1907441aad6571ec0b3277",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "38fb3014-f631-4a75-92cd-7e626b13a4c3": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "95370e9a92e8efeb5e28c342adad4a6e6cdd395c369d4c69414c1355f84c5d56",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Elves" }
    }
  ],
  "3928bbce-87b7-4b28-9af4-20362935c909": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations-empty-rules.json",
      referenceSha256: "0bb0c1070e9ed74fe81866169f4c1edb52fc13e230a0b4543271e3137e17ad2d",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Beast",
        rulesText: "",
        flavorText: `"It certainly takes after its master: big and brutish, and you can smell it from a mile away."
—Liliana Vess`
      }
    }
  ],
  "396aae79-41d5-4b16-8903-5af8fde65eee": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "97c9ad1d32bbc47bad830ec7c16045316f7903ebad269221cfd6fe141152ee02",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "Bring any card from your graveyard to your hand.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Bring any card from your graveyard to your hand.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "39d763bd-b0a9-46ba-bcd2-9304063446f2": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "dcaa7312317ebf91b5529f3988e6964a8e368b3487ae89a5d5e0d6b6c756c747",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Gaea's Avenger" }
    },
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-stats.json",
      referenceSha256: "dcaa7312317ebf91b5529f3988e6964a8e368b3487ae89a5d5e0d6b6c756c747",
      reason: "Exact Antiquities scan prints the asterisk before +1 in both stats. Reviewed power/toughness only; Oracle values remain unchanged.",
      fields: { power: "*+1", toughness: "*+1" }
    }
  ],
  "3ac35077-91e9-446c-9cb2-e2cfb9fa2962": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "f2e60fce983f1b51374283efef3903f5fe5ddff7e5a8dccd585321d940ca93c6",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "Target creature gains +2/+1.",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Target creature gains +2/+1.", italic: !1 }] }
        ]
      }
    }
  ],
  "3af78d76-ad5c-44ba-880d-b834bcde5398": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "0240694a2772bd87728e3008a03e31c0bf18e4e616cecf44c908c013f70e0e7a",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `You may spend mana as though it were mana of any color.
{T}: Add {C}{C}{C}{C}{C}.
{5}, {T}: Draw a card for each color among permanents you control.`,
        flavorText: "Visitors marvel at its design, unaware of the other world that inspired it.",
        typeLine: "Legendary Artifact",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "You may spend mana as though it were mana of any color.", italic: !1 }
            ]
          },
          { role: "rules", runs: [{ text: "{T}: Add {C}{C}{C}{C}{C}.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "{5}, {T}: Draw a card for each color among permanents you control.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "Visitors marvel at its design, unaware of the other world that inspired it.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "3b4ce350-b6ed-4e0e-8c70-efc6e5f18a5d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "d96508763eaf67d720c13ebaef763521e07231c2d2f753db79fc728bdfea95a3",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "d96508763eaf67d720c13ebaef763521e07231c2d2f753db79fc728bdfea95a3",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "W", "G", "G"] }
    }
  ],
  "3b66d0cc-84d7-41ad-b0e7-74ebf604543f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "e71bebd41946b1d815a25d06781a8481dcfda624c637b7a6b40cade1c504c304",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "3ba971e7-0b7a-4750-896f-7cf063e66b2a": [
    {
      faceName: "Blazing Firesinger",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "0bc626aff1bd3bff065768a69dda33cf3e83b43256e42e1621c447cdab6c7040",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Dwarf Bard"
      }
    },
    {
      faceName: "Seething Song",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "0bc626aff1bd3bff065768a69dda33cf3e83b43256e42e1621c447cdab6c7040",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Add {R}{R}{R}{R}{R}.", typeLine: "Instant" }
    }
  ],
  "3bdcfae4-86c9-4d8a-bcfe-f0a928ec29db": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "9d9315d07e22892ef23f850170e2b00e2d6d9e0853578cbdeee36ee4a934395e",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "3bf47c0a-5c17-47d0-b663-becff62fbdf8": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "611cffad178ca6a78b9aac53dd52ad946f7eb7f467daee83f046623210092d73",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["W", "U", "B"] }
    }
  ],
  "3c31a957-ad1e-40cc-b3c4-2f4caa492b77": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "950db1e67fe01328aafd826dc0773ed56588331cfcb37b5245f06ad9220e793d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "3c34660c-25e3-4ff5-9b2b-5554ded2bcc3": [
    {
      faceName: "Cheerful Osteomancer",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "38f4d6ed57e2dafeeafa42477a5048c0c0c160c3c09af2f5e1991802db660318",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Orc Warlock"
      }
    },
    {
      faceName: "Raise Dead",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "38f4d6ed57e2dafeeafa42477a5048c0c0c160c3c09af2f5e1991802db660318",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Return target creature card from your graveyard to your hand.",
        typeLine: "Sorcery"
      }
    }
  ],
  "3c3cd450-f1cd-416b-9271-37d95815c089": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "150f6b7d2c62e75206757e5e7801c20bf3a86939a552175b5e7929e0e5c94c40",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Interrupt" }
    }
  ],
  "3c5136f8-1616-4463-8aa7-122cde6dcddb": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "ffe3b60a87f26e6f383c4c509386d62384020c37b0a39b1a911a38a61d74861d",
      reason: "The exact FUT scan was visually reviewed. MTGJSON originalType contains a later creature-type update; retain the printed type and preserve Oracle wording separately.",
      fields: { typeLine: "Creature — Lizard" }
    }
  ],
  "3cf0941f-1e23-4af6-a398-d2e96783ecca": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "60a3569ac92765e1cd5a0b1fdf0fe6137987f9ad5f1405799eb25243f8ea7875",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "3d170015-b125-49a6-a15e-8fd116bbcb14": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "8c8d671aa69428e750ccc070533743a9ee8533ed29abe56df071e2bcae6e3dc2",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "3ecc8d7c-c64f-4ada-b389-756728401b64": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "23256a8214a920a437fc1830e92b4b976cb40ec43f7c2736a45200ef52b0fb1c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Asp" }
    }
  ],
  "3f2004c1-8efe-407f-bf48-27b807422eea": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "bf0a3ce281b7dea5a0ff1cac2b29d54c26fb146ee0b4c9f42d339e0d34ecf37c",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "3f4ef7a1-148d-44ac-89ed-0ef379cca0c6": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "424853ebd1fa9a5e10339d5145dc8967715f6eadb396271fe3c51b11e02de387",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "3fccc7f2-b317-40c4-9b55-658d67dca843": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "8a732997f99f2ffa444ed0ea0ffc821dc0f34eec007ed8cffb2e9326961c6a84",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Target blocking creature gets +7/+7 until end of turn.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Target blocking creature gets +7/+7 until end of turn." }]
          }
        ]
      }
    }
  ],
  "3fd08a5d-0dad-4bce-86c0-dea431038859": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "a3164f16a061f73689aa0391a894b706918665988a47af7a94c10233cb3dfec8",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "Wanderlust does 1 damage to target creature’s controller during his or her upkeep.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Wanderlust does 1 damage to target creature’s controller during his or her upkeep.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "4047df9c-335c-4c1a-968d-00f40e2e7386": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "41233c746f016c02ddb8a037b905c2814e5a5050190594202c88eaace577f287",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    },
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-text-outliers.json",
      referenceSha256: "41233c746f016c02ddb8a037b905c2814e5a5050190594202c88eaace577f287",
      reason: "Exact scan shows a discretionary hyphen in the final Assem-bly; the printed Mishra’s apostrophe is also retained. U+00AD permits this break without forcing a line or changing unbroken wording. Rules and absence of flavor visually checked. Oracle wording and layout geometry remain separate.",
      fields: {
        rulesText: `Tap to add 1 colorless mana to your mana pool or give any Assembly Worker +1/+1 until end of turn.
{1}: Mishra’s Factory becomes an Assembly Worker, a 2/2 artifact creature, until end of turn. Assem­bly Worker is still considered a land as well.`,
        flavorText: ""
      }
    }
  ],
  "407650c3-9388-45c3-a599-6929c7d6e5bd": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "59783a12d7819adb75f905cf809f01330f122bca9d7f2a3bd4068746f18c25be",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "41023495-d3cb-4cb0-b95c-f717480a76a5": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "171f17881e56df4d13b91e8f1c15387992f643ad2cfb64dc468673760d31de0b",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Ogre",
        rulesText: "",
        flavorText: "The Ogre philosopher Gnerdel believed the purpose of life was to live as high on the food chain as possible. She refused to eat vegetarians, and preferred to live entirely on creatures that preyed on sentient beings."
      }
    }
  ],
  "412ceddd-2b9a-4551-a6bf-ae2830a2010a": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "1db5b654723e14b54b40ad7471672b8711afb470c143c7ad399198625a01978b",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "414d3cae-b8cf-4d53-bd6b-1aa83a828ba9": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "94b084e0917460ab0fbf2ea74791d8e0db93d60ff5ffb765755bdbb7d48a186d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Dandân" }
    }
  ],
  "42027613-d261-4ce2-8ba1-7a2480c660f8": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "a147b6203e8767acde93c2ed8e0e223f683648441b8e6732b5059ede2969824b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ali from Cairo" }
    }
  ],
  "42bc0c3f-0a52-4bdc-83da-6484bf3102f3": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "5437571de717ae14be55200bcd27d50ea64b9e3675af58b9617eb3ed77a280ca",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Djinn" }
    }
  ],
  "42dcceee-2a47-4eaa-a6a3-2931b3d50244": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "0c3cbdbd2f1610474e9872faab0a929f221f2b383b1e7c0f6c1e578700b426a1",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "43224e74-2c51-40bd-bc34-f66e990a3e33": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "870c5f8576434173ca04fa8a54569a6bd286a0740f573603d014ede095b424a3",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `When Alpine Houndmaster enters the battlefield, you may search your library for a card named Alpine Watchdog and/or a card named Igneous Cur, reveal them, put them into your hand, then shuffle your library.
Whenever Alpine Houndmaster attacks, it gets +X/+0 until end of turn, where X is the number of other attacking creatures.`,
        flavorText: "",
        typeLine: "Creature — Human Warrior",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "When Alpine Houndmaster enters the battlefield, you may search your library for a card named Alpine Watchdog and/or a card named Igneous Cur, reveal them, put them into your hand, then shuffle your library.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever Alpine Houndmaster attacks, it gets +X/+0 until end of turn, where X is the number of other attacking creatures.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "432ecd5f-966f-4403-a973-51e175a524a0": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "4abf66d63c4f9b18c63dc57b8475770ace9a8bf46d3f2c4dfd13a5ecdd777774",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `Flying
Spells your opponents cast that target Terror of the Peaks cost an additional 3 life to cast.
Whenever another creature enters the battlefield under your control, Terror of the Peaks deals damage equal to that creature’s power to any target.`,
        flavorText: "",
        typeLine: "Creature — Dragon",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "Spells your opponents cast that target Terror of the Peaks cost an additional 3 life to cast.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever another creature enters the battlefield under your control, Terror of the Peaks deals damage equal to that creature’s power to any target.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "434f2329-ea4c-41ba-ab62-857076d76442": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "3a822131b7f5f4576b82aba5e46c91cf624bccbf502c62b2b2e440289a543981",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "Your untapped creatures gain +0/+2. Attacking creatures do not get this bonus.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Your untapped creatures gain +0/+2. Attacking creatures do not get this bonus.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "438f0c61-a61d-4a9e-b21f-4e86420c7913": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "e8e0ed83ba9a861697da5ebb4dcb3873027b19edc5246dda765c0333a1f869e0",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "43a612e5-a680-4c5b-8ce7-432a86240a6c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "9fb8b9c1e07100f526f0fb5a17a79f3838bdfe4b6ecb73d61eda1df7f453f1de",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Slug" }
    }
  ],
  "44814da0-3bc8-423d-9b22-3fea123048fa": [
    {
      source: "games/magic/fixtures/accuracy/planar-printing-corrections.json",
      referenceSha256: "76320c5a339d2b736c7b65df1975c62ae47d005bd715afffc667040d52b7a121",
      reason: "Exact scan type line reviewed. MTGJSON originalType contains later creature-type errata; preserve printed subtypes and leave Oracle types unchanged.",
      fields: { typeLine: "Creature – Human Soldier Lord" }
    }
  ],
  "448e1811-fb16-4390-ac22-b7066a4a019c": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "80ecae4cddf33623a18f857e2c1e33b77faf626329fdc94278ecaf90902d6c99",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "44a31889-6a8d-450c-a73d-381a7ff28bf9": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "c0ce3ff6e26978ab2c319ba81fa13b132833d3728c34c6a57b2c59eab444d47f",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "44be2d66-359e-4cc1-9670-119cb9c7d5f5": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "6ca80d0371b67a001676b5b3e92844dd8be8fb780b53c865d851469c4888d48f",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "B", "R"] }
    }
  ],
  "44d499a9-fe7c-4a1a-9eb3-a7fd9f85ae08": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "d90eb9a2ef19e2252a42d6c3edb371c6c4556abb6f0a7f388fac80443831a36a",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Smith" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "d90eb9a2ef19e2252a42d6c3edb371c6c4556abb6f0a7f388fac80443831a36a",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "{T}: Target artifact controlled by opponent becomes tapped or untapped.",
        flavorText: '"The smith a mighty man is he/ With large and sinewy hands./ And the muscles of his brawny arms/ Are strong as iron bands." —Henry Wadsworth Longfellow, The Village Blacksmith',
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{T}: Target artifact controlled by opponent becomes tapped or un­tapped.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: '"The smith a mighty man is he/ With large and sinewy hands./ And the muscles of his brawny arms/ Are strong as iron bands."',
                italic: !0
              },
              { text: " ", italic: !0 },
              { text: "—Henry Wadsworth Longfellow, The Village Blacksmith", italic: !0 }
            ]
          }
        ]
      }
    }
  ],
  "45810c0a-0a35-4bd4-ba66-5a45f8973fa4": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "5f6df68810f771f83d26ba0143936bedb6b206166ec250fffb2fdac2bd6871c6",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "459b71d7-34c1-43b9-93ff-364f95aa4789": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "037f8a417c4bd5f8f4bb9283f8c856bc04688002d95c145ee4a9ebcd909f0341",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "459d175e-2b9c-4f30-be03-4e05cd3c68ef": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "57400cebec2a64028a4044bb530616a9ca68fe2db057cde321c55b2fd49ab76f",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "45b1e60d-54dd-41cd-b9a2-00890725a3df": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "1d085ebe155dd74879df292a5d02a001d653c8c5093ab2ba07ac95cc69e53713",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "1d085ebe155dd74879df292a5d02a001d653c8c5093ab2ba07ac95cc69e53713",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "U", "W"] }
    }
  ],
  "46092f3f-7ef9-4967-b47b-40747a8cf37d": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "6eb176174bb44b9e230ffbffc8974f4a71405e9fdc681a2fca93f439a59120ea",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Barbarian",
        rulesText: "",
        flavorText: `"From the snowy slopes of Kaelor,
To the canyons of Bandu,
We drink and fight and feast and die
As we were born to do."
—Balduvian tavern song`
      }
    }
  ],
  "461d7c11-3a7d-42c2-bb6b-0a43779e6842": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "c4b643b947d36bb8e622af591030da8a364354000304d7ff3a5cbbf5f4572bb5",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "4644694d-52e6-4d00-8cad-748899eeea84": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "dfa81acf483b3bd3b95ab22f5ccdf817ea699bdb3a77d6017e44796e1cb260c7",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Bury target creature and put an Essence token into play under the control of that creature’s controller. Treat this token as a 1/1 white creature with flying.",
        flavorText: "Facets of life, reflections of the soul.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Bury target creature and put an Essence token into play under the control of that creature’s controller. Treat this token as a 1/1 white creature with flying.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "Facets of life, reflections of the soul.", italic: !0 }]
          }
        ]
      }
    }
  ],
  "4671fa01-4a9e-4cd9-8154-b0d45e11b702": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "4f6a6040742778c3647460cfb78968b3d0b3efad6999f829f7fd69e5824ae0e0",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "46adf48f-99d2-440e-9129-794584c1ea21": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "029b03b920dfe9d9f55abc83ede2a50ba75603c4f28f34fd0c292e46194df0b3",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "46b762a7-a774-4cb4-8ecf-dd6486a066c3": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "0ce14d2392c83e4e8f5fe76c940567ce909051fa20b3dedb48838b07ed6db3ca",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Bandits" }
    }
  ],
  "47024d6d-dc55-4c35-b2bb-1b8bb0ee4e38": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "384fcf9295aa145208e86f809c48e44d5af6aa2684db72169fba543dcd3b2449",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Unicorn",
        rulesText: "",
        flavorText: `"'Do you know, I always thought Unicorns were fabulous monsters, too? I never saw one alive before!' 'Well, now that we have seen each other,' said the Unicorn, 'if you'll believe in me, I'll believe in you.'" —Lewis Carroll`
      }
    }
  ],
  "470ca3f4-29aa-4c4c-8ff2-8cdd70c69943": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "f0154b8c82b205cfa931e4e492d40f8da81dec4cc09132a2f49b64cd941760f5",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Field of the Dead enters the battlefield tapped.
{T}: Add {C}.
Whenever Field of the Dead or another land enters the battlefield under your control, if you control seven or more lands with different names, create a 2/2 black Zombie creature token.`,
        flavorText: "",
        typeLine: "Land",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Field of the Dead enters the battlefield tapped.", italic: !1 }]
          },
          { role: "rules", runs: [{ text: "{T}: Add {C}.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever Field of the Dead or another land enters the battlefield under your control, if you control seven or more lands with different names, create a 2/2 black Zombie creature token.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "472034a2-0ba9-4876-ab7a-aa7013d603bb": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "810d7002b8790ac7a5443f7c5d526c905c4e5f083631466be5727728321b3af6",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "473d70b6-a88c-49f4-9415-19919c4468ae": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "7fec0461e63d2b1320a096996a5ab36d500398df81c627cbe06bc9f2e92e8ef9",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "7fec0461e63d2b1320a096996a5ab36d500398df81c627cbe06bc9f2e92e8ef9",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["R", "B", "B", "U"] }
    }
  ],
  "476b6a4d-cc05-4e98-8a45-a5c6582ec514": [
    {
      faceName: "Bind to Life",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "7cf2d1d1119fa4f87fbf5822db7e9806bb62639b29e52b5331299ce93bce3b10",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Mill seven cards. Then put a creature card from among them onto the battlefield.",
        typeLine: "Instant"
      }
    },
    {
      faceName: "Vastlands Scavenger",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "7cf2d1d1119fa4f87fbf5822db7e9806bb62639b29e52b5331299ce93bce3b10",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Deathtouch
This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Bear Druid"
      }
    }
  ],
  "479ccc50-2d72-4adc-901e-fbd4eef2cf92": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "81644e7dab497dbb43d02318af356f8010f40d4fb870811476ed4cfa2bb6d987",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Mummy" }
    }
  ],
  "4874388e-0227-4b89-a986-d86c14482c81": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "9d24e5ec122c697604a1d6ef47ed55d7517d3406037208ffb9f3ae6b045ec82a",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "U", "U", "B"] }
    }
  ],
  "4905e98f-0c5a-4ec7-b85b-dc2c3549d5d0": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "43dfcf4f6524714b55c48f920de69f8710803e7c7cd9d3365a6f667b09d5db7b",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Giant",
        rulesText: "",
        flavorText: "Fortunately, Hill Giants have large blind spots in which a human can easily hide. Unfortunately, these blind spots are beneath the bottoms of their feet."
      }
    }
  ],
  "490eeedb-9c03-4dc7-81fd-ae54a7932e4d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "d2f8cd26be30e94848a51485fa7a23443169f38f7210f1dd0d0e38689f2dea32",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Lord" }
    }
  ],
  "49283832-54f2-4619-b4a9-750493c93292": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "f32f2b53f74e660fd95d888635550fd7aa5e772ace2e4bc54d8435a4edb29be2",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Whenever you discard a card, exile that card from your graveyard.
{2}, {T}: Draw a card, then discard a card.
{4}, {T}, Sacrifice Bag of Holding: Return all cards exiled with Bag of Holding to their owner’s hand.`,
        flavorText: "There’s no prepared like overprepared.",
        typeLine: "Artifact",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Whenever you discard a card, exile that card from your graveyard.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [{ text: "{2}, {T}: Draw a card, then discard a card.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [
              {
                text: "{4}, {T}, Sacrifice Bag of Holding: Return all cards exiled with Bag of Holding to their owner’s hand.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "There’s no prepared like overprepared.", italic: !0 }]
          }
        ]
      }
    }
  ],
  "4945ec9e-eda7-42ad-88b7-ba14f9d95e54": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
      referenceSha256: "966c4e2bdfdb823d9873db4bc0d5ab134fe14b83dfa36311953dd9bef61d8c9f",
      reason: "Carries the eight original-field corrections and adds the scan-reviewed Serendib Efreet type and frame palette. Semantic colors remain unchanged; no name-based painter routing.",
      fields: { typeLine: "Summon Assassin" }
    }
  ],
  "4947cbf9-69dc-44e3-a22e-a6129f331f3c": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "e5f38ea693e130d8ec9f48ed362dbc9feaf9a6e939bfbe81ef4b6604b5346ee1",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "",
        flavorText: `“When traveling the Great Desert avoid wearing the scales of lizards, for the Viashino rule the sands and look poorly on the skinning of their cousins.”
—Zhalfirin Guide to the Desert`,
        rulesParagraphs: [
          {
            role: "flavor",
            runs: [
              {
                text: "“When traveling the Great Desert avoid wearing the scales of lizards, for the Viashino rule the sands and look poorly on the skinning of their cousins.”",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "—Zhalfirin Guide to the Desert", italic: !1 }],
            align: "right"
          }
        ]
      }
    }
  ],
  "497bc42d-ab81-4d84-bdf7-e3a05a7c984d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "a450bae6733b93ed95feae2e81d8ffb332c82576f80502dc1f7b8a15e505b255",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "49c07ea0-27ff-46fb-a41f-3e378c977b5d": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "ffdf2ced1abbd7e8fc10c877041db332442c08f14de61f1aaea6ae107dcbc72d",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: "Target opponent reveals their hand. You choose a noncreature, nonland card from it. That player discards that card.",
        flavorText: "Resistance is unthinkable.",
        typeLine: "Sorcery",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Target opponent reveals their hand. You choose a noncreature, nonland card from it. That player discards that card.",
                italic: !1
              }
            ]
          },
          { role: "flavor", runs: [{ text: "Resistance is unthinkable.", italic: !0 }] }
        ]
      }
    }
  ],
  "49fcf47d-0f1d-469e-a8c4-d5c97be7a1ef": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "07d13c20349fec7c6301c821add62a7838ee8b5a60ae12a61f8af0dce0fa40e4",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "4a03554a-0ee7-4106-b3e4-4bc51f48032d": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "83a377c16770d759e11ff0ec49ae8dc65d3a48e102ffee0e98452f1ec4b76f2c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "4a2e428c-dd25-484c-bbc8-2d6ce10ef42c": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "e20b901e411ec07767934184018bd45cf70ce253407c3f94ae2b9290e8afe888",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "4a433310-3fe2-4156-864d-7a6b2638340b": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "ed58c53b8ed45fbf4cc3ffaeee27f7eafc3deb17c3ca9bfe2a3bc9f646563077",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: "Search your library for up to two basic land cards, reveal those cards, and put one onto the battlefield tapped and the other into your hand. Then shuffle your library.",
        flavorText: "All seeds share a common bond, calling to each other across infinity.",
        typeLine: "Sorcery",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Search your library for up to two basic land cards, reveal those cards, and put one onto the battlefield tapped and the other into your hand. Then shuffle your library.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "All seeds share a common bond, calling to each other across infinity.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "4a77e0f1-449d-4a7d-9fa0-ba7598f7a73a": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "e7130df9819c750a72e9678925bb0da43c6528afa23127c731546344614a666e",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "4a9304e1-f403-404d-9fe9-169da75e0d62": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "6215ddbc557dc456371bd69b6418b39700e1648d1337183f9e5d9d64df7ccb0b",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `{W}, {T}: Target creature gains first strike until end of turn.
{B}, {T}: Target creature gets +1/+0 until end of turn.`,
        flavorText: `Shape this world in Zhalfir’s image.
—Shaper Guild maxim`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{W}, {T}: Target creature gains first strike until end of turn.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "{B}, {T}: Target creature gets +1/+0 until end of turn.", italic: !1 }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "Shape this world in Zhalfir’s image.", italic: !0 }]
          },
          { role: "flavor", runs: [{ text: "—Shaper Guild maxim", italic: !0 }], align: "right" }
        ]
      }
    }
  ],
  "4b659475-c8b7-493d-af63-04f34d8cc3b1": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "987887ee937e357753ed3f08abf0d0ddd33f4537c6df70386e561a0195505111",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "4b71ff49-ee0a-4065-9131-380468d62a30": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "90cd94306741cac0ba7e2bfef51659ffd4197d1ffb262db6fd519f335434977d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "4ba8493c-ae69-48d1-a050-a887ae27c83f": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations.json",
      referenceSha256: "75da43e9f7b28e6dc1cc79670ea1a37332da1af6eddfeea65b0e50b6e7a7313c",
      reason: "Scan confirms a separate attribution line. Both source feeds omit it. Partial review; original rules wording is not certified. Upstream correction: https://github.com/mtgjson/mtgjson/pull/1748",
      fields: {
        typeLine: "Summon Paladin",
        flavorText: `"Look to the north; there you will find aid and comfort."
—The Book of Tal`
      }
    }
  ],
  "4bd3014b-94bb-4a9f-92cf-239a2dcc7e97": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "bebfcad8e6e76cd864fcf61a31c9d06ad44f244315c5af389b89b9c70104dd4c",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: "Flying, first strike, lifelink, protection from Demons and from Dragons",
        flavorText: "Some angels protect the meek and innocent. Others seek out and smite evil wherever it lurks.",
        typeLine: "Creature — Angel",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Flying, first strike, lifelink, protection from Demons and from Dragons",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "Some angels protect the meek and innocent. Others seek out and smite evil wherever it lurks.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "4be2aa3b-207b-4d21-abfb-6788520c7676": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "d1a233a416d765bdf0df7296ac3fd5e8c1409a14ff5f6f6b18f93db9eba16851",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "4c7a7348-c82e-453c-975c-e5365e152a3a": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "f506e9a55afb198b60194c20e9da8479c1e0c75424f20c1dee6c9c7b55d2dd11",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "4c8e9f5c-deba-4443-bf9d-fb2be75c5418": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "d7b9abef19eaffdb380178cee6fa107fe18c3600a949286a10e56a3cb8a6136e",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Artifact Creature",
        rulesText: "",
        flavorText: `"The foot stone is connected to the ankle stone, the ankle stone is connected to the leg stone..."
—Song of the Artificer`
      }
    }
  ],
  "4d1e4241-42ef-4b51-8f9b-2ab6aca31dbb": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "23ff50884bb433e5df5cda5bfb91a4135649b5d5e2d311590c48f484bb79a41e",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "4d3dce0f-2168-4f63-b2f9-156a11beeea7": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "6a925116cf7af2180a174716a658c5b02f5d0b9fe0cd11339b6452149c35a261",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon King" }
    }
  ],
  "4d71a210-eb2c-4bcc-ae3b-f60a6fb615cb": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "b4b643fef8b10b6e3dbd19a51f5ce3578a3cbed86a5331ccdeba6449b92e4fb8",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "{T}: Look at target player's hand.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "{T}: Look at target player's hand." }] }
        ]
      }
    }
  ],
  "4da892c5-071f-416f-9e42-c4bff102eb88": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "a19be996ca1c9b0390559f32efcea1e69a317139a5329dfdc7547861c34c1cb3",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "4e04a1b9-c561-4e34-86d9-129ea0346631": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "34f06f367876a0c8282a072f19609a53d8c098621fc33d82310325205856160d",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Night Stalker" }
    }
  ],
  "4e446e90-6e31-43ed-bcb1-a01422b503c0": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "4b073f1d83500d656578b6dc2147c781c259426bd25f97cfa5683e92466335cf",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Vigilance
Hydra spells you cast cost {4} less to cast.
Whenever a creature you control becomes the target of a spell, Gargos, Vicious Watcher fights up to one target creature you don’t control.`,
        flavorText: "",
        typeLine: "Legendary Creature — Hydra",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Vigilance", italic: !1 }] },
          {
            role: "rules",
            runs: [{ text: "Hydra spells you cast cost {4} less to cast.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever a creature you control becomes the target of a spell, Gargos, Vicious Watcher fights up to one target creature you don’t control.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "4e68b3bd-996e-4383-b134-f529bcb768de": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "30312f244e93499ef6ca44089bde5a7a42d1227768a6c64e251f090a5dcab6a4",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Trample (This creature can deal excess combat damage to the player or planeswalker it’s attacking.)
Other creatures you control have trample.`,
        flavorText: `“Approach from behind. That way, if it does charge, at least you aren’t in front of it.”
—Vivien Reid`,
        typeLine: "Creature — Elephant",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Trample ", italic: !1 },
              {
                text: "(This creature can deal excess combat damage to the player or planeswalker it’s attacking.)",
                italic: !0
              }
            ]
          },
          {
            role: "rules",
            runs: [{ text: "Other creatures you control have trample.", italic: !1 }]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“Approach from behind. That way, if it does charge, at least you aren’t in front of it.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Vivien Reid", italic: !0 }] }
        ]
      }
    }
  ],
  "4e6bf56e-2d74-4e4d-a667-885853979377": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "648549b2e019b155af2ced4694a505dbc4a81fc6cede363d2d2420385e52a333",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Master" }
    }
  ],
  "4e9df135-4449-42ff-868b-56b1f702aca6": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "3bd6790f33f69c97374d13a5c21ddc0da7a0f078fe976c859836fe53376b49a2",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "R", "G"] }
    }
  ],
  "4eb883b7-da6a-45c3-9dde-61334a0ddcae": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "5c75343ac6ba9175beefb3cd80e1834d6155c095a2bc055634d9d66435986e9a",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `{B}: Regenerate Darkling Stalker.
{B}: Darkling Stalker gets +1/+1 until end of turn.`,
        flavorText: `“In this dark place, yes, I am afraid of my own shadow.”
—Mirri of the Weatherlight`,
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "{B}: Regenerate Darkling Stalker.", italic: !1 }] },
          {
            role: "rules",
            runs: [{ text: "{B}: Darkling Stalker gets +1/+1 until end of turn.", italic: !1 }]
          },
          {
            role: "flavor",
            runs: [
              { text: "“In this dark place, yes, I am afraid of my own shadow.”", italic: !0 }
            ]
          },
          {
            role: "flavor",
            runs: [
              { text: "—Mirri of the ", italic: !0 },
              { text: "Weatherlight", italic: !1 }
            ],
            align: "right"
          }
        ]
      }
    }
  ],
  "4ecb1362-9a67-4d4c-8d69-9ac2ebf4d0b0": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "810afc15471791de49487f205f05e3c5af7c60a87bd01fd2d18d1d65d4054397",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "810afc15471791de49487f205f05e3c5af7c60a87bd01fd2d18d1d65d4054397",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "You gain 1 life point each time one of opponent's mountains becomes tapped.",
        flavorText: '"Foolish wizard! As you tap the power of your lofty keep, so grows my strength." —Malvern Xelionos, Letters',
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "You gain 1 life point each time one of opponent's mountains becomes tapped.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: '"Foolish wizard! As you tap the power of your lofty keep, so grows my strength."',
                italic: !0
              },
              { text: " ", italic: !0 },
              { text: "—Malvern Xelionos, ", italic: !0 },
              { text: "Letters", italic: !1 }
            ]
          }
        ]
      }
    }
  ],
  "4ecbca71-9a1d-44c5-b709-d6f565941d5e": [
    {
      faceName: "All Aboard",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "801b0024be476765362050edee1e2065015998d272ca1c6434649f7d4998bd76",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Exile target non-Pilot creature you control, then return that card to the battlefield under its owner's control.",
        typeLine: "Instant"
      }
    },
    {
      faceName: "Skycoach Conductor",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "801b0024be476765362050edee1e2065015998d272ca1c6434649f7d4998bd76",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Flash
Flying, vigilance
This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Bird Pilot"
      }
    }
  ],
  "4eef9bb7-cd3c-422e-a93b-90d98684675a": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "f347caf95cced14e269c84296a327eeeeb15e9769b70025d92154304e61c76ee",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Hunter" }
    }
  ],
  "4f2da99f-3c53-4980-97d6-2158c765aac0": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "71f11dd16a3d36d1fb746433099d21e729e21e65ad40706b0e8fdbcf64439d49",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Sacrifice a creature: Target player puts a number of cards equal to that creature’s power from the top of his or her library into his or her graveyard.",
        flavorText: `“It is not that you will go mad. It is that you will beg for madness.”
—Volrath`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Sacrifice a creature: Target player puts a number of cards equal to that creature’s power from the top of his or her library into his or her graveyard.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“It is not that you will go mad. It is that you will beg for madness.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Volrath", italic: !0 }], align: "right" }
        ]
      }
    }
  ],
  "50052f9a-d667-4a96-a9b1-b4169ee495e6": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "c11b2409a8bb88f3e1b0552027d77fd76a41cd1ab14281e885858c19be28c9a1",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "502beb90-c562-470a-9315-bc1a1b11ea9c": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "80d2226a091cc5252739e896474522aeaa545b67e9b9207a6d99d34521742bae",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Soldier",
        rulesText: "",
        flavorText: "The turning of the tide always begins with one soldier's decision to head back into the fray."
      }
    }
  ],
  "502d77d6-c5c9-4def-80cb-7905fbbdefcb": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "0a34077b2c2c4f26bdf01c19fa3f036cd27a4906de37a7f17377472281157ddc",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "503256f8-3aab-49d0-b78b-6502aa29ce52": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "182e88d5a2a579a196035a43d59c7639eec1f7d45bab7222533d59a7cefd5696",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "182e88d5a2a579a196035a43d59c7639eec1f7d45bab7222533d59a7cefd5696",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: `Put seven counters on Rasputin when brought into play. You may remove a counter to prevent one damage to Rasputin or add {1} to your mana pool. This ability is played as an interrupt.
Put one counter on Rasputin during your upkeep if he started the turn untapped. You may not have more than seven of these counters on Rasputin at any time.`,
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Put seven counters on Rasputin when brought into play. You may remove a counter to prevent one damage to Rasputin or add {1} to your mana pool. This ability is played as an interrupt.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "Put one counter on Rasputin during your upkeep if he started the turn untapped. You may not have more than seven of these counters on Rasputin at any time.",
                italic: !1
              }
            ]
          }
        ]
      }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "182e88d5a2a579a196035a43d59c7639eec1f7d45bab7222533d59a7cefd5696",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "W", "U"] }
    }
  ],
  "5149ffff-d38f-458e-bcfa-a4b6b332a0b4": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "ba68e3eda4c73789a90b39a0537c3cf32ffa1c849795197bb25412c31aeafd8a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Poltergeist" }
    }
  ],
  "5159a2cd-036c-482e-9b5a-b595391deef3": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "3676f1c853c46342b95619f0842866b6372d8b3e5c609126eda1a65544247400",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "515eff31-24f6-462e-bbd4-b49540421a75": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "9c35ebc491b51e996018ae41aad97697af9ce74e8a328a1091a6221b5ea60cdf",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "51662253-789f-4a02-9937-688e36775024": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "7fc6ff2a64316a8655141b9e30c741f53e82224f0c577331d3231a33e0a21b5b",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "516858c9-7679-4a65-a787-36a2cf175ede": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
      referenceSha256: "0689a18083356522396512857320ed478b84f9dd0af12e6fa47fe7b3891658a2",
      reason: "Carries the eight original-field corrections and adds the scan-reviewed Serendib Efreet type and frame palette. Semantic colors remain unchanged; no name-based painter routing.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "51f30a3d-1421-4706-b17f-39a9ec7a0d8b": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "3b81c834c0477d3053ba8ac94e73ceaaf007663003b6da0d7b9d20ef5ebe7daa",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Flanking (Whenever a creature without flanking is assigned to block this creature, the blocking creature gets -1/-1 until end of turn.)",
        flavorText: `“All animals—even humans—can be herded. The trick is to make them think they choose their own destination.”
—Mangara`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Flanking ", italic: !1 },
              {
                text: "(Whenever a creature without flanking is assigned to block this creature, the blocking creature gets -1/-1 until end of turn.)",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“All animals—even humans—can be herded. The trick is to make them think they choose their own destination.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Mangara", italic: !0 }], align: "right" }
        ]
      }
    }
  ],
  "51f8f6e1-a451-4262-90d3-5107caf54175": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "bde2e2232f974fe0d22d7ebebf40c7cd7b33a8632fbe3b114a61374b172fb15a",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "520db5fb-d961-45a3-af74-6f054b8be3ab": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "50f0575837ed0525d8587e51c94c4afb18777c1b83d93fcb36d7097390b62cc3",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "52ff493a-6336-416e-af5e-1eb6d10c080e": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "312b8b0d78253e180ef5b5a06419ac204e4c5a3374c8e9e5cc2b09bde9a9dea3",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "53b04dab-45b7-418b-a0f0-bcf35145fc53": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "fd409f15ade637dacb1d507e03af6c1b4c26e043e208cc685d5d65dd6bb942f0",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "53ec4a19-0f2f-4713-a869-58832484648d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "05b94544955b9d8d684e7efcc3c05743f5276bd9b71c4b362cb89461def4f55d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Shark" }
    }
  ],
  "53f54b57-9516-424a-86a3-54843efadb0c": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "8043b1e21d6ca65e1ede37236c50d31c28147c567c8689271d4719bbedfac09b",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: "Double strike (This creature deals both first-strike and regular combat damage.)",
        flavorText: "“Go find yourself a couple of friends, and bring me a blindfold. Then we might have a fair fight.”",
        typeLine: "Creature — Human Soldier",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Double strike ", italic: !1 },
              {
                text: "(This creature deals both first-strike and regular combat damage.)",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“Go find yourself a couple of friends, and bring me a blindfold. Then we might have a fair fight.”",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "544a7138-eae8-4ff9-9e17-680bfa717183": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "651f25dfb127c8f82b5ffc151cc8fbfd55723d2f87ef83e645ec2149d063e1de",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "54c5c65a-a444-4e0f-ae44-a3722cdd32a1": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "8cf7899655df840dbb9c649bcdddd4ef498154184f5c39f788243dd8291fb47b",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "54fbbf39-cd52-474a-908e-b7a78cb5eb5b": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "404354e697ade9514057c6becfd33c5facf4cdcae729bf307ade3ae08417a0fe",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: "{R}: Goblin Bird-Grabber gains flying until end of turn. Activate this ability only if you control a creature with flying.",
        flavorText: "“I opens my mouth to catches the bugs!”",
        typeLine: "Creature — Goblin",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{R}: Goblin Bird-Grabber gains flying until end of turn. Activate this ability only if you control a creature with flying.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "“I opens my mouth to catches the bugs!”", italic: !0 }]
          }
        ]
      }
    }
  ],
  "55368e1d-2573-4779-ad7c-027071380447": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "360631291f6c5d1a27ee4cd3070a0efc4ed5c7b19dd4c76117dece2bee2c4ae6",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Elemental",
        rulesText: "",
        flavorText: "Unpredictable as the sea itself, Water Elementals shift without warning from tranquility to tempest. Capricious and fickle, they flow restlessly from one shape to another, expressing their moods with their physical forms."
      }
    }
  ],
  "5542d236-af43-43b8-b30f-8980d74bbdd0": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "18d378041194ec8ce6975a19c5cc8527cf97d26d503b6006f6591542a6b51b9d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Goblins" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "18d378041194ec8ce6975a19c5cc8527cf97d26d503b6006f6591542a6b51b9d",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["G", "R"] }
    }
  ],
  "559d3329-9053-4301-b867-1b49c248fe31": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "a875da413e2f7719c01d3dd8b915440e70c1755f7cb7c40ae0097e21d36a9ba8",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "55da1e86-fe18-486a-b510-f941e6f6e378": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "2b86f92ec0dd17582b0109b5217e6046ea08d0b9e6603dac79bfbc5819ba0119",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    }
  ],
  "56058359-3c0b-49db-a0ce-9ded4c3f4372": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "00a913ce17d02cdb19c48d3c7acbea5bb326c3fceebc181c90818dd8272e67db",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "56355ff3-2232-4a11-b868-aec9a50b9ee5": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "b5d324cec7a946da68fb4f69549ac1dfdfba6f2fba0b7f66661635b1dcb0124b",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "564e0ccd-decb-48d2-981f-cefa8045340f": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "46ce578db9202a568cde1e86511fb88939cf622fdeea1551024531ea6e9d0ac9",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Sisters" }
    }
  ],
  "5670c4c0-b8c3-4100-8cd9-c176b29fe01c": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "5c9ba7d887c00a7906929e8b599304eb1e52405cf0f61ed959d605c65dd6c275",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "All white creatures gain +1/+1.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "All white creatures gain +1/+1.", italic: !1 }] }
        ]
      }
    }
  ],
  "5697b2e7-25c5-4ae0-a9ac-48cbc6a94c15": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "607b2ac5c164961c52e228ea2f2b80c95082b667138dcc2251f4a83b87991df2",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "{G}: Regenerate target creature Regeneration enchants.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "{G}: Regenerate target creature Regeneration enchants." }]
          }
        ]
      }
    }
  ],
  "56cb88db-2c6b-4d17-be16-2a89218efe4c": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations.json",
      referenceSha256: "6257f1861244dfa5f901bb310291eeff8727cd29b0715931856352f7adb03093",
      reason: "Printed type verified directly in the cached scan. MTGJSON originalType is modernized for this exact printing; do not infer historical subtype from Oracle.",
      fields: { typeLine: "Summon Force" }
    }
  ],
  "5712e87a-2381-4f5b-a853-6973841f9bf1": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "5762fc3343ea8245b7e52e27f80b3ed5f9acd3928364db7c0e34a76d000ea4dd",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Faeries" }
    }
  ],
  "5722c349-bf3d-4ac0-8fdd-bf170401c419": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "373ec183ba251a04e3bd5047f02a81b0af25212b6a606fb81a1b288133e0e764",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "All enchantments in play must be discarded.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "All enchantments in play must be discarded.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "57264bd9-94f6-4d4d-baff-2b2900585635": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "ee439b24d0171d0d9bc091e7bfeb2d26c61025a744b00d29ac1d2f3d752e4b1d",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "ee439b24d0171d0d9bc091e7bfeb2d26c61025a744b00d29ac1d2f3d752e4b1d",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["W", "U", "G"] }
    }
  ],
  "5786de12-cade-43c2-a6b0-0c5b294b9d0e": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "56dacd80833060aed7d2aa10db9c3681a6b1a2ec10c19a8fde69521ff0890a19",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "5804dcd3-d41d-4cbd-9f8f-9736f2d37a64": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "10ce805c42ae0bb21928f5e8e42d5c4152c6765b61879805742605e7518e6b06",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "583a53af-2e2a-4f3f-8eab-bd874c6ed80a": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "9537a0a5a92db0ab4cda2fe65d29b171810d413d088ab6d657e470efb4273105",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "586a1d9f-59ae-41a7-8de7-d6c4553ea79e": [
    {
      source: "games/magic/fixtures/accuracy/planar-printing-corrections.json",
      referenceSha256: "8ac7772f19124e34e5731bfa17ae3110171e0cff41404801ebb286c6e98a7151",
      reason: "The exact scan includes an em dash after Choose one; cached MTGJSON originalText omits it. Restore the scan-reviewed rules sentence, retaining the original semicolon-separated choices. Oracle wording and unrelated printing fields remain unchanged.",
      fields: {
        rulesText: "Choose one — Target creature gains islandwalk until end of turn; or target creature gets +2/-1 until end of turn; or target player discards a card."
      }
    }
  ],
  "587075f3-a568-4089-83ca-fe1e473c025d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "d3d473b097fcadd3feb3bec507078b70911c227e305b8f5c08e2a503cffd985f",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "d3d473b097fcadd3feb3bec507078b70911c227e305b8f5c08e2a503cffd985f",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "G", "R"] }
    }
  ],
  "587d6ac8-fad8-49e0-862e-636e06628ff9": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "1b40bebd41ea9c324a66a55c1ddb7e137ad93904e20a899c900ab68e108268f9",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Artifact" }
    }
  ],
  "58ab11d1-5536-4a4d-a324-bce236358f58": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "40cc942c18787e660601cef60e9764953356146fe475e7bac12e53991f3c62be",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["5", "U", "B"] }
    }
  ],
  "58d5b9fe-b66a-48c9-94c4-db783e605f37": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "22b60b646f6a47f297f9e340cf4545bc9bbea81aebcf79a4b706f8521eb58c5a",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "58d74d1d-3f68-4cab-903e-e146a33258f3": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "b1c23aa592894b39f0eed7d3f2a07a7f6c2e620740087e18a4fb5692b881a159",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "59145073-2cfd-4153-a6d8-47ad42e739c3": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "812442110c882bbb3f6307437bcabd79120efd6e9953ce7dc5efc206a10c0a7d",
      reason: "Restore the activation colon omitted by MTGJSON originalText. Rules and flavor otherwise retain the captured source.",
      fields: {
        rulesText: "{B}: Regenerates.",
        flavorText: "Bones scattered around us joined to form misshapen bodies. We struck at them repeatedly—they fell, but soon formed again, with the same mocking look on their faceless skulls.",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "{B}: Regenerates.", italic: !1 }] },
          {
            role: "flavor",
            runs: [
              {
                text: "Bones scattered around us joined to form misshapen bodies. We struck at them repeatedly—they fell, but soon formed again, with the same mocking look on their faceless skulls.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "59cc9bdb-7cf2-4795-bac7-ffff605c9eb0": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "652c0267d9edc03c8c8ab5995ad5bcfda56532301d4d49f71e4324007e3cac65",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "59fa8e8d-bcb8-47bf-b71a-df11c8d0f2c9": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "d15f1988194994f7ee9ab915f4b3f631ca50481da1fb66060a739b2a531b5de5",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: "Shock deals 2 damage to any target.",
        flavorText: `“The beauty of it is they never see it coming. Ever.”
—Razzix, sparkmage`,
        typeLine: "Instant",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Shock deals 2 damage to any target.", italic: !1 }] },
          {
            role: "flavor",
            runs: [{ text: "“The beauty of it is they never see it coming. Ever.”", italic: !0 }]
          },
          { role: "flavor", runs: [{ text: "—Razzix, sparkmage", italic: !0 }] }
        ]
      }
    }
  ],
  "59fb9591-399a-4196-a52d-f2954d287a10": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "0a6cf9b1ba4498f316061df6266243cfb4690f844f0bb3c8f6bbbcddacb6781a",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "R", "G"] }
    }
  ],
  "5a240d1b-8430-4986-850d-32afa0e812b2": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "74370da5444730172de9d9a9136f04793f910548e320f9e5d6a2b87985efa025",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "5a242eb1-8625-4063-9376-a1df32547b58": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "66830b70de42f31555d8e70eb15573b7c41fc49829bd4400f8cd7f2d72d7ef95",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "5a391ada-e9e3-45db-ae84-17421ac6b44d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "6f63e37f7f651cd5e0b1d982d0de7f0567cecccc59f60813c1b223bf58a3389c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "5a5b7c5a-ee63-4a1b-9a0f-fb0a309168df": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "0cf6d6daa0c7108eb17c0cdf4578033542563aa6c93ecfa0c8e06eb0e2285abe",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "5a72cd4b-5b47-46b8-b230-4b246f97221f": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "66f15a35ee2456cafb47f9aca266122f928a90ffa9a91de07cc93a44c7ee9088",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "5ae71290-c133-406c-8b17-9ea22b437806": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "d41f80cf38c077adadf53bd45fd1503a89327a0291249e8e8c478793ed88ff76",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "5ae88c06-f28c-4fbc-a28c-5eb203a04722": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "3d62eb7a8daa92c4f7fbc619b2da034b013c713dffe6b53ebc6f0c8ae97f2cfc",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "5ba0e677-361d-4e03-9c2c-018d1c383456": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "db36cfe6aabf60b2d088b62cf74ab05e2a59a40ad11dda35312ffb3f0034793d",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "G"] }
    }
  ],
  "5c1ba0b9-db01-447f-90cc-a2fc2c24146e": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "325f9d26898da995c5cdea3502e48f9f76e2b340199280cbbe21bdc8638dc3a8",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Bird Maiden" }
    }
  ],
  "5c88391d-271f-4021-a5d9-158ebc1e6357": [
    {
      faceName: "Maelstrom Artisan",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "0513e6b697c1ca2732bbc7ec03d2104f5426d2380804976dbc7dd7ba35efe0df",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Haste
This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Minotaur Sorcerer"
      }
    },
    {
      faceName: "Rocket Volley",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "0513e6b697c1ca2732bbc7ec03d2104f5426d2380804976dbc7dd7ba35efe0df",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Destroy target nonbasic land.", typeLine: "Sorcery" }
    }
  ],
  "5c970830-95cf-4471-af28-43da635073d0": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "fbebcae99f5d0c418c4a4d8d2750977815e6b9f44c00b538a56075f4bcf52d1d",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "5cbca45f-7b08-408b-9445-e3f2b9563f1b": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "a6ef8a7236495b74c9298757a4e3399d1f754f656917af22f3587c279736831b",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Target land becomes a basic swamp.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Target land becomes a basic swamp." }] }
        ]
      }
    }
  ],
  "5cc02459-83ae-4b6c-85a1-26eeaf7a2ee7": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "aaa46312d2c5452ebbd39ce06c1a9d886339450744ce1bde87de73e1f60bf975",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "5d074af2-8dbd-42d3-87eb-30f6e7d171ff": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "1b6c81ec0077fb54fc145c43965b6ce68529f51f8265107f3f42842e8b2116f5",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legionnaire" }
    }
  ],
  "5d5aae6e-fe20-4363-9589-5a54bcbbb77e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "16934a86a5f96c4ce34c978263156f1d3bba9b251297977b663e6a2b30c0bc82",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "5d878dab-5ed2-4ef3-b2c7-472290892854": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "fe719cbc71d46629532024d71c648887ada192fbfa4281ad9e2890f251940382",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `Play with the top card of your library revealed.
You may cast Goblin spells from the top of your library.
As long as the top card of your library is a Goblin card, Conspicuous Snoop has all activated abilities of that card.`,
        flavorText: "",
        typeLine: "Creature — Goblin Rogue",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Play with the top card of your library revealed.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [
              { text: "You may cast Goblin spells from the top of your library.", italic: !1 }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "As long as the top card of your library is a Goblin card, Conspicuous Snoop has all activated abilities of that card.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "5e236816-0c49-4b48-b18b-03add5a80d72": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "2a8b17ce6e202cb530e7d3d15211adf1668bc6d6b36e35a35f8b1934c5381113",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "5e2d35f8-3cf6-4843-9030-0e9a885d836c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "cd183819c8c88d8d398da0d02039000efcbc13fc3e4b8158d1362a17be0f689f",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "5e34fc6b-5f00-4a22-9ee2-afc1caf99961": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "60f309f9bbfeee404a9b109497c9ef88d3e1153978bf4abc1cb388f949fb4491",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Orcs" }
    }
  ],
  "5e91ce41-053e-4203-8860-49cbf854cc18": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "42a90d7fb2358d293d8f75f97f0b20678f61a0b441a02868290d6b0e49bb78c2",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "5ef69d3f-cbad-4069-82dc-4dbfb35377f4": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations.json",
      referenceSha256: "0d678aa96dcc740cd91a8ed0bda2daed26d25495550698797a3ea0d3f7cb5424",
      reason: "Scan confirms a separate attribution line. Both source feeds omit it. Partial review; original rules wording is not certified. Upstream correction: https://github.com/mtgjson/mtgjson/pull/1748",
      fields: {
        typeLine: "Summon Paladin",
        flavorText: `"Look to the north; there you will find aid and comfort."
—The Book of Tal`
      }
    }
  ],
  "5ef99f07-c987-451a-b18a-2719eea654cd": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "e3540052069e188c3afca97cba87b56db003ef749bf581516fee8c69ef07eb77",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Sphinx" }
    }
  ],
  "5f133f06-6398-4db1-8577-66c16fd3e00d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "1ddcdcc44d6812160d8f6a4f7b184f3ad945a5aeea0388649fd3a315747cc7e0",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "5f46783a-b91e-4829-a173-5515b09ca615": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "10e32d2005479c6642a1c109b3e3f7eb59bbf48a024489669a1f7628488ac2fa",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Efreet" }
    }
  ],
  "5f4b6507-89ee-482e-aafd-8e05ada8f1ce": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "cc18fdffccb1400f0566e6321dd1b70a22577bf8e1434cafa8aa2ae34a6207f7",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Land" }
    }
  ],
  "5f604338-5ee4-4c47-ad5a-5c805c96c8de": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "d726f46d29a911282c5b4d8188a447948390fc376a86622f15d4e8e47ce0f5a9",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Smith" }
    }
  ],
  "5fc9497a-42bf-4d78-afaf-67645514ade4": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "f5c20f78b9e87fcbf41c1625cc010a64ff44fcb09a4b23366af3122fd6efd023",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "U", "B", "R"] }
    }
  ],
  "5fd99522-4a91-4ccd-91bf-5f32a6ac3510": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "40265bc71f4dd69c0a11e8faa8152223c00b94dcdf29b888d7464daa27558d0c",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "40265bc71f4dd69c0a11e8faa8152223c00b94dcdf29b888d7464daa27558d0c",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "G", "G"] }
    }
  ],
  "601eed5c-436d-425b-a45f-07881ad893c8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "a553468b6d2c3e441e37a9dcdcc332f7956a33bf1464f3a0606bfa5c74430c5a",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Lost Soul" }
    }
  ],
  "60252226-a102-4d88-9b80-42d021b5184d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "5959c717ae1ca0cfe253ba3101f595f4dccca4f76272a0ed1e5679fc90073d48",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "5959c717ae1ca0cfe253ba3101f595f4dccca4f76272a0ed1e5679fc90073d48",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["G", "R", "B"] }
    }
  ],
  "603d1f86-2098-4af5-a038-c5a314ba7184": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "2e4043481d32205e5301b17e78222f5f7843cc2340d1e0c416fda26a21df2c70",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "Does X damage to each player and each non-flying creature in play.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Does X damage to each player and each non-flying creature in play.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "6087f146-f468-472a-b248-fc7386ea3e63": [
    {
      source: "games/magic/fixtures/accuracy/m15/annotations-walker-text.json",
      referenceSha256: "c86842d6cbeabc01f8dbef024333d952c2f3d84106d86f362d7de9611910e25f",
      reason: "Type line visually checked against the cached M15 scan. MTGJSON originalType contains the later Legendary erratum; only this field is certified.",
      fields: { typeLine: "Planeswalker — Liliana" }
    }
  ],
  "60df6592-0b3b-4b87-aeb2-8fa94b4fb7be": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "a814a2a1c23fa863add7627fa515013ca9fbf909687ece8aec4d939397c4ce00",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "61510e88-97d0-410a-9431-ebf12990e33d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "3d1be6ff0569d0340309c91e5a5be83a4b057a862e07af01a2cbbc91c894235e",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Elemental" }
    }
  ],
  "61706102-67fd-4167-bd7d-ec6da41db362": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "3448bcd0ae3735bb20b9fe4b3b1e2b78f7bab25914f20419077ab7294eaccadf",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "617208ff-dd9b-44fd-a740-d3188081e5cc": [
    {
      faceName: "Brainstorm",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "ecc884216a4663f25f8b3e3f4f3db3f4b5dfa191ea6154d8b1ec93bd364fea31",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Draw three cards, then put two cards from your hand on top of your library in any order.",
        typeLine: "Instant"
      }
    },
    {
      faceName: "Harmonized Trio",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "ecc884216a4663f25f8b3e3f4f3db3f4b5dfa191ea6154d8b1ec93bd364fea31",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "{T}, Tap two untapped creatures you control: This creature becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Merfolk Bard Wizard"
      }
    }
  ],
  "6176936d-72e2-4205-8871-4c5a4f1cb2d8": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "c71178a774f2a626318a3344a1eef542a6910253a1579caa0188262c03bff924",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "61a59775-b1cd-4ed0-8abf-c2b37f7be0d5": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "84997fea0fc97dac21449b07fd0075207d577309d07d37325406a9dd324eafc9",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Spirit" }
    }
  ],
  "61ea96b1-4428-4951-88d4-f79338955981": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "4cac15a35232739969bc94c4ae4a2745545384bff87698861ea7e6282e56381f",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "61fc30b6-1355-425b-a86f-18f59f83141c": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "8c064eac258832727d7d0f229f4e5df5e9b3b3167f954327e3e090dd7b3e3130",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Smith" }
    }
  ],
  "62a47835-5719-48c4-a740-a0c5f00dce11": [
    {
      faceName: "Quill-Blade Laureate",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "6a016455376f828490cadb4ec7a644cc162e57fda2250e930a25b0b2f5a08eee",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Double strike
This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Human Cleric"
      }
    },
    {
      faceName: "Twofold Intent",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "6a016455376f828490cadb4ec7a644cc162e57fda2250e930a25b0b2f5a08eee",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Target creature gets +1/+0 and gains double strike until end of turn.",
        typeLine: "Sorcery"
      }
    }
  ],
  "62bbff2a-5109-400a-961b-eacffb9aed67": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "8ae2bf3b50104764378866394ef6043b32cbab401abffa83f71d429fade6315f",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["U", "B", "R"] }
    }
  ],
  "62ef2f37-b8ad-47ad-89ca-d6abcb7ff21b": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "3f1df6342ef1034e1436b2ca69f65c04e33721443f8c298b2ee6cb8402f98404",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "6303233b-35eb-49ca-b844-ba6b9fe1cbd2": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations.json",
      referenceSha256: "9e9aee38f82935a57c13c75458bbba6b00999a2f2592614138eda8cb5453a117",
      reason: "Scan confirms a separate attribution line. Both source feeds omit it. Partial review; original rules wording is not certified. Upstream correction: https://github.com/mtgjson/mtgjson/pull/1748",
      fields: {
        typeLine: "Summon Paladin",
        flavorText: `"Look to the north; there you will find aid and comfort."
—The Book of Tal`
      }
    }
  ],
  "63049fe4-de25-4606-a271-4ccb1b8298f1": [
    {
      source: "games/magic/fixtures/accuracy/planar-printing-corrections.json",
      referenceSha256: "acb265653c883b159ee405efc9ec3681ee81afe02a9660ff70581dcb19ed6bbf",
      reason: "Exact scan type line reviewed. MTGJSON originalType contains later creature-type errata; preserve printed subtypes and leave Oracle types unchanged.",
      fields: { typeLine: "Legendary Creature – Human Lord" }
    }
  ],
  "634dd3bd-d29b-4481-990b-f320e60c4f91": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
      referenceSha256: "22120bb185b36482e5fb06d05f22c6a4c6c218075992d80d90099796f1ed3cee",
      reason: "Text-inset study, retaining prior reviewed wording. Adds scan-reviewed Angry Mob originalText from MTGJSON. Earlier stats studies and capture inputs remain frozen.",
      fields: {
        rulesText: "Gain 1 life each time a forest controlled by target opponent becomes tapped.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Gain 1 life each time a forest controlled by target opponent becomes tapped.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "63539181-5393-41b8-baf3-9a690d17f4ce": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "eed0f237602b44783c746a72f7e32e8660850594911129c4a3e096c877390ed6",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Elemental",
        rulesText: "",
        flavorText: "Fire Elementals are ruthless infernos, annihilating and consuming their foes in a frenzied holocaust. Crackling and blazing, they sear swift, terrible paths, leaving the land charred and scorched in their wake."
      }
    }
  ],
  "63a31de0-d764-4ff6-a85f-027e1e58d86c": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "8322c0111f32da43d79662cf0f4edac7d05ee3b572451911617e12de8028131f",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "63bacc32-d6ba-420c-9b49-299c08e5fb39": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "824f5808e30293aaeb3221cc13bd78f4b651101eb42cd59eb02cec6c091f4829",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Sacrifice Lion’s Eye Diamond, Discard your hand: Add three mana of any one color to your mana pool. Play this ability as a mana source.",
        flavorText: `Held in the lion’s eye
—Zhalfirin saying meaning “caught in the moment of crisis”`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Sacrifice Lion’s Eye Diamond, Discard your hand: Add three mana of any one color to your mana pool. Play this ability as a mana source.",
                italic: !1
              }
            ]
          },
          { role: "flavor", runs: [{ text: "Held in the lion’s eye", italic: !0 }] },
          {
            role: "flavor",
            runs: [
              { text: "—Zhalfirin saying meaning “caught in the moment of crisis”", italic: !0 }
            ],
            align: "right"
          }
        ]
      }
    }
  ],
  "63c0e240-07b0-45fb-90af-f4fce18c604e": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "a59dee8ac151911405f35f68b60bd3dbe119a8ce2f0722a41f1fb4bcc891305f",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "63de147c-2e62-41b9-8ada-93406387f08b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "b8a9b84b87bf97fba410274facf53b30d27ab5045e734954156949757bedb0f5",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Interrupt" }
    }
  ],
  "63e06cd7-9f00-4343-86c2-9f74945193c2": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
      referenceSha256: "39805bed808c0feb6162df5a077a49ae423779ef593a8a7e662f96ea5f64dd28",
      reason: "Carries the eight original-field corrections and adds the scan-reviewed Serendib Efreet type and frame palette. Semantic colors remain unchanged; no name-based painter routing.",
      fields: { typeLine: "Summon Hero" }
    }
  ],
  "640a161d-ad7b-4e5b-8f2d-d3753cb9daa3": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "930f2b4aa7b7d50418d15412116bfa2eb12a3dd0584b0bded26443dba120c570",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Faerie" }
    }
  ],
  "64164d1b-75f4-456e-a717-90ce554dc16c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "6c414bda7d3e36308e0472b4fb85f435830ffe13e60f7e54f00df350e6862004",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "643d6f5b-6a17-434d-945a-6b9a05015493": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "5086fc320d8eed290af691273234b50230bb8aa9ba7afb1c3b1020276dd786c5",
      reason: "Restore the missing activation colon; flavor begins inline after the final rules sentence, with its attribution on a new line. This expresses printed content/style, not scan-specific coordinates or soft wrapping.",
      fields: {
        rulesText: `Flying
{R}: +1/+0; if more than {R}{R}{R} is spent in this way during one turn, Dragon Whelp is killed at end of turn.`,
        flavorText: `“O to be a dragon . . . of silkworm size or immense . . .”
—Marianne Moore, “O to Be a Dragon”`,
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "{R}: +1/+0; if more than {R}{R}{R} is spent in this way during one turn, Dragon Whelp is killed at end of turn. ",
                italic: !1
              },
              {
                text: `“O to be a dragon . . . of silkworm size or immense . . .”
—Marianne Moore, “O to Be a Dragon”`,
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "64975352-8d35-4d02-94ac-fa0c6ee12409": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "f070a7c37844791dbda4ca24ad76ae90f6f70397f9c63bb9b35b9c991e68bd21",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "649a33aa-7eac-4161-ae1a-fcbc758abccf": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "333b6d71d41a09364e50795e10f93ef92740eef04ff7899cfd39137fc5f73254",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Mold Demon" }
    }
  ],
  "64bc9b1d-5818-4d9e-b771-e49af4ff9a5c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "b2315ac524b589ff4470f91f8653b2d15d32355591d431df3837f9b9a8a6e61e",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Legendary Land" }
    }
  ],
  "64c19977-ac7d-4ce7-925c-33a7503420f5": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "8c1e99b987bc03b1253f1f85a08a9d0824e1e897b66b5de52f924515bbcf91ff",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "654dd1e0-a91d-44ee-af20-c025bf360c3f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "0b97a5f33b9466130d0bfa46d897a321994413dcfd3800e7dd28ef61fef18746",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "655b6265-3030-4c68-af5b-b9e636b1a778": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "a041697d3833795e154c3d1063e785cea7e2c0c81a63ace22ba1dd4e3218b1e0",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "65947312-75c2-4baa-805c-238a154156ef": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "e98e2bc137d0a66b4262d3e6d81c24fd8f78a7d12ef69b3868d30fb9ec0ddb35",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "e98e2bc137d0a66b4262d3e6d81c24fd8f78a7d12ef69b3868d30fb9ec0ddb35",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "{2}{T}: Take a card from your library without looking at it and place it face down under Knowledge Vault. Sacrifice Knowledge Vault to discard entire hand and take the cards under the vault into your hand. If Knowledge Vault leaves play, put all cards under it in your graveyard.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{2}{T}: Take a card from your library without looking at it and place it face down under Knowledge Vault. Sacrifice Knowledge Vault to dis­card entire hand and take the cards under the vault into your hand. If Knowledge Vault leaves play, put all cards under it in your graveyard.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "65a10fd5-506e-46bf-87e6-fde134c0dc04": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "2bbd5dc36947a8b0e49d23a3177e01bbf4c0b3b89fb85c2ee8f469ce5c68d65c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon General" }
    }
  ],
  "65a97821-ca5b-46fb-af08-86de81d0daac": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "4a3dbdab926c6dc039f389a8c8bbc963cdd804f59b572670fac3df1cc1576a44",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "65eb6cda-e512-40a8-9c1f-335b713409ff": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "a1cd998430c1a7c0e13626385b14340cd983673f111b0af12b71d1de8a418de9",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "65f5efac-ef98-4be2-abcc-1aa38bf66b06": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "b9260aa5cca643078d29157c5d4d06d4731c1b69a55efdef6b8ace41b44e4e5a",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Grasslands comes into play tapped.
{T}, Sacrifice Grasslands: Search your library for a forest or plains card. Put that land into play. Shuffle your library afterwards.`,
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Grasslands comes into play tapped.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "{T}, Sacrifice Grasslands: Search your library for a forest or plains card. Put that land into play. Shuffle your library afterwards.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "664ad588-3002-4f63-93bd-38663171018f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "19e127b80c619ec92f44eae5df5bb4d2e0ad232233338932c8b1c51924a3874b",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    }
  ],
  "66641d88-b3f0-4bcd-8d2d-29aa2de69e30": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "ec044cee2971741feb29fe57ee42142e56bebc90004a01aabf91a05ffe7cc2bf",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Land" }
    }
  ],
  "66674f3a-e882-44f1-addc-d74605150c39": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations.json",
      referenceSha256: "a42398ea7c6464f06af6af9aaefb84adb00c98b709d7bc9b9a5b6211d0dc9db2",
      reason: "Rules words, activation punctuation, numeric mana disc and flavor verified against the cached scan. This body review does not certify type-line wording or artist metadata.",
      fields: {
        rulesText: "{1}{R}{R}: Brothers of Fire deals 1 damage to target creature or player and 1 damage to you.",
        flavorText: "Fire is never a gentle master.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{1}{R}{R}: Brothers of Fire deals 1 damage to target creature or player and 1 damage to you."
              }
            ]
          },
          { role: "flavor", runs: [{ text: "Fire is never a gentle master.", italic: !0 }] }
        ]
      }
    }
  ],
  "6669d96e-9a7b-4427-a477-f4e76831f593": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "594d3333231c2d63061da47e7788ab0f41eaa01204b0ea67f5fbc44a11938760",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Goblins" }
    }
  ],
  "66a74c89-6f86-4ec8-af17-391cd5026054": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "efa508b1852ca282abee90b8482f0a2746947ab37352de0021f60812e580cbaf",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "66eaa7d6-48b2-4b35-a834-790edd679e0e": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "53cbb1cf2711fd33e00f57832cc5a07cf01be68fe08bca53a8102851044a4f1f",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Banshee" }
    }
  ],
  "66f729e2-565b-4cdb-8b6f-0a14babe5680": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "b1d210b6896272664f6d7beccf082de55859935927d2b5049dee124d637db723",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Elemental",
        rulesText: "",
        flavorText: "Unpredictable as the sea itself, Water Elementals shift without warning from tranquility to tempest. Capricious and fickle, they flow restlessly from one shape to another, expressing their moods with their physical forms."
      }
    }
  ],
  "6701874e-986e-4b81-9268-90b6171e6187": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations.json",
      referenceSha256: "d0143e753b34ec47d43e86bd2b0840179af3658d564945d213bc11f7d7317966",
      reason: "Eight development scans visually reviewed. Printed wording transcribed; soft wraps are not forced. Poetry line breaks are intentional. Land targets retain semantic subtypes and require an actual historical printing policy. Expected alignment/artist are review targets, not geometry overrides. Heldouts remain unviewed.",
      fields: {
        rulesText: "Swampwalk",
        flavorText: `’Twas in the bogs of Cannelbrae
My mate did meet an early grave
’Twas nothing left for us to save
In the peat-filled bogs of Cannelbrae.`
      }
    }
  ],
  "67330004-6720-46d9-9de0-c79230110583": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "4c3a41c72023941674648bfc289c781055251842a22d10302628ec6978d204d8",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "4c3a41c72023941674648bfc289c781055251842a22d10302628ec6978d204d8",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "G", "R", "R"] }
    }
  ],
  "673c0a08-1aaf-4976-8eea-c93a9f9486fa": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "62a37ef702361bf95b00edf2272b1861d9a67106c68c3c70fd6015682c163253",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "{1}, {T}: Target creature gains banding until end of turn.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "{1}, {T}: Target creature gains banding until end of turn." }]
          }
        ]
      }
    }
  ],
  "6768a307-da2e-435e-8efd-72d82b4d4a2b": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "82cebb01ab06d7d859db6620aff756cd54646905650e19c4782fc75e2fa69b83",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "676ba521-66e4-42cf-a315-70d03cb7334e": [
    {
      faceName: "Kirol, History Buff",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "31e4c714b6cac1eb9ef96b2141764438244740530ece439103b1c9e88a3faf1f",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Whenever one or more cards leave your graveyard, Kirol becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Legendary Creature — Vampire Cleric"
      }
    },
    {
      faceName: "Pack a Punch",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "31e4c714b6cac1eb9ef96b2141764438244740530ece439103b1c9e88a3faf1f",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Mill a card. Put two +1/+1 counters on target creature. It gains trample until end of turn.",
        typeLine: "Sorcery"
      }
    }
  ],
  "6774a228-ec9e-47d0-bc43-a92f5caf8398": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "ad87695f984812c3134040b1dedd0ab9d19cd15f0ca8e68fb27515b4fb01cb9c",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "Target creature loses -2/-1.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Target creature loses -2/-1.", italic: !1 }] }
        ]
      }
    }
  ],
  "679aa578-3b31-4b07-98b3-e00777506e32": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "3dba1c34948ff47a4ad65794852b97071ccf89ba47f0e82a2ffe984d6a5ff7fb",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "67d1945d-d228-4dc3-a593-859408b2016b": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "c8cfddd1348793f6291bd3040b9f093a4e369f639fe5a394f5d7615dd091a623",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Lions",
        rulesText: "",
        flavorText: "The traditional kings of the jungle command a healthy respect in other climates as well. Relying mainly on their stealth and speed, Savannah Lions can take a victim by surprise, even in the endless flat plains of their homeland."
      }
    }
  ],
  "68271f76-eaf9-44cc-bb3d-5c56f36e9af9": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "bba348ac2e6077a725147ee59df970b2d19abcbfcc44f6696bcac97ba8fe74e9",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "68b79ee0-0a1b-474c-b68c-6e4ec69c018c": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "9d2ac51377cf6531b0da81b442559394a55d36a6e7f422db16fe9a835c5f1408",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Insect",
        rulesText: "",
        flavorText: "Toren had stepped on a lot of bugs during his life, so he couldn't help feeling embarrassed when a bug stepped on him."
      }
    }
  ],
  "6955d54f-7b37-4e43-8183-51677fb1ee11": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "996a80b05897e529196bd07c9760f0ddb9710e558159fb9cefe53a263d46643a",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Giant" }
    }
  ],
  "6a0139c2-ad86-4c71-ab6d-4840c37d5d20": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "da6d9800c6a76508e45d63b993677b8d76fde1fed532e8e0130970b8ecf6d202",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "B", "R"] }
    }
  ],
  "6a225462-947c-49d7-81b2-91f875664dca": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "dec0aebaa4cb747f5d34cca780155c7bd0ab19939165e9b1babdcfacd5543e9a",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "You may use white mana in your mana pool as either white or red mana.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "You may use white mana in your mana pool as either white or red mana." }
            ]
          }
        ]
      }
    }
  ],
  "6a4a524a-fdc7-432d-994b-953808528349": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "6506da586da1a89a7851202dc0d3e59918924e6bb893d5e92aa25f5c62be6791",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "6506da586da1a89a7851202dc0d3e59918924e6bb893d5e92aa25f5c62be6791",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "G"] }
    }
  ],
  "6a578955-7f77-42f1-a3e3-5e2b46216c43": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "9b1f94b08995d300a4efab55736a08ce21458a2f86d3c188f93f8a04fa24ce92",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "All islands in play are destroyed.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "All islands in play are destroyed.", italic: !1 }] }
        ]
      }
    }
  ],
  "6a615650-4da3-4efc-aa5e-c1f2c4f79478": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "f07dda077ccd18cb9a8c580f6c896be8620628d7aad7d441a1bc14922d4d6381",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Wall" }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-text-outliers.json",
      referenceSha256: "f07dda077ccd18cb9a8c580f6c896be8620628d7aad7d441a1bc14922d4d6381",
      reason: "Exact scan reviewed during shared text validation. The printed Summon Wall has no rules text. Cached MTGJSON originalText incorrectly supplies Defender; Oracle retains that ability. The flavor attribution starts on its own line. Soft wraps are not forced. This is wording evidence, not a per-card layout adjustment.",
      fields: {
        rulesText: "",
        flavorText: `“It had a mouth like that of a great beast, and gnashed its teeth as it strained to reach us. I am thankful it possessed no means of locomotion.”
—Vervamon the Elder`
      }
    }
  ],
  "6a63e119-3b1b-4964-a4b9-b10170ff542b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "c2b750d85b4906d6f9dc2f69727240102a68e032c968a809e8ce2245d1f79558",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "6a6a6f50-7b86-461e-80a7-e35d0e7cf52f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "8fff9a3e7c22bb7d57601bbc4d6b2f436e2d03d3c6c7b49f103f63a268c1dd24",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Bats" }
    }
  ],
  "6a6c0a27-d410-4ded-a842-70e1656ea21e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "e918db8e63621cbc71fdaaf2761fd74ad588063950c20cf9917703db7315bbb7",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    }
  ],
  "6aba1f0f-73b0-4898-8d07-43322e43d74e": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "beaf6c88162770f4fbe689eb7029b79cc69dbbeaf0a4f52150ee55c745237ea9",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "6b26ee7b-de1a-4a39-9580-89941c3d0f21": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "e08a63c9767af08422c68351398ac87ecd5854d6878a0ca1ebc2ac27cab5a2a9",
      reason: "The full-art creature has no rules or flavor box. The exact scan was visually reviewed; missing originalText is not treated as empty for unrelated printings.",
      fields: { rulesText: "" }
    }
  ],
  "6bec436c-2869-432a-b3cf-633a58af6d4c": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "7d47e27aeb826f6ef591a233ad5b1b1ff43b343d8354abe526037dabd2444d6d",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "6c36ac7d-2ff0-4350-9b10-968f94b19842": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
      referenceSha256: "7cc44be1fcb37f1b463d40028a321d4ef44e94c1f801ed676e8fcab07668a802",
      reason: "Carries the eight original-field corrections and adds the scan-reviewed Serendib Efreet type and frame palette. Semantic colors remain unchanged; no name-based painter routing.",
      fields: { typeLine: "Summon Gaea’s Liege" }
    }
  ],
  "6c6df9db-0a46-40a5-ae9d-59f47dae9056": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "f43d43be60295e516fad4cf055a3cfac3d7460cea18a5ece94fbf3b4c389e495",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "6caeadf8-1b40-497d-be7c-667fbb98f848": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "b68c31548f931663364088ccbdcfdc20d03001b7e5ce0db464d52725637b3e3b",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Summon Dwarves" }
    }
  ],
  "6cbe576f-03d5-4d22-947a-187d9e20425d": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "aacd79a89f73e86560de318137f467a5b47a09b9cc85334ac6bc185bf645fff2",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Zombies",
        rulesText: "",
        flavorText: '"They groaned, they stirred, they all uprose,/ Nor spake, nor moved their eyes;/ It had been strange, even in a dream,/ To have seen those dead men rise."/ —Samuel Coleridge, "The Rime of the Ancient Mariner"'
      }
    }
  ],
  "6d42d3dd-29df-44a1-89b8-994761eda77d": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "82407598391f19ee18d946d6fd94fe8a1a12e48b9a7e358be2f60dd75dda303c",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `Hexproof (This creature can’t be the target of spells or abilities your opponents control.)
Whenever Spined Megalodon attacks, scry 1. (Look at the top card of your library. You may put that card on the bottom of your library.)`,
        flavorText: "",
        typeLine: "Creature — Shark",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Hexproof ", italic: !1 },
              {
                text: "(This creature can’t be the target of spells or abilities your opponents control.)",
                italic: !0
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "Whenever Spined Megalodon attacks, scry 1. ", italic: !1 },
              {
                text: "(Look at the top card of your library. You may put that card on the bottom of your library.)",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "6d4c853e-2231-4af2-bcb0-1781c18ec3be": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "f61c4848f949bef04a469dbba7c58a49b3df41bba59f6e22d7b1254f97586a53",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "6d528ffd-89b3-44ee-a370-e4b53d6604be": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
      referenceSha256: "6971b2c592ba6df637f969ffef88970e27f04ec403d720fafece4f8adc1f162c",
      reason: "Carries the eight original-field corrections and adds the scan-reviewed Serendib Efreet type and frame palette. Semantic colors remain unchanged; no name-based painter routing.",
      fields: { typeLine: "Summon Doppelganger", power: "*", toughness: "*" }
    }
  ],
  "6d7a2718-301f-4191-b348-0c44c7c07d43": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "96ca6296b70c03e5aa0d3dac695045c061161cdf181368d04c1b871928f11c87",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "6da4fb5a-0d24-4bee-b3f5-535ba9fe6850": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "992f3215cadaf5d42f773ca03335f6ac141dab5d7dac14ed2bed7569b643c519",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "6daf1aab-1e58-4a5a-bc66-cb3f7c86e0e8": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "68b69b7d6e492516dd960c3506df47532438f0ea49d28d7a18f9cec04407ae0c",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Unicorn",
        rulesText: "",
        flavorText: `"'Do you know, I always thought Unicorns were fabulous monsters, too? I never saw one alive before!' 'Well, now that we have seen each other,' said the Unicorn, 'if you'll believe in me, I'll believe in you.'" —Lewis Carroll`
      }
    }
  ],
  "6e6cfaae-ea9e-4c54-858e-381f8bf441a9": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "65a516bda02fa7896ba00c0c37b11e7caa1ae757abbdc93fb74b040abca5711d",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Treefolk",
        rulesText: "",
        flavorText: "The mating habits of Treefolk, particularly the stalwart Ironroot Treefolk, are truly absurd. Molasses comes to mind. It's amazing the species can survive at all given such protracted periods of mate selection, conjugation, and gestation."
      }
    }
  ],
  "6e81e219-c840-4844-be87-0449ab0fa645": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "2fa6f8c55fd3ed91fae25131043ccad8a1a7750394bc228a5ad4c3f6829828e6",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Goblins",
        rulesText: "",
        flavorText: "The intricate dynamics of Rundvelt Goblin affairs are often confused with anarchy. The chaos, however, is the chaos of a thundercloud, and direction will sporadically and violently appear. Pashalik Mons and his raiders are the thunderhead that leads in the storm."
      }
    }
  ],
  "6e8a6e04-ce3b-4025-92ba-8980022b8038": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "92b4816ac9fe9a3953e8a887b41f265a04f6df8b5da3d299dd031ad05b0dde63",
      reason: "The original scan prints Tribal Enchantment — Rebel Aura. MTGJSON originalType contains the later Kindred rename.",
      fields: { typeLine: "Tribal Enchantment — Rebel Aura" }
    }
  ],
  "6eab6765-eba3-4844-81ca-ae37a6e903df": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "89d6a5ba0384550a3356e3ab4b1b39ded214aff10f7b40f848ae0cf99ddc5c43",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "6eafa00b-c628-40f6-86eb-88e1361fc7a0": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "b993cad837a0e40fb8df6e57ad9bd4eafe8fa5789c2761d1512b6b399c75f56a",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "6ed61426-e652-4b48-b936-8be9b6b57731": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "f607895d813a40bbc28973550f6334cbdea1be3a30e19535f56608445362acb6",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: "{T}: Put a +1/+1 counter on each artifact creature you control.",
        flavorText: `“The world is already run by all manner of machines. One day, they’ll remind us of that fact.”
—Sargis Haz, artificer`,
        typeLine: "Artifact Creature — Construct",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{T}: Put a +1/+1 counter on each artifact creature you control.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“The world is already run by all manner of machines. One day, they’ll remind us of that fact.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Sargis Haz, artificer", italic: !0 }] }
        ]
      }
    }
  ],
  "6f1c8cb0-38eb-408b-94e8-16db83999b3b": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "2299a4194812a709b5d627fe450db20f36fb0bdb83ebe398bd0127147e1241a9",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "6f38565e-88b9-433d-b0e9-a3b9734f183f": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "4cac3e30a68bb6340362078a7b8ff00736618c8f80f2b0b082bf611c66a191cc",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "6f3c2902-e2c5-4618-9d4e-3fca34b610c8": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "78d4d468fee60a9b68459dcad6c43ed81c246970fd46fda52d1685606b82d6ee",
      reason: "Printed body reviewed against this cached scan. Type line and historic glyph shape remain separate.",
      fields: {
        rulesText: "Bring one creature from your graveyard to your hand.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Bring one creature from your graveyard to your hand.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "6f75946b-1690-43cc-993c-d4e451a1a41c": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "9285b655ea207c65add750b049f2da2518f461363eb212a24437361791d728a8",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "6f7a41cc-277a-4d95-a30c-91bf5aa7ac11": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
      referenceSha256: "982661e68c61561817870513b621b16eb93e5600b74e6fbf9ee75cd746a8ee17",
      reason: "Text-inset study, retaining prior reviewed wording. Adds scan-reviewed Angry Mob originalText from MTGJSON. Earlier stats studies and capture inputs remain frozen.",
      fields: {
        rulesText: "{T}: Add one mana to your mana pool. This mana may be of any type that any land opponent controls can produce. Play this ability as an interrupt.",
        flavorText: `“What do you have that I cannot obtain?”
—Mairsil, called the Pretender`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{T}: Add one mana to your mana pool. This mana may be of any type that any land opponent controls can produce. Play this ability as an interrupt.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "“What do you have that I cannot obtain?”", italic: !0 }]
          },
          { role: "flavor", runs: [{ text: "—Mairsil, called the Pretender", italic: !0 }] }
        ]
      }
    }
  ],
  "6f8f11b5-3ba8-4913-b76a-fb469a74864d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "763e353659f17997b64348b60b5967145ef78903e24e6d6b5a76d2ec65fbfa46",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "6fb10552-dd47-4f8a-ac7c-8c2b61e56736": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "e86cd747340011575a6538be41191f9a3a1547e187cbaee973f9391ae6054acb",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "700f53d3-0a84-4c55-8495-786f0f0783db": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "c85b70e26b12155549b818671f17ad2e4bb385e41ecb6529fa25e480ad21b658",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "7011356e-7516-4ca0-ac54-d30af7ce03a2": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "3887966e074ebc6f7b9353795c9b21ee0e2ae7f6e8f62a6fdb86c7a125f65e9b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Slug" }
    }
  ],
  "707dadf0-735f-445d-9240-e49660913314": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "5d4ecde0a8bda32403383ed5333e1fee83653f4bbccdbe80c6d237ec06ce77f3",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Giant" }
    }
  ],
  "709532d8-cd3e-4844-b580-e6925ce837ff": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "6d5845bb324d766fe0f5541243ea86ad8326b52c3a39491a7962ea7eff2b2f71",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Bird Maiden" }
    }
  ],
  "70d6c02e-0f48-4fb0-94f3-1fc92ee1814f": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "d7103f428d4c4deb4e9b18c88bafcebda8a881c9fb6a1b8d99b7c7c3ec869f40",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "70e64028-ae96-4950-aa6c-9d347409fad3": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "f7b589fa2bb244f51494244417f245d377b679622d8806fbb048f4725baed98e",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Interrupt" }
    }
  ],
  "711f4cff-0256-44b2-a2fe-1cae6e9edb2b": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "92474769384e05d8e785ac2117bfe3519e5dfe4db564ea75ac1d7b2bbf82e13f",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Energy Bolt deals X damage to target player, or target player gains X life.",
        flavorText: "Life and death are two faces of the same coin.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Energy Bolt deals X damage to target player, or target player gains X life.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "Life and death are two faces of the same coin.", italic: !0 }]
          }
        ]
      }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "92474769384e05d8e785ac2117bfe3519e5dfe4db564ea75ac1d7b2bbf82e13f",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["X", "R", "W"] }
    }
  ],
  "7120e71b-2976-451b-89a7-a1665dc6fb6b": [
    {
      faceName: "Deep Sight",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "4666af8e150a83813424eafd5259a2be5934edb17643541b42241f10c8e92be3",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks. Landfall uses italic lettering; the full-scan review also records that style explicitly.",
      fields: { rulesText: "You draw a card and gain 1 life.", typeLine: "Sorcery" }
    },
    {
      faceName: "Tam, Observant Sequencer",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "4666af8e150a83813424eafd5259a2be5934edb17643541b42241f10c8e92be3",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks. Landfall uses italic lettering; the full-scan review also records that style explicitly.",
      fields: {
        rulesText: "Landfall — Whenever a land you control enters, Tam becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Legendary Creature — Gorgon Wizard"
      }
    },
    {
      faceName: "Tam, Observant Sequencer",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "4666af8e150a83813424eafd5259a2be5934edb17643541b42241f10c8e92be3",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks. Landfall uses italic lettering; the full-scan review also records that style explicitly.",
      paragraphScope: "rules-only",
      fields: {
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Landfall", italic: !0 },
              {
                text: " — Whenever a land you control enters, Tam becomes prepared. ",
                italic: !1
              },
              {
                text: "(While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "712dc7d6-5543-49fd-bafa-5ffb6c2bb0ce": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "11849b244eb1b825a3569e6b91ad3fbc00527137c97a2df09503c63b6761774b",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "7135a569-e5d3-4a1f-924b-bdb86926b4e1": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-missing-rules.json",
      referenceSha256: "f6f68a3f62906afa4a521b975d869cb7eff0a0a1629002b33eec549e9850ec9a",
      reason: "Rules and flavor visually transcribed from this exact scan because the printing has no matched MTGJSON originalText. Symbols use semantic tokens; soft line wrapping is not forced. Squire retains verse and attribution breaks. Type line, typography and other fields remain separate reviews.",
      fields: {
        rulesText: "",
        flavorText: "They attacked in an orgy of rage and madness, but only one seemed as focused on killing us as on the sheer joy of battle."
      }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "f6f68a3f62906afa4a521b975d869cb7eff0a0a1629002b33eec549e9850ec9a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Goblin" }
    }
  ],
  "71504078-a16f-4dc4-9626-0ecc42b1e93b": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "e811bc0e5d82d6dd68f969fdaaa39e11edf421da6cd678d07e371060dcf56d90",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "717f6d10-9144-4ade-9ac6-a481cc66b875": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "d495f70d9b1a17094ad75b3f18a946541d1b9984ccb70578f33a24d182f71c26",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "71a4860a-8bb6-45c0-b00a-b4a42da33ab9": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "42846ebfcdf2682c2fc953606a54a0c245ff124ddfaf4d95ac2d66d97100f2e4",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `When Garruk’s Uprising enters the battlefield, if you control a creature with power 4 or greater, draw a card.
Creatures you control have trample. (They can deal excess combat damage to the player or planeswalker they’re attacking.)
Whenever a creature with power 4 or greater enters the battlefield under your control, draw a card.`,
        flavorText: "",
        typeLine: "Enchantment",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "When Garruk’s Uprising enters the battlefield, if you control a creature with power 4 or greater, draw a card.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "Creatures you control have trample. ", italic: !1 },
              {
                text: "(They can deal excess combat damage to the player or planeswalker they’re attacking.)",
                italic: !0
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever a creature with power 4 or greater enters the battlefield under your control, draw a card.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "720d871d-1e7b-482e-bd1e-8ec79519fb86": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "4834bf11cb681305e6601555700b58cdea6448208120acb012569a9ac738175a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "72654b84-9902-41db-92ab-a3499c31221c": [
    {
      faceName: "Encouraging Aviator",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "f94315b9f6ae27099c9128ff9c997cd295ffccbf28983b85694987037225cece",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Flying
Whenever this creature attacks, it becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Bird Wizard"
      }
    },
    {
      faceName: "Jump",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "f94315b9f6ae27099c9128ff9c997cd295ffccbf28983b85694987037225cece",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Target creature gains flying until end of turn.", typeLine: "Instant" }
    }
  ],
  "72746a5d-faa1-44b7-97b5-0ef9302a3c13": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "e6e5849cb1c5de06222a9d31dc03df6d2dae6d285e01c444807b7b0f677bc12d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Cave People" }
    }
  ],
  "7281e17d-a6e0-4e0e-8ee6-c6d9dec54231": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations.json",
      referenceSha256: "176c6532acd8146e0be718b9ed4a9722c93037dd92b7b820bb47a049f85a40a7",
      reason: "Printed type verified in the cached Unlimited scan. MTGJSON originalType has modern Creature – Human Cleric for this printing. Body wording remains unreviewed.",
      fields: { typeLine: "Summon Cleric" }
    }
  ],
  "72955141-d990-459f-adbe-7d3d0f5f6c95": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "786b68d3126e7fdc6abb12865197e778beca13b02ef652d76bd7f3386afce379",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "729feb73-4581-4f9d-ba47-bece72481b86": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "0a3416784427440b934dd7f9da2e3fde90bd95e287f36d6ca4915a9a430faf3c",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Elder Dragon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "0a3416784427440b934dd7f9da2e3fde90bd95e287f36d6ca4915a9a430faf3c",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "U", "U", "B", "B", "R", "R"] }
    }
  ],
  "72cfe9b9-677d-4ecb-83ab-67fb6481371d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "36ccf1a627bed6cc74d17f19e9b2259ba87fcb791b9b29a5267f4651f1f414cf",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "72d5d8b0-e22d-4bb3-9e36-5038601d22f7": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "6f182a4353c74bddd5d15dbea07e060830b7ca43a8a6d913822a87d8d75fa927",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Bear",
        rulesText: "",
        flavorText: "Don't try to outrun one of Dominaria's grizzlies; it'll catch you, knock you down, and eat you. Of course, you could run up a tree. In that case you'll get a nice view before it knocks the tree down and eats you."
      }
    }
  ],
  "733933dd-c871-4f75-8b08-d7c010dddbe6": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "737517aa53774f3ff77b12b50f84e3eb5f384dcc4b17321e8362f5230eaf0253",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "734be7fa-0998-4771-9b97-4989b3fc1471": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "4fc1650efb908153ff0996d9acde2acd16a4ae0bd74dbb42b6c07788a0a6eab1",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Gain control of enchanted enchantment.",
        flavorText: `“Why should I flatter another with imitation when I can satisfy myself through possession?”
—Ertai, wizard adept`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Gain control of enchanted enchantment.", italic: !1 }]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“Why should I flatter another with imitation when I can satisfy myself through possession?”",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "—Ertai, wizard adept", italic: !0 }],
            align: "right"
          }
        ]
      }
    }
  ],
  "736e4586-a6c6-42c0-8555-5f09d214e1cb": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "5ff214be7ac9a04a68b96f58d551a2518b6f8a81722a0e18c0b7535536a5e3ca",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "73719325-b091-4464-b0b0-77dfbb19562a": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "39f07e4dbedf8f890e58ccc1e7bfb916704edd480e5a81af90976d43a6f065eb",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Mogg Conscripts cannot attack unless you have successfully cast a creature spell this turn.",
        flavorText: `“Torahn’s horns! They’ve seen us. Now, statue, you must fight to save yourself!”
—Tahngarth, aboard the Predator`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Mogg Conscripts cannot attack unless you have successfully cast a creature spell this turn.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“Torahn’s horns! They’ve seen us. Now, statue, you must fight to save yourself!”",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              { text: "—Tahngarth, aboard the ", italic: !0 },
              { text: "Predator", italic: !1 }
            ],
            align: "right"
          }
        ]
      }
    }
  ],
  "73ae5276-b607-4f23-a9d2-e8cc7b8e3693": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "9cb783678ced0c9d9bcf246a061d4d9044f2ec2280ea8c8d53139bd475b1ed7c",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Ogre",
        rulesText: "",
        flavorText: "The Ogre philosopher Gnerdel believed the purpose of life was to live as high on the food chain as possible. She refused to eat vegetarians, and preferred to live entirely on creatures that preyed on sentient beings."
      }
    }
  ],
  "73cba9cd-73d9-442e-bd99-9cba9f398b64": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "a73e6682f2cd835c0749ee800fd254f0ebf9d7acdd8143846d6fb3630105630e",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "7416c366-95cc-4799-b6c6-34d8fad8c202": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "be9ad967f3da46c0e421229c0b13ee3b5fdfda314d156493fa700a8e7528c217",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Elephant" }
    }
  ],
  "741b14f8-625d-41be-a734-0efe042a6ee8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "6ce1257396bb11060d1354c5d80896d807348fdbfdecc54c305670e6bf5ec059",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Drill Sergeant" }
    }
  ],
  "741dbcf2-3372-45a8-b66f-d2ae12b4aac6": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "def7cc84bf5b8c161ac16085558e6430357c183a85132b7587576b85f6efa000",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "744e7821-8bfd-4816-a8af-4e6fe7b35505": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "ab6b2ca38cbe29c7fb6d350f2000ba28735e914eb5bd65cca9b3256515e43eea",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "74b22007-9def-4c0f-921c-555483cc3deb": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "c31f92bafd23e77c9e23f5c4a130ad938a9d074ba95110ed603d05507a5c1440",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "74e2ae05-29ec-4005-8d78-280a190601c4": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "ae3e1604ee1792e6d45b7dac396e847c8c0a82d0b0dfb7769a21327bd2055b29",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "{B}{B}: Counter target green spell. Play this ability as an interrupt.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "{B}{B}: Counter target green spell. Play this ability as an interrupt." }
            ]
          }
        ]
      }
    }
  ],
  "7524fd0d-a675-41d6-bc99-bd3ba336893b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "7dca6235baa01c8c6d3dcef03291d2fd03b11cf4fa622dcf8ab81357fe03d999",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "754b77b4-4cc4-4e49-a7a4-667401e7e063": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "e1c8427b0cfb21d6e9e64e65783a638b61d9406859e2c1ff2729ed175f81ab3f",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: "Whenever you cast your first instant or sorcery spell each turn, copy that spell. You may choose new targets for the copy.",
        flavorText: "“Your eyes aren’t playing tricks on you. I am.”",
        typeLine: "Enchantment",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Whenever you cast your first instant or sorcery spell each turn, copy that spell. You may choose new targets for the copy.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "“Your eyes aren’t playing tricks on you. I am.”", italic: !0 }]
          }
        ]
      }
    }
  ],
  "75961d36-acf6-425f-9698-0bf52af74f31": [
    {
      faceName: "Ancestral Recall",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "507f7eeaaedfcb8f89ef7328d35fad8fa07fe348b7ca9da9dc1569f743b444c2",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Target player draws three cards.", typeLine: "Instant" }
    },
    {
      faceName: "Emeritus of Ideation",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "507f7eeaaedfcb8f89ef7328d35fad8fa07fe348b7ca9da9dc1569f743b444c2",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Flying, ward {2}
This creature enters prepared.
Whenever this creature attacks, you may exile eight cards from your graveyard. If you do, this creature becomes prepared.`,
        typeLine: "Creature — Human Wizard"
      }
    }
  ],
  "75d5b014-8675-4d91-a539-ac5c31d44b35": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "4f8ad381ba714bfdf09ee0f26a9ac3bf236e5cf090160a0136f80d45cfd5fe32",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["W", "G"] }
    }
  ],
  "760b6703-ac92-45f6-8c32-60f760eba866": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "b129b2c995001891fd461031a9c39f8980b961efddd94e6161d1bc06392675c9",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "G", "U"] }
    }
  ],
  "764a7a53-314e-4b1f-aa33-0f312d06df71": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "403cb2be683668eca27ec9fe011d1c2f937516bea44684102818b6c7de1ae50b",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: "Create two 1/1 white Soldier creature tokens.",
        flavorText: "Like blinking or breathing, responding to an alarm is an involuntary reflex.",
        typeLine: "Instant",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Create two 1/1 white Soldier creature tokens.", italic: !1 }]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "Like blinking or breathing, responding to an alarm is an involuntary reflex.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "76693233-7961-4b7e-80f2-ed90e494c4aa": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "6c198ecb50933e4e1e91194d7c356f9aaf8a43b48f1c48cf8950d4a062df204f",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "76a0b7cc-0889-4980-a23e-6f5088b374f8": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "447aa42d2cdd5db2d9d265ec9de1ee41bb55616ddb7ed6f3e6cd073eea4af89e",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "U", "B"] }
    }
  ],
  "76aaff1a-6796-4728-bdb5-bcdc79c9b98c": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "fe70201b95c478e8c1f174b340577659411992ae250830940a818c0701e348bd",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "76ac72f8-5b1e-4d67-a796-ef69cde27424": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "e01257ed0dca1312ffecac95d6c81fd398b8aa9c96e6b853c1a9056bfcb6eb07",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "76e42d07-57d9-4de4-8d41-eb42dd1573ed": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations-empty-rules.json",
      referenceSha256: "676711d8d80ae6f8f8f148d48e2ead3e46b908fdae2e2da4e7c472d7548ed9d8",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Ogre Warrior",
        rulesText: "",
        flavorText: "The ogres you know are nothing like the Onakke. Possessing both intellect and industry, they had brute strength without being brutish."
      }
    }
  ],
  "76e5ee8a-34e5-4a2e-a04e-9fcdc7e53dda": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "99feb438cc9b5702ce2aeea05ed167945676c53c893316313441706cb4c8b07b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "77285d12-e658-4eb3-ba13-ff202afab9c8": [
    {
      faceName: "Abigale, Poet Laureate",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "0a78d80f65550fcdd7d5ab4696f44743ba9075ace2caf590f2a7675946e16df9",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Flying
Whenever you cast a creature spell, Abigale becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Legendary Creature — Bird Bard"
      }
    },
    {
      faceName: "Heroic Stanza",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "0a78d80f65550fcdd7d5ab4696f44743ba9075ace2caf590f2a7675946e16df9",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Put a +1/+1 counter on target creature.", typeLine: "Sorcery" }
    }
  ],
  "778d10e6-251b-4ef3-b9b8-bc23a0d74aed": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "df7743b3f38b0c8c12afe3c832d38976c38077c3d8c3e68d26026dc648b13c45",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "77a425d3-a0b7-4d8d-8013-a27c59758b28": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "dd394154c5089677cd1054208367a5bb4bb10481c2854d22be1d2af6604941ef",
      reason: "The exact FUT scan was visually reviewed. MTGJSON originalType contains a later creature-type update; retain the printed type and preserve Oracle wording separately.",
      fields: { typeLine: "Artifact Creature — Myr" }
    }
  ],
  "78373616-e2d6-4ccf-998f-09f02bea45b4": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "4eb1aa9bf88af1487511684828b6409e6456a7da35b656a945931dfb6779744a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "78a2359f-6586-42a6-a855-c0049b448cb9": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "b371058256eacb71abcbb01314486ef1b80a8b150df10c3c30b3c8762c1e882c",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "U"] }
    }
  ],
  "78a9088f-8755-47cb-aa93-51d992ccab90": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "c8aa8d41e890b92882bfc61169caba36c58839fff7291d71234985571c8e639d",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Minotaur",
        rulesText: "",
        flavorText: "The Minotaurs of the Hurloon Mountains are known for their love of battle. They are also known for their hymns to the dead, sung for friend and foe alike. These hymns can last for days, filling the mountain valleys with their low, haunting sounds."
      }
    }
  ],
  "78e5d861-460b-4143-8232-a0ade5a2511c": [
    {
      source: "games/magic/fixtures/accuracy/cei/annotations.json",
      referenceSha256: "97c549b87d587308b213c5d5211e66d3e647f14a54cd427a81d202f9521cdc8f",
      reason: "Scan confirms a separate attribution line. Both source feeds omit it. Partial review; original rules wording is not certified. Upstream correction: https://github.com/mtgjson/mtgjson/pull/1748",
      fields: {
        typeLine: "Summon Paladin",
        flavorText: `"Look to the north; there you will find aid and comfort."
—The Book of Tal`
      }
    }
  ],
  "79427109-c1f3-476d-a029-0049217237b5": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "7dd6e9d2464cdf46d0b35e2ef4d1bd99df488fa87d7d0eeb01870c65b2ec041c",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Legendary Land" }
    }
  ],
  "799538af-e497-457b-b096-ee6f342f51b5": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "12e26aabae8945ba76f5321caa4956020e1aea2c7a75c62e6382625597b6074d",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      fields: {
        rulesText: `{X}{U}{U}, {T}: Return target creature with converted mana cost X to its owner's hand.
Grandeur — Discard another card named Linessa, Zephyr Mage: Target player returns a creature he or she controls to its owner's hand, then repeats this process for an artifact, an enchantment, and a land.`
      }
    },
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "12e26aabae8945ba76f5321caa4956020e1aea2c7a75c62e6382625597b6074d",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      paragraphScope: "rules-only",
      fields: {
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{X}{U}{U}, {T}: Return target creature with converted mana cost X to its owner's hand.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "Grandeur", italic: !0 },
              {
                text: " — Discard another card named Linessa, Zephyr Mage: Target player returns a creature he or she controls to its owner's hand, then repeats this process for an artifact, an enchantment, and a land.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "7995c3f9-a147-43c9-9f82-470924818a4c": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "44c769c1886cc88e1214c0cfcd86bd8df77f680fd132c958f13217fa0e55fd8f",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Witches" }
    }
  ],
  "79a70863-860f-4a7b-9cb2-d3546b689d44": [
    {
      faceName: "Forum's Favor",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "b61612b0d93d656f68efb33aafa93185204f51c3e4299302c7980a6179320a00",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Target creature gets +1/+0 and gains flying until end of turn.",
        typeLine: "Sorcery"
      }
    },
    {
      faceName: "Honorbound Page",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "b61612b0d93d656f68efb33aafa93185204f51c3e4299302c7980a6179320a00",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `First strike
This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Cat Cleric"
      }
    }
  ],
  "79bf50f3-2838-4908-8004-847ccb296fe0": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "47c06c3ae0c4b873be3f2fc9d5a6d26c8d663daeb45786156f3156ab0d735dc3",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "7a20dcb0-5350-40e0-82d3-c8d0186fc9d2": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "20abbea1235941602001f5af84253941bdc2f0b97de61037a349c13255e6686b",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "20abbea1235941602001f5af84253941bdc2f0b97de61037a349c13255e6686b",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "R", "B", "U"] }
    }
  ],
  "7a383a5f-4814-4b92-aa80-2a6440a719bc": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "e9f6621c92531bd2975ed7049f76b9bdefedbfd5e264ea4e15dfe8921ac08e2d",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "U", "G"] }
    }
  ],
  "7a601041-926f-40fd-8106-39099b87806f": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "8d952838927f6b722652abba9c3e4432e05c02a26c84ae49c55b2ab95158ccd9",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "7a78abdb-d1ac-49cb-a74b-9de21c06364a": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "5f0aceafc7b568b00fb4696582a6fedd4944bf664c7aa87d055736ad0e71142d",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Bad River comes into play tapped.
{T}, Sacrifice Bad River: Search your library for an island or swamp card. Put that land into play. Shuffle your library afterwards.`,
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Bad River comes into play tapped.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "{T}, Sacrifice Bad River: Search your library for an island or swamp card. Put that land into play. Shuffle your library afterwards.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "7a9a3aeb-a316-4b1e-927b-36c3f999f2c3": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "478a1fc3dddd3977d0682f9a7173b036d62018dd147eea66c1efbb32ae365d5a",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      fields: {
        rulesText: `{T}: Prevent all damage that would be dealt to target creature this turn.
Grandeur — Discard another card named Oriss, Samite Guardian: Target player can't play spells this turn, and creatures that player controls can't attack this turn.`
      }
    },
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "478a1fc3dddd3977d0682f9a7173b036d62018dd147eea66c1efbb32ae365d5a",
      reason: "The exact FUT scan prints the italic ability word Grandeur followed by an em dash. Cached MTGJSON originalText omits the dash. Restore the printed separator and reviewed rules styling, retaining provider flavor text and Oracle wording.",
      paragraphScope: "rules-only",
      fields: {
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{T}: Prevent all damage that would be dealt to target creature this turn.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "Grandeur", italic: !0 },
              {
                text: " — Discard another card named Oriss, Samite Guardian: Target player can't play spells this turn, and creatures that player controls can't attack this turn.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "7af6b119-7db4-49dd-aaa4-044b8c133f13": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "abb7060f31f2c011c6af4cfdcf86864d0bf6372c7ba89ada99944057af577159",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Kobolds" }
    }
  ],
  "7af9c715-8d72-4eae-b412-fc89138ff588": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "08ee61ef295105fc90a07b0ca6baf7080eb6ead1edf783588a6142bd20dc8fed",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "7b112a10-ac40-4353-bbdd-e5efd4546330": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "9aaf96880485b3f388922dfdf84a8fa176fd25f41147eaa36c3b381762092a3d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Sindbad" }
    }
  ],
  "7b20087c-355d-4157-bd4e-b4dc2be49b69": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "e0128d408b497c239ff358785344ad1edba50743f74a540849aebbf2c9ba4a32",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "Each player can only untap one creature during his or her untap phase.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Each player can only untap one creature during his or her untap phase.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "7b23de17-d867-41f8-b965-9b3eb00db701": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "c42f54d2e6008547a10957c2f7b613c5cef219a43f0f398a350735ca714d813c",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "All plains in play are destroyed.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "All plains in play are destroyed.", italic: !1 }] }
        ]
      }
    }
  ],
  "7bbd2cab-538e-4932-a828-150e3e9d52ad": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "f63c39b04346375be2ca2c65e704adbb725eaac147ea96df9cbad2d0251e7337",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `When Solemn Simulacrum enters the battlefield, you may search your library for a basic land card, put that card onto the battlefield tapped, then shuffle your library.
When Solemn Simulacrum dies, you may draw a card.`,
        flavorText: "",
        typeLine: "Artifact Creature — Golem",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "When Solemn Simulacrum enters the battlefield, you may search your library for a basic land card, put that card onto the battlefield tapped, then shuffle your library.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [{ text: "When Solemn Simulacrum dies, you may draw a card.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "7c350c38-6cbb-4b8b-823f-45d6a16568cc": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "a8adec1172fe8d4b06a9bebd7b0bb976cb63aeba1002a678f9b54ab54bfb2780",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "7cb88a03-7092-4d31-a9f1-4f16e39bc537": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "f94363152f7f747750ddbd3c58dfcac6322928dd3d0e343ce6bb348f0de444f7",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "7debd8f7-2f34-4fdd-8eb6-fa8f9d2a60e8": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "7b00c0721ffc7430110f39b4406b3b7ff32b92b3acd8af99a3d20e476841a39d",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: "Return target creature card from your graveyard to your hand.",
        flavorText: `“If we’ve run out of warm bodies, then cold bodies will have to do.”
—Modriss of Zargoth Fen`,
        typeLine: "Sorcery",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Return target creature card from your graveyard to your hand.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“If we’ve run out of warm bodies, then cold bodies will have to do.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Modriss of Zargoth Fen", italic: !0 }] }
        ]
      }
    }
  ],
  "7e0651ad-6901-4f9b-8807-d66e53a4ada8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "bfd2500edf149cd5da19597ece4617c48b9a7951911f209193ed1bd7e71efbfb",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "7e18d625-0950-4062-8d41-f8b681eff234": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "cd55b4dd478fe2bdf62cef69c329e6ef08b6d0750f6c5b8b3883fb1a8f89cb5f",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "7e75a7e9-902a-4733-8cd4-767247174a4c": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "072db12b8d83979b46e43a34f88fd3fc193a2778837e1169753dd4d5ce3bca54",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `As an additional cost to cast this spell, sacrifice a creature.
Destroy target creature.`,
        flavorText: `“I will make your bones into a weapon that will lay even the mighty low.”
—Modriss of Zargoth Fen`,
        typeLine: "Sorcery",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "As an additional cost to cast this spell, sacrifice a creature.",
                italic: !1
              }
            ]
          },
          { role: "rules", runs: [{ text: "Destroy target creature.", italic: !1 }] },
          {
            role: "flavor",
            runs: [
              {
                text: "“I will make your bones into a weapon that will lay even the mighty low.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Modriss of Zargoth Fen", italic: !0 }] }
        ]
      }
    }
  ],
  "7eb9e83d-515d-4911-a06b-9982200277b2": [
    {
      faceName: "Demonic Tutor",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "adb8f18891ae1be7970ee254fd905dc5b7d351d85f4897c4fd5d7f8253dc0cf0",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Search your library for a card, put that card into your hand, then shuffle.",
        typeLine: "Sorcery"
      }
    },
    {
      faceName: "Emeritus of Woe",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "adb8f18891ae1be7970ee254fd905dc5b7d351d85f4897c4fd5d7f8253dc0cf0",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)
At the beginning of your end step, if two or more creatures died this turn, this creature becomes prepared.`,
        typeLine: "Creature — Vampire Warlock"
      }
    }
  ],
  "7ec1650e-8ecb-460a-9319-0f59de48c824": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
      referenceSha256: "80ae450a1cb6b987032b3292f8678698f6f5a1de54aab665de934fabd451bca9",
      reason: "Carries the eight original-field corrections and adds the scan-reviewed Serendib Efreet type and frame palette. Semantic colors remain unchanged; no name-based painter routing.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "7f020ebc-4950-4407-8cb8-7630cad226f6": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "19e58ab575a9a232991dfd5835a7632e956d5e2b1834eab9ec2ca74848ceeeda",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["W", "R", "G"] }
    }
  ],
  "7f841918-813b-4784-ab57-907185b0a355": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "9db9ac6ddb1eb830016ef9fe44fedf9d140053dc455f705ed79a9de0ad0c2969",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "9db9ac6ddb1eb830016ef9fe44fedf9d140053dc455f705ed79a9de0ad0c2969",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "G", "G", "R"] }
    }
  ],
  "803fd65f-4ca6-4fe4-abc2-72aa32ebb3a5": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "a4fe958556829b70652bed8f4c720ed2eb95a12df7d6f80b0ffea95dbac57853",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "{T}: Add 2 colorless mana to your mana pool. This ability is played as an interrupt.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{T}: Add 2 colorless mana to your mana pool. This ability is played as an interrupt.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "8059c52b-5d25-4052-b48a-e9e219a7a546": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "7dbdf1bc34fc9966192d032fb28337b352026e6f63189921fff1161c8bc33083",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: "Trample (This creature can deal excess combat damage to the player or planeswalker it’s attacking.)",
        flavorText: "If you feel the ground quake, run. If you hear its bellow, flee. If you see its teeth, it’s too late.",
        typeLine: "Creature — Dinosaur",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Trample ", italic: !1 },
              {
                text: "(This creature can deal excess combat damage to the player or planeswalker it’s attacking.)",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "If you feel the ground quake, run. If you hear its bellow, flee. If you see its teeth, it’s too late.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "8068c263-e5fa-4449-8887-418e9d0a4da4": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "8760fd6d70a0fdcbd3429b8c8d21780099ce673c2931fee3f38a1535a30d86d0",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "808cad10-69d5-4e14-9834-476c53ec97e4": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "71361ca47e0301e0d1a48181ee8ae620a5832da5e40b7219c1260251ec34e2fd",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "80c9070a-8c70-480e-a476-e00f8e2c71b9": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "a4df26a90c9367be869cd5a02e92b665e5ffa33a467bfdd890d8659b7ff5ceae",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "81a40f34-fc26-4d05-9c52-6ffbf1766a3b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "29289b2994d9d992b52051a6091b65d57c5f51ef5d234da0e02c05e55d9dac84",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "29289b2994d9d992b52051a6091b65d57c5f51ef5d234da0e02c05e55d9dac84",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "B", "B", "U", "U"] }
    }
  ],
  "81a5ec5a-b490-456a-98e8-36cf4b836d2a": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "9569c0f3e31953afbd10a735549f93e1ae1ac839faec77f0c3c1547479a8f59b",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Soldier",
        rulesText: "",
        flavorText: `"Training? Seeing my crops burnt to cinders was all the 'training' I needed."`
      }
    }
  ],
  "81d73362-43c1-4dd0-87dd-9aa7ae13ff2f": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "b91c31a9a055ea2cecfea54de59b1ed2730a36b8a4aaae17f7efe3fd52620de3",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "8216b3f3-b9b6-4d90-a624-c1b9b7bdf953": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "ced5a9928947e581ac8197cb68794f81826125d26e5c1bd18e252e7aabe91d9e",
      reason: "The full-art creature has no rules or flavor box. The exact scan was visually reviewed; missing originalText is not treated as empty for unrelated printings.",
      fields: { rulesText: "" }
    }
  ],
  "825496e5-19c7-4f50-8070-0265a58608dc": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "b6ac7db417a0a78ea601b6e49b3dad57ce23b5e2cb241c949490d0f3eba69fbc",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "82ae30e8-2dcd-46b8-925b-cc24e11fb95d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "7824cc96b94cf0d8714eb99c0e52f4adafac55d53e899fc434a243f3850da8ed",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "7824cc96b94cf0d8714eb99c0e52f4adafac55d53e899fc434a243f3850da8ed",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "B", "R"] }
    }
  ],
  "82da0972-b17b-4600-9efd-e9430a0db04b": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "f778855290259d5be5ce33745553d6b13fb9684565a121462580f0dd8cb4d79a",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "83717eb2-220e-4086-be09-dee9174798b8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "1c8a1eba834ead93e13bbd3e211e9c885fe1450bedecd4099365f20f13fd40c9",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "1c8a1eba834ead93e13bbd3e211e9c885fe1450bedecd4099365f20f13fd40c9",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "G", "R"] }
    }
  ],
  "8384f87b-26c2-45b7-98ef-352c384f205e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "bd6f7ab3bd5cc084a6967c021426ee8b660b709b4efde1be3b86813b27b3b78a",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "bd6f7ab3bd5cc084a6967c021426ee8b660b709b4efde1be3b86813b27b3b78a",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["R", "B", "U"] }
    }
  ],
  "840c6586-a7a9-4ae8-96be-a995a0693eb6": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "efecd93d944777b78c90464e9d1fb9d132b4aa5f30c001b0869dade9bc419858",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Land" }
    }
  ],
  "8436c720-ff96-4475-8320-d0d1e0c23f2a": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "e86194dd3e1a6ab04a2c5ea33d0a1417b74866888d583a77b19b430df52852f2",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "847de6a4-a268-492e-a4d2-5b12237bc130": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "65a70ab0c839752289f9cd1111dc7fefafafd7db3287e0968da56c67e0ea1390",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "848ad6d5-3a7e-4d6b-9929-36465796871f": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "7b914b622758b3a755eded7801755e127a68c3e6a8d830ad7e4047f8547757b0",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Uncle Istvan" }
    }
  ],
  "84b83106-a10d-469a-99eb-56110ef34ba1": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "bf62b7ef5f13d8dd5c72ba6913e63f10b1362d543799d38a2316e606878b1ea8",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "84e4a955-ce9a-4386-b6ac-c00fd25de882": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "e079b7086583dc9b23f6b6dd48c52cb92c4e1486570b002b52334c6e9d62e048",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "If a spell or effect controlled by an opponent causes you to discard Sand Golem, put Sand Golem from your graveyard into play at end of turn with a +1/+1 counter on it.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "If a spell or effect controlled by an opponent causes you to discard Sand Golem, put Sand Golem from your graveyard into play at end of turn with a +1/+1 counter on it.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "8537cb0f-4821-417b-80cc-ea57d51ee9b8": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "2034934185bf72709dbc0f769736bb6af15b1fb78976377f661fe62620825dc9",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Island Fish" }
    }
  ],
  "856be1dd-a20b-49c2-be9d-7db76c7efd8b": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "ba7c2d954f31cde121488383e1eaa61064fb0794ea148136dd3955cb09293d87",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "856bf0ba-e5a5-47eb-9a6a-111935088c31": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "19bfdea83ecf6452c31f82191a47b48c3c9a45de80c335fd13f9e1cd7a85bac7",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "86a27d68-3e58-4ade-976d-36381beed451": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "b99169483d183bca57bbc183c925c55e0347f207da079cdb52f55cee902e8e49",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "870ee86b-222b-4d7a-9c5b-ea10e1d73756": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "2a850ecc5043006c4489ab1815afb573a2f1bd86bdb11b9c140e3ae39a4e6fba",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Untapped creatures you control get +0/+2 when not attacking.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Untapped creatures you control get +0/+2 when not attacking." }]
          }
        ]
      }
    }
  ],
  "879a8653-1538-4f78-a3d3-a900a4d9499b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "7c3ec426fdc51a011d5a6aa5cefb9ff89368dab8923f2cd5e4a6019ff8643079",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "87e5fc19-3b10-476f-9a73-e8bf4b5fbec0": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "aeb3449a5f20c78c627dd58267df9ca4f6fd5a2325898a9f9b90ebc8d40dd6e3",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Turtle" }
    }
  ],
  "884c47fa-7060-48da-995c-e4037640a208": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "24aab8e9dc30282dc8b20602dd8839e39a616af11450126789f279b5ddbab8c0",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: "When Keldon Raider enters the battlefield, you may discard a card. If you do, draw a card.",
        flavorText: "Keldon raiders’ spoils are limited to what their colos can carry. No matter the value, the rest goes up in smoke.",
        typeLine: "Creature — Human Warrior",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "When Keldon Raider enters the battlefield, you may discard a card. If you do, draw a card.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "Keldon raiders’ spoils are limited to what their colos can carry. No matter the value, the rest goes up in smoke.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "886959ca-83fd-4b50-a99a-08ef0c5415db": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "36dd32d9efbde431cf7e1919dc7551d8d8e9bee0f4415bccfb4ea7effe04a65c",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Bears",
        rulesText: "",
        flavorText: "Don't try to outrun one of Dominia's Grizzlies; it'll catch you, knock you down, and eat you. Of course, you could run up a tree. In that case you'll get a nice view before it knocks the tree down and eats you."
      }
    }
  ],
  "887f22af-8b92-422a-9cd5-f3977674bcdc": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "b422028f9a424389e18746bb276d47c72b8c57b1ccdfec7fc04bf009ea78924e",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "88b18b70-f656-4426-a3e5-69cf61fdaad1": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "c591bc31bb5a1a3cd7e2daa8e0ffa9653e8805999e6aec679b9650276901abe9",
      reason: "The full-art creature has no rules or flavor box. The exact scan was visually reviewed; missing originalText is not treated as empty for unrelated printings.",
      fields: { rulesText: "" }
    }
  ],
  "88c6101a-09af-423e-881f-09aa1e01d2a2": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "7b787cbd36adfd3c9c701eb0cac68c5066f29f30a48a0d671d79d4e838cb23ba",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "88d0aca2-874c-4d91-8fe9-f8355d71aeb2": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "894f43da282303f9eeb4b07b03ea3cb1415e028fa7cde2681e909257518d7efe",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "893e8e9c-983e-4db1-8d93-10637025a559": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "9616dc14cffb4919a1f5ceaa981e6d98b0d8e2996c556d398a6c257146e88b90",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "8945585f-4773-493d-a0fe-d707db910b38": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "02c11a39a06f032a5512d674efddf4ab2a32053cacec09ff1b699e70a597800b",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "894c5cf2-8ae2-427a-bcbc-67df0bdfee9d": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "cbdb8973ea63f68bead4c09fdbb053f55acec57833610cd18f969ce7ec8ab8b0",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "8965ce61-0522-4f77-a82d-89441d1ba867": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "3eba2b88219bd9f1d519723c14544bda6715450fd6cb74103463ec748e057142",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["W", "R", "G"] }
    }
  ],
  "89ad91fc-50c2-44e0-b88e-2c13610377f9": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "acd60352f7c009583f78f5716147fa2f715b3bdd1c70cb4ed3ecf613e3dc74dc",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "8a538b9d-351e-40bb-be11-9ba08c16352b": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "4da08c5389fcca8da556ac972287df224b2fcd881990b6ef107fe40111d37069",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Goblins" }
    }
  ],
  "8a5a1a13-dfc8-49b7-9b17-3f0c5ca1b8be": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "c578c0c236be69ef5696b42fef9233be67dc4727198d49306c8dac7de98491f1",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "8a665794-513f-4f78-92c9-1844ec27c79c": [
    {
      faceName: "Bring Back",
      source: "games/magic/fixtures/accuracy/adventure-printing-corrections.json",
      referenceSha256: "cf9ce4774adf89cf437b26166480e86c66ed078c18ca7be060f70a7ecf404946",
      reason: "The scan predates the added Ranger subtype; the spell is Sorcery — Adventure.",
      fields: { typeLine: "Sorcery — Adventure" }
    },
    {
      faceName: "Oakhame Ranger",
      source: "games/magic/fixtures/accuracy/adventure-printing-corrections.json",
      referenceSha256: "cf9ce4774adf89cf437b26166480e86c66ed078c18ca7be060f70a7ecf404946",
      reason: "The scan predates the added Ranger subtype; the spell is Sorcery — Adventure.",
      fields: { typeLine: "Creature — Elf Knight" }
    }
  ],
  "8aabd80f-a18a-4bc1-9f05-4c3a63de77ce": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "27b2fa0d4f8cb4ba6118ac2fea953a1da2d1fec32f1b78466e8ed9ac9b66df12",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Goblins" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "27b2fa0d4f8cb4ba6118ac2fea953a1da2d1fec32f1b78466e8ed9ac9b66df12",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["B", "R"] }
    }
  ],
  "8b1e10e8-ea14-4761-910b-4072e2a18456": [
    {
      faceName: "Grave Researcher",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "247a7a4cd6db67b9a3342b2cf1424f6ed9b684bb5f1b6cb40de1c0328eb3486f",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "At the beginning of your upkeep, surveil 1. Then if there are three or more creature cards in your graveyard, this creature becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Troll Warlock"
      }
    },
    {
      faceName: "Reanimate",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "247a7a4cd6db67b9a3342b2cf1424f6ed9b684bb5f1b6cb40de1c0328eb3486f",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Put target creature card from a graveyard onto the battlefield under your control. You lose life equal to that card's mana value.",
        typeLine: "Sorcery"
      }
    }
  ],
  "8b45117b-8369-48fc-8e5d-8986e662d123": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "239b02c646ce2e14cfa1bdd89488cf8cc7f7a092c950c849af6bf32b46456b2e",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: "Whenever another creature enters the battlefield under your control, each opponent loses 1 life.",
        flavorText: `“With each knight that rode out from the bone-white keep, the queen’s soldiers felt their courage failing.”
—Krinnea, Siege of the Bone Spire`,
        typeLine: "Creature — Zombie Knight",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Whenever another creature enters the battlefield under your control, each opponent loses 1 life.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“With each knight that rode out from the bone-white keep, the queen’s soldiers felt their courage failing.”",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              { text: "—Krinnea, ", italic: !0 },
              { text: "Siege of the Bone Spire", italic: !1 }
            ]
          }
        ]
      }
    }
  ],
  "8b6da540-6803-47e5-9af0-7ae8e2f84b6c": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "377f439bf647aa25750fc80c6e56be3ecb04f10422740fad011e0c1b7178722b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "8bd501ae-5814-4336-a45b-2b88cb85d29e": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
      referenceSha256: "e392a9e960eb3e5ab1a3b22b77078b5884f119253503e8f3017664634623ebbf",
      reason: "Text-inset study, retaining prior reviewed wording. Adds scan-reviewed Angry Mob originalText from MTGJSON. Earlier stats studies and capture inputs remain frozen.",
      fields: {
        rulesText: "Remove target creature from the game. The creature’s controller gains life equal to its power.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Remove target creature from the game. The creature’s controller gains life equal to its power.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "8cd7d7e1-f928-4429-9a59-ba0590a78e98": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "f4af3ee9519cd2db488725ca47bbb4df4c5bfcdc8f25908eeda9ff840343cb90",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Elder Dragon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "f4af3ee9519cd2db488725ca47bbb4df4c5bfcdc8f25908eeda9ff840343cb90",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "B", "B", "U", "U", "W", "W"] }
    }
  ],
  "8ce912d9-406b-4eba-97be-3bf1d425ee05": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "1922be9e9ec55a62d8bfd58541d324ee1074aab59da62e6c8073695bc05a25ce",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["W", "W", "U", "U"] }
    }
  ],
  "8cf99186-3167-4092-8efb-e7448609ceba": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "dbc6122bfce71e013adc1243737d82981b54366b6b41438587f810409070a048",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "8d41f08b-68fb-45f2-bdc9-488baedc7d6f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "7ceffdaba8189afaa2898e2e69621dda6069ffd5441961bb1f1dfd1d4829accf",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Boars" }
    }
  ],
  "8d82d94b-ceef-4533-a4f2-b6442a61b839": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations.json",
      referenceSha256: "3bc7f772ce511e242ed14747dd5a58263a1366aa16a8dbf15d7ba662d9a1688d",
      reason: "Eight development scans visually reviewed. Printed wording transcribed; soft wraps are not forced. Poetry line breaks are intentional. Land targets retain semantic subtypes and require an actual historical printing policy. Expected alignment/artist are review targets, not geometry overrides. Heldouts remain unviewed.",
      fields: { power: "3", toughness: "6" }
    },
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "3bc7f772ce511e242ed14747dd5a58263a1366aa16a8dbf15d7ba662d9a1688d",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "8d9b1b6c-1f02-4918-bb5c-2dbcdb0997ec": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "aa6e7aef6f518c01055466d9e0df9bed6503d43f02763c855e817c6f7a3bf98d",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["W", "U", "B"] }
    }
  ],
  "8da35f9f-e72c-4154-a212-7de98f84ad7d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "435db9dd82d59478e3b10e838ac8ed69c1841afddd18f3c34710633e991d6d0e",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "8db8882e-4db6-4e3c-9e9e-8c71d557a071": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "993413122d41968348a7f37e98cd9dede577977b6a3e6e44e7d998249347d5fb",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Treefolk" }
    }
  ],
  "8de79312-2046-425e-9919-49afe19be81b": [
    {
      faceName: "Awaken the Ages",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "9146453246cc951d1643a38fe507e8894c307e66f76e1f9a901774d3b815ecdb",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Create two 2/2 red and white Spirit creature tokens.",
        typeLine: "Sorcery"
      }
    },
    {
      faceName: "Strife Scholar",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "9146453246cc951d1643a38fe507e8894c307e66f76e1f9a901774d3b815ecdb",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Ward—Pay 2 life.
This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Orc Sorcerer"
      }
    }
  ],
  "8de940d6-98c0-46a9-b5fd-e2b0899ea19e": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "bb95bf474232670c455d0184a2e778766607a262a9e9cc358559d50558ac0ba1",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Elemental",
        rulesText: "",
        flavorText: "Unpredictable as the sea itself, Water Elementals shift without warning from tranquility to tempest. Capricious and fickle, they flow restlessly from one shape to another, expressing their moods with their physical forms."
      }
    }
  ],
  "8df80424-3bd9-4982-ad79-e55d9ba3b43d": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations.json",
      referenceSha256: "d56c93d6a40578bce007ca245fb7ac4eec53c1ab99fbf4391fe82090c0c863af",
      reason: "Eight development scans visually reviewed. Printed wording transcribed; soft wraps are not forced. Poetry line breaks are intentional. Land targets retain semantic subtypes and require an actual historical printing policy. Expected alignment/artist are review targets, not geometry overrides. Heldouts remain unviewed.",
      fields: {
        rulesText: "",
        flavorText: "Everybody knows that to ward off trouble, you knock on wood. But usually it’s better to make a wall out of the wood and let trouble do the knocking."
      }
    }
  ],
  "8e99870c-b2b9-431b-b8a8-3f4a80aa8fa5": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "3f025e7c463c858378610d3e084e3e38e4df46779d3f9365c58e803dc61bcb0d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Scavenger Folk" }
    }
  ],
  "8e9c153c-9224-491b-bc84-8a9f0a83ee5a": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "a47e9b7762befe7fbda6a70aec0ca27d2b5a3640f1190c55c71a170271e0cdc6",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "8ebe4be7-e12a-4596-a899-fbd5b152e879": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "e92ad0a21c5c64080c843c5dfa21b92b213122b2f125081cfc87d4d9fb450bc4",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "8ed85655-fc59-4a57-bcf9-75e1899dff78": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "baa290eb93f4f8df638b1c3167e44160160c90b16af4766fd4e438a308ad1ed4",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "8ef29573-99a1-42fc-8941-2466cda2465f": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "6e24ca95366783f570bbe99d3c2b48ff644579347c591df373592e0db742e6a1",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Minotaur",
        rulesText: "",
        flavorText: "The Minotaurs of the Hurloon Mountains are known for their love of battle. They are also known for their hymns to the dead, sung for friend and foe alike. These hymns can last for days, filling the mountain valleys with their low, haunting sounds."
      }
    }
  ],
  "8f649cb5-e19c-453f-b062-4fd452d92257": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "2e543df3464ecdabd7e044ecb9cd649caad90525f5b503a2e172ac44e9701569",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wolves" }
    }
  ],
  "8f6b4652-a1d4-418f-a89b-6a977a920a9e": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "855d35ba082050b4b131153aa9600075d262035e26104c23310d8482661b0903",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "8f99894d-5ece-44f1-acce-474494ae2084": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "fdca8e7b221dbf2e769cbf1cd4209ea1d6d002fbf4917f7de9c7ff651907c7ad",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Monster" }
    }
  ],
  "8f99a520-b8a9-40b0-9854-48aac297c5ee": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "6ce241c8da498ca793c5e3ec281b2a8361ac703c178c53212e72746a1f9a0b7c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "8fecc5d2-5298-4d47-b085-f160603f220e": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "339ad7ed31ac195399396fde7374dc08a729f4e97f3f608ec96657297f87aacf",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    },
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-text-outliers.json",
      referenceSha256: "339ad7ed31ac195399396fde7374dc08a729f4e97f3f608ec96657297f87aacf",
      reason: "The exact Arabian Nights scan prints two separate generic 5 symbols. Oracle cost remains 10. This correction reviews only the original printed mana cost.",
      fields: { manaSymbols: ["5", "5"] }
    }
  ],
  "9023c078-4169-498b-8626-a4862e0631f8": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "cf5fe227a41d277b3fd95c93eeee1cad98c4c0dd5f74a1aa5a827663c2ca4de4",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "902441dc-c976-4c92-b897-6376eaa0fe38": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "4ffdf84122c855c270015ef55d70dd1cb53678191db6da8d4562f40f892a16c1",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "903d9fde-d7da-4a0e-a337-b63023c6d74b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "fd36893eb18273a0528e9ad5bd119251a6ffcad48a640fa92c6bb79e6bd000a9",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "9047d292-8f5c-4a6b-b74e-c8dbf3e0ab24": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "356d3f2ee79b907d9f1e426d3427bae771a790ee85e2eb3a68684a03f3bdb472",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "If any creature you control attacks, Ekundu Cyclops also attacks if able.",
        flavorText: `“Big one I,
One big eye.
Two-eye see
Two-eye die!”
—Traditional cyclops chant`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "If any creature you control attacks, Ekundu Cyclops also attacks if able.",
                italic: !1
              }
            ]
          },
          { role: "flavor", runs: [{ text: "“Big one I,", italic: !0 }] },
          { role: "flavor", runs: [{ text: "One big eye.", italic: !0 }] },
          { role: "flavor", runs: [{ text: "Two-eye see", italic: !0 }] },
          { role: "flavor", runs: [{ text: "Two-eye die!”", italic: !0 }] },
          {
            role: "flavor",
            runs: [{ text: "—Traditional cyclops chant", italic: !0 }],
            align: "right"
          }
        ]
      }
    }
  ],
  "90a57c0e-fa61-45ef-955d-d296403967d5": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "b899eea192301802309ca1384418caf9796d914a7630f0df2a6bf86151938b1a",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "911442e3-3003-4683-a766-e791e9553667": [
    {
      faceName: "Infirmary Healer",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "2d96269f8c3570793861eeb34e1ec78495574cb6a4eaed28484f041b11d9cb9d",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Cat Cleric"
      }
    },
    {
      faceName: "Stream of Life",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "2d96269f8c3570793861eeb34e1ec78495574cb6a4eaed28484f041b11d9cb9d",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Target player gains X life.", typeLine: "Sorcery" }
    }
  ],
  "917e98db-a0c4-4836-9e4b-3fda142eedf6": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "fa11c89bd9eb4bc86dd2f4b7a10bbdafd53f5b4e360f19a5cb096d58db726245",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "91e0b59d-8f9b-4a76-9845-bcb0dc32523d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "65ce1526c2ab3e42e7cb0dc4016db9772710acf79cb674afd068a4f6f27f29ba",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Rock Sled" }
    }
  ],
  "921011ff-1696-4575-9198-abe993a0ee7a": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "64fc7e4a4c6e1f3ea440b65da39cdc4029372e3b0bece316f1e41095ba3104d2",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Effigy" }
    }
  ],
  "92274971-7c4a-4326-b0fe-75e2d124f718": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "e0ef3178bde4cac3a264b3763eec146f2cee4f9c5ad5f71b9bcc121dda5e1f4c",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "92bcd1ce-19b1-4d78-8b09-95242ca08d76": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "67c474d735312654b19a07fc31291321c448f7c0b1bd6ecd57be9dbf89be10aa",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "92ef316b-dd22-40d1-82e8-8890976684c0": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "8622cda0868e76aea20f5b86d1b9c239798c7c4b3425f372b96a4fa5ac105c89",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "8622cda0868e76aea20f5b86d1b9c239798c7c4b3425f372b96a4fa5ac105c89",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "W", "U", "U"] }
    }
  ],
  "92f1509e-6ed5-4009-a031-ea84b43cbd1b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "997c9060c0406e4b5284292cc9da3da3670a6f08f0e8edcb0e9a11afc5db43cf",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Interrupt" }
    }
  ],
  "92f7a995-c648-4835-8df3-135d7472cd2d": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "8a624733d54667695c60a0178b1473d25cea23d27a67ce7899bb743ac486671d",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "9337996e-a119-4529-b422-f6d286c78e3f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "11cc01968e6f1d6583b25417fd92f7ab06c064126195aa47962b733408a7b3ad",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "9359f60c-9a27-4e53-b35b-964a121a6fba": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "a34ce5d64b02b8ff504836f466905ee05d348bd669c4bdf7051eb10ea26c7d91",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "936a03a5-73ba-436c-9d49-70e176d118e6": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "c5ad52a58fbb8022829a1fc6bfbe070fa89a43d163704fd58f5bd660e9863fa6",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "93842064-a0a8-4e4d-9c8a-e8a86448d225": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "1fd174b33d1e39af80f91fb350568e7cf83ffb35e11d6c3c31dcc42c32f04b39",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "93850e74-744c-4261-a84e-01eaced6e49a": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "08d123d817b227b126f4b3df08d6a7d6e4891f6e5a397290f88d4a6ee3b9b8dc",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "94742003-f0f1-4483-b1a0-e7163995db1b": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "54e05dd466972146ac3ac58b0d8e0f7a79e5bb90a82489654af3504e4351fcbc",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Sorceress" }
    }
  ],
  "94896e0b-859c-47e4-bf27-35ed37b841e0": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "48df8d7930c69b17cef70d8a1ac22162dbaaf300ce09b9e95fe765805c8ab56c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "94c2880d-b37a-43ea-9fee-cd5a8ed75a7e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "be07b3a0f04af1bfe264a8df729560b497bb8a0b798f3c2216ac04db88b7a9a7",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Being" }
    }
  ],
  "94e2aa9e-af6a-41c6-99a8-ca9335730ddb": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "4134925ba3a5d5dfd42a1bc2328226dfdc2795d8c4723b382fa71e25047ec12d",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "94f7e24c-2546-41b6-81ad-5e920b07e64e": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "d12ddf81190f8326e8d9a2acc921ab8a5d6940431d8e0fbd7c0d845b6631f482",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "951b6c10-cbba-44b6-aae2-2c386b7ebacb": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "db3e291e89a0481d37189c610beb9143a2ba7b1e88c46451ab43e9aa61223d4c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Zombies" }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-text-outliers.json",
      referenceSha256: "db3e291e89a0481d37189c610beb9143a2ba7b1e88c46451ab43e9aa61223d4c",
      reason: "Exact high-resolution printing scan reviewed for rules and flavor. The activation cost is followed by a colon. Printed flavor punctuation is retained; its ordinary wraps are not forced. No layout offset, forced soft wrap, or Oracle correction is included.",
      fields: {
        rulesText: "{B}: Regenerates",
        flavorText: "We asked Captain Soll what became of the Serafina, but all he said was, “Ships that go down shouldn’t come back up.”"
      }
    }
  ],
  "952ba126-0915-47f0-9b6a-a0a6dcd22c6f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "8de855dd021e7aefc252011acf6e5924ba9ea26d6722a50206ea9da946aadfc7",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "9598a9b4-15bb-4645-92ed-8eedef75dc24": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "3ba0975cd22d2f7878d198a531525cf24cb622b11eaa155be8cf9b63e5b64e22",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "U", "R"] }
    }
  ],
  "9598b346-a47d-4c4c-9571-156824e86b9c": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "8ad4a4d12627367713f25554cbf625b28d530669daea4acf4e2a2f0c74a94a72",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "95b03586-8d04-4114-a7ce-b8c8ab5ff857": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "8f0e994f844dff64de38980b92b588056625a6906b2f0cf7366360be1d180032",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "U", "B"] }
    }
  ],
  "95b265bc-a94d-403b-8232-8fdfa0f8d9d5": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "75b1fc6adf5daab8ec3840d548b9b877d7a45d215dc2b0615008bd551a72f788",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "95e936cf-3bbb-4f3b-8e1a-4be1d4702b99": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "b6f59ea074de95703d3648989674f1ed402af24430f828ad3eba277cbd9a0ec3",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "95fde48b-e40a-4183-b324-1ec276dde015": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "d392ff6d11bfa71a3a106e4c992a77de8c4adb9cab9446d54ffb01c4187b5a56",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "9640785c-be0d-4502-9995-f93ac00f1b2f": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "775e49e261b92b2af60d11b65790018409d6f59a7d97610ea5c34c00486d041d",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "Cursed Land does 1 damage to target land’s controller during his or her upkeep.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Cursed Land does 1 damage to target land’s controller during his or her upkeep.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "965f722c-2b18-4c22-8c30-12552def5940": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "4f18a1e000fb4f022beac71e91445c2f9f751d347741ad666fcc4e05d1e7f199",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Asp" }
    }
  ],
  "967a26e0-8dca-4215-9935-b77a7dd4dde0": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "03edb958e781d19c1edbc21a987eef5bbe6ed9a1c3a0eda2fbbe00f74c5a4577",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "While controller has forests in play, Kird Ape gains +1/+2.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "While controller has forests in play, Kird Ape gains +1/+2.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "969c104e-daf4-480d-99a2-dd93c498b48e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "fdf9cb83bb36336d0c0e7b6d602a1164f8f6eb928b22b7175bc325b599c58b86",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "96f73f9c-1c4e-4343-bfa0-cc5c4a7a562e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "986cb220cf4cee37dc5b46ca4e64349bbd20c7c0561531ad53173d11b90ecc4c",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Manticore" }
    }
  ],
  "96fff700-af02-4861-b7ed-be9950e69bf1": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "6ad7687aa205eeae58ad35ef7dc8c750339a1c56839a1dc6c69c4341c413a33c",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["R", "G"] }
    }
  ],
  "978f09dd-121a-4da5-ba16-5c03fbdce084": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "065aa42d1fd83bd056e3e54a01c445b99e2cd8457011ad432a0575fce2db88d2",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "97b80124-2b59-425c-93cc-9b032e631c6e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "41949eee8f50fc9f91038160fa13642eaec001c5b1efc72b1549577bbe6aeef5",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "41949eee8f50fc9f91038160fa13642eaec001c5b1efc72b1549577bbe6aeef5",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "U", "W", "W"] }
    }
  ],
  "97cdc38e-1d96-4de2-98e2-713f5d4d2180": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "4f2617a97c9a9b8ae7c6ef0aca81588e04c333d3ec3a4d48fd01deb552f858a6",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "985164ba-0c30-42b1-a8b6-3be19251359c": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "3d326ad4f9820bd0bc9080071c6868ff7c16dd162aad81f61d19e49ae99e0fa7",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "9869a753-5e41-4098-ab41-e75b4396ec50": [
    {
      faceName: "Emeritus of Truce",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "d6f4a674fb3b2fc929e2f45653e1886cd3a5fd14ce53162ea3a2f2e2d98d5620",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "When this creature enters, target player creates a 1/1 white and black Inkling creature token with flying. Then if an opponent controls more creatures than you, this creature becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Cat Cleric"
      }
    },
    {
      faceName: "Swords to Plowshares",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "d6f4a674fb3b2fc929e2f45653e1886cd3a5fd14ce53162ea3a2f2e2d98d5620",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Exile target creature. Its controller gains life equal to its power.",
        typeLine: "Instant"
      }
    }
  ],
  "987557ee-8344-4191-b85c-f9dedf4d1614": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "b35f12a4bc4b1508c4288290898c741487224a78ee29fdbf7d4c99e36ce1e821",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "9899352a-a4c9-47bf-b9cb-0c34060ae1c4": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "2b5f187fb08d87e929b10737cb6de1702363bba5527df3adf2b54cd026edcecb",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "9903c043-9a7a-4994-b532-136d4c46edfd": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "ae2f9e2a73ae131ecdb73121de80acffd275f060543dc069c148e08313b8bdcf",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Monster" }
    }
  ],
  "9941f83b-2903-4eab-ac6d-5313e3978fa3": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "305b12ad22f84ed767ff27f0b58b8055e65a7f03197f827973513f5f301b5038",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Guardian" }
    }
  ],
  "9964d8d8-dc97-4e5f-9f52-173f7e2c37fd": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "b49d3f5418ce6682652742af9996fed2cc4161489a2daae6e79a8c04327ea934",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "99713bb4-186f-42b6-aa66-e94ec8858e6a": [
    {
      source: "games/magic/fixtures/accuracy/m15/annotations-walker-text.json",
      referenceSha256: "3c8a6d0cf93ef85c90eb7b41015d51b4858d9bd244a9061b1cc9bb205efada40",
      reason: "Type line visually checked against the cached M15 scan. MTGJSON originalType contains the later Legendary erratum; only this field is certified.",
      fields: { typeLine: "Planeswalker — Jace" }
    }
  ],
  "99cc045e-01a8-4f14-a86d-0a67ec35d6b7": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "50d4d58e3d1941e9dc0c38a84e69dc7dc499339733576310ed81747bef17f443",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Spawn" }
    }
  ],
  "9ae81ec7-2b7d-4301-8114-032be5e6b663": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "fc05d819638ace7f3120144d5b65d2e8d531da33fd23837d5a2802fd409fa273",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "9b3d34fa-398c-4ea0-a392-6690bd3a615c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "1063b3552d4efd96b7a1ca3b5efbd6f9974863ee2da6e5e3b3ad628450ce6560",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "9b73dfb4-d930-4a89-b621-129dd9f6328c": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "5f49dcf77a8688349241b6bf86140004b43ff47e5381b23e718612c1ab6e42a3",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Goblin" }
    }
  ],
  "9b79eaa0-8a15-4828-9ab7-16c2aab5f19f": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "e36efa9b04e53bc993f02bb65a6365d82c29c1ea9d19cff041da601439fae72c",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "Target creature gains protection from blue.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Target creature gains protection from blue.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "9bf9cccd-fe97-4632-a90a-9eeb0d41135e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "558cf75e1423afe8fdb71929f3ff2648ddcd258451ff2cd7ced3a2d308aa2bee",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Guardians" }
    }
  ],
  "9c0f60a6-b5c8-4704-8b61-94e8fc463e5d": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "9035ce97cf2a4ac14658c92db72fa8bf77e0187bd5d642411afd2b01487acceb",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `As an additional cost to cast this spell, sacrifice a creature.
Draw two cards.`,
        flavorText: "“You were so eager to take and consume. Yet when asked to give, you refuse?”",
        typeLine: "Instant",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "As an additional cost to cast this spell, sacrifice a creature.",
                italic: !1
              }
            ]
          },
          { role: "rules", runs: [{ text: "Draw two cards.", italic: !1 }] },
          {
            role: "flavor",
            runs: [
              {
                text: "“You were so eager to take and consume. Yet when asked to give, you refuse?”",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "9c12ee9e-db13-4b4d-a061-b6566f538f09": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "0f3d68b4fe18b125dc16a2cfb90ec367e895b1e28a17430e690ec89322809131",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "0f3d68b4fe18b125dc16a2cfb90ec367e895b1e28a17430e690ec89322809131",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["5", "B", "U"] }
    }
  ],
  "9c1624f7-8275-46d3-ab7e-7b162e27593f": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "f730c8a9fd8eb644fec510b31ad6091c655562b7ad709c8bbb301cb41b40ba6a",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Flying
Selenia, Dark Angel counts as an Angel.
Pay 2 life: Return Selenia to owner’s hand.`,
        flavorText: `“I am light. I am dark. I must give my life to serve; not even death can release me.”
—Selenia, dark angel`,
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying", italic: !1 }] },
          {
            role: "rules",
            runs: [{ text: "Selenia, Dark Angel counts as an Angel.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [{ text: "Pay 2 life: Return Selenia to owner’s hand.", italic: !1 }]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“I am light. I am dark. I must give my life to serve; not even death can release me.”",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "—Selenia, dark angel", italic: !0 }],
            align: "right"
          }
        ]
      }
    }
  ],
  "9c406b25-03f8-4aaa-9ea7-48bf754166b7": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "938e7fd382845512ff1c26ee4f90cde4f74f7dac8f1b84d4f9849d6b73e1f256",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "9c4defc2-b1a2-4ae2-bda0-24ecd4ff8181": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "b1733531d412bca32e3be5a190a856b9da8a6f4ddf0b2dee8a5c6b55cca11f73",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Egg" }
    },
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-text-outliers.json",
      referenceSha256: "b1733531d412bca32e3be5a190a856b9da8a6f4ddf0b2dee8a5c6b55cca11f73",
      reason: "Exact scan shows a discretionary hyphen in ex-actly. U+00AD permits this break without forcing a line or changing unbroken wording. Rules and absence of flavor visually checked. Oracle wording and layout geometry remain separate.",
      fields: {
        rulesText: "If Rukh Egg goes to the graveyard, a Rukh—a 4/4 red flying creature—comes into play on your side at the end of that turn. Use a counter to represent Rukh. Rukh is treated ex­actly like a normal creature except that if it leaves play it is removed from the game entirely.",
        flavorText: ""
      }
    }
  ],
  "9c78c2f3-2f40-48ad-9dc4-55d1fa399a56": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "d6098e1e2cf31f5748a83e69802f4b3f68f72e7b963be6ad2d0496123090afec",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "9c9d5f72-e199-4d5b-ae7e-cc5b9bdfae99": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "a63b84758bb5fa1edd119d69b860ef03b2f425c579056c08e0e451bbbd995c41",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "9ca19b39-4201-463c-bd40-fbffa31c9eda": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "a9920f65726e56d33a64b32b186f29fd9034f2881d3585de298f285fc36da8ba",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Land" }
    }
  ],
  "9cb767eb-2161-4068-be80-c3cf68945393": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "7c6299d5bc7fc55bea7f6ff39f4ff0e463a26902caeb66dbd271b1091db0a008",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "All black creatures in play gain +1/+1.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "All black creatures in play gain +1/+1.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "9d5911b5-a54e-4ebb-9c36-d4dc8e97bb4b": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "3685744e9a1d8a88fe156a682a3255f0db2780f333aa3be94291a85fd512ec84",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Niall Silvain" }
    }
  ],
  "9d9b9eb8-6367-4ab5-8e00-a9c9e1d69032": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "60ccd025d93043454f8f9ffe9eb3ad8d6e5db2ecd63363c22da831ab879eedfa",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wombat" }
    }
  ],
  "9dc7ab05-a5f5-4a02-87e7-3c47be35b5cb": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "8cb40a0eced583a6db78f220e378ac905f40a5597f757dce07fda78f8ab4d792",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "9dd6a230-6bc0-499c-b7fd-4aaa2569f98f": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "c70e4e1ee08241f3d0733e81a0923f899363d42e0c3c7cadc6e8eaf3d5c4dbf8",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "9de534ff-fb48-4692-bd0f-dd237ca28502": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "b2f066a665e41f7b100691ecf448a4787a0727590770864ee1275da32ab7007a",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Land" }
    }
  ],
  "9dfbcb4d-a9ae-4d76-8dde-7312fbad56b0": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "3946938273598517676c657df2b474e578be9e90eb4d0295674e3d70a7f3fbe5",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "3946938273598517676c657df2b474e578be9e90eb4d0295674e3d70a7f3fbe5",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["G", "G", "R", "R"] }
    }
  ],
  "9e14db1c-0a05-47d2-9f27-df881f7f37ab": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "4d28bc032d34869d17ff29e8c6a3e3d558bc6f92ace9df2b77db9a20863ea892",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Mob" }
    }
  ],
  "9e7b5b00-9d14-4090-b8c3-28b70375571e": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "97d512cd4eb16ce6f7d3693a79e86d6de700623aedc708cb03b30a7dd08e3e07",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Shadow (This creature can block or be blocked by only creatures with shadow.)
{U}: Put Thalakos Mistfolk on top of owner’s library.`,
        flavorText: `“They are ‘between’ in every way.”
—Lyna, Soltari emissary`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Shadow ", italic: !1 },
              {
                text: "(This creature can block or be blocked by only creatures with shadow.)",
                italic: !0
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "{U}: Put Thalakos Mistfolk on top of owner’s library.", italic: !1 }
            ]
          },
          { role: "flavor", runs: [{ text: "“They are ‘between’ in every way.”", italic: !0 }] },
          {
            role: "flavor",
            runs: [{ text: "—Lyna, Soltari emissary", italic: !0 }],
            align: "right"
          }
        ]
      }
    }
  ],
  "9eae0ba1-1383-4505-b4e7-4f17dd8f20c5": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "d85bee5fc92c84e67d865e799d0135820b1b4f416f0a71ebcc8b265a6d0aa58d",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "9edc5392-0529-471c-858f-5602aabb626c": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "2f0e4199c9cafe5a65263e439f520269787c1f97f53b115756e589aab0b78884",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Wurm",
        rulesText: "",
        flavorText: "The most terrifying thing about the craw wurm is probably the horrible crashing sound it makes as it speeds through the forest. This noise is so loud it echoes through the trees and seems to come from all directions at once."
      }
    }
  ],
  "9f310cf5-0985-4826-9779-19a713089d6d": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "52c0229faf763edbc772a0365a293f76cda030dd991db65277d124c9758fa25c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ogre" }
    }
  ],
  "9fc0d070-8a42-4d5e-8f2b-ceb59147de6f": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "739e5982d5d4d8a669f39ac86dfe2f88aaca4fe3d19c3cdb98adfb5b8cc6ac1a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Artifact" }
    }
  ],
  "a000777b-e8fe-4fd6-a455-01bc9056a873": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "8fda485d8aa350b2e2535049c40efafef0a233edf11d961875ee277b40388374",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "a0367e54-eb07-475a-b06b-f869a046a86c": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "5aa298c5055d7a74d7e767d68afd253ecbc661e499583272117337f542ffd4d8",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "a03e8c5b-f4ed-4fd7-ba05-db813ccc05eb": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "c9c11d4952bf54eed16c32adaad541d8f865533c02197a95ed10ad1ecdbde5d8",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "a0bcb638-c3c8-4973-9537-5c471f43f34f": [
    {
      faceName: "Lluwen, Exchange Student",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "780b2a6279aea0edc9cdb86364cc7b12bcf4eacf009fdf36ca97998eb483ff1f",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Lluwen enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)
Exile a creature card from your graveyard: Lluwen becomes prepared. Activate only as a sorcery.`,
        typeLine: "Legendary Creature — Elf Druid"
      }
    },
    {
      faceName: "Pest Friend",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "780b2a6279aea0edc9cdb86364cc7b12bcf4eacf009fdf36ca97998eb483ff1f",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: 'Create a 1/1 black and green Pest creature token with "Whenever this token attacks, you gain 1 life."',
        typeLine: "Sorcery"
      }
    }
  ],
  "a0d3ce01-e344-4608-b709-320be3600019": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "39647db57ccb7a3a4840e4f122a7177675e82ff830b67b20bb01e7f7a65a46e9",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "a0e8f8d8-eac0-451c-a167-be84667a8e3d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "e667062885ce3c9bbe2cbe2a545b1240734bfc0fa7b562777c35e9e4f4126cec",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "a0f5c6bc-65dc-42a1-a62d-a0b101310a1f": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "c30455767ef3f4dc9701f11610f6a785489701a99f1ceb266f80ff781587365f",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "a11f55e8-7f86-4ca9-b737-9a920d9cf282": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "02fd4222a4dd0970eaa593a2d0afffe1c44034d763a3dcd016032ff83dd7da00",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "a131605a-f646-4745-a1e4-48d155a3d94f": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "b3c99a27ac58d294830aa1940681d0e338604f188643892745a5950e76de8f98",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Robbers" }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-text-outliers.json",
      referenceSha256: "b3c99a27ac58d294830aa1940681d0e338604f188643892745a5950e76de8f98",
      reason: "Exact high-resolution printing scan reviewed for rules and flavor. The flavor attribution continues inline after the closing quotation; printed apostrophes and quotation marks are retained. No layout offset, forced soft wrap, or Oracle correction is included.",
      fields: {
        rulesText: "{B}, {T}: Take one artifact from any graveyard and remove it from the game. Gain 2 life.",
        flavorText: "“If you don’t have your health, you don’t have anything.” —Proverb"
      }
    }
  ],
  "a184cd2e-e27f-44b0-a8ae-9d861280e469": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "2b8c69aa0b30f5d856f1ee4ffa1a387f9d9e5fc1168b4a9f5aba35b234370ee4",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "a1959de7-e945-438c-a90a-158e21c4d5bf": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "d7e0adeb026d4159be4e7b30b81ce5ee2dc5ad87c5bb77562f3355504f1122a0",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "No creatures deal damage in combat this turn.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "No creatures deal damage in combat this turn." }] }
        ]
      }
    }
  ],
  "a1dcf48c-2700-4024-807e-9244e4c649ac": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "121149f7e637af7a7f1824c5005ee287aedd99a4406a1ed8c0db17763ca64c11",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "121149f7e637af7a7f1824c5005ee287aedd99a4406a1ed8c0db17763ca64c11",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "B", "U", "U"] }
    }
  ],
  "a213450f-02f4-4c08-8da8-891ebfa8e237": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "1f3f02130cf2dfe438815636081bcc48241f82289534ae582e303b85d9fa193b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Murk Dwellers" }
    }
  ],
  "a26d1c4d-af95-4b40-83a5-b51f8b2506db": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
      referenceSha256: "12e297a10640fbef837468de1e8e7dd82a8516f6f58430c472976814d9adad41",
      reason: "MTGJSON originalText compared with the cached full scan, including original Trample paragraph and swamp wording. originalType is incorrect in MTGJSON; Summon Mob transcribed from scan.",
      fields: {
        rulesText: `Trample
During your turn, Angry Mob has power and toughness each equal to 2 plus the total number of swamps opponents control. During other turns, Angry Mob has power and toughness 2/2.`,
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Trample", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "During your turn, Angry Mob has power and toughness each equal to 2 plus the total number of swamps opponents control. During other turns, Angry Mob has power and toughness 2/2.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "a2749332-e99a-4a0c-b3a3-5578b552fa11": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "b8b1f12a9b87b7a8d13282728fcb9373c0116511c472ebec6aa829f5beff6180",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "a274a381-4eb0-4e27-aff4-4d94e61b726a": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "179ccfe060bafc61a57f9f66e3ce321d641f2e5df76b797f3d7153e3dc2b161d",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "a277775a-6b48-4238-a618-3ae94c4cc85c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "b99f3c25adbaff8ab6c7f00d6edffd7670177f656581c58d024ce6f489dcec11",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "b99f3c25adbaff8ab6c7f00d6edffd7670177f656581c58d024ce6f489dcec11",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "G", "R"] }
    }
  ],
  "a2931ae0-7836-4000-b9ec-f2029ebf5d96": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "fe67d75b23af23fd6b224eb4f297ee16bbbcfe6a0535d449f8db3e497469f1ea",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "a2f6ef2f-a3a2-4e1f-b7eb-59abc8414114": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "52b1a1527098ff99e332db2faf00b3fff0c6e956f4f9b8a73fd01173117de6b5",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "a30abb09-2f80-46cf-a839-b4dac5c23dce": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "deec671c58fd3af64d31ada8bbdff2a0dedef0d6f715f5b3f2b1447f7b5f2fb2",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Zombies",
        rulesText: "",
        flavorText: '"They groaned, they stirred, they all uprose,/ Nor spake, nor moved their eyes;/ It had been strange, even in a dream,/ To have seen those dead men rise."/ —Samuel Coleridge, "The Rime of the Ancient Mariner"'
      }
    }
  ],
  "a30bb266-5bd1-4998-ae94-56f0f3354167": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "9b284396a6eba07ba7b2ae7fdd8ea5309b2302c9eb74b0402c734f739edce836",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "a3393436-3426-4903-8f41-7abcbf6c18c2": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "30b75aacfbf2b775f78ae1aba468671091971339f9c67ae35a4f654d55e2db47",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "a3544148-49b2-4320-8e3a-5bab81e0f7fd": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "28ab583ef31670808bcc4ab4331c3f8b4d82beb5ca57245d096bffd74c1cb41a",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "a38059a8-be69-4cc1-969b-951c610f2f11": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "0257b79a3f3d50ec2c1e254679ff971a4f3c9fbe72c26787cdc9c2416d0e2d2e",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "0257b79a3f3d50ec2c1e254679ff971a4f3c9fbe72c26787cdc9c2416d0e2d2e",
      reason: "Rules and flavor individually compared to these exact cached printing scans on 2026-10-15. Fourteen reviewed bodies, including source corrections and discretionary hyphenation hints. No inferred per-card sizes or offsets. Oracle wording is separate.",
      fields: {
        rulesText: "",
        flavorText: "At a distance, we mistook the sound for a waterfall . . .",
        rulesParagraphs: [
          {
            role: "flavor",
            runs: [
              { text: "At a distance, we mistook the sound for a waterfall . . .", italic: !0 }
            ]
          }
        ]
      }
    }
  ],
  "a3957b43-4d7e-41f9-b7a1-6f57d6603ab8": [
    {
      source: "games/magic/fixtures/accuracy/m15/annotations-walker-text.json",
      referenceSha256: "eefd03b08f5b338b4626bddc5ee67be16224b43ab4115ddf46022995db80f9f9",
      reason: "Type line visually checked against the cached M15 scan. MTGJSON originalType contains the later Legendary erratum; only this field is certified.",
      fields: { typeLine: "Planeswalker — Garruk" }
    }
  ],
  "a3d1f470-058d-41b7-acaf-4f68431de9ed": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "60028117d707ecaa16c1630737837ad60f6c26a027c49985f36ff26156c58fc7",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "a3e81250-52c3-49f6-be43-17c34339e177": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "5a42706fd20f3c69e0208f5e1605cd923b332288b0840ad4d3b17dec7a5718a6",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Dragonfly" }
    }
  ],
  "a3eedc11-0b47-430c-8391-577a2d05c2ae": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "92beebd404e56fca9b17c93e144eca7e2a9bc6acfb97108deeb555125dabd405",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "a432d6ae-a17f-484b-ad55-4b4b6674ba8d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "a34ce8a1d6ecee5da56e04c1ca4519cb5ecb68c93c1748c598fc65276962cd36",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "a450ce98-4854-4378-8809-27019b3800c2": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "6e89de3344ecadc8a706e01221aa812f10490f76458a41c9fd374b05fc6b9539",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Unicorn",
        rulesText: "",
        flavorText: `"'Do you know, I always thought Unicorns were fabulous monsters, too? I never saw one alive before!' 'Well, now that we have seen each other,' said the Unicorn, 'if you'll believe in me, I'll believe in you.'" —Lewis Carroll`
      }
    }
  ],
  "a46e47e1-8639-48f7-94c4-5f9e9666839a": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "0ad820e512c20397766370e5b7eade143838ee4d7d5e048820e9326b808d051c",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Ooze" }
    }
  ],
  "a47417cb-1ea7-4f65-ba06-e27a99373114": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "ce49d5a860e2dc25db566280741f40cea47dad0ff5a36b6fc0e4c28f2f3b67df",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "a48bd745-5e9f-4807-97b0-29222a5b838d": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "1c88e91c94fc3725043069616cd127fd2085a8012887f28fa69323372d9a505d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "a4901260-073a-4d06-8167-c322c55ab210": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "11325d3627fc0e243aa496ca0f0e514937aee14a5d80ece491ee28fc9058738d",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "a49ba1a5-33b1-40f2-9780-26139ed829d7": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "156b3693109f244bfb9ae901f476e2ba43683442a80cc15dd75f90b96e0018e6",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "a4c9667b-1d94-42eb-ae8e-1ae4755e200a": [
    {
      source: "games/magic/fixtures/accuracy/planar-printing-corrections.json",
      referenceSha256: "0d4776587b260561aa5070fc455520a15cbfd7e707aa868ce9155a0524b8c17f",
      reason: "The exact scan includes an em dash after Choose one; cached MTGJSON originalText omits it. Restore the scan-reviewed rules sentence, retaining the original semicolon-separated choices. Oracle wording and unrelated printing fields remain unchanged.",
      fields: {
        rulesText: "Choose one — Prevent all combat damage that would be dealt this turn; or regenerate target creature; or counter target spell that targets you."
      }
    }
  ],
  "a4db5af2-9caf-4493-b340-6d64021139e2": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "95eb03aa7d6b09eaacb8de595d1883d226b677be20dc9c1074bde5bdf124a310",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "a5032bf0-f9c0-4ef0-8ec2-fe7ccea9bdf3": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "49ee328176a3f6ca277c13b7f006f8dca22ad89fd8b35c2d590e939dfbdf099b",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "a5354edc-03d7-4176-a211-174374a9d912": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "143daab51bf1d8a6a73e7b27645c08ec43094558cb51d952c550cb3608d3d557",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "a54246c9-5e5c-484e-a546-ae1f9fd020f3": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "9412a88e9c268258c1e2a5f86a16abbeaf808ca873c6453fc3049b7f8a8f26fd",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Counter target blue spell or destroy target blue permanent.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Counter target blue spell or destroy target blue permanent." }]
          }
        ]
      }
    }
  ],
  "a558f23c-c2ce-40d0-b894-f8ccbff8f622": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "1ba25d44938b1355c40958ac529a131538e68711a61283e9c40e9ed8c78a087b",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "a5899b46-226b-4be6-8e80-d2396f54210d": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
      referenceSha256: "3563da1b85a2a946c345aa9f5108164b0dd64340178052d5a5dd9d9c04cae91e",
      reason: "Text-inset study, retaining prior reviewed wording. Adds scan-reviewed Angry Mob originalText from MTGJSON. Earlier stats studies and capture inputs remain frozen.",
      fields: {
        rulesText: `{T}: Add one colorless mana to your mana pool.
{T}: Sacrifice Strip Mine to destroy target land.`,
        flavorText: "Unlike previous conflicts, the war between Urza and Mishra made Dominaria itself a casualty of war.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "{T}: Add one colorless mana to your mana pool.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [{ text: "{T}: Sacrifice Strip Mine to destroy target land.", italic: !1 }]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "Unlike previous conflicts, the war between Urza and Mishra made Dominaria itself a casualty of war.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "a5e4a23b-3b05-4240-9565-bdd8f3f3ef12": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "cce8714164923da1004d9e7073e6a23bde951593efb0e6a24f62715a6d26b2c5",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Wurm",
        rulesText: "",
        flavorText: "The most terrifying thing about the Craw Wurm is probably the horrible crashing sound it makes as it speeds through the forest. This noise is so loud it echoes through the trees and seems to come from all directions at once."
      }
    }
  ],
  "a5f23039-45ca-4c15-af50-bfd40ea26453": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "89e16886110a7068d78349980f0fce4b9f7a5cd7d6b7f5955c5db72f1a987c6c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "a64d4f93-0c04-4078-aec0-7e9de92f260f": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "05e9de7c7534c96ce20f87051eefd41183d0c7e810f87eda46d87c4989ff5fe7",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "a67e8214-a192-4143-9d5e-d0e254e1bf6e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "1487c1b620c98af4a4ce707cfbcde5a2070874400b9c899bd827bcaf744ab7b6",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "a696c5b6-f216-454d-8029-74e84bbd1428": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "242f0ba967d7b715bd3896f57c15c66c32b60c88594e3e360da2dcc5db58ac93",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    },
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-text-outliers.json",
      referenceSha256: "242f0ba967d7b715bd3896f57c15c66c32b60c88594e3e360da2dcc5db58ac93",
      reason: "Exact scan shows a discretionary hyphen in the final Assem-bly; the printed Mishra’s apostrophe is also retained. U+00AD permits this break without forcing a line or changing unbroken wording. Rules and absence of flavor visually checked. Oracle wording and layout geometry remain separate.",
      fields: {
        rulesText: `Tap to add 1 colorless mana to your mana pool or give any Assembly Worker +1/+1 until end of turn.
{1}: Mishra’s Factory becomes an Assembly Worker, a 2/2 artifact creature, until end of turn. Assem­bly Worker is still considered a land as well.`,
        flavorText: ""
      }
    }
  ],
  "a69dc4ac-7354-465e-b859-d8556f3b1498": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "c65e3f81ad0f8d9b4446b1968eaafe03b8f496d5a8718f74ca6792cf63cbf04a",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `At the beginning of your upkeep, Grim Feast deals 1 damage to you.
Whenever a creature is put into target opponent’s graveyard from play, gain an amount of life equal to that creature’s toughness.`,
        flavorText: "“Hmmm—midnight snack.”",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "At the beginning of your upkeep, Grim Feast deals 1 damage to you.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever a creature is put into target opponent’s graveyard from play, gain an amount of life equal to that creature’s toughness.",
                italic: !1
              }
            ]
          },
          { role: "flavor", runs: [{ text: "“Hmmm—midnight snack.”", italic: !0 }] }
        ]
      }
    }
  ],
  "a69e2cf8-5ecb-485a-92a2-b4e0a7959f1f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "44d7a8a248b3dbe5313ce694c70a51e7eafbc47a066e9ab302f9b208b8f611e5",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Abomination" }
    }
  ],
  "a6a86e6e-bfff-46af-9d36-c912901fea92": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations.json",
      referenceSha256: "f35cfcf6fda28ca28d9c1b416c82bec40a3d76701d989080e1ab42e177790d56",
      reason: "Eight development scans visually reviewed. Printed wording transcribed; soft wraps are not forced. Poetry line breaks are intentional. Land targets retain semantic subtypes and require an actual historical printing policy. Expected alignment/artist are review targets, not geometry overrides. Heldouts remain unviewed.",
      fields: {
        rulesText: "Psionic Blast does 4 damage to any target, but it does 2 damage to you as well.",
        flavorText: ""
      }
    }
  ],
  "a6b61512-5b24-424c-966f-36b595781e14": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "fb0595cdb9f67ec9e734bcd8b2759be484ee621aaf4004776cb494debfedf35d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "a6bf858d-bba9-4a16-9045-55384b1de633": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "00173578b1223a021e95bb23f311646d3c45f337af7c75dd16f0267b85732ab8",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "a79c99e1-722a-44b6-8fa3-2be3f0c193d8": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "27cb2a8606c83e3ad06d21eee1664dd2840afcdda334e35f4d6fa1ffae9d88ea",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "a79e9236-a39e-471a-b18a-2c2ba16e7774": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "dacf537dd6695fb95f666b7d7b86563c1b98059d383ed747a0cabc95453e6e46",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "a7d64600-84fc-42a5-a6a6-b26f98fac0a4": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "22b04712df910695fe53c0c02fd6f27a9dc46cb4e5f9346dc4486f11e0aea59a",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "G", "W"] }
    }
  ],
  "a804f742-f7cf-427e-ad0a-742587328156": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "5f2415a6a8a0fa743fd1ab380c926c18647e60236579acf7e37667cfe9844a32",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "a82c87b1-de37-4423-a1a4-533a1d8108b2": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "294e95112a2c2bbbfc41912deeb01b2df08af3ca2c7e2ff53cbba7e34bdf47d1",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "a83cb1c4-7c5b-4a5e-b15e-138d644f5cdb": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "db3c1fb0aa2050e1b709aa7f7a379b83e457015ad75ae2593cf93150f06f9ea9",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "B", "R", "G"] }
    }
  ],
  "a86190bb-1f41-4128-b9fb-dfb1d178359d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "47ae84ae41b95793a28693118a36fcd6ab88a191928595c0d66375f950446d60",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "a89ad9fd-33a6-4d31-9f4c-8bf192882f21": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "7ebb55a8fb26318dee8ca05f0b2d5ac82bf858cdf8103a772c8c351e9f454cd8",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "a8f05d5e-bb7d-4554-b880-f0c6b4688357": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "54192653f5cb08d27aeaae15bf494bb61180de2f7da64bd444092d2c73dd1730",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "a90442e8-9d22-4767-9e08-bd314169ea70": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "e2f867aa9a1bbc0972efd79b669faf527482f857838cc638146a410c0537a18f",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Krakilin comes into play with X +1/+1 counters on it.
{1}{G}: Regenerate Krakilin.`,
        flavorText: `“A perfect reflection of its world: brutal, fetal, and lacking truth.”
—Oracle en-Vec`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Krakilin comes into play with X +1/+1 counters on it.", italic: !1 }
            ]
          },
          { role: "rules", runs: [{ text: "{1}{G}: Regenerate Krakilin.", italic: !1 }] },
          {
            role: "flavor",
            runs: [
              {
                text: "“A perfect reflection of its world: brutal, fetal, and lacking truth.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Oracle en-Vec", italic: !0 }], align: "right" }
        ]
      }
    }
  ],
  "a9256cc2-d4b5-4103-bda8-2d9c98c4fd7d": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "e326e9f4f94e8b579331388508145d62699273f84a3ea3a7fc63e73b5381e5a6",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Beast",
        rulesText: "",
        flavorText: "Its diet consists of fruits, plants, small woodland animals, large woodland animals, woodlands, fruit groves, fruit farmers, and small cities."
      }
    }
  ],
  "a95b6baf-01e6-49c3-9a26-394b127d53c3": [
    {
      faceName: "Jadzi, Steward of Fate",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "cc41f770fb6192897d24501125cbad80cac3d2c4aef25bc8716eeba940a6a325",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Jadzi enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)
When Jadzi enters, draw two cards, then discard two cards.`,
        typeLine: "Legendary Creature — Human Wizard"
      }
    },
    {
      faceName: "Oracle's Gift",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "cc41f770fb6192897d24501125cbad80cac3d2c4aef25bc8716eeba940a6a325",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Create X 0/0 green and blue Fractal creature tokens, then put X +1/+1 counters on each Fractal you control.",
        typeLine: "Sorcery"
      }
    }
  ],
  "a9b07dc4-21ad-410b-8f8a-2b034253bfee": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "20a4c5df57ba84770ac1e778d888a1252acdc20f30f1a7ac81180a780fd8d1bc",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Artifact" }
    }
  ],
  "a9c5dbc6-b0c5-4ae2-8c23-a26524fee543": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "9aa0eca74a46f696e2047ac7247298fa8ad9cb4d98458fb33adf010ab53b0017",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "B", "B", "R", "R"] }
    }
  ],
  "a9c6c759-aabf-44e7-ba8c-33c5df232b56": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "852aeb3cf83374d9ac80e9bfd9789f18d4a1db07b20c5eed57aa34b22e9dbf04",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "aa1d9bb5-972a-4705-bf22-0fa1e974dd26": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "3b728a57b2bc1270e354b096e9ee350c86088008262e46bd433673487ae0b111",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "aa2d778d-d74b-45ec-a86b-5d52ffad6ba5": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "2e023f5d45f3981f0aa8946ed2e90fdb6fb6975fb44193cfa3bc4e7a7594a6a0",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "aaf53dfe-5d48-4811-b2f5-5a5c1cb462ca": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "2c1b4bc8d89c7702accff1f22550a28401bb2a213c91e478c07a6bff743bc5f3",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    }
  ],
  "ab85551f-c9cc-409c-9fb5-a45de695e521": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "a1b9aab3ec0c77deeaab3896f43423723b3746f02eeceac4b58067cb8e1edc21",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Zombie Mob comes into play with one +1/+1 counter for each summon card in your graveyard. Remove all of those summon cards from the game.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Zombie Mob comes into play with one +1/+1 counter for each summon card in your graveyard. Remove all of those summon cards from the game.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "ab9d0e3f-cf7c-41f8-bcd7-bb08ea8cc2f8": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "2c9aa6e2e1198e37854cbb36232aaadf4d0e5d52187ffa96515fda491fbac5ec",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "ac095763-6f4e-4d4e-9c99-414646368f8d": [
    {
      faceName: "Emeritus of Abundance",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "dcb2e5cad4c8824240f197cdb294769b2ce4ddd8d4bb70518e6282a18aec74d6",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Vigilance
This creature enters prepared.
Whenever this creature attacks, if you control eight or more lands, this creature becomes prepared.`,
        typeLine: "Creature — Elf Druid"
      }
    },
    {
      faceName: "Regrowth",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "dcb2e5cad4c8824240f197cdb294769b2ce4ddd8d4bb70518e6282a18aec74d6",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Return target card from your graveyard to your hand.",
        typeLine: "Sorcery"
      }
    }
  ],
  "ac09a506-427f-4636-bcfd-b40f8d511905": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "61bf57e9c811754cf0e47b05a51e36fa164335aa800b9c4ea8ab2dcdb2c9fb41",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    },
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-text-outliers.json",
      referenceSha256: "61bf57e9c811754cf0e47b05a51e36fa164335aa800b9c4ea8ab2dcdb2c9fb41",
      reason: "Exact scan shows a discretionary hyphen in the final Assem-bly; the printed Mishra’s apostrophe is also retained. U+00AD permits this break without forcing a line or changing unbroken wording. Rules and absence of flavor visually checked. Oracle wording and layout geometry remain separate.",
      fields: {
        rulesText: `Tap to add 1 colorless mana to your mana pool or give any Assembly Worker +1/+1 until end of turn.
{1}: Mishra’s Factory becomes an Assembly Worker, a 2/2 artifact creature, until end of turn. Assem­bly Worker is still considered a land as well.`,
        flavorText: ""
      }
    }
  ],
  "ac19c5a1-ca13-4443-920b-83b567167ed4": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "0fbbfda2143a6647f993683f61817000b6f4c26beb9ce3a9b2c117dcde6f1c0f",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "ac2655e4-3a4d-4f73-820a-02fab675d42e": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "5e2189a7362a2f5a97ee9ec6c5ba98c9282b65cbff57c1d6c186e254f318d6e6",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Hag" }
    }
  ],
  "ac555709-c7cc-4c64-8a6f-8fe2bc149fcd": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "93e8fde0ba3225a459c83736c0c15a5232907ac2ab87760cf40ab0c3ec840fa1",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `Flying
Other creatures you control with flying get +1/+1.`,
        flavorText: "All the birds of the skies are the spirit’s brood, gathered for safety under its wings.",
        typeLine: "Creature — Bird Spirit",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying", italic: !1 }] },
          {
            role: "rules",
            runs: [{ text: "Other creatures you control with flying get +1/+1.", italic: !1 }]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "All the birds of the skies are the spirit’s brood, gathered for safety under its wings.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "ac77e867-939e-49fb-ae1a-9c1dd5e54a9a": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "97a1bcb9f9987d75beda26306daeac1b621cd6cdad6a741febc2f7373aa62522",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "B", "B", "R", "R", "G", "G"] }
    }
  ],
  "acce83cf-965b-4e45-8efb-63f814df7a35": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "f423c3dcc55cbac73a2f7e730ca86935b5e18d09251dc09a9575ed908273128d",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "f423c3dcc55cbac73a2f7e730ca86935b5e18d09251dc09a9575ed908273128d",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["4", "B", "B", "R", "R"] }
    }
  ],
  "ad1d349b-b5ab-4b2b-9b39-f8d8f6374aa5": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "bcac7424548fc8efc10accd79a08f6517078a21045ef51353d8d77e07fd69a80",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Riders" }
    }
  ],
  "ad402e65-6fac-4005-a2d4-592983df0c30": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "dc5cc95f8a642df2b9fd6e2c8030071db6ac6da266c89bf5496f56886f841319",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "ad41b1aa-1482-4d71-990b-031b30685cb1": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "a5f11b675cc4baca4f8bcfde45ecd890738133e01d9f83e21616f4c3cbc05ad1",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Lions",
        rulesText: "",
        flavorText: "The traditional kings of the jungle command a healthy respect in other climates as well. Relying mainly on their stealth and speed, Savannah Lions can take a victim by surprise, even in the endless, flat plains of their homeland."
      }
    }
  ],
  "ad4974c8-34c5-4290-b325-7586a67f6d56": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "a87ff24f1ae00b843a4388a6ef7c317a27443f834f3aab0d0020e7af5fa4ffdc",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Interrupt" }
    }
  ],
  "ad64874d-ce33-4e0a-bcca-723f129ef415": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "ff125efb0e9995634bf532f0f092f1431262444493c3f1177d21ccb035c1307c",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Elder Dragon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "ff125efb0e9995634bf532f0f092f1431262444493c3f1177d21ccb035c1307c",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "W", "G", "G", "R", "R"] }
    }
  ],
  "ade075fd-73ee-4d12-a2da-48e5938043af": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "63d5b8e8289d56591b7ac184d14c1899c4306db77f9e756f89332589bbf6740b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "adf3ab1a-5714-4b69-bc51-3752312b2d1f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "a50403beb2c45a37b49c0ffb85b37b4cc0d773e6d2c8bf9ccb6c76f441b3cc36",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Spirit" }
    }
  ],
  "ae1d7b09-3a1f-410f-b330-04ae768b0455": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "1f9ed9442741ca759acc74f469a602021aebb06eb7aad95fd370b1b7965dc681",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "ae541c73-9903-49e6-997a-db4701135145": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "1e286c3f0f468eaeb7b57b730e07063e5b11be4a8e4453882084fd63395101ec",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Knights" }
    }
  ],
  "ae91e07c-ad6d-41d9-bd65-184f92761334": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "3707c62b8da21a8851565ddef80c54d74e4e6ae87a4219bb09277ff58bbcf47a",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "aecdc315-95e5-450c-bedc-998eea46cf8c": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "6bd4c70f338d46383440f306434d11fd7bf719d18056af260424f5099de496b0",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: "Choose up to two target permanent cards in your graveyard that were put there from the battlefield this turn. Return them to the battlefield tapped.",
        flavorText: `“As long as your courage remains, your life will not falter.”
—Sephara, Sky’s Blade`,
        typeLine: "Instant",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Choose up to two target permanent cards in your graveyard that were put there from the battlefield this turn. Return them to the battlefield tapped.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“As long as your courage remains, your life will not falter.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Sephara, Sky’s Blade", italic: !0 }] }
        ]
      }
    }
  ],
  "aeeec853-dd3f-4ac3-8b20-c07fada8888f": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "c93bfe38d4741fca38658208f49ad9d724c7307b437e63b01b011cd127d74aae",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "af3cb1a4-2552-4575-be8d-bef9d721cfc8": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "4ad91108b9d43d22e7617fefe06c63c5dd003bf4f0976cc0f4a91d9825057fe2",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Turtle",
        rulesText: "",
        flavorText: "It doesn't like having visitors . . . unless it's having them for lunch."
      }
    }
  ],
  "af5534f0-485e-41f2-bcfa-d65c1a9b86bd": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "addde01c42c5de219ba1b0895d324a2084669f52310045f72ed94a8e988a592f",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "af957200-c538-4f52-b105-6db7a7abb4dc": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "94e73df84348075b1facbea0465d5713a023886bdae6d550c60fe2c498e52b21",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "af9ad645-e605-4048-bf4c-d636584f315b": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "bf398c751bf0a31ac6baf11176291e0ec09e92fbab04cb6474271ebd4b140a45",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "afd08b3b-196e-43a5-9318-9dae9edc6d12": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "434d7f6c63320e0b39c95fb63517345e377b18eafe9760ba50b816ef4a1c5088",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Give target player 3 life, or prevent up to 3 damage to any creature or player.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Give target player 3 life, or prevent up to 3 damage to any creature or player."
              }
            ]
          }
        ]
      }
    }
  ],
  "b0125f79-ff68-4fb9-b309-8d277259f323": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "a3e879fffd6879baed06ff3b567f9b1bc20328599d9392d0399695d0c6332e75",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Gain 5 life.
If a spell or effect controlled by an opponent causes you to discard Mangara’s Blessing, gain 2 life and return Mangara’s Blessing from your graveyard to your hand at end of turn.`,
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Gain 5 life.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "If a spell or effect controlled by an opponent causes you to discard Mangara’s Blessing, gain 2 life and return Mangara’s Blessing from your graveyard to your hand at end of turn.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "b060f747-f65c-4ee0-923a-76298cb51a03": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "516cbb1f2f30c22b20417b247818d6eecd479686952486f9844b6a6a6b6fd8ba",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Evil Eye" }
    }
  ],
  "b08fff47-c3c8-40a9-b3d3-296954aa4ed4": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "106dd6e461bf63bb63ff4fdba11f9b657ae9e73973db49ecee20531cb010e1a1",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "b094f8dd-0184-41a2-9767-e848a6e4eac1": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "cbfdfde9ebc0421b51747e086d74d9503cda3545f805585f1afa73ad33113e45",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "b09aee5c-8b9e-46c2-b4d4-508062f8af05": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "a27abb6ca1d94d719990199e7415f0605c36f9428341f75006ab79129def987d",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Archer" }
    }
  ],
  "b0af9d4c-b3e5-4953-b4ca-7f34f67bdbeb": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "cb7a106b2fd90883dcd9c84d917bb2332e51687a5ed8491b2620e3c16130414e",
      reason: "The printing has flavor only. Remove the modern Oracle defender/reminder line. Preserve source poem-line boundaries and restore printed curly quotation marks.",
      fields: {
        rulesText: "",
        flavorText: `“And through the drifts the snowy cliffs
Did send a dismal sheen:
Nor shapes of men nor beasts we ken—
The ice was all between.”
—Samuel Coleridge, “The Rime of the Ancient Mariner”`,
        rulesParagraphs: [
          {
            role: "flavor",
            runs: [{ text: "“And through the drifts the snowy cliffs", italic: !0 }]
          },
          { role: "flavor", runs: [{ text: "Did send a dismal sheen:", italic: !0 }] },
          {
            role: "flavor",
            runs: [{ text: "Nor shapes of men nor beasts we ken—", italic: !0 }]
          },
          { role: "flavor", runs: [{ text: "The ice was all between.”", italic: !0 }] },
          {
            role: "flavor",
            runs: [{ text: "—Samuel Coleridge, “The Rime of the Ancient Mariner”", italic: !0 }]
          }
        ]
      }
    }
  ],
  "b0bbe643-3e07-4541-a2e6-45c63a5133cf": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "f6f1e97d512b3a3674f43a65aea2b88d4fca7bb0bd57c64fa08e87e32149e16c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "b0d2c643-39cc-47f8-9f70-327f004c1373": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "21dbf9eba5a63f4cb50df2497f09e487a72e789c21bb816ad46f62f4570a5a04",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "b0e1427c-05cd-465b-be59-97ed6e39f7ba": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "ec89722c526f8968bb0a8a734970cdb16976597567584b354be12003ff5f5f17",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "b0f11ae4-e30e-441d-bb64-439930d9997c": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "86316aa75ee88a965fd7fdad0b1c5f17b0dda0a36da27249e02cb9a3ccb38add",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "b0faa7f2-b547-42c4-a810-839da50dadfe": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "3f9ac386a0b1bc74a0298ba1580f257dab6035c8cf47c7b228332fe7af0233ec",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "b1103d4d-b50a-4e2c-b18a-a181bc819881": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "2e96397b0d6864c5ac7e1080dc08f3f9c879b62d001045623f2777077e92e438",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "b12e5430-0e80-47dd-80ac-85728b656a24": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "f38e2bd21007254fc868631d0150157ce24d1cabbc10fe8d948380709b652cdb",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "b14cc32a-eb4f-4690-aceb-160780743ebe": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "05627ef1e4940f3999edc661e0b6f912d19e5dd4f2a919a8d50a7befbed495be",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "B", "R", "G"] }
    }
  ],
  "b1623d57-4729-4796-b3f7-f1837a05c6ed": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "3d6c923b3f65af19921738e967990dacf8396547914f6166b8397f8fe4606975",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "b1dda179-c49a-4995-ba5a-db93ac43dbe7": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "8fab96c98eb440fc63ebd9e0c46addb534377f9eb798b5d0e12860a0def597fc",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "b21ebc9f-a93e-4d18-b3e8-8459e3abbf31": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations.json",
      referenceSha256: "e4c03d6ec855db809aa16089ec6383c309bd262a0fc1b3207f4b355263fa5764",
      reason: "Eight development scans visually reviewed. Printed wording transcribed; soft wraps are not forced. Poetry line breaks are intentional. Land targets retain semantic subtypes and require an actual historical printing policy. Expected alignment/artist are review targets, not geometry overrides. Heldouts remain unviewed.",
      fields: { rulesText: "Destroys 1 wall. Target wall cannot be regenerated.", flavorText: "" }
    }
  ],
  "b24b5864-44c0-4bc8-8705-9504f83b2c03": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "e3c2c31e79106c2035d52b3f6052a1aa6723d4e4b597c5b81ee9cc53c874ce72",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Elemental",
        rulesText: "",
        flavorText: "Earth Elementals have the eternal strength of stone and the endurance of mountains. Primordially connected to the land they inhabit, they take a long-term view of things, scorning the impetuous haste of short-lived mortal creatures."
      }
    }
  ],
  "b2617094-1216-4541-8057-34568defe3a1": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "451c95782ff9f9a5688c05e90b91e4c4d48318de0f27c84042cc4e1a00991d32",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "R", "R", "G"] }
    }
  ],
  "b2779553-74eb-42ba-97d0-96269f48c269": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "bc81cc0822fbd287b4958b3da9f58eb505b6b6cd86b36a6934e95df36f9cdd66",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "bc81cc0822fbd287b4958b3da9f58eb505b6b6cd86b36a6934e95df36f9cdd66",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["5", "B", "R"] }
    }
  ],
  "b28ba599-5299-4831-a118-1712ada10ef6": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "1c15b07f482c64cc93e254e447acbe8c77ca69e8993bee2a4370273241f55459",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "b28f9e63-e5e4-44b5-a17e-8301ff17c623": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "59bee5a0af727710af77d234296eac7ada4251a58c40569039d19f0545969c7d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Egg" }
    },
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-text-outliers.json",
      referenceSha256: "59bee5a0af727710af77d234296eac7ada4251a58c40569039d19f0545969c7d",
      reason: "Exact scan shows a discretionary hyphen in ex-actly. U+00AD permits this break without forcing a line or changing unbroken wording. Rules and absence of flavor visually checked. Oracle wording and layout geometry remain separate.",
      fields: {
        rulesText: "If Rukh Egg goes to the graveyard, a Rukh—a 4/4 red flying creature—comes into play on your side at the end of that turn. Use a counter to represent Rukh. Rukh is treated ex­actly like a normal creature except that if it leaves play it is removed from the game entirely.",
        flavorText: ""
      }
    }
  ],
  "b3724e40-0622-4aee-9334-6c9fff88bcd5": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations.json",
      referenceSha256: "990f864d9eaf9b5536b545256dd90d75174bee836b24905291f069919476a369",
      reason: "Eight development scans visually reviewed. Printed wording transcribed; soft wraps are not forced. Poetry line breaks are intentional. Land targets retain semantic subtypes and require an actual historical printing policy. Expected alignment/artist are review targets, not geometry overrides. Heldouts remain unviewed.",
      fields: { power: "X", toughness: "X" }
    }
  ],
  "b37fd4cc-ab5c-4c65-80ff-8f905b31e801": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "56ccf363f377bc680a9aca19144961f287b637c38d20e7e9ee66339fcaeb9ccd",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "b38ce16b-3258-4019-9e86-156e4738aa89": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "903e94757abf19738c8eacdb28b479a553c56452050c0e3b7e1c9e7310677bac",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "b39eb671-e17e-4c5a-8913-1e3be7faedfb": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "cf211ffcffedc1495a0828bb36e15009f11a5d9f532042a157fb830f152b005c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Lurker" }
    }
  ],
  "b3a5101a-ec66-4658-950c-9ad49c29b836": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "187f7357f8b6c65dee1e765f01b0fbc37c808fcde2cf9be005f742ab8e1afdcc",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "b3a69a1c-c80f-4413-a6fd-ae54cabbce28": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "60f997392c722b5aca17f7005c410130ae2aa1a2873c988531028c20c8dee51f",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "b4075bbc-dbad-4a1e-a992-70aed713a459": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "3ae4bae3fdcd44ee1d6ec0e0ce7ab9250d8e1ea5a00fc191060af68f48d94e1c",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "b4bb98ba-d599-4597-911c-2b472fa8817c": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "83e48c913bbdc62616f58ace4800a17d8a4cbc512c6434b6836eab26d9b718c7",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "{T}: Untap target creature.",
        flavorText: `“We shun them not for their dream but for their refusal to let such a noble dream die a noble death.”
—Eladamri, Lord of Leaves`,
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "{T}: Untap target creature.", italic: !1 }] },
          {
            role: "flavor",
            runs: [
              {
                text: "“We shun them not for their dream but for their refusal to let such a noble dream die a noble death.”",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "—Eladamri, Lord of Leaves", italic: !0 }],
            align: "right"
          }
        ]
      }
    }
  ],
  "b4d3d349-5c23-43a9-b25e-0e1a35b84673": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "e35774564a73f6adc2b806cdea0cc1653e92ef465aa1b21f5e8a7d366bb95d08",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `{T}: Add one colorless mana to your mana pool.
{6}: Stalking Stones becomes a 3/3 artifact creature permanently. (This creature still counts as a land.)`,
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "{T}: Add one colorless mana to your mana pool.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [
              {
                text: "{6}: Stalking Stones becomes a 3/3 artifact creature permanently. ",
                italic: !1
              },
              { text: "(This creature still counts as a land.)", italic: !0 }
            ]
          }
        ]
      }
    }
  ],
  "b4eb3db3-6a7c-488a-9433-d5d1d3133816": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "0b3caaae8d6c166e5dad6bcbc018e26647de34a5b6856c51295cdc92c5fbd289",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Goblins",
        rulesText: "",
        flavorText: "The intricate dynamics of Rundvelt Goblin affairs are often confused with anarchy. The chaos, however, is the chaos of a thundercloud, and direction will sporadically and violently appear. Pashalik Mons and his raiders are the thunderhead that leads in the storm."
      }
    }
  ],
  "b4ff60ce-073c-46b8-807c-8b40467b960c": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "e1db9b3623d2c69b711b6133d554b346c2db9ef4898a82fb38cdcb4789e6798f",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Sage" }
    }
  ],
  "b5883762-ca0a-4932-8d2a-41a45796a5f8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "82f33fe48e87af6f608a2445de56658f139712753a146b16bdc7a75cab779e9e",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "b5a922eb-49c7-45f0-92bc-671d7a8758f4": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "8f96df41fecaa5d702eac71222f6fdfbf91607a9969c40da866060527cd21214",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "b5b71cd2-de35-451f-b16e-2e3936169407": [
    {
      faceName: "Bonecrusher Giant",
      source: "games/magic/fixtures/accuracy/adventure-printing-corrections.json",
      referenceSha256: "8ec0318dedb68a9259aaf7934552018fb54f62f7b865b9f38d3c674ea9e45ccc",
      reason: "Both MTGJSON original fields contain an unrelated Sorcery; the scan shows Bonecrusher Giant and Stomp.",
      fields: {
        rulesText: "Whenever Bonecrusher Giant becomes the target of a spell, Bonecrusher Giant deals 2 damage to that spell's controller.",
        typeLine: "Creature — Giant"
      }
    },
    {
      faceName: "Stomp",
      source: "games/magic/fixtures/accuracy/adventure-printing-corrections.json",
      referenceSha256: "8ec0318dedb68a9259aaf7934552018fb54f62f7b865b9f38d3c674ea9e45ccc",
      reason: "Both MTGJSON original fields contain an unrelated Sorcery; the scan shows Bonecrusher Giant and Stomp.",
      fields: {
        rulesText: "Damage can't be prevented this turn. Stomp deals 2 damage to any target.",
        typeLine: "Instant — Adventure"
      }
    }
  ],
  "b5d26ddc-ad1e-4a97-85fb-34da685c3142": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "d16b8d0c426335d5a9cb757ad3b4a2676c9dad806113f960e3b23166161fd52f",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "b638d9be-c533-45c3-92f9-fabf56edc2df": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "f99ac77d3a3541727f25befa78f76b9a3941d053722760bd64880ae859ddb248",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Leviathan" }
    }
  ],
  "b63a69ae-99ce-4d26-88b7-784793c43cd4": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "d509331c7502a4180d8ba0d5030c3e25086bc7fbc19d254229e7b52155833056",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Keepers" }
    }
  ],
  "b6c7705a-2987-4ef1-92b1-2c55d989ec6f": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "7e0b3877f4667f3e382bd63ba7329db8828db1f25c9a4cc634603a1c11f5b928",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "b6e1c2e9-5572-4242-985d-f509d628092b": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "0a8a5e52fd2d5a8733dd3788d69984960b86fa8d741c3a54e750af5c0bf1c400",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "b7331b03-be66-419c-94bc-ed494c042ea3": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "7c4a78a25783bea8769161c42fbfb51c2f7635be09aeaed4467a7bef9e4a52ca",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "b7705328-4b5d-4383-9abe-75fca9c32c09": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-missing-rules.json",
      referenceSha256: "4e0ee444b8f2d723682df42804decc1d872fd9ff16ee9673ee57ca677743d2fd",
      reason: "Rules and flavor visually transcribed from this exact scan because the printing has no matched MTGJSON originalText. Symbols use semantic tokens; soft line wrapping is not forced. Squire retains verse and attribution breaks. Type line, typography and other fields remain separate reviews.",
      fields: {
        rulesText: "You may put one additional land in play during each of your turns, but that land must be a basic forest. You may sacrifice Gaea’s Touch to add {G}{G} to your mana pool. This ability is played as an interrupt.",
        flavorText: ""
      }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "4e0ee444b8f2d723682df42804decc1d872fd9ff16ee9673ee57ca677743d2fd",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "b80ecb15-258b-4fc9-86e4-c2bf01891606": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "d37e47583e75c0c17e31a310dd90adb012c5ce311d1a6e41a753e93ca65ac9d9",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-text-outliers.json",
      referenceSha256: "d37e47583e75c0c17e31a310dd90adb012c5ce311d1a6e41a753e93ca65ac9d9",
      reason: "Exact high-resolution printing scan reviewed for rules and flavor. The flavor attribution continues inline; the apostrophe after th and the other printed quotation punctuation are retained. Numeric modifiers retain semantic minus notation. No layout offset, forced soft wrap, or Oracle correction is included.",
      fields: {
        rulesText: "All creatures get -2/-0 until end of turn.",
        flavorText: "“Comes right outta th’ ground. If ya can smell it, it’s too late.” —Keevy Bogsbury"
      }
    }
  ],
  "b8286edd-644b-4135-8dca-af97f3920de3": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "b1acb1d132b7ef83374c6064dbfc9fbae5e7d18f076f33233ee5821eaabc76c9",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "b851d5b4-7991-49d4-8a52-bf233f960cbf": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "5cc946f1e8dd7a5d4c30d2bccbed64c1b077ac312228a34a6c64ad7b3fe24036",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "5cc946f1e8dd7a5d4c30d2bccbed64c1b077ac312228a34a6c64ad7b3fe24036",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "G", "R"] }
    }
  ],
  "b8834c18-0e4e-4785-9d15-b33345e3789b": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "8550f164aabab07a4fcde2cd199f047b824360e71fc48a0f4e80d8a40f44808f",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Eel" }
    }
  ],
  "b894acd5-818b-4ac5-bbf8-47db2ed9a825": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "a69f1a6de3f0613b4f5aef0d516a082e3b72326e38fe6b78e31371850c3b60c0",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "b8a7c22e-fe96-4960-96d4-ee85abec3281": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "0bf0d899ca2074906fd9792d9abf937cc177621d88f3ed4a2ac043951e5d0f2d",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Suq’Ata Firewalker cannot be the target of red spells or effects.
{T}: Suq’Ata Firewalker deals 1 damage to target creature or player.`,
        flavorText: `“Comfortable even in a furnace? I’ve never met one who’d accept my wager.”
—Talibah, embermage`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Suq’Ata Firewalker cannot be the target of red spells or effects.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "{T}: Suq’Ata Firewalker deals 1 damage to target creature or player.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“Comfortable even in a furnace? I’ve never met one who’d accept my wager.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Talibah, embermage", italic: !0 }], align: "right" }
        ]
      }
    }
  ],
  "b9211949-66a5-4039-ac6d-3e42b008b58e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "8960aa6467bc4da8ba205b9610921019200f3d538dc20f37b5a8c4e2b0166521",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "8960aa6467bc4da8ba205b9610921019200f3d538dc20f37b5a8c4e2b0166521",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "G", "G", "R", "R"] }
    }
  ],
  "b93c5869-7777-44bb-967a-e9439b25ced4": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "106549a005a868da4a62c9fcc6a5d6fe7fa167c3cdb4cef1ee693275d05d3196",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Treefolk",
        rulesText: "",
        flavorText: "The mating habits of Treefolk, particularly the stalwart Ironroot Treefolk, are truly absurd. Molasses comes to mind. It's amazing the species can survive at all given such protracted periods of mate selection, conjugation, and gestation."
      }
    }
  ],
  "b9527c2a-23bb-4d33-9e72-6e0ab3de0e6b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "4d38bbdcd8b7f22800efd791902d0ab4b556c76c7888e534edface26668d67dd",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Pixie Queen" }
    }
  ],
  "b9f68dc2-c048-41ec-b237-c36fdd99c27d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "5f15c6a13c8fed0fe0b61104dced961d6c964efbc981e7497275b315c44a78e2",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "ba1384e5-d140-4074-9548-250af09cb413": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "097daf1eeccdc06359d2f46f9344f0abe6464bf7946790734c25303412c43a9b",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "ba2cc4a6-fdcc-4082-801a-d2c50e560e8d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "b02feb73f512744e6c406f704981f69ee22c81d11065f79b7e882c5b0ab30221",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Brothers" }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-text-outliers.json",
      referenceSha256: "b02feb73f512744e6c406f704981f69ee22c81d11065f79b7e882c5b0ab30221",
      reason: "Exact high-resolution printing scan reviewed for rules and flavor. The activation cost is followed by a colon. Both complete printed text blocks were reviewed; no source wrapping is forced. No layout offset, forced soft wrap, or Oracle correction is included.",
      fields: {
        rulesText: "{1}{R}{R}: Brothers of Fire do 1 damage to any target and 1 damage to you.",
        flavorText: "Fire is never a gentle master."
      }
    }
  ],
  "ba5aee52-095e-4c69-93eb-5adac11ed1fc": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "d9d6532629d6c031dbdea3213d62101e6f6f1cf3a2fe60312ee4c04cc7ec049f",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wolverine Pack" }
    }
  ],
  "ba620b1b-d333-443b-961a-25f65ca49a1e": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "6da58ec4ee50df56e07ea621f4f6a238fbba83079231747a34ad6c6ab2467a28",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Wurm",
        rulesText: "",
        flavorText: `"I wouldn't stand in front of that wurm, son. 'Course, I wouldn't stand behind it neither. In fact, standing anywhere near that wurm's not much of a plan. Running, now that's a plan!"
—Wandering mage`
      }
    }
  ],
  "ba64af09-2af7-4630-a3c4-e1aa90f2a9fb": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "54456e73014b69cc2f52e3927bedd67c3405f8b7fdcbbae08d7156e3a6830b6f",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Artifact Creature",
        rulesText: "",
        flavorText: `It doesn't think. It doesn't feel.
It doesn't laugh or cry.
All it does from dusk till dawn
Is make the soldiers die.
—Onean children's rhyme`
      }
    }
  ],
  "ba91338c-1f6c-4b83-851f-98c3e9dea17b": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "5011fc2a3f37f6e30fcdca2eb66bd67905f93c493cce9d65c8a5e635c6131bb6",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `At the beginning of your upkeep, you may search your library and/or graveyard for a Shrine card and put it onto the battlefield. If you search your library this way, shuffle it.
If an ability of another Shrine you control triggers while you control six or more Shrines, that ability triggers an additional time.`,
        flavorText: "",
        typeLine: "Legendary Enchantment — Shrine",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "At the beginning of your upkeep, you may search your library and/or graveyard for a Shrine card and put it onto the battlefield. If you search your library this way, shuffle it.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "If an ability of another Shrine you control triggers while you control six or more Shrines, that ability triggers an additional time.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "ba93c50a-2440-4e92-9cba-d97e20b1d29c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "931c26b1f683a3b7e711c214de88d2ab0b26076378b7ea70b9654b0c2141ff43",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "baae02e4-7db9-4a7b-a4ee-ecb22fcb77bd": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "df5d743f8845d5d874cd1e9a3865204fc04e5d71043db9a8e8e15df3698b9a5e",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Lycanthrope" }
    }
  ],
  "bb0480f5-6aae-4297-afa6-3f7a5801bf95": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "261bf1af5adfdb8e779bbf6517f32cf1fd33b39e3ceb062047c0b39f66f87246",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "bb2b74a2-cb74-4b54-b9c6-78c63f14cf5b": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "289f4aa357054d0092fdf4b0fd68f2d9332f43f8b1bae2db03583e18794517c9",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "bb6af436-bcfd-4d47-a1aa-e84b587a725a": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "f539c5fffca3c0dc894eb468ec2dd7e53041cc3df74dcb9ba22227038c7b367d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "bbd44196-aa28-4143-872d-592c6fc175a9": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "f63856bdbff8e3e653b90dd3fcf246a320696de553e2039c37fb9055f0f87b2a",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Destroy target artifact.",
        flavorText: "",
        rulesParagraphs: [{ role: "rules", runs: [{ text: "Destroy target artifact." }] }]
      }
    }
  ],
  "bbd66c7c-19fb-4daa-996e-70107d732732": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations.json",
      referenceSha256: "f1b149367bc831180d68fab66a8c645803fdb4f563d32c8c1e28d82f04ce857c",
      reason: "Rules words, activation punctuation, numeric mana disc and flavor verified against the cached scan. This body review does not certify type-line wording or artist metadata.",
      fields: {
        rulesText: "{G}: Regenerate",
        flavorText: `"What else, when chaos draws all forces inward to shape a single leaf."
—Conrad Aiken`,
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "{G}: Regenerate" }] },
          {
            role: "flavor",
            runs: [
              {
                text: '"What else, when chaos draws all forces inward to shape a single leaf."',
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Conrad Aiken", italic: !0 }] }
        ]
      }
    }
  ],
  "bc4f4b92-7d4e-4b03-8cb4-e6b356c338b4": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "f7dd4aa17dd04fa84b06f62cd4c492889b85d43aa4c02911297a6365745b1cde",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "bc60e209-aa29-48aa-9128-9bb175403c0c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "d90824d36d810ae7a36326167935e66658d0f53e97f64227ab5db7cfaf1999d8",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "bc6ea08d-7991-4a57-a1e3-abd508426970": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "8078940813879cf8b6d510dc4da2d8d927fabb4c90345b1b2f85382a611802b6",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "bc98d888-4af3-43a3-b035-40c651057b6e": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "89e0afe344d38b08d97f8c8d46ba32317133d06d0fd2dead738c150d4442fd93",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "bcae01a2-171b-47cd-87be-f1e4e5314326": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "c5090ade0717f433f0cbde6924eda6546e9b1de68dad83a1819bddcfa910c115",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "bcd9af40-b46c-44b4-878e-8eb026c96b51": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "f1cf321caf789b5ecaaaa0dfe714816e735c8682dd67d54d0bcf3d69a241e060",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    }
  ],
  "bd1f624b-e8f2-462f-838a-7cb9e8fda988": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "290b126680a31f4158db7bef314f0005f238e5eb9986a8ac62f666633e95189a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "bde037b9-4947-4ff7-8ea4-e9f1a7e4ab88": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "d5f691ec17a16b7e5cfd9a03f5bf1d8a381615d410a900422927c17d2e4e68a1",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Bodyguard" }
    }
  ],
  "be535a4a-c00d-4c58-a663-a3419a54da51": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "faeaab7e0388ab46d726d4572eb8affa0218006daee628e7cab04b612756234e",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "{T}: Target creature’s power or toughness is 1 until end of turn.",
        flavorText: `“Sir, I just thought . . . ,” explained Vhati.
“Don’t think,” interrupted Greven. “It doesn’t suit you.”`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{T}: Target creature’s power or toughness is 1 until end of turn.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "“Sir, I just thought . . . ,” explained Vhati.", italic: !0 }]
          },
          {
            role: "flavor",
            runs: [
              { text: "“Don’t think,” interrupted Greven. “It doesn’t suit you.”", italic: !0 }
            ]
          }
        ]
      }
    }
  ],
  "bebe39d4-21fb-46a4-a1ec-b97102e46c15": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "0ef314a862bb332365baa1059be44c1d4f3f3e42689d645f338ae90f67f6bbd5",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "bec8018f-a12c-4adf-9735-c2093298062d": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "c857b91a681d00a3246a3717838059a47e41aa4ec7b3ee6deb878501bfaf1444",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "bf27955f-015b-4d86-99b9-4c4f6fe2fa73": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-missing-rules.json",
      referenceSha256: "b349e5858d53c2be959b9efbf5ca44ac3b616a00a21384da67a8ec6ace182c5a",
      reason: "Rules and flavor visually transcribed from this exact scan because the printing has no matched MTGJSON originalText. Symbols use semantic tokens; soft line wrapping is not forced. Squire retains verse and attribution breaks. Type line, typography and other fields remain separate reviews.",
      fields: {
        rulesText: "{3}, {T}: Target attacking creature gains +2/+0 until end of turn. Any creature damaged by target creature may not be regenerated this turn; if such a creature is placed in the graveyard this turn, remove it from the game. If target creature leaves play before end of turn, Runesword is buried.",
        flavorText: ""
      }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "b349e5858d53c2be959b9efbf5ca44ac3b616a00a21384da67a8ec6ace182c5a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "bf2e3a8a-b386-474d-b8e9-4c2d56a2b742": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "c89b29e7abff6eac072c80216ff4aebd9455e6000efe2719b519f0d8c8d8ebda",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "bf2f6936-b50c-4907-9b55-ebf8a3fba8f5": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "0c18f03576bdb7f4376011d9bda950acd9780555580e668b5b2d017df2858ff5",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Pikemen" }
    }
  ],
  "bf52f8a0-d027-47f1-bb91-508ef1a74409": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "83b5beaf5f1cc74c1a372f54713103d4227a318200358303cf58a43f1c0edcbf",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "bfba7442-ffdf-43cf-97b3-c69ff80e6fde": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "ffff00e5fbb30c54c34d43b1ca16605af6f8e12be85224d43914ee4d3f205f8a",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "All players and flying creatures suffer X damage.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "All players and flying creatures suffer X damage.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "bfed1a95-bd67-4e16-a781-81866028af2f": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "83a1bd8121fab037d7ee0d95a9535c735cf1154e6630548587bda0bfe2ae2d94",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Wurm",
        rulesText: "",
        flavorText: "The most terrifying thing about the Craw Wurm is probably the horrible crashing sound it makes as it speeds through the forest. This noise is so loud it echoes through the trees and seems to come from all directions at once."
      }
    }
  ],
  "bff33e91-8e52-43f2-b8ae-603b456b08fc": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "a08e469e68faa62d824c29178b91ef7803d71cb2dabc23cf229f963d5bd5d653",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "bfffb65d-851d-4dc9-9233-d53abf955dcd": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "34084b2ef2629fe7b7d4629373df62d33afd8a6b2ea58c34303e995767f50161",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "c062cbae-ce5e-43be-9932-c81a0a3622e8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "3f83e857c93f75e54c7fefffc1e24aa71cec84915aeb8b5d436a06e1f7fd7f3a",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "c066c452-1d87-4946-8d3b-6cc160a82282": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "16e86f91253b3d11ac6928705a6acc772609abaacfc2be31da82a9f71028debf",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "c0a612c4-b4ac-4dd2-a06e-92516599fafd": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "09462011a2fd9aaa94ab6159809ce22a748e37bfcb17b357d1c25cd8e1124acb",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "c0b10fb7-8667-42bf-aeb6-35767a82917b": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "1813f054334fc0314d6bb0c95c3027ed0d5a8cf7f846530dc91bf21e3db475ab",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Efreet" }
    }
  ],
  "c0b85569-2cb3-4b64-b0fe-418195c4dab0": [
    {
      faceName: "Scrollboost",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "382e2e63c1dd860034a0e32038b9e3d011129252d1fd0c6d335def3c6dbd3662",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "One or two target creatures each get +2/+2 until end of turn.",
        typeLine: "Sorcery"
      }
    },
    {
      faceName: "Spiritcall Enthusiast",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "382e2e63c1dd860034a0e32038b9e3d011129252d1fd0c6d335def3c6dbd3662",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Whenever one or more tokens you control enter, this creature becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Cat Cleric"
      }
    }
  ],
  "c0bd30c4-3cdf-4eda-8be5-0fb5e5ddddbf": [
    {
      faceName: "Landscape Painter",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "15248ae3614bbcc259dd9cbe2da201e83ff79078555a0a14acf66612fc780422",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Merfolk Wizard"
      }
    },
    {
      faceName: "Vibrant Idea",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "15248ae3614bbcc259dd9cbe2da201e83ff79078555a0a14acf66612fc780422",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Draw two cards.", typeLine: "Sorcery" }
    }
  ],
  "c0d433a4-76c0-4f27-836d-4c0c13a511fb": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "6fe56ad6405f5089e9f0012070b06bd4c1a9ade67a42690880e236aea91c6237",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "c0d745a5-1d5a-45ec-a662-c13cab70bfcf": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "9b2f0faafa688f7a63e8308276c1d2d7eb9967884829ccc0102dfd9e5933f4da",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Wizard",
        rulesText: "",
        flavorText: "The College of Lat-Nam is often forced to expel students whose experiments grow too risky or too cruel."
      }
    }
  ],
  "c0de88cf-b9e5-4611-a16f-2787d8d9d269": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "8219653652202f093601cf11b446f9d26ff2024deb6968697c65aaf2ffcfb006",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Summon Dwarves" }
    }
  ],
  "c0fb91ec-20a8-4c13-9469-18885b1ecca3": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "29d78ff8de67663258bb2481a8b9521d5dde936ba74b949b9db1b2a3717219cf",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "c12e97c1-ca28-432a-8140-3f08bb4485a3": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "daad9955127446bfd14466d89d1328a25514eaa3282f029519be52804757816e",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    },
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-text-review.json",
      referenceSha256: "daad9955127446bfd14466d89d1328a25514eaa3282f029519be52804757816e",
      reason: "The exact Legends scan has flavor only. Defender is later Oracle wording; missing MTGJSON originalText must not substitute that ability.",
      fields: {
        rulesText: "",
        flavorText: "The ground shuddered violently and the earth seemed to come to life. The elemental force contained in the vast wall of earth was trapped, bent to its controller's will.",
        rulesParagraphs: [
          {
            role: "flavor",
            runs: [
              {
                italic: !0,
                text: "The ground shuddered violently and the earth seemed to come to life. The elemental force contained in the vast wall of earth was trapped, bent to its controller's will."
              }
            ]
          }
        ]
      }
    }
  ],
  "c17cb591-916e-4176-aeb9-e2275d68d472": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "6666a4d58e25b175aa5ed4303bf1e71112382b2b44db24a33f91af869693ecd3",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "c1ba83ab-83f5-421d-bba1-0f925870b5c8": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "ab6dc567af89f2cb44be09fbf9a3c73e243cbe18ee95bb77f1faf70a1411e887",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ball Lightning" }
    }
  ],
  "c1c0ab2b-04bf-4cba-8efa-3d1d0ab4f50d": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "313d288da1263a9c1f2605c5f744e1a0036c0d952feebcbd92d64fe58313e09c",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "{T}: Target creature cannot regenerate this turn.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "{T}: Target creature cannot regenerate this turn." }] }
        ]
      }
    }
  ],
  "c26450d4-125f-423d-b074-3c959460c242": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "cb24c9510d006ca07ca089017d69d19c3deba208d551d03d66ab095e6aea08a9",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `When Teferi’s Tutelage enters the battlefield, draw a card, then discard a card.
Whenever you draw a card, target opponent mills two cards. (They put the top two cards of their library into their graveyard.)`,
        flavorText: "“Tarassel’s sixth law of temporal recursion is easy to understand as long as you know the first seven.”",
        typeLine: "Enchantment",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "When Teferi’s Tutelage enters the battlefield, draw a card, then discard a card.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever you draw a card, target opponent mills two cards. ",
                italic: !1
              },
              {
                text: "(They put the top two cards of their library into their graveyard.)",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“Tarassel’s sixth law of temporal recursion is easy to understand as long as you know the first seven.”",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "c275aba7-cac6-48e8-b12c-6bd77a5c38fe": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "722adbfc5e1a63352e1511d733ebf41b655f54a5c60141adcad89102a3473706",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "Each Sliver gains “{2}: This creature gets +0/+1 until end of turn.”",
        flavorText: `Hanna: “We must learn how they protect each other.”
Mirri: “After they’re done trying to kill us, all right?”`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Each Sliver gains “{2}: This creature gets +0/+1 until end of turn.”",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "Hanna: “We must learn how they protect each other.”", italic: !0 }]
          },
          {
            role: "flavor",
            runs: [
              { text: "Mirri: “After they’re done trying to kill us, all right?”", italic: !0 }
            ]
          }
        ]
      }
    }
  ],
  "c27bc1de-8246-4dc8-af51-ec21def9e226": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "c5a9398210dabb4e349bdb254561fa60a062c09b7ee3a823b70ab17604b1facf",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "c2faf4cf-c4b6-4721-ac06-0e045dd9704a": [
    {
      faceName: "Pigment Wrangler",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "7ed8f8df53c12986b053e506afd777aac6c02d6427e1fa240af7a6ba3d539f02",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Flying
This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Orc Sorcerer"
      }
    },
    {
      faceName: "Striking Palette",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "7ed8f8df53c12986b053e506afd777aac6c02d6427e1fa240af7a6ba3d539f02",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "When you next cast an instant or sorcery spell this turn, copy that spell. You may choose new targets for the copy.",
        typeLine: "Sorcery"
      }
    }
  ],
  "c321d0e1-ff30-4424-979b-25e1a33e45d5": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "710afaaaafa38026cc15a7f6a5f672cee434b8182a4be35818983329b2c949d6",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "c3591170-645f-4645-bc39-b90b7b6ddac7": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "b80f2c467686e785b40ad15ea0524aabf927a1901bdcf589c453d6f6314db3c2",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "You gain 1 life for every point of damage El-Hajjâj inflicts.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "You gain 1 life for every point of damage El-Hajjâj inflicts.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "c392a7e5-6ff5-4c2f-9590-f8811a724f44": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "550d62229fda2a96274e44453286fd3a03c0ee7f836ff8cf3c1f81a8f2458e88",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: "Vigilance (Attacking doesn’t cause this creature to tap.)",
        flavorText: `“On the eighth day, a blizzard hit. Supplies were lost, and morale plummeted. On the ninth day, Dover found us.”
—To the Summit: A Tale of Survival`,
        typeLine: "Creature — Dog",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Vigilance ", italic: !1 },
              { text: "(Attacking doesn’t cause this creature to tap.)", italic: !0 }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“On the eighth day, a blizzard hit. Supplies were lost, and morale plummeted. On the ninth day, Dover found us.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—To the Summit: A Tale of Survival", italic: !1 }] }
        ]
      }
    }
  ],
  "c3b0f228-6b06-4426-a557-1225d547b908": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "a2e74fe23a2192471c7a600bb8291106da3ce75f60dc6d72d23af2d0df12db4d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "c3c8a850-bc99-4679-a316-45ecdea696b2": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "0bc99f26a1af5a95ff51de8a33304693a9e4eb27ba754a876145ff22fc049eba",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "c4104546-abd9-4bfb-a65e-5928cdd4522f": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "88d80644a26a3689b8eb8a0ea0c12d7956276501a31ef4b990b2a135aaba0613",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "c427e8cc-d908-4b88-931d-a540fc8bfe74": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "af4182597ff89d0eb79cb65b9275c3dc852437a29e5c783a05eac7b9f5f3ba1b",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Elemental",
        rulesText: "",
        flavorText: "Earth Elementals have the eternal strength of stone and the endurance of mountains. Primordially connected to the land they inhabit, they take a long-term view of things, scorning the impetuous haste of short-lived mortal creatures."
      }
    }
  ],
  "c4300d24-1cae-4dd5-be7e-38cc677cf5bd": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "f59b58072fdd28211818e0d9c9ede25adf93480ab0f3f6a812699d7c5271c395",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "c44669b2-bf9a-41c3-91c7-d845b0061fbf": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "77c821bfd59ccf8d943d704665c39993eaef24b74229605f0e6785e61bc4524f",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    },
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-text-outliers.json",
      referenceSha256: "77c821bfd59ccf8d943d704665c39993eaef24b74229605f0e6785e61bc4524f",
      reason: "Exact scan shows a discretionary hyphen in the final Assem-bly; the printed Mishra’s apostrophe is also retained. U+00AD permits this break without forcing a line or changing unbroken wording. Rules and absence of flavor visually checked. Oracle wording and layout geometry remain separate.",
      fields: {
        rulesText: `Tap to add 1 colorless mana to your mana pool or give any Assembly Worker +1/+1 until end of turn.
{1}: Mishra’s Factory becomes an Assembly Worker, a 2/2 artifact creature, until end of turn. Assem­bly Worker is still considered a land as well.`,
        flavorText: ""
      }
    }
  ],
  "c474cd6b-5610-49eb-ac98-918d900efe8b": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "cb9c413340a34267c66ac63b64ceba6b694d3d4c45eeb93994c571a1f5ee3d30",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "c48d78db-d982-4c28-9308-2d57dc2b947e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "20ff71885e3639256e9ea9ee987443012916feec32ad6fdb293205186624e3cf",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "c495e1f3-0845-4556-83e6-de8b9d518d1d": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "c7740fa526c87d96664ddc1c1560212eeec53b37dc5e52f23bb047b5d83d0986",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Afiya Grove comes into play with three +1/+1 counters on it.
During your upkeep, put one of these counters on target creature.
If Afiya Grove has none of these counters on it, bury it.`,
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Afiya Grove comes into play with three +1/+1 counters on it.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "During your upkeep, put one of these counters on target creature.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "If Afiya Grove has none of these counters on it, bury it.", italic: !1 }
            ]
          }
        ]
      }
    }
  ],
  "c4b610d3-2005-4347-bcda-c30b5b7972e5": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "d8d5ea825c875fb66f472a0ae7e078b1dd076f548a8133619388e8262a55e027",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon El-Hajjaj" }
    }
  ],
  "c52981ea-1173-4f4b-a929-705a11c6e381": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "d588ac02180bafe071450d8ed88adfb0cf09a2a4b83727c7d0d8f02a5053ef7b",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "B", "R"] }
    }
  ],
  "c58dbcf3-f8ad-4e82-9515-0290fa5373f7": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "16cb8d5eb3bb2a73193ce82d627cbeb09a4d5c0d59b81324d22aec38d7d1390f",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Lion",
        rulesText: "",
        flavorText: `Even the brave are scared by a lion three times: first by its tracks, again by its roar, and one last time face to face.
—Somali proverb`
      }
    }
  ],
  "c69ba095-dd78-4999-87a9-63f7165846e4": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "67258afc422890918e5f1c3dcdcb67f5ba3883398a06ab3ec96e33e8be52077f",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `When Wellspring comes into play, gain control of enchanted land.
At the end of each of your turns, lose control of enchanted land.
At the beginning of each of your turns, gain control of enchanted land.`,
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "When Wellspring comes into play, gain control of enchanted land.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "At the end of each of your turns, lose control of enchanted land.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "At the beginning of each of your turns, gain control of enchanted land.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "c69d4007-d26b-442b-9c34-d3780c46c5f6": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "24d59ceb8aa5821ff87fcc9953c8c94c507b5179347cc3e0625f2e40cc029d01",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "c6a415b0-00a2-4a65-8994-4a395c50ae2d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "851dd8be875df3abac3e38003b6cfc322ee81a2b64e0b7d3bbc71aba363b6251",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Land" }
    }
  ],
  "c6ae9cff-8646-4069-8761-df734e067beb": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "e642fe7e4e6ed88a0d5bb0fe232fac4d32a5d9747b6bd94999674451b303db2f",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "c6ce96a5-76f1-48ca-854d-a37fb6a023a0": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
      referenceSha256: "e78e7ca5055b9064bc61eaa6275598a748032639f22a0f990041c355ebac9346",
      reason: "Text-inset study, retaining prior reviewed wording. Adds scan-reviewed Angry Mob originalText from MTGJSON. Earlier stats studies and capture inputs remain frozen.",
      fields: {
        rulesText: "Target creature gets +3/+3 until end of turn.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Target creature gets +3/+3 until end of turn.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "c715fe4c-c0e7-4342-811f-b74687851097": [
    {
      faceName: "Bloodletting",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "bb7149df7f08d5ffa399bf0d0bc6add90341562e6648e8df9331eaf60be9057e",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Each opponent loses 2 life.", typeLine: "Sorcery" }
    },
    {
      faceName: "Leech Collector",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "bb7149df7f08d5ffa399bf0d0bc6add90341562e6648e8df9331eaf60be9057e",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Whenever you gain life for the first time each turn, this creature becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Human Warlock"
      }
    }
  ],
  "c7824e2a-4eff-4f72-9216-0db30a4f4252": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "aa4693d4a09d8400d2ad1abc546279ac9e57b55335e14aeae0b684d14cfe2d72",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "c78bad70-2aec-4580-a777-483d72db8d90": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "934cfea054f0ad6f8f93faf625b2fd969b7fa9d8ee494c528f69654925161d07",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "c7ea7454-c715-4d6d-8e46-cf5acaf397f5": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "842e0693cbce0939623a2c43ef4c6685a9f631dad575f862d40d5ab7976ab946",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "U", "B", "R"] }
    }
  ],
  "c84e8a0e-49a7-46f6-8a37-910e32753528": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "2763f94bc53f05961d310f17fa3b24b14f0c511a71f8246f3e88eedd3689c1a7",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "c85c5f06-dd31-4e2c-97be-2f64d65069ea": [
    {
      faceName: "Craft with Pride",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "fbb389085758b8ff368bd0726466aa35ad4492f811444b7f723e8e5d20b58ae9",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Create a Treasure token. (It's an artifact with "{T}, Sacrifice this token: Add one mana of any color.")`,
        typeLine: "Sorcery"
      }
    },
    {
      faceName: "Goblin Glasswright",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "fbb389085758b8ff368bd0726466aa35ad4492f811444b7f723e8e5d20b58ae9",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Goblin Sorcerer"
      }
    }
  ],
  "c8635a10-12fc-4308-8f1e-6c4bc6acd9b5": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "d599ac0f11147806dc46b931bdbac90099ef091bb62fe3a90b87ff728e796d99",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "c87cecd6-ea9d-4515-890c-262bb15e9f37": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "cdb0af12b60e18c403f95e6db7356a4560815c880216cf8b51c08f47cc5dad81",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "U", "G"] }
    }
  ],
  "c9714ce0-7fc3-4bf3-ad65-68555a9d2f35": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "b6b628318813dbfbe90be3bb7cb10c3409f0d1bdab8aca8328bd755f0cb8a942",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "No creatures with power greater than 2 untap during their controllers' untap phase.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "No creatures with power greater than 2 untap during their controllers' untap phase."
              }
            ]
          }
        ]
      }
    }
  ],
  "c987a3ec-a775-4140-ad49-18025e59dc3d": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "6d34f5676f6c0d71e41c25d2129c3cff41a130c61a4490e4e10d055f963e0030",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Giant",
        rulesText: "",
        flavorText: "Fortunately, Hill Giants have large blind spots in which a human can easily hide. Unfortunately, these blind spots are beneath the bottoms of their feet."
      }
    }
  ],
  "c993c74c-a574-423b-81c8-96b0a7a6e529": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "a949b8185792745d463c079c785bd02f463e54a2b711567af1c6b6c8c7cbc1d8",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "c99a3abc-e2a3-4eee-8f72-b1b25dcd1d0b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "c8cd54c0bd4bc95e642eb5eb0f6c8bca66c26d21513b1445d492f2c6e84b0369",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "c9bef70b-61c7-4df5-b4df-09cd6ab2015c": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "846105bf32a85f045daa1cb41c3a7193282282b4d3f5d147761f631717d7c9be",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "B", "G"] }
    }
  ],
  "c9dbfc7c-164d-47b8-8f05-987864fca89b": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "6def454d10df3b029a9a1a21500b34a587e4224029a29389f4463c1787692c61",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Players cannot gain life.
During each player’s upkeep, that player loses 1 life.
If Forsaken Wastes is the target of a successfully cast spell, that spell’s caster loses 5 life.`,
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Players cannot gain life.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              { text: "During each player’s upkeep, that player loses 1 life.", italic: !1 }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "If Forsaken Wastes is the target of a successfully cast spell, that spell’s caster loses 5 life.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "c9e8c9f5-61dd-4dcc-bd40-8f366374ea18": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "af12af1a951454db6633554a6758a59080e63857de3b64dd4848e834c283201e",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Flying
During each player’s upkeep, he or she may pay {R}{R} or 2 life to gain control of Emberwilde Djinn.`,
        flavorText: "A hefty price is no guarantee of quality merchandise.",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "During each player’s upkeep, he or she may pay {R}{R} or 2 life to gain control of Emberwilde Djinn.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "A hefty price is no guarantee of quality merchandise.", italic: !0 }]
          }
        ]
      }
    }
  ],
  "c9fd4054-42fc-4f95-a6f7-369a5da43dd5": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "4c4272f7b64320a49f3b252df616dd7f24ca3fb485969b0787416192cb3bb0f3",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Cleric" }
    }
  ],
  "ca571ee8-07a2-43b8-9acf-89cbfd3cf7c9": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "adfb3ec5fbdda117fe132d7dc59e3a3684465d5c1f02399e161a6614288d95c2",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "cac56eda-5ed3-4abd-beec-f5063fbf930a": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "ee91778cc3eaedffaa5789e1cbf94144096e561dc3635cda5b8b35e87a1e8d69",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "ee91778cc3eaedffaa5789e1cbf94144096e561dc3635cda5b8b35e87a1e8d69",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "U", "W"] }
    }
  ],
  "cac8c421-5b92-481d-b2de-560c0231ab58": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "7f29a589339604b0350471c37ba9647f8106f659d813a2688f303f2bcb2c81b2",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "cafc2350-5d64-4379-9198-79a114654d45": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "4fe0e1052ec092f648141bc4081dc7cda29a1cc95f5d62d16db05a9d6cb037d0",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "cb0b28ac-144e-43c5-84f3-d4a2a229f49b": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "d38a4d7bfcbb71bf1ee0a75831f08675c7fe6f66f0b9dbfe51529c559609794a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Devils" }
    }
  ],
  "cb119f5e-a47f-4910-b170-561d6315fdc3": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "150ce3fbeef91b1f07029a673b2ab2a847f87d258a7f9b34148a015e9cececf0",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "cb9b9a9d-ae4c-4e04-bf9d-cae48f01292c": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "535e8bde88dcb9e53564e4baecd2ace5f93b843f0144b4a925751b61c6f3b557",
      reason: "Rules wording and line breaks checked against this printing scan. Type line, numeric/tap symbol shapes and exact font strokes remain separate review items.",
      fields: {
        rulesText: "Lightning Bolt does 3 damage to one target.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Lightning Bolt does 3 damage to one target.", italic: !1 }]
          }
        ]
      }
    }
  ],
  "cba6da22-2366-4f16-84ce-47f84ea14523": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "278918747532e829806beeebb43ebfed92ef4953e01f0da5df122e7ad7262a1e",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "cbc0b009-3951-4aa3-985a-97139882da7e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "5d702037db18c60df4968cf28bdc77e77def9b9ad7537f9342008a4815f208fa",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Ants" }
    }
  ],
  "cbc93c0b-0ac8-4b8f-b2f6-96887d1acd77": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "47cf6fb45a1aedc067cdee84a6a1f88eaf3a0789dfea7d81339993c15891bf39",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-text-outliers.json",
      referenceSha256: "47cf6fb45a1aedc067cdee84a6a1f88eaf3a0789dfea7d81339993c15891bf39",
      reason: "Exact frozen scan visibly places the attribution inline after the closing quote, rather than on a forced new line. Preserve ordinary soft wrapping and the provider's original rules; no geometry correction is inferred.",
      fields: {
        flavorText: "“Where moments before we were lost beyond hope, the strange, floating lights showed us the way and restored our morale.” —Vervamon the Elder"
      }
    }
  ],
  "cbce1c55-123c-4a05-bde4-18a1601fcc5a": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "4028f2e14141077af92e4d29ad756703fd06d965a52a9216fc2faad9e44e9d22",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Kithkin" }
    }
  ],
  "cbf5aa58-f68b-4197-9697-1e6653760853": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
      referenceSha256: "3cfb4a42a2586f6003395299b8b65e054bf66a2e26e961111eedb884e3b62f23",
      reason: "Text-inset study, retaining prior reviewed wording. Adds scan-reviewed Angry Mob originalText from MTGJSON. Earlier stats studies and capture inputs remain frozen.",
      fields: {
        rulesText: "All damage done to Uncle Istvan by creatures is reduced to 0.",
        flavorText: "Solitude drove the old hermit insane. Now he only keeps company with those he can catch.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "All damage done to Uncle Istvan by creatures is reduced to 0.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "Solitude drove the old hermit insane. Now he only keeps company with those he can catch.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "cc05a648-7719-4ed3-aa3b-648463ee2869": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "4b87490a237c0c0f8b097f58af02113b42f02857cf58443ba25f8546902170ee",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Wall",
        rulesText: "",
        flavorText: '"And through the drifts the snowy cliffs/ Did send a dismal sheen:/ Nor shapes of men nor beasts we ken—/ The ice was all between."/ —Samuel Coleridge, "The Rime of the Ancient Mariner"'
      }
    }
  ],
  "cc0bcdbe-be63-446a-8838-8790bda308a3": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-early-land-types.json",
      referenceSha256: "be24032110db47646674419cc6f21b0f1afac23139369b556a3c521173bd1c09",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "cc278af4-b60d-41b7-b9d7-36c8aefca1a7": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "3a867b07cc4969a48c5c41c4a60d16957ccf6353fe93c0f828dbae48a297b101",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    },
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-stats.json",
      referenceSha256: "3a867b07cc4969a48c5c41c4a60d16957ccf6353fe93c0f828dbae48a297b101",
      reason: "Exact Antiquities scan parenthesizes the subtractive toughness expression. ASCII subtraction is retained as semantic data; the painter supplies the printed long-minus shape. Reviewed power/toughness only; Oracle values remain unchanged.",
      fields: { power: "*", toughness: "(7-*)" }
    }
  ],
  "cc44eaa4-59a4-419e-b1d1-d92f354ff588": [
    {
      faceName: "Careful Study",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "ecea7af369c413ebf2b272da48e5cb4418f3f99ca6182149fadeda8ed4ddb79c",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Draw two cards, then discard two cards.", typeLine: "Sorcery" }
    },
    {
      faceName: "Spellbook Seeker",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "ecea7af369c413ebf2b272da48e5cb4418f3f99ca6182149fadeda8ed4ddb79c",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Flying
This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Bird Wizard"
      }
    }
  ],
  "cc564f84-0d6e-4e09-a58d-a694d918cf12": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "d052ff9136ecb03247e791e69b62fbe881f47d02025994d269b0064143fc14d9",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Scorpion" }
    }
  ],
  "cc6686e6-4535-49be-b0b3-e76464656cd2": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "6fbcca715197115204b8f163a938a0fd6882f348f98083efeb2590ae0ea852f7",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `When Agent of Treachery enters the battlefield, gain control of target permanent.
At the beginning of your end step, if you control three or more permanents you don’t own, draw three cards.`,
        flavorText: "“The more secrets you have, the more easily you become my pawn.”",
        typeLine: "Creature — Human Rogue",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "When Agent of Treachery enters the battlefield, gain control of target permanent.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "At the beginning of your end step, if you control three or more permanents you don’t own, draw three cards.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“The more secrets you have, the more easily you become my pawn.”",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "cc6c7d89-32e7-4c3f-ac90-7db3a46eed4b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "a89c41fe1034d7b073670b69bc5d64733b2d7bb8ccc0292686590d808f391f4f",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "a89c41fe1034d7b073670b69bc5d64733b2d7bb8ccc0292686590d808f391f4f",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["G", "R", "B"] }
    }
  ],
  "cc743a03-867c-4bb0-8fb0-2bcaa0a8a756": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "df4bcc08662275eaffdb0e9fc3b19ef9494f6b9c370e6344432f5a160db7df3e",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Wall",
        rulesText: "",
        flavorText: '"And through the drifts the snowy cliffs/ Did send a dismal sheen:/ Nor shapes of men nor beasts we ken—/ The ice was all between."/ —Samuel Coleridge, "The Rime of the Ancient Mariner"'
      }
    }
  ],
  "cc78f2e5-c02b-4f58-8510-660ca27d9a71": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "f979f108945759e4382982e22e7496526c316e6766760f131010c6a26759890d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "cca142de-906d-4143-8f77-4acea1f1e6b1": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "f6d8647eaa8f94e61221f491b2fac59cf0841a0cb2a8692b2e08fe19250bb486",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Merfolk",
        rulesText: "",
        flavorText: "Most human scholars believe that Merfolk are the survivors of sunken Atlantis, humans adapted to the water. Merfolk, however, believe that humans sprang forth from Merfolk who adapted themselves in order to explore their last frontier."
      }
    }
  ],
  "cca371f0-e7c9-4154-8e1d-47576c0202bc": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-missing-rules.json",
      referenceSha256: "beb23665954dbb2b4342ca279758e0ce581825691ed09c0036b63a176228202c",
      reason: "Rules and flavor visually transcribed from this exact scan because the printing has no matched MTGJSON originalText. Symbols use semantic tokens; soft line wrapping is not forced. Squire retains verse and attribution breaks. Type line, typography and other fields remain separate reviews.",
      fields: {
        rulesText: "{2}: Target creature gains +1/+1 as long as Tawnos’s Weaponry remains tapped. You may choose not to untap Tawnos’s Weaponry during untap phase.",
        flavorText: "When Urza’s war machines became too costly, Tawnos’s weaponry replaced them."
      }
    },
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "beb23665954dbb2b4342ca279758e0ce581825691ed09c0036b63a176228202c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "cd69a6dc-27f3-42aa-9e63-4417796e4ef5": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "aae7b027f1deab34f7ed52b00fd938cf63636ae5639a7a525a8f6b02b2585d13",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Land" }
    }
  ],
  "cd860a1d-aa17-4579-b9b1-d101d2416387": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "ade8f82157c4364036f928684dd9dea2858e46c790083e636a92b8de7e2869f9",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "cd8617d2-a0e9-4fb4-85da-2c7e385be3f6": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "4b829f0f3bca2030f65ad87c07976270c9816476be546c2e2a044639f58e1fa2",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "cd87344d-9113-4fec-9a93-38bc1abe2af5": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "3fbb4b38b581609629146dbddee32ceed94f527812ef5accf377b7b073d26984",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Elephant" }
    }
  ],
  "cd91027f-bf08-4247-ab3a-d2b2934b6ade": [
    {
      source: "games/magic/fixtures/accuracy/30a/annotations.json",
      referenceSha256: "68c9c7ebdd21e0d993c73dd7d84274c114494f111d62dbdbcb7552744ae7024f",
      reason: "Scan confirms a separate attribution line. Both source feeds omit it. Partial review; original rules wording is not certified. Upstream correction: https://github.com/mtgjson/mtgjson/pull/1748",
      fields: {
        typeLine: "Summon Paladin",
        flavorText: `"Look to the north; there you will find aid and comfort."
—The Book of Tal`
      }
    }
  ],
  "cdcccb0f-ce96-453b-9e82-41d87f52e58b": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "a1e4b7a24c2318c6e089de81f6897df42cefa45f23863d5e6b4dc26be83a97c6",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "cdf0afa6-7003-454d-9b8a-e3328aaf29ed": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "967022db3135ca0b672829a5506d9a38334ddee0cc718175f9ea216fbad975b2",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "ce2d603a-3231-4a8c-bf39-1617586ea870": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "d7ec0feccdc9c4ca2d2d918d5fb705cfa43eaa851affa13cfdcb17bc6ae7346c",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Bears",
        rulesText: "",
        flavorText: "Don't try to outrun one of Dominia's Grizzlies; it'll catch you, knock you down, and eat you. Of course, you could run up a tree. In that case you'll get a nice view before it knocks the tree down and eats you."
      }
    }
  ],
  "ce3756f7-0d99-4562-b32d-66de18a58fdf": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "619c1be40376a8bb5bb2248d8f7d9e16a7248ab7d0dc23827af3e94da9c68f60",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "ce83a3cb-467d-44f6-a051-4855c8cf52a6": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "e379b244a2982e31bbc9c187553a9d3df0ffd472f6836398c9c44fd08e9454c7",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Archaeologist" }
    }
  ],
  "cf05e5c9-b7e4-4bd8-ab73-b54565710527": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "390d19837914aebc8025cc4a9114ef33f98494d3d62d429c24c412191c0a85a2",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "cf2313bb-6f9b-49d6-b069-9f3b77b6e107": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "7c067e832e23870bdfcf3c69a5ea0f11c1fbc38c3ad7f8a9a233dc7c791e60f3",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Druid" }
    }
  ],
  "cf56e862-3169-4f63-acd0-731080fa32f2": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "8122f67df67f5afed662a3484bbc6f105a960e23ed0b88c287fabef422da21a5",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Efreet" }
    }
  ],
  "d0266dd4-31da-480b-9a44-4e217f748f06": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "23bb465e81b87cc2dc3359afc7ea6946e9a506a8ebf83a0c3b70db5ed10fde46",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "d05b92bd-797e-413f-a8b0-32e0937a1ee0": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "f334216d65edc7b57ad87073f2b195e14d1858fdf63ee68cd3251139a97e5efe",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Lions",
        rulesText: "",
        flavorText: "The traditional kings of the jungle command a healthy respect in other climates as well. Relying mainly on their stealth and speed, Savannah Lions can take a victim by surprise, even in the endless flat plains of their homeland."
      }
    }
  ],
  "d0a261d0-7678-46f7-9285-d541486567d8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "1dad94261fb5e400c5bfac5547933235394e3f75d3458cec49a0801f183be3d2",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Legendary Land" }
    }
  ],
  "d0c5cf64-9844-4b5b-8e6b-b97c50cce053": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "b6a3b340ab7cf3f11bb74976a7e8c9b2fd6df882bcecdc3618f16fbfce0b94ae",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "d0c66e64-e357-457d-8302-b3a1fc0c56ce": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "6072f3b24816b3a2d5a56e761d800b18e7cdd74834fb50420be5dc00e546d97d",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "d10f8a05-78b0-42a7-adcd-83f6bafe5417": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "20093ec41905b690de80fdd71fbc1cb3638b1b888a21be9c71b3ffcebe06b404",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Marid" }
    }
  ],
  "d11f90e7-ced1-4d80-8083-99acbf459ad7": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "96b1c4098de4eb468d3a169b2d27bbb9ec262bac691e669063ae870ae10cded7",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "96b1c4098de4eb468d3a169b2d27bbb9ec262bac691e669063ae870ae10cded7",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["5", "B", "U"] }
    }
  ],
  "d1309a80-a761-4b80-8cf1-1a8b83190511": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "d9a40970826857012c55d68bae910a00c65db770c45a1ff983ee97a22c14f1a6",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "d141b9e3-7129-41e5-8b44-d3867e1c7e1d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "99045fbc49ec09b25a8e8f5f7d00d1ebe8a977baa3949d6e4d533cfab185a2e0",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Spuzzem" }
    }
  ],
  "d1aa37c8-98fa-4984-b09b-cf65ad84e97b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "18d55492f8aa3fe57a3d0f14aa50498e756fc45f6a44493ff702d24648fb88ac",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Horseman" }
    }
  ],
  "d1c387dd-1347-4443-91ce-b71f7ccdceba": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "dae74d5767a6ed66d59067bb946d5126858d7e8a058d87c36e0feedaddf89e3b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Devils" }
    }
  ],
  "d20a0b5a-2a04-4cce-83e4-2d65ef9399df": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "2d2ca6924a9be80102c44d0eac09d40399d4a16a1619930522449206b2d1f4f2",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "W", "U", "U", "G", "G"] }
    }
  ],
  "d2101f86-8d3c-4ba8-ac42-bd3df0644280": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "b08a1a1e486876efc69be9c908890c408c5566e585c26a8f7ff488baf3a83fa6",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "d2187a64-2823-4f58-ad35-70f8913db2dc": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "ad25f8ec31537ae3fd5f9ebee5979911f52d9f7313f9357f5f187cf1a45cd84c",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Cat Warriors" }
    }
  ],
  "d234f3d7-2f15-4fbf-92db-16c3433d644b": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "2bcc2ef4fa5a0c7a685bb4c232aed6b16741869ccc71373bda7557b2ddaa0717",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "d26fa79a-ede8-4c80-98d5-f49696f8104d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "eb29efbd71d5bc7da6108e90333c772d6961ad04d9f6fb89724798be8e80951c",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Faeries" }
    }
  ],
  "d27608e7-6539-4813-95b6-d8847cdc6a12": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "9c9dfe5d4d6452216b961080ad793cc73dba5d181aa0e493af2308e58de2acd7",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "d282cac6-2cc6-4384-a4b9-06763eb4a706": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "710aa6e903f8b6d095dcd47de798d6e681493f1812deb51c97ebf6dc2ece84b7",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "G"] }
    }
  ],
  "d2e9decf-47b7-44e0-b380-8055b6011021": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "f7c4bba5932d15a1b0fcf5ceafcb0eae8f9e9d04df439b018812ada152813da1",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "d313d051-7295-4884-8cbf-f2f835fd45f4": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "f407a6e0994ddfb8391cca0a1addab0a66b37bafee32f8414e1c5d94e5e30b58",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: "{T}, Sacrifice Fabled Passage: Search your library for a basic land card, put it onto the battlefield tapped, then shuffle your library. Then if you control four or more lands, untap that land.",
        flavorText: "From here, the path to anywhere may be found.",
        typeLine: "Land",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{T}, Sacrifice Fabled Passage: Search your library for a basic land card, put it onto the battlefield tapped, then shuffle your library. Then if you control four or more lands, untap that land.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "From here, the path to anywhere may be found.", italic: !0 }]
          }
        ]
      }
    }
  ],
  "d3419db6-1c38-4aa4-b953-1dde7d22b927": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "b95a4c6ee97ee9af273b11f102c2411811c69eecfa10dc90ab07e52369374702",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Drake" }
    }
  ],
  "d3ddbe51-cd1a-4b2c-849a-7c82d622122a": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "87dd5e1dd1d1b957a83fd2623e2b3d7f3733c7a9eb5cf33a4f9a9bff47fa2d0c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Djinn" }
    }
  ],
  "d3ec14bc-95e9-47ce-b51e-d5eac9b345fe": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "270898c9368dedd6c49239298f7c16190409a34a077d2419d5636c5fc7359ae0",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "d40cc7da-c731-418e-8547-7033d1939450": [
    {
      faceName: "Adventurous Eater",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "2c0e052d209d645c311d63b124c013a96a8ab504880f667c7198ce1bcd98679d",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)",
        typeLine: "Creature — Human Warlock"
      }
    },
    {
      faceName: "Have a Bite",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "2c0e052d209d645c311d63b124c013a96a8ab504880f667c7198ce1bcd98679d",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Put a +1/+1 counter on target creature. You gain 1 life.",
        typeLine: "Sorcery"
      }
    }
  ],
  "d43c01b7-443d-4061-a934-6863d230c9b8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "1315f3f0eb1ad32558b2f3782e9aef04032187c4dfb6b43f844597fbb1a14fb0",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Legendary Land" }
    }
  ],
  "d4f54af3-7c85-43da-b0ce-df4a44af4736": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "dba8db41049eddd43e1e38246318fb83a5c89fe6d0468c48b7d67a302cd0c05b",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "d5208dbb-63d2-4789-8ef9-f82499a43b3a": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "c3b4849e56fa8f0d2251df66237b2631528f58c869312f0be8112a5d78c01a6e",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "d53b20b0-67bc-4587-817b-efbf21cb2512": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "20eb11c6b48431d7288e5e81dd12036555431c70b5f3d463bd29eac25da95011",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "d551ff93-d8da-4c21-bc3c-6451c0dde07e": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "65351bb693029429ee2fb793fa2ea31fb34f27bf801cdc413f6b25ea2576f2fd",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "d56cca55-1ea7-4a11-8c5d-3d84c9af862f": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-missing-rules.json",
      referenceSha256: "945b34092f46ffd479b485c13ad53b92aa06a0b3e13a38209615429d0d1a26dc",
      reason: "Rules and flavor visually transcribed from this exact scan because the printing has no matched MTGJSON originalText. Symbols use semantic tokens; soft line wrapping is not forced. Squire retains verse and attribution breaks. Type line, typography and other fields remain separate reviews.",
      fields: {
        rulesText: "{2}, {T}: Gain 1 life.",
        flavorText: "The Fountain had stood in the town square for centuries, but only the pigeons knew its secret."
      }
    },
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "945b34092f46ffd479b485c13ad53b92aa06a0b3e13a38209615429d0d1a26dc",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "d5aa920e-b93f-41c2-b505-a9350353be8b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "e1c83dcc60c1a818cc90b9ac9742d61fd964567c1b4bbbb3953bdf739ac15ede",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "d5bb2093-78a8-4a6c-abe7-9a5afc181ec5": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "511a1be4333dbe5955952bc8b4d6c38ca40e7a998efc812403b19716a20654c1",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "d646feea-3c20-4737-8d20-ffad42258ced": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "060947b9d2e7e3992511763b415bb4d0741d65afd7d7370f91ef0ec362219447",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "d64c9153-bc6d-4a64-885f-c039a5487a31": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "2d6cd2b10115592286b3b6bfd14d3f02636dc7f78b93c5894ab5de8a3b9a71c0",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Rats" }
    }
  ],
  "d66e43f0-1558-409f-8248-cc1d76c6bd8e": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "a4d58a1b754344360b35af326d9a9bf6efe1cbbce9c7af809c10cb766f1066ed",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "d6914ed2-9207-4689-9166-11d2f8949fdd": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "7c740d2836544f378ec1c8239081a9f73a7d5b0259636b5246e298921e28b949",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "7c740d2836544f378ec1c8239081a9f73a7d5b0259636b5246e298921e28b949",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "W", "G", "G"] }
    }
  ],
  "d6d5e36f-0049-4be8-bf85-8dc0186339a4": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "dffb151706e402c7237f1a2c26573072a058790d3fc1434d28e95ec8c15163b6",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Villain" }
    }
  ],
  "d6e23afa-7e08-4049-baf0-d4d0134ba2c8": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "6c79cff90cb1cae9ee5a9b5dd37182ed3a53c0aacd2aacf66fde4a2e03ad60eb",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `When Llanowar Visionary enters the battlefield, draw a card.
{T}: Add {G}.`,
        flavorText: "The elves of Llanowar look to their past to determine the shape of their future.",
        typeLine: "Creature — Elf Druid",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "When Llanowar Visionary enters the battlefield, draw a card.",
                italic: !1
              }
            ]
          },
          { role: "rules", runs: [{ text: "{T}: Add {G}.", italic: !1 }] },
          {
            role: "flavor",
            runs: [
              {
                text: "The elves of Llanowar look to their past to determine the shape of their future.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "d7533a72-77d1-40cd-b3a1-7597d566c428": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "ac73168f2be8bf11e25c468329c47b3ab953d47f0c45f7118ba36f4d42542aa2",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Walking Dead" }
    }
  ],
  "d77fe8e2-8438-473e-ace5-01baddd2c4ed": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "248566df30c1926be99bcba10231f980354cddb361701acfd2afd5ef5e1bf2d9",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "d89c1d2f-87a1-4463-af21-b837da3e7d74": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-frame.json",
      referenceSha256: "4b14ad9251f8535c67d17bb018f58979f9264ed53d6715901da8088dac3d642f",
      reason: "Carries the eight original-field corrections and adds the scan-reviewed Serendib Efreet type and frame palette. Semantic colors remain unchanged; no name-based painter routing.",
      fields: { manaSymbols: ["1", "B"] }
    }
  ],
  "d89fe2be-bb7e-4bae-9b1f-9f0d58f20ceb": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "7bdc6b0aab80014e341c14066d38cd13c8289b701031369309fe33c75e984016",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Eater" }
    }
  ],
  "d8f49b3d-7fcb-4169-9298-cdf7a1dbe3f5": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "7c29a75be6b4961b7de424540e9b6475e72477d5709404f5085cd38865189574",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "d8fcc83f-c67f-46a2-bb0e-dafbf0a2bfc0": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "2579dcfd0d87ff6c3285e6f68933b203de74dd372fd64848c395331a34650146",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ogre" }
    }
  ],
  "d9631cb2-d53b-4401-b53b-29d27bdefc44": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "86e2e8e7290af765f98861bdfc744e4d9ec87053bbb5bef5159862863dd2f7b2",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "W", "U", "G"] }
    }
  ],
  "d96b463e-9579-4e7b-87c2-342527b91e7c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "ff68622a8b79dfe00a88da45899f3f8352bf59ee68911792f771a871e9d4af08",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Avengers" }
    }
  ],
  "da237992-2919-4e37-8f56-2164095f59b5": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "9474fb0979ef837f087c4c0f2e196ef8c3d0836ae4910c4e30aca057117d9829",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Elemental",
        rulesText: "",
        flavorText: "Fire Elementals are ruthless infernos, annihilating and consuming their foes in a frenzied holocaust. Crackling and blazing, they sear swift, terrible paths, leaving the land charred and scorched in their wake."
      }
    }
  ],
  "da248001-ed75-4b68-9532-37d3cd5afc4c": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "45835121c3e2d48eea636d45e135d37ecaa01b70fda3ccafd73b72639f80d06e",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "da68a5c0-84fe-4a8f-93b2-790eca3cc95c": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "ddef1c42cb58bcd089c9329e87eb013e6264ef1712be74d9f468763e64f13ccc",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "da7ed8ba-3886-4779-a9b3-6892a7ed3527": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "07ccd063b62365b40128f05ac7ffa1f7003f2ae9e5c02ee13ee33ca46af53fbe",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "daac2a6b-27c8-4567-9e0c-7b262628d331": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "ceb4ad50e6fd6e2f147ce8e0b712be055a6a47ed50f1be9fbfd91bc0eea9ef79",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "dafb512f-536f-4f96-8440-03f1d20d8a5a": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "e02d5c3c30b7ce0eecec406a36eb1e5188933e4e3650aaa3c72d51cdf17c4da1",
      reason: "The printed parenthesis (round down) is upright rules text, not italic reminder text. No wording change.",
      fields: {
        rulesText: "Fireball does X damage total, divided evenly (round down) among any number of targets. Pay 1 extra mana for each target beyond the first.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Fireball does X damage total, divided evenly (round down) among any number of targets. Pay 1 extra mana for each target beyond the first.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "db17f25a-32d1-469b-bb5f-f1761e227990": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations-empty-rules.json",
      referenceSha256: "a5664b49db71178c9a2f7402928a81269da14698ae91034b96c2b1239fedef21",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Dwarf Soldier",
        rulesText: "",
        flavorText: `"Gilded with gold from a dragon's trove, it is! And etched with the image of the dragon I slew to take it."`
      }
    }
  ],
  "db1f578f-fa3b-4447-953b-1490852b6c80": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "9eea2bf8314d3dc28e50f702dcff51c85e71931b05fd122293d01d86939a77b5",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Priest" }
    }
  ],
  "db52bad2-a3ec-4f6f-9418-12e8c40703f6": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "2b694bffa908f186b6a80380a0195bb10d4a39b2990103eff96f96486e14cd0c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Aladdin" }
    }
  ],
  "db591b28-37e5-4e7c-ae4d-d761262b12d0": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "42f98c1e7ea915523d002048cc07e0d311c54192120d279697ed53a107db50f1",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ship" }
    }
  ],
  "db6ef678-4ce9-48d6-aa4f-2afd9a1ad724": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "1b70c95e0d45a279d256316beb5aa8f02059548cf136de4e75c449e28d80ddea",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "1b70c95e0d45a279d256316beb5aa8f02059548cf136de4e75c449e28d80ddea",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "G"] }
    }
  ],
  "dbb21f21-668a-4d57-8d05-8db11fb82d99": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "9506880ac52c87b8ed615988fa053390ba26862a8cb94d9788332ac97b40cce8",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "dc47e322-f8b8-4685-b035-fda0cc433e6b": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "826a4126e29ff3cc3e9bb2d1fcbc0a27a3ade540384e59d23b7b0061a463dc9c",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "dc60077f-d577-4a6c-a78f-697317024c40": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "087821a2ed07992a4fcbf77b9e4b85f0930df2f7da2d458033f036c391300a86",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "dc64f19c-5b2b-4697-b4dc-2be9c3790794": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "24121293c93d888128f0e09ea93618969d79da2072eddc657780c9789dff7624",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "dc9afb9e-eab3-4969-9a44-2c01bf730e68": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "fc9079fb8a34039f612450f7866d2885d8b0ffd54d7e44051c73f690466464b9",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "If Lead Golem attacks, it does not untap during your next untap phase.",
        flavorText: "Slow and heavy swings the club.",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "If Lead Golem attacks, it does not untap during your next untap phase.",
                italic: !1
              }
            ]
          },
          { role: "flavor", runs: [{ text: "Slow and heavy swings the club.", italic: !0 }] }
        ]
      }
    }
  ],
  "dd27f0fe-c032-4f61-9f3d-98a6d2e2c426": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "7d3d8e6782f404353898a60b6225c96f08050e8a2bf449afd4ab7513d29daa38",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "dde6d3d1-75db-445f-9f17-632ee0292211": [
    {
      source: "games/magic/fixtures/accuracy/mir/annotations-retro-type.json",
      referenceSha256: "acb163e3e80914f8e5c5bb01ceac6527150b04789b61edde52d0f780e0790b26",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "{B}, Sacrifice Wall of Corpses: Destroy target creature blocked by Wall of Corpses.",
        flavorText: `“I shall make walls of their flesh, and their blood will be my mortar.”
—Kaervek`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{B}, Sacrifice Wall of Corpses: Destroy target creature blocked by Wall of Corpses.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“I shall make walls of their flesh, and their blood will be my mortar.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Kaervek", italic: !0 }], align: "right" }
        ]
      }
    }
  ],
  "ddf85792-470b-4b42-99ac-9cb43a575523": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "926c91f361d91757a09ac613eac199c949219832c2408499390f07e35c8010f3",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "de38f96c-5d17-4cf2-9951-f0866eadd011": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "996b04155fed9b692c8a835e2a64ca3132f84e60f8d01a55cb01efab686c07fa",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "deb5d44d-977d-4d0d-8242-17c8ffa7247c": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "378855eab5ab93e6585f65df5c8b38d4b51a74ce498f4abcaef2170326983474",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Bury target non-black, non-artifact creature.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Bury target non-black, non-artifact creature." }] }
        ]
      }
    }
  ],
  "deb6ed87-aa07-4b5e-ac40-1e16dc2a817a": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "892d4705d52d514d37488c6751004866bd59936fcc11a1405a65c12c9a172824",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "df0320d9-7c2a-456a-9159-1b4fae67bfb5": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "fd65606cde10f0f987dc78dc0c50bb04c55985ecfc8580f5b0c5cd4629b5e7f5",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Kobolds" }
    }
  ],
  "df25ffdd-995d-46ae-856b-f6368f9438ed": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "92a21a4663e7d121cf633034249a0c710e40195749be518e3a20570e97cd7075",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Apes" }
    }
  ],
  "df608b59-cc07-4e1d-b6d6-f15e69b15b92": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "3492faab1be4ee85a49bdec90b6801b2898b15a2010ba47c25bd24dd37f01e1a",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "e0078aa8-bfb8-43b0-a6b7-1991596c21e1": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "b77879a9eab617d210c74ee9f0bdd664cdbf6a726da50d7989b0d239b6f6d1cd",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Camel" }
    }
  ],
  "e07df65c-ebcc-4873-b928-d99040d1f2f6": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "d47455852a1b2582949581e3df0c2a5e9c9982399cd9d085756266706c73ba81",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "e07f656c-97b5-4147-821a-edbb49f34e19": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "68241faa9c986f2349401bd53c36725ed652c65bffc3b7b0ae73b58c1e502f2a",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "e09a6b9b-eb0e-475d-8558-08e347412790": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "85c82ccff2b1891e802795986b35ad9ee4aef4828d9299aa5d0abf5acdc8d5ba",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "e0f6a92f-edd8-4cb6-be91-f3ec229b20a6": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "a2ee6352175c37405b6df2aeea0964fba5991607548c337da369d3476b6364af",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "e1ca1cc3-e588-4ef7-b846-d5dba3c875a0": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "bb0b674bfb02c954cab0bf8f92ef54f6895d170feadc157cb4e087299bd4bcf0",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "{G}{G}: Counter target black spell. Play this ability as an interrupt.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "{G}{G}: Counter target black spell. Play this ability as an interrupt." }
            ]
          }
        ]
      }
    }
  ],
  "e2285cf5-f1c0-42d2-8203-297d2a5b9ec2": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "8cbd19d2927fc6dc5dc7aed31a92dc1ee8b2f3d60c24e13c55f8c4f98ddf84cc",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Elemental",
        rulesText: "",
        flavorText: "Earth Elementals have the eternal strength of stone and the endurance of mountains. Primordially connected to the land they inhabit, they take a long-term view of things, scorning the impetuous haste of short-lived mortal creatures."
      }
    }
  ],
  "e237d921-6d84-402e-b5e3-6bbdb3028f57": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "b76bb066df4e90d4b96304c24a6b3c7da2eb0d3aa6a90602f28d2d73922b8ab3",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "e26041ad-b326-40e6-a7fd-eacfcb0ab17e": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "014342bb065957a3be9687912b89f3d855524161053ac86a1ab21a13411061ba",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Ogre",
        rulesText: "",
        flavorText: "The Ogre philosopher Gnerdel believed the purpose of life was to live as high on the food chain as possible. She refused to eat vegetarians, and preferred to live entirely on creatures that preyed on sentient beings."
      }
    }
  ],
  "e26e7c9c-e6de-47f4-8394-7e853408f84c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "7342143cd8af9a92ecaa3179bada2680f3b0c19435e1d83c2f8b0eec39315d22",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "e275c295-72da-4a86-82c6-cfd75b38b19c": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "753114116b6b5d60f1e8c1e5e968ad9537dba9070f985dcd6249b0be0e5baf9a",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "R", "G"] }
    }
  ],
  "e298291d-8e96-4676-8b6f-daf6fd290b57": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "4516a6b32de865f7df572b8d82696c4fc048388574c5bf1fb644e175cd0e9632",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "U"] }
    }
  ],
  "e2c9f463-d1cc-4f11-aad2-d4a4520aa978": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "2b946bd98c3095bdc3bc2d06880f7d751f4a68b0b5d9f21a9243b3f37045262b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "e2f789b3-3274-4a93-b44b-fabc44c1833c": [
    {
      faceName: "Battle Display",
      source: "games/magic/fixtures/accuracy/adventure-printing-corrections.json",
      referenceSha256: "6daacd2b9fb5921be6417b3b61cefaeec4767d67e0a71d86b7bb996d6b3d6207",
      reason: "Both MTGJSON original fields contain an unrelated Spirit Knight; the scan shows Human Knight and Battle Display, with flavor only on the permanent.",
      fields: {
        rulesText: "Destroy target artifact. (Then exile this card. You may cast the creature later from exile.)",
        typeLine: "Sorcery — Adventure"
      }
    },
    {
      faceName: "Embereth Shieldbreaker",
      source: "games/magic/fixtures/accuracy/adventure-printing-corrections.json",
      referenceSha256: "6daacd2b9fb5921be6417b3b61cefaeec4767d67e0a71d86b7bb996d6b3d6207",
      reason: "Both MTGJSON original fields contain an unrelated Spirit Knight; the scan shows Human Knight and Battle Display, with flavor only on the permanent.",
      fields: { rulesText: "", typeLine: "Creature — Human Knight" }
    }
  ],
  "e3bb7271-634a-4612-9073-7a5438e8c2b8": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "7a2804a9b76a6f4d4deafdf6220b21af27a36e6294b05ff989c58035a9d6ceda",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Imp" }
    }
  ],
  "e3d3df64-1e90-4aef-86ae-0062aa23ff30": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "770ef2d0d6cafbde53e06c51a42454fd5a3e2285391e1cffbeca18ad5211f97d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "770ef2d0d6cafbde53e06c51a42454fd5a3e2285391e1cffbeca18ad5211f97d",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["B", "G"] }
    }
  ],
  "e3da4a88-5225-467f-9240-f30bc1eee520": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "6317f04d0ec72870cef559a188e446cd8c985f456620cc3f27703bb4b1faaac9",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Wurm" }
    }
  ],
  "e3f17ce3-711b-4bd9-addf-dd440fa7d2b7": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "fa1c0a5d86fe0a343074469de275ecd3b8886fddb46af2a4de073847bcc599b9",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "fa1c0a5d86fe0a343074469de275ecd3b8886fddb46af2a4de073847bcc599b9",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "B", "U"] }
    }
  ],
  "e44d892f-a975-4062-8a54-5777d2600504": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "a3ee7fe786c175eeb4404b73a7b975618e8a4d250ccd77b88f7b5cd2de17b701",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "e4546059-71fe-43c1-9272-3b054e668e3c": [
    {
      source: "games/magic/fixtures/accuracy/planar-printing-corrections.json",
      referenceSha256: "9142a1c6d5edafcab3bc809f07b4343c699e91f9e78aab3db6852e3d5ef07cc3",
      reason: "The exact scan includes an em dash after Choose one; cached MTGJSON originalText omits it. Restore the scan-reviewed rules sentence, retaining the original semicolon-separated choices. Oracle wording and unrelated printing fields remain unchanged.",
      fields: {
        rulesText: "Choose one — Search your library for a basic land card, reveal it, put it into your hand, then shuffle your library; or return target creature card from your graveyard to your hand; or target creature gains flying until end of turn."
      }
    }
  ],
  "e46d0c10-ec09-48ba-9e93-1392dca8111a": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "d32413e617ad039c96114635e9f73a39293a734080c0471a4bb0f2c2942ea8d8",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Nomads" }
    }
  ],
  "e470c00b-57ac-48d4-b1e6-74b74872e620": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "67152e791f81338cdbe4b6d8c69791a85630a11868637e63a6a81efd7af91d8c",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "e48b1c51-c0fd-4c08-8631-80f507b04d28": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "2891ccd2dba6a454b33f5447d442ff8930281b652a3fed7e5d2b445175e56796",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "e48bc89e-6da5-43da-b4e0-60d5f850199c": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "6844aff0e9b3dafcbaf3bcaa0c9eed287cf7ffb921d0a3a00c2f1b8b9639d588",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchant Artifact" }
    }
  ],
  "e5131c74-a81b-4927-a1b9-98d2c714ab71": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "22d5cfd1de0842d05ec2139eda169116eb8bb4781afd7d09f6cac9f174c59587",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified. Book title is upright within the italic attribution.",
      fields: {
        typeLine: "Creature — Octopus",
        rulesText: "",
        flavorText: `"Before my eyes was a horrible monster, worthy to figure in the legends of the marvellous. . . . Its eight arms, or rather feet, fixed to its head . . . were twice as long as its body, and were twisted like the furies' hair."
—Jules Verne, *Twenty Thousand Leagues under the Sea*, trans. Lewis`
      }
    }
  ],
  "e56146bf-5db0-4bef-83bb-efa5ebec6684": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "1afe9c8aba344610aad41774b7be0ce4becd86da5d7695cdcebebef968822139",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Whippoorwill" }
    }
  ],
  "e5a814f1-7f8d-4c2c-b706-ee0ed5892f7b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "19922519455f5054d0a6b7199531a31be428cd46d75c81143737dd75e8712420",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Leviathan" }
    }
  ],
  "e5c66c61-aadf-433b-9958-fc9b44b327b9": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "6b0da118140d0fb07e95ae019446b69e5e052ebc94c8f5b51bdd4aec743865ef",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "6b0da118140d0fb07e95ae019446b69e5e052ebc94c8f5b51bdd4aec743865ef",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "B", "B", "U"] }
    }
  ],
  "e65356e6-0ead-49fd-b069-be1ea9b1c105": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "03559e88093f094629b25a602ecf802b9c2152e1be0253c819e29e4a934ebcec",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Land" }
    }
  ],
  "e691adef-3027-4e6a-889f-9f4e2df36a7c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "e6b2aa54862573ac95717759c93276ea3b2ddcee1c555ee764cbb9976106233b",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Interrupt" }
    }
  ],
  "e6d6fac6-9a23-465f-a813-92e1ed1cd742": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "0feb29f70193a2928303260de07ba76de65c53025430087725de26ac371049fa",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "e70b7a73-484e-48f1-944c-3d38866cdc20": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "ca99a3cade72863d27258b5ac2f25cbd46af1445eb15dfaf288d08d5b5162031",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `Hexproof
If a source would deal damage to you, prevent that damage and put an incarnation counter on Nine Lives.
When there are nine or more incarnation counters on Nine Lives, exile it.
When Nine Lives leaves the battlefield, you lose the game.`,
        flavorText: "",
        typeLine: "Enchantment",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Hexproof", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "If a source would deal damage to you, prevent that damage and put an incarnation counter on Nine Lives.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              {
                text: "When there are nine or more incarnation counters on Nine Lives, exile it.",
                italic: !1
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "When Nine Lives leaves the battlefield, you lose the game.", italic: !1 }
            ]
          }
        ]
      }
    }
  ],
  "e7880157-7f27-4f1b-9cdc-ab36a6252376": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "dc84b4667d2faab934cd6dccdfcd019469e96bdca25cc93854358e0d2332548b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "e7aa2b93-0a84-4318-bf2d-58164f0a846f": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "c23dbadebf2d8f39c040bda58dd6de7e8c6ccb5b88bec7ec0f9c041af8dc090b",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Bears",
        rulesText: "",
        flavorText: "Don't try to outrun one of Dominia's Grizzlies; it'll catch you, knock you down, and eat you. Of course, you could run up a tree. In that case you'll get a nice view before it knocks the tree down and eats you."
      }
    }
  ],
  "e7e2857f-f6eb-4091-b758-7bb508544170": [
    {
      source: "games/magic/fixtures/accuracy/5ed/annotations.json",
      referenceSha256: "11ffc8865a0be739a18089181da2dd6d4bd6ebb8b12565338a0ac498743e7a5d",
      reason: "Metadata cohort labels; Battering Ram corpus wording reviewed from its full scan to remove Oracle reminder overflow. The six reserved transfer cards remain unviewed. Battering Ram is excluded from the claim of untouched transfer evidence.",
      fields: {
        rulesText: `Banding when attacking
If Battering Ram is blocked by any Wall, destroy that Wall at end of combat.`,
        flavorText: "By the time Mishra was defeated, no mage was foolish enough to rely heavily on walls."
      }
    }
  ],
  "e85e54f3-012b-460f-a6f9-d0242a174adc": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "5b5ff827b7aac773d848d05dc3c499a56ca63ffa78008ae0ed91faa3b00a0ab7",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "W", "W", "U", "U", "B", "B"] }
    }
  ],
  "e85f6f21-15a0-4a36-be95-5a0299cd01a5": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "7688c9111c825ecd557b2bd3ba26c87689b9a812c7a087eca3c787eb53217808",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "e9091667-d5a8-4978-9023-032ff65f9642": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "4e54edc7722d858b75620452221c2db836f270402f496f82678e9fabe28f72a5",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Buyback {4} (You may pay an additional {4} when you play this spell. If you do, put it into your hand instead of your graveyard as part of the spell’s effect.)
Searing Touch deals 1 damage to target creature or player.`,
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              { text: "Buyback {4} ", italic: !1 },
              {
                text: "(You may pay an additional {4} when you play this spell. If you do, put it into your hand instead of your graveyard as part of the spell’s effect.)",
                italic: !0
              }
            ]
          },
          {
            role: "rules",
            runs: [
              { text: "Searing Touch deals 1 damage to target creature or player.", italic: !1 }
            ]
          }
        ]
      }
    }
  ],
  "e92cc35d-4e97-4be2-8c53-cce68c3374ca": [
    {
      source: "games/magic/fixtures/accuracy/m15/annotations-walker-text.json",
      referenceSha256: "55fe3b27e179def60a24d6681738cfa5d1f958b9676d90af7e5a7059305fddff",
      reason: "Type line visually checked against the cached M15 scan. MTGJSON originalType contains the later Legendary erratum; only this field is certified.",
      fields: { typeLine: "Planeswalker — Chandra" }
    }
  ],
  "e9357990-701a-4336-b545-ac5a24d89cad": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "e0d985a2b30724996c273cebdaa937308d4ac6bd71c33c69ed861b63374cf92a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "e9be6dcf-5e25-4b8c-9cd0-badf3771f81e": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-empty-rules.json",
      referenceSha256: "8a7d8923bba6d1379b6d00cf6030620b4814245096d17e4d682a0be2d40fe388",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Zombies",
        rulesText: "",
        flavorText: '"They groaned, they stirred, they all uprose,/ Nor spake, nor moved their eyes;/ It had been strange, even in a dream,/ To have seen those dead men rise."/ —Samuel Coleridge, "The Rime of the Ancient Mariner"'
      }
    }
  ],
  "e9c54ffe-2479-4178-a5dc-dca7b564efce": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "d7e4dd34c35c46e8af99cd4241811b18aec7c539fc6e762f1826eeeea09a935d",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Regenerate target creature.",
        flavorText: "",
        rulesParagraphs: [{ role: "rules", runs: [{ text: "Regenerate target creature." }] }]
      }
    }
  ],
  "e9ed6669-e340-46d5-906b-e24e76464e75": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-empty-rules.json",
      referenceSha256: "d8e2132458fcfcc51a1facf9bed805622d83e4c5959dbf593662944e2a9ca082",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Artifact Creature",
        rulesText: "",
        flavorText: `"The foot stone is connected to the ankle stone, the ankle stone is connected to the leg stone..."
—Song of the Artificer`
      }
    }
  ],
  "ea0891f0-83ce-4eb7-b0a9-cbc8168bafff": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "793a1a5e9b27d4e6233e06579a3bd45d738773529a27510d62d6542673b050d2",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "793a1a5e9b27d4e6233e06579a3bd45d738773529a27510d62d6542673b050d2",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "B", "B", "R", "R"] }
    }
  ],
  "ea5d9476-76be-48e7-b6a0-49ced25cb092": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "ff442d12aaf824423129c4febc22cb9b75d7c31ca439c9f470d8313c3e822ba5",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "eace2c85-976c-425e-9800-5a6ccbd91b56": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "54710d60a0c3af2311dc51dbd23361ac25cf7b88365ae98e63f01e00d795c556",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "eb351900-cffd-4d23-b82f-5fb12a4874d9": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "02ad76642e6ee58053f5559f820083b907f9326814ba7e650e57512ca92edf35",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    }
  ],
  "eb562143-fdf0-4eed-83ac-551627c576d2": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "2185d2df7ad292a8406f1a38f642670daaf89e68476a8c8b61500dd5c5f12360",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Efreet" }
    }
  ],
  "eb6953fd-ee48-49dc-9c9c-bfb9a9dc06d0": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "bf0ab4064da4de3ffef6bb8b65807ec33192755345dde11c2f70c132b2d03e9e",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "eba294e7-7097-4bc3-b396-72e85dd4f441": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "4b7110616878a7e1059570522c1600da96c149de2f4a40f7ea0c0dddfb5f8fc5",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Dervish" }
    }
  ],
  "ebe8845e-df1c-481c-949c-aab84af99a05": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "808eb46c46ac4985af440532d943ca76436a48da7fc8b6e4f47bb432d63412c2",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ape" }
    }
  ],
  "ebf5ea1c-0ea7-4b84-b886-ebd346f4e154": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
      referenceSha256: "7b86b1e57058647eaf7af1dbc5957f0723a877c540afea67d5f895a9f56c906b",
      reason: "Corpus repair after both pre-fix and current captures rejected the longer Oracle banding reminder as overflow. Printed text transcribed from the cached scan; no geometry tuning.",
      fields: {
        rulesText: `Banding when attacking
At the end of combat, destroy all walls blocking Battering Ram.`,
        flavorText: "By the time Mishra was defeated, no mage was foolish enough to rely heavily on walls.",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Banding when attacking", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "At the end of combat, destroy all walls blocking Battering Ram.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "By the time Mishra was defeated, no mage was foolish enough to rely heavily on walls.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "ec0686ba-1277-4412-a397-7a6227808311": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "96f4908ec1538ef9ef2036113a86ebefd5120ad4ed1f19203ccf237787b0c5ac",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "ec082062-5394-4340-bc29-0efd2af4b822": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "3b79cd720ff86029bc4f0ae0a3ff57889a418af77bc8b4d2ffc76edcd3b697c2",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Entity" }
    }
  ],
  "ec10a51c-d2c3-4d14-9a71-9e59155bf980": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "8024cfd2eb3c2b6a31869bcdf160fc37278eb35958c607a45794da246e3c375a",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Bull" }
    }
  ],
  "ed20fecf-dc1c-4d3c-8ddf-e91aab1e9b47": [
    {
      source: "games/magic/fixtures/accuracy/sum/annotations.json",
      referenceSha256: "08df37bc4ab4304ea30c7066c6252dfd92ffb81bede234ef55ae8de50f331077",
      reason: "Scan confirms a separate attribution line. Both source feeds omit it. Partial review; original rules wording is not certified. Upstream correction: https://github.com/mtgjson/mtgjson/pull/1748",
      fields: {
        typeLine: "Summon Paladin",
        flavorText: `"Look to the north; there you will find aid and comfort."
—The Book of Tal`
      }
    }
  ],
  "ed2a7333-c9ce-4011-b00e-1304e1eec25e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "84d84ef2b2361913317551d930743a5a6a26c09cc6b1815ad178e74db9e7d2ec",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "ed875705-b7b6-4464-b16f-61629ffed04f": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "2215fc9a90280ae2913582543ff724f014876bc0fcaadf64fd657389dae16020",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `This spell costs {X} less to cast, where X is the total amount of noncombat damage dealt to your opponents this turn.
Trample
Whenever a source you control deals noncombat damage to an opponent, Chandra’s Incinerator deals that much damage to target creature or planeswalker that player controls.`,
        flavorText: "",
        typeLine: "Creature — Elemental",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "This spell costs {X} less to cast, where X is the total amount of noncombat damage dealt to your opponents this turn.",
                italic: !1
              }
            ]
          },
          { role: "rules", runs: [{ text: "Trample", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "Whenever a source you control deals noncombat damage to an opponent, Chandra’s Incinerator deals that much damage to target creature or planeswalker that player controls.",
                italic: !1
              }
            ]
          }
        ]
      }
    }
  ],
  "eda7177f-1354-4008-aaaa-2c8b823ed5e9": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "69292313b9a117cbc3a1d4547b29110a6f609613d88e945cd278ada173464eec",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "edc71122-2951-43eb-8ca8-1cda6d231013": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "edfc3127e70f45bd284b62b3b3da0d2b5dcf6379d7bb95ffbfe5340d9ef94151",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Elemental" }
    }
  ],
  "edeba4e1-9012-4962-8797-3a1f6a660952": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "50a68eb843b2015497013f3d54515402e65aeee7e30a690204e8cee444b0de74",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "ee266113-34ce-4189-84e7-ee2c86a2722c": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "943856e6ab6636562234c928c9e5f729a5a0050c515353f162209ea67aff914e",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "ee30efdb-f1f1-497f-80a6-ec961db67c1d": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "d4c4e960947e77df9e196b2c64dec572011fe78a2c16cf6b158d01384059bb83",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "ee39da13-4b8a-4796-a7c2-aaa11992d573": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "ecc305cb013ce26fcbf457bf48f2bf6365a94c751669a33edf5eb8ffbd7560be",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "ee5a45b1-169b-468e-9251-424c09cd7f0f": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "8a65816e547c400e7f827677bc7a8d75954da90e9f106a6cf6623610c87c605e",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "8a65816e547c400e7f827677bc7a8d75954da90e9f106a6cf6623610c87c605e",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "W", "G", "R"] }
    }
  ],
  "ee7cfabc-902f-46f7-b1de-fa0a88c8f852": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-early-land-types.json",
      referenceSha256: "569de240e28548c61ac1085928be688080a953a3c30d028bc66b390d86a45ba2",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "ee9eb598-d2ef-4b3d-8038-bc33dc5e123e": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "11c806fae7de8b892f98bdae0c1ead3c1de093f32b2790bcf958cec8421685c2",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "eed2c97b-f003-436c-9faa-5518aba42fc1": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "679e6e4a95d5a9cd20d773bc6c2ef1d06762ea14d93691b96c65d44717a8ff70",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: `Flying
Choose and discard a creature card: Skyshroud Vampire gets +2/+2 until end of turn.`,
        flavorText: `“If it tastes one drop of elvish blood I will cast it from the shroud to see it burn.”
—Eladamri, Lord of Leaves`,
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Flying", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "Choose and discard a creature card: Skyshroud Vampire gets +2/+2 until end of turn.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“If it tastes one drop of elvish blood I will cast it from the shroud to see it burn.”",
                italic: !0
              }
            ]
          },
          {
            role: "flavor",
            runs: [{ text: "—Eladamri, Lord of Leaves", italic: !0 }],
            align: "right"
          }
        ]
      }
    }
  ],
  "eeea32ba-dfe4-4a9b-b403-43c2abc80b78": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "07bf73955cbc4b0a9cba43112822ce43c20934fc7ced61ca079fe0cdf828164b",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "eef9d043-c9ab-4215-acfc-9065250513d1": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "11626fdb7b02bd0a116c1309d40204103f7cc4f84e392ca239bba97580550658",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "B", "B", "R"] }
    }
  ],
  "ef24fb75-49c7-48eb-a0b3-dc08d7f691ec": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "b0e14d1d707e78b42bf3dc852a884890a04648d65dbc6926d19536de9e33f958",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Artifact Creature",
        rulesText: "",
        flavorText: `"The foot stone is connected to the ankle stone, the ankle stone is connected to the leg stone..."
—Song of the Artificer`
      }
    }
  ],
  "ef3651d4-969c-464d-a444-40a640d0c6ba": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "11a883859fa8ecae38dbd7efc89e4d5abec03ec56e96ddbeb41f5241175107bc",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wurm" }
    }
  ],
  "ef9d2c05-0d2f-4d02-aef3-e1078d78e5ff": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "25ea4c016696e754e1c75d3c49f26d727041547227a33030d541b6f17088ff88",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["1", "W", "B"] }
    }
  ],
  "efdba2a9-d171-45ed-8dd4-9d0046128f68": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "1b0c428e56a35c224fbd50f0891f23ae6a9bd339df8bd9eae18937ede89d796f",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Efreet" }
    }
  ],
  "f079c74e-a39a-40f9-9c7e-9319c0c189c6": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "1b1961ba97350f7f2b4c12e3f0b114db9296b9b128b14291724db345a582ae72",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "1b1961ba97350f7f2b4c12e3f0b114db9296b9b128b14291724db345a582ae72",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "B", "B", "U", "U"] }
    }
  ],
  "f09cbd18-79f1-49a0-a3bd-b380ff5ecf03": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "2276e7945d6d57d0f84818c7ff854fdd017f144958a77b1714142b5aa3e04459",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "f11684d6-5b74-47a7-a2d0-256c9e437aa6": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "74c6acf9f5c23d28f32d1aaef5c1046896893c00ea516474fc4d338d852d1cda",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "f13e8dc9-8d0f-4a2c-8c0e-be70a3a7dc8e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "c3238dc82b5e491bf811bac1dd5c6f709d9815716ee5e75b4dd4715d04a3383a",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "c3238dc82b5e491bf811bac1dd5c6f709d9815716ee5e75b4dd4715d04a3383a",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "U", "W", "G"] }
    }
  ],
  "f1a42691-98bb-4234-9b56-085e6677f3e4": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "1365be06968fc8b91966dd8c71b657f6b40d4bbf7c50f1d5ed3e1e3e7c696cf6",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "1365be06968fc8b91966dd8c71b657f6b40d4bbf7c50f1d5ed3e1e3e7c696cf6",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "G", "R", "B"] }
    }
  ],
  "f1e0f9ec-2b06-4bda-8b80-a716d82d1f13": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "683646af25b49720d805a6810e015fde430fa43b10532f4cd5c767fd162b6ec7",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "f20c89d9-71c9-45f5-a9cb-6e253b0a7cca": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "6091c7e637e5f5e363af32b591eaf1f39e8984dc4d52a31a78561ee26a0a2971",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "f2a26496-b4c9-4a29-9a85-26e217deafa2": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "11324b9e054cc2aa4c72b015ad607e1d754ec73597a0095da56b3a639adb56ff",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["3", "W", "W", "G", "G"] }
    }
  ],
  "f2b9983e-20d4-4d12-9e2c-ec6d9a345787": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "f4f788ad79b0e57adb1f48a2f968f7e0f50501d7a97f457e729bef5d95196acb",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "f2d0bc79-d2f8-43e7-9106-c0d01db31fa2": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations.json",
      referenceSha256: "5154a77fc6bd16f032db2e5a5048a8871b5c475278f0dcc3ab6545aa76a9c81e",
      reason: "No Unlimited printed wording visually reviewed yet. MTGJSON originalText is cached for 286/302 printings; imported wording is printing-reference, with missing entries remaining oracle-unverified. No scan-reviewed body scores yet.",
      fields: { power: "X", toughness: "X" }
    }
  ],
  "f3020304-7a39-411e-b055-3ade72b4bff8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "1dc2a5214f6435d3f45dd3eb72279c0dc67999ae35a7551e8f955a283250484d",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "f32373dd-06d8-45d1-8777-3b1411bcb30a": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "b9772f8d17541c29fb77c92146231abe79d6aac0db05cea384385cbef6045243",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "f323c3bb-cece-4035-b1a7-c4817cf7a08c": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "5736fa4d15df65b12ffa28a1804c71ad2ec639bbbd5908e76219a41dd22df7e1",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "f3728537-86d3-42be-9046-90bba1bfafc1": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "19e33a8ed445e45a67a81e72cab739c98fc2cb5da765eb7542103f783bd773a5",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "f395278e-6d74-4f35-af9d-21bad7b19763": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "2fe02f5caf65eaa081675299ab85e5ce31a4d33bdf5faa71050863e46989e5d5",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Elves" }
    }
  ],
  "f3afb143-fd69-4197-96f4-62d5d90a894c": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "f54366bc4d6e10cfe8c0af80fcc6038ec68af0eff6cdd2e36a135a23b6871cff",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Giant",
        rulesText: "",
        flavorText: "Bent on a quest for blood, a giant can storm through a fort's wall as if it were nothing more than a picket fence."
      }
    }
  ],
  "f3d29fed-248d-4547-9455-3d69b1f2787d": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "5c3958029a1cceb2145ae18adbd02e4e0a2b903b4c541b05da6e1e892f606c7c",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Players do not get an untap phase. During your upkeep, pay {U} or destroy Stasis.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "Players do not get an untap phase. During your upkeep, pay {U} or destroy Stasis."
              }
            ]
          }
        ]
      }
    }
  ],
  "f3e122e9-ffa3-48dd-94d6-8f2886668e59": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "1bd6a9350f4695042d5c0a6f9b42e20b6596cafcd368333ff41264c98fe15d5a",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "1bd6a9350f4695042d5c0a6f9b42e20b6596cafcd368333ff41264c98fe15d5a",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["B", "U", "W"] }
    }
  ],
  "f4395b19-2118-4a09-8932-f9ce9bc54d6d": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "b9f2b8d1464d47ea2f455c1725a31de6c5c3affcc72026b12848df5676a8dbdc",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Artifact" }
    }
  ],
  "f4459187-de64-456f-bb66-56dea40d5c3e": [
    {
      source: "games/magic/fixtures/accuracy/tmp/annotations-retro-type.json",
      referenceSha256: "6ac36207d793546d57eb1b6471ca628d8b03a41be04ebdb11c4efa59a894a20c",
      reason: "Printed body wording, type lines and styles visually reviewed against the cached full-card scans. Soft wraps are not forced into inputs. Poetry and attribution retain semantic line breaks; the legacy painter does not yet honor run italics or attribution alignment. This does not certify title, footer, mana artwork or line geometry.",
      fields: {
        rulesText: "{3}, {T}: Put the top two cards of target player’s library into that player’s graveyard. If both cards share at least one color, repeat this process.",
        flavorText: `“Memory is a burden that wears at the soul as weather wears at stone.”
—Crovax`,
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "{3}, {T}: Put the top two cards of target player’s library into that player’s graveyard. If both cards share at least one color, repeat this process.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "“Memory is a burden that wears at the soul as weather wears at stone.”",
                italic: !0
              }
            ]
          },
          { role: "flavor", runs: [{ text: "—Crovax", italic: !0 }], align: "right" }
        ]
      }
    }
  ],
  "f486df00-7c4a-4ff0-bb0b-c8b5432ac742": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "29d4aded06ac7b83b4666810c77234906f3a7f26e92f36b718b2461bad60397a",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "f4a176e1-b22b-4f36-ba7b-c506cb4e1bed": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "00680e0457f62c1c98eb9888ac017b3c37e82aaa6cc752890654e63af545a64a",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Fallen" }
    }
  ],
  "f4aadda8-8577-480d-8186-532d2b173c15": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "1cc920a6afb76d98876560ea9a21d45b6d997cdc5fdbace64a51414194adb541",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Jackal" }
    }
  ],
  "f4c133b8-8383-433f-be96-c47a937287b7": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "0ed2c03df651c9c72b720f440e66af5cd8f9d0a24effe2b6297450eb40aaceb3",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Rag Man" }
    }
  ],
  "f4e32327-380d-471e-813b-4c27477787ce": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "11381f3381583877b4125dcb5bac9b4091a8085ea58be4c7433844f5aa6a7d26",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "f512addb-5888-49f3-985b-53cc11831e5e": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "606ca4bc8faf2afa18812ce2afc703cb7fde39dd5c83e34ad628b94ca0f543a0",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "Giant Tortoise gets +0/+3 while untapped.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Giant Tortoise gets +0/+3 while untapped." }] }
        ]
      }
    }
  ],
  "f5758e82-f901-42b7-b705-0e68ca7ba59e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "e87784f54ae4bb5d9d1c582813caeaaa50debf7f2cb8bf5582b58d4f817a5a60",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Wall" }
    }
  ],
  "f58dba4f-1abb-47a3-a684-29c32bab95c0": [
    {
      faceName: "Emeritus of Conflict",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "fad84519ad2b79a87c800959c6b3b5f8cb0253de7407c921841629a2a645fb91",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `First strike
Whenever you cast your third spell each turn, this creature becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Human Wizard"
      }
    },
    {
      faceName: "Lightning Bolt",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "fad84519ad2b79a87c800959c6b3b5f8cb0253de7407c921841629a2a645fb91",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Lightning Bolt deals 3 damage to any target.", typeLine: "Instant" }
    }
  ],
  "f594b7aa-d44e-47c4-989b-565f881e25f1": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-historic-artifact-types.json",
      referenceSha256: "8c10c8400972b555105b483d863b8a2676f20669af7c5e1509301cc6f1797688",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "f649c571-d7ec-4ebc-9e18-b0657cab495b": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "1be8f74238bf35313ce0b5eb2b5f3b5e389b1a27dab68fcab7a87b0c2f9b308b",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Instant" }
    }
  ],
  "f64f6100-c26a-4b22-9fa6-ab3f287a94aa": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-revised-text.json",
      referenceSha256: "e33c343820e8f0b322d15addf85285dc0f6853e551662b3f2615eecf0f790371",
      reason: "MTGJSON omits the colon visible in this scan. Corrected outside frozen typography inputs.",
      fields: {
        rulesText: "{W}: +1/+1",
        rulesParagraphs: [{ role: "rules", runs: [{ text: "{W}: +1/+1", italic: !1 }] }]
      }
    }
  ],
  "f6c95a2b-bf44-4ff2-9c6a-916773346edd": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "0db7437536ed23df5fb869c70b9bba16a5bfde34e985c2049dc1f30ea8f5d13f",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "f6ccfe28-ec08-4751-b65c-c40b2bafa955": [
    {
      source: "games/magic/fixtures/accuracy/future-printing-corrections.json",
      referenceSha256: "3f520a8e5d4cb108568ba34d13d97c9bfaa2283b5a6c02d7730612b104cf573f",
      reason: "The full-art creature has no rules or flavor box. The exact scan was visually reviewed; missing originalText is not treated as empty for unrelated printings.",
      fields: { rulesText: "" }
    }
  ],
  "f6de6b0d-dd8c-4ab9-8de3-b083a36b24b7": [
    {
      source: "games/magic/fixtures/accuracy/3ed/annotations-empty-rules.json",
      referenceSha256: "66337fb36c1a860f46f2a3ab093ab451e2b5161c706a62b2dae24350e06d7045",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Summon Minotaur",
        rulesText: "",
        flavorText: "The Minotaurs of the Hurloon Mountains are known for their love of battle. They are also known for their hymns to the dead, sung for friend and foe alike. These hymns can last for days, filling the mountain valleys with their low, haunting sounds."
      }
    }
  ],
  "f77fda65-f70d-44b1-89db-910d2761b81c": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-missing-rules.json",
      referenceSha256: "f53ad9217cbb814e68d22a66655da803234022e784dafd5138d2c4ed04639ebd",
      reason: "Rules and flavor visually transcribed from this exact scan because the printing has no matched MTGJSON originalText. Symbols use semantic tokens; soft line wrapping is not forced. Squire retains verse and attribution breaks. Type line, typography and other fields remain separate reviews.",
      fields: {
        rulesText: "{0}: +2/+2 until end of turn. Each time you use this ability, you must choose one of your artifacts in play and place it in the graveyard. This artifact cannot be one that is already on its way to the graveyard, and artifact creatures killed this way may not be regenerated.",
        flavorText: ""
      }
    },
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "f53ad9217cbb814e68d22a66655da803234022e784dafd5138d2c4ed04639ebd",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Atog" }
    }
  ],
  "f7a69e35-d209-41c0-aa3c-c78414617075": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "533cee1699828c6bb80d4d4ebc039380ad0c178d0de12724fb5faad3609eaa06",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Artifact Creature" }
    }
  ],
  "f7d82f1d-631e-4668-9d10-7bf0ee515267": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "75e483587bf0dc0f0acbc3612fc16b07407963b17eacb5e19673c31da929e347",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "f81cd99e-902a-44dd-8928-803a96fe25c4": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "e22f048e8f1f86c438b7ea72872e46190fb297886c34ebd300cdb30b7beac75b",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["W", "U"] }
    }
  ],
  "f85614b3-62a3-4da9-a74a-7ea40fad1b52": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "dd131ca470ab48ca42191ad00f68ea301d0ac114f243f005249906f5fa084c2b",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Vultures" }
    }
  ],
  "f857a00a-82e0-4227-86ee-1f9c7ca232ae": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "8b03ed35a5d39bb74ed0c1c4837a7d0c8974289024eb1e2e7dea65ec866d5411",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "f86f0781-7614-4779-a58d-f13ce96bdf33": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "ebd7af37a1499b2cd95d818c62a27e5ef00d7fc6cdfd9756376696d3c59be6b4",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Cavalry" }
    }
  ],
  "f885d776-2953-4ed4-b63f-91dc2b42783b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "b9b7a9ee5a73e9e75b5c7a202243d30fde0ab9ccba1cc5aa75b48fe5e949930b",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Beasts" }
    }
  ],
  "f8a130dc-3b1f-4fae-8459-b26bb5647fec": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "247f421d4e000535a1870ea29fad3e49eb8c9d2291232cf5e929538f3c21894d",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Druid" }
    }
  ],
  "f9302ba8-7ff2-4eaa-a32d-eedd94f0bb79": [
    {
      source: "games/magic/fixtures/accuracy/m15/annotations-walker-text.json",
      referenceSha256: "be79070441e41797e00741dcefd173dcf6f013adec986d1924ac459defe6668a",
      reason: "Type line visually checked against the cached M15 scan. MTGJSON originalType contains the later Legendary erratum; only this field is certified.",
      fields: { typeLine: "Planeswalker — Ajani" }
    }
  ],
  "f9b0164c-2d4e-48ab-addd-322d9b504739": [
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "ae17259d57fdea0d57588928a8a5596190103600c57094cc8c2809b674af068f",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["U", "B"] }
    }
  ],
  "f9d01a2e-2687-4b37-aed6-63202cd81231": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-centered.json",
      referenceSha256: "6189e3d9179479a8e70f59eed07e82cd017ec4d897325e7984e6ecaf624a7b4e",
      reason: "Body words and line endings reviewed against cached scan; no forced soft breaks supplied to painter. This review does not certify type-line wording or inline glyph/disc shape.",
      fields: {
        rulesText: "5, {T}: Put a Wasp token into play. Treat this token as a 1/1 artifact creature with flying.",
        flavorText: "",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [
              {
                text: "5, {T}: Put a Wasp token into play. Treat this token as a 1/1 artifact creature with flying."
              }
            ]
          }
        ]
      }
    }
  ],
  "f9d613d5-36a2-4633-b5af-64511bb29cc2": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "6fb7d968a665cd0bf5c7bfb1d6420e08432dd9b84ecd50ce1f9788eb0a43e453",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Ogre" }
    }
  ],
  "f9dbfdc1-a598-4c72-9b0d-91207bd067ab": [
    {
      source: "games/magic/fixtures/accuracy/4ed/annotations-text-insets.json",
      referenceSha256: "99b244601c527d6b6daedacde8b8921242b0e966453329bb8bf062f798433388",
      reason: "Text-inset study, retaining prior reviewed wording. Adds scan-reviewed Angry Mob originalText from MTGJSON. Earlier stats studies and capture inputs remain frozen.",
      fields: {
        rulesText: "Target creature gets +2/-2.",
        flavorText: "",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "Target creature gets +2/-2.", italic: !1 }] }
        ]
      }
    }
  ],
  "f9ffb265-872f-47b3-974c-92bcbebd557e": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "081e4ac23aad417a79d79d060fbb0b810c82c6e276a64c9f69bb6eea6f6985a3",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "fabc3267-b59b-4f36-8873-5b4b072711ca": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "6472932946187ac3c03189d8a7168b54829db38dc37753d724bcad37e31169ea",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "fac8ac39-ecb4-4142-bf37-131c65660a9b": [
    {
      faceName: "Aqueous Aria",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "42db54ee3affd80033839ed6b2da699c280a260953f47c74f4d41c3c54d09f48",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: "Create a 3/3 blue and red Elemental creature token with flying.",
        typeLine: "Sorcery"
      }
    },
    {
      faceName: "Campus Composer",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "42db54ee3affd80033839ed6b2da699c280a260953f47c74f4d41c3c54d09f48",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Ward {2}
This creature enters prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Merfolk Bard"
      }
    }
  ],
  "fad0bbc4-f760-47a2-aab6-0dbb66ee3a95": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-early-land-types.json",
      referenceSha256: "cd01f009f8882d30fd2197a0e499a482a297a6913d85269a1c26630b4a26bbe3",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "fb19b35e-e0b9-4575-b146-2682ad8a5175": [
    {
      source: "games/magic/fixtures/accuracy/2ed/annotations-historic-artifact-types.json",
      referenceSha256: "4018f7371ae2215a94405f0244cc1e017b5f7fe4bbbdb7b82bacb3874af90fe8",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Poly Artifact" }
    }
  ],
  "fb3d9b29-948c-4768-b5ea-db2512817c30": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "6802bb1cf2eb6809b1eba46628198c04ad1f206cfc8af52c4b6d8559bb133f2e",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant World" }
    }
  ],
  "fb5f13a2-0896-4230-8957-6ad1cb2b895b": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "52a7a6825523c9ac32f16c9ac018b12ffd2d8c764497d897c4a3bd9f2eb0f295",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Drake" }
    }
  ],
  "fb846366-2105-4999-8af1-a11687f42e17": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "c9e904c4465bf0aa7b951a3a65a58fdee972bc1ec468b8409cdd05eff5c4ebb3",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "fbbf1a9c-8b94-4ee7-92db-65b531149990": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "d2a1b10007ae994c06f48da7001aae0dbf4bcfd9a32e6d13efcdf11f9bfb2f34",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Instant" }
    }
  ],
  "fbc6cfc3-b232-40bf-bc0c-4618f6f5c9a5": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "0fc6f08079316f73883649f39b813df33f05c17c66f1becf79daf33866014676",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "fbfd1278-1486-4516-8846-007ce1985ee9": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-legend-types.json",
      referenceSha256: "cdd8082b024127c8c8247c9e03cde618661cb7e2a92478803c6304c14835ddaa",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Legend" }
    },
    {
      source: "games/magic/fixtures/accuracy/historic-mana-order.json",
      referenceSha256: "cdd8082b024127c8c8247c9e03cde618661cb7e2a92478803c6304c14835ddaa",
      reason: "Scan-reviewed original mana order.",
      fields: { manaSymbols: ["2", "B", "U", "U", "W"] }
    }
  ],
  "fc1973a3-1410-4c6d-9b09-bd9d18646a1e": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "8831e292aa790b01e32b76882cb24df44d40af3123d4b56ab781729c63d37f43",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ],
  "fcc1004f-7cee-420a-9f0e-2986ed3ab852": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "c2f4c92208da82f7d23a3a3cdebbf6bcb1305d4eed1a487fa8819b32aa85cfca",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "fd333b18-b896-4ab8-9c46-eed4efdd94f2": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "5e0b0b342504e03e77ee5de30bf149051185af8baea554bdbfc8d924c5361ebb",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Goblins" }
    }
  ],
  "fdac742b-16db-4e03-be8f-c600dbd522d5": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "6f8d9d68693fbb3dd3f79dab2aea63b707e8ff5e39fae5fb826cac7b99b3083c",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Mono Artifact" }
    }
  ],
  "fddcc557-871d-425b-b4ee-bc0c9bc717aa": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-creature-types.json",
      referenceSha256: "e87b83a98772d26519bba0eff49c213793cdb92be12671df998ede0db74ce13d",
      reason: "Original type individually transcribed from this printing’s Scryfall scan on 2026-10-15. This partial review certifies only the type line; Oracle wording remains unchanged.",
      fields: { typeLine: "Summon Faerie" }
    }
  ],
  "fde9e9cb-68ab-4856-8ad6-30f66666dd93": [
    {
      source: "games/magic/fixtures/accuracy/m20/annotations.json",
      referenceSha256: "539ebfed43d99849b0e6d811acf3fbafb9aa8b1a80ee203ce90079ad7ea45536",
      reason: "24 metadata-selected transfer cards. Wording, type and explicit style runs reviewed against cached M20 PNGs before evaluating either renderer. Historical names, battlefield wording and activation wording follow the scan. Soft line breaks are stored separately and never forced into painter input.",
      fields: {
        rulesText: `{T}: Add {C}.
{1}, {T}, Sacrifice Cryptic Caves: Draw a card. Activate this ability only if you control five or more lands.`,
        flavorText: "Only when you’ve given up the search will the caves yield their secrets.",
        typeLine: "Land",
        rulesParagraphs: [
          { role: "rules", runs: [{ text: "{T}: Add {C}.", italic: !1 }] },
          {
            role: "rules",
            runs: [
              {
                text: "{1}, {T}, Sacrifice Cryptic Caves: Draw a card. Activate this ability only if you control five or more lands.",
                italic: !1
              }
            ]
          },
          {
            role: "flavor",
            runs: [
              {
                text: "Only when you’ve given up the search will the caves yield their secrets.",
                italic: !0
              }
            ]
          }
        ]
      }
    }
  ],
  "fe85a124-0d8b-4a29-8df1-65888a39147f": [
    {
      faceName: "Scheming Silvertongue",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "48e3457cd98ca2eeeaf62ec736f9d0047a36c7cef16b4e7058ba0fe080c5c64c",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: {
        rulesText: `Flying, lifelink
At the beginning of your second main phase, if you gained 2 or more life this turn, this creature becomes prepared. (While it's prepared, you may cast a copy of its spell. Doing so unprepares it.)`,
        typeLine: "Creature — Vampire Warlock"
      }
    },
    {
      faceName: "Sign in Blood",
      source: "games/magic/fixtures/accuracy/prepare-printing-text.json",
      referenceSha256: "48e3457cd98ca2eeeaf62ec736f9d0047a36c7cef16b4e7058ba0fe080c5c64c",
      reason: "MTGJSON lacks originalText/originalType. Both printed panels were visually checked against this full scan; current Scryfall face wording and types match, including reminder text and paragraph breaks.",
      fields: { rulesText: "Target player draws two cards and loses 2 life.", typeLine: "Sorcery" }
    }
  ],
  "fe86493d-e350-40c4-b65f-de63c2f0a91a": [
    {
      source: "games/magic/fixtures/accuracy/8ed/annotations-empty-rules.json",
      referenceSha256: "5049fce516a53f43218b342b9483a38b2797cc01f2f3e6fb3913c99de00a68c0",
      reason: "Rules area, flavor wording and printed type visually checked against this exact Scryfall scan on 2026-10-15. Empty rules are explicit evidence, not inferred from missing MTGJSON fields. Layout and legal text are not certified.",
      fields: {
        typeLine: "Creature — Elephant",
        rulesText: "",
        flavorText: "Armodons are trained to step on things. Enemy things."
      }
    }
  ],
  "fe8ecaee-0de3-45ee-8428-09dc400d63d8": [
    {
      source: "games/magic/fixtures/accuracy/leb/annotations-historic-artifact-types.json",
      referenceSha256: "3b6eb67b68f26ee5f1d43f3f2b35dbc4a2a27f29ae670c206277b96d00e76bda",
      reason: "Original type line visually transcribed from this printing’s Scryfall PNG; only the type line is certified. Oracle wording remains unchanged.",
      fields: { typeLine: "Continuous Artifact" }
    }
  ],
  "feb3d45c-a28c-49d2-ab79-53ab42c7fdfd": [
    {
      source: "games/magic/fixtures/accuracy/m21/annotations.json",
      referenceSha256: "2613d545b7cd81485039ff13a9c310ed02d2e3ca6791afc325d94474bfec0d7b",
      reason: "Body wording, type lines and style spans reviewed against cached full PNGs. Soft line breaks are measured, not forced into renderer input. Apostrophes and quotation marks follow the scans.",
      fields: {
        rulesText: `Scoured Barrens enters the battlefield tapped.
When Scoured Barrens enters the battlefield, you gain 1 life.
{T}: Add {W} or {B}.`,
        flavorText: "",
        typeLine: "Land",
        rulesParagraphs: [
          {
            role: "rules",
            runs: [{ text: "Scoured Barrens enters the battlefield tapped.", italic: !1 }]
          },
          {
            role: "rules",
            runs: [
              {
                text: "When Scoured Barrens enters the battlefield, you gain 1 life.",
                italic: !1
              }
            ]
          },
          { role: "rules", runs: [{ text: "{T}: Add {W} or {B}.", italic: !1 }] }
        ]
      }
    }
  ],
  "fec3275e-4491-43a8-9f23-d7b48177c103": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "a444691ef8951fcc9c6202111d9a0996cd9cc4aad51dd0d49ed465a37d986c89",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Enchantment" }
    }
  ],
  "ff37b863-f8c4-4584-8cc2-ac0e096e583f": [
    {
      source: "games/magic/fixtures/accuracy/arn/annotations-printed-types.json",
      referenceSha256: "05ce39cddacc7408f70dee774b8f6aeb5d6dd35059237459a9102475654b86f6",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Land" }
    }
  ],
  "ff76ac86-8a8a-47fe-9388-8950ca3e26c3": [
    {
      source: "games/magic/fixtures/accuracy/lea/annotations-early-land-types.json",
      referenceSha256: "da13820820c144ea00f8117d29e170eb8f963f255a6d5811b016ab435159b5c0",
      reason: "Type line visually checked against the cached Scryfall PNG. This partial review does not certify other wording.",
      fields: { typeLine: "Land" }
    }
  ],
  "ff78eef1-efaa-4a12-bf5d-fec83c14aff8": [
    {
      source: "games/magic/fixtures/accuracy/leg/annotations-noncreature-types.json",
      referenceSha256: "178bcfadaa409454cb3ea2a735a9a6270d8eddfa3fb53d1a4a3ed602b2b8a7ba",
      reason: "Original type individually read from this printing’s Scryfall scan on 2026-10-15. Certifies the type line only; Oracle wording is unchanged.",
      fields: { typeLine: "Enchant Creature" }
    }
  ],
  "ff99543d-86a1-44f8-88ec-aaec071d6c05": [
    {
      source: "games/magic/fixtures/accuracy/drk/annotations-printed-types.json",
      referenceSha256: "5fa30741e445086fd83d4a2a5469a016063f05771d0a1462b8a5f916abb3b6f3",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Summon Leeches" }
    }
  ],
  "ffd7eb90-ae95-49df-898a-9510187bce1c": [
    {
      source: "games/magic/fixtures/accuracy/atq/annotations-printed-types.json",
      referenceSha256: "2113215f2a51b8debc288044f7120169b981e52eb9235326c5dd3eef7d520afe",
      reason: "Type line visually checked against this printing’s Scryfall scan. Rules, flavor, stats, artist and layout are separate obligations.",
      fields: { typeLine: "Sorcery" }
    }
  ]
};
function p(n, i) {
  return n.split(`
`).filter(Boolean).map((r) => ({
    role: i,
    runs: i === "rules" ? r.split(/(\([^)]*\))/g).filter(Boolean).map((a) => ({ text: a, italic: a.startsWith("(") })) : r.split("*").map((a, t) => ({ text: a, italic: t % 2 === 0 })).filter((a) => a.text)
  }));
}
function w(n) {
  const { flavorText: i, ...r } = structuredClone(n), a = r.rulesParagraphs ?? [
    ...p(n.rulesText, "rules"),
    ...p(i ?? "", "flavor")
  ];
  return {
    ...r,
    rulesText: a.map((t) => t.runs.map((l) => l.text).join("")).join(`
`),
    rulesParagraphs: a
  };
}
function $(n, i, r = {}) {
  if (!n.trim()) throw Error("Printing ID must not be empty");
  for (const s of [i.oracle, i.original])
    if (s && (typeof s.typeLine != "string" || typeof s.rulesText != "string"))
      throw Error("Printing wording requires a type line and rules text");
  const a = {
    printingId: n,
    catalogRevision: X,
    status: "unreviewed",
    identity: r.referenceSha256 ? "printing-id-and-scan" : "printing-id",
    corrections: []
  }, t = {
    wordings: {
      oracle: w(i.oracle),
      ...i.original ? { original: w(i.original) } : {}
    },
    provenance: a
  }, l = Object.hasOwn(j, n) ? j[n] : void 0;
  if (!l) return t;
  if (l.some((s) => s.faceName) && !r.faceName)
    return a.status = "face-required", t;
  const f = l.filter((s) => !s.faceName || s.faceName === r.faceName);
  if (!f.length)
    return a.status = "face-not-found", t;
  if (r.referenceSha256 && f.some((s) => s.referenceSha256 !== r.referenceSha256))
    return a.status = "reference-mismatch", t;
  if (!i.original)
    return a.status = "missing-original", t;
  let c = structuredClone(i.original);
  for (const s of f) {
    const e = Object.keys(s.fields), d = Object.fromEntries(e.map((u) => [u, structuredClone(c[u])])), o = structuredClone(s.fields);
    if (s.paragraphScope === "rules-only" && o.rulesParagraphs) {
      const u = c.rulesParagraphs?.filter((y) => y.role === "flavor") ?? p(c.flavorText ?? "", "flavor");
      o.rulesParagraphs = [...o.rulesParagraphs, ...u];
    }
    if (!o.rulesParagraphs && c.rulesParagraphs && (o.rulesText !== void 0 || o.flavorText !== void 0)) {
      const u = o.rulesText === void 0 ? c.rulesParagraphs.filter((g) => g.role !== "flavor") : p(o.rulesText, "rules"), y = o.flavorText === void 0 ? c.rulesParagraphs.filter((g) => g.role === "flavor") : p(o.flavorText, "flavor");
      c.rulesParagraphs = [...u, ...y];
    }
    c = { ...c, ...o }, a.corrections.push({
      ...s.faceName ? { faceName: s.faceName } : {},
      ...s.paragraphScope ? { paragraphScope: s.paragraphScope } : {},
      source: s.source,
      referenceSha256: s.referenceSha256,
      reason: s.reason,
      fields: e,
      before: d,
      after: o
    });
  }
  return t.wordings.original = w(c), a.status = "applied", t;
}
const Z = "511d96432596903dda6b1cb69e21242d855d3ab63f4d9e5ac697847ab4975e26", O = {
  "0987461a-45c0-4956-8627-cd27a7e038d0": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "8513aabea9a766a542985505212adde1a6e5c2f62bd40a299d350ee9136c7dfd",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Mark Poole"
  },
  "0bbfd6aa-2fc9-4628-aa17-3ff0c30dc804": {
    source: "games/magic/fixtures/accuracy/planar-artist-review.json",
    referenceSha256: "72e109b3c33a46093295a28fd44aa6dce36993f1afa93a37d0a728bc2408bcf9",
    reason: "Visually verified against full cached Scryfall scan; both provider catalogs use the current canonical name.",
    artist: "Dan Scott"
  },
  "0e9ad288-d164-44a6-96ec-4185a1587f1a": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "6852a3a4b3ac3955e332709d26ba26eb9b9a0ce77fc48e20564079e08043356f",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Ken Meyer Jr."
  },
  "0faa005e-c753-4484-bf64-349350d59094": {
    source: "games/magic/fixtures/accuracy/planar-artist-review.json",
    referenceSha256: "ede4d5b2116bebebe84c2894bd77a52aefd3b1c49c03bb3130b7e9a4670a1c20",
    reason: "Visually verified against full cached Scryfall scan; both provider catalogs use the current canonical name.",
    artist: "Dan Scott"
  },
  "35786a7a-faa6-457d-9b92-da560b93a43a": {
    source: "games/magic/fixtures/accuracy/planar-artist-review.json",
    referenceSha256: "533a00a9521bdad5907511de9045a40b4a4f001d870a8599149bf324919af6c9",
    reason: "Visually verified against full cached Scryfall scan; both provider catalogs use the current canonical name.",
    artist: "Dan Scott"
  },
  "36313dc7-6bf2-4d73-b696-969d984a7466": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "e95ec90c9e34e8428930d4493b8287fa70b01365c59b2bc4475dd261d58a918b",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Denise Detwiler"
  },
  "374df061-ebd2-4f1f-9a6e-7940a49197a9": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "fe22feed2c29becca20e839dc6f6a611a253094760d314a9732d60cb655cc3ae",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Denise Detwiler"
  },
  "394e4fe9-2bb0-4a5c-bf10-b72b519d5226": {
    source: "games/magic/fixtures/accuracy/planar-artist-review.json",
    referenceSha256: "995cae193dca21c1a772294f1e28c86ea5611f76ebe6c3e26c3b196cfb746f60",
    reason: "Visually verified against full cached Scryfall scan; both provider catalogs use the current canonical name.",
    artist: "Dan Scott"
  },
  "4047df9c-335c-4c1a-968d-00f40e2e7386": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "41233c746f016c02ddb8a037b905c2814e5a5050190594202c88eaace577f287",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Kaja & Phil Foglio"
  },
  "42bc0c3f-0a52-4bdc-83da-6484bf3102f3": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "5437571de717ae14be55200bcd27d50ea64b9e3675af58b9617eb3ed77a280ca",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Ken Meyer Jr."
  },
  "8b6da540-6803-47e5-9af0-7ae8e2f84b6c": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "377f439bf647aa25750fc80c6e56be3ecb04f10422740fad011e0c1b7178722b",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Denise Detwiler"
  },
  "8e99870c-b2b9-431b-b8a8-3f4a80aa8fa5": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "3f025e7c463c858378610d3e084e3e38e4df46779d3f9365c58e803dc61bcb0d",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Denise Detwiler"
  },
  "91e0b59d-8f9b-4a76-9845-bcb0dc32523d": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "65ce1526c2ab3e42e7cb0dc4016db9772710acf79cb674afd068a4f6f27f29ba",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Denise Detwiler"
  },
  "92df19c9-e127-42d9-8dd2-7fa5a7095428": {
    source: "games/magic/fixtures/accuracy/lea/annotations.json",
    referenceSha256: "d55bc208415027e08f91f8753134fe2e58bb5d74362f6a803b30e0f0fe6473e9",
    reason: "Scan-reviewed printed artist credit; unrelated wording is not certified.",
    artist: "Douglas Schuler"
  },
  "965048e6-a693-4858-a244-3b9ee10bfb56": {
    source: "games/magic/fixtures/accuracy/planar-artist-review.json",
    referenceSha256: "61e8fc228411308a1cf8df6a73b0ec79ffe41d7d054e9e18105fce7fa7f99c02",
    reason: "Visually verified against full cached Scryfall scan; both provider catalogs use the current canonical name.",
    artist: "Dan Scott"
  },
  "9941f83b-2903-4eab-ac6d-5313e3978fa3": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "305b12ad22f84ed767ff27f0b58b8055e65a7f03197f827973513f5f301b5038",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Ken Meyer Jr."
  },
  "9c1624f7-8275-46d3-ab7e-7b162e27593f": {
    source: "games/magic/fixtures/accuracy/tmp/annotations.json",
    referenceSha256: "f730c8a9fd8eb644fec510b31ad6091c655562b7ad709c8bbb301cb41b40ba6a",
    reason: "Printed credit visibly reads Illus. Matthew Wilson; Scryfall and MTGJSON both normalize the artist name to Matthew D. Wilson.",
    artist: "Matthew Wilson"
  },
  "a696c5b6-f216-454d-8029-74e84bbd1428": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "242f0ba967d7b715bd3896f57c15c66c32b60c88594e3e360da2dcc5db58ac93",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Kaja & Phil Foglio"
  },
  "a6a86e6e-bfff-46af-9d36-c912901fea92": {
    source: "games/magic/fixtures/accuracy/lea/annotations.json",
    referenceSha256: "f35cfcf6fda28ca28d9c1b416c82bec40a3d76701d989080e1ab42e177790d56",
    reason: "Printed Schuler spelling verified in the development scan. Canonical artist metadata retains Shuler; this partial review does not certify other fields.",
    artist: "Douglas Schuler"
  },
  "ac09a506-427f-4636-bcfd-b40f8d511905": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "61bf57e9c811754cf0e47b05a51e36fa164335aa800b9c4ea8ab2dcdb2c9fb41",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Kaja & Phil Foglio"
  },
  "b13bf496-f3c0-4c13-8282-e7abfab6a198": {
    source: "games/magic/fixtures/accuracy/lea/annotations.json",
    referenceSha256: "dcd8ab043bdd27eb87ae5d5680fc4a7b0156f57820a6b7c87b8f55f0af4eb826",
    reason: "Scan-reviewed printed artist credit; unrelated wording is not certified.",
    artist: "Jeff A. Menges"
  },
  "bf2f6936-b50c-4907-9b55-ebf8a3fba8f5": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "0c18f03576bdb7f4376011d9bda950acd9780555580e668b5b2d017df2858ff5",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Denise Detwiler"
  },
  "c44669b2-bf9a-41c3-91c7-d845b0061fbf": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "77c821bfd59ccf8d943d704665c39993eaef24b74229605f0e6785e61bc4524f",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Kaja & Phil Foglio"
  },
  "c8d5d6a5-6807-4a80-9460-7633dc430ee9": {
    source: "games/magic/fixtures/accuracy/2ed/annotations.json",
    referenceSha256: "03fc7650b2c23404b342cb7555d33a65cf9bc15585b039605c1e2c78a070f96a",
    reason: "Printed Schuler spelling verified in the development scan. Canonical artist metadata retains Shuler; this partial review does not certify other fields.",
    artist: "Douglas Schuler"
  },
  "cb0b28ac-144e-43c5-84f3-d4a2a229f49b": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "d38a4d7bfcbb71bf1ee0a75831f08675c7fe6f66f0b9dbfe51529c559609794a",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Ken Meyer Jr."
  },
  "d1c387dd-1347-4443-91ce-b71f7ccdceba": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "dae74d5767a6ed66d59067bb946d5126858d7e8a058d87c36e0feedaddf89e3b",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Ken Meyer Jr."
  },
  "eace2c85-976c-425e-9800-5a6ccbd91b56": {
    source: "games/magic/fixtures/accuracy/lea/annotations.json",
    referenceSha256: "54710d60a0c3af2311dc51dbd23361ac25cf7b88365ae98e63f01e00d795c556",
    reason: "Scan-reviewed printed artist credit; unrelated wording is not certified.",
    artist: "Douglas Schuler"
  },
  "ebe8845e-df1c-481c-949c-aab84af99a05": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "808eb46c46ac4985af440532d943ca76436a48da7fc8b6e4f47bb432d63412c2",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Ken Meyer Jr."
  },
  "f32373dd-06d8-45d1-8777-3b1411bcb30a": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "b9772f8d17541c29fb77c92146231abe79d6aac0db05cea384385cbef6045243",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Néné Thomas"
  },
  "fabc3267-b59b-4f36-8873-5b4b072711ca": {
    source: "games/magic/fixtures/accuracy/early-expansion-footer-wording.json",
    referenceSha256: "6472932946187ac3c03189d8a7168b54829db38dc37753d724bcad37e31169ea",
    reason: "Printed credit visually read from frozen exact-printing scan; canonical artist identity remains unchanged. No geometry certified.",
    artist: "Denise Detwiler"
  }
};
function ee(n, i, r = {}) {
  if (!n.trim()) throw Error("Printing ID must not be empty");
  const a = {
    printingId: n,
    catalogRevision: Z,
    status: "unreviewed",
    identity: r.referenceSha256 ? "printing-id-and-scan" : "printing-id",
    corrections: []
  }, t = Object.hasOwn(O, n) ? O[n] : void 0;
  return t ? r.referenceSha256 && r.referenceSha256 !== t.referenceSha256 ? (a.status = "reference-mismatch", { artist: i, provenance: a }) : (a.status = "applied", a.corrections.push({ ...t, before: i }), { artist: t.artist, provenance: a }) : { artist: i, provenance: a };
}
function k(n) {
  return async (i, r) => {
    const a = await z(i, r);
    try {
      const t = await n.images(
        a.urls.map((l) => ({ url: l, width: H(l) })),
        r
      );
      return {
        images: Y(a.aliases, t.value),
        dispose: () => t.release()
      };
    } finally {
      a.dispose();
    }
  };
}
const _ = {
  id: "mtg",
  dispose() {
    q(), F(), U.clear();
  },
  describe(n, i) {
    const r = structuredClone({
      ...n,
      setCode: n.setCode ?? "GLINT"
    }), a = i === "table" ? [244, 340] : [732, 1020], t = { printingId: null, printedImage: null, face: r }, l = B(r), f = l.length ? l.map((e) => ({ face: e.face, panel: e })) : [{ face: r, panel: void 0 }], c = f.flatMap((e) => {
      if (!e.face.illustration) return [];
      const d = E(e.face, S(e.face).art), o = v(e.face);
      return [
        {
          key: JSON.stringify([
            "mtg-art-v1",
            e.face.illustration,
            e.face.etchedIllustration,
            512,
            20
          ]),
          asset: { url: e.face.illustration, width: 512 },
          threshold: 20,
          ...e.face.artPlacement ? {
            fit: {
              focalPoint: e.face.artPlacement.focalPoint,
              zoom: e.face.artPlacement.zoom
            }
          } : {},
          crop: e.face.illustrationCrop ?? [0, 0, 1, 1],
          destination: e.panel ? x(e.panel, d) : d,
          clip: e.panel ? x(e.panel, o) : o,
          rotation: e.panel?.rotation ?? 0,
          importedMask: e.face.etchedIllustration ? { url: e.face.etchedIllustration, width: 512 } : void 0
        }
      ];
    }), s = { ...t, layer: "etching" };
    return {
      pack: "mtg",
      hologram: V(r),
      color: {
        key: G(t, i),
        size: a,
        paint: (e, d, o) => T(t, i, d, {
          loadImages: k(e),
          underArt: o
        })
      },
      stamp: {
        key: JSON.stringify([
          "mtg-stamp-v6",
          i,
          r.setCode,
          ...r.printingElements?.setSymbol?.hidden ? [["hidden-set-symbol"]] : [],
          f.map((e) => [
            S(e.face).stamp,
            e.face.setCode,
            J(e.face),
            e.face.setSymbolMask ?? "auto",
            ...e.face.printingElements?.setSymbol?.hidden ? [["hidden-set-symbol"]] : [],
            ...e.face.printingElements?.setSymbol?.offset ? [["set-symbol-offset", e.face.printingElements.setSymbol.offset]] : [],
            e.panel ? [
              e.panel.x,
              e.panel.y,
              e.panel.width,
              e.panel.height,
              e.panel.rotation
            ] : null
          ])
        ]),
        size: a,
        paint: (e, d) => T(s, i, d, {
          loadImages: k(e)
        })
      },
      edges: c,
      artWindows: f.map(
        (e) => e.panel ? x(e.panel, v(e.face)) : v(e.face)
      ),
      cornerRadius: D(r),
      regions: [
        ...Object.entries(S(r)).map(([e, d]) => ({ id: e, rect: d })),
        ...P(r) ? Object.entries(I).map(([e, d]) => ({ id: `spell-${e}`, rect: d })) : []
      ]
    };
  }
}, ae = "This Magic game pack is unofficial Fan Content permitted under the Fan Content Policy. Not approved/endorsed by Wizards. Portions of the materials used are property of Wizards of the Coast. ©Wizards of the Coast LLC.";
function re(n, i, r, a, t = "inspect", l = !0) {
  const f = structuredClone({ ...r, setCode: r.setCode ?? "GLINT" }), c = _.describe(f, t), s = (e) => {
    const d = { face: f, printingId: null, printedImage: null, paintLayer: e, rulesText: l };
    return {
      key: G(d, t),
      size: c.color.size,
      paint: (o, u) => T(d, t, u, { loadImages: k(o) })
    };
  };
  return {
    id: n,
    revision: i,
    recipe: {
      ...c,
      color: s("artwork"),
      edges: [],
      stamp: void 0,
      finishCoverageBase: 0,
      overlayFoil: { tone: a, strength: { gold: 0.7, silver: 0.6, prismatic: 0.75 }[a] }
    },
    layers: [
      {
        id: "magic-printing",
        order: 0,
        stage: "over-finish",
        raster: s("printing"),
        finishCoverage: {
          add: {
            key: JSON.stringify(["magic-art-scope-v1", c.color.size, c.artWindows]),
            size: c.color.size,
            async paint() {
              const e = document.createElement("canvas");
              [e.width, e.height] = c.color.size;
              const d = e.getContext("2d");
              d.fillStyle = "#fff";
              for (const [o, u, y, g] of c.artWindows)
                d.fillRect(
                  o * e.width,
                  u * e.height,
                  y * e.width,
                  g * e.height
                );
              return e;
            }
          }
        }
      }
    ]
  };
}
export {
  ie as FACE_RECTS,
  se as FACE_TEXT,
  ce as artPlacementSupport,
  oe as artworkGeometry,
  de as composePrintingSelection,
  ae as disclaimer,
  L as faceFrame,
  S as faceRects,
  le as fromMtgjsonCard,
  fe as fromScryfallCard,
  W as isRetro,
  _ as magic,
  ue as manaSymbolAsset,
  _ as mtg,
  re as opticalDocument,
  ye as printingCalibrationApiVersion,
  be as printingCalibrationOptions,
  ge as printingCalibrationProfiles,
  pe as printingElementSupport,
  he as printingPresetApiVersion,
  me as printingPresetCompatibility,
  Se as printingPresets,
  ve as printingStyleApiVersion,
  xe as printingStyleOptions,
  we as printingStyles,
  Te as profileAssets,
  ke as resolveArtPlacement,
  Le as resolveCardProfile,
  je as resolveFrameColors,
  ee as resolvePrintingArtist,
  Oe as resolvePrintingCalibration,
  Pe as resolvePrintingPreset,
  Ge as resolvePrintingStyle,
  $ as resolvePrintingWording,
  Re as resolveScryfallPrinting,
  Ne as retroFamily,
  Ce as retroRects,
  Ae as setSymbolAsset,
  Me as validateArtPlacement,
  We as validatePrintingCalibration,
  Be as validatePrintingStyle,
  Ee as withCardWording
};
