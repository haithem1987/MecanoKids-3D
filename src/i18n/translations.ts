import { localizeBlueprintToEnglish } from '../data/englishBlueprints';
import { DiscoveryFacts, LanguageCode, VehicleBlueprint } from '../types/game';

type WorkshopText = { name: [string, string, string]; hint: [string, string, string] };
type LabText = readonly [string, string, string];
export const MASTER_BUILD_TEXT = {
  tier: ['Maître constructeur', 'Master builder', 'كبير البنّائين'],
  advanced: ['Défis 11–12 ans', 'Challenges for ages 11–12', 'تحديات من 11 إلى 12 سنة'],
  drawbridge: {
    name: ['Pont levant du port', 'Harbor drawbridge', 'جسر الميناء المتحرك'],
    subtitle: ['Assemble les appuis, les deux tabliers mobiles et les feux du port.', 'Build the piers, the two moving bridge leaves and the harbor signals.', 'ركّب الركائز وجزأي الجسر المتحركين وإشارات الميناء.'],
    why: ['Chaque tablier pivote autour de son axe. Le contrepoids réduit l’effort nécessaire pour le lever.', 'Each bridge leaf pivots around its hinge. Its counterweight reduces the effort needed to raise it.', 'يدور كل جزء من الجسر حول محوره. يقلل الثقل الموازن القوة اللازمة لرفعه.'],
    fact: ['On ferme la route avant de lever le pont pour laisser passer les bateaux.', 'Road traffic stops before the bridge rises to let boats through.', 'تتوقف حركة الطريق قبل رفع الجسر للسماح بمرور القوارب.'],
  },
  rover: {
    name: ['Rover d’exploration à six roues', 'Six-wheel exploration rover', 'مركبة استكشاف بست عجلات'],
    subtitle: ['Monte la suspension, l’alimentation et le bras d’échantillonnage.', 'Build the suspension, power system and sampling arm.', 'ركّب نظام التعليق والطاقة وذراع جمع العينات.'],
    why: ['Le bras prélève des échantillons. La caméra aide à choisir où le placer.', 'The arm collects samples. The camera helps choose where to place it.', 'يجمع الذراع العينات وتساعد الكاميرا في اختيار موضعه.'],
    fact: ['Les batteries stockent l’énergie produite par les panneaux solaires.', 'Batteries store energy produced by the solar panels.', 'تخزّن البطاريات الطاقة التي تنتجها الألواح الشمسية.'],
  },
  bridge: {
    name: ['Pont des quatre appuis', 'Four-pier bridge', 'جسر الركائز الأربع'],
    subtitle: ['Construis les appuis, pose les poutres et relie les trois travées.', 'Build the piers, set the girders and join the three spans.', 'ابنِ الركائز وضع العوارض وصِل البحور الثلاثة.'],
    why: ['Les dalles reposent sur les poutres. Les poutres reportent le poids du pont vers les appuis.', 'Deck slabs rest on girders. The girders carry the bridge’s weight to the piers.', 'ترتكز البلاطات على العوارض، وتنقل العوارض وزن الجسر إلى الركائز.'],
    fact: ['Une travée est la portion de pont entre deux appuis.', 'A span is the section of a bridge between two supports.', 'البحر هو جزء الجسر بين ركيزتين.'],
  },
  station: {
    name: ['Station orbitale à quatre ailes', 'Four-wing orbital station', 'محطة مدارية بأربعة أجنحة'],
    subtitle: ['Monte les modules, déploie les ailes solaires et équipe les ports d’amarrage.', 'Assemble the modules, deploy the solar wings and equip the docking ports.', 'ركّب الوحدات وانشر الأجنحة الشمسية وجهّز منافذ الالتحام.'],
    why: ['Les ailes solaires alimentent la station. Les radiateurs évacuent la chaleur de ses équipements.', 'Solar wings power the station. Radiators carry away heat from its equipment.', 'تزود الأجنحة الشمسية المحطة بالطاقة، وتبدد المشعّات حرارة أجهزتها.'],
    fact: ['Un port d’amarrage relie un vaisseau à la station pour permettre le passage de l’équipage.', 'A docking port connects a spacecraft to the station so the crew can move between them.', 'يربط منفذ الالتحام المركبة بالمحطة ليمر الطاقم بينهما.'],
  },
} as const;
export const MASTER_BUILD_PART_TEXT = {
  counterweight: { name: ['Contrepoids du pont', 'Bridge counterweight', 'ثقل موازن للجسر'], hint: ['Aide à équilibrer le tablier autour de son axe.', 'Helps balance the deck around its hinge.', 'يساعد في موازنة سطح الجسر حول محوره.'] },
  barrier: { name: ['Barrière routière', 'Road barrier', 'حاجز الطريق'], hint: ['Ferme l’accès au tablier mobile.', 'Closes the road to the moving deck.', 'تغلق الطريق المؤدي إلى الجزء المتحرك.'] },
  signal: { name: ['Feu du pont', 'Bridge signal', 'إشارة الجسر'], hint: ['Indique si le passage est ouvert.', 'Shows whether the crossing is open.', 'تُبيّن إن كان المعبر مفتوحاً.'] },
  chassis: { name: ['Châssis du rover', 'Rover chassis', 'هيكل المركبة'], hint: ['Porte les trains roulants et les instruments.', 'Carries the running gear and instruments.', 'يحمل مجموعة العجلات والأجهزة.'] },
  axle: { name: ['Essieu', 'Axle', 'محور العجلات'], hint: ['Relie les roues au châssis.', 'Connects the wheels to the chassis.', 'يربط العجلات بالهيكل.'] },
  hub: { name: ['Moyeu', 'Hub', 'صرة العجلة'], hint: ['Centre la roue sur son axe.', 'Centers the wheel on its axle.', 'يثبّت العجلة في مركز محورها.'] },
  wheel: { name: ['Roue', 'Wheel', 'عجلة'], hint: ['Prend appui sur le terrain.', 'Makes contact with the ground.', 'تلامس سطح الأرض.'] },
  cradle: { name: ['Support de batterie', 'Battery cradle', 'حامل البطارية'], hint: ['Maintient le bloc de batteries sur le châssis.', 'Holds the battery pack on the chassis.', 'يثبّت حزمة البطاريات على الهيكل.'] },
  pack: { name: ['Bloc de batteries', 'Battery pack', 'حزمة البطاريات'], hint: ['Stocke l’énergie électrique.', 'Stores electrical energy.', 'يخزّن الطاقة الكهربائية.'] },
  latch: { name: ['Verrou de batterie', 'Battery latch', 'مزلاج البطارية'], hint: ['Empêche la batterie de glisser.', 'Keeps the battery from sliding.', 'يمنع البطارية من الانزلاق.'] },
  camera: { name: ['Caméra', 'Camera', 'كاميرا'], hint: ['Observe le terrain devant le rover.', 'Scans the ground ahead of the rover.', 'تراقب الأرض أمام المركبة.'] },
  light: { name: ['Phare', 'Headlight', 'مصباح أمامي'], hint: ['Éclaire la zone devant la caméra.', 'Lights the area in front of the camera.', 'يضيء المنطقة أمام الكاميرا.'] },
  armMount: { name: ['Support de bras', 'Arm mount', 'حامل الذراع'], hint: ['Fixe le bras au châssis.', 'Attaches the arm to the chassis.', 'يثبّت الذراع بالهيكل.'] },
  armLink: { name: ['Segment de bras', 'Arm link', 'جزء من الذراع'], hint: ['Éloigne l’outil du châssis.', 'Extends the tool away from the chassis.', 'يمد الأداة بعيداً عن الهيكل.'] },
  hinge: { name: ['Axe du coude', 'Elbow pin', 'محور المرفق'], hint: ['Relie les deux segments du bras.', 'Connects the two arm links.', 'يربط جزأي الذراع.'] },
  tool: { name: ['Godet de prélèvement', 'Sampling scoop', 'مغرفة العينات'], hint: ['Recueille les échantillons de sol.', 'Collects soil samples.', 'يجمع عينات التربة.'] },
  footing: { name: ['Semelle', 'Footing', 'قاعدة الأساس'], hint: ['Répartit la charge de la pile sur le sol.', 'Spreads the pier load into the ground.', 'توزّع حمل الركيزة على الأرض.'] },
  column: { name: ['Colonne', 'Column', 'عمود'], hint: ['Soutient le sommet de la pile.', 'Supports the top of the pier.', 'يدعم أعلى الركيزة.'] },
  cap: { name: ['Tête de pile', 'Pier cap', 'رأس الركيزة'], hint: ['Relie les colonnes et reçoit les poutres.', 'Joins the columns and supports the girders.', 'يربط الأعمدة ويحمل العوارض.'] },
  girder: { name: ['Poutre porteuse', 'Girder', 'عارضة حاملة'], hint: ['Franchit la distance entre deux appuis.', 'Crosses the gap between two supports.', 'تمتد بين ركيزتين.'] },
  slab: { name: ['Dalle du tablier', 'Deck slab', 'بلاطة سطح الجسر'], hint: ['Repose sur deux poutres et forme la chaussée.', 'Rests on two girders and forms the roadway.', 'تستند إلى عارضتين وتشكّل سطح الطريق.'] },
  rail: { name: ['Garde-corps', 'Guardrail', 'حاجز جانبي'], hint: ['Protège le bord du tablier.', 'Protects the edge of the deck.', 'يحمي حافة سطح الجسر.'] },
  approach: { name: ['Rampe d’accès', 'Approach ramp', 'منحدر الوصول'], hint: ['Prolonge la chaussée à l’extrémité du pont.', 'Extends the roadway at the end of the bridge.', 'يمدّ الطريق عند طرف الجسر.'] },
  core: { name: ['Nœud central', 'Central hub', 'الوحدة المركزية'], hint: ['Relie les modules et les ailes de la station.', 'Connects the station modules and wings.', 'تربط وحدات المحطة وأجنحتها.'] },
  collar: { name: ['Bague de jonction', 'Connector ring', 'حلقة الوصل'], hint: ['Relie un module au nœud central.', 'Connects a module to the central hub.', 'تربط وحدة بالجزء المركزي.'] },
  module: { name: ['Module pressurisé', 'Pressurized module', 'وحدة مضغوطة'], hint: ['Abrite l’équipage ou ses instruments.', 'Houses the crew or their instruments.', 'تؤوي الطاقم أو أجهزته.'] },
  port: { name: ['Port d’amarrage', 'Docking port', 'منفذ الالتحام'], hint: ['Accueille une autre capsule.', 'Receives a visiting capsule.', 'يستقبل كبسولة زائرة.'] },
  mount: { name: ['Fixation d’aile', 'Wing mount', 'قاعدة تثبيت الجناح'], hint: ['Ancre une aile solaire à la station.', 'Anchors a solar wing to the station.', 'تثبت جناحاً شمسياً بالمحطة.'] },
  boom: { name: ['Longeron solaire', 'Solar boom', 'عارضة شمسية'], hint: ['Porte un panneau solaire à distance du module.', 'Carries a solar panel away from the module.', 'تحمل لوحاً شمسياً بعيداً عن الوحدة.'] },
  panel: { name: ['Panneau solaire', 'Solar panel', 'لوح شمسي'], hint: ['Transforme la lumière du Soleil en électricité.', 'Turns sunlight into electricity.', 'يحوّل ضوء الشمس إلى كهرباء.'] },
  radiator: { name: ['Radiateur', 'Radiator', 'مشعّ حراري'], hint: ['Rejette la chaleur des équipements.', 'Releases heat from the equipment.', 'يبدد حرارة الأجهزة.'] },
  antenna: { name: ['Antenne', 'Antenna', 'هوائي'], hint: ['Permet de communiquer avec la Terre.', 'Lets the station communicate with Earth.', 'يتيح للمحطة التواصل مع الأرض.'] },
  mast: { name: ['Mât radio', 'Radio mast', 'سارية الاتصال'], hint: ['Place l’antenne au-dessus du module.', 'Holds the antenna above the module.', 'تحمل الهوائي فوق الوحدة.'] },
} as const satisfies Record<string, { name: LabText; hint: LabText }>;

export const DRAWBRIDGE_TEXT = {
  trial: ['Essai du pont', 'Bridge test', 'اختبار الجسر'],
  raise: ['Lever le pont', 'Raise the bridge', 'ارفع الجسر'],
  lower: ['Abaisser le pont', 'Lower the bridge', 'اخفض الجسر'],
  sail: ['Faire passer le bateau', 'Send the boat through', 'مرّر القارب'],
  closed: ['Route ouverte. Lève le pont pour dégager le chenal.', 'Road open. Raise the bridge to clear the channel.', 'الطريق مفتوح. ارفع الجسر لإخلاء الممر المائي.'],
  opening: ['Les tabliers se lèvent.', 'The bridge leaves are rising.', 'يرتفع جزآ الجسر.'],
  open: ['Chenal ouvert. Le bateau peut passer.', 'Channel open. The boat can pass.', 'الممر المائي مفتوح. يمكن للقارب العبور.'],
  closing: ['Les tabliers s’abaissent.', 'The bridge leaves are lowering.', 'ينخفض جزآ الجسر.'],
  crossing: ['Le bateau passe entre les appuis.', 'The boat is passing between the piers.', 'يعبر القارب بين الركائز.'],
  passed: ['Bateau passé ! Tu peux rouvrir la route.', 'Boat through! You can reopen the road.', 'عبر القارب! يمكنك إعادة فتح الطريق.'],
} as const satisfies Record<string, LabText>;
export const CATALOG_BROWSE_TEXT = {
  choose: ['Choisis ton univers', 'Choose your world', 'اختر عالمك'],
  worlds: ['Tous les univers', 'All worlds', 'كل العوالم'],
  tools: ['Filtres et options', 'Filters and options', 'عوامل التصفية والخيارات'],
  search: ['Chercher un atelier', 'Find a workshop', 'ابحث عن ورشة'],
  resetScience: ['Revoir le montage', 'View the build', 'عرض التركيب'],
  scienceTouch: ['Touche les pièces sur l’établi pour faire ton essai.', 'Tap the parts on the workbench to run your test.', 'المس القطع على طاولة العمل لإجراء تجربتك.'],
  scienceControls: ['Commandes accessibles', 'Accessible controls', 'أدوات تحكم ميسّرة'],
} as const satisfies Record<string, LabText>;
export const DIAGNOSTIC_NARRATION = {
  extracted: ['La pièce est retirée. Replace-la sur son empreinte.', 'The part is removed. Put it back on its outline.', 'أُزيلت القطعة. أعدها إلى شكلها المحدد.'],
  locate: ['Touche la pièce signalée dans la scène 3D pour la retirer.', 'Tap the highlighted part in the 3D scene to remove it.', 'المس القطعة المحددة في المشهد الثلاثي الأبعاد لإزالتها.'],
} as const satisfies Record<string, LabText>;
type VirtualLabText = {
  age: string;
  name: LabText;
  goal: LabText;
  controls: readonly (readonly [LabText, ...LabText[]])[];
  outcomes: readonly LabText[];
  why: LabText;
};
export const VIRTUAL_LAB_UI = {
  title: ['Laboratoires virtuels', 'Virtual labs', 'مختبرات افتراضية'],
  physics: ['Physique', 'Physics', 'الفيزياء'],
  chemistry: ['Chimie', 'Chemistry', 'الكيمياء'],
  electronics: ['Électronique et logique', 'Electronics and logic', 'الإلكترونيات والمنطق'],
  nature: ['Vivant et Terre', 'Life and Earth', 'الأحياء والأرض'],
  years: ['ans', 'years', 'سنوات'],
  run: ['Lancer l’essai', 'Run the test', 'ابدأ التجربة'],
  reset: ['Recommencer', 'Reset', 'ابدأ من جديد'],
  goalReached: ['Mission réussie !', 'Mission complete!', 'نجحت المهمة!'],
  nextStep: ['Essaie un autre geste à cette étape.', 'Try a different action at this step.', 'جرّب خطوة مختلفة في هذه المرحلة.'],
  preview: ['Modèle 3D simplifié', 'Simplified 3D model', 'نموذج مبسّط ثلاثي الأبعاد'],
  fallback: ['L’aperçu 3D est indisponible. Tu peux continuer l’expérience.', 'The 3D preview is unavailable. You can keep playing.', 'المعاينة ثلاثية الأبعاد غير متاحة. يمكنك متابعة التجربة.'],
  assemble: ['Assemble le montage sur l’établi pour lancer l’expérience.', 'Build the setup on the workbench to start the experiment.', 'ركّب الجهاز على طاولة العمل لبدء التجربة.'],
  mission: ['Mission scientifique', 'Science mission', 'مهمة علمية'],
  place: ['Place cette pièce sur son empreinte.', 'Place this part on its outline.', 'ضع هذه القطعة على شكلها المحدد.'],
} as const satisfies Record<string, LabText>;

export const VIRTUAL_LAB_PARTS = {
  base: ['Socle', 'Base', 'قاعدة'],
  support: ['Support', 'Support', 'حامل'],
  bob: ['Bille suspendue', 'Hanging ball', 'كرة معلّقة'],
  target: ['Cible', 'Target', 'هدف'],
  fan: ['Ventilateur', 'Fan', 'مروحة'],
  duct: ['Conduit', 'Duct', 'مجرى'],
  tube: ['Tube', 'Tube', 'أنبوب'],
  body: ['Corps de fusée', 'Rocket body', 'جسم الصاروخ'],
  nose: ['Nez de fusée', 'Nose cone', 'مقدمة الصاروخ'],
  fin: ['Aileron', 'Fin', 'زعنفة'],
  block: ['Bloc', 'Block', 'كتلة'],
  weight: ['Poids', 'Weight', 'ثقل'],
  beaker: ['Bécher', 'Beaker', 'كأس مخبرية'],
  ice: ['Glaçon', 'Ice cube', 'مكعب ثلج'],
  fruit: ['Fraise', 'Strawberry', 'فراولة'],
  filter: ['Filtre', 'Filter', 'مرشح'],
  pipette: ['Pipette', 'Pipette', 'ماصة'],
  polymer: ['Polymère', 'Polymer', 'بوليمر'],
  sample: ['Échantillon', 'Sample', 'عينة'],
  battery: ['Pile', 'Battery', 'بطارية'],
  led: ['LED', 'LED', 'مصباح LED'],
  bridge: ['Pont', 'Bridge', 'جسر'],
  track: ['Piste de graphite', 'Graphite track', 'مسار غرافيت'],
  gate: ['Porte logique', 'Logic gate', 'بوابة منطقية'],
  switch: ['Interrupteur', 'Switch', 'مفتاح'],
  stem: ['Tige', 'Stem', 'ساق'],
  flower: ['Fleur', 'Flower', 'زهرة'],
  hill: ['Pente', 'Slope', 'منحدر'],
  house: ['Maison', 'House', 'منزل'],
  barrier: ['Digue', 'Barrier', 'حاجز'],
} as const satisfies Record<string, LabText>;

