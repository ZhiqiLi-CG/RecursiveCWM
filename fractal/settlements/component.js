import {THREE} from '../scene/common.js';
import {build as network} from './network.js';
import {build as lamps} from './lamps.js';
import {build as west} from '../west-village/component.js';
import {build as east} from '../east-village/component.js';
import {build as adobe} from '../adobe-village/component.js';
export function build(ctx){const g=new THREE.Group();g.name='settlements';g.add(network(ctx),west(ctx),east(ctx),adobe(ctx),lamps(ctx));return g;}
