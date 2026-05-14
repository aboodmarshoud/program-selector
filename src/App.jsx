import { useMemo, useState } from "react";

const FREE = "مجاني";
const STUDY_MEDIUM = "موقع البرنامج + تلجرام";
const FONT_FAMILY = "'Alyamama', 'Noto Naskh Arabic', 'Amiri', 'Segoe UI', Tahoma, Arial, sans-serif";

const programs = {
  alim: {
    id: "alim",
    name: "برنامج عالِم",
    shortName: "عالِم",
    cluster: "تكوين علمي طويل",
    icon: "🕌",
    tagline: "رحلة التكوين العلمي الأطول والأعمق",
    duration: "11 سنة",
    type: "انتقائي – اختبار قبول ومقابلة",
    cost: FREE,
    audience: "غالبًا للذكور في سن الشباب، مع اشتراط حفظ القرآن بحسب الإعلان",
    medium: STUDY_MEDIUM,
    color: "#204b37",
    accent: "#2f8f62",
    light: "#eaf6ef",
    description:
      "مسار طويل لتكوين طالب علم رسالي موسوعي، يجمع التأصيل الشرعي والبناء الإيماني والفكري والمهاري، ولا يناسب إلا من يملك استعدادًا عاليًا والتزامًا طويلًا.",
    suitableIf: [
      "أتممت حفظ القرآن الكريم كاملًا أو تستوفي شرط الحفظ عند التسجيل",
      "هدفك تكوين علمي طويل جدًا لا مجرد دورة أو برنامج قصير",
      "تستطيع الالتزام لسنوات طويلة وبجدية عالية",
      "تريد مسارًا علميًا رساليًا واسعًا لا تخصصًا واحدًا فقط",
    ],
    notSuitableIf: [
      "لم تُتم حفظ القرآن أو لا تستطيع دخول شروطه الانتقائية",
      "تبحث عن برنامج متوسط أو قصير",
      "تريد فقط معالجة شبهة أو تأسيسًا سريعًا",
    ],
    requirements: ["حفظ القرآن كاملًا بحسب الإعلان", "اختبار قبول", "مقابلة أو مفاضلة عند فتح التسجيل"],
    note: "راجع إعلان الدفعة الأخيرة؛ شروط العمر والجنس والتفاصيل قد تتغير بين الدفعات.",
  },
  bina_asasi: {
    id: "bina_asasi",
    name: "البناء المنهجي – المسار الأساسي",
    shortName: "البناء الأساسي",
    cluster: "تأسيس شرعي عام",
    icon: "📚",
    tagline: "التأسيس الشرعي والمعرفي الأشمل",
    duration: "4 سنوات",
    type: "يمر بمرحلة تمهيدية واختبار",
    cost: FREE,
    audience: "فوق 15 سنة",
    medium: STUDY_MEDIUM,
    color: "#1f4a67",
    accent: "#247ba0",
    light: "#eaf3f7",
    description:
      "برنامج شرعي معرفي بنائي إلكتروني يجمع التأصيل الشرعي والثقافة الإسلامية والبناء الفكري والسلوكي. يناسب من يريد بناءً علميًا عامًا منظمًا لا بيئة تربوية شبابية فقط.",
    suitableIf: [
      "عمرك فوق 15 سنة وتريد تأسيسًا شرعيًا عامًا",
      "تريد مقررات ودراسة واختبارات ومسارًا طويلًا منظمًا",
      "الهدف عندك هو العلم الشرعي العام لا الصحبة والأنشطة أولًا",
      "تستطيع الالتزام بمسار طويل نسبيًا",
    ],
    notSuitableIf: [
      "تريد أجواء تربوية شبابية وصحبة ومتابعة قريبة؛ عندها قد يناسبك إشراق أو مسارات الجيل الصاعد",
      "وقتك محدود جدًا؛ قد يكون الميسّر أهدأ",
      "تريد تخصصًا حديثيًا أو فكريًا فقط",
    ],
    requirements: ["مرحلة تمهيدية", "اختبار قبول أو انتقال بحسب نظام الدفعة"],
    note: "إذا كان عمرك 17–20 وهدفك بيئة شبابية تربوية أكثر من الدراسة العلمية، فقارن بينه وبين إشراق.",
  },
  bina_muyassar: {
    id: "bina_muyassar",
    name: "البناء المنهجي – الميسّر",
    shortName: "البناء الميسّر",
    cluster: "تأسيس شرعي عام",
    icon: "🔖",
    tagline: "نسخة أخف للمبتدئ والمشغول",
    duration: "سنة ونصف تقريبًا",
    type: "يمر بمرحلة تمهيدية واختبار",
    cost: FREE,
    audience: "فوق 15 سنة",
    medium: STUDY_MEDIUM,
    color: "#315f76",
    accent: "#4d91b2",
    light: "#eef7fb",
    description:
      "مسار أخف من البناء الأساسي، مناسب للمبتدئ أو المشغول الذي يريد دخولًا منظمًا في التأصيل الشرعي دون ضغط المسار الكامل.",
    suitableIf: [
      "عمرك فوق 15 سنة وتريد تأسيسًا شرعيًا لكن وقتك محدود",
      "أنت مبتدئ أو تخشى الانقطاع من المسار الطويل",
      "تريد تجربة منظمة أخف قبل الالتزام الطويل",
    ],
    notSuitableIf: [
      "تريد المسار العلمي الكامل ولديك وقت كافٍ",
      "هدفك أجواء تربوية شبابية لا دراسة منهجية",
    ],
    requirements: ["مرحلة تمهيدية", "اختبار قبول أو انتقال بحسب نظام الدفعة"],
    note: "الميسّر ليس بديلًا عن كل طلب العلم، بل مدخل أخف ومناسب لمن لا يحتمل الأساسي الآن.",
  },
  fikri: {
    id: "fikri",
    name: "البناء الفكري",
    shortName: "البناء الفكري",
    cluster: "بناء فكري",
    icon: "💡",
    tagline: "وعي فكري عميق لا أجوبة سريعة",
    duration: "3 سنوات",
    type: "برنامج معرفي فكري",
    cost: FREE,
    audience: "فوق 15 سنة",
    medium: STUDY_MEDIUM,
    color: "#4a2d62",
    accent: "#8b5fbf",
    light: "#f4eef9",
    description:
      "برنامج يعتني بالهوية الإسلامية، ومركزية الوحي، ونقد التيارات والأفكار المعاصرة. يناسب من يريد الاشتباك الفكري المنهجي، لا مجرد تهدئة قلبية عاجلة.",
    suitableIf: [
      "تريد فهم التيارات الفكرية والشبهات بعمق",
      "تحتاج أدوات نقدية ومنهجية لا إجابات مختصرة",
      "تقبل مسارًا أطول من برد اليقين وأكثر اتساعًا فكريًا",
    ],
    notSuitableIf: [
      "حاجتك الحالية إيمانية/تزكوية عاجلة؛ برد اليقين قد يكون أسبق",
      "لا تملك أي تأسيس شرعي وتريد البداية من الصفر؛ البناء المنهجي قد يكون أسبق",
    ],
    requirements: [],
    note: "عند ضعف الأساس الشرعي يُنصح أن يكون البناء المنهجي قبله أو معه بحسب القدرة.",
  },
  bard_yaqin: {
    id: "bard_yaqin",
    name: "برد اليقين",
    shortName: "برد اليقين",
    cluster: "يقين وتزكية",
    icon: "💧",
    tagline: "يقين وتزكية في مسار أقصر",
    duration: "سنة وثمانية أشهر تقريبًا",
    type: "معرفي تزكوي سلوكي",
    cost: FREE,
    audience: "مناسب عمومًا لمن يحتاج تثبيت اليقين والتزكية",
    medium: STUDY_MEDIUM,
    color: "#1f5261",
    accent: "#2a9bb8",
    light: "#eaf7fa",
    description:
      "مسار يجمع تعزيز اليقين وتثبيت الثوابت مع البناء التزكوي والسلوكي. مناسب لمن يريد معالجة القلب واليقين قبل التوسع الفكري الطويل.",
    suitableIf: [
      "تشعر باضطراب إيماني أو شكوك تحتاج تثبيتًا وتهدئة منهجية",
      "تريد مزجًا بين المعرفة والتزكية والسلوك",
      "تحتاج برنامجًا أقصر من البناء الفكري",
    ],
    notSuitableIf: [
      "هدفك الأول تخصص فكري موسع لثلاث سنوات",
      "تريد تخصصًا حديثيًا أو تأسيسًا شرعيًا شاملًا",
    ],
    requirements: [],
    note: "إذا كانت الشبهة فكرية مركبة جدًا فقد يأتي البناء الفكري بعد تثبيت اليقين.",
  },
  hadith: {
    id: "hadith",
    name: "أكاديمية الحديث الإلكترونية",
    shortName: "أكاديمية الحديث",
    cluster: "تخصص حديثي",
    icon: "📜",
    tagline: "التخصص المتدرج في علوم الحديث والسنة",
    duration: "قرابة سنتين ونصف",
    type: "تخصص حديثي إلكتروني",
    cost: FREE,
    audience: "المهتمون بعلوم الحديث",
    medium: STUDY_MEDIUM,
    color: "#365022",
    accent: "#6d9f3e",
    light: "#f0f7ea",
    description:
      "برنامج متخصص في علوم الحديث والسنة، ينتقل بالطالب عبر مستويات في الدراية والرواية وفق مسار محدد.",
    suitableIf: [
      "هدفك واضح: علوم الحديث والسنة",
      "تريد تخصصًا لا تأسيسًا شرعيًا عامًا فقط",
      "تقبل الدراسة الإلكترونية المتدرجة",
    ],
    notSuitableIf: [
      "لا تعرف بعد أي فن تريد؛ البناء المنهجي أسبق",
      "تريد معالجة فكرية أو تربوية شبابية",
    ],
    requirements: [],
    note: "يمكن أن يكون مكملًا للبناء المنهجي أو بعد أساس شرعي مناسب.",
  },
  kharitat_thughur: {
    id: "kharitat_thughur",
    name: "خارطة الثغور",
    shortName: "خارطة الثغور",
    cluster: "عمل إصلاحي",
    icon: "🗺️",
    tagline: "جسر بين البناء والعمل الإصلاحي",
    duration: "3–4 أشهر",
    type: "دورة تبصيرية مع اختبار وشروط قبلية",
    cost: FREE,
    audience: "المصلحون وطلاب البرامج الإلكترونية",
    medium: STUDY_MEDIUM,
    color: "#35513b",
    accent: "#70a257",
    light: "#edf7ea",
    description:
      "دورة تساعد الطالب على فهم ثغور الأمة وموقعه بينها وكيف يقيم مشروعًا يخدم الأمة، وتُختم بمشروع عملي يصلح به الطالب في واقعه.",
    suitableIf: [
      "تريد الانتقال من التعلم إلى مشروع إصلاحي عملي",
      "تسأل: ما ثغري؟ وأين أعمل؟ وكيف أخدم الأمة؟",
      "أتممت أو ستتم المواد القبلية: مركزيات الإصلاح، شرح المنهاج، بوصلة المصلح",
    ],
    notSuitableIf: [
      "تريد بداية علمية من الصفر",
      "لا تريد إنجاز مشروع عملي",
      "لم تستعد لدراسة المواد القبلية",
    ],
    requirements: ["استمارة تسجيل", "اجتياز اختبار", "إتمام المواد القبلية"],
    note: "خارطة الثغور ليست بديلًا عن أصل البناء، بل جسر من البناء إلى العمل.",
  },
  buthur: {
    id: "buthur",
    name: "بذور – الجيل الصاعد",
    shortName: "بذور",
    cluster: "الجيل الصاعد",
    icon: "🌱",
    tagline: "البداية الإيمانية للأعمار 10–12",
    duration: "سنتان",
    type: "مفتوح غالبًا – بلا انتقائية عالية",
    cost: FREE,
    audience: "10–12 سنة",
    medium: STUDY_MEDIUM,
    color: "#4d5f25",
    accent: "#90a955",
    light: "#f3f7e9",
    description:
      "مسار تأسيسي تمهيدي يغرس الإيمان والقيم ومحاسن الأخلاق ويناسب بداية التشكل الديني والقيمي للطفل.",
    suitableIf: ["عمر المستفيد 10–12 سنة", "تريد بناءً قيميًا وإيمانيًا مبكرًا", "تبحث عن مسار مناسب للأطفال"],
    notSuitableIf: ["العمر 13 سنة فأكثر", "تريد برنامجًا للكبار أو تخصصًا علميًا"],
    requirements: [],
    note: "الأصل أن يُراعى إعلان الدفعة وشروط العمر وقت التسجيل.",
  },
  juthur: {
    id: "juthur",
    name: "جذور – الجيل الصاعد",
    shortName: "جذور",
    cluster: "الجيل الصاعد",
    icon: "🌿",
    tagline: "متابعة تربوية أقرب للأعمار 13–16",
    duration: "سنتان",
    type: "انتقائي – اختبار قبول",
    cost: FREE,
    audience: "13–16 سنة",
    medium: STUDY_MEDIUM,
    color: "#23533f",
    accent: "#3ca66b",
    light: "#eaf7ef",
    description:
      "مسار خاص في أكاديمية الجيل الصاعد يعتني بالبناء الإيماني والعلمي والوعي والمنهج الإصلاحي مع متابعة تربوية وأنشطة ومشاريع.",
    suitableIf: [
      "العمر 13–16 سنة",
      "تريد بيئة تربوية لا دراسة إلكترونية صامتة فقط",
      "تقبل اختبارًا وانتقائية ومتابعة أقرب",
    ],
    notSuitableIf: ["لا تريد اختبار قبول؛ غراس أنسب", "تريد مسارًا شرعيًا للكبار؛ البناء المنهجي قد يكون أنسب إذا كنت فوق 15"],
    requirements: ["استمارة", "اختبار قبول"],
    note: "يمتاز عن البناء المنهجي بأنه أجواء تربوية للناشئة أكثر من كونه دراسة شرعية للكبار.",
  },
  ghiras: {
    id: "ghiras",
    name: "غراس – الجيل الصاعد",
    shortName: "غراس",
    cluster: "الجيل الصاعد",
    icon: "🌳",
    tagline: "المسار العام للأعمار 13–16",
    duration: "سنتان",
    type: "مفتوح غالبًا – بلا شروط قبول خاصة",
    cost: FREE,
    audience: "13–16 سنة",
    medium: STUDY_MEDIUM,
    color: "#285d35",
    accent: "#4fa35c",
    light: "#edf8ee",
    description:
      "مسار عام في أكاديمية الجيل الصاعد للفئة 13–16، يعتني بالبناء الشمولي مع أنشطة وتفاعل وصحبة، وهو أيسر من جذور من جهة الانتقائية.",
    suitableIf: ["العمر 13–16 سنة", "تريد بيئة تربوية عامة بلا انتقائية عالية", "الأنشطة والصحبة مهمة لك"],
    notSuitableIf: ["تريد متابعة انتقائية أقرب؛ جذور أنسب", "تريد مسارًا علميًا للكبار لا أجواء ناشئة"],
    requirements: [],
    note: "مناسب لمن يريد الأكاديمية كبيئة تربوية للشباب الصغار دون اختبار عالٍ.",
  },
  ishraq: {
    id: "ishraq",
    name: "إشراق – الجيل الصاعد",
    shortName: "إشراق",
    cluster: "الجيل الصاعد",
    icon: "☀️",
    tagline: "بيئة تربوية شبابية للأعمار 17–20",
    duration: "سنتان",
    type: "انتقائي – اختبار قبول",
    cost: FREE,
    audience: "17–20 سنة",
    medium: STUDY_MEDIUM,
    color: "#5a3e75",
    accent: "#9b6fcf",
    light: "#f3eef8",
    description:
      "مسار شبابي خاص يبني الإيمان والوعي والمنهج الإصلاحي ومهارات التعامل مع الواقع، ويمتاز بأنه بيئة تربوية وصحبة ومتابعة لا مجرد مقررات علمية.",
    suitableIf: [
      "عمرك 17–20 سنة",
      "تريد أجواء تربوية وشبابية وصحبة ومتابعة",
      "تحتاج تحصينًا إيمانيًا ووعيًا ومهارات مع واقع الجامعة والحياة",
      "تقبل اختبار القبول",
    ],
    notSuitableIf: [
      "هدفك الأول دراسة شرعية منهجية للكبار؛ البناء المنهجي أنسب",
      "تريد تخصصًا حديثيًا أو فكريًا خالصًا",
      "لا تقبل أي انتقائية أو اختبار",
    ],
    requirements: ["استمارة", "اختبار قبول بحسب الإعلان"],
    note: "عند الالتباس بين إشراق والبناء المنهجي: إشراق بيئة تربوية شبابية، والبناء المنهجي مسار تعليمي شرعي للكبار.",
  },
  ithtmar: {
    id: "ithtmar",
    name: "إثمار – الجيل الصاعد",
    shortName: "إثمار",
    cluster: "الجيل الصاعد المتقدم",
    icon: "🌟",
    tagline: "درة التاج والتخصص الدقيق لخريجي جذور وإشراق",
    duration: "4 سنوات",
    type: "انتقائي خاص – لخريجي جذور وإشراق حصرًا",
    cost: FREE,
    audience: "15–22 سنة من خريجي جذور أو إشراق",
    medium: STUDY_MEDIUM,
    color: "#705124",
    accent: "#c99a3e",
    light: "#fbf4e7",
    description:
      "المرحلة الأكثر تقدمًا في أكاديمية الجيل الصاعد. لا يستقبل المبتدئين، بل يلتحق به نخبة المميزين من خريجي جذور وإشراق، وينتقل بالطالب من البناء العام إلى التخصص الدقيق ضمن عشرة تخصصات.",
    suitableIf: [
      "أتممت جذور أو إشراق بنجاح",
      "عمرك 15–22 سنة",
      "تريد تخصصًا دقيقًا لا بناءً عامًا",
      "تقبل أربع سنوات متصلة وإشرافًا علميًا مكثفًا",
    ],
    notSuitableIf: [
      "لم تكمل جذور أو إشراق؛ هذا شرط حاسم",
      "أنت مبتدئ في الأكاديمية",
      "تريد مسارًا عامًا أو مفتوحًا",
    ],
    requirements: ["خريج جذور أو إشراق", "مفاضلة وانتقاء", "استعداد لأربع سنوات"],
    note: "يُعامل في الخوارزمية كمسار متقدم لا يظهر توصية أولى إلا عند تحقق شرط خريج جذور أو إشراق.",
  },
  khadija: {
    id: "khadija",
    name: "مدرسة خديجة",
    shortName: "مدرسة خديجة",
    cluster: "بناء نسائي تفاعلي",
    icon: "🌸",
    tagline: "بيئة نسائية حية للبناء الإيماني والعلمي",
    duration: "سنة تقريبًا",
    type: "انتقائي – عدد محدود – تفاعلي",
    cost: FREE,
    audience: "النساء من 16 سنة فأكثر",
    medium: STUDY_MEDIUM,
    color: "#6e2e47",
    accent: "#c45b83",
    light: "#faedf2",
    description:
      "محضن نسائي تفاعلي يجمع البناء الإيماني والتربوي والعلمي، ويناسب من تريد بيئة نسائية مباشرة لا دراسة إلكترونية ذاتية فقط.",
    suitableIf: [
      "أنتِ امرأة فوق 16 سنة",
      "تريدين بيئة نسائية تفاعلية وحضورًا ولقاءات",
      "تبحثين عن بناء متوازن في الإيمان والعلم والتربية",
    ],
    notSuitableIf: [
      "تريدين دراسة ذاتية فقط بلا حضور أو تفاعل",
      "تبحثين عن تخصص حديثي أو فكري خالص",
    ],
    requirements: ["استمارة", "قبول بحسب العدد المتاح", "التزام باللقاءات"],
    note: "إذا كان الهدف تأسيسًا شرعيًا عامًا فقط فقد يناسب البناء المنهجي معها أو بعدها.",
  },
};

