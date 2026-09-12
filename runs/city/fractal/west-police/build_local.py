import json, math, hashlib
from pathlib import Path
D=Path(__file__).resolve().parent
C=[]
V=35.5718287412947
sha=hashlib.sha256((D/'../../camera-contract.json').read_bytes()).hexdigest()
def xyz(u,v,y=0):
 a=(u-470.5)/30; b=(v-260+V*y)/16.35
 return [(a+b)/2,y,(b-a)/2]
def add(name,typ,**kw): C.append(dict(id='west-police/'+name,type=typ,**kw))
def box(n,x0,x1,z0,z1,y0,y1,colors):
 add(n,'box',position=[(x0+x1)/2,(y0+y1)/2,(z0+z1)/2],size=[x1-x0,y1-y0,z1-z0],colors=colors if isinstance(colors,list) else [colors]*3)
def poly(n,points,y,col):add(n,'polygon',points=points,y=y,color=col)
def screenpoly(n,pts,y,col):poly(n,[[xyz(u,v,y)[0],xyz(u,v,y)[2]] for u,v in pts],y,col)
# Own paved plaza: cropped north edge remains inside the civic/house land boundary.
screenpoly('plaza',[(89.5,324),(140.5,294.5),(190,266),(198.5,270),(240.5,291.5),(140,347.5)],.015,'#7b7a96')
screenpoly('plaza-north-tone',[(163,283),(190,268),(230,289.8),(220,295),(184,276)],.017,'#777791')
# Main building ground-front corner and world-aligned footprint.
x1,_,z1=xyz(153.5,337.5,.03); x0=x1-1.05; z0=z1-.77
blue=['#4640b4','#2d287f','#38319d']; cream=['#f0e5a4','#cebd68','#dfd087']
bx0=x0+.20
box('main-body',bx0,x1,z0,z1,.03,.91,blue)
# Lower attached wing toward negative x; its front ends behind main corner.
wx0=bx0-.475; wx1=bx0+.008; wz1=z1+.44; wz0=z0+.08
box('annex-body',wx0,wx1,wz0,wz1,.03,.83,['#433ca8','#2e2985','#3935a5'])
box('annex-roof',wx0-.025,wx1,wz0-.02,wz1+.025,.83,.89,cream)
box('annex-roof-inset',wx0+.02,wx1,wz0+.02,wz1-.02,.8901,.90,'#4646bd')
for n,a,b,c,d in [('left',wx0-.025,wx0+.018,wz0-.02,wz1+.025),('front',wx0-.025,wx1,wz1-.02,wz1+.025),('back',wx0-.025,wx1,wz0-.02,wz0+.02)]:box('annex-parapet-'+n,a,b,c,d,.89,.955,cream)
# Two broad cornices frame the pale second storey.
gx0,gz0=x0,z0
x0+=.05; z0+=.05
box('middle-cornice',x0-.045,x1+.045,z0-.045,z1+.045,.89,.965,cream)
box('upper-storey',x0+.015,x1-.015,z0+.015,z1-.015,.965,1.335,['#7776c7','#9b9bd7','#8988cb'])
box('top-cornice',x0-.045,x1+.045,z0-.045,z1+.045,1.335,1.475,cream)
box('roof-base',x0-.035,x1+.035,z0-.035,z1+.035,1.475,1.615,['#463ca9','#272677','#3a349b'])
box('roof-deck',x0-.02,x1+.02,z0-.02,z1+.02,1.615,1.645,'#5354cb')
for n,a,b,c,d in [('back-x',x0-.05,x0+.005,z0-.05,z1+.05),('back-z',x0-.05,x1+.05,z0-.05,z0+.005),('front-x',x1-.005,x1+.05,z0-.05,z1+.05),('front-z',x0-.05,x1+.05,z1-.005,z1+.05)]:box('roof-rail-'+n,a,b,c,d,1.645,1.725,cream)
# Surface rectangles on visible walls, oriented on world axes.
def face(n,axis,t0,t1,y0,y1,fixed,col):
 if axis=='z':verts=[[t0,y0,fixed],[t1,y0,fixed],[t1,y1,fixed],[t0,y1,fixed]]
 else:verts=[[fixed,y0,t0],[fixed,y0,t1],[fixed,y1,t1],[fixed,y1,t0]]
 add(n,'triangles',vertices=verts,indices=[0,1,2,0,2,3],color=col)
