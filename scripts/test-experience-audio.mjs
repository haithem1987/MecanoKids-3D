import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),{chromium}=require(process.argv[2]??'playwright');
const browser=await chromium.launch({channel:'chrome',args:['--enable-unsafe-swiftshader']});
try{for(const [locale,language]of ['fr','en','ar'].entries()){
 const page=await browser.newPage({viewport:{width:1280,height:850},reducedMotion:'reduce'});page.setDefaultTimeout(15000);
 const audioResponses=[];page.on('response',response=>{if(response.url().includes('/narration/')&&response.url().endsWith('.mp3'))audioResponses.push({url:response.url(),status:response.status()});});
 await page.addInitScript(()=>{
  Object.defineProperty(speechSynthesis,'getVoices',{value:()=>[]});window.experienceAudioClips=[];
  const start=AudioBufferSourceNode.prototype.start;
  AudioBufferSourceNode.prototype.start=function(...args){
   if(this.buffer&&args.length===3){
    const data=this.buffer.getChannelData(0),begin=Math.floor(args[1]*this.buffer.sampleRate),end=Math.min(data.length,Math.ceil((args[1]+args[2])*this.buffer.sampleRate));let peak=0;
    for(let sample=begin;sample<end;sample++)peak=Math.max(peak,Math.abs(data[sample]));
    window.experienceAudioClips.push({offset:args[1],duration:args[2],peak,state:this.context.state});
   }
   return start.apply(this,args);
  };
 });
 await page.goto('http://127.0.0.1:7302/?admin=1');
 const seed=await page.evaluate(async({language,locale})=>{
  const storage=await import('/src/utils/storage.ts'),{VEHICLE_BLUEPRINTS}=await import('/src/data/blueprints.ts'),{PLAY_MODES_TEXT,UI_TRANSLATIONS,ADVENTURE_NOTEBOOK_TEXT}=await import('/src/i18n/translations.ts');
  const progress=storage.createDefaultProgress(language,true);progress.voiceAutoRead=false;
  const profile=storage.createNewPlayerProfile({name:'Experience Audio QA',progressOverride:progress}),bp=VEHICLE_BLUEPRINTS[0];
  return{key:storage.PROFILES_STORAGE_KEY,store:JSON.stringify({activeProfileId:profile.id,profiles:[profile]}),id:bp.id,category:bp.category,modeLabel:UI_TRANSLATIONS[language].replayInstructionAria,modeText:PLAY_MODES_TEXT.title[locale],listen:ADVENTURE_NOTEBOOK_TEXT.listen[locale],routes:Object.entries(ADVENTURE_NOTEBOOK_TEXT.routes).map(([id,text])=>({id,text:text.goal[locale]}))};
 },{language,locale});
 await page.addInitScript(({key,store})=>{if(!sessionStorage.getItem('experience-audio-seed')){localStorage.setItem(key,store);sessionStorage.setItem('experience-audio-seed','1');}},seed);
 await page.reload();await page.locator(`[data-catalog-world="${seed.category}"]`).click();await page.locator(`[data-catalog-stage="${seed.id}"]`).click();
 const verify=async(button,text,id)=>{
  const expected=await page.evaluate(async({language,text})=>{const {narrationKey,narrationPhrases}=await import('/src/audio/narrationText.ts'),index=await(await fetch(`/narration/${language}/index.json`)).json();return index[narrationKey(narrationPhrases(text)[0])];},{language,text});assert.ok(expected,`${language}: local clip missing for ${text}`);
  const before=await page.evaluate(()=>window.experienceAudioClips.length);await button.click();
  await page.waitForFunction(({before,offset})=>window.experienceAudioClips.slice(before).some(clip=>Math.abs(clip.offset-offset)<.002),{before,offset:expected[1]/1000});
  const clip=await page.evaluate(({before,offset})=>window.experienceAudioClips.slice(before).find(clip=>Math.abs(clip.offset-offset)<.002),{before,offset:expected[1]/1000});
  assert.ok(clip.peak>.001,`${id} audio is silent`);assert.equal(clip.state,'running');assert.ok(clip.duration>.1);
  const spoken=await page.evaluate(async()=>{const {speechEngine}=await import('/src/utils/speech.ts');const spoken=speechEngine.lastSpoken;speechEngine.stop();return spoken;});assert.equal(spoken.id,id);assert.equal(spoken.lang,language);
  assert.ok(audioResponses.some(response=>response.status===200&&response.url.endsWith(`/narration/${language}/${expected[0]}.mp3`)),`${id}: expected local track not loaded`);
 };
 const settings=page.locator('.hud-settings');await settings.locator('summary').click();await verify(settings.locator('[data-workshop-play-modes]').getByRole('button',{name:seed.modeLabel,exact:true}),seed.modeText,'play-modes');
 await settings.locator('[data-open-notebook]').click();const notebook=page.locator('[data-adventure-notebook]');await notebook.waitFor();
 for(const route of seed.routes){await notebook.locator(`[data-adventure-route="${route.id}"]`).click();await verify(notebook.getByRole('button',{name:seed.listen,exact:true}),route.text,'adventure-goal');}
 console.log(`${language}: mode instructions and ${seed.routes.length} adventure goals play non-silent local clips with zero native voices`);await page.close();
}}finally{await browser.close();}
