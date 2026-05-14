import { useState } from "react";

const programs = {
  alim: {
    id: "alim",
    name: "برنامج عالِم",
    tagline: "رحلة التكوين العلمي الأطول",
    duration: "11 سنة",
    type: "انتقائي – اختبار قبول",
    cost: "غير معلنة حاليًا",
    audience: "الذكور (14–21)",
    medium: "موقع البرنامج + تيليجرام",
    color: "#1a3a2a",
    accent: "#3d7a55",
    light: "#e8f5ee",
    icon: "🕌",
    description:
      "برنامج لتكوين العلماء الربانيين، يبدأ بالتأصيل وينتهي بالموسوعية، مع العناية بالتزكية والسلوك والفكر والمهارات والتدريب على العطاء والدعوة والإصلاح.",
    suitableIf: [
      "أتممتَ حفظ القرآن الكريم كاملًا واجتزتَ اختباره",
      "تبحث عن أعمق مسار علمي وأطوله",
      "مستعد لالتزام طويل جدًا (11 سنة)",
      "هدفك التكوين العلمي الشامل لا التخصص في موضوع واحد",
    ],
    notSuitableIf: [
      "لم تُتم حفظ القرآن الكريم كاملًا بعد",
      "تبحث عن برنامج عام أو قصير",
      "تريد التخصص في موضوع واحد فقط",
    ],
    requirements: ["حفظ القرآن كاملًا", "اجتياز اختبار الحفظ", "مقابلة شخصية (وردت في إعلان 2023)"],
    note: "بعض الشروط كالعمر والجنس وردت في إعلان 2023 وتحتاج تأكيدًا عند فتح التسجيل.",
  },
  bina_asasi: {
    id: "bina_asasi",
    name: "البناء المنهجي – المسار الأساسي",
    tagline: "التأسيس الشرعي الأشمل",
    duration: "4 سنوات",
    type: "يمر بمرحلة تمهيدية واختبار",
    cost: "مجاني",
    audience: "فوق 15 سنة",
    medium: "موقع البرنامج + تيليجرام",
    color: "#1e3a5f",
    accent: "#2e6fad",
    light: "#e8f0f9",
    icon: "📚",
    description:
      "برنامج شرعي معرفي بنائي إلكتروني يجمع التأسيل الشرعي والثقافة الإسلامية الشمولية والبناء الفكري. محاوره: مساق تأصيل شرعي، ومساق بناء فكري ثقافي سلوكي، ومساق حفظ.",
    suitableIf: [
      "تريد المسار الشرعي الأعرض والأشمل",
      "تستطيع الالتزام طويل المدى (4 سنوات)",
      "تريد تأسيسًا شاملًا لا تخصصًا واحدًا",
      "تقبل الزامًا يوميًا بساعة في المتوسط",
    ],
    notSuitableIf: [
      "أنت مبتدئ جدًا أو مشغول جدًا، فاختر الميسّر",
      "تريد تخصصًا في الحديث أو الفكر فقط",
      "لا تستطيع الالتزام 4 سنوات",
    ],
    requirements: ["اجتياز المرحلة التمهيدية", "اجتياز اختبار القبول"],
    note: "",
  },
  bina_muyassar: {
    id: "bina_muyassar",
    name: "البناء المنهجي – الميسّر",
    tagline: "نسخة أخف للمبتدئ والمشغول",
    duration: "سنة ونصف",
    type: "يمر بمرحلة تمهيدية واختبار",
    cost: "مجاني",
    audience: "فوق 15 سنة",
    medium: "موقع البرنامج + تيليجرام",
    color: "#2d4a6e",
    accent: "#4a7fb5",
    light: "#eef4fb",
    icon: "🔖",
    description:
      "افتُتح لمراعاة تفاوت الناس، وليكون للمبتدئين أو لمن لا يرغبون في إكمال أربع سنوات في الأساسي. نفس الاتجاه العام، بسقف زمني أخف.",
    suitableIf: [
      "أنت مبتدئ في الطلب الشرعي",
      "لديك انشغالات تمنعك من المسار الكامل",
      "تريد تجربة مُحكمة لكن أخف",
      "سنة ونصف هي الحد الذي تستطيعه الآن",
    ],
    notSuitableIf: [
      "تريد التجربة الكاملة الطويلة منذ البداية",
      "لديك وقت ورغبة في المسار الكامل",
    ],
    requirements: ["اجتياز المرحلة التمهيدية", "اجتياز اختبار القبول"],
    note: "هذا المسار نسخة أخف من الأساسي، ليس برنامجًا مستقلًا تمامًا.",
  },
  fikri: {
    id: "fikri",
    name: "البناء الفكري",
    tagline: "لمن يريد سعةً فكريةً لا مجرد أجوبة سريعة",
    duration: "3 سنوات",
    type: "لا توجد شروط قبول معلنة",
    cost: "مجاني",
    audience: "فوق 15 سنة",
    medium: "موقع البرنامج + تيليجرام",
    color: "#3a1a4a",
    accent: "#7a3aaa",
    light: "#f3eaf9",
    icon: "💡",
    description:
      "برنامج معرفي منهجي يهدف إلى تخريج نخب متمكنة في المجال الفكري الإسلامي، عبر تعزيز الهوية الإسلامية والبناء النقدي ومركزية الوحي.",
    suitableIf: [
      "تريد معالجة فكرية موسعة للشبهات والأفكار والتيارات",
      "تقبل مسارًا أطول وأعمق من برد اليقين",
      "هدفك فهم تاريخ الأفكار ونقد الاتجاهات",
      "تريد تحصين نفسك فكريًا بمنهجية",
    ],
    notSuitableIf: [
      "حاجتك الحالية عاجلة وقصيرة الأمد",
      "تريد مزيجًا من الفكر والتزكية معًا",
      "لا تستطيع 3 سنوات، عندها برد اليقين أنسب",
    ],
    requirements: [],
    note: "الشيخ وصفه بأنه أطول من برد اليقين وأوسع منه في الموضوعات الفكرية تحديدًا.",
  },
  bard_yaqin: {
    id: "bard_yaqin",
    name: "برد اليقين",
    tagline: "يقينٌ وتزكيةٌ في مسار أقصر",
    duration: "سنة وثمانية أشهر دراسية",
    type: "لا توجد شروط قبول معلنة",
    cost: "مجاني",
    audience: "لا حد عمري معلن",
    medium: "موقع البرنامج + تيليجرام",
    color: "#1a3a4a",
    accent: "#1a7a9a",
    light: "#e8f4f9",
    icon: "🌿",
    description:
      "برنامج معرفي تزكوي سلوكي، يجمع يقين الثوابت مع البناء التزكوي والسلوكي. له مستويان: بناء سلوكي تزكوي، وتعزيز اليقين وتثبيت الثوابت.",
    suitableIf: [
      "تريد تقوية البعد الإيماني والسلوكي بمنهجية",
      "تواجه شبهات وتريد مسارًا أقصر من البناء الفكري",
      "الحاجة الإيمانية والتزكوية عندك أشد حضورًا",
      "سنة وثمانية أشهر هي المدة التي تستطيعها",
    ],
    notSuitableIf: [
      "تريد معالجة فكرية موسعة جدًا لعدة سنوات",
      "تريد تخصصًا في الحديث أو الشريعة",
    ],
    requirements: [],
    note: "الشيخ وصفه بأنه قريب من صناعة المحاور من جهة المحتوى، لكن فيه زيادات كثيرة من الناحية التزكوية.",
  },
  hadith: {
    id: "hadith",
    name: "أكاديمية الحديث الإلكترونية",
    tagline: "للتخصص الحديثي المتدرج",
    duration: "قرابة سنتين ونصف",
    type: "لا شروط قبول خاصة معلنة",
    cost: "مجاني",
    audience: "لا حد عمري معلن",
    medium: "موقع البرنامج + تيليجرام",
    color: "#2a3a1a",
    accent: "#5a8a2a",
    light: "#eef5e8",
    icon: "📖",
    description:
      "أكاديمية شرعية إلكترونية متخصصة في علوم الحديث والسنة؛ من المراحل الأولية إلى المرحلة المتقدمة درايةً وروايةً. عبر 10 مستويات: التمهيدي، التأسيس، البناء، فقه الحديث، حجية السنة، التمكين، الرواة، التقدم، التطبيق، بحث التخرج.",
    suitableIf: [
      "تريد تخصصًا حديثيًا واضحًا ومتدرجًا",
      "تبحث عن برنامج مجاني ومنظم",
      "تريد شهادة إتمام رسمية",
      "تفضل الدراسة الذاتية بمرونة",
    ],
    notSuitableIf: [
      "هدفك الأول تأسيس شرعي عام شامل لا تخصص الحديث",
      "تريد بناء شرعيًا في مختلف الفنون",
    ],
    requirements: [],
    note: "الاشتراك مجاني رسميًا عبر منصة تسهيل السنة، مع منح شهادات للمتخرجين.",
  },
  kharitat_thughur: {
    id: "kharitat_thughur",
    name: "خارطة الثغور",
    tagline: "جسر بين البناء والعمل الإصلاحي",
    duration: "3–4 أشهر",
    type: "اختبار قبول مع شروط",
    cost: "مجاني",
    audience: "المصلحون وطلاب البرامج الإلكترونية",
    medium: "موقع البرنامج + تيليجرام",
    color: "#2a3a2a",
    accent: "#4a7a3a",
    light: "#edf5ea",
    icon: "🗺️",
    description:
      "برنامج تبصيري للمصلحين وطلاب البرامج الإلكترونية بخارطة ثغور الأمة، وكيفية التفاعل معها بصورة صحيحة، مع الإجابة على الأسئلة المتعلقة بالإصلاح والتفاعل مع الواقع، وسد الفراغات حول المشروع الإصلاحي. ما هي ثغور الأمة؟ وأيها يحتاج إلى عمل؟ ما هو ثغري؟ وما هو موقعه من بقية الثغور؟ وكيف أقيم مشروعًا يخدم الأمة؟ يُختم البرنامج بمشروع عملي يقوم به الطالب يصلح به في واقعه.",
    suitableIf: [
      "تريد فهم ثغور الأمة وكيفية التعامل معها",
      "تبحث عن وضوح في المشروع الإصلاحي",
      "تريد ترجمة البناء إلى عمل فعلي",
      "مستعد لإنجاز مشروع عملي في واقعك",
    ],
    notSuitableIf: [
      "لم تُتم دراسة المواد المطلوبة قبل البرنامج",
      "لا تريد الالتزام بمشروع عملي",
    ],
    requirements: [
      "التسجيل في الاستمارة",
      "اجتياز الاختبار",
      "إتمام دراسة هذه المواد قبل البرنامج: مركزيات الإصلاح، شرح المنهاج، بوصلة المصلح",
    ],
    note: "يُختم البرنامج بمشروع عملي يقوم به الطالب ليُصلح في واقعه.",
  },
  buthur: {
    id: "buthur",
    name: "بذور – الجيل الصاعد",
    tagline: "البداية الصحيحة للأعمار 10–12",
    duration: "سنتان",
    type: "مفتوح للجميع – بلا شروط قبول",
    cost: "مجاني",
    audience: "10–12 سنة",
    medium: "موقع البرنامج + تيليجرام",
    color: "#3a4a1a",
    accent: "#6a8a2a",
    light: "#f0f5e8",
    icon: "🌱",
    description:
      "مسار تأسيسي تمهيدي يعتني بتعليم الإيمان وأساسيات الدين وغرس القيم ومحاسن الأخلاق وتمليك بعض المهارات الشخصية. مفتوح لجميع الأعمار في هذه الشريحة.",
    suitableIf: [
      "عمر المستفيد بين 10–12 سنة",
      "تبحث عن مسار منظم غير انتقائي",
      "هدفك البناء الإيماني والقيمي الأولي",
    ],
    notSuitableIf: [
      "عمر المستفيد 13 سنة فأكثر، فانظر جذور أو غراس",
      "تريد مسارًا انتقائيًا بمتابعة خاصة",
    ],
    requirements: [],
    note: "آخر تصريح رسمي عام عن الأكاديمية عام 2024 وصفها بأنها مجانية.",
  },
  juthur: {
    id: "juthur",
    name: "جذور – الجيل الصاعد",
    tagline: "لمن يحتاج متابعة خاصة في عمر 13–16",
    duration: "سنتان",
    type: "انتقائي – اختبار قبول",
    cost: "مجاني",
    audience: "13–16 سنة",
    medium: "موقع البرنامج + تيليجرام",
    color: "#1a3a2a",
    accent: "#2a7a4a",
    light: "#e8f5ee",
    icon: "🌿",
    description:
      "المسار الخاص للفئة 13–16؛ يعتني بالبناء الشمولي في الإيمان والعلم والوعي والمنهج الإصلاحي، ويتميز بمتابعة تربوية شاملة وأنشطة ومشاريع وتقويم مرن. إن لم يجتز الطالب الاختبار يُنقل إلى غراس.",
    suitableIf: [
      "عمر المستفيد بين 13–16 سنة",
      "تريد رعاية تربوية أقرب ومتابعة فردية",
      "تقبل اختبار القبول",
      "المستفيد جاد ويريد مسارًا انتقائيًا",
    ],
    notSuitableIf: [
      "لا تريد اختبارًا للقبول، فغراس أنسب",
      "عمر المستفيد خارج الشريحة 13–16",
    ],
    requirements: ["تعبئة استمارة", "اختبار قبول (سلسلة تعزيز الهوية للجيل الصاعد)"],
    note: "من لا يجتاز اختبار القبول يُنقل إلى مسار غراس المفتوح.",
  },
  ghiras: {
    id: "ghiras",
    name: "غراس – الجيل الصاعد",
    tagline: "المسار العام للأعمار 13–16",
    duration: "سنتان",
    type: "مفتوح للجميع – بلا شروط قبول",
    cost: "مجاني",
    audience: "13–16 سنة",
    medium: "موقع البرنامج + تيليجرام",
    color: "#1a4a1a",
    accent: "#3a8a3a",
    light: "#eaf5ea",
    icon: "🌳",
    description:
      "المسار العام للفئة 13–16؛ يعتني بالبناء الشمولي العام مع أنشطة تكميلية واستضافات ولقاءات ومسابقات. بلا شروط قبول.",
    suitableIf: [
      "عمر المستفيد بين 13–16 سنة",
      "تريد مسارًا مفتوحًا بلا اختبار",
      "البيئة الأخوية والنشاطات مهمة للمستفيد",
    ],
    notSuitableIf: [
      "تريد رعاية انتقائية ومتابعة فردية أقرب، فجذور أنسب",
      "عمر المستفيد خارج الشريحة 13–16",
    ],
    requirements: [],
    note: "مناسب أيضًا لمن رُشِّح من جذور بعد عدم اجتياز اختبار القبول.",
  },
  ishraq: {
    id: "ishraq",
    name: "إشراق – الجيل الصاعد",
    tagline: "للأعمار 17–20 مع بيئة تحصينية واعية",
    duration: "سنتان",
    type: "انتقائي – اختبار قبول",
    cost: "مجاني",
    audience: "17–20 سنة",
    medium: "موقع البرنامج + تيليجرام",
    color: "#2a1a3a",
    accent: "#6a3a8a",
    light: "#f3eef9",
    icon: "☀️",
    description:
      "مسار خاص يبني الإيمان والوعي والمنهج الإصلاحي ومهارات التعامل مع الواقع، ويؤسس بيئة أخوية تعين على الثبات أمام فتن الشهوات والشبهات.",
    suitableIf: [
      "عمر المستفيد بين 17–20 سنة",
      "تريد بيئة شبابية انتقائية",
      "تقبل اختبار القبول",
      "تريد تحصين إيماني مع وعي ومهارات",
    ],
    notSuitableIf: [
      "عمر المستفيد خارج الشريحة 17–20",
      "لا تقبل اختبار القبول",
    ],
    requirements: ["استمارة تسجيل", "اختبار قبول (مقاصد متن المنهاج من ميراث النبوة)"],
    note: "إذا ظهر خيار إثمار في المنصة فاقرأ وصفه بدقة قبل الاختيار.",
  },
  ithtmar: {
    id: "ithtmar",
    name: "إثمار – الجيل الصاعد",
    tagline: "درة التاج في أكاديمية الجيل الصاعد",
    duration: "4 سنوات",
    type: "انتقائي – لخريجي جذور وإشراق حصرًا",
    cost: "مجاني",
    audience: "15–22 سنة (من خريجي جذور أو إشراق)",
    medium: "موقع البرنامج + تيليجرام",
    color: "#3a2a1a",
    accent: "#8a6a2a",
    light: "#f9f3e8",
    icon: "🌟",
    description:
      "يُمثّل مسار إثمار درة التاج في أكاديمية الجيل الصاعد والمرحلة الأكثر تقدمًا فيها. لا يستقبل هذا المسار المبتدئين، بل هو مصمم خصيصًا ليلتحق به نخبة المميزين من خريجي مسار جذور ومسار إشراق حصرًا. التحول المنهجي الأبرز هو الانتقال من البناء العام إلى التخصص الدقيق عبر عشرة تخصصات علمية وفكرية متنوعة. يتلقى الطالب إشرافًا علميًا دقيقًا وتطويرًا منهجيًا ومهاريًا عالي المستوى مع استمرار البناء التزكوي والإيماني. يهدف المسار إلى ترجمة رؤية الأكاديمية: جيل يعرف قيمته فيتسامى عن الدون، وينطلق من ثوابته لصناعة مستقبله.",
    suitableIf: [
      "أتممت مسار جذور أو إشراق بنجاح (شرط أساسي)",
      "عمرك بين 15–22 سنة",
      "تريد التخصص الدقيق لا البناء العام",
      "مستعد لالتزام أربع سنوات متصلة",
      "تريد إشرافًا علميًا فرديًا عالي المستوى",
    ],
    notSuitableIf: [
      "لم تُكمل مسار جذور أو إشراق — هذا شرط أساسي غير قابل للتجاوز",
      "أنت مبتدئ أو لم تمر بمسار سابق في الأكاديمية",
      "تبحث عن بناء عام لا تخصصًا دقيقًا",
    ],
    requirements: [
      "إتمام مسار جذور أو إشراق بنجاح (شرط أساسي)",
      "اجتياز معايير الانتقاء والمفاضلة",
    ],
    note: "يشتمل المسار على عشرة تخصصات يُساعد الطالب في اختيار الأنسب لميوله وقدراته.",
  },
  khadija: {
    id: "khadija",
    name: "مدرسة خديجة",
    tagline: "بيئة نسائية حيّة لبناء الإيمان والعلم",
    duration: "سنة كاملة",
    type: "انتقائي – عدد محدود",
    cost: "غير معلنة حاليًا",
    audience: "النساء من 16 سنة فأكثر",
    medium: "تفاعلي مباشر – يتطلب حضور اللقاءات",
    color: "#4a1a2a",
    accent: "#9a3a5a",
    light: "#f9eaee",
    icon: "🌸",
    description:
      "مدرسة تربوية إحيائية للمرأة، بمحاور: حلقات الاستهداء، اللقاءات التربوية، القسم العلمي، اللقاءات الودية. تسير عبر خمسة مسارات، وتتطلب حضورًا مباشرًا للقاءات.",
    suitableIf: [
      "أنتِ امرأة من 16 سنة فأكثر",
      "تريدين بيئة نسائية إصلاحية حيّة",
      "تستطيعين الالتزام باللقاءات المباشرة",
      "تبحثين عن بناء إيماني وتربوي وعلمي متكامل",
    ],
    notSuitableIf: [
      "لا تستطيعين الالتزام باللقاءات المباشرة",
      "تبحثين عن مسار ذاتي بالكامل",
      "عمرك أقل من 16 سنة",
    ],
    requirements: ["استمارة تسجيل", "القبول ليس مفتوحًا – العدد محدود"],
    note: "يتطلب الحضور المباشر للقاءات. تواصل مع المقبولات يتم عند القبول.",
  },
};

