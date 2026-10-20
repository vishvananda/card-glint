#!/usr/bin/env python3
"""Controls for cohort isolation, texture tradeoffs and capture identity."""
import copy
import importlib.util
import sys
import unittest
from pathlib import Path

sys.dont_write_bytecode = True
ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location(
    "keyline_select", ROOT / "games/magic/tools/accuracy/early-native-keyline-select.py"
)
selector = importlib.util.module_from_spec(spec)
spec.loader.exec_module(selector)


def fixture():
    variants = ["material-control", "correct-ink"]
    definition = {"ids": [str(i) for i in range(6)],
                  "trials": [{"id": v, "materials": {"W": {"trial": v}}} for v in variants]}
    capture, inks, colors = {}, {v: {} for v in variants}, {v: {} for v in variants}
    for i in range(6):
        ident = str(i)
        common = {"id": ident, "name": "Printing " + ident, "material": "W",
                  "cohort": "calibration" if i < 3 else "validation",
                  "referenceHash": "scan-" + ident, "poseHash": "pose-" + ident}
        capture[ident] = {**common, "trials": {v: {"faceHash": v + ident} for v in variants}}
        for v in variants:
            ink = .30 if v == "material-control" else .15
            inks[v][ident] = {**common, "renderHash": v + ident,
                              "rendered": {"rgb": [ink] * 3}, "reference": {"rgb": [.15] * 3}}
            component = {"deltaE": 0, "renderSpread": 3, "referenceSpread": 3, "referenceRgb": [.8] * 3}
            colors[v][ident] = {**common, "renderHash": v + ident, "accepted": True,
                                "components": {k: copy.deepcopy(component) for k in ["frame", "paper"]}}
    return definition, capture, inks, colors


class Controls(unittest.TestCase):
    def test_validation_cannot_choose_material_curve(self):
        data = fixture()
        first = selector.select(*data)[0]
        for variant in data[2]:
            for i in ["3", "4", "5"]:
                # Deliberately reverse the validation winner, without changing
                # a calibration observation or the shared reference identities.
                data[2][variant][i]["rendered"]["rgb"] = [.15 if variant == "material-control" else .8] * 3
        second = selector.select(*data)[0]
        self.assertEqual(first["variant"], "correct-ink")
        self.assertEqual(second["variant"], first["variant"])
        self.assertGreater(second["validation"]["inkAfter"], first["validation"]["inkAfter"])

    def test_ink_match_cannot_justify_destroying_paper_color(self):
        data = fixture()
        self.assertEqual(selector.select(*data)[0]["variant"], "correct-ink")
        for row in data[3]["correct-ink"].values():
            row["components"]["paper"]["deltaE"] = 40
        self.assertEqual(selector.select(*data)[0]["variant"], "material-control")

    def test_other_scan_pose_is_rejected(self):
        data = fixture()
        data[2]["correct-ink"]["0"]["poseHash"] = "another-pose"
        with self.assertRaisesRegex(ValueError, "identity mismatch: poseHash"):
            selector.select(*data)


if __name__ == "__main__":
    unittest.main()
