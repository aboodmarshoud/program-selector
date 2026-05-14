import { useMemo, useState } from "react";

const FONT_FAMILY = "Alyamama, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif";

const PROGRAMS = {
  alim: {
    id: "alim",
    name: "برنامج عالِم",
    badge: "تكوين علمي طويل",
    icon: "🕌",
    duration: "11 سنة",
    audience: "غالبًا 14–21 سنة مع شروط خاصة عند الإعلان",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "انتقائي جدًا",
    color: "#0f4f3f",
    soft: "#e6f4ef",
    description:
      "مسار تكويني طويل وعميق لمن يطمح إلى التكوين العلمي الرسالي الموسوعي، مع عناية بالتأصيل والتزكية والفكر والمهارات.",
    suitable: [
      "حافظ للقرآن الكريم كاملًا أو قريب جدًا من شرط البرنامج عند الإعلان.",
      "مستعد لالتزام طويل جدًا لا يقتصر على سنة أو سنتين.",
      "يريد تكوينًا علميًا واسعًا لا مجرد دورة قصيرة أو تخصص جزئي.",
    ],
    caution: [
      "ليس الخيار المناسب لمن لم يتهيأ بعد لحفظ القرآن أو الالتزام الطويل.",
      "راجِع شروط الدفعة الأخيرة عند فتح التسجيل لأنها قد تتغير.",
    ],
  },
  bina_asasi: {
    id: "bina_asasi",
    name: "البناء المنهجي - المسار الأساسي",
    badge: "تأسيس شرعي شامل",
    icon: "📚",
    duration: "نحو 4 سنوات",
    audience: "فوق 15 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "مرحلة تمهيدية واختبار",
    color: "#17446f",
    soft: "#e7f0f8",
    description:
      "مسار شرعي معرفي شامل يجمع بين التأصيل الشرعي والثقافة الإسلامية والبناء الفكري والسلوكي، وهو أنسب لمن يريد بناءً علميًا عامًا لا تخصصًا ضيقًا.",
    suitable: [
      "تريد دراسة شرعية منهجية ومقررات مرتبة.",
      "تستطيع الالتزام اليومي المتوسط لفترة طويلة.",
      "تبحث عن الأساس الشرعي قبل التخصص أو العمل الإصلاحي.",
    ],
    caution: [
      "إن كان وقتك اليومي محدودًا جدًا فقد يكون المسار الميسّر أرفق.",
      "إن كان احتياجك تربويًا شبابيًا وصحبة ومتابعة، فانظر لمسارات أكاديمية الجيل الصاعد المناسبة للعمر.",
    ],
  },
  bina_muyassar: {
    id: "bina_muyassar",
    name: "البناء المنهجي - المسار الميسّر",
    badge: "نسخة أخف",
    icon: "🔖",
    duration: "نحو سنة ونصف",
    audience: "فوق 15 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "مرحلة تمهيدية واختبار",
    color: "#28608c",
    soft: "#edf5fb",
    description:
      "نسخة أخف من البناء المنهجي تراعي المبتدئ أو المشغول أو من لا يستطيع الالتزام بالمسار الأساسي الطويل الآن.",
    suitable: [
      "تحتاج بداية مضبوطة دون ضغط كبير.",
      "وقتك اليومي محدود، لكنك تريد الدخول في مسار علمي منظم.",
      "تريد اختبار قدرتك على الاستمرار قبل المسارات الأطول.",
    ],
    caution: [
      "ليس بديلًا كاملًا عن المسار الأساسي لمن يستطيع المسار الأعمق.",
      "إن كنت تريد أوسع تأسيس ممكن ولديك وقت يومي جيد، فالمسار الأساسي أولى.",
    ],
  },
  fikri: {
    id: "fikri",
    name: "البناء الفكري",
    badge: "وعي ونقد فكري",
    icon: "🧠",
    duration: "نحو 3 سنوات",
    audience: "فوق 15 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "بحسب إعلان البرنامج",
    color: "#58336f",
    soft: "#f2ebf7",
    description:
      "برنامج معرفي يعتني ببناء الوعي والهوية والنقد الفكري والتعامل المنهجي مع الشبهات والتيارات المعاصرة.",
    suitable: [
      "تريد فهمًا أعمق للأفكار المعاصرة لا إجابات مختصرة فقط.",
      "لديك قابلية لمسار طويل نسبيًا في القراءة والتحليل.",
      "تريد تقوية البناء النقدي ومركزية الوحي في النظر للأفكار.",
    ],
    caution: [
      "إن كان القلق الإيماني حاضرًا ومؤثرًا على السكينة، فقد يكون برد اليقين أسبق.",
      "إن كان هدفك تأسيسًا شرعيًا عامًا فالبناء المنهجي أقرب.",
    ],
  },
  bard_yaqin: {
    id: "bard_yaqin",
    name: "برد اليقين",
    badge: "يقين وتزكية",
    icon: "💧",
    duration: "نحو سنة وثمانية أشهر",
    audience: "يناسب غالبًا من فوق 15 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "بحسب إعلان البرنامج",
    color: "#1b6b79",
    soft: "#e6f4f7",
    description:
      "مسار معرفي تزكوي يعالج تثبيت اليقين والثوابت مع عناية واضحة بالقلب والسلوك والتزكية.",
    suitable: [
      "تشعر أن حاجتك الآن طمأنينة إيمانية وترميم داخلي.",
      "تريد مسارًا أقصر وأقرب للقلب من البناء الفكري الموسع.",
      "تحتاج معالجة الشبهات من زاوية يقينية وتزكوية.",
    ],
    caution: [
      "إن كان هدفك الاشتباك الفكري الموسع فالبناء الفكري أوسع.",
      "إن كان هدفك تأصيلًا شرعيًا عامًا فالبناء المنهجي أولى.",
    ],
  },
  hadith: {
    id: "hadith",
    name: "أكاديمية الحديث الإلكترونية",
    badge: "تخصص حديثي",
    icon: "📜",
    duration: "نحو سنتين ونصف",
    audience: "المهتمون بعلوم الحديث والسنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "بحسب إعلان الأكاديمية",
    color: "#4c6b2f",
    soft: "#eef5e8",
    description:
      "مسار متخصص في علوم الحديث والسنة يتدرج بالطالب في مباحث الرواية والدراية والتطبيق والبحث.",
    suitable: [
      "تميل إلى تخصص علمي واضح في الحديث.",
      "تريد دراسة منظمة في السنة وعلومها.",
      "لا تريد برنامجًا عامًا يشمل كل الفنون بالدرجة نفسها.",
    ],
    caution: [
      "إن كنت لا تملك أساسًا شرعيًا عامًا فقد تحتاج البناء المنهجي قبله أو معه.",
      "ليس موجهًا لمن يبحث عن صحبة تربوية شبابية بالدرجة الأولى.",
    ],
  },
  kharitat_thughur: {
    id: "kharitat_thughur",
    name: "دورة خارطة الثغور",
    badge: "من البناء إلى العمل",
    icon: "🗺️",
    duration: "3–4 أشهر",
    audience: "المصلحون وطلاب البرامج الإلكترونية",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "تسجيل + اختبار + مواد قبلية",
    color: "#4a6b3d",
    soft: "#edf5ea",
    description:
      "دورة تبصيرية تساعد الطالب على فهم ثغور الأمة وموقعه منها، وكيفية تحويل البناء إلى مشروع عملي يخدم واقعه.",
    suitable: [
      "لديك قدر من البناء وتريد الانتقال إلى العمل الإصلاحي.",
      "تبحث عن مشروع عملي واضح لا مجرد دراسة نظرية.",
      "أنهيت أو تستعد لإنهاء المواد القبلية المطلوبة.",
    ],
    caution: [
      "ليست بديلًا عن أصل البناء الشرعي أو الإيماني.",
      "تتطلب مواد قبلية واختبارًا ومشروعًا عمليًا.",
    ],
  },
  buthur: {
    id: "buthur",
    name: "أكاديمية الجيل الصاعد - بذور",
    badge: "للأعمار 10–12",
    icon: "🌱",
    duration: "سنتان",
    audience: "10–12 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "مفتوح غالبًا",
    color: "#6f7f2d",
    soft: "#f1f6e7",
    description:
      "مسار تأسيسي مبكر يغرس الإيمان والقيم والأخلاق وأساسيات الدين بلغة تناسب الطفل.",
    suitable: ["لمن عمره 10–12 سنة.", "للبداية الهادئة قبل مسارات اليافعين.", "للأهل الذين يريدون تأسيسًا قيميًا مبكرًا."],
    caution: ["لمن تجاوز 12 سنة توجد مسارات أخرى في الأكاديمية."],
  },
  juthur: {
    id: "juthur",
    name: "أكاديمية الجيل الصاعد - جذور",
    badge: "متابعة خاصة",
    icon: "🌿",
    duration: "سنتان",
    audience: "13–16 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "انتقائي - اختبار قبول",
    color: "#23724d",
    soft: "#e8f5ee",
    description:
      "مسار خاص لليافعين يعتني بالبناء الإيماني والعلمي والوعي والمنهج الإصلاحي مع متابعة تربوية أقرب.",
    suitable: [
      "العمر بين 13 و16 سنة.",
      "توجد جدية وقابلية لاختبار قبول ومتابعة أقرب.",
      "الاحتياج ليس معلومات فقط، بل بيئة تربوية ومرافقة.",
    ],
    caution: ["إن كان المطلوب مسارًا مفتوحًا بلا انتقائية فغراس أرفق."],
  },
  ghiras: {
    id: "ghiras",
    name: "أكاديمية الجيل الصاعد - غراس",
    badge: "المسار العام لليافعين",
    icon: "🌳",
    duration: "سنتان",
    audience: "13–16 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "مفتوح غالبًا",
    color: "#358044",
    soft: "#eaf5ea",
    description:
      "مسار عام لليافعين يقدّم بناءً شموليًا في بيئة آمنة مع أنشطة ومتابعة عامة، وهو أيسر من جذور من جهة الانتقائية.",
    suitable: [
      "العمر بين 13 و16 سنة.",
      "تريد بيئة تربوية دون اختبار انتقائي ثقيل.",
      "تحتاج صحبة وأنشطة وبناء عام مناسب للعمر.",
    ],
    caution: ["إن كان الطالب متميزًا ويقبل اختبارًا ومتابعة خاصة فجذور أقرب."],
  },
  ishraq: {
    id: "ishraq",
    name: "أكاديمية الجيل الصاعد - إشراق",
    badge: "بيئة تربوية شبابية",
    icon: "☀️",
    duration: "سنتان",
    audience: "17–20 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "انتقائي - اختبار قبول",
    color: "#7a5a1e",
    soft: "#fff4db",
    description:
      "مسار شبابي في أكاديمية الجيل الصاعد يركّز على البناء الإيماني والوعي والمهارات والصحبة الصالحة والمتابعة التربوية.",
    suitable: [
      "العمر بين 17 و20 سنة.",
      "تحتاج بيئة تربوية وصحبة ومتابعة لا مجرد مقررات.",
      "تريد تحصينًا شبابيًا يناسب مرحلة الجامعة وبدايات الاستقلال.",
    ],
    caution: [
      "إن كان هدفك دراسة شرعية منهجية عامة فالبناء المنهجي أقرب.",
      "إن كنت من خريجي جذور أو إشراق ومؤهلًا للتخصص فراجع إثمار.",
    ],
  },
  ithmar: {
    id: "ithmar",
    name: "أكاديمية الجيل الصاعد - إثمار",
    badge: "لخريجي جذور وإشراق",
    icon: "🌟",
    duration: "4 سنوات",
    audience: "15–22 سنة من خريجي جذور أو إشراق",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "خاص جدًا وانتقائي",
    color: "#8b6424",
    soft: "#f9f1df",
    description:
      "المرحلة الأكثر تقدمًا في أكاديمية الجيل الصاعد، مخصصة لنخبة المميزين من خريجي جذور وإشراق، وتنقل الطالب من البناء العام إلى التخصص الدقيق.",
    suitable: [
      "أتممت جذور أو إشراق سابقًا.",
      "العمر بين 15 و22 سنة.",
      "تريد تخصصًا دقيقًا بإشراف علمي ومهاري عالٍ.",
    ],
    caution: ["لا يستقبل المبتدئين ولا من لم يتخرج من جذور أو إشراق."],
  },
  khadija: {
    id: "khadija",
    name: "مدرسة خديجة",
    badge: "محضن نسائي تفاعلي",
    icon: "🧕",
    duration: "نحو سنة",
    audience: "النساء من 16 سنة فأكثر",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "انتقائي - عدد محدود",
    color: "#8a3f63",
    soft: "#f9eaf1",
    description:
      "محضن نسائي تفاعلي يعتني بالبناء الإيماني والتربوي والعلمي في بيئة لقاءات ومتابعة وأخوة آمنة.",
    suitable: [
      "أنتِ امرأة فوق 16 سنة وتريدين بيئة نسائية حيّة.",
      "تفضلين اللقاءات والتفاعل لا الدراسة الذاتية وحدها.",
      "تبحثين عن بناء إيماني وعلمي وتربوي متوازن.",
    ],
    caution: ["لا يظهر هذا الخيار ولا يُرشح إلا عند اختيار الجنس: أنثى."],
  },
};

