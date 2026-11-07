import {describe,it,expect} from 'vitest';
import {HERITAGE_BLUEPRINTS} from '../data/heritageBlueprints';
import {getLocalizedBlueprint} from '../i18n/translations';
import {getWorkshopInstruction} from './workshopInstruction';
const model=HERITAGE_BLUEPRINTS.find(b=>b.id==='expansion-castle')!;
describe('consigne vocale disponible sans lecture automatique',()=>{
 it('commence par la fondation puis annonce une pièce qui peut être posée',()=>{
  expect(getWorkshopInstruction(model,[],null)).toContain(model.parts[0].roleHint);
  const next=model.parts.find(p=>p.dependsOn.length===1&&p.dependsOn[0]===model.parts[0].id)!;
  expect(getWorkshopInstruction(model,[model.parts[0].id],null)).toContain(next.roleHint);
 });
 it('lit la pièce choisie et la conclusion après le dernier montage',()=>{
  const selected=model.parts[2];expect(getWorkshopInstruction(model,[],selected.id)).toContain(selected.name);
  expect(getWorkshopInstruction(model,model.parts.map(p=>p.id),null)).toContain(model.discovery.howItWorks);
 });
 it('utilise les noms et les rôles du modèle arabe',()=>{
  const arabic=getLocalizedBlueprint(model,'ar');const phrase=getWorkshopInstruction(arabic,[],null);expect(phrase).toContain(arabic.parts[0].name);expect(phrase).not.toContain(model.parts[0].name);
 });
});
