export type Option = {
  value: string;
  title: string;
  sub: string;
  icon: string;
};

export type AnswerMap = Record<string, unknown> & {
  age?: string;
  currentPrograms?: string | string[];
  graduatedPrograms?: string | string[];
  knownPrograms?: string | string[];
  programStatus?: string;
};

export function option(value: string, title: string, sub = "", icon = ""): Option {
  return { value, title, sub, icon };
}

export function asArray<T = string>(value: T | T[] | null | undefined): T[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function hasChoice(value: unknown, choice: string): boolean {
  return asArray<string>(value as string | string[] | null | undefined).includes(choice);
}

export function choiceRank(value: unknown, choice: string): number {
  return asArray<string>(value as string | string[] | null | undefined).indexOf(choice);
}

export function rankWeight(value: unknown, choice: string): number {
  const rank = choiceRank(value, choice);
  if (rank < 0) return 0;
  return [1, 0.74, 0.55, 0.4, 0.3, 0.22][rank] ?? 0.18;
}

export function hasAnswer(value: unknown): boolean {
  if (typeof value === "string") return value.trim().length > 0;
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

export function isAgeAtLeast15(a: AnswerMap): boolean {
  return ["15_16", "17_20", "21_22", "23_plus"].includes(a.age);
}

export function isYouthAcademyAge(a: AnswerMap): boolean {
  return ["7_9", "10_12", "13_14", "15_16", "17_20"].includes(a.age);
}

export function isCurrentStatus(a: AnswerMap): boolean {
  return a.programStatus === "studying_committed" || a.programStatus === "studying_struggling";
}

export function isGraduatedStatus(a: AnswerMap): boolean {
  return a.programStatus === "graduated_or_near";
}

export function getCurrentPrograms(a: AnswerMap): string[] {
  if (isCurrentStatus(a)) return asArray(a.knownPrograms);
  if (a.programStatus === "studying_and_graduated") return asArray(a.currentPrograms);
  return [];
}

export function getGraduatedPrograms(a: AnswerMap): string[] {
  if (isGraduatedStatus(a)) return asArray(a.knownPrograms);
  if (a.programStatus === "studying_and_graduated") return asArray(a.graduatedPrograms);
  return [];
}

export function knownPrograms(a: AnswerMap): string[] {
  const arr: string[] = [];
  if (a.knownPrograms) arr.push(...asArray(a.knownPrograms));
  if (a.graduatedPrograms) arr.push(...asArray(a.graduatedPrograms));
  if (a.currentPrograms) arr.push(...asArray(a.currentPrograms));
  return Array.from(new Set(arr));
}

export function hasKnown(a: AnswerMap, id: string): boolean {
  return knownPrograms(a).includes(id);
}

export function completedJuthurOrIshraq(a: AnswerMap): boolean {
  if (hasKnown(a, "ithmar")) return true;
  const grads = getGraduatedPrograms(a);
  return grads.includes("juthur") || grads.includes("ishraq");
}
