import {THREE,mat,box} from '../scene/common.js';
const timber='#523018',trim='#987049';
function beam(g,a,b,width,color=timber){let d=b.clone().sub(a),m=box(g,0,0,0,width,d.length(),width,color);m.position.copy(a).addScaledVector(d,.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
function slab(g,points,color,depth=.025){const n=points.length,vs=[];for(const dy of [0,-depth])for(const p of points)vs.push(p.x,p.y+dy,p.z);const ix=[];for(let i=1;i<n-1;i++){ix.push(0,i,i+1,n,n+i+1,n+i);}for(let i=0;i<n;i++){let j=(i+1)%n;ix.push(i,n+i,j,j,n+i,n+j);}let geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vs,3));geo.setIndex(ix);geo.computeVertexNormals();const m=new THREE.Mesh(geo,mat(color,{side:THREE.DoubleSide}));m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function wall(g,a,b,low,high,color){const aa=a.clone().setY(high),bb=b.clone().setY(high);slab(g,[aa,bb,bb.clone().setY(low),aa.clone().setY(low)],color,.026);}
function lerp(a,b,t){return a.clone().lerp(b,t);}
export function build(ctx){const g=new THREE.Group();g.name='east-market-shop';const p=(x,y,h)=>ctx.pixelToWorld(x,y,h),ground=.06;
// Roof landmarks are evaluated at their actual elevation, never used as ground feet.
const lf=p(877,440,.40),rf=p(895,449,.40),lb=p(886,427,.40),rb=p(908,438,.40),af=p(886,435,.83),ab=p(896,422,.83);
const centre=lerp(lerp(lf,rf,.5),lerp(lb,rb,.5),.5);g.userData.groundY=ground;
const inset=v=>lerp(v,centre,.08);const fl=inset(lf),fr=inset(rf),bl=inset(lb),br=inset(rb);
slab(g,[fl.clone().setY(.09),fr.clone().setY(.09),br.clone().setY(.09),bl.clone().setY(.09)],'#675139',.04);
// A shallow front arcade stands before a complete enclosed store room.
const il=lerp(fl,bl,.30),ir=lerp(fr,br,.30);
wall(g,il,ir,.09,.40,'#5d3419');wall(g,il,bl,.09,.40,'#986331');wall(g,bl,br,.09,.40,'#9b6c3c');wall(g,br,ir,.09,.40,'#805023');
for(const v of [fl,fr,bl,br,il,ir,lerp(fl,fr,.48)]){beam(g,v.clone().setY(.07),v.clone().setY(.42),.042);}
for(const [a,b] of [[fl,fr],[fr,br],[br,bl],[bl,fl],[il,ir]]){beam(g,a.clone().setY(.39),b.clone().setY(.39),.048);beam(g,a.clone().setY(.11),b.clone().setY(.11),.028,trim);}
slab(g,[lf,rf,af],'#a25a26',.042);slab(g,[lb,ab,rb],'#9c6b3b',.042);
slab(g,[lf,af,ab,lb],'#a78169',.034);slab(g,[af,rf,rb,ab],'#68717a',.038);
// Slate tiles follow both axes of the large roof plane; subtle course steps have real thickness.
const colors=['#737984','#606f80','#80828a','#777579','#697786','#8b827e'];
for(let row=0;row<9;row++)for(let col=0;col<7;col++){
 const u0=row/9,u1=(row+.96)/9,v0=col/7+.005,v1=(col+.94)/7;
 const at=(u,v)=>lerp(lerp(af,rf,u),lerp(ab,rb,u),v).add(new THREE.Vector3(0,.007+(row%2)*.001,0));
 slab(g,[at(u0,v0),at(u1,v0),at(u1,v1),at(u0,v1)],colors[(row*11+col*7+row*col)%colors.length],.009);
}
for(const [a,b] of [[lf,af],[af,rf],[rf,rb],[ab,rb],[lb,ab],[af,ab]])beam(g,a,b,.025,trim);
// An attached broad shallow roof completes the irregular L-shaped shop.
const pf=p(864.8,437,.37),pb=p(870.8,429,.37),join=p(879,430,.44),back=p(884.5,421.5,.66);
slab(g,[pf,lf,lb,join,pb],'#ac8874',.035);
slab(g,[join,lb,ab,back],'#b08d75',.033);
for(const [a,b] of [[pf,lf],[pf,pb],[pb,join],[join,back],[back,ab]])beam(g,a,b,.026,'#b39276');
const porchCent=lerp(pf,lb,.5),pfi=lerp(pf,porchCent,.04),pbi=lerp(pb,porchCent,.06);
slab(g,[pfi.clone().setY(.085),fl.clone().setY(.085),bl.clone().setY(.085),pbi.clone().setY(.085)],'#735135',.035);
wall(g,pbi,bl,.09,.37,'#815329');
for(const v of [pfi,pbi,lerp(pfi,fl,.46)]){beam(g,v.clone().setY(.07),v.clone().setY(.37),.035);}
beam(g,pfi,lf,.04);beam(g,pfi,pbi,.036);
for(const t of [.03,.46,.97]){const v=lerp(pfi,fl,t),b=lerp(pfi,fl,Math.min(.99,t+.12));beam(g,v.clone().setY(.24),b.clone().setY(.36),.019,trim);}
// Counter, barrels, and plank stacks occupy the attached arcade.
const axis=fr.clone().sub(fl).normalize(),side=bl.clone().sub(fl).normalize();
const counter=lerp(pfi,fl,.58).addScaledVector(side,.07);const q=new THREE.Group();q.position.copy(counter).setY(.085);q.rotation.y=-Math.atan2(axis.z,axis.x);g.add(q);
box(q,0,.12,0,.28,.035,.12,'#8c5b31');for(const x of [-.10,.10])box(q,x,.057,0,.025,.114,.09,timber);for(let i=0;i<3;i++)box(q,(i-1)*.068,.165,0,.058,.055,.075,['#bda278','#aa8150','#9d773d'][i]);
for(const [t,s] of [[.18,.30],[.78,.27]]){let pos=lerp(fl,fr,t).addScaledVector(side,s*.25);let m=new THREE.Mesh(new THREE.CylinderGeometry(.065,.058,.15,8),mat('#895625'));m.position.copy(pos).setY(.165);m.castShadow=true;g.add(m);for(const y of [.105,.21]){let r=new THREE.Mesh(new THREE.TorusGeometry(.062,.007,4,8),mat('#45372a'));r.rotation.x=Math.PI/2;r.position.copy(pos).setY(y);g.add(r);}}
// Rear door, shutters and braces ensure the building has finished reverse sides.
for(const [a,b] of [[bl,br],[br,ir]]){let mid=lerp(a,b,.55),d=b.clone().sub(a).normalize();let rear=new THREE.Group();rear.position.copy(mid).setY(.08);rear.rotation.y=-Math.atan2(d.z,d.x);g.add(rear);box(rear,0,.135,0,.15,.27,.06,'#493321');for(const x of [-.052,0,.052])box(rear,x,.135,.034,.012,.25,.012,'#76512e');box(rear,0,.20,.045,.15,.022,.012,trim);beam(g,a.clone().setY(.12),lerp(a,b,.28).setY(.37),.023);}
return g;}
