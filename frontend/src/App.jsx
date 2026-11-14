import React, { useEffect, useMemo, useState } from "react";
import ReactMarkdown from "react-markdown";
import {
  Activity, ArrowLeft, ArrowRight, ArrowUpRight, BookOpen, Bot,
  Check, CheckCircle2, ChevronRight, CircleHelp, Clipboard,
  Code2, Command, FileText, Gauge, Layers3, Menu, MessageSquareText,
  Play, Search, Settings2, ShieldCheck, Sparkles, WandSparkles,
  X, Zap, Copy, Clock3, RefreshCw, Terminal, Workflow
} from "lucide-react";
import "./style.css";

const agents = [
  {
    id: 1, name: "Blog Writer", tag: "Content creation",
    category: "Create", icon: FileText,
    desc: "Create engaging, structured blog posts from a topic.",
    purpose: "Turn an idea or brief into a clear, engaging article with a logical structure and consistent voice.",
    how: "Give the agent a focused topic. Add your audience, tone, desired length and key points.",
    inputGuide: "A topic or short brief. Audience, tone, length and key points improve the result.",
    placeholder: "Write a blog post about the impact of generative AI on education.",
    sample: "Write a 700-word blog post about how generative AI is changing education. Audience: university students. Tone: informative and accessible. Include benefits, risks, and a conclusion."
  },
  {
    id: 2, name: "Competitor Analyst", tag: "Market intelligence",
    category: "Analyze", icon: Gauge,
    desc: "Compare competitors and uncover positioning opportunities.",
    purpose: "Compare a product with competitors to identify positioning, feature gaps, strengths and opportunities.",
    how: "Describe your product, target audience, competitors and the comparison you need.",
    inputGuide: "Product, industry, target audience, competitors and analysis objective.",
    placeholder: "Product: FitTrack\nIndustry: Fitness technology\nTarget Audience: Working professionals\nCompetitors: Fitbit, Garmin, Apple Fitness\nObjective: Compare features, positioning and opportunities.",
    sample: "Product: FitTrack\nIndustry: Fitness technology\nTarget Audience: Working professionals\nCompetitors: Fitbit, Garmin, Apple Fitness\nObjective: Compare features, positioning and opportunities."
  },
  {
    id: 3, name: "Meeting Intelligence", tag: "Productivity",
    category: "Organize", icon: MessageSquareText,
    desc: "Turn meeting transcripts into summaries, decisions and action items.",
    purpose: "Convert a transcript into a concise summary, important decisions and clear follow-up actions.",
    how: "Paste the meeting transcript. Include speaker names where possible so responsibilities can be attributed.",
    inputGuide: "Meeting transcript in plain text. Include attendees and speaker names when available.",
    placeholder: "Paste your meeting transcript hereâ€¦",
    sample: "Meeting: Product sprint planning\nAttendees: Maya, Ravi, Neha\nMaya: We need to finish the onboarding flow by Friday.\nRavi: I will complete the API integration by Wednesday.\nNeha: I will review the screens and share feedback tomorrow."
  },
  {
    id: 4, name: "Data Analyst", tag: "Data intelligence",
    category: "Analyze", icon: Activity,
    desc: "Analyze CSV data and explain useful patterns and findings.",
    purpose: "Explore tabular data, answer questions and explain patterns or findings in plain language.",
    how: "State the question you want answered and provide CSV content with column headers.",
    inputGuide: "A question followed by CSV text. Keep the header row and data rows consistently formatted.",
    placeholder: "Question: Identify the main trends\nCSV:\nmonth,sales\nJan,120\nFeb,150\nMar,180",
    sample: "Question: Identify the main trends and calculate the percentage change from January to March.\nCSV:\nmonth,sales\nJan,120\nFeb,150\nMar,180"
  },
  {
    id: 5, name: "Customer Support", tag: "Customer experience",
    category: "Communicate", icon: MessageSquareText,
    desc: "Understand a support issue and prepare a helpful response.",
    purpose: "Interpret a customer issue and prepare a helpful, professional response with sensible next steps.",
    how: "Describe what happened, what the customer expects and any relevant policy or order context.",
    inputGuide: "Customer message, issue description and relevant context. Avoid sharing sensitive personal information.",
    placeholder: "A customer says their recent order arrived late and the tracking page has not updated. Draft a helpful response and recommend next steps.",
    sample: "A customer says their recent order arrived late and the tracking page has not updated. Draft a helpful response and recommend next steps. Tone: empathetic and professional."
  },
  {
    id: 6, name: "Resume Screener", tag: "Talent intelligence",
    category: "Analyze", icon: Clipboard,
    desc: "Evaluate a resume against a job description.",
    purpose: "Compare a candidate's resume with a role description and surface relevant skills, gaps and fit signals.",
    how: "Provide the job title, job description and resume text. Treat the result as decision support, not an automatic hiring decision.",
    inputGuide: "Job title, job description and resume text. Remove personal details that are irrelevant to role-related skills.",
    placeholder: "Job Title: Junior Data Analyst\nJob Description: Skills in Python, SQL, statistics and data visualization.\nCandidate Name: Candidate\nResume:\nPaste the complete resume hereâ€¦",
    sample: "Job Title: Junior Data Analyst\nJob Description: Skills in Python, SQL, statistics and data visualization.\nCandidate Name: Candidate\nResume:\nBSc Mathematics. Skills: Python, SQL, Excel, Power BI. Internship: cleaned sales data and built dashboards."
  },
  {
    id: 7, name: "Bug Triage", tag: "Engineering",
    category: "Build", icon: Code2,
    desc: "Assess a bug report and suggest a debugging path.",
    purpose: "Organize a bug report, assess likely severity and suggest a practical investigation path.",
    how: "Describe the issue, reproduction steps, expected and actual behavior, severity and environment.",
    inputGuide: "Issue title, description, reproduction steps, expected behavior, actual behavior, severity and environment.",
    placeholder: "Issue Title: Login fails after password reset\nDescription: Users see an error after resetting their password.\nSeverity: High\nEnvironment: Chrome, Windows 11",
    sample: "Issue Title: Login fails after password reset\nDescription: Users see an error after resetting their password.\nSteps: Reset password, then sign in.\nExpected: User signs in. Actual: 500 error.\nSeverity: High\nEnvironment: Chrome, Windows 11"
  },
  {
    id: 8, name: "Content Repurposer", tag: "Content creation",
    category: "Create", icon: WandSparkles,
    desc: "Adapt one source into platform-ready content.",
    purpose: "Transform source material into content tailored to different platforms and audiences.",
    how: "Paste your source content and specify content type, platforms, audience and tone.",
    inputGuide: "Source content, desired content type, platforms, target audience and tone.",
    placeholder: "Source Content: Paste your content hereâ€¦\nContent Type: Educational post\nPlatforms: LinkedIn, Instagram\nTarget Audience: Students\nTone: Clear and engaging",
    sample: "Source Content: Regular practice helps students retain programming concepts.\nContent Type: Educational post\nPlatforms: LinkedIn, Instagram\nTarget Audience: MCA students\nTone: Clear and encouraging"
  },
  {
    id: 9, name: "Lead Qualifier", tag: "Sales intelligence",
    category: "Communicate", icon: Layers3,
    desc: "Assess a lead against your ideal customer profile.",
    purpose: "Review lead information against a target customer profile and identify fit, needs and useful follow-up questions.",
    how: "Provide lead and company details, industry, needs, team size and known buying context.",
    inputGuide: "Lead name, company, industry, requirements, team size, budget and buying timeline when known.",
    placeholder: "Lead Name: Alex Morgan\nCompany: Example Technologies\nIndustry: SaaS\nRequirements: Looking for workflow automation for a 50-person team.",
    sample: "Lead Name: Alex Morgan\nCompany: Example Technologies\nIndustry: SaaS\nRequirements: Looking for workflow automation for a 50-person team.\nTimeline: This quarter"
  },
  {
    id: 10, name: "Approval Report", tag: "Human-in-the-loop",
    category: "Organize", icon: ShieldCheck,
    desc: "Generate a project approval report and submit it for human review.",
    purpose: "Create a structured project approval report while keeping a human reviewer in control of the final decision.",
    how: "Describe the project, purpose, requested amount, benefits, risks and timeline. Review the generated report before submitting your decision.",
    inputGuide: "Request type, project name, purpose, details, requested amount, expected benefits, risks, timeline and approver role.",
    placeholder: "Request Type: Project approval\nProject Name: AI Knowledge Assistant\nPurpose: Improve internal knowledge discovery\nDetails: Build a searchable assistant for company documents.\nRequested Amount: 50000\nExpected Benefits: Faster information retrieval\nRisks: Data access and privacy\nTimeline: 8 weeks\nApprover Role: Project Manager",
    sample: "Request Type: Project approval\nProject Name: AI Knowledge Assistant\nPurpose: Improve internal knowledge discovery\nDetails: Build a searchable assistant for company documents.\nRequested Amount: 50000\nExpected Benefits: Faster information retrieval\nRisks: Data access and privacy\nTimeline: 8 weeks\nApprover Role: Project Manager"
  }
];

