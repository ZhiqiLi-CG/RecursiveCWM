import {THREE,mat,box,polygon,ribbon} from './common.js';
export function buildTerrain(ctx){let g=new THREE.Group();g.name='terrain-blockout';let [xmin,xmax,zmin,zmax]=ctx.contract.world.tile_bounds;box(g,0,-.10,0,xmax-xmin,.2,zmax-zmin,'#818c4d');
polygon(ctx,g,[[218,482],[400,494],[481,554],[466,602],[563,622],[588,570],[694,645],[744,760],[487,900]],'#c5b396',.015);
const water='#83c8e4';
polygon(ctx,g,[[583,378],[609,361],[640,359],[664,341],[690,350],[712,365],[741,370],[735,399],[750,427],[736,449],[760,466],[716,474],[687,458],[650,470],[617,452],[577,460],[566,444],[578,415],[570,393]],water,.025);
ribbon(ctx,g,[[502,199],[476,212],[526,246],[513,276],[511,297],[537,320],[540,345],[570,369]],.66,water);
ribbon(ctx,g,[[594,184],[592,235],[613,259],[609,282],[653,309],[674,341],[671,369]],.4,water);
ribbon(ctx,g,[[592,448],[550,478],[539,506],[558,546],[535,593],[543,624],[508,677],[507,725],[478,781],[476,829],[474,878],[488,900]],.80,water);
ribbon(ctx,g,[[741,451],[791,466],[825,494],[886,503],[933,521],[968,546],[979,566],[1001,577]],.68,water);
polygon(ctx,g,[[964,333],[992,316],[1018,323],[1030,317],[1058,320],[1070,332],[1084,348],[1077,372],[1043,384],[1002,379],[974,367]],water,.025);
polygon(ctx,g,[[1137,441],[1154,443],[1171,455],[1207,438],[1236,442],[1217,465],[1168,477],[1145,461]],water,.025);
// A solid mountain mass: placeholders deliberately await the terrain child's detailed solve.
let center=ctx.pixelToWorld(790,211);let geo=new THREE.ConeGeometry(5.1,4.3,9,3);let m=new THREE.Mesh(geo,mat('#dce3e3',{flatShading:true}));m.position.set(center.x,2.15,center.z);m.scale.set(1.14,1,.67);m.castShadow=true;m.receiveShadow=true;g.add(m);
return g;}
export function buildSettlements(ctx){let g=new THREE.Group();g.name='settlement-blockout';let roads=[[[76,379],[128,379],[157,401],[208,408],[279,438],[366,444],[446,430],[526,430],[552,453],[608,479],[700,491],[791,454],[869,464],[947,465],[1012,429],[1098,403],[1174,420],[1250,392],[1290,390]],[[230,464],[248,490],[223,550]],[[371,479],[416,513],[443,583],[487,632],[548,649],[599,690],[627,754]],[[520,429],[555,378],[617,350],[669,303],[731,274],[768,276],[824,304],[864,312],[899,355],[948,372],[1012,429]],[[862,305],[919,271],[970,282],[1010,257]]];for(let r of roads)ribbon(ctx,g,r,.27,'#bcad92',.07);
let houses=[[217,464],[294,417],[291,483],[343,520],[383,535],[423,488],[480,479],[506,449],[505,407],[712,310],[764,344],[839,340],[806,375],[835,405],[884,445],[980,505],[1067,476],[1099,430],[599,612],[411,711],[562,702],[655,684],[651,736],[599,787]];
for(let [i,pix] of houses.entries()){let p=ctx.pixelToWorld(...pix);let desert=i>=18;box(g,p.x,.24,p.z,.62,.48,.78,desert?'#bbab92':'#c4bea0');if(!desert){let roof=new THREE.Mesh(new THREE.CylinderGeometry(0,.56,.40,4,1),mat(i%3===0?'#6f7460':'#765446'));roof.scale.set(1,1,1.28);roof.rotation.y=Math.PI/4;roof.position.set(p.x,.66,p.z);roof.castShadow=true;g.add(roof);}}
return g;}
