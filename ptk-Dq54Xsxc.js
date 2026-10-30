const e = {
  set: "ptk",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "ptk-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.8566071428571431, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -9.407859606185411,
            saturationScale: 1.1858096941603267,
            brightnessScale: 0.952991452991453
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
      }
    },
    DUAL_MANA_TARGETS: {
      "ptk-white-N": [0.7037843137254901, 0.6732986070665891, 0.6428129004076878],
      "ptk-white-W": [0.907843137254902, 0.8784313725490197, 0.7098039215686275],
      "ptk-white-B": [0.6922156862745099, 0.6622310959037083, 0.6322465055329064],
      "ptk-white-R": [0.8490196078431372, 0.5666666666666665, 0.42745098039215684]
    },
    RETRO_MANA_PROFILES: { "ptk/white": [439, 43, 26.5, 23.4] },
    printingBlackPoints: {
      ptk: [
        {
          set: "ptk",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
              adjustment: '{"frame":{"hueDegrees":60,"saturationScale":0.8566071428571431,"brightnessScale":1.4},"paper":{"hueDegrees":-9.407859606185411,"saturationScale":1.1858096941603267,"brightnessScale":0.952991452991453},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.08627450980392157,0.06274509803921569,0.06274509803921569],"paperRgb":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}',
              lift: [14, 17.5, 7.5]
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
