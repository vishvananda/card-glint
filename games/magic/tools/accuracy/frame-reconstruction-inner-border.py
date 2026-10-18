"""Evaluate a supplied separate inner-border layer with frozen Alpha poses.

The overlay has its own shared geometry and additive RGB offset. Frame pigment,
outer stock, illustration, and lettering are never part of this color fit.
"""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from frame_reconstruction.geometry import read_image, sample


def save(path, data):
    Image.fromarray(np.round(np.clip(data, 0, 1) * 255).astype('uint8')).save(path)


def grid(w, h):
    y, x = np.mgrid[:h, :w]
    return (x + .5) * 488 / w, (y + .5) * 680 / h


def remap(image, xknots, yknots):
    h, w = image.shape[:2]
    x, y = grid(w, h)
    sx = np.interp(x, np.array(xknots)[:, 1], np.array(xknots)[:, 0]) * w / 488 - .5
    sy = np.interp(y, np.array(yknots)[:, 1], np.array(yknots)[:, 0]) * h / 680 - .5
    a = image[..., 3:]
    premultiplied = np.concatenate([image[..., :3] * a, a], -1)
    result = sample(premultiplied, sx, sy)
    result[..., :3] /= np.maximum(result[..., 3:], 1e-8)
    return result


def run(root):
    out = root / 'inner-border'
    out.mkdir(exist_ok=True)
    source = root / 'inputs/inner-border/alpha-inner-border-sharpened.png'
    overlay = read_image(source)
    base = read_image(root / 'refine/blur-aware-plate.png')
    assert base.shape == overlay.shape
    weight = read_image(root / 'border/stock-mask.png')[..., :1]
    border = json.loads((root / 'border/fit.json').read_text())
    geometry = json.loads((root / 'geometry.json').read_text())
    pins = {p['key']: p['target'] for p in geometry['pins']}
    edges = border['bandInsets']
    # The original overlay was registered against land plates. Reuse the
    # independently measured white frame and printed-band boundaries; no
    # per-card geometry or texture optimization is introduced here.
    xknots = [[0, 0], [33.5 * 488 / 1062, edges['left']],
              [56.5 * 488 / 1062, pins['stock-left']],
              [1005 * 488 / 1062, pins['stock-right']],
              [1028 * 488 / 1062, 488 - edges['right']], [488, 488]]
    yknots = [[0, 0], [44.5 * 680 / 1482, edges['top']],
              [61.5 * 680 / 1482, pins['stock-top']],
              [1417 * 680 / 1482, pins['stock-bottom']],
              [1438 * 680 / 1482, 680 - edges['bottom']], [680, 680]]
    for knots in [xknots, yknots]:
        assert np.all(np.diff(np.array(knots), axis=0) > 0)
    fitted = remap(overlay, xknots, yknots)
    rows = json.loads((root / 'observations.json').read_text())['records']
    x, y = grid(732, 1020)
    # Interior of the four ink strips, away from both edges and all corners.
    mask = ((((x > edges['left'] + 1) & (x < pins['stock-left'] - 1)) |
             ((x > pins['stock-right'] + 1) & (x < 487 - edges['right']))) &
            (y > 65) & (y < 615))
    mask |= ((((y > edges['top'] + 1) & (y < pins['stock-top'] - 1)) |
              ((y > pins['stock-bottom'] + 1) & (y < 679 - edges['bottom']))) &
             (x > 65) & (x < 423))
    h, w = fitted.shape[:2]
    sampled = sample(fitted, x * w / 488 - .5, y * h / 680 - .5)
    mask &= sampled[..., 3] > .98
    assert mask.sum() > 5000
    source_median = np.median(sampled[..., :3][mask], axis=0)
    targets = {}
    for row in rows:
        ref = read_image(root / 'art-source' / f"{row['id']}-reference.png")
        targets[row['id']] = ref[..., :3][mask]
    training = [np.median(targets[r['id']], axis=0) for r in rows if r['cohort'] == 'calibration']
    target_median = np.median(training, axis=0)
    offset = np.clip(target_median - source_median, -10 / 255, 10 / 255)
    toned = fitted.copy()
    toned[..., :3] = np.clip(toned[..., :3] + offset, 0, 1)
    neutral = base.copy()
    neutral[..., :3] = base[..., :3] * (1 - weight) + np.array(border['outerRgb255']) / 255 * weight
    result_rows = []
    variants = {'supplied': overlay, 'geometry': fitted, 'tone': toned}
    candidates = []
    for key, layer in variants.items():
        result = neutral.copy()
        alpha = layer[..., 3:] * weight
        result[..., :3] = result[..., :3] * (1 - alpha) + layer[..., :3] * alpha
        assert np.array_equal(result[..., 3], base[..., 3])
        assert np.array_equal(result[weight[..., 0] == 0], base[weight[..., 0] == 0])
        save(out / f'{key}-plate.png', result)
        save(out / f'{key}-overlay.png', layer)
        # Independent layer comparison, before native replay below.
        small = sample(result, x * w / 488 - .5, y * h / 680 - .5)
        for row in rows:
            result_rows.append(dict(id=row['id'], name=row['name'], cohort=row['cohort'], variant=key,
                                   innerRgbMae255=float(np.abs(small[..., :3][mask] - targets[row['id']]).mean() * 255)))
        candidates.append(dict(key=f'inner-{key}', title=f'Supplied inner border · {key}',
                               file=f'inner-border/{key}-plate.png', cornerRadius=border['cornerRadius']))
    groups = {cohort: {key: float(np.mean([r['innerRgbMae255'] for r in result_rows
                                          if r['variant'] == key and (cohort == 'all' or r['cohort'] == cohort)]))
                       for key in variants} for cohort in ['calibration', 'validation', 'all']}
    receipt = dict(sourceSha256=hashlib.sha256(source.read_bytes()).hexdigest(),
                   sourceCanvas=[w, h], calibrationCards=len(training),
                   policy='Shared white-band geometry from the prior frozen fit; independent robust RGB offset from 34 white cards. No outer-stock, frame, illustration, text, or scan-transform adjustment.',
                   geometry=dict(x=xknots, y=yknots), sourceMedianRgb255=(source_median * 255).tolist(),
                   targetMedianRgb255=(target_median * 255).tolist(), offsetRgb255=(offset * 255).tolist(),
                   scoredPixels=int(mask.sum()), groups=groups, rows=result_rows)
    (out / 'fit.json').write_text(json.dumps(receipt, indent=2) + '\n')
    (out / 'candidates.json').write_text(json.dumps(dict(candidates=candidates), indent=2) + '\n')
    print(json.dumps({k: v for k, v in receipt.items() if k not in ['rows', 'geometry']}, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', type=Path)
    run(parser.parse_args().root)
