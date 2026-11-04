import { DifficultyTier, VehicleCategory } from '../types/game';
import { BlueprintSeed } from './catalogTemplates';

export const FLEET_AEROSPACE_SEEDS: BlueprintSeed[] = [
  // =========================================================================
  // PALIER 1 · DÉCOUVERTE — Fusée-sonde atmosphérique
  // =========================================================================
  {
    id: 'aero-sounding-rocket',
    archetype: 'space_rocket',
    category: VehicleCategory.AEROSPACE,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f0f9ff',
    secondaryColor: '#ef4444',
    accentColor: '#f59e0b',
    lengthScale: 0.88,
    widthScale: 0.88,
    name: 'Fusée-Sonde Méteorologique',
    nameAr: 'صاروخ رصد الطقس العلمي',
    subtitle: 'Fusée à propulseur solide qui mesure la température et la pression en haute atmosphère',
    subtitleAr: 'صاروخ ذو وقود صلب يقيس درجات الحرارة والضغط في طبقات الجو العليا',
    discovery: {
      howItWorks:
        'La combustion d\'un propulseur solide éjecte des gaz à plus de 2 000 °C par la tuyère, générant une poussée 10 fois supérieure au poids de la fusée pour la propulser au-delà de 80 km d\'altitude.',
      realRecord:
        'La fusée VS-30 brésilienne grimpe à 110 km en 3 minutes et 20 secondes, puis ses capteurs redescendent en parachute pour être récupérés et réutilisés !',
      didYouKnow:
        'Une fusée-sonde ne se met pas en orbite : elle suit une trajectoire en cloche (comme un ballon de basket) et retombe au sol après avoir traversé la stratosphère.',
    },
    discoveryAr: {
      howItWorks:
        'يحرق الوقود الصلب ليطلق غازات بأكثر من 2000 درجة مئوية عبر الفوهة، مولّداً قوة دفع تفوق وزن الصاروخ عشر مرات.',
      realRecord:
        'يصل صاروخ VS-30 البرازيلي إلى 110 كيلومترات خلال 3 دقائق و20 ثانية، ثم تعود أجهزته بالمظلة لتُستخدم مجدداً!',
      didYouKnow:
        'لا تدور الفضاء بل تتبع مساراً منحنياً كقوس القوس وتعود إلى الأرض بعد عبور الستراتوسفير.',
    },
  },

  // =========================================================================
  // PALIER 2 · ATELIER — CubeSat en orbite basse
  // =========================================================================
  {
    id: 'aero-leo-cubesat',
    archetype: 'orbital_satellite',
    category: VehicleCategory.AEROSPACE,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#0ea5e9',
    secondaryColor: '#0c4a6e',
    accentColor: '#facc15',
    lengthScale: 0.86,
    widthScale: 0.88,
    name: 'CubeSat Scientifique LEO',
    nameAr: 'القمر الصغير للبحث العلمي LEO',
    subtitle: 'Mini-satellite universitaire de la taille d\'une boîte à chaussures étudiant le champ magnétique terrestre',
    subtitleAr: 'قمر صناعي صغير بحجم صندوق الأحذية يدرس المجال المغناطيسي للأرض',
    discovery: {
      howItWorks:
        'Le CubeSat est lancé par une fusée puis éjecté à 400 km d\'altitude. Ses panneaux solaires se déploient et l\'alimentent en énergie pendant qu\'il orbite à 7,7 km/s.',
      realRecord:
        'Plus de 2 000 CubeSats ont été lancés depuis 2003. Certains universités d\'étudiants de lycée ont mis leur propre satellite en orbite avec moins de 10 000 € de budget !',
      didYouKnow:
        'En orbite basse, le satellite voit le soleil disparaître et réapparaître 15 fois par jour car il fait le tour de la Terre en seulement 90 minutes.',
    },
    discoveryAr: {
      howItWorks:
        'يُطلق القمر الصناعي الصغير بصاروخ ثم يُدفع خارجاً على ارتفاع 400 كيلومتر؛ تنبسط ألواحه الشمسية لتغذيه بالطاقة وهو يدور بسرعة 7.7 كم/ث.',
      realRecord:
        'أُطلق أكثر من 2000 CubeSat منذ 2003، وأطلقت بعض جامعات الطلاب قمراً صناعياً حقيقياً بميزانية أقل من 10 آلاف يورو!',
      didYouKnow:
        'في المدار المنخفض، يغيب الشمس ويعود 15 مرة يومياً لأن القمر يُكمل دورة حول الأرض في 90 دقيقة فقط.',
    },
  },

  // =========================================================================
  // PALIER 3 · INGÉNIEUR — Rover planétaire autonome
  // =========================================================================
  {
    id: 'aero-planetary-rover',
    archetype: 'planetary_rover',
    category: VehicleCategory.AEROSPACE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#f59e0b',
    secondaryColor: '#1c1917',
    accentColor: '#60a5fa',
    lengthScale: 1.0,
    widthScale: 1.0,
    name: 'Rover Planétaire Autonome',
    nameAr: 'المركبة الذاتية لاستكشاف الكواكب',
    subtitle: 'Véhicule robotique à six roues analysant le sol et les roches à la surface de Mars',
    subtitleAr: 'مركبة روبوتية بست عجلات تحلل التربة والصخور على سطح المريخ',
    discovery: {
      howItWorks:
        'Ses six roues indépendantes sur bras articulés lui permettent de gravir des rochers de 25 cm de haut. Un bras robotique prélève des échantillons de roches pour les analyser au laser.',
      realRecord:
        'Curiosity roule depuis 2012 sur Mars et a parcouru plus de 32 km. Il a découvert que Mars avait autrefois des lacs d\'eau liquide propice à la vie !',
      didYouKnow:
        'Pour communiquer avec la Terre, les signaux radio du rover mettent entre 3 et 22 minutes à parcourir la distance entre les deux planètes selon leur position.',
    },
    discoveryAr: {
      howItWorks:
        'تتيح له عجلاته الست المستقلة على أذرع مفصّلة تسلق صخور بارتفاع 25 سم؛ ويأخذ ذراعه الآلي عيّنات صخرية لتحليلها بالليزر.',
      realRecord:
        'يجوب كيوريوسيتي المريخ منذ 2012 وقطع أكثر من 32 كيلومتراً، واكتشف أن المريخ كان يحتوي قديماً على بحيرات مياه ملائمة للحياة!',
      didYouKnow:
        'تستغرق إشارات الراديو من المركبة إلى الأرض ما بين 3 و22 دقيقة حسب المسافة بين الكوكبين.',
    },
  },

  // =========================================================================
  // PALIER 4 · EXPERT — Module de station spatiale
  // =========================================================================
  {
    id: 'aero-iss-module',
    archetype: 'winged_orbiter_station',
    category: VehicleCategory.AEROSPACE,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#f8fafc',
    secondaryColor: '#334155',
    accentColor: '#facc15',
    lengthScale: 1.1,
    widthScale: 1.08,
    name: 'Module de Station Orbitale',
    nameAr: 'وحدة المحطة الفضائية المدارية',
    subtitle: 'Segment habitable pressurisé qui s\'arrime à la station spatiale internationale',
    subtitleAr: 'وحدة سكنية مضغوطة ترسو على المحطة الفضائية الدولية',
    discovery: {
      howItWorks:
        'Le module est lancé à bord d\'une fusée, dépressurisé lors du lancement puis re-gonflé dans l\'espace. Un mécanisme d\'arrimage à anneau et crochets assure une jonction hermétique avec la station.',
      realRecord:
        'L\'ISS mesure 109 mètres de long, pèse 420 tonnes et vole à 408 km d\'altitude à 27 600 km/h. Elle réalise 15,5 orbites par jour !',
      didYouKnow:
        'En orbite, les astronautes sont en chute libre permanente vers la Terre, mais vont si vite qu\'ils ne font que suivre la courbure de la planète sans jamais la toucher.',
    },
    discoveryAr: {
      howItWorks:
        'تُطلق الوحدة على متن صاروخ ثم تُضخّ بالهواء في الفضاء؛ ويؤمّن نظام إرساء بحلقات وخطّافات وصلاً محكماً مع المحطة.',
      realRecord:
        'يبلغ طول محطة الفضاء الدولية 109 أمتار وتزن 420 طناً وتطير على ارتفاع 408 كم بسرعة 27600 كم/س، منجزةً 15.5 دورة يومياً!',
      didYouKnow:
        'في المدار، رواد الفضاء في سقوط حر مستمر نحو الأرض، لكنهم يتحركون بسرعة كافية تجعلهم يتبعون انحناء الكرة الأرضية دون أن يلمسوها.',
    },
  },

  // =========================================================================
  // PALIER 5 · MAÎTRE — Lanceur lourd réutilisable
  // =========================================================================
  {
    id: 'aero-heavy-launcher',
    archetype: 'space_rocket',
    category: VehicleCategory.AEROSPACE,
    tier: DifficultyTier.MASTER,
    primaryColor: '#94a3b8',
    secondaryColor: '#0f172a',
    accentColor: '#f97316',
    lengthScale: 1.2,
    widthScale: 1.1,
    name: 'Lanceur Lourd Réutilisable',
    nameAr: 'الصاروخ العملاق القابل لإعادة الاستخدام',
    subtitle: 'Méga-fusée à étages séparables dont le premier étage revient se poser sur ses propres moteurs',
    subtitleAr: 'صاروخ ضخم متعدد المراحل تعود مرحلته الأولى لتهبط على محركاتها الخاصة',
    discovery: {
      howItWorks:
        'Ses 33 moteurs Raptor brûlent méthane et oxygène liquide. Après séparation, le premier étage réoriente sa poussée pour ralentir et atterrir debout sur sa bouchon de décollage, en 7 minutes.',
      realRecord:
        'Starship est le lanceur le plus puissant jamais construit : 7 500 tonnes de poussée au décollage, soit deux fois l\'Apollo Saturn V.',
      didYouKnow:
        'Réutiliser un premier étage divise par 10 le coût d\'accès à l\'espace. L\'objectif est d\'envoyer 100 tonnes en orbite pour 2 millions de dollars, contre 60 millions pour une fusée jetable.',
    },
    discoveryAr: {
      howItWorks:
        'تحرق محركاتها الـ33 الميثان والأكسجين السائل؛ وبعد الفصل، تعيد المرحلة الأولى توجيه دفعها للتباطؤ والهبوط رأسياً خلال 7 دقائق.',
      realRecord:
        'ستارشيب هو أقوى صاروخ بُني على الإطلاق: قوة دفع 7500 طن عند الإقلاع، أي ضعف صاروخ ساتورن 5 الأبولو.',
      didYouKnow:
        'إعادة استخدام المرحلة الأولى يقلّل تكلفة الوصول للفضاء عشر مرات؛ والهدف إطلاق 100 طن للمدار بمليونَي دولار مقابل 60 مليوناً للصاروخ القابل للاستخدام مرة واحدة.',
    },
  },
];
