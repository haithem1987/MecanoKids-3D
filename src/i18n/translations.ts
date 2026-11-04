import { localizeBlueprintToEnglish } from '../data/englishBlueprints';
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
  filterConstruction: string;
  filterSpace: string;
  allTiersLabel: string;
  tierPillLabel: (tier: number) => string;
  searchPlaceholder: string;
  clearSearchLabel: string;
  noStagesMatch: string;
  showingCountLabel: (shown: number, total: number) => string;
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
    undoBtn: 'Annuler',
    recenterBtn: 'Recentrer',
    swUpdateAvailable: 'Nouvelle version disponible — rechargez pour l\'installer',
    swUpdateBtn: 'Relancer',
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
    catalogTitle: 'Carnet des 100 Stages & Sauvegarde',
    catalogSubtitle:
      '100 objets mécaniques répartis en 5 paliers de difficulté · Sauvegarde automatique sur cet appareil.',
    closeCatalogAria: 'Fermer le catalogue',
    filterAll: 'Tous (100)',
    filterCars: 'Route & Rail',
    filterBoats: 'Mer & Abysses',
    filterPlanes: 'Air & Drones',
    filterConstruction: 'Chantier & Agri',
    filterSpace: 'Espace & Robots',
    allTiersLabel: 'Tous les paliers',
    tierPillLabel: (tier) => `Palier ${tier}`,
    searchPlaceholder: 'Rechercher un véhicule, train, fusée, pelleteuse...',
    clearSearchLabel: 'Effacer',
    noStagesMatch: 'Aucun objet ne correspond à ta recherche.',
    showingCountLabel: (shown, total) => `${shown} sur ${total} objets affichés`,
    freeAccessActive: 'Accès libre activé',
    unlockAllBtn: 'Débloquer les 100',
    unlockAllTitle: "Permet d'essayer immédiatement les 100 niveaux (accès parents / enseignants)",
    tier1Title: '01. Palier Découverte — Premiers Assemblages (Stages 1 à 20)',
    tier1Subtitle: '4 à 5 pièces larges · Aimantation généreuse (1,4 m) et toutes les silhouettes visibles',
    tier2Title: '02. Palier Atelier — Mécanismes par Couches (Stages 21 à 40)',
    tier2Subtitle: '7 à 8 pièces · Montage du moteur et de la coque avant la cabine (aimantation 1,15 m)',
    tier3Title: '03. Palier Ingénieur — Grandes Constructions (Stages 41 à 60)',
    tier3Subtitle: '9 à 11 pièces · Silhouettes progressives débloquées étape par étape (aimantation 0,95 m)',
    tier4Title: '04. Palier Expert — Architectures Complexes (Stages 61 à 80)',
    tier4Subtitle: '12 à 13 pièces · Haute précision d’assemblage (aimantation 0,78 m) et sous-ensembles techniques',
    tier5Title: '05. Palier Maître Constructeur — Défis Ultimes (Stages 81 à 100)',
    tier5Subtitle: '14 à 15 pièces · Précision chirurgicale (aimantation 0,65 m) sur les plus grandes machines du monde',
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
      'Installe MécanoKids 3D sur ton écran d’accueil ou ton bureau Windows pour jouer en plein écran sans connexion Internet.',
    pwaInstallBtn: 'Installer MécanoKids 3D sur cet appareil',
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
      `MécanoKids 3D v1.1 · Lot A · ${profileCount} profil(s) local(aux) · ${isOfflineReady ? 'Prêt hors-ligne' : 'Mode hors-ligne actif'} · 0 % Publicité / 0 % Tracking enfant`,
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
    appName: 'MécanoKids 3D',
    navAriaLabel: 'Main navigation and 3D visual styles',
    stagesBtn: 'Stages & Save',
    styleWood: 'Wood & Metal',
    styleWoodShort: 'Wood',
    styleBlocks: 'Modular Blocks',
    styleBlocksShort: 'Blocks',
    styleRealistic: 'Scale Model',
    styleRealisticShort: 'Realistic',
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
    swUpdateAvailable: 'New version available — reload to install',
    swUpdateBtn: 'Reload',
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
    webglResetDesc: 'The 3D viewport will resume automatically in a moment.',
    progressSavedToast: 'Progress saved locally on this device.',
    progressImportedToast: 'Backup file restored!',
    progressImportErrorToast: 'Invalid save backup file.',
    progressResetToast: 'All saved progress has been reset.',
    catalogTitle: '100-Stage Workshop Catalog & Save',
    catalogSubtitle:
      '100 buildable 3D machines across 5 difficulty tiers · Automatic local save on this device.',
    closeCatalogAria: 'Close catalog',
    filterAll: 'All (100)',
    filterCars: 'Road & Rail',
    filterBoats: 'Sea & Deep Ocean',
    filterPlanes: 'Air & Drones',
    filterConstruction: 'Construction & Farm',
    filterSpace: 'Space & Robotics',
    allTiersLabel: 'All Tiers',
    tierPillLabel: (tier) => `Tier ${tier}`,
    searchPlaceholder: 'Search a car, train, rocket, excavator, submarine...',
    clearSearchLabel: 'Clear filters',
    noStagesMatch: 'No mechanical models match your search.',
    showingCountLabel: (shown, total) => `Showing ${shown} of ${total} models`,
    freeAccessActive: 'Free access active',
    unlockAllBtn: 'Unlock all 100',
    unlockAllTitle: 'Unlocks all 100 stages immediately (parent / teacher mode)',
    tier1Title: '01. Discovery Tier — First Builds (Stages 1 to 20)',
    tier1Subtitle: '4 to 5 large parts · Generous magnetic snap (1.4 m) with all silhouettes visible',
    tier2Title: '02. Workshop Tier — Layered Mechanisms (Stages 21 to 40)',
    tier2Subtitle: '7 to 8 parts · Install engine & hull structures before cabins (1.15 m snap)',
    tier3Title: '03. Engineer Tier — Heavy Engineering (Stages 41 to 60)',
    tier3Subtitle: '9 to 11 parts · Step-by-step progressive guide silhouettes (0.95 m snap)',
    tier4Title: '04. Expert Tier — Complex Architectures (Stages 61 to 80)',
    tier4Subtitle: '12 to 13 parts · High assembly precision (0.78 m snap) and multi-layer sub-assemblies',
    tier5Title: '05. Master Builder Tier — Ultimate Machines (Stages 81 to 100)',
    tier5Subtitle: '14 to 15 parts · Surgical precision (0.65 m snap) on iconic world-class machines',
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
      'Install MécanoKids 3D on your home screen or Windows desktop to play fullscreen anywhere without an internet connection.',
    pwaInstallBtn: 'Install MécanoKids 3D on this device',
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
      `MécanoKids 3D v1.1 · Lot A · ${profileCount} local profile(s) · ${isOfflineReady ? 'Offline Ready' : 'Offline Mode Active'} · 0% Ads / 0% Child Tracking`,
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
    swUpdateAvailable: 'إصدار جديد متاح — أعد التحميل للتثبيت',
    swUpdateBtn: 'إعادة تحميل',
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
    catalogTitle: 'دفتر الـ 100 مرحلة وحفظ التقدم',
    catalogSubtitle:
      '100 مجسّم ميكانيكي عبر 5 مستويات صعوبة متدرجة · حفظ تلقائي على هذا الجهاز.',
    closeCatalogAria: 'إغلاق القائمة',
    filterAll: 'الكل (100)',
    filterCars: 'البر والقطارات',
    filterBoats: 'البحار والأعماق',
    filterPlanes: 'الطيران والدرون',
    filterConstruction: 'البناء والزراعة',
    filterSpace: 'الفضاء والروبوتات',
    allTiersLabel: 'كل المستويات',
    tierPillLabel: (tier) => `المستوى ${tier}`,
    searchPlaceholder: 'ابحث عن سيارة، قطار، صاروخ، حفارة، غواصة...',
    clearSearchLabel: 'مسح',
    noStagesMatch: 'لا توجد مركبات مطابقة لبحثك.',
    showingCountLabel: (shown, total) => `عرض ${shown} من أصل ${total} مجسّم`,
    freeAccessActive: 'الوضع الحر مفعّل',
    unlockAllBtn: 'فتح الـ 100 مرحلة',
    unlockAllTitle: 'يتيح تجربة جميع المستويات الـ 100 فوراً (لأولياء الأمور والمعلمين)',
    tier1Title: '01. مستوى الاستكشاف — التركيبات الأولى (المراحل 1 إلى 20)',
    tier1Subtitle: '4 إلى 5 قطع كبيرة · جذب مغناطيسي واسع مع إظهار جميع الأطياف الإرشادية',
    tier2Title: '02. مستوى الورشة — آليات متعددة الطبقات (المراحل 21 إلى 40)',
    tier2Subtitle: '7 إلى 8 قطع · ترتيب منطقي للمحرك والهيكل قبل المقصورة',
    tier3Title: '03. مستوى المهندس — الإنشاءات الكبرى (المراحل 41 إلى 60)',
    tier3Subtitle: '9 إلى 11 قطعة · أطياف تدريجية تظهر خطوة بخطوة مع تزايد الدقة',
    tier4Title: '04. مستوى الخبير — الأنظمة المعقدة (المراحل 61 إلى 80)',
    tier4Subtitle: '12 إلى 13 قطعة · دقة هندسية عالية وتجميعات فرعية متقدمة',
    tier5Title: '05. مستوى كبير البناة — التحديات القصوى (المراحل 81 إلى 100)',
    tier5Subtitle: '14 إلى 15 قطعة · أعلى درجات التركيز والدقة لتجميع أعظم الآلات والمركبات',
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