const questions = [
  {
    id: "for_whom",
    text: "البرنامج لمن؟",
    options: [
      { value: "self", label: "لي أنا" },
      { value: "child", label: "لابني أو ابنتي" },
    ],
  },
  {
    id: "gender",
    text: "ما الجنس؟",
    condition: () => true,
    options: [
      { value: "male", label: "ذكر" },
      { value: "female", label: "أنثى" },
    ],
  },
  {
    id: "age",
    text: "ما العمر التقريبي؟",
    options: [
      { value: "10_12", label: "10–12 سنة" },
      { value: "13_16", label: "13–16 سنة" },
      { value: "17_20", label: "17–20 سنة" },
      { value: "above_20", label: "فوق 20 سنة" },
    ],
  },
  {
    id: "goal",
    text: "ما الهدف الأوضح الآن؟",
    condition: (answers) => answers.age === "above_20",
    options: [
      { value: "general_sharia", label: "تأسيس شرعي عام وشامل" },
      { value: "hadith", label: "تخصص في علوم الحديث" },
      { value: "fikri", label: "معالجة فكرية ونقد الشبهات والتيارات" },
      { value: "yaqin_tazkiya", label: "تعزيز اليقين والتزكية والسلوك" },
      { value: "long_alim", label: "تكوين علمي طويل جدًا (11 سنة)" },
      { value: "women_build", label: "بناء نسائي تفاعلي مباشر" },
    ],
  },
  {
    id: "duration",
    text: "ما المدة التي تحتملها؟",
    condition: (answers) => answers.goal === "general_sharia",
    options: [
      { value: "short", label: "سنة ونصف (مسار ميسّر)" },
      { value: "long", label: "أربع سنوات (مسار كامل)" },
    ],
  },
  {
    id: "quran",
    text: "هل أتممتَ حفظ القرآن الكريم كاملًا؟",
    condition: (answers) => answers.goal === "long_alim",
    options: [
      { value: "yes", label: "نعم، أتممت الحفظ كاملًا" },
      { value: "no", label: "لا، لم أتمه بعد" },
    ],
  },
  {
    id: "selective_13_16",
    text: "هل تريد متابعة خاصة وتقبل اختبار القبول؟",
    condition: (answers) => answers.age === "13_16",
    options: [
      { value: "yes", label: "نعم، أريد متابعة انتقائية" },
      { value: "no", label: "لا، أريد مسارًا مفتوحًا" },
    ],
  },
  {
    id: "selective_17_20",
    text: "هل أتممت مسار جذور أو إشراق في أكاديمية الجيل الصاعد سابقًا؟",
    condition: (answers) => answers.age === "17_20",
    options: [
      { value: "ithtmar", label: "نعم، أتممت جذور أو إشراق وأريد التقدم لإثمار" },
      { value: "ishraq", label: "لا، أريد الالتحاق بإشراق" },
    ],
  },
];

