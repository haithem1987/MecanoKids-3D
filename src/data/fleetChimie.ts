import { DifficultyTier, VehicleCategory } from '../types/game';
import { BlueprintSeed } from './catalogTemplates';

export const FLEET_CHIMIE_SEEDS: BlueprintSeed[] = [
  // =========================================================================
  // PALIER 1 · DÉCOUVERTE — Molécule d'eau
  // =========================================================================
  {
    id: 'chem-water-molecule',
    archetype: 'orbital_satellite',
    category: VehicleCategory.CHEMISTRY,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#a855f7',
    secondaryColor: '#1e1b4b',
    accentColor: '#34d399',
    lengthScale: 0.65,
    widthScale: 0.65,
    name: 'Molécule d\'eau',
    nameAr: 'جزيء الماء',
    subtitle: 'Assemble deux atomes d\'hydrogène et un atome d\'oxygène pour former H₂O',
    subtitleAr: 'اجمع ذرتَي هيدروجين مع ذرة أكسجين لتكوّن جزيء الماء H₂O',
    discovery: {
      howItWorks:
        'L\'oxygène forme deux liaisons simples avec deux atomes d\'hydrogène. L\'angle de 104,5° entre les deux liaisons rend la molécule asymétrique, ce qui lui donne une charge partielle positive et négative.',
      realRecord:
        'Une goutte d\'eau contient environ 1,7 sextillion de molécules H₂O — c\'est plus que le nombre d\'étoiles visibles dans l\'Univers observable !',
      didYouKnow:
        'L\'eau est la seule substance naturelle qui existe à l\'état solide, liquide et gazeux dans les conditions normales de la Terre.',
    },
    discoveryAr: {
      howItWorks:
        'يرتبط الأكسجين بذرتَي هيدروجين برابطتَين مفردتَين. الزاوية البالغة 104.5° بين الرابطتَين تجعل الجزيء غير متماثل، مما يمنحه شحنة جزئية موجبة وأخرى سالبة.',
      realRecord:
        'تحتوي قطرة ماء واحدة على نحو 1.7 سيكستيليون جزيء H₂O — وهو عدد أكبر من عدد النجوم المرئية في الكون المرصود!',
      didYouKnow:
        'الماء هو المادة الطبيعية الوحيدة الموجودة في حالاتها الثلاث — صلبة وسائلة وغازية — في الظروف العادية على الأرض.',
    },
  },

  // =========================================================================
  // PALIER 2 · ATELIER — Molécule CO₂
  // =========================================================================
  {
    id: 'chem-co2-molecule',
    archetype: 'orbital_satellite',
    category: VehicleCategory.CHEMISTRY,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#a855f7',
    secondaryColor: '#1e1b4b',
    accentColor: '#34d399',
    lengthScale: 0.8,
    widthScale: 0.65,
    name: 'Molécule CO₂',
    nameAr: 'جزيء ثاني أكسيد الكربون',
    subtitle: 'Relie un atome de carbone à deux oxygènes par des liaisons doubles pour obtenir CO₂',
    subtitleAr: 'اربط ذرة كربون بذرتَي أكسجين برابطتَين مزدوجتَين لتحصل على CO₂',
    discovery: {
      howItWorks:
        'Le carbone utilise ses quatre électrons de valence pour former deux doubles liaisons avec les atomes d\'oxygène. La molécule est linéaire et symétrique.',
      realRecord:
        'Le CO₂ représente aujourd\'hui 421 ppm dans l\'atmosphère terrestre, soit environ 50 % de plus qu\'avant l\'ère industrielle (280 ppm en 1750).',
      didYouKnow:
        'Les plantes absorbent le CO₂ et utilisent l\'énergie du soleil pour le transformer en glucose — c\'est la photosynthèse, à la base de toute vie sur Terre.',
    },
    discoveryAr: {
      howItWorks:
        'يستخدم الكربون الأربعة إلكترونات التكافؤ لتكوين رابطتَين مزدوجتَين مع ذرتَي الأكسجين. الجزيء خطّي ومتماثل.',
      realRecord:
        'يبلغ تركيز CO₂ في الغلاف الجوي اليوم 421 جزءًا في المليون، أي نحو 50% أكثر مما كان عليه قبل الثورة الصناعية (280 جزءًا عام 1750).',
      didYouKnow:
        'تمتص النباتات CO₂ وتستخدم طاقة الشمس لتحويله إلى جلوكوز — وهذه هي عملية التمثيل الضوئي، أساس الحياة على الأرض.',
    },
  },

  // =========================================================================
  // PALIER 3 · INGÉNIEUR — Cristal de sel NaCl
  // =========================================================================
  {
    id: 'chem-salt-crystal',
    archetype: 'city_coupe',
    category: VehicleCategory.CHEMISTRY,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#c084fc',
    secondaryColor: '#1e1b4b',
    accentColor: '#34d399',
    lengthScale: 0.75,
    widthScale: 0.75,
    name: 'Cristal de sel NaCl',
    nameAr: 'بلورة ملح الطعام NaCl',
    subtitle: 'Alterne ions sodium et chlorure pour construire le réseau cristallin du sel de table',
    subtitleAr: 'بادِل بين أيونات الصوديوم والكلور لبناء الشبكة البلورية لملح الطعام',
    discovery: {
      howItWorks:
        'Le sodium cède un électron au chlore. L\'ion Na⁺ et l\'ion Cl⁻ s\'attirent par force électrostatique et s\'organisent en réseau cubique face centrée.',
      realRecord:
        'Le plus grand cristal de sel naturel mesuré pesait plus de 400 kg et a été trouvé dans les mines de Wieliczka en Pologne, inscrites au patrimoine mondial de l\'UNESCO.',
      didYouKnow:
        'Le sel fond à 801 °C et bout à 1 465 °C — bien plus chaud que le fer en fusion ! Sa structure cristalline lui confère une très grande stabilité.',
    },
    discoveryAr: {
      howItWorks:
        'يتنازل الصوديوم عن إلكترون للكلور. يتجاذب أيون Na⁺ وأيون Cl⁻ بقوة كهروستاتيكية وينتظمان في شبكة مكعبية مركزية الوجه.',
      realRecord:
        'أكبر بلورة ملح طبيعية مُسجَّلة وزنت أكثر من 400 كغ، وعُثر عليها في مناجم فيليتشكا في بولندا، المدرجة على قائمة اليونسكو للتراث العالمي.',
      didYouKnow:
        'ينصهر الملح عند 801 درجة مئوية ويغلي عند 1465 درجة — أعلى بكثير من درجة انصهار الحديد! بنيته البلورية تمنحه ثباتًا عاليًا.',
    },
  },

  // =========================================================================
  // PALIER 4 · EXPERT — Bécher sur pied
  // =========================================================================
  {
    id: 'chem-beaker-setup',
    archetype: 'city_coupe',
    category: VehicleCategory.CHEMISTRY,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#7c3aed',
    secondaryColor: '#1e1b4b',
    accentColor: '#34d399',
    lengthScale: 0.8,
    widthScale: 0.7,
    name: 'Bécher sur pied',
    nameAr: 'كوب قياس على حامل',
    subtitle: 'Monte le pied, le support et le bécher pour préparer ton poste d\'expérience',
    subtitleAr: 'ركّب الحامل والدعامة والكأس لتجهيز منضدة التجارب',
    discovery: {
      howItWorks:
        'Le pied à tige vertical supporte la potence, qui maintient la pince, qui tient le bécher à la bonne hauteur au-dessus du brûleur. Chaque élément transmet les forces pour stabiliser l\'ensemble.',
      realRecord:
        'Le bécher en verre borosilicaté (Pyrex®) supporte des chocs thermiques de plus de 200 °C sans se fissurer — sa dilatation thermique est cinq fois plus faible que le verre ordinaire.',
      didYouKnow:
        'La règle de sécurité numéro 1 en laboratoire scolaire : ne jamais chauffer un récipient fermé et toujours porter des lunettes de protection.',
    },
    discoveryAr: {
      howItWorks:
        'يدعم العمود العمودي الذراعَ الأفقي، الذي يحمل المشبك الذي يمسك الكأس على الارتفاع الصحيح فوق الموقد. كل عنصر ينقل القوى لتثبيت المجموعة.',
      realRecord:
        'الكأس الزجاجية من البورسيليكات (Pyrex®) تتحمل صدمات حرارية تتجاوز 200 درجة مئوية دون أن تتشقق — تمددها الحراري أقل بخمس مرات من الزجاج العادي.',
      didYouKnow:
        'قاعدة السلامة الأولى في المختبر المدرسي: لا تُسخّن أبدًا وعاءً مغلقًا، وارتدِ دائمًا نظارات الحماية.',
    },
  },

  // =========================================================================
  // PALIER 5 · MAÎTRE — Balance de précision
  // =========================================================================
  {
    id: 'chem-balance-scale',
    archetype: 'city_coupe',
    category: VehicleCategory.CHEMISTRY,
    tier: DifficultyTier.MASTER,
    primaryColor: '#6d28d9',
    secondaryColor: '#1e1b4b',
    accentColor: '#34d399',
    lengthScale: 0.85,
    widthScale: 0.75,
    name: 'Balance de précision',
    nameAr: 'ميزان دقيق',
    subtitle: 'Assemble socle, fléau et plateaux pour construire une balance de laboratoire équilibrée',
    subtitleAr: 'اجمع القاعدة والذراع والأطباق لبناء ميزان مختبر متوازن',
    discovery: {
      howItWorks:
        'Le fléau est un levier du premier genre : son pivot central est le point d\'appui. Quand les masses des deux plateaux sont égales, les couples de forces s\'annulent et le fléau est horizontal.',
      realRecord:
        'Les balances de laboratoire modernes mesurent jusqu\'au microgramme (0,000 001 g) — soit la masse d\'un grain de pollen. Elles doivent être protégées des vibrations et des courants d\'air.',
      didYouKnow:
        'La balance est l\'un des plus anciens instruments de mesure : on a retrouvé des balances à fléau en Égypte datant de 2000 av. J.-C., utilisées pour peser l\'or et les épices.',
    },
    discoveryAr: {
      howItWorks:
        'الذراع هو رافعة من النوع الأول: محوره المركزي هو نقطة الارتكاز. عندما تتساوى كتل الطبقَين، تتلاغى العزوم وتظل الذراع أفقية.',
      realRecord:
        'تقيس موازين المختبر الحديثة حتى الميكروغرام (0.000001 غ) — وهي كتلة حبة حبوب لقاح. يجب حمايتها من الاهتزازات وتيارات الهواء.',
      didYouKnow:
        'الميزان من أقدم أدوات القياس: وُجدت موازين ذراعية في مصر تعود إلى 2000 ق.م.، كانت تُستخدم لوزن الذهب والتوابل.',
    },
  },
];
