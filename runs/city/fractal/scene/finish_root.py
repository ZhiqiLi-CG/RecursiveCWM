"""Root continuity and marking refinements; inherited files stay read only."""
import json,math
from pathlib import Path
D=Path(__file__).resolve().parent
spec=json.loads((D/'base-refined.json').read_text());G=spec['components']
C=json.loads((D/'../../camera-contract.json').read_text());V=C['vertical_pixels_per_world_unit']
def ground(u,v,y=0):
 a=(u-470.5)/30;b=(v-260+V*y)/16.35
 return [(a+b)/2,(b-a)/2]
def poly(name,pts,color,y):G.append(dict(id='scene/final/'+name,type='polygon',points=[ground(*p,y) for p in pts],y=y,color=color))
def line(name,p,width,color,y):
 p=[ground(*a,y) for a in p];norm=[]
 for a,b in zip(p,p[1:]):
  dx,dz=b[0]-a[0],b[1]-a[1];l=math.hypot(dx,dz);norm.append((-dz/l,dx/l))
 left=[];right=[]
 for i,a in enumerate(p):
  n=norm[max(0,i-1)];m=norm[min(i,len(norm)-1)];mx,mz=n[0]+m[0],n[1]+m[1];den=mx*n[0]+mz*n[1];ox,oz=width/2*mx/den,width/2*mz/den
  left.append([a[0]+ox,a[1]+oz]);right.append([a[0]-ox,a[1]-oz])
 G.append(dict(id='scene/final/'+name,type='polygon',points=left+right[::-1],y=y,color=color))
roads=[('back',[(-43,275),(282,98),(305,98),(475,190),(498,190),(540,168),(557,168),(792,295),(792,307),(709,352)]),('middle',[(63,322),(338,173),(353,173),(387,191),(405,191),(430,177)]),('front',[(-38,269),(55,320),(55,333),(126,372),(141,372)]),('park-edge',[(64,410),(281,302),(300,302),(536,420),(553,420),(691,345),(709,345),(827,410)])]
# Regenerate only road ribbons, not inherited land or objects.
remove={f'scene/{n}-{s}' for n,_ in roads for s in ['pavement','asphalt','centerline']}
G[:]=[g for g in G if g['id'] not in remove]
for name,p in roads:line(name+'-pavement',p,1.98,'#e9ebe5',.002)
for name,p in roads:line(name+'-asphalt',p,1.48,'#8ec8e3',.004)
for name,p in roads:line(name+'-centerline',p,.10,'#fff0ac',.008)
# Thicken lane dashes in their own tangential and perpendicular directions.
for g in G:
 if '-dash-' in g['id']:
  pts=g['points'];center=[sum(p[i] for p in pts)/4 for i in range(2)];a=[(pts[1][i]-pts[0][i])/2 for i in range(2)];b=[(pts[3][i]-pts[0][i])/2 for i in range(2)]
  g['points']=[[center[i]+sa*a[i]*1.18+sb*b[i]*2.15 for i in range(2)] for sa,sb in [(-1,-1),(1,-1),(1,1),(-1,1)]]
# Extend the subtle ground grid across the entire platform interior.
boundary=[(-180,272),(293,16),(394,70),(446,42),(1040,365),(941,466),(832,520),(160,520),(-140,371)]
def inside(u,v):
 c=False
 for (x1,y1),(x2,y2) in zip(boundary,boundary[1:]+boundary[:1]):
  if (y1>v)!=(y2>v) and u<(x2-x1)*(v-y1)/(y2-y1)+x1:c=not c
 return c
G[:]=[g for g in G if not g['id'].startswith('scene/tile-')]
for ix in range(-18,19):
 for iz in range(-18,19):
  x,z=ix*1.6,iz*1.6
  pts=[[x,z],[x+1.6,z],[x+1.6,z+1.6],[x,z+1.6]]
  pix=[[470.5+30*(a-b),260+16.35*(a+b)] for a,b in pts]
  if all(inside(*p) for p in pix):
   color=['#8ed25b','#90d45e','#8fd35c','#91d55f'][(ix*3+iz*7)%4]
   G.append(dict(id=f'scene/final/tile-{ix}-{iz}',type='polygon',points=pts,y=-.024,color=color))
# Fill the unowned interface between hospital lot and school rear paving.
poly('hospital-school-seam',[(610,285),(642,283),(704,317),(675,334),(650,319),(631,330),(611,315)],'#777590',.006)
poly('hospital-school-inner-gap',[(630,300),(657,300),(671,316),(648,329),(628,316)],'#777590',.005)
poly('hospital-school-front-gap',[(633,322),(650,312),(670,323),(651,334)],'#777590',.006)
poly('hospital-school-curb',[(631,330),(650,319),(675,334),(675,339),(650,324),(635,332)],'#e8e8df',.007)
# Low white underlay closes tiny lawn gaps beside the office block.
poly('office-street-seam',[(0,282),(37,301),(152,239),(152,247),(37,307),(0,289)],'#e9ebe5',.001)
# Junction markings: a compact yellow throat joins the street centerlines;
# blue chamfered lane islands and short transverse white dashes remain visible.
for name,cx,cy,sz in [('southeast',703,348,1),('southwest',113,373,.8),('police',65,323,.8),('north-middle',419,175,.8)]:
 def shape(suffix,pts,color,y):poly(f'junction-{name}-{suffix}',[(cx+x*sz,cy+z*sz) for x,z in pts],color,y)
 shape('clear',[(-39,-5),(-14,-19),(14,-19),(39,-5),(39,5),(14,19),(-14,19),(-39,5)],'#8ec8e3',.0125)
 for k,points in enumerate([[(-40,-22),(40,22)],[(-40,22),(40,-22)]] if name=='southeast' else []):
  line(f'junction-{name}-approach-{k}',[(cx+x*sz,cy+y*sz) for x,y in points],.10,'#fff0ac',.013)
 shape('yellow',[(-31,-2),(-15,-10),(13,-10),(30,-1),(30,3),(14,11),(-14,11),(-31,3)],'#fff0ac',.0131)
 centers=[-25,25] if name=='southeast' else [0]
 for side in centers:
  r=10 if name=='southeast' else 18
  h=10 if name=='southeast' else 14
  shape('island-'+str(side),[(side-r,-h*.5),(side,-h),(side+r,-h*.5),(side+r,h*.5),(side,h),(side-r,h*.5)],'#8ec8e3',.014)
  shape('dash-'+str(side),[(side-1.7,-4),(side+1.7,-4),(side+1.7,4),(side-1.7,4)],'#fffdf1',.015)
# Green visible slab edge at lower-right, preserving the platform top silhouette.
poly('platform-right-edge',[(941,458),(832,513),(818,520),(832,520),(941,466)],'#669c35',-.023)
spec['revision']='root-integrated-continuity-v3'
(D/'root-final.json').write_text(json.dumps(spec,indent=2)+'\n')
print('root components',len(G))
