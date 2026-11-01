const e = {
  set: "pls",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "pls-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -7.13672588968916,
            saturationScale: 1.1802209231170504,
            brightnessScale: 0.7887640449438202
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.7511403508771918,
            brightnessScale: 0.9313012295081968
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: { "pls-black-W": [0.9, 0.880392156862745, 0.7607843137254902] },
    printingBlackPoints: {
      pls: [
        {
          set: "pls",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-7.13672588968916,"saturationScale":1.1802209231170504,"brightnessScale":0.7887640449438202},"paper":{"hueDegrees":0,"saturationScale":0.7511403508771918,"brightnessScale":0.9313012295081968},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      pls: [
        {
          set: "pls",
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
