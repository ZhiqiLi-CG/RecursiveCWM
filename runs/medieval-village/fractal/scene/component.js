import {THREE} from './common.js';
import {settleVegetation,completeRearRelief} from './continuity.js';
import {points as mountainPoints} from '../terrain-mountain/topology.js';
import {build as terrainBuild} from '../terrain/terrain.js';
import {build as settlementsBuild} from '../settlements/component.js';
export function build(ctx) {
  const group=new THREE.Group();group.name='medieval-village-map';
  const terrain=terrainBuild(ctx);
  settleVegetation(terrain);
  completeRearRelief(terrain,mountainPoints.length);
  const grounded={...ctx,heightAt:terrain.userData.heightAt,surfaceAt:terrain.userData.surfaceAt};
  group.add(terrain,settlementsBuild(grounded));
  group.userData.heightAt=terrain.userData.heightAt;
  group.userData.surfaceAt=terrain.userData.surfaceAt;
  return group;
}
