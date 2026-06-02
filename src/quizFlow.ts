import { asArray, completedJuthurOrIshraq, hasChoice, hasKnown, isAgeAtLeast15, option } from "./answerUtils";

export const COUNTRY_OPTIONS = [
  option("saudi_arabia", "السعودية", "", ""),
  option("jordan", "الأردن", "", ""),
  option("lebanon", "لبنان", "", ""),
  option("turkey", "تركيا", "", ""),
  option("egypt", "مصر", "", ""),
  option("syria", "سوريا", "", ""),
  option("palestine", "فلسطين", "", ""),
  option("iraq", "العراق", "", ""),
  option("kuwait", "الكويت", "", ""),
  option("qatar", "قطر", "", ""),
  option("uae", "الإمارات", "", ""),
  option("oman", "عمان", "", ""),
  option("bahrain", "البحرين", "", ""),
  option("yemen", "اليمن", "", ""),
  option("morocco", "المغرب", "", ""),
  option("algeria", "الجزائر", "", ""),
  option("tunisia", "تونس", "", ""),
  option("libya", "ليبيا", "", ""),
  option("sudan", "السودان", "", ""),
  option("mauritania", "موريتانيا", "", ""),
  option("somalia", "الصومال", "", ""),
  option("djibouti", "جيبوتي", "", ""),
  option("comoros", "جزر القمر", "", ""),
  option("afghanistan", "أفغانستان", "", ""),
  option("pakistan", "باكستان", "", ""),
  option("indonesia", "إندونيسيا", "", ""),
  option("malaysia", "ماليزيا", "", ""),
  option("europe", "أوروبا", "", ""),
  option("north_america", "أمريكا الشمالية", "", ""),
  option("south_america", "أمريكا الجنوبية", "", ""),
  option("africa_other", "دولة إفريقية أخرى", "", ""),
  option("asia_other", "دولة آسيوية أخرى", "", ""),
  option("other", "بلد آخر", "", ""),
];





export function questionTitle(q, answers) {
  return typeof q.title === "function" ? q.title(answers) : q.title;
}

export function questionSubtitle(q, answers) {
  return typeof q.subtitle === "function" ? q.subtitle(answers) : q.subtitle;
}

const RAW_PROGRAM_OPTIONS = [
  option("bina_asasi", "البناء المنهجي - المسار الأساسي", "", ""),
  option("bina_muyassar", "البناء المنهجي - المسار الميسّر", "", ""),
  option("fikri", "البناء الفكري", "", ""),
  option("bard_yaqin", "برد اليقين", "", ""),
  option("hadith", "أكاديمية الحديث الإلكترونية", "", ""),
  option("arqam", "مدرسة الأرقم", "", ""),
  option("omr_mufakkir", "مشروع العمر - مسار المفكر", "", ""),
  option("omr_bahith", "مشروع العمر - مسار الباحث", "", ""),
  option("omr_talib_ilm", "مشروع العمر - مسار طالب العلم", "", ""),
  option("omr_daiya", "مشروع العمر - مسار الداعية", "", ""),
  option("omr_murabbi", "مشروع العمر - مسار المربي", "", ""),
  option("jeel_new", "أكاديمية الجيل الصاعد - المسار الجديد", "", ""),
  option("buthur", "أكاديمية الجيل الصاعد - بذور", "", ""),
  option("juthur", "أكاديمية الجيل الصاعد - جذور", "", ""),
  option("ghiras", "أكاديمية الجيل الصاعد - غراس", "", ""),
  option("ishraq", "أكاديمية الجيل الصاعد - إشراق", "", ""),
  option("ithmar", "أكاديمية الجيل الصاعد - إثمار", "", ""),
  option("khadija", "مدرسة خديجة", "", ""),
  option("kharitat_thughur", "خارطة الثغور", "", ""),
  option("alim", "برنامج عالِم", "", ""),
  option("alim_fityan", "برنامج عالِم - مسار الفتيان", "", ""),
];