export const VIRTUAL_LAB_TEXT = {
  newton: {
    age: '8–12', name: ['Pendule de Newton', 'Newton’s cradle', 'بندول نيوتن'],
    goal: ['Lâche une bille et fais toucher la cible par la bille à l’autre bout.', 'Release a ball and make the ball at the other end touch the target.', 'أطلق كرة لتلمس الكرة في الطرف الآخر الهدف.'],
    controls: [[['Angle de lâcher', 'Release angle', 'زاوية الإطلاق'], ['Au repos', 'At rest', 'سكون'], ['Petit', 'Small', 'صغيرة'], ['Grand', 'Large', 'كبيرة']]],
    outcomes: [['Les billes restent immobiles.', 'The balls stay still.', 'تبقى الكرات ساكنة.'], ['La dernière bille monte un peu.', 'The last ball swings up a little.', 'ترتفع الكرة الأخيرة قليلاً.'], ['La dernière bille atteint la cible.', 'The last ball reaches the target.', 'تصل الكرة الأخيرة إلى الهدف.']],
    why: ['Lors du choc, le mouvement se transmet à travers les billes. Une partie de l’énergie se dissipe en son et en chaleur.', 'The collision transfers motion through the balls. Some energy is lost to sound and heat.', 'ينتقل أثر التصادم عبر الكرات. ويتبدد بعض الطاقة على شكل صوت وحرارة.'],
  },
  venturi: {
    age: '7–10', name: ['Courant d’air et effet Venturi', 'Airflow and the Venturi effect', 'تدفق الهواء وتأثير فنتوري'],
    goal: ['Fais monter la bille dans le conduit, puis compare un verre retourné avec et sans carte.', 'Lift the ball through the duct, then compare an upside-down glass with and without a card.', 'ارفع الكرة عبر المجرى، ثم قارن كأساً مقلوباً مع بطاقة وبدونها.'],
    controls: [[['Ventilateur', 'Fan', 'المروحة'], ['Arrêt', 'Off', 'متوقفة'], ['Doux', 'Low', 'ضعيفة'], ['Fort', 'High', 'قوية']], [['Conduit', 'Duct', 'المجرى'], ['Large', 'Wide', 'واسع'], ['Resserré', 'Narrow', 'ضيق']], [['Expérience', 'Experiment', 'التجربة'], ['Tube Venturi', 'Venturi tube', 'أنبوب فنتوري'], ['Verre retourné', 'Upside-down glass', 'كأس مقلوب']], [['Ouverture du verre', 'Glass opening', 'فتحة الكأس'], ['Sans carte', 'Without card', 'بدون بطاقة'], ['Avec carte', 'With card', 'مع بطاقة']]],
    outcomes: [['L’air ne circule pas.', 'No air is moving.', 'لا يتحرك الهواء.'], ['La bille ne monte pas jusqu’au conduit.', 'The ball does not reach the duct.', 'لا تصل الكرة إلى المجرى.'], ['La bille remonte dans le tube.', 'The ball rises through the tube.', 'ترتفع الكرة عبر الأنبوب.'], ['Sans carte, l’eau s’écoule.', 'Without a card, the water spills.', 'يسيل الماء دون بطاقة.'], ['La pression de l’air extérieur aide à maintenir la carte contre le verre.', 'Outside air pressure helps hold the card against the glass.', 'يساعد ضغط الهواء الخارجي على تثبيت البطاقة على الكأس.']],
    why: ['Dans ce modèle, l’air accélère dans le rétrécissement et sa pression baisse. La différence de pression pousse la bille vers le haut.', 'In this model, air speeds up in the constriction and its pressure drops. The pressure difference pushes the ball up.', 'في هذا النموذج يتسارع الهواء عند التضيق وينخفض ضغطه. يدفع فرق الضغط الكرة إلى أعلى.'],
  },
  rocket: {
    age: '9–12', name: ['Fusée à eau', 'Water rocket', 'صاروخ الماء'],
    goal: ['Choisis l’eau et les ailerons pour atteindre une cible en altitude.', 'Choose water and fins to reach a target altitude.', 'اختر كمية الماء والزعانف لبلوغ الارتفاع المطلوب.'],
    controls: [[['Eau', 'Water', 'الماء'], ['Aucune', 'None', 'بلا ماء'], ['Dose moyenne', 'Medium fill', 'كمية متوسطة'], ['Presque plein', 'Nearly full', 'شبه ممتلئ']], [['Ailerons', 'Fins', 'الزعانف'], ['Aucun', 'None', 'بلا زعانف'], ['Trois répartis', 'Three evenly spaced', 'ثلاث موزعة بالتساوي'], ['Deux du même côté', 'Two on one side', 'اثنتان على جهة واحدة']]],
    outcomes: [['Le souffle seul ne suffit pas ici.', 'The burst of air falls short here.', 'دفعة الهواء وحدها لا تكفي هنا.'], ['La trajectoire dévie.', 'The rocket veers off course.', 'ينحرف الصاروخ عن مساره.'], ['Le vol est stable mais reste trop bas.', 'The flight is stable but falls short.', 'الطيران مستقر لكنه لا يبلغ الهدف.'], ['La fusée atteint la cible.', 'The rocket reaches the target.', 'يبلغ الصاروخ الهدف.']],
    why: ['L’air comprimé expulse l’eau et propulse la fusée. Des ailerons bien répartis aident à stabiliser le vol.', 'Compressed air expels water and propels the rocket. Evenly spaced fins help stabilize the flight.', 'يطرد الهواء المضغوط الماء ويدفع الصاروخ. وتساعد الزعانف الموزعة بالتساوي على استقرار الطيران.'],
  },
  balance: {
    age: '6–9', name: ['Tour et centre de gravité', 'Tower and center of gravity', 'البرج ومركز الثقل'],
    goal: ['Répartis les blocs pour que la tour résiste à la secousse du simulateur.', 'Arrange the blocks so the tower survives the simulated shake.', 'رتب الكتل ليصمد البرج أمام الاهتزاز المحاكى.'],
    controls: [[['Position du poids', 'Weight position', 'موضع الثقل'], ['En bas, au centre', 'Low and centered', 'أسفل وفي الوسط'], ['En haut, au centre', 'High and centered', 'أعلى وفي الوسط'], ['Sur le bord', 'On the edge', 'على الحافة']], [['Base', 'Base', 'القاعدة'], ['Large', 'Wide', 'عريضة'], ['Étroite', 'Narrow', 'ضيقة']]],
    outcomes: [['La tour bascule vers le poids.', 'The tower tips toward the weight.', 'يميل البرج نحو الثقل.'], ['La tour oscille et tombe.', 'The tower wobbles and falls.', 'يهتز البرج ويسقط.'], ['La tour reste debout.', 'The tower stays upright.', 'يبقى البرج قائماً.']],
    why: ['Par inertie, le haut de la tour tend à rester en place quand le sol se déplace. Une base large et un centre de gravité bas limitent le basculement.', 'Inertia makes the top tend to stay in place when the ground shifts. A wide base and a low center of gravity help prevent tipping.', 'بسبب القصور الذاتي يميل أعلى البرج إلى البقاء في مكانه عند تحرك الأرض. تقلل القاعدة العريضة ومركز الثقل المنخفض من الانقلاب.'],
  },
  phase: {
    age: '5–8', name: ['Glace, eau et vapeur', 'Ice, water and vapor', 'الجليد والماء وبخار الماء'],
    goal: ['Transforme la glace en eau liquide pour remplir le réservoir.', 'Turn ice into liquid water to fill the tank.', 'حوّل الجليد إلى ماء سائل لملء الخزان.'],
    controls: [[['Température du modèle', 'Model temperature', 'حرارة النموذج'], ['−10 °C', '−10 °C', '−10 °C'], ['20 °C', '20 °C', '20 °C'], ['110 °C', '110 °C', '110 °C']]],
    outcomes: [['La glace reste solide.', 'The ice stays solid.', 'يبقى الجليد صلباً.'], ['La glace fond : le réservoir reçoit de l’eau liquide.', 'The ice melts and liquid water fills the tank.', 'ينصهر الجليد ويملأ الماء السائل الخزان.'], ['Après chauffage, le modèle montre de la vapeur d’eau.', 'After heating, the model shows water vapor.', 'بعد التسخين يعرض النموذج بخار الماء.']],
    why: ['À pression atmosphérique normale, l’eau pure fond à 0 °C et bout à 100 °C. Les points représentent la vapeur, qui est invisible.', 'At standard atmospheric pressure, pure water melts at 0 °C and boils at 100 °C. The dots represent invisible water vapor.', 'عند الضغط الجوي العادي ينصهر الماء النقي عند 0 درجة مئوية ويغلي عند 100. تمثل النقاط بخار الماء غير المرئي.'],
  },
  dna: {
    age: '10–12', name: ['ADN de fraise', 'Strawberry DNA', 'الحمض النووي للفراولة'],
    goal: ['Choisis les gestes du labo virtuel dans le bon ordre pour rendre l’ADN visible.', 'Choose the virtual lab actions in order to make DNA visible.', 'اختر خطوات المختبر الافتراضي بالترتيب لإظهار الحمض النووي.'],
    controls: [[['Geste virtuel', 'Virtual action', 'الخطوة الافتراضية'], ['Écraser le fruit', 'Mash the fruit', 'اهرُس الثمرة'], ['Ajouter la solution d’extraction', 'Add extraction solution', 'أضف محلول الاستخلاص'], ['Filtrer', 'Filter', 'رشّح'], ['Ajouter l’alcool froid virtuel', 'Add virtual cold alcohol', 'أضف الكحول البارد الافتراضي']]],
    outcomes: [['La fraise est entière.', 'The strawberry is whole.', 'الثمرة كاملة.'], ['Le fruit est réduit en pulpe.', 'The fruit is now pulp.', 'تحولت الثمرة إلى لب.'], ['La solution libère le contenu des cellules.', 'The solution releases the contents of the cells.', 'يحرر المحلول محتويات الخلايا.'], ['Le filtre retient les gros morceaux.', 'The filter catches large pieces.', 'يحتجز المرشح القطع الكبيرة.'], ['Des filaments blanchâtres apparaissent.', 'Whitish strands appear.', 'تظهر خيوط مائلة إلى البياض.']],
    why: ['L’ADN libéré des cellules se regroupe en filaments visibles dans l’alcool froid.', 'DNA released from the cells clumps into visible strands in cold alcohol.', 'يتجمع الحمض النووي المحرر من الخلايا في خيوط مرئية في الكحول البارد.'],
  },
  slime: {
    age: '6–10', name: ['Slime et polymères', 'Slime and polymers', 'السلايم والبوليمرات'],
    goal: ['Règle la quantité de liaisons pour obtenir un matériau qui s’étire sans couler.', 'Adjust the number of links to make a material that stretches without flowing away.', 'اضبط عدد الروابط لتحصل على مادة تتمدد دون أن تسيل.'],
    controls: [[['Liaisons entre les chaînes', 'Links between chains', 'الروابط بين السلاسل'], ['Peu', 'Few', 'قليلة'], ['Intermédiaires', 'Medium', 'متوسطة'], ['Beaucoup', 'Many', 'كثيرة']]],
    outcomes: [['Le matériau s’étale.', 'The material spreads out.', 'تنتشر المادة.'], ['Le matériau s’étire et reste d’un seul morceau.', 'The material stretches and stays in one piece.', 'تتمدد المادة وتبقى قطعة واحدة.'], ['Le matériau résiste davantage à l’étirement.', 'The material resists stretching more.', 'تقاوم المادة التمدد أكثر.']],
    why: ['Dans ce modèle, des liaisons relient les longues chaînes du polymère et modifient leur mobilité.', 'In this model, links connect long polymer chains and change how freely they move.', 'في هذا النموذج تصل الروابط بين سلاسل البوليمر الطويلة وتغيّر سهولة حركتها.'],
  },
  ph: {
    age: '8–12', name: ['Enquête au chou rouge', 'Red cabbage investigation', 'تحقيق الملفوف الأحمر'],
    goal: ['Teste les trois échantillons puis repère celui qui est basique et classe-le correctement.', 'Test the three samples, then identify and classify the basic one.', 'اختبر العينات الثلاث ثم حدد العينة القاعدية وصنّفها بشكل صحيح.'],
    controls: [[['Échantillon', 'Sample', 'العينة'], ['A', 'A', 'A'], ['B', 'B', 'B'], ['C', 'C', 'C']], [['Classement', 'Classification', 'التصنيف'], ['Acide', 'Acidic', 'حمضية'], ['Neutre', 'Neutral', 'متعادلة'], ['Basique', 'Basic', 'قاعدية']]],
    outcomes: [['L’indicateur devient rose : échantillon acide.', 'The indicator turns pink: acidic sample.', 'يتحول الكاشف إلى الوردي: عينة حمضية.'], ['L’indicateur reste violet : échantillon neutre.', 'The indicator stays purple: neutral sample.', 'يبقى الكاشف بنفسجياً: عينة متعادلة.'], ['L’indicateur devient vert dans ce modèle : échantillon basique.', 'The indicator turns green in this model: basic sample.', 'يتحول الكاشف إلى الأخضر في هذا النموذج: عينة قاعدية.'], ['Le vert révèle le caractère basique de C.', 'Green reveals that C is basic.', 'يكشف اللون الأخضر أن العينة C قاعدية.']],
    why: ['Le pigment du chou rouge change de couleur selon l’acidité du liquide. L’indicateur donne un indice, pas une mesure précise du pH.', 'Red cabbage pigment changes color with the acidity of the liquid. It gives a clue rather than a precise pH reading.', 'تتغير صبغة الملفوف الأحمر بحسب حموضة السائل. يعطي الكاشف دليلاً تقريبياً على الأس الهيدروجيني.'],
  },
  conductivity: {
    age: '5–8', name: ['Le pont conducteur', 'The conducting bridge', 'الجسر الموصل'],
    goal: ['Choisis un matériau pour fermer le circuit et allumer la LED.', 'Choose a material to complete the circuit and light the LED.', 'اختر مادة لإغلاق الدائرة وإضاءة المصباح.'],
    controls: [[['Matériau', 'Material', 'المادة'], ['Bois sec', 'Dry wood', 'خشب جاف'], ['Plastique', 'Plastic', 'بلاستيك'], ['Métal', 'Metal', 'معدن'], ['Caoutchouc', 'Rubber', 'مطاط']]],
    outcomes: [['La LED reste éteinte.', 'The LED stays off.', 'يبقى المصباح مطفأً.'], ['La LED s’allume : le pont conduit.', 'The LED lights up: the bridge conducts.', 'يضيء المصباح: الجسر موصل.']],
    why: ['Le métal laisse passer le courant dans ce circuit à pile. Le plastique, le bois sec et le caoutchouc sont ici isolants.', 'Metal lets current flow in this battery circuit. Plastic, dry wood and rubber act as insulators here.', 'يسمح المعدن بمرور التيار في هذه الدائرة. ويعمل البلاستيك والخشب الجاف والمطاط عوازل هنا.'],
  },
  resistance: {
    age: '9–12', name: ['Graphite et résistance', 'Graphite and resistance', 'الغرافيت والمقاومة'],
    goal: ['Ajuste la piste de graphite pour éclairer la console sans dépasser la limite du modèle.', 'Adjust the graphite track to light the console without exceeding the model’s limit.', 'اضبط مسار الغرافيت لإضاءة لوحة التحكم دون تجاوز حد النموذج.'],
    controls: [[['Longueur de la piste', 'Track length', 'طول المسار'], ['Courte', 'Short', 'قصير'], ['Moyenne', 'Medium', 'متوسط'], ['Longue', 'Long', 'طويل']]],
    outcomes: [['Le courant est trop élevé pour la console.', 'The current is too high for the console.', 'التيار أعلى من حد لوحة التحكم.'], ['La console s’allume à la bonne intensité.', 'The console lights at the right level.', 'تضيء لوحة التحكم بالشدة المناسبة.'], ['La lumière est faible.', 'The light is dim.', 'الإضاءة ضعيفة.']],
    why: ['À largeur égale, une piste de graphite plus longue résiste davantage au courant.', 'At the same width, a longer graphite track offers more resistance to current.', 'عند ثبات العرض تزداد مقاومة مسار الغرافيت للتيار كلما زاد طوله.'],
  },
  logic: {
    age: '11–12', name: ['Portes logiques', 'Logic gates', 'البوابات المنطقية'],
    goal: ['Teste ET, OU et NON. Pour ouvrir le coffre, choisis la porte qui inverse le signal A et laisse A éteint.', 'Test AND, OR and NOT. To open the vault, choose the gate that inverts A and leave A off.', 'اختبر «و» و«أو» و«ليس». لفتح الخزانة اختر البوابة التي تعكس الإشارة A واتركها مطفأة.'],
    controls: [[['Porte', 'Gate', 'البوابة'], ['ET', 'AND', 'و'], ['OU', 'OR', 'أو'], ['NON', 'NOT', 'ليس']], [['Signal A', 'Signal A', 'الإشارة A'], ['0', '0', '0'], ['1', '1', '1']], [['Signal B', 'Signal B', 'الإشارة B'], ['0', '0', '0'], ['1', '1', '1']]],
    outcomes: [['La sortie vaut 0.', 'Output is 0.', 'الخرج يساوي 0.'], ['La sortie vaut 1 : essaie maintenant d’inverser A.', 'Output is 1: now try inverting A.', 'الخرج يساوي 1: جرّب الآن عكس A.'], ['La sortie vaut 1.', 'Output is 1.', 'الخرج يساوي 1.'], ['NON inverse A : sortie 1, coffre ouvert.', 'NOT inverts A: output 1, vault open.', 'تعكس «ليس» الإشارة A: الخرج 1 والخزانة مفتوحة.']],
    why: ['ET demande deux 1 ; OU en demande au moins un. NON ignore B et inverse A.', 'AND needs two 1s; OR needs at least one. NOT ignores B and inverts A.', 'تحتاج «و» إلى قيمتين 1، وتحتاج «أو» إلى واحدة على الأقل. تتجاهل «ليس» الإشارة B وتعكس A.'],
  },
  capillary: {
    age: '5–8', name: ['La fleur qui change de couleur', 'The color-changing flower', 'الزهرة التي يتغير لونها'],
    goal: ['Relie la tige à l’eau colorée et laisse le temps à l’eau d’atteindre les pétales.', 'Connect the stem to colored water and give it time to reach the petals.', 'صِل الساق بالماء الملون واترك للماء وقتاً حتى يبلغ البتلات.'],
    controls: [[['Tige', 'Stem', 'الساق'], ['Coupée au-dessus de l’eau', 'Disconnected from water', 'منفصلة عن الماء'], ['Reliée à l’eau', 'Connected to water', 'متصلة بالماء']], [['Temps', 'Time', 'الوقت'], ['Un instant', 'A moment', 'لحظة'], ['Plusieurs heures virtuelles', 'Several virtual hours', 'عدة ساعات افتراضية']]],
    outcomes: [['L’eau ne rejoint pas la tige.', 'Water does not reach the stem.', 'لا يصل الماء إلى الساق.'], ['L’eau colorée commence à monter.', 'Colored water starts to rise.', 'يبدأ الماء الملون في الصعود.'], ['Les pétales prennent la couleur de l’eau.', 'The petals take on the water’s color.', 'تكتسب البتلات لون الماء.']],
    why: ['L’eau circule dans de fins vaisseaux. La capillarité et la transpiration de la plante contribuent à sa montée.', 'Water travels through tiny vessels. Capillary action and plant transpiration help it rise.', 'يمر الماء عبر أوعية دقيقة، وتساعد الخاصية الشعرية ونتح النبات على صعوده.'],
  },
  erosion: {
    age: '7–11', name: ['Pluie, érosion et village', 'Rain, erosion and the village', 'المطر والتعرية والقرية'],
    goal: ['Fais tomber la pluie et protège le village du ruissellement chargé de sédiments.', 'Make it rain and protect the village from sediment-laden runoff.', 'أنزل المطر واحمِ القرية من الجريان المحمل بالرواسب.'],
    controls: [[['Terrain', 'Terrain', 'التضاريس'], ['Pente nue', 'Bare slope', 'منحدر مكشوف'], ['Pente très raide', 'Very steep slope', 'منحدر شديد'], ['Pente avec végétation', 'Vegetated slope', 'منحدر مغطى بالنباتات']], [['Protection', 'Protection', 'الحماية'], ['Aucune digue', 'No barrier', 'بلا حاجز'], ['Digue de dérivation', 'Diversion barrier', 'حاجز لتحويل المجرى']]],
    outcomes: [['La pluie entraîne de la terre jusqu’au village.', 'Rain carries soil to the village.', 'يحمل المطر التربة إلى القرية.'], ['Une partie du ruissellement atteint encore le village.', 'Some runoff still reaches the village.', 'لا يزال بعض الجريان يصل إلى القرية.'], ['Le village est protégé : l’eau contourne les maisons.', 'The village is protected: water flows around the houses.', 'القرية محمية: يمر الماء حول المنازل.']],
    why: ['La pluie et le ruissellement font partie du cycle de l’eau. En s’écoulant, l’eau transporte du sol. La végétation en retient une partie et la digue dévie l’eau.', 'Rain and runoff are part of the water cycle. Flowing water carries soil. Plants hold some in place, and the barrier redirects the water.', 'المطر والجريان جزء من دورة الماء. يحمل الماء الجاري التربة. تثبت النباتات بعضها ويحوّل الحاجز مجرى الماء.'],
  },
} as const satisfies Record<import('../data/virtualLabs').VirtualLabId, VirtualLabText>;
export const LOCAL_ADMIN_LABEL: Record<LanguageCode, string> = {
  fr: 'Mode admin local · Tous les ateliers sont accessibles',
  en: 'Local admin mode · All workshops are available',
  ar: 'وضع الإدارة المحلي · جميع الورش متاحة',
};
export const SCIENCE_CHALLENGE_TEXT = {
  title: ['Mini-laboratoire', 'Mini lab', 'مختبر صغير'],
  predict: ['Avant de manipuler, veux-tu faire une prédiction ?', 'Want to make a prediction before you try?', 'هل تريد أن تتوقّع النتيجة قبل التجربة؟'],
  catalogue: ['Défis scientifiques', 'Science challenges', 'تحديات علمية'],
  listen: ['Écouter la consigne', 'Listen to the instructions', 'استمع إلى التعليمات'],
  prediction: ['Ta prédiction', 'Your prediction', 'توقعك'],
  observation: ['Ton observation', 'Your observation', 'ملاحظتك'],
  restart: ['Recommencer le défi', 'Restart challenge', 'أعد التحدي'],
  solved: ['Défi réussi !', 'Challenge complete!', 'أكملت التحدي!'],
  switch: ['Interrupteur', 'Switch', 'مفتاح'],
  closed: ['Fermé', 'Closed', 'مغلق'],
  opened: ['Ouvert', 'Open', 'مفتوح'],
  on: ['LED allumée', 'LED on', 'المصباح مضاء'],
  off: ['LED éteinte', 'LED off', 'المصباح مطفأ'],
  fixedDown: ['La charge fixe descend', 'Fixed load goes down', 'تنخفض الحمولة الثابتة'],
  movingDown: ['La charge mobile descend', 'Moving load goes down', 'تنخفض الحمولة المتحركة'],
  balanced: ['Le levier est équilibré', 'The lever is balanced', 'الرافعة متوازنة'],
  fixed: ['Charge fixe', 'Fixed load', 'الحمولة الثابتة'],
  moving: ['Charge mobile', 'Moving load', 'الحمولة المتحركة'],
  distance: ['Distance au pivot', 'Distance from pivot', 'المسافة من المحور'],
  complete: ['Molécule complète', 'Molecule complete', 'الجزيء مكتمل'],
  incomplete: ['Molécule à compléter', 'Molecule needs a change', 'الجزيء يحتاج إلى تعديل'],
  empty: ['Emplacement vide', 'Empty slot', 'مكان فارغ'],
  hydrogen: ['Hydrogène', 'Hydrogen', 'هيدروجين'],
  oxygen: ['Oxygène', 'Oxygen', 'أكسجين'],
  close: ['Allume la LED', 'Light the LED', 'أضئ المصباح'],
  open: ['Éteins la LED', 'Turn off the LED', 'أطفئ المصباح'],
  series: ['Deux interrupteurs, une boucle', 'Two switches, one loop', 'مفتاحان وحلقة واحدة'],
  equal: ['Équilibre deux charges égales', 'Balance two equal loads', 'وازن حمولتين متساويتين'],
  heavy: ['Équilibre une charge plus lourde', 'Balance a heavier load', 'وازن حمولة أثقل'],
  near: ['Rapproche la charge lourde', 'Move the heavy load closer', 'قرّب الحمولة الثقيلة'],
  water: ['Complète la molécule d’eau', 'Complete the water molecule', 'أكمل جزيء الماء'],
  repairWater: ['Répare la molécule d’eau', 'Repair the water molecule', 'أصلح جزيء الماء'],
  carbon: ['Complète le CO₂', 'Complete the CO₂ molecule', 'أكمل جزيء CO₂'],
  circuitGoalOn: ['Ferme la boucle pour allumer la LED.', 'Close the loop to light the LED.', 'أغلق الحلقة لإضاءة المصباح.'],
  circuitGoalOff: ['Ouvre la boucle pour éteindre la LED.', 'Open the loop to turn off the LED.', 'افتح الحلقة لإطفاء المصباح.'],
  leverGoal: ['Déplace la charge mobile jusqu’à ce que le levier soit horizontal.', 'Move the sliding load until the lever is level.', 'حرّك الحمولة المتحركة حتى تصبح الرافعة أفقية.'],
  moleculeGoal: ['Choisis l’atome qui complète le modèle.', 'Choose the atom that completes the model.', 'اختر الذرة التي تكمل النموذج.'],
  circuitWhy: ['Dans cette boucle, le courant circule seulement si tous les interrupteurs sont fermés.', 'In this loop, current flows only when every switch is closed.', 'في هذه الحلقة يمر التيار عندما تكون جميع المفاتيح مغلقة.'],
  leverWhy: ['Le levier s’équilibre quand la charge multipliée par sa distance au pivot est la même des deux côtés.', 'The lever balances when load times distance from the pivot is equal on both sides.', 'تتوازن الرافعة عندما يتساوى حاصل ضرب الحمولة في بعدها عن المحور على الجانبين.'],
  waterWhy: ['Dans H₂O, un oxygène est relié à deux hydrogènes.', 'In H₂O, one oxygen is bonded to two hydrogens.', 'في H₂O ترتبط ذرة أكسجين بذرتي هيدروجين.'],
  carbonWhy: ['Dans CO₂, un carbone est relié à deux oxygènes par deux liaisons doubles.', 'In CO₂, one carbon is joined to two oxygens by two double bonds.', 'في CO₂ ترتبط ذرة كربون بذرتي أكسجين برابطتين مزدوجتين.'],
} satisfies Record<string, [string, string, string]>;
export const WEBGL_QA_TEXT = {
  endurance: ['Tester 20 minutes', 'Test for 20 minutes', 'اختبار لمدة 20 دقيقة'],
  stop: ['Arrêter le test', 'Stop test', 'إيقاف الاختبار'],
  models: ['Modèles / styles', 'Models / styles', 'النماذج / الأنماط'],
  lose: ['Interrompre le contexte 3D', 'Interrupt 3D context', 'إيقاف سياق العرض الثلاثي'],
  previews: ['Tester 40 aperçus successifs', 'Test 40 consecutive previews', 'اختبار 40 معاينة متتالية'],
  counts: ['Pertes / restaurations', 'Losses / restorations', 'انقطاعات / استعادة'],
} satisfies Record<string, [string, string, string]>;
/** FR / EN / AR teaching content shared by the dedicated experiment blueprints. */
export const EXPERIMENT_PART_TEXT = {
  base: { name: ['Socle', 'Base', 'القاعدة'], hint: ['Stabilise le montage.', 'Keeps the apparatus stable.', 'تثبت التجربة.'] },
  frame: { name: ['Portique et pivot', 'Frame and pivot', 'الإطار والمحور'], hint: ['Porte le pendule au niveau du pivot.', 'Supports the pendulum at its pivot.', 'يحمل البندول عند محوره.'] },
  rod: { name: ['Tige suspendue', 'Suspended rod', 'القضيب المعلق'], hint: ['Relie la masse au pivot.', 'Connects the bob to the pivot.', 'يربط الثقل بالمحور.'] },
  bob: { name: ['Masse du pendule', 'Pendulum bob', 'ثقل البندول'], hint: ['Reste attachée à la tige pendant le mouvement.', 'Stays attached to the rod during motion.', 'يبقى متصلا بالقضيب أثناء الحركة.'] },
  fulcrum: { name: ['Point d’appui', 'Fulcrum', 'نقطة الارتكاز'], hint: ['Le levier repose sur ce pivot.', 'The lever rests on this pivot.', 'ترتكز الرافعة على هذا المحور.'] },
  lever: { name: ['Fléau', 'Balance beam', 'ذراع الميزان'], hint: ['Relie les deux côtés autour du point d’appui.', 'Connects both sides around the fulcrum.', 'يربط الجانبين حول نقطة الارتكاز.'] },
  load: { name: ['Charge', 'Load', 'الحمولة'], hint: ['Pose la charge sur le bras.', 'Place the load on the arm.', 'ضع الحمولة على الذراع.'] },
  counterweight: { name: ['Contrepoids', 'Counterweight', 'الثقل الموازن'], hint: ['Équilibre la charge de l’autre côté.', 'Balances the load on the other side.', 'يوازن الحمولة على الجانب الآخر.'] },
  ramp: { name: ['Rampe inclinée', 'Inclined ramp', 'السطح المائل'], hint: ['Un chemin plus long permet de monter avec moins de force.', 'A longer path lets you lift with less force.', 'يسمح المسار الأطول بالرفع بقوة أقل.'] },
  magnet: { name: ['Aimant', 'Magnet', 'المغناطيس'], hint: ['Possède un pôle nord et un pôle sud.', 'Has a north pole and a south pole.', 'له قطب شمالي وقطب جنوبي.'] },
  compass: { name: ['Aiguille aimantée', 'Magnetic needle', 'الإبرة المغناطيسية'], hint: ['Tourne autour de son pivot pour suivre le champ magnétique.', 'Turns about its pivot to follow the magnetic field.', 'تدور حول محورها لتتبع المجال المغناطيسي.'] },
  prism: { name: ['Prisme', 'Prism', 'المنشور'], hint: ['Sépare les couleurs de la lumière blanche.', 'Separates the colours in white light.', 'يفصل ألوان الضوء الأبيض.'] },
  lamp: { name: ['Source de lumière', 'Light source', 'مصدر الضوء'], hint: ['Dirige la lumière vers le prisme.', 'Directs light towards the prism.', 'يوجه الضوء نحو المنشور.'] },
  beam: { name: ['Rayon lumineux', 'Light ray', 'شعاع الضوء'], hint: ['Montre le trajet de la lumière.', 'Shows the path of light.', 'يبين مسار الضوء.'] },
  board: { name: ['Platine', 'Circuit board', 'لوحة الدائرة'], hint: ['Porte les composants du circuit.', 'Supports the circuit components.', 'تحمل مكونات الدائرة.'] },
  battery: { name: ['Pile', 'Battery', 'البطارية'], hint: ['Fournit l’énergie électrique au circuit.', 'Supplies electrical energy to the circuit.', 'تزود الدائرة بالطاقة الكهربائية.'] },
  resistor: { name: ['Résistance', 'Resistor', 'المقاومة'], hint: ['Limite le courant dans le circuit.', 'Limits the current in the circuit.', 'تحد من التيار في الدائرة.'] },
  led: { name: ['LED', 'Light-emitting diode', 'الصمام المضيء'], hint: ['Transforme une partie de l’énergie électrique en lumière.', 'Converts some electrical energy into light.', 'يحول جزءا من الطاقة الكهربائية إلى ضوء.'] },
  wire: { name: ['Fil de connexion', 'Connecting wire', 'سلك التوصيل'], hint: ['Relie deux bornes pour fermer la boucle.', 'Connects two terminals to close the loop.', 'يربط طرفين لإغلاق الحلقة.'] },
  motor: { name: ['Moteur', 'Motor', 'المحرك'], hint: ['Transforme l’énergie électrique en rotation.', 'Converts electrical energy into rotation.', 'يحول الطاقة الكهربائية إلى دوران.'] },
  fan: { name: ['Hélice du ventilateur', 'Fan blades', 'ريش المروحة'], hint: ['Se fixe sur l’axe du moteur.', 'Attaches to the motor shaft.', 'تثبت على محور المحرك.'] },
  sensor: { name: ['Capteur de lumière', 'Light sensor', 'مستشعر الضوء'], hint: ['Sa résistance change avec la lumière.', 'Its resistance changes with light.', 'تتغير مقاومته مع الضوء.'] },
  buzzer: { name: ['Buzzer', 'Buzzer', 'الطنان'], hint: ['Transforme l’énergie électrique en son.', 'Converts electrical energy into sound.', 'يحول الطاقة الكهربائية إلى صوت.'] },
  solar: { name: ['Panneau photovoltaïque', 'Photovoltaic panel', 'اللوح الكهروضوئي'], hint: ['Transforme la lumière en électricité.', 'Converts light into electricity.', 'يحول الضوء إلى كهرباء.'] },
  capacitor: { name: ['Condensateur', 'Capacitor', 'المكثف'], hint: ['Stocke temporairement de l’énergie électrique.', 'Temporarily stores electrical energy.', 'يخزن الطاقة الكهربائية مؤقتا.'] },
  antenna: { name: ['Antenne', 'Antenna', 'الهوائي'], hint: ['Reçoit les ondes radio.', 'Receives radio waves.', 'يستقبل موجات الراديو.'] },
  detector: { name: ['Module de détection AM', 'AM detector module', 'وحدة كشف AM'], hint: ['Extrait le signal sonore du signal radio.', 'Extracts the audio signal from the radio signal.', 'تستخرج الإشارة الصوتية من إشارة الراديو.'] },
  speaker: { name: ['Écouteur', 'Earpiece', 'سماعة الأذن'], hint: ['Permet d’entendre le signal sonore.', 'Lets you hear the audio signal.', 'تتيح سماع الإشارة الصوتية.'] },
  oxygen: { name: ['Atome d’oxygène O', 'Oxygen atom O', 'ذرة الأكسجين O'], hint: ['Forme deux liaisons covalentes dans ce modèle.', 'Forms two covalent bonds in this model.', 'تشكل رابطتين تساهميتين في هذا النموذج.'] },
  hydrogen: { name: ['Atome d’hydrogène H', 'Hydrogen atom H', 'ذرة الهيدروجين H'], hint: ['Forme une liaison covalente.', 'Forms one covalent bond.', 'تشكل رابطة تساهمية واحدة.'] },
  carbon: { name: ['Atome de carbone C', 'Carbon atom C', 'ذرة الكربون C'], hint: ['Partage quatre paires d’électrons dans ce modèle.', 'Shares four electron pairs in this model.', 'تشارك بأربعة أزواج من الإلكترونات في هذا النموذج.'] },
  single: { name: ['Liaison simple', 'Single bond', 'رابطة أحادية'], hint: ['Relie deux atomes par une paire d’électrons partagée.', 'Joins two atoms through one shared electron pair.', 'تربط ذرتين بزوج مشترك من الإلكترونات.'] },
  double: { name: ['Liaison double', 'Double bond', 'رابطة مزدوجة'], hint: ['Relie deux atomes par deux paires d’électrons partagées.', 'Joins two atoms through two shared electron pairs.', 'تربط ذرتين بزوجين مشتركين من الإلكترونات.'] },
  sodium: { name: ['Ion sodium Na⁺', 'Sodium ion Na⁺', 'أيون الصوديوم Na⁺'], hint: ['Alterner les ions positifs et négatifs forme le cristal.', 'Alternating positive and negative ions forms the crystal.', 'يشكل تعاقب الأيونات الموجبة والسالبة البلورة.'] },
  chloride: { name: ['Ion chlorure Cl⁻', 'Chloride ion Cl⁻', 'أيون الكلوريد Cl⁻'], hint: ['Les ions voisins portent des charges opposées.', 'Neighbouring ions carry opposite charges.', 'تحمل الأيونات المتجاورة شحنات متعاكسة.'] },
  stand: { name: ['Support de laboratoire', 'Laboratory stand', 'حامل المختبر'], hint: ['Maintient le récipient au-dessus du socle.', 'Holds the vessel above the base.', 'يحمل الوعاء فوق القاعدة.'] },
  beaker: { name: ['Bécher gradué', 'Graduated beaker', 'الكأس المدرجة'], hint: ['Récipient ouvert pour observer une expérience.', 'An open vessel for observing an experiment.', 'وعاء مفتوح لمشاهدة التجربة.'] },
  pan: { name: ['Plateau de balance', 'Weighing pan', 'كفة الميزان'], hint: ['Reçoit l’objet à peser ou les masses de référence.', 'Holds the object or the reference masses.', 'تحمل الجسم أو كتل القياس.'] },
} satisfies Record<string, WorkshopText>;

export const EXPERIMENT_MODEL_TEXT: Record<string, { name: [string, string, string]; explanation: [string, string, string] }> = {
  'chem-water-molecule': { name: ['Molécule d’eau', 'Water molecule', 'جزيء الماء'], explanation: ['Relie un oxygène à deux hydrogènes. Les deux liaisons forment un angle de 104,5°.', 'Join one oxygen to two hydrogens. The two bonds form a 104.5° angle.', 'اربط أكسجينا بذرتي هيدروجين. تصنع الرابطتان زاوية 104.5 درجة.'] },
  'chem-co2-molecule': { name: ['Molécule CO₂', 'CO₂ molecule', 'جزيء CO₂'], explanation: ['Le carbone central forme deux liaisons doubles avec deux oxygènes alignés.', 'The central carbon forms two double bonds with two oxygen atoms in a straight line.', 'تشكل ذرة الكربون المركزية رابطتين مزدوجتين مع ذرتي أكسجين على خط مستقيم.'] },
  'chem-salt-crystal': { name: ['Cristal de sel NaCl', 'NaCl salt crystal', 'بلورة ملح NaCl'], explanation: ['Alterner sodium Na⁺ et chlorure Cl⁻ construit un fragment du réseau ionique du sel.', 'Alternate sodium Na⁺ and chloride Cl⁻ to build a fragment of the salt ionic lattice.', 'ناوب بين الصوديوم Na⁺ والكلوريد Cl⁻ لبناء جزء من الشبكة الأيونية للملح.'] },
  'chem-beaker-setup': { name: ['Bécher sur pied', 'Beaker on a stand', 'كأس على حامل'], explanation: ['Pose le support puis le bécher. Le récipient reste maintenu au-dessus du socle.', 'Fit the stand and then the beaker. The vessel stays supported above the base.', 'ثبت الحامل ثم الكأس. يبقى الوعاء محمولا فوق القاعدة.'] },
  'chem-balance-scale': { name: ['Balance de précision', 'Precision balance', 'ميزان دقيق'], explanation: ['Le fléau repose sur un pivot central. Les deux plateaux portent des charges égales à égale distance.', 'The beam rests on a central pivot. Both pans carry equal loads at equal distances.', 'ترتكز العارضة على محور مركزي. تحمل الكفتان كتلتين متساويتين على مسافتين متساويتين.'] },
  'elec-led-circuit': { name: ['Circuit LED', 'LED circuit', 'دائرة LED'], explanation: ['Relie pile, résistance et LED en boucle. La résistance limite le courant.', 'Connect the battery, resistor and LED in a loop. The resistor limits the current.', 'صل البطارية والمقاومة والصمام في حلقة. تحد المقاومة من التيار.'] },
  'elec-motor-fan': { name: ['Ventilateur à moteur', 'Motorised fan', 'مروحة بمحرك'], explanation: ['Ferme la boucle entre la pile et le moteur, puis fixe l’hélice sur son axe.', 'Close the loop between the battery and motor, then fit the fan onto its shaft.', 'أغلق الحلقة بين البطارية والمحرك ثم ثبت المروحة على محوره.'] },
  'elec-alarm-buzzer': { name: ['Alarme à capteur de lumière', 'Light-controlled buzzer', 'طنان يتحكم فيه الضوء'], explanation: ['Relie pile, capteur de lumière et buzzer. La lumière modifie la résistance du capteur et le courant.', 'Connect the battery, light sensor and buzzer. Light changes the sensor resistance and current.', 'صل البطارية ومستشعر الضوء والطنان. يغير الضوء مقاومة المستشعر والتيار.'] },
  'elec-solar-toy': { name: ['Jouet solaire', 'Solar toy', 'لعبة شمسية'], explanation: ['Le panneau fournit l’électricité. Le condensateur stocke de l’énergie et le moteur entraîne l’hélice.', 'The panel supplies electricity. The capacitor stores energy and the motor drives the fan.', 'يوفر اللوح الكهرباء. يخزن المكثف الطاقة ويحرك المحرك المروحة.'] },
  'elec-radio-receiver': { name: ['Récepteur radio AM', 'AM radio receiver', 'مستقبل راديو AM'], explanation: ['L’antenne reçoit le signal. Le module AM contient l’accord et la détection, puis l’écouteur restitue le son. Modèle simplifié, sans réception réelle.', 'The antenna receives the signal. The AM module contains tuning and detection, and the earpiece reproduces sound. Simplified model, without real reception.', 'يستقبل الهوائي الإشارة. تحتوي وحدة AM على التوليف والكشف وتنقل السماعة الصوت. نموذج مبسط دون استقبال حقيقي.'] },
  'phys-pendulum': { name: ['Pendule simple', 'Simple pendulum', 'بندول بسيط'], explanation: ['La tige et la masse restent reliées au pivot pendant l’oscillation.', 'The rod and bob remain attached to the pivot as they swing.', 'يبقى القضيب والثقل متصلين بالمحور أثناء التأرجح.'] },
  'phys-lever-class1': { name: ['Levier du premier ordre', 'First-class lever', 'رافعة من النوع الأول'], explanation: ['Pose le pivot entre la charge et le contrepoids pour équilibrer le levier.', 'Place the pivot between the load and counterweight to balance the lever.', 'ضع المحور بين الحمولة والثقل الموازن لموازنة الرافعة.'] },
  'phys-inclined-plane': { name: ['Plan incliné', 'Inclined plane', 'المستوى المائل'], explanation: ['La rampe permet de monter une charge avec moins de force en parcourant un chemin plus long.', 'The ramp lets you lift a load with less force over a longer distance.', 'يسمح السطح المائل برفع حمولة بقوة أقل عبر مسافة أطول.'] },
  'phys-magnet-compass': { name: ['Boussole magnétique', 'Magnetic compass', 'بوصلة مغناطيسية'], explanation: ['L’aiguille tourne sur son pivot et s’aligne sur le champ de l’aimant proche.', 'The needle turns on its pivot and aligns with the field of the nearby magnet.', 'تدور الإبرة على محورها وتصطف مع مجال المغناطيس القريب.'] },
  'phys-prism-light': { name: ['Prisme de lumière', 'Light prism', 'منشور الضوء'], explanation: ['Dirige le rayon blanc vers le prisme et observe les couleurs qui en sortent.', 'Direct the white ray into the prism and observe the emerging colours.', 'وجه الشعاع الأبيض نحو المنشور وشاهد الألوان الخارجة.'] },
  'aero-sounding-rocket': { name: ['Fusée-sonde météorologique', 'Weather sounding rocket', 'صاروخ سبر جوي'], explanation: ['Une fusée-sonde emporte des instruments pour étudier la haute atmosphère.', 'A sounding rocket carries instruments to study the upper atmosphere.', 'يحمل صاروخ السبر أجهزة لدراسة الغلاف الجوي العلوي.'] },
  'aero-leo-cubesat': { name: ['CubeSat scientifique LEO', 'Scientific LEO CubeSat', 'قمر كيوب سات علمي'], explanation: ['Un petit satellite porte des instruments, des panneaux solaires et une antenne.', 'A small satellite carries instruments, solar panels and an antenna.', 'يحمل قمر صغير أجهزة وألواحا شمسية وهوائيا.'] },
  'aero-planetary-rover': { name: ['Rover planétaire autonome', 'Autonomous planetary rover', 'عربة كوكبية ذاتية'], explanation: ['Les roues déplacent le rover et les instruments observent le sol.', 'Wheels move the rover and instruments observe the ground.', 'تحرك العجلات العربة وتراقب الأجهزة التربة.'] },
  'aero-iss-module': { name: ['Module de station orbitale', 'Orbital station module', 'وحدة محطة مدارية'], explanation: ['Les modules et équipements se relient pour former une station orbitale.', 'Modules and equipment connect to form an orbital station.', 'تتصل الوحدات والمعدات لتشكل محطة مدارية.'] },
  'aero-heavy-launcher': { name: ['Lanceur lourd réutilisable', 'Reusable heavy launcher', 'قاذف ثقيل قابل لإعادة الاستخدام'], explanation: ['Les étages du lanceur portent la charge utile et se séparent pendant le vol.', 'The launcher stages carry the payload and separate during flight.', 'تحمل مراحل القاذف الحمولة وتنفصل أثناء الطيران.'] },
};

export const EXPERIMENT_FACT_TEXT = {
  observation: ['Observe les pièces et leurs connexions dans les vues de face, de profil et de dessus.', 'Observe the parts and their connections from the front, side and top.', 'شاهد القطع واتصالاتها من الأمام والجانب والأعلى.'],
  model: ['Ce modèle simplifié sert à comprendre le montage ; ce n’est pas un appareil de laboratoire réel.', 'This simplified model helps explain assembly; it is not real laboratory equipment.', 'يساعد هذا النموذج المبسط على فهم التركيب وهو ليس جهاز مختبر حقيقيا.'],
} satisfies Record<string, [string, string, string]>;

interface ArabicBlueprintTranslation {
  name: string;
  subtitle: string;
  tierLabel: string;
  ageNote: string;
  discovery: DiscoveryFacts;
  parts: Record<string, { name: string; roleHint: string }>;
}

