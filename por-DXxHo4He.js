const e = {
  set: "por",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "por-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 33.79094827586209,
            saturationScale: 0.4635736808609119,
            brightnessScale: 0.8713450292397661
          },
          paper: {
            hueDegrees: -6.285714285714221,
            saturationScale: 0.7974474662746454,
            brightnessScale: 0.7695652173913043
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
      "por-black-N": [0.7000196078431372, 0.6772464841423832, 0.6544733604416291],
      "por-black-W": [0.8980392156862745, 0.8862745098039213, 0.75],
      "por-black-R": [0.8549019607843137, 0.5921568627450975, 0.49019607843137253]
    },
    RETRO_MANA_PROFILES: { "por/black": [438.5, 44.5, 26.5, 23.4] }
  }
};
export {
  e as default
};
