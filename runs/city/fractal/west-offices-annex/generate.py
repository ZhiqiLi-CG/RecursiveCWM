import json, math
from pathlib import Path
P=Path(__file__).resolve().parent
V=35.5718287412947
view=json.loads((P/'view.json').read_text())
G=[]
def box(name,pos,size,colors):
 g=dict(id='west-offices-annex/'+name,type='box',position=pos,size=size)
 g['colors' if isinstance(colors,list) else 'color']=colors
 G.append(g)
def poly(name,vertices,color):
 G.append(dict(id='west-offices-annex/'+name,type='triangles',vertices=vertices,indices=sum(([0,i,i+1] for i in range(1,len(vertices)-1)),[]),color=color))
def world(u,v,y):
 a=(u-470.5)/30;b=(v-260+V*y)/16.35
 return (a+b)/2,(b-a)/2
x1,z1=world(21.5,284.5,.05)
x0=x1-.74; z0=z1-.43
xt=x1-.5
# A real extruded cross section: narrow upper storey and inclined lower frontage.
profile=[(x0,.05),(x1,.05),(x1,.27),(xt,.78),(xt,1.005),(x0,1.005)]
poly('side-wall',[[x,y,z1] for x,y in profile],'#aeada7')
poly('back-wall',[[x,y,z0] for x,y in reversed(profile)],'#b9b8b0')
for i in range(1,5):
 a,b=profile[i],profile[(i+1)%len(profile)]
 poly('front-profile-'+str(i),[[a[0],a[1],z0],[a[0],a[1],z1],[b[0],b[1],z1],[b[0],b[1],z0]],'#cbc9bf' if i<4 else '#b9bcb2')
# Roof tray, raised four-sided parapet and darker interior rim.
body_z0=z0
x0-=.079
z0-=.158
box('roof-bed',[(x0+xt)/2,1.017,(z0+z1)/2],[xt-x0,.024,z1-z0],['#49495e','#a6aaa1','#929b94'])
for name,x,z,w,d in [('front',xt,z0+(z1-z0)/2,.052,z1-z0+.07),('rear',x0,(z0+z1)/2,.052,z1-z0+.07),('left',(x0+xt)/2,z1,xt-x0,.052),('right',(x0+xt)/2,z0,xt-x0,.052)]:
 box('parapet-'+name,[x,1.055,z],[w,.092,d],['#d2d6c8','#a5aea5','#959f98'])
box('roof-inner-shade',[(x0+xt)/2,1.031,z0+.04],[xt-x0-.06,.008,.025],'#3f4258')
z0=body_z0
# Two small pale windows attached to the upper x-facing wall.
for i,z in enumerate([z1-.065,z1-.335]):
 box(f'window-{i}-frame',[xt+.006,.87,z],[.014,.142,.13],'#c6d0cc')
 box(f'window-{i}-glass',[xt+.016,.881,z],[.01,.098,.105],'#c3cdd0')
 box(f'window-{i}-warm',[xt+.025,.902,z-.02],[.008,.065,.058],'#ceb3af')
 box(f'window-{i}-sill',[xt+.027,.805,z],[.043,.025,.146],'#e2e6e0')
# Shallow recessed service opening with light jambs at the foot of the frontage.
box('door-shadow',[x1+.007,.1325,z0+.135],[.014,.165,.052],'#777c7b')
box('door-jamb',[x1+.02,.1295,z0+.096],[.03,.159,.021],'#d4d3c7')
box('low-panel',[x1+.009,.103,z1-.16],[.015,.106,.19],'#d9d8ce')
box('foot-pier',[x1+.023,.14,z1-.01],[.046,.18,.037],['#cbcbbf','#cecec1','#b5b7ad'])
part=dict(node='west-offices-annex',camera_contract_sha256=view['camera_contract_sha256'],components=G,children=[],child_refs=[])
(P/'candidate.json').write_text(json.dumps(part,indent=2)+'\n')
parent=json.loads((P/'parent-context.json').read_text())
parent['components']+=G
(P/'preview.json').write_text(json.dumps(parent,indent=2)+'\n')
print('generated',len(G),'components; corner',x1,z1)
