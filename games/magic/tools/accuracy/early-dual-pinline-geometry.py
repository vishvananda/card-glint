#!/usr/bin/env python3
"""Fit one shared dual-paper border geometry from native RGB edge profiles."""
import argparse,hashlib,json
from pathlib import Path
import numpy as np
from PIL import Image

def load(p):
 b=p.read_bytes();return json.loads(b),hashlib.sha256(b).hexdigest()
def smooth(v):return (v[:-2]+2*v[1:-1]+v[2:])/4
def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('native',type=Path);p.add_argument('replay',type=Path);p.add_argument('out',type=Path);a=p.parse_args()
 n,nh=load(a.native/'capture.json');r,rh=load(a.replay/'capture.json');d,dh=load(a.replay/'definition.json');assert r['source']['nativeCaptureHash']==nh and r['source']['definitionHash']==dh
 frame=d['trials'][0]['materials']['L']['frame'];box=np.array([61.063333333333325,404.6309523809524,427.9656666666666,606.325]);box[[0,2]]=frame[0]*488+box[[0,2]]*frame[2];box[[1,3]]=frame[1]*680+box[[1,3]]*frame[3]
 samples=[];sides=['left','right','top','bottom'];offsets=np.arange(-12,31,dtype=float)
 for row in r['rows']:
  b=next(x for x in n['rows'] if x['id']==row['id']);assert row['baselineParity']
  images=[]
  for file,expected in [(a.native/'2ed'/(row['id']+'-scan.png'),b['scanHash']),(a.replay/'shared-geometry'/(row['id']+'.png'),row['trials']['shared-geometry']['faceHash'])]:
   raw=file.read_bytes();assert hashlib.sha256(raw).hexdigest()==expected;images.append(np.array(Image.open(file).convert('RGB'),dtype=float)/255)
  for side in sides:
   horizontal=side in ['top','bottom'];positive=side in ['top','left'];base={'left':box[0],'right':box[2],'top':box[1],'bottom':box[3]}[side]
   axis=(np.rint(base*1.5-.5)+(1 if positive else -1)*offsets).astype(int)
   values=[]
   for im in images:
    profile=np.median(im[axis[:,None],np.arange(137,597)[None,:],:] if horizontal else im[np.arange(651,866)[:,None],axis[None,:],:],axis=1 if horizontal else 0)
    edge=np.linalg.norm(np.diff(smooth(profile),axis=0),axis=1);edge=np.maximum(0,edge-np.quantile(edge,.15))
    values.append({'rgb':profile.tolist(),'edges':edge.tolist()})
   # Coordinates are inward physical pixels, accounting for the nearest sample's phase.
   phase=(axis[12]+.5)/1.5-base;phase*=1 if positive else -1
   coords=(offsets[1:-2]+.5)/1.5+phase
   samples.append({'id':row['id'],'name':row['name'],'cohort':row['cohort'],'side':side,'base':base,'phase':phase,'referenceHash':row['referenceHash'],'poseHash':row['poseHash'],'coords':coords.tolist(),'reference':values[0],'rendered':values[1]})
 train=[s for s in samples if s['cohort']=='calibration'];validation=[s for s in samples if s['cohort']=='validation'];assert len(train)>=20 and len(validation)>=8
 widths=np.arange(4.5,9.5001,.125);shifts=np.arange(-3.5,3.5001,.125)
 def score(s,width,shift):
  x=np.array(s['coords']);original=6.375*frame[3 if s['side'] in ['top','bottom'] else 2]
  src=np.array(s['rendered']['edges']);src[(x<-.8)|(x>original+.8)]=0
  ref=np.array(s['reference']['edges']);ref[(x<-3.75)|(x>12.5)]=0
  predicted=np.interp((x-shift)*original/width,x,src,left=0,right=0)
  if np.linalg.norm(ref)==0 or np.linalg.norm(predicted)==0:return 0
  return float(np.dot(ref,predicted)/(np.linalg.norm(ref)*np.linalg.norm(predicted)))
 candidates=[]
 for width in widths:
  choice={};total=0
  for side in sides:
   cohort=[s for s in train if s['side']==side]
   scores=[float(np.mean([score(s,width,shift) for s in cohort])) for shift in shifts]
   at=max(range(len(scores)),key=lambda i:(scores[i],-abs(shifts[i])))
   choice[side]=float(shifts[at]);total+=scores[at]/4
  candidates.append({'width':float(width),'shifts':choice,'calibrationMean':total})
 best=max(candidates,key=lambda c:(c['calibrationMean'],-abs(c['width']-6.375)))
 def evaluate(s):
  return {'id':s['id'],'name':s['name'],'cohort':s['cohort'],'side':s['side'],'before':score(s,6.375*frame[3 if s['side'] in ['top','bottom'] else 2],0),'after':score(s,best['width'],best['shifts'][s['side']])}
 scores=[evaluate(s) for s in samples]
 resultbox=[box[0]+best['shifts']['left'],box[1]+best['shifts']['top'],box[2]-best['shifts']['right'],box[3]-best['shifts']['bottom']]
 sourcebox=[(resultbox[0]/488-frame[0])/frame[2],(resultbox[1]/680-frame[1])/frame[3],(resultbox[2]-resultbox[0])/488/frame[2],(resultbox[3]-resultbox[1])/680/frame[3]]
 report={'schema':1,'set':'2ed','status':'shared-pinline-geometry-prediction-needs-native-replay','scope':'RGB-gradient magnitudes on fixed native strips, insensitive to color direction and absolute saturation. One box and one equal physical width for the three colored bands and fine edges. Only calibration-cohort references choose the common geometry; reserved references are reported as reused development observations. Scan poses are fixed. No card-specific geometry/color correction or source asset change; actual native replay, paired band-color remeasurement and full-card verification are required.','nativeCaptureHash':nh,'replayHash':rh,'definitionHash':dh,'rendererHash':r['source']['rendererHash'],'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'frame':frame,'beforeBox':box.tolist(),'selected':best,'box':resultbox,'sourceBox':sourcebox,'sourceWidth':best['width']/frame[2], 'sourceWidths':[best['width']/frame[2],best['width']/frame[3]], 'bounds':{'width':[float(widths[0]),float(widths[-1])],'shift':[float(shifts[0]),float(shifts[-1])]},'candidates':candidates,'validationMean':float(np.mean([s['after'] for s in scores if s['cohort']=='validation'])),'beforeMean':float(np.mean([s['before'] for s in scores])),'afterMean':float(np.mean([s['after'] for s in scores])),'improved':sum(s['after']>s['before'] for s in scores),'rows':scores,'profiles':samples}
 a.out.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:report[k] for k in ['selected','beforeBox','box','sourceBox','sourceWidth','validationMean','beforeMean','afterMean','improved']}))
if __name__=='__main__':main()
