#!/usr/bin/env python3
"""Verify native land tone, preserved components and shared Mountain refinement."""
import argparse
import sys
sys.dont_write_bytecode = True
import hashlib
import importlib.util
import json
from pathlib import Path
import numpy as np
from PIL import Image, ImageDraw

p=argparse.ArgumentParser(description=__doc__)
for k in ['native','hsb','tone','base_color','tone_color','ink_color','fit','mountain','output']:p.add_argument(k,type=Path)
p.add_argument('--preview',type=Path)
p.add_argument('--mountain-color',type=Path)
a=p.parse_args()
def module(name,file):
 spec=importlib.util.spec_from_file_location(name,file);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
folder=Path(__file__).parent
sampler=module('frame_ink',folder/'early-frame-ink-audit.py');math=module('keyline',folder/'early-keyline-tone-fit.py')
def read(path):
 b=path.read_bytes();return json.loads(b),hashlib.sha256(b).hexdigest()
def raster(path,expected):
 b=path.read_bytes();assert hashlib.sha256(b).hexdigest()==expected,str(path)
 im=np.array(Image.open(path).convert('RGBA'));assert im.shape==(1020,732,4);return im
native,nh=read(a.native/'capture.json');hsb,hh=read(a.hsb/'capture.json');tone,th=read(a.tone/'capture.json');mountain,mh=read(a.mountain/'capture.json')
base_color,bch=read(a.base_color);tone_color,tch=read(a.tone_color);ink_color,ich=read(a.ink_color);fit,fh=read(a.fit)
for capture in [hsb,tone,mountain]:assert capture['source']['nativeCaptureHash']==nh and capture['source']['rendererHash']==native['source']['rendererHash']
for data,expected in [(base_color,hh),(tone_color,th),(ink_color,th)]:assert data['trialCaptureHash']==expected and data['nativeCaptureHash']==nh
assert len(hsb['rows'])==len(tone['rows'])==len(tone_color['rows'])==25
assert len(mountain['rows'])==3 and all(r['name']=='Mountain' and r['cohort']=='calibration' for r in mountain['rows'])
rows=[];mountain_rows=[];images={}
for row in tone['rows']:
 h=next(r for r in hsb['rows'] if r['id']==row['id']);n=next(r for r in native['rows'] if r['id']==row['id'])
 assert row['baselineParity'] and row['trials']['land-hsb']['faceHash']==h['trials']['land-hsb']['faceHash']
 for key in ['referenceHash','poseHash']:assert row[key]==h[key]==n[key]
 ref=raster(a.native/'2ed'/(row['id']+'-scan.png'),n['scanHash'])
 control=raster(a.tone/'land-hsb'/(row['id']+'.png'),row['trials']['land-hsb']['faceHash'])
 bounds=h['trials']['land-hsb']['outerBoundary']['sides']
 target=sampler.keyline_samples(ref,bounds,'reference')
 original=sampler.keyline_samples(control,bounds,'rendered')
 before=float(math.delta(original['rgb'],target['rgb']))
 choices={};sources={}
 for label in ['land-tone','land-tone-ink']:
  choices[label]=raster(a.tone/label/(row['id']+'.png'),row['trials'][label]['faceHash']);sources[label]=row['trials'][label]
 if row['name']=='Mountain':
  m=next(r for r in mountain['rows'] if r['id']==row['id'])
  assert m['referenceHash']==row['referenceHash'] and m['poseHash']==row['poseHash']
  for label in ['land-hsb','land-tone']:assert m['trials'][label]['faceHash']==row['trials'][label]['faceHash']
  for label in ['land-tone-025','land-tone-050','land-tone-100']:
   choices[label]=raster(a.mountain/label/(row['id']+'.png'),m['trials'][label]['faceHash']);sources[label]=m['trials'][label]
  # No independent-name validation is possible for three illustrations of one material.
  vals={'land-hsb':before}
  for label,im in choices.items():
   if label=='land-tone-ink':continue
   vals[label]=float(math.delta(sampler.keyline_samples(im,bounds,'rendered')['rgb'],target['rgb']))
  mountain_rows.append({'id':row['id'],'name':row['name'],'before':before,'variants':vals})
 values={}
 for label,im in choices.items():
  assert np.array_equal(im[:,:,3],control[:,:,3]),(row['name'],label,'alpha')
  assert np.array_equal(im[128:532,105:622],control[128:532,105:622]),(row['name'],label,'art core')
  for yy,xx in [(slice(180,400),slice(4,18)),(slice(180,400),slice(715,728)),(slice(1002,1009),slice(195,345))]:
   assert np.array_equal(im[yy,xx],control[yy,xx]),(row['name'],label,'stock')
  assert sources[label]['etchingHash']==row['trials']['land-hsb']['etchingHash']
  changed=np.any(im!=control,axis=2)
  measured=sampler.keyline_samples(im,bounds,'rendered')
  values[label]={'inkError':float(math.delta(measured['rgb'],target['rgb'])),'inkRgb':measured['rgb'],
                 'changedPixels':int(changed.sum()),'alphaChanged':0,'artCoreChanged':0,'stockCoreChanged':0,'etchingChanged':False}
 images[row['id']]={'scan':ref,'land-hsb':control,**choices}
 c0=next(r for r in base_color['rows'] if r['id']==row['id'])
 cs=next(r for r in tone_color['rows'] if r['id']==row['id']);ci=next(r for r in ink_color['rows'] if r['id']==row['id'])
 for c,label in [(c0,'land-hsb'),(cs,'land-tone'),(ci,'land-tone-ink')]:
  assert c['renderHash']==row['trials'][label]['faceHash'] and c['referenceHash']==row['referenceHash'] and c['poseHash']==row['poseHash']
 components={label:{k:{'before':c0['components'][k]['deltaE'],'after':c['components'][k]['deltaE']} for k in ['frame','paper','stock']} for label,c in [('land-tone',cs),('land-tone-ink',ci)]}
 contrasts={label:{'before':c0['components']['frame']['texture']['contrastError'],'after':c['components']['frame']['texture']['contrastError']} for label,c in [('land-tone',cs),('land-tone-ink',ci)]}
 rows.append({'id':row['id'],'name':row['name'],'cohort':row['cohort'],'referenceHash':row['referenceHash'],'poseHash':row['poseHash'],'inkBefore':before,'variants':values,'components':components,'contrastError':contrasts})
