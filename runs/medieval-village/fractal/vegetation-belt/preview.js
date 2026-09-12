// Local diagnostic view: remove the inherited cone which occludes the real belt.
import {buildTerrain} from '../scene/blockout.js';
import {build as forest} from './forest.js';
export function build(ctx){const g=buildTerrain(ctx);g.remove(g.children[g.children.length-1]);g.add(forest(ctx));return g;}
