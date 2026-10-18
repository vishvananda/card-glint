"""Differentiable frame material and fixed scan sampling for local experiments.

The renderer's HSB operation uses encoded sRGB. Geometry and masks are frozen
inputs; this module never learns a per-card layout or changes alpha. Keep PNG
quantization out of backpropagation and check the exported result natively.
"""
from __future__ import annotations

import torch
import torch.nn.functional as F


def adjust_hsb(rgb: torch.Tensor, adjustment: dict) -> torch.Tensor:
    """Float counterpart of presentation/hsb.ts, using NCHW tensors."""
    r, g, b = rgb.unbind(1)
    value, index = rgb.max(1)
    delta = value - rgb.min(1).values
    safe_delta = delta.clamp_min(1e-8)
    hue = torch.where(index == 0, (g - b) / safe_delta,
                      torch.where(index == 1, (b - r) / safe_delta + 2,
                                  (r - g) / safe_delta + 4))
    hue = torch.where(delta == 0, torch.zeros_like(hue), hue)
    hue = ((hue * 60 + adjustment.get('hueDegrees', 0)) % 360) / 60
    saturation = torch.where(value > 0, delta / value.clamp_min(1e-8), 0)
    saturation = (saturation * adjustment.get('saturationScale', 1)).clamp(0, 1)
    value = (value.clamp_min(1e-8) ** adjustment.get('valueGamma', 1)
             * adjustment.get('brightnessScale', 1)).clamp(0, 1)
    chroma = value * saturation
    x = chroma * (1 - ((hue % 2) - 1).abs())
    zero = torch.zeros_like(value)
    sector = hue.floor().long()
    channels = [
        torch.where((sector == 0) | (sector == 5), chroma,
                    torch.where((sector == 1) | (sector == 4), x, zero)),
        torch.where((sector == 1) | (sector == 2), chroma,
                    torch.where((sector == 0) | (sector == 3), x, zero)),
        torch.where((sector == 3) | (sector == 4), chroma,
                    torch.where((sector == 2) | (sector == 5), x, zero)),
    ]
    result = torch.stack(channels, 1) + (value - chroma).unsqueeze(1)
    gain = rgb.new_tensor(adjustment.get('rgbScale', [1, 1, 1])).view(1, 3, 1, 1)
    return (result * gain).clamp(0, 1)


def color_frame(rgb: torch.Tensor, adjustment: dict, paper: torch.Tensor) -> torch.Tensor:
    """Restricted rectangular-paper material; no unmodeled texture/stock masks.

    The fitting harness rejects unsupported effects instead of silently omitting
    them. Protected black source pixels follow the native threshold; callers
    should keep texture changes away from that threshold when fitting ink.
    """
    unsupported = {'regions', 'accents', 'blend', 'outerStock', 'outerStockMaskSource'}
    if unsupported.intersection(adjustment):
        raise ValueError('Unsupported material operation in differentiable model')
    dual = 'frame' in adjustment
    outer = adjust_hsb(rgb, adjustment['frame'] if dual else adjustment)
    inner = adjust_hsb(rgb, adjustment['paper']) if dual else outer
    result = outer * (1 - paper) + inner * paper
    v = rgb.max(1, keepdim=True).values
    s = (v - rgb.min(1, keepdim=True).values) / v.clamp_min(1e-8)
    protected = v < .075
    if not dual:
        protected = protected | ((s < .025) & (v > .97))
    result = torch.where(protected, rgb, result)
    point = adjustment.get('blackPoint')
    if point:
        if set(point) - {'lift', 'transition'}:
            raise ValueError('Unmodeled black-point texture selection')
        weight = (1 - result.max(1, keepdim=True).values / point['transition']).clamp_min(0) ** 2
        result = (result + rgb.new_tensor(point['lift']).view(1, 3, 1, 1) * weight).clamp(0, 1)
    return result


def sample_scan(frame: torch.Tensor, grid: torch.Tensor) -> torch.Tensor:
    """Predict native scan pixels from one fixed frame-to-scan coordinate map."""
    return F.grid_sample(frame, grid, mode='bilinear', padding_mode='border', align_corners=False)


def gaussian(image: torch.Tensor, sigma: float) -> torch.Tensor:
    if sigma <= 0:
        return image
    radius = max(1, int(3 * sigma + .5))
    x = torch.arange(-radius, radius + 1, dtype=image.dtype, device=image.device)
    kernel = torch.exp(-.5 * (x / sigma) ** 2)
    kernel /= kernel.sum()
    channels = image.shape[1]
    result = F.conv2d(F.pad(image, (radius, radius, 0, 0), mode='replicate'),
                      kernel.view(1, 1, 1, -1).expand(channels, 1, 1, -1), groups=channels)
    return F.conv2d(F.pad(result, (0, 0, radius, radius), mode='replicate'),
                    kernel.view(1, 1, -1, 1).expand(channels, 1, -1, 1), groups=channels)


def masked_loss(prediction: torch.Tensor, targets: list[torch.Tensor],
                masks: list[torch.Tensor], sigmas: tuple[float, ...]) -> torch.Tensor:
    """Matched, pre-masked multiscale Huber loss; masks must include filter halos."""
    terms = []
    for target, mask, sigma in zip(targets, masks, sigmas, strict=True):
        if mask.sum() <= 0:
            continue
        residual = gaussian(prediction, sigma) - target
        value = F.huber_loss(residual, torch.zeros_like(residual), delta=.025, reduction='none')
        terms.append((value * mask).sum() / (3 * mask.sum()))
    if not terms:
        raise ValueError('No trusted pixels survive the filter support')
    return torch.stack(terms).mean()
