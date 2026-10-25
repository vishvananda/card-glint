const e = {
  set: "mir",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "mir-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -1.5308098591549424,
            saturationScale: 1.75,
            brightnessScale: 0.8289606741573033
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.8293023858921132,
            brightnessScale: 0.9695799180327868
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "mir-black-L": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -0.21134202183861817,
            saturationScale: 0.7810010960906101,
            brightnessScale: 1.2578125
          },
          paper: {
            hueDegrees: 49.72569600359225,
            saturationScale: 0.35,
            brightnessScale: 0.6826484018264841
          },
          mask: {
            kind: "rect",
            rect: [0.11885245901639344, 0.6058823529411764, 0.7663934426229508, 0.2720588235294118],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "mir-black-N": [0.7515, 0.718947400990099, 0.686394801980198],
      "mir-black-W": [0.9313725490196079, 0.9117647058823526, 0.7215686274509804],
      "mir-black-G": [0.6803921568627451, 0.8, 0.5588235294117647]
    },
    printingBlackPoints: {
      mir: [
        {
          set: "mir",
          stock: "#17140f",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-1.5308098591549424,"saturationScale":1.75,"brightnessScale":0.8289606741573033},"paper":{"hueDegrees":0,"saturationScale":0.8293023858921132,"brightnessScale":0.9695799180327868},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        },
        {
          set: "mir",
          stock: "#17140f",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png",
              adjustment: '{"frame":{"hueDegrees":-0.21134202183861817,"saturationScale":0.7810010960906101,"brightnessScale":1.2578125},"paper":{"hueDegrees":49.72569600359225,"saturationScale":0.35,"brightnessScale":0.6826484018264841},"mask":{"kind":"rect","rect":[0.11885245901639344,0.6058823529411764,0.7663934426229508,0.2720588235294118],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      mir: [
        {
          set: "mir",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#17140f",
          family: "retro"
        }
      ]
    }
  }
};
export {
  e as default
};
