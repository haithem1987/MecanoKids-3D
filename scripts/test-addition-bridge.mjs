import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {canvasTarget} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const language of ['fr','en','ar']){
 const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'no-preference'}),errors=[];
 page.on('pageerror',error=>errors.push(error.message));await page.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await page.evaluate(async language=>{
  const s=await import('/src/utils/storage.ts');const progress=s.createDefaultProgress(language,true);
  progress.ageProfile='8-10';progress.currentBlueprintId='math-addition';progress.lastStandardBlueprintId='math-addition';
  const profile=s.createNewPlayerProfile({name:'Bridge QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]})};
 },language);
 await page.addInitScript(seed=>{if(!sessionStorage.getItem('bridge-seed')){localStorage.setItem(seed.key,seed.store);localStorage.setItem('mkids_onboarding_v1','1');localStorage.setItem('mkids_landing_seen','1');sessionStorage.setItem('bridge-seed','1');}},seed);await page.reload();
 if(await page.locator('[data-catalog-world="mathematiques"]').count()){await page.locator('[data-catalog-world="mathematiques"]').click();await page.locator('[data-catalog-stage="math-addition"]').click();}
 const bench=page.locator('[data-workbench="math-addition"]'),canvas=bench.locator('canvas');await canvas.waitFor();
 await page.locator('[data-addition-added="0"]').waitFor();assert.equal((await page.locator('[data-addition-equation]').textContent()).trim(),'2 + 0 = 2');
 assert.equal(await page.locator('[data-part-id="token-5"]').count(),0);
 for(let added=1;added<=3;added++){
  const card=page.locator(`[data-part-id="token-${added+1}"]:visible`);await card.press('Enter');await page.waitForTimeout(350);
  const target=await canvasTarget(canvas);await page.mouse.click(target.x,target.y);await page.waitForTimeout(150);
  if(!await card.isDisabled()){await page.screenshot({path:'qa/addition-pose-failure.png'});console.log(await card.getAttribute('aria-label'),await page.locator('[role=status]').allTextContents(),target);throw Error('Pose non réalisée');}
  if(added<3){await page.locator(`[data-addition-added="${added}"]`).waitFor();assert.equal((await page.locator('[data-addition-equation]').textContent()).trim(),`2 + ${added} = ${2+added}`);assert.equal(await bench.getAttribute('data-assembly-complete'),'false');}
 }
 const mission=page.locator('[data-math-activity="addition"]');await mission.waitFor();assert.equal(await mission.locator('select').count(),0);assert.equal(await mission.locator('[data-math-next]').count(),0);
 assert.equal((await page.locator('[data-addition-equation]').textContent()).trim(),'2 + 3 = 5');
 await mission.locator('[data-math-run]').click();await page.waitForTimeout(150);const first=await canvas.screenshot();await page.waitForTimeout(500);assert.notEqual(Buffer.compare(first,await canvas.screenshot()),0);
 await page.locator('[data-math-success="true"]').waitFor();await page.screenshot({path:`qa/addition-construction-${language}.png`});
 await page.reload();await page.locator('[data-math-activity="addition"]').waitFor();assert.equal((await page.locator('[data-addition-equation]').textContent()).trim(),'2 + 3 = 5');
 assert.ok(await page.locator('[data-workshop-catalog]').isVisible());assert.deepEqual(errors,[]);console.log(`${language}: 2 existing planks + 3 actual placements, live counts, crossing, reload and exit`);await page.close();
}}finally{await browser.close();}
