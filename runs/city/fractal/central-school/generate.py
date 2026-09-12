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
poly('tower-rear-edge',[(390,220),(574,118),(574,226),(491,272)],.021,'#eeeae3')
poly('tower-rear-yard',[(390,216),(574,114),(574,216),(491,265)],.024,'#79788f')
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
 for n,(y,r,offset) in enumerate([(.34,.32,-.055),(.49,.27,.045),(.63,.20,-.02),(.75,.12,0)]):
  # Flatten canopy depth along viewing direction; distinct offset leaf tiers.
  verts=[];indices=[]
  for level,(rad,dy) in enumerate([(0,-.044),(.83,-.040),(1,0),(.85,.040),(0,.062)]):
   for q in range(12):
    ang=q*math.tau/12
    side=r*rad*math.cos(ang)+offset;depth=r*.46*rad*math.sin(ang)
    verts.append([x+(side+depth)/math.sqrt(2),(y+dy)*k,z+(-side+depth)/math.sqrt(2)])
  for row in range(4):
   ii=[]
   for q in range(12):
    a=row*12+q;b=row*12+(q+1)%12;ii.extend([a,b,a+12,b,b+12,a+12])
   add(f'tree-{j}-crown-{n}-band-{row}','triangles',vertices=verts,indices=ii,color=['#719122','#6b8f1c','#91af29','#afc439'][row])
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
