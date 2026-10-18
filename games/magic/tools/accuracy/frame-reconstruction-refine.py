"""Shared multi-scan texture, local geometry and blur ablations; no runtime changes."""
import argparse
import json
import warnings
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter, map_coordinates, binary_erosion
import torch
import torch.nn.functional as F
from frame_reconstruction.geometry import read_image, sample, WINDOWS
from frame_reconstruction.model import gaussian

W, H = 732, 1020


def save_json(path, value):
    path.write_text(json.dumps(value, indent=2) + '\n')


def save_png(path, value):
    Image.fromarray(np.round(np.clip(value, 0, 1) * 255).astype(np.uint8)).save(path)


def tensor(a):
    return torch.from_numpy(np.asarray(a, dtype=np.float32)).permute(2, 0, 1)[None]


def array(a):
    return a.detach()[0].permute(1, 2, 0).numpy()


def scan_coordinates(shape, matrix, width=W, height=H):
    yy, xx = np.mgrid[:height, :width]
    x = (xx + .5) * 488 / width - .5
    y = (yy + .5) * 680 / height - .5
    a, b, c, d, tx, ty = matrix
    inverse = np.linalg.inv([[a, c], [b, d]])
    dx, dy = x - 244 - tx, y - 340 - ty
    px, py = inverse[0, 0] * dx + inverse[0, 1] * dy, inverse[1, 0] * dx + inverse[1, 1] * dy
    h, w = shape[:2]
    f = min(488 / w, 680 / h)
    return ((px + 244 - (488-w*f)/2 + .5)/f-.5,
            (py + 340 - (680-h*f)/2 + .5)/f-.5)


def resize(a, width, height):
    yy, xx = np.mgrid[:height, :width]
    return sample(a, (xx+.5)*a.shape[1]/width-.5, (yy+.5)*a.shape[0]/height-.5)


def weighted_smooth(a, weight, sigma):
    if a.ndim == 3:
        return gaussian_filter(a*weight[..., None], (sigma, sigma, 0))/gaussian_filter(weight, sigma)[..., None].clip(1e-6)
    return gaussian_filter(a*weight, sigma)/gaussian_filter(weight, sigma).clip(1e-6)


def prepare(root):
    out = root/'refine'; out.mkdir(exist_ok=True)
    obs = json.loads((root/'observations.json').read_text())
    train = [r for r in obs['records'] if r['cohort']=='calibration']
    base_full = read_image(root/'train-native/render-plate-1.png')
    base = resize(base_full, W, H)
    scans, masks = [], []
    for n, row in enumerate(train):
        with np.load(root/'prepared'/f"{row['id']}.npz") as data:
            x, y = scan_coordinates(data['raw'].shape, row['normalization']['transform']['matrix'])
            scans.append(sample(data['raw'], x, y).astype(np.float16))
            masks.append(map_coordinates(data['mask'].astype(np.uint8), [y, x], order=0, mode='constant')>0)
        print(f'Consensus input {n+1}/{len(train)}', flush=True)
    scans, masks = np.stack(scans), np.stack(masks)
    count = masks.sum(0)
    target = np.zeros((H,W,3), np.float32)
    geometry_target = np.zeros_like(target)
    disagreement = np.zeros((H,W), np.float32)
    with warnings.catch_warnings():
        warnings.simplefilter('ignore', RuntimeWarning)
        for y in range(0,H,80):
            values = scans[:,y:y+80].astype(np.float32)
            valid = masks[:,y:y+80]
            geometry_target[y:y+80] = np.median(values, axis=0)
            values[~valid] = np.nan
            median = np.nanmedian(values, axis=0)
            target[y:y+80] = np.nan_to_num(median)
            mad = np.nanmedian(np.abs(values-median[None]), axis=0).mean(-1)
            disagreement[y:y+80] = np.nan_to_num(mad, nan=1)
    coverage = np.clip((count-4)/8,0,1).astype(np.float32)
    agreement = np.clip((.10-disagreement)/.08,0,1)
    support = coverage*agreement*(base[...,3]>.99)*(base[...,:3].max(-1)>.18)
    np.savez_compressed(out/'consensus.npz', target=target, geometry=geometry_target,
                        support=support, count=count, disagreement=disagreement, base=base)
    save_png(out/'coverage.png', coverage)
    save_png(out/'agreement.png', agreement)
    save_json(out/'inputs.json', dict(cards=len(train), ids=[r['id'] for r in train],
              resolution=[W,H], policy='Training names only; frozen affine scan poses; robust per-pixel median and MAD; five-card minimum'))


