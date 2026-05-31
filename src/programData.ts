// بيانات البرامج صارت تُحمَّل من ملف JSON (programs.json) ليسهل تحديثها دون لمس الشيفرة.
// هذه خطوة نقل البيانات إلى JSON المشار إليها في README.
import programsData from "./programs.json";

export const PROGRAMS: Record<string, any> = programsData as Record<string, any>;
