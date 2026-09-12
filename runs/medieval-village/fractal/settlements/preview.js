import {THREE} from '../scene/common.js';
import {buildSettlements} from '../scene/blockout.js';
import {build as network} from './network.js';
export function build(ctx){const g=new THREE.Group();g.add(network(ctx));const old=buildSettlements(ctx);for(const child of [...old.children].slice(5))g.add(child);return g;}
