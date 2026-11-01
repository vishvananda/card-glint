const e = {
  set: "tor",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "tor-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.125844105730266,
            saturationScale: 1.3379202774282588,
            brightnessScale: 0.7797752808988764
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 1.2835277777777736,
            brightnessScale: 0.9177561475409837
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
      "tor-black-N": [0.6698186274509803, 0.6516680813893724, 0.6335175353277643],
      "tor-black-W": [0.884313725490196, 0.8598039215686275, 0.7254901960784313]
    }
  }
};
export {
  e as default
};
