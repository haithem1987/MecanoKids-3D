import {describe,it,expect} from 'vitest';
import {getBeaconOutcome} from './beaconPower';
describe('alimentation indépendante du phare solaire',()=>{
 it('une batterie pleine ne peut pas alimenter un circuit resté sur les panneaux dans le noir',()=>{
  expect(getBeaconOutcome({source:'solar',daylight:false,charged:true})).toBe('solarOff');
 });
 it('des panneaux éclairés fonctionnent même si la batterie est vide',()=>{
  expect(getBeaconOutcome({source:'solar',daylight:true,charged:false})).toBe('solarOn');
 });
 it('la batterie chargée fonctionne de jour comme de nuit',()=>{
  for(const daylight of [false,true])expect(getBeaconOutcome({source:'battery',daylight,charged:true})).toBe('batteryOn');
 });
 it('le soleil ne recharge pas instantanément la batterie vide du modèle simplifié',()=>{
  expect(getBeaconOutcome({source:'battery',daylight:true,charged:false})).toBe('batteryOff');
 });
});
