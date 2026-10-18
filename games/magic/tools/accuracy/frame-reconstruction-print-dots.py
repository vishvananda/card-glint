"""Prepare clean native-scan patches and evaluate cached print-dot GPU trials."""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import binary_dilation, uniform_filter
from frame_reconstruction.geometry import read_image, sample
from frame_reconstruction.print_dots import descriptors, distance


def save(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n')


def select_patches(mask, shape, count=6):
    h, w = shape
    safe = uniform_filter(mask.astype(float), size=(h, w), mode='constant') > .999999
    locations = np.argwhere(safe)
    selected = []
    # Deterministic spatial coverage; not selected for good spectral agreement.
    while len(locations) and len(selected) < count:
        y, x = locations[len(locations)//2]
        selected.append((int(y-h//2), int(x-w//2)))
        locations = locations[(np.abs(locations[:, 0]-y) >= h) | (np.abs(locations[:, 1]-x) >= w)]
    return selected


def prepare(root, out):
    out.mkdir(exist_ok=True, parents=True)
    rows = json.loads((root/'observations.json').read_text())['records']
    # The prior plate is used only to identify unchanged rendered lettering.
    plate = np.asarray(Image.open(root/'prior-inner/tone-plate.png').resize((732,1020),Image.Resampling.LANCZOS)).astype(float)/255
    stocks = read_image(root/'border/stock-mask.png')[..., :1]
    band = read_image(root/'joint/backprop-overlay.png')[..., 3:]
    shapes = dict(frame=(32,16), paper=(32,32), innerBorder=(32,6))
    groups = {k: dict(reference=[], coordinates=[], metadata=[]) for k in shapes}
    for index, row in enumerate(rows):
        with np.load(root/'prepared'/f"{row['id']}.npz") as data:
            raw, mask, card = data['raw'], data['mask'], data['card']
        face = read_image(root/'corners-native'/f"{row['id']}-0.png")
        x, y = (card[...,0]+.5)*1.5-.5, (card[...,1]+.5)*1.5-.5
        ink = np.max(np.abs(face[...,:3]-plate[...,:3]),-1) > .035
        trusted = mask & ~binary_dilation(sample(ink[...,None].astype(float),x,y)[...,0]>.05, iterations=6)
        cx, cy = card[...,0]+.5, card[...,1]+.5
        paper = (cx>66)&(cx<423)&(cy>414)&(cy<594)
        bx, by = cx*stocks.shape[1]/488-.5, cy*stocks.shape[0]/680-.5
        material = sample(stocks, bx, by)[...,0]*sample(band,bx,by)[...,0]
        inner = (material>.999)&(cy>65)&(cy<610)&((cx<24)|(cx>464))
        masks = dict(frame=trusted&~paper&(raw.min(-1)>.35), paper=trusted&paper, innerBorder=inner)
        for region, shape in shapes.items():
            points = select_patches(masks[region],shape)
            if not points:
                print(f'Skip {region}: no uncontaminated patch for {row["name"]}',flush=True)
                continue
            h,w=shape
            for yy,xx in points:
                groups[region]['reference'].append(raw[yy:yy+h,xx:xx+w])
                groups[region]['coordinates'].append(np.stack([x[yy:yy+h,xx:xx+w],y[yy:yy+h,xx:xx+w]],-1))
                groups[region]['metadata'].append(dict(id=row['id'],name=row['name'],cohort=row['cohort'],pixel=[xx,yy],shape=[w,h]))
        print(f'{index+1}/{len(rows)} {row["name"]}',flush=True)
    metadata={}
    for region, group in groups.items():
        reference=np.asarray(group['reference']); coordinates=np.asarray(group['coordinates'])
        stats=descriptors(reference)
        np.savez_compressed(out/f'{region}-patches.npz',reference=reference,coordinates=coordinates,**stats)
        metadata[region]=group['metadata']
    save(out/'patches.json',dict(regions=metadata,policy='Raw native scan pixels; fixed archived affine poses; clean spatially sampled material patches; no per-card dot fitting.',counts={k:len(v) for k,v in metadata.items()}))
    candidates=[dict(key='none',amount=0,period=2.8,variation=.5,inset=0),dict(key='preview',amount=.45,period=2.8,variation=.5,inset=0)]
    for period in [2,2.5,2.8,3.25,4,5]:
        for variation in [0,.5,1]:
            for amount in [.02,.05,.1,.15,.25,.45,.7,1]:
                if period==2.8 and variation==.5 and amount==.45:continue
                candidates.append(dict(key=f'p{period}-v{variation}-a{amount}',amount=amount,period=period,variation=variation,inset=0))
    save(out/'candidates.json',dict(source='../corners-v3/joint/backprop-plate.png',size=[732,1020],candidates=candidates))
    print({k:len(v) for k,v in metadata.items()})


def score(out):
    meta=json.loads((out/'patches.json').read_text())['regions']
    manifest=json.loads((out/'candidates.json').read_text())
    refs={}; coords={}; selections={}; cards={}
    for region, rows in meta.items():
        data=np.load(out/f'{region}-patches.npz')
        xy=data['coordinates'];jacobians=np.stack([xy[:,0,1]-xy[:,0,0],xy[:,1,0]-xy[:,0,0]],axis=-1)
        refs[region]=descriptors(data['reference'],jacobians);coords[region]=xy
        cards[region]={id:np.array([r['id']==id for r in rows]) for id in dict.fromkeys(r['id'] for r in rows)}
        selections[region]={c:{id:sel for id,sel in cards[region].items() if c=='all' or rows[np.flatnonzero(sel)[0]]['cohort']==c} for c in ['calibration','validation','all']}
    results=[]
    checkpoints=out/'scores-v2';checkpoints.mkdir(exist_ok=True)
    fingerprint=hashlib.sha256()
    for source in [Path(__file__),Path(__file__).with_name('frame_reconstruction')/'print_dots.py',out/'patches.json',out/'candidates.json',*[out/f'{r}-patches.npz' for r in meta]]:fingerprint.update(source.read_bytes())
    fingerprint=fingerprint.hexdigest()
    for i,candidate in enumerate(manifest['candidates']):
        file=out/'renders'/f"{candidate['key']}.png"
        if not file.exists():continue
        checkpoint=checkpoints/f"{candidate['key']}.json"
        if checkpoint.exists():
            cached=json.loads(checkpoint.read_text())
            if cached.get('inputFingerprint')==fingerprint and cached['sha256']==hashlib.sha256(file.read_bytes()).hexdigest():
                results.append(cached);continue
        image=read_image(file)[...,:3]; summary={}; per_card={}
        for region, reference in refs.items():
            xy=coords[region];h,w=xy.shape[1:3];center=xy.mean((1,2));start=np.rint(center-np.array([(w-1)/2,(h-1)/2])).astype(int)
            yy,xx=np.mgrid[:h,:w];predicted=image[start[:,1,None,None]+yy,start[:,0,None,None]+xx];stats=descriptors(predicted)
            errors=distance(reference,stats)
            per_card[region]={id:{k:np.mean(v[sel],axis=0).tolist() for k,v in errors.items()} for id,sel in cards[region].items()}
            summary[region]={cohort:{k:np.mean([per_card[region][id][k] for id in subset],axis=0).tolist() for k in errors} for cohort,subset in selections[region].items()}
        results.append(dict(**candidate,inputFingerprint=fingerprint,sha256=hashlib.sha256(file.read_bytes()).hexdigest(),regions=summary,cards=per_card))
        save(checkpoint,results[-1])
        if i%10==0: print(f'{i+1}/{len(manifest["candidates"])}',flush=True)
    best={region:min(results,key=lambda r:r['regions'][region]['calibration']['spectral'])['key'] for region in refs}
    save(out/'results.json',dict(metric='Phase-independent native-pixel spectral-amplitude mismatch; reference frequencies mapped by inverse-transpose affine Jacobian; no pixel resampling; lower is better; not whole-card accuracy.',best=best,candidates=results))
    for region in refs:
        print(region)
        for r in sorted(results,key=lambda r:r['regions'][region]['calibration']['spectral'])[:8]:
            print(r['key'],r['regions'][region])
        for control in ['none','preview']:
            matching=next((r for r in results if r['key']==control),None)
            if matching:print(control,matching['regions'][region])


def select(output, trials):
    candidates=[]
    for trial in trials:
        data=json.loads((trial/'results.json').read_text())
        candidates.extend(dict(c,folder=trial.name) for c in data['candidates'])
    control=next(c for c in candidates if c['key']=='none')
    choices=[]
    for period in sorted(set(c['period'] for c in candidates if c['period']>=2)):
        winners={}
        for region in ['frame','paper','innerBorder']:
            eligible=[c for c in candidates if c['period']==period and c.get('blackGeneration',1)==1
                      and c['regions'][region]['calibration']['meanRgbError255'] <= control['regions'][region]['calibration']['meanRgbError255']+1]
            if eligible:winners[region]=min(eligible,key=lambda c:c['regions'][region]['calibration']['spectral'])
        if len(winners)==3:
            choices.append((sum(c['regions'][r]['calibration']['spectral'] for r,c in winners.items())/3,period,winners))
    if not choices:raise ValueError('No complete shared-period candidate')
    loss,period,winners=min(choices,key=lambda c:c[0])
    profile=dict(status='Fitted Alpha white scan texture',period=period,resolution=[732,1020],
        policy='One shared legal period and existing ink separation; material-specific strength and variation; training mean RGB error cannot rise by more than 1/255 relative to no dots.',
        materials={r:{k:c.get(k,1 if k=='blackGeneration' else 0) for k in ['amount','period','variation','blackGeneration','rotation','inset']} for r,c in winners.items()},
        selection={r:dict(key=c['key'],folder=c['folder']) for r,c in winners.items()})
    save(output/'profile.json',profile)
    print(json.dumps(profile,indent=2))


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command',choices=['prepare','score','select'])
    parser.add_argument('root',type=Path)
    parser.add_argument('output',type=Path)
    parser.add_argument('--trials',type=Path,nargs='+')
    args=parser.parse_args()
    if args.command=='prepare':prepare(args.root,args.output)
    elif args.command=='score':score(args.output)
    else:select(args.output,args.trials or [args.output])
