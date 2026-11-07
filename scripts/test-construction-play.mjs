import {createRequire} from 'node:module';
import {openMission,pickMission} from './mission-controls.mjs';
import {canvasFraming,isoProjection} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const language of ['fr','en','ar']){
 if(process.env.OCTO_QA_LANGUAGE&&process.env.OCTO_QA_LANGUAGE!==language)continue;
 const page=await browser.newPage({hasTouch:language!=='fr',viewport:language==='en'?{width:768,height:1024}:{width:1280,height:800},reducedMotion:process.env.OCTO_QA_MOTION?'no-preference':'reduce'});
 page.setDefaultTimeout(12000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 for(const key of ['gantry','castle','keep','temple','truss']){
  const id=`expansion-${key}`;await page.goto('http://127.0.0.1:7302/?admin=1');
  const seed=await page.evaluate(async({id,language})=>{
   const storage=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts');
   const bp=VEHICLE_BLUEPRINTS.find(bp=>bp.id===id),progress=storage.createDefaultProgress(language,true);
   progress.inProgressStages[id]={placedPartIds:bp.parts.map(part=>part.id),mistakesCount:0,updatedAt:Date.now()};
   const profile=storage.createNewPlayerProfile({name:'Play QA',progressOverride:progress});
   return{key:storage.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),category:bp.category,marker:profile.id};
  },{id,language});
  await page.addInitScript(seed=>{if(!sessionStorage.getItem(seed.marker)){localStorage.setItem(seed.key,seed.store);sessionStorage.setItem(seed.marker,'1');}window.playDiscoveries=[];window.addEventListener('octogears:workshop-discovery',event=>window.playDiscoveries.push(event.detail));},seed);
  await page.reload();await page.locator(`[data-catalog-world="${seed.category}"]`).click();await page.locator(`[data-catalog-stage="${id}"]`).click();
  const canvas=page.locator(`[data-workbench="${id}"] canvas`),mission=page.locator('[data-construction-play]');await mission.waitFor();await openMission(mission);await page.waitForTimeout(process.env.OCTO_QA_MOTION?1300:400);
  const click=language==='fr'?page.mouse.click.bind(page.mouse):page.touchscreen.tap.bind(page.touchscreen);
  const point=key==='gantry'?[0,.595,0]:key==='keep'?[0,.36,1.35]:key==='castle'?[0,.36,2.05]:key==='temple'?[0,.58,1.35]:[-2.35,1.04,0];
  // Close desktop instruction panel so the target actor is reachable in the shared canvas.
  const summary=mission.locator(':scope > summary');if(await summary.count())await summary.click();await page.waitForTimeout(250);
  const target=isoProjection(await canvasFraming(canvas),point);await click(target.x,target.y);
  await page.waitForFunction(key=>key==='gantry'?document.querySelector('[data-construction-step]')?.getAttribute('data-construction-step')==='1':document.querySelector('[data-construction-phase]')?.getAttribute('data-construction-phase')!=='ready',key,{timeout:4000}).catch(async error=>{await page.screenshot({path:'qa/construction-play-miss.png'});console.log({key,target,framing:await canvasFraming(canvas),hit:await page.evaluate(({x,y})=>document.elementFromPoint(x,y)?.outerHTML.slice(0,250),target),phase:await mission.getAttribute('data-construction-phase'),step:await mission.getAttribute('data-construction-step')});throw error;});
  if(process.env.OCTO_QA_MOTION){await page.waitForTimeout(120);const before=await canvas.screenshot();await page.waitForTimeout(250);const after=await canvas.screenshot();if(Buffer.compare(before,after)===0)throw Error('3D actor did not move in rendered pixels');}
  await page.waitForFunction(()=>document.querySelector('[data-construction-phase]')?.getAttribute('data-construction-phase')!=='moving');await openMission(mission);
  if(key==='gantry'){
   if(await mission.getAttribute('data-construction-step')!=='1')throw Error('Crate hit did not lift');
   for(let step=2;step<=3;step++){await mission.locator('[data-construction-advance]').click();await page.waitForFunction(step=>document.querySelector('[data-construction-step]')?.getAttribute('data-construction-step')===String(step)&&document.querySelector('[data-construction-phase]')?.getAttribute('data-construction-phase')!=='moving',step);}
  }else{
   await mission.locator('[data-construction-reset]').click();await pickMission(mission,'route',1);await mission.locator('[data-construction-advance]').click();await page.locator('[data-construction-phase="blocked"]').waitFor();
   await pickMission(mission,'route',0);await mission.locator('[data-construction-advance]').click();
  }
  await page.locator('[data-construction-phase="done"]').waitFor();
  const recorded=await page.evaluate(id=>window.playDiscoveries.some(event=>event.blueprintId===id&&event.success===true&&Array.isArray(event.result)),id);if(!recorded)throw Error('Successful discovery not recorded');
  if(key==='gantry'){const before=await page.evaluate(()=>window.playDiscoveries.length),label=await page.evaluate(async language=>(await import('/src/i18n/translations.ts')).UI_TRANSLATIONS[language].styleBlocks,language),settings=page.locator('.hud-settings');await settings.locator('summary').click();await settings.getByRole('button',{name:label,exact:true}).click();await settings.locator('summary').click();await page.waitForTimeout(1200);if(await page.evaluate(()=>window.playDiscoveries.length)!==before)throw Error('Style change recorded a spurious successful trial');if(await mission.getAttribute('data-construction-step')!=='3'||await mission.getAttribute('data-construction-phase')!=='done')throw Error('Style change lost delivered state');}
  if(errors.length)throw Error(errors.join('\n'));
  await page.screenshot({path:`qa/construction-play-${key}-${language}.png`});
  await mission.locator('[data-construction-reset]').click();await page.locator('[data-construction-phase="ready"]').waitFor();
  console.log(`${language}/${key}: actor hit in shared 3D scene, accessible controls, blocked route, success and reset verified`);
 }
 await page.close();
}}finally{await browser.close();}
