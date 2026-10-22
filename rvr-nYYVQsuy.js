const e = {
  set: "rvr",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "rvr-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -5.432334166885994,
            saturationScale: 0.8071559831369582,
            brightnessScale: 0.9327485380116958
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
      },
      "rvr-black-A": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/a.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -1.3874016938898421,
            saturationScale: 0.9385034153567606,
            brightnessScale: 1.0527638190954773
          },
          paper: { hueDegrees: 0, saturationScale: 1.75, brightnessScale: 0.9644727366255146 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "rvr-black-W": [1, 0.976470588235294, 0.8470588235294118],
      "rvr-black-U": [0.7098039215686275, 0.8784313725490198, 0.9764705882352941],
      "rvr-black-B": [0.8111911764705881, 0.7810601428272423, 0.7509291091838963],
      "rvr-black-R": [0.9686274509803922, 0.6745098039215688, 0.5568627450980392]
    },
    RETRO_MANA_PROFILES: { "rvr/black": [436.5, 46, 25.5, 23.4] },
    MAJOR_SYMBOL_PROFILES: {
      "rvr/component/black": [-2.5, -1, 0.96, 0.9],
      "rvr/m15-accurate/black": [-2.5, -1.5, 1.06, 1.08]
    }
  }
};
export {
  e as default
};