function getRecommendations(answers) {
  const { age, goal, duration, quran, selective_13_16, selective_17_20 } = answers;
  if (age === "10_12") return [programs.buthur];
  if (age === "13_16") {
    if (selective_13_16 === "yes") return [programs.juthur, programs.ghiras];
    return [programs.ghiras, programs.juthur];
  }
  if (age === "17_20") {
    if (selective_17_20 === "ithtmar") return [programs.ithtmar, programs.ishraq];
    return [programs.ishraq];
  }
  if (answers.gender === "female" && goal === "women_build") return [programs.khadija];
  if (goal === "hadith") return [programs.hadith, programs.bina_asasi];
  if (goal === "fikri") return [programs.fikri, programs.bard_yaqin];
  if (goal === "yaqin_tazkiya") return [programs.bard_yaqin, programs.fikri];
  if (goal === "long_alim") {
    if (quran === "yes") return [programs.alim, programs.bina_asasi];
    return [programs.bina_asasi, programs.bina_muyassar];
  }
  if (goal === "general_sharia") {
    if (duration === "short") return [programs.bina_muyassar, programs.bina_asasi];
    return [programs.bina_asasi, programs.bina_muyassar];
  }
  return [programs.bina_asasi];
}

function getReasonText(answers) {
  const reasons = [];
  if (answers.age === "10_12") reasons.push("العمر (10–12) يناسب مسارات الناشئة");
  if (answers.age === "13_16") reasons.push("العمر (13–16) يناسب هذه الشريحة");
  if (answers.age === "17_20") reasons.push("العمر (17–20) يناسب هذه الشريحة");
  if (answers.goal === "hadith") reasons.push("هدفك التخصص الحديثي");
  if (answers.goal === "fikri") reasons.push("هدفك المعالجة الفكرية الموسعة");
  if (answers.goal === "yaqin_tazkiya") reasons.push("هدفك تعزيز اليقين والتزكية");
  if (answers.goal === "long_alim" && answers.quran === "yes") reasons.push("أتممت حفظ القرآن وتقبل الالتزام الطويل");
  if (answers.goal === "general_sharia" && answers.duration === "short") reasons.push("تفضل مسارًا أخف وأقصر");
  if (answers.goal === "general_sharia" && answers.duration === "long") reasons.push("تريد المسار الشرعي الأكمل");
  if (answers.goal === "women_build") reasons.push("تريدين بيئة نسائية تفاعلية مباشرة");
  return reasons.join(" | ");
}

