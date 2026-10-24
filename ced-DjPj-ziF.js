const e = {
  set: "ced",
  kind: "wording",
  tables: {
    printingCorrections: {
      "075e48f1-3c95-42c4-b90d-55dc6738435d": [
        {
          referenceSha256: "97c549b87d587308b213c5d5211e66d3e647f14a54cd427a81d202f9521cdc8f",
          fields: {
            typeLine: "Summon Paladin",
            flavorText: `"Look to the north; there you will find aid and comfort."
—The Book of Tal`
          },
          evidence: 34
        }
      ],
      "ac1d677b-a43f-4aa0-9219-fc8d0a776faa": [
        {
          referenceSha256: "c73422e044098228e62c059242604e3b507bb4bae63c24853f74bb918cf5a3ea",
          fields: {
            rulesText: `Flying
{R}: +1/+0 until end of turn; if more than {R}{R}{R} is spent in this way, Dragon Whelp is destroyed at end of turn.`,
            flavorText: `“O to be a dragon . . . of silkworm size or immense . . .”
—Marianne Moore, “O to Be a Dragon”`,
            rulesParagraphs: [
              { role: "rules", runs: [{ text: "Flying", italic: !1 }] },
              {
                role: "rules",
                runs: [
                  {
                    text: "{R}: +1/+0 until end of turn; if more than {R}{R}{R} is spent in this way, Dragon Whelp is destroyed at end of turn. ",
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
          },
          evidence: 33
        }
      ],
      "b8e19ebf-a1da-4af5-8948-a199a05283f6": [
        {
          referenceSha256: "d76591ad9c4e0112b2d5593ef05cedba480dc661bc5aababb9bf288c034bdaf3",
          fields: { manaSymbols: ["1", "B"] },
          evidence: 34
        }
      ]
    }
  }
};
export {
  e as default
};
