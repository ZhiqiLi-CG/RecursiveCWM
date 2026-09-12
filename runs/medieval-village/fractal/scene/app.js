import {THREE,makeCamera,context} from './common.js';
import {buildTerrain,buildSettlements} from './blockout.js';
import {build} from './component.js';
import {drawBackground,drawGraphics} from './graphics.js';
const query=new URLSearchParams(location.search);let contract=await fetch('../../camera-contract.json').then(r=>r.json());const w=contract.width,h=contract.height;
const camera=makeCamera(contract),ctx=context(camera,contract),scene=new THREE.Scene();
scene.add(new THREE.HemisphereLight('#f4f9ff','#625840',1.8));let sun=new THREE.DirectionalLight('#fff2d9',3);sun.position.set(-15,22,-18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-24;sun.shadow.camera.right=24;sun.shadow.camera.top=24;sun.shadow.camera.bottom=-24;sun.shadow.bias=-.0005;scene.add(sun);
if(query.has('sun-height'))sun.position.y=Number(query.get('sun-height'));if(query.has('sun'))sun.intensity=Number(query.get('sun'));if(query.has('ambient'))scene.children.find(o=>o.isHemisphereLight).intensity=Number(query.get('ambient'));sun.shadow.normalBias=.015;
if(!query.has('terrain')&&!query.has('settlements')&&!query.has('blockout')){scene.add(build(ctx));}else{let terrain=query.has('terrain')?(await import(query.get('terrain'))).build(ctx):buildTerrain(ctx),settlements=query.has('settlements')?(await import(query.get('settlements'))).build(ctx):buildSettlements(ctx);scene.add(terrain,settlements);}
if(query.get('compass')){let a=Number(query.get('compass'))*Math.PI/2;camera.position.set(40*Math.sin(a),31,40*Math.cos(a));camera.lookAt(0,0,0);camera.updateMatrixWorld();}
const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});renderer.setSize(w,h);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1;renderer.setClearColor(0,0);document.body.insertBefore(renderer.domElement,document.getElementById('ui'));
drawBackground(document.getElementById('bg'),w,h);if(!query.has('compass')&&!query.has('no-ui'))drawGraphics(document.getElementById('ui'),w,h);renderer.render(scene,camera);window.sceneReady=true;window.sceneContext={scene,camera,ctx,renderer};
