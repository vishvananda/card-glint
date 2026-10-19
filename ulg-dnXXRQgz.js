const e = {
  set: "ulg",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "ulg-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 6.196897147214486,
            saturationScale: 1.44966853763682,
            brightnessScale: 0.7764044943820225
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.9164319248826271,
            brightnessScale: 0.8729508196721312
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "ulg-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 27.774922634836457,
            saturationScale: 0.6514603887857772,
            brightnessScale: 1.0321637426900583
          },
          paper: {
            hueDegrees: -4.285714285714221,
            saturationScale: 0.9254331447604949,
            brightnessScale: 0.8391304347826086
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
      "ulg-black-W": [0.8666666666666667, 0.8588235294117645, 0.6901960784313725],
      "ulg-black-N": [0.7232156862745098, 0.69188827412153, 0.6605608619685499]
    },
    RETRO_MANA_PROFILES: { "ulg/black": [438.5, 44, 26.5, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "ulg/retro/black": [2.5, -1, 1.14, 1.12] },
    printingBlackPoints: {
      ulg: [
        {
          set: "ulg",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":6.196897147214486,"saturationScale":1.44966853763682,"brightnessScale":0.7764044943820225},"paper":{"hueDegrees":0,"saturationScale":0.9164319248826271,"brightnessScale":0.8729508196721312},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        },
        {
          set: "ulg",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":27.774922634836457,"saturationScale":0.6514603887857772,"brightnessScale":1.0321637426900583},"paper":{"hueDegrees":-4.285714285714221,"saturationScale":0.9254331447604949,"brightnessScale":0.8391304347826086},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      ulg: [
        {
          set: "ulg",
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
