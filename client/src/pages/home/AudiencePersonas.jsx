import React, { useState } from "react";
import { Link } from "react-router";

const PERSONAS = [
  {
    title: "Senior & Staff Engineers",
    tagline: "Elevate to high-impact leadership",
    desc: "Benchmark distributed systems capabilities, practice executive behavioral rounds, and calibrate against FAANG / tier-1 expectations.",
    color: "#FF6662",
    tags: ["STAFF LEVEL", "SYSTEM ARCHITECTURE", "OFFER NEGOTIATION"],
    icon: (
      <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m12 3-1.912 5.886H3.886L8.784 12.5l-1.872 5.764L12 14.73l5.088 3.534-1.872-5.764 4.898-3.614h-6.202L12 3Z" />
      </svg>
    ),
  },
  {
    title: "Career Switchers",
    tagline: "Pivot into tech with precision",
    desc: "Transition roles using an objective matrix of transferrable skills and a targeted roadmap to close non-negotiable gaps.",
    color: "#FE9A00",
    tags: ["PIVOT MATRIX", "CORE STACK AUDIT", "ACCELERATED PREP"],
    icon: (
      <svg className="w-6 h-6 text-amber" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m16 3 4 4-4 4" />
        <path d="M20 7H9a4 4 0 0 0 0 8h1" />
      </svg>
    ),
  },
  {
    title: "Emerging Talents & Grads",
    tagline: "Break in with senior polish",
    desc: "Map entry requirements, eliminate resume anti-patterns, and master technical problem explanations that impress hiring managers.",
    color: "#34D399",
    tags: ["ENTRY BENCHMARK", "RESUME POLISH", "FUNDAMENTALS"],
    icon: (
      <svg className="w-6 h-6 text-emerald-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
        <path d="M6 12v5c0 2 2.67 3 6 3s6-1 6-3v-5" />
      </svg>
    ),
  },
  {
    title: "Global Specialists",
    tagline: "Calibrate for international hubs",
    desc: "Align CV terminology with North American & European ATS standards, senior engineering titles, and cultural norms.",
    color: "#FF6662",
    tags: ["GLOBAL ATS", "CROSS-BORDER", "COMPLIANCE"],
    icon: (
      <svg className="w-6 h-6 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        <path d="M2 12h20" />
      </svg>
    ),
  },
];

const AudiencePersonas = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 relative bg-background font-sans">
      <div className="max-w-6xl mx-auto relative">
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary tracking-[-0.035em] mb-4">
            Designed for every stage of <br />
            <span className="text-gradient-coral">your engineering journey</span>
          </h2>
          <p className="text-secondary text-sm sm:text-base max-w-lg mx-auto leading-relaxed font-normal">
            Whether you are preparing for your first tech job or leveling up to senior and staff roles.
          </p>
        </div>

        {/* Persona Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PERSONAS.map((p, i) => {
            const isHovered = hovered === i;
            return (
              <div
                key={p.title}
                className="studio-card rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 group cursor-default shadow-sm border border-border"
                style={{
                  borderTopColor: isHovered ? p.color : undefined,
                  boxShadow: isHovered
                    ? `0 16px 36px -8px ${p.color}22`
                    : undefined,
                }}
                onMouseEnter={() => setHovered(i)}
                onMouseLeave={() => setHovered(null)}
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-border flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300 shadow-sm">
                    {p.icon}
                  </div>
                  <h4 className="font-bold text-primary text-base mb-1 tracking-tight">{p.title}</h4>
                  <p className="type-caption font-mono font-medium mb-3" style={{ color: p.color }}>
                    {p.tagline}
                  </p>
                  <p className="type-body text-secondary leading-relaxed font-normal">{p.desc}</p>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-5 mt-4 border-t border-border">
                  {p.tags.map((tag) => (
                    <span
                      key={tag}
                      className="type-micro px-2 py-0.5 rounded bg-slate-100 border border-border text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AudiencePersonas;
