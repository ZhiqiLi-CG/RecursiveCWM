import json,math
from pathlib import Path
P=Path(__file__).resolve().parent
C=json.load(open(P/'../../camera-contract.json')); V=C['vertical_pixels_per_world_unit']
G=[]; prefix='north-housing-buildings/'
def world(u,v,y):
 a=(u-470.5)/30;b=(v-260+V*y)/16.35
 return ((a+b)/2,(b-a)/2)
def box(id,x,y,z,w,h,d,col):
 g=dict(id=prefix+id,type='box',position=[X+x,y,Z+z],size=[w,h,d]);g['colors' if isinstance(col,list) else 'color']=col;G.append(g)
def face(id,pts,col):
 G.append(dict(id=prefix+id,type='triangles',vertices=[[X+x,y,Z+z]for x,y,z in pts],indices=[j for i in range(1,len(pts)-1) for j in (0,i,i+1)],color=col))
def roofpatch(id,pts,col):
 face(id,pts,col)
 for k in range(len(pts)):
  a=pts[k];b=pts[(k+1)%len(pts)]
  face(id+'-edge'+str(k),[a,b,(b[0],b[1]-.045,b[2]),(a[0],a[1]-.045,a[2])],'#9b2bc0')
for n,(u,v) in enumerate([(78,153.5),(129,128),(180,102.5),(231,77)],1):
 X,Z=world(u,v,.07);q=f'house{n}/'
 box(q+'foundation',-.30,.065,-.40,.65,.065,.85,'#c654df')
 box(q+'walls',-.30,.4125,-.40,.60,.685,.80,['#ebdfa0','#ece3a3','#e2d48c'])
 face(q+'front-wall-upper',[(0,.755,0),(0,.891,0),(0,.891,-.8),(0,.755,-.8)],'#ece3a3')
 # gable closes the z positive and rear walls beneath the roof ridge
 for z in [0,-.80]:face(q+f'gable{z}',[(-.6,.755,z),(0,.755,z),(0,.891,z),(-.30,1.065,z)],'#e2d48c')
 def slope(x):return 1.065-(x+.30)*.58
 # Broad roof plane extends over the front door and porch only on its far half.
 roofpatch(q+'roof-main',[(-.30,1.065,.055),(-.30,1.065,-.88),(.16,slope(.16),-.88),(.16,slope(.16),.055)],'#ce50e7')
 roofpatch(q+'roof-porch',[(.16,slope(.16),-.35),(.16,slope(.16),-.88),(.32,slope(.32),-.88),(.32,slope(.32),-.35)],'#ce50e7')
 roofpatch(q+'roof-back',[(-.30,1.065,.055),(-.66,.693,.055),(-.66,.693,-.88),(-.30,1.065,-.88)],'#bb3ada')
 # Windows on side wall facing positive z.
 for k,x in enumerate([-.46,-.25]):
  box(q+f'side-trim{k}',x,.365,.004,.075,.31,.013,'#ddb0b8')
  box(q+f'side-glass{k}',x+.006,.365,.013,.042,.265,.009,'#aea5cf')
 # Window group on the street-facing positive x wall.
 box(q+'front-trim',.006,.29,-.23,.018,.19,.32,'#e3a6c0')
 for k in range(3):box(q+f'front-glass{k}',.018,.29,-.115-k*.10,.012,.12,.080,'#aaa8d0')
 box(q+'door-trim',.009,.292,-.59,.021,.42,.16,'#e2bdaf')
 box(q+'door',.023,.285,-.585,.013,.38,.103,'#796c80')
 box(q+'door-knob',.033,.29,-.62,.015,.018,.016,'#e9d5ac')
 # Raised purple porch, with two narrow orange posts at its outer edge.
 box(q+'porch',.15,.080,-.665,.33,.035,.36,['#d062e4','#b63dd2','#c353df'])
 for k,z in enumerate([-.495,-.835]):box(q+f'porch-post{k}',.29,.397,z,.021,.60,.021,['#edc78f','#dbad6d','#e9bf85'])
 box(q+'step',.33,.040,-.665,.055,.025,.26,['#c887db','#b26fc5','#c38bd6'])
 # Two dormer bodies rise through the roof slope and have small purple pitched tops.
 for k,z in enumerate([-.18,-.59]):
  face(q+f'dormer{k}-body',[(0,slope(0),z+.11),(0,.997,z+.11),(0,.997,z-.11),(0,slope(0),z-.11)],'#eee2a6')
  for t in [-1,1]:face(q+f'dormer{k}-side{t}',[(-.23,slope(-.23),z+t*.11),(0,slope(0),z+t*.11),(0,.997,z+t*.11),(-.23,1.086,z+t*.11)],'#e2d18a')
  roofpatch(q+f'dormer{k}-roof',[(-.24,1.09,z+.14),(-.24,1.09,z-.14),(.02,.989,z-.14),(.02,.989,z+.14)],'#9623b7')
  box(q+f'dormer{k}-trim',.002,.919,z,.012,.09,.15,'#eab9b7')
  for t in [-1,1]:box(q+f'dormer{k}-glass{t}',.011,.919,z+t*.041,.008,.059,.053,'#c4b8d8')
 box(q+'chimney',-.40,1.105,-.155,.065,.17,.070,['#c9a6cb','#936894','#a57dae'])
 box(q+'chimney-cap',-.40,1.195,-.155,.09,.025,.095,['#c6a0d0','#aa7bb6','#b387bc'])
 box(q+'chimney-hole',-.40,1.211,-.155,.038,.007,.040,'#826686')
sha=json.load(open(P/'view.json'))['camera_contract_sha256']
part=dict(node='north-housing-buildings',camera_contract_sha256=sha,components=G,children=[],child_refs=[])
(P/'candidate.json').write_text(json.dumps(part,indent=2)+'\n')
base=json.load(open(P/'../north-housing/base.json'))
(P/'preview.json').write_text(json.dumps(dict(node='north-housing-buildings-preview',camera_contract_sha256=sha,components=base['components']+G)))
print(len(G),'owned components')
