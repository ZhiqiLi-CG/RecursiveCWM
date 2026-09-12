"""Compose owned ground and three instances of the delivered house in root space."""
import copy,hashlib,json
from pathlib import Path
D=Path(__file__).resolve().parent
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
def dump(p,d):p.write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
child_path=D.parent/'west-house-prototype/part.json'
child=json.loads(child_path.read_text());local=json.loads((D/'local.json').read_text())
h=sha(D.parent.parent/'camera-contract.json');assert child['camera_contract_sha256']==local['camera_contract_sha256']==h
components=copy.deepcopy(local['components'])+copy.deepcopy(child['components'])
instances=[{'name':'house-1','source_node':child['node'],'root_pixel_offset':[0,0],'world_translation':[0,0,0],'included_in_components':True}]
for i,(du,dv) in enumerate([(51,-25.5),(102.5,-51)],2):
 dx=(du/30+dv/16.35)/2;dz=(dv/16.35-du/30)/2
 for source in child['components']:
  g=copy.deepcopy(source);g['id']=f'west-houses/house-{i}/'+source['id'].split('/',1)[1]
  if 'position' in g:g['position']=[g['position'][0]+dx,g['position'][1],g['position'][2]+dz]
  if 'vertices' in g:g['vertices']=[[x+dx,y,z+dz] for x,y,z in g['vertices']]
  if 'points' in g:g['points']=[[x+dx,z+dz] for x,z in g['points']]
  components.append(g)
 instances.append({'name':f'house-{i}','source_node':child['node'],'root_pixel_offset':[du,dv],'world_translation':[dx,0,dz],'included_in_components':True})
part={'node':'west-houses','camera_contract_sha256':h,'components':components,'children':['west-house-prototype'],'child_refs':[{'node':'west-house-prototype','path':'../west-house-prototype/part.json','sha256':sha(child_path),'included_in_components':True}],'instances':instances,'generator':'assemble.py','ground_generator':'generate.py'}
dump(D/'candidate.json',part)
base_path=D.parent/'west-civic/base.json';base=json.loads(base_path.read_text());context=base.get('components',base.get('geometry',[]));sources=[{'path':'../west-civic/base.json','sha256':sha(base_path)}]
# Delivered shop is context only, to judge the occluded second walkway and lawn edge.
shop_path=D.parent/'west-shop/part.json'
if shop_path.exists():
 shop=json.loads(shop_path.read_text());assert shop['camera_contract_sha256']==h
 context=context+shop['components'];sources.append({'path':'../west-shop/part.json','sha256':sha(shop_path)})
dump(D/'integrated-preview.json',{'camera_contract_sha256':h,'components':context+components})
dump(D/'context-sources.json',sources)
print('owned/flattened',len(components),'context',len(context),'houses',len(instances))
