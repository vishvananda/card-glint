"""Measure large land glyphs using per-image ink/paper separation, not raw color overlap.

The current ordinary painter places its 156px tile at (166,440). This study
retains all basics and proposes shared per-color geometry only. It does not
change a scan pose or certify a set. Uses modern-calibration-requirements.txt.
"""
import argparse
import hashlib
import json
from pathlib import Path

import cv2
import numpy as np
from PIL import Image

cv2.setNumThreads(1)
SYMBOLS = {'Plains': 'W', 'Island': 'U', 'Swamp': 'B', 'Mountain': 'R', 'Forest': 'G'}
RECT = [132, 425, 228, 188]
TILE = [166, 440, 156, 156]
ANCHOR = [244, 518]


def sha(file):
    return hashlib.sha256(file.read_bytes()).hexdigest()


def read(file):
    return json.loads(file.read_text())


def raster(file, expected):
    assert sha(file) == expected, str(file)
    im = np.asarray(Image.open(file).convert('RGBA'))
    return cv2.resize(im, (488, 680), interpolation=cv2.INTER_LINEAR)[:, :, :3].astype(np.float32)


def source_body(file):
    rgba = np.asarray(Image.open(file).convert('RGBA'))
    opaque = rgba[:, :, 3] >= 250
    values = np.round(rgba[:, :, :3][opaque].astype(float) / 4).astype(int)
    colors, counts = np.unique(values, axis=0, return_counts=True)
    modal = colors[np.argmax(counts)] * 4
    body = (np.linalg.norm(rgba[:, :, :3].astype(float) - modal, axis=2) < 9) & opaque
    tile = cv2.resize(body.astype(np.float32), (156, 156), interpolation=cv2.INTER_LINEAR)
    full = np.zeros((680, 488), dtype=np.float32)
    full[440:596, 166:322] = tile
    core = cv2.erode((full > .9).astype(np.uint8), np.ones((5, 5), np.uint8)) > 0
    assert core.sum() > 80
    return full, core, modal.tolist()


def separate(rgb, core):
    smooth = cv2.GaussianBlur(rgb, (0, 0), .7)
    left = np.median(smooth[:, 134:153], axis=1)
    right = np.median(smooth[:, 339:358], axis=1)
    # A row-wise paper model preserves the material gradient and excludes the
    # glyph. Flanks are fixed before fitting; no card-specific fitting windows.
    left = cv2.GaussianBlur(left[:, None, :], (0, 0), sigmaX=.01, sigmaY=3)[:, 0]
    right = cv2.GaussianBlur(right[:, None, :], (0, 0), sigmaX=.01, sigmaY=3)[:, 0]
    t = np.clip((np.arange(488) - 143) / (348 - 143), 0, 1).astype(np.float32)
    paper = left[:, None, :] * (1 - t[None, :, None]) + right[:, None, :] * t[None, :, None]
    ink = np.median(smooth[core], axis=0)
    direction = ink[None, None, :] - paper
    length2 = np.sum(direction * direction, axis=2)
    contrast = float(np.median(np.sqrt(length2)[core]))
    if contrast < 18:
        return None, ink.tolist(), contrast
    alpha = np.sum((smooth - paper) * direction, axis=2) / np.maximum(length2, 1)
    residue = smooth - (paper + alpha[:, :, None] * direction)
    # Off-axis colors are paper texture or a differently colored cast shadow;
    # retain filled ink with soft residual weighting rather than changing size
    # to compensate for saturation. Black ink and black shadow cannot be split
    # this way and remain an explicit limitation for later shadow fitting.
    weight = np.exp(-np.sum(residue * residue, axis=2) / (3 * 18**2))
    mask = np.clip((alpha - .15) / .7, 0, 1) * weight
    x, y, w, h = RECT
    crop = mask[y:y+h, x:x+w].astype(np.float32)
    crop[:10] = 0
    count, labels, stats, _ = cv2.connectedComponentsWithStats((crop > .45).astype(np.uint8))
    keep = np.zeros(crop.shape, dtype=np.uint8)
    for i in range(1, count):
        if stats[i, cv2.CC_STAT_AREA] >= 20:
            keep[labels == i] = 1
    keep = cv2.dilate(keep, np.ones((3, 3), np.uint8))
    crop *= keep
    return crop, ink.tolist(), contrast


def bounds(mask):
    y, x = np.where(mask > .5)
    if len(x) < 80:
        return None
    return [float(x.min()), float(y.min()), float(x.max() + 1), float(y.max() + 1)]


def affine(values):
    dx, dy, sx, sy = values
    ax, ay = ANCHOR[0] - RECT[0], ANCHOR[1] - RECT[1]
    return np.array([[sx, 0, ax*(1-sx)+dx], [0, sy, ay*(1-sy)+dy]], dtype=np.float32)


def overlap(a, b):
    denominator = float(np.sum(a*a) + np.sum(b*b))
    return float(2*np.sum(a*b)/denominator) if denominator else 0


