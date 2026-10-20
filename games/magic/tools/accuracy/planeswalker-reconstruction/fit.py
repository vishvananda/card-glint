"""Experimental shared asset fitting; keep generated rasters outside Git."""
import sys,json
from pathlib import Path
import numpy as np
import torch
import torch.nn.functional as F
from scipy.ndimage import distance_transform_edt, gaussian_filter
from model import prepare, tensor, raster, grid, lookup, read, png, save, CX, CY, CW, CH
ROOT=Path(sys.argv[1]);OUT=ROOT/(sys.argv[2] if len(sys.argv)>2 else 'fit')
data=prepare(ROOT,OUT);inputs=data['inputs'];records=data['records'];old_type=data['old_type'];ch,cw=old_type.shape[:2]
train=[r for r in records if r['row']['cohort']=='calibration'];validation=[r for r in records if r['row']['cohort']=='validation']
assert len(train)>=4 and len(validation)>=1,'Insufficient independent accepted scans'

# Background: one shared channel gain/offset plus a very smooth residual field.
gain=torch.nn.Parameter(torch.ones(1,3));bias=torch.nn.Parameter(torch.zeros(1,3));field=torch.nn.Parameter(torch.zeros(1,3,256,160))
bgopt=torch.optim.Adam([gain,bias,field],lr=.008)
bgdata=[]
for r in train:
  iy,ix=r['bgIndex'];bgdata.append((tensor(r['bgSource'][iy,ix]),tensor(r['bgWeight'][iy,ix,None]),tensor(r['bgUV'][iy,ix]*2-1)[None,None],tensor(r['baseline'][iy,ix]),tensor(r['target'][iy,ix])))
def smooth(p):return (p[:,:,1:]-p[:,:,:-1]).square().mean()+(p[:,:,:,1:]-p[:,:,:,:-1]).square().mean()
for step in range(380):
  bgopt.zero_grad();losses=[]
  for source,w,g,base,target in bgdata:
    delta=source*(gain-1)+bias+F.grid_sample(field,g,align_corners=False,padding_mode='border')[0,:,0].T
    predicted=(base+w*delta).clamp(0,1)
    losses.append(F.huber_loss(predicted,target,delta=.045))
  loss=torch.stack(losses).mean()+.015*smooth(field)+.003*field.square().mean()+.003*(gain-1).square().mean()+.00003*bias.square().mean();loss.backward();bgopt.step()
  with torch.no_grad():gain.clamp_(.4,1.6);bias.clamp_(-.30,.30);field.clamp_(-.18,.18)
  if step%50==0:print(json.dumps(dict(phase='background',step=step,loss=float(loss.detach()))),flush=True)
source=read(ROOT/'source/planeswalker_bg.webp');h,w=source.shape[:2];yy,xx=np.mgrid[:h,:w];g=tensor(grid(xx,yy,w,h))
with torch.no_grad():
  correction=lookup(field,g).numpy();source[...,:3]=np.clip(source[...,:3]*gain.detach().numpy()[0]+bias.detach().numpy()[0]+correction,0,1)
png(OUT/'planeswalker-bg-U.png',source)
bgparams=dict(gain=gain.detach().tolist()[0],bias=bias.detach().tolist()[0],field=field.detach().numpy()[0].tolist())

# Carry the fitted background through the same local linear compositing model
# before fitting the type asset. Its source controls omit the type box, retaining
# each card's own badge/letter occlusion. No first-card masks are reused.
for r in records:
  with torch.no_grad():
    delta=r['bgSource']*(gain.detach().numpy()[0]-1)+bias.detach().numpy()[0]+lookup(field,tensor(r['bgUV']*2-1)).numpy()
    r['under']=(r['under']+r['bgWeight'][...,None]*delta).clip(0,1)
# Type box: shared differentiable displacement of the complete RGBA asset, with
# a low-frequency RGB correction. Alpha is only warped, never invented per scan.
old=raster(old_type)
shape=torch.nn.Parameter(torch.zeros(8))
gain_type=torch.nn.Parameter(torch.ones(1,3,1,1))
bias_type=torch.nn.Parameter(torch.zeros(1,3,1,1))
color=torch.nn.Parameter(torch.zeros(1,3,3,1))
bevel=torch.nn.Parameter(torch.zeros(1,12,1,16))
inside=old_type[...,3]>.95
distance=gaussian_filter(distance_transform_edt(inside)-distance_transform_edt(~inside),.8)
ny,nx=np.gradient(gaussian_filter(distance,1.1));length=np.abs(nx)+np.abs(ny)+1e-5
normals=np.stack([np.maximum(ny,0),np.maximum(-ny,0),np.maximum(nx,0),np.maximum(-nx,0)],-1)/length[...,None]
normal_texture=raster(normals)
distance_texture=raster((distance/1.5)[...,None])

# Eight smooth geometric degrees of freedom keep straight rails straight.
# Four affine changes and four localized radius changes, without per-letter flow.
yy,xx=np.mgrid[:ch,:cw];xx=(xx+.5)/1.5+CX-.5;yy=(yy+.5)/1.5+CY-.5
left,right,top,bottom=27.165,461.833,384.3924,421.404
bases=[]
bases.append(np.stack([np.ones_like(xx),np.zeros_like(xx)],0))
bases.append(np.stack([np.zeros_like(xx),np.ones_like(xx)],0))
bases.append(np.stack([(xx-(left+right)/2)/((right-left)/2),np.zeros_like(xx)],0))
bases.append(np.stack([np.zeros_like(xx),(yy-(top+bottom)/2)/((bottom-top)/2)],0))
for edge_x,edge_y,sign_x,sign_y in [(left,top,-1,-1),(right,top,1,-1),(left,bottom,-1,1),(right,bottom,1,1)]:
  u=(edge_x-xx)*sign_x;v=(edge_y-yy)*sign_y
  near=np.exp(-((u-8)/22)**2-((v-6)/18)**2)
  bases.append(np.stack([sign_x*near*np.clip(u/15,0,1),sign_y*near*np.clip(v/15,0,1)],0))
