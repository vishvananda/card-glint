const e = {
  set: "s99",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "s99-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.35, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -15.019828155981486,
            saturationScale: 0.8201216369446448,
            brightnessScale: 0.9316239316239316
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
            frameRgb: [0.08627450980392157, 0.06274509803921569, 0.06274509803921569],
            paperRgb: [0.9176470588235294, 0.7843137254901961, 0.5686274509803921]
          }
        }
      },
      "s99-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 42.145378655608965,
            saturationScale: 0.4593960416241585,
            brightnessScale: 0.9883040935672514
          },
          paper: {
            hueDegrees: -10.47813001605141,
            saturationScale: 0.5791702507449261,
            brightnessScale: 0.7891304347826087
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
      "s99-white-N": [0.7151519607843138, 0.7015578851410496, 0.6879638094977854],
      "s99-white-W": [0.8901960784313725, 0.8862745098039215, 0.7803921568627451],
      "s99-white-B": [0.6936225490196078, 0.6876134427781013, 0.6816043365365948],
      "s99-white-R": [0.8333333333333334, 0.5960784313725492, 0.5411764705882353]
    },
    RETRO_MANA_PROFILES: { "s99/white": [439, 43, 26.5, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "s99/retro/white": [2, -1, 1.24, 1.24] },
    printingBlackPoints: {
      s99: [
        {
          set: "s99",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
              adjustment: '{"frame":{"hueDegrees":60,"saturationScale":0.35,"brightnessScale":1.4},"paper":{"hueDegrees":-15.019828155981486,"saturationScale":0.8201216369446448,"brightnessScale":0.9316239316239316},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.08627450980392157,0.06274509803921569,0.06274509803921569],"paperRgb":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}',
              lift: [21.5, 27.5, 16.5]
            }
          ]
        },
        {
          set: "s99",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":42.145378655608965,"saturationScale":0.4593960416241585,"brightnessScale":0.9883040935672514},"paper":{"hueDegrees":-10.47813001605141,"saturationScale":0.5791702507449261,"brightnessScale":0.7891304347826087},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: [31.5, 17.5, 7.5]
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
