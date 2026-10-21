#!/usr/bin/env python3
"""Verify actual native dual-pinline palettes against controls and scan pixels."""
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

parser = argparse.ArgumentParser(description=__doc__)
for key in ['native', 'basis', 'fit', 'candidate', 'output']:
    parser.add_argument(key, type=Path)
parser.add_argument('--preview', type=Path)
args = parser.parse_args()

def load(path):
    raw = path.read_bytes()
    return json.loads(raw), hashlib.sha256(raw).hexdigest()

def image(path, expected):
    raw = path.read_bytes()
    assert hashlib.sha256(raw).hexdigest() == expected
    result = np.asarray(Image.open(path).convert('RGBA'))
    assert result.shape == (1020,732,4)
    return result

def oklab(rgb):
    lin = np.where(rgb <= .04045, rgb / 12.92, ((rgb + .055) / 1.055) ** 2.4)
    lms = lin @ np.array([[.4122214708,.5363325363,.0514459929],
                         [.2119034982,.6806995451,.1073969566],
                         [.0883024619,.2817188376,.6299787005]]).T
    return np.cbrt(lms) @ np.array([[.2104542553,.793617785,-.0040720468],
                                   [1.9779984951,-2.428592205,.4505937099],
                                   [.0259040371,.7827717662,-.808675766]]).T

native, nh = load(args.native/'capture.json')
basis, bh = load(args.basis/'capture.json')
fit, fh = load(args.fit)
candidate, ch = load(args.candidate/'capture.json')
definition, dh = load(args.candidate/'definition.json')
assert basis['source']['nativeCaptureHash'] == candidate['source']['nativeCaptureHash'] == nh
assert fit['source']['basisCaptureHash'] == bh and candidate['source']['definitionHash'] == dh
assert basis['source']['rendererHash'] == fit['source']['rendererHash'] == candidate['source']['rendererHash']
assert len(candidate['rows']) == len(basis['rows']) == 10
trial = next(t['materials']['L'] for t in definition['trials'] if t['id']=='pinline-selected')
f=trial['frame']; b=trial['pinline']['box']; w=trial['pinline']['width']
box=np.array([f[0]+b['left']/1500*f[2],f[1]+b['top']/2100*f[3],
              f[0]+b['right']/1500*f[2],f[1]+b['bottom']/2100*f[3]])*[732,1020,732,1020]
wx=w['left']/1500*f[2]*732;wy=w['top']/2100*f[3]*1020
rows=[];isolation=[];predictions=[];inks=[*'WUBRG','edge']
for row in candidate['rows']:
    source=next(r for r in native['rows'] if r['id']==row['id'])
    base=next(r for r in basis['rows'] if r['id']==row['id'])
    assert row['baselineParity'] and base['baselineParity']
    for key in ['referenceHash','poseHash']:
        assert row[key]==base[key]==source[key]
    assert row['trials']['pinline-selected']['faceHash']==base['trials']['pinline-selected']['faceHash']
    ref=image(args.native/'2ed'/(row['id']+'-scan.png'),source['scanHash'])[:,:,:3]/255
    def rendered(directory, item, label):
        return image(directory/label/(row['id']+'.png'),item['trials'][label]['faceHash'])
    zero=rendered(args.basis,base,'ink-zero')[:,:,:3]/255
    weights=np.zeros((1020,732,6,3))
    for i,ink in enumerate(inks):
        if 'ink-'+ink in base['trials']:
            weights[:,:,i,:]=np.clip(rendered(args.basis,base,'ink-'+ink)[:,:,:3]/255-zero,0,1)
    support=weights.max(axis=(2,3))>.05
    affected=weights.max(axis=(2,3))>0
    control=rendered(args.candidate,row,'pinline-selected')
    images={'pinline-selected':control}
    for proposal in fit['proposals']:
        label=proposal['id']; actual=rendered(args.candidate,row,label);images[label]=actual
        selected=next(t['materials']['L'] for t in definition['trials'] if t['id']==label)
        expected={**trial,'pinline':{**trial['pinline'],'palette':{c:proposal['palette'][c] for c in 'WUBRG'},'edge':proposal['palette']['edge']}}
        assert selected==expected
        changed=np.any(actual!=control,axis=2)
        assert not np.any(changed & ~affected), (row['name'],label,'outside native coverage')
        assert np.array_equal(actual[:,:,3],control[:,:,3])
        assert row['trials'][label]['etchingHash']==row['trials']['pinline-selected']['etchingHash']
        palette=np.array([proposal['palette'][ink] for ink in inks])
        predicted=np.clip(zero+np.einsum('xyic,ic->xyc',weights,palette),0,1)
        errors=np.abs(predicted-actual[:,:,:3]/255)[support]
        assert errors.max()<=3/255+1e-8,(row['name'],label,errors.max())
        predictions.append({'id':row['id'],'name':row['name'],'trial':label,
                            'maxByteError':float(errors.max()*255),'meanByteError':float(errors.mean()*255)})
        isolation.append({'id':row['id'],'name':row['name'],'trial':label,
                          'changedPixels':int(changed.sum()),'outsideCoverageChanged':0,
                          'alphaChanged':0,'etchingChanged':False})
    for side in ['left','right','top','bottom']:
        if side in ['top','bottom']:
            edge=box[1] if side=='top' else box[3]
            lo,hi=(edge-2,edge+wy+2) if side=='top' else (edge-wy-2,edge+2)
            ys=np.arange(int(np.floor(lo)),int(np.ceil(hi)));xs=np.arange(137,597)
        else:
            edge=box[0] if side=='left' else box[2]
            lo,hi=(edge-2,edge+wx+2) if side=='left' else (edge-wx-2,edge+2)
            xs=np.arange(int(np.floor(lo)),int(np.ceil(hi)));ys=np.arange(651,866)
        yy,xx=np.meshgrid(ys,xs,indexing='ij');yy=yy.ravel();xx=xx.ravel()
        keep=support[yy,xx];yy=yy[keep];xx=xx[keep]
        target=oklab(ref[yy,xx]);values={}
        for label,im in images.items():
            error=np.linalg.norm(target-oklab(im[yy,xx,:3]/255),axis=1)*100
            values[label]=float(error.mean())
        record={'id':row['id'],'name':row['name'],'cohort':row['cohort'],'side':side,'pixels':len(yy),'meanOklab100':values}
        for proposal in fit['proposals']:
            predicted=next(r for r in proposal['rows'] if r['id']==row['id'] and r['side']==side)
            assert predicted['pixels']==len(yy)
            assert abs(predicted['beforeOklab100']-values['pinline-selected'])<1e-10
        rows.append(record)