def geometry_support(base):
    yy,xx = np.mgrid[:H,:W]
    x,y=(xx+.5)*488/W-.5,(yy+.5)*680/H-.5
    valid=np.zeros((H,W),bool)
    for _,(axis,lo,hi,a,b) in WINDOWS.items():
        q,t=(x,y) if axis=='x' else (y,x)
        valid |= (q>=lo)&(q<=hi)&(t>=a)&(t<=b)
    return valid & binary_erosion(base[...,3]>.99,iterations=4)


def grid(width, height):
    y,x=torch.meshgrid(torch.arange(height),torch.arange(width),indexing='ij')
    return torch.stack([2*(x+.5)/width-1,2*(y+.5)/height-1],-1).float()[None]


def fit_warp(base, target, steps):
    # Coarse control grid; smooth local motion only, bounded to 1.5 canonical px.
    src=tensor(base[...,:3]); ref=tensor(target)
    src_gray=(src*torch.tensor([.2126,.7152,.0722])[None,:,None,None]).sum(1,keepdim=True)
    ref_gray=(ref*torch.tensor([.2126,.7152,.0722])[None,:,None,None]).sum(1,keepdim=True)
    def features(v):
        v=gaussian(v,1.2)
        return torch.cat([v[:,:,:,2:]-v[:,:,:,:-2], torch.zeros_like(v[:,:,:,:2])],3), torch.cat([v[:,:,2:,:]-v[:,:,:-2,:],torch.zeros_like(v[:,:,:2,:])],2)
    target_features=features(ref_gray)
    valid=tensor(geometry_support(base)[...,None])
    delta=torch.nn.Parameter(torch.zeros(1,2,17,13))
    opt=torch.optim.Adam([delta],lr=.05)
    identity=grid(W,H); history=[]
    for step in range(steps):
        opt.zero_grad()
        motion=F.interpolate(delta,(H,W),mode='bicubic',align_corners=False)
        uv=identity+motion.permute(0,2,3,1)*torch.tensor([2/488,2/680])
        prediction=F.grid_sample(src_gray,uv,align_corners=False,padding_mode='border')
        pred_features=features(prediction)
        data=sum((F.smooth_l1_loss(a,b,reduction='none',beta=.025)*valid).sum()/valid.sum() for a,b in zip(pred_features,target_features))
        smooth=((delta[:,:,1:]-delta[:,:,:-1]).square().mean()+(delta[:,:,:,1:]-delta[:,:,:,:-1]).square().mean())
        loss=data+.004*smooth+.0002*delta.square().mean()
        loss.backward(); opt.step()
        with torch.no_grad(): delta.clamp_(-1.5,1.5)
        if step%20==0 or step==steps-1:
            history.append(dict(step=step,data=float(data),smooth=float(smooth))); print('Warp',history[-1],flush=True)
    motion=array(F.interpolate(delta,(H,W),mode='bicubic',align_corners=False))
    dxdy,dxdx=np.gradient(motion[...,0]); dydy,dydx=np.gradient(motion[...,1])
    determinant=(1+dxdx*W/488)*(1+dydy*H/680)-(dxdy*H/680)*(dydx*W/488)
    if determinant.min()<.8: raise ValueError('Shared warp approaches folding')
    return motion,dict(history=history,maximumCanonicalDisplacement=float(np.max(np.abs(motion))),minimumJacobian=float(determinant.min()),grid=[13,17])


def warp_full(base, motion):
    m=resize(motion,base.shape[1],base.shape[0]); y,x=np.mgrid[:base.shape[0],:base.shape[1]]
    xx=x+m[...,0]*base.shape[1]/488; yy=y+m[...,1]*base.shape[0]/680
    alpha=sample(base[...,3:],xx,yy)
    rgb=sample(base[...,:3]*base[...,3:],xx,yy)/alpha.clip(1e-6)
    return np.concatenate([rgb,alpha],-1)