def fit(items):
    hints = []
    for item in items:
        a, b = item['sourceBounds'], item['referenceBounds']
        sx, sy = (b[2]-b[0])/(a[2]-a[0]), (b[3]-b[1])/(a[3]-a[1])
        ax, ay = ANCHOR[0] - RECT[0], ANCHOR[1] - RECT[1]
        hints.append([(b[0]+b[2])/2-ax-sx*((a[0]+a[2])/2-ax), (b[1]+b[3])/2-ay-sy*((a[1]+a[3])/2-ay), sx, sy])
    best = np.median(hints, axis=0).tolist()
    limits = [(-20,20),(-25,25),(.75,1.5),(.75,1.5)]
    best = [float(np.clip(v,*limit)) for v,limit in zip(best,limits)]
    def score(values):
        matrix = affine(values)
        return float(np.mean([overlap(cv2.warpAffine(z['sourceMask'],matrix,(RECT[2],RECT[3]),flags=cv2.INTER_LINEAR),z['referenceMask']) for z in items]))
    baseline = score([0,0,1,1])
    value = score(best)
    for pixels, scale in [(1,.025),(.25,.00625),(.0625,.0015625)]:
        for _ in range(16):
            changed = False
            for j,step in enumerate([pixels,pixels,scale,scale]):
                for sign in [-1,1]:
                    candidate = best.copy(); candidate[j] += sign*step
                    if not limits[j][0] <= candidate[j] <= limits[j][1]:
                        continue
                    v = score(candidate)
                    if v > value + 1e-7:
                        best,value,changed = candidate,v,True
            if not changed:
                break
    return baseline,value,best


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    for key in ['inputs','native','scores','cache','output']:
        parser.add_argument(key,type=Path)
    args = parser.parse_args()
    inputs=read(args.inputs);native=read(args.native/'capture.json');scores=read(args.scores/'scores.json')
    assert native['source']['inputsHash']==sha(args.inputs)==scores['definition']['inputsHash']
    assert scores['definition']['nativeCaptureHash']==sha(args.native/'capture.json')
    assert len(inputs['entries'])==len(native['rows'])==len(scores['rows'])
    definition={'inputHash':sha(args.inputs),'nativeHash':sha(args.native/'capture.json'),'scoresHash':sha(args.scores/'scores.json'),'toolHash':sha(Path(__file__)),'tile':TILE,'region':RECT,'anchor':ANCHOR,'scope':'All observed ordinary basic-land printings. Fixed scan poses, shared per-color geometry. Per-image ink/paper separation removes source color differences from geometry fitting. Existing source assets only. Black cast shadow is inseparable from black ink in this mask and requires a separate native review. No renderer adoption, source-color correction or set certification.'}
    args.output.mkdir(parents=True,exist_ok=True)
    groups={};rows=[]
    for e in inputs['entries']:
        name=e['face'].get('canonicalTypeLine',e['face'].get('typeLine','')).split(' — ')[-1]
        if not e['face'].get('typeLine','').startswith('Basic Land') or name not in SYMBOLS:
            continue
        symbol=SYMBOLS[name]
        assets=[a for a in inputs['components']if a['url'].endswith('/m15/basics/'+symbol.lower()+'.png')]
        assert len(assets)==1
        asset=assets[0];file=args.cache/'objects'/asset['sha256'];assert sha(file)==asset['sha256']
        body,core,modal=source_body(file)
        n=next(x for x in native['rows']if x['id']==e['id']);s=next(x for x in scores['rows']if x['id']==e['id'])
        assert n['referenceHash']==s['referenceHash']==e['reference']['sha256']
        rendered=raster(args.native/n['layers']['face']['file'],n['layers']['face']['sha256'])
        reference=raster(args.scores/s['normalizedReference']['file'],s['normalizedReference']['sha256'])
        sourceMask,sourceInk,sourceContrast=separate(rendered,core)
        referenceMask,referenceInk,referenceContrast=separate(reference,core)
        row={'id':e['id'],'name':e['card']['name'],'number':e['card']['collector_number'],'symbol':symbol,'asset':asset,'referenceHash':e['reference']['sha256'],'nativeHash':n['layers']['face']['sha256'],'normalizedHash':s['normalizedReference']['sha256'],'poseAccepted':s['poseAccepted'],'nonfoil':s['nonfoilEligible'],'sourceModalRGB':modal,'sourceInkRGB':sourceInk,'referenceInkRGB':referenceInk,'sourceContrast':sourceContrast,'referenceContrast':referenceContrast,'sourceBounds':None if sourceMask is None else bounds(sourceMask),'referenceBounds':None if referenceMask is None else bounds(referenceMask)}
        row['supported']=bool(row['sourceBounds'] and row['referenceBounds'] and row['poseAccepted'] and row['nonfoil'])
        rows.append(row)
        if sourceMask is not None and referenceMask is not None:
            for label,mask in [('source',sourceMask),('reference',referenceMask)]:
                Image.fromarray(np.round(mask*255).astype(np.uint8)).save(args.output/(e['id']+'-'+label+'-mask.png'))
        if row['supported']:
            groups.setdefault(symbol,[]).append({'row':row,'sourceMask':sourceMask,'referenceMask':referenceMask,'sourceBounds':row['sourceBounds'],'referenceBounds':row['referenceBounds']})
    results=[]
    for symbol,items in groups.items():
        before,after,best=fit(items)
        for z in items:
            moved=cv2.warpAffine(z['sourceMask'],affine(best),(RECT[2],RECT[3]),flags=cv2.INTER_LINEAR)
            z['row'].update(baselineScore=overlap(z['sourceMask'],z['referenceMask']),selectedScore=overlap(moved,z['referenceMask']))
            Image.fromarray(np.round(moved*255).astype(np.uint8)).save(args.output/(z['row']['id']+'-selected-mask.png'))
        result={'symbol':symbol,'count':len(items),'baseline100':100*before,'selected100':100*after,'proposal':dict(zip(['dx','dy','scaleX','scaleY'],best)),'referenceInkRGBMedian':np.median([z['row']['referenceInkRGB']for z in items],axis=0).tolist(),'nativeInkRGBMedian':np.median([z['row']['sourceInkRGB']for z in items],axis=0).tolist(),'status':'diagnostic-native-review-required'}
        results.append(result);print(json.dumps(result),flush=True)
    (args.output/'measurement.json').write_text(json.dumps({'schema':1,'definition':definition,'groups':results,'rows':rows},indent=2)+'\n')


if __name__=='__main__':
    main()
