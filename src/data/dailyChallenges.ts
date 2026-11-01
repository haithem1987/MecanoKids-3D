import {
  DailyChallengeState,
  DifficultyTier,
  DiscoveryFacts,
  LanguageCode,
  VehicleBlueprint,
  VehicleCategory,
} from '../types/game';
import { ArchetypeId, BlueprintSeed, buildBlueprintFromSeed } from './catalogTemplates';

export interface RareCollectibleSpec {
  id: string;
  targetPartId: string;
  category: VehicleCategory;
  alloyBadge: Record<LanguageCode, string>;
  name: Record<LanguageCode, string>;
  roleHint: Record<LanguageCode, string>;
  vehicleOrigin: Record<LanguageCode, string>;
}

interface DailyBonusTemplate {
  templateId: string;
  archetype: ArchetypeId;
  category: VehicleCategory;
  tier: DifficultyTier;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  lengthScale: number;
  widthScale: number;
  rareSpec: RareCollectibleSpec;
  title: Record<LanguageCode, string>;
  subtitle: Record<LanguageCode, string>;
  discovery: Record<LanguageCode, DiscoveryFacts>;
}

export const RARE_COLLECTIBLES_CATALOG: RareCollectibleSpec[] = [
  {
    id: 'rare-solar-hyper-core',
    targetPartId: 'rear-wing',
    category: VehicleCategory.CAR,
    alloyBadge: {
      fr: 'Alliage Or 24K & Carbone',
      en: '24K Gold & Carbon Alloy',
      ar: 'سبيكة الذهب 24 قيراط والكربون',
    },
    name: {
      fr: 'Aileron Solaire Cristallin Or 24K',
      en: '24K Gold Crystalline Solar Wing',
      ar: 'جناح الطاقة الشمسية المذهّب 24 قيراط',
    },
    roleHint: {
      fr: 'Pièce rare du jour : capte la lumière rasante tout en plaquant le prototype au sol !',
      en: 'Rare part of the day: harvests low-angle sunlight while generating racing downforce!',
      ar: 'قطعة اليوم النادرة: تلتقط أشعة الشمس وتولّد قوة ضغط هوائي فائقة على المضمار!',
    },
    vehicleOrigin: {
      fr: 'Prototype Solaire Édition Or',
      en: 'Gold Edition Solar Prototype',
      ar: 'النموذج الشمسي الذهبي الخاص',
    },
  },
  {
    id: 'rare-titanium-silent-prop',
    targetPartId: 'propulsor',
    category: VehicleCategory.BOAT,
    alloyBadge: {
      fr: 'Titane Forgé Abyssal',
      en: 'Forged Abyssal Titanium',
      ar: 'تيتانيوم الأعماق المطروق',
    },
    name: {
      fr: 'Propulseur Furtif Or-Titane à 7 Pales',
      en: '7-Blade Gold-Titanium Silent Propulsor',
      ar: 'دافع الأعماق الصامت من الذهب والتيتانيوم',
    },
    roleHint: {
      fr: 'Pièce rare du jour : élimine toute bulle sonore pour observer les baleines de près !',
      en: 'Rare part of the day: eliminates acoustic bubbles so whales can be studied up close!',
      ar: 'قطعة اليوم النادرة: يلغي الفقاعات الصوتية تماماً لدراسة الكائنات البحرية بهدوء!',
    },
    vehicleOrigin: {
      fr: 'Bathyscaphe Royal des Abysses',
      en: 'Royal Abyssal Submersible',
      ar: 'غواصة الأعماق الملكية الخاصة',
    },
  },
  {
    id: 'rare-cobalt-twin-turbines',
    targetPartId: 'jet-engines',
    category: VehicleCategory.PLANE,
    alloyBadge: {
      fr: 'Superalliage Or & Cobalt',
      en: 'Gold & Cobalt Superalloy',
      ar: 'سبيكة الذهب والكوبالت الفائقة',
    },
    name: {
      fr: 'Biréacteur Stratosphérique Couronne d’Or',
      en: 'Gold-Crown Stratospheric Twin-Turbofan',
      ar: 'المحرك النفاث المزدوج ذو التاج الذهبي',
    },
    roleHint: {
      fr: 'Pièce rare du jour : aubes monocristallines résistant à des températures extrêmes !',
      en: 'Rare part of the day: single-crystal turbine blades resisting extreme temperatures!',
      ar: 'قطعة اليوم النادرة: شفرات توربينية بلورية تتحمل أعلى درجات الحرارة في الستراتوسفير!',
    },
    vehicleOrigin: {
      fr: 'Jet Stratosphérique Étoile d’Or',
      en: 'Gold Star Stratospheric Jet',
      ar: 'طائرة النجمة الذهبية الستراتوسفيرية',
    },
  },
  {
    id: 'rare-gold-hydraulic-arm',
    targetPartId: 'boom-bucket',
    category: VehicleCategory.CONSTRUCTION,
    alloyBadge: {
      fr: 'Acier Trempé & Nitrure d’Or',
      en: 'Hardened Gold-Nitride Steel',
      ar: 'فولاذ مقسّى بطلاء نيتريد الذهب',
    },
    name: {
      fr: 'Bras Hydraulique & Godet Diamant-Or',
      en: 'Gold-Nitride Hydraulic Boom & Bucket',
      ar: 'الذراع الهيدروليكي والدلو المذهّب المقوّى',
    },
    roleHint: {
      fr: 'Pièce rare du jour : revêtement ultra-résistant anti-usure pour creuser le granit pur !',
      en: 'Rare part of the day: ultra-hard anti-wear coating engineered to excavate solid granite!',
      ar: 'قطعة اليوم النادرة: طبقة فائقة الصلابة مقاومة للتآكل لحفر أصعب الصخور الجرانيتية!',
    },
    vehicleOrigin: {
      fr: 'Excavatrice Impériale de Précision',
      en: 'Imperial Precision Excavator',
      ar: 'حفّارة الدقة الذهبية الخاصة',
    },
  },
  {
    id: 'rare-mars-gold-laser-mast',
    targetPartId: 'mast-cam',
    category: VehicleCategory.SPACE,
    alloyBadge: {
      fr: 'Or Spatial Réflecteur Pur',
      en: 'Pure Spaceflight Gold Foil',
      ar: 'الذهب الفضائي العاكس النقي',
    },
    name: {
      fr: 'Mât Spectromètre Laser Or Pur',
      en: 'Pure-Gold Laser Spectrometer Mast',
      ar: 'عمود الليزر الطيفي المطلي بالذهب الفضائي',
    },
    roleHint: {
      fr: 'Pièce rare du jour : analyse instantanément les cristaux et glaces planétaires !',
      en: 'Rare part of the day: identifies planetary crystals and water ice in a single flash!',
      ar: 'قطعة اليوم النادرة: يحلل البلورات والجليد الكوكبي بنبضة ضوئية واحدة فائقة الدقة!',
    },
    vehicleOrigin: {
      fr: 'Rover Planétaire Aurore Dorée',
      en: 'Golden Aurora Planetary Rover',
      ar: 'عربة الشفق الذهبي الكوكبية',
    },
  },
  {
    id: 'rare-maglev-super-pantograph',
    targetPartId: 'pantograph',
    category: VehicleCategory.CAR,
    alloyBadge: {
      fr: 'Cuivre-Or Supraconducteur',
      en: 'Gold-Clad Superconductor',
      ar: 'موصل فائق مطلي بالذهب',
    },
    name: {
      fr: 'Capteur Énergétique Supraconducteur Or',
      en: 'Golden Superconducting Power Collector',
      ar: 'لاقط الطاقة فائق التوصيل المذهّب',
    },
    roleHint: {
      fr: 'Pièce rare du jour : capte l’énergie sans étincelle ni perte à plus de 550 km/h !',
      en: 'Rare part of the day: transfers zero-loss power cleanly above 550 km/h!',
      ar: 'قطعة اليوم النادرة: ينقل الطاقة الكهربائية بلا أي فقدان عند سرعات تفوق 550 كم/س!',
    },
    vehicleOrigin: {
      fr: 'Train Express Émeraude & Or',
      en: 'Emerald & Gold Maglev Express',
      ar: 'قطار الزمرد والذهب الفائق',
    },
  },
  {
    id: 'rare-stellar-gold-fairing',
    targetPartId: 'fairing-cone',
    category: VehicleCategory.SPACE,
    alloyBadge: {
      fr: 'Composite Céramique & Or',
      en: 'Gold-Ceramic Space Composite',
      ar: 'مركّب السيراميك والذهب الفضائي',
    },
    name: {
      fr: 'Coiffe Orbitale Miroir d’Or',
      en: 'Gold-Mirror Orbital Payload Fairing',
      ar: 'الغطاء المداري ذو المرآة الذهبية',
    },
    roleHint: {
      fr: 'Pièce rare du jour : réfléchit 99 % du rayonnement thermique solaire en orbite !',
      en: 'Rare part of the day: reflects 99% of intense solar thermal radiation in orbit!',
      ar: 'قطعة اليوم النادرة: يعكس 99% من الإشعاع الحراري الشمسي لحماية الحمولة المدارية!',
    },
    vehicleOrigin: {
      fr: 'Lanceur Stellaire Zénith',
      en: 'Zenith Stellar Heavy Launcher',
      ar: 'الصاروخ النجمي زينيث الخاص',
    },
  },
];

