import json, math
from pathlib import Path
D=Path(__file__).resolve().parent
view=json.loads((D/'view.json').read_text())
cam=json.loads((D.parent.parent/'camera-contract.json').read_text())
V=cam['vertical_pixels_per_world_unit']
components=[]
def world(s,t,y=0):
 u=207+s/4;v=168+t/4
 a=(u-470.5)/30;b=(v-260+V*y)/16.35
 return [(a+b)/2,y,(b-a)/2]
def poly(name,pts,color,y=.025):
 components.append(dict(id='west-houses/'+name,type='polygon',points=[[world(s,t,y)[0],world(s,t,y)[2]] for s,t in pts],y=y,color=color))
poly('residential-lawn',[(0,382),(522,121),(724,222),(136,519),(0,451)],'#28852a')
# Narrow paths begin at the three porch bases and meet the front parcel edge.
for i,(dx,dy) in enumerate([(0,0),(204,-102),(410,-204)]):
 poly(f'path-{i+1}',[(195+dx,431+dy),(213+dx,422+dy),(269+dx,452+dy),(251+dx,461+dy)],'#c8c9b5',.04)
# Small hedge clumps beside porch and along street edge; faceted real geometry.
for i,(s,t) in enumerate([(230,379),(287,409),(434,277),(491,307),(640,175),(691,203)]):
 for j,(ds,dt,r,c) in enumerate([(-10,1,.095,'#699813'),(0,-1,.12,'#80a514'),(10,2,.075,'#769d0a'),(-2,-8,.077,'#83a519')]):
  h=.033 if j!=3 else .055
  components.append(dict(id=f'west-houses/shrub-{i}-{j}',type='ellipsoid',position=world(s+ds,t+dt,h),size=[r,h,r*.85],color=c))
local={'node':'west-houses','camera_contract_sha256':view['camera_contract_sha256'],'components':components,'children':[]}
(D/'local.json').write_text(json.dumps(local,indent=2)+'\n')
base=json.loads((D.parent/'west-civic/base.json').read_text())
preview={'camera_contract_sha256':view['camera_contract_sha256'],'components':base.get('components',base.get('geometry',[]))+components}
(D/'preview.json').write_text(json.dumps(preview,indent=2)+'\n')
print('local components',len(components),'preview',len(preview['components']))