/* ── Shared styles ── */
const BASE_FONT = "'Noto Naskh Arabic', 'Amiri', 'Segoe UI', Tahoma, Arial, sans-serif";

const styles = {
  page: {
    fontFamily: BASE_FONT,
    direction: "rtl",
    minHeight: "100vh",
    background: "linear-gradient(160deg, #0d1f3c 0%, #162b4a 40%, #0f2535 100%)",
    color: "#e8eef5",
  },
  /* ──── HOME HERO ──── */
  hero: {
    position: "relative",
    overflow: "hidden",
    padding: "3.5rem 1.5rem 2.5rem",
    textAlign: "center",
  },
  heroOrb1: {
    position: "absolute", top: -60, right: -60,
    width: 220, height: 220, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(100,180,255,0.12) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  heroOrb2: {
    position: "absolute", bottom: -40, left: -40,
    width: 180, height: 180, borderRadius: "50%",
    background: "radial-gradient(circle, rgba(160,120,255,0.10) 0%, transparent 70%)",
    pointerEvents: "none",
  },
  badge: {
    display: "inline-block",
    background: "rgba(100,180,255,0.15)",
    border: "1px solid rgba(100,180,255,0.3)",
    color: "#7ec8f8",
    fontSize: 12,
    fontWeight: 600,
    padding: "4px 16px",
    borderRadius: 99,
    marginBottom: "1.25rem",
    letterSpacing: "0.05em",
  },
  heroTitle: {
    fontSize: "clamp(22px,5vw,32px)",
    fontWeight: 800,
    color: "#fff",
    margin: "0 0 0.6rem",
    lineHeight: 1.4,
    textShadow: "0 2px 20px rgba(0,0,0,0.3)",
  },
  heroSub: {
    fontSize: 15,
    color: "#9ab5d0",
    margin: "0 0 2rem",
    lineHeight: 1.7,
  },
  divider: {
    width: 48, height: 3,
    background: "linear-gradient(90deg,#4a9fd4,#a064d4)",
    borderRadius: 99, margin: "0 auto 2rem",
    border: "none",
  },
  /* ──── CARDS ──── */
  card: {
    background: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.10)",
    borderRadius: 20,
    backdropFilter: "blur(10px)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  primaryCard: {
    background: "linear-gradient(135deg, rgba(30,80,140,0.7) 0%, rgba(20,55,100,0.85) 100%)",
    border: "1.5px solid rgba(100,180,255,0.3)",
    borderRadius: 20,
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0,80,180,0.2)",
    padding: "2rem",
    marginBottom: "1rem",
  },
  actionBtn: {
    display: "block",
    width: "100%",
    background: "linear-gradient(135deg, #1e6fc8, #2d4ab0)",
    color: "#fff",
    border: "none",
    padding: "15px 36px",
    borderRadius: 12,
    fontSize: 16,
    cursor: "pointer",
    fontWeight: 700,
    textAlign: "center",
    boxShadow: "0 4px 16px rgba(30,111,200,0.4)",
    transition: "opacity 0.2s, transform 0.1s",
    fontFamily: BASE_FONT,
  },
  secondaryBtn: {
    width: "100%",
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.14)",
    color: "#c8dff0",
    borderRadius: 16,
    padding: "1rem 1.5rem",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: "0.75rem",
    transition: "background 0.2s",
    fontFamily: BASE_FONT,
    textAlign: "right",
  },
  statsRow: {
    display: "flex",
    gap: 10,
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "2rem",
  },
  statPill: {
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.12)",
    borderRadius: 99,
    padding: "6px 16px",
    fontSize: 13,
    color: "#9ab5d0",
    display: "flex",
    alignItems: "center",
    gap: 6,
  },
};

