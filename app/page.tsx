"use client";

import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import Image from "next/image";

type View = "home" | "planner" | "saved";
type GenerationStep = "idle" | "reading" | "reasoning" | "generating" | "ready";
type LessonSection = { id: string; title: string; content: string };
type LessonPlan = {
  id: string;
  title: string;
  grade: string;
  subject: string;
  topic: string;
  duration: number;
  objective: string;
  materials: string;
  support: string;
  sections: LessonSection[];
  updatedAt: string;
};
type PlannerFields = Omit<LessonPlan, "id" | "title" | "sections" | "updatedAt">;

const DEMO_USERNAME = "lan";
const DEMO_PASSWORD = "classbloom";

const examples: Array<PlannerFields & { label: string; icon: string; description: string }> = [
  {
    label: "Vòng đời của cây",
    icon: "🌱",
    description: "Khoa học · Lớp 3 · 35 phút",
    grade: "Lớp 3",
    subject: "Khoa học",
    topic: "Vòng đời của cây",
    duration: 35,
    objective: "Học sinh mô tả được các giai đoạn chính trong vòng đời của một cây có hoa.",
    materials: "Tranh vòng đời cây, hạt đậu, giấy A3, bút màu",
    support: "Cung cấp từ khóa và hình ảnh gợi ý cho học sinh cần hỗ trợ.",
  },
  {
    label: "Phân số quanh em",
    icon: "🍕",
    description: "Toán · Lớp 4 · 40 phút",
    grade: "Lớp 4",
    subject: "Toán",
    topic: "Phân số quanh em",
    duration: 40,
    objective: "Học sinh nhận biết, đọc và biểu diễn được phân số trong các tình huống quen thuộc.",
    materials: "Thẻ hình pizza, thanh phân số, phiếu học tập",
    support: "Ghép cặp hỗ trợ và cho phép học sinh dùng thanh phân số khi giải thích.",
  },
  {
    label: "Bưu thiếp quê hương",
    icon: "✉️",
    description: "Tiếng Việt · Lớp 2 · 30 phút",
    grade: "Lớp 2",
    subject: "Tiếng Việt",
    topic: "Bưu thiếp quê hương",
    duration: 30,
    objective: "Học sinh viết được một bưu thiếp ngắn với lời chào, nội dung chính và lời chúc.",
    materials: "Bưu thiếp mẫu, giấy màu, bút sáp, bảng từ vựng",
    support: "Đưa khung câu mở đầu và bảng từ gợi ý cho học sinh đang phát triển vốn từ.",
  },
];

const emptyFields: PlannerFields = {
  grade: "Lớp 3",
  subject: "Khoa học",
  topic: "",
  duration: 35,
  objective: "",
  materials: "",
  support: "",
};

function generatePlan(fields: PlannerFields): LessonPlan {
  const title = fields.topic || "Bài học mới";
  const firstHalf = Math.max(8, Math.round(fields.duration * 0.35));
  const secondHalf = Math.max(8, Math.round(fields.duration * 0.4));
  const closing = Math.max(5, fields.duration - firstHalf - secondHalf);
  return {
    id: `plan-${Date.now()}`,
    title,
    ...fields,
    sections: [
      { id: "goal", title: "Mục tiêu học tập", content: fields.objective || `Học sinh hiểu và vận dụng được kiến thức cốt lõi về ${title.toLowerCase()}.` },
      { id: "prepare", title: "Chuẩn bị", content: fields.materials || "Bảng, bút dạ, phiếu học tập và các học liệu trực quan phù hợp." },
      { id: "warmup", title: `1. Khởi động · ${firstHalf} phút`, content: `Giáo viên đưa ra một câu hỏi gợi mở về ${title.toLowerCase()}. Học sinh suy nghĩ cá nhân, sau đó chia sẻ nhanh với bạn bên cạnh. Cùng lớp chốt lại điều đã biết và câu hỏi muốn khám phá.` },
      { id: "explore", title: `2. Khám phá và thực hành · ${secondHalf} phút`, content: `Học sinh làm việc theo nhóm nhỏ để quan sát, thử nghiệm hoặc xử lý nhiệm vụ về ${title.toLowerCase()}. Mỗi nhóm ghi lại một phát hiện và trình bày bằng lời nói, hình vẽ hoặc ví dụ. Giáo viên đi tới các nhóm, đặt câu hỏi mở và hỗ trợ đúng lúc.` },
      { id: "check", title: "Kiểm tra hiểu bài", content: "Học sinh hoàn thành một phiếu kiểm tra nhanh gồm 2 câu hỏi. Giáo viên dùng tín hiệu ngón tay hoặc thẻ màu để nhận diện mức độ tự tin và điều chỉnh hỗ trợ." },
      { id: "adapt", title: "Điều chỉnh và hỗ trợ", content: fields.support || "Cung cấp thêm hình ảnh, từ khóa và một ví dụ mẫu. Cho phép học sinh trình bày bằng hình vẽ hoặc nói trước khi viết." },
      { id: "close", title: `3. Kết nối và kết thúc · ${closing} phút`, content: "Mỗi học sinh hoàn thành câu: “Hôm nay em đã…”. Giáo viên mời 2-3 em chia sẻ, ghi nhận nỗ lực và giới thiệu một câu hỏi nhỏ để mang về nhà." },
    ],
    updatedAt: new Date().toISOString(),
  };
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("vi-VN", { day: "numeric", month: "short" }).format(new Date(value));
}

