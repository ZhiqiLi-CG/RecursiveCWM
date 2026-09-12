from pathlib import Path
import json,hashlib,math,sys
from PIL import Image
P=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
read=lambda p:json.loads(p.read_text())
name=sys.argv[1] if len(sys.argv)>1 else 'assembly.json'
a=read(P/name);v=read(P/'view.json');m=read(P/'manifest.json');o=read(P/'owned.json');base=read(P/'../scene/base.json');report=read(P/'final.render.json')
assert sha((P/'../../camera-contract.json').resolve())==v['camera_contract_sha256']==a['camera_contract_sha256']==report['camera_contract_sha256']
assert sha(P/'../scene/base.json').startswith(m['parent_snapshot'].split(':')[-1])
assert sha(P/'target.png').startswith(m['reference_sha256'])
x,y,w,h=v['crop_px'];expected=Image.open(P/'../scene/target.png').crop((x,y,x+w,y+h)).resize(tuple(v['output_size']),Image.Resampling.LANCZOS)
assert expected.convert('RGB').tobytes()==Image.open(P/'target.png').convert('RGB').tobytes()
ids=[c['id'] for c in a['components']];assert len(ids)==len(set(ids));assert all(i.startswith('central-school/') for i in ids)
assert not set(ids)&{c['id'] for c in base['components']}
expected_parts=list(o['components'])
for r in a['child_refs']:
 assert r['included_in_components'] is True
 p=(P/r['path']).resolve();assert sha(p)==r['sha256'];d=read(p);assert d['camera_contract_sha256']==a['camera_contract_sha256']
 expected_parts.extend(dict(c,id='central-school/'+c['id']) for c in d['components'])
assert a['components']==expected_parts
assert read(P/'preview.json')['components']==base['components']+a['components']
def finite(x):
 if isinstance(x,(int,float)):assert math.isfinite(x)
 elif isinstance(x,list):
  for v in x:finite(v)
 elif isinstance(x,dict):
  for v in x.values():finite(v)
for c in a['components']:
 finite(c)
 if 'size' in c:assert all(v>0 for v in c['size'])
 if c['type']=='triangles':assert len(c['indices'])%3==0 and all(isinstance(i,int) and 0<=i<len(c['vertices']) for i in c['indices'])
assert report['errors']==[] and report['view']==v['crop_px']
assert Image.open(P/'target.png').size==Image.open(P/'final.png').size==tuple(v['output_size'])
assert Image.open(P/'final-compare.png').size==(v['output_size'][0]*2,v['output_size'][1]+24)
result=dict(valid=True,checked_artifact=name,camera_contract_sha256=a['camera_contract_sha256'],target_sha256=sha(P/'target.png'),parent_snapshot_valid=True,components=len(ids),own_components=len(o['components']),children=a['children'],child_geometry_unchanged_except_id_prefix=True,parent_context_excluded=True,same_scale_size=v['output_size'],render_errors=report['errors'],render_triangles=report['triangles'],part_sha256=sha(P/name))
(P/'validation.json').write_text(json.dumps(result,indent=2)+'\n');print(json.dumps(result))
