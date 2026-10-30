const e = {
  set: "rqs",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "rqs-white-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -3.9569462227912027,
            saturationScale: 0.675647699087608,
            brightnessScale: 0.8932584269662921
          },
          paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9122336065573771 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "rqs-white-R": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/r.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -11.305000607238298,
            saturationScale: 0.7892046722427082,
            brightnessScale: 0.9791955617198335
          },
          paper: {
            hueDegrees: -15.011290079783294,
            saturationScale: 0.8518182848079755,
            brightnessScale: 0.9417475728155339
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "rqs-white-N": [0.7999215686274509, 0.7684890069889343, 0.7370564453504174],
      "rqs-white-W": [0.9235294117647059, 0.9019607843137254, 0.7901960784313725],
      "rqs-white-B": [0.6684117647058823, 0.6399132680547467, 0.6114147714036109],
      "rqs-white-R": [0.9215686274509804, 0.7490196078431373, 0.7019607843137255],
      "rqs-white-G": [0.7333333333333333, 0.8431372549019608, 0.6980392156862745]
    },
    RETRO_MANA_PROFILES: { "rqs/white": [435.5, 42.5, 26.5, 23.4] }
  }
};
export {
  e as default
};
