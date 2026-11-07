import {createRequire} from 'node:module';
import {pickMission,openMission} from './mission-controls.mjs';
import {canvasTarget} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const b=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const [width,height,language]of[[390,844,'fr'],[430,932,'ar']]){
 const p=await b.newPage({viewport:{width,height},hasTouch:width<1100,isMobile:width<640||height<501,reducedMotion:'reduce'});const errors=[];p.on('pageerror',error=>errors.push(error.message));await p.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await p.evaluate(async language=>{const s=await import('/src/utils/storage.ts'),{VIRTUAL_LAB_BLUEPRINTS}=await import('/src/data/virtualLabBlueprints.ts');const bp=VIRTUAL_LAB_BLUEPRINTS.find(b=>b.virtualLab==='venturi'),progress=s.createDefaultProgress(language,true);progress.inProgressStages[bp.id]={placedPartIds:bp.parts.map(p=>p.id),mistakesCount:0,updatedAt:Date.now()};const profile=s.createNewPlayerProfile({name:'Phone QA',progressOverride:progress});return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),id:bp.id,category:bp.category};},language);
 await p.addInitScript(({key,store})=>{if(!sessionStorage.getItem('phone-seed')){localStorage.setItem(key,store);sessionStorage.setItem('phone-seed','1');}},seed);await p.reload();await p.locator(`[data-catalog-world="${seed.category}"]`).click();await p.locator(`[data-catalog-stage="${seed.id}"]`).click();
 const list=p.locator('.parts-list');await list.waitFor();const box=await list.boundingBox();
 const cdp=await p.context().newCDPSession(p),y=box.y+box.height/2;
 const direction=language==='ar'?1:-1,start=box.x+box.width*(direction<0?.85:.15);
 await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:start,y}]});
 for(let i=1;i<=8;i++){await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:start+direction*box.width*.65*i/8,y}]});await p.waitForTimeout(20);}
 await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await p.waitForTimeout(300);
 if(Math.abs(await list.evaluate(node=>node.scrollLeft))<20)throw Error('Piece ribbon did not scroll');
 if(await p.locator('[data-part-id][aria-pressed="true"]').count())throw Error('Swipe selected a piece');
 await p.setViewportSize({width:844,height:390});await p.waitForTimeout(300);
 if(!await p.locator('[data-parts-palette]').isVisible())throw Error('Palette lost on rotation');
 console.log(language+': touch ribbon scrolls without selecting a piece and survives rotation');
 await p.screenshot({path:`qa/smartphone-swipe-${width}-${height}-${language}.png`});console.log(`${width}x${height} ${language}: touch swipe and orientation verified`);await p.close();
}}finally{await b.close();}