const ARABIC_BLUEPRINTS: Record<string, ArabicBlueprintTranslation> = {
  'car-solar-city': {
    name: 'سيارة المدينة الشمسية',
    subtitle: 'سيارة كهربائية حضرية رشيقة وتعمل بالطاقة النظيفة',
    tierLabel: 'المستوى 1 · استكشاف',
    ageNote: 'مناسب من 6 سنوات · 4 قطع',
    discovery: {
      howItWorks:
        'تُحوّل الخلايا الشمسية الموجودة على السقف ضوء الشمس إلى كهرباء تُخزَّن في بطارية تحت الهيكل، لتشغيل محرك كهربائي هادئ يدفع العجلات الخلفية.',
      realRecord:
        'في سباق التحدي الشمسي العالمي بأستراليا، تقطع السيارات الشمسية التجريبية أكثر من 3000 كيلومتر عبر الصحراء بطاقة الشمس وحدها وبسرعة تتجاوز 85 كم/س!',
      didYouKnow:
        'عندما تضغط السيارة الكهربائية على المكابح، يعمل محركها بالعكس مثل المولّد ليُعيد شحن البطارية تلقائياً.',
    },
    parts: {
      chassis: {
        name: 'الهيكل الحامل',
        roleHint: 'القاعدة الصلبة التي تحمل السيارة بالكامل ومصابيحها الأمامية.',
      },
      'front-axle': {
        name: 'محور العجلات الأمامية',
        roleHint: 'يسمح بتوجيه السيارة يميناً ويساراً بدقة.',
      },
      'rear-axle': {
        name: 'محور العجلات الخلفية',
        roleHint: 'ينقل قوة دفع المحرك الكهربائي إلى الطريق.',
      },
      cabin: {
        name: 'المقصورة البانورامية',
        roleHint: 'تحمي الركاب وتمنحهم رؤية واضحة في جميع الاتجاهات.',
      },
    },
  },

  'boat-explorer-sail': {
    name: 'مركب الاستكشاف الشراعي',
    subtitle: 'سفينة تندفع فوق الأمواج بقوة الرياح وحدها',
    tierLabel: 'المستوى 1 · استكشاف',
    ageNote: 'مناسب من 6 سنوات · 5 قطع',
    discovery: {
      howItWorks:
        'يطفو البدن بفضل قوة دفع أرخميدس للماء، وتمنع العارضة الثقيلة تحت الماء انقلاب القارب، بينما يلتقط الشراع المقوّس الهواء مثل جناح طائرة عمودي.',
      realRecord:
        'تستطيع اليخوت الشراعية المحيطية الحديثة الدوران حول الكرة الأرضية بالكامل دون توقف أو محرك في حوالي 65 إلى 74 يوماً فقط!',
      didYouKnow:
        'يمكن للقارب الشراعي التقدم نحو الجهة التي تهب منها الرياح عبر الإبحار في مسار متعرج يُسمّى «المناورة المتعرجة».',
    },
    parts: {
      hull: {
        name: 'البدن الطافي',
        roleHint: 'يزيح الماء ليجعل القارب يطفو بثبات وفق مبدأ أرخميدس.',
      },
      keel: {
        name: 'عارضة التوازن السفلية',
        roleHint: 'ثقل سفلي تحت البدن يمنع المركب الشراعي من الانقلاب.',
      },
      deck: {
        name: 'سطح المركب البحري',
        roleHint: 'أرضية مانعة لتسرب الماء يتحرك عليها البحّارة بأمان.',
      },
      mast: {
        name: 'الصاري والذراع',
        roleHint: 'عمود رأسي متين يحمل الشراع في مواجهة الرياح القوية.',
      },
      sail: {
        name: 'الشراع الرئيسي المقوّس',
        roleHint: 'يلتقط طاقة الرياح لدفع المركب للأمام بسلاسة.',
      },
    },
  },

  'plane-aeroclub': {
    name: 'طائرة التدريب المروحية',
    subtitle: 'طائرة تدريب ذات جناح علوي مستقر لتعلّم الطيران',
    tierLabel: 'المستوى 1 · استكشاف',
    ageNote: 'مناسب من 6 سنوات · 5 قطع',
    discovery: {
      howItWorks:
        'تسحب المروحة الأمامية الطائرة في الهواء، وعندما ينساب الهواء بسرعة فوق السطح المنحني للجناح العلوي تتولد قوة رفع تحمل الطائرة في السماء.',
      realRecord:
        'طائرة التدريب الشهيرة «سيسنا 172» ذات الجناح العلوي صُنع منها أكثر من 44 ألف طائرة منذ عام 1956، وهي الأكثر إنتاجاً في تاريخ الطيران!',
      didYouKnow:
        'وجود الجناح أعلى جسم الطائرة يمنحها توازناً طبيعياً يشبه البندول، ويتيح للطيار رؤية الأرض بوضوح تحته.',
    },
    parts: {
      fuselage: {
        name: 'جسم الطائرة الانسيابي',
        roleHint: 'الهيكل المركزي الذي يضم قمرة القيادة ويربط الأجنحة بالذيل.',
      },
      'landing-gear': {
        name: 'عجلات الهبوط',
        roleHint: 'تمتص صدمة ملامسة المدرج أثناء الإقلاع والهبوط.',
      },
      'main-wing': {
        name: 'الجناح العلوي الحامل',
        roleHint: 'يولّد قوة الرفع الهوائية التي ترفع الطائرة في السماء.',
      },
      tail: {
        name: 'مجموعة الذيل الخلفية',
        roleHint: 'تحافظ على توازن المسار تماماً مثل ريش السهم.',
      },
      propeller: {
        name: 'المروحة ثلاثية الشفرات',
        roleHint: 'تدور بسرعة لتوليد قوة السحب نحو الأمام.',
      },
    },
  },

  'car-fire-truck': {
    name: 'شاحنة الإطفاء والإنقاذ',
    subtitle: 'مركبة إنقاذ ثقيلة مزودة بخزان مياه وسُلّم دوّار طويل',
    tierLabel: 'المستوى 2 · الورشة',
    ageNote: '7 إلى 9 سنوات · 7 قطع',
    discovery: {
      howItWorks:
        'عند الوصول لموقع الحريق، يُحوّل محرك الديزل قوته من العجلات إلى مضخة طرد مركزي ضخمة تدفع الماء بضغط عالٍ، بينما ترفع المكابس الهيدروليكية السلم.',
      realRecord:
        'يصل ارتفاع سلالم شاحنات الإطفاء القياسية إلى 30–32 متراً (نحو الطابق العاشر)، وتصل بعض الشاحنات العملاقة إلى 68 متراً!',
      didYouKnow:
        'قبل رفع السلم الطويل في الهواء، تُخرج الشاحنة دائماً ركائز تثبيت جانبية على الأرض حتى لا تميل أبداً.',
    },
    parts: {
      chassis: {
        name: 'هيكل الشاحنة الثقيل',
        roleHint: 'عوارض فولاذية قوية قادرة على حمل أطنان المياه والسلم.',
      },
      engine: {
        name: 'كتلة محرك الديزل',
        roleHint: 'توفر القوة للانطلاق السريع وتشغيل مضخة المياه القوية.',
      },
      'front-axle': {
        name: 'المحور الأمامي الموجّه',
        roleHint: 'يوجه الشاحنة الثقيلة بدقة داخل الشوارع الضيقة.',
      },
      'rear-axle': {
        name: 'المحور الخلفي الحامل',
        roleHint: 'يتحمل الوزن الكبير لخزان المياه الممتلئ.',
      },
      cabin: {
        name: 'مقصورة رجال الإطفاء',
        roleHint: 'تُركّب فوق المحرك لتقلّ فريق الإنقاذ ومعداتهم.',
      },
      tank: {
        name: 'خزان المياه والخزائن',
        roleHint: 'يخزن المياه المضغوطة وخراطيم الإطفاء.',
      },
      ladder: {
        name: 'السلم الكبير الدوّار',
        roleHint: 'يُثبّت أعلى الخزان للوصول إلى الطوابق المرتفعة.',
      },
    },
  },

  'boat-port-tug': {
    name: 'قاطرة الميناء البحرية',
    subtitle: 'عملاق بحري صغير قادر على دفع وسحب سفن الشحن العملاقة',
    tierLabel: 'المستوى 2 · الورشة',
    ageNote: '7 إلى 9 سنوات · 7 قطع',
    discovery: {
      howItWorks:
        'رغم حجمها الصغير، يشغل محرك بحري ضخم معظم بدنها ويدير مراوح عالية العزم قادرة على الدفع أو السحب في كل الاتجاهات داخل الميناء.',
      realRecord:
        'تنتج قاطرة ميناء بطول 30 متراً قوة تفوق 5000 حصان، وتستطيع تحريك سفينة حاويات طولها 400 متر ووزنها 200 ألف طن!',
      didYouKnow:
        'الحواجز المطاطية السوداء في مقدمة القاطرة تعمل كوسائد عملاقة تمتص الصدمات عند دفع السفن الضخمة دون خدشها.',
    },
    parts: {
      hull: {
        name: 'البدن الفولاذي المقوّى',
        roleHint: 'بدن عريض ومتين يقاوم أمواج الميناء وقوى السحب.',
      },
      propulsion: {
        name: 'المروحة والدفة الخلفية',
        roleHint: 'مروحة ذات عزم هائل لقطر السفن العملاقة وتوجيهها.',
      },
      deck: {
        name: 'سطح العمل البحري',
        roleHint: 'يحمل رافعات القطر ويحمي غرفة المحركات بالأسفل.',
      },
      fenders: {
        name: 'مصدّات المقدمة المطاطية',
        roleHint: 'تمتص قوة التلامس عندما تدفع القاطرة سفينة شحن كبيرة.',
      },
      wheelhouse: {
        name: 'غرفة القيادة الزجاجية',
        roleHint: 'برج تحكم مرتفع يمنح القبطان رؤية كاملة للميناء.',
      },
      chimney: {
        name: 'المدخنتان المزدوجتان',
        roleHint: 'تُخرجان عادم المحركات البحرية الضخمة الموجودة تحت السطح.',
      },
      radar: {
        name: 'صاري الرادار البحري',
        roleHint: 'يكشف مواقع السفن الأخرى حتى وسط الضباب الكثيف.',
      },
    },
  },

  'plane-acro-biplane': {
    name: 'الطائرة البهلوانية ثنائية السطح',
    subtitle: 'طائرة استعراض رشيقة بجناحين متوازيين ومحرك نجمي',
    tierLabel: 'المستوى 2 · الورشة',
    ageNote: '7 إلى 9 سنوات · 8 قطع',
    discovery: {
      howItWorks:
        'يمنح الجناحان المتراكبان المتصلان بدعامات صلبة قوة رفع كبيرة مع جناح قصير الطول، مما يسمح بالدوران والمناورة البهلوانية بسرعة مذهلة.',
      realRecord:
        'تستطيع طائرات الاستعراض ثنائية السطح مثل «بيتس سبيشل» الالتفاف حول محورها بسرعة تتجاوز 300 درجة في الثانية الواحدة!',
      didYouKnow:
        'تترتب أسطوانات المحرك النجمي في دائرة حول المروحة حتى يبرّدها تيار الهواء مباشرة أثناء الطيران دون الحاجة لمبرّد ماء.',
    },
    parts: {
      fuselage: {
        name: 'الهيكل الكلاسيكي',
        roleHint: 'البنية المركزية التي تربط قمرة الطيار بذيل الطائرة.',
      },
      'radial-engine': {
        name: 'المحرك النجمي الدائري',
        roleHint: 'أسطواناته المرتبة كالنجمة تبرد مباشرة بتيار الهواء.',
      },
      gear: {
        name: 'عجلات الهبوط الكلاسيكية',
        roleHint: 'تحمل مقدمة الطائرة المرتفعة على المدارج العشبية.',
      },
      'lower-wing': {
        name: 'الجناح السفلي',
        roleHint: 'السطح الحامل الأول المثبت أسفل جسم الطائرة.',
      },
      struts: {
        name: 'أعمدة الربط المعدنية',
        roleHint: 'تربط الجناح السفلي بالجناح العلوي لتشكيل إطار شديد الصلابة.',
      },
      'upper-wing': {
        name: 'الجناح العلوي',
        roleHint: 'يضاعف قوة الرفع لتنفيذ الحلقات البهلوانية الضيقة!',
      },
      tail: {
        name: 'ذيل المناورات البهلوانية',
        roleHint: 'أسطح توجيه عريضة تمنح تحكماً فورياً في الارتفاع والاتجاه.',
      },
      propeller: {
        name: 'مروحة الجر الخشبية',
        roleHint: 'تُثبّت على محور المحرك النجمي لدفع الطائرة بقوة.',
      },
    },
  },

  'car-formula-racer': {
    name: 'سيارة سباق الفورمولا',
    subtitle: 'سيارة سباق أحادية المقعد بانسيابية هوائية وطوق أمان هالو',
    tierLabel: 'المستوى 3 · مهندس',
    ageNote: '8 إلى 10 سنوات · 10 قطع',
    discovery: {
      howItWorks:
        'تعمل الأجنحة الأمامية والخلفية بعكس جناح الطائرة تماماً: فبدلاً من رفع السيارة، يضغط الهواء السيارة بقوة نحو الأسفلت لاجتياز المنعطفات بسرعة فائقة.',
      realRecord:
        'تتجاوز سرعة سيارات الفورمولا 350 كم/س، وتولّد قوة ضغط سفلية كبيرة تكفي نظرياً لقيادتها مقلوبة على سقف نفق عند سرعة 180 كم/س!',
      didYouKnow:
        'طوق الحماية «هالو» المصنوع من التيتانيوم فوق رأس السائق يزن 7 كيلوغرامات فقط، لكنه يتحمل وزن حافلتين بطابقين (12 طناً).',
    },
    parts: {
      floor: {
        name: 'الأرضية المسطحة الانسيابية',
        roleHint: 'قاعدة سفلية منخفضة جداً تُلصق سيارة السباق بالحلبة عند السرعات العالية.',
      },
      monocoque: {
        name: 'خلية قمرة القيادة',
        roleHint: 'هيكل مركزي فائق الصلابة يجلس داخله السائق بأمان.',
      },
      'v6-engine': {
        name: 'المحرك الهجين V6',
        roleHint: 'يُثبّت خلف السائق مباشرة لتحقيق أفضل توازن للوزن.',
      },
      'front-wheels': {
        name: 'نظام التعليق والعجلات الأمامية',
        roleHint: 'إطارات عريضة تمنح توجيهاً فائق الدقة في المنعطفات.',
      },
      'rear-wheels': {
        name: 'نظام التعليق والعجلات الخلفية',
        roleHint: 'تنقل كامل قوة المحرك الهجين إلى أرض الحلبة.',
      },
      sidepods: {
        name: 'الفتحات الجانبية للمبرّدات',
        roleHint: 'تلتقط الهواء البارد على الجانبين لتبريد المحرك الهجين.',
      },
      'nose-cone': {
        name: 'المخروط الأمامي الانسيابي',
        roleHint: 'يشق الهواء أمام قمرة القيادة ويحمل الجناح الأمامي.',
      },
      'front-wing': {
        name: 'الجناح الأمامي متعدد الشفرات',
        roleHint: 'يثبت العجلات الأمامية على الأسفلت في المنعطفات السريعة.',
      },
      'halo-airbox': {
        name: 'طوق الأمان هالو ومدخل الهواء',
        roleHint: 'قوس من التيتانيوم يحمي خوذة السائق ويوجه الهواء للمحرك.',
      },
      'rear-wing': {
        name: 'الجناح الخلفي DRS',
        roleHint: 'يولّد قوة ضغط هوائية هائلة على القسم الخلفي للسيارة.',
      },
    },
  },

  'boat-ocean-research': {
    name: 'سفينة الأبحاث المحيطية',
    subtitle: 'سفينة علمية مزودة بروبوت غواص لأعماق البحار ورافعة تلسكوبية',
    tierLabel: 'المستوى 3 · مهندس',
    ageNote: '8 إلى 10 سنوات · 10 قطع',
    discovery: {
      howItWorks:
        'بفضل نظام تحديد المواقع والدافعات الدوّارة بزاوية 360 درجة، تقف السفينة ثابتة في مكانها وسط المحيط بينما يُنزل الإطار الخلفي الروبوت الغواص عبر كابل ألياف ضوئية.',
      realRecord:
        'تغوص الروبوتات العلمية غير المأهولة (ROV) إلى أكثر من 6000 متر تحت سطح البحر، حيث الظلام الدامس والضغط يفوق السطح بـ 600 مرة!',
      didYouKnow:
        'توضع محركات سفن الأبحاث فوق وسائد عازلة للاهتزاز حتى تبقى هادئة جداً ولا تشوّش أجهزة السونار العلمية تحت البدن.',
    },
    parts: {
      hull: {
        name: 'بدن أعالي البحار',
        roleHint: 'بدن مرتفع ومصمم لمواجهة أمواج المحيطات البعيدة.',
      },
      azimuth: {
        name: 'الدافعات المروحية الدوّارة',
        roleHint: 'مراوح تدور 360° لتثبيت السفينة بدقة فوق موقع الاستكشاف.',
      },
      'main-deck': {
        name: 'السطح العلمي الرئيسي',
        roleHint: 'منصة واسعة تضم المختبرات ومعدات الإنزال البحري.',
      },
      helipad: {
        name: 'مهبط المروحيات الأمامي',
        roleHint: 'منصة دائرية في المقدمة لاستقبال المروحيات في عرض البحر.',
      },
      bridge: {
        name: 'برج القيادة البانورامي',
        roleHint: 'مركز الملاحة وتشغيل أجهزة السونار والخرائط البحرية.',
      },
      'radar-arch': {
        name: 'قوس الرادار والأقمار الصناعية',
        roleHint: 'يرسل صور أعماق المحيط مباشرة إلى العلماء حول العالم.',
      },
      'light-bar': {
        name: 'شريط الكشافات الليلية',
        roleHint: 'يضيء سطح العمل خلال المهمات العلمية الليلية.',
      },
      'a-frame': {
        name: 'البوابة الخلفية على شكل A',
        roleHint: 'قوس متحرك في مؤخرة السفينة لإنزال الأجهزة الثقيلة في الماء.',
      },
      crane: {
        name: 'الرافعة التلسكوبية',
        roleHint: 'ترفع الغواصة الآلية وتضعها برفق فوق الأمواج.',
      },
      'rov-sub': {
        name: 'غواصة الأعماق الآلية ROV',
        roleHint: 'روبوت أصفر موجّه بالكابل قادر على الغوص لآلاف الأمتار!',
      },
    },
  },

  'plane-rescue-heli': {
    name: 'مروحية الإنقاذ الجبلي',
    subtitle: 'طائرة عمودية قادرة على التحليق الثابت في أعالي الجبال',
    tierLabel: 'المستوى 3 · مهندس',
    ageNote: '8 إلى 10 سنوات · 11 قطعة',
    discovery: {
      howItWorks:
        'تدور الشفرات الأربع الكبيرة في الأعلى لتوليد قوة الرفع حتى أثناء التوقف في الهواء، بينما تدفع المروحة الخلفية الصغيرة الذيل جانبياً لمنع دوران المقصورة حول نفسها.',
      realRecord:
        'في عام 2005 حققت مروحية إنقاذ رقماً قياسياً عالمياً مذهلاً بالهبوط ثم الإقلاع مجدداً من قمة جبل إيفرست على ارتفاع 8848 متراً!',
      didYouKnow:
        'عندما تكون الصخور الجبلية شديدة الانحدار، تحلّق المروحية ثابتة في مكانها ويُنزل الونش المسعف بواسطة كابل فولاذي متين.',
    },
    parts: {
      'floor-frame': {
        name: 'الأرضية الهيكلية الحاملة',
        roleHint: 'إطار معدني خفيف يربط زلاجات الهبوط بالمقصورة الطبية.',
      },
      skids: {
        name: 'زلاجات الهبوط المعدنية',
        roleHint: 'تسمح بالهبوط بأمان فوق الثلوج أو الصخور أو الأسطح.',
      },
      cabin: {
        name: 'المقصورة الطبية الزجاجية',
        roleHint: 'واجهة شفافة واسعة تمنح الطيارين رؤية واضحة للأرض بالأسفل.',
      },
      'tail-boom': {
        name: 'ذراع الذيل الخلفي',
        roleHint: 'ذراع طويل يحمل مروحة التوازن الخلفية بعيداً عن الشفرات الرئيسية.',
      },
      'tail-fin': {
        name: 'الزعنفة العمودية الموازنة',
        roleHint: 'تساعد المروحية على الطيران في خط مستقيم عند السرعات العالية.',
      },
      'tail-rotor': {
        name: 'مروحة التوازن الخلفية',
        roleHint: 'ضرورية جداً! بدونها ستدور مقصورة المروحية حول نفسها باستمرار.',
      },
      turbines: {
        name: 'المحركان التوربينيان العلويان',
        roleHint: 'محركان نفاثان قويان يديران علبة التروس والشفرات.',
      },
      'rotor-mast': {
        name: 'عمود الدوران وقرص التوجيه',
        roleHint: 'يميّل زاوية الشفرات للتقدم للأمام أو التراجع أو التحرك جانبياً.',
      },
      'main-blades': {
        name: 'الشفرات الحاملة الرباعية',
        roleHint: 'أربعة أجنحة دوّارة كبيرة تسمح بالتحليق الثابت في الهواء!',
      },
      'rescue-winch': {
        name: 'ونش الإنقاذ الجانبي',
        roleHint: 'يُنزل المسعف عبر كابل فولاذي دون الحاجة إلى الهبوط.',
      },
      searchlight: {
        name: 'كشاف البحث الأمامي',
        roleHint: 'حزمة ضوئية قوية موجّهة مثبتة أسفل مقدمة المقصورة.',
      },
    },
  },
};

export function getLocalizedBlueprint(
  blueprint: VehicleBlueprint,
  lang: LanguageCode,
): VehicleBlueprint {
  if (lang === 'fr') return blueprint;
  if (lang === 'en') return localizeBlueprintToEnglish(blueprint);

  const ar = ARABIC_BLUEPRINTS[blueprint.id];
  if (ar) {
    return {
      ...blueprint,
      name: ar.name,
      subtitle: ar.subtitle,
      tierLabel: ar.tierLabel,
      ageNote: ar.ageNote,
      discovery: ar.discovery,
      parts: blueprint.parts.map((part) => {
        const arPart = ar.parts[part.id];
        if (!arPart) return part;
        return {
          ...part,
          name: arPart.name,
          roleHint: arPart.roleHint,
        };
      }),
    };
  }

  return {
    ...blueprint,
    name: blueprint.nameAr ?? blueprint.name,
    subtitle: blueprint.subtitleAr ?? blueprint.subtitle,
    tierLabel: blueprint.tierLabelAr ?? blueprint.tierLabel,
    ageNote: blueprint.ageNoteAr ?? blueprint.ageNote,
    discovery: blueprint.discoveryAr ?? blueprint.discovery,
    parts: blueprint.parts.map((part) => ({
      ...part,
      name: part.nameAr ?? part.name,
      roleHint: part.roleHintAr ?? part.roleHint,
    })),
  };
}

export function getLocalizedBlueprints(
  blueprints: VehicleBlueprint[],
  lang: LanguageCode,
): VehicleBlueprint[] {
  if (lang === 'fr') return blueprints;
  return blueprints.map((bp) => getLocalizedBlueprint(bp, lang));
}

export interface UIStrings {
  appName: string;
  navAriaLabel: string;
  stagesBtn: string;
  styleWood: string;
  styleWoodShort: string;
  styleBlocks: string;
  styleBlocksShort: string;
  styleRealistic: string;
  styleRealisticShort: string;
  styleComics: string;
  styleComicsShort: string;
  discoveryBtn: string;
  hintBtn: string;
  langSwitchAria: string;
  dockAriaLabel: string;
  openWorkbench: (placed: number, total: number) => string;
  collapseWorkbench: string;
  shortcutH: string;
  stageOf: (num: number, total: number) => string;
  partsCounter: (placed: number, total: number) => string;
  nextStageBtn: string;
  dragInstruction: string;
  partStatusPlaced: string;
  partStatusLockedAfter: (depName: string) => string;
  partStatusHinted: string;
  partStatusReady: string;
  explodedViewLabel: string;
  cameraAnglesAria: string;
  camIso: string;
  camFront: string;
  camSide: string;
  camTop: string;
  guideBtn: string;
  guideBtnTitle: string;
  soundMuted: string;
  soundActive: string;
  muteAria: string;
  unmuteAria: string;
  undoBtn: string;
  recenterBtn: string;
  swUpdateAvailable: string;
  swUpdateBtn: string;
  octoCongratulations: string;
  resetBtn: string;
  autoSavedBadge: string;
  // Status & Canvas messages
  stageResetMsg: (vehicleName: string) => string;
  partSnappedMsg: (partName: string, roleHint: string) => string;
  placeFirstMsg: (missingName: string, partName: string) => string;
  partStagedMsg: (partName: string) => string;
  dragReleaseToSnap: (partName: string) => string;
  dragPlaceFirst: (missingName: string) => string;
  dragApproachGuide: (partName: string) => string;
  dropRejectedMissingDep: (missingName: string, partName: string) => string;
  webglResetTitle: string;
  webglResetDesc: string;
  webglRetryBtn: string;
  trayPositionBottom: string;
  trayPositionStart: string;
  trayPositionEnd: string;
  progressSavedToast: string;
  progressImportedToast: string;
  progressImportErrorToast: string;
  progressResetToast: string;
  // Stage Catalog & LocalStorage Save Manager
  catalogTitle: string;
  discoveryObservationTitle: string;
  discoveryModelBadge: string;
  catalogSubtitle: string;
  closeCatalogAria: string;
  filterAll: string;
  filterCars: string;
  filterBoats: string;
  filterPlanes: string;
  filterConstruction: string;
  filterSpace: string;
  filterAerospace: string;
  filterElectronics: string;
  filterChemistry: string;
  filterPhysics: string;
  filterNature: string;
  filterHistory: string;
  trayTools: string;
  hudTools: string;
  trayShowAll: string;
  trayShowReady: string;
  allTiersLabel: string;
  tierPillLabel: (tier: number) => string;
  searchPlaceholder: string;
  clearSearchLabel: string;
  noStagesMatch: string;
  showingCountLabel: (shown: number, total: number) => string;
  tierCatalogSummary: (first: number, last: number, min: number, max: number) => string;
  freeAccessActive: string;
  unlockAllBtn: string;
  unlockAllTitle: string;
  tier1Title: string;
  tier1Subtitle: string;
  tier2Title: string;
  tier2Subtitle: string;
  tier3Title: string;
  tier3Subtitle: string;
  tier4Title: string;
  tier4Subtitle: string;
  tier5Title: string;
  tier5Subtitle: string;
  catCar: string;
  catBoat: string;
  catPlane: string;
  catConstruction: string;
  catSpace: string;
  stageLabel: (num: number) => string;
  partsCountLabel: (count: number) => string;
  statusCompleted: string;
  statusCurrentActive: string;
  statusInProgress: (placed: number, total: number) => string;
  statusBuild: string;
  unlockRequirement: (stagesNeeded: number) => string;
  // Save Manager section inside Catalog
  savePanelTitle: string;
  savePanelDesc: (completed: number, total: number, stars: number, maxStars: number) => string;
  saveNowBtn: string;
  exportSaveBtn: string;
  importSaveBtn: string;
  resetAllBtn: string;
  confirmResetBtn: string;
  cancelResetBtn: string;
  // Mechanic Hint Guide Drawer (100% local, zero AI)
  mechanicDrawerAria: string;
  mechanicTitle: string;
  mechanicSubtitle: string;
  closeMechanicAria: string;
  nextStepBannerReady: string;
  nextStepBannerDone: string;
  highlightOn3DBtn: string;
  recommendedNextTitle: string;
  allPartsChecklistTitle: string;
  vehicleCompletedCongrats: (vehicleName: string) => string;
  // Discovery Modal
  discoveryCompletedTitle: (vehicleName: string) => string;
  discoveryPreviewTitle: (vehicleName: string) => string;
  closeDiscoveryAria: string;
  discoveryLockedTitle: string;
  discoveryLockedDesc: (partsCount: number, vehicleName: string) => string;
  discoveryBadgeLocal: string;
  howItWorksTitle: string;
  realRecordTitle: string;
  didYouKnowTitle: string;
  admire3DBtn: string;
  goToNextStageBtn: string;
  // Guided Tour ("Tour du propriétaire")
  tourAriaLabel: string;
  tourKicker: string;
  tourStepCounter: (current: number, total: number) => string;
  closeTourAria: string;
  tourSkipBtn: string;
  tourPrevBtn: string;
  tourNextBtn: string;
  tourPlayNowBtn: string;
  tourSilhouetteLabel: (partName: string) => string;
  tourSnappedBadge: string;
  tourDragUpLabel: (partName: string) => string;
  tourGreatFirstSnap: (vehicleName: string) => string;
  tourRotateHint: string;
  tourSteps: Array<{
    title: string;
    description: string;
    tip: string;
  }>;
  // Achievement Badges & Progression Modal
  openProgressionBtn: (unlocked: number, total: number) => string;
  progressionModalTitle: string;
  progressionModalSubtitle: string;
  closeProgressionAria: string;
  backToCatalogBtn: string;
  rankLabel: string;
  maxRankReached: string;
  kpiStarsLabel: string;
  kpiCompletedLabel: string;
  kpiPerfectLabel: string;
  kpiBadgesLabel: string;
  familyScoresTitle: string;
  badgesSectionTitle: string;
  badgeFilterAll: (count: number) => string;
  badgeFilterUnlocked: (count: number) => string;
  badgeFilterLocked: (count: number) => string;
  badgeUnlockedLabel: string;
  badgeLockedLabel: string;
  newBadgesUnlockedBannerTitle: (count: number) => string;
  viewAllBadgesBtn: string;
  // Daily Mechanical Challenge ("Défi Mécanique du Jour") & Rare Parts Vault
  dailyNavBtn: string;
  dailyCompletedShort: string;
  dailyBonusStageLabel: string;
  returnToStagesBtn: string;
  rarePartCardLabel: string;
  dailyModalTitle: string;
  dailyModalSubtitle: string;
  closeDailyAria: string;
  dailyResetInLabel: string;
  dailyStreakLabel: string;
  dailyStreakValue: (days: number) => string;
  dailyBestStreakLabel: (days: number) => string;
  dailyRareVaultKpiLabel: string;
  dailyTodayVehicleSection: string;
  dailyRareSpotlightLabel: string;
  dailyPlayBtn: string;
  dailyReplayBtn: string;
  dailyActiveNowBtn: string;
  dailyVaultTitle: string;
  dailyVaultSubtitle: (collected: number, total: number) => string;
  dailyVaultCollectedStatus: string;
  dailyVaultLockedStatus: string;
  dailyCatalogBannerTitle: string;
  dailyCatalogBannerCta: string;
  dailyRareUnlockedBannerTitle: string;
  openDailyVaultBtn: string;
  // Optional Stopwatch Mode ("Mode Chronomètre") & Local Best-Times Leaderboard
  timerToggleBtn: string;
  timerActiveLabel: string;
  timerOffLabel: string;
  timerEnabledToast: string;
  timerDisabledToast: string;
  personalBestShort: (formatted: string) => string;
  leaderboardNavBtn: string;
  leaderboardTitle: string;
  leaderboardSubtitle: string;
  closeLeaderboardAria: string;
  timerModeSwitchTitle: string;
  timerModeSwitchDesc: string;
  timerEnableAction: string;
  timerDisableAction: string;
  leaderboardKpiRuns: string;
  leaderboardKpiFastest: string;
  leaderboardKpiBestPace: string;
  leaderboardTabStageRecords: (count: number) => string;
  leaderboardTabTopRuns: (count: number) => string;
  leaderboardColRank: string;
  leaderboardColVehicle: string;
  leaderboardColTime: string;
  leaderboardColPace: string;
  leaderboardColPrecision: string;
  leaderboardColAction: string;
  leaderboardBeatTimeBtn: string;
  leaderboardTimeAttackCurrentBtn: string;
  leaderboardEmptyTitle: string;
  leaderboardEmptyDesc: string;
  leaderboardStartFirstRunBtn: string;
  clearLeaderboardBtn: string;
  confirmClearLeaderboardBtn: string;
  discoveryTimerCardTitle: string;
  discoveryNewRecordTag: string;
  discoveryPreviousBestLabel: (prevTime: string, delta: string) => string;
  openLeaderboardBtn: string;
  retryTimedRunBtn: string;
  // Family Multi-Profiles, Native Web Speech & Offline PWA
  profilesNavBtn: string;
  profilesModalTitle: string;
  profilesModalSubtitle: string;
  closeProfilesAria: string;
  profilesListTitle: (count: number, max: number) => string;
  profileActiveTag: string;
  profileSwitchBtn: string;
  profileStatsLine: (completed: number, total: number, stars: number, badges: number) => string;
  profileNewBtn: string;
  profileMaxReached: (max: number) => string;
  profileNameLabel: string;
  profileNamePlaceholder: string;
  profileColorLabel: string;
  profileIconLabel: string;
  profileCreateSubmit: string;
  profileEditBtn: string;
  profileSaveEditBtn: string;
  profileDeleteBtn: string;
  profileConfirmDeleteBtn: string;
  profileSwitchedToast: (name: string) => string;
  profileCreatedToast: (name: string) => string;
  profileDeletedToast: (name: string) => string;
  voiceSectionTitle: string;
  voiceSectionDesc: string;
  voiceAutoReadLabel: string;
  voiceAutoReadDesc: string;
  voiceTestBtn: string;
  voiceTestSample: string;
  voiceListenBtn: string;
  voiceStopBtn: string;
  voiceReadFullCardBtn: string;
  voiceAutoToggleShort: string;
  voiceAutoEnabledToast: string;
  voiceAutoDisabledToast: string;
  replayInstructionAria: string;
  voiceUnsupportedLabel: string;
  pwaSectionTitle: string;
  pwaSectionDesc: string;
  pwaInstallBtn: string;
  pwaInstallShortBtn: string;
  pwaInstalledLabel: string;
  pwaOnlineReadyLabel: string;
  pwaOfflineActiveBanner: string;
  pwaIosGuideTitle: string;
  pwaIosStep1: string;
  pwaIosStep2: string;
  pwaCloseGuideBtn: string;
  // Axe 1 — 3D Test Drive, X-Ray Cutaway & Thematic Environments
  testDriveBtn: string;
  testDriveActiveBtn: string;
  testDriveStartedToast: (vehicleName: string) => string;
  testDriveStoppedToast: string;
  xRayBtn: string;
  xRayActiveBtn: string;
  xRayTitle: string;
  xRayEnabledToast: string;
  xRayDisabledToast: string;
  envThematicBtn: string;
  envStudioBtn: string;
  envSwitchTitle: string;
  envThematicToast: string;
  envStudioToast: string;
  // Axe 2 — Paint Booth, 3D Photo Postcard Studio & Personal 3D Garage
  studioBtn: string;
  studioModalTitle: string;
  studioModalSubtitle: string;
  closeStudioAria: string;
  studioPaintSectionTitle: string;
  studioPaintSectionDesc: string;
  liveryAppliedToast: (liveryLabel: string) => string;
  studioPhotoSectionTitle: string;
  studioPhotoSectionDesc: string;
  capturePostcardBtn: string;
  retakePostcardBtn: string;
  downloadPostcardBtn: string;
  postcardDownloadedToast: string;
  workshopThemeSectionTitle: string;
  workshopThemeSectionDesc: string;
  groundAsphalt: string;
  groundGrass: string;
  groundSand: string;
  groundSnow: string;
  groundCircuit: string;
  groundLightWood: string;
  groundMoon: string;
  groundWater: string;
  garageNavBtn: string;
  garageModalTitle: string;
  garageModalSubtitle: string;
  closeGarageAria: string;
  garageKpiVehicles: string;
  garageKpiPatents: string;
  garageKpiRepairs: string;
  garageKpiRareVault: string;
  garageTabVehicles: (count: number) => string;
  garageTabRareVault: (collected: number, total: number) => string;
  garageEmptyTitle: string;
  garageEmptyDesc: string;
  garageLoadBtn: string;
  garageTestDriveBtn: string;
  garagePatentTag: string;
  garageRepairedTag: (count: number) => string;
  garageMasterTag: string;
  // Axe 3 — Master No-Silhouette Mode, 3-Question Engineering Quiz & Diagnostic/Repair Mode
  noSilhouetteBtn: string;
  noSilhouetteActiveBtn: string;
  noSilhouetteTitle: string;
  noSilhouetteEnabledToast: string;
  noSilhouetteDisabledToast: string;
  quizOpenBtn: string;
  quizPassedBtn: string;
  quizModalTitle: (vehicleName: string) => string;
  quizModalSubtitle: string;
  closeQuizAria: string;
  quizQuestionCounter: (current: number, total: number) => string;
  quizNextQuestionBtn: string;
  quizSeeResultsBtn: string;
  quizRetryBtn: string;
  quizScoreTitle: (score: number, total: number) => string;
  quizPatentEarnedTitle: string;
  quizPatentEarnedDesc: (vehicleName: string) => string;
  quizAlmostTitle: string;
  quizAlmostDesc: string;
  diagnosticBtn: string;
  diagnosticActiveBanner: (faultyLeft: number, missingLeft: number) => string;
  diagnosticQuitBtn: string;
  diagnosticStartedToast: (vehicleName: string, issues: number) => string;
  diagnosticExtractedToast: (partName: string) => string;
  diagnosticClickFaultyHint: (partName: string) => string;
  diagnosticCompletedToast: (vehicleName: string) => string;
  diagnosticTutorialTitle: string;
  diagnosticTutorialStep1: string;
  diagnosticTutorialStep2: string;
  diagnosticTutorialStep3: string;
  diagnosticTutorialReadyBtn: string;
  // Daily Engagement Streak & Rewards
  streakTopBarTitle: (days: number, activeToday: boolean) => string;
  streakExtendedToast: (days: number) => string;
  streakMilestoneUnlockedToast: (days: number, rewardLabel: string) => string;
  liveryLockedStreakHint: (days: number) => string;
  streakModalTitle: string;
  streakModalSubtitle: string;
  closeStreakAria: string;
  streakStatusActiveToday: (days: number) => string;
  streakStatusKeepAliveToday: (days: number) => string;
  streakStatusStartToday: string;
  streakCurrentLabel: string;
  streakBestLabel: string;
  streakDaysUnit: (days: number) => string;
  streakRecentWeekTitle: string;
  streakTodayTag: string;
  streakMilestonesTitle: string;
  streakRewardUnlockedTag: string;
  streakOpenPaintBoothBtn: string;
  // Lot A — Parental Gate, Parent & Teacher STEM Space, Gentle Session Timer & Printable Diplomas
  parentsNavBtn: string;
  parentsTopBarTitle: string;
  parentalGateTitle: string;
  parentalGateSubtitle: string;
  parentalGateInputPlaceholder: string;
  parentalGateVerifyBtn: string;
  parentalGateCancelBtn: string;
  parentalGateNewChallengeBtn: string;
  parentalGateIncorrectMsg: (attemptsLeft: number) => string;
  parentalGateCooldownMsg: (seconds: number) => string;
  parentSpaceTitle: string;
  parentSpaceSubtitle: string;
  closeParentSpaceAria: string;
  parentProfileSelectLabel: string;
  parentSwitchActiveBtn: string;
  parentTabStem: string;
  parentTabTimer: string;
  parentTabDiplomas: string;
  parentTabProfile: string;
  parentTabClassroom: string;
  parentTabFiches: string;
  fichePrintBtn: string;
  classroomSilentLabel: string;
  classroomSilentDesc: string;
  tbiModeLabel: string;
  tbiModeDesc: string;
  volumeSfxLabel: string;
  volumeVoiceLabel: string;
  ageProfileSelectorTitle: string;
  ageProfileSelectorSubtitle: string;
  ageProfile57Label: string;
  ageProfile57Desc: string;
  ageProfile810Label: string;
  ageProfile810Desc: string;
  ageProfile1112Label: string;
  ageProfile1112Desc: string;
  ageProfileConfirmBtn: string;
  parentAgeProfileSectionTitle: string;
  parentAgeProfileCurrentLabel: string;
  parentStemOverviewTitle: string;
  parentStemIndexLabel: string;
  parentKpiCompleted: string;
  parentKpiPatents: string;
  parentKpiRepairs: string;
  parentKpiStreak: string;
  parentTimerSectionTitle: string;
  parentTimerSectionDesc: string;
  parentTimerUnlimited: string;
  parentTimerMinutesOption: (mins: number) => string;
  parentTimerConsumedLabel: string;
  parentTimerRemainingLabel: string;
  parentTimerGraceRuleNote: string;
  parentTimerExtend15Btn: string;
  parentTimerResetTodayBtn: string;
  parentTimerSavedToast: string;
  parentTimerExtendedToast: string;
  parentDiplomasSectionTitle: string;
  parentDiplomasSectionDesc: string;
  parentDiplomaUnlockedStatus: string;
  parentDiplomaLockedStatus: (needed: number) => string;
  parentDiplomaEmptyHint: string;
  parentDiplomaDownloadBtn: string;
  parentDiplomaPrintBtn: string;
  parentDiplomaDownloadedToast: string;
  parentBackupBtn: string;
  parentDiagnosticFooter: (profileCount: number, isOfflineReady: boolean) => string;
  sessionCurtainTitle: string;
  sessionCurtainSubtitle: (profileName: string, completedCount: number) => string;
  sessionCurtainGraceBanner: (secondsLeft: number) => string;
  sessionCurtainParentExtendBtn: string;

