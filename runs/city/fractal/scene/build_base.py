import json,math
from pathlib import Path
ROOT=Path(__file__).resolve().parent
W,H=941,520
S=30
B=16.35
E=math.asin(B/S)
V=S*math.sqrt(2)*math.cos(E)
# x=(u/30+v/15)/2, z=(-u/30+v/15)/2 at y=0.
def world(u,v,y=0):
    u-=W/2;v-=H/2;v+=V*y
    return [(u/S+v/B)/2,y,(-u/S+v/B)/2]
def ground(u,v,y=0):
    x,_,z=world(u,v,y);return [x,z]
G=[]
def poly(id,points,color,y=.001):
    G.append(dict(id='scene/'+id,type='polygon',points=[ground(*p,y) for p in points],y=y,color=color))
def line(id,points,width,color,y):
    # Offset polyline in world ground coordinates, joined with a miter.
    p=[ground(*a,y) for a in points];norm=[]
    for a,b in zip(p,p[1:]):
        dx,dz=b[0]-a[0],b[1]-a[1];l=math.hypot(dx,dz);norm.append((-dz/l,dx/l))
    left=[];right=[]
    for i,a in enumerate(p):
        n=norm[max(0,i-1)];m=norm[min(i,len(norm)-1)];mx,mz=n[0]+m[0],n[1]+m[1];den=mx*n[0]+mz*n[1]
        off=[width/2*mx/den,width/2*mz/den]
        left.append([a[0]+off[0],a[1]+off[1]]);right.append([a[0]-off[0],a[1]-off[1]])
    G.append(dict(id='scene/'+id,type='polygon',points=left+right[::-1],y=y,color=color))
def dash(id,a,b,width,color,y):line(id,[a,b],width,color,y)
# White surroundings and stepped grass platform; no reference textures.
poly('ground',[(-180,272),(293,16),(394,70),(446,42),(1040,365),(941,466),(832,520),(160,520),(-140,371)],'#8fd35c',-.025)
# Muted checkerboard follows the same world grid, clipped to visible ground by omission at upper edge.
for ix in range(-13,18):
 for iz in range(-12,18):
  x,z=ix*1.6,iz*1.6
  u=W/2+S*(x-z);v=H/2+B*(x+z)
  corners=[(W/2+S*(xx-zz),H/2+B*(xx+zz)) for xx,zz in [(x,z),(x+1.6,z),(x+1.6,z+1.6),(x,z+1.6)]]
  if v>395 and -20<u<965 and all(uu>2*(vv-440) and vv<936.5-.5*uu for uu,vv in corners):
   color=['#8ed15a','#90d45e','#8ed35c','#91d55f'][(ix*3+iz*7)%4]
   G.append(dict(id=f'scene/tile-{ix}-{iz}',type='polygon',points=[[x,-0+z],[x+1.6,z],[x+1.6,z+1.6],[x,z+1.6]],y=-.024,color=color))
# Long road runs and branching connections, specified by ground-projected landmarks.
roads=[
 ('back',[(-43,275),(282,98),(305,98),(475,190),(498,190),(540,168),(557,168),(792,295),(792,307),(709,352)]),
 ('middle',[(63,322),(338,173),(353,173),(387,191),(405,191),(430,177)]),
 ('front',[(-38,269),(55,320),(55,333),(126,372),(141,372)]),
 ('park-edge',[(64,410),(281,302),(300,302),(536,420),(553,420),(691,345),(709,345),(827,410)]),
]
for name,p in roads:line(name+'-pavement',p,1.65,'#e9ebe5',.002)
for name,p in roads:line(name+'-asphalt',p,1.33,'#8ec8e3',.004)
for name,p in roads:line(name+'-centerline',p,.058,'#fff0ac',.008)
# Road lane dashes offset to both sides in world space, then projected back to pixels.
for name,p in roads:
 for j,(a,b) in enumerate(zip(p,p[1:])):
  wa,wb=ground(*a),ground(*b);dx,dz=wb[0]-wa[0],wb[1]-wa[1];L=math.hypot(dx,dz)
  if L<.7:continue
  tx,tz=dx/L,dz/L;nx,nz=-tz,tx
  count=int(L/.80)
  for k in range(count):
   t=(k+.5)*L/count
   for side in [-1,1]:
    verts=[]
    for along,cross in [(-.11,-.026),(.11,-.026),(.11,.026),(-.11,.026)]:
     verts.append([wa[0]+tx*(t+along)+nx*(side*.45+cross),wa[1]+tz*(t+along)+nz*(side*.45+cross)])
    G.append(dict(id=f'scene/{name}-dash-{j}-{k}-{side}',type='polygon',points=verts,y=.009,color='#fffdf1'))
# Zebra crossings: parallel small rectangles across each road.
for ci,(a,b) in enumerate([((316,117),(343,102)),((48,301),(77,317)),((249,321),(275,335)),((367,343),(394,329)),((743,278),(770,263)),((726,371),(753,357))]):
 wa,wb=ground(*a),ground(*b);dx,dz=wb[0]-wa[0],wb[1]-wa[1];L=math.hypot(dx,dz);tx,tz=dx/L,dz/L;nx,nz=-tz,tx
 for k in range(8):
  t=(k+.5)*L/8
  pts=[[wa[0]+tx*(t+aa)+nx*bb,wa[1]+tz*(t+aa)+nz*bb] for aa,bb in [(-.028,-.50),(.028,-.50),(.028,.50),(-.028,.50)]]
  G.append(dict(id=f'scene/crossing-{ci}-{k}',type='polygon',points=pts,y=.012,color='#ffffff'))
cam=dict(schema='city-full.camera.v1',locked=False,projection='orthographic',resolution=[W,H],world_axes={'x':'image down-right','y':'height image up','z':'image down-left'},reference_origin_px=[W/2,H/2],basis_u_px=[30,B],basis_v_px=[-30,B],pixels_per_world_unit=30*math.sqrt(2),vertical_pixels_per_world_unit=V,elevation_degrees=math.degrees(E),azimuth_degrees=45,target=[0,0,0],position=[30*math.cos(E)/math.sqrt(2),30*math.sin(E),30*math.cos(E)/math.sqrt(2)],up=[0,1,0],left=-W/(60*math.sqrt(2)),right=W/(60*math.sqrt(2)),top=H/(60*math.sqrt(2)),bottom=-H/(60*math.sqrt(2)),near=.1,far=200,render={'background':'#ffffff'})
(ROOT/'camera-candidate.json').write_text(json.dumps(cam,indent=2)+'\n')
(ROOT/'base.json').write_text(json.dumps({'node':'scene','components':G,'children':[]},indent=2)+'\n')
print('base primitives',len(G))
