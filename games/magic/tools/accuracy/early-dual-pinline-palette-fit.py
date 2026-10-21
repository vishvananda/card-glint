#!/usr/bin/env python3
"""Fit shared pinline RGB inks using exact native coverage controls."""
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image

parser = argparse.ArgumentParser(description=__doc__)
for key in ['native', 'basis', 'geometry', 'output', 'definition']:
    parser.add_argument(key, type=Path)
args = parser.parse_args()

def load(path):
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()

def image(path, expected):
    raw = path.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == expected
    result = np.asarray(Image.open(path).convert('RGB'), dtype=np.float64) / 255
    assert result.shape == (1020, 732, 3)
    return result

def oklab(rgb):
    rgb = np.clip(rgb, 0, 1)
    lin = np.where(rgb <= .04045, rgb / 12.92, ((rgb + .055) / 1.055) ** 2.4)
    lms = lin @ np.array([[.4122214708,.5363325363,.0514459929],
                         [.2119034982,.6806995451,.1073969566],
                         [.0883024619,.2817188376,.6299787005]]).T
    return np.cbrt(lms) @ np.array([[.2104542553,.793617785,-.0040720468],
                                   [1.9779984951,-2.428592205,.4505937099],
                                   [.0259040371,.7827717662,-.808675766]]).T

native, nh = load(args.native / 'capture.json')
basis, bh = load(args.basis / 'capture.json')
definition, dh = load(args.basis / 'definition.json')
inputs, ih = load(args.native / 'inputs.json')
geometry, gh = load(args.geometry / 'capture.json')
assert basis['source']['nativeCaptureHash'] == nh
assert basis['source']['definitionHash'] == dh
assert geometry['source']['nativeCaptureHash'] == nh
assert len(basis['rows']) == 10
control = next(t['materials']['L'] for t in definition['trials'] if t['id'] == 'pinline-selected')
f = control['frame']; b = control['pinline']['box']; width = control['pinline']['width']
box = np.array([f[0]+b['left']/1500*f[2], f[1]+b['top']/2100*f[3],
                f[0]+b['right']/1500*f[2], f[1]+b['bottom']/2100*f[3]]) * [732,1020,732,1020]
wx = width['left']/1500*f[2]*732; wy = width['top']/2100*f[3]*1020
inks = [*'WUBRG', 'edge']
raw_palette = np.array([[186,177,176],[72,110,137],[88,77,85],[182,62,81],[129,149,92],
                        [255*.18,255*.18,255*.17]]) / 255
normal = np.zeros((3,6,6)); rhs = np.zeros((3,6)); strips = []; pixel_checks = []
for row in basis['rows']:
    source = next(r for r in native['rows'] if r['id'] == row['id'])
    old = next(r for r in geometry['rows'] if r['id'] == row['id'])
    entry = next(e for e in inputs['entries'] if e['id'] == row['id'])
    assert entry['face']['wordingMode'] == 'original' and entry['pose']['accepted']
    assert row['baselineParity'] and row['referenceHash'] == source['referenceHash']
    assert row['poseHash'] == source['poseHash'] == old['poseHash']
    assert row['trials']['pinline-selected']['faceHash'] == old['trials']['pinline-selected']['faceHash']
    ref = image(args.native/'2ed'/(row['id']+'-scan.png'),source['scanHash'])
    def rendered(trial):
        return image(args.basis/trial/(row['id']+'.png'),row['trials'][trial]['faceHash'])
    zero = rendered('ink-zero'); current = rendered('pinline-selected')
    weights = np.zeros((1020,732,6,3))
    for i, ink in enumerate(inks):
        if ink != 'edge' and ink not in entry['face']['frameColors']:
            assert 'ink-'+ink not in row['trials']
            continue
        difference = rendered('ink-'+ink) - zero
        assert difference.min() >= -1/255 - 1e-8 and difference.max() <= 1 + 1e-8
        weights[:,:,i,:] = np.clip(difference,0,1)
    predicted = zero + np.einsum('xyic,ic->xyc', weights, raw_palette)
    support = weights.max(axis=(2,3)) > .05
    errors = np.abs(predicted-current)[support]
    # This actual-painter control catches post-composition tone/nonlinear paths.
    assert errors.max() <= 3/255 + 1e-8, (row['name'],errors.max())
    pixel_checks.append({'id':row['id'],'name':row['name'],'pixels':int(support.sum()),
                         'maxByteError':float(errors.max()*255),'meanByteError':float(errors.mean()*255)})
    for side in ['left','right','top','bottom']:
        if side in ['top','bottom']:
            edge = box[1] if side=='top' else box[3]
            lo,hi = (edge-2,edge+wy+2) if side=='top' else (edge-wy-2,edge+2)
            ys = np.arange(int(np.floor(lo)),int(np.ceil(hi)))
            xs = np.arange(137,597)
        else:
            edge = box[0] if side=='left' else box[2]
            lo,hi = (edge-2,edge+wx+2) if side=='left' else (edge-wx-2,edge+2)
            xs = np.arange(int(np.floor(lo)),int(np.ceil(hi)))
            ys = np.arange(651,866)
        yy,xx = np.meshgrid(ys,xs,indexing='ij'); yy=yy.ravel();xx=xx.ravel()
        keep = support[yy,xx]; yy=yy[keep];xx=xx[keep]
        X = weights[yy,xx]; Y = ref[yy,xx]-zero[yy,xx]
        assert len(X)>500
        if row['cohort']=='calibration':
            for c in range(3):
                normal[c] += X[:,:,c].T @ X[:,:,c] / len(X)
                rhs[c] += X[:,:,c].T @ Y[:,c] / len(X)
        strips.append({'id':row['id'],'name':row['name'],'cohort':row['cohort'],'side':side,
                       'X':X,'reference':ref[yy,xx],'zero':zero[yy,xx],'current':current[yy,xx]})
