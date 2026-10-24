"""Read-only fixed-window pigment diagnostics on the complete nonfoil native census.
Requires numpy and OpenCV. No fitting, image generation or scan-pose changes."""
import sys, json, hashlib
from pathlib import Path
import numpy as np
import cv2
study, output = map(Path, sys.argv[1:])
load = lambda f: json.loads((study / f).read_text())
inputs = load('inputs-final.json')
scores = load('scores-policy-070/scores.json')
before = load('native-reviewed-inputs/capture.json')
after = load('native-policy-070/capture.json')
by_id = {r['id']: r for r in scores['rows']}
sha = lambda b: hashlib.sha256(b).hexdigest()
def raster(file, digest):
    data = file.read_bytes()
    assert sha(data) == digest
    rgb = cv2.cvtColor(cv2.imdecode(np.frombuffer(data, np.uint8), cv2.IMREAD_COLOR), cv2.COLOR_BGR2RGB)
    return cv2.resize(rgb, (488,680), interpolation=cv2.INTER_AREA).astype(float)
def sample(image, windows):
    tiles = []
    for x,y,w,h in windows:
        # Tile medians reject thin letter ink without relying on the candidate's colors.
        for yy in range(y,y+h-3,4):
            for xx in range(x,x+w-3,4):
                tile=image[yy:yy+4,xx:xx+4].reshape(-1,3)
                tiles.append(np.median(tile,axis=0))
    a=np.array(tiles); assert len(a)>3
    lum=a @ np.array([.2126,.7152,.0722])
    # Reject only the darkest 60% of tiles in text panels. Rails are retained whole.
    if len(windows)==1 and windows[0][2]>20:
        a=a[lum>=np.quantile(lum,.6)]
    lum=a @ np.array([.2126,.7152,.0722])
    return {'rgb':np.median(a,axis=0).tolist(),
            'luma10_90':np.quantile(lum,[.1,.9]).tolist(),
            'chromaMedian':float(np.median(a.max(1)-a.min(1))),
            'nearWhiteFraction':float(np.mean(a.max(1)>=254)),
            'tiles':len(a)}
ordinary={'frame':[[27,110,4,230],[458,110,4,230]],'paper':[[53,437,378,150]],'namePaper':[[75,50,337,10]],'typePaper':[[120,400,280,8]]}
land={'frame':ordinary['frame'],'paper':[[70,455,78,130],[339,455,78,130]],'header':[[265,44,100,20],[343,393,36,16]]}
rows=[]
for e in inputs['entries']:
    id=e['id']; score=by_id[id]
    assert e['card']['finishes'] and 'nonfoil' in e['card']['finishes']
    old=next(r for r in before['rows'] if r['id']==id)
    new=next(r for r in after['rows'] if r['id']==id)
    assert old['referenceHash']==new['referenceHash']==score['referenceHash']
    scan=raster(study/'scores-policy-070'/score['normalizedReference']['file'],score['normalizedReference']['sha256'])
    images=[raster(study/d/r['layers']['face']['file'],r['layers']['face']['sha256']) for d,r in [('native-reviewed-inputs',old),('native-policy-070',new)]]
    is_land=e['face'].get('land',False)
    parts={}
    for part,windows in (land if is_land else ordinary).items():
        target=sample(scan,windows); measured=[sample(im,windows) for im in images]
        errors=[float(np.linalg.norm(np.array(m['rgb'])-target['rgb'])) for m in measured]
        parts[part]={'reference':target,'before':measured[0],'after':measured[1],'rgbMedianDistanceBefore':errors[0],'rgbMedianDistanceAfter':errors[1]}
    colors=e['face'].get('frameColors',e['card'].get('produced_mana',[])) if is_land else e['card']['colors']
    family=('land-' if is_land else '')+(''.join(colors) or ('neutral' if is_land else 'artifact'))
    rows.append({'id':id,'name':e['card']['name'],'referenceHash':score['referenceHash'],'poseHash':score['poseHash'],'family':family,'parts':parts})
summary={}
for family in sorted({r['family'] for r in rows}):
    members=[r for r in rows if r['family']==family]; parts={}
    for part in members[0]['parts']:
        parts[part]={}
        for stage in ['Before','After']:
            parts[part]['medianRgbDistance'+stage]=float(np.median([r['parts'][part]['rgbMedianDistance'+stage] for r in members]))
        parts[part]['medianLumaSpreadReference']=float(np.median([np.diff(r['parts'][part]['reference']['luma10_90'])[0] for r in members]))
        parts[part]['medianLumaSpreadAfter']=float(np.median([np.diff(r['parts'][part]['after']['luma10_90'])[0] for r in members]))
    summary[family]={'printings':len(members),'parts':parts}
body={'schema':1,'set':'8ed','scope':'All357 nonfoil native faces; fixed aligned reference rasters and fixed source-physical windows. Read-only robust tile-median RGB diagnostics, not physical ink measurements or independent holdout certification. Different artwork and printed letters are excluded by windows and robust tile medians. Texture identity and individual letter edges are not certified by these statistics.',
      'method':{'resize':'OpenCV INTER_AREA from732x1020 to488x680','tile':4,'textRejection':'discard darkest60percent of panel tiles; rails retained whole','ordinaryWindows':ordinary,'landWindows':land,'source':sha(Path(__file__).read_bytes())},
      'definition':{'inputsHash':sha((study/'inputs-final.json').read_bytes()),'rendererHash':after['source']['rendererHash'],'nativeCaptureHash':sha((study/'native-policy-070/capture.json').read_bytes()),'scoresHash':sha((study/'scores-policy-070/scores.json').read_bytes())},
      'summary':summary,'rows':rows}
output.write_text(json.dumps(body,indent=2)+'\n')
print(json.dumps(summary,indent=2))

