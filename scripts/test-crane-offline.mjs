import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{
 const source=await browser.newPage();await source.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await source.evaluate(async()=>{const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts');const progress=s.createDefaultProgress('fr',true),bp=VEHICLE_BLUEPRINTS.find(bp=>bp.id==='math-groups');progress.ageProfile='11-12';progress.licenseState={tier:'family'};progress.currentBlueprintId=bp.id;progress.lastStandardBlueprintId=bp.id;progress.inProgressStages[bp.id]={placedPartIds:bp.parts.map(p=>p.id),mistakesCount:0,updatedAt:Date.now()};const profile=s.createNewPlayerProfile({name:'Crane offline',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]})};});await source.close();
 const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.addInitScript(()=>{Object.defineProperty(speechSynthesis,'getVoices',{value:()=>[]});window.craneAudio=0;const start=AudioBufferSourceNode.prototype.start;AudioBufferSourceNode.prototype.start=function(...args){if(this.context.state==='running'&&this.buffer?.getChannelData(0).some(sample=>Math.abs(sample)>.001))window.craneAudio++;return start.apply(this,args);};});
 await page.addInitScript(seed=>{if(!sessionStorage.getItem('crane-seed')){localStorage.setItem(seed.key,seed.store);localStorage.setItem('mkids_onboarding_v1','1');localStorage.setItem('mkids_landing_seen','1');sessionStorage.setItem('crane-seed','1');}},seed);
 await page.goto('http://127.0.0.1:7304/');await page.locator('[data-crane-balance]').waitFor();
 await page.evaluate(async()=>{await navigator.serviceWorker.register('/sw.js');await navigator.serviceWorker.ready;});await page.waitForFunction(()=>navigator.serviceWorker.controller!==null,undefined,{timeout:60000});
 await context.setOffline(true);await page.reload();const mission=page.locator('[data-crane-balance]');await mission.waitFor();
 await mission.locator('[data-crane-mass-choice="5"]').click();await mission.locator('[data-mission-next]').click();await mission.locator('[data-crane-distance-choice="1.5"]').click();await mission.locator('[data-crane-lift]').click();await page.locator('[data-crane-phase="done"]').waitFor();
 await mission.locator('.mission-listen').click();await page.waitForFunction(()=>window.craneAudio>0);assert.deepEqual(errors,[]);
 console.log('Crane offline: senior challenge, real lift and new French audio without system voices');await context.close();
}finally{await browser.close();}
