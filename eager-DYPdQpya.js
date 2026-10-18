import { r as e } from "./registry-Cg8tIhk4.js";
e({
  set: "2ed",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "2ed-white-W": [0.9215686274509804, 0.9235294117647059, 0.8431372549019608],
      "2ed-white-U": [0.6784313725490196, 0.8176470588235295, 0.8754901960784314],
      "2ed-white-R": [0.8745098039215686, 0.6960784313725488, 0.6196078431372549]
    }
  }
});
e({
  set: "2x2",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "2x2/component/black": [2.5, -2.5, 0.98, 0.92] } }
});
e({
  set: "2xm",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "2xm/component/black": [2.5, -1, 0.86, 0.84],
      "2xm/m15-accurate/black": [2.5, 0, 0.94, 0.94]
    }
  }
});
e({
  set: "3ed",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "3ed-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: 14.90078457567256,
            saturationScale: 0.653073971761817,
            brightnessScale: 1.0440835266821344
          },
          paper: {
            hueDegrees: 1.278409090909122,
            saturationScale: 0.5333302459988145,
            brightnessScale: 0.6657458563535911
          },
          mask: {
            kind: "chroma",
            bounds: [
              0.08866597098326993,
              0.5813465915897927,
              0.8310330898441446,
              0.32945968611477183
            ],
            seed: [0.5010266940451745, 0.7385887145082066],
            frameRgb: [0.2450980392156863, 0.42254901960784313, 0.3088235294117647],
            paperRgb: [0.7098039215686275, 0.5450980392156862, 0.40784313725490196]
          }
        }
      },
      "3ed-white-A": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: 1.5746966632962085,
            saturationScale: 0.5767416007905141,
            brightnessScale: 1.08641975308642
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.5332231404958686,
            brightnessScale: 1.0076912100456623
          },
          mask: {
            kind: "rect",
            rect: [0.12266666666666666, 0.6095238095238096, 0.7573333333333333, 0.2795238095238095],
            feather: 0.0013333333333333333
          }
        }
      },
      "3ed-white-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: 0.5817307692307168,
            saturationScale: 1.0365597519207619,
            brightnessScale: 1.1704225352112676
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 1.0189145738203973,
            brightnessScale: 0.9653827092511013
          },
          mask: {
            kind: "rect",
            rect: [0.116, 0.6071428571428571, 0.764, 0.2842857142857143],
            feather: 0.0013333333333333333
          }
        }
      },
      "3ed-white-U": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: 4.66481543145278,
            saturationScale: 0.4908900383397078,
            brightnessScale: 1.0187590187590188
          },
          paper: {
            hueDegrees: -2.4850427350427253,
            saturationScale: 1.1119809394145677,
            brightnessScale: 0.9338842975206612
          },
          mask: {
            kind: "rect",
            rect: [0.118, 0.6071428571428571, 0.762, 0.2819047619047619],
            feather: 0.0013333333333333333
          }
        }
      },
      "3ed-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: 11.54464285714289,
            saturationScale: 0.47346938775510233,
            brightnessScale: 1.0560344827586208
          },
          paper: {
            hueDegrees: 6.655906593406598,
            saturationScale: 0.5819440807296368,
            brightnessScale: 0.9186991869918698
          },
          mask: {
            kind: "chroma",
            bounds: [
              0.08866597098326993,
              0.5813465915897927,
              0.8310330898441446,
              0.32945968611477183
            ],
            seed: [0.5010266940451745, 0.7385887145082066],
            frameRgb: [0.18627450980392157, 0.22745098039215686, 0.19117647058823528],
            paperRgb: [0.9647058823529412, 0.7450980392156863, 0.5803921568627451]
          }
        }
      },
      "3ed-white-R": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: -9.881086142322147,
            saturationScale: 0.7089456692675254,
            brightnessScale: 0.8498727735368956
          },
          paper: {
            hueDegrees: -3.849587912087827,
            saturationScale: 0.637973137973138,
            brightnessScale: 0.7751196172248803
          },
          mask: {
            kind: "rect",
            rect: [
              0.11733333333333333,
              0.6061904761904762,
              0.7626666666666667,
              0.28285714285714286
            ],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "3ed-white-W": [0.8647058823529412, 0.8607843137254902, 0.788235294117647],
      "3ed-white-U": [0.7372549019607844, 0.8764705882352941, 0.903921568627451],
      "3ed-white-B": [0.6431764705882351, 0.6285728524927555, 0.6139692343972758],
      "3ed-white-R": [0.8784313725490196, 0.7607843137254902, 0.6980392156862745],
      "3ed-white-G": [0.7529411764705881, 0.8274509803921568, 0.7294117647058823]
    },
    PRINTING_COLOR_PROFILES: {
      "3ed/white/retro/g.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.005813317622950737,0.01307290441176476,0.9839835000000001,0.9896105]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png": {
            frame: {
              hueDegrees: 5.471739130434798,
              saturationScale: 0.5185480300467616,
              brightnessScale: 1.0258215962441315
            },
            paper: {
              hueDegrees: 4.58143939393949,
              saturationScale: 0.6677094989990247,
              brightnessScale: 0.6988950276243093
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
              frameRgb: [0.2372549019607843, 0.4176470588235294, 0.307843137254902],
              paperRgb: [0.7098039215686275, 0.5450980392156862, 0.40784313725490196]
            }
          }
        }
      },
      "3ed/white/retro/b.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",[0.00541668647540981,0.014704852941176478,0.98605325,0.99218825]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png": {
            frame: {
              hueDegrees: 11.54464285714289,
              saturationScale: 0.47346938775510233,
              brightnessScale: 1.0560344827586208
            },
            paper: {
              hueDegrees: 7.102125850340144,
              saturationScale: 0.6318309135734831,
              brightnessScale: 0.9048582995951417
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
              frameRgb: [0.18823529411764706, 0.23137254901960785, 0.19509803921568628],
              paperRgb: [0.9686274509803922, 0.7450980392156863, 0.5843137254901961]
            }
          }
        }
      },
      "3ed/white/retro/r.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.007775553278688446,0.011779044117647054,0.9843487500000001,0.9924337500000001]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png": {
            frame: {
              hueDegrees: -8.208153724492945,
              saturationScale: 0.7128092625825923,
              brightnessScale: 0.8324873096446699
            },
            paper: {
              hueDegrees: -0.25087535014006335,
              saturationScale: 0.6409551457194901,
              brightnessScale: 0.7698317307692307
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
      "3ed/white/retro/w.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.007867184426229475,0.011380367647058751,0.9828877500000001,0.99046975]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png": {
            frame: {
              hueDegrees: 2.2140372724149984,
              saturationScale: 0.7157374226207257,
              brightnessScale: 1.1161684782608696
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.7983487654320984,
              brightnessScale: 0.9515418502202644
            },
            mask: {
              kind: "rect",
              rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
              feather: 0.0013333333333333333
            }
          }
        }
      },
      "3ed/white/retro/a.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.008708774590163905,0.012330294117647026,0.983253,0.991329]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png": {
            frame: {
              hueDegrees: 1.5746966632962085,
              saturationScale: 0.5767416007905141,
              brightnessScale: 1.08641975308642
            },
            paper: {
              hueDegrees: 7.025452488687733,
              saturationScale: 0.6375122549019618,
              brightnessScale: 0.9896907216494846
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
        }
      },
      "3ed/white/retro/u.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.005889502049180328,0.011686838235294103,0.9844705,0.9909607500000001]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png": {
            frame: {
              hueDegrees: 4.66481543145278,
              saturationScale: 0.4908900383397078,
              brightnessScale: 1.0187590187590188
            },
            paper: {
              hueDegrees: -2.4850427350427253,
              saturationScale: 1.1119809394145677,
              brightnessScale: 0.9338842975206612
            },
            mask: {
              kind: "rect",
              rect: [0.118, 0.6071428571428571, 0.762, 0.2819047619047619],
              feather: 0.0013333333333333333
            }
          }
        }
      }
    },
    MANA_PRINTING_TARGETS: {
      "3ed-white-G": [0.7294117647058823, 0.807843137254902, 0.6901960784313725],
      "3ed-white-N": [0.7607843137254902, 0.7450980392156863, 0.7215686274509804]
    }
  }
});
e({
  set: "4ed",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "4ed-white-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: -6.651960784313815,
            saturationScale: 1.0475972265564049,
            brightnessScale: 1.0161725067385445
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.6786248131539612,
            brightnessScale: 0.9823788546255507
          },
          mask: {
            kind: "rect",
            rect: [0.1160164271047228, 0.6068048400622977, 0.7637088901605682, 0.2845333652809393],
            feather: 0.0013333333333333333
          }
        }
      },
      "4ed-white-R": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: 0.9473365617433274,
            saturationScale: 0.7790679728967409,
            brightnessScale: 0.8409669211195929
          },
          paper: {
            hueDegrees: -1.5370879120878271,
            saturationScale: 0.7975936392842132,
            brightnessScale: 0.8755980861244019
          },
          mask: {
            kind: "rect",
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333
          }
        }
      },
      "4ed-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: 4.748297537978033,
            saturationScale: 0.7365248790437341,
            brightnessScale: 0.9202898550724637
          },
          paper: {
            hueDegrees: -1.2028743315507882,
            saturationScale: 0.7347446151409566,
            brightnessScale: 0.9060773480662984
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
            frameRgb: [0.24313725490196078, 0.40588235294117647, 0.29411764705882354],
            paperRgb: [0.7098039215686275, 0.5450980392156862, 0.40784313725490196]
          }
        }
      },
      "4ed-white-A": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",
        rect: [0.012, 0.01, 0.974, 0.982],
        adjustment: {
          frame: {
            hueDegrees: -4.166705840874329,
            saturationScale: 0.8970156657190242,
            brightnessScale: 1.045643153526971
          },
          paper: {
            hueDegrees: 3.573863636363626,
            saturationScale: 0.7584100356294544,
            brightnessScale: 0.9611872146118722
          },
          mask: {
            kind: "rect",
            rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "4ed-white-N": [0.801921568627451, 0.7741905244286774, 0.7464594802299036],
      "4ed-white-W": [0.9372549019607843, 0.9235294117647059, 0.8156862745098039],
      "4ed-white-U": [0.7607843137254902, 0.8627450980392157, 0.8941176470588236],
      "4ed-white-B": [0.681642156862745, 0.6581474364807804, 0.6346527160988157],
      "4ed-white-R": [0.8901960784313725, 0.7588235294117647, 0.7098039215686275],
      "4ed-white-G": [0.7725490196078432, 0.8313725490196077, 0.7235294117647058]
    },
    setCalibrationProfiles: {
      "4ed": {
        schema: 1,
        revision: 1,
        set: "4ed",
        border: "white",
        frames: {
          U: {
            family: "fourth",
            assetKey: "u",
            frame: [0.007924885245901644, 0.006508529411764717, 0.985201, 0.987892],
            art: [
              0.11038578924590163,
              0.09306668560224092,
              0.7809359926666666,
              0.44972607238095236
            ],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          W: {
            family: "fourth",
            assetKey: "w",
            frame: [0.008925180327868902, 0.006202058823529418, 0.984227, 0.9874010000000001],
            art: [
              0.10866018299453556,
              0.09224700310924372,
              0.7821323893333333,
              0.45044293238095245
            ],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          B: {
            family: "fourth",
            assetKey: "b",
            frame: [0.007680885245901622, 0.007734117647058839, 0.985688, 0.9883829999999999],
            art: [
              0.11150668791256829,
              0.09198200193277312,
              0.7800077706666667,
              0.44947893571428565
            ],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          R: {
            family: "fourth",
            assetKey: "r",
            frame: [0.008913032786885261, 0.005099705882352976, 0.98374, 0.990347],
            art: [0.11056616612021859, 0.09281615445378154, 0.78108956, 0.44990049428571427],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          A: {
            family: "fourth",
            assetKey: "a",
            frame: [0.008376442622950769, 0.005957058823529423, 0.9827660000000001, 0.987892],
            art: [
              0.11189446128961746,
              0.09439691406162466,
              0.7783506720000002,
              0.44737394857142854
            ],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          G: {
            family: "fourth",
            assetKey: "g",
            frame: [0.009925475409836047, 0.008101176470588223, 0.983253, 0.985437],
            art: [0.11218378740983605, 0.09397497218487394, 0.778080874, 0.44860846285714284],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          "L-R": {
            family: "abu",
            assetKey: "rl",
            frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
            art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          "L-G": {
            family: "abu",
            assetKey: "gl",
            frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
            art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          L: {
            family: "abu",
            assetKey: "l",
            frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
            art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          "L-U": {
            family: "abu",
            assetKey: "ul",
            frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
            art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          "L-W": {
            family: "abu",
            assetKey: "wl",
            frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
            art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          },
          "L-B": {
            family: "abu",
            assetKey: "bl",
            frame: [-0.012768442622950831, -0.015110294117647041, 1.024, 1.0225],
            art: [0.10669822404371583, 0.09152184873949581, 0.782336, 0.4508738095238095],
            stockWindow: [
              0.04043615426050531,
              0.0316555566058144,
              0.9153375248444735,
              0.9362152576670981
            ]
          }
        },
        colors: {
          U: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.007924885245901644,0.006508529411764717,0.985201,0.987892]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: -0.26413068749876323,
                saturationScale: 0.7556069004159305,
                brightnessScale: 0.9637940356946514,
                valueGamma: 1.1520627609902379
              },
              paper: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 0.6500000022497416,
                rgbScale: [1.0196924599216335, 0.9804914979909146, 0.9654265986710783]
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
          W: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.008925180327868902,0.006202058823529418,0.984227,0.9874010000000001]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: -1.549919023241797,
                saturationScale: 0.8638761098971318,
                brightnessScale: 1.004749005247231,
                valueGamma: 1.0143691647512694
              },
              paper: {
                hueDegrees: 0,
                saturationScale: 0.5496897832600423,
                brightnessScale: 0.9837897863456533,
                valueGamma: 0.8235208085777984
              },
              mask: {
                kind: "rect",
                rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
                feather: 0.0013333333333333333
              }
            }
          },
          B: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/b.png",[0.007680885245901622,0.007734117647058839,0.985688,0.9883829999999999]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: -5.229308001385132,
                saturationScale: 0.7641656028655605,
                brightnessScale: 0.9509843739097822,
                valueGamma: 0.9813040358304043
              },
              paper: {
                hueDegrees: -1.6614819506494392,
                saturationScale: 0.7568971443875485,
                brightnessScale: 0.9576337868904264,
                valueGamma: 0.9978138320445653
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
                frameRgb: [0.2068627450980392, 0.24411764705882355, 0.20980392156862746],
                paperRgb: [0.984313725490196, 0.7686274509803922, 0.6196078431372549]
              }
            }
          },
          R: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.008913032786885261,0.005099705882352976,0.98374,0.990347]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: -1.0801645730403173,
                saturationScale: 0.798755339604909,
                brightnessScale: 0.8762029872626991,
                valueGamma: 1.1092496414429285
              },
              paper: {
                hueDegrees: -2.81611855729118,
                saturationScale: 0.7389631978314873,
                brightnessScale: 0.9230037970559838,
                valueGamma: 0.9470970400550884
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
          A: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.008376442622950769,0.005957058823529423,0.9827660000000001,0.987892]]',
            stock: "#ededef",
            adjustment: {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, valueGamma: 1 },
              paper: {
                hueDegrees: -5.317285781971651,
                saturationScale: 0.8604202774412151,
                brightnessScale: 0.9877349071968816,
                valueGamma: 0.9338922139939904
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
          G: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.009925475409836047,0.008101176470588223,0.983253,0.985437]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: 1.714285716297824,
                saturationScale: 0.9460520787621132,
                brightnessScale: 0.9691116786611378,
                valueGamma: 0.9724214955136443
              },
              paper: {
                hueDegrees: 0.3857547484429573,
                saturationScale: 0.6692229511580209,
                brightnessScale: 0.9506547788122306,
                valueGamma: 1.0407422621825377
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
                frameRgb: [0.24019607843137253, 0.3931372549019608, 0.2833333333333333],
                paperRgb: [0.7725490196078432, 0.596078431372549, 0.4627450980392157]
              }
            }
          },
          "L-R": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/rl.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1,
                rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413]
              },
              paper: {
                hueDegrees: 10.227652363449055,
                saturationScale: 0.6908090806570016,
                brightnessScale: 1.0160203146670328,
                valueGamma: 0.65
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
                    hueCenter: 350.5,
                    hueRadius: 25,
                    hueFeather: 8,
                    saturation: [0.23076923076923075, 0.4945054945054945]
                  },
                  adjustment: {
                    hueDegrees: 23.667328865692543,
                    saturationScale: 0.9555433390763539,
                    brightnessScale: 1.190160028359769,
                    valueGamma: 1
                  }
                }
              ]
            }
          },
          "L-G": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/gl.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1,
                rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413]
              },
              paper: {
                hueDegrees: -8.326935535074275,
                saturationScale: 0.9797137927238514,
                brightnessScale: 1.1760692938239763,
                valueGamma: 0.8771034104369807
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
                    hueCenter: 82.5,
                    hueRadius: 25,
                    hueFeather: 8,
                    saturation: [0.1361111111111111, 0.2916666666666667]
                  },
                  adjustment: {
                    hueDegrees: 2.9544126441461773,
                    saturationScale: 1.066200495201083,
                    brightnessScale: 1.1722010662771623,
                    valueGamma: 1
                  }
                }
              ]
            }
          },
          "L-gold": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: 10.264819834697091,
                saturationScale: 0.7005017768311229,
                brightnessScale: 1.1725516114303038,
                valueGamma: 1.2693064708629052
              },
              paper: {
                hueDegrees: 0.48383129271734815,
                saturationScale: 1.3399248948316544,
                brightnessScale: 1.130107268987477,
                valueGamma: 1.14087160788815
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
                    hueDegrees: 10.852203217581433,
                    saturationScale: 0.9878722501899578,
                    brightnessScale: 1.3215860683139535,
                    valueGamma: 1
                  }
                }
              ]
            }
          },
          "L-U": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/ul.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1,
                rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413]
              },
              paper: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1.2132129128429447,
                rgbScale: [1.2838927763988746, 1.3897318898652564, 1.393943162430608]
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
                    hueCenter: 205.16129032258067,
                    hueRadius: 25,
                    hueFeather: 8,
                    saturation: [0.16074074074074074, 0.3444444444444445]
                  },
                  adjustment: {
                    hueDegrees: -5.092413632630971,
                    saturationScale: 1.0499758692498893,
                    brightnessScale: 1.1763323121551317,
                    valueGamma: 1
                  }
                }
              ]
            }
          },
          "L-W": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/wl.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1,
                rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413]
              },
              paper: {
                hueDegrees: -5.594932317552875,
                saturationScale: 0.9778477115679628,
                brightnessScale: 1.1187683922263938,
                valueGamma: 0.9113473045244606
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
              regions: [
                {
                  mask: {
                    kind: "rect",
                    rect: [0.12704918032786885, 0.5985294117647059, 0.75, 0.010294117647058823],
                    feather: 0.0013333333333333333
                  },
                  adjustment: {
                    hueDegrees: 6.970439382415177,
                    saturationScale: 0.34192665633263003,
                    brightnessScale: 1.1123900753621663,
                    valueGamma: 1
                  }
                },
                {
                  mask: {
                    kind: "rect",
                    rect: [0.12704918032786885, 0.8794117647058823, 0.75, 0.010294117647058823],
                    feather: 0.0013333333333333333
                  },
                  adjustment: {
                    hueDegrees: 6.970439382415177,
                    saturationScale: 0.34192665633263003,
                    brightnessScale: 1.1123900753621663,
                    valueGamma: 1
                  }
                },
                {
                  mask: {
                    kind: "rect",
                    rect: [
                      0.12704918032786885,
                      0.6088235294117647,
                      0.012295081967213115,
                      0.27058823529411763
                    ],
                    feather: 0.0013333333333333333
                  },
                  adjustment: {
                    hueDegrees: 6.970439382415177,
                    saturationScale: 0.34192665633263003,
                    brightnessScale: 1.1123900753621663,
                    valueGamma: 1
                  }
                },
                {
                  mask: {
                    kind: "rect",
                    rect: [
                      0.8627049180327869,
                      0.6088235294117647,
                      0.014344262295081968,
                      0.27058823529411763
                    ],
                    feather: 0.0013333333333333333
                  },
                  adjustment: {
                    hueDegrees: 6.970439382415177,
                    saturationScale: 0.34192665633263003,
                    brightnessScale: 1.1123900753621663,
                    valueGamma: 1
                  }
                }
              ]
            }
          },
          "L-B": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/bl.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
            stock: "#ededef",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1,
                rgbScale: [1.1362618233254567, 1.2248261423373552, 1.1620043392226413]
              },
              paper: {
                hueDegrees: -28.28882275337428,
                saturationScale: 0.8533097559116432,
                brightnessScale: 1.3607361901124793,
                valueGamma: 0.8936219860908867
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
              regions: [
                {
                  mask: {
                    kind: "rect",
                    rect: [0.12704918032786885, 0.5985294117647059, 0.75, 0.010294117647058823],
                    feather: 0.0013333333333333333
                  },
                  adjustment: {
                    hueDegrees: -137.65813996023417,
                    saturationScale: 0.7772989763239141,
                    brightnessScale: 1.1749491963195922,
                    valueGamma: 1
                  }
                },
                {
                  mask: {
                    kind: "rect",
                    rect: [0.12704918032786885, 0.8794117647058823, 0.75, 0.010294117647058823],
                    feather: 0.0013333333333333333
                  },
                  adjustment: {
                    hueDegrees: -137.65813996023417,
                    saturationScale: 0.7772989763239141,
                    brightnessScale: 1.1749491963195922,
                    valueGamma: 1
                  }
                },
                {
                  mask: {
                    kind: "rect",
                    rect: [
                      0.12704918032786885,
                      0.6088235294117647,
                      0.012295081967213115,
                      0.27058823529411763
                    ],
                    feather: 0.0013333333333333333
                  },
                  adjustment: {
                    hueDegrees: -137.65813996023417,
                    saturationScale: 0.7772989763239141,
                    brightnessScale: 1.1749491963195922,
                    valueGamma: 1
                  }
                },
                {
                  mask: {
                    kind: "rect",
                    rect: [
                      0.8627049180327869,
                      0.6088235294117647,
                      0.014344262295081968,
                      0.27058823529411763
                    ],
                    feather: 0.0013333333333333333
                  },
                  adjustment: {
                    hueDegrees: -137.65813996023417,
                    saturationScale: 0.7772989763239141,
                    brightnessScale: 1.1749491963195922,
                    valueGamma: 1
                  }
                }
              ]
            }
          },
          "L-red": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.012768442622950831,-0.015110294117647041,1.024,1.0225]]',
            stock: "#ededef",
            adjustment: {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1, valueGamma: 1 },
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
                    hueDegrees: -6.96329045002916,
                    saturationScale: 1.1032592570609554,
                    brightnessScale: 0.845035010901164,
                    valueGamma: 1
                  }
                }
              ]
            }
          }
        },
        mana: {
          geometry: {
            dx: 0.5,
            dy: -1,
            scaleX: 0.99,
            scaleY: 0.995,
            spacing: 0.25,
            glyphs: {
              U: { scale: 1.04, dx: 0, dy: -0.5 },
              W: { scale: 1, dx: 0.5, dy: 0 },
              B: { scale: 1.05, dx: 0, dy: 0 },
              R: { scale: 1.1, dx: -0.25, dy: 0.5 },
              G: { scale: 1.13, dx: 0, dy: -0.25 }
            },
            numberScale: 1,
            numberDx: 0,
            numberDy: -0.5
          },
          paper: {
            W: [0.9176470588235294, 0.8941176470588236, 0.796078431372549],
            U: [0.7450980392156863, 0.8431372549019608, 0.8705882352941177],
            B: [0.6627450980392157, 0.6313725490196078, 0.611764705882353],
            R: [0.8745098039215686, 0.7607843137254902, 0.6980392156862745],
            G: [0.7647058823529411, 0.8313725490196079, 0.7254901960784313],
            N: [0.7803921568627451, 0.7568627450980392, 0.7372549019607844]
          },
          ink: [0.2235294117647059, 0.25098039215686274, 0.21176470588235294]
        },
        title: { size: 27.25, x: 41.5, y: 41, width: 1.015, shadow: 1, trim: 0.3, gray: 232 },
        type: { x: 42.75, y: 390.5, size: 23, width: 0.98, shadow: 0.75, trim: 0.2, gray: 239 },
        footer: {
          artist: { x: 43, y: 626.5, size: 19, width: 1, shadow: 1.25, trim: 0.2, gray: 238 },
          legal: {
            x: 41.25,
            y: 640.5,
            size: 11,
            width: 1,
            shadow: 0,
            trim: 0,
            lightGray: 205,
            darkGray: 42
          },
          stats: { x: 451.75, y: 634.5, size: 27, width: 1.03, shadow: 1, trim: 0.3, gray: 238 }
        }
      }
    }
  }
});
e({
  set: "5ed",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "5ed-white-N": [0.7058039215686275, 0.6768467433508057, 0.6478895651329839],
      "5ed-white-U": [0.6470588235294118, 0.8235294117647061, 0.8784313725490196],
      "5ed-white-B": [0.7122794117647059, 0.6923545533905743, 0.6724296950164426],
      "5ed-white-R": [0.8274509803921568, 0.5588235294117643, 0.45098039215686275],
      "5ed-white-G": [0.7450980392156863, 0.8235294117647058, 0.7686274509803923]
    },
    RETRO_MANA_PROFILES: { "5ed/white": [437, 42, 26.5, 23.4] }
  }
});
e({
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
});
e({
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
});
e({
  set: "8ed",
  kind: "calibration",
  tables: {
    PRINTING_COLOR_PROFILES: {
      "8ed/white/eighth/w.png": {
        source: '["https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png",{"background":[0,0,1,1],"legendaryBackground":[0.03937,0.03993,0.92126,0.88976],"frame":[0,0,1,1],"crown":[0.01575,0.01687,0.9622,0.15748],"title":[0.09,0.0629,0.824,0.0429],"art":[0.08955223880597014,0.12117981520966596,0.8238805970149253,0.43212508884150674],"type":[0.10199004975124377,0.5724946695095949,0.7965174129353234,0.0358],"rules":[0.10199004975124377,0.6321961620469083,0.7940298507462686,0.25906183368869934],"stats":[0.7268656716417911,0.8816631130063965,0.20597014925373133,0.07746979388770434],"footer":[0.07462686567164178,0.9228571428571428,0.81,0.04],"stamp":[0.34,0.6451764705882354,0.32,0.2296470588235294]}]',
        materials: {
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.8462234042553245,
              brightnessScale: 0.9432056451612905
            },
            mask: {
              kind: "rect",
              rect: [0.082, 0.627, 0.838, 0.29],
              feather: 9950248756218905e-19
            }
          },
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pt/w.png": {
            hueDegrees: 0,
            saturationScale: 0.8462234042553245,
            brightnessScale: 0.9432056451612905
          }
        }
      },
      "8ed/white/eighth/g.png": {
        source: '["https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",{"background":[0,0,1,1],"legendaryBackground":[0.03937,0.03993,0.92126,0.88976],"frame":[0,0,1,1],"crown":[0.01575,0.01687,0.9622,0.15748],"title":[0.09,0.0629,0.824,0.0429],"art":[0.08955223880597014,0.12117981520966596,0.8238805970149253,0.43212508884150674],"type":[0.10199004975124377,0.5724946695095949,0.7965174129353234,0.0358],"rules":[0.10199004975124377,0.6321961620469083,0.7940298507462686,0.25906183368869934],"stats":[0.7268656716417911,0.8816631130063965,0.20597014925373133,0.07746979388770434],"footer":[0.07462686567164178,0.9228571428571428,0.81,0.04],"stamp":[0.34,0.6451764705882354,0.32,0.2296470588235294]}]',
        materials: {
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6045238095238094,
              brightnessScale: 0.9720380434782608
            },
            mask: {
              kind: "rect",
              rect: [0.082, 0.627, 0.838, 0.29],
              feather: 9950248756218905e-19
            }
          },
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pt/g.png": {
            hueDegrees: 0,
            saturationScale: 0.6045238095238094,
            brightnessScale: 0.9720380434782608
          }
        }
      },
      "8ed/white/eighth/u.png": {
        source: '["https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png",{"background":[0,0,1,1],"legendaryBackground":[0.03937,0.03993,0.92126,0.88976],"frame":[0,0,1,1],"crown":[0.01575,0.01687,0.9622,0.15748],"title":[0.09,0.0629,0.824,0.0429],"art":[0.08955223880597014,0.12117981520966596,0.8238805970149253,0.43212508884150674],"type":[0.10199004975124377,0.5724946695095949,0.7965174129353234,0.0358],"rules":[0.10199004975124377,0.6321961620469083,0.7940298507462686,0.25906183368869934],"stats":[0.7268656716417911,0.8816631130063965,0.20597014925373133,0.07746979388770434],"footer":[0.07462686567164178,0.9228571428571428,0.81,0.04],"stamp":[0.34,0.6451764705882354,0.32,0.2296470588235294]}]',
        materials: {
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 1.275610047846888,
              brightnessScale: 0.944808091286307
            },
            mask: {
              kind: "rect",
              rect: [0.082, 0.627, 0.838, 0.29],
              feather: 9950248756218905e-19
            }
          },
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pt/u.png": {
            hueDegrees: 0,
            saturationScale: 1.275610047846888,
            brightnessScale: 0.944808091286307
          }
        }
      }
    },
    MANA_PRINTING_TARGETS: {
      "8ed-white-U": [0.6901960784313725, 0.8235294117647058, 0.8901960784313725],
      "8ed-white-N": [0.6980392156862745, 0.6941176470588235, 0.6588235294117647]
    },
    PRINTING_MANA_PROFILES: {
      "8ed": {
        dy: -2,
        scaleX: 1.02,
        scaleY: 1.02,
        numberScale: 0.97,
        numberDx: -0.5,
        numberDy: -1.25,
        glyphs: {
          W: { scale: 0.98, dx: -0.5, dy: -2 },
          U: { scale: 0.94, dx: -0.5, dy: -1.5 },
          B: { scale: 0.97, dx: -0.25, dy: -2 },
          R: { scale: 0.95, dx: 0, dy: -1.5 },
          G: { scale: 1.04, dx: -0.25, dy: -3 }
        }
      }
    }
  }
});
e({
  set: "a25",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "a25/m15-accurate/black": [-2, 1, 1.04, 1.08] } }
});
e({
  set: "aer",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "aer/component/black": [-0.5, -1, 0.94, 0.92],
      "aer/m15-accurate/black": [-0.5, 0.5, 1.02, 1.04]
    }
  }
});
e({
  set: "afc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "afc/component/black": [-1, -2, 1.16, 1.08],
      "afc/m15-accurate/black": [-1.5, 0, 1.22, 1.22]
    }
  }
});
e({
  set: "afr",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "afr/m15-accurate/black": [0, 0, 1.28, 1.22] } }
});
e({
  set: "ala",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ala/eighth/black": [0, 0, 1.12, 1.04] } }
});
e({
  set: "all",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "all-black-N": [0.7901176470588235, 0.7687034108259793, 0.7472891745931349],
      "all-black-W": [0.9058823529411765, 0.8980392156862746, 0.7784313725490196]
    }
  }
});
e({
  set: "apc",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "apc-black-R": [0.8705882352941177, 0.5764705882352935, 0.4588235294117647]
    },
    RETRO_MANA_PROFILES: { "apc/black": [439, 44, 27, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "apc/retro/black": [0, -1, 1.18, 1.18] }
  }
});
e({
  set: "arb",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "arb/eighth/black": [-2, 1, 1, 1.02] } }
});
e({
  set: "arn",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "arn-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -21.501473124461086,
            saturationScale: 0.35187499999999994,
            brightnessScale: 0.9157303370786517
          },
          paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.8834426229508195 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "arn-black-L": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 1.4 },
          paper: {
            hueDegrees: 1.0282170119955936,
            saturationScale: 0.42361231045559733,
            brightnessScale: 1.0091324200913243
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
      "arn-black-U": [0.6803921568627451, 0.8078431372549021, 0.896078431372549]
    },
    PRINTING_MANA_PROFILES: {
      arn: {
        dx: 5.25,
        dy: -7.75,
        scaleX: 1.045,
        scaleY: 1.0098,
        spacing: 0.875,
        glyphs: {
          W: { scale: 1, dx: 0, dy: 0 },
          U: { scale: 1, dx: 0, dy: 0 },
          G: { scale: 1.09, dx: 0, dy: -0.25 },
          B: { scale: 1, dx: 0, dy: 0 },
          R: { scale: 1.05, dx: 0, dy: 0.25 }
        },
        numberScale: 1.01,
        numberDx: 0,
        numberDy: -0.25
      }
    },
    MAJOR_SYMBOL_PROFILES: { "arn/retro/black": [-3, 0, 0.88, 0.88] },
    EARLY_EXPANSION_FRAMES: {
      "arn/W": {
        family: "fourth",
        frame: [0.008741918032786858, 0.005528823529411754, 0.987149, 0.991329],
        art: [0.10877301669945352, 0.09191606495798318, 0.7844544053333333, 0.45223484857142854],
        stockWindow: [
          0.03883726207645951,
          0.03183110554486049,
          0.9217417574769129,
          0.9359733064602023
        ]
      },
      "arn/U": {
        family: "fourth",
        frame: [0.006729180327868926, 0.005528823529411754, 0.9886099999999999, 0.991329],
        art: [0.10954462032786892, 0.09238812638655462, 0.7836381933333332, 0.4512907257142857],
        stockWindow: [
          0.03883726207645951,
          0.03183110554486049,
          0.9217417574769129,
          0.9359733064602023
        ]
      },
      "arn/B": {
        family: "abu",
        frame: [-0.014993852459016379, -0.01515441176470595, 1.0305, 1.0270000000000001],
        art: [0.10866614754098362, 0.09194701680672264, 0.7838669999999999, 0.4528580952380953],
        stockWindow: [
          0.03883726207645951,
          0.03183110554486049,
          0.9217417574769129,
          0.9359733064602023
        ]
      },
      "arn/R": {
        family: "fourth",
        frame: [0.00599718032786886, 0.003936470588235265, 0.9900709999999999, 0.9952570000000001],
        art: [0.10830451699453551, 0.09208780487394955, 0.7861163739999999, 0.45213103714285713],
        stockWindow: [
          0.03883726207645951,
          0.03183110554486049,
          0.9217417574769129,
          0.9359733064602023
        ]
      },
      "arn/G": {
        family: "abu",
        frame: [-0.018567622950819714, -0.015338235294117604, 1.0315, 1.027],
        art: [0.1072753770491803, 0.09176319327731097, 0.7825646666666667, 0.45285809523809517],
        stockWindow: [
          0.03883726207645951,
          0.03183110554486049,
          0.9217417574769129,
          0.9359733064602023
        ]
      },
      "arn/A": {
        family: "fourth",
        frame: [0.00794918032786887, 0.004855000000000054, 0.9861749999999999, 0.9923109999999999],
        art: [0.11182628032786886, 0.093690460952381, 0.7810505999999998, 0.44937512428571424],
        stockWindow: [
          0.03883726207645951,
          0.03183110554486049,
          0.9217417574769129,
          0.9359733064602023
        ]
      },
      "arn/L": {
        family: "fourth",
        frame: [0.007461180327868825, 0.006570588235294111, 0.987149, 0.99182],
        art: [0.11078277566120218, 0.09111143585434173, 0.7837963059999999, 0.45245883809523807],
        stockWindow: [
          0.03883726207645951,
          0.03183110554486049,
          0.9217417574769129,
          0.9359733064602023
        ]
      }
    },
    EARLY_EXPANSION_COLORS: {
      "arn/W": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.008741918032786858,0.005528823529411754,0.987149,0.991329]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -13.640927100986662,
            saturationScale: 0.5400738710331036,
            brightnessScale: 1.0492517860747008,
            valueGamma: 0.8994679069282768
          },
          paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          mask: {
            kind: "rect",
            rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
            feather: 0.0013333333333333333
          }
        }
      },
      "arn/U": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.006729180327868926,0.005528823529411754,0.9886099999999999,0.991329]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: 8.695311924531383,
            saturationScale: 0.7336299706894727,
            brightnessScale: 0.9918856718215499,
            valueGamma: 0.8925193131882323
          },
          paper: {
            hueDegrees: 7.681106138107452,
            saturationScale: 1.4347665118679058,
            brightnessScale: 0.9421487603305786
          },
          mask: {
            kind: "rect",
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333
          }
        }
      },
      "arn/B": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.014993852459016379,-0.01515441176470595,1.0305,1.0270000000000001]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -13.974519149984646,
            saturationScale: 0.48077990027996853,
            brightnessScale: 1.3401551515814558,
            valueGamma: 1.2607231644949974
          },
          paper: {
            hueDegrees: -11.213063909774519,
            saturationScale: 0.5857999353587588,
            brightnessScale: 0.9227557411273487
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
            paperRgb: [0.9392156862745098, 0.8, 0.596078431372549]
          }
        }
      },
      "arn/R": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.00599718032786886,0.003936470588235265,0.9900709999999999,0.9952570000000001]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: -7.992651881053812,
            saturationScale: 0.70622971619805,
            brightnessScale: 0.8936224010262801,
            valueGamma: 1.38110833476772
          },
          paper: {
            hueDegrees: -5.943625631125656,
            saturationScale: 0.5376010534051938,
            brightnessScale: 0.7476190476190477
          },
          mask: {
            kind: "rect",
            rect: [0.11812030834483456, 0.6068048400622977, 0.7616050089204565, 0.2815382772253505],
            feather: 0.0013333333333333333
          }
        }
      },
      "arn/G": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[-0.018567622950819714,-0.015338235294117604,1.0315,1.027]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: 25.416811846689825,
            saturationScale: 0.4621650250156346,
            brightnessScale: 1.1037735849056602
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
            frameRgb: [0.2323529411764706, 0.31176470588235294, 0.2754901960784314],
            paperRgb: [0.41568627450980394, 0.2823529411764706, 0.2549019607843137]
          }
        }
      },
      "arn/A": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.00794918032786887,0.004855000000000054,0.9861749999999999,0.9923109999999999]]',
        stock: "#181510",
        adjustment: {
          frame: {
            hueDegrees: 7.632246618375651,
            saturationScale: 0.35000000000000253,
            brightnessScale: 1.1734718355876625,
            valueGamma: 1.2754055770415957
          },
          paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9869263698630137 },
          mask: {
            kind: "rect",
            rect: [0.12443195206516984, 0.6097999281178866, 0.7552933652001211, 0.2785431891697616],
            feather: 0.0013333333333333333
          }
        }
      },
      "arn/L": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png",[0.007461180327868825,0.006570588235294111,0.987149,0.99182]]',
        stock: "#181510",
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          paper: {
            hueDegrees: -1.0520296612100992,
            saturationScale: 0.6957976149956239,
            brightnessScale: 0.9456066945606694
          },
          mask: {
            kind: "rect",
            rect: [0.1265358333052816, 0.6083023840900922, 0.7510856027198977, 0.2770456451419673],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    EARLY_EXPANSION_MANA_TARGETS: {
      "arn-black-W": [0.8980392156862745, 0.8980392156862745, 0.8745098039215686],
      "arn-black-U": [0.6666666666666666, 0.803921568627451, 0.8784313725490196],
      "arn-black-G": [0.7058823529411765, 0.7843137254901961, 0.7254901960784313],
      "arn-black-N": [0.7254901960784313, 0.7294117647058823, 0.7254901960784313],
      "arn-black-B": [0.6039215686274509, 0.5882352941176471, 0.592156862745098],
      "arn-black-R": [0.8352941176470589, 0.7137254901960784, 0.6941176470588235],
      "arn-dark-black-W": [0.8941176470588236, 0.8941176470588236, 0.8745098039215686],
      "arn-light-black-W": [0.9137254901960784, 0.9098039215686274, 0.8274509803921568],
      "arn-dark-black-B": [0.592156862745098, 0.5803921568627451, 0.5803921568627451],
      "arn-light-black-B": [0.6549019607843137, 0.7098039215686275, 0.7098039215686275]
    },
    printingBlackPoints: {
      arn: [
        {
          set: "arn",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-21.501473124461086,"saturationScale":0.35187499999999994,"brightnessScale":0.9157303370786517},"paper":{"hueDegrees":0,"saturationScale":0.35,"brightnessScale":0.8834426229508195},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        },
        {
          set: "arn",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/l.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":0.35,"brightnessScale":1.4},"paper":{"hueDegrees":1.0282170119955936,"saturationScale":0.42361231045559733,"brightnessScale":1.0091324200913243},"mask":{"kind":"rect","rect":[0.11885245901639344,0.6058823529411764,0.7663934426229508,0.2720588235294118],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      arn: [
        {
          set: "arn",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#181510",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "ath",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "ath-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.7312202380952383, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -11.893466500208092,
            saturationScale: 0.9593076222289706,
            brightnessScale: 0.9487179487179488
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
      "ath-white-N": [0.7181617647058823, 0.6920793333286794, 0.6659969019514763],
      "ath-white-W": [0.8901960784313725, 0.8784313725490196, 0.7490196078431373],
      "ath-white-B": [0.6902352941176471, 0.6832304309842749, 0.6762255678509027],
      "ath-white-R": [0.8509803921568627, 0.5813725490196081, 0.4862745098039216],
      "ath-white-G": [0.5519607843137255, 0.7176470588235294, 0.592156862745098]
    },
    RETRO_MANA_PROFILES: { "ath/white": [439, 43.5, 26, 23.4] },
    printingBlackPoints: {
      ath: [
        {
          set: "ath",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
              adjustment: '{"frame":{"hueDegrees":60,"saturationScale":0.7312202380952383,"brightnessScale":1.4},"paper":{"hueDegrees":-11.893466500208092,"saturationScale":0.9593076222289706,"brightnessScale":0.9487179487179488},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.08627450980392157,0.06274509803921569,0.06274509803921569],"paperRgb":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}',
              lift: [14, 17, 7.5]
            }
          ]
        }
      ]
    }
  }
});
e({
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
    }
  }
});
e({
  set: "avr",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "avr/eighth/black": [-2, 0.5, 0.96, 1.06] } }
});
e({
  set: "bbd",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "bbd/component/black": [2, 0, 0.92, 0.88],
      "bbd/m15-accurate/black": [2, 1, 1.02, 1.04]
    }
  }
});
e({
  set: "blb",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "blb/component/black": [-2, -1.5, 0.98, 1],
      "blb/m15-accurate/black": [-1.5, -1, 1.14, 1.2]
    },
    MAJOR_FRAME_INSETS: { "blb/black": 1 }
  }
});
e({
  set: "blc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "blc/component/black": [2, -1, 1, 1],
      "blc/m15-accurate/black": [1.5, 1, 1.1, 1.14]
    },
    MAJOR_FRAME_INSETS: { "blc/black": 1 }
  }
});
e({
  set: "bng",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "bng/eighth/black": [4, 1.5, 1, 0.9] } }
});
e({
  set: "bok",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "bok/eighth/black": [0.5, 0.5, 1.02, 1.08] } }
});
e({
  set: "brb",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "brb-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.7403869047619052, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -9.399216201522222,
            saturationScale: 1.1101902451481103,
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
      },
      "brb-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 28.994895644283133,
            saturationScale: 0.5908991706678307,
            brightnessScale: 0.9239766081871345
          },
          paper: {
            hueDegrees: -4.285714285714221,
            saturationScale: 0.8685969387755101,
            brightnessScale: 0.7999999999999999
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
      "brb-white-N": [0.7013872549019609, 0.6710053812366532, 0.6406235075713455],
      "brb-white-B": [0.6907107843137253, 0.6607913815278587, 0.6308719787419917],
      "brb-white-W": [0.8980392156862745, 0.8823529411764705, 0.7333333333333334],
      "brb-white-R": [0.8509803921568627, 0.5764705882352936, 0.44901960784313727],
      "brb-white-G": [0.5882352941176471, 0.7215686274509804, 0.5745098039215686]
    },
    RETRO_MANA_PROFILES: { "brb/white": [438.5, 43.5, 26.5, 23.4] },
    printingBlackPoints: {
      brb: [
        {
          set: "brb",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
              adjustment: '{"frame":{"hueDegrees":60,"saturationScale":0.7403869047619052,"brightnessScale":1.4},"paper":{"hueDegrees":-9.399216201522222,"saturationScale":1.1101902451481103,"brightnessScale":0.9401709401709403},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.08627450980392157,0.06274509803921569,0.06274509803921569],"paperRgb":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}',
              lift: [18, 23, 11.5]
            }
          ]
        }
      ]
    }
  }
});
e({
  set: "brc",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "brc-black-R": [0.9254901960784314, 0.66078431372549, 0.6313725490196078]
    },
    RETRO_MANA_PROFILES: { "brc/black": [437.5, 46, 26.5, 23.4] }
  }
});
e({
  set: "bro",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "bro/component/black": [-1, -2.5, 0.96, 0.96],
      "bro/m15-accurate/black": [-1, -1.5, 1.08, 1.1]
    }
  }
});
e({
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
});
e({
  set: "c13",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "c13/eighth/black": [2, 0, 1.1, 1.02] } }
});
e({
  set: "c14",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "c14/m15-accurate/black": [-1.5, 0, 0.96, 0.94] } }
});
e({
  set: "c15",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "c15/component/black": [-4.5, -0.5, 0.82, 0.8],
      "c15/m15-accurate/black": [-4.5, 0, 0.94, 0.9]
    }
  }
});
e({
  set: "c19",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "c19/component/black": [-1, 0, 0.92, 0.88] } }
});
e({
  set: "c21",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "c21/component/black": [-1, -0.5, 0.96, 0.96],
      "c21/m15-accurate/black": [-0.5, 0, 1.08, 1.08]
    }
  }
});
e({
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
});
e({
  set: "clb",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "clb/component/black": [0, -2, 0.92, 0.92],
      "clb/m15-accurate/black": [0.5, -1.5, 1.08, 1.06]
    }
  }
});
e({
  set: "cm2",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "cm2/m15-accurate/black": [-0.5, 1, 1.08, 1.06] } }
});
e({
  set: "cmd",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "cmd/eighth/black": [3, 1, 1.08, 0.98] } }
});
e({
  set: "cmm",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "cmm/component/black": [-1, -1, 0.96, 0.94],
      "cmm/m15-accurate/black": [-1, 0, 1.08, 1.12]
    }
  }
});
e({
  set: "cn2",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "cn2/component/black": [-2, -1, 0.92, 0.84],
      "cn2/m15-accurate/black": [-2, 1, 1, 1]
    }
  }
});
e({
  set: "cns",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "cns/eighth/black": [2, 0, 1.08, 0.96] } }
});
e({
  set: "con",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "con/eighth/black": [1.5, 0, 1.22, 1] } }
});
e({
  set: "csp",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "csp/eighth/black": [0.5, 1, 1, 1.06] } }
});
e({
  set: "dd2",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "dd2/eighth/black": [2.5, 1, 1.04, 1.04] } }
});
e({
  set: "ddc",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddc/eighth/black": [5, 1, 1.04, 1] } }
});
e({
  set: "dde",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "dde/eighth/black": [3.5, 0.5, 1.1, 1.06] } }
});
e({
  set: "ddf",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddf/eighth/black": [1, 1, 1.06, 1.08] } }
});
e({
  set: "ddg",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddg/eighth/black": [3.5, 0.5, 1.06, 1.1] } }
});
e({
  set: "ddh",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddh/eighth/black": [3, 0.5, 0.92, 0.9] } }
});
e({
  set: "ddi",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddi/eighth/black": [3, 0.5, 1.04, 1.02] } }
});
e({
  set: "ddj",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddj/eighth/black": [2.5, 0, 1.1, 1.08] } }
});
e({
  set: "ddl",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddl/eighth/black": [1.5, 1, 0.96, 0.92] } }
});
e({
  set: "ddn",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddn/m15-accurate/black": [-2, 0, 0.9, 0.92] } }
});
e({
  set: "ddo",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddo/component/black": [0, -1, 0.88, 0.84] } }
});
e({
  set: "ddq",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "ddq/component/black": [0, -1.5, 0.98, 0.9],
      "ddq/m15-accurate/black": [0, 0, 1.1, 1.02]
    }
  }
});
e({
  set: "dds",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "dds/component/black": [-3, -1, 0.92, 0.92],
      "dds/m15-accurate/black": [-2.5, 0.5, 1.06, 1.02]
    }
  }
});
e({
  set: "ddt",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddt/component/black": [0, -1, 0.9, 0.88] } }
});
e({
  set: "ddu",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ddu/m15-accurate/black": [-1, 1, 1.1, 1.1] } }
});
e({
  set: "dft",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "dft/component/black": [1, -1, 0.88, 0.84],
      "dft/m15-accurate/black": [0, 0.5, 0.98, 0.98]
    },
    MAJOR_FRAME_INSETS: { "dft/black": 1 }
  }
});
e({
  set: "dgm",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "dgm/eighth/black": [0, 0, 1.04, 1.04] } }
});
e({
  set: "dka",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "dka/eighth/black": [2.5, 0, 0.96, 0.92] } }
});
e({
  set: "dmc",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "dmc/component/black": [2, -1.5, 0.98, 0.98] } }
});
e({
  set: "dmr",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "dmr-black-U": [0.7705882352941177, 0.8784313725490195, 0.9882352941176471],
      "dmr-black-R": [0.9107843137254901, 0.6421568627450981, 0.5931372549019607]
    },
    RETRO_MANA_PROFILES: { "dmr/black": [436.5, 46.5, 26, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "dmr/m15-accurate/black": [4.5, 0.5, 1.18, 1.06] }
  }
});
e({
  set: "dmu",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "dmu/component/black": [2.5, -2, 1, 0.96],
      "dmu/m15-accurate/black": [1, -1, 1.06, 1.12]
    }
  }
});
e({
  set: "dpa",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "dpa/eighth/black": [1, 1, 1.08, 1.12] } }
});
e({
  set: "drc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "drc/component/black": [0, -1, 0.98, 0.92],
      "drc/m15-accurate/black": [0, 0, 1.1, 1.04]
    },
    MAJOR_FRAME_INSETS: { "drc/black": 1 }
  }
});
e({
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
});
e({
  set: "dsc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "dsc/component/black": [3, -1, 0.94, 0.94],
      "dsc/m15-accurate/black": [2.5, 0.5, 1.04, 1.06]
    }
  }
});
e({
  set: "dsk",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "dsk/component/black": [3, 0, 0.92, 0.92],
      "dsk/m15-accurate/black": [2, 1.5, 0.88, 0.88]
    },
    MAJOR_FRAME_INSETS: { "dsk/black": 1 }
  }
});
e({
  set: "dst",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "dst/eighth/black": [-3, 1, 0.96, 0.94] } }
});
e({
  set: "e01",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "e01/component/black": [-2, -0.5, 0.84, 0.86],
      "e01/m15-accurate/black": [-2, 1, 0.96, 1.04]
    }
  }
});
e({
  set: "ecc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "ecc/component/black": [-3, -1.5, 0.92, 0.92],
      "ecc/m15-accurate/black": [-3, 0, 1.04, 1.12]
    },
    MAJOR_FRAME_INSETS: { "ecc/black": 1 }
  }
});
e({
  set: "ecl",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "ecl/component/black": [-1, -1.5, 0.96, 0.94],
      "ecl/m15-accurate/black": [-1, 0, 1.08, 1.04]
    }
  }
});
e({
  set: "eld",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "eld/m15-accurate/black": [-1, 1, 1.1, 0.96] } }
});
e({
  set: "ema",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "ema/component/black": [-3, -1, 0.86, 0.88],
      "ema/m15-accurate/black": [-3, 0.5, 0.96, 0.98]
    }
  }
});
e({
  set: "emn",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "emn/m15-accurate/black": [2, 0, 1.04, 1.08] } }
});
e({
  set: "eoc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "eoc/component/black": [1, -1, 0.94, 0.96],
      "eoc/m15-accurate/black": [1, 0.5, 1.06, 1.06]
    }
  }
});
e({
  set: "eoe",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: { "eoe/component/black": [1.5, -1, 0.96, 0.96] },
    MAJOR_FRAME_INSETS: { "eoe/black": 1 }
  }
});
e({
  set: "eve",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "eve/eighth/black": [4.5, 1, 1.08, 1.02] } }
});
e({
  set: "exo",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "exo-black-W": [0.8980392156862745, 0.8882352941176469, 0.7490196078431373],
      "exo-black-N": [0.7292549019607844, 0.7020432246165794, 0.6748315472723744]
    },
    RETRO_MANA_PROFILES: { "exo/black": [438.5, 44.5, 26.5, 23.4] }
  }
});
e({
  set: "fdc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "fdc/component/black": [1.5, -1, 0.98, 0.96],
      "fdc/m15-accurate/black": [1, -0.5, 1.06, 1.1]
    }
  }
});
e({
  set: "fdn",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "fdn/component/black": [1.5, -1.5, 1.02, 1],
      "fdn/m15-accurate/black": [1.5, -0.5, 1.14, 1.16]
    },
    MAJOR_FRAME_INSETS: { "fdn/black": 1.5 }
  }
});
e({
  set: "fem",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "fem-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 10.238420910075774,
            saturationScale: 0.8891222334004024,
            brightnessScale: 0.8179775280898877
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 1.4099365482233503,
            brightnessScale: 0.8023770491803277
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
      "fem-black-N": [0.7775392156862744, 0.7489971713561662, 0.7204551270260577],
      "fem-black-W": [0.8156862745098039, 0.8294117647058823, 0.7313725490196078]
    },
    setCalibrationProfiles: {
      fem: {
        schema: 1,
        revision: 1,
        set: "fem",
        border: "black",
        frames: {
          G: {
            family: "fourth",
            assetKey: "g",
            frame: [0.006216885245901601, 0.007918235294117677, 0.9886100000000001, 0.989856],
            art: [0.1090323252459016, 0.09417711529411768, 0.7823200466666668, 0.45062015999999994],
            stockWindow: [
              0.041624391651981354,
              0.02961505951444264,
              0.9190370103355153,
              0.9356917956062801
            ]
          },
          B: {
            family: "abu",
            assetKey: "b",
            frame: [-0.016518442622950862, -0.014551470588235306, 1.0315, 1.028],
            art: [0.10726155737704914, 0.09265424369747899, 0.7846276666666667, 0.4532990476190476],
            stockWindow: [
              0.041624391651981354,
              0.02961505951444264,
              0.9190370103355153,
              0.9356917956062801
            ]
          },
          W: {
            family: "fourth",
            assetKey: "w",
            frame: [0.006704885245901645, 0.006692941176470516, 0.987636, 0.9908380000000001],
            art: [0.10678533324590163, 0.09303739546218481, 0.7848414079999999, 0.4520108590476191],
            stockWindow: [
              0.041624391651981354,
              0.02961505951444264,
              0.9190370103355153,
              0.9356917956062801
            ]
          },
          L: {
            family: "abu",
            assetKey: "l",
            frame: [-0.016950819672131166, -0.015191176470588218, 1.038, 1.0245],
            art: [
              0.10414918032786884,
              0.09164953781512607,
              0.7930320000000001,
              0.45175571428571426
            ],
            stockWindow: [
              0.041624391651981354,
              0.02961505951444264,
              0.9190370103355153,
              0.9356917956062801
            ]
          },
          A: {
            family: "fourth",
            assetKey: "a",
            frame: [0.005924295081967185, 0.006325294117646987, 0.987149, 0.9908380000000001],
            art: [
              0.10990398974863386,
              0.09502888649859938,
              0.7818220080000001,
              0.44870806571428573
            ],
            stockWindow: [
              0.041624391651981354,
              0.02961505951444264,
              0.9190370103355153,
              0.9356917956062801
            ]
          },
          U: {
            family: "fourth",
            assetKey: "u",
            frame: [0.004960442622950849, 0.006754411764705876, 0.989584, 0.99182],
            art: [0.10787717862295085, 0.09365673557422968, 0.7844102506666667, 0.4515142476190476],
            stockWindow: [
              0.041624391651981354,
              0.02961505951444264,
              0.9190370103355153,
              0.9356917956062801
            ]
          },
          R: {
            family: "fourth",
            assetKey: "r",
            frame: [
              0.0059607377049179944,
              0.004549117647058901,
              0.9886100000000001,
              0.9947659999999999
            ],
            art: [0.10811710437158467, 0.0926569633613446, 0.7849563400000001, 0.45190798285714284],
            stockWindow: [
              0.041624391651981354,
              0.02961505951444264,
              0.9190370103355153,
              0.9356917956062801
            ]
          }
        },
        colors: {
          G: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.006216885245901601,0.007918235294117677,0.9886100000000001,0.989856]]',
            stock: "#262626",
            adjustment: {
              frame: {
                hueDegrees: 1.251207876464645,
                saturationScale: 0.7697110830363157,
                brightnessScale: 0.9590171329316695,
                valueGamma: 1.2325331633252918
              },
              paper: {
                hueDegrees: -3.589570914586081,
                saturationScale: 0.8522584357558871,
                brightnessScale: 0.8654806395040973,
                valueGamma: 1.4865299443201976
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
                frameRgb: [0.24705882352941178, 0.403921568627451, 0.28431372549019607],
                paperRgb: [0.7705882352941177, 0.592156862745098, 0.4627450980392157]
              }
            }
          },
          B: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.016518442622950862,-0.014551470588235306,1.0315,1.028]]',
            stock: "#262626",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1.080570984590071,
                rgbScale: [0.9761631483694743, 0.8084439610400957, 0.7672364941348535]
              },
              paper: {
                hueDegrees: -4.353154962081819,
                saturationScale: 0.8741836011856183,
                brightnessScale: 0.8950970243524266,
                valueGamma: 1.0488877750288375
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
                frameRgb: [0.17647058823529413, 0.22156862745098038, 0.23333333333333334],
                paperRgb: [0.9529411764705882, 0.8196078431372549, 0.6235294117647059]
              }
            }
          },
          W: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/w.png",[0.006704885245901645,0.006692941176470516,0.987636,0.9908380000000001]]',
            stock: "#262626",
            adjustment: {
              frame: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 0.9047218006061872,
                rgbScale: [0.9603592550207505, 0.969666349449092, 0.9237657636977362]
              },
              paper: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1.4999999999999984,
                rgbScale: [0.9337343269356239, 0.9507757122470416, 0.9239917884670539]
              },
              mask: {
                kind: "rect",
                rect: [0.108, 0.5995238095238096, 0.7826666666666666, 0.2985714285714286],
                feather: 0.0013333333333333333
              }
            }
          },
          "L-red": {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/l.png",[-0.016950819672131166,-0.015191176470588218,1.038,1.0245]]',
            stock: "#262626",
            adjustment: {
              frame: {
                hueDegrees: 34.739264477887076,
                saturationScale: 0.9852773323887644,
                brightnessScale: 1.378086884956502,
                valueGamma: 1.4999999999999998
              },
              paper: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1.5,
                rgbScale: [1.0750463889594257, 1.147262906859306, 1.3058087039078397]
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
                    hueDegrees: -23.362286673872802,
                    saturationScale: 0.7914832755461864,
                    brightnessScale: 0.8410498345318217,
                    valueGamma: 1
                  }
                }
              ]
            }
          },
          A: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.005924295081967185,0.006325294117646987,0.987149,0.9908380000000001]]',
            stock: "#262626",
            adjustment: {
              frame: {
                hueDegrees: 3.878120086034839,
                saturationScale: 0.9980847697555724,
                brightnessScale: 1.1474793580068792,
                valueGamma: 1.5
              },
              paper: {
                hueDegrees: 0,
                saturationScale: 1,
                brightnessScale: 1,
                valueGamma: 1.1673938054552606,
                rgbScale: [0.939072731067789, 0.9647331322311847, 0.9268316848919987]
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
          U: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.004960442622950849,0.006754411764705876,0.989584,0.99182]]',
            stock: "#262626",
            adjustment: {
              frame: {
                hueDegrees: -8.289375676561631,
                saturationScale: 0.7957912123160688,
                brightnessScale: 0.855480512174471,
                valueGamma: 1.3399926831767899
              },
              paper: {
                hueDegrees: -4.519626107271086,
                saturationScale: 1.251409522387414,
                brightnessScale: 0.8689747189740745,
                valueGamma: 1
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
          R: {
            source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.0059607377049179944,0.004549117647058901,0.9886100000000001,0.9947659999999999]]',
            stock: "#262626",
            adjustment: {
              frame: {
                hueDegrees: 0.8028009700657401,
                saturationScale: 0.8045978763853561,
                brightnessScale: 0.9060701809480648,
                valueGamma: 1.5
              },
              paper: {
                hueDegrees: 8.558937304421088,
                saturationScale: 0.8982475283636524,
                brightnessScale: 0.7671866990515135,
                valueGamma: 1.1084835047730028
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
            dx: 4.25,
            dy: -8,
            scaleX: 1.04,
            scaleY: 1.02,
            spacing: 0.875,
            glyphs: {
              G: { scale: 1.09, dx: 0.25, dy: -0.25 },
              B: { scale: 1, dx: 0, dy: 0 },
              W: { scale: 1, dx: 0, dy: 0 },
              U: { scale: 1, dx: 0, dy: 0 },
              R: { scale: 1.06, dx: 0, dy: 0.75 }
            },
            numberScale: 1,
            numberDx: 0,
            numberDy: 0
          },
          paper: {
            W: [0.8117647058823529, 0.8313725490196079, 0.7372549019607844],
            U: [0.7019607843137254, 0.788235294117647, 0.792156862745098],
            B: [0.6078431372549019, 0.5803921568627451, 0.5176470588235295],
            R: [0.803921568627451, 0.7137254901960784, 0.615686274509804],
            G: [0.7254901960784313, 0.7843137254901961, 0.6509803921568628],
            N: [0.7333333333333333, 0.7098039215686275, 0.6627450980392157]
          },
          ink: [0.16470588235294117, 0.1568627450980392, 0.1607843137254902]
        },
        title: { size: 27, x: 37.25, y: 42, width: 1, shadow: 1.5, trim: 0.2, gray: 217 },
        type: { x: 49, y: 391.5, size: 22, width: 1.025, shadow: 1.75, trim: 0, gray: 220 },
        footer: {
          artist: { x: 48.5, y: 630.5, size: 20, width: 0.96, shadow: 2, trim: 0.3, gray: 225 },
          legal: {
            x: 48,
            y: 645,
            size: 13,
            width: 1.015,
            shadow: 0,
            trim: 0,
            lightGray: 194,
            darkGray: 29
          },
          stats: { x: 452, y: 631, size: 28, width: 0.99, shadow: 1.5, trim: 0.3, gray: 218 }
        },
        setSymbols: {
          default: {
            right: 441.75,
            centerY: 390.75,
            width: 20.75,
            height: 16.75,
            crop: [0, 0.12109375, 1, 0.724609375]
          }
        }
      }
    }
  }
});
e({
  set: "frc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: { "frc/m15-accurate/black": [0.5, 0.5, 1.1, 1.04] },
    MAJOR_FRAME_INSETS: { "frc/black": 1.5 }
  }
});
e({
  set: "frf",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "frf/component/black": [-0.5, -0.5, 0.96, 0.92],
      "frf/m15-accurate/black": [-1, 0.5, 1.06, 1.02]
    }
  }
});
e({
  set: "fut",
  kind: "calibration",
  tables: {
    printingBlackPoints: {
      fut: [
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameW.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9244897959183672,0.9248971193415638,0.93125]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/wcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9187500000000002,0.9229729729729731,1.1260000000000001]},"mask":{"kind":"rect","rect":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],"feather":0.0026666666666666666},"regions":[{"mask":{"kind":"polygon","feather":0.0026666666666666666,"points":[[0.11733333333333333,0.11385199240986717],[0.13866666666666666,0.07969639468690702],[0.176,0.05502846299810247],[0.2,0.04933586337760911],[0.9173333333333333,0.04933586337760911],[0.9253333333333333,0.05502846299810247],[0.9253333333333333,0.11385199240986717]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8812095032397409,0.8817567567567567,0.9481792717086837]}},{"mask":{"kind":"polygon","feather":0.0026666666666666666,"points":[[0.11466666666666667,0.8311195445920304],[0.8986666666666666,0.8311195445920304],[0.9093333333333333,0.8406072106261859],[0.896,0.8500948766603416],[0.8933333333333333,0.8690702087286527],[0.904,0.8842504743833017],[0.11466666666666667,0.8842504743833017]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0465277777777777,1.0163352272727273,1.1097770154373927]}}]}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/wpt.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9187500000000002,0.9229729729729731,1.1260000000000001]},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9004329004329005,0.8952702702702703,0.9717514124293787]},"mask":{"kind":"polygon","feather":0.01282051282051282,"points":[[0.15384615384615385,0.3137254901960784],[0.8205128205128205,0.3137254901960784],[0.8205128205128205,0.6862745098039216],[0.7692307692307693,0.8235294117647058],[0.15384615384615385,0.8235294117647058]]}}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameW.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9244897959183672,0.9248971193415638,0.93125]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameU.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1.0931250000000001,"brightnessScale":0.8931249999999998},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8502155172413793,0.8613445378151261,0.9300411522633745]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9047619047619047,0.9276018099547512,0.9518072289156626]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.4015151515151516,1.0086206896551724,0.9087837837837838]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/ucard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.6021739130434783,0.7878787878787878,0.9531772575250836]},"mask":{"kind":"rect","rect":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],"feather":0.0026666666666666666},"regions":[{"mask":{"kind":"polygon","feather":0.0026666666666666666,"points":[[0.11733333333333333,0.11385199240986717],[0.13866666666666666,0.07969639468690702],[0.176,0.05502846299810247],[0.2,0.04933586337760911],[0.9173333333333333,0.04933586337760911],[0.9253333333333333,0.05502846299810247],[0.9253333333333333,0.11385199240986717]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.59375,0.8760683760683762,0.8777777777777778]}},{"mask":{"kind":"polygon","feather":0.0026666666666666666,"points":[[0.11466666666666667,0.8311195445920304],[0.8986666666666666,0.8311195445920304],[0.9093333333333333,0.8406072106261859],[0.896,0.8500948766603416],[0.8933333333333333,0.8690702087286527],[0.904,0.8842504743833017],[0.11466666666666667,0.8842504743833017]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.6702898550724639,0.9859550561797753,1.0846774193548387]}}]}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/upt.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.6021739130434783,0.7878787878787878,0.9531772575250836]},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.7395209580838322,0.8991596638655462,0.8878378378378378]},"mask":{"kind":"polygon","feather":0.01282051282051282,"points":[[0.15384615384615385,0.3137254901960784],[0.8205128205128205,0.3137254901960784],[0.8205128205128205,0.6862745098039216],[0.7692307692307693,0.8235294117647058],[0.15384615384615385,0.8235294117647058]]}}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameU.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1.0931250000000001,"brightnessScale":0.8931249999999998},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8502155172413793,0.8613445378151261,0.9300411522633745]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9047619047619047,0.9276018099547512,0.9518072289156626]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.4015151515151516,1.0086206896551724,0.9087837837837838]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameB.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1.0137500000000002},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8750000000000001,0.8459821428571429,0.8392857142857143]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.736842105263158,0.8620689655172413,1.03125]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.6666666666666666,0.8181818181818182,1.0740740740740742]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameB.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1.0137500000000002},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8750000000000001,0.8459821428571429,0.8392857142857143]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.736842105263158,0.8620689655172413,1.03125]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.6666666666666666,0.8181818181818182,1.0740740740740742]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameR.png",
              adjustment: '{"frame":{"hueDegrees":-4.625,"saturationScale":1.0362500000000012,"brightnessScale":1.065625},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9385245901639344,0.8853161843515541,0.84070796460177]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0038560411311055,0.9704301075268819,1.1162790697674418]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9128989361702128,0.9044117647058825,1.1458333333333335]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/rcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8851981351981352,0.9510309278350517,0.9543269230769231]},"mask":{"kind":"rect","rect":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],"feather":0.0026666666666666666},"regions":[{"mask":{"kind":"polygon","feather":0.0026666666666666666,"points":[[0.11733333333333333,0.11385199240986717],[0.13866666666666666,0.07969639468690702],[0.176,0.05502846299810247],[0.2,0.04933586337760911],[0.9173333333333333,0.04933586337760911],[0.9253333333333333,0.05502846299810247],[0.9253333333333333,0.11385199240986717]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9145199063231849,1.0140449438202248,1.1162790697674418]}},{"mask":{"kind":"polygon","feather":0.0026666666666666666,"points":[[0.11466666666666667,0.8311195445920304],[0.8986666666666666,0.8311195445920304],[0.9093333333333333,0.8406072106261859],[0.896,0.8500948766603416],[0.8933333333333333,0.8690702087286527],[0.904,0.8842504743833017],[0.11466666666666667,0.8842504743833017]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0811023622047244,0.9044117647058825,0.7366071428571429]}}]}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/rpt.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8851981351981352,0.9510309278350517,0.9543269230769231]},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9608294930875576,1.0552486187845302,1.180722891566265]},"mask":{"kind":"polygon","feather":0.01282051282051282,"points":[[0.15384615384615385,0.3137254901960784],[0.8205128205128205,0.3137254901960784],[0.8205128205128205,0.6862745098039216],[0.7692307692307693,0.8235294117647058],[0.15384615384615385,0.8235294117647058]]}}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ccard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.6,0.6,0.6]},"mask":{"kind":"rect","rect":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],"feather":0.0026666666666666666},"regions":[{"mask":{"kind":"polygon","feather":0.0026666666666666666,"points":[[0.09333333333333334,0.6129032258064516],[0.9173333333333333,0.6129032258064516],[0.928,0.6451612903225806],[0.936,0.683111954459203],[0.9333333333333333,0.7400379506641366],[0.9333333333333333,0.7969639468690702],[0.9306666666666666,0.8159392789373814],[0.92,0.8538899430740038],[0.912,0.8842504743833017],[0.10133333333333333,0.8842504743833017],[0.08533333333333333,0.8538899430740038],[0.07733333333333334,0.8159392789373814],[0.06933333333333333,0.777988614800759],[0.06933333333333333,0.7210626185958254],[0.07466666666666667,0.683111954459203],[0.08266666666666667,0.6451612903225806]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1}}]}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ctypeline.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.947089947089947,0.9388297872340424,1.0242587601078168]},"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},"regions":[{"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.6957070707070706,0.6905370843989771,0.7095046854082999]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ctextbox.png",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8893905191873589,0.8839285714285715,0.9282511210762332]}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameG.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8961038961038961,0.9102564102564102,0.8887061403508772]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.2035714285714287,1.03,1.0040322580645162]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.494318181818182,1.0045731707317074,1.1860465116279069]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameG.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8961038961038961,0.9102564102564102,0.8887061403508772]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.2035714285714287,1.03,1.0040322580645162]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.494318181818182,1.0045731707317074,1.1860465116279069]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/gcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]},"mask":{"kind":"rect","rect":[0.050666666666666665,0.036053130929791274,0.9066666666666666,0.9316888045540797],"feather":0.0026666666666666666},"regions":[{"mask":{"kind":"polygon","feather":0.0026666666666666666,"points":[[0.11733333333333333,0.11385199240986717],[0.13866666666666666,0.07969639468690702],[0.176,0.05502846299810247],[0.2,0.04933586337760911],[0.9173333333333333,0.04933586337760911],[0.9253333333333333,0.05502846299810247],[0.9253333333333333,0.11385199240986717]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9573863636363638,1.03,1.3833333333333333]}},{"mask":{"kind":"polygon","feather":0.0026666666666666666,"points":[[0.11466666666666667,0.8311195445920304],[0.8986666666666666,0.8311195445920304],[0.9093333333333333,0.8406072106261859],[0.896,0.8500948766603416],[0.8933333333333333,0.8690702087286527],[0.904,0.8842504743833017],[0.11466666666666667,0.8842504743833017]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]}}]}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future-textless.mse-style/gpt.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9746835443037973,1.0483870967741935,1.5]},"mask":{"kind":"polygon","feather":0.01282051282051282,"points":[[0.15384615384615385,0.3137254901960784],[0.8205128205128205,0.3137254901960784],[0.8205128205128205,0.6862745098039216],[0.7692307692307693,0.8235294117647058],[0.15384615384615385,0.8235294117647058]]}}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/future/regular/futureFrameA.png",
              adjustment: '{"frame":{"hueDegrees":-6.794165580182494,"saturationScale":0.7130415909549775,"brightnessScale":1.083617747440273},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9201680672268907,0.9121338912133891,0.9253112033195021]},"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.08803763440860216,0.6270452358036573],[0.9112903225806451,0.6270452358036573],[0.9139784946236559,0.6352261790182868],[0.9166666666666666,0.6496631376323387],[0.9220430107526881,0.6737247353224254],[0.9260752688172043,0.697786333012512],[0.928763440860215,0.7218479307025987],[0.9301075268817204,0.7459095283926853],[0.928763440860215,0.7699711260827719],[0.9274193548387096,0.7940327237728585],[0.9233870967741935,0.8180943214629451],[0.918010752688172,0.8421559191530318],[0.9099462365591398,0.8662175168431184],[0.8985215053763441,0.884985563041386],[0.7634408602150538,0.884985563041386],[0.7614247311827957,0.8878729547641964],[0.10013440860215053,0.8878729547641964],[0.09879032258064516,0.8854667949951877],[0.08938172043010753,0.8662175168431184],[0.08131720430107527,0.8421559191530318],[0.07459677419354839,0.8180943214629451],[0.07123655913978495,0.7940327237728585],[0.06922043010752688,0.7699711260827719],[0.06854838709677419,0.7459095283926853],[0.06922043010752688,0.7218479307025987],[0.07258064516129033,0.697786333012512],[0.07661290322580645,0.6737247353224254],[0.08131720430107527,0.6496631376323387],[0.08534946236559139,0.6352261790182868]]},"regions":[{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.11693548387096774,0.11357074109720885],[0.12365591397849462,0.09624639076034648],[0.13978494623655913,0.07603464870067372],[0.16129032258064516,0.059672762271414825],[0.1814516129032258,0.04908565928777671],[0.20026881720430106,0.04234841193455245],[0.9153225806451613,0.04234841193455245],[0.9260752688172043,0.04523580365736285],[0.9314516129032258,0.0519730510105871],[0.9314516129032258,0.11357074109720885]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8410958904109589,0.8910614525139665,0.9060773480662984]}},{"mask":{"kind":"polygon","feather":0.002688172043010753,"points":[[0.09946236559139784,0.5601539942252165],[0.9099462365591398,0.5601539942252165],[0.9247311827956989,0.5678537054860443],[0.9354838709677419,0.5822906641000962],[0.9475806451612904,0.591915303176131],[0.9475806451612904,0.6044273339749759],[0.9354838709677419,0.6179018286814244],[0.9166666666666666,0.6256015399422522],[0.11021505376344086,0.6256015399422522]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1,1]}}]}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/glcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/blcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/rlcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.1482558139534884,1.111280487804878,1.3]},"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},"regions":[{"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/rlcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/glcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.1482558139534884,1.111280487804878,1.3]},"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},"regions":[{"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/gltextbox.png",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.4,1.4,1.4]}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/glcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/wlcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.1482558139534884,1.111280487804878,1.3]},"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},"regions":[{"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/gltextbox.png",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.4,1.4,1.4]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/wltextbox.png",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8366228070175439,0.786036036036036,0.7373737373737373]}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/wlcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ulcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.1482558139534884,1.111280487804878,1.3]},"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},"regions":[{"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/wltextbox.png",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8366228070175439,0.786036036036036,0.7373737373737373]}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/ulcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/blcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.1482558139534884,1.111280487804878,1.3]},"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},"regions":[{"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}',
              lift: null
            }
          ]
        },
        {
          set: "fut",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/clcard.jpg",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":8,"saturationScale":0.6137499999999998,"brightnessScale":1.25},"mask":{"kind":"rect","rect":[0.05333333333333334,0.8918406072106262,0.9013333333333333,0.07590132827324478],"feather":0.0026666666666666666}}',
              lift: null,
              bakedStock: !0
            },
            {
              url: "https://raw.githubusercontent.com/MagicSetEditorPacks/Full-Magic-Pack/16f1d13bb7f5924613fc1ddc25da582beccfefb6/data/magic-future.mse-style/cltypeline.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.1482558139534884,1.111280487804878,1.3]},"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.07669616519174041,0.09267241379310345],[0.10029498525073746,0.05387931034482758],[0.1415929203539823,0.02586206896551724],[0.168141592920354,0.01939655172413793],[0.9616519174041298,0.01939655172413793],[0.9705014749262537,0.02586206896551724],[0.9705014749262537,0.09267241379310345]]},"regions":[{"mask":{"kind":"polygon","feather":0.0029498525073746312,"points":[[0.035398230088495575,0.5969827586206896],[0.9410029498525073,0.5969827586206896],[0.9734513274336283,0.6142241379310345],[0.9941002949852508,0.6336206896551724],[0.9734513274336283,0.6681034482758621],[0.9410029498525073,0.6767241379310345],[0.058997050147492625,0.6767241379310345]]},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0692640692640691,1.036873156342183,1.1861510791366907]}}]}',
              lift: null
            }
          ]
        }
      ]
    }
  }
});
e({
  set: "gn3",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "gn3/component/black": [0.5, -2, 0.98, 0.92] } }
});
e({
  set: "gnt",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "gnt/m15-accurate/black": [3, 1, 1.06, 1.08] } }
});
e({
  set: "hml",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "hml-black-W": [0.8803921568627451, 0.892156862745098, 0.8137254901960784],
      "hml-black-N": [0.8451372549019607, 0.8365603669190448, 0.8279834789361288],
      "hml-black-U": [0.8, 0.8627450980392157, 0.8813725490196078],
      "hml-black-R": [0.8924019607843137, 0.8034685790167723, 0.7430811941004472]
    },
    RETRO_MANA_PROFILES: { "hml/black": [433, 44.5, 27, 23.4] }
  }
});
e({
  set: "hob",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "hob/component/black": [-1, -1, 0.96, 0.94],
      "hob/m15-accurate/black": [-1, 1, 1.08, 1.04]
    }
  }
});
e({
  set: "hoc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "hoc/component/black": [-0.5, -1, 0.96, 0.98],
      "hoc/m15-accurate/black": [-1, 0.5, 1.08, 1.06]
    },
    MAJOR_FRAME_INSETS: { "hoc/black": 1 }
  }
});
e({
  set: "hop",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "hop/eighth/black": [4, 0, 1.06, 1.04] } }
});
e({
  set: "hou",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "hou/component/black": [-3, -1, 0.96, 0.88],
      "hou/m15-accurate/black": [-3, 0, 1.12, 0.96]
    }
  }
});
e({
  set: "ice",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "ice-black-W": [0.9176470588235294, 0.8941176470588236, 0.7568627450980392],
      "ice-black-U": [0.7294117647058823, 0.8117647058823529, 0.8509803921568627]
    }
  }
});
e({
  set: "iko",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "iko/component/black": [-1.5, -0.5, 0.92, 0.92],
      "iko/m15-accurate/black": [-1.5, 0.5, 1.04, 1.02]
    },
    MAJOR_FRAME_INSETS: { "iko/black": 0.5 }
  }
});
e({
  set: "ima",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "ima/component/black": [-0.5, -0.5, 0.92, 0.9],
      "ima/m15-accurate/black": [0, 1, 1.06, 1]
    }
  }
});
e({
  set: "inr",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "inr-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 0.6181627435848895,
            saturationScale: 1.054930083373806,
            brightnessScale: 0.9775280898876404
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.3903999999999978,
            brightnessScale: 1.0245901639344261
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "inr-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.142150315687218,
            saturationScale: 0.8832387603666523,
            brightnessScale: 0.9239766081871345
          },
          paper: {
            hueDegrees: -2.691511387163473,
            saturationScale: 1.056747448979592,
            brightnessScale: 1
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
      "inr-black-W": [0.996078431372549, 0.9764705882352941, 0.8509803921568627],
      "inr-black-U": [0.6802606033829841, 0.8765397843821006, 0.9723970588235294],
      "inr-black-R": [0.9647058823529412, 0.6745098039215687, 0.5529411764705883]
    },
    MAJOR_SYMBOL_PROFILES: {
      "inr/component/black": [-1, -1.5, 0.96, 0.98],
      "inr/m15-accurate/black": [-1, 0, 1.08, 1.12]
    },
    MAJOR_FRAME_INSETS: { "inr/black": 1 },
    printingBlackPoints: {
      inr: [
        {
          set: "inr",
          stock: "#130c0d",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":0.6181627435848895,"saturationScale":1.054930083373806,"brightnessScale":0.9775280898876404},"paper":{"hueDegrees":0,"saturationScale":0.3903999999999978,"brightnessScale":1.0245901639344261},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        },
        {
          set: "inr",
          stock: "#130c0d",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":-4.142150315687218,"saturationScale":0.8832387603666523,"brightnessScale":0.9239766081871345},"paper":{"hueDegrees":-2.691511387163473,"saturationScale":1.056747448979592,"brightnessScale":1},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      inr: [
        {
          set: "inr",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#130c0d",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "inv",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "inv-black-N": [0.6763333333333332, 0.6470367161716172, 0.6177400990099009],
      "inv-black-W": [0.9019607843137255, 0.8745098039215686, 0.7156862745098039],
      "inv-black-G": [0.5372549019607843, 0.6862745098039216, 0.5411764705882353]
    }
  }
});
e({
  set: "itp",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "itp-white-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.2012644046094465,
            saturationScale: 1.1224918378193693,
            brightnessScale: 0.8337078651685392
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.35000000000000003,
            brightnessScale: 0.8798975409836065
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "itp-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 54.72844827586209,
            saturationScale: 0.667496921182266,
            brightnessScale: 0.9824561403508771
          },
          paper: {
            hueDegrees: -8.03571428571422,
            saturationScale: 0.8959469144800777,
            brightnessScale: 0.7304347826086957
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
      "itp-white-N": [0.7553970588235294, 0.725230379996705, 0.6950637011698805],
      "itp-white-W": [0.8941176470588236, 0.8666666666666669, 0.7549019607843137],
      "itp-white-B": [0.7294411764705881, 0.7071826870096959, 0.6849241975488034],
      "itp-white-R": [0.8411764705882353, 0.6156862745098035, 0.5215686274509804],
      "itp-white-G": [0.7196078431372549, 0.7764705882352941, 0.6686274509803921]
    },
    printingBlackPoints: {
      itp: [
        {
          set: "itp",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":54.72844827586209,"saturationScale":0.667496921182266,"brightnessScale":0.9824561403508771},"paper":{"hueDegrees":-8.03571428571422,"saturationScale":0.8959469144800777,"brightnessScale":0.7304347826086957},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: [41, 0, 19]
            }
          ]
        }
      ]
    }
  }
});
e({
  set: "j22",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "j22/component/black": [3, -2, 0.96, 0.98],
      "j22/m15-accurate/black": [3, -1, 1.08, 1.12]
    }
  }
});
e({
  set: "j25",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "j25/component/black": [0, -1.5, 0.96, 0.98],
      "j25/m15-accurate/black": [0, 0, 1.1, 1.08]
    },
    MAJOR_FRAME_INSETS: { "j25/black": 1 }
  }
});
e({
  set: "jmp",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "jmp/m15-accurate/black": [0.5, 0, 0.92, 0.94] } }
});
e({
  set: "jou",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "jou/eighth/black": [0, 1, 0.98, 0.96] } }
});
e({
  set: "jud",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "jud-black-N": [0.6904362745098039, 0.660528762618909, 0.630621250728014],
      "jud-black-R": [0.8313725490196079, 0.5392156862745099, 0.43333333333333335]
    },
    RETRO_MANA_PROFILES: { "jud/black": [439, 44, 26.5, 23.4] }
  }
});
e({
  set: "kld",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "kld/component/black": [0, -0.5, 0.88, 0.92] } }
});
e({
  set: "ktk",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ktk/m15-accurate/black": [-0.5, 0, 1.06, 1.1] } }
});
e({
  set: "lcc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "lcc/component/black": [-1, -1, 1, 0.94],
      "lcc/m15-accurate/black": [-2, 0, 1.08, 1.08]
    }
  }
});
e({
  set: "lci",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "lci/component/black": [0, -1.5, 0.98, 0.96],
      "lci/m15-accurate/black": [0, 0, 1.1, 1.1]
    }
  }
});
e({
  set: "lea",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "lea-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 0.07692307692309441,
            saturationScale: 0.8721979027962715,
            brightnessScale: 0.920343137254902
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.5488573232323238,
            brightnessScale: 0.9289524647887324
          },
          mask: {
            kind: "rect",
            rect: [0.12704918032786885, 0.5985294117647059, 0.7479508196721312, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "lea-black-W": [0.8588235294117647, 0.8666666666666667, 0.807843137254902],
      "lea-black-U": [0.6480392156862745, 0.7490196078431373, 0.7862745098039216]
    },
    PRINTING_COLOR_PROFILES: {
      "lea/black/retro/r.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 6.19600667693885,
              saturationScale: 0.7922304208065458,
              brightnessScale: 1.0507246376811594
            },
            mask: {
              kind: "rect",
              rect: [0.125, 0.5985294117647059, 0.7540983606557377, 0.2852941176470588],
              feather: 0.0013333333333333333
            }
          }
        }
      },
      "lea/black/retro/b.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png": {
            frame: {
              hueDegrees: 13.713669950738904,
              saturationScale: 0.35,
              brightnessScale: 0.9468014705882352
            },
            paper: {
              hueDegrees: -5.9959677419354875,
              saturationScale: 0.8356642416225748,
              brightnessScale: 0.8472803347280334
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
      "lea/black/retro/w.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png": {
            frame: {
              hueDegrees: -1.9455801551389413,
              saturationScale: 0.7314003493819718,
              brightnessScale: 0.9157372986369269
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.5369823232323239,
              brightnessScale: 0.9283274647887324
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
      "lea/black/retro/u.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: -4.361205868715615,
              saturationScale: 0.8628778854690737,
              brightnessScale: 0.9083333333333334
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
      "lea/black/retro/a.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png": {
            frame: {
              hueDegrees: -7.274193548387075,
              saturationScale: 0.35562499999999997,
              brightnessScale: 0.9191176470588236
            },
            paper: {
              hueDegrees: 19.625509683995915,
              saturationScale: 0.5469330921588732,
              brightnessScale: 0.953902027027027
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
      "lea/black/retro/g.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",[0,0,1,1]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png": {
            frame: {
              hueDegrees: 5.3103223868643,
              saturationScale: 1.0757874102425145,
              brightnessScale: 0.9585714285714285
            },
            paper: {
              hueDegrees: 13.446120689655118,
              saturationScale: 0.7340938995215308,
              brightnessScale: 0.9952380952380953
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
              frameRgb: [0.23529411764705882, 0.3431372549019608, 0.28823529411764703],
              paperRgb: [0.4117647058823529, 0.2784313725490196, 0.2549019607843137]
            }
          }
        }
      }
    },
    MANA_PRINTING_TARGETS: {
      "lea-black-U": [0.5843137254901961, 0.7254901960784313, 0.7607843137254902],
      "lea-black-B": [0.3607843137254902, 0.39215686274509803, 0.396078431372549],
      "lea-black-R": [0.7803921568627451, 0.596078431372549, 0.5333333333333333],
      "lea-black-G": [0.5803921568627451, 0.6862745098039216, 0.5254901960784314],
      "lea-black-N": [0.47843137254901963, 0.5333333333333333, 0.5450980392156862]
    },
    printingBlackPoints: {
      lea: [
        {
          set: "lea",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/r.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":6.19600667693885,"saturationScale":0.7922304208065458,"brightnessScale":1.0507246376811594},"mask":{"kind":"rect","rect":[0.125,0.5985294117647059,0.7540983606557377,0.2852941176470588],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        },
        {
          set: "lea",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",
              adjustment: '{"frame":{"hueDegrees":13.713669950738904,"saturationScale":0.35,"brightnessScale":0.9468014705882352},"paper":{"hueDegrees":-5.9959677419354875,"saturationScale":0.8356642416225748,"brightnessScale":0.8472803347280334},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.17647058823529413,0.2196078431372549,0.23333333333333334],"paperRgb":[0.9372549019607843,0.8,0.5941176470588235]}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        },
        {
          set: "lea",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",
              adjustment: '{"frame":{"hueDegrees":-1.9455801551389413,"saturationScale":0.7314003493819718,"brightnessScale":0.9157372986369269},"paper":{"hueDegrees":0,"saturationScale":0.5369823232323239,"brightnessScale":0.9283274647887324},"mask":{"kind":"rect","rect":[0.12704918032786885,0.5985294117647059,0.7479508196721312,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        },
        {
          set: "lea",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/u.png",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":-4.361205868715615,"saturationScale":0.8628778854690737,"brightnessScale":0.9083333333333334},"mask":{"kind":"rect","rect":[0.12704918032786885,0.5985294117647059,0.7479508196721312,0.2852941176470588],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        },
        {
          set: "lea",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/a.png",
              adjustment: '{"frame":{"hueDegrees":-7.274193548387075,"saturationScale":0.35562499999999997,"brightnessScale":0.9191176470588236},"paper":{"hueDegrees":19.625509683995915,"saturationScale":0.5469330921588732,"brightnessScale":0.953902027027027},"mask":{"kind":"rect","rect":[0.1290983606557377,0.6014705882352941,0.7459016393442623,0.2852941176470588],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        },
        {
          set: "lea",
          stock: "#1b1b1b",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/g.png",
              adjustment: '{"frame":{"hueDegrees":5.3103223868643,"saturationScale":1.0757874102425145,"brightnessScale":0.9585714285714285},"paper":{"hueDegrees":13.446120689655118,"saturationScale":0.7340938995215308,"brightnessScale":0.9952380952380953},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.23529411764705882,0.3431372549019608,0.28823529411764703],"paperRgb":[0.4117647058823529,0.2784313725490196,0.2549019607843137]}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      lea: [
        {
          set: "lea",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/",
          geometry: "[0,0,1,1]",
          stock: "#1b1b1b",
          family: "retro"
        }
      ]
    }
  }
});
e({
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
});
e({
  set: "leg",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "leg-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 14.296790811986057,
            saturationScale: 1.0286132997102524,
            brightnessScale: 1.0213483146067415
          },
          paper: { hueDegrees: 0, saturationScale: 1.75, brightnessScale: 0.9776331967213114 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    LEGENDS_COLOR_PROFILES: {
      "leg/black/retro/w.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png",[-0.015000000000000013,-0.016735294117647074,1.03,1.032]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/w.png": {
            frame: {
              hueDegrees: 31.5,
              saturationScale: 0.7737499999999997,
              brightnessScale: 1.0418750000000003
            },
            paper: {
              hueDegrees: 46.92434210526312,
              saturationScale: 1.3968055555555547,
              brightnessScale: 1.1227453271028038
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
      "leg/black/retro/u.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png",[0.006241180327868882,0.003875294117647035,0.989584,0.995748]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/u.png": {
            frame: {
              hueDegrees: -6,
              saturationScale: 0.6031249999999994,
              brightnessScale: 1.0975000000000001
            },
            paper: {
              hueDegrees: -10.598914565826249,
              saturationScale: 0.9226579520697171,
              brightnessScale: 1.0041322314049586
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
      "leg/black/retro/b.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png",[-0.015000000000000013,-0.016470588235294133,1.03,1.03]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/abu/b.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 5.6763925729442235,
              saturationScale: 0.8794297625777275,
              brightnessScale: 1.0209205020920502
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
              frameRgb: [0.17647058823529413, 0.22450980392156863, 0.23627450980392156],
              paperRgb: [0.9372549019607843, 0.8, 0.596078431372549]
            }
          }
        }
      },
      "leg/black/retro/r.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png",[0.006241180327868882,0.004610588235294094,0.989584,0.995748]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/r.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 21.86087449126046,
              saturationScale: 0.9073305928571983,
              brightnessScale: 0.850835322195704
            },
            accents: [
              {
                mask: {
                  rings: [
                    {
                      outer: [
                        0.08894759288155257,
                        0.07955119284846228,
                        0.8241582023272438,
                        0.47702832443549975
                      ],
                      inner: [
                        0.10344283764610208,
                        0.07955119284846228,
                        0.8096629575626944,
                        0.4652133814154255
                      ]
                    }
                  ],
                  hueCenter: 0,
                  hueRadius: 70,
                  hueFeather: 10,
                  saturation: [0.01, 0.08],
                  brightness: [0.65, 0.85]
                },
                adjustment: {
                  hueDegrees: 9.95535714285711,
                  saturationScale: 0.8848407077066573,
                  brightnessScale: 1.003157894736842
                }
              },
              {
                mask: {
                  rings: [
                    {
                      outer: [
                        0.10344283764610208,
                        0.5964549499767128,
                        0.7889554650419093,
                        0.30128104701189456
                      ],
                      inner: [
                        0.11793808241065161,
                        0.5964549499767128,
                        0.7744602202773598,
                        0.2924198397468389
                      ]
                    }
                  ],
                  hueCenter: 0,
                  hueRadius: 70,
                  hueFeather: 10,
                  saturation: [0.01, 0.08],
                  brightness: [0.65, 0.85]
                },
                adjustment: {
                  hueDegrees: 33.20021777976331,
                  saturationScale: 0.8716772230501736,
                  brightnessScale: 0.9551148225469728
                }
              }
            ],
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
      "leg/black/retro/g.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png",[0.007265770491803308,0.004855294117647071,0.989584,0.993784]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/g.png": {
            frame: {
              hueDegrees: -9.546487090367464,
              saturationScale: 0.9883385744234803,
              brightnessScale: 1.2090680100755669
            },
            paper: {
              hueDegrees: 23.60706205559154,
              saturationScale: 0.9735775550740341,
              brightnessScale: 0.7845303867403315
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
              frameRgb: [0.23333333333333334, 0.38921568627450975, 0.28137254901960784],
              paperRgb: [0.7098039215686275, 0.5450980392156862, 0.403921568627451]
            }
          }
        }
      },
      "leg/black/retro/a.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png",[0.006192590163934432,0.004855294117647071,0.987636,0.993784]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/a.png": {
            frame: {
              hueDegrees: 24.352415966386616,
              saturationScale: 1.09714025198939,
              brightnessScale: 1.158811475409836
            },
            paper: {
              hueDegrees: 18.140759005145696,
              saturationScale: 0.8517161410018563,
              brightnessScale: 1.0706188596859518
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
        }
      },
      "leg/black/retro/l.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png",[0.0052165901639344555,0.00559058823529413,0.989584,0.993784]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/l.png": {
            frame: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              rgbScale: [1.21125, 1.2400000000000002, 0.98875]
            },
            paper: {
              hueDegrees: 14.93891019140574,
              saturationScale: 0.9333152173913042,
              brightnessScale: 1
            },
            mask: {
              kind: "rect",
              rect: [
                0.1265358333052816,
                0.6083023840900922,
                0.7510856027198977,
                0.2770456451419673
              ],
              feather: 0.0013333333333333333
            },
            accents: [
              {
                mask: {
                  rings: [
                    {
                      outer: [0.08266666666666667, 0.0719047619047619, 0.838, 0.4866666666666667],
                      inner: [
                        0.09333333333333334,
                        0.07952380952380952,
                        0.8166666666666667,
                        0.4714285714285714
                      ]
                    }
                  ],
                  hueCenter: 55,
                  hueRadius: 35,
                  hueFeather: 10,
                  saturation: [0.35, 0.7]
                },
                adjustment: {
                  hueDegrees: 5.553601139457442,
                  saturationScale: 0.5666761230892462,
                  brightnessScale: 0.9833239619377162
                }
              },
              {
                mask: {
                  rings: [
                    {
                      outer: [0.112, 0.5957142857142858, 0.7826666666666666, 0.30047619047619045],
                      inner: [0.12533333333333332, 0.61, 0.7533333333333333, 0.27714285714285714]
                    }
                  ],
                  hueCenter: 55,
                  hueRadius: 35,
                  hueFeather: 10,
                  saturation: [0.35, 0.7]
                },
                adjustment: {
                  hueDegrees: 6.712541190153161,
                  saturationScale: 0.682745288248337,
                  brightnessScale: 0.7639751552795031
                }
              }
            ]
          }
        }
      },
      "leg/black/retro/m.png": {
        source: '["https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png",[0.0037205395409838113,0.004187595294117773,0.9910362339999996,0.9947522519999996]]',
        materials: {
          "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/old/fourth/m.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 1.9433497536946334,
              saturationScale: 0.9884598707032473,
              brightnessScale: 1.0119047619047619
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
        }
      }
    },
    MANA_PRINTING_TARGETS: {
      "leg-black-U": [0.6941176470588235, 0.9019607843137255, 0.8823529411764706],
      "leg-black-R": [0.8941176470588236, 0.7568627450980392, 0.5764705882352941],
      "leg-black-G": [0.7098039215686275, 0.8509803921568627, 0.5803921568627451]
    },
    RETRO_MANA_PROFILES: { "leg/black": [436, 39.25, 26.975, 23.9] }
  }
});
e({
  set: "m10",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "m10/eighth/black": [5, 0.5, 1.08, 1] } }
});
e({
  set: "m11",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "m11/eighth/black": [4, 0.5, 1.06, 1.02] } }
});
e({
  set: "m12",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "m12/eighth/black": [4, 0.5, 1.06, 1] } }
});
e({
  set: "m13",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "m13/eighth/black": [4.5, 0.5, 1.06, 1.06] } }
});
e({
  set: "m15",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "m15/component/black": [1, -0.5, 0.94, 0.9] } }
});
e({
  set: "m19",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "m19/component/black": [2.5, 1, 1.04, 0.98],
      "m19/m15-accurate/black": [3, 1.5, 1.08, 1.02]
    }
  }
});
e({
  set: "m20",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "m20/component/black": [1.5, 0.5, 1.02, 1.02] } }
});
e({
  set: "m21",
  kind: "calibration",
  tables: {
    PRINTING_COLOR_PROFILES: {
      "m21/black/components/U/U": {
        source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/U.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
        materials: {
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp": {
            frame: {
              hueDegrees: 17.337752059074205,
              saturationScale: 0.7776986444212719,
              brightnessScale: 0.9675141242937855
            },
            paper: {
              hueDegrees: 8.888888888888914,
              saturationScale: 0.6314814814814816,
              brightnessScale: 0.967741935483871
            },
            mask: {
              kind: "rect",
              rect: [
                0.032440800650188735,
                0.6662377838116825,
                0.9396578084020479,
                0.3172337426923378
              ],
              feather: 0.0026041666666666665
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/U.webp": {
            hueDegrees: 8.888888888888914,
            saturationScale: 0.6314814814814816,
            brightnessScale: 0.967741935483871
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp": {
            hueDegrees: 17.337752059074205,
            saturationScale: 0.7776986444212719,
            brightnessScale: 0.9675141242937855
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp": {
            hueDegrees: 8.888888888888914,
            saturationScale: 0.6314814814814816,
            brightnessScale: 0.967741935483871
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp": {
            hueDegrees: 17.337752059074205,
            saturationScale: 0.7776986444212719,
            brightnessScale: 0.9675141242937855
          }
        }
      },
      "m21/black/components/G/G": {
        source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/G.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
        materials: {
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9580706521739131 },
            mask: {
              kind: "rect",
              rect: [
                0.032440800650188735,
                0.6662377838116825,
                0.9396578084020479,
                0.3172337426923378
              ],
              feather: 0.0026041666666666665
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/G.webp": { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9580706521739131 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp": { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp": { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9580706521739131 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp": { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }
        }
      },
      "m21/black/components/R/R": {
        source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
        materials: {
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp": {
            frame: {
              hueDegrees: 10.298505477140054,
              saturationScale: 0.9250450145969191,
              brightnessScale: 0.8881656804733729
            },
            paper: {
              hueDegrees: -4.114932885906114,
              saturationScale: 0.6159725971922244,
              brightnessScale: 0.9448979591836735
            },
            mask: {
              kind: "rect",
              rect: [
                0.032440800650188735,
                0.6662377838116825,
                0.9396578084020479,
                0.3172337426923378
              ],
              feather: 0.0026041666666666665
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp": {
            hueDegrees: -4.114932885906114,
            saturationScale: 0.6159725971922244,
            brightnessScale: 0.9448979591836735
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp": {
            hueDegrees: 10.298505477140054,
            saturationScale: 0.9250450145969191,
            brightnessScale: 0.8881656804733729
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp": {
            hueDegrees: -4.114932885906114,
            saturationScale: 0.6159725971922244,
            brightnessScale: 0.9448979591836735
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp": {
            hueDegrees: 10.298505477140054,
            saturationScale: 0.9250450145969191,
            brightnessScale: 0.8881656804733729
          }
        }
      },
      "m21/black/components/Artifact/Artifact": {
        source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Artifact.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
        materials: {
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 37.25414989939645,
              saturationScale: 0.7848398354730142,
              brightnessScale: 0.9923161361141603
            },
            mask: {
              kind: "rect",
              rect: [
                0.032440800650188735,
                0.6662377838116825,
                0.9396578084020479,
                0.3172337426923378
              ],
              feather: 0.0026041666666666665
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Artifact.webp": {
            hueDegrees: 37.25414989939645,
            saturationScale: 0.7848398354730142,
            brightnessScale: 0.9923161361141603
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp": { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp": {
            hueDegrees: 37.25414989939645,
            saturationScale: 0.7848398354730142,
            brightnessScale: 0.9923161361141603
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp": { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }
        }
      },
      "m21/black/components/B/B": {
        source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/B.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/B.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/B.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/B.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/B.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/B.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
        legendary: !1,
        materials: {
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/B.webp": {
            frame: {
              hueDegrees: -25.615373450085436,
              saturationScale: 0.474605353403811,
              brightnessScale: 0.8839908987957145,
              valueGamma: 0.9532541359332688
            },
            paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            mask: {
              kind: "rect",
              rect: [
                0.032440800650188735,
                0.6662377838116825,
                0.9396578084020479,
                0.3172337426923378
              ],
              feather: 0.0026041666666666665
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/B.webp": {
            hueDegrees: -25.615373450085436,
            saturationScale: 0.474605353403811,
            brightnessScale: 0.8839908987957145,
            valueGamma: 0.9532541359332688
          }
        }
      }
    },
    ORDINARY_COLOR_PROFILES: {
      "m21/black/components/R/R": {
        source: '[{"background":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp","frame":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp","boxes":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","nameplate":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp","crown":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp","pt":"https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp"},[0.04858,0.03937,0.90284,0.88864],0]',
        legendary: !1,
        materials: {
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp": {
            frame: {
              hueDegrees: 6.340194313841702,
              saturationScale: 0.9999999999999968,
              brightnessScale: 0.8957653067671145,
              valueGamma: 0.9500990476406066,
              rgbScale: [1.0154051686851842, 0.9992551312126245, 0.9855626639694447]
            },
            paper: {
              hueDegrees: -4.114932885906114,
              saturationScale: 0.6159725971922244,
              brightnessScale: 0.9448979591836735
            },
            mask: {
              kind: "rect",
              rect: [
                0.032440800650188735,
                0.6662377838116825,
                0.9396578084020479,
                0.3172337426923378
              ],
              feather: 0.0026041666666666665
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp": {
            hueDegrees: -4.114932885906114,
            saturationScale: 0.6159725971922244,
            brightnessScale: 0.9448979591836735
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp": {
            hueDegrees: 6.340194313841702,
            saturationScale: 0.9999999999999968,
            brightnessScale: 0.8957653067671145,
            valueGamma: 0.9500990476406066,
            rgbScale: [1.0154051686851842, 0.9992551312126245, 0.9855626639694447]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp": {
            hueDegrees: -4.114932885906114,
            saturationScale: 0.6159725971922244,
            brightnessScale: 0.9448979591836735
          }
        }
      }
    },
    MANA_PRINTING_TARGETS: {
      "m21-black-W": [0.984313725490196, 0.9764705882352941, 0.8549019607843137],
      "m21-black-U": [0.7450980392156863, 0.8666666666666667, 0.9764705882352941],
      "m21-black-R": [0.9294117647058824, 0.6470588235294118, 0.49411764705882355],
      "m21-black-G": [0.6549019607843137, 0.8, 0.6745098039215687]
    },
    printingBlackPoints: {
      m21: [
        {
          set: "m21",
          stock: "#16130e",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp",
              adjustment: '{"frame":{"hueDegrees":17.337752059074205,"saturationScale":0.7776986444212719,"brightnessScale":0.9675141242937855},"paper":{"hueDegrees":8.888888888888914,"saturationScale":0.6314814814814816,"brightnessScale":0.967741935483871},"mask":{"kind":"rect","rect":[0.032440800650188735,0.6662377838116825,0.9396578084020479,0.3172337426923378],"feather":0.0026041666666666665}}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp",
              adjustment: '{"hueDegrees":17.337752059074205,"saturationScale":0.7776986444212719,"brightnessScale":0.9675141242937855}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp",
              adjustment: '{"hueDegrees":8.888888888888914,"saturationScale":0.6314814814814816,"brightnessScale":0.967741935483871}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp",
              adjustment: '{"hueDegrees":17.337752059074205,"saturationScale":0.7776986444212719,"brightnessScale":0.9675141242937855}',
              lift: null
            }
          ]
        },
        {
          set: "m21",
          stock: "#16130e",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp",
              adjustment: '{"frame":{"hueDegrees":10.298505477140054,"saturationScale":0.9250450145969191,"brightnessScale":0.8881656804733729},"paper":{"hueDegrees":-4.114932885906114,"saturationScale":0.6159725971922244,"brightnessScale":0.9448979591836735},"mask":{"kind":"rect","rect":[0.032440800650188735,0.6662377838116825,0.9396578084020479,0.3172337426923378],"feather":0.0026041666666666665}}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp",
              adjustment: '{"hueDegrees":10.298505477140054,"saturationScale":0.9250450145969191,"brightnessScale":0.8881656804733729}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp",
              adjustment: '{"hueDegrees":-4.114932885906114,"saturationScale":0.6159725971922244,"brightnessScale":0.9448979591836735}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp",
              adjustment: '{"hueDegrees":10.298505477140054,"saturationScale":0.9250450145969191,"brightnessScale":0.8881656804733729}',
              lift: null
            }
          ]
        },
        {
          set: "m21",
          stock: "#16130e",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":0.35,"brightnessScale":0.9580706521739131},"mask":{"kind":"rect","rect":[0.032440800650188735,0.6662377838116825,0.9396578084020479,0.3172337426923378],"feather":0.0026041666666666665}}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp",
              adjustment: '{"hueDegrees":0,"saturationScale":0.35,"brightnessScale":0.9580706521739131}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1}',
              lift: null
            }
          ]
        },
        {
          set: "m21",
          stock: "#16130e",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp",
              adjustment: '{"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":37.25414989939645,"saturationScale":0.7848398354730142,"brightnessScale":0.9923161361141603},"mask":{"kind":"rect","rect":[0.032440800650188735,0.6662377838116825,0.9396578084020479,0.3172337426923378],"feather":0.0026041666666666665}}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp",
              adjustment: '{"hueDegrees":37.25414989939645,"saturationScale":0.7848398354730142,"brightnessScale":0.9923161361141603}',
              lift: null
            },
            {
              url: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1}',
              lift: null
            }
          ]
        }
      ]
    },
    printingStocks: {
      m21: [
        {
          set: "m21",
          prefix: "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/",
          geometry: "[0.04858,0.03937,0.90284,0.88864]",
          stock: "#16130e",
          family: "components"
        }
      ]
    }
  }
});
e({
  set: "mbs",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "mbs/eighth/black": [1, -0.5, 1.06, 1.04] } }
});
e({
  set: "mh1",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "mh1/component/black": [0, 0, 0.92, 0.94] } }
});
e({
  set: "mh2",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "mh2-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -5.12371526456036,
            saturationScale: 0.7905520188605681,
            brightnessScale: 0.9741573033707864
          },
          paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 1.0356352459016396 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "mh2-black-W": [0.9843137254901959, 0.9725490196078431, 0.8999999999999999]
    },
    MAJOR_SYMBOL_PROFILES: {
      "mh2/component/black": [1, -1, 0.96, 0.94],
      "mh2/m15-accurate/black": [0.5, 0, 1.04, 1.06]
    },
    printingBlackPoints: {
      mh2: [
        {
          set: "mh2",
          stock: "#16130e",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-5.12371526456036,"saturationScale":0.7905520188605681,"brightnessScale":0.9741573033707864},"paper":{"hueDegrees":0,"saturationScale":0.35,"brightnessScale":1.0356352459016396},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      mh2: [
        {
          set: "mh2",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#16130e",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "mh3",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "mh3-black-C": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/c.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 0, saturationScale: 1.3783333333333334, brightnessScale: 1 },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.9614659685863863,
            brightnessScale: 0.9979166666666666
          },
          mask: {
            kind: "rect",
            rect: [0.10860655737704918, 0.5985294117647059, 0.7868852459016393, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "mh3-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -5.728282493368738,
            saturationScale: 0.8035133376707874,
            brightnessScale: 0.9298245614035087
          },
          paper: {
            hueDegrees: -0.8894878706198597,
            saturationScale: 1.07695026062373,
            brightnessScale: 1.0043478260869565
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
      "mh3-black-W": [0.996078431372549, 0.9725490196078431, 0.8549019607843137],
      "mh3-black-U": [0.7098039215686275, 0.8745098039215684, 0.9647058823529412],
      "mh3-black-R": [0.9607843137254901, 0.6745098039215689, 0.5529411764705883],
      "mh3-black-B": [0.8132107843137254, 0.7823282841363888, 0.7514457839590519]
    },
    RETRO_MANA_PROFILES: { "mh3/black": [436.5, 46, 25.5, 23.4] }
  }
});
e({
  set: "mid",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "mid/m15-accurate/black": [-1.5, 1, 1.1, 1.08] } }
});
e({
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
});
e({
  set: "mkc",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "mkc/m15-accurate/black": [-3, 0, 1.04, 1.14] } }
});
e({
  set: "mkm",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "mkm/m15-accurate/black": [-1.5, 0, 1.1, 1.1] } }
});
e({
  set: "mm3",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "mm3/m15-accurate/black": [2, 1, 0.88, 1.08] } }
});
e({
  set: "mma",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "mma/eighth/black": [1.5, 0, 0.94, 0.96] } }
});
e({
  set: "mmq",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "mmq-black-N": [0.7071323529411764, 0.6796084513322656, 0.6520845497233546],
      "mmq-black-G": [0.6098039215686275, 0.7058823529411764, 0.5784313725490196]
    },
    MAJOR_SYMBOL_PROFILES: { "mmq/retro/black": [0, -1, 1, 1.02] }
  }
});
e({
  set: "moc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "moc/component/black": [-1, -2, 0.96, 0.96],
      "moc/m15-accurate/black": [-1, -1.5, 1.08, 1.08]
    }
  }
});
e({
  set: "mom",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "mom/component/black": [0.5, -2, 0.92, 0.92] } }
});
e({
  set: "msc",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "msc/component/black": [-3.5, -1, 0.9, 0.88] } }
});
e({
  set: "msh",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "msh/component/black": [-5.5, -1.5, 0.92, 0.88],
      "msh/m15-accurate/black": [-6, -1, 0.92, 0.96]
    }
  }
});
e({
  set: "ncc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "ncc/component/black": [-4, -2, 0.96, 0.92],
      "ncc/m15-accurate/black": [-4, -1, 1.08, 1.08]
    }
  }
});
e({
  set: "nec",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "nec/m15-accurate/black": [-1, 0.5, 1.1, 1.12] } }
});
e({
  set: "nem",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "nem-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.289738430583384,
            saturationScale: 0.8915652681436504,
            brightnessScale: 0.8235955056179776
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.5422222222222192,
            brightnessScale: 0.9221311475409836
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
      "nem-black-N": [0.7646666666666668, 0.7369052030713278, 0.7091437394759885],
      "nem-black-W": [0.8980392156862745, 0.8823529411764705, 0.788235294117647]
    },
    MAJOR_SYMBOL_PROFILES: { "nem/retro/black": [2, -2.5, 1.12, 1.26] },
    printingBlackPoints: {
      nem: [
        {
          set: "nem",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-4.289738430583384,"saturationScale":0.8915652681436504,"brightnessScale":0.8235955056179776},"paper":{"hueDegrees":0,"saturationScale":0.5422222222222192,"brightnessScale":0.9221311475409836},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      nem: [
        {
          set: "nem",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#181510",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "neo",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "neo/m15-accurate/black": [2, -1, 0.88, 0.86] } }
});
e({
  set: "nph",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "nph/eighth/black": [-1, 0.5, 1.08, 1] } }
});
e({
  set: "ody",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "ody-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.730436724826404,
            saturationScale: 1.1895774647887327,
            brightnessScale: 0.7999999999999999
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 1.197101034858387,
            brightnessScale: 0.9361987704918033
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
      "ody-black-W": [0.8862745098039215, 0.8705882352941177, 0.7294117647058824],
      "ody-black-N": [0.696735294117647, 0.6665549286546302, 0.6363745631916132]
    },
    RETRO_MANA_PROFILES: { "ody/black": [438.5, 44, 27, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "ody/retro/black": [1.5, -2, 1.14, 1.06] },
    printingBlackPoints: {
      ody: [
        {
          set: "ody",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-4.730436724826404,"saturationScale":1.1895774647887327,"brightnessScale":0.7999999999999999},"paper":{"hueDegrees":0,"saturationScale":1.197101034858387,"brightnessScale":0.9361987704918033},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      ody: [
        {
          set: "ody",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#181510",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "ogw",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "ogw/component/black": [-3.5, -0.5, 0.92, 0.86],
      "ogw/m15-accurate/black": [-4, 0, 1, 1.06]
    }
  }
});
e({
  set: "one",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "one/component/black": [1, -1.5, 0.98, 0.96] } }
});
e({
  set: "ons",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "ons-black-W": [0.9627450980392157, 0.9549019607843137, 0.7843137254901961]
    },
    MAJOR_SYMBOL_PROFILES: { "ons/retro/black": [5, -2.5, 1.2, 1.14] }
  }
});
e({
  set: "ori",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "ori/component/black": [0, -1, 0.8, 0.78],
      "ori/m15-accurate/black": [0, 0.5, 0.9, 0.9]
    }
  }
});
e({
  set: "otc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "otc/component/black": [2, -1.5, 0.96, 1.02],
      "otc/m15-accurate/black": [2, -0.5, 1.12, 1.18]
    }
  }
});
e({
  set: "otj",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "otj/component/black": [2.5, -2, 0.98, 0.96],
      "otj/m15-accurate/black": [3, -1, 1.1, 1.12]
    }
  }
});
e({
  set: "p02",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "p02-black-N": [0.7077843137254901, 0.6771253397398564, 0.6464663657542224],
      "p02-black-W": [0.8745098039215686, 0.8509803921568627, 0.7176470588235294],
      "p02-black-R": [0.8313725490196079, 0.5872549019607844, 0.4745098039215686],
      "p02-black-G": [0.5705882352941176, 0.7098039215686275, 0.5725490196078433]
    }
  }
});
e({
  set: "pc2",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "pc2/eighth/black": [3.5, 0.5, 1, 0.98] } }
});
e({
  set: "pcy",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "pcy-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -4.633564096443024,
            saturationScale: 1.0799672453324602,
            brightnessScale: 0.7730337078651686
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.859911894273126,
            brightnessScale: 0.9303278688524589
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "pcy-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 17.807077308120142,
            saturationScale: 0.3893356835959018,
            brightnessScale: 0.9152046783625731
          },
          paper: {
            hueDegrees: -7.681547619047592,
            saturationScale: 0.7065816326530612,
            brightnessScale: 0.782608695652174
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
      "pcy-black-W": [0.9098039215686274, 0.8901960784313723, 0.7725490196078432],
      "pcy-black-G": [0.5362745098039216, 0.6901960784313725, 0.5999999999999999]
    },
    MAJOR_SYMBOL_PROFILES: { "pcy/retro/black": [2.5, -2, 1.26, 1.2] },
    printingBlackPoints: {
      pcy: [
        {
          set: "pcy",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-4.633564096443024,"saturationScale":1.0799672453324602,"brightnessScale":0.7730337078651686},"paper":{"hueDegrees":0,"saturationScale":0.859911894273126,"brightnessScale":0.9303278688524589},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        },
        {
          set: "pcy",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":17.807077308120142,"saturationScale":0.3893356835959018,"brightnessScale":0.9152046783625731},"paper":{"hueDegrees":-7.681547619047592,"saturationScale":0.7065816326530612,"brightnessScale":0.782608695652174},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      pcy: [
        {
          set: "pcy",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#181510",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "plc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: { "plc/eighth/black": [2.5, 0.5, 1.02, 1] },
    PLANAR_COLORS: {
      "ordinary/W": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png",
        frame: {
          hueDegrees: -6.491752199413554,
          saturationScale: 0.8110599078341005,
          brightnessScale: 0.875
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8951612903225806, 0.8852459016393442, 0.9201680672268907]
        },
        title: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8694331983805668, 0.8615702479338844, 0.8975188781014024]
        },
        type: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.875, 0.8630705394190872, 0.8886486486486487]
        }
      },
      "colorshifted/W": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/w.png",
        frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.9392523364485981, 0.9720812182741116, 0.9715909090909091]
        },
        title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
        type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }
      },
      "ordinary/U": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png",
        frame: {
          hueDegrees: 18.3125,
          saturationScale: 0.8049999999999997,
          brightnessScale: 0.9475
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.891304347826087, 0.8851063829787235, 0.9170124481327802]
        },
        title: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.903896103896104, 0.8686987104337631, 0.9136771300448431]
        },
        type: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8897435897435898, 0.8779342723004694, 0.9079685746352413]
        }
      },
      "colorshifted/U": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/u.png",
        frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.9784946236559141, 0.9901477832512315, 1.036697247706422]
        },
        title: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [1.1098901098901097, 1.0403225806451613, 1.128980891719745]
        },
        type: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [1.10989010989011, 1.0423387096774193, 1.1353503184713374]
        }
      },
      "ordinary/B": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png",
        frame: { hueDegrees: -2.75, saturationScale: 0.9825000000000002, brightnessScale: 1 },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.865546218487395, 0.8620689655172413, 0.8951965065502183]
        },
        title: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8559782608695653, 0.8110014104372356, 0.8306801736613603]
        },
        type: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8600508905852416, 0.8215223097112861, 0.8409703504043128]
        }
      },
      "colorshifted/B": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/b.png",
        frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [1.0509554140127388, 1.0723684210526314, 1.1143790849673203]
        },
        title: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.7767857142857142, 0.724609375, 0.741869918699187]
        },
        type: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.7732142857142856, 0.736328125, 0.7439024390243902]
        }
      },
      "ordinary/R": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png",
        frame: {
          hueDegrees: 4.1875,
          saturationScale: 1.0318749999999994,
          brightnessScale: 0.9150000000000003
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8938775510204081, 0.8893805309734514, 0.9065420560747663]
        },
        title: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8801652892561984, 0.8810679611650486, 0.8488210818307905]
        },
        type: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8780991735537191, 0.8691931540342297, 0.8393351800554018]
        }
      },
      "colorshifted/R": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/r.png",
        frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [1, 1.0657894736842104, 1.0162601626016259]
        },
        title: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
        type: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }
      },
      "ordinary/G": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",
        frame: {
          hueDegrees: -39.28098739495795,
          saturationScale: 1.0733997252747252,
          brightnessScale: 0.86328125
        },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8818181818181817, 0.8641304347826086, 0.9011494252873564]
        },
        title: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8756281407035176, 0.85, 0.8712121212121212]
        },
        type: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8844221105527638, 0.8489892984542211, 0.8731155778894473]
        }
      },
      "ordinary/M": {
        source: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
        frame: { hueDegrees: 2, saturationScale: 1.159999999999999, brightnessScale: 0.8725 },
        paper: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8582995951417004, 0.8613445378151261, 0.9415887850467289]
        },
        title: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8467741935483871, 0.8443579766536965, 0.734375]
        },
        type: {
          hueDegrees: 0,
          saturationScale: 1,
          brightnessScale: 1,
          rgbScale: [0.8541176470588236, 0.8469656992084432, 0.7004048582995952]
        }
      }
    },
    PLANAR_TEXTURE: {
      w: {
        knots: [
          [0, [0, 0, 0]],
          [12, [0, 0, 0]],
          [32, [6.182, 2.078, 0.038]],
          [64, [10.55, 4.709, 0.394]],
          [96, [10.127, 8.149, 1.096]],
          [144, [5.738, 10.743, -0.342]],
          [192, [-2.815, 2.441, -6.136]],
          [224, [-30.89, -20.679, -19.871]],
          [255, [0, 0, 0]]
        ],
        bevel: { amount: 0.461, backdrop: [187.48, 173.69, 141.36] }
      },
      u: {
        knots: [
          [0, [0, 0, 0]],
          [12, [0, 0, 0]],
          [32, [1.348, 3.445, 15.714]],
          [64, [0.86, 5.817, 26.489]],
          [96, [-3.585, 5.085, 24.238]],
          [144, [-9.056, 2.729, 16.683]],
          [192, [-11.185, 0.527, 11.077]],
          [224, [-7.967, -6.873, 5.173]],
          [255, [0, 0, 0]]
        ],
        bevel: { amount: 0.948, backdrop: [133.71, 169.72, 207.83] }
      },
      b: {
        knots: [
          [0, [0, 0, 0]],
          [12, [0, 0, 0]],
          [24, [-3.259, -2.267, -5.909]],
          [40, [8.13, 17.832, 9.257]],
          [64, [-14.985, -4.116, -10.65]],
          [96, [-32.142, -27.216, -30.387]],
          [144, [-17.679, -19.615, -20.463]],
          [192, [-2.331, -8.79, -8.678]],
          [224, [3.963, -2.587, -2.344]],
          [255, [0, 0, 0]]
        ],
        bevel: { amount: 0.737, backdrop: [23.03, 30.4, 33.46] }
      },
      r: { knots: [], bevel: { amount: 0.192, backdrop: [134.83, 60.81, 41.86] } },
      g: { knots: [], bevel: { amount: 0.431, backdrop: [80.64, 99.97, 65.14] } }
    },
    printingBlackPoints: {
      plc: [
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png",
              adjustment: '{"frame":{"hueDegrees":-6.491752199413554,"saturationScale":0.8110599078341005,"brightnessScale":0.875},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8951612903225806,0.8852459016393442,0.9201680672268907]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8694331983805668,0.8615702479338844,0.8975188781014024]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.875,0.8630705394190872,0.8886486486486487]}}]}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/w.png",
              adjustment: '{"blackPoint":{"lift":[0.08627450980392157,0.09411764705882353,0.07058823529411765],"transition":0.3764705882352941,"textureMaskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png","texture":[[0,[0,0,0]],[0.047058823529411764,[0,0,0]],[0.12549019607843137,[0.024243137254901962,0.008149019607843137,0.00014901960784313725]],[0.25098039215686274,[0.041372549019607845,0.018466666666666666,0.0015450980392156864]],[0.3764705882352941,[0.03971372549019608,0.031956862745098034,0.004298039215686274]],[0.5647058823529412,[0.022501960784313726,0.04212941176470588,-0.0013411764705882354]],[0.7529411764705882,[-0.01103921568627451,0.009572549019607843,-0.024062745098039216]],[0.8784313725490196,[-0.12113725490196078,-0.08109411764705882,-0.07792549019607843]],[1,[0,0,0]]]},"blend":{"maskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png","outerMaskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png","outset":0.014344262295081968,"backdrop":[0.7352156862745097,0.6811372549019608,0.5543529411764706],"amount":0.461},"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9392523364485981,0.9720812182741116,0.9715909090909091]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1}}]}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png",
              adjustment: '{"frame":{"hueDegrees":18.3125,"saturationScale":0.8049999999999997,"brightnessScale":0.9475},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.891304347826087,0.8851063829787235,0.9170124481327802]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.903896103896104,0.8686987104337631,0.9136771300448431]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8897435897435898,0.8779342723004694,0.9079685746352413]}}]}',
              lift: [20.5, 27.5, 34.5]
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/u.png",
              adjustment: '{"blackPoint":{"lift":[0.08235294117647059,0.09803921568627451,0.12156862745098039],"transition":0.3764705882352941,"textureMaskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png","texture":[[0,[0,0,0]],[0.047058823529411764,[0,0,0]],[0.12549019607843137,[0.005286274509803922,0.013509803921568626,0.06162352941176471]],[0.25098039215686274,[0.003372549019607843,0.022811764705882354,0.10387843137254903]],[0.3764705882352941,[-0.014058823529411764,0.019941176470588236,0.09505098039215686]],[0.5647058823529412,[-0.035513725490196074,0.010701960784313725,0.0654235294117647]],[0.7529411764705882,[-0.04386274509803922,0.0020666666666666667,0.04343921568627451]],[0.8784313725490196,[-0.031243137254901958,-0.02695294117647059,0.02028627450980392]],[1,[0,0,0]]]},"blend":{"maskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png","outerMaskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png","outset":0.014344262295081968,"backdrop":[0.5243529411764706,0.6655686274509803,0.8150196078431373],"amount":0.948},"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.9784946236559141,0.9901477832512315,1.036697247706422]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.1098901098901097,1.0403225806451613,1.128980891719745]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.10989010989011,1.0423387096774193,1.1353503184713374]}}]}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png",
              adjustment: '{"frame":{"hueDegrees":-2.75,"saturationScale":0.9825000000000002,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.865546218487395,0.8620689655172413,0.8951965065502183]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8559782608695653,0.8110014104372356,0.8306801736613603]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8600508905852416,0.8215223097112861,0.8409703504043128]}}]}',
              lift: [8.5, 13.5, 22]
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/b.png",
              adjustment: '{"blackPoint":{"lift":[0.011764705882352941,0.027450980392156862,0.054901960784313725],"transition":0.3764705882352941,"textureMaskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png","texture":[[0,[0,0,0]],[0.047058823529411764,[0,0,0]],[0.09411764705882353,[-0.012780392156862745,-0.008890196078431372,-0.023172549019607844]],[0.1568627450980392,[0.03188235294117647,0.06992941176470588,0.036301960784313726]],[0.25098039215686274,[-0.05876470588235294,-0.016141176470588235,-0.04176470588235294]],[0.3764705882352941,[-0.12604705882352943,-0.10672941176470589,-0.11916470588235294]],[0.5647058823529412,[-0.06932941176470588,-0.07692156862745098,-0.08024705882352942]],[0.7529411764705882,[-0.009141176470588236,-0.034470588235294114,-0.03403137254901961]],[0.8784313725490196,[0.015541176470588235,-0.010145098039215686,-0.009192156862745098]],[1,[0,0,0]]]},"blend":{"maskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png","outerMaskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png","outset":0.014344262295081968,"backdrop":[0.09031372549019609,0.1192156862745098,0.1312156862745098],"amount":0.737},"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1.0509554140127388,1.0723684210526314,1.1143790849673203]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.7767857142857142,0.724609375,0.741869918699187]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.7732142857142856,0.736328125,0.7439024390243902]}}]}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png",
              adjustment: '{"frame":{"hueDegrees":4.1875,"saturationScale":1.0318749999999994,"brightnessScale":0.9150000000000003},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8938775510204081,0.8893805309734514,0.9065420560747663]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8801652892561984,0.8810679611650486,0.8488210818307905]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8780991735537191,0.8691931540342297,0.8393351800554018]}}]}',
              lift: [34, 27, 29.5]
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/r.png",
              adjustment: '{"blackPoint":{"lift":[0.12156862745098039,0.09803921568627451,0.09411764705882353],"transition":0.3764705882352941},"blend":{"maskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png","outerMaskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png","outset":0.014344262295081968,"backdrop":[0.5287450980392158,0.23847058823529413,0.16415686274509803],"amount":0.192},"frame":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[1,1.0657894736842104,1.0162601626016259]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1}}]}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",
              adjustment: '{"frame":{"hueDegrees":-39.28098739495795,"saturationScale":1.0733997252747252,"brightnessScale":0.86328125},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8818181818181817,0.8641304347826086,0.9011494252873564]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27205882352941174],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8756281407035176,0.85,0.8712121212121212]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8844221105527638,0.8489892984542211,0.8731155778894473]}}]}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/colorshifted/g.png",
              adjustment: '{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"blackPoint":{"lift":[0.06274509803921569,0.07058823529411765,0.08235294117647059],"transition":0.3764705882352941},"blend":{"maskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/pinline.png","outerMaskSource":"https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/frame.png","outset":0.014344262295081968,"backdrop":[0.31623529411764706,0.3920392156862745,0.25545098039215686],"amount":0.431}}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
              adjustment: '{"frame":{"hueDegrees":2,"saturationScale":1.159999999999999,"brightnessScale":0.8725},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8467741935483871,0.8443579766536965,0.734375]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png",
              adjustment: '{"hueDegrees":4.1875,"saturationScale":1.0318749999999994,"brightnessScale":0.9150000000000003}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png",
              adjustment: '{"hueDegrees":-6.491752199413554,"saturationScale":0.8110599078341005,"brightnessScale":0.875}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
              adjustment: '{"frame":{"hueDegrees":2,"saturationScale":1.159999999999999,"brightnessScale":0.8725},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8467741935483871,0.8443579766536965,0.734375]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png",
              adjustment: '{"hueDegrees":-2.75,"saturationScale":0.9825000000000002,"brightnessScale":1}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",
              adjustment: '{"hueDegrees":-39.28098739495795,"saturationScale":1.0733997252747252,"brightnessScale":0.86328125}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
              adjustment: '{"frame":{"hueDegrees":2,"saturationScale":1.159999999999999,"brightnessScale":0.8725},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8467741935483871,0.8443579766536965,0.734375]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",
              adjustment: '{"hueDegrees":-39.28098739495795,"saturationScale":1.0733997252747252,"brightnessScale":0.86328125}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png",
              adjustment: '{"hueDegrees":18.3125,"saturationScale":0.8049999999999997,"brightnessScale":0.9475}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
              adjustment: '{"frame":{"hueDegrees":2,"saturationScale":1.159999999999999,"brightnessScale":0.8725},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8467741935483871,0.8443579766536965,0.734375]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/u.png",
              adjustment: '{"hueDegrees":18.3125,"saturationScale":0.8049999999999997,"brightnessScale":0.9475}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png",
              adjustment: '{"hueDegrees":4.1875,"saturationScale":1.0318749999999994,"brightnessScale":0.9150000000000003}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
              adjustment: '{"frame":{"hueDegrees":2,"saturationScale":1.159999999999999,"brightnessScale":0.8725},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8467741935483871,0.8443579766536965,0.734375]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
              adjustment: '{"frame":{"hueDegrees":2,"saturationScale":1.159999999999999,"brightnessScale":0.8725},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8467741935483871,0.8443579766536965,0.734375]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/w.png",
              adjustment: '{"hueDegrees":-6.491752199413554,"saturationScale":0.8110599078341005,"brightnessScale":0.875}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/b.png",
              adjustment: '{"hueDegrees":-2.75,"saturationScale":0.9825000000000002,"brightnessScale":1}',
              lift: null
            }
          ]
        },
        {
          set: "plc",
          stock: "#181510",
          materials: [
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/m.png",
              adjustment: '{"frame":{"hueDegrees":2,"saturationScale":1.159999999999999,"brightnessScale":0.8725},"paper":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8582995951417004,0.8613445378151261,0.9415887850467289]},"mask":{"kind":"rect","rect":[0.08401639344262295,0.625,0.8299180327868853,0.27941176470588236],"feather":0.0015368852459016393},"regions":[{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.060294117647058824],[0.9118852459016393,0.060294117647058824],[0.9200819672131147,0.07058823529411765],[0.9221311475409836,0.08529411764705883],[0.9139344262295082,0.10588235294117647],[0.0860655737704918,0.10588235294117647],[0.0778688524590164,0.09411764705882353],[0.07581967213114754,0.07941176470588235],[0.07991803278688525,0.06764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8467741935483871,0.8443579766536965,0.734375]}},{"mask":{"kind":"polygon","points":[[0.08811475409836066,0.5705882352941176],[0.9118852459016393,0.5705882352941176],[0.9200819672131147,0.5808823529411765],[0.9221311475409836,0.5911764705882353],[0.9139344262295082,0.6088235294117647],[0.0860655737704918,0.6088235294117647],[0.0778688524590164,0.5985294117647059],[0.07581967213114754,0.586764705882353],[0.07991803278688525,0.5764705882352941]],"feather":0.0015368852459016393},"adjustment":{"hueDegrees":0,"saturationScale":1,"brightnessScale":1,"rgbScale":[0.8541176470588236,0.8469656992084432,0.7004048582995952]}}]}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/r.png",
              adjustment: '{"hueDegrees":4.1875,"saturationScale":1.0318749999999994,"brightnessScale":0.9150000000000003}',
              lift: null
            },
            {
              url: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/8th/g.png",
              adjustment: '{"hueDegrees":-39.28098739495795,"saturationScale":1.0733997252747252,"brightnessScale":0.86328125}',
              lift: null
            }
          ]
        }
      ]
    }
  }
});
e({
  set: "pls",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "pls-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -7.13672588968916,
            saturationScale: 1.1802209231170504,
            brightnessScale: 0.7887640449438202
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.7511403508771918,
            brightnessScale: 0.9313012295081968
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: { "pls-black-W": [0.9, 0.880392156862745, 0.7607843137254902] },
    printingBlackPoints: {
      pls: [
        {
          set: "pls",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-7.13672588968916,"saturationScale":1.1802209231170504,"brightnessScale":0.7887640449438202},"paper":{"hueDegrees":0,"saturationScale":0.7511403508771918,"brightnessScale":0.9313012295081968},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      pls: [
        {
          set: "pls",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#181510",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "por",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "por-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 33.79094827586209,
            saturationScale: 0.4635736808609119,
            brightnessScale: 0.8713450292397661
          },
          paper: {
            hueDegrees: -6.285714285714221,
            saturationScale: 0.7974474662746454,
            brightnessScale: 0.7695652173913043
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
      "por-black-N": [0.7000196078431372, 0.6772464841423832, 0.6544733604416291],
      "por-black-W": [0.8980392156862745, 0.8862745098039213, 0.75],
      "por-black-R": [0.8549019607843137, 0.5921568627450975, 0.49019607843137253]
    },
    RETRO_MANA_PROFILES: { "por/black": [438.5, 44.5, 26.5, 23.4] }
  }
});
e({
  set: "ptk",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "ptk-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.8566071428571431, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -9.407859606185411,
            saturationScale: 1.1858096941603267,
            brightnessScale: 0.952991452991453
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
      "ptk-white-N": [0.7037843137254901, 0.6732986070665891, 0.6428129004076878],
      "ptk-white-W": [0.907843137254902, 0.8784313725490197, 0.7098039215686275],
      "ptk-white-B": [0.6922156862745099, 0.6622310959037083, 0.6322465055329064],
      "ptk-white-R": [0.8490196078431372, 0.5666666666666665, 0.42745098039215684]
    },
    RETRO_MANA_PROFILES: { "ptk/white": [439, 43, 26.5, 23.4] },
    printingBlackPoints: {
      ptk: [
        {
          set: "ptk",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
              adjustment: '{"frame":{"hueDegrees":60,"saturationScale":0.8566071428571431,"brightnessScale":1.4},"paper":{"hueDegrees":-9.407859606185411,"saturationScale":1.1858096941603267,"brightnessScale":0.952991452991453},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.08627450980392157,0.06274509803921569,0.06274509803921569],"paperRgb":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}',
              lift: [14, 17.5, 7.5]
            }
          ]
        }
      ]
    }
  }
});
e({
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
});
e({
  set: "rtr",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "rtr/eighth/black": [2.5, 0, 1.1, 1.02] } }
});
e({
  set: "rvr",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "rvr-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -5.432334166885994,
            saturationScale: 0.8071559831369582,
            brightnessScale: 0.9327485380116958
          },
          paper: {
            hueDegrees: -0.8894878706198597,
            saturationScale: 1.07695026062373,
            brightnessScale: 1.0043478260869565
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
      },
      "rvr-black-A": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/a.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -1.3874016938898421,
            saturationScale: 0.9385034153567606,
            brightnessScale: 1.0527638190954773
          },
          paper: { hueDegrees: 0, saturationScale: 1.75, brightnessScale: 0.9644727366255146 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "rvr-black-W": [1, 0.976470588235294, 0.8470588235294118],
      "rvr-black-U": [0.7098039215686275, 0.8784313725490198, 0.9764705882352941],
      "rvr-black-B": [0.8111911764705881, 0.7810601428272423, 0.7509291091838963],
      "rvr-black-R": [0.9686274509803922, 0.6745098039215688, 0.5568627450980392]
    },
    RETRO_MANA_PROFILES: { "rvr/black": [436.5, 46, 25.5, 23.4] },
    MAJOR_SYMBOL_PROFILES: {
      "rvr/component/black": [-2.5, -1, 0.96, 0.9],
      "rvr/m15-accurate/black": [-2.5, -1.5, 1.06, 1.08]
    }
  }
});
e({
  set: "s99",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "s99-white-B": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: { hueDegrees: 60, saturationScale: 0.35, brightnessScale: 1.4 },
          paper: {
            hueDegrees: -15.019828155981486,
            saturationScale: 0.8201216369446448,
            brightnessScale: 0.9316239316239316
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
      "s99-white-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 42.145378655608965,
            saturationScale: 0.4593960416241585,
            brightnessScale: 0.9883040935672514
          },
          paper: {
            hueDegrees: -10.47813001605141,
            saturationScale: 0.5791702507449261,
            brightnessScale: 0.7891304347826087
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
      "s99-white-N": [0.7151519607843138, 0.7015578851410496, 0.6879638094977854],
      "s99-white-W": [0.8901960784313725, 0.8862745098039215, 0.7803921568627451],
      "s99-white-B": [0.6936225490196078, 0.6876134427781013, 0.6816043365365948],
      "s99-white-R": [0.8333333333333334, 0.5960784313725492, 0.5411764705882353]
    },
    RETRO_MANA_PROFILES: { "s99/white": [439, 43, 26.5, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "s99/retro/white": [2, -1, 1.24, 1.24] },
    printingBlackPoints: {
      s99: [
        {
          set: "s99",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/b.png",
              adjustment: '{"frame":{"hueDegrees":60,"saturationScale":0.35,"brightnessScale":1.4},"paper":{"hueDegrees":-15.019828155981486,"saturationScale":0.8201216369446448,"brightnessScale":0.9316239316239316},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.08627450980392157,0.06274509803921569,0.06274509803921569],"paperRgb":[0.9176470588235294,0.7843137254901961,0.5686274509803921]}}',
              lift: [21.5, 27.5, 16.5]
            }
          ]
        },
        {
          set: "s99",
          stock: null,
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":42.145378655608965,"saturationScale":0.4593960416241585,"brightnessScale":0.9883040935672514},"paper":{"hueDegrees":-10.47813001605141,"saturationScale":0.5791702507449261,"brightnessScale":0.7891304347826087},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: [31.5, 17.5, 7.5]
            }
          ]
        }
      ]
    }
  }
});
e({
  set: "scd",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "scd/component/black": [1.5, -2, 1.04, 0.88],
      "scd/m15-accurate/black": [1, 0.5, 1.1, 1.12]
    }
  }
});
e({
  set: "scg",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "scg-black-W": [0.9222549019607845, 0.9106216656928856, 0.7140037950664139]
    }
  }
});
e({
  set: "shm",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "shm/eighth/black": [5, 0, 0.9, 0.92] } }
});
e({
  set: "sld",
  kind: "calibration",
  tables: {
    RETRO_MANA_PROFILES: { "sld/black": [436.5, 46.5, 26, 23.4] },
    MAJOR_SYMBOL_PROFILES: {
      "sld/component/black": [-2, -0.5, 1.14, 1.18],
      "sld/m15-accurate/black": [-2.5, 0.5, 1.1, 1.12]
    }
  }
});
e({
  set: "snc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "snc/component/black": [1, -1, 0.88, 0.84],
      "snc/m15-accurate/black": [1.5, -0.5, 1, 1.02]
    },
    MAJOR_FRAME_INSETS: { "snc/black": 1 }
  }
});
e({
  set: "soc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: { "soc/component/black": [1.5, -1, 0.96, 0.94] },
    MAJOR_FRAME_INSETS: { "soc/black": 1 }
  }
});
e({
  set: "soi",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "soi/component/black": [-1.5, -1, 0.94, 0.96],
      "soi/m15-accurate/black": [-2, 0, 1.06, 1.04]
    }
  }
});
e({
  set: "sok",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "sok/eighth/black": [2, 0.5, 1, 0.94] } }
});
e({
  set: "som",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "som/eighth/black": [1, 0.5, 1.08, 1] } }
});
e({
  set: "sos",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "sos/component/black": [1.5, -1, 0.96, 0.94],
      "sos/m15-accurate/black": [1, 0, 1.06, 1]
    }
  }
});
e({
  set: "spm",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "spm/component/black": [1.5, -1, 0.94, 0.96],
      "spm/m15-accurate/black": [0.5, 0, 1.02, 1.1]
    }
  }
});
e({
  set: "sth",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "sth-black-W": [0.9039215686274511, 0.9176470588235294, 0.7411764705882353],
      "sth-black-G": [0.5843137254901961, 0.7294117647058823, 0.5941176470588235]
    }
  }
});
e({
  set: "stx",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "stx/component/black": [0, -1, 1, 1],
      "stx/m15-accurate/black": [0, 1, 1.1, 1.1]
    }
  }
});
e({
  set: "sum",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "sum-white-N": [0.9117450980392157, 0.9034513771597749, 0.895157656280334],
      "sum-white-W": [0.9411764705882353, 0.9529411764705882, 0.8803921568627451],
      "sum-white-G": [0.8607843137254901, 0.9313725490196079, 0.8254901960784313]
    },
    RETRO_MANA_PROFILES: { "sum/white": [434.5, 44.5, 26.5, 23.4] }
  }
});
e({
  set: "ths",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "ths/eighth/black": [2.5, 0.5, 0.98, 0.96] } }
});
e({
  set: "tla",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "tla/component/black": [-1.5, -1.5, 0.9, 0.94],
      "tla/m15-accurate/black": [-1.5, -0.5, 1.02, 1.1]
    },
    MAJOR_FRAME_INSETS: { "tla/black": 1 }
  }
});
e({
  set: "tle",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "tle/m15-accurate/black": [-3.5, 0, 1.08, 1.12] } }
});
e({
  set: "tmc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "tmc/component/black": [0, -1, 0.94, 0.94],
      "tmc/m15-accurate/black": [0, 0.5, 1.04, 1.1]
    }
  }
});
e({
  set: "tmp",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "tmp-black-R": [0.8568627450980392, 0.5725490196078433, 0.4588235294117647]
    }
  }
});
e({
  set: "tmt",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "tmt/component/black": [0, -1, 0.94, 0.94],
      "tmt/m15-accurate/black": [0, 0.5, 1.06, 1.08]
    },
    MAJOR_FRAME_INSETS: { "tmt/black": 1 }
  }
});
e({
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
});
e({
  set: "tsb",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "tsb-black-W": [0.925, 0.9161764705882351, 0.759313725490196],
      "tsb-black-U": [0.6666666666666665, 0.7960784313725485, 0.9411764705882351],
      "tsb-black-R": [0.8568627450980392, 0.6137254901960782, 0.4980392156862745]
    },
    RETRO_MANA_PROFILES: { "tsb/black": [438.5, 46, 26.5, 23.4] }
  }
});
e({
  set: "tsr",
  kind: "calibration",
  tables: {
    DUAL_MANA_TARGETS: {
      "tsr-black-W": [0.9927647058823531, 0.9899625474383303, 0.9479301707779888],
      "tsr-black-N": [0.855279411764706, 0.8478698129004079, 0.8404602140361096]
    },
    RETRO_MANA_PROFILES: { "tsr/black": [437.5, 46.5, 26, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "tsr/retro/black": [3.5, 0, 1.06, 1.16] }
  }
});
e({
  set: "uds",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "uds-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 2.465900667160895,
            saturationScale: 1.6933264866979658,
            brightnessScale: 0.8089887640449439
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 1.0263953488372048,
            brightnessScale: 0.8798975409836065
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
      "uds-black-N": [0.7138774509803922, 0.6829545415938655, 0.6520316322073385],
      "uds-black-W": [0.8549019607843137, 0.8509803921568626, 0.696078431372549]
    },
    RETRO_MANA_PROFILES: { "uds/black": [439, 44, 26, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "uds/retro/black": [0, 0, 1.2, 1.14] },
    printingBlackPoints: {
      uds: [
        {
          set: "uds",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":2.465900667160895,"saturationScale":1.6933264866979658,"brightnessScale":0.8089887640449439},"paper":{"hueDegrees":0,"saturationScale":1.0263953488372048,"brightnessScale":0.8798975409836065},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      uds: [
        {
          set: "uds",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#181510",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "ulg",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "ulg-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 6.196897147214486,
            saturationScale: 1.44966853763682,
            brightnessScale: 0.7764044943820225
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.9164319248826271,
            brightnessScale: 0.8729508196721312
          },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      },
      "ulg-black-G": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 27.774922634836457,
            saturationScale: 0.6514603887857772,
            brightnessScale: 1.0321637426900583
          },
          paper: {
            hueDegrees: -4.285714285714221,
            saturationScale: 0.9254331447604949,
            brightnessScale: 0.8391304347826086
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
      "ulg-black-W": [0.8666666666666667, 0.8588235294117645, 0.6901960784313725],
      "ulg-black-N": [0.7232156862745098, 0.69188827412153, 0.6605608619685499]
    },
    RETRO_MANA_PROFILES: { "ulg/black": [438.5, 44, 26.5, 23.4] },
    MAJOR_SYMBOL_PROFILES: { "ulg/retro/black": [2.5, -1, 1.14, 1.12] },
    printingBlackPoints: {
      ulg: [
        {
          set: "ulg",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":6.196897147214486,"saturationScale":1.44966853763682,"brightnessScale":0.7764044943820225},"paper":{"hueDegrees":0,"saturationScale":0.9164319248826271,"brightnessScale":0.8729508196721312},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        },
        {
          set: "ulg",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/g.png",
              adjustment: '{"frame":{"hueDegrees":27.774922634836457,"saturationScale":0.6514603887857772,"brightnessScale":1.0321637426900583},"paper":{"hueDegrees":-4.285714285714221,"saturationScale":0.9254331447604949,"brightnessScale":0.8391304347826086},"mask":{"kind":"chroma","bounds":[0.09221311475409837,0.5823529411764706,0.8176229508196722,0.3176470588235294],"seed":[0.5,0.7352941176470589],"frameRgb":[0.2588235294117647,0.33529411764705885,0.1647058823529412],"paperRgb":[0.9019607843137255,0.7372549019607844,0.5176470588235295]}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      ulg: [
        {
          set: "ulg",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#181510",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "uma",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "uma/m15-accurate/black": [3, 1, 0.98, 1] } }
});
e({
  set: "unf",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "unf/component/black": [6, -2, 0.92, 0.88],
      "unf/m15-accurate/black": [5.5, -2, 0.92, 1]
    }
  }
});
e({
  set: "usg",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "usg-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: -0.41717349551845473,
            saturationScale: 1.663864073081557,
            brightnessScale: 0.7617977528089888
          },
          paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.8950409836065574 },
          mask: {
            kind: "rect",
            rect: [0.10655737704918032, 0.5985294117647059, 0.7889344262295082, 0.2867647058823529],
            feather: 0.0013333333333333333
          }
        }
      }
    },
    DUAL_MANA_TARGETS: {
      "usg-black-N": [0.692735294117647, 0.6627281959813629, 0.6327210978450786],
      "usg-black-W": [0.8765490196078433, 0.8599897089339418, 0.678618595825427]
    },
    RETRO_MANA_PROFILES: { "usg/black": [438.5, 44, 26.5, 23.4] },
    printingBlackPoints: {
      usg: [
        {
          set: "usg",
          stock: "#181510",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":-0.41717349551845473,"saturationScale":1.663864073081557,"brightnessScale":0.7617977528089888},"paper":{"hueDegrees":0,"saturationScale":0.35,"brightnessScale":0.8950409836065574},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      usg: [
        {
          set: "usg",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#181510",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "vis",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "vis-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 2.7191901408450576,
            saturationScale: 1.5913694945918608,
            brightnessScale: 0.8134831460674158
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.7390216244725715,
            brightnessScale: 0.953186475409836
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
      "vis-black-N": [0.7397941176470588, 0.7077485803727434, 0.6757030430984275],
      "vis-black-W": [0.9215686274509803, 0.8980392156862743, 0.7313725490196078]
    },
    MAJOR_SYMBOL_PROFILES: { "vis/retro/black": [3, 1, 1.28, 1.24] },
    printingBlackPoints: {
      vis: [
        {
          set: "vis",
          stock: "#17140f",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":2.7191901408450576,"saturationScale":1.5913694945918608,"brightnessScale":0.8134831460674158},"paper":{"hueDegrees":0,"saturationScale":0.7390216244725715,"brightnessScale":0.953186475409836},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      vis: [
        {
          set: "vis",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#17140f",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "voc",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "voc/component/black": [-7, -1.5, 0.96, 0.88] } }
});
e({
  set: "vow",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "vow/component/black": [0.5, -1, 0.96, 0.96],
      "vow/m15-accurate/black": [1, 0, 1.1, 1.1]
    }
  }
});
e({
  set: "war",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "war/component/black": [0.5, -1.5, 0.92, 0.9],
      "war/m15-accurate/black": [2, -1, 1.08, 1.08]
    }
  }
});
e({
  set: "woc",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "woc/component/black": [-0.5, -1, 1, 1.04],
      "woc/m15-accurate/black": [-1, -0.5, 1.12, 1.12]
    }
  }
});
e({
  set: "woe",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "woe/component/black": [2.5, -1, 0.96, 0.96] } }
});
e({
  set: "wth",
  kind: "calibration",
  tables: {
    DUAL_HSB_PROFILES: {
      "wth-black-W": {
        asset: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
        rect: [0, 0, 1, 1],
        adjustment: {
          frame: {
            hueDegrees: 0.7816901408450576,
            saturationScale: 1.7463796482863188,
            brightnessScale: 0.7932584269662921
          },
          paper: {
            hueDegrees: 0,
            saturationScale: 0.6375529661016933,
            brightnessScale: 0.9490881147540983
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
      "wth-black-N": [0.7210588235294119, 0.6898248398369251, 0.6585908561444381],
      "wth-black-W": [0.9147058823529411, 0.8980392156862745, 0.7196078431372549]
    },
    printingBlackPoints: {
      wth: [
        {
          set: "wth",
          stock: "#17140f",
          materials: [
            {
              url: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/w.png",
              adjustment: '{"frame":{"hueDegrees":0.7816901408450576,"saturationScale":1.7463796482863188,"brightnessScale":0.7932584269662921},"paper":{"hueDegrees":0,"saturationScale":0.6375529661016933,"brightnessScale":0.9490881147540983},"mask":{"kind":"rect","rect":[0.10655737704918032,0.5985294117647059,0.7889344262295082,0.2867647058823529],"feather":0.0013333333333333333}}',
              lift: null,
              bakedStock: !0,
              stockMask: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/border.svg"
            }
          ]
        }
      ]
    },
    printingStocks: {
      wth: [
        {
          set: "wth",
          prefix: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/seventh/regular/",
          geometry: "[0,0,1,1]",
          stock: "#17140f",
          family: "retro"
        }
      ]
    }
  }
});
e({
  set: "wwk",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "wwk/eighth/black": [1, 0, 1.08, 1.12] } }
});
e({
  set: "xln",
  kind: "calibration",
  tables: {
    MAJOR_SYMBOL_PROFILES: {
      "xln/component/black": [3, -0.5, 1, 1.08],
      "xln/m15-accurate/black": [4, 0, 1.22, 1.24]
    }
  }
});
e({
  set: "zen",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "zen/eighth/black": [1.5, 0, 1.02, 1] } }
});
e({
  set: "znr",
  kind: "calibration",
  tables: { MAJOR_SYMBOL_PROFILES: { "znr/m15-accurate/black": [0, 1, 1.02, 1.06] } }
});