const AGE_VALUE = {
  "10_12": 11,
  "13_14": 14,
  "15_16": 16,
  "17_20": 19,
  "21_22": 22,
  "23_plus": 26,
};

function isAgeAtLeast15(a) {
  return AGE_VALUE[a.age] >= 16;
}

function isYouthAcademyAge(a) {
  return ["10_12", "13_14", "15_16", "17_20", "21_22"].includes(a.age);
}

function option(value, title, sub, icon = "▫️") {
  return { value, title, sub, icon };
}

const QUESTIONS = [
  {
    id: "forWhom",
    title: "لمن تبحث عن البرنامج؟",
    subtitle: "هذا لا يحدد النتيجة وحده، لكنه يساعد في صياغة الأسئلة التالية.",
    options: () => [
      option("self", "لي أنا", "أبحث عن البرنامج الأنسب لي شخصيًا", "👤"),
      option("child", "لابني أو ابنتي", "أريد ترشيحًا يناسب العمر والبيئة التربوية", "👥"),
      option("friend", "لصديق أو لصديقة", "أريد مساعدة شخص آخر على اختيار الأنسب", "🤝"),
    ],
  },
  {
    id: "gender",
    title: "ما الجنس؟",
    subtitle: "بعض البرامج خاصة بالنساء، لذلك نحتاج هذا السؤال حتى لا تظهر خيارات غير مناسبة.",
    options: () => [option("male", "ذكر", "", "👤"), option("female", "أنثى", "", "🧕")],
  },
  {
    id: "age",
    title: "ما عمر الشخص المستفيد؟",
    subtitle: "قسمنا الأعمار بطريقة تساعد على التفريق بين مسارات الجيل الصاعد وبرامج الكبار.",
    options: () => [
      option("10_12", "10–12 سنة", "غالبًا مرحلة بذور", "🌱"),
      option("13_14", "13–14 سنة", "بداية مرحلة اليافعين", "🌿"),
      option("15_16", "15–16 سنة", "مرحلة مشتركة بين اليافعين وبعض برامج +15", "🌳"),
      option("17_20", "17–20 سنة", "مرحلة الشباب وبدايات الجامعة", "☀️"),
      option("21_22", "21–22 سنة", "مرحلة متقدمة نسبيًا", "🧭"),
      option("23_plus", "أكثر من 22 سنة", "برامج الكبار غالبًا", "📚"),
    ],
  },
  {
    id: "dailyTime",
    title: "ما مقدار الوقت اليومي المتاح غالبًا؟",
    subtitle: "ليس المطلوب المثالية؛ اختر ما يغلب على الأيام فعلًا.",
    condition: (a) => a.age && a.age !== "10_12",
    options: () => [
      option("15", "15–20 دقيقة يوميًا", "أستطيع القليل الثابت فقط", "⏱️"),
      option("30", "30–45 دقيقة يوميًا", "وقت خفيف لكنه قابل للاستمرار", "🕰️"),
      option("60", "نحو ساعة يوميًا", "أستطيع التزامًا متوسطًا", "⌛"),
      option("90", "أكثر من ساعة ونصف يوميًا", "الدراسة أولوية عالية عندي", "🔥"),
    ],
  },
  {
    id: "needPattern",
    title: "أي وصف أقرب لاحتياجك الآن؟",
    subtitle: "اختر العبارة التي تشبه حالتك، لا اسم البرنامج الذي تفكر فيه.",
    condition: (a) => a.age && a.age !== "10_12",
    options: (a) => {
      const base = [
        option("structured_path", "أحتاج مسارًا علميًا مرتبًا", "مواد واضحة، تدرج، اختبارات، وواجبات", "📚"),
        option("relational_growth", "أحتاج بيئة تساعدني على الثبات", "صحبة، متابعة، أجواء تربوية، ومرافقة", "🤝"),
        option("certainty", "أحتاج طمأنينة ويقينًا أكثر", "ترميم إيماني وسكينة أمام الشكوك والقلق", "💧"),
        option("intellectual_depth", "أحتاج فهم الأفكار المعاصرة ونقدها", "وعي فكري، شبهات، تيارات، ومركزية الوحي", "🧠"),
        option("specialized_track", "أميل لتخصص علمي واضح", "تعمق في مجال محدد لا بناء عام فقط", "📜"),
        option("reform_project", "أريد تحويل التعلم إلى عمل إصلاحي", "ما ثغري؟ وكيف أخدم واقعي بمشروع؟", "🗺️"),
      ];
      if (a.gender === "female" && isAgeAtLeast15(a)) {
        base.push(option("women_space", "أحتاج محضنًا نسائيًا تفاعليًا", "لقاءات، بناء إيماني وعلمي، وبيئة نسائية", "🧕"));
      }
      return base;
    },
  },
  {
    id: "learningShape",
    title: "أي شكل تعلّم يرفع فرص استمرارك؟",
    subtitle: "هذا السؤال يفرّق بين البرنامج التعليمي الصرف والبيئة التربوية.",
    condition: (a) => a.age && a.age !== "10_12",
    options: () => [
      option("curriculum", "مقررات واضحة وخطة دراسة", "أحب أن أعرف ماذا أدرس ومتى أختبر", "📝"),
      option("community", "صحبة ومتابعة وتربية", "أستمر أكثر عندما أكون في بيئة مشجعة", "🤲"),
      option("deep_reading", "قراءة وتحليل ونقاش أفكار", "أرتاح للمسارات التي توسع النظر والتحليل", "🔎"),
      option("practice", "مشروع تطبيقي في الواقع", "أريد ثمرة عملية لا معرفة نظرية فقط", "🧩"),
      option("gentle_start", "بداية أخف بلا ضغط", "أخشى أن أبدأ بقوة ثم أنقطع", "🌤️"),
    ],
  },
  {
    id: "selectivity",
    title: "كيف تتعامل مع الاختبارات والقبول الانتقائي؟",
    subtitle: "ليست الأفضلية دائمًا للأصعب؛ المهم ما يناسب مرحلتك.",
    condition: (a) => a.age && a.age !== "10_12",
    options: () => [
      option("open", "أفضل مسارًا مفتوحًا أو أيسر", "لا أريد أن يكون القبول عائقًا الآن", "🚪"),
      option("ok_test", "لا مانع من اختبار قبول", "إن كان البرنامج مناسبًا فأنا مستعد", "✅"),
      option("high_selective", "أفضل مسارًا نخبويًا ولو كان أصعب", "أبحث عن تحدٍّ ومتابعة أعلى", "🏆"),
    ],
  },
  {
    id: "previousAcademy",
    title: "هل سبق للمستفيد أن أتمّ مسارًا في أكاديمية الجيل الصاعد؟",
    subtitle: "هذا مهم فقط لمعرفة أهلية إثمار، وليس لتقييم الشخص نفسه.",
    condition: (a) => ["15_16", "17_20", "21_22"].includes(a.age),
    options: () => [
      option("none", "لا", "لم يتم جذور أو إشراق", "—"),
      option("juthur", "نعم، تمّ إتمام جذور", "", "🌿"),
      option("ishraq", "نعم، تمّ إتمام إشراق", "", "☀️"),
      option("both", "تمّ إتمام جذور وإشراق", "", "🌟"),
    ],
  },
  {
    id: "quranLevel",
    title: "ما مستوى حفظ القرآن؟",
    subtitle: "هذا لا يمنع غالب البرامج، لكنه مهم لبعض المسارات الطويلة جدًا.",
    condition: (a) => isAgeAtLeast15(a),
    options: () => [
      option("little", "أحفظ سورًا أو أجزاء قليلة", "", "📖"),
      option("partial", "أحفظ قدرًا متوسطًا", "جزء أو عدة أجزاء", "📘"),
      option("full", "أحفظ القرآن كاملًا", "", "🏅"),
    ],
  },
  {
    id: "doubtImpact",
    title: "عند ورود الشبهات أو القلق الفكري، ما الأثر الغالب؟",
    subtitle: "الفرق هنا بين معالجة يقينية تزكوية ومعالجة فكرية موسعة.",
    condition: (a) => isAgeAtLeast15(a),
    options: () => [
      option("low", "أتعامل معها بهدوء غالبًا", "أحتاج معرفة وتوسيع أفق أكثر من ترميم داخلي", "🌿"),
      option("medium", "تؤثر أحيانًا وتحتاج ترتيبًا", "أحتاج تثبيتًا مع فهم", "⚖️"),
      option("high", "تؤثر على السكينة والعبادة", "أحتاج يقينًا وتزكية قبل التوسع الجدلي", "💧"),
      option("theoretical", "أراها أسئلة فكرية وتحليلية", "أريد أدوات نقد وفهم للتيارات", "🧠"),
    ],
  },
  {
    id: "reformReadiness",
    title: "بالنسبة للعمل الإصلاحي العملي، أين أنت؟",
    subtitle: "يظهر هذا السؤال لمن تميل إجاباته إلى العمل والمشاريع.",
    condition: (a) =>
      isAgeAtLeast15(a) && (a.needPattern === "reform_project" || a.learningShape === "practice"),
    options: () => [
      option("not_now", "ليس هذا احتياجي الآن", "أحتاج بناءً قبل المشروع", "🧱"),
      option("interested", "مهتم ولم أدرس المواد القبلية بعد", "أحتاج أن أتهيأ أولًا", "🧭"),
      option("ready", "درست أو سأدرس المواد القبلية", "مركزيات الإصلاح، شرح المنهاج، بوصلة المصلح", "🗺️"),
    ],
  },
];

