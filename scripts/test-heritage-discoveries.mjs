import {createRequire} from 'node:module';
import {openMission,pickMission} from './mission-controls.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const language of ['fr','en','ar'])for(const id of ['expansion-yurt','expansion-dome']){
 const page=await browser.newPage({viewport:{width:1280,height:850},hasTouch:language!=='fr',reducedMotion:process.env.OCTO_QA_MOTION?'no-preference':'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await page.evaluate(async({id,language})=>{const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS:b}=await import('/src/data/blueprints.ts'),bp=b.find(bp=>bp.id===id),progress=s.createDefaultProgress(language,true);progress.inProgressStages[id]={placedPartIds:bp.parts.map(p=>p.id),mistakesCount:0,updatedAt:Date.now()};const p=s.createNewPlayerProfile({name:'History QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:p.id,profiles:[p]}),category:bp.category};},{id,language});
 await page.addInitScript(seed=>{localStorage.setItem(seed.key,seed.store);window.historyResults=[];window.addEventListener('octogears:workshop-discovery',e=>window.historyResults.push(e.detail));},seed);await page.reload();await page.locator(`[data-catalog-world="${seed.category}"]`).click();await page.locator(`[data-catalog-stage="${id}"]`).click();
 const mission=page.locator('[data-heritage-discovery]');await mission.waitFor();await openMission(mission);
 for(const choice of [0,1]){await pickMission(mission,'choice',choice);await mission.locator('[data-mission-primary]').click();await page.waitForFunction(()=>document.querySelector('[data-heritage-result]')?.getAttribute('data-heritage-result')!=='running');}
 const result=await mission.getAttribute('data-heritage-result');if(result!==(id.endsWith('yurt')?'sheltered':'compared'))throw Error(result);
 const events=await page.evaluate(()=>window.historyResults);if(events.length!==2||events[0].success||!events[1].success)throw Error('Incorrect history successes');
 await page.screenshot({path:`qa/heritage-discovery-${id}-${language}.png`});
 await mission.locator('[data-mission-reset]').click();if(await mission.getAttribute('data-heritage-result')!=='ready')throw Error('Reset failed');if(errors.length)throw Error(errors.join('\n'));console.log(language+' '+id+': compare, success, reset, single scene');await page.close();
}}finally{await browser.close();}
