const e = {
  set: "ath",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "ath-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.7312202380952383, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -11.893466500208092,
            saturationScale: 0.9593076222289706,
            brightnessScale: 0.9487179487179488
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
      "ath-white-N": [0.7181617647058823, 0.6920793333286794, 0.6659969019514763],
      "ath-white-W": [0.8901960784313725, 0.8784313725490196, 0.7490196078431373],
      "ath-white-B": [0.6902352941176471, 0.6832304309842749, 0.6762255678509027],
      "ath-white-R": [0.8509803921568627, 0.5813725490196081, 0.4862745098039216],
      "ath-white-G": [0.5519607843137255, 0.7176470588235294, 0.592156862745098]
    },
    RETRO_MANA_PROFILES: { "ath/white": [439, 43.5, 26, 23.4] },
    printingBlackPoints: {
      ath: [
        {
          set: "ath",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
              adjustment: '{"frame":{"hueDegrees":60,"saturationScale":0.7312202380952383,"brightnessScale":1.4},"paper":{"hueDegrees":-11.893466500208092,"saturationScale":0.9593076222289706,"brightnessScale":0.9487179487179488},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.08627450980392157,0.06274509803921569,0.06274509803921569],"paperRgb":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}',
              lift: [14, 17, 7.5]
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