summary={}
for proposal in fit['proposals']:
    label=proposal['id'];summary[label]={}
    for cohort in ['all','calibration','validation']:
        parts=[r for r in rows if cohort=='all' or r['cohort']==cohort]
        before=[r['meanOklab100']['pinline-selected'] for r in parts];after=[r['meanOklab100'][label] for r in parts]
        summary[label][cohort]={'strips':len(parts),'before':float(np.mean(before)),'after':float(np.mean(after)),
                                'improved':sum(a<b for a,b in zip(after,before)),
                                'regressed':sum(a>b for a,b in zip(after,before)),
                                'worstRegression':max(0,max(a-b for a,b in zip(after,before)))}
report={'schema':1,'status':'native-shared-palette-candidates-verified-not-adopted',
        'scope':'Ten actual full native Original cards, fixed independent scan poses, fixed geometry and ordering. Forty fixed straight-side color windows are defined by native coverage controls, never reference-color thresholds. These are mean pixel Oklab distances x100, not whole-card accuracy. Exact baseline/source-palette controls, reconstruction, support isolation, alpha and default etching are checked. Two reserved names are reused development observations. All side regressions remain visible.',
        'source':{'nativeCaptureHash':nh,'basisCaptureHash':bh,'fitHash':fh,'candidateCaptureHash':ch,
                  'candidateDefinitionHash':dh,'rendererHash':candidate['source']['rendererHash'],
                  'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
        'summary':summary,'predictions':predictions,'isolation':isolation,'rows':rows}
args.output.write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(summary,indent=2))
if args.preview:
    labels=['scan','pinline-selected',*summary]
    sheet=Image.new('RGB',(390*len(labels),240*5+28),'white');draw=ImageDraw.Draw(sheet)
    for j,label in enumerate(labels):draw.text((390*j+5,5),label,fill='black')
    for i,name in enumerate(['Tundra','Taiga','Underground Sea','Plateau','Volcanic Island']):
        row=next(r for r in candidate['rows'] if r['name']==name)
        for j,label in enumerate(labels):
            path=args.native/'2ed'/(row['id']+'-scan.png') if label=='scan' else args.candidate/label/(row['id']+'.png')
            im=Image.open(path).convert('RGB').crop((70,590,662,938));im.thumbnail((386,218))
            sheet.paste(im,(390*j+2,46+240*i));draw.text((390*j+4,28+240*i),name,fill='black')
    sheet.save(args.preview)
