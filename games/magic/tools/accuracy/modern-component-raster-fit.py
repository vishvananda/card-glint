"""Measure shared component geometry from frozen, already normalized scans.

Diagnostic only: bitmap resampling proposes dimensions, not a native typography
or material calibration. Never refit a scan pose using its renderer score.
Requires modern-calibration-requirements.txt; downloaded pixels stay outside git.
"""
import argparse
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

cv2.setNumThreads(1)
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('inputs', type=Path)
parser.add_argument('native', type=Path)
parser.add_argument('scores', type=Path)
parser.add_argument('output', type=Path)
args = parser.parse_args()


def digest(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def read(file):
    return json.loads(file.read_text())


inputs = read(args.inputs)
native = read(args.native / 'capture.json')
scores = read(args.scores / 'scores.json')
assert native['source']['inputsHash'] == digest(args.inputs)
assert scores['definition']['inputsHash'] == digest(args.inputs)
assert scores['definition']['nativeCaptureHash'] == digest(args.native / 'capture.json')
assert len(scores['rows']) == len(inputs['entries']) == len(native['rows']) == 297
source = {
    'inputsHash': digest(args.inputs),
    'captureHash': digest(args.native / 'capture.json'),
    'scoresHash': digest(args.scores / 'scores.json'),
    'toolHash': digest(Path(__file__)),
    'method': 'signed-ink-soft-Dice-shared-bitmap-affine-proposal-v1',
}


def image(file, expected):
    assert digest(file) == expected, str(file)
    rgb = np.asarray(Image.open(file).convert('RGB'))
    return cv2.resize(rgb, (488, 680), interpolation=cv2.INTER_LINEAR)


def ink(rgb, bright):
    # One fixed polarity per physical component. HSV value excludes hue and
    # saturation differences; percentile normalization excludes scalar contrast.
    v = np.max(rgb.astype(np.float32), axis=2)
    v = cv2.GaussianBlur(v, (0, 0), 0.55)
    base = float(np.quantile(v, 0.15 if bright else 0.85))
    extent = float(np.quantile(v, 0.995 if bright else 0.005))
    amplitude = extent - base if bright else base - extent
    if amplitude < 12:
        return None
    signal = ((v - base) if bright else (base - v)) / amplitude
    # A soft filled mask penalizes hollow/underweight glyphs as well as edges.
    return np.clip((signal - 0.2) / 0.6, 0, 1).astype(np.float32)


def bounds(a):
    y, x = np.where(a > 0.5)
    return None if len(x) == 0 else [int(x.min()), int(y.min()), int(x.max() + 1), int(y.max() + 1)]


# Regions and anchors declared before scoring. Footer parts never share a fit.
# Artist includes the artist icon; longer credits are retained within the same
# fixed region rather than silently dropped. Legal includes both physical rows.
plans = {
    'artist': {'rect': [77, 648, 196, 18], 'anchor': [77, 658], 'bright': True, 'limits': [0.85, 1.15]},
    'legal': {'rect': [277, 632, 181, 34], 'anchor': [456, 650], 'bright': True, 'limits': [0.85, 1.15]},
    'collector': {'rect': [28, 632, 48, 34], 'anchor': [30, 650], 'bright': True, 'limits': [0.85, 1.15]},
    'land-symbol': {'rect': [132, 425, 224, 188], 'anchor': [244, 518], 'bright': False, 'limits': [0.75, 1.4]},
}
rows = []
groups = {}
for e in inputs['entries']:
    n = next(v for v in native['rows'] if v['id'] == e['id'])
    s = next(v for v in scores['rows'] if v['id'] == e['id'])
    render = image(args.native / n['layers']['face']['file'], n['layers']['face']['sha256'])
    scan = image(args.scores / s['normalizedReference']['file'], s['normalizedReference']['sha256'])
    for component, plan in plans.items():
        if component == 'land-symbol' and not e['face'].get('typeLine', '').startswith('Basic Land'):
            continue
        x, y, w, h = plan['rect']
        a, b = ink(render[y:y+h, x:x+w], plan['bright']), ink(scan[y:y+h, x:x+w], plan['bright'])
        geometry = s['geometry']
        family = e['face']['typeLine'].split(' — ')[-1] if component == 'land-symbol' else ('planeswalker' if geometry.startswith('planeswalker') else 'ordinary')
        key = component + '/' + family
        row = {'id': e['id'], 'name': e['card']['name'], 'number': e['card']['collector_number'], 'component': component, 'family': family, 'referenceHash': e['reference']['sha256'], 'renderHash': n['layers']['face']['sha256'], 'normalizedHash': s['normalizedReference']['sha256'], 'poseAccepted': s['poseAccepted'], 'nonfoil': s['nonfoilEligible'], 'supported': a is not None and b is not None}
        if row['supported']:
            row.update(renderInkBounds=bounds(a), scanInkBounds=bounds(b))
            if row['poseAccepted'] and row['nonfoil']:
                groups.setdefault(key, []).append((row, a, b))
        rows.append(row)


def candidate_score(items, plan, values, save=False):
    dx, dy, sx, sy = values
    x, y, w, h = plan['rect']
    ax, ay = plan['anchor'][0] - x, plan['anchor'][1] - y
    m = np.array([[sx, 0, ax * (1 - sx) + dx], [0, sy, ay * (1 - sy) + dy]], dtype=np.float32)
    values = []
    for row, a, b in items:
        moved = cv2.warpAffine(a, m, (w, h), flags=cv2.INTER_LINEAR)
        denom = float(np.sum(moved*moved) + np.sum(b*b))
        score = float(2*np.sum(moved*b)/denom) if denom > 0 else 0
        if save:
            row['candidateScore'] = score
            row['candidateInkBounds'] = bounds(moved)
        values.append(score)
    return float(np.mean(values))


result = []
for key, items in groups.items():
    component, family = key.split('/')
    plan = plans[component]
    start = [0., 0., 1., 1.]
    base = candidate_score(items, plan, start)
    best = base
    for translation, scale in [(2., .05), (.5, .0125), (.125, .003125)]:
        for sweep in range(12):
            changed = False
            for j, step in enumerate([translation, translation, scale, scale]):
                candidates = []
                for sign in [-1, 1]:
                    v = start.copy()
                    v[j] += sign * step
                    if j < 2 and abs(v[j]) > 8:
                        continue
                    if j >= 2 and not (plan['limits'][0] <= v[j] <= plan['limits'][1]):
                        continue
                    candidates.append((candidate_score(items, plan, v), v))
                if candidates:
                    value, v = max(candidates, key=lambda v: v[0])
                    if value > best + 1e-7:
                        best, start, changed = value, v, True
            if not changed:
                break
    candidate_score(items, plan, start, save=True)
    for row, a, b in items:
        row['baselineScore'] = candidate_score([(row, a, b)], plan, [0., 0., 1., 1.])
    value = {'component': component, 'family': family, 'count': len(items), 'plan': plan, 'baseline100': 100*base, 'candidate100': 100*best, 'proposal': dict(zip(['dx','dy','scaleX','scaleY'], start)), 'boundary': abs(start[0]) >= 8 or abs(start[1]) >= 8 or any(min(abs(v-plan['limits'][0]),abs(v-plan['limits'][1])) < 0.004 for v in start[2:]), 'publicationEligible': False}
    result.append(value)
    print(json.dumps(value), flush=True)
args.output.mkdir(parents=True, exist_ok=True)
(args.output/'measurement.json').write_text(json.dumps({'schema': 1, 'source': source, 'scope': 'Complete Original census diagnostics. Shared component bitmap affine proposals only. No renderer adoption, font/shape/color certification or scan-pose refit. Foil-only sources and unsupported signal stay in rows but do not enter nonfoil fit. Normalization remains provisional; per-card results are evidence only, never render offsets.', 'plans': plans, 'groups': result, 'rows': rows}, indent=2)+'\n')
