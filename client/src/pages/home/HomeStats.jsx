import React, { useRef, useState, useEffect } from "react";

const useCountUp = (target, duration = 1400, start = false) => {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return value;
};

const STATS = [
  {
    value: 12000,
    suffix: "+",
    label: "Profiles Audited",
    sublabel: "Processed through AI pipelines",
    color: "#FF6662",
    icon: (
      <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    format: (v) => (v >= 1000 ? `${(v / 1000).toFixed(0)}K` : v),
  },
  {
    value: 96,
    suffix: ".4%",
    label: "Calibration Precision",
    sublabel: "Target role alignment score",
    color: "#34D399",
    icon: (
      <svg className="w-5 h-5 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    format: (v) => v,
  },
  {
    value: 10,
    suffix: "-Day",
    label: "Execution Roadmap",
    sublabel: "Structured milestone prep",
    color: "#FE9A00",
    icon: (
      <svg className="w-5 h-5 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    ),
    format: (v) => v,
  },
  {
    value: 100,
    suffix: "%",
    label: "ATS Verification",
    sublabel: "Export-ready dossiers",
    color: "#FF6662",
    icon: (
      <svg className="w-5 h-5 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
    format: (v) => v,
  },
];

const StatCard = ({ stat, index, visible }) => {
  const count = useCountUp(stat.value, 1400, visible);
  const displayed = stat.format(count);

  return (
    <div className="studio-card p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1 group">
      {/* Icon Well */}
      <div className="w-12 h-12 rounded-xl bg-[#08080A] border border-white/[0.08] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-inner">
        {stat.icon}
      </div>

      {/* Numerical Value */}
      <div className="flex items-baseline gap-0.5 mb-2">
        <span className="text-3xl sm:text-4xl font-extrabold text-white font-mono tracking-tight">
          {displayed}
        </span>
        <span className="text-xl font-bold font-mono" style={{ color: stat.color }}>
          {stat.suffix}
        </span>
      </div>

      <p className="text-sm font-semibold text-white/90 mb-1 tracking-tight">{stat.label}</p>
      <p className="text-xs text-white/40 font-mono">{stat.sublabel}</p>
    </div>
  );
};

const HomeStats = () => {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="py-20 px-4 sm:px-6 lg:px-8 relative bg-[#08080A] font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <div className="text-center mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/40">
            ENGINEERED FOR SENIOR CANDIDATES & TECH LEADERS
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STATS.map((stat, i) => (
            <StatCard key={stat.label} stat={stat} index={i} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeStats;