const PROGRAM_OPTION_ORDER = [
  "bina_asasi",
  "bina_muyassar",
  "bard_yaqin",
  "fikri",
  "khadija",
  "jeel_new",
  "buthur",
  "juthur",
  "ghiras",
  "ishraq",
  "ithmar",
  "arqam",
  "kharitat_thughur",
  "alim",
  "alim_fityan",
  "omr_mufakkir",
  "omr_bahith",
  "omr_talib_ilm",
  "omr_daiya",
  "omr_murabbi",
];

const PROGRAM_OPTION_RANK = new Map(PROGRAM_OPTION_ORDER.map((id, index) => [id, index]));

export const PROGRAM_OPTIONS = [...RAW_PROGRAM_OPTIONS].sort((a, b) => {
  const aRank = PROGRAM_OPTION_RANK.get(a.value) ?? Number.MAX_SAFE_INTEGER;
  const bRank = PROGRAM_OPTION_RANK.get(b.value) ?? Number.MAX_SAFE_INTEGER;
  return aRank - bRank;
});

export const OMR_TRACK_IDS = ["omr_mufakkir", "omr_bahith", "omr_talib_ilm", "omr_daiya", "omr_murabbi"];

export const SPECIALIZATION_SUBJECT_OPTIONS = [
  option("hadith", "الحديث", "أريد التخصص في علوم الحديث رواية ودراية", ""),
  option("fiqh", "الفقه", "أريد التخصص في الفقه وبناء الملكة الفقهية", ""),
  option("usul_fiqh", "أصول الفقه", "أريد التخصص في أصول الفقه ومناهج الاستدلال", ""),
  option("mustalah_hadith", "مصطلح الحديث", "أريد التخصص في قواعد نقد الحديث ومصطلحه", ""),
  option("tafsir", "التفسير", "أريد التخصص في تفسير القرآن وعلومه", ""),
  option("arabic_language", "علوم اللغة العربية", "أريد التخصص في العربية وعلومها وآلاتها", ""),
  option("sirah", "السيرة النبوية", "أريد التخصص في السيرة النبوية وهداياتها", ""),
];

