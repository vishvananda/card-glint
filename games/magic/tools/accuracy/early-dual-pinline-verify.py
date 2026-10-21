import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
parser=argparse.ArgumentParser(description='Verify actual native dual-pinline geometry trials and fixed-strip edge scores.');parser.add_argument('native',type=Path);parser.add_argument('replay',type=Path);parser.add_argument('profiles',type=Path);parser.add_argument('output',type=Path);parser.add_argument('--preview',type=Path);args=parser.parse_args();native=args.native;replay=args.replay
def read(p):
 raw=p.read_bytes();return json.loads(raw),hashlib.sha256(raw).hexdigest()
def raster(p,h):
 b=p.read_bytes();assert hashlib.sha256(b).hexdigest()==h
 return np.array(Image.open(p).convert('RGBA'))
def smooth(v):return (v[:-2]+2*v[1:-1]+v[2:])/4
n,nh=read(native/'capture.json');r,rh=read(replay/'capture.json');p,ph=read(args.profiles);assert r['source']['nativeCaptureHash']==nh
definition,dh=read(replay/'definition.json');assert r['source']['definitionHash']==dh and p['nativeCaptureHash']==nh and p['rendererHash']==r['source']['rendererHash'];assert len(r['rows'])==10 and len({e['id'] for e in r['rows']})==10
profiles={(s['id'],s['side']):s for s in p['profiles']};rows=[];candidates=['shared-paper','pinline-selected','pinline-freeFit'];box=p['beforeBox'];off=np.arange(-12,31,dtype=float)
for row in r['rows']:
 original=next(e for e in n['rows'] if e['id']==row['id']);assert row['baselineParity'] and row['referenceHash']==original['referenceHash'] and row['poseHash']==original['poseHash'];assert all(profiles[row['id'],side]['poseHash']==row['poseHash'] and profiles[row['id'],side]['referenceHash']==row['referenceHash'] for side in ['left','right','top','bottom']);ref=raster(native/'2ed'/(row['id']+'-scan.png'),original['scanHash']);images={t:raster(replay/t/(row['id']+'.png'),row['trials'][t]['faceHash']) for t in candidates}
 control=images[candidates[0]]
 for t,im in images.items():
  changed=np.any(im!=control,axis=2);assert not np.any(changed[:590]);assert np.array_equal(im[:,:,3],control[:,:,3]);assert not np.any(changed[640:890,110:620]);assert row['trials'][t]['etchingHash']==row['trials']['shared-paper']['etchingHash']
 for side in ['left','right','top','bottom']:
  pr=profiles[row['id'],side];pos=side in ['left','top'];horizontal=side in ['top','bottom'];axis=(np.rint(pr['base']*1.5-.5)+(1 if pos else -1)*off).astype(int)
  def profile(im):return np.median(im[axis[:,None],np.arange(137,597)[None,:],:3] if horizontal else im[np.arange(651,866)[:,None],axis[None,:],:3],axis=1 if horizontal else 0)/255
  target=profile(ref);te=np.linalg.norm(np.diff(smooth(target),axis=0),axis=1);te=np.maximum(0,te-np.quantile(te,.15));coords=np.array(pr['coords']);keep=(coords>=-3.75)&(coords<=12.5);te=te[keep]
  vals={}
  for t,im in images.items():
   pred=profile(im);ge=np.linalg.norm(np.diff(smooth(pred),axis=0),axis=1);ge=np.maximum(0,ge-np.quantile(ge,.15))[keep];den=np.linalg.norm(te)*np.linalg.norm(ge);cos=float(te@ge/den) if den else 0
   vals[t]={'edgeCosine':cos,'meanRgbDistance':float(np.linalg.norm(target-pred,axis=1).mean())}
  rows.append({'id':row['id'],'name':row['name'],'cohort':row['cohort'],'side':side,'trials':vals})
summary={}
for t in candidates:
 delta=[x['trials'][t]['edgeCosine']-x['trials'][candidates[0]]['edgeCosine'] for x in rows]
 summary[t]={'edgeMean100':float(np.mean([x['trials'][t]['edgeCosine'] for x in rows])*100),'improvedSides':sum(d>1e-8 for d in delta),'regressedSides':sum(d < -1e-8 for d in delta),'worstRegression100':float(-min(delta)*100),'calibrationMean100':float(np.mean([x['trials'][t]['edgeCosine'] for x in rows if x['cohort']=='calibration'])*100),'reservedMean100':float(np.mean([x['trials'][t]['edgeCosine'] for x in rows if x['cohort']=='validation'])*100)}
report={'schema':1,'status':'actual-native-candidate-verification-not-adopted','scope':'Actual full native cards, fixed scan poses and original text; shared geometry and source ink only. RGB-gradient magnitude cosine is local to forty fixed border strips and is not a whole-card score. Ten baseline PNGs match; upper-card rows [0,590), central rules [110,620)x[640,890), alpha and etching control checks pass. Separate complete ink and paper controls remain required. Reserved names are reused development observations. Palette/order remain unchanged.','source':{'nativeCaptureHash':nh,'replayHash':rh,'definitionHash':dh,'profilesHash':ph,'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},'summary':summary,'rows':rows}
args.output.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps(summary,indent=2))
# Reference and complete candidate crops for direct shape/old-line inspection.
if not args.preview:raise SystemExit(0)
out=Image.new('RGB',(4*390,5*240+28),'white');d=ImageDraw.Draw(out)
for j,t in enumerate(['scan',*candidates]):d.text((390*j+5,5),t,fill='black')
for i,name in enumerate(['Tundra','Taiga','Underground Sea','Bayou','Volcanic Island']):
 row=next(x for x in r['rows'] if x['name']==name)
 for j,t in enumerate(['scan',*candidates]):
  path=native/'2ed'/(row['id']+'-scan.png') if t=='scan' else replay/t/(row['id']+'.png')
  im=Image.open(path).convert('RGB').crop((70,590,662,938));im.thumbnail((386,218));out.paste(im,(390*j+2,28+240*i+18));d.text((390*j+4,28+240*i),name,fill='black')
out.save(args.preview)
