import {build as ground,heightAt,surfaceAt} from '../terrain-ground/ground.js';
import {build as forest} from './forest.js';
export function build(ctx){ctx.heightAt=heightAt;ctx.surfaceAt=surfaceAt;const g=ground(ctx);g.add(forest(ctx));return g;}
