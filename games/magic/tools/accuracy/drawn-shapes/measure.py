"""Polarity-specific curve probes; report ambiguity instead of nearest-edge F1."""
import argparse,json
from pathlib import Path
import numpy as np
from PIL import Image
from scipy.ndimage import gaussian_filter,spline_filter,map_coordinates
from scipy.signal import find_peaks

def measure(image):
    a=np.asarray(Image.open(image).convert('RGB'),np.float64)/255
    sx=a.shape[1]/488;sy=a.shape[0]/680
    gray=spline_filter(gaussian_filter(a@np.array([.2126,.7152,.0722]),.7),order=3)
    result={}
    for side,along,normal,sign in [
        ('top',np.arange(35,459,1.),np.arange(378,399,.1),1),
        ('bottom',np.arange(35,455,1.),np.arange(412,425,.1),-1),
        ('left',np.arange(387,418,.5),np.arange(26,43,.1),1),
        ('right',np.arange(387,418,.5),np.arange(449,466,.1),-1)]:
        rows=[]
        for t in along:
            xs,ys=(np.full_like(normal,t),normal) if side in ['top','bottom'] else (normal,np.full_like(normal,t))
            v=map_coordinates(gray,[(ys+.5)*sy-.5,(xs+.5)*sx-.5],order=3,prefilter=False,mode='nearest')
            g=np.gradient(v,.1)*sign;peaks,_=find_peaks(g,height=.12,distance=8)
            row=dict(along=float(t),status='missing')
            if len(peaks):
                best=max(peaks,key=lambda i:g[i]);other=[i for i in peaks if abs(normal[i]-normal[best])>1 and g[i]>=.8*g[best]]
                x,y=float(xs[best]),float(ys[best]);row.update(x=x,y=y,strength=float(g[best]),status='ambiguous' if other else 'measured')
                if (side=='top' and x>407 and y>390) or (side=='bottom' and x>404 and y<417) or (41<x<408 and 390<y<415):row['status']='occluded'
                # A jump to the neighboring rules-paper edge is not a type edge.
                if side=='bottom' and y>421:row['status']='neighboring-boundary'
            rows.append(row)
        result[side]=rows
    return result

def compare(ref,render):
    result={}
    for side in ref:
        matched=[]
        for a,b in zip(ref[side],render[side]):
            if a['status']!='measured' or b['status']!='measured':continue
            axis='y' if side in ['top','bottom'] else 'x'
            matched.append(dict(along=a['along'],delta=a[axis]-b[axis]))
        center=[p['delta'] for p in matched if (80<p['along']<400 if side in ['top','bottom'] else 397<p['along']<408)]
        expected=sum(80<p['along']<400 if side in ['top','bottom'] else 397<p['along']<408 for p in ref[side])
        enough=len(center)>=max(8,int(np.ceil(expected*.5)))
        entry=dict(pairedProbes=len(matched),totalProbes=len(ref[side]),straightProbes=len(center),expectedStraightProbes=expected,status='measured' if enough else 'uncertain')
        if enough:
            offset=float(np.median(center));entry['straightOffset']=offset
            for end,lo,hi in [('leftCorner',35,60),('rightCorner',430,459)] if side in ['top','bottom'] else []:
                values=np.array([p['delta']-offset for p in matched if lo<=p['along']<=hi])
                expected=sum(lo<=p['along']<=hi for p in ref[side]);enoughCorner=len(values)>=max(8,int(np.ceil(expected*.5)))
                entry[end]=dict(probes=len(values),expectedProbes=expected,status='measured' if enoughCorner else 'uncertain')
                if enoughCorner:entry[end].update(medianResidual=float(np.median(values)),p95AbsoluteResidual=float(np.quantile(abs(values),.95)))
        result[side]=entry
    return result

def main():
    parser=argparse.ArgumentParser();parser.add_argument('records');parser.add_argument('images');parser.add_argument('output');args=parser.parse_args()
    root=Path(args.images);records=json.loads(Path(args.records).read_text())['records'];rows=[]
    for r in records:
        row={k:r[k] for k in ['id','name','set'] if k in r};pose=r.get('normalization',r.get('pose',{}))
        if not pose.get('accepted',False):row.update(status='registration-rejected');rows.append(row);continue
        ref=measure(root/(r['id']+'-scan.png'));render=measure(root/(r['id']+'-released.png'))
        row.update(status='diagnostic',differences=compare(ref,render),reference=ref,render=render);rows.append(row)
    report=dict(schema=1,units='488x680 canonical pixels; signed reference minus render',scope='Type light-face transitions only. Exterior pose frozen. Curved-end residuals remove straight-edge translation for diagnosis, not renderer fitting. Positive/negative transition polarity is fixed; competing peaks, occluded text/symbols and neighboring boundaries are excluded and counted. No bevel/outer contour/shadow or whole-card certification.',records=rows)
    Path(args.output).write_text(json.dumps(report,indent=2)+'\n')
    for row in rows:print(json.dumps({k:v for k,v in row.items() if k not in ['reference','render']}),flush=True)
if __name__=='__main__':main()
