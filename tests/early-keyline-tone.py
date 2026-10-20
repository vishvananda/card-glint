#!/usr/bin/env python3
"""Synthetic ink location, monotonicity and cohort-isolation controls."""
import contextlib,copy,importlib.util,io,json,sys,tempfile,unittest
from pathlib import Path
import numpy as np
sys.dont_write_bytecode = True
ROOT=Path(__file__).resolve().parents[1]
def module(name):
 spec=importlib.util.spec_from_file_location(name,ROOT/'games/magic/tools/accuracy'/name);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
ink=module('early-frame-ink-audit.py');tone=module('early-keyline-tone-fit.py')
class Controls(unittest.TestCase):
 def test_known_ink_survives_bright_bevel_and_pose_translation(self):
  for shift in [0,2]:
   coords={'left':24+shift,'right':464+shift,'top':27+shift,'bottom':653+shift};edges={key:{'reference':value}for key,value in coords.items()};a=np.full((1020,732,4),255,dtype=np.uint8);l,r,t,b=[round(coords[k]*1.5)for k in ['left','right','top','bottom']];a[t:b+1,l:r+1,:3]=[180,165,145];a[t+2:b-1,l+2:l+4,:3]=[250,220,8]
   for x in [l,r]:a[t:b+1,x,:3]=[27,25,22]
   for y in [t,b]:a[y,l:r+1,:3]=[27,25,22]
   result=ink.keyline_samples(a,edges,'reference');np.testing.assert_allclose(result['rgb'],np.array([27,25,22])/255);self.assertEqual(result['sampleCount'],432)
 def test_no_keyline_does_not_invent_dark_ink(self):
  a=np.full((1020,732,4),220,dtype=np.uint8);s={k:{'rendered':v}for k,v in {'left':24,'right':464,'top':27,'bottom':653}.items()};result=ink.keyline_samples(a,s,'rendered');np.testing.assert_allclose(result['rgb'],np.full(3,220/255))
 def test_monotone_source_curve_preserves_highlights_and_input(self):
  source=np.repeat(np.linspace(0,1,1001)[:,None],3,axis=1);before=source.copy();offset=np.array([-.08,-.05,-.06]);after=tone.curve(source,.25,offset,.5);self.assertTrue(np.all(np.diff(after,axis=0)>=0));np.testing.assert_array_equal(source,before);np.testing.assert_array_equal(after[500:],source[500:]);np.testing.assert_allclose(tone.lab([1,1,1]),[1,0,0],atol=1e-7)
 def test_validation_pixels_cannot_change_selected_curve(self):
  with tempfile.TemporaryDirectory()as folder:
   p=Path(folder);key={'groups':{'W':{}},'rows':[]};colors={'rows':[]}
   for i in range(6):
    key['rows'].append({'id':str(i),'name':str(i),'material':'W','cohort':'calibration'if i<3 else'validation','rendered':{'rgb':[.2,.18,.16]},'reference':{'rgb':[.14,.13,.12]}})
    component={'renderTiles':[[.8,.8,.8]]*12,'referenceRgb':[.8,.8,.8]};colors['rows'].append({'id':str(i),'components':{'frame':component,'paper':component}})
   chosen=[]
   for version in range(2):
    if version:
     for row in key['rows'][3:]:row['reference']['rgb']=[.7,.5,.6]
     for row in colors['rows'][3:]:row['components']={'frame':{'renderTiles':[[.1,.1,.1]]*12,'referenceRgb':[.9,.9,.9]},'paper':{'renderTiles':[[.2,.2,.2]]*12,'referenceRgb':[.7,.7,.7]}}
    (p/'ink.json').write_text(json.dumps(key));(p/'colors.json').write_text(json.dumps(colors));prior=sys.argv
    try:
     sys.argv=['fit',str(p/'ink.json'),str(p/'colors.json'),str(p/'out.json')]
     with contextlib.redirect_stdout(io.StringIO()):tone.main()
    finally:sys.argv=prior
    chosen.append(json.loads((p/'out.json').read_text())['groups'][0]['blackPoint'])
   self.assertEqual(chosen[0],chosen[1])
if __name__=='__main__':unittest.main()
