#!/usr/bin/env python3
"""Jointly fit shared band geometry, one color order and five ink RGB values."""
import argparse
import hashlib
import itertools
import json
from pathlib import Path
import numpy as np

ENDS=np.array([0,.08,.36,.64,.92,1.])
SIDES=['left','right','top','bottom']

def load(path):
    raw=path.read_bytes()
    return json.loads(raw),hashlib.sha256(raw).hexdigest()

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('profiles',type=Path)
    parser.add_argument('inputs',type=Path)
    parser.add_argument('output',type=Path)
    args=parser.parse_args()
    data,profiles_hash=load(args.profiles)
    inputs,inputs_hash=load(args.inputs)
    entries={e['id']:e for e in inputs['entries']}
    rows=[]
    for p in data['profiles']:
        e=entries[p['id']]
        assert e['pose']['accepted'] and e['face']['wordingMode']=='original'
        assert e['reference']['sha256']==p['referenceHash']
        x=np.arange(-12,31)/1.5+p['phase']
        keep=(x>=-4.5)&(x<=13.5)
        rows.append({**p,'x':x[keep],'y':np.array(p['reference']['rgb'])[keep],
                     'colors':e['face']['frameColors']})
    assert len(rows)==40
    train=[r for r in rows if r['cohort']=='calibration']
    validation=[r for r in rows if r['cohort']=='validation']
    assert len(train)>=20 and len(validation)>=8
    cache={}

    def evaluate(values,order,cohort):
        key=(tuple(round(v,8) for v in values),order,cohort)
        if key in cache:return cache[key]
        selected=train if cohort=='calibration' else rows
        normal=np.zeros((6,6));rhs=np.zeros((6,3));parts=[]
        for r in selected:
            shift=values[SIDES.index(r['side'])];width=values[4]
            x=r['x'];left=x-1/3;right=x+1/3
            boundaries=shift+width*ENDS
            segments=np.maximum(0,np.minimum(right[:,None],boundaries[1:])-np.maximum(left[:,None],boundaries[:-1]))/(2/3)
            outer=np.clip((boundaries[0]-left)/(2/3),0,1)
            inner=np.clip((right-boundaries[-1])/(2/3),0,1)
            first,second=sorted(r['colors'],key=order.index)
            X=np.zeros((len(x),6))
            X[:,'WUBRG'.index(first)]=segments[:,1]+segments[:,3]
            X[:,'WUBRG'.index(second)]=segments[:,2]
            X[:,5]=segments[:,0]+segments[:,4]
            Z=np.stack([outer,inner],axis=1)
            # Project out two comparison-only local background colors. They
            # never become per-card renderer values or scan color corrections.
            inverse=np.linalg.pinv(Z.T@Z)
            PX=X-Z@inverse@Z.T@X
            PY=r['y']-Z@inverse@Z.T@r['y']
            normal+=X.T@PX;rhs+=X.T@PY
            parts.append((r,X,Z,inverse))
        palette=np.clip(np.linalg.lstsq(normal,rhs,rcond=None)[0],0,1)
        errors=[]
        for r,X,Z,inverse in parts:
            background=np.clip(inverse@Z.T@(r['y']-X@palette),0,1)
            predicted=X@palette+Z@background
            residual=np.linalg.norm(predicted-r['y'],axis=1)
            # The square-root mean is normalized per side so long strips and
            # brighter colors do not get extra votes merely from pixel count.
            error=float(np.sqrt(np.mean(residual**2)))
            errors.append(error)
        result={'values':list(values),'order':order,'loss':float(np.mean(errors)),
                'palette':dict(zip([*'WUBRG','edge'],palette.tolist()))}
        cache[key]=result
        return result

    # Verify the geometric pixel model against the known native source before
    # using it to infer reference geometry or colors.
    ys=[r['y'] for r in rows]
    for r in rows:
        x=np.arange(-12,31)/1.5+r['phase']
        r['y']=np.array(r['rendered']['rgb'])[(x>=-4.5)&(x<=13.5)]
    control=evaluate([0,0,0,0,6.375],'RGUBW','calibration')
    assert control['loss']<.05,('Known-source model fails',control['loss'])
    for r,y in zip(rows,ys):r['y']=y
    cache.clear()
    order='RGUBW'
    # Use the old geometry as an independent second start; edge-only fitting
    # is diagnostic and does not determine the adopted result by itself.
    starts=[[0,0,0,0,6.375],[0,0,0,5.5,6.375],[0,0,0,5,6.0],
            [data['selected']['shifts'][s] for s in SIDES]+[data['selected']['width']]]
    bounds=[(-4,4),(-4,4),(-4,4),(-1,6),(4.5,10)]
    solutions=[]
    original_bounds=bounds[:]
    for initial,kind in [(v,'free') for v in starts]+[([0,0,0,5.5,6.375],'fixed-width')]:
        bounds=original_bounds[:]
        if kind=='fixed-width':bounds[4]=(6.375,6.375)
        values=initial[:]
        order='RGUBW'
        here=evaluate(values,order,'calibration')
        for outer in range(3):
            for step in [1,.5,.125]:
                for iteration in range(16):
                    changed=False
                    for i,(lo,hi) in enumerate(bounds):
                        best=here
                        for sign in [-1,1]:
                            proposal=values[:];proposal[i]=max(lo,min(hi,proposal[i]+sign*step))
                            candidate=evaluate(proposal,order,'calibration')
                            if candidate['loss']<best['loss']-1e-8:best=candidate
                        if best is not here:
                            here=best;values=here['values'][:];changed=True
                    if not changed:break
            alternatives=[evaluate(values,''.join(p),'calibration') for p in itertools.permutations('WUBRG')]
            best_loss=min(r['loss'] for r in alternatives)
            tied=[r for r in alternatives if r['loss']<=best_loss+1e-10]
            def changes(order):
                return sum(order.index(a)>order.index(b) for i,a in enumerate('RGUBW') for b in 'RGUBW'[i+1:])
            here=min(tied,key=lambda r:(changes(r['order']),r['order']))
            here={**here,'equivalentOrders':[r['order'] for r in tied]}

            order=here['order']
            print(json.dumps({'start':initial,'iteration':outer,'values':values,'order':order,'loss':here['loss']}),flush=True)
        solutions.append({**here,'kind':kind})
    fixed=next(r for r in solutions if r['kind']=='fixed-width')
    free=min((r for r in solutions if r['kind']=='free'),key=lambda r:r['loss'])
    best=fixed
    bounds=original_bounds[:]
    all_data=evaluate(best['values'],best['order'],'all')
    # Palette remains training-only for validation; recompute validation RMSE
    # with those common inks and locally eliminated background colors.
    selected_palette=np.array([best['palette'][c] for c in [*'WUBRG','edge']])
    fixed_rows=[]
    for r in rows:
        shift=best['values'][SIDES.index(r['side'])];width=best['values'][4]
        x=r['x'];left=x-1/3;right=x+1/3;edges=shift+width*ENDS
        v=np.maximum(0,np.minimum(right[:,None],edges[1:])-np.maximum(left[:,None],edges[:-1]))/(2/3)
        outer=np.clip((edges[0]-left)/(2/3),0,1);inner=np.clip((right-edges[-1])/(2/3),0,1)
        first,second=sorted(r['colors'],key=best['order'].index)
        X=np.zeros((len(x),6));X[:,'WUBRG'.index(first)]=v[:,1]+v[:,3];X[:,'WUBRG'.index(second)]=v[:,2];X[:,5]=v[:,0]+v[:,4]
        Z=np.stack([outer,inner],axis=1);bg=np.clip(np.linalg.lstsq(Z,r['y']-X@selected_palette,rcond=None)[0],0,1)
        error=float(np.sqrt(np.mean(np.sum((X@selected_palette+Z@bg-r['y'])**2,axis=1))))
        fixed_rows.append({'id':r['id'],'name':r['name'],'side':r['side'],'cohort':r['cohort'],'rgbRMSE':error})
    before=np.array(data['beforeBox']);v=best['values'];box=[before[0]+v[0],before[1]+v[2],before[2]-v[1],before[3]-v[3]]
    f=data['frame'];source_box=[(box[0]/488-f[0])/f[2],(box[1]/680-f[1])/f[3],(box[2]-box[0])/488/f[2],(box[3]-box[1])/680/f[3]]
    result={'schema':1,'set':'2ed','status':'joint-pinline-geometry-palette-candidate-needs-native-replay',
            'scope':'One shared four-side box, one equal physical band width, one total WUBRG color order and five shared RGB inks plus edge ink. Two backgrounds per measured strip are eliminated only as comparison-model nuisance terms; they are never scan corrections or per-card renderer parameters. Calibration references choose geometry/order/palette; fixed training inks are then evaluated on all reserved strips. Native replay and remeasurement remain mandatory. These are reused development observations, not independent blind validation.',
            'sourceControl':control,'profilesHash':profiles_hash,'inputsHash':inputs_hash,'rendererHash':data['rendererHash'],
            'toolHash':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),
            'bounds':bounds,'selected':best,'freeFit':free,'selection':'Fixed source width retained pending actual native comparison; unconstrained palette fitting has source-blur uncertainty. Equivalent orders retain the existing printing rule.','alternatives':solutions,'box':box,'sourceBox':source_box,
            'sourceWidths':[v[4]/f[2],v[4]/f[3]],
            'boundary':[SIDES[i] if i<4 else 'width' for i,(lo,hi) in enumerate(bounds) if v[i]==lo or v[i]==hi],
            'evaluations':len(cache),'rows':fixed_rows,
            'validationRMSE':float(np.mean([r['rgbRMSE'] for r in fixed_rows if r['cohort']=='validation']))}
    args.output.write_text(json.dumps(result,indent=2)+'\n')
    print(json.dumps({k:result[k] for k in ['box','sourceBox','sourceWidths','boundary','validationRMSE','evaluations']}))
    print(json.dumps({'palette':best['palette'],'order':best['order']}))

if __name__=='__main__':main()
