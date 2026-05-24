import { useMemo, useState, useRef, useEffect } from "react";
import { Bar, BarChart, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import {
  getAnalyticsSession,
  loadAnalyticsSummary,
  signInToAnalytics,
  signOutFromAnalytics,
  trackAnalyticsEvent,
  type AnalyticsSummary,
} from "./analytics";
import { isSupabaseEnabled } from "./supabaseClient";

const COUNTRY_OPTIONS = [
  option("saudi_arabia", "السعودية", "", "🇸🇦"),
  option("jordan", "الأردن", "", "🇯🇴"),
  option("lebanon", "لبنان", "", "🇱🇧"),
  option("turkey", "تركيا", "", "🇹🇷"),
  option("egypt", "مصر", "", "🇪🇬"),
  option("syria", "سوريا", "", "🇸🇾"),
  option("palestine", "فلسطين", "", "🇵🇸"),
  option("iraq", "العراق", "", "🇮🇶"),
  option("kuwait", "الكويت", "", "🇰🇼"),
  option("qatar", "قطر", "", "🇶🇦"),
  option("uae", "الإمارات", "", "🇦🇪"),
  option("oman", "عمان", "", "🇴🇲"),
  option("bahrain", "البحرين", "", "🇧🇭"),
  option("yemen", "اليمن", "", "🇾🇪"),
  option("morocco", "المغرب", "", "🇲🇦"),
  option("algeria", "الجزائر", "", "🇩🇿"),
  option("tunisia", "تونس", "", "🇹🇳"),
  option("libya", "ليبيا", "", "🇱🇾"),
  option("sudan", "السودان", "", "🇸🇩"),
  option("mauritania", "موريتانيا", "", "🇲🇷"),
  option("somalia", "الصومال", "", "🇸🇴"),
  option("djibouti", "جيبوتي", "", "🇩🇯"),
  option("comoros", "جزر القمر", "", "🇰🇲"),
  option("afghanistan", "أفغانستان", "", "🇦🇫"),
  option("pakistan", "باكستان", "", "🇵🇰"),
  option("indonesia", "إندونيسيا", "", "🇮🇩"),
  option("malaysia", "ماليزيا", "", "🇲🇾"),
  option("europe", "أوروبا", "", "🌍"),
  option("north_america", "أمريكا الشمالية", "", "🌎"),
  option("south_america", "أمريكا الجنوبية", "", "🌎"),
  option("africa_other", "دولة إفريقية أخرى", "", "🌍"),
  option("asia_other", "دولة آسيوية أخرى", "", "🌏"),
  option("other", "بلد آخر", "", "🌐"),
];

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
    dimensions: { sharia: 100, intellectual: 90, tazkiyah: 90, reform: 80, skills: 90 },
    description:
      "مسار تكويني طويل وعميق لمن يطمح إلى التكوين العلمي الرسالي الموسوعي، مع عناية بالتأصيل والتزكية والفكر والمهارات.",
    goals: [
      "بناء طالب علم صاحب نفس طويل وهمة رسالية عبر منهجية رصينة.",
      "الجمع بين التأصيل العلمي، والتزكية، والفكر، والمهارات في مسار واحد متكامل.",
      "تهيئة نخبة موسوعية قادرة على العطاء والدعوة والإصلاح."
    ],
    outcomes: [
      "تكوين علمي ممتد وموسوعي لا يقتصر على فن واحد.",
      "صبر دراسي وانضباط طويل المدى في طلب العلم.",
      "رؤية رسالية للعلم وتوظيفه في خدمة الأمة."
    ],
    suitable: [
      "حافظ للقرآن الكريم كاملًا أو قريب جدًا من شرط البرنامج عند الإعلان.",
      "مستعد لالتزام طويل جدًا لا يقتصر على سنة أو سنتين.",
      "يريد تكوينًا علميًا واسعًا لا مجرد دورة قصيرة أو تخصص جزئي.",
    ],
    caution: [
      "تنبيه بارز: يُشترط للبرنامج في الغالب حفظ القرآن الكريم كاملاً أو قدراً كبيراً منه، تأكد من الشروط وقت الإعلان.",
      "لا تجعله خيارًا لمجرد علو الاسم؛ هو مسار طويل جدًا وشروطه عالية.",
      "إن لم تستطع الالتزام الطويل أو لم تستوفِ شرط القرآن، فابدأ بالبناء المنهجي.",
      "راجع شروط الدفعة الأخيرة عند فتح التسجيل للوقوف على التحديثات المستمرة.",
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
    officialUrl: "https://binaamanhaji.com/",
    telegramUrl: "https://t.me/BinaaManhaji",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "مرحلة تمهيدية واختبار",
    color: "#17446f",
    soft: "#e7f0f8",
    dimensions: { sharia: 95, intellectual: 70, tazkiyah: 65, reform: 40, skills: 60 },
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
    officialUrl: "https://binaamanhaji.com/",
    telegramUrl: "https://t.me/BinaaManhaji",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "مرحلة تمهيدية واختبار",
    color: "#28608c",
    soft: "#edf5fb",
    dimensions: { sharia: 70, intellectual: 40, tazkiyah: 60, reform: 30, skills: 40 },
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
    officialUrl: "https://benaafikri.com/",
    telegramUrl: "",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "بحسب إعلان الدفعة",
    color: "#5a2d82",
    soft: "#f2eafa",
    dimensions: { sharia: 50, intellectual: 100, tazkiyah: 50, reform: 60, skills: 80 },
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
    dimensions: { sharia: 40, intellectual: 60, tazkiyah: 100, reform: 30, skills: 30 },
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
    dimensions: { sharia: 100, intellectual: 50, tazkiyah: 50, reform: 40, skills: 70 },
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
    dimensions: { sharia: 40, intellectual: 60, tazkiyah: 40, reform: 100, skills: 95 },
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
      "شروط الدخول: لابد من إنهاء المواد التالية (بوصلة المصلح، مركزيات الإصلاح، شرح المنهاج من ميراث النبوة). تجهز لها قبل التسجيل.",
      "لا تجعلها بديلًا عن أصل البناء الشرعي أو الإيماني.",
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
    officialUrl: "https://jeelacademy.app/",
    telegramUrl: "https://t.me/JeelAcademySA",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "غالبًا مفتوح",
    color: "#638b2f",
    soft: "#f1f7e8",
    dimensions: { sharia: 40, intellectual: 30, tazkiyah: 90, reform: 30, skills: 40 },
    description:
      "مدخل تربوي مبكر لغرس الإيمان والقيم ومحاسن الأخلاق بأسلوب يناسب سن الطفل.",
    goals: [
      "غرس الإيمان والقيم عبر مواد شيقة (سلسلة أول مرة أصلي، قصة وعبرة).",
      "بناء بدايات أخلاقية ومهارية (الحرب على الكسل، علو الهمة، حلية الوقار).",
      "تعليم أساسيات الدين الشرعية بأسلوب مبسط (النظم الأصغر، الأربعين النووية)."
    ],
    outcomes: [
      "محبة الدين والتعلق بالنبي والصحابة (صور من حياة النبي).",
      "بدايات خلقية وسلوكية قوية (سوية المؤمن، أحاسنكم أخلاقا).",
      "ارتباط مبكر ببيئة نافعة تنمي وعيه الثقافي (أبجديات الثقافة، أيام المسلمين)."
    ],
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
    officialUrl: "https://jeelacademy.app/",
    telegramUrl: "https://t.me/JeelAcademySA",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "اختبار قبول ومتابعة خاصة",
    color: "#2f7a4f",
    soft: "#e9f6ef",
    dimensions: { sharia: 75, intellectual: 70, tazkiyah: 85, reform: 60, skills: 60 },
    description:
      "مسار خاص للجيل الصاعد في عمر 13–16، يجمع البناء الإيماني والمعرفي والتربوي مع متابعة أقرب.",
    goals: [
      "بناء إيماني عميق يعالج المرحلة المتأخرة بمواد مثل (لأنك الله، القيامة الصغرى والكبرى).",
      "تأسيس منهجي وفكري متين يقدم (التفكير الناقد، سابغات، الدعوة والداعية).",
      "توفير بيئة متابعة قريبة وبناء سلوكي (هذه أخلاقنا، عجز الثقات، مجالس التزكية)."
    ],
    outcomes: [
      "بيئة صحبة صالحة وانضباط تربوي مستمر.",
      "فهم للأساسيات الشرعية (النظم البين، البيقونية) وتاريخ العهد المكي والمدني.",
      "تدرج مبكر يؤهله للثبات والترقي لبرامج متقدمة كإثمار."
    ],
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
    officialUrl: "https://jeelacademy.app/",
    telegramUrl: "https://t.me/JeelAcademySA",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "غالبًا أيسر من جذور",
    color: "#3d8a3a",
    soft: "#ecf8ec",
    dimensions: { sharia: 70, intellectual: 65, tazkiyah: 80, reform: 50, skills: 50 },
    description:
      "مسار عام للفئة 13–16، يراعي البناء الشمولي والبيئة الآمنة دون اشتراطات المسار الخاص نفسها.",
    goals: [
      "توفير بيئة تربوية عامة تجمع الفكر بالشرع كـ(لأنك الله، الدليل إلى القرآن).",
      "تأسيس الوعي المنهجي بصورة مناسبة (اليوم النبوي، الإسلام الدين العظيم، التفكير الناقد).",
      "تخفيف عائق الانتقائية لمن يحتاج بداية أيسر مع تأصيل ممتاز."
    ],
    outcomes: [
      "ارتباط ببيئة نافعة بعيدًا عن ضغط الاختبارات الصارمة.",
      "بناء سلوكي للسن المراهق (هذه أخلاقنا، أحاسنكم أخلاقا).",
      "بناء مناسب للمراهقة المبكرة لفهم الدين بتوازن ووعي."
    ],
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
    officialUrl: "https://jeelacademy.app/",
    telegramUrl: "https://t.me/JeelAcademySA",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "اختبار قبول",
    color: "#8b5a20",
    soft: "#fff3df",
    dimensions: { sharia: 70, intellectual: 75, tazkiyah: 85, reform: 65, skills: 70 },
    description:
      "مسار شبابي تربوي ومعرفي للمرحلة 17–20، يركز على البيئة والتحصين والصحبة ومهارات التعامل مع الواقع.",
    goals: [
      "تحصين الشباب في مرحلة الجامعة بجرعات إيمانية وعلمية (سلسلة سوية المؤمن، لأنك الله).",
      "بناء وعي فكري ومنهجي قوي يجمع بين التأصيل والمهارات (كامل الصورة، ينبوع الغواية، التفكير الناقد).",
      "توفير بيئة صحبة ومتابعة لتأسيس المصلح (بوصلة المصلح، ورثة الأنبياء، تجربة تربية المصلحين)."
    ],
    outcomes: [
      "ثبات أكبر عبر بيئة تزكوية تفاعلية (عتبات ومراقي العبودية).",
      "وعي بالتاريخ ومصادر التلقي والشبهات لفهم الواقع المستجد.",
      "إلمام شرعي بالأساسيات (الفقه على المذاهب الأربعة، الدليل إلى القرآن)."
    ],
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
    officialUrl: "https://jeelacademy.app/",
    telegramUrl: "https://t.me/JeelAcademySA",
    registrationStatus: "سيتم تحديثه لاحقًا",
    selectivity: "لخريجي جذور وإشراق حصرًا",
    color: "#8a6828",
    soft: "#fff7e5",
    dimensions: { sharia: 90, intellectual: 90, tazkiyah: 90, reform: 80, skills: 85 },
    description:
      "درة التاج في أكاديمية الجيل الصاعد، لا يستقبل المبتدئين، بل نخبة المميزين من خريجي جذور وإشراق للانتقال إلى التخصص الدقيق.",
    goals: [
      "الانتقال لخريجي الأكاديمية نحو التخصص الدقيق (كمدخل لعلوم الحديث، الفقه، التفسير).",
      "بناء رؤية نقدية وفكرية قوية لمآلات الخطاب المدني وتاريخ الفكر الحديث.",
      "مساعدة الطالب في تنمية أعمال القلوب عبر إشراف علمي ومهاري وتزكوي عالٍ."
    ],
    outcomes: [
      "تخصص شرعي أو فكري رصين (كشرح المنهاج ومراجع المقاصد).",
      "نضج منهجي ومهاري للعمل الدعوي والإصلاحي (بوصلة المصلح المتقدمة).",
      "استمرار البناء التزكوي والإيماني (كمدارسة مزالق القلوب)."
    ],
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
    dimensions: { sharia: 65, intellectual: 65, tazkiyah: 95, reform: 60, skills: 50 },
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
  if (typeof value === "string") return value.trim().length > 0;
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

function getCurrentPrograms(a) {
  if (isCurrentStatus(a)) return asArray(a.knownPrograms);
  if (a.programStatus === "studying_and_graduated") return asArray(a.currentPrograms);
  return [];
}

function getGraduatedPrograms(a) {
  if (isGraduatedStatus(a)) return asArray(a.knownPrograms);
  if (a.programStatus === "studying_and_graduated") return asArray(a.graduatedPrograms);
  return [];
}

function knownPrograms(a) {
  const arr = [];
  if (a.knownPrograms) arr.push(...asArray(a.knownPrograms));
  if (a.graduatedPrograms) arr.push(...asArray(a.graduatedPrograms));
  if (a.currentPrograms) arr.push(...asArray(a.currentPrograms));
  return Array.from(new Set(arr));
}

function hasKnown(a, id) {
  return knownPrograms(a).includes(id);
}

function completedJuthurOrIshraq(a) {
  if (hasKnown(a, "ithmar")) return true;
  const grads = getGraduatedPrograms(a);
  return grads.includes("juthur") || grads.includes("ishraq");
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
    id: "country",
    title: "ما البلد؟",
    subtitle: "اختر البلد حتى تبقى الإحصائيات موحدة وقابلة للمقارنة.",
    inputType: "select",
    placeholder: "اختر البلد...",
    options: () => COUNTRY_OPTIONS,
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
    subtitle: "هذا يساعدنا أن نعرف: هل الأنسب أن تبدأ، أو تثبت فيما أنت فيه، أو تبني على برنامج سابق؟",
    condition: (a) => a.age && a.age !== "10_12",
    options: () => [
      option("studying_committed", "نعم، طالب مستمر في الدراسة ومتابِع", "ما زلت أدرس وأحاول الالتزام قدر الإمكان", "✅"),
      option("studying_struggling", "نعم، طالب متعثر أو قصّرت سابقًا", "دخلت برنامجًا لكن حصل تراكم أو فتور كبير", "🧩"),
      option("graduated_or_near", "تخرجت من برنامج أو عدة برامج، أو على وشك التخرج", "أريد أن أبني على ما درست لا أن أكرر نفس الطريق", "🎓"),
      option("studying_and_graduated", "طالب وخريج معاً", "تخرجت من برنامج وتدرس في آخر الآن", "🎓"),
      option("none", "لست طالبًا حاليًا ولم أتخرج من برنامج مؤثر", "يشمل من لم يدخل من قبل أو انسحب من تجربة سابقة", "🌱"),
    ],
  },
  {
    id: "graduatedPrograms",
    title: "ما البرامج التي تخرجت منها؟",
    subtitle: "اختر كل ما ينطبق.",
    multi: true,
    condition: (a) => a.programStatus === "studying_and_graduated",
    options: () => PROGRAM_OPTIONS,
  },
  {
    id: "currentPrograms",
    title: "ما البرامج التي تدرس فيها حالياً أو تعثرت فيها؟",
    subtitle: "اختر كل ما ينطبق.",
    multi: true,
    condition: (a) => a.programStatus === "studying_and_graduated",
    options: () => PROGRAM_OPTIONS,
  },
  {
    id: "knownPrograms",
    title: (a) => {
      if (a.programStatus === "studying_committed") return "ما البرنامج أو البرامج التي تدرسها الآن؟";
      if (a.programStatus === "studying_struggling") return "ما البرنامج أو البرامج التي تعثرت فيها أو قصّرت؟";
      if (a.programStatus === "graduated_or_near") return "ما البرنامج أو البرامج التي تخرجت منها أو أوشكت على التخرج منها؟";
      return "ما البرامج السابقة؟";
    },
    subtitle: "يمكن اختيار أكثر من برنامج.",
    multi: true,
    condition: (a) => a.programStatus && a.programStatus !== "none" && a.programStatus !== "studying_and_graduated",
    options: () => PROGRAM_OPTIONS,
  },
  {
    id: "struggleReason",
    title: (a: any) => {
      if (a.programStatus === "none") return "لماذا لم تدخل برنامجًا من قبل، أو ما سبب انسحابك إن كنت قد بدأت؟";
      return "ما السبب الأساسي للتعثر أو الانقطاع؟";
    },
    subtitle: "فهم السبب يساعدنا في توجيهك لمعالجة المشكلة، لا تكرارها.",
    condition: (a) => a.programStatus === "studying_struggling" || a.programStatus === "none",
    options: () => [
      option("time", "ضيق الوقت وحجم المواد كبير", "دراستي أو عملي يمنعني من الالتزام بكثافة", "⏳"),
      option("difficulty", "صعوبة المحتوى", "المستوى أعلى من قدرتي الحالية ويحتاج تأسيس أبسط", "🏋️"),
      option("environment", "الفتور وغياب البيئة", "أفقد حماسي بالدراسة الفردية وأحتاج صحبة أو محضن", "🥀"),
      option("wrong_fit", "البرنامج لم يناسب اهتماماتي", "لم أجد فيه ما يلبي احتياجي المباشر", "🔄"),
      option("did_not_try", "لم أجرب شيئاً بعد", "لست منقطعا، بل أبدأ للتو", "🌱"),
    ]
  },
  {
    id: "dailyTime",
    title: "أي وصف أقرب لالتزامك الواقعي خلال الفترة القادمة؟",
    subtitle: "اختر ما تستطيع الاستمرار عليه غالبًا، لا ما تتمناه في أفضل الأيام.",
    condition: (a) => a.age && a.age !== "10_12",
    options: () => [
      option("light", "20–30 دقيقة يوميًا", "التزام خفيف ثابت؛ يناسب البداية الهادئة أو المسارات الأخف", "🌤️"),
      option("standard", "45–60 دقيقة يوميًا", "التزام يومي مناسب لغالب البرامج مثل مسارات الأكاديمية والبناء المنهجي والفكري", "🕰️"),
      option("expanded", "90–120 دقيقة يوميًا", "وقت أوسع من المعتاد، مع بقاء الدراسة أو العمل حاضرًا", "⌛"),
      option("formation_project", "4–6 ساعات يوميًا تقريبًا", "طلب العلم سيكون مشروعًا يوميًا كبيرًا لسنوات، لا اندفاعًا قصيرًا", "🔥"),
    ],
  },
  {
    id: "needPattern",
    title: "أي وصف أقرب لاحتياجك الآن؟",
    subtitle: () => (<span><strong>يمكنك اختيار أكثر من خيار؛</strong> اختر الإجابات بحسب أولويتها بالنسبة لك، فالأهم ثم ما يليه.</span>),
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
    id: "prioritySignal",
    title: "أي هذه الاحتياجات التي اخترتها هو الأهم ويمثل لك أولوية قصوى؟",
    subtitle: "اختر الأهم الذي تبنى عليه خطتك حالياً.",
    condition: (a) => isAgeAtLeast15(a) && asArray(a.needPattern).length > 1,
    options: (a) => {
      const needs = asArray(a.needPattern);
      const dynamicOptions = [];
      
      if (needs.includes("structured_path")) {
        dynamicOptions.push(option("curriculum_priority", "خطة علمية واضحة ومقررات", "أريد أن يكون الأصل دراسة مرتبة وتدرجًا علميًا", "📚"));
      }
      if (needs.includes("relational_growth")) {
        dynamicOptions.push(option("environment_priority", "بيئة وصحبة ومتابعة", "أحتاج من يعينني على الثبات والالتزام", "🤝"));
      }
      if (needs.includes("certainty")) {
        dynamicOptions.push(option("certainty_priority", "الطمأنينة واليقين", "أحتاج لمسار يرمم اليقين ويركز على أعمال القلوب", "💧"));
      }
      if (needs.includes("intellectual_depth")) {
        dynamicOptions.push(option("intellectual_priority", "العمق الفكري", "الأهم عندي البناء الفكري ونقد الشبهات", "🧠"));
      }
      if (needs.includes("specialized_track")) {
        dynamicOptions.push(option("depth_priority", "عمق أو تخصص لاحق", "أميل لمسار ينتقل بي من العموم إلى التخصص", "🎯"));
      }
      if (needs.includes("women_space") && a.gender === "female") {
        dynamicOptions.push(option("women_priority", "خصوصية بيئة نسائية", "أحتاج محضنًا نسائيًا آمنًا وتفاعليًا", "🧕"));
      }
      if (needs.includes("reform_project")) {
        dynamicOptions.push(option("reform_priority", "العمل الإصلاحي والواقعي", "أريد أثرًا عمليًا مباشرًا", "🧩"));
      }
      
      // Always give an "ease" option if they might be struggling or busy
      if (a.dailyTime === "light" || a.struggleReason === "difficulty" || dynamicOptions.length === 0) {
        dynamicOptions.push(option("gentle_priority", "بداية أخف تناسب الانشغال", "أهم شيء أن أبدأ بما أستطيع إكماله", "🌤️"));
      }

      return dynamicOptions;
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
];

function cleanAnswers(answers) {
  const next = { ...answers };
  if (next.gender !== "female" && hasChoice(next.needPattern, "women_space")) {
    next.needPattern = asArray(next.needPattern).filter((value) => value !== "women_space");
  }
  if (next.gender !== "female" && next.prioritySignal === "women_priority") delete next.prioritySignal;
  if (next.programStatus === "none" || !next.programStatus) delete next.knownPrograms;
  if (!isAgeAtLeast15(next)) {
    delete next.doubtImpact;
    delete next.prioritySignal;
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
      return ["10_12", "13_14"].includes(age);
    case "juthur":
    case "ghiras":
      return ["10_12", "13_14", "15_16", "17_20"].includes(age) && !isGraduatedStatus(a) && !completedJuthurOrIshraq(a);
    case "ishraq":
      return ["15_16", "17_20", "21_22"].includes(age) && !completedJuthurOrIshraq(a) && !hasKnown(a, "ishraq");
    case "ithmar":
      return adult && completedJuthurOrIshraq(a);
    case "khadija":
      return a.gender === "female" && adult;
    case "alim":
      return adult;
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

interface ScoreItem {
  id: string;
  score: number;
  reasons: string[];
}

function addScore(scores: Record<string, ScoreItem>, id: string, points: number, reason: string) {
  if (!scores[id]) scores[id] = { id, score: 0, reasons: [] };
  scores[id].score += points;
  if (reason && points > 0 && !scores[id].reasons.includes(reason)) scores[id].reasons.push(reason);
}

function addRankedScore(scores: Record<string, ScoreItem>, fieldValue: any, choice: string, id: string, points: number, reason: string) {
  const weight = rankWeight(fieldValue, choice);
  if (!weight) return;
  const rank = choiceRank(fieldValue, choice);
  const suffix = rank > 0 ? ` — أولوية رقم ${rank + 1}` : "";
  addScore(scores, id, Math.round(points * weight), `${reason}${suffix}`);
}

function isRecommendable(scores: Record<string, ScoreItem>, id: string) {
  return Boolean(scores[id]) && scores[id].score > -900;
}

function highestScore(scores: Record<string, ScoreItem>, exceptId: string | null = null) {
  return Object.values(scores)
    .filter((item) => item.id !== exceptId && item.score > -900)
    .reduce((max, item) => Math.max(max, item.score), 0);
}

function ensurePriority(scores: Record<string, ScoreItem>, id: string, reason: string, margin = 28) {
  if (!isRecommendable(scores, id)) return;
  const target = highestScore(scores, id) + margin;
  if (scores[id].score < target) scores[id].score = target;
  if (reason && !scores[id].reasons.includes(reason)) scores[id].reasons.unshift(reason);
}

function softenScores(scores: Record<string, ScoreItem>, ids: string[], amount: number, reason?: string) {
  ids.forEach((id) => {
    if (isRecommendable(scores, id)) {
      scores[id].score -= amount;
      if (reason && !scores[id].reasons.includes(reason)) scores[id].reasons.push(reason);
    }
  });
}

function chooseBinaTrack(a) {
  if (["light"].includes(a.dailyTime) || a.prioritySignal === "gentle_priority") {
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
  const current = getCurrentPrograms(a);
  const graduated = getGraduatedPrograms(a);
  const known = knownPrograms(a);
  if (!known.length) return;

  if (current.length > 0 && a.programStatus !== "studying_struggling") {
    current.forEach((id) => addScore(scores, id, 28, "أنت تدرس هذا البرنامج الآن؛ والأصل أن نختبر هل الاستمرار فيه أولى من فتح مسار جديد"));
    Object.keys(scores).forEach((id) => {
      if (!current.includes(id) && !graduated.includes(id) && isRecommendable(scores, id)) scores[id].score -= 5;
    });
  }

  if (graduated.length > 0) {
    if (graduated.includes("bina_asasi")) {
      addScore(scores, "fikri", 20, "بعد البناء المنهجي قد يكون البناء الفكري خطوة لاحقة");
      addScore(scores, "hadith", 14, "بعد التأسيس العام يمكن الانتقال لتخصص حديثي");
      addScore(scores, "kharitat_thughur", 22, "بعد البناء قد تظهر حاجة العمل الإصلاحي والثغر");
      addScore(scores, "bard_yaqin", 8, "قد تحتاج مسارًا يقينيًا تزكويًا متممًا");
    }
    if (graduated.includes("bina_muyassar")) addScore(scores, "bina_asasi", 28, "بعد الميسّر قد يكون المسار الأساسي خطوة لاحقة لمن استطاع");
    if (graduated.includes("fikri")) {
      addScore(scores, "kharitat_thughur", 20, "بعد البناء الفكري قد يظهر سؤال العمل والثغر");
      addScore(scores, "bina_asasi", 10, "قد تحتاج تأصيلًا شرعيًا أوسع إن لم يكن موجودًا");
      addScore(scores, "hadith", 8, "يمكن فتح تخصص علمي لاحق");
    }
    if (graduated.includes("bard_yaqin")) {
      addScore(scores, "fikri", 18, "بعد تثبيت اليقين قد يناسبك تعميق المعالجة الفكرية");
      addScore(scores, "bina_asasi", 14, "يمكن الانتقال إلى تأسيس شرعي أشمل");
    }
    if (graduated.includes("juthur") || graduated.includes("ishraq")) {
      addScore(scores, "ithmar", 72, "تخرجك من جذور أو إشراق يفتح احتمال إثمار");
      ["juthur", "ghiras", "ishraq"].forEach((id) => {
        if (scores[id]) scores[id].score = -999;
      });
    }
    if (graduated.includes("hadith")) {
      addScore(scores, "bina_asasi", 12, "بعد أكاديمية الحديث قد تحتاج تأسيسًا عامًا إن لم يكن موجودًا");
      addScore(scores, "fikri", 10, "قد يناسبك تعميق فكري لاحق");
      addScore(scores, "kharitat_thughur", 10, "يمكن الانتقال لسؤال العمل الإصلاحي");
    }
    if (graduated.includes("khadija")) {
      addScore(scores, "bina_asasi", 14, "بعد مدرسة خديجة قد يكون التأسيس الشرعي المنهجي خطوة مناسبة");
      addScore(scores, "fikri", 10, "قد يناسبك تعميق فكري لاحق");
      addScore(scores, "kharitat_thughur", 12, "قد يظهر سؤال العمل والثغر بعد المحضن التربوي");
    }
    if (graduated.includes("kharitat_thughur")) addScore(scores, "bina_asasi", 6, "بعد خارطة الثغور قد تحتاج تثبيت أساس البناء إن لم يكتمل");

    // لا نعيد ترشيح برنامج تخرج منه أو أوشك على التخرج منه، لا كنتيجة أولى ولا كبديل.
    // وإذا تخرج من المسار الأساسي فلا نرجعه للميسّر لأنه أدنى منه في السعة.
    const completedToHide = new Set(graduated);
    if (graduated.includes("bina_asasi")) completedToHide.add("bina_muyassar");

    completedToHide.forEach((id) => {
      if (scores[id]) {
        scores[id].score = -999;
        scores[id].reasons = [];
      }
    });
  }
}

function applyDecisionRules(scores, a) {
  const femaleAdult = a.gender === "female" && isAgeAtLeast15(a);
  const primaryNeed = asArray(a.needPattern)[0];

  const wantsWomenSpace = femaleAdult && (primaryNeed === "women_space" || a.prioritySignal === "women_priority");
  const wantsCurriculum = primaryNeed === "structured_path" || a.prioritySignal === "curriculum_priority";
  const wantsEnvironment = primaryNeed === "relational_growth" || a.prioritySignal === "environment_priority";
  const wantsGentle = a.prioritySignal === "gentle_priority" || a.dailyTime === "light" || a.struggleReason === "difficulty";
  const wantsSpecialization = primaryNeed === "specialized_track" || a.prioritySignal === "depth_priority";
  const wantsReform = primaryNeed === "reform_project";
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

  if (wantsReform) {
    ensurePriority(scores, "kharitat_thughur", "لأن احتياجك انتقل من مجرد الدراسة إلى معرفة الثغر والعمل الإصلاحي", 38);
    addScore(scores, "bina_asasi", 14, "البناء الشرعي يبقى أساسًا مساعدًا قبل العمل");
    return;
  }

  if (theoreticalDoubt && a.doubtImpact !== "high") {
    ensurePriority(scores, "fikri", "لأن احتياجك الأقرب هو الفهم الفكري والتحليل", 36);
    return;
  }

  if (wantsSpecialization) {
    if (a.dailyTime === "formation_project") {
      ensurePriority(scores, "alim", "تخصيصك لـ 4-6 ساعات يدل على استعداد لالتزام قوي يناسب برنامج عالم بالدرجة الأولى، فهو برنامج تأصيلي واسع", 50);
      return;
    }
    if (completedJuthurOrIshraq(a)) {
      ensurePriority(scores, "ithmar", "لأنك مؤهل لمسار إثمار وتبحث عن التخصص الدقيق", 44);
      return;
    }
    ensurePriority(scores, "hadith", "أكاديمية الحديث لا تتطلب تفرغاً طويلاً كبرنامج عالم وتلبي رغبة التخصص والمتابعة (تتطلب وقتاً أيسر)", 44);
    addScore(scores, chooseBinaTrack(a), 12, "التأسيس العام قد يكون معينًا قبل التخصص أو معه");
    return;
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
    if (wantsCurriculum && a.dailyTime === "formation_project") {
      ensurePriority(scores, "alim", "بما أنك تبحث عن مسار علمي مرتب ولديك 4-6 ساعات يومياً، فبرنامج عالم يعطيك أقوى وأوسع تأصيل", 46);
      return;
    }
    const bina = chooseBinaTrack(a);
    ensurePriority(
      scores,
      bina,
      bina === "bina_muyassar" ? "لأنك تحتاج خطة علمية لكن البداية الأخف أنسب لوقتك" : "لأنك تحتاج خطة علمية مرتبة وتستطيع التزامًا أوضح",
      34
    );
  }
}

function calculateRecommendations(a: any) {
  const scores: Record<string, ScoreItem> = {};
  Object.keys(PROGRAMS).forEach((id) => {
    scores[id] = { id, score: isEligible(id, a) ? 0 : -999, reasons: [] };
  });

  if (a.age === "10_12") addScore(scores, "buthur", 120, "العمر يعطي أولوية مطلقة لمسار بذور المخصص لهذه المرحلة");
  if (a.age === "13_14" || a.age === "15_16") {
    addScore(scores, "ghiras", 36, "العمر يعطي أولوية للمسار العام في الأكاديمية");
    addScore(scores, "juthur", 34, "العمر يسمح بالمسار الخاص عند توفر الجدية والقبول");
    if (a.age === "15_16") {
      addScore(scores, "bina_muyassar", 10, "العمر فوق 15 فيمكن البدء بتأسيس شرعي ميسر");
      addScore(scores, "bina_asasi", 8, "العمر فوق 15 فيمكن دخول البناء المنهجي");
    }

    // Curriculum insights for Ghiras/Juthur (Tazkiyah, Fikri, and Foundational)
    if (a.needPattern?.includes("certainty") || a.doubtImpact) {
      addScore(scores, "juthur", 15, "مقررات مثل 'لأنك الله' و'القيامة' تبني الإيمان وتثبت اليقين في هذا العمر");
      addScore(scores, "ghiras", 12, "مقررات هذا المسار تؤسس لليقين والإيمان في هذا العمر المتقدم");
    }
    if (a.needPattern?.includes("intellectual_depth")) {
      addScore(scores, "juthur", 12, "يشتمل جذور وغراس على مواد فكرية تؤسس للوعي المبكر (مثل سابغات والتفكير الناقد)");
      addScore(scores, "ghiras", 10, "مسار غراس يقدم تأسيساً فكرياً يناسب هذه المرحلة");
    }
  }
  if (a.age === "17_20") {
    addScore(scores, "ishraq", 18, "العمر مناسب لأكاديمية الجيل الصاعد - إشراق");
    addScore(scores, "bina_asasi", 12, "العمر فوق 15 ويناسب البناء الشرعي المنهجي");
    addScore(scores, "bina_muyassar", 10, "العمر فوق 15 مع احتمال الحاجة لبداية أخف");

    // Curriculum insights for Ishraq (Fikri, Reform, Methodology, Complete Intellectual Picture)
    if (a.needPattern?.includes("intellectual_depth") || a.doubtImpact === "theoretical") {
      addScore(scores, "ishraq", 20, "برنامج إشراق يحتوي على جرعة فكرية ومنهجية قوية (مثل كامل الصورة وينبوع الغواية والتفكير الناقد) تناسب مرحلتك");
    }
    if (a.needPattern?.includes("reform_project")) {
      addScore(scores, "ishraq", 20, "يتميز إشراق بمواد منهجية وإصلاحية تبني وعي المصلح (مثل بوصلة المصلح وتجربة تربية المصلحين)");
    }
    if (a.needPattern?.includes("certainty") || a.doubtImpact === "high") {
      addScore(scores, "ishraq", 15, "في إشراق اهتمام خاص بالبناء الإيماني ومعالجة الشبهات يناسب من يبحث عن اليقين والرقائق");
    }
  }
  if (a.age === "21_22" || a.age === "23_plus") {
    addScore(scores, "bina_asasi", 16, "العمر مناسب لبرامج التأسيس للكبار");
    addScore(scores, "bina_muyassar", 14, "يمكن اختيار النسخة الأخف بحسب الوقت");
    addScore(scores, "fikri", 8, "العمر مناسب للمعالجة الفكرية الأوسع");
    addScore(scores, "hadith", 8, "العمر مناسب للتخصص العلمي");
  }

  // --- Impact of new adaptive questions ---
  if (a.struggleReason === "time") {
    addScore(scores, "bina_muyassar", 40, "ضيق الوقت يرجح المسارات والمقررات الأخف لتجنب الانقطاع");
    addScore(scores, "bard_yaqin", 20, "المسار التزكوي قد يكون أنسب لضيق الوقت");
  } else if (a.struggleReason === "difficulty") {
    addScore(scores, "bina_muyassar", 45, "صعوبة المواد السابقة تعالج بمسار مصمم خصيصاً للتيسير والتأسيس الهادئ");
    addScore(scores, "bard_yaqin", 25, "مسار يركز على القلب واليقين أرفق من الدسم المعرفي");
    addScore(scores, "ghiras", 20, "مسار عام وغير ضاغط");
  } else if (a.struggleReason === "environment") {
    addScore(scores, "ishraq", 45, "غياب البيئة يعالج بمحضن شبابي تفاعلي");
    addScore(scores, "khadija", 45, "المحضن النسائي التفاعلي يعالج مشكلة غياب البيئة بقوة");
    addScore(scores, "juthur", 30, "يوفر متابعة وبيئة أقرب من التعليم الفردي الجامد");
  } else if (a.struggleReason === "wrong_fit") {
    addScore(scores, "kharitat_thughur", 30, "استكشاف الثغور قد يساعدك في تحديد ما يناسبك فعلياً قبل توريط نفسك في برنامج طويل");
    addScore(scores, "fikri", 15, "قد يكون البناء الفكري أنسب لميولك من التأسيس الشرعي البحت");
  }
  // ----------------------------------------
  
  if (a.forWhom === "child" && isYouthAcademyAge(a)) {
    addScore(scores, "buthur", 10, "البحث لابن أو ابنة يرجح البيئة العمرية المناسبة");
    addScore(scores, "ghiras", 14, "البحث لابن أو ابنة يرجح بيئة تربوية آمنة");
    addScore(scores, "juthur", 10, "يمكن النظر للمسار الخاص إذا كان الابن جادًا");
    addScore(scores, "ishraq", 10, "البيئة الشبابية التربوية قد تناسب هذه المرحلة");
  }

  if (a.dailyTime === "light") {
    addScore(scores, "bina_muyassar", 28, "الالتزام الخفيف يرجّح البداية الميسرة");
    addScore(scores, "bard_yaqin", 16, "الالتزام الخفيف قد يناسب مسارًا أقرب لليقين والتزكية");
    softenScores(scores, ["bina_asasi", "fikri", "hadith", "ithmar", "alim", "kharitat_thughur"], 80, "تنبيه: حجم هذا البرنامج ومتطلباته قد تفوق مساحة الوقت المتاح لك حالياً"); 
  }
  if (a.dailyTime === "standard") {
    addScore(scores, "bina_asasi", 22, "الالتزام المتوسط المنتظم مناسب للبناء المنهجي");
    addScore(scores, "fikri", 14, "الالتزام المتوسط مناسب للبناء الفكري");
    addScore(scores, "ishraq", 14, "الالتزام المتوسط مناسب لبيئة إشراق");
    addScore(scores, "juthur", 10, "الالتزام المتوسط مناسب لمسارات الأكاديمية الخاصة");
    addScore(scores, "bard_yaqin", 10, "برد اليقين يبقى مناسبًا للالتزام المتوسط");
  }
  if (a.dailyTime === "expanded") {
    addScore(scores, "bina_asasi", 24, "لديك سعة نسبية للمسار الأساسي");
    addScore(scores, "fikri", 18, "السعة النسبية تناسب المسار الفكري الأطول");
    addScore(scores, "hadith", 16, "السعة النسبية تناسب التخصص الحديثي");
    addScore(scores, "ithmar", 16, "السعة النسبية تناسب التخصص الدقيق إذا توفرت الأهلية");
  }
  if (a.dailyTime === "formation_project") {
    addScore(scores, "bina_asasi", 18, "الاستعداد العالي يساعد في المسارات الطويلة");
    addScore(scores, "fikri", 16, "الاستعداد العالي يناسب العمق الفكري");
    addScore(scores, "hadith", 14, "الاستعداد العالي يناسب التخصص العلمي");
    addScore(scores, "ithmar", 18, "الاستعداد العالي يناسب إثمار إذا توفرت الأهلية");
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
  if (a.prioritySignal === "certainty_priority") {
    addScore(scores, "bard_yaqin", 45, "عند تزاحم الخيارات، شددت على أهمية اليقين والطمأنينة");
  }
  if (a.prioritySignal === "intellectual_priority") {
    addScore(scores, "fikri", 45, "عند تزاحم الخيارات، جعلت الأولوية للعمق الفكري");
    addScore(scores, "ishraq", 20, "إشراق يوفر جرعة فكرية ممتازة");
  }
  if (a.prioritySignal === "reform_priority") {
    addScore(scores, "kharitat_thughur", 45, "عند تزاحم الخيارات، اخترت العمل الإصلاحي والمشاريع");
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

  // طبقة تاريخ الطالب قبل القواعد الحاسمة حتى تؤثر على البدائل وعلى قرار الاستمرار/الانسحاب.
  applyStudentHistoryLogic(scores, a);

  Object.keys(scores).forEach((id) => {
    if (!isEligible(id, a)) scores[id].score = -999;
  });

  applyDecisionRules(scores, a);

  const sorted = Object.values(scores)
    .filter((item) => item.score > -100)
    .sort((x, y) => y.score - x.score)
    .map((item) => {
      const prog = PROGRAMS[item.id as keyof typeof PROGRAMS];
      return { ...prog, score: Math.max(0, item.score), reasons: item.reasons.slice(0, 5) };
    });

  const list = (sorted.length
    ? sorted
    : [PROGRAMS.bina_muyassar, PROGRAMS.bina_asasi].map((program) => ({ ...program, score: 50, reasons: ["اختيار احتياطي آمن عند نقص المعطيات"] }))
  ).map((item) => {
    let ageCaution = null;
    if (item.id === "buthur" && ["13_14"].includes(a.age)) {
      ageCaution = "تنبيه: هذا المسار مخصص عادة للفئة 10-12 سنة. قد تكون بيئته غير مناسبة تماماً لمرحلتك.";
    } else if ((item.id === "juthur" || item.id === "ghiras") && ["17_20"].includes(a.age)) {
      ageCaution = "تنبيه: هذا المسار مخصص لليافعين. قد لا يكون مناسباً لسنك وتطلعاتك.";
    } else if ((item.id === "juthur" || item.id === "ghiras") && ["10_12"].includes(a.age)) {
      ageCaution = "تنبيه: هذا المسار قد يكون متقدماً بعض الشيء على مرحلتك العمرية الحالية.";
    } else if (item.id === "ishraq" && ["21_22", "23_plus"].includes(a.age)) {
      ageCaution = "تنبيه: صممت المرحلة لمن هم ضمن 17-20 سنة. الأفضل اختيار برنامج بمقاس مرحلتك إلا إذا كنت تبحث عن بيئة الشباب تحديداً.";
    } else if (item.id === "alim" && a.age === "23_plus") {
      ageCaution = "تنبيه: تم إدراج البرنامج لملائمته العالية لإجاباتك، لكن هذا البرنامج يقبل الأعمار الأصغر في الأصل (مع مرونة يسيرة أحياناً)، فخذ ذلك بعين الاعتبار.";
    }
    
    if (ageCaution) {
      return { ...item, caution: [ageCaution, ...(item.caution || [])] };
    }
    return item;
  });

  // Profile Calculation for Chart
  const profile = { sharia: 20, intellectual: 20, tazkiyah: 20, reform: 20, skills: 20 };
  const needs = asArray(a.needPattern);

  if (needs.includes("structured_path")) profile.sharia += 50;
  if (needs.includes("intellectual_depth")) profile.intellectual += 50;
  if (needs.includes("certainty")) profile.tazkiyah += 40;
  if (needs.includes("relational_growth")) profile.tazkiyah += 40;
  if (needs.includes("reform_project")) {
    profile.reform += 50;
    profile.skills += 40;
  }
  if (needs.includes("specialized_track")) profile.sharia += 30;

  if (a.doubtImpact === "high") profile.tazkiyah += 20;
  if (a.doubtImpact === "theoretical") profile.intellectual += 20;
  if (a.age === "13_14" || a.age === "15_16") profile.skills += 20;

  // Normalize to max 100
  ["sharia", "intellectual", "tazkiyah", "reform", "skills"].forEach(k => {
    profile[k] = Math.min(100, profile[k]);
  });

  const advice = buildContextAdvice(a, list);
  if (advice && (advice.type === "continue" || advice.type === "caution")) {
    const pIdx = list.findIndex(p => p.id === advice.program.id);
    if (pIdx > 0) {
      const p = list.splice(pIdx, 1)[0];
      list.unshift(p);
    }
  }

  return { list, profile, advice };
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

  if (isCurrentStatus(a)) {
    if (!bestKnown) return null;

    if (primary?.id === bestKnown.id || ratio >= 0.74) {
      return {
        type: "continue",
        title: "الأقرب لك الآن: ركّز في برنامجك الحالي",
        program: bestKnown,
        message:
          "إجاباتك تشير إلى أن البرنامج الذي تدرسه الآن هو الأنسب لك فعلياً. الانقطاع والبحث عن 'بداية جديدة' في برنامج آخر غالباً ما يكون هروباً من عقبات طبيعية ستواجهك في أي طريق آخر.",
        points: [
          "تذكر أن 'بداية برنامج جديد' أسهل دائماً من 'إكمال برنامج قديم'، لكن العبرة بالنهايات.",
          "إذا كان عندك تعثر، ضع خطة استدراك لمدة أسبوعين فقط لتقليل الفجوة، ولا تحاول تعويض أشهر في يوم واحد.",
          "ليس الهدف هو جمع الشهادات أو البرامج، بل تكوين النفس في مسار واحد مستقر.",
          "بعد أن تستقر في برنامجك وتتم مرحلة منه، يمكنك التفكير في برنامج 'متمم' لا برنامج 'بديل'.",
        ],
      };
    }

    if (ratio < 0.55 && primary) {
      return {
        type: "switch",
        title: "قد يكون الأنسب أن تعيد النظر في مسارك الحالي",
        program: primary,
        currentProgram: bestKnown,
        message:
          "يبدو أن طبيعة تطلعك واحتياجك الحالي تميل بوضوح لمسار آخر غير الذي تدرسه الآن. راجع بصدق: هل المشكلة في كسل مؤقت (هنا ننصح بالاستمرار) أم أن المادة العلمية ومستوى الضغط لا يناسبك نهائياً؟",
        points: [
          "إذا كان البرنامج الحالي يسبب لك ضغطاً نفسياً يعيقك عن أصل الاستفادة، فالانتقال لمسار أرفق (مثل الميسر) أولى من الانقطاع الكلي.",
          "تأكد من إغلاق التزاماتك في البرنامج الحالي بشكل لائق قبل الانتقال لغيره.",
          "لا تجعل هذا الاختبار 'رخصة' سهلة للانسحاب؛ استشر مشرفك أو صحابتك في البرنامج قبل القرار النهائي.",
        ],
      };
    }

    return {
      type: "caution",
      title: "برنامجك الحالي له صلة، لكن انتبه من التشتت",
      program: bestKnown,
      alternative: primary,
      message:
        "برنامجك الحالي ليس بعيدًا عن احتياجك، وظهر أيضًا برنامج آخر قريب. في هذه الحالة لا تجعل البرنامج الجديد رغبة في بداية جديدة فقط.",
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
      title: "ابنِ على ما أنجزته ولا تكرر الطريق نفسه",
      program: primary,
      message:
        "بما أنك تخرجت من برنامج أو أوشكت على التخرج، فالأولى أن تبحث عن خطوة تضيف لك معنى جديدًا: تعميقًا، تخصصًا، عملًا إصلاحيًا، أو تأسيسًا في جانب لم يكتمل.",
      points: [
        "لا تكرر البرنامج نفسه غالبًا إلا لسبب واضح.",
        "اسأل: ما الثمرة التالية بعد البرنامج الذي أنهيته؟",
        "إن كنت خريج جذور أو إشراق فقد يكون إثمار خيارًا متقدمًا عند تحقق شروطه.",
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

function AdviceCard({ advice, onOpen }: any) {
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

      {advice.currentProgram && advice.type === "switch" && (
        <div className="advice-compare-line">
          تذكر، برنامجك الحالي هو: <strong>{advice.currentProgram.name}</strong>
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
      <div className="compare-title">الفرق بين البناء المنهجي - المسار الأساسي والمسار الميسّر</div>
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

function ProgramMini({ program, index, onOpen, primaryScore }: any) {
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

function DetailSection({ title, items, icon, colorClass = "default" }: any) {
  if (!items?.length) return null;
  return (
    <div className={`detail-section ds-${colorClass}`}>
      <h3><span className="ds-icon">{icon}</span> {title}</h3>
      <ul>
        {items.map((item: any, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ProgramDetail({ program, onBack, onHome }: any) {
  if (!program) return null;
  return (
    <section className="program-detail">
      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <button className="ghost-btn" type="button" onClick={onBack}>العودة</button>
        <button className="ghost-btn home-btn-fix" type="button" onClick={onHome}>الرئيسية</button>
      </div>
      <div className="program-hero" style={{ background: `linear-gradient(135deg, ${program.soft}, #fff)` }}>
        <span className="program-hero-icon">{program.icon}</span>
        <div>
          <small>{program.badge}</small>
          <h1>{program.name}</h1>
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
      <DetailSection title="أهداف البرنامج" items={program.goals} icon="🎯" colorClass="blue" />
      <DetailSection title="ماذا ستكتسب؟" items={program.outcomes} icon="✨" colorClass="green" />
      <DetailSection title="يناسبك إذا…" items={program.suitable} icon="✅" colorClass="amber" />
      <DetailSection title="انتبه قبل التسجيل…" items={program.caution} icon="⚠️" colorClass="rose" />
      <div className="links-box">
        <div>
          <small>رابط الموقع الرسمي</small>
          <strong>
            {program.officialUrl ? (
               <a href={program.officialUrl} target="_blank" rel="noopener noreferrer" className="program-link">{program.officialUrl.replace('https://', '')}</a>
            ) : "سيُحدّث لاحقًا"}
          </strong>
        </div>
        <div>
          <small>رابط قناة تلجرام</small>
          <strong>
            {program.telegramUrl ? (
              <a href={program.telegramUrl} target="_blank" rel="noopener noreferrer" className="program-link">{program.telegramUrl.replace('https://t.me/', '')}</a>
            ) : "سيُحدّث لاحقًا"}
          </strong>
        </div>
      </div>
    </section>
  );
}

function ComparisonTable({ onOpen, onBack }: any) {
  const list = Object.values(PROGRAMS);
  return (
    <section className="comparison-page">
      <div className="section-head">
        <button className="ghost-btn" type="button" onClick={onBack}>العودة للرئيسية</button>
        <div><small>مقارنة عامة</small><h2>مقارنة مختصرة بين البرامج</h2><p>هذه المقارنة للاطلاع العام، أما الترشيح الأدق فابدأ اختبار الاختيار.</p></div>
      </div>
      <div className="comparison-table-wrap" style={{ overflowX: 'auto', borderRadius: '24px', padding: '16px', border: '1px solid var(--border)' }}>
        <table className="comparison-table" style={{ width: '100%', minWidth: '800px', textAlign: 'right', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>البرنامج</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>الفئة</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>المدة</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>طبيعة القبول</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>التكلفة</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>الوسيلة</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>التسجيل</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((program) => (
              <tr key={program.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}><strong>{program.icon} {program.name}</strong><br/><small style={{color:'var(--muted)'}}>{program.badge}</small></td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{program.audience}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{program.duration}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{program.selectivity}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{program.cost}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{program.medium}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{program.registrationStatus}</td>
                <td style={{ padding: '12px' }}><button className="table-link ghost-btn" style={{ padding: '6px 12px', fontSize: '13px' }} type="button" onClick={() => onOpen(program.id)}>تفاصيل</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HomeView({ onStart, onPrograms, onCompare, onCompareDynamic }: any) {
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
            <button className="ghost-btn hero-btn" type="button" onClick={onCompareDynamic}>مقارنة مخصصة</button>
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

function ProgramDirectory({ onOpen, onBack }: any) {
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

function DynamicComparison({ onOpen, onBack }: any) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const list = Object.values(PROGRAMS);

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const selectedPrograms = selectedIds.map(id => PROGRAMS[id as keyof typeof PROGRAMS]).filter(Boolean);

  const chartData = [
    { subject: "تأصيل شرعي" },
    { subject: "الوعي" },
    { subject: "تزكية" },
    { subject: "عمل إصلاحي" },
    { subject: "المهارات" },
  ].map((metric) => {
    const dataRow: any = { subject: metric.subject };
    selectedPrograms.forEach((p, i) => {
      const pData = p.dimensions as any;
      let val = 50;
      if (pData) {
        if (metric.subject === "تأصيل شرعي") val = pData.sharia || 50;
        if (metric.subject === "الوعي") val = pData.intellectual || 50;
        if (metric.subject === "تزكية") val = pData.tazkiyah || 50;
        if (metric.subject === "عمل إصلاحي") val = pData.reform || 50;
        if (metric.subject === "المهارات") val = pData.skills || 50;
      }
      dataRow[`P${i}`] = val;
    });
    return dataRow;
  });

  return (
    <motion.section 
      className="comparison-page"
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
    >
      <div className="section-head">
        <button className="ghost-btn" type="button" onClick={onBack}>العودة للرئيسية</button>
        <div><small>مقارنة مخصصة</small><h2>مقارنة بين البرامج</h2><p>اختر البرامج التي تريد المقارنة بينها بشكل مباشر.</p></div>
      </div>
      
      <div style={{ position: 'relative', marginBottom: '24px', zIndex: 50 }}>
        <button 
          className="ghost-btn dropdown-trigger" 
          style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--paper)' }}
          onClick={() => setDropdownOpen(!dropdownOpen)}
          type="button"
        >
          <span>{selectedIds.length > 0 ? `تم تحديد ${selectedIds.length} برامج` : 'اختر البرامج للمقارنة...'}</span>
          <span>▼</span>
        </button>
        
        {dropdownOpen && (
          <div className="dropdown-menu" style={{ position: 'absolute', top: '100%', right: 0, left: 0, background: 'var(--paper)', border: '1px solid var(--border)', borderRadius: '16px', padding: '16px', marginTop: '8px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
            {list.map((prog) => {
              const isSelected = selectedIds.includes(prog.id);
              return (
                <button 
                  key={prog.id} 
                  onClick={() => toggleSelect(prog.id)} 
                  className={`picker-btn ${isSelected ? 'selected' : ''}`} 
                  style={{ justifyContent: 'flex-start', overflow: 'hidden', textOverflow: 'ellipsis' }}
                  type="button"
                  title={prog.name}
                >
                  <div className={`checkbox-icon ${isSelected ? 'checked' : ''}`} style={{ 
                    width: '18px', height: '18px', borderRadius: '4px', border: isSelected ? '0' : '1px solid var(--border)', 
                    backgroundColor: isSelected ? 'var(--bg)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', marginLeft: '8px', flexShrink: 0 
                  }}>
                    {isSelected && <span style={{ color: 'var(--green)', fontSize: '12px' }}>✓</span>}
                  </div>
                  <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{prog.icon} {prog.name}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      <div className="creative-compare-board" style={{ gap: '16px', alignItems: 'stretch' }}>
        {selectedPrograms.length > 0 ? (
          selectedPrograms.map((p) => (
            <motion.div key={p.id} className="cc-card" layoutId={`cc-card-${p.id}`} initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
               <h3>{p.icon} {p.name}</h3>
               <small>{p.badge}</small>
               <p>{p.description}</p>
               <div className="cc-details">
                  <div><span>المدة</span> <strong>{p.duration}</strong></div>
                  <div><span>الفئة</span> <strong>{p.audience}</strong></div>
                  <div><span>التكلفة</span> <strong>{p.cost}</strong></div>
               </div>
               <button className="ghost-btn" style={{marginTop: 'auto', width: "100%"}} onClick={() => onOpen(p.id)}>تفاصيل البرنامج</button>
            </motion.div>
          ))
        ) : (
          <div className="cc-card empty-card" style={{ width: '100%' }}>
             <span>👆</span>
             <p>اختر البرامج من القائمة المنسدلة أعلاه</p>
          </div>
        )}
      </div>

      {selectedPrograms.length > 1 && (
        <motion.div className="chart-container cc-radar-box" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             <div className="chart-header">
                <h3>تحليل توافق الأبعاد</h3>
                <p>مقارنة البناء العلمي، الوعي، والمهاري بين البرامج المحددة</p>
             </div>
             <div className="chart-visual">
                <ResponsiveContainer width="100%" height={320}>
                  <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--ink)", fontSize: 13, fontWeight: 700 }} />
                    {selectedPrograms.map((p, i) => (
                      <Radar key={p.id} name={p.name} dataKey={`P${i}`} stroke={p.color} fill={p.color} fillOpacity={0.25} strokeWidth={2} />
                    ))}
                  </RadarChart>
                </ResponsiveContainer>
             </div>
             <div className="chart-legend">
                {selectedPrograms.map((p) => (
                  <div key={p.id} className="legend-item"><div className="legend-dot" style={{ backgroundColor: p.color }} /> {p.name}</div>
                ))}
             </div>
        </motion.div>
      )}
    </motion.section>
  );
}

function DimensionChart({ profile, program }: any) {
  const data = [
    { subject: "تأصيل شرعي", A: profile.sharia, B: program.dimensions?.sharia || 50, fullMark: 100 },
    { subject: "الوعي", A: profile.intellectual, B: program.dimensions?.intellectual || 50, fullMark: 100 },
    { subject: "تزكية", A: profile.tazkiyah, B: program.dimensions?.tazkiyah || 50, fullMark: 100 },
    { subject: "عمل إصلاحي", A: profile.reform, B: program.dimensions?.reform || 50, fullMark: 100 },
    { subject: "المهارات والأدوات", A: profile.skills, B: program.dimensions?.skills || 50, fullMark: 100 },
  ];

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h3>تحليل التوافق</h3>
        <p>مدى ملاءمة البرنامج لاحتياجك الحالي في ٥ أبعاد</p>
      </div>
      <div className="chart-visual">
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="var(--border)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--ink)", fontSize: 13, fontWeight: 700 }} />
            <Radar
              name="احتياجك"
              dataKey="A"
              stroke="#f97316"
              fill="#f97316"
              fillOpacity={0.3}
              strokeWidth={2}
            />
            <Radar
              name={program.name}
              dataKey="B"
              stroke={program.color}
              fill={program.color}
              fillOpacity={0.25}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="chart-legend">
        <div className="legend-item"><span className="legend-dot user-dot" /> احتياجك</div>
        <div className="legend-item"><span className="legend-dot program-dot" style={{ background: program.color }} /> تركيز البرنامج</div>
      </div>
    </div>
  );
}

function ResultView({ result, answers, onOpen, onRestart, onHome }: any) {
  const list = result.list;
  const primary = list[0];
  const alternatives = list.slice(1, 4);
  const showBinaComparison = isBinaProgram(primary);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleShare = async () => {
    const text = `أتممت اختبار اختيار البرنامج الأنسب من برامج الشيخ أحمد السيد، والنتيجة كانت: ${primary.name}.\nبرنامج يساعدك في ترتيب مسارك العلمي والتربوي. جربه من هنا:`;
    const url = window.location.href;

    if (navigator.share) {
      try {
        await navigator.share({ title: "دليل اختيار البرامج", text, url });
      } catch (e) {
        // Fallback or cancelled
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${text}\n${url}`);
        alert("تم نسخ رابط النتيجة إلى الحافظة");
      } catch (e) {
        alert("عذراً، لم تنجح عملية المشاركة.");
      }
    }
  };

  const handleDownloadPDF = async () => {
    if (window.top !== window.self) {
      alert("عذراً، نافذة الطباعة لا تفتح داخل هذا العرض. يرجى فتح التطبيق في نافذة جديدة عبر الزر الموجود أعلى يمين الشاشة، ثم جرب الطباعة مرة أخرى.");
      return;
    }
    window.print();
  };

  return (
    <section className="result-wrap" ref={resultRef} dir="rtl">
      <div className="share-top" data-html2canvas-ignore="true" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="share-btn home-btn-fix2" type="button" onClick={onHome}>
          <span>🏠</span> الرئيسية
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="share-btn" type="button" onClick={handleDownloadPDF}>
            <span>📄</span> حفظ كملف PDF
          </button>
          <button className="share-btn" type="button" onClick={handleShare}>
            <span>🔗</span> مشاركة الرابط
          </button>
        </div>
      </div>

      <AdviceCard advice={result.advice} onOpen={onOpen} />

      <div className="result-main" style={{ borderColor: `${primary.color}55` }}>
        <div className="result-top" style={{ background: `linear-gradient(135deg, ${primary.soft}, #ffffff)` }}>
          <span className="result-icon">{primary.icon}</span>
          <div>
            <div className="result-label">البرنامج الأقرب لاحتياجك الآن</div>
            <h2>{primary.name}</h2>
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

          <DimensionChart profile={result.profile} program={primary} />

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

          <div className="result-actions" data-html2canvas-ignore="true">
            <button className="main-btn" type="button" onClick={() => onOpen(primary.id)}>افتح تفاصيل البرنامج</button>
            <button className="ghost-btn restart-btn-fix" type="button" onClick={onRestart}>
              <span style={{ fontFamily: '"Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"' }}>🔄</span> إعــادة الاختبــار
            </button>
          </div>
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

      <div className="notice-box disclaimer-box" style={{ background: '#f8fafc', borderColor: '#cbd5e1' }}>
        <h3 style={{ color: 'var(--ink)' }}>تنبيه ختامي</h3>
        <p style={{ margin: 0, color: 'var(--muted)', fontSize: '15px' }}>
          هذه النتيجة هي بناءً على الإجابات التي قمت بتقديمها مع محاولة البرنامج للموائمة بينها وبين البرامج الإلكترونية بحسب أهدافها وما تتطلبه وتُحققه بإذن الله. لكن يبقى القرار تتدخل فيه عوامل أخرى (نفسية، ذاتية، أو اجتماعية). لذلك اجعل هذا الاختبار مؤشراً يساعدك، وحاول أن تطّلع على البرامج تفصيلياً وعلى تجارب الطلاب الخريجين منها. وإن تيسّرت لك الاستشارة لأحد الملمين بهذه البرامج فهذا خير. وفقكم الله وفتح عليكم.
        </p>
      </div>
      <AnswersSummary answers={answers} />
    </section>
  );
}

function AnswersSummary({ answers }: any) {
  return (
    <div className="print-only answers-summary" style={{ marginTop: '30px', padding: '24px', background: 'var(--paper)', borderRadius: '24px', border: '1px solid var(--border)' }}>
      <h3 style={{ marginBottom: '16px', fontSize: '20px', color: 'var(--ink)' }}>إجاباتك (مدخلات التحليل):</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {QUESTIONS.map((q) => {
          const ans = answers[q.id];
          if (!hasAnswer(ans)) return null;
          const title = typeof q.title === 'function' ? q.title(answers) : q.title;
          const opts = typeof q.options === 'function' ? q.options(answers) : [];
          const chosenOpts = (q as any).inputType === "text"
            ? String(ans).trim()
            : asArray(ans)
              .map((v) => opts.find((o: any) => o.value === v)?.title || v)
              .join("، ");
          
          return (
            <li key={q.id} style={{ marginBottom: '14px', borderBottom: '1px dashed var(--border)', paddingBottom: '8px' }}>
              <strong style={{ display: 'block', color: 'var(--ink)', fontSize: '15px' }}>{title}</strong>
              <span style={{ color: 'var(--green)', fontSize: '14px', fontWeight: 600 }}>{chosenOpts}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function answerLabel(question: any, value: any, answers: any) {
  if (value == null) return "";
  if (!question?.options) return Array.isArray(value) ? value.join(", ") : String(value).trim();

  const options = question.options(answers).filter(Boolean);
  const labelFor = (item: any) => options.find((opt: any) => opt.value === item)?.title || String(item);
  return Array.isArray(value) ? value.map(labelFor).join("، ") : labelFor(value);
}

function buildCompletionAnalytics(answers: any, result: any, qs: any[]) {
  const readableAnswers = qs
    .filter((question) => hasAnswer(answers[question.id]))
    .map((question) => ({
      id: question.id,
      title: questionTitle(question, answers),
      value: answers[question.id],
      label: answerLabel(question, answers[question.id], answers),
    }));

  return {
    rawAnswers: answers,
    readableAnswers,
    recommendations: result.list.slice(0, 5).map((program: any) => ({
      id: program.id,
      name: program.name,
      score: program.score,
      badge: program.badge,
    })),
    profile: result.profile,
    context: {
      referrer: document.referrer,
      language: navigator.language,
      userAgent: navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
    },
  };
}

function analyticsAnswerValue(event: any, id: string) {
  const answer = event.readableAnswers?.find((item: any) => item.id === id);
  if (answer?.label) return answer.label;
  const value = event.rawAnswers?.[id];
  return Array.isArray(value) ? value.join("، ") : value;
}

function countBy(events: any[], getLabel: (event: any) => any) {
  const counts = new Map<string, number>();
  events.forEach((event) => {
    const label = getLabel(event);
    if (!label) return;
    counts.set(String(label), (counts.get(String(label)) || 0) + 1);
  });

  return [...counts.entries()]
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function AnalyticsBarSection({ title, description, data }: any) {
  const chartData = data.slice(0, 10);
  return (
    <div className="analytics-chart-card">
      <div className="chart-header">
        <h3>{title}</h3>
        {description && <p>{description}</p>}
      </div>
      {chartData.length ? (
        <>
          <div className="analytics-chart">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={chartData} layout="vertical" margin={{ top: 8, right: 18, bottom: 8, left: 18 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "var(--muted)", fontSize: 12 }} />
                <YAxis dataKey="name" type="category" width={115} tick={{ fill: "var(--ink)", fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#176b54" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="analytics-list">
            {chartData.map((item: any) => (
              <div key={item.name}>
                <span>{item.name}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="analytics-empty">لا توجد بيانات كافية بعد.</p>
      )}
    </div>
  );
}

function AnalyticsDashboard({ onBack }: any) {
  const [email, setEmail] = useState("");
  const [authMessage, setAuthMessage] = useState("");
  const [authorized, setAuthorized] = useState(!isSupabaseEnabled);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    if (!authorized) return;
    setLoading(true);
    setSummary(await loadAnalyticsSummary());
    setLoading(false);
  }

  useEffect(() => {
    getAnalyticsSession().then((session) => {
      if (session) setAuthorized(true);
      else if (isSupabaseEnabled) setLoading(false);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [authorized]);

  async function unlock(event: any) {
    event.preventDefault();
    setAuthMessage("");
    try {
      await signInToAnalytics(email.trim());
      setAuthMessage("تم إرسال رابط الدخول إلى بريدك. افتحه من نفس الجهاز أو المتصفح.");
    } catch (error) {
      setAuthMessage(`لم نستطع إرسال رابط الدخول: ${error instanceof Error ? error.message : "خطأ غير معروف"}`);
    }
  }

  if (!authorized) {
    return (
      <section className="analytics-page">
        <div className="analytics-login">
          <small>لوحة خاصة</small>
          <h2>تسجيل دخول الإحصائيات</h2>
          <form onSubmit={unlock}>
            <input
              className="text-answer-input"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="بريدك المسموح في Supabase"
              required
            />
            <button className="main-btn" type="submit">أرسل رابط الدخول</button>
          </form>
          {authMessage && <p className="analytics-auth-message">{authMessage}</p>}
          <button className="ghost-btn" type="button" onClick={onBack}>العودة للرئيسية</button>
        </div>
      </section>
    );
  }

  const cards = [
    { label: "عدد الداخلين إلى الموقع", value: summary?.visitors ?? 0 },
    { label: "دخلوا الاختبار", value: summary?.quizStarted ?? 0 },
    { label: "أتموا الاختبار", value: summary?.quizCompleted ?? 0 },
    { label: "دخلوا ولم يتموا", value: summary?.quizAbandoned ?? 0 },
  ];

  const completedEvents = (summary?.events || []).filter((event) => event.event === "quiz_completed");
  const countryData = countBy(completedEvents, (event) => analyticsAnswerValue(event, "country"));
  const ageData = countBy(completedEvents, (event) => analyticsAnswerValue(event, "age"));
  const genderData = countBy(completedEvents, (event) => analyticsAnswerValue(event, "gender"));
  const programData = countBy(completedEvents, (event) => event.recommendations?.[0]?.name || event.resultProgramId);
  const sourceData = countBy(completedEvents, (event) => {
    try {
      return event.context?.referrer ? new URL(event.context.referrer).hostname : "دخول مباشر";
    } catch {
      return "دخول مباشر";
    }
  });

  return (
    <section className="analytics-page">
      <div className="section-head">
        <button className="ghost-btn" type="button" onClick={onBack}>العودة للرئيسية</button>
        <div>
          <small>أداة قياس</small>
          <h2>لوحة متابعة الاختبار</h2>
          <p>هذه اللوحة تعرض الزيارات، وبدايات الاختبار، والإتمام، وعدد من بدأوا ولم يصلوا للنتيجة.</p>
        </div>
      </div>

      <div className="analytics-grid">
        {cards.map((card) => (
          <div className="analytics-card" key={card.label}>
            <span>{card.label}</span>
            <strong>{loading ? "..." : card.value}</strong>
          </div>
        ))}
      </div>

      <div className="analytics-panel">
        <div>
          <small>نسبة إتمام الاختبار</small>
          <strong>{loading ? "..." : `${summary?.completionRate ?? 0}%`}</strong>
        </div>
        <div className="analytics-actions">
          <button className="main-btn" type="button" onClick={refresh}>تحديث البيانات</button>
          {isSupabaseEnabled && (
            <button className="ghost-btn" type="button" onClick={async () => {
              await signOutFromAnalytics();
              setAuthorized(false);
              setSummary(null);
            }}>
              تسجيل الخروج
            </button>
          )}
        </div>
      </div>

      <div className="analytics-panel analytics-note">
        <p>لجمع بيانات كل الزوار يجب تشغيل الموقع عبر السيرفر المرفق بعد البناء: <code>npm run build</code> ثم <code>npm start</code>. عند النشر كصفحة ثابتة فقط ستظهر بيانات هذا المتصفح فقط.</p>
      </div>

      <div className="analytics-panel analytics-note">
        <h3>تحليلات مجمعة</h3>
        <div className="analytics-charts-grid">
          <AnalyticsBarSection title="الدول الأكثر حضوراً" description="حسب إجابات من أتموا الاختبار." data={countryData} />
          <AnalyticsBarSection title="توزيع الأعمار" description="الفئات العمرية التي وصلت إلى النتيجة." data={ageData} />
          <AnalyticsBarSection title="توزيع الجنس" description="للتأكد من ملاءمة الترشيحات والمسارات." data={genderData} />
          <AnalyticsBarSection title="البرامج الأكثر ترشيحاً" description="أكثر نتيجة أولى ظهرت للمستخدمين." data={programData} />
          <AnalyticsBarSection title="مصادر الدخول" description="من أين وصل المستخدمون عند توفر المصدر." data={sourceData} />
        </div>
      </div>
    </section>
  );
}

export default function ProgramSelector() {
  const initialMode = () => {
    const url = new URL(window.location.href);
    if (url.pathname.endsWith("/analytics") || url.searchParams.has("analytics") || url.hash === "#analytics") {
      return "analytics";
    }
    return "home";
  };

  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [openedProgramId, setOpenedProgramId] = useState(null);
  const [mode, setMode] = useState(initialMode);
  const [darkMode, setDarkMode] = useState(false);
  const completionTrackedRef = useRef(false);

  useEffect(() => {
    trackAnalyticsEvent("visit");
  }, []);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const qs = useMemo(() => visibleQuestions(answers), [answers]);
  const current = qs[Math.min(step, qs.length - 1)] || qs[0];
  const currentOptions = current?.options ? current.options(answers).filter(Boolean) : [];
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
    completionTrackedRef.current = false;
    trackAnalyticsEvent("quiz_started");
    setMode("quiz");
  }

  function next() {
    const safeStep = Math.min(step, qs.length - 1);
    if (!current || !hasAnswer(answers[current.id])) return;
    if (safeStep >= qs.length - 1) {
      setShowResult(true);
      if (!completionTrackedRef.current) {
        completionTrackedRef.current = true;
        trackAnalyticsEvent("quiz_completed", {
          resultProgramId: result.list[0]?.id,
          stepCount: qs.length,
          ...buildCompletionAnalytics(answers, result, qs),
        });
      }
    } else setStep(safeStep + 1);
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
    completionTrackedRef.current = false;
    trackAnalyticsEvent("quiz_started");
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
    <div className={`selector-root ${darkMode ? 'dark' : ''}`} dir="rtl">
      <style>{styles}</style>
      
      <button 
        className="theme-toggle" 
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? "الوضع الفاتح" : "الوضع الداكن"}
        data-html2canvas-ignore="true"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <main className="app-shell">
        <AnimatePresence mode="wait">
          {openedProgram && (
            <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <ProgramDetail program={openedProgram} onBack={closeProgram} onHome={goHome} />
            </motion.div>
          )}

          {mode === "home" && !openedProgram && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <HomeView onStart={startQuiz} onPrograms={() => setMode("programs")} onCompare={() => setMode("compare")} onCompareDynamic={() => setMode("compareDynamic")} />
            </motion.div>
          )}

          {mode === "analytics" && !openedProgram && (
            <motion.div key="analytics" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <AnalyticsDashboard onBack={goHome} />
            </motion.div>
          )}

          {mode === "programs" && !openedProgram && (
            <motion.div key="programs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <ProgramDirectory onOpen={setOpenedProgramId} onBack={goHome} />
            </motion.div>
          )}

          {mode === "compare" && !openedProgram && (
            <motion.div key="compare" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <ComparisonTable onOpen={setOpenedProgramId} onBack={goHome} />
            </motion.div>
          )}

          {mode === "compareDynamic" && !openedProgram && (
            <motion.div key="compareDynamic" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <DynamicComparison onOpen={setOpenedProgramId} onBack={goHome} />
            </motion.div>
          )}

          {mode === "quiz" && !showResult && !openedProgram && current && (
            <motion.section key="quiz" className="quiz-card" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.2 }}>
              <div className="quiz-topline">
                <button className="ghost-btn" type="button" onClick={goHome}>الرئيسية</button>
                <span>اختبار اختيار البرنامج المناسب</span>
              </div>
              <div className="progress-row"><span>السؤال {Math.min(step, qs.length - 1) + 1} من {qs.length}</span><span>{progress}%</span></div>
              <div className="progress"><span style={{ width: `${progress}%` }} /></div>

              <div className="question-head">
                <h2>{questionTitle(current, answers)}</h2>
                {questionSubtitle(current, answers) && <p>{questionSubtitle(current, answers)}</p>}
                {current.multi && <p className="multi-hint">يمكنك اختيار أكثر من خيار.</p>}
              </div>

              {current.inputType === "text" ? (
                <div className="text-answer-wrap">
                  <input
                    className="text-answer-input"
                    type="text"
                    value={answers[current.id] || ""}
                    onChange={(event) => choose(current.id, event.target.value)}
                    placeholder={current.placeholder || ""}
                    autoComplete="country-name"
                  />
                </div>
              ) : current.inputType === "select" ? (
                <div className="text-answer-wrap">
                  <select
                    className="text-answer-input select-answer-input"
                    value={answers[current.id] || ""}
                    onChange={(event) => choose(current.id, event.target.value)}
                  >
                    <option value="" disabled>{current.placeholder || "اختر..."}</option>
                    {currentOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.icon ? `${opt.icon} ` : ""}{opt.title}</option>
                    ))}
                  </select>
                </div>
              ) : (
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
              )}

              <div className="nav-row">
                <button className="ghost-btn" type="button" onClick={back} disabled={step === 0}>السابق</button>
                <button className="main-btn" type="button" onClick={next} disabled={!hasAnswer(answers[current.id])}>
                  {(step >= qs.length - 1 && hasAnswer(answers[current.id])) || QUESTIONS[QUESTIONS.length - 1]?.id === current?.id ? "اعرض النتيجة" : "التالي"}
                </button>
              </div>
            </motion.section>
          )}

          {mode === "quiz" && showResult && !openedProgram && (
            <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}>
              <ResultView result={result} answers={answers} onOpen={setOpenedProgramId} onRestart={restart} onHome={goHome} />
            </motion.div>
          )}
        </AnimatePresence>
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
  --indigo: #4a5568;
  --chart-bg: #f8fafc;
  font-family: Alyamama, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  background:
    radial-gradient(circle at top right, rgba(23, 107, 84, .12), transparent 34rem),
    radial-gradient(circle at bottom left, rgba(184, 121, 23, .12), transparent 32rem),
    var(--bg);
  min-height: 100vh;
  color: var(--ink);
  direction: rtl;
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
.result-actions { display: flex; gap: 12px; justify-content: space-between; margin-top: 16px; }
.result-actions button { flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; text-align: center; }
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
.intro-card span { font-size: 30px; font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"; }
.intro-card h3 { margin: 12px 0 8px; }
.intro-card p { margin: 0; color: var(--muted); line-height: 1.8; }

.quiz-card, .result-wrap, .directory-page, .comparison-page, .program-detail, .analytics-page { max-width: 900px; margin: 0 auto; }
.quiz-card, .result-main, .alternatives-box, .compare-box, .advice-card, .program-detail > .detail-section {
  background: rgba(255,253,248,.95);
  border: 1px solid var(--border);
  border-radius: 28px;
  box-shadow: 0 18px 52px rgba(39,32,20,.08);
}
.analytics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 14px; }
.analytics-card, .analytics-panel {
  background: rgba(255,253,248,.95);
  border: 1px solid var(--border);
  border-radius: 22px;
  box-shadow: 0 12px 34px rgba(39,32,20,.06);
  padding: 18px;
}
.analytics-card span, .analytics-panel small { display: block; color: var(--muted); font-weight: 700; margin-bottom: 8px; }
.analytics-card strong { display: block; font-size: 34px; color: var(--green); }
.analytics-panel { display: flex; justify-content: space-between; align-items: center; gap: 16px; margin-top: 12px; }
.analytics-panel strong { font-size: 28px; color: var(--amber); }
.analytics-note { display: block; }
.analytics-note p { margin: 0; color: var(--muted); line-height: 1.9; }
.analytics-note code { background: #f6efe3; border: 1px solid var(--border); border-radius: 8px; padding: 2px 6px; color: var(--ink); }
.analytics-login {
  max-width: 460px;
  margin: 70px auto 0;
  background: rgba(255,253,248,.95);
  border: 1px solid var(--border);
  border-radius: 24px;
  box-shadow: 0 18px 52px rgba(39,32,20,.08);
  padding: 24px;
}
.analytics-login h2 { margin: 8px 0 18px; }
.analytics-login small { color: var(--green); font-weight: 800; }
.analytics-login form { display: grid; gap: 12px; margin-bottom: 12px; }
.analytics-actions { display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end; }
.analytics-auth-message { color: var(--green); line-height: 1.8; margin: 0 0 12px; }
.analytics-event { border-top: 1px solid var(--border); padding-top: 14px; margin-top: 14px; }
.analytics-event strong, .analytics-event small { display: block; }
.analytics-event small { color: var(--muted); margin: 4px 0 8px; }
.analytics-event p { font-size: 13px; }
.analytics-charts-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 14px; width: 100%; margin-top: 14px; }
.analytics-chart-card { background: white; border: 1px solid var(--border); border-radius: 18px; padding: 16px; min-width: 0; }
.analytics-chart { direction: ltr; }
.analytics-list { display: grid; gap: 8px; margin-top: 10px; }
.analytics-list div { display: flex; align-items: center; justify-content: space-between; gap: 10px; border-top: 1px dashed var(--border); padding-top: 8px; }
.analytics-list span { color: var(--muted); }
.analytics-list strong { color: var(--green); }
.analytics-empty { color: var(--muted); margin: 0; }
.quiz-card { padding: clamp(20px, 4vw, 34px); }
.quiz-topline, .progress-row, .nav-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.quiz-topline span { color: var(--muted); font-weight: 700; }
.progress-row { margin-top: 24px; color: var(--muted); font-size: 14px; }
.progress { height: 9px; background: #ebe2d5; border-radius: 99px; overflow: hidden; margin: 10px 0 28px; }
.progress span { display: block; height: 100%; background: linear-gradient(90deg, var(--green), var(--amber)); border-radius: inherit; transition: width .25s ease; }
.question-head h2 { font-size: clamp(24px, 5vw, 36px); margin: 0 0 10px; color: #112e25; }
.question-head p { color: var(--muted); line-height: 1.8; margin: 0 0 10px; }
.multi-hint { background: #fff6df; color: #7d560c !important; border: 1px solid #f1dcab; border-radius: 16px; padding: 10px 14px; }
.text-answer-wrap { margin: 24px 0; }
.text-answer-input {
  width: 100%;
  border: 1.5px solid var(--border);
  background: white;
  color: var(--ink);
  border-radius: 18px;
  padding: 16px 18px;
  font: inherit;
  font-size: 17px;
  outline: none;
  transition: .18s ease;
}
.text-answer-input:focus { border-color: var(--green-2); box-shadow: 0 0 0 4px rgba(15, 138, 104, .12); }
.select-answer-input { cursor: pointer; appearance: auto; }
.options-grid { display: grid; gap: 12px; margin: 24px 0; }
.option-card { width: 100%; display: flex; align-items: center; gap: 14px; text-align: right; border: 1.5px solid var(--border); background: white; border-radius: 20px; padding: 16px; cursor: pointer; transition: .18s ease; color: var(--ink); }
.option-card:hover { border-color: #a7cfbf; transform: translateY(-1px); }
.option-card.selected { background: #eaf7f1; border-color: var(--green-2); box-shadow: 0 8px 18px rgba(15, 138, 104, .10); }
.option-icon { width: 44px; height: 44px; flex: 0 0 44px; display: flex; align-items: center; justify-content: center; font-size: 24px; line-height: 1; background: #f6efe3; border-radius: 12px; font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"; overflow: hidden; }
.rank-badge { width: 26px; height: 26px; display: flex; align-items: center; justify-content: center; border-radius: 50%; color: white; background: var(--green); font-size: 14px; line-height: 1.2; margin: auto; }
.option-copy strong { display: block; font-size: 17px; }
.option-copy small { display: block; margin-top: 6px; color: var(--muted); line-height: 1.7; }
.nav-row { margin-top: 16px; }

.result-wrap { display: grid; gap: 18px; }
.result-main, .alternatives-box, .compare-box, .advice-card, .chart-container { page-break-inside: avoid; }
.result-main { overflow: hidden; border-width: 1.5px; }
.result-top { display: flex; gap: 18px; padding: clamp(22px, 4vw, 36px); align-items: flex-start; }
.result-icon { font-size: 50px; width: 70px; height: 70px; display: flex; align-items: center; justify-content: center; line-height: 1; background: white; border-radius: 22px; box-shadow: 0 10px 26px rgba(0,0,0,.06); font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"; }
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

.advice-card { padding: clamp(20px, 4vw, 30px); border-width: 1.5px; position: relative; }
.advice-kicker { font-weight: 800; margin-bottom: 8px; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 6px; }
.advice-kicker::before { content: "⚠️"; }
.advice-card h2 { margin: 0 0 12px; font-size: clamp(22px, 5vw, 32px); line-height: 1.3; }
.advice-card p { margin: 0 0 16px; line-height: 1.9; color: var(--indigo); font-size: 16px; }
.advice-program { display: flex; align-items: center; gap: 12px; width: 100%; border: 1.5px solid rgba(0,0,0,.08); background: rgba(255,255,255,.7); border-radius: 20px; padding: 16px; cursor: pointer; text-align: right; margin-bottom: 12px; transition: .2s ease; }
.advice-program:hover { transform: scale(1.01); background: white; border-color: rgba(0,0,0,0.15); }
.advice-program span { font-size: 28px; font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"; }
.advice-program strong { flex: 1; font-size: 17px; }
.advice-program small { color: var(--muted); }
.advice-compare-line { background: rgba(255,255,255,.6); border-radius: 14px; padding: 12px; margin: 10px 0; border: 1px dashed rgba(0,0,0,0.1); }
.advice-amber { background: #fffcf0; border-color: #f1d39b; }
.advice-amber .advice-kicker { color: #9c6d19; }
.advice-green { background: #f0fdf4; border-color: #bfe2ca; }
.advice-green .advice-kicker { color: #166534; }
.advice-green .advice-kicker::before { content: "✅"; }
.advice-rose { background: #fff1f2; border-color: #efc2cd; }
.advice-rose .advice-kicker { color: #9f1239; }
.advice-blue { background: #f0f9ff; border-color: #c6def6; }
.advice-blue .advice-kicker { color: #075985; }
.advice-blue .advice-kicker::before { content: "🎓"; }
.advice-slate { background: #f8fafc; border-color: #dce2e7; }

.share-top { display: flex; justify-content: flex-end; gap: 10px; margin-bottom: 12px; }
.share-btn { 
  display: inline-flex; align-items: center; gap: 8px; background: white; border: 1px solid var(--border); 
  border-radius: 99px; padding: 10px 18px; font-weight: 700; color: var(--green); cursor: pointer; 
  transition: all 0.2s ease; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}
.share-btn:hover { background: #f7faf9; border-color: var(--green); transform: translateY(-1px); }

/* Charts */
.chart-container { background: var(--chart-bg); border-radius: 24px; padding: 24px; margin-bottom: 24px; border: 1px solid var(--border); }
.chart-header { text-align: center; margin-bottom: 12px; }
.chart-header h3 { margin: 0; font-size: 18px; color: var(--text); }
.chart-header p { margin: 4px 0 0; font-size: 14px; color: var(--muted); }
.chart-visual { height: 280px; margin: 0 -10px; }
.chart-legend { display: flex; justify-content: center; gap: 20px; font-size: 13px; font-weight: 600; color: var(--muted); margin-top: 8px; }
.legend-item { display: flex; align-items: center; gap: 6px; }
.legend-dot { width: 10px; height: 10px; border-radius: 50%; }
.user-dot { background: #f97316; }

.alternatives-box, .compare-box { padding: 22px; }
.alternatives-box p { color: var(--muted); margin-top: -4px; }
.mini-program { width: 100%; display: flex; align-items: center; gap: 12px; padding: 14px; margin-top: 10px; background: white; border: 1px solid var(--border); border-radius: 18px; cursor: pointer; text-align: right; transition: .2s ease; }
.mini-program:hover { border-color: var(--green-2); transform: translateY(-1px); box-shadow: 0 8px 18px rgba(15,138,104,0.08); }
.mini-rank { width: 28px; height: 28px; border-radius: 50%; background: #f3eadc; display: grid; place-items: center; font-weight: 800; color: var(--amber); }
.mini-icon { font-size: 26px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"; }
.mini-text { flex: 1; }
.mini-text strong, .mini-text small { display: block; }
.mini-text small { color: var(--muted); margin-top: 4px; }
.mini-score { font-weight: 800; color: var(--green); background: #eaf7f1; padding: 6px 10px; border-radius: 99px; }
.mini-arrow { color: var(--green); font-size: 13px; font-weight: 700; background: rgba(15, 138, 104, 0.1); padding: 6px 12px; border-radius: 99px; transition: .2s ease; margin-right: auto; }
.mini-program:hover .mini-arrow { background: var(--green); color: white; }
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
.directory-icon { font-size: 34px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"; }
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
.program-hero-icon { width: 72px; height: 72px; display: flex; align-items: center; justify-content: center; line-height: 1; font-size: 44px; background: white; border-radius: 24px; box-shadow: 0 12px 28px rgba(0,0,0,.06); font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"; }
.program-hero small { color: var(--green); font-weight: 800; }
.program-hero h1 { margin: 8px 0 10px; font-size: clamp(28px, 5vw, 44px); }
.program-hero p { color: #52606b; line-height: 1.9; margin: 0; }
.meta-grid { margin: 0; }
.detail-section { padding: 24px; border-radius: 20px; border: 1.5px solid var(--border); margin-bottom: 16px; }
.detail-section h3 { margin: 0 0 16px; display: flex; align-items: center; gap: 8px; font-size: 20px; color: var(--ink); }
.ds-icon { font-size: 24px; line-height: 1; display: inline-flex; align-items: center; justify-content: center; font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji"; }
.ds-blue { background: #f0f9ff; border-color: #bae6fd; }
.ds-blue h3 { color: #0369a1; }
.ds-green { background: #f0fdf4; border-color: #bbf7d0; }
.ds-green h3 { color: #15803d; }
.ds-amber { background: #fffbeb; border-color: #fde047; }
.ds-amber h3 { color: #a16207; }
.ds-rose { background: #fff1f2; border-color: #fecdd3; }
.ds-rose h3 { color: #be123c; }
.links-box { padding: 18px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.links-box div { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 14px; }
.links-box small { display: block; color: var(--muted); margin-bottom: 5px; }
.program-link { color: var(--green); text-decoration: none; transition: .2s; }
.program-link:hover { opacity: 0.8; }

@media (max-width: 840px) {
  .intro-grid, .program-grid, .detail-grid, .analytics-grid, .analytics-charts-grid { grid-template-columns: 1fr; }
  .result-top, .program-hero { flex-direction: column; }
  .compare-grid, .links-box { grid-template-columns: 1fr; }
  .section-head { flex-direction: column; }
  .analytics-panel { align-items: stretch; flex-direction: column; }
}

@media (max-width: 520px) {
  .app-shell { padding: 14px 10px 34px; }
  .hero-card, .quiz-card, .result-main, .advice-card { border-radius: 22px; }
  .hero-actions { flex-direction: column; }
  .nav-row { flex-direction: row; gap: 8px; }
  .nav-row > button { width: auto; flex: 1; }
  .hero-actions > button { width: 100%; }
  .result-actions button { font-size: 13px; padding: 10px; }
  .option-card { padding: 14px; }
  .mini-program { align-items: flex-start; flex-wrap: wrap; }
}

@media print {
  .print-only { display: block !important; }
  body { background: white !important; }
  .selector-root { background: none !important; min-height: auto; }
  .app-shell { padding: 0 !important; max-width: 100% !important; margin: 0 !important; }
  .share-top, .ghost-btn, .nav-row, .hero-actions, .result-actions, .theme-toggle { display: none !important; }
  .result-wrap { max-width: 100%; box-shadow: none; display: block; }
  
  .result-main, .alternatives-box, .compare-box, .advice-card { 
    box-shadow: none !important; 
    border: 1px solid #ccc !important;
    page-break-inside: avoid;
    margin-bottom: 20px;
  }
  
  .chart-container, .program-detail > .detail-section {
    page-break-inside: avoid;
  }
  
  .result-icon { box-shadow: none !important; border: 1px solid #eee; }
  /* Avoid page breaks inside table rows */
  tr { page-break-inside: avoid; }
}

/* Creative Comparison Styles */
.print-only { display: none; }
.compare-picker { display: flex; gap: 10px; overflow-x: auto; padding-bottom: 16px; margin-bottom: 24px; scrollbar-width: none; }
.compare-picker::-webkit-scrollbar { display: none; }
.picker-btn { font-family: inherit; font-size: 14px; background: white; border: 1px solid var(--border); border-radius: 99px; padding: 10px 18px; white-space: nowrap; cursor: pointer; color: var(--ink); display: flex; align-items: center; gap: 8px; transition: 0.2s; box-shadow: 0 4px 12px rgba(0,0,0,0.03); max-width: 100%; min-width: 0; }
.picker-btn:hover { background: #f8fafc; border-color: #cbd5e1; }
.picker-btn.selected { background: var(--green); color: white; border-color: var(--green-2); }
.creative-compare-board { display: flex; align-items: stretch; gap: 16px; margin-bottom: 24px; position: relative; justify-content: center; flex-wrap: wrap; }
.cc-card { flex: 1; min-width: 300px; background: white; border: 1.5px solid var(--border); border-radius: 24px; padding: 24px; display: flex; flex-direction: column; box-shadow: 0 12px 30px rgba(0,0,0,0.05); }
.cc-card.empty-card { background: transparent; border: 2px dashed var(--border); align-items: center; justify-content: center; color: var(--muted); padding: 40px; box-shadow: none; min-height: 250px; }
.cc-card h3 { margin: 0 0 4px; font-size: 22px; }
.cc-card small { color: var(--muted); font-weight: 700; margin-bottom: 12px; display: inline-block; }
.cc-card p { color: var(--muted); line-height: 1.8; margin-bottom: 20px; flex: 1; }
.cc-details { display: grid; gap: 12px; margin-bottom: 20px; }
.cc-details > div { display: flex; justify-content: space-between; align-items: center; background: #f8fafc; padding: 12px 16px; border-radius: 12px; font-size: 14px; }
.cc-details > div span { color: var(--muted); }
.cc-details > div strong { color: var(--ink); }
.cc-vs { display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 900; color: white; background: var(--amber); width: 40px; height: 40px; border-radius: 50%; border: 4px solid var(--app-bg, #f7f4ed); margin: auto; position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); z-index: 10; }
@media (max-width: 768px) {
  .cc-vs { position: static; transform: none; margin: -20px auto; }
}

/* Theme Toggle */
.theme-toggle { position: fixed; top: 100px; left: 24px; background: white; border: 1px solid var(--border); border-radius: 50%; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center; cursor: pointer; color: var(--muted); box-shadow: 0 4px 12px rgba(0,0,0,0.05); transition: 0.2s; z-index: 1000; }
.theme-toggle:hover { color: var(--ink); border-color: var(--muted); }

@media (max-width: 840px) {
  .theme-toggle { top: 70px; left: 16px; }
}
html.dark .selector-root {
  --bg: #0f172a;
  --paper: #1e293b;
  --ink: #f8fafc;
  --muted: #cbd5e1;
  --border: #334155;
  --chart-bg: #1e293b;
}
html.dark .theme-toggle, html.dark .cc-card, html.dark .picker-btn, html.dark .ghost-btn, html.dark .share-btn { background: #1e293b; border-color: #334155; color: #f8fafc !important; }
html.dark .picker-btn.selected { background: rgba(15, 138, 104, 0.5); border-color: var(--green); }
html.dark .hero-card, html.dark .quiz-card, html.dark .result-main, html.dark .comparison-page, html.dark .program-detail > .detail-section, html.dark .alternatives-box, html.dark .compare-box, html.dark .answers-summary { background: #1e293b; border-color: #334155; }
html.dark .analytics-card, html.dark .analytics-panel { background: #1e293b; border-color: #334155; }
html.dark .analytics-chart-card { background: #0f172a; border-color: #334155; }
html.dark .analytics-login { background: #1e293b; border-color: #334155; }
html.dark .analytics-note code { background: #0f172a; border-color: #334155; color: #f8fafc; }
html.dark .home-hero .hero-card { background: linear-gradient(135deg, #1e293b, #0f172a); }
html.dark .hero-card h1 { color: #f8fafc; }
html.dark .cc-details > div, html.dark .ds-blue, html.dark .ds-green, html.dark .ds-amber, html.dark .ds-rose, html.dark .why-box, html.dark .notice-box { background: #0f172a; border-color: #334155; }
html.dark .ds-blue h3, html.dark .ds-green h3, html.dark .ds-amber h3, html.dark .ds-rose h3 { color: #f8fafc; }
html.dark .program-link { color: #34d399; }
html.dark .option-card, html.dark .mini-program, html.dark .directory-card { background: #1e293b; border-color: #334155; color: #f8fafc; }
html.dark .text-answer-input { background: #1e293b; border-color: #334155; color: #f8fafc; }
html.dark .links-box div { background: #0f172a; border-color: #334155; color: #f8fafc; }
html.dark .option-card:hover, html.dark .directory-card:hover { border-color: var(--green); background: #27374d; }
html.dark .mini-program:hover { border-color: var(--green); background: #27374d; box-shadow: none; }
html.dark .mini-arrow { background: rgba(15, 138, 104, 0.2); color: #34d399; }
html.dark .mini-program:hover .mini-arrow { background: var(--green); color: white; }
html.dark .option-card.selected { background: rgba(15, 138, 104, 0.2); border-color: var(--green); }
html.dark .option-icon, html.dark .program-hero-icon, html.dark .result-icon, html.dark .mini-rank { background: #0f172a; border-color: #334155; }
html.dark .result-top { background: linear-gradient(135deg, #1e293b, #0f172a) !important; }
html.dark .program-hero { background: linear-gradient(135deg, #1e293b, #0f172a) !important; }
html.dark .cc-vs { border-color: #0f172a; }
html.dark .detail-grid > div { background: #0f172a; border-color: #334155; }
html.dark .advice-program { background: #1e293b; border-color: #334155; }
html.dark .advice-program:hover { background: #27374d; }
html.dark .advice-compare-line { background: #0f172a; border-color: #334155; }
html.dark .advice-card.advice-amber, html.dark .advice-card.advice-green, html.dark .advice-card.advice-rose, html.dark .advice-card.advice-blue, html.dark .advice-card.advice-slate { background: #1e293b; border-color: #334155; }
html.dark .advice-amber .advice-kicker { color: #fde047; }
html.dark .advice-green .advice-kicker { color: #86efac; }
html.dark .advice-rose .advice-kicker { color: #fca5a5; }
html.dark .advice-blue .advice-kicker { color: #7dd3fc; }
html.dark .hero-badge { background: #0f172a; border-color: #334155; color: #34d399; }
html.dark .multi-hint { background: #0f172a; border-color: #334155; color: #f8fafc !important; }
html.dark .progress { background: #0f172a; }
html.dark .table-link { background: rgba(15, 138, 104, 0.2); color: #34d399; }
html.dark .result-label { background: rgba(15, 138, 104, 0.3); color: #34d399; }
html.dark .mini-score { background: rgba(15, 138, 104, 0.2); color: #34d399; }
html.dark .compare-grid > div, html.dark .legend-item { background: #1e293b; border-color: #334155; color: #f8fafc; }
html.dark .comparison-table th { background: #0f172a; color: #cbd5e1; }
html.dark .comparison-table td { border-color: #334155; }
html.dark .intro-card { background: #1e293b; border-color: #334155; }
html.dark .intro-card h3 { color: #f8fafc; }
html.dark .intro-card p { color: #cbd5e1; }
html.dark .dropdown-menu { background: #1e293b !important; border-color: #334155 !important; }
html.dark .ghost-btn { background: #1e293b; color: var(--ink); border-color: #334155; }
html.dark .ghost-btn:hover { background: #334155; }
html.dark .ghost-btn.restart-btn-fix, html.dark .share-btn.home-btn-fix2 { background: #1e293b; color: #f8fafc !important; border-color: #334155 !important; }
html.dark .ghost-btn.home-btn-fix { background: #1e293b; color: #f8fafc !important; border-color: #334155 !important; }
html.dark .comparison-table-wrap, html.dark .comparison-table-wrap table { background: #1e293b !important; color: #f8fafc; border-color: #334155 !important; }
html.dark .comparison-table-wrap th { color: #cbd5e1 !important; }
html.dark .comparison-table-wrap tr, html.dark .comparison-table-wrap td, html.dark .comparison-table-wrap th { border-color: #334155 !important; }
html.dark .disclaimer-box { background: #1e293b !important; border-color: #334155 !important; }
html.dark .disclaimer-box h3 { color: #f8fafc !important; }
html.dark .disclaimer-box p { color: #cbd5e1 !important; }
html.dark [style*="color: #52606b"], html.dark [style*="color: #475569"], html.dark [style*="color: #64748b"] { color: #cbd5e1 !important; }
html.dark p, html.dark h1, html.dark h2, html.dark h3, html.dark h4, html.dark strong { color: var(--ink); }
`;
