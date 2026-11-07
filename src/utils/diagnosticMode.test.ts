import {describe,it,expect} from 'vitest';
import {VEHICLE_BLUEPRINTS} from '../data/blueprints';
import {createDiagnosticMission} from './diagnosticMode';

describe('réparer les grands montages',()=>{
  it('propose davantage de pièces à inspecter sur un montage expert',()=>{
    const blueprint=VEHICLE_BLUEPRINTS.find(item=>item.id==='expansion-castle')??VEHICLE_BLUEPRINTS.find(item=>item.parts.length>40)!;
    const plan=createDiagnosticMission(blueprint,2);
    expect(plan.targetInterventionsCount).toBeGreaterThanOrEqual(8);
    expect(plan.initialPlacedPartIds).toContain(blueprint.parts[0].id);
    expect(plan.initialFaultyPartIds.length).toBeGreaterThan(0);
  });
  it('conserve les dépendances et une réparation soluble pour chaque atelier',()=>{
    for(const blueprint of VEHICLE_BLUEPRINTS){
      const plan=createDiagnosticMission(blueprint,3),placed=new Set(plan.initialPlacedPartIds);
      for(const part of blueprint.parts.filter(item=>placed.has(item.id)))expect(part.dependsOn.every(id=>placed.has(id))).toBe(true);
      const pending=blueprint.parts.filter(item=>!placed.has(item.id));
      while(pending.length){
        const index=pending.findIndex(part=>part.dependsOn.every(id=>placed.has(id)));
        expect(index,blueprint.id).toBeGreaterThanOrEqual(0);
        if(index<0)break;
        placed.add(pending.splice(index,1)[0].id);
      }
      expect(placed.size).toBe(blueprint.parts.length);
      for(const id of plan.initialFaultyPartIds)expect(plan.initialPlacedPartIds).not.toContain(id);
    }
  });
});