function cleanAnswers(answers) {
  const next = { ...answers };
  if (next.gender !== "female" && next.needPattern === "women_space") delete next.needPattern;
  if (!["15_16", "17_20", "21_22"].includes(next.age)) delete next.previousAcademy;
  if (!isAgeAtLeast15(next)) {
    delete next.quranLevel;
    delete next.doubtImpact;
  }
  if (!(isAgeAtLeast15(next) && (next.needPattern === "reform_project" || next.learningShape === "practice"))) {
    delete next.reformReadiness;
  }
  return next;
}

function isEligible(programId, a) {
  if (!a.age) return true;
  const age = a.age;
  const adult = isAgeAtLeast15(a);
  switch (programId) {
    case "buthur":
      return age === "10_12";
    case "juthur":
    case "ghiras":
      // إذا صرّح المستخدم بإتمام جذور أو إشراق فلا نعيد اقتراح مسارات أدنى داخل الأكاديمية.
      return (age === "13_14" || age === "15_16") && (!a.previousAcademy || a.previousAcademy === "none");
    case "ishraq":
      // إذا صرّح المستخدم بإتمام جذور أو إشراق فلا نعيد اقتراح إشراق؛ التوجيه يكون إلى إثمار أو بدائل مناسبة.
      return age === "17_20" && (!a.previousAcademy || a.previousAcademy === "none");
    case "ithmar":
      return ["15_16", "17_20", "21_22"].includes(age) && ["juthur", "ishraq", "both"].includes(a.previousAcademy);
    case "khadija":
      return a.gender === "female" && adult;
    case "alim":
      return ["15_16", "17_20", "21_22"].includes(age);
    case "bina_asasi":
    case "bina_muyassar":
    case "fikri":
    case "bard_yaqin":
    case "hadith":
    case "kharitat_thughur":
      return adult;
    default:
      return true;
  }
}

