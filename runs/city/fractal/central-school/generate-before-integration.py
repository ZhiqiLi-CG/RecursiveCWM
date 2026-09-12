import json, math
from pathlib import Path
P=Path(__file__).resolve().parent
cam=json.loads((P/'../../camera-contract.json').resolve().read_text()); V=cam['vertical_pixels_per_world_unit']
sha=json.loads((P/'view.json').read_text())['camera_contract_sha256']
g=[]
def world(s,t,y=0):
 u,v=370+s/2,188+t/2
 a=(u-470.5)/30;b=(v-260+V*y)/16.35
 return [(a+b)/2,y,(b-a)/2]
def add(name,typ,**kw):g.append(dict(id='central-school/'+name,type=typ,**kw))
def poly(name,pts,y,color):
 add(name,'polygon',points=[[world(s,t,y)[i] for i in (0,2)] for s,t in pts],y=y,color=color)
def cyl(name,p,r,h,c,rt=None):
 add(name,'cylinder',position=p,radius=r,height=h,segments=24,color=c,**({'radiusTop':rt} if rt is not None else {}))
def ell(name,p,size,c):add(name,'ellipsoid',position=p,size=size,color=c)
# The outer white strips are owned sidewalk inside the main road edges.
poly('front-sidewalk',[(137,315),(357,435),(574,315),(574,295),(366,183)],.018,'#ecece5')
poly('tower-lot',[(251,270),(458,384),(570,321),(365,208)],.025,'#79788f')
poly('school-edge',[(0,244),(152,329),(302,246),(150,158),(0,241)],.03,'#efeee5')
poly('school-yard',[(0,236),(152,320),(296,240),(148,157),(0,235)],.035,'#00ad91')
poly('school-entry',[(0,249),(96,299),(171,258),(147,244),(147,222),(124,209),(110,217),(99,211),(99,211)],.04,'#c6b7b4')
poly('plaza-west',[(181,324),(254,285),(329,326),(257,366)],.03,'#797790')
poly('plaza-east',[(284,379),(359,339),(432,379),(357,420)],.03,'#76748c')
# Four layered, flattened broadleaf crowns with trunks.
for j,(s,t,k) in enumerate([(36,232,1),(77,213,.95),(164,287,1),(206,258,1)]):
 x,_,z=world(s,t,0)
 cyl(f'tree-{j}-trunk',[x,.17,z],.040,.34,'#956536')
 for n,(y,r,dy) in enumerate([(.34,.30,.065),(.48,.265,.06),(.61,.195,.05),(.72,.115,.035)]):
  ell(f'tree-{j}-crown-{n}',[x+(.035 if n%2 else -.035),y*k,z],[r*k,dy*k,r*k],['#6c901d','#88a522','#769c20','#a3ba34'][n])
  ell(f'tree-{j}-light-{n}',[x-.025,y*k+.035,z-.025],[r*k*.79,dy*k*.47,r*k*.77],['#9bb52c','#abc338','#a5bc31','#b7cc42'][n])
# Fountain at the forward square. Basin, water, central stem and 8 bowed jets.
x,_,z=world(359,372,0)
cyl('fountain-basin',[x,.105,z],.33,.19,'#e9eeeb')
cyl('fountain-water',[x,.205,z],.275,.015,'#8cdeeb')
cyl('fountain-stem',[x,.47,z],.045,.53,'#acdfeb')
cyl('fountain-head',[x,.775,z],.085,.06,'#bceaf0')
ell('fountain-head-glint',[x,.81,z],[.095,.028,.095],'#d1f3f1')
def tube(name,pts,r,c):
 verts=[];idx=[]
 for p in pts:
  for a in range(6):
   ang=a*math.tau/6;verts.append([p[0]+r*math.cos(ang),p[1],p[2]+r*math.sin(ang)])
 for n in range(len(pts)-1):
  for a in range(6):
   b=n*6+a;d=n*6+(a+1)%6;idx.extend([b,d,b+6,d,d+6,b+6])
 add(name,'triangles',vertices=verts,indices=idx,color=c)
for j in range(8):
 a=j*math.tau/8
 pts=[]
 for q in range(17):
  t=q/16;r=.055+.19*t
  pts.append([x+r*math.cos(a),.22+.47*math.sqrt(max(0,1-t*t)),z+r*math.sin(a)])
 tube(f'fountain-jet-{j}',pts,.012,'#85d9e9' if j%2 else '#b4e8ee')
owned=dict(node='central-school',camera_contract_sha256=sha,components=g,children=[])
(P/'owned.json').write_text(json.dumps(owned,indent=2)+'\n')
base=json.loads((P/'../scene/base.json').read_text())
(P/'preview.json').write_text(json.dumps(dict(owned,components=base['components']+g),indent=2)+'\n')
print(f'Generated {len(g)} owned components')
