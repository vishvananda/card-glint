#!/usr/bin/env python3
"""Sample physical outer printed keyline ink on frozen native scan poses.

Requires numpy and Pillow. No per-card color/geometry adjustment is fitted.
"""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image


def read(file):
    raw = file.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()


def keyline_samples(image, sides, column):
    samples = []
    per_side = {}
    for side in ['left', 'right', 'top', 'bottom']:
        value = sides[side][column]
        horizontal = side in ['top', 'bottom']
        inward = 1 if side in ['left', 'top'] else -1
        along = [125, 244, 363] if horizontal else [150, 300, 530]
        values = []
        for center in along:
            for a in range(round((center - 12) * 1.5), round((center + 12) * 1.5)):
                pixels = []
                for n in range(-2, 6):
                    at = round(value * 1.5) + inward * n
                    x, y = (a, at) if horizontal else (at, a)
                    assert 0 <= x < 732 and 0 <= y < 1020
                    pixels.append(image[y, x, :3].astype(np.float64) / 255)
                # The darkest observed pixel across a short normal strip finds
                # the printed keyline rather than the surrounding colored bevel.
                values.append(min(pixels, key=lambda p: max(p)))
        values = np.array(values)
        per_side[side] = {'rgb': np.median(values, axis=0).tolist(),
                          'maximumChannelQuantiles': np.quantile(values.max(axis=1), [.1, .5, .9]).tolist()}
        samples.extend(values)
    samples = np.array(samples)
    return {'rgb': np.median(samples, axis=0).tolist(),
            'maximumChannelQuantiles': np.quantile(samples.max(axis=1), [.1, .5, .9]).tolist(),
            'sampleCount': len(samples), 'sides': per_side}


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('native', type=Path)
    p.add_argument('trial', type=Path)
    p.add_argument('variant')
    p.add_argument('output', type=Path)
    p.add_argument('--white-capture', type=Path)
    p.add_argument('--white-variant')
    args = p.parse_args()
    assert bool(args.white_capture) == bool(args.white_variant)
    native, native_hash = read(args.native / 'capture.json')
    trial, trial_hash = read(args.trial / 'capture.json')
    assert trial['source']['nativeCaptureHash'] == native_hash
    white, white_hash = read(args.white_capture / 'capture.json') if args.white_capture else (None, None)
    if white:
        assert white['source']['nativeCaptureHash'] == native_hash
    refs = {r['id']: r for r in native['rows']}
    rows = []
    for row in trial['rows']:
        selected = (next(w for w in white['rows'] if w['id'] == row['id'])
                    if white and row['material'] == 'W' else row)
        folder = args.white_capture if white and row['material'] == 'W' else args.trial
        variant = args.white_variant if white and row['material'] == 'W' else args.variant
        candidate = selected['trials'][variant]
        assert candidate['outerBoundary']['coherent']
        reference = refs[row['id']]
        for field in ['referenceHash', 'poseHash']:
            assert row[field] == selected[field] == reference[field]
        paths = {'reference': args.native / row['set'] / (row['id'] + '-scan.png'),
                 'rendered': folder / variant / (row['id'] + '.png')}
        observed = {}
        for key, file in paths.items():
            raw = file.read_bytes()
            expected = reference['scanHash'] if key == 'reference' else candidate['faceHash']
            assert hashlib.sha256(raw).hexdigest() == expected
            image = np.array(Image.open(file).convert('RGBA'))
            assert image.shape == (1020, 732, 4)
            observed[key] = keyline_samples(image, candidate['outerBoundary']['sides'], key)
        rows.append({k: row[k] for k in ['id', 'name', 'material', 'cohort', 'referenceHash', 'poseHash']} |
                    {'renderHash': candidate['faceHash'], **observed})
    groups = {}
    for material in sorted({r['material'] for r in rows}):
        groups[material] = {}
        for cohort in ['calibration', 'validation']:
            subset = [r for r in rows if r['material'] == material and r['cohort'] == cohort]
            groups[material][cohort] = {'count': len(subset), **{
                key: np.median([r[key]['rgb'] for r in subset], axis=0).tolist()
                for key in ['reference', 'rendered']}}
    proof = {'schema': 1, 'status': 'black-keyline-diagnostic-not-fit', 'scope':
             'Physical printed keyline samples only, independent of title/body ink. Frozen per-card scan poses remain unchanged. A short normal strip follows each measured outer boundary; the darkest pixel rejects surrounding stock/bevel brightness. Per-card observations do not authorize per-card color corrections. Validate keyline width, texture contrast and actual source-material curves before adoption. No black-level calibration or complete-set certification is implied.',
             'nativeCaptureHash': native_hash, 'trialCaptureHash': trial_hash, 'whiteCaptureHash': white_hash,
             'rendererHash': trial['source']['rendererHash'],
             'toolHash': hashlib.sha256(Path(__file__).read_bytes()).hexdigest(), 'groups': groups, 'rows': rows}
    args.output.write_text(json.dumps(proof, indent=2) + '\n')
    print(json.dumps(groups))


if __name__ == '__main__':
    main()
