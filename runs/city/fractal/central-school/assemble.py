import json,hashlib,copy
from pathlib import Path
P=Path(__file__).resolve().parent
own=json.loads((P/'owned.json').read_text());sha=own['camera_contract_sha256'];parts=copy.deepcopy(own['components']);refs=[]
for n in ['school-main-building','school-tiered-towers']:
 p=P.parent/n/'part.json';raw=p.read_bytes();d=json.loads(raw)
 assert d['camera_contract_sha256']==sha
 for c in d['components']:
  c=copy.deepcopy(c);c['id']='central-school/'+c['id'];parts.append(c)
 refs.append(dict(node=n,path=f'../{n}/part.json',sha256=hashlib.sha256(raw).hexdigest(),included_in_components=True,id_prefix='central-school/'))
assert len(parts)==len({c['id'] for c in parts})
a=dict(node='central-school',camera_contract_sha256=sha,components=parts,children=[r['node'] for r in refs],child_refs=refs,generators=['generate.py','assemble.py'],account='account.md',evidence=['final-compare.png','final.render.json','validation.json'])
(P/'assembly.json').write_text(json.dumps(a,indent=2)+'\n')
base=json.loads((P/'../scene/base.json').read_text())
(P/'preview.json').write_text(json.dumps(dict(a,components=base['components']+parts),indent=2)+'\n')
print(f'Assembled {len(parts)} components; root context {len(base["components"])}')
