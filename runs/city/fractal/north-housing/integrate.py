"""Assemble the delivered building child and reconnect district-owned walks."""
import copy
import hashlib
import json
from pathlib import Path

P = Path(__file__).resolve().parent
def read(path):
    return json.loads(path.read_text())
def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

camera_path = P.parent.parent / 'camera-contract.json'
camera = read(camera_path)
camera_sha = sha(camera_path)
child_path = P.parent / 'north-housing-buildings/part.json'
child = read(child_path)
local = read(P/'local.json')
assert child['camera_contract_sha256'] == local['camera_contract_sha256'] == camera_sha
components = copy.deepcopy(local['components'])
V = camera['vertical_pixels_per_world_unit']

def project(x,y,z):
    return 470.5+30*(x-z),260+16.35*(x+z)-V*y
def unproject(u,v,y):
    a=(u-470.5)/30
    b=(v-260+V*y)/16.35
    return [(a+b)/2,(b-a)/2]

# Trim the rear lawn so it does not show as dark wedges between rooflines.
lawn=next(g for g in components if g['id']=='north-housing/residential-lawn')
lawn['points']=[unproject(u,v,.02) for u,v in [(35,153),(242,40),(293,66),(86,179)]]

# The front lawn boundary is the line from (86,179) to (293,66).
# Paths follow world +x from each delivered step to this boundary.
slope = 113/207
intercept = 179+slope*86
for i in range(1,5):
    step = next(g for g in child['components'] if g['id']==f'north-housing-buildings/house{i}/step')
    x,y,z = step['position']
    u,v = project(x, .032, z)
    distance = (intercept-slope*u-v)/(slope+.545)
    end_u,end_v = u+distance,v+.545*distance
    pts = [(u-1.5,v+.8175),(u+1.5,v-.8175),
           (end_u+1.5,end_v-.8175),(end_u-1.5,end_v+.8175)]
    walk = next(g for g in components if g['id']==f'north-housing/walk-{i}')
    walk['points'] = [unproject(a,b,.032) for a,b in pts]

for original in child['components']:
    g=copy.deepcopy(original)
    g['source_id']=original['id']
    g['id']='north-housing/buildings/'+original['id'].split('/',1)[1]
    components.append(g)
assert len({g['id'] for g in components})==len(components)
assert all(g['id'].startswith('north-housing/') for g in components)
part=dict(node='north-housing',camera_contract_sha256=camera_sha,
          components=components,children=['north-housing-buildings'],
          child_refs=[dict(node='north-housing-buildings',path='../north-housing-buildings/part.json',
                           sha256=sha(child_path),included_in_components=True,
                           component_id_prefix='north-housing/buildings/')])
(P/'candidate.json').write_text(json.dumps(part,indent=2)+'\n')
base=read(P.parent/'scene/base.json')
(P/'integrated-preview.json').write_text(json.dumps(dict(node='north-housing-preview',camera_contract_sha256=camera_sha,components=base['components']+components),indent=2)+'\n')
print(f'Assembled {len(components)} components; four paths connected; child flattened exactly once.')