selection=[]
labels=list(mountain_rows[0]['variants'])
for label in labels:
 vals=[r['variants'][label] for r in mountain_rows];before=[r['before'] for r in mountain_rows]
 worst=max(0,max(v-b for v,b in zip(vals,before)))
 selection.append({'trial':label,'meanInkError':float(np.mean(vals)),'worstRegression':worst,'objective':float(np.mean(vals))+.25*worst})
chosen=min(selection,key=lambda r:(r['objective'],r['trial']))['trial']
summary={}
for cohort in ['all','calibration','validation']:
 parts=[r for r in rows if cohort=='all' or r['cohort']==cohort]
 before=[r['inkBefore'] for r in parts]
 final=[r['variants'][chosen if r['name']=='Mountain' else 'land-tone']['inkError'] if not(r['name']=='Mountain' and chosen=='land-hsb') else r['inkBefore'] for r in parts]
 summary[cohort]={'count':len(parts),'medianBefore':float(np.median(before)),'medianAfter':float(np.median(final)),
                  'improved':sum(x<y for x,y in zip(final,before)),'regressed':sum(x>y for x,y in zip(final,before)),
                  'worstRegression':max(0,max(x-y for x,y in zip(final,before)))}
penalties={}
for label in ['land-tone','land-tone-ink']:
 penalties[label]={}
 for component in ['frame','paper','stock']:
  delta=[r['components'][label][component]['after']-r['components'][label][component]['before'] for r in rows]
  penalties[label][component]={'meanChange':float(np.mean(delta)),'worstRegression':max(0,max(delta))}
 delta=[r['contrastError'][label]['after']-r['contrastError'][label]['before'] for r in rows]
 penalties[label]['contrast']={'meanChange':float(np.mean(delta)),'meanPositiveRegression':float(np.mean(np.maximum(0,delta))),'worstRegression':max(0,max(delta))}
if chosen not in ['land-hsb','land-tone']:
 assert a.mountain_color, 'Selected Mountain source needs actual native color/contrast audit'
 mountain_color,mch=read(a.mountain_color)
 assert mountain_color['trialCaptureHash']==mh and mountain_color['nativeCaptureHash']==nh
 assert len(mountain_color['rows'])==3
