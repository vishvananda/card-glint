const e = {
  set: "chr",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "chr-white-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -10.093309859154942,
            saturationScale: 0.6057336832224741,
            brightnessScale: 0.8303370786516854
          },
          paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.8523565573770491 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "chr-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 60,
            saturationScale: 0.5470263556198997,
            brightnessScale: 1.1472478070175438
          },
          paper: {
            hueDegrees: -10.756302521008365,
            saturationScale: 0.7279174397031539,
            brightnessScale: 0.7173913043478262
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
      "chr-white-N": [0.7788088235294118, 0.749940847954281, 0.7210728723791499],
      "chr-white-W": [0.9098039215686274, 0.8901960784313725, 0.792156862745098],
      "chr-white-B": [0.6470392156862745, 0.6242150965428648, 0.6013909773994549],
      "chr-white-R": [0.8784313725490196, 0.7372549019607845, 0.6784313725490196],
      "chr-white-G": [0.7862745098039214, 0.8431372549019608, 0.7372549019607844]
    },
    RETRO_MANA_PROFILES: { "chr/white": [434, 42, 27, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "chr/retro/white": [6.5, -1, 1.06, 0.92] },
    setCalibrationProfiles: {
      chr: {
        schema: 1,
        revision: 1,
        set: "chr",
        border: "white",
        frames: {
          B: {
            family: "fourth",
            assetKey: "b",
            frame: [0.008412885245901688, 0.0038750000000000173, 0.984227, 0.9942749999999999],
            art: [0.11208479591256834, 0.08862510714285715, 0.7788516326666667, 0.4521583928571428],
            stockWindow: [
              0.04082989618652789,
              0.03005786419389906,
              0.9149458496678281,
              0.9388231901450157
            ]
          },
          W: {
            family: "fourth",
            assetKey: "w",
            frame: [0.009181327868852507, 0.005528235294117663, 0.984227, 0.9883829999999999],
            art: [0.10891633053551916, 0.09165875386554623, 0.7821323893333333, 0.4508909114285714],
            stockWindow: [
              0.04082989618652789,
              0.03005786419389906,
              0.9149458496678281,
              0.9388231901450157
            ]
          },
          L: {
            family: "abu",
            assetKey: "l",
            frame: [-0.01100000000000001, -0.013926470588235276, 1.022, 1.0205],
            art: [0.10823333333333333, 0.09249710084033615, 0.7808080000000001, 0.4499919047619047],
            stockWindow: [
              0.04082989618652789,
              0.03005786419389906,
              0.9149458496678281,
              0.9388231901450157
            ]
          },
          M: {
            family: "fourth",
            assetKey: "m",
            frame: [0.003875114754098333, 0.004670882352941216, 0.987149, 0.9908379999999999],
            art: [
              0.10719671008743169,
              0.09243081949579834,
              0.7844544053333333,
              0.45106720380952375
            ],
            stockWindow: [
              0.04082989618652789,
              0.03005786419389906,
              0.9149458496678281,
              0.9388231901450157
            ]
          },
          A: {
            family: "fourth",
            assetKey: "a",
            frame: [
              0.008876590163934451,
              0.004303235294117576,
              0.9822789999999999,
              0.9908380000000001
            ],
            art: [
              0.11234331149726778,
              0.09300682767506997,
              0.7779649679999999,
              0.44870806571428573
            ],
            stockWindow: [
              0.04082989618652789,
              0.03005786419389906,
              0.9149458496678281,
              0.9388231901450157
            ]
          },
          R: {
            family: "fourth",
            assetKey: "r",
            frame: [0.008669032786885295, 0.0024044117647058997, 0.984227, 0.9942749999999999],
            art: [0.11037248945355196, 0.09046876890756303, 0.781476238, 0.45168492857142856],
            stockWindow: [
              0.04082989618652789,
              0.03005786419389906,
              0.9149458496678281,
              0.9388231901450157
            ]
          },
          G: {
            family: "fourth",
            assetKey: "g",
            frame: [0.008913032786885261, 0.005283529411764741, 0.98374, 0.990347],
            art: [0.11122199278688526, 0.09158519655462188, 0.7784662533333333, 0.4508436819047619],
            stockWindow: [
              0.04082989618652789,
              0.03005786419389906,
              0.9149458496678281,
              0.9388231901450157
            ]
          },
          U: {
            family: "fourth",
            assetKey: "u",
            frame: [0.00816888524590161, 0.005222058823529382, 0.9847140000000001, 0.989365],
            art: [0.11057914124590161, 0.09190927787114844, 0.780549964, 0.4503966380952381],
            stockWindow: [
              0.04082989618652789,
              0.03005786419389906,
              0.9149458496678281,
              0.9388231901450157
            ]
          }
        },
        colors: {
          B: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",[0.008412885245901688,0.0038750000000000173,0.984227,0.9942749999999999]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: 11.568852519850159,
                saturationScale: 0.6264093262885903,
                brightnessScale: 0.9065736283771874,
                valueGamma: 0.9541976053595044
              },
              paper: {
                hueDegrees: -0.4410660521628355,
                saturationScale: 0.7745741938091182,
                brightnessScale: 0.9568595958706879,
                valueGamma: 0.9945011344331947
              },
              mask: {
                kind: "chroma",
                bounds: [
                  0.08235432726293468,
                  0.5828441356175872,
                  0.8394486148045915,
                  0.32346951000359414
                ],
                seed: [0.5010266940451745, 0.7385887145082066],
                frameRgb: [0.20784313725490197, 0.24705882352941178, 0.2107843137254902],
                paperRgb: [0.984313725490196, 0.7686274509803922, 0.6196078431372549]
              }
            }
          },
          W: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.009181327868852507,0.005528235294117663,0.984227,0.9883829999999999]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: -4.596994086979372,
                saturationScale: 0.8953055264086665,
                brightnessScale: 0.9862919182943165,
                valueGamma: 0.9609002199031605
              },
              paper: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1.4999999999999698,
                rgbScale: [1.0106057759068157, 1.008282853201524, 1.0109840378918997]
              },
              mask: {
                kind: "rect",
                rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
                feather: 0.0013333333333333333
              }
            }
          },
          "L-dark": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.01100000000000001,-0.013926470588235276,1.022,1.0205]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 0.9842056445484877,
                rgbScale: [0.8914069949568042, 1.0488497864510804, 1.0479594368209708]
              },
              paper: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1.1407490587958857,
                rgbScale: [0.9357938366559878, 1.1288249097144825, 1.4]
              },
              mask: {
                kind: "rect",
                rect: [
                  0.13934426229508196,
                  0.6088235294117647,
                  0.723360655737705,
                  0.2705882352941177
                ],
                feather: 0.0013333333333333333
              },
              accents: [
                {
                  mask: {
                    rings: [
                      {
                        outer: [
                          0.0942622950819672,
                          0.08970588235294118,
                          0.8176229508196722,
                          0.47205882352941175
                        ],
                        inner: [
                          0.1168032786885246,
                          0.10441176470588236,
                          0.764344262295082,
                          0.43970588235294117
                        ]
                      },
                      {
                        outer: [
                          0.12295081967213115,
                          0.5955882352941176,
                          0.7581967213114754,
                          0.29558823529411765
                        ],
                        inner: [
                          0.13934426229508196,
                          0.6088235294117647,
                          0.7233606557377049,
                          0.27058823529411763
                        ]
                      }
                    ],
                    hueCenter: 28,
                    hueRadius: 18,
                    hueFeather: 6,
                    saturation: [0.25, 0.5]
                  },
                  adjustment: {
                    hueDegrees: -160.2939156174508,
                    saturationScale: 0.2989651371356953,
                    brightnessScale: 0.339984369186049,
                    valueGamma: 1
                  }
                }
              ]
            }
          },
          M: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png",[0.003875114754098333,0.004670882352941216,0.987149,0.9908379999999999]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: -8.0490737174144,
                saturationScale: 0.6638660795531984,
                brightnessScale: 0.8852346944776673,
                valueGamma: 1.2832983694072533
              },
              paper: {
                hueDegrees: -60,
                saturationScale: 0.6449889379942318,
                brightnessScale: 0.890147821919653,
                valueGamma: 1.223770689695764
              },
              mask: {
                kind: "rect",
                rect: [
                  0.1160164271047228,
                  0.6008146639511202,
                  0.7742282963611269,
                  0.29501617347550013
                ],
                feather: 0.0013333333333333333
              }
            }
          },
          A: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.008876590163934451,0.004303235294117576,0.9822789999999999,0.9908380000000001]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: -9.068551748087787,
                saturationScale: 0.8143058937854607,
                brightnessScale: 0.9951000256082394,
                valueGamma: 1
              },
              paper: {
                hueDegrees: -8.683776843697897,
                saturationScale: 0.8933123780266717,
                brightnessScale: 0.9957798178122308,
                valueGamma: 0.9655716295151389
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
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.01100000000000001,-0.013926470588235276,1.022,1.0205]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 0.9842056445484877,
                rgbScale: [0.8914069949568042, 1.0488497864510804, 1.0479594368209708]
              },
              paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, valueGamma: 1 },
              mask: {
                kind: "rect",
                rect: [
                  0.13934426229508196,
                  0.6088235294117647,
                  0.723360655737705,
                  0.2705882352941177
                ],
                feather: 0.0013333333333333333
              },
              accents: [
                {
                  mask: {
                    rings: [
                      {
                        outer: [
                          0.0942622950819672,
                          0.08970588235294118,
                          0.8176229508196722,
                          0.47205882352941175
                        ],
                        inner: [
                          0.1168032786885246,
                          0.10441176470588236,
                          0.764344262295082,
                          0.43970588235294117
                        ]
                      },
                      {
                        outer: [
                          0.12295081967213115,
                          0.5955882352941176,
                          0.7581967213114754,
                          0.29558823529411765
                        ],
                        inner: [
                          0.13934426229508196,
                          0.6088235294117647,
                          0.7233606557377049,
                          0.27058823529411763
                        ]
                      }
                    ],
                    hueCenter: 28,
                    hueRadius: 18,
                    hueFeather: 6,
                    saturation: [0.25, 0.5]
                  },
                  adjustment: {
                    hueDegrees: -8.325318175581945,
                    saturationScale: 0.9021751995455712,
                    brightnessScale: 0.821150624999999,
                    valueGamma: 1
                  }
                }
              ]
            }
          },
          R: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.008669032786885295,0.0024044117647058997,0.984227,0.9942749999999999]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: -3.0028516308257234,
                saturationScale: 0.7275925773992532,
                brightnessScale: 0.8778657961467394,
                valueGamma: 1.2786535204287963
              },
              paper: {
                hueDegrees: -4.211046047743708,
                saturationScale: 0.7891688428861855,
                brightnessScale: 0.8930931059454512,
                valueGamma: 0.9998539697713557
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
          G: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.008913032786885261,0.005283529411764741,0.98374,0.990347]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: 9.280636065714294,
                saturationScale: 0.7459343276389809,
                brightnessScale: 0.9304802532766565,
                valueGamma: 0.9613179419044761
              },
              paper: {
                hueDegrees: -1.4889003407095591,
                saturationScale: 0.7261749369309223,
                brightnessScale: 0.9304083488244299,
                valueGamma: 0.9361395503330594
              },
              mask: {
                kind: "chroma",
                bounds: [
                  0.08235432726293468,
                  0.5828441356175872,
                  0.8394486148045915,
                  0.32346951000359414
                ],
                seed: [0.5010266940451745, 0.7385887145082066],
                frameRgb: [0.23823529411764705, 0.39607843137254906, 0.2823529411764706],
                paperRgb: [0.7686274509803922, 0.596078431372549, 0.4627450980392157]
              }
            }
          },
          U: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.00816888524590161,0.005222058823529382,0.9847140000000001,0.989365]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: -0.12437268196399776,
                saturationScale: 0.7347159402765367,
                brightnessScale: 0.9487507867873674,
                valueGamma: 1.2454039186238055
              },
              paper: {
                hueDegrees: -0.8665474296334411,
                saturationScale: 1.0107456907000187,
                brightnessScale: 0.9612297817954527,
                valueGamma: 1.0265166929362035
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
          "L-gold": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.01100000000000001,-0.013926470588235276,1.022,1.0205]]',
            stock: "#edecea",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 0.9842056445484877,
                rgbScale: [0.8914069949568042, 1.0488497864510804, 1.0479594368209708]
              },
              paper: {
                hueDegrees: 5.66727894909966,
                saturationScale: 1.19946539448018,
                brightnessScale: 1.1411561307468574,
                valueGamma: 1.2612372349855736
              },
              mask: {
                kind: "rect",
                rect: [
                  0.13934426229508196,
                  0.6088235294117647,
                  0.723360655737705,
                  0.2705882352941177
                ],
                feather: 0.0013333333333333333
              },
              accents: [
                {
                  mask: {
                    rings: [
                      {
                        outer: [
                          0.0942622950819672,
                          0.08970588235294118,
                          0.8176229508196722,
                          0.47205882352941175
                        ],
                        inner: [
                          0.1168032786885246,
                          0.10441176470588236,
                          0.764344262295082,
                          0.43970588235294117
                        ]
                      },
                      {
                        outer: [
                          0.12295081967213115,
                          0.5955882352941176,
                          0.7581967213114754,
                          0.29558823529411765
                        ],
                        inner: [
                          0.13934426229508196,
                          0.6088235294117647,
                          0.7233606557377049,
                          0.27058823529411763
                        ]
                      }
                    ],
                    hueCenter: 28,
                    hueRadius: 18,
                    hueFeather: 6,
                    saturation: [0.25, 0.5]
                  },
                  adjustment: {
                    hueDegrees: 12.803308722170211,
                    saturationScale: 0.8755457636089718,
                    brightnessScale: 1.326480634447674,
                    valueGamma: 1
                  }
                }
              ]
            }
          }
        },
        mana: {
          geometry: {
            dx: 1.25,
            dy: -4,
            scaleX: 0.995,
            scaleY: 1.01,
            spacing: 0,
            glyphs: {
              B: { scale: 1.04, dx: 0, dy: 0 },
              W: { scale: 1, dx: 0.5, dy: 0 },
              U: { scale: 1.04, dx: 0, dy: -0.5 },
              R: { scale: 1.1, dx: -0.25, dy: 0.5 },
              G: { scale: 1.13, dx: 0, dy: 0 }
            },
            numberScale: 1.03,
            numberDx: -0.25,
            numberDy: -0.5
          },
          paper: {
            W: [0.9176470588235294, 0.8901960784313725, 0.7803921568627451],
            U: [0.7294117647058823, 0.8274509803921568, 0.8509803921568627],
            B: [0.6352941176470588, 0.596078431372549, 0.5764705882352941],
            R: [0.8588235294117647, 0.7333333333333333, 0.6705882352941176],
            G: [0.7333333333333333, 0.8, 0.7019607843137254],
            N: [0.7647058823529411, 0.7372549019607844, 0.7176470588235294]
          },
          ink: [0.23137254901960785, 0.25882352941176473, 0.21568627450980393]
        },
        title: { size: 27, x: 41.25, y: 41, width: 1.025, shadow: 1.25, trim: 0.2, gray: 226 },
        type: { x: 43.25, y: 390.5, size: 22, width: 1.02, shadow: 1, trim: 0.2, gray: 231 },
        footer: {
          artist: { x: 42, y: 626.5, size: 19, width: 0.995, shadow: 1.25, trim: 0.2, gray: 227 },
          legal: {
            x: 41.75,
            y: 640.5,
            size: 11,
            width: 1,
            shadow: 0,
            trim: 0,
            lightGray: 186,
            darkGray: 45
          },
          stats: { x: 451.5, y: 634.5, size: 27.5, width: 1, shadow: 1.25, trim: 0.3, gray: 229 }
        }
      }
    }
  }
};
export {
  e as default
};
