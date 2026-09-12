import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {ExtrudeGeometry} from '/data/zhiqi/CodeWorld2/.render-tools/node_modules/three/build/three.module.js';
import {FontLoader} from '/data/zhiqi/CodeWorld2/.render-tools/node_modules/three/examples/jsm/loaders/FontLoader.js';
const root=path.dirname(fileURLToPath(import.meta.url));
const read=name=>JSON.parse(fs.readFileSync(path.join(root,name)));
const write=(name,data)=>fs.writeFileSync(path.join(root,name),JSON.stringify(data,null,2)+'\n');
const p=read('parameters.json');
const font=new FontLoader().parse(JSON.parse(fs.readFileSync('/data/zhiqi/CodeWorld2/.render-tools/node_modules/three/examples/fonts/helvetiker_regular.typeface.json')));
const components=[{id:'school-sign/board',type:'box',position:[(p.x0+p.x1)/2,(p.y0+p.y1)/2,p.z-p.depth/2],size:[p.x1-p.x0,p.y1-p.y0,p.depth],colors:p.boardColors}];
let cursor=p.textX;
for(let i=0;i<p.text.length;i++){
 if(p.offsets)cursor=p.textX+p.offsets[i];
 const letter=p.text[i];
 const g=new ExtrudeGeometry(font.generateShapes(letter,1),{depth:p.letterDepth,bevelEnabled:false,curveSegments:16});
 g.computeBoundingBox();
 const b=g.boundingBox;
 const a=g.getAttribute('position');
 const vertices=[];
 for(let j=0;j<a.count;j++){
  const x=cursor+(a.getX(j)-b.min.x)/(b.max.x-b.min.x)*p.widths[i];
  vertices.push([x,p.textY+(a.getY(j)-b.min.y)/(b.max.y-b.min.y)*p.textHeight+(p.textSlope||0)*(x-p.textX),p.z+.001+a.getZ(j)]);
 }
 components.push({id:`school-sign/letter-${i}-${letter}`,type:'triangles',vertices,indices:g.index?Array.from(g.index.array):Array.from({length:a.count},(_,k)=>k),color:p.textColor});
 cursor+=p.widths[i]+p.gap;
}
const part={node:'school-sign',camera_contract_sha256:read('view.json').camera_contract_sha256,components,children:[],child_refs:[],generator:'generate.mjs',parameters:'parameters.json'};
write('candidate.json',part);
write('preview.json',{camera_contract_sha256:part.camera_contract_sha256,components:[...read('parent-context.json').components,...components]});
console.log(JSON.stringify({components:components.length,letterEnd:cursor-p.gap}));
