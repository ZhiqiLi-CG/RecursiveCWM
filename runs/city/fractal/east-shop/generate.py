import json, math
from pathlib import Path
P=Path(__file__).resolve().parent
C=json.loads((P/'../../camera-contract.json').read_text()); SHA=json.loads((P/'view.json').read_text())['camera_contract_sha256']
g=[]
def world(u,v,y):
    u=355+u/4; v=38+v/4
    a=(u-470.5)/30; b=(v-260+C['vertical_pixels_per_world_unit']*y)/16.35
    return [(a+b)/2,y,(b-a)/2]
def box(n,p,s,c):
    q=dict(id='east-shop/'+n,type='box',position=p,size=s)
    q['colors' if isinstance(c,list) else 'color']=c;g.append(q)
def face(n,vs,c):
    g.append(dict(id='east-shop/'+n,type='triangles',vertices=vs,indices=[j for i in range(1,len(vs)-1) for j in (0,i,i+1)],color=c))
def poly(n,pts,y,c):
    g.append(dict(id='east-shop/'+n,type='polygon',points=[[world(u,v,y)[i] for i in (0,2)] for u,v in pts],y=y,color=c))
# Parking apron stops at the adjoining residential parcel, before the public sidewalk.
poly('parking-apron',[(-35,212),(137,118),(309,198),(247,232),(250,273),(163,320)],.025,'#75758f')
for i,(a,b) in enumerate([((157,241),(210,270)),((196,220),(246,247)),((234,198),(274,220))]):
    dx=b[0]-a[0];dy=b[1]-a[1];ll=math.hypot(dx,dy);nx=-dy/ll*1.7;ny=dx/ll*1.7
    poly('parking-line-'+str(i),[(a[0]+nx,a[1]+ny),(b[0]+nx,b[1]+ny),(b[0]-nx,b[1]-ny),(a[0]-nx,a[1]-ny)],.028,'#c9ced8')
x1,_,z1=world(147,246,.04);w=.77;d=.80;x0=x1-w;z0=z1-d
box('body',[(x0+x1)/2,.385,(z0+z1)/2],[w,.69,d],['#e3e6de','#d3dfd9','#edf0e9'])
box('front-red-plinth',[(x0+x1)/2,.052,z1+.004],[w,.045,.018],'#ed575b')
box('side-red-plinth',[x1+.004,.052,(z0+z1)/2],[.018,.045,d],'#b92227')
# Right side glazing with white frames; two panels split by a masonry mullion.
for i,(za,zb) in enumerate([(z0+.08,z0+.39),(z0+.43,z1-.09)]):
    box('side-frame-'+str(i),[x1+.006,.355,(za+zb)/2],[.016,.275,zb-za+.055],'#f1f2e8')
    box('side-glass-'+str(i),[x1+.016,.366,(za+zb)/2],[.008,.214,zb-za],'#29d2d0')
    box('side-glass-highlight-'+str(i),[x1+.022,.366,za+.016],[.006,.214,.022],'#53dbd4')
# Front display window and recessed full-height door.
box('front-window-frame',[x0+.245,.365,z1+.009],[.365,.31,.022],'#ffffff')
box('front-window',[x0+.245,.383,z1+.023],[.30,.24,.01],'#27cecb')
box('door-shadow',[x1-.13,.258,z1+.009],[.24,.43,.024],'#159e9e')
box('door-glass',[x1-.13,.267,z1+.026],[.208,.416,.014],'#27d5ce')
box('door-post',[x1-.011,.27,z1+.043],[.047,.49,.045],'#eff0e6')
box('door-left-post',[x1-.268,.25,z1+.035],[.034,.43,.024],'#f1f4ec')
box('door-handle',[x1-.059,.28,z1+.04],[.012,.072,.013],'#b3f1e6')
# Roof slab and raised red parapet, with a darker inner edge.
box('roof-slab',[(x0+x1)/2,.757,(z0+z1)/2],[w+.075,.058,d+.075],['#ef393b','#b3131a','#eb4a4b'])
box('roof-inset',[(x0+x1)/2,.791,(z0+z1)/2],[w-.045,.015,d-.045],'#70748b')
for n,xc,zc,ww,dd in [('back', (x0+x1)/2,z0-.017,w+.09,.055),('front',(x0+x1)/2,z1+.017,w+.09,.055),('left',x0-.018,(z0+z1)/2,.055,d+.08),('right',x1+.018,(z0+z1)/2,.055,d+.08)]:
    box('parapet-'+n,[xc,.804,zc],[ww,.054,dd],['#ff494a','#c51c23','#ed373b'])
