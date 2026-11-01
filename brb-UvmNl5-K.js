const e = {
  set: "brb",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "brb-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.7403869047619052, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -9.399216201522222,
            saturationScale: 1.1101902451481103,
            brightnessScale: 0.9401709401709403
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
      "brb-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 28.994895644283133,
            saturationScale: 0.5908991706678307,
            brightnessScale: 0.9239766081871345
          },
          paper: {
            hueDegrees: -4.285714285714221,
            saturationScale: 0.8685969387755101,
            brightnessScale: 0.7999999999999999
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
      "brb-white-N": [0.7013872549019609, 0.6710053812366532, 0.6406235075713455],
      "brb-white-B": [0.6907107843137253, 0.6607913815278587, 0.6308719787419917],
      "brb-white-W": [0.8980392156862745, 0.8823529411764705, 0.7333333333333334],
      "brb-white-R": [0.8509803921568627, 0.5764705882352936, 0.44901960784313727],
      "brb-white-G": [0.5882352941176471, 0.7215686274509804, 0.5745098039215686]
    },
    RETRO_MANA_PROFILES: { "brb/white": [438.5, 43.5, 26.5, 23.4] },
    printingBlackPoints: {
      brb: [
        {
          set: "brb",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
              adjustment: '{"frame":{"hueDegrees":60,"saturationScale":0.7403869047619052,"brightnessScale":1.4},"paper":{"hueDegrees":-9.399216201522222,"saturationScale":1.1101902451481103,"brightnessScale":0.9401709401709403},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.08627450980392157,0.06274509803921569,0.06274509803921569],"paperRgb":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}',
              lift: [18, 23, 11.5]
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