function addScore(scores, id, points, reason) {
  if (!scores[id]) scores[id] = { id, score: 0, reasons: [] };
  scores[id].score += points;
  if (reason && points > 0 && !scores[id].reasons.includes(reason)) scores[id].reasons.push(reason);
}

function calculateScorecard(a) {
  const scores = {};
  Object.keys(PROGRAMS).forEach((id) => {
    scores[id] = { id, score: isEligible(id, a) ? 0 : -999, reasons: [] };
  });

  if (a.age === "10_12") addScore(scores, "buthur", 120, "العمر يطابق مسار بذور");
  if (a.age === "13_14") {
    addScore(scores, "ghiras", 70, "العمر ضمن مسارات اليافعين");
    addScore(scores, "juthur", 65, "العمر يسمح بالمسار الخاص عند الجدية");
  }
  if (a.age === "15_16") {
    addScore(scores, "ghiras", 45, "العمر ما زال مناسبًا لمسارات اليافعين");
    addScore(scores, "juthur", 45, "العمر مناسب للمسار الخاص إذا وجدت الجدية");
    addScore(scores, "bina_muyassar", 18, "العمر فوق 15 فيمكن البدء بتأسيس شرعي ميسر");
    addScore(scores, "bina_asasi", 15, "العمر فوق 15 فيمكن دخول البناء المنهجي");
  }
  if (a.age === "17_20") {
    addScore(scores, "ishraq", 45, "العمر مناسب لأكاديمية الجيل الصاعد - إشراق");
    addScore(scores, "bina_asasi", 22, "العمر فوق 15 ويناسب البناء الشرعي المنهجي");
    addScore(scores, "bina_muyassar", 18, "العمر فوق 15 مع احتمال الحاجة لبداية أخف");
  }
  if (a.age === "21_22" || a.age === "23_plus") {
    addScore(scores, "bina_asasi", 24, "العمر مناسب لبرامج التأسيس للكبار");
    addScore(scores, "bina_muyassar", 20, "يمكن اختيار النسخة الأخف بحسب الوقت");
    addScore(scores, "fikri", 12, "العمر مناسب للمعالجة الفكرية الأوسع");
    addScore(scores, "hadith", 10, "العمر مناسب للتخصص العلمي");
  }

  if (a.forWhom === "child" && isYouthAcademyAge(a)) {
    addScore(scores, "buthur", 12, "البحث لابن أو ابنة يرجح البيئة العمرية المناسبة");
    addScore(scores, "ghiras", 18, "البحث لابن أو ابنة يرجح بيئة تربوية آمنة");
    addScore(scores, "juthur", 14, "يمكن النظر للمسار الخاص إذا كان الابن جادًا");
    addScore(scores, "ishraq", 14, "البيئة الشبابية التربوية قد تناسب هذه المرحلة");
  }

  if (a.dailyTime === "15") {
    addScore(scores, "bina_muyassar", 34, "وقتك اليومي محدود فالميسّر أرفق");
    addScore(scores, "bard_yaqin", 16, "المدة اليومية الخفيفة تناسب مسارًا أرفق نسبيًا");
    addScore(scores, "ghiras", 12, "المسار العام أخف من الانتقائي");
  }
  if (a.dailyTime === "30") {
    addScore(scores, "bina_muyassar", 26, "30–45 دقيقة يوميًا ترجّح البداية الميسرة");
    addScore(scores, "bard_yaqin", 14, "الوقت المتوسط الخفيف يناسب مسار يقين وتزكية");
    addScore(scores, "ishraq", 10, "يمكن للبيئة التربوية أن تناسب هذا القدر إذا توفرت الجدية");
  }
  if (a.dailyTime === "60") {
    addScore(scores, "bina_asasi", 30, "نحو ساعة يوميًا مناسب للمسار الأساسي");
    addScore(scores, "juthur", 18, "الالتزام اليومي جيد للمسارات الخاصة");
    addScore(scores, "ishraq", 18, "الالتزام اليومي جيد لإشراق");
    addScore(scores, "fikri", 14, "لديك وقت مناسب لمسار فكري أطول");
    addScore(scores, "hadith", 14, "لديك وقت مناسب لتخصص علمي");
  }
  if (a.dailyTime === "90") {
    addScore(scores, "bina_asasi", 34, "الوقت اليومي العالي يدعم المسار الأساسي");
    addScore(scores, "alim", 24, "الوقت العالي يقربك من المسارات الطويلة جدًا");
    addScore(scores, "ithmar", 24, "الوقت العالي يناسب التخصص الدقيق إذا توفرت الأهلية");
    addScore(scores, "fikri", 24, "الوقت العالي مناسب للمسار الفكري العميق");
    addScore(scores, "hadith", 22, "الوقت العالي مناسب للتخصص الحديثي");
  }

  if (a.needPattern === "structured_path") {
    addScore(scores, "bina_asasi", 42, "تحتاج مسارًا علميًا منهجيًا مرتبًا");
    addScore(scores, "bina_muyassar", 28, "تحتاج ترتيبًا علميًا مع احتمال البداية الأخف");
    addScore(scores, "hadith", 14, "المسارات المتخصصة المنظمة قد تناسبك لاحقًا");
  }
  if (a.needPattern === "relational_growth") {
    addScore(scores, "ishraq", 44, "احتياجك بيئة تربوية وصحبة ومتابعة");
    addScore(scores, "juthur", 36, "احتياجك بيئة تربوية خاصة");
    addScore(scores, "ghiras", 30, "احتياجك بيئة آمنة عامة للناشئة");
    addScore(scores, "khadija", 20, "البيئة التفاعلية قد تناسبك إن كنتِ ضمن شروط مدرسة خديجة");
  }
  if (a.needPattern === "certainty") {
    addScore(scores, "bard_yaqin", 52, "احتياجك الأقرب هو اليقين والتزكية");
    addScore(scores, "fikri", 12, "قد تحتاج لاحقًا لمعالجة فكرية أوسع");
  }
  if (a.needPattern === "intellectual_depth") {
    addScore(scores, "fikri", 52, "احتياجك فهم فكري ونقد للتيارات");
    addScore(scores, "bard_yaqin", 15, "قد تحتاج جانبًا يقينيًا وتزكويًا مساعدًا");
  }
  if (a.needPattern === "specialized_track") {
    addScore(scores, "hadith", 36, "تميل إلى تخصص علمي واضح");
    addScore(scores, "ithmar", 30, "التخصص الدقيق يناسبك إذا كنت من خريجي جذور أو إشراق");
    addScore(scores, "alim", 18, "قد يناسبك مسار تكويني طويل إذا توفرت شروطه");
  }
  if (a.needPattern === "reform_project") {
    addScore(scores, "kharitat_thughur", 56, "تريد معرفة ثغرك وتحويل التعلم إلى مشروع");
    addScore(scores, "bina_asasi", 12, "قد تحتاج أساسًا شرعيًا قبل العمل الإصلاحي");
  }
  if (a.needPattern === "women_space") {
    addScore(scores, "khadija", 72, "اخترتِ محضنًا نسائيًا تفاعليًا");
  }

  if (a.learningShape === "curriculum") {
    addScore(scores, "bina_asasi", 34, "تفضّل المقررات والخطة الواضحة");
    addScore(scores, "bina_muyassar", 22, "الخطة الواضحة مع بداية أخف خيار محتمل");
    addScore(scores, "hadith", 18, "التخصص الحديثي منظم ومناسب لمحبي المقررات");
  }
  if (a.learningShape === "community") {
    addScore(scores, "ishraq", 42, "تستمر أكثر مع الصحبة والمتابعة");
    addScore(scores, "juthur", 34, "الصحبة والمتابعة من خصائص المسار الخاص");
    addScore(scores, "ghiras", 28, "المسار العام يوفر بيئة وأنشطة مناسبة");
    addScore(scores, "khadija", 22, "البيئة التفاعلية النسائية مناسبة إن انطبقت الشروط");
  }
  if (a.learningShape === "deep_reading") {
    addScore(scores, "fikri", 38, "تفضّل التحليل والقراءة الفكرية");
    addScore(scores, "bina_asasi", 14, "البناء الشرعي يساعد في ضبط القراءة");
  }
  if (a.learningShape === "practice") {
    addScore(scores, "kharitat_thughur", 44, "تريد ثمرة عملية ومشروعًا في الواقع");
    addScore(scores, "ishraq", 10, "المهارات والوعي العملي قد تناسب المرحلة الشبابية");
  }
  if (a.learningShape === "gentle_start") {
    addScore(scores, "bina_muyassar", 36, "تريد بداية أخف قابلة للاستمرار");
    addScore(scores, "bard_yaqin", 18, "تحتاج مسارًا أرفق وأقرب للقلب");
    addScore(scores, "ghiras", 18, "المسار العام أيسر من الانتقائي");
  }

  if (a.selectivity === "open") {
    addScore(scores, "ghiras", 22, "تفضل مسارًا مفتوحًا");
    addScore(scores, "bina_muyassar", 14, "تفضل البداية الأيسر");
    addScore(scores, "bard_yaqin", 8, "الانتقائية ليست مركزية في اختيارك");
  }
  if (a.selectivity === "ok_test") {
    addScore(scores, "bina_asasi", 14, "لا تمانع اختبارًا أو مرحلة قبول");
    addScore(scores, "juthur", 18, "لا تمانع اختبار القبول للمسار الخاص");
    addScore(scores, "ishraq", 18, "لا تمانع اختبار القبول لإشراق");
  }
  if (a.selectivity === "high_selective") {
    addScore(scores, "alim", 26, "تقبل المسارات العالية الانتقائية");
    addScore(scores, "ithmar", 26, "تقبل المسارات الخاصة المتقدمة إن توفرت الأهلية");
    addScore(scores, "juthur", 18, "تقبل المسار الخاص والمتابعة الأعلى");
    addScore(scores, "khadija", 12, "لا تمانع عددًا محدودًا وقبولًا انتقائيًا");
  }

  if (["juthur", "ishraq", "both"].includes(a.previousAcademy)) {
    addScore(scores, "ithmar", 92, "أهلية إثمار مرتبطة بإتمام جذور أو إشراق");
    // منع ظهور مسارات أُنجزت أو أدنى منها كبدائل قريبة بعد التصريح بالأهلية لإثمار.
    ["juthur", "ghiras", "ishraq"].forEach((id) => {
      scores[id].score = -999;
      scores[id].reasons = [];
    });
  }
  if (a.previousAcademy === "none") {
    addScore(scores, "ishraq", 8, "عدم إتمام جذور أو إشراق يجعل إثمار غير مناسب الآن");
  }

  if (a.quranLevel === "full") addScore(scores, "alim", 48, "حفظ القرآن كاملًا يدعم أهلية برنامج عالِم");
  if (a.quranLevel === "partial") addScore(scores, "bina_asasi", 8, "لديك أساس قرآني جزئي يمكن البناء عليه");
  if (a.quranLevel === "little") addScore(scores, "bina_muyassar", 8, "البداية الميسرة قد تكون أرفق مع ضعف الحفظ");
  if (a.quranLevel && a.quranLevel !== "full") scores.alim.score -= 65;

  if (a.doubtImpact === "high") {
    addScore(scores, "bard_yaqin", 54, "الشبهات تؤثر على السكينة؛ اليقين والتزكية أسبق");
    scores.fikri.score -= 8;
  }
  if (a.doubtImpact === "medium") {
    addScore(scores, "bard_yaqin", 28, "تحتاج تثبيتًا يقينيًا مع فهم");
    addScore(scores, "fikri", 12, "قد يفيدك البناء الفكري لاحقًا");
  }
  if (a.doubtImpact === "theoretical") {
    addScore(scores, "fikri", 34, "تتعامل مع الشبهات كسؤال فكري تحليلي");
  }
  if (a.doubtImpact === "low") {
    addScore(scores, "bina_asasi", 8, "يمكنك البدء بالتأسيس العام دون أولوية علاجية خاصة");
  }

  if (a.reformReadiness === "ready") {
    addScore(scores, "kharitat_thughur", 42, "أنت مستعد للمواد القبلية ومشروع خارطة الثغور");
  }
  if (a.reformReadiness === "interested") {
    addScore(scores, "kharitat_thughur", 18, "لديك اهتمام بالإصلاح لكن تحتاج تهيئة قبلية");
    addScore(scores, "bina_asasi", 12, "البناء المنهجي يقوي الأساس قبل العمل");
  }
  if (a.reformReadiness === "not_now") {
    scores.kharitat_thughur.score -= 25;
    addScore(scores, "bina_asasi", 12, "اعترفت أن البناء أسبق من المشروع العملي الآن");
  }

  // Guardrails: avoid recommending female-only program to males or youth-only programs outside age.
  Object.keys(scores).forEach((id) => {
    if (!isEligible(id, a)) scores[id].score = -999;
  });

  const sorted = Object.values(scores)
    .filter((item) => item.score > -100)
    .sort((x, y) => y.score - x.score)
    .map((item) => ({ ...PROGRAMS[item.id], score: Math.max(0, item.score), reasons: item.reasons.slice(0, 4) }));

  if (sorted.length) return sorted;
  return [PROGRAMS.bina_muyassar, PROGRAMS.bina_asasi].map((program) => ({ ...program, score: 50, reasons: ["اختيار احتياطي آمن عند نقص المعطيات"] }));
}

