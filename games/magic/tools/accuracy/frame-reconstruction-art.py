"""Extract reference art only, using frozen scan poses; no frame fitting."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import distance_transform_edt
from frame_reconstruction.geometry import read_image, sample


def run(root, inputs=None, cache=None):
    spec = importlib.util.spec_from_file_location(
        'refine', Path(__file__).with_name('frame-reconstruction-refine.py'))
    refine = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(refine)
    out = root / 'art-source'
    out.mkdir(exist_ok=True)
    observations = json.loads((root / 'observations.json').read_text())
    if inputs:
        entries = json.loads(inputs.read_text())['entries']
        by_id = {entry['id']: entry for entry in entries}
        sizes = {}
        for row in observations['records']:
            entry = by_id[row['id']]
            sizes[row['id']] = dict(
                id=row['id'], name=row['name'],
                artCrop=list(Image.open(cache / 'objects' / entry['art']['sha256']).size),
                fullScan=[row['reference']['width'], row['reference']['height']],
                artHash=entry['art']['sha256'])
        refine.save_json(root / 'art-resolution-audit.json', list(sizes.values()))
    else:
        sizes = {r['id']: r for r in json.loads((root / 'art-resolution-audit.json').read_text())}
    frame = refine.resize(read_image(root / 'train-native/render-plate-1.png'), refine.W, refine.H)
    y, x = np.mgrid[:refine.H, :refine.W]
    aperture = (frame[..., 3] < .5) & (x > .08 * refine.W) & (x < .92 * refine.W)
    aperture &= (y > .07 * refine.H) & (y < .57 * refine.H)
    yy, xx = np.where(aperture)
    box = [int(xx.min()), int(yy.min()), int(xx.max()+1), int(yy.max()+1)]
    distance = distance_transform_edt(aperture) - distance_transform_edt(~aperture)
    # A 1.5-native-pixel transition on each side, one canonical pixel at this size.
    blend = np.clip(.5 + distance / 3, 0, 1)
    blend = blend * blend * (3 - 2 * blend)
    records = []
    for row in observations['records']:
        scan = read_image(row['reference']['file'])
        sx, sy = refine.scan_coordinates(scan.shape, row['normalization']['transform']['matrix'])
        image = sample(scan, sx, sy)[..., :3]
        for kind, alpha in [('hard', aperture.astype(float)), ('feather', blend)]:
            rgba = np.concatenate([np.where((alpha > 0)[..., None], image, 0), alpha[..., None]], -1)
            refine.save_png(out / f"{row['id']}-{kind}.png", rgba)
        record = sizes[row['id']]
        record['estimatedFullScanArtSize'] = [
            round((box[2]-box[0])*scan.shape[1]/refine.W, 2),
            round((box[3]-box[1])*scan.shape[0]/refine.H, 2)]
        records.append(record)
    refine.save_json(out / 'receipt.json', dict(
        policy='Reference-derived artwork; not independent accuracy evidence; no text/frame copied outside the explicit art aperture transition',
        maskBoxAt732x1020=box, featherCanonicalPixels=1,
        normalization='Existing frozen per-card affine, including scale, rotation and shear',
        records=records))
    refine.save_json(out / 'candidates.json', dict(candidates=[
        dict(key='baseline', title='Scryfall art_crop', file='train-native/render-plate-1.png'),
        dict(key='scan-art', title='Art extracted from full scan', file='train-native/render-plate-1.png', artSource='art-source/{id}-hard.png'),
        dict(key='feather-art', title='Scan art with narrow feather', file='train-native/render-plate-1.png', artSource='art-source/{id}-feather.png')]))
    print(json.dumps(dict(cards=len(records), maskBox=box, first=records[0]), indent=2))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('directory', type=Path)
    parser.add_argument('--inputs', type=Path)
    parser.add_argument('--cache', type=Path, default=Path(os.environ.get(
        'MAGIC_ACCURACY_CACHE', Path(__file__).parents[2] / '.cache/accuracy')))
    args = parser.parse_args()
    run(args.directory, args.inputs, args.cache)
