const e = {
  set: "inr",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "inr-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 0.6181627435848895,
            saturationScale: 1.054930083373806,
            brightnessScale: 0.9775280898876404
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.3903999999999978,
            brightnessScale: 1.0245901639344261
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "inr-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.142150315687218,
            saturationScale: 0.8832387603666523,
            brightnessScale: 0.9239766081871345
          },
          paper: {
            hueDegrees: -2.691511387163473,
            saturationScale: 1.056747448979592,
            brightnessScale: 1
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
      "inr-black-W": [0.996078431372549, 0.9764705882352941, 0.8509803921568627],
      "inr-black-U": [0.6802606033829841, 0.8765397843821006, 0.9723970588235294],
      "inr-black-R": [0.9647058823529412, 0.6745098039215687, 0.5529411764705883]
    },
    MAJOR_SYMBOL_PROFILES: {
      "inr/component/black": [-1, -1.5, 0.96, 0.98],
      "inr/m15-accurate/black": [-1, 0, 1.08, 1.12]
    },
    MAJOR_FRAME_INSETS: { "inr/black": 1 },
    printingBlackPoints: {
      inr: [
        {
          set: "inr",
          stock: "#130c0d",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":0.6181627435848895,"saturationScale":1.054930083373806,"brightnessScale":0.9775280898876404},"paper":{"hueDegrees":0,"saturationScale":0.3903999999999978,"brightnessScale":1.0245901639344261},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        },
        {
          set: "inr",
          stock: "#130c0d",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":-4.142150315687218,"saturationScale":0.8832387603666523,"brightnessScale":0.9239766081871345},"paper":{"hueDegrees":-2.691511387163473,"saturationScale":1.056747448979592,"brightnessScale":1},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      inr: [
        {
          set: "inr",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#130c0d",
          family: "retro"
        }
      ]
    }
  }
};
export {
  e as default
};
