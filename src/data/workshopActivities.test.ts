import {describe,it,expect} from 'vitest';
import {VEHICLE_BLUEPRINTS} from './blueprints';
import {getWorkshopActivity,supportsWorkshopPlay,usesWorkshopMissionPortal} from './workshopActivities';
describe('activité après chaque assemblage',()=>{
 it('donne une suite jouable à tout le catalogue',()=>{expect(VEHICLE_BLUEPRINTS.filter(bp=>!supportsWorkshopPlay(bp)).map(bp=>bp.id)).toEqual([]);});
 it('ne crée pas un second contrôleur pour les défis et laboratoires',()=>{for(const bp of VEHICLE_BLUEPRINTS){if(['virtual-lab','science-challenge'].includes(getWorkshopActivity(bp)??''))expect(usesWorkshopMissionPortal(bp)).toBe(false);}});
});
