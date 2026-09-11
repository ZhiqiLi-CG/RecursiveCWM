import {THREE} from '../scene/common.js';
import {buildSettlements} from '../scene/blockout.js';
import {build as network} from '../settlements/network.js';
export function build(ctx){const g=new THREE.Group();g.add(network(ctx)); const old=buildSettlements(ctx);for(const m of [...old.children].slice(15,23))g.add(m);return g;}
