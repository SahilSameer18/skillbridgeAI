import React from "react";

const HomeStats = () => {
  return (
    <div className="border-y border-slate-900 bg-slate-950/60 py-8 px-4">
      <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 md:gap-0 md:grid md:grid-cols-4 text-center">
        {[
          {
            num: "12K+",
            label: "Profiles Audited",
            icon: (
              <svg className="w-5 h-5 text-cyan-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            ),
          },
          {
            num: "96.4%",
            label: "Match Scoring Accuracy",
            icon: (
              <svg className="w-5 h-5 text-cyan-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/><path d="m14.83 9.17 4.24-4.24"/><path d="M12 12V2"/>
              </svg>
            ),
          },
          {
            num: "10-Day",
            label: "Bespoke Study Roadmap",
            icon: (
              <svg className="w-5 h-5 text-emerald-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            ),
          },
          {
            num: "100%",
            label: "ATS Compliance Output",
            icon: (
              <svg className="w-5 h-5 text-indigo-400 mb-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            ),
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 px-4 md:border-r border-slate-900 last:border-r-0 w-full sm:w-auto"
          >
            {stat.icon}
            <span className="text-3xl font-extrabold text-white tracking-tight">{stat.num}</span>
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">{stat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeStats;


