"""Refit a corrected Alpha border and refine the complete shared frame.

Frozen scan poses and original-wording renders remain controls. Geometry moves
only four outer border edges; the white frame/keyline is fixed. Backpropagation
uses separate bounded scalar fields for trusted white texture and printed stock.
"""
import argparse
import importlib.util
import json
from pathlib import Path

import numpy as np
from scipy.ndimage import gaussian_filter
from scipy.optimize import minimize
import torch
import torch.nn.functional as F

from frame_reconstruction.geometry import read_image, sample
from frame_reconstruction.model import gaussian


def module(name):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(name + '.py'))
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result


refine = module('frame-reconstruction-refine')
border = module('frame-reconstruction-inner-border')
W, H = 732, 1020


def compose(base, layer, weight, outer):
    result = base.copy()
    neutral = base[..., :3] * (1 - weight) + np.asarray(outer) / 255 * weight
    alpha = layer[..., 3:] * weight
    result[..., :3] = neutral * (1 - alpha) + layer[..., :3] * alpha
    return result


def shifted_knots(geometry, delta):
    x = np.array(geometry['x'], dtype=float)
    y = np.array(geometry['y'], dtype=float)
    x[1, 1] += delta[0]
    x[-2, 1] += delta[1]
    y[1, 1] += delta[2]
    y[-2, 1] += delta[3]
    if not np.all(np.diff(x, axis=0) > 0) or not np.all(np.diff(y, axis=0) > 0):
        raise ValueError('Non-monotone border geometry')
    return x, y


def refit_geometry(source, base, weight, outer, geometry, target, valid, corners, offset):
    x, y = border.grid(W, H)
    # Sparse samples on the four strips, with a separate corner term so the
    # small intrinsic marks are not overwhelmed by the long dark bands.
    yy, xx = np.mgrid[:H, :W]
    selected = valid & (((yy % 3 == 0) & (xx % 3 == 0)) | corners)
    px, py = x[selected], y[selected]
    fixed = refine.resize(base, W, H)[..., :3][selected]
    stock = refine.resize(weight, W, H)[selected]
    neutral = fixed * (1 - stock) + np.asarray(outer) / 255 * stock
    reference = gaussian_filter(target, (.6, .6, 0))[selected]
    local_corners = corners[selected]
    premult = np.concatenate([source[..., :3] * source[..., 3:], source[..., 3:]], -1)
    h, w = source.shape[:2]

    def objective(delta):
        xk, yk = shifted_knots(geometry, delta)
        sx = np.interp(px, xk[:, 1], xk[:, 0]) * w / 488 - .5
        sy = np.interp(py, yk[:, 1], yk[:, 0]) * h / 680 - .5
        value = sample(premult, sx, sy)
        rgb = np.clip(value[..., :3] / value[..., 3:].clip(1e-8) + offset, 0, 1)
        alpha = value[..., 3:] * stock
        prediction = neutral * (1 - alpha) + rgb * alpha
        error = np.sqrt((prediction - reference) ** 2 + .008 ** 2) - .008
        return float(error[~local_corners].mean() + error[local_corners].mean()
                     + .00015 * np.square(delta).mean())

    initial = np.zeros(4)
    result = minimize(objective, initial, method='Powell', bounds=[(-1.5, 1.5)] * 4,
                      options=dict(xtol=.015, ftol=1e-5, maxiter=12))
    if not result.success or objective(result.x) > objective(initial):
        raise ValueError(f'Border geometry fit failed: {result.message}')
    if np.max(np.abs(result.x)) > 1.48:
        raise ValueError('Border geometry fit touches search bound')
    xk, yk = shifted_knots(geometry, result.x)
    layer = border.remap(source, xk, yk)
    layer[..., :3] = np.clip(layer[..., :3] + offset, 0, 1)
    receipt = dict(deltaOuterEdgesCanonical=result.x.tolist(),
                   order=['left', 'right', 'top', 'bottom'],
                   before=objective(initial), after=objective(result.x),
                   evaluations=int(result.nfev), geometry=dict(x=xk.tolist(), y=yk.tolist()),
                   policy='One shared outer rectangle; inner frame keyline and scan poses frozen')
    return layer, receipt


