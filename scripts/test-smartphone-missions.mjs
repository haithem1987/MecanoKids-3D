import {createRequire} from 'node:module';
import {pickMission,openMission} from './mission-controls.mjs';
import {canvasTarget} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const b=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const [width,height,language]of[[320,568,'fr'],[390,844,'en'],[430,932,'ar'],[667,375,'fr'],[568,320,'en'],[915,412,'ar'],[768,1024,'fr'],[1280,800,'en']]){
 const p=await b.newPage({viewport:{width,height},hasTouch:width<1100,isMobile:width<640||height<501,reducedMotion:'reduce'});const errors=[];p.on('pageerror',error=>errors.push(error.message));await p.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await p.evaluate(async language=>{const s=await import('/src/utils/storage.ts'),{VIRTUAL_LAB_BLUEPRINTS}=await import('/src/data/virtualLabBlueprints.ts');const bp=VIRTUAL_LAB_BLUEPRINTS.find(b=>b.virtualLab==='venturi'),progress=s.createDefaultProgress(language,true);progress.inProgressStages[bp.id]={placedPartIds:bp.parts.map(p=>p.id),mistakesCount:0,updatedAt:Date.now()};const profile=s.createNewPlayerProfile({name:'Phone QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),id:bp.id,category:bp.category};},language);
 await p.addInitScript(({key,store})=>{if(!sessionStorage.getItem('phone-seed')){localStorage.setItem(key,store);sessionStorage.setItem('phone-seed','1');}},seed);await p.reload();await p.locator(`[data-catalog-world="${seed.category}"]`).click();await p.locator(`[data-catalog-stage="${seed.id}"]`).click();
 const lab=p.locator('[data-virtual-lab="venturi"]'),canvas=p.locator(`[data-workbench="${seed.id}"] canvas`),run=lab.locator('[data-virtual-lab-run]');await canvas.waitFor();await openMission(lab);await p.waitForTimeout(300);
 const safe=async button=>{const rect=await button.boundingBox();if(!rect||rect.width<63||rect.height<63||rect.y<0||rect.y+rect.height>height+.5||rect.x<0||rect.x+rect.width>width+.5)throw Error(`Control outside viewport: ${width}x${height} ${JSON.stringify(rect)}`);const clear=await button.evaluate(node=>{const r=node.getBoundingClientRect(),hit=document.elementFromPoint(r.x+r.width/2,r.y+r.height/2);return node.contains(hit);});if(!clear)throw Error(`Covered control at ${width}x${height}`);};
 await safe(run);await pickMission(lab,'0',2);await safe(run);await pickMission(lab,'1',1);await safe(run);await run.click();await p.locator('[data-lab-outcome="2"]').waitFor();await safe(run);
 if(await lab.locator('[data-mission-open-controls]').count()&&await lab.locator('[data-mission-open-controls]').getAttribute('aria-expanded')!=='false')throw Error('Parameters did not close after running');
 const target=await canvasTarget(canvas);if(!await p.evaluate(({x,y})=>document.elementFromPoint(x,y)?.tagName==='CANVAS',target))throw Error(`3D result area covered at ${width}x${height} ${JSON.stringify(target)}`);
 if(errors.length)throw Error(errors.join('\n'));
 await p.screenshot({path:`qa/smartphone-mission-${width}-${height}-${language}.png`});console.log(`${width}x${height} ${language}: mission runs without vertical scroll; primary action and 3D remain accessible`);await p.close();
}}finally{await b.close();}