function visibleQuestions(answers) {
  return QUESTIONS.filter((q) => !q.condition || q.condition(answers));
}

function isBinaProgram(program) {
  return program?.id === "bina_asasi" || program?.id === "bina_muyassar";
}

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function ProgramMini({ program, index, onOpen, primaryScore }) {
  const matchPercent = primaryScore > 0 && typeof program.score === "number"
    ? Math.max(1, Math.min(99, Math.round((program.score / primaryScore) * 100)))
    : null;

  return (
    <button className="mini-program" onClick={() => onOpen(program.id)} type="button">
      <span className="mini-rank">{index + 1}</span>
      <span className="mini-icon">{program.icon}</span>
      <span className="mini-text">
        <strong>{program.name}</strong>
        <small>{program.badge} · {program.duration}</small>
      </span>
      {matchPercent !== null && <span className="mini-score">{matchPercent}%</span>}
      <span className="mini-arrow">تفاصيل</span>
    </button>
  );
}

function BinaComparison() {
  return (
    <div className="compare-box">
      <div className="compare-title">الفرق السريع بين البناء المنهجي - المسار الأساسي والمسار الميسّر</div>
      <div className="compare-grid">
        <div>
          <h4>البناء المنهجي - المسار الميسّر</h4>
          <p>أنسب للمبتدئ أو المشغول أو من يستطيع وقتًا يوميًا محدودًا. مدته أقصر، ويُقصد به الدخول الهادئ في البناء الشرعي.</p>
        </div>
        <div>
          <h4>البناء المنهجي - المسار الأساسي</h4>
          <p>أنسب لمن يريد المسار الأوسع والأعمق، ويستطيع التزامًا يوميًا أوضح واستمرارًا أطول يقارب أربع سنوات.</p>
        </div>
      </div>
    </div>
  );
}