def bounded_refinement(base, target, supports, steps, sigma):
    coefficients = np.array([.2126, .7152, .0722], np.float32)
    src = refine.tensor((base[..., :3] @ coefficients)[..., None])
    ref = refine.tensor((target @ coefficients)[..., None])
    masks = [refine.tensor(m[..., None]) for m in supports]
    delta = torch.nn.Parameter(torch.zeros(1, 2, 340, 244))
    caps = torch.tensor([.025, .035])[None, :, None, None]
    optimizer = torch.optim.Adam([delta], lr=.004)
    source_filtered = gaussian(src, float(np.hypot(sigma, 1.4))).detach()
    target_filtered = gaussian(ref, 1.4).detach()
    history = []
    for step in range(steps):
        optimizer.zero_grad()
        fields = F.interpolate(delta, (H, W), mode='bicubic', align_corners=False)
        # Limit the interpolated field as well: bicubic overshoot must not
        # bypass the advertised per-layer correction bounds.
        fields = torch.maximum(-caps, torch.minimum(caps, fields))
        residual = sum(fields[:, i:i+1] * mask for i, mask in enumerate(masks))
        prediction = source_filtered + gaussian(residual, float(np.hypot(sigma, 1.4)))
        error = F.huber_loss(prediction, target_filtered, reduction='none', delta=.035)
        terms = [(error * mask).sum() / mask.sum().clamp_min(1) for mask in masks]
        smooth = ((delta[:, :, 1:] - delta[:, :, :-1]).square().mean()
                  + (delta[:, :, :, 1:] - delta[:, :, :, :-1]).square().mean())
        loss = sum(terms) + .008 * smooth + .005 * delta.square().mean()
        loss.backward()
        optimizer.step()
        with torch.no_grad():
            delta.copy_(torch.maximum(-caps, torch.minimum(caps, delta)))
        if step % 20 == 0 or step == steps - 1:
            item = dict(step=step, frame=float(terms[0].detach()), band=float(terms[1].detach()))
            history.append(item)
            print('Joint refinement', item, flush=True)
    fields = refine.array(F.interpolate(delta, (H, W), mode='bicubic', align_corners=False))
    fields = np.clip(fields, -np.array([.025, .035]), np.array([.025, .035]))
    corrections = [fields[..., i] * mask for i, mask in enumerate(supports)]
    return corrections, dict(steps=steps, sigmaNativePixels=sigma, history=history,
                             caps=[.025, .035], grid=[244, 340],
                             policy='Warm-start bounded luminance fields; fixed color, alpha, scan poses and geometry; independent frame and band support')


def export_layers(out, base, layer, stock, fields, outer):
    frame = base.copy()
    # The independent white material is not attenuated by either stock layer.
    frame_gain = (1 - stock) * (1 - layer[..., 3:] * stock)
    if np.any((np.abs(fields[0]) > 1e-7) & (frame_gain < .01)):
        raise ValueError('White correction overlaps the stock layer')
    frame[..., :3] = np.clip(base[..., :3] + fields[0] / frame_gain.clip(.01), 0, 1)
    overlay = layer.copy()
    alpha = layer[..., 3:] * stock
    if np.any((np.abs(fields[1]) > 1e-7) & (alpha < .01)):
        raise ValueError('Border correction extends outside the layer')
    overlay[..., :3] = np.clip(layer[..., :3] + fields[1] / alpha.clip(.01), 0, 1)
    expected = compose(base, layer, stock, outer)
    expected[..., :3] = np.clip(expected[..., :3] + sum(fields), 0, 1)
    recomposed = compose(frame, overlay, stock, outer)
    if np.max(np.abs(expected - recomposed)) > 1 / 255:
        raise ValueError('Split-layer export differs from the fitted composite')
    refine.save_png(out / 'white-texture-plate.png', frame)
    refine.save_png(out / 'backprop-overlay.png', overlay)


