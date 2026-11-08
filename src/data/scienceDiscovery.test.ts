import {describe,it,expect} from 'vitest';
import {VEHICLE_BLUEPRINTS} from './blueprints';
import {SCIENCE_DISCOVERY_IDS,SCIENCE_DISCOVERY_MODELS,scienceDiscoveryOutcome,scienceDiscoverySuccess,validScienceSettings,scienceDiscoveryPose,discoveryPendulumPeriod} from './scienceDiscovery';
import {SCIENCE_DISCOVERY_TEXT} from '../i18n/translations';
describe('onze essais scientifiques sur les montages originaux',()=>{
 it('associe onze ateliers réels à des objectifs et paramètres complets dans trois langues',()=>{
  const text=SCIENCE_DISCOVERY_TEXT as Record<string,readonly string[]>;expect(Object.keys(SCIENCE_DISCOVERY_IDS)).toHaveLength(11);
  for(const [id,kind]of Object.entries(SCIENCE_DISCOVERY_IDS)){
   expect(VEHICLE_BLUEPRINTS.some(bp=>bp.id===id)).toBe(true);
   const model=SCIENCE_DISCOVERY_MODELS[kind];expect(validScienceSettings(kind,model.start)).toBe(true);expect(scienceDiscoverySuccess(kind,model.solution)).toBe(true);expect(scienceDiscoverySuccess(kind,model.start)).toBe(false);
   for(const key of [`${kind}Title`,`${kind}Goal`,scienceDiscoveryOutcome(kind,model.start),scienceDiscoveryOutcome(kind,model.solution),...model.controls.flatMap(control=>[control.label,...control.options])]){expect(text[key],`${kind}/${key}`).toHaveLength(3);expect(text[key].every(value=>value.length>0)).toBe(true);}
  }
 });
 it('rejette les paramètres hors plage et les succès artificiels',()=>{
  for(const kind of Object.values(SCIENCE_DISCOVERY_IDS)){expect(validScienceSettings(kind,[-1])).toBe(false);expect(scienceDiscoverySuccess(kind,[999])).toBe(false);expect(scienceDiscoveryOutcome(kind,[999])).toBe('ready');}
 });
 it('ralentit le pendule lorsque sa longueur augmente',()=>{
  expect(discoveryPendulumPeriod(1.15)).toBeGreaterThan(discoveryPendulumPeriod(.65));
  const short=scienceDiscoveryPose('pendulum',[0,0],0,true),long=scienceDiscoveryPose('pendulum',[1,0],0,true);expect(long.pendulumLength).toBeGreaterThan(short.pendulumLength);
 });
 it('fait descendre le bloc plus vite quand la pente augmente, et respecte mouvement réduit',()=>{
  expect(scienceDiscoveryPose('ramp',[2],1).rampProgress).toBeGreaterThan(scienceDiscoveryPose('ramp',[0],1).rampProgress);
  expect(scienceDiscoveryPose('ramp',[0],0,true).rampProgress).toBe(1);
  expect(scienceDiscoveryPose('fan',[2],1,true).fanAngle).toBe(scienceDiscoveryPose('fan',[2],3,true).fanAngle);
 });
 it('dissout le sel mélangé mais conserve le sable visible',()=>{
  expect(scienceDiscoveryPose('beaker',[0,1],3).dissolved).toBe(1);expect(scienceDiscoveryPose('beaker',[1,1],3).dissolved).toBe(0);expect(scienceDiscoveryPose('beaker',[0,0],3).dissolved).toBe(0);
 });
});