/* ──── QUIZ ──── */
function QuizView({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);

  const relevantQuestions = questions.filter(q => !q.condition || q.condition(answers));
  const question = relevantQuestions[current];
  const progress = Math.round(((current) / relevantQuestions.length) * 100);

  const handleNext = () => {
    if (!selected) return;
    const newAnswers = { ...answers, [question.id]: selected };
    setAnswers(newAnswers);
    setSelected(null);
    const nextRelevant = questions.filter(q => !q.condition || q.condition(newAnswers));
    if (current + 1 >= nextRelevant.length) {
      onComplete(newAnswers);
    } else {
      setCurrent(current + 1);
    }
  };

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", padding: "2rem 1rem" }}>
      {/* progress */}
      <div style={{ marginBottom: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span style={{ fontSize: 13, color: "#7a9ab8" }}>السؤال {current + 1} من {relevantQuestions.length}</span>
          <span style={{ fontSize: 13, color: "#7a9ab8" }}>{progress}%</span>
        </div>
        <div style={{ height: 5, background: "rgba(255,255,255,0.1)", borderRadius: 99 }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "linear-gradient(90deg,#4a9fd4,#6a4ad4)", borderRadius: 99, transition: "width 0.4s" }} />
        </div>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: "1.75rem", color: "#ddeeff", lineHeight: 1.5 }}>{question.text}</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: "2rem" }}>
        {question.options.map(opt => (
          <button key={opt.value} onClick={() => setSelected(opt.value)} style={{
            padding: "14px 20px",
            border: selected === opt.value ? "1.5px solid #4a9fd4" : "1px solid rgba(255,255,255,0.12)",
            borderRadius: 14,
            background: selected === opt.value ? "rgba(74,159,212,0.18)" : "rgba(255,255,255,0.05)",
            color: selected === opt.value ? "#7ec8f8" : "#c0d8ee",
            fontSize: 15, textAlign: "right", cursor: "pointer",
            fontWeight: selected === opt.value ? 600 : 400,
            transition: "all 0.2s",
            display: "flex", alignItems: "center", gap: 12,
            fontFamily: BASE_FONT,
          }}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
              border: selected === opt.value ? "6px solid #4a9fd4" : "2px solid rgba(255,255,255,0.25)",
              transition: "all 0.2s",
            }} />
            {opt.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        {current > 0 && (
          <button onClick={() => { setCurrent(current - 1); setSelected(null); }} style={{
            padding: "10px 24px", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 10,
            background: "rgba(255,255,255,0.06)", color: "#9ab5d0", fontSize: 14, cursor: "pointer",
            fontFamily: BASE_FONT,
          }}>← رجوع</button>
        )}
        <button onClick={handleNext} disabled={!selected} style={{
          padding: "10px 32px", border: "none", borderRadius: 10,
          background: selected ? "linear-gradient(135deg,#1e6fc8,#2d4ab0)" : "rgba(255,255,255,0.1)",
          color: selected ? "#fff" : "#5a7a96", fontSize: 15, cursor: selected ? "pointer" : "not-allowed",
          fontWeight: 700, transition: "all 0.2s", fontFamily: BASE_FONT,
        }}>التالي →</button>
      </div>
    </div>
  );
}

