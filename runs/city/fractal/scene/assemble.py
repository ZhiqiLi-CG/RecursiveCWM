"""Assemble flattened district deliveries once, preserving source geometry."""
import json,hashlib
from pathlib import Path
D=Path(__file__).resolve().parent
NAMES=['north-housing','west-civic','central-school','east-district','foreground-park']
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
camsha=sha(D/'../../camera-contract.json')
base=json.loads((D/'base-refined.json').read_text())
if (D/'root-final.json').exists():base=json.loads((D/'root-final.json').read_text())
comps=list(base['components']);refs=[]
for name in NAMES:
 p=D.parent/name/'part.json';d=json.loads(p.read_text())
 assert d['camera_contract_sha256']==camsha,name
 assert d['components'],name
 for r in d.get('child_refs',[]):
  q=p.parent/r.get('path',r.get('part',''))
  assert q.is_file(),q
  assert sha(q)==r['sha256'],q
  assert r['included_in_components'] is True,r
 refs.append(dict(node=name,path=f'../{name}/part.json',sha256=sha(p),component_count=len(d['components']),included_in_components=True))
 comps.extend(d['components'])
ids=[g['id'] for g in comps];assert len(ids)==len(set(ids))
a=dict(node='scene',camera_contract_sha256=camsha,components=comps,children=NAMES,child_refs=refs,composition='flattened; components include each child once; do not expand child_refs again',generator='assemble.py',root_generator='finish_root.py',root_component_count=len(base['components']))
(D/'candidate.json').write_text(json.dumps(a,indent=2)+'\n')
print(json.dumps(dict(components=len(comps),root_components=len(base['components']),children=refs),indent=2))
