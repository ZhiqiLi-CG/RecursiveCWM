import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from './fractal/scene/three.module.js';
import {setupRecursionDisplay} from './recursion-display.js';

function fixture() {
  const scene=new THREE.Scene(), groups={};
  for(const id of ['scene','branch','leaf','sibling','assembly','part']) {
    groups[id]=new THREE.Group(); groups[id].name=id;
  }
  groups.scene.add(groups.branch,groups.sibling,groups.assembly);
  groups.branch.add(groups.leaf); groups.assembly.add(groups.part); scene.add(groups.scene);
  const mesh=(parent,x,visible=true)=>{
    const m=new THREE.Mesh(new THREE.BoxGeometry(2,2,2),new THREE.MeshBasicMaterial({color:'red'}));
    m.position.x=x; m.visible=visible; groups[parent].add(m); return m;
  };
  const owned={scene:mesh('scene',-20),branch:mesh('branch',0),leaf:mesh('leaf',10),sibling:mesh('sibling',20),part:mesh('part',30)};
  const hidden=mesh('branch',2,false);
  const tree={root:'scene',depth:{scene:0,branch:1,leaf:2,sibling:1,assembly:1,part:2},children:{scene:['branch','sibling','assembly'],branch:['leaf'],assembly:['part']}};
  const r=setupRecursionDisplay({THREE,root:groups.scene,scene,tree,renderer:{shadowMap:{}},render(){},onChange(){},groupAliases:{}});
  const visible=()=>Object.entries(owned).filter(([,m])=>m.visible).map(([id])=>id).sort();
  return {r,visible,hidden,owned};
}

test('the three modes partition the selected delivery by actual producer',()=>{
  const {r,visible,hidden}=fixture();
  assert.equal(r.getState().mode,'all');
  r.setSelection('scene','all'); assert.deepEqual(visible(),['branch','leaf','part','scene','sibling']);
  r.setSelection('scene','current'); assert.deepEqual(visible(),['scene']);
  r.setSelection('scene','children'); assert.deepEqual(visible(),['branch','leaf','part','sibling']);
  r.setSelection('branch','all'); assert.deepEqual(visible(),['branch','leaf']);
  r.setSelection('branch','current'); assert.deepEqual(visible(),['branch']);
  r.setSelection('branch','children'); assert.deepEqual(visible(),['leaf']);
  assert.equal(hidden.visible,false,'authored hidden meshes remain hidden');
});

test('leaf fallback preserves mode and assemblies never invent own geometry',()=>{
  const {r,visible}=fixture();
  r.setSelection('leaf','children');
  assert.deepEqual(visible(),['leaf']); assert.equal(r.getState().mode,'children');
  assert.equal(r.getState().effectiveMode,'current'); assert.equal(r.getState().hasChildren,false);
  r.setSelection('assembly','current'); assert.deepEqual(visible(),[]);
  r.setSelection('assembly','children'); assert.deepEqual(visible(),['part']);
  const state=r.getState(); r.setSelection('scene','invalid'); assert.deepEqual(r.getState(),state);
});

test('framing follows child bounds while hover and clear leave geometry selection intact',()=>{
  const {r,visible,owned}=fixture();
  r.setSelection('branch','children');
  assert.ok(r.getFrameBounds().equals(r.bounds.get('leaf')));
  const before=visible(); r.preview('sibling'); assert.deepEqual(visible(),before);
  assert.equal(r.getState().selectedNode,'branch'); assert.equal(r.getState().mode,'children');
  assert.notEqual(owned.leaf.material,r.meshes.find(x=>x.object===owned.leaf).material);
  r.clearHighlight(); assert.deepEqual(visible(),before); assert.equal(r.getState().mode,'children');
  r.setSelection('leaf','children'); assert.ok(r.getFrameBounds().equals(r.bounds.get('leaf')));
  r.setSelection('branch','current'); assert.ok(r.getFrameBounds().equals(r.bounds.get('branch')));
});
