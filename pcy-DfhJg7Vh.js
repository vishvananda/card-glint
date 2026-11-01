const e = {
  set: "pcy",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "pcy-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.633564096443024,
            saturationScale: 1.0799672453324602,
            brightnessScale: 0.7730337078651686
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.859911894273126,
            brightnessScale: 0.9303278688524589
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "pcy-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 17.807077308120142,
            saturationScale: 0.3893356835959018,
            brightnessScale: 0.9152046783625731
          },
          paper: {
            hueDegrees: -7.681547619047592,
            saturationScale: 0.7065816326530612,
            brightnessScale: 0.782608695652174
          },
          mask: {
            kind: "chroma",
            bounds: [
              0.09221311475409837,
              0.5823529411764706,
              0.8176229508196722,
              0.3176470588235294
            ],
            seed: [0.5, 0.7352941176470589],
            frameRgb: [0.2588235294117647, 0.33529411764705885, 0.1647058823529412],
            paperRgb: [0.9019607843137255, 0.7372549019607844, 0.5176470588235295]
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "pcy-black-W": [0.9098039215686274, 0.8901960784313723, 0.7725490196078432],
      "pcy-black-G": [0.5362745098039216, 0.6901960784313725, 0.5999999999999999]
    },
    MAJOR_SYMBOL_PROFILES: { "pcy/retro/black": [2.5, -2, 1.26, 1.2] },
    printingBlackPoints: {
      pcy: [
        {
          set: "pcy",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-4.633564096443024,"saturationScale":1.0799672453324602,"brightnessScale":0.7730337078651686},"paper":{"hueDegrees":0,"saturationScale":0.859911894273126,"brightnessScale":0.9303278688524589},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        },
        {
          set: "pcy",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":17.807077308120142,"saturationScale":0.3893356835959018,"brightnessScale":0.9152046783625731},"paper":{"hueDegrees":-7.681547619047592,"saturationScale":0.7065816326530612,"brightnessScale":0.782608695652174},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      pcy: [
        {
          set: "pcy",
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
