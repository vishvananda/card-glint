import subprocess,json,pathlib,hashlib,difflib
root=pathlib.Path.cwd();sha=lambda b:hashlib.sha256(b).hexdigest()
base='13031e19b55c4eb6f26d171802c854449d146b75';battle='b23949566368bb5d638142b87299ccf1a7e19819'
run=lambda *a:subprocess.check_output(['git',*a],stderr=subprocess.DEVNULL)
changed=run('diff','--name-only',base,'--','games/magic/src','packages/browser/src').decode().splitlines()
battlefiles=set(run('diff-tree','--no-commit-id','--name-only','-r',battle).decode().splitlines())
proof={'schema':1,'baselineCommit':base,'battleCommit':battle,'scope':'Main-thread default Canvas2D pixels for existing table/inspect tiers. Worker, bitmap, R8 and numeric/native tier modes are new opt-in behavior. Battle geometry changes are separately bound to PR 8. Finish shaders are outside flat calibration measurements.','files':{},'dependencies':{},'evidence':'games/magic/fixtures/accuracy/host-worker/browser-parity.json'}
for file in sorted(set(changed)):
 p=root/file
 try:before=run('show',(battle if file in battlefiles else base)+':'+file)
 except subprocess.CalledProcessError:
  proof['dependencies'][file]=sha(p.read_bytes());continue
 after=p.read_bytes()
 if after==before:continue
 a=before.decode().splitlines(True);b=after.decode().splitlines(True)
 edits=[{'start':j1,'count':j2-j1,'lines':a[i1:i2]} for op,i1,i2,j1,j2 in difflib.SequenceMatcher(None,a,b,autojunk=False).get_opcodes() if op!='equal'][::-1]
 kind='portable-raster' if file=='packages/browser/src/canvas-raster.ts' else 'host-finish-outside-flat' if file.startswith('packages/browser/src/') else 'portable-composer' if file.endswith('/canvas-face.ts') else 'bitmap-mask-wrapper' if file.endswith('/index.ts') or file.endswith('/security-stamp-hologram.ts') else 'transpiled-browser-parity'
 proof['files'][file]={'before':sha(before),'after':sha(after),'review':kind,'reverseEdits':edits}
for file in ['packages/browser/src/canvas-raster.ts','packages/browser/src/canvas-mask.ts','games/magic/src/presentation/canvas-font-registry.ts']:
 proof['dependencies'][file]=sha((root/file).read_bytes())
(root/'games/magic/fixtures/accuracy/host-worker/source-proof.json').write_text(json.dumps(proof,indent=2)+'\n')
print(len(proof['files']),'reversible files',len(proof['dependencies']),'dependencies')
