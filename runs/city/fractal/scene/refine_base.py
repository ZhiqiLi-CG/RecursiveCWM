"""Root refinements; preserve the inherited base snapshot for descendants."""
import hashlib
import json
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parent
source = ROOT / 'base.json'
base_hash = hashlib.sha256(source.read_bytes()).hexdigest()
spec = json.loads(source.read_text())
camera_path = ROOT / '../../camera-contract.json'
camera_hash = hashlib.sha256(camera_path.read_bytes()).hexdigest()
camera = json.loads(camera_path.read_text())
assert camera['locked']

def ground(u, v):
    a = (u - 470.5) / 30
    b = (v - 260) / 16.35
    return [(a+b)/2, (b-a)/2]

spec['components'] = [g for g in spec['components']
                      if not g['id'].startswith('scene/crossing-')]
anchors = [((312,119),(339,104)), ((48,301),(77,317)),
           ((249,321),(275,335)), ((367,343),(394,329)),
           ((743,278),(770,263)), ((726,371),(753,357))]
for index, (a, b) in enumerate(anchors):
    wa, wb = ground(*a), ground(*b)
    cx, cz = [(a+b)/2 for a,b in zip(wa,wb)]
    dx, dz = wb[0]-wa[0], wb[1]-wa[1]
    length = math.hypot(dx,dz)
    tx, tz = dx/length, dz/length  # repetition axis measured in reference
    nx, nz = -tz, tx              # long axis of each white bar
    backing = [[cx+tx*along+nx*across, cz+tz*along+nz*across]
               for across,along in [(-.52,-length*.52),(.52,-length*.52),
                                    (.52,length*.52),(-.52,length*.52)]]
    spec['components'].append(dict(id=f'scene/crossing-{index}-backing',
        type='polygon', points=backing, y=.011, color='#8ec8e3'))
    for stripe in range(8):
        offset = (stripe-3.5)*length/8
        points = [[cx+tx*(offset+along)+nx*across,
                   cz+tz*(offset+along)+nz*across]
                  for across,along in [(-.42,-.037),(.42,-.037),
                                       (.42,.037),(-.42,.037)]]
        spec['components'].append(dict(id=f'scene/crossing-{index}-{stripe}',
            type='polygon', points=points, y=.012, color='#ffffff'))

spec['camera_contract_sha256'] = camera_hash
spec['inherited_base_sha256'] = base_hash
spec['revision'] = 'root-cycle2-crossings'
(ROOT/'base-refined.json').write_text(json.dumps(spec,indent=2)+'\n')
assert hashlib.sha256(source.read_bytes()).hexdigest() == base_hash
assert hashlib.sha256(camera_path.read_bytes()).hexdigest() == camera_hash
print(json.dumps(dict(components=len(spec['components']),
                     inherited_base_sha256=base_hash,
                     camera_contract_sha256=camera_hash)))
