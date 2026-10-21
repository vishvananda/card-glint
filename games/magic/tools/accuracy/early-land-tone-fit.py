#!/usr/bin/env python3
"""Choose a shared land shadow curve with explicit texture/contrast safeguards."""
import argparse
import sys
sys.dont_write_bytecode = True
import hashlib
import importlib.util
import json
from pathlib import Path
import numpy as np

parser=argparse.ArgumentParser(description=__doc__)
for key in ['ink','colors','brown_definition','ink_only','output','definition']:parser.add_argument(key,type=Path)
a=parser.parse_args()
helper=Path(__file__).with_name('early-keyline-tone-fit.py')
spec=importlib.util.spec_from_file_location('keyline_tone',helper);math=importlib.util.module_from_spec(spec);spec.loader.exec_module(math)
def read(path):
 b=path.read_bytes();return json.loads(b),hashlib.sha256(b).hexdigest()
ink,ih=read(a.ink);colors,ch=read(a.colors);definition,dh=read(a.brown_definition);legacy,lh=read(a.ink_only)
assert len(ink['rows'])==len(colors['rows'])==25
assert ink['trialCaptureHash']==colors['trialCaptureHash']
byid={r['id']:r for r in colors['rows']}
train=[r for r in ink['rows'] if r['cohort']=='calibration'];reserved=[r for r in ink['rows'] if r['cohort']=='validation']
assert len(train)>=3 and len(reserved)>=3
source=np.median([r['rendered']['rgb'] for r in train],axis=0)
target=np.median([r['reference']['rgb'] for r in train],axis=0)
point=float(max(source))
def contrast(rgb):
 l=math.lab(rgb)[:,0];return float((np.quantile(l,.9)-np.quantile(l,.1))*100)
def assess(rows,offset,cutoff):
 out=[]
 for r in rows:
  c=byid[r['id']]['components'];fr=c['frame'];pr=c['paper']
  texture=np.array(fr['renderTexture']);ref=np.array(fr['referenceTexture']);changed=math.curve(texture,point,offset,cutoff)
  before_texture=float(np.mean(math.delta(texture,ref)));after_texture=float(np.mean(math.delta(changed,ref)))
  before_contrast=abs(contrast(texture)-contrast(ref));after_contrast=abs(contrast(changed)-contrast(ref))
  values={}
  for name,data in [('frame',fr),('paper',pr)]:
   tiles=np.array(data['renderTiles']);before=np.median(tiles,axis=0);after=np.median(math.curve(tiles,point,offset,cutoff),axis=0)
   values[name]={'before':float(math.delta(before,data['referenceRgb'])),'after':float(math.delta(after,data['referenceRgb']))}
  out.append({'id':r['id'],'name':r['name'],'cohort':r['cohort'],
              'inkBefore':float(math.delta(r['rendered']['rgb'],r['reference']['rgb'])),
              'inkAfter':float(math.delta(math.curve(r['rendered']['rgb'],point,offset,cutoff),r['reference']['rgb'])),
              'textureBefore':before_texture,'textureAfter':after_texture,
              'contrastErrorBefore':before_contrast,'contrastErrorAfter':after_contrast,'components':values})
 avg=lambda values:float(np.mean(values))
 penalties={'frame':avg([max(0,r['components']['frame']['after']-r['components']['frame']['before']) for r in out]),
            'paper':avg([max(0,r['components']['paper']['after']-r['components']['paper']['before']) for r in out]),
            'texture':avg([max(0,r['textureAfter']-r['textureBefore']) for r in out]),
            'contrast':avg([max(0,r['contrastErrorAfter']-r['contrastErrorBefore']) for r in out])}
 summary={'count':len(out),'inkBefore':float(np.median([r['inkBefore'] for r in out])),
          'inkAfter':float(np.median([r['inkAfter'] for r in out])),
          'textureBefore':avg([r['textureBefore'] for r in out]),'textureAfter':avg([r['textureAfter'] for r in out]),
          'contrastErrorBefore':avg([r['contrastErrorBefore'] for r in out]),'contrastErrorAfter':avg([r['contrastErrorAfter'] for r in out]),
          'penalties':penalties,'objective':float(np.median([r['inkAfter'] for r in out]))+penalties['frame']+penalties['paper']}
 return summary,out
