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
    name: "current bina + reform keeps current program first",
    answers: {
      forWhom: "friend",
      gender: "male",
      age: "23_plus",
      programStatus: "studying_committed",
      knownPrograms: ["bina_asasi"],
      dailyTime: "standard",
      needPattern: ["reform_project"],
      prioritySignal: "reform_priority",
      selectivity: "open",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(ids[0] === "bina_asasi", `expected bina_asasi first, got ${ids.join(", ")}`);
      assert(result.pathPlan?.label === "استمرار", "expected a continue path plan");
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
      needPattern: ["reform_project"],
      prioritySignal: "reform_priority",
      selectivity: "open",
      doubtImpact: "low",
    },
    expect: (result) => {
      const ids = topIds(result);
      assert(["bina_asasi", "bina_muyassar"].includes(ids[0]), `expected a bina track first, got ${ids.join(", ")}`);
      assert(result.pathPlan?.label === "تأسيس قبل الثغر", "expected foundation-before-reform path plan");
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
];

for (const scenario of scenarios) {
  const result = calculateRecommendations(scenario.answers);
  scenario.expect(result);
  console.log(`ok - ${scenario.name}`);
}
