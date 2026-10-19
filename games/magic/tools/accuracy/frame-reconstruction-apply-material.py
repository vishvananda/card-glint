"""Apply a frozen luminance field and shared tone to an unfitted frame variant.

This is inference only. Synthetic variants never contribute reference pixels or
change the learned fields. Optional reference replay checks exact 8-bit output.
"""
import argparse, hashlib, json
from pathlib import Path
import numpy as np
from PIL import Image
import torch
from frame_reconstruction.geometry import read_image, sample
from frame_reconstruction.tone import adjust


def sha(path): return hashlib.sha256(path.read_bytes()).hexdigest()


def run(root, texture, final, source, output, reference=None):
    texture_fit = json.loads((texture/'fit.json').read_text())
    assert texture_fit['mode'] == 'luminance-relative-contrast'
    tone = json.loads((final/'fit.json').read_text())
    assert tone['textureProofSha256'] == sha(texture/'fit.json')
    field = torch.load(texture/'fields.pt', weights_only=True, map_location='cpu')['filled_luminance'].numpy()
    geometry = json.loads((root/'geometry.json').read_text())
    pins = {r['key']: r['target'] for r in geometry['pins']}
    image = read_image(source)
    alpha = image[..., 3].copy()
    h, w = alpha.shape
    yy, xx = np.mgrid[:h, :w]
    x = (xx+.5)*488/w; y = (yy+.5)*680/h
    bounds = (x>pins['stock-left']) & (x<pins['stock-right']) & (y>pins['stock-top']) & (y<pins['stock-bottom'])
    material = (alpha>.99) & (image[..., :3].max(-1)>.12) & bounds
    scalar = sample(field[..., None], (xx+.5)*488/w-.5, (yy+.5)*680/h-.5)
    image[..., :3] = np.clip(image[..., :3]*np.exp(scalar*material[..., None]), 0, 1)
    # Match the actual intermediate PNG used for final tone fitting/export.
    image = np.round(image*255)/255
    p = tone['adjustment']
    parameters = [p['hueDegrees'], np.log(p['saturationScale']), np.log(p['brightnessScale']), np.log(p['valueGamma'])]
    corrected = adjust(image[..., :3], parameters)
    gate = bounds & (image[..., 3]>0)
    image[..., :3][gate] = corrected[gate]
    result = np.round(image.clip(0, 1)*255).astype('uint8')
    assert np.array_equal(result[..., 3], np.round(alpha*255).astype('uint8'))
    if reference:
        assert np.array_equal(result, np.asarray(Image.open(reference).convert('RGBA'))), 'Frozen material replay differs'
    output.parent.mkdir(parents=True, exist_ok=True)
    Image.fromarray(result).save(output)
    output.with_suffix('.json').write_text(json.dumps(dict(
        schema=1, policy='Frozen material inference; excluded from fitting and measured Alpha cohorts.',
        sourceSha256=sha(source), textureProofSha256=sha(texture/'fit.json'),
        fieldSha256=sha(texture/'fields.pt'), toneProofSha256=sha(final/'fit.json'),
        geometrySha256=sha(root/'geometry.json'), methodSha256=sha(Path(__file__)),
        outputSha256=sha(output), referenceReplay=bool(reference),
    ), indent=2)+'\n')
    print(json.dumps(dict(output=str(output), exactReplay=bool(reference))), flush=True)


if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    for name in ['study', 'texture', 'final', 'source', 'output']: p.add_argument(name, type=Path)
    p.add_argument('--reference', type=Path)
    a = p.parse_args()
    run(a.study, a.texture, a.final, a.source, a.output, a.reference)
