export type LanguageCode = 'fr' | 'en' | 'ar';

export enum VisualStyleMode {
  WOOD = 'wood',
  BLOCKS = 'blocks',
  REALISTIC = 'realistic',
  COMICS = 'comics',
}

export enum VehicleCategory {
  CAR = 'voiture',
  BOAT = 'bateau',
  PLANE = 'avion',
  CONSTRUCTION = 'chantier',
  SPACE = 'espace',
  AEROSPACE = 'aerospatiale',
  ELECTRONICS = 'electronique',
  CHEMISTRY = 'chimie',
  PHYSICS = 'physique',
  NATURE = 'vivant-et-terre',
  HISTORY = 'histoire',
  MATHS = 'mathematiques',
}

export enum DifficultyTier {
  DISCOVERY = 1,
  WORKSHOP = 2,
  ENGINEER = 3,
  EXPERT = 4,
  MASTER = 5,
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
  // Extended 3D shapes for Construction, Trains, Submarines, Jets, Drones & Space/Robotics
  CATERPILLAR_TRACK = 'caterpillar_track',
  EXCAVATOR_ARM = 'excavator_arm',
  BULLDOZER_BLADE = 'bulldozer_blade',
  MIXER_DRUM = 'mixer_drum',
  ROLLER_DRUM = 'roller_drum',
  FORKLIFT_MAST = 'forklift_mast',
  HARVESTER_HEADER = 'harvester_header',
  TRAIN_BOILER = 'train_boiler',
  SUB_HULL = 'sub_hull',
  CONNING_TOWER = 'conning_tower',
  CATAMARAN_PONTOONS = 'catamaran_pontoons',
  JET_TURBINE_PAIR = 'jet_turbine_pair',
  DELTA_WING = 'delta_wing',
  ROCKET_STAGE = 'rocket_stage',
  ROCKET_NOZZLE_CLUSTER = 'rocket_nozzle_cluster',
  ROCKET_FAIRING = 'rocket_fairing',
  SOLAR_PANEL_ARRAY = 'solar_panel_array',
  PARABOLIC_DISH = 'parabolic_dish',
  ROVER_MAST_CAM = 'rover_mast_cam',
  DRONE_QUAD_ARMS = 'drone_quad_arms',
  // Electronics universe
  BREADBOARD = 'breadboard',
  RESISTOR = 'resistor',
  LED_COMPONENT = 'led_component',
  BATTERY_CELL = 'battery_cell',
  CAPACITOR = 'capacitor',
  WIRE_JUMPER = 'wire_jumper',
  MICRO_MOTOR = 'micro_motor',
  SOLAR_PANEL = 'solar_panel',
  FAN_BLADES = 'fan_blades',
  LIGHT_SENSOR = 'light_sensor',
  BUZZER = 'buzzer',
  ANTENNA = 'antenna',
  DEMODULATOR = 'demodulator',
  SPEAKER = 'speaker',
  // Chemistry universe
  ATOM_HYDROGEN = 'atom_hydrogen',
  ATOM_OXYGEN = 'atom_oxygen',
  ATOM_CARBON = 'atom_carbon',
  ATOM_CHLORINE = 'atom_chlorine',
  ATOM_SODIUM = 'atom_sodium',
  BOND_SINGLE = 'bond_single',
  BOND_DOUBLE = 'bond_double',
  LAB_FLASK = 'lab_flask',
  LAB_STAND = 'lab_stand',
  LAB_BEAKER = 'lab_beaker',
  APPARATUS_BASE = 'apparatus_base',
  ARCH_STONE = 'arch_stone',
  ARCH_SPANDREL = 'arch_spandrel',
  LAB_CYLINDER = 'lab_cylinder',
  LAB_CONE = 'lab_cone',
  LAB_HANGING_BALL = 'lab_hanging_ball',
  LAB_FLOWER = 'lab_flower',
  LAB_HOUSE = 'lab_house',
  SUPPORT_FRAME = 'support_frame',
  BALANCE_PAN = 'balance_pan',
  LIGHT_SOURCE = 'light_source',
  LIGHT_BEAM = 'light_beam',
  // Physics universe
  PENDULUM_ROD = 'pendulum_rod',
  PENDULUM_BOB = 'pendulum_bob',
  FULCRUM = 'fulcrum',
  LEVER_ARM = 'lever_arm',
  RAMP_SURFACE = 'ramp_surface',
  MAGNET_BAR = 'magnet_bar',
  COMPASS_NEEDLE = 'compass_needle',
  OPTICAL_PRISM = 'optical_prism',
}

