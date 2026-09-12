import json, math, hashlib
from pathlib import Path
ROOT=Path(__file__).resolve().parent
NODE=ROOT.name
camera=json.loads((ROOT/'../../camera-contract.json').read_text())
sha=hashlib.sha256((ROOT/'../../camera-contract.json').read_bytes()).hexdigest()
V=camera['vertical_pixels_per_world_unit']
def world(u,v,y=0):
 a=(u-470.5)/30;b=(v-260+V*y)/16.35
 return [(a+b)/2,y,(b-a)/2]
anchor=world(226,487)
components=[]
def add(name,**g): components.append(dict(id=NODE+'/'+name,**g))
def triangulate(points):
 def cross(a,b,c):return (b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0])
 area=sum(points[i][0]*points[(i+1)%len(points)][1]-points[(i+1)%len(points)][0]*points[i][1] for i in range(len(points)))
 sign=1 if area>0 else -1
 order=list(range(len(points))); tris=[]
 while len(order)>3:
  for j,b in enumerate(order):
   a=order[j-1];c=order[(j+1)%len(order)]
   if sign*cross(points[a],points[b],points[c])<=1e-9:continue
   if any(all(sign*cross(points[q],points[r],points[k])>=-1e-9 for q,r in [(a,b),(b,c),(c,a)]) for k in order if k not in (a,b,c)):continue
   tris.extend([a,b,c]);order.pop(j);break
  else:raise ValueError('Cannot triangulate')
 return tris+order
# Each cap lies in its own vertical world plane, separated by 0.34 units.
# These are polygonal crown sections, not a camera-facing billboard.
front=[(46,54),(83,58),(103,25),(83,94),(144,94),(130,114),(83,138),(119,165),(82,190),(126,200),(77,260),(26,212),(38,197),(25,188),(39,131),(24,92)]
back=[(103,25),(132,28),(145,33),(161,41),(179,60),(184,82),(184,134),(174,142),(184,148),(184,195),(184,247),(115,259),(96,231),(87,213),(98,159),(81,111)]
def soften(poly,d=1.4):
 out=[]
 for i,p in enumerate(poly):
  for q in [poly[i-1],poly[(i+1)%len(poly)]]:
   dist=math.dist(p,q);t=min(d/dist,.22)
   out.append((p[0]+(q[0]-p[0])*t,p[1]+(q[1]-p[1])*t))
 return out
front=soften(front);back=soften(back)
zfront=anchor[2]+0.13
zback=zfront-0.34
def plane_point(p,z):
 u=208+p[0]/6;v=426+p[1]/6
 x=z+(u-470.5)/30
 return [x,(260+16.35*(x+z)-v)/V,z]
f=[plane_point(p,zfront) for p in front]; b=[plane_point(p,zback) for p in back]
add('crown/front',type='triangles',vertices=f,indices=triangulate(front),color='#bd3431')
add('crown/back',type='triangles',vertices=b,indices=triangulate(back),color='#a9201a')
for i in range(len(front)):
 j=(i+1)%len(front)
 add(f'crown/rim-{i:02}',type='triangles',vertices=[f[i],b[i],b[j],f[j]],indices=[0,1,2,0,2,3],color='#a7241d' if i<22 else '#b22d25')
# A closed octagonal trunk; face colors follow the two principal image faces.
trunk_center=world(225.5,485.7)
r=.056; height=.65
rings=[]
for y in [0,height]:
 rings.append([[trunk_center[0]+r*math.cos(i*math.pi/4),y,trunk_center[2]+r*math.sin(i*math.pi/4)] for i in range(8)])
for i in range(8):
 j=(i+1)%8
 color=['#754018','#915024','#975725','#955524','#82451c','#754018','#754018','#754018'][i]
 add(f'trunk/side-{i}',type='triangles',vertices=[rings[0][i],rings[0][j],rings[1][j],rings[1][i]],indices=[0,1,2,0,2,3],color=color)
add('trunk/top',type='triangles',vertices=rings[1],indices=triangulate([[p[0],p[2]] for p in rings[1]]),color='#935324')
add('trunk/bottom',type='triangles',vertices=rings[0],indices=triangulate([[p[0],p[2]] for p in rings[0]]),color='#754018')
shadow=[]
for i in range(12):
 a=i*math.tau/12
 shadow.append([trunk_center[0]+.020+.075*math.cos(a),trunk_center[2]-.01+.06*math.sin(a)])
add('contact-shadow',type='polygon',points=shadow,y=.002,color='#80b94c')
part=dict(node=NODE,camera_contract_sha256=sha,components=components,children=[],child_refs=[],prototype_anchor_pixel=[226,487],prototype_anchor_world=anchor,geometry_note='Closed asymmetric crown with two parallel vertical sections and connecting rim; octagonal trunk; ground contact shadow. Root-world coordinates.')
(ROOT/'candidate.json').write_text(json.dumps(part,indent=2)+'\n')
base=json.loads((ROOT/'../scene/base.json').read_text())
preview={**part,'components':base['components']+components,'landmarks':[dict(id='prototype-anchor',world=anchor,pixel=[108,366])]}
(ROOT/'preview.json').write_text(json.dumps(preview,indent=2)+'\n')
print('Generated',len(components),'components. Anchor',anchor)