function formatTodayInVietnam() {
  const formatted = new Intl.DateTimeFormat("vi-VN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(new Date());
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

const generationSteps: Array<{ id: Exclude<GenerationStep, "idle">; label: string; detail: string }> = [
  { id: "reading", label: "Đọc yêu cầu", detail: "Nắm bắt mục tiêu và bối cảnh lớp học" },
  { id: "reasoning", label: "Suy luận cấu trúc", detail: "Chọn hoạt động phù hợp với thời lượng" },
  { id: "generating", label: "Tạo nội dung", detail: "Viết các bước dạy học và điểm kiểm tra" },
  { id: "ready", label: "Sẵn sàng để xem lại", detail: "Bản nháp đã hoàn thành" },
];

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginUsername, setLoginUsername] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [view, setView] = useState<View>("home");
  const [fields, setFields] = useState<PlannerFields>(emptyFields);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [notice, setNotice] = useState("");
  const [generationStep, setGenerationStep] = useState<GenerationStep>("idle");
  const [generationFields, setGenerationFields] = useState<PlannerFields | null>(null);

  useEffect(() => {
    const stored = window.localStorage.getItem("classbloom-plans");
    if (stored) setSavedPlans(JSON.parse(stored) as LessonPlan[]);
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) window.localStorage.setItem("classbloom-plans", JSON.stringify(savedPlans));
  }, [isHydrated, savedPlans]);

  useEffect(() => {
    if (generationStep === "idle" || !generationFields) return;
    const currentIndex = generationSteps.findIndex((step) => step.id === generationStep);
    const timer = window.setTimeout(() => {
      if (generationStep === "ready") {
        setPlan(generatePlan(generationFields));
        setGenerationStep("idle");
        return;
      }
      setGenerationStep(generationSteps[currentIndex + 1]?.id || "idle");
    }, generationStep === "ready" ? 1400 : 1300);
    return () => window.clearTimeout(timer);
  }, [generationFields, generationStep]);

  const recentPlans = useMemo(() => savedPlans.slice(0, 3), [savedPlans]);

  function updateField<K extends keyof PlannerFields>(key: K, value: PlannerFields[K]) {
    setFields((current) => ({ ...current, [key]: value }));
  }

  function openPlanner(example?: PlannerFields) {
    setFields(example || emptyFields);
    setPlan(null);
    setGenerationStep("idle");
    setGenerationFields(null);
    setNotice("");
    setView("planner");
  }

  function createPlan() {
    if (!fields.topic.trim()) {
      setNotice("Thêm chủ đề để ClassBloom có thể gợi ý bài dạy cho bạn.");
      return;
    }
    setPlan(null);
    setGenerationFields({ ...fields });
    setGenerationStep("reading");
    setNotice("");
  }

  function savePlan() {
    if (!plan) return;
    const nextPlan = { ...plan, updatedAt: new Date().toISOString() };
    setSavedPlans((current) => [nextPlan, ...current.filter((item) => item.id !== nextPlan.id)]);
    setPlan(nextPlan);
    setNotice("Đã lưu vào kế hoạch của bạn.");
  }

  function refinePlan(action: "shorten" | "groups" | "support") {
    if (!plan) return;
    const copy = structuredClone(plan) as LessonPlan;
    if (action === "shorten") copy.sections = copy.sections.map((section) => ({ ...section, content: section.content.replace("Học sinh", "Các em") }));
    if (action === "groups") copy.sections = copy.sections.map((section) => section.id === "explore" ? { ...section, content: `${section.content} Mỗi nhóm phân công một người điều phối, một người ghi chép và một người chia sẻ.` } : section);
    if (action === "support") copy.sections = copy.sections.map((section) => section.id === "adapt" ? { ...section, content: `${section.content} Cho học sinh thêm thời gian xử lý và kiểm tra lại hướng dẫn bằng cách nhắc lại yêu cầu theo từng bước.` } : section);
    setPlan(copy);
    setNotice("Đã cập nhật bản nháp theo gợi ý của bạn.");
  }

  function updateSection(id: string, content: string) {
    setPlan((current) => current ? { ...current, sections: current.sections.map((section) => section.id === id ? { ...section, content } : section) } : current);
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (loginUsername.trim().toLowerCase() === DEMO_USERNAME && loginPassword === DEMO_PASSWORD) {
      setIsAuthenticated(true);
      setLoginError("");
      return;
    }
    setLoginError("Tên đăng nhập hoặc mật khẩu chưa đúng. Hãy dùng tài khoản demo bên dưới.");
  }

  if (!isAuthenticated) {
    return (
      <main className="login-shell">
        <section className="login-card" aria-labelledby="login-title">
          <div className="login-brand"><span className="brand-mark">✦</span><span>Class<span>Bloom</span></span></div>
          <h1 id="login-title">Đăng nhập</h1>
          <p className="login-intro">Nền tảng AI hỗ trợ giáo viên.</p>
          <form className="login-form" onSubmit={handleLogin} noValidate>
            <label htmlFor="login-username">Tên đăng nhập</label>
            <input id="login-username" name="username" type="text" autoComplete="username" value={loginUsername} onChange={(event) => setLoginUsername(event.target.value)} required />
            <label htmlFor="login-password">Mật khẩu</label>
            <input id="login-password" name="password" type="password" autoComplete="current-password" value={loginPassword} onChange={(event) => setLoginPassword(event.target.value)} required />
            {loginError && <p className="login-error" role="alert">{loginError}</p>}
            <button className="primary-button login-submit" type="submit">Đăng nhập <span>→</span></button>
          </form>
          <div className="demo-credentials" aria-label="Thông tin tài khoản demo"><strong>Tài khoản demo</strong><span>Tên đăng nhập: <b>lan</b></span><span>Mật khẩu: <b>classbloom</b></span></div>
          <p className="login-note">Demo purpose only. Data will not be stored.</p>
        </section>
        <div className="login-side-logo" aria-hidden="true"><Image src="/assets/logo.svg" alt="" width={300} height={240} priority /></div>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setView("home")} aria-label="Về trang chủ ClassBloom">
          <span className="brand-mark">✦</span><span>Class<span>Bloom</span></span>
        </button>
        <nav className="main-nav" aria-label="Điều hướng chính">
          <button className={view === "home" ? "nav-link active" : "nav-link"} onClick={() => setView("home")}>Trang chủ</button>
          <button className={view === "planner" ? "nav-link active" : "nav-link"} onClick={() => openPlanner()}>Soạn bài</button>
          <button className={view === "saved" ? "nav-link active" : "nav-link"} onClick={() => setView("saved")}>Kế hoạch đã lưu <span className="nav-count">{savedPlans.length}</span></button>
        </nav>
        <div className="profile-chip"><span className="avatar">LN</span><span className="profile-name">Cô Lan</span><span className="chevron">⌄</span></div>
      </header>

      {view === "home" && <section className="page home-page">
        <div className="welcome-row"><div><p className="eyebrow">{formatTodayInVietnam()}</p><h1>Chào cô Lan <span className="wave">👋</span></h1><p className="subhead">Hôm nay mình cùng tạo nên một tiết học thật đáng nhớ nhé.</p></div><div className="sparkle-note"><span>✦</span><p><strong>Gợi ý nhỏ</strong><br />Một kế hoạch tốt bắt đầu<br />từ một câu hỏi hay.</p></div></div>
        <div className="hero-card"><div className="hero-copy"><span className="pill">KHÔNG GIAN SOẠN BÀI</span><h2>Biến ý tưởng thành<br /><em>tiết học có hồn.</em></h2><p>ClassBloom giúp cô dành nhiều thời gian hơn cho học sinh, và ít thời gian hơn cho những trang giấy trắng.</p><button className="primary-button" onClick={() => openPlanner()}>Soạn bài mới <span>→</span></button></div><div className="hero-illustration" aria-hidden="true"><div className="sun">✦</div><div className="plant plant-one">❧</div><div className="plant plant-two">❧</div><div className="paper paper-back"></div><div className="paper paper-front"><span>✦</span><b>Ý tưởng</b><i>→</i></div><div className="hero-blob"></div></div></div>
        <div className="section-heading"><div><p className="eyebrow">BẮT ĐẦU NHANH</p><h2>Chọn một ý tưởng để bắt đầu</h2></div><button className="text-button" onClick={() => setView("planner")}>Xem tất cả <span>→</span></button></div>
        <div className="example-grid">{examples.map((example) => <button className="example-card" key={example.label} onClick={() => openPlanner(example)}><span className="example-icon">{example.icon}</span><span className="example-label">{example.label}</span><span className="example-description">{example.description}</span><span className="card-arrow">↗</span></button>)}</div>
        <div className="section-heading recent-heading"><div><p className="eyebrow">MỞ LẠI NHANH</p><h2>Kế hoạch gần đây</h2></div><button className="text-button" onClick={() => setView("saved")}>Xem tất cả <span>→</span></button></div>
        {recentPlans.length ? <div className="recent-list">{recentPlans.map((item) => <button className="recent-item" key={item.id} onClick={() => { setPlan(item); setFields(item); setView("planner"); }}><span className="recent-dot">✦</span><span><b>{item.title}</b><small>{item.subject} · {item.grade} · Cập nhật {formatDate(item.updatedAt)}</small></span><span>→</span></button>)}</div> : <div className="empty-recent"><span>☼</span><p>Chưa có kế hoạch nào được lưu.<br /><button className="inline-link" onClick={() => openPlanner()}>Tạo kế hoạch đầu tiên →</button></p></div>}
      </section>}

      {view === "planner" && <section className="planner-page page"><div className="planner-header"><div><button className="back-button" onClick={() => setView("home")}>← Trang chủ</button><p className="eyebrow">KHÔNG GIAN SOẠN BÀI</p><h1>{plan ? plan.title : "Tạo kế hoạch bài dạy"}</h1><p className="subhead">Điền vài thông tin, ClassBloom sẽ giúp cô phác thảo phần còn lại.</p></div>{plan && <div className="planner-actions"><button className="secondary-button" onClick={() => window.print()}>⌁ In kế hoạch</button><button className="primary-button compact" onClick={savePlan}>♡ Lưu kế hoạch</button></div>}</div><div className="planner-layout"><aside className="input-panel"><div className="panel-heading"><span className="step-number">01</span><div><p className="eyebrow">THÔNG TIN BÀI DẠY</p><h2>Bắt đầu từ đây</h2></div></div><label>Lớp học<select value={fields.grade} onChange={(event) => updateField("grade", event.target.value)}><option>Lớp 1</option><option>Lớp 2</option><option>Lớp 3</option><option>Lớp 4</option><option>Lớp 5</option></select></label><label>Môn học<select value={fields.subject} onChange={(event) => updateField("subject", event.target.value)}><option>Toán</option><option>Tiếng Việt</option><option>Khoa học</option><option>Tự nhiên và Xã hội</option><option>Đạo đức</option></select></label><label>Chủ đề bài học<span className="input-hint">Bắt buộc</span><input placeholder="Ví dụ: Vòng đời của cây" value={fields.topic} onChange={(event) => updateField("topic", event.target.value)} /></label><label>Thời lượng <span className="input-hint">phút</span><input type="number" min="15" max="120" value={fields.duration} onChange={(event) => updateField("duration", Number(event.target.value))} /></label><label>Mục tiêu chính <span className="input-hint">tuỳ chọn</span><textarea placeholder="Học sinh sẽ hiểu hoặc làm được gì?" value={fields.objective} onChange={(event) => updateField("objective", event.target.value)} /></label><label>Học liệu cần chuẩn bị <span className="input-hint">tuỳ chọn</span><textarea placeholder="Ví dụ: tranh ảnh, giấy màu..." value={fields.materials} onChange={(event) => updateField("materials", event.target.value)} /></label><label>Hỗ trợ học sinh <span className="input-hint">tuỳ chọn</span><textarea placeholder="Điều gì giúp mọi em cùng tham gia?" value={fields.support} onChange={(event) => updateField("support", event.target.value)} /></label><button className="primary-button full-width" onClick={createPlan}>Tạo kế hoạch <span>✦</span></button></aside><section className="preview-panel">{generationStep !== "idle" ? <div className="generation-view" role="status" aria-live="polite"><div className="agent-orbit"><span className="agent-spark">✦</span><span className="orbit-ring"></span></div><p className="eyebrow">CLASSBLOOM AI</p><h2>{generationSteps.find((step) => step.id === generationStep)?.label}</h2><p className="generation-copy">{generationSteps.find((step) => step.id === generationStep)?.detail}</p><div className="generation-steps">{generationSteps.map((step) => { const activeIndex = generationSteps.findIndex((item) => item.id === generationStep); const stepIndex = generationSteps.findIndex((item) => item.id === step.id); const isComplete = stepIndex < activeIndex; const isActive = step.id === generationStep; return <div className={`generation-step${isActive ? " active" : ""}${isComplete ? " complete" : ""}`} key={step.id}><span className="generation-check">{isComplete ? "✓" : isActive ? "✦" : ""}</span><span>{step.label}</span></div>; })}</div><div className="generation-topic">Đang chuẩn bị kế hoạch cho <strong>{generationFields?.topic}</strong></div></div> : !plan ? <div className="preview-empty"><div className="empty-orbit"><span>✦</span></div><h2>Bản nháp của cô sẽ xuất hiện ở đây</h2><p>Điền chủ đề và một vài thông tin bên trái.<br />ClassBloom sẽ gợi ý một kế hoạch thực tế, dễ dùng.</p><div className="demo-note">✦ Nội dung được tạo mô phỏng, không gửi dữ liệu ra ngoài.</div></div> : <div className="lesson-preview"><div className="preview-topline"><span className="pill blue">BẢN NHÁP MÔ PHỎNG</span><span className="preview-meta">{plan.subject} · {plan.grade} · {plan.duration} phút</span></div><div className="lesson-title-row"><div><h2>{plan.title}</h2><p>Giáo án gợi ý · {plan.grade}</p></div><span className="lesson-star">✦</span></div><div className="refine-bar"><span><strong>Gợi ý nhanh</strong> Làm kế hoạch này phù hợp hơn?</span><button onClick={() => refinePlan("shorten")}>Ngắn gọn hơn</button><button onClick={() => refinePlan("groups")}>Thêm hoạt động nhóm</button><button onClick={() => refinePlan("support")}>Thêm hỗ trợ</button></div><div className="section-list">{plan.sections.map((section) => <article className="lesson-section" key={section.id}><div className="section-marker">{section.id === "goal" ? "✦" : section.id === "prepare" ? "▧" : "•"}</div><div className="section-content"><h3>{section.title}</h3><textarea value={section.content} onChange={(event) => updateSection(section.id, event.target.value)} aria-label={`Chỉnh sửa ${section.title}`} /></div></article>)}</div></div>}{notice && <div className="notice" role="status">✦ {notice}</div>}</section></div></section>}

      {view === "saved" && <section className="page saved-page"><button className="back-button" onClick={() => setView("home")}>← Trang chủ</button><div className="saved-heading"><div><p className="eyebrow">THƯ VIỆN CỦA CÔ</p><h1>Kế hoạch đã lưu</h1><p className="subhead">Mọi ý tưởng cô muốn giữ lại, ở ngay đây.</p></div><button className="primary-button" onClick={() => openPlanner()}>+ Soạn bài mới</button></div>{savedPlans.length ? <div className="saved-grid">{savedPlans.map((item) => <button className="saved-card" key={item.id} onClick={() => { setPlan(item); setFields(item); setView("planner"); }}><div className="saved-card-top"><span className="saved-icon">✦</span><span>{formatDate(item.updatedAt)}</span></div><h2>{item.title}</h2><p>{item.subject} · {item.grade} · {item.duration} phút</p><span className="saved-open">Mở kế hoạch <b>→</b></span></button>)}</div> : <div className="saved-empty"><div>☼</div><h2>Thư viện còn trống</h2><p>Khi cô lưu một kế hoạch, nó sẽ xuất hiện ở đây để mình mở lại bất cứ lúc nào.</p><button className="secondary-button" onClick={() => openPlanner()}>Tạo kế hoạch đầu tiên</button></div>}</section>}
      <footer className="footer"><span>Class<span>Bloom</span></span><span>For Demo Purpose Only</span><span className="footer-logo-wrap"><Image className="footer-logo" src="/assets/logo.svg" alt="ClassBloom" width={92} height={28} /></span></footer>
    </main>
  );
}
