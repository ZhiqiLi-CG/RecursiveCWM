import {THREE,mat} from '../scene/common.js';
import {points,faces,referenceRelief} from './topology.js';
// Root-pixel control lines are converted to true world-space surfaces by the fixed camera.
const crest=[[526,131],[543,125],[554,113],[573,107],[590,95],[607,97],[626,90],[646,82],[659,71],[675,68],[693,71],[714,66],[733,46],[750,39],[764,29],[779,28],[790,22],[799,17],[810,24],[820,21],[834,32],[847,29],[861,48],[877,56],[886,65],[898,66],[913,77],[925,94],[940,99],[955,108],[970,118],[990,133]];
const lip=[[526,135],[545,145],[566,149],[585,157],[605,145],[623,153],[640,169],[655,177],[679,181],[699,192],[720,185],[742,189],[765,176],[786,180],[810,192],[830,192],[852,205],[873,206],[897,195],[920,190],[945,178],[968,181],[990,147]];
const foot=[[526,190],[549,192],[574,195],[593,197],[613,201],[637,217],[666,224],[700,230],[742,228],[774,225],[802,231],[833,237],[859,239],[887,232],[915,229],[945,217],[972,210],[990,205]];
const lerp=(a,b,t)=>a+(b-a)*t;
function line(a,x){let i=0;while(i<a.length-2&&x>a[i+1][0])i++;return lerp(a[i][1],a[i+1][1],(x-a[i][0])/(a[i+1][0]-a[i][0]));}
function hash(x,y){let a=Math.sin(x*127.1+y*311.7+51.67)*43758.5453;return a-Math.floor(a);}
function noise(x,y){let i=Math.floor(x),j=Math.floor(y),u=x-i,v=y-j;u=u*u*(3-2*u);v=v*v*(3-2*v);return lerp(lerp(hash(i,j),hash(i+1,j),u),lerp(hash(i,j+1),hash(i+1,j+1),u),v);}
export function build(ctx){
 const g=new THREE.Group();g.name='snow-massif';
 const snow=mat('#dadde2',{vertexColors:true,roughness:.94,emissive:'#426f9c',emissiveIntensity:.28,flatShading:false});
 const rock=mat('#6b5738',{vertexColors:true,roughness:1,flatShading:true});
 const pos=[],colors=[],indices=[],rockPos=[],rockColors=[];
 const U=232,V=52,top=[];
 function add(p,c=1){pos.push(p.x,p.y,p.z);colors.push(c,c,c);return pos.length/3-1;}
 function tri(a,b,c){let A=new THREE.Vector3(...pos.slice(a*3,a*3+3)),B=new THREE.Vector3(...pos.slice(b*3,b*3+3)),C=new THREE.Vector3(...pos.slice(c*3,c*3+3));if(B.sub(A).cross(C.sub(A)).y<0)indices.push(a,c,b);else indices.push(a,b,c);}
 for(const [k,[x,y]] of points.entries()){
   const u=(x-526)/464,back=line(crest,x),front=line(lip,x),v=(y-back)/(front-back);
   let hf=2.04+.28*Math.sin(u*3.4)+.11*Math.cos(u*24),hb=hf+Math.min(1.55,(front-back)*.015);
   let p=ctx.pixelToWorld(x,y,lerp(hb,hf,v));
   const warp=noise(x/39,y/35)*12;
   const relief=(noise((x+warp)/17,y/16)-.5)*.65+(noise(x/9,y/9)-.5)*.20;
   const ridge=Math.pow(1-Math.abs(2*noise((x+warp)/43,y/27)-1),2)*.44;
   p.y+=(referenceRelief[k]*1.05+(relief+ridge-.02)*.12)*Math.min(1,(front-back)/65)*Math.pow(Math.max(0,Math.sin(Math.PI*v)),.55)*Math.pow(Math.max(0,Math.sin(Math.PI*u)),.25);
   for(let n=0;n<3;n++){const pix=ctx.worldToPixel(p),limit=line(crest,Math.max(526,Math.min(990,pix[0])))+.15;if(pix[1]<limit)p.y-=(limit-pix[1])*.038;}
   add(p,.96+.065*noise(x/14,y/16));
 }
 top[0]=Array.from({length:U+1},(_,i)=>i);
 top[V]=Array.from({length:U+1},(_,i)=>i+U+1);
 for(const f of faces)tri(...f);
 // Each cliff column descends to a distinct irregular snow tongue, then into solid rock.
 const frontRings=[top[V]],rearRings=[top[0]],frontFeet=[],rearFeet=[];
 for(let j=1;j<=12;j++){
  const ring=[];for(let i=0;i<=U;i++){
   const u=i/U,x=526+464*u,v=j/12,topP=new THREE.Vector3(...pos.slice(top[V][i]*3,top[V][i]*3+3));
   let by=line(foot,x)-22*Math.exp(-Math.pow((x-593)/8,2)),fp=ctx.pixelToWorld(x,by,0.025);
   // The eastern source is a recessed chute through the escarpment, not a plugged channel.
   const chute=Math.exp(-Math.pow((x-593)/9,2));
   fp.lerp(topP,.13*chute);fp.y=.025;
   frontFeet[i]=fp;
   const fringe=.32+.62*hash(i,32)+.035*Math.sin(i*2.3);
   const t=v*fringe;
   let p=topP.clone().lerp(fp,t);
   const n=new THREE.Vector3(fp.x-topP.x,0,fp.z-topP.z).normalize();
   p.addScaledVector(n,(noise(i*.24,1)-.5)*.10*Math.sin(Math.PI*t));
   ring.push(add(p,.93+.065*noise(i*.17,j*.13)));
  }frontRings.push(ring);
 }
 function connect(rings,reverse=false){for(let j=0;j<rings.length-1;j++)for(let i=0;i<U;i++){const a=rings[j][i],b=rings[j][i+1],c=rings[j+1][i],d=rings[j+1][i+1];indices.push(...(reverse?[a,c,b,b,c,d]:[a,b,c,b,d,c]));}}
 // Correct cliff winding by outward orientation, with a single-sided physical surface.
 connect(frontRings,true);
 function rockTri(a,b,c){rockPos.push(...a.toArray(),...b.toArray(),...c.toArray());const v=.86+.22*noise(a.x*3,a.z*3);for(let k=0;k<3;k++)rockColors.push(v,v,v);}
 for(let i=0;i<U;i++){
   let a=new THREE.Vector3(...pos.slice(frontRings[12][i]*3,frontRings[12][i]*3+3)),b=new THREE.Vector3(...pos.slice(frontRings[12][i+1]*3,frontRings[12][i+1]*3+3));
   rockTri(a,frontFeet[i],b);rockTri(b,frontFeet[i],frontFeet[i+1]);
 }
 // Hidden rear slopes run down to the two rear tile boundaries, never outside them.
 for(let j=1;j<=25;j++){const ring=[];for(let i=0;i<=U;i++){
  const u=i/U,fringe=.63+.22*noise(i*.17,4),t=j<=20?j/20*fringe:lerp(fringe,1,(j-20)/5),tp=new THREE.Vector3(...pos.slice(top[0][i]*3,top[0][i]*3+3));
  let fp=tp.clone();const dx=12.38-tp.x,dz=tp.z+9.95;
  if(dx<dz) {fp.x=12.38;fp.z-=Math.min(.6,dz*.45);} else {fp.z=-9.95;fp.x+=Math.min(.6,dx*.45);}
  fp.y=.015;rearFeet[i]=fp;
  let p=tp.clone().lerp(fp,t);
  p.y=lerp(tp.y,.015,1-Math.pow(1-t,1.35))+Math.sin(Math.PI*t)*(1.2*(noise(i*.19+t*.7,t*3.7)-.50)+.30*Math.sin(i*.11+t*4));
  p.y=Math.max(.015,p.y);
  ring.push(add(p,.88+.12*noise(i*.2,t*9)));
 }rearRings.push(ring);}
 connect(rearRings.slice(0,21),false);
 for(let j=20;j<25;j++)for(let i=0;i<U;i++){
   const at=(row,col)=>new THREE.Vector3(...pos.slice(rearRings[row][col]*3,rearRings[row][col]*3+3));
   rockTri(at(j,i),at(j,i+1),at(j+1,i));rockTri(at(j,i+1),at(j+1,i+1),at(j+1,i));
 }
 // End caps and base close the mass. These are full faces, not backdrop skirts.
 for(const i of [0,U]){
  const at=(index)=>new THREE.Vector3(...pos.slice(index*3,index*3+3));
  const outline=[at(top[0][i]),...frontRings.map(r=>at(r[i])),frontFeet[i],rearFeet[i],...rearRings.slice(1,-1).reverse().map(r=>at(r[i]))];
  const center=outline.reduce((p,v)=>p.add(v),new THREE.Vector3()).multiplyScalar(1/outline.length);
  const outward=ctx.pixelToWorld(i===0?510:1006,180,0).sub(ctx.pixelToWorld(i===0?526:990,180,0));
  for(let k=0;k<outline.length;k++){
   let a=outline[k],b=outline[(k+1)%outline.length];
   const n=a.clone().sub(center).cross(b.clone().sub(center));
   if(n.dot(outward)<0)[a,b]=[b,a];rockTri(center,a,b);
  }
 }
 for(let i=0;i<U;i++){rockTri(frontFeet[i],rearFeet[i],frontFeet[i+1]);rockTri(frontFeet[i+1],rearFeet[i],rearFeet[i+1]);}
 function mesh(p,c,idx,m,name){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(c,3));if(idx)geo.setIndex(idx);geo.computeVertexNormals();let o=new THREE.Mesh(geo,m);o.name=name;o.castShadow=true;o.receiveShadow=true;g.add(o);}
 // Orient the welded snow/rock shell as one manifold, including tiny concave end facets.
 const rockIndices=Array.from({length:rockPos.length/3},(_,i)=>i);
 const refs=[],edgeMap=new Map();
 for(const [p,ix] of [[pos,indices],[rockPos,rockIndices]]){
  const keys=Array.from({length:p.length/3},(_,i)=>p.slice(i*3,i*3+3).map(v=>Math.round(v*100000)).join(','));
  for(let k=0;k<ix.length;k+=3){const id=refs.length;refs.push({ix,k});
   for(let e=0;e<3;e++){const a=keys[ix[k+e]],b=keys[ix[k+(e+1)%3]],key=[a,b].sort().join('|');
    if(!edgeMap.has(key))edgeMap.set(key,[]);edgeMap.get(key).push([id,a<b?1:-1]);}
  }
 }
 const adj=refs.map(()=>[]);
 for(const edge of edgeMap.values())if(edge.length===2){const [a,b]=edge;adj[a[0]].push([b[0],a[1]===b[1]]);adj[b[0]].push([a[0],a[1]===b[1]]);}
 const flip=new Map([[0,false]]),queue=[0];
 for(let k=0;k<queue.length;k++){let a=queue[k];for(const [b,opposite] of adj[a])if(!flip.has(b)){flip.set(b,flip.get(a)!==opposite);queue.push(b);}}
 for(const [id,f] of flip)if(f){const {ix,k}=refs[id];[ix[k+1],ix[k+2]]=[ix[k+2],ix[k+1]];}
 mesh(pos,colors,indices,snow,'connected snow ridges and cliffs');mesh(rockPos,rockColors,rockIndices,rock,'closed rock foundation');
 return g;
}