export enum PartAnimationKind {
  NONE = 'none',
  SPIN_X = 'spin_x',
  SPIN_Y = 'spin_y',
  SPIN_Z = 'spin_z',
  SWAY_Y = 'sway_y',
  PENDULUM = 'pendulum',
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
  nameEn?: string;
  roleHintEn?: string;
  nameAr?: string;
  roleHintAr?: string;
  isRarePart?: boolean;
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
  animationSpeed?: number;
  motionPivot?: [number, number, number];
  /** Physical/scientific connections are independent from assembly prerequisites. */
  bond?: { atoms: [string, string]; order: 1 | 2 };
  electrical?: [string, string];
  structuralJoints?: [string, string];
  archStone?: { innerRadius: number; outerRadius: number; startAngle: number; endAngle: number };
  archSpandrel?: { radius: number; halfWidth: number; side: -1 | 1 };
  temporarySupport?: true;
  /** Steel wheels with flanges, connected by a railway axle rather than road tyres. */
  railWheelset?: true;
  railNose?: true;
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
  nameEn?: string;
  subtitleEn?: string;
  nameAr?: string;
  subtitleAr?: string;
  category: VehicleCategory;
  tier: DifficultyTier;
  tierLabel: string;
  tierLabelEn?: string;
  tierLabelAr?: string;
  ageNote: string;
  ageNoteEn?: string;
  ageNoteAr?: string;
  discovery: DiscoveryFacts;
  discoveryEn?: DiscoveryFacts;
  discoveryAr?: DiscoveryFacts;
  discoveryMode?: 'observation';
  virtualLab?: import('../data/virtualLabs').VirtualLabId;
  masterExpansion?: true;
  /** A fixed building or structure has no vehicle test drive. */
  staticStructure?: true;
  interactiveTrial?: 'watermill' | 'beacon' | 'aqueduct';
  parts: PartSpec[];
  isDailyBonus?: boolean;
  dailyDateKey?: string;
  rarePartId?: string;
  rareCollectibleId?: string;
  experiment?: {
    kind: 'molecule' | 'ionic' | 'apparatus' | 'circuit';
    requiredShapes: Partial<Record<PartShapeKind, number>>;
    /** Closed component loop, independent from the order of assembly. */
    circuit?: string[];
  };
}

export interface StageCompletionRecord {
  completed: boolean;
  stars: number;
  bestMistakes: number;
  bestTimeMs?: number;
  completedAt?: number;
}

export interface DailyCompletionEntry {
  stars: number;
  completedAt: number;
  rareCollectibleId: string;
  templateId: string;
  bestTimeMs?: number;
}

export interface SpeedrunRecord {
  id: string;
  blueprintId: string;
  stageNumber: number;
  category: VehicleCategory;
  tier: DifficultyTier;
  partsCount: number;
  timeMs: number;
  mistakesCount: number;
  stars: number;
  achievedAt: number;
  isDailyBonus?: boolean;
  vehicleNameFr?: string;
  vehicleNameEn?: string;
  vehicleNameAr?: string;
}

export interface DailyChallengeState {
  completedByDate: Record<string, DailyCompletionEntry>;
  collectedRareIds: string[];
  currentStreak: number;
  bestStreak: number;
  lastCompletedDate: string | null;
}

export enum BadgeIconKind {
  WRENCH = 'wrench',
  TARGET = 'target',
  COMPASS = 'compass',
  CAR = 'car',
  ANCHOR = 'anchor',
  PLANE = 'plane',
  HAMMER = 'hammer',
  ROCKET = 'rocket',
  CALENDAR = 'calendar',
  FLAME = 'flame',
  GEM = 'gem',
  TIMER = 'timer',
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
  elapsedMs?: number;
  updatedAt: number;
}

