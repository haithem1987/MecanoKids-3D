import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {openMission,pickMission} from './mission-controls.mjs';
import {canvasTarget,canvasFraming,isoProjection} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{
 for(const language of ['fr','en','ar']){
  if(process.env.OCTO_QA_LANGUAGE&&process.env.OCTO_QA_LANGUAGE!==language)continue;
  const touch=language==='en',page=await browser.newPage({viewport:{width:touch?1024:1280,height:900},hasTouch:touch,reducedMotion:'reduce'}),errors=[];page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(12000);
  await page.goto('http://127.0.0.1:7302/?admin=1');
  const seed=await page.evaluate(async language=>{const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts');const progress=s.createDefaultProgress(language,true);progress.ageProfile='8-10';const profile=s.createNewPlayerProfile({name:'Math QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),profileId:profile.id,blueprints:VEHICLE_BLUEPRINTS.filter(bp=>bp.id.startsWith('math-')).map(bp=>({id:bp.id,category:bp.category,kind:bp.id.slice(5),parts:bp.parts.map(part=>part.id)}))};},language);
  assert.equal(seed.blueprints.length,6);
  await page.addInitScript(({key,store})=>{if(!sessionStorage.getItem('math-qa-seed')){localStorage.setItem(key,store);sessionStorage.setItem('math-qa-seed','1');}},seed);await page.reload();
  const activate=locator=>touch?locator.tap():locator.click();
  for(const bp of seed.blueprints){
   if(process.env.OCTO_QA_MODEL&&process.env.OCTO_QA_MODEL!==bp.id)continue;
   await activate(page.locator(`[data-catalog-world="${bp.category}"]`));await activate(page.locator(`[data-catalog-stage="${bp.id}"]`));
   const workbench=page.locator(`[data-workbench="${bp.id}"]`),canvas=workbench.locator('canvas');await canvas.waitFor();
   for(const id of bp.parts){const card=page.locator(`[data-part-id="${id}"]:visible`);if(touch)await card.tap();else await card.press('Enter');await page.waitForTimeout(220);const point=await canvasTarget(canvas);if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);await page.waitForTimeout(65);assert.ok(await card.isDisabled(),`${language}/${bp.id}/${id}: piece must assemble`);}
   assert.equal(await workbench.getAttribute('data-assembly-complete'),'true');
   const mission=page.locator(`[data-math-activity="${bp.kind}"]`);await mission.waitFor();
   await page.locator('[data-floating-camera] button').first().click();await page.waitForTimeout(350);
   const positions={addition:[-1.4,.27,.65],groups:[1.235,.275,.82],fractions:[-.9,.25,-.3],area:[-.2,.235,-.2],symmetry:[.85,.172,-.4],ratio:[-1,.245,-.4]};
   const expected={addition:'1,0',groups:'4,5',fractions:'1,4',area:'2,2',symmetry:'1',ratio:'1,0'};
   const point=isoProjection(await canvasFraming(canvas),positions[bp.kind]);if(touch)await page.touchscreen.tap(point.x,point.y);else await page.mouse.click(point.x,point.y);
   await page.waitForFunction(({kind,value})=>document.querySelector(`[data-math-activity="${kind}"]`)?.getAttribute('data-math-settings')===value,{kind:bp.kind,value:expected[bp.kind]});
   await openMission(mission);
   await mission.locator('[data-math-run]').click();await page.waitForFunction(kind=>document.querySelector(`[data-math-activity="${kind}"]`)?.getAttribute('data-math-phase')==='done',bp.kind);
   assert.equal(await mission.getAttribute('data-math-success'),'false','an intermediate arrangement must not validate the challenge');
   for(let level=0;level<3;level++){
    await pickMission(mission,'level',level);const solution=await page.evaluate(async({kind,level})=>{const {mathSolution}=await import('/src/data/mathActivities.ts');return mathSolution(kind,level);},{kind:bp.kind,level});
    for(const [index,value]of solution.entries())await pickMission(mission,index===0?'a':'b',value);
    await mission.locator('[data-math-run]').click();await page.waitForFunction(kind=>document.querySelector(`[data-math-activity="${kind}"]`)?.getAttribute('data-math-success')==='true',bp.kind);
   }
   const saved=await page.evaluate(async({profileId,id})=>{const {readNotebook}=await import('/src/utils/discoveryNotebook.ts');return readNotebook(profileId).observations.filter(entry=>entry.blueprintId===id&&entry.success===true).length;},{profileId:seed.profileId,id:bp.id});assert.equal(saved,3,'all three real manipulations must be journalled');
   await page.screenshot({path:`qa/math-${bp.kind}-${language}.png`});console.log(`${language}/${bp.id}: ${bp.parts.length} pieces assembled, direct 3D manipulation, three challenges completed and saved`);await page.reload();
  }
  assert.deepEqual(errors,[]);await page.close();
 }
}finally{await browser.close();}
