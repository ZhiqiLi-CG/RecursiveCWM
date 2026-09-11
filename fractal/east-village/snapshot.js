// Provisional district preview. Replace inherited blocks with runner child components at integration.
import {THREE} from '../scene/common.js';
import {build as baseline} from './baseline.js';
import {build as lamps} from './lamps.js';
export function build(ctx){const g=new THREE.Group();g.name='east-village';g.add(baseline(ctx),lamps(ctx));return g;}
