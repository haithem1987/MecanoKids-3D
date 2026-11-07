import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {canvasTarget,canvasFraming,isoProjection} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const language of ['fr','en','ar']){
 const page=await browser.newPage({viewport:{width:1280,height:850},hasTouch:true,reducedMotion:'reduce'});page.setDefaultTimeout(12000);
 const errors=[];page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:7302/?admin=1');
 const id='expansion-gantry';
 const seed=await page.evaluate(async({language,id})=>{
  const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts');
  const progress=s.createDefaultProgress(language,true);progress.diagnosticTutorialSeen=true;progress.muted=true;
  const profile=s.createNewPlayerProfile({name:'Modes QA',progressOverride:progress}),bp=VEHICLE_BLUEPRINTS.find(item=>item.id===id);
  return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),category:bp.category,parts:bp.parts.map(part=>({id:part.id,dependsOn:part.dependsOn,targetPos:part.targetPos}))};
 },{language,id});
 await page.addInitScript(({key,store})=>{if(!sessionStorage.getItem('modes-seed')){localStorage.setItem(key,store);sessionStorage.setItem('modes-seed','1');}},seed);
 await page.reload();await page.locator(`[data-catalog-world="${seed.category}"]`).click();await page.locator(`[data-catalog-stage="${id}"]`).click();
 const canvas=page.locator(`[data-workbench="${id}"] canvas`),settings=page.locator('.hud-settings');await canvas.waitFor();
 const choose=async mode=>{if(!await settings.evaluate(node=>node.open))await settings.locator('summary').click();await settings.locator(`[data-play-mode="${mode}"]`).click();assert.equal(await settings.locator(`[data-play-mode="${mode}"]`).getAttribute('aria-pressed'),'true');await settings.locator('summary').click();await page.waitForTimeout(250);};
 await choose('expert');
 const root=seed.parts.find(part=>part.dependsOn.length===0),card=page.locator(`[data-part-id="${root.id}"]`);const rect=await card.boundingBox(),target=isoProjection(await canvasFraming(canvas),root.targetPos);
 await page.mouse.move(rect.x+rect.width/2,rect.y+rect.height/2);await page.mouse.down();await page.mouse.move(target.x,target.y,{steps:12});await page.waitForTimeout(250);await page.mouse.up();await page.waitForTimeout(200);assert.ok(await card.isDisabled(),'Expert must still allow accurate drag placement');
 await choose('guided');
 const second=seed.parts.find(part=>part.id!==root.id&&part.dependsOn.every(dep=>dep===root.id));const secondCard=page.locator(`[data-part-id="${second.id}"]`);await secondCard.click();await page.waitForTimeout(250);const point=await canvasTarget(canvas);await page.mouse.click(point.x,point.y);await page.waitForTimeout(150);assert.ok(await secondCard.isDisabled(),'Guided mode must allow tap placement');
 const before=await page.locator('[data-part-id]:disabled').count();await choose('repair');assert.ok(await page.locator('[data-part-id]:disabled').count()>before,'Repair opens its isolated partial build');await choose('guided');assert.equal(await page.locator('[data-part-id]:disabled').count(),before,'Leaving repair restores the original assembly');assert.ok(await card.isDisabled());assert.ok(await secondCard.isDisabled());
 const dispatch=(success,blueprintId=id)=>page.evaluate(({success,blueprintId})=>window.dispatchEvent(new CustomEvent('octogears:workshop-discovery',{detail:{blueprintId,kind:'qa',success,result:['Résultat QA','QA result','نتيجة الاختبار']}})),{success,blueprintId});
 await dispatch(false);await page.waitForTimeout(100);assert.equal(await page.locator('[data-octo-surprise]').count(),0,'An observation alone must not celebrate');
 await dispatch(true,'other-workshop');await page.waitForTimeout(100);assert.equal(await page.locator('[data-octo-surprise]').count(),0,'An old workshop cannot trigger a celebration');
 await dispatch(true);await page.locator('[data-octo-surprise]').waitFor();await page.waitForTimeout(2800);await dispatch(true);await page.waitForTimeout(100);assert.equal(await page.locator('[data-octo-surprise]').count(),0,'Rapid replays must not spam the mascot');
 assert.deepEqual(errors,[]);console.log(`${language}: expert drag, guided tap, isolated repair/restoration, discovery filtering and celebration throttle verified`);await page.close();
}}finally{await browser.close();}
