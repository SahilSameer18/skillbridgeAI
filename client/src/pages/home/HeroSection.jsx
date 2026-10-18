import React, { useState, useEffect } from "react";
import { Link } from "react-router";

/* Precision Interactive Score Gauge */
const PrecisionGauge = ({ score = 94 }) => {
  const [displayed, setDisplayed] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId;
    const duration = 1200;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayed(Math.round(eased * score));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [score]);

  const circumference = 2 * Math.PI * 48;
  const dashOffset = circumference - (displayed / 100) * circumference;

  return (
    <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
      <svg
        viewBox="0 0 120 120"
        className="w-full h-full -rotate-90"
        role="img"
        aria-label={`Alignment match score: ${displayed}%`}
      >
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="rgba(15, 23, 42, 0.08)"
          strokeWidth="6"
        />
        <circle
          cx="60"
          cy="60"
          r="48"
          fill="none"
          stroke="url(#coralAmberGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          style={{ transition: "stroke-dashoffset 0.15s ease" }}
        />
        <defs>
          <linearGradient id="coralAmberGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#e54d48" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-black text-primary font-mono tracking-tight leading-none">
          {displayed}%
        </span>
        <span className="text-[9px] font-mono uppercase tracking-widest text-secondary mt-1">
          MATCH
        </span>
      </div>
    </div>
  );
};

const HeroSection = ({ user }) => {
  return (
    <section className="relative min-h-[88vh] flex items-center justify-center overflow-hidden bg-background pt-16 pb-24 font-sans">
      {/* Atmospheric Vignette */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[480px] pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 65% 55% at 50% 30%, rgba(229,77,72,0.08) 0%, rgba(217,119,6,0.03) 45%, transparent 75%)",
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">

          {/* Master Architectural Headline */}
          <h1
            className="reveal-up font-extrabold text-primary text-4xl sm:text-6xl lg:text-[4.75rem] leading-[1.08] tracking-[-0.04em] max-w-4xl mx-auto mb-6"
            style={{ animationDelay: "0ms" }}
          >
            Master your next interview with{" "}
            <span className="text-gradient-coral">intelligent preparation.</span>
          </h1>

          {/* Sub-headline */}
          <p
            className="reveal-up text-secondary text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-normal"
            style={{ animationDelay: "90ms" }}
          >
            Compare your resume against any job description to discover skill gaps, practice tailored questions, and follow a clear preparation roadmap.
          </p>

          {/* Dual Tactile CTAs */}
          <div
            className="reveal-up flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 sm:mb-20 w-full max-w-md sm:max-w-none"
            style={{ animationDelay: "180ms" }}
          >
            <Link
              to={user ? "/generate" : "/register"}
              id="hero-cta-primary"
              className="group w-full sm:w-auto studio-btn-primary px-8 py-4 rounded-xl text-base font-bold flex items-center justify-center gap-3 cursor-pointer shadow-lg"
            >
              <span>{user ? "Start New Analysis" : "Analyze Your Resume"}</span>
              <svg className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>

            <Link
              to={user ? "/dashboard" : "/login"}
              id="hero-cta-secondary"
              className="w-full sm:w-auto studio-btn-secondary px-8 py-4 rounded-xl text-base font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <span>{user ? "View Dashboard" : "Sign In"}</span>
            </Link>
          </div>

          {/* Executive Product Centerpiece */}
          <div
            className="reveal-up w-full max-w-5xl mx-auto"
            style={{ animationDelay: "260ms" }}
          >
            <div className="studio-card rounded-2xl md:rounded-3xl shadow-xl overflow-hidden text-left border border-border">
              
              {/* Card Header Bar */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-white border border-border flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M13 10V3L4 14h7v7l9-11h-7z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-primary tracking-tight block">
                      Sample Analysis Report
                    </span>
                    <span className="text-[11px] text-secondary block">
                      Senior Software Engineer · Stripe
                    </span>
                  </div>
                </div>

                <div className="text-xs font-mono text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-md border border-emerald-500/20 font-semibold">
                  Ready
                </div>
              </div>

              {/* Card Body Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-border bg-white">
                
                {/* Column 1: Role Specification */}
                <div className="lg:col-span-3 p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-secondary">Target Role</span>
                    <span className="text-[11px] font-mono text-accent font-semibold">Stripe</span>
                  </div>

                  <div className="studio-well p-3.5 rounded-xl space-y-1">
                    <p className="text-sm font-bold text-primary tracking-tight">Senior Fullstack Engineer</p>
                    <p className="text-xs text-secondary">Infrastructure & Payments</p>
                  </div>

                  <div className="space-y-2 pt-1">
                    <div className="text-xs text-secondary">Key Competencies</div>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        "React & TypeScript",
                        "Distributed Caching",
                        "Node.js APIs",
                        "High-Throughput Systems",
                      ].map((item) => (
                        <span
                          key={item}
                          className="px-2.5 py-1 rounded-md text-xs bg-slate-100 border border-border text-secondary font-medium"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column 2: Interview Question */}
                <div className="lg:col-span-6 p-5 sm:p-6 space-y-4 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-secondary">Tailored Interview Question</span>
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-accent/10 border border-accent/20 text-accent font-semibold">
                      Technical Round
                    </span>
                  </div>

                  <div className="studio-well p-4 rounded-xl border border-border space-y-3">
                    <p className="text-sm font-medium text-primary leading-relaxed">
                      "How would you design a distributed idempotency key cache processing 250k requests per second with zero stale read anomalies?"
                    </p>
                  </div>

                  {/* Evaluator Notes */}
                  <div className="space-y-2 pt-1">
                    <div className="text-xs text-secondary font-medium">What interviewers look for</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-secondary">
                      <div className="studio-well p-2.5 rounded-lg">
                        <span className="text-emerald-600 font-bold mr-1.5">✓</span>
                        <span>Atomic Lua scripts</span>
                      </div>
                      <div className="studio-well p-2.5 rounded-lg">
                        <span className="text-emerald-600 font-bold mr-1.5">✓</span>
                        <span>Quorum partitioning</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3: Skill Match */}
                <div className="lg:col-span-3 p-5 sm:p-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs font-medium text-secondary">Skill Match</span>
                      <span className="text-[11px] font-mono text-emerald-600 font-semibold">High Match</span>
                    </div>

                    <div className="flex justify-center my-2">
                      <PrecisionGauge score={94} />
                    </div>

                    <div className="space-y-2 pt-3">
                      {[
                        { label: "Architecture", val: "96%" },
                        { label: "Concurrency", val: "91%" },
                        { label: "Data Modeling", val: "88%" },
                      ].map((bar) => (
                        <div key={bar.label} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-secondary">{bar.label}</span>
                            <span className="text-primary font-mono font-semibold">{bar.val}</span>
                          </div>
                          <div className="h-1 rounded-full bg-slate-200 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-accent to-amber"
                              style={{ width: bar.val }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="text-center text-xs font-mono text-amber bg-amber/10 py-1.5 rounded-lg border border-amber/20 font-bold">
                      10-DAY ROADMAP INCLUDED
                    </div>
                  </div>
                </div>

              </div>

              {/* Card Footer Strip */}
              <div className="px-6 py-3.5 bg-slate-50 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-secondary">
                <div className="flex items-center gap-4">
                  <span>ATS-Optimized</span>
                  <span>•</span>
                  <span>Fast Generation</span>
                </div>
                <div className="text-secondary font-mono text-[11px]">
                  PDF Export & Interactive Workspace
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