/* ──── RESULT ──── */
function ResultView({ answers, onReset, onViewProgram }) {
  const recommendations = getRecommendations(answers);
  const primary = recommendations[0];
  const secondary = recommendations[1];
  const reason = getReasonText(answers);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: 44, marginBottom: "0.5rem" }}>✅</div>
        <h2 style={{ fontSize: 24, fontWeight: 700, color: "#ddeeff", marginBottom: "0.4rem" }}>نتيجة الاختيار</h2>
        {reason && <p style={{ color: "#7a9ab8", fontSize: 13 }}>بناءً على: {reason}</p>}
      </div>

      {/* Primary */}
      <div style={{
        background: `linear-gradient(135deg, ${primary.color}cc 0%, ${primary.color}99 100%)`,
        border: `1.5px solid ${primary.accent}66`,
        borderRadius: 20, padding: "1.5rem", marginBottom: "1rem",
        position: "relative", overflow: "hidden",
        boxShadow: `0 8px 32px ${primary.accent}33`,
      }}>
        <div style={{
          position: "absolute", top: 14, right: 16,
          background: primary.accent, color: "#fff",
          fontSize: 11, fontWeight: 700, padding: "3px 14px", borderRadius: 99, letterSpacing: "0.04em"
        }}>التوصية الأولى</div>

        <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: "1rem", marginBottom: "1rem" }}>
          <span style={{ fontSize: 38 }}>{primary.icon}</span>
          <div>
            <h3 style={{ fontSize: 20, fontWeight: 700, color: "#fff", margin: 0 }}>{primary.name}</h3>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 13, margin: 0 }}>{primary.tagline}</p>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: "1rem" }}>
          {[
            { icon: "⏱", label: primary.duration },
            { icon: "🎯", label: primary.type },
            { icon: "💰", label: primary.cost },
            { icon: "👤", label: primary.audience },
          ].map((item, i) => (
            <span key={i} style={{
              background: "rgba(255,255,255,0.15)", color: "#fff",
              padding: "4px 12px", borderRadius: 99, fontSize: 12, fontWeight: 500
            }}>{item.icon} {item.label}</span>
          ))}
        </div>

        <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, lineHeight: 1.8, marginBottom: "1rem" }}>{primary.description}</p>

        <div style={{ background: "rgba(0,200,80,0.12)", border: "1px solid rgba(0,200,80,0.25)", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "0.75rem" }}>
          <p style={{ fontWeight: 700, color: "#6de89a", fontSize: 13, marginBottom: "0.3rem" }}>✅ يناسبك إذا…</p>
          {primary.suitableIf.map((item, i) => <p key={i} style={{ color: "#a0e8be", fontSize: 13, margin: "2px 0" }}>• {item}</p>)}
        </div>

        <div style={{ background: "rgba(220,50,50,0.12)", border: "1px solid rgba(220,50,50,0.25)", borderRadius: 10, padding: "0.75rem 1rem", marginBottom: "1rem" }}>
          <p style={{ fontWeight: 700, color: "#f08080", fontSize: 13, marginBottom: "0.3rem" }}>❌ لا تسجل هنا إذا…</p>
          {primary.notSuitableIf.map((item, i) => <p key={i} style={{ color: "#f0a0a0", fontSize: 13, margin: "2px 0" }}>• {item}</p>)}
        </div>

        {primary.note && (
          <div style={{ background: "rgba(255,200,0,0.10)", border: "1px solid rgba(255,200,0,0.25)", borderRadius: 8, padding: "0.6rem 1rem", marginBottom: "1rem" }}>
            <p style={{ color: "#ffd580", fontSize: 12, margin: 0 }}>⚠️ {primary.note}</p>
          </div>
        )}

        <button onClick={() => onViewProgram(primary.id)} style={{
          background: primary.accent, color: "#fff", border: "none",
          padding: "10px 28px", borderRadius: 10, fontSize: 14, cursor: "pointer", fontWeight: 700,
          fontFamily: BASE_FONT, boxShadow: `0 4px 12px ${primary.accent}55`,
        }}>عرض تفاصيل البرنامج ←</button>
      </div>

      {secondary && (
        <div style={{
          background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 16, padding: "1.25rem", marginBottom: "1rem"
        }}>
          <p style={{ fontSize: 12, color: "#6a8aaa", marginBottom: "0.6rem", fontWeight: 600 }}>البديل الثاني</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 26 }}>{secondary.icon}</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontWeight: 600, color: "#c0d8ee", margin: 0, fontSize: 15 }}>{secondary.name}</p>
              <p style={{ color: "#6a8aaa", fontSize: 13, margin: 0 }}>{secondary.tagline} · {secondary.duration}</p>
            </div>
            <button onClick={() => onViewProgram(secondary.id)} style={{
              background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.15)",
              color: "#9ab5d0", padding: "7px 16px", borderRadius: 8, fontSize: 13, cursor: "pointer",
              fontFamily: BASE_FONT,
            }}>عرض ←</button>
          </div>
        </div>
      )}

      <button onClick={onReset} style={{
        width: "100%", padding: "12px", border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12, background: "rgba(255,255,255,0.05)", color: "#7a9ab8",
        fontSize: 14, cursor: "pointer", fontFamily: BASE_FONT,
      }}>↩ أعد الاختبار من البداية</button>
    </div>
  );
}

