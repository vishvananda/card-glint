"""Fit shared artifact-paper color to ink-cleared, independently aligned scans.

Run after the clean native material capture. This produces candidates only;
old_frame_material_validation.py must check the actual full-card replay.
"""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, grey_closing

from old_frame_color_distribution import adjustment, fit, measures, normalize, parameters


def digest(file):
    return hashlib.sha256(Path(file).read_bytes()).hexdigest()


def clear_paper(image):
    crop = image[435:575, 80:408]
    closed = grey_closing(crop, size=(11, 11, 1), mode="nearest")
    return gaussian_filter(closed, sigma=(2, 2, 0), mode="nearest")[::4, ::4].reshape(-1, 3)


def main(directory, output):
    directory, output = Path(directory), Path(output)
    assert not output.exists(), "Refuse to overwrite a measurement"
    source = json.loads((directory / "inputs.json").read_bytes())
    exported = json.loads((directory / "exported/inputs.json").read_bytes())
    assert exported["inputHash"] == digest(directory / "inputs.json")
    cap = json.loads((directory / "clean-control/capture.json").read_bytes())
    assert cap["complete"] and not cap["faults"]
    assert cap["source"]["inputHash"] == digest(directory / "inputs.json")
    assert cap["source"]["exportedHash"] == digest(directory / "exported/inputs.json")
    controls = [r for r in cap["rows"] if r["key"] == "A"]
    assert len(controls) == 1
    row = controls[0]
    control_file = directory / "clean-control" / row["file"]
    assert digest(control_file) == row["sha256"]
    profile = json.loads((directory / "before-profile.json").read_bytes())
    clean = json.loads((directory / "clean-profile.json").read_bytes())
    assert profile["set"] == clean["set"] == source["set"]
    assert profile["frames"] == clean["frames"]
    identity = dict(hueDegrees=0, saturationScale=1, brightnessScale=1)
    assert clean["colors"]["A"]["adjustment"]["frame"] == identity
    assert clean["colors"]["A"]["adjustment"]["paper"] == identity
    raw = clear_paper(normalize(Image.open(control_file)))
    old = profile["colors"]["A"]["adjustment"]["paper"]
    refs = []
    for row in exported["rows"]:
        if not row["accepted"] or row["key"] != "A":
            continue
        file = directory / "exported" / (row["id"] + ".png")
        assert digest(file) == row["normalizedHash"]
        refs.append((row, clear_paper(normalize(Image.open(file)))))
    names = {
        co: {r["name"] for r, _ in refs if r["cohort"] == co}
        for co in ["calibration", "validation"]
    }
    assert not (names["calibration"] & names["validation"])
    assert min(map(len, names.values())) >= 3
    calibration = [v for r, v in refs if r["cohort"] == "calibration"]
    p, optimization = fit(np.tile(raw, (len(calibration), 1)), np.concatenate(calibration), old)
    result = dict(
        schema=1, status="artifact-paper-candidate-not-adopted", set=source["set"],
        source={name: digest(directory / name) for name in [
            "inputs.json", "exported/inputs.json", "before-profile.json",
            "clean-profile.json", "clean-control/capture.json",
        ]},
        tool=digest(__file__), controlHash=digest(control_file),
        scope="Fixed paper field; equal 11px closing and 2px blur precede per-printing pooling. Calibration printings select one shared HSV/gamma/WB transform; disjoint validation names only evaluate it. Original scan poses are retained. Background-only predictions require actual native full-card verification.",
        adjustment=adjustment(p), optimization=optimization,
        observations=[
            dict(id=r["id"], name=r["name"], cohort=r["cohort"], referenceHash=r["normalizedHash"],
                 before=measures(raw, v, parameters(old)), after=measures(raw, v, p))
            for r, v in refs
        ],
    )
    output.write_text(json.dumps(result, indent=2) + "\n")
    for co in names:
        rows = [r for r in result["observations"] if r["cohort"] == co]
        print(source["set"], co, {
            "names": len(names[co]),
            "before": np.mean([r["before"]["pairedDeltaE"] for r in rows]),
            "after": np.mean([r["after"]["pairedDeltaE"] for r in rows]),
        }, flush=True)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("directory")
    parser.add_argument("output")
    args = parser.parse_args()
    main(args.directory, args.output)
