import fs from 'node:fs';
import * as THREE from '../../../../../.render-tools/node_modules/three/build/three.module.js';
import {FontLoader} from '../../../../../.render-tools/node_modules/three/examples/jsm/loaders/FontLoader.js';
const D=new URL('.',import.meta.url); const read=p=>JSON.parse(fs.readFileSync(new URL(p,D)));
const cam=read('../../camera-contract.json'), view=read('view.json'), base=read('../west-civic/base.json');
const C=[];const V=cam.vertical_pixels_per_world_unit;
function xyz(u,v,y){const a=(u-470.5)/30,b=(v-260+V*y)/16.35;return [(a+b)/2,y,(b-a)/2];}
function add(id,type,o){C.push({id:'west-shop/'+id,type,...o});}
function box(id,x,y,z,w,h,d,colors){add(id,'box',{position:[x,y,z],size:[w,h,d],colors:Array.isArray(colors)?colors:[colors,colors,colors]});}
function quad(id,vs,color){add(id,'triangles',{vertices:vs,indices:[0,1,2,0,2,3],color});}
function poly(id,pts,y,color){add(id,'polygon',{points:pts.map(([u,v])=>{let [x,_,z]=xyz(u,v,y);return[x,z]}),y,color});}
function line(id,a,b,width,y,color){const [ax,_,az]=xyz(...a,y),[bx,__,bz]=xyz(...b,y),l=Math.hypot(bx-ax,bz-az),nx=-(bz-az)/l*width/2,nz=(bx-ax)/l*width/2;add(id,'polygon',{points:[[ax+nx,az+nz],[bx+nx,bz+nz],[bx-nx,bz-nz],[ax-nx,az-nz]],y,color});}
// Footprint and surfaces are true orthogonal world geometry.
const roof=.75, floor=.055;const [x0,,z0]=xyz(340.5,226.5,.83),w=.82,d=.82,x1=x0+w,z1=z0+d;
poly('parking-asphalt',[[299,272.5],[348,245.8],[397,272.5],[344,297]],.019,'#75758f');
// Discrete parking bay lines, all belonging to the shop lot.
for(let i=0;i<3;i++)line('parking-bay-'+i,[343.5+i*10,278-i*5.45],[356.1+i*10,284.9-i*5.45],.027,.025,'#c2c3d0');
box('wall', (x0+x1)/2,(floor+roof)/2,(z0+z1)/2,w-.05,roof-floor,d-.05,['#e2e5df','#d0d9d8','#e3e8e1']);
box('lower-red-trim',(x0+x1)/2,.088,(z0+z1)/2,w-.035,.075,d-.035,['#df5e5c','#b42421','#ef8583']);
box('roof-red-slab',(x0+x1)/2,roof-.006,(z0+z1)/2,w+.035,.040,d+.035,['#ee302c','#be1812','#d9221d']);
box('roof-charcoal',(x0+x1)/2,roof+.027,(z0+z1)/2,w-.075,.018,d-.075,'#6c7085');
for(const [id,x,z,bw,bd] of [['back',x0,(z0+z1)/2,.055,d+.045],['right',(x0+x1)/2,z0,w+.045,.055],['front',(x0+x1)/2,z1,w+.045,.055],['side',x1,(z0+z1)/2,.055,d+.045]])box('parapet-'+id,x,roof+.035,z,bw,.049,bd,['#fb4540','#d8221c','#e7352e']);
// Right facade two wide turquoise windows, inset white sill surrounds.
for(let j=0;j<2;j++){
 const za=z0+.105+j*.34,zb=za+.285;
 quad('right-window-frame-'+j,[[x1-.022,.26,za-.015],[x1-.022,.26,zb+.015],[x1-.022,.595,zb+.015],[x1-.022,.595,za-.015]],'#e9eeea');
 quad('right-window-'+j,[[x1-.019,.30,za],[x1-.019,.30,zb],[x1-.019,.55,zb],[x1-.019,.55,za]],j?'#29cace':'#2fd2d2');
 quad('right-window-glint-'+j,[[x1-.017,.30,za],[x1-.017,.30,za+.018],[x1-.017,.55,za+.018],[x1-.017,.55,za]],'#93e5df');
}
// Shop front: display window at left, door at right.
const front=z1-.022;
quad('front-display-frame',[[x0+.07,.23,front],[x0+.43,.23,front],[x0+.43,.61,front],[x0+.07,.61,front]],'#f5f6ee');
quad('front-display-glass',[[x0+.105,.32,front+.003],[x0+.4,.32,front+.003],[x0+.4,.58,front+.003],[x0+.105,.58,front+.003]],'#27c6c8');
quad('door-frame',[[x0+.47,.05,front+.002],[x1-.04,.05,front+.002],[x1-.04,.65,front+.002],[x0+.47,.65,front+.002]],'#e4ece5');
quad('door-glass',[[x0+.51,.065,front+.006],[x1-.075,.065,front+.006],[x1-.075,.61,front+.006],[x0+.51,.61,front+.006]],'#20b7b6');
quad('door-low-shade',[[x0+.51,.065,front+.008],[x1-.075,.065,front+.008],[x1-.075,.23,front+.008],[x0+.51,.23,front+.008]],'#21aba8');
box('door-handle',x1-.115,.37,front+.018,.013,.064,.018,'#d3e8da');
// Sloping fabric strips and hanging valance, no image texture.
const aw0=x0+.08,aw1=x1+.10,za=z1+.012,zb=z1+.25,ya=.845,yb=.79,N=13;
for(let i=0;i<N;i++){
 const a=aw0+(aw1-aw0)*i/N,b=aw0+(aw1-aw0)*(i+1)/N,col=i%2?'#f4f1e6':'#e64842';
 quad('awning-slope-'+i,[[a,ya,za],[b,ya,za],[b,yb,zb],[a,yb,zb]],col);
 quad('awning-valance-'+i,[[a,yb,zb],[b,yb,zb],[b,yb-.077,zb],[a,yb-.077,zb]],i%2?'#e9e8dc':'#ca322c');
}
quad('awning-right-end',[[aw1,ya,za],[aw1,yb,zb],[aw1,yb-.077,zb],[aw1,ya-.06,za]],'#b82926');
// Raised shaped sign board on z-positive facade.
const sx=x0+.055,sw=.75,sy=.835,sz=z1-.052;
const profile=[[0,0],[sw,0],[sw,.18],[sw-.08,.205],[sw-.13,.265],[sw*.59,.30],[sw*.29,.30],[.075,.24],[0,.21]];
const sh=new THREE.Shape(profile.map(([a,b])=>new THREE.Vector2(a,b)));const sg=new THREE.ShapeGeometry(sh,8);
function geom(id,g,fn,color){const a=g.attributes.position,vertices=[];for(let i=0;i<a.count;i++)vertices.push(fn(a.getX(i),a.getY(i),a.getZ(i)));add(id,'triangles',{vertices,indices:g.index?Array.from(g.index.array):Array.from({length:a.count},(_,i)=>i),color});}
geom('sign-face',sg,(a,b)=>[sx+a,sy+b,sz+.04],'#ef6962');
for(let i=0;i<profile.length;i++){const a=profile[i],b=profile[(i+1)%profile.length];quad('sign-edge-'+i,[[sx+a[0],sy+a[1],sz],[sx+b[0],sy+b[1],sz],[sx+b[0],sy+b[1],sz+.04],[sx+a[0],sy+a[1],sz+.04]],'#c82723');}
const font=new FontLoader().parse(read('../../../../../.render-tools/node_modules/three/examples/fonts/helvetiker_bold.typeface.json'));
const tg=new THREE.ShapeGeometry(font.generateShapes('SHOP',1),5);tg.computeBoundingBox();const bb=tg.boundingBox,tw=bb.max.x-bb.min.x,th=bb.max.y-bb.min.y;
geom('sign-SHOP',tg,(a,b)=>[sx+.075+(a-bb.min.x)/tw*.61,sy+.065+(b-bb.min.y)/th*.145,sz+.043],'#fff8e6');
const part={node:'west-shop',camera_contract_sha256:view.camera_contract_sha256,components:C,children:[],child_refs:[]};
fs.writeFileSync(new URL('candidate.json',D),JSON.stringify(part,null,2));
fs.writeFileSync(new URL('preview.json',D),JSON.stringify({...part,components:[...base.components,...C]},null,2));
console.log(JSON.stringify({components:C.length,footprint:{x0,z0,x1,z1}}));
