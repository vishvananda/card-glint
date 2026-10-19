"""Reconstruct complete experimental materials from frozen native scan pixels.

One shared RGB residual field per frame family includes its paper and exterior
pigment. No paper-specific tone filter, learned scan pose, per-card parameters,
or runtime HSB is used. Source alpha, art holes and stock stay fixed. External
images remain local. Requires NumPy, Pillow, SciPy and PyTorch.
"""
import argparse
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, grey_closing, binary_dilation, binary_erosion
import torch
import torch.nn.functional as F

from frame_reconstruction.geometry import read_image, sample, scan_card_coordinates
from frame_reconstruction.model import gaussian


def tensor(value):
    return torch.from_numpy(np.asarray(value, dtype=np.float32)).permute(2, 0, 1)[None]


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def image(path, rgb, alpha):
    output = np.concatenate([np.clip(rgb, 0, 1), alpha], -1)
    Image.fromarray(np.round(output * 255).astype('uint8')).save(path)


def prepare(root, source_path, row):
    source = read_image(source_path)
    raw = read_image(row['reference']['file'])
    x, y = scan_card_coordinates(raw.shape, row['normalization']['transform']['matrix'])
    sx, sy = (x + .5) * source.shape[1] / 488 - .5, (y + .5) * source.shape[0] / 680 - .5
    src = sample(source, sx, sy)
    gray = gaussian_filter(raw[..., :3] @ np.array([.2126, .7152, .0722]), 1.6)
    backdrop = grey_closing(gray, size=(11, 11))
    ink = (backdrop - gray) > np.maximum(.05, backdrop * .15)
    # Content masks come from identical native printing/blank controls. Tinted
    # land blanks are not interchangeable, so their scan strokes are used alone.
    content = np.zeros_like(ink)
    if root.name != 'L' and (root/'released-frame.png').exists():
        blank = read_image(root/'released-frame.png')
        old = read_image(root/row['baseline']['file'])
        bx, by = (x+.5)*old.shape[1]/488-.5, (y+.5)*old.shape[0]/680-.5
        blank_x, blank_y = (x+.5)*blank.shape[1]/488-.5, (y+.5)*blank.shape[0]/680-.5
        content = np.max(abs(sample(old,bx,by)[...,:3]-sample(blank,blank_x,blank_y)[...,:3]),-1)>.035
    valid = (src[...,3]>.99) & (src[...,:3].max(-1)>.12)
    valid &= (x>31)&(x<457)&(y>34)&(y<643)
    # Heading, type and credit bands are not unprinted texture observations.
    valid &= ~(((y>28)&(y<67))|((y>372)&(y<408))|((y>604)&(y<648)))
    valid &= ~binary_dilation(ink|content,iterations=5)
    valid = binary_erosion(valid,iterations=3)
    paper = (x>65)&(x<425)&(y>410)&(y<602)
    counts = dict(all=int(valid.sum()),paper=int((valid&paper).sum()),frame=int((valid&~paper).sum()))
    grid = np.stack([2*(x+.5)/488-1,2*(y+.5)/680-1],-1).astype('float32')
    return source,raw[...,:3],grid,valid,counts


def patches(raw, grid, valid, rng):
    choices=[]
    for y in range(0,valid.shape[0]-128,96):
        for x in range(0,valid.shape[1]-128,96):
            if valid[y:y+128,x:x+128].sum()>1300:choices.append((y,x))
    rng.shuffle(choices)
    result=[]
    for y,x in choices[:32]:
        sl=np.s_[y:y+128,x:x+128]
        mask=valid[sl].copy();mask[:6]=mask[-6:]=False;mask[:,:6]=mask[:,-6:]=False
        result.append((torch.from_numpy(grid[sl].copy())[None],gaussian(tensor(raw[sl]),1.4),tensor(mask[...,None])))
    return result


