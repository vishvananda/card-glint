#!/usr/bin/env python3
"""Verify exact land controls across native generations and outline-source isolation."""
import argparse
import hashlib
import json
from pathlib import Path
import numpy as np
from PIL import Image

p=argparse.ArgumentParser(description=__doc__)
for key in ['native','capture','basics','duals','output']:p.add_argument(key,type=Path)
a=p.parse_args()
def read(path):
    b=path.read_bytes();return json.loads(b),hashlib.sha256(b).hexdigest()
def verify(path,expected):
    b=path.read_bytes();assert hashlib.sha256(b).hexdigest()==expected,str(path)
    return b
n,nh=read(a.native/'capture.json');c,ch=read(a.capture/'capture.json');d,dh=read(a.capture/'definition.json');olddual,od=read(a.duals/'capture.json')
assert c['source']['nativeCaptureHash']==nh and c['source']['definitionHash']==dh
assert c['source']['rendererHash']==n['source']['rendererHash']==olddual['source']['rendererHash']
assert len(c['rows'])==len({r['id'] for r in c['rows']})==25
basicnames={'Plains':'WL','Island':'UL','Swamp':'BL','Mountain':'RL','Forest':'GL'}
priors={};sources={'dualCaptureHash':od};rows=[]
for name,key in basicnames.items():
    prior,ph=read(a.basics/(key+'-native/capture.json'));assert prior['source']['rendererHash']==c['source']['rendererHash']
    priors[name]=prior;sources[key]={'captureHash':ph,'nativeCaptureHash':prior['source']['nativeCaptureHash']}
for row in c['rows']:
    current=next(r for r in n['rows'] if r['id']==row['id'])
    assert row['baselineParity'] and row['referenceHash']==current['referenceHash'] and row['poseHash']==current['poseHash']
    assert row['trials']['current']['faceHash']==current['renderHash']
    verify(a.native/'2ed'/(row['id']+'.png'),current['renderHash'])
    verify(a.capture/'current'/(row['id']+'.png'),current['renderHash'])
    basic=row['name'] in basicnames
    prior=priors[row['name']] if basic else olddual
    old=next(r for r in prior['rows'] if r['id']==row['id'])
    assert old['baselineParity'] and old['trials']['current']['faceHash']==current['renderHash']
    assert old['referenceHash']==row['referenceHash'] and old['poseHash']==row['poseHash']
    variant='land-accents' if basic else 'pinline-fixed-edge'
    folder=a.basics/(basicnames[row['name']]+'-native') if basic else a.duals
    expected=old['trials'][variant]['faceHash']
    assert row['trials']['land-material']['faceHash']==expected
    verify(folder/variant/(row['id']+'.png'),expected)
    verify(a.capture/'land-material'/(row['id']+'.png'),expected)
    record={'id':row['id'],'name':row['name'],'referenceHash':row['referenceHash'],'poseHash':row['poseHash'],
            'defaultParity':True,'materialParity':True,'priorNativeCaptureHash':prior['source']['nativeCaptureHash']}
    if not basic:
        before=verify(a.capture/'brown-transfer'/(row['id']+'.png'),row['trials']['brown-transfer']['faceHash'])
        after=verify(a.capture/'outline-transfer'/(row['id']+'.png'),row['trials']['outline-transfer']['faceHash'])
        b=np.asarray(Image.open(a.capture/'brown-transfer'/(row['id']+'.png')).convert('RGBA'))
        v=np.asarray(Image.open(a.capture/'outline-transfer'/(row['id']+'.png')).convert('RGBA'))
        assert b.shape==v.shape==(1020,732,4)
        changed=np.any(b!=v,axis=2)
        f=next(t['materials']['L'] for t in d['trials'] if t['id']=='brown-transfer')['frame']
        outer=[(f[0]+78/1500*f[2])*732,(f[1]+90/2100*f[3])*1020,
               (f[0]+1422/1500*f[2])*732,(f[1]+2010/2100*f[3])*1020]
        inner=[(f[0]+108/1500*f[2])*732,(f[1]+120/2100*f[3])*1020,
               (f[0]+1392/1500*f[2])*732,(f[1]+1980/2100*f[3])*1020]
        yy,xx=np.indices((1020,732));ring=(xx>=outer[0]-2)&(xx<=outer[2]+2)&(yy>=outer[1]-2)&(yy<=outer[3]+2)
        ring &= ~((xx>=inner[0]+2)&(xx<=inner[2]-2)&(yy>=inner[1]+2)&(yy<=inner[3]-2))
        assert not np.any(changed & ~ring),row['name']
        expected_change=row['name'] in ['Tundra','Volcanic Island']
        assert bool(changed.any())==expected_change
        assert np.array_equal(b[:,:,3],v[:,:,3])
        assert row['trials']['brown-transfer']['etchingHash']==row['trials']['outline-transfer']['etchingHash']
        record['outline']={'changedPixels':int(changed.sum()),'expectedChange':expected_change,
                            'outsideSourceOutlineChanged':0,'alphaChanged':0,'etchingChanged':False}
    rows.append(record)
report={'schema':1,'status':'paired-land-controls-and-outline-choice-native-verified',
        'scope':'Twenty-five exact current defaults and twenty-five prepared material controls. Fifteen basic controls bridge older capture metadata only by actual before/after PNG equality and matching source/reference/pose identities; this does not claim equivalence for the other printings in that older capture. Ten dual material controls match their native palette replay. Only Tundra and Volcanic Island change under independently reviewed outline-source choices, confined to the projected source outline ring. No scan pose or renderer profile is changed.',
        'source':{'nativeCaptureHash':nh,'captureHash':ch,'definitionHash':dh,'rendererHash':c['source']['rendererHash'],
                  'priors':sources,'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest()},
        'defaultsMatched':len(rows),'materialsMatched':len(rows),'outlineSourcesChanged':sum(bool(r.get('outline',{}).get('changedPixels')) for r in rows),'rows':rows}
a.output.write_text(json.dumps(report,indent=2)+'\n');print(json.dumps({k:report[k] for k in ['defaultsMatched','materialsMatched','outlineSourcesChanged']}))
