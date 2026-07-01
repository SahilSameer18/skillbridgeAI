import React from "react";
import { Link } from "react-router";
import InteractiveSimulator from "./InteractiveSimulator";

const HeroSection = ({ user }) => {
  return (
    <section
      className="relative min-h-[95vh] flex items-center overflow-hidden bg-slate-950 px-4 sm:px-6 lg:px-8"
      style={{
        background: "radial-gradient(circle at 50% -20%, #0a1223 0%, #020617 80%)",
      }}
    >
      {/* Dynamic mesh lines */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 w-full max-w-7xl mx-auto py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Column: Headline and Call-to-Actions */}
          <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start max-w-xl lg:max-w-none">
            
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold mb-8 animate-scale-in"
              style={{
                background: "rgba(6,182,212,0.06)",
                border: "1px solid rgba(6,182,212,0.2)",
                color: "#67e8f9",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Relational Skill Audits · Real-time Alignment
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6 text-white text-balance animate-fade-in-up">
              Align Your Profile for <span className="text-gradient-cyan">Tech Interviews</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed mb-10 max-w-md animate-fade-in-up delay-100">
              Instantly scan your credentials against target descriptions. Map missing skill gaps, practice role-specific technical question banks, and export tailored, ATS-friendly resumes.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto animate-fade-in-up delay-200">
              <Link
                to={user ? "/generate" : "/register"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-200 active:scale-98"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #a855f7)",
                  boxShadow: "0 8px 24px rgba(168,85,247,0.2)",
                }}
              >
                {user ? "Build Analysis Plan" : "Get Started Free"}
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                to={user ? "/dashboard" : "/login"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-slate-300 border border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700 transition-all duration-200"
              >
                {user ? "View Workspace" : "Sign In"}
              </Link>
            </div>

            <p className="mt-5 text-[11px] text-slate-600 font-mono animate-fade-in-up delay-300">
              No credit card required · Analyze in ~30s
            </p>
          </div>

          {/* Right Column: Interactive Test-Drive Workbench */}
          <div className="flex-1 w-full max-w-lg animate-fade-in-up delay-150">
            <InteractiveSimulator user={user} />
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
