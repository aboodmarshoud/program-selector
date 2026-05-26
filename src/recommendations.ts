import { PROGRAMS } from "./programData";
import {
  asArray,
  choiceRank,
  completedJuthurOrIshraq,
  getCurrentPrograms,
  getGraduatedPrograms,
  hasChoice,
  hasKnown,
  isAgeAtLeast15,
  isCurrentStatus,
  isGraduatedStatus,
  isYouthAcademyAge,
  knownPrograms,
  rankWeight,
} from "./answerUtils";

const OMR_TRACK_IDS = ["omr_mufakkir", "omr_bahith", "omr_talib_ilm", "omr_daiya", "omr_murabbi"];

function hasBinaAsasiFoundation(a) {
  return hasKnown(a, "bina_asasi");
}

function hasCompletedReformFoundation(a) {
  const graduated = getGraduatedPrograms(a);
  return ["bina_asasi", "fikri", "khadija", "ishraq", "juthur"].some((id) => graduated.includes(id));
}

function isEligible(programId, a) {
  if (!a.age) return true;

  // إذا كان الطالب حاليًا في برنامج، نبقيه قابلًا للظهور في التحليل حتى نعرف هل ننصحه بالاستمرار أو الاستدراك.
  if (isCurrentStatus(a) && hasKnown(a, programId)) return true;

  const age = a.age;
  const adult = isAgeAtLeast15(a);
  switch (programId) {
    case "jeel_new":
      return age === "7_9";
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
    case "mashrou_al_omr":
      return false;
    case "omr_mufakkir":
    case "omr_bahith":
    case "omr_talib_ilm":
    case "omr_daiya":
    case "omr_murabbi":
      return adult && hasBinaAsasiFoundation(a);
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

function preferCurrentProgram(scores: Record<string, ScoreItem>, a: any, reason: string, margin = 24) {
  const current = getCurrentPrograms(a).filter((id) => isRecommendable(scores, id));
  if (!current.length) return false;

  current.forEach((id) => addScore(scores, id, 38, reason));
  const strongestCurrent = current.reduce((best, id) => (scores[id].score > scores[best].score ? id : best), current[0]);
  ensurePriority(scores, strongestCurrent, reason, margin);
  return true;
}

function recommendationRole(programId: string, a: any) {
  if (getCurrentPrograms(a).includes(programId)) return "برنامجك الحالي";
  if (programId === "kharitat_thughur") {
    return hasCompletedReformFoundation(a) ? "مسار قصير بعد أصل سابق" : "رديف بعد التأسيس";
  }
  if (OMR_TRACK_IDS.includes(programId)) return "خطوة لاحقة متقدمة";
  if (programId === "ithmar") return "خطوة لاحقة";
  return "برنامج أساسي";
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
  if (a.age === "7_9") return "jeel_new";
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
    if (preferCurrentProgram(scores, a, "أنت داخل برنامج قائم؛ والأصل ألا تتركه لأجل مسار قصير، بل تجعل الحاجة الإصلاحية رديفة أو لاحقة", 32)) {
      addScore(scores, "kharitat_thughur", 18, "خارطة الثغور تصلح هنا كمسار رديف قصير بعد ضبط الاستمرار في برنامجك الحالي");
      return;
    }
    if (!hasCompletedReformFoundation(a)) {
      const bina = chooseBinaTrack(a);
      ensurePriority(scores, bina, "الرغبة في العمل الإصلاحي تحتاج أصلًا بنائيًا أسبق؛ ابدأ بما يبني القاعدة ثم اجعل الثغر خطوة لاحقة", 34);
      addScore(scores, "kharitat_thughur", 18, "خارطة الثغور تصلح كتهيئة أو خطوة لاحقة بعد بناء الأصل، لا كبديل عن التأسيس");
      return;
    }
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

function addOmrTrackScores(scores: Record<string, ScoreItem>, a) {
  if (!hasChoice(a.needPattern, "reform_project") && a.prioritySignal !== "reform_priority") return;

  if (!hasBinaAsasiFoundation(a)) {
    addScore(scores, "bina_asasi", 24, "مشروع العمر غالبًا لا يكون بداية الطريق؛ الأسبق غالبًا بناء أصل كالبناء المنهجي");
    addScore(scores, "kharitat_thughur", 24, "قبل مشروع العمر قد تحتاج فهم الثغر والتهيئة للعمل الإصلاحي");
    return;
  }

  if (!["expanded", "formation_project"].includes(a.dailyTime)) {
    addScore(scores, "kharitat_thughur", 28, "مشروع العمر ثقيل وطويل؛ ومع الوقت الحالي فخارطة الثغور أو مسار رديف أخف أقرب");
    softenScores(scores, OMR_TRACK_IDS, 80, "تنبيه: مشروع العمر يحتاج استعدادًا واسعًا ونفسًا طويلًا");
    return;
  }

  const selected = {
    mufakkir: "omr_mufakkir",
    bahith: "omr_bahith",
    talib_ilm: "omr_talib_ilm",
    daiya: "omr_daiya",
    murabbi: "omr_murabbi",
  }[a.omrTrack];

  if (selected) {
    ensurePriority(scores, selected, "اخترت هذا المسار داخل مشروع العمر، ومع وجود أصل سابق ووقت واسع صار الترشيح أكثر تحديدًا", 44);
    return;
  }

  addScore(scores, "omr_mufakkir", 22, "مشروع العمر مناسب بعد الأصل السابق لمن يريد رؤية إصلاحية طويلة");
  addScore(scores, "omr_daiya", 20, "العمل الإصلاحي قد يتجه إلى البلاغ والدعوة بحسب بقية الإجابات");
  addScore(scores, "omr_murabbi", 20, "العمل الإصلاحي قد يتجه إلى التربية وبناء البيئات بحسب بقية الإجابات");

  if (a.prioritySignal === "intellectual_priority" || hasChoice(a.needPattern, "intellectual_depth")) {
    addScore(scores, "omr_mufakkir", 38, "العمق الفكري يرجح مسار المفكر داخل مشروع العمر");
  }
  if (a.prioritySignal === "depth_priority" || hasChoice(a.needPattern, "specialized_track")) {
    addScore(scores, "omr_bahith", 28, "الميل للتخصص والعمق يرجح مسار الباحث");
    addScore(scores, "omr_talib_ilm", 24, "الميل للتخصص قد يرجح مسار طالب العلم إذا كان العلم مركز العطاء");
  }
  if (a.prioritySignal === "environment_priority" || hasChoice(a.needPattern, "relational_growth")) {
    addScore(scores, "omr_murabbi", 34, "البيئة والصحبة والمتابعة ترجح مسار المربي");
  }
  if (a.prioritySignal === "curriculum_priority" || hasChoice(a.needPattern, "structured_path")) {
    addScore(scores, "omr_talib_ilm", 26, "حب الخطة العلمية والتأصيل يرجح مسار طالب العلم");
  }
  if (a.prioritySignal === "reform_priority") {
    addScore(scores, "omr_daiya", 24, "الأثر العملي المباشر قد يرجح مسار الداعية");
    addScore(scores, "omr_murabbi", 18, "الأثر العملي قد يكون تربويًا ومحضنيًا");
  }
}

export function calculateRecommendations(a: any) {
  const scores: Record<string, ScoreItem> = {};
  Object.keys(PROGRAMS).forEach((id) => {
    scores[id] = { id, score: isEligible(id, a) ? 0 : -999, reasons: [] };
  });

  if (a.age === "7_9") addScore(scores, "jeel_new", 130, "العمر يعطي أولوية للمسار الجديد في أكاديمية الجيل الصاعد المخصص للأعمار 7–9");
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
  addOmrTrackScores(scores, a);

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
      return { ...prog, score: Math.max(0, item.score), reasons: item.reasons.slice(0, 5), recommendationRole: recommendationRole(item.id, a) };
    });

  const list = (sorted.length
    ? sorted
    : [PROGRAMS.bina_muyassar, PROGRAMS.bina_asasi].map((program) => ({
        ...program,
        score: 50,
        reasons: ["اختيار احتياطي آمن عند نقص المعطيات"],
        recommendationRole: recommendationRole(program.id, a),
      }))
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

  const pathPlan = buildPathPlan(a, list);

  return { list, profile, advice, pathPlan };
}

function buildPathPlan(a, list) {
  const primary = list[0];
  if (!primary) return null;

  const current = getCurrentPrograms(a).map((id) => PROGRAMS[id]).filter(Boolean);
  const wantsReform = hasChoice(a.needPattern, "reform_project") || a.prioritySignal === "reform_priority";

  if (current.length) {
    return {
      label: a.programStatus === "studying_struggling" ? "استدراك قبل الانتقال" : "استمرار",
      title: "القرار العملي الآن: ثبّت برنامجك الحالي",
      message: "وجود احتياج جديد لا يعني فتح مسار جديد فورًا. الأصل أن تضبط البرنامج الذي أنت فيه، ثم تجعل البرامج القصيرة أو المواد الرديفة خادمة له.",
      points: [
        "ابدأ بخطة أسبوعين للاستدراك أو تثبيت الورد الدراسي.",
        "لا تدخل برنامجًا آخر إلا إذا كان خفيفًا ولا يزاحم أصل الالتزام.",
        "اجعل سؤال الثغر والعمل الإصلاحي خطوة لاحقة بعد قدر من الاستقرار.",
      ],
    };
  }

  if (isGraduatedStatus(a)) {
    return {
      label: "بناء على أصل سابق",
      title: "القرار العملي الآن: ابحث عن الخطوة التي تضيف معنى جديدًا",
      message: "بما أن لديك تجربة مكتملة أو قريبة من الاكتمال، فالترشيح هنا لا يقصد تكرار الطريق نفسه، بل اختيار خطوة لاحقة مناسبة.",
      points: [
        "قد تكون الخطوة تعميقًا فكريًا، تخصصًا علميًا، أو توجيهًا إصلاحيًا.",
        "لا تعد إلى البرنامج نفسه إلا لسبب واضح.",
        "وازن بين فتح الدفعات وقدرتك الواقعية قبل التسجيل.",
      ],
    };
  }

  if (wantsReform && primary.id !== "kharitat_thughur") {
    return {
      label: "تأسيس قبل الثغر",
      title: "القرار العملي الآن: ابنِ الأصل أولًا",
      message: "رغبتك في العمل الإصلاحي معتبرة، لكنها لا تجعل الدورة القصيرة بديلًا عن البناء. ابدأ ببرنامج يؤسس القاعدة، واجعل مواد الإصلاح أو خارطة الثغور رديفًا أو خطوة لاحقة.",
      points: [
        "اختر برنامجًا أساسيًا تستطيع الاستمرار فيه.",
        "خذ مادة إصلاحية واحدة فقط إن لم تزاحم البرنامج.",
        "ارجع لخارطة الثغور عندما يكون عندك أصل أبين ووقت مناسب.",
      ],
    };
  }

  if (primary.id === "kharitat_thughur") {
    return {
      label: "مسار قصير",
      title: "القرار العملي الآن: اجعلها توجيهًا للثغر لا بديلًا عن البناء",
      message: "ظهور خارطة الثغور يعني أن سؤال العمل حاضر بقوة، لا أن كل برامج البناء صارت غير لازمة.",
      points: [
        "تأكد من المواد القبلية وشروط الدفعة.",
        "لا تجمع معها برنامجًا ثقيلًا إلا عند سعة واضحة.",
        "ليكن هدفك مشروعًا عمليًا محددًا بعد الدورة.",
      ],
    };
  }

  return {
    label: "بداية أساسية",
    title: "القرار العملي الآن: ابدأ ببرنامج واحد واضح",
    message: "الترشيح هنا يقترح المسار الأقرب كبداية عملية، والأهم أن يكون برنامجًا قابلًا للاستمرار لا مجرد حماس تسجيل.",
    points: [
      "اقرأ شروط البرنامج قبل التسجيل.",
      "لا تجمع أكثر من برنامج إلا عند وضوح الحاجة وسعة الوقت.",
      "اجعل الردائف خادمة للمسار لا منافسة له.",
    ],
  };
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
        type: "caution",
        title: "لا تجعل الترشيح سببًا لترك برنامجك الحالي",
        program: bestKnown,
        alternative: primary,
        message:
          `ظهر برنامج ${primary.name} قريبًا من بعض احتياجك، لكن وجود حاجة جديدة لا يعني أن تترك برنامجك الحالي. تعامل معه كخيار رديف أو لاحق بعد ضبط الاستمرار، لا كبديل مباشر.`,
        points: [
          "الأصل أن تكمل البرنامج الذي بدأت به ما دام أصل مناسبته قائمًا.",
          "إن كان البرنامج الآخر قصيرًا أو محدد الهدف، فاجعله رديفًا خفيفًا أو خطوة بعدية لا سببًا للتشتت.",
          "لا تغيّر المسار إلا عند عائق حقيقي واضح، وبعد استشارة من يعرف برنامجك وحالك.",
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
