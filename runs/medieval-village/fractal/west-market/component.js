import {THREE,mat,box} from '../scene/common.js';
const C={wood:'#55402b',edge:'#392e24',plank:'#786047',iron:'#414440',cream:'#c9c0a5',gray:'#8e9290',blue:'#315f79',sack:'#918269'};
const material={};function M(c){return material[c]||(material[c]=mat(c,{flatShading:true}));}
function block(g,x,y,z,w,h,d,c){return box(g,x,y,z,w,h,d,M(c));}
function mesh(g,geo,c,x=0,y=0,z=0){const m=new THREE.Mesh(geo,M(c));m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function beam(g,a,b,r,c=C.wood){const v=new THREE.Vector3(...a),q=new THREE.Vector3(...b),d=q.clone().sub(v);const m=mesh(g,new THREE.CylinderGeometry(r,r,d.length(),5),c);m.position.copy(v.add(q).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return m;}
function place(ctx,g,name,x,y,angle=0){const s=new THREE.Group();s.name=name;s.position.copy(ctx.pixelToWorld(x,y,.06));s.rotation.y=angle;g.add(s);return s;}
// Cloth is a closed extrusion with an inner surface and a visible hem thickness.
function shell(g,profile,depth,c,thick=.012){const sh=new THREE.Shape();profile.forEach(([x,y],i)=>i?sh.lineTo(x,y):sh.moveTo(x,y));for(let i=profile.length-1;i>=0;i--)sh.lineTo(profile[i][0],profile[i][1]-thick);sh.closePath();const geo=new THREE.ExtrudeGeometry(sh,{depth,bevelEnabled:false,steps:1});geo.translate(0,0,-depth/2);return mesh(g,geo,c);}
function wheel(g,x,y,z,r){let m=mesh(g,new THREE.TorusGeometry(r,.015,5,10),C.edge,x,y,z);m.rotation.y=Math.PI/2;for(let a=0;a<3;a++){let t=a*Math.PI/3;beam(g,[x,y-r*Math.cos(t),z-r*Math.sin(t)],[x,y+r*Math.cos(t),z+r*Math.sin(t)],.007,C.plank);}let hub=mesh(g,new THREE.CylinderGeometry(.023,.023,.052,6),C.wood,x,y,z);hub.rotation.z=Math.PI/2;}
function barrel(g,x,z,r=.06,h=.13){mesh(g,new THREE.CylinderGeometry(r*.86,r*.88,h,9,1),C.plank,x,h/2,z);for(const y of [h*.2,h*.8])mesh(g,new THREE.CylinderGeometry(r*.94,r*.94,.012,9),C.iron,x,y,z);mesh(g,new THREE.CylinderGeometry(r*.83,r*.83,.008,9),C.wood,x,h+.002,z);}
function sack(g,x,z,r=.055,c=C.sack){let m=mesh(g,new THREE.IcosahedronGeometry(r,1),c,x,r*.9,z);m.scale.set(.85,1.35,.85);mesh(g,new THREE.ConeGeometry(r*.3,r*.45,5),c,x,r*2.1,z);}
function cart(g,w=.32,d=.4,covered=false,cloth=C.cream){const r=.078,by=.16;for(const z of [-d*.32,d*.32]){beam(g,[-w*.67,r,z],[w*.67,r,z],.016,C.iron);for(const x of [-w*.64,w*.64])wheel(g,x,r,z,r);}block(g,0,by,0,w,.055,d,C.wood);for(let i=0;i<5;i++)block(g,0,by+.032,-d*.4+i*d*.2,w,.017,d*.185,C.plank);for(const x of [-w/2,w/2]){block(g,x,by+.07,0,.023,.13,d,C.plank);for(const z of [-d*.43,d*.43])block(g,x,by+.07,z,.025,.16,.025,C.edge);}for(const z of [-d/2,d/2])block(g,0,by+.07,z,w,.11,.022,C.wood);
if(covered){const profile=[];for(let i=0;i<=8;i++){let a=Math.PI-i*Math.PI/8;profile.push([Math.cos(a)*w*.56,by+.11+Math.sin(a)*w*.65]);}shell(g,profile,d*1.06,cloth);const lining=new THREE.Shape();profile.forEach(([x,y],i)=>i?lining.lineTo(x,y):lining.moveTo(x,y));lining.closePath();const liningGeo=new THREE.ExtrudeGeometry(lining,{depth:.009,bevelEnabled:false});mesh(g,liningGeo,'#4d4940',0,0,-d*.38);for(const z of [-d*.49,0,d*.49])for(let i=0;i<8;i++)beam(g,[...profile[i],z],[...profile[i+1],z],.008,C.wood); // modest folded rear panel leaves a dark access opening
block(g,0,by+.095,-d*.49,w*.82,.13,.018,C.wood);
}else{ sack(g,-w*.2,0,.061);block(g,w*.2,by+.09,d*.12,w*.35,.1,d*.32,'#867259');}
for(const x of [-w*.31,w*.31])beam(g,[x,by,-d*.35],[x,.12,-d*.91],.013,C.wood);
}
function stall(g,w,d,h,cloth,sloped=false){for(const x of [-w*.47,w*.47])for(const z of [-d*.44,d*.44]){block(g,x,h/2,z,.018,h,.018,C.wood);block(g,x,h-.01,z,.024,.04,d*.02,C.edge);}block(g,0,.16,0,w,.035,d*.84,C.plank);block(g,0,.09,d*.4,w,.145,.02,C.wood);for(const x of [-w*.47,w*.47])block(g,x,.095,0,.018,.13,d*.8,C.wood);block(g,0,.095,-d*.4,w,.13,.018,C.wood);for(let i=0;i<5;i++)block(g,-w*.4+i*w*.2,.10,d*.415,.006,.12,.006,C.edge);
if(sloped)shell(g,[[-w*.58,h-.02],[w*.58,h+.025]],d*1.18,cloth);else shell(g,[[-w*.58,h-.025],[0,h+.035],[w*.58,h-.025]],d*1.16,cloth);
for(const z of [-d*.53,d*.53])beam(g,[-w*.57,h-.02,z],[w*.57,h-.02,z],.009,C.wood);for(const x of [-w*.4,0,w*.35]){block(g,x,.187,0,w*.2,.015,d*.37,C.edge);for(let j=0;j<3;j++)mesh(g,new THREE.IcosahedronGeometry(.015,0),j===1?'#a38b44':'#847250',x+(j-1)*.018,.21,.02);}}
function lamp(g){block(g,0,-.012,0,.065,.05,.065,'#6b6853');block(g,0,.18,0,.013,.39,.013,'#514e3c');block(g,0,.386,0,.07,.012,.02,C.wood);block(g,0,.406,0,.033,.041,.033,'#8d8467');for(const x of [-.020,.020])for(const z of [-.019,.019])block(g,x,.405,z,.006,.055,.006,C.iron);mesh(g,new THREE.ConeGeometry(.038,.025,4),C.iron,0,.443,0).rotation.y=Math.PI/4;block(g,0,.368,0,.045,.012,.045,C.iron);}
function person(g,c){block(g,0,.064,0,.045,.092,.032,c);for(const x of [-.014,.014])block(g,x,.016,0,.015,.032,.02,C.edge);mesh(g,new THREE.IcosahedronGeometry(.026,1),'#ad9879',0,.129,0);mesh(g,new THREE.ConeGeometry(.03,.025,6),C.wood,0,.153,0);beam(g,[-.035,.088,0],[.035,.088,0],.011,c);}
export function build(ctx){const g=new THREE.Group();g.name='west-market';
// These are ground-contact anchors under the immutable camera, not roof centers.
let a=place(ctx,g,'western-cream-tent',215,424,-.5);const tw=.40,td=.43; shell(a,[[-tw/2,.025],[0,.40],[tw/2,.025]],td,C.cream,.014);for(const z of [-td*.49,td*.49]){beam(a,[0,0,z],[0,.39,z],.012);beam(a,[-tw/2,.02,z],[tw/2,.02,z],.013);const sh=new THREE.Shape();sh.moveTo(-tw/2,.024);sh.lineTo(0,.40);sh.lineTo(tw/2,.024);sh.lineTo(.06,.024);sh.lineTo(0,.27);sh.lineTo(-.055,.024);sh.closePath();let geo=new THREE.ExtrudeGeometry(sh,{depth:.012,bevelEnabled:false});mesh(a,geo,'#bcb095',0,0,z);}beam(a,[0,.39,-td/2],[0,.39,td/2],.01);
a=place(ctx,g,'northern-ivory-stall',409.5,416.8,-.8);stall(a,.32,.21,.23,C.cream,true);
a=place(ctx,g,'northern-goods-cart',409.2,434,-.7);cart(a,.29,.25,false);a.scale.setScalar(.92);
a=place(ctx,g,'courtyard-covered-cart',331,463,.0);cart(a,.32,.42,true,'#8e8b7f');a.scale.setScalar(.73);block(a,.21,.17,.09,.19,.06,.22,C.wood);
a=place(ctx,g,'cream-market-canopy-west',350,476,-1.05);stall(a,.36,.25,.36,'#d0c7af');
a=place(ctx,g,'gray-canvas-stall',372.8,488.3,-.92);stall(a,.36,.27,.30,'#939a9d',true);
a=place(ctx,g,'cream-market-canopy-east',404.5,484,.04);stall(a,.33,.235,.32,'#d5cdb7',true);
a=place(ctx,g,'eastern-covered-wagon',447,457.8,-.18);cart(a,.30,.40,true,'#bfc2b8');a.scale.setScalar(.73);
a=place(ctx,g,'blue-striped-display',408.5,460.5,-.9);stall(a,.27,.17,.40,C.blue,true);block(a,0,.28,.085,.28,.2,.018,C.wood);for(let j=0;j<4;j++)block(a,0,.225+j*.048,.096,.28,.045,.019,j%2? '#557d91':'#b0ac8b');block(a,0,.03,.06,.31,.04,.24,C.blue);a.scale.set(.82,.9,.85);
for(const [x,y,r] of [[341,462,.067],[387.5,487,.052],[392,487,.055],[398,484.8,.047],[431,463,.065],[258,452,.06]]){a=place(ctx,g,'market-barrel',x,y);barrel(a,0,0,r,r*2.1);sack(a,.10,.01,.046);}
for(const [x,y,c] of [[389,460,'#3e4534'],[395,488,'#5d462f'],[399,486,'#857953']])person(place(ctx,g,'market-person',x,y),c);
for(const [x,y] of [[237,426],[252.5,415.5],[261.5,440],[279,435.5],[314,459],[336,443.5],[331.5,430],[337.5,477],[430,433],[436,443],[461,434],[499,410],[529,444],[493,479],[427.5,526],[408.5,536]])lamp(place(ctx,g,'lane-lamp',x,y));
// Keep the inherited anchor plane while bedding physical feet into terrain.
for(const child of g.children)child.position.y-=.05;
return g;}
