"""School solids in root world coordinates, inherited orthographic camera."""
import json, math, hashlib
from pathlib import Path
from PIL import Image, ImageDraw
P=Path(__file__).resolve().parent
NODE='school-main-building'
V=35.5718287412947
C=[]
def xyz(u,v,y):
    a=(u-470.5)/30; b=(v-260+V*y)/16.35
    return [(a+b)/2,y,(b-a)/2]
def local(s,t,y):return xyz(404+s/6,198+t/6,y)
def footprint(points,y):return [[q[0],q[2]] for q in [local(s,t,y) for s,t in points]]
def add(name,**kw):C.append(dict(id=NODE+'/'+name,**kw))
def poly(name,pts,y,color):add(name,type='polygon',points=pts,y=y,color=color)
def quad(name,vs,color):add(name,type='triangles',vertices=vs,indices=[0,1,2,0,2,3],color=color)
def inset(pts,d):
    area=sum(a[0]*b[1]-b[0]*a[1] for a,b in zip(pts,pts[1:]+pts[:1])); sign=1 if area>0 else -1
    edges=[]
    for a,b in zip(pts,pts[1:]+pts[:1]):
        dx,dz=b[0]-a[0],b[1]-a[1]; L=math.hypot(dx,dz)
        edges.append(([a[0]-sign*dz/L*d,a[1]+sign*dx/L*d],[dx,dz]))
    out=[]
    for i,(b,v) in enumerate(edges):
        a,u=edges[i-1]; cross=u[0]*v[1]-u[1]*v[0]
        t=((b[0]-a[0])*v[1]-(b[1]-a[1])*v[0])/cross
        out.append([a[0]+t*u[0],a[1]+t*u[1]])
    return out

def solid(name,pts,bottom,top,colors):
    poly(name+'-top',pts,top,colors[0])
    for i,(a,b) in enumerate(zip(pts,pts[1:]+pts[:1])):
        # x+ side is the pale right face; z+ side the ochre left face.
        col=colors[1] if abs(b[1]-a[1])>abs(b[0]-a[0]) else colors[2]
        quad(name+f'-side-{i}',[[a[0],bottom,a[1]],[b[0],bottom,b[1]],[b[0],top,b[1]],[a[0],top,a[1]]],col)

def rim(name,pts,y,width,thick):
    solid(name+'-fascia',pts,y-thick,y,['#f5ecd5','#c88753','#d68f58'])
    # The fascia is hollow: its full top would occlude the recessed roof.
    C[:]=[g for g in C if g['id'] != NODE+'/'+name+'-fascia-top']
    inner=inset(pts,width)
    # deck is recessed behind a narrow, raised parapet
    for i,(a,b,c,d) in enumerate(zip(pts,pts[1:]+pts[:1],inner[1:]+inner[:1],inner)):
        quad(name+f'-outer-{i}',[[a[0],y,a[1]],[b[0],y,b[1]],[b[0],y+.026,b[1]],[a[0],y+.026,a[1]]],'#e0bd96')
        quad(name+f'-cap-{i}',[[a[0],y+.026,a[1]],[b[0],y+.026,b[1]],[c[0],y+.026,c[1]],[d[0],y+.026,d[1]]],'#f5ead1')
        quad(name+f'-inner-{i}',[[d[0],y+.026,d[1]],[c[0],y+.026,c[1]],[c[0],y-.045,c[1]],[d[0],y-.045,d[1]]],'#b67e4d')
    poly(name+'-recess',inner,y-.044,'#6a6055')

def face_feature(name,a,b,t0,t1,y0,y1,col,depth=.004):
    dx,dz=b[0]-a[0],b[1]-a[1]; L=math.hypot(dx,dz)
    # contour winding positive, outside lies on right
    nx,nz=dz/L,-dx/L
    def pt(t,y):return [a[0]+t*dx+nx*depth,y,a[1]+t*dz+nz*depth]
    quad(name,[pt(t0,y0),pt(t1,y0),pt(t1,y1),pt(t0,y1)],col)

def window(name,pts,edge,t0,t1,y0,y1):
    a,b=pts[edge],pts[(edge+1)%len(pts)]
    face_feature(name+'-surround',a,b,t0-.022,t1+.022,y0-.038,y1+.035,'#f5e7cf',.005)
    face_feature(name+'-reveal',a,b,t0-.006,t1+.006,y0-.006,y1+.009,'#b4c2ac',.007)
    face_feature(name+'-glass',a,b,t0,t1,y0,y1,'#02d4d1',.01)
    face_feature(name+'-jamb',a,b,t0-.022,t0+.006,y0-.006,y1+.026,'#e9d8bb',.012)

