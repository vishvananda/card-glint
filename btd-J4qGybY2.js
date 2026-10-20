const e = {
  set: "btd",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "btd-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 45.43273932063812,
            saturationScale: 0.47032019704433514,
            brightnessScale: 0.8187134502923976
          },
          paper: {
            hueDegrees: -6.666666666666629,
            saturationScale: 0.8142768838304553,
            brightnessScale: 0.7913043478260869
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
      "btd-white-N": [0.6705098039215687, 0.641465443603184, 0.6124210832847992],
      "btd-white-B": [0.6277892156862745, 0.6043636651257039, 0.5809381145651331],
      "btd-white-R": [0.8411764705882353, 0.541176470588235, 0.4352941176470588]
    },
    RETRO_MANA_PROFILES: { "btd/white": [438.5, 43.5, 26, 23.4] },
    printingBlackPoints: {
      btd: [
        {
          set: "btd",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":45.43273932063812,"saturationScale":0.47032019704433514,"brightnessScale":0.8187134502923976},"paper":{"hueDegrees":-6.666666666666629,"saturationScale":0.8142768838304553,"brightnessScale":0.7913043478260869},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: [24, 12.5, 8]
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