/* ──── PROGRAM CARD ──── */
function ProgramCard({ program, onBack }) {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
      <button onClick={onBack} style={{
        background: "none", border: "none", color: "#7a9ab8",
        fontSize: 14, cursor: "pointer", marginBottom: "1.5rem", padding: 0,
        fontFamily: BASE_FONT,
      }}>← رجوع</button>

      <div style={{
        background: `linear-gradient(135deg, ${program.color}dd 0%, ${program.color}aa 100%)`,
        border: `1.5px solid ${program.accent}55`,
        borderRadius: 20, padding: "1.5rem", marginBottom: "1.25rem",
        display: "flex", alignItems: "center", gap: 18,
        boxShadow: `0 6px 24px ${program.accent}22`,
      }}>
        <div style={{
          width: 64, height: 64, borderRadius: 16,
          background: "rgba(255,255,255,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 32, flexShrink: 0,
        }}>{program.icon}</div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>{program.name}</h1>
          <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0 }}>{program.tagline}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1.25rem" }}>
        {[
          { label: "المدة", value: program.duration, icon: "⏱" },
          { label: "نوع القبول", value: program.type, icon: "🎯" },
          { label: "التكلفة", value: program.cost, icon: "💰" },
          { label: "الفئة المستهدفة", value: program.audience, icon: "👤" },
          { label: "وسيلة الدراسة", value: program.medium, icon: "💻" },
        ].map((item, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.06)", borderRadius: 12, padding: "0.8rem 1rem",
            border: "1px solid rgba(255,255,255,0.10)",
          }}>
            <p style={{ fontSize: 11, color: "#6a8aaa", margin: "0 0 3px" }}>{item.icon} {item.label}</p>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#c8dff0", margin: 0 }}>{item.value}</p>
          </div>
        ))}
      </div>

      <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: "1.25rem", marginBottom: "1rem" }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, color: "#aac8e8", marginBottom: "0.75rem" }}>نبذة عن البرنامج</h3>
        <p style={{ color: "#c0d8ee", fontSize: 14, lineHeight: 1.9, margin: 0 }}>{program.description}</p>
      </div>

      {program.requirements.length > 0 && (
        <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 14, padding: "1.25rem", marginBottom: "1rem" }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "#aac8e8", marginBottom: "0.75rem" }}>📋 المتطلبات</h3>
          {program.requirements.map((req, i) => (
            <p key={i} style={{ color: "#c0d8ee", fontSize: 14, margin: "5px 0" }}>• {req}</p>
          ))}
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: "1rem" }}>
        <div style={{ background: "rgba(0,200,80,0.08)", border: "1px solid rgba(0,200,80,0.2)", borderRadius: 12, padding: "1rem" }}>
          <p style={{ fontWeight: 700, color: "#6de89a", fontSize: 13, marginBottom: "0.5rem" }}>✅ يناسبك إذا…</p>
          {program.suitableIf.map((item, i) => (
            <p key={i} style={{ color: "#a0e8be", fontSize: 13, margin: "4px 0" }}>• {item}</p>
          ))}
        </div>
        <div style={{ background: "rgba(220,50,50,0.08)", border: "1px solid rgba(220,50,50,0.2)", borderRadius: 12, padding: "1rem" }}>
          <p style={{ fontWeight: 700, color: "#f08080", fontSize: 13, marginBottom: "0.5rem" }}>❌ لا تسجل هنا إذا…</p>
          {program.notSuitableIf.map((item, i) => (
            <p key={i} style={{ color: "#f0a0a0", fontSize: 13, margin: "4px 0" }}>• {item}</p>
          ))}
        </div>
      </div>

      {program.note && (
        <div style={{ background: "rgba(255,200,0,0.08)", border: "1px solid rgba(255,200,0,0.2)", borderRadius: 10, padding: "0.9rem", marginBottom: "1rem" }}>
          <p style={{ color: "#ffd580", fontSize: 13, margin: 0 }}>⚠️ ملاحظة: {program.note}</p>
        </div>
      )}
    </div>
  );
}

