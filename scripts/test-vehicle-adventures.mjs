import {createRequire} from 'node:module';
import {openMission,pickMission} from './mission-controls.mjs';
import {canvasFraming,isoProjection} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const language of ['fr','en','ar']){
 if(process.env.OCTO_QA_LANGUAGE&&process.env.OCTO_QA_LANGUAGE!==language)continue;
 const page=await browser.newPage({hasTouch:language!=='fr',viewport:language==='en'?{width:768,height:1024}:{width:1280,height:800},reducedMotion:process.env.OCTO_QA_MOTION?'no-preference':'reduce'});page.setDefaultTimeout(12000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('http://127.0.0.1:7302/?admin=1');
 const cases=await page.evaluate(async()=>{const {VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts'),{getVehicleAdventureKind,vehicleAdventureStageCount}=await import('/src/data/vehicleAdventures.ts'),seen=new Set();return VEHICLE_BLUEPRINTS.flatMap(bp=>{const kind=getVehicleAdventureKind(bp);if(!kind||seen.has(kind))return[];seen.add(kind);return[{id:bp.id,category:bp.category,kind,stages:vehicleAdventureStageCount(kind)}];});});
 if(cases.length<8)throw Error('Not all eight adventure families are represented');
 for(const item of cases){
  if(process.env.OCTO_QA_KIND&&process.env.OCTO_QA_KIND!==item.kind)continue;
  const seed=await page.evaluate(async({id,language})=>{const storage=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts'),bp=VEHICLE_BLUEPRINTS.find(bp=>bp.id===id),progress=storage.createDefaultProgress(language,true);progress.inProgressStages[id]={placedPartIds:bp.parts.map(part=>part.id),mistakesCount:0,updatedAt:Date.now()};const profile=storage.createNewPlayerProfile({name:'Vehicle QA',progressOverride:progress});return{key:storage.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),marker:profile.id};},{id:item.id,language});
  await page.addInitScript(seed=>{if(!sessionStorage.getItem(seed.marker)){localStorage.setItem(seed.key,seed.store);sessionStorage.setItem(seed.marker,'1');}window.vehicleDiscoveries=[];if(!window.vehicleListener){window.vehicleListener=true;window.addEventListener('octogears:workshop-discovery',event=>window.vehicleDiscoveries.push(event.detail));}},seed);await page.reload();
  await page.locator(`[data-catalog-world="${item.category}"]`).click();await page.locator(`[data-catalog-stage="${item.id}"]`).click();
  const canvas=page.locator(`[data-workbench="${item.id}"] canvas`),mission=page.locator(`[data-vehicle-adventure="${item.kind}"]`),advance=mission.locator('[data-vehicle-advance]');await mission.waitFor();await openMission(mission);await page.waitForTimeout(400);
  await advance.click();await page.waitForFunction(()=>{const feedback=document.querySelector('[data-vehicle-feedback]')?.getAttribute('data-vehicle-feedback');return feedback&&feedback!=='ready'&&feedback!=='prepared';});
  if(await mission.getAttribute('data-vehicle-stage')!=='0')throw Error('Preparation ignored missing conditions');
  await pickMission(mission,'0',1);if(item.kind!=='delivery')await pickMission(mission,'1',1);await advance.click();await page.locator('[data-vehicle-stage="1"]').waitFor();
  const frame=JSON.parse(await mission.getAttribute('data-vehicle-frame'));if(frame.radius+frame.travel/2>2.4)throw Error('Vehicle leaves the platform');
  const summary=mission.locator(':scope > summary');if(await summary.count())await summary.click();await page.waitForTimeout(process.env.OCTO_QA_MOTION?900:250);
  const start=item.kind==='orbit'||item.kind==='launch'?0:-frame.travel/2,target=isoProjection(await canvasFraming(canvas),[frame.axis==='x'?start:0,frame.ground+frame.height/2,frame.axis==='z'?start:0]);
  if(language==='fr')await page.mouse.click(target.x,target.y);else await page.touchscreen.tap(target.x,target.y);await page.locator('[data-vehicle-stage="2"]').waitFor();
  if(process.env.OCTO_QA_MOTION){await page.waitForTimeout(100);const a=await canvas.screenshot();await page.waitForTimeout(300);const b=await canvas.screenshot();if(Buffer.compare(a,b)===0)throw Error(`${item.kind}: model did not move in rendered pixels`);}
  await page.waitForFunction(()=>document.querySelector('[data-vehicle-feedback]')?.getAttribute('data-vehicle-feedback')!=='moving');await openMission(mission);
  for(let stage=3;stage<=item.stages;stage++){await advance.click();await page.waitForFunction(stage=>document.querySelector('[data-vehicle-stage]')?.getAttribute('data-vehicle-stage')===String(stage)&&document.querySelector('[data-vehicle-feedback]')?.getAttribute('data-vehicle-feedback')!=='moving',stage);}
  await page.locator('[data-vehicle-feedback="done"]').waitFor();
  if(!await page.evaluate(id=>window.vehicleDiscoveries.some(e=>e.blueprintId===id&&e.success===true&&Array.isArray(e.result))&&window.vehicleDiscoveries.some(e=>e.blueprintId===id&&e.success===false),item.id))throw Error('Notebook does not receive both experiment outcomes');
  await page.screenshot({path:`qa/vehicle-adventure-${item.kind}-${language}.png`});
  await mission.locator('[data-vehicle-reset]').click();await page.locator('[data-vehicle-stage="0"][data-vehicle-feedback="ready"]').waitFor();if(errors.length)throw Error(errors.join('\n'));
  console.log(`${language}/${item.kind}/${item.id}: conditions, model touch, ${item.stages} steps, notebook and reset passed`);
  if(process.env.OCTO_QA_MOTION&&item.kind==='delivery'){await pickMission(mission,'0',1);await advance.click();await advance.click();await page.locator('[data-vehicle-feedback="moving"]').waitFor();await page.waitForTimeout(100);await page.locator('[data-workshop-next]').click();await page.locator(`[data-workbench]:not([data-workbench="${item.id}"]) canvas`).waitFor();await page.waitForTimeout(600);if(await page.locator(`[data-workbench="${item.id}"]`).count())throw Error('Old model survived navigation during its mission');if(errors.length)throw Error(errors.join('\n'));console.log(language+': next workshop remains accessible during moving vehicle mission');}
  await page.reload();
 }
 await page.close();
}}finally{await browser.close();}
