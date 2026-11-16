import {readFile,access} from 'node:fs/promises';
import {MATH_TEXT} from '../src/i18n/translations';
import {MATH_ACTIVITY_KINDS,mathEquation} from '../src/data/mathActivities';
import {narrationPhrases,narrationKey} from '../src/audio/narrationText';
for(const [locale,language]of ['fr','en','ar'].entries()){
 const index=JSON.parse(await readFile(`public/narration/${language}/index.json`,'utf8')) as Record<string,[number,number,number]>;
 const phrases:string[]=Object.values(MATH_TEXT).map(row=>row[locale]);for(const kind of MATH_ACTIVITY_KINDS)for(const level of [0,1,2])phrases.push(`${MATH_TEXT.target[locale]} ${mathEquation(kind,[],level,true)}.`);
 for(const text of phrases)for(const phrase of narrationPhrases(text)){const clip=index[narrationKey(phrase)];if(!clip||clip[2]<=0)throw Error(`Missing ${language}: ${phrase}`);await access(`public/narration/${language}/${clip[0]}.mp3`);}
 console.log(language+': all mathematical mechanism instructions have local audio');
}
