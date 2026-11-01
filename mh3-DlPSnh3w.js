const e = {
  set: "mh3",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "mh3-black-C": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/c.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1.3783333333333334, brightnessScale: 1 },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.9614659685863863,
            brightnessScale: 0.9979166666666666
          },
          mask: {
            kind: "rect",
            rect: [0.10860655737704918, 0.5985294117647059, 0.7868852459016393, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "mh3-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -5.728282493368738,
            saturationScale: 0.8035133376707874,
            brightnessScale: 0.9298245614035087
          },
          paper: {
            hueDegrees: -0.8894878706198597,
            saturationScale: 1.07695026062373,
            brightnessScale: 1.0043478260869565
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
      "mh3-black-W": [0.996078431372549, 0.9725490196078431, 0.8549019607843137],
      "mh3-black-U": [0.7098039215686275, 0.8745098039215684, 0.9647058823529412],
      "mh3-black-R": [0.9607843137254901, 0.6745098039215689, 0.5529411764705883],
      "mh3-black-B": [0.8132107843137254, 0.7823282841363888, 0.7514457839590519]
    },
    RETRO_MANA_PROFILES: { "mh3/black": [436.5, 46, 25.5, 23.4] }
  }
};
export {
  e as default
};