  // Lot C1 — Landing page
  landingHeroTitle: string;
  landingHeroCTA: string;
  landingBadgeNoAds: string;
  landingBadgeOffline: string;
  landingBadgeTTS: string;
  landingUniversesTitle: string;
  landingPricingTitle: string;
  landingSchoolTitle: string;
  landingSchoolSubmit: string;
  landingSchoolThanks: string;
  landingBuyBtn: string;
  landingSchoolContact: string;
  landingSchoolPricingTitle: string;

  // License activation modal
  licenseModalTitle: string;
  licenseModalSubtitle: string;
  licenseInputPlaceholder: string;
  licenseActivateBtn: string;
  licenseActivating: string;
  licenseSuccessMsg: string;
  licenseInvalidMsg: string;
  licenseHaveKeyBtn: string;
  licenseTypeLabel: string;
  licenseExpiryLabel: string;
  licenseSeatsLabel: string;
  licenseContactBtn: string;
  licenseTypeClasse: string;
  licenseTypeEcole: string;
  licenseTypeReseau: string;

  // Lot E — Teacher Dashboard (school tier)
  teacherNavBtn: string;
  teacherDashboardTitle: string;
  teacherDashboardSubtitle: (org: string) => string;
  closeTeacherDashboardAria: string;
  teacherStudentsTitle: string;
  teacherNoStudents: string;
  teacherStagesLabel: (completed: number, total: number) => string;
  teacherStreakLabel: (days: number) => string;
  teacherBadgesLabel: (count: number) => string;
  teacherExportPdfBtn: string;
  teacherLicenseSectionTitle: string;
  teacherLicenseSectionDesc: string;
  teacherLicenseKeyPlaceholder: string;
  teacherActivateBtn: string;
  teacherLicenseInvalidMsg: string;
  teacherLicenseActivatedToast: string;
  teacherSchoolLabel: string;
  teacherClassCodeTitle: string;
  teacherClassCodeDesc: string;
  teacherClassCodeCopied: string;
  teacherClassCodeGenerate: string;
  teacherMissionsTitle: string;
  teacherMissionsDesc: string;
  teacherProgressGridTitle: string;
  teacherProgressNotStarted: string;
  teacherProgressInProgress: string;
  teacherProgressDone: string;
  teacherProgressError: string;

}

