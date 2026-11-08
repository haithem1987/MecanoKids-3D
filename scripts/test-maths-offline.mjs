import {createRequire} from 'node:module';
import {openMission,pickMission} from './mission-controls.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{
 const source=await browser.newPage();await source.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await source.evaluate(async()=>{
  const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts');
  const progress=s.createDefaultProgress('fr',true),bp=VEHICLE_BLUEPRINTS.find(bp=>bp.id==='math-addition');
  progress.ageProfile='11-12';progress.licenseState={tier:'family'};progress.freeWorkshopUnlocked=true;progress.currentBlueprintId=bp.id;progress.lastStandardBlueprintId=bp.id;
  progress.inProgressStages[bp.id]={placedPartIds:bp.parts.map(p=>p.id),mistakesCount:0,updatedAt:Date.now()};
  const profile=s.createNewPlayerProfile({name:'Offline QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),profileId:profile.id};
 });await source.close();
 const context=await browser.newContext({viewport:{width:1280,height:850},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(seed=>{if(!sessionStorage.getItem('offline-seed')){localStorage.setItem(seed.key,seed.store);localStorage.setItem('mkids_onboarding_v1','1');localStorage.setItem('mkids_landing_seen','1');sessionStorage.setItem('offline-seed','1');}},seed);
 await page.goto('http://127.0.0.1:7304/');await page.locator('[data-math-activity="addition"]').waitFor();
 await page.evaluate(async()=>{await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;});
 await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,undefined,{timeout:60000});
 await context.setOffline(true);await page.reload();const mission=page.locator('[data-math-activity="addition"]');await mission.waitFor();await openMission(mission);
 await pickMission(mission,'a',2);await pickMission(mission,'b',3);await mission.locator('[data-math-run]').click();await page.locator('[data-math-success="true"]').waitFor();
 await page.locator('.hud-settings > summary').click();await page.locator('[data-open-notebook]').click();await page.locator('[data-notebook-tab="notebook"]').click();await page.locator('[data-notebook-entry="math-addition"]').locator('li').filter({hasText:/Une quantité peut être/}).waitFor();
 const audio=await page.evaluate(async()=>{const response=await fetch('/narration/fr/208.mp3');return response.ok&&(await response.arrayBuffer()).byteLength>1000;});if(!audio)throw Error('New narration not cached offline');
 if(errors.length)throw Error(errors.join('\n'));console.log('Production build offline: reload, 3D addition challenge, saved notebook result and new narration available');await context.close();
}finally{await browser.close();}
