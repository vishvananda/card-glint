"""Frozen scan poses and shared frame geometry, in 488 x 680 card coordinates."""
import numpy as np
from scipy.ndimage import map_coordinates, gaussian_filter1d

WIDTH, HEIGHT = 488, 680
WINDOWS = {
    'stock-left': ('x', 14, 36, 110, 590),
    'stock-right': ('x', 452, 474, 110, 590),
    'stock-top': ('y', 15, 34, 85, 405),
    'stock-bottom': ('y', 640, 664, 85, 405),
    'art-left': ('x', 45, 62, 110, 355),
    'art-right': ('x', 426, 447, 110, 355),
    'art-top': ('y', 55, 72, 90, 400),
    'art-bottom': ('y', 360, 380, 90, 400),
    'paper-left': ('x', 52, 73, 438, 580),
    'paper-right': ('x', 415, 438, 438, 580),
    'paper-top': ('y', 398, 421, 90, 400),
    'paper-bottom': ('y', 587, 610, 90, 400),
}


def read_image(path):
    from PIL import Image
    return np.asarray(Image.open(path).convert('RGBA'), dtype=np.float32) / 255


def sample(image, x, y):
    return np.stack([map_coordinates(image[..., c], [y, x], order=1,
                                    mode='nearest', prefilter=False)
                     for c in range(image.shape[-1])], -1)


def normalize(image, matrix):
    """Diagnostic only: equivalent to pixels-pure.mjs; fitting keeps raw scans."""
    y, x = np.mgrid[:HEIGHT, :WIDTH].astype(float)
    a, b, c, d, tx, ty = matrix
    inv = np.linalg.inv([[a, c], [b, d]])
    dx, dy = x - WIDTH / 2 - tx, y - HEIGHT / 2 - ty
    px, py = inv[0, 0] * dx + inv[0, 1] * dy, inv[1, 0] * dx + inv[1, 1] * dy
    h, w = image.shape[:2]
    f = min(WIDTH / w, HEIGHT / h)
    sx = (px + WIDTH / 2 - (WIDTH - w * f) / 2 + .5) / f - .5
    sy = (py + HEIGHT / 2 - (HEIGHT - h * f) / 2 + .5) / f - .5
    return sample(image, sx, sy)


def scan_card_coordinates(shape, matrix):
    """Native scan pixel centers -> normalized card coordinates; no scan warp."""
    h, w = shape[:2]
    y, x = np.mgrid[:h, :w].astype(np.float32)
    f = min(WIDTH / w, HEIGHT / h)
    px = (x + .5) * f - .5 + (WIDTH - w * f) / 2 - WIDTH / 2
    py = (y + .5) * f - .5 + (HEIGHT - h * f) / 2 - HEIGHT / 2
    a, b, c, d, tx, ty = matrix
    return a * px + c * py + tx + WIDTH / 2, b * px + d * py + ty + HEIGHT / 2


def source_coordinates(x, y, shape, knots):
    h, w = shape[:2]
    xx = np.interp(x, np.array(knots['x'])[:, 1], np.array(knots['x'])[:, 0])
    yy = np.interp(y, np.array(knots['y'])[:, 1], np.array(knots['y'])[:, 0])
    return (xx + .5) * w / WIDTH - .5, (yy + .5) * h / HEIGHT - .5


def profiles(image):
    gray = image[..., :3] @ np.array([.2126, .7152, .0722])
    output = {}
    for key, (axis, lo, hi, a0, a1) in WINDOWS.items():
        n = np.arange(max(0, lo - 12), min(WIDTH if axis == 'x' else HEIGHT, hi + 13))
        along = np.linspace(a0, a1, 61).round().astype(int)
        values = gray[along[:, None], n] if axis == 'x' else gray[n[:, None], along].T
        alpha = image[along[:, None], n, 3] if axis == 'x' else image[n[:, None], along, 3].T
        line = np.median(values, axis=0)
        output[key] = (n, np.gradient(gaussian_filter1d(line, .8)),
                       np.all(alpha > .98, axis=0))
    return output


def correlation(ref, source, positions, shift=0):
    a = np.interp(positions + shift, ref[0], ref[1])
    b = np.interp(positions, source[0], source[1])
    norm = np.linalg.norm(a) * np.linalg.norm(b)
    return float(a @ b / norm) if norm > 1e-8 else 0


def fit_geometry(source, references):
    y, x = np.mgrid[:HEIGHT, :WIDTH]
    plate = sample(source, (x + .5) * source.shape[1] / WIDTH - .5,
                   (y + .5) * source.shape[0] / HEIGHT - .5)
    src, refs = profiles(plate), [profiles(r) for r in references]
    pins = []
    for key, (axis, lo, hi, _, _) in WINDOWS.items():
        n, grad, opaque = src[key]
        # Include only fully opaque frame plus the complete derivative halo.
        safe = np.convolve(opaque.astype(int), np.ones(7), 'same') == 7
        xs = n[(n >= lo) & (n <= hi) & safe]
        if len(xs) < 4:
            raise ValueError(f'Insufficient shared boundary support: {key}')
        # The supplied green bottom edge is over eight canonical pixels off.
        # Twelve covers it without permitting unconstrained frame deformation.
        shifts = np.arange(-12, 12.001, .125)
        scores = [np.mean([correlation(r[key], src[key], xs, s) for r in refs]) for s in shifts]
        k = int(np.argmax(scores))
        if k in (0, len(shifts) - 1):
            raise ValueError(f'Boundary optimum touches search bound: {key}')
        position = int(xs[np.argmax(np.abs(np.interp(xs, n, grad)))])
        pins.append(dict(key=key, axis=axis, source=position, target=position + float(shifts[k]),
                         shift=float(shifts[k]), correlation=float(scores[k])))
    knots = {axis: [[0., 0.]] + sorted([[p['source'], p['target']] for p in pins if p['axis'] == axis])
             + [[float(end), float(end)]] for axis, end in [('x', WIDTH - 1), ('y', HEIGHT - 1)]}
    for pairs in knots.values():
        if not (np.diff(np.array(pairs), axis=0) > 0).all():
            raise ValueError('Non-monotone shared geometry')
    return dict(knots=knots, pins=pins, policy='Shared monotone boundary remap; frozen per-scan poses')
