import {THREE,mat,box} from '../scene/common.js';
import {heightAt} from '../terrain-ground/ground.js';
export function build(ctx){const g=new THREE.Group();g.name='connecting-lane-lamps';const wood=mat('#615a47'),metal=mat('#4d514a'),glass=mat('#afa383');
for(const [x,y] of [[541,407],[555,416],[553,434],[584,355],[595,361],[609,356],[738,483]]){const p=ctx.pixelToWorld(x,y,.04),a=new THREE.Group();a.position.set(p.x,heightAt(p.x,p.z),p.z);g.add(a);const h=.46;box(a,0,h/2-.025,0,.016,h+.05,.016,wood);box(a,0,h,0,.033,.043,.033,glass);for(const dx of [-1,1])for(const dz of [-1,1])box(a,dx*.019,h,dz*.019,.006,.052,.006,metal);box(a,0,h+.029,0,.055,.015,.055,metal);box(a,0,h-.03,0,.05,.012,.05,metal);}return g;}
