import {MATH_ACTIVITY_KINDS,mathEquation} from '../src/data/mathActivities';
import { spawnSync } from 'node:child_process';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { VEHICLE_BLUEPRINTS } from '../src/data/blueprints';
import { RAIL_MAGLEV_TEXT, RAIL_ADVENTURE_TEXT, MATH_TEXT, WORKSHOP_ACCESS_TEXT, HERITAGE_DISCOVERY_TEXT, SCIENCE_DISCOVERY_TEXT, VEHICLE_ADVENTURE_TEXT, ADVENTURE_NOTEBOOK_TEXT, PLAY_MODES_TEXT, CONSTRUCTION_PLAY_TEXT, DIAGNOSTIC_NARRATION, DRAWBRIDGE_TEXT, WATERMILL_TRIAL_TEXT, BEACON_TRIAL_TEXT, AQUEDUCT_TRIAL_TEXT, getLocalizedBlueprint, SCIENCE_CHALLENGE_TEXT, UI_TRANSLATIONS, VIRTUAL_LAB_TEXT, VIRTUAL_LAB_UI } from '../src/i18n/translations';
import { generateMechanicalQuiz } from '../src/utils/quizGenerator';
import { narrationKey, narrationPhrases } from '../src/audio/narrationText';
import type { LanguageCode } from '../src/types/game';

// Usage: npx tsx scripts/build-narration.ts <espeak-ng/dist> <fr|en|ar>
const engineDir = process.argv[2];
const language = process.argv[3] as LanguageCode;
const locale = ['fr', 'en', 'ar'].indexOf(language);
if (!engineDir || locale < 0) throw new Error('Provide espeak-ng/dist and fr, en or ar.');
const engine = (await import(pathToFileURL(path.resolve(engineDir, 'espeak-ng.js')).href)).default;
const wasm = await WebAssembly.compile(await readFile(path.resolve(engineDir, 'espeak-ng.wasm')));
const strings = new Map<string, string>();
const add = (text: string) => {
  for (const phrase of narrationPhrases(text)) strings.set(narrationKey(phrase), phrase);
};
const t = UI_TRANSLATIONS[language];
const supplement = process.argv.includes('--diagnostic-only');
const append = supplement || process.argv.includes('--append');
for (const phrase of [t.voiceTestSample, t.howItWorksTitle, t.realRecordTitle, t.discoveryObservationTitle, t.didYouKnowTitle]) add(phrase);
for (const step of t.tourSteps) [step.title, step.description, step.tip].forEach(add);
for (const labels of [RAIL_ADVENTURE_TEXT, MATH_TEXT, WORKSHOP_ACCESS_TEXT, HERITAGE_DISCOVERY_TEXT, SCIENCE_DISCOVERY_TEXT, VEHICLE_ADVENTURE_TEXT, PLAY_MODES_TEXT, CONSTRUCTION_PLAY_TEXT, SCIENCE_CHALLENGE_TEXT, VIRTUAL_LAB_UI, DRAWBRIDGE_TEXT, WATERMILL_TRIAL_TEXT, BEACON_TRIAL_TEXT, AQUEDUCT_TRIAL_TEXT]) {
  Object.values(labels).forEach(row => add(row[locale]));
}
add(RAIL_MAGLEV_TEXT.done[locale]);
for(const kind of MATH_ACTIVITY_KINDS)for(const level of [0,1,2])add(`${MATH_TEXT.target[locale]} ${mathEquation(kind,[],level,true)}.`);
const {routes,groups,...notebookLabels}=ADVENTURE_NOTEBOOK_TEXT;
Object.values(notebookLabels).forEach(row=>add(row[locale]));
Object.values(groups).forEach(row=>add(row[locale]));
Object.values(routes).forEach(route=>[route.title,route.goal].forEach(row=>add(row[locale])));
for (const lab of Object.values(VIRTUAL_LAB_TEXT)) {
  [lab.name, lab.goal, lab.why, ...lab.outcomes].forEach(row => add(row[locale]));
}
for (const raw of VEHICLE_BLUEPRINTS) {
  const bp = getLocalizedBlueprint(raw, language);
  [bp.name, ...Object.values(bp.discovery)].forEach(add);
  for (const part of bp.parts) {
    [part.name, part.roleHint].forEach(add);
    for (const dependency of part.dependsOn) {
      const previous = bp.parts.find(item => item.id === dependency);
      if (previous) add(t.placeFirstMsg(previous.name, part.name));
    }
  }
  for (const question of generateMechanicalQuiz(bp, language)) {
    [question.prompt, ...question.options].forEach(add);
  }
}

if (supplement) strings.clear();
Object.values(DIAGNOSTIC_NARRATION).forEach(row => add(row[locale]));
const output = path.resolve('public', 'narration', language);
await mkdir(output, { recursive: true });
type Index = Record<string, [number, number, number]>;
const indexPath = path.join(output, 'index.json');
const index: Index = append ? JSON.parse(await readFile(indexPath, 'utf8')) as Index : {};
const sampleRate = 22050;
let chapter = append ? Math.max(...Object.values(index).map(clip => clip[0])) + 1 : 0;
let offset = 0;
let samples: Buffer[] = [];
function flush() {
  if (!offset) return;
  const result = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 's16le', '-ar', String(sampleRate), '-ac', '1', '-i', '-', '-b:a', '16k', path.join(output, `${chapter}.mp3`)], {
    input: Buffer.concat(samples),
    windowsHide: true,
  });
  if (result.status !== 0) throw new Error(result.stderr?.toString() || result.error?.message || 'FFmpeg failed.');
  chapter++;
  offset = 0;
  samples = [];
}
const instantiateWasm = (imports: WebAssembly.Imports, ready: (instance: WebAssembly.Instance, module: WebAssembly.Module) => void) => {
  const instance = new WebAssembly.Instance(wasm, imports);
  ready(instance, wasm);
  return instance.exports;
};
console.log(`${language} : ${strings.size} phrases à produire`);
for (const [key, phrase] of strings) {
  if (Object.hasOwn(index, key)) continue;
  const voice = await engine({
    instantiateWasm,
    arguments: ['-v', language === 'en' ? 'en-us' : language, '-s', '150', '-w', '/voice.wav', phrase],
    print: () => {},
    printErr: () => {},
  });
  const wave = Buffer.from(voice.FS.readFile('/voice.wav'));
  const start = wave.indexOf('data', 12);
  if (start < 0 || wave.readUInt32LE(24) !== sampleRate) throw new Error('Unexpected WAV format.');
  const pcm = wave.subarray(start + 8, start + 8 + wave.readUInt32LE(start + 4));
  const duration = pcm.length / 2 / sampleRate;
  if (offset + duration > 65) flush();
  index[key] = [chapter, Math.round(offset * 1000), Math.round(duration * 1000)];
  samples.push(pcm);
  offset += duration;
}
flush();
await writeFile(indexPath, JSON.stringify(index));
console.log(`${language} : ${chapter} fichiers audio`);
