import { Mission } from './schema';

export const MISSIONS: Mission[] = [
  {
    schemaVersion: 1,
    id: 'mission-solar-city',
    atelier: 'voitures',
    ages: [6, 8],
    niveau: 1,
    vehicule: 'car-solar-city',
    objectifs: [
      { fr: 'Assembler la voiture solaire en 4 pièces', en: 'Assemble the solar car with 4 parts', ar: 'تجميع السيارة الشمسية من 4 قطع' },
    ],
    etapes: [
      { fr: 'Poser le châssis', en: 'Place the chassis', ar: 'ضع الهيكل' },
      { fr: 'Fixer les trains de roues avant et arrière', en: 'Attach front and rear axles', ar: 'ركّب محوري العجلات الأمامي والخلفي' },
      { fr: 'Poser l\'habitacle', en: 'Place the cabin', ar: 'ضع المقصورة' },
    ],
    conditionsReussite: [
      { fr: 'Toutes les pièces bien aimantées', en: 'All parts snapped in place', ar: 'جميع القطع مثبتة بإحكام' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-explorer-sail',
    atelier: 'bateaux',
    ages: [6, 8],
    niveau: 1,
    vehicule: 'boat-explorer-sail',
    objectifs: [
      { fr: 'Construire le voilier d\'exploration', en: 'Build the explorer sailboat', ar: 'بناء مركب الاستكشاف الشراعي' },
    ],
    etapes: [
      { fr: 'Poser la coque', en: 'Place the hull', ar: 'ضع البدن' },
      { fr: 'Fixer la quille', en: 'Attach the keel', ar: 'ركّب عارضة التوازن' },
      { fr: 'Poser le pont, le mât et la voile', en: 'Place deck, mast and sail', ar: 'ضع السطح والصاري والشراع' },
    ],
    conditionsReussite: [
      { fr: 'Le voilier tient debout sans basculer', en: 'The sailboat stands without tipping', ar: 'المركب يقف دون انقلاب' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-aeroclub',
    atelier: 'avions',
    ages: [6, 8],
    niveau: 1,
    vehicule: 'plane-aeroclub',
    objectifs: [
      { fr: 'Monter l\'avion d\'entraînement à aile haute', en: 'Build the high-wing trainer plane', ar: 'تجميع طائرة التدريب ذات الجناح العلوي' },
    ],
    etapes: [
      { fr: 'Poser le fuselage', en: 'Place the fuselage', ar: 'ضع جسم الطائرة' },
      { fr: 'Fixer le train d\'atterrissage', en: 'Attach the landing gear', ar: 'ركّب عجلات الهبوط' },
      { fr: 'Fixer l\'aile, la queue et l\'hélice', en: 'Attach wing, tail and propeller', ar: 'ركّب الجناح والذيل والمروحة' },
    ],
    conditionsReussite: [
      { fr: 'L\'hélice tourne librement', en: 'The propeller spins freely', ar: 'تدور المروحة بحرية' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-fire-truck',
    atelier: 'voitures',
    ages: [7, 9],
    niveau: 2,
    vehicule: 'car-fire-truck',
    objectifs: [
      { fr: 'Assembler le camion de pompiers', en: 'Assemble the fire truck', ar: 'تجميع شاحنة الإطفاء' },
    ],
    etapes: [
      { fr: 'Poser le châssis lourd', en: 'Place the heavy chassis', ar: 'ضع الهيكل الثقيل' },
      { fr: 'Fixer le moteur et les trains de roues', en: 'Attach engine and axles', ar: 'ركّب المحرك ومحاور العجلات' },
      { fr: 'Poser la cabine, la citerne et l\'échelle', en: 'Place cabin, tank and ladder', ar: 'ضع الكابينة والخزان والسلم' },
    ],
    conditionsReussite: [
      { fr: 'L\'échelle est bien fixée sur la citerne', en: 'The ladder is secured on the tank', ar: 'السلم مثبت على الخزان بإحكام' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-port-tug',
    atelier: 'bateaux',
    ages: [7, 9],
    niveau: 2,
    vehicule: 'boat-port-tug',
    objectifs: [
      { fr: 'Construire le remorqueur portuaire', en: 'Build the harbor tugboat', ar: 'بناء الزورق الجارّ في الميناء' },
    ],
    etapes: [
      { fr: 'Poser la coque', en: 'Place the hull', ar: 'ضع البدن' },
      { fr: 'Fixer la propulsion', en: 'Attach propulsion', ar: 'ركّب نظام الدفع' },
      { fr: 'Poser le pont et les défenses', en: 'Place deck and fenders', ar: 'ضع السطح والمصدّات' },
    ],
    conditionsReussite: [
      { fr: 'La propulsion est bien positionnée', en: 'Propulsion is correctly positioned', ar: 'نظام الدفع في موضعه الصحيح' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-taxi-metro',
    atelier: 'voitures',
    ages: [7, 9],
    niveau: 2,
    vehicule: 'car-taxi-metro',
    objectifs: [
      { fr: 'Monter le taxi métropolitain', en: 'Assemble the metro taxi', ar: 'تجميع سيارة التاكسي الحضري' },
    ],
    etapes: [
      { fr: 'Poser le châssis', en: 'Place the chassis', ar: 'ضع الهيكل' },
      { fr: 'Fixer les trains de roues', en: 'Attach the axles', ar: 'ركّب محاور العجلات' },
      { fr: 'Poser l\'habitacle et les accessoires', en: 'Place cabin and accessories', ar: 'ضع المقصورة والملحقات' },
    ],
    conditionsReussite: [
      { fr: 'Toutes les pièces sont en place', en: 'All parts are in place', ar: 'جميع القطع في مكانها' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-dune-buggy',
    atelier: 'voitures',
    ages: [8, 10],
    niveau: 3,
    vehicule: 'car-dune-buggy',
    objectifs: [
      { fr: 'Construire le dune buggy tout-terrain', en: 'Build the off-road dune buggy', ar: 'بناء سيارة الدونة باغي للطرق الوعرة' },
    ],
    etapes: [
      { fr: 'Assembler le châssis tubulaire', en: 'Assemble the tube chassis', ar: 'تجميع الهيكل الأنبوبي' },
      { fr: 'Fixer les trains larges', en: 'Attach wide axles', ar: 'ركّب المحاور العريضة' },
      { fr: 'Poser le moteur et la carrosserie', en: 'Place engine and body', ar: 'ضع المحرك والهيكل الخارجي' },
    ],
    conditionsReussite: [
      { fr: 'Les quatre roues touchent le sol', en: 'All four wheels touch the ground', ar: 'العجلات الأربع تلمس الأرض' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-lagoon-catamaran',
    atelier: 'bateaux',
    ages: [8, 10],
    niveau: 3,
    vehicule: 'boat-lagoon-catamaran',
    objectifs: [
      { fr: 'Assembler le catamaran de lagon', en: 'Assemble the lagoon catamaran', ar: 'تجميع القارب ذو البدنين' },
    ],
    etapes: [
      { fr: 'Poser les deux coques', en: 'Place both hulls', ar: 'ضع البدنين' },
      { fr: 'Fixer le pont central', en: 'Attach the central bridge', ar: 'ركّب الجسر المركزي' },
      { fr: 'Poser la cabine et les voiles', en: 'Place cabin and sails', ar: 'ضع المقصورة والأشرعة' },
    ],
    conditionsReussite: [
      { fr: 'Les deux coques sont parallèles', en: 'Both hulls are parallel', ar: 'البدنان متوازيان' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-bush-cub',
    atelier: 'avions',
    ages: [8, 10],
    niveau: 3,
    vehicule: 'plane-bush-cub',
    objectifs: [
      { fr: 'Monter l\'avion de brousse', en: 'Build the bush plane', ar: 'تجميع طائرة البرية' },
    ],
    etapes: [
      { fr: 'Poser le fuselage et le train', en: 'Place fuselage and landing gear', ar: 'ضع الجسم وعجلات الهبوط' },
      { fr: 'Fixer les ailes', en: 'Attach the wings', ar: 'ركّب الأجنحة' },
      { fr: 'Poser la queue et l\'hélice', en: 'Place tail and propeller', ar: 'ضع الذيل والمروحة' },
    ],
    conditionsReussite: [
      { fr: 'L\'avion tient en équilibre sur son train', en: 'The plane balances on its gear', ar: 'الطائرة متوازنة على عجلاتها' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-alpine-ambulance',
    atelier: 'voitures',
    ages: [8, 10],
    niveau: 3,
    vehicule: 'car-alpine-ambulance',
    objectifs: [
      { fr: 'Construire l\'ambulance de montagne', en: 'Build the alpine ambulance', ar: 'بناء سيارة الإسعاف الجبلية' },
    ],
    etapes: [
      { fr: 'Poser le châssis 4x4', en: 'Place the 4x4 chassis', ar: 'ضع الهيكل الرباعي الدفع' },
      { fr: 'Fixer les trains renforcés', en: 'Attach reinforced axles', ar: 'ركّب المحاور المقوّاة' },
      { fr: 'Poser la cabine médicalisée', en: 'Place the medical cabin', ar: 'ضع المقصورة الطبية' },
    ],
    conditionsReussite: [
      { fr: 'La cabine médicalisée est bien fixée', en: 'Medical cabin is properly secured', ar: 'المقصورة الطبية مثبتة جيداً' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-harbor-pilot',
    atelier: 'bateaux',
    ages: [8, 10],
    niveau: 3,
    vehicule: 'boat-harbor-pilot',
    objectifs: [
      { fr: 'Monter le bateau pilote de port', en: 'Build the harbor pilot boat', ar: 'تجميع قارب المرشد البحري' },
    ],
    etapes: [
      { fr: 'Poser la coque', en: 'Place the hull', ar: 'ضع البدن' },
      { fr: 'Fixer la propulsion et le pont', en: 'Attach propulsion and deck', ar: 'ركّب نظام الدفع والسطح' },
      { fr: 'Poser la cabine de navigation', en: 'Place the navigation cabin', ar: 'ضع جسر القيادة' },
    ],
    conditionsReussite: [
      { fr: 'La cabine est au-dessus du pont', en: 'The cabin sits above the deck', ar: 'الكابينة فوق السطح' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-quadcopter',
    atelier: 'avions',
    ages: [9, 12],
    niveau: 4,
    vehicule: 'plane-park-quadcopter',
    objectifs: [
      { fr: 'Assembler le quadricoptère de parc', en: 'Assemble the park quadcopter', ar: 'تجميع الطائرة رباعية المراوح' },
    ],
    etapes: [
      { fr: 'Monter le châssis central en croix', en: 'Build the cross-shaped frame', ar: 'تجميع الهيكل بشكل صليبي' },
      { fr: 'Fixer les quatre moteurs', en: 'Attach all four motors', ar: 'ركّب المحركات الأربعة' },
      { fr: 'Poser les hélices et l\'électronique', en: 'Place propellers and electronics', ar: 'ضع المراوح والإلكترونيات' },
    ],
    conditionsReussite: [
      { fr: 'Les quatre hélices sont symétriques', en: 'All four propellers are symmetric', ar: 'المراوح الأربع متماثلة' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-safari-offroad',
    atelier: 'voitures',
    ages: [9, 12],
    niveau: 4,
    vehicule: 'car-safari-offroad',
    objectifs: [
      { fr: 'Construire le 4x4 safari tout-terrain', en: 'Build the safari off-road 4x4', ar: 'بناء سيارة السفاري رباعية الدفع' },
    ],
    etapes: [
      { fr: 'Poser le châssis renforcé', en: 'Place the reinforced chassis', ar: 'ضع الهيكل المقوّى' },
      { fr: 'Fixer le moteur et les trains surélevés', en: 'Attach engine and raised axles', ar: 'ركّب المحرك والمحاور المرتفعة' },
      { fr: 'Poser la cabine et les équipements', en: 'Place cabin and equipment', ar: 'ضع المقصورة والمعدات' },
    ],
    conditionsReussite: [
      { fr: 'La garde au sol est bien visible', en: 'Ground clearance is clearly visible', ar: 'الارتفاع عن الأرض واضح' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-water-bomber',
    atelier: 'avions',
    ages: [9, 12],
    niveau: 4,
    vehicule: 'plane-water-bomber',
    objectifs: [
      { fr: 'Monter l\'avion bombardier d\'eau', en: 'Build the water bomber plane', ar: 'تجميع طائرة إطفاء الحرائق' },
    ],
    etapes: [
      { fr: 'Poser le fuselage amphibie', en: 'Place the amphibious fuselage', ar: 'ضع جسم الطائرة البرمائية' },
      { fr: 'Fixer les ailes et les moteurs', en: 'Attach wings and engines', ar: 'ركّب الأجنحة والمحركات' },
      { fr: 'Poser le réservoir à eau et la queue', en: 'Place the water tank and tail', ar: 'ضع خزان الماء والذيل' },
    ],
    conditionsReussite: [
      { fr: 'Le réservoir est bien centré', en: 'The water tank is well centered', ar: 'خزان الماء في المنتصف بدقة' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
  {
    schemaVersion: 1,
    id: 'mission-tgv-express',
    atelier: 'voitures',
    ages: [9, 12],
    niveau: 4,
    vehicule: 'car-tgv-express',
    objectifs: [
      { fr: 'Assembler le TGV express', en: 'Assemble the high-speed train', ar: 'تجميع القطار فائق السرعة' },
    ],
    etapes: [
      { fr: 'Poser la motrice avant', en: 'Place the front locomotive', ar: 'ضع الوحدة الأمامية' },
      { fr: 'Fixer les bogies motorisés', en: 'Attach the powered bogies', ar: 'ركّب عربات القاعدة المحرّكة' },
      { fr: 'Poser les voitures et la motrice arrière', en: 'Place cars and rear locomotive', ar: 'ضع العربات والوحدة الخلفية' },
    ],
    conditionsReussite: [
      { fr: 'Les voitures sont bien articulées', en: 'Cars are properly articulated', ar: 'العربات متصلة ببعضها جيداً' },
    ],
    explication: { fr: '', en: '', ar: '' },
  },
];
