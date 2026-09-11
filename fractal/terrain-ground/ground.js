import {THREE,mat} from '../scene/common.js';
import field from './field.js';
const {nx,nz,bounds,heights,sand,waterDistance,tone,clearance}=field;
const [xmin,xmax,zmin,zmax]=bounds, dx=(xmax-xmin)/(nx-1),dz=(zmax-zmin)/(nz-1), WATER=-.035, BOTTOM=-.34;
function sample(values,x,z){const gx=Math.max(0,Math.min(nx-1,(x-xmin)/dx)),gz=Math.max(0,Math.min(nz-1,(z-zmin)/dz));const a=Math.min(nx-2,Math.floor(gx)),b=Math.min(nz-2,Math.floor(gz)),u=gx-a,v=gz-b,k=b*nx+a;return (values[k]*(1-u)+values[k+1]*u)*(1-v)+(values[k+nx]*(1-u)+values[k+nx+1]*u)*v;}
// Bed elevation in water; exact sampler is available before build(), with no context setup.
export function heightAt(x,z){return sample(heights,x,z);}
export function surfaceAt(x,z){return sample(waterDistance,x,z)<0?'water':sample(sand,x,z)>.5?'sand':'grass';}
function undersideAt(x,z){const d=Math.min(x-xmin,xmax-x,z-zmin,zmax-z);return Math.min(heightAt(x,z)-.05,BOTTOM+.295*Math.exp(-d/.20));}
export function build(ctx){
 const group=new THREE.Group();group.name='terrain-ground';group.userData.heightAt=heightAt;group.userData.surfaceAt=surfaceAt;
 const pos=[],col=[],indices=[];
 const grass=new THREE.Color('#596032'), desert=new THREE.Color('#9d8774');
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){
  const k=j*nx+i;pos.push(xmin+i*dx,heights[k],zmin+j*dz);
  const c=grass.clone().lerp(desert,sand[k]);c.multiplyScalar(1+tone[k]*4);col.push(c.r,c.g,c.b);
 }
 for(let j=0;j<nz-1;j++)for(let i=0;i<nx-1;i++){const k=j*nx+i;if((i+j)%2)indices.push(k,k+nx,k+1,k+1,k+nx,k+nx+1);else indices.push(k,k+nx,k+nx+1,k,k+nx+1,k+1);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(col,3));geo.setIndex(indices);geo.computeVertexNormals();
 const land=new THREE.Mesh(geo,mat('#ffffff',{vertexColors:true}));land.name='continuous-carved-ground';land.receiveShadow=true;land.castShadow=true;group.add(land);
 // Close every perimeter segment and the underside using the same top boundary vertices.
 const ring=[];for(let i=0;i<nx;i++)ring.push(i);for(let j=1;j<nz;j++)ring.push(j*nx+nx-1);for(let i=nx-2;i>=0;i--)ring.push((nz-1)*nx+i);for(let j=nz-2;j>0;j--)ring.push(j*nx);
 const sidePos=[],sideCol=[];
 for(let a=0;a<ring.length;a++){const ia=ring[a],ib=ring[(a+1)%ring.length];const va=new THREE.Vector3().fromArray(pos,ia*3),vb=new THREE.Vector3().fromArray(pos,ib*3),ba=va.clone().setY(undersideAt(va.x,va.z)),bb=vb.clone().setY(undersideAt(vb.x,vb.z));for(const v of [va,vb,ba,vb,bb,ba]){sidePos.push(v.x,v.y,v.z);const c=grass.clone().lerp(desert,sand[ia]).multiplyScalar(.85);sideCol.push(c.r,c.g,c.b);}}
 const sideGeo=new THREE.BufferGeometry();sideGeo.setAttribute('position',new THREE.Float32BufferAttribute(sidePos,3));sideGeo.setAttribute('color',new THREE.Float32BufferAttribute(sideCol,3));sideGeo.computeVertexNormals();const sides=new THREE.Mesh(sideGeo,mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}));sides.name='closed-soil-perimeter';sides.receiveShadow=true;group.add(sides);
 const bp=[...pos];for(let k=0;k<heights.length;k++)bp[k*3+1]=undersideAt(bp[k*3],bp[k*3+2]);const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.Float32BufferAttribute(bp,3));bg.setIndex([...indices].reverse());bg.computeVertexNormals();const bottom=new THREE.Mesh(bg,mat('#413b20'));bottom.name='closed-tapered-underside';group.add(bottom);
 // Clip each water triangle at the terrain's signed shoreline, including exact outer edges.
 const wp=[],wc=[],deep=new THREE.Color('#9bc6df'),edge=new THREE.Color('#4598c8');
 function waterColor(v){const gx=sample(waterDistance,v.x+.065,v.z)-sample(waterDistance,v.x-.065,v.z),gz=sample(waterDistance,v.x,v.z+.065)-sample(waterDistance,v.x,v.z-.065);const left=Math.max(0,-(gx*.796+gz*.605)/(Math.hypot(gx,gz)+1e-6));const width=.075+.24*left;let t=Math.min(1,Math.max(0,(-v.d/width-.26)/.74));t=t*t*(3-2*t);return edge.clone().lerp(deep,t);}
 function vertex(k){return {x:pos[k*3],z:pos[k*3+2],d:waterDistance[k]};}
 function emit(a,b,c){for(const v of [a,b,c]){wp.push(v.x,WATER,v.z);const color=waterColor(v);wc.push(color.r,color.g,color.b);}}
 for(let t=0;t<indices.length;t+=3){let poly=indices.slice(t,t+3).map(vertex),out=[];for(let n=0;n<3;n++){const a=poly[n],b=poly[(n+1)%3];if(a.d<=0)out.push(a);if((a.d<0)!==(b.d<0)){const f=a.d/(a.d-b.d);out.push({x:a.x+(b.x-a.x)*f,z:a.z+(b.z-a.z)*f,d:0});}}for(let n=1;n<out.length-1;n++)emit(out[0],out[n],out[n+1]);}
 const wg=new THREE.BufferGeometry();wg.setAttribute('position',new THREE.Float32BufferAttribute(wp,3));wg.setAttribute('color',new THREE.Float32BufferAttribute(wc,3));wg.computeVertexNormals();const water=new THREE.Mesh(wg,new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false}));water.name='connected-recessed-water';group.add(water);
 // Give each boundary outflow a visible water cross section down to the riverbed.
 const outlet=[];for(let n=0;n<ring.length;n++){let a=vertex(ring[n]),b=vertex(ring[(n+1)%ring.length]);if(a.d>0&&b.d>0)continue;if(a.d>0||b.d>0){let f=a.d/(a.d-b.d),p={x:a.x+(b.x-a.x)*f,z:a.z+(b.z-a.z)*f,d:0};if(a.d>0)a=p;else b=p;}const ya=Math.max(BOTTOM,heightAt(a.x,a.z)),yb=Math.max(BOTTOM,heightAt(b.x,b.z));outlet.push(a.x,WATER,a.z,b.x,WATER,b.z,a.x,ya,a.z,b.x,WATER,b.z,b.x,yb,b.z,a.x,ya,a.z);}
 const og=new THREE.BufferGeometry();og.setAttribute('position',new THREE.Float32BufferAttribute(outlet,3));og.computeVertexNormals();const om=new THREE.Mesh(og,new THREE.MeshBasicMaterial({color:'#72abc4',toneMapped:false,side:THREE.DoubleSide}));om.name='outflow-cross-sections';group.add(om);
 // Small three-dimensional soil crumbs, not trees or boulders, follow the ground surface.
 const count=3200,crumbGeo=new THREE.TetrahedronGeometry(.024),crumbs=new THREE.InstancedMesh(crumbGeo,mat('#3e4720'),count);const dummy=new THREE.Object3D();let seed=10477;function rand(){seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;}let placed=0;
 for(let trial=0;trial<count*5&&placed<count;trial++){let x=xmin+.05+rand()*(xmax-xmin-.1),z=zmin+.05+rand()*(zmax-zmin-.1);if(sample(waterDistance,x,z)<.15||sample(clearance,x,z)<.35||sample(sand,x,z)>.7)continue;dummy.position.set(x,heightAt(x,z)+.014,z);dummy.rotation.set(rand(),rand()*6.28,rand());dummy.scale.set(.4+rand()*.7,.5+rand()*1.3,.4+rand()*.8);dummy.updateMatrix();crumbs.setMatrixAt(placed++,dummy.matrix);}crumbs.count=placed;crumbs.name='tiny-earth-specks';crumbs.receiveShadow=true;group.add(crumbs);
 return group;
}
