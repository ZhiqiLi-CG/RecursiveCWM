import {THREE,mat,box} from '../scene/common.js';
const palette={plaster:'#c9c2ac',timber:'#493a26',stone:'#79868a',slate:'#718798',straw:'#c0a779',darkThatch:'#635e36',wood:'#786035',shadow:'#202c2c'};
function beam(g,a,b,width,color=palette.timber){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),v=bv.clone().sub(av);const m=box(g,0,0,0,width,v.length(),width,color);m.position.copy(av.add(bv).multiplyScalar(.5));m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),v.normalize());return m;}
function prism(g,verts,indices,color){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(verts.flat(),3));geo.setIndex(indices);geo.computeVertexNormals();const m=new THREE.Mesh(geo,mat(color));m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function roof(g,w,d,eave,rise,color,detail='slate'){
 const h=eave+rise,th=.045;
 // A sealed triangular prism gives full gable infill, roof underside and two thick roof slopes.
 prism(g,[[-w/2,eave,-d/2],[w/2,eave,-d/2],[0,h,-d/2],[-w/2,eave,d/2],[w/2,eave,d/2],[0,h,d/2]],[0,2,1,3,4,5,0,3,5,0,5,2,2,5,4,2,4,1,0,1,4,0,4,3],palette.plaster);
 for(const s of [-1,1]){
  const slope=Math.sqrt(w*w/4+rise*rise),r=box(g,s*w/4,eave+rise/2,0,slope+.05,th,d+.10,color);r.rotation.z=-s*Math.atan2(rise,w/2);
  // Broad restrained facets on real slabs, never a flat painted roof substitute.
  for(let row=0;row<6;row++)for(let col=0;col<9;col++){
   const u=(row+.5)/6,z=-d/2+(col+.5)*d/9,x=s*w/2*(1-u),y=eave+rise*u+.050;
   const colors=detail==='slate'?['#7c8d9f','#8393a4','#7f90a0','#7a8b9c']:detail==='straw'?['#c5af8a','#cbb692','#c2ac86','#c8b18e']:['#666342','#6c6744','#686641','#706c49'];
   const tile=box(g,x,y,z,slope/6+.009,.012,d/9+.007,colors[(row*13+col*7)%colors.length]);tile.rotation.z=r.rotation.z;tile.castShadow=false;
  }
 }
 beam(g,[0,h+.033,-d/2-.07],[0,h+.033,d/2+.07],.052,detail==='slate'?'#55412a':'#aa9061');
 for(const z of [-d/2-.047,d/2+.047])for(const s of [-1,1])beam(g,[0,h+.025,z],[s*(w/2+.025),eave,z],.035,palette.timber);
}
function windowOn(g,x,y,z,side,w=.115,h=.15){const q=new THREE.Group();q.position.set(x,y,z);q.rotation.y=side;g.add(q);box(q,0,0,0,w,h,.022,palette.shadow);for(const s of [-1,1])box(q,s*(w/2+.008),0,.018,.024,h+.045,.03,palette.timber);box(q,0,-h/2-.014,.02,w+.06,.028,.055,palette.timber);box(q,0,0,.017,.018,h,.028,palette.timber);}
function door(g,x,z,rot,h=.33){const q=new THREE.Group();q.position.set(x,0,z);q.rotation.y=rot;g.add(q);box(q,0,.14+h/2,0,.19,h,.028,'#302d24');for(const s of [-1,1])box(q,s*.108,.14+h/2,.025,.028,h+.04,.04,palette.timber);box(q,0,.14+h,.026,.245,.03,.04,palette.timber);for(let k=-1;k<=1;k++)box(q,k*.055,.14+h/2,.02,.008,h,.014,'#665034');box(q,.052,.14+h*.45,.034,.025,.025,.016,'#161d1a');box(q,0,.075,.09,.29,.07,.20,'#7b7c6d');}
function chimney(g,x,z,base,height,size=1){const q=new THREE.Group();q.position.set(x,0,z);q.scale.set(size,1,size);g.add(q);g=q;x=0;z=0;box(g,x,base+height/2,z,.17,height,.19,'#6e7b83');for(let r=0;r<4;r++){const y=base+(r+.5)*height/4;box(g,x-.087,y,z,.012,.018,.194,'#97a1a1');box(g,x,y,z+.099,.174,.018,.012,'#97a1a1');}box(g,x,base+height+.015,z,.22,.07,.235,'#92958c');box(g,x,base+height+.053,z,.116,.012,.133,'#303635');}
function house(ctx,g,o){const q=new THREE.Group();q.name=o.name;q.position.copy(ctx.pixelToWorld(...o.foot,.06));q.rotation.y=o.angle||0;g.add(q);const {w,d,eave,rise}=o;box(q,0,.065,0,w+.025,.13,d+.025,palette.stone);box(q,0,(eave+.13)/2,0,w,eave-.13,d,palette.plaster);if(o.roof==='darkThatch')box(q,-w/2-.004,(eave+.13)/2,0,.015,eave-.13,d,'#849396');else box(q,0,(eave+.13)/2,d/2+.004,w,eave-.13,.015,'#829398');
 for(const x of [-w/2,w/2])for(const z of [-d/2,d/2])box(q,x,eave/2,z,.030,eave,.030,palette.timber);
 const levels=o.floors===2?[.16,eave*.58,eave]:[.15,eave];
 for(const y of levels){for(const x of [-w/2,w/2])box(q,x,y,0,.037,.037,d+.035,palette.timber);for(const z of [-d/2,d/2])box(q,0,y,z,w+.025,.037,.037,palette.timber);}
 for(const x of [-w/2,w/2]){
  for(const z of [-d*.23,d*.23]){box(q,x,eave/2,z,.035,eave,.035,palette.timber);windowOn(q,x*1.015,o.floors===2?eave*.80:eave*.58,z,x<0?-Math.PI/2:Math.PI/2,.105,.13);}
  if(o.floors===2){beam(q,[x-.006,eave*.58,-d/2],[x-.006,eave,-d*.24],.032);beam(q,[x-.006,eave*.58,d/2],[x-.006,eave,d*.24],.032);}
 }
 roof(q,w+.12,d+.10,eave,rise,palette[o.roof],o.roof==='darkThatch'?'dark':o.roof==='straw'?'straw':'slate');
 for(const z of [-d/2-.007,d/2+.007]){beam(q,[-w/2,eave,z],[0,eave+rise-.02,z],.036);beam(q,[w/2,eave,z],[0,eave+rise-.02,z],.036);beam(q,[0,eave,z],[0,eave+rise-.02,z],.035);windowOn(q,0,eave+rise*.32,z,z<0?Math.PI:0,.12,.11);}
 door(q,0,d/2+.021,0,o.floors===2?.34:.28);if(o.roof==='darkThatch')windowOn(q,0,.30,-d/2-.021,Math.PI,.085,.11);else door(q,0,-d/2-.021,Math.PI,.28);
 if(o.chimney)chimney(q,-w*.34,-d*.02,eave+rise*.28,o.roof==='slate'?.29:.21,o.roof==='slate'?.8:.60);
 if(o.roof==='slate'){const a=new THREE.Group();a.position.set(w/2+.085,0,-d*.10);a.rotation.y=Math.PI/2;q.add(a);box(a,0,.32,0,.19,.64,.24,'#56758a');roof(a,.22,.28,.65,.12,'#55758e');}
 if(o.roof==='darkThatch'){chimney(q,-.17,-.18,.58,.19,.48);const dormer=new THREE.Group();dormer.position.set(.19,0,-.18);dormer.rotation.y=Math.PI/2;q.add(dormer);box(dormer,0,.5,0,.34,.18,.38,palette.plaster);roof(dormer,.34,.43,.59,.25,'#9a8955','dark');}
 // Unseen side has a proper service door and two windows too.
 const service=new THREE.Group();service.position.set(w/2+.02,0,0);service.rotation.y=Math.PI/2;q.add(service);door(service,0,0,0,.29);
 if(o.porch){const x=-w/2-.10;box(q,x,.08,0,.21,.12,d+.04,palette.timber);for(let i=0;i<5;i++)box(q,x,.145,-d/2+(i+.5)*d/5,.215,.027,d/5-.012,'#796339');const r=box(q,x,.22,0,.245,.048,d+.10,'#5e5125');r.rotation.z=.25;for(const z of [-d/2,d/2])beam(q,[x-.10,.06,z],[x-.10,.20,z],.037);}
 if(o.lean){const x=w/2+.14;box(q,x,.17,0,.28,.28,.42,'#8b8370');let r=box(q,x,.34,0,.35,.045,.49,'#8f8565');r.rotation.z=-.4;for(const z of [-.22,.22])box(q,x+.12,.16,z,.035,.32,.035,palette.timber);}
 return q;}
