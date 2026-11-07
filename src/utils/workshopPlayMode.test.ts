import {describe,it,expect} from 'vitest';
import {currentWorkshopPlayMode,workshopPlayActions} from './workshopPlayMode';

describe('variantes de construction',()=>{
  it('active les aides et quitte la réparation sans perdre le montage normal',()=>{
    expect(workshopPlayActions('guided',{repairing:true,noSilhouette:true,autoRead:false})).toEqual(['quitRepair','toggleSilhouette','toggleAutoRead']);
  });
  it('ne redémarre pas une réparation déjà en cours',()=>{
    expect(workshopPlayActions('repair',{repairing:true,noSilhouette:false,autoRead:true})).toEqual([]);
  });
  it('supprime silhouette et consignes automatiques en expert mais conserve la lecture manuelle',()=>{
    expect(workshopPlayActions('expert',{repairing:false,noSilhouette:false,autoRead:true})).toEqual(['toggleSilhouette','toggleAutoRead']);
  });
  it('reflète les modifications manuelles des réglages',()=>{
    expect(currentWorkshopPlayMode({repairing:false,noSilhouette:true,autoRead:true})).toBeUndefined();
    expect(currentWorkshopPlayMode({repairing:false,noSilhouette:false,autoRead:true})).toBe('guided');
    expect(currentWorkshopPlayMode({repairing:true,noSilhouette:true,autoRead:false})).toBe('repair');
  });
});