def fit_blur(base, target, support, steps):
    # One shared forward PSF, estimated on calibration-only trusted texture.
    filled=np.where((support>0)[...,None],target,base[...,:3])
    coefficients=np.array([.2126,.7152,.0722],np.float32)
    src=tensor((base[...,:3]@coefficients)[...,None])
    ref=tensor((filled@coefficients)[...,None]); valid=tensor(support[...,None])
    trials=[]
    for sigma in [0,.3,.6,.9,1.2,1.5,1.8,2.4,3.2]:
        p=gaussian(src,sigma) if sigma else src
        error=(torch.abs(gaussian(p,1.4)-gaussian(ref,1.4))*valid).sum()/valid.sum()
        trials.append(dict(sigma=sigma,mae=float(error)))
    sigma=min(trials,key=lambda r:r['mae'])['sigma']
    delta=torch.nn.Parameter(torch.zeros(1,1,340,244));opt=torch.optim.Adam([delta],lr=.006)
    effective_sigma=float(np.hypot(sigma,1.4))
    source_filtered=gaussian(src,effective_sigma).detach()
    target_filtered=gaussian(ref,1.4); history=[]
    for step in range(steps):
        opt.zero_grad()
        residual=F.interpolate(delta,(H,W),mode='bicubic',align_corners=False)*valid
        # Gaussian convolution is linear. Cache the fixed base and filter only
        # the scalar residual; Gaussian variances add under composition.
        predicted=source_filtered+gaussian(residual,effective_sigma)
        data=(F.huber_loss(predicted,target_filtered,reduction='none',delta=.035)*valid).sum()/valid.sum()
        smooth=(delta[:,:,1:]-delta[:,:,:-1]).square().mean()+(delta[:,:,:,1:]-delta[:,:,:,:-1]).square().mean()
        loss=data+.005*delta.square().mean()+.008*smooth
        loss.backward();opt.step()
        with torch.no_grad():delta.clamp_(-.05,.05)
        if step%20==0 or step==steps-1:
            history.append(dict(step=step,data=float(data)));print('Blur',history[-1],flush=True)
    residual=array(F.interpolate(delta,(H,W),mode='bicubic',align_corners=False))*support[...,None]
    return residual,dict(sigmaNativePixels=sigma,trials=trials,history=history,policy='PSF used in fitting only; fixed native scoring remains unblurred')


def refine(root,steps,resume_warp=False):
    out=root/'refine'; data=np.load(out/'consensus.npz')
    base,target,support=data['base'],data['target'],data['support']
    full=read_image(root/'train-native/render-plate-1.png')
    # Shared luminance at modest spatial frequencies; much smoother chroma.
    residual=weighted_smooth(target,support,1.4)-weighted_smooth(base[...,:3],support,1.4)
    luma=residual@np.array([.2126,.7152,.0722],dtype=np.float32)
    luminance=weighted_smooth(luma,support,1).clip(-.075,.075)
    chroma=weighted_smooth(residual-luma[...,None],support,12).clip(-.025,.025)
    correction=(luminance[...,None]+chroma)*support[...,None]
    consensus=full.copy();consensus[...,:3]=np.clip(full[...,:3]+resize(correction,full.shape[1],full.shape[0]),0,1)
    save_png(out/'consensus-plate.png',consensus)
    if resume_warp:
        motion=np.load(out/'motion.npy');warp_receipt=json.loads((out/'warp.json').read_text())
    else:
        motion,warp_receipt=fit_warp(base,data['geometry'],steps)
    np.save(out/'motion.npy',motion);save_json(out/'warp.json',warp_receipt)
    warp=warp_full(full,motion);save_png(out/'warp-plate.png',warp)
    blur,blur_receipt=fit_blur(base,target,support,steps)
    blurred=full.copy();blurred[...,:3]=np.clip(full[...,:3]+resize(blur,full.shape[1],full.shape[0]),0,1)
    save_png(out/'blur-aware-plate.png',blurred);save_json(out/'blur.json',blur_receipt)
    # Separate combination: source consensus followed by the same shared warp.
    combined=warp_full(consensus,motion);save_png(out/'combined-plate.png',combined)
    candidates=[dict(key='baseline',title='First reconstruction',file='train-native/render-plate-1.png')]
    for key,title in [('consensus','Robust shared texture'),('warp','Shared 2D warp'),('blur-aware','Blur-aware reconstruction'),('combined','Shared texture + 2D warp')]:
        candidates.append(dict(key=key,title=title,file=f'refine/{key}-plate.png'))
    save_json(out/'candidates.json',dict(candidates=candidates,cohort='34 calibration names; validation excluded',runtimeChanges=False))
    save_json(out/'fit.json',dict(steps=steps,consensus=dict(luminanceCap=.075,chromaCap=.025,luminanceSmoothing=1,chromaSmoothing=12,minimumCards=5),warp=warp_receipt,blur=blur_receipt))


if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('phase',choices=['prepare','fit']);p.add_argument('directory',type=Path);p.add_argument('--steps',type=int,default=80);p.add_argument('--resume-warp',action='store_true');a=p.parse_args()
    torch.set_num_threads(2);torch.manual_seed(321)
    prepare(a.directory) if a.phase=='prepare' else refine(a.directory,a.steps,a.resume_warp)
