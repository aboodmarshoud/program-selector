export function option(value, title, sub = "", icon = "") {
  return { value, title, sub, icon };
}

export function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

export function hasChoice(value, choice) {
  return asArray(value).includes(choice);
}

export function choiceRank(value, choice) {
  return asArray(value).indexOf(choice);
}

export function rankWeight(value, choice) {
  const rank = choiceRank(value, choice);
  if (rank < 0) return 0;
  return [1, 0.74, 0.55, 0.4, 0.3, 0.22][rank] ?? 0.18;
}

export function hasAnswer(value) {
  if (typeof value === "string") return value.trim().length > 0;
  return Array.isArray(value) ? value.length > 0 : Boolean(value);
}

export function isAgeAtLeast15(a) {
  return ["15_16", "17_20", "21_22", "23_plus"].includes(a.age);
}

export function isYouthAcademyAge(a) {
  return ["7_9", "10_12", "13_14", "15_16", "17_20"].includes(a.age);
}

export function isCurrentStatus(a) {
  return a.programStatus === "studying_committed" || a.programStatus === "studying_struggling";
}

export function isGraduatedStatus(a) {
  return a.programStatus === "graduated_or_near";
}

export function getCurrentPrograms(a) {
  if (isCurrentStatus(a)) return asArray(a.knownPrograms);
  if (a.programStatus === "studying_and_graduated") return asArray(a.currentPrograms);
  return [];
}

export function getGraduatedPrograms(a) {
  if (isGraduatedStatus(a)) return asArray(a.knownPrograms);
  if (a.programStatus === "studying_and_graduated") return asArray(a.graduatedPrograms);
  return [];
}

export function knownPrograms(a) {
  const arr = [];
  if (a.knownPrograms) arr.push(...asArray(a.knownPrograms));
  if (a.graduatedPrograms) arr.push(...asArray(a.graduatedPrograms));
  if (a.currentPrograms) arr.push(...asArray(a.currentPrograms));
  return Array.from(new Set(arr));
}

export function hasKnown(a, id) {
  return knownPrograms(a).includes(id);
}

export function completedJuthurOrIshraq(a) {
  if (hasKnown(a, "ithmar")) return true;
  const grads = getGraduatedPrograms(a);
  return grads.includes("juthur") || grads.includes("ishraq");
}
