const e = {
  set: "uds",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "uds-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 2.465900667160895,
            saturationScale: 1.6933264866979658,
            brightnessScale: 0.8089887640449439
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 1.0263953488372048,
            brightnessScale: 0.8798975409836065
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "uds-black-N": [0.7138774509803922, 0.6829545415938655, 0.6520316322073385],
      "uds-black-W": [0.8549019607843137, 0.8509803921568626, 0.696078431372549]
    },
    RETRO_MANA_PROFILES: { "uds/black": [439, 44, 26, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "uds/retro/black": [0, 0, 1.2, 1.14] },
    printingBlackPoints: {
      uds: [
        {
          set: "uds",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":2.465900667160895,"saturationScale":1.6933264866979658,"brightnessScale":0.8089887640449439},"paper":{"hueDegrees":0,"saturationScale":1.0263953488372048,"brightnessScale":0.8798975409836065},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      uds: [
        {
          set: "uds",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#181510",
          family: "retro"
        }
      ]
    }
  }
};
export {
  e as default
};
