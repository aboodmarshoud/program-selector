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
      assert(result.notNowItems?.some((item: any) => item.id === "kharitat_thughur"), "expected kharitat to be explained as not first now");
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
