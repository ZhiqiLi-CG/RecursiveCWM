import {THREE,mat,box} from '../scene/common.js';
import {build as barn} from './barn.js';
export function build(ctx,omit=[]){const g=new THREE.Group();g.name='east-farmstead-snapshot';g.add(barn(ctx));
for(const [x,y,color,owner] of [[712,310,'#6f7460','east-farmyard'],[764,344,'#765446','east-farmyard'],[839,340,'#765446','east-tile-house'],[806,375,'#6f7460','east-blue-mill']]){if(omit.includes(owner))continue;const p=ctx.pixelToWorld(x,y);box(g,p.x,.24,p.z,.62,.48,.78,'#c4bea0');const roof=new THREE.Mesh(new THREE.CylinderGeometry(0,.56,.40,4),mat(color));roof.scale.z=1.28;roof.rotation.y=Math.PI/4;roof.position.set(p.x,.66,p.z);roof.castShadow=true;g.add(roof);}return g;}
