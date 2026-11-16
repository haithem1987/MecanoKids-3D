import {MATH_TEXT} from '../i18n/translations';
import {getMathActivityKind} from '../data/mathActivities';
import type {LanguageCode} from '../types/game';
import {useSpeech} from '../utils/speech';
import {additionBridgeAddedCount} from '../data/additionBridge';
export function MathWorkshopBrief({blueprintId,language,placedPartIds=[]}:{blueprintId:string;language:LanguageCode;placedPartIds?:readonly string[]}){
 const kind=getMathActivityKind(blueprintId),locale=language==='fr'?0:language==='en'?1:2,{toggle,isSupported}=useSpeech();if(!kind)return null;
 const added=additionBridgeAddedCount(placedPartIds),goal=MATH_TEXT[`${kind}Build`][locale];
 if(kind==='addition')return <section data-math-build-brief data-addition-added={added} className="space-y-2 rounded-xl border border-sky-200 bg-white p-3 text-sky-950 shadow"><h2 className="font-bold">{MATH_TEXT.additionTitle[locale]}</h2><p className="text-sm">{goal}</p><p className="font-bold">{MATH_TEXT.bridgeAlready[locale]} : 2 · {MATH_TEXT.bridgeAdded[locale]} : {added}</p><p className="text-xl font-bold" data-addition-equation>2 + {added} = {2+added}</p><p className="text-sm">{MATH_TEXT.bridgeGoal[locale]} : 2 + ? = 5</p>{isSupported&&<button type="button" className="min-h-16 rounded-xl border border-sky-200 px-3 font-semibold" onClick={()=>toggle('math-construction-brief',goal,language)}>{MATH_TEXT.listenGoal[locale]}</button>}</section>;
 return <section data-math-build-brief className="space-y-2 rounded-xl border border-sky-200 bg-white p-3 text-sky-950 shadow"><h2 className="font-bold">{MATH_TEXT[`${kind}Title`][locale]}</h2><p className="text-sm">{goal}</p><p className="text-sm font-semibold">{MATH_TEXT.build[locale]}</p>{isSupported&&<button type="button" className="min-h-16 min-w-16 rounded-xl border border-sky-200 bg-sky-50 px-3 font-semibold" onClick={()=>toggle('math-construction-brief',goal+' '+MATH_TEXT.build[locale],language)}>{MATH_TEXT.listenGoal[locale]}</button>}</section>;
}