def run(root, steps):
    out = root / 'joint'
    out.mkdir(exist_ok=True)
    observations = json.loads((root / 'observations.json').read_text())['records']
    train = [r for r in observations if r['cohort'] == 'calibration']
    base = read_image(root / 'refine/blur-aware-plate.png')
    source = read_image(root / 'inputs/inner-border/alpha-inner-border-sharpened.png')
    stock = read_image(root / 'border/stock-mask.png')[..., :1]
    fit = json.loads((root / 'inner-border/fit.json').read_text())
    prior = json.loads((root / 'border/fit.json').read_text())
    x, y = border.grid(W, H)
    # Covers printed band and a narrow halo, without title/footer or cut corners.
    region = ((x > 11) & (x < 477) & (y > 16) & (y < 665)
              & ((x < 30) | (x > 458) | (y < 33) | (y > 643)))
    corners = region & ((x < 32) | (x > 456)) & ((y < 38) | (y > 639))
    values = []
    for row in train:
        a = read_image(root / 'art-source' / f"{row['id']}-reference.png")
        values.append(a[..., :3][region])
    values = np.stack(values)
    median = np.median(values, axis=0)
    mad = np.median(np.abs(values - median), axis=0).mean(-1)
    target = refine.resize(base, W, H)[..., :3].copy()
    target[region] = median
    agreement = np.zeros((H, W), np.float32)
    agreement[region] = np.clip((.10 - mad) / .08, 0, 1)
    valid = region & (refine.resize(stock, W, H)[..., 0] > .98)
    layer, geometry_receipt = refit_geometry(source, base, stock, prior['outerRgb255'],
        fit['geometry'], target, valid, corners, np.array(fit['offsetRgb255']) / 255)
    full = compose(base, layer, stock, prior['outerRgb255'])
    refine.save_png(out / 'geometry-plate.png', full)
    refine.save_png(out / 'geometry-overlay.png', layer)
    refine.save_json(out / 'geometry.json', geometry_receipt)
    print('Geometry', geometry_receipt, flush=True)
    # Reuse the exact old trusted frame target/mask, adding independent stock
    # observations. Outside these regions the target equals the fixed composite.
    with np.load(root / 'refine/consensus.npz') as data:
        frame_support = data['support'].copy()
        frame_target = data['target'].copy()
    small = refine.resize(full, W, H)
    target = np.where((frame_support > 0)[..., None], frame_target, small[..., :3])
    target[region] = median
    alpha = refine.resize(layer, W, H)[..., 3]
    band_support = agreement * valid * (alpha > .97)
    # The two models must never make competing corrections at the same pixel.
    frame_support[valid] = 0
    assert not np.any((frame_support > 0) & (band_support > 0))
    sigma = json.loads((root / 'refine/blur.json').read_text())['sigmaNativePixels']
    corrections, refinement = bounded_refinement(small, target, [frame_support, band_support], steps, sigma)
    exported = []
    full_alpha = layer[..., 3:] * stock
    full_frame_gain = (1 - stock) * (1 - full_alpha)
    for index, (delta, support, cap) in enumerate(zip(corrections, [frame_support, band_support], [.025, .035])):
        correction = refine.resize(delta[..., None], full.shape[1], full.shape[0])
        # Hard support after resizing prevents corrections bleeding into excluded
        # lettering/art, the outer stock, or the other layer.
        allowed = refine.resize(support[..., None], full.shape[1], full.shape[0]) > 0
        # The high-resolution layer has a sharper alpha edge than the native
        # training grid. Reapply its coverage, rather than extending a resized
        # residual across a transparent/antialiased edge.
        allowed &= (full_frame_gain > .99) if index == 0 else (full_alpha > .97)
        exported.append(np.clip(correction, -cap, cap) * allowed)
    adjusted = full.copy()
    adjusted[..., :3] = np.clip(full[..., :3] + sum(exported), 0, 1)
    band_only = full.copy()
    band_only[..., :3] = np.clip(full[..., :3] + exported[1], 0, 1)
    assert np.array_equal(adjusted[..., 3], full[..., 3])
    for name, value in [('backprop-plate', adjusted), ('band-only-plate', band_only),
                        ('frame-support', frame_support), ('band-support', band_support),
                        ('training-target', target)]:
        refine.save_png(out / (name + '.png'), value)
    np.savez_compressed(out / 'fields.npz', frame=exported[0], band=exported[1])
    export_layers(out, base, layer, stock, exported, prior['outerRgb255'])
    refine.save_json(out / 'fit.json', dict(calibrationIds=[r['id'] for r in train],
        geometry=geometry_receipt, refinement=refinement,
        frameSupportPixels=int((frame_support > 0).sum()), bandSupportPixels=int((band_support > 0).sum()),
        inputRevision='alpha-white-original-wording-v2', runtimeChanges=False))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('root', type=Path)
    parser.add_argument('--steps', type=int, default=80)
    args = parser.parse_args()
    torch.set_num_threads(2)
    torch.manual_seed(321)
    run(args.root, args.steps)
