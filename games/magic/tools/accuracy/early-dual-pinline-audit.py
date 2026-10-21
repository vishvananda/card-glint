#!/usr/bin/env python3
"""Measure shared dual-land band colors on fixed native scan poses (Pillow/numpy)."""
import argparse,hashlib,json
from pathlib import Path
import numpy as np
from PIL import Image

def read(p):
 b=p.read_bytes();return json.loads(b),hashlib.sha256(b).hexdigest()
def rgb(im,x,y):
 return im[np.asarray(y,dtype=int),np.asarray(x,dtype=int),:3].astype(float)/255

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('native',type=Path);p.add_argument('replay',type=Path);p.add_argument('out',type=Path);p.add_argument('--trial',default='shared-geometry');a=p.parse_args()
 native,nh=read(a.native/'capture.json');replay,rh=read(a.replay/'capture.json');definition,dh=read(a.replay/'definition.json')
 assert replay['source']['nativeCaptureHash']==nh and replay['source']['definitionHash']==dh
 assert len(replay['rows'])==10
 trial=next(t['materials']['L'] for t in definition['trials'] if t['id']==a.trial)
 frame=trial['frame'];assert all(t['materials']['L']['frame']==frame for t in definition['trials'])
 # The production source geometry in canonical 488x680 units, before the shared frame transform.
 box=[61.063333333333325,404.6309523809524,427.9656666666666,606.325]
 box=[frame[0]*488+box[0]*frame[2],frame[1]*680+box[1]*frame[3],frame[0]*488+box[2]*frame[2],frame[1]*680+box[3]*frame[3]]
 width=[6.375*frame[2],6.375*frame[3]]
 if trial.get('pinline'):
  b=trial['pinline']['box'];w=trial['pinline']['width']
  box=[frame[0]*488+b['left']/1500*488*frame[2],frame[1]*680+b['top']/2100*680*frame[3],frame[0]*488+b['right']/1500*488*frame[2],frame[1]*680+b['bottom']/2100*680*frame[3]]
  width=[w['left']/1500*488*frame[2],w['top']/2100*680*frame[3]]
 geometry_hash=hashlib.sha256(Path('games/magic/src/presentation/abu-dual-pinline.ts').read_bytes()).hexdigest()
 assert geometry_hash=='0d3da0d20e86645b196828c3a83dd8c6d0f8c2d0f5280dd8dd26e74d92714100'
 rows=[]
 inputs,_=read(a.native/'inputs.json')
 for r in replay['rows']:
  n=next(x for x in native['rows'] if x['id']==r['id']);entry=next(x for x in inputs['entries'] if x['id']==r['id'])
  assert r['baselineParity'] and entry['face']['wordingMode']=='original'
  for k in ['referenceHash','poseHash']:assert r[k]==n[k]
  images=[]
  for f,h in [(a.native/'2ed'/(r['id']+'-scan.png'),n['scanHash']),(a.replay/a.trial/(r['id']+'.png'),r['trials'][a.trial]['faceHash'])]:
   raw=f.read_bytes();assert hashlib.sha256(raw).hexdigest()==h;im=np.asarray(Image.open(f).convert('RGBA'));assert im.shape==(1020,732,4);images.append(im)
  pair=sorted(entry['face']['frameColors'],key='RGUBW'.index);assert len(pair)==2
  for band,fraction in enumerate([.22,.5,.78]):
   color=pair[1 if band==1 else 0]
   for side in ['left','right','top','bottom']:
    if side in ['left','right']:
     ys=np.arange(round(434*1.5),round(577*1.5));at=box[0]+fraction*width[0] if side=='left' else box[2]-fraction*width[0];xs=np.full(len(ys),round(at*1.5-.5))
    else:
     xs=np.arange(round(91*1.5),round(398*1.5));at=box[1]+fraction*width[1] if side=='top' else box[3]-fraction*width[1];ys=np.full(len(xs),round(at*1.5-.5))
    values=[rgb(im,xs,ys) for im in images]
    rows.append({'id':r['id'],'name':r['name'],'color':color,'side':side,'band':band,'fraction':fraction,'pixels':len(xs),'referenceHash':n['referenceHash'],'poseHash':n['poseHash'],'scanHash':n['scanHash'],'renderHash':r['trials'][a.trial]['faceHash'],'sourceRgb':np.median(values[1],axis=0).tolist(),'referenceRgb':np.median(values[0],axis=0).tolist(),'sourceQuantiles':np.quantile(values[1],[.1,.9],axis=0).tolist(),'referenceQuantiles':np.quantile(values[0],[.1,.9],axis=0).tolist()})
 groups={}
 for color in 'WUBRG':
  parts=[x for x in rows if x['color']==color];ids=sorted({x['id'] for x in parts});assert len(ids)==4
  percard=[{'id':i,'name':next(x['name'] for x in parts if x['id']==i),'sourceRgb':np.median([x['sourceRgb'] for x in parts if x['id']==i],axis=0).tolist(),'referenceRgb':np.median([x['referenceRgb'] for x in parts if x['id']==i],axis=0).tolist()} for i in ids]
  groups[color]={'count':4,'sourceRgb':np.median([x['sourceRgb'] for x in percard],axis=0).tolist(),'targetRgb':np.median([x['referenceRgb'] for x in percard],axis=0).tolist(),'cards':percard}
 out={'schema':1,'set':'2ed','status':'fixed-band-color-diagnostic-not-adopted','scope':'All ten dual scans at their frozen independent poses, matched to actual common-geometry native cards. Three equal colored bands are sampled at fixed center fractions on four straight sides; no card-specific shift or width is fitted. The five target RGB values use one median per card before the shared median, preventing unequal outer/middle band counts from weighting printings differently. Side samples and every card residual are retained. Band registration and actual native color replay must be checked before adoption; this does not calibrate the fine edge ink or full-frame outline.','rendererHash':replay['source']['rendererHash'],'nativeCaptureHash':nh,'replayHash':rh,'definitionHash':dh,'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'geometrySourceHash':geometry_hash,'trial':a.trial,'box':box,'width':width,'fractions':[.22,.5,.78],'groups':groups,'rows':rows}
 a.out.write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(groups))
if __name__=='__main__':main()