def window(n,axis,a,b,lo,hi,f):
 face(n+'-frame',axis,a,b,lo,hi,f,'#b7b5ed')
 face(n+'-glass',axis,a+.028,b-.028,lo+.028,hi-.018,f+.002,'#9594df')
 face(n+'-sill',axis,a,b,lo,lo+.027,f+.004,'#e1ddf5')
window('main-ground-window','z',bx0+.10,bx0+.56,.42,.84,z1+.004)
window('annex-window','z',wx0+.10,wx0+.37,.28,.70,wz1+.004)
face('entrance-shadow','x',gz0+.10,gz0+.53,.03,.48,x1+.004,'#211f70')
face('entrance-glass','x',gz0+.13,gz0+.49,.04,.47,x1+.008,'#a8a5ed')
face('entrance-mullion','x',gz0+.30,gz0+.322,.04,.47,x1+.01,'#7068c0')
for i in range(4):
 a=x0+.07+i*.245;window('upper-left-'+str(i),'z',a,a+.175,1.055,1.265,z1-.012)
for i in range(3):
 a=z0+.075+i*.225;window('upper-right-'+str(i),'x',a,a+.16,1.055,1.265,x1-.012)
# Gray circular helipad with geometry H lying flat on roof.
cx=(x0+x1)/2-.065;cz=(z0+z1)/2-.035
poly('helipad',[[cx+.25*math.cos(t*math.pi/32),cz+.25*math.sin(t*math.pi/32)] for t in range(64)],1.65,'#727581')
for n,a,b,c,d in [('stem-a',-.14,-.085,-.13,.13),('stem-b',.085,.14,-.13,.13),('cross',-.085,.085,-.03,.03)]:box('helipad-H-'+n,cx+a*.75,cx+b*.75,cz+c*.75,cz+d*.75,1.651,1.655,'#e6e4cb')
# Roof-mounted vertical sign faces x-positive. Letters are strokes, no textures.
signx=x1+.053
face('sign-panel','x',z0-.05,z1+.03,1.645,1.88,signx,'#24267b')
# Coordinates across sign go left-to-right from positive z to negative z.
letters={
 'P':[[(0,0),(0,1),(.65,1),(.9,.85),(.9,.6),(.65,.5),(0,.5)]],
 'O':[[(.2,0),(0,.2),(0,.8),(.2,1),(.7,1),(.9,.8),(.9,.2),(.7,0),(.2,0)]],
 'L':[[(0,1),(0,0),(.85,0)]],
 'I':[[(.15,1),(.75,1)],[(.45,1),(.45,0)],[(.15,0),(.75,0)]],
 'C':[[(.85,.9),(.65,1),(.2,1),(0,.8),(0,.2),(.2,0),(.65,0),(.85,.1)]],
 'E':[[(.85,1),(0,1),(0,0),(.85,0)],[(0,.5),(.7,.5)]]}
def stroke(n,a,b,width):
 dx=b[0]-a[0];dy=b[1]-a[1];l=math.hypot(dx,dy); nx=-dy/l*width/2; ny=dx/l*width/2
 verts=[[signx+.003,y,z] for z,y in [(a[0]+nx,a[1]+ny),(b[0]+nx,b[1]+ny),(b[0]-nx,b[1]-ny),(a[0]-nx,a[1]-ny)]]
 add(n,'triangles',vertices=verts,indices=[0,1,2,0,2,3],color='#f4f1de')
for i,ch in enumerate('POLICE'):
 for j,line in enumerate(letters[ch]):
  pts=[(z1-.005-i*.132-u*.11,1.69+v*.145) for u,v in line]
  for k,(a,b) in enumerate(zip(pts,pts[1:])):stroke(f'sign-letter-{i}-{j}-{k}',a,b,.022)
for g in C:
 if '/upper-' in g['id'] and g['id'].endswith('-glass'):g['color']='#c3c2e6'
 if '/upper-' in g['id'] and g['id'].endswith('-frame'):g['color']='#c7c1bc'
local=dict(node='west-police',camera_contract_sha256=sha,components=C,children=[],child_refs=[])
(D/'local.json').write_text(json.dumps(local,indent=2)+'\n')
base=json.loads((D/'../west-civic/base.json').read_text())
(D/'preview.json').write_text(json.dumps(dict(local,components=base['components']+C),indent=2)+'\n')
print('local components',len(C))
