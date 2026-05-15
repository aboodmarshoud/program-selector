import { useMemo, useState } from "react";

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
    goals: [
      "بناء طالب علم صاحب نفس طويل وهمة رسالية.",
      "الجمع بين التأصيل العلمي، والتزكية، والفكر، والمهارات.",
      "تهيئة نخبة قادرة على العطاء والدعوة والإصلاح.",
    ],
    outcomes: [
      "تكوين علمي ممتد لا يقتصر على فن واحد.",
      "صبر دراسي وانضباط طويل المدى.",
      "رؤية رسالية للعلم والعمل.",
    ],
    suitable: [
      "حافظ للقرآن الكريم كاملًا أو قريب جدًا من شرط البرنامج عند الإعلان.",
      "مستعد لالتزام طويل جدًا لا يقتصر على سنة أو سنتين.",
      "يريد تكوينًا علميًا واسعًا لا مجرد دورة قصيرة أو تخصص جزئي.",
    ],
    caution: [
      "لا تجعله خيارًا لمجرد علو الاسم؛ هو مسار طويل جدًا وشروطه عالية.",
      "إن لم تكن قد أتممت حفظ القرآن أو لا تستطيع الالتزام الطويل، فابدأ بالبناء المنهجي أو الميسّر.",
      "راجع شروط الدفعة الأخيرة عند فتح التسجيل لأنها قد تتغير.",
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
    goals: [
      "تأسيس شرعي ومعرفي عام ومنظم.",
      "بناء قاعدة في أبواب العلم الأساسية والثقافة الإسلامية.",
      "تكوين طالب قادر على الانتقال لاحقًا إلى تخصصات أعمق.",
    ],
    outcomes: [
      "خطة دراسة واضحة وتدرج طويل.",
      "قدرة أفضل على فهم البرامج التخصصية اللاحقة.",
      "تمييز بين التأسيس العام والتخصص الجزئي.",
    ],
    suitable: [
      "تريد دراسة شرعية منهجية ومقررات مرتبة.",
      "تستطيع الالتزام اليومي المتوسط لفترة طويلة.",
      "تبحث عن الأساس الشرعي قبل التخصص أو العمل الإصلاحي.",
    ],
    caution: [
      "لا تختر المسار الأساسي إن كان وقتك اليومي محدودًا جدًا؛ الميسّر قد يكون أرفق.",
      "ليس بديلًا عن المحضن التربوي لمن احتياجه الأول صحبة ومتابعة وأجواء شبابية.",
      "إذا كنت طالبًا متعثرًا فيه أصلًا، فغالبًا تحتاج خطة تعويض لا تسجيلًا جديدًا.",
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
    goals: [
      "فتح باب التأسيس لمن يخشى طول المسار الأساسي.",
      "مساعدة المشغول أو المتردد على بداية مضبوطة.",
      "تقديم نسخة أخف من البناء العام دون ضغط شديد.",
    ],
    outcomes: [
      "دخول منظم في بيئة البناء المنهجي.",
      "تقليل احتمال الانقطاع بسبب ثقل الالتزام.",
      "تهيئة محتملة للمسار الأساسي لاحقًا.",
    ],
    suitable: [
      "تحتاج بداية مضبوطة دون ضغط كبير.",
      "وقتك اليومي محدود، لكنك تريد الدخول في مسار علمي منظم.",
      "تريد اختبار قدرتك على الاستمرار قبل المسارات الأطول.",
    ],
    caution: [
      "لا تختره فقط لأنه أسهل إن كنت قادرًا على المسار الأساسي وتريد البناء الأكمل.",
      "هو بداية ميسرة لا بديل كامل عن كل ما في المسار الأساسي.",
      "إن كان احتياجك الأول بيئة تربوية وصحبة فقد يكون إشراق أو مدرسة خديجة أقرب بحسب حالتك.",
    ],
  },
  fikri: {
    id: "fikri",
    name: "البناء الفكري",
    badge: "وعي فكري موسع",
    icon: "🧠",
    duration: "نحو 3 سنوات",
    audience: "فوق 15 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "بحسب إعلان الدفعة",
    color: "#5a2d82",
    soft: "#f2eafa",
    description:
      "برنامج يعالج البناء الفكري الإسلامي، وفهم التيارات والشبهات ومركزية الوحي، وهو أوسع من المعالجات القصيرة أو الوجدانية فقط.",
    goals: [
      "تعزيز الهوية الإسلامية ومركزية الوحي.",
      "تكوين قدرة نقدية تجاه التيارات المعاصرة.",
      "توسيع الفهم الفكري بدل الاكتفاء بإجابات قصيرة.",
    ],
    outcomes: [
      "فهم أفضل لخريطة الأفكار والشبهات.",
      "قدرة على التفريق بين السؤال الفكري والاضطراب الإيماني.",
      "بناء منهجية في القراءة والتحليل.",
    ],
    suitable: [
      "تريد فهم الأفكار والتيارات ونقدها بعمق.",
      "تتعامل مع الشبهات باعتبارها أسئلة فكرية تحتاج تحليلًا.",
      "لديك قابلية لمسار أطول من برنامج يقيني تزكوي قصير نسبيًا.",
    ],
    caution: [
      "إن كانت الشبهات تؤثر على السكينة والعبادة فقد يكون برد اليقين أسبق.",
      "لا تجعله بديلًا عن أصل التأسيس الشرعي إن كنت بلا قاعدة علمية كافية.",
      "ليس الأنسب لمن يريد بيئة تربوية شبابية أو محضنًا نسائيًا بالدرجة الأولى.",
    ],
  },
  bard_yaqin: {
    id: "bard_yaqin",
    name: "برد اليقين",
    badge: "يقين وتزكية",
    icon: "💧",
    duration: "سنة وثمانية أشهر تقريبًا",
    audience: "فوق 15 سنة غالبًا",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "بحسب إعلان البرنامج",
    color: "#0f6b78",
    soft: "#e7f6f8",
    description:
      "مسار معرفي تزكوي يعالج اليقين والثوابت مع عناية بالجانب الإيماني والسلوكي، وهو أقرب لمن يحتاج ترميم السكينة قبل التوسع الفكري.",
    goals: [
      "تثبيت اليقين والثوابت.",
      "العناية بالقلب والسلوك والتزكية.",
      "تقديم معالجة أقرب لمن تؤثر عليه الشبهات وجدانيًا.",
    ],
    outcomes: [
      "طمأنينة أكبر أمام القلق والشبهات.",
      "تمييز بين الحاجة للعلاج الإيماني والحاجة للجدل الفكري.",
      "مسار متوسط لا يطول كالبناء الفكري.",
    ],
    suitable: [
      "تحتاج يقينًا وسكينة أكثر من الجدل والتحليل.",
      "الشبهات تؤثر على عبادتك أو طمأنينتك.",
      "تريد مسارًا يجمع المعرفة والتزكية.",
    ],
    caution: [
      "إن كان احتياجك تحليل التيارات والأفكار بتوسع فالبناء الفكري أقرب.",
      "ليس تخصصًا حديثيًا ولا بديلًا عن التأسيس الشرعي العام.",
      "لا تستخدمه هروبًا من برنامج مناسب أنت متعثر فيه؛ عالج التعثر أولًا.",
    ],
  },
  hadith: {
    id: "hadith",
    name: "أكاديمية الحديث الإلكترونية",
    badge: "تخصص حديثي",
    icon: "📜",
    duration: "قرابة سنتين ونصف",
    audience: "المهتمون بعلوم الحديث والسنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "بحسب إعلان الأكاديمية",
    color: "#5a6f2a",
    soft: "#eef5e2",
    description:
      "مسار متخصص في علوم الحديث والسنة، مناسب لمن يريد بابًا علميًا محددًا لا مجرد تأسيس عام في العلوم الشرعية.",
    goals: [
      "التدرج في علوم الحديث رواية ودراية.",
      "بناء معرفة بمباحث السنة ومناهج التعامل معها.",
      "تهيئة الطالب لتخصص حديثي أو بحثي أو تطبيقي.",
    ],
    outcomes: [
      "تصور أوضح لعلوم الحديث ومراحله.",
      "تمييز بين التأسيس الشرعي العام والتخصص الحديثي.",
      "قدرة أفضل على خدمة السنة بحسب المرحلة.",
    ],
    suitable: [
      "تميل بوضوح إلى علوم الحديث والسنة.",
      "تريد تخصصًا لا مجرد برنامج عام.",
      "لديك قابلية للمصطلحات العلمية والتدرج الفني.",
    ],
    caution: [
      "إن كنت بلا تأسيس شرعي عام فقد تحتاج البناء المنهجي قبلها أو معها.",
      "لا تختَرها لمجرد حب الحديث إن كان احتياجك الأقرب تزكويًا أو فكريًا عامًا.",
      "إن تخرجت منها سابقًا فلا معنى غالبًا لإعادة ترشيحها، بل ابحث عن خطوة تالية.",
    ],
  },
  kharitat_thughur: {
    id: "kharitat_thughur",
    name: "خارطة الثغور",
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
    color: "#437047",
    soft: "#edf6ee",
    description:
      "دورة تبصيرية تساعد طالب البرامج والمصلح على فهم ثغور الأمة وموقعه منها، وتُختم بمشروع عملي يخدم به واقعه.",
    goals: [
      "معرفة ثغور الأمة والحاجة إليها.",
      "تحديد الثغر الشخصي وموقعه من بقية الثغور.",
      "تحويل التعلم إلى مشروع عملي في الواقع.",
    ],
    outcomes: [
      "خريطة أوضح للعمل الإصلاحي.",
      "مشروع عملي ختامي.",
      "تمييز بين البناء النظري والعمل الواقعي.",
    ],
    suitable: [
      "تريد الانتقال من مجرد الدراسة إلى سؤال العمل والمشروع.",
      "مستعد لدراسة المواد القبلية المطلوبة.",
      "لديك أصل من البناء وتريد توجيهه في الواقع.",
    ],
    caution: [
      "لا تجعلها بديلًا عن أصل البناء الشرعي أو الإيماني.",
      "إن لم تدرس المواد القبلية فتهيأ لها قبل التسجيل.",
      "ليست دورة معلومات فقط؛ يُنتظر منك مشروع عملي.",
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
    selectivity: "غالبًا مفتوح",
    color: "#638b2f",
    soft: "#f1f7e8",
    description:
      "مدخل تربوي مبكر لغرس الإيمان والقيم ومحاسن الأخلاق بأسلوب يناسب سن الطفل.",
    goals: ["غرس الإيمان والقيم.", "تعليم أساسيات الدين بصورة مناسبة.", "بناء بدايات أخلاقية ومهارية."],
    outcomes: ["محبة الدين.", "بدايات خلقية وسلوكية.", "ارتباط مبكر ببيئة نافعة."],
    suitable: ["العمر بين 10 و12 سنة.", "الهدف غرس القيم لا الدراسة الثقيلة.", "تبحث عن بداية آمنة ومناسبة للطفل."],
    caution: ["لا تناسب من تجاوز عمره هذه المرحلة.", "لا تتوقع منها تكوينًا علميًا للكبار.", "لا تقارنها بالبناء المنهجي؛ طبيعتها تربوية عمرية."],
  },
  juthur: {
    id: "juthur",
    name: "أكاديمية الجيل الصاعد - جذور",
    badge: "مسار خاص لليافعين",
    icon: "🌿",
    duration: "سنتان",
    audience: "13–16 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "اختبار قبول ومتابعة خاصة",
    color: "#2f7a4f",
    soft: "#e9f6ef",
    description:
      "مسار خاص للجيل الصاعد في عمر 13–16، يجمع البناء الإيماني والمعرفي والتربوي مع متابعة أقرب.",
    goals: ["بناء إيماني ومعرفي في مرحلة اليافعين.", "توفير متابعة تربوية أقرب.", "تهيئة الطالب للثبات والوعي."],
    outcomes: ["صحبة ومتابعة.", "انضباط تربوي.", "تدرج مناسب للمرحلة العمرية."],
    suitable: ["العمر 13–16.", "تقبل اختبارًا ومتابعة خاصة.", "الطالب جاد ويحتاج بيئة تربوية أقرب."],
    caution: ["إن كنت لا تريد اختبارًا أو متابعة خاصة فقد يكون غراس أيسر.", "لا يناسب من تجاوز المرحلة العمرية غالبًا.", "إن تخرجت منه فلا تكرره؛ قد يكون إثمار لاحقًا بحسب الشروط."],
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
    selectivity: "غالبًا أيسر من جذور",
    color: "#3d8a3a",
    soft: "#ecf8ec",
    description:
      "مسار عام للفئة 13–16، يراعي البناء الشمولي والبيئة الآمنة دون اشتراطات المسار الخاص نفسها.",
    goals: ["توفير بيئة تربوية عامة.", "بناء الوعي والإيمان بصورة مناسبة.", "تخفيف عائق الانتقائية لمن يحتاج بداية أيسر."],
    outcomes: ["ارتباط ببيئة نافعة.", "أنشطة ومتابعة عامة.", "بناء مناسب للمراهقة المبكرة."],
    suitable: ["العمر 13–16.", "تريد بيئة عامة أيسر.", "لا تريد اختبارًا أو انتقائية عالية."],
    caution: ["إن كان الطالب مميزًا ويحتاج متابعة أقرب فجذور قد يكون أنسب.", "لا يناسب من يريد مسارًا شرعيًا للكبار.", "لا تجعله بديلًا عن جذور إذا كان الطالب مستعدًا للمسار الخاص."],
  },
  ishraq: {
    id: "ishraq",
    name: "أكاديمية الجيل الصاعد - إشراق",
    badge: "بيئة شبابية واعية",
    icon: "☀️",
    duration: "سنتان",
    audience: "17–20 سنة",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "اختبار قبول",
    color: "#8b5a20",
    soft: "#fff3df",
    description:
      "مسار شبابي تربوي ومعرفي للمرحلة 17–20، يركز على البيئة والتحصين والصحبة ومهارات التعامل مع الواقع.",
    goals: ["تحصين الشباب في مرحلة الجامعة وبدايات النضج.", "الجمع بين الإيمان والوعي والمهارات.", "توفير بيئة صحبة ومتابعة."],
    outcomes: ["ثبات أكبر في مرحلة حساسة.", "وعي بالواقع والشبهات والشهوات.", "ارتباط ببيئة شبابية صالحة."],
    suitable: ["العمر 17–20.", "تحتاج أجواء تربوية وصحبة لا مجرد مقررات.", "تقبل اختبار قبول ومتابعة."],
    caution: ["لا تختره فقط لأن عمرك فوق 15؛ إذا أردت مقررات شرعية فالبناء المنهجي أقرب.", "إذا تخرجت منه فلا يُعاد اقتراحه غالبًا؛ إثمار قد يكون المرحلة الأعلى.", "إذا كنت في إشراق ومتعثرًا، فالغالب أنك تحتاج خطة استدراك لا برنامجًا جديدًا."],
  },
  ithmar: {
    id: "ithmar",
    name: "أكاديمية الجيل الصاعد - إثمار",
    badge: "تخصص دقيق للنخبة",
    icon: "🌟",
    duration: "4 سنوات",
    audience: "15–22 سنة من خريجي جذور أو إشراق",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "لخريجي جذور وإشراق حصرًا",
    color: "#8a6828",
    soft: "#fff7e5",
    description:
      "درة التاج في أكاديمية الجيل الصاعد، لا يستقبل المبتدئين، بل نخبة المميزين من خريجي جذور وإشراق للانتقال إلى التخصص الدقيق.",
    goals: ["الانتقال من البناء العام إلى التخصص الدقيق.", "مساعدة الطالب في اختيار تخصص يناسب ميوله وقدراته.", "تقديم إشراف علمي ومهاري وتزكوي عالٍ."],
    outcomes: ["تخصص علمي أو فكري ضمن مسارات متنوعة.", "نضج منهجي ومهاري.", "استمرار البناء التزكوي والإيماني."],
    suitable: ["تخرجت من جذور أو إشراق أو أنت على وشك التخرج منهما.", "عمرك بين 15 و22 سنة.", "تريد التخصص لا مجرد البناء العام."],
    caution: ["لا يناسب المبتدئ أبدًا.", "لا يظهر كخيار صحيح إلا لمن أتم جذور أو إشراق أو أوشك على التخرج.", "إن كان احتياجك محضنًا نسائيًا أو تأسيسًا شرعيًا عامًا فقد تكون مدرسة خديجة أو البناء المنهجي أقرب."],
  },
  khadija: {
    id: "khadija",
    name: "مدرسة خديجة",
    badge: "محضن نسائي تفاعلي",
    icon: "🧕",
    duration: "نحو سنة",
    audience: "النساء 16 سنة فأكثر",
    cost: "مجاني",
    medium: "موقع البرنامج + تلجرام",
    officialUrl: "",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "عدد محدود وتفاعل مباشر",
    color: "#9b3d64",
    soft: "#fdebf2",
    description:
      "بيئة نسائية تفاعلية تجمع البناء الإيماني والتربوي والعلمي واللقاءات، وهي أنسب لمن تحتاج محضنًا نسائيًا لا دراسة إلكترونية صامتة فقط.",
    goals: ["بناء المرأة إيمانيًا وتربويًا وعلميًا.", "توفير محضن نسائي آمن وتفاعلي.", "إحياء معنى الصحبة واللقاءات لا مجرد متابعة مواد."],
    outcomes: ["صحبة نسائية ومعايشة تربوية.", "بناء إيماني وعلمي متوازن.", "اندماج في بيئة تفاعلية لا دراسة فردية فقط."],
    suitable: ["أنتِ امرأة فوق 16 سنة.", "تحتاجين بيئة نسائية ولقاءات ومتابعة.", "لا تريدين مجرد مقررات إلكترونية منفردة."],
    caution: ["لا تظهر لغير النساء ولا لمن لا يريد تفاعلًا أو لقاءات.", "إذا كان هدفك مقررات شرعية منظمة بالدرجة الأولى، فالبناء المنهجي قد يكون أقرب مع بقاء خديجة خيارًا تربويًا.", "إذا كنتِ طالبة متعثرة في برنامج مناسب، فلا تجعلي مدرسة خديجة هروبًا من الاستدراك إلا إذا تغيّرت حاجتك فعلًا."],
  },
};

function option(value, title, sub = "", icon = "") {
  return { value, title, sub, icon };
}

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function hasChoice(value, choice) {
  return asArray(value).includes(choice);
}

function choiceRank(value, choice) {
  return asArray(value).indexOf(choice);
}

function rankWeight(value, choice) {
  const rank = choiceRank(value, choice);
  if (rank < 0) return 0;
  return [1, 0.74, 0.55, 0.4, 0.3, 0.22][rank] ?? 0.18;
}

function hasAnswer(value) {
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

function isAgeAtLeast15(a) {
  return ["15_16", "17_20", "21_22", "23_plus"].includes(a.age);
}

function isYouthAcademyAge(a) {
  return ["10_12", "13_14", "15_16", "17_20"].includes(a.age);
}

function isCurrentStatus(a) {
  return a.programStatus === "studying_committed" || a.programStatus === "studying_struggling";
}

function isGraduatedStatus(a) {
  return a.programStatus === "graduated_or_near";
}

function knownPrograms(a) {
  return asArray(a.knownPrograms);
}

function hasKnown(a, id) {
  return knownPrograms(a).includes(id);
}

function completedJuthurOrIshraq(a) {
  return isGraduatedStatus(a) && (hasKnown(a, "juthur") || hasKnown(a, "ishraq"));
}

function questionTitle(q, answers) {
  return typeof q.title === "function" ? q.title(answers) : q.title;
}

function questionSubtitle(q, answers) {
  return typeof q.subtitle === "function" ? q.subtitle(answers) : q.subtitle;
}

const PROGRAM_OPTIONS = [
  option("bina_asasi", "البناء المنهجي - المسار الأساسي", "", "📚"),
  option("bina_muyassar", "البناء المنهجي - المسار الميسّر", "", "🔖"),
  option("fikri", "البناء الفكري", "", "🧠"),
  option("bard_yaqin", "برد اليقين", "", "💧"),
  option("hadith", "أكاديمية الحديث الإلكترونية", "", "📜"),
  option("buthur", "أكاديمية الجيل الصاعد - بذور", "", "🌱"),
  option("juthur", "أكاديمية الجيل الصاعد - جذور", "", "🌿"),
  option("ghiras", "أكاديمية الجيل الصاعد - غراس", "", "🌳"),
  option("ishraq", "أكاديمية الجيل الصاعد - إشراق", "", "☀️"),
  option("ithmar", "أكاديمية الجيل الصاعد - إثمار", "", "🌟"),
  option("khadija", "مدرسة خديجة", "", "🧕"),
  option("kharitat_thughur", "خارطة الثغور", "", "🗺️"),
  option("alim", "برنامج عالِم", "", "🕌"),
];

const QUESTIONS = [
  {
    id: "forWhom",
    title: "لمن تبحث عن البرنامج؟",
    subtitle: "نحتاجها فقط لصياغة الأسئلة بصورة ألطف.",
    options: () => [
      option("self", "لي أنا", "أبحث عن البرنامج الأنسب لي شخصيًا", "👤"),
      option("child", "لابني أو ابنتي", "أريد ترشيحًا يناسب العمر والمرحلة", "👥"),
      option("friend", "لصديق أو لصديقة", "أريد مساعدة شخص آخر على الاختيار", "🤝"),
    ],
  },
  {
    id: "gender",
    title: "ما الجنس؟",
    subtitle: "حتى لا تظهر خيارات خاصة لا تناسب المستفيد.",
    options: () => [option("male", "ذكر", "", "👤"), option("female", "أنثى", "", "🧕")],
  },
  {
    id: "age",
    title: "ما عمر الشخص المستفيد؟",
    subtitle: "العمر يساعدنا على التفريق بين مسارات الجيل الصاعد وبرامج الكبار.",
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
    id: "programStatus",
    title: "هل أنت طالب بالبرامج الإلكترونية؟",
    subtitle: "هذا السؤال مهم حتى لا نقترح برنامجًا جديدًا لشخص الأولى به أن يثبت أو يستدرك في برنامجه الحالي.",
    condition: (a) => a.age && a.age !== "10_12",
    options: () => [
      option("studying_committed", "نعم، طالب مستمر في الدراسة", "ما زلت أدرس وأحاول الالتزام", "✅"),
      option("studying_struggling", "نعم، طالب متعثر أو قصّرت سابقًا", "دخلت برنامجًا لكن حصل فتور أو تراكم", "🧩"),
      option("graduated_or_near", "تخرجت من برنامج أو عدة برامج، أو على وشك التخرج", "أريد أن أبني على ما درست لا أن أكرر نفس الطريق", "🎓"),
      option("withdrew", "انسحبت من برنامج سابق", "خضت تجربة ثم توقفت أو خرجت منها", "↩️"),
      option("never_joined", "لم أدخل البرامج الإلكترونية من قبل", "هذه أول تجربة جادة أو لا توجد تجربة مؤثرة", "🌱"),
    ],
  },
  {
    id: "knownPrograms",
    title: (a) => {
      if (a.programStatus === "studying_committed") return "ما البرنامج أو البرامج التي تدرسها الآن؟";
      if (a.programStatus === "studying_struggling") return "ما البرنامج أو البرامج التي تعثرت فيها أو قصّرت؟";
      if (a.programStatus === "graduated_or_near") return "ما البرنامج أو البرامج التي تخرجت منها أو أوشكت على التخرج منها؟";
      if (a.programStatus === "withdrew") return "ما البرنامج أو البرامج التي انسحبت منها؟";
      return "ما البرامج السابقة؟";
    },
    subtitle: "يمكن اختيار أكثر من برنامج.",
    multi: true,
    condition: (a) => a.programStatus && a.programStatus !== "never_joined",
    options: () => PROGRAM_OPTIONS,
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
    subtitle: "يمكن اختيار أكثر من إجابة؛ اختر أولًا الأهم، ثم ما يليه.",
    multi: true,
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
    subtitle: "رتّب أكثر من خيار إن كان أكثر من شكل يساعدك.",
    multi: true,
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
    id: "prioritySignal",
    title: "إذا تزاحمت أكثر من حاجة، فما الذي لا تريد التفريط به الآن؟",
    subtitle: "هذا السؤال يساعد عند ظهور أكثر من برنامج مناسب لنفس العمر.",
    condition: (a) => isAgeAtLeast15(a),
    options: (a) => {
      const base = [
        option("curriculum_priority", "خطة علمية واضحة ومقررات", "أريد أن يكون الأصل دراسة مرتبة وتدرجًا علميًا", "📚"),
        option("environment_priority", "بيئة وصحبة ومتابعة", "أحتاج من يعينني على الثبات والالتزام", "🤝"),
        option("gentle_priority", "بداية أخف تناسب الانشغال", "أهم شيء أن أبدأ بما أستطيع إكماله", "🌤️"),
        option("depth_priority", "عمق أو تخصص لاحق", "أميل لمسار ينتقل بي من العموم إلى التخصص", "🎯"),
      ];
      if (a.gender === "female") {
        base.splice(2, 0, option("women_priority", "خصوصية بيئة نسائية", "أحتاج محضنًا نسائيًا آمنًا وتفاعليًا", "🧕"));
      }
      return base;
    },
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
    id: "specializationFocus",
    title: "إن كنت تميل للتخصص أو العمق، فأي اتجاه أقرب؟",
    subtitle: "اختر المجال الأقرب لميولك الفعلية.",
    condition: (a) => isAgeAtLeast15(a) && (hasChoice(a.needPattern, "specialized_track") || a.prioritySignal === "depth_priority"),
    options: (a) => {
      const base = [
        option("hadith", "علوم الحديث والسنة", "أميل إلى الرواية والدراية وخدمة السنة", "📜"),
        option("long_formation", "تكوين علمي طويل جدًا", "أفكر في مسار ممتد وعميق لا مجرد دورة", "🕌"),
        option("not_sure", "لم يتضح التخصص بعد", "أحتاج تأسيسًا يساعدني على الاختيار لاحقًا", "🧭"),
      ];
      if (completedJuthurOrIshraq(a)) {
        base.splice(1, 0, option("academy_specialization", "تخصص دقيق بعد تجربة أكاديمية سابقة", "تخرجت من جذور أو إشراق وأبحث عن المرحلة الأعلى", "🌟"));
      }
      return base;
    },
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
    condition: (a) => isAgeAtLeast15(a) && (hasChoice(a.needPattern, "reform_project") || hasChoice(a.learningShape, "practice")),
    options: () => [
      option("not_now", "ليس هذا احتياجي الآن", "أحتاج بناءً قبل المشروع", "🧱"),
      option("interested", "مهتم ولم أدرس المواد القبلية بعد", "أحتاج أن أتهيأ أولًا", "🧭"),
      option("ready", "درست أو سأدرس المواد القبلية", "مركزيات الإصلاح، شرح المنهاج، بوصلة المصلح", "🗺️"),
    ],
  },
];

function cleanAnswers(answers) {
  const next = { ...answers };
  if (next.gender !== "female" && hasChoice(next.needPattern, "women_space")) {
    next.needPattern = asArray(next.needPattern).filter((value) => value !== "women_space");
  }
  if (next.gender !== "female" && next.prioritySignal === "women_priority") delete next.prioritySignal;
  if (next.programStatus === "never_joined" || !next.programStatus) delete next.knownPrograms;
  if (!isAgeAtLeast15(next)) {
    delete next.quranLevel;
    delete next.doubtImpact;
    delete next.prioritySignal;
    delete next.specializationFocus;
    delete next.reformReadiness;
  }
  if (!(isAgeAtLeast15(next) && (hasChoice(next.needPattern, "specialized_track") || next.prioritySignal === "depth_priority"))) {
    delete next.specializationFocus;
  }
  if (!(isAgeAtLeast15(next) && (hasChoice(next.needPattern, "reform_project") || hasChoice(next.learningShape, "practice")))) {
    delete next.reformReadiness;
  }
  return next;
}

function isEligible(programId, a) {
  if (!a.age) return true;

  // إذا كان الطالب حاليًا في برنامج، نبقيه قابلًا للظهور في التحليل حتى نعرف هل ننصحه بالاستمرار أو الاستدراك.
  if (isCurrentStatus(a) && hasKnown(a, programId)) return true;

  const age = a.age;
  const adult = isAgeAtLeast15(a);
  switch (programId) {
    case "buthur":
      return age === "10_12";
    case "juthur":
      return (age === "13_14" || age === "15_16") && !isGraduatedStatus(a);
    case "ghiras":
      return (age === "13_14" || age === "15_16") && !isGraduatedStatus(a);
    case "ishraq":
      return age === "17_20" && !completedJuthurOrIshraq(a) && !hasKnown(a, "ishraq");
    case "ithmar":
      return ["15_16", "17_20", "21_22"].includes(age) && completedJuthurOrIshraq(a);
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

function addRankedScore(scores, fieldValue, choice, id, points, reason) {
  const weight = rankWeight(fieldValue, choice);
  if (!weight) return;
  const rank = choiceRank(fieldValue, choice);
  const suffix = rank > 0 ? ` — أولوية رقم ${rank + 1}` : "";
  addScore(scores, id, Math.round(points * weight), `${reason}${suffix}`);
}

function isRecommendable(scores, id) {
  return Boolean(scores[id]) && scores[id].score > -900;
}

function highestScore(scores, exceptId = null) {
  return Object.values(scores)
    .filter((item) => item.id !== exceptId && item.score > -900)
    .reduce((max, item) => Math.max(max, item.score), 0);
}

function ensurePriority(scores, id, reason, margin = 28) {
  if (!isRecommendable(scores, id)) return;
  const target = highestScore(scores, id) + margin;
  if (scores[id].score < target) scores[id].score = target;
  if (reason && !scores[id].reasons.includes(reason)) scores[id].reasons.unshift(reason);
}

function softenScores(scores, ids, amount) {
  ids.forEach((id) => {
    if (isRecommendable(scores, id)) scores[id].score -= amount;
  });
}

function chooseBinaTrack(a) {
  if (["15", "30"].includes(a.dailyTime) || hasChoice(a.learningShape, "gentle_start") || a.prioritySignal === "gentle_priority") {
    return "bina_muyassar";
  }
  return "bina_asasi";
}

function chooseAcademyTrack(a) {
  if (a.age === "10_12") return "buthur";
  if (a.age === "13_14" || a.age === "15_16") {
    return a.selectivity === "ok_test" || a.selectivity === "high_selective" ? "juthur" : "ghiras";
  }
  if (a.age === "17_20" && !completedJuthurOrIshraq(a) && !hasKnown(a, "ishraq")) return "ishraq";
  return null;
}

function applyStudentHistoryLogic(scores, a) {
  const known = knownPrograms(a);
  if (!known.length) return;

  if (a.programStatus === "studying_committed") {
    known.forEach((id) => addScore(scores, id, 30, "أنت مستمر في هذا البرنامج، والأصل عدم فتح مسار جديد إن كان قريبًا من احتياجك"));
  }

  if (a.programStatus === "studying_struggling") {
    known.forEach((id) => addScore(scores, id, 22, "يوجد تعثر في هذا البرنامج؛ قد تكون الحاجة إلى استدراك لا إلى بداية جديدة"));
    Object.keys(scores).forEach((id) => {
      if (!known.includes(id) && isRecommendable(scores, id)) scores[id].score -= 8;
    });
  }

  if (a.programStatus === "graduated_or_near") {
    known.forEach((id) => {
      if (scores[id]) scores[id].score -= 85;
    });

    if (known.includes("bina_asasi")) {
      addScore(scores, "fikri", 20, "بعد البناء المنهجي قد يكون البناء الفكري خطوة لاحقة");
      addScore(scores, "hadith", 14, "بعد التأسيس العام يمكن الانتقال لتخصص حديثي");
      addScore(scores, "kharitat_thughur", 22, "بعد البناء قد تظهر حاجة العمل الإصلاحي والثغر");
      addScore(scores, "bard_yaqin", 8, "قد تحتاج مسارًا يقينيًا تزكويًا متممًا");
    }
    if (known.includes("bina_muyassar")) addScore(scores, "bina_asasi", 28, "بعد الميسّر قد يكون المسار الأساسي خطوة لاحقة لمن استطاع");
    if (known.includes("fikri")) {
      addScore(scores, "kharitat_thughur", 20, "بعد البناء الفكري قد يظهر سؤال العمل والثغر");
      addScore(scores, "bina_asasi", 10, "قد تحتاج تأصيلًا شرعيًا أوسع إن لم يكن موجودًا");
      addScore(scores, "hadith", 8, "يمكن فتح تخصص علمي لاحق");
    }
    if (known.includes("bard_yaqin")) {
      addScore(scores, "fikri", 18, "بعد تثبيت اليقين قد يناسبك تعميق المعالجة الفكرية");
      addScore(scores, "bina_asasi", 14, "يمكن الانتقال إلى تأسيس شرعي أشمل");
    }
    if (known.includes("juthur") || known.includes("ishraq")) {
      addScore(scores, "ithmar", 72, "تخرجك من جذور أو إشراق يفتح احتمال إثمار");
      ["juthur", "ghiras", "ishraq"].forEach((id) => {
        if (scores[id]) scores[id].score = -999;
      });
    }
    if (known.includes("hadith")) {
      addScore(scores, "bina_asasi", 12, "بعد أكاديمية الحديث قد تحتاج تأسيسًا عامًا إن لم يكن موجودًا");
      addScore(scores, "fikri", 10, "قد يناسبك تعميق فكري لاحق");
      addScore(scores, "kharitat_thughur", 10, "يمكن الانتقال لسؤال العمل الإصلاحي");
    }
    if (known.includes("khadija")) {
      addScore(scores, "bina_asasi", 14, "بعد مدرسة خديجة قد يكون التأسيس الشرعي المنهجي خطوة مناسبة");
      addScore(scores, "fikri", 10, "قد يناسبك تعميق فكري لاحق");
      addScore(scores, "kharitat_thughur", 12, "قد يظهر سؤال العمل والثغر بعد المحضن التربوي");
    }
    if (known.includes("kharitat_thughur") && scores.kharitat_thughur) scores.kharitat_thughur.score -= 80;
  }

  if (a.programStatus === "withdrew") {
    known.forEach((id) => {
      if (scores[id]) scores[id].score -= 18;
    });
    addScore(scores, "bina_muyassar", 8, "بعد تجربة انسحاب قد تكون البداية الأخف أرفق إن كان الهدف تأسيسًا عامًا");
  }
}

function applyDecisionRules(scores, a) {
  const femaleAdult = a.gender === "female" && isAgeAtLeast15(a);
  const primaryNeed = asArray(a.needPattern)[0];
  const primaryLearning = asArray(a.learningShape)[0];

  const wantsWomenSpace = femaleAdult && (primaryNeed === "women_space" || a.prioritySignal === "women_priority");
  const wantsCurriculum = primaryNeed === "structured_path" || primaryLearning === "curriculum" || a.prioritySignal === "curriculum_priority";
  const wantsEnvironment = primaryNeed === "relational_growth" || primaryLearning === "community" || a.prioritySignal === "environment_priority";
  const wantsGentle = primaryLearning === "gentle_start" || a.prioritySignal === "gentle_priority" || ["15", "30"].includes(a.dailyTime);
  const wantsSpecialization = primaryNeed === "specialized_track" || a.prioritySignal === "depth_priority" || Boolean(a.specializationFocus);
  const wantsReform = primaryNeed === "reform_project" || primaryLearning === "practice";
  const highDoubt = a.doubtImpact === "high" || primaryNeed === "certainty";
  const theoreticalDoubt = a.doubtImpact === "theoretical" || primaryNeed === "intellectual_depth";

  if (wantsWomenSpace) {
    ensurePriority(scores, "khadija", "لأن الاحتياج الأهم هو محضن نسائي تفاعلي", 55);
    if (completedJuthurOrIshraq(a)) addScore(scores, "ithmar", 34, "إثمار بديل متقدم بسبب التخرج من جذور أو إشراق");
    if (wantsCurriculum) addScore(scores, chooseBinaTrack(a), 20, "توجد أيضًا حاجة إلى خطة علمية مرتبة");
    softenScores(scores, ["ishraq", "bina_asasi", "bina_muyassar"], 12);
    return;
  }

  if (highDoubt) {
    ensurePriority(scores, "bard_yaqin", "لأن الحاجة الأقرب هي اليقين والتزكية والسكينة", 42);
    softenScores(scores, ["fikri", "bina_asasi", "bina_muyassar", "ishraq"], 8);
    return;
  }

  if (wantsReform && a.reformReadiness !== "not_now") {
    ensurePriority(scores, "kharitat_thughur", "لأن احتياجك انتقل من مجرد الدراسة إلى معرفة الثغر والعمل الإصلاحي", 38);
    addScore(scores, "bina_asasi", 14, "البناء الشرعي يبقى أساسًا مساعدًا قبل العمل");
    return;
  }

  if (theoreticalDoubt && a.doubtImpact !== "high") {
    ensurePriority(scores, "fikri", "لأن احتياجك الأقرب هو الفهم الفكري والتحليل", 36);
    return;
  }

  if (wantsSpecialization) {
    if (a.specializationFocus === "hadith") {
      ensurePriority(scores, "hadith", "لأن التخصص الأقرب هو علوم الحديث والسنة", 44);
      addScore(scores, chooseBinaTrack(a), 12, "التأسيس العام قد يكون معينًا قبل التخصص أو معه");
      return;
    }
    if (a.specializationFocus === "long_formation" && a.quranLevel === "full") {
      ensurePriority(scores, "alim", "لأنك تميل إلى تكوين علمي طويل ومعك شرط قرآني داعم", 46);
      return;
    }
    if (completedJuthurOrIshraq(a) && (a.specializationFocus === "academy_specialization" || a.prioritySignal === "depth_priority" || hasChoice(a.needPattern, "specialized_track"))) {
      ensurePriority(scores, "ithmar", "لأنك مؤهل لمسار إثمار وتبحث عن التخصص", 44);
      return;
    }
    if (a.specializationFocus === "not_sure") {
      ensurePriority(scores, chooseBinaTrack(a), "لأن التخصص لم يتضح بعد، فالتأسيس العام يساعد على الاختيار", 32);
      return;
    }
  }

  if (wantsEnvironment) {
    const academyTrack = chooseAcademyTrack(a);
    if (academyTrack) {
      ensurePriority(scores, academyTrack, "لأن الاحتياج الأوضح هو البيئة التربوية والصحبة والمتابعة", 38);
      if (femaleAdult) addScore(scores, "khadija", 24, "البيئة النسائية التفاعلية بديل معتبر إن كانت الخصوصية النسائية أولوية");
      return;
    }
    if (femaleAdult) {
      ensurePriority(scores, "khadija", "لأن الاحتياج بيئة تفاعلية ومع العمر والجنس فمدرسة خديجة أقرب من مسار تعليمي صرف", 36);
      return;
    }
  }

  if (wantsCurriculum || wantsGentle) {
    const bina = chooseBinaTrack(a);
    ensurePriority(
      scores,
      bina,
      bina === "bina_muyassar" ? "لأنك تحتاج خطة علمية لكن البداية الأخف أنسب لوقتك" : "لأنك تحتاج خطة علمية مرتبة وتستطيع التزامًا أوضح",
      34
    );
  }
}

function calculateRecommendations(a) {
  const scores = {};
  Object.keys(PROGRAMS).forEach((id) => {
    scores[id] = { id, score: isEligible(id, a) ? 0 : -999, reasons: [] };
  });

  if (a.age === "10_12") addScore(scores, "buthur", 120, "العمر يطابق مسار بذور");
  if (a.age === "13_14") {
    addScore(scores, "ghiras", 36, "العمر ضمن مسارات اليافعين");
    addScore(scores, "juthur", 34, "العمر يسمح بالمسار الخاص عند الجدية");
  }
  if (a.age === "15_16") {
    addScore(scores, "ghiras", 24, "العمر ما زال مناسبًا لمسارات اليافعين");
    addScore(scores, "juthur", 24, "العمر مناسب للمسار الخاص إذا وجدت الجدية");
    addScore(scores, "bina_muyassar", 10, "العمر فوق 15 فيمكن البدء بتأسيس شرعي ميسر");
    addScore(scores, "bina_asasi", 8, "العمر فوق 15 فيمكن دخول البناء المنهجي");
  }
  if (a.age === "17_20") {
    addScore(scores, "ishraq", 18, "العمر مناسب لأكاديمية الجيل الصاعد - إشراق");
    addScore(scores, "bina_asasi", 12, "العمر فوق 15 ويناسب البناء الشرعي المنهجي");
    addScore(scores, "bina_muyassar", 10, "العمر فوق 15 مع احتمال الحاجة لبداية أخف");
  }
  if (a.age === "21_22" || a.age === "23_plus") {
    addScore(scores, "bina_asasi", 16, "العمر مناسب لبرامج التأسيس للكبار");
    addScore(scores, "bina_muyassar", 14, "يمكن اختيار النسخة الأخف بحسب الوقت");
    addScore(scores, "fikri", 8, "العمر مناسب للمعالجة الفكرية الأوسع");
    addScore(scores, "hadith", 8, "العمر مناسب للتخصص العلمي");
  }

  if (a.forWhom === "child" && isYouthAcademyAge(a)) {
    addScore(scores, "buthur", 10, "البحث لابن أو ابنة يرجح البيئة العمرية المناسبة");
    addScore(scores, "ghiras", 14, "البحث لابن أو ابنة يرجح بيئة تربوية آمنة");
    addScore(scores, "juthur", 10, "يمكن النظر للمسار الخاص إذا كان الابن جادًا");
    addScore(scores, "ishraq", 10, "البيئة الشبابية التربوية قد تناسب هذه المرحلة");
  }

  if (a.dailyTime === "15") {
    addScore(scores, "bina_muyassar", 26, "وقتك اليومي محدود فالميسّر أرفق");
    addScore(scores, "bard_yaqin", 12, "المدة اليومية الخفيفة تناسب مسارًا أرفق نسبيًا");
  }
  if (a.dailyTime === "30") {
    addScore(scores, "bina_muyassar", 22, "30–45 دقيقة يوميًا ترجّح البداية الميسرة");
    addScore(scores, "bard_yaqin", 10, "الوقت المتوسط الخفيف يناسب مسار يقين وتزكية");
  }
  if (a.dailyTime === "60") {
    addScore(scores, "bina_asasi", 24, "نحو ساعة يوميًا مناسب للمسار الأساسي");
    addScore(scores, "juthur", 10, "الالتزام اليومي جيد للمسارات الخاصة");
    addScore(scores, "ishraq", 10, "الالتزام اليومي جيد لإشراق");
    addScore(scores, "fikri", 10, "لديك وقت مناسب لمسار فكري أطول");
    addScore(scores, "hadith", 10, "لديك وقت مناسب لتخصص علمي");
  }
  if (a.dailyTime === "90") {
    addScore(scores, "bina_asasi", 28, "الوقت اليومي العالي يدعم المسار الأساسي");
    addScore(scores, "alim", 16, "الوقت العالي يقربك من المسارات الطويلة جدًا");
    addScore(scores, "ithmar", 18, "الوقت العالي يناسب التخصص الدقيق إذا توفرت الأهلية");
    addScore(scores, "fikri", 18, "الوقت العالي مناسب للمسار الفكري العميق");
    addScore(scores, "hadith", 16, "الوقت العالي مناسب للتخصص الحديثي");
  }

  addRankedScore(scores, a.needPattern, "structured_path", "bina_asasi", 44, "تحتاج مسارًا علميًا منهجيًا مرتبًا");
  addRankedScore(scores, a.needPattern, "structured_path", "bina_muyassar", 34, "تحتاج ترتيبًا علميًا مع احتمال البداية الأخف");
  addRankedScore(scores, a.needPattern, "structured_path", "hadith", 10, "المسارات المتخصصة المنظمة قد تناسبك لاحقًا");

  addRankedScore(scores, a.needPattern, "relational_growth", "ishraq", 38, "احتياجك بيئة تربوية وصحبة ومتابعة");
  addRankedScore(scores, a.needPattern, "relational_growth", "juthur", 34, "احتياجك بيئة تربوية خاصة");
  addRankedScore(scores, a.needPattern, "relational_growth", "ghiras", 30, "احتياجك بيئة آمنة عامة للناشئة");
  addRankedScore(scores, a.needPattern, "relational_growth", "khadija", 30, "البيئة التفاعلية قد تناسبك إن كنتِ ضمن شروط مدرسة خديجة");

  addRankedScore(scores, a.needPattern, "certainty", "bard_yaqin", 56, "احتياجك الأقرب هو اليقين والتزكية");
  addRankedScore(scores, a.needPattern, "certainty", "fikri", 8, "قد تحتاج لاحقًا لمعالجة فكرية أوسع");

  addRankedScore(scores, a.needPattern, "intellectual_depth", "fikri", 56, "احتياجك فهم فكري ونقد للتيارات");
  addRankedScore(scores, a.needPattern, "intellectual_depth", "bard_yaqin", 10, "قد تحتاج جانبًا يقينيًا وتزكويًا مساعدًا");

  addRankedScore(scores, a.needPattern, "specialized_track", "hadith", 28, "تميل إلى تخصص علمي واضح");
  addRankedScore(scores, a.needPattern, "specialized_track", "ithmar", 22, "التخصص الدقيق يناسبك إذا كنت من خريجي جذور أو إشراق");
  addRankedScore(scores, a.needPattern, "specialized_track", "alim", 14, "قد يناسبك مسار تكويني طويل إذا توفرت شروطه");

  addRankedScore(scores, a.needPattern, "reform_project", "kharitat_thughur", 58, "تريد معرفة ثغرك وتحويل التعلم إلى مشروع");
  addRankedScore(scores, a.needPattern, "reform_project", "bina_asasi", 8, "قد تحتاج أساسًا شرعيًا قبل العمل الإصلاحي");

  addRankedScore(scores, a.needPattern, "women_space", "khadija", 86, "اخترتِ محضنًا نسائيًا تفاعليًا");

  addRankedScore(scores, a.learningShape, "curriculum", "bina_asasi", 34, "تفضّل المقررات والخطة الواضحة");
  addRankedScore(scores, a.learningShape, "curriculum", "bina_muyassar", 24, "الخطة الواضحة مع بداية أخف خيار محتمل");
  addRankedScore(scores, a.learningShape, "curriculum", "hadith", 16, "التخصص الحديثي منظم ومناسب لمحبي المقررات");

  addRankedScore(scores, a.learningShape, "community", "ishraq", 36, "تستمر أكثر مع الصحبة والمتابعة");
  addRankedScore(scores, a.learningShape, "community", "juthur", 30, "الصحبة والمتابعة من خصائص المسار الخاص");
  addRankedScore(scores, a.learningShape, "community", "ghiras", 26, "المسار العام يوفر بيئة وأنشطة مناسبة");
  addRankedScore(scores, a.learningShape, "community", "khadija", 34, "البيئة التفاعلية النسائية مناسبة إن انطبقت الشروط");

  addRankedScore(scores, a.learningShape, "deep_reading", "fikri", 38, "تفضّل التحليل والقراءة الفكرية");
  addRankedScore(scores, a.learningShape, "deep_reading", "bina_asasi", 10, "البناء الشرعي يساعد في ضبط القراءة");

  addRankedScore(scores, a.learningShape, "practice", "kharitat_thughur", 46, "تريد ثمرة عملية ومشروعًا في الواقع");

  addRankedScore(scores, a.learningShape, "gentle_start", "bina_muyassar", 38, "تريد بداية أخف قابلة للاستمرار");
  addRankedScore(scores, a.learningShape, "gentle_start", "bard_yaqin", 14, "تحتاج مسارًا أرفق وأقرب للقلب");
  addRankedScore(scores, a.learningShape, "gentle_start", "ghiras", 12, "المسار العام أيسر من الانتقائي");

  if (a.prioritySignal === "curriculum_priority") addScore(scores, chooseBinaTrack(a), 42, "عند تزاحم الخيارات، قدّمت الخطة العلمية والمقررات");
  if (a.prioritySignal === "environment_priority") {
    addScore(scores, "ishraq", 34, "عند تزاحم الخيارات، قدّمت البيئة والصحبة والمتابعة");
    addScore(scores, "juthur", 28, "البيئة والمتابعة من خصائص مسارات الأكاديمية");
    addScore(scores, "ghiras", 24, "البيئة العامة مناسبة لمن يريد صحبة أيسر");
    addScore(scores, "khadija", 28, "البيئة التفاعلية النسائية بديل معتبر إن انطبقت الشروط");
  }
  if (a.prioritySignal === "women_priority") addScore(scores, "khadija", 78, "عند تزاحم الخيارات، قدّمتِ خصوصية البيئة النسائية");
  if (a.prioritySignal === "gentle_priority") addScore(scores, "bina_muyassar", 42, "عند تزاحم الخيارات، قدّمت البداية الأخف والاستمرار");
  if (a.prioritySignal === "depth_priority") {
    addScore(scores, "ithmar", 26, "تبحث عن عمق أو تخصص لاحق إن توفرت الأهلية");
    addScore(scores, "hadith", 22, "التخصص العلمي من مسارات العمق المحتملة");
    addScore(scores, "fikri", 18, "العمق الفكري قد يكون مناسبًا بحسب ميولك");
  }

  if (a.selectivity === "open") {
    addScore(scores, "ghiras", 18, "تفضل مسارًا مفتوحًا");
    addScore(scores, "bina_muyassar", 12, "تفضل البداية الأيسر");
  }
  if (a.selectivity === "ok_test") {
    addScore(scores, "bina_asasi", 10, "لا تمانع اختبارًا أو مرحلة قبول");
    addScore(scores, "juthur", 12, "لا تمانع اختبار القبول للمسار الخاص");
    addScore(scores, "ishraq", 12, "لا تمانع اختبار القبول لإشراق");
  }
  if (a.selectivity === "high_selective") {
    addScore(scores, "alim", 20, "تقبل المسارات العالية الانتقائية");
    addScore(scores, "ithmar", 22, "تقبل المسارات الخاصة المتقدمة إن توفرت الأهلية");
    addScore(scores, "juthur", 14, "تقبل المسار الخاص والمتابعة الأعلى");
    addScore(scores, "khadija", 10, "لا تمانع عددًا محدودًا وقبولًا انتقائيًا");
  }

  if (completedJuthurOrIshraq(a)) {
    addScore(scores, "ithmar", 36, "أهلية إثمار موجودة بسبب التخرج من جذور أو إشراق");
    ["juthur", "ghiras", "ishraq"].forEach((id) => {
      if (scores[id]) {
        scores[id].score = -999;
        scores[id].reasons = [];
      }
    });
  }

  if (a.specializationFocus === "hadith") addScore(scores, "hadith", 54, "التخصص الأقرب لك هو علوم الحديث والسنة");
  if (a.specializationFocus === "academy_specialization") addScore(scores, "ithmar", 62, "تبحث عن تخصص دقيق بعد تجربة أكاديمية سابقة");
  if (a.specializationFocus === "long_formation") addScore(scores, "alim", 42, "تميل إلى تكوين علمي طويل جدًا");
  if (a.specializationFocus === "not_sure") addScore(scores, chooseBinaTrack(a), 26, "لم يتضح التخصص بعد، فالتأسيس العام أقرب");

  if (a.quranLevel === "full") addScore(scores, "alim", 48, "حفظ القرآن كاملًا يدعم أهلية برنامج عالِم");
  if (a.quranLevel === "partial") addScore(scores, "bina_asasi", 6, "لديك أساس قرآني جزئي يمكن البناء عليه");
  if (a.quranLevel === "little") addScore(scores, "bina_muyassar", 6, "البداية الميسرة قد تكون أرفق مع ضعف الحفظ");
  if (a.quranLevel && a.quranLevel !== "full" && scores.alim) scores.alim.score -= 70;

  if (a.doubtImpact === "high") {
    addScore(scores, "bard_yaqin", 58, "الشبهات تؤثر على السكينة؛ اليقين والتزكية أسبق");
    if (scores.fikri) scores.fikri.score -= 12;
  }
  if (a.doubtImpact === "medium") {
    addScore(scores, "bard_yaqin", 30, "تحتاج تثبيتًا يقينيًا مع فهم");
    addScore(scores, "fikri", 10, "قد يفيدك البناء الفكري لاحقًا");
  }
  if (a.doubtImpact === "theoretical") addScore(scores, "fikri", 38, "تتعامل مع الشبهات كسؤال فكري تحليلي");
  if (a.doubtImpact === "low") addScore(scores, "bina_asasi", 4, "يمكنك البدء بالتأسيس العام دون أولوية علاجية خاصة");

  if (a.reformReadiness === "ready") addScore(scores, "kharitat_thughur", 44, "أنت مستعد للمواد القبلية ومشروع خارطة الثغور");
  if (a.reformReadiness === "interested") {
    addScore(scores, "kharitat_thughur", 20, "لديك اهتمام بالإصلاح لكن تحتاج تهيئة قبلية");
    addScore(scores, "bina_asasi", 10, "البناء المنهجي يقوي الأساس قبل العمل");
  }
  if (a.reformReadiness === "not_now") {
    if (scores.kharitat_thughur) scores.kharitat_thughur.score -= 30;
    addScore(scores, "bina_asasi", 10, "اعترفت أن البناء أسبق من المشروع العملي الآن");
  }

  // طبقة تاريخ الطالب قبل القواعد الحاسمة حتى تؤثر على البدائل وعلى قرار الاستمرار/الانسحاب.
  applyStudentHistoryLogic(scores, a);

  Object.keys(scores).forEach((id) => {
    if (!isEligible(id, a)) scores[id].score = -999;
  });

  applyDecisionRules(scores, a);

  const sorted = Object.values(scores)
    .filter((item) => item.score > -100)
    .sort((x, y) => y.score - x.score)
    .map((item) => ({ ...PROGRAMS[item.id], score: Math.max(0, item.score), reasons: item.reasons.slice(0, 5) }));

  const list = sorted.length
    ? sorted
    : [PROGRAMS.bina_muyassar, PROGRAMS.bina_asasi].map((program) => ({ ...program, score: 50, reasons: ["اختيار احتياطي آمن عند نقص المعطيات"] }));

  return { list, advice: buildContextAdvice(a, list) };
}

function buildContextAdvice(a, list) {
  const known = knownPrograms(a);
  if (!known.length) return null;

  const primary = list[0];
  const primaryScore = primary?.score || 0;
  const currentItems = list.filter((program) => known.includes(program.id));
  const bestKnown = currentItems[0] || known.map((id) => PROGRAMS[id]).filter(Boolean)[0];
  const bestKnownScore = currentItems[0]?.score || 0;
  const ratio = primaryScore ? bestKnownScore / primaryScore : 0;

  if (a.programStatus === "studying_committed" || a.programStatus === "studying_struggling") {
    if (!bestKnown) return null;

    if (primary?.id === bestKnown.id || ratio >= 0.74) {
      if (a.programStatus === "studying_struggling") {
        return {
          type: "repair",
          title: "الأقرب لك الآن: عالج التقصير واستمر",
          program: bestKnown,
          message:
            "يبدو أن البرنامج الذي أنت فيه قريب من احتياجك، لكن المشكلة ليست في اختيار برنامج جديد بل في الاستمرار. لا تجعل التسجيل في برنامج آخر مهربًا من التراكم السابق.",
          points: [
            "ابدأ بخطة تعويض صغيرة لأسبوعين فقط.",
            "لا تحاول تعويض كل الفائت دفعة واحدة.",
            "اجعل هدفك الآن العودة للاستمرار لا البحث عن بداية جديدة.",
            "بعد الاستقرار يمكن التفكير في برنامج لاحق إن بقيت الحاجة واضحة.",
          ],
        };
      }
      return {
        type: "continue",
        title: "الأقرب لك الآن: ركّز في برنامجك الحالي",
        program: bestKnown,
        message:
          "بناءً على إجاباتك، برنامجك الحالي قريب من احتياجك. الأفضل غالبًا أن تعطيه حقه بدل فتح مسار جديد يزيد التشتت.",
        points: [
          "أكمل البرنامج الحالي قبل التفكير ببرنامج آخر.",
          "ليس المطلوب جمع البرامج بل الخروج من برنامج واحد بأثر واضح.",
          "إن أردت برنامجًا آخر فاجعله خطوة لاحقة بعد الاستقرار.",
        ],
      };
    }

    if (ratio < 0.55 && primary) {
      return {
        type: "switch",
        title: "قد يكون الأنسب أن تعيد النظر في برنامجك الحالي",
        program: primary,
        currentProgram: bestKnown,
        message:
          "تظهر إجاباتك أن برنامجك الحالي بعيد نسبيًا عن احتياجك الأقرب. هنا لا ننصح بالتشتت، لكن ننصح بمراجعة القرار: هل المشكلة فتور مؤقت أم أن البرنامج فعلًا لا يخدم حاجتك الآن؟",
        points: [
          "لا تنسحب بعجلة؛ فرّق بين الفتور وبين عدم المناسبة.",
          "إن كان البرنامج بعيدًا فعلًا، فانتقل عند فتح التسجيل إلى الأنسب.",
          "لا تجمع بين برنامجين كبيرين إلا إن كان وقتك واستقرارك يسمحان.",
        ],
      };
    }

    return {
      type: "caution",
      title: "برنامجك الحالي له صلة، لكن انتبه من التشتت",
      program: bestKnown,
      alternative: primary,
      message:
        "هناك صلة بين برنامجك الحالي واحتياجك، وظهر أيضًا برنامج آخر قريب. في هذه الحالة لا تجعل البرنامج الجديد هروبًا من التعثر أو رغبة في البداية فقط.",
      points: [
        "إن كنت مستقرًا فأكمل الحالي.",
        "إن كنت متعثرًا فابدأ بالاستدراك قبل التسجيل الجديد.",
        "اجعل البديل خطوة لاحقة إذا بقيت الحاجة واضحة.",
      ],
    };
  }

  if (a.programStatus === "graduated_or_near") {
    return {
      type: "graduate",
      title: "سنحاول البناء على ما درسته لا تكراره",
      program: primary,
      message:
        "لأنك تخرجت من برنامج أو أوشكت على التخرج، فالترشيح لا يعاملك كمبتدئ. تم تخفيف البرامج التي درستها سابقًا وترجيح الخطوات التي يمكن أن تبني عليها.",
      points: [
        "لا تكرر البرنامج نفسه غالبًا إلا لسبب واضح.",
        "فكّر في الخطوة التالية: تعميق فكري، تخصص، عمل إصلاحي، أو تأسيس لم يكتمل.",
        "إن كنت خريج جذور أو إشراق فقد يظهر إثمار لأنه مرحلة متقدمة لا مسار للمبتدئين.",
      ],
    };
  }

  if (a.programStatus === "withdrew") {
    return {
      type: "withdrawn",
      title: "تجربة الانسحاب السابقة مهمة في القرار",
      program: primary,
      message:
        "لأنك انسحبت من برنامج سابق، فالاختيار الجديد ينبغي أن يراعي سبب الانسحاب: هل كان بسبب ضيق الوقت، أم عدم مناسبة البرنامج، أم ضعف المتابعة؟",
      points: [
        "إن كان السبب ضيق الوقت، فابدأ بالأخف.",
        "إن كان السبب عدم مناسبة طبيعة البرنامج، فاختر ما يطابق احتياجك الآن.",
        "لا تدخل برنامجًا جديدًا بنفس ظروف الانسحاب السابقة دون تعديل الخطة.",
      ],
    };
  }

  return null;
}

function visibleQuestions(answers) {
  return QUESTIONS.filter((q) => !q.condition || q.condition(answers));
}

function isBinaProgram(program) {
  return program?.id === "bina_asasi" || program?.id === "bina_muyassar";
}

function AdviceCard({ advice, onOpen }) {
  if (!advice) return null;
  const tone = {
    repair: "amber",
    continue: "green",
    switch: "rose",
    caution: "amber",
    graduate: "blue",
    withdrawn: "slate",
  }[advice.type] || "amber";

  return (
    <div className={`advice-card advice-${tone}`}>
      <div className="advice-kicker">تنبيه قبل التسجيل</div>
      <h2>{advice.title}</h2>
      <p>{advice.message}</p>

      {advice.program && (
        <button className="advice-program" type="button" onClick={() => onOpen(advice.program.id)}>
          <span>{advice.program.icon}</span>
          <strong>{advice.program.name}</strong>
          <small>عرض التفاصيل</small>
        </button>
      )}

      {advice.currentProgram && (
        <div className="advice-compare-line">
          البرنامج الحالي: <strong>{advice.currentProgram.name}</strong>
        </div>
      )}

      <ul>
        {advice.points?.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  );
}

function BinaComparison() {
  return (
    <div className="compare-box">
      <div className="compare-title">الفرق السريع بين البناء المنهجي - المسار الأساسي والمسار الميسّر</div>
      <div className="compare-grid">
        <div>
          <strong>المسار الأساسي</strong>
          <p>أطول وأشمل، مناسب لمن يستطيع التزامًا يوميًا واضحًا ويريد التأسيس الكامل.</p>
        </div>
        <div>
          <strong>المسار الميسّر</strong>
          <p>أخف وأقصر، مناسب للمبتدئ أو المشغول أو من يخشى الانقطاع من المسار الطويل.</p>
        </div>
      </div>
    </div>
  );
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

function DetailSection({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="detail-section">
      <h3>{title}</h3>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ProgramDetail({ program, onBack }) {
  if (!program) return null;
  return (
    <section className="program-detail">
      <button className="ghost-btn" type="button" onClick={onBack}>العودة</button>
      <div className="program-hero" style={{ background: `linear-gradient(135deg, ${program.soft}, #fff)` }}>
        <span className="program-hero-icon">{program.icon}</span>
        <div>
          <small>{program.badge}</small>
          <h1 style={{ color: program.color }}>{program.name}</h1>
          <p>{program.description}</p>
        </div>
      </div>
      <div className="detail-grid meta-grid">
        <div><small>المدة</small><strong>{program.duration}</strong></div>
        <div><small>الفئة</small><strong>{program.audience}</strong></div>
        <div><small>طبيعة القبول</small><strong>{program.selectivity}</strong></div>
        <div><small>التكلفة</small><strong>{program.cost}</strong></div>
        <div><small>الوسيلة</small><strong>{program.medium}</strong></div>
        <div><small>التسجيل</small><strong>{program.registrationStatus}</strong></div>
      </div>
      <DetailSection title="أهداف البرنامج" items={program.goals} />
      <DetailSection title="ماذا ستكتسب؟" items={program.outcomes} />
      <DetailSection title="يناسبك إذا…" items={program.suitable} />
      <DetailSection title="انتبه قبل التسجيل…" items={program.caution} />
      <div className="links-box">
        <div>
          <small>رابط الموقع الرسمي</small>
          <strong>{program.officialUrl || "سيُحدّث لاحقًا"}</strong>
        </div>
        <div>
          <small>رابط قناة تلجرام</small>
          <strong>{program.telegramUrl || "سيُحدّث لاحقًا"}</strong>
        </div>
      </div>
    </section>
  );
}

function HomeView({ onStart, onPrograms, onCompare }) {
  return (
    <>
      <section className="home-hero">
        <div className="hero-card">
          <div className="hero-badge">دليل اختيار برامج الشيخ أحمد بن يوسف السيد</div>
          <h1>لا تسجّل في كل برنامج تراه.</h1>
          <p>تعرّف على احتياجك، ومرحلتك، وطريقة التعلم التي تناسبك، ثم اختر البرنامج الأقرب بدل التشتت بين البرامج.</p>
          <div className="hero-actions">
            <button className="main-btn hero-btn" type="button" onClick={onStart}>ابدأ اختبار الاختيار</button>
            <button className="ghost-btn hero-btn" type="button" onClick={onPrograms}>استعراض كل البرامج</button>
            <button className="ghost-btn hero-btn" type="button" onClick={onCompare}>مقارنة عامة</button>
          </div>
        </div>
      </section>
      <section className="intro-grid">
        <div className="intro-card"><span>🧭</span><h3>اختيار بحسب الحاجة</h3><p>الأسئلة لا تفترض برنامجًا مسبقًا، بل تقرأ احتياج الطالب وواقعه.</p></div>
        <div className="intro-card"><span>🎓</span><h3>يراعي التجربة السابقة</h3><p>إذا كنت طالبًا حاليًا أو خريجًا أو منسحبًا، فالنتيجة تتعامل مع ذلك مباشرة.</p></div>
        <div className="intro-card"><span>📚</span><h3>نتيجة مع بدائل</h3><p>يعرض البرنامج الأقرب، ثم بدائل قريبة مع نسبة مناسبة.</p></div>
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
        <div><small>استعراض البرامج</small><h2>كل البرامج والمسارات</h2><p>استعراض سريع دون ترشيح. اضغط على أي برنامج لفتح تفاصيله.</p></div>
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
        <div><small>مقارنة عامة</small><h2>مقارنة مختصرة بين البرامج</h2><p>هذه المقارنة للاطلاع العام، أما الترشيح الأدق فابدأ اختبار الاختيار.</p></div>
      </div>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr><th>البرنامج</th><th>الفئة</th><th>المدة</th><th>طبيعة القبول</th><th>التكلفة</th><th>الوسيلة</th><th>التسجيل</th><th></th></tr>
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

function ResultView({ result, onOpen, onRestart }) {
  const list = result.list;
  const primary = list[0];
  const alternatives = list.slice(1, 4);
  const showBinaComparison = list.slice(0, 4).some(isBinaProgram);

  return (
    <section className="result-wrap">
      <AdviceCard advice={result.advice} onOpen={onOpen} />

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

          {primary.reasons?.length > 0 && (
            <div className="why-box">
              <h3>لماذا ظهر هذا الترشيح؟</h3>
              <ul>{primary.reasons.map((reason, index) => <li key={index}>{reason}</li>)}</ul>
            </div>
          )}

          <div className="notice-box">
            <h3>انتبه قبل التسجيل…</h3>
            <ul>{primary.caution?.slice(0, 4).map((item, index) => <li key={index}>{item}</li>)}</ul>
          </div>

          <button className="main-btn" type="button" onClick={() => onOpen(primary.id)}>افتح تفاصيل البرنامج</button>
        </div>
      </div>

      {showBinaComparison && <BinaComparison />}

      {alternatives.length > 0 && (
        <div className="alternatives-box">
          <h3>بدائل قريبة</h3>
          <p>قد تكون مناسبة أيضًا بحسب بعض إجاباتك.</p>
          {alternatives.map((program, index) => <ProgramMini key={program.id} program={program} index={index} onOpen={onOpen} primaryScore={primary.score} />)}
        </div>
      )}

      <button className="ghost-btn restart-btn" type="button" onClick={onRestart}>إعادة الاختبار</button>
    </section>
  );
}

export default function ProgramSelector() {
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [openedProgramId, setOpenedProgramId] = useState(null);
  const [mode, setMode] = useState("home");

  const qs = useMemo(() => visibleQuestions(answers), [answers]);
  const current = qs[Math.min(step, qs.length - 1)] || qs[0];
  const currentOptions = current ? current.options(answers).filter(Boolean) : [];
  const result = useMemo(() => calculateRecommendations(answers), [answers]);
  const openedProgram = openedProgramId ? result.list.find((p) => p.id === openedProgramId) || PROGRAMS[openedProgramId] : null;
  const progress = qs.length ? Math.round(((Math.min(step, qs.length - 1) + (hasAnswer(answers[current?.id]) ? 1 : 0)) / qs.length) * 100) : 0;

  function choose(questionId, value) {
    const question = QUESTIONS.find((q) => q.id === questionId);
    setAnswers((prev) => {
      if (question?.multi) {
        const currentValues = asArray(prev[questionId]);
        const exists = currentValues.includes(value);
        const nextValues = exists ? currentValues.filter((item) => item !== value) : [...currentValues, value];
        return cleanAnswers({ ...prev, [questionId]: nextValues });
      }
      return cleanAnswers({ ...prev, [questionId]: value });
    });
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
    if (!current || !hasAnswer(answers[current.id])) return;
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

  function closeProgram() {
    setOpenedProgramId(null);
  }

  return (
    <div className="selector-root" dir="rtl">
      <style>{styles}</style>
      <main className="app-shell">
        {openedProgram && <ProgramDetail program={openedProgram} onBack={closeProgram} />}

        {mode === "home" && !openedProgram && <HomeView onStart={startQuiz} onPrograms={() => setMode("programs")} onCompare={() => setMode("compare")} />}
        {mode === "programs" && !openedProgram && <ProgramDirectory onOpen={setOpenedProgramId} onBack={goHome} />}
        {mode === "compare" && !openedProgram && <ComparisonTable onOpen={setOpenedProgramId} onBack={goHome} />}

        {mode === "quiz" && !showResult && !openedProgram && current && (
          <section className="quiz-card">
            <div className="quiz-topline">
              <button className="ghost-btn" type="button" onClick={goHome}>الرئيسية</button>
              <span>اختبار اختيار البرنامج المناسب</span>
            </div>
            <div className="progress-row"><span>السؤال {Math.min(step, qs.length - 1) + 1} من {qs.length}</span><span>{progress}%</span></div>
            <div className="progress"><span style={{ width: `${progress}%` }} /></div>

            <div className="question-head">
              <h2>{questionTitle(current, answers)}</h2>
              {questionSubtitle(current, answers) && <p>{questionSubtitle(current, answers)}</p>}
              {current.multi && <p className="multi-hint">يمكنك اختيار أكثر من خيار. في الأسئلة الترتيبية يظهر رقم يوضّح ترتيب اختيارك.</p>}
            </div>

            <div className="options-grid">
              {currentOptions.map((opt) => (
                <button
                  className={`option-card ${hasChoice(answers[current.id], opt.value) ? "selected" : ""}`}
                  type="button"
                  key={opt.value}
                  onClick={() => choose(current.id, opt.value)}
                >
                  <span className="option-icon">
                    {current.multi && hasChoice(answers[current.id], opt.value) ? <b className="rank-badge">{choiceRank(answers[current.id], opt.value) + 1}</b> : opt.icon}
                  </span>
                  <span className="option-copy"><strong>{opt.title}</strong>{opt.sub && <small>{opt.sub}</small>}</span>
                </button>
              ))}
            </div>

            <div className="nav-row">
              <button className="ghost-btn" type="button" onClick={back} disabled={step === 0}>السابق</button>
              <button className="main-btn" type="button" onClick={next} disabled={!hasAnswer(answers[current.id])}>{step >= qs.length - 1 ? "اعرض النتيجة" : "التالي"}</button>
            </div>
          </section>
        )}

        {mode === "quiz" && showResult && !openedProgram && <ResultView result={result} onOpen={setOpenedProgramId} onRestart={restart} />}
      </main>
    </div>
  );
}

const styles = `
@import url('https://fonts.googleapis.com/css2?family=Alyamama:wght@400;500;600;700&display=swap');

.selector-root {
  --bg: #f7f4ed;
  --paper: #fffdf8;
  --ink: #1f2933;
  --muted: #68737d;
  --border: #e8dfd1;
  --green: #176b54;
  --green-2: #0f8a68;
  --amber: #b87917;
  --rose: #a43b59;
  --blue: #215f8f;
  font-family: Alyamama, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top right, rgba(23, 107, 84, .12), transparent 34rem),
    radial-gradient(circle at bottom left, rgba(184, 121, 23, .12), transparent 32rem),
    var(--bg);
  min-height: 100vh;
  color: var(--ink);
}

* { box-sizing: border-box; }
button { font-family: inherit; }

.app-shell { max-width: 1120px; margin: 0 auto; padding: 28px 16px 56px; }

.home-hero { min-height: 390px; display: grid; place-items: center; padding: 28px 0; }
.hero-card {
  width: min(860px, 100%);
  background: linear-gradient(135deg, rgba(255,253,248,.96), rgba(255,250,238,.9));
  border: 1px solid var(--border);
  border-radius: 34px;
  box-shadow: 0 24px 70px rgba(39, 32, 20, .10);
  padding: clamp(28px, 6vw, 58px);
  text-align: center;
  position: relative;
  overflow: hidden;
}
.hero-card::before { content: ""; position: absolute; inset: -70px auto auto -70px; width: 220px; height: 220px; border-radius: 50%; background: rgba(23, 107, 84, .09); }
.hero-badge { display: inline-flex; padding: 8px 16px; border-radius: 99px; background: #e8f4ef; color: var(--green); font-size: 14px; margin-bottom: 18px; border: 1px solid #cfe7de; }
.hero-card h1 { font-size: clamp(34px, 7vw, 62px); line-height: 1.15; margin: 0 0 18px; color: #102b23; }
.hero-card p { max-width: 660px; margin: 0 auto 28px; color: var(--muted); line-height: 2; font-size: 18px; }
.hero-actions { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
.hero-btn { min-width: 170px; }

.main-btn, .ghost-btn {
  border: 0; border-radius: 16px; padding: 13px 22px; font-weight: 700; cursor: pointer; transition: .18s ease; font-size: 15px;
}
.main-btn { color: white; background: linear-gradient(135deg, var(--green), var(--green-2)); box-shadow: 0 10px 20px rgba(15, 138, 104, .18); }
.main-btn:hover { transform: translateY(-1px); }
.main-btn:disabled, .ghost-btn:disabled { opacity: .45; cursor: not-allowed; transform: none; }
.ghost-btn { background: rgba(255,255,255,.72); color: #395047; border: 1px solid var(--border); }
.ghost-btn:hover { background: white; }

.intro-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin: 14px 0 30px; }
.intro-card { background: rgba(255,253,248,.86); border: 1px solid var(--border); border-radius: 24px; padding: 22px; box-shadow: 0 8px 22px rgba(39,32,20,.04); }
.intro-card span { font-size: 30px; }
.intro-card h3 { margin: 12px 0 8px; }
.intro-card p { margin: 0; color: var(--muted); line-height: 1.8; }

.quiz-card, .result-wrap, .directory-page, .comparison-page, .program-detail { max-width: 900px; margin: 0 auto; }
.quiz-card, .result-main, .alternatives-box, .compare-box, .advice-card, .program-detail > .detail-section, .links-box {
  background: rgba(255,253,248,.95);
  border: 1px solid var(--border);
  border-radius: 28px;
  box-shadow: 0 18px 52px rgba(39,32,20,.08);
}
.quiz-card { padding: clamp(20px, 4vw, 34px); }
.quiz-topline, .progress-row, .nav-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.quiz-topline span { color: var(--muted); font-weight: 700; }
.progress-row { margin-top: 24px; color: var(--muted); font-size: 14px; }
.progress { height: 9px; background: #ebe2d5; border-radius: 99px; overflow: hidden; margin: 10px 0 28px; }
.progress span { display: block; height: 100%; background: linear-gradient(90deg, var(--green), var(--amber)); border-radius: inherit; transition: width .25s ease; }
.question-head h2 { font-size: clamp(24px, 5vw, 36px); margin: 0 0 10px; color: #112e25; }
.question-head p { color: var(--muted); line-height: 1.8; margin: 0 0 10px; }
.multi-hint { background: #fff6df; color: #7d560c !important; border: 1px solid #f1dcab; border-radius: 16px; padding: 10px 14px; }
.options-grid { display: grid; gap: 12px; margin: 24px 0; }
.option-card { width: 100%; display: flex; align-items: flex-start; gap: 14px; text-align: right; border: 1.5px solid var(--border); background: white; border-radius: 20px; padding: 16px; cursor: pointer; transition: .18s ease; color: var(--ink); }
.option-card:hover { border-color: #a7cfbf; transform: translateY(-1px); }
.option-card.selected { background: #eaf7f1; border-color: var(--green-2); box-shadow: 0 8px 18px rgba(15, 138, 104, .10); }
.option-icon { width: 34px; height: 34px; flex: 0 0 34px; display: grid; place-items: center; font-size: 22px; background: #f6efe3; border-radius: 12px; }
.rank-badge { width: 26px; height: 26px; display: grid; place-items: center; border-radius: 50%; color: white; background: var(--green); font-size: 14px; }
.option-copy strong { display: block; font-size: 17px; }
.option-copy small { display: block; margin-top: 6px; color: var(--muted); line-height: 1.7; }
.nav-row { margin-top: 16px; }

.result-wrap { display: grid; gap: 18px; }
.result-main { overflow: hidden; border-width: 1.5px; }
.result-top { display: flex; gap: 18px; padding: clamp(22px, 4vw, 36px); align-items: flex-start; }
.result-icon { font-size: 50px; width: 70px; height: 70px; display: grid; place-items: center; background: white; border-radius: 22px; box-shadow: 0 10px 26px rgba(0,0,0,.06); }
.result-label { display: inline-flex; padding: 6px 12px; border-radius: 99px; background: rgba(255,255,255,.74); color: var(--green); font-weight: 700; font-size: 13px; margin-bottom: 8px; }
.result-top h2 { margin: 0 0 10px; font-size: clamp(26px, 5vw, 40px); }
.result-top p { margin: 0; color: #52606b; line-height: 1.9; }
.result-body { padding: clamp(20px, 4vw, 34px); }
.detail-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 20px; }
.detail-grid > div { background: #f8f2e8; border: 1px solid #eee2cf; border-radius: 18px; padding: 14px; }
.detail-grid small { color: var(--muted); display: block; margin-bottom: 5px; }
.detail-grid strong { display: block; line-height: 1.6; }
.why-box, .notice-box { border-radius: 22px; padding: 18px; margin: 18px 0; }
.why-box { background: #edf8f3; border: 1px solid #cfeade; }
.notice-box { background: #fff5df; border: 1px solid #f0d8a7; }
.why-box h3, .notice-box h3, .alternatives-box h3, .compare-title { margin: 0 0 10px; }
ul { margin: 0; padding-right: 22px; }
li { margin: 8px 0; line-height: 1.8; }

.advice-card { padding: clamp(20px, 4vw, 30px); border-width: 1.5px; }
.advice-kicker { font-weight: 800; margin-bottom: 8px; }
.advice-card h2 { margin: 0 0 12px; font-size: clamp(24px, 5vw, 36px); }
.advice-card p { margin: 0 0 16px; line-height: 1.9; }
.advice-program { display: flex; align-items: center; gap: 12px; width: 100%; border: 1px solid rgba(0,0,0,.08); background: rgba(255,255,255,.64); border-radius: 18px; padding: 14px; cursor: pointer; text-align: right; margin-bottom: 12px; }
.advice-program span { font-size: 28px; }
.advice-program strong { flex: 1; }
.advice-program small { color: var(--muted); }
.advice-compare-line { background: rgba(255,255,255,.6); border-radius: 14px; padding: 12px; margin: 10px 0; }
.advice-amber { background: #fff7e8; border-color: #f1d39b; }
.advice-green { background: #edf8f0; border-color: #bfe2ca; }
.advice-rose { background: #fff0f3; border-color: #efc2cd; }
.advice-blue { background: #eef6ff; border-color: #c6def6; }
.advice-slate { background: #f4f6f7; border-color: #dce2e7; }

.alternatives-box, .compare-box { padding: 22px; }
.alternatives-box p { color: var(--muted); margin-top: -4px; }
.mini-program { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px; margin-top: 10px; background: white; border: 1px solid var(--border); border-radius: 18px; cursor: pointer; text-align: right; }
.mini-rank { width: 28px; height: 28px; border-radius: 50%; background: #f3eadc; display: grid; place-items: center; font-weight: 800; color: var(--amber); }
.mini-icon { font-size: 26px; }
.mini-text { flex: 1; }
.mini-text strong, .mini-text small { display: block; }
.mini-text small { color: var(--muted); margin-top: 4px; }
.mini-score { font-weight: 800; color: var(--green); background: #eaf7f1; padding: 6px 10px; border-radius: 99px; }
.mini-arrow { color: var(--muted); font-size: 13px; }
.compare-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.compare-grid > div { background: white; border: 1px solid var(--border); border-radius: 18px; padding: 14px; }
.compare-grid p { margin: 8px 0 0; color: var(--muted); line-height: 1.8; }
.restart-btn { width: fit-content; margin: 0 auto; }

.section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; margin-bottom: 20px; }
.section-head small { color: var(--green); font-weight: 800; }
.section-head h2 { margin: 6px 0 6px; font-size: 34px; }
.section-head p { margin: 0; color: var(--muted); }
.program-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
.directory-card { text-align: right; background: rgba(255,253,248,.94); border: 1.5px solid var(--border); border-radius: 24px; padding: 20px; cursor: pointer; min-height: 245px; display: flex; flex-direction: column; gap: 8px; }
.directory-card:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(39,32,20,.08); }
.directory-icon { font-size: 34px; }
.directory-card strong { font-size: 18px; }
.directory-card small { color: var(--green); font-weight: 800; }
.directory-card p { color: var(--muted); line-height: 1.7; margin: 0; flex: 1; }
.directory-card em { font-style: normal; color: #8a6b38; font-size: 13px; }

.comparison-table-wrap { overflow-x: auto; background: rgba(255,253,248,.95); border: 1px solid var(--border); border-radius: 24px; }
.comparison-table { width: 100%; border-collapse: collapse; min-width: 900px; }
.comparison-table th, .comparison-table td { padding: 14px; border-bottom: 1px solid var(--border); text-align: right; vertical-align: top; }
.comparison-table th { background: #f8f0e2; color: #56422a; }
.comparison-table td small { display: block; color: var(--muted); margin-top: 4px; }
.table-link { border: 0; background: #eaf7f1; color: var(--green); border-radius: 12px; padding: 8px 12px; cursor: pointer; font-weight: 800; }

.program-detail { display: grid; gap: 18px; }
.program-hero { display: flex; gap: 18px; align-items: flex-start; border: 1px solid var(--border); border-radius: 30px; padding: clamp(22px, 4vw, 36px); }
.program-hero-icon { width: 72px; height: 72px; display: grid; place-items: center; font-size: 44px; background: white; border-radius: 24px; box-shadow: 0 12px 28px rgba(0,0,0,.06); }
.program-hero small { color: var(--green); font-weight: 800; }
.program-hero h1 { margin: 8px 0 10px; font-size: clamp(28px, 5vw, 44px); }
.program-hero p { color: #52606b; line-height: 1.9; margin: 0; }
.meta-grid { margin: 0; }
.detail-section { padding: 22px; }
.detail-section h3 { margin: 0 0 10px; color: #23352e; }
.links-box { padding: 18px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.links-box div { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 14px; }
.links-box small { display: block; color: var(--muted); margin-bottom: 5px; }

@media (max-width: 840px) {
  .intro-grid, .program-grid, .detail-grid { grid-template-columns: 1fr; }
  .result-top, .program-hero { flex-direction: column; }
  .compare-grid, .links-box { grid-template-columns: 1fr; }
  .section-head { flex-direction: column; }
}

@media (max-width: 520px) {
  .app-shell { padding: 14px 10px 34px; }
  .hero-card, .quiz-card, .result-main, .advice-card { border-radius: 22px; }
  .hero-actions, .nav-row { flex-direction: column; }
  .main-btn, .ghost-btn { width: 100%; }
  .option-card { padding: 14px; }
  .mini-program { align-items: flex-start; flex-wrap: wrap; }
}
`;
