import fs from 'node:fs';import {createHash} from 'node:crypto';import path from 'node:path';import http from 'node:http';import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);const {chromium}=require('/data/zhiqi/CodeWorld2/.render-tools/node_modules/playwright');
const ROOT=path.dirname(new URL(import.meta.url).pathname);process.env.TMPDIR='/tmp';
const args=process.argv.slice(2),opt=k=>args.includes(k)?args[args.indexOf(k)+1]:undefined;
const scene=opt('--scene')||'spec.json',camera=opt('--camera')||'../../camera-contract.json',out=opt('--out')||'render0.png',view=opt('--view');
const validate=p=>{const abs=path.resolve(ROOT,p);return abs;};
const payload={spec:JSON.parse(fs.readFileSync(validate(scene))),camera:JSON.parse(fs.readFileSync(validate(camera))),view:view?JSON.parse(fs.readFileSync(validate(view))):null};
payload.spec.geometry=payload.spec.geometry||payload.spec.components;
const cameraSHA=createHash('sha256').update(fs.readFileSync(validate(camera))).digest('hex');
if(payload.spec.camera_contract_sha256 && payload.spec.camera_contract_sha256!==cameraSHA)throw Error('Locked camera digest mismatch');
if(payload.view && payload.view.camera_contract_sha256!==cameraSHA)throw Error('View camera digest mismatch');
const server=http.createServer((req,res)=>{
 if(req.url==='/three.js'){res.setHeader('Content-Type','application/javascript');return res.end(fs.readFileSync('/data/zhiqi/CodeWorld2/.render-tools/node_modules/three/build/three.module.js'));}
 if(req.url==='/payload'){res.setHeader('Content-Type','application/json');return res.end(JSON.stringify(payload));}
 if(req.url==='/scene.js'){res.setHeader('Content-Type','application/javascript');return res.end(fs.readFileSync(path.join(ROOT,'scene.js')));}
 res.setHeader('Content-Type','text/html');res.end('<!doctype html><html><style>body{margin:0;background:white}canvas{display:block}</style><script type="module" src="/scene.js"></script></html>');
});await new Promise(r=>server.listen(0,'127.0.0.1',r));
const [w,h]=payload.view?.output_size||payload.camera.resolution;
const browser=await chromium.launch({executablePath:'/home/zli3167/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome',headless:true,ignoreDefaultArgs:['--disable-dev-shm-usage'],args:['--no-sandbox','--use-angle=swiftshader','--enable-webgl','--ignore-gpu-blocklist','--disk-cache-size=1','--media-cache-size=1'],env:{...process.env,TMPDIR:'/tmp'}});
try{const page=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
 await page.goto(`http://127.0.0.1:${server.address().port}`);await page.waitForFunction(()=>window.RENDER_DONE===true,null,{timeout:60000});await page.locator('canvas').screenshot({path:validate(out)});
 const report=await page.evaluate(()=>window.RENDER_REPORT);report.errors=errors;report.camera_contract_sha256=cameraSHA;fs.writeFileSync(validate(out.replace(/\.png$/,'.render.json')),JSON.stringify(report,null,2));if(errors.length)throw Error(errors.join('\n'));console.log(JSON.stringify({out,width:w,height:h,...report}));
}finally{await browser.close();server.close();}
