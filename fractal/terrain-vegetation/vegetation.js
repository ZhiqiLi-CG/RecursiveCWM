import {THREE, mat} from '../scene/common.js';
import {build as buildWest} from '../vegetation-west/forest.js';
import {build as buildBelt} from '../vegetation-belt/forest.js';
import {build as buildForeground} from '../vegetation-foreground/forest.js';
// Natural detail and the three complete forest assemblies.
const greens=['#174b20','#245625','#2c5b29','#355f2d'];
const cactusMaterials=greens.map(c=>mat(c,{flatShading:true}));
const rockMaterials=['#63695f','#7d8072','#969786','#aaa995'].map(c=>mat(c,{flatShading:true}));
function mesh(g,geo,material,x,y,z){const m=new THREE.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;m.receiveShadow=true;g.add(m);return m;}
function limb(g,a,b,r,m){const av=new THREE.Vector3(...a),bv=new THREE.Vector3(...b),delta=bv.clone().sub(av);const obj=mesh(g,new THREE.CylinderGeometry(r*.91,r,delta.length(),8),m,...av.clone().add(bv).multiplyScalar(.5).toArray());obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),delta.normalize());mesh(g,new THREE.SphereGeometry(r,8,5),m,...b);}
function cactus(h,index){const g=new THREE.Group(),m=cactusMaterials[index%4],r=h*.075;limb(g,[0,-.03,0],[0,h,0],r,m);
 if(h>.2){const n=index%4===1?1:2;for(let j=0;j<n;j++){let sign=j?1:-1,offset=h*(j?.26:.24),joint=h*(j?.48:.63),top=h*(j?.79:.91),depth=(j?.045:-.07)*h;limb(g,[0,joint,0],[sign*offset,joint+.025*h,depth],r*.77,m);limb(g,[sign*offset,joint,depth],[sign*offset,top,depth],r*.75,m);}}
 g.rotation.y=.64+(index%5-2)*.19;g.name='round-branched-cactus';return g;}
// Positions measured at ROOTS in 2.25x south inspection, then mapped to root reference pixels.
const cactusAnchors=[
[101,141,.63],[128,163,.28],[165,115,.32],[185,111,.31],
[154,311,.22],[266,387,.50],[406,314,.60],[492,280,.27],[494,332,.29],[611,319,.30],
[415,397,.31],[316,445,.51],[309,411,.16],[360,473,.24],[376,503,.49],[491,555,.29],[569,552,.16],
[745,509,.38],[838,580,.31],[918,529,.23],[1041,481,.32],[1129,550,.49],[1066,423,.17],
[1008,269,.31],[937,324,.29],[810,721,.22],[1059,597,.18]];
function rooted(ctx,px,py){const p=ctx.pixelToWorld(px,py,0);const h=ctx.heightAt?ctx.heightAt(p.x,p.z):.035;p.y=(Number.isFinite(h)?h:.035)-.025;return p;}
function addRock(ctx,g,x,y,s,i){const p=rooted(ctx,x,y),geo=new THREE.IcosahedronGeometry(1,0);const rock=mesh(g,geo,rockMaterials[i%4],p.x,p.y+s*.23,p.z);rock.scale.set(s*(.85+.14*(i%3)),s*.61,s*.76);rock.rotation.set(.13*(i%4),i*1.618,.11*(i%3));rock.name='buried-faceted-stone';}
export function build(ctx){const g=new THREE.Group();g.name='terrain-vegetation';
 cactusAnchors.forEach(([x,y,h],i)=>{const p=rooted(ctx,216+x/2.25,500+y/2.25),c=cactus(h,i);c.position.copy(p);g.add(c);});
 [[211,525,.32],[204,509,.20],[700,689,.26]].forEach(([x,y,h],i)=>{const c=cactus(h,i+30);c.position.copy(rooted(ctx,x,y));g.add(c);});
 const rocks=[[349,405,.23],[343,411,.11],[359,413,.10],[921,338,.13],[919,341,.08],[738,295,.10],[747,290,.085],[754,301,.065],[731,303,.075],[740,307,.065],[762,297,.08],[752,311,.06],[775,315,.05],[862,366,.065],[789,388,.09],[725,427,.055],[903,472,.07],[465,708,.065],[468,713,.085],[376,696,.055],[463,699,.04],[744,649,.06]];
 rocks.forEach(([x,y,s],i)=>addRock(ctx,g,x,y,s,i));
 // Small shrub at the sand/grass island edge; round irregular leaves all around its trunk.
 [[328,630,.09],[323,638,.08],[326,644,.06]].forEach(([x,y,s],i)=>{const p=rooted(ctx,x,y);for(let j=0;j<4;j++){const a=j*2.4;const b=mesh(g,new THREE.IcosahedronGeometry(s,1),cactusMaterials[(i+j)%4],p.x+Math.cos(a)*s*.55,p.y+s*.58,p.z+Math.sin(a)*s*.55);b.scale.y=.75;}});
 const forests=[buildWest(ctx),buildBelt(ctx),buildForeground(ctx)];
 // Reconcile independently tuned child foliage under the shared scene light.
 // Clone only replaced materials; child modules and their reusable palettes stay untouched.
 const beltMaterials=new Map();
 forests[1].traverse(object=>{if(object.isMesh&&object.geometry.getAttribute('color')){
  if(!beltMaterials.has(object.material)){const m=object.material.clone();m.flatShading=false;m.color.lerp(new THREE.Color('#629323'),.22);m.needsUpdate=true;beltMaterials.set(object.material,m);}
  object.material=beltMaterials.get(object.material);
 }});
 for(const tree of forests[1].children){tree.scale.set(1.06,1.03,1.06);tree.userData.height*=1.03;}
 for(const tree of forests[2].children){tree.scale.set(.92,1.045,.92);tree.userData.height*=1.045;}
 forests.forEach(forest=>g.add(forest));
 g.userData.counts={conifers:forests.reduce((n,f)=>n+f.userData.count,0),cacti:30,rocks:rocks.length,shrubs:3};
 g.userData.children=['vegetation-west','vegetation-belt','vegetation-foreground'];return g;}
