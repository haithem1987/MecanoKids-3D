import { UI_TRANSLATIONS, UIStrings } from '../i18n/translations';
import { LanguageCode, VehicleCategory } from '../types/game';

type CategoryLabelKey = keyof Pick<UIStrings, 'filterCars' | 'filterBoats' | 'filterPlanes' | 'filterConstruction' | 'filterSpace' | 'filterAerospace' | 'filterElectronics' | 'filterChemistry' | 'filterPhysics' | 'filterNature' | 'filterHistory' | 'filterMaths'>;
export const CATEGORY_META: Record<VehicleCategory, { labelKey: CategoryLabelKey; emoji: string; color: string; gradient: string }> = {
  [VehicleCategory.CAR]: { labelKey: 'filterCars', emoji: '🚗', color: '#f59e0b', gradient: 'from-sky-500 to-blue-600' },
  [VehicleCategory.BOAT]: { labelKey: 'filterBoats', emoji: '⛵', color: '#0ea5e9', gradient: 'from-teal-500 to-cyan-600' },
  [VehicleCategory.PLANE]: { labelKey: 'filterPlanes', emoji: '✈️', color: '#8b5cf6', gradient: 'from-indigo-500 to-violet-600' },
  [VehicleCategory.CONSTRUCTION]: { labelKey: 'filterConstruction', emoji: '🏗️', color: '#f97316', gradient: 'from-amber-500 to-orange-600' },
  [VehicleCategory.SPACE]: { labelKey: 'filterSpace', emoji: '🪐', color: '#10b981', gradient: 'from-rose-500 to-red-600' },
  [VehicleCategory.AEROSPACE]: { labelKey: 'filterAerospace', emoji: '🚀', color: '#6366f1', gradient: 'from-indigo-500 to-blue-600' },
  [VehicleCategory.ELECTRONICS]: { labelKey: 'filterElectronics', emoji: '💡', color: '#eab308', gradient: 'from-yellow-500 to-amber-600' },
  [VehicleCategory.CHEMISTRY]: { labelKey: 'filterChemistry', emoji: '⚗️', color: '#a855f7', gradient: 'from-purple-500 to-violet-600' },
  [VehicleCategory.PHYSICS]: { labelKey: 'filterPhysics', emoji: '🧲', color: '#ec4899', gradient: 'from-pink-500 to-rose-600' },
  [VehicleCategory.HISTORY]: { labelKey: 'filterHistory', emoji: '🏰', color: '#a16207', gradient: 'from-amber-600 to-stone-600' },
  [VehicleCategory.MATHS]: { labelKey: 'filterMaths', emoji: '🔢', color: '#0891b2', gradient: 'from-cyan-500 to-blue-600' },
  [VehicleCategory.NATURE]: { labelKey: 'filterNature', emoji: '🌱', color: '#16a34a', gradient: 'from-green-500 to-teal-600' },
};
export const CATEGORIES = Object.values(VehicleCategory);
export function getCategoryLabel(category: VehicleCategory, language: LanguageCode): string {
  return UI_TRANSLATIONS[language][CATEGORY_META[category].labelKey];
}
