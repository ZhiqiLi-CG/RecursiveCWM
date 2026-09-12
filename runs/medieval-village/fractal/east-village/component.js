import {THREE} from '../scene/common.js';
import {build as farmstead} from '../east-farmstead/component.js';
import {build as market} from '../east-market/component.js';
import {build as lakeside} from '../east-lakeside/component.js';
import {build as windmills} from '../east-windmills/component.js';
import {build as lamps} from './lamps.js';
import {seatSupports} from './seat-supports.js';
export function build(ctx){
 const g=new THREE.Group();g.name='east-village';
 const court=market(ctx),homes=lakeside(ctx),lights=lamps(ctx);
 const seating={market:seatSupports(court),lakeside:seatSupports(homes),lamps:seatSupports(lights)};
 g.add(farmstead(ctx),court,homes,windmills(ctx),lights);g.userData.supportSeating=seating;return g;
}
