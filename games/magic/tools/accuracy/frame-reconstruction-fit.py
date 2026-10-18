"""Offline Alpha shared-frame experiment. External PNGs remain local artifacts.

Raw scans are never resampled for the reconstruction loss. Shared geometry and
scan poses freeze before texture optimization. No per-card color or texture fits.
"""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, binary_erosion, gaussian_filter
import torch
import torch.nn.functional as F

from frame_reconstruction.geometry import (read_image, normalize, fit_geometry, sample,
    scan_card_coordinates, source_coordinates, WIDTH, HEIGHT)
from frame_reconstruction.model import color_frame, gaussian


def save(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n')


def png(path, value):
    Image.fromarray(np.round(np.clip(value, 0, 1) * 255).astype(np.uint8)).save(path)


def tensor(value):
    return torch.from_numpy(np.asarray(value, dtype=np.float32)).permute(2, 0, 1)[None]


def paper_mask(shape):
    y, x = np.mgrid[:shape[0], :shape[1]]
    rect = [.129, .595, .745, .298]
    a, b, w, h = rect
    d = np.minimum.reduce([x / shape[1] - a, a + w - x / shape[1],
                           y / shape[0] - b, b + h - y / shape[0]])
    v = np.clip(d / .002 + .5, 0, 1)
    return (v * v * (3 - 2 * v)).astype(np.float32), dict(kind='rect', rect=rect, feather=.002)


def prepare(root, source_path):
    observations = json.loads((root / 'observations.json').read_text())
    source = read_image(source_path)
    refs = [normalize(read_image(r['reference']['file']), r['normalization']['transform']['matrix'])
            for r in observations['records'] if r['cohort'] == 'calibration']
    geometry = fit_geometry(source, refs)
    save(root / 'geometry.json', geometry)
    yy, xx = np.mgrid[:HEIGHT, :WIDTH]
    sx, sy = source_coordinates(xx, yy, source.shape, geometry['knots'])
    png(root / 'geometry-frame.png', sample(source, sx, sy))
    prepared = root / 'prepared'
    prepared.mkdir(exist_ok=True)
    blank = read_image(root / 'released-frame.png')
    records = []
    for row in observations['records']:
        scan = read_image(row['reference']['file'])
        x, y = scan_card_coordinates(scan.shape, row['normalization']['transform']['matrix'])
        sx, sy = source_coordinates(x, y, source.shape, geometry['knots'])
        alpha = sample(source[..., 3:], sx, sy)[..., 0]
        old = read_image(root / row['baseline']['file'])
        bx, by = (x + .5) * old.shape[1] / WIDTH - .5, (y + .5) * old.shape[0] / HEIGHT - .5
        content = np.max(np.abs(sample(old, bx, by)[..., :3] - sample(blank, bx, by)[..., :3]), axis=-1) > .035
        # Actual ink reinforces native-render masks, including letters with
        # different scan placement. Exclude title/type/footer bands entirely.
        gray = scan[..., :3] @ np.array([.2126, .7152, .0722])
        paper = (x > 66) & (x < 423) & (y > 414) & (y < 594)
        ink = paper & (gaussian_filter(gray, .7) < .44)
        excluded = binary_dilation(content | ink, iterations=6)
        allowed = (alpha > .99) & (x > 8) & (x < 480) & (y > 9) & (y < 671)
        allowed &= ~(((y > 30) & (y < 61)) | ((y > 382) & (y < 403)) | ((y > 609) & (y < 644)))
        # Texture fit does not move keylines. Keep a halo off stock, art and
        # paper boundaries. They have an independent geometry diagnostic.
        for p in geometry['pins']:
            q = x if p['axis'] == 'x' else y
            allowed &= np.abs(q - p['target']) > 2
        mask = binary_erosion(allowed & ~excluded, iterations=5)
        grid = np.stack([2 * (sx + .5) / source.shape[1] - 1,
                         2 * (sy + .5) / source.shape[0] - 1], -1).astype(np.float32)
        target = gaussian_filter(scan[..., :3], (1.4, 1.4, 0)).astype(np.float32)
        np.savez_compressed(prepared / (row['id'] + '.npz'), grid=grid, target=target,
                            mask=mask, raw=scan[..., :3], card=np.stack([x, y], -1))
        if not records or row['cohort'] == 'validation' and len(records) < 8:
            png(prepared / (row['id'] + '-mask.png'), mask.astype(float))
        records.append(dict(id=row['id'], name=row['name'], cohort=row['cohort'], pixels=int(mask.sum())))
    save(root / 'preparation.json', dict(records=records, source=str(source_path.relative_to(root)),
         sourceSha256=hashlib.sha256(source_path.read_bytes()).hexdigest(),
         policy='Native scans; identical frozen masks; 1.4px matched lowpass; no per-card color fits'))
    print(json.dumps(dict(prepared=len(records), geometry=geometry)), flush=True)


def load_patches(root, records, count=6):
    patches = []
    rng = np.random.default_rng(1903)
    for row in records:
        with np.load(root / 'prepared' / (row['id'] + '.npz')) as data:
            mask, grid, raw = data['mask'], data['grid'], data['raw']
            # Fixed coverage-stratified native patches: top/bottom side frame,
            # paper and stock. All eligible pixels also enter final evaluation.
            choices = []
            for y0 in range(0, mask.shape[0] - 128, 96):
                for x0 in range(0, mask.shape[1] - 128, 96):
                    if mask[y0:y0+128, x0:x0+128].sum() > 1800:
                        choices.append((y0, x0))
            rng.shuffle(choices)
            for y0, x0 in choices[:count]:
                sl = np.s_[y0:y0+128, x0:x0+128]
                m = mask[sl].copy()
                m[:5] = m[-5:] = False
                m[:, :5] = m[:, -5:] = False
                patches.append((torch.from_numpy(grid[sl].copy())[None],
                                gaussian(tensor(raw[sl].copy()), 1.4), tensor(m[..., None])))
    return patches


def fit(root, source_path, steps, all_cards=False):
    prep = json.loads((root / 'preparation.json').read_text())
    source = read_image(source_path)
    original = tensor(source[..., :3])
    mask, spec = paper_mask(source.shape)
    paper = tensor(mask[..., None])
    records = [r for r in prep['records'] if all_cards or r['cohort'] == 'calibration']
    patches = load_patches(root, records)
    # Shared restrained source calibration, fitted once. The texture stage
    # keeps it fixed so a second tone model cannot conceal texture errors.
    parameters = torch.nn.Parameter(torch.zeros(2, 3))
    optimizer = torch.optim.Adam([parameters], lr=.015)
    def adjustment():
        out = {'mask': spec}
        for j, key in enumerate(['frame', 'paper']):
            out[key] = dict(hueDegrees=parameters[j, 0] * 15,
                            saturationScale=parameters[j, 1].exp(),
                            brightnessScale=parameters[j, 2].exp())
        return out
    rng = np.random.default_rng(123)
    def loss_on(frame, indices):
        terms = []
        for k in indices:
            grid, target, valid = patches[k]
            prediction = gaussian(F.grid_sample(frame, grid, align_corners=False, padding_mode='border'), 1.4)
            loss = F.huber_loss(prediction, target, reduction='none', delta=.035)
            terms.append((loss * valid).sum() / (valid.sum() * 3).clamp_min(1))
        return torch.stack(terms).mean()
    for iteration in range(80):
        optimizer.zero_grad()
        loss = loss_on(color_frame(original, adjustment(), paper), rng.choice(len(patches), 8, replace=False))
        loss.backward()
        optimizer.step()
        with torch.no_grad():
            parameters[:, 0].clamp_(-1, 1)
            parameters[:, 1].clamp_(-.8, .5)
            parameters[:, 2].clamp_(-.25, .2)
        if iteration % 20 == 0:
            print(json.dumps(dict(phase='color', step=iteration, loss=float(loss))), flush=True)
    fixed = {k: {n: float(v.detach()) for n, v in values.items()} if k != 'mask' else values
             for k, values in adjustment().items()}
    label = 'all' if all_cards else 'train'
    save(root / f'{label}-adjustment.json', fixed)
    calibrated = color_frame(original, fixed, paper).detach()
    png(root / f'{label}-calibrated-material.png', np.concatenate([calibrated[0].permute(1, 2, 0).numpy(), source[..., 3:]], -1))
    # A low-resolution residual excludes scanner dots by construction; the
    # clean source retains its existing high-frequency detail. No learned alpha.
    delta = torch.nn.Parameter(torch.zeros(1, 3, 185, 133))
    optimizer = torch.optim.Adam([delta], lr=.012)
    history = []
    for iteration in range(steps):
        optimizer.zero_grad()
        residual = F.interpolate(delta, original.shape[2:], mode='bicubic', align_corners=False)
        candidate = (original + residual).clamp(0, 1)
        frame = color_frame(candidate, fixed, paper)
        data_loss = loss_on(frame, rng.choice(len(patches), 8, replace=False))
        prior = .004 * delta.square().mean()
        smooth = .006 * ((delta[:, :, 1:] - delta[:, :, :-1]).square().mean()
                        + (delta[:, :, :, 1:] - delta[:, :, :, :-1]).square().mean())
        loss = data_loss + prior + smooth
        loss.backward()
        optimizer.step()
        with torch.no_grad():
            delta.clamp_(-.16, .16)
        if iteration % 20 == 0 or iteration == steps - 1:
            row = dict(step=iteration, data=float(data_loss), prior=float(prior), smooth=float(smooth))
            history.append(row)
            print(json.dumps(dict(phase='texture', **row)), flush=True)
    with torch.no_grad():
        residual = F.interpolate(delta, original.shape[2:], mode='bicubic', align_corners=False)
        candidate = (original + residual).clamp(0, 1)
        frame = color_frame(candidate, fixed, paper)
    for name, value in [('reconstructed-source', candidate), ('reconstructed-material', frame)]:
        png(root / f'{label}-{name}.png', np.concatenate([value[0].permute(1, 2, 0).numpy(), source[..., 3:]], -1))
    save(root / f'{label}-fit.json', dict(steps=steps, cards=len(records), patches=len(patches),
         residualGrid=[133, 185], maximumSourceChange=.16, history=history,
         policy='Fixed shared HSB; native scan patches; no per-card learned parameters; alpha unchanged'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('phase', choices=['prepare', 'fit'])
    parser.add_argument('directory', type=Path)
    parser.add_argument('--steps', type=int, default=160)
    parser.add_argument('--all', action='store_true')
    args = parser.parse_args()
    torch.set_num_threads(2)
    torch.manual_seed(123)
    root = args.directory
    source = root / 'inputs/sharpened-frames/alpha-white-frame.png'
    if args.phase == 'prepare':
        prepare(root, source)
    else:
        fit(root, source, args.steps, args.all)
