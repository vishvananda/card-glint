const e = {
  set: "7ed",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "7ed-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.4756250000000001, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -9.253827741731357,
            saturationScale: 0.8491438968335036,
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
      }
    },
    DUAL_MANA_TARGETS: {
      "7ed-white-N": [0.6787696078431372, 0.671299468668047, 0.6638293294929567],
      "7ed-white-W": [0.8784313725490196, 0.8823529411764706, 0.8],
      "7ed-white-B": [0.6719166666666667, 0.664174656559406, 0.6564326464521453],
      "7ed-white-R": [0.8156862745098039, 0.5568627450980393, 0.4823529411764706],
      "7ed-white-G": [0.4980392156862745, 0.6823529411764706, 0.603921568627451]
    },
    printingBlackPoints: {
      "7ed": [
        {
          set: "7ed",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
              adjustment: '{"frame":{"hueDegrees":60,"saturationScale":0.4756250000000001,"brightnessScale":1.4},"paper":{"hueDegrees":-9.253827741731357,"saturationScale":0.8491438968335036,"brightnessScale":0.9401709401709403},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.08627450980392157,0.06274509803921569,0.06274509803921569],"paperRgb":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}',
              lift: [14, 30.5, 19]
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
