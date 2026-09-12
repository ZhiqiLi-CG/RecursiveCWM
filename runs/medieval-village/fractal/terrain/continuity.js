import {THREE} from '../scene/common.js';
import {points} from '../terrain-mountain/topology.js';
// Sculpt shallow fluting into the front cliff, retaining its projected outline.
// Both coincident rock and snow vertices receive exactly the same transformation.
export function settleCliff(mountain, ctx) {
  const snow = mountain.getObjectByName('connected snow ridges and cliffs');
  const rock = mountain.getObjectByName('closed rock foundation');
  const topCount = points.length, columns = 233;
  const position = snow.geometry.getAttribute('position');
  const replacements = new Map();
  const key = (p) => p.toArray().map(v=>Math.round(v*100000)).join(',');
  const modified = new THREE.Vector3(), original = new THREE.Vector3();
  for(let row=1;row<=12;row++) for(let i=0;i<columns;i++) {
    const index=topCount+(row-1)*columns+i;
    original.fromBufferAttribute(position,index);
    const top = new THREE.Vector3().fromBufferAttribute(position,columns+i);
    const px=ctx.worldToPixel(original), fraction=(top.y-original.y)/Math.max(.01,top.y);
    const u=i/(columns-1);
    const scallop=.5+.5*Math.sin(px[0]*.157+.7*Math.sin(px[0]*.049));
    const finer=Math.sin(px[0]*.39)*.025;
    const taper=Math.sin(Math.PI*Math.min(1,Math.max(0,fraction)))*Math.pow(Math.sin(Math.PI*u),.3);
    const h=original.y+(scallop*.32+finer)*taper;
    modified.copy(ctx.pixelToWorld(px[0],px[1],h));
    replacements.set(key(original),modified.clone());
    position.setXYZ(index,modified.x,modified.y,modified.z);
  }
  const rp=rock.geometry.getAttribute('position');
  for(let i=0;i<rp.count;i++) {original.fromBufferAttribute(rp,i);const p=replacements.get(key(original));if(p)rp.setXYZ(i,p.x,p.y,p.z);}
  for(const mesh of [snow,rock]){mesh.geometry.getAttribute('position').needsUpdate=true;mesh.geometry.computeVertexNormals();mesh.geometry.computeBoundingBox();mesh.geometry.computeBoundingSphere();}
  mountain.userData.integration='Front cliff fluting, locked projected outline, shared welded snow/rock seam';
}
export function sourceWaterfall(ctx) {
  const g=new THREE.Group();g.name='eastern-source-waterfall';
  // A real sloping, narrow body with sides and a bottom, flowing into the existing channel.
  const stations=[[593,180,.88,8],[594,193,.51,9],[598,211,.14,10],[603,229,-.027,10]];
  const vertices=[],faces=[],colors=[];
  const blue=new THREE.Color('#4ba0cd'),light=new THREE.Color('#85bad7');
  for(let j=0;j<stations.length;j++) {
    const [x,y,h,w]=stations[j];
    for(const side of [-1,1]) {
      const p=ctx.pixelToWorld(x+side*w/2,y,h);
      vertices.push(p.x,p.y,p.z,p.x,p.y-.045,p.z);
      const c=blue.clone().lerp(light,j/(stations.length-1)*.8+(side===1?.1:0));colors.push(c.r,c.g,c.b,c.r*.8,c.g*.8,c.b*.8);
    }
    if(j>0){const a=(j-1)*4,b=j*4;faces.push(a,b,a+2,a+2,b,b+2,a+1,a+3,b+1,a+3,b+3,b+1,a,a+1,b,a+1,b+1,b,a+2,b+2,a+3,a+3,b+2,b+3);}
  }
  const end=(stations.length-1)*4;faces.push(0,2,1,1,2,3,end,end+1,end+2,end+1,end+3,end+2);
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(vertices,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(colors,3));geo.setIndex(faces);geo.computeVertexNormals();
  const water=new THREE.Mesh(geo,new THREE.MeshBasicMaterial({vertexColors:true,toneMapped:false,side:THREE.DoubleSide}));water.name='closed-source-cascade';g.add(water);return g;
}
