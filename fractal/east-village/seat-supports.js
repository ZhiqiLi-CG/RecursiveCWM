import {THREE} from '../scene/common.js';
// Complete existing low supports beneath grade without moving any child anchor or upper silhouette.
// Only low-ended solid geometry is eligible; suspended goods and roof members are untouched.
export function seatSupports(group){
 group.updateMatrixWorld(true);let count=0;
 group.traverse(mesh=>{
  if(!mesh.isMesh||!mesh.geometry.attributes.position)return;
  const bounds=new THREE.Box3().setFromObject(mesh);
  if(bounds.min.y<.043||bounds.min.y>.075||bounds.max.y-bounds.min.y<.017)return;
  const geo=mesh.geometry.clone(),pos=geo.attributes.position,inv=mesh.matrixWorld.clone().invert();let changed=false;
  for(let i=0;i<pos.count;i++){
   const p=new THREE.Vector3().fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld);
   if(p.y<=.075){p.y-=.12;p.applyMatrix4(inv);pos.setXYZ(i,p.x,p.y,p.z);changed=true;}
  }
  if(changed){pos.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();mesh.geometry=geo;count++;}else geo.dispose();
 });return count;
}