const technical = {
  1: { kind: "Crew", pattern: "Sequential", summary: "A three-agent content pipeline that moves from research to drafting to editorial review.", stack: ["CrewAI Crew", "Gemini free tier", "DuckDuckGo search", "FileWriterTool"], flow: ["Topic input", "Researcher searches for supporting material", "Writer creates a ~600-word draft", "Editor reviews tone and facts", "blog_post.md is saved"], decisions: ["Separate research, writing and editing responsibilities", "Use web search to ground the draft", "Persist the final artifact with FileWriterTool"], output: "blog_post.md" },
  2: { kind: "Crew", pattern: "Hierarchical delegation", summary: "A manager-led crew delegates competitor research to specialist agents and consolidates the findings.", stack: ["CrewAI hierarchical process", "manager_llm", "Gemini free tier", "ScrapeWebsiteTool", "DuckDuckGo search", "FileWriterTool"], flow: ["Three competitor URLs", "Manager agent splits and assigns work", "Site Scraper gathers website information", "Pricing Analyst reviews plans and prices", "News Analyst searches recent coverage", "Strategist builds a SWOT table", "report.md is saved"], decisions: ["Use a manager to coordinate specialist work", "Separate website, pricing and news analysis", "Consolidate findings into a SWOT-oriented report"], output: "report.md" },
  3: { kind: "Crew", pattern: "Parallel tasks", summary: "Three transcript-analysis tasks run asynchronously; a formatter combines their results after they finish.", stack: ["CrewAI", "async_execution=True", "Gemini free tier", "FileReadTool", "FileWriterTool"], flow: ["transcript.txt is read", "Summarizer creates a five-line summary", "Action Finder extracts owners and due dates", "Decision Logger records decisions", "Formatter waits for all three task results", "notes.md is saved"], decisions: ["Split independent extraction tasks", "Run independent tasks asynchronously", "Format the combined result after completion"], output: "notes.md" },
  4: { kind: "Crew", pattern: "Sequential + structured output", summary: "A data-focused crew combines deterministic pandas calculations with LLM-written insights and review.", stack: ["CrewAI", "Gemini free tier", "FileReadTool", "Pandas custom tool", "Pydantic output"], flow: ["sales.csv is read", "Data Analyst calculates statistics into a Pydantic structure", "Insight Writer explains the top three findings", "Reviewer checks the reported numbers", "report.md is saved"], decisions: ["Use pandas for numerical calculations", "Constrain analytical output with a Pydantic schema", "Add a reviewer to check numerical consistency"], output: "report.md" },
  5: { kind: "Flow", pattern: "Conditional router", summary: "A ticket is categorised and routed to a matching handler using Flow state and conditional listeners.", stack: ["CrewAI Flow", "Gemini free tier", "Python Flow state", "LLM categorisation"], flow: ["@start receives the ticket", "Flow state is populated", "LLM categorises the ticket", "Router selects billing, account_access or other", "Matching handler prepares the resolution"], decisions: ["Keep routing separate from ticket handling", "Use labelled routes for category-specific behaviour", "Use plain Python state without paid external tools"], output: "Ticket resolution" },
  6: { kind: "Flow + Crew", pattern: "Score-based router", summary: "Resume text is scored against a job description, then routed to a shortlist summary or rejection draft.", stack: ["CrewAI Flow", "Gemini free tier", "FileReadTool", "PDF text reader", "Summary Crew"], flow: ["Load resume files", "LLM scores each resume from 0 to 10", "Router checks whether score is 7 or higher", "Shortlist route creates strengths-and-gaps summary", "Reject route drafts a polite email", "Results are saved to results.csv"], decisions: ["Use a score threshold to route candidates", "Generate different outputs for shortlist and reject paths", "Keep the result as decision support, not an automatic hiring decision"], output: "results.csv" },
  7: { kind: "Flow + Crews", pattern: "Issue-type router", summary: "An initial classifier directs bugs, feature requests and questions to specialised crews.", stack: ["CrewAI Flow", "Gemini free tier", "ScrapeWebsiteTool", "Specialist Crews"], flow: ["Read issue title and body", "LLM classifies the issue", "Router selects bug, feature or question", "Bug Crew returns severity and steps", "Feature Crew drafts a user story", "Answer Crew responds using documentation", "Label and comment are prepared"], decisions: ["Classify before invoking a specialist crew", "Use separate handling logic for each issue type", "Use documentation scraping for question context"], output: "Issue label and reply" },
  8: { kind: "Flow + Crews", pattern: "Parallel fan-out / fan-in", summary: "One extracted set of key points feeds three independent content crews, which are joined into a publishing pack.", stack: ["CrewAI Flow", "Gemini free tier", "ScrapeWebsiteTool", "FileWriterTool", "Parallel listeners"], flow: ["Load article from URL or file", "LLM extracts key points", "LinkedIn Crew creates a post", "Twitter Crew creates a six-tweet thread", "Newsletter Crew creates an intro and three bullets", "Join all branches and save three files"], decisions: ["Reuse one extraction step as shared context", "Run platform-specific generation branches side by side", "Join outputs before creating the publishing pack"], output: "Three platform-specific files" },
  9: { kind: "Flow + Crews", pattern: "Enrichment + score router", summary: "A lead-enrichment crew gathers company context before a router assigns hot, warm or cold follow-up.", stack: ["CrewAI Flow", "Gemini free tier", "ScrapeWebsiteTool", "Outreach Crew", "FileWriterTool"], flow: ["Capture lead name and website", "Enrich Crew scrapes the website", "Router scores the lead as hot, warm or cold", "Hot: Outreach Crew drafts a personal email", "Warm: add lead to nurture list", "Cold: archive lead", "Log lead to leads.csv"], decisions: ["Enrich before qualification", "Route follow-up effort by lead temperature", "Keep the cold path lightweight"], output: "leads.csv and follow-up draft" },
  10: { kind: "Flow + Crews", pattern: "Human-in-the-loop approval", summary: "Research and writing crews prepare a report, but a human controls approval and can send it through revision again.", stack: ["CrewAI Flow", "CrewAI Crews", "Gemini free tier", "DuckDuckGo search", "Human feedback", "SQLite Flow persistence"], flow: ["Collect topic and audience", "Research Crew gathers source material", "Writing Crew drafts the report", "Human reviewer approves or requests revision", "Router checks the decision", "Approved: save final.md", "Revise: Revision Crew updates the draft and returns it for review"], decisions: ["Keep a human approval gate before publication", "Support a revision loop rather than a one-shot decision", "Persist workflow state for the approval process"], output: "final.md after approval" }
};