export const UI_TRANSLATIONS: Record<LanguageCode, UIStrings> = {
  fr: {
    appName: 'Octo Gears',
    navAriaLabel: 'Navigation principale et styles 3D',
    stagesBtn: 'Stages & Sauvegarde',
    styleWood: 'Bois & Métal',
    styleWoodShort: 'Bois',
    styleBlocks: 'Blocs Modulaires',
    styleBlocksShort: 'Blocs',
    styleRealistic: 'Maquette Réaliste',
    styleRealisticShort: 'Réaliste',
    styleComics: 'Style Comics',
    styleComicsShort: 'Comics',
    discoveryBtn: 'Fiche Découverte',
    hintBtn: 'Indice Mécanique',
    langSwitchAria: 'Choisir la langue',
    dockAriaLabel: 'Établi des pièces et commandes 3D',
    openWorkbench: (placed, total) => `Ouvrir l'établi (${placed}/${total})`,
    collapseWorkbench: "Réduire l'établi",
    shortcutH: 'Raccourci clavier : H',
    stageOf: (num, total) => `Stage ${num} sur ${total}`,
    partsCounter: (placed, total) => `Pièces : ${placed} / ${total}`,
    nextStageBtn: 'Stage suivant',
    dragInstruction:
      'Glisse une pièce vers sa silhouette guide 3D (ou clique dessus puis sur le modèle)',
    partStatusPlaced: 'Fixée',
    partStatusLockedAfter: (depName) => `Après : ${depName}`,
    partStatusHinted: 'Pièce conseillée',
    partStatusReady: 'Prête à assembler',
    explodedViewLabel: 'Vue éclatée :',
    cameraAnglesAria: 'Angles de caméra',
    camIso: 'Vue 3/4',
    camFront: 'Face',
    camSide: 'Profil',
    camTop: 'Dessus',
    guideBtn: 'Guide',
    guideBtnTitle: 'Relancer le tour du propriétaire',
    soundMuted: 'Muet',
    soundActive: 'Son',
    muteAria: 'Couper le son',
    unmuteAria: 'Activer le son',
    undoBtn: 'Annuler',
    recenterBtn: 'Recentrer',
    swUpdateAvailable: 'Nouvelle version prête à installer.',
    swUpdateBtn: 'Mettre à jour',
    octoCongratulations: 'Bravo, montage terminé !',
    resetBtn: 'Recommencer',
    autoSavedBadge: 'Sauvegarde auto',
    stageResetMsg: (vehicleName) => `Établi remis à zéro pour ${vehicleName}.`,
    partSnappedMsg: (partName, roleHint) => `✓ ${partName} assemblée ! ${roleHint}`,
    placeFirstMsg: (missingName, partName) =>
      `Pose d'abord « ${missingName} » avant d'installer « ${partName} ».`,
    partStagedMsg: (partName) =>
      `« ${partName} » prête : clique sur sa silhouette lumineuse ou glisse-la sur le plateau !`,
    dragReleaseToSnap: (partName) => `✓ Relâche pour fixer : ${partName}`,
    dragPlaceFirst: (missingName) => `Pose d'abord : ${missingName}`,
    dragApproachGuide: (partName) => `Approche « ${partName} » de sa silhouette guide`,
    dropRejectedMissingDep: (missingName, partName) =>
      `Astuce mécanique : installe d'abord « ${missingName} » avant de fixer « ${partName} » !`,
    webglResetTitle: "Réinitialisation de l'atelier 3D",
    webglResetDesc: "L’affichage 3D s’est interrompu. Attends un instant ou recharge l’atelier pour reprendre ta construction.",
    webglRetryBtn: 'Recharger l’atelier',
    trayPositionBottom: 'Pièces en bas',
    trayPositionStart: 'Pièces au début',
    trayPositionEnd: 'Pièces à la fin',
    progressSavedToast: 'Progression enregistrée localement sur cet appareil.',
    progressImportedToast: 'Sauvegarde restaurée avec succès !',
    progressImportErrorToast: 'Fichier de sauvegarde invalide.',
    progressResetToast: 'Toute la progression a été réinitialisée.',
    catalogTitle: "Catalogue des ateliers & sauvegarde",
    discoveryObservationTitle: '2. Observe ton montage',
    discoveryModelBadge: 'Comprendre et observer un modèle simplifié',
    catalogSubtitle: "Des modèles répartis en cinq paliers de difficulté · Sauvegarde automatique sur cet appareil.",
    closeCatalogAria: 'Fermer le catalogue',
    filterAll: "Tous",
    filterCars: 'Route & Rail',
    filterBoats: 'Mer & Abysses',
    filterPlanes: 'Air & Drones',
    filterConstruction: 'Chantier & Agri',
    filterSpace: 'Espace & Robots',
    filterAerospace: 'Aérospatiale',
    filterElectronics: 'Électronique',
    filterChemistry: 'Chimie',
    filterPhysics: 'Physique',
    filterNature: 'Vivant et Terre',
    filterHistory: 'Histoire',
    trayTools: 'Réglages des pièces',
    hudTools: 'Réglages de l’atelier',
    trayShowAll: 'Toutes les pièces',
    trayShowReady: 'Pièces disponibles',
    allTiersLabel: 'Tous les paliers',
    tierPillLabel: (tier) => `Palier ${tier}`,
    searchPlaceholder: 'Rechercher un véhicule, train, fusée, pelleteuse...',
    clearSearchLabel: 'Effacer',
    noStagesMatch: 'Aucun objet ne correspond à ta recherche.',
    showingCountLabel: (shown, total) => `${shown} sur ${total} objets affichés`,
    tierCatalogSummary: (first, last, min, max) => `Stages ${first}–${last} · ${min}–${max} pièces`,
    freeAccessActive: 'Accès libre activé',
    unlockAllBtn: "Tout débloquer",
    unlockAllTitle: "Permet d’essayer tous les modèles (accès parents / enseignants)",
    tier1Title: '01. Palier Découverte — Premiers Assemblages',
    tier1Subtitle: "Silhouettes et aide au placement.",
    tier2Title: '02. Palier Atelier — Mécanismes par Couches',
    tier2Subtitle: "Montage guidé des connexions.",
    tier3Title: '03. Palier Ingénieur — Grandes Constructions',
    tier3Subtitle: "Assemblages progressifs et nouvelles notions.",
    tier4Title: '04. Palier Expert — Architectures Complexes',
    tier4Subtitle: "Assemblages à plusieurs étapes.",
    tier5Title: '05. Palier Maître Constructeur — Défis Ultimes',
    tier5Subtitle: "Défis complets à explorer.",
    catCar: 'Route & Rail',
    catBoat: 'Mer & Abysses',
    catPlane: 'Air & Aviation',
    catConstruction: 'Chantier & Agri',
    catSpace: 'Espace & Robots',
    stageLabel: (num) => `Stage ${num}`,
    partsCountLabel: (count) => `${count} pièces`,
    statusCompleted: 'Terminé',
    statusCurrentActive: 'Niveau actuel',
    statusInProgress: (placed, total) => `En cours (${placed}/${total})`,
    statusBuild: 'Construire',
    unlockRequirement: (stagesNeeded) => `Gagne ${stagesNeeded} stages`,
    savePanelTitle: 'Sauvegarde locale (LocalStorage)',
    savePanelDesc: (completed, total, stars, maxStars) =>
      `${completed}/${total} véhicules terminés · ${stars}/${maxStars} étoiles · Reprise automatique au redémarrage`,
    saveNowBtn: 'Sauvegarder',
    exportSaveBtn: 'Exporter (.json)',
    importSaveBtn: 'Importer',
    resetAllBtn: 'Effacer la sauvegarde',
    confirmResetBtn: 'Confirmer la remise à zéro',
    cancelResetBtn: 'Annuler',
    mechanicDrawerAria: 'Guide mécanique Mécano Léo',
    mechanicTitle: 'Guide Mécanique',
    mechanicSubtitle: "Ordre de montage & rôle de chaque pièce (100 % hors-ligne)",
    closeMechanicAria: 'Fermer le guide mécanique',
    nextStepBannerReady: 'Besoin d’un coup de pouce sur la prochaine pièce à poser ?',
    nextStepBannerDone: 'Toutes les pièces sont assemblées !',
    highlightOn3DBtn: 'Montrer sur le modèle 3D',
    recommendedNextTitle: 'Prochaine pièce conseillée',
    allPartsChecklistTitle: 'Plan de montage complet du véhicule',
    vehicleCompletedCongrats: (vehicleName) =>
      `Bravo ! ${vehicleName} est entièrement assemblé. Tu peux utiliser le curseur « Vue éclatée » pour observer chaque sous-ensemble mécanique.`,
    discoveryCompletedTitle: (vehicleName) => `Bravo ! ${vehicleName} est prêt à partir !`,
    discoveryPreviewTitle: (vehicleName) => `Fiche Découverte : ${vehicleName}`,
    closeDiscoveryAria: 'Fermer la fiche découverte',
    discoveryLockedTitle: "Termine l'assemblage pour débloquer les secrets du monde réel !",
    discoveryLockedDesc: (partsCount, vehicleName) =>
      `Dès que tu auras fixé les ${partsCount} pièces de « ${vehicleName} », tu découvriras comment fonctionne le véritable engin, ses records et ses anecdotes.`,
    discoveryBadgeLocal: 'Encyclopédie Mécanique — Faits réels vérifiés',
    howItWorksTitle: '1. Comment ça marche en vrai',
    realRecordTitle: '2. Un record ou chiffre réel',
    didYouKnowTitle: '3. Le savais-tu ?',
    admire3DBtn: 'Admirer le modèle en 3D',
    goToNextStageBtn: 'Passer au stage suivant',
    tourAriaLabel: 'Tour du propriétaire — Tutoriel guidé',
    tourKicker: 'Tour du propriétaire',
    tourStepCounter: (current, total) => `Étape ${current} sur ${total}`,
    closeTourAria: 'Fermer le tutoriel',
    tourSkipBtn: 'Passer le guide',
    tourPrevBtn: 'Précédent',
    tourNextBtn: 'Suivant',
    tourPlayNowBtn: 'Jouer maintenant',
    tourSilhouetteLabel: (partName) => `Silhouette : ${partName}`,
    tourSnappedBadge: 'Aimanté !',
    tourDragUpLabel: (partName) => `Glisse « ${partName} » vers le haut`,
    tourGreatFirstSnap: (vehicleName) =>
      `Super ! Tu viens déjà d’assembler ta première pièce sur ${vehicleName} !`,
    tourRotateHint: 'Astuce : fais pivoter le plateau 3D pour voir l’arrière du véhicule !',
    tourSteps: [
      {
        title: '01. Repère tes pièces dans l’établi',
        description:
          'Toutes les pièces détachées du véhicule sont rangées ici en bas. Commence toujours par une pièce marquée « Prête à assembler » (la structure porteuse de base).',
        tip: 'Les pièces avec un cadenas se débloquent automatiquement dès que leur support est posé.',
      },
      {
        title: '02. Glisse et aimante sur la silhouette 3D',
        description:
          'Maintiens le clic (ou ton doigt) sur une pièce de l’établi et fais-la glisser vers la silhouette lumineuse au centre du plateau. Dès qu’elle devient verte, relâche pour la fixer !',
        tip: 'Tu peux essayer tout de suite avec la première pièce, ou cliquer sur la carte puis sur la silhouette.',
      },
      {
        title: '03. Tourne autour du modèle & Vue éclatée',
        description:
          'Fais glisser l’arrière-plan 3D pour observer ton véhicule sous tous les angles, choisis une vue caméra rapide ou utilise le curseur « Vue éclatée » pour inspecter le mécanisme.',
        tip: 'Ton avancement est sauvegardé automatiquement : tu reprendras sur ce même niveau au prochain démarrage.',
      },
      {
        title: '04. Styles 3D, Langues & Indice Mécanique',
        description:
          'En haut, bascule à tout moment entre Bois, Blocs et Maquette Réaliste, change la langue (FR / EN / العربية), relève le Défi du Jour ou clique sur « Indice Mécanique » !',
        tip: 'Une fiche découverte complète se débloque dès que le véhicule est terminé.',
      },
    ],
    openProgressionBtn: (unlocked, total) => `Badges & Progression (${unlocked}/${total})`,
    progressionModalTitle: 'Tableau de Progression & Badges de Réussite',
    progressionModalSubtitle:
      'Gagne des étoiles sur chaque niveau et assemble sans erreur pour débloquer tous les titres d’atelier.',
    closeProgressionAria: 'Fermer la fenêtre de progression',
    backToCatalogBtn: 'Retour au catalogue des stages',
    rankLabel: 'Rang mécanique actuel',
    maxRankReached: 'Rang maximal atteint — Félicitations !',
    kpiStarsLabel: 'Score d’étoiles',
    kpiCompletedLabel: 'Véhicules terminés',
    kpiPerfectLabel: 'Sans faute (3★)',
    kpiBadgesLabel: 'Badges obtenus',
    familyScoresTitle: 'Scores par famille de véhicules',
    badgesSectionTitle: 'Collection des Badges de Réussite',
    badgeFilterAll: (count) => `Tous (${count})`,
    badgeFilterUnlocked: (count) => `Débloqués (${count})`,
    badgeFilterLocked: (count) => `À débloquer (${count})`,
    badgeUnlockedLabel: 'Débloqué',
    badgeLockedLabel: 'En progression',
    newBadgesUnlockedBannerTitle: (count) =>
      count > 1 ? 'Nouveaux badges de réussite débloqués !' : 'Nouveau badge de réussite débloqué !',
    viewAllBadgesBtn: 'Voir tous mes badges',
    dailyNavBtn: 'Défi du Jour',
    dailyCompletedShort: 'Réussi',
    dailyBonusStageLabel: 'Défi Mécanique du Jour',
    returnToStagesBtn: 'Retour aux stages',
    rarePartCardLabel: 'Pièce Rare Or 24K',
    dailyModalTitle: 'Défi Mécanique du Jour',
    dailyModalSubtitle:
      'Chaque jour avant minuit, assemble un prototype bonus éphémère pour remporter sa pièce rare de collection en alliage d’or !',
    closeDailyAria: 'Fermer le défi du jour',
    dailyResetInLabel: 'Nouveau véhicule dans',
    dailyStreakLabel: 'Série quotidienne',
    dailyStreakValue: (days) => (days > 1 ? `${days} jours` : `${days} jour`),
    dailyBestStreakLabel: (days) => `Record : ${days} j`,
    dailyRareVaultKpiLabel: 'Pièces rares obtenues',
    dailyTodayVehicleSection: 'Prototype Bonus Éphémère du Jour',
    dailyRareSpotlightLabel: 'Pièce Rare incluse sur ce modèle',
    dailyPlayBtn: 'Assembler le véhicule du jour',
    dailyReplayBtn: 'Rejouer le prototype du jour',
    dailyActiveNowBtn: 'En cours sur l’établi 3D',
    dailyVaultTitle: 'Vitrine des 7 Pièces Rares d’Atelier',
    dailyVaultSubtitle: (collected, total) =>
      `${collected} sur ${total} pièces rares débloquées · Reviens chaque jour pour compléter la collection`,
    dailyVaultCollectedStatus: 'Dans ta vitrine',
    dailyVaultLockedStatus: 'Rotation quotidienne',
    dailyCatalogBannerTitle: 'Défi Mécanique du Jour disponible !',
    dailyCatalogBannerCta: 'Voir le Défi & les Pièces Rares',
    dailyRareUnlockedBannerTitle: 'Pièce Rare du Jour ajoutée à ta vitrine !',
    openDailyVaultBtn: 'Ouvrir la vitrine des pièces rares',
    timerToggleBtn: 'Chrono',
    timerActiveLabel: 'Chrono ON',
    timerOffLabel: 'Chrono OFF',
    timerEnabledToast:
      'Mode Chronomètre activé : le chrono démarre dès ta première pièce manipulée !',
    timerDisabledToast: 'Mode Chronomètre désactivé.',
    personalBestShort: (formatted) => `Record : ${formatted}`,
    leaderboardNavBtn: 'Chronos',
    leaderboardTitle: 'Mode Chronomètre & Classement Local',
    leaderboardSubtitle:
      'Optionnel pour les joueurs avancés : mesure ta vitesse d’assemblage et compare tes meilleurs temps sur cet appareil.',
    closeLeaderboardAria: 'Fermer le classement chronomètre',
    timerModeSwitchTitle: 'Mode Chronomètre en direct',
    timerModeSwitchDesc:
      'Démarre à la 1re pièce manipulée, se met en pause dans les menus et enregistre automatiquement tes records.',
    timerEnableAction: 'Activer le Chronomètre',
    timerDisableAction: 'Désactiver le Chronomètre',
    leaderboardKpiRuns: 'Chronos enregistrés',
    leaderboardKpiFastest: 'Meilleur temps absolu',
    leaderboardKpiBestPace: 'Cadence record',
    leaderboardTabStageRecords: (count) => `Records par véhicule (${count})`,
    leaderboardTabTopRuns: (count) => `Journal des meilleurs temps (${count})`,
    leaderboardColRank: '#',
    leaderboardColVehicle: 'Véhicule & Palier',
    leaderboardColTime: 'Temps',
    leaderboardColPace: 'Cadence',
    leaderboardColPrecision: 'Précision',
    leaderboardColAction: 'Défi vitesse',
    leaderboardBeatTimeBtn: 'Battre ce temps',
    leaderboardTimeAttackCurrentBtn: 'Chronométrer le niveau actuel',
    leaderboardEmptyTitle: 'Aucun temps enregistré pour le moment',
    leaderboardEmptyDesc:
      'Active le mode Chronomètre et termine un assemblage complet pour inscrire ton premier record local !',
    leaderboardStartFirstRunBtn: 'Lancer un assemblage chronométré maintenant',
    clearLeaderboardBtn: 'Effacer les chronos',
    confirmClearLeaderboardBtn: 'Confirmer la suppression des temps',
    discoveryTimerCardTitle: 'Temps officiel en Mode Chronomètre',
    discoveryNewRecordTag: 'Nouveau Record Personnel !',
    discoveryPreviousBestLabel: (prevTime, delta) => `Ancien record : ${prevTime} (${delta})`,
    openLeaderboardBtn: 'Voir le classement des temps',
    retryTimedRunBtn: 'Rejouer contre le chrono',
    profilesNavBtn: 'Profils',
    profilesModalTitle: 'Profils Mécaniciens, Voix & Mode Hors-Ligne',
    profilesModalSubtitle:
      'Chaque enfant dispose de sa propre sauvegarde sur cet appareil, avec lecture vocale trilingue et installation hors-ligne.',
    closeProfilesAria: 'Fermer la gestion des profils',
    profilesListTitle: (count, max) => `Profils locaux sur cet appareil (${count}/${max})`,
    profileActiveTag: 'Profil actif',
    profileSwitchBtn: 'Choisir',
    profileStatsLine: (completed, total, stars, badges) =>
      `${completed}/${total} véhicules · ${stars} ★ · ${badges} badges`,
    profileNewBtn: 'Nouveau profil',
    profileMaxReached: (max) => `Limite de ${max} profils locaux atteinte.`,
    profileNameLabel: 'Prénom ou surnom du constructeur',
    profileNamePlaceholder: 'Ex : Léo, Yasmine, Atelier CE1...',
    profileColorLabel: 'Couleur d’établi',
    profileIconLabel: 'Emblème mécanique',
    profileCreateSubmit: 'Créer et activer ce profil',
    profileEditBtn: 'Renommer',
    profileSaveEditBtn: 'Enregistrer',
    profileDeleteBtn: 'Supprimer',
    profileConfirmDeleteBtn: 'Confirmer suppression',
    profileSwitchedToast: (name) => `Bienvenue sur l’établi de ${name} !`,
    profileCreatedToast: (name) => `Profil « ${name} » créé et activé !`,
    profileDeletedToast: (name) => `Profil « ${name} » supprimé.`,
    voiceSectionTitle: 'Synthèse Vocale Éducative (Web Speech)',
    voiceSectionDesc:
      'Lit à voix haute les indices mécaniques, le tutoriel et les fiches découvertes en Français, Anglais ou Arabe sans Internet.',
    voiceAutoReadLabel: 'Lecture vocale automatique des pièces',
    voiceAutoReadDesc:
      'Énonce automatiquement le nom et le rôle mécanique d’une pièce lorsqu’on la sélectionne ou qu’on la fixe.',
    voiceTestBtn: 'Tester la voix',
    voiceTestSample:
      'Bonjour jeune ingénieur ! Prêt à assembler ton prochain véhicule mécanique en trois dimensions ?',
    voiceListenBtn: 'Écouter',
    voiceStopBtn: 'Arrêter',
    voiceReadFullCardBtn: 'Écouter toute la fiche',
    voiceAutoToggleShort: 'Voix auto',
    voiceAutoEnabledToast: 'Lecture vocale automatique activée.',
    voiceAutoDisabledToast: 'Lecture vocale automatique désactivée.',
    replayInstructionAria: 'Réécouter la dernière consigne',
    voiceUnsupportedLabel: 'Synthèse vocale non prise en charge sur ce navigateur.',
    pwaSectionTitle: 'Application Hors-Ligne (PWA)',
    pwaSectionDesc:
      'Installe Octo Gears sur ton écran d’accueil ou ton bureau Windows pour jouer en plein écran sans connexion Internet.',
    pwaInstallBtn: 'Installer Octo Gears sur cet appareil',
    pwaInstallShortBtn: 'Installer',
    pwaInstalledLabel: 'Application installée · Prête hors-ligne',
    pwaOnlineReadyLabel: 'Cache hors-ligne actif · Jouable sans réseau',
    pwaOfflineActiveBanner: 'Mode hors-ligne actif — Sauvegarde locale garantie',
    pwaIosGuideTitle: 'Installer sur iPhone ou iPad (Safari)',
    pwaIosStep1: '1. Appuie sur le bouton Partager dans la barre d’outils Safari.',
    pwaIosStep2: '2. Fais défiler et choisis « Sur l’écran d’accueil ».',
    pwaCloseGuideBtn: 'Compris',
    testDriveBtn: 'Essai 3D',
    testDriveActiveBtn: 'Arrêter l’essai',
    testDriveStartedToast: (vehicleName) =>
      `Essai dynamique 3D lancé pour ${vehicleName} !`,
    testDriveStoppedToast: 'Essai dynamique 3D terminé.',
    xRayBtn: 'Rayons X',
    xRayActiveBtn: 'Rayons X ON',
    xRayTitle: 'Coupe technique translucide pour observer les organes mécaniques internes',
    xRayEnabledToast: 'Mode Rayons X activé : coque translucide et organes internes visibles.',
    xRayDisabledToast: 'Mode Rayons X désactivé.',
    envThematicBtn: 'Décor Thème',
    envStudioBtn: 'Décor Studio',
    envSwitchTitle: 'Alterner entre le plateau thématique (circuit, port, piste, chantier, pas de tir) et l’établi classique',
    envThematicToast: 'Environnement d’établi thématique activé.',
    envStudioToast: 'Établi studio classique activé.',
    studioBtn: 'Peinture & Photo',
    studioModalTitle: 'Cabine de Peinture & Carte Postale 3D',
    studioModalSubtitle:
      'Personnalise la livrée de ton véhicule et photographie ta création en haute définition.',
    closeStudioAria: 'Fermer la cabine de peinture et le studio photo',
    studioPaintSectionTitle: 'Cabine de Peinture & Finitions d’Atelier',
    studioPaintSectionDesc:
      'Choisis une teinte d’atelier mémorisée automatiquement pour ce véhicule (les pièces rares Or 24K conservent leur éclat).',
    liveryAppliedToast: (liveryLabel) => `Peinture « ${liveryLabel} » appliquée et mémorisée !`,
    studioPhotoSectionTitle: 'Studio Photo — Carte Postale Souvenir 3D',
    studioPhotoSectionDesc:
      'Capture instantanément le rendu 3D actuel avec ton profil, tes étoiles et ton meilleur chrono en image PNG.',
    capturePostcardBtn: 'Capturer la carte postale 3D',
    retakePostcardBtn: 'Actualiser la prise de vue',
    downloadPostcardBtn: 'Télécharger en PNG',
    postcardDownloadedToast: 'Carte postale 3D téléchargée en PNG !',
    workshopThemeSectionTitle: 'Mon Atelier — Sol & Ambiance',
    workshopThemeSectionDesc: 'Personnalise le sol de ton atelier. Le changement est mémorisé dans ton profil.',
    groundAsphalt: 'Asphalte',
    groundGrass: 'Herbe',
    groundSand: 'Sable',
    groundSnow: 'Neige',
    groundCircuit: 'Circuit',
    groundLightWood: 'Bois clair',
    groundMoon: 'Lune',
    groundWater: 'Eau',
    garageNavBtn: 'Ma Vitrine',
    garageModalTitle: 'Garage Personnel — Ma Vitrine 3D',
    garageModalSubtitle:
      'Retrouve tous tes véhicules construits avec leurs peintures personnalisées, tes Brevets d’Ingénieur et tes 7 pièces rares Or 24K.',
    closeGarageAria: 'Fermer la vitrine 3D',
    garageKpiVehicles: 'Véhicules exposés',
    garageKpiPatents: 'Brevets d’Ingénieur',
    garageKpiRepairs: 'Missions réparation',
    garageKpiRareVault: 'Pièces rares Or 24K',
    garageTabVehicles: (count) => `Mes Véhicules Construits (${count})`,
    garageTabRareVault: (collected, total) => `Pièces Rares Or 24K (${collected}/${total})`,
    garageEmptyTitle: 'Ta vitrine attend son premier véhicule !',
    garageEmptyDesc:
      'Termine n’importe quel stage sur l’établi 3D pour exposer ta création ici, la repeindre et lancer un essai dynamique.',
    garageLoadBtn: 'Exposer sur l’établi',
    garageTestDriveBtn: 'Essai 3D direct',
    garagePatentTag: 'Breveté',
    garageRepairedTag: (count) => `Réparé ${count}×`,
    garageMasterTag: 'Sans silhouette',
    noSilhouetteBtn: 'Sans silhouette',
    noSilhouetteActiveBtn: 'Maître ON',
    noSilhouetteTitle:
      'Difficulté Grand Ingénieur : masque les silhouettes guides translucides pour déduire le montage par pure logique mécanique',
    noSilhouetteEnabledToast:
      'Mode Maître Sans Silhouette activé : déduis l’emplacement exact de chaque pièce !',
    noSilhouetteDisabledToast: 'Silhouettes guides 3D réactivées.',
    quizOpenBtn: 'Quiz Brevet',
    quizPassedBtn: 'Brevet obtenu',
    quizModalTitle: (vehicleName) => `Mini-Quiz Mécanique : ${vehicleName}`,
    quizModalSubtitle:
      'Réponds aux 3 questions sur l’assemblage et le fonctionnement réel pour décrocher le Brevet d’Ingénieur de cet engin !',
    closeQuizAria: 'Fermer le mini-quiz mécanique',
    quizQuestionCounter: (current, total) => `Question ${current} sur ${total}`,
    quizNextQuestionBtn: 'Question suivante',
    quizSeeResultsBtn: 'Voir mon résultat',
    quizRetryBtn: 'Retenter le quiz',
    quizScoreTitle: (score, total) => `Score obtenu : ${score} / ${total}`,
    quizPatentEarnedTitle: 'Sceau « Brevet d’Ingénieur » décerné !',
    quizPatentEarnedDesc: (vehicleName) =>
      `Félicitations ! Tu maîtrises l’architecture et les secrets mécaniques de « ${vehicleName} ».`,
    quizAlmostTitle: 'Presque ! Relis les indices et réessaie',
    quizAlmostDesc:
      'Obtiens au moins 2 bonnes réponses sur 3 pour valider ton Brevet d’Ingénieur sur ce modèle.',
    diagnosticBtn: 'Réparation',
    diagnosticActiveBanner: (faultyLeft, missingLeft) =>
      faultyLeft > 0
        ? `Diagnostic : clique sur ${faultyLeft} pièce(s) orange mal montée(s) sur le modèle 3D, puis remonte ${missingLeft} pièce(s) !`
        : `Réparation : remonte les ${missingLeft} pièce(s) manquante(s) depuis l’établi pour remettre l’engin en état !`,
    diagnosticQuitBtn: 'Quitter réparation',
    diagnosticStartedToast: (vehicleName, issues) =>
      `Mission Diagnostic sur ${vehicleName} : ${issues} anomalies mécaniques à corriger !`,
    diagnosticExtractedToast: (partName) =>
      `✓ Pièce mal fixée « ${partName} » démontée ! Réinstalle-la proprement depuis l’établi.`,
    diagnosticClickFaultyHint: (partName) =>
      `Démonte d’abord la pièce orange mal fixée « ${partName} » en cliquant dessus sur le modèle 3D !`,
    diagnosticCompletedToast: (vehicleName) =>
      `Diagnostic réussi ! ${vehicleName} est réparé à 100 % et prêt à repartir !`,
    diagnosticTutorialTitle: 'Comment réparer ?',
    diagnosticTutorialStep1: 'Écoute le bruit — ton véhicule a des pièces abîmées ou manquantes.',
    diagnosticTutorialStep2: 'Trouve la pièce — les pièces à problème sont mises en évidence en orange.',
    diagnosticTutorialStep3: "Échange-la — clique dessus pour la démonter, puis remonte-la depuis l’établi.",
    diagnosticTutorialReadyBtn: "C’est parti !",
    streakTopBarTitle: (days, activeToday) =>
      activeToday
        ? `Série quotidienne active : ${days} jour(s) d’affilée`
        : days > 0
          ? `Série de ${days} jour(s) à prolonger aujourd’hui !`
          : 'Commence ta série quotidienne dans l’atelier 3D',
    streakExtendedToast: (days) =>
      `Série quotidienne : ${days} jour${days > 1 ? 's' : ''} d’affilée dans l’atelier !`,
    streakMilestoneUnlockedToast: (days, rewardLabel) =>
      `Palier de série ${days} jours atteint ! Récompense débloquée : ${rewardLabel}`,
    liveryLockedStreakHint: (days) =>
      `Débloque cette finition exclusive en atteignant une série de ${days} jours consécutifs !`,
    streakModalTitle: 'Série Quotidienne & Récompenses',
    streakModalSubtitle:
      'Assemble, répare ou réussis un quiz chaque jour pour faire grandir ta flamme d’atelier et débloquer des récompenses permanentes.',
    closeStreakAria: 'Fermer la fenêtre de série quotidienne',
    streakStatusActiveToday: (days) =>
      `Flamme allumée aujourd’hui ! Tu es à ${days} jour${days > 1 ? 's' : ''} consécutif${days > 1 ? 's' : ''}.`,
    streakStatusKeepAliveToday: (days) =>
      `Ta série de ${days} jour${days > 1 ? 's' : ''} t’attend : fixe une pièce ou répare un véhicule aujourd’hui pour la prolonger !`,
    streakStatusStartToday:
      'Fixe ta première pièce sur l’établi aujourd’hui pour allumer ta série quotidienne !',
    streakCurrentLabel: 'Série actuelle',
    streakBestLabel: 'Meilleure série',
    streakDaysUnit: (days) => `${days} ${days > 1 ? 'jours' : 'jour'}`,
    streakRecentWeekTitle: 'Activité des 7 derniers jours',
    streakTodayTag: 'Auj.',
    streakMilestonesTitle: 'Paliers de Récompenses d’Assiduité',
    streakRewardUnlockedTag: 'Débloqué',
    streakOpenPaintBoothBtn: 'Ouvrir la Cabine de Peinture',
    parentsNavBtn: 'Parents',
    parentsTopBarTitle: 'Espace Parents & Enseignants (protégé par vérification adulte)',
    parentalGateTitle: 'Vérification Adulte — Espace Parents',
    parentalGateSubtitle:
      'Pour protéger la progression et les réglages des enfants, résolvez ce calcul en chiffres :',
    parentalGateInputPlaceholder: 'Votre réponse en chiffres',
    parentalGateVerifyBtn: 'Déverrouiller',
    parentalGateCancelBtn: 'Retour au jeu',
    parentalGateNewChallengeBtn: 'Autre calcul',
    parentalGateIncorrectMsg: (attemptsLeft) =>
      `Réponse incorrecte (${attemptsLeft} essai${attemptsLeft > 1 ? 's' : ''} restant${attemptsLeft > 1 ? 's' : ''}).`,
    parentalGateCooldownMsg: (seconds) =>
      `Trop d’essais erronés. Patientez ${seconds}s avant de réessayer.`,
    parentSpaceTitle: 'Espace Parents & Enseignants',
    parentSpaceSubtitle:
      'Bilan pédagogique STEM, gestion bienveillante du temps d’écran et diplômes officiels imprimables (100 % hors-ligne, zéro donnée enfant collectée).',
    closeParentSpaceAria: 'Fermer l’espace parents',
    parentProfileSelectLabel: 'Profil enfant consulté :',
    parentSwitchActiveBtn: 'Activer sur l’établi',
    parentTabStem: 'Bulletin STEM',
    parentTabTimer: 'Minuteur Bienveillant',
    parentTabDiplomas: 'Diplômes Imprimables',
    parentTabProfile: "Profil d'Age",
    parentTabClassroom: 'Classe',
    parentTabFiches: 'Fiches Péda',
    fichePrintBtn: 'Imprimer cette fiche',
    classroomSilentLabel: 'Mode classe silencieux',
    classroomSilentDesc: 'Coupe tous les sons instantanément (TBI, présentation)',
    tbiModeLabel: 'Mode TBI',
    tbiModeDesc: 'Agrandit les boutons pour les tableaux blancs interactifs',
    volumeSfxLabel: 'Volume effets',
    volumeVoiceLabel: 'Volume voix',
    ageProfileSelectorTitle: "Quel est l'age de l'enfant ?",
    ageProfileSelectorSubtitle: "On adapte l'aide, la tolerance et l'affichage a son niveau.",
    ageProfile57Label: '5 - 7 ans',
    ageProfile57Desc: 'Silhouette visible, pieces plus faciles a accrocher, indices automatiques.',
    ageProfile810Label: '8 - 10 ans',
    ageProfile810Desc: 'Mode equilibre, aide a la demande.',
    ageProfile1112Label: '11 - 12 ans',
    ageProfile1112Desc: 'Pas de silhouette, accrochage precis, defi complet.',
    ageProfileConfirmBtn: 'Valider',
    parentAgeProfileSectionTitle: "Profil d'Age de l'Enfant",
    parentAgeProfileCurrentLabel: 'Profil actuel',
    parentStemOverviewTitle: 'Compétences d’Ingénierie Développées',
    parentStemIndexLabel: 'Indice global de maîtrise STEM',
    parentKpiCompleted: 'Machines assemblées',
    parentKpiPatents: 'Brevets de quiz',
    parentKpiRepairs: 'Pannes résolues',
    parentKpiStreak: 'Meilleure série',
    parentTimerSectionTitle: 'Minuteur d’Atelier Bienveillant',
    parentTimerSectionDesc:
      'Définissez une durée quotidienne maximale sur cet appareil. Aucune coupure brutale : l’enfant peut terminer son assemblage en cours.',
    parentTimerUnlimited: 'Illimité',
    parentTimerMinutesOption: (mins) => `${mins} min / jour`,
    parentTimerConsumedLabel: 'Temps actif aujourd’hui',
    parentTimerRemainingLabel: 'Temps restant aujourd’hui',
    parentTimerGraceRuleNote:
      'Grâce de fin d’assemblage active : si le véhicule en cours est monté à plus de 50 %, jusqu’à 3 minutes supplémentaires sont accordées pour poser la dernière pièce sans frustration.',
    parentTimerExtend15Btn: '+15 min aujourd’hui',
    parentTimerResetTodayBtn: 'Remettre le compteur du jour à 0',
    parentTimerSavedToast: 'Limite quotidienne du minuteur mise à jour.',
    parentTimerExtendedToast: '15 minutes supplémentaires accordées pour aujourd’hui.',
    parentDiplomasSectionTitle: 'Certificats & Diplômes Officiels Imprimables',
    parentDiplomasSectionDesc:
      'Téléchargez en PNG haute définition (format A4 paysage) ou imprimez le diplôme officiel personnalisé au prénom de l’enfant.',
    parentDiplomaUnlockedStatus: 'Acquis',
    parentDiplomaLockedStatus: (needed) => `À ${needed} véhicules`,
    parentDiplomaEmptyHint:
      'Terminez un premier véhicule sur l’établi 3D pour débloquer le Brevet d’Initiation Mécanique personnalisé !',
    parentDiplomaDownloadBtn: 'Télécharger le diplôme (PNG A4)',
    parentDiplomaPrintBtn: 'Imprimer le diplôme',
    parentDiplomaDownloadedToast: 'Diplôme officiel haute définition téléchargé !',
    parentBackupBtn: 'Sauvegarder ce profil (.json)',
    parentDiagnosticFooter: (profileCount, isOfflineReady) =>
      `Octo Gears v1.1 · Lot A · ${profileCount} profil(s) local(aux) · ${isOfflineReady ? 'Prêt hors-ligne' : 'Mode hors-ligne actif'} · 0 % Publicité / 0 % Tracking enfant`,
    sessionCurtainTitle: 'L’atelier ferme ses portes pour aujourd’hui !',
    sessionCurtainSubtitle: (profileName, completedCount) =>
      `Bravo ${profileName} ! Tes outils sont bien rangés et tes ${completedCount} véhicule(s) construit(s) sont sauvegardés pour demain.`,
    sessionCurtainGraceBanner: (secondsLeft) =>
      `Fin de séance proche : il te reste ${secondsLeft}s pour fixer tes dernières pièces sur ce véhicule.`,
    sessionCurtainParentExtendBtn: 'Accès Parent (Prolonger ou régler)',

    landingHeroTitle: 'Construis tes premières machines !',
    landingHeroCTA: 'Essayer gratuitement →',
    landingBadgeNoAds: '0 % Publicité',
    landingBadgeOffline: '100 % Hors-ligne',
    landingBadgeTTS: 'Synthèse vocale FR/EN/AR',
    landingUniversesTitle: '5 univers mécaniques',
    landingPricingTitle: 'Tarifs',
    landingSchoolTitle: 'Votre école est intéressée ?',
    landingSchoolSubmit: 'Envoyer une demande',
    landingSchoolThanks: 'Merci, nous vous contacterons !',
    landingBuyBtn: 'Acheter',
    landingSchoolContact: 'Demander un devis',
    landingSchoolPricingTitle: 'Tarifs école',

    teacherNavBtn: 'Enseignant 🎓',
    teacherDashboardTitle: 'Espace Enseignant',
    teacherDashboardSubtitle: (org: string) => `École : ${org}`,
    closeTeacherDashboardAria: "Fermer l'espace enseignant",
    teacherStudentsTitle: 'Élèves',
    teacherNoStudents: 'Aucun profil élève trouvé.',
    teacherStagesLabel: (c, t) => `${c} / ${t} stages`,
    teacherStreakLabel: (d) => `Série : ${d}j`,
    teacherBadgesLabel: (n) => `${n} badges`,
    teacherExportPdfBtn: 'Exporter PDF',
    teacherLicenseSectionTitle: 'Licence École',
    teacherLicenseSectionDesc: 'Saisissez la clé de licence fournie par votre établissement.',
    teacherLicenseKeyPlaceholder: 'Clé de licence (SK-… ou base64)',
    teacherActivateBtn: 'Activer',
    teacherLicenseInvalidMsg: 'Format de clé invalide. Vérifiez la clé fournie.',
    teacherLicenseActivatedToast: 'Licence école activée avec succès.',
    teacherSchoolLabel: 'École',
    teacherClassCodeTitle: 'Code classe',
    teacherClassCodeDesc: 'Partagez ce code avec vos élèves pour les rattacher à cette classe.',
    teacherClassCodeCopied: 'Copié !',
    teacherClassCodeGenerate: 'Nouveau code',
    teacherMissionsTitle: 'Missions assignées',
    teacherMissionsDesc: 'Choisissez 1 à 3 missions à faire en classe.',
    teacherProgressGridTitle: 'Grille de progression',
    teacherProgressNotStarted: 'Non commencé',
    teacherProgressInProgress: 'En cours',
    teacherProgressDone: 'Terminé',
    teacherProgressError: 'Difficultés',

    licenseModalTitle: 'Activer une clé de licence',
    licenseModalSubtitle: 'Entre ta clé pour débloquer le Pass Famille ou le plan École.',
    licenseInputPlaceholder: 'ex : MK3D-XXXX-XXXX-XXXX',
    licenseActivateBtn: 'Activer',
    licenseActivating: 'Vérification…',
    licenseSuccessMsg: '✓ Licence activée !',
    licenseInvalidMsg: 'Clé invalide ou expirée.',
    licenseHaveKeyBtn: "J'ai déjà une clé",
    licenseTypeLabel: 'Type de licence',
    licenseExpiryLabel: 'Expire le',
    licenseSeatsLabel: 'Postes autorisés',
    licenseContactBtn: 'Contacter pour une licence école',
    licenseTypeClasse: 'Classe',
    licenseTypeEcole: 'École',
    licenseTypeReseau: 'Réseau',

  },

  en: {
    appName: 'Octo Gears',
    navAriaLabel: 'Main navigation and 3D visual styles',
    stagesBtn: 'Stages & Save',
    styleWood: 'Wood & Metal',
    styleWoodShort: 'Wood',
    styleBlocks: 'Modular Blocks',
    styleBlocksShort: 'Blocks',
    styleRealistic: 'Scale Model',
    styleRealisticShort: 'Realistic',
    styleComics: 'Comics Style',
    styleComicsShort: 'Comics',
    discoveryBtn: 'Discovery Card',
    hintBtn: 'Mechanical Hint',
    langSwitchAria: 'Select language',
    dockAriaLabel: 'Parts workbench and 3D controls',
    openWorkbench: (placed, total) => `Open Workbench (${placed}/${total})`,
    collapseWorkbench: 'Collapse Workbench',
    shortcutH: 'Keyboard shortcut: H',
    stageOf: (num, total) => `Stage ${num} of ${total}`,
    partsCounter: (placed, total) => `Parts: ${placed} / ${total}`,
    nextStageBtn: 'Next Stage',
    dragInstruction:
      'Drag a part onto its glowing 3D guide silhouette (or click the card then the model)',
    partStatusPlaced: 'Snapped',
    partStatusLockedAfter: (depName) => `After: ${depName}`,
    partStatusHinted: 'Suggested next',
    partStatusReady: 'Ready to install',
    explodedViewLabel: 'Exploded view:',
    cameraAnglesAria: 'Camera angles',
    camIso: '3/4 View',
    camFront: 'Front',
    camSide: 'Side',
    camTop: 'Top',
    guideBtn: 'Guide',
    guideBtnTitle: 'Replay interactive guided tour',
    soundMuted: 'Muted',
    soundActive: 'Sound',
    muteAria: 'Mute sound',
    unmuteAria: 'Unmute sound',
    undoBtn: 'Undo',
    recenterBtn: 'Recenter',
    swUpdateAvailable: 'A new version is ready to install.',
    swUpdateBtn: 'Update now',
    octoCongratulations: 'Well done, build complete!',
    resetBtn: 'Restart',
    autoSavedBadge: 'Auto-saved',
    stageResetMsg: (vehicleName) => `Workbench reset for ${vehicleName}.`,
    partSnappedMsg: (partName, roleHint) => `✓ ${partName} installed! ${roleHint}`,
    placeFirstMsg: (missingName, partName) =>
      `Install "${missingName}" first before mounting "${partName}".`,
    partStagedMsg: (partName) =>
      `"${partName}" selected: click its glowing silhouette or drag it onto the turntable!`,
    dragReleaseToSnap: (partName) => `✓ Release to snap: ${partName}`,
    dragPlaceFirst: (missingName) => `Install first: ${missingName}`,
    dragApproachGuide: (partName) => `Move "${partName}" closer to its guide silhouette`,
    dropRejectedMissingDep: (missingName, partName) =>
      `Mechanical tip: install "${missingName}" first before attaching "${partName}"!`,
    webglResetTitle: 'Resetting 3D Workshop',
    webglResetDesc: 'The 3D view paused. Wait a moment or reload the workshop to continue building.',
    webglRetryBtn: 'Reload workshop',
    trayPositionBottom: 'Parts at bottom',
    trayPositionStart: 'Parts at start',
    trayPositionEnd: 'Parts at end',
    progressSavedToast: 'Progress saved locally on this device.',
    progressImportedToast: 'Backup file restored!',
    progressImportErrorToast: 'Invalid save backup file.',
    progressResetToast: 'All saved progress has been reset.',
    catalogTitle: "Workshop catalogue & save",
    discoveryObservationTitle: '2. Observe your assembly',
    discoveryModelBadge: 'Understand and observe a simplified model',
    catalogSubtitle: "Models across five difficulty tiers · Automatic local save on this device.",
    closeCatalogAria: 'Close catalog',
    filterAll: "All",
    filterCars: 'Road & Rail',
    filterBoats: 'Sea & Deep Ocean',
    filterPlanes: 'Air & Drones',
    filterConstruction: 'Construction & Farm',
    filterSpace: 'Space & Robotics',
    filterAerospace: 'Aerospace',
    filterElectronics: 'Electronics',
    filterChemistry: 'Chemistry',
    filterPhysics: 'Physics',
    filterNature: 'Life and Earth',
    filterHistory: 'History',
    trayTools: 'Part settings',
    hudTools: 'Workshop settings',
    trayShowAll: 'All parts',
    trayShowReady: 'Available parts',
    allTiersLabel: 'All Tiers',
    tierPillLabel: (tier) => `Tier ${tier}`,
    searchPlaceholder: 'Search a car, train, rocket, excavator, submarine...',
    clearSearchLabel: 'Clear filters',
    noStagesMatch: 'No mechanical models match your search.',
    showingCountLabel: (shown, total) => `Showing ${shown} of ${total} models`,
    tierCatalogSummary: (first, last, min, max) => `Stages ${first}–${last} · ${min}–${max} parts`,
    freeAccessActive: 'Free access active',
    unlockAllBtn: "Unlock all",
    unlockAllTitle: "Try every model (parent / teacher access)",
    tier1Title: '01. Discovery Tier — First Builds',
    tier1Subtitle: "Guide silhouettes and placement help.",
    tier2Title: '02. Workshop Tier — Layered Mechanisms',
    tier2Subtitle: "Guided assembly of connections.",
    tier3Title: '03. Engineer Tier — Heavy Engineering',
    tier3Subtitle: "Progressive builds and new concepts.",
    tier4Title: '04. Expert Tier — Complex Architectures',
    tier4Subtitle: "Multi-step assemblies.",
    tier5Title: '05. Master Builder Tier — Ultimate Machines',
    tier5Subtitle: "Complete challenges to explore.",
    catCar: 'Road & Rail',
    catBoat: 'Sea & Ocean',
    catPlane: 'Air & Aviation',
    catConstruction: 'Construction & Farm',
    catSpace: 'Space & Robotics',
    stageLabel: (num) => `Stage ${num}`,
    partsCountLabel: (count) => `${count} parts`,
    statusCompleted: 'Completed',
    statusCurrentActive: 'Active stage',
    statusInProgress: (placed, total) => `In progress (${placed}/${total})`,
    statusBuild: 'Build now',
    unlockRequirement: (stagesNeeded) => `Complete ${stagesNeeded} stages`,
    savePanelTitle: 'Local Progress Save (LocalStorage)',
    savePanelDesc: (completed, total, stars, maxStars) =>
      `${completed}/${total} vehicles completed · ${stars}/${maxStars} stars · Resumes on your active stage`,
    saveNowBtn: 'Save now',
    exportSaveBtn: 'Export (.json)',
    importSaveBtn: 'Import',
    resetAllBtn: 'Erase save',
    confirmResetBtn: 'Confirm full reset',
    cancelResetBtn: 'Cancel',
    mechanicDrawerAria: 'Mechanical Assembly Guide',
    mechanicTitle: 'Mechanical Guide',
    mechanicSubtitle: 'Assembly order & engineering role of every part (100% offline)',
    closeMechanicAria: 'Close mechanical guide',
    nextStepBannerReady: 'Need a hint on which part to install next?',
    nextStepBannerDone: 'All parts are assembled!',
    highlightOn3DBtn: 'Highlight on 3D model',
    recommendedNextTitle: 'Recommended next part',
    allPartsChecklistTitle: 'Complete vehicle assembly plan',
    vehicleCompletedCongrats: (vehicleName) =>
      `Awesome work! ${vehicleName} is fully assembled. Drag the "Exploded view" slider to inspect every mechanical sub-assembly.`,
    discoveryCompletedTitle: (vehicleName) => `Great job! ${vehicleName} is ready for action!`,
    discoveryPreviewTitle: (vehicleName) => `Discovery Card: ${vehicleName}`,
    closeDiscoveryAria: 'Close discovery card',
    discoveryLockedTitle: 'Finish assembling the vehicle to unlock real-world engineering facts!',
    discoveryLockedDesc: (partsCount, vehicleName) =>
      `Once you snap all ${partsCount} parts of "${vehicleName}", you will unlock how the real machine works, its world records, and fun facts.`,
    discoveryBadgeLocal: 'Mechanical Encyclopedia — Verified Real-World Facts',
    howItWorksTitle: '1. How it works in real life',
    realRecordTitle: '2. Real-world record & numbers',
    didYouKnowTitle: '3. Did you know?',
    admire3DBtn: 'Inspect in 3D',
    goToNextStageBtn: 'Continue to next stage',
    tourAriaLabel: 'Workshop Guided Tour',
    tourKicker: 'Guided Tour',
    tourStepCounter: (current, total) => `Step ${current} of ${total}`,
    closeTourAria: 'Close guided tour',
    tourSkipBtn: 'Skip tour',
    tourPrevBtn: 'Previous',
    tourNextBtn: 'Next',
    tourPlayNowBtn: 'Start building',
    tourSilhouetteLabel: (partName) => `Guide: ${partName}`,
    tourSnappedBadge: 'Snapped!',
    tourDragUpLabel: (partName) => `Drag "${partName}" upward`,
    tourGreatFirstSnap: (vehicleName) =>
      `Awesome! You just snapped your very first part onto ${vehicleName}!`,
    tourRotateHint: 'Tip: drag the 3D background to orbit around the vehicle!',
    tourSteps: [
      {
        title: '01. Pick your parts from the workbench',
        description:
          'All detached parts are lined up in the bottom tray. Always start with a part marked "Ready to install" (the main structural frame or hull).',
        tip: 'Locked parts unlock automatically as soon as their supporting structure is in place.',
      },
      {
        title: '02. Drag & snap onto the 3D guide silhouette',
        description:
          'Press and drag a part from the workbench toward its glowing silhouette on the 3D turntable. When it turns green, release to snap it!',
        tip: 'You can try right now with the first part, or click a card then click its 3D silhouette.',
      },
      {
        title: '03. Orbit camera & Exploded View',
        description:
          'Drag the background to inspect your machine from any angle, pick a quick camera preset, or slide "Exploded view" to study internal mechanisms.',
        tip: 'Your progress saves automatically—reopening the app resumes right on your current stage.',
      },
      {
        title: '04. 3D Styles, Languages & Daily Challenge',
        description:
          'In the top bar, switch anytime between Wood, Blocks, and Scale Model, change language (FR / EN / العربية), try the Daily Challenge, or tap "Mechanical Hint"!',
        tip: 'Completing any vehicle unlocks its illustrated real-world Discovery Card.',
      },
    ],
    openProgressionBtn: (unlocked, total) => `Badges & Progress (${unlocked}/${total})`,
    progressionModalTitle: 'Progression Dashboard & Achievement Badges',
    progressionModalSubtitle:
      'Earn stars across stages and assemble with zero mistakes to unlock every workshop rank and badge.',
    closeProgressionAria: 'Close progression modal',
    backToCatalogBtn: 'Back to stage catalog',
    rankLabel: 'Current mechanical rank',
    maxRankReached: 'Maximum rank achieved — Congratulations!',
    kpiStarsLabel: 'Total star score',
    kpiCompletedLabel: 'Completed vehicles',
    kpiPerfectLabel: 'Flawless (3★)',
    kpiBadgesLabel: 'Unlocked badges',
    familyScoresTitle: 'Star scores by vehicle family',
    badgesSectionTitle: 'Achievement Badges Collection',
    badgeFilterAll: (count) => `All (${count})`,
    badgeFilterUnlocked: (count) => `Unlocked (${count})`,
    badgeFilterLocked: (count) => `In progress (${count})`,
    badgeUnlockedLabel: 'Unlocked',
    badgeLockedLabel: 'In progress',
    newBadgesUnlockedBannerTitle: (count) =>
      count > 1 ? 'New achievement badges unlocked!' : 'New achievement badge unlocked!',
    viewAllBadgesBtn: 'View all badges',
    dailyNavBtn: 'Daily Challenge',
    dailyCompletedShort: 'Done',
    dailyBonusStageLabel: 'Daily Mechanical Challenge',
    returnToStagesBtn: 'Back to stages',
    rarePartCardLabel: '24K Gold Rare Part',
    dailyModalTitle: 'Daily Mechanical Challenge',
    dailyModalSubtitle:
      'Every day before midnight, assemble a temporary bonus prototype to unlock its gleaming 24K gold collector rare part!',
    closeDailyAria: 'Close daily challenge',
    dailyResetInLabel: 'New bonus vehicle in',
    dailyStreakLabel: 'Daily streak',
    dailyStreakValue: (days) => (days === 1 ? '1 day' : `${days} days`),
    dailyBestStreakLabel: (days) => `Best: ${days}d`,
    dailyRareVaultKpiLabel: 'Rare parts collected',
    dailyTodayVehicleSection: "Today's Temporary Bonus Prototype",
    dailyRareSpotlightLabel: 'Collector Rare Part inside this build',
    dailyPlayBtn: "Build today's bonus vehicle",
    dailyReplayBtn: "Replay today's prototype",
    dailyActiveNowBtn: 'Currently on 3D workbench',
    dailyVaultTitle: 'Workshop Rare Parts Vault (7 Collector Pieces)',
    dailyVaultSubtitle: (collected, total) =>
      `${collected} of ${total} rare parts unlocked · Come back daily to complete the full vault`,
    dailyVaultCollectedStatus: 'In your vault',
    dailyVaultLockedStatus: 'Daily rotation',
    dailyCatalogBannerTitle: "Today's Daily Mechanical Challenge is live!",
    dailyCatalogBannerCta: 'Open Challenge & Rare Vault',
    dailyRareUnlockedBannerTitle: "Today's Rare Part added to your vault!",
    openDailyVaultBtn: 'Open Rare Parts Vault',
    timerToggleBtn: 'Timer',
    timerActiveLabel: 'Timer ON',
    timerOffLabel: 'Timer OFF',
    timerEnabledToast:
      'Stopwatch Mode enabled: timer starts on your very first part interaction!',
    timerDisabledToast: 'Stopwatch Mode disabled.',
    personalBestShort: (formatted) => `Best: ${formatted}`,
    leaderboardNavBtn: 'Best Times',
    leaderboardTitle: 'Stopwatch Mode & Local Leaderboard',
    leaderboardSubtitle:
      'Optional for advanced builders: test your assembly speed and track personal best times on this device.',
    closeLeaderboardAria: 'Close best-times leaderboard',
    timerModeSwitchTitle: 'Live Assembly Stopwatch',
    timerModeSwitchDesc:
      'Starts on the 1st part touched, pauses automatically in menus, and saves personal records locally.',
    timerEnableAction: 'Enable Stopwatch',
    timerDisableAction: 'Disable Stopwatch',
    leaderboardKpiRuns: 'Recorded runs',
    leaderboardKpiFastest: 'Fastest overall time',
    leaderboardKpiBestPace: 'Fastest pace',
    leaderboardTabStageRecords: (count) => `Records by vehicle (${count})`,
    leaderboardTabTopRuns: (count) => `Top runs log (${count})`,
    leaderboardColRank: '#',
    leaderboardColVehicle: 'Vehicle & Tier',
    leaderboardColTime: 'Time',
    leaderboardColPace: 'Pace',
    leaderboardColPrecision: 'Precision',
    leaderboardColAction: 'Time Attack',
    leaderboardBeatTimeBtn: 'Beat record',
    leaderboardTimeAttackCurrentBtn: 'Time Attack current stage',
    leaderboardEmptyTitle: 'No stopwatch times recorded yet',
    leaderboardEmptyDesc:
      'Enable Stopwatch Mode and complete any vehicle assembly to post your first local speed record!',
    leaderboardStartFirstRunBtn: 'Start a timed assembly run now',
    clearLeaderboardBtn: 'Clear times',
    confirmClearLeaderboardBtn: 'Confirm clearing leaderboard',
    discoveryTimerCardTitle: 'Official Stopwatch Assembly Time',
    discoveryNewRecordTag: 'New Personal Best!',
    discoveryPreviousBestLabel: (prevTime, delta) => `Previous best: ${prevTime} (${delta})`,
    openLeaderboardBtn: 'Open best-times leaderboard',
    retryTimedRunBtn: 'Retry against the clock',
    profilesNavBtn: 'Profiles',
    profilesModalTitle: 'Builder Profiles, Voice & Offline App',
    profilesModalSubtitle:
      'Each child gets an independent save slot on this device, plus trilingual read-aloud narration and offline installation.',
    closeProfilesAria: 'Close profiles & settings modal',
    profilesListTitle: (count, max) => `Local profiles on this device (${count}/${max})`,
    profileActiveTag: 'Active profile',
    profileSwitchBtn: 'Select',
    profileStatsLine: (completed, total, stars, badges) =>
      `${completed}/${total} vehicles · ${stars} ★ · ${badges} badges`,
    profileNewBtn: 'New profile',
    profileMaxReached: (max) => `Maximum of ${max} local profiles reached.`,
    profileNameLabel: 'Builder name or nickname',
    profileNamePlaceholder: 'E.g., Leo, Maya, Grade 2 Lab...',
    profileColorLabel: 'Workbench color',
    profileIconLabel: 'Mechanical emblem',
    profileCreateSubmit: 'Create & switch to profile',
    profileEditBtn: 'Rename',
    profileSaveEditBtn: 'Save',
    profileDeleteBtn: 'Delete',
    profileConfirmDeleteBtn: 'Confirm delete',
    profileSwitchedToast: (name) => `Switched to ${name}'s workbench!`,
    profileCreatedToast: (name) => `Profile "${name}" created and activated!`,
    profileDeletedToast: (name) => `Profile "${name}" deleted.`,
    voiceSectionTitle: 'Educational Read-Aloud (Web Speech)',
    voiceSectionDesc:
      'Reads mechanical hints, tutorial steps, and real-world Discovery Cards aloud in French, English, or Arabic completely offline.',
    voiceAutoReadLabel: 'Auto-read part hints aloud',
    voiceAutoReadDesc:
      'Automatically speaks each part name and engineering role when selected or snapped onto the vehicle.',
    voiceTestBtn: 'Test voice',
    voiceTestSample:
      'Hello young engineer! Ready to assemble your next three-dimensional mechanical vehicle?',
    voiceListenBtn: 'Listen',
    voiceStopBtn: 'Stop',
    voiceReadFullCardBtn: 'Listen to full card',
    voiceAutoToggleShort: 'Auto Voice',
    voiceAutoEnabledToast: 'Automatic voice narration enabled.',
    voiceAutoDisabledToast: 'Automatic voice narration disabled.',
    replayInstructionAria: 'Replay last instruction',
    voiceUnsupportedLabel: 'Speech synthesis is not supported in this browser.',
    pwaSectionTitle: 'Offline Installable App (PWA)',
    pwaSectionDesc:
      'Install Octo Gears on your home screen or Windows desktop to play fullscreen anywhere without an internet connection.',
    pwaInstallBtn: 'Install Octo Gears on this device',
    pwaInstallShortBtn: 'Install',
    pwaInstalledLabel: 'App installed · Offline ready',
    pwaOnlineReadyLabel: 'Offline cache ready · Playable without internet',
    pwaOfflineActiveBanner: 'Offline mode active — Local save guaranteed',
    pwaIosGuideTitle: 'Install on iPhone or iPad (Safari)',
    pwaIosStep1: '1. Tap the Share button in the Safari toolbar.',
    pwaIosStep2: '2. Scroll down and tap "Add to Home Screen".',
    pwaCloseGuideBtn: 'Got it',
    testDriveBtn: 'Test Drive',
    testDriveActiveBtn: 'Stop Test Drive',
    testDriveStartedToast: (vehicleName) =>
      `3D Dynamic Test Drive engaged for ${vehicleName}!`,
    testDriveStoppedToast: '3D Dynamic Test Drive stopped.',
    xRayBtn: 'X-Ray',
    xRayActiveBtn: 'X-Ray ON',
    xRayTitle: 'Technical cutaway mode: make outer bodywork translucent to inspect internal organs',
    xRayEnabledToast: 'X-Ray Cutaway enabled: outer shell translucent, inner mechanisms visible.',
    xRayDisabledToast: 'X-Ray Cutaway disabled.',
    envThematicBtn: 'Themed Deck',
    envStudioBtn: 'Studio Deck',
    envSwitchTitle: 'Switch between thematic 3D test environment (track, harbor, tarmac, workzone, launchpad) and studio turntable',
    envThematicToast: 'Thematic 3D workbench environment enabled.',
    envStudioToast: 'Classic studio turntable enabled.',
    studioBtn: 'Paint & Photo',
    studioModalTitle: 'Paint Booth & 3D Souvenir Postcard',
    studioModalSubtitle:
      'Repaint your vehicle with custom workshop liveries and snap a high-resolution 3D postcard.',
    closeStudioAria: 'Close paint booth and photo studio',
    studioPaintSectionTitle: 'Workshop Paint Booth & Custom Finishes',
    studioPaintSectionDesc:
      'Pick a custom workshop livery saved automatically for this vehicle (24K Gold rare parts keep their pure gold finish).',
    liveryAppliedToast: (liveryLabel) => `"${liveryLabel}" livery applied and saved!`,
    studioPhotoSectionTitle: '3D Photo Studio — Souvenir Postcard',
    studioPhotoSectionDesc:
      'Capture the live 3D render framed with your builder profile, star rating, and personal best time as a downloadable PNG.',
    capturePostcardBtn: 'Capture 3D Postcard',
    retakePostcardBtn: 'Refresh 3D Snapshot',
    downloadPostcardBtn: 'Download PNG',
    postcardDownloadedToast: '3D Souvenir Postcard downloaded as PNG!',
    workshopThemeSectionTitle: 'My Workshop — Floor & Ambiance',
    workshopThemeSectionDesc: 'Customize your workshop floor. Your choice is saved to your profile.',
    groundAsphalt: 'Asphalt',
    groundGrass: 'Grass',
    groundSand: 'Sand',
    groundSnow: 'Snow',
    groundCircuit: 'Circuit',
    groundLightWood: 'Light Wood',
    groundMoon: 'Moon',
    groundWater: 'Water',
    garageNavBtn: 'My Garage',
    garageModalTitle: 'Personal 3D Garage & Showcase',
    garageModalSubtitle:
      'Browse your completed fleet with custom liveries, Engineering Patents, repair seals, and 24K Gold rare collector parts.',
    closeGarageAria: 'Close personal garage',
    garageKpiVehicles: 'Completed fleet',
    garageKpiPatents: 'Engineering Patents',
    garageKpiRepairs: 'Completed repairs',
    garageKpiRareVault: '24K Gold rare parts',
    garageTabVehicles: (count) => `My Built Vehicles (${count})`,
    garageTabRareVault: (collected, total) => `24K Gold Rare Vault (${collected}/${total})`,
    garageEmptyTitle: 'Your showcase awaits its first build!',
    garageEmptyDesc:
      'Complete any vehicle on the 3D workbench to display it here, customize its paint, and launch a 3D Test Drive.',
    garageLoadBtn: 'Load on workbench',
    garageTestDriveBtn: 'Instant Test Drive',
    garagePatentTag: 'Patented',
    garageRepairedTag: (count) => `Repaired ${count}×`,
    garageMasterTag: 'No-Silhouette',
    noSilhouetteBtn: 'No Silhouette',
    noSilhouetteActiveBtn: 'Master ON',
    noSilhouetteTitle:
      'Grand Engineer difficulty: hides translucent 3D guide silhouettes so you deduce placement purely by mechanical logic',
    noSilhouetteEnabledToast:
      'Master Silhouette-Free Mode enabled: deduce every attachment point!',
    noSilhouetteDisabledToast: '3D guide silhouettes restored.',
    quizOpenBtn: 'Patent Quiz',
    quizPassedBtn: 'Patent Earned',
    quizModalTitle: (vehicleName) => `3-Question Engineering Quiz: ${vehicleName}`,
    quizModalSubtitle:
      'Answer 3 quick questions on assembly logic and real-world physics to earn this machine’s Engineering Patent!',
    closeQuizAria: 'Close mechanical quiz',
    quizQuestionCounter: (current, total) => `Question ${current} of ${total}`,
    quizNextQuestionBtn: 'Next question',
    quizSeeResultsBtn: 'See my score',
    quizRetryBtn: 'Retry quiz',
    quizScoreTitle: (score, total) => `Your score: ${score} / ${total}`,
    quizPatentEarnedTitle: '"Engineering Patent" Seal Awarded!',
    quizPatentEarnedDesc: (vehicleName) =>
      `Congratulations! You mastered the structural logic and real-world mechanics of "${vehicleName}".`,
    quizAlmostTitle: 'Almost there! Review the hints and try again',
    quizAlmostDesc:
      'Score at least 2 out of 3 correct answers to earn your official Engineering Patent for this vehicle.',
    diagnosticBtn: 'Repair Mode',
    diagnosticActiveBanner: (faultyLeft, missingLeft) =>
      faultyLeft > 0
        ? `Diagnostic: click ${faultyLeft} orange misaligned part(s) on the 3D model to extract them, then reinstall ${missingLeft} part(s)!`
        : `Repair: reinstall the ${missingLeft} detached part(s) from the tray to restore full operation!`,
    diagnosticQuitBtn: 'Exit repair',
    diagnosticStartedToast: (vehicleName, issues) =>
      `Diagnostic Mission on ${vehicleName}: ${issues} mechanical faults to fix!`,
    diagnosticExtractedToast: (partName) =>
      `✓ Loosened part "${partName}" extracted! Now snap it back cleanly from the tray.`,
    diagnosticClickFaultyHint: (partName) =>
      `First click the orange misaligned part "${partName}" on the 3D model to remove it!`,
    diagnosticCompletedToast: (vehicleName) =>
      `Diagnostic complete! ${vehicleName} is 100% repaired and ready for action!`,
    diagnosticTutorialTitle: 'How to repair?',
    diagnosticTutorialStep1: 'Listen for the noise — your vehicle has broken or missing parts.',
    diagnosticTutorialStep2: 'Find the part — faulty parts are highlighted in orange.',
    diagnosticTutorialStep3: 'Swap it out — click it to remove it, then snap a new one from the tray.',
    diagnosticTutorialReadyBtn: "Let's go!",
    streakTopBarTitle: (days, activeToday) =>
      activeToday
        ? `Active daily streak: ${days} day(s) in a row`
        : days > 0
          ? `${days}-day streak waiting — build today to keep it alive!`
          : 'Start your daily 3D workshop streak today',
    streakExtendedToast: (days) =>
      `Daily Streak: ${days} consecutive day${days === 1 ? '' : 's'} in the workshop!`,
    streakMilestoneUnlockedToast: (days, rewardLabel) =>
      `${days}-Day Streak Milestone reached! Unlocked: ${rewardLabel}`,
    liveryLockedStreakHint: (days) =>
      `Reach a ${days}-day active workshop streak to unlock this exclusive finish!`,
    streakModalTitle: 'Daily Engagement Streak & Rewards',
    streakModalSubtitle:
      'Snap parts, repair machines, or pass a mechanical quiz each day to grow your workshop flame and earn permanent rewards.',
    closeStreakAria: 'Close daily streak modal',
    streakStatusActiveToday: (days) =>
      `Today’s flame is lit! You are on a ${days}-day consecutive streak.`,
    streakStatusKeepAliveToday: (days) =>
      `Your ${days}-day streak is ready: snap a part or complete a repair today to extend it!`,
    streakStatusStartToday:
      'Snap your first part on the workbench today to ignite your daily streak!',
    streakCurrentLabel: 'Current streak',
    streakBestLabel: 'Best streak',
    streakDaysUnit: (days) => `${days} ${days === 1 ? 'day' : 'days'}`,
    streakRecentWeekTitle: 'Last 7 days of workshop activity',
    streakTodayTag: 'Today',
    streakMilestonesTitle: 'Consecutive-Day Milestone Rewards',
    streakRewardUnlockedTag: 'Unlocked',
    streakOpenPaintBoothBtn: 'Open Paint Booth',
    parentsNavBtn: 'Parents',
    parentsTopBarTitle: 'Parent & Teacher Space (protected by adult verification)',
    parentalGateTitle: 'Adult Verification — Parent Space',
    parentalGateSubtitle:
      'To protect children’s progress and screen-time settings, please solve this word problem using digits:',
    parentalGateInputPlaceholder: 'Enter answer in digits',
    parentalGateVerifyBtn: 'Unlock',
    parentalGateCancelBtn: 'Back to workshop',
    parentalGateNewChallengeBtn: 'New question',
    parentalGateIncorrectMsg: (attemptsLeft) =>
      `Incorrect answer (${attemptsLeft} attempt${attemptsLeft === 1 ? '' : 's'} remaining).`,
    parentalGateCooldownMsg: (seconds) =>
      `Too many incorrect attempts. Please wait ${seconds}s before trying again.`,
    parentSpaceTitle: 'Parent & Teacher Space',
    parentSpaceSubtitle:
      'STEM competency report, gentle screen-time management, and printable official diplomas (100% offline, zero child PII collected).',
    closeParentSpaceAria: 'Close parent space',
    parentProfileSelectLabel: 'Viewing child profile:',
    parentSwitchActiveBtn: 'Switch workbench to profile',
    parentTabStem: 'STEM Report',
    parentTabTimer: 'Gentle Timer',
    parentTabDiplomas: 'Printable Diplomas',
    parentTabProfile: 'Age Profile',
    parentTabClassroom: 'Classroom',
    parentTabFiches: 'Peda Sheets',
    fichePrintBtn: 'Print this sheet',
    classroomSilentLabel: 'Silent classroom mode',
    classroomSilentDesc: 'Mutes all sounds instantly (IWB, presentations)',
    tbiModeLabel: 'IWB mode',
    tbiModeDesc: 'Enlarges buttons for interactive whiteboards',
    volumeSfxLabel: 'Effects volume',
    volumeVoiceLabel: 'Voice volume',
    ageProfileSelectorTitle: 'How old is the child?',
    ageProfileSelectorSubtitle: 'We adapt the help, snap tolerance and display to their level.',
    ageProfile57Label: '5 - 7 years',
    ageProfile57Desc: 'Silhouette visible, easier parts to snap, automatic hints.',
    ageProfile810Label: '8 - 10 years',
    ageProfile810Desc: 'Balanced mode, help on demand.',
    ageProfile1112Label: '11 - 12 years',
    ageProfile1112Desc: 'No silhouette, precise snapping, full challenge.',
    ageProfileConfirmBtn: 'Confirm',
    parentAgeProfileSectionTitle: 'Age Profile',
    parentAgeProfileCurrentLabel: 'Current profile',
    parentStemOverviewTitle: 'Engineering & Cognitive Skills Practiced',
    parentStemIndexLabel: 'Overall STEM Mastery Index',
    parentKpiCompleted: 'Machines built',
    parentKpiPatents: 'Quiz patents',
    parentKpiRepairs: 'Repairs solved',
    parentKpiStreak: 'Best streak',
    parentTimerSectionTitle: 'Gentle Workshop Session Timer',
    parentTimerSectionDesc:
      'Set a daily active time budget on this device. No abrupt cutoffs: your child can calmly finish a vehicle already past 50%.',
    parentTimerUnlimited: 'Unlimited',
    parentTimerMinutesOption: (mins) => `${mins} min / day`,
    parentTimerConsumedLabel: 'Active time today',
    parentTimerRemainingLabel: 'Remaining today',
    parentTimerGraceRuleNote:
      'Assembly completion grace active: if the current vehicle is over 50% assembled when time expires, up to 3 extra minutes are granted to snap the final parts.',
    parentTimerExtend15Btn: '+15 min for today',
    parentTimerResetTodayBtn: 'Reset today’s counter to 0',
    parentTimerSavedToast: 'Daily session timer updated.',
    parentTimerExtendedToast: '15 bonus minutes granted for today.',
    parentDiplomasSectionTitle: 'Official Printable Certificates & Diplomas',
    parentDiplomasSectionDesc:
      'Download a high-resolution A4 landscape PNG or print an official engineering certificate personalized with your child’s name.',
    parentDiplomaUnlockedStatus: 'Earned',
    parentDiplomaLockedStatus: (needed) => `At ${needed} builds`,
    parentDiplomaEmptyHint:
      'Complete your first vehicle on the 3D workbench to unlock the personalized Junior Mechanical Initiation Certificate!',
    parentDiplomaDownloadBtn: 'Download Diploma (A4 PNG)',
    parentDiplomaPrintBtn: 'Print Diploma',
    parentDiplomaDownloadedToast: 'High-resolution official diploma downloaded!',
    parentBackupBtn: 'Backup profile (.json)',
    parentDiagnosticFooter: (profileCount, isOfflineReady) =>
      `Octo Gears v1.1 · Lot A · ${profileCount} local profile(s) · ${isOfflineReady ? 'Offline Ready' : 'Offline Mode Active'} · 0% Ads / 0% Child Tracking`,
    sessionCurtainTitle: 'The workshop is closing for today!',
    sessionCurtainSubtitle: (profileName, completedCount) =>
      `Great work ${profileName}! Your tools are neatly stored and your ${completedCount} completed machine(s) are safely saved for tomorrow.`,
    sessionCurtainGraceBanner: (secondsLeft) =>
      `Session wrapping up: ${secondsLeft}s remaining to snap the final parts onto this vehicle.`,
    sessionCurtainParentExtendBtn: 'Parent Access (Extend or adjust)',

    landingHeroTitle: 'Build your first machines!',
    landingHeroCTA: 'Try for free →',
    landingBadgeNoAds: '0% Ads',
    landingBadgeOffline: '100% Offline',
    landingBadgeTTS: 'Voice FR/EN/AR',
    landingUniversesTitle: '5 mechanical universes',
    landingPricingTitle: 'Pricing',
    landingSchoolTitle: 'Is your school interested?',
    landingSchoolSubmit: 'Send a request',
    landingSchoolThanks: 'Thank you, we will contact you!',
    landingBuyBtn: 'Buy',
    landingSchoolContact: 'Request a quote',
    landingSchoolPricingTitle: 'School pricing',

    teacherNavBtn: 'Teacher 🎓',
    teacherDashboardTitle: 'Teacher Dashboard',
    teacherDashboardSubtitle: (org: string) => `School: ${org}`,
    closeTeacherDashboardAria: 'Close teacher dashboard',
    teacherStudentsTitle: 'Students',
    teacherNoStudents: 'No student profiles found.',
    teacherStagesLabel: (c, t) => `${c} / ${t} stages`,
    teacherStreakLabel: (d) => `Streak: ${d}d`,
    teacherBadgesLabel: (n) => `${n} badges`,
    teacherExportPdfBtn: 'Export PDF',
    teacherLicenseSectionTitle: 'School License',
    teacherLicenseSectionDesc: 'Enter the license key provided by your institution.',
    teacherLicenseKeyPlaceholder: 'License key (SK-… or base64)',
    teacherActivateBtn: 'Activate',
    teacherLicenseInvalidMsg: 'Invalid key format. Please check the provided key.',
    teacherLicenseActivatedToast: 'School license activated successfully.',
    teacherSchoolLabel: 'School',
    teacherClassCodeTitle: 'Class code',
    teacherClassCodeDesc: 'Share this code with your students to link them to this class.',
    teacherClassCodeCopied: 'Copied!',
    teacherClassCodeGenerate: 'New code',
    teacherMissionsTitle: 'Assigned missions',
    teacherMissionsDesc: 'Choose 1 to 3 missions for the class.',
    teacherProgressGridTitle: 'Progress grid',
    teacherProgressNotStarted: 'Not started',
    teacherProgressInProgress: 'In progress',
    teacherProgressDone: 'Done',
    teacherProgressError: 'Struggling',

    licenseModalTitle: 'Activate a license key',
    licenseModalSubtitle: 'Enter your key to unlock the Family Pass or School plan.',
    licenseInputPlaceholder: 'e.g. MK3D-XXXX-XXXX-XXXX',
    licenseActivateBtn: 'Activate',
    licenseActivating: 'Checking…',
    licenseSuccessMsg: '✓ License activated!',
    licenseInvalidMsg: 'Invalid or expired key.',
    licenseHaveKeyBtn: 'I already have a key',
    licenseTypeLabel: 'License type',
    licenseExpiryLabel: 'Expires on',
    licenseSeatsLabel: 'Allowed seats',
    licenseContactBtn: 'Contact us for a school license',
    licenseTypeClasse: 'Classroom',
    licenseTypeEcole: 'School',
    licenseTypeReseau: 'Network',

  },

  ar: {
    appName: 'ميكانو كيدز 3D',
    navAriaLabel: 'التنقل الرئيسي والأنماط ثلاثية الأبعاد',
    stagesBtn: 'المراحل والحفظ',
    styleWood: 'خشب ومعدن',
    styleWoodShort: 'خشب',
    styleBlocks: 'مكعبات تركيب',
    styleBlocksShort: 'مكعبات',
    styleRealistic: 'نموذج واقعي',
    styleRealisticShort: 'واقعي',
    styleComics: 'ستايل كوميكس',
    styleComicsShort: 'كوميكس',
    discoveryBtn: 'بطاقة الاكتشاف',
    hintBtn: 'تلميح ميكانيكي',
    langSwitchAria: 'تغيير اللغة',
    dockAriaLabel: 'طاولة القطع وأدوات التحكم ثلاثية الأبعاد',
    openWorkbench: (placed, total) => `فتح طاولة العمل (${placed}/${total})`,
    collapseWorkbench: 'طيّ طاولة العمل',
    shortcutH: 'اختصار لوحة المفاتيح: H',
    stageOf: (num, total) => `المرحلة ${num} من ${total}`,
    partsCounter: (placed, total) => `القطع: ${placed} / ${total}`,
    nextStageBtn: 'المرحلة التالية',
    dragInstruction:
      'اسحب القطعة نحو طيفها المضيء على المنصة ثلاثية الأبعاد (أو انقر عليها ثم على المجسّم)',
    partStatusPlaced: 'مثبّتة',
    partStatusLockedAfter: (depName) => `بعد: ${depName}`,
    partStatusHinted: 'القطعة المقترحة',
    partStatusReady: 'جاهزة للتركيب',
    explodedViewLabel: 'عرض مفكّك:',
    cameraAnglesAria: 'زوايا الكاميرا',
    camIso: 'زاوية 3/4',
    camFront: 'أمامي',
    camSide: 'جانبي',
    camTop: 'علوي',
    guideBtn: 'الدليل',
    guideBtnTitle: 'إعادة تشغيل الجولة التعريفية',
    soundMuted: 'صامت',
    soundActive: 'صوت',
    muteAria: 'كتم الصوت',
    unmuteAria: 'تفعيل الصوت',
    undoBtn: 'تراجع',
    recenterBtn: 'توسيط',
    swUpdateAvailable: 'إصدار جديد جاهز للتثبيت.',
    swUpdateBtn: 'تحديث الآن',
    octoCongratulations: 'أحسنت، اكتمل التركيب!',
    resetBtn: 'إعادة المرحلة',
    autoSavedBadge: 'حفظ تلقائي',
    stageResetMsg: (vehicleName) => `تمت إعادة ضبط طاولة العمل لمركبة «${vehicleName}».`,
    partSnappedMsg: (partName, roleHint) => `✓ تم تركيب ${partName}! ${roleHint}`,
    placeFirstMsg: (missingName, partName) =>
      `ركّب أولاً «${missingName}» قبل تثبيت «${partName}».`,
    partStagedMsg: (partName) =>
      `القطعة «${partName}» جاهزة: انقر على طيفها المضيء أو اسحبها إلى المنصة!`,
    dragReleaseToSnap: (partName) => `✓ أفلت الآن لتثبيت: ${partName}`,
    dragPlaceFirst: (missingName) => `ركّب أولاً: ${missingName}`,
    dragApproachGuide: (partName) => `قرّب «${partName}» من طيفها الإرشادي`,
    dropRejectedMissingDep: (missingName, partName) =>
      `نصيحة ميكانيكية: ركّب أولاً «${missingName}» قبل تثبيت «${partName}»!`,
    webglResetTitle: 'إعادة تهيئة الورشة ثلاثية الأبعاد',
    webglResetDesc: 'توقف العرض ثلاثي الأبعاد. انتظر لحظة أو أعد تحميل الورشة لمتابعة البناء.',
    webglRetryBtn: 'إعادة تحميل الورشة',
    trayPositionBottom: 'القطع في الأسفل',
    trayPositionStart: 'القطع في البداية',
    trayPositionEnd: 'القطع في النهاية',
    progressSavedToast: 'تم حفظ تقدمك ومستواك الحالي محلياً على هذا الجهاز.',
    progressImportedToast: 'تمت استعادة ملف الحفظ بنجاح!',
    progressImportErrorToast: 'ملف الحفظ غير صالح.',
    progressResetToast: 'تم مسح التقدم وإعادة الضبط بالكامل.',
    catalogTitle: "دليل الورش وحفظ التقدم",
    discoveryObservationTitle: '2. شاهد تركيبك',
    discoveryModelBadge: 'فهم نموذج مبسط ومشاهدته',
    catalogSubtitle: "نماذج عبر خمسة مستويات صعوبة · حفظ تلقائي على هذا الجهاز.",
    closeCatalogAria: 'إغلاق القائمة',
    filterAll: "الكل",
    filterCars: 'البر والقطارات',
    filterBoats: 'البحار والأعماق',
    filterPlanes: 'الطيران والدرون',
    filterConstruction: 'البناء والزراعة',
    filterSpace: 'الفضاء والروبوتات',
    filterAerospace: 'الفضاء الجوي',
    filterElectronics: 'إلكترونيات',
    filterChemistry: 'كيمياء',
    filterPhysics: 'فيزياء',
    filterNature: 'الأحياء والأرض',
    filterHistory: 'التاريخ',
    trayTools: 'إعدادات القطع',
    hudTools: 'إعدادات الورشة',
    trayShowAll: 'كل القطع',
    trayShowReady: 'القطع المتاحة',
    allTiersLabel: 'كل المستويات',
    tierPillLabel: (tier) => `المستوى ${tier}`,
    searchPlaceholder: 'ابحث عن سيارة، قطار، صاروخ، حفارة، غواصة...',
    clearSearchLabel: 'مسح',
    noStagesMatch: 'لا توجد مركبات مطابقة لبحثك.',
    showingCountLabel: (shown, total) => `عرض ${shown} من أصل ${total} مجسّم`,
    tierCatalogSummary: (first, last, min, max) => `المراحل ${first}–${last} · ${min}–${max} قطع`,
    freeAccessActive: 'الوضع الحر مفعّل',
    unlockAllBtn: "فتح الكل",
    unlockAllTitle: "تجربة جميع النماذج (للأهل والمعلمين)",
    tier1Title: '01. مستوى الاستكشاف — التركيبات الأولى',
    tier1Subtitle: "أطياف إرشادية ومساعدة في وضع القطع.",
    tier2Title: '02. مستوى الورشة — آليات متعددة الطبقات',
    tier2Subtitle: "تركيب موجه للاتصالات.",
    tier3Title: '03. مستوى المهندس — الإنشاءات الكبرى',
    tier3Subtitle: "تركيبات تدريجية ومفاهيم جديدة.",
    tier4Title: '04. مستوى الخبير — الأنظمة المعقدة',
    tier4Subtitle: "تركيبات متعددة الخطوات.",
    tier5Title: '05. مستوى كبير البناة — التحديات القصوى',
    tier5Subtitle: "تحديات كاملة للاستكشاف.",
    catCar: 'البر والقطارات',
    catBoat: 'البحار والأعماق',
    catPlane: 'الطيران والجو',
    catConstruction: 'البناء والزراعة',
    catSpace: 'الفضاء والروبوتات',
    stageLabel: (num) => `المرحلة ${num}`,
    partsCountLabel: (count) => `${count} قطع`,
    statusCompleted: 'مكتملة',
    statusCurrentActive: 'المرحلة الحالية',
    statusInProgress: (placed, total) => `قيد التركيب (${placed}/${total})`,
    statusBuild: 'ابدأ البناء',
    unlockRequirement: (stagesNeeded) => `أكمل ${stagesNeeded} مراحل للفتح`,
    savePanelTitle: 'الحفظ المحلي التلقائي (LocalStorage)',
    savePanelDesc: (completed, total, stars, maxStars) =>
      `أُنجزت ${completed}/${total} مركبات · ${stars}/${maxStars} نجمة · استئناف تلقائي لنفس المستوى عند التشغيل`,
    saveNowBtn: 'حفظ الآن',
    exportSaveBtn: 'تصدير (.json)',
    importSaveBtn: 'استيراد',
    resetAllBtn: 'مسح التقدم المحفوظ',
    confirmResetBtn: 'تأكيد مسح كل التقدم',
    cancelResetBtn: 'إلغاء',
    mechanicDrawerAria: 'الدليل الميكانيكي للورشة',
    mechanicTitle: 'الدليل الميكانيكي',
    mechanicSubtitle: 'ترتيب التركيب ووظيفة كل قطعة (يعمل محلياً بدون إنترنت)',
    closeMechanicAria: 'إغلاق الدليل الميكانيكي',
    nextStepBannerReady: 'هل تحتاج إلى مساعدة لمعرفة القطعة التالية؟',
    nextStepBannerDone: 'تم تركيب جميع قطع المركبة بنجاح!',
    highlightOn3DBtn: 'إظهار مكانها على المجسّم 3D',
    recommendedNextTitle: 'القطعة التالية المقترحة',
    allPartsChecklistTitle: 'مخطط تركيب جميع قطع المركبة',
    vehicleCompletedCongrats: (vehicleName) =>
      `أحسنت! اكتمل بناء «${vehicleName}» بالكامل. يمكنك تحريك شريط «عرض مفكّك» لمشاهدة كيف تترابط الأجزاء الداخلية.`,
    discoveryCompletedTitle: (vehicleName) => `رائع! «${vehicleName}» جاهزة للانطلاق!`,
    discoveryPreviewTitle: (vehicleName) => `بطاقة الاكتشاف: ${vehicleName}`,
    closeDiscoveryAria: 'إغلاق بطاقة الاكتشاف',
    discoveryLockedTitle: 'أكمل تركيب المركبة لفتح أسرارها الحقيقية!',
    discoveryLockedDesc: (partsCount, vehicleName) =>
      `بمجرد تثبيت القطع الـ ${partsCount} لمركبة «${vehicleName}»، ستكتشف كيف تعمل في الواقع وأرقامها القياسية ومعلومات مدهشة عنها.`,
    discoveryBadgeLocal: 'الموسوعة الميكانيكية — حقائق هندسية حقيقية',
    howItWorksTitle: '1. كيف تعمل في الواقع؟',
    realRecordTitle: '2. رقم قياسي ومعلومة حقيقية',
    didYouKnowTitle: '3. هل تعلم؟',
    admire3DBtn: 'تأمّل المجسّم ثلاثي الأبعاد',
    goToNextStageBtn: 'الانتقال إلى المرحلة التالية',
    tourAriaLabel: 'جولة تعريفية في الورشة — دليل تفاعلي',
    tourKicker: 'جولة تعريفية',
    tourStepCounter: (current, total) => `الخطوة ${current} من ${total}`,
    closeTourAria: 'إغلاق الجولة التعريفية',
    tourSkipBtn: 'تخطّي الدليل',
    tourPrevBtn: 'السابق',
    tourNextBtn: 'التالي',
    tourPlayNowBtn: 'ابدأ اللعب الآن',
    tourSilhouetteLabel: (partName) => `الطيف الإرشادي: ${partName}`,
    tourSnappedBadge: 'انجذاب مغناطيسي!',
    tourDragUpLabel: (partName) => `اسحب «${partName}» للأعلى`,
    tourGreatFirstSnap: (vehicleName) =>
      `ممتاز! لقد قمت للتو بتركيب أول قطعة في «${vehicleName}»!`,
    tourRotateHint: 'نصيحة: اسحب الخلفية لتدوير المنصة ورؤية المركبة من جميع الزوايا!',
    tourSteps: [
      {
        title: '01. تعرّف على القطع في طاولة العمل',
        description:
          'جميع قطع المركبة مرتبة هنا في الأسفل. ابدأ دائماً بالقطعة المكتوب عليها «جاهزة للتركيب» لأنها تمثل الهيكل الأساسي الحامل.',
        tip: 'القطع التي تحمل علامة القفل تُفتح تلقائياً بمجرد تثبيت القاعدة التي تحملها.',
      },
      {
        title: '02. اسحب القطعة وثبّتها مغناطيسياً',
        description:
          'اضغط مطولاً بالماوس (أو بإصبعك) على القطعة واسحبها نحو الطيف المضيء وسط المنصة. عندما يتحول لونه إلى الأخضر، أفلتها لتثبت في مكانها!',
        tip: 'يمكنك التجربة فوراً الآن، أو النقر على بطاقة القطعة ثم النقر على طيفها المضيء.',
      },
      {
        title: '03. دوّر الكاميرا واستخدم العرض المفكّك',
        description:
          'اسحب الخلفية للدوران حول مركبتك من كل الزوايا، أو اختر زاوية كاميرا سريعة، أو حرّك شريط «عرض مفكّك» لرؤية الأجزاء الميكانيكية من الداخل.',
        tip: 'يُحفظ مستواك والقطع التي ركبتها تلقائياً لتكمل من نفس المكان عند إعادة تشغيل اللعبة.',
      },
      {
        title: '04. غيّر النمط البصري واللغة واطلب تلميحاً',
        description:
          'من الشريط العلوي، بدّل في أي وقت بين الخشب والمكعبات والنموذج الواقعي، وغيّر اللغة (FR / EN / العربية)، أو خُض تحدي اليوم الميكانيكي!',
        tip: 'تُفتح بطاقة اكتشاف علمية ممتعة عند إكمال كل مركبة.',
      },
    ],
    openProgressionBtn: (unlocked, total) => `الأوسمة والتقدم (${unlocked}/${total})`,
    progressionModalTitle: 'لوحة التقدم وأوسمة الإنجاز',
    progressionModalSubtitle:
      'اجمع النجوم في المراحل وركّب القطع بدقة لفتح جميع ألقاب وأوسمة الورشة.',
    closeProgressionAria: 'إغلاق نافذة التقدم',
    backToCatalogBtn: 'العودة إلى دفتر المراحل',
    rankLabel: 'الرتبة الميكانيكية الحالية',
    maxRankReached: 'وصلت إلى أعلى رتبة هندسية — أحسنت!',
    kpiStarsLabel: 'مجموع النجوم',
    kpiCompletedLabel: 'مركبات مكتملة',
    kpiPerfectLabel: 'بلا أخطاء (3★)',
    kpiBadgesLabel: 'الأوسمة المفتوحة',
    familyScoresTitle: 'النتائج حسب فئة المركبات',
    badgesSectionTitle: 'مجموعة أوسمة الإنجاز',
    badgeFilterAll: (count) => `الكل (${count})`,
    badgeFilterUnlocked: (count) => `مفتوحة (${count})`,
    badgeFilterLocked: (count) => `قيد الإنجاز (${count})`,
    badgeUnlockedLabel: 'مفتوح',
    badgeLockedLabel: 'قيد التقدم',
    newBadgesUnlockedBannerTitle: (count) =>
      count > 1 ? 'تم فتح أوسمة إنجاز جديدة!' : 'تم فتح وسام إنجاز جديد!',
    viewAllBadgesBtn: 'عرض جميع الأوسمة والتقدم',
    dailyNavBtn: 'تحدي اليوم',
    dailyCompletedShort: 'مكتمل',
    dailyBonusStageLabel: 'التحدي الميكانيكي اليومي',
    returnToStagesBtn: 'العودة إلى المراحل',
    rarePartCardLabel: 'قطعة نادرة ذهب 24K',
    dailyModalTitle: 'التحدي الميكانيكي اليومي',
    dailyModalSubtitle:
      'كل يوم قبل منتصف الليل، جمّع مركبة إضافية مؤقتة لربح قطعتها النادرة المطلية بالذهب وإضافتها إلى خزانتك!',
    closeDailyAria: 'إغلاق تحدي اليوم',
    dailyResetInLabel: 'مركبة جديدة خلال',
    dailyStreakLabel: 'سلسلة الأيام المتتالية',
    dailyStreakValue: (days) => (days === 1 ? 'يوم واحد' : `${days} أيام`),
    dailyBestStreakLabel: (days) => `أفضل سلسلة: ${days}`,
    dailyRareVaultKpiLabel: 'القطع النادرة المجموعة',
    dailyTodayVehicleSection: 'مركبة اليوم الإضافية المؤقتة',
    dailyRareSpotlightLabel: 'القطعة النادرة الخاصة داخل هذا النموذج',
    dailyPlayBtn: 'ركّب مركبة تحدي اليوم',
    dailyReplayBtn: 'إعادة تركيب مركبة اليوم',
    dailyActiveNowBtn: 'معروضة الآن على طاولة 3D',
    dailyVaultTitle: 'خزانة القطع النادرة السبع للورشة',
    dailyVaultSubtitle: (collected, total) =>
      `تم جمع ${collected} من أصل ${total} قطع نادرة · عُد يومياً لإكمال المجموعة الذهبية`,
    dailyVaultCollectedStatus: 'في خزانتك',
    dailyVaultLockedStatus: 'تناوب يومي',
    dailyCatalogBannerTitle: 'التحدي الميكانيكي اليومي متاح الآن!',
    dailyCatalogBannerCta: 'عرض التحدي وخزانة النوادر',
    dailyRareUnlockedBannerTitle: 'تمت إضافة قطعة اليوم النادرة إلى خزانتك!',
    openDailyVaultBtn: 'فتح خزانة القطع النادرة',
    timerToggleBtn: 'مؤقّت',
    timerActiveLabel: 'المؤقّت مفعّل',
    timerOffLabel: 'المؤقّت متوقف',
    timerEnabledToast: 'تم تفعيل وضع المؤقّت: يبدأ العد فور تحريك أول قطعة!',
    timerDisabledToast: 'تم إيقاف وضع المؤقّت.',
    personalBestShort: (formatted) => `أفضل زمن: ${formatted}`,
    leaderboardNavBtn: 'أفضل الأزمان',
    leaderboardTitle: 'وضع المؤقّت ولوحة أسرع الأزمان المحلية',
    leaderboardSubtitle:
      'وضع اختياري للاعبين المتقدمين: اختبر سرعة تجميعك وتابع أرقامك القياسية المحفوظة على جهازك.',
    closeLeaderboardAria: 'إغلاق لوحة الأزمان',
    timerModeSwitchTitle: 'مؤقّت التجميع المباشر',
    timerModeSwitchDesc:
      'يبدأ عند الإمساك بأول قطعة، ويتوقف مؤقتاً داخل القوائم، ويحفظ أفضل أوقاتك تلقائياً.',
    timerEnableAction: 'تفعيل المؤقّت',
    timerDisableAction: 'إيقاف المؤقّت',
    leaderboardKpiRuns: 'الأزمان المسجّلة',
    leaderboardKpiFastest: 'أسرع زمن مطلق',
    leaderboardKpiBestPace: 'أسرع وتيرة تركيب',
    leaderboardTabStageRecords: (count) => `الأرقام القياسية لكل مركبة (${count})`,
    leaderboardTabTopRuns: (count) => `سجل أسرع المحاولات (${count})`,
    leaderboardColRank: '#',
    leaderboardColVehicle: 'المركبة والمستوى',
    leaderboardColTime: 'الزمن',
    leaderboardColPace: 'الوتيرة',
    leaderboardColPrecision: 'الدقة',
    leaderboardColAction: 'تحدي السرعة',
    leaderboardBeatTimeBtn: 'حطّم الزمن',
    leaderboardTimeAttackCurrentBtn: 'ابدأ سباق الزمن للمرحلة الحالية',
    leaderboardEmptyTitle: 'لا توجد أزمان مسجّلة حتى الآن',
    leaderboardEmptyDesc:
      'فعّل وضع المؤقّت وأكمل تجميع أي مركبة لتسجيل أول رقم قياسي محلي لك!',
    leaderboardStartFirstRunBtn: 'ابدأ تجميعاً موقوتاً الآن',
    clearLeaderboardBtn: 'مسح الأزمان',
    confirmClearLeaderboardBtn: 'تأكيد مسح سجل الأزمان',
    discoveryTimerCardTitle: 'الزمن الرسمي في وضع المؤقّت',
    discoveryNewRecordTag: 'رقم قياسي شخصي جديد!',
    discoveryPreviousBestLabel: (prevTime, delta) => `الرقم السابق: ${prevTime} (${delta})`,
    openLeaderboardBtn: 'عرض لوحة أسرع الأزمان',
    retryTimedRunBtn: 'إعادة المحاولة ضد الساعة',
    profilesNavBtn: 'الملفات',
    profilesModalTitle: 'ملفات اللاعبين والقراءة الصوتية والوضع دون إنترنت',
    profilesModalSubtitle:
      'يحتفظ كل طفل بتقدمه وأوسمته الخاصة على هذا الجهاز، مع نطق صوتي بثلاث لغات وإمكانية تثبيت اللعبة بدون إنترنت.',
    closeProfilesAria: 'إغلاق نافذة الملفات الشخصية',
    profilesListTitle: (count, max) => `الملفات المحلية على هذا الجهاز (${count}/${max})`,
    profileActiveTag: 'الملف النشط',
    profileSwitchBtn: 'اختيار',
    profileStatsLine: (completed, total, stars, badges) =>
      `${completed}/${total} مركبة · ${stars} ★ · ${badges} أوسمة`,
    profileNewBtn: 'ملف جديد',
    profileMaxReached: (max) => `تم الوصول إلى الحد الأقصى (${max} ملفات محلية).`,
    profileNameLabel: 'اسم البطل أو اللقب',
    profileNamePlaceholder: 'مثال: آدم، سارة، فصل العلوم...',
    profileColorLabel: 'لون الورشة',
    profileIconLabel: 'الشعار الميكانيكي',
    profileCreateSubmit: 'إنشاء وتفعيل هذا الملف',
    profileEditBtn: 'تعديل الاسم',
    profileSaveEditBtn: 'حفظ',
    profileDeleteBtn: 'حذف',
    profileConfirmDeleteBtn: 'تأكيد الحذف',
    profileSwitchedToast: (name) => `مرحباً بك في ورشة «${name}»!`,
    profileCreatedToast: (name) => `تم إنشاء وتفعيل ملف «${name}»!`,
    profileDeletedToast: (name) => `تم حذف ملف «${name}».`,
    voiceSectionTitle: 'القراءة الصوتية التعليمية (Web Speech)',
    voiceSectionDesc:
      'قراءة التلميحات الميكانيكية والجولة التعريفية وبطاقات الاكتشاف بصوت واضح بالعربية والفرنسية والإنجليزية بدون إنترنت.',
    voiceAutoReadLabel: 'قراءة تلقائية لوظيفة القطع',
    voiceAutoReadDesc:
      'ينطق تلقائياً اسم القطعة ودورها الميكانيكي عند اختيارها أو تثبيتها في المركبة.',
    voiceTestBtn: 'تجربة الصوت',
    voiceTestSample:
      'مرحباً أيها المهندس الصغير! هل أنت مستعد لتجميع مركبتك الميكانيكية القادمة ثلاثية الأبعاد؟',
    voiceListenBtn: 'استماع',
    voiceStopBtn: 'إيقاف',
    voiceReadFullCardBtn: 'الاستماع للبطاقة كاملة',
    voiceAutoToggleShort: 'قراءة تلقائية',
    voiceAutoEnabledToast: 'تم تفعيل القراءة الصوتية التلقائية للقطع.',
    voiceAutoDisabledToast: 'تم إيقاف القراءة الصوتية التلقائية.',
    replayInstructionAria: 'إعادة سماع آخر تعليمة',
    voiceUnsupportedLabel: 'القراءة الصوتية غير مدعومة في هذا المتصفح.',
    pwaSectionTitle: 'تثبيت اللعبة للعمل بدون إنترنت (PWA)',
    pwaSectionDesc:
      'ثبّت ميكانو كيدز 3D على الشاشة الرئيسية أو سطح مكتب ويندوز للعب بملء الشاشة في أي وقت بدون اتصال بالإنترنت.',
    pwaInstallBtn: 'تثبيت ميكانو كيدز 3D على هذا الجهاز',
    pwaInstallShortBtn: 'تثبيت',
    pwaInstalledLabel: 'التطبيق مثبّت · جاهز بدون إنترنت',
    pwaOnlineReadyLabel: 'التخزين المؤقت جاهز · يعمل بدون شبكة',
    pwaOfflineActiveBanner: 'وضع بدون إنترنت مفعّل — الحفظ المحلي مضمون',
    pwaIosGuideTitle: 'التثبيت على آيفون أو آيباد (سفاري)',
    pwaIosStep1: '1. اضغط على زر المشاركة (Share) في شريط أدوات سفاري.',
    pwaIosStep2: '2. مرّر للأسفل واختر «إضافة إلى الشاشة الرئيسية».',
    pwaCloseGuideBtn: 'حسناً',
    testDriveBtn: 'اختبار 3D',
    testDriveActiveBtn: 'إيقاف الاختبار',
    testDriveStartedToast: (vehicleName) =>
      `انطلق الاختبار الحركي ثلاثي الأبعاد لمركبة «${vehicleName}»!`,
    testDriveStoppedToast: 'تم إيقاف الاختبار الحركي ثلاثي الأبعاد.',
    xRayBtn: 'أشعة سينية',
    xRayActiveBtn: 'أشعة مفعّلة',
    xRayTitle: 'مقطع تقني شفاف لمشاهدة المحرك والهيكل والأجزاء الداخلية بوضوح',
    xRayEnabledToast: 'تم تفعيل وضع الأشعة السينية: الهيكل الخارجي شفاف والأعضاء الداخلية واضحة.',
    xRayDisabledToast: 'تم إيقاف وضع الأشعة السينية.',
    envThematicBtn: 'منصة تفاعلية',
    envStudioBtn: 'منصة استوديو',
    envSwitchTitle: 'التبديل بين المنصة التفاعلية (مضمار، ميناء، مدرج، ورشة، منصة إطلاق) ومنصة الاستوديو',
    envThematicToast: 'تم تفعيل بيئة المنصة التفاعلية ثلاثية الأبعاد.',
    envStudioToast: 'تم تفعيل منصة الاستوديو الكلاسيكية.',
    studioBtn: 'طلاء وتصوير',
    studioModalTitle: 'غرفة الطلاء واستوديو البطاقة التذكارية 3D',
    studioModalSubtitle:
      'لوّن مركبتك بألوان الورشة المخصصة والتقط بطاقة تذكارية عالية الدقة لإنجازك.',
    closeStudioAria: 'إغلاق غرفة الطلاء واستوديو التصوير',
    studioPaintSectionTitle: 'غرفة الطلاء وتشطيبات الورشة',
    studioPaintSectionDesc:
      'اختر لون طلاء يُحفظ تلقائياً لهذه المركبة (مع احتفاظ القطع النادرة الذهبية عيار 24 قيراط ببريقها).',
    liveryAppliedToast: (liveryLabel) => `تم تطبيق وحفظ طلاء «${liveryLabel}»!`,
    studioPhotoSectionTitle: 'استوديو التصوير — بطاقة تذكارية 3D',
    studioPhotoSectionDesc:
      'التقط صورة فورية للمجسّم ثلاثي الأبعاد مع اسم ملفك ونجومك وأفضل زمن وحمّلها بصيغة PNG.',
    capturePostcardBtn: 'التقاط البطاقة التذكارية 3D',
    retakePostcardBtn: 'تحديث لقطة الكاميرا',
    downloadPostcardBtn: 'تحميل صورة PNG',
    postcardDownloadedToast: 'تم تحميل البطاقة التذكارية بصيغة PNG!',
    workshopThemeSectionTitle: 'ورشتي — الأرضية والأجواء',
    workshopThemeSectionDesc: 'خصّص أرضية ورشتك. يُحفظ اختيارك في ملفك الشخصي.',
    groundAsphalt: 'إسفلت',
    groundGrass: 'عشب',
    groundSand: 'رمال',
    groundSnow: 'ثلج',
    groundCircuit: 'حلبة',
    groundLightWood: 'خشب فاتح',
    groundMoon: 'قمر',
    groundWater: 'ماء',
    garageNavBtn: 'معرضي 3D',
    garageModalTitle: 'المعرض الشخصي — خزانتي ثلاثية الأبعاد',
    garageModalSubtitle:
      'تصفّح جميع مركباتك المكتملة بطلائها المخصص وبراءات الهندسة والقطع النادرة المطلية بالذهب.',
    closeGarageAria: 'إغلاق المعرض الشخصي',
    garageKpiVehicles: 'مركبات معروضة',
    garageKpiPatents: 'براءات هندسية',
    garageKpiRepairs: 'مهام إصلاح ناجحة',
    garageKpiRareVault: 'قطع نادرة ذهب 24K',
    garageTabVehicles: (count) => `مركباتي المكتملة (${count})`,
    garageTabRareVault: (collected, total) => `خزانة النوادر الذهبية (${collected}/${total})`,
    garageEmptyTitle: 'معرضك ينتظر مركبتك الأولى!',
    garageEmptyDesc:
      'أكمل تجميع أي مركبة على طاولة العمل لعرضها هنا وتلوينها وتشغيلها في اختبار حركي ثلاثي الأبعاد.',
    garageLoadBtn: 'عرض على المنصة',
    garageTestDriveBtn: 'اختبار حركي فوري',
    garagePatentTag: 'براءة مهندس',
    garageRepairedTag: (count) => `أُصلحت ${count}×`,
    garageMasterTag: 'بدون طيف',
    noSilhouetteBtn: 'بدون طيف',
    noSilhouetteActiveBtn: 'وضع الخبير',
    noSilhouetteTitle:
      'صعوبة كبير المهندسين: إخفاء الأطياف الإرشادية لاستنتاج مواضع القطع بالمنطق الميكانيكي وحده',
    noSilhouetteEnabledToast:
      'تم تفعيل وضع الخبير بدون طيف إرشادي: استنتج موضع كل قطعة بدقة!',
    noSilhouetteDisabledToast: 'تمت إعادة إظهار الأطياف الإرشادية ثلاثية الأبعاد.',
    quizOpenBtn: 'اختبار البراءة',
    quizPassedBtn: 'براءة مكتسبة',
    quizModalTitle: (vehicleName) => `اختبار الهندسة السريع: ${vehicleName}`,
    quizModalSubtitle:
      'أجب عن 3 أسئلة حول ترتيب التركيب وطريقة العمل الحقيقية لنيل ختم «براءة مهندس» لهذه المركبة!',
    closeQuizAria: 'إغلاق الاختبار الميكانيكي',
    quizQuestionCounter: (current, total) => `السؤال ${current} من ${total}`,
    quizNextQuestionBtn: 'السؤال التالي',
    quizSeeResultsBtn: 'عرض النتيجة',
    quizRetryBtn: 'إعادة الاختبار',
    quizScoreTitle: (score, total) => `النتيجة: ${score} / ${total}`,
    quizPatentEarnedTitle: 'مُنحت ختم «براءة مهندس»!',
    quizPatentEarnedDesc: (vehicleName) =>
      `أحسنت! لقد أتقنت البنية الهندسية وأسرار عمل «${vehicleName}».`,
    quizAlmostTitle: 'اقتربت جداً! راجع التلميحات وحاول مجدداً',
    quizAlmostDesc:
      'احصل على إجابتين صحيحتين على الأقل من أصل 3 لنيل براءة المهندس الخاصة بهذه المركبة.',
    diagnosticBtn: 'إصلاح الأعطال',
    diagnosticActiveBanner: (faultyLeft, missingLeft) =>
      faultyLeft > 0
        ? `التشخيص: انقر على ${faultyLeft} قطعة برتقالية مفكوكة على المجسّم 3D لإزالتها، ثم ركّب ${missingLeft} قطع!`
        : `الإصلاح: أعد تركيب القطع الـ ${missingLeft} المتبقية من طاولة العمل لاستعادة الجاهزية الكاملة!`,
    diagnosticQuitBtn: 'إنهاء الإصلاح',
    diagnosticStartedToast: (vehicleName, issues) =>
      `مهمة تشخيص وإصلاح لمركبة «${vehicleName}»: ${issues} أعطال ميكانيكية بانتظارك!`,
    diagnosticExtractedToast: (partName) =>
      `✓ تم فك القطعة المختلّة «${partName}»! أعد تركيبها الآن بشكل سليم من الطاولة.`,
    diagnosticClickFaultyHint: (partName) =>
      `انقر أولاً على القطعة البرتقالية المفكوكة «${partName}» فوق المجسّم 3D لفكّها!`,
    diagnosticCompletedToast: (vehicleName) =>
      `نجح التشخيص والإصلاح! عادت «${vehicleName}» للعمل بنسبة 100%!`,
    diagnosticTutorialTitle: 'كيف تُصلح؟',
    diagnosticTutorialStep1: 'استمع للصوت — مركبتك تحتوي على قطع تالفة أو ناقصة.',
    diagnosticTutorialStep2: 'ابحث عن القطعة — القطع المعطوبة مُظلَّلة باللون البرتقالي.',
    diagnosticTutorialStep3: 'استبدلها — انقر عليها لفكّها ثم ركّب قطعة جديدة من الطاولة.',
    diagnosticTutorialReadyBtn: 'هيّا بنا!',
    streakTopBarTitle: (days, activeToday) =>
      activeToday
        ? `السلسلة اليومية نشطة: ${days} أيام متتالية`
        : days > 0
          ? `سلسلة ${days} أيام بانتظارك اليوم لمواصلتها!`
          : 'ابدأ سلسلتك اليومية في الورشة ثلاثية الأبعاد',
    streakExtendedToast: (days) =>
      `السلسلة اليومية: ${days} يوم متتالي من الإبداع في الورشة!`,
    streakMilestoneUnlockedToast: (days, rewardLabel) =>
      `إنجاز سلسلة ${days} أيام! تمت مكافأتك بـ: ${rewardLabel}`,
    liveryLockedStreakHint: (days) =>
      `حقق سلسلة تفاعل لمدة ${days} أيام متتالية لفتح هذا الطلاء الحصري!`,
    streakModalTitle: 'السلسلة اليومية ومكافآت المثابرة',
    streakModalSubtitle:
      'ركّب القطع أو أصلح المركبات أو اجتز اختباراً كل يوم لإبقاء شعلة الورشة متقدة وربح مكافآت دائمة.',
    closeStreakAria: 'إغلاق نافذة السلسلة اليومية',
    streakStatusActiveToday: (days) =>
      `شعلة اليوم متقدة! أنت في سلسلة مستمرة منذ ${days} أيام متتالية.`,
    streakStatusKeepAliveToday: (days) =>
      `سلسلتك البالغة ${days} أيام بانتظارك: ركّب قطعة اليوم لمواصلة التقدم!`,
    streakStatusStartToday:
      'ركّب أول قطعة على طاولة العمل اليوم لإشعال سلسلتك اليومية!',
    streakCurrentLabel: 'السلسلة الحالية',
    streakBestLabel: 'أفضل سلسلة',
    streakDaysUnit: (days) => `${days} أيام`,
    streakRecentWeekTitle: 'نشاط آخر 7 أيام في الورشة',
    streakTodayTag: 'اليوم',
    streakMilestonesTitle: 'جوائز ومكافآت الأيام المتتالية',
    streakRewardUnlockedTag: 'مفتوح',
    streakOpenPaintBoothBtn: 'فتح كابينة الطلاء',
    parentsNavBtn: 'الأهل',
    parentsTopBarTitle: 'مساحة أولياء الأمور والمعلمين (محمية بتحقق للبالغين)',
    parentalGateTitle: 'تحقق البالغين — مساحة الأهل والمعلمين',
    parentalGateSubtitle:
      'لحماية تقدم الأطفال وإعدادات وقت الشاشة، يرجى كتابة ناتج المسألة التالية بالأرقام:',
    parentalGateInputPlaceholder: 'اكتب الإجابة بالأرقام',
    parentalGateVerifyBtn: 'فتح القفل',
    parentalGateCancelBtn: 'العودة للورشة',
    parentalGateNewChallengeBtn: 'سؤال آخر',
    parentalGateIncorrectMsg: (attemptsLeft) =>
      `إجابة غير صحيحة (تبقّت ${attemptsLeft} محاولات).`,
    parentalGateCooldownMsg: (seconds) =>
      `محاولات خاطئة متعددة. يرجى الانتظار ${seconds} ثانية قبل المحاولة مجدداً.`,
    parentSpaceTitle: 'مساحة أولياء الأمور والمعلمين',
    parentSpaceSubtitle:
      'تقرير مهارات الهندسة STEM، ومؤقّت الجلسة اللطيف، والشهادات الرسمية القابلة للطباعة (يعمل 100% دون إنترنت وبدون جمع أي بيانات عن الطفل).',
    closeParentSpaceAria: 'إغلاق مساحة أولياء الأمور',
    parentProfileSelectLabel: 'ملف الطفل المعروض:',
    parentSwitchActiveBtn: 'تفعيل على طاولة العمل',
    parentTabStem: 'تقرير مهارات STEM',
    parentTabTimer: 'المؤقّت اللطيف',
    parentTabDiplomas: 'الشهادات والطباعة',
    parentTabProfile: 'الفئة العمرية',
    parentTabClassroom: 'الفصل',
    parentTabFiches: 'بطاقات بيداغوجية',
    fichePrintBtn: 'طباعة هذه البطاقة',
    classroomSilentLabel: 'وضع الصمت',
    classroomSilentDesc: 'يكتم جميع الأصوات فوراً (السبورة التفاعلية)',
    tbiModeLabel: 'وضع السبورة',
    tbiModeDesc: 'يكبّر الأزرار للسبورات التفاعلية',
    volumeSfxLabel: 'مستوى المؤثرات',
    volumeVoiceLabel: 'مستوى الصوت',
    ageProfileSelectorTitle: 'كم عمر الطفل?',
    ageProfileSelectorSubtitle: 'نضبط المساعدة والحساسية والعرض حسب مستواه.',
    ageProfile57Label: '5 - 7 سنوات',
    ageProfile57Desc: 'الظل مرئي، قطع أسهل للتثبيت، تلميحات تلقائية.',
    ageProfile810Label: '8 - 10 سنوات',
    ageProfile810Desc: 'وضع متوازن، المساعدة عند الطلب.',
    ageProfile1112Label: '11 - 12 سنة',
    ageProfile1112Desc: 'بلا ظل، تثبيت دقيق، تحدٍ كامل.',
    ageProfileConfirmBtn: 'تأكيد',
    parentAgeProfileSectionTitle: 'الفئة العمرية للطفل',
    parentAgeProfileCurrentLabel: 'الملف الحالي',
    parentStemOverviewTitle: 'المهارات الهندسية والذهنية المكتسبة',
    parentStemIndexLabel: 'المؤشر العام لإتقان مهارات STEM',
    parentKpiCompleted: 'مركبات منجزة',
    parentKpiPatents: 'براءات الاختبار',
    parentKpiRepairs: 'أعطال أُصلحت',
    parentKpiStreak: 'أفضل سلسلة يومية',
    parentTimerSectionTitle: 'مؤقّت الورشة اللطيف لتنظيم وقت الشاشة',
    parentTimerSectionDesc:
      'حدّد المدة اليومية القصوى على هذا الجهاز بدون إغلاق مفاجئ: يُسمح للطفل بإتمام المركبة التي تجاوزت 50% بهدوء.',
    parentTimerUnlimited: 'غير محدود',
    parentTimerMinutesOption: (mins) => `${mins} دقيقة / يوم`,
    parentTimerConsumedLabel: 'الوقت المستهلك اليوم',
    parentTimerRemainingLabel: 'الوقت المتبقي اليوم',
    parentTimerGraceRuleNote:
      'مهلة إتمام التجميع مفعّلة: إذا تجاوز تركيب المركبة الحالية 50% عند انتهاء الوقت، تُمنح مهلة حتى 3 دقائق لتثبيت القطعة الأخيرة بدون إحباط.',
    parentTimerExtend15Btn: '+15 دقيقة إضافية لليوم',
    parentTimerResetTodayBtn: 'تصفير عدّاد اليوم',
    parentTimerSavedToast: 'تم تحديث الحد اليومي لمؤقّت الجلسة.',
    parentTimerExtendedToast: 'تمت إضافة 15 دقيقة إضافية لليوم.',
    parentDiplomasSectionTitle: 'الشهادات والدبلومات الرسمية القابلة للطباعة',
    parentDiplomasSectionDesc:
      'حمّل شهادة عالية الدقة بحجم A4 أفقي (PNG) أو اطبع دبلوم الهندسة الرسمي باسم طفلك.',
    parentDiplomaUnlockedStatus: 'مكتسبة',
    parentDiplomaLockedStatus: (needed) => `عند ${needed} مركبة`,
    parentDiplomaEmptyHint:
      'أكمل تجميع أول مركبة على طاولة العمل لفتح شهادة التمهيد الهندسي باسم الطفل!',
    parentDiplomaDownloadBtn: 'تحميل الشهادة (PNG A4)',
    parentDiplomaPrintBtn: 'طباعة الشهادة',
    parentDiplomaDownloadedToast: 'تم تحميل الشهادة الرسمية عالية الدقة!',
    parentBackupBtn: 'نسخ احتياطي للملف (.json)',
    parentDiagnosticFooter: (profileCount, isOfflineReady) =>
      `ميكانو كيدز 3D الإصدار 1.1 · الحزمة A · ${profileCount} ملفات محلية · ${isOfflineReady ? 'جاهز دون إنترنت' : 'وضع دون إنترنت نشط'} · 0% إعلانات / 0% تتبع للأطفال`,
    sessionCurtainTitle: 'أغلقت الورشة أبوابها لهذا اليوم!',
    sessionCurtainSubtitle: (profileName, completedCount) =>
      `أحسنت يا ${profileName}! أُعيدت الأدوات إلى مكانها وحُفظت مركباتك الـ ${completedCount} بأمان للغد.`,
    sessionCurtainGraceBanner: (secondsLeft) =>
      `شارفت الجلسة على الانتهاء: لديك ${secondsLeft} ثانية لتثبيت القطع الأخيرة في هذه المركبة.`,
    sessionCurtainParentExtendBtn: 'دخول ولي الأمر (تمديد أو تعديل)',

    landingHeroTitle: 'ابنِ أولى آلاتك!',
    landingHeroCTA: 'جرّب مجاناً ←',
    landingBadgeNoAds: '0% إعلانات',
    landingBadgeOffline: '100% بلا إنترنت',
    landingBadgeTTS: 'نطق FR/EN/AR',
    landingUniversesTitle: '5 عوالم ميكانيكية',
    landingPricingTitle: 'الأسعار',
    landingSchoolTitle: 'هل مدرستك مهتمة؟',
    landingSchoolSubmit: 'إرسال طلب',
    landingSchoolThanks: 'شكراً، سنتواصل معك قريباً!',
    landingBuyBtn: 'شراء',
    landingSchoolContact: 'طلب عرض سعر',
    landingSchoolPricingTitle: 'أسعار المدارس',

    teacherNavBtn: 'معلم 🎓',
    teacherDashboardTitle: 'فضاء المعلم',
    teacherDashboardSubtitle: (org: string) => `المدرسة: ${org}`,
    closeTeacherDashboardAria: 'إغلاق فضاء المعلم',
    teacherStudentsTitle: 'الطلاب',
    teacherNoStudents: 'لم يتم العثور على ملفات الطلاب.',
    teacherStagesLabel: (c, t) => `${c} / ${t} مراحل`,
    teacherStreakLabel: (d) => `السلسلة: ${d}ي`,
    teacherBadgesLabel: (n) => `${n} شارات`,
    teacherExportPdfBtn: 'تصدير PDF',
    teacherLicenseSectionTitle: 'ترخيص المدرسة',
    teacherLicenseSectionDesc: 'أدخل مفتاح الترخيص المقدم من مؤسستك.',
    teacherLicenseKeyPlaceholder: 'مفتاح الترخيص (SK-… أو base64)',
    teacherActivateBtn: 'تفعيل',
    teacherLicenseInvalidMsg: 'تنسيق المفتاح غير صالح. تحقق من المفتاح المقدم.',
    teacherLicenseActivatedToast: 'تم تفعيل ترخيص المدرسة بنجاح.',
    teacherSchoolLabel: 'المدرسة',
    teacherClassCodeTitle: 'رمز الفصل',
    teacherClassCodeDesc: 'شارك هذا الرمز مع طلابك لربطهم بهذا الفصل.',
    teacherClassCodeCopied: 'تم النسخ!',
    teacherClassCodeGenerate: 'رمز جديد',
    teacherMissionsTitle: 'المهام المُسندة',
    teacherMissionsDesc: 'اختر من 1 إلى 3 مهام للفصل.',
    teacherProgressGridTitle: 'شبكة التقدم',
    teacherProgressNotStarted: 'لم يبدأ',
    teacherProgressInProgress: 'جارٍ',
    teacherProgressDone: 'مكتمل',
    teacherProgressError: 'يواجه صعوبات',

    licenseModalTitle: 'تفعيل مفتاح الترخيص',
    licenseModalSubtitle: 'أدخل مفتاحك لفتح الباقة العائلية أو خطة المدرسة.',
    licenseInputPlaceholder: 'مثال: MK3D-XXXX-XXXX-XXXX',
    licenseActivateBtn: 'تفعيل',
    licenseActivating: 'جارٍ التحقق…',
    licenseSuccessMsg: '✓ تم تفعيل الترخيص!',
    licenseInvalidMsg: 'المفتاح غير صالح أو منتهي الصلاحية.',
    licenseHaveKeyBtn: 'لديّ مفتاح بالفعل',
    licenseTypeLabel: 'نوع الترخيص',
    licenseExpiryLabel: 'تنتهي في',
    licenseSeatsLabel: 'المقاعد المسموح بها',
    licenseContactBtn: 'تواصل للحصول على ترخيص مدرسي',
    licenseTypeClasse: 'فصل دراسي',
    licenseTypeEcole: 'مدرسة',
    licenseTypeReseau: 'شبكة',

  },
};


