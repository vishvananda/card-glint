"""Prove native face changes stay inside one declared canonical region.

Uses private local PNG captures; outputs only identifiers, hashes and counts.
This verifies change scope, not visual correctness or calibration completion.
"""
import argparse
import gzip
import hashlib
import json
import math
from pathlib import Path

import numpy as np
from PIL import Image


def digest(raw):
    return hashlib.sha256(raw).hexdigest()


def require(condition, message):
    if not condition:
        raise ValueError(message)


def capture(directory):
    raw = (directory / "capture.json").read_bytes()
    value = json.loads(raw)
    rows = value["rows"]
    require(not value.get("faults"), "Capture contains faults")
    require(value["completed"] == value["denominator"] == len(rows), "Incomplete capture")
    require(len({row["id"] for row in rows}) == len(rows), "Duplicate printing")
    inputs_raw = (directory / "inputs.json").read_bytes()
    require(digest(inputs_raw) == value["source"]["inputsHash"], "Input manifest/hash mismatch")
    inputs = json.loads(inputs_raw)
    by_id = {entry["id"]: entry for entry in inputs["entries"]}
    require(set(by_id) == {row["id"] for row in rows}, "Input/capture denominator mismatch")
    for row in rows:
        entry = by_id[row["id"]]
        require(entry["face"].get("wordingMode") == "original", "Requires Original wording")
        # Native capture hashes JS JSON.stringify output, whose floating-point
        # spelling may differ in Python; compare the immutable manifest identity
        # and checked row input hashes across captures instead.
        require(entry["reference"]["sha256"] == row["referenceHash"]
                and entry["art"]["sha256"] == row["artHash"], "Input/reference mismatch")
    return value, digest(raw)


def pixels(directory, row, layer):
    entry = row["layers"][layer]
    raw = (directory / entry["file"]).read_bytes()
    require(digest(raw) == entry["sha256"], "Layer file/hash mismatch: " + row["id"])
    with Image.open(directory / entry["file"]) as image:
        require(image.mode == "RGBA", "Capture must be RGBA")
        return np.asarray(image).copy()


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("before", type=Path)
    parser.add_argument("after", type=Path)
    parser.add_argument("output", type=Path)
    parser.add_argument("--region", type=float, nargs=4, required=True,
                        metavar=("X", "Y", "WIDTH", "HEIGHT"),
                        help="Allowed face change in canonical 488x680 units")
    parser.add_argument("--allow-number", action="append",
                        help="Restrict allowed changes to these collector numbers")
    args = parser.parse_args()
    x, y, w, h = args.region
    require(all(math.isfinite(v) for v in args.region)
            and x >= 0 and y >= 0 and w > 0 and h > 0
            and x + w <= 488 and y + h <= 680, "Invalid canonical region")
    a, ah = capture(args.before)
    b, bh = capture(args.after)
    require(a["set"] == b["set"], "Different sets")
    previous = {row["id"]: row for row in a["rows"]}
    require(set(previous) == {row["id"] for row in b["rows"]}, "Different printings")
    allowed = set(args.allow_number or [])
    if allowed:
        require(allowed <= {row["number"] for row in b["rows"]}, "Unknown allowed number")
    rows = []
    for row in b["rows"]:
        old = previous[row["id"]]
        for key in ["referenceHash", "artHash", "inputHash", "number", "name"]:
            require(old[key] == row[key], "Input identity changed: " + row["id"])
        before = pixels(args.before, old, "face")
        after = pixels(args.after, row, "face")
        require(before.shape == after.shape, "Different face dimensions")
        require(np.array_equal(pixels(args.before, old, "etching"),
                               pixels(args.after, row, "etching")),
                "Etching changed: " + row["id"])
        height, width = before.shape[:2]
        require(width * 680 == height * 488, "Unexpected native aspect")
        delta = np.any(before != after, axis=2)
        permitted = np.zeros(delta.shape, dtype=bool)
        if not allowed or row["number"] in allowed:
            permitted[math.floor(y * height / 680):math.ceil((y + h) * height / 680),
                      math.floor(x * width / 488):math.ceil((x + w) * width / 488)] = True
        require(not np.any(delta & ~permitted), "Change outside allowed region: " + row["id"])
        ys, xs = np.where(delta)
        rows.append({
            "id": row["id"], "name": row["name"], "number": row["number"],
            "referenceHash": row["referenceHash"], "inputHash": row["inputHash"],
            "beforeFaceHash": old["layers"]["face"]["sha256"],
            "afterFaceHash": row["layers"]["face"]["sha256"],
            "etchingHash": row["layers"]["etching"]["sha256"],
            "changedPixels": int(delta.sum()),
            "changedNativeBounds": [int(xs.min()), int(ys.min()),
                                    int(xs.max()) + 1, int(ys.max()) + 1] if len(xs) else None,
        })
    proof = {
        "schema": 1, "set": b["set"], "status": "native-change-scope-only",
        "scope": "Complete matching Original inputs and references. Only the declared face region may change; complete etchings remain pixel-identical. Not a correctness, transfer or completion certificate.",
        "source": {"beforeCaptureHash": ah, "afterCaptureHash": bh,
                   "toolHash": digest(Path(__file__).read_bytes()),
                   "beforeRendererHash": a["source"]["rendererHash"],
                   "afterRendererHash": b["source"]["rendererHash"]},
        "allowedCanonicalRegion": args.region,
        "allowedCollectorNumbers": sorted(allowed) if allowed else None,
        "summary": {"total": len(rows), "changedFaces": sum(r["changedPixels"] > 0 for r in rows),
                    "outsideRegionChanges": 0, "etchingChanges": 0},
        "rows": rows,
    }
    raw = (json.dumps(proof, indent=2) + "\n").encode()
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_bytes(gzip.compress(raw, mtime=0) if args.output.suffix == ".gz" else raw)
    print(json.dumps(proof["summary"]))


if __name__ == "__main__":
    main()
