import {createRequire} from 'node:module';
import {canvasTarget} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const [width,height]of[[430,900],[768,1024],[1024,768],[1280,800]]){
 const p=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});await p.goto('http://127.0.0.1:7302/?admin=1');await p.locator('[data-catalog-world="vivant-et-terre"]').click();const id=await p.evaluate(async()=> (await import('/src/data/virtualLabBlueprints.ts')).VIRTUAL_LAB_BLUEPRINTS.find(b=>b.virtualLab==='erosion').id);await p.locator(`[data-catalog-stage="${id}"]`).click();const canvas=p.locator(`[data-workbench="${id}"] canvas`);await canvas.waitFor();const initial=await canvas.boundingBox();
 const intersect=(a,b)=>Math.max(0,Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y));
 for(let side=0;side<2;side++){
  const menu=p.locator('.hud-settings');await menu.locator('summary').click();const popup=await menu.locator(':scope > div').boundingBox(),palette=await p.locator('[data-parts-palette]').boundingBox();if(intersect(popup,palette)>1)throw Error('Settings cover the pieces');
  await menu.getByRole('button',{name:side===0?'Pièces au début':'Pièces à la fin',exact:true}).click();await menu.locator('summary').click();await p.waitForTimeout(200);
  const parts=await p.locator('[data-parts-palette]').boundingBox(),camera=await p.locator('[data-floating-camera]').boundingBox();if(intersect(parts,camera)>1)throw Error('Floating palettes overlap');const box=await canvas.boundingBox();if(box.height!==initial.height||box.width!==initial.width)throw Error('Canvas shrinks');const target=await canvasTarget(canvas);if(!await p.evaluate(({x,y})=>document.elementFromPoint(x,y)?.tagName==='CANVAS',target))throw Error('Assembly target is obstructed');
 }
 await p.screenshot({path:`qa/floating-layout-${width}.png`});console.log(`${width}x${height}: full-height canvas, permanent pieces, opposite camera, unobstructed target and separate settings`);await p.close();
}}finally{await browser.close();}
