import React from "react";

const FEATURES = [
  {
    id: "jd-match",
    title: "Keyword & Vector Alignment",
    tag: "MATCH ENGINE",
    desc: "Scans your credentials against job prerequisites, correlates stack competencies, and highlights missing terms with severity rankings.",
    color: "#FF6662",
    span: "md:col-span-2",
    icon: (
      <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
        <path d="M8 11h6" />
        <path d="M11 8v6" />
      </svg>
    ),
    visual: (
      <div className="mt-5 studio-well rounded-xl overflow-hidden border border-border">
        <div className="flex justify-between px-4 py-2.5 border-b border-border type-micro text-secondary">
          <span>Requirement Competency</span>
          <span>Verification Status</span>
        </div>
        {[
          { skill: "Distributed Systems & Raft", status: "match" },
          { skill: "High-Throughput Redis Caching", status: "match" },
          { skill: "GraphQL Federation & Gateway", status: "gap" },
          { skill: "Zero-Downtime Data Migration", status: "partial" },
        ].map(({ skill, status }) => (
          <div
            key={skill}
            className="flex items-center justify-between px-4 py-2.5 border-b border-border last:border-b-0"
          >
            <span className="text-xs font-mono text-primary font-medium">{skill}</span>
            <span
              className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                status === "match"
                  ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
                  : status === "gap"
                  ? "bg-accent/10 text-accent border border-accent/20"
                  : "bg-amber/10 text-amber border border-amber/20"
              }`}
            >
              {status === "match" ? "✓ Verified Match" : status === "gap" ? "✗ Priority Gap" : "~ Partial Coverage"}
            </span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "practice-banks",
    title: "Scenario Question Banks",
    tag: "INTERVIEW REASONING",
    desc: "Tailored technical and architectural questions with expected evaluator answers calibrated for your target role.",
    color: "#d97706",
    span: "md:col-span-1",
    icon: (
      <svg className="w-5 h-5 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    ),
    visual: (
      <div className="mt-5 studio-well rounded-xl p-4 border border-border space-y-2.5">
        <div className="flex items-center justify-between text-[10px] font-mono text-amber font-semibold">
          <span>SYSTEM ARCHITECTURE</span>
          <span className="text-secondary">STAFF LEVEL</span>
        </div>
        <p className="text-xs font-medium text-primary leading-relaxed">
          "How would you eliminate single-point-of-failure bottlenecks in a multi-region leader election scheme?"
        </p>
        <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-secondary border-t border-border">
          <span>EVALUATION: DEEP DIVE</span>
          <span className="text-emerald-600 font-bold">94% CONFIDENCE</span>
        </div>
      </div>
    ),
  },
  {
    id: "gap-audit",
    title: "Severity Gap Diagnostics",
    tag: "PRIORITY ENGINE",
    desc: "Categorizes missing capabilities into High, Medium, and Low severity tiers so you eliminate dealbreakers first.",
    color: "#e54d48",
    span: "md:col-span-1",
    icon: (
      <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
        <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      </svg>
    ),
    visual: (
      <div className="mt-5 space-y-2">
        {[
          { label: "Distributed Consensus (Raft)", level: "CRITICAL", color: "#e54d48", bar: "88%" },
          { label: "Redis Cluster Sharding", level: "HIGH", color: "#d97706", bar: "62%" },
          { label: "CI/CD Deployment Pipelines", level: "LOW", color: "#059669", bar: "28%" },
        ].map((item) => (
          <div key={item.label} className="studio-well p-2.5 rounded-xl border border-border space-y-1.5">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-primary font-medium">{item.label}</span>
              <span className="font-bold" style={{ color: item.color }}>
                {item.level}
              </span>
            </div>
            <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: item.bar, background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "learning",
    title: "Curated Reference Knowledge",
    tag: "CURATED PATHS",
    desc: "Every flagged gap links to verified engineering specifications, official RFCs, and high-impact design papers.",
    color: "#059669",
    span: "md:col-span-2",
    icon: (
      <svg className="w-5 h-5 text-emerald-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
      </svg>
    ),
    visual: (
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {[
          { type: "ENGINEERING SPEC", title: "Raft Consensus Algorithm RFC", source: "Stanford Paper" },
          { type: "SYSTEM DESIGN", title: "Distributed Caching At Scale", source: "Stripe Eng Blog" },
          { type: "ARCHITECTURE", title: "Event Sourcing & CQRS Patterns", source: "Microsoft Docs" },
          { type: "BENCHMARK GUIDE", title: "Kernel Bypass & Network IO", source: "Cloudflare Whitepaper" },
        ].map((item) => (
          <div
            key={item.title}
            className="studio-well p-3 rounded-xl border border-border hover:border-slate-300 transition-colors"
          >
            <span className="text-[9px] font-mono text-accent uppercase tracking-wider block mb-1 font-semibold">
              {item.type}
            </span>
            <span className="text-xs font-semibold text-primary block truncate">{item.title}</span>
            <span className="text-[10px] font-mono text-secondary block mt-0.5">{item.source}</span>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: "roadmap",
    title: "10-Day Milestone Execution Roadmap",
    tag: "EXECUTION PLAN",
    desc: "A structured, day-by-day flight plan that walks you through closing gaps, practicing system designs, and locking in offers.",
    color: "#d97706",
    span: "md:col-span-3",
    icon: (
      <svg className="w-5 h-5 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    visual: (
      <div className="mt-5 space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {[
            { day: "Day 01", task: "Raft Consensus", status: "VERIFIED", done: true },
            { day: "Day 02", task: "Redis Lua Locks", status: "VERIFIED", done: true },
            { day: "Day 03", task: "Multi-Region Sharding", status: "IN PROGRESS", active: true },
            { day: "Day 04", task: "Saga Rollbacks", status: "SCHEDULED", pending: true },
            { day: "Day 05", task: "Executive Mock", status: "SCHEDULED", pending: true },
          ].map((item) => (
            <div
              key={item.day}
              className={`p-3 rounded-xl text-center border transition-all ${
                item.done
                  ? "bg-emerald-500/[0.05] border-emerald-500/20 text-emerald-600 font-semibold"
                  : item.active
                  ? "bg-accent/[0.08] border-accent/30 text-accent font-semibold shadow-sm"
                  : "bg-slate-100 border-border text-secondary"
              }`}
            >
              <span className="text-[10px] font-mono font-bold block mb-1">{item.day}</span>
              <p className="text-xs font-semibold text-primary truncate mb-1">{item.task}</p>
              <span className="text-[9px] font-mono tracking-wider block">
                {item.done ? "✓ COMPLETE" : item.active ? "● ACTIVE" : "○ QUEUED"}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 studio-well p-3 rounded-xl border border-border">
          <div className="flex-1 h-1.5 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-accent to-amber w-[40%]" />
          </div>
          <span className="text-xs font-mono text-secondary shrink-0">MILESTONE 03 / 10 · 40% PACING</span>
        </div>
      </div>
    ),
  },
];

const BentoFeatures = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-background font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-[-0.035em] mb-4">
            Everything you need to <br />
            <span className="text-gradient-coral">ace your technical interview</span>
          </h2>
          <p className="text-secondary text-sm sm:text-base max-w-xl mx-auto leading-relaxed font-normal">
            A comprehensive workbench designed to close skill gaps and align your profile with hiring standards.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {FEATURES.map((feat) => (
            <div
              key={feat.id}
              className={`studio-card-interactive rounded-2xl md:rounded-3xl p-6 sm:p-7 flex flex-col justify-between overflow-hidden shadow-sm border border-border ${feat.span}`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-border flex items-center justify-center shrink-0 shadow-sm">
                      {feat.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-primary tracking-tight">{feat.title}</h3>
                    </div>
                  </div>
                  <span className="text-[10px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 border border-border text-secondary">
                    {feat.tag}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-secondary leading-relaxed font-normal">{feat.desc}</p>
              </div>

              {feat.visual}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoFeatures;
