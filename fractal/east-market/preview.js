import {THREE} from '../scene/common.js';
import {build as network} from '../settlements/network.js';
import {build as baseline} from '../east-village/baseline.js';
import {build as lamps} from '../east-village/lamps.js';
import {build as component} from './component.js';
export function build(ctx){const g=new THREE.Group();g.add(network(ctx),baseline(ctx,['east-market']),lamps(ctx),component(ctx));return g;}
