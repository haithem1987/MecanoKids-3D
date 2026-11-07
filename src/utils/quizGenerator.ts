import { HERITAGE_QUIZ_TEXT, QUIZ_BUILD_PROMPTS } from '../i18n/translations';
import { LanguageCode, VehicleBlueprint, VehicleCategory } from '../types/game';

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function hashSeed(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function deterministicShuffle<T>(items: T[], seed: number): T[] {
  const arr = [...items];
  let s = seed || 1;
  for (let i = arr.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) >>> 0;
    const j = s % (i + 1);
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const GENERIC_PART_DISTRACTORS: Record<LanguageCode, string[]> = {
  fr: [
    'Voile triangulaire de mât',
    'Quille lestée sous-marine',
    'Patin d’atterrissage polaire',
    'Godet d’excavation en acier',
    'Parabole de télémesure orbitale',
  ],
  en: [
    'Triangular mast sail',
    'Weighted underwater keel',
    'Polar landing skid',
    'Hardened steel excavator bucket',
    'Orbital telemetry dish',
  ],
  ar: [
    'شراع الصاري المثلث',
    'عارضة التوازن الغاطسة',
    'زلاجة الهبوط القطبية',
    'دلو الحفر الفولاذي',
    'طبق الاتصالات المداري',
  ],
};

const REAL_WORLD_DISTRACTORS: Record<LanguageCode, Record<Exclude<VehicleCategory, VehicleCategory.NATURE | VehicleCategory.HISTORY>, [string, string]>> = {
  fr: {
    [VehicleCategory.CAR]: [
      'Il utilise une quille lestée sous l’eau et la poussée d’Archimède pour flotter sur les vagues.',
      'Il éjecte du gaz brûlant dans le vide spatial sans avoir besoin d’air ni de route.',
    ],
    [VehicleCategory.BOAT]: [
      'Il presse des pneus larges contre le bitume grâce à un aileron inversé de circuit.',
      'Il descend sur la Lune grâce à des rétrofusées sans atmosphère ni eau autour de lui.',
    ],
    [VehicleCategory.PLANE]: [
      'Il creuse la roche grâce à une lame de bulldozer en acier pesant plusieurs dizaines de tonnes.',
      'Il flotte immobile grâce à de lourds ballasts remplis d’eau de mer à 4 000 mètres de profondeur.',
    ],
    [VehicleCategory.CONSTRUCTION]: [
      'Il franchit le mur du son à haute altitude grâce à une aile delta supersonique.',
      'Il déploie de grands panneaux solaires pliants en orbite autour de la Terre en apesanteur.',
    ],
    [VehicleCategory.SPACE]: [
      'Il s’appuie sur l’eau d’un canal grâce à deux flotteurs de catamaran et une voile.',
      'Il laboure la terre agricole grâce à un tambour rotatif et des pneus de tracteur.',
    ],
    [VehicleCategory.AEROSPACE]: [
      'Il roule sur asphalte grâce à des pneus slicks larges et un aileron de déportance.',
      'Il flotte sur les vagues grâce à une quille et des voiles capturant le vent.',
    ],
    [VehicleCategory.ELECTRONICS]: [
      'Il se propulse en brûlant du kérosène dans une chambre de combustion à haute pression.',
      'Il flotte sur l\'eau grâce à une coque étanche et déplace des tonnes de fret maritime.',
    ],
    [VehicleCategory.CHEMISTRY]: [
      'Il se déplace sur quatre roues grâce à un moteur thermique et un différentiel.',
      'Il navigue sur l\'eau avec une hélice immergée et un gouvernail pour changer de cap.',
    ],
    [VehicleCategory.PHYSICS]: [
      'Il se déplace sur quatre roues grâce à un moteur thermique et un différentiel.',
      'Il capte le courant électrique par des panneaux solaires et des circuits imprimés.',
    ],
  },
  en: {
    [VehicleCategory.CAR]: [
      'It relies on an underwater weighted keel and Archimedes buoyancy to float across ocean swells.',
      'It expels superheated gas in the vacuum of space with zero need for air or asphalt.',
    ],
    [VehicleCategory.BOAT]: [
      'It presses wide slick tires onto a racetrack using inverted aerodynamic wings.',
      'It lands on the Moon using retro-thrusters in total vacuum without water or air.',
    ],
    [VehicleCategory.PLANE]: [
      'It excavates solid granite rock using a multi-ton steel bulldozer blade on tracks.',
      'It dives 4,000 meters underwater by flooding heavy seawater ballast tanks.',
    ],
    [VehicleCategory.CONSTRUCTION]: [
      'It breaks the sound barrier in the stratosphere using swept supersonic delta wings.',
      'It unfolds delicate solar arrays in zero-gravity Earth orbit.',
    ],
    [VehicleCategory.SPACE]: [
      'It glides across harbor water on twin catamaran pontoons and a tall wind sail.',
      'It harvests grain fields using a wide agricultural header and tractor tires.',
    ],
    [VehicleCategory.AEROSPACE]: [
      'It grips the asphalt using slick wide tires and a downforce aerodynamic wing.',
      'It floats on water using a keel and sails that capture the wind.',
    ],
    [VehicleCategory.ELECTRONICS]: [
      'It propels itself by burning kerosene in a high-pressure combustion chamber.',
      'It floats on water using a watertight hull and carries tons of maritime cargo.',
    ],
    [VehicleCategory.CHEMISTRY]: [
      'It rolls on four wheels powered by an internal combustion engine and a differential.',
      'It sails on water with a submerged propeller and a rudder to change direction.',
    ],
    [VehicleCategory.PHYSICS]: [
      'It rolls on four wheels powered by an internal combustion engine and a differential.',
      'It captures electricity through solar panels and printed circuits.',
    ],
  },
  ar: {
    [VehicleCategory.CAR]: [
      'يعتمد على عارضة توازن غاطسة تحت الماء وقوة دفع أرخميدس للطفو فوق الأمواج.',
      'ينطلق في فراغ الفضاء الخارجي بنفث الغازات الساخنة دون حاجة إلى هواء أو طريق.',
    ],
    [VehicleCategory.BOAT]: [
      'يضغط إطارات السباق العريضة على الأسفلت بواسطة أجنحة سفلية مقلوبة.',
      'يهبط على سطح القمر بمحركات دفع عكسية في الفراغ التام بلا ماء أو هواء.',
    ],
    [VehicleCategory.PLANE]: [
      'يحفر الصخور الصلبة بواسطة شفرة جرافة فولاذية ثقيلة تسير على جنازير.',
      'يغوص إلى عمق 4000 متر تحت سطح المحيط بملء خزانات الغطس بمياه البحر.',
    ],
    [VehicleCategory.CONSTRUCTION]: [
      'يخترق حاجز الصوت على ارتفاعات شاهقة بفضل أجنحة دلتا الأسرع من الصوت.',
      'ينشر ألواحاً شمسية قابلة للطي في مدار انعدام الجاذبية حول الكوكب.',
    ],
    [VehicleCategory.SPACE]: [
      'ينزلق فوق مياه الميناء على عوامتين مزدوجتين وشراع هوائي مرتفع.',
      'يحصد الحقول الزراعية بواسطة أسطوانة دوّارة وإطارات جرار عريضة.',
    ],
    [VehicleCategory.AEROSPACE]: [
      'يتمسك بالإسفلت عبر إطارات سباق عريضة وجناح ديناميكي للضغط نحو الأسفل.',
      'يطفو على الماء بشكل عارضة توازن وأشرعة تلتقط قوة الريح.',
    ],
    [VehicleCategory.ELECTRONICS]: [
      'يندفع بحرق الكيروسين في غرفة احتراق عالية الضغط.',
      'يطفو على الماء بهيكل محكم الإغلاق وينقل أطناناً من البضائع البحرية.',
    ],
    [VehicleCategory.CHEMISTRY]: [
      'ينطلق على أربعة عجلات بمحرك احتراق داخلي وناقل حركة تفاضلي.',
      'يبحر على الماء بمروحة غاطسة ودفة للتوجيه.',
    ],
    [VehicleCategory.PHYSICS]: [
      'ينطلق على أربعة عجلات بمحرك احتراق داخلي وناقل حركة تفاضلي.',
      'يلتقط الكهرباء عبر الألواح الشمسية والدوائر المطبوعة.',
    ],
  },
};

function truncateCleanly(text: string, maxChars = 155): string {
  const clean = text.trim();
  if (clean.length <= maxChars) return clean;
  const firstSentenceEnd = clean.indexOf('.');
  if (firstSentenceEnd > 35 && firstSentenceEnd <= maxChars) {
    return clean.slice(0, firstSentenceEnd + 1);
  }
  return `${clean.slice(0, maxChars - 1).trim()}…`;
}

/**
 * Generates a deterministic, 100% offline 3-question Mechanical Engineering Quiz
 * tailored to the localized `VehicleBlueprint` in FR, EN, or AR.
 */
export function generateMechanicalQuiz(
  blueprint: VehicleBlueprint,
  lang: LanguageCode,
): QuizQuestion[] {
  const seed = hashSeed(`${blueprint.id}-${lang}`);
  const parts = blueprint.parts;

  // --- QUESTION 1: Root Structural Foundation (Assembly Order Logic) ---
  const rootPart = parts.find((p) => p.dependsOn.length === 0) ?? parts[0];
  const dependentParts = parts.filter((p) => p.id !== rootPart.id && p.dependsOn.length > 0);
  const q1DistractorsPool =
    dependentParts.length >= 2
      ? dependentParts.map((p) => p.name)
      : [
          ...dependentParts.map((p) => p.name),
          ...GENERIC_PART_DISTRACTORS[lang].filter((n) => n !== rootPart.name),
        ];
  const q1PickedDistractors = deterministicShuffle(
    Array.from(new Set(q1DistractorsPool.filter((n) => n !== rootPart.name))),
    seed + 11,
  ).slice(0, 2);

  const q1Options = deterministicShuffle(
    [rootPart.name, ...q1PickedDistractors],
    seed + 17,
  );
  const q1CorrectIndex = q1Options.indexOf(rootPart.name);

  const q1Prompt = QUIZ_BUILD_PROMPTS[lang].foundation(blueprint.name);

  const q1Explanation =
    lang === 'ar'
      ? `صحيح! «${rootPart.name}» هي البنية الأساسية: ${rootPart.roleHint}`
      : lang === 'en'
        ? `Exact! "${rootPart.name}" is the primary structural base: ${rootPart.roleHint}`
        : `Exact ! « ${rootPart.name} » constitue la base porteuse : ${rootPart.roleHint}`;

  // --- QUESTION 2: Key Mechanical Organ & Engineering Function ---
  const nonRootCandidates = parts.filter((p) => p.id !== rootPart.id);
  const targetOrgan =
    nonRootCandidates[seed % Math.max(1, nonRootCandidates.length)] ?? parts[parts.length - 1];

  const otherPartNames = parts
    .filter((p) => p.id !== targetOrgan.id)
    .map((p) => p.name);
  const q2Pool =
    otherPartNames.length >= 2
      ? otherPartNames
      : [...otherPartNames, ...GENERIC_PART_DISTRACTORS[lang]];
  const q2Distractors = deterministicShuffle(
    Array.from(new Set(q2Pool.filter((n) => n !== targetOrgan.name))),
    seed + 29,
  ).slice(0, 2);

  const q2Options = deterministicShuffle(
    [targetOrgan.name, ...q2Distractors],
    seed + 37,
  );
  const q2CorrectIndex = q2Options.indexOf(targetOrgan.name);

  const q2Prompt = QUIZ_BUILD_PROMPTS[lang].role(targetOrgan.roleHint);

  const q2Explanation =
    lang === 'ar'
      ? `أحسنت! القطعة المسؤولة هي «${targetOrgan.name}».`
      : lang === 'en'
        ? `Well spotted! That exact role belongs to "${targetOrgan.name}".`
        : `Bien vu ! C’est exactement le rôle de « ${targetOrgan.name} ».`;

  // --- QUESTION 3: Real-World Physics & Discovery Principle ---
  const correctFact = truncateCleanly(blueprint.discovery.howItWorks, 165);
  const locale = lang === 'fr' ? 0 : lang === 'en' ? 1 : 2;
  const [distA, distB] = blueprint.category === VehicleCategory.HISTORY
    ? HERITAGE_QUIZ_TEXT.distractors.map(row => row[locale])
    : REAL_WORLD_DISTRACTORS[lang][blueprint.category === VehicleCategory.NATURE ? VehicleCategory.PHYSICS : blueprint.category];
  const q3Options = deterministicShuffle([correctFact, distA, distB], seed + 53);
  const q3CorrectIndex = q3Options.indexOf(correctFact);

  const q3Prompt = blueprint.category === VehicleCategory.HISTORY ? HERITAGE_QUIZ_TEXT.prompt[locale] :
    lang === 'ar'
      ? `كيف تعمل «${blueprint.name}» في العالم الحقيقي حسب بطاقة الاكتشاف؟`
      : lang === 'en'
        ? `How does the real-life "${blueprint.name}" operate according to its Discovery Card?`
        : `Comment fonctionne véritablement « ${blueprint.name} » dans le monde réel ?`;

  const q3Explanation = truncateCleanly(blueprint.discovery.didYouKnow, 175);

  return [
    {
      id: `${blueprint.id}-q1`,
      prompt: q1Prompt,
      options: q1Options,
      correctIndex: Math.max(0, q1CorrectIndex),
      explanation: q1Explanation,
    },
    {
      id: `${blueprint.id}-q2`,
      prompt: q2Prompt,
      options: q2Options,
      correctIndex: Math.max(0, q2CorrectIndex),
      explanation: q2Explanation,
    },
    {
      id: `${blueprint.id}-q3`,
      prompt: q3Prompt,
      options: q3Options,
      correctIndex: Math.max(0, q3CorrectIndex),
      explanation: q3Explanation,
    },
  ];
}
