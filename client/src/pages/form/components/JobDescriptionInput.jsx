import React, { useState, useEffect, useMemo } from "react";

// Common industry skills to scan for live matches
const COMMON_SKILLS = [
  "React", "TypeScript", "JavaScript", "Python", "Node.js", "Express", "Next.js", 
  "Java", "Spring Boot", "Golang", "Rust", "AWS", "Docker", "Kubernetes", "SQL", 
  "MongoDB", "PostgreSQL", "GraphQL", "Tailwind CSS", "Redux", "CI/CD", 
  "Machine Learning", "System Design", "Microservices", "Git", "Figma", "Agile"
];

/**
 * JobDescriptionInput Component
 * Renders the input section for the target job description.
 */
const JobDescriptionInput = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);
  const [debouncedValue, setDebouncedValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  // Sync local state if parent value changes externally
  useEffect(() => {
    setLocalValue(value);
    setDebouncedValue(value);
  }, [value]);

  // Debounce the parent onChange callback and skill extractor to keep typing fluid
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(localValue);
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 180);

    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);

  const handleBlur = () => {
    setIsFocused(false);
    setDebouncedValue(localValue);
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  // Extract skills dynamically based on debounced content
  const extractedSkills = useMemo(() => {
    if (!debouncedValue.trim()) return [];
    return COMMON_SKILLS.filter(skill => {
      const escapedSkill = skill.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
      const regex = new RegExp(`\\b${escapedSkill}\\b`, 'i');
      return regex.test(debouncedValue);
    });
  }, [debouncedValue]);

  return (
    <div className={`flex flex-col h-full studio-card p-4 sm:p-6 md:p-7 transition-all duration-300 ${
      isFocused ? "border-accent/40 shadow-xs" : ""
    }`}>
      {/* Header section with Icon and Title */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center bg-accent/10 border border-accent/25 shadow-xs"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
            </svg>
          </div>
          <div>
            <h2 className="font-bold text-primary text-base tracking-tight font-display">
              Target Role Description
            </h2>
            <p className="type-micro text-accent mt-0.5">30–4,000 CHARACTERS</p>
          </div>
        </div>

        {/* IDE window dot decoration */}
        <div className="flex gap-1.5 opacity-60">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-slate-300" />
          <span className="w-2.5 h-2.5 rounded-full bg-accent/40" />
        </div>
      </div>

      {/* Editor Pane container */}
      <div className="relative flex-grow flex flex-col mb-3">
        <textarea
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholder={`Paste the full job description details here...\ne.g. 'Senior Frontend Engineer at Google. Requires proficiency in React, TypeScript, and architectural principles...'`}
          maxLength={4000}
          className="studio-well flex-1 min-h-[280px] w-full p-4 text-sm text-primary placeholder:text-muted resize-none focus:outline-none transition-all duration-200 leading-relaxed no-scrollbar"
        />
      </div>

      {/* Live Extracted Skills tags */}
      <div className="mb-4">
        <p className="type-micro text-secondary mb-2 font-semibold">
          Extracted Competencies
        </p>
        <div className="flex flex-wrap gap-1.5 min-h-[32px] p-2 rounded-xl studio-well border border-border">
          {extractedSkills.length > 0 ? (
            extractedSkills.map(skill => (
              <span
                key={skill}
                className="studio-badge-coral text-[10px]"
              >
                {skill}
              </span>
            ))
          ) : (
            <span className="text-[11px] text-muted font-mono italic px-1 self-center">
              Type or paste job description to auto-detect core competencies
            </span>
          )}
        </div>
      </div>

      {/* Character Count & Tip */}
      <div className="flex justify-between items-center text-[11px] text-muted border-t border-border pt-3 font-mono">
        <span>
          {localValue.trim().length > 0 && localValue.trim().length < 30 ? (
            <span className="text-amber-700 font-semibold">
              Min 30 characters required ({30 - localValue.trim().length} more needed)
            </span>
          ) : (
            <span>Tailor your resume against these specific guidelines</span>
          )}
        </span>
        <span
          className={`${
            localValue.length >= 4000
              ? "text-red-600 font-bold"
              : localValue.length > 3600
              ? "text-amber-700 font-semibold"
              : "text-secondary"
          } font-mono`}
        >
          {localValue.length} / 4,000
        </span>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
