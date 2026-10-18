"""Phase-independent texture descriptors for small, uncontaminated scan patches.

This measures observed scan appearance, not a press's physical screen ruling.
No phase, translation, blur, or affine parameters are fitted by this metric.
"""
import numpy as np
from scipy.ndimage import gaussian_filter


CHANNELS = np.array([[.2126, .7152, .0722], [.5, -.5, 0], [0, -.5, .5]])


def descriptors(patches, jacobians=None):
    """Return per-patch power, mean ink and fine-scale contrast.

    Remove smooth content before a Hann-windowed FFT; bin power by frequency
    and direction. Averaging power (not complex FFTs) discards dot phase.
    Fixed relative weights leave color corrections outside the texture fit.
    """
    h, w = patches.shape[1:3]
    channels = patches @ CHANNELS.T
    high = channels - gaussian_filter(channels, sigma=(0, 1.25, 1.25, 0))
    window = np.hanning(h)[:, None] * np.hanning(w)[None, :]
    power = np.abs(np.fft.fft2(high * window[None, ..., None], axes=(1, 2))) ** 2
    power /= np.sum(window ** 2) * h * w
    fy, fx = np.meshgrid(np.fft.fftfreq(h), np.fft.fftfreq(w), indexing='ij')
    frequency=np.stack([fx,fy],axis=-1)
    if jacobians is None:frequency=frequency[None]
    else:frequency=np.einsum('hwi,nij->nhwj',frequency,np.linalg.inv(jacobians))
    radius, angle = np.linalg.norm(frequency,axis=-1), np.arctan2(frequency[...,1],frequency[...,0]) % np.pi
    bins = []
    for lo, hi in zip([.12, .20, .28, .36, .44], [.20, .28, .36, .44, .71]):
        for a in range(4):
            selected = (radius >= lo) & (radius < hi) & (angle >= a*np.pi/4) & (angle < (a+1)*np.pi/4)
            if jacobians is None:bins.append(power[:,selected[0]].sum(1))
            else:bins.append((power*selected[...,None]).sum((1,2)))
    energy = np.stack(bins, axis=1)
    return dict(power=energy, mean=patches.mean((1, 2)), rms=np.sqrt((high**2).mean((1, 2))))


def distance(reference, predicted):
    """Symmetric spectral-amplitude distance, plus independently reported bias.

    Normalize by total reference energy per channel: scale stays meaningful,
    but a nearly empty individual frequency bin cannot dominate. Clipping is
    never used to improve a candidate. A tiny fixed quantization floor bounds
    low-chroma dark patches. Lower is better; this is not /100 card accuracy.
    """
    a, b = reference['power'], predicted['power']
    weights = np.array([.7, .15, .15])
    amplitude = ((np.sqrt(a) - np.sqrt(b))**2).sum(1)
    spectral = ((amplitude / (a.sum(1) + (0.5/255)**2)) * weights).sum(-1)
    bias = np.abs(reference['mean'] - predicted['mean']).mean(-1)*255
    return dict(spectral=spectral, meanRgbError255=bias,
                rms255=predicted['rms']*255)
