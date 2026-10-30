"""Generate factual font geometry from verified, cached upstream fonts.

Usage: python build-font-geometry.py <audit-directory> <output.json>
Requires fonttools==4.60.1. The input directory contains fonts.json, its local
font files, and the Chromium Linux/macOS precise metric audit receipts.
No upstream font bytes are copied into the repository.
"""
import hashlib
import json
import sys
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen

source = Path(sys.argv[1])
linux = json.loads((source / "linux-chromium-precise-font-audit.json").read_text())
mac = json.loads((source / "mac-chromium-precise-font-audit.json").read_text())
result = []
for index, asset in enumerate(json.loads((source / "fonts.json").read_text())):
    file = source / asset["local"]
    assert hashlib.sha256(file.read_bytes()).hexdigest() == asset["sha256"]
    font = TTFont(file)
    units = font["head"].unitsPerEm
    malformed = font["hhea"].descent > 0
    reference = (mac if malformed else linux)["rows"][index]
    assert reference["sha256"] == asset["sha256"]
    cases = {c["baseline"]: c["metrics"] for c in reference["cases"] if c["size"] == 100}
    glyphs = {}
    glyph_set = font.getGlyphSet()
    for code, name in sorted(font.getBestCmap().items()):
        pen = BoundsPen(glyph_set)
        glyph_set[name].draw(pen)
        glyphs[str(code)] = (
            [round(pen.bounds[1], 4), round(pen.bounds[3], 4)] if pen.bounds else [0, 0]
        )
    result.append({
        "family": asset["family"],
        "weight": asset["weight"],
        "style": asset["style"],
        "source": asset["url"],
        "sha256": asset["sha256"],
        "unitsPerEm": units,
        "malformedDescender": malformed,
        "ascent": cases["alphabetic"]["fontBoundingBoxAscent"] / 100,
        "descent": cases["alphabetic"]["fontBoundingBoxDescent"] / 100,
        "anchors": {key: -value["alphabeticBaseline"] / 100 for key, value in cases.items()},
        "glyphs": glyphs,
    })
Path(sys.argv[2]).write_text(json.dumps(result, separators=(",", ":")) + "\n")
print(f"Generated {len(result)} font faces / {sum(len(f['glyphs']) for f in result)} glyph extents")
