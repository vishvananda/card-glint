const e = {
  set: "6ed",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "6ed-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.4424509803921568, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -9.796244277985807,
            saturationScale: 0.9636483807005948,
            brightnessScale: 0.9444444444444445
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
      "6ed-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 6.568010131532219,
            saturationScale: 0.6071820777509336,
            brightnessScale: 0.9181286549707602
          },
          paper: {
            hueDegrees: -8.571428571428555,
            saturationScale: 0.8757351823708206,
            brightnessScale: 0.8173913043478261
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
      "6ed-white-N": [0.7096078431372548, 0.6791772592700446, 0.6487466754028343],
      "6ed-white-W": [0.8862745098039215, 0.8666666666666667, 0.7156862745098039],
      "6ed-white-B": [0.7284411764705883, 0.6968874126383229, 0.6653336488060572]
    },
    RETRO_MANA_PROFILES: { "6ed/white": [439, 43.5, 26.5, 23.4] }
  }
};
export {
  e as default
};
