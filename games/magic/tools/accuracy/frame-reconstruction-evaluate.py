"""Evaluate native full cards using identical frozen frame-only support."""
import argparse
import json
from pathlib import Path
import numpy as np
from scipy.ndimage import gaussian_filter, maximum_filter
from PIL import Image
from frame_reconstruction.geometry import read_image, normalize, sample, profiles, WINDOWS, correlation


def save(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n')


def png(path, value):
    Image.fromarray(np.round(np.clip(value, 0, 1) * 255).astype(np.uint8)).save(path)


def filter_image(image):
    result = {}
    for sigma in [1.4, 3.0]:
        value = gaussian_filter(image, (sigma, sigma, 0))
        gray = (.2126 * value[..., 0] + .7152 * value[..., 1] + .0722 * value[..., 2])[::2, ::2]
        result[str(sigma)] = (value, gray)
    return result


def reference_statistics(scan, masks):
    result = {}
    for scale, (a, ag) in filter_image(scan).items():
        parts = {}
        for name, mask in masks.items():
            small = mask[::2, ::2]
            weight = gaussian_filter(small.astype(float), 2.5).clip(1e-8)
            ma = gaussian_filter(ag * small, 2.5) / weight
            va = np.maximum(0, gaussian_filter(ag * ag * small, 2.5) / weight - ma * ma)
            parts[name] = (mask, small, weight, ma, va)
        result[scale] = (a, ag, parts)
    return result


def compare_statistics(reference, predicted):
    result = {}
    for scale, (b, bg) in filter_image(predicted).items():
        a, ag, parts = reference[scale]
        error = np.abs(a - b)
        for name, (mask, small, weight, ma, va) in parts.items():
            # Mask-normalized local moments exclude letters/art from the SSIM
            # window. Fixed 2x decimation follows matched native filtering.
            mb = gaussian_filter(bg * small, 2.5) / weight
            vb = np.maximum(0, gaussian_filter(bg * bg * small, 2.5) / weight - mb * mb)
            cov = gaussian_filter(ag * bg * small, 2.5) / weight - ma * mb
            cs = (2 * cov + .03 ** 2) / (va + vb + .03 ** 2)
            result.setdefault(name, {})[scale] = dict(
                structure100=float(100 * np.mean(cs[small])),
                rgbMae255=float(255 * error[mask].mean()),
                rgbRmse255=float(255 * np.sqrt((error[mask] ** 2).mean())))
    return result


def boundary_metrics(scan, render):
    ref, src = profiles(scan), profiles(render)
    result = {}
    for key, (_, lo, hi, _, _) in WINDOWS.items():
        positions = np.arange(lo, hi + 1)
        # Avoid illustrations: each boundary has a fixed frame-side interval.
        if key == 'art-left': positions = positions[positions < 57]
        if key == 'art-right': positions = positions[positions > 433]
        if key == 'art-top': positions = positions[positions < 68]
        if key == 'art-bottom': positions = positions[positions > 369]
        shifts = np.arange(-4, 4.001, .125)
        scores = [correlation(ref[key], src[key], positions, s) for s in shifts]
        result[key] = dict(correlation=correlation(ref[key], src[key], positions),
                           bestShift=float(shifts[np.argmax(scores)]))
    return result


def spectrum(samples):
    powers = []
    for scan, mask in samples:
        gray = scan @ np.array([.2126, .7152, .0722])
        for y in range(0, gray.shape[0]-64, 32):
            for x in range(0, gray.shape[1]-64, 32):
                if mask[y:y+64, x:x+64].mean() < .96:
                    continue
                a = gray[y:y+64, x:x+64]
                a = (a - gaussian_filter(a, 3)) * np.outer(np.hanning(64), np.hanning(64))
                powers.append(np.abs(np.fft.fftshift(np.fft.fft2(a))) ** 2)
                if len(powers) >= 120:
                    break
            if len(powers) >= 120:
                break
    if not powers:
        return dict(patches=0)
    power = np.median(powers, axis=0)
    f = np.fft.fftshift(np.fft.fftfreq(64))
    y, x = np.meshgrid(f, f, indexing='ij')
    eligible = (np.hypot(x, y) > .15) & (x >= 0)
    peaks = eligible & (power == maximum_filter(power, 5))
    points = sorted(zip(*np.where(peaks)), key=lambda p: power[p], reverse=True)[:6]
    return dict(patches=len(powers), method='Median 64px Hann-window spectra; diagnostic, not physical ink separation',
                peaks=[dict(fx=float(x[p]), fy=float(y[p]), energy=float(power[p]),
                            gaussian1_4Amplitude=float(np.exp(-2*np.pi**2*1.4**2*(x[p]**2+y[p]**2)))) for p in points])


def evaluate_row(job):
    root, label, i, row = job
    gallery = root / f'{label}-gallery'
    with np.load(root / 'prepared' / (row['id'] + '.npz')) as data:
        scan, mask, card = data['raw'], data['mask'], data['card']
    source_ref = read_image(row['reference']['file'])
    normalized_scan = normalize(source_ref, row['normalization']['transform']['matrix'])
    values = {}
    outputs = [('released', root / row['baseline']['file']),
               ('calibrated', root / f'{label}-native' / f'{row["id"]}-0.png'),
               ('reconstructed', root / f'{label}-native' / f'{row["id"]}-1.png')]
    paper = (card[..., 0] > 66) & (card[..., 0] < 423) & (card[..., 1] > 414) & (card[..., 1] < 594)
    material = gaussian_filter(scan.max(-1), 1.4) > .3
    frame = mask & material & ~paper
    inside = mask & paper
    whole = mask & material
    reference = reference_statistics(scan, dict(frame=frame, paper=inside, combined=whole))
    normalized = {}
    for name, path in outputs:
        image = read_image(path)
        x = (card[..., 0] + .5) * image.shape[1] / 488 - .5
        y = (card[..., 1] + .5) * image.shape[0] / 680 - .5
        predicted = sample(image, x, y)[..., :3]
        norm = normalize(image, [1,0,0,1,0,0])
        normalized[name] = norm
        boundaries = boundary_metrics(normalized_scan, norm)
        values[name] = dict(**compare_statistics(reference, predicted), boundaries=boundaries,
                            boundaryCorrelation100=float(100*np.mean([b['correlation'] for b in boundaries.values()])),
                            medianBoundaryShiftPx=float(np.median([abs(b['bestShift']) for b in boundaries.values()])))
    result = dict(id=row['id'], name=row['name'], cohort=row['cohort'], values=values)
    png(gallery / f'{row["id"]}-scan.png', normalized_scan)
    for name, image in normalized.items():
        png(gallery / f'{row["id"]}-{name}.png', image)
    return result


def evaluate(root, label, workers):
    from concurrent.futures import ProcessPoolExecutor
    observations = json.loads((root / 'observations.json').read_text())
    rows, spectral_samples = [], []
    gallery = root / f'{label}-gallery'
    gallery.mkdir(exist_ok=True)
    jobs = [(root, label, i, row) for i, row in enumerate(observations['records'])]
    with ProcessPoolExecutor(max_workers=workers) as pool:
        for row in pool.map(evaluate_row, jobs):
            rows.append(row)
            print(f'{len(rows)}/{len(jobs)} {row["name"]}', flush=True)
    for row in observations['records'][:12]:
        with np.load(root / 'prepared' / (row['id'] + '.npz')) as data:
            spectral_samples.append((data['raw'], data['mask']))
    groups = {}
    for cohort in ['calibration','validation','all']:
        subset = [r for r in rows if cohort == 'all' or r['cohort'] == cohort]
        groups[cohort] = dict(cards=len(subset), variants={})
        for variant in ['released','calibrated','reconstructed']:
            groups[cohort]['variants'][variant] = {
                'structure100':float(np.mean([r['values'][variant]['combined']['1.4']['structure100'] for r in subset])),
                'rgbMae255':float(np.mean([r['values'][variant]['combined']['1.4']['rgbMae255'] for r in subset])),
                'boundaryCorrelation100':float(np.mean([r['values'][variant]['boundaryCorrelation100'] for r in subset])),
                'medianBoundaryShiftPx':float(np.median([r['values'][variant]['medianBoundaryShiftPx'] for r in subset]))}
    result=dict(label=label,groups=groups,rows=rows,spectrum=spectrum(spectral_samples),
                metric='Frame-only contrast/structure SSIM term x100; RGB MAE 8-bit; signed boundary gradient correlation x100',
                limitation='Not Lab whole-card accuracy. Geometry uses prior exploratory poses with 3 anchors per side. Holdout is only from this reconstruction, not prior studies.')
    save(root/f'{label}-evaluation.json', result)
    print(json.dumps(groups,indent=2))


if __name__ == '__main__':
    p=argparse.ArgumentParser();p.add_argument('directory',type=Path);p.add_argument('--label',default='train')
    p.add_argument('--workers',type=int,choices=[1,2],default=2)
    args=p.parse_args();evaluate(args.directory,args.label,args.workers)
