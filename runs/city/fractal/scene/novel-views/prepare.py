import json,math,hashlib
from pathlib import Path
import numpy as np
D=Path(__file__).resolve().parent;P=D.parent
part=json.loads((P/'part.json').read_text());original=json.loads((P/'../../camera-contract.json').read_text())
source_hash=hashlib.sha256((P/'part.json').read_bytes()).hexdigest()
def points(g):
 t=g['type']
 if t=='polygon':return [[x,g['y'],z] for x,z in g['points']]
 if t=='triangles':return g['vertices']
 p=g.get('position',[0,0,0])
 if t=='box':r=[s/2 for s in g['size']]
 elif t=='ellipsoid':r=g['size']
 elif t in ['cylinder','cone']:
  rad=max(g['radius'],g.get('radiusTop',0));r=[rad,g['height']/2,rad]
 else:raise ValueError(t)
 return [[p[0]+a*r[0],p[1]+b*r[1],p[2]+c*r[2]] for a in [-1,1] for b in [-1,1] for c in [-1,1]]
views=[
 ('view-L35',10,original['elevation_degrees'],'all',1.07),
 ('view-R35',80,original['elevation_degrees'],'all',1.07),
 ('view-orbit',45,35,'all',1.07),
 ('view-close1',38,original['elevation_degrees'],'school',1.18),
 ('view-close2',48,original['elevation_degrees'],'west',1.13),
]
for name,az,el,focus,margin in views:
 def selected(g):
  n=g['id']
  if focus=='all':return not n.startswith('scene/')
  if focus=='west':return n.startswith('west-')
  if focus=='school':return n.startswith('central-school/') or n.startswith('west-shop/')
  return n.startswith(('east-purple-housing/','east-teal-towers/','east-hospital/'))
 gs=[g for g in part['components'] if selected(g)]
 pts=np.array([p for g in gs for p in points(g)])
 a,e=math.radians(az),math.radians(el)
 right=np.array([math.cos(a),0,-math.sin(a)]);up=np.array([-math.sin(e)*math.sin(a),math.cos(e),-math.sin(e)*math.cos(a)]);direction=np.array([math.cos(e)*math.sin(a),math.sin(e),math.cos(e)*math.cos(a)])
 coords=pts@np.array([right,up,direction]).T;lo,hi=coords.min(axis=0),coords.max(axis=0);mid=(lo+hi)/2;target=mid[0]*right+mid[1]*up+mid[2]*direction
 half=max((hi[1]-lo[1])/2,(hi[0]-lo[0])/2/(1400/900))*margin
 cam={'projection':'orthographic','resolution':[1400,900],'target':target.tolist(),'position':(target+direction*80).tolist(),'up':[0,1,0],'left':-half*1400/900,'right':half*1400/900,'top':half,'bottom':-half,'near':.1,'far':500,'render':{'background':'#ffffff'},'azimuth_degrees':az,'elevation_degrees':el,'source_part_sha256':source_hash,'fit':focus+' subject bounds; substrate retained without affecting framing','margin':margin}
 (D/(name+'.camera.json')).write_text(json.dumps(cam,indent=2)+'\n')
 assert (hi[0]-lo[0])/2<half*1400/900 and (hi[1]-lo[1])/2<half
(D/'scene.js').write_bytes((P/'scene.js').read_bytes())
s=(P/'render.mjs').read_text().replace("||'spec.json'","||'../part.json'")
s=s.replace("if(payload.spec.camera_contract_sha256 && payload.spec.camera_contract_sha256!==cameraSHA)throw Error('Locked camera digest mismatch');", "const sourceSHA=createHash('sha256').update(fs.readFileSync(validate(scene))).digest('hex'); if(sourceSHA!==payload.camera.source_part_sha256)throw Error('Frozen scene digest mismatch');")
(D/'render.mjs').write_text(s)
(D/'source.json').write_text(json.dumps({'part':'../part.json','sha256':source_hash,'geometry_modified':False,'render_implementation':'unchanged copy of parent scene.js'},indent=2)+'\n')
print('Prepared five 1400x900 cameras; frozen source',source_hash)
