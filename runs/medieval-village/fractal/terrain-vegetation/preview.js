// Review only: consume sibling ground without modifying it.
import {THREE} from '../scene/common.js';
import {build as ground,heightAt,surfaceAt} from '../terrain-ground/ground.js';
import {build as vegetation} from './vegetation.js';
import {applyForestFloor} from './forest-floor.js';
const query=new URLSearchParams(location.search);
const mountain=query.has('mountain')?await import('../terrain-mountain/mountain.js'):null;
export function build(ctx){const g=new THREE.Group();g.name='vegetation-integration-review';const planted={...ctx,heightAt,surfaceAt};const soil=ground(ctx);if(!query.has('no-floor'))applyForestFloor(soil,planted);g.add(soil);g.add(vegetation(planted));if(mountain)g.add(mountain.build(ctx));return g;}
