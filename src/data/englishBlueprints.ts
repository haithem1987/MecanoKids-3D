import { DifficultyTier, DiscoveryFacts, VehicleBlueprint } from '../types/game';

const ENGLISH_TIER_META: Record<
  DifficultyTier,
  { tierLabel: string; ageNote: (count: number) => string }
> = {
  [DifficultyTier.DISCOVERY]: {
    tierLabel: 'Tier 1 · Discovery',
    ageNote: (n) => `Ages 6+ · ${n} parts`,
  },
  [DifficultyTier.WORKSHOP]: {
    tierLabel: 'Tier 2 · Workshop',
    ageNote: (n) => `Ages 7–8 · ${n} parts`,
  },
  [DifficultyTier.ENGINEER]: {
    tierLabel: 'Tier 3 · Engineer',
    ageNote: (n) => `Ages 8–9 · ${n} parts`,
  },
  [DifficultyTier.EXPERT]: {
    tierLabel: 'Tier 4 · Expert',
    ageNote: (n) => `Ages 9–10 · ${n} parts`,
  },
  [DifficultyTier.MASTER]: {
    tierLabel: 'Tier 5 · Master Builder',
    ageNote: (n) => `Master Challenge · ${n} parts`,
  },
};

export const ENGLISH_PART_DICTIONARY: Record<string, { name: string; roleHint: string }> = {
  // Handcrafted & City Coupe / Rally
  'Châssis Porteur': {
    name: 'Load-Bearing Chassis',
    roleHint: 'The solid structural base supporting the entire car and its headlights.',
  },
  'Train de Roues Avant': {
    name: 'Front Wheel Axle',
    roleHint: 'Steers the car smoothly to the left and right.',
  },
  'Train de Roues Arrière': {
    name: 'Rear Drive Axle',
    roleHint: 'Transfers the electric motor push directly onto the road.',
  },
  'Habitacle Panoramique': {
    name: 'Panoramic Cabin',
    roleHint: 'Protects passengers while offering a clear 360-degree view.',
  },
  'Châssis Principal': {
    name: 'Main Structural Chassis',
    roleHint: 'Rigid lower frame connecting the axles and bodywork.',
  },
  'Train Avant Directeur': {
    name: 'Front Steering Axle',
    roleHint: 'Guides the vehicle accurately around corners.',
  },
  'Train Arrière Moteur': {
    name: 'Rear Drive Axle',
    roleHint: 'Delivers mechanical torque to the rear wheels.',
  },
  'Habitacle Vitré': {
    name: 'Glazed Safety Cabin',
    roleHint: 'Protective passenger cell for the driver and crew.',
  },
  'Bloc Moteur Avant': {
    name: 'Front Engine Block',
    roleHint: 'Converts energy into mechanical rotation under the hood.',
  },
  'Rampe Lumineuse de Toit': {
    name: 'Roof Light Bar',
    roleHint: 'Makes the vehicle visible from afar in all weather conditions.',
  },
  'Lame Aérodynamique Avant': {
    name: 'Front Aero Splitter',
    roleHint: 'Channels airflow under the bumper to boost road grip.',
  },
  'Aileron Stabilisateur Arrière': {
    name: 'Rear Stabilizer Wing',
    roleHint: 'Presses the rear axle onto the road during acceleration.',
  },
  'Bas de Caisse & Refroidisseurs': {
    name: 'Side Skirts & Coolers',
    roleHint: 'Protect the flanks and duct fresh air toward the brakes.',
  },
  'Coffre Technique Arrière': {
    name: 'Rear Tech Trunk',
    roleHint: 'Rear bay housing the auxiliary battery and onboard tools.',
  },
  'Antenne GPS & Télémétrie': {
    name: 'GPS & Telemetry Antenna',
    roleHint: 'Tracks satellite position and transmits live engine data.',
  },
  'Arceau de Sécurité Renforcé': {
    name: 'Reinforced Roll Cage',
    roleHint: 'Strengthens the roof against impacts on rough terrain.',
  },
  'Panneau Solaire Auxiliaire': {
    name: 'Auxiliary Solar Roof',
    roleHint: 'Powers onboard electronics even when the engine is off.',
  },
  'Treuil de Dépannage Avant': {
    name: 'Front Recovery Winch',
    roleHint: 'Pulls heavy loads or frees the vehicle from deep mud.',
  },
  'Feux Antibrouillard Haute Intensité': {
    name: 'High-Intensity Fog Lights',
    roleHint: 'Ensure maximum visibility in heavy rain or desert dust.',
  },

  // Utility Truck & Fire Truck
  'Châssis Poids-Lourd': {
    name: 'Heavy-Duty Frame',
    roleHint: 'Steel beams engineered to carry tons of water and the ladder.',
  },
  'Bloc Moteur Diesel': {
    name: 'Diesel Engine Block',
    roleHint: 'Provides power to drive fast and run the high-pressure water pump.',
  },
  "Cabine d'Équipage": {
    name: 'Crew Cabin',
    roleHint: 'Mounts above the engine block to carry the firefighting team.',
  },
  'Citerne & Coffres': {
    name: 'Water Tank & Lockers',
    roleHint: 'Stores pressurized water and fire hoses.',
  },
  'Grande Échelle Pivotante': {
    name: 'Turntable Extension Ladder',
    roleHint: 'Attaches atop the tank to reach high building floors.',
  },
  'Châssis Poutre Poids-Lourd': {
    name: 'Heavy-Duty Ladder Frame',
    roleHint: 'Thick steel rails supporting heavy payloads.',
  },
  'Essieu Directeur Avant': {
    name: 'Front Steer Axle',
    roleHint: 'Steers the front of the utility truck.',
  },
  'Essieu Porteur Arrière': {
    name: 'Rear Load Axle',
    roleHint: 'Carries the majority of the rear cargo weight.',
  },
  'Cabine Avancée': {
    name: 'Forward Control Cab',
    roleHint: 'Elevated driver station offering a commanding view of the road.',
  },
  'Module Cargo Principal': {
    name: 'Main Cargo Box',
    roleHint: 'Large rear compartment built to haul goods or specialist gear.',
  },
  'Moteur Turbo-Diesel': {
    name: 'Turbo-Diesel Powertrain',
    roleHint: 'Delivers strong low-rpm torque to climb steep hills.',
  },
  'Essieu Central Tandem': {
    name: 'Center Tandem Axle',
    roleHint: 'Spreads heavy weight across six wheels to protect the road.',
  },
  'Gyrophare de Signalisation': {
    name: 'Warning Beacon Bar',
    roleHint: 'Alerts surrounding traffic during emergency or heavy operations.',
  },
  'Réservoirs & Coffres Latéraux': {
    name: 'Side Tanks & Toolboxes',
    roleHint: 'Store fuel and compressed air for the braking system.',
  },
  'Cheminées Verticales Filtrées': {
    name: 'Filtered Vertical Exhausts',
    roleHint: 'Vent and filter exhaust gases behind the cab.',
  },
  'Déflecteur de Toit Aérodynamique': {
    name: 'Aerodynamic Roof Fairing',
    roleHint: 'Reduces wind drag between the cab and the tall cargo box.',
  },
  'Bras de Manutention Auxiliaire': {
    name: 'Auxiliary Loader Arm',
    roleHint: 'Loads and unloads heavy pallets autonomously.',
  },
  'Pare-Buffles Renforcé': {
    name: 'Reinforced Front Bullbar',
    roleHint: 'Protects the radiator on rugged expedition tracks.',
  },
  'Panneaux Solaires Frigorifiques': {
    name: 'Cargo Solar Array',
    roleHint: 'Powers climate control and scientific instruments inside the box.',
  },
  'Dôme de Suivi Flotte': {
    name: 'Fleet Satcom Dome',
    roleHint: 'Maintains continuous radio contact on long-haul routes.',
  },

  // Rail & Trains
  'Châssis Ferroviaire Long': {
    name: 'Long Rail Frame',
    roleHint: 'Ultra-stiff main beam engineered to ride on steel tracks.',
  },
  'Bogie Ferroviaire Avant': {
    name: 'Front Rail Bogie',
    roleHint: 'Flanged steel wheelset that guides the train along the rails.',
  },
  'Bogie Moteur Arrière': {
    name: 'Rear Traction Bogie',
    roleHint: 'Propels the entire trainset with high rail grip.',
  },
  'Corps & Nez Profilé': {
    name: 'Streamlined Body & Nose',
    roleHint: 'Slices through air at high speed and houses the front headlamp.',
  },
  'Cabine de Conduite': {
    name: 'Driver Control Cab',
    roleHint: 'Command cabin where the engineer monitors track signals.',
  },
  'Bogie Porteur Central': {
    name: 'Center Support Bogie',
    roleHint: 'Supports the middle of the locomotive smoothly through curves.',
  },
  'Convertisseur de Traction': {
    name: 'Traction Power Converter',
    roleHint: 'Feeds steady electrical power to the traction motors.',
  },
  'Pantographe Caténaire': {
    name: 'Overhead Pantograph',
    roleHint: 'Articulated roof arm that collects overhead electric power.',
  },
  'Chasse-Obstacles Frontal': {
    name: 'Front Track Deflector',
    roleHint: 'Angled nose guard keeping obstacles clear of the steel wheels.',
  },
  'Cheminée / Tuyère Supérieure': {
    name: 'Upper Stack / Cooling Vent',
    roleHint: 'Vents steam or hot air from the power cooling units.',
  },
  'Carénages Magnétiques Latéraux': {
    name: 'Side Aero & Magnet Skirts',
    roleHint: 'Reduce air turbulence along the bogies at very high speeds.',
  },
  'Groupe Climatisation & Freins Rhéostatiques': {
    name: 'HVAC & Dynamic Brake Pack',
    roleHint: 'Dissipates heat generated during high-speed braking.',
  },
  'Balise Radio Sol-Train': {
    name: 'Track-to-Train Radio Beacon',
    roleHint: 'Communicates continuously with central rail dispatch.',
  },
  'Attelage Automatique Arrière': {
    name: 'Rear Automatic Coupler',
    roleHint: 'Locks the locomotive securely to passenger coaches.',
  },

  // Formula & Race Prototype
  'Fond Plat Aérodynamique': {
    name: 'Ground-Effect Floor',
    roleHint: 'Ultra-low underfloor that sucks the race car onto the track.',
  },
  'Cellule Cockpit': {
    name: 'Monocoque Cockpit Cell',
    roleHint: 'High-strength central survival shell where the driver sits.',
  },
  'Moteur Hybride V6': {
    name: 'V6 Hybrid Power Unit',
    roleHint: 'Mounted right behind the driver for ideal weight balance.',
  },
  'Suspension & Roues Avant': {
    name: 'Front Suspension & Slicks',
    roleHint: 'Wide racing tires delivering razor-sharp cornering.',
  },
  'Suspension & Roues Arrière': {
    name: 'Rear Drive Tires',
    roleHint: 'Wide rear tires putting all V6 hybrid power onto the tarmac.',
  },
  'Pontons Radiateurs': {
    name: 'Cooling Sidepods',
    roleHint: 'Scoop fresh air along the sides to cool the hybrid engine.',
  },
  'Cône Avant Profilé': {
    name: 'Streamlined Nose Cone',
    roleHint: 'Pierces the air ahead of the cockpit and holds the front wing.',
  },
  'Aileron Avant Multi-Volets': {
    name: 'Multi-Element Front Wing',
    roleHint: 'Presses the front tires onto the asphalt in fast corners.',
  },
  'Arceau Halo & Prise Air': {
    name: 'Titanium Halo & Airbox',
    roleHint: 'Titanium safety hoop protecting the driver helmet.',
  },
  'Aileron Arrière DRS': {
    name: 'DRS Rear Wing',
    roleHint: 'Generates massive rear aerodynamic downforce.',
  },
  'Fond Plat Carbone': {
    name: 'Carbon Venturi Floor',
    roleHint: 'Creates suction that glues the prototype to the circuit.',
  },
  'Cellule Monocoque Centrale': {
    name: 'Central Carbon Monocoque',
    roleHint: 'Ultra-light safety cell protecting the racing driver.',
  },
  'Roues Larges Avant': {
    name: 'Wide Front Slicks',
    roleHint: 'Smooth racing tires maximizing cornering grip.',
  },
  'Roues Motrices Arrière': {
    name: 'Wide Rear Drive Wheels',
    roleHint: 'Transmit blistering acceleration onto the track.',
  },
  'Museau Aérodynamique': {
    name: 'Aerodynamic Nose Cone',
    roleHint: 'Cuts through the wind and absorbs frontal impact energy.',
  },
  'Groupe Propulseur Hybride': {
    name: 'Hybrid Racing Powertrain',
    roleHint: 'Combines combustion power with electric energy recovery.',
  },
  'Aileron Avant Multi-Plans': {
    name: 'Multi-Plane Front Wing',
    roleHint: 'Directs airflow cleanly around the front wheels.',
  },
  'Aileron Arrière Haute Charge': {
    name: 'High-Downforce Rear Wing',
    roleHint: 'Maintains rock-solid stability above 300 km/h.',
  },
  'Pontons Radiateurs Latéraux': {
    name: 'Lateral Radiator Sidepods',
    roleHint: 'Cool the engine using high-speed airflow.',
  },
  'Arceau Titane Halo': {
    name: 'Titanium Cockpit Halo',
    roleHint: 'Protects the cockpit while feeding the upper air intake.',
  },
  'Dérive Dorsale Stabilisatrice': {
    name: 'Dorsal Shark Fin',
    roleHint: 'Stabilizes airflow toward the rear wing in fast turns.',
  },
  'Caméra Embarquée T-Cam': {
    name: 'Onboard Telemetry T-Cam',
    roleHint: 'Streams live track video and measures airspeed.',
  },
  'Cellules Énergétiques Dorsales': {
    name: 'Dorsal Energy Cells',
    roleHint: 'Harvest solar energy to power the onboard telemetry computer.',
  },
  'Diffuseur Venturi Arrière': {
    name: 'Rear Venturi Diffuser',
    roleHint: 'Accelerates underbody airflow to double cornering grip.',
  },

  // Boats, Sailboats, Catamarans, Ships & Submarines
  'Coque Flottante': {
    name: 'Buoyant Hull',
    roleHint: "Displaces water so the boat floats via Archimedes' principle.",
  },
  'Quille de Stabilité': {
    name: 'Ballast Keel',
    roleHint: 'Heavy underwater fin that prevents the sailboat from capsizing.',
  },
  'Pont Marin': {
    name: 'Watertight Marine Deck',
    roleHint: 'Sealed deck floor where sailors move safely.',
  },
  'Mât & Bôme': {
    name: 'Mast & Boom',
    roleHint: 'Tall vertical spar supporting the mainsail against strong gusts.',
  },
  'Grande Voile Courbée': {
    name: 'Curved Mainsail',
    roleHint: 'Captures wind energy just like a vertical airplane wing.',
  },
  'Coque Marine Profilée': {
    name: 'Streamlined Marine Hull',
    roleHint: 'Provides buoyancy and glides over waves with minimal drag.',
  },
  'Quille Lestée Anti-Dérive': {
    name: 'Weighted Anti-Drift Keel',
    roleHint: 'Underwater counterweight keeping the sailing vessel upright.',
  },
  'Pont Étanche en Teck': {
    name: 'Watertight Teak Deck',
    roleHint: 'Sturdy marine deck where the crew handles the lines.',
  },
  'Grand Mât & Bôme': {
    name: 'Main Mast & Boom',
    roleHint: 'Tall vertical mast that hoists and tensions the sail.',
  },
  'Grande Voile Principale': {
    name: 'Primary Mainsail',
    roleHint: 'Converts wind breeze into smooth forward propulsion.',
  },
  'Safran & Hélice de Port': {
    name: 'Rudder & Harbor Propeller',
    roleHint: 'Steers the sailboat and assists with tight harbor docking.',
  },
  'Roof Vitré d’Abri': {
    name: 'Glazed Deckhouse Cabin',
    roleHint: 'Shelters the navigation chart table and crew berths.',
  },
  'Étai & Mât de Foc Avant': {
    name: 'Forestay & Jib Spar',
    roleHint: 'Supports the forward headsail at the bow of the ship.',
  },
  'Foc Avant Aérodynamique': {
    name: 'Aerodynamic Front Jib',
    roleHint: 'Accelerates airflow across the mainsail for extra speed.',
  },
  'Foils Porteurs Latéraux': {
    name: 'Lateral Lifting Hydrofoils',
    roleHint: 'Lift the hull clear above the waves at high speed!',
  },
  'Anémomètre & Radar Marin': {
    name: 'Wind Sensor & Marine Radar',
    roleHint: 'Measures exact wind speed and spots distant reefs.',
  },
  'Portique Solaire de Poupe': {
    name: 'Stern Solar Arch',
    roleHint: 'Recharges navigation instruments day after day at sea.',
  },
  'Défenses d’Étrave Océaniques': {
    name: 'Ocean Bow Fenders',
    roleHint: 'Protect the bow during delicate harbor moorings.',
  },
  'Projecteur de Veille Nocturne': {
    name: 'Night Watch Searchlight',
    roleHint: 'Illuminates buoys and drifting ice at night.',
  },
  'Double Coque Catamaran': {
    name: 'Twin Catamaran Hulls',
    roleHint: 'Two wide-set pontoons providing rock-solid stability.',
  },
  'Plateforme Centrale Suspendue': {
    name: 'Central Bridge Deck',
    roleHint: 'Rigidly connects both pontoons high above the waves.',
  },
  'Salon Panoramique Vitré': {
    name: 'Panoramic Wheelhouse',
    roleHint: 'Houses the crew and 360-degree helm station.',
  },
  'Hydrojets de Propulsion': {
    name: 'Waterjet Thrusters',
    roleHint: 'Propel the multihull swiftly even in shallow lagoons.',
  },
  'Arche Radar & Navigation': {
    name: 'Radar & Navigation Arch',
    roleHint: 'Monitors marine traffic all around the catamaran.',
  },
  'Toit Solaire Énergétique': {
    name: 'Solar Power Roof',
    roleHint: 'Generates clean electricity under bright ocean sunlight.',
  },
  'Mât-Aile Auxiliaire': {
    name: 'Auxiliary Wing-Mast',
    roleHint: 'Saves energy by harnessing ocean breezes.',
  },
  'Voile Rigide Orientable': {
    name: 'Rotatable Rigid Wingsail',
    roleHint: 'Automatically angles itself into the wind.',
  },
  'Portique de Mise à l’Eau': {
    name: 'Stern Launch Davit',
    roleHint: 'Lowers a tender boat or scientific buoys astern.',
  },
  'Plan Porteur Hydrofoil Central': {
    name: 'Central T-Foil',
    roleHint: 'Lightens the pontoons as soon as the catamaran accelerates.',
  },
  'Amortisseurs d’Accostage': {
    name: 'Bow Docking Bumpers',
    roleHint: 'Cushion the tips of both pontoons against the pier.',
  },
  'Drone Sous-Marin d’Inspection': {
    name: 'Reef Inspection Mini-ROV',
    roleHint: 'Explores coral reefs right beneath the catamaran.',
  },
  'Projecteurs Marins Haute Portée': {
    name: 'Long-Range Marine Spotlights',
    roleHint: 'Light up the sea surface hundreds of meters ahead.',
  },
  'Grue Marine Latérale': {
    name: 'Side Marine Davit Crane',
    roleHint: 'Deploys the underwater drone and research gear.',
  },
  'Coque Renforcée': {
    name: 'Reinforced Steel Hull',
    roleHint: 'Wide, sturdy hull built to withstand harbor waves and towing.',
  },
  'Hélice & Gouvernail': {
    name: 'High-Torque Prop & Rudder',
    roleHint: 'Powerful propeller assembly built to tow giant cargo ships.',
  },
  'Pont de Travail': {
    name: 'Working Marine Deck',
    roleHint: 'Supports towing winches and seals the engine room below.',
  },
  'Défenses Pneus de Proue': {
    name: 'Rubber Bow Fenders',
    roleHint: 'Cushion the contact when the tugboat pushes a giant freighter.',
  },
  'Timonerie Vitrée': {
    name: 'Glazed Wheelhouse',
    roleHint: 'Raised bridge giving the captain a full view of the port.',
  },
  'Cheminées Jumelles': {
    name: 'Twin Exhaust Funnels',
    roleHint: 'Vent exhaust from the giant marine engines below deck.',
  },
  'Mât Radar Marin': {
    name: 'Marine Radar Mast',
    roleHint: 'Detects nearby vessels even in thick coastal fog.',
  },
  'Coque Hauturière': {
    name: 'Deep-Ocean Hull',
    roleHint: 'High-freeboard hull built to brave the roughest seas.',
  },
  'Propulseurs Azimutaux': {
    name: '360° Azimuth Thrusters',
    roleHint: 'Swiveling pods that hold the ship steady right above a wreck.',
  },
  'Pont Scientifique': {
    name: 'Scientific Work Deck',
    roleHint: 'Carries onboard labs and submersible launch cranes.',
  },
  'Hélisurface de Proue': {
    name: 'Bow Helipad',
    roleHint: 'Circular forward landing pad for offshore resupply.',
  },
  'Passerelle Panoramique': {
    name: 'Panoramic Navigation Bridge',
    roleHint: 'Command center for ship helm and sonar mapping.',
  },
  'Arche Radar & Satellites': {
    name: 'Radar & Satcom Mast',
    roleHint: 'Transmits seabed discoveries to scientists worldwide.',
  },
  'Rampe de Projecteurs': {
    name: 'Deck Floodlight Bar',
    roleHint: 'Lights up the working deck during night expeditions.',
  },
  'Portique Arrière en A': {
    name: 'Stern A-Frame Gantry',
    roleHint: 'Pivoting rear arch that lowers heavy ocean equipment.',
  },
  'Grue Télescopique': {
    name: 'Telescopic Marine Crane',
    roleHint: 'Lifts and gently lowers the submersible into the waves.',
  },
  'Sous-Marin ROV Abyssal': {
    name: 'Abyssal ROV Submersible',
    roleHint: 'Tethered yellow robot built to dive thousands of meters deep!',
  },
  'Coque Acier Haute Mer': {
    name: 'Offshore Steel Hull',
    roleHint: 'High-volume hull displacing tons of water to float heavy cargo.',
  },
  'Hélices & Gouvernail Marin': {
    name: 'Twin Props & Rudder',
    roleHint: 'Drive and steer the vessel steadily through strong currents.',
  },
  'Pont Principal Renforcé': {
    name: 'Reinforced Main Deck',
    roleHint: 'Seals the hull watertight and supports the superstructure.',
  },
  'Château & Passerelle de Commandement': {
    name: 'Command Bridge Superstructure',
    roleHint: 'Elevated bridge from which the captain steers the ship.',
  },
  'Cheminée Marine Double': {
    name: 'Dual Marine Funnel',
    roleHint: 'Vents filtered exhaust from the lower engine room.',
  },
  'Mât Radar & Vigie': {
    name: 'Radar & Lookout Mast',
    roleHint: 'Spots ships and coastlines in foggy weather.',
  },
  'Renforts d’Étrave': {
    name: 'Bow Ice & Impact Guards',
    roleHint: 'Protect the ship bow against heavy docks or pack ice.',
  },
  'Conteneurs / Cale Technique Arrière': {
    name: 'Aft Container & Tech Hold',
    roleHint: 'Stores cargo containers or specialist offshore modules.',
  },
  'Grue de Pont Hydraulique': {
    name: 'Hydraulic Deck Crane',
    roleHint: 'Transfers heavy supplies at port or out at sea.',
  },
  'Quille Anti-Roulis': {
    name: 'Anti-Roll Bilge Keel',
    roleHint: 'Dampens side-to-side rolling in heavy ocean swells.',
  },
  'Rampe de Projecteurs Arctiques': {
    name: 'Arctic Searchlight Array',
    roleHint: 'Illuminates pack ice ahead of the bow on night watches.',
  },
  'Parabole Satellite Maritime': {
    name: 'Maritime Satcom Dish',
    roleHint: 'Provides weather maps and communications mid-ocean.',
  },
  'Portique Océanique Arrière': {
    name: 'Aft Ocean Gantry',
    roleHint: 'Deploys subsea cables or scientific nets over the stern.',
  },
  'Module Sous-Marin Embarqué': {
    name: 'Onboard Subsea ROV',
    roleHint: 'Inspects subsea cables and the ocean floor beneath the ship.',
  },
  'Coque Épaisse Résistante à la Pression': {
    name: 'Thick Pressure Hull',
    roleHint: 'Streamlined cylinder engineered to withstand crushing deep-sea pressure.',
  },
  'Kiosque & Périscope': {
    name: 'Conning Tower & Periscope',
    roleHint: 'Dorsal sail housing the surface observation periscope.',
  },
  'Barres de Plongée Arrière': {
    name: 'Stern Dive Planes & Rudder',
    roleHint: 'Pitch and steer the submarine smoothly underwater.',
  },
  'Hélice Silencieuse Multipale': {
    name: 'Multi-Blade Silent Propeller',
    roleHint: 'Propels the submarine underwater with minimal acoustic noise.',
  },
  'Quille de Lest & Ballasts': {
    name: 'Ballast Keel & Dive Tanks',
    roleHint: 'Fills with seawater to dive and compressed air to surface!',
  },
  'Dôme Sonar / Hublot Abyssal': {
    name: 'Sonar Dome & Viewport',
    roleHint: 'Listens to underwater echoes and views the deep seabed.',
  },
  'Propulseurs Latéraux de Précision': {
    name: 'Precision Side Thrusters',
    roleHint: 'Allow stationary hovering right beside an underwater cliff.',
  },
  'Rampe LED des Abysses': {
    name: 'Deep-Sea LED Light Bar',
    roleHint: 'Pierces the pitch-black darkness below 200 meters.',
  },
  'Passerelle Supérieure Perméable': {
    name: 'Upper Casing Deck',
    roleHint: 'Lets crew walk safely along the top hull while in port.',
  },
  'Bras Manipulateur d’Échantillons': {
    name: 'Sample Manipulator Arm',
    roleHint: 'Gently collects volcanic rocks or deep-sea specimens.',
  },
  'Antenne Bouée & Radar Surface': {
    name: 'Surface Radar & Buoy Mast',
    roleHint: 'Extends from the conning tower upon returning to the surface.',
  },
  'Cocons Batteries Lithium-Mer': {
    name: 'Subsea Battery Pods',
    roleHint: 'Supply days of clean underwater electric endurance.',
  },
  'Sas d’Amarrage de Secours': {
    name: 'Deep Rescue Docking Hatch',
    roleHint: 'Watertight collar enabling crew transfer underwater.',
  },
  'Treuil de Sonde Remorquée': {
    name: 'Towed Sonar Winch',
    roleHint: 'Reels out an acoustic mapping sensor behind the sub.',
  },

  // Planes, Seaplanes, Biplanes, Jets, Helicopters & Drones
  'Fuselage Profilé': {
    name: 'Streamlined Fuselage',
    roleHint: 'Aerodynamic central body housing the pilot cockpit.',
  },
  "Train d'Atterrissage": {
    name: 'Landing Gear',
    roleHint: 'Cushions runway touchdown during takeoff and landing.',
  },
  'Aile Haute Portante': {
    name: 'High Lift Wing',
    roleHint: 'Generates aerodynamic lift that carries the airplane skyward.',
  },
  'Empennage Arrière': {
    name: 'Tail Stabilizer',
    roleHint: 'Keeps flight straight and steady like feathers on an arrow.',
  },
  'Hélice Tripale': {
    name: 'Three-Blade Propeller',
    roleHint: 'Pulls the aircraft forward through the air.',
  },
  'Fuselage Aérodynamique': {
    name: 'Aerodynamic Fuselage',
    roleHint: 'Sleek central airframe linking the cockpit to the tail.',
  },
  'Train d’Atterrissage Principal': {
    name: 'Main Landing Gear',
    roleHint: 'Supports taxiing and absorbs runway landing forces.',
  },
  'Grande Aile Portante': {
    name: 'Main Lifting Wing',
    roleHint: 'Creates upward lift to keep the aircraft aloft.',
  },
  'Empennage Stabilisateur': {
    name: 'Tailplane & Fin',
    roleHint: 'Provides pitch balance and directional stability in flight.',
  },
  'Hélice de Traction Avant': {
    name: 'Front Tractor Propeller',
    roleHint: 'Turns engine torque into forward aerial thrust.',
  },
  'Moteur Aviation en Étoile': {
    name: 'Radial Aero Engine',
    roleHint: 'Drives the propeller shaft with dependable mechanical power.',
  },
  'Haubans de Renfort d’Aile': {
    name: 'Wing Support Struts',
    roleHint: 'Brace aerodynamic loads between the fuselage and wing.',
  },
  'Nacelles Bimoteurs d’Ailes': {
    name: 'Twin Wing Engine Pods',
    roleHint: 'Add extra thrust beneath each wing panel.',
  },
  'Coffre Ventral d’Expédition': {
    name: 'Belly Cargo Pod',
    roleHint: 'Carries mail, expedition supplies, or weather sensors.',
  },
  'Cellules Solaires d’Extrados': {
    name: 'Upper-Wing Solar Cells',
    roleHint: 'Harvest sunlight above the clouds to extend flight range.',
  },
  'Radôme Météo Dorsal': {
    name: 'Dorsal Weather Radome',
    roleHint: 'Scans clouds and wind currents far ahead.',
  },
  'Phares d’Approche Nocturne': {
    name: 'Night Approach Landing Lights',
    roleHint: 'Illuminate remote airstrips during night landings.',
  },
  'Roulette de Queue Amortie': {
    name: 'Cushioned Tailwheel',
    roleHint: 'Supports the rear fuselage during steep bush takeoffs.',
  },
  'Réservoirs Supplémentaires de Saumon': {
    name: 'Wingtip Range Tanks',
    roleHint: 'Extend flight distance and calm wingtip air vortices.',
  },
  'Fuselage Classique': {
    name: 'Classic Biplane Fuselage',
    roleHint: 'Central airframe connecting the open cockpit to the tail.',
  },
  'Moteur Étoile Radial': {
    name: 'Air-Cooled Radial Engine',
    roleHint: 'Star-arranged cylinders cooled directly by rushing airflow.',
  },
  'Train Classique Bi-Roues': {
    name: 'Classic Taildragger Gear',
    roleHint: 'Holds the biplane nose high on grass airfields.',
  },
  'Aile Basse': {
    name: 'Lower Wing',
    roleHint: 'First lifting surface mounted beneath the fuselage.',
  },
  "Mâts d'Entretoise": {
    name: 'Interplane Wing Struts',
    roleHint: 'Lock the lower and upper wings into a rigid box structure.',
  },
  'Aile Haute': {
    name: 'Upper Wing',
    roleHint: 'Doubles lift for tight aerobatic loops and rolls!',
  },
  'Empennage de Voltige': {
    name: 'Aerobatic Tail Surfaces',
    roleHint: 'Wide control surfaces for crisp pitch and yaw maneuvers.',
  },
  'Hélice de Traction': {
    name: 'Wooden Tractor Propeller',
    roleHint: 'Bolts onto the radial engine shaft to pull the biplane.',
  },
  'Flotteurs d’Amerrissage Doubles': {
    name: 'Twin Seaplane Floats',
    roleHint: 'Allow takeoff and water landings on lakes and lagoons.',
  },
  'Fuselage Étanche Renforcé': {
    name: 'Corrosion-Sealed Fuselage',
    roleHint: 'Central hull treated against sea spray and water splashes.',
  },
  'Aile Basse Principale': {
    name: 'Primary Lower Wing',
    roleHint: 'Lower lifting wing anchored directly to the fuselage.',
  },
  'Empennage Haut Hors d’Eau': {
    name: 'High Spray-Clear Tail',
    roleHint: 'Mounted high to stay clear of water spray on takeoff.',
  },
  'Hélice Marine Anti-Corrosion': {
    name: 'Marine-Grade Propeller',
    roleHint: 'Pulls the floatplane briskly up onto the step.',
  },
  'Moteur en Étoile refroidi par Air': {
    name: 'Air-Cooled Radial Engine',
    roleHint: 'Delivers instant power when throttling up on the water.',
  },
  'Mâts d’Entretoise Rigides': {
    name: 'Rigid Interplane Struts',
    roleHint: 'Maintain exact spacing between upper and lower wings.',
  },
  'Aile Supérieure Haute Portance': {
    name: 'High-Lift Upper Wing',
    roleHint: 'Enables ultra-short water or snow takeoffs.',
  },
  'Soute à Eau d’Écopage': {
    name: 'Water-Scooping Belly Tank',
    roleHint: 'Fills in seconds while skimming across a lake!',
  },
  'Turbines Auxiliaires d’Aile Haute': {
    name: 'Upper-Wing Auxiliary Turbines',
    roleHint: 'Mounted high above to stay clear of ocean spray.',
  },
  'Radar de Sauvetage Maritime': {
    name: 'Maritime Search Radar',
    roleHint: 'Locates vessels in distress across open water.',
  },
  'Treuil Latéral d’Hélitreuillage': {
    name: 'Side Rescue Hoist',
    roleHint: 'Lifts supplies or crew from isolated shorelines.',
  },
  'Fuselage Pressurisé Haute Vitesse': {
    name: 'Pressurized High-Speed Fuselage',
    roleHint: 'Pressurized tube allowing comfortable breathing at 11,000 m.',
  },
  'Voilure en Flèche / Delta': {
    name: 'Swept / Delta Wing',
    roleHint: 'Swept-back wing engineered for transonic and supersonic flight.',
  },
  'Réacteurs Double Flux': {
    name: 'Turbofan Jet Engines',
    roleHint: 'Draw in and accelerate huge volumes of air for jet thrust.',
  },
  'Empennage Supersonique': {
    name: 'Supersonic Tail Fin',
    roleHint: 'Holds heading with pinpoint aerodynamic stability.',
  },
  'Train d’Atterrissage Escamotable': {
    name: 'Retractable Landing Gear',
    roleHint: 'Folds neatly inside the fuselage after liftoff to cut drag.',
  },
  'Cône Radar Supersonique': {
    name: 'Supersonic Nose Radome',
    roleHint: 'Needle-sharp nose that pierces sonic shockwaves.',
  },
  'Train Avant Orientable': {
    name: 'Steerable Nose Gear',
    roleHint: 'Guides the jetliner accurately along airport taxiways.',
  },
  'Plans Canards Avant': {
    name: 'Forward Canard Foreplanes',
    roleHint: 'Movable front winglets boosting low-speed lift and control.',
  },
  'Réacteurs Externes Supplémentaires': {
    name: 'Outboard Booster Pods',
    roleHint: 'Turn a twin-jet into a long-range four-engine flagship!',
  },
  'Tuyère de Postcombustion Arrière': {
    name: 'Rear Afterburner Nozzle',
    roleHint: 'Injects extra thrust to push past the sound barrier.',
  },
  'Carénage Satcom Dorsal': {
    name: 'Dorsal Satcom Fairing',
    roleHint: 'Links the aircraft to satellites across ocean crossings.',
  },
  'Feux Stroboscopiques Anti-Collision': {
    name: 'Anti-Collision Strobe Beacons',
    roleHint: 'Keep the aircraft visible from dozens of kilometers away.',
  },
  'Quilles Aérodynamiques Ventrales': {
    name: 'Ventral Aero Fins',
    roleHint: 'Keep airflow rock-steady at Mach 2.',
  },
  'Tube Pitot de Mesure Mach': {
    name: 'Mach Nose Pitot Probe',
    roleHint: 'Measures dynamic air pressure right at the nose tip.',
  },
  'Plancher Structurel': {
    name: 'Structural Floor Frame',
    roleHint: 'Lightweight alloy frame linking landing skids to the cabin.',
  },
  "Patins d'Atterrissage": {
    name: 'Tubular Landing Skids',
    roleHint: 'Allow safe touchdowns on snow, rock ledges, or helipads.',
  },
  'Cabine Vitrée Médicale': {
    name: 'Panoramic Rescue Cabin',
    roleHint: 'Wide bubble canopy giving pilots clear downward visibility.',
  },
  'Poutre de Queue': {
    name: 'Tail Boom',
    roleHint: 'Long rear boom holding the tail rotor clear of the main blades.',
  },
  'Dérive Stabilisatrice': {
    name: 'Vertical Tail Fin',
    roleHint: 'Helps the helicopter fly straight in forward cruise.',
  },
  'Rotor Anticouple Arrière': {
    name: 'Anti-Torque Tail Rotor',
    roleHint: 'Essential! Without it, the cabin would spin in circles.',
  },
  'Double Turbine Supérieure': {
    name: 'Twin Turboshaft Engines',
    roleHint: 'Two jet turbines driving the main rotor gearbox.',
  },
  'Mât & Plateau Cyclique': {
    name: 'Rotor Mast & Swashplate',
    roleHint: 'Tilts blade pitch to fly forward, backward, or sideways.',
  },
  'Quadri-Pales Porteuses': {
    name: 'Four-Blade Main Rotor',
    roleHint: 'Four spinning wings enabling rock-steady mid-air hover!',
  },
  'Treuil de Sauvetage': {
    name: 'Side Rescue Winch',
    roleHint: 'Lowers a rescuer on a steel cable without needing to land.',
  },
  'Projecteur de Recherche': {
    name: 'Chin Searchlight',
    roleHint: 'Powerful steerable light beam mounted under the nose.',
  },
  'Patins d’Atterrissage Tubulaires': {
    name: 'Tubular Landing Skids',
    roleHint: 'Cushion vertical touchdowns on uneven ground.',
  },
  'Cellule Centrale Panoramique': {
    name: 'Central Flight Pod',
    roleHint: 'Core fuselage housing avionics, battery, and flight controls.',
  },
  'Mât Rotor & Plateau Cyclique': {
    name: 'Central Rotor Hub',
    roleHint: 'Transfers motor torque and tilts the rotor plane.',
  },
  'Voilure Tournante Principale': {
    name: 'Primary Lift Rotor',
    roleHint: 'Creates downward airflow for smooth stationary hovering.',
  },
  'Poutre de Queue Profilée': {
    name: 'Streamlined Tail Boom',
    roleHint: 'Stabilizes heading in forward flight.',
  },
  'Rotor Anticouple Latéral': {
    name: 'Lateral Tail Rotor',
    roleHint: 'Counters main rotor torque to hold a steady heading.',
  },
  'Bloc Turbines Supérieur': {
    name: 'Upper Turbine / Motor Pack',
    roleHint: 'Delivers high power-to-weight output.',
  },
  'Bras Quadri-Rotors Stabilisateurs': {
    name: 'Quad-Rotor Outrigger Arms',
    roleHint: 'Add four ducted rotors for agile vertical flight!',
  },
  'Dérive Verticale Arrière': {
    name: 'Rear Vertical Fin',
    roleHint: 'Keeps cruise flight straight and efficient.',
  },
  'Treuil de Levage Précis': {
    name: 'Precision Cargo Hoist',
    roleHint: 'Lowers or raises payloads while hovering.',
  },
  'Tourelle Optique Sous le Nez': {
    name: 'Gimbaled Nose Camera',
    roleHint: 'Keeps video crystal-steady even in gusty winds.',
  },
  'Moignons d’Ailes Porteuses': {
    name: 'Lifting Stub Wings',
    roleHint: 'Offload the rotor at high cruise speed and carry pods.',
  },
  'Rampe LED d’Intervention': {
    name: 'Landing Zone LED Bar',
    roleHint: 'Floods the landing zone with bright white light.',
  },
  'Radar Millimétrique de Rotor': {
    name: 'Mast Millimeter-Wave Radar',
    roleHint: 'Detects power lines and obstacles 360° around.',
  },

  // Construction & Agriculture
  'Train de Chenilles Acier': {
    name: 'Steel Caterpillar Tracks',
    roleHint: 'Spread weight evenly over soft earth without sinking.',
  },
  'Tourelle Rotative 360°': {
    name: '360° Slewing Turret',
    roleHint: 'Ring gear allowing the upper structure to spin full circle.',
  },
  'Cabine Panoramique de Chantier': {
    name: 'Panoramic Operator Cab',
    roleHint: 'Glazed cab with dual hydraulic joysticks.',
  },
  'Flèche Hydraulique & Godet à Dents': {
    name: 'Hydraulic Boom & Toothed Bucket',
    roleHint: 'Digs soil and lifts boulders using high-pressure oil.',
  },
  'Contrepoids Arrière Massif': {
    name: 'Heavy Rear Counterweight',
    roleHint: 'Cast-iron ballast block preventing forward tipping!',
  },
  'Groupe Moteur & Pompes Hydrauliques': {
    name: 'Engine & Hydraulic Pump Bay',
    roleHint: 'Pressurizes hydraulic fluid to drive every cylinder.',
  },
  'Lame de Nivellement Avant': {
    name: 'Front Backfill Blade',
    roleHint: 'Braces the tracks while digging and levels trenches.',
  },
  'Échappement Vertical Chantier': {
    name: 'Vertical Site Exhaust',
    roleHint: 'Directs hot exhaust upward away from ground crews.',
  },
  'Gyrophare Orange de Sécurité': {
    name: 'Amber Safety Strobe',
    roleHint: 'Alerts the worksite whenever the turret swings.',
  },
  'Grille Pare-Pierres de Cabine': {
    name: 'Cab Rock Guard Cage',
    roleHint: 'Shields the windshield against flying quarry stones.',
  },
  'Antenne Guidage Laser 3D': {
    name: '3D Laser Digging Mast',
    roleHint: 'Shows the operator exact trench depth to the centimeter!',
  },
  'Radiateurs d’Huile Latéraux': {
    name: 'Side Hydraulic Oil Coolers',
    roleHint: 'Keep hydraulic oil at peak operating temperature.',
  },
  'Treuil de Levage de Buses': {
    name: 'Pipe-Laying Auxiliary Winch',
    roleHint: 'Lowers utility pipes gently into the trench.',
  },
  'Tambour Fraiseur Auxiliaire': {
    name: 'Auxiliary Rock Cutter Drum',
    roleHint: 'Chews through hard bedrock and subsea trenches.',
  },
  'Châssis Articulé Lourd': {
    name: 'Heavy Articulated Frame',
    roleHint: 'Thick steel chassis built to handle huge pushing forces.',
  },
  'Cylindre Compacteur Avant': {
    name: 'Front Compactor Drum',
    roleHint: 'Rolls gravel and hot asphalt smooth and flat.',
  },
  'Essieu Cranté de Propulsion': {
    name: 'Deep-Tread Drive Axle',
    roleHint: 'Giant lugged tires pushing the machine over rough ground.',
  },
  'Cabine Haute Surélevée': {
    name: 'Elevated Site Cab',
    roleHint: 'Gives a clear view of both drum edges and blade.',
  },
  'Grande Lame de Terrassement': {
    name: 'Heavy Earthmoving Blade',
    roleHint: 'Pushes tons of soil and grades the worksite level.',
  },
  'Bloc Moteur Haute Puissance': {
    name: 'High-Output Powerplant',
    roleHint: 'Supplies traction power and compactor vibration.',
  },
  'Réservoir d’Arrosage & Lest': {
    name: 'Water Spray & Ballast Tank',
    roleHint: 'Wets the steel drum so hot asphalt never sticks!',
  },
  'Cheminée d’Échappement Avant': {
    name: 'Hood Exhaust Stack',
    roleHint: 'Vents exhaust cleanly above the engine hood.',
  },
  'Rampe Lumineuse de Chantier': {
    name: 'Worksite Floodlight Bar',
    roleHint: 'Signals reversing maneuvers clearly.',
  },
  'Dent Défonceuse Arrière (Ripper)': {
    name: 'Rear Heavy Ripper Shank',
    roleHint: 'Breaks up frozen or rocky ground behind the dozer.',
  },
  'Arceau Anti-Retournement ROPS': {
    name: 'ROPS Rollover Safety Frame',
    roleHint: 'Ultra-strong steel safety cage surrounding the cab.',
  },
  'Mât Récepteur Nivellement Laser': {
    name: 'Laser Grade Receiver Mast',
    roleHint: 'Guarantees a runway-flat surface to within millimeters.',
  },
  'Blindages Hydrauliques Latéraux': {
    name: 'Side Hydraulic Armor Shields',
    roleHint: 'Protect high-pressure oil hoses against sharp rocks.',
  },
  'Capteur de Densité du Sol': {
    name: 'Real-Time Soil Compaction Sensor',
    roleHint: 'Measures live ground stiffness beneath the machine.',
  },
  'Châssis Lesté Bas': {
    name: 'Low-Slung Weighted Chassis',
    roleHint: 'Ultra-low center of gravity to lift loads without tipping.',
  },
  'Essieu Porteur Renforcé Avant': {
    name: 'Heavy Front Load Axle',
    roleHint: 'Carries the full weight of the raised mast and load.',
  },
  'Essieu Directeur Arrière': {
    name: 'Tight-Turn Rear Steer Axle',
    roleHint: 'Rear wheels turn nearly 90° to pivot almost on the spot!',
  },
  'Poste de Conduite Protégé': {
    name: 'Protected Operator Station',
    roleHint: 'Shields the operator from overhead hazards.',
  },
  'Mât Vertical & Fourches de Levage': {
    name: 'Vertical Mast & Lifting Forks',
    roleHint: 'Slides vertically via hydraulic ram and heavy steel chains.',
  },
  'Bloc Contrepoids en Fonte': {
    name: 'Cast-Iron Counterweight',
    roleHint: 'Balances heavy front loads just like a seesaw.',
  },
  'Moteur Électrique / Hydraulique': {
    name: 'Electric / Hydraulic Drive Unit',
    roleHint: 'Powers quiet indoor or heavy outdoor lifting.',
  },
  'Flèche Télescopique Supérieure': {
    name: 'Upper Telescopic Crane Boom',
    roleHint: 'Extends a lifting hook high into the air.',
  },
  'Feu Flash de Manutention': {
    name: 'Safety Strobe Beacon',
    roleHint: 'Alerts nearby workers during lifting maneuvers.',
  },
  'Poutres Stabilisatrices Latérales': {
    name: 'Outrigger Stabilizer Beams',
    roleHint: 'Widen the ground footprint during heavy crane lifts.',
  },
  'Tambour de Treuil Acier': {
    name: 'Steel Hoist Winch Drum',
    roleHint: 'Spools the main multi-ton lifting cable.',
  },
  'Anémomètre de Flèche': {
    name: 'Boom-Tip Wind Sensor',
    roleHint: 'Checks that wind speed is safe before hoisting high loads.',
  },
  'Arceau Protège-Cariste': {
    name: 'Overhead Guard Frame',
    roleHint: 'Reinforces the glazed roof beneath the boom.',
  },
  'Caméra de Précision Fourches': {
    name: 'Fork-Tip Alignment Camera',
    roleHint: 'Shows exact pallet or girder alignment high above ground.',
  },
  'Châssis Agricole Surélevé': {
    name: 'High-Clearance Farm Chassis',
    roleHint: 'Tall ground clearance to straddle furrows and crops.',
  },
  'Grandes Roues Agraires Arrière': {
    name: 'Giant Lugged Rear Farm Wheels',
    roleHint: 'Huge treaded tires delivering grip without compacting soil.',
  },
  'Cabine Vitrée Panoramique': {
    name: '360° Farm Cab',
    roleHint: 'Full visibility over front and rear agricultural implements.',
  },
  'Bloc Moteur Coupleux Avant': {
    name: 'High-Torque Farm Engine',
    roleHint: 'Drives both the wheels and mechanical power take-off shaft.',
  },
  'Rabatteur / Outil Rotatif Avant': {
    name: 'Front Harvester Reel / Cutterbar',
    roleHint: 'Gathers and cuts grain cleanly across a wide swath.',
  },
  'Tambour / Trémie Rotative Arrière': {
    name: 'Rear Grain Hopper / Mixer Drum',
    roleHint: 'Mixes concrete or stores harvested grain continuously.',
  },
  'Pot d’Échappement Vertical': {
    name: 'Tall Exhaust Stack',
    roleHint: 'Keeps hot exhaust clear of dry golden crops.',
  },
  'Bras de Vidange Orientable': {
    name: 'Swiveling Unloading Auger',
    roleHint: 'Transfers harvested grain into a trailer driving alongside.',
  },
  'Dôme Autoguidage GPS Centimétrique': {
    name: 'RTK Centimeter GPS Dome',
    roleHint: 'Steers perfectly straight rows without overlapping!',
  },
  'Rampe Projecteurs de Moisson': {
    name: 'Harvest Floodlight Bar',
    roleHint: 'Lights the field to finish harvesting before rain arrives.',
  },
  'Masses d’Équilibrage Avant': {
    name: 'Front Nose Weights',
    roleHint: 'Keep the front steering wheels firmly planted.',
  },
  'Capots Latéraux de Transmission': {
    name: 'Side Drive Belt Shields',
    roleHint: 'Keep chaff and dust away from belts and chains.',
  },
  'Capteur Optique Agronomique': {
    name: 'Multispectral Crop Sensor',
    roleHint: 'Reads leaf color in real time to water only where needed.',
  },

  // Space & Robotics
  'Module Bus Central Doré': {
    name: 'Gold-Foil Spacecraft Bus',
    roleHint: 'Thermally insulated core holding flight computers and gyros.',
  },
  'Grandes Ailes Photovoltaïques': {
    name: 'Deployable Solar Wings',
    roleHint: 'Unfold in space to harvest clean electricity from sunlight.',
  },
  'Grande Parabole Haut Gain': {
    name: 'High-Gain Dish Antenna',
    roleHint: 'Beams science images millions of kilometers back to Earth.',
  },
  'Propulseur Ionique d’Orbite': {
    name: 'Ion Station-Keeping Thruster',
    roleHint: 'Gently fine-tunes orbital altitude and trajectory.',
  },
  'Télescope Optique Multispectral': {
    name: 'Multispectral Optical Telescope',
    roleHint: 'Observes planets, oceans, or distant galaxies.',
  },
  'Bouclier Thermique Multicouche': {
    name: 'Multi-Layer Sunshield',
    roleHint: 'Shields delicate instruments from solar heat and deep cold.',
  },
  'Perche Magnétomètre Déployable': {
    name: 'Deployable Magnetometer Boom',
    roleHint: 'Holds magnetic sensors clear of spacecraft electronics.',
  },
  'Viseurs d’Étoiles Latéraux': {
    name: 'Star Tracker Cameras',
    roleHint: 'Read star patterns to know exact 3D orientation in space!',
  },
  'Panneaux Solaires Secondaires': {
    name: 'Secondary Solar Array',
    roleHint: 'Captures sunlight regardless of spacecraft attitude.',
  },
  'Antenne Relais Omnidirectionnelle': {
    name: 'Omni Relay Antenna',
    roleHint: 'Picks up signals from rovers exploring a planet below.',
  },
  'Générateur Thermique Spatial': {
    name: 'Deep-Space Thermal Generator',
    roleHint: 'Supplies steady power far from the Sun past Jupiter.',
  },
  'Anneau de Maintenance Orbitale': {
    name: 'Orbital Servicing Ring',
    roleHint: 'Allows a robotic tug to dock and refuel the satellite.',
  },
  'Terminal Optique Laser': {
    name: 'Laser Optical Comm Terminal',
    roleHint: 'Streams ultra-HD science data via infrared laser beam.',
  },
  'Châssis Thermique Doré (WEB)': {
    name: 'Warm Electronics Box Chassis',
    roleHint: 'Protects batteries and computers through -100 °C planetary nights.',
  },
  'Suspension Rocker-Bogie Avant': {
    name: 'Front Rocker-Bogie Suspension',
    roleHint: 'Mesh metal wheels engineered to climb straight over boulders.',
  },
  'Train Motorisé Arrière': {
    name: 'Rear Independent Drive Wheels',
    roleHint: 'Each wheel carries its own sealed electric drive motor.',
  },
  'Mât Panoramique & Caméras Stéréo': {
    name: 'Panoramic Stereo Camera Mast',
    roleHint: "The rover's 3D eyes scanning craters and rock layers.",
  },
  'Train Central 6×6': {
    name: 'Center 6×6 Bogie Axle',
    roleHint: 'Completes six-wheel drive to cross soft Martian dunes.',
  },
  'Plateau Solaire Déployable': {
    name: 'Deployable Solar Deck',
    roleHint: 'Recharges rover batteries throughout the planetary day.',
  },
  'Bras Robotique & Foreuse de Roches': {
    name: 'Robotic Arm & Rock Corer',
    roleHint: 'Drills rock samples to search for ancient signs of water.',
  },
  'Parabole Terre Directe': {
    name: 'Direct-to-Earth High-Gain Dish',
    roleHint: 'Receives daily exploration commands directly from Earth.',
  },
  'Générateur Isotopique Arrière': {
    name: 'Rear Power Generator (MMRTG)',
    roleHint: 'Produces heat and electricity even during dust storms.',
  },
  'Antenne UHF Relais Orbiteur': {
    name: 'UHF Orbiter Relay Antenna',
    roleHint: 'Uploads panoramic photos to overhead relay orbiters.',
  },
  'Mini-Hélicoptère Éclaireur': {
    name: 'Scout Coaxial Mini-Helicopter',
    roleHint: 'Flies ahead of the rover to scout the safest route!',
  },
  'Carrousel de Tubes d’Échantillons': {
    name: 'Sample Tube Caching Carousel',
    roleHint: 'Hermetically seals rock cores for future return to Earth.',
  },
  'Projecteur UV & Spectromètre': {
    name: 'UV Spectrometer Turret',
    roleHint: 'Reveals microscopic minerals invisible to the naked eye.',
  },
  'Baie de Moteurs-Fusées Principaux': {
    name: 'Main Rocket Engine Cluster',
    roleHint: 'Blasts hot gas downward at hypersonic speed to beat gravity.',
  },
  'Premier Étage Principal': {
    name: 'First-Stage Core Booster',
    roleHint: 'Giant cryogenic propellant tank powering liftoff.',
  },
  'Ailerons Aérodynamiques de Base': {
    name: 'Base Stabilizer Fins',
    roleHint: 'Keep the rocket flying arrow-straight through the air.',
  },
  'Coiffe Aérodynamique / Capsule': {
    name: 'Payload Fairing / Crew Capsule',
    roleHint: 'Shields astronauts or satellites from supersonic wind.',
  },
  'Deuxième Étage Orbital': {
    name: 'Orbital Second Stage',
    roleHint: 'Ignites in vacuum after first-stage separation!',
  },
  'Propulseurs d’Appoint Latéraux': {
    name: 'Side Solid Rocket Boosters',
    roleHint: 'Double liftoff thrust to haul heavy payloads to space.',
  },
  'Anneau Inter-Étages & Grilles': {
    name: 'Interstage Ring & Grid Fins',
    roleHint: 'Connects stages and steers reusable booster landings.',
  },
  'Jambes d’Atterrissage Déployables': {
    name: 'Deployable Landing Legs',
    roleHint: 'Unfold so the reusable booster lands upright!',
  },
  'Tour de Sauvetage au Sommet': {
    name: 'Launch Escape System Tower',
    roleHint: 'Pulls the crew capsule instantly to safety in an emergency.',
  },
  'Ailes Solaires du Module de Service': {
    name: 'Service Module Solar Wings',
    roleHint: 'Power the spacecraft all the way to the Moon.',
  },
  'Couronne de Tuyères d’Orientation RCS': {
    name: 'RCS Attitude Thruster Ring',
    roleHint: 'Cold-gas jets that orient the rocket in zero gravity.',
  },
  'Antenne Télémétrie Haut Débit': {
    name: 'High-Rate Telemetry Antenna',
    roleHint: 'Streams live onboard rocket video from orbit.',
  },
  'Cônes Aérodynamiques de Boosters': {
    name: 'Booster Nose Cones',
    roleHint: 'Cut air drag atop the twin side boosters.',
  },
  'Fuselage Spatial & Soute Cargo': {
    name: 'Orbiter Fuselage & Payload Bay',
    roleHint: 'Pressurized spacecraft built to orbit Earth and glide home.',
  },
  'Ailes Delta à Bouclier Thermique': {
    name: 'Heat-Shielded Delta Wings',
    roleHint: 'Black thermal tiles resisting 1,600 °C atmospheric reentry!',
  },
  'Grande Dérive & Aérodéfrein': {
    name: 'Vertical Tail & Split Speedbrake',
    roleHint: 'Splits open to slow the orbiter smoothly on the runway.',
  },
  'Tri-Moteurs Cryogéniques Arrière': {
    name: 'Aft Cryogenic Main Engines',
    roleHint: 'Accelerate the orbiter all the way to 28,000 km/h!',
  },
  'Train d’Atterrissage Haute Vitesse': {
    name: 'High-Speed Runway Gear',
    roleHint: 'Drops down seconds before runway touchdown.',
  },
  'Bras Robotique Spatial Déployable': {
    name: 'Orbital Robotic Manipulator Arm',
    roleHint: 'Grapples and deploys satellites from the open payload bay.',
  },
  'Sas d’Amarrage Station Spatiale': {
    name: 'Orbital Station Docking Airlock',
    roleHint: 'Pressurized tunnel allowing astronauts to float into the station.',
  },
  'Nacelles de Manœuvre Orbitale OMS': {
    name: 'Orbital Maneuvering Pods (OMS)',
    roleHint: 'Fire in orbit to slow the ship and start reentry.',
  },
  'Panneaux Solaires Déployables de Soute': {
    name: 'Deployable Orbital Solar Array',
    roleHint: 'Powers zero-gravity science experiments for weeks.',
  },
  'Antenne Ku-Band Déployable': {
    name: 'Deployable Ku-Band Dish',
    roleHint: 'Links the crew directly with Mission Control.',
  },
  'Calotte Carbone Renforcé du Nez': {
    name: 'Reinforced Carbon-Carbon Nose Cap',
    roleHint: 'Shields the hottest point of the nose during reentry.',
  },
  'Module Laboratoire Spacelab': {
    name: 'Pressurized Spacelab Module',
    roleHint: 'Science laboratory nestled inside the payload bay.',
  },
  'Capteur Rendez-Vous Laser': {
    name: 'Laser Docking Sensor',
    roleHint: 'Measures docking distance to the millimeter in orbit.',
  },
};

