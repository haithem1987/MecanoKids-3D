import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await page.evaluate(async()=>{const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS:b}=await import('/src/data/blueprints.ts');const progress=s.createDefaultProgress('fr',true);progress.licenseState={tier:'family'};progress.freeWorkshopUnlocked=true;progress.ageProfile='11-12';for(const bp of b){progress.inProgressStages[bp.id]={placedPartIds:bp.parts.map(p=>p.id),mistakesCount:0,updatedAt:Date.now()};progress.completedStages[bp.id]={completed:true,stars:3,bestMistakes:0,completedAt:Date.now()};}const profile=s.createNewPlayerProfile({name:'Navigation QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:{activeProfileId:profile.id,profiles:[profile]},models:b.map(bp=>({id:bp.id,category:bp.category}))};});
 await page.addInitScript(seed=>{const target=sessionStorage.getItem('continuation-target');if(target){const data=structuredClone(seed.store),p=data.profiles[0].progress;p.currentBlueprintId=target;p.lastStandardBlueprintId=target;localStorage.setItem(seed.key,JSON.stringify(data));}localStorage.setItem('mkids_onboarding_v1','1');localStorage.setItem('mkids_landing_seen','1');},seed);
 for(const [index,bp]of seed.models.entries()){
  if(index+1<Number(process.env.OCTO_QA_FROM??1)||index+1>Number(process.env.OCTO_QA_TO??seed.models.length))continue;
  if(process.env.OCTO_QA_MODEL&&process.env.OCTO_QA_MODEL!==bp.id)continue;
  await page.evaluate(id=>sessionStorage.setItem('continuation-target',id),bp.id);await page.reload();await page.locator(`[data-catalog-world="${bp.category}"]`).click();await page.locator(`[data-catalog-stage="${bp.id}"]`).click();
  await page.locator(`[data-workbench="${bp.id}"][data-assembly-complete="true"] canvas`).waitFor();
  const next=page.locator('[data-workshop-next]'),catalog=page.locator('[data-workshop-catalog]');await catalog.waitFor();
  for(const control of [catalog,...index<seed.models.length-1?[next]:[]]){if(!await control.isVisible())throw Error('Continuation hidden '+bp.id);const clear=await control.evaluate(n=>{const r=n.getBoundingClientRect();return n.contains(document.elementFromPoint(r.x+r.width/2,r.y+r.height/2));});if(!clear)throw Error('Continuation covered '+bp.id);}
  if(index<seed.models.length-1){await next.click();await page.locator(`[data-workbench="${seed.models[index+1].id}"] canvas`).waitFor();}
  await page.locator('[data-workshop-catalog]').click();await page.getByRole('dialog').waitFor();
  if(errors.length)throw Error(errors.join('\n'));console.log(`${index+1}/${seed.models.length} ${bp.id}: next and catalogue reachable`);
 }
}finally{await browser.close();}
