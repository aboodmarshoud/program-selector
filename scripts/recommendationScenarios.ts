import { visibleQuestions } from "../src/quizFlow";
import { calculateRecommendations } from "../src/recommendations";

type Scenario = {
  name: string;
  answers: Record<string, unknown>;
  expect: (result: any) => void;
};

function assert(condition: unknown, message: string) {
  if (!condition) throw new Error(message);
}

function topIds(result: any, count = 3) {
  return result.list.slice(0, count).map((program: any) => program.id);
}

const scenarios: Scenario[] = [
  {
    name: "quiz starts with gender and adapts friend label",
    answers: {},
    expect: () => {
      const initialQuestions = visibleQuestions({}).map((question: any) => question.id);
      const maleForWhom = visibleQuestions({ gender: "male" }).find((question: any) => question.id === "forWhom");
      const femaleForWhom = visibleQuestions({ gender: "female" }).find((question: any) => question.id === "forWhom");
      assert(initialQuestions[0] === "gender", `expected gender first, got ${initialQuestions[0]}`);
      assert(!initialQuestions.includes("forWhom"), "forWhom should wait until gender is selected");
      assert(maleForWhom?.options({ gender: "male" })[2].title === "لصديق", "male friend label should be لصديق");
      assert(femaleForWhom?.options({ gender: "female" })[2].title === "لصديقة", "female friend label should be لصديقة");
    },
  },
  {
    name: "current bina + reform keeps current program first",
    answers: {
      forWhom: "friend",
      gender: "male",
      age: "23_plus",
      programStatus: "studying_committed",
      knownPrograms: ["bina_asasi"],
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["reform_project"],
      prioritySignal: "reform_priority",
      selectivity: "open",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "bina_asasi", `expected bina_asasi first, got ${ids.join(", ")}`);
      assert(result.pathPlan?.label === "استمرار", "expected a continue path plan");
      assert(result.advice?.title?.includes("الثغر رديفًا"), "expected advice title to make the companion meaning explicit");
      assert(result.notNowItems?.some((item: any) => item.id === "kharitat_thughur"), "expected kharitat to be explained as not first now");
      assert(result.pathPlan?.points?.some((point: string) => point.includes("وقت زائد") && point.includes("خارطة الثغور")), "expected kharitat to be allowed as an extra-time companion");
      assert(result.pathPlan?.points?.some((point: string) => point.includes("بعد التخرج")), "expected later/after graduation deferral");
    },
  },
  {
    name: "alim fityan appears for eligible twelve-year-old boys",
    answers: {
      forWhom: "child",
      gender: "male",
      age: "age_12",
      programStatus: "none",
      dailyTime: "expanded",
      needClarity: "specific_need",
      needPattern: ["structured_path", "relational_growth"],
      selectivity: "high_selective",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids.includes("alim_fityan"), `expected alim_fityan in top results, got ${ids.join(", ")}`);
    },
  },
  {
    name: "alim fityan is hidden for girls",
    answers: {
      forWhom: "child",
      gender: "female",
      age: "age_12",
      programStatus: "none",
      dailyTime: "expanded",
      needClarity: "specific_need",
      needPattern: ["structured_path", "relational_growth"],
      selectivity: "high_selective",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = result.list.map((program: any) => program.id);
      assert(!ids.includes("alim_fityan"), `expected alim_fityan to be hidden for girls, got ${ids.join(", ")}`);
    },
  },
  {
    name: "new reform seeker starts with foundation, not kharitat",
    answers: {
      forWhom: "self",
      gender: "male",
      age: "23_plus",
      programStatus: "none",
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["reform_project"],
      prioritySignal: "reform_priority",
      selectivity: "open",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(["bina_asasi", "bina_muyassar"].includes(ids[0]), `expected a bina track first, got ${ids.join(", ")}`);
      assert(result.pathPlan?.label === "تأسيس قبل الثغر", "expected foundation-before-reform path plan");
      assert(result.notNowItems?.some((item: any) => item.id === "kharitat_thughur"), "expected kharitat deferral explanation");
      assert(result.pathPlan?.points?.some((point: string) => point.includes("وقتًا زائدًا") && point.includes("رديفًا")), "expected kharitat to be framed as an extra-time companion");
      assert(result.notNowItems?.some((item: any) => item.id === "kharitat_thughur" && item.reason.includes("كرديف خفيف")), "expected kharitat not-now reason to allow light companion use");
    },
  },
  {
    name: "female friend reform case keeps foundation first and kharitat as companion or later",
    answers: {
      forWhom: "friend",
      gender: "female",
      country: "أفغانستان",
      age: "23_plus",
      programStatus: "none",
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["reform_project"],
      prioritySignal: "reform_priority",
      selectivity: "high_selective",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "bina_asasi", `expected bina_asasi first, got ${ids.join(", ")}`);
      assert(ids[1] === "kharitat_thughur", `expected kharitat as the close companion option, got ${ids.join(", ")}`);
      assert(result.pathPlan?.points?.some((point: string) => point.includes("بعد إتمام مرحلة") || point.includes("تخرج")), "expected kharitat to be deferred if extra time is unavailable");
    },
  },
  {
    name: "bina graduate with reform can get kharitat as next step",
    answers: {
      forWhom: "self",
      gender: "male",
      age: "23_plus",
      programStatus: "graduated_or_near",
      knownPrograms: ["bina_asasi"],
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["reform_project"],
      prioritySignal: "reform_priority",
      selectivity: "open",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "kharitat_thughur", `expected kharitat_thughur first after graduation, got ${ids.join(", ")}`);
      assert(result.list[0].recommendationRole === "مسار قصير بعد أصل سابق", "expected kharitat to be labelled as a short next step");
    },
  },
  {
    name: "juthur graduate in early teens moves to ithmar, not lower academy tracks",
    answers: {
      forWhom: "friend",
      gender: "male",
      country: "تونس",
      age: "13_14",
      programStatus: "graduated_or_near",
      knownPrograms: ["juthur"],
      dailyTime: "standard",
      selectivity: "high_selective",
    },
    expect: (result) => {
      const ids = topIds(result, 4);
      assert(ids[0] === "ithmar", `expected ithmar first after graduating from juthur, got ${ids.join(", ")}`);
      assert(!ids.includes("buthur"), `buthur should not appear after graduating from juthur, got ${ids.join(", ")}`);
      assert(!ids.includes("juthur") && !ids.includes("ghiras"), `lower academy tracks should not appear after graduating from juthur, got ${ids.join(", ")}`);
      assert(result.stageInfo?.label === "مرحلتك الآن: تخصص", "expected ithmar to explain a specialization stage");
    },
  },
  {
    name: "juthur graduate with general need keeps ithmar first when it fits",
    answers: {
      forWhom: "self",
      gender: "male",
      country: "jordan",
      age: "23_plus",
      programStatus: "graduated_or_near",
      knownPrograms: ["juthur"],
      ithmarFit: "yes_continue",
      dailyTime: "expanded",
      needClarity: "general_foundation",
      selectivity: "ok_test",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result, 4);
      assert(ids[0] === "ithmar", `expected ithmar first for juthur graduate when it fits, got ${ids.join(", ")}`);
      assert(ids.includes("bina_asasi"), "bina_asasi may remain as an alternative, but should not displace ithmar");
    },
  },
  {
    name: "juthur graduate can override ithmar for explicit intellectual need",
    answers: {
      forWhom: "self",
      gender: "female",
      country: "turkey",
      age: "23_plus",
      programStatus: "graduated_or_near",
      knownPrograms: ["juthur"],
      ithmarFit: "need_awareness",
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["intellectual_depth"],
      selectivity: "ok_test",
      doubtImpact: "ideological_environment",
    },
    expect: (result) => {
      const ids = topIds(result, 4);
      assert(ids[0] === "fikri", `expected fikri first when graduate says awareness is the need, got ${ids.join(", ")}`);
      assert(ids.includes("ithmar"), "ithmar should remain visible as the natural next academy step");
    },
  },
  {
    name: "ithmar fit question appears for juthur or ishraq graduates",
    answers: {},
    expect: () => {
      const ids = visibleQuestions({
        gender: "male",
        forWhom: "self",
        country: "jordan",
        age: "23_plus",
        programStatus: "graduated_or_near",
        knownPrograms: ["juthur"],
      }).map((question: any) => question.id);
      assert(ids.includes("ithmarFit"), "expected ithmarFit question for juthur graduate");
    },
  },
  {
    name: "student in multiple programs gets multi-program advice",
    answers: {
      forWhom: "self",
      gender: "female",
      age: "23_plus",
      programStatus: "studying_and_graduated",
      graduatedPrograms: ["bina_asasi"],
      currentPrograms: ["hadith", "fikri"],
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["intellectual_depth", "specialized_track"],
      prioritySignal: "intellectual_priority",
      selectivity: "ok_test",
      doubtImpact: "ideological_environment",
    },
    expect: (result) => {
      const ids = topIds(result, 4);
      assert(ids.includes("fikri"), `expected current fikri to stay visible, got ${ids.join(", ")}`);
      assert(ids.includes("hadith"), `expected current hadith to stay visible, got ${ids.join(", ")}`);
      assert(!ids.includes("bina_asasi"), "completed bina_asasi should not be recommended again");
      assert(result.advice?.type === "multi_current", "expected multi-current advice");
      assert(result.advice?.programs?.length === 2, "expected both current programs in advice");
      assert(result.advice?.graduatedPrograms?.some((program: any) => program.id === "bina_asasi"), "expected graduated bina in advice");
    },
  },
  {
    name: "sirah is a specialization subject, not a top-level need",
    answers: {
      forWhom: "self",
      gender: "male",
      age: "23_plus",
      programStatus: "none",
      dailyTime: "standard",
      needClarity: "specific_need",
    },
    expect: () => {
      const needQuestion = visibleQuestions({
        forWhom: "self",
        gender: "male",
        age: "23_plus",
        programStatus: "none",
        dailyTime: "standard",
        needClarity: "specific_need",
      }).find((question: any) => question.id === "needPattern");
      assert(needQuestion?.options({}).some((option: any) => option.value === "specialized_track"), "expected specialized_track in needPattern");
      assert(!needQuestion?.options({}).some((option: any) => option.value === "sirah_specialization"), "sirah should not be a top-level needPattern option");
    },
  },
  {
    name: "specialization subject appears when specialization is the priority",
    answers: {},
    expect: () => {
      const singleSpecialization = visibleQuestions({
        gender: "male",
        forWhom: "self",
        age: "23_plus",
        programStatus: "none",
        dailyTime: "standard",
        needClarity: "specific_need",
        needPattern: ["specialized_track"],
      }).map((question: any) => question.id);
      const multiSpecializationPriority = visibleQuestions({
        gender: "male",
        forWhom: "self",
        age: "23_plus",
        programStatus: "none",
        dailyTime: "standard",
        needClarity: "specific_need",
        needPattern: ["intellectual_depth", "specialized_track"],
        prioritySignal: "depth_priority",
      }).map((question: any) => question.id);
      const multiOtherPriority = visibleQuestions({
        gender: "male",
        forWhom: "self",
        age: "23_plus",
        programStatus: "none",
        dailyTime: "standard",
        needClarity: "specific_need",
        needPattern: ["intellectual_depth", "specialized_track"],
        prioritySignal: "intellectual_priority",
      }).map((question: any) => question.id);
      assert(singleSpecialization.includes("specializationSubject"), "expected specialization subject when specialization is the only need");
      assert(multiSpecializationPriority.includes("specializationSubject"), "expected specialization subject when depth is priority");
      assert(!multiOtherPriority.includes("specializationSubject"), "specialization subject should hide when another need is priority");
    },
  },
  {
    name: "sirah subject recommends arqam below four hours",
    answers: {
      forWhom: "self",
      gender: "male",
      age: "23_plus",
      programStatus: "none",
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["specialized_track"],
      specializationSubject: "sirah",
      selectivity: "open",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "arqam", `expected arqam first for sirah below four hours, got ${ids.join(", ")}`);
      assert(result.stageInfo?.label === "مرحلتك الآن: تخصص", "expected sirah result to be specialization stage");
    },
  },
  {
    name: "sirah subject with formation time recommends alim first",
    answers: {
      forWhom: "self",
      gender: "female",
      age: "21_25",
      programStatus: "none",
      dailyTime: "formation_project",
      needClarity: "specific_need",
      needPattern: ["specialized_track"],
      specializationSubject: "sirah",
      selectivity: "high_selective",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "alim", `expected alim first for sirah with formation time, got ${ids.join(", ")}`);
    },
  },
  {
    name: "hadith subject routes by available time",
    answers: {},
    expect: () => {
      const standard = calculateRecommendations({
        forWhom: "self",
        gender: "male",
        age: "23_plus",
        programStatus: "none",
        dailyTime: "standard",
        needClarity: "specific_need",
        needPattern: ["specialized_track"],
        specializationSubject: "hadith",
        selectivity: "open",
        doubtImpact: "low",
      });
      const formation = calculateRecommendations({
        forWhom: "self",
        gender: "male",
        age: "21_25",
        programStatus: "none",
        dailyTime: "formation_project",
        needClarity: "specific_need",
        needPattern: ["specialized_track"],
        specializationSubject: "hadith",
        selectivity: "high_selective",
        doubtImpact: "low",
      });
      assert(topIds(standard)[0] === "hadith", `expected hadith academy below four hours, got ${topIds(standard).join(", ")}`);
      assert(topIds(formation)[0] === "alim", `expected alim for hadith with formation time, got ${topIds(formation).join(", ")}`);
    },
  },
  {
    name: "foundation subjects route to bina unless formation time is available",
    answers: {},
    expect: () => {
      ["fiqh", "usul_fiqh", "tafsir", "arabic_language"].forEach((subject) => {
        const standard = calculateRecommendations({
          forWhom: "self",
          gender: "male",
          age: "23_plus",
          programStatus: "none",
          dailyTime: "standard",
          needClarity: "specific_need",
          needPattern: ["specialized_track"],
          specializationSubject: subject,
          selectivity: "open",
          doubtImpact: "low",
        });
        const formation = calculateRecommendations({
          forWhom: "self",
          gender: "male",
          age: "21_25",
          programStatus: "none",
          dailyTime: "formation_project",
          needClarity: "specific_need",
          needPattern: ["specialized_track"],
          specializationSubject: subject,
          selectivity: "high_selective",
          doubtImpact: "low",
        });
        assert(["bina_asasi", "bina_muyassar"].includes(topIds(standard)[0]), `expected a bina track for ${subject} below four hours, got ${topIds(standard).join(", ")}`);
        assert(topIds(formation)[0] === "alim", `expected alim for ${subject} with formation time, got ${topIds(formation).join(", ")}`);
      });
    },
  },
  {
    name: "programStatus none does not ask struggle reason",
    answers: {
      age: "23_plus",
      programStatus: "none",
    },
    expect: () => {
      const ids = visibleQuestions({ age: "23_plus", programStatus: "none" }).map((question: any) => question.id);
      assert(!ids.includes("struggleReason"), "struggleReason should not be visible for programStatus none");
    },
  },
  {
    name: "struggling current bina still gets recovery before switching",
    answers: {
      forWhom: "self",
      gender: "female",
      age: "23_plus",
      programStatus: "studying_struggling",
      knownPrograms: ["bina_asasi"],
      struggleReason: "wrong_fit",
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["reform_project"],
      prioritySignal: "reform_priority",
      selectivity: "open",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "bina_asasi", `expected current bina first, got ${ids.join(", ")}`);
      assert(result.pathPlan?.label === "استدراك قبل الانتقال", "expected recovery path plan");
    },
  },
  {
    name: "general need skips detailed need question and recommends foundation",
    answers: {
      forWhom: "self",
      gender: "male",
      age: "23_plus",
      programStatus: "none",
      dailyTime: "standard",
      needClarity: "general_foundation",
      selectivity: "open",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      const visible = visibleQuestions({
        age: "23_plus",
        programStatus: "none",
        dailyTime: "standard",
        needClarity: "general_foundation",
      }).map((question: any) => question.id);
      assert(!visible.includes("needPattern"), "needPattern should be skipped when the need is general");
      assert(["bina_asasi", "bina_muyassar"].includes(ids[0]), `expected a bina track first, got ${ids.join(", ")}`);
      assert(result.stageInfo?.label === "مرحلتك الآن: بناء", "expected the result to explain the building stage");
    },
  },
  {
    name: "over forty with general foundation prefers muyassar",
    answers: {
      forWhom: "self",
      gender: "male",
      age: "40_plus",
      programStatus: "none",
      dailyTime: "standard",
      needClarity: "general_foundation",
      selectivity: "open",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "bina_muyassar", `expected bina_muyassar first for over forty general need, got ${ids.join(", ")}`);
    },
  },
  {
    name: "over forty with strong certainty need prefers bard yaqeen",
    answers: {
      forWhom: "self",
      gender: "female",
      age: "40_plus",
      programStatus: "none",
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["certainty"],
      selectivity: "open",
      doubtImpact: "high",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "bard_yaqin", `expected bard_yaqin first for over forty certainty need, got ${ids.join(", ")}`);
    },
  },
  {
    name: "ideological environment prefers fikri over general foundation",
    answers: {
      forWhom: "self",
      gender: "male",
      age: "23_plus",
      programStatus: "none",
      dailyTime: "standard",
      needClarity: "specific_need",
      needPattern: ["structured_path"],
      selectivity: "open",
      doubtImpact: "ideological_environment",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "fikri", `expected fikri first for ideological environment, got ${ids.join(", ")}`);
      assert(result.stageInfo?.label === "مرحلتك الآن: تخصص", "expected intellectual specialization stage");
    },
  },
  {
    name: "omr question stays hidden without completed foundation",
    answers: {
      age: "23_plus",
      programStatus: "studying_committed",
      knownPrograms: ["bina_asasi"],
      dailyTime: "expanded",
      needClarity: "specific_need",
      needPattern: ["reform_project"],
      prioritySignal: "reform_priority",
    },
    expect: () => {
      const ids = visibleQuestions({
        age: "23_plus",
        programStatus: "studying_committed",
        knownPrograms: ["bina_asasi"],
        dailyTime: "expanded",
        needClarity: "specific_need",
        needPattern: ["reform_project"],
        prioritySignal: "reform_priority",
      }).map((question: any) => question.id);
      assert(!ids.includes("omrTrack"), "omrTrack should stay hidden before completing bina_asasi");
    },
  },
  {
    name: "omr appears only after foundation, wide time, and clear reform need",
    answers: {
      forWhom: "self",
      gender: "male",
      age: "23_plus",
      programStatus: "graduated_or_near",
      knownPrograms: ["bina_asasi"],
      dailyTime: "expanded",
      needClarity: "specific_need",
      needPattern: ["reform_project"],
      prioritySignal: "reform_priority",
      omrTrack: "daiya",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      const visible = visibleQuestions({
        age: "23_plus",
        programStatus: "graduated_or_near",
        knownPrograms: ["bina_asasi"],
        dailyTime: "expanded",
        needClarity: "specific_need",
        needPattern: ["reform_project"],
        prioritySignal: "reform_priority",
      }).map((question: any) => question.id);
      assert(visible.includes("omrTrack"), "omrTrack should be visible with completed foundation, wide time, and clear reform need");
      assert(ids[0] === "omr_daiya", `expected selected omr track first, got ${ids.join(", ")}`);
      assert(result.stageInfo?.label === "مرحلتك الآن: عطاء طويل", "expected long-term giving stage");
    },
  },
];

for (const scenario of scenarios) {
  const result = calculateRecommendations(scenario.answers);
  scenario.expect(result);
  console.log(`ok - ${scenario.name}`);
}
