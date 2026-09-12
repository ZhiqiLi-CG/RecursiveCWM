import json,hashlib,math,ast
from pathlib import Path
from PIL import Image
D=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
camsha=sha(D/'../../camera-contract.json')
assert camsha=='07ef728c04f7a76056295d3b6d46c35363569f6d6389de555926e19bea85263c'
assert sha(D/'base.json')=='5a9576da3b70d7e2182533793b88a01cbbe1f078332f255c708fffe8221708d9'
manifest=json.loads((D/'manifest.json').read_text());assert manifest['camera_hash']=='none';assert sha(D/'target.png').startswith(manifest['reference_sha256'])
a=json.loads((D/'candidate.json').read_text());root=json.loads((D/'root-final.json').read_text());comps=a['components'];assert a['camera_contract_sha256']==camsha
expected=list(root['components']);sources=[]
for ref in a['child_refs']:
 p=D/ref['path'];assert sha(p)==ref['sha256'];d=json.loads(p.read_text());assert d['camera_contract_sha256']==camsha
 assert ref['included_in_components'] is True
 assert len(d['components'])==ref['component_count'];expected.extend(d['components']);sources.append({'node':ref['node'],'sha256':sha(p),'component_count':len(d['components'])})
assert comps==expected,'Child geometry must remain unchanged and flattened once'
assert len({c['id'] for c in comps})==len(comps)
def finite(v):
 if isinstance(v,float):assert math.isfinite(v)
 elif isinstance(v,list):
  for x in v:finite(x)
 elif isinstance(v,dict):
  for x in v.values():finite(x)
for g in comps:
 finite(g);t=g['type'];assert t in ['polygon','triangles','box','cylinder','cone','ellipsoid']
 if t=='polygon':assert len(g['points'])>=3
 if t=='triangles':
  assert len(g['indices'])%3==0
  assert all(isinstance(i,int) and 0<=i<len(g['vertices']) for i in g['indices'])
 if t in ['box','ellipsoid']:assert all(x>0 for x in g['size'])
 if t in ['cylinder','cone']:assert g['height']>0 and g['radius']>0
report=json.loads((D/'final.render.json').read_text());assert report['errors']==[];assert report['camera_contract_sha256']==camsha
assert Image.open(D/'target.png').size==Image.open(D/'final.png').size==(941,520)
assert not (D/'children.json').exists(),'Do not redispatch completed children'
for f in ['assemble.py','finish_root.py','compare.py']:ast.parse((D/f).read_text())
result={'status':'passed','components':len(comps),'root_components':len(root['components']),'child_components':len(comps)-len(root['components']),'children':sources,'camera_sha256':camsha,'inherited_base_sha256':sha(D/'base.json'),'candidate_sha256':sha(D/'candidate.json'),'render_sha256':sha(D/'final.png'),'render_errors':report['errors'],'render_meshes':report['meshes'],'render_triangles':report['triangles'],'resolution':[941,520],'visual_evidence':'final-compare.png','new_child_dispatch':False}
(D/'final-validation.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k!='children'},indent=2))
