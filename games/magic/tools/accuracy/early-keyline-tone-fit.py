#!/usr/bin/env python3
"""Fit one monotone source shadow curve per material on calibration printings.

Uses native keyline and actual frame/paper texture observations. Validation
printings are evaluated only after selection; no scan-specific fit is returned.
"""
import argparse,json,hashlib
from pathlib import Path
import numpy as np

def load(p):
 b=p.read_bytes();return json.loads(b),hashlib.sha256(b).hexdigest()
def lab(rgb):
 a=np.asarray(rgb);a=np.where(a<=.04045,a/12.92,((a+.055)/1.055)**2.4)
 lms=a@np.array([[.4122214708,.2119034982,.0883024619],[.5363325363,.6806995451,.2817188376],[.0514459929,.1073969566,.6299787005]])
 return np.cbrt(lms)@np.array([[.2104542553,1.9779984951,.0259040371],[.793617785,-2.428592205,.7827717662],[-.0040720468,.4505937099,-.808675766]])
def delta(a,b):return 100*np.linalg.norm(lab(a)-lab(b),axis=-1)
def curve(rgb,point,offset,cutoff):
 a=np.asarray(rgb);x=np.max(a,axis=-1);w=np.where(x<=point,x/point,np.maximum(0,(cutoff-x)/(cutoff-point)))
 return np.clip(a+w[...,None]*offset,0,1)
def slopes(point,offset,cutoff):return [*(1+offset/point),*(1-offset/(cutoff-point))]
def summarize(rows,colors,point,offset,cutoff):
 observations=[]
 for row in rows:
  ink=delta(row['rendered']['rgb'],row['reference']['rgb']).item();after=delta(curve(row['rendered']['rgb'],point,offset,cutoff),row['reference']['rgb']).item()
  color=colors[row['id']];components={}
  for key in ['frame','paper']:
   data=color['components'][key];tiles=np.array(data['renderTiles']);pick=np.linspace(0,len(tiles)-1,min(64,len(tiles))).astype(int);tiles=tiles[pick]
   before=np.median(tiles,axis=0);changed=np.median(curve(tiles,point,offset,cutoff),axis=0);target=data['referenceRgb']
   components[key]={'before':delta(before,target).item(),'after':delta(changed,target).item()}
  observations.append({'id':row['id'],'name':row['name'],'inkBefore':ink,'inkAfter':after,'components':components})
 groups={k:float(np.median([r[k]for r in observations]))for k in ['inkBefore','inkAfter']}
 groups['framePenalty']=float(np.mean([max(0,r['components']['frame']['after']-r['components']['frame']['before'])for r in observations]))
 groups['paperPenalty']=float(np.mean([max(0,r['components']['paper']['after']-r['components']['paper']['before'])for r in observations]))
 groups['objective']=groups['inkAfter']+groups['framePenalty']+groups['paperPenalty']
 return groups,observations

def main():
 p=argparse.ArgumentParser(description=__doc__);p.add_argument('keylines',type=Path);p.add_argument('colors',type=Path);p.add_argument('output',type=Path);args=p.parse_args()
 ink,ih=load(args.keylines);color,ch=load(args.colors);colors={r['id']:r for r in color['rows']};results=[]
 for material in sorted(ink['groups']):
  rows=[r for r in ink['rows']if r['material']==material];train=[r for r in rows if r['cohort']=='calibration'];validation=[r for r in rows if r['cohort']=='validation'];assert len(train)>=3 and len(validation)>=3
  source=np.median([r['rendered']['rgb']for r in train],axis=0);target=np.median([r['reference']['rgb']for r in train],axis=0);point=max(source);base,_=summarize(train,colors,point,np.zeros(3),max(.6,point+.01));candidates=[]
  for cutoff in [.42,.5,.6]:
   if cutoff<=point+.02:continue
   for strength in [0,.5,.75,1,1.25]:
    offset=(target-source)*strength;slope=slopes(point,offset,cutoff)
    if min(slope)<.35 or max(slope)>3:continue
    summary,_=summarize(train,colors,point,offset,cutoff)
    candidates.append((summary['objective'],float(np.sum(np.abs(offset))*(cutoff-point)),cutoff,strength,summary,offset))
  selected=min(candidates,key=lambda v:(v[0],v[1],v[2],v[3]));_,_,cutoff,strength,calibration,offset=selected
  evaluation,scores=summarize(validation,colors,point,offset,cutoff)
  adjustment={'lift':[0,0,0],'transition':.5,'texture':[[0,[0,0,0]],[float(point),offset.tolist()],[cutoff,[0,0,0]],[1,[0,0,0]]]}
  results.append({'material':material,'training':len(train),'validation':len(validation),'sourceRgb':source.tolist(),'targetRgb':target.tolist(),'strength':strength,'cutoff':cutoff,'slopeRange':[min(slopes(point,offset,cutoff)),max(slopes(point,offset,cutoff))],'blackPoint':adjustment,'calibrationBaseline':base,'calibration':calibration,'validationSummary':evaluation,'validationScores':scores,'candidates':[{'cutoff':v[2],'strength':v[3],**v[4]}for v in candidates]})
  print(material,strength,cutoff,'ink',round(calibration['inkBefore'],3),'->',round(calibration['inkAfter'],3),'validation',round(evaluation['inkBefore'],3),'->',round(evaluation['inkAfter'],3),'framePenalty',round(evaluation['framePenalty'],3))
 report={'schema':1,'status':'shared-source-keyline-tone-prediction-not-native-certification','scope':'Calibration-only source curve selection. Keyline RGB medians are compared in Oklab, with actual per-printing frame/paper texture color penalties. Curves have bounded positive channel slopes and return to zero before highlights; no per-card renderer values, new scan poses, or final-image filters. Predictions use sampled native texture RGB, not the original source image; actual native preparation is required for promotion. Validation cohorts are reused development, not a fresh blind sample.','keylinesHash':ih,'colorsHash':ch,'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'groups':results}
 args.output.write_text(json.dumps(report,indent=2)+'\n')
if __name__=='__main__':main()
