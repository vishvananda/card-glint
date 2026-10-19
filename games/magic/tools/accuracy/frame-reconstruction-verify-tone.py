"""Verify exported tone PNGs against frozen raw scans, including frame and paper.

This re-evaluates actual quantized exports, not the optimizer's approximate
blurred-color model. Regional results are diagnostics; there is still only one
shared correction for the whole material.
"""
import argparse,importlib.util,json,hashlib
from pathlib import Path
import numpy as np
from scipy.ndimage import gaussian_filter
from frame_reconstruction.geometry import read_image,sample,scan_card_coordinates


def run(root,texture,final):
    spec=importlib.util.spec_from_file_location('whole',Path(__file__).with_name('frame-reconstruction-whole-material.py'));whole=importlib.util.module_from_spec(spec);spec.loader.exec_module(whole)
    fit=json.loads((final/'fit.json').read_text());by_source={v['source']:v['file'] for v in fit['assets']};candidate=json.loads((root/'candidates.json').read_text())['candidates'][0]
    rows=[]
    for r in json.loads((root/'observations.json').read_text())['records']:
        if not r['normalization'].get('accepted',False):continue
        file=candidate.get('perCardFile',candidate['file']).replace('{id}',r['id']);name=by_source[file]
        before=read_image(texture/name);after=read_image(final/name)
        assert np.array_equal(before[...,3],after[...,3]),'Tone changed alpha'
        _,raw,_,valid,counts=whole.prepare(root,root/file,r)
        x,y=scan_card_coordinates(raw.shape,r['normalization']['transform']['matrix']);paper=(x>65)&(x<425)&(y>410)&(y<602)
        values=[]
        for im in [before,after]:
            projected=sample(im,(x+.5)*im.shape[1]/488-.5,(y+.5)*im.shape[0]/680-.5)[...,:3]
            values.append(gaussian_filter(projected,(1.4,1.4,0)))
        target=gaussian_filter(raw,(1.4,1.4,0));zones={}
        for zone,mask in [('whole',valid),('paper',valid&paper),('frame',valid&~paper)]:
            if not mask.any():zones[zone]=None;continue
            zones[zone]=dict(pixels=int(mask.sum()),before=float(abs(values[0][mask]-target[mask]).mean()),after=float(abs(values[1][mask]-target[mask]).mean()))
        rows.append(dict(id=r['id'],name=r['name'],cohort=r['cohort'],zones=zones))
    summary={}
    for cohort in ['calibration','validation','all']:
        summary[cohort]={}
        for zone in ['whole','paper','frame']:
            selected=[r['zones'][zone] for r in rows if (cohort=='all' or r['cohort']==cohort) and r['zones'][zone]]
            summary[cohort][zone]=dict(cards=len(selected),before=float(np.mean([v['before'] for v in selected])),after=float(np.mean([v['after'] for v in selected])),regressions=sum(v['after']>v['before'] for v in selected))
    proof=dict(schema=1,material=root.name,scope='Exact exported PNGs; native scan pixels; frozen accepted affine poses and fixed masks; shared HSB across frame and paper. Reused development validation. These are RGB component errors, not full-card accuracy.',toneProofSha256=hashlib.sha256((final/'fit.json').read_bytes()).hexdigest(),summary=summary,rows=rows)
    (final/'verification.json').write_text(json.dumps(proof,indent=2)+'\n');print(json.dumps(dict(material=root.name,summary=summary)),flush=True)


if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('study',type=Path);p.add_argument('texture',type=Path);p.add_argument('final',type=Path);a=p.parse_args();run(a.study,a.texture,a.final)