/** Catalogue extensions: the same parts, workshop and discovery path in every language. */
export const HERITAGE_BUILD_TEXT = {
  aqueduct: {
    name: ['Aqueduc aux trois arches', 'Three-arch aqueduct', 'قناة مائية بثلاثة أقواس'],
    goal: ['Monte les piles et les cintres, ferme les arches avec leurs clés, puis construis le canal.', 'Build the piers and centering, close the arches with their keystones, then build the channel.', 'ابن الركائز والقوالب وأغلق الأقواس بأحجار العقد ثم ابن القناة.'],
    why: ['Les pierres d’une arche se transmettent des efforts de compression jusqu’aux appuis. Le cintre soutient les pierres pendant le montage.', 'Arch stones transmit compression forces to the supports. Centering supports the stones during construction.', 'تنقل أحجار القوس قوى الضغط إلى الركائز، ويدعم القالب الأحجار أثناء البناء.'],
    fact: ['Les aqueducs pouvaient franchir des vallées sur des arches. Ce modèle simplifie le canal : il ne simule pas les mesures de pente ou de débit.', 'Aqueducts could cross valleys on arches. This model simplifies the channel: it does not simulate slope or flow measurements.', 'استطاعت القنوات المائية عبور الوديان فوق أقواس. يبسط هذا النموذج القناة ولا يحاكي قياسات الميل أو التدفق.'],
  },
  dome: {
    name: ['Dôme à charpente triangulée', 'Triangulated frame dome', 'قبة بهيكل مثلث'],
    goal: ['Ferme la couronne basse, assemble les triangles et relie les barres au sommet.', 'Close the lower ring, assemble the triangles and join the struts at the top.', 'أغلق الحلقة السفلى وركّب المثلثات واربط القضبان عند القمة.'],
    why: ['Les barres forment des triangles entre les nœuds. Cette organisation limite les changements de forme du cadre.', 'Struts form triangles between the joints. This arrangement limits changes in the frame’s shape.', 'تكوّن القضبان مثلثات بين العقد، مما يحد من تغير شكل الإطار.'],
    fact: ['Une charpente peut porter une couverture sans remplir tout son volume. Ce modèle laisse les triangles ouverts pour observer leur assemblage.', 'A frame can support a cover without filling its entire volume. This model leaves the triangles open so their connections can be seen.', 'يمكن لهيكل أن يحمل غطاء دون ملء حجمه كله. يترك هذا النموذج المثلثات مفتوحة لملاحظة توصيلاتها.'],
  },
  beacon: {
    name: ['Tour solaire à double alimentation', 'Dual-source solar beacon', 'برج شمسي بمصدرَي طاقة'],
    goal: ['Monte la tour et son circuit, puis compare l’alimentation solaire et la batterie.', 'Build the tower and its circuit, then compare solar and battery power.', 'ابن البرج ودائرته ثم قارن الطاقة الشمسية بطاقة البطارية.'],
    why: ['Le sélecteur choisit une source d’énergie. Les panneaux ont besoin de lumière ; une batterie chargée peut alimenter la LED dans l’obscurité.', 'The selector chooses an energy source. Panels need light; a charged battery can power the LED in the dark.', 'يختار المفتاح مصدر الطاقة. تحتاج الألواح إلى الضوء، ويمكن لبطارية مشحونة تشغيل الصمام في الظلام.'],
    fact: ['Une batterie stocke de l’énergie. Dans cet essai simplifié, sa charge se règle directement : le modèle ne simule pas le temps de recharge.', 'A battery stores energy. In this simplified trial, its charge is set directly: the model does not simulate charging time.', 'تخزن البطارية الطاقة. في هذه التجربة المبسطة تُضبط شحنتها مباشرة ولا يحاكي النموذج زمن الشحن.'],
  },
  keep: {
    name: ['Mon premier donjon', 'My first castle keep', 'برجي الأول في القلعة'],
    goal: ['Monte les murs, conserve l’ouverture de la porte et pose les merlons.', 'Build the walls, keep the doorway open and place the merlons.', 'ابن الجدران وأبق فتحة الباب مفتوحة ثم ضع الشرافات.'],
    why: ['Les murs portent la plateforme supérieure. Le linteau couvre la porte sans fermer le passage.', 'Walls support the upper platform. The lintel spans the doorway without closing the passage.', 'تحمل الجدران المنصة العلوية، ويغطي العتب الباب دون إغلاق الممر.'],
    fact: ['Un donjon est une tour importante dans certains châteaux. Ce modèle simplifié permet de reconnaître les murs, le linteau et les merlons.', 'A keep is an important tower in some castles. This simplified model introduces walls, a lintel and merlons.', 'البرج الرئيسي عنصر مهم في بعض القلاع. يعرّف هذا النموذج المبسط بالجدران والعتب والشرافات.'],
  },
  watermill: {
    name: ['Roue à eau du moulin', 'Mill waterwheel', 'ناعورة الطاحونة'],
    goal: ['Construis le bâtiment, les paliers et la roue à palettes, puis ouvre l’eau.', 'Build the mill house, bearings and paddle wheel, then open the water.', 'ابن مبنى الطاحونة والمحامل والعجلة ذات الريش، ثم افتح الماء.'],
    why: ['L’eau pousse les palettes et fait tourner la roue et son arbre. Les paliers maintiennent l’arbre en place.', 'Water pushes the paddles and turns the wheel and its shaft. Bearings hold the shaft in place.', 'يدفع الماء الريش فتدور العجلة وعمودها، وتثبت المحامل العمود في مكانه.'],
    fact: ['Des moulins utilisaient l’énergie de l’eau pour entraîner des machines. Ce modèle montre la roue ; il ne représente pas la transmission vers les meules.', 'Mills used water power to drive machinery. This model shows the wheel; it does not represent the transmission to the millstones.', 'استخدمت طواحين طاقة الماء لتشغيل الآلات. يُظهر هذا النموذج العجلة ولا يمثل نقل الحركة إلى أحجار الطحن.'],
  },
  temple: {
    name: ['Temple antique à colonnes', 'Ancient columned temple', 'معبد قديم ذو أعمدة'],
    goal: ['Superpose les tambours des colonnes, pose les chapiteaux et ferme le toit.', 'Stack the column drums, place the capitals and complete the roof.', 'رص أسطوانات الأعمدة وضع التيجان وأكمل السقف.'],
    why: ['Les tambours superposés forment les colonnes. Les chapiteaux portent les poutres placées sous le toit.', 'Stacked drums form the columns. Capitals support the beams beneath the roof.', 'تكوّن الأسطوانات المتراكبة الأعمدة، وتحمل التيجان العوارض الواقعة تحت السقف.'],
    fact: ['Les colonnes de certains temples grecs étaient assemblées en tambours de pierre. Ce modèle est une évocation simplifiée, pas la reproduction d’un monument précis.', 'Columns in some Greek temples were assembled from stone drums. This is a simplified interpretation, not a reproduction of a specific monument.', 'جُمعت أعمدة بعض المعابد اليونانية من أسطوانات حجرية. هذا نموذج مبسط وليس نسخة من معلم محدد.'],
  },
  truss: {
    name: ['Viaduc à treillis', 'Truss viaduct', 'جسر شبكي'],
    goal: ['Relie les piles, monte le tablier et construis les treillis triangulés.', 'Connect the piers, assemble the deck and build the triangular trusses.', 'اربط الركائز وركّب سطح الجسر وابن الجمالونات المثلثة.'],
    why: ['Les montants et les diagonales forment des triangles qui limitent la déformation du tablier.', 'Uprights and diagonals form triangles that limit deformation of the deck.', 'تكوّن القوائم والدعامات القطرية مثلثات تحد من تشوه سطح الجسر.'],
    fact: ['Dans un treillis, certaines barres sont tirées et d’autres comprimées quand une charge passe.', 'In a truss, some members are pulled and others compressed as a load crosses.', 'في الجمالون تتعرض بعض القضبان للشد وأخرى للضغط عند مرور حمولة.'],
  },
  castle: {
    name: ['Château des quatre tours', 'Four-tower castle', 'قلعة الأبراج الأربعة'],
    goal: ['Construis les fondations, les courtines, les tours et la porte.', 'Build the foundations, curtain walls, towers and gate.', 'ابن الأساسات والأسوار والأبراج والبوابة.'],
    why: ['La courtine relie les tours. Le passage de la porte reste libre sous son linteau.', 'A curtain wall connects the towers. The gateway stays clear beneath its lintel.', 'يربط السور الأبراج، ويبقى ممر البوابة مفتوحاً تحت العتب.'],
    fact: ['Ce modèle imaginaire reprend des éléments de châteaux médiévaux : enceinte, tours et porte fortifiée.', 'This imaginary model uses elements of medieval castles: enclosure, towers and a fortified gate.', 'يستعمل هذا النموذج الخيالي عناصر القلاع في العصور الوسطى: سوراً وأبراجاً وبوابة محصنة.'],
  },
  yurt: {
    name: ['Yourte des steppes', 'Steppe yurt', 'خيمة السهوب الدائرية'],
    goal: ['Assemble le plancher, les montants et la charpente d’une habitation démontable.', 'Assemble the floor, uprights and frame of a portable home.', 'ركّب الأرضية والقوائم وهيكل مسكن قابل للفك.'],
    why: ['Les montants portent les perches inclinées du toit. Une couverture de feutre protège la charpente.', 'Uprights support the sloping roof poles. Felt covers protect the frame.', 'تحمل القوائم أعمدة السقف المائلة، ويحمي غطاء اللباد الهيكل.'],
    fact: ['La yourte, appelée ger en Mongolie, associe une ossature de bois et une couverture de feutre. Ce modèle en simplifie le treillis.', 'The yurt, called ger in Mongolia, combines a wooden frame with felt covers. This model simplifies its lattice.', 'تجمع الخيمة الدائرية، المسماة غير في منغوليا، بين هيكل خشبي وغطاء لبادي. يبسط هذا النموذج شبكتها.'],
  },
  gantry: {
    name: ['Portique de chantier', 'Construction gantry', 'رافعة بوابية للورشة'],
    goal: ['Monte deux tours contreventées, leur traverse et le chariot de levage.', 'Build two braced towers, their crossbeam and lifting trolley.', 'ركّب برجين مدعمين والعارضة بينهما وعربة الرفع.'],
    why: ['Les diagonales empêchent le cadre de se déformer. La traverse transmet la charge aux deux tours.', 'Diagonal braces stop the frame from deforming. The crossbeam carries the load to both towers.', 'تمنع الدعامات القطرية تشوه الإطار، وتنقل العارضة الحمل إلى البرجين.'],
    fact: ['Un portique permet de déplacer une charge dans l’espace libre entre ses supports.', 'A gantry moves a load in the open space between its supports.', 'تتيح الرافعة البوابية تحريك حمولة في المساحة الحرة بين دعامتيها.'],
  },
} as const;
export const HERITAGE_PART_TEXT = {
  centering: { name: ['Cintre de construction', 'Construction centering', 'قالب بناء القوس'], hint: ['Soutient les pierres jusqu’à la fermeture de l’arche.', 'Support the stones until the arch is closed.', 'ادعم الأحجار حتى يكتمل القوس.'] },
  voussoir: { name: ['Claveau', 'Voussoir', 'حجر قوسي'], hint: ['Prolonge l’arche depuis son appui vers le sommet.', 'Extend the arch from its support towards the top.', 'أكمل القوس من الركيزة نحو القمة.'] },
  keystone: { name: ['Clé de voûte', 'Keystone', 'حجر العقد'], hint: ['Ferme l’arche entre les deux demi-arcs.', 'Close the arch between its two halves.', 'أغلق القوس بين نصفيه.'] },
  spandrel: { name: ['Maçonnerie au-dessus de l’arche', 'Masonry above the arch', 'بناء فوق القوس'], hint: ['Complète l’espace entre le dos de l’arche et le canal.', 'Fill the space between the back of the arch and the channel.', 'أكمل الفراغ بين ظهر القوس والقناة.'] },
  footJoint: { name: ['Nœud de base', 'Base joint', 'عقدة القاعدة'], hint: ['Ancre les barres de la couronne basse sur le socle.', 'Anchor the lower-ring struts to the foundation.', 'ثبّت قضبان الحلقة السفلى على القاعدة.'] },
  middleJoint: { name: ['Nœud intermédiaire', 'Middle joint', 'عقدة وسطى'], hint: ['Réunit les deux diagonales qui montent depuis la base.', 'Join the two diagonals rising from the base.', 'اربط الدعامتين القطريتين الصاعدتين من القاعدة.'] },
  apexJoint: { name: ['Nœud du sommet', 'Apex joint', 'عقدة القمة'], hint: ['Réunit les barres de la dernière couronne.', 'Join the struts of the final ring.', 'اربط قضبان الحلقة الأخيرة.'] },
  strut: { name: ['Barre de charpente', 'Frame strut', 'قضيب الهيكل'], hint: ['Relie deux nœuds et ferme un côté du triangle.', 'Join two joints and close one side of the triangle.', 'اربط عقدتين وأكمل ضلعاً من المثلث.'] },
  battery: { name: ['Bloc de batterie', 'Battery pack', 'حزمة بطارية'], hint: ['Stocke l’énergie utilisée quand le soleil manque.', 'Store energy for use when sunlight is unavailable.', 'خزّن الطاقة لاستخدامها عند غياب ضوء الشمس.'] },
  solar: { name: ['Panneau photovoltaïque', 'Photovoltaic panel', 'لوح كهروضوئي'], hint: ['Transforme la lumière en énergie électrique.', 'Convert light into electrical energy.', 'حوّل الضوء إلى طاقة كهربائية.'] },
  junction: { name: ['Boîtier collecteur', 'Collector box', 'صندوق تجميع'], hint: ['Regroupe les raccords des panneaux.', 'Bring the panel connections together.', 'اجمع توصيلات الألواح.'] },
  selector: { name: ['Sélecteur de source', 'Source selector', 'مفتاح اختيار المصدر'], hint: ['Choisit les panneaux ou la batterie pour alimenter la lampe.', 'Choose panels or the battery to power the lamp.', 'اختر الألواح أو البطارية لتغذية المصباح.'] },
  resistor: { name: ['Résistance de protection', 'Protective resistor', 'مقاومة حماية'], hint: ['Limite le courant dans la LED.', 'Limit current through the LED.', 'حدّ من التيار المار في الصمام الضوئي.'] },
  lamp: { name: ['LED du phare', 'Beacon LED', 'صمام المنارة الضوئي'], hint: ['Émet de la lumière quand le circuit est alimenté.', 'Emit light when the circuit receives power.', 'أصدر الضوء عندما تتغذى الدائرة بالطاقة.'] },
  wire: { name: ['Fil de connexion', 'Connection wire', 'سلك توصيل'], hint: ['Relie les deux bornes indiquées par son parcours.', 'Join the two terminals shown by its route.', 'اربط الطرفين اللذين يحددهما مسار السلك.'] },
  infill: { name: ['Pan de mur', 'Wall panel', 'لوح جدار'], hint: ['Ferme une partie de la façade entre les montants.', 'Fill a section of the facade between the uprights.', 'أغلق جزءاً من الواجهة بين القوائم.'] },
  bearing: { name: ['Palier de l’arbre', 'Shaft bearing', 'محمل العمود'], hint: ['Maintient l’arbre en place tout en permettant sa rotation.', 'Hold the shaft in place while allowing it to turn.', 'ثبّت العمود مع السماح له بالدوران.'] },
  shaft: { name: ['Arbre de la roue', 'Wheel shaft', 'عمود العجلة'], hint: ['Transmet la rotation de la roue.', 'Transmit the rotation of the wheel.', 'انقل دوران العجلة.'] },
  spoke: { name: ['Rayon de roue', 'Wheel spoke', 'شعاع العجلة'], hint: ['Relie le moyeu à la jante de la roue.', 'Connect the hub to the wheel rim.', 'اربط محور العجلة بإطارها.'] },
  hub: { name: ['Moyeu de la roue à eau', 'Waterwheel hub', 'صرة الناعورة'], hint: ['Fixe les rayons sur l’arbre.', 'Attach the spokes to the shaft.', 'ثبّت الأشعة على العمود.'] },
  rim: { name: ['Segment de jante', 'Rim segment', 'جزء من إطار العجلة'], hint: ['Relie deux rayons voisins.', 'Join two neighbouring spokes.', 'اربط شعاعين متجاورين.'] },
  paddle: { name: ['Palette de roue', 'Wheel paddle', 'ريشة العجلة'], hint: ['Reçoit la poussée de l’eau.', 'Receive the push of the water.', 'استقبل دفع الماء.'] },
  channel: { name: ['Élément du canal', 'Channel section', 'جزء من القناة'], hint: ['Guide l’eau sous la roue.', 'Guide water beneath the wheel.', 'وجّه الماء أسفل العجلة.'] },
  drum: { name: ['Tambour de colonne', 'Column drum', 'أسطوانة عمود'], hint: ['Aligne le centre de ce tambour avec celui de la pièce du dessous.', 'Align the centre of this drum with the piece beneath it.', 'حاذ مركز هذه الأسطوانة مع مركز القطعة أسفلها.'] },
  capital: { name: ['Chapiteau', 'Capital', 'تاج عمود'], hint: ['Élargit l’appui au sommet de la colonne.', 'Widen the support at the top of the column.', 'وسّع مساحة الارتكاز في أعلى العمود.'] },
  roofPanel: { name: ['Pan de toiture', 'Roof slope', 'جزء مائل من السقف'], hint: ['Prend appui sur les poutres sous le toit.', 'Rest on the beams beneath the roof.', 'استند إلى العوارض أسفل السقف.'] },
  base: { name: ['Fondation', 'Foundation', 'أساس'], hint: ['Pose une base stable pour la structure.', 'Provide a stable base for the structure.', 'ضع قاعدة ثابتة للهيكل.'] },
  floor: { name: ['Dalle de plancher', 'Floor slab', 'بلاطة أرضية'], hint: ['Relie les appuis pour former le plancher.', 'Connect the supports to form the floor.', 'اربط الدعامات لتكوين الأرضية.'] },
  wall: { name: ['Bloc de courtine', 'Curtain-wall block', 'كتلة سور'], hint: ['Prolonge le mur sans fermer le passage de la porte.', 'Extend the wall without closing the gateway.', 'أكمل السور دون إغلاق ممر البوابة.'] },
  tower: { name: ['Étage de tour', 'Tower level', 'طابق برج'], hint: ['Empile cet étage sur le précédent.', 'Stack this level on the one below.', 'ضع هذا الطابق فوق الطابق السابق.'] },
  battlement: { name: ['Merlon', 'Merlon', 'شرافة'], hint: ['Couronne le sommet du mur ou de la tour.', 'Crown the top of the wall or tower.', 'أكمل قمة السور أو البرج.'] },
  lintel: { name: ['Linteau de porte', 'Gate lintel', 'عتب البوابة'], hint: ['Relie les jambages en laissant un passage dessous.', 'Join the jambs while leaving a passage beneath.', 'اربط جانبي الباب واترك ممراً أسفل العتب.'] },
  post: { name: ['Montant porteur', 'Load-bearing upright', 'قائم حامل'], hint: ['Porte la charpente au-dessus du plancher.', 'Support the frame above the floor.', 'احمل الهيكل فوق الأرضية.'] },
  beam: { name: ['Poutre de liaison', 'Connecting beam', 'عارضة ربط'], hint: ['Relie deux éléments porteurs.', 'Connect two supporting elements.', 'اربط عنصرين حاملين.'] },
  brace: { name: ['Contreventement', 'Diagonal brace', 'دعامة قطرية'], hint: ['Forme un triangle pour rigidifier le cadre.', 'Form a triangle to stiffen the frame.', 'كوّن مثلثاً لتقوية الإطار.'] },
  roof: { name: ['Couverture de feutre', 'Felt roof cover', 'غطاء سقف لبادي'], hint: ['Couvre les perches du toit.', 'Cover the roof poles.', 'غطّ أعمدة السقف.'] },
  pole: { name: ['Perche de toit', 'Roof pole', 'عمود سقف'], hint: ['Relie un montant à la couronne centrale.', 'Join an upright to the central roof ring.', 'اربط القائم بحلقة السقف المركزية.'] },
  cover: { name: ['Panneau de feutre', 'Felt wall panel', 'لوح جدار لبادي'], hint: ['Protège la paroi entre deux montants.', 'Protect the wall between two uprights.', 'احم الجدار بين قائمين.'] },
  trolley: { name: ['Chariot de levage', 'Lifting trolley', 'عربة الرفع'], hint: ['Prend appui sur la traverse du portique.', 'Ride on the gantry crossbeam.', 'استند إلى عارضة الرافعة.'] },
  winch: { name: ['Tambour du treuil', 'Winch drum', 'أسطوانة الونش'], hint: ['Porte le câble de levage.', 'Carry the lifting cable.', 'احمل كابل الرفع.'] },
  cable: { name: ['Câble de levage', 'Lifting cable', 'كابل الرفع'], hint: ['Relie le treuil à la charge.', 'Connect the winch to the load.', 'اربط الونش بالحمولة.'] },
  load: { name: ['Charge du portique', 'Gantry load', 'حمولة الرافعة'], hint: ['Se suspend au câble de levage.', 'Hang from the lifting cable.', 'تعلق بكابل الرفع.'] },
} as const;

