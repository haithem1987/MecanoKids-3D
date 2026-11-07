export const SEA_SURPRISE_MOVES = ['high-five','crab-clap','dance','fish-bubbles','juggle','turtle-spin','dolphin-leap','ray-glide','jelly-bounce','star-wave'] as const;
export type SeaSurpriseMove = typeof SEA_SURPRISE_MOVES[number];

/** Fixed progress milestones vary by build length and never interrupt every piece of a large build. */
export function surpriseMilestones(total:number):number[] {
  if(total<3)return [];
  const candidates=total<=8?[2]:[Math.max(3,Math.round(total*.15)),Math.round(total*.4),Math.round(total*.65),Math.round(total*.85)];
  return [...new Set(candidates)].filter(value=>value>0&&value<total).sort((a,b)=>a-b);
}
export function assemblySurprise(placed:number,total:number,stageNumber:number):SeaSurpriseMove|undefined {
  const index=surpriseMilestones(total).indexOf(placed);
  return index<0?undefined:SEA_SURPRISE_MOVES[((stageNumber*3+index*7)%SEA_SURPRISE_MOVES.length+SEA_SURPRISE_MOVES.length)%SEA_SURPRISE_MOVES.length];
}
export function successSurprise(event:number,stageNumber:number):SeaSurpriseMove {
  return SEA_SURPRISE_MOVES[((stageNumber*3+event*7)%SEA_SURPRISE_MOVES.length+SEA_SURPRISE_MOVES.length)%SEA_SURPRISE_MOVES.length];
}
