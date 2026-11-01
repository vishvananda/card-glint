const e = {
  set: "ody",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "ody-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.730436724826404,
            saturationScale: 1.1895774647887327,
            brightnessScale: 0.7999999999999999
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 1.197101034858387,
            brightnessScale: 0.9361987704918033
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
      "ody-black-W": [0.8862745098039215, 0.8705882352941177, 0.7294117647058824],
      "ody-black-N": [0.696735294117647, 0.6665549286546302, 0.6363745631916132]
    },
    RETRO_MANA_PROFILES: { "ody/black": [438.5, 44, 27, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "ody/retro/black": [1.5, -2, 1.14, 1.06] },
    printingBlackPoints: {
      ody: [
        {
          set: "ody",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-4.730436724826404,"saturationScale":1.1895774647887327,"brightnessScale":0.7999999999999999},"paper":{"hueDegrees":0,"saturationScale":1.197101034858387,"brightnessScale":0.9361987704918033},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      ody: [
        {
          set: "ody",
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
