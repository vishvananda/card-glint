"""Compare visible collector-rarity columns using frozen native/scan rasters.

Requires modern-calibration-requirements.txt. This is a last-glyph bounds
diagnostic, not a font fit, printing-content certification or rendering offset.
"""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

RECT = [27, 636, 153, 12]


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def read(file):
    return json.loads(file.read_text())


def measure(file, expected):
    assert sha(file) == expected
    image = Image.open(file).convert('RGB').resize((488, 680), Image.Resampling.BILINEAR)
    x, y, width, height = RECT
    crop = np.asarray(image)[y:y+height, x:x+width].max(axis=2)
    low, high = np.quantile(crop, [.1, .99])
    threshold = float(low + .3*(high-low))
    active = (crop > threshold).sum(axis=0) >= 2
    runs = []
    start = None
    for i, signal in enumerate(list(active)+[False]):
        if signal and start is None:
            start = i
        if not signal and start is not None:
            if i-start >= 2:
                runs.append([start+x, i+x])
            start = None
    return {'runs':runs, 'lastGlyphBounds':runs[-1] if runs else None,
            'threshold':threshold, 'contrast':float(high-low), 'rasterHash':expected}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for name in ['inputs', 'native', 'scores', 'output']:
        parser.add_argument(name, type=Path)
    args = parser.parse_args()
    inputs = read(args.inputs)
    native = read(args.native/'capture.json')
    scores = read(args.scores/'scores.json')
    assert native['source']['inputsHash'] == sha(args.inputs) == scores['definition']['inputsHash']
    assert scores['definition']['nativeCaptureHash'] == sha(args.native/'capture.json')
    assert len(inputs['entries']) == len(native['rows']) == len(scores['rows'])
    rows = []
    for entry in inputs['entries']:
        n = next(r for r in native['rows'] if r['id'] == entry['id'])
        s = next(r for r in scores['rows'] if r['id'] == entry['id'])
        assert n['inputHash'] == s['inputHash']
        assert n['referenceHash'] == s['referenceHash'] == entry['reference']['sha256']
        layer = n['layers']['face']
        rows.append({'id':entry['id'], 'name':entry['card']['name'],
                     'number':entry['card']['collector_number'], 'inputHash':n['inputHash'],
                     'referenceHash':entry['reference']['sha256'], 'poseHash':s['poseHash'],
                     'scan':measure(args.scores/s['normalizedReference']['file'], s['normalizedReference']['sha256']),
                     'native':measure(args.native/layer['file'], layer['sha256'])})
    assert len({r['id'] for r in rows}) == len(rows)
    result = {'schema':1, 'status':'diagnostic-last-glyph-bounds; no adoption',
              'scope':'Complete frozen input census, fixed collector window. Last connected bright glyph is a heuristic, not semantic recognition. Relative ink/stock contrast avoids discarding faint rarity strokes. Inspect native glyphs before choosing shared column anchors; never install per-card bounds.',
              'source':{'inputsHash':sha(args.inputs), 'nativeHash':sha(args.native/'capture.json'),
                        'scoresHash':sha(args.scores/'scores.json'), 'toolHash':sha(Path(__file__))},
              'region':RECT, 'thresholdPolicy':'P10+0.3*(P99-P10) per image',
              'minimumColumnPixels':2, 'rows':rows}
    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(result, indent=2)+'\n')
    print(json.dumps({'completed':len(rows)}))


if __name__ == '__main__':
    main()
