const e = {
  set: "vis",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "vis-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 2.7191901408450576,
            saturationScale: 1.5913694945918608,
            brightnessScale: 0.8134831460674158
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.7390216244725715,
            brightnessScale: 0.953186475409836
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
      "vis-black-N": [0.7397941176470588, 0.7077485803727434, 0.6757030430984275],
      "vis-black-W": [0.9215686274509803, 0.8980392156862743, 0.7313725490196078]
    },
    MAJOR_SYMBOL_PROFILES: { "vis/retro/black": [3, 1, 1.28, 1.24] },
    printingBlackPoints: {
      vis: [
        {
          set: "vis",
          stock: "#17140f",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":2.7191901408450576,"saturationScale":1.5913694945918608,"brightnessScale":0.8134831460674158},"paper":{"hueDegrees":0,"saturationScale":0.7390216244725715,"brightnessScale":0.953186475409836},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      vis: [
        {
          set: "vis",
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