export const HERITAGE_QUIZ_TEXT = {
  prompt: ['Quel principe de construction décrit ce modèle historique ?', 'Which construction principle describes this historical model?', 'أي مبدأ بناء يصف هذا النموذج التاريخي؟'],
  distractors: [
    ['Le toit tient en l’air sans aucun appui.', 'The roof stays in the air without any support.', 'يبقى السقف في الهواء دون أي دعامة.'],
    ['Les murs reposent sur le toit au lieu des fondations.', 'The walls rest on the roof instead of the foundations.', 'ترتكز الجدران على السقف بدلاً من الأساسات.'],
  ],
} as const;

export const WATERMILL_TRIAL_TEXT = {
  title: ['Alimente la roue à eau', 'Power the waterwheel', 'شغّل الناعورة بالماء'],
  off: ['Vanne fermée : la roue reste immobile.', 'Gate closed: the wheel stays still.', 'البوابة مغلقة: العجلة ثابتة.'],
  low: ['Petit débit : la roue tourne lentement.', 'Low flow: the wheel turns slowly.', 'تدفق قليل: تدور العجلة ببطء.'],
  high: ['Grand débit : la roue tourne plus vite.', 'High flow: the wheel turns faster.', 'تدفق كبير: تدور العجلة أسرع.'],
  stop: ['Fermer l’eau', 'Close the water', 'أغلق الماء'],
  slow: ['Petit débit', 'Low flow', 'تدفق قليل'],
  fast: ['Grand débit', 'High flow', 'تدفق كبير'],
} as const;

