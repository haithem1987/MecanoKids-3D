import {DifficultyTier,VehicleCategory,type PlayerProgress,type VehicleBlueprint} from '../types/game';
import {canPlayStage,freeTrialExhausted,isUnlocked} from './entitlements';
export const TIER_UNLOCK_THRESHOLDS:Record<DifficultyTier,number>={[DifficultyTier.DISCOVERY]:0,[DifficultyTier.WORKSHOP]:3,[DifficultyTier.ENGINEER]:10,[DifficultyTier.EXPERT]:25,[DifficultyTier.MASTER]:45};
export function isWorkshopUnlocked(bp:VehicleBlueprint,progress:PlayerProgress,blueprints:readonly VehicleBlueprint[],currentId=progress.currentBlueprintId){
 if(bp.virtualLab||bp.category===VehicleCategory.MATHS||bp.masterExpansion&&progress.ageProfile==='11-12'||progress.freeWorkshopUnlocked||bp.id===currentId||progress.completedStages[bp.id]?.completed||(progress.inProgressStages[bp.id]?.placedPartIds.length??0)>0)return true;
 const count=Object.values(progress.completedStages).filter(record=>record.completed).length;
 return count>=TIER_UNLOCK_THRESHOLDS[bp.tier]||Boolean(blueprints[bp.stageNumber-2]&&progress.completedStages[blueprints[bp.stageNumber-2].id]?.completed);
}
export function canOpenWorkshop(bp:VehicleBlueprint,progress:PlayerProgress,blueprints:readonly VehicleBlueprint[],admin=false){
 if(admin||bp.virtualLab||bp.category===VehicleCategory.MATHS)return true;
 return isWorkshopUnlocked(bp,progress,blueprints)&&canPlayStage(progress.licenseState,bp.stageNumber,bp.masterExpansion)&&(!freeTrialExhausted(Object.values(progress.completedStages).filter(record=>record.completed).length)||isUnlocked(progress.licenseState));
}
