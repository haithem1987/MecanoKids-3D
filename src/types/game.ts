export type LanguageCode = 'fr' | 'ar';

export enum VisualStyleMode {
  WOOD = 'wood',
  BLOCKS = 'blocks',
  REALISTIC = 'realistic',
}

export enum VehicleCategory {
  CAR = 'voiture',
  BOAT = 'bateau',
  PLANE = 'avion',
}

export enum DifficultyTier {
  DISCOVERY = 1,
  WORKSHOP = 2,
  ENGINEER = 3,
}

export enum PartShapeKind {
  CAR_CHASSIS = 'car_chassis',
  WHEEL_AXLE = 'wheel_axle',
  CAR_CABIN = 'car_cabin',
  ENGINE_BLOCK = 'engine_block',
  FIRE_TANK = 'fire_tank',
  FIRE_LADDER = 'fire_ladder',
  F1_NOSE = 'f1_nose',
  F1_FRONT_WING = 'f1_front_wing',
  F1_REAR_WING = 'f1_rear_wing',
  F1_SIDEPODS = 'f1_sidepods',
  F1_HALO = 'f1_halo',
  BOAT_HULL = 'boat_hull',
  BOAT_KEEL = 'boat_keel',
  BOAT_DECK = 'boat_deck',
  BOAT_MAST = 'boat_mast',
  BOAT_SAIL = 'boat_sail',
  BOAT_CABIN = 'boat_cabin',
  BOAT_CHIMNEY = 'boat_chimney',
  BOAT_PROPULSION = 'boat_propulsion',
  BOAT_FENDERS = 'boat_fenders',
  BOAT_RADAR = 'boat_radar',
  BOAT_CRANE = 'boat_crane',
  BOAT_AFRAME = 'boat_aframe',
  BOAT_HELI_PAD = 'boat_heli_pad',
  BOAT_ROV = 'boat_rov',
  LIGHT_BAR = 'light_bar',
  PLANE_FUSELAGE = 'plane_fuselage',
  PLANE_WING = 'plane_wing',
  PLANE_TAIL = 'plane_tail',
  PLANE_LANDING_GEAR = 'plane_landing_gear',
  PLANE_PROPELLER = 'plane_propeller',
  BIPLANE_STRUTS = 'biplane_struts',
  RADIAL_ENGINE = 'radial_engine',
  HELI_SKIDS = 'heli_skids',
  HELI_CABIN = 'heli_cabin',
  HELI_TAIL_BOOM = 'heli_tail_boom',
  HELI_TAIL_ROTOR = 'heli_tail_rotor',
  HELI_TURBINE = 'heli_turbine',
  HELI_ROTOR_MAST = 'heli_rotor_mast',
  HELI_MAIN_BLADES = 'heli_main_blades',
  HELI_WINCH = 'heli_winch',
}

export enum PartAnimationKind {
  NONE = 'none',
  SPIN_X = 'spin_x',
  SPIN_Y = 'spin_y',
  SPIN_Z = 'spin_z',
  SWAY_Y = 'sway_y',
}

export enum CameraPreset {
  ISO = 'iso',
  FRONT = 'front',
  SIDE = 'side',
  TOP = 'top',
}

export interface PartSpec {
  id: string;
  name: string;
  roleHint: string;
  shape: PartShapeKind;
  primaryColor: string;
  secondaryColor: string;
  materialKind: 'body' | 'wood_structural' | 'dark_mech' | 'glass_cabin' | 'sail_fabric' | 'bright_trim';
  scale: [number, number, number];
  targetPos: [number, number, number];
  targetRot?: [number, number, number];
  explodeOffset: [number, number, number];
  dependsOn: string[];
  snapRadius: number;
  animation?: PartAnimationKind;
}

export interface DiscoveryFacts {
  howItWorks: string;
  realRecord: string;
  didYouKnow: string;
}

export interface VehicleBlueprint {
  id: string;
  stageNumber: number;
  name: string;
  subtitle: string;
  category: VehicleCategory;
  tier: DifficultyTier;
  tierLabel: string;
  ageNote: string;
  discovery: DiscoveryFacts;
  parts: PartSpec[];
}

export interface StageCompletionRecord {
  completed: boolean;
  stars: number;
  bestMistakes: number;
  completedAt?: number;
}

export enum BadgeIconKind {
  WRENCH = 'wrench',
  TARGET = 'target',
  COMPASS = 'compass',
  CAR = 'car',
  ANCHOR = 'anchor',
  PLANE = 'plane',
  AWARD = 'award',
  STAR = 'star',
  TROPHY = 'trophy',
}

export interface BadgeEvaluation {
  id: string;
  icon: BadgeIconKind;
  accentColor: 'sky' | 'amber' | 'emerald' | 'indigo' | 'rose';
  title: string;
  description: string;
  unlocked: boolean;
  currentValue: number;
  targetValue: number;
  progressLabel: string;
  unlockedAt?: number;
}

export interface StageInProgressRecord {
  placedPartIds: string[];
  mistakesCount: number;
  updatedAt: number;
}

export interface PlayerProgress {
  currentBlueprintId: string;
  inProgressStages: Record<string, StageInProgressRecord>;
  completedStages: Record<string, StageCompletionRecord>;
  unlockedBadges: Record<string, number>;
  language: LanguageCode;
  preferredStyle: VisualStyleMode;
  cameraPreset: CameraPreset;
  freeWorkshopUnlocked: boolean;
  muted: boolean;
  tutorialSeen: boolean;
  lastSavedAt: number;
}
