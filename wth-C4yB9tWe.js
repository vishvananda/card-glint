const e = {
  set: "wth",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "wth-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 0.7816901408450576,
            saturationScale: 1.7463796482863188,
            brightnessScale: 0.7932584269662921
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.6375529661016933,
            brightnessScale: 0.9490881147540983
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
      "wth-black-N": [0.7210588235294119, 0.6898248398369251, 0.6585908561444381],
      "wth-black-W": [0.9147058823529411, 0.8980392156862745, 0.7196078431372549]
    },
    printingBlackPoints: {
      wth: [
        {
          set: "wth",
          stock: "#17140f",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":0.7816901408450576,"saturationScale":1.7463796482863188,"brightnessScale":0.7932584269662921},"paper":{"hueDegrees":0,"saturationScale":0.6375529661016933,"brightnessScale":0.9490881147540983},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      wth: [
        {
          set: "wth",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#17140f",
          family: "retro"
        }
      ]
    }
  }
};
export {
  e as default
};