const ageGroups = {
  under10: { label: "أقل من 10 سنوات", min: 0, max: 9 },
  age10_12: { label: "10–12 سنة", min: 10, max: 12 },
  age13_14: { label: "13–14 سنة", min: 13, max: 14 },
  age15_16: { label: "15–16 سنة", min: 15, max: 16 },
  age17_20: { label: "17–20 سنة", min: 17, max: 20 },
  age21_22: { label: "21–22 سنة", min: 21, max: 22 },
  age23_25: { label: "23–25 سنة", min: 23, max: 25 },
  above25: { label: "أكثر من 25 سنة", min: 26, max: 90 },
};

const questions = [
  {
    id: "forWhom",
    text: "الاختيار لمن؟",
    subtitle: "نبدأ بتحديد صاحب القرار؛ لأن برامج الناشئة تختلف عن برامج الكبار.",
    options: [
      { value: "self", title: "لي أنا", icon: "👤", hint: "أبحث عن برنامج يناسب مرحلتي" },
      { value: "child", title: "لابني أو ابنتي", icon: "👨‍👩‍👧", hint: "أبحث عن محضن مناسب لعمره/عمرها" },
      { value: "someone", title: "لشخص أنصحه", icon: "🧭", hint: "أريد ترشيحًا مناسبًا لشخص آخر" },
    ],
  },
  {
    id: "gender",
    text: "ما الجنس؟",
    subtitle: "هذا يساعد في إظهار مدرسة خديجة عند مناسبة الحالة.",
    options: [
      { value: "male", title: "ذكر", icon: "👨" },
      { value: "female", title: "أنثى", icon: "👩" },
    ],
  },
  {
    id: "age",
    text: "ما العمر؟",
    subtitle: "العمر من أهم الفروق بين أكاديمية الجيل الصاعد وبرامج الكبار.",
    options: Object.entries(ageGroups).map(([value, item]) => ({ value, title: item.label, icon: "📍" })),
  },
  {
    id: "mainNeed",
    text: "ما الحاجة الأقرب الآن؟",
    subtitle: "اختر أقرب هدف، وسنطرح أسئلة إضافية عند الحاجة.",
    options: [
      { value: "youth_tarbiyah", title: "بيئة تربوية للناشئة والشباب", icon: "🌿", hint: "صحبة، متابعة، أنشطة، تحصين، أجواء تربوية" },
      { value: "general_sharia", title: "تعلم شرعي منهجي عام", icon: "📚", hint: "مقررات، تأسيس، اختبارات، مسار علمي للكبار" },
      { value: "doubts_yaqin", title: "تثبيت اليقين ومعالجة الشكوك", icon: "💧", hint: "يقين، تزكية، سكينة قلبية" },
      { value: "intellectual", title: "بناء فكري ونقد التيارات", icon: "🧠", hint: "شبهات، إلحاد، علمانية، فلسفات وأفكار معاصرة" },
      { value: "hadith", title: "تخصص في علوم الحديث", icon: "📜", hint: "السنة، الرواية، الدراية، مصطلح وعلل" },
      { value: "reform_project", title: "معرفة ثغري ومشروعي الإصلاحي", icon: "🗺️", hint: "من البناء إلى العمل والمشروع" },
      { value: "scholar", title: "تكوين علمي طويل جدًا", icon: "🕌", hint: "طموح عالم رسالي وموسوعي" },
      { value: "women_build", title: "بيئة نسائية تفاعلية", icon: "🌸", hint: "محضن نسائي، لقاءات، بناء إيماني وعلمي" },
    ],
  },
  {
    id: "youthVsAcademic",
    text: "بما أنك في سن يمكن أن يناسبه أكثر من مسار: ما الأهم لك؟",
    subtitle: "هذا السؤال يفصل بين إشراق/الجود التربوي وبين البناء المنهجي كمسار تعليمي شرعي.",
    condition: (a) => ["age15_16", "age17_20"].includes(a.age) && ["general_sharia", "youth_tarbiyah"].includes(a.mainNeed),
    options: [
      { value: "tarbawi_first", title: "أجواء تربوية وصحبة ومتابعة", icon: "☀️", hint: "أحتاج بيئة شبابية تعينني على الثبات والوعي" },
      { value: "academic_first", title: "دراسة شرعية منهجية ومقررات", icon: "📚", hint: "أريد بناءً علميًا منظمًا كبرامج الكبار" },
      { value: "both_youth_first", title: "أريد الاثنين، لكن أبدأ بما يناسب عمري", icon: "🧭", hint: "أفضّل محضنًا شبابيًا الآن ثم أُكمل البناء العلمي" },
      { value: "both_academic_first", title: "أريد الاثنين، لكن العلم الشرعي أولًا", icon: "🔖", hint: "أفضّل البناء المنهجي الآن، مع اعتبار إشراق خيارًا تربويًا" },
    ],
  },
  {
    id: "selectiveComfort",
    text: "هل تقبل برنامجًا انتقائيًا فيه اختبار أو مفاضلة؟",
    subtitle: "بعض مسارات الأكاديمية وعالِم وإثمار تحتاج قبولًا خاصًا.",
    condition: (a) => ["age13_14", "age15_16", "age17_20", "age21_22"].includes(a.age),
    options: [
      { value: "yes", title: "نعم، أقبل الاختبار والانتقائية", icon: "✅" },
      { value: "no", title: "لا، أفضّل مسارًا مفتوحًا أو أقل انتقائية", icon: "🌱" },
      { value: "maybe", title: "ربما، إن كان البرنامج مناسبًا جدًا", icon: "🤔" },
    ],
  },
  {
    id: "completedAcademy",
    text: "هل أتممت سابقًا مسار جذور أو إشراق؟",
    subtitle: "هذا شرط حاسم لإثمار، وليس مجرد أفضلية.",
    condition: (a) => ["age15_16", "age17_20", "age21_22"].includes(a.age),
    options: [
      { value: "yes", title: "نعم، أتممت جذور أو إشراق", icon: "🌟", hint: "يمكن النظر في إثمار إن كان الهدف التخصص" },
      { value: "no", title: "لا، لم أتمهما", icon: "🚫", hint: "إثمار لن يكون توصية أولى" },
    ],
  },
  {
    id: "specializationReadiness",
    text: "هل تريد الآن تخصصًا دقيقًا طويلًا، أم بناءً عامًا؟",
    subtitle: "إثمار مبني على التخصص الدقيق لا البداية العامة.",
    condition: (a) => a.completedAcademy === "yes",
    options: [
      { value: "precise_specialization", title: "تخصص دقيق طويل بإشراف عالٍ", icon: "🎯" },
      { value: "general_building", title: "ما زلت أريد بناءً عامًا", icon: "📚" },
    ],
  },
  {
    id: "timeWeekly",
    text: "كم تستطيع تخصيصه أسبوعيًا؟",
    subtitle: "الوقت يفرّق بين الميسّر والأساسي، وبين المسارات القصيرة والطويلة.",
    options: [
      { value: "light", title: "أقل من 3 ساعات", icon: "⏳", hint: "ظروف ضاغطة أو بداية خفيفة" },
      { value: "medium", title: "3–7 ساعات", icon: "🕰️", hint: "وقت متوسط" },
      { value: "heavy", title: "أكثر من 7 ساعات", icon: "⏱️", hint: "قدرة جيدة على الالتزام" },
      { value: "full", title: "تفرغ أو شبه تفرغ", icon: "♾️", hint: "البرنامج سيكون أولوية كبيرة" },
    ],
  },
  {
    id: "foundationLevel",
    text: "ما مستوى تأسيسك الشرعي الحالي؟",
    subtitle: "يساعدنا في ترتيب البناء المنهجي قبل البرامج التخصصية عند الحاجة.",
    condition: (a) => ["intellectual", "hadith", "reform_project", "scholar"].includes(a.mainNeed),
    options: [
      { value: "beginner", title: "مبتدئ أو غير منظم", icon: "🌱" },
      { value: "some", title: "لدي أساس متوسط", icon: "📘" },
      { value: "strong", title: "لدي تأسيس جيد أو أنهيت برامج سابقة", icon: "✅" },
    ],
  },
  {
    id: "doubtUrgency",
    text: "هل الشكوك تؤثر على إيمانك وطمأنينتك الآن؟",
    subtitle: "إن كان الأثر شديدًا، نبدأ غالبًا ببرد اليقين قبل الاشتباك الفكري الطويل.",
    condition: (a) => ["doubts_yaqin", "intellectual"].includes(a.mainNeed),
    options: [
      { value: "urgent", title: "نعم، أحتاج تثبيتًا وطمأنينة أولًا", icon: "💧" },
      { value: "research", title: "لا، أريد دراسة فكرية وتحليلًا أوسع", icon: "🧠" },
    ],
  },
  {
    id: "quranFull",
    text: "هل تحفظ القرآن الكريم كاملًا؟",
    subtitle: "هذا مهم جدًا عند التفكير ببرنامج عالِم.",
    condition: (a) => a.mainNeed === "scholar",
    options: [
      { value: "yes", title: "نعم، أحفظه كاملًا", icon: "📖" },
      { value: "no", title: "لا، لم أتم الحفظ بعد", icon: "📘" },
    ],
  },
  {
    id: "reformPrereqs",
    text: "هل أنهيت مواد خارطة الثغور القبلية أو تستطيع إنهاءها؟",
    subtitle: "مركزيات الإصلاح، شرح المنهاج، بوصلة المصلح.",
    condition: (a) => a.mainNeed === "reform_project",
    options: [
      { value: "done", title: "نعم، أنهيتها", icon: "✅" },
      { value: "will", title: "لم أنهها لكن أستطيع قبل البرنامج", icon: "📝" },
      { value: "no", title: "لا، أريد بداية أبسط", icon: "🌱" },
    ],
  },
  {
    id: "femaleMode",
    text: "هل تريدين بيئة نسائية تفاعلية بحضور ولقاءات؟",
    subtitle: "هذا يفرق بين مدرسة خديجة وبين المسارات الإلكترونية العامة.",
    condition: (a) => a.gender === "female" && ["age15_16", "age17_20", "age21_22", "age23_25", "above25"].includes(a.age),
    options: [
      { value: "yes", title: "نعم، البيئة النسائية التفاعلية مهمة", icon: "🌸" },
      { value: "no", title: "لا، أريد مسارًا إلكترونيًا عامًا", icon: "💻" },
      { value: "maybe", title: "ممكن، لكن الهدف العلمي أهم", icon: "🤔" },
    ],
  },
];

