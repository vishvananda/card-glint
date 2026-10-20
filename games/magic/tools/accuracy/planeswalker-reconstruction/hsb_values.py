import numpy as np

def to_hsv(rgb):
    rgb=rgb.astype(np.float64)
    mx=rgb.max(-1);mn=rgb.min(-1);d=mx-mn
    s=np.divide(d,mx,out=np.zeros_like(d),where=mx>1e-8);h=np.zeros_like(d)
    for k in range(3):
        mask=(rgb[...,k]==mx)&(d>1e-8)
        h[mask]=((rgb[...,(k+1)%3]-rgb[...,(k+2)%3])[mask]/d[mask]+2*k)%6
    return np.stack([h/6,s,mx],-1)

def adjust(hsv,parameters):
    h=hsv[...,0]+parameters[0]/360;s=np.clip(hsv[...,1]*parameters[1],0,1);v=np.clip(hsv[...,2]*parameters[2],0,1)
    h=(h%1)*6;i=np.floor(h).astype(int);f=h-i
    p=v*(1-s);q=v*(1-s*f);t=v*(1-s*(1-f))
    out=np.empty(hsv.shape,np.float64)
    for k,channels in enumerate([(v,t,p),(q,v,p),(p,v,t),(p,q,v),(t,p,v),(v,p,q)]):
        mask=(i%6)==k
        for c in range(3):out[...,c][mask]=channels[c][mask]
    return out
