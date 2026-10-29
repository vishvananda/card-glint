"""Bounded shared pigment supplement on frozen development-default references."""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image
from old_frame_color_distribution import normalize,fit,adjustment,parameters,measures
from old_frame_material_validation import fields
def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main(study,out):
    d,o=map(Path,[study,out]);assert not o.exists()
    review=json.loads((d/'default-color-review-v1.json').read_bytes())
    proto=json.loads((d/'default-colors-v1/capture.json').read_bytes());assert proto['complete']
    profile=json.loads((d/'mir-selected-components-v13.json').read_bytes())
    result=[]
    for key in ['W','B']:
        peers=sorted([r for r in review['rows'] if r['set']=='7ed' and r['material']==key],key=lambda r:r['name'])
        assert len(peers)==3
        cohorts={'calibration':peers[:2],'validation':peers[2:]}
        samples={}
        for part in ['frame','paperClear']:
            values={}
            for cohort,rows in cohorts.items():
                aa=[];bb=[]
                for r in rows:
                    p=next(p for p in proto['rows'] if p['id']==r['id'] and p['variant']=='source')
                    image=d/'default-colors-v1'/p['file'];assert digest(image)==p['sha256']
                    scan=d/'default-7ed-three-donor-v5'/(r['id']+'-scan.png');assert digest(scan)==r['reference']
                    aa.append(fields(normalize(Image.open(image)),part));bb.append(fields(normalize(Image.open(scan)),part))
                values[cohort]=(np.concatenate(aa),np.concatenate(bb))
            a,b=values['calibration'];support=(a.max(1)>.15)&(b.max(1)>.15);assert support.sum()>100
            initial=profile['colors'][key]['adjustment']['frame' if part=='frame' else 'paper']
            p,optimization=fit(a[support],b[support],initial)
            samples['frame' if part=='frame' else 'paper']=dict(adjustment=adjustment(p),optimization=optimization,
                cohorts={c:dict(names=[r['name']for r in cohorts[c]],before=measures(a,b,parameters(initial)),after=measures(a,b,p))for c,(a,b) in values.items()})
            print(key,part,json.dumps(samples['frame' if part=='frame' else 'paper']),flush=True)
        result.append(dict(key=key,source=profile['colors'][key]['source'],parts=samples))
    o.write_text(json.dumps(dict(schema=1,status='development-default-pigment-supplement-native-validation-required',
        renderer=proto['renderer'],source={f:digest(d/f)for f in ['default-color-review-v1.json','default-colors-v1/capture.json','mir-selected-components-v13.json']},
        tool=digest(__file__),scope='Shared geometry is unchanged. Two alphabetical names per material fit frame strips and text-cleared paper; third name is untouched validation. Six bounded shared HSV/white-balance parameters per material/part. No artwork, text, poses or source pixels are optimized. Three names do not certify an independent set calibration.',
        results=result),indent=2)+'\n')
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('study');p.add_argument('out');a=p.parse_args();main(a.study,a.out)
