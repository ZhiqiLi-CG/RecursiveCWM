// Local review only: completed ground context plus this node's forest.
import {THREE} from '../scene/common.js';
import {build as ground,heightAt,surfaceAt} from '../terrain-ground/ground.js';
import {build as forest} from './forest.js';
export function build(ctx){const g=new THREE.Group();g.add(ground(ctx));g.add(forest({...ctx,heightAt,surfaceAt}));return g;}
