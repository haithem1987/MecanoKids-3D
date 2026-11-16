import {describe,it,expect} from 'vitest';
import {canOpenWorkshop,isWorkshopUnlocked} from './workshopAccess';
import {VEHICLE_BLUEPRINTS} from '../data/blueprints';
import {createDefaultProgress} from './storage';
describe('accès aux aventures',()=>{
 it('ne contourne pas l’âge ou le retrait des prototypes avec des étoiles, la licence ou l’admin normal',()=>{
  const progress=createDefaultProgress('fr',true);progress.ageProfile='11-12';progress.freeWorkshopUnlocked=true;progress.licenseState={tier:'family'};
  for(const id of ['math-addition','math-fractions','math-area','math-symmetry','math-ratio']){
   const bp=VEHICLE_BLUEPRINTS.find(bp=>bp.id===id)!;progress.currentBlueprintId=id;progress.completedStages[id]={completed:true,stars:3,bestMistakes:0};
   expect(canOpenWorkshop(bp,progress,VEHICLE_BLUEPRINTS)).toBe(false);expect(canOpenWorkshop(bp,progress,VEHICLE_BLUEPRINTS,true)).toBe(false);
  }
  expect(canOpenWorkshop(VEHICLE_BLUEPRINTS.find(bp=>bp.id==='math-groups')!,progress,VEHICLE_BLUEPRINTS)).toBe(true);
 });
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