function barrel(g,x,y,z,r=.075,h=.20){const m=new THREE.Mesh(new THREE.CylinderGeometry(r*.86,r*.86,h,10,1),mat('#776549'));m.position.set(x,y+h/2,z);g.add(m);m.castShadow=true;for(const dy of [.04,h-.04]){const ring=new THREE.Mesh(new THREE.CylinderGeometry(r*.90,r*.90,.022,10),mat('#393e36'));ring.position.set(x,y+dy,z);g.add(ring);}box(g,x,y+h+.004,z,.1,.015,.017,'#453c29');}
function crate(g,x,y,z,w=.17){box(g,x,y+w/2,z,w,w,w,'#8c7858');for(const s of [-1,1]){box(g,x+s*w*.4,y+w/2,z+w/2+.006,.018,w,.014,palette.timber);box(g,x,y+w*.12,z+s*w/2,w,.022,.016,palette.timber);}beam(g,[x-w*.4,y+.03,z+w/2+.017],[x+w*.4,y+w-.03,z+w/2+.017],.016);}
function at(ctx,g,x,y,name){let q=new THREE.Group();q.position.copy(ctx.pixelToWorld(x,y,.06));q.name=name;g.add(q);return q;}
function shelter(ctx,g,x,y,w,d,h){let q=at(ctx,g,x,y,'canvas-shelter');q.rotation.y=.1;for(const xx of [-w/2,w/2])for(const z of [-d/2,d/2])box(q,xx,h/2,z,.034,h,.034,palette.timber);for(const xx of [-w/2,w/2])box(q,xx,.11,0,.05,.13,d,'#624927');for(const side of [-1,1]){const rise=.14,span=w/2+.04;const top=box(q,side*span/2,h+rise/2,0,Math.hypot(span,rise),.025,d+.06,'#d2cbb3');top.rotation.z=-side*Math.atan2(rise,span);}beam(q,[0,h+.14,-d/2-.025],[0,h+.14,d/2+.025],.024);box(q,0,.075,0,w,.07,d,palette.timber);crate(q,-w*.23,.11,-d*.2,.10);barrel(q,w*.20,.11,d*.17,.045,.10);return q;}
export function build(ctx){const g=new THREE.Group();g.name='east-lakeside';
 house(ctx,g,{name:'dark-thatch-cottage',foot:[982,505],w:.61,d:.64,eave:.52,rise:.38,angle:Math.PI/2,roof:'darkThatch',floors:1,lean:true});
 house(ctx,g,{name:'blue-slate-house',foot:[1067,484],w:.66,d:.75,eave:.77,rise:.31,angle:.10,roof:'slate',floors:2,chimney:true,porch:true});
 house(ctx,g,{name:'pale-thatch-house',foot:[1107,431],w:.70,d:.74,eave:.54,rise:.36,angle:.09,roof:'straw',floors:1,chimney:true,lean:true});
 shelter(ctx,g,1109,379,.25,.30,.25);
 const cart=shelter(ctx,g,1013,401,.20,.26,.19);cart.name='covered-pondside-cart';cart.scale.setScalar(.83);for(const x of [-.19,.19])for(const z of [-.14,.14]){const m=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,.035,10),mat('#3e3424'));m.rotation.z=Math.PI/2;m.position.set(x,.07,z);cart.add(m);}beam(cart,[0,.13,.23],[0,.08,.46],.035);
 const upright=at(ctx,g,1028,404,'upright-covered-goods');const m=new THREE.Mesh(new THREE.CylinderGeometry(.060,.08,.24,7),mat('#252b20'));m.position.y=.12;upright.add(m);m.castShadow=true;
 const goods=at(ctx,g,1044,399,'barrel-and-crate-stack');goods.rotation.y=-.8;goods.scale.set(1,.65,1);barrel(goods,-.10,0,0,.075,.18);crate(goods,.085,0,0,.17);crate(goods,.045,.17,-.015,.13);
 return g;}