function HomeView({ onStart, onPrograms, onCompare }) {
  return (
    <>
      <section className="hero-card home-hero">
        <div className="hero-pattern" />
        <div className="hero-content">
          <div className="eyebrow">دليل اختيار برامج الشيخ أحمد بن يوسف السيد</div>
          <h1>لا تسجّل في كل برنامج تراه.</h1>
          <p>
            تعرّف على احتياجك، ومرحلتك العمرية، ونمط الالتزام الذي يناسبك؛ ثم اختر البرنامج الأقرب لك بدل التشتت بين كل إعلان جديد.
          </p>
          <div className="hero-actions">
            <button className="main-btn hero-btn" type="button" onClick={onStart}>ابدأ اختبار الاختيار</button>
            <button className="ghost-btn hero-btn" type="button" onClick={onPrograms}>استعراض كل البرامج</button>
            <button className="ghost-btn hero-btn" type="button" onClick={onCompare}>مقارنة عامة</button>
          </div>
        </div>
      </section>

      <section className="intro-grid">
        <div className="intro-card">
          <span>🧭</span>
          <h3>اختيار بحسب الحاجة</h3>
          <p>الاختبار لا يسألك عن اسم البرنامج الذي تريده، بل عن احتياجك الحقيقي وواقعك.</p>
        </div>
        <div className="intro-card">
          <span>🌱</span>
          <h3>مراعاة العمر والمرحلة</h3>
          <p>يفرّق بين برامج الناشئة، وبرامج التأسيس الشرعي، والمسارات الفكرية والتخصصية.</p>
        </div>
        <div className="intro-card">
          <span>📚</span>
          <h3>نتيجة مع بدائل</h3>
          <p>يعرض لك البرنامج الأقرب، ثم بدائل قريبة حتى ترى الفرق قبل التسجيل.</p>
        </div>
      </section>
    </>
  );
}

function ProgramDirectory({ onOpen, onBack }) {
  const list = Object.values(PROGRAMS);
  return (
    <section className="directory-page">
      <div className="section-head">
        <button className="ghost-btn" type="button" onClick={onBack}>العودة للرئيسية</button>
        <div>
          <small>استعراض البرامج</small>
          <h2>كل البرامج والمسارات</h2>
          <p>استعراض سريع دون ترشيح. اضغط على أي برنامج لفتح تفاصيله.</p>
        </div>
      </div>
      <div className="program-grid">
        {list.map((program) => (
          <button className="directory-card" type="button" key={program.id} onClick={() => onOpen(program.id)} style={{ borderColor: `${program.color}35` }}>
            <span className="directory-icon">{program.icon}</span>
            <strong>{program.name}</strong>
            <small>{program.badge}</small>
            <p>{program.description}</p>
            <em>{program.duration} · {program.audience}</em>
          </button>
        ))}
      </div>
    </section>
  );
}