export type LiveryPresetId =
  | 'original'
  | 'fire_red'
  | 'racing_blue'
  | 'safety_yellow'
  | 'emerald_green'
  | 'titanium_silver'
  | 'solar_orange'
  | 'royal_indigo'
  | 'flame_gold';

export type WorkbenchEnvironmentMode = 'auto_thematic' | 'studio';

export type WorkshopGroundPreset =
  | 'asphalt'
  | 'grass'
  | 'sand'
  | 'snow'
  | 'circuit'
  | 'light_wood'
  | 'moon'
  | 'water';

export interface WorkshopThemeConfig {
  groundPreset: WorkshopGroundPreset;
}

export interface EngineeringPatentRecord {
  score: number;
  total: number;
  passedAt: number;
}

export type DailyStreakMilestoneId = 'streak_3' | 'streak_7' | 'streak_14' | 'streak_30';

export interface DailyStreakState {
  currentStreak: number;
  bestStreak: number;
  lastActiveDate: string | null;
  activeDates: string[];
  unlockedMilestones: Record<string, number>;
}

// Imported here to keep PlayerProgress self-contained; source of truth is entitlements.ts
import type { LicenseState } from '../utils/entitlements';
export type { LicenseState };

export type AgeProfile = '5-7' | '8-10' | '11-12';

export interface PlayerProgress {
  licenseState: LicenseState;
  currentBlueprintId: string;
  lastStandardBlueprintId: string;
  inProgressStages: Record<string, StageInProgressRecord>;
  completedStages: Record<string, StageCompletionRecord>;
  dailyChallenge: DailyChallengeState;
  dailyStreak: DailyStreakState;
  speedrunRecords: SpeedrunRecord[];
  timerModeEnabled: boolean;
  unlockedBadges: Record<string, number>;
  customLiveries: Record<string, LiveryPresetId>;
  engineeringPatents: Record<string, EngineeringPatentRecord>;
  repairedStages: Record<string, number>;
  masterNoSilhouetteStages: Record<string, number>;
  noSilhouetteMode: boolean;
  environmentMode: WorkbenchEnvironmentMode;
  language: LanguageCode;
  preferredStyle: VisualStyleMode;
  cameraPreset: CameraPreset;
  freeWorkshopUnlocked: boolean;
  ageProfile?: AgeProfile;
  muted: boolean;
  volumeSfx: number;
  volumeVoice: number;
  classroomSilent: boolean;
  tbiMode: boolean;
  voiceAutoRead: boolean;
  tutorialSeen: boolean;
  diagnosticTutorialSeen: boolean;
  partsTrayPosition: 'bottom' | 'left' | 'right';
  partsTrayAutoHide: boolean;
  workshopTheme?: WorkshopThemeConfig;
  classCode?: string;
  licenseKey?: string;
  licenseType?: 'classe' | 'ecole' | 'reseau';
  licenseExpiry?: string;
  licenseSeats?: number;
  licenseActive: boolean;
  lastSavedAt: number;
}

export type ProfileAvatarColor = 'sky' | 'amber' | 'emerald' | 'indigo' | 'rose';
export type ProfileAvatarIcon = 'wrench' | 'car' | 'rocket' | 'anchor' | 'plane';

export interface PlayerProfile {
  id: string;
  name: string;
  avatarColor: ProfileAvatarColor;
  avatarIcon: ProfileAvatarIcon;
  createdAt: number;
  updatedAt: number;
  progress: PlayerProgress;
}

export type DailyLimitMinutesOption = 15 | 20 | 30 | 45;

export interface ParentalSettings {
  dailyLimitMinutes: DailyLimitMinutesOption | null;
  consumedTodaySeconds: number;
  consumedDateKey: string;
  extraGrantedMinutesToday: number;
}

export interface MultiProfileStore {
  activeProfileId: string;
  profiles: PlayerProfile[];
  parentalSettings: ParentalSettings;
}