# Raised front sign as an extruded arched silhouette in the facade plane.
outline=[(0,.805),(w,.805),(w,1.015),(w-.075,1.03),(w-.16,1.115),(w-.28,1.14),(.22,1.14),(.13,1.105),(.055,1.075),(0,1.075)]
face('sign-face',[[x0+a,y,z1+.052] for a,y in outline],'#f27373')
for i,((a,y),(b,yy)) in enumerate(zip(outline,outline[1:]+outline[:1])):
    face('sign-rim-'+str(i),[[x0+a,y,z1+.052],[x0+b,yy,z1+.052],[x0+b,yy,z1+.018],[x0+a,y,z1+.018]],'#b8222a')
# Geometry-only 5x7 SHOP lettering, mounted on the front sign.
letters={'S':['01111','11000','11000','01110','00011','00011','11110'],'H':['11011','11011','11011','11111','11011','11011','11011'],'O':['01110','11011','11011','11011','11011','11011','01110'],'P':['11110','11011','11011','11110','11000','11000','11000']}
unit=.022
for k,ch in enumerate('SHOP'):
    for row,bits in enumerate(letters[ch]):
        for col,bit in enumerate(bits):
            if bit=='1':box(f'letter-{k}-{row}-{col}',[x0+.075+k*.16+col*unit,1.048-row*.026,z1+.058],[unit*.95,.025,.008],'#fff5e9')
# Sloping canvas: alternating bands along x; a hanging valance at the outer lip.
for i in range(15):
    xa=x0-.045+(w+.09)*i/15;xb=x0-.045+(w+.09)*(i+1)/15
    col='#f5f4e8' if i%2 else '#ee5354'
    face('canopy-slope-'+str(i),[[xa,.775,z1+.02],[xb,.775,z1+.02],[xb,.58,z1+.20],[xa,.58,z1+.20]],col)
    face('canopy-valance-'+str(i),[[xa,.58,z1+.20],[xb,.58,z1+.20],[xb,.535,z1+.205],[xa,.535,z1+.205]],'#df494b' if i%2==0 else '#e9eee5')
face('canopy-right-side',[[x1+.045,.775,z1+.02],[x1+.045,.58,z1+.20],[x1+.045,.535,z1+.205],[x1+.045,.68,z1+.066]],'#c92d33')
# Refine sign proportions and roof height after equal-scale round0 inspection.
for q in g:
    n=q['id'].split('/',1)[1]
    if n.startswith('sign-'):
        for v in q['vertices']:
            v[0] += .08
            v[1] -= .04
    elif n.startswith('letter-'):
        q['position'][0] = x0+.08+(q['position'][0]-x0)*.92
        q['position'][1] = .985+(q['position'][1]-1.048)*.84
        q['size'][0] *= .92
        q['size'][1] *= .84
    elif n.startswith('roof-') or n.startswith('parapet-'):
        q['position'][1] -= .035
part=dict(node='east-shop',camera_contract_sha256=SHA,components=g,children=[],child_refs=[])
(P/'candidate.json').write_text(json.dumps(part,indent=2)+'\n')
context=json.loads((P/'../east-district/context.json').read_text())
(P/'preview.json').write_text(json.dumps(dict(camera_contract_sha256=SHA,components=context['components']+g),indent=2)+'\n')
print(len(g),'owned components')