basis=tensor(np.stack(bases))
typeopt=torch.optim.Adam([{'params':[shape],'lr':.065},{'params':[gain_type,bias_type,color],'lr':.006},{'params':[bevel],'lr':.014}])
typedata=[]
for r in train:
  iy,ix=r['typeIndex'];typedata.append((tensor(r['typeGrid'][iy,ix])[None,None],tensor(r['under'][iy,ix]),tensor(r['target'][iy,ix])))
def flow_value():return torch.einsum('n,nchw->chw',shape,basis)[None].clamp(-5,5)
def type_prediction(g):
  displacement=F.grid_sample(flow_value(),g,align_corners=False,padding_mode='border')
  delta=displacement.permute(0,2,3,1)*shape.new_tensor([2/CW,2/CH]);warped=F.grid_sample(old,g+delta,align_corners=False,padding_mode='zeros')
  gate=((warped[:,:3].mean(1,keepdim=True)-.1)/.4).clamp(0,1)
  change=warped[:,:3]*(gain_type-1)+bias_type+F.grid_sample(color,g,align_corners=False,padding_mode='border')
  dist=F.grid_sample(distance_texture,g+delta,align_corners=False,padding_mode='border')
  normal=F.grid_sample(normal_texture,g+delta,align_corners=False,padding_mode='border')
  band_grid=torch.stack([2*(dist[:,0].clamp(0,5)/5)-1,torch.zeros_like(dist[:,0])],-1)
  bands=F.grid_sample(bevel,band_grid,align_corners=True,padding_mode='border').reshape(1,4,3,*dist.shape[-2:])
  bevel_change=(bands*normal[:,:,None]).sum(1)
  edge_gate=torch.sigmoid(dist*4)*torch.sigmoid((5-dist)*4)*warped[:,3:4]
  rgb=(warped[:,:3]+gate*change+edge_gate*bevel_change).clamp(0,1)
  return torch.cat([rgb,warped[:,3:4]],1)
for step in range(340):
  typeopt.zero_grad();losses=[]
  for g,back,target in typedata:
    p=type_prediction(g)[0,:,0].T;pred=back*(1-p[:,3:])+p[:,:3]*p[:,3:]
    losses.append(F.huber_loss(pred,target,delta=.045))
  loss=torch.stack(losses).mean()+.00004*shape.square().mean()+.003*(color[:,:,1:]-color[:,:,:-1]).square().mean()+.002*color.square().mean()+.00003*((gain_type-1).square().mean()+bias_type.square().mean())+.0005*bevel.square().mean()+.001*(bevel[:,:,:,1:]-bevel[:,:,:,:-1]).square().mean()
  loss.backward();typeopt.step()
  with torch.no_grad():shape[0].clamp_(-1.5,1.5);shape[1].clamp_(-4,4);shape[2:4].clamp_(-2,2);shape[4:].clamp_(-3,3);bevel.clamp_(-.4,.85);color.clamp_(-.06,.06);gain_type.clamp_(.6,1.4);bias_type.clamp_(-.15,.15)
  if step%50==0:print(json.dumps(dict(phase='type',step=step,loss=float(loss.detach()))),flush=True)
yy,xx=np.mgrid[:ch,:cw];g=tensor(grid(xx,yy,cw,ch))[None]
with torch.no_grad():new_type=type_prediction(g)[0].permute(1,2,0).numpy()
png(OUT/'planeswalker-type-U.png',new_type)
save(OUT/'parameters.json',dict(schema=1,background=bgparams,type=dict(rect=[CX,CY,CW,CH],shape=shape.detach().tolist(),gain=gain_type.detach().tolist(),bias=bias_type.detach().tolist(),color=color.detach().numpy()[0].tolist(),bevel=bevel.detach().numpy()[0].tolist(),maximumDisplacementCanonicalPx=float(flow_value().detach().abs().max())),policy='Shared asset parameters; fixed affine scans; RGB Huber loss; no art/text training; scan dots not reconstructed'))

def measure(pred,target,mask):
  difference=abs(pred-target)[mask]
  return dict(rgbMAE255=float(difference.mean()*255),rgbRMSE255=float(np.sqrt((difference**2).mean())*255))
results=[]
for r in records:
  with torch.no_grad():
    guv=tensor(r['bgUV']*2-1);delta=r['bgSource']*(gain.detach().numpy()[0]-1)+bias.detach().numpy()[0]+lookup(field,guv).numpy()
    bg=(r['baseline']+r['bgWeight'][...,None]*delta).clip(0,1)
    plate=type_prediction(tensor(r['typeGrid'])[None])[0].permute(1,2,0).numpy()
  candidate=r['under']*(1-plate[...,3:])+plate[...,:3]*plate[...,3:]
  output=dict(id=r['row']['id'],name=r['row']['name'],set=r['row']['set'],cohort=r['row']['cohort'],background=dict(before=measure(r['baseline'],r['target'],r['bgMask']),after=measure(bg,r['target'],r['bgMask'])),type=dict(before=measure(r['baseline'],r['target'],r['typeMask']),after=measure(candidate,r['target'],r['typeMask'])))
  results.append(output);print(json.dumps(dict(phase='score',**output)),flush=True)
save(OUT/'scores.json',dict(schema=1,scope='Native lowpass RGB error on fixed unprinted asset masks; lower is better; these are not Lab whole-card structural scores',records=results))