const DEFAULT_API = "https://crewai-bpy1.onrender.com";

function App() {
  const [active, setActive] = useState(1);
  const [view, setView] = useState("library");
  const [prompt, setPrompt] = useState(agents[0].placeholder);
  const [api, setApi] = useState(DEFAULT_API);
  const [showSettings, setShowSettings] = useState(false);
  const [result, setResult] = useState("");
  const [draftId, setDraftId] = useState("");
  const [feedback, setFeedback] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [mobile, setMobile] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const [runStage, setRunStage] = useState(0);

  const agent = agents.find(a => a.id === active);
  const Icon = agent.icon;

  const filtered = useMemo(() =>
    agents.filter(a =>
      (a.name + " " + a.tag + " " + a.category).toLowerCase().includes(search.toLowerCase()) &&
      (category === "All" || a.category === category)
    ), [search, category]);

  useEffect(() => {
    const onKey = e => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        document.querySelector(".global-search")?.focus();
      }
      if (e.key === "Escape") {
        setShowSettings(false);
        setMobile(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2400);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (!busy) {
      setRunStage(0);
      return;
    }
    setRunStage(1);
    const t = setInterval(() => setRunStage(s => Math.min(s + 1, 2)), 1500);
    return () => clearInterval(t);
  }, [busy]);

  function choose(id) {
    const next = agents.find(a => a.id === id);
    setActive(id);
    setPrompt(next.placeholder);
    setResult("");
    setError("");
    setDraftId("");
    setFeedback("");
    setView("detail");
    setMobile(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function goLibrary() {
    setView("library");
    setMobile(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function run(path = "/agent" + active, body = { input: prompt }) {
    if (busy) return;
    setBusy(true);
    setError("");
    setResult("");
    try {
      const base = api.trim().replace(/\/$/, "");
      const response = await fetch(base + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      });
      let data = {};
      try { data = await response.json(); } catch {}
      if (!response.ok) {
        const detail = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail || data);
        throw new Error(detail || `Request failed (${response.status})`);
      }
      const output = data.output ?? JSON.stringify(data, null, 2);
      setResult(String(output));
      const id = String(output).match(/Draft ID:\s*([\w-]+)/i)?.[1];
      if (id) setDraftId(id);
      setHistory(h => [{
        id: active,
        name: agent.name,
        time: new Date().toLocaleTimeString(),
        preview: String(output).slice(0, 110)
      }, ...h].slice(0, 8));
      setToast("Agent response received");
    } catch (e) {
      setError(e.message.includes("Failed to fetch")
        ? "Could not reach the backend. Check that the API is awake, the URL is correct, and CORS allows this frontend. " + e.message
        : e.message);
    } finally {
      setBusy(false);
    }
  }

  async function copyResult() {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setToast("Response copied to clipboard");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setToast("Clipboard access was blocked by your browser");
    }
  }

  function saveSettings() {
    const clean = api.trim().replace(/\/$/, "");
    setApi(clean);
    localStorage.setItem("crewApi", clean);
    setShowSettings(false);
    setToast("Backend connection saved");
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <aside className={`sidebar ${mobile ? "mobile-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><Sparkles size={19} /></div>
          <div><b>CrewSphere<span> AI</span></b><small>INTELLIGENT WORKSPACE</small></div>
          <button className="mobile-close" onClick={() => setMobile(false)}><X size={18} /></button>
        </div>

        <button className={`library-link ${view === "library" ? "on" : ""}`} onClick={goLibrary}>
          <Layers3 size={17} /> Workspace overview <span>10</span>
        </button>

        <div className="workspace-label">YOUR AGENT WORKSPACE <span className="online-dot" /></div>
        <div className="searchbox">
          <Search size={15} />
          <input className="global-search" placeholder="Find an agentâ€¦" value={search}
            onChange={e => setSearch(e.target.value)} />
          <kbd>âŒ˜ K</kbd>
        </div>

        <div className="nav-caption">SPECIALIZED AGENTS <span>10</span></div>
        <nav>
          {agents.map(a => {
            const I = a.icon;
            return (
              <button key={a.id}
                className={`agent-nav ${view === "detail" && active === a.id ? "selected" : ""}`}
                onClick={() => choose(a.id)}>
                <span className="agent-icon"><I size={16} /></span>
                <span className="agent-nav-text">
                  <b>{String(a.id).padStart(2, "0")} Â· {a.name}</b>
                  <small>{a.tag}</small>
                </span>
                {view === "detail" && active === a.id && <ChevronRight size={15} />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="backend-card">
            <div className="backend-head"><span className="pulse-dot" /> Backend endpoint</div>
            <p>{api.replace(/^https?:\/\//, "")}</p>
            <button onClick={() => setShowSettings(true)}>Connection settings <ArrowUpRight size={13} /></button>
          </div>
          <div className="profile">
            <div className="avatar">CS</div>
            <div><b>CrewSphere AI</b><small>AI agent platform</small></div>
            <button onClick={() => setShowSettings(true)}><Settings2 size={17} /></button>
          </div>
        </div>
      </aside>

      {mobile && <div className="scrim" onClick={() => setMobile(false)} />}

      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobile(true)}><Menu size={19} /></button>
          <div className="crumb">
            <span onClick={goLibrary}>Workspace</span><ChevronRight size={14} />
            <span>{view === "library" ? "Overview" : agent.name}</span>
          </div>
          <div className="top-actions">
            <span className="status"><i /> CREWAI BACKEND</span>
            <button className="icon-button" title="Settings" onClick={() => setShowSettings(true)}><Settings2 size={18} /></button>
          </div>
        </header>

        {view === "library" ? (
          <div className="library-content page-enter">
            <section className="library-hero">
              <div className="hero-copy">
                <div className="eyebrow"><span className="eyebrow-line" /> MULTI-AGENT AI PLATFORM</div>
                <h1>Intelligence that<br /><em>moves work forward.</em></h1>
                <p>Ten specialized AI agents. One connected workspace.<br />
                  From content creation to analysis and approval workflows.</p>
                <div className="hero-actions">
                  <button className="primary-action" onClick={() => choose(1)}>Explore agents <ArrowRight size={16} /></button>
                  <span><span className="live-indicator" /> API endpoint configured</span>
                </div>
                <div className="library-stats">
                  <div><b>10</b><span>SPECIALIZED AGENTS</span></div>
                  <i />
                  <div><b>05</b><span>WORK CATEGORIES</span></div>
                  <i />
                  <div><b>01</b><span>CONNECTED API</span></div>
                </div>
              </div>

              <div className="hero-visual">
                <div className="visual-grid" />
                <div className="visual-orbit orbit-a" />
                <div className="visual-orbit orbit-b" />
                <div className="visual-orbit orbit-c" />
                <div className="visual-core"><Sparkles size={35} /></div>
                <div className="float-node node-a"><FileText size={17} /><span>CREATE</span></div>
                <div className="float-node node-b"><Activity size={17} /><span>ANALYZE</span></div>
                <div className="float-node node-c"><Workflow size={17} /><span>ORCHESTRATE</span></div>
                <div className="float-node node-d"><ShieldCheck size={17} /><span>REVIEW</span></div>
                <div className="visual-caption">MULTI-AGENT ORCHESTRATION <span>â— LIVE</span></div>
              </div>
            </section>

            <section className="metrics-row">
              <div className="metric-card"><span className="metric-icon"><Bot size={17} /></span><div><b>10</b><small>AI AGENTS</small></div><span className="metric-note">Specialized</span></div>
              <div className="metric-card"><span className="metric-icon"><Workflow size={17} /></span><div><b>5</b><small>CAPABILITIES</small></div><span className="metric-note">Work types</span></div>
              <div className="metric-card"><span className="metric-icon"><Zap size={17} /></span><div><b>FastAPI</b><small>BACKEND</small></div><span className="metric-note">Connected</span></div>
              <div className="metric-card"><span className="metric-icon"><ShieldCheck size={17} /></span><div><b>01</b><small>HUMAN REVIEW FLOW</small></div><span className="metric-note">Agent 10</span></div>
            </section>

            <section className="agent-section">
              <div className="section-heading">
                <div><div className="eyebrow">YOUR AI TOOLKIT</div><h2>Choose your agent<span>.</span></h2><p>Each agent is designed around a specific task and workflow.</p></div>
                <div className="agent-count">{filtered.length} / 10 <span>AGENTS</span></div>
              </div>

              <div className="filter-row">
                <div className="category-tabs">
                  {["All", "Create", "Analyze", "Organize", "Communicate", "Build"].map(c =>
                    <button key={c} className={category === c ? "active" : ""}
                      onClick={() => setCategory(c)}>{c}</button>
                  )}
                </div>
                <span className="filter-hint"><Command size={13} /> Ctrl + K to search</span>
              </div>

              <div className="agent-grid">
                {filtered.map(a => {
                  const I = a.icon;
                  return (
                    <button className={`agent-card card-${(a.id - 1) % 5}`} key={a.id} onClick={() => choose(a.id)}>
                      <div className="card-top"><span className="card-number">AGENT / {String(a.id).padStart(2, "0")}</span><span className="card-arrow"><ArrowUpRight size={17} /></span></div>
                      <div className="card-icon"><I size={22} /></div>
                      <div className="card-category">{a.tag}</div>
                      <h3>{a.name}</h3>
                      <p>{a.desc}</p>
                      <div className="card-bottom"><span>EXPLORE WORKFLOW</span><ArrowRight size={15} /></div>
                      <div className="card-tech-peek" aria-hidden="true">
                        <span className="peek-kicker">UNDER THE HOOD</span>
                        <b>{technical[a.id].kind} Â· {technical[a.id].pattern}</b>
                        <small>{technical[a.id].stack.slice(0, 3).join("  /  ")}</small>
                        <em>Click to inspect architecture <ArrowUpRight size={12} /></em>
                      </div>
                      <div className="card-glow" />
                    </button>
                  );
                })}
              </div>

              {!filtered.length && <div className="no-results">No agents match that search. Try another name or category.</div>}
            </section>

            <section className="workflow-banner">
              <div className="workflow-symbol"><Workflow size={20} /></div>
              <div><b>Designed for intelligent workflows</b><p>Each agent has a dedicated workspace, guided inputs and live backend execution.</p></div>
              <span>CREWAI <i>Ã—</i> FASTAPI</span>
            </section>

            <footer><span>CREWSPHERE AI Â© 2026</span><span>INTELLIGENCE Â· ORCHESTRATION Â· EXECUTION</span></footer>
          </div>
        ) : (
          <div className="content detail-content page-enter">
            <button className="back-library" onClick={goLibrary}><ArrowLeft size={15} /> All agents</button>

            <section className="detail-hero">
              <div className="detail-icon"><Icon size={27} /></div>
              <div className="detail-title">
                <div className="eyebrow">SPECIALIZED AGENT {String(active).padStart(2, "0")} / 10</div>
                <h1>{agent.name}</h1>
                <p>{agent.desc}</p>
              </div>
              <div className="agent-pill"><span /> READY TO RUN</div>
            </section>

            <div className="guide-grid">
              <section className="guide-card">
                <div className="guide-label">01 â€” PURPOSE</div>
                <h3>What this agent does</h3><p>{agent.purpose}</p>
                <div className="guide-divider" />
                <div className="guide-label">02 â€” HOW TO USE</div>
                <h3>Give it the right context</h3><p>{agent.how}</p>
              </section>
              <section className="guide-card input-guide">
                <div className="guide-label">03 â€” INPUT REQUIREMENTS</div>
                <h3>What should you provide?</h3><p>{agent.inputGuide}</p>
                <div className="example-box">
                  <div><span>EXAMPLE PROMPT</span><button onClick={() => { setPrompt(agent.sample); setToast("Example loaded into the editor"); }}>Load example <ArrowUpRight size={13} /></button></div>
                  <pre>{agent.sample}</pre>
                </div>
              </section>
            </div>

            <section className="architecture-section">
              <div className="architecture-heading">
                <div><div className="eyebrow">UNDER THE HOOD Â· AGENT {String(active).padStart(2, "0")}</div><h2>How it is <span>engineered.</span></h2><p>{technical[active].summary}</p></div>
                <div className="architecture-badges"><span>{technical[active].kind}</span><span>{technical[active].pattern}</span></div>
              </div>
              <div className="architecture-grid">
                <article className="architecture-card flow-card">
                  <div className="architecture-card-head"><span className="architecture-index">01</span><div><b>Execution architecture</b><small>THE WORKFLOW, STEP BY STEP</small></div><Workflow size={18} /></div>
                  <div className="flow-steps">{technical[active].flow.map((step, i) => <div className="flow-step" key={step}><span>{String(i + 1).padStart(2, "0")}</span><b>{step}</b>{i < technical[active].flow.length - 1 && <i />}</div>)}</div>
                </article>
                <article className="architecture-card stack-card">
                  <div className="architecture-card-head"><span className="architecture-index">02</span><div><b>Technology stack</b><small>FRAMEWORKS Â· MODELS Â· TOOLS</small></div><Layers3 size={18} /></div>
                  <div className="tech-chip-list">{technical[active].stack.map(item => <span key={item}><CheckCircle2 size={13} />{item}</span>)}</div>
                  <div className="output-callout"><FileText size={17} /><div><small>EXPECTED ARTIFACT / OUTPUT</small><b>{technical[active].output}</b></div></div>
                </article>
                <article className="architecture-card decisions-card">
                  <div className="architecture-card-head"><span className="architecture-index">03</span><div><b>Engineering decisions</b><small>WHY THIS DESIGN</small></div><Code2 size={18} /></div>
                  <ul>{technical[active].decisions.map(item => <li key={item}>{item}</li>)}</ul>
                  <div className="showcase-note"><ShieldCheck size={14} /> Technical overview based on the project's described workflow.</div>
                </article>
              </div>
            </section>

            <div className="run-section-heading">
              <div><div className="eyebrow">04 â€” LIVE EXECUTION</div><h2>Agent workspace<span>.</span></h2><p>Provide your task, execute the agent and review its response.</p></div>
              <div className="agent-pill"><span /> API CONFIGURED</div>
            </div>

            <div className="work-grid">
              <section className="panel input-panel">
                <div className="panel-top"><div><span className="step">01</span><h3>Task configuration</h3></div><span className="required">INPUT</span></div>
                <label htmlFor="prompt">YOUR INSTRUCTIONS</label>
                <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)}
                  placeholder="Describe what you want your agent to doâ€¦" spellCheck="false" />
                <div className="input-footer"><span>{prompt.length.toLocaleString()} characters</span><button className="reset-btn" onClick={() => setPrompt(agent.placeholder)}>Reset input</button></div>
                <button className="run-btn" disabled={busy || !prompt.trim()} onClick={() => run()}>
                  {busy ? <><span className="spinner" /> Processing requestâ€¦</> : <><Play size={16} fill="currentColor" /> Execute {agent.name}<ArrowUpRight size={16} /></>}
                </button>
                <p className="run-note"><Zap size={13} /> Sends <code>{"{ input: string }"}</code> to <code>/agent{active}</code>.</p>
                <div className="input-meta"><span><CheckCircle2 size={13} /> JSON request</span><span><ShieldCheck size={13} /> Backend connected</span></div>
              </section>

              <section className={`panel output-panel ${result ? "has-result" : ""}`}>
                <div className="panel-top"><div><span className="step">02</span><h3>Execution output</h3></div><span className={`required ${result ? "success-text" : ""}`}>{busy ? "RUNNING" : result ? "COMPLETED" : error ? "ERROR" : "AWAITING INPUT"}</span></div>

                {busy ? (
                  <div className="execution-state">
                    <div className="execution-orb"><Sparkles size={24} /></div>
                    <h3>Agent is working</h3>
                    <p>Your request has been sent. Waiting for the backend response.</p>
                    <div className="execution-steps">
                      {["Connecting to API", "Processing request", "Receiving response"].map((s, i) =>
                        <div className={runStage >= i ? "stage-active" : ""} key={s}><span>{runStage > i ? <Check size={12} /> : i + 1}</span>{s}<i /></div>
                      )}
                    </div>
                  </div>
                ) : error ? (
                  <div className="error-state"><CircleHelp size={24} /><b>Request could not be completed</b><p>{error}</p><button onClick={() => run()}><RefreshCw size={14} /> Try again</button></div>
                ) : result ? (
                  <>
                    <div className="result-toolbar"><span><span className="success-dot" /> Backend response</span><button onClick={copyResult}>{copied ? <Check size={14} /> : <Copy size={14} />}{copied ? "Copied" : "Copy output"}</button></div>
                    <div className="result-content"><ReactMarkdown>{result}</ReactMarkdown></div>
                    {active === 10 && draftId && (
                      <div className="review-box">
                        <div className="review-title"><ShieldCheck size={17} /> Human review <span>REVIEW REQUIRED</span></div>
                        <code>{draftId}</code>
                        <p>Review the generated report before submitting your decision.</p>
                        <textarea value={feedback} onChange={e => setFeedback(e.target.value)}
                          placeholder="Enter APPROVE, REJECT, or revision feedbackâ€¦" />
                        <button className="review-btn" disabled={busy || !feedback.trim()}
                          onClick={() => run("/agent10/review", { draft_id: draftId, feedback })}>
                          Submit human review <ArrowUpRight size={15} />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="empty-state">
                    <div className="empty-orbit"><div><Bot size={25} /></div></div>
                    <b>Ready for execution</b>
                    <p>Your agent's response will appear here after execution.</p>
                    <span><Terminal size={13} /> OUTPUT STREAM / WAITING</span>
                  </div>
                )}
              </section>
            </div>

            <div className="execution-note"><div><Clock3 size={16} /></div><p><b>Execution history</b><span>{history.length ? `${history.length} recent requests in this session` : "Your recent agent runs will appear here."}</span></p></div>
            {history.length > 0 && <div className="history-list">{history.slice(0, 4).map((h, i) => <div key={i}><span className="history-icon"><Check size={14} /></span><b>{h.name}</b><small>{h.time}</small><p>{h.preview}</p></div>)}</div>}

            <footer><span>CREWSPHERE AI Â© 2026</span><span>INTELLIGENCE Â· ORCHESTRATION Â· EXECUTION</span></footer>
          </div>
        )}
      </main>

      {showSettings && (
        <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowSettings(false); }}>
          <div className="settings-modal">
            <button className="modal-x" onClick={() => setShowSettings(false)}><X size={18} /></button>
            <div className="modal-icon"><Settings2 size={20} /></div>
            <div className="eyebrow">SYSTEM CONFIGURATION</div>
            <h2>Backend connection</h2>
            <p>Configure the FastAPI service that receives your agent requests.</p>
            <label>BACKEND BASE URL</label>
            <input value={api} onChange={e => setApi(e.target.value)} placeholder="https://your-backend.onrender.com" />
            <div className="modal-hint">Use the base URL only. Do not include an endpoint such as /agent1.</div>
            <button className="save-btn" onClick={saveSettings}><Check size={16} /> Save configuration</button>
          </div>
        </div>
      )}

      {toast && <div className="toast"><CheckCircle2 size={16} /> {toast}</div>}
    </div>
  );
}

export default App;