function ComparisonTable({ onOpen, onBack }) {
  const list = Object.values(PROGRAMS);
  return (
    <section className="comparison-page">
      <div className="section-head">
        <button className="ghost-btn" type="button" onClick={onBack}>العودة للرئيسية</button>
        <div>
          <small>مقارنة عامة</small>
          <h2>مقارنة مختصرة بين البرامج</h2>
          <p>هذه المقارنة للاطلاع العام، أما الترشيح الأدق فابدأ اختبار الاختيار.</p>
        </div>
      </div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>البرنامج</th>
              <th>الفئة</th>
              <th>المدة</th>
              <th>طبيعة القبول</th>
              <th>التكلفة</th>
              <th>الوسيلة</th>
              <th>التسجيل</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((program) => (
              <tr key={program.id}>
                <td><strong>{program.icon} {program.name}</strong><small>{program.badge}</small></td>
                <td>{program.audience}</td>
                <td>{program.duration}</td>
                <td>{program.selectivity}</td>
                <td>{program.cost}</td>
                <td>{program.medium}</td>
                <td>{program.registrationStatus}</td>
                <td><button className="table-link" type="button" onClick={() => onOpen(program.id)}>تفاصيل</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default function ProgramSelectorScorecard() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [openedProgramId, setOpenedProgramId] = useState(null);
  const [mode, setMode] = useState("home");

  const qs = useMemo(() => visibleQuestions(answers), [answers]);
  const current = qs[Math.min(step, qs.length - 1)] || qs[0];
  const currentOptions = current ? current.options(answers).filter(Boolean) : [];
  const recommendations = useMemo(() => calculateScorecard(answers), [answers]);
  const primary = recommendations[0];
  const openedProgram = openedProgramId ? recommendations.find((p) => p.id === openedProgramId) || PROGRAMS[openedProgramId] : null;
  const progress = qs.length ? Math.round(((Math.min(step, qs.length - 1) + (answers[current?.id] ? 1 : 0)) / qs.length) * 100) : 0;

  function choose(questionId, value) {
    setAnswers((prev) => cleanAnswers({ ...prev, [questionId]: value }));
  }

  function startQuiz() {
    setAnswers({});
    setStep(0);
    setShowResult(false);
    setOpenedProgramId(null);
    setMode("quiz");
  }

  function next() {
    const safeStep = Math.min(step, qs.length - 1);
    if (!current || !answers[current.id]) return;
    if (safeStep >= qs.length - 1) setShowResult(true);
    else setStep(safeStep + 1);
  }

  function back() {
    if (showResult) {
      setShowResult(false);
      return;
    }
    setStep((s) => Math.max(0, s - 1));
  }

  function restart() {
    setAnswers({});
    setStep(0);
    setShowResult(false);
    setOpenedProgramId(null);
    setMode("quiz");
  }

  function goHome() {
    setMode("home");
    setOpenedProgramId(null);
    setShowResult(false);
  }

  return (
    <div className="selector-root" dir="rtl">
      <style>{styles}</style>
      <main className="app-shell">
        {mode === "home" && !openedProgram && (
          <HomeView onStart={startQuiz} onPrograms={() => setMode("programs")} onCompare={() => setMode("compare")} />
        )}

        {mode === "programs" && !openedProgram && (
          <ProgramDirectory onOpen={setOpenedProgramId} onBack={goHome} />
        )}

        {mode === "compare" && !openedProgram && (
          <ComparisonTable onOpen={setOpenedProgramId} onBack={goHome} />
        )}

        {mode === "quiz" && !showResult && !openedProgram && current && (
          <section className="quiz-card">
            <div className="quiz-topline">
              <button className="ghost-btn" type="button" onClick={goHome}>الرئيسية</button>
              <span>اختبار اختيار البرنامج المناسب</span>
            </div>
            <div className="progress-row">
              <span>السؤال {Math.min(step, qs.length - 1) + 1} من {qs.length}</span>
              <span>{progress}%</span>
            </div>
            <div className="progress"><span style={{ width: `${progress}%` }} /></div>

            <div className="question-head">
              <h2>{current.title}</h2>
              {current.subtitle && <p>{current.subtitle}</p>}
            </div>

            <div className="options-grid">
              {currentOptions.map((opt) => (
                <button
                  className={`option-card ${answers[current.id] === opt.value ? "selected" : ""}`}
                  type="button"
                  key={opt.value}
                  onClick={() => choose(current.id, opt.value)}
                >
                  <span className="option-icon">{opt.icon}</span>
                  <span className="option-copy">
                    <strong>{opt.title}</strong>
                    {opt.sub && <small>{opt.sub}</small>}
                  </span>
                </button>
              ))}
            </div>

            <div className="nav-row">
              <button className="ghost-btn" type="button" onClick={back} disabled={step === 0}>السابق</button>
              <button className="main-btn" type="button" onClick={next} disabled={!answers[current.id]}>
                {step >= qs.length - 1 ? "اعرض النتيجة" : "التالي"}
              </button>
            </div>
          </section>
        )}

        {mode === "quiz" && showResult && !openedProgram && primary && (
          <section className="result-wrap">
            <div className="result-main" style={{ borderColor: `${primary.color}55` }}>
              <div className="result-top" style={{ background: `linear-gradient(135deg, ${primary.soft}, #ffffff)` }}>
                <span className="result-icon">{primary.icon}</span>
                <div>
                  <div className="result-label">البرنامج الأقرب لاحتياجك الآن</div>
                  <h2 style={{ color: primary.color }}>{primary.name}</h2>
                  <p>{primary.description}</p>
                </div>
              </div>

              <div className="result-body">
                <div className="detail-grid">
                  <div><small>المدة</small><strong>{primary.duration}</strong></div>
                  <div><small>الفئة</small><strong>{primary.audience}</strong></div>
                  <div><small>طبيعة القبول</small><strong>{primary.selectivity}</strong></div>
                  <div><small>التكلفة</small><strong>{primary.cost}</strong></div>
                  <div><small>الوسيلة</small><strong>{primary.medium}</strong></div>
                  <div><small>التسجيل</small><strong>{primary.registrationStatus}</strong></div>
                </div>

                {!!primary.reasons?.length && (
                  <div className="why-box">
                    <h3>لماذا ظهر هذا الترشيح؟</h3>
                    {primary.reasons.map((r) => <p key={r}>• {r}</p>)}
                  </div>
                )}

                {isBinaProgram(primary) && <BinaComparison />}

                <div className="two-cols">
                  <div className="green-box">
                    <h3>يناسبك إذا…</h3>
                    {primary.suitable.map((item) => <p key={item}>• {item}</p>)}
                  </div>
                  <div className="amber-box">
                    <h3>انتبه قبل التسجيل…</h3>
                    {primary.caution.map((item) => <p key={item}>• {item}</p>)}
                  </div>
                </div>
              </div>
            </div>

            <div className="side-card">
              <h3>بدائل قريبة</h3>
              {recommendations.slice(1, 5).map((p, i) => (
                <ProgramMini key={p.id} program={p} index={i + 1} onOpen={setOpenedProgramId} primaryScore={primary.score} />
              ))}
              <button className="ghost-wide" type="button" onClick={restart}>إعادة الاختبار من البداية</button>
              <button className="ghost-wide" type="button" onClick={() => setMode("compare")}>فتح المقارنة العامة</button>
            </div>
          </section>
        )}

        {openedProgram && (
          <section className="program-page">
            <button className="ghost-btn back-program" type="button" onClick={() => setOpenedProgramId(null)}>العودة</button>
            <article className="program-card" style={{ borderColor: `${openedProgram.color}55` }}>
              <div className="program-head" style={{ background: `linear-gradient(135deg, ${openedProgram.soft}, #fff)` }}>
                <span>{openedProgram.icon}</span>
                <div>
                  <small>{openedProgram.badge}</small>
                  <h2 style={{ color: openedProgram.color }}>{openedProgram.name}</h2>
                  <p>{openedProgram.description}</p>
                </div>
              </div>
              <div className="result-body">
                <div className="detail-grid">
                  <div><small>المدة</small><strong>{openedProgram.duration}</strong></div>
                  <div><small>الفئة</small><strong>{openedProgram.audience}</strong></div>
                  <div><small>التكلفة</small><strong>{openedProgram.cost}</strong></div>
                  <div><small>الوسيلة</small><strong>{openedProgram.medium}</strong></div>
                  <div><small>طبيعة القبول</small><strong>{openedProgram.selectivity}</strong></div>
                  <div><small>التسجيل</small><strong>{openedProgram.registrationStatus}</strong></div>
                  <div><small>رابط الموقع</small><strong>{openedProgram.officialUrl || "يُضاف لاحقًا"}</strong></div>
                  <div><small>رابط تلجرام</small><strong>{openedProgram.telegramUrl || "يُضاف لاحقًا"}</strong></div>
                </div>
                <div className="two-cols">
                  <div className="green-box"><h3>يناسبك إذا…</h3>{openedProgram.suitable.map((item) => <p key={item}>• {item}</p>)}</div>
                  <div className="amber-box"><h3>لا تتعجل إذا…</h3>{openedProgram.caution.map((item) => <p key={item}>• {item}</p>)}</div>
                </div>
              </div>
            </article>
          </section>
        )}
      </main>
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Alyamama:wght@400;500;600;700;800&display=swap');

* { box-sizing: border-box; }
.selector-root {
  --bg: #f8f4ec;
  --ink: #17201d;
  --muted: #69736e;
  --line: #e5ddcf;
  --card: rgba(255,255,255,0.88);
  --teal: #12745f;
  --teal-soft: #e4f4ef;
  --gold: #b98225;
  min-height: 100vh;
  font-family: ${FONT_FAMILY};
  color: var(--ink);
  background:
    radial-gradient(circle at 12% 12%, rgba(18,116,95,0.13), transparent 28rem),
    radial-gradient(circle at 88% 10%, rgba(185,130,37,0.16), transparent 24rem),
    linear-gradient(135deg, #fbf7ef 0%, #f4ead9 100%);
  padding: 28px 16px 56px;
}
.app-shell { max-width: 1120px; margin: 0 auto; }
.hero-card {
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(18,116,95,0.14);
  border-radius: 34px;
  background: linear-gradient(135deg, rgba(255,255,255,0.92), rgba(255,250,241,0.82));
  box-shadow: 0 24px 80px rgba(47,35,16,0.09);
  padding: 42px;
  margin-bottom: 18px;
}
.hero-pattern {
  position: absolute;
  inset: 0;
  opacity: 0.08;
  background-image: radial-gradient(circle, #12745f 1px, transparent 1.5px);
  background-size: 22px 22px;
}
.hero-content { position: relative; max-width: 760px; }
.eyebrow {
  display: inline-flex;
  background: var(--teal-soft);
  color: #0b604f;
  border: 1px solid rgba(18,116,95,0.18);
  padding: 8px 18px;
  border-radius: 999px;
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 16px;
}
h1 { margin: 0; font-size: clamp(30px, 5vw, 54px); line-height: 1.18; letter-spacing: -0.02em; }
.hero-card p { color: var(--muted); line-height: 2; font-size: 17px; margin: 18px 0 0; }
.hero-pills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 24px; }
.pill { border: 1px solid var(--line); background: #fff; border-radius: 999px; padding: 8px 14px; font-size: 13px; color: #5f5547; }
.quiz-card, .result-main, .side-card, .program-card {
  background: var(--card);
  border: 1px solid var(--line);
  border-radius: 28px;
  box-shadow: 0 20px 60px rgba(47,35,16,0.08);
  backdrop-filter: blur(10px);
}
.quiz-card { max-width: 760px; margin: 0 auto; padding: 28px; }
.progress-row { display: flex; justify-content: space-between; color: var(--muted); font-size: 13px; margin-bottom: 8px; }
.progress { height: 8px; background: #ede4d5; border-radius: 99px; overflow: hidden; margin-bottom: 28px; }
.progress span { display: block; height: 100%; background: linear-gradient(90deg, var(--teal), var(--gold)); border-radius: inherit; transition: width .35s ease; }
.question-head h2 { margin: 0 0 8px; font-size: 26px; line-height: 1.4; }
.question-head p { margin: 0 0 22px; color: var(--muted); line-height: 1.8; }
.options-grid { display: grid; gap: 12px; }
.option-card {
  width: 100%;
  border: 1.5px solid var(--line);
  background: #fffaf3;
  border-radius: 20px;
  padding: 16px;
  cursor: pointer;
  text-align: right;
  display: flex;
  gap: 14px;
  align-items: flex-start;
  font-family: inherit;
  transition: transform .18s ease, border-color .18s ease, background .18s ease, box-shadow .18s ease;
}
.option-card:hover { transform: translateY(-2px); border-color: rgba(18,116,95,0.4); box-shadow: 0 10px 24px rgba(47,35,16,0.08); }
.option-card.selected { background: var(--teal-soft); border-color: var(--teal); box-shadow: 0 10px 24px rgba(18,116,95,0.12); }
.option-icon { font-size: 24px; line-height: 1.2; }
.option-copy { display: grid; gap: 4px; }
.option-copy strong { font-size: 16px; color: var(--ink); }
.option-copy small { color: var(--muted); line-height: 1.65; font-size: 13px; }
.nav-row { display: flex; justify-content: space-between; gap: 12px; margin-top: 24px; }
.main-btn, .ghost-btn, .ghost-wide {
  font-family: inherit;
  border-radius: 16px;
  padding: 12px 24px;
  border: 0;
  cursor: pointer;
  font-weight: 800;
}
.main-btn { background: linear-gradient(135deg, var(--teal), #0d5b4b); color: #fff; box-shadow: 0 12px 24px rgba(18,116,95,0.22); }
.main-btn:disabled { opacity: .45; cursor: not-allowed; box-shadow: none; }
.ghost-btn { border: 1px solid var(--line); background: #fff; color: var(--muted); }
.ghost-btn:disabled { opacity: .4; cursor: not-allowed; }
.result-wrap { display: grid; grid-template-columns: minmax(0, 1fr) 360px; gap: 18px; align-items: start; }
.result-main { overflow: hidden; }
.result-top { padding: 30px; display: flex; gap: 18px; align-items: flex-start; border-bottom: 1px solid var(--line); }
.result-icon { font-size: 56px; }
.result-label { color: var(--muted); font-weight: 800; font-size: 13px; margin-bottom: 6px; }
.result-top h2 { margin: 0; font-size: 32px; line-height: 1.35; }
.result-top p { margin: 10px 0 0; color: var(--muted); line-height: 1.9; }
.result-body { padding: 26px; }
.detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 18px; }
.detail-grid div { background: #faf4ea; border: 1px solid var(--line); border-radius: 16px; padding: 12px; }
.detail-grid small { display: block; color: var(--muted); font-size: 12px; margin-bottom: 4px; }
.detail-grid strong { display: block; font-size: 14px; line-height: 1.55; }
.why-box, .compare-box, .green-box, .amber-box {
  border-radius: 20px;
  padding: 18px;
  margin-bottom: 14px;
}
.why-box { background: #f5efe3; border: 1px solid #eadcc4; }
.why-box h3, .compare-title, .green-box h3, .amber-box h3, .side-card h3 { margin: 0 0 10px; font-size: 17px; }
.why-box p, .green-box p, .amber-box p, .compare-box p { margin: 6px 0; line-height: 1.75; color: #4d554f; font-size: 14px; }
.compare-box { background: #eff7f4; border: 1px solid #cfe7df; }
.compare-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.compare-grid div { background: #fff; border: 1px solid #dcebe6; border-radius: 16px; padding: 14px; }
.compare-grid h4 { margin: 0 0 6px; color: #0d5b4b; }
.two-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.green-box { background: #edf8f1; border: 1px solid #cdebd8; }
.amber-box { background: #fff6e4; border: 1px solid #f0d8a8; }
.side-card { padding: 18px; position: sticky; top: 16px; }
.mini-program {
  width: 100%;
  border: 1px solid var(--line);
  background: #fffaf3;
  border-radius: 18px;
  padding: 12px;
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  text-align: right;
  font-family: inherit;
  margin-bottom: 10px;
}
.mini-rank { width: 28px; height: 28px; display: grid; place-items: center; border-radius: 999px; background: #f0e3ce; color: #7d5a23; font-weight: 900; }
.mini-icon { font-size: 24px; }
.mini-text { flex: 1; display: grid; gap: 2px; }
.mini-text strong { font-size: 14px; }
.mini-text small { color: var(--muted); font-size: 12px; line-height: 1.5; }
.mini-score { background: var(--teal-soft); color: #0b604f; padding: 5px 9px; border-radius: 999px; font-size: 12px; font-weight: 900; direction: ltr; white-space: nowrap; }
.ghost-wide { width: 100%; border: 1px solid var(--line); background: #fff; color: var(--muted); margin-top: 8px; }
.program-page { max-width: 900px; margin: 0 auto; }
.back-program { margin-bottom: 12px; }
.program-card { overflow: hidden; }
.program-head { display: flex; gap: 18px; align-items: flex-start; padding: 30px; border-bottom: 1px solid var(--line); }
.program-head > span { font-size: 54px; }
.program-head small { color: var(--muted); font-weight: 800; }
.program-head h2 { margin: 4px 0 10px; font-size: 32px; }
.program-head p { margin: 0; color: var(--muted); line-height: 1.9; }

.hero-actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.hero-btn { min-width: 170px; justify-content: center; }
.intro-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 18px; }
.intro-card { background: rgba(255,255,255,0.78); border: 1px solid var(--line); border-radius: 24px; padding: 20px; box-shadow: 0 12px 36px rgba(47,35,16,0.06); }
.intro-card span { font-size: 30px; display: block; margin-bottom: 10px; }
.intro-card h3 { margin: 0 0 8px; font-size: 18px; }
.intro-card p { margin: 0; color: var(--muted); line-height: 1.8; font-size: 14px; }
.quiz-topline { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 18px; color: var(--muted); font-weight: 800; }
.section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 18px; }
.section-head small { color: var(--teal); font-weight: 800; }
.section-head h2 { margin: 4px 0 6px; font-size: 32px; }
.section-head p { margin: 0; color: var(--muted); line-height: 1.8; }
.program-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.directory-card { text-align: right; font-family: inherit; cursor: pointer; background: rgba(255,255,255,0.88); border: 1.5px solid var(--line); border-radius: 24px; padding: 20px; min-height: 245px; display: flex; flex-direction: column; gap: 8px; transition: transform .18s ease, box-shadow .18s ease; }
.directory-card:hover { transform: translateY(-3px); box-shadow: 0 18px 45px rgba(47,35,16,0.09); }
.directory-icon { font-size: 34px; }
.directory-card strong { font-size: 18px; color: var(--ink); line-height: 1.5; }
.directory-card small { color: var(--teal); font-weight: 800; }
.directory-card p { margin: 0; color: var(--muted); line-height: 1.7; font-size: 13px; flex: 1; }
.directory-card em { color: #806332; font-style: normal; font-size: 12px; font-weight: 700; }
.comparison-table-wrap { overflow-x: auto; background: rgba(255,255,255,0.88); border: 1px solid var(--line); border-radius: 24px; box-shadow: 0 20px 60px rgba(47,35,16,0.08); }
.comparison-table { width: 100%; min-width: 980px; border-collapse: collapse; }
.comparison-table th, .comparison-table td { padding: 14px; border-bottom: 1px solid var(--line); text-align: right; vertical-align: top; font-size: 13px; line-height: 1.6; }
.comparison-table th { background: #fff7ea; color: #685137; font-size: 12px; }
.comparison-table td strong { display: block; font-size: 14px; color: var(--ink); }
.comparison-table td small { display: block; color: var(--muted); margin-top: 4px; }
.table-link { border: 0; background: var(--teal); color: #fff; border-radius: 10px; padding: 8px 12px; cursor: pointer; font-family: inherit; font-weight: 800; }
.mini-arrow { color: var(--teal); font-weight: 800; font-size: 12px; }

@media (max-width: 900px) {
  .result-wrap { grid-template-columns: 1fr; }
  .side-card { position: static; }
  .detail-grid { grid-template-columns: 1fr 1fr; }
  .intro-grid, .program-grid { grid-template-columns: 1fr; }
  .section-head { flex-direction: column-reverse; }
}
@media (max-width: 620px) {
  .selector-root { padding: 14px 10px 38px; }
  .hero-card { padding: 28px 20px; border-radius: 26px; }
  .quiz-card, .result-main, .side-card, .program-card { border-radius: 22px; }
  .quiz-card { padding: 18px; }
  .result-top, .program-head { flex-direction: column; padding: 22px; }
  .detail-grid, .two-cols, .compare-grid { grid-template-columns: 1fr; }
  .nav-row { flex-direction: column-reverse; }
  .main-btn, .ghost-btn { width: 100%; }
}
`;
