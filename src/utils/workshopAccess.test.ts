import {describe,it,expect} from 'vitest';
import {canOpenWorkshop,isWorkshopUnlocked} from './workshopAccess';
import {VEHICLE_BLUEPRINTS} from '../data/blueprints';
import {createDefaultProgress} from './storage';
describe('accès aux aventures',()=>{
 it('ne contourne pas les niveaux ni la licence',()=>{
  const progress=createDefaultProgress('fr',true),bp=VEHICLE_BLUEPRINTS.find(bp=>bp.id==='expansion-gantry')!;
  progress.freeWorkshopUnlocked=false;progress.licenseState={tier:'discovery'};progress.ageProfile='8-10';
  expect(isWorkshopUnlocked(bp,progress,VEHICLE_BLUEPRINTS)).toBe(false);
  expect(canOpenWorkshop(bp,progress,VEHICLE_BLUEPRINTS)).toBe(false);
  progress.freeWorkshopUnlocked=true;
  expect(canOpenWorkshop(bp,progress,VEHICLE_BLUEPRINTS)).toBe(false);
  expect(canOpenWorkshop(bp,progress,VEHICLE_BLUEPRINTS,true)).toBe(true);
 });
 it('permet les laboratoires et la reprise des montages autorisés',()=>{
  const progress=createDefaultProgress('fr',true),lab=VEHICLE_BLUEPRINTS.find(bp=>bp.virtualLab)!;
  expect(canOpenWorkshop(lab,progress,VEHICLE_BLUEPRINTS)).toBe(true);
  const bp=VEHICLE_BLUEPRINTS[0];progress.currentBlueprintId=bp.id;
  expect(canOpenWorkshop(bp,progress,VEHICLE_BLUEPRINTS)).toBe(true);
 });
});
