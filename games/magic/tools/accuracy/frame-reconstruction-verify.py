"""Verify quantized forward color parity and exact source alpha preservation."""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import numpy as np
from PIL import Image
import torch
from frame_reconstruction.model import color_frame


def verify(root, label):
    torch.set_num_threads(2)
    spec = importlib.util.spec_from_file_location(
        'fit', Path(__file__).with_name('frame-reconstruction-fit.py'))
    fit = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(fit)
    original = np.array(Image.open(
        root / 'inputs/sharpened-frames/alpha-white-frame.png').convert('RGBA'))
    adjustment = json.loads((root / f'{label}-adjustment.json').read_text())
    mask, _ = fit.paper_mask(original.shape)
    rows = []
    for name, index in [('calibrated', 0), ('reconstructed', 1)]:
        source = original if index == 0 else np.array(Image.open(
            root / f'{label}-reconstructed-source.png').convert('RGBA'))
        assert source.shape == original.shape
        assert np.array_equal(original[..., 3], source[..., 3])
        predicted = color_frame(
            fit.tensor(source[..., :3] / 255), adjustment,
            fit.tensor(mask[..., None]))[0].permute(1, 2, 0).numpy()
        native = np.array(Image.open(
            root / f'{label}-native/material-{index}.png').convert('RGBA'))
        assert native.shape == source.shape
        assert np.array_equal(native[..., 3], source[..., 3])
        valid = source[..., 3] == 255
        difference = np.abs(np.round(predicted * 255) - native[..., :3])[valid]
        assert difference.max() <= 2, (name, difference.max())
        rows.append(dict(
            variant=name, maximumOpaque8bitDifference=int(difference.max()),
            meanOpaque8bitDifference=float(difference.mean()),
            alphaSha256=hashlib.sha256(source[..., 3].tobytes()).hexdigest(),
            shape=list(source.shape)))
    receipt = dict(
        nativeModelMaterialParity=rows,
        nativeBaselineCards=json.loads(
            (root / f'{label}-native/receipt.json').read_text())['nativeBaselineParity'],
        note='Partial-alpha outer-corner RGB is excluded from parity because Canvas '
             'premultiplication rounds color; those pixels are outside fitting support.')
    (root / f'{label}-verification.json').write_text(json.dumps(receipt, indent=2) + '\n')
    print(json.dumps(receipt, indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    parser.add_argument('label', choices=['train', 'all'])
    args = parser.parse_args()
    verify(args.directory, args.label)
