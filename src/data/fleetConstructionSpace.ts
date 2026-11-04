import { DifficultyTier, VehicleCategory } from '../types/game';
import { BlueprintSeed } from './catalogTemplates';

export const FLEET_CONSTRUCTION_SPACE_SEEDS: BlueprintSeed[] = [
  // =========================================================================
  // PALIER 1 · DÉCOUVERTE — CHANTIER & ESPACE (8 SEEDS : 4 CHANTIER + 4 ESPACE)
  // =========================================================================
  {
    id: 'const-mini-excavator',
    archetype: 'excavator_tracked',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f59e0b',
    secondaryColor: '#1e293b',
    accentColor: '#38bdf8',
    lengthScale: 0.92,
    widthScale: 0.94,
    name: 'Mini-Pelleteuse de Jardin',
    nameAr: 'الحفّارة الصغيرة المجنزرة',
    subtitle: 'Engin à chenilles agile pour creuser tranchées et bassins',
    subtitleAr: 'آلة حفر صغيرة مرنة لحفر الخنادق وتنسيق الحدائق',
    discovery: {
      howItWorks:
        'De l’huile poussée sous haute pression dans des cylindres métalliques appelés vérins fait plier le bras et le godet comme un bras humain géant.',
      realRecord:
        'Les plus petites mini-pelles passent par une porte de maison de 75 cm de large tout en soulevant plus de 500 kg !',
      didYouKnow:
        'Ses chenilles en caoutchouc répartissent le poids pour traverser une pelouse ou un trottoir sans les abîmer.',
    },
    discoveryAr: {
      howItWorks:
        'يندفع الزيت الهيدروليكي داخل الأسطوانات المعدنية ليحرك الذراع والدلو تماماً مثل عضلات الذراع البشرية.',
      realRecord:
        'تستطيع أصغر الحفارات المرور عبر باب بعرض 75 سم فقط مع قدرة رفع تتجاوز 500 كيلوغرام!',
      didYouKnow:
        'تحمي الجنازير المطاطية الأرضيات والعشب لأنها توزع الوزن برفق على مساحة واسعة.',
    },
  },
  {
    id: 'const-farm-tractor-green',
    archetype: 'tractor_agri',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#16a34a',
    secondaryColor: '#facc15',
    accentColor: '#1e293b',
    lengthScale: 0.94,
    widthScale: 0.96,
    name: 'Tracteur du Verger',
    nameAr: 'جرّار البساتين الزراعي',
    subtitle: 'Tracteur agricole compact aux grandes roues arrière crantées',
    subtitleAr: 'جرار زراعي مدمج بعجلات خلفية كبيرة ذات نتوءات قوية',
    discovery: {
      howItWorks:
        'Ses grandes roues arrière offrent un immense bras de levier pour tirer des remorques lourdes dans la terre meuble sans patiner.',
      realRecord:
        'Un tracteur moderne remplace à lui seul l’effort physique de plusieurs dizaines de chevaux de trait d’autrefois !',
      didYouKnow:
        'Les crampons en chevrons sur les pneus de tracteur sont inclinés pour chasser automatiquement la boue sur les côtés en tournant.',
    },
    discoveryAr: {
      howItWorks:
        'تمنح العجلات الخلفية الكبيرة عزم سحب هائل لقطر العربات والمعدات فوق التربة الرطبة دون انزلاق.',
      realRecord:
        'يوفر الجرار الزراعي الحديث قوة تعادل جهد عشرات الخيول مجتمعة في المزارع التقليدية!',
      didYouKnow:
        'صُممت النقوش المائلة على إطارات الجرار لطرد الطين تلقائياً نحو الجوانب أثناء الدوران.',
    },
  },
  {
    id: 'const-warehouse-forklift',
    archetype: 'forklift_crane',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f97316',
    secondaryColor: '#334155',
    accentColor: '#facc15',
    lengthScale: 0.92,
    widthScale: 0.94,
    name: 'Chariot Élévateur d’Entrepôt',
    nameAr: 'الرافعة الشوكية للمستودعات',
    subtitle: 'Engin électrique à fourche verticale pour empiler les palettes',
    subtitleAr: 'مركبة كهربائية بشوكة عمودية لرفع وترتيب المنصات',
    discovery: {
      howItWorks:
        'Un lourd contrepoids caché tout à l’arrière empêche le chariot de basculer vers l’avant quand sa fourche soulève une caisse lourde !',
      realRecord:
        'Certains chariots d’entrepôt hissent des palettes à plus de 12 mètres de haut dans des allées larges de moins de 2 mètres !',
      didYouKnow:
        'Contrairement à une voiture, ce sont les roues arrière du chariot élévateur qui tournent : il pivote presque sur place !',
    },
    discoveryAr: {
      howItWorks:
        'يمنع ثقل الموازنة الخلفي الكبير انقلاب الرافعة للأمام عند رفع الصناديق الثقيلة بالشوكة المعدنية!',
      realRecord:
        'ترفع بعض رافعات المستودعات البضائع إلى ارتفاع يتجاوز 12 متراً داخل ممرات ضيقة جداً!',
      didYouKnow:
        'على عكس السيارات العادية، تدور العجلات الخلفية للرافعة الشوكية لتمنحها قدرة التفاف شبه دائرية في مكانها!',
    },
  },
  {
    id: 'const-road-compactor',
    archetype: 'bulldozer_roller',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#eab308',
    secondaryColor: '#334155',
    accentColor: '#f97316',
    lengthScale: 0.94,
    widthScale: 0.96,
    name: 'Rouleau Compresseur Routier',
    nameAr: 'محدلة رصف الطرق',
    subtitle: 'Machine à lourd cylindre d’acier qui lisse les routes neuves',
    subtitleAr: 'آلة مزودة بأسطوانة فولاذية ثقيلة لتسوية الطرق الجديدة',
    discovery: {
      howItWorks:
        'À l’intérieur du gros cylindre métallique tourne une masse excentrée qui fait vibrer le rouleau pour tasser le sol et le bitume.',
      realRecord:
        'Grâce à cette vibration rapide, un rouleau de 10 tonnes tasse le sol aussi efficacement qu’un poids immobile de 30 tonnes !',
      didYouKnow:
        'Une rampe arrose le cylindre d’une fine pellicule d’eau pour éviter que l’asphalte chaud ne colle à l’acier.',
    },
    discoveryAr: {
      howItWorks:
        'تدور كتلة داخلية داخل الأسطوانة المعدنية لتوليد اهتزازات دقيقة تضغط التربة والأسفلت بقوة متساوية.',
      realRecord:
        'بفضل تقنية الاهتزاز، تضغط محدلة وزنها 10 أطنان الطريق بكفاءة تعادل ثقلاً ثابتاً وزنه 30 طناً!',
      didYouKnow:
        'تُرش طبقة رقيقة من الماء باستمرار على الأسطوانة لمنع التصاق الأسفلت الساخن بالمعدن.',
    },
  },

  {
    id: 'space-weather-cubesat',
    archetype: 'orbital_satellite',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f59e0b',
    secondaryColor: '#1d4ed8',
    accentColor: '#38bdf8',
    lengthScale: 0.92,
    widthScale: 0.94,
    name: 'Satellite Météo Orbital',
    nameAr: 'القمر الصناعي للأرصاد الجوية',
    subtitle: 'Sentinelle de l’espace photographiant les nuages autour de la Terre',
    subtitleAr: 'قمر صناعي يرصد حركة السحب والطقس حول كوكب الأرض',
    discovery: {
      howItWorks:
        'Ses deux ailes solaires dépliables alimentent ses caméras tandis qu’il tourne autour de la Terre sans aucun frottement d’air.',
      realRecord:
        'À 36 000 km d’altitude, un satellite géostationnaire tourne exactement à la même vitesse que la Terre et semble fixe dans le ciel !',
      didYouKnow:
        'La couverture dorée qui entoure les satellites est un isolant multicouche qui les protège à la fois de +120 °C au soleil et -150 °C à l’ombre.',
    },
    discoveryAr: {
      howItWorks:
        'تزوّد الأجنحة الشمسية القابلة للطي الكاميرات بالكهرباء بينما يدور القمر حول الأرض بلا مقاومة هواء.',
      realRecord:
        'على ارتفاع 36 ألف كم، يدور القمر الثابت بنفس سرعة دوران الأرض فيبدو وكأنه معلّق فوق نفس النقطة دائماً!',
      didYouKnow:
        'الطبقة الذهبية اللامعة حول الأقمار الصناعية هي عازل حراري يحميها من حرارة الشمس وبرودة الفضاء الشديدة.',
    },
  },
  {
    id: 'space-lunar-mini-rover',
    archetype: 'planetary_rover',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f0f9ff',
    secondaryColor: '#f59e0b',
    accentColor: '#0284c7',
    lengthScale: 0.9,
    widthScale: 0.94,
    name: 'Petit Rover Lunaire',
    nameAr: 'العربة القمرية الاستكشافية',
    subtitle: 'Robot à roues métalliques explorant les cratères de la Lune',
    subtitleAr: 'روبوت بعجلات معدنية يستكشف فوهات وسطح القمر',
    discovery: {
      howItWorks:
        'Ses roues en treillis métallique souple ne peuvent jamais crever sur les cailloux coupants et son mât-caméra envoie des panoramas vers la Terre.',
      realRecord:
        'Les traces de roues laissées sur la Lune il y a plus de 50 ans sont toujours intactes car il n’y a ni vent ni pluie pour les effacer !',
      didYouKnow:
        'Sur la Lune, la gravité est 6 fois plus faible que sur Terre : un rover de 180 kg n’y pèse l’équivalent que de 30 kg !',
    },
    discoveryAr: {
      howItWorks:
        'صُنعت عجلاته من شبكة معدنية مرنة لا تنثقب أبداً فوق الصخور الحادة، ويرسل عمود الكاميرا صوراً بانورامية للأرض.',
      realRecord:
        'ما زالت آثار العجلات على سطح القمر واضحة منذ أكثر من 50 عاماً لعدم وجود رياح أو أمطار هناك!',
      didYouKnow:
        'تبلغ جاذبية القمر سدس جاذبية الأرض، لذا فإن عربة كتلتها 180 كغ يكون وزنها هناك كأنها 30 كغ فقط!',
    },
  },
  {
    id: 'space-sounding-rocket',
    archetype: 'space_rocket',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f8fafc',
    secondaryColor: '#ef4444',
    accentColor: '#f59e0b',
    lengthScale: 0.88,
    widthScale: 0.9,
    name: 'Fusée-Sonde Scientifique',
    nameAr: 'صاروخ الأبحاث الجوي',
    subtitle: 'Fusée élancée étudiant les aurores boréales dans la haute atmosphère',
    subtitleAr: 'صاروخ علمي رشيق لدراسة الشفق القطبي وطبقات الجو العليا',
    discovery: {
      howItWorks:
        'En éjectant des gaz chauds très vite vers le bas par sa tuyère, la fusée est propulsée vers le haut selon le principe d’action-réaction.',
      realRecord:
        'Une fusée-sonde grimpe à plus de 100 km d’altitude en seulement deux minutes avant que ses instruments ne redescendent sous parachute !',
      didYouKnow:
        'Une fusée fonctionne même mieux dans le vide de l’espace car elle n’a pas besoin d’air sur lequel s’appuyer : elle emporte son propre comburant.',
    },
    discoveryAr: {
      howItWorks:
        'ينفث الصاروخ الغازات الساخنة بسرعة هائلة نحو الأسفل عبر الفوهة فيندفع للأعلى وفق قانون الفعل ورد الفعل.',
      realRecord:
        'يصل صاروخ الأبحاث إلى ارتفاع يتجاوز 100 كيلومتر خلال دقيقتين فقط قبل عودة أجهزته بالمظلة!',
      didYouKnow:
        'يعمل الصاروخ بكفاءة أعلى في فراغ الفضاء لأنه لا يحتاج إلى الهواء للدفع بل يحمل المؤكسد معه.',
    },
  },
  {
    id: 'space-glider-orbiter',
    archetype: 'winged_orbiter_station',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f8fafc',
    secondaryColor: '#0f172a',
    accentColor: '#0284c7',
    lengthScale: 0.9,
    widthScale: 0.94,
    name: 'Mini-Navette Orbitale',
    nameAr: 'المكوك المداري المجنّح',
    subtitle: 'Vaisseau spatial à ailes delta capable de revenir se poser sur une piste',
    subtitleAr: 'مركبة فضائية بأجنحة مثلثة تعود لتهبط كالطائرة على المدرج',
    discovery: {
      howItWorks:
        'Lancée verticalement au sommet d’une fusée, elle utilise ses ailes delta pour planer dans l’atmosphère au retour et atterrir comme un avion.',
      realRecord:
        'Lors de la rentrée atmosphérique, une navette spatiale freine de 28 000 km/h à 350 km/h sans allumer de moteur, uniquement grâce à l’air !',
      didYouKnow:
        'Son ventre noir est tapissé de briques isolantes en silice si efficaces qu’on peut en tenir une par les coins quelques secondes après sa sortie du four.',
    },
    discoveryAr: {
      howItWorks:
        'تنطلق عمودياً فوق صاروخ، وعند العودة تستخدم أجنحتها المثلثة للانزلاق في الغلاف الجوي والهبوط على المدرج.',
      realRecord:
        'أثناء العودة للأرض، تنخفض سرعة المكوك من 28 ألف كم/س إلى 350 كم/س بفضل الكبح الهوائي وحده!',
      didYouKnow:
        'يُغطّى بطنه الأسود ببلاطات عازلة للحرارة فائقة الكفاءة تحميه من حرارة الاحتكاك الشديدة.',
    },
  },

  // =========================================================================
  // PALIER 2 · ATELIER — CHANTIER & ESPACE (8 SEEDS : 4 CHANTIER + 4 ESPACE)
  // =========================================================================
  {
    id: 'const-crawler-bulldozer',
    archetype: 'bulldozer_roller',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#f59e0b',
    secondaryColor: '#1e293b',
    accentColor: '#eab308',
    lengthScale: 1.02,
    widthScale: 1.04,
    name: 'Bulldozer à Lame Lourde',
    nameAr: 'البلدوزر المجنزر الثقيل',
    subtitle: 'Tracteur sur chenilles poussant rochers et terre avec son bouclier d’acier',
    subtitleAr: 'آلة جرف قوية على جنازير تدفع التربة والصخور بشفرتها العريضة',
    discovery: {
      howItWorks:
        'Ses larges chenilles métalliques mordent le sol sans glisser tandis que deux gros vérins inclinent la lame frontale au degré près.',
      realRecord:
        'Les plus grands bulldozers du monde pèsent plus de 100 tonnes et poussent 40 mètres cubes de roche d’un seul coup !',
      didYouKnow:
        'Beaucoup de bulldozers modernes sont guidés au centimètre près par satellite GPS pour niveler un terrain parfaitement plat.',
    },
    discoveryAr: {
      howItWorks:
        'تتشبث الجنازير الفولاذية العريضة بالأرض دون انزلاق بينما تتحكم الأسطوانات الهيدروليكية في زاوية الشفرة الأمامية.',
      realRecord:
        'يزيد وزن أضخم الجرافات في العالم على 100 طن وتستطيع دفع 40 متراً مكعباً من الصخور دفعة واحدة!',
      didYouKnow:
        'تُجهّز الجرافات الحديثة بأنظمة تحديد المواقع لتسوية الأرض بدقة تصل إلى السنتيمتر الواحد.',
    },
  },
  {
    id: 'const-concrete-mixer-rig',
    archetype: 'tractor_agri',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#0284c7',
    secondaryColor: '#facc15',
    accentColor: '#f97316',
    lengthScale: 1.04,
    widthScale: 1.02,
    name: 'Engin Malaxeur de Chantier',
    nameAr: 'خلاطة الخرسانة الميدانية',
    subtitle: 'Porteur tout-terrain gardant le béton brassé jusqu’au coulage',
    subtitleAr: 'مركبة بناء تحافظ على تجانس الخرسانة أثناء النقل والصب',
    discovery: {
      howItWorks:
        'Une lame en spirale (vis d’Archimède) soudée à l’intérieur tourne lentement pour brasser le béton dans un sens, et l’éjecte en tournant dans l’autre sens !',
      realRecord:
        'Sans ce brassage continu, plusieurs tonnes de béton durciraient en moins de 90 minutes !',
      didYouKnow:
        'C’est le savant grec Archimède qui a décrit le principe de cette vis sans fin il y a plus de 2 200 ans.',
    },
    discoveryAr: {
      howItWorks:
        'توجد بداخلها شفرة حلزونية تخلط الخرسانة عند الدوران في اتجاه، وتفرغها للخارج عند عكس اتجاه الدوران!',
      realRecord:
        'لولا هذا التقليب المستمر لتصلبت أطنان الخرسانة داخل الأسطوانة خلال أقل من 90 دقيقة!',
      didYouKnow:
        'يعتمد تفريغ الخلاطة على مبدأ «لولب أرخميدس» الهندسي الذي ابتُكر قبل أكثر من 2200 عام.',
    },
  },
  {
    id: 'const-telescopic-handler',
    archetype: 'forklift_crane',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#dc2626',
    secondaryColor: '#1e293b',
    accentColor: '#facc15',
    lengthScale: 1.04,
    widthScale: 1.04,
    name: 'Chariot Télescopique de Chantier',
    nameAr: 'الرافعة التلسكوبية متعددة المهام',
    subtitle: 'Élévateur tout-terrain hissant charpentes et briques jusqu’aux toits',
    subtitleAr: 'رافعة رباعية الدفع ترفع مواد البناء إلى الطوابق العلوية',
    discovery: {
      howItWorks:
        'Ses quatre roues directrices et son mât extensible permettent de déposer des palettes directement sur un échafaudage au troisième étage.',
      realRecord:
        'Les chariots télescopiques rotatifs atteignent jusqu’à 35 mètres de hauteur de levage !',
      didYouKnow:
        'Un capteur électronique mesure en permanence l’équilibre pour empêcher d’étendre le bras trop loin avec une charge lourde.',
    },
    discoveryAr: {
      howItWorks:
        'تسمح عجلاتها الأربع الموجهة وذراعها المتمدد برفع مواد البناء مباشرة إلى الأسقف والطوابق المرتفعة.',
      realRecord:
        'يصل ارتفاع الرفع في الشاحنات التلسكوبية الدوارة الحديثة إلى نحو 35 متراً!',
      didYouKnow:
        'يراقب مستشعر إلكتروني ذكي مركز الثقل باستمرار لمنع تمديد الذراع أكثر من الحد الآمن.',
    },
  },
  {
    id: 'const-urban-wheeled-excavator',
    archetype: 'excavator_tracked',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#0ea5e9',
    secondaryColor: '#334155',
    accentColor: '#f59e0b',
    lengthScale: 1.0,
    widthScale: 1.0,
    name: 'Pelleteuse Tourelle 360°',
    nameAr: 'حفّارة الأشغال الدورانية 360°',
    subtitle: 'Pelle hydraulique dont la cabine et le bras pivotent tout autour',
    subtitleAr: 'حفارة هيدروليكية يدور برجها ومقصورتها دورة كاملة في كل الاتجاهات',
    discovery: {
      howItWorks:
        'Une couronne dentée géante relie le châssis inférieur à la tourelle, qui peut tourner sans fin tout en faisant passer l’huile hydraulique au centre.',
      realRecord:
        'Un conducteur expérimenté peut saisir délicatement un ballon posé sur un plot avec le godet d’une pelle de 20 tonnes !',
      didYouKnow:
        'La pelle peut même utiliser la force de son bras contre le sol pour soulever ses propres chenilles et pivoter dans un espace étroit.',
    },
    discoveryAr: {
      howItWorks:
        'يربط ترس حلقي كبير القاعدة السفلية بالبرج العلوي ليسمح بالدوران الكامل مع مرور الزيت الهيدروليكي في المركز.',
      realRecord:
        'يستطيع المشغّل الماهر التقاط كرة صغيرة بدقة متناهية باستخدام دلو حفارة تزن 20 طناً!',
      didYouKnow:
        'يمكن للحفارة الاتكاء بذراعها القوي على الأرض لرفع جنازيرها وتعديل اتجاهها في الأماكن الضيقة.',
    },
  },

  {
    id: 'space-mars-explorer-rover',
    archetype: 'planetary_rover',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#f8fafc',
    secondaryColor: '#d97706',
    accentColor: '#0284c7',
    lengthScale: 1.02,
    widthScale: 1.04,
    name: 'Rover Géologue Martien',
    nameAr: 'عربة استكشاف كوكب المريخ',
    subtitle: 'Laboratoire roulant à 6 roues cherchant d’anciennes traces d’eau sur Mars',
    subtitleAr: 'مختبر متحرك بست عجلات يبحث عن آثار المياه القديمة على المريخ',
    discovery: {
      howItWorks:
        'Sa suspension articulée « rocker-bogie » garde toujours les 6 roues collées au sol même quand l’une d’elles franchit un gros rocher !',
      realRecord:
        'Le rover Opportunity, prévu au départ pour une mission de 90 jours sur Mars, a fonctionné pendant près de 15 ans et parcouru 45 km !',
      didYouKnow:
        'Comme un signal radio met entre 4 et 22 minutes pour aller de la Terre à Mars, le rover doit savoir éviter seul les obstacles.',
    },
    discoveryAr: {
      howItWorks:
        'يحافظ نظام التعليق المفصلي الذكي على ملامسة العجلات الست جميعها للأرض حتى أثناء تسلق الصخور الكبيرة!',
      realRecord:
        'صُممت عربة «أوبورتيونيتي» لمهمة مدتها 90 يوماً فقط على المريخ، لكنها واصلت العمل لقرابة 15 عاماً!',
      didYouKnow:
        'تستغرق الإشارة اللاسلكية من 4 إلى 22 دقيقة للوصول إلى المريخ، لذا تتجنب العربة العوائق ذاتياً.',
    },
  },
  {
    id: 'space-gps-constellation-sat',
    archetype: 'orbital_satellite',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#1e3a8a',
    secondaryColor: '#f59e0b',
    accentColor: '#38bdf8',
    lengthScale: 1.02,
    widthScale: 1.06,
    name: 'Satellite de Navigation Galileo',
    nameAr: 'قمر الملاحة وتحديد المواقع',
    subtitle: 'Horloge atomique en orbite guidant bateaux, avions et randonneurs',
    subtitleAr: 'قمر صناعي مزود بساعة ذرية دقيقة لإرشاد السفن والطائرات حول العالم',
    discovery: {
      howItWorks:
        'Il émet en permanence l’heure exacte : ton récepteur calcule sa distance à au moins 4 satellites pour connaître ta position sur Terre.',
      realRecord:
        'Les horloges atomiques embarquées dans les satellites Galileo ne dérivent même pas d’une seconde en trois millions d’années !',
      didYouKnow:
        'Pour rester ultra-précises, ces horloges corrigent même le léger décalage du temps prévu par la relativité d’Albert Einstein !',
    },
    discoveryAr: {
      howItWorks:
        'يبث القمر الصناعي التوقيت فائق الدقة باستمرار، ويحسب جهازك المسافة إلى 4 أقمار لتحديد موقعك بدقة.',
      realRecord:
        'تبلغ دقة الساعات الذرية على متن أقمار الملاحة درجة أنها لا تخطئ بثانية واحدة خلال ملايين السنين!',
      didYouKnow:
        'تُبرمج هذه الأقمار لتعويض فرق الزمن الضئيل الناتج عن الجاذبية والسرعة وفق نظرية النسبية لأينشتاين!',
    },
  },
  {
    id: 'space-orbital-supply-launcher',
    archetype: 'space_rocket',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#f8fafc',
    secondaryColor: '#0284c7',
    accentColor: '#f59e0b',
    lengthScale: 1.0,
    widthScale: 0.98,
    name: 'Lanceur Orbital à Deux Étages',
    nameAr: 'صاروخ الإطلاق المداري ثنائي المراحل',
    subtitle: 'Fusée modulaire larguant son premier réservoir vide pour aller plus vite',
    subtitleAr: 'صاروخ متعدد المراحل يفصل خزانه الأول الفارغ للوصول إلى المدار',
    discovery: {
      howItWorks:
        'Dès que le premier étage a brûlé son carburant, il se détache : allégé de ce grand poids mort, le second étage accélère jusqu’à l’orbite !',
      realRecord:
        'Pour rester en orbite autour de la Terre sans retomber, un lanceur doit atteindre la vitesse vertigineuse de 28 000 km/h ( près de 8 km par seconde ) !',
      didYouKnow:
        'Sous la coiffe pointue, le satellite est protégé du vent supersonique pendant la traversée de l’atmosphère.',
    },
    discoveryAr: {
      howItWorks:
        'بمجرد نفاد وقود المرحلة الأولى تنفصل، فيخف وزن الصاروخ وتتسارع المرحلة الثانية حتى تبلغ المدار!',
      realRecord:
        'للبقاء في مدار مستقر حول الأرض، يجب أن تصل سرعة الصاروخ إلى 28 ألف كم/س (نحو 8 كم في الثانية)!',
      didYouKnow:
        'يحمي الغطاء الانسيابي العلوي القمر الصناعي من ضغط الهواء الهائل ريثما يخرج الصاروخ من الغلاف الجوي.',
    },
  },
  {
    id: 'space-cargo-resupply-ship',
    archetype: 'winged_orbiter_station',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#e0f2fe',
    secondaryColor: '#0284c7',
    accentColor: '#f59e0b',
    lengthScale: 0.98,
    widthScale: 0.96,
    name: 'Cargo Ravitailleur Spatial',
    nameAr: 'مركبة الإمداد المداري الآلية',
    subtitle: 'Vaisseau automatique livrant eau, oxygène et expériences aux astronautes',
    subtitleAr: 'مركبة فضائية ذاتية التوجيه تنقل الغذاء والأكسجين والمعدات لرواد الفضاء',
    discovery: {
      howItWorks:
        'Guidé par capteurs laser et petits propulseurs d’attitude, il s’approche tout doucement de la station spatiale à quelques centimètres par seconde.',
      realRecord:
        'Ce rendez-vous au millimètre près se déroule alors que les deux vaisseaux filent ensemble à 28 000 km/h autour de la Terre !',
      didYouKnow:
        'En plus des provisions et outils scientifiques, chaque cargo apporte des fruits frais très attendus par l’équipage en orbite.',
    },
    discoveryAr: {
      howItWorks:
        'تقترب المركبة آلياً ببطء شديد نحو المحطة الفضائية مستعينة بمستشعرات الليزر ودافعات التوجيه الدقيقة.',
      realRecord:
        'تتم عملية الالتحام بدقة المليمتر بينما تطير المركبتان معاً بسرعة 28 ألف كم/س حول كوكب الأرض!',
      didYouKnow:
        'تحمل مركبات الإمداد معها تجارب علمية ومياهاً وفواكه طازجة ينتظرها رواد الفضاء بشوق.',
    },
  },

  // =========================================================================
  // PALIER 3 · INGÉNIEUR — CHANTIER & ESPACE (8 SEEDS : 4 CHANTIER + 4 ESPACE)
  // =========================================================================
  {
    id: 'const-combine-harvester',
    archetype: 'tractor_agri',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#eab308',
    secondaryColor: '#dc2626',
    accentColor: '#1e293b',
    lengthScale: 1.08,
    widthScale: 1.1,
    name: 'Moissonneuse-Batteuse Géante',
    nameAr: 'الحصّادة الزراعية المتكاملة',
    subtitle: 'Usine agricole mobile qui coupe le blé, sépare le grain et trie la paille',
    subtitleAr: 'آلة زراعية متكاملة تحصد القمح وتفصل الحبوب عن القش تلقائياً',
    discovery: {
      howItWorks:
        'La barre de coupe avant fauche les épis, un tambour batteur détache les grains, puis des grilles vibrantes et un ventilateur séparent la paille légère !',
      realRecord:
        'Une grande moissonneuse moderne récolte en une seule heure de quoi fabriquer plus de 70 000 baguettes de pain !',
      didYouKnow:
        'Avant cette invention qui réunit trois machines en une (moissonner, battre, vanner), la récolte d’un champ demandait des semaines à tout un village.',
    },
    discoveryAr: {
      howItWorks:
        'تقص وحدة الحصاد الأمامية السنابل، وتفصل الأسطوانة الداخلية الحبوب، بينما تنقي المراوح القش الخفيف تلقائياً!',
      realRecord:
        'تحصد الحصادة الحديثة في ساعة واحدة كمية قمح تكفي لصناعة أكثر من 70 ألف رغيف خبز!',
      didYouKnow:
        'تجمع هذه الآلة ثلاث عمليات زراعية معاً (الحصاد والدراس والتذرية) كانت تستغرق أسابيع طويلة قديماً.',
    },
  },
  {
    id: 'const-demolition-long-reach',
    archetype: 'excavator_tracked',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#f97316',
    secondaryColor: '#0f172a',
    accentColor: '#facc15',
    lengthScale: 1.1,
    widthScale: 1.08,
    name: 'Pelle Grand Bras de Chantier',
    nameAr: 'حفّارة الذراع الطويل الهندسية',
    subtitle: 'Excavatrice lourde à contrepoids renforcé pour grands terrassements',
    subtitleAr: 'حفارة ثقيلة بذراع طويل وثقل موازنة كبير للأشغال الكبرى',
    discovery: {
      howItWorks:
        'Plus le bras s’allonge, plus l’effet de levier augmente : un massif contrepoids arrière et de larges chenilles assurent une stabilité parfaite.',
      realRecord:
        'Les pelles à grand bras atteignent le sommet d’immeubles de 15 à 20 étages depuis le sol en grignotant et triant les matériaux pour les recycler !',
      didYouKnow:
        'Aujourd’hui, plus de 90 % du béton et de l’acier récupérés sur les grands chantiers sont concassés et réutilisés.',
    },
    discoveryAr: {
      howItWorks:
        'كلما زاد طول الذراع زاد عزم الرافعة، لذا يضمن ثقل الموازنة الخلفي والجنازير العريضة ثبات الآلة تماماً.',
      realRecord:
        'يصل ارتفاع أذرع الحفارات الهندسية العملاقة إلى مستوى مبنى مكون من 15 إلى 20 طابقاً!',
      didYouKnow:
        'يُعاد تدوير أكثر من 90% من الخرسانة والفولاذ الناتج عن أعمال التفكيك الهندسي الحديث.',
    },
  },
  {
    id: 'const-port-container-reach',
    archetype: 'forklift_crane',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#0284c7',
    secondaryColor: '#facc15',
    accentColor: '#ef4444',
    lengthScale: 1.1,
    widthScale: 1.08,
    name: 'Élévateur Portuaire à Conteneurs',
    nameAr: 'رافعة الحاويات في الميناء',
    subtitle: 'Colosse de quai soulevant des conteneurs maritimes de 40 tonnes',
    subtitleAr: 'رافعة موانئ جبارة تحمل حاويات الشحن البحرية زنة 40 طناً',
    discovery: {
      howItWorks:
        'Son mât ultra-rigide et son essieu avant jumelé soulèvent des boîtes métalliques entières pour les empiler sur 5 hauteurs sur le quai.',
      realRecord:
        'Un élévateur portuaire soulève 45 tonnes — soit le poids de 30 voitures familiales réunies — en quelques secondes !',
      didYouKnow:
        'Quatre verrous rotatifs appelés « twist-locks » s’enclenchent aux quatre coins du conteneur d’un simple quart de tour.',
    },
    discoveryAr: {
      howItWorks:
        'يرفع الصاري الفولاذي المقوى والمحور الأمامي المزدوج حاويات كاملة لترتيبها في خمس طبقات فوق رصيف الميناء.',
      realRecord:
        'ترفع هذه الآلة المينائية حمولة تصل إلى 45 طناً، أي ما يعادل وزن 30 سيارة عائلية مجتمعة!',
      didYouKnow:
        'تُقفل الحاوية بأمان تام من زواياها الأربع عبر أقفال فولاذية دوارة تدور ربع دورة فقط.',
    },
  },
  {
    id: 'const-alpine-snow-groomer',
    archetype: 'bulldozer_roller',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#dc2626',
    secondaryColor: '#1e293b',
    accentColor: '#38bdf8',
    lengthScale: 1.06,
    widthScale: 1.14,
    name: 'Dameuse de Pistes Haute Montagne',
    nameAr: 'كاسحة وممهّدة الثلوج الجبلية',
    subtitle: 'Engin à très larges chenilles sculptant la neige sur les pentes raides',
    subtitleAr: 'مركبة جبلية عريضة الجنازير لتمهيد المنحدرات الثلجية',
    discovery: {
      howItWorks:
        'Ses chenilles extra-larges exercent moins de pression au centimètre carré sur la neige que la chaussure d’un promeneur à pied !',
      realRecord:
        'Une dameuse alpine grimpe des pentes enneigées inclinées à 45° (100 % de pente) là où il est presque impossible de tenir debout !',
      didYouKnow:
        'Les fines rainures qu’elle laisse derrière elle protègent la neige de fondre trop vite aux premiers rayons du soleil.',
    },
    discoveryAr: {
      howItWorks:
        'توزع جنازيرها العريضة جداً الوزن بحيث يكون ضغطها على كل سنتيمتر من الثلج أقل من ضغط قدم الإنسان!',
      realRecord:
        'تتسلق كاسحة الثلوج الجبلية منحدرات ثلجية تصل زاوية ميلانها إلى 45 درجة بثبات مذهل!',
      didYouKnow:
        'تساعد الخطوط المنتظمة التي تتركها على الثلج في عكس أشعة الشمس وتقليل سرعة الذوبان.',
    },
  },

  {
    id: 'space-deep-space-telescope',
    archetype: 'orbital_satellite',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#cbd5e1',
    secondaryColor: '#f59e0b',
    accentColor: '#38bdf8',
    lengthScale: 1.08,
    widthScale: 1.1,
    name: 'Télescope Spatial Orbital',
    nameAr: 'التلسكوب الفضائي المداري',
    subtitle: 'Observatoire astronomique admirant les galaxies loin des nuages terrestres',
    subtitleAr: 'مرصد فلكي يدور في الفضاء لرصد المجرات البعيدة بوضوح فائق',
    discovery: {
      howItWorks:
        'Placé au-dessus de l’atmosphère qui fait scintiller les étoiles, il s’oriente sans fusée grâce à des roues de réaction qui tournent à l’intérieur !',
      realRecord:
        'Le télescope spatial Hubble peut viser une étoile lointaine avec la précision d’un rayon laser pointé sur une pièce de monnaie à 300 km !',
      didYouKnow:
        'Comme la lumière des étoiles lointaines met des millions d’années à nous parvenir, un télescope spatial observe littéralement le passé de l’Univers.',
    },
    discoveryAr: {
      howItWorks:
        'يعمل خارج الغلاف الجوي بعيداً عن السحب، ويوجه نفسه بدقة مذهلة عبر عجلات توازن دوارة بالداخل دون نفث وقود!',
      realRecord:
        'تبلغ دقة توجيه التلسكوب الفضائي درجة تعادل تسليط شعاع ليزر على قطعة نقدية من مسافة 300 كيلومتر!',
      didYouKnow:
        'لأن ضوء النجوم البعيدة يستغرق ملايين السنين ليصلنا، فإن التلسكوب يرصد تاريخ الكون القديم.',
    },
  },
  {
    id: 'space-perseverance-lab-rover',
    archetype: 'planetary_rover',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#f8fafc',
    secondaryColor: '#0284c7',
    accentColor: '#f59e0b',
    lengthScale: 1.08,
    widthScale: 1.08,
    name: ' Grand Rover Astrobiologiste',
    nameAr: 'العربة الجوالة للبحث الجيولوجي الفضائي',
    subtitle: 'Robot de la taille d’une voiture analysant les roches avec un laser',
    subtitleAr: 'روبوت بحجم سيارة يحلل مكونات الصخور الكوكبية بأشعة الليزر',
    discovery: {
      howItWorks:
        'Son mât porte un instrument laser qui vaporise une poussière de roche à 7 mètres de distance et analyse la couleur de l’étincelle pour connaître sa chimie !',
      realRecord:
        'Déposé en douceur par une grue volante (« Sky Crane »), le rover Perseverance pèse plus d’une tonne (1 025 kg) !',
      didYouKnow:
        'Il a même fabriqué pour la première fois de l’oxygène respirable directement à partir du gaz carbonique de l’atmosphère martienne !',
    },
    discoveryAr: {
      howItWorks:
        'يطلق الرأس العلوي نبضة ليزر دقيقة نحو الصخور من مسافة 7 أمتار ويحلل طيف الضوء لمعرفة معادنها فوراً!',
      realRecord:
        'تزن العربة الجوالة المتطورة أكثر من طن كامل وقد هبطت برفق بواسطة رافعة صاروخية طائرة!',
      didYouKnow:
        'نجحت تجربتها العلمية في إنتاج أكسجين نقي مباشرة من غاز ثاني أكسيد الكربون الموجود في جو المريخ!',
    },
  },
  {
    id: 'space-heavy-booster-rocket',
    archetype: 'space_rocket',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#f8fafc',
    secondaryColor: '#1e293b',
    accentColor: '#ef4444',
    lengthScale: 1.08,
    widthScale: 1.04,
    name: 'Lanceur Lourd à Propulseurs Latéraux',
    nameAr: 'الصاروخ الفضائي ذو المعززات الجانبية',
    subtitle: 'Fusée géante assistée par deux boosters au décollage pour quitter la gravité',
    subtitleAr: 'صاروخ عملاق مدعوم بمعززين جانبيين للتغلب على جاذبية الأرض عند الإقلاع',
    discovery: {
      howItWorks:
        'Au moment le plus lourd — le décollage — les deux propulseurs latéraux fournissent jusqu’à 80 % de la poussée avant d’être largués à haute altitude.',
      realRecord:
        'Une fusée lourde telle qu’Ariane ou Falcon Heavy développe au décollage une puissance équivalente à celle de plusieurs centrales électriques !',
      didYouKnow:
        'Sur le pas de tir, d’immenses jets d’eau sont déversés sous les tuyères non pas pour refroidir, mais pour étouffer les ondes sonores géantes !',
    },
    discoveryAr: {
      howItWorks:
        'عند لحظة الإقلاع الثقيلة، يوفر المعززان الجانبيان قرابة 80% من قوة الدفع قبل انفصالهما في الأعالي.',
      realRecord:
        'تولد الصواريخ الفضائية الثقيلة عند انطلاقها قدرة هائلة تعادل إنتاج عدة محطات طاقة كهربائية مجتمعة!',
      didYouKnow:
        'تُضخ كميات هائلة من المياه تحت المنصة لحظة الإقلاع لامتصاص الموجات الصوتية العنيفة وحماية الصاروخ!',
    },
  },
  {
    id: 'space-orbital-research-station',
    archetype: 'winged_orbiter_station',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#f8fafc',
    secondaryColor: '#2563eb',
    accentColor: '#f59e0b',
    lengthScale: 1.08,
    widthScale: 1.08,
    name: 'Vaisseau Laboratoire Orbital',
    nameAr: 'المركبة المختبرية المدارية',
    subtitle: 'Module spatial habité pour mener des expériences en apesanteur',
    subtitleAr: 'مركبة فضائية مأهولة لإجراء التجارب العلمية في انعدام الجاذبية',
    discovery: {
      howItWorks:
        'En orbite, le vaisseau et ses astronautes tombent librement autour de la courbe de la Terre : tout flotte en micropesanteur !',
      realRecord:
        'À 400 km d’altitude, les astronautes font le tour complet de la Terre en 90 minutes et voient 16 levers et 16 couchers de soleil par jour !',
      didYouKnow:
        'En apesanteur, une flamme de bougie ne monte pas en pointe : elle forme une petite boule bleue toute ronde !',
    },
    discoveryAr: {
      howItWorks:
        'في المدار تتحرك المركبة وروادها في سقوط حر مستمر حول انحناء الأرض فتطفو الأجسام في انعدام الوزن!',
      realRecord:
        'يكمل رواد الفضاء دورة كاملة حول الأرض كل 90 دقيقة ويشاهدون 16 شروقاً و16 غروباً للشمس يومياً!',
      didYouKnow:
        'في انعدام الجاذبية لا يرتفع لهب الشمعة للأعلى بل يتخذ شكل كرة زرقاء صغيرة مستديرة!',
    },
  },

  // =========================================================================
  // PALIER 4 · EXPERT — CHANTIER & ESPACE (8 SEEDS : 4 CHANTIER + 4 ESPACE)
  // =========================================================================
  {
    id: 'const-tunnel-miner-excavator',
    archetype: 'excavator_tracked',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#eab308',
    secondaryColor: '#0f172a',
    accentColor: '#0284c7',
    lengthScale: 1.14,
    widthScale: 1.12,
    name: 'Excavatrice Minière Géante',
    nameAr: 'حفّارة المناجم الهيدروليكية العملاقة',
    subtitle: 'Pelle hydraulique colossale chargeant des camions géants en trois coups de godet',
    subtitleAr: 'حفارة عملاقة تملأ شاحنات المناجم الضخمة في ثلاث غرفات فقط',
    discovery: {
      howItWorks:
        'Deux moteurs couplés entraînent une centrale hydraulique haute pression capable de soulever un bloc de roche gros comme un salon.',
      realRecord:
        'Les plus grandes pelles hydrauliques minières pèsent près de 1 000 tonnes et leur godet peut contenir jusqu’à 45 mètres cubes de minerai !',
      didYouKnow:
        'Elles sont acheminées en dizaines de convois séparés puis assemblées boulon par boulon directement sur place comme dans ton atelier !',
    },
    discoveryAr: {
      howItWorks:
        'يدير محركان مزدوجان وحدة هيدروليكية عملاقة قادرة على رفع كتلة صخرية بحجم غرفة كاملة.',
      realRecord:
        'يقارب وزن أكبر الحفارات الهيدروليكية في العالم 1000 طن ويتسع دلوها لنحو 45 متراً مكعباً من الصخور!',
      didYouKnow:
        'تُنقل هذه الآلات العملاقة مفككة على عشرات الشاحنات ثم تُجمّع قطعة بقطعة في الموقع تماماً كما تفعل هنا!',
    },
  },
  {
    id: 'const-bridge-girder-crane',
    archetype: 'forklift_crane',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#f59e0b',
    secondaryColor: '#1e3a8a',
    accentColor: '#ef4444',
    lengthScale: 1.14,
    widthScale: 1.1,
    name: 'Engin Poseur de Viaducs',
    nameAr: 'آلة رفع وتركيب الجسور',
    subtitle: 'Élévateur industriel de haute précision assemblant les piles et tabliers de ponts',
    subtitleAr: 'رافعة هندسية عالية الدقة لرفع وتركيب عوارض الجسور الخرسانية',
    discovery: {
      howItWorks:
        'Ses vérins synchronisés par capteurs électroniques soulèvent une poutre de béton géante tout en la gardant parfaitement horizontale.',
      realRecord:
        'Les engins de levage de grands viaducs déplacent et posent des voussoirs de pont pesant plusieurs centaines de tonnes au millimètre près !',
      didYouKnow:
        'Construire un pont par éléments préfabriqués assemblés permet de franchir de profondes vallées sans bloquer la rivière en dessous.',
    },
    discoveryAr: {
      howItWorks:
        'ترفع الأسطوانات المتزامنة إلكترونياً عوارض الجسور العملاقة مع الحفاظ على استوائها الأفقي التام.',
      realRecord:
        'تضع معدات بناء الجسور الحديثة مقاطع خرسانية تزن مئات الأطنان في موضعها بدقة المليمتر!',
      didYouKnow:
        'يتيح تجميع الجسور من قطع مسبقة الصنع عبور الأودية العميقة والأنهار بأمان وسرعة قياسية.',
    },
  },
  {
    id: 'const-precision-laser-dozer',
    archetype: 'bulldozer_roller',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#10b981',
    secondaryColor: '#1e293b',
    accentColor: '#facc15',
    lengthScale: 1.12,
    widthScale: 1.1,
    name: 'Niveleuse Guidée par Laser',
    nameAr: 'آلة التسوية الموجهة بالليزر',
    subtitle: 'Engin hybride de terrassement préparant les pistes d’aéroport et voies TGV',
    subtitleAr: 'آلة تسوية هجينة تُعدّ مدارج المطارات ومسارات القطارات السريعة بدقة فائقة',
    discovery: {
      howItWorks:
        'Deux récepteurs sur la lame captent un plan laser rotatif sur le chantier et ajustent les vérins 20 fois par seconde pour un sol parfait.',
      realRecord:
        'Pour une piste d’atterrissage ou une ligne à grande vitesse, l’écart de niveau toléré ne dépasse pas quelques millimètres sur 10 mètres !',
      didYouKnow:
        'Sa propulsion diesel-électrique réduit de 25 % la consommation tout en offrant une poussée ultra-douce sans boîte de vitesses mécanique.',
    },
    discoveryAr: {
      howItWorks:
        'يلتقط مستشعران شعاع ليزر مرجعي في الموقع ويعدلان ارتفاع الشفرة 20 مرة في الثانية للحصول على سطح مستوٍ تماماً.',
      realRecord:
        'في مدارج الطائرات ومسارات القطارات السريعة، لا يتجاوز التفاوت المسموح به بضعة مليمترات فقط!',
      didYouKnow:
        'يقلل نظام الدفع الهجين استهلاك الطاقة بنحو 25% مع منح حركة سلسة ودقيقة للغاية.',
    },
  },
  {
    id: 'const-autonomous-agro-harvester',
    archetype: 'tractor_agri',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#0284c7',
    secondaryColor: '#f8fafc',
    accentColor: '#22c55e',
    lengthScale: 1.12,
    widthScale: 1.12,
    name: 'Moissonneuse Robotisée GPS RTK',
    nameAr: 'الحصّادة الذكية الموجهة بالأقمار الصناعية',
    subtitle: 'Machine agricole de haute technologie guidée au centimètre près dans les champs',
    subtitleAr: 'آلة حصاد عالية التقنية تعمل بتوجيه الأقمار الصناعية بدقة السنتيمتر',
    discovery: {
      howItWorks:
        'Grâce au GPS cinématique temps réel (RTK), elle suit chaque rangée au centimètre près sans jamais repasser deux fois au même endroit.',
      realRecord:
        'Sa barre de coupe large jusqu’à 12 mètres récolte une bande large comme quatre voies d’autoroute en un seul passage !',
      didYouKnow:
        'Des capteurs infrarouges mesurent en direct l’humidité et la richesse en protéines des grains pendant qu’ils tombent dans la trémie.',
    },
    discoveryAr: {
      howItWorks:
        'بفضل نظام تحديد المواقع فائق الدقة تسير الآلة في خطوط متوازية بدقة السنتيمتر دون تداخل أو هدر.',
      realRecord:
        'يصل عرض وحدة القص في الحصادات الكبرى إلى 12 متراً، أي بعرض أربع حارات مرورية دفعة واحدة!',
      didYouKnow:
        'تقيس مستشعرات الأشعة تحت الحمراء نسبة الرطوبة وجودة الحبوب لحظياً أثناء جمعها في الخزان.',
    },
  },

  {
    id: 'space-interplanetary-probe',
    archetype: 'orbital_satellite',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#1e293b',
    secondaryColor: '#f59e0b',
    accentColor: '#38bdf8',
    lengthScale: 1.12,
    widthScale: 1.18,
    name: 'Sonde Interplanétaire Jupiter',
    nameAr: 'مسبار استكشاف الكواكب العملاقة',
    subtitle: 'Explorateur robotisé à grands panneaux solaires voyageant vers les lunes glacées',
    subtitleAr: 'مسبار فضائي بألواح شمسية عملاقة يسافر لدراسة المشتري وأقماره الجليدية',
    discovery: {
      howItWorks:
        'Comme la lumière du Soleil est 25 fois plus faible près de Jupiter que près de la Terre, la sonde déploie d’immenses panneaux solaires ultrasensibles.',
      realRecord:
        'La sonde européenne JUICE parcourt des milliards de kilomètres en utilisant l’effet « fronde gravitationnelle » des planètes pour accélérer gratuitement !',
      didYouKnow:
        'Sa grande antenne parabolique pointe vers la Terre avec une précision extrême pour transmettre ses images à travers tout le Système solaire.',
    },
    discoveryAr: {
      howItWorks:
        'نظراً لأن ضوء الشمس عند كوكب المشتري أضعف بـ 25 مرة مما هو عند الأرض، ينشر المسبار ألواحاً شمسية عملاقة عالية الحساسية.',
      realRecord:
        'يقطع المسبار الفضائي مليارات الكيلومترات مستفيداً من جاذبية الكواكب كـ«مقلاع كوني» لزيادة سرعته دون وقود إضافي!',
      didYouKnow:
        'يوجه طبقه اللاقط الكبير نحو الأرض بدقة فائقة لإرسال الصور والبيانات عبر أعماق المجموعة الشمسية.',
    },
  },
  {
    id: 'space-lunar-pressurized-cruiser',
    archetype: 'planetary_rover',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#f8fafc',
    secondaryColor: '#0284c7',
    accentColor: '#eab308',
    lengthScale: 1.14,
    widthScale: 1.12,
    name: 'Rover Lunaire Pressurisé',
    nameAr: 'العربة القمرية المأهولة المضغوطة',
    subtitle: 'Camping-car spatial permettant aux astronautes d’explorer la Lune sur plusieurs semaines',
    subtitleAr: 'مركبة قمرية مضغوطة تتيح لرواد الفضاء الاستكشاف لأسابيع طويلة',
    discovery: {
      howItWorks:
        'Les astronautes vivent et conduisent à l’intérieur en manches de chemise grâce à l’air respirable recyclé, et sortent par un sas pour prélever des roches.',
      realRecord:
        'Cette nouvelle génération de rovers lunaires multipliera le rayon d’exploration autour d’une base lunaire à plus de 100 kilomètres !',
      didYouKnow:
        'Ses panneaux solaires orientables cherchent la lumière rasante des cratères du pôle Sud lunaire où se cache de la glace d’eau.',
    },
    discoveryAr: {
      howItWorks:
        'يتنفس رواد الفضاء الهواء الطبيعي داخل المقصورة المحكمة دون ارتداء البدلات الثقيلة، ويخرجون عبر غرفة معادلة الضغط لجمع العينات.',
      realRecord:
        'توسع هذه العربات القمرية الحديثة نطاق الاستكشاف البشري حول القاعدة القمرية إلى أكثر من 100 كيلومتر!',
      didYouKnow:
        'تتدور ألواحها الشمسية لالتقاط ضوء الشمس المائل عند القطب الجنوبي للقمر حيث توجد رواسب الجليد المائي.',
    },
  },
  {
    id: 'space-reusable-orbital-rocket',
    archetype: 'space_rocket',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#f8fafc',
    secondaryColor: '#0f172a',
    accentColor: '#0284c7',
    lengthScale: 1.12,
    widthScale: 1.06,
    name: 'Fusée Orbitale Réutilisable',
    nameAr: 'الصاروخ المداري القابل لإعادة الاستخدام',
    subtitle: 'Lanceur de pointe dont le premier étage revient se poser debout tout seul',
    subtitleAr: 'صاروخ فضائي متطور تعود مرحلته الأولى لتهبط عمودياً بدقة ذاتية',
    discovery: {
      howItWorks:
        'Après avoir propulsé le second étage vers l’espace, le booster oriente sa descente avec des grilles aérodynamiques puis rallume ses moteurs pour se poser en douceur !',
      realRecord:
        'Un même premier étage de fusée réutilisable a déjà volé et réatterri avec succès plus de 20 fois de suite sur une barge en pleine mer !',
      didYouKnow:
        'Faire revenir un cylindre haut comme un immeuble de 14 étages au centre d’une cible flottante demande autant de précision que tenir un crayon debout sur son doigt.',
    },
    discoveryAr: {
      howItWorks:
        'بعد دفع المرحلة الثانية نحو الفضاء، يوجه المعزز هبوطه بزعانف شبكية ثم يعيد تشغيل محركاته ليهبط عمودياً برفق!',
      realRecord:
        'نجح معزز صاروخي واحد قابل لإعادة الاستخدام في الإقلاع والهبوط العمودي أكثر من 20 مرة متتالية على منصة بحرية!',
      didYouKnow:
        'يشبه هبوط أسطوانة بارتفاع مبنى من 14 طابقاً عمودياً وسط البحر موازنة قلم رصاص على طرف إصبعك في الهواء.',
    },
  },
  {
    id: 'space-winged-shuttle-expedition',
    archetype: 'winged_orbiter_station',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#f8fafc',
    secondaryColor: '#1e293b',
    accentColor: '#f97316',
    lengthScale: 1.12,
    widthScale: 1.1,
    name: 'Grande Navette Spatiale à Soute',
    nameAr: 'المكوك الفضائي الكبير ذو حجرة الحمولة',
    subtitle: 'Avion-fusée orbital équipé d’une soute ouvrante et d’un bras robotisé',
    subtitleAr: 'مكوك فضائي مزود بحجرة حمولة واسعة لبناء وصيانة المراصد المدارية',
    discovery: {
      howItWorks:
        'Une fois en orbite, les grandes portes de sa soute s’ouvrent autant pour libérer des satellites que pour évacuer la chaleur par des radiateurs internes.',
      realRecord:
        'Les navettes spatiales ont effectué 135 missions orbitales et ont permis d’assembler la Station Spatiale Internationale et de réparer Hubble en orbite !',
      didYouKnow:
        'Son célèbre bras articulé Canadarm de 15 mètres ne pouvait pas soulever son propre poids sur Terre, mais déplaçait 30 tonnes sans effort en apesanteur !',
    },
    discoveryAr: {
      howItWorks:
        'بمجرد الوصول للمدار تُفتح بوابات حجرة الحمولة لإطلاق الأقمار الصناعية وكذلك لتبريد المركبة عبر المشعات الحرارية.',
      realRecord:
        'نفذت المكوكات الفضائية 135 مهمة مدارية ساهمت في بناء المحطة الفضائية الدولية وصيانة تلسكوب هابل في الفضاء!',
      didYouKnow:
        'كانت الذراع الروبوتية الشهيرة بطول 15 متراً تحرك حمولات تزن 30 طناً بسهولة تامة في انعدام الوزن!',
    },
  },

  // =========================================================================
  // PALIER 5 · MAÎTRE CONSTRUCTEUR — CHANTIER & ESPACE (8 SEEDS)
  // =========================================================================
  {
    id: 'const-subsea-trencher-crawler',
    archetype: 'excavator_tracked',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.MASTER,
    primaryColor: '#facc15',
    secondaryColor: '#0369a1',
    accentColor: '#f97316',
    lengthScale: 1.16,
    widthScale: 1.16,
    name: 'Excavatrice Sous-Marine Téléopérée',
    nameAr: 'الحفّارة البحرية العميقة الموجهة عن بُعد',
    subtitle: 'Robot chenillé géant posant les câbles internet au fond des océans',
    subtitleAr: 'آلة مجنزرة عملاقة تعمل في قاع البحر لمد كابلات الألياف الضوئية',
    discovery: {
      howItWorks:
        'Pilotée depuis un navire en surface via un câble ombilical, elle roule directement sur le fond marin pour enfouir et protéger les câbles en fibre optique.',
      realRecord:
        'Plus de 98 % des communications internet entre les continents passent non pas par les satellites, mais par plus d’un million de kilomètres de câbles sous-marins !',
      didYouKnow:
        'Tous ses moteurs et vérins sont compensés en pression d’huile pour résister à des centaines de mètres sous l’eau sans écrasement.',
    },
    discoveryAr: {
      howItWorks:
        'تُقاد عن بُعد من سفينة على السطح عبر كابل تحكم، وتسير فوق قاع البحر لحفر وحماية كابلات الألياف الضوئية.',
      realRecord:
        'يمر أكثر من 98% من حركة الإنترنت العالمية بين القارات عبر أكثر من مليون كيلومتر من الكابلات البحرية في قاع المحيطات!',
      didYouKnow:
        'تُعادل ضغوط الزيت داخل محركاتها وأسطواناتها الضغط المائي الخارجي لتعمل بسلام على أعماق كبيرة.',
    },
  },
  {
    id: 'const-mega-crawler-transporter',
    archetype: 'bulldozer_roller',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.MASTER,
    primaryColor: '#b45309',
    secondaryColor: '#f59e0b',
    accentColor: '#0284c7',
    lengthScale: 1.2,
    widthScale: 1.2,
    name: 'Transporteur Géant à Chenilles Spatiales',
    nameAr: 'الناقلة المجنزرة العملاقة للصواريخ',
    subtitle: 'Plus grand véhicule autopropulsé terrestre portant les fusées jusqu’au pas de tir',
    subtitleAr: 'أضخم مركبة برية ذاتية الحركة تنقل الصواريخ العملاقة عمودياً إلى منصة الإطلاق',
    discovery: {
      howItWorks:
        'Ses vérins hydrauliques maintiennent la plateforme supérieure horizontale à moins d’un dixième de degré près pendant qu’elle monte la rampe avec une fusée debout !',
      realRecord:
        'Le Crawler-Transporter de Cap Canaveral pèse lui-même près de 3 000 tonnes et peut porter une fusée lunaire complète de plus de 8 000 tonnes !',
      didYouKnow:
        'Chacun des 456 patins d’acier qui composent ses chenilles pèse à lui seul près d’une tonne !',
    },
    discoveryAr: {
      howItWorks:
        'تحافظ أسطوانات الموازنة الهيدروليكية على استواء المنصة العلوية بدقة متناهية حتى لا يميل الصاروخ العملاق أثناء الصعود!',
      realRecord:
        'يزن هذا العملاق المجنزر وحده قرابة 3000 طن ويستطيع حمل صاروخ قمري كامل يزيد وزنه على 8000 طن!',
      didYouKnow:
        'تتكون جنازيره الفولاذية من 456 وصلة معدنية يزن كل واحد منها قرابة طن كامل!',
    },
  },
  {
    id: 'const-modular-wind-tower-crane',
    archetype: 'forklift_crane',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.MASTER,
    primaryColor: '#dc2626',
    secondaryColor: '#f8fafc',
    accentColor: '#facc15',
    lengthScale: 1.18,
    widthScale: 1.16,
    name: 'Grue Mobile d’Assemblage Géant',
    nameAr: 'الرافعة الهندسية العملاقة لتوربينات الطاقة',
    subtitle: 'Machine de levage modulaire hissant des nacelles de 150 tonnes à plus de 150 mètres',
    subtitleAr: 'رافعة تلسكوبية جبارة ترفع المولدات العملاقة إلى ارتفاع يفوق 150 متراً',
    discovery: {
      howItWorks:
        'Avant le levage, elle déploie ses stabilisateurs en étoile et charge d’immenses dalles de contrepoids pour équilibrer le mât géant.',
      realRecord:
        'Les plus grandes grues mobiles télescopiques soulèvent jusqu’à 1 200 tonnes et culminent plus haut que la cathédrale de Strasbourg !',
      didYouKnow:
        'Un anémomètre au sommet du mât surveille en direct la vitesse du vent pour garantir un montage sans oscillation.',
    },
    discoveryAr: {
      howItWorks:
        'قبل بدء الرفع تنشر ركائز التثبيت العريضة وتحمل أثقال موازنة ضخمة لموازنة عزم الارتفاع الشاهق.',
      realRecord:
        'تصل قدرة أكبر الرافعات التلسكوبية المتنقلة في العالم إلى رفع 1200 طن وبارتفاع ينافس ناطحات السحاب!',
      didYouKnow:
        'يقيس حساس الرياح في قمة الصاري سرعة الهواء لحظياً لضمان تركيب القطع العملاقة دون أي تأرجح.',
    },
  },
  {
    id: 'const-solar-autonomous-agri-titan',
    archetype: 'tractor_agri',
    category: VehicleCategory.CONSTRUCTION,
    tier: DifficultyTier.MASTER,
    primaryColor: '#15803d',
    secondaryColor: '#f8fafc',
    accentColor: '#38bdf8',
    lengthScale: 1.16,
    widthScale: 1.16,
    name: 'Combiné Agro-Écologique Multi-Capteurs',
    nameAr: 'المنظومة الزراعية البيئية متعددة المستشعرات',
    subtitle: 'Machine agricole de demain combinant caméras multispectrales et énergie propre',
    subtitleAr: 'آلة زراعية مستقبلية تجمع بين التصوير الطيفي والطاقة النظيفة',
    discovery: {
      howItWorks:
        'Ses caméras analysent la couleur exacte de chaque plante milliseconde par milliseconde pour arroser et soigner uniquement là où c’est nécessaire.',
      realRecord:
        'L’agriculture de précision assistée par capteurs optiques permet d’économiser jusqu’à 80 % d’eau et d’intrants dans les cultures !',
      didYouKnow:
        'Ses larges roues basse pression évitent de tasser la terre afin de préserver les vers de terre et la vie du sol.',
    },
    discoveryAr: {
      howItWorks:
        'تحلل كاميراتها الطيفية حالة كل نبتة في أجزاء من الثانية لتوفير الري والعناية في المكان المطلوب فقط.',
      realRecord:
        'تساهم الزراعة الدقيقة المعتمدة على المستشعرات البصرية في توفير ما يصل إلى 80% من استهلاك المياه!',
      didYouKnow:
        'تحمي إطاراتها العريضة منخفضة الضغط مسام التربة والكائنات الدقيقة المفيدة للنباتات.',
    },
  },

  {
    id: 'space-james-webb-observatory',
    archetype: 'orbital_satellite',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.MASTER,
    primaryColor: '#f59e0b',
    secondaryColor: '#1e293b',
    accentColor: '#38bdf8',
    lengthScale: 1.18,
    widthScale: 1.2,
    name: 'Grand Observatoire Spatial Infrarouge',
    nameAr: 'المرصد الفضائي العملاق للأشعة تحت الحمراء',
    subtitle: 'Télescope au miroir doré déployé à 1,5 million de kilomètres de la Terre',
    subtitleAr: 'مرصد فضائي بمرآة ذهبية يعمل على بُعد 1.5 مليون كم من كوكب الأرض',
    discovery: {
      howItWorks:
        'Plié comme un origami géant dans la coiffe d’Ariane 5 au lancement, il a déployé 18 miroirs hexagonaux recouverts d’or et un bouclier thermique grand comme un court de tennis !',
      realRecord:
        'Son bouclier thermique à 5 couches maintient ses instruments à -233 °C afin de capter la lueur des toutes premières galaxies nées après le Big Bang !',
      didYouKnow:
        'La couche d’or pur déposée sur l’ensemble de son miroir de 6,5 mètres est si fine qu’elle pèse au total moins de 50 grammes — le poids d’une balle de golf !',
    },
    discoveryAr: {
      howItWorks:
        'طُوي ببراعة مثل فن الأوريغامي داخل الصاروخ عند الإطلاق، ثم فتح 18 مرآة سداسية مذهبة ودرعاً حرارياً بحجم ملعب تنس!',
      realRecord:
        'يحافظ درعه الحراري المكون من 5 طبقات على برودة أجهزته عند 233 درجة تحت الصفر لرصد أقدم مجرات الكون!',
      didYouKnow:
        'طبقة الذهب الخالص المطلية على مرآته العملاقة بقطر 6.5 أمتار رقيقة جداً بحيث لا يتجاوز وزنها الإجمالي 50 غراماً فقط!',
    },
  },
  {
    id: 'space-sample-return-mars-rover',
    archetype: 'planetary_rover',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.MASTER,
    primaryColor: '#fef9c3',
    secondaryColor: '#dc2626',
    accentColor: '#f59e0b',
    lengthScale: 1.18,
    widthScale: 1.16,
    name: 'Rover Foreur de Retour d’Échantillons',
    nameAr: 'عربة الحفر وجمع العينات الكوكبية',
    subtitle: 'Robot planétaire à foreuse profonde collectant des carottes de roche scellées',
    subtitleAr: 'روبوت كوكبي مزود بحفّار عميق لجمع وحفظ عينات الصخور في أنابيب محكمة',
    discovery: {
      howItWorks:
        'Sa foreuse carottière prélève des cylindres de roche jusqu’à 2 mètres sous la surface poussiéreuse, puis un bras interne les scelle dans des tubes en titane ultra-propres.',
      realRecord:
        'Les tubes d’échantillons sont conçus avec une propreté record : moins d’un milliardième de gramme de poussière terrestre autorisé au départ !',
      didYouKnow:
        'Creuser à 2 mètres de profondeur sur Mars permet d’atteindre des couches protégées des rayons cosmiques depuis des milliards d’années.',
    },
    discoveryAr: {
      howItWorks:
        'يستخرج مثقابها الجوفي أسطوانات صخرية من عمق مترين تحت السطح، ثم يغلقها ذراع آلي داخل أنابيب تيتانيوم فائقة النقاء.',
      realRecord:
        'تُعقّم أنابيب حفظ العينات الفضائية بمعايير قياسية صارمة تمنع وجود أي ذرة غبار أرضية بداخلها!',
      didYouKnow:
        'يتيح الحفر لعمق مترين تحت سطح المريخ الوصول إلى طبقات صخرية محمية من الإشعاعات الكونية منذ مليارات السنين.',
    },
  },
  {
    id: 'space-artemis-moon-mega-rocket',
    archetype: 'space_rocket',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.MASTER,
    primaryColor: '#ea580c',
    secondaryColor: '#f8fafc',
    accentColor: '#0284c7',
    lengthScale: 1.18,
    widthScale: 1.14,
    name: 'Méga-Fusée Lunaire Habitable',
    nameAr: 'الصاروخ القمري العملاق المأهول',
    subtitle: 'Plus puissant lanceur d’exploration propulsant un vaisseau habité vers la Lune',
    subtitleAr: 'صاروخ استكشاف عملاق يدفع كبسولة رواد الفضاء في رحلتهم نحو القمر',
    discovery: {
      howItWorks:
        'Ses quatre moteurs hydrogène-oxygène centraux et ses deux boosters latéraux propulsent l’étage supérieur qui injecte ensuite la capsule sur une trajectoire lunaire à 40 000 km/h !',
      realRecord:
        'Haute de près de 100 à 111 mètres (plus haute que la Statue de la Liberté), une fusée lunaire développe près de 4 000 tonnes de poussée au décollage !',
      didYouKnow:
        'Tout en haut du cône se trouve la tour de sauvetage capable d’éloigner instantanément la capsule des astronautes en cas d’anomalie au lancement.',
    },
    discoveryAr: {
      howItWorks:
        'تدفع محركات الهيدروجين والأكسجين المركزية والمعززان الجانبيان المركبة العلوية لإطلاق الكبسولة نحو القمر بسرعة 40 ألف كم/س!',
      realRecord:
        'يتجاوز ارتفاع الصاروخ القمري العملاق 100 متر (أعلى من تمثال الحرية) ويولد قوة دفع تقارب 4000 طن عند الإقلاع!',
      didYouKnow:
        'يعلو قمة الصاروخ برج إنقاذ مخصص لسحب كبسولة رواد الفضاء بعيداً في أجزاء من الثانية لضمان سلامتهم التامة.',
    },
  },
  {
    id: 'space-international-modular-station',
    archetype: 'winged_orbiter_station',
    category: VehicleCategory.SPACE,
    tier: DifficultyTier.MASTER,
    primaryColor: '#f8fafc',
    secondaryColor: '#1d4ed8',
    accentColor: '#f59e0b',
    lengthScale: 1.2,
    widthScale: 1.2,
    name: 'Grande Station Spatiale Modulaire',
    nameAr: 'المحطة الفضائية المدارية الكبرى',
    subtitle: 'Chef-d’œuvre d’ingénierie internationale assemblé pièce par pièce à 400 km d’altitude',
    subtitleAr: 'أعجوبة هندسية دولية جُمّعت قطعة بقطعة في المدار على ارتفاع 400 كم',
    discovery: {
      howItWorks:
        'Assemblés en orbite comme un grand jeu de construction 3D, ses modules pressurisés, son bras robotique et ses panneaux solaires forment une maison-laboratoire dans l’espace !',
      realRecord:
        'Large de 109 mètres (la taille d’un terrain de football complet) et pesant 420 tonnes, la Station Spatiale Internationale est habitée en continu depuis l’an 2000 !',
      didYouKnow:
        'Des modules fabriqués dans des pays différents qui ne s’étaient jamais touchés sur Terre se sont emboîtés au millimètre près pour la première fois dans l’espace !',
    },
    discoveryAr: {
      howItWorks:
        'جُمعت وحداتها المضغوطة وألواحها الشمسية وذراعها الآلية في الفضاء تماماً مثل نموذج ثلاثي الأبعاد عملاق لتشكّل مختبراً مدارياً متكاملاً!',
      realRecord:
        'يبلغ عرض المحطة الفضائية الدولية 109 أمتار (بحجم ملعب كرة قدم كامل) وتزن 420 طناً وهي مأهولة باستمرار منذ عام 2000!',
      didYouKnow:
        'التحمت وحدات صُنعت في قارات ودول مختلفة لأول مرة في الفضاء الخارجي بدقة المليمتر الواحد دون أن تتلامس على الأرض قط!',
    },
  },
];
