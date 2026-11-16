import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {canvasTarget} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const language of ['fr','en','ar'])for(const age of ['5-7','8-10','11-12']){
 if(process.env.OCTO_QA_LANGUAGE&&process.env.OCTO_QA_LANGUAGE!==language)continue;
 if(process.env.OCTO_QA_AGE&&process.env.OCTO_QA_AGE!==age)continue;
 const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'no-preference'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await page.evaluate(async({language,age})=>{const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts');const progress=s.createDefaultProgress(language,true);progress.ageProfile=age;progress.currentBlueprintId='math-fractions';progress.lastStandardBlueprintId='math-addition';const profile=s.createNewPlayerProfile({name:'Age QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),profileId:profile.id,parts:VEHICLE_BLUEPRINTS.find(bp=>bp.id==='math-groups').parts.map(p=>p.id)};},{language,age});
 await page.addInitScript(seed=>{if(!sessionStorage.getItem('age-seed')){localStorage.setItem(seed.key,seed.store);localStorage.setItem('mkids_onboarding_v1','1');localStorage.setItem('mkids_landing_seen','1');sessionStorage.setItem('age-seed','1');}},seed);await page.reload();
 await page.locator('[data-catalog-world="mathematiques"]').click();
 const expected=age==='5-7'?'math-addition':'math-groups';
 assert.deepEqual(await page.locator('[data-catalog-stage^="math-"]').evaluateAll(nodes=>nodes.map(node=>node.getAttribute('data-catalog-stage'))),[expected]);
 assert.notEqual(await page.locator('[data-workbench]').getAttribute('data-workbench'),'math-fractions');
 if(age==='11-12')assert.notEqual(await page.locator('[data-workbench]').getAttribute('data-workbench'),'math-addition');
 await page.locator(`[data-catalog-stage="${expected}"]`).click();
 if(age==='5-7'){await page.locator('[data-addition-added="0"]').waitFor();console.log(`${language}/${age}: only beginner bridge; old prototype resume blocked`);await page.close();continue;}
 const canvas=page.locator('[data-workbench] canvas');
 for(const id of seed.parts){const card=page.locator(`[data-part-id="${id}"]:visible`);await card.press('Enter');await page.waitForTimeout(240);const point=await canvasTarget(canvas);await page.mouse.click(point.x,point.y);await page.waitForTimeout(80);assert.ok(await card.isDisabled(),`${age}:${id} did not assemble`);}
 const mission=page.locator('[data-crane-balance]');await mission.waitFor();assert.equal(await mission.getAttribute('data-crane-balanced'),'false');assert.ok(await mission.locator('[data-crane-lift]').isDisabled());
 if(age==='11-12'){await mission.locator('[data-crane-mass-choice="5"]').click();await mission.locator('[data-mission-next]').click();}
 await mission.locator(`[data-crane-distance-choice="${age==='11-12'?1.5:2}"]`).click();
 await page.waitForTimeout(80);const tilt=await canvas.screenshot();await page.waitForTimeout(400);assert.notEqual(Buffer.compare(tilt,await canvas.screenshot()),0,'Jib must visibly react');
 assert.equal(await mission.getAttribute('data-crane-balanced'),'true');
 await mission.locator('[data-crane-lift]').click();await page.waitForTimeout(100);const before=await canvas.screenshot();await page.waitForTimeout(650);assert.notEqual(Buffer.compare(before,await canvas.screenshot()),0,'Cargo must visibly rise');
 await page.locator('[data-crane-phase="done"]').waitFor();assert.ok(await mission.locator('[data-crane-lift]').isDisabled(),'No repetitive reward loop');await mission.locator('[data-crane-distance-choice="'+(age==='11-12'?1.5:2)+'" ]').click();assert.equal(await mission.getAttribute('data-crane-phase'),'done');
 const saved=await page.evaluate(async id=>{const{readNotebook}=await import('/src/utils/discoveryNotebook.ts');return readNotebook(id).observations.some(entry=>entry.kind==='math-groups-balance-v3'&&entry.success);},seed.profileId);assert.equal(saved,true);
 await page.screenshot({path:`qa/crane-${age}-${language}.png`});assert.ok(await page.locator('[data-workshop-catalog]').isVisible());assert.deepEqual(errors,[]);console.log(`${language}/${age}: age-filtered catalogue, 10 structural pieces, visible tilt and lift, saved result and exit`);await page.close();
}}finally{await browser.close();}
