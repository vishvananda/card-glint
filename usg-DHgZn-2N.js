const e = {
  set: "usg",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "usg-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -0.41717349551845473,
            saturationScale: 1.663864073081557,
            brightnessScale: 0.7617977528089888
          },
          paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.8950409836065574 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "usg-black-N": [0.692735294117647, 0.6627281959813629, 0.6327210978450786],
      "usg-black-W": [0.8765490196078433, 0.8599897089339418, 0.678618595825427]
    },
    RETRO_MANA_PROFILES: { "usg/black": [438.5, 44, 26.5, 23.4] },
    printingBlackPoints: {
      usg: [
        {
          set: "usg",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-0.41717349551845473,"saturationScale":1.663864073081557,"brightnessScale":0.7617977528089888},"paper":{"hueDegrees":0,"saturationScale":0.35,"brightnessScale":0.8950409836065574},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      usg: [
        {
          set: "usg",
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
