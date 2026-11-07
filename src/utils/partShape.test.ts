import {describe,it,expect} from 'vitest';
import {HERITAGE_BLUEPRINTS} from '../data/heritageBlueprints';
import {getLocalizedBlueprint} from '../i18n/translations';
import {getPartShapeSvg} from './partShape';
describe('vignettes de pièces indépendantes de la langue',()=>{
 it('garde la même représentation en français, anglais et arabe',()=>{
  for(const bp of HERITAGE_BLUEPRINTS)for(const part of bp.parts){const expected=getPartShapeSvg(part.roleHint,part.primaryColor,part);for(const language of ['en','ar'] as const){const p=getLocalizedBlueprint(bp,language).parts.find(p=>p.id===part.id)!;expect(getPartShapeSvg(p.roleHint,p.primaryColor,p),`${bp.id}/${part.id}/${language}`).toBe(expected);}}
 });
 it('distingue une dalle d’un montant avec leurs proportions',()=>{
  const bp=HERITAGE_BLUEPRINTS.find(b=>b.id==='expansion-castle')!,base=bp.parts[0],tower=bp.parts[1];expect(getPartShapeSvg('',base.primaryColor,base)).not.toBe(getPartShapeSvg('',base.primaryColor,tower));
 });
});
