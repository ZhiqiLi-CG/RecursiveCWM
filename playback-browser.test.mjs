import {chromium} from '/data/zhiqi/CodeWorld2/.render-tools/node_modules/playwright/index.mjs';
import assert from 'node:assert/strict';
const base=process.argv[2];if(!base)throw new Error('Pass the project HTTP URL.');
const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
try {
  for(const width of [1000,390]) for(const [trace,count] of [['medieval-village',199],['city',243]]) {
    const page=await browser.newPage({viewport:{width,height:700}});
    const failures=[];page.on('requestfailed',request=>failures.push(`${request.failure()?.errorText}: ${request.url()}`));page.on('response',response=>{if(response.status()>=400)failures.push(`${response.status()}: ${response.url()}`)});
    await page.goto(new URL(`site/tools/playback-fixture.html?trace=${trace}`,base).href);
    await page.waitForSelector('html[data-ready]');
    const visibleEdges=()=>page.locator('.playback-connectors path:not([hidden])').count();
    const assertContained=async label=>{const bad=await page.locator('.playback-node:not([hidden])').evaluateAll(buttons=>buttons.map(button=>{const b=button.getBoundingClientRect(),text=button.querySelector('.playback-node-label').getBoundingClientRect();return {id:button.dataset.node,fits:button.scrollHeight<=button.clientHeight&&text.left>=b.left&&text.right<=b.right&&text.top>=b.top&&text.bottom<=b.bottom}}).filter(item=>!item.fits));assert.deepEqual(bad,[],`${trace}/${width}: ${label} labels stay inside cards`)};
    assert.equal(await visibleEdges(),0,`${trace}: no connectors before calls`);
    await page.locator('[data-role=step]').click();await page.locator('[data-role=step]').click();await page.locator('[data-role=step]').click();
    assert.equal(await visibleEdges(),1,`${trace}: first child call reveals one connector`);
    await assertContained('first child call');
    await page.locator('[data-role=restart]').click();assert.equal(await visibleEdges(),0,`${trace}: restart hides connectors`);
    await page.locator('#host').scrollIntoViewIfNeeded();const outer=await page.evaluate(()=>scrollY);
    const timeline=page.locator('[data-role=timeline]'),max=Number(await timeline.getAttribute('max'));
    await timeline.evaluate((input,value)=>{input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}))},max/2);
    assert.ok(Math.abs(Number(await timeline.inputValue())-max/2)<2,`${trace}: scrub uses requested value`);
    assert.equal(await page.evaluate(()=>scrollY),outer,`${trace}: scrub does not hijack outer scroll`);
    await assertContained('midpoint');
    const visibleNodes=await page.locator('.playback-node:not([hidden])').count();assert.equal(await visibleEdges(),visibleNodes-1,`${trace}: visible nodes have connected parent edges`);
    const wholeAgain=await page.evaluate(()=>window.fixtureWholeAgain);assert.ok(Number.isFinite(wholeAgain),`${trace}: whole-again event exists`);
    await timeline.evaluate((input,value)=>{input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}))},wholeAgain);await assertContained('whole again');
    const before=Number(await timeline.inputValue());await page.locator('[data-role=play]').click();await page.waitForTimeout(120);await page.locator('[data-role=play]').click();
    assert.ok(Number(await timeline.inputValue())>before,`${trace}: play advances elapsed time`);
    const paused=await page.locator('[data-role=number]').innerText();await page.waitForTimeout(80);assert.equal(await page.locator('[data-role=number]').innerText(),paused,`${trace}: pause holds`);
    await page.locator('[data-role=step]').click();assert.notEqual(await page.locator('[data-role=number]').innerText(),paused,`${trace}: step advances`);
    await timeline.evaluate((input,value)=>{input.value=String(value);input.dispatchEvent(new Event('input',{bubbles:true}))},max);
    assert.equal(await page.locator('[data-role=status]').innerText(),'RUN COMPLETE',`${trace}: completes`);
    assert.equal(await page.locator('.playback-node:not([hidden])').count(),trace==='medieval-village'?24:25);
    assert.equal(await page.locator('.playback-node.no-render-slot:not([hidden])').count(),trace==='city'?4:0,`${trace}: renderless layout persists at completion`);
    assert.equal(await page.locator('.playback-node.no-render-slot.has-render').count(),0,`${trace}: renderless nodes never claim renders`);
    assert.equal(await page.locator('.playback-node.no-render-slot[aria-label*="render delivered"]').count(),0,`${trace}: renderless node accessibility text is truthful`);
    const geometry=await page.locator('.playback-node:not([hidden])').evaluateAll(buttons=>buttons.map(button=>{const b=button.getBoundingClientRect(),label=button.querySelector('.playback-node-label'),l=label.getBoundingClientRect();return {fits:button.scrollHeight<=button.clientHeight,labelFits:l.left>=b.left&&l.right<=b.right&&l.top>=b.top&&l.bottom<=b.bottom,id:button.dataset.node,scrollHeight:button.scrollHeight,clientHeight:button.clientHeight}}));
    assert.deepEqual(geometry.filter(item=>!item.fits||!item.labelFits),[],`${trace}/${width}: labels and content stay inside cards`);
    assert.equal(await page.evaluate(()=>scrollY),outer,`${trace}: completion stays within playback scroll area`);
    assert.equal(await page.locator('[data-role=number]').innerText(),`${count} / ${count}`);
    assert.deepEqual(failures,[],`${trace}: no failed or HTTP error requests`);
    await page.locator('.playback-node:not([hidden]) img:not([hidden])').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
    await page.locator('#host').screenshot({path:new URL(`../checks/layout4-${trace}-${width===390?'phone':'desktop'}-playback-complete.png`,import.meta.url).pathname});
    await page.close();
  }
  console.log('playback browser controls: both traces passed');
} finally {await browser.close()}
