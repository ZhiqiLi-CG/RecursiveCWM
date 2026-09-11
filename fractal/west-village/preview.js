import {THREE} from '../scene/common.js';
import {build as network} from '../settlements/network.js';
import {build as component} from './component.js';
export function build(ctx){const g=new THREE.Group();g.add(network(ctx),component(ctx));return g;}