function getVisibleQuestions(answers) {
  return questions.filter((q) => !q.condition || q.condition(answers));
}

function ageMeta(age) {
  return ageGroups[age] || { label: "غير محدد", min: 0, max: 90 };
}

function isYouthAge(age) {
  return ["age10_12", "age13_14", "age15_16", "age17_20"].includes(age);
}

function canEnterAdultPrograms(age) {
  return ["age15_16", "age17_20", "age21_22", "age23_25", "above25"].includes(age);
}

function createScoreBox() {
  const result = {};
  Object.keys(programs).forEach((id) => {
    result[id] = { id, score: 0, reasons: [], cautions: [] };
  });
  return result;
}

function scoreRecommendations(answers) {
  const s = createScoreBox();
  const add = (id, points, reason) => {
    if (!s[id]) return;
    s[id].score += points;
    if (reason && !s[id].reasons.includes(reason)) s[id].reasons.push(reason);
  };
  const caution = (id, text, penalty = 0) => {
    if (!s[id]) return;
    s[id].score -= penalty;
    if (text && !s[id].cautions.includes(text)) s[id].cautions.push(text);
  };

  const a = answers;

  // Age gates and natural paths
  switch (a.age) {
    case "under10":
      add("buthur", 35, "أقرب مسار سيبدأ عند عمر 10 سنوات");
      caution("buthur", "العمر الحالي أقل من سن بذور؛ الأفضل الانتظار أو متابعة مواد مناسبة للطفولة حتى يبلغ 10 سنوات.", 5);
      break;
    case "age10_12":
      add("buthur", 110, "العمر 10–12 يطابق بذور تمامًا");
      break;
    case "age13_14":
      add("ghiras", 80, "العمر 13–14 ضمن مسار غراس العام");
      add("juthur", 70, "العمر 13–14 ضمن مسار جذور الخاص");
      break;
    case "age15_16":
      add("ghiras", 55, "العمر 15–16 ما زال ضمن مسارات الجيل الصاعد");
      add("juthur", 50, "العمر 15–16 مناسب لجذور عند قبول الانتقائية");
      add("bina_muyassar", 24, "العمر فوق 15 فيمكن دخول برامج الكبار التعليمية");
      add("bina_asasi", 22, "العمر فوق 15 فيمكن دخول البناء المنهجي");
      break;
    case "age17_20":
      add("ishraq", 65, "العمر 17–20 يطابق إشراق");
      add("bina_asasi", 26, "العمر فوق 15 يتيح البناء المنهجي");
      add("bina_muyassar", 22, "العمر فوق 15 يتيح البناء الميسر");
      add("fikri", 12, "العمر فوق 15 يتيح البناء الفكري");
      add("bard_yaqin", 12, "العمر مناسب للاستفادة من برد اليقين");
      break;
    case "age21_22":
      add("bina_asasi", 32, "العمر مناسب لبرامج الكبار");
      add("bina_muyassar", 28, "العمر مناسب للبناء الميسر عند ضيق الوقت");
      add("fikri", 22, "العمر مناسب للبناء الفكري");
      add("bard_yaqin", 20, "العمر مناسب لبرد اليقين");
      add("hadith", 16, "العمر مناسب للتخصص الحديثي");
      break;
    case "age23_25":
    case "above25":
      add("bina_asasi", 34, "العمر مناسب لبرامج الكبار");
      add("bina_muyassar", 30, "العمر مناسب للبناء الميسر عند ضيق الوقت");
      add("fikri", 22, "العمر مناسب للبناء الفكري");
      add("bard_yaqin", 20, "العمر مناسب لبرد اليقين");
      add("hadith", 18, "العمر مناسب للتخصص الحديثي");
      add("kharitat_thughur", 10, "يمكن التفكير في العمل الإصلاحي بعد أصل البناء");
      break;
    default:
      add("bina_muyassar", 10, "مسار عام آمن كبداية");
  }

  if (a.forWhom === "child" || a.forWhom === "someone") {
    if (isYouthAge(a.age)) {
      add("buthur", a.age === "age10_12" ? 20 : 0, "البحث عن برنامج لغيرك يرجّح المحاضن المناسبة للعمر");
      add("ghiras", ["age13_14", "age15_16"].includes(a.age) ? 18 : 0, "محضن تربوي مناسب للناشئة");
      add("juthur", ["age13_14", "age15_16"].includes(a.age) ? 14 : 0, "متابعة أقرب لمن يصلح للانتقائية");
      add("ishraq", a.age === "age17_20" ? 20 : 0, "محضن شبابي مناسب لهذه المرحلة");
    }
  }

  // Main need
  switch (a.mainNeed) {
    case "youth_tarbiyah":
      if (a.age === "age10_12") add("buthur", 60, "هدفك بيئة تربوية للناشئة");
      if (["age13_14", "age15_16"].includes(a.age)) {
        add("ghiras", 60, "تريد أجواء تربوية للناشئة");
        add("juthur", 56, "تريد متابعة تربوية أقرب");
      }
      if (a.age === "age17_20") add("ishraq", 72, "تريد أجواء تربوية شبابية، وهذا جوهر إشراق");
      break;
    case "general_sharia":
      add("bina_asasi", 72, "هدفك تعلم شرعي منهجي عام");
      add("bina_muyassar", 58, "هدفك تأسيس شرعي عام مع احتمال تخفيف المسار");
      if (a.age === "age17_20") add("ishraq", 20, "إشراق يبقى خيارًا تربويًا موازيًا في هذه السن");
      if (a.age === "age15_16") add("ghiras", 15, "قد تناسبك الأكاديمية إن كان هدفك تربويًا أكثر من علمي");
      break;
    case "doubts_yaqin":
      add("bard_yaqin", 82, "حاجتك تثبيت اليقين والتزكية");
      add("fikri", 28, "قد تحتاج بناءً فكريًا لاحقًا بعد تثبيت اليقين");
      if (a.age === "age17_20") add("ishraq", 24, "إشراق يعين على التحصين الشبابي العام");
      break;
    case "intellectual":
      add("fikri", 84, "هدفك البناء الفكري ونقد التيارات");
      add("bard_yaqin", 25, "برد اليقين قد يسبق البناء الفكري عند اضطراب اليقين");
      add("bina_asasi", 18, "التأسيس الشرعي يدعم البناء الفكري");
      break;
    case "hadith":
      add("hadith", 90, "هدفك التخصص في علوم الحديث");
      add("bina_asasi", 22, "البناء الشرعي العام يكمل التخصص الحديثي");
      break;
    case "reform_project":
      add("kharitat_thughur", 90, "تريد معرفة ثغرك ومشروعك الإصلاحي");
      add("bina_asasi", 20, "أصل البناء الشرعي مهم قبل العمل الإصلاحي");
      add("bard_yaqin", 10, "البناء الإيماني يعين على العمل الإصلاحي");
      break;
    case "scholar":
      add("alim", 85, "تريد تكوينًا علميًا طويلًا جدًا");
      add("bina_asasi", 42, "البناء المنهجي بداية قوية إن لم تتحقق شروط عالِم");
      break;
    case "women_build":
      add("khadija", 88, "تريدين بيئة نسائية تفاعلية");
      add("bina_muyassar", 20, "يمكن أن يكون البناء الميسر بديلًا إلكترونيًا عامًا");
      add("bina_asasi", 18, "البناء الأساسي بديل علمي عام");
      break;
    default:
      add("bina_muyassar", 20, "بداية عامة مناسبة عند عدم وضوح الهدف");
  }

  // Crucial youth vs academic distinction
  if (a.youthVsAcademic === "tarbawi_first") {
    if (a.age === "age17_20") add("ishraq", 80, "اخترت الأجواء التربوية والصحبة، وهذا يميز إشراق عن البناء المنهجي");
    if (a.age === "age15_16") {
      add("juthur", 45, "اخترت المتابعة التربوية، فجذور مناسب عند قبول الانتقائية");
      add("ghiras", 42, "اخترت الجو التربوي، وغراس مناسب كمسار عام");
    }
    caution("bina_asasi", "قد يكون مناسبًا علميًا، لكنه ليس محضنًا تربويًا شبابيًا بنفس معنى الأكاديمية.", 10);
  }
  if (a.youthVsAcademic === "academic_first") {
    add("bina_asasi", 82, "اخترت الدراسة الشرعية المنهجية؛ هذا جوهر البناء المنهجي");
    add("bina_muyassar", 55, "البناء الميسر خيار أخف للدراسة الشرعية");
    if (a.age === "age17_20") caution("ishraq", "إشراق مناسب لعُمرك، لكن هدفك المصرّح تعليمي شرعي لا أجواء تربوية أولًا.", 18);
    if (a.age === "age15_16") caution("ghiras", "غراس تربوي أكثر من كونه مسارًا شرعيًا للكبار.", 8);
  }
  if (a.youthVsAcademic === "both_youth_first") {
    if (a.age === "age17_20") add("ishraq", 72, "تريد الاثنين لكن البداية الأقرب للعمر هي إشراق");
    if (a.age === "age15_16") add("ghiras", 52, "تريد الاثنين لكن البداية الأقرب للعمر هي الأكاديمية");
    add("bina_asasi", 40, "البناء المنهجي بديل أو خطوة لاحقة للتأصيل الشرعي");
  }
  if (a.youthVsAcademic === "both_academic_first") {
    add("bina_asasi", 76, "تريد الاثنين لكن العلم الشرعي أولًا");
    add("bina_muyassar", 45, "الميسر خيار أخف إن كان الوقت محدودًا");
    if (a.age === "age17_20") add("ishraq", 35, "إشراق يبقى بديلًا تربويًا مناسبًا للعمر");
  }

  // Selective comfort
  if (a.selectiveComfort === "yes") {
    add("juthur", 20, "تقبل الاختبار والانتقائية");
    add("ishraq", 20, "تقبل الاختبار والانتقائية");
    add("ithtmar", 16, "تقبل المسارات الخاصة إن تحققت شروطها");
    add("alim", 12, "تقبل الاختبارات والمفاضلة");
  }
  if (a.selectiveComfort === "no") {
    add("ghiras", 24, "تفضل مسارًا أقل انتقائية");
    add("bina_muyassar", 12, "تفضل مسارًا أيسر نسبيًا");
    caution("juthur", "هذا مسار انتقائي، وقد لا يناسب من لا يريد اختبارًا.", 20);
    caution("ishraq", "هذا مسار انتقائي، وقد لا يناسب من لا يريد اختبارًا.", 18);
    caution("ithtmar", "إثمار مسار خاص وانتقائي جدًا.", 35);
  }

  // Ithmar hard gate
  if (a.completedAcademy === "yes") {
    add("ithtmar", 90, "أتممت جذور أو إشراق، وهذا يفتح باب إثمار");
    if (a.specializationReadiness === "precise_specialization") add("ithtmar", 80, "تريد التخصص الدقيق، وهذا جوهر إثمار");
    if (a.specializationReadiness === "general_building") {
      caution("ithtmar", "إثمار للتخصص الدقيق لا للبناء العام؛ قد يكون البناء المنهجي أو إشراق/المسار السابق أنسب.", 45);
      add("bina_asasi", 35, "تريد بناءً عامًا لا تخصصًا دقيقًا");
    }
  }
  if (a.completedAcademy === "no") {
    caution("ithtmar", "لا يُرشح إثمار لمن لم يُتم جذور أو إشراق؛ هذا شرط حاسم.", 120);
  }

  // Time
  if (a.timeWeekly === "light") {
    add("bina_muyassar", 42, "وقتك محدود؛ الميسر أرفق بك");
    add("bard_yaqin", 18, "مسار متوسط مناسب عند ضيق الوقت");
    add("kharitat_thughur", 10, "مدته قصيرة نسبيًا إذا استوفيت شروطه");
    caution("bina_asasi", "قد يكون ثقيلًا مع أقل من 3 ساعات أسبوعيًا.", 18);
    caution("fikri", "قد يكون طويلًا إذا كان وقتك محدودًا جدًا.", 12);
    caution("alim", "لا يناسب ضيق الوقت.", 55);
    caution("ithtmar", "يتطلب أربع سنوات متصلة والتزامًا عاليًا.", 30);
  }
  if (a.timeWeekly === "medium") {
    add("bina_muyassar", 20, "وقتك متوسط؛ الميسر خيار آمن");
    add("bard_yaqin", 16, "وقتك متوسط ويناسب مسارًا تزكويًا/يقينيًا");
    add("hadith", 12, "قد يناسبك تخصص إلكتروني متدرج");
  }
  if (a.timeWeekly === "heavy") {
    add("bina_asasi", 22, "لديك وقت يسمح بمسار كامل");
    add("fikri", 15, "لديك وقت يسمح بمسار فكري أطول");
    add("ishraq", 10, "لديك وقت جيد للأنشطة والمتابعة");
    add("juthur", 10, "لديك وقت جيد للمتابعة الخاصة");
  }
  if (a.timeWeekly === "full") {
    add("alim", 28, "لديك استعداد عالٍ للتفرغ");
    add("bina_asasi", 22, "التفرغ يساعد على المسار الكامل");
    add("ithtmar", 20, "التفرغ يساعد على المسار المتقدم الطويل");
  }

  // Foundation level
  if (a.foundationLevel === "beginner") {
    add("bina_muyassar", 36, "تأسيسك مبتدئ؛ الميسر بداية مناسبة");
    add("bina_asasi", 26, "تحتاج أصل بناء شرعي عام");
    caution("fikri", "قد يكون البناء الفكري متقدمًا إن لم يكن لديك أساس شرعي.", 22);
    caution("hadith", "التخصص الحديثي أفضل بعد أصل مناسب.", 10);
    caution("kharitat_thughur", "خارطة الثغور جسر للعمل بعد أصل من البناء والمواد القبلية.", 18);
  }
  if (a.foundationLevel === "strong") {
    add("fikri", 16, "لديك أساس يسمح بتخصص فكري");
    add("hadith", 14, "لديك أساس يسمح بتخصص حديثي");
    add("kharitat_thughur", 18, "لديك أساس يساعد على الانتقال للعمل الإصلاحي");
  }

  // Doubt urgency
  if (a.doubtUrgency === "urgent") {
    add("bard_yaqin", 64, "الأولوية الآن تثبيت اليقين والسكينة");
    caution("fikri", "البناء الفكري مهم، لكن قد يكون لاحقًا بعد استقرار اليقين.", 14);
  }
  if (a.doubtUrgency === "research") {
    add("fikri", 48, "تريد بحثًا فكريًا وتحليلًا أوسع");
    add("bard_yaqin", 12, "يبقى برد اليقين مكملًا تزكويًا");
  }

  // Quran / Alim
  if (a.mainNeed === "scholar") {
    if (a.quranFull === "yes") add("alim", 56, "تحقق شرط حفظ القرآن يدعم ترشيح عالِم");
    if (a.quranFull === "no") {
      caution("alim", "برنامج عالِم يشترط حفظ القرآن بحسب الإعلان؛ ابدأ بالبناء المنهجي مع خطة حفظ.", 90);
      add("bina_asasi", 46, "بديل قوي حتى يكتمل شرط الحفظ");
    }
    if (a.gender === "female") caution("alim", "راجع إعلان الدفعة؛ إن كان مقصورًا على الذكور فيبقى البناء المنهجي بديلًا.", 25);
  }

  // Reform prerequisites
  if (a.reformPrereqs === "done") add("kharitat_thughur", 45, "أتممت المواد القبلية لخارطة الثغور");
  if (a.reformPrereqs === "will") add("kharitat_thughur", 28, "مستعد لإتمام المواد القبلية قبل الدورة");
  if (a.reformPrereqs === "no") {
    caution("kharitat_thughur", "لم تتم المواد القبلية؛ ابدأ بمركزيات الإصلاح وشرح المنهاج وبوصلة المصلح أو بالبناء العام.", 45);
    add("bina_muyassar", 18, "بداية أبسط قبل سؤال المشروع الإصلاحي");
    add("bina_asasi", 16, "بناء عام قبل العمل الإصلاحي");
  }

  // Female interactive mode
  if (a.gender === "female" && ["age15_16", "age17_20", "age21_22", "age23_25", "above25"].includes(a.age)) {
    if (a.femaleMode === "yes") {
      add("khadija", 85, "تريدين بيئة نسائية تفاعلية، وهذا جوهر مدرسة خديجة");
      if (a.age === "age17_20") add("ishraq", 12, "إشراق خيار شبابي تربوي عام كذلك");
    }
    if (a.femaleMode === "maybe") add("khadija", 28, "البيئة النسائية قد تكون مناسبة كخيار مكمّل");
    if (a.femaleMode === "no") caution("khadija", "لا تريدين بيئة تفاعلية مباشرة؛ المسارات الإلكترونية العامة قد تناسبك أكثر.", 28);
  }

  // Prevent impossible / weak age recommendations
  if (a.age === "age10_12") {
    ["bina_asasi", "bina_muyassar", "fikri", "bard_yaqin", "hadith", "kharitat_thughur", "alim", "khadija", "ishraq", "ithtmar"].forEach((id) => caution(id, "العمر لا يناسب هذا المسار الآن.", 200));
  }
  if (a.age === "age13_14") {
    ["bina_asasi", "bina_muyassar", "fikri", "hadith", "kharitat_thughur", "alim", "khadija", "ishraq", "ithtmar"].forEach((id) => caution(id, "العمر لا يناسب هذا المسار الآن أو ليس الخيار الأول.", 80));
  }
  if (!canEnterAdultPrograms(a.age)) {
    ["bina_asasi", "bina_muyassar", "fikri", "hadith", "kharitat_thughur", "alim", "khadija"].forEach((id) => caution(id, "برامج الكبار تبدأ غالبًا من فوق 15 أو بشروط خاصة.", 70));
  }

  const ranked = Object.values(s)
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map((x, index, arr) => {
      const max = arr[0]?.score || 1;
      return {
        ...x,
        program: programs[x.id],
        match: Math.max(45, Math.min(99, Math.round((x.score / max) * 96))),
      };
    });

  if (!ranked.length) {
    return [
      {
        id: "bina_muyassar",
        program: programs.bina_muyassar,
        score: 1,
        match: 60,
        reasons: ["بداية عامة آمنة عند عدم وضوح المعطيات"],
        cautions: [],
      },
    ];
  }

  return ranked;
}