const DAILY_BONUS_TEMPLATES: DailyBonusTemplate[] = [
  {
    templateId: 'daily-tpl-solar-hyper',
    archetype: 'race_prototype',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#0f172a',
    secondaryColor: '#0284c7',
    accentColor: '#f59e0b',
    lengthScale: 1.06,
    widthScale: 1.04,
    rareSpec: RARE_COLLECTIBLES_CATALOG[0],
    title: {
      fr: 'Prototype Solaire Édition Or',
      en: 'Gold Edition Solar Prototype',
      ar: 'النموذج الشمسي الذهبي الخاص',
    },
    subtitle: {
      fr: 'Véhicule bonus éphémère équipé de l’Aileron Solaire Cristallin Or 24K',
      en: 'Limited daily bonus prototype featuring the 24K Gold Crystalline Solar Wing',
      ar: 'مركبة إضافية يومية مجهزة بجناح الطاقة الشمسية المذهّب 24 قيراط',
    },
    discovery: {
      fr: {
        howItWorks:
          'Ce prototype expérimental associe une carrosserie carbone ultra-fine et un aileron photovoltaïque doré à haut rendement énergétique.',
        realRecord:
          'Les cellules solaires spatiales multi-jonctions à contacts dorés dépassent 40 % de rendement lumineux, soit le double d’un panneau classique !',
        didYouKnow:
          'L’or est utilisé dans les circuits de haute précision car il ne rouille jamais et conduit remarquablement bien le courant.',
      },
      en: {
        howItWorks:
          'This experimental prototype pairs an ultra-sleek carbon body with a high-efficiency gold-contact photovoltaic rear wing.',
        realRecord:
          'Multi-junction space-grade solar cells with gold contacts convert over 40% of sunlight into electricity — double standard panels!',
        didYouKnow:
          'Engineers use ultra-thin gold on precision contacts because gold never corrodes or tarnishes.',
      },
      ar: {
        howItWorks:
          'يجمع هذا النموذج التجريبي بين هيكل كربوني انسيابي وجناح خلفي مزود بخلايا شمسية عالية الكفاءة.',
        realRecord:
          'تتجاوز كفاءة الخلايا الشمسية المتطورة ذات الموصلات الذهبية نسبة 40% في تحويل الضوء إلى كهرباء!',
        didYouKnow:
          'يُستخدم الذهب في الدوائر الهندسية الدقيقة لأنه لا يصدأ أبداً ويوصل الكهرباء بكفاءة ممتازة.',
      },
    },
  },
  {
    templateId: 'daily-tpl-abyssal-sub',
    archetype: 'submarine_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#1e3a8a',
    secondaryColor: '#0f172a',
    accentColor: '#fbbf24',
    lengthScale: 1.06,
    widthScale: 1.05,
    rareSpec: RARE_COLLECTIBLES_CATALOG[1],
    title: {
      fr: 'Bathyscaphe Royal des Abysses',
      en: 'Royal Abyssal Submersible',
      ar: 'غواصة الأعماق الملكية الخاصة',
    },
    subtitle: {
      fr: 'Véhicule bonus du jour doté du Propulseur Furtif Or-Titane à 7 Pales',
      en: 'Daily bonus submersible equipped with the 7-Blade Gold-Titanium Silent Propulsor',
      ar: 'غواصة اليوم الإضافية المزودة بدافع الأعماق الصامت من الذهب والتيتانيوم',
    },
    discovery: {
      fr: {
        howItWorks:
          'La forme courbée de ses pales en alliage spécial empêche la création de bulles de cavitation, rendant la nage du sous-marin totalement silencieuse.',
        realRecord:
          'Le titane est aussi solide que l’acier tout en étant 45 % plus léger et totalement insensible au sel marin pendant des siècles !',
        didYouKnow:
          'Grâce à cette discrétion acoustique, les scientifiques enregistrent les conversations des cachalots à des kilomètres sous la surface.',
      },
      en: {
        howItWorks:
          'Swept multi-blade alloy geometry prevents noisy cavitation bubbles, letting the submersible glide in near-total silence.',
        realRecord:
          'Titanium matches steel in strength while weighing 45% less and resisting seawater corrosion for centuries!',
        didYouKnow:
          'Ultra-quiet propulsion lets marine biologists listen to deep-diving sperm whales kilometers away.',
      },
      ar: {
        howItWorks:
          'يمنع التصميم المنحني للشفرات السبائكية تكوّن الفقاعات المزعجة فتسبح الغواصة في هدوء تام تحت البحر.',
        realRecord:
          'يضاهي التيتانيوم الفولاذ في الصلابة مع وزن أخف بنسبة 45% ومقاومة كاملة لملوحة مياه المحيط!',
        didYouKnow:
          'يتيح هذا الهدوء الفائق للعلماء تسجيل الأصوات الدقيقة للحيتان في أعماق المحيط.',
      },
    },
  },
  {
    templateId: 'daily-tpl-gold-star-jet',
    archetype: 'jet_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#0f172a',
    secondaryColor: '#e2e8f0',
    accentColor: '#fbbf24',
    lengthScale: 1.1,
    widthScale: 1.06,
    rareSpec: RARE_COLLECTIBLES_CATALOG[2],
    title: {
      fr: 'Jet Stratosphérique Étoile d’Or',
      en: 'Gold Star Stratospheric Jet',
      ar: 'طائرة النجمة الذهبية الستراتوسفيرية',
    },
    subtitle: {
      fr: 'Avion bonus temporaire propulsé par le Biréacteur Couronne d’Or',
      en: 'Limited daily jet powered by the Gold-Crown Stratospheric Twin-Turbofan',
      ar: 'طائرة اليوم الخاصة المدعومة بالمحرك النفاث المزدوج ذي التاج الذهبي',
    },
    discovery: {
      fr: {
        howItWorks:
          'Ses turbines haute altitude sont moulées d’un seul cristal métallique sans joint fragile pour tourner à plus de 15 000 tours par minute.',
        realRecord:
          'À l’intérieur d’un réacteur moderne, le gaz dépasse la température de fusion du métal, mais un film d’air frais protège chaque aube !',
        didYouKnow:
          'Un film doré microscopique intégré aux verrières de certains avions réfléchit l’éblouissement solaire intense en haute altitude.',
      },
      en: {
        howItWorks:
          'High-altitude turbine blades are grown as a single metal crystal with zero grain boundaries to spin above 15,000 RPM.',
        realRecord:
          'Gas inside a modern jet core burns hotter than the metal’s melting point — microscopic cooling air holes keep every blade safe!',
        didYouKnow:
          'Microscopic gold films on specialized high-altitude cockpit canopies reflect intense stratospheric glare.',
      },
      ar: {
        howItWorks:
          'تُصنع شفرات التوربين من بلورة معدنية واحدة متصلة لتتحمل الدوران بأكثر من 15 ألف دورة في الدقيقة.',
        realRecord:
          'تعمل قنوات تبريد هوائية دقيقة جداً على حماية شفرات المحرك النفاث من درجات الحرارة الهائلة بالداخل!',
        didYouKnow:
          'تُطلى بعض نوافذ الطائرات عالية الارتفاع بطبقة ذهبية مجهرية شفافة لعكس وهج الشمس القوي.',
      },
    },
  },
  {
    templateId: 'daily-tpl-imperial-excavator',
    archetype: 'excavator_tracked',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#1e293b',
    secondaryColor: '#0284c7',
    accentColor: '#fbbf24',
    lengthScale: 1.06,
    widthScale: 1.06,
    rareSpec: RARE_COLLECTIBLES_CATALOG[3],
    title: {
      fr: 'Excavatrice Impériale de Précision',
      en: 'Imperial Precision Excavator',
      ar: 'حفّارة الدقة الذهبية الخاصة',
    },
    subtitle: {
      fr: 'Engin bonus du jour muni du Bras Hydraulique & Godet Diamant-Or',
      en: 'Daily bonus machine featuring the Gold-Nitride Hydraulic Boom & Bucket',
      ar: 'آلة اليوم الإضافية المجهزة بالذراع الهيدروليكي والدلو المذهّب المقوّى',
    },
    discovery: {
      fr: {
        howItWorks:
          'Le nitrure de titane à l’éclat doré utilisé sur les forets industriels multiplie par 5 la résistance à l’usure contre la roche dure.',
        realRecord:
          'La pression d’huile dans les vérins d’une pelle moderne atteint 350 bars — soit 150 fois la pression d’un pneu de voiture !',
        didYouKnow:
          'La couleur dorée brillante que l’on voit sur les mèches de perceuse professionnelles est exactement ce revêtement céramique ultra-dur.',
      },
      en: {
        howItWorks:
          'Golden titanium-nitride ceramic coating — the same armor used on industrial rock drills — multiplies wear resistance fivefold.',
        realRecord:
          'Hydraulic fluid inside modern excavator rams reaches 350 bar — 150 times the air pressure inside a car tire!',
        didYouKnow:
          'That gleaming gold finish on high-grade drill bits comes from ultra-hard titanium nitride.',
      },
      ar: {
        howItWorks:
          'تمنح طبقة نيتريد التيتانيوم الذهبية المستخدمة في رؤوس الحفر الصناعية مقاومة مضاعفة بخمس مرات ضد الصخور الصلبة.',
        realRecord:
          'يصل ضغط الزيت داخل أسطوانات الحفارة الحديثة إلى 350 بار، أي 150 ضعف ضغط الهواء في إطار السيارة!',
        didYouKnow:
          'اللون الذهبي اللامع الذي تراه على ريش المثاقب الاحترافية هو هذه الطبقة الخزفية فائقة الصلابة.',
      },
    },
  },
  {
    templateId: 'daily-tpl-aurora-rover',
    archetype: 'planetary_rover',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#0f172a',
    secondaryColor: '#38bdf8',
    accentColor: '#fbbf24',
    lengthScale: 1.06,
    widthScale: 1.06,
    rareSpec: RARE_COLLECTIBLES_CATALOG[4],
    title: {
      fr: 'Rover Planétaire Aurore Dorée',
      en: 'Golden Aurora Planetary Rover',
      ar: 'عربة الشفق الذهبي الكوكبية',
    },
    subtitle: {
      fr: 'Explorateur bonus équipé du Mât Spectromètre Laser Or Pur',
      en: 'Daily bonus rover carrying the Pure-Gold Laser Spectrometer Mast',
      ar: 'عربة اليوم الخاصة المزودة بعمود الليزر الطيفي المطلي بالذهب الفضائي',
    },
    discovery: {
      fr: {
        howItWorks:
          'Recouvert d’une fine feuille d’or réflectrice d’infrarouges, son mât garde ses caméras au chaud pendant les nuits polaires à -120 °C.',
        realRecord:
          'Les rovers planétaires gravissent des pentes rocheuses de 30° à des centaines de millions de kilomètres de tout atelier de réparation !',
        didYouKnow:
          'Même les visières des casques d’astronautes possèdent une fine couche d’or véritable pour filtrer les rayons infrarouges du Soleil.',
      },
      en: {
        howItWorks:
          'Wrapped in infrared-reflecting gold foil, the camera mast keeps delicate optics warm across -120 °C polar nights.',
        realRecord:
          'Planetary rovers climb 30-degree rocky crater walls hundreds of millions of kilometers from the nearest repair shop!',
        didYouKnow:
          'Astronaut spacewalk helmet visors are also coated with a microscopic layer of real gold to block solar infrared heat.',
      },
      ar: {
        howItWorks:
          'يحافظ الغلاف الذهبي العاكس للأشعة تحت الحمراء على دفء الكاميرات الدقيقة خلال الليالي القطبية المتجمدة.',
        realRecord:
          'تتسلق العربات الكوكبية منحدرات صخرية بزاوية 30 درجة على بُعد مئات الملايين من الكيلومترات عن الأرض!',
        didYouKnow:
          'تُطلى خوذات رواد الفضاء أيضاً بطبقة رقيقة جداً من الذهب الحقيقي لحماية أعينهم من أشعة الشمس.',
      },
    },
  },
  {
    templateId: 'daily-tpl-emerald-maglev',
    archetype: 'rail_train',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#065f46',
    secondaryColor: '#f8fafc',
    accentColor: '#fbbf24',
    lengthScale: 1.12,
    widthScale: 1.0,
    rareSpec: RARE_COLLECTIBLES_CATALOG[5],
    title: {
      fr: 'Train Express Émeraude & Or',
      en: 'Emerald & Gold Maglev Express',
      ar: 'قطار الزمرد والذهب الفائق',
    },
    subtitle: {
      fr: 'Convoi bonus du jour doté du Capteur Énergétique Supraconducteur Or',
      en: 'Daily bonus express featuring the Golden Superconducting Power Collector',
      ar: 'قطار اليوم الإضافي المجهز بلاقط الطاقة فائق التوصيل المذهّب',
    },
    discovery: {
      fr: {
        howItWorks:
          'Refroidis à très basse température, les matériaux supraconducteurs laissent circuler un courant immense avec zéro résistance électrique !',
        realRecord:
          'Un électroaimant supraconducteur lancé une seule fois peut conserver son champ magnétique pendant des années sans consommer d’énergie !',
        didYouKnow:
          'Lorsqu’un train électrique ralentit en descente, il renvoie de l’électricité dans le réseau pour aider un autre train qui monte !',
      },
      en: {
        howItWorks:
          'Chilled to cryogenic temperatures, superconducting coils carry massive electrical current with zero resistance!',
        realRecord: 'Once energized, a superconducting magnet loop can keep its magnetic field flowing for years!',
        didYouKnow: 'When an electric train brakes downhill, it feeds electricity back into the grid to help another train climb uphill!',
      },
      ar: {
        howItWorks:
          'عند تبريد الموصلات الفائقة إلى درجات منخفضة جداً يمر التيار الكهربائي بداخلها دون أي مقاومة أو فقدان للطاقة!',
        realRecord:
          'يحتفظ المغناطيس فائق التوصيل بمجاله المغناطيسي القوي لفترات طويلة بكفاءة مذهلة!',
        didYouKnow:
          'عندما يكبح القطار الكهربائي أثناء النزول، يعيد ضخ الكهرباء في الشبكة لمساعدة قطار آخر يصعد المرتفع!',
      },
    },
  },
  {
    templateId: 'daily-tpl-zenith-rocket',
    archetype: 'space_rocket',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#0f172a',
    secondaryColor: '#f8fafc',
    accentColor: '#fbbf24',
    lengthScale: 1.08,
    widthScale: 1.04,
    rareSpec: RARE_COLLECTIBLES_CATALOG[6],
    title: {
      fr: 'Lanceur Stellaire Zénith',
      en: 'Zenith Stellar Heavy Launcher',
      ar: 'الصاروخ النجمي زينيث الخاص',
    },
    subtitle: {
      fr: 'Fusée bonus temporaire coiffée de la Coiffe Orbitale Miroir d’Or',
      en: 'Daily bonus launcher crowned with the Gold-Mirror Orbital Payload Fairing',
      ar: 'صاروخ اليوم الخاص المتوّج بالغطاء المداري ذي المرآة الذهبية',
    },
    discovery: {
      fr: {
        howItWorks:
          'En quittant l’atmosphère à plus de Mach 6, la coiffe dorée s’ouvre en deux demi-coquilles comme une fleur pour libérer son télescope spatial.',
        realRecord:
          'Certaines coiffes de fusées modernes redescendent sous parafoil piloté par GPS pour être récupérées intactes en mer !',
        didYouKnow:
          'L’intérieur d’une coiffe est tapissé de panneaux acoustiques géants pour protéger le satellite du grondement des moteurs au décollage.',
      },
      en: {
        howItWorks:
          'Climbing past Mach 6 into vacuum, the gold-mirror fairing splits cleanly into two halves like petals to release its space telescope.',
        realRecord:
          'Modern payload fairings glide back down under GPS-steered parafoils so ships can recover and reuse them!',
        didYouKnow:
          'Inside every rocket fairing sit giant acoustic blankets that cushion delicate satellites from liftoff roar.',
      },
      ar: {
        howItWorks:
          'بعد الخروج من الغلاف الجوي بسرعة تفوق 6 أضعاف سرعة الصوت ينفتح الغطاء الذهبي إلى نصفين ليحرر التلسكوب الفضائي.',
        realRecord:
          'تهبط أغطية الصواريخ الحديثة بمظلات موجهة بالأقمار الصناعية لإعادة استخدامها من جديد!',
        didYouKnow:
          'يُبطّن الغطاء العلوي من الداخل بعوازل صوتية ضخمة لحماية الأقمار الصناعية من هدير الإقلاع.',
      },
    },
  },
];

