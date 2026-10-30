const e = {
  set: "atq",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "atq-black-W": [0.8647058823529412, 0.8549019607843137, 0.7941176470588235],
      "atq-black-U": [0.7137254901960784, 0.8509803921568626, 0.8901960784313725]
    },
    PRINTING_MANA_PROFILES: {
      atq: {
        dx: 5.25,
        dy: -8,
        scaleX: 1.0293249999999998,
        scaleY: 1.02,
        spacing: 0.9784688995215312,
        glyphs: {
          B: { scale: 1, dx: 0, dy: 0 },
          R: { scale: 1.05, dx: 0.25, dy: 0.75 },
          W: { scale: 1, dx: 0, dy: 0 },
          U: { scale: 1, dx: 0, dy: 0 },
          G: { scale: 1.09, dx: 0.25, dy: 0.25 }
        },
        numberScale: 0.98,
        numberDx: -0.5,
        numberDy: -0.5
      }
    },
    EARLY_EXPANSION_FRAMES: {
      "atq/W": {
        family: "fourth",
        frame: [0.007729475409836071, 0.005406470588235348, 0.987636, 0.9923109999999999],
        art: [0.10780992340983606, 0.09187928630252105, 0.7848414079999999, 0.45268282761904755],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/U": {
        family: "fourth",
        frame: [
          0.0052287377049180395,
          0.0055902941176471125,
          0.9900709999999999,
          0.9923109999999999
        ],
        art: [0.10819612170491803, 0.09253563887955187, 0.7847962793333333, 0.4517377695238095],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/B": {
        family: "abu",
        frame: [-0.01550000000000007, -0.01547058823529413, 1.0310000000000001, 1.028],
        art: [0.10821999999999996, 0.09173512605042017, 0.7842473333333334, 0.4532990476190476],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/G": {
        family: "abu",
        frame: [-0.0180553278688525, -0.015536764705882338, 1.0315, 1.0285],
        art: [0.10778767213114751, 0.09172109243697481, 0.7825646666666667, 0.45351952380952376],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/A": {
        family: "fourth",
        frame: [0.006204737704918072, 0.0046099999999999475, 0.988123, 0.9928020000000001],
        art: [0.1102870270382514, 0.09348941714285709, 0.7825934159999999, 0.4495974771428572],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/L": {
        family: "abu",
        frame: [-0.013737704918032771, -0.011970588235294071, 1.0285, 1.021],
        art: [0.10625396174863388, 0.0945051260504202, 0.785774, 0.45021238095238086],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      },
      "atq/R": {
        family: "fourth",
        frame: [0.005741032786885253, 0.003875294117647035, 0.9900709999999999, 0.995748],
        art: [0.10804836945355191, 0.09207011697478988, 0.7861163739999999, 0.45235409142857136],
        stockWindow: [
          0.038803990666756966,
          0.030084103446862763,
          0.9222112784916465,
          0.9372200417779069
        ]
      }
    },
    EARLY_EXPANSION_COLORS: {
      "atq/W": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.007729475409836071,0.005406470588235348,0.987636,0.9923109999999999]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: 4.6895058968416174,
            saturationScale: 0.8399062893519177,
            brightnessScale: 1.0621330942238176,
            valueGamma: 0.871302303927114
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 1.3998295454545437,
            brightnessScale: 0.9655372807017544
          },
          mask: {
            kind: "rect",
            rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
            feather: 0.0013333333333333333
          }
        }
      },
      "atq/U": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.0052287377049180395,0.0055902941176471125,0.9900709999999999,0.9923109999999999]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: 1.0498949579832697,
            saturationScale: 1.1699718731104778,
            brightnessScale: 0.9380165289256198
          },
          mask: {
            kind: "rect",
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333
          }
        }
      },
      "atq/B": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.01550000000000007,-0.01547058823529413,1.0310000000000001,1.028]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: -3.11206896551721,
            saturationScale: 0.7848932676518883,
            brightnessScale: 0.9372384937238494
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
            frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23431372549019608],
            paperRgb: [0.9372549019607843, 0.8, 0.596078431372549]
          }
        }
      },
      "atq/G": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.0180553278688525,-0.015536764705882338,1.0315,1.0285]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: 17.629629629629562,
            saturationScale: 0.6774409323116217,
            brightnessScale: 1.099526066350711
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
            frameRgb: [0.23431372549019608, 0.30980392156862746, 0.27450980392156865],
            paperRgb: [0.4137254901960784, 0.2823529411764706, 0.2549019607843137]
          }
        }
      },
      "atq/A": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006204737704918072,0.0046099999999999475,0.988123,0.9928020000000001]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: 2.363636363636374,
            saturationScale: 0.7043207881567981,
            brightnessScale: 0.995433789954338
          },
          mask: {
            kind: "rect",
            rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
            feather: 0.0013333333333333333
          }
        }
      },
      "atq/L": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.013737704918032771,-0.011970588235294071,1.0285,1.021]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: 7.884638807432336,
            saturationScale: 0.47987074486465253,
            brightnessScale: 1.3740873825800126,
            valueGamma: 1.4999999999999991
          },
          paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          mask: {
            kind: "rect",
            rect: [0.13934426229508196, 0.6088235294117647, 0.723360655737705, 0.2705882352941177],
            feather: 0.0013333333333333333
          }
        }
      },
      "atq/R": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.005741032786885253,0.003875294117647035,0.9900709999999999,0.995748]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -5.06202013331654,
            saturationScale: 0.7966369226366342,
            brightnessScale: 0.8465344826879605,
            valueGamma: 1.2874975904870842
          },
          paper: {
            hueDegrees: 1.3084229600186745,
            saturationScale: 0.7137019230769232,
            brightnessScale: 0.7142857142857143
          },
          mask: {
            kind: "rect",
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    EARLY_EXPANSION_MANA_TARGETS: {
      "atq-black-N": [0.7372549019607844, 0.7176470588235294, 0.6941176470588235],
      "atq-black-B": [0.6196078431372549, 0.596078431372549, 0.5529411764705883],
      "atq-black-R": [0.8431372549019608, 0.7137254901960784, 0.6431372549019608],
      "atq-black-W": [0.8627450980392157, 0.8784313725490196, 0.803921568627451],
      "atq-black-U": [0.7176470588235294, 0.8392156862745098, 0.8784313725490196],
      "atq-black-G": [0.7607843137254902, 0.8352941176470589, 0.7254901960784313]
    },
    setCalibrationProfiles: {
      atq: {
        schema: 1,
        revision: 3,
        set: "atq",
        border: "black",
        cornerRadius: 0.045,
        setSymbolSource: "keyrune",
        frames: {
          W: {
            family: "fourth",
            frame: [0.007729475409836071, 0.005406470588235348, 0.987636, 0.9923109999999999],
            art: [
              0.10780992340983606,
              0.09187928630252105,
              0.7848414079999999,
              0.45268282761904755
            ],
            stockWindow: [
              0.038803990666756966,
              0.030084103446862763,
              0.9222112784916465,
              0.9372200417779069
            ],
            assetKey: "w"
          },
          U: {
            family: "fourth",
            frame: [
              0.0052287377049180395,
              0.0055902941176471125,
              0.9900709999999999,
              0.9923109999999999
            ],
            art: [0.10819612170491803, 0.09253563887955187, 0.7847962793333333, 0.4517377695238095],
            stockWindow: [
              0.038803990666756966,
              0.030084103446862763,
              0.9222112784916465,
              0.9372200417779069
            ],
            assetKey: "u"
          },
          B: {
            family: "abu",
            frame: [-0.01550000000000007, -0.01547058823529413, 1.0310000000000001, 1.028],
            art: [0.10821999999999996, 0.09173512605042017, 0.7842473333333334, 0.4532990476190476],
            stockWindow: [
              0.038803990666756966,
              0.030084103446862763,
              0.9222112784916465,
              0.9372200417779069
            ],
            assetKey: "b"
          },
          G: {
            family: "abu",
            frame: [-0.0180553278688525, -0.015536764705882338, 1.0315, 1.0285],
            art: [
              0.10778767213114751,
              0.09172109243697481,
              0.7825646666666667,
              0.45351952380952376
            ],
            stockWindow: [
              0.038803990666756966,
              0.030084103446862763,
              0.9222112784916465,
              0.9372200417779069
            ],
            assetKey: "g"
          },
          A: {
            family: "fourth",
            frame: [0.006204737704918072, 0.0046099999999999475, 0.988123, 0.9928020000000001],
            art: [0.1102870270382514, 0.09348941714285709, 0.7825934159999999, 0.4495974771428572],
            stockWindow: [
              0.0396362325382514,
              0.03049376642857138,
              0.9199425129999999,
              0.9368103787961982
            ],
            assetKey: "a"
          },
          L: {
            family: "abu",
            frame: [-0.013737704918032771, -0.015961529411764694, 1.0285, 1.027126],
            art: [0.10625396174863388, 0.09115303915966388, 0.785774, 0.4529136552380951],
            stockWindow: [
              0.038803990666756966,
              0.026345490420485073,
              0.9222112784916465,
              0.9428433620285743
            ],
            assetKey: "l"
          },
          R: {
            family: "fourth",
            frame: [0.005741032786885253, 0.003875294117647035, 0.9900709999999999, 0.995748],
            art: [
              0.10804836945355191,
              0.09207011697478988,
              0.7861163739999999,
              0.45235409142857136
            ],
            stockWindow: [
              0.038803990666756966,
              0.030084103446862763,
              0.9222112784916465,
              0.9372200417779069
            ],
            assetKey: "r"
          }
        },
        colors: {
          W: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.007729475409836071,0.005406470588235348,0.987636,0.9923109999999999]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: 4.6895058968416174,
                saturationScale: 0.8399062893519177,
                brightnessScale: 1.0621330942238176,
                valueGamma: 0.871302303927114
              },
              paper: {
                hueDegrees: 0,
                saturationScale: 1.3998295454545437,
                brightnessScale: 0.9655372807017544
              },
              mask: {
                kind: "rect",
                rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
                feather: 0.0013333333333333333
              }
            }
          },
          U: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.0052287377049180395,0.0055902941176471125,0.9900709999999999,0.9923109999999999]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: 6.532550465394593,
                saturationScale: 0.5983081336006003,
                brightnessScale: 1.0353986533149013,
                valueGamma: 1.1
              },
              paper: {
                hueDegrees: 1.0498949579832697,
                saturationScale: 1.1699718731104778,
                brightnessScale: 0.9380165289256198
              },
              mask: {
                kind: "rect",
                rect: [
                  0.11812030834483456,
                  0.6068048400622977,
                  0.7616050089204565,
                  0.2815382772253505
                ],
                feather: 0.0013333333333333333
              }
            }
          },
          B: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.01550000000000007,-0.01547058823529413,1.0310000000000001,1.028]]',
            stock: "#181510",
            adjustment: {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              paper: {
                hueDegrees: -3.11206896551721,
                saturationScale: 0.7848932676518883,
                brightnessScale: 0.9372384937238494
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
                frameRgb: [0.17647058823529413, 0.2235294117647059, 0.23431372549019608],
                paperRgb: [0.9372549019607843, 0.8, 0.596078431372549]
              }
            }
          },
          G: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.0180553278688525,-0.015536764705882338,1.0315,1.0285]]',
            stock: "#181510",
            adjustment: {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              paper: {
                hueDegrees: 17.629629629629562,
                saturationScale: 0.6774409323116217,
                brightnessScale: 1.099526066350711
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
                frameRgb: [0.23431372549019608, 0.30980392156862746, 0.27450980392156865],
                paperRgb: [0.4137254901960784, 0.2823529411764706, 0.2549019607843137]
              }
            }
          },
          A: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006204737704918072,0.0046099999999999475,0.988123,0.9928020000000001]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: -2.002350743753932,
                saturationScale: 0.581795274332515,
                brightnessScale: 0.8337109156731138,
                valueGamma: 0.7482192507973854,
                rgbScale: [1.0123767511090804, 1.0069612255736127, 0.9809459739175763]
              },
              paper: {
                hueDegrees: 4.025295290715398,
                saturationScale: 0.681312222046106,
                brightnessScale: 1.016462156383666,
                valueGamma: 0.9919923286040149,
                rgbScale: [0.991850156730185, 1.0029680705826796, 1.0052332058680706]
              },
              mask: {
                kind: "rect",
                rect: [
                  0.12443195206516984,
                  0.6097999281178866,
                  0.7552933652001211,
                  0.2785431891697616
                ],
                feather: 0.0013333333333333333
              }
            }
          },
          "L-red": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.013737704918032771,-0.015961529411764694,1.0285,1.027126]]',
            stock: "#181510",
            adjustment: {
              accents: [
                {
                  mask: {
                    rings: [
                      { outer: [0.095, 0.09, 0.81, 0.478], inner: [0.118, 0.107, 0.765, 0.44] },
                      { outer: [0.123, 0.594, 0.755, 0.3], inner: [0.143, 0.612, 0.717, 0.265] }
                    ],
                    hueCenter: 35,
                    hueRadius: 45,
                    hueFeather: 15,
                    saturation: [0.22, 0.55],
                    brightness: [0.3, 0.55]
                  },
                  adjustment: { hueDegrees: 0, saturationScale: 1.1, brightnessScale: 0.95 }
                }
              ],
              frame: {
                hueDegrees: 7.884638807432336,
                saturationScale: 0.47987074486465253,
                brightnessScale: 1.3740873825800126,
                valueGamma: 1.4999999999999991
              },
              paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              mask: {
                kind: "rect",
                rect: [
                  0.13934426229508196,
                  0.6088235294117647,
                  0.723360655737705,
                  0.2705882352941177
                ],
                feather: 0.0013333333333333333
              }
            }
          },
          R: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.005741032786885253,0.003875294117647035,0.9900709999999999,0.995748]]',
            stock: "#181510",
            adjustment: {
              frame: {
                hueDegrees: -5.06202013331654,
                saturationScale: 0.7966369226366342,
                brightnessScale: 0.8465344826879605,
                valueGamma: 1.2874975904870842
              },
              paper: {
                hueDegrees: 1.3084229600186745,
                saturationScale: 0.7137019230769232,
                brightnessScale: 0.7142857142857143
              },
              mask: {
                kind: "rect",
                rect: [
                  0.11812030834483456,
                  0.6068048400622977,
                  0.7616050089204565,
                  0.2815382772253505
                ],
                feather: 0.0013333333333333333
              }
            }
          }
        },
        mana: {
          geometry: {
            dx: 5.25,
            dy: -7.75,
            scaleX: 1.0293249999999998,
            scaleY: 1.02,
            spacing: 0.9784688995215312,
            glyphs: {
              B: { scale: 1, dx: 0, dy: 0 },
              R: { scale: 1.05, dx: 0.25, dy: 0.75 },
              W: { scale: 1, dx: 0, dy: 0 },
              U: { scale: 1, dx: 0, dy: 0 },
              G: { scale: 1.09, dx: 0.25, dy: 0.25 }
            },
            numberScale: 0.98,
            numberDx: -0.5,
            numberDy: -0.5
          },
          paper: {
            W: [0.8627450980392157, 0.8784313725490196, 0.803921568627451],
            U: [0.7176470588235294, 0.8392156862745098, 0.8784313725490196],
            B: [0.6196078431372549, 0.596078431372549, 0.5529411764705883],
            R: [0.8431372549019608, 0.7137254901960784, 0.6431372549019608],
            G: [0.7411764705882353, 0.8196078431372549, 0.7049019607843137],
            N: [0.7372549019607844, 0.7176470588235294, 0.6941176470588235]
          },
          ink: [0.09019607843137255, 0.09411764705882353, 0.07058823529411765],
          paperSample: "printing"
        },
        title: { x: 38, y: 42.5, size: 26.5, width: 1, shadow: 1.25, trim: 0.4, gray: 196 },
        type: { x: 49.4112, y: 391.51, size: 22.45, width: 1, shadow: 1, trim: 0.1, gray: 205 },
        footer: {
          artist: {
            x: 48.5,
            y: 638.5,
            size: 21,
            width: 1.075,
            shadow: 1.5,
            trim: 0.75,
            gray: 242,
            tint: [1, 0.9834710743801653, 0.9380165289256198],
            inkStyle: "separate-shadow",
            prefix: "Illus. © ",
            align: "left",
            baseline: "alphabetic",
            maxWidth: 338
          },
          legal: {
            x: 48.5,
            y: 653,
            size: 10,
            width: 1,
            shadow: 0,
            trim: 0,
            defaultText: "",
            lightGray: 200,
            darkGray: 30
          },
          stats: {
            x: 452.5,
            y: 639,
            size: 27.5,
            width: 0.97,
            shadow: 1.5,
            trim: 0.9,
            gray: 242,
            tint: [1, 0.9834710743801653, 0.9380165289256198],
            inkStyle: "separate-shadow",
            shadowTrim: 0.2,
            baseline: "alphabetic"
          }
        },
        setSymbols: {
          default: {
            placement: "native",
            right: 414,
            centerY: 391.5,
            width: 33,
            height: 16,
            crop: [0, 0.240234375, 1, 0.51953125],
            outline: 0,
            sampling: "low"
          }
        },
        expansionBody: {
          bounds: { x: 70, y: 414, width: 348, height: 184 },
          regular: 22.5,
          textWidth: 1.02,
          threshold: 130,
          offset: -10,
          compact: 15.5,
          compactLeading: 1.2,
          regularLeading: 1,
          largeSize: 27.5,
          largeLeading: 1.1,
          largeOffset: -14,
          unconstrained: {
            offset: -14,
            regularLeading: 0.98,
            compact: 16,
            compactLeading: 1.2,
            fractionalMetrics: !0,
            flavorOrphans: !0,
            flavorOrphanMinCharacters: 120,
            minimumFreeSpace: 20
          }
        }
      }
    }
  }
};
export {
  e as default
};
