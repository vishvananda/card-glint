#!/usr/bin/env python3
"""Make visual-only dual-land stripe-order sheets from verified cached scans."""
import argparse
import hashlib
import json
from pathlib import Path
from PIL import Image, ImageDraw

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('corpora', type=Path, help='accuracy fixture directory containing set corpora')
parser.add_argument('cache', type=Path, help='cache directory containing objects/')
parser.add_argument('output', type=Path, help='external output directory; do not commit source images')
args = parser.parse_args()
args.output.mkdir(parents=True, exist_ok=True)
sets = ['lea', 'leb', '2ed', '3ed']
names = ['Tundra', 'Underground Sea', 'Badlands', 'Taiga', 'Tropical Island',
         'Bayou', 'Plateau', 'Savannah', 'Scrubland', 'Volcanic Island']
corpora = {s: json.loads((args.corpora / s / 'corpus.json').read_text()) for s in sets}
rows = []
images = {}
for name in names:
    for s in sets:
        entry = next((e for e in corpora[s]['entries'] if e['name'] == name), None)
        if entry is None:
            assert s == 'lea' and name == 'Volcanic Island'
            continue
        raw = (args.cache / 'objects' / entry['referenceHash']).read_bytes()
        assert hashlib.sha256(raw).hexdigest() == entry['referenceHash']
        with Image.open(args.cache / 'objects' / entry['referenceHash']) as scan:
            images[s, name] = scan.convert('RGB')
        rows.append({k: entry[k] for k in ['id', 'name', 'referenceHash', 'source']} | {'set': s})
assert len(rows) == 39
for page in range(2):
    sheet = Image.new('RGB', (1280, 980), '#eee')
    draw = ImageDraw.Draw(sheet)
    for j, s in enumerate(sets):
        draw.text((j * 320 + 10, 8), s.upper(), fill='black')
    for i, name in enumerate(names[page * 5:page * 5 + 5]):
        for j, s in enumerate(sets):
            draw.text((j * 320 + 5, i * 190 + 31), name, fill='black')
            scan = images.get((s, name))
            if scan is None:
                draw.text((j * 320 + 20, i * 190 + 65), 'not printed', fill='black')
                continue
            w, h = scan.size
            crop = scan.crop((round(w * .08), round(h * .58), round(w * .92), round(h * .86)))
            sheet.paste(crop.resize((318, 165), Image.Resampling.LANCZOS), (j * 320, i * 190 + 50))
    sheet.save(args.output / ('paper-' + str(page) + '.png'))
sheet = Image.new('RGB', (1600, 1104), 'white')
draw = ImageDraw.Draw(sheet)
for j, s in enumerate(sets):
    draw.text((400 * j + 4, 4), s.upper(), fill='black')
for i, name in enumerate(names):
    for j, s in enumerate(sets):
        draw.text((400 * j + 4, 24 + i * 108), name, fill='black')
        scan = images.get((s, name))
        if scan is None:
            continue
        w, h = scan.size
        crop = scan.crop((round(.25 * w), round(.585 * h), round(.75 * w), round(.655 * h)))
        sheet.paste(crop.resize((396, 82), Image.Resampling.NEAREST), (400 * j + 2, 42 + i * 108))
sheet.save(args.output / 'top-bands.png')
manifest = {'schema': 1, 'scope': 'Visual reading only. Crops are not registered and must not be used as geometric or color measurements. No order is automatically inferred.',
            'toolHash': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), 'rows': rows}
(args.output / 'references.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({'references': len(rows), 'sheets': 3}))
