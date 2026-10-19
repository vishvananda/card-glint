"""Separate Alpha stock bands and PNG silhouette from the frame-texture fit.

Only shared parameters are fitted; scan poses stay frozen. Scryfall's identical
alpha masks are one reference template, not independent physical-cut evidence.
"""
import argparse
import hashlib
import importlib.util
import json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter1d
from scipy.optimize import minimize_scalar
from frame_reconstruction.geometry import read_image

spec = importlib.util.spec_from_file_location(
    'refine', Path(__file__).with_name('frame-reconstruction-refine.py'))
refine = importlib.util.module_from_spec(spec)
spec.loader.exec_module(refine)


def ramp(value):
    t = np.clip(value, 0, 1)
    return t*t*(3-2*t)


def grid(w, h):
    y, x = np.mgrid[:h, :w]
    return (x+.5)*488/w, (y+.5)*680/h


def silhouette(x, y, radius, sampling=1.5):
    qx = np.maximum(abs(x-244)-(244-radius), 0)
    qy = np.maximum(abs(y-340)-(340-radius), 0)
    return np.clip(.5-(np.hypot(qx, qy)-radius)*sampling, 0, 1)


def fit(root):
    out = root/'border'; out.mkdir(exist_ok=True)
    rows = json.loads((root/'observations.json').read_text())['records']
    train = [r for r in rows if r['cohort']=='calibration']
    profiles = {k: [] for k in ['left','right','top','bottom']}
    x, y = grid(732, 1020)
    corners = ((x<55)|(x>433)) & ((y<55)|(y>625))
    alphas = []
    for row in train:
        a = read_image(root/'art-source'/f"{row['id']}-reference.png")
        profiles['left'].append(np.median(a[200:850,:60,:3], axis=0))
        profiles['right'].append(np.median(a[200:850,-60:,:3][:,::-1], axis=0))
        profiles['top'].append(np.median(a[:60,100:630,:3], axis=1))
        profiles['bottom'].append(np.median(a[-65:,100:630,:3][::-1], axis=1))
        alphas.append(a[...,3][corners])
    median = {k: np.median(v, axis=0) for k,v in profiles.items()}
    edges, measurements = {}, {}
    outer_colors, inner_colors = [], []
    for side, p in median.items():
        distance = (np.arange(len(p))+.5)/1.5
        # The printed inner band is chromatic; outer stock is nearly neutral.
        # This avoids selecting the much brighter printed-frame edge instead.
        chroma = p[:,2]-(p[:,0]+p[:,1])/2
        gradient = np.gradient(gaussian_filter1d(chroma, .8))
        lo, hi = (10,21) if side in ['left','right'] else (16,26)
        selected = np.where((distance>=lo)&(distance<=hi))[0]
        pos = selected[np.argmax(gradient[selected])]
        if pos in [selected[0],selected[-1]]:
            raise ValueError(f'Inner-band edge touches search boundary: {side}')
        edges[side] = float(distance[pos])
        outer = np.median(p[(distance>3)&(distance<edges[side]-3)],axis=0)
        inner = np.median(p[(distance>edges[side]+1.5)&(distance<edges[side]+5)],axis=0)
        outer_colors.append(outer);inner_colors.append(inner)
        measurements[side] = dict(inset=edges[side],outerRgb255=(outer*255).tolist(),innerRgb255=(inner*255).tolist())
    outer, inner = np.median(outer_colors,axis=0), np.median(inner_colors,axis=0)
    target = np.mean(alphas,axis=0)
    loss = lambda r: float(np.mean((target-silhouette(x[corners],y[corners],r))**2))
    fit_radius = minimize_scalar(loss,bounds=(25,42),method='bounded')
    radius = round(float(fit_radius.x)/488,6)
    base = read_image(root/'refine/blur-aware-plate.png')
    h,w = base.shape[:2]; bx,by = grid(w,h)
    inside = ramp(np.minimum.reduce([bx-edges['left'],488-edges['right']-bx,
                                     by-edges['top'],680-edges['bottom']-by])+.5)
    color = outer[None,None,:]*(1-inside[...,None])+inner[None,None,:]*inside[...,None]
    gray = base[...,:3] @ np.array([.2126,.7152,.0722])
    # Preserve a restrained amount of the clean source's stock texture.
    color += np.clip(gray-.085,-.006,.006)[...,None]*(1-inside[...,None])
    # Stop at the shared printed-frame boundary and retain its bright keyline.
    geometry = json.loads((root/'geometry.json').read_text())
    pins = {p['key']:p['target'] for p in geometry['pins']}
    outside = np.maximum.reduce([pins['stock-left']+1-bx,bx-pins['stock-right']+1,
                                 pins['stock-top']+1-by,by-pins['stock-bottom']+1])
    weight = ramp(outside+.5)*(1-ramp((gray-40/255)/(30/255)))
    result = base.copy();result[...,:3] = base[...,:3]*(1-weight[...,None])+color*weight[...,None]
    refine.save_png(out/'two-band-plate.png',result)
    refine.save_png(out/'stock-mask.png',np.repeat(weight[...,None],3,-1))
    alpha_hashes = {hashlib.sha256(Image.open(r['reference']['file']).getchannel('A').tobytes()).hexdigest() for r in rows}
    receipt = dict(calibrationCards=len(train),rawAlphaUniqueHashes=sorted(alpha_hashes),
        policy='Shared Alpha material stock colors/rectangle; no per-card fitting. Corner match is to the common Scryfall PNG mask, not independently measured physical cuts.',
        oldCornerRadius=.058,cornerRadius=radius,canonicalRadius=radius*488,
        cornerTrainingMseBefore=loss(.058*488),cornerTrainingMseAfter=loss(radius*488),
        bandInsets=edges,sideMeasurements=measurements,
        outerRgb255=(outer*255).tolist(),innerRgb255=(inner*255).tolist(),
        sourceAlphaUnchanged=bool(np.array_equal(base[...,3],result[...,3])))
    refine.save_json(out/'fit.json',receipt)
    refine.save_json(out/'candidates.json',dict(candidates=[
        dict(key='baseline',title='Blur-aware frame, previous border',file='refine/blur-aware-plate.png'),
        dict(key='stock-corners',title='Two stock bands + reference corners',file='border/two-band-plate.png',cornerRadius=radius)]))
    print(json.dumps(receipt,indent=2))


