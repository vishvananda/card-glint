"""One final whole-material HSB/contrast fit after luminance reconstruction.

All color parameters are shared across the material, including frame and paper.
No per-pixel chroma, per-card color, or separate paper correction is introduced.
The exported frame contains the correction; no runtime HSB is required.
"""
import argparse,hashlib,importlib.util,json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter
from scipy.optimize import least_squares
from frame_reconstruction.geometry import read_image,sample,scan_card_coordinates
from frame_reconstruction.tone import adjust


def sha(path):return hashlib.sha256(path.read_bytes()).hexdigest()


def run(root, texture, out):
    out.mkdir(parents=True,exist_ok=False)
    spec=importlib.util.spec_from_file_location('whole',Path(__file__).with_name('frame-reconstruction-whole-material.py'));whole=importlib.util.module_from_spec(spec);spec.loader.exec_module(whole)
    fit=json.loads((texture/'fit.json').read_text());assert fit['mode']=='luminance-relative-contrast'
    candidates=json.loads((root/'candidates.json').read_text())['candidates'][0]
    originals=json.loads((root/'observations.json').read_text())['records'];by_source={r['source']:r for r in fit['sourceReceipts']}
    samples=[];rng=np.random.default_rng(1903);excluded=[]
    for row in originals:
        if not row['normalization'].get('accepted',False):
            excluded.append(dict(id=row['id'],name=row['name'],reason='Frozen scan pose rejected'));continue
        sourcefile=candidates.get('perCardFile',candidates['file']).replace('{id}',row['id'])
        source,raw,grid,valid,counts=whole.prepare(root,root/sourcefile,row)
        reconstructed=read_image(texture/by_source[sourcefile]['file'])
        x,y=scan_card_coordinates(raw.shape,row['normalization']['transform']['matrix'])
        predicted=sample(reconstructed,(x+.5)*reconstructed.shape[1]/488-.5,(y+.5)*reconstructed.shape[0]/680-.5)[...,:3]
        before=gaussian_filter(predicted,(1.4,1.4,0));target=gaussian_filter(raw,(1.4,1.4,0))
        paper=(x>65)&(x<425)&(y>410)&(y<602)
        ids=[]
        # Stratification ensures the box is present; it creates no separate
        # fitting parameters or application mask for that region.
        for zone in [valid&paper,valid&~paper]:
            options=np.flatnonzero(zone);ids.extend(rng.choice(options,min(1500,len(options)),replace=False))
        ids=np.asarray(ids,dtype=int)
        if len(ids)<100:excluded.append(dict(id=row['id'],name=row['name'],reason='Insufficient clean texture'));continue
        samples.append(dict(row=row,counts=counts,a=before.reshape(-1,3)[ids],b=target.reshape(-1,3)[ids]))
    train=[r for r in samples if r['row']['cohort']=='calibration']
    for zone in ['paper','frame']:
        if sum(r['counts'][zone]>=100 for r in train)<5:raise ValueError('Insufficient '+zone+' samples')
    a=np.concatenate([r['a'] for r in train]);b=np.concatenate([r['b'] for r in train])
    def residual(p):return np.r_[(adjust(a,p)-b).ravel(),p*len(a)**.5*np.array([.00005,.001,.001,.003])]
    result=least_squares(residual,np.zeros(4),bounds=([-30,-.8,-.8,np.log(.5)],[30,.6,.5,np.log(1.8)]),loss='soft_l1',f_scale=.025,max_nfev=110)
    if not result.success:raise ValueError(result.message)
    parameters=result.x
    def objective(p):
        r=residual(p);return float(np.sum(.025**2*(np.sqrt(1+(r/.025)**2)-1)))
    optimum=objective(parameters)
    lower=np.array([-30,-.8,-.8,np.log(.5)]);upper=np.array([30,.6,.5,np.log(1.8)])
    for index,step in enumerate([1.,.02,.02,.02]):
        for sign in [-1,1]:
            trial=parameters.copy();trial[index]+=sign*step
            if np.any(trial<lower) or np.any(trial>upper):continue
            if objective(trial)<optimum*.9999:raise ValueError('Global tone optimizer failed an independent finite-step check')
    geometry=json.loads((root/'geometry.json').read_text());pins={r['key']:r['target'] for r in geometry['pins']}
    assets=[]
    for entry in fit['sourceReceipts']:
        image=read_image(texture/entry['file']);h,w=image.shape[:2];yy,xx=np.mgrid[:h,:w];x=(xx+.5)*488/w;y=(yy+.5)*680/h
        material=(x>pins['stock-left'])&(x<pins['stock-right'])&(y>pins['stock-top'])&(y<pins['stock-bottom'])&(image[...,3]>0)
        corrected=adjust(image[...,:3],parameters);image[...,:3][material]=corrected[material]
        path=out/entry['file'];Image.fromarray(np.round(image.clip(0,1)*255).astype('uint8')).save(path)
        assets.append(dict(source=entry['source'],file=path.name,sha256=sha(path)))
    rows=[]
    for r in samples:
        rows.append(dict(id=r['row']['id'],name=r['row']['name'],cohort=r['row']['cohort'],coverage=r['counts'],before=float(np.abs(r['a']-r['b']).mean()),after=float(np.abs(adjust(r['a'],parameters)-r['b']).mean())))
    value=dict(schema=1,material=root.name,textureProofSha256=sha(texture/'fit.json'),methodSha256=[sha(Path(__file__)),sha(Path(__file__).parent/'frame_reconstruction/tone.py')],policy='One shared final encoded-sRGB HSB/value-gamma correction for frame plus paper, baked into the whole material. No per-card or per-region color parameters. Text and grain masks verified independently. Reused development cohorts, not blind validation. RGB errors are component diagnostics, not full-card accuracy.',adjustment=dict(hueDegrees=float(parameters[0]),saturationScale=float(np.exp(parameters[1])),brightnessScale=float(np.exp(parameters[2])),valueGamma=float(np.exp(parameters[3]))),assets=assets,rows=rows,excluded=excluded)
    (out/'fit.json').write_text(json.dumps(value,indent=2)+'\n');print(json.dumps(dict(material=root.name,adjustment=value['adjustment'],cards=len(rows))),flush=True)


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('study',type=Path);p.add_argument('texture',type=Path);p.add_argument('output',type=Path);a=p.parse_args();run(a.study,a.texture,a.output)
