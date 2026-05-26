import { useMemo, useState, useRef, useEffect, type CSSProperties } from "react";
import { Bar, BarChart, CartesianGrid, Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { motion, AnimatePresence } from "motion/react";
import { Moon, Sun } from "lucide-react";
import {
  IconBook2,
  IconAlertTriangle,
  IconArrowUp,
  IconBookmark,
  IconBooks,
  IconBrain,
  IconBulb,
  IconCalendarStats,
  IconCheck,
  IconChevronDown,
  IconCompass,
  IconDroplet,
  IconExternalLink,
  IconFileTypePdf,
  IconFlower,
  IconHeartHandshake,
  IconHome,
  IconLeaf,
  IconLifebuoy,
  IconLink,
  IconMap,
  IconMap2,
  IconMosque,
  IconNotebook,
  IconPlant,
  IconRoute,
  IconSchool,
  IconScript,
  IconSearch,
  IconSeedling,
  IconSpeakerphone,
  IconSparkles,
  IconSun,
  IconTargetArrow,
  IconTree,
  IconUser,
  IconUserHeart,
  IconUsers,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react";
import {
  getAnalyticsSession,
  loadAnalyticsSummary,
  signInToAnalytics,
  signOutFromAnalytics,
  trackAnalyticsEvent,
  type AnalyticsSummary,
} from "./analytics";
import { isSupabaseEnabled } from "./supabaseClient";
import { PROGRAMS } from "./programData";
import { calculateRecommendations } from "./recommendations";
import { asArray, choiceRank, hasAnswer, hasChoice } from "./answerUtils";
import { NEED_BRIDGE_ITEMS, OMR_TRACK_IDS, QUESTIONS, SELF_STUDY_BRIDGES, cleanAnswers, questionSubtitle, questionTitle, visibleQuestions } from "./quizFlow";



function isBinaProgram(program) {
  return program?.id === "bina_asasi" || program?.id === "bina_muyassar";
}

function publicProgramsList() {
  return Object.values(PROGRAMS).filter((program: any) => program.id !== "mashrou_al_omr");
}

function programFocusLabel(program: any) {
  const labels = {
    sharia: "التأصيل الشرعي",
    intellectual: "الوعي الفكري",
    tazkiyah: "التزكية",
    reform: "العمل الإصلاحي",
    skills: "المهارات",
  };
  return Object.entries(program.dimensions || {})
    .sort(([, a], [, b]) => Number(b) - Number(a))
    .slice(0, 2)
    .map(([key]) => labels[key] || key)
    .join("، ");
}

function SiteHeader({ mode, onHome, onPrograms, onSelfStudy, onCompare, onCompareDynamic, onStart }: any) {
  const [compareOpen, setCompareOpen] = useState(false);

  return (
    <header className="site-header">
      <button className="site-logo" type="button" onClick={onHome}>
        <span className="site-logo-dot" />
        <span>دليل اختيار البرامج</span>
      </button>
      <nav className="site-nav" aria-label="التنقل الرئيسي">
        <button className={mode === "programs" ? "active" : ""} type="button" onClick={onPrograms}>البرامج</button>
        <button className={mode === "selfStudy" ? "active" : ""} type="button" onClick={onSelfStudy}>الدراسة الذاتية</button>
        <div className={`site-menu ${compareOpen ? "open" : ""}`} onMouseEnter={() => setCompareOpen(true)} onMouseLeave={() => setCompareOpen(false)}>
          <button
            className={mode === "compare" || mode === "compareDynamic" ? "active" : ""}
            type="button"
            aria-expanded={compareOpen}
            onClick={() => setCompareOpen((current) => !current)}
          >
            مقارنة
          </button>
          <div className="site-dropdown" role="menu">
            <button type="button" onClick={() => { setCompareOpen(false); onCompare(); }} role="menuitem">مقارنة عامة</button>
            <button type="button" onClick={() => { setCompareOpen(false); onCompareDynamic(); }} role="menuitem">مقارنة مخصصة</button>
          </div>
        </div>
      </nav>
      <button className="site-start-btn" type="button" onClick={onStart}>ابدأ الاختبار</button>
    </header>
  );
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
      <div className="advice-kicker"><AdviceToneIcon tone={tone} />تنبيه قبل التسجيل</div>
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

function PathPlanCard({ plan }: any) {
  if (!plan) return null;
  return (
    <div className="path-plan-card">
      <div className="path-plan-kicker"><IconRoute size={18} stroke={1.8} />{plan.label}</div>
      <h2>{plan.title}</h2>
      <p>{plan.message}</p>
      {plan.points?.length > 0 && (
        <ul>
          {plan.points.map((point, index) => <li key={index}>{point}</li>)}
        </ul>
      )}
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
      <ProgramIcon id={program.id} className="mini-icon" size={24} />
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
      <h3><span className="ds-icon" aria-hidden="true">{icon}</span> {title}</h3>
      <ul>
        {items.map((item: any, index: number) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

function ResultMatchMeter({ percent = 100 }: { percent?: number }) {
  return (
    <div className="result-match-meter" style={{ "--match": `${percent * 3.6}deg` } as CSSProperties}>
      <strong>{percent}%</strong>
      <small>الأعلى توافقًا</small>
    </div>
  );
}

function ResultConfetti() {
  return (
    <div className="result-confetti" aria-hidden="true">
      {Array.from({ length: 12 }).map((_, index) => (
        <span key={index} />
      ))}
    </div>
  );
}

function FeatureIcon({ children }: any) {
  return <span className="feature-icon" aria-hidden="true">{children}</span>;
}

function studyIconForKind(kind = "") {
  if (kind.includes("تزكية")) return IconHeartHandshake;
  if (kind.includes("تربية")) return IconSchool;
  if (kind.includes("قرآن")) return IconBook2;
  if (kind.includes("فكر")) return IconBulb;
  if (kind.includes("إصلاح")) return IconTargetArrow;
  if (kind.includes("حديث")) return IconBooks;
  return IconNotebook;
}

const PROGRAM_ICON_MAP: Record<string, any> = {
  alim: IconMosque,
  bina_asasi: IconBooks,
  bina_muyassar: IconBookmark,
  fikri: IconBrain,
  bard_yaqin: IconDroplet,
  hadith: IconScript,
  kharitat_thughur: IconMap,
  mashrou_al_omr: IconTargetArrow,
  omr_mufakkir: IconBrain,
  omr_bahith: IconSearch,
  omr_talib_ilm: IconBooks,
  omr_daiya: IconSpeakerphone,
  omr_murabbi: IconUsersGroup,
  jeel_new: IconFlower,
  buthur: IconSeedling,
  juthur: IconPlant,
  ghiras: IconTree,
  ishraq: IconSun,
  ithmar: IconSparkles,
  khadija: IconUserHeart,
};

function ProgramIcon({ id, className = "program-icon", size = 28 }: any) {
  const Icon = PROGRAM_ICON_MAP[id] || IconBook2;
  return <span className={className} aria-hidden="true"><Icon size={size} stroke={1.8} /></span>;
}

function optionIconForValue(value = "", questionId = "") {
  if (questionId === "country" || ["europe", "north_america", "south_america", "africa_other", "asia_other", "other"].includes(value)) return IconWorld;
  if (["self", "male"].includes(value)) return IconUser;
  if (["child", "friend"].includes(value)) return IconUsers;
  if (["female", "women_space", "women_priority"].includes(value)) return IconUserHeart;
  if (value.includes("bina") || value.includes("talib") || value.includes("structured") || value.includes("curriculum")) return IconBooks;
  if (value.includes("fikri") || value.includes("mufakkir") || value.includes("intellectual") || value.includes("theoretical")) return IconBrain;
  if (value.includes("hadith") || value.includes("specialized")) return IconScript;
  if (value.includes("omr") || value.includes("reform") || value.includes("depth") || value.includes("kharitat")) return IconTargetArrow;
  if (value.includes("yaqin") || value.includes("certainty")) return IconDroplet;
  if (value.includes("khadija")) return IconUserHeart;
  if (value.includes("buthur") || value.includes("none") || value.includes("did_not_try") || value.includes("10_12")) return IconSeedling;
  if (value.includes("juthur")) return IconPlant;
  if (value.includes("ghiras")) return IconTree;
  if (value.includes("ishraq") || value.includes("ithmar") || value.includes("light") || value.includes("gentle") || value.includes("17_20")) return IconSun;
  if (value.includes("bahith")) return IconSearch;
  if (value.includes("daiya")) return IconSpeakerphone;
  if (value.includes("murabbi") || value.includes("relational")) return IconUsersGroup;
  if (value.includes("graduated")) return IconSchool;
  if (value.includes("struggling") || value.includes("difficulty")) return IconLifebuoy;
  if (value.includes("standard") || value.includes("medium")) return IconCalendarStats;
  if (value.includes("ok") || value.includes("studying_committed")) return IconCheck;
  if (questionId === "ageRange" || questionId === "dailyTime") return IconCalendarStats;
  return IconCompass;
}

function OptionGlyph({ option, questionId, size = 24 }: any) {
  const Icon = optionIconForValue(option?.value, questionId);
  return <Icon size={size} stroke={1.8} />;
}

function AdviceToneIcon({ tone }: any) {
  const Icon = tone === "green" ? IconCheck : tone === "blue" ? IconSchool : tone === "rose" ? IconAlertTriangle : IconAlertTriangle;
  return <Icon size={18} stroke={1.9} aria-hidden="true" />;
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
        <ProgramIcon id={program.id} className="program-hero-icon" size={42} />
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
      <DetailSection title="أهداف البرنامج" items={program.goals} icon={<IconTargetArrow size={24} stroke={1.8} />} colorClass="blue" />
      <DetailSection title="ماذا ستكتسب؟" items={program.outcomes} icon={<IconSparkles size={24} stroke={1.8} />} colorClass="green" />
      <DetailSection title="يناسبك إذا…" items={program.suitable} icon={<IconCheck size={24} stroke={1.8} />} colorClass="green" />
      <DetailSection title="انتبه قبل التسجيل…" items={program.caution} icon={<IconAlertTriangle size={24} stroke={1.8} />} colorClass="rose" />
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
  const list = publicProgramsList();
  return (
    <section className="comparison-page">
      <div className="section-head">
        <button className="ghost-btn" type="button" onClick={onBack}>العودة للرئيسية</button>
        <div><small>مقارنة عامة</small><h2>مقارنة مختصرة بين البرامج</h2><p>هذه المقارنة للاطلاع العام، أما الترشيح الأدق فابدأ اختبار الاختيار.</p></div>
      </div>
      <div className="comparison-table-wrap" style={{ overflowX: 'auto', borderRadius: '24px', padding: '16px', border: '1px solid var(--border)' }}>
        <table className="comparison-table" style={{ width: '100%', minWidth: '760px', textAlign: 'right', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>البرنامج</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>الفئة</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>المدة</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>طبيعة القبول</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}>التركيز الأبرز</th>
              <th style={{ padding: '12px', color: 'var(--muted)' }}></th>
            </tr>
          </thead>
          <tbody>
            {list.map((program) => (
              <tr key={program.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px' }}><strong className="inline-program-title"><ProgramIcon id={program.id} className="inline-program-icon" size={18} /> {program.name}</strong><br/><small style={{color:'var(--muted)'}}>{program.badge}</small></td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{program.audience}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{program.duration}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{program.selectivity}</td>
                <td style={{ padding: '12px', fontSize: '14px' }}>{programFocusLabel(program)}</td>
                <td style={{ padding: '12px' }}><button className="table-link ghost-btn" style={{ padding: '6px 12px', fontSize: '13px' }} type="button" onClick={() => onOpen(program.id)}>تفاصيل</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function HomeView({ onStart, onPrograms, onSelfStudy, onCompare, onCompareDynamic }: any) {
  const programCount = publicProgramsList().length;
  const selfStudyCount = SELF_STUDY_CATALOG.length;

  return (
    <>
      <section className="home-hero">
        <div className="hero-card">
          <div className="hero-badge">دليل اختيار برامج الشيخ أحمد بن يوسف السيد</div>
          <h1>ما البرنامج الأنسب لك الآن؟</h1>
          <p>لا تسجّل في كل برنامج تراه.. تعرّف على احتياجك، ومرحلتك، وطريقة التعلم التي تناسبك، ثم اختر البرنامج الأقرب بدل التشتت.</p>
          <button className="main-btn hero-primary" type="button" onClick={onStart}>ابدأ اختبار الاختيار</button>
          <span className="hero-secondary-note">نحو 5 دقائق · نتيجة مع أسباب وتنبيهات وبدائل</span>
          <div className="home-stats">
            <div><strong>{programCount}</strong><span>برنامجًا ومسارًا</span></div>
            <div><strong>{selfStudyCount}</strong><span>مادة ذاتية رديفة</span></div>
          </div>
        </div>
      </section>
      <section className="intro-grid">
        <div className="intro-card"><FeatureIcon><IconCompass size={30} stroke={1.8} /></FeatureIcon><h3>اختيار بحسب الحاجة</h3><p>الأسئلة لا تفترض برنامجًا مسبقًا، بل تقرأ احتياج الطالب وواقعه.</p></div>
        <div className="intro-card"><FeatureIcon><IconSchool size={30} stroke={1.8} /></FeatureIcon><h3>يراعي التجربة السابقة</h3><p>إذا كنت طالبًا حاليًا أو خريجًا أو منسحبًا، فالنتيجة تتعامل مع ذلك مباشرة.</p></div>
        <div className="intro-card"><FeatureIcon><IconBooks size={30} stroke={1.8} /></FeatureIcon><h3>نتيجة مع بدائل</h3><p>يعرض البرنامج الأقرب، ثم بدائل قريبة مع نسبة مناسبة.</p></div>
      </section>
      <div className="home-secondary-actions">
        <button className="ghost-btn" type="button" onClick={onPrograms}>استعراض البرامج</button>
        <button className="ghost-btn" type="button" onClick={onSelfStudy}>مواد الدراسة الذاتية</button>
        <button className="ghost-btn" type="button" onClick={onCompare}>مقارنة عامة</button>
        <button className="ghost-btn" type="button" onClick={onCompareDynamic}>مقارنة مخصصة</button>
      </div>
      <section className="program-map">
        <div className="section-head compact-head">
          <div><small>خريطة البرامج</small><h2>ابدأ من نوع الالتزام لا من اسم البرنامج</h2><p>الاختيار يصير أوضح عندما تعرف: هل تحتاج برنامجًا طويلًا، تجربة قصيرة، أم مادة ذاتية رديفة؟</p></div>
        </div>
        <div className="program-map-flow">
          <article className="map-step">
            <span className="map-step-number">1</span>
            <div>
              <small>التزام طويل</small>
              <h3>برامج جماعية ممتدة</h3>
              <p>مناسبة لمن يريد بناءً منتظمًا وله نفس لمتابعة خطة طويلة بدفعات ومهام.</p>
              <div className="map-chip-row">
                <span>البناء المنهجي</span><span>برد اليقين</span><span>مشروع العمر</span><span>عالِم</span><span>أكاديمية الحديث</span>
              </div>
            </div>
          </article>
          <article className="map-step">
            <span className="map-step-number">2</span>
            <div>
              <small>التزام قصير</small>
              <h3>برامج بدفعات محدودة</h3>
              <p>تصلح عند الحاجة إلى توجيه مركز في باب معين، دون الدخول مباشرة في مسار طويل.</p>
              <div className="map-chip-row">
                <span>خارطة الثغور</span><span>سقيا العشر</span>
              </div>
            </div>
          </article>
          <article className="map-step self-study-step">
            <span className="map-step-number">3</span>
            <div>
              <small>مسار رديف</small>
              <h3>مواد الدراسة الذاتية</h3>
              <p>ليست بديلًا عن البرنامج الشامل، لكنها نافعة كتهيئة قبل الدفعة القادمة أو تعميق لحاجة محددة.</p>
              <div className="map-chip-row">
                <span>دورة بوصلة المصلح</span><span>دورة تدريس المنهاج</span><span>الدورة التربوية</span><span>الدورة الفكرية</span>
              </div>
              <button className="main-btn" type="button" onClick={onSelfStudy}>استعراض مواد الدراسة الذاتية</button>
            </div>
          </article>
        </div>
      </section>
      <section className="golden-tips">
        <div className="golden-title">
          <IconSparkles size={34} stroke={1.7} />
          <h2>نصائح ذهبية</h2>
        </div>
        <div className="guidance-strip">
          <div tabIndex={0}><strong>قليل دائم خير من كثير منقطع</strong><span>لا تجعل الحماس المؤقت يفتح عليك أكثر مما تطيق.</span></div>
          <div tabIndex={0}><strong>الأصل لغير المتفرغ: برنامج واحد</strong><span>اجعل معيارك الاستمرار لا كثرة التسجيل.</span></div>
          <div tabIndex={0}><strong>لمن عنده وقت: غالبًا برنامجان بحد أقصى</strong><span>وذلك عند وضوح الحاجة وعدم تزاحم الواجبات.</span></div>
          <div tabIndex={0}><strong>من دخل عالِم لا يجمع معه غيره</strong><span>لأنه مسار ثقيل وطويل يحتاج نفسًا وتفرغًا ذهنيًا.</span></div>
          <div tabIndex={0}><strong>إذا لم تعرف حاجتك بدقة: البناء المنهجي</strong><span>لأنه أصل واسع يصلح لمن يريد تأسيسًا عامًا قبل التخصص أو اختيار مسار أضيق.</span></div>
        </div>
      </section>
    </>
  );
}

const SELF_STUDY_CATALOG = [
  { title: "التزكية للمصلحين", source: "مورد", url: "https://mawred.io/student/courses/13", kind: "تزكية", use: "لمن يحتاج تثبيت القلب وترتيب الباعث قبل أو أثناء البرنامج." },
  { title: "شرح المنهاج من ميراث النبوة", source: "مورد", url: "https://mawred.io/details/courses/9", kind: "تأسيس", use: "مادة تأسيسية تصلح قبل البناء أو كتمهيد لمن يحتاج ضبط الرؤية العامة." },
  { title: "حقيبة إحياء منهاج النبوة", source: "مورد", url: "https://mawred.io/details/courses/10", kind: "منهج وإصلاح", use: "نافعة لمن يريد فهم معنى الإحياء وربط العلم بالعمل." },
  { title: "مركزيات الإصلاح", source: "مورد", url: "https://mawred.io/details/courses/8", kind: "إصلاح", use: "مناسبة قبل المسارات الإصلاحية وخارطة الثغور ومشروع العمر." },
  { title: "الأمة بين احتلالين", source: "مورد", url: "https://mawred.io/details/courses/6", kind: "وعي", use: "لمن يريد فهمًا أوسع للواقع والسياق الحضاري والسياسي." },
  { title: "سلسلة خير القرون", source: "مورد", url: "https://mawred.io/details/courses/3", kind: "علم وسيرة", use: "تعين على بناء التصور الشرعي والتاريخي من القرون المفضلة." },
  { title: "مدارسة سورة الأنعام", source: "مورد", url: "https://mawred.io/details/courses/5", kind: "قرآن", use: "لمن يحتاج مادة قرآنية مركزة تقوي اليقين والرؤية." },
  { title: "صناعة المربي", source: "مورد", url: "https://mawred.io/details/courses/11", kind: "تربية", use: "لمن يميل إلى التربية وبناء البيئات ومرافقة الناس." },
  { title: "الاستهداء بالقرآن", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/8", kind: "قرآن", use: "لمن يريد تصحيح علاقته بالقرآن باعتباره هاديًا لا مادة سماع فقط." },
  { title: "الدورة الفكرية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/13", kind: "فكر", use: "لمن عنده أسئلة فكرية أو يريد مدخلًا إلى نقد التيارات." },
  { title: "الدورة التربوية", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/20", kind: "تربية", use: "نافعة لمن يحتاج مدخلًا تربويًا عمليًا قبل المحاضن أو معها." },
  { title: "حجية السنة", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/19", kind: "حديث", use: "لمن يميل لتخصص الحديث أو يحتاج تثبيت مركزية السنة." },
  { title: "بوصلة الإصلاح", source: "الأنشطة العامة", url: "https://anshitah1.com/student/courses/28?tab=lessons", kind: "إصلاح", use: "تمهيد عملي لمن يسأل عن الثغر والعمل والمشروع." },
];

function SelfStudyPage({ onBack }: any) {
  return (
    <section className="self-study-page">
      <div className="study-hero">
        <button className="ghost-btn" type="button" onClick={onBack}>العودة للرئيسية</button>
        <div>
          <small>الدراسة الذاتية</small>
          <h2>اختر مادة تخدم مرحلتك الآن</h2>
          <p>مسارات قصيرة ومركزة: تهيئة قبل الدفعات، أو تعميق لنقطة تحتاجها، أو رفيق خفيف بجانب برنامجك الأساسي.</p>
          <div className="study-hero-actions">
            <span><IconRoute size={18} /> تهيئة</span>
            <span><IconTargetArrow size={18} /> تعميق</span>
            <span><IconLifebuoy size={18} /> رفيق مؤقت</span>
          </div>
        </div>
      </div>
      <div className="study-lanes">
        <div><IconMap2 size={24} /><strong>قبل البرنامج</strong><span>اختر مادة تمهيدية حتى تفتح الدفعة.</span></div>
        <div><IconCalendarStats size={24} /><strong>أثناء البرنامج</strong><span>مادة واحدة فقط تخدم المسار ولا تزاحمه.</span></div>
        <div><IconCompass size={24} /><strong>بعد النتيجة</strong><span>استعمل الترشيح الرديف بحسب احتياجك.</span></div>
      </div>
      <div className="study-grid">
        {SELF_STUDY_CATALOG.map((item) => (
          <article className="study-card" key={item.title}>
            {(() => {
              const StudyIcon = studyIconForKind(item.kind);
              return <span className="study-card-icon" aria-hidden="true"><StudyIcon size={28} stroke={1.8} /></span>;
            })()}
            <div>
              <span className="study-kind">{item.kind}</span>
              <h3>{item.title}</h3>
              <small>{item.source}</small>
            </div>
            <p>{item.use}</p>
            <a href={item.url} target="_blank" rel="noreferrer">فتح المادة <IconExternalLink size={16} /></a>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProgramDirectory({ onOpen, onBack }: any) {
  const list = publicProgramsList();
  return (
    <section className="directory-page">
      <div className="section-head">
        <button className="ghost-btn" type="button" onClick={onBack}>العودة للرئيسية</button>
        <div><small>استعراض البرامج</small><h2>كل البرامج والمسارات</h2><p>استعراض سريع دون ترشيح. اضغط على أي برنامج لفتح تفاصيله.</p></div>
      </div>
      <div className="program-grid">
        {list.map((program) => (
          <button className="directory-card" type="button" key={program.id} onClick={() => onOpen(program.id)} style={{ borderColor: `${program.color}35` }}>
            <ProgramIcon id={program.id} className="directory-icon" size={34} />
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
  const list = publicProgramsList();

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
          <IconChevronDown size={18} stroke={1.8} aria-hidden="true" />
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
                    {isSelected && <IconCheck size={14} stroke={2.2} color="var(--green)" aria-hidden="true" />}
                  </div>
                  <span className="picker-program-title"><ProgramIcon id={prog.id} className="picker-program-icon" size={18} /> {prog.name}</span>
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
               <h3 className="cc-title"><ProgramIcon id={p.id} className="cc-title-icon" size={22} /> {p.name}</h3>
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
             <IconArrowUp size={34} stroke={1.8} aria-hidden="true" />
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

function bridgeReason(item, primary, answers) {
  const title = item.title || "";
  if (answers.dailyTime === "light") return "لأن الوقت محدود؛ اجعلها مادة واحدة خفيفة لا خطة مزدحمة.";
  if (title.includes("التزكية") || title.includes("الاستهداء")) return "لأن إجاباتك تشير إلى حاجة إيمانية أو تثبيت قلبي.";
  if (title.includes("الفكرية") || title.includes("احتلالين")) return "لأن في إجاباتك ميلًا لفهم الأفكار والواقع المعاصر.";
  if (title.includes("مركزيات") || title.includes("بوصلة")) return "لأن النتيجة تميل إلى العمل الإصلاحي وفهم الثغر.";
  if (title.includes("المربي") || title.includes("التربوية")) return "لأن الاحتياج قريب من التربية والبيئة والمتابعة.";
  if (title.includes("حجية السنة") || title.includes("خير القرون")) return "لأن المسار المقترح يحتاج تعميقًا علميًا منضبطًا.";
  if (title.includes("المنهاج")) return "لأنها مادة تأسيسية نافعة قبل أو أثناء كثير من المسارات.";
  if (OMR_TRACK_IDS.includes(primary.id)) return "لتهيئة المسار قبل فتح دفعات مشروع العمر.";
  return "لأنها أقرب مادة رديفة لطبيعة البرنامج المقترح.";
}

function bridgeScore(item, primary, answers, index) {
  let score = 100 - index;
  const title = item.title || "";
  const needs = asArray(answers.needPattern);

  if (needs.includes("certainty") || answers.prioritySignal === "certainty_priority" || answers.doubtImpact === "high") {
    if (title.includes("التزكية") || title.includes("الاستهداء") || title.includes("المدرسة الرمضانية")) score += 45;
  }
  if (needs.includes("intellectual_depth") || answers.prioritySignal === "intellectual_priority" || answers.doubtImpact === "theoretical") {
    if (title.includes("الفكرية") || title.includes("احتلالين")) score += 45;
  }
  if (needs.includes("reform_project") || answers.prioritySignal === "reform_priority" || primary.id === "kharitat_thughur" || OMR_TRACK_IDS.includes(primary.id)) {
    if (title.includes("مركزيات") || title.includes("بوصلة") || title.includes("إحياء")) score += 45;
  }
  if (needs.includes("relational_growth") || answers.prioritySignal === "environment_priority" || primary.id === "khadija") {
    if (title.includes("المربي") || title.includes("التربوية") || title.includes("التزكية")) score += 38;
  }
  if (needs.includes("structured_path") || answers.prioritySignal === "curriculum_priority" || primary.id.includes("bina")) {
    if (title.includes("المنهاج") || title.includes("خير القرون")) score += 34;
  }
  if (needs.includes("specialized_track") || answers.prioritySignal === "depth_priority" || primary.id === "hadith") {
    if (title.includes("حجية السنة") || title.includes("المنهاج")) score += 34;
  }
  if (answers.dailyTime === "light") score -= index * 8;

  return score;
}

function uniqueBridgeItems(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.url || item.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function getBridgePlan(primary, answers) {
  const baseItems = SELF_STUDY_BRIDGES[primary.id] || [];
  const needItems = asArray(answers.needPattern).flatMap((need) => NEED_BRIDGE_ITEMS[need] || []);
  const priorityItems = {
    curriculum_priority: NEED_BRIDGE_ITEMS.structured_path,
    certainty_priority: NEED_BRIDGE_ITEMS.certainty,
    intellectual_priority: NEED_BRIDGE_ITEMS.intellectual_depth,
    depth_priority: NEED_BRIDGE_ITEMS.specialized_track,
    reform_priority: NEED_BRIDGE_ITEMS.reform_project,
    environment_priority: NEED_BRIDGE_ITEMS.relational_growth,
    women_priority: NEED_BRIDGE_ITEMS.women_space,
  }[answers.prioritySignal] || [];
  const items = uniqueBridgeItems([...baseItems, ...needItems, ...priorityItems]);
  if (!items.length) return null;

  let note = "هذه ليست بديلًا عن البرنامج، بل مسار خفيف ريثما تفتح الدفعة القادمة أو لتتهيأ قبل الدخول.";
  if (primary.id === "alim") {
    note = "إن ظهر لك برنامج عالِم، فالأصل ألا تجمع معه برنامجًا آخر؛ اجعل هذه المواد للتهيئة والتثبيت فقط.";
  } else if (answers.dailyTime === "light") {
    note = "بما أن الوقت محدود، اختر مادة واحدة فقط ولا تجعل المسار الرديف سببًا في الانقطاع.";
  } else if (OMR_TRACK_IDS.includes(primary.id)) {
    note = "مشروع العمر يفتح على دفعات، وغالبًا يحتاج أصلًا سابقًا كالبناء المنهجي؛ هذه المواد للتهيئة وفهم سؤال الثغر لا للاستبدال.";
  } else if (primary.id === "kharitat_thughur") {
    note = "خارطة الثغور برنامج دفعات مدته قرابة 3–4 أشهر، وهذه مواد قبلية تساعدك على التجهز حتى تفتح دفعة مناسبة.";
  }

  const plannedItems = items
    .map((item, index) => ({
      ...item,
      reason: bridgeReason(item, primary, answers),
      score: bridgeScore(item, primary, answers, index),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, answers.dailyTime === "light" ? 2 : 3);

  return { items: plannedItems, note };
}

function BridgePlan({ plan }: any) {
  if (!plan) return null;

  return (
    <div className="bridge-box">
      <h3>مسار ذاتي رديف مدروس</h3>
      <p>{plan.note}</p>
      <div className="bridge-list">
        {plan.items.map((item, index) => (
          <div className="bridge-item" key={`${item.title}-${index}`}>
            <div>
              <strong>{item.title}</strong>
              {item.reason && <small>{item.reason}</small>}
            </div>
            <span>{item.source}</span>
            {item.url && <a href={item.url} target="_blank" rel="noreferrer">فتح المادة</a>}
          </div>
        ))}
      </div>
    </div>
  );
}

function ResultView({ result, answers, onOpen, onRestart, onHome }: any) {
  const list = result.list;
  const primary = list[0];
  const alternatives = list.slice(1, 4);
  const showBinaComparison = isBinaProgram(primary);
  const bridgePlan = getBridgePlan(primary, answers);
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
      <ResultConfetti />
      <div className="share-top" data-html2canvas-ignore="true" style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button className="share-btn home-btn-fix2" type="button" onClick={onHome}>
          <IconHome size={18} stroke={1.8} aria-hidden="true" /> الرئيسية
        </button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="share-btn" type="button" onClick={handleDownloadPDF}>
            <IconFileTypePdf size={18} stroke={1.8} aria-hidden="true" /> حفظ كملف PDF
          </button>
          <button className="share-btn" type="button" onClick={handleShare}>
            <IconLink size={18} stroke={1.8} aria-hidden="true" /> مشاركة الرابط
          </button>
        </div>
      </div>

      <AdviceCard advice={result.advice} onOpen={onOpen} />
      <PathPlanCard plan={result.pathPlan} />

      <div className="result-main" style={{ borderColor: `${primary.color}55` }}>
        <div className="result-top" style={{ background: `linear-gradient(135deg, ${primary.soft}, #ffffff)` }}>
          <ProgramIcon id={primary.id} className="result-icon" size={42} />
          <div>
            <div className="result-label">البرنامج الأقرب لاحتياجك الآن</div>
            <h2>{primary.name}</h2>
            <p>{primary.description}</p>
          </div>
          <ResultMatchMeter />
        </div>
        <div className="result-body">
          <div className="detail-grid">
            <div><small>المدة</small><strong>{primary.duration}</strong></div>
            <div><small>الفئة</small><strong>{primary.audience}</strong></div>
            <div><small>طبيعة القبول</small><strong>{primary.selectivity}</strong></div>
            <div><small>التكلفة</small><strong>{primary.cost}</strong></div>
            <div><small>الوسيلة</small><strong>{primary.medium}</strong></div>
            <div><small>التسجيل</small><strong>{primary.registrationStatus}</strong></div>
            <div><small>طبيعة الترشيح</small><strong>{primary.recommendationRole || "برنامج أساسي"}</strong></div>
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

          <div className="result-actions" data-html2canvas-ignore="true">
            <button className="main-btn" type="button" onClick={() => onOpen(primary.id)}>افتح تفاصيل البرنامج</button>
            <button className="ghost-btn restart-btn-fix" type="button" onClick={onRestart}>
              <IconRoute size={18} stroke={1.8} aria-hidden="true" /> إعــادة الاختبــار
            </button>
          </div>
        </div>
      </div>

      <BridgePlan plan={bridgePlan} />

      <DimensionChart profile={result.profile} program={primary} />

      {showBinaComparison && <BinaComparison />}

      {alternatives.length > 0 && (
        <div className="alternatives-box">
          <h3>بدائل قريبة</h3>
          <p>قد تكون مناسبة أيضًا بحسب بعض إجاباتك.</p>
          {alternatives.map((program, index) => <ProgramMini key={program.id} program={program} index={index} onOpen={onOpen} primaryScore={primary.score} />)}
        </div>
      )}

      <div className="notice-box disclaimer-box">
        <h3>تنبيه</h3>
        <p>
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

  function navigateMode(nextMode: string) {
    setMode(nextMode);
    setOpenedProgramId(null);
    setShowResult(false);
  }

  function closeProgram() {
    setOpenedProgramId(null);
  }

  return (
    <div className={`selector-root ${darkMode ? 'dark' : ''}`} dir="rtl">
      <button 
        className="theme-toggle" 
        onClick={() => setDarkMode(!darkMode)}
        title={darkMode ? "الوضع الفاتح" : "الوضع الداكن"}
        data-html2canvas-ignore="true"
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <SiteHeader
        mode={mode}
        onHome={goHome}
        onPrograms={() => navigateMode("programs")}
        onSelfStudy={() => navigateMode("selfStudy")}
        onCompare={() => navigateMode("compare")}
        onCompareDynamic={() => navigateMode("compareDynamic")}
        onStart={startQuiz}
      />

      <main className="app-shell">
        <AnimatePresence mode="wait">
          {openedProgram && (
            <motion.div key="detail" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <ProgramDetail program={openedProgram} onBack={closeProgram} onHome={goHome} />
            </motion.div>
          )}

          {mode === "home" && !openedProgram && (
            <motion.div key="home" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <HomeView onStart={startQuiz} onPrograms={() => setMode("programs")} onSelfStudy={() => setMode("selfStudy")} onCompare={() => setMode("compare")} onCompareDynamic={() => setMode("compareDynamic")} />
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

          {mode === "selfStudy" && !openedProgram && (
            <motion.div key="selfStudy" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.98 }} transition={{ duration: 0.25 }}>
              <SelfStudyPage onBack={goHome} />
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

              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  className="question-panel"
                  initial={{ opacity: 0, x: 26 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -26 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                >
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
                          <option key={opt.value} value={opt.value}>{opt.title}</option>
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
                            {current.multi && hasChoice(answers[current.id], opt.value) ? <b className="rank-badge">{choiceRank(answers[current.id], opt.value) + 1}</b> : <OptionGlyph option={opt} questionId={current.id} />}
                          </span>
                          <span className="option-copy"><strong>{opt.title}</strong>{opt.sub && <small>{opt.sub}</small>}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

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
