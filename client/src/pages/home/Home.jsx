import React from "react";
import { useAuth } from "../../hooks/useAuth";
import HeroSection from "./HeroSection";
import InteractiveSimulator from "./InteractiveSimulator";
import HomeStats from "./HomeStats";
import BentoFeatures from "./BentoFeatures";
import ProcessTimeline from "./ProcessTimeline";
import AudiencePersonas from "./AudiencePersonas";

/**
 * Home Component
 * Entry-level landing page for SkillBridge AI.
 * Displays hero content, interactive terminal mockup playground, bento feature grids,
 * timelines, and user personas. Modularized for maximum maintainability.
 */
const Home = () => {
  const { user } = useAuth();

  return (
    <div className="animate-fade-in -mx-4 sm:-mx-6 lg:-mx-8 overflow-x-hidden">
      <HeroSection user={user} />

      {/* Interactive Simulator Playground */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 my-16">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Live Preview Playground
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-primary tracking-tight">
            See How the Engine Analyzes Roles
          </h2>
          <p className="text-secondary text-sm max-w-lg mx-auto mt-2">
            Try a simulated evaluation across frontend, backend, or fullstack benchmarks before uploading your own resume.
          </p>
        </div>
        <InteractiveSimulator user={user} />
      </section>

      <HomeStats />
      <BentoFeatures />
      <ProcessTimeline />
      <AudiencePersonas />
    </div>
  );
};

export default Home;
