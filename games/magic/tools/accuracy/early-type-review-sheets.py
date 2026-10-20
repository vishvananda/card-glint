"""Make local source-scan crops for wording review, not geometry measurements.

Requires Pillow. Outputs include external reference pixels and must stay outside
public repository assets. INPUT is an early-printing-inputs.mjs manifest.
"""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("input", type=Path)
parser.add_argument("output", type=Path)
parser.add_argument("cache", type=Path)
parser.add_argument("--all", action="store_true", help="Include already reviewed types")
args = parser.parse_args()
source = json.loads(args.input.read_text())
entries = sorted(
    [e for e in source["entries"] if args.all or e["wordingEvidence"]["type"] == "family-transfer-pending"],
    key=lambda e: e["name"],
)
if not entries:
    parser.error("No matching printings")
args.output.mkdir(parents=True, exist_ok=True)
try:
    font = ImageFont.truetype("DejaVuSans.ttf", 13)
except OSError:
    font = ImageFont.load_default()
index = []
for start in range(0, len(entries), 40):
    sheet = Image.new("RGB", (1000, 1380), "#e5e7e9")
    draw = ImageDraw.Draw(sheet)
    for j, entry in enumerate(entries[start:start + 40]):
        x, y = (j // 20) * 500, (j % 20) * 68
        draw.text((x + 4, y + 2), f'{start + j + 1}. {entry["name"]}', font=font, fill="black")
        reference = entry["reference"]["sha256"]
        if len(reference) != 64 or any(c not in "0123456789abcdef" for c in reference):
            raise ValueError("Invalid source hash")
        file = args.cache / "objects" / reference
        if hashlib.sha256(file.read_bytes()).hexdigest() != reference:
            raise ValueError("Changed reference: " + entry["name"])
        with Image.open(file) as scan:
            w, h = scan.size
            # Deliberately generous raw-scan crop; no registration/refit or
            # rendering participates in the original-wording transcription.
            crop = scan.convert("RGB").crop((round(w * .05), round(h * .55), round(w * .94), round(h * .603)))
            sheet.paste(crop.resize((480, 43)), (x + 4, y + 20))
        index.append({"ordinal": start + j + 1, "id": entry["id"], "name": entry["name"], "proposed": entry["face"]["typeLine"], "referenceHash": reference, "sheet": start // 40 + 1})
    sheet.save(args.output / f"types-{start // 40 + 1}.png")
(args.output / "index.json").write_text(json.dumps(index, indent=2) + "\n")
print(json.dumps({"set": source["set"], "printings": len(entries), "imagesTracked": False}))
