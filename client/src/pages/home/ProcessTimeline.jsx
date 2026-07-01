import React from "react";

const REDESIGNED_STEPS = [
  {
    num: "01",
    label: "MATCH TARGET ROLE",
    title: "Define Target Expectations",
    desc: "Paste the job description and upload your text-based resume PDF content in seconds.",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
      </svg>
    ),
  },
  {
    num: "02",
    label: "SKILL RADAR AUDIT",
    title: "Keyword & Tech Analysis",
    desc: "The parser extracts keywords, aligns requirements, and maps skill gaps with severity flags.",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"/><path d="m16.2 7.8-2 2"/><path d="m7.8 16.2 2-2"/><circle cx="12" cy="12" r="4"/>
      </svg>
    ),
  },
  {
    num: "03",
    label: "STRUCTURED PREPARATION",
    title: "Tailored Mock Workspace",
    desc: "Revisit past plans, study tailored Q&As, follow the roadmap, and download tailored PDFs.",
    icon: (
      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
      </svg>
    ),
  },
];

const ProcessTimeline = () => {
  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950/30 border-y border-slate-900 relative overflow-hidden"
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(168,85,247,0.03) 0%, transparent 60%)",
      }}
    >
      <div className="max-w-5xl mx-auto">
        
        <div className="text-center mb-16">
          <span
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
            style={{
              background: "rgba(168,85,247,0.06)",
              border: "1px solid rgba(168,85,247,0.2)",
              color: "#c084fc",
            }}
          >
            Step-by-step Setup
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Zero to Ready in 3 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 relative">
          {/* Pipeline connector line (desktop only) */}
          <div
            className="hidden md:block absolute top-10 left-[15%] right-[15%] h-px pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(6,182,212,0.3) 30%, rgba(168,85,247,0.3) 70%, transparent)",
            }}
          />

          {REDESIGNED_STEPS.map((step) => (
            <div key={step.num} className="flex flex-col items-center text-center">
              <div
                className="relative z-10 w-20 h-20 rounded-2xl flex flex-col items-center justify-center mb-5 shadow-2xl transition-transform duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, rgba(6,182,212,0.1), rgba(168,85,247,0.1))",
                  border: "1px solid rgba(6,182,212,0.2)",
                }}
              >
                <div className="text-cyan-400 mb-1">{step.icon}</div>
                <span className="text-[10px] font-bold font-mono text-slate-500 uppercase tracking-widest">{step.num}</span>
              </div>
              
              <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-wider mb-2 font-mono">
                {step.label}
              </span>
              <h3 className="text-base font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-xs">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default ProcessTimeline;