function answerLabel(answers, id) {
  const q = questions.find((item) => item.id === id);
  const value = answers[id];
  const option = q?.options?.find((item) => item.value === value);
  return option?.title || value;
}

function explainPath(answers) {
  const items = [];
  if (answers.age) items.push(`العمر: ${ageMeta(answers.age).label}`);
  if (answers.mainNeed) items.push(`الهدف: ${answerLabel(answers, "mainNeed")}`);
  if (answers.youthVsAcademic) items.push(`الأولوية: ${answerLabel(answers, "youthVsAcademic")}`);
  if (answers.timeWeekly) items.push(`الوقت: ${answerLabel(answers, "timeWeekly")}`);
  if (answers.completedAcademy) items.push(`جذور/إشراق سابقًا: ${answerLabel(answers, "completedAcademy")}`);
  return items;
}

function InjectedStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Alyamama:wght@400;500;600;700;800&display=swap');
      * { box-sizing: border-box; }
      body { margin: 0; }
      .program-app {
        direction: rtl;
        min-height: 100vh;
        font-family: ${FONT_FAMILY};
        color: #1d211c;
        background:
          radial-gradient(circle at 10% 10%, rgba(201,154,62,.18), transparent 28%),
          radial-gradient(circle at 88% 0%, rgba(45,139,100,.16), transparent 30%),
          linear-gradient(180deg, #fbf7ed 0%, #f4efe2 38%, #eef5ec 100%);
      }
      .wrap { width: min(1120px, calc(100% - 32px)); margin: 0 auto; }
      .topbar {
        display:flex; align-items:center; justify-content:space-between; gap:16px;
        padding: 18px 0;
      }
      .brand { display:flex; align-items:center; gap:10px; font-weight:800; color:#264236; }
      .brand-mark {
        width:38px; height:38px; display:grid; place-items:center; border-radius:14px;
        background:linear-gradient(135deg,#245b43,#8fb26b); color:#fff; box-shadow:0 10px 22px rgba(36,91,67,.18);
      }
      .nav-actions { display:flex; gap:8px; flex-wrap:wrap; }
      button { font-family: ${FONT_FAMILY}; }
      .ghost-btn, .primary-btn, .soft-btn {
        border:0; cursor:pointer; border-radius:999px; font-weight:800; transition:.2s ease; white-space:nowrap;
      }
      .primary-btn { background:#245b43; color:#fff; padding:13px 22px; box-shadow:0 12px 24px rgba(36,91,67,.22); }
      .primary-btn:hover { transform: translateY(-1px); background:#1c4d38; }
      .ghost-btn { background:rgba(255,255,255,.65); color:#385447; padding:11px 18px; border:1px solid rgba(36,91,67,.13); }
      .ghost-btn:hover { background:#fff; }
      .soft-btn { background:#e8f4ec; color:#245b43; padding:10px 16px; }
      .hero { padding: 34px 0 28px; display:grid; grid-template-columns: 1.15fr .85fr; gap:28px; align-items:center; }
      .eyebrow { display:inline-flex; align-items:center; gap:8px; padding:7px 14px; border-radius:999px; background:#fff7df; color:#7d5a13; border:1px solid #f0d99b; font-size:13px; font-weight:800; }
      .hero h1 { font-size: clamp(34px, 5vw, 64px); line-height:1.08; margin:18px 0 14px; color:#1d2a22; letter-spacing:-.04em; }
      .hero p { font-size:18px; line-height:1.95; color:#5f675e; margin:0 0 22px; max-width:720px; }
      .hero-actions { display:flex; gap:12px; flex-wrap:wrap; margin:24px 0; }
      .pills { display:flex; gap:10px; flex-wrap:wrap; }
      .pill { display:inline-flex; align-items:center; gap:7px; background:rgba(255,255,255,.72); color:#526057; border:1px solid rgba(36,91,67,.12); border-radius:999px; padding:8px 12px; font-size:13px; font-weight:700; }
      .hero-card { background:rgba(255,255,255,.72); border:1px solid rgba(36,91,67,.14); border-radius:30px; padding:24px; box-shadow:0 28px 70px rgba(67,78,56,.12); backdrop-filter: blur(10px); }
      .route-card { background:linear-gradient(135deg,#245b43,#6f9f54); color:#fff; border-radius:26px; padding:24px; position:relative; overflow:hidden; min-height:310px; }
      .route-card:before { content:""; position:absolute; inset:-60px auto auto -60px; width:180px; height:180px; border-radius:999px; background:rgba(255,255,255,.12); }
      .route-step { display:flex; align-items:center; gap:12px; padding:12px; border-radius:16px; background:rgba(255,255,255,.12); margin-top:12px; position:relative; }
      .route-step strong { display:block; font-size:15px; }
      .route-step span { display:block; font-size:12px; opacity:.78; margin-top:2px; }
      .section-title { display:flex; justify-content:space-between; align-items:end; gap:16px; margin:28px 0 14px; }
      .section-title h2 { margin:0; font-size:26px; color:#24392f; }
      .section-title p { margin:4px 0 0; color:#6b756b; line-height:1.7; }
      .program-grid { display:grid; grid-template-columns: repeat(3, 1fr); gap:14px; }
      .mini-card { background:rgba(255,255,255,.76); border:1px solid rgba(36,91,67,.12); border-radius:22px; padding:18px; box-shadow:0 12px 34px rgba(67,78,56,.08); transition:.18s ease; cursor:pointer; text-align:right; }
      .mini-card:hover { transform:translateY(-3px); box-shadow:0 18px 42px rgba(67,78,56,.12); }
      .mini-head { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
      .mini-icon { width:42px; height:42px; display:grid; place-items:center; border-radius:16px; background:var(--light); font-size:22px; }
      .mini-card h3 { margin:0; font-size:17px; color:#1f3028; }
      .mini-card p { margin:8px 0 14px; color:#667066; line-height:1.65; font-size:13px; }
      .badges { display:flex; gap:6px; flex-wrap:wrap; }
      .badge { padding:5px 9px; border-radius:999px; background:#f4f1e8; color:#5d675e; font-size:11px; font-weight:800; }
      .quiz-shell { padding: 20px 0 48px; }
      .quiz-layout { display:grid; grid-template-columns: 320px 1fr; gap:20px; align-items:start; }
      .side-panel { position:sticky; top:16px; background:rgba(255,255,255,.75); border:1px solid rgba(36,91,67,.12); border-radius:26px; padding:18px; box-shadow:0 14px 44px rgba(67,78,56,.10); }
      .progress { height:9px; background:#e8e0cf; border-radius:999px; overflow:hidden; margin:12px 0 18px; }
      .progress > div { height:100%; background:linear-gradient(90deg,#245b43,#c79b43); border-radius:999px; transition:.35s; }
      .crumb { display:flex; justify-content:space-between; gap:8px; padding:8px 0; border-bottom:1px dashed rgba(36,91,67,.13); font-size:13px; color:#647065; }
      .crumb:last-child { border-bottom:0; }
      .question-card { background:#fff; border:1px solid rgba(36,91,67,.13); border-radius:30px; padding:26px; box-shadow:0 20px 56px rgba(67,78,56,.12); animation: fadeIn .28s ease; }
      @keyframes fadeIn { from { opacity:0; transform:translateY(8px); } to { opacity:1; transform:translateY(0); } }
      .question-card h2 { margin:0 0 8px; font-size:26px; color:#1f3028; }
      .question-card .subtitle { margin:0 0 22px; color:#6b756b; line-height:1.8; }
      .options-grid { display:grid; gap:12px; }
      .option-btn { width:100%; text-align:right; display:flex; align-items:flex-start; gap:12px; padding:15px; border-radius:18px; border:1.5px solid #e3ddcf; background:#fffdf8; color:#27352e; cursor:pointer; transition:.16s ease; }
      .option-btn:hover { border-color:#9ec1a5; background:#f4fbf4; }
      .option-btn.selected { border-color:#245b43; background:#eaf6ef; box-shadow:0 10px 26px rgba(36,91,67,.10); }
      .option-icon { width:38px; height:38px; border-radius:14px; display:grid; place-items:center; background:#f2ead9; flex:0 0 auto; font-size:20px; }
      .option-btn.selected .option-icon { background:#245b43; color:#fff; }
      .option-title { font-weight:800; font-size:15px; }
      .option-hint { margin-top:4px; color:#727b72; font-size:12.5px; line-height:1.65; }
      .quiz-nav { display:flex; justify-content:space-between; gap:10px; margin-top:20px; }
      .disabled { opacity:.45; cursor:not-allowed !important; transform:none !important; }
      .result-layout { display:grid; grid-template-columns: 1fr 360px; gap:18px; align-items:start; padding: 20px 0 48px; }
      .result-main { background:#fff; border:1px solid rgba(36,91,67,.12); border-radius:30px; overflow:hidden; box-shadow:0 20px 56px rgba(67,78,56,.12); }
      .result-hero { padding:26px; color:#fff; background:linear-gradient(135deg,var(--color),var(--accent)); position:relative; overflow:hidden; }
      .result-hero:after { content:""; position:absolute; width:220px; height:220px; border-radius:999px; background:rgba(255,255,255,.12); left:-60px; top:-80px; }
      .match { display:inline-flex; align-items:center; gap:8px; border-radius:999px; background:rgba(255,255,255,.16); padding:7px 12px; font-size:13px; font-weight:800; }
      .result-title { display:flex; align-items:center; gap:14px; margin-top:18px; position:relative; z-index:1; }
      .result-title .icon { font-size:44px; }
      .result-title h2 { margin:0; font-size:30px; }
      .result-title p { margin:6px 0 0; opacity:.82; }
      .result-body { padding:24px; }
      .detail-grid { display:grid; grid-template-columns: repeat(2,1fr); gap:10px; margin:18px 0; }
      .detail { background:#f7f3ea; border-radius:18px; padding:13px; }
      .detail small { display:block; color:#7a8178; font-weight:800; margin-bottom:4px; }
      .detail strong { color:#29342d; }
      .two-cols { display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-top:16px; }
      .info-box { border-radius:20px; padding:16px; line-height:1.75; }
      .info-box.good { background:#eef8ef; border:1px solid #cce9d2; }
      .info-box.bad { background:#fff1ef; border:1px solid #f0cec9; }
      .info-box h4 { margin:0 0 8px; }
      .info-box ul { margin:0; padding:0 18px 0 0; }
      .note { border-radius:18px; padding:14px 16px; background:#fff7df; color:#7b5a13; border:1px solid #ead18b; line-height:1.75; margin-top:14px; }
      .alternatives { display:grid; gap:10px; }
      .alt-card { background:rgba(255,255,255,.78); border:1px solid rgba(36,91,67,.12); border-radius:22px; padding:16px; cursor:pointer; transition:.18s; }
      .alt-card:hover { transform:translateY(-2px); background:#fff; }
      .alt-head { display:flex; justify-content:space-between; gap:10px; align-items:center; }
      .alt-name { font-weight:900; color:#25382e; }
      .alt-score { font-size:12px; font-weight:900; background:#edf6ef; color:#245b43; border-radius:999px; padding:4px 9px; }
      .reason-list { margin:10px 0 0; padding:0 18px 0 0; color:#647065; line-height:1.65; font-size:13px; }
      .program-page { padding:20px 0 48px; }
      .program-detail { background:#fff; border-radius:30px; overflow:hidden; border:1px solid rgba(36,91,67,.12); box-shadow:0 20px 56px rgba(67,78,56,.12); }
      .program-detail-hero { padding:26px; color:#fff; background:linear-gradient(135deg,var(--color),var(--accent)); }
      .program-detail-hero h1 { margin:10px 0 4px; font-size:36px; }
      .program-detail-body { padding:24px; }
      .all-grid { display:grid; grid-template-columns: repeat(3,1fr); gap:14px; padding-bottom:50px; }
      @media (max-width: 900px) {
        .hero, .quiz-layout, .result-layout { grid-template-columns:1fr; }
        .side-panel { position:static; }
        .program-grid, .all-grid { grid-template-columns: repeat(2,1fr); }
        .hero-card { order:-1; }
      }
      @media (max-width: 620px) {
        .wrap { width:min(100% - 22px,1120px); }
        .topbar { align-items:flex-start; }
        .brand span { display:none; }
        .hero { padding-top:12px; }
        .hero h1 { font-size:36px; }
        .program-grid, .all-grid, .detail-grid, .two-cols { grid-template-columns:1fr; }
        .question-card, .result-body, .program-detail-body { padding:18px; }
        .result-title h2 { font-size:24px; }
      }
    `}</style>
  );
}

function TopBar({ view, setView, title }) {
  return (
    <div className="wrap topbar">
      <button className="brand ghost-btn" onClick={() => setView("home")}>
        <span className="brand-mark">🧭</span>
        <span>{title || "دليل البرامج"}</span>
      </button>
      <div className="nav-actions">
        {view !== "quiz" && <button className="primary-btn" onClick={() => setView("quiz")}>ابدأ الاختبار</button>}
        {view !== "all" && <button className="ghost-btn" onClick={() => setView("all")}>كل البرامج</button>}
      </div>
    </div>
  );
}

function ProgramMiniCard({ program, onClick }) {
  return (
    <button
      className="mini-card"
      style={{ "--light": program.light }}
      onClick={onClick}
      type="button"
    >
      <div className="mini-head">
        <span className="mini-icon">{program.icon}</span>
        <div>
          <h3>{program.shortName || program.name}</h3>
          <span className="badge">{program.cluster}</span>
        </div>
      </div>
      <p>{program.tagline}</p>
      <div className="badges">
        <span className="badge">{program.audience}</span>
        <span className="badge">{program.duration}</span>
        <span className="badge">{program.cost}</span>
      </div>
    </button>
  );
}

function HomeView({ setView, openProgram }) {
  const featured = [programs.ishraq, programs.bina_asasi, programs.bina_muyassar, programs.bard_yaqin, programs.fikri, programs.kharitat_thughur];
  return (
    <>
      <section className="wrap hero">
        <div>
          <span className="eyebrow">✨ لا تسجل في كل برنامج يُفتح</span>
          <h1>اختر البرنامج الذي يناسب عمرك وهدفك فعلًا</h1>
          <p>
            هذه أداة تفاعلية تفرّق بين برامج الشيخ أحمد بن يوسف السيد ومساراتها. تميّز خصوصًا بين البرامج التعليمية للكبار وبين أكاديمية الجيل الصاعد ذات الأجواء التربوية والصحبة والمتابعة.
          </p>
          <div className="hero-actions">
            <button className="primary-btn" onClick={() => setView("quiz")}>ابدأ اختبار الاختيار</button>
            <button className="ghost-btn" onClick={() => setView("all")}>قارن البرامج مباشرة</button>
          </div>
          <div className="pills">
            <span className="pill">💰 كل البرامج: مجاني</span>
            <span className="pill">🌐 الوسيلة: موقع البرنامج + تلجرام</span>
            <span className="pill">🎯 نتيجة مفسّرة</span>
            <span className="pill">🧩 أسئلة تتغير حسب الحالة</span>
          </div>
        </div>
        <div className="hero-card">
          <div className="route-card">
            <span className="eyebrow" style={{ background: "rgba(255,255,255,.18)", color: "#fff", borderColor: "rgba(255,255,255,.25)" }}>كيف تعمل الخوارزمية؟</span>
            <div className="route-step"><span>1</span><div><strong>تحدد العمر</strong><span>للفصل بين الناشئة والكبار</span></div></div>
            <div className="route-step"><span>2</span><div><strong>تسأل عن الهدف</strong><span>علم شرعي، تربية، فكر، يقين، حديث، إصلاح</span></div></div>
            <div className="route-step"><span>3</span><div><strong>تميّز الحالة الملتبسة</strong><span>مثل: إشراق أم البناء المنهجي؟</span></div></div>
            <div className="route-step"><span>4</span><div><strong>تعطي توصية وبدائل</strong><span>مع سبب واضح وتنبيهات قبل التسجيل</span></div></div>
          </div>
        </div>
      </section>

      <section className="wrap">
        <div className="section-title">
          <div>
            <h2>أبرز البرامج في المقارنة</h2>
            <p>اضغط على أي بطاقة لرؤية التفاصيل.</p>
          </div>
        </div>
        <div className="program-grid">
          {featured.map((program) => (
            <ProgramMiniCard key={program.id} program={program} onClick={() => openProgram(program.id)} />
          ))}
        </div>
      </section>
    </>
  );
}

function QuizView({ setView, setAnswers }) {
  const [answers, updateAnswers] = useState({});
  const [index, setIndex] = useState(0);
  const visibleQuestions = useMemo(() => getVisibleQuestions(answers), [answers]);
  const question = visibleQuestions[Math.min(index, visibleQuestions.length - 1)];
  const progress = Math.round(((Math.min(index, visibleQuestions.length - 1) + 1) / visibleQuestions.length) * 100);

  const choose = (value) => {
    const next = { ...answers, [question.id]: value };
    const newVisibleIds = new Set(getVisibleQuestions(next).map((q) => q.id));
    Object.keys(next).forEach((key) => {
      if (!newVisibleIds.has(key)) delete next[key];
    });
    updateAnswers(next);
  };

  const next = () => {
    if (!answers[question.id]) return;
    const nextVisible = getVisibleQuestions(answers);
    if (index >= nextVisible.length - 1) {
      setAnswers(answers);
      setView("result");
    } else {
      setIndex(index + 1);
    }
  };

  const back = () => setIndex(Math.max(0, index - 1));

  return (
    <main className="wrap quiz-shell">
      <div className="quiz-layout">
        <aside className="side-panel">
          <strong>تقدمك في الاختبار</strong>
          <div className="progress"><div style={{ width: `${progress}%` }} /></div>
          <div className="crumb"><span>السؤال الحالي</span><strong>{Math.min(index + 1, visibleQuestions.length)} / {visibleQuestions.length}</strong></div>
          {explainPath(answers).map((item) => (
            <div className="crumb" key={item}><span>{item}</span></div>
          ))}
          <div className="note" style={{ marginTop: 14 }}>
            مثال مهم: إذا كنت 17–20 وتريد تعليمًا شرعيًا منظمًا فالبناء المنهجي يتقدم، أما إذا أردت بيئة تربوية وصحبة ومتابعة فإشراق يتقدم.
          </div>
        </aside>

        <section className="question-card" key={question.id}>
          <h2>{question.text}</h2>
          <p className="subtitle">{question.subtitle}</p>
          <div className="options-grid">
            {question.options.map((option) => (
              <button
                type="button"
                key={option.value}
                className={`option-btn ${answers[question.id] === option.value ? "selected" : ""}`}
                onClick={() => choose(option.value)}
              >
                <span className="option-icon">{option.icon}</span>
                <span>
                  <span className="option-title">{option.title}</span>
                  {option.hint && <span className="option-hint">{option.hint}</span>}
                </span>
              </button>
            ))}
          </div>
          <div className="quiz-nav">
            <button className="ghost-btn" onClick={back} disabled={index === 0}>السابق</button>
            <button className={`primary-btn ${!answers[question.id] ? "disabled" : ""}`} onClick={next} disabled={!answers[question.id]}>
              {index >= visibleQuestions.length - 1 ? "اعرض النتيجة" : "التالي"}
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

function ResultView({ answers, setView, openProgram }) {
  const recommendations = useMemo(() => scoreRecommendations(answers), [answers]);
  const primary = recommendations[0];
  const program = primary.program;
  const alternatives = recommendations.slice(1, 5);

  return (
    <main className="wrap result-layout">
      <section className="result-main" style={{ "--color": program.color, "--accent": program.accent }}>
        <div className="result-hero">
          <span className="match">نسبة الملاءمة التقريبية: {primary.match}%</span>
          <div className="result-title">
            <span className="icon">{program.icon}</span>
            <div>
              <h2>{program.name}</h2>
              <p>{program.tagline}</p>
            </div>
          </div>
        </div>
        <div className="result-body">
          <p style={{ lineHeight: 1.95, color: "#58635b", fontSize: 16 }}>{program.description}</p>
          <div className="detail-grid">
            <div className="detail"><small>العمر/الفئة</small><strong>{program.audience}</strong></div>
            <div className="detail"><small>المدة</small><strong>{program.duration}</strong></div>
            <div className="detail"><small>التكلفة</small><strong>{program.cost}</strong></div>
            <div className="detail"><small>الوسيلة</small><strong>{program.medium}</strong></div>
          </div>

          <div className="two-cols">
            <div className="info-box good">
              <h4>لماذا رُشّح لك؟</h4>
              <ul>{primary.reasons.slice(0, 5).map((reason) => <li key={reason}>{reason}</li>)}</ul>
            </div>
            <div className="info-box bad">
              <h4>انتبه قبل التسجيل</h4>
              <ul>
                {(primary.cautions.length ? primary.cautions : program.notSuitableIf.slice(0, 4)).map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>

          {program.note && <div className="note">⚠️ {program.note}</div>}

          <div className="hero-actions" style={{ marginBottom: 0 }}>
            <button className="primary-btn" onClick={() => openProgram(program.id)}>تفاصيل البرنامج</button>
            <button className="ghost-btn" onClick={() => setView("quiz")}>أعد الاختبار</button>
          </div>
        </div>
      </section>

      <aside className="side-panel">
        <h3 style={{ margin: "0 0 12px", color: "#24392f" }}>بدائل أو مكملات مناسبة</h3>
        <div className="alternatives">
          {alternatives.map((item) => (
            <button key={item.id} className="alt-card" onClick={() => openProgram(item.id)} type="button">
              <div className="alt-head">
                <span className="alt-name">{item.program.icon} {item.program.name}</span>
                <span className="alt-score">{item.match}%</span>
              </div>
              <ul className="reason-list">
                {item.reasons.slice(0, 2).map((reason) => <li key={reason}>{reason}</li>)}
              </ul>
            </button>
          ))}
        </div>
        <div className="note">
          الخوارزمية لا تجعل العمر وحده حاكمًا؛ بل تسأل عن الهدف ونوع البيئة والوقت والشروط. لذلك تفرق بين إشراق والبناء المنهجي عند نفس العمر.
        </div>
      </aside>
    </main>
  );
}

function ProgramDetail({ id, setView }) {
  const program = programs[id] || programs.bina_muyassar;
  return (
    <main className="wrap program-page">
      <button className="ghost-btn" onClick={() => setView("all")}>رجوع إلى البرامج</button>
      <section className="program-detail" style={{ "--color": program.color, "--accent": program.accent }}>
        <div className="program-detail-hero">
          <span className="match">{program.cluster}</span>
          <h1>{program.icon} {program.name}</h1>
          <p style={{ margin: 0, opacity: .86 }}>{program.tagline}</p>
        </div>
        <div className="program-detail-body">
          <p style={{ lineHeight: 2, color: "#59645c", fontSize: 16 }}>{program.description}</p>
          <div className="detail-grid">
            <div className="detail"><small>الفئة</small><strong>{program.audience}</strong></div>
            <div className="detail"><small>المدة</small><strong>{program.duration}</strong></div>
            <div className="detail"><small>طبيعة القبول</small><strong>{program.type}</strong></div>
            <div className="detail"><small>التكلفة</small><strong>{program.cost}</strong></div>
            <div className="detail"><small>الوسيلة</small><strong>{program.medium}</strong></div>
          </div>
          <div className="two-cols">
            <div className="info-box good">
              <h4>يناسبك إذا…</h4>
              <ul>{program.suitableIf.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="info-box bad">
              <h4>لا يناسبك إذا…</h4>
              <ul>{program.notSuitableIf.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
          {program.requirements.length > 0 && (
            <div className="note">
              <strong>الشروط/المتطلبات:</strong> {program.requirements.join("، ")}
            </div>
          )}
          {program.note && <div className="note">⚠️ {program.note}</div>}
        </div>
      </section>
    </main>
  );
}

function AllProgramsView({ openProgram }) {
  const all = Object.values(programs);
  return (
    <main className="wrap">
      <div className="section-title">
        <div>
          <h2>جميع البرامج والمسارات</h2>
          <p>كل بطاقة تعرض العمر، المدة، التكلفة والوسيلة. اضغط للتفاصيل.</p>
        </div>
      </div>
      <div className="all-grid">
        {all.map((program) => (
          <ProgramMiniCard key={program.id} program={program} onClick={() => openProgram(program.id)} />
        ))}
      </div>
    </main>
  );
}

export default function ProgramSelectorMerged() {
  const [view, setView] = useState("home");
  const [answers, setAnswers] = useState({});
  const [selectedProgram, setSelectedProgram] = useState(null);

  const openProgram = (id) => {
    setSelectedProgram(id);
    setView("program");
  };

  return (
    <div className="program-app">
      <InjectedStyles />
      <TopBar view={view} setView={setView} title="دليل اختيار البرنامج" />
      {view === "home" && <HomeView setView={setView} openProgram={openProgram} />}
      {view === "quiz" && <QuizView setView={setView} setAnswers={setAnswers} />}
      {view === "result" && <ResultView answers={answers} setView={setView} openProgram={openProgram} />}
      {view === "all" && <AllProgramsView openProgram={openProgram} />}
      {view === "program" && <ProgramDetail id={selectedProgram} setView={setView} />}
    </div>
  );
}
