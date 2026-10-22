"""Measure one shared paper-panel mask for the pinned M15 plate family.

The dark template separates paper from its surround without following texture
in white frames. Every bound asset must have the same thresholded alpha shape.
Only vectors/hashes are reusable; external diagnostic images stay local.
"""
import argparse
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image, ImageDraw

cv2.setNumThreads(1)
parser = argparse.ArgumentParser(description=__doc__)
for key in ["proposal", "inputs", "cache", "output"]:
    parser.add_argument(key, type=Path)
args = parser.parse_args()
read = lambda f: json.loads(f.read_text())
sha = lambda f: hashlib.sha256(f.read_bytes()).hexdigest()
proposal, inputs = read(args.proposal), read(args.inputs)
assert proposal["source"]["inputsHash"] == sha(args.inputs)
assets = {a["url"]: a for a in inputs["components"]}
panels = {
    "name": {"bounds": [20, 24, 448, 54], "seed": [244, 50]},
    "type": {"bounds": [20, 378, 448, 47], "seed": [244, 402]},
    "rules": {"bounds": [24, 420, 440, 222], "seed": [244, 525]},
}
template = next(assets[g["source"]] for g in proposal["groups"] if g["source"].endswith("/b.png"))


def image(asset):
    file = args.cache / "objects" / asset["sha256"]
    assert sha(file) == asset["sha256"]
    return np.asarray(Image.open(file).convert("RGBA"))


rgba = image(template)
height, width = rgba.shape[:2]
masks = {}
for key, spec in panels.items():
    x, y, w, h = spec["bounds"]
    left, top = int(x * width / 488), int(y * height / 680)
    right, bottom = int((x + w) * width / 488), int((y + h) * height / 680)
    sx, sy = int(spec["seed"][0] * width / 488), int(spec["seed"][1] * height / 680)
    crop = rgba[top:bottom, left:right]
    seed = rgba[sy, sx, :3].astype(float)
    rgb = crop[:, :, :3].astype(float)
    chroma = rgb / np.maximum(1, rgb.sum(axis=2))[:, :, None]
    seed_chroma = seed / max(1, seed.sum())
    binary = ((np.max(rgb, axis=2) >= np.max(seed) * .78)
              & (crop[:, :, 3] >= 250)
              & (np.linalg.norm(chroma - seed_chroma, axis=2) < .05)).astype(np.uint8)
    _, labels = cv2.connectedComponents(binary, connectivity=4)
    label = int(labels[sy - top, sx - left])
    assert label > 0, (key, "paper seed rejected")
    selected = (labels == label).astype(np.uint8)
    assert not (selected[0].any() or selected[-1].any()
                or selected[:, 0].any() or selected[:, -1].any()), (
                    key, "template paper component reaches measurement window")
    contours, _ = cv2.findContours(selected, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    assert len(contours) == 1
    contour = cv2.approxPolyDP(contours[0], width * .00065, True).reshape(-1, 2)
    points = [[round(float(px + left) / width, 6), round(float(py + top) / height, 6)]
              for px, py in contour]
    assert len(points) >= 4
    masks[key] = {"kind": "polygon", "points": points, "feather": 1 / 488}

args.output.mkdir(parents=True, exist_ok=True)
rows = []
for group in proposal["groups"]:
    asset = assets[group["source"]]
    source = image(asset)
    assert source.shape == rgba.shape
    mismatch = int(((source[:, :, 3] >= 128) != (rgba[:, :, 3] >= 128)).sum())
    assert mismatch == 0, (asset["url"], "different source-family alpha shape")
    preview = Image.fromarray(source).resize((488, 680), Image.Resampling.BILINEAR)
    draw = ImageDraw.Draw(preview)
    for key, mask in masks.items():
        points = [(round(x * 488), round(y * 680)) for x, y in mask["points"]]
        draw.line(points + points[:1], fill={"name": "red", "type": "cyan", "rules": "lime"}[key], width=1)
    filename = asset["url"].split("/")[-1]
    preview.save(args.output / (filename + "-panels.png"))
    rows.append({"source": asset["url"], "sourceHash": asset["sha256"], "binaryAlphaMismatch": mismatch})
    print(filename, {key: len(value["points"]) for key, value in masks.items()}, flush=True)
(args.output / "masks.json").write_text(json.dumps({
    "schema": 1, "status": "shared-source-family-mask-requires-native-review",
    "scope": "Digital source-panel measurement only. The six assets share an identical thresholded alpha shape. This does not prove scan alignment, panel-color equality or native color fidelity.",
    "source": {"proposalHash": sha(args.proposal), "inputsHash": sha(args.inputs),
               "template": template["url"], "templateHash": template["sha256"],
               "toolHash": sha(Path(__file__))},
    "definition": panels, "dimensions": [width, height], "masks": masks, "assets": rows,
}, indent=2) + "\n")
