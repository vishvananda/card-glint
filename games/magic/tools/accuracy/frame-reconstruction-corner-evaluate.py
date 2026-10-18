"""Evaluate corrected-border candidates on frozen native scans and masks."""
import argparse
import importlib.util
import json
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path

import numpy as np
from scipy.ndimage import binary_dilation, gaussian_filter

from frame_reconstruction.geometry import read_image, sample


def module(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(name + '.py'))
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


evaluate = module('frame-reconstruction-evaluate')
refine = module('frame-reconstruction-refine')


def evaluate_row(job):
    root, row, candidates = job
    with np.load(root / 'prepared' / (row['id'] + '.npz')) as data:
        raw, old_mask, card = data['raw'], data['mask'], data['card']
    baseline = read_image(root / 'corners-native' / (row['id'] + '-0.png'))
    plate = refine.resize(read_image(root / candidates[0]['file']), baseline.shape[1], baseline.shape[0])
    # Exclude the actual replayed lettering as well as the existing scan/native
    # masks. Text layout stays fixed but differs from the historical preparation.
    content = np.max(np.abs(baseline[..., :3] - plate[..., :3]), axis=-1) > .035
    x = (card[..., 0] + .5) * baseline.shape[1] / 488 - .5
    y = (card[..., 1] + .5) * baseline.shape[0] / 680 - .5
    projected_ink = sample(content[..., None].astype(float), x, y)[..., 0] > .05
    trusted = old_mask & ~binary_dilation(projected_ink, iterations=6)
    cx, cy = card[..., 0] + .5, card[..., 1] + .5
    paper = (cx > 66) & (cx < 423) & (cy > 414) & (cy < 594)
    # Fixed rectangles cover the inner printed band, not cut-edge alpha. These
    # masks are identical across candidates and do not threshold bright marks.
    stock = ((cx > 11) & (cx < 477) & (cy > 16) & (cy < 665)
             & ((cx < 24) | (cx > 464) | (cy < 26) | (cy > 651)))
    corners = stock & ((cx < 32) | (cx > 456)) & ((cy < 38) | (cy > 639))
    masks = dict(frame=trusted & ~paper & (raw.max(-1) > .3), paper=trusted & paper,
                 combined=trusted & (raw.max(-1) > .3), band=stock & ~corners,
                 cornerMarks=corners)
    for name, mask in masks.items():
        if mask.sum() < 100:
            raise ValueError(f'Insufficient {name} pixels: {row["name"]}')
    reference = evaluate.reference_statistics(raw, masks)
    variants = {}
    for i, candidate in enumerate(candidates):
        native = read_image(root / 'corners-native' / f"{row['id']}-{i}.png")
        if not np.array_equal(native[..., 3], baseline[..., 3]):
            raise ValueError('Candidate changed silhouette')
        predicted = sample(native, x, y)[..., :3]
        result = evaluate.compare_statistics(reference, predicted)
        for name, mask in masks.items():
            result[name]['unfilteredRgbMae255'] = float(np.abs(raw - predicted)[mask].mean() * 255)
        # A second corner diagnostic isolates bright ink geometry so large dark
        # areas cannot conceal missing or oversized corner marks.
        coefficients = np.array([.2126, .7152, .0722])
        a = (gaussian_filter(raw @ coefficients, .6) > .28) & corners
        b = (gaussian_filter(predicted @ coefficients, .6) > .28) & corners
        denominator = int(a.sum() + b.sum())
        result['cornerMarks']['brightDice100'] = (float(200 * (a & b).sum() / denominator)
                                                  if denominator else None)
        result['cornerMarks']['brightPixels'] = dict(reference=int(a.sum()), candidate=int(b.sum()))
        variants[candidate['key']] = result
    return dict(id=row['id'], name=row['name'], cohort=row['cohort'],
                pixels={k: int(v.sum()) for k, v in masks.items()}, variants=variants)


def run(root, workers):
    observations = json.loads((root / 'observations.json').read_text())['records']
    candidates = json.loads((root / 'candidates.json').read_text())['candidates']
    rows = []
    checkpoints = root / 'regional-rows'
    checkpoints.mkdir(exist_ok=True)
    with ProcessPoolExecutor(max_workers=workers) as pool:
        for row in pool.map(evaluate_row, [(root, r, candidates) for r in observations]):
            rows.append(row)
            evaluate.save(checkpoints / (row['id'] + '.json'), row)
            print(f'{len(rows)}/{len(observations)} {row["name"]}', flush=True)
    groups = {}
    for cohort in ['calibration', 'validation', 'all']:
        subset = [r for r in rows if cohort == 'all' or r['cohort'] == cohort]
        variants = {}
        for candidate in candidates:
            key = candidate['key']
            variants[key] = {}
            for region in ['frame', 'paper', 'combined', 'band', 'cornerMarks']:
                variants[key][region] = {
                    metric: float(np.mean([r['variants'][key][region]['1.4'][metric] for r in subset]))
                    for metric in ['structure100', 'rgbMae255']}
                variants[key][region]['unfilteredRgbMae255'] = float(np.mean([
                    r['variants'][key][region]['unfilteredRgbMae255'] for r in subset]))
                if region == 'cornerMarks':
                    dice = [r['variants'][key][region]['brightDice100'] for r in subset
                            if r['variants'][key][region]['brightDice100'] is not None]
                    variants[key][region]['brightDice100'] = float(np.mean(dice)) if dice else None
        groups[cohort] = dict(cards=len(subset), variants=variants)
    evaluate.save(root / 'regional-evaluation.json', dict(groups=groups, rows=rows,
        metric='Masked contrast/structure and RGB error; identical masks; candidate projected into native scan',
        limitations='Development comparison, not independent validation. Reference-derived illustration excluded. Corner marks are separate from silhouette.',
        inputRevision='alpha-white-original-wording-v2'))
    print(json.dumps(groups, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', type=Path)
    parser.add_argument('--workers', type=int, choices=[1, 2], default=2)
    args = parser.parse_args()
    run(args.root, args.workers)
