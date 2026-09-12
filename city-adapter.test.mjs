import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import * as THREE from './fractal/scene/three.module.js';
import {buildCity} from './city-adapter.js';

test('renamed house instances retain their delivered child-program ownership',async()=>{
  const read=async path=>JSON.parse(await fs.readFile(new URL(path,import.meta.url)));
  const [spec,tree,part]=await Promise.all([read('./runs/city/fractal/scene/candidate.json'),read('./runs/city/tree.json'),read('./runs/city/fractal/west-houses/part.json')]);
  const instances=part.instances.filter(x=>x.source_node==='west-house-prototype');
  assert.equal(instances.length,3,'the assembler records the original plus two cloned child instances');
  const components=spec.components||spec.geometry;
  const childComponents=components.filter(x=>x.id.split('/').includes('west-house-prototype')||/^west-houses\/house-\d+\//.test(x.id));
  assert.equal(childComponents.length,132,'three delivered houses each have 44 primitives');
  const root=buildCity(THREE,spec,tree);
  assert.equal(root.userData.primitiveOwnership['west-house-prototype'],childComponents.length,'the child owns its original and both renamed instances');
  for(const [node,count] of Object.entries({scene:369,'north-housing':812,'north-housing-buildings':240,'central-school':90,'school-main-building':121,'school-sign':7,'west-offices':89,'west-offices-annex':24,'west-houses':28,'foreground-park':0})) {
    assert.equal(root.userData.primitiveOwnership[node],count,`${node}: counts audited against delivered child_refs and assemblers`);
  }
});
