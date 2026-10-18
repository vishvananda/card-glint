const e = {
  set: "itp",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "itp-white-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.2012644046094465,
            saturationScale: 1.1224918378193693,
            brightnessScale: 0.8337078651685392
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.35000000000000003,
            brightnessScale: 0.8798975409836065
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "itp-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 54.72844827586209,
            saturationScale: 0.667496921182266,
            brightnessScale: 0.9824561403508771
          },
          paper: {
            hueDegrees: -8.03571428571422,
            saturationScale: 0.8959469144800777,
            brightnessScale: 0.7304347826086957
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
      "itp-white-N": [0.7553970588235294, 0.725230379996705, 0.6950637011698805],
      "itp-white-W": [0.8941176470588236, 0.8666666666666669, 0.7549019607843137],
      "itp-white-B": [0.7294411764705881, 0.7071826870096959, 0.6849241975488034],
      "itp-white-R": [0.8411764705882353, 0.6156862745098035, 0.5215686274509804],
      "itp-white-G": [0.7196078431372549, 0.7764705882352941, 0.6686274509803921]
    },
    printingBlackPoints: {
      itp: [
        {
          set: "itp",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":54.72844827586209,"saturationScale":0.667496921182266,"brightnessScale":0.9824561403508771},"paper":{"hueDegrees":-8.03571428571422,"saturationScale":0.8959469144800777,"brightnessScale":0.7304347826086957},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: [41, 0, 19]
            }
          ]
        }
      ]
    }
  }
};
export {
  e as default
};