assert len(strips)==40
assert all(np.linalg.matrix_rank(n)==6 for n in normal)
unconstrained = np.stack([np.linalg.solve(normal[c],rhs[c]) for c in range(3)],axis=1)
fixed_edge = np.stack([np.linalg.solve(normal[c,:5,:5],rhs[c,:5]-normal[c,:5,5]*raw_palette[5,c]) for c in range(3)],axis=1)
fixed_edge = np.concatenate([fixed_edge,raw_palette[5:]],axis=0)
proposals = []
trials = [{'id':'pinline-selected','materials':{'L':control}}]
for label, unclipped in [('pinline-palette',unconstrained),('pinline-fixed-edge',fixed_edge)]:
    palette = np.clip(unclipped,0,1)
    rows=[]
    for s in strips:
        after = np.clip(s['zero']+np.einsum('pic,ic->pc',s['X'],palette),0,1)
        before_error = np.linalg.norm(oklab(s['reference'])-oklab(s['current']),axis=1)*100
        after_error = np.linalg.norm(oklab(s['reference'])-oklab(after),axis=1)*100
        rows.append({k:s[k] for k in ['id','name','cohort','side']} |
                    {'pixels':len(after),'beforeOklab100':float(before_error.mean()),
                     'predictedOklab100':float(after_error.mean())})
    summary={}
    for cohort in ['all','calibration','validation']:
        parts=[r for r in rows if cohort=='all' or r['cohort']==cohort]
        summary[cohort]={'strips':len(parts),'before':float(np.mean([r['beforeOklab100'] for r in parts])),
                         'predicted':float(np.mean([r['predictedOklab100'] for r in parts])),
                         'improved':sum(r['predictedOklab100']<r['beforeOklab100'] for r in parts),
                         'worstRegression':max(0,max(r['predictedOklab100']-r['beforeOklab100'] for r in parts))}
    proposals.append({'id':label,'palette':dict(zip(inks,palette.tolist())),
                      'unclippedPalette':dict(zip(inks,unclipped.tolist())),
                      'boundaryInks':[inks[i] for i in range(6) if np.any(palette[i]!=unclipped[i])],
                      'summary':summary,'rows':rows})
    trial={**control,'pinline':{**control['pinline'],'palette':{c:palette[i].tolist() for i,c in enumerate('WUBRG')},'edge':palette[5].tolist()}}
    trials.append({'id':label,'materials':{'L':trial}})
report={'schema':1,'status':'native-coverage-palette-fit-needs-candidate-replay',
        'scope':'One shared RGB palette for five colors, with either free edge RGB or preserved source edge. Equal weight per fixed straight side on eight calibration cards. Coverage comes from native zero/white material controls with no reference-color classification, local scan pose/color changes or per-card renderer values. Default palette reconstruction is verified from PNGs. Two reserved names are reused development observations. Pixel Oklab distances are not whole-card accuracy scores. A freely brown fitted edge may be a blur/geometry compensation; native visual comparison is required.',
        'source':{'nativeCaptureHash':nh,'basisCaptureHash':bh,'basisDefinitionHash':dh,
                  'geometryCaptureHash':gh,'nativeInputsHash':ih,'rendererHash':basis['source']['rendererHash'],
                  'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
        'normalCondition':[float(np.linalg.cond(n)) for n in normal],
        'sourcePrediction':pixel_checks,'proposals':proposals}
args.output.write_text(json.dumps(report,indent=2)+'\n')
candidate={'schema':1,'ids':definition['ids'],'trials':trials,
          'scope':'Actual native verification of shared palette candidates fit from exact coverage controls. Geometry, order, paper, art and typography remain fixed.'}
args.definition.write_text(json.dumps(candidate,indent=2)+'\n')
print(json.dumps([{'id':p['id'],'palette':p['palette'],'boundaryInks':p['boundaryInks'],'summary':p['summary']} for p in proposals],indent=2))
