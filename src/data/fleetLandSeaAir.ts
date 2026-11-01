import { DifficultyTier, VehicleCategory } from '../types/game';
import { BlueprintSeed } from './catalogTemplates';

export const FLEET_LAND_SEA_AIR_SEEDS: BlueprintSeed[] = [
  // =========================================================================
  // PALIER 1 · DÉCOUVERTE — VOITURES, BATEAUX, AVIONS (9 SEEDS + 3 ORIGINAUX = 12)
  // =========================================================================
  {
    id: 'car-taxi-metro',
    archetype: 'city_coupe',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#eab308',
    secondaryColor: '#1e293b',
    accentColor: '#38bdf8',
    lengthScale: 0.96,
    widthScale: 0.98,
    name: 'Taxi Métropole Électrique',
    nameAr: 'تاكسي المدينة الكهربائي',
    subtitle: 'Citadine jaune agile conçue pour les grands boulevards',
    subtitleAr: 'سيارة أجرة حضرية صفراء رشيقة مصممة للشوارع المزدحمة',
    discovery: {
      howItWorks:
        'Son moteur électrique fournit un couple instantané dès le démarrage aux feux tricolores, sans bruit ni gaz d’échappement.',
      realRecord:
        'Les taxis londoniens et new-yorkais parcourent souvent plus de 400 000 km au cours de leur carrière urbaine !',
      didYouKnow:
        'La couleur jaune vif a été choisie dès 1907 après une étude montrant que c’est la teinte la plus visible de loin sous la pluie.',
    },
    discoveryAr: {
      howItWorks:
        'يوفّر محركها الكهربائي عزم دوران فوري عند الانطلاق من إشارات المرور دون ضجيج أو انبعاثات.',
      realRecord:
        'تقطع سيارات الأجرة في المدن الكبرى أكثر من 400 ألف كيلومتر خلال سنوات خدمتها!',
      didYouKnow:
        'اختير اللون الأصفر الزاهي منذ عام 1907 لأنه الأكثر وضوحاً من مسافة بعيدة حتى أثناء المطر.',
    },
  },
  {
    id: 'car-dune-buggy',
    archetype: 'city_coupe',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f97316',
    secondaryColor: '#0f172a',
    accentColor: '#fde047',
    lengthScale: 0.9,
    widthScale: 1.12,
    name: 'Buggy des Dunes',
    nameAr: 'عربة الكثبان الرملية',
    subtitle: 'Véhicule léger à larges pneus pour franchir le sable',
    subtitleAr: 'مركبة خفيفة بإطارات عريضة لعبور الرمال بسهولة',
    discovery: {
      howItWorks:
        'Son châssis très léger et ses pneus larges répartissent le poids sur une grande surface pour ne pas s’enfoncer dans le sable mou.',
      realRecord:
        'Les buggys du rallye Dakar peuvent franchir des dunes hautes comme des immeubles de 15 étages !',
      didYouKnow:
        'Les pilotes dégonflent légèrement leurs pneus dans le désert afin d’élargir l’empreinte au sol comme les pattes d’un dromadaire.',
    },
    discoveryAr: {
      howItWorks:
        'يوزّع هيكلها الخفيف وإطاراتها العريضة الوزن على مساحة كبيرة فلا تغوص العجلات في الرمال الناعمة.',
      realRecord:
        'تستطيع عربات الكثبان في الراليات الصحراوية تسلق كثبان رملية بارتفاع مبنى من 15 طابقاً!',
      didYouKnow:
        'يُخفّض السائقون ضغط الهواء في الإطارات قليلاً في الصحراء لتوسيع مساحة التلامس تماماً مثل خف الجمل.',
    },
  },
  {
    id: 'car-mini-van-post',
    archetype: 'utility_truck',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#facc15',
    secondaryColor: '#0284c7',
    accentColor: '#f97316',
    lengthScale: 0.88,
    widthScale: 0.94,
    name: 'Fourgonnette du Facteur',
    nameAr: 'شاحنة البريد السريع',
    subtitle: 'Utilitaire compact pour livrer colis et courriers',
    subtitleAr: 'مركبة مدمجة لتوصيل الطرود والرسائل يومياً',
    discovery: {
      howItWorks:
        'Son compartiment arrière cubique maximise le volume de rangement tout en gardant un empattement court pour se garer partout.',
      realRecord:
        'Une flotte postale nationale distribue plusieurs millions de lettres et colis chaque matin à travers villes et villages.',
      didYouKnow:
        'Les fourgonnettes postales électriques s’arrêtent et redémarrent plus de 200 fois par tournée sans user leurs freins grâce au freinage régénératif.',
    },
    discoveryAr: {
      howItWorks:
        'يوفر الصندوق الخلفي المكعب أكبر مساحة تخزين ممكنة مع قاعدة عجلات قصيرة تسهّل الركن في الأزقة.',
      realRecord:
        'توزع أساطيل البريد ملايين الرسائل والطرود يومياً عبر المدن والقرى بدقة عالية.',
      didYouKnow:
        'تتوقف شاحنات البريد الكهربائية وتنطلق أكثر من 200 مرة في الجولة الواحدة مع إعادة شحن البطارية عند الكبح.',
    },
  },

  {
    id: 'boat-lagoon-catamaran',
    archetype: 'catamaran_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#06b6d4',
    secondaryColor: '#f8fafc',
    accentColor: '#f59e0b',
    lengthScale: 0.94,
    widthScale: 1.04,
    name: 'Catamaran du Lagon',
    nameAr: 'قارب الكاتاماران المزدوج',
    subtitle: 'Voilier à double coque ultra-stable sur les vagues',
    subtitleAr: 'قارب شراعي ببدنين متوازيين يمنح ثباتاً فائقاً فوق الماء',
    discovery: {
      howItWorks:
        'Ses deux flotteurs fins écartés remplacent la lourde quille : le bateau glisse vite à la surface sans presque pencher.',
      realRecord:
        'Les grands catamarans océaniques ont franchi la barre des 80 km/h uniquement poussés par le vent !',
      didYouKnow:
        'Le principe du bateau à deux coques a été inventé il y a plusieurs millénaires par les navigateurs polynésiens du Pacifique.',
    },
    discoveryAr: {
      howItWorks:
        'يعمل الطافيان المتباعدان بدلاً من العارضة الثقيلة، فينزلق القارب بسرعة فوق الماء دون ميلان يُذكر.',
      realRecord:
        'تجاوزت قوارب الكاتاماران المحيطية سرعة 80 كم/س بقوة الرياح وحدها!',
      didYouKnow:
        'ابتكر البحّارة البولينيزيون في المحيط الهادئ تصميم القوارب المزدوجة منذ آلاف السنين لعبور المحيط.',
    },
  },
  {
    id: 'boat-harbor-pilot',
    archetype: 'work_ship',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#ea580c',
    secondaryColor: '#0f172a',
    accentColor: '#38bdf8',
    lengthScale: 0.9,
    widthScale: 0.95,
    name: 'Vedette du Pilote Maritime',
    nameAr: 'زورق الإرشاد البحري',
    subtitle: 'Bateau rapide qui guide les grands navires à l’entrée du port',
    subtitleAr: 'زورق سريع يرافق السفن الكبيرة عند دخول الميناء',
    discovery: {
      howItWorks:
        'Sa coque en V profond fend les vagues courtes de l’entrée du port pour amener le pilote maritime au pied des cargos.',
      realRecord:
        'Certaines vedettes de pilotage sont auto-redressables : même retournées par une vague géante, elles reviennent à l’endroit en 5 secondes !',
      didYouKnow:
        'Chaque grand port possède ses propres pilotes qui connaissent chaque banc de sable et chaque courant par cœur.',
    },
    discoveryAr: {
      howItWorks:
        'يشق بدنه المصمم على شكل حرف V الأمواج القوية ليُوصل المرشد البحري بأمان إلى السفن العملاقة.',
      realRecord:
        'تستطيع بعض زوارق الإرشاد تعديل وضعها ذاتياً والعودة للطفو المعتدل خلال 5 ثوانٍ فقط إن قلبتها موجة!',
      didYouKnow:
        'لكل ميناء مرشدون متخصصون يحفظون كل التيارات البحرية والممرات المائية عن ظهر قلب.',
    },
  },
  {
    id: 'boat-coral-mini-sub',
    archetype: 'submarine_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#facc15',
    secondaryColor: '#0284c7',
    accentColor: '#fb7185',
    lengthScale: 0.86,
    widthScale: 0.98,
    name: 'Mini-Sous-Marin Corail',
    nameAr: 'الغواصة الاستكشافية الصغيرة',
    subtitle: 'Petit bathyscaphe jaune pour observer les récifs marins',
    subtitleAr: 'غواصة صفراء مدمجة لمشاهدة الشعاب المرجانية عن قرب',
    discovery: {
      howItWorks:
        'En remplissant ses réservoirs appelés ballasts avec de l’eau de mer, le sous-marin plonge doucement ; en chassant l’eau avec de l’air, il remonte.',
      realRecord:
        'Les sous-marins scientifiques habités peuvent descendre jusqu’à près de 11 000 mètres au fond de la fosse des Mariannes !',
      didYouKnow:
        'On les peint souvent en jaune vif ou orange car ces couleurs restent faciles à repérer par les navires de surface à la remontée.',
    },
    discoveryAr: {
      howItWorks:
        'عند ملء خزانات الغطس بالماء تغوص الغواصة بهدوء، وعند دفع الماء بالهواء المضغوط تصعد إلى السطح.',
      realRecord:
        'وصلت غواصات البحث العلمي المأهولة إلى عمق يناهز 11 ألف متر في خندق ماريانا السحيق!',
      didYouKnow:
        'تُطلى غواصات الاستكشاف غالباً باللون الأصفر الساطع ليسهل رصدها من سفن السطح عند الصعود.',
    },
  },

  {
    id: 'plane-bush-cub',
    archetype: 'prop_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#f59e0b',
    secondaryColor: '#1e293b',
    accentColor: '#ef4444',
    lengthScale: 0.95,
    widthScale: 1.04,
    name: 'Avion de Brousse',
    nameAr: 'طائرة البراري الخفيفة',
    subtitle: 'Monomoteur robuste capable d’atterrir sur des pistes très courtes',
    subtitleAr: 'طائرة متينة قادرة على الهبوط في المدارج الترابية القصيرة',
    discovery: {
      howItWorks:
        'Ses grandes ailes larges créent beaucoup de portance dès une faible vitesse, ce qui lui permet de décoller en quelques dizaines de mètres.',
      realRecord:
        'Lors des concours STOL en Alaska, des avions de brousse décollent et atterrissent en moins de 6 mètres face au vent !',
      didYouKnow:
        'Ils utilisent d’énormes pneus souples basse pression surnommés « pneus toundra » pour rouler sur les cailloux et la neige.',
    },
    discoveryAr: {
      howItWorks:
        'تولّد أجنحتها العريضة قوة رفع كبيرة عند سرعات منخفضة، مما يسمح بالإقلاع في أمتار قليلة.',
      realRecord:
        'في مسابقات الإقلاع القصير في ألاسكا، تقلع بعض طائرات البراري وتهبط في مسافة تقل عن 6 أمتار فقط!',
      didYouKnow:
        'تُجهّز بإطارات ضخمة ومرنة منخفضة الضغط لتتمكن من الهبوط فوق الحصى والثلوج بأمان.',
    },
  },
  {
    id: 'plane-island-floatplane',
    archetype: 'seaplane_biplane',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#0284c7',
    secondaryColor: '#f8fafc',
    accentColor: '#f97316',
    lengthScale: 0.96,
    widthScale: 1.0,
    name: 'Hydravion des Îles',
    nameAr: 'الطائرة المائية للجزر',
    subtitle: 'Avion à flotteurs qui décolle et amerrit sur les lacs',
    subtitleAr: 'طائرة مزودة بعوامات للإقلاع والهبوط مباشرة فوق الماء',
    discovery: {
      howItWorks:
        'Deux longs flotteurs profilés remplacent les roues : à l’accélération, l’hydravion déjauge et glisse sur le redan avant de s’envoler.',
      realRecord:
        'Au Canada et aux Maldives, des centaines d’hydravions relient chaque jour des îles et des lacs sans aucune piste en béton.',
      didYouKnow:
        'Le premier hydravion fonctionnel de l’histoire a décollé en France en 1910 sur l’étang de Berre grâce à Henri Fabre.',
    },
    discoveryAr: {
      howItWorks:
        'تحل عوامتان انسيابيتان محل العجلات، وعند التسارع تنزلق الطائرة فوق سطح الماء ثم ترتفع في السماء.',
      realRecord:
        'تربط مئات الطائرات المائية يومياً بين الجزر والبحيرات البعيدة دون الحاجة إلى مدرج إسفلتي.',
      didYouKnow:
        'أقلعت أول طائرة مائية ناجحة في التاريخ عام 1910 فوق المياه الهادئة بابتكار المهندس هنري فابر.',
    },
  },
  {
    id: 'plane-park-quadcopter',
    archetype: 'rotor_drone',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.DISCOVERY,
    primaryColor: '#10b981',
    secondaryColor: '#1e293b',
    accentColor: '#38bdf8',
    lengthScale: 0.92,
    widthScale: 0.92,
    name: 'Quadricoptère Photo',
    nameAr: 'درون التصوير الرباعي',
    subtitle: 'Drone agile à quatre hélices stabilisé par capteurs',
    subtitleAr: 'طائرة مسيّرة بأربع مراوح متوازنة للتصوير الجوي',
    discovery: {
      howItWorks:
        'Deux hélices tournent dans un sens et deux dans l’autre : en variant légèrement leur vitesse, le drone monte, tourne ou avance.',
      realRecord:
        'Les drones de course pilotés en immersion peuvent accélérer de 0 à 100 km/h en à peine une seconde !',
      didYouKnow:
        'Un gyroscope électronique corrige la vitesse des 4 moteurs plusieurs centaines de fois par seconde pour résister aux rafales de vent.',
    },
    discoveryAr: {
      howItWorks:
        'تدور مروحتان في اتجاه والأخريان في الاتجاه المعاكس، وبتغيير سرعاتها يرتفع الدرون أو يستدير بدقة.',
      realRecord:
        'تتسارع طائرات الدرون الرياضية من الثبات إلى 100 كم/س خلال ثانية واحدة فقط!',
      didYouKnow:
        'يقوم مستشعر التوازن الإلكتروني بتعديل سرعة المحركات مئات المرات في الثانية لمقاومة هبات الرياح.',
    },
  },

  // =========================================================================
  // PALIER 2 · ATELIER — VOITURES, BATEAUX, AVIONS (9 SEEDS + 3 ORIGINAUX = 12)
  // =========================================================================
  {
    id: 'car-alpine-ambulance',
    archetype: 'utility_truck',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#f8fafc',
    secondaryColor: '#ef4444',
    accentColor: '#0284c7',
    lengthScale: 1.0,
    widthScale: 1.0,
    name: 'Ambulance Secours Alpin',
    nameAr: 'سيارة الإسعاف الجبلية',
    subtitle: 'Véhicule médicalisé 4x4 équipé d’une cellule de soins',
    subtitleAr: 'مركبة إسعاف رباعية الدفع مجهزة بوحدة عناية طبية',
    discovery: {
      howItWorks:
        'Sa transmission intégrale entraîne les quatre roues sur la neige, tandis qu’un alternateur renforcé alimente les appareils médicaux.',
      realRecord:
        'La suspension hydropneumatique d’une ambulance moderne absorbe plus de 80 % des secousses de la route pour protéger le patient.',
      didYouKnow:
        'Le mot « AMBULANCE » est souvent écrit à l’envers sur le capot avant pour être lu à l’endroit dans le rétroviseur des voitures qui précèdent !',
    },
    discoveryAr: {
      howItWorks:
        'يدفع نظام الدفع الرباعي العجلات الأربع فوق الثلوج، بينما يغذي مولّد كهربائي قوي الأجهزة الطبية بالداخل.',
      realRecord:
        'تمتص أنظمة التعليق المتطورة في سيارات الإسعاف أكثر من 80% من اهتزازات الطريق لراحة المريض.',
      didYouKnow:
        'تُكتب كلمة إسعاف معكوسة أحياناً على مقدمة الغطاء الأمامي ليقرأها السائقون بوضوح في مراياهم العاكسة!',
    },
  },
  {
    id: 'car-metro-tramway',
    archetype: 'rail_train',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#0d9488',
    secondaryColor: '#f1f5f9',
    accentColor: '#f59e0b',
    lengthScale: 1.02,
    widthScale: 0.96,
    name: 'Tramway Urbain Moderne',
    nameAr: 'الترام الكهربائي الحديث',
    subtitle: 'Train citadin silencieux glissant sur des rails en acier',
    subtitleAr: 'قطار حضري هادئ ينساب بسلاسة فوق قضبان فولاذية',
    discovery: {
      howItWorks:
        'Le contact acier sur acier entre les bogies et les rails réduit le frottement de 85 % par rapport à des pneus sur le bitume.',
      realRecord:
        'Une seule rame de tramway transporte autant de voyageurs que 170 voitures particulières tout en occupant 8 fois moins d’espace !',
      didYouKnow:
        'Sous le plancher bas se cache une sablière qui projette un peu de sable fin devant les roues pour freiner sur les feuilles mouillées.',
    },
    discoveryAr: {
      howItWorks:
        'يقلل التلامس بين العجلات الفولاذية والقضبان الاحتكاك بنسبة 85% مقارنة بالإطارات المطاطية على الأسفلت.',
      realRecord:
        'تنقل عربة ترام واحدة عدد ركاب يعادل حمولة 170 سيارة خاصة مع استهلاك مساحة أقل بكثير!',
      didYouKnow:
        'يوجد تحت الأرضية صندوق رمل صغير ينثر حبيبات رملية أمام العجلات لتحسين الكبح في الأيام الممطرة.',
    },
  },
  {
    id: 'car-safari-offroad',
    archetype: 'city_coupe',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#65a30d',
    secondaryColor: '#fef3c7',
    accentColor: '#ea580c',
    lengthScale: 1.04,
    widthScale: 1.06,
    name: '4x4 d’Exploration Nature',
    nameAr: 'مركبة استكشاف المحميات 4x4',
    subtitle: 'Tout-terrain à garde au sol surélevée pour pistes sauvages',
    subtitleAr: 'سيارة دفع رباعي مرتفعة لعبور المسارات الوعرة',
    discovery: {
      howItWorks:
        'Une boîte de transfert multiplie la force du moteur à basse vitesse afin de grimper des pentes rocheuses sans caler.',
      realRecord:
        'Certains 4x4 scientifiques ont grimpé sur les flancs du volcan Ojos del Salado au Chili à plus de 6 600 mètres d’altitude !',
      didYouKnow:
        'Les réserves naturelles adoptent désormais des 4x4 électriques silencieux pour observer la faune sans l’effrayer.',
    },
    discoveryAr: {
      howItWorks:
        'تضاعف علبة التروس التحويلية عزم المحرك عند السرعات البطيئة لتسلق المنحدرات الصخرية بثبات.',
      realRecord:
        'نجحت مركبات دفع رباعي علمية في الصعود على سفوح بركان أوخوس ديل سالادو حتى ارتفاع فاق 6600 متر!',
      didYouKnow:
        'تعتمد المحميات الحديثة مركبات كهربائية صامتة لمراقبة الحيوانات البرية دون إزعاجها.',
    },
  },

  {
    id: 'boat-island-ferry',
    archetype: 'work_ship',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#2563eb',
    secondaryColor: '#f8fafc',
    accentColor: '#facc15',
    lengthScale: 1.08,
    widthScale: 1.06,
    name: 'Ferry Transbordeur',
    nameAr: 'عبّارة نقل الركاب والمركبات',
    subtitle: 'Navire à pont ouvert reliant le continent aux îles',
    subtitleAr: 'سفينة واسعة السطح تنقل المسافرين والسيارات بين الجزر',
    discovery: {
      howItWorks:
        'De grandes portes-rampes à l’avant et à l’arrière permettent aux véhicules d’embarquer et de débarquer sans faire demi-tour.',
      realRecord:
        'Les plus grands ferries électriques de Norvège transportent 200 voitures et se rechargent en seulement 10 minutes à chaque escale !',
      didYouKnow:
        'On appelle ces navires des « Ro-Ro » (Roll-on / Roll-off), ce qui signifie « entrer en roulant, sortir en roulant ».',
    },
    discoveryAr: {
      howItWorks:
        'تسمح البوابات المنحدرة في المقدمة والمؤخرة بدخول السيارات وخروجها مباشرة دون الحاجة للدوران.',
      realRecord:
        'تنقل أكبر العبّارات الكهربائية في النرويج 200 سيارة وتُشحن بطارياتها خلال 10 دقائق فقط عند الرصيف!',
      didYouKnow:
        'تُعرف هندسياً باسم سفن الدحرجة لأن المركبات تدخل وتخرج منها على عجلاتها.',
    },
  },
  {
    id: 'boat-coast-guard',
    archetype: 'catamaran_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#f97316',
    secondaryColor: '#0f172a',
    accentColor: '#38bdf8',
    lengthScale: 1.02,
    widthScale: 1.05,
    name: 'Navire Garde-Côtes Rapide',
    nameAr: 'سفينة خفر السواحل السريعة',
    subtitle: 'Catamaran de secours en mer équipé d’un radar longue portée',
    subtitleAr: 'سفينة إنقاذ بحري سريعة مزودة برادار بعيد المدى',
    discovery: {
      howItWorks:
        'Propulsé par des hydrojets qui aspirent l’eau sous les coques et la projettent à l’arrière, il file à haute vitesse sans hélice exposée.',
      realRecord:
        'Les catamarans de secours maritime atteignent plus de 40 nœuds (environ 75 km/h) même par mer agitée !',
      didYouKnow:
        'L’absence d’hélice sous la coque permet d’approcher les nageurs ou les zones peu profondes en toute sécurité.',
    },
    discoveryAr: {
      howItWorks:
        'تعمل بنظام الدفع المائي النفاث الذي يسحب الماء ويضخه بقوة للخلف فتندفع السفينة بسرعة وأمان.',
      realRecord:
        'تصل سرعة سفن الإنقاذ البحري السريعة إلى أكثر من 40 عقدة (نحو 75 كم/س) حتى وسط الأمواج!',
      didYouKnow:
        'عدم وجود مراوح مكشوفة تحت البدن يسمح بالاقتراب من السباحين والمياه الضحلة بأمان تام.',
    },
  },
  {
    id: 'boat-Classic-schooner',
    archetype: 'sail_vessel',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#0f766e',
    secondaryColor: '#fde68a',
    accentColor: '#d97706',
    lengthScale: 1.06,
    widthScale: 1.0,
    name: 'Goélette Océanique',
    nameAr: 'السفينة الشراعية المحيطية',
    subtitle: 'Grand voilier école taillé pour les traversées transatlantiques',
    subtitleAr: 'سفينة شراعية تدريبية مصممة لعبور المحيطات',
    discovery: {
      howItWorks:
        'Sa quille lestée équilibre la poussée latérale du vent sur la grand-voile, transformant la brise en mouvement fluide vers l’avant.',
      realRecord:
        'Les goélettes océaniques parcourent facilement plus de 350 kilomètres par jour sans consommer une seule goutte de carburant !',
      didYouKnow:
        'De nouveaux cargos à voiles rigides s’inspirent aujourd’hui des goélettes pour décarboner le transport maritime mondial.',
    },
    discoveryAr: {
      howItWorks:
        'توازن العارضة السفلية الثقيلة ضغط الرياح الجانبي على الشراع فتحوّله إلى اندفاع سلس نحو الأمام.',
      realRecord:
        'تقطع السفن الشراعية المحيطية أكثر من 350 كيلومتراً في اليوم دون استهلاك قطرة وقود واحدة!',
      didYouKnow:
        'تستلهم سفن الشحن الحديثة فكرة الأشرعة العملاقة لتقليل استهلاك الوقود عبر المحيطات.',
    },
  },

  {
    id: 'plane-twin-commuter',
    archetype: 'prop_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#2563eb',
    secondaryColor: '#f8fafc',
    accentColor: '#38bdf8',
    lengthScale: 1.06,
    widthScale: 1.08,
    name: 'Avion Régional Turboprop',
    nameAr: 'طائرة النقل الإقليمي المروحية',
    subtitle: 'Avion de liaison sobre et efficace pour les trajets courts',
    subtitleAr: 'طائرة ركاب إقليمية موفرة للطاقة للرحلات المتوسطة',
    discovery: {
      howItWorks:
        'Une turbine entraîne une hélice multi-pales : à vitesse modérée, ce système consomme beaucoup moins de carburant qu’un réacteur pur.',
      realRecord:
        'Les avions turbopropulseurs régionaux consomment jusqu’à 45 % de carburant en moins que les jets sur les vols de moins de 600 km !',
      didYouKnow:
        'L’angle des pales de l’hélice change en plein vol comme les vitesses d’un vélo : on appelle cela une hélice à pas variable.',
    },
    discoveryAr: {
      howItWorks:
        'يدير محرك توربيني مروحة متعددة الشفرات، وهو نظام يستهلك وقوداً أقل بكثير في المسافات القصيرة.',
      realRecord:
        'توفر الطائرات المروحية التوربينية حتى 45% من الوقود مقارنة بالطائرات النفاثة في الرحلات الإقليمية!',
      didYouKnow:
        'تتغير زاوية ميلان شفرات المروحة أثناء الطيران تماماً مثل تبديل سرعات الدراجة الهوائية.',
    },
  },
  {
    id: 'plane-water-bomber',
    archetype: 'seaplane_biplane',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#facc15',
    secondaryColor: '#dc2626',
    accentColor: '#1e293b',
    lengthScale: 1.08,
    widthScale: 1.08,
    name: 'Hydravion Bombardier d’Eau',
    nameAr: 'الطائرة البرمائية لإطفاء الحرائق',
    subtitle: 'Avion amphibie jaune et rouge qui écope l’eau des lacs en vol rasant',
    subtitleAr: 'طائرة إطفاء صفراء وحمراء تغرف الماء من البحيرات أثناء الانزلاق',
    discovery: {
      howItWorks:
        'En effleurant un lac à 130 km/h, deux petites écopes sous la coque remplissent ses réservoirs d’eau par la seule pression de la vitesse.',
      realRecord:
        'Un Canadair CL-415 peut aspirer plus de 6 000 litres d’eau en seulement 12 secondes sur une distance de 400 mètres !',
      didYouKnow:
        'Les ouvertures qui aspirent ces 6 tonnes d’eau sont à peine plus grandes que deux boîtes à chaussures !',
    },
    discoveryAr: {
      howItWorks:
        'عند ملامسة سطح البحيرة بسرعة 130 كم/س، تدفع قوة السرعة الماء عبر فتحتين صغيرتين لملء الخزانات.',
      realRecord:
        'تستطيع طائرة الإطفاء المائية سحب أكثر من 6000 لتر من الماء خلال 12 ثانية فقط!',
      didYouKnow:
        'فتحات سحب المياه تحت البدن صغيرة للغاية ولا يتجاوز حجمها حجم علبتي أحذية!',
    },
  },
  {
    id: 'plane-medical-drone',
    archetype: 'rotor_drone',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.WORKSHOP,
    primaryColor: '#ef4444',
    secondaryColor: '#f8fafc',
    accentColor: '#0284c7',
    lengthScale: 1.02,
    widthScale: 1.02,
    name: 'Drone Cargo Médical',
    nameAr: 'درون الإمداد الطبي السريع',
    subtitle: 'Multirotor autonome livrant médicaments en montagne',
    subtitleAr: 'طائرة مسيّرة تنقل الأدوية والإسعافات للمناطق الجبلية',
    discovery: {
      howItWorks:
        'Guidé par GPS et capteurs optiques, il vole en ligne droite par-dessus les vallées et les rivières sans dépendre de l’état des routes.',
      realRecord:
        'Dans plusieurs pays montagneux, des drones médicaux ont réduit le temps de livraison d’urgence de 4 heures de route à 15 minutes de vol !',
      didYouKnow:
        'Sa nacelle ventrale isotherme maintient les échantillons médicaux exactement à la bonne température pendant tout le vol.',
    },
    discoveryAr: {
      howItWorks:
        'تحلّق بتوجيه الأقمار الصناعية والمستشعرات في خط مستقيم فوق الأودية والأنهار متجاوزة الطرق الوعرة.',
      realRecord:
        'نجحت طائرات الإمداد الطبي في تقليص زمن توصيل الأدوية الطارئة من 4 ساعات براً إلى 15 دقيقة جواً!',
      didYouKnow:
        'تحافظ الحجرة السفلية المعزولة حرارياً على درجة حرارة الأدوية بدقة طوال الرحلة.',
    },
  },

  // =========================================================================
  // PALIER 3 · INGÉNIEUR — VOITURES, BATEAUX, AVIONS (9 SEEDS + 3 ORIGINAUX = 12)
  // =========================================================================
  {
    id: 'car-tgv-express',
    archetype: 'rail_train',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#1d4ed8',
    secondaryColor: '#e2e8f0',
    accentColor: '#ef4444',
    lengthScale: 1.12,
    widthScale: 0.98,
    name: 'Motrice Train Grande Vitesse',
    nameAr: 'قاطرة القطار فائق السرعة',
    subtitle: 'Locomotive aérodynamique filant à plus de 320 km/h sur rail',
    subtitleAr: 'قاطرة انسيابية تنطلق بسرعة تتجاوز 320 كم/س على السكة',
    discovery: {
      howItWorks:
        'Le pantographe sur le toit capte l’électricité de la caténaire (25 000 volts) pour alimenter de puissants moteurs de traction sur les bogies.',
      realRecord:
        'Le record mondial de vitesse sur rail classique est détenu par une rame TGV d’essai à 574,8 km/h !',
      didYouKnow:
        'À 320 km/h, il faut environ 3 kilomètres à un train à grande vitesse pour s’arrêter complètement.',
    },
    discoveryAr: {
      howItWorks:
        'يلتقط الذراع العلوي التيار الكهربائي العالي لتغذية محركات الجر القوية المثبتة في العربات السفلية.',
      realRecord:
        'سجّل قطار التجارب فائق السرعة رقماً قياسياً عالمياً على القضبان التقليدية بلغ 574.8 كم/س!',
      didYouKnow:
        'عند السير بسرعة 320 كم/س، يحتاج القطار إلى مسافة تقارب 3 كيلومترات للتوقف الكامل.',
    },
  },
  {
    id: 'car-desert-rally-raid',
    archetype: 'city_coupe',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#0284c7',
    secondaryColor: '#f97316',
    accentColor: '#facc15',
    lengthScale: 1.05,
    widthScale: 1.08,
    name: 'Prototype Rallye-Raid',
    nameAr: 'سيارة الرالي الصحراوي الاحترافية',
    subtitle: 'Voiture d’endurance renforcée pour traverser les déserts',
    subtitleAr: 'مركبة سباق مقوّاة مصممة لتحمّل المراحل الصحراوية الطويلة',
    discovery: {
      howItWorks:
        'Ses suspensions à très grand débattement et son châssis tubulaire encaissent les sauts et les bosses à haute vitesse sans plier.',
      realRecord:
        'Lors d’un rallye-raid, les équipages parcourent jusqu’à 8 000 kilomètres de pistes rocailleuses et de sable en deux semaines !',
      didYouKnow:
        'Une prise d’air sur le toit (« snorkel ») permet au moteur de respirer de l’air propre loin de la poussière soulevée par les roues.',
    },
    discoveryAr: {
      howItWorks:
        'تمتص أنظمة التعليق الطويلة والهيكل الأنبوبي المقوّى الصدمات القوية والقفزات فوق التضاريس الوعرة.',
      realRecord:
        'تقطع سيارات الرالي الصحراوي ما يصل إلى 8000 كيلومتر عبر الصخور والرمال خلال أسبوعين!',
      didYouKnow:
        'يسحب مدخل الهواء العلوي فوق السقف هواءً نقياً للمحرك بعيداً عن الغبار المتطاير حول العجلات.',
    },
  },
  {
    id: 'car-mobile-crane-truck',
    archetype: 'utility_truck',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#f59e0b',
    secondaryColor: '#334155',
    accentColor: '#ef4444',
    lengthScale: 1.08,
    widthScale: 1.04,
    name: 'Camion Dépanneuse Lourd',
    nameAr: 'شاحنة الإنقاذ والقطر الثقيلة',
    subtitle: 'Porteur multi-essieux à flèche télescopique de relevage',
    subtitleAr: 'شاحنة متعددة المحاور مزودة بذراع تلسكوبي لرفع الشاحنات',
    discovery: {
      howItWorks:
        'Son moteur actionne une pompe hydraulique qui alimente à la fois des treuils en câble d’acier et une flèche capable de soulever un bus.',
      realRecord:
        'Les plus grosses dépanneuses routières peuvent tracter des convois de plus de 80 tonnes en montagne !',
      didYouKnow:
        'Une rampe lumineuse orange à LED sur le toit avertit les automobilistes à plus d’un kilomètre de distance.',
    },
    discoveryAr: {
      howItWorks:
        'يشغّل المحرك مضخة هيدروليكية تغذي كابلات سحب فولاذية وذراع رفع قادر على حمل حافلة كاملة.',
      realRecord:
        'تستطيع أكبر شاحنات الإنقاذ على الطرق الجبلية قطر مركبات يزيد وزنها على 80 طناً!',
      didYouKnow:
        'تُنبّه المصابيح البرتقالية الوامضة أعلى المقصورة السائقين القادمين من مسافة تتجاوز كيلومتراً كاملاً.',
    },
  },

  {
    id: 'boat-polar-icebreaker',
    archetype: 'work_ship',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#dc2626',
    secondaryColor: '#f8fafc',
    accentColor: '#facc15',
    lengthScale: 1.08,
    widthScale: 1.1,
    name: 'Brise-Glace Polaire',
    nameAr: 'كاسحة الجليد القطبية',
    subtitle: 'Navire à étrave arrondie ouvrant la route dans la banquise',
    subtitleAr: 'سفينة ذات مقدمة مقوّاة تفتح الممرات الملاحية عبر الجليد',
    discovery: {
      howItWorks:
        'Contrairement aux autres navires, son avant est incliné comme une cuillère : le bateau glisse par-dessus la glace et la brise par son propre poids !',
      realRecord:
        'Les brise-glaces polaires les plus puissants avancent en continu dans une banquise épaisse de près de 3 mètres !',
      didYouKnow:
        'Des buses soufflent des bulles d’air comprimé le long de la coque pour réduire le frottement contre les blocs de glace.',
    },
    discoveryAr: {
      howItWorks:
        'صُممت مقدمتها المائلة لترتفع فوق طبقة الجليد ثم تكسرها بفضل الوزن الهائل للسفينة نفسها!',
      realRecord:
        'تستطيع أقوى كاسحات الجليد القطبية التقدم باستمرار عبر طبقات جليد يصل سمكها إلى 3 أمتار!',
      didYouKnow:
        'تضخ فتحات جانبية فقاعات هواء مضغوط حول البدن لتقليل الاحتكاك مع الكتل الجليدية.',
    },
  },
  {
    id: 'boat-deep-nautilus',
    archetype: 'submarine_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#0284c7',
    secondaryColor: '#0f172a',
    accentColor: '#38bdf8',
    lengthScale: 1.08,
    widthScale: 1.04,
    name: 'Sous-Marin Océanographique',
    nameAr: 'غواصة الأبحاث المحيطية',
    subtitle: 'Submersible profilé en goutte d’eau pour explorer les abysses',
    subtitleAr: 'غواصة علمية انسيابية لاستكشاف أعماق المحيط المظلمة',
    discovery: {
      howItWorks:
        'Sa coque cylindrique épaisse résiste à l’énorme pression de l’eau, tandis que des barres de plongée orientent la montée et la descente.',
      realRecord:
        'À 4 000 mètres de profondeur, chaque centimètre carré de la coque supporte le poids équivalent de 400 kilogrammes !',
      didYouKnow:
        'Sous l’eau, les ondes radio ne passent presque pas : les sous-marins utilisent donc le son (le sonar) pour cartographier les fonds.',
    },
    discoveryAr: {
      howItWorks:
        'يتحمل البدن الأسطواني السميك ضغط الماء الهائل، بينما تتحكم زعانف الغطس الجانبية في الصعود والنزول.',
      realRecord:
        'عند عمق 4000 متر، يتحمل كل سنتيمتر مربع من البدن ضغطاً يعادل وزن 400 كيلوغرام!',
      didYouKnow:
        'لا تنتقل موجات الراديو جيداً تحت الماء، لذلك تستخدم الغواصات الموجات الصوتية (السونار) لرسم خرائط القاع.',
    },
  },
  {
    id: 'boat-hydrofoil-racer',
    archetype: 'catamaran_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#4f46e5',
    secondaryColor: '#38bdf8',
    accentColor: '#f43f5e',
    lengthScale: 1.06,
    widthScale: 1.06,
    name: 'Catamaran de Course à Foils',
    nameAr: 'قارب السباق الطائر فوق الماء',
    subtitle: 'Multicoque de régate qui s’élève au-dessus des vagues',
    subtitleAr: 'قارب سباق شراعي يرتفع فوق سطح الأمواج بسرعة مذهلة',
    discovery: {
      howItWorks:
        'Sous ses coques, des ailes sous-marines appelées « foils » soulèvent tout le bateau hors de l’eau dès qu’il prend de la vitesse.',
      realRecord:
        'En volant sur ses foils, un catamaran de la Coupe de l’America peut naviguer 3 fois plus vite que la vitesse du vent réel !',
      didYouKnow:
        'Une fois la coque sortie de l’eau, la traînée hydrodynamique chute de plus de 60 %, d’où cette accélération spectaculaire.',
    },
    discoveryAr: {
      howItWorks:
        'ترفع أجنحة مائية سفلية جسم القارب بالكامل فوق سطح البحر بمجرد اكتساب السرعة.',
      realRecord:
        'يستطيع القارب المزود بالأجنحة المائية الإبحار بسرعة تعادل ثلاثة أضعاف سرعة الرياح الحقيقية!',
      didYouKnow:
        'بمجرد ارتفاع البدن خارج الماء تنخفض مقاومة الاحتكاك بأكثر من 60% فيتسارع القارب كالطائرة.',
    },
  },

  {
    id: 'plane-passenger-airliner',
    archetype: 'jet_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#f8fafc',
    secondaryColor: '#0284c7',
    accentColor: '#38bdf8',
    lengthScale: 1.08,
    widthScale: 1.06,
    name: 'Avion de Ligne Courrier',
    nameAr: 'طائرة الركاب النفاثة الحديثة',
    subtitle: 'Biréacteur à ailes en flèche pour voyager entre continents',
    subtitleAr: 'طائرة ركاب بمحركين نفاثين وأجنحة مائلة للرحلات الدولية',
    discovery: {
      howItWorks:
        'Ses réacteurs à double flux aspirent un immense volume d’air par une grande soufflante avant pour propulser l’avion à 10 km d’altitude.',
      realRecord:
        'Les vols commerciaux les plus longs relient Singapour à New York (plus de 15 300 km) sans escale en près de 18 heures !',
      didYouKnow:
        'Les petites ailettes relevées au bout des ailes (« winglets ») réduisent les tourbillons d’air et économisent jusqu’à 5 % de carburant.',
    },
    discoveryAr: {
      howItWorks:
        'تسحب المحركات التوربينية المروحية كمية هائلة من الهواء لدفع الطائرة بكفاءة على ارتفاع 10 كيلومترات.',
      realRecord:
        'تقطع أطول الرحلات الجوية التجارية أكثر من 15,300 كيلومتر دون توقف خلال نحو 18 ساعة!',
      didYouKnow:
        'تقلل الجنيحات الصغيرة المرتفعة عند أطراف الأجنحة دوامات الهواء وتوفر ما يصل إلى 5% من الوقود.',
    },
  },
  {
    id: 'plane-solar-glider',
    archetype: 'prop_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#f8fafc',
    secondaryColor: '#0ea5e9',
    accentColor: '#facc15',
    lengthScale: 1.04,
    widthScale: 1.25,
    name: 'Avion Solaire Tour du Monde',
    nameAr: 'الطائرة الشمسية عابرة القارات',
    subtitle: 'Aéronef à très grande envergure propulsé par le soleil',
    subtitleAr: 'طائرة طويلة الجناحين تعمل بالكامل بالطاقة الشمسية',
    discovery: {
      howItWorks:
        'Ses immenses ailes couvertes de cellules solaires chargent des batteries le jour pour continuer à voler toute la nuit sans carburant.',
      realRecord:
        'En 2016, l’avion Solar Impulse 2 a bouclé un tour du monde complet de 42 000 km uniquement grâce à l’énergie solaire !',
      didYouKnow:
        'Bien qu’ayant l’envergure d’un gros avion de ligne, un avion solaire pèse à peine le poids d’une voiture familiale grâce à la fibre de carbone.',
    },
    discoveryAr: {
      howItWorks:
        'تشحن الخلايا الشمسية الممتدة على الجناحين البطاريات نهاراً لتواصل الطائرة التحليق طوال الليل بلا وقود.',
      realRecord:
        'نجحت طائرة «سولار إمبلس 2» في إتمام دورة كاملة حول الأرض بطول 42 ألف كم بالطاقة الشمسية وحدها!',
      didYouKnow:
        'رغم أن عرض جناحيها يضاهي طائرة ركاب ضخمة، إلا أن وزنها لا يتجاوز وزن سيارة عائلية بفضل ألياف الكربون.',
    },
  },
  {
    id: 'plane-forestry-drone',
    archetype: 'rotor_drone',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.ENGINEER,
    primaryColor: '#16a34a',
    secondaryColor: '#facc15',
    accentColor: '#0ea5e9',
    lengthScale: 1.08,
    widthScale: 1.08,
    name: 'Drone Semeur de Forêts',
    nameAr: 'درون إعادة تشجير الغابات',
    subtitle: 'Multirotor écologique qui plante des capsules de graines',
    subtitleAr: 'طائرة مسيّرة بيئية تزرع كبسولات البذور في المناطق الجبلية',
    discovery: {
      howItWorks:
        'Il cartographie d’abord le terrain en 3D par laser, puis dépose des capsules biodégradables contenant graines et nutriments aux endroits idéaux.',
      realRecord:
        'Une équipe de drones forestiers peut déposer jusqu’à 40 000 capsules d’arbres en une seule journée sur des pentes escarpées !',
      didYouKnow:
        'L’enveloppe nutritive protège la graine des oiseaux et retient l’humidité de la rosée jusqu’à la germination.',
    },
    discoveryAr: {
      howItWorks:
        'يرسم خريطة ثلاثية الأبعاد للتضاريس أولاً، ثم يُسقط كبسولات قابلة للتحلل تحتوي على البذور والمغذيات.',
      realRecord:
        'يستطيع سرب صغير من درونات التشجير زراعة ما يصل إلى 40 ألف كبسولة شجرية في يوم واحد!',
      didYouKnow:
        'تحمي الكبسولة المغذية البذرة وتحتفظ برطوبة الندى حتى تبدأ الشجرة الصغيرة بالنمو.',
    },
  },

  // =========================================================================
  // PALIER 4 · EXPERT — VOITURES, BATEAUX, AVIONS (12 SEEDS : 4 PAR FAMILLE)
  // =========================================================================
  {
    id: 'car-le-mans-proto',
    archetype: 'race_prototype',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#0284c7',
    secondaryColor: '#f8fafc',
    accentColor: '#f43f5e',
    lengthScale: 1.06,
    widthScale: 1.04,
    name: 'Hypercar d’Endurance 24H',
    nameAr: 'سيارة سباق التحمّل 24 ساعة',
    subtitle: 'Prototype hybride caréné conçu pour courir jour et nuit',
    subtitleAr: 'نموذج سباق هجين مصمم للسباق المتواصل ليلاً ونهاراً',
    discovery: {
      howItWorks:
        'Elle combine un moteur thermique arrière et un moteur électrique avant qui récupère l’énergie à chaque gros freinage au bout des lignes droites.',
      realRecord:
        'Aux 24 Heures du Mans, les prototypes parcourent plus de 5 000 kilomètres en une seule journée à plus de 220 km/h de moyenne !',
      didYouKnow:
        'Une dérive verticale façon aileron de requin sur le capot moteur empêche la voiture de déraper à très haute vitesse.',
    },
    discoveryAr: {
      howItWorks:
        'تجمع بين محرك خلفي ومحرك كهربائي أمامي يستعيد الطاقة الضائعة عند كل كبح قوي على الحلبة.',
      realRecord:
        'تقطع سيارات سباق التحمّل أكثر من 5000 كيلومتر خلال 24 ساعة فقط بمتوسط سرعة يتجاوز 220 كم/س!',
      didYouKnow:
        'تمنع الزعنفة العمودية فوق غطاء المحرك انحراف السيارة وتحافظ على ثباتها في المنعطفات السريعة.',
    },
  },
  {
    id: 'car-heritage-steam-loco',
    archetype: 'rail_train',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#1e293b',
    secondaryColor: '#dc2626',
    accentColor: '#f59e0b',
    lengthScale: 1.08,
    widthScale: 1.02,
    name: 'Locomotive Express Classique',
    nameAr: 'القاطرة البخارية الكلاسيكية',
    subtitle: 'Grande machine ferroviaire à chaudière cylindrique et bielles',
    subtitleAr: 'قاطرة سكك حديدية تاريخية بمرجل أسطواني ومكابس دفع',
    discovery: {
      howItWorks:
        'L’eau chauffée dans la longue chaudière cylindrique devient de la vapeur sous pression qui pousse des pistons reliés aux grandes roues.',
      realRecord:
        'En 1938, la locomotive à vapeur britannique « Mallard » a atteint la vitesse incroyable de 202,6 km/h !',
      didYouKnow:
        'Le fameux « tchou-tchou » correspond exactement à l’échappement de la vapeur après chaque coup de piston dans la cheminée.',
    },
    discoveryAr: {
      howItWorks:
        'يتحول الماء الساخن داخل المرجل الأسطواني إلى بخار مضغوط يدفع المكابس المتصلة بالعجلات الفولاذية.',
      realRecord:
        'سجّلت القاطرة البخارية الشهيرة «مالارد» عام 1938 رقماً قياسياً تاريخياً بلغ 202.6 كم/س!',
      didYouKnow:
        'ينتج الصوت الإيقاعي الشهير للقطار البخاري عن خروج دفعات البخار من المدخنة مع كل شوط للمكبس.',
    },
  },
  {
    id: 'car-hydrogen-semi',
    archetype: 'utility_truck',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#0ea5e9',
    secondaryColor: '#e2e8f0',
    accentColor: '#10b981',
    lengthScale: 1.12,
    widthScale: 1.04,
    name: 'Camion Pile à Hydrogène',
    nameAr: 'شاحنة الهيدروجين النظيفة',
    subtitle: 'Poids lourd longue distance qui ne rejette que de la vapeur d’eau',
    subtitleAr: 'شاحنة نقل ثقيلة بعيدة المدى لا تنتج سوى بخار الماء النقي',
    discovery: {
      howItWorks:
        'Sa pile à combustible combine l’hydrogène des réservoirs avec l’oxygène de l’air pour produire de l’électricité et de l’eau pure.',
      realRecord:
        'Un camion à hydrogène fait le plein en 15 minutes pour parcourir jusqu’à 800 kilomètres avec 40 tonnes de marchandises !',
      didYouKnow:
        'Les réservoirs d’hydrogène derrière la cabine sont tissés en fibre de carbone ultra-résistante.',
    },
    discoveryAr: {
      howItWorks:
        'تدمج خلية الوقود غاز الهيدروجين مع أكسجين الهواء لتوليد الكهرباء اللازمة للمحرك مع خروج ماء نقي فقط.',
      realRecord:
        'تُزوّد شاحنة الهيدروجين بالوقود في 15 دقيقة لتقطع ما يصل إلى 800 كيلومتر بحمولة كاملة!',
      didYouKnow:
        'تُصنع خزانات الهيدروجين خلف المقصورة من طبقات سميكة من ألياف الكربون فائقة المتانة.',
    },
  },
  {
    id: 'car-solar-cruiser-gt',
    archetype: 'city_coupe',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#7c3aed',
    secondaryColor: '#f8fafc',
    accentColor: '#38bdf8',
    lengthScale: 1.1,
    widthScale: 1.02,
    name: 'Berline Aérodynamique Éco-GT',
    nameAr: 'سيارة السياحة الانسيابية الذكية',
    subtitle: 'Routière profilée en goutte d’eau à très faible traînée d’air',
    subtitleAr: 'سيارة كهربائية فائقة الانسيابية بأقل مقاومة للهواء',
    discovery: {
      howItWorks:
        'Chaque courbe de sa carrosserie et son fond plat guident l’air sans tourbillon pour parcourir un maximum de kilomètres par kilowattheure.',
      realRecord:
        'Les prototypes routiers les plus aérodynamiques franchissent les 1 000 kilomètres d’autonomie sur une seule charge de batterie !',
      didYouKnow:
        'À plus de 90 km/h, plus de la moitié de l’énergie d’une voiture sert uniquement à écarter l’air devant elle.',
    },
    discoveryAr: {
      howItWorks:
        'يوجه تصميمها الانسيابي وقاعدتها المسطحة تيار الهواء بسلاسة لتقليل استهلاك الطاقة إلى الحد الأدنى.',
      realRecord:
        'تتجاوز أكثر السيارات الكهربائية انسيابية مسافة 1000 كيلومتر بشحنة بطارية واحدة!',
      didYouKnow:
        'عند السير بسرعة تتجاوز 90 كم/س، يُستهلك أكثر من نصف طاقة السيارة في مقاومة الهواء وحده.',
    },
  },

  {
    id: 'boat-container-giant',
    archetype: 'work_ship',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#0369a1',
    secondaryColor: '#ea580c',
    accentColor: '#facc15',
    lengthScale: 1.16,
    widthScale: 1.08,
    name: 'Porte-Conteneurs Transocéanique',
    nameAr: 'سفينة الحاويات العابرة للمحيطات',
    subtitle: 'Géant des mers transportant des milliers de boîtes standardisées',
    subtitleAr: 'عملاق بحري ينقل آلاف الحاويات القياسية بين القارات',
    discovery: {
      howItWorks:
        'Toutes les marchandises sont rangées dans des boîtes métalliques de taille identique empilées comme des briques de construction et verrouillées.',
      realRecord:
        'Les plus grands porte-conteneurs mesurent 400 mètres de long (plus que la hauteur de la Tour Eiffel) et portent 24 000 conteneurs !',
      didYouKnow:
        'Inventé en 1956, le conteneur standard permet de passer directement d’un bateau à un train ou un camion en quelques minutes.',
    },
    discoveryAr: {
      howItWorks:
        'تُرتّب البضائع داخل صناديق معدنية موحدة المقاس تُرصّ فوق بعضها مثل المكعبات وتُثبّت بأقفال فولاذية.',
      realRecord:
        'يبلغ طول أكبر سفن الحاويات 400 متر وتحمل على متنها نحو 24 ألف حاوية في رحلة واحدة!',
      didYouKnow:
        'سمح ابتكار الحاوية القياسية بنقل البضائع من السفينة إلى القطار أو الشاحنة في دقائق دون تفريغها.',
    },
  },
  {
    id: 'boat-rescue-submarine',
    archetype: 'submarine_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#f97316',
    secondaryColor: '#f8fafc',
    accentColor: '#0284c7',
    lengthScale: 1.04,
    widthScale: 1.06,
    name: 'Sous-Marin de Secours DSRV',
    nameAr: 'غواصة الإنقاذ في الأعماق',
    subtitle: 'Submersible spécialisé capable de s’amarrer sous l’océan',
    subtitleAr: 'غواصة إنقاذ متخصصة قادرة على الالتحام تحت سطح البحر',
    discovery: {
      howItWorks:
        'Ses propulseurs orientables et son sas inférieur étanche lui permettent de se poser au millimètre près sous la mer malgré les courants.',
      realRecord:
        'Transportable dans un gros avion cargo, un sous-marin de secours peut intervenir dans n’importe quel océan du globe en moins de 24 heures !',
      didYouKnow:
        'Des projecteurs LED blancs et des caméras acoustiques l’aident à voir dans l’obscurité totale au-delà de 200 mètres de fond.',
    },
    discoveryAr: {
      howItWorks:
        'تتيح دافعاتها الموجهة وبوابة الالتحام السفلية التثبت بدقة المليمتر تحت الماء رغم التيارات البحرية.',
      realRecord:
        'يمكن شحن غواصة الإنقاذ جواً للوصول إلى أي محيط في العالم خلال أقل من 24 ساعة!',
      didYouKnow:
        'تعتمد على كشافات ضوئية قوية وكاميرات صوتية للرؤية في الظلام الدامس تحت عمق 200 متر.',
    },
  },
  {
    id: 'boat-solar-expedition-cat',
    archetype: 'catamaran_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#0f172a',
    secondaryColor: '#38bdf8',
    accentColor: '#facc15',
    lengthScale: 1.1,
    widthScale: 1.12,
    name: 'Catamaran Solaire Planétaire',
    nameAr: 'سفينة الكاتاماران الشمسية العالمية',
    subtitle: 'Navire couvert de panneaux photovoltaïques sans voile ni carburant',
    subtitleAr: 'سفينة مزدوجة مغطاة بالألواح الشمسية تبحر بلا وقود',
    discovery: {
      howItWorks:
        'Son large pont entre les deux coques offre une immense terrasse solaire qui alimente deux moteurs électriques silencieux jour et nuit.',
      realRecord:
        'Le navire suisse PlanetSolar a réalisé le premier tour du monde maritime 100 % solaire sur plus de 60 000 kilomètres !',
      didYouKnow:
        'Grâce à ses moteurs sans vibration ni bruit, les biologistes marins l’utilisent pour écouter le chant des baleines.',
    },
    discoveryAr: {
      howItWorks:
        'يوفر السطح العريض بين البدنين مساحة واسعة للألواح الشمسية لتغذية محركين كهربائيين ليلاً ونهاراً.',
      realRecord:
        'أتمت سفينة «بلانيت سولار» أول رحلة بحرية حول العالم بالطاقة الشمسية لمسافة تجاوزت 60 ألف كم!',
      didYouKnow:
        'يستخدمها علماء الأحياء البحرية لدراسة أصوات الحيتان لأن محركاتها الكهربائية صامتة تماماً.',
    },
  },
  {
    id: 'boat-clipper-three-mast',
    archetype: 'sail_vessel',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#1e3a8a',
    secondaryColor: '#f8fafc',
    accentColor: '#eab308',
    lengthScale: 1.14,
    widthScale: 1.02,
    name: 'Grand Clipper École',
    nameAr: 'سفينة الكليبر الشراعية الكبرى',
    subtitle: 'Voilier de haute mer fin et élancé conçu pour fendre la houle',
    subtitleAr: 'سفينة شراعية طويلة ورشيقة مصممة لشق أمواج المحيط',
    discovery: {
      howItWorks:
        'Sa carène très longue et étroite combinée à une haute voilure offre une vitesse de coque remarquable dans les vents alizés.',
      realRecord:
        'Au XIXe siècle, les clippers les plus rapides reliaient déjà l’Australie à l’Europe en moins de 70 jours uniquement à la voile !',
      didYouKnow:
        'Le mot « clipper » vient de l’anglais « to clip », qui signifiait filer à vive allure sur les vagues.',
    },
    discoveryAr: {
      howItWorks:
        'يجمع بدنها الطويل والرفيع مع الصاري العالي لتحقيق سرعات عالية جداً مع الرياح التجارية.',
      realRecord:
        'كانت سفن الكليبر السريعة تقطع المسافة بين أستراليا وأوروبا في أقل من 70 يوماً بقوة الرياح وحدها!',
      didYouKnow:
        'ما زالت الأكاديميات البحرية تستخدم السفن الشراعية الكبرى لتعليم الملاحة والعمل الجماعي.',
    },
  },

  {
    id: 'plane-supersonic-delta',
    archetype: 'jet_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#f8fafc',
    secondaryColor: '#1e3a8a',
    accentColor: '#ef4444',
    lengthScale: 1.16,
    widthScale: 0.98,
    name: 'Jet Supersonique Aile Delta',
    nameAr: 'الطائرة النفاثة فوق الصوتية دلتا',
    subtitle: 'Avion à aile triangulaire conçu pour franchir le mur du son',
    subtitleAr: 'طائرة ذات جناح مثلث مصممة لتجاوز سرعة الصوت',
    discovery: {
      howItWorks:
        'Son aile triangulaire en forme de lettre grecque Delta (Δ) reste derrière l’onde de choc supersonique tout en restant stable à l’atterrissage.',
      realRecord:
        'Le célèbre avion supersonique Concorde traversait l’Atlantique à Mach 2 (plus de 2 150 km/h), soit deux fois la vitesse du son !',
      didYouKnow:
        'À Mach 2, le frottement de l’air chauffait le fuselage du Concorde au point de l’allonger d’environ 20 centimètres en plein vol !',
    },
    discoveryAr: {
      howItWorks:
        'يساعد الجناح المثلثي (دلتا) على اختراق موجات الهواء فوق الصوتية بكفاءة مع الحفاظ على الثبات عند الهبوط.',
      realRecord:
        'كانت طائرة الكونكورد تعبر المحيط الأطلسي بسرعة تفوق ضعفي سرعة الصوت (أكثر من 2150 كم/س)!',
      didYouKnow:
        'بسبب حرارة احتكاك الهواء عند هذه السرعة، كان جسم الطائرة يتمدد بنحو 20 سنتيمتراً أثناء الطيران!',
    },
  },
  {
    id: 'plane-heavy-cargo-lifter',
    archetype: 'prop_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#475569',
    secondaryColor: '#e2e8f0',
    accentColor: '#f97316',
    lengthScale: 1.14,
    widthScale: 1.14,
    name: 'Avion Cargo Humanitaire',
    nameAr: 'طائرة الشحن الإغاثي الثقيلة',
    subtitle: 'Transporteur à aile haute capable de poser du matériel partout',
    subtitleAr: 'طائرة نقل ذات جناح علوي قادرة على الهبوط في أصعب المدارج',
    discovery: {
      howItWorks:
        'Son aile placée tout en haut dégage un vaste plancher plat avec rampe arrière et éloigne les moteurs des graviers des pistes isolées.',
      realRecord:
        'Un grand avion cargo humanitaire peut emporter plus de 20 tonnes de vivres, d’eau potable et un camion complet dans sa soute !',
      didYouKnow:
        'Son train d’atterrissage multi-roues répartit le poids pour atterrir sur la terre battue, le sable dur ou la glace.',
    },
    discoveryAr: {
      howItWorks:
        'يرفع الجناح العلوي المحركات بعيداً عن الحصى ويوفر ساحة شحن مسطحة واسعة مزودة ببوابة خلفية.',
      realRecord:
        'تحمل طائرة الإغاثة الثقيلة أكثر من 20 طناً من الإمدادات والمياه وحتى المركبات داخل عنبرها!',
      didYouKnow:
        'توزع عجلاتها المتعددة الوزن بدقة لتهبط بأمان فوق المدارج الترابية أو الجليدية.',
    },
  },
  {
    id: 'plane-tiltrotor-vtol',
    archetype: 'rotor_drone',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#0284c7',
    secondaryColor: '#f8fafc',
    accentColor: '#10b981',
    lengthScale: 1.12,
    widthScale: 1.12,
    name: 'Navette Aérienne eVTOL',
    nameAr: 'المركبة الجوية الكهربائية العمودية',
    subtitle: 'Aéronef électrique décollant verticalement sans piste',
    subtitleAr: 'مركبة طيران كهربائية تقلع وتهبط عمودياً دون مدرج',
    discovery: {
      howItWorks:
        'Plusieurs rotors électriques indépendants assurent le décollage vertical silencieux comme un hélicoptère puis le vol rapide vers l’avant.',
      realRecord:
        'Les nouvelles navettes eVTOL sont jusqu’à 100 fois plus silencieuses qu’un hélicoptère classique en phase de croisière !',
      didYouKnow:
        'En répartissant la portance sur plusieurs moteurs électriques indépendants, la sécurité est multipliée par redondance.',
    },
    discoveryAr: {
      howItWorks:
        'تتيح المراوح الكهربائية المتعددة الإقلاع العمودي الهادئ كالمروحية ثم الانطلاق للأمام بكفاءة.',
      realRecord:
        'تُعد مركبات الطيران الكهربائي العمودي أكثر هدوءاً بمرات عديدة من المروحيات التقليدية!',
      didYouKnow:
        'يضمن توزيع الدفع على عدة محركات كهربائية مستقلة مستوى عالياً جداً من الأمان والاعتمادية.',
    },
  },
  {
    id: 'plane-polar-ski-biplane',
    archetype: 'seaplane_biplane',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.EXPERT,
    primaryColor: '#e11d48',
    secondaryColor: '#f8fafc',
    accentColor: '#facc15',
    lengthScale: 1.06,
    widthScale: 1.08,
    name: 'Avion d’Expédition Arctique',
    nameAr: 'طائرة البعثات القطبية',
    subtitle: 'Aéronef grand froid ravitaillant les stations de recherche polaires',
    subtitleAr: 'طائرة مصممة للأجواء المتجمدة لدعم محطات الأبحاث القطبية',
    discovery: {
      howItWorks:
        'Équipé de patins-flotteurs profilés et d’un réchauffeur moteur, il se pose sur les glaciers et la neige profonde à -40 °C.',
      realRecord:
        'Les avions polaires ravitaillent la station du Pôle Sud située sur un plateau de glace à 2 835 mètres d’altitude !',
      didYouKnow:
        'Sa couleur rouge corail ou orange vif permet de le repérer immédiatement sur l’immensité blanche de la banquise.',
    },
    discoveryAr: {
      howItWorks:
        'تسمح الزلاجات الانسيابية وأنظمة التدفئة الميكانيكية بالهبوط فوق الجليد والثلوج عند حرارة 40 تحت الصفر.',
      realRecord:
        'تزود طائرات البعثات القطبية محطة القطب الجنوبي الواقعة على ارتفاع 2835 متراً فوق الجليد!',
      didYouKnow:
        'يُختار اللون الأحمر الساطع لهيكلها ليسهل تمييزها فوراً وسط المساحات البيضاء الشاسعة.',
    },
  },

  // =========================================================================
  // PALIER 5 · MAÎTRE CONSTRUCTEUR — VOITURES, BATEAUX, AVIONS (12 SEEDS)
  // =========================================================================
  {
    id: 'car-maglev-shinkansen',
    archetype: 'rail_train',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.MASTER,
    primaryColor: '#0284c7',
    secondaryColor: '#f8fafc',
    accentColor: '#f59e0b',
    lengthScale: 1.18,
    widthScale: 0.98,
    name: 'Train à Lévitation Magnétique',
    nameAr: 'قطار الرفع المغناطيسي الفائق',
    subtitle: 'Train futuriste flottant à quelques centimètres au-dessus de son rail',
    subtitleAr: 'قطار مستقبلي يطفو مغناطيسياً فوق مساره دون ملامسته',
    discovery: {
      howItWorks:
        'Des aimants supraconducteurs soulèvent le train et le propulsent vers l’avant : sans aucun contact avec le rail, seul l’air le freine !',
      realRecord:
        'Au Japon, le Maglev expérimental L0 a établi le record absolu de vitesse ferroviaire à 603 km/h !',
      didYouKnow:
        'Son long nez profilé comme le bec d’un oiseau martin-pêcheur évite le bang sonore quand le train entre dans un tunnel à pleine vitesse.',
    },
    discoveryAr: {
      howItWorks:
        'ترفع مغانط فائقة التوصيل القطار وتدفعه للأمام دون أي تلامس ميكانيكي مع المسار، فيلغى الاحتكاك تماماً!',
      realRecord:
        'سجّل قطار الرفع المغناطيسي الياباني الرقم القياسي العالمي المطلق للقطارات بسرعة 603 كم/س!',
      didYouKnow:
        'استُلهمت مقدمته الطويلة من منقار طائر الرفراف لمنع حدوث موجة صوتية قوية عند دخول الأنفاق.',
    },
  },
  {
    id: 'car-supersonic-land-record',
    archetype: 'race_prototype',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.MASTER,
    primaryColor: '#ea580c',
    secondaryColor: '#1e3a8a',
    accentColor: '#facc15',
    lengthScale: 1.2,
    widthScale: 0.96,
    name: 'Flèche du Record Terrestre',
    nameAr: 'مركبة الرقم القياسي للسرعة البرية',
    subtitle: 'Engin expérimental conçu pour rouler plus vite que le son sur lac salé',
    subtitleAr: 'مركبة اختبارية مصممة لتجاوز سرعة الصوت على البحيرات الملحية المسطحة',
    discovery: {
      howItWorks:
        'À plus de 1 000 km/h, des pneus en caoutchouc exploseraient : elle roule donc sur des disques usinés en alliage d’aluminium aéronautique !',
      realRecord:
        'Le véhicule ThrustSSC détient le record mondial de vitesse terrestre à 1 227,985 km/h (Mach 1,02) dans le désert du Black Rock !',
      didYouKnow:
        'Ses roues tournent à plus de 10 000 tours par minute et le freinage final nécessite des parachutes aérodynamiques.',
    },
    discoveryAr: {
      howItWorks:
        'عند سرعة تتجاوز 1000 كم/س لا تتحمل الإطارات المطاطية الدوران، لذا تسير المركبة على عجلات مصمتة من الألومنيوم الفضائي!',
      realRecord:
        'تحمل مركبة «ثراست إس إس سي» الرقم القياسي العالمي للسرعة على اليابسة البالغ 1227.9 كم/س!',
      didYouKnow:
        'تدور عجلاتها بأكثر من 10 آلاف دورة في الدقيقة وتستخدم مظلات خلفية خاصة لإبطائها بأمان.',
    },
  },
  {
    id: 'car-mobile-science-convoy',
    archetype: 'utility_truck',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.MASTER,
    primaryColor: '#0f766e',
    secondaryColor: '#f8fafc',
    accentColor: '#f59e0b',
    lengthScale: 1.15,
    widthScale: 1.08,
    name: 'Camion Laboratoire Sismique',
    nameAr: 'شاحنة المختبر الجيولوجي المتنقل',
    subtitle: 'Unité scientifique mobile analysant les couches profondes de la Terre',
    subtitleAr: 'وحدة علمية متنقلة لدراسة طبقات الأرض العميقة',
    discovery: {
      howItWorks:
        'Un plateau vibrant sous le châssis envoie de douces ondes acoustiques dans le sol et des centaines de capteurs écoutent leur écho souterrain.',
      realRecord:
        'Cette échographie géologique permet de cartographier des nappes géothermiques jusqu’à 5 kilomètres sous nos pieds sans creuser !',
      didYouKnow:
        'C’est exactement le même principe physique qu’une échographie médicale, mais appliqué à l’échelle d’une montagne.',
    },
    discoveryAr: {
      howItWorks:
        'ترسل منصة اهتزاز دقيقة موجات صوتية خفيفة في الأرض وتلتقط المستشعرات صداها لرسم خريطة الطبقات الجوفية.',
      realRecord:
        'تتيح هذه التقنية تصوير التكوينات الصخرية ومصادر الطاقة الحرارية على عمق يصل إلى 5 كيلومترات دون حفر!',
      didYouKnow:
        'تعتمد هذه الشاحنة نفس المبدأ الفيزيائي للتصوير بالموجات فوق الصوتية الطبي ولكن على نطاق الجبال.',
    },
  },
  {
    id: 'car-autonomous-cyber-shuttle',
    archetype: 'city_coupe',
    category: VehicleCategory.CAR,
    tier: DifficultyTier.MASTER,
    primaryColor: '#0284c7',
    secondaryColor: '#0f172a',
    accentColor: '#22c55e',
    lengthScale: 1.08,
    widthScale: 1.06,
    name: 'Véhicule Laboratoire Lidar',
    nameAr: 'مركبة القيادة الذاتية بالليدار',
    subtitle: 'Voiture d’ingénierie équipée de capteurs laser 360° et télémétrie',
    subtitleAr: 'مركبة هندسية مجهزة بمستشعرات ليزر محيطية بزاوية 360 درجة',
    discovery: {
      howItWorks:
        'Une tourelle Lidar sur le toit émet des millions d’impulsions laser invisibles chaque seconde pour reconstruire la rue en 3D temps réel.',
      realRecord:
        'Ses capteurs détectent la distance et la vitesse d’un piéton ou d’un vélo à plus de 200 mètres en quelques millisecondes !',
      didYouKnow:
        'Le mot LIDAR signifie « Light Detection And Ranging » : c’est un radar qui utilise des rayons lumineux au lieu d’ondes radio.',
    },
    discoveryAr: {
      howItWorks:
        'يطلق مستشعر الليدار العلوي ملايين النبضات الليزرية كل ثانية لبناء خريطة ثلاثية الأبعاد فورية للطريق.',
      realRecord:
        'ترصد مستشعراتها مسافة وسرعة المشاة والدراجات على بُعد يتجاوز 200 متر في أجزاء من الألف من الثانية!',
      didYouKnow:
        'كلمة ليدار تعني تحديد المدى بالضوء، فهو يعمل مثل الرادار لكن بحزم ضوئية دقيقة جداً.',
    },
  },

  {
    id: 'boat-wind-cargo-wingsail',
    archetype: 'sail_vessel',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.MASTER,
    primaryColor: '#0284c7',
    secondaryColor: '#f8fafc',
    accentColor: '#10b981',
    lengthScale: 1.18,
    widthScale: 1.08,
    name: 'Cargo Vélique Nouvelle Génération',
    nameAr: 'سفينة الشحن بالأشرعة الجناحية',
    subtitle: 'Navire marchand hybride propulsé par d’immenses ailes-voiles automatisées',
    subtitleAr: 'سفينة نقل حديثة تندفع بأشرعة عمودية ذكية لتوفير الطاقة',
    discovery: {
      howItWorks:
        'Des ordinateurs météo orientent automatiquement ses grandes voiles profilées pour capter les meilleurs vents océaniques tout au long de la route.',
      realRecord:
        'Un cargo vélique transatlantique réduit jusqu’à 80 % ses émissions de CO₂ par rapport à un cargo thermique classique !',
      didYouKnow:
        'Ses mâts télescopiques peuvent s’abaisser automatiquement pour passer sous les grands ponts à l’entrée des ports.',
    },
    discoveryAr: {
      howItWorks:
        'توجه الحواسيب الملاحية الأشرعة العملاقة تلقائياً للاستفادة القصوى من رياح المحيط طوال الرحلة.',
      realRecord:
        'تخفض سفن الشحن الشراعية الحديثة استهلاك الوقود والانبعاثات بنسبة تصل إلى 80% عبر الأطلسي!',
      didYouKnow:
        'يمكن خفض الصواري التلسكوبية آلياً لتتمكن السفينة من المرور بسهولة تحت الجسور عند الموانئ.',
    },
  },
  {
    id: 'boat-abyssal-hadal-sub',
    archetype: 'submarine_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.MASTER,
    primaryColor: '#f8fafc',
    secondaryColor: '#0369a1',
    accentColor: '#f97316',
    lengthScale: 1.12,
    widthScale: 1.08,
    name: 'Bathyscaphe des Grandes Fosses',
    nameAr: 'غواصة الخنادق المحيطية السحيقة',
    subtitle: 'Submersible en titane conçu pour le point le plus profond des océans',
    subtitleAr: 'غواصة من التيتانيوم مصممة للوصول إلى أعمق نقطة في محيطات الأرض',
    discovery: {
      howItWorks:
        'L’équipage prend place dans une sphère parfaite en alliage de titane de 9 cm d’épaisseur qui répartit uniformément la pression colossale.',
      realRecord:
        'Au fond de Challenger Deep (10 928 mètres), la pression dépasse 1 100 fois celle de l’atmosphère au niveau de la mer !',
      didYouKnow:
        'Même à près de 11 km sous la surface sans aucune lumière solaire, les scientifiques ont découvert des crevettes et poissons abyssaux !',
    },
    discoveryAr: {
      howItWorks:
        'يجلس الطاقم داخل كرة متقنة الصنع من سبيكة التيتانيوم بسمك 9 سم لتوزيع الضغط المائي الهائل بالتساوي.',
      realRecord:
        'في قاع «تشالنجر ديب» على عمق 10,928 متراً، يفوق الضغط المائي الضغط الجوي السطحي بأكثر من 1100 مرة!',
      didYouKnow:
        'حتى على عمق 11 كم حيث الظلام التام، اكتشف العلماء كائنات بحرية مدهشة متكيفة مع الأعماق!',
    },
  },
  {
    id: 'boat-offshore-wind-vessel',
    archetype: 'work_ship',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.MASTER,
    primaryColor: '#0ea5e9',
    secondaryColor: '#facc15',
    accentColor: '#ef4444',
    lengthScale: 1.16,
    widthScale: 1.12,
    name: 'Navire Atelier Éolien en Mer',
    nameAr: 'سفينة تركيب توربينات الرياح البحرية',
    subtitle: 'Vaisseau d’ingénierie positionné au centimètre près par GPS et propulseurs',
    subtitleAr: 'سفينة هندسية متطورة تثبت موقعها في البحر بدقة السنتيمتر',
    discovery: {
      howItWorks:
        'Son système de positionnement dynamique pilote plusieurs propulseurs à 360° pour maintenir le navire parfaitement immobile face aux vagues et au vent.',
      realRecord:
        'Ces navires assemblent en pleine mer des éoliennes géantes hautes de 260 mètres dont chaque pale mesure plus de 100 mètres !',
      didYouKnow:
        'Un seul tour de rotor d’une grande éolienne maritime produit assez d’électricité pour alimenter une maison pendant deux jours.',
    },
    discoveryAr: {
      howItWorks:
        'يتحكم نظام التموضع الديناميكي في دافعات دوارة بزاوية 360 درجة لتثبيت السفينة في مكانها بدقة وسط الأمواج.',
      realRecord:
        'تركب هذه السفن في عرض البحر توربينات رياح عملاقة يصل ارتفاعها إلى 260 متراً وطول الشفرة الواحدة 100 متر!',
      didYouKnow:
        'تنتج دورة واحدة فقط لتوربين رياح بحري كبير كهرباء تكفي لتشغيل منزل كامل لمدة يومين.',
    },
  },
  {
    id: 'boat-wave-piercer-trimaran',
    archetype: 'catamaran_craft',
    category: VehicleCategory.BOAT,
    tier: DifficultyTier.MASTER,
    primaryColor: '#334155',
    secondaryColor: '#38bdf8',
    accentColor: '#10b981',
    lengthScale: 1.16,
    widthScale: 1.14,
    name: 'Navire Percée-de-Vagues Haute Vitesse',
    nameAr: 'سفينة اختراق الأمواج فائقة السرعة',
    subtitle: 'Multicoque en aluminium traversant la houle au lieu de rebondir dessus',
    subtitleAr: 'سفينة متعددة الأبدان من الألومنيوم تخترق الأمواج بدلاً من القفز فوقها',
    discovery: {
      howItWorks:
        'Ses étraves fines et allongées fendent la crête des vagues au lieu de monter dessus, réduisant considérablement le tangage à haute vitesse.',
      realRecord:
        'Le navire rapide Francisco construit en aluminium atteint 58 nœuds (107 km/h) tout en transportant 1 000 passagers et 150 voitures !',
      didYouKnow:
        'Ses hydrojets projettent chaque seconde le volume d’eau d’une piscine olympique en moins d’une minute !',
    },
    discoveryAr: {
      howItWorks:
        'تشق مقدماتها الحادة والطويلة قمم الأمواج بدلاً من الارتفاع فوقها، مما يمنع الاهتزاز عند السرعات العالية.',
      realRecord:
        'تصل سرعة أسرع سفينة ركاب متعددة الأبدان في العالم إلى 107 كم/س مع نقل 1000 راكب و150 سيارة!',
      didYouKnow:
        'تضخ نفاثاتها المائية كمية مياه هائلة تعادل ملء مسبح أولمبي كامل في أقل من دقيقة واحدة!',
    },
  },

  {
    id: 'plane-stratospheric-research-jet',
    archetype: 'jet_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.MASTER,
    primaryColor: '#f8fafc',
    secondaryColor: '#0284c7',
    accentColor: '#f97316',
    lengthScale: 1.18,
    widthScale: 1.14,
    name: 'Avion Laboratoire Stratosphérique',
    nameAr: 'طائرة الأبحاث الستراتوسفيرية',
    subtitle: 'Biréacteur haute altitude étudiant la couche d’ozone et le climat',
    subtitleAr: 'طائرة أبحاث عالية الارتفاع لدراسة الغلاف الجوي والمناخ',
    discovery: {
      howItWorks:
        'Grâce à ses ailes allongées et sa cabine pressurisée spéciale, il vole deux fois plus haut que les avions de ligne pour analyser l’atmosphère.',
      realRecord:
        'Les avions scientifiques haute altitude atteignent plus de 21 000 mètres d’altitude, là où le ciel devient déjà noir profond en plein jour !',
      didYouKnow:
        'Ils recueillent même de minuscules poussières de comètes qui flottent lentement dans la haute stratosphère.',
    },
    discoveryAr: {
      howItWorks:
        'بفضل أجنحتها الطويلة ومقصورتها المضغوطة تحلّق على ارتفاع يعادل ضعف ارتفاع الطائرات التجارية لدراسة الغلاف الجوي.',
      realRecord:
        'تصل طائرات الأبحاث العليا إلى ارتفاع يتجاوز 21 ألف متر حيث يبدو لون السماء داكناً حتى في النهار!',
      didYouKnow:
        'تجمع مستشعراتها الدقيقة حبيبات غبار كونية متناهية الصغر معلقة في طبقات الجو العليا.',
    },
  },
  {
    id: 'plane-flying-wing-eco-jet',
    archetype: 'jet_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.MASTER,
    primaryColor: '#0f172a',
    secondaryColor: '#38bdf8',
    accentColor: '#22c55e',
    lengthScale: 1.06,
    widthScale: 1.24,
    name: 'Avion Futuriste Aile-Fuselage',
    nameAr: 'طائرة الجناح المدمج المستقبلية',
    subtitle: 'Concept aéronautique où tout le fuselage porte l’avion dans l’air',
    subtitleAr: 'تصميم هندسي مستقبلي يساهم فيه جسم الطائرة بالكامل في توليد الرفع',
    discovery: {
      howItWorks:
        'Au lieu d’un tube cylindrique avec deux ailes séparées, le corps entier adopte un profil d’aile delta qui produit de la portance.',
      realRecord:
        'L’architecture « Blended Wing Body » étudiée par les ingénieurs aéronautiques permet d’économiser jusqu’à 30 % de carburant !',
      didYouKnow:
        'Les réacteurs placés au-dessus de l’arrière du fuselage masquent également le bruit des turbines vers le sol.',
    },
    discoveryAr: {
      howItWorks:
        'بدلاً من الأنبوب التقليدي، يتخذ جسم الطائرة بأكمله شكل جناح عريض يولد قوة رفع إضافية هائلة.',
      realRecord:
        'يوفر تصميم «الجناح المدمج بالهيكل» استهلاك الوقود بنسبة تصل إلى 30% مقارنة بالطائرات التقليدية!',
      didYouKnow:
        'يساعد وضع المحركات أعلى المؤخرة على حجب ضجيجها عن المدن على الأرض.',
    },
  },
  {
    id: 'plane-heavy-skycrane-rotor',
    archetype: 'rotor_drone',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.MASTER,
    primaryColor: '#f97316',
    secondaryColor: '#334155',
    accentColor: '#facc15',
    lengthScale: 1.18,
    widthScale: 1.18,
    name: 'Grue Volante Multi-Rotors',
    nameAr: 'الرافعة الطائرة متعددة المراوح',
    subtitle: 'Aéronef de levage de précision assemblant des pylônes et ponts en montagne',
    subtitleAr: 'مركبة رفع جوي دقيقة لتركيب الأبراج والجسور في قمم الجبال',
    discovery: {
      howItWorks:
        'Asservie par laser et GPS différentiel, elle maintient sa charge suspendue à moins de 5 centimètres d’oscillation pendant le boulonnage.',
      realRecord:
        'Les hélicoptères-grues géants peuvent soulever des charges externes de plus de 10 à 20 tonnes jusqu’au sommet des montagnes !',
      didYouKnow:
        'Installer un pylône par les airs évite de tracer des routes de chantier à travers les forêts protégées.',
    },
    discoveryAr: {
      howItWorks:
        'تعتمد على التوجيه الليزري والأقمار الصناعية لتثبيت الحمولة المعلقة بدقة سنتيمترات قليلة أثناء التركيب.',
      realRecord:
        'تستطيع المروحيات الرافعة العملاقة حمل أوزان خارجية تتراوح بين 10 و20 طناً إلى قمم الجبال الوعرة!',
      didYouKnow:
        'يحمي النقل الجوي للإنشاءات الغابات الجبلية من شق الطرق المؤقتة.',
    },
  },
  {
    id: 'plane-hybrid-transatlantic-prop',
    archetype: 'prop_aircraft',
    category: VehicleCategory.PLANE,
    tier: DifficultyTier.MASTER,
    primaryColor: '#0d9488',
    secondaryColor: '#f8fafc',
    accentColor: '#facc15',
    lengthScale: 1.16,
    widthScale: 1.18,
    name: 'Avion Laboratoire Hybride-Électrique',
    nameAr: 'طائرة الاختبار الهجينة الكهربائية',
    subtitle: 'Banc d’essai volant préparant l’aviation décarbonée de demain',
    subtitleAr: 'طائرة أبحاث متطورة تختبر أنظمة الدفع الكهربائي الهجين للطيران النظيف',
    discovery: {
      howItWorks:
        'Il combine une génératrice haute efficacité et des moteurs électriques distribués sur le bord d’attaque de l’aile pour souffler l’air.',
      realRecord:
        'Le soufflage distribué sur toute l’aile multiplie la portance au décollage par plus de deux !',
      didYouKnow:
        'Des câbles refroidis à très basse température permettent de transporter des mégawatts d’électricité sans alourdir l’avion.',
    },
    discoveryAr: {
      howItWorks:
        'تدمج مولداً عالي الكفاءة مع محركات كهربائية موزعة على حافة الجناح لزيادة تدفق الهواء وقوة الرفع.',
      realRecord:
        'يضاعف توزيع المراوح الكهربائية على طول الجناح قوة الرفع عند الإقلاع بأكثر من مرتين!',
      didYouKnow:
        'تسمح الكابلات فائقة التبريد بنقل طاقة كهربائية عالية جداً داخل الجناح دون زيادة وزن الطائرة.',
    },
  },
];
