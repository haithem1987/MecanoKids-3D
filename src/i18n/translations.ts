import { DiscoveryFacts, LanguageCode, VehicleBlueprint } from '../types/game';

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
  const ar = ARABIC_BLUEPRINTS[blueprint.id];
  if (!ar) return blueprint;

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
  progressSavedToast: string;
  progressImportedToast: string;
  progressImportErrorToast: string;
  progressResetToast: string;
  // Stage Catalog & LocalStorage Save Manager
  catalogTitle: string;
  catalogSubtitle: string;
  closeCatalogAria: string;
  filterAll: string;
  filterCars: string;
  filterBoats: string;
  filterPlanes: string;
  freeAccessActive: string;
  unlockAllBtn: string;
  unlockAllTitle: string;
  tier1Title: string;
  tier1Subtitle: string;
  tier2Title: string;
  tier2Subtitle: string;
  tier3Title: string;
  tier3Subtitle: string;
  catCar: string;
  catBoat: string;
  catPlane: string;
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
}

export const UI_TRANSLATIONS: Record<LanguageCode, UIStrings> = {
  fr: {
    appName: 'MécanoKids 3D',
    navAriaLabel: 'Navigation principale et styles 3D',
    stagesBtn: 'Stages & Sauvegarde',
    styleWood: 'Bois & Métal',
    styleWoodShort: 'Bois',
    styleBlocks: 'Blocs Modulaires',
    styleBlocksShort: 'Blocs',
    styleRealistic: 'Maquette Réaliste',
    styleRealisticShort: 'Réaliste',
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
    webglResetDesc: "L'affichage 3D reprend automatiquement dans un instant.",
    progressSavedToast: 'Progression enregistrée localement sur cet appareil.',
    progressImportedToast: 'Sauvegarde restaurée avec succès !',
    progressImportErrorToast: 'Fichier de sauvegarde invalide.',
    progressResetToast: 'Toute la progression a été réinitialisée.',
    catalogTitle: 'Carnet des Stages & Sauvegarde',
    catalogSubtitle:
      'Ta progression et ton niveau actuel sont enregistrés automatiquement sur cet ordinateur.',
    closeCatalogAria: 'Fermer le catalogue',
    filterAll: 'Tous',
    filterCars: 'Voitures',
    filterBoats: 'Bateaux',
    filterPlanes: 'Avions & Hélicos',
    freeAccessActive: 'Accès libre activé',
    unlockAllBtn: 'Débloquer tout',
    unlockAllTitle: "Permet d'essayer immédiatement tous les niveaux (accès parents / enseignants)",
    tier1Title: '01. Palier Découverte — Premiers Assemblages',
    tier1Subtitle: '4 à 5 pièces larges · Aimantation généreuse pour apprivoiser la 3D',
    tier2Title: '02. Palier Atelier — Mécanismes par Couches',
    tier2Subtitle: '7 à 8 pièces · Montage logique du moteur et de la coque avant la cabine',
    tier3Title: '03. Palier Ingénieur — Grandes Constructions',
    tier3Subtitle: '10 à 11 pièces · Sous-ensembles techniques précis et silhouettes progressives',
    catCar: 'Voiture & Terre',
    catBoat: 'Bateau & Mer',
    catPlane: 'Avion & Air',
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
          'En haut, bascule à tout moment entre Bois, Blocs et Maquette Réaliste, change la langue (FR / العربية), ou clique sur « Indice Mécanique » si tu hésites !',
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
    webglResetDesc: 'ستعود شاشة العرض ثلاثي الأبعاد تلقائياً خلال لحظة.',
    progressSavedToast: 'تم حفظ تقدمك ومستواك الحالي محلياً على هذا الجهاز.',
    progressImportedToast: 'تمت استعادة ملف الحفظ بنجاح!',
    progressImportErrorToast: 'ملف الحفظ غير صالح.',
    progressResetToast: 'تم مسح التقدم وإعادة الضبط بالكامل.',
    catalogTitle: 'دفتر المراحل وحفظ التقدم',
    catalogSubtitle:
      'يُحفظ تقدمك والمستوى الذي وصلت إليه تلقائياً لتكمل اللعب من نفس المرحلة عند إعادة التشغيل.',
    closeCatalogAria: 'إغلاق القائمة',
    filterAll: 'الكل',
    filterCars: 'سيارات',
    filterBoats: 'قوارب وسفن',
    filterPlanes: 'طائرات ومروحيات',
    freeAccessActive: 'الوضع الحر مفعّل',
    unlockAllBtn: 'فتح كل المراحل',
    unlockAllTitle: 'يتيح تجربة جميع المستويات فوراً (لأولياء الأمور والمعلمين)',
    tier1Title: '01. مستوى الاستكشاف — التركيبات الأولى',
    tier1Subtitle: '4 إلى 5 قطع كبيرة · جذب مغناطيسي واسع للتدرّب على الفضاء ثلاثي الأبعاد',
    tier2Title: '02. مستوى الورشة — آليات متعددة الطبقات',
    tier2Subtitle: '7 إلى 8 قطع · ترتيب منطقي للمحرك والهيكل قبل المقصورة',
    tier3Title: '03. مستوى المهندس — الإنشاءات الكبرى',
    tier3Subtitle: '10 إلى 11 قطعة · تجميعات تقنية دقيقة وأطياف تدريجية',
    catCar: 'مركبات برية',
    catBoat: 'سفن وبحار',
    catPlane: 'طيران وجو',
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
          'من الشريط العلوي، بدّل في أي وقت بين الخشب والمكعبات والنموذج الواقعي، وغيّر اللغة (FR / العربية)، أو اضغط «تلميح ميكانيكي» للمساعدة!',
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
  },
};
