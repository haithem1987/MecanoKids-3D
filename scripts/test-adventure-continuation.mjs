import {createRequire} from 'node:module';
import {openMission} from './mission-controls.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright'),browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:768,height:1024},hasTouch:true,reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await page.evaluate(async()=>{const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS:b}=await import('/src/data/blueprints.ts'),bp=b.find(bp=>bp.id==='expansion-gantry'),progress=s.createDefaultProgress('fr',true);progress.licenseState={tier:'family'};progress.ageProfile='11-12';progress.freeWorkshopUnlocked=true;progress.inProgressStages[bp.id]={placedPartIds:bp.parts.map(p=>p.id),mistakesCount:0,updatedAt:Date.now()};progress.completedStages[bp.id]={completed:true,stars:3,bestMistakes:0};const p=s.createNewPlayerProfile({name:'Story QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:p.id,profiles:[p]})};});
 await page.addInitScript(seed=>{if(!sessionStorage.getItem('story-seed')){localStorage.setItem(seed.key,seed.store);sessionStorage.setItem('story-seed','1');}},seed);await page.reload();await page.locator('[data-catalog-notebook]').click();await page.locator('[data-adventure-route="harbour"]').click();await page.locator('[data-adventure-stage="expansion-gantry"]').click();
 const mission=page.locator('[data-construction-play="gantry"]');await mission.waitFor();await openMission(mission);
 for(const step of [1,2,3]){await mission.locator('[data-construction-advance]').click();await page.waitForFunction(step=>document.querySelector('[data-construction-step]')?.getAttribute('data-construction-step')===String(step),step);await page.waitForFunction(()=>document.querySelector('[data-construction-phase]')?.getAttribute('data-construction-phase')!=='moving');}
 await page.locator('[data-workshop-next]').click();await page.locator('[data-workbench="master-drawbridge"] canvas').waitFor();
 if(errors.length)throw Error(errors.join('\n'));console.log('Tablet: successful gantry delivery continues to the drawbridge from the selected story');
}finally{await browser.close();}