roof=footprint([(160,127),(303,49),(630,227),(438,332),(314,265),(359,240)],1.60)
body=inset(roof,.065)
solid('lower-body',body,.045,.875,['#e5bc9b','#e6c4af','#dfac89'])
solid('floor-belt',inset(roof,-.017),.835,.890,['#f4e5cd','#be814f','#ce8a53'])
solid('floor-cap',inset(roof,-.025),.890,.923,['#f8edda','#eee0c9','#efe0c5'])
solid('upper-body',body,.923,1.54,['#e6be9e','#e5c5b0','#dfad88'])
rim('main-roof',roof,1.60,.068,.075)
# Upper facade windows: two at left, one wide on forward bay, two on right.
window('upper-left-a',body,5,.61,.79,1.115,1.425)
window('upper-left-b',body,5,.28,.46,1.115,1.425)
window('upper-front',body,3,.14,.86,1.045,1.40)
window('upper-right-a',body,2,.14,.32,1.045,1.40)
window('upper-right-b',body,2,.53,.71,1.045,1.40)
window('lower-left',body,5,.40,.66,.36,.65)
window('lower-right',body,2,.30,.76,.34,.68)
# Entry opens on the front bay beneath the middle cornice.
a,b=body[3],body[4]
face_feature('door-frame',a,b,.54,.96,.046,.57,'#eadcc9',.009)
face_feature('door-glass',a,b,.58,.92,.05,.53,'#c8dcf0',.013)
face_feature('door-center',a,b,.745,.767,.05,.53,'#e6ebed',.015)
# Low wing, partly hidden behind main building.
wing=footprint([(28,292),(166,217),(258,267),(120,342)],.94)
wingbody=inset(wing,.061)
solid('wing-body',wingbody,.045,.89,['#e7c5aa','#e7c5b1','#dfae8b'])
rim('wing-roof',wing,.94,.055,.078)
# High back parapet on the low wing, visible to the left of the main wall.
a,b=wing[0],wing[1]
dx,dz=b[0]-a[0],b[1]-a[1]; length=math.hypot(dx,dz)
nx,nz=-dz/length*.045,dx/length*.045
parapet=[a,b,[b[0]+nx,b[1]+nz],[a[0]+nx,a[1]+nz]]
solid('wing-back-parapet',parapet,.94,1.105,['#f6ead3','#ba8657','#c08955'])
window('wing-left',wingbody,3,.19,.58,.29,.60)
window('wing-right',wingbody,2,.57,.80,.28,.58)
# Narrow ivory corner quoin keeps the wing silhouette legible.
for edge,t in [(2,.975),(3,.0)]:
    a,b=wingbody[edge],wingbody[(edge+1)%4]
    face_feature('wing-corner-'+str(edge),a,b,max(0,t-.023),min(1,t+.023),.047,.865,'#efe1c8',.008)

own=dict(node=NODE,camera_contract_sha256=json.loads((P/'view.json').read_text())['camera_contract_sha256'],components=C,children=[])
(P/'own.json').write_text(json.dumps(own,indent=2)+'\n')
child_path=P/'../school-sign/part.json'
child=json.loads(child_path.read_text())
assert child['node']=='school-sign'
assert child['camera_contract_sha256']==own['camera_contract_sha256']
assert all(g['id'].startswith('school-sign/') for g in child['components'])
assert len({g['id'] for g in child['components']})==len(child['components'])
# Flatten once, preserving provenance while satisfying this node's ID namespace.
integrated=C+[{**g,'id':NODE+'/'+g['id']} for g in child['components']]
assembly={**own,'components':integrated,'children':['school-sign'],
          'child_refs':[{'node':'school-sign','path':'../school-sign/part.json',
                         'sha256':hashlib.sha256(child_path.read_bytes()).hexdigest(),
                         'included_in_components':True,'id_prefix':NODE+'/'}],
          'generator':'generate.py','account':'account.md',
          'evidence':['final-compare.png','final.png','final.render.json','validation.json']}
(P/'assembly.json').write_text(json.dumps(assembly,indent=2)+'\n')
context=json.loads((P/'parent-context.json').read_text())
(P/'preview.json').write_text(json.dumps({**assembly,'components':context['components']+integrated},indent=2)+'\n')
print('own components',len(C),'child components',len(child['components']),'assembled',len(integrated))
