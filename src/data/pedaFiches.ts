export interface PedaFiche {
  id: string;
  titre: { fr: string; en: string; ar: string };
  explication: { fr: string; en: string; ar: string };
  activite: { fr: string; en: string; ar: string };
  svg: string; // inline SVG content (viewBox="0 0 120 90")
}

export const PEDA_FICHES: PedaFiche[] = [
  {
    id: 'engrenages',
    titre: { fr: 'Les engrenages', en: 'Gears', ar: 'التروس' },
    explication: {
      fr: 'Un engrenage est une roue dentée. Quand deux engrenages s\'engrènent, ils tournent en sens opposés. Le plus petit tourne plus vite que le grand.',
      en: 'A gear is a toothed wheel. When two gears mesh, they turn in opposite directions. The smaller one turns faster than the bigger one.',
      ar: 'التُّرس عجلةٌ مسنَّنة. حين يتشابك تُرسان يدوران في اتجاهين معاكسين. الأصغر يدور أسرع من الكبير.',
    },
    activite: {
      fr: 'Dessine deux engrenages qui se touchent et indique avec des flèches le sens de rotation de chacun.',
      en: 'Draw two meshing gears and use arrows to show the direction each one turns.',
      ar: 'ارسم تُرسَين متشابكَين وأشِر بالأسهم إلى اتجاه دوران كلٍّ منهما.',
    },
    svg: `<circle cx="38" cy="45" r="22" fill="none" stroke="#f97316" stroke-width="3"/>
<circle cx="38" cy="45" r="16" fill="#fed7aa"/>
${[0,30,60,90,120,150,180,210,240,270,300,330].map(a => `<rect x="35" y="20" width="6" height="8" fill="#f97316" rx="1" transform="rotate(${a} 38 45)"/>`).join('')}
<circle cx="82" cy="45" r="16" fill="none" stroke="#3b82f6" stroke-width="3"/>
<circle cx="82" cy="45" r="11" fill="#bfdbfe"/>
${[0,45,90,135,180,225,270,315].map(a => `<rect x="79" y="27" width="6" height="6" fill="#3b82f6" rx="1" transform="rotate(${a} 82 45)"/>`).join('')}
<path d="M20 35 Q28 28 32 38" stroke="#f97316" stroke-width="2" fill="none" marker-end="url(#arr)"/>
<path d="M100 55 Q92 62 88 52" stroke="#3b82f6" stroke-width="2" fill="none" marker-end="url(#arr2)"/>
<defs><marker id="arr" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#f97316"/></marker><marker id="arr2" markerWidth="6" markerHeight="6" refX="3" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="#3b82f6"/></marker></defs>`,
  },
  {
    id: 'transmission',
    titre: { fr: 'La transmission de mouvement', en: 'Movement Transmission', ar: 'نقل الحركة' },
    explication: {
      fr: 'Une chaîne ou une courroie transmet le mouvement d\'une roue à une autre, même si elles sont éloignées. Les deux roues tournent dans le même sens.',
      en: 'A chain or belt transmits movement from one wheel to another, even if they are far apart. Both wheels turn in the same direction.',
      ar: 'السلسلة أو السير ينقل الحركة من عجلة إلى أخرى حتى لو كانتا بعيدتين. تدوران في نفس الاتجاه.',
    },
    activite: {
      fr: 'Tire doucement une ceinture en boucle autour de deux stylos. Fais tourner un stylo et observe l\'autre.',
      en: 'Loop a rubber band around two pencils. Turn one pencil and watch the other.',
      ar: 'ضع حلقة مطاطية حول قلمَي رصاص. أدِر أحدهما وراقِب الآخر.',
    },
    svg: `<circle cx="30" cy="45" r="18" fill="#fde68a" stroke="#d97706" stroke-width="3"/>
<circle cx="90" cy="45" r="12" fill="#fde68a" stroke="#d97706" stroke-width="3"/>
<line x1="30" y1="27" x2="90" y2="33" stroke="#78716c" stroke-width="4"/>
<line x1="30" y1="63" x2="90" y2="57" stroke="#78716c" stroke-width="4"/>
<circle cx="30" cy="45" r="6" fill="#d97706"/>
<circle cx="90" cy="45" r="4" fill="#d97706"/>`,
  },
  {
    id: 'roues-essieux',
    titre: { fr: 'Les roues et les essieux', en: 'Wheels and Axles', ar: 'العجلات والمحاور' },
    explication: {
      fr: 'L\'essieu est une tige qui traverse la roue en son centre. Quand l\'essieu tourne, la roue tourne. Plus la roue est grande, plus on avance vite pour un même tour.',
      en: 'An axle is a rod that passes through the center of a wheel. When the axle turns, the wheel turns. A bigger wheel covers more distance per turn.',
      ar: 'المحور قضيبٌ يمر عبر مركز العجلة. حين يدور المحور تدور العجلة. العجلة الكبيرة تقطع مسافةً أكبر في كل دورة.',
    },
    activite: {
      fr: 'Roule deux objets ronds de tailles différentes. Lequel avance le plus loin avec un seul tour ?',
      en: 'Roll two round objects of different sizes. Which one travels further with one turn?',
      ar: 'دحرج جسمَين دائريَّين بحجمَين مختلفَين. أيهما يقطع مسافةً أبعد في دورة واحدة؟',
    },
    svg: `<ellipse cx="40" cy="55" rx="28" ry="28" fill="#dbeafe" stroke="#3b82f6" stroke-width="3"/>
<line x1="40" y1="27" x2="40" y2="83" stroke="#3b82f6" stroke-width="4"/>
<line x1="12" y1="55" x2="68" y2="55" stroke="#3b82f6" stroke-width="4"/>
<circle cx="40" cy="55" r="5" fill="#1d4ed8"/>
<line x1="68" y1="55" x2="108" y2="55" stroke="#94a3b8" stroke-width="4"/>
<ellipse cx="100" cy="55" rx="12" ry="12" fill="#dbeafe" stroke="#3b82f6" stroke-width="3"/>
<circle cx="100" cy="55" r="3" fill="#1d4ed8"/>`,
  },
  {
    id: 'leviers',
    titre: { fr: 'Les leviers', en: 'Levers', ar: 'الروافع' },
    explication: {
      fr: 'Un levier est une barre rigide qui pivote sur un point d\'appui. Il permet de soulever un objet lourd avec moins d\'effort. Plus le bras est long, plus on est puissant.',
      en: 'A lever is a rigid bar that pivots on a fulcrum. It lets you lift a heavy object with less effort. The longer the arm, the more powerful the lever.',
      ar: 'الرافعة قضيبٌ صلب يدور حول نقطة ارتكاز. تُمكِّنك من رفع جسمٍ ثقيل بجهدٍ أقل. كلما طال الذراع زادت القوة.',
    },
    activite: {
      fr: 'Place une règle sur un crayon (pivot). Mets un livre d\'un côté et appuie de l\'autre. Déplace le crayon et observe.',
      en: 'Place a ruler on a pencil (pivot). Put a book on one end and press the other. Move the pencil and observe.',
      ar: 'ضع مسطرة على قلم رصاص (نقطة ارتكاز). ضع كتاباً في طرفٍ واضغط على الطرف الآخر. حرِّك القلم ولاحِظ.',
    },
    svg: `<rect x="10" y="58" width="100" height="6" rx="3" fill="#94a3b8"/>
<polygon points="60,64 54,80 66,80" fill="#64748b"/>
<circle cx="25" cy="52" r="12" fill="#fca5a5" stroke="#ef4444" stroke-width="2"/>
<text x="25" y="57" text-anchor="middle" font-size="10" fill="#7f1d1d">🧱</text>
<circle cx="95" cy="52" r="8" fill="#86efac" stroke="#22c55e" stroke-width="2"/>
<path d="M92 48 L95 42 L98 48" fill="#22c55e"/>`,
  },
  {
    id: 'propulsion-solaire',
    titre: { fr: 'La propulsion solaire', en: 'Solar Propulsion', ar: 'الدفع الشمسي' },
    explication: {
      fr: 'Le soleil produit de la lumière qui peut être transformée en électricité grâce à des panneaux solaires. Cette électricité fait tourner un moteur qui déplace le véhicule.',
      en: 'The sun produces light that can be converted into electricity through solar panels. This electricity runs a motor that moves the vehicle.',
      ar: 'تُنتج الشمس ضوءاً يمكن تحويله إلى كهرباء عبر الألواح الشمسية. هذه الكهرباء تدير محركاً يحرِّك المركبة.',
    },
    activite: {
      fr: 'Cherche dans la maison ou l\'école des objets qui fonctionnent à l\'énergie solaire. Fais une liste.',
      en: 'Look around your home or school for objects that run on solar energy. Make a list.',
      ar: 'ابحث في المنزل أو المدرسة عن أشياء تعمل بالطاقة الشمسية. أعِد قائمة بها.',
    },
    svg: `<circle cx="30" cy="30" r="16" fill="#fef08a" stroke="#eab308" stroke-width="2"/>
${[0,45,90,135,180,225,270,315].map(a => `<line x1="30" y1="30" x2="${30+22*Math.cos(a*Math.PI/180)}" y2="${30+22*Math.sin(a*Math.PI/180)}" stroke="#eab308" stroke-width="2"/>`).join('')}
<rect x="55" y="55" width="52" height="22" rx="4" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
<rect x="60" y="50" width="12" height="10" rx="2" fill="#93c5fd"/>
<circle cx="65" cy="74" r="6" fill="#475569"/>
<circle cx="97" cy="74" r="6" fill="#475569"/>
<path d="M34 36 Q55 25 60 55" stroke="#eab308" stroke-width="2" stroke-dasharray="4,3" fill="none"/>`,
  },
  {
    id: 'flottabilite',
    titre: { fr: 'La flottabilité', en: 'Buoyancy', ar: 'الطفو' },
    explication: {
      fr: 'Un objet flotte si l\'eau qu\'il déplace pèse plus que lui. Les bateaux sont creux, ce qui leur permet de déplacer beaucoup d\'eau sans peser lourd.',
      en: 'An object floats if the water it displaces weighs more than it does. Boats are hollow, which lets them displace a lot of water without being heavy.',
      ar: 'يطفو الجسم إذا كانت كتلة الماء الذي يزيحه أكبر منه. القوارب مجوَّفة، مما يتيح لها إزاحة ماءٍ كثيرٍ دون أن تكون ثقيلة.',
    },
    activite: {
      fr: 'Prends une boule de pâte à modeler : elle coule. Façonne-la en bateau plat : elle flotte. Pourquoi ?',
      en: 'Take a ball of modelling clay — it sinks. Shape it into a flat boat — it floats. Why?',
      ar: 'خذ كرةً من الصلصال، ستغرق. اجعلها على شكل قارب مسطَّح، ستطفو. لماذا؟',
    },
    svg: `<rect x="5" y="55" width="110" height="30" rx="4" fill="#bae6fd"/>
<path d="M25 55 L35 35 L85 35 L95 55 Z" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
<line x1="60" y1="35" x2="60" y2="15" stroke="#78716c" stroke-width="3"/>
<polygon points="60,15 60,30 78,22" fill="#f97316"/>
<path d="M5 55 Q25 48 60 50 Q95 52 115 55" stroke="#38bdf8" stroke-width="2" fill="none"/>`,
  },
  {
    id: 'portance',
    titre: { fr: 'La portance (ailes)', en: 'Lift (Wings)', ar: 'القوة الرافعة (الأجنحة)' },
    explication: {
      fr: 'L\'aile d\'un avion est courbée sur le dessus et plate en dessous. L\'air passe plus vite au-dessus, créant une pression qui pousse l\'aile vers le haut.',
      en: 'An airplane wing is curved on top and flat on the bottom. Air moves faster over the top, creating lower pressure that pushes the wing upward.',
      ar: 'جناح الطائرة مقوَّس من فوق ومسطَّح من أسفل. يمر الهواء بسرعةٍ أكبر فوقه فيخلق ضغطاً منخفضاً يرفع الجناح.',
    },
    activite: {
      fr: 'Tiens une feuille de papier devant ta bouche et souffle dessus. Elle se soulève ! C\'est la portance.',
      en: 'Hold a sheet of paper in front of your mouth and blow over its top surface. It lifts up! That\'s lift.',
      ar: 'أمسك ورقةً أمام فمك وانفُخ فوق سطحها العلوي. ترتفع! هذه هي القوة الرافعة.',
    },
    svg: `<path d="M10 55 Q40 25 110 50 Q40 65 10 55 Z" fill="#bfdbfe" stroke="#3b82f6" stroke-width="2"/>
<path d="M15 52 Q45 30 108 50" stroke="#93c5fd" stroke-width="1.5" stroke-dasharray="3,2" fill="none"/>
<path d="M15 58 Q45 70 108 51" stroke="#6b7280" stroke-width="1" stroke-dasharray="2,2" fill="none"/>
<text x="30" y="38" font-size="8" fill="#1d4ed8">air rapide →</text>
<text x="30" y="72" font-size="8" fill="#374151">air lent →</text>
<path d="M62 50 L62 30" stroke="#ef4444" stroke-width="2" marker-end="url(#up)"/>
<text x="66" y="35" font-size="8" fill="#dc2626">portance</text>
<defs><marker id="up" markerWidth="6" markerHeight="6" refX="3" refY="6" orient="auto"><path d="M0,6 L3,0 L6,6 Z" fill="#ef4444"/></marker></defs>`,
  },
  {
    id: 'helice',
    titre: { fr: 'L\'hélice', en: 'The Propeller', ar: 'المروحة' },
    explication: {
      fr: 'L\'hélice tourne comme une vis dans l\'air ou dans l\'eau. En tournant, elle pousse le fluide vers l\'arrière, ce qui propulse le véhicule vers l\'avant.',
      en: 'A propeller spins like a screw in air or water. As it turns, it pushes fluid backward, which propels the vehicle forward.',
      ar: 'تدور المروحة كالبرغي في الهواء أو الماء. بدورانها تدفع السائل للخلف، مما يدفع المركبة للأمام.',
    },
    activite: {
      fr: 'Plie une feuille de papier en hélice et fais-la tomber. Elle tourne ! Essaie d\'autres angles de pliage.',
      en: 'Fold a strip of paper into a propeller shape and drop it. It spins! Try different fold angles.',
      ar: 'اثنِ شريطاً من الورق على شكل مروحة ودعه يسقط. يدور! جرِّب زوايا طيٍّ مختلفة.',
    },
    svg: `<circle cx="60" cy="45" r="6" fill="#475569"/>
<ellipse cx="60" cy="45" rx="28" ry="10" fill="#94a3b8" stroke="#475569" stroke-width="1.5" transform="rotate(-35 60 45)" opacity="0.8"/>
<ellipse cx="60" cy="45" rx="28" ry="10" fill="#cbd5e1" stroke="#475569" stroke-width="1.5" transform="rotate(85 60 45)" opacity="0.8"/>
<ellipse cx="60" cy="45" rx="28" ry="10" fill="#94a3b8" stroke="#475569" stroke-width="1.5" transform="rotate(205 60 45)" opacity="0.6"/>
<path d="M75 30 Q85 25 90 30" stroke="#64748b" stroke-width="1.5" fill="none" stroke-dasharray="2,2"/>
<text x="88" y="28" font-size="8" fill="#475569">↻</text>`,
  },
  {
    id: 'structures',
    titre: { fr: 'Les structures et triangles', en: 'Structures and Triangles', ar: 'الهياكل والمثلثات' },
    explication: {
      fr: 'Le triangle est la forme la plus rigide. Les ponts et les tours utilisent des triangles pour ne pas s\'effondrer. Un carré peut se déformer, pas un triangle.',
      en: 'The triangle is the most rigid shape. Bridges and towers use triangles to avoid collapsing. A square can bend out of shape, but a triangle cannot.',
      ar: 'المثلث هو الشكل الأكثر صلابةً. تستخدم الجسور والأبراج المثلثاتِ لتفادي الانهيار. يمكن تشويه المربع لكن ليس المثلث.',
    },
    activite: {
      fr: 'Fais des formes avec des cure-dents et de la pâte à modeler. Laquelle résiste le mieux à la pression ?',
      en: 'Make shapes with toothpicks and modelling clay. Which one resists pressure best?',
      ar: 'اصنع أشكالاً باستخدام أعواد الأسنان والصلصال. أيها يصمد أمام الضغط أكثر؟',
    },
    svg: `<polygon points="60,15 20,72 100,72" fill="none" stroke="#22c55e" stroke-width="3"/>
<line x1="20" y1="72" x2="100" y2="72" stroke="#22c55e" stroke-width="3"/>
<line x1="40" y1="43" x2="80" y2="43" stroke="#86efac" stroke-width="2"/>
<line x1="40" y1="43" x2="20" y2="72" stroke="#86efac" stroke-width="2"/>
<line x1="80" y1="43" x2="100" y2="72" stroke="#86efac" stroke-width="2"/>
<rect x="5" y="55" width="20" height="20" fill="none" stroke="#f87171" stroke-width="2" stroke-dasharray="4,2"/>
<path d="M5 55 L25 75" stroke="#f87171" stroke-width="1.5" stroke-dasharray="2,2"/>
<text x="2" y="52" font-size="8" fill="#ef4444">fragile</text>
<text x="48" y="88" font-size="8" fill="#16a34a">solide !</text>`,
  },
  {
    id: 'energie-mouvement',
    titre: { fr: 'L\'énergie et le mouvement', en: 'Energy and Motion', ar: 'الطاقة والحركة' },
    explication: {
      fr: 'Pour bouger, un objet a besoin d\'énergie. L\'énergie peut venir d\'un moteur, du vent, de l\'eau ou des muscles. Sans énergie, rien ne bouge.',
      en: 'To move, an object needs energy. Energy can come from a motor, wind, water, or muscles. Without energy, nothing moves.',
      ar: 'يحتاج الجسم إلى طاقةٍ ليتحرك. يمكن أن تأتي الطاقة من محركٍ أو الريح أو الماء أو العضلات. بدون طاقة لا شيء يتحرك.',
    },
    activite: {
      fr: 'Liste 5 sources d\'énergie que tu vois autour de toi. Lesquelles sont renouvelables (soleil, vent) ?',
      en: 'List 5 energy sources you see around you. Which are renewable (sun, wind)?',
      ar: 'اذكر 5 مصادر طاقةٍ تراها حولك. أيها متجددة (الشمس، الريح)؟',
    },
    svg: `<path d="M20 70 L20 40 L45 40 L45 50 L65 50 L65 30 L90 30 L90 70 Z" fill="none" stroke="#8b5cf6" stroke-width="2"/>
<path d="M20 70 L90 70" stroke="#64748b" stroke-width="2"/>
<circle cx="35" cy="55" r="8" fill="#c4b5fd"/>
<circle cx="55" cy="47" r="6" fill="#a78bfa"/>
<circle cx="75" cy="40" r="10" fill="#8b5cf6"/>
<text x="12" y="82" font-size="7" fill="#7c3aed">énergie potentielle</text>
<text x="68" y="82" font-size="7" fill="#4f46e5">→ cinétique</text>`,
  },
  {
    id: 'gravite-equilibre',
    titre: { fr: 'La gravité et l\'équilibre', en: 'Gravity and Balance', ar: 'الجاذبية والتوازن' },
    explication: {
      fr: 'La gravité attire tous les objets vers le sol. Un objet tient en équilibre quand son centre de gravité est au-dessus de son point d\'appui.',
      en: 'Gravity pulls all objects toward the ground. An object balances when its centre of gravity is directly above its support point.',
      ar: 'تجذب الجاذبية كل الأجسام نحو الأرض. يتوازن الجسم حين يقع مركز ثقله فوق نقطة ارتكازه مباشرةً.',
    },
    activite: {
      fr: 'Essaie d\'équilibrer une règle sur ton doigt. Bouge des petits objets dessus et observe comment le point d\'équilibre change.',
      en: 'Try to balance a ruler on your finger. Move small objects along it and watch how the balance point shifts.',
      ar: 'حاول موازنة مسطرةٍ على أصبعك. حرِّك أشياءً صغيرة عليها ولاحِظ كيف يتغير نقطة التوازن.',
    },
    svg: `<line x1="10" y1="70" x2="110" y2="70" stroke="#78716c" stroke-width="4" stroke-linecap="round"/>
<polygon points="60,70 54,82 66,82" fill="#64748b"/>
<rect x="18" y="52" width="16" height="18" rx="2" fill="#fca5a5" stroke="#ef4444" stroke-width="2"/>
<text x="21" y="65" font-size="10">📦</text>
<rect x="80" y="58" width="12" height="12" rx="2" fill="#86efac" stroke="#22c55e" stroke-width="2"/>
<text x="82" y="68" font-size="8">📦</text>
<path d="M60 68 L60 30" stroke="#94a3b8" stroke-width="1" stroke-dasharray="3,2"/>
<text x="62" y="28" font-size="8" fill="#475569">↓ G</text>`,
  },
  {
    id: 'machines-simples',
    titre: { fr: 'Les machines simples', en: 'Simple Machines', ar: 'الآلات البسيطة' },
    explication: {
      fr: 'Une machine simple est un outil qui facilite le travail. Il y en a 6 : levier, roue et essieu, poulie, plan incliné, coin et vis. Elles sont partout autour de nous.',
      en: 'A simple machine is a tool that makes work easier. There are 6 types: lever, wheel and axle, pulley, inclined plane, wedge and screw. They are all around us.',
      ar: 'الآلة البسيطة أداةٌ تُيسِّر العمل. هناك 6 أنواع: الرافعة، العجلة والمحور، البكرة، المستوى المائل، الوتد، والبرغي. إنها في كل مكان حولنا.',
    },
    activite: {
      fr: 'Cherche dans la classe 3 machines simples cachées dans des objets du quotidien (ciseaux, porte, rampe…).',
      en: 'Find 3 simple machines hidden in everyday objects in your classroom (scissors, door, ramp…).',
      ar: 'ابحث في الفصل عن 3 آلاتٍ بسيطة مخفية في أشياء يومية (مقص، باب، منحدر...).',
    },
    svg: `<line x1="15" y1="80" x2="105" y2="45" stroke="#94a3b8" stroke-width="3" stroke-linecap="round"/>
<rect x="8" y="78" width="10" height="8" rx="1" fill="#64748b"/>
<circle cx="85" cy="30" r="12" fill="#fde68a" stroke="#d97706" stroke-width="2"/>
<line x1="85" y1="18" x2="85" y2="42" stroke="#d97706" stroke-width="2"/>
<line x1="73" y1="30" x2="97" y2="30" stroke="#d97706" stroke-width="2"/>
<line x1="85" y1="42" x2="85" y2="62" stroke="#78716c" stroke-width="2"/>
<rect x="78" y="62" width="14" height="10" rx="1" fill="#bfdbfe" stroke="#3b82f6" stroke-width="1.5"/>
<text x="10" y="42" font-size="8" fill="#475569">plan incliné</text>
<text x="68" y="20" font-size="8" fill="#78350f">poulie</text>`,
  },
];
