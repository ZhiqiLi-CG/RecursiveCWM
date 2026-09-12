import json,hashlib,math
from pathlib import Path
from PIL import Image
D=Path(__file__).resolve().parent
read=lambda p:json.loads(p.read_text())
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
p=read(D/'candidate.json');s=read(D/'integration-sources.json');view=read(D/'view.json');r=read(D/'integrated-final.render.json')
camsha=sha(D.parent.parent/'camera-contract.json')
assert p['camera_contract_sha256']==view['camera_contract_sha256']==r['camera_contract_sha256']==camsha
for file,key in [('manifest.json','manifest_sha256'),('target.png','target_sha256'),('context.json','context_sha256')]:assert sha(D/file)==s[key]
assert not r['errors'] and r['view']==view['crop_px']
assert Image.open(D/'target.png').size==Image.open(D/'integrated-final.png').size==tuple(view['output_size'])
assert Image.open(D/'integrated-final-compare.png').size==(2344,612)
assert len(p['components'])==583
ids=[g['id'] for g in p['components']];assert len(set(ids))==len(ids)
child_components=[]
for ref in p['child_refs']:
 child=read(D/ref['path']);assert sha(D/ref['path'])==ref['sha256']
 assert ref['included_in_components'] and len(child['components'])==ref['component_count']
 child_components.extend(child['components'])
assert p['components']==child_components+read(D/'local-components.json')
assert p['children']==[r['node'] for r in p['child_refs']]
base=read(D/'context.json')['components'];neighbor=read(D.parent/'school-tiered-towers/part.json')['components']
assert not set(ids)&{g['id'] for g in base+neighbor}
assert read(D/'continuity-preview.json')['components']==base+neighbor+p['components']
def finite(v):
 if isinstance(v,(int,float)):assert math.isfinite(v)
 elif isinstance(v,list):
  for x in v:finite(x)
 elif isinstance(v,dict):
  for x in v.values():finite(x)
for g in p['components']:
 finite(g)
 assert g['type'] in ['polygon','triangles','box','cylinder','cone','ellipsoid']
 if g['type']=='polygon':assert len(g['points'])>=3 and all(len(q)==2 for q in g['points'])
 if g['type']=='box':assert len(g['size'])==3 and all(x>0 for x in g['size'])
 if g['type']=='triangles':
  assert len(g['indices'])%3==0
  assert all(isinstance(i,int) and 0<=i<len(g['vertices']) for i in g['indices'])
assert not (D/'children.json').exists(),'Do not issue a new child dispatch for completed children'
(D/'part.json').write_bytes((D/'candidate.json').read_bytes())
assert read(D/'part.json')==p
report={'status':'passed','components':len(ids),'child_components':len(child_components),'district_components':2,'child_refs':p['child_refs'],'unique_ids':True,'finite_geometry':True,'child_geometry_unchanged':True,'parent_and_neighbor_geometry_excluded':True,'camera_contract_sha256':camsha,'part_sha256':sha(D/'part.json'),'render_errors':r['errors'],'render_triangles_including_context':r['triangles'],'output_size':view['output_size'],'equal_scale_comparison':[2344,612],'visual_evidence':['integrated-round0-compare.png','integrated-round1-compare.png','integrated-final-compare.png','integrated-final-hospital-seam.png'],'visual_judgement':'Recorded in account.md; structural checks do not assert pixel identity.'}
(D/'final-validation.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps({'status':'passed','components':len(ids),'children':len(p['children']),'render_errors':r['errors'],'part_sha256':report['part_sha256']}))
