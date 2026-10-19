"""Encoded-sRGB HSB/contrast fit shared by the entire material, never a box."""
import numpy as np


def rgb_to_hsv(rgb):
    r,g,b=np.moveaxis(rgb,-1,0);v=rgb.max(-1);d=v-rgb.min(-1);idx=rgb.argmax(-1);safe=np.maximum(d,1e-8)
    h=np.where(idx==0,(g-b)/safe,np.where(idx==1,(b-r)/safe+2,(r-g)/safe+4));h=np.where(d==0,0,(h/6)%1)
    return np.stack([h,np.where(v>0,d/np.maximum(v,1e-8),0),v],-1)


def hsv_to_rgb(hsv):
    h,s,v=np.moveaxis(hsv,-1,0);h=h*6;c=v*s;x=c*(1-np.abs(h%2-1));z=np.zeros_like(v);i=np.floor(h).astype(int)%6
    return np.stack([np.where((i==0)|(i==5),c,np.where((i==1)|(i==4),x,z)),np.where((i==1)|(i==2),c,np.where((i==0)|(i==3),x,z)),np.where((i==3)|(i==4),c,np.where((i==2)|(i==5),x,z))],-1)+(v-c)[...,None]


def adjust(rgb, parameters):
    rgb=np.asarray(rgb,dtype=np.float64)
    hsv=rgb_to_hsv(np.clip(rgb,0,1));hsv[...,0]=(hsv[...,0]+parameters[0]/360)%1
    hsv[...,1]=np.clip(hsv[...,1]*np.exp(parameters[1]),0,1)
    hsv[...,2]=np.clip(hsv[...,2]**np.exp(parameters[3])*np.exp(parameters[2]),0,1)
    corrected=hsv_to_rgb(hsv)
    return np.where((rgb.max(-1)<.075)[...,None],rgb,corrected)