export const ENGLISH_BLUEPRINT_META: Record<
  string,
  { name: string; subtitle: string; discovery: DiscoveryFacts }
> = {
  // Handcrafted 9
  'car-solar-city': {
    name: 'Solar City Car',
    subtitle: 'Nimble urban electric car powered by clean sunlight',
    discovery: {
      howItWorks:
        'Photovoltaic cells on the roof turn sunlight into electricity stored in an underfloor battery, spinning a whisper-quiet electric motor on the rear wheels.',
      realRecord:
        'In the World Solar Challenge across Australia, experimental solar cars cross over 3,000 km of desert powered purely by sunlight at over 85 km/h!',
      didYouKnow:
        'Whenever an electric car brakes, its motor runs in reverse like a bicycle dynamo and automatically recharges the battery.',
    },
  },
  'boat-explorer-sail': {
    name: 'Explorer Sailboat',
    subtitle: 'Ocean vessel propelled purely by the power of the wind',
    discovery: {
      howItWorks:
        "The hull floats thanks to Archimedes' buoyancy, a weighted keel underwater stops the boat from tipping, and the curved sail pulls the yacht forward like a vertical wing.",
      realRecord:
        'Modern Vendée Globe racing yachts sail solo non-stop all the way around Earth without a single drop of fuel in about 65 to 74 days!',
      didYouKnow:
        'A sailboat can travel toward the direction the wind comes from by sailing in zigzags — a maneuver sailors call tacking.',
    },
  },
  'plane-aeroclub': {
    name: 'Aero-Club Trainer',
    subtitle: 'Stable high-wing propeller airplane built for learning to fly',
    discovery: {
      howItWorks:
        'The spinning front propeller pulls the plane forward; as air rushes faster over the curved top of the wing, upward lift carries the aircraft into the sky.',
      realRecord:
        'Over 44,000 Cessna 172 high-wing trainers have been built since 1956, making it the most-produced aircraft in aviation history!',
      didYouKnow:
        'Placing the wing above the cabin gives natural pendulum stability and lets pilots enjoy a clear view of the ground below.',
    },
  },
  'car-fire-truck': {
    name: 'Fire Rescue Ladder Truck',
    subtitle: 'Heavy emergency truck equipped with a water tank and turntable ladder',
    discovery: {
      howItWorks:
        'On scene, the diesel engine switches power from the road wheels to a centrifugal pump blasting high-pressure water while hydraulic rams raise the ladder.',
      realRecord:
        'Standard fire aerial ladders reach 30–32 meters (around the 10th floor), while the tallest fire trucks in the world reach 68 meters!',
      didYouKnow:
        'Before extending its tall ladder skyward, a fire truck always deploys side outrigger jacks onto the pavement so it can never tip over.',
    },
  },
  'boat-port-tug': {
    name: 'Harbor Tugboat',
    subtitle: 'Compact marine powerhouse that pushes and guides giant cargo ships',
    discovery: {
      howItWorks:
        'Despite its compact length, a huge marine diesel fills most of the hull, spinning high-torque propellers able to push or pull in any direction.',
      realRecord:
        'A 30-meter harbor tug packs over 5,000 horsepower and can maneuver a 400-meter container ship weighing 200,000 tons!',
      didYouKnow:
        'Thick black rubber fenders on the bow act as giant cushions so the tug can push steel freighters without scratching them.',
    },
  },
  'plane-acro-biplane': {
    name: 'Aerobatic Biplane',
    subtitle: 'Agile stunt plane with stacked wings and a radial star engine',
    discovery: {
      howItWorks:
        'Two stacked wings braced by struts pack plenty of lift into a short wingspan, letting the biplane roll and loop with lightning agility.',
      realRecord:
        'Stunt biplanes like the Pitts Special can roll a full 360 degrees in barely more than one second!',
      didYouKnow:
        'Cylinders on a radial engine sit in a circle around the propeller so rushing wind cools every cylinder evenly without a water radiator.',
    },
  },
  'car-formula-racer': {
    name: 'Formula Grand Prix Racer',
    subtitle: 'Ground-effect single-seater race car with titanium Halo safety',
    discovery: {
      howItWorks:
        'Shaped like an upside-down airplane wing, its front/rear wings and Venturi floor press the car down onto the asphalt the faster it goes!',
      realRecord:
        'Above 250 km/h, aerodynamic downforce exceeds the weight of the Formula car itself — theoretically enough to hold it upside down on a tunnel ceiling!',
      didYouKnow:
        'The curved titanium Halo weighs just 7 kg yet can support 12 tons — the weight of a double-decker London bus.',
    },
  },
  'boat-ocean-research': {
    name: 'Oceanographic Research Vessel',
    subtitle: 'Science ship equipped with a deep-sea ROV robot and stern crane',
    discovery: {
      howItWorks:
        'Using 360° GPS azimuth thrusters, the ship hovers within one meter above a deep-sea site while lowering its tethered ROV robot on a fiber-optic cable.',
      realRecord:
        'Scientific ROV robots dive 4,000 to 6,000 meters deep to study hydrothermal vents and sunken shipwrecks in pitch darkness!',
      didYouKnow:
        'Multibeam sonar beneath the hull paints high-resolution 3D maps of underwater mountains and canyons without touching the bottom.',
    },
  },
  'plane-rescue-heli': {
    name: 'Mountain Rescue Helicopter',
    subtitle: 'Twin-turbine rotorcraft capable of hovering beside steep alpine cliffs',
    discovery: {
      howItWorks:
        'Four spinning main blades generate vertical lift even at zero airspeed, while the tail rotor pushes sideways so the cabin stays steady.',
      realRecord:
        'In 2005, a rescue helicopter set an aviation world record by landing on and taking off from the summit of Mount Everest at 8,848 meters!',
      didYouKnow:
        'When cliffs are too steep to land, the pilot hovers motionless in mid-air while the side winch lowers a paramedic on a steel cable.',
    },
  },

  // Tier 1 Fleet
  'car-taxi-metro': {
    name: 'Electric Metro Taxi',
    subtitle: 'Nimble yellow city cab built for busy avenues',
    discovery: {
      howItWorks: 'Its electric motor delivers instant torque at green lights with zero tailpipe emissions or noise.',
      realRecord: 'Big-city taxis routinely log over 400,000 kilometers over their working lives!',
      didYouKnow: 'Bright yellow was chosen in 1907 after studies showed it is the easiest color to spot from afar in the rain.',
    },
  },
  'car-dune-buggy': {
    name: 'Desert Dune Buggy',
    subtitle: 'Lightweight off-roader with wide tires built to skim over sand',
    discovery: {
      howItWorks: 'A light frame and extra-wide tires spread weight over a big footprint so the wheels float atop soft sand.',
      realRecord: 'Rally buggies climb desert sand dunes as tall as 15-story apartment buildings!',
      didYouKnow: 'Drivers lower tire pressure in the desert to widen the contact patch — just like a camel’s foot.',
    },
  },
  'car-mini-van-post': {
    name: 'Mail Delivery Van',
    subtitle: 'Compact electric van delivering parcels and letters every morning',
    discovery: {
      howItWorks: 'A boxy cargo bay maximizes parcel volume while a short wheelbase lets it park effortlessly on narrow streets.',
      realRecord: 'National postal fleets deliver millions of letters and packages daily across towns and villages.',
      didYouKnow: 'Electric mail vans stop and restart 200+ times per route while regenerating battery energy on every stop.',
    },
  },
  'boat-lagoon-catamaran': {
    name: 'Lagoon Sailing Catamaran',
    subtitle: 'Twin-hull sailboat offering ultra-flat stability over waves',
    discovery: {
      howItWorks: 'Two widely spaced slim hulls replace a heavy keel, letting the boat glide swiftly without heeling.',
      realRecord: 'Ocean racing catamarans have topped 80 km/h propelled purely by wind power!',
      didYouKnow: 'Twin-hulled sailing craft were pioneered thousands of years ago by Polynesian ocean navigators.',
    },
  },
  'boat-harbor-pilot': {
    name: 'Harbor Pilot Launch',
    subtitle: 'Fast launch that brings marine pilots out to incoming ships',
    discovery: {
      howItWorks: 'Its deep-V hull slices choppy harbor waves to deliver the harbor pilot safely alongside giant freighters.',
      realRecord: 'Many pilot boats are self-righting: even if rolled by a huge wave, they pop back upright in 5 seconds!',
      didYouKnow: 'Every major port relies on specialist pilots who know every sandbar and tidal current by heart.',
    },
  },
  'boat-coral-mini-sub': {
    name: 'Coral Reef Mini-Sub',
    subtitle: 'Compact yellow submersible built to explore shallow reefs',
    discovery: {
      howItWorks: 'Flooding ballast tanks with seawater lets the sub sink gently; blowing compressed air in brings it back up.',
      realRecord: 'Crewed scientific submersibles have reached nearly 11,000 meters at the bottom of the Mariana Trench!',
      didYouKnow: 'Research subs are painted bright yellow so surface support ships can spot them immediately upon surfacing.',
    },
  },
  'plane-bush-cub': {
    name: 'Backcountry Bush Plane',
    subtitle: 'Rugged monoplane able to land on tiny gravel strips',
    discovery: {
      howItWorks: 'Broad high-lift wings generate strong lift at slow speeds, lifting off in just a few dozen meters.',
      realRecord: 'At STOL competitions in Alaska, bush planes take off and land in under 6 meters into a headwind!',
      didYouKnow: 'Oversized low-pressure “tundra tires” cushion landings on river stones, grass, and snow.',
    },
  },
  'plane-island-floatplane': {
    name: 'Island Floatplane',
    subtitle: 'Amphibious aircraft on twin floats that uses lakes as runways',
    discovery: {
      howItWorks: 'Two streamlined pontoons replace wheels; as it accelerates, the plane rises onto the float step and lifts off.',
      realRecord: 'Hundreds of floatplanes connect remote islands and northern lakes daily without any concrete runway.',
      didYouKnow: 'The first successful powered floatplane lifted off from water in France in 1910.',
    },
  },
  'plane-park-quadcopter': {
    name: 'Camera Quadcopter Drone',
    subtitle: 'Four-rotor aerial camera stabilized by gyroscopic sensors',
    discovery: {
      howItWorks: 'Two rotors spin clockwise and two counter-clockwise; varying individual motor speeds lets it climb, turn, or glide.',
      realRecord: 'Racing quadcopters accelerate from 0 to 100 km/h in roughly one second!',
      didYouKnow: 'An onboard gyroscope adjusts all 4 motor speeds hundreds of times per second to fight wind gusts.',
    },
  },
  'const-mini-excavator': {
    name: 'Compact Garden Excavator',
    subtitle: 'Nimble tracked digger for trenches and landscaping',
    discovery: {
      howItWorks: 'Pressurized oil inside steel hydraulic cylinders bends the boom and bucket just like muscles in a giant arm.',
      realRecord: 'Micro-excavators can roll through a 75 cm doorway while still lifting over 500 kg!',
      didYouKnow: 'Rubber caterpillar tracks spread weight gently so it can cross lawns and sidewalks without leaving marks.',
    },
  },
  'const-farm-tractor-green': {
    name: 'Orchard Farm Tractor',
    subtitle: 'Compact tractor with tall lugged rear wheels',
    discovery: {
      howItWorks: 'Large rear wheels create high leverage to pull trailers smoothly across soft soil without slipping.',
      realRecord: 'A single modern tractor matches the pulling work once done by dozens of draft horses!',
      didYouKnow: 'Angled V-shaped tire lugs automatically push mud outward to keep treads clean as the wheel turns.',
    },
  },
  'const-warehouse-forklift': {
    name: 'Warehouse Forklift',
    subtitle: 'Electric vertical-mast lifter for stacking heavy pallets',
    discovery: {
      howItWorks: 'A heavy cast-iron counterweight hidden at the back keeps the forklift balanced when lifting front loads!',
      realRecord: 'High-reach warehouse trucks stack pallets over 12 meters high inside aisles narrower than 2 meters!',
      didYouKnow: 'Unlike cars, forklifts steer with their rear wheels so they can pivot tight circles around pallet corners.',
    },
  },
  'const-road-compactor': {
    name: 'Smooth-Drum Road Roller',
    subtitle: 'Heavy steel-drum machine that irons fresh roads flat',
    discovery: {
      howItWorks: 'Inside the steel cylinder, an off-center spinning weight vibrates rapidly to pack gravel and asphalt tight.',
      realRecord: 'Rapid vibration lets a 10-ton roller compact roadbeds as effectively as a 30-ton static weight!',
      didYouKnow: 'A fine water spray wets the drum so hot sticky asphalt never clings to the steel roller.',
    },
  },
  'space-weather-cubesat': {
    name: 'Orbital Weather Satellite',
    subtitle: 'Space sentinel photographing cloud swirls around Earth',
    discovery: {
      howItWorks: 'Unfolded solar wings power onboard cameras as the satellite circles Earth in frictionless vacuum.',
      realRecord: 'At 36,000 km altitude, a geostationary weather satellite orbits at Earth’s exact spin rate, hovering over one continent!',
      didYouKnow: 'Shiny gold foil blankets protect satellites from both +120 °C sunlight and -150 °C shadow.',
    },
  },
  'space-lunar-mini-rover': {
    name: 'Lunar Crater Mini-Rover',
    subtitle: 'Mesh-wheeled robot exploring craters on the Moon',
    discovery: {
      howItWorks: 'Flexible wire-mesh wheels can never puncture on sharp moon rocks while the stereo camera mast beams 3D views home.',
      realRecord: 'Rover tracks pressed into lunar dust over 50 years ago remain crisp today because the Moon has no wind or rain!',
      didYouKnow: 'Lunar gravity is one-sixth of Earth’s, so a 180 kg rover weighs the equivalent of just 30 kg on the Moon.',
    },
  },
  'space-sounding-rocket': {
    name: 'Aurora Sounding Rocket',
    subtitle: 'Slender research rocket studying auroras at the edge of space',
    discovery: {
      howItWorks: 'Blasting hot exhaust downward at high speed pushes the rocket upward by Newton’s law of action and reaction.',
      realRecord: 'A sounding rocket climbs past 100 km altitude in two minutes before parachuting its science payload back down!',
      didYouKnow: 'Rockets actually work even better in the vacuum of space because they carry their own oxidizer inside.',
    },
  },
  'space-glider-orbiter': {
    name: 'Orbital Spaceplane',
    subtitle: 'Delta-wing spacecraft that launches on a rocket and lands on a runway',
    discovery: {
      howItWorks: 'Launched vertically into orbit, it uses delta wings on return to glide smoothly through the air to a runway touchdown.',
      realRecord: 'During reentry, an orbital glider slows from 28,000 km/h to 350 km/h using atmospheric drag alone!',
      didYouKnow: 'Silica heat-shield tiles shed heat so fast you can hold their corners seconds after a red-hot furnace test.',
    },
  },

  // Tier 2 Fleet
  'car-alpine-ambulance': {
    name: 'Alpine Rescue Ambulance',
    subtitle: '4x4 medical vehicle equipped with a full mobile care unit',
    discovery: {
      howItWorks: 'All-wheel drive grips snowy mountain roads while a heavy-duty alternator powers onboard life-support gear.',
      realRecord: 'Hydropneumatic ambulance suspensions absorb over 80% of road bumps to keep patients comfortable.',
      didYouKnow: '“AMBULANCE” is often printed in mirror image on the front hood so drivers ahead read it right-way-round in their mirrors!',
    },
  },
  'car-metro-tramway': {
    name: 'Modern City Tramway',
    subtitle: 'Quiet electric streetcar gliding smoothly on steel rails',
    discovery: {
      howItWorks: 'Steel wheels rolling on steel rails cut rolling friction by 85% compared with rubber tires on asphalt.',
      realRecord: 'One modern tram carries as many commuters as 170 cars while taking up 8 times less street space!',
      didYouKnow: 'Hidden sandboxes puff fine sand onto wet autumn rails to guarantee crisp braking.',
    },
  },
  'car-safari-offroad': {
    name: 'Wilderness Expedition 4x4',
    subtitle: 'High-clearance off-roader built for rugged nature trails',
    discovery: {
      howItWorks: 'A low-range transfer gearbox multiplies engine torque at crawling speed to climb rocky slopes smoothly.',
      realRecord: 'Research 4x4 trucks have climbed the slopes of Chile’s Ojos del Salado volcano above 6,600 meters!',
      didYouKnow: 'Wildlife reserves increasingly use silent electric 4x4s so animals can be observed undisturbed.',
    },
  },
  'boat-island-ferry': {
    name: 'Island Car & Passenger Ferry',
    subtitle: 'Double-ended vessel linking mainland ports to offshore islands',
    discovery: {
      howItWorks: 'Bow and stern drive-through ramps let cars and buses roll straight aboard and drive straight off at the pier.',
      realRecord: 'Electric ferries in Norway carry 200 cars and recharge their batteries in just 10 minutes while boarding!',
      didYouKnow: 'Ships with drive-through vehicle decks are called “Ro-Ro” vessels — short for Roll-on / Roll-off.',
    },
  },
  'boat-coast-guard': {
    name: 'Fast Coast Guard Cutter',
    subtitle: 'High-speed rescue catamaran equipped with long-range radar',
    discovery: {
      howItWorks: 'Waterjet pumps draw seawater under the hulls and blast it astern for high speed with zero exposed propeller blades.',
      realRecord: 'Coast Guard rescue catamarans exceed 40 knots (75 km/h) even through rough coastal swells!',
      didYouKnow: 'Enclosed waterjets make it completely safe to maneuver close to swimmers and shallow sandbars.',
    },
  },
  'boat-Classic-schooner': {
    name: 'Ocean Training Schooner',
    subtitle: 'Tall-masted sailing vessel built for ocean crossings',
    discovery: {
      howItWorks: 'Its ballasted keel balances side wind force on the tall mainsail, turning crosswinds into steady forward speed.',
      realRecord: 'Tall sailing schooners cover over 350 kilometers a day across open ocean using zero fuel!',
      didYouKnow: 'Modern wind-assisted cargo ships borrow tall-ship aerodynamics to cut maritime emissions.',
    },
  },
  'plane-twin-commuter': {
    name: 'Regional Turboprop Airliner',
    subtitle: 'Fuel-sipping regional plane connecting short-haul routes',
    discovery: {
      howItWorks: 'A gas turbine spins a multi-blade propeller — far thriftier than pure jet engines on regional hops.',
      realRecord: 'Regional turboprops burn up to 45% less fuel than jets on flights shorter than 600 km!',
      didYouKnow: 'Propeller blade pitch adjusts in flight just like shifting gears on a bicycle.',
    },
  },
  'plane-water-bomber': {
    name: 'Amphibious Water Bomber',
    subtitle: 'Yellow-and-red firefighting seaplane that scoops lake water on the fly',
    discovery: {
      howItWorks: 'Skimming a lake at 130 km/h, two small belly probes ram water straight into onboard tanks using speed pressure alone.',
      realRecord: 'A Canadair CL-415 scoops over 6,000 liters of water in just 12 seconds over 400 meters!',
      didYouKnow: 'Each water intake scoop underneath the hull is barely the size of a shoebox!',
    },
  },
  'plane-medical-drone': {
    name: 'Mountain Medical Cargo Drone',
    subtitle: 'Autonomous multirotor delivering urgent medicine across valleys',
    discovery: {
      howItWorks: 'Guided by GPS and optical sensors, it flies straight across rivers and ridges regardless of road conditions.',
      realRecord: 'Medical delivery drones have cut rural mountain delivery times from 4 hours by road to 15 minutes by air!',
      didYouKnow: 'An insulated belly pod keeps vaccines and medical samples at exact temperature throughout the flight.',
    },
  },
  'const-crawler-bulldozer': {
    name: 'Heavy Crawler Bulldozer',
    subtitle: 'Tracked earthmover pushing soil and rock with a steel blade',
    discovery: {
      howItWorks: 'Wide steel tracks bite into loose dirt while twin hydraulic cylinders tilt the front blade with precision.',
      realRecord: 'The largest mining bulldozers weigh over 100 tons and push 40 cubic meters of rock in a single pass!',
      didYouKnow: 'Modern bulldozers use dual GPS antennas on the blade to grade sports fields flat within a centimeter.',
    },
  },
  'const-concrete-mixer-rig': {
    name: 'Site Concrete Mixer',
    subtitle: 'All-terrain carrier keeping concrete turning smoothly until pour',
    discovery: {
      howItWorks: 'An internal spiral blade mixes concrete when spinning one way and pushes it out the chute when reversed!',
      realRecord: 'Without continuous slow rotation, tons of wet concrete would harden solid inside in under 90 minutes!',
      didYouKnow: 'Unloading relies on the Archimedes screw principle invented over 2,200 years ago.',
    },
  },
  'const-telescopic-handler': {
    name: 'Telescopic Site Handler',
    subtitle: 'All-terrain boom lifter hoisting roof trusses and bricks',
    discovery: {
      howItWorks: 'Four-wheel steering and an extending boom place pallets directly onto third-story scaffolding.',
      realRecord: 'Rotating telehandlers reach lifting heights of up to 35 meters!',
      didYouKnow: 'Load-moment sensors continuously monitor balance so the boom never extends beyond safe stability.',
    },
  },
  'const-urban-wheeled-excavator': {
    name: '360° Turret Excavator',
    subtitle: 'Hydraulic digger whose cab and boom rotate full circle',
    discovery: {
      howItWorks: 'A toothed slewing ring lets the upper turret rotate endlessly while hydraulic oil passes through a central swivel.',
      realRecord: 'Skilled operators can pick up a soccer ball off a traffic cone using a 20-ton excavator bucket!',
      didYouKnow: 'Operators can press the boom down to lift and reposition the tracks in tight urban spaces.',
    },
  },
  'space-mars-explorer-rover': {
    name: 'Mars Geologist Rover',
    subtitle: 'Six-wheeled mobile lab hunting ancient water clues on Mars',
    discovery: {
      howItWorks: 'Articulated rocker-bogie suspension keeps all 6 wheels planted even while climbing over boulders!',
      realRecord: 'Designed for a 90-day mission, Mars rover Opportunity explored for nearly 15 years and drove 45 km!',
      didYouKnow: 'Because radio signals take 4 to 22 minutes between Earth and Mars, the rover steers around hazards autonomously.',
    },
  },
  'space-gps-constellation-sat': {
    name: 'Galileo Navigation Satellite',
    subtitle: 'Orbiting atomic clock guiding ships, planes, and hikers worldwide',
    discovery: {
      howItWorks: 'Broadcasting ultra-precise time signals lets receivers measure distance to 4+ satellites to pinpoint your spot.',
      realRecord: 'Atomic clocks aboard Galileo satellites lose less than one second in three million years!',
      didYouKnow: 'Navigation satellites apply Einstein’s relativity equations because time ticks slightly faster high in orbit!',
    },
  },
  'space-orbital-supply-launcher': {
    name: 'Two-Stage Orbital Rocket',
    subtitle: 'Modular launcher that drops its empty first stage to reach orbit',
    discovery: {
      howItWorks: 'Once the first stage burns its propellant, it separates so the lighter second stage can sprint to orbital speed!',
      realRecord: 'Staying in orbit around Earth requires reaching 28,000 km/h — nearly 8 kilometers every single second!',
      didYouKnow: 'The streamlined nose fairing shields delicate satellites from supersonic wind until clear of the atmosphere.',
    },
  },
  'space-cargo-resupply-ship': {
    name: 'Automated Orbital Cargo Ship',
    subtitle: 'Robotic spacecraft delivering water, air, and experiments to astronauts',
    discovery: {
      howItWorks: 'Laser rangefinders and tiny thrusters guide the ship to dock gently at centimeters per second.',
      realRecord: 'Millimeter-accurate docking happens while both spacecraft race around Earth together at 28,000 km/h!',
      didYouKnow: 'Every cargo ship also carries fresh apples and oranges eagerly awaited by astronauts in orbit.',
    },
  },

  // Tier 3 Fleet
  'car-tgv-express': {
    name: 'High-Speed Express Train',
    subtitle: 'Aerodynamic electric locomotive cruising past 320 km/h',
    discovery: {
      howItWorks: 'A roof pantograph draws 25,000-volt overhead power to drive high-output traction motors on the bogies.',
      realRecord: 'A specially tuned TGV test train holds the steel-wheel rail speed record at 574.8 km/h!',
      didYouKnow: 'Cruising at 320 km/h, a high-speed train needs roughly 3 kilometers of track to come to a full stop.',
    },
  },
  'car-desert-rally-raid': {
    name: 'Desert Rally-Raid Prototype',
    subtitle: 'Reinforced endurance racer built to cross vast deserts',
    discovery: {
      howItWorks: 'Long-travel suspension and a tubular safety frame soak up high-speed jumps and rocky washes.',
      realRecord: 'Rally-raid crews cover up to 8,000 km of dunes and gravel tracks over two grueling weeks!',
      didYouKnow: 'A roof air snorkel feeds clean, dust-free air into the engine high above swirling desert sand.',
    },
  },
  'car-mobile-crane-truck': {
    name: 'Heavy Recovery Tow Truck',
    subtitle: 'Multi-axle truck equipped with a telescopic recovery boom',
    discovery: {
      howItWorks: 'Hydraulic pumps drive steel cable winches and a heavy underlift boom strong enough to hoist a city bus.',
      realRecord: 'Heavy mountain rotator wreckers tow disabled rigs weighing over 80 tons!',
      didYouKnow: 'High-visibility amber LED bars warn approaching motorists from over a kilometer away.',
    },
  },
  'boat-polar-icebreaker': {
    name: 'Polar Icebreaker Ship',
    subtitle: 'Spoon-bow vessel opening safe sea lanes through frozen pack ice',
    discovery: {
      howItWorks: 'Its sloped rounded bow slides up onto thick sea ice and cracks it downward under the ship’s immense weight!',
      realRecord: 'Polar icebreakers advance steadily through sea ice nearly 3 meters thick!',
      didYouKnow: 'Hull air-bubbler jets blow curtains of compressed air underwater to reduce ice friction along the sides.',
    },
  },
  'boat-deep-nautilus': {
    name: 'Deep-Sea Research Submarine',
    subtitle: 'Teardrop-hulled submersible built to explore ocean trenches',
    discovery: {
      howItWorks: 'A thick cylindrical pressure hull resists crushing deep water while stern dive planes control pitch.',
      realRecord: 'At 4,000 meters depth, every square centimeter of hull bears 400 kilograms of water pressure!',
      didYouKnow: 'Radio waves fade quickly underwater, so submarines map the seabed using sound waves (sonar).',
    },
  },
  'boat-hydrofoil-racer': {
    name: 'Foiling Racing Catamaran',
    subtitle: 'High-tech multihull that flies above the waves on hydrofoils',
    discovery: {
      howItWorks: 'Underwater carbon hydrofoils lift both hulls completely out of the water once speed builds.',
      realRecord: 'America’s Cup foiling yachts sail up to 3 times faster than the true speed of the wind!',
      didYouKnow: 'Lifting the hulls clear of the water slashes hydrodynamic drag by over 60%.',
    },
  },
  'plane-passenger-airliner': {
    name: 'Long-Range Jet Airliner',
    subtitle: 'Swept-wing twin-jet carrying travelers across continents',
    discovery: {
      howItWorks: 'High-bypass turbofan engines accelerate huge masses of air through front fans to cruise efficiently at 10 km altitude.',
      realRecord: 'The longest nonstop commercial flights span over 15,300 km in nearly 18 hours!',
      didYouKnow: 'Curved wingtip winglets tame air vortices and save up to 5% fuel on every flight.',
    },
  },
  'plane-solar-glider': {
    name: 'Round-the-World Solar Plane',
    subtitle: 'Ultra-wide wingspan aircraft powered day and night by sunlight',
    discovery: {
      howItWorks: 'Solar cells covering giant wings power four electric propellers by day while charging batteries to fly all night.',
      realRecord: 'Solar Impulse 2 flew 42,000 km all the way around Earth without a single drop of fuel!',
      didYouKnow: 'With the wingspan of a jumbo jet, a carbon-fiber solar plane weighs no more than a family SUV.',
    },
  },
  'plane-forestry-drone': {
    name: 'Reforestation Seeding Drone',
    subtitle: 'Eco-multirotor planting biodegradable tree-seed pods on hillsides',
    discovery: {
      howItWorks: 'After 3D-mapping terrain by laser, it drops nutrient-rich biodegradable seed pods onto ideal soil spots.',
      realRecord: 'A team of forestry drones can plant up to 40,000 tree seed pods in a single day on steep slopes!',
      didYouKnow: 'Each pod’s nutrient shell protects the sprouting seed and holds morning dew moisture.',
    },
  },
  'const-combine-harvester': {
    name: 'Giant Combine Harvester',
    subtitle: 'Mobile farm factory that reaps, threshes, and cleans grain in one pass',
    discovery: {
      howItWorks: 'The front header cuts wheat stalks, a spinning drum separates kernels, and air sieves blow away light chaff!',
      realRecord: 'One modern combine harvests enough wheat in a single hour to bake over 70,000 loaves of bread!',
      didYouKnow: 'It gets its name “combine” because it combines three historic jobs — reaping, threshing, and winnowing.',
    },
  },
  'const-demolition-long-reach': {
    name: 'Long-Reach Heavy Excavator',
    subtitle: 'Counterweighted digger built for deep earthworks and high reach',
    discovery: {
      howItWorks: 'Longer booms multiply leverage, so a massive cast-iron rear counterweight and wide tracks keep it rock-solid.',
      realRecord: 'High-reach excavators dismantle 15-to-20-story structures piece by piece from ground level for recycling!',
      didYouKnow: 'Over 90% of concrete and steel sorted on modern engineering sites is crushed and reused.',
    },
  },
  'const-port-container-reach': {
    name: 'Port Container Reach Stacker',
    subtitle: 'Quayside giant lifting 40-ton shipping containers five high',
    discovery: {
      howItWorks: 'An ultra-rigid mast and dual-tire front axle lift loaded steel containers and stack them neatly along the dock.',
      realRecord: 'A port reach stacker hoists 45 tons — equal to 30 family cars combined — in seconds!',
      didYouKnow: 'Four rotating corner pins called twist-locks secure any shipping container with a quarter turn.',
    },
  },
  'const-alpine-snow-groomer': {
    name: 'Alpine Slope Snow Groomer',
    subtitle: 'Ultra-wide tracked machine sculpting snow on steep mountain runs',
    discovery: {
      howItWorks: 'Extra-wide aluminum-and-rubber tracks exert less ground pressure per square centimeter than a person’s boot!',
      realRecord: 'Mountain snow groomers climb 45-degree (100% grade) icy slopes where walking upright is nearly impossible!',
      didYouKnow: 'Corduroy snow grooves reflect morning sunlight so alpine snowpack lasts longer.',
    },
  },
  'space-deep-space-telescope': {
    name: 'Orbital Space Telescope',
    subtitle: 'Space observatory imaging distant galaxies above Earth’s clouds',
    discovery: {
      howItWorks: 'Orbiting above atmospheric blur, it aims with pinpoint accuracy using internal spinning reaction wheels — zero thruster exhaust!',
      realRecord: 'Hubble locks onto distant galaxies with the precision of holding a laser beam on a coin 300 km away!',
      didYouKnow: 'Because starlight takes millions of years to cross space, space telescopes look back into cosmic history.',
    },
  },
  'space-perseverance-lab-rover': {
    name: 'Astrobiology Lab Rover',
    subtitle: 'Car-sized planetary robot zapping rocks with a spectrometer laser',
    discovery: {
      howItWorks: 'Its mast laser vaporizes a pinpoint of rock up to 7 meters away and reads the spark colors to identify minerals!',
      realRecord: 'Lowered gently onto Mars by a rocket-powered Sky Crane, Perseverance weighs over one metric ton!',
      didYouKnow: 'An onboard experiment produced breathable oxygen directly from Martian atmospheric carbon dioxide for the first time.',
    },
  },
  'space-heavy-booster-rocket': {
    name: 'Heavy Twin-Booster Rocket',
    subtitle: 'Giant launch vehicle assisted by two side boosters at liftoff',
    discovery: {
      howItWorks: 'At liftoff when fuel tanks are heaviest, twin side boosters supply up to 80% of thrust before separating high up.',
      realRecord: 'A heavy-lift rocket generates liftoff power equivalent to several city power plants combined!',
      didYouKnow: 'Torrents of water flooded under the launchpad absorb acoustic shockwaves that could shake the rocket.',
    },
  },
  'space-orbital-research-station': {
    name: 'Orbital Science Spacecraft',
    subtitle: 'Crewed orbital lab built for microgravity research',
    discovery: {
      howItWorks: 'Moving sideways at 28,000 km/h, the craft falls continuously around Earth’s curve so everything floats weightlessly!',
      realRecord: 'Orbiting at 400 km altitude, astronauts circle Earth every 90 minutes and see 16 sunrises every day!',
      didYouKnow: 'In zero gravity, a candle flame forms a tiny round blue sphere instead of a tall yellow teardrop.',
    },
  },

  // Tier 4 Fleet
  'car-le-mans-proto': {
    name: '24H Endurance Hypercar',
    subtitle: 'Enclosed hybrid race prototype engineered to race day and night',
    discovery: {
      howItWorks: 'Pairs a rear engine with a front electric motor-generator harvesting braking energy at every hairpin.',
      realRecord: 'At the 24 Hours of Le Mans, prototypes cover over 5,000 km in a single day averaging above 220 km/h!',
      didYouKnow: 'A dorsal shark-fin stabilizer prevents high-speed yaw slides through sweeping corners.',
    },
  },
  'car-heritage-steam-loco': {
    name: 'Classic Express Steam Locomotive',
    subtitle: 'Iconic rail machine with a cylindrical boiler and driving rods',
    discovery: {
      howItWorks: 'Water heated inside the fire-tube boiler becomes high-pressure steam pushing pistons linked to giant steel wheels.',
      realRecord: 'In 1938, British steam locomotive Mallard set the all-time steam speed record at 202.6 km/h!',
      didYouKnow: 'The rhythmic “chug-chug” sound is steam puffing up the smokestack after every piston stroke.',
    },
  },
  'car-hydrogen-semi': {
    name: 'Hydrogen Fuel-Cell Semi Truck',
    subtitle: 'Long-haul heavy truck whose only exhaust is pure water vapor',
    discovery: {
      howItWorks: 'A fuel cell combines stored hydrogen with air oxygen to generate electricity for the motors plus pure water.',
      realRecord: 'Hydrogen semis refuel in 15 minutes and haul 40-ton loads up to 800 km on a single fill!',
      didYouKnow: 'Hydrogen tanks behind the cab are wound from ultra-strong aerospace carbon fiber.',
    },
  },
  'car-solar-cruiser-gt': {
    name: 'Teardrop Aero Eco-GT',
    subtitle: 'Ultra-low-drag electric grand tourer sculpted by wind tunnels',
    discovery: {
      howItWorks: 'Every body curve and flat undertray guides air cleanly without wake turbulence to maximize range.',
      realRecord: 'Ultra-aerodynamic electric prototypes exceed 1,000 km on a single battery charge!',
      didYouKnow: 'Above 90 km/h, over half of a car’s energy goes solely into pushing air out of the way.',
    },
  },
  'boat-container-giant': {
    name: 'Transoceanic Container Ship',
    subtitle: 'Ocean giant carrying thousands of standardized steel boxes',
    discovery: {
      howItWorks: 'Goods travel inside uniform steel boxes stacked like building blocks and locked together with twist-locks.',
      realRecord: 'Ultra-large container vessels stretch 400 meters — longer than the Eiffel Tower is tall — carrying 24,000 boxes!',
      didYouKnow: 'Standardized containers invented in 1956 move seamlessly from ship to train to truck in minutes.',
    },
  },
  'boat-rescue-submarine': {
    name: 'Deep Submergence Rescue Sub',
    subtitle: 'Specialist submersible engineered for underwater docking',
    discovery: {
      howItWorks: 'Vectored thrusters and a bottom transfer skirt let it mate watertight in deep currents.',
      realRecord: 'Air-transportable by cargo plane, a rescue sub can reach any ocean worldwide within 24 hours!',
      didYouKnow: 'Acoustic imaging cameras let pilots see structures clearly even in murky pitch-dark water.',
    },
  },
  'boat-solar-expedition-cat': {
    name: 'Planetary Solar Catamaran',
    subtitle: 'Wide-deck twin-hull ship covered in solar panels — zero fuel needed',
    discovery: {
      howItWorks: 'Its wide bridge deck supports hundreds of solar cells powering twin silent electric motors day and night.',
      realRecord: 'MS Tûranor PlanetSolar completed the first 60,000 km solar-powered voyage around the world!',
      didYouKnow: 'Vibration-free silent propulsion makes solar catamarans ideal for recording whale songs.',
    },
  },
  'boat-clipper-three-mast': {
    name: 'Tall Ocean Clipper Ship',
    subtitle: 'Sleek blue-water sailing vessel built to slice ocean swells',
    discovery: {
      howItWorks: 'A slender long hull paired with tall sail area achieves high hull speeds in steady trade winds.',
      realRecord: 'Historic clipper ships raced from Australia to Europe in under 70 days powered purely by wind!',
      didYouKnow: 'Naval academies worldwide still train cadets aboard tall ships to teach teamwork and celestial navigation.',
    },
  },
  'plane-supersonic-delta': {
    name: 'Supersonic Delta-Wing Jet',
    subtitle: 'Triangular-wing aircraft engineered to outrun the speed of sound',
    discovery: {
      howItWorks: 'A sleek Greek-Delta (Δ) wing stays inside the supersonic shock cone while generating vortex lift on landing.',
      realRecord: 'Concorde crossed the Atlantic at Mach 2 (over 2,150 km/h) — twice the speed of sound!',
      didYouKnow: 'Air friction at Mach 2 warmed Concorde’s aluminum skin enough to stretch the cabin 20 cm longer in flight!',
    },
  },
  'plane-heavy-cargo-lifter': {
    name: 'Humanitarian Heavy Airlifter',
    subtitle: 'High-wing transport built to deliver relief cargo to rough airstrips',
    discovery: {
      howItWorks: 'A high-mounted wing keeps engines clear of gravel while creating a flat walk-in rear cargo ramp.',
      realRecord: 'Heavy airlifters carry over 20 tons of food, water purifiers, and rescue vehicles inside their hold!',
      didYouKnow: 'Multi-wheel bogie landing gear spreads weight to land safely on dirt, sand, or glacial ice.',
    },
  },
  'plane-tiltrotor-vtol': {
    name: 'Electric eVTOL Air Shuttle',
    subtitle: 'Zero-emission aircraft that takes off vertically and cruises on wings',
    discovery: {
      howItWorks: 'Distributed electric rotors provide quiet helicopter-like liftoff before transitioning to efficient wing-borne flight.',
      realRecord: 'Modern eVTOL prototypes cruise up to 100 times quieter than conventional helicopters!',
      didYouKnow: 'Spreading lift across multiple independent electric motors provides built-in safety redundancy.',
    },
  },
  'plane-polar-ski-biplane': {
    name: 'Arctic Ski Expedition Plane',
    subtitle: 'Sub-zero aircraft supplying remote polar research stations',
    discovery: {
      howItWorks: 'Streamlined ski-floats and engine preheaters allow landings on glaciers and snowfields at -40 °C.',
      realRecord: 'Polar ski-planes resupply the South Pole station perched atop a 2,835-meter ice plateau!',
      didYouKnow: 'High-contrast coral-red paint makes polar aircraft unmistakable against endless white ice.',
    },
  },
  'const-tunnel-miner-excavator': {
    name: 'Giant Mining Shovel Excavator',
    subtitle: 'Colossal hydraulic shovel filling haul trucks in three bucketfuls',
    discovery: {
      howItWorks: 'Twin powerplants drive high-pressure hydraulic pumps strong enough to scoop boulders the size of a living room.',
      realRecord: 'Ultra-class mining excavators weigh nearly 1,000 tons with 45-cubic-meter buckets!',
      didYouKnow: 'Shipped in dozens of separate loads, they are bolted together piece by piece on site — just like in your workshop!',
    },
  },
  'const-bridge-girder-crane': {
    name: 'Viaduct Bridge Girder Launcher',
    subtitle: 'Precision heavy lifter assembling concrete bridge spans',
    discovery: {
      howItWorks: 'Electronically synchronized hydraulic jacks lift massive concrete beams while keeping them dead level.',
      realRecord: 'Bridge launchers position multi-hundred-ton viaduct segments with millimeter accuracy!',
      didYouKnow: 'Assembling precast segments overhead lets engineers span deep river valleys without disturbing nature below.',
    },
  },
  'const-precision-laser-dozer': {
    name: 'Laser-Guided Hybrid Grader',
    subtitle: 'Precision earthmover leveling airport runways and high-speed railbeds',
    discovery: {
      howItWorks: 'Dual blade masts read a spinning site laser beam and adjust hydraulics 20 times per second for mirror-flat ground.',
      realRecord: 'High-speed railbeds and runways require surface flatness within just a few millimeters over 10 meters!',
      didYouKnow: 'Diesel-electric drive cuts fuel use by 25% while delivering smooth stepless pushing torque.',
    },
  },
  'const-autonomous-agro-harvester': {
    name: 'RTK-GPS Robotic Harvester',
    subtitle: 'High-tech combine guided to centimeter accuracy across fields',
    discovery: {
      howItWorks: 'Real-Time Kinematic GPS steers exact parallel passes without overlapping a single row.',
      realRecord: 'A 12-meter cutterbar harvests a swath as wide as a four-lane highway in one pass!',
      didYouKnow: 'Optical grain sensors measure moisture and protein live as kernels pour into the hopper.',
    },
  },
  'space-interplanetary-probe': {
    name: 'Jupiter Icy-Moons Probe',
    subtitle: 'Wide-winged robotic explorer bound for giant outer planets',
    discovery: {
      howItWorks: 'Because sunlight near Jupiter is 25 times fainter than at Earth, huge ultra-efficient solar wings unfold.',
      realRecord: 'Deep-space probes travel billions of kilometers using planetary gravity-assist slingshots for free speed!',
      didYouKnow: 'Its high-gain dish aims back at Earth with fraction-of-a-degree precision across the Solar System.',
    },
  },
  'space-lunar-pressurized-cruiser': {
    name: 'Pressurized Lunar Cruiser',
    subtitle: 'Mobile moon habitat letting astronauts explore for weeks',
    discovery: {
      howItWorks: 'Astronauts drive and live inside in shirt-sleeves with breathable air, stepping out through a rear airlock for rock samples.',
      realRecord: 'Pressurized lunar rovers expand human exploration range past 100 kilometers from base camp!',
      didYouKnow: 'Tilting solar arrays catch low-angle sunlight along lunar south pole crater rims.',
    },
  },
  'space-reusable-orbital-rocket': {
    name: 'Reusable Orbital Booster',
    subtitle: 'Next-gen rocket whose first stage flies back and lands upright',
    discovery: {
      howItWorks: 'After stage separation, grid fins steer the booster down through the air before engines relight for a vertical touchdown!',
      realRecord: 'Individual reusable rocket boosters have launched and landed upright over 20 times on ocean drone ships!',
      didYouKnow: 'Landing a 14-story rocket upright on a floating barge takes control precision like balancing a broomstick on your palm.',
    },
  },
  'space-winged-shuttle-expedition': {
    name: 'Payload-Bay Space Orbiter',
    subtitle: 'Winged rocketship equipped with cargo doors and a robotic arm',
    discovery: {
      howItWorks: 'In orbit, giant cargo doors swing wide both to deploy satellites and to radiate cabin heat into space.',
      realRecord: 'Space shuttles flew 135 missions, assembling the International Space Station and servicing Hubble in orbit!',
      didYouKnow: 'The 15-meter Canadarm couldn’t lift its own weight on Earth yet moved 30-ton modules effortlessly in zero-G!',
    },
  },

  // Tier 5 Master Fleet
  'car-maglev-shinkansen': {
    name: 'Superconducting Maglev Train',
    subtitle: 'Futuristic train floating centimeters above its guideway with zero friction',
    discovery: {
      howItWorks: 'Superconducting magnets levitate and propel the train contactless along the guideway — only air slows it down!',
      realRecord: 'Japan’s L0 Series Maglev set the all-time world railway speed record at 603 km/h!',
      didYouKnow: 'Its elongated nose copies a kingfisher’s beak to prevent sonic booms when entering tunnels at 500+ km/h.',
    },
  },
  'car-supersonic-land-record': {
    name: 'Supersonic Land Speed Arrow',
    subtitle: 'Experimental jet car engineered to break the sound barrier on dry lakebeds',
    discovery: {
      howItWorks: 'Above 1,000 km/h rubber tires would shred, so it rolls on solid CNC-machined aerospace aluminum wheels!',
      realRecord: 'ThrustSSC holds the world land speed record at 1,227.985 km/h (Mach 1.02) across the Black Rock Desert!',
      didYouKnow: 'Its solid alloy wheels spin at over 10,000 RPM and require twin braking parachutes to slow down.',
    },
  },
  'car-mobile-science-convoy': {
    name: 'Mobile Seismic Lab Truck',
    subtitle: 'Geoscience truck mapping rock layers kilometers beneath our feet',
    discovery: {
      howItWorks: 'A Belly shaker pad sends gentle acoustic waves underground while hundreds of geophones listen to subterranean echoes.',
      realRecord: 'Seismic imaging maps geothermal reservoirs up to 5 kilometers underground without drilling a hole!',
      didYouKnow: 'It works on the exact same acoustic-echo physics as medical ultrasound — scaled up to entire mountains.',
    },
  },
  'car-autonomous-cyber-shuttle': {
    name: '360° Lidar Research Vehicle',
    subtitle: 'Autonomous engineering car packed with laser scanners and telemetry',
    discovery: {
      howItWorks: 'A roof Lidar turret fires millions of eye-safe laser pulses per second to build a live 3D point cloud of the street.',
      realRecord: 'Onboard sensors measure the distance and speed of pedestrians or cyclists over 200 meters away in milliseconds!',
      didYouKnow: 'LIDAR stands for Light Detection And Ranging — radar using pulses of light instead of radio waves.',
    },
  },
  'boat-wind-cargo-wingsail': {
    name: 'Wingsail Hybrid Cargo Ship',
    subtitle: 'Next-gen freighter propelled by computer-trimmed rigid wingsails',
    discovery: {
      howItWorks: 'Weather-routing computers automatically angle giant rigid wingsails to catch optimal ocean winds day and night.',
      realRecord: 'Transatlantic wingsail cargo vessels cut fuel burn and emissions by up to 80%!',
      didYouKnow: 'Telescoping masts fold down automatically so the ship clears harbor bridges with ease.',
    },
  },
  'boat-abyssal-hadal-sub': {
    name: 'Hadal Trench Bathyscaphe',
    subtitle: 'Titanium-sphere submersible built for the deepest point on Earth',
    discovery: {
      howItWorks: 'Explorers sit inside a 9-cm-thick forged titanium sphere that distributes crushing ocean pressure evenly.',
      realRecord: 'At Challenger Deep (10,928 meters), water pressure exceeds 1,100 times sea-level atmospheric pressure!',
      didYouKnow: 'Even nearly 11 km underwater in total darkness, scientists discovered thriving amphipods and snailfish!',
    },
  },
  'boat-offshore-wind-vessel': {
    name: 'Offshore Wind Turbine Vessel',
    subtitle: 'Dynamic-positioning engineering ship assembling giant turbines at sea',
    discovery: {
      howItWorks: 'GPS-controlled 360° thrusters hold the ship stationary within centimeters against waves and wind.',
      realRecord: 'These ships erect 260-meter-tall offshore wind turbines with individual blades over 100 meters long!',
      didYouKnow: 'Just one single rotation of a giant offshore wind turbine powers an average home for two full days.',
    },
  },
  'boat-wave-piercer-trimaran': {
    name: 'High-Speed Wave-Piercing Ship',
    subtitle: 'Aluminum multihull slicing straight through swells instead ofslamming',
    discovery: {
      howItWorks: 'Razor-slim wave-piercing bows slice cleanly through wave crests rather than pitching up and down.',
      realRecord: 'High-speed aluminum wave-piercers reach 58 knots (107 km/h) while carrying 1,000 passengers and 150 cars!',
      didYouKnow: 'Its waterjets pump enough water every minute to fill an Olympic swimming pool!',
    },
  },
  'plane-stratospheric-research-jet': {
    name: 'Stratospheric Climate Lab Jet',
    subtitle: 'High-altitude twin-jet studying the ozone layer at the edge of space',
    discovery: {
      howItWorks: 'Long glider-like wings and a specially pressurized cockpit let it cruise twice as high as commercial airliners.',
      realRecord: 'Stratospheric research aircraft climb past 21,000 meters where the daytime sky already turns deep black!',
      didYouKnow: 'Wing collectors even catch microscopic comet dust grains drifting gently down from space.',
    },
  },
  'plane-flying-wing-eco-jet': {
    name: 'Blended-Wing-Body Eco Jet',
    subtitle: 'Futuristic aircraft where the entire sculpted body generates lift',
    discovery: {
      howItWorks: 'Instead of a tube with separate wings, the entire wide body forms a lifting airfoil with ultra-low drag.',
      realRecord: 'Blended-wing-body airframes cut aerodynamic fuel burn by up to 30% compared with tube-and-wing jets!',
      didYouKnow: 'Mounting engines atop the rear upper deck also shields towns below from engine noise.',
    },
  },
  'plane-heavy-skycrane-rotor': {
    name: 'Multi-Rotor Precision Skycrane',
    subtitle: 'Heavy aerial crane placing mountain towers and bridge spans',
    discovery: {
      howItWorks: 'Differential GPS and laser load-damping hold suspended structures within 5 cm while crews bolt them down.',
      realRecord: 'Heavy skycrane rotorcraft hoist 10-to-20-ton external loads straight onto mountain peaks!',
      didYouKnow: 'Airlifting mountain towers avoids bulldozing temporary construction roads through forests.',
    },
  },
  'plane-hybrid-transatlantic-prop': {
    name: 'Distributed Hybrid-Electric Testbed',
    subtitle: 'Flying laboratory pioneering clean distributed electric propulsion',
    discovery: {
      howItWorks: 'Multiple electric propulsors distributed along the wing leading edge blow fast air directly across the airfoil.',
      realRecord: 'Distributed wing blowing more than doubles lift coefficient during short takeoffs!',
      didYouKnow: 'Supercooled lightweight power cables carry megawatts of clean electricity inside the wing.',
    },
  },
  'const-subsea-trencher-crawler': {
    name: 'Subsea Fiber-Optic Trencher',
    subtitle: 'Remotely operated seabed crawler burying transoceanic internet cables',
    discovery: {
      howItWorks: 'Controlled from a surface ship via an umbilical cable, it drives along the seabed to trench and protect fiber-optic lines.',
      realRecord: 'Over 98% of global intercontinental internet traffic travels through 1.4 million km of undersea fiber cables!',
      didYouKnow: 'Oil-filled pressure-compensated hydraulics let its arms work smoothly hundreds of meters underwater.',
    },
  },
  'const-mega-crawler-transporter': {
    name: 'Spaceport Mega Crawler-Transporter',
    subtitle: 'Largest self-propelled land vehicle carrying upright rockets to the launchpad',
    discovery: {
      howItWorks: 'Laser-leveled hydraulic jacks keep the top deck flat within a tenth of a degree while climbing the pad ramp!',
      realRecord: 'Kennedy Space Center’s Crawler weighs nearly 3,000 tons and carries an 8,000-ton Moon rocket upright!',
      didYouKnow: 'Each of the 456 cast-steel treads on its eight caterpillar tracks weighs nearly one ton!',
    },
  },
  'const-modular-wind-tower-crane': {
    name: 'Mega Telescopic Wind-Tower Crane',
    subtitle: 'Modular heavy mobile crane hoisting 150-ton nacelles past 150 meters',
    discovery: {
      howItWorks: 'Star-pattern outriggers and stacked counterweight slabs balance the towering multi-stage telescopic boom.',
      realRecord: 'The largest telescopic mobile cranes lift up to 1,200 tons and reach taller than cathedral spires!',
      didYouKnow: 'A boom-tip anemometer monitors wind gusts live to keep giant turbine lifts rock-steady.',
    },
  },
  'const-solar-autonomous-agri-titan': {
    name: 'Multi-Sensor Eco-Agri Combine',
    subtitle: 'Next-gen autonomous farm machine pairing spectral cameras with clean power',
    discovery: {
      howItWorks: 'Multispectral cameras inspect every single plant millisecond by millisecond to nurture crops with zero waste.',
      realRecord: 'Precision optical farming cuts water and nutrient consumption by up to 80%!',
      didYouKnow: 'Ultra-low-pressure flotation tires protect earthworms and healthy soil air pockets.',
    },
  },
  'space-james-webb-observatory': {
    name: 'Deep-Space Infrared Observatory',
    subtitle: 'Golden-mirror space telescope unfolding 1.5 million km from Earth',
    discovery: {
      howItWorks: 'Folded like giant origami inside its launch fairing, it unfolded 18 gold-coated hexagonal mirrors and a tennis-court-sized sunshield!',
      realRecord: 'Its 5-layer sunshield chills instruments to -233 °C to spot light from the very first galaxies after the Big Bang!',
      didYouKnow: 'All the pure gold coating its 6.5-meter mirror is so microscopically thin it weighs under 50 grams total — one golf ball!',
    },
  },
  'space-sample-return-mars-rover': {
    name: 'Deep-Drill Sample Return Rover',
    subtitle: 'Planetary robot drilling 2-meter rock cores sealed in titanium tubes',
    discovery: {
      howItWorks: 'A rotary-percussive drill extracts rock cores 2 meters underground, sealing them inside ultra-clean titanium sample tubes.',
      realRecord: 'Planetary sample tubes are sterilized so strictly that less than a billionth of a gram of Earth dust is permitted!',
      didYouKnow: 'Drilling two meters below Martian dust reaches ancient rock layers shielded from cosmic rays for billions of years.',
    },
  },
  'space-artemis-moon-mega-rocket': {
    name: 'Crewed Lunar Mega-Rocket',
    subtitle: 'Super-heavy exploration rocket propelling astronauts toward the Moon',
    discovery: {
      howItWorks: 'Four hydrogen-oxygen core engines plus twin boosters hurl the upper stage and crew capsule toward the Moon at 40,000 km/h!',
      realRecord: 'Standing over 100 meters tall — taller than the Statue of Liberty — a lunar mega-rocket unleashes ~4,000 tons of liftoff thrust!',
      didYouKnow: 'Atop the capsule sits the Launch Escape Tower, ready to whisk astronauts safely away in milliseconds if needed.',
    },
  },
  'space-international-modular-station': {
    name: 'Modular International Space Station',
    subtitle: 'Engineering marvel assembled piece by piece 400 km above Earth',
    discovery: {
      howItWorks: 'Launched module by module like a giant 3D construction kit, pressurized labs, solar wings, and robotic arms form an orbiting home!',
      realRecord: 'Spanning 109 meters — the size of an entire football field — and weighing 420 tons, the ISS has hosted crews nonstop since 2000!',
      didYouKnow: 'Modules built across different continents that never touched on Earth docked together to millimeter perfection in orbit!',
    },
  },
};

export function localizeBlueprintToEnglish(blueprint: VehicleBlueprint): VehicleBlueprint {
  const tierInfo = ENGLISH_TIER_META[blueprint.tier] ?? ENGLISH_TIER_META[DifficultyTier.DISCOVERY];
  const meta = ENGLISH_BLUEPRINT_META[blueprint.id];

  return {
    ...blueprint,
    name: blueprint.nameEn ?? meta?.name ?? blueprint.name,
    subtitle: blueprint.subtitleEn ?? meta?.subtitle ?? blueprint.subtitle,
    tierLabel: blueprint.tierLabelEn ?? tierInfo.tierLabel,
    ageNote: blueprint.ageNoteEn ?? tierInfo.ageNote(blueprint.parts.length),
    discovery: blueprint.discoveryEn ?? meta?.discovery ?? blueprint.discovery,
    parts: blueprint.parts.map((part) => {
      if (part.nameEn && part.roleHintEn) {
        return {
          ...part,
          name: part.nameEn,
          roleHint: part.roleHintEn,
        };
      }
      const dict = ENGLISH_PART_DICTIONARY[part.name.trim()];
      if (!dict) return part;
      return {
        ...part,
        name: dict.name,
        roleHint: dict.roleHint,
      };
    }),
  };
}
