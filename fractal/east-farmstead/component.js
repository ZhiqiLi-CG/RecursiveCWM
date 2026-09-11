import {THREE} from '../scene/common.js';
import {build as farmyard} from '../east-farmyard/component.js';
import {build as mill} from '../east-blue-mill/component.js';
import {build as house} from '../east-tile-house/component.js';
import {build as barn} from './barn.js';
// Extend the low ends of existing solid supports into the shared terrain.
// Upper geometry and all child camera-calibrated anchors stay fixed.
function seatSupports(group){
 group.updateMatrixWorld(true);let count=0;
 group.traverse(mesh=>{if(!mesh.isMesh||mesh.geometry.type!=='BoxGeometry')return;
  const geo=mesh.geometry.clone(),pos=geo.attributes.position,inv=mesh.matrixWorld.clone().invert();let changed=false;
  for(let i=0;i<pos.count;i++){const p=new THREE.Vector3().fromBufferAttribute(pos,i).applyMatrix4(mesh.matrixWorld);
   if(p.y>=.045&&p.y<=.068){p.y-=.115;p.applyMatrix4(inv);pos.setXYZ(i,p.x,p.y,p.z);changed=true;}
  }
  if(changed){pos.needsUpdate=true;geo.computeVertexNormals();geo.computeBoundingBox();geo.computeBoundingSphere();mesh.geometry=geo;count++;}else geo.dispose();
 });group.userData.seatedSupportMeshes=count;
}
export function build(ctx){const g=new THREE.Group();g.name='east-farmstead';g.add(farmyard(ctx),mill(ctx),house(ctx),barn(ctx));seatSupports(g);return g;}
