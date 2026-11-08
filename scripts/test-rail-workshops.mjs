import {createRequire} from 'node:module';
import {canvasTarget} from './canvas-geometry.mjs';
import {openMission,pickMission} from './mission-controls.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const language of ['fr','en','ar']){
 if(process.env.OCTO_QA_LANGUAGE&&process.env.OCTO_QA_LANGUAGE!==language)continue;
 const page=await browser.newPage({viewport:language==='en'?{width:768,height:1024}:{width:1280,height:800},hasTouch:language!=='fr',reducedMotion:'reduce'});page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await page.evaluate(async language=>{const storage=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts'),{RAIL_BLUEPRINT_IDS}=await import('/src/data/railBlueprints.ts'),profile=storage.createNewPlayerProfile({name:'Rail QA',progressOverride:storage.createDefaultProgress(language,true)});return{key:storage.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),models:VEHICLE_BLUEPRINTS.filter(bp=>RAIL_BLUEPRINT_IDS.includes(bp.id)).map(bp=>({id:bp.id,category:bp.category,parts:bp.parts.map(p=>({id:p.id,dependsOn:p.dependsOn}))}))};},language);
 await page.addInitScript(({key,store})=>{if(!sessionStorage.getItem('rail-seed')){localStorage.setItem(key,store);sessionStorage.setItem('rail-seed','1');}},seed);await page.reload();
 for(const model of seed.models){
  if(process.env.OCTO_QA_MODEL&&process.env.OCTO_QA_MODEL!==model.id)continue;
  await page.locator(`[data-catalog-world="${model.category}"]`).click();await page.locator(`[data-catalog-stage="${model.id}"]`).click();
  const canvas=page.locator(`[data-workbench="${model.id}"] canvas`);await canvas.waitFor();const placed=new Set();
  while(placed.size<model.parts.length){const available=model.parts.filter(p=>!placed.has(p.id)&&p.dependsOn.every(id=>placed.has(id)));if(!available.length)throw Error('Dependency deadlock');const part=available.at(-1),card=page.locator(`[data-part-id="${part.id}"]:visible`);if(language==='fr')await card.click();else await card.tap();await page.waitForTimeout(230);const target=await canvasTarget(canvas);if(language==='fr')await page.mouse.click(target.x,target.y);else await page.touchscreen.tap(target.x,target.y);await page.waitForTimeout(65);if(await page.locator(`[data-workbench="${model.id}"]`).getAttribute('data-assembly-complete')!=='true'&&(!await card.count()||!await card.isDisabled()))throw Error(`${language}/${model.id}/${part.id}: assembly failed`);placed.add(part.id);}
  const mission=page.locator('[data-vehicle-adventure="rail"]');await mission.waitFor();await openMission(mission);await pickMission(mission,'0',1);await pickMission(mission,'1',1);for(let step=1;step<=3;step++){await mission.locator('[data-vehicle-advance]').click();await page.waitForFunction(step=>document.querySelector('[data-vehicle-stage]')?.getAttribute('data-vehicle-stage')===String(step)&&document.querySelector('[data-vehicle-feedback]')?.getAttribute('data-vehicle-feedback')!=='moving',step);}await page.locator('[data-vehicle-feedback="done"]').waitFor();
  await page.screenshot({path:`qa/rail-${model.id}-${language}.png`});if(errors.length)throw Error(errors.join('\n'));console.log(`${language}/${model.id}: ${placed.size} parts assembled, departure and station stop passed`);await page.reload();
 }
 await page.close();
}}finally{await browser.close();}
