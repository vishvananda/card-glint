const e = {
  set: "leb",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "leb-black-U": [0.6764705882352942, 0.8088235294117648, 0.8627450980392157]
    },
    PRINTING_COLOR_PROFILES: {
      "leb/black/retro/b.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: -4.7686688311688386,
              saturationScale: 0.8968524740378744,
              brightnessScale: 0.8561715481171549
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
              frameRgb: [0.17647058823529413, 0.2196078431372549, 0.23333333333333334],
              paperRgb: [0.9372549019607843, 0.8, 0.5941176470588235]
            }
          }
        }
      },
      "leb/black/retro/a.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png": {
            frame: {
              hueDegrees: 3.454973118279554,
              saturationScale: 0.7697448531690021,
              brightnessScale: 1.1482843137254901
            },
            paper: {
              hueDegrees: 10.923435302390999,
              saturationScale: 0.6795040998710152,
              brightnessScale: 1.0864864864864865
            },
            mask: {
              kind: "rect",
              rect: [
                0.1290983606557377,
                0.6014705882352941,
                0.7459016393442623,
                0.2852941176470588
              ],
              feather: 0.0013333333333333333
            }
          }
        }
      },
      "leb/black/retro/u.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: -3.8366935483870748,
              saturationScale: 0.8704517231244031,
              brightnessScale: 0.9755555555555556
            },
            mask: {
              kind: "rect",
              rect: [
                0.12704918032786885,
                0.5985294117647059,
                0.7479508196721312,
                0.2852941176470588
              ],
              feather: 0.0013333333333333333
            }
          }
        }
      },
      "leb/black/retro/w.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png": {
            frame: {
              hueDegrees: 5.7318354170936345,
              saturationScale: 0.9083203924844794,
              brightnessScale: 0.9535315985130112
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.37687499999999974,
              brightnessScale: 0.9554753521126761
            },
            mask: {
              kind: "rect",
              rect: [
                0.12704918032786885,
                0.5985294117647059,
                0.7479508196721312,
                0.2867647058823529
              ],
              feather: 0.0013333333333333333
            }
          }
        }
      },
      "leb/black/retro/r.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png": {
            frame: {
              hueDegrees: 1.0502281478526356,
              saturationScale: 0.9263662460655555,
              brightnessScale: 1.033678756476684
            },
            paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            mask: {
              kind: "rect",
              rect: [0.125, 0.5985294117647059, 0.7540983606557377, 0.2852941176470588],
              feather: 0.0013333333333333333
            }
          }
        }
      }
    },
    MANA_PRINTING_TARGETS: {
      "leb-black-W": [0.8941176470588236, 0.8941176470588236, 0.8196078431372549],
      "leb-black-U": [0.6392156862745098, 0.788235294117647, 0.8352941176470589],
      "leb-black-B": [0.44313725490196076, 0.47843137254901963, 0.4745098039215686],
      "leb-black-R": [0.8431372549019608, 0.6666666666666666, 0.596078431372549],
      "leb-black-G": [0.6862745098039216, 0.7803921568627451, 0.6549019607843137],
      "leb-black-N": [0.611764705882353, 0.6352941176470588, 0.6352941176470588]
    },
    MANA_PRINTING_INK: { "leb/R": { family: "mse-old", pixels: 0.4 } },
    PRINTING_MANA_PROFILES: {
      leb: {
        dx: -1.5,
        spacing: 1.75,
        numberDy: -1,
        glyphs: {
          W: { scale: 1.09, dx: 0, dy: 0 },
          U: { scale: 1, dx: 0.5, dy: -1 },
          B: { scale: 1.03, dx: 0.25, dy: -1.25 },
          R: { scale: 1, dx: 0.5, dy: 0.5 },
          G: { scale: 1.12, dx: 0, dy: -1 }
        }
      }
    },
    printingBlackPoints: {
      leb: [
        {
          set: "leb",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":-4.7686688311688386,"saturationScale":0.8968524740378744,"brightnessScale":0.8561715481171549},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.17647058823529413,0.2196078431372549,0.23333333333333334],"paperRgb":[0.9372549019607843,0.8,0.5941176470588235]}}',
              lift: [39, 1.5, 0],
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        },
        {
          set: "leb",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",
              adjustment: '{"frame":{"hueDegrees":3.454973118279554,"saturationScale":0.7697448531690021,"brightnessScale":1.1482843137254901},"paper":{"hueDegrees":10.923435302390999,"saturationScale":0.6795040998710152,"brightnessScale":1.0864864864864865},"mask":{"kind":"rect","rect":[0.1290983606557377,0.6014705882352941,0.7459016393442623,0.2852941176470588],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        },
        {
          set: "leb",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":-3.8366935483870748,"saturationScale":0.8704517231244031,"brightnessScale":0.9755555555555556},"mask":{"kind":"rect","rect":[0.12704918032786885,0.5985294117647059,0.7479508196721312,0.2852941176470588],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        },
        {
          set: "leb",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",
              adjustment: '{"frame":{"hueDegrees":5.7318354170936345,"saturationScale":0.9083203924844794,"brightnessScale":0.9535315985130112},"paper":{"hueDegrees":0,"saturationScale":0.37687499999999974,"brightnessScale":0.9554753521126761},"mask":{"kind":"rect","rect":[0.12704918032786885,0.5985294117647059,0.7479508196721312,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        },
        {
          set: "leb",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",
              adjustment: '{"frame":{"hueDegrees":1.0502281478526356,"saturationScale":0.9263662460655555,"brightnessScale":1.033678756476684},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"mask":{"kind":"rect","rect":[0.125,0.5985294117647059,0.7540983606557377,0.2852941176470588],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      leb: [
        {
          set: "leb",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/",
          geometry: "[0,0,1,1]",
          stock: "#1b1b1b",
          family: "retro"
        }
      ]
    }
  }
};
export {
  e as default
};
