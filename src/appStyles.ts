export const styles = `
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
.why-box, .notice-box, .bridge-box { border-radius: 22px; padding: 18px; margin: 18px 0; }
.why-box { background: #edf8f3; border: 1px solid #cfeade; }
.notice-box { background: #fff5df; border: 1px solid #f0d8a7; }
.bridge-box { background: #eef5ff; border: 1px solid #c9dbf4; }
.why-box h3, .notice-box h3, .bridge-box h3, .alternatives-box h3, .compare-title { margin: 0 0 10px; }
.bridge-box p { color: var(--muted); line-height: 1.9; margin: 0 0 12px; }
.bridge-list { display: grid; gap: 10px; }
.bridge-item { display: grid; grid-template-columns: minmax(0, 1fr) auto auto; align-items: center; gap: 10px; background: white; border: 1px solid #dbe7f7; border-radius: 16px; padding: 12px; }
.bridge-item strong, .bridge-item small { display: block; }
.bridge-item strong { line-height: 1.6; }
.bridge-item small { color: var(--muted); line-height: 1.7; margin-top: 4px; }
.bridge-item span { color: var(--muted); font-size: 13px; font-weight: 700; white-space: nowrap; }
.bridge-item a { color: var(--green); font-weight: 800; text-decoration: none; white-space: nowrap; }
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
  .bridge-item { grid-template-columns: 1fr; align-items: start; }
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
html.dark .cc-details > div, html.dark .ds-blue, html.dark .ds-green, html.dark .ds-amber, html.dark .ds-rose, html.dark .why-box, html.dark .notice-box, html.dark .bridge-box, html.dark .bridge-item { background: #0f172a; border-color: #334155; }
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
