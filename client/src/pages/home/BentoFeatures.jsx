import React from "react";

const BENTO_FEATURES = [
  {
    title: "JD Keyword Alignment",
    tag: "Match Engine",
    desc: "Scans your credentials against job prerequisites to extract matching stacks and highlight missing terms.",
    span: "col-span-1 md:col-span-2",
    icon: (
      <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/><path d="M8 11h6"/><path d="M11 8v6"/>
      </svg>
    ),
    visual: (
      <div className="mt-4 flex flex-col gap-2 text-xs font-mono bg-surface/60 p-4 rounded-xl border border-border/40">
        <div className="flex justify-between border-b border-border pb-1.5 text-secondary">
          <span>Target Requirement</span>
          <span>Your Resume Match</span>
        </div>
        <div className="flex justify-between items-center text-primary/90">
          <span>React (Next.js)</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Matches
          </span>
        </div>
        <div className="flex justify-between items-center text-primary/90">
          <span>TypeScript Typing</span>
          <span className="text-emerald-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Matches
          </span>
        </div>
        <div className="flex justify-between items-center text-primary/90">
          <span>GraphQL Core</span>
          <span className="text-red-400 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-400" /> Missing Gap
          </span>
        </div>
      </div>
    ),
  },
  {
    title: "Practice Banks",
    tag: "Interview Prep",
    desc: "A tailored list of core questions with clear mock guides, specifically tailored to the target role.",
    span: "col-span-1",
    icon: (
      <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    visual: (
      <div className="mt-4 bg-accent/5 p-4 rounded-xl border border-accent/10 text-xs">
        <p className="text-accent font-semibold mb-1">Technical Question</p>
        <p className="text-primary/90 line-clamp-3 leading-relaxed">
          "Explain how you would optimize database query rendering loops inside server components..."
        </p>
      </div>
    ),
  },
  {
    title: "Priority Gap Auditing",
    tag: "Severity Logs",
    desc: "Categorizes missing skills into High, Medium, and Low priorities so you know what to focus on first.",
    span: "col-span-1",
    icon: (
      <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 9v4"/><path d="M12 17h.01"/><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
      </svg>
    ),
    visual: (
      <div className="mt-4 flex flex-col gap-1.5 text-[11px] font-mono">
        <span className="px-2.5 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/25 flex items-center justify-between">
          <span>Docker Containerization</span>
          <span className="font-bold">High Gap</span>
        </span>
        <span className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/25 flex items-center justify-between">
          <span>Redis Caching</span>
          <span className="font-bold">Medium Gap</span>
        </span>
      </div>
    ),
  },
  {
    title: "Curated Learning",
    tag: "Knowledge Base",
    desc: "Decoupled skill matching enriches identified gaps with pre-verified documentation and video links.",
    span: "col-span-1 md:col-span-2",
    icon: (
      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    visual: (
      <div className="mt-4 flex flex-col sm:flex-row gap-2.5 text-xs">
        <div className="flex-1 p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 flex flex-col justify-between h-20">
          <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold">Docs Link</span>
          <span className="text-emerald-400 font-semibold">Official Next.js Docs</span>
        </div>
        <div className="flex-1 p-3 rounded-xl bg-accent/5 border border-accent/10 flex flex-col justify-between h-20">
          <span className="text-[10px] text-secondary uppercase tracking-wider font-semibold">Video Tutorial</span>
          <span className="text-accent font-semibold">Advanced App Router</span>
        </div>
      </div>
    ),
  },
  {
    title: "10-Day Preparation Roadmap",
    tag: "Structured Learning",
    desc: "A day-by-day learning layout that walks you through closing gaps and building mock answers before your interview.",
    span: "col-span-1 md:col-span-3",
    icon: (
      <svg className="w-5 h-5 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>
      </svg>
    ),
    visual: (
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
        <div className="p-3 bg-surface/40 rounded-xl border border-border/40 flex items-center justify-between text-emerald-400">
          <span>Day 1: Setup Docker</span>
          <span>[Done]</span>
        </div>
        <div className="p-3 bg-surface/40 rounded-xl border border-border/40 flex items-center justify-between text-accent">
          <span>Day 2: Cache Locks</span>
          <span>[Active]</span>
        </div>
        <div className="p-3 bg-surface/40 rounded-xl border border-border/40 flex items-center justify-between text-accent">
          <span>Day 3: OAuth Flows</span>
          <span>[Pending]</span>
        </div>
      </div>
    ),
  },
];

const BentoFeatures = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <span
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
            style={{
              background: "rgba(255, 102, 98, 0.06)",
              border: "1px solid rgba(255, 102, 98, 0.2)",
              color: "var(--color-accent)",
            }}
          >
            Core Capabilities
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-primary mb-4 tracking-tight text-balance">
            Everything to Succeed in Tech Rounds
          </h2>
          <p className="text-sm sm:text-base text-secondary max-w-lg mx-auto leading-relaxed">
            A comprehensive study workbench designed to close tech gaps and align your profile with hiring standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {BENTO_FEATURES.map((feat, i) => (
            <div
              key={i}
              className={`relative rounded-2xl border border-border bg-surface/40 p-6 flex flex-col justify-between overflow-hidden group hover:border-border/80 transition-all duration-300 ${feat.span}`}
            >
              <div>
                <div className="flex items-center justify-between gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center border border-border group-hover:scale-105 transition-transform duration-300">
                    {feat.icon}
                  </div>
                  <span className="text-[9px] font-bold font-mono tracking-widest text-secondary uppercase">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-base font-bold text-primary mb-2">{feat.title}</h3>
                <p className="text-xs text-secondary leading-relaxed mb-4">{feat.desc}</p>
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