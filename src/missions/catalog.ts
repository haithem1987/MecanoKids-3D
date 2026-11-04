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
    explication: {
      fr: 'Le panneau solaire transforme la lumière du soleil en électricité. Cette électricité permet au moteur de faire tourner les roues.',
      en: 'The solar panel converts sunlight into electricity. This electricity powers the motor to turn the wheels.',
      ar: 'اللوح الشمسي يحوّل ضوء الشمس إلى كهرباء. هذه الكهرباء تُشغّل المحرك لتدوير العجلات.',
    },
    defiTransfert: {
      fr: 'La voiture avance moins bien à l\'ombre. Quelle pièce capte la lumière du soleil ?',
      en: 'The car moves less well in the shade. Which part captures sunlight?',
      ar: 'السيارة تتحرك أبطأ في الظل. أيّ قطعة تلتقط ضوء الشمس؟',
    },
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
    explication: {
      fr: 'La quille est une pièce fixée sous le bateau. Elle l\'aide à rester stable et l\'empêche de trop pencher sous l\'effet du vent.',
      en: 'The keel is a part fixed under the boat. It helps it stay stable and prevents it from leaning too much in the wind.',
      ar: 'عارضة التوازن قطعة مثبتة تحت القارب. تُساعده على البقاء ثابتاً وتمنعه من الميل الزائد تحت تأثير الريح.',
    },
    defiTransfert: {
      fr: 'Le voilier penche trop sur le côté. Regarde sous la coque : la quille est-elle bien fixée ?',
      en: 'The sailboat is leaning too much to one side. Look under the hull: is the keel properly attached?',
      ar: 'المركب يميل كثيراً على الجانب. انظر تحت البدن: هل عارضة التوازن مثبتة جيداً؟',
    },
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
    explication: {
      fr: 'L\'hélice pousse l\'avion vers l\'avant en faisant bouger l\'air vers l\'arrière. Les ailes permettent à l\'avion de rester en l\'air grâce à la force de portance.',
      en: 'The propeller pushes the plane forward by moving air backward. The wings keep the plane in the air thanks to lift.',
      ar: 'المروحة تدفع الطائرة للأمام بتحريك الهواء للخلف. الأجنحة تُبقي الطائرة في الهواء بفضل قوة الرفع.',
    },
    defiTransfert: {
      fr: 'L\'avion vibre trop. Regarde l\'hélice : est-elle bien fixée et placée au centre ?',
      en: 'The plane vibrates too much. Look at the propeller: is it properly fixed and centered?',
      ar: 'الطائرة تهتز كثيراً. انظر إلى المروحة: هل هي مثبتة جيداً وفي المنتصف؟',
    },
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
    explication: {
      fr: 'Le moteur fait tourner les roues. Pour monter l\'échelle, une roue dentée entraîne une barre avec des dents. Les dents s\'accrochent les unes aux autres et font avancer l\'échelle.',
      en: 'The engine turns the wheels. To raise the ladder, a toothed wheel drives a bar with teeth. The teeth catch onto each other and push the ladder forward.',
      ar: 'المحرك يدير العجلات. لرفع السلم، ترس مسنّن يُحرّك قضيباً ذا أسنان. تتشابك الأسنان وتدفع السلم للأمام.',
    },
    defiTransfert: {
      fr: 'L\'échelle ne monte plus. Observe le mécanisme qui la fait avancer : quelle pièce dentée est mal placée ?',
      en: 'The ladder won\'t go up anymore. Look at the mechanism that makes it move: which toothed part is wrongly placed?',
      ar: 'السلم لم يعد يرتفع. راقب الآلية التي تُحرّكه: أيّ قطعة مسنّنة في غير مكانها؟',
    },
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
    explication: {
      fr: 'L\'hélice tourne dans l\'eau et pousse le bateau vers l\'avant. Elle permet au remorqueur de déplacer de grands bateaux.',
      en: 'The propeller spins in the water and pushes the boat forward. It allows the tugboat to move large ships.',
      ar: 'المروحة تدور في الماء وتدفع القارب للأمام. تُمكّن الزورق الجارّ من تحريك السفن الكبيرة.',
    },
    defiTransfert: {
      fr: 'Le bateau n\'avance plus correctement. Regarde son hélice à l\'arrière : est-elle bien orientée ?',
      en: 'The boat is no longer moving properly. Look at its propeller at the back: is it correctly oriented?',
      ar: 'القارب لم يعد يتقدم جيداً. انظر إلى مروحته في المؤخرة: هل هي مُوجَّهة بشكل صحيح؟',
    },
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
    explication: {
      fr: 'Les quatre roues permettent au taxi de rester stable. Les suspensions aident les roues à garder le contact avec la route, même lorsqu\'elle n\'est pas plate.',
      en: 'The four wheels keep the taxi stable. Suspensions help the wheels stay in contact with the road, even when it\'s uneven.',
      ar: 'العجلات الأربع تُبقي التاكسي ثابتاً. الزنبركات تُساعد العجلات على ملامسة الطريق حتى عندما يكون غير مستوٍ.',
    },
    defiTransfert: {
      fr: 'Le taxi penche d\'un côté. Observe les roues : un essieu est-il mal fixé ?',
      en: 'The taxi is leaning to one side. Look at the wheels: is an axle wrongly attached?',
      ar: 'التاكسي يميل لجانب. راقب العجلات: هل أحد المحاور مثبت بشكل خاطئ؟',
    },
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
    explication: {
      fr: 'Le châssis tubulaire est léger mais solide, comme une cage. Les roues larges répartissent le poids du buggy sur une plus grande surface de sable. Elles s\'enfoncent donc moins facilement.',
      en: 'The tube chassis is light but strong, like a cage. Wide wheels spread the buggy\'s weight over a larger area of sand, so they don\'t sink in as easily.',
      ar: 'الهيكل الأنبوبي خفيف لكنه متين كالقفص. العجلات العريضة توزّع وزن السيارة على مساحة أكبر من الرمال، فلا تغوص بسهولة.',
    },
    defiTransfert: {
      fr: 'Une roue s\'enfonce dans le sable virtuel. Laquelle est trop étroite ? Compare les 4 trains.',
      en: 'One wheel sinks in the virtual sand. Which one is too narrow? Compare all 4 axles.',
      ar: 'عجلة تغوص في الرمال. أيّها أضيق من اللازم؟ قارن المحاور الأربعة.',
    },
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
    explication: {
      fr: 'Le catamaran possède deux coques écartées. Elles rendent le bateau plus stable et l\'aident à ne pas basculer facilement.',
      en: 'The catamaran has two spread-apart hulls. They make the boat more stable and help prevent it from capsizing easily.',
      ar: 'القارب ذو البدنين يمتلك بدنين متباعدين. يجعلان القارب أكثر ثباتاً ويمنعانه من الانقلاب بسهولة.',
    },
    defiTransfert: {
      fr: 'Le catamaran penche d\'un côté. Observe les deux coques : sont-elles bien fixées et placées à la même hauteur ?',
      en: 'The catamaran is leaning to one side. Look at both hulls: are they properly attached and at the same height?',
      ar: 'القارب يميل لجانب. راقب البدنين: هل هما مثبتان جيداً وعلى نفس الارتفاع؟',
    },
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
    explication: {
      fr: 'Les grandes ailes aident l\'avion à se soulever grâce à la force de portance. Elles lui permettent de décoller sur une piste courte lorsqu\'elles sont associées à une vitesse et à une propulsion suffisantes.',
      en: 'Large wings help the plane lift off thanks to the force of lift. They allow it to take off on a short runway when combined with sufficient speed and thrust.',
      ar: 'الأجنحة الكبيرة تُساعد الطائرة على الارتفاع بفضل قوة الرفع. تُمكّنها من الإقلاع على مدرج قصير مع سرعة ودفع كافيين.',
    },
    defiTransfert: {
      fr: 'L\'avion ne vole pas correctement. Observe les deux ailes : sont-elles montées dans le même sens ?',
      en: 'The plane isn\'t flying correctly. Look at both wings: are they mounted in the same direction?',
      ar: 'الطائرة لا تطير بشكل صحيح. راقب الجناحين: هل هما مركّبان في نفس الاتجاه؟',
    },
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
    explication: {
      fr: 'Le système 4x4 permet au moteur de faire tourner les quatre roues. Les pneus adaptés aux terrains difficiles aident le véhicule à mieux avancer sur la neige et les pierres.',
      en: 'The 4x4 system lets the engine drive all four wheels. Tires adapted for rough terrain help the vehicle move better on snow and rocks.',
      ar: 'نظام رباعي الدفع يُمكّن المحرك من تحريك العجلات الأربع. الإطارات المصمّمة للتضاريس الصعبة تُساعد المركبة على التقدم أفضل على الثلج والحجارة.',
    },
    defiTransfert: {
      fr: 'L\'ambulance n\'avance plus correctement sur la neige. Observe les roues : une roue motrice est-elle mal fixée ?',
      en: 'The ambulance isn\'t moving properly on the snow. Look at the wheels: is a drive wheel wrongly attached?',
      ar: 'سيارة الإسعاف لم تعد تتقدم جيداً على الثلج. راقب العجلات: هل إحدى العجلات المحرّكة مثبتة بشكل خاطئ؟',
    },
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
    explication: {
      fr: 'La cabine est placée en hauteur pour que le pilote puisse mieux voir devant lui et guider les grands bateaux dans le port.',
      en: 'The cabin is placed high up so the pilot can see further ahead and guide large ships into the port.',
      ar: 'الكابينة موضوعة في الأعلى حتى يرى الربّان أبعد أمامه ويرشد السفن الكبيرة إلى الميناء.',
    },
    defiTransfert: {
      fr: 'Le pilote ne voit pas assez loin. Regarde la cabine : est-elle placée assez haut ?',
      en: 'The pilot can\'t see far enough. Look at the cabin: is it placed high enough?',
      ar: 'الربّان لا يرى بعيداً كفاية. انظر إلى الكابينة: هل هي مرفوعة بما يكفي؟',
    },
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
    explication: {
      fr: 'Le drone possède quatre moteurs. Deux hélices tournent dans un sens et les deux autres dans le sens inverse. Cela aide le drone à rester stable et à contrôler ses mouvements.',
      en: 'The drone has four motors. Two propellers spin one way and the other two spin in the opposite direction. This helps the drone stay stable and control its movements.',
      ar: 'الطائرة المسيّرة لها أربعة محركات. مروحتان تدوران في اتجاه والأخريان في الاتجاه المعاكس. يُساعد ذلك الطائرة على البقاء ثابتة والتحكم في حركاتها.',
    },
    defiTransfert: {
      fr: 'Le drone ne reste pas droit. Compare les quatre hélices : les deux paires tournent-elles dans les bons sens ?',
      en: 'The drone won\'t stay level. Compare the four propellers: are both pairs spinning in the right directions?',
      ar: 'الطائرة المسيّرة لا تبقى مستوية. قارن المراوح الأربع: هل الزوجان يدوران في الاتجاهات الصحيحة؟',
    },
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
    explication: {
      fr: 'La garde au sol est l\'espace entre le dessous du véhicule et le sol. Elle permet au 4x4 de passer au-dessus des pierres sans les toucher.',
      en: 'Ground clearance is the space between the underside of the vehicle and the ground. It allows the 4x4 to pass over rocks without hitting them.',
      ar: 'الارتفاع عن الأرض هو الفراغ بين أسفل المركبة والأرض. يُمكّن السيارة رباعية الدفع من المرور فوق الحجارة دون ملامستها.',
    },
    defiTransfert: {
      fr: 'Le 4x4 touche les pierres avec son dessous. Observe les roues et le châssis : quelle pièce est mal placée et réduit la hauteur du véhicule ?',
      en: 'The 4x4 is hitting rocks with its underside. Look at the wheels and chassis: which part is wrongly placed and reduces the vehicle\'s height?',
      ar: 'السيارة تلمس الحجارة بأسفلها. راقب العجلات والهيكل: أيّ قطعة في غير مكانها وتُقلّل ارتفاع المركبة؟',
    },
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
    explication: {
      fr: 'La position du réservoir change la répartition du poids dans l\'avion. S\'il est trop en avant ou trop en arrière, l\'avion peut devenir difficile à équilibrer.',
      en: 'The position of the tank changes how weight is distributed in the plane. If it\'s too far forward or backward, the plane can become hard to balance.',
      ar: 'موضع الخزان يُغيّر توزيع الوزن في الطائرة. إذا كان بعيداً جداً للأمام أو الخلف، قد يصعب إبقاء الطائرة متوازنة.',
    },
    defiTransfert: {
      fr: 'L\'avion penche trop vers l\'avant. Observe le réservoir : est-il placé trop près du nez de l\'avion ?',
      en: 'The plane is leaning too far forward. Look at the tank: is it placed too close to the nose of the plane?',
      ar: 'الطائرة تميل كثيراً للأمام. راقب الخزان: هل هو قريب جداً من مقدمة الطائرة؟',
    },
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
    explication: {
      fr: 'Les bogies sont les ensembles de roues placés sous les voitures du train. Ils peuvent pivoter pour aider le train à suivre les courbes des rails.',
      en: 'Bogies are the wheel assemblies placed under each train car. They can pivot to help the train follow the curves of the rails.',
      ar: 'عربات القاعدة هي مجموعات العجلات الموضوعة تحت عربات القطار. تستطيع الدوران لمساعدة القطار على اتباع انحناءات السكة.',
    },
    defiTransfert: {
      fr: 'Le train a du mal à suivre les virages. Observe les bogies : lequel ne peut plus pivoter ?',
      en: 'The train has trouble following curves. Look at the bogies: which one can no longer pivot?',
      ar: 'القطار يجد صعوبة في اتباع المنحنيات. راقب عربات القاعدة: أيّها لم يعد قادراً على الدوران؟',
    },
  },
];
