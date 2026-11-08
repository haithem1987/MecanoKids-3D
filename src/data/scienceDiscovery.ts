export const SCIENCE_DISCOVERY_IDS = {
 'elec-motor-fan':'fan', 'elec-alarm-buzzer':'alarm', 'elec-solar-toy':'solar',
 'phys-inclined-plane':'ramp', 'phys-magnet-compass':'compass', 'phys-pendulum':'pendulum',
 'chem-salt-crystal':'salt', 'chem-beaker-setup':'beaker', 'elec-radio-receiver':'radio', 'chem-balance-scale':'balance', 'phys-prism-light':'prism',
} as const;
export type ScienceDiscoveryKind = typeof SCIENCE_DISCOVERY_IDS[keyof typeof SCIENCE_DISCOVERY_IDS];
export function getScienceDiscoveryKind(id:string):ScienceDiscoveryKind|undefined {return SCIENCE_DISCOVERY_IDS[id as keyof typeof SCIENCE_DISCOVERY_IDS];}
export const SCIENCE_DISCOVERY_MODELS = {
 radio:{start:[0],controls:[{id:'frequency',label:'frequency',options:['below','tuned','above']}],solution:[1]},
 balance:{start:[0],controls:[{id:'mass',label:'mass',options:['lighter','equal','heavier']}],solution:[1]},
 prism:{start:[0],controls:[{id:'light',label:'light',options:['dark','white','red']}],solution:[1]},
 fan:{start:[0],controls:[{id:'power',label:'power',options:['off','low','high']}],solution:[2]},
 alarm:{start:[0,0],controls:[{id:'switch',label:'switch',options:['off','on']},{id:'shadow',label:'sensor',options:['uncovered','covered']}],solution:[1,1]},
 solar:{start:[0],controls:[{id:'sun',label:'sun',options:['shade','oblique','bright']}],solution:[2]},
 ramp:{start:[0],controls:[{id:'slope',label:'slope',options:['gentle','medium','steep']}],solution:[2]},
 compass:{start:[0],controls:[{id:'magnet',label:'magnet',options:['west','east','north']}],solution:[1]},
 pendulum:{start:[0,1],controls:[{id:'length',label:'length',options:['short','long']},{id:'amplitude',label:'amplitude',options:['small','large']}],solution:[1,0]},
 salt:{start:[0],controls:[{id:'water',label:'water',options:['solution','crystal']}],solution:[1]},
 beaker:{start:[1,0],controls:[{id:'material',label:'material',options:['salt','sand']},{id:'stir',label:'stir',options:['still','mixed']}],solution:[0,1]},
} as const;
export function validScienceSettings(kind:ScienceDiscoveryKind,settings:readonly number[]):boolean {
 const controls=SCIENCE_DISCOVERY_MODELS[kind].controls;
 return settings.length===controls.length&&controls.every((control,index)=>Number.isInteger(settings[index])&&settings[index]>=0&&settings[index]<control.options.length);
}
export function scienceDiscoverySuccess(kind:ScienceDiscoveryKind,settings:readonly number[]):boolean {
 return validScienceSettings(kind,settings)&&SCIENCE_DISCOVERY_MODELS[kind].solution.every((value,index)=>settings[index]===value);
}
export function scienceDiscoveryOutcome(kind:ScienceDiscoveryKind,settings:readonly number[]):string {
 if(!validScienceSettings(kind,settings))return 'ready';
 if(kind==='alarm')return settings[0]&&settings[1]?'alarmOn':'alarmOff';
 if(kind==='beaker')return settings[0]===1?'sandRemains':settings[1]?'saltDissolved':'saltWaiting';
 if(kind==='pendulum')return settings[0]?'pendulumLong':'pendulumShort';
 return `${kind}${settings[0]}`;
}
/** Seconds for one complete swing, using a metre-scale classroom pendulum approximation. */
export function discoveryPendulumPeriod(length:number):number {return 2*Math.PI*Math.sqrt(length/9.81);}
export function scienceDiscoveryPose(kind:ScienceDiscoveryKind,settings:readonly number[],time:number,reducedMotion=false){
 const p=Math.min(1,time/2.4),length=settings[0]?1.15:.65;
 return {
  fanAngle:reducedMotion?(settings[0]?Math.PI/4:0):time*(settings[0]===2?14:settings[0]===1?5:0),
  rampProgress:reducedMotion?1:Math.min(1,time/[3,2,1.2][settings[0]??0]),
  magnetAngle:[Math.PI,0,-Math.PI/2][settings[0]??0],
  pendulumLength:length,
  pendulumAngle:(settings[1]?.55:.22)*(reducedMotion?.65:Math.sin(time*2*Math.PI/discoveryPendulumPeriod(length))),
  latticeProgress:kind==='salt'?(settings[0]?p:0):0,
  dissolved:kind==='beaker'&&settings[0]===0&&settings[1]===1?(reducedMotion?1:p):0,
 };
}