def correction(luma,chroma,grid):
    luminance=F.grid_sample(luma,grid,align_corners=False,padding_mode='border').clamp(-.16,.16)
    color=F.grid_sample(chroma,grid,align_corners=False,padding_mode='border').clamp(-.10,.10)
    weights=color.new_tensor([.2126,.7152,.0722])[None,:,None,None]
    color=color-(color*weights).sum(1,keepdim=True)
    return luminance+color


def fit(root, out, steps, luminance_only=False):
    out.mkdir(parents=True,exist_ok=False)
    observations=json.loads((root/'observations.json').read_text())['records']
    geometry=json.loads((root/'geometry.json').read_text());pins={p['key']:p['target'] for p in geometry['pins']}
    assert all(k in pins for k in ['stock-left','stock-right','stock-top','stock-bottom'])
    candidate=json.loads((root/'candidates.json').read_text())['candidates'][0]
    prepared=[]; sources={};excluded=[];rng=np.random.default_rng(1903)
    for row in observations:
        if not row['normalization'].get('accepted',False):
            excluded.append(dict(id=row['id'],name=row['name'],reason='Frozen scan pose rejected'));continue
        path=root/candidate.get('perCardFile',candidate['file']).replace('{id}',row['id'])
        source,raw,grid,valid,counts=prepare(root,path,row)
        key=str(path);sources.setdefault(key,source)
        if len(prepared)<2:
            preview=raw.copy();preview[...,:3]=preview[...,:3]*.35
            preview[valid]=raw[valid];image(out/(row['id']+'-mask.png'),preview,np.ones((*valid.shape,1)))
        prepared.append(dict(row=row,key=key,counts=counts,patches=patches(raw,grid,valid,rng)))
        print(json.dumps(dict(phase='coverage',name=row['name'],**counts)),flush=True)
    train=[r for r in prepared if r['row']['cohort']=='calibration']
    for zone in ['paper','frame']:
        if sum(r['counts'][zone]>=100 for r in train)<5:
            raise ValueError(f'Insufficient {zone} coverage; no fit or identity fallback permitted')
    manifest = dict(observationsSha256=digest(root/'observations.json'),
        sourceHashes={Path(k).relative_to(root).as_posix():digest(Path(k)) for k in sources},
        rows=[dict(id=r['row']['id'], name=r['row']['name'], cohort=r['row']['cohort'],
            referenceSha256=r['row']['reference']['sha256'], transform=r['row']['normalization']['transform']['matrix'],
            coverage=r['counts']) for r in prepared])
    (out/'inputs.json').write_text(json.dumps(manifest,indent=2)+'\n')
    # All variants, including lands, share exactly these fields. Only the input
    # palette raster differs. Learn neither per-card colors nor per-card textures.
    # A shared baked RGB offset carries the observed tone beneath lettering;
    # spatial fields are regularized residuals, not separate paper filters.
    global_rgb=torch.nn.Parameter(torch.zeros(1,3,1,1))
    luma=torch.nn.Parameter(torch.zeros(1,1,185,133))
    chroma=torch.nn.Parameter(torch.zeros(1,3,43,31))
    optimizer=torch.optim.Adam([luma] if luminance_only else [global_rgb,luma,chroma],lr=.007)
    tensors={k:tensor(v[...,:3]) for k,v in sources.items()}
    coefficients=torch.tensor([.2126,.7152,.0722])[None,:,None,None]
    def prediction(base, grid, gate=1):
        if luminance_only:
            field=F.grid_sample(luma,grid,align_corners=False,padding_mode='border').clamp(-.16,.16)
            return (base*torch.exp(field*gate)).clamp(0,1)
        return (base+global_rgb+correction(luma,chroma,grid)*gate).clamp(0,1)
    def measurement(value,target,valid):
        if luminance_only:
            value=(value*coefficients).sum(1,keepdim=True);target=(target*coefficients).sum(1,keepdim=True)
            a=(value*valid).sum()/valid.sum().clamp_min(1);b=(target*valid).sum()/valid.sum().clamp_min(1)
            return (value-a)/(a+.05),(target-b)/(b+.05)
        return value,target
    training=[(r['key'],p) for r in train for p in r['patches']]
    if len(training)<16:raise ValueError('Insufficient independent native patches')
    history=[]
    for step in range(steps):
        optimizer.zero_grad();terms=[]
        for index in rng.choice(len(training),16,replace=False):
            key,(grid,target,valid)=training[index]
            base=F.grid_sample(tensors[key],grid,align_corners=False,padding_mode='border')
            predicted=gaussian(prediction(base,grid),1.4)
            measured,reference=measurement(predicted,target,valid)
            error=F.huber_loss(measured,reference,reduction='none',delta=.035)
            terms.append((error*valid).sum()/(valid.sum()*(1 if luminance_only else 3)).clamp_min(1))
        data=torch.stack(terms).mean()
        smooth=sum((p[:,:,1:]-p[:,:,:-1]).square().mean()+(p[:,:,:,1:]-p[:,:,:,:-1]).square().mean() for p in [luma,chroma])
        prior=luma.square().mean()+chroma.square().mean()+.1*global_rgb.square().mean()
        prior+=luma.mean().square()+chroma.mean(dim=(2,3)).square().mean()
        loss=data+.002*prior+.008*smooth;loss.backward();optimizer.step()
        with torch.no_grad():global_rgb.clamp_(-.12,.12);luma.clamp_(-.16,.16);chroma.clamp_(-.10,.10)
        if step%20==0 or step==steps-1:
            history.append(dict(step=step,data=float(data.detach()),prior=float(prior.detach()),smooth=float(smooth.detach())))
            print(json.dumps(dict(phase='backprop',**history[-1])),flush=True)
    # Support is derived from five or more distinct calibration names, never
    # from the validation cohort. At ten cards the field has full confidence.
    support=np.zeros((680,488),dtype=np.uint16); seen_by_name={}
    for r in train:
        source,raw,grid,valid,counts=prepare(root,Path(r['key']),r['row'])
        coords=grid[valid];ix=np.clip(((coords[:,0]+1)*488/2).astype(int),0,487);iy=np.clip(((coords[:,1]+1)*680/2).astype(int),0,679)
        seen=np.zeros_like(support,dtype=bool);seen[iy,ix]=True
        name=r["row"].get("oracleId",r["row"]["name"]);seen_by_name[name]=seen_by_name.get(name,np.zeros_like(seen))|seen
    support=sum(seen_by_name.values(),np.zeros_like(support))
    support=np.clip((support.astype(float)-4)/6,0,1)
    filled=None;fill_report=[]
    if luminance_only:
        from frame_reconstruction.material_fill import fill_scalar
        first=next(iter(sources.values()));yy,xx=np.mgrid[:680,:488]
        small=sample(first,(xx+.5)*first.shape[1]/488-.5,(yy+.5)*first.shape[0]/680-.5)
        domain=(small[...,3]>.99)&(small[...,:3].max(-1)>.12)
        domain&=(xx>pins['stock-left'])&(xx<pins['stock-right'])&(yy>pins['stock-top'])&(yy<pins['stock-bottom'])
        raw_field=F.interpolate(luma.detach(),(680,488),mode='bilinear',align_corners=False)[0,0].numpy()
        filled,fill_report=fill_scalar(raw_field,support>0,domain)
        final_field=tensor(filled[...,None])
    exported={};source_receipts=[]
    for index,(key,source) in enumerate(sources.items()):
        h,w=source.shape[:2];yy,xx=np.mgrid[:h,:w]
        grid=np.stack([2*(xx+.5)/w-1,2*(yy+.5)/h-1],-1).astype('float32')
        with torch.no_grad():delta=correction(luma,chroma,torch.from_numpy(grid)[None])[0].permute(1,2,0).numpy()
        gate=sample(support[...,None],(xx+.5)*488/w-.5,(yy+.5)*680/h-.5)
        x=(xx+.5)*488/w;y=(yy+.5)*680/h
        bounds=(x>pins['stock-left'])&(x<pins['stock-right'])&(y>pins['stock-top'])&(y<pins['stock-bottom'])
        material=((source[...,3:]>.99)&(source[...,:3].max(-1,keepdims=True)>.12))*bounds[...,None]
        offset=global_rgb.detach()[0,:,0,0].numpy()
        corrected=np.clip(source[...,:3]+(offset+delta*gate)*material,0,1)
        if luminance_only:
            scalar=sample(filled[...,None],(xx+.5)*488/w-.5,(yy+.5)*680/h-.5)
            corrected=np.clip(source[...,:3]*np.exp(scalar*material),0,1)
        name=f'plate-{index}.png';image(out/name,corrected,source[...,3:]);exported[key]=name
        source_receipts.append(dict(source=Path(key).relative_to(root).as_posix(),sourceSha256=digest(Path(key)),file=name,sha256=digest(out/name)))
    image(out/'support.png',np.repeat(support[...,None],3,-1),np.ones((680,488,1)))
    # Native patches have one fixed matched low-pass; report separate regions
    # only as diagnostics, never as independent rendering/color parameters.
    metrics=[]
    for r in prepared:
        before=[];after=[]
        with torch.no_grad():
            for grid,target,valid in r['patches']:
                base=F.grid_sample(tensors[r['key']],grid,align_corners=False,padding_mode='border')
                gate=F.grid_sample(tensor(support[...,None]),grid,align_corners=False,padding_mode='border')
                a=gaussian(base,1.4);b=gaussian(prediction(base,grid,gate),1.4)
                if luminance_only:
                    gain=torch.exp(F.grid_sample(final_field,grid,align_corners=False,padding_mode='border'))
                    b=gaussian((base*gain).clamp(0,1),1.4)
                a,reference=measurement(a,target,valid);b,_=measurement(b,target,valid)
                before.append(float((abs(a-reference)*valid).sum()/(valid.sum()*(1 if luminance_only else 3)).clamp_min(1)))
                after.append(float((abs(b-reference)*valid).sum()/(valid.sum()*(1 if luminance_only else 3)).clamp_min(1)))
        metrics.append(dict(id=r['row']['id'],name=r['row']['name'],cohort=r['row']['cohort'],coverage=r['counts'],before=float(np.mean(before)),after=float(np.mean(after)),file=exported[r['key']]))
    report=dict(schema=1,material=root.name,steps=steps,mode='luminance-relative-contrast' if luminance_only else 'exploratory-rgb',fill=fill_report,excluded=excluded,inputSha256=digest(out/'inputs.json'),toolSha256=digest(Path(__file__)),policy=('Luminance-only texture reconstruction; hue/saturation preserved; color matching is a later whole-material step. ' if luminance_only else 'Exploratory RGB reconstruction; not adopted. ')+ 'Shared whole-material backpropagation. Native raw scan patches; frozen poses; relative ink masks and rendering content exclusions; five-card minimum. No separate paper calibration, no post-HSB. Development cohorts reused, not blind validation.',sourceReceipts=source_receipts,history=history,rows=metrics,bakedRgbOffset=global_rgb.detach()[0,:,0,0].tolist(),postHsb=dict(hueDegrees=0,saturationScale=1,brightnessScale=1))
    (out/'fit.json').write_text(json.dumps(report,indent=2)+'\n')
    torch.save(dict(filled_luminance=torch.from_numpy(filled) if filled is not None else None,global_rgb=global_rgb.detach(),luma=luma.detach(),chroma=chroma.detach()),out/'fields.pt')
    print(json.dumps(dict(phase='complete',material=root.name,rows=len(metrics))),flush=True)


if __name__=='__main__':
    parser=argparse.ArgumentParser(description=__doc__);parser.add_argument('root',type=Path);parser.add_argument('output',type=Path);parser.add_argument('--steps',type=int,default=160);parser.add_argument('--luminance-only',action='store_true');args=parser.parse_args()
    torch.set_num_threads(2);torch.manual_seed(1903);fit(args.root,args.output,args.steps,args.luminance_only)
