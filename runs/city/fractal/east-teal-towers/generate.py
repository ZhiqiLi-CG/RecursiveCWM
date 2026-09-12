import json, math, pathlib, hashlib
P=pathlib.Path(__file__).resolve().parent
CAM=P.parent.parent/'camera-contract.json'
SHA=hashlib.sha256(CAM.read_bytes()).hexdigest()
V=json.loads(CAM.read_text())['vertical_pixels_per_world_unit']
G=[]
def world(u,v,y=0):
 a=(u-470.5)/30;b=(v-260+V*y)/16.35
 return [(a+b)/2,y,(b-a)/2]
def add(name,typ,**kw):G.append(dict(id='east-teal-towers/'+name,type=typ,**kw))
def box(name,x,y,z,w,h,d,colors):add(name,'box',position=[x,y,z],size=[w,h,d],colors=colors)
def ground(name,pts,y,col):add(name,'polygon',points=[[world(u,v,y)[i] for i in [0,2]] for u,v in pts],y=y,color=col)
ground('paving',[(699,214),(786,155),(941,239),(941,254),(854,297)],.012,'#777593')
for k,(u,v) in enumerate([(767.5,232),(818.5,257.5),(869.5,284)]):
 pre=f'tower-{k+1}';w=1.02;d=.77
 xf,_,zf=world(u,v,.025);x=xf-w/2;z=zf-d/2
 box(pre+'/body',x,1.22,z,w,2.39,d,['#60b8a3','#579c81','#49c9bd'])
 # Six overhanging floor trays, each with dark continuous recessed spandrel.
 for j in range(6):
  y=.865+j*.273
  box(pre+f'/band-{j}',x,y+.053,z,w+.004,.092,d+.004,['#748f78','#527b68','#74977b'])
  box(pre+f'/slab-{j}',x,y,z,w+.16,.075,d+.13,['#52d6c8','#40bdae','#40cbbd'])
 # Flat roof basin and four raised bright parapets, all actual 3-D parts.
 ry=2.54;rw=w+.10;rd=d+.07;t=.065
 box(pre+'/roof-deck',x,ry-.115,z,rw,.065,rd,['#3b4431','#558c77','#82aa8e'])
 for name,dx,dz,ww,dd in [('back',0,-rd/2+t/2,rw,t),('front',0,rd/2-t/2,rw,t),('left',-rw/2+t/2,0,t,rd),('right',rw/2-t/2,0,t,rd)]:
  box(pre+'/roof-rim-'+name,x+dx,ry-.004,z+dz,ww,.115,dd,['#55d7c9','#303c31' if name=='left' else '#47b9aa','#303c31' if name=='back' else '#68d6c3'])
 # Roof lip, spandrel trim, and white ground-floor windows / entrance.
 box(pre+'/roof-front-trim',x,ry-.102,z+rd/2+.005,rw,.025,.012,['#a6d6c1']*3)
 for j,dx in enumerate([-.30,-.02,.26]):
  box(pre+f'/window-{j}',x+dx,.665,z+d/2+.012,.16,.19,.017,['#f6f9ef']*3)
 box(pre+'/door-frame',x,.224,z+d/2+.015,.40,.40,.018,['#bce4d6']*3)
 box(pre+'/door',x+.024,.223,z+d/2+.029,.326,.397,.014,['#ffffff']*3)
for k,(u,v) in enumerate([(723.4,226.1),(774.2,252.1),(825.5,278.2)]):
 x,_,z=world(u,v-.6,.025);pre=f'tree-{k+1}'
 add(pre+'/trunk','cylinder',position=[x,.235,z],radius=.061,height=.44,segments=12,color='#946337')
 # Layered conical frusta with separately colored top caps.
 for j,(r,yy,hh) in enumerate([(.337,.56,.225),(.267,.765,.18),(.203,.91,.13),(.149,1.0,.08)]):
  add(pre+f'/tier-{j}','cylinder',position=[x,yy,z],radius=r,radiusTop=r*.96,height=hh,segments=48,color='#71891b')
  add(pre+f'/tier-top-{j}','cylinder',position=[x,yy+hh/2+.002,z],radius=r*.96,height=.009,segments=48,color='#a3bf31')
owned=dict(node='east-teal-towers',camera_contract_sha256=SHA,components=G,children=[])
(P/'owned.json').write_text(json.dumps(owned,indent=2)+'\n')
ctx=json.loads((P.parent/'east-district/context.json').read_text())['components']
(P/'preview.json').write_text(json.dumps(dict(owned,components=ctx+G),indent=2)+'\n')
print(f'{len(G)} owned components')