limits={'frame':.25,'paper':.25,'texture':.25,'contrast':.5}
candidates=[]
for cutoff in [.42,.5,.6]:
 if cutoff<=point+.02:continue
 for strength in [0,.25,.5,.75,1,1.25]:
  offset=(target-source)*strength;slopes=math.slopes(point,offset,cutoff)
  if min(slopes)<.35 or max(slopes)>3:continue
  summary,_=assess(train,offset,cutoff)
  reject=[key for key,limit in limits.items() if summary['penalties'][key]>limit+1e-8]
  candidates.append({'cutoff':cutoff,'strength':strength,'offset':offset.tolist(),'slopeRange':[min(slopes),max(slopes)],'calibration':summary,'rejectedBy':reject})
chosen=min((c for c in candidates if not c['rejectedBy']),key=lambda c:(c['calibration']['objective'],sum(abs(v) for v in c['offset']),c['cutoff']))
def curve(c):return {'lift':[0,0,0],'transition':.5,'texture':[[0,[0,0,0]],[point,c['offset']],[c['cutoff'],[0,0,0]],[1,[0,0,0]]]}
selected={'blackPoint':curve(chosen),'candidate':chosen,'calibration':chosen['calibration']}
selected['reserved'],selected['reservedRows']=assess(reserved,np.array(chosen['offset']),chosen['cutoff'])
selected['all'],selected['rows']=assess(ink['rows'],np.array(chosen['offset']),chosen['cutoff'])
legacy_point=legacy['groups'][0]['blackPoint'];assert legacy_point['texture'][1][0]==point
legacy_summary,legacy_rows=assess(train,np.array(legacy_point['texture'][1][1]),legacy_point['texture'][2][0])
report={'schema':1,'status':'texture-aware-shared-land-tone-candidate-needs-native-verification',
        'scope':'One source-relative monotone curve for all land plates. Calibration-only selection preserves frame/paper color and luminance-ordered texture/contrast within fixed penalties; every reference remains in its cohort. Fixed tolerances are small Oklab units, not accuracy points. Reserved names are reused development observations. Predictions use native samples and require actual source preparation replay. No per-printing scan/color/geometry correction.',
        'source':{'inkHash':ih,'colorsHash':ch,'brownDefinitionHash':dh,'inkOnlyFitHash':lh,
                  'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'helperHash':hashlib.sha256(helper.read_bytes()).hexdigest()},
        'limits':limits,'point':point,'selected':selected,'inkOnly':{'blackPoint':legacy_point,'calibration':legacy_summary,'rows':legacy_rows},'candidates':candidates}
a.output.write_text(json.dumps(report,indent=2)+'\n')
base=next(t for t in definition['trials'] if t['id']=='land-hsb');trials=[base]
import copy
for label,blackpoint in [('land-tone-ink',legacy_point),('land-tone',selected['blackPoint'])]:
 mats=copy.deepcopy(base['materials'])
 for mat in mats.values():
  for adjustment in mat['pigments'].values():adjustment['blackPoint']=blackpoint
 trials.append({'id':label,'materials':mats})
a.definition.write_text(json.dumps({'schema':1,'ids':definition['ids'],'trials':trials,'scope':'Actual native comparison of the same shared land HSB and two black-level policies, with source paper, accents, geometry, semantic outline choices and typography fixed.'},indent=2)+'\n')
print(json.dumps({'selected':chosen,'reserved':selected['reserved'],'inkOnly':legacy_summary},indent=2))