else:
 mountain_color=None;mch=None
combined={key:[] for key in ['frame','paper','stock','contrast']}
for row in rows:
 before=next(r for r in base_color['rows'] if r['id']==row['id'])
 after=next(r for r in tone_color['rows'] if r['id']==row['id'])
 if row['name']=='Mountain':
  if chosen=='land-hsb':after=before
  elif mountain_color:
   after=next(r for r in mountain_color['rows'] if r['id']==row['id'])
   capture_row=next(r for r in mountain['rows'] if r['id']==row['id'])
   assert after['renderHash']==capture_row['trials'][chosen]['faceHash'] and after['trial']==chosen
   assert after['referenceHash']==row['referenceHash'] and after['poseHash']==row['poseHash']
 for key in ['frame','paper','stock']:
  combined[key].append(after['components'][key]['deltaE']-before['components'][key]['deltaE'])
 combined['contrast'].append(after['components']['frame']['texture']['contrastError']-before['components']['frame']['texture']['contrastError'])
penalties['selected']={key:{'meanChange':float(np.mean(v)),'meanPositiveRegression':float(np.mean(np.maximum(0,v))),'worstRegression':max(0,max(v))} for key,v in combined.items()}
assert penalties['selected']['frame']['worstRegression']<=.25
assert penalties['selected']['paper']['worstRegression']<=.25
assert penalties['selected']['stock']['worstRegression']==0
assert penalties['selected']['contrast']['meanPositiveRegression']<=.5
assert penalties['land-tone']['frame']['worstRegression']<=.25
assert penalties['land-tone']['paper']['worstRegression']<=.25
assert penalties['land-tone']['stock']['worstRegression']==0
assert penalties['land-tone']['contrast']['meanPositiveRegression']<=.5
report={'schema':1,'status':'actual-native-land-tone-and-material-refinement-verified-not-adopted',
        'scope':'All twenty-five Original land faces at fixed independently registered scan poses. Baseline HSB rasters reproduce exactly; source curves are measured from actual PNGs using the SAME before-curve physical boundary strips, not re-detected candidate positions. Source-material controls preserve art core, white stock core, alpha and default etching. Shared Mountain strength is selected on all three development illustrations of that source material, not individual printings; no independent Mountain validation is claimed. Frame/paper medians and texture contrast are compared with actual saved native audits. These are regional Oklab distances, not whole-card scores. Final integrated profile and Original/Oracle scoring remain required.',
        'source':{'nativeCaptureHash':nh,'hsbCaptureHash':hh,'toneCaptureHash':th,'mountainCaptureHash':mh,
                  'baseColorHash':bch,'toneColorHash':tch,'inkOnlyColorHash':ich,'mountainColorHash':mch,'fitHash':fh,
                  'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
                  'inkSamplerHash':hashlib.sha256((folder/'early-frame-ink-audit.py').read_bytes()).hexdigest(),
                  'mathHelperHash':hashlib.sha256((folder/'early-keyline-tone-fit.py').read_bytes()).hexdigest()},
        'mountain':{'selected':chosen,'objective':'Mean native ink error plus one quarter worst regression against pre-curve HSB, across all three illustrations.','candidates':selection,'rows':mountain_rows},
        'summary':summary,'colorAndContrast':penalties,'rows':rows}
a.output.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:report[k] for k in ['mountain','summary','colorAndContrast']},indent=2))
if a.preview:
 names=['Tundra','Volcanic Island','Plains','Swamp','Mountain'];sheet=Image.new('RGB',(4*370,5*260+30),'white');draw=ImageDraw.Draw(sheet)
 for j,label in enumerate(['scan','land-hsb','land-tone','selected']):draw.text((j*370+4,5),label,fill='black')
 for i,name in enumerate(names):
  candidates=[r for r in rows if r['name']==name];row=max(candidates,key=lambda r:r['inkBefore'])
  selected=chosen if name=='Mountain' else 'land-tone'
  for j,label in enumerate(['scan','land-hsb','land-tone',selected]):
   im=Image.fromarray(images[row['id']][label]).convert('RGB').crop((15,35,717,997));im.thumbnail((360,242));sheet.paste(im,(j*370+4,260*i+48));draw.text((j*370+4,260*i+30),name,fill='black')
 sheet.save(a.preview)
