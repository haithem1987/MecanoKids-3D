import type {AgeProfile} from '../types/game';

/** Release policy, separate from licences, rewards and saved progress. */
export function isMathWorkshopAvailable(id:string,age:AgeProfile|undefined,prototypes=false):boolean{
 if(!id.startsWith('math-'))return true;
 if(prototypes)return true;
 if(id==='math-addition')return age==='5-7';
 if(id==='math-groups')return age==='8-10'||age==='11-12';
 return false;
}
