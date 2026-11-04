import { DifficultyTier, VehicleCategory } from '../types/game';
import { BlueprintSeed } from './catalogTemplates';

export const FLEET_ELECTRONIQUE_SEEDS: BlueprintSeed[] = [
  // =========================================================================
  // PALIER 1 · DÉCOUVERTE — Circuit LED
  // =========================================================================
  {
    id: 'elec-led-circuit',
    archetype: 'elec_circuit',
    category: VehicleCategory.ELECTRONICS,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#22c55e',
    secondaryColor: '#1e3a2f',
    accentColor: '#facc15',
    lengthScale: 0.75,
    widthScale: 0.75,
    name: 'Circuit LED',
    nameAr: 'دائرة ليد الكهربائية',
    subtitle: 'Monte une platine d\'essai avec batterie, résistance et LED pour allumer ta première lumière',
    subtitleAr: 'اصنع دائرة بطارية ومقاومة وصمام ضوئي لتُضيء أول مصباحك',
    discovery: {
      howItWorks:
        'La batterie pousse les électrons dans le fil, la résistance limite leur vitesse pour protéger la LED, et la LED convertit cette énergie en photons lumineux visibles.',
      realRecord:
        'La LED la plus efficace au monde transforme 97 % de l\'électricité en lumière, contre seulement 10 % pour une ampoule à incandescence classique !',
      didYouKnow:
        'La couleur d\'une LED dépend du matériau semi-conducteur : le nitrure de gallium émet du bleu, tandis que le phosphure d\'aluminium émet du rouge ou du vert.',
    },
    discoveryAr: {
      howItWorks:
        'تدفع البطارية الإلكترونات عبر السلك، والمقاومة تحدّ من سرعتها لحماية الصمام الضوئي، والصمام يحوّل الطاقة إلى فوتونات ضوئية.',
      realRecord:
        'أكفأ صمام ضوئي في العالم يحوّل 97% من الكهرباء إلى ضوء، مقارنةً بـ10% فقط للمصباح التقليدي!',
      didYouKnow:
        'لون الصمام الضوئي يعتمد على المادة شبه الموصلة: نيتريد الغاليوم يُصدر اللون الأزرق، وفوسفيد الألومنيوم يُصدر الأخضر أو الأحمر.',
    },
  },

  // =========================================================================
  // PALIER 2 · ATELIER — Ventilateur à moteur
  // =========================================================================
  {
    id: 'elec-motor-fan',
    archetype: 'elec_circuit',
    category: VehicleCategory.ELECTRONICS,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#0ea5e9',
    secondaryColor: '#0c4a6e',
    accentColor: '#f59e0b',
    lengthScale: 0.80,
    widthScale: 0.80,
    name: 'Ventilateur à Moteur',
    nameAr: 'مروحة المحرك الكهربائي',
    subtitle: 'Relie une batterie à un micro-moteur DC pour faire tourner des pales et sentir le vent électrique',
    subtitleAr: 'صل بطارية بمحرك صغير لتشغيل الريش وتحسّس الهواء الكهربائي',
    discovery: {
      howItWorks:
        'Le courant électrique traverse les bobines du moteur, créant un champ magnétique qui attire et repousse alternativement les aimants permanents du rotor, le faisant tourner pour déplacer l\'air.',
      realRecord:
        'Les moteurs électriques atteignent 95 % de rendement énergétique, ce qui en fait les moteurs les plus efficaces jamais inventés par l\'humanité.',
      didYouKnow:
        'Un moteur à courant continu peut aussi fonctionner en générateur : si tu fais tourner ses pales à la main, il produit de l\'électricité — c\'est le principe de l\'éolienne !',
    },
    discoveryAr: {
      howItWorks:
        'يمر التيار الكهربائي عبر ملفات المحرك، فينشئ مجالاً مغناطيسياً يجذب ويطرد المغناطيس الدائم في الدوّار بالتناوب، محدثاً الدوران لتحريك الهواء.',
      realRecord:
        'تبلغ كفاءة المحركات الكهربائية 95%، مما يجعلها أكفأ المحركات في تاريخ البشرية.',
      didYouKnow:
        'يمكن للمحرك أن يعمل مولّداً كهربائياً إذا دوّرت ريشه يدوياً — هذا هو مبدأ المولّد الهوائي!',
    },
  },

  // =========================================================================
  // PALIER 3 · INGÉNIEUR — Alarme sonore
  // =========================================================================
  {
    id: 'elec-alarm-buzzer',
    archetype: 'elec_circuit',
    category: VehicleCategory.ELECTRONICS,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#ef4444',
    secondaryColor: '#7f1d1d',
    accentColor: '#fbbf24',
    lengthScale: 0.70,
    widthScale: 0.70,
    name: 'Alarme Sonore',
    nameAr: 'جرس الإنذار الصوتي',
    subtitle: 'Associe un capteur de lumière à un buzzer : quand l\'obscurité tombe, l\'alarme retentit',
    subtitleAr: 'اربط مستشعر الضوء بجرس إنذار: عند الظلام يدقّ الجرس',
    discovery: {
      howItWorks:
        'La résistance dépendante de la lumière (LDR) diminue sa résistance sous la lumière. Dans l\'obscurité, sa résistance augmente, faisant basculer le transistor qui alimente le buzzer piézoélectrique.',
      realRecord:
        'Les premiers systèmes d\'alarme électroniques commerciaux sont apparus en 1853 à Boston, utilisant un circuit électromagnétique pour détecter l\'ouverture d\'une porte.',
      didYouKnow:
        'Un buzzer piézoélectrique n\'a aucune pièce mobile : une céramique piézo se déforme 2 000 fois par seconde quand on lui applique un courant, créant les vibrations sonores.',
    },
    discoveryAr: {
      howItWorks:
        'تقلّ مقاومة المستشعر الضوئي LDR في النور؛ وفي الظلام ترتفع مقاومته، مما يُشغّل الترانزستور الذي يغذّي جرس بيزو الكهربائي.',
      realRecord:
        'ظهرت أولى أنظمة الإنذار الإلكترونية التجارية عام 1853 في بوسطن، محتدمةً دارةً كهرومغناطيسية للكشف عن فتح الأبواب.',
      didYouKnow:
        'جرس البيزو ليس فيه قطع متحركة: تتشوّه صفيحة سيراميكية 2000 مرة في الثانية عند تطبيق التيار، مما يُولّد الاهتزاز الصوتي.',
    },
  },

  // =========================================================================
  // PALIER 4 · EXPERT — Jouet solaire
  // =========================================================================
  {
    id: 'elec-solar-toy',
    archetype: 'elec_circuit',
    category: VehicleCategory.ELECTRONICS,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#fbbf24',
    secondaryColor: '#1c1917',
    accentColor: '#60a5fa',
    lengthScale: 0.85,
    widthScale: 0.85,
    name: 'Jouet Solaire',
    nameAr: 'اللعبة الشمسية',
    subtitle: 'Assemble un panneau photovoltaïque, un condensateur et un moteur pour un jouet alimenté uniquement par la lumière',
    subtitleAr: 'اجمع خلية شمسية ومكثّفاً ومحرّكاً للعبة تعمل بالضوء وحده',
    discovery: {
      howItWorks:
        'Les photons du soleil frappent les cellules en silicium, libérant des électrons par effet photoélectrique. Le condensateur stocke cette énergie et la libère par impulsions pour faire tourner le moteur.',
      realRecord:
        'Le satellite Vanguard 1, lancé en 1958, est toujours en orbite aujourd\'hui — c\'est le plus vieil objet artificiel encore en orbite, alimenté par 6 cellules solaires de 1 W.',
      didYouKnow:
        'L\'effet photoélectrique a valu à Albert Einstein le prix Nobel de physique en 1921, et c\'est exactement ce principe qui fait fonctionner ton panneau solaire !',
    },
    discoveryAr: {
      howItWorks:
        'تضرب فوتونات الشمس خلايا السيليكون، محرِّرةً إلكترونات بالتأثير الكهرضوئي. يخزّن المكثّف هذه الطاقة ويطلقها على شكل نبضات لتدوير المحرك.',
      realRecord:
        'القمر Vanguard 1 المُطلَق عام 1958 لا يزال في مداره — إنه أقدم جسم صناعي في الفضاء، يعمل بـ6 خلايا شمسية بقدرة 1 واط.',
      didYouKnow:
        'نال ألبرت أينشتاين جائزة نوبل للفيزياء عام 1921 بسبب اكتشاف التأثير الكهرضوئي — وهذا بالضبط ما يُشغّل لوحتك الشمسية!',
    },
  },

  // =========================================================================
  // PALIER 5 · MAÎTRE — Récepteur radio AM
  // =========================================================================
  {
    id: 'elec-radio-receiver',
    archetype: 'elec_circuit',
    category: VehicleCategory.ELECTRONICS,
    tier: DifficultyTier.MASTER,
    primaryColor: '#94a3b8',
    secondaryColor: '#0f172a',
    accentColor: '#f97316',
    lengthScale: 0.80,
    widthScale: 0.80,
    name: 'Récepteur Radio AM',
    nameAr: 'جهاز استقبال الراديو AM',
    subtitle: 'Relie antenne, condensateur variable, démodulateur et casque pour capter des stations réelles',
    subtitleAr: 'اربط هوائياً ومكثّفاً متغيراً ومُرسِّلاً وسمّاعةً لالتقاط محطات حقيقية',
    discovery: {
      howItWorks:
        'L\'antenne capte des oscillations électromagnétiques. Le condensateur variable sélectionne une fréquence (syntonisation). La diode démodule le signal AM pour extraire le son que l\'écouteur transforme en vibrations.',
      realRecord:
        'Guglielmo Marconi a transmis le premier message radio transatlantique en 1901, de Cornouailles en Angleterre jusqu\'à Terre-Neuve au Canada, sur une distance de 3 500 km.',
      didYouKnow:
        'La bande AM (530-1710 kHz) peut parcourir des milliers de kilomètres la nuit, car les ondes rebondissent sur la ionosphère comme une balle sur un mur — contrairement aux ondes FM qui vont en ligne droite.',
    },
    discoveryAr: {
      howItWorks:
        'يلتقط الهوائي تذبذبات كهرومغناطيسية. يختار المكثّف المتغير التردد (الضبط). تُرسّخ الثنائية الإشارة AM لاستخلاص الصوت الذي يحوّله سمّاعة الأذن إلى اهتزازات.',
      realRecord:
        'أرسل غوليلمو ماركوني أول رسالة راديو عبر الأطلسي عام 1901، من كورنوول في إنجلترا إلى نيوفاوندلاند في كندا، على مسافة 3500 كيلومتر.',
      didYouKnow:
        'يمكن للأمواج الـAM (530-1710 كيلوهرتز) أن تقطع آلاف الكيلومترات ليلاً، إذ ترتدّ على طبقة الأيونوسفير كالكرة على الجدار — خلافاً لأمواج FM التي تسير في خط مستقيم.',
    },
  },
];
