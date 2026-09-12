import {THREE,mat,box} from '../scene/common.js';
// All authored image coordinates are in the immutable ROOT 1400 × 963 frame.
const BASE=.035;
const tones={sand:['#b8a48e','#c2b5a6','#b9a99b','#c4b09b'],stone:['#b4b9b6','#b8bbb5','#afbabd','#b7b6aa']};
function mesh(g,geo,color){const m=new THREE.Mesh(geo,typeof color==='string'?mat(color,{flatShading:true}):color);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function beam(g,a,b,width,depth,color){const d=b.clone().sub(a),m=mesh(g,new THREE.BoxGeometry(width,d.length(),depth),color);m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
function cylinder(g,x,y,z,r,h,color,n=8,r2=r){const m=mesh(g,new THREE.CylinderGeometry(r2,r,h,n),color);m.position.set(x,y,z);return m;}
function solid(g,points,bottom,top,color){const p=[],idx=[];for(const y of [bottom,top])for(const v of points)p.push(v.x,y,v.z);const n=points.length;for(let i=0;i<n;i++){let j=(i+1)%n;idx.push(i,j,n+j,i,n+j,n+i);}for(let i=1;i<n-1;i++){idx.push(0,i+1,i,n,n+i,n+i+1);}const geom=new THREE.BufferGeometry();geom.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geom.setIndex(idx);geom.computeVertexNormals();const m=mesh(g,geom,mat(color,{side:THREE.DoubleSide,flatShading:true}));return m;}
function roofPoint(q,u,v){return q[0].clone().lerp(q[1],u).lerp(q[3].clone().lerp(q[2],u),v);}
function facade(g,a,b,h,palette,index,openings){const delta=b.clone().sub(a),len=delta.length(),center=a.clone().add(b).multiplyScalar(.5),angle=-Math.atan2(delta.z,delta.x),wall=new THREE.Group();wall.position.set(center.x,BASE,center.z);wall.rotation.y=angle;g.add(wall);const thick=.092;
 const cuts=[0,h,...openings.flatMap(o=>[o.y,o.y+o.h])].sort((a,b)=>a-b).filter((v,i,a)=>!i||v-a[i-1]>.001);
 for(let k=0;k<cuts.length-1;k++){let lo=cuts[k],hi=cuts[k+1],active=openings.filter(o=>o.y<hi-.001&&o.y+o.h>lo+.001).sort((a,b)=>a.x-b.x),start=-len/2;for(const o of [...active,{x:len/2+.1,w:.2}]){let edge=o.x-o.w/2;if(edge>start)box(wall,(start+edge)/2,(lo+hi)/2,0,edge-start,hi-lo,thick,palette[index%palette.length]);start=o.x+o.w/2;}}
 for(const o of openings){box(wall,o.x,o.y+o.h/2,0,o.w,o.h,.026,'#342a20');box(wall,o.x,o.y+o.h/2,-.022,o.w*.84,o.h*.95,.017,o.door?'#45372c':'#171b18');if(o.door){for(let s=-1;s<=1;s++)box(wall,o.x+s*o.w*.25,o.y+o.h/2,-.033,.007,o.h*.91,.009,'#302820');}box(wall,o.x,o.y+o.h+.026,0,o.w+.06,.049,thick+.022,palette[(index+1)%4]);box(wall,o.x,o.y+.014,0,o.w+.025,.029,thick+.025,'#aa9984');}
 // Small rough plaster patches and exposed corner courses have actual relief.
 for(let row=0;row<Math.ceil(h/.12);row++)for(let side of [-1,1]){let x=side*(len/2-.045-(row%2)*.016);box(wall,x,.056+row*.12,-.002,.06+(row%2)*.03,.040,thick+.005,palette[(index+row%2)%4]);}
 for(let j=0;j<10;j++){let x=(Math.sin(j*19.41+index*8)*.47)*len,y=.06+((j*.173+index*.237)%(h-.10));if(openings.some(o=>Math.abs(x-o.x)<o.w*.7&&y>o.y-.08&&y<o.y+o.h+.09))continue;box(wall,x,y,j%2?.047:-.047,.035+(j%3)*.022,.016+(j%2)*.018,.004,palette[(index+j%2)%4]);}
 return wall;
}
const definitions=[
 {name:'tower',corners:[[582,583],[615,582],[618,600],[578,600]],h:.48,stone:true,pit:true},
 {name:'west-home',corners:[[394,692],[413,683],[436,704],[413,717]],h:.36,vent:[.48,.26],awning:true},
 {name:'central-home',corners:[[544,682],[563,675],[584,698],[563,704]],h:.32,vent:[.22,.24]},
 {name:'upper-east-home',corners:[[640,664],[664,653],[677,674],[651,682]],h:.39,stone:true,vent:[.83,.17]},
 {name:'lower-east-home',corners:[[642,701],[666,705],[662,732],[634,727]],h:.31,vent:[.71,.18]},
 {name:'foreground-home',corners:[[578,766],[612,751],[625,769],[590,783]],h:.35,vent:[.15,.76]}
];
function house(ctx,g,d,id){const roofY=BASE+d.h+(d.pit?.07:.015),q=d.corners.map(p=>ctx.pixelToWorld(...p,roofY)),home=new THREE.Group();home.name=d.name;g.add(home);const palette=d.stone?tones.stone:tones.sand;
 solid(home,q,-.025,.13,d.stone?'#777b73':'#9e8c74');
 for(let i=0;i<4;i++){let len=q[i].distanceTo(q[(i+1)%4]),ops=[];if(d.pit){if(i===2)ops=[{x:-len*.25,y:.26,w:.083,h:.20},{x:len*.24,y:.26,w:.078,h:.20},{x:0,y:0,w:.22,h:.21,door:true}];else ops=[{x:0,y:.29,w:.085,h:.17}];}else if(i===2&&id===4){ops=[{x:-len*.26,y:0,w:.092,h:.21,door:true},{x:len*.23,y:0,w:.08,h:.19,door:true}];}else if(i===2&&id!==5){ops=[{x:-len*.25,y:.12,w:.075,h:.105},{x:len*.17,y:0,w:.13,h:.32,door:true}];}else if(i===3){ops=[{x:0,y:.20,w:.065,h:.12}];}else if(i===0){ops=[{x:len*.22,y:.17,w:.065,h:.12}];}else if(i===1){ops=[{x:-len*.12,y:0,w:.14,h:.30,door:true}];}for(const o of ops){o.y*=.58;o.h*=.69;}facade(home,q[i],q[(i+1)%4],d.h,palette,i,ops);}
 // An inset solid flat roof, bounded by coping with finite thickness on all four sides.
 solid(home,q,BASE+d.h-(d.pit?.35:.12),BASE+d.h-(d.pit?.30:.01),d.pit?'#27333a':(d.stone?'#b8afa5':'#c6b4a2'));
 const edgeBar=(a,b,width,height,color,y)=>{let delta=b.clone().sub(a),p=a.clone().add(b).multiplyScalar(.5);const m=box(home,p.x,y,p.z,delta.length()+.025,height,width,color);m.rotation.y=-Math.atan2(delta.z,delta.x);};
 for(let i=0;i<4;i++){let rim=d.pit?.09:(i===0?.075:.022);edgeBar(q[i],q[(i+1)%4],d.pit?.066:.043,rim,d.stone?'#c0c3bc':'#c0b09f',BASE+d.h+rim/2);}
 if(d.pit){const inner=[roofPoint(q,.14,.18),roofPoint(q,.86,.18),roofPoint(q,.86,.81),roofPoint(q,.14,.81)];for(let i=0;i<4;i++){solid(home,[q[i],q[(i+1)%4],inner[(i+1)%4],inner[i]],BASE+d.h-.06,BASE+d.h+.014,'#b6b8af');edgeBar(inner[i],inner[(i+1)%4],.046,.265,'#697b85',BASE+d.h-.126);edgeBar(inner[i],inner[(i+1)%4],.062,.035,'#c0bfb0',BASE+d.h+.018);}}
 if(d.vent){const p=roofPoint(q,...d.vent);box(home,p.x,BASE+d.h+.025,p.z,id===5?.13:.12,.07,id===5?.27:.14,'#a59684');box(home,p.x,BASE+d.h+.065,p.z,.15,.035,id===5?.29:.16,'#c2b29d');box(home,p.x,BASE+d.h+.086,p.z,.070,.012,id===5?.19:.076,'#655e50');}
 // Irregular chips on parapet corners and subtle seams across the roof surface.
 for(let j=0;j<(d.pit?0:3);j++){const p=roofPoint(q,.10+j*.18,.16+((j*7)%5)*.14);box(home,p.x,BASE+d.h-.003,p.z,.036,.009,.10,'#b9aa96');}
 if(d.awning){const a=q[3].clone(),b=q[0].clone(),edge=b.clone().sub(a),out=new THREE.Vector3(edge.z,0,-edge.x).normalize();let center=q.reduce((s,p)=>s.add(p),new THREE.Vector3()).multiplyScalar(.25);if(out.dot(center.clone().sub(a))>0)out.negate();let a1=a.clone().lerp(b,.33),b1=a.clone().lerp(b,.91),a2=a1.clone().addScaledVector(out,.34),b2=b1.clone().addScaledVector(out,.34);for(const p of [a2,b2]){beam(home,new THREE.Vector3(p.x,BASE,p.z),new THREE.Vector3(p.x,BASE+.37,p.z),.038,.038,'#73604a');}for(let j=0;j<7;j++){let u=j/7,v=(j+1)/7;const ps=[a1.clone().lerp(b1,u),a1.clone().lerp(b1,v),a2.clone().lerp(b2,v),a2.clone().lerp(b2,u)];solid(home,ps,BASE+.37,BASE+.39,j%2?'#796373':'#966e71');}for(const [p,r] of [[a1,b1],[a2,b2],[a1,a2],[b1,b2]]){p.y=r.y=BASE+.366;beam(home,p,r,.03,.03,'#7b6047');}const p=a1.clone().lerp(b2,.5);box(home,p.x,.13,p.z,.25,.04,.21,'#a28861');for(const dx of [-.09,.09])box(home,p.x+dx,.07,p.z,.029,.14,.13,'#746046');}
 if(id===3){const a=q[2].clone().lerp(q[3],.10),b=q[2].clone().lerp(q[3],.75),dir=b.clone().sub(a),out=new THREE.Vector3(dir.z,0,-dir.x).normalize();const center=roofPoint(q,.5,.5);if(out.dot(center.clone().sub(a))>0)out.negate();const c=b.clone().addScaledVector(out,.16),d=a.clone().addScaledVector(out,.16);solid(home,[a,b,c,d],BASE+.18,BASE+.20,'#875b4b');for(const p of [c,d,c.clone().lerp(d,.5)]){beam(home,new THREE.Vector3(p.x,BASE,p.z),new THREE.Vector3(p.x,BASE+.22,p.z),.023,.024,'#79604c');}const p=c.clone().lerp(d,.44);box(home,p.x,BASE+.06,p.z,.20,.115,.09,'#9a7656');}
 return {q,home};
}
function barrel(ctx,g,x,y,scale=1){const p=ctx.pixelToWorld(x,y,BASE),r=.085*scale,h=.22*scale;const m=mesh(g,new THREE.CylinderGeometry(r*.85,r*.9,h,9,2), '#775334');m.position.set(p.x,BASE+h/2,p.z);for(let t of [.15,.80])cylinder(g,p.x,BASE+h*t,p.z,r*.96,.022*scale,'#514735',9);cylinder(g,p.x,BASE+h+.001,p.z,r*.73,.011,'#493724',9);}
function pot(ctx,g,x,y,scale=1,color='#89634a'){const p=ctx.pixelToWorld(x,y,BASE),s=.105*scale;const profile=[[.052,0],[.09,.028],[.105,.10],[.069,.16],[.045,.175],[.047,.20]].map(([r,y])=>new THREE.Vector2(r*scale,y*scale));let m=mesh(g,new THREE.LatheGeometry(profile,9),color);m.position.copy(p);cylinder(g,p.x,BASE+.194*scale,p.z,.034*scale,.013,'#2d251c',9);}
function sack(ctx,g,x,y,s=.09,color='#b9a88c'){const p=ctx.pixelToWorld(x,y,BASE);let m=mesh(g,new THREE.IcosahedronGeometry(s,1),color);m.scale.set(.8,1.1,.72);m.position.set(p.x,BASE+s*.83,p.z);cylinder(g,p.x,BASE+s*1.7,p.z,s*.23,s*.25,'#776d58',6);}
function lamp(ctx,g,x,y,h=.62){h*=.64;const p=ctx.pixelToWorld(x,y,BASE);cylinder(g,p.x,BASE+h/2,p.z,.014,h,'#706958',6);box(g,p.x,BASE+h+.025,p.z,.059,.043,.058,'#4b4b40');box(g,p.x,BASE+h+.020,p.z,.036,.026,.036,'#959274');let m=mesh(g,new THREE.ConeGeometry(.044,.027,4),'#59594c');m.position.set(p.x,BASE+h+.059,p.z);m.rotation.y=Math.PI/4;cylinder(g,p.x,BASE+.025,p.z,.031,.05,'#8e8268',7);}
function shadeCart(ctx,g){const p=ctx.pixelToWorld(643,650,BASE),cart=new THREE.Group();cart.name='goods-shade-cart';cart.position.copy(p);cart.rotation.y=.04;g.add(cart);box(cart,0,.16,0,.48,.062,.23,'#9f9279');for(const x of [-.21,.21])for(const z of [-.105,.105])box(cart,x,.235,z,.026,.29,.026,'#847053');for(const z of [-.15,.15]){let m=mesh(cart,new THREE.CylinderGeometry(.078,.078,.029,10),'#665440');m.rotation.x=Math.PI/2;m.position.set(.12,.088,z);}box(cart,0,.39,0,.55,.037,.29,'#b6ad99');for(const x of [-.18,.18])box(cart,x,.365,0,.025,.04,.28,'#75634c');for(let i=0;i<3;i++)box(cart,-.14+i*.14,.22,0,.10,.067,.16,i%2?'#8b8061':'#c0ad87');beam(cart,new THREE.Vector3(-.22,.16,0),new THREE.Vector3(-.43,.11,0),.035,.035,'#776145');}
export function build(ctx){const g=new THREE.Group();g.name='adobe-village';definitions.forEach((d,i)=>house(ctx,g,d,i));
 for(const p of [[574,635,1],[578,636,.82],[577,639,.88],[581,638,.72],[624,620,.65],[435,694,.8]])barrel(ctx,g,...p);
 for(const p of [[671,637,.90],[653,640,.76],[435,723,.75],[676,685,.70]])pot(ctx,g,...p);
 for(const p of [[642,624,.10],[646,627,.085],[639,621,.087],[632,624,.075],[538,694,.082],[536,696,.069],[629,782,.086],[633,779,.078],[581,646,.07]])sack(ctx,g,...p);
 for(const p of [[445,620,.80],[458,627,.84],[463,608,.82],[473,612,.80],[563,679,.58],[617,718,.66],[623,727,.61],[635,745,.67],[630,756,.62],[613,761,.61],[690,701,.62]])lamp(ctx,g,...p);
 shadeCart(ctx,g);
 // A tiny traveler beside the west home, with a body that reads from every direction.
 {const p=ctx.pixelToWorld(462,716,BASE);cylinder(g,p.x,BASE+.095,p.z,.054,.14,'#d0c5ad',7,.028);cylinder(g,p.x,BASE+.17,p.z,.028,.07,'#725039',7);let m=mesh(g,new THREE.ConeGeometry(.045,.074,7),'#3f3028');m.position.set(p.x,BASE+.227,p.z);for(let s of [-1,1])box(g,p.x+s*.022,BASE+.026,p.z,.028,.05,.045,'#4e4534');}
 return g;
}