export const HERITAGE_JUNIOR_TEXT = {
  tier: ['Premiers bâtisseurs', 'First builders', 'البنّاؤون المبتدئون'],
  age: ['6–8 ans · montage guidé', 'Ages 6–8 · guided build', 'من 6 إلى 8 سنوات · تركيب موجّه'],
} as const;

export const BEACON_TRIAL_TEXT = {
  title: ['Choisis l’énergie du phare', 'Choose the beacon’s energy', 'اختر طاقة المنارة'],
  source: ['Source', 'Source', 'المصدر'], solar: ['Panneaux', 'Panels', 'الألواح'], battery: ['Batterie', 'Battery', 'البطارية'],
  light: ['Lumière sur les panneaux', 'Light on the panels', 'الضوء على الألواح'], day: ['Jour', 'Day', 'نهار'], night: ['Nuit', 'Night', 'ليل'],
  charge: ['Énergie dans la batterie', 'Energy in the battery', 'طاقة البطارية'], full: ['Chargée', 'Charged', 'مشحونة'], empty: ['Vide', 'Empty', 'فارغة'],
  touch: ['Tu peux aussi toucher le sélecteur sur le plateau pour changer de source.', 'You can also tap the selector on the workbench to change source.', 'يمكنك أيضاً لمس مفتاح الاختيار على المنصة لتغيير المصدر.'],
  solarOn: ['La lumière alimente les panneaux : la LED s’allume.', 'Light powers the panels: the LED lights up.', 'يغذي الضوء الألواح فيضيء الصمام.'],
  solarOff: ['Sans lumière, les panneaux ne peuvent pas alimenter la LED.', 'Without light, the panels cannot power the LED.', 'لا تستطيع الألواح تشغيل الصمام دون ضوء.'],
  batteryOn: ['La batterie chargée alimente la LED, même la nuit.', 'The charged battery powers the LED, even at night.', 'تشغّل البطارية المشحونة الصمام حتى في الليل.'],
  batteryOff: ['La batterie est vide : choisis une source qui contient de l’énergie.', 'The battery is empty: choose a source that contains energy.', 'البطارية فارغة: اختر مصدراً يحتوي على طاقة.'],
} as const;

export const QUIZ_BUILD_PROMPTS = {
  fr: {
    foundation: (name: string) => `Pour assembler « ${name} », quelle pièce porteuse de base faut-il installer en premier ?`,
    role: (role: string) => `Quelle pièce assure ce rôle dans le modèle : « ${role} » ?`,
  },
  en: {
    foundation: (name: string) => `When building "${name}", which foundational support part must be installed first?`,
    role: (role: string) => `Which component has this role in the model: "${role}"?`,
  },
  ar: {
    foundation: (name: string) => `في نموذج «${name}»، ما القطعة الأساسية التي يجب تثبيتها أولاً لحمل بقية الأجزاء؟`,
    role: (role: string) => `أي قطعة تؤدي هذا الدور في النموذج: «${role}»؟`,
  },
};

export const AQUEDUCT_TRIAL_TEXT = {
  touch: ['Tu peux aussi toucher un cintre en bois pour retirer les cintres.', 'You can also tap a wooden centering to remove the centering.', 'يمكنك أيضاً لمس قالب خشبي لإزالة القوالب.'],
  title: ['Libère les trois arches', 'Release the three arches', 'حرّر الأقواس الثلاثة'],
  supported: ['Les cintres portent encore les arches. Toutes les clés sont maintenant en place.', 'The centering still supports the arches. All keystones are now in place.', 'ما زالت القوالب تدعم الأقواس، وقد وُضعت جميع أحجار العقد.'],
  released: ['Les arches fermées transmettent les charges aux piles. Les cintres peuvent être retirés.', 'The completed arches carry loads to the piers. The centering can be removed.', 'تنقل الأقواس المكتملة الأحمال إلى الركائز ويمكن إزالة القوالب.'],
  flowing: ['L’eau suit le canal porté par les arches.', 'Water follows the channel carried by the arches.', 'يتبع الماء القناة التي تحملها الأقواس.'],
  remove: ['Retirer les cintres', 'Remove the centering', 'أزل القوالب'],
  restore: ['Remettre les cintres', 'Replace the centering', 'أعد القوالب'],
  water: ['Faire passer l’eau', 'Let the water through', 'مرّر الماء'],
  stop: ['Arrêter l’eau', 'Stop the water', 'أوقف الماء'],
} as const;

export const PHONE_HUD_TEXT = {
  view: ['Vue', 'View', 'العرض'], listen: ['Écouter', 'Listen', 'استمع'], settings: ['Réglages', 'Settings', 'الإعدادات'],
} as const;
export const MISSION_PANEL_TEXT = {
  flow: ['Débit d’eau', 'Water flow', 'تدفق الماء'],
  infoShort: ['Infos', 'Info', 'معلومات'], assemble: ['Montage', 'Build', 'التركيب'], observe: ['Observer', 'Observe', 'لاحظ'],
  controls: ['Réglages', 'Settings', 'الإعدادات'], run: ['Tester', 'Test', 'جرّب'], replay: ['Rejouer', 'Replay', 'أعد'],
  info: ['Consigne et résultat', 'Instructions and result', 'التعليمات والنتيجة'],
  previous: ['Réglage précédent', 'Previous setting', 'الإعداد السابق'], next: ['Réglage suivant', 'Next setting', 'الإعداد التالي'],
  choose: ['Choisis un défi', 'Choose a challenge', 'اختر تحدياً'], close: ['Fermer', 'Close', 'أغلق'],
} as const;