export function getTodayDateKey(now: Date = new Date()): string {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getPreviousDateKey(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
  dt.setDate(dt.getDate() - 1);
  return getTodayDateKey(dt);
}

export function getSecondsUntilNextDaily(now: Date = new Date()): number {
  const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  return Math.max(0, Math.floor((tomorrow.getTime() - now.getTime()) / 1000));
}

export function formatCountdownHMS(totalSeconds: number): string {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function getTemplateIndexForDate(dateKey: string): number {
  const [y, m, d] = dateKey.split('-').map(Number);
  const utcDays = Math.floor(Date.UTC(y || 2026, (m || 1) - 1, d || 1) / 86_400_000);
  return ((utcDays % DAILY_BONUS_TEMPLATES.length) + DAILY_BONUS_TEMPLATES.length) % DAILY_BONUS_TEMPLATES.length;
}

export function buildDailyBlueprintForDate(dateKey: string): {
  blueprint: VehicleBlueprint;
  rareSpec: RareCollectibleSpec;
  templateId: string;
} {
  const idx = getTemplateIndexForDate(dateKey);
  const tpl = DAILY_BONUS_TEMPLATES[idx];

  const seed: BlueprintSeed = {
    id: `daily-${dateKey}`,
    archetype: tpl.archetype,
    category: tpl.category,
    tier: tpl.tier,
    primaryColor: tpl.primaryColor,
    secondaryColor: tpl.secondaryColor,
    accentColor: tpl.accentColor,
    lengthScale: tpl.lengthScale,
    widthScale: tpl.widthScale,
    name: tpl.title.fr,
    nameAr: tpl.title.ar,
    subtitle: tpl.subtitle.fr,
    subtitleAr: tpl.subtitle.ar,
    discovery: tpl.discovery.fr,
    discoveryAr: tpl.discovery.ar,
  };

  const base = buildBlueprintFromSeed(seed, 0);

  // Inject the gleaming Rare Collector Part into the daily prototype!
  const targetPart =
    base.parts.find((p) => p.id === tpl.rareSpec.targetPartId) ??
    base.parts[base.parts.length - 1];

  const parts = base.parts.map((p) => {
    if (p.id !== targetPart.id) return p;
    return {
      ...p,
      isRarePart: true,
      primaryColor: '#fbbf24',
      secondaryColor: '#f8fafc',
      name: tpl.rareSpec.name.fr,
      nameEn: tpl.rareSpec.name.en,
      nameAr: tpl.rareSpec.name.ar,
      roleHint: tpl.rareSpec.roleHint.fr,
      roleHintEn: tpl.rareSpec.roleHint.en,
      roleHintAr: tpl.rareSpec.roleHint.ar,
    };
  });

  const blueprint: VehicleBlueprint = {
    ...base,
    stageNumber: 0,
    nameEn: tpl.title.en,
    subtitleEn: tpl.subtitle.en,
    tierLabel: `Défi du Jour · ${dateKey}`,
    tierLabelEn: `Daily Challenge · ${dateKey}`,
    tierLabelAr: `تحدي اليوم · ${dateKey}`,
    ageNote: `Édition Bonus · ${parts.length} pièces dont 1 rare`,
    ageNoteEn: `Bonus Edition · ${parts.length} parts incl. 1 rare`,
    ageNoteAr: `إصدار خاص · ${parts.length} قطع منها قطعة نادرة`,
    discoveryEn: tpl.discovery.en,
    parts,
    isDailyBonus: true,
    dailyDateKey: dateKey,
    rarePartId: targetPart.id,
    rareCollectibleId: tpl.rareSpec.id,
  };

  return {
    blueprint,
    rareSpec: tpl.rareSpec,
    templateId: tpl.templateId,
  };
}

export function createEmptyDailyChallengeState(): DailyChallengeState {
  return {
    completedByDate: {},
    collectedRareIds: [],
    currentStreak: 0,
    bestStreak: 0,
    lastCompletedDate: null,
  };
}

export function getActiveDailyStreak(
  daily: DailyChallengeState,
  todayKey: string,
): number {
  if (!daily.lastCompletedDate) return 0;
  if (daily.lastCompletedDate === todayKey) return daily.currentStreak;
  const yesterdayKey = getPreviousDateKey(todayKey);
  if (daily.lastCompletedDate === yesterdayKey) return daily.currentStreak;
  return 0;
}

export function recordDailyChallengeCompletion(
  prev: DailyChallengeState,
  dateKey: string,
  stars: number,
  rareCollectibleId: string,
  templateId: string,
): {
  nextState: DailyChallengeState;
  newlyCollectedRare: boolean;
} {
  const existingEntry = prev.completedByDate[dateKey];
  const bestStars = Math.max(existingEntry?.stars ?? 0, stars);
  const newlyCollectedRare = !prev.collectedRareIds.includes(rareCollectibleId);

  const nextCollected = newlyCollectedRare
    ? [...prev.collectedRareIds, rareCollectibleId]
    : prev.collectedRareIds;

  let nextStreak = prev.currentStreak;
  let nextLastDate = prev.lastCompletedDate;

  if (!existingEntry) {
    const yesterday = getPreviousDateKey(dateKey);
    if (prev.lastCompletedDate === dateKey) {
      nextStreak = Math.max(1, prev.currentStreak);
    } else if (prev.lastCompletedDate === yesterday) {
      nextStreak = prev.currentStreak + 1;
    } else {
      nextStreak = 1;
    }
    nextLastDate = dateKey;
  }

  const nextBestStreak = Math.max(prev.bestStreak, nextStreak);

  return {
    newlyCollectedRare,
    nextState: {
      completedByDate: {
        ...prev.completedByDate,
        [dateKey]: {
          stars: bestStars,
          completedAt: Date.now(),
          rareCollectibleId,
          templateId,
        },
      },
      collectedRareIds: nextCollected,
      currentStreak: nextStreak,
      bestStreak: nextBestStreak,
      lastCompletedDate: nextLastDate,
    },
  };
}
