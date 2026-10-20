"""Freeze reversible historical sources after the separate native material replay.
This reconstructs old receipts; it does not certify score reuse for planeswalkers.
"""
import difflib,hashlib,json,subprocess,sys
from pathlib import Path
base='2a39fa02311b8884d04590df25b507af17eb9d74'
out=Path('games/magic/fixtures/accuracy/planeswalker-materials');out.mkdir(parents=True,exist_ok=True)
files=['canvas-assets','canvas-face','material-bitmap-cache','planeswalker-type','special-frames','planeswalker-material','planeswalker-sources']
sha=lambda b:hashlib.sha256(b).hexdigest()
native='games/magic/fixtures/accuracy/planeswalker-materials/native.json'
replay=json.loads(Path(native).read_text());assert all(r['outsideScope']==0 for r in replay['records']);assert all(r['means']['candidate']<r['means']['released'] for r in replay['summary'] if r['component']=='background')
proof=dict(schema=1,baselineCommit=base,scope='Historical pre-0.6.3 source reconstruction only. Changed planeswalker materials and type geometry require fresh scores. Other branches retain their exact dispatch and cache keys; public native evidence and the non-planeswalker browser replay check those boundaries.',dependencies={},files={})
for name in files:
 f='games/magic/src/presentation/'+name+'.ts';new=Path(f).read_bytes();proof['dependencies'][f]=sha(new);old=subprocess.run(['git','show',base+':'+f],capture_output=True)
 if old.returncode:continue
 edits=[];a=new.decode().splitlines(keepends=True);b=old.stdout.decode().splitlines(keepends=True)
 for tag,i,j,k,l in difflib.SequenceMatcher(a=a,b=b,autojunk=False).get_opcodes():
  if tag!='equal':edits.append(dict(start=i,count=j-i,lines=b[k:l]))
 proof['files'][f]=dict(before=sha(old.stdout),after=sha(new),reverseEdits=list(reversed(edits)))
proof['newModules']=[f for f in proof['dependencies'] if f not in proof['files']]
proof['native']=dict(file=native,sha256=sha(Path(native).read_bytes()))
(out/'source-proof.json').write_text(json.dumps(proof,indent=2)+'\n')

# Prettier is pinned by this repository; run only after npm ci.
subprocess.run(['npx','--no-install','prettier','--write',str(out/'source-proof.json')],check=True)
p=Path('games/magic/tools/accuracy/planeswalker-reconstruction/ancestry.mjs')
import re
text=p.read_text();text=re.sub(r"(?<=')[a-f0-9]{64}(?=')",sha((out/'source-proof.json').read_bytes()),text,count=1);p.write_text(text)
