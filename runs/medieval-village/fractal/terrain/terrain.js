import {THREE} from '../scene/common.js';
import {build as buildGround, heightAt, surfaceAt} from '../terrain-ground/ground.js';
import {build as buildMountain} from '../terrain-mountain/mountain.js';
import {build as buildVegetation} from '../terrain-vegetation/vegetation.js';
import {applyForestFloor} from '../terrain-vegetation/forest-floor.js';
import {settleCliff, sourceWaterfall} from './continuity.js';
export {heightAt, surfaceAt};
export function build(ctx) {
  const group = new THREE.Group();
  group.name = 'terrain';
  const grounded = {...ctx, heightAt, surfaceAt};
  const ground = buildGround(grounded);
  applyForestFloor(ground, grounded);
  const mountain = buildMountain(grounded);
  settleCliff(mountain, grounded);
  group.add(ground, mountain, sourceWaterfall(grounded), buildVegetation(grounded));
  group.userData.heightAt = heightAt;
  group.userData.surfaceAt = surfaceAt;
  return group;
}
