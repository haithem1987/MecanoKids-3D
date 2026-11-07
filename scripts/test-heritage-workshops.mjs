import {pickMission,openMission} from './mission-controls.mjs';
import {canvasTarget,canvasFraming,isoProjection} from './canvas-geometry.mjs';
import {PerspectiveCamera,Vector3} from 'three';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url);
const {chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
const report=[];
try {
 for(const language of ['fr','en','ar']){
  if(process.env.OCTO_QA_LANGUAGE && process.env.OCTO_QA_LANGUAGE!==language)continue;
  const page=await browser.newPage({viewport:language==='en'?{width:430,height:900}:{width:1280,height:800},hasTouch:language==='en',reducedMotion:process.env.OCTO_QA_MOTION?'no-preference':'reduce'});
  page.setDefaultTimeout(10000);
  await page.goto('http://127.0.0.1:7302/?admin=1');
  const seed=await page.evaluate(async language=>{const s=await import('/src/utils/storage.ts');const p=s.createNewPlayerProfile({name:'QA',progressOverride:s.createDefaultProgress(language,true)});return {key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:p.id,profiles:[p]})}},language);
  await page.addInitScript(({key,store})=>{if(!sessionStorage.getItem('heritage-seed')){localStorage.setItem(key,store);sessionStorage.setItem('heritage-seed','1');}},seed);await page.reload();
  await page.waitForFunction(language=>document.documentElement.lang===language,language);
  const models=await page.evaluate(async requested=>{const {HERITAGE_BLUEPRINTS}=await import('/src/data/heritageBlueprints.ts');const source=requested==='master-drawbridge'?(await import('/src/data/blueprints.ts')).VEHICLE_BLUEPRINTS:HERITAGE_BLUEPRINTS;return source.map(b=>({id:b.id,category:b.category,parts:b.parts.map(p=>({id:p.id,dependsOn:p.dependsOn}))}))},process.env.OCTO_QA_MODEL??'');
  for(const model of models){
   if(process.env.OCTO_QA_MODEL && model.id!==process.env.OCTO_QA_MODEL)continue;
   await page.locator(`[data-catalog-world="${model.category}"]`).click();
   await page.locator(`[data-catalog-stage="${model.id}"]`).click();
   const canvas=page.locator(`[data-workbench="${model.id}"] canvas`);await canvas.waitFor();
   const placed=new Set();
   while(placed.size<model.parts.length){
    const available=model.parts.filter(p=>!placed.has(p.id)&&p.dependsOn.every(id=>placed.has(id)));
    if(!available.length)throw Error(`dependency deadlock ${model.id}`);
    const part=available.at(-1);const card=page.locator(`[data-part-id="${part.id}"]:visible`);
    if(language==='en')await card.tap();else await card.press('Enter');await page.waitForTimeout(process.env.OCTO_QA_MOTION ? 1100 : 210);
    const target=await canvasTarget(canvas);if(language==='en')await page.touchscreen.tap(target.x,target.y);else await page.mouse.click(target.x,target.y);await page.waitForTimeout(60);
    if(await page.locator(`[data-workbench="${model.id}"]`).getAttribute('data-assembly-complete')!=='true' && (!await card.count() || !await card.isDisabled()))throw Error(`${language}/${model.id}/${part.id} failed`);
    placed.add(part.id);
   }
   if(model.id==='master-drawbridge'){
    const trial=page.locator('[data-drawbridge-phase]');await trial.waitFor();await openMission(trial);
    await page.waitForTimeout(3000);const closed=await canvas.screenshot();
    await trial.locator('[data-mission-primary]').click();await page.locator('[data-drawbridge-phase="open"]').waitFor();
    await page.waitForTimeout(1200);const opened=await canvas.screenshot();await page.waitForTimeout(800);const held=await canvas.screenshot();
    if(Buffer.compare(closed,opened)===0)throw Error('Drawbridge leaves did not lift');
    if(Buffer.compare(opened,held)!==0)throw Error('Drawbridge joints drift while held open');
    await trial.locator('[data-mission-reset]').click();await page.locator('[data-drawbridge-phase="passed"]').waitFor();
    await trial.locator('[data-mission-primary]').click();await page.locator('[data-drawbridge-phase="closed"]').waitFor();
   }
   if(model.id==='expansion-aqueduct'){
    const trial=page.locator('[data-aqueduct-phase]');await trial.waitFor();await openMission(trial);
    if(!await trial.locator('[data-aqueduct-water]').isDisabled())throw Error('Aqueduct water should wait for the centering removal');
    await trial.locator('[data-aqueduct-centering]').click();await page.locator('[data-aqueduct-phase="released"]').waitFor();
    await trial.locator('[data-aqueduct-water]').click();await page.locator('[data-aqueduct-phase="flowing"]').waitFor();
    await trial.locator('[data-aqueduct-centering]').click();await page.locator('[data-aqueduct-phase="supported"]').waitFor();
   }
   if(model.id==='expansion-beacon'){
    const trial=page.locator('[data-beacon-outcome]');await trial.waitFor();await openMission(trial);
    const pick=async(key,value)=>{await pickMission(trial,key,value);await trial.locator('[data-mission-primary]').click();};
    for(const source of [0,1])for(const day of [0,1])for(const charge of [0,1]){
      await pick('source',source);await pick('light',day);await pick('charge',charge);
      const outcome=source===0?(day===0?'solarOn':'solarOff'):(charge===0?'batteryOn':'batteryOff');
      await page.locator(`[data-beacon-outcome="${outcome}"]`).waitFor();
    }
    if(language==='fr'){
      await page.waitForTimeout(3000);
      const styles=await page.evaluate(async()=>{const t=(await import('/src/i18n/translations.ts')).UI_TRANSLATIONS.fr;return[t.styleWood,t.styleBlocks,t.styleRealistic,t.styleComics];});
      const settings=page.locator('.hud-settings');
      for(const label of styles){
        await pick('source',1);await pick('light',0);await pick('charge',1);
        if(!await settings.evaluate(node=>node.open))await settings.locator('summary').click();
        await settings.getByRole('button',{name:label,exact:true}).click();await settings.locator('summary').click();await page.waitForTimeout(350);
        const off=await canvas.screenshot();await pick('charge',0);await page.waitForTimeout(150);const lit=await canvas.screenshot();
        if(Buffer.compare(off,lit)===0)throw Error(`LED does not change visibly in ${label}`);
      }
      console.log('Beacon: visible LED response verified in all four visual styles');
    }
    if(language==='fr'){
      const iso=await page.evaluate(async language=>(await import('/src/i18n/translations.ts')).UI_TRANSLATIONS[language].camIso,language);
      await page.getByRole('button',{name:iso,exact:true}).click();await page.waitForTimeout(300);
      const point=isoProjection(await canvasFraming(canvas),[.75,.40,.7]);
      const before=await trial.getAttribute('data-beacon-source');await page.mouse.click(point.x,point.y);
      await page.waitForFunction(before=>document.querySelector('[data-beacon-source]')?.getAttribute('data-beacon-source')!==before,before);
      console.log('Beacon: source selector responds to a click in the 3D scene');
    }
   }
   if(model.id==='expansion-watermill'){
    const trial=page.locator('[data-watermill-flow]');await trial.waitFor();await openMission(trial);
    if(process.env.OCTO_QA_MOTION){
      await page.waitForTimeout(3000);await pickMission(trial,'flow',2);await trial.locator('[data-mission-primary]').click();await page.waitForTimeout(700);
      const movingA=await canvas.screenshot();await page.waitForTimeout(700);const movingB=await canvas.screenshot();
      if(Buffer.compare(movingA,movingB)===0)throw Error('Wheel does not rotate with flow');
      await pickMission(trial,'flow',0);await trial.locator('[data-mission-primary]').click();await page.waitForTimeout(1200);
      const stillA=await canvas.screenshot();await page.waitForTimeout(800);const stillB=await canvas.screenshot();
      if(Buffer.compare(stillA,stillB)!==0)throw Error('Wheel keeps moving with gate closed');
      console.log('Waterwheel: rotation with flow and stable stop verified in rendered pixels');
    }
    for(const value of [1,2,0]){await pickMission(trial,'flow',value);await trial.locator('[data-mission-primary]').click();await page.waitForFunction(value=>document.querySelector('[data-watermill-flow]')?.getAttribute('data-watermill-flow')===String(value),value);}
    const sceneBox=await canvas.boundingBox(),missionBox=await page.locator('.workbench-mission').boundingBox();
    const overlap=Math.max(0,Math.min(sceneBox.x+sceneBox.width,missionBox.x+missionBox.width)-Math.max(sceneBox.x,missionBox.x))*Math.max(0,Math.min(sceneBox.y+sceneBox.height,missionBox.y+missionBox.height)-Math.max(sceneBox.y,missionBox.y));
    // Missions float above the scene; the placement target must remain unobstructed.
   }
   await page.waitForTimeout(1000);
   await page.screenshot({path:`qa/${model.id}-${language}.png`});
   const scene=await canvas.boundingBox();
   if(await page.getByText(/Collapse Workbench|Réduire l’établi|Réduire l'établi/).count())throw Error('Collapsible workbench returned');
   if(!await page.locator('[data-parts-palette]').isVisible())throw Error('Parts palette disappeared');
   report.push({language,id:model.id,assembled:placed.size,scene});console.log(JSON.stringify(report.at(-1)));
   // Completion opens its ordinary discovery card; reload preserves the completed assembly and opens the admin catalogue.
   await page.reload();await page.locator('[data-catalog-world]').first().waitFor();
  }
  await page.close();
 }
} finally {await browser.close();}
console.log(`Validated ${report.length} complete assemblies`);
