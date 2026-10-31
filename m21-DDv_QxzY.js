const e = {
  set: "m21",
  kind: "calibration",
  tables: {
    MODERN_PRINTING_PROFILES: {
      m21: {
        revision: 16,
        pairedLegendaryCrowns: !0,
        printedFrameColors: {
          246: { name: "Fabled Passage", colors: ["W", "U", "B", "R", "G"] }
        },
        headingFont: "beleren-2016",
        typeText: {
          plate: { dx: -1.25, dy: 0.5, size: 1.025, width: 0.985 },
          components: { dx: -0.75, dy: 0.25, size: 1, width: 1.01 },
          walker: { dx: -0.75, dy: 1.5, size: 1, width: 1 }
        },
        mana: {
          normal: {
            scaleX: 0.9806534292503055,
            scaleY: 0.9806534292503055,
            spacing: 0.6925319771602734,
            dx: -0.15624999999999944,
            dy: -0.25,
            numberScale: 0.99225,
            numberDx: -0.253125,
            numberDy: 0.3186650764469375,
            glyphs: {
              W: { scale: 0.9625, dx: -0.06373301528938749, dy: 0.3186650764469375 },
              U: { scale: 0.9625, dx: -0.1911990458681625, dy: 0.1911990458681625 },
              B: { scale: 1.0125, dx: -0.25493206115754996, dy: 0.44613110702571246 },
              G: { scale: 1.00625, dx: -0.1911990458681625, dy: -0.25493206115754996 }
            }
          },
          walker: {
            scaleX: 0.9786570394547676,
            scaleY: 0.9786570394547676,
            spacing: 0.5511328861851883,
            dx: -0.5000000000000006,
            dy: -0.6875,
            numberScale: 0.99225,
            numberDx: -0.253125,
            numberDy: 0.3186650764469375,
            glyphs: {
              W: { scale: 0.9625, dx: -0.06373301528938749, dy: 0.3186650764469375 },
              U: { scale: 0.9625, dx: -0.1911990458681625, dy: 0.1911990458681625 },
              B: { scale: 1.0125, dx: -0.25493206115754996, dy: 0.44613110702571246 },
              G: { scale: 1.00625, dx: -0.1911990458681625, dy: -0.25493206115754996 }
            }
          },
          shadow: [-0.8460009541318374, 2.3558650764469373],
          paperTargets: {
            W: [251, 249, 218],
            N: [206, 195, 195],
            U: [190, 220, 249],
            B: [202, 193, 192],
            R: [242, 170, 134],
            G: [168, 205, 175]
          }
        },
        planeswalkers: {
          deckCollectorNumbers: ["320", "324", "328", "332", "336"],
          frameRepaint: { Colourless: 0.7 },
          loyalty: {
            starting: { dx: 0, dy: 0, size: 1.04, width: 1.015, fractionalMetrics: !0 },
            cost: {
              dx: 1.75,
              dy: 1.75,
              size: 1.03,
              width: 1.045,
              font: "beleren-2016",
              fractionalMetrics: !0
            },
            wideCost: {
              dx: 1,
              dy: -0.25,
              size: 1.03,
              width: 1.075,
              font: "beleren-2016",
              fractionalMetrics: !0
            }
          },
          colon: { dx: 1.5, dy: -1, size: 0.9625, width: 1.1, fractionalMetrics: !0 },
          badges: { dx: -0.75, dy: 0.5, width: 1.105, height: 1.03 },
          staticText: {
            dx: -1,
            dy: 1,
            width: -2,
            size: 0,
            leading: 0.97,
            textWidth: 1.02,
            fractionalMetrics: !0
          },
          paperColors: {
            Colourless: "#eaebf1f0",
            W: "#f2e5d4f0",
            U: "#dfdfe2f0",
            B: "#d8d2e3f0",
            R: "#e0d0ccf0",
            G: "#d8dbdef0"
          },
          rules: {
            regular: { size: -0.5, dx: 1, dy: -1, width: -1, height: 0.5, leading: 1 },
            tall: { size: 0, dx: -0.5, dy: 3, width: 0, height: 0, leading: 0.94 }
          }
        },
        componentMaterials: {
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/Colourless.webp": {
            mask: { kind: "rect", rect: [0, 0.5, 1, 0.5], feather: 1e-3 },
            frame: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [1.045, 1.045, 1]
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [1.005, 1.0350000000000001, 1.025]
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/Colourless.webp": {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            valueGamma: 1,
            rgbScale: [0.985, 1.025, 0.995]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/W.webp": {
            mask: { kind: "rect", rect: [0, 0.5, 1, 0.5], feather: 1e-3 },
            frame: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [0.98, 0.98, 1.02]
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [0.9650000000000001, 0.9450000000000001, 0.985]
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/W.webp": {
            hueDegrees: 0,
            saturationScale: 1,
            brightnessScale: 1,
            valueGamma: 1,
            rgbScale: [0.935, 0.9500000000000001, 0.9600000000000001]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/U.webp": {
            mask: { kind: "rect", rect: [0, 0.5, 1, 0.5], feather: 1e-3 },
            frame: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [0.975, 0.935, 0.965]
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [1.1350000000000002, 0.975, 1.025]
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_large_frames/U.webp": { hueDegrees: 10, saturationScale: 1, brightnessScale: 1.04, valueGamma: 1 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/U.webp": { hueDegrees: 10, saturationScale: 1, brightnessScale: 1.04, valueGamma: 1 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/B.webp": {
            mask: { kind: "rect", rect: [0, 0.5, 1, 0.5], feather: 1e-3 },
            frame: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [1.04, 1.0350000000000001, 1.065]
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [1.08, 1.085, 1.125]
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/B.webp": {
            hueDegrees: 6,
            saturationScale: 1.2800000000000002,
            brightnessScale: 0.8400000000000001,
            valueGamma: 1
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/R.webp": {
            mask: { kind: "rect", rect: [0, 0.5, 1, 0.5], feather: 1e-3 },
            frame: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [0.9400000000000001, 1.105, 1.1150000000000002]
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [0.935, 1.12, 1.1600000000000001]
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/R.webp": {
            hueDegrees: 9,
            saturationScale: 0.9450000000000001,
            brightnessScale: 0.91,
            valueGamma: 1
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_boxes/G.webp": {
            mask: { kind: "rect", rect: [0, 0.5, 1, 0.5], feather: 1e-3 },
            frame: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [1.0899999999999999, 1, 1.0150000000000001]
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              valueGamma: 1,
              rgbScale: [1.105, 1.0150000000000001, 1.0300000000000002]
            }
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/planeswalker_frames/G.webp": {
            hueDegrees: 12,
            saturationScale: 0.7699999999999999,
            brightnessScale: 0.8200000000000001,
            valueGamma: 1
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/W.webp": {
            frame: {
              hueDegrees: 0.6378968253967514,
              saturationScale: 0.6209134298880844,
              brightnessScale: 1.0069605568445477
            },
            paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9656377551020409 },
            mask: {
              kind: "rect",
              rect: [
                0.032440800650188735,
                0.6662377838116825,
                0.9396578084020479,
                0.3172337426923378
              ],
              feather: 0.0026041666666666665
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/W.webp": {
            hueDegrees: 0.6378968253967514,
            saturationScale: 0.6209134298880844,
            brightnessScale: 1.0069605568445477
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/W.webp": {
            hueDegrees: 0,
            saturationScale: 0.35,
            brightnessScale: 0.9564583333333333,
            rgbScale: [1.0087050281703482, 0.9954258331518188, 1.010210687484271]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/W.webp": {
            hueDegrees: 0,
            saturationScale: 0.35,
            brightnessScale: 0.9564583333333333,
            rgbScale: [1.0087050281703482, 0.9954258331518188, 1.010210687484271]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/W.webp": {
            hueDegrees: 0.6378968253967514,
            saturationScale: 0.6209134298880844,
            brightnessScale: 1.0069605568445477
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/U.webp": {
            frame: {
              hueDegrees: 17.337752059074205,
              saturationScale: 0.7776986444212719,
              brightnessScale: 0.9675141242937855
            },
            paper: {
              hueDegrees: 15.555555555555657,
              saturationScale: 0.6946778711484594,
              brightnessScale: 0.9596774193548387
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/U.webp": {
            hueDegrees: 17.337752059074205,
            saturationScale: 0.7776986444212719,
            brightnessScale: 0.9675141242937855
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/U.webp": {
            hueDegrees: 18.69736945994316,
            saturationScale: 0.6932272608223894,
            brightnessScale: 0.9912472647702406
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/U.webp": {
            hueDegrees: 18.69736945994316,
            saturationScale: 0.6932272608223894,
            brightnessScale: 0.9912472647702406
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/U.webp": {
            hueDegrees: 17.337752059074205,
            saturationScale: 0.7776986444212719,
            brightnessScale: 0.9675141242937855
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/B.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.4176785714285711,
              brightnessScale: 0.9532483905579399
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/B.webp": { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/B.webp": {
            hueDegrees: 0,
            saturationScale: 0.48300308641975337,
            brightnessScale: 0.9778622715404701,
            rgbScale: [0.9986708030585714, 0.9992425123313436, 1.0101574866289742]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/B.webp": {
            hueDegrees: 0,
            saturationScale: 0.48300308641975337,
            brightnessScale: 0.9778622715404701,
            rgbScale: [0.9986708030585714, 0.9992425123313436, 1.0101574866289742]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/B.webp": { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/R.webp": {
            frame: {
              hueDegrees: 7.211691199830511,
              saturationScale: 0.9374657003333075,
              brightnessScale: 0.9440389294403893
            },
            paper: {
              hueDegrees: -6.944852941176578,
              saturationScale: 0.5536446341140663,
              brightnessScale: 0.9346938775510204
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/R.webp": {
            hueDegrees: 7.211691199830511,
            saturationScale: 0.9374657003333075,
            brightnessScale: 0.9440389294403893
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/R.webp": {
            hueDegrees: 7.270348837209326,
            saturationScale: 0.6173654558551144,
            brightnessScale: 0.8998583499005963
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/R.webp": {
            hueDegrees: 7.270348837209326,
            saturationScale: 0.6173654558551144,
            brightnessScale: 0.8998583499005963
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/R.webp": {
            hueDegrees: 7.211691199830511,
            saturationScale: 0.9374657003333075,
            brightnessScale: 0.9440389294403893
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/G.webp": {
            frame: {
              hueDegrees: -6.936866623079368,
              saturationScale: 0.6975477653254121,
              brightnessScale: 0.8288288288288288
            },
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/G.webp": {
            hueDegrees: -6.936866623079368,
            saturationScale: 0.6975477653254121,
            brightnessScale: 0.8288288288288288
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/G.webp": {
            hueDegrees: 0,
            saturationScale: 0.36788117828773154,
            brightnessScale: 0.9710731132075472
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/G.webp": {
            hueDegrees: 0,
            saturationScale: 0.36788117828773154,
            brightnessScale: 0.9710731132075472
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/G.webp": {
            hueDegrees: -6.936866623079368,
            saturationScale: 0.6975477653254121,
            brightnessScale: 0.8288288288288288
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/WR.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Gold.webp": { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Gold.webp": {
            hueDegrees: 6.568557268722543,
            saturationScale: 0.813947241214344,
            brightnessScale: 1.0375586854460095,
            rgbScale: [0.9999999999999999, 1.0001450411571138, 1.0000772804852658]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Gold.webp": {
            hueDegrees: 6.568557268722543,
            saturationScale: 0.813947241214344,
            brightnessScale: 1.0375586854460095,
            rgbScale: [0.9999999999999999, 1.0001450411571138, 1.0000772804852658]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/WG.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/BR.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/UR.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/WB.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/RG.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/UG.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/WU.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Gold.webp": { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/UB.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Gold.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/BG.webp": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.6274999999999998,
              brightnessScale: 0.9687339743589743
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/frames/Artifact.webp": {
            frame: {
              hueDegrees: 24.79404784967062,
              saturationScale: 0.6309266353903175,
              brightnessScale: 1.0380434782608696
            },
            paper: {
              hueDegrees: 40.29166666666674,
              saturationScale: 0.840833333333332,
              brightnessScale: 1
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
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/bg/Artifact.webp": {
            hueDegrees: 24.79404784967062,
            saturationScale: 0.6309266353903175,
            brightnessScale: 1.0380434782608696
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/boxes/Artifact.webp": {
            hueDegrees: 0,
            saturationScale: 0.5000000000000001,
            brightnessScale: 1.01397465437788,
            rgbScale: [1.0148731880325077, 0.9908264401467457, 1.0271209934895984]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/pt_boxes/Artifact.webp": {
            hueDegrees: 0,
            saturationScale: 0.5000000000000001,
            brightnessScale: 1.01397465437788,
            rgbScale: [1.0148731880325077, 0.9908264401467457, 1.0271209934895984]
          },
          "https://cdn.jsdelivr.net/gh/wingedsheep/mtg-card-renderer@b52888cda57a99b5b7dd47bc4fdfae47383a93f9/app/src/main/resources/static/card-rendering/assets/img/legendary_crowns/Artifact.webp": {
            hueDegrees: 24.79404784967062,
            saturationScale: 0.6309266353903175,
            brightnessScale: 1.0380434782608696
          }
        },
        ordinaryPlates: {
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/w.png": {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9609146341463415 },
            mask: {
              kind: "polygon",
              points: [
                [0.073134, 0.6258],
                [0.073134, 0.92253],
                [0.926866, 0.92253],
                [0.922388, 0.918266],
                [0.922388, 0.629353],
                [0.078109, 0.629353]
              ],
              feather: 0.0020491803278688526
            },
            regions: [
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.062189, 0.066453],
                    [0.067662, 0.065743],
                    [0.066667, 0.070718],
                    [0.067662, 0.086354],
                    [0.073134, 0.09666],
                    [0.076119, 0.099502],
                    [0.924378, 0.099502],
                    [0.927363, 0.100569],
                    [0.927363, 0.103056],
                    [0.931343, 0.099502],
                    [0.935821, 0.093106],
                    [0.938308, 0.087065],
                    [0.939801, 0.078891],
                    [0.939303, 0.069652],
                    [0.937313, 0.062544],
                    [0.933333, 0.055792],
                    [0.926866, 0.049751],
                    [0.073134, 0.049751],
                    [0.065672, 0.05828]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0,
                  saturationScale: 0.35,
                  brightnessScale: 0.9609146341463415
                }
              },
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.064677, 0.575338],
                    [0.065174, 0.576404],
                    [0.066667, 0.577114],
                    [0.067662, 0.576759],
                    [0.068657, 0.577825],
                    [0.066667, 0.587065],
                    [0.067662, 0.600213],
                    [0.071642, 0.609097],
                    [0.076617, 0.614428],
                    [0.924378, 0.614428],
                    [0.926866, 0.613717],
                    [0.929851, 0.615849],
                    [0.936816, 0.605899],
                    [0.939801, 0.593461],
                    [0.939303, 0.584577],
                    [0.937811, 0.578891],
                    [0.933333, 0.570718],
                    [0.926866, 0.564677],
                    [0.073134, 0.564677],
                    [0.068657, 0.568941]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0,
                  saturationScale: 0.35,
                  brightnessScale: 0.9609146341463415
                }
              }
            ],
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
            outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
          },
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/u.png": {
            frame: {
              hueDegrees: 8.268635681240198,
              saturationScale: 1.0570810706851301,
              brightnessScale: 0.9560439560439561
            },
            paper: {
              hueDegrees: 13.083333333333371,
              saturationScale: 0.7768749999999998,
              brightnessScale: 0.975609756097561
            },
            mask: {
              kind: "polygon",
              points: [
                [0.073134, 0.6258],
                [0.073134, 0.92253],
                [0.926866, 0.92253],
                [0.922388, 0.918266],
                [0.922388, 0.629353],
                [0.078109, 0.629353]
              ],
              feather: 0.0020491803278688526
            },
            regions: [
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.062189, 0.066453],
                    [0.067662, 0.065743],
                    [0.066667, 0.070718],
                    [0.067662, 0.086354],
                    [0.073134, 0.09666],
                    [0.076119, 0.099502],
                    [0.924378, 0.099502],
                    [0.927363, 0.100569],
                    [0.927363, 0.103056],
                    [0.931343, 0.099502],
                    [0.935821, 0.093106],
                    [0.938308, 0.087065],
                    [0.939801, 0.078891],
                    [0.939303, 0.069652],
                    [0.937313, 0.062544],
                    [0.933333, 0.055792],
                    [0.926866, 0.049751],
                    [0.073134, 0.049751],
                    [0.065672, 0.05828]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 7.285714285714334,
                  saturationScale: 1.1378881987577634,
                  brightnessScale: 1.0043668122270741
                }
              },
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.064677, 0.575338],
                    [0.065174, 0.576404],
                    [0.066667, 0.577114],
                    [0.067662, 0.576759],
                    [0.068657, 0.577825],
                    [0.066667, 0.587065],
                    [0.067662, 0.600213],
                    [0.071642, 0.609097],
                    [0.076617, 0.614428],
                    [0.924378, 0.614428],
                    [0.926866, 0.613717],
                    [0.929851, 0.615849],
                    [0.936816, 0.605899],
                    [0.939801, 0.593461],
                    [0.939303, 0.584577],
                    [0.937811, 0.578891],
                    [0.933333, 0.570718],
                    [0.926866, 0.564677],
                    [0.073134, 0.564677],
                    [0.068657, 0.568941]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 10.035714285714334,
                  saturationScale: 1.1066995614035082,
                  brightnessScale: 0.9956331877729258
                }
              }
            ],
            blackPoint: {
              lift: [0.040196078431372545, 0.012254901960784314, 0.013725490196078431],
              transition: 0.2
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
            outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
          },
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/b.png": {
            frame: {
              hueDegrees: -38.63749999999999,
              saturationScale: 1.75,
              brightnessScale: 0.7369556451612903
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.7074017467248992,
              brightnessScale: 0.9717574786324786
            },
            mask: {
              kind: "polygon",
              points: [
                [0.073134, 0.6258],
                [0.073134, 0.92253],
                [0.926866, 0.92253],
                [0.922388, 0.918266],
                [0.922388, 0.629353],
                [0.078109, 0.629353]
              ],
              feather: 0.0020491803278688526
            },
            regions: [
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.062189, 0.066453],
                    [0.067662, 0.065743],
                    [0.066667, 0.070718],
                    [0.067662, 0.086354],
                    [0.073134, 0.09666],
                    [0.076119, 0.099502],
                    [0.924378, 0.099502],
                    [0.927363, 0.100569],
                    [0.927363, 0.103056],
                    [0.931343, 0.099502],
                    [0.935821, 0.093106],
                    [0.938308, 0.087065],
                    [0.939801, 0.078891],
                    [0.939303, 0.069652],
                    [0.937313, 0.062544],
                    [0.933333, 0.055792],
                    [0.926866, 0.049751],
                    [0.073134, 0.049751],
                    [0.065672, 0.05828]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0,
                  saturationScale: 0.819803664921467,
                  brightnessScale: 1.0482005494505493
                }
              },
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.064677, 0.575338],
                    [0.065174, 0.576404],
                    [0.066667, 0.577114],
                    [0.067662, 0.576759],
                    [0.068657, 0.577825],
                    [0.066667, 0.587065],
                    [0.067662, 0.600213],
                    [0.071642, 0.609097],
                    [0.076617, 0.614428],
                    [0.924378, 0.614428],
                    [0.926866, 0.613717],
                    [0.929851, 0.615849],
                    [0.936816, 0.605899],
                    [0.939801, 0.593461],
                    [0.939303, 0.584577],
                    [0.937811, 0.578891],
                    [0.933333, 0.570718],
                    [0.926866, 0.564677],
                    [0.073134, 0.564677],
                    [0.068657, 0.568941]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0,
                  saturationScale: 0.8097225908534104,
                  brightnessScale: 1.020742238033635
                }
              }
            ],
            blackPoint: {
              lift: [0.01715686274509804, 0.01911764705882353, 0.02303921568627451],
              transition: 0.2
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
            outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
          },
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/r.png": {
            frame: {
              hueDegrees: -2.6488549618320576,
              saturationScale: 1.1999999998800002,
              brightnessScale: 1.0148863636363636
            },
            paper: {
              hueDegrees: -4.900181488203316,
              saturationScale: 0.6862366230677764,
              brightnessScale: 0.9547325102880659
            },
            mask: {
              kind: "polygon",
              points: [
                [0.073134, 0.6258],
                [0.073134, 0.92253],
                [0.926866, 0.92253],
                [0.922388, 0.918266],
                [0.922388, 0.629353],
                [0.078109, 0.629353]
              ],
              feather: 0.0020491803278688526
            },
            regions: [
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.062189, 0.066453],
                    [0.067662, 0.065743],
                    [0.066667, 0.070718],
                    [0.067662, 0.086354],
                    [0.073134, 0.09666],
                    [0.076119, 0.099502],
                    [0.924378, 0.099502],
                    [0.927363, 0.100569],
                    [0.927363, 0.103056],
                    [0.931343, 0.099502],
                    [0.935821, 0.093106],
                    [0.938308, 0.087065],
                    [0.939801, 0.078891],
                    [0.939303, 0.069652],
                    [0.937313, 0.062544],
                    [0.933333, 0.055792],
                    [0.926866, 0.049751],
                    [0.073134, 0.049751],
                    [0.065672, 0.05828]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0.5634386733416932,
                  saturationScale: 0.9203659505388228,
                  brightnessScale: 0.9540962924819774
                }
              },
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.064677, 0.575338],
                    [0.065174, 0.576404],
                    [0.066667, 0.577114],
                    [0.067662, 0.576759],
                    [0.068657, 0.577825],
                    [0.066667, 0.587065],
                    [0.067662, 0.600213],
                    [0.071642, 0.609097],
                    [0.076617, 0.614428],
                    [0.924378, 0.614428],
                    [0.926866, 0.613717],
                    [0.929851, 0.615849],
                    [0.936816, 0.605899],
                    [0.939801, 0.593461],
                    [0.939303, 0.584577],
                    [0.937811, 0.578891],
                    [0.933333, 0.570718],
                    [0.926866, 0.564677],
                    [0.073134, 0.564677],
                    [0.068657, 0.568941]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0.4878048780487916,
                  saturationScale: 0.9053980370774268,
                  brightnessScale: 0.9434156378600824
                }
              }
            ],
            blackPoint: {
              lift: [0.03725490196078431, 0.02892156862745098, 0.01764705882352941],
              transition: 0.2
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
            outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
          },
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/g.png": {
            frame: {
              hueDegrees: -0.9715909090908781,
              saturationScale: 1.0265866209262438,
              brightnessScale: 0.9298245614035088
            },
            paper: { hueDegrees: 0, saturationScale: 0.35, brightnessScale: 0.9619405021834062 },
            mask: {
              kind: "polygon",
              points: [
                [0.073134, 0.6258],
                [0.073134, 0.92253],
                [0.926866, 0.92253],
                [0.922388, 0.918266],
                [0.922388, 0.629353],
                [0.078109, 0.629353]
              ],
              feather: 0.0020491803278688526
            },
            regions: [
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.062189, 0.066453],
                    [0.067662, 0.065743],
                    [0.066667, 0.070718],
                    [0.067662, 0.086354],
                    [0.073134, 0.09666],
                    [0.076119, 0.099502],
                    [0.924378, 0.099502],
                    [0.927363, 0.100569],
                    [0.927363, 0.103056],
                    [0.931343, 0.099502],
                    [0.935821, 0.093106],
                    [0.938308, 0.087065],
                    [0.939801, 0.078891],
                    [0.939303, 0.069652],
                    [0.937313, 0.062544],
                    [0.933333, 0.055792],
                    [0.926866, 0.049751],
                    [0.073134, 0.049751],
                    [0.065672, 0.05828]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0,
                  saturationScale: 0.4889114832535894,
                  brightnessScale: 1.0023076923076923
                }
              },
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.064677, 0.575338],
                    [0.065174, 0.576404],
                    [0.066667, 0.577114],
                    [0.067662, 0.576759],
                    [0.068657, 0.577825],
                    [0.066667, 0.587065],
                    [0.067662, 0.600213],
                    [0.071642, 0.609097],
                    [0.076617, 0.614428],
                    [0.924378, 0.614428],
                    [0.926866, 0.613717],
                    [0.929851, 0.615849],
                    [0.936816, 0.605899],
                    [0.939801, 0.593461],
                    [0.939303, 0.584577],
                    [0.937811, 0.578891],
                    [0.933333, 0.570718],
                    [0.926866, 0.564677],
                    [0.073134, 0.564677],
                    [0.068657, 0.568941]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0,
                  saturationScale: 0.4641826923076912,
                  brightnessScale: 0.9975
                }
              }
            ],
            blackPoint: {
              lift: [0.027941176470588233, 0.01666666666666667, 0.02009803921568628],
              transition: 0.2
            },
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
            outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
          },
          "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/a.png": {
            frame: {
              hueDegrees: 18.260869565217376,
              saturationScale: 1.1304347826086951,
              brightnessScale: 1
            },
            paper: {
              hueDegrees: 0,
              saturationScale: 1.4812278761061959,
              brightnessScale: 0.9925694444444445
            },
            mask: {
              kind: "polygon",
              points: [
                [0.073134, 0.6258],
                [0.073134, 0.92253],
                [0.926866, 0.92253],
                [0.922388, 0.918266],
                [0.922388, 0.629353],
                [0.078109, 0.629353]
              ],
              feather: 0.0020491803278688526
            },
            regions: [
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.062189, 0.066453],
                    [0.067662, 0.065743],
                    [0.066667, 0.070718],
                    [0.067662, 0.086354],
                    [0.073134, 0.09666],
                    [0.076119, 0.099502],
                    [0.924378, 0.099502],
                    [0.927363, 0.100569],
                    [0.927363, 0.103056],
                    [0.931343, 0.099502],
                    [0.935821, 0.093106],
                    [0.938308, 0.087065],
                    [0.939801, 0.078891],
                    [0.939303, 0.069652],
                    [0.937313, 0.062544],
                    [0.933333, 0.055792],
                    [0.926866, 0.049751],
                    [0.073134, 0.049751],
                    [0.065672, 0.05828]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0,
                  saturationScale: 1.5287962962962949,
                  brightnessScale: 1.003968609865471
                }
              },
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.064677, 0.575338],
                    [0.065174, 0.576404],
                    [0.066667, 0.577114],
                    [0.067662, 0.576759],
                    [0.068657, 0.577825],
                    [0.066667, 0.587065],
                    [0.067662, 0.600213],
                    [0.071642, 0.609097],
                    [0.076617, 0.614428],
                    [0.924378, 0.614428],
                    [0.926866, 0.613717],
                    [0.929851, 0.615849],
                    [0.936816, 0.605899],
                    [0.939801, 0.593461],
                    [0.939303, 0.584577],
                    [0.937811, 0.578891],
                    [0.933333, 0.570718],
                    [0.926866, 0.564677],
                    [0.073134, 0.564677],
                    [0.068657, 0.568941]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }
              }
            ],
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
            outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
          }
        },
        artifactPapers: {
          W: {
            paper: {
              hueDegrees: 0,
              saturationScale: 1.4812278761061959,
              brightnessScale: 0.9925694444444445,
              rgbScale: [1.1305128680255774, 1.0646706102070989, 1.0451914251740428]
            },
            name: {
              hueDegrees: 0,
              saturationScale: 1.5287962962962949,
              brightnessScale: 1.003968609865471,
              rgbScale: [1.138633176857892, 1.0707862209845116, 1.0363354855712215]
            },
            type: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              rgbScale: [1.1067306170354465, 1.055220615311302, 1.026105908692965]
            }
          },
          B: {
            paper: {
              hueDegrees: 0,
              saturationScale: 1.4812278761061959,
              brightnessScale: 0.9925694444444445,
              rgbScale: [1.0873378143806982, 1.0207975854633058, 1.0275917516011772]
            },
            name: {
              hueDegrees: 0,
              saturationScale: 1.5287962962962949,
              brightnessScale: 1.003968609865471,
              rgbScale: [0.9138411159544915, 0.8404220713912476, 0.8360781270217386]
            },
            type: {
              hueDegrees: 0,
              saturationScale: 1,
              brightnessScale: 1,
              rgbScale: [0.9416658868928647, 0.8875437044911334, 0.8895199001363299]
            }
          }
        },
        landPlates: {
          root: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new",
          materials: {
            "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/lm.png": {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              paper: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              mask: {
                kind: "polygon",
                points: [
                  [0.073134, 0.6258],
                  [0.073134, 0.92253],
                  [0.926866, 0.92253],
                  [0.922388, 0.918266],
                  [0.922388, 0.629353],
                  [0.078109, 0.629353]
                ],
                feather: 0.0020491803278688526
              },
              regions: [
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.062189, 0.066453],
                      [0.067662, 0.065743],
                      [0.066667, 0.070718],
                      [0.067662, 0.086354],
                      [0.073134, 0.09666],
                      [0.076119, 0.099502],
                      [0.924378, 0.099502],
                      [0.927363, 0.100569],
                      [0.927363, 0.103056],
                      [0.931343, 0.099502],
                      [0.935821, 0.093106],
                      [0.938308, 0.087065],
                      [0.939801, 0.078891],
                      [0.939303, 0.069652],
                      [0.937313, 0.062544],
                      [0.933333, 0.055792],
                      [0.926866, 0.049751],
                      [0.073134, 0.049751],
                      [0.065672, 0.05828]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }
                },
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.064677, 0.575338],
                      [0.065174, 0.576404],
                      [0.066667, 0.577114],
                      [0.067662, 0.576759],
                      [0.068657, 0.577825],
                      [0.066667, 0.587065],
                      [0.067662, 0.600213],
                      [0.071642, 0.609097],
                      [0.076617, 0.614428],
                      [0.924378, 0.614428],
                      [0.926866, 0.613717],
                      [0.929851, 0.615849],
                      [0.936816, 0.605899],
                      [0.939801, 0.593461],
                      [0.939303, 0.584577],
                      [0.937811, 0.578891],
                      [0.933333, 0.570718],
                      [0.926866, 0.564677],
                      [0.073134, 0.564677],
                      [0.068657, 0.568941]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }
                }
              ],
              outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
              outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
            },
            "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/l.png": {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              paper: {
                hueDegrees: 0,
                saturationScale: 0.36186252771618715,
                brightnessScale: 0.9992769607843138
              },
              mask: {
                kind: "polygon",
                points: [
                  [0.073134, 0.6258],
                  [0.073134, 0.92253],
                  [0.926866, 0.92253],
                  [0.922388, 0.918266],
                  [0.922388, 0.629353],
                  [0.078109, 0.629353]
                ],
                feather: 0.0020491803278688526
              },
              regions: [
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.062189, 0.066453],
                      [0.067662, 0.065743],
                      [0.066667, 0.070718],
                      [0.067662, 0.086354],
                      [0.073134, 0.09666],
                      [0.076119, 0.099502],
                      [0.924378, 0.099502],
                      [0.927363, 0.100569],
                      [0.927363, 0.103056],
                      [0.931343, 0.099502],
                      [0.935821, 0.093106],
                      [0.938308, 0.087065],
                      [0.939801, 0.078891],
                      [0.939303, 0.069652],
                      [0.937313, 0.062544],
                      [0.933333, 0.055792],
                      [0.926866, 0.049751],
                      [0.073134, 0.049751],
                      [0.065672, 0.05828]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 }
                },
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.064677, 0.575338],
                      [0.065174, 0.576404],
                      [0.066667, 0.577114],
                      [0.067662, 0.576759],
                      [0.068657, 0.577825],
                      [0.066667, 0.587065],
                      [0.067662, 0.600213],
                      [0.071642, 0.609097],
                      [0.076617, 0.614428],
                      [0.924378, 0.614428],
                      [0.926866, 0.613717],
                      [0.929851, 0.615849],
                      [0.936816, 0.605899],
                      [0.939801, 0.593461],
                      [0.939303, 0.584577],
                      [0.937811, 0.578891],
                      [0.933333, 0.570718],
                      [0.926866, 0.564677],
                      [0.073134, 0.564677],
                      [0.068657, 0.568941]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 0,
                    saturationScale: 0.7974142156862755,
                    brightnessScale: 0.983132530120482
                  }
                }
              ],
              outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
              outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
            },
            "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/lb.png": {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              paper: {
                hueDegrees: 0,
                saturationScale: 0.6273323471400407,
                brightnessScale: 1.0168222891566263
              },
              mask: {
                kind: "polygon",
                points: [
                  [0.073134, 0.6258],
                  [0.073134, 0.92253],
                  [0.926866, 0.92253],
                  [0.922388, 0.918266],
                  [0.922388, 0.629353],
                  [0.078109, 0.629353]
                ],
                feather: 0.0020491803278688526
              },
              regions: [
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.062189, 0.066453],
                      [0.067662, 0.065743],
                      [0.066667, 0.070718],
                      [0.067662, 0.086354],
                      [0.073134, 0.09666],
                      [0.076119, 0.099502],
                      [0.924378, 0.099502],
                      [0.927363, 0.100569],
                      [0.927363, 0.103056],
                      [0.931343, 0.099502],
                      [0.935821, 0.093106],
                      [0.938308, 0.087065],
                      [0.939801, 0.078891],
                      [0.939303, 0.069652],
                      [0.937313, 0.062544],
                      [0.933333, 0.055792],
                      [0.926866, 0.049751],
                      [0.073134, 0.049751],
                      [0.065672, 0.05828]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 0,
                    saturationScale: 0.8377643384940193,
                    brightnessScale: 1.0846225761772852
                  }
                },
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.064677, 0.575338],
                      [0.065174, 0.576404],
                      [0.066667, 0.577114],
                      [0.067662, 0.576759],
                      [0.068657, 0.577825],
                      [0.066667, 0.587065],
                      [0.067662, 0.600213],
                      [0.071642, 0.609097],
                      [0.076617, 0.614428],
                      [0.924378, 0.614428],
                      [0.926866, 0.613717],
                      [0.929851, 0.615849],
                      [0.936816, 0.605899],
                      [0.939801, 0.593461],
                      [0.939303, 0.584577],
                      [0.937811, 0.578891],
                      [0.933333, 0.570718],
                      [0.926866, 0.564677],
                      [0.073134, 0.564677],
                      [0.068657, 0.568941]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 0,
                    saturationScale: 0.8339454094292815,
                    brightnessScale: 1.03473971722365
                  }
                }
              ],
              outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
              outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
            },
            "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/lr.png": {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              paper: {
                hueDegrees: 2.850960706248884,
                saturationScale: 1.0698769619302055,
                brightnessScale: 0.9617021276595745
              },
              mask: {
                kind: "polygon",
                points: [
                  [0.073134, 0.6258],
                  [0.073134, 0.92253],
                  [0.926866, 0.92253],
                  [0.922388, 0.918266],
                  [0.922388, 0.629353],
                  [0.078109, 0.629353]
                ],
                feather: 0.0020491803278688526
              },
              regions: [
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.062189, 0.066453],
                      [0.067662, 0.065743],
                      [0.066667, 0.070718],
                      [0.067662, 0.086354],
                      [0.073134, 0.09666],
                      [0.076119, 0.099502],
                      [0.924378, 0.099502],
                      [0.927363, 0.100569],
                      [0.927363, 0.103056],
                      [0.931343, 0.099502],
                      [0.935821, 0.093106],
                      [0.938308, 0.087065],
                      [0.939801, 0.078891],
                      [0.939303, 0.069652],
                      [0.937313, 0.062544],
                      [0.933333, 0.055792],
                      [0.926866, 0.049751],
                      [0.073134, 0.049751],
                      [0.065672, 0.05828]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 1.2578055307760678,
                    saturationScale: 0.8451647222833665,
                    brightnessScale: 0.9525773195876289
                  }
                },
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.064677, 0.575338],
                      [0.065174, 0.576404],
                      [0.066667, 0.577114],
                      [0.067662, 0.576759],
                      [0.068657, 0.577825],
                      [0.066667, 0.587065],
                      [0.067662, 0.600213],
                      [0.071642, 0.609097],
                      [0.076617, 0.614428],
                      [0.924378, 0.614428],
                      [0.926866, 0.613717],
                      [0.929851, 0.615849],
                      [0.936816, 0.605899],
                      [0.939801, 0.593461],
                      [0.939303, 0.584577],
                      [0.937811, 0.578891],
                      [0.933333, 0.570718],
                      [0.926866, 0.564677],
                      [0.073134, 0.564677],
                      [0.068657, 0.568941]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 1.176470588235361,
                    saturationScale: 0.8799659175631062,
                    brightnessScale: 0.9423868312757202
                  }
                }
              ],
              outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
              outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
            },
            "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/lg.png": {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              paper: {
                hueDegrees: 6.9791666666667425,
                saturationScale: 0.6891025641025641,
                brightnessScale: 0.9674418604651163
              },
              mask: {
                kind: "polygon",
                points: [
                  [0.073134, 0.6258],
                  [0.073134, 0.92253],
                  [0.926866, 0.92253],
                  [0.922388, 0.918266],
                  [0.922388, 0.629353],
                  [0.078109, 0.629353]
                ],
                feather: 0.0020491803278688526
              },
              regions: [
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.062189, 0.066453],
                      [0.067662, 0.065743],
                      [0.066667, 0.070718],
                      [0.067662, 0.086354],
                      [0.073134, 0.09666],
                      [0.076119, 0.099502],
                      [0.924378, 0.099502],
                      [0.927363, 0.100569],
                      [0.927363, 0.103056],
                      [0.931343, 0.099502],
                      [0.935821, 0.093106],
                      [0.938308, 0.087065],
                      [0.939801, 0.078891],
                      [0.939303, 0.069652],
                      [0.937313, 0.062544],
                      [0.933333, 0.055792],
                      [0.926866, 0.049751],
                      [0.073134, 0.049751],
                      [0.065672, 0.05828]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 0,
                    saturationScale: 0.5613749999999992,
                    brightnessScale: 1.0071153846153846
                  }
                },
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.064677, 0.575338],
                      [0.065174, 0.576404],
                      [0.066667, 0.577114],
                      [0.067662, 0.576759],
                      [0.068657, 0.577825],
                      [0.066667, 0.587065],
                      [0.067662, 0.600213],
                      [0.071642, 0.609097],
                      [0.076617, 0.614428],
                      [0.924378, 0.614428],
                      [0.926866, 0.613717],
                      [0.929851, 0.615849],
                      [0.936816, 0.605899],
                      [0.939801, 0.593461],
                      [0.939303, 0.584577],
                      [0.937811, 0.578891],
                      [0.933333, 0.570718],
                      [0.926866, 0.564677],
                      [0.073134, 0.564677],
                      [0.068657, 0.568941]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 0,
                    saturationScale: 0.4701157407407397,
                    brightnessScale: 0.9975
                  }
                }
              ],
              outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
              outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
            },
            "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/lw.png": {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              paper: {
                hueDegrees: 3.9016830870280046,
                saturationScale: 0.9471563032926669,
                brightnessScale: 0.9797570850202428
              },
              mask: {
                kind: "polygon",
                points: [
                  [0.073134, 0.6258],
                  [0.073134, 0.92253],
                  [0.926866, 0.92253],
                  [0.922388, 0.918266],
                  [0.922388, 0.629353],
                  [0.078109, 0.629353]
                ],
                feather: 0.0020491803278688526
              },
              regions: [
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.062189, 0.066453],
                      [0.067662, 0.065743],
                      [0.066667, 0.070718],
                      [0.067662, 0.086354],
                      [0.073134, 0.09666],
                      [0.076119, 0.099502],
                      [0.924378, 0.099502],
                      [0.927363, 0.100569],
                      [0.927363, 0.103056],
                      [0.931343, 0.099502],
                      [0.935821, 0.093106],
                      [0.938308, 0.087065],
                      [0.939801, 0.078891],
                      [0.939303, 0.069652],
                      [0.937313, 0.062544],
                      [0.933333, 0.055792],
                      [0.926866, 0.049751],
                      [0.073134, 0.049751],
                      [0.065672, 0.05828]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 0,
                    saturationScale: 1.0982627118644075,
                    brightnessScale: 0.9850389812889813
                  }
                },
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.064677, 0.575338],
                      [0.065174, 0.576404],
                      [0.066667, 0.577114],
                      [0.067662, 0.576759],
                      [0.068657, 0.577825],
                      [0.066667, 0.587065],
                      [0.067662, 0.600213],
                      [0.071642, 0.609097],
                      [0.076617, 0.614428],
                      [0.924378, 0.614428],
                      [0.926866, 0.613717],
                      [0.929851, 0.615849],
                      [0.936816, 0.605899],
                      [0.939801, 0.593461],
                      [0.939303, 0.584577],
                      [0.937811, 0.578891],
                      [0.933333, 0.570718],
                      [0.926866, 0.564677],
                      [0.073134, 0.564677],
                      [0.068657, 0.568941]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 0,
                    saturationScale: 1.4374646892655398,
                    brightnessScale: 0.985206611570248
                  }
                }
              ],
              outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
              outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
            },
            "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/lu.png": {
              frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
              paper: {
                hueDegrees: 7.5,
                saturationScale: 1.0238543628374135,
                brightnessScale: 1.0128755364806867
              },
              mask: {
                kind: "polygon",
                points: [
                  [0.073134, 0.6258],
                  [0.073134, 0.92253],
                  [0.926866, 0.92253],
                  [0.922388, 0.918266],
                  [0.922388, 0.629353],
                  [0.078109, 0.629353]
                ],
                feather: 0.0020491803278688526
              },
              regions: [
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.062189, 0.066453],
                      [0.067662, 0.065743],
                      [0.066667, 0.070718],
                      [0.067662, 0.086354],
                      [0.073134, 0.09666],
                      [0.076119, 0.099502],
                      [0.924378, 0.099502],
                      [0.927363, 0.100569],
                      [0.927363, 0.103056],
                      [0.931343, 0.099502],
                      [0.935821, 0.093106],
                      [0.938308, 0.087065],
                      [0.939801, 0.078891],
                      [0.939303, 0.069652],
                      [0.937313, 0.062544],
                      [0.933333, 0.055792],
                      [0.926866, 0.049751],
                      [0.073134, 0.049751],
                      [0.065672, 0.05828]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 6.981076286221196,
                    saturationScale: 1.1583237986270025,
                    brightnessScale: 1.0109890109890112
                  }
                },
                {
                  mask: {
                    kind: "polygon",
                    points: [
                      [0.064677, 0.575338],
                      [0.065174, 0.576404],
                      [0.066667, 0.577114],
                      [0.067662, 0.576759],
                      [0.068657, 0.577825],
                      [0.066667, 0.587065],
                      [0.067662, 0.600213],
                      [0.071642, 0.609097],
                      [0.076617, 0.614428],
                      [0.924378, 0.614428],
                      [0.926866, 0.613717],
                      [0.929851, 0.615849],
                      [0.936816, 0.605899],
                      [0.939801, 0.593461],
                      [0.939303, 0.584577],
                      [0.937811, 0.578891],
                      [0.933333, 0.570718],
                      [0.926866, 0.564677],
                      [0.073134, 0.564677],
                      [0.068657, 0.568941]
                    ],
                    feather: 0.0020491803278688526
                  },
                  adjustment: {
                    hueDegrees: 8.989010989010922,
                    saturationScale: 1.1191836734693865,
                    brightnessScale: 0.9956236323851202
                  }
                }
              ],
              outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
              outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
            }
          },
          neutralHeaders: {
            frame: { hueDegrees: 0, saturationScale: 1, brightnessScale: 1 },
            paper: {
              hueDegrees: 0,
              saturationScale: 0.36186252771618715,
              brightnessScale: 0.9992769607843138
            },
            mask: {
              kind: "polygon",
              points: [
                [0.073134, 0.6258],
                [0.073134, 0.92253],
                [0.926866, 0.92253],
                [0.922388, 0.918266],
                [0.922388, 0.629353],
                [0.078109, 0.629353]
              ],
              feather: 0.0020491803278688526
            },
            regions: [
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.062189, 0.066453],
                    [0.067662, 0.065743],
                    [0.066667, 0.070718],
                    [0.067662, 0.086354],
                    [0.073134, 0.09666],
                    [0.076119, 0.099502],
                    [0.924378, 0.099502],
                    [0.927363, 0.100569],
                    [0.927363, 0.103056],
                    [0.931343, 0.099502],
                    [0.935821, 0.093106],
                    [0.938308, 0.087065],
                    [0.939801, 0.078891],
                    [0.939303, 0.069652],
                    [0.937313, 0.062544],
                    [0.933333, 0.055792],
                    [0.926866, 0.049751],
                    [0.073134, 0.049751],
                    [0.065672, 0.05828]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0,
                  saturationScale: 0.4306103286384983,
                  brightnessScale: 1.0202884615384615
                }
              },
              {
                mask: {
                  kind: "polygon",
                  points: [
                    [0.064677, 0.575338],
                    [0.065174, 0.576404],
                    [0.066667, 0.577114],
                    [0.067662, 0.576759],
                    [0.068657, 0.577825],
                    [0.066667, 0.587065],
                    [0.067662, 0.600213],
                    [0.071642, 0.609097],
                    [0.076617, 0.614428],
                    [0.924378, 0.614428],
                    [0.926866, 0.613717],
                    [0.929851, 0.615849],
                    [0.936816, 0.605899],
                    [0.939801, 0.593461],
                    [0.939303, 0.584577],
                    [0.937811, 0.578891],
                    [0.933333, 0.570718],
                    [0.926866, 0.564677],
                    [0.073134, 0.564677],
                    [0.068657, 0.568941]
                  ],
                  feather: 0.0020491803278688526
                },
                adjustment: {
                  hueDegrees: 0,
                  saturationScale: 0.4608649289099515,
                  brightnessScale: 1.0131174698795178
                }
              }
            ],
            outerStock: [0.08627450980392157, 0.07450980392156863, 0.054901960784313725],
            outerStockMaskSource: "https://raw.githubusercontent.com/joshbirnholz/cardconjurer/33f2547137fe366b40e9e8dba4eb591af190fddf/img/frames/m15/new/border.png"
          },
          commonTexture: {
            hueDegrees: -1.8329248366012507,
            saturationScale: 0.957022292993631,
            brightnessScale: 0.9610108024691361
          }
        },
        statsText: { size: 0.97, fractionalMetrics: !0 },
        rules: {
          leading: 0.9875,
          paragraphGap: 0.4,
          capAtBaseSize: !1,
          fractionalMetrics: !0,
          maximumSize: 24.25,
          textWidth: 1.02,
          dx: 1.25,
          preserveLineCount: !0
        },
        footer: {
          collectorFamily: "CardRenderer MTG Gotham",
          collectorSize: 12.5,
          collectorTracking: 0,
          artistSize: 11.75,
          artistTracking: 0,
          legalSize: 11,
          legalTracking: 0.1,
          collectorRarityX: 92,
          collectorOffset: [-0.5, 1.5],
          artistOffset: [0.5, 1],
          legalOffset: [-0.5, 0.5],
          collectorMarker: { center: [62, 652.5], size: [11, 10] }
        },
        largeLandShadow: { alpha: 0.6, dx: -0.6666666666666666, dy: 2, blur: 0.6666666666666666 },
        largeLandSymbols: {
          W: {
            source: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/w.png",
            sha256: "f15389170b0ef8a8a1d35e382929bc5e6806f391bb08678e8b2761d9412d960e",
            geometry: { dx: 0.5, dy: 11, scaleX: 1.075, scaleY: 1.08 },
            sourceInk: [252, 254, 255],
            body: [251, 252, 241]
          },
          U: {
            source: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/u.png",
            sha256: "606865af8ae26d91185a540dc63ea8df44a1d153b0d205682e053141d8fe6e01",
            geometry: { dx: 0.25, dy: 9, scaleX: 1.0825, scaleY: 1.085 },
            sourceInk: [0, 117, 190],
            body: [22, 81, 184]
          },
          B: {
            source: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/b.png",
            sha256: "6165a1a40d167605df5a3a39f975cd3a1bd9e0824d606055d7945f733aa680dd",
            geometry: { dx: 1.5, dy: 12.5, scaleX: 1.0975, scaleY: 1.11 },
            sourceInk: [39, 38, 36],
            body: [18, 16, 12]
          },
          R: {
            source: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/r.png",
            sha256: "9219723601f8fcaee288d74a8ed100df0d58c2e9e70031602334e72f7190afd4",
            geometry: { dx: 3.25, dy: 9, scaleX: 1.0875, scaleY: 1.085 },
            sourceInk: [239, 56, 39],
            body: [211, 13, 5]
          },
          G: {
            source: "https://cdn.jsdelivr.net/gh/Investigamer/cardconjurer@2fcddba8966156d484cedf54d8214996748dd5e1/img/frames/m15/basics/g.png",
            sha256: "7a8dfe92c8f3da536058e9d4499cce92d4dc926b87e4b58abac4b493afca2140",
            geometry: { dx: 0.25, dy: 11.5, scaleX: 1.105, scaleY: 1.1075 },
            sourceInk: [0, 123, 67],
            body: [23, 104, 61]
          }
        },
        printedLandRarities: ["243", "244", "245", "247", "249", "250", "251", "257", "258", "259"],
        foilStarNumbers: ["320", "324", "328", "332", "336"]
      }
    },
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
};
export {
  e as default
};
