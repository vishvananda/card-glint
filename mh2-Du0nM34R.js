const e = {
  set: "mh2",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "mh2-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -5.12371526456036,
            saturationScale: 0.7905520188605681,
            brightnessScale: 0.9741573033707864
          },
          paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 1.0356352459016396 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "mh2-black-W": [0.9843137254901959, 0.9725490196078431, 0.8999999999999999]
    },
    MAJOR_SYMBOL_PROFILES: {
      "mh2/component/black": [1, -1, 0.96, 0.94],
      "mh2/m15-accurate/black": [0.5, 0, 1.04, 1.06]
    },
    printingBlackPoints: {
      mh2: [
        {
          set: "mh2",
          stock: "#16130e",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-5.12371526456036,"saturationScale":0.7905520188605681,"brightnessScale":0.9741573033707864},"paper":{"hueDegrees":0,"saturationScale":0.35,"brightnessScale":1.0356352459016396},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      mh2: [
        {
          set: "mh2",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#16130e",
          family: "retro"
        }
      ]
    }
  }
};
export {
  e as default
};
