import {THREE,box} from '../scene/common.js';
import {build as north} from '../west-north-houses/component.js';
import {build as south} from '../west-south-houses/component.js';
import {build as east} from '../west-east-houses/component.js';
import {build as market} from '../west-market/component.js';
export function build(ctx){
 const g=new THREE.Group();g.name='west-village';
 const n=north(ctx),s=south(ctx),e=east(ctx),m=market(ctx);
 // Integration adjustments live here; delivered child sources stay intact.
 const tall=n.getObjectByName('moss-timber-house');
 tall.rotation.y=1.45;
 tall.scale.set(.98,.96,.85);
 tall.position.copy(ctx.pixelToWorld(227,466,.06));
 for(const mesh of tall.children){
  if(mesh.isMesh&&mesh.geometry.type==='BoxGeometry'&&mesh.geometry.parameters.height===.078&&mesh.position.x>0){mesh.material=mesh.material.clone();mesh.material.color.set('#987046');}
 }
 // A low, closed entrance wing carries the ochre thatch visible below the moss roof.
 for(const item of [...tall.children]){if(item.isGroup&&item.position.z<-.30&&item.position.y>.9)tall.remove(item);}
 const wing=new THREE.Group();wing.name='western-entrance-wing';tall.add(wing);
 box(wing,0,.17,-.395,.66,.46,.27,'#7d8377');
 box(wing,0,.43,-.395,.66,.13,.27,'#aaa895');
 for(const x of [-.33,.33])box(wing,x,.40,-.54,.035,.43,.035,'#302a20');
 box(wing,0,.46,-.55,.68,.035,.025,'#302a20');
 const leanRoof=box(wing,0,.82,-.395,.78,.055,Math.hypot(.27,.34),'#987046');
 leanRoof.rotation.x=-Math.atan2(.34,.27);
 // Seal both triangular roof-to-wall wedges with solid gable profiles.
 const sh=new THREE.Shape();sh.moveTo(-.53,.48);sh.lineTo(-.26,.48);sh.lineTo(-.26,.99);sh.lineTo(-.53,.65);sh.closePath();
 const wedge=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:.66,bevelEnabled:false}),new THREE.MeshStandardMaterial({color:'#a19a80',roughness:1}));
 wedge.rotation.y=-Math.PI/2;wedge.position.x=.33;wedge.castShadow=true;wing.add(wedge);
 box(wing,0,.37,-.548,.30,.21,.025,'#b5b5a4');
 box(wing,0,.37,-.565,.24,.16,.020,'#3a413e');
 box(wing,0,.37,-.581,.024,.17,.018,'#aaa895');
 box(wing,0,.37,-.581,.25,.018,.018,'#aaa895');
 const tent=m.getObjectByName('western-cream-tent');
 tent.rotation.y=.5;
 for(const mesh of tent.children){if(mesh.isMesh&&mesh.geometry.type==='ExtrudeGeometry'){mesh.material=mesh.material.clone();mesh.material.color.set('#aaa293');}}
 // The eastern canopy is an attached-looking market edge without wall penetration.
 g.add(n,s,e,m);
 return g;
}