export const SELF_STUDY_BRIDGES = {
  bina_asasi: [
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
    { title: "التزكية للمصلحين", source: "مورد", url: "https://mawred.io/student/courses/13" },
    { title: "حقيبة إحياء منهاج النبوة", source: "مورد", url: "https://mawred.io/details/courses/10" },
  ],
  bina_muyassar: [
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
    { title: "المدرسة الرمضانية", source: "مورد", url: "https://mawred.io/student/courses/12" },
    { title: "مدارسة سورة الأنعام", source: "مورد", url: "https://mawred.io/details/courses/5" },
  ],
  fikri: [
    { title: "الدورة الفكرية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/13" },
    { title: "الأمة بين احتلالين", source: "مورد", url: "https://mawred.io/details/courses/6" },
    { title: "حقيبة إحياء منهاج النبوة", source: "مورد", url: "https://mawred.io/details/courses/10" },
  ],
  bard_yaqin: [
    { title: "التزكية للمصلحين", source: "مورد", url: "https://mawred.io/student/courses/13" },
    { title: "الاستهداء بالقرآن", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/8" },
    { title: "المدرسة الرمضانية", source: "مورد", url: "https://mawred.io/student/courses/12" },
  ],
  hadith: [
    { title: "دورة حجية السنة", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/19" },
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
  ],
  arqam: [
    { title: "سلسلة خير القرون", source: "مورد", url: "https://mawred.io/details/courses/3" },
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
  ],
  kharitat_thughur: [
    { title: "دورة بوصلة المصلح", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/28?tab=lessons" },
    { title: "مركزيات الإصلاح", source: "مورد", url: "https://mawred.io/details/courses/8" },
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
  ],
  omr_mufakkir: [
    { title: "مركزيات الإصلاح", source: "مورد", url: "https://mawred.io/details/courses/8" },
    { title: "دورة بوصلة المصلح", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/28?tab=lessons" },
    { title: "الدورة الفكرية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/13" },
  ],
  omr_bahith: [
    { title: "مركزيات الإصلاح", source: "مورد", url: "https://mawred.io/details/courses/8" },
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
    { title: "كيفية تدريس المنهاج من ميراث النبوة", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/7" },
  ],
  omr_talib_ilm: [
    { title: "سلسلة خير القرون", source: "مورد", url: "https://mawred.io/details/courses/3" },
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
    { title: "دورة حجية السنة", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/19" },
  ],
  omr_daiya: [
    { title: "مركزيات الإصلاح", source: "مورد", url: "https://mawred.io/details/courses/8" },
    { title: "دورة بوصلة المصلح", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/28?tab=lessons" },
    { title: "الاستهداء بالقرآن", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/8" },
  ],
  omr_murabbi: [
    { title: "صناعة المربي", source: "مورد", url: "https://mawred.io/details/courses/11" },
    { title: "الدورة التربوية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/20" },
    { title: "التزكية للمصلحين", source: "مورد", url: "https://mawred.io/student/courses/13" },
  ],
  khadija: [
    { title: "الدورة التربوية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/20" },
    { title: "التزكية للمصلحين", source: "مورد", url: "https://mawred.io/student/courses/13" },
    { title: "حقيبة إحياء منهاج النبوة", source: "مورد", url: "https://mawred.io/details/courses/10" },
  ],
  jeel_new: [
    { title: "الدورة التربوية للآباء والأمهات", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/20" },
  ],
  buthur: [
    { title: "الدورة التربوية للآباء والأمهات", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/20" },
    { title: "حقيبة إحياء منهاج النبوة", source: "مورد", url: "https://mawred.io/details/courses/10" },
  ],
  ghiras: [
    { title: "مدارسة سورة الأنعام", source: "مورد", url: "https://mawred.io/details/courses/5" },
    { title: "حقيبة إحياء منهاج النبوة", source: "مورد", url: "https://mawred.io/details/courses/10" },
  ],
  juthur: [
    { title: "مدارسة سورة الأنعام", source: "مورد", url: "https://mawred.io/details/courses/5" },
    { title: "الدورة الفكرية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/13" },
  ],
  ishraq: [
    { title: "دورة بوصلة المصلح", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/28?tab=lessons" },
    { title: "الاستهداء بالقرآن", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/8" },
    { title: "الدورة الفكرية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/13" },
  ],
  ithmar: [
    { title: "دورة بوصلة المصلح", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/28?tab=lessons" },
    { title: "كيفية تدريس المنهاج من ميراث النبوة", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/7" },
  ],
  alim: [
    { title: "مراجعة القرآن وضبط الورد", source: "تهيئة ذاتية" },
    { title: "تثبيت المتون أو المواد المطلوبة عند الإعلان", source: "تهيئة ذاتية" },
  ],
};

export const NEED_BRIDGE_ITEMS = {
  structured_path: [
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
    { title: "سلسلة خير القرون", source: "مورد", url: "https://mawred.io/details/courses/3" },
  ],
  certainty: [
    { title: "التزكية للمصلحين", source: "مورد", url: "https://mawred.io/student/courses/13" },
    { title: "الاستهداء بالقرآن", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/8" },
  ],
  intellectual_depth: [
    { title: "الدورة الفكرية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/13" },
    { title: "الأمة بين احتلالين", source: "مورد", url: "https://mawred.io/details/courses/6" },
  ],
  specialized_track: [
    { title: "دورة حجية السنة", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/19" },
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
  ],
  sirah_specialization: [
    { title: "سلسلة خير القرون", source: "مورد", url: "https://mawred.io/details/courses/3" },
    { title: "شرح متن المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9" },
  ],
  reform_project: [
    { title: "مركزيات الإصلاح", source: "مورد", url: "https://mawred.io/details/courses/8" },
    { title: "دورة بوصلة المصلح", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/28?tab=lessons" },
  ],
  relational_growth: [
    { title: "صناعة المربي", source: "مورد", url: "https://mawred.io/details/courses/11" },
    { title: "التزكية للمصلحين", source: "مورد", url: "https://mawred.io/student/courses/13" },
  ],
  women_space: [
    { title: "الدورة التربوية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/20" },
    { title: "التزكية للمصلحين", source: "مورد", url: "https://mawred.io/student/courses/13" },
  ],
};

function hasBinaAsasiFoundation(a) {
  return hasKnown(a, "bina_asasi");
}

function hasCompletedBinaAsasi(a) {
  return (
    (asArray(a.knownPrograms).includes("bina_asasi") && a.programStatus === "graduated_or_near") ||
    asArray(a.graduatedPrograms).includes("bina_asasi")
  );
}

function canConsiderOmrTracks(a) {
  return (
    isAgeAtLeast15(a) &&
    a.needClarity === "specific_need" &&
    hasCompletedBinaAsasi(a) &&
    ["expanded", "formation_project"].includes(a.dailyTime) &&
    (hasChoice(a.needPattern, "reform_project") || a.prioritySignal === "reform_priority")
  );
}

function shouldAskSpecializationSubject(a) {
  const needs = asArray(a.needPattern);
  if (!isAgeAtLeast15(a) || !needs.includes("specialized_track")) return false;
  if (needs.length === 1) return true;
  return a.prioritySignal === "depth_priority";
}

export const QUESTIONS = [
  {
    id: "gender",
    title: "ما الجنس؟",
    subtitle: "حتى لا تظهر خيارات خاصة لا تناسب المستفيد.",
    options: () => [option("male", "ذكر", "", ""), option("female", "أنثى", "", "")],
  },
  {
    id: "forWhom",
    title: "لمن تبحث عن البرنامج؟",
    subtitle: "نحتاجها فقط لصياغة الأسئلة بصورة ألطف.",
    condition: (a) => Boolean(a.gender),
    options: (a) => [
      option("self", "لي أنا", "أبحث عن البرنامج الأنسب لي شخصيًا", ""),
      option("child", "لابني أو ابنتي", "أريد ترشيحًا يناسب العمر والمرحلة", ""),
      a.gender === "female"
        ? option("friend", "لصديقة", "أريد مساعدة صديقة على الاختيار", "")
        : option("friend", "لصديق", "أريد مساعدة صديق على الاختيار", ""),
    ],
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
    subtitle: "",
    options: () => [
      option("7_9", "7–9 سنوات", "", ""),
      option("10_12", "10–12 سنة", "", ""),
      option("13_14", "13–14 سنة", "", ""),
      option("15_18", "15–18 سنة", "", ""),
      option("19_20", "19–20 سنة", "", ""),
      option("21_25", "21–25 سنة", "", ""),
      option("26_40", "26–40 سنة", "", ""),
      option("40_plus", "أكثر من 40 سنة", "", ""),
    ],
  },
  {
    id: "programStatus",
    title: "هل سبق أن درست أحد هذه البرامج؟",
    subtitle: "",
    condition: (a) => a.age && !["7_9", "10_12"].includes(a.age),
    options: () => [
      option("none", "لا، لم أبدأ برنامجًا بعد", "", ""),
      option("studying_committed", "طالب في برنامج أو عدة برامج", "", ""),
      option("studying_struggling", "بدأت برنامجًا ثم تعثرت", "", ""),
      option("graduated_or_near", "تخرجت أو قاربت التخرج", "", ""),
      option("studying_and_graduated", "طالب وخريج", "", ""),
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
    id: "ithmarFit",
    title: "الأنسب غالبًا بعد جذور أو إشراق هو إكمال الطريق في إثمار؛ هل يناسبك ذلك؟",
    subtitle: "لا ننتقل عن إثمار إلا إذا كان عندك مانع أو احتياج أوضح لا يغطيه هذا المسار الآن.",
    condition: (a) => completedJuthurOrIshraq(a),
    options: () => [
      option("yes_continue", "نعم، يناسبني إثمار وأريد الإكمال فيه", "أبحث عن الامتداد الطبيعي بعد جذور أو إشراق", ""),
      option("missed_registration", "لا، فاتتني فرصة التسجيل", "أحتاج خطة مؤقتة أو بديلًا حتى تفتح الفرصة القادمة", ""),
      option("need_tazkiyah", "أحتاج بناءً تزكويًا مكثفًا", "الأولوية الآن للقلب واليقين والثبات", ""),
      option("need_sharia", "أحتاج بناءً علميًا شرعيًا مكثفًا", "أحتاج تأسيسًا شرعيًا أوسع من مسار الأكاديمية", ""),
      option("need_awareness", "أحتاج بناءً فكريًا وتوعويًا", "الأولوية لفهم الأفكار والشبهات والواقع", ""),
      option("need_reform", "أحتاج تحويل البناء إلى عمل إصلاحي", "الأولوية لمعرفة الثغر والمشروع العملي", ""),
      option("need_environment", "أحتاج بيئة متابعة أو محضنًا أقرب", "الأولوية للصحبة والمتابعة لا لمجرد المقررات", ""),
      option("not_suitable_now", "لا يناسبني الآن لسبب خاص", "أحتاج أن تقرأ الخوارزمية بقية إجاباتي", ""),
    ],
  },
  {
    id: "struggleReason",
    title: "ما السبب الأساسي للتعثر أو الانقطاع؟",
    subtitle: "فهم السبب يساعدنا في توجيهك لمعالجة المشكلة، لا تكرارها.",
    condition: (a) => a.programStatus === "studying_struggling",
    options: () => [
      option("time", "ضيق الوقت وحجم المواد كبير", "دراستي أو عملي يمنعني من الالتزام بكثافة", ""),
      option("difficulty", "صعوبة المحتوى", "المستوى أعلى من قدرتي الحالية ويحتاج تأسيس أبسط", ""),
      option("environment", "الفتور وغياب البيئة", "أفقد حماسي بالدراسة الفردية وأحتاج صحبة أو محضن", ""),
      option("wrong_fit", "البرنامج لم يناسب اهتماماتي", "لم أجد فيه ما يلبي احتياجي المباشر", ""),
      option("did_not_try", "لم أجرب شيئاً بعد", "لست منقطعا، بل أبدأ للتو", ""),
    ]
  },
  {
    id: "dailyTime",
    title: "أي وصف أقرب لالتزامك الواقعي خلال الفترة القادمة؟",
    subtitle: "اختر ما تستطيع الاستمرار عليه غالبًا، لا ما تتمناه في أفضل الأيام.",
    condition: (a) => a.age && !["7_9", "10_12"].includes(a.age),
    options: () => [
      option("light", "20–30 دقيقة يوميًا", "التزام خفيف ثابت؛ يناسب البداية الهادئة أو المسارات الأخف", ""),
      option("standard", "45–60 دقيقة يوميًا", "التزام يومي مناسب لغالب البرامج مثل مسارات الأكاديمية والبناء المنهجي والفكري", ""),
      option("expanded", "90–120 دقيقة يوميًا", "وقت أوسع من المعتاد، مع بقاء الدراسة أو العمل حاضرًا", ""),
      option("formation_project", "4–6 ساعات يوميًا تقريبًا", "طلب العلم سيكون مشروعًا يوميًا كبيرًا لسنوات، لا اندفاعًا قصيرًا", ""),
    ],
  },
  {
    id: "needClarity",
    title: "هل حاجتك الآن واضحة ومحددة؟",
    subtitle: "إذا لم تكن الحاجة محددة، فالأصل اختيار مسار تأسيسي شامل بدل القفز إلى تخصص أو دورة قصيرة.",
    condition: (a) => isAgeAtLeast15(a),
    options: () => [
      option("general_foundation", "حاجتي عامة: أريد بناءً شاملًا", "لا أملك احتياجًا دقيقًا، وأبحث عن أساس واسع أبدأ منه", ""),
      option("specific_need", "حاجتي محددة بوضوح", "أعرف أنني أحتاج يقينًا، فكرًا، تخصصًا، محضنًا، أو عملًا إصلاحيًا", ""),
      option("unsure", "لست متأكدًا بعد", "عندي ميول متفرقة وأحتاج ترشيحًا آمنًا لا يشتتني", ""),
    ],
  },
  {
    id: "needPattern",
    title: "أي وصف أقرب لاحتياجك الآن؟",
    subtitle: "يمكنك اختيار أكثر من خيار؛ اختر الإجابات بحسب أولويتها بالنسبة لك، فالأهم ثم ما يليه.",
    multi: true,
    condition: (a) => a.age && !["7_9", "10_12"].includes(a.age) && a.needClarity && a.needClarity !== "general_foundation",
    options: (a) => {
      const base = [
        option("structured_path", "أحتاج مسارًا علميًا مرتبًا", "مواد واضحة، تدرج، اختبارات، وواجبات", ""),
        option("relational_growth", "أحتاج بيئة تساعدني على الثبات", "صحبة، متابعة، أجواء تربوية، ومرافقة", ""),
        option("certainty", "أحتاج طمأنينة ويقينًا أكثر", "ترميم إيماني وسكينة أمام الشكوك والقلق", ""),
        option("intellectual_depth", "أحتاج فهم الأفكار المعاصرة ونقدها", "وعي فكري، شبهات، تيارات، ومركزية الوحي", ""),
        option("specialized_track", "أميل لتخصص علمي واضح", "تعمق في مجال محدد لا بناء عام فقط", ""),
        option("reform_project", "أريد تحويل التعلم إلى عمل إصلاحي", "ما ثغري؟ وكيف أخدم واقعي بمشروع؟", ""),
      ];
      if (a.gender === "female" && isAgeAtLeast15(a)) {
        base.push(option("women_space", "أحتاج محضنًا نسائيًا تفاعليًا", "لقاءات، بناء إيماني وعلمي، وبيئة نسائية", ""));
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
        dynamicOptions.push(option("curriculum_priority", "خطة علمية واضحة ومقررات", "أريد أن يكون الأصل دراسة مرتبة وتدرجًا علميًا", ""));
      }
      if (needs.includes("relational_growth")) {
        dynamicOptions.push(option("environment_priority", "بيئة وصحبة ومتابعة", "أحتاج من يعينني على الثبات والالتزام", ""));
      }
      if (needs.includes("certainty")) {
        dynamicOptions.push(option("certainty_priority", "الطمأنينة واليقين", "أحتاج لمسار يرمم اليقين ويركز على أعمال القلوب", ""));
      }
      if (needs.includes("intellectual_depth")) {
        dynamicOptions.push(option("intellectual_priority", "العمق الفكري", "الأهم عندي البناء الفكري ونقد الشبهات", ""));
      }
      if (needs.includes("specialized_track")) {
        dynamicOptions.push(option("depth_priority", "عمق أو تخصص لاحق", "أميل لمسار ينتقل بي من العموم إلى التخصص", ""));
      }
      if (needs.includes("women_space") && a.gender === "female") {
        dynamicOptions.push(option("women_priority", "خصوصية بيئة نسائية", "أحتاج محضنًا نسائيًا آمنًا وتفاعليًا", ""));
      }
      if (needs.includes("reform_project")) {
        dynamicOptions.push(option("reform_priority", "العمل الإصلاحي والواقعي", "أريد أثرًا عمليًا مباشرًا", ""));
      }
      
      // Always give an "ease" option if they might be struggling or busy
      if (a.dailyTime === "light" || a.struggleReason === "difficulty" || dynamicOptions.length === 0) {
        dynamicOptions.push(option("gentle_priority", "بداية أخف تناسب الانشغال", "أهم شيء أن أبدأ بما أستطيع إكماله", ""));
      }

      return dynamicOptions;
    },
  },
  {
    id: "specializationSubject",
    title: "أي مادة تريد التخصص فيها؟",
    subtitle: "لأن ترشيح التخصص يختلف بحسب المادة والوقت المتاح: بعض المواد لها برنامج مستقل، وبعضها يحتاج مسارًا أوسع.",
    condition: (a) => shouldAskSpecializationSubject(a),
    options: () => SPECIALIZATION_SUBJECT_OPTIONS,
  },
  {
    id: "omrTrack",
    title: "أي مسار من مشروع العمر أقرب لعطائك؟",
    subtitle: "لا يظهر هذا السؤال إلا إذا ظهرت قرائن قوية: أصل سابق كالبناء المنهجي، ووقت واسع، واحتياج إصلاحي.",
    condition: (a) => canConsiderOmrTracks(a),
    options: () => [
      option("mufakkir", "المفكر", "بناء الرؤية وتحليل الأفكار وتحرير التصورات", ""),
      option("bahith", "الباحث", "جمع المادة والتحرير والمشاريع المعرفية", ""),
      option("talib_ilm", "طالب العلم", "تعميق التأصيل العلمي وتوجيهه للعطاء", ""),
      option("daiya", "الداعية", "البلاغ والخطاب وتقريب المعاني للناس", ""),
      option("murabbi", "المربي", "بناء النفوس والبيئات والمحاضن", ""),
      option("unsure", "لست متأكدًا بعد", "أحتاج أن تتولى الخوارزمية الترجيح من بقية الإجابات", ""),
    ],
  },
  {
    id: "selectivity",
    title: "كيف تتعامل مع الاختبارات والقبول الانتقائي؟",
    subtitle: "ليست الأفضلية دائمًا للأصعب؛ المهم ما يناسب مرحلتك.",
    condition: (a) => a.age && !["7_9", "10_12"].includes(a.age) && !canConsiderOmrTracks(a),
    options: () => [
      option("open", "أفضل مسارًا مفتوحًا أو أيسر", "لا أريد أن يكون القبول عائقًا الآن", ""),
      option("ok_test", "لا مانع من اختبار قبول", "إن كان البرنامج مناسبًا فأنا مستعد", ""),
      option("high_selective", "أفضل مسارًا نخبويًا ولو كان أصعب", "أبحث عن تحدٍّ ومتابعة أعلى", ""),
    ],
  },
  {
    id: "doubtImpact",
    title: "ما طبيعة حاجتك أمام الشبهات أو الأسئلة الفكرية؟",
    subtitle: "نفرق هنا بين اضطراب إيماني يحتاج طمأنينة، وبيئة فكرية تحتاج أدوات نقد، وحاجة تأسيس عامة.",
    condition: (a) => isAgeAtLeast15(a),
    options: () => [
      option("high", "تؤثر على السكينة والعبادة", "أحتاج طمأنينة ويقينًا وتزكية قبل التوسع الجدلي", ""),
      option("ideological_environment", "أعيش في بيئة فكرية ضاغطة", "علمانية، ليبرالية، حداثة، إنكار السنة، أو شبهات متكررة تحتاج أدوات نقد", ""),
      option("medium", "تؤثر أحيانًا وتحتاج ترتيبًا", "أحتاج تثبيتًا مع فهم دون توسع تخصصي كبير", ""),
      option("low", "لا توجد مشكلة محددة", "أحتاج تأسيسًا عامًا ومعرفة هادئة أكثر من معالجة خاصة", ""),
    ],
  },
];

export function cleanAnswers(answers) {
  const next = { ...answers };
  if (!next.needClarity || next.needClarity === "general_foundation") {
    delete next.needPattern;
    delete next.prioritySignal;
    delete next.specializationSubject;
    delete next.omrTrack;
  }
  if (hasChoice(next.needPattern, "sirah_specialization") || next.prioritySignal === "sirah_priority") {
    const needs = asArray(next.needPattern).filter((value) => value !== "sirah_specialization");
    if (!needs.includes("specialized_track")) needs.push("specialized_track");
    next.needPattern = needs;
    if (next.prioritySignal === "sirah_priority") next.prioritySignal = "depth_priority";
    if (!next.specializationSubject) next.specializationSubject = "sirah";
  }
  if (next.gender !== "female" && hasChoice(next.needPattern, "women_space")) {
    next.needPattern = asArray(next.needPattern).filter((value) => value !== "women_space");
  }
  if (next.gender !== "female" && next.prioritySignal === "women_priority") delete next.prioritySignal;
  if (!shouldAskSpecializationSubject(next)) delete next.specializationSubject;
  if (!canConsiderOmrTracks(next)) delete next.omrTrack;
  if (canConsiderOmrTracks(next)) delete next.selectivity;
  if (next.programStatus === "none" || !next.programStatus) delete next.knownPrograms;
  if (!completedJuthurOrIshraq(next)) delete next.ithmarFit;
  if (next.programStatus !== "studying_struggling") delete next.struggleReason;
  if (!isAgeAtLeast15(next)) {
    delete next.needClarity;
    delete next.needPattern;
    delete next.doubtImpact;
    delete next.prioritySignal;
    delete next.specializationSubject;
  }
  return next;
}



export function visibleQuestions(answers) {
  return QUESTIONS.filter((q) => !q.condition || q.condition(answers));
}
