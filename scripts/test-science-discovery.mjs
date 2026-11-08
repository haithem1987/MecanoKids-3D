import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {openMission,pickMission} from './mission-controls.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const language of ['fr','en','ar']){
 if(process.env.OCTO_QA_LANGUAGE&&process.env.OCTO_QA_LANGUAGE!==language)continue;
 const page=await browser.newPage({viewport:{width:1280,height:850},hasTouch:language!=='fr',reducedMotion:process.env.OCTO_QA_MOTION?'no-preference':'reduce'});page.setDefaultTimeout(15000);const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await page.evaluate(async language=>{
  const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts'),{SCIENCE_DISCOVERY_IDS,SCIENCE_DISCOVERY_MODELS}=await import('/src/data/scienceDiscovery.ts');const progress=s.createDefaultProgress(language,true),models=Object.entries(SCIENCE_DISCOVERY_IDS).map(([id,kind])=>{const bp=VEHICLE_BLUEPRINTS.find(item=>item.id===id);progress.inProgressStages[id]={placedPartIds:bp.parts.map(part=>part.id),mistakesCount:0,updatedAt:Date.now()};return{id,kind,category:bp.category,controls:SCIENCE_DISCOVERY_MODELS[kind].controls,solution:SCIENCE_DISCOVERY_MODELS[kind].solution};});const profile=s.createNewPlayerProfile({name:'Science Discovery QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),models};
 },language);
 await page.addInitScript(({key,store})=>{if(!sessionStorage.getItem('science-discovery-seed')){localStorage.setItem(key,store);sessionStorage.setItem('science-discovery-seed','1');}window.discoveryEvents=[];window.addEventListener('octogears:workshop-discovery',event=>{if(event.detail.kind.startsWith('science-discovery-'))window.discoveryEvents.push(event.detail);});},seed);await page.reload();
 for(const model of seed.models){
  if(process.env.OCTO_QA_KIND&&!process.env.OCTO_QA_KIND.split(',').includes(model.kind))continue;
  await page.locator(`[data-catalog-world="${model.category}"]`).click();await page.locator(`[data-catalog-stage="${model.id}"]`).click();const trial=page.locator(`[data-science-discovery="${model.kind}"]`),canvas=page.locator(`[data-workbench="${model.id}"] canvas`);await trial.waitFor();await openMission(trial);
  await trial.locator('[data-science-discovery-run]').click();await page.locator('[data-science-discovery-phase="done"]').waitFor();assert.equal(await trial.getAttribute('data-science-discovery-success'),'false');await page.waitForTimeout(120);const before=await canvas.screenshot();
  for(const[index,control]of model.controls.entries())await pickMission(trial,control.id,model.solution[index]);
  await trial.locator('[data-science-discovery-run]').click();
  if(process.env.OCTO_QA_MOTION){await page.waitForTimeout(350);const movingA=await canvas.screenshot();await page.waitForTimeout(400);const movingB=await canvas.screenshot();assert.notEqual(Buffer.compare(movingA,movingB),0,`${model.kind}: real motion must change rendered pixels`);}
  await page.locator('[data-science-discovery-success="true"]').waitFor();await page.waitForTimeout(200);const after=await canvas.screenshot();assert.notEqual(Buffer.compare(before,after),0,`${language}/${model.kind}: experiment did not visibly change the built scene`);
  assert.equal(await page.evaluate(()=>window.discoveryEvents.length),2,`${model.kind}: each deliberate test publishes once`);
  const settings=page.locator('.hud-settings');await settings.locator('summary').click();const styleLabel=await page.evaluate(async language=>(await import('/src/i18n/translations.ts')).UI_TRANSLATIONS[language].styleBlocks,language);await settings.getByRole('button',{name:styleLabel,exact:true}).click();await settings.locator('summary').click();await page.waitForTimeout(300);assert.equal(await page.evaluate(()=>window.discoveryEvents.length),2,`${model.kind}: appearance rebuild must not publish again`);
  await trial.locator('[data-science-discovery-reset]').click();await page.locator('[data-science-discovery-phase="ready"]').waitFor();assert.equal(await trial.getAttribute('data-science-discovery-success'),'false');
  console.log(`${language}/${model.kind}: parameters, visible 3D result, success, reset and appearance isolation verified`);await page.reload();
 }
 assert.deepEqual(errors,[]);await page.close();
}}finally{await browser.close();}
