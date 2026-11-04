import { DifficultyTier, VehicleCategory } from '../types/game';
import { BlueprintSeed } from './catalogTemplates';

export const FLEET_PHYSIQUE_SEEDS: BlueprintSeed[] = [
  // =========================================================================
  // PALIER 1 · DÉCOUVERTE — Pendule simple
  // =========================================================================
  {
    id: 'phys-pendulum',
    archetype: 'orbital_satellite',
    category: VehicleCategory.PHYSICS,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f59e0b',
    secondaryColor: '#1c1917',
    accentColor: '#60a5fa',
    lengthScale: 0.70,
    widthScale: 0.70,
    name: 'Pendule simple',
    nameAr: 'البندول البسيط',
    subtitle: 'Accroche la tige au pivot et attache la boule — observe la loi du pendule',
    subtitleAr: 'علّق القضيب على المحور وأرفق الكرة — ألاحظ قانون البندول',
    discovery: {
      howItWorks:
        'Le pendule oscille grâce à l\'action combinée de la gravité et de la tension du fil. Sa période dépend uniquement de la longueur de la tige, pas de la masse de la boule.',
      realRecord:
        'Le pendule de Foucault installé au Panthéon de Paris en 1851 avait une tige de 67 m — sa rotation lente prouvait la rotation de la Terre !',
      didYouKnow:
        'Galilée observa qu\'un lustre oscillant dans une cathédrale mettait toujours le même temps, quelle que soit l\'amplitude du balancement.',
    },
    discoveryAr: {
      howItWorks:
        'يتأرجح البندول بفعل الجاذبية وشد الخيط معاً. تعتمد دورته فقط على طول القضيب، وليس على كتلة الكرة.',
      realRecord:
        'بندول فوكو المُركَّب في بانثيون باريس عام 1851 كان طوله 67 متراً — أثبت دورانه البطيء دوران الأرض!',
      didYouKnow:
        'لاحظ غاليليو أن ثريا تتأرجح في كاتدرائية كانت دائماً تستغرق نفس الوقت، بصرف النظر عن اتساع تأرجحها.',
    },
  },

  // =========================================================================
  // PALIER 2 · ATELIER — Levier du 1ᵉʳ ordre
  // =========================================================================
  {
    id: 'phys-lever-class1',
    archetype: 'orbital_satellite',
    category: VehicleCategory.PHYSICS,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#f59e0b',
    secondaryColor: '#1c1917',
    accentColor: '#60a5fa',
    lengthScale: 0.75,
    widthScale: 0.75,
    name: 'Levier du 1ᵉʳ ordre',
    nameAr: 'رافعة الدرجة الأولى',
    subtitle: 'Pose le pivot au centre et place les bras de levier des deux côtés — effort et charge s\'équilibrent',
    subtitleAr: 'ضع نقطة الارتكاز في الوسط وضع الذراعين على الجانبين — القوة والحمل يتوازنان',
    discovery: {
      howItWorks:
        'Dans un levier du premier ordre, le point d\'appui est situé entre l\'effort et la charge. Allonger le bras d\'effort permet de soulever une charge bien plus lourde.',
      realRecord:
        'Archimède aurait dit : « Donnez-moi un levier assez long et un point d\'appui, et je soulèverai la Terre. »',
      didYouKnow:
        'Une balançoire de parc est un levier du premier ordre parfait : deux enfants de poids différents peuvent s\'équilibrer en ajustant leur distance au pivot.',
    },
    discoveryAr: {
      howItWorks:
        'في رافعة الدرجة الأولى، تقع نقطة الارتكاز بين القوة والحمل. إطالة ذراع القوة تتيح رفع حمل أثقل بكثير.',
      realRecord:
        'يُنسب إلى أرشميدس قوله: «أعطني رافعة طويلة بما يكفي ونقطة ارتكاز، وسأحرك الأرض».',
      didYouKnow:
        'أرجوحة الحديقة هي رافعة درجة أولى مثالية: طفلان بوزنين مختلفين يتوازنان بضبط المسافة عن نقطة الارتكاز.',
    },
  },

  // =========================================================================
  // PALIER 3 · INGÉNIEUR — Plan incliné
  // =========================================================================
  {
    id: 'phys-inclined-plane',
    archetype: 'city_coupe',
    category: VehicleCategory.PHYSICS,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#f59e0b',
    secondaryColor: '#1c1917',
    accentColor: '#60a5fa',
    lengthScale: 0.75,
    widthScale: 0.75,
    name: 'Plan incliné',
    nameAr: 'المستوى المائل',
    subtitle: 'Monte la rampe sur la base et fais glisser l\'objet — moins d\'effort, mais plus de chemin !',
    subtitleAr: 'ضع المنحدر على القاعدة وأزلق الجسم — جهد أقل لكن مسافة أطول!',
    discovery: {
      howItWorks:
        'Le plan incliné est une machine simple : il réduit la force nécessaire pour monter une charge en augmentant la distance parcourue. L\'énergie totale reste identique.',
      realRecord:
        'Les Égyptiens auraient utilisé des rampes inclinées de plusieurs kilomètres pour hisser les blocs de calcaire de plus de 2,5 tonnes de la pyramide de Khéops.',
      didYouKnow:
        'Les vis, les escaliers en spirale et les rampes de parking sont tous des variations du plan incliné enroulé autour d\'un axe.',
    },
    discoveryAr: {
      howItWorks:
        'المستوى المائل آلة بسيطة: يقلل القوة اللازمة لرفع حمل بزيادة المسافة المقطوعة. تبقى الطاقة الكلية ثابتة.',
      realRecord:
        'استخدم المصريون القدماء منحدرات بطول عدة كيلومترات لرفع كتل الحجر الجيري التي يزيد وزنها عن 2.5 طن لبناء هرم خوفو.',
      didYouKnow:
        'البراغي والسلالم الحلزونية ومنحدرات مواقف السيارات كلها أشكال من المستوى المائل الملفوف حول محور.',
    },
  },

  // =========================================================================
  // PALIER 4 · EXPERT — Boussole magnétique
  // =========================================================================
  {
    id: 'phys-magnet-compass',
    archetype: 'city_coupe',
    category: VehicleCategory.PHYSICS,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#f59e0b',
    secondaryColor: '#1c1917',
    accentColor: '#60a5fa',
    lengthScale: 0.80,
    widthScale: 0.80,
    name: 'Boussole magnétique',
    nameAr: 'البوصلة المغناطيسية',
    subtitle: 'Place l\'aimant et pose l\'aiguille — elle pointe toujours vers le nord magnétique',
    subtitleAr: 'ضع المغناطيس وضع الإبرة — إنها تشير دائماً نحو القطب المغناطيسي الشمالي',
    discovery: {
      howItWorks:
        'L\'aiguille aimantée s\'aligne avec le champ magnétique terrestre, dont les lignes de force pointent du pôle Sud magnétique vers le pôle Nord magnétique.',
      realRecord:
        'Les marins chinois utilisaient des boussoles magnétiques dès le XIᵉ siècle, soit 200 ans avant leur adoption en Europe pour la navigation en haute mer.',
      didYouKnow:
        'Le pôle Nord magnétique se déplace d\'environ 55 km chaque année en direction de la Sibérie — les cartes de navigation sont mises à jour régulièrement pour en tenir compte.',
    },
    discoveryAr: {
      howItWorks:
        'تتوافق الإبرة المغناطيسية مع المجال المغناطيسي للأرض، الذي تشير خطوط قوته من القطب الجنوبي المغناطيسي نحو القطب الشمالي المغناطيسي.',
      realRecord:
        'استخدم البحارة الصينيون البوصلات المغناطيسية منذ القرن الحادي عشر، أي قبل 200 عام من اعتمادها في أوروبا للملاحة في أعالي البحار.',
      didYouKnow:
        'يتحرك القطب الشمالي المغناطيسي نحو 55 كم كل عام باتجاه سيبيريا — وتُحدَّث خرائط الملاحة بانتظام لمراعاة ذلك.',
    },
  },

  // =========================================================================
  // PALIER 5 · MAÎTRE — Prisme de lumière
  // =========================================================================
  {
    id: 'phys-prism-light',
    archetype: 'city_coupe',
    category: VehicleCategory.PHYSICS,
    tier: DifficultyTier.MASTER,
    primaryColor: '#f59e0b',
    secondaryColor: '#1c1917',
    accentColor: '#60a5fa',
    lengthScale: 0.85,
    widthScale: 0.85,
    name: 'Prisme de lumière',
    nameAr: 'منشور الضوء',
    subtitle: 'Oriente le prisme face à la lumière — elle se décompose en arc-en-ciel par réfraction',
    subtitleAr: 'وجّه المنشور نحو الضوء — ينقسم إلى قوس قزح بالانكسار',
    discovery: {
      howItWorks:
        'Chaque longueur d\'onde de la lumière blanche est réfractée à un angle légèrement différent en traversant le verre. Le rouge se plie peu, le violet beaucoup — c\'est la dispersion.',
      realRecord:
        'Isaac Newton fut le premier à montrer, en 1666, qu\'un prisme ne « colore » pas la lumière : il la sépare en couleurs qui existaient déjà dans la lumière blanche.',
      didYouKnow:
        'La vitesse de la lumière dans le verre est environ 40 % plus lente que dans le vide — c\'est cette réduction de vitesse qui courbe les rayons et crée l\'arc-en-ciel.',
    },
    discoveryAr: {
      howItWorks:
        'تنكسر كل طول موجي من ضوء الشمس الأبيض بزاوية مختلفة قليلاً عند مروره بالزجاج. ينحني الأحمر قليلاً والبنفسجي كثيراً — هذا هو التشتت.',
      realRecord:
        'كان إسحاق نيوتن أول من أثبت عام 1666 أن المنشور لا «يلوّن» الضوء، بل يفصله إلى ألوان كانت موجودة أصلاً في الضوء الأبيض.',
      didYouKnow:
        'سرعة الضوء في الزجاج أبطأ بنحو 40٪ من سرعته في الفراغ — هذا التباطؤ هو الذي يحني الأشعة ويخلق قوس القزح.',
    },
  },
];