def evaluate(root):
    rows = json.loads((root/'observations.json').read_text())['records']
    x,y = grid(732,1020)
    corner = ((x<55)|(x>433))&((y<55)|(y>625))
    # No printed texture, title, artwork, or keylines enter these diagnostics.
    stock = ((((x>3)&(x<24))|((x>464)&(x<485)))&(y>65)&(y<615))
    stock |= ((((y>3)&(y<26))|((y>651)&(y<677)))&(x>65)&(x<423))
    result=[]
    candidates=json.loads((root/'refine/candidates.json').read_text())['candidates']
    blur_index=next(i for i,c in enumerate(candidates) if c['key']=='blur-aware')
    for row in rows:
        target=read_image(root/'art-source'/f"{row['id']}-reference.png")
        baseline=read_image(root/'border-native'/f"{row['id']}-0.png")
        if not np.array_equal(baseline,read_image(root/'refine-native'/f"{row['id']}-{blur_index}.png")):
            raise ValueError(f"Changed border baseline: {row['name']}")
        variants={}
        for i,key in enumerate(['baseline','stock-corners']):
            a=read_image(root/'border-native'/f"{row['id']}-{i}.png")
            if not np.array_equal(a[55:965,48:684],baseline[55:965,48:684]):
                raise ValueError(f"Border changed printed interior: {row['name']}")
            aa,bb=a[...,3][corner],target[...,3][corner]
            variants[key]=dict(cornerAlphaMae=float(np.abs(aa-bb).mean()),
                cornerAlphaIou100=float(np.minimum(aa,bb).sum()/np.maximum(aa,bb).sum()*100),
                stockRgbMae255=float(np.abs(a[...,:3][stock]-target[...,:3][stock]).mean()*255))
        result.append(dict(id=row['id'],name=row['name'],cohort=row['cohort'],variants=variants))
    groups={}
    for cohort in ['calibration','validation','all']:
        subset=[r for r in result if cohort=='all' or r['cohort']==cohort]
        groups[cohort]={k:{m:float(np.mean([r['variants'][k][m] for r in subset]))
                          for m in subset[0]['variants'][k]} for k in ['baseline','stock-corners']}
    refine.save_json(root/'border-evaluation.json',dict(groups=groups,rows=result,
        baselineParity=True,printedInteriorUnchanged=True,printedInteriorAtNative=[48,55,684,965]))
    print(json.dumps(groups,indent=2))


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('root',type=Path)
    p.add_argument('--evaluate',action='store_true');args=p.parse_args()
    (evaluate if args.evaluate else fit)(args.root)
