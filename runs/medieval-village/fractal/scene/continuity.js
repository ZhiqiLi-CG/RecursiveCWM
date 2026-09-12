import {THREE} from './common.js';
// Final whole-scene size/color reconciliation. Roots, tree count and clearings stay
// fixed; independent parts retain their own source and topology.
export function settleVegetation(terrain) {
 const grove=terrain.getObjectByName('foreground-pine-grove');
 if(!grove)return;
 const palette=new Map();
 for(const tree of grove.children){
  const h=tree.userData.height||1;
  const heightFactor=h<.4?1.3:1.16;
  tree.scale.y*=heightFactor;tree.scale.x*=1.12;tree.scale.z*=1.12;
  tree.userData.height=h*heightFactor;
  tree.traverse(o=>{if(o.isMesh&&o.geometry.type==='BufferGeometry'){
   if(!palette.has(o.material)){let m=o.material.clone();m.color.lerp(new THREE.Color('#78a52b'),.18);palette.set(o.material,m);}
   o.material=palette.get(o.material);
  }});
 }
}

// Break smooth hidden cliff strips into snow-covered buttresses and gullies.
// Move shared snow/rock seam vertices together, leaving the silhouette ring fixed.
export function completeRearRelief(terrain, topCount) {
 const mountain=terrain.getObjectByName('snow-massif');
 const snow=mountain.getObjectByName('connected snow ridges and cliffs');
 const rock=mountain.getObjectByName('closed rock foundation');
 const a=snow.geometry.getAttribute('position'),changes=new Map(),cols=233;
 const key=p=>p.toArray().map(v=>Math.round(v*100000)).join(',');
 const old=new THREE.Vector3();
 for(let j=1;j<25;j++)for(let i=1;i<cols-1;i++){
  const index=topCount+12*cols+(j-1)*cols+i;
  old.fromBufferAttribute(a,index);const p=old.clone();
  const taper=Math.pow(Math.sin(Math.PI*j/25),.8)*Math.pow(Math.sin(Math.PI*i/(cols-1)),.4);
  const broad=.5+.5*Math.sin(i*.225+.75*Math.sin(j*.64));
  const fine=.5+.5*Math.sin(i*.67+j*.81);
  const depth=(.16+.58*broad+.10*fine)*taper;
  const top=new THREE.Vector3().fromBufferAttribute(a,i),base=new THREE.Vector3().fromBufferAttribute(a,topCount+12*cols+24*cols+i);
  const inward=new THREE.Vector3(top.x-base.x,0,top.z-base.z).normalize();
  p.addScaledVector(inward,depth);
  p.y=Math.max(.018,p.y+(.12*Math.sin(i*.35+j*.9)+.06*Math.sin(i*.81-j*.45))*taper);
  changes.set(key(old),p);a.setXYZ(index,p.x,p.y,p.z);
 }
 const r=rock.geometry.getAttribute('position');
 for(let i=0;i<r.count;i++){old.fromBufferAttribute(r,i);const p=changes.get(key(old));if(p)r.setXYZ(i,p.x,p.y,p.z);}
 for(const m of [snow,rock]){m.geometry.attributes.position.needsUpdate=true;m.geometry.computeVertexNormals();m.geometry.computeBoundingBox();m.geometry.computeBoundingSphere();}
 mountain.userData.rootCompletion='Rear snow buttresses and gullies with unchanged top/foot/end rings and welded rock seam';
}
