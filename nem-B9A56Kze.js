const e = {
  set: "nem",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "nem-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.289738430583384,
            saturationScale: 0.8915652681436504,
            brightnessScale: 0.8235955056179776
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.5422222222222192,
            brightnessScale: 0.9221311475409836
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
      "nem-black-N": [0.7646666666666668, 0.7369052030713278, 0.7091437394759885],
      "nem-black-W": [0.8980392156862745, 0.8823529411764705, 0.788235294117647]
    },
    MAJOR_SYMBOL_PROFILES: { "nem/retro/black": [2, -2.5, 1.12, 1.26] },
    printingBlackPoints: {
      nem: [
        {
          set: "nem",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-4.289738430583384,"saturationScale":0.8915652681436504,"brightnessScale":0.8235955056179776},"paper":{"hueDegrees":0,"saturationScale":0.5422222222222192,"brightnessScale":0.9221311475409836},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      nem: [
        {
          set: "nem",
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
