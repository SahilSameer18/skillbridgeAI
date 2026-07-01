import React from "react";

const PERSONAS = [
  {
    title: "Fresh Graduates",
    desc: "Target entry-level benchmarks and identify prerequisite skills to polish your profile.",
    icon: (
      <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2.67 3 6 3s6-1 6-3v-5"/>
      </svg>
    ),
  },
  {
    title: "Career Switchers",
    desc: "Transition roles with a structured matrix of the transferrable skills you have and gaps you need to close.",
    icon: (
      <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m16 3 4 4-4 4"/><path d="M20 7H9a4 4 0 0 0 0 8h1"/>
      </svg>
    ),
  },
  {
    title: "Senior Engineers",
    desc: "Audit advanced capabilities and practice specialized behavioral intent guides.",
    icon: (
      <svg className="w-8 h-8 text-indigo-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="m12 3-1.912 5.886H3.886L8.784 12.5l-1.872 5.764L12 14.73l5.088 3.534-1.872-5.764 4.898-3.614h-6.202L12 3Z"/>
      </svg>
    ),
  },
  {
    title: "International Talents",
    desc: "Align your CV terminology with local market expectations and job matching keywords.",
    icon: (
      <svg className="w-8 h-8 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/>
      </svg>
    ),
  },
];

const AudiencePersonas = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        
        <div className="text-center mb-16">
          <span
            className="inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4"
            style={{
              background: "rgba(6,182,212,0.06)",
              border: "1px solid rgba(6,182,212,0.2)",
              color: "#67e8f9",
            }}
          >
            Audience Match
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            Built for Every Stage of Your Career
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERSONAS.map((p, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-slate-900 bg-[#090f1e]/40 p-6 flex flex-col gap-4 hover:border-slate-800 transition-all duration-300 w-full"
            >
              <div className="w-12 h-12 rounded-xl bg-slate-950 flex items-center justify-center border border-slate-900 group-hover:scale-105 transition-transform duration-300 shrink-0">
                {p.icon}
              </div>
              <div>
                <h4 className="font-bold text-white text-base mb-2">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default AudiencePersonas;