/* ──── ALL PROGRAMS ──── */
function AllProgramsView({ onViewProgram, onBack }) {
  const categories = [
    { label: "برامج الكبار", ids: ["alim","bina_asasi","bina_muyassar","fikri","bard_yaqin","hadith","kharitat_thughur","khadija"] },
    { label: "أكاديمية الجيل الصاعد", ids: ["buthur","juthur","ghiras","ishraq","ithtmar"] },
  ];

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "2rem 1rem" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#7a9ab8", fontSize: 14, cursor: "pointer", marginBottom: "1rem", padding: 0, fontFamily: BASE_FONT }}>← رجوع للرئيسية</button>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#ddeeff", marginBottom: "1.5rem" }}>جميع البرامج والمسارات</h2>

      {categories.map(cat => (
        <div key={cat.label} style={{ marginBottom: "2rem" }}>
          <h3 style={{ fontSize: 13, fontWeight: 700, color: "#4a9fd4", borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "0.5rem", marginBottom: "0.75rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>{cat.label}</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {cat.ids.map(id => {
              const p = programs[id];
              return (
                <div key={id} style={{
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.10)",
                  borderRadius: 14, padding: "1rem 1.25rem",
                  display: "flex", alignItems: "center", gap: 14,
                  cursor: "pointer", transition: "background 0.2s",
                }} onClick={() => onViewProgram(id)}>
                  <span style={{ fontSize: 26, flexShrink: 0 }}>{p.icon}</span>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600, color: "#c8dff0", margin: 0, fontSize: 14 }}>{p.name}</p>
                    <p style={{ color: "#6a8aaa", fontSize: 12, margin: 0 }}>{p.tagline}</p>
                  </div>
                  <div style={{ flexShrink: 0 }}>
                    <span style={{
                      background: "rgba(255,255,255,0.08)", color: "#9ab5d0",
                      padding: "3px 10px", borderRadius: 99, fontSize: 11, fontWeight: 500
                    }}>{p.duration}</span>
                  </div>
                  <span style={{ color: "#4a6a88", fontSize: 16 }}>←</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ──── NAV BAR ──── */
function NavBar({ onBack, title }) {
  return (
    <div style={{
      background: "rgba(10,20,40,0.7)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
      padding: "0.9rem 1.5rem",
      display: "flex", alignItems: "center", gap: 14,
      position: "sticky", top: 0, zIndex: 10,
    }}>
      {onBack && (
        <button onClick={onBack} style={{ background: "none", border: "none", color: "#7a9ab8", fontSize: 14, cursor: "pointer", padding: 0, fontFamily: BASE_FONT }}>← رجوع</button>
      )}
      <span style={{ color: "#c8dff0", fontWeight: 700, fontSize: 15 }}>{title}</span>
    </div>
  );
}

/* ──── HOME ──── */
function HomeView({ onStartQuiz, onViewAll }) {
  const featuredPrograms = [
    programs.bina_asasi,
    programs.bina_muyassar,
    programs.fikri,
    programs.hadith,
    programs.bard_yaqin,
  ];

  return (
    <>
      {/* ─ Hero ─ */}
      <div style={styles.hero}>
        <div style={styles.heroOrb1} />
        <div style={styles.heroOrb2} />

        <div style={styles.badge}>برامج الشيخ أحمد بن يوسف السيد</div>
        <h1 style={styles.heroTitle}>اختر برنامجك المناسب</h1>
        <p style={styles.heroSub}>
          أكثر من 13 مسارًا تعليميًا — للناشئة والشباب والكبار
        </p>
        <hr style={styles.divider} />

        {/* Stats */}
        <div style={styles.statsRow}>
          {[
            { icon: "📚", text: "13 مسارًا ومنهجًا" },
            { icon: "🌱", text: "للأعمار 10–22 في الجيل الصاعد" },
            { icon: "🎓", text: "للكبار فوق 15 سنة" },
            { icon: "💰", text: "معظم البرامج مجانية" },
          ].map((s, i) => (
            <div key={i} style={styles.statPill}>
              <span>{s.icon}</span>
              <span>{s.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 640, margin: "0 auto", padding: "0 1rem 3rem" }}>

        {/* ─ Start quiz card ─ */}
        <div style={styles.primaryCard}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 16, marginBottom: "1.25rem" }}>
            <div style={{
              width: 52, height: 52, borderRadius: 14,
              background: "rgba(100,180,255,0.15)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26, flexShrink: 0
            }}>🎯</div>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 0.3rem" }}>اكتشف البرنامج الأنسب لك</h2>
              <p style={{ color: "#7a9ab8", fontSize: 14, lineHeight: 1.7, margin: 0 }}>
                أجب عن 5–7 أسئلة قصيرة وستحصل على توصية مفصّلة تناسب عمرك وهدفك والوقت المتاح لك.
              </p>
            </div>
          </div>
          <button onClick={onStartQuiz} style={styles.actionBtn}>
            ابدأ الاختبار ←
          </button>
        </div>

        {/* ─ Browse all ─ */}
        <button onClick={onViewAll} style={styles.secondaryBtn}>
          <span style={{ fontSize: 22 }}>📋</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, color: "#c8dff0", margin: 0, fontSize: 14 }}>تصفح جميع البرامج</p>
            <p style={{ color: "#5a7a96", fontSize: 12, margin: 0 }}>13 برنامجًا ومسارًا تعليميًا</p>
          </div>
          <span style={{ color: "#3a5a78", fontSize: 16 }}>←</span>
        </button>

        {/* ─ Featured programs ─ */}
        <p style={{ fontSize: 13, color: "#4a7a9a", fontWeight: 600, margin: "1.5rem 0 0.75rem", letterSpacing: "0.04em" }}>أبرز البرامج</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: "1.5rem" }}>
          {featuredPrograms.map(p => (
            <div key={p.id} style={{ ...styles.secondaryBtn, marginBottom: 0 }}>
              <span style={{ fontSize: 20 }}>{p.icon}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 600, color: "#b8d4ee", margin: 0, fontSize: 13 }}>{p.name}</p>
                <p style={{ color: "#4a6a88", fontSize: 12, margin: 0 }}>{p.tagline} · {p.duration}</p>
              </div>
              <span style={{
                background: "rgba(255,255,255,0.06)",
                color: "#5a8aaa", padding: "2px 10px",
                borderRadius: 99, fontSize: 11
              }}>مجاني</span>
            </div>
          ))}
        </div>

        {/* ─ Disclaimer ─ */}
        <div style={{
          background: "rgba(255,200,0,0.07)",
          border: "1px solid rgba(255,200,0,0.18)",
          borderRadius: 14, padding: "1rem 1.25rem",
        }}>
          <p style={{ color: "#c8a830", fontSize: 12, margin: 0, lineHeight: 1.8 }}>
            ⚠️ <strong>ملاحظة:</strong> بعض المعلومات قد تتغير بين الدورات. تحقق دائمًا من صفحة التسجيل الرسمية قبل إتمام التسجيل.
          </p>
        </div>
      </div>
    </>
  );
}

/* ──── APP ROOT ──── */
export default function App() {
  const [view, setView] = useState("home");
  const [answers, setAnswers] = useState({});
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [prevView, setPrevView] = useState("home");

  const handleViewProgram = (id) => {
    setSelectedProgram(id);
    setPrevView(view);
    setView("program");
  };

  if (view === "program" && selectedProgram) {
    return (
      <div style={styles.page}>
        <NavBar onBack={() => setView(prevView)} title={programs[selectedProgram].name} />
        <ProgramCard program={programs[selectedProgram]} onBack={() => setView(prevView)} />
      </div>
    );
  }

  if (view === "quiz") {
    return (
      <div style={styles.page}>
        <NavBar onBack={() => setView("home")} title="أداة اختيار البرنامج" />
        <QuizView onComplete={(ans) => { setAnswers(ans); setView("result"); }} />
      </div>
    );
  }

  if (view === "result") {
    return (
      <div style={styles.page}>
        <NavBar title="نتيجة الاختيار" />
        <ResultView answers={answers} onReset={() => setView("quiz")} onViewProgram={handleViewProgram} />
      </div>
    );
  }

  if (view === "all") {
    return (
      <div style={styles.page}>
        <NavBar onBack={() => setView("home")} title="جميع البرامج" />
        <AllProgramsView onViewProgram={handleViewProgram} onBack={() => setView("home")} />
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <HomeView
        onStartQuiz={() => setView("quiz")}
        onViewAll={() => { setPrevView("all"); setView("all"); }}
      />
    </div>
  );
}
