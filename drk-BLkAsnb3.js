const e = {
  set: "drk",
  kind: "calibration",
  tables: {
    MANA_PRINTING_INK: {
      "drk/B": { family: "mse-old", pixels: 0.2, paperSample: "opaque-percentile" },
      "drk/R": { family: "mse-old", pixels: 0.2, paperSample: "opaque-percentile" }
    },
    PRINTING_MANA_PROFILES: {
      drk: {
        dx: 4.5,
        dy: -7.25,
        scaleX: 1.039775,
        scaleY: 1.0048499999999998,
        spacing: 0.8696172248803828,
        glyphs: {
          B: { scale: 1, dx: 0, dy: 0 },
          G: { scale: 1, dx: -0.5, dy: 0 },
          U: { scale: 1, dx: 0, dy: 0 },
          W: { scale: 1.02, dx: -0.5, dy: 0.25 },
          R: { scale: 1.06, dx: 0.25, dy: 0.5 }
        },
        numberScale: 1,
        numberDx: -0.75,
        numberDy: -0.75
      }
    },
    MAJOR_SYMBOL_PROFILES: { "drk/retro/black": [1, -3, 1.26, 1.32] },
    EARLY_EXPANSION_FRAMES: {
      "drk/W": {
        family: "fourth",
        frame: [0.007241475409836138, 0.005283823529411758, 0.9886099999999999, 0.99182],
        art: [0.10742062207650278, 0.09171385210084033, 0.7856154133333332, 0.45245883809523807],
        stockWindow: [
          0.038372537365304674,
          0.029927666637637684,
          0.9228063947301375,
          0.9373903798505366
        ]
      },
      "drk/U": {
        family: "fourth",
        frame: [0.005741032786885253, 0.005651470588235287, 0.9900709999999999, 0.99182],
        art: [0.10870841678688525, 0.0925537943977591, 0.7847962793333333, 0.4515142476190476],
        stockWindow: [
          0.038372537365304674,
          0.029927666637637684,
          0.9228063947301375,
          0.9373903798505366
        ]
      },
      "drk/B": {
        family: "abu",
        frame: [-0.015750000000000042, -0.01547058823529413, 1.0315, 1.028],
        art: [0.10802999999999997, 0.09173512605042017, 0.7846276666666666, 0.4532990476190476],
        stockWindow: [
          0.038372537365304674,
          0.029927666637637684,
          0.9228063947301375,
          0.9373903798505366
        ]
      },
      "drk/G": {
        family: "abu",
        frame: [-0.021598360655737777, -0.015220588235294158, 1.0350000000000001, 1.0275],
        art: [0.10467163934426224, 0.09193298319327729, 0.78522, 0.45307857142857144],
        stockWindow: [
          0.038372537365304674,
          0.029927666637637684,
          0.9228063947301375,
          0.9373903798505366
        ]
      },
      "drk/A": {
        family: "fourth",
        frame: [0.006192590163934432, 0.004732647058823482, 0.987636, 0.9932930000000001],
        art: [0.11022358216393444, 0.09365602039215681, 0.7822077119999999, 0.44981983000000003],
        stockWindow: [
          0.038372537365304674,
          0.029927666637637684,
          0.9228063947301375,
          0.9373903798505366
        ]
      },
      "drk/R": {
        family: "fourth",
        frame: [0.005497032786885287, 0.003936470588235265, 0.9905579999999999, 0.9952570000000001],
        art: [0.10785469278688528, 0.09208780487394955, 0.7865030519999999, 0.45213103714285713],
        stockWindow: [
          0.038372537365304674,
          0.029927666637637684,
          0.9228063947301375,
          0.9373903798505366
        ]
      },
      "drk/L": {
        family: "abu",
        frame: [-0.013743852459016406, -0.014323529411764744, 1.028, 1.0235],
        art: [0.10687481420765026, 0.09290028011204479, 0.7840213333333333, 0.45034],
        stockWindow: [
          0.038372537365304674,
          0.029927666637637684,
          0.9228063947301375,
          0.9373903798505366
        ]
      },
      "drk/M": {
        family: "fourth",
        frame: [0.0037039999999999296, 0.004364999999999952, 0.990558, 0.9932930000000001],
        art: [0.10804277599999994, 0.09281537666666662, 0.78584268, 0.45123882000000004],
        stockWindow: [
          0.038372537365304674,
          0.029927666637637684,
          0.9228063947301375,
          0.9373903798505366
        ]
      }
    },
    EARLY_EXPANSION_COLORS: {
      "drk/W": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.007241475409836138,0.005283823529411758,0.9886099999999999,0.99182]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -7.845718158039411,
            saturationScale: 0.9701020808196514,
            brightnessScale: 1.0703611809699505,
            valueGamma: 0.7617441387795468
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.35000000000000037,
            brightnessScale: 0.9743421052631579
          },
          mask: {
            kind: "rect",
            rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
            feather: 0.0013333333333333333
          }
        }
      },
      "drk/U": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.005741032786885253,0.005651470588235287,0.9900709999999999,0.99182]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: 3.885649697326273,
            saturationScale: 0.5020523275923062,
            brightnessScale: 1.0303224022017168,
            valueGamma: 1.0035873157195883
          },
          paper: {
            hueDegrees: 2.104082150101476,
            saturationScale: 0.6009076119530785,
            brightnessScale: 0.9462809917355373
          },
          mask: {
            kind: "rect",
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333
          }
        }
      },
      "drk/B": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.015750000000000042,-0.01547058823529413,1.0315,1.028]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -60,
            saturationScale: 0.35,
            brightnessScale: 1.4,
            valueGamma: 1.3026215842864537
          },
          paper: {
            hueDegrees: -7.0356800766284096,
            saturationScale: 0.6512602087114338,
            brightnessScale: 0.9539748953974896
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
            frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23333333333333334],
            paperRgb: [0.9372549019607843, 0.8, 0.596078431372549]
          }
        }
      },
      "drk/G": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.021598360655737777,-0.015220588235294158,1.0350000000000001,1.0275]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -27.640570574898614,
            saturationScale: 0.5938588241247582,
            brightnessScale: 1.0755759219987682,
            valueGamma: 0.8179143870418026
          },
          paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          mask: {
            kind: "chroma",
            bounds: [
              0.09221311475409837,
              0.5823529411764706,
              0.8176229508196722,
              0.3176470588235294
            ],
            seed: [0.5, 0.7352941176470589],
            frameRgb: [0.23137254901960785, 0.31176470588235294, 0.27647058823529413],
            paperRgb: [0.4117647058823529, 0.2823529411764706, 0.25882352941176473]
          }
        }
      },
      "drk/A": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006192590163934432,0.004732647058823482,0.987636,0.9932930000000001]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: -1.9224806201550564,
            saturationScale: 0.8278170951089796,
            brightnessScale: 1.0182648401826484
          },
          mask: {
            kind: "rect",
            rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
            feather: 0.0013333333333333333
          }
        }
      },
      "drk/R": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.005497032786885287,0.003936470588235265,0.9905579999999999,0.9952570000000001]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -14.822680479685992,
            saturationScale: 0.713980938724586,
            brightnessScale: 0.912448781306126,
            valueGamma: 1.119045488282831
          },
          paper: {
            hueDegrees: -8.511963070441652,
            saturationScale: 0.6308842757683822,
            brightnessScale: 0.8089285714285716
          },
          mask: {
            kind: "rect",
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333
          }
        }
      },
      "drk/L": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.013743852459016406,-0.014323529411764744,1.028,1.0235]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: 15.053712033967122,
            saturationScale: 0.851698443694213,
            brightnessScale: 1.3806569068931471,
            valueGamma: 1.2612117214637717
          },
          paper: {
            hueDegrees: -160.17254199917548,
            saturationScale: 0.0803808310379582,
            brightnessScale: 0.96875002416465
          },
          mask: {
            kind: "rect",
            rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
            feather: 0.0013333333333333333
          },
          accents: [
            {
              mask: {
                rings: [
                  {
                    outer: [
                      0.09310414939082734,
                      0.0872726227765166,
                      0.8172800918543088,
                      0.472714733181988
                    ],
                    inner: [
                      0.10705771193468139,
                      0.09876720595419412,
                      0.7893729667666007,
                      0.45116238972384265
                    ]
                  },
                  {
                    outer: [
                      0.12300464055622887,
                      0.5959079283887467,
                      0.7574791095235057,
                      0.2945486939279864
                    ],
                    inner: [
                      0.1409449352554698,
                      0.6088393344636339,
                      0.7215985201250239,
                      0.2701227046754217
                    ]
                  }
                ],
                hueCenter: 29,
                hueRadius: 25,
                hueFeather: 10,
                saturation: [0.25, 0.48]
              },
              adjustment: {
                hueDegrees: -121.2107567229518,
                saturationScale: 0.38346036585069093,
                brightnessScale: 0.3720930232041745
              }
            },
            {
              mask: {
                rings: [
                  {
                    outer: [
                      0.049250095681571744,
                      0.04273111296301621,
                      0.9029948331951266,
                      0.9210034771114112
                    ],
                    inner: [
                      0.06719039038081266,
                      0.05566251903790342,
                      0.8651208777189513,
                      0.889393373372798
                    ]
                  }
                ],
                hueCenter: 29,
                hueRadius: 25,
                hueFeather: 10,
                saturation: [0.25, 0.48]
              },
              adjustment: {
                hueDegrees: -99.32515598479127,
                saturationScale: 0.29891977136362763,
                brightnessScale: 0.5804827313632643
              }
            }
          ]
        }
      },
      "drk/M": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png",[0.0037039999999999296,0.004364999999999952,0.990558,0.9932930000000001]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -11.994683405585683,
            saturationScale: 0.6356207383906354,
            brightnessScale: 0.9313845771881127,
            valueGamma: 1.0329321771462636
          },
          paper: {
            hueDegrees: -24.105642369886258,
            saturationScale: 0.4796630967703456,
            brightnessScale: 0.9324323962458886
          },
          mask: {
            kind: "rect",
            rect: [0.1160164271047228, 0.6008146639511202, 0.7742282963611269, 0.29501617347550013],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    EARLY_EXPANSION_MANA_TARGETS: {
      "drk-black-B": [0.5725490196078431, 0.48627450980392156, 0.4627450980392157],
      "drk-black-G": [0.7019607843137254, 0.7647058823529411, 0.6196078431372549],
      "drk-black-U": [0.6941176470588235, 0.803921568627451, 0.8549019607843137],
      "drk-black-N": [0.7254901960784313, 0.6705882352941176, 0.6352941176470588],
      "drk-black-W": [0.9137254901960784, 0.8784313725490196, 0.7529411764705882],
      "drk-black-R": [0.8235294117647058, 0.6470588235294118, 0.592156862745098]
    }
  }
};
export {
  e as default
};
