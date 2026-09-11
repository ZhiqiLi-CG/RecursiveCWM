// Read-only visual baseline for descendant preview harnesses; remove at final integration.
import {THREE,mat,box} from '../scene/common.js';
export function build(ctx,omit=[]){const g=new THREE.Group();g.name='east-inherited-placeholders';
const houses=[[9,712,310,'east-farmstead'],[10,764,344,'east-farmstead'],[11,839,340,'east-farmstead'],[12,806,375,'east-farmstead'],[13,835,405,'east-farmstead'],[14,884,445,'east-market'],[15,980,505,'east-lakeside'],[16,1067,476,'east-lakeside'],[17,1099,430,'east-lakeside']];
for(const [i,x,y,region] of houses){if(omit.includes(region))continue;let p=ctx.pixelToWorld(x,y);box(g,p.x,.24,p.z,.62,.48,.78,'#c4bea0');let roof=new THREE.Mesh(new THREE.CylinderGeometry(0,.56,.40,4,1),mat(i%3===0?'#6f7460':'#765446'));roof.scale.set(1,1,1.28);roof.rotation.y=Math.PI/4;roof.position.set(p.x,.66,p.z);roof.castShadow=true;g.add(roof);}return g;}
