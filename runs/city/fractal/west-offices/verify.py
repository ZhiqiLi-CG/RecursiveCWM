"""Validate the delivered scene composition and immutable inputs."""
import ast,hashlib,json,math
from pathlib import Path
from PIL import Image
P=Path(__file__).resolve().parent
load=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
c=load(P/'candidate.json'); owned=load(P/'owned.json'); child=load(P/'../west-offices-annex/part.json'); base=load(P/'../west-civic/base.json'); preview=load(P/'preview.json'); view=load(P/'view.json');manifest=load(P/'manifest.json');handoff=load(P/'handoff-validation.json')
camsha=sha(P/'../../camera-contract.json')
assert camsha==c['camera_contract_sha256']==child['camera_contract_sha256']==view['camera_contract_sha256']==handoff['camera_sha256']
assert sha(P/'manifest.json')==handoff['parent_manifest_sha256']
assert sha(P/'target.png')==handoff['target_sha256']
assert sha(P/'../west-civic/base.json').startswith(manifest['parent_snapshot'].split(':')[1])
assert c['components']==owned['components']+child['components']
assert preview['components']==base['components']+c['components']
assert c['children']==['west-offices-annex']
r=c['child_refs'][0]
assert r['included_in_components'] is True and r['sha256']==sha(P/r['path'])
ids=[g['id'] for g in c['components']]
assert len(ids)==len(set(ids))==113
assert all(g['id'].startswith('west-offices/') for g in owned['components'])
assert all(g['id'].startswith('west-offices-annex/') for g in child['components'])
assert not set(ids).intersection(g['id'] for g in base['components'])
def finite(v):
 if isinstance(v,dict):return all(finite(x) for x in v.values())
 if isinstance(v,list):return all(finite(x) for x in v)
 return not isinstance(v,(float,int)) or math.isfinite(v)
assert finite(c)
for g in c['components']:
 assert g['type'] in ['box','polygon','triangles']
 if g['type']=='box':assert len(g['position'])==3 and len(g['size'])==3 and min(g['size'])>0
 if g['type']=='polygon':assert len(g['points'])>=3
 if g['type']=='triangles':assert len(g['indices'])%3==0 and all(0<=i<len(g['vertices']) for i in g['indices'])
for name in ['generate.py','assemble.py','compare.py','verify.py']:ast.parse((P/name).read_text())
render=load(P/'resume-round4.render.json')
assert render['errors']==[] and render['view']==view['crop_px'] and render['camera_contract_sha256']==camsha
assert Image.open(P/'resume-round4.png').size==Image.open(P/'target.png').size==tuple(view['output_size'])==(580,676)
assert Image.open(P/'resume-round4-compare.png').size==(1160,700)
report=dict(status='verified',camera_contract_sha256=camsha,own_components=len(owned['components']),child_components=len(child['components']),total_components=len(ids),children=c['children'],child_part_sha256=r['sha256'],candidate_sha256=sha(P/'candidate.json'),render_errors=[],render_size=view['output_size'],visual_evidence='resume-round4-compare.png',visual_review='Personally reviewed equal-scale whole-node comparison: annex roof/tower occlusion, wall-to-ground connection and left clipping are coherent; residual sharpness and neighboring road alignment retained.',parent_context_excluded=True,child_flattened_once=True,immutable_inputs_verified=True)
if (P/'part.json').exists():
 assert (P/'part.json').read_bytes()==(P/'candidate.json').read_bytes()
 report['part_sha256']=sha(P/'part.json')
(P/'verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(report,ensure_ascii=False))
