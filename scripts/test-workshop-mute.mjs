import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {canvasTarget} from './canvas-geometry.mjs';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const language of ['fr','en','ar']){
 if(process.env.OCTO_QA_LANGUAGE&&!process.env.OCTO_QA_LANGUAGE.split(',').includes(language))continue;
 if(process.env.OCTO_QA_DEBUG)console.log(language+': opening mute QA');
 const page=await browser.newPage({viewport:{width:1280,height:900},reducedMotion:'reduce'});page.setDefaultTimeout(15000);
 await page.addInitScript(()=>{
  Object.defineProperty(speechSynthesis,'getVoices',{value:()=>[]});window.qaAudioMeters=[];window.qaAudioHistoryMeters=[];
  const connect=AudioNode.prototype.connect;
  AudioNode.prototype.connect=function(destination,...args){
   if(destination instanceof AudioDestinationNode){const analyser=this.context.createAnalyser();analyser.fftSize=512;connect.call(this,analyser);connect.call(analyser,destination);window.qaAudioMeters.push(analyser);const history=this.context.createAnalyser();history.fftSize=32768;connect.call(this,history);window.qaAudioHistoryMeters.push(history);
    return destination;}
   return connect.call(this,destination,...args);
  };
  window.qaAudioRecentPeak=()=>Math.max(0,...window.qaAudioHistoryMeters.map(analyser=>{const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);return Math.max(...samples.map(Math.abs));}));
  window.qaAudioPeak=()=>Math.max(0,...window.qaAudioMeters.map(analyser=>{const samples=new Float32Array(analyser.fftSize);analyser.getFloatTimeDomainData(samples);return Math.max(...samples.map(Math.abs));}));
 });
 await page.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await page.evaluate(async language=>{const s=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts');const progress=s.createDefaultProgress(language,true);progress.voiceAutoRead=false;progress.muted=false;const profile=s.createNewPlayerProfile({name:'Mute QA',progressOverride:progress}),bp=VEHICLE_BLUEPRINTS[0];return{key:s.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),id:bp.id,category:bp.category,parts:bp.parts.map(part=>({id:part.id,dependsOn:part.dependsOn}))};},language);
 await page.addInitScript(({key,store})=>{if(!sessionStorage.getItem('mute-seed')){localStorage.setItem(key,store);sessionStorage.setItem('mute-seed','1');}},seed);await page.reload();await page.locator(`[data-catalog-world="${seed.category}"]`).click();await page.locator(`[data-catalog-stage="${seed.id}"]`).click();
 if(process.env.OCTO_QA_DEBUG)console.log(language+': scene opened');
 const button=page.locator('[data-workshop-mute]');await button.waitFor();
 const toggleMute=async()=>{const next=await button.getAttribute('aria-pressed')!=='true';await button.click();assert.equal(await button.getAttribute('aria-pressed'),String(next));await page.waitForFunction(({key,next})=>{const store=JSON.parse(localStorage.getItem(key));return store.profiles.find(profile=>profile.id===store.activeProfileId).progress.muted===next;},{key:seed.key,next});};
 await page.locator('[data-workbench] canvas').click({position:{x:400,y:400}});
 await page.evaluate(async language=>{const {soundEngine}=await import('/src/audio/soundEngine.ts'),{speechEngine}=await import('/src/utils/speech.ts'),{PLAY_MODES_TEXT}=await import('/src/i18n/translations.ts');soundEngine.playStageVictory();speechEngine.speak('mute-qa',PLAY_MODES_TEXT.guidedDescription[['fr','en','ar'].indexOf(language)],language);},language);
 if(process.env.OCTO_QA_DEBUG)console.log(language+': initial audio requested');
 await page.waitForFunction(()=>window.qaAudioPeak()>.001);await toggleMute();assert.equal(await button.getAttribute('aria-pressed'),'true');await page.waitForTimeout(80);assert.ok(await page.evaluate(()=>window.qaAudioPeak())<.000001,'Mute must silence rendered samples, not just button state');assert.equal(await page.evaluate(async()=>(await import('/src/utils/speech.ts')).speechEngine.getSnapshot().isSpeaking),false);
 await page.evaluate(async()=>{const {soundEngine}=await import('/src/audio/soundEngine.ts'),{speechEngine}=await import('/src/utils/speech.ts');soundEngine.playStageVictory();speechEngine.replay();});await page.waitForTimeout(60);assert.ok(await page.evaluate(()=>window.qaAudioPeak())<.000001,'New sounds while muted must remain silent');
 await toggleMute();await page.waitForTimeout(80);assert.ok(await page.evaluate(()=>window.qaAudioPeak())<.000001,'Unmuting must not resume cancelled notes or narration');await page.evaluate(async()=>(await import('/src/audio/soundEngine.ts')).soundEngine.playStageVictory());await page.waitForFunction(()=>window.qaAudioPeak()>.001);
 if(process.env.OCTO_QA_DEBUG)console.log(language+': initial mute/re-enable verified');
 if(!process.env.OCTO_QA_UI_ONLY){
 await toggleMute();assert.equal(await button.getAttribute('aria-pressed'),'true');const persisted=await page.evaluate(async()=>{const url=performance.getEntriesByType('resource').map(entry=>entry.name).find(name=>name.includes('/src/audio/audioContext.ts?t='))??'/src/audio/audioContext.ts';const audio=await import(url),old=audio.getAudioContext();await Promise.race([old.close(),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Browser did not close the test audio context')),5000))]);const next=audio.getAudioContext();return audio.getWorkshopAudioOutput(next).gain.value;});assert.equal(persisted,0,'Mute must survive audio context recreation');
 await toggleMute();await page.evaluate(async()=>(await import('/src/audio/soundEngine.ts')).soundEngine.playStageVictory());await page.waitForFunction(()=>window.qaAudioPeak()>.001);await page.waitForTimeout(800);
 await page.evaluate(async()=>{const {speechEngine}=await import('/src/utils/speech.ts');speechEngine.setVoiceVolume(0);speechEngine.replay();});await page.waitForTimeout(100);assert.ok(await page.evaluate(()=>window.qaAudioPeak())<.000001,'Voice volume zero must prevent playback');
 let release;const held=new Promise(resolve=>{release=resolve;});let intercepted=false;const pendingLanguage=language==='ar'?'fr':'ar';
 await page.route(`**/narration/${pendingLanguage}/*.mp3`,async route=>{intercepted=true;await held;await route.continue();});
 await page.evaluate(async pendingLanguage=>{const {speechEngine}=await import('/src/utils/speech.ts'),{PLAY_MODES_TEXT}=await import('/src/i18n/translations.ts');speechEngine.setVoiceVolume(1);speechEngine.speak('pending-voice',PLAY_MODES_TEXT.expertDescription[['fr','en','ar'].indexOf(pendingLanguage)],pendingLanguage);},pendingLanguage);
 for(let i=0;i<100&&!intercepted;i++)await page.waitForTimeout(30);assert.ok(intercepted,'A narration fetch must be pending for the mute race test');await toggleMute();release();await page.waitForTimeout(400);assert.ok(await page.evaluate(()=>window.qaAudioPeak())<.000001,'A late narration response must not start after mute');await toggleMute();await page.waitForTimeout(100);assert.ok(await page.evaluate(()=>window.qaAudioPeak())<.000001,'A cancelled pending narration must not resume when sound returns');

 }else await page.waitForTimeout(800);
 if(process.env.OCTO_QA_DEBUG)console.log(language+': testing muted placement');
 await toggleMute();const root=seed.parts.find(part=>part.dependsOn.length===0),card=page.locator(`[data-part-id="${root.id}"]`);await card.click();await page.waitForTimeout(250);assert.equal(await card.getAttribute('aria-pressed'),'true');assert.ok(await page.evaluate(()=>window.qaAudioPeak())<.000001,'Selecting a piece in the real scene must remain silent');let target=await canvasTarget(page.locator('[data-workbench] canvas'));await page.mouse.click(target.x,target.y);await page.waitForTimeout(150);assert.ok(await card.isDisabled(),'Muting must not block construction');assert.ok(await page.evaluate(()=>window.qaAudioPeak())<.000001,'Actual snap feedback must remain silent');
 if(process.env.OCTO_QA_DEBUG)console.log(language+': reloading persisted mute');
 await page.reload();await page.locator(`[data-catalog-world="${seed.category}"]`).click();await page.locator(`[data-catalog-stage="${seed.id}"]`).click();await button.waitFor();assert.equal(await button.getAttribute('aria-pressed'),'true','The profile mute choice must survive reload');assert.ok(await page.locator(`[data-part-id="${root.id}"]`).isDisabled(),'The placed part must survive the mute persistence check');await toggleMute();const nextId=await page.locator('[data-part-id]:visible:not([disabled])').first().getAttribute('data-part-id'),ready=page.locator(`[data-part-id="${nextId}"]`);await ready.click();await page.waitForTimeout(250);target=await canvasTarget(page.locator('[data-workbench] canvas'));await Promise.all([page.waitForFunction(()=>window.qaAudioRecentPeak()>.001),page.mouse.click(target.x,target.y)]);await page.waitForTimeout(150);assert.ok(await ready.isDisabled(),'New placement must still work after sound is restored');
 console.log(`${language}: real mute button persists in profile/reload; scene selection and snapping stay silent, new scene sounds return; button state, profile persistence, silence and real scene sound restoration verified`);await page.close();
}}finally{await browser.close();}
