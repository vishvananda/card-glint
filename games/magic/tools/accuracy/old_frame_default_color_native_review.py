"""Check adopted default pigments on native faces with frozen scan geometry."""
import argparse,json,hashlib
from pathlib import Path
import numpy as np
from PIL import Image,ImageDraw
from old_frame_color_distribution import normalize,lab
from old_frame_material_validation import fields,color_error
def digest(p):return hashlib.sha256(Path(p).read_bytes()).hexdigest()
def main(study,output):
    d,o=map(Path,[study,output]);assert not o.exists()
    fit=json.loads((d/'default-7ed-pigment-refit-v1.json').read_bytes())
    old=json.loads((d/'default-installed-v1/7ed.json').read_bytes())
    new=json.loads((d/'default-installed-v4/7ed.json').read_bytes())
    references=json.loads((d/'default-color-review-v1.json').read_bytes())
    profile=json.loads((d/'mir-selected-components-v13.json').read_bytes())
    rows=[];pictures=[]
    for r in new['rows']:
        key=r['material']
        if key not in ['W','B']:continue
        reviewed=next(a for a in references['rows']if a['id']==r['id'])
        scan=d/'default-7ed-three-donor-v5'/(r['id']+'-scan.png');assert digest(scan)==reviewed['reference']
        prev=next(a for a in old['rows']if a['id']==r['id'])
        paths={'reference':scan,'previous':d/'default-installed-v1'/prev['file'],'adopted':d/'default-installed-v4'/r['file']}
        assert digest(paths['previous'])==prev['sha256'];assert digest(paths['adopted'])==r['sha256']
        images={k:normalize(Image.open(p))for k,p in paths.items()}
        x,y,w,h=profile['frames'][key]['art'];x0=int(np.ceil(x*488))+3;x1=int(np.floor((x+w)*488))-3;y0=int(np.ceil(y*680))+3;y1=int(np.floor((y+h)*680))-3
        assert np.array_equal(images['previous'][y0:y1,x0:x1],images['adopted'][y0:y1,x0:x1]),'Art changed'
        metrics={}
        for part in ['frame','paperClear']:
            target=fields(images['reference'],part)
            metrics[part]={mode:color_error(fields(images[mode],part),target) for mode in ['previous','adopted']}
        cohort=next(c for rr in fit['results']if rr['key']==key for c,v in rr['parts']['frame']['cohorts'].items() if r['name'] in v['names'])
        rows.append(dict(id=r['id'],name=r['name'],material=key,cohort=cohort,reference=reviewed['reference'],before=prev['sha256'],after=r['sha256'],metrics=metrics,artChanged=0))
        pictures.append((r['name'],paths))
    o.write_text(json.dumps(dict(schema=1,status='native-pigment-supplement-review-not-independent-set-calibration',tool=digest(__file__),
        sources={f:digest(d/f)for f in ['default-7ed-pigment-refit-v1.json','default-installed-v1/7ed.json','default-installed-v4/7ed.json','default-color-review-v1.json']},rows=rows),indent=2)+'\n')
    for row in rows:
        print(row['name'],row['cohort'],{p:{m:round(v['pairedDeltaE'],3)for m,v in values.items()}for p,values in row['metrics'].items()},flush=True)
    contact=Image.new('RGB',(3*244,len(pictures)*360),'#eee')
    draw=ImageDraw.Draw(contact)
    for y,(name,paths) in enumerate(pictures):
        for x,(mode,p) in enumerate(paths.items()):
            contact.paste(Image.open(p).convert('RGB').resize((244,340)),(x*244,y*360+20));draw.text((x*244+4,y*360+4),name+' '+mode,fill='black')
    contact.save(o.with_suffix('.png'))
if __name__=='__main__':
    p=argparse.ArgumentParser();p.add_argument('study');p.add_argument('out');a=p.parse_args();main(a.study,a.out)
