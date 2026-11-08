import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {openMission,pickMission} from './mission-controls.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try {
 for(const language of ['fr','en','ar']) {
  const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));page.setDefaultTimeout(10000);
  await page.goto('http://127.0.0.1:7302/?admin=0');
  const seed=await page.evaluate(async language=>{
   const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts'),{VIRTUAL_LAB_TEXT}=await import('/src/i18n/translations.ts');
   const progress=s.createDefaultProgress(language,true),bp=VEHICLE_BLUEPRINTS.find(bp=>bp.virtualLab==='venturi');
   progress.ageProfile='8-10';progress.currentBlueprintId=bp.id;progress.lastStandardBlueprintId=bp.id;
   progress.inProgressStages[bp.id]={placedPartIds:bp.parts.map(p=>p.id),mistakesCount:0,updatedAt:Date.now()};
   progress.completedStages[bp.id]={completed:true,stars:3,bestMistakes:0,completedAt:Date.now()};
   const profile=s.createNewPlayerProfile({name:'Notebook QA',progressOverride:progress});
   return {key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),profileId:profile.id,id:bp.id,category:bp.category,result:VIRTUAL_LAB_TEXT.venturi.outcomes[2][language==='fr'?0:language==='en'?1:2]};
  },language);
  await page.addInitScript(({key,store})=>{if(!sessionStorage.getItem('notebook-seed')){localStorage.setItem(key,store);localStorage.setItem('mkids_onboarding_v1','1');localStorage.setItem('mkids_landing_seen','1');sessionStorage.setItem('notebook-seed','1');}},seed);
  await page.reload();
  const chooseCurrent=async()=>{const world=page.locator(`[data-catalog-world="${seed.category}"]`);if(await world.isVisible()){await world.click();await page.locator(`[data-catalog-stage="${seed.id}"]`).click();}await page.locator(`[data-workbench="${seed.id}"] canvas`).waitFor();};
  await chooseCurrent().catch(async error=>{await page.screenshot({path:'qa/notebook-failure.png'});console.log((await page.locator('body').innerText()).slice(0,3000),errors);throw error;});
  const openNotebook=async()=>{const settings=page.locator('.hud-settings');if(!await settings.evaluate(node=>node.open))await settings.locator(':scope > summary').click();await page.locator('[data-open-notebook]').click();await page.locator('[data-adventure-notebook]').waitFor();};
  await openNotebook();
  const modal=page.locator('[data-adventure-notebook]');
  assert.equal(await modal.locator('[data-adventure-route]').count(),17);
  await modal.locator('[data-adventure-route="harbour"]').click();
  assert.equal(await modal.locator('[data-adventure-stage="expansion-gantry"]').isDisabled(),true,'adventure must not bypass entitlement/tier gates without admin');
  await modal.locator('[data-adventure-route="research"]').click();
  assert.equal(await modal.locator('[data-adventure-stage="lab-venturi"]').isEnabled(),true);
  assert.equal(await modal.locator('[data-adventure-stage="lab-venturi"]').getAttribute('data-adventure-built'),'true');
  assert.equal(await modal.locator('[data-adventure-stage="lab-venturi"]').getAttribute('data-adventure-observed'),'false','construction alone must not validate an experiment');
  await modal.locator('[data-adventure-filter]').selectOption('science');
  await modal.locator('[data-adventure-search]').fill(language==='fr'?'Venturi':language==='en'?'Venturi':'فنتوري');
  if(language==='ar')await modal.locator('[data-adventure-search]').fill('');
  assert.ok(await modal.locator('[data-adventure-route="research"]').count());
  await modal.locator('[data-adventure-search]').fill('');
  await modal.locator('[data-adventure-stage="lab-venturi"]').click();
  await modal.waitFor({state:'hidden'});
  const lab=page.locator('[data-virtual-lab="venturi"]');await openMission(lab);await lab.locator('[data-virtual-lab-run]').click();
  await page.waitForFunction(async({profileId})=>{const {readNotebook}=await import('/src/utils/discoveryNotebook.ts');return readNotebook(profileId).observations.some(entry=>entry.kind==='lab-venturi');},seed);
  await openNotebook();await modal.locator('[data-notebook-tab="adventures"]').click();await modal.locator('[data-adventure-route="research"]').click();
  assert.equal(await modal.locator('[data-adventure-stage="lab-venturi"]').getAttribute('data-adventure-observed'),'false','an intermediate outcome must not complete an experiment');
  await modal.press('Escape');
  await openMission(lab);await pickMission(lab,'0',2);await pickMission(lab,'1',1);await lab.locator('[data-virtual-lab-run]').click();
  await page.locator('[data-lab-outcome="2"]').waitFor();
  await page.waitForFunction(async({profileId,id})=>{const {readNotebook}=await import('/src/utils/discoveryNotebook.ts');return readNotebook(profileId).observations.some(entry=>entry.blueprintId===id&&entry.kind==='lab-venturi'&&entry.settings[0]===2&&entry.settings[1]===1&&entry.success===true);},seed);
  await page.reload();await chooseCurrent();await openNotebook();await modal.locator('[data-adventure-route="research"]').click();
  assert.equal(await modal.locator('[data-adventure-stage="lab-venturi"]').getAttribute('data-adventure-observed'),'true');
  await modal.locator('[data-notebook-tab="notebook"]').click();
  const entry=modal.locator(`[data-notebook-entry="${seed.id}"]`);await entry.getByText(seed.result,{exact:false}).first().waitFor();
  assert.equal(await page.evaluate(async()=>{const {readNotebook}=await import('/src/utils/discoveryNotebook.ts');return readNotebook('unrelated-profile').observations.length;}),0,'notebook must isolate profiles');
  await entry.locator('[data-notebook-reopen]').click();await modal.waitFor({state:'hidden'});
  assert.equal(await page.locator('main canvas').count(),1,'reopening uses the one workshop scene');
  assert.deepEqual(errors,[]);console.log(`${language}: seventeen adventures, filters, locked workshop respected, construction and successful experiment separate, real Venturi result persists and reopens main scene`);
  await page.close();
 }
} finally {await browser.close();}
