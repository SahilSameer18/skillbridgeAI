import React, { useState, useEffect } from "react";

/**
 * JobDescriptionInput Component
 * Renders the input section for the target job description.
 * Features a modern, border-glowing text area with character counter.
 * Optimized with local state debouncing and solid backgrounds (no backdrop filter) to maximize typing speed.
 */
const JobDescriptionInput = ({ value, onChange }) => {
  const [localValue, setLocalValue] = useState(value);

  // Sync local state if parent value changes externally
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the parent onChange callback to avoid lagging the form on every keystroke
  useEffect(() => {
    const handler = setTimeout(() => {
      if (localValue !== value) {
        onChange(localValue);
      }
    }, 120); // Fast 120ms debounce

    return () => clearTimeout(handler);
  }, [localValue, onChange, value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onChange(localValue);
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-950/40 p-6 rounded-2xl border border-slate-800/80 transition-all duration-300 hover:border-cyan-500/20">
      {/* Header section with Icon and Title */}
      <div className="flex items-center gap-3 mb-5">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 hover:scale-105"
          style={{
            background: "rgba(6,182,212,0.08)",
            border: "1px solid rgba(6,182,212,0.2)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#06b6d4"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
          </svg>
        </div>
        <div>
          <h2 className="font-semibold text-white text-base tracking-wide">
            Target Job Description
          </h2>
          <p className="text-xs text-cyan-400 font-medium mt-0.5">Required</p>
        </div>
      </div>

      {/* Description Textarea */}
      <textarea
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        onBlur={handleBlur}
        placeholder={`Paste the full job description details here...\ne.g. 'Senior Frontend Engineer at Google. Requires proficiency in React, TypeScript, and architectural principles...'`}
        maxLength={5000}
        className="flex-1 min-h-[300px] w-full rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/25 transition-all duration-200 leading-relaxed border border-slate-700/50 bg-slate-950/50"
      />

      {/* Character Count */}
      <div className="flex justify-between items-center mt-3 text-xs text-slate-500">
        <span>Tailor your resume against these specific guidelines</span>
        <span className={`${localValue.length > 4500 ? 'text-amber-400' : 'text-slate-500'} font-mono`}>
          {localValue.length} / 5000
        </span>
      </div>
    </div>
  );
};

export default JobDescriptionInput;